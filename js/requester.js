/**
 * VIORA - Requester & Live Escalation Radar Controller
 */

let activeRequest = null;
let currentWave = 1;
let waveTimer = null;
let secondsUntilNextWave = 300; // 5 minutes
let matchedDonorContact = null;
let realtimeChannel = null;

document.addEventListener('DOMContentLoaded', () => {
  initKeralaDropdowns('reqDistrict', 'reqLocality', 'reqHospital');
  setupRequestForm();
  setupRadarControls();
});

function setupRequestForm() {
  const form = document.getElementById('bloodRequestForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('reqName').value.trim();
    const phone = document.getElementById('reqPhone').value.trim();
    const bloodGroup = document.getElementById('reqBloodGroup').value;
    const district = document.getElementById('reqDistrict').value;
    const locality = document.getElementById('reqLocality').value;
    const hospital = document.getElementById('reqHospital').value;
    const urgency = document.querySelector('input[name="reqUrgency"]:checked')?.value || 'normal';

    if (!name || !phone || !bloodGroup || !district || !locality || !hospital) {
      alert('Please fill in all request details.');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Initiating Wave 1 Dispatch...';

    try {
      const createdRequest = await createBloodRequest({
        requester_name: name,
        requester_phone: phone,
        blood_group_needed: bloodGroup,
        district: district,
        locality: locality,
        hospital_name: hospital,
        urgency: urgency
      });

      activeRequest = createdRequest;
      startLiveRadarMatching();
    } catch (err) {
      console.error(err);
      alert('Could not initiate request: ' + err.message);
      submitBtn.disabled = false;
      submitBtn.textContent = 'Find Donors Now';
    }
  });
}

function startLiveRadarMatching() {
  // Hide Form, Show Radar
  document.getElementById('requestFormCard').style.display = 'none';
  const radarSection = document.getElementById('liveRadarSection');
  radarSection.style.display = 'block';

  // Populate Request Summary in Radar
  document.getElementById('radarBloodBadge').textContent = activeRequest.blood_group_needed;
  document.getElementById('radarLocationText').textContent = `${activeRequest.hospital_name}, ${activeRequest.locality}`;
  
  const urgencyTag = document.getElementById('radarUrgencyTag');
  if (urgencyTag) {
    urgencyTag.textContent = activeRequest.urgency === 'urgent' ? 'EMERGENCY URGENT' : 'NORMAL';
    urgencyTag.className = activeRequest.urgency === 'urgent' ? 'badge badge-urgent' : 'badge badge-navy';
  }

  // Execute Wave 1
  executeWave(1);
  setupRealtimeMatchListener();
}

async function executeWave(waveNum) {
  currentWave = waveNum;
  updateWaveUI(waveNum);

  const statusText = document.getElementById('waveStatusTitle');
  const waveDescription = document.getElementById('waveDescription');
  const maskedListContainer = document.getElementById('maskedDonorsList');

  if (waveNum === 1) {
    statusText.textContent = `Wave 1: Alerting Nearest Local Donors`;
    waveDescription.textContent = `Scanning registered eligible donors strictly within ${activeRequest.locality}...`;
  } else if (waveNum === 2) {
    statusText.textContent = `Wave 2: Widening to Adjacent Localities`;
    waveDescription.textContent = `No response yet in locality. Widening search radius to ${activeRequest.district}...`;
  } else {
    statusText.textContent = `Wave 3: Full District Emergency Escalation`;
    waveDescription.textContent = `Alerting all verified ${activeRequest.blood_group_needed} donors across ${activeRequest.district}...`;
  }

  maskedListContainer.innerHTML = '<div style="text-align: center; padding: 20px; color: var(--text-light);">Scanning database...</div>';

  try {
    // Strict Privacy: Only queries masked public view
    const eligibleDonors = await fetchEligibleDonors(
      activeRequest.id,
      activeRequest.blood_group_needed,
      activeRequest.district,
      activeRequest.locality,
      waveNum
    );

    renderMaskedDonors(eligibleDonors);

    // Dispatch match requests
    if (eligibleDonors.length > 0) {
      const donorIds = eligibleDonors.map(d => d.donor_id || d.id);
      await dispatchWaveMatches(activeRequest.id, donorIds, waveNum);
    }
  } catch (err) {
    console.error("Wave execution error:", err);
    maskedListContainer.innerHTML = '<div style="color: var(--primary); padding: 12px;">Error retrieving donors. Retrying...</div>';
  }

  // Reset countdown
  startWaveCountdown();
}

