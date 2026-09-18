/**
 * VIORA - Donor Dashboard & Realtime Match Response Controller
 */

let currentDonor = null;
let activeIncomingMatch = null;
let realtimeChannel = null;

document.addEventListener('DOMContentLoaded', () => {
  loadDonorProfile();
  setupDashboardControls();
  setupRealtimeMatchListener();
});

function loadDonorProfile() {
  const saved = sessionStorage.getItem('viora_current_donor');
  if (saved) {
    try {
      currentDonor = JSON.parse(saved);
    } catch (e) {
      console.warn("Could not parse saved donor session", e);
    }
  }

  // If not logged in, load a default Kerala demo donor
  if (!currentDonor) {
    currentDonor = {
      id: 'd1',
      name: 'Arjun Nair',
      phone: '+919847000001',
      phone_verified: true,
      blood_group: 'O+',
      locality: 'Kakkanad',
      district: 'Ernakulam',
      last_donation_date: '2026-05-15',
      available: true,
      trust_score: 94
    };
    sessionStorage.setItem('viora_current_donor', JSON.stringify(currentDonor));
  }

  renderDonorData();
}

function renderDonorData() {
  if (!currentDonor) return;

  // Header & Info
  const nameEl = document.getElementById('donorDisplayName');
  const bloodEl = document.getElementById('donorBloodDisplay');
  const locEl = document.getElementById('donorLocationDisplay');
  const trustEl = document.getElementById('donorTrustScore');
  const toggle = document.getElementById('availabilityToggle');
  const availRing = document.getElementById('availRing');
  const availStatusText = document.getElementById('availStatusText');

  if (nameEl) nameEl.textContent = currentDonor.name;
  if (bloodEl) bloodEl.textContent = currentDonor.blood_group;
  if (locEl) locEl.textContent = `${currentDonor.locality}, ${currentDonor.district}`;
  if (trustEl) trustEl.textContent = `${currentDonor.trust_score || 85}/100`;

  // Availability Switch & Ring
  const isAvailable = currentDonor.available !== false;
  if (toggle) toggle.checked = isAvailable;
  if (availRing) {
    availRing.className = `avail-ring ${isAvailable ? 'available' : 'unavailable'}`;
  }
  if (availStatusText) {
    availStatusText.textContent = isAvailable ? 'Available for Urgent Requests' : 'Paused / Unavailable';
    availStatusText.style.color = isAvailable ? '#10B981' : '#6B7280';
  }

  // Cooldown calculation (90 days rule)
  calculateCooldown(currentDonor.last_donation_date);
}