function renderMaskedDonors(donors) {
  const container = document.getElementById('maskedDonorsList');
  if (!container) return;

  if (!donors || donors.length === 0) {
    container.innerHTML = `
      <div class="card" style="text-align: center; padding: 24px; background: var(--bg-page);">
        <p>No available donors found in this radius right now.</p>
        <button class="btn btn-primary" style="margin-top: 12px;" onclick="widenSearchNow()">Widen Search Radius Immediately</button>
      </div>
    `;
    return;
  }

  container.innerHTML = '';
  donors.forEach((donor, idx) => {
    const daysAgo = donor.days_since_donation !== null ? `${donor.days_since_donation} days ago` : 'First-time donor';
    const card = document.createElement('div');
    card.className = 'masked-donor-card';
    card.innerHTML = `
      <div class="masked-donor-left">
        <div class="donor-avatar-placeholder">#${idx + 1}</div>
        <div>
          <h4 style="font-size: 1rem; color: var(--secondary);">Donor #${idx + 1} · <span style="color: var(--primary); font-weight: 700;">${donor.blood_group}</span></h4>
          <div class="masked-donor-meta">
            📍 ${donor.locality}, ${donor.district} &nbsp;•&nbsp; 🩸 Donated ${daysAgo}
          </div>
        </div>
      </div>
      <div style="text-align: right;">
        <span class="badge badge-success">Trust Score: ${donor.trust_score || 85}</span>
        <div style="font-size: 0.75rem; color: var(--text-light); margin-top: 4px;">Alert Dispatched</div>
      </div>
    `;
    container.appendChild(card);
  });
}

function updateWaveUI(waveNum) {
  // Update radar concentric rings
  for (let i = 1; i <= 3; i++) {
    const ring = document.getElementById(`waveRing${i}`);
    const badge = document.getElementById(`waveStepBadge${i}`);
    if (ring) {
      if (i <= waveNum) {
        ring.classList.add('active');
      } else {
        ring.classList.remove('active');
      }
    }
    if (badge) {
      if (i < waveNum) {
        badge.className = 'wave-badge-step completed';
        badge.innerHTML = `✓ Wave ${i}`;
      } else if (i === waveNum) {
        badge.className = 'wave-badge-step active';
        badge.innerHTML = `● Wave ${i}`;
      } else {
        badge.className = 'wave-badge-step';
        badge.innerHTML = `○ Wave ${i}`;
      }
    }
  }
}

function startWaveCountdown() {
  if (waveTimer) clearInterval(waveTimer);

  if (currentWave >= 3) {
    const countdownEl = document.getElementById('waveCountdownDisplay');
    if (countdownEl) countdownEl.textContent = 'Maximum escalation radius reached';
    return;
  }

  secondsUntilNextWave = window.VIORA_CONFIG.WAVE_INTERVAL_SECONDS || 300;
  updateCountdownDisplay();

  waveTimer = setInterval(() => {
    secondsUntilNextWave--;
    updateCountdownDisplay();

    if (secondsUntilNextWave <= 0) {
      clearInterval(waveTimer);
      if (currentWave < 3) {
        executeWave(currentWave + 1);
      }
    }
  }, 1000);
}

function updateCountdownDisplay() {
  const countdownEl = document.getElementById('waveCountdownDisplay');
  if (!countdownEl) return;

  const mins = Math.floor(secondsUntilNextWave / 60);
  const secs = secondsUntilNextWave % 60;
  const formatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  countdownEl.textContent = `Auto-widening to Wave ${currentWave + 1} in ${formatted}`;
}

function setupRadarControls() {
  const widenBtn = document.getElementById('manualWidenBtn');
  if (widenBtn) {
    widenBtn.addEventListener('click', () => {
      widenSearchNow();
    });
  }
}

function widenSearchNow() {
  if (currentWave < 3) {
    if (waveTimer) clearInterval(waveTimer);
    executeWave(currentWave + 1);
  } else {
    alert('Already broadcasting at the maximum district-wide wave.');
  }
}

/**
 * Setup Realtime Listener for Donor Acceptance
 */
function setupRealtimeMatchListener() {
  const client = getSupabase();
  if (client && activeRequest) {
    try {
      realtimeChannel = client
        .channel('request_matches_' + activeRequest.id)
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'matches',
          filter: `request_id=eq.${activeRequest.id}`
        }, async (payload) => {
          if (payload.new && payload.new.status === 'accepted') {
            handleDonorAccepted(payload.new.id);
          }
        })
        .subscribe();
    } catch (e) {
      console.warn("Realtime subscription failed:", e);
    }
  }

  // Also listen for demo events in same tab/browser
  window.addEventListener('viora_match_updated', (e) => {
    const match = e.detail;
    if (match && match.status === 'accepted') {
      handleDonorAccepted(match.id);
    }
  });
}

/**
 * Trigger Contact Reveal when Match is Accepted
 */
async function handleDonorAccepted(matchId) {
  if (waveTimer) clearInterval(waveTimer);

  const radarDisplay = document.getElementById('radarDisplayCard');
  const revealedContainer = document.getElementById('matchRevealedContainer');

  try {
    const revealedData = await revealContact(matchId);
    if (!revealedData.success) {
      console.warn(revealedData.error);
      return;
    }

    const donor = revealedData.donor;
    radarDisplay.style.display = 'none';
    revealedContainer.style.display = 'block';

    revealedContainer.innerHTML = `
      <div class="contact-revealed-card">
        <div style="font-size: 3.5rem; margin-bottom: 8px;">🎉</div>
        <span class="badge badge-success" style="font-size: 0.95rem; padding: 6px 18px; margin-bottom: 12px;">MATCH ACCEPTED!</span>
        <h2 style="color: var(--secondary); margin-top: 8px;">A Verified Donor is On the Way!</h2>
        <p style="margin-top: 6px;">Privacy lock has been unlocked for this accepted match.</p>

        <div style="background: var(--bg-page); border-radius: 16px; padding: 20px; margin: 20px 0; text-align: left;">
          <h3 style="color: var(--primary); margin-bottom: 12px;">Verified Donor Details</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div>
              <div style="font-size: 0.8rem; color: var(--text-light);">Donor Name</div>
              <div style="font-size: 1.1rem; font-weight: 700; color: var(--secondary);">${donor.name}</div>
            </div>
            <div>
              <div style="font-size: 0.8rem; color: var(--text-light);">Blood Group</div>
              <div style="font-size: 1.1rem; font-weight: 700; color: var(--primary);">${donor.blood_group}</div>
            </div>
            <div>
              <div style="font-size: 0.8rem; color: var(--text-light);">Locality</div>
              <div style="font-size: 1rem; font-weight: 600; color: var(--secondary);">${donor.locality}, ${donor.district}</div>
            </div>
            <div>
              <div style="font-size: 0.8rem; color: var(--text-light);">Trust Score</div>
              <div style="font-size: 1rem; font-weight: 600; color: #10B981;">${donor.trust_score}/100 ⭐</div>
            </div>
          </div>

          <div style="margin-top: 20px; text-align: center;">
            <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 6px;">Direct Phone Contact:</div>
            <a href="tel:${donor.phone}" class="contact-phone-badge" style="text-decoration: none;">
              📞 ${donor.phone}
            </a>
          </div>
        </div>

        <div style="display: flex; gap: 12px; justify-content: center;">
          <a href="tel:${donor.phone}" class="btn btn-primary" style="flex: 1;">Call Donor Directly</a>
          <button class="btn btn-outline" style="flex: 1;" onclick="window.location.reload()">New Request</button>
        </div>
      </div>
    `;
  } catch (err) {
    console.error("Reveal contact error:", err);
  }
}