function calculateCooldown(lastDonationDateStr) {
  const daysText = document.getElementById('cooldownDaysText');
  const subtitle = document.getElementById('cooldownSubtitle');
  const circle = document.getElementById('cooldownCircle');

  const COOLDOWN_DAYS = 90;
  const circumference = 2 * Math.PI * 25; // radius 25

  if (!lastDonationDateStr) {
    if (daysText) daysText.textContent = 'Eligible';
    if (subtitle) subtitle.textContent = 'Ready to donate';
    if (circle) circle.style.strokeDashoffset = '0';
    return;
  }

  const lastDate = new Date(lastDonationDateStr);
  const diffDays = Math.floor((Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays >= COOLDOWN_DAYS) {
    if (daysText) daysText.textContent = 'Eligible';
    if (subtitle) subtitle.textContent = `Last donated ${diffDays} days ago`;
    if (circle) circle.style.strokeDashoffset = '0';
  } else {
    const daysLeft = COOLDOWN_DAYS - diffDays;
    if (daysText) daysText.textContent = `${daysLeft}d`;
    if (subtitle) subtitle.textContent = `${daysLeft} days until eligible (90-day safe cooldown)`;

    const progressFraction = diffDays / COOLDOWN_DAYS;
    const offset = circumference * (1 - progressFraction);
    if (circle) circle.style.strokeDashoffset = `${offset}`;
  }
}

function setupDashboardControls() {
  const toggle = document.getElementById('availabilityToggle');
  if (toggle) {
    toggle.addEventListener('change', async () => {
      const isAvailable = toggle.checked;
      currentDonor.available = isAvailable;
      sessionStorage.setItem('viora_current_donor', JSON.stringify(currentDonor));
      renderDonorData();

      const client = getSupabase();
      if (client && currentDonor.id) {
        try {
          await client
            .from('donors')
            .update({ available: isAvailable })
            .eq('id', currentDonor.id);
        } catch (e) {
          console.warn("Could not sync availability to Supabase:", e);
        }
      }
    });
  }

  // Simulate incoming match button for instant testing
  const demoTestBtn = document.getElementById('demoTriggerMatchBtn');
  if (demoTestBtn) {
    demoTestBtn.addEventListener('click', () => {
      triggerIncomingMatchAlert({
        id: 'match-demo-' + Date.now(),
        hospital_name: 'Aster Medcity, Cheranalloor',
        locality: currentDonor.locality || 'Kakkanad',
        blood_group: currentDonor.blood_group || 'O+',
        urgency: 'urgent',
        distance_approx: '2.4 km'
      });
    });
  }

  // Accept button
  const acceptBtn = document.getElementById('acceptMatchBtn');
  if (acceptBtn) {
    acceptBtn.addEventListener('click', async () => {
      if (!activeIncomingMatch) return;
      acceptBtn.disabled = true;
      acceptBtn.textContent = 'Accepting...';

      try {
        await respondToMatch(activeIncomingMatch.id, 'accepted');
        showMatchAcceptedConfirmation();
      } catch (err) {
        console.error(err);
        alert('Could not accept match: ' + err.message);
      } finally {
        acceptBtn.disabled = false;
        acceptBtn.textContent = 'I Can Help';
      }
    });
  }

  // Decline button
  const declineBtn = document.getElementById('declineMatchBtn');
  if (declineBtn) {
    declineBtn.addEventListener('click', async () => {
      if (!activeIncomingMatch) return;
      try {
        await respondToMatch(activeIncomingMatch.id, 'declined');
      } catch (err) {
        console.warn(err);
      }
      closeIncomingMatchModal();
    });
  }
}

/**
 * Realtime Supabase Subscription for Incoming Matches
 */
function setupRealtimeMatchListener() {
  const client = getSupabase();
  if (client && currentDonor) {
    try {
      realtimeChannel = client
        .channel('donor_matches_' + currentDonor.id)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'matches',
          filter: `donor_id=eq.${currentDonor.id}`
        }, async (payload) => {
          console.log('Realtime incoming match:', payload);
          // Fetch request details
          const { data: req } = await client
            .from('requests')
            .select('*')
            .eq('id', payload.new.request_id)
            .single();

          if (req) {
            triggerIncomingMatchAlert({
              id: payload.new.id,
              hospital_name: req.hospital_name,
              locality: req.locality,
              blood_group: req.blood_group_needed,
              urgency: req.urgency,
              distance_approx: 'Within ' + req.locality
            });
          }
        })
        .subscribe();
    } catch (e) {
      console.warn("Realtime subscription failed:", e);
    }
  }

  // Also listen for demo events in same browser window
  window.addEventListener('viora_match_created', (e) => {
    const matches = e.detail;
    if (!matches || !currentDonor) return;
    const myMatch = matches.find(m => m.donor_id === currentDonor.id || m.donor_id === 'd1');
    if (myMatch) {
      triggerIncomingMatchAlert({
        id: myMatch.id,
        hospital_name: 'Aster Medcity, Cheranalloor',
        locality: currentDonor.locality || 'Kakkanad',
        blood_group: currentDonor.blood_group || 'O+',
        urgency: 'urgent',
        distance_approx: '2.1 km away'
      });
    }
  });
}

/**
 * Display Full-screen Incoming Match Prompt
 */
function triggerIncomingMatchAlert(matchInfo) {
  activeIncomingMatch = matchInfo;

  const modal = document.getElementById('incomingMatchModal');
  const hospEl = document.getElementById('matchHospitalName');
  const bloodEl = document.getElementById('matchBloodNeeded');
  const locEl = document.getElementById('matchLocality');
  const urgencyEl = document.getElementById('matchUrgencyBadge');

  if (hospEl) hospEl.textContent = matchInfo.hospital_name;
  if (bloodEl) bloodEl.textContent = matchInfo.blood_group;
  if (locEl) locEl.textContent = matchInfo.locality + (matchInfo.distance_approx ? ` (${matchInfo.distance_approx})` : '');
  
  if (urgencyEl) {
    urgencyEl.textContent = matchInfo.urgency === 'urgent' ? '🚨 EMERGENCY URGENT' : 'NORMAL PRIORITY';
    urgencyEl.className = matchInfo.urgency === 'urgent' ? 'badge badge-urgent' : 'badge badge-navy';
  }

  if (modal) modal.classList.add('active');
}

function closeIncomingMatchModal() {
  const modal = document.getElementById('incomingMatchModal');
  if (modal) modal.classList.remove('active');
  activeIncomingMatch = null;
}

function showMatchAcceptedConfirmation() {
  const modalContent = document.getElementById('matchModalCard');
  if (!modalContent) return;

  modalContent.innerHTML = `
    <div style="font-size: 3rem; margin-bottom: 12px;">❤️</div>
    <h2 style="color: var(--secondary); margin-bottom: 8px;">Thank You, Hero!</h2>
    <p style="margin-bottom: 20px;">You have agreed to donate blood. The hospital and requester have been notified.</p>
    <div class="card" style="background: var(--bg-page); border: 1.5px solid #10B981; margin-bottom: 24px;">
      <h4 style="color: #10B981; margin-bottom: 6px;">Hospital Dispatch Ready</h4>
      <p style="font-size: 0.95rem; font-weight: 600; color: var(--secondary);">${activeIncomingMatch?.hospital_name || 'Hospital'}</p>
      <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">Requester Contact: <strong>+91 98479 99888</strong></p>
    </div>
    <button class="btn btn-primary btn-block" onclick="window.location.reload()">Back to Dashboard</button>
  `;
}
