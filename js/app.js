/* ==========================================================================
   VIORA - MASTER CONTROLLER
   Privacy-First Blood Donor Matching for Kerala
   ========================================================================== */

(function() {
  class VioraApp {
    constructor() {
      this.currentMode = 'split'; // 'split', 'requester', 'donor', 'signup'
      this.selectedBloodReq = 'O+';
      this.selectedBloodDonor = 'O+';
      this.selectedUrgency = 'urgent';
      this.activeRequest = null;
      this.activeMatch = null;
      this.activeDonor = {
        name: 'Arjun Nair',
        phone: '+919847011001',
        blood_group: 'O+',
        district: 'Ernakulam',
        locality: 'Kakkanad',
        available: true,
        trust_score: 96,
        last_donation_date: '2026-05-28' // 112 days ago
      };
      this.otpAttempts = 0;
      this.otpLockoutTimer = null;
      this.otpLockoutSeconds = 0;
      this.generatedOtp = null;
      this.radarTimerInterval = null;
      this.radarSecondsLeft = 300;
      this.signupStep = 1;
      this.signupData = {
        name: '',
        phone: '',
        blood_group: 'O+',
        district: 'Ernakulam',
        locality: 'Kakkanad',
        last_donation_date: ''
      };
      this.supabaseSubscription = null;
    }

    init() {
      console.log('🩸 [Viora] Initializing Kerala Medical-Trust Blood Matching Network...');
      this.initKeralaDropdowns();
      this.setupEventListeners();
      this.updateDonorDashboardUI();
      this.initAudioContext();
      this.listenToSupabaseRealtime();
      this.setMode('split');
    }

    // Audio Chime for Medical Alerts (Web Audio API)
    initAudioContext() {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioContext();
      } catch (e) {
        console.warn('AudioContext not supported');
      }
    }

    playChime(type = 'alert') {
      if (!this.audioCtx) return;
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      if (type === 'alert') {
        // High-priority medical urgent alert chime
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
      } else if (type === 'unlock') {
        // Satisfying soft success unlock chime
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.12); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.24); // G5
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.6);
      }
    }

    // Navigation & View Modes
    setMode(mode) {
      this.currentMode = mode;
      document.querySelectorAll('.nav-tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-mode') === mode);
      });

      const splitView = document.getElementById('splitView');
      const requesterView = document.getElementById('requesterStandaloneView');
      const donorView = document.getElementById('donorStandaloneView');
      const signupView = document.getElementById('signupStandaloneView');

      if (splitView) splitView.style.display = (mode === 'split') ? 'grid' : 'none';
      if (requesterView) requesterView.style.display = (mode === 'requester') ? 'block' : 'none';
      if (donorView) donorView.style.display = (mode === 'donor') ? 'block' : 'none';
      if (signupView) signupView.style.display = (mode === 'signup') ? 'block' : 'none';
    }

    // Kerala Dropdown Population
    initKeralaDropdowns() {
      if (typeof KERALA_DATA === 'undefined') return;
      
      const populate = (districtSelectId, localitySelectId, hospitalSelectId) => {
        const dSelect = document.getElementById(districtSelectId);
        const lSelect = document.getElementById(localitySelectId);
        const hSelect = hospitalSelectId ? document.getElementById(hospitalSelectId) : null;
        if (!dSelect) return;

        dSelect.innerHTML = '<option value="" disabled>Select District</option>';
        Object.keys(KERALA_DATA).sort().forEach(dist => {
          const opt = document.createElement('option');
          opt.value = dist;
          opt.textContent = dist;
          if (dist === 'Ernakulam') opt.selected = true;
          dSelect.appendChild(opt);
        });

        const updateLocHosp = (distName) => {
          const data = KERALA_DATA[distName] || KERALA_DATA['Ernakulam'];
          if (lSelect) {
            lSelect.innerHTML = '<option value="" disabled>Select Locality</option>';
            data.localities.forEach(loc => {
              const opt = document.createElement('option');
              opt.value = loc;
              opt.textContent = loc;
              if (loc === 'Kakkanad') opt.selected = true;
              lSelect.appendChild(opt);
            });
            lSelect.disabled = false;
          }
          if (hSelect) {
            hSelect.innerHTML = '<option value="" disabled>Select Hospital</option>';
            data.hospitals.forEach(hosp => {
              const opt = document.createElement('option');
              opt.value = hosp;
              opt.textContent = hosp;
              if (hosp.includes('Aster Medcity')) opt.selected = true;
              hSelect.appendChild(opt);
            });
            hSelect.disabled = false;
          }
        };

        dSelect.addEventListener('change', (e) => updateLocHosp(e.target.value));
        updateLocHosp('Ernakulam');
      };

      populate('reqDistrict', 'reqLocality', 'reqHospital');
      populate('signupDistrict', 'signupLocality', null);
    }

    setupEventListeners() {
      // Nav Tabs
      document.querySelectorAll('.nav-tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.setMode(btn.getAttribute('data-mode'));
        });
      });

      // Blood Selector Pills (Requester)
      document.querySelectorAll('.blood-pill-req').forEach(pill => {
        pill.addEventListener('click', () => {
          document.querySelectorAll('.blood-pill-req').forEach(p => p.classList.remove('selected', 'active'));
          pill.classList.add('selected', 'active');
          this.selectedBloodReq = pill.getAttribute('data-bg');
        });
      });

      // Blood Selector Pills (Donor Signup)
      document.querySelectorAll('.blood-pill-signup').forEach(pill => {
        pill.addEventListener('click', () => {
          document.querySelectorAll('.blood-pill-signup').forEach(p => p.classList.remove('selected', 'active'));
          pill.classList.add('selected', 'active');
          this.signupData.blood_group = pill.getAttribute('data-bg');
        });
      });

      // Urgency Cards
      const cardNormal = document.getElementById('urgencyCardNormal');
      const cardUrgent = document.getElementById('urgencyCardUrgent');
      if (cardNormal && cardUrgent) {
        cardNormal.addEventListener('click', () => {
          cardNormal.classList.add('active-normal');
          cardUrgent.classList.remove('active-urgent');
          this.selectedUrgency = 'normal';
        });
        cardUrgent.addEventListener('click', () => {
          cardUrgent.classList.add('active-urgent');
          cardNormal.classList.remove('active-normal');
          this.selectedUrgency = 'urgent';
        });
      }

      // Requester Form Submit
      const reqForm = document.getElementById('bloodRequestForm');
      if (reqForm) {
        reqForm.addEventListener('submit', (e) => {
          e.preventDefault();
          this.handleEmergencyRequestSubmit();
        });
      }

      // Donor Availability Toggle
      const availToggle = document.getElementById('availabilityToggle');
      if (availToggle) {
        availToggle.addEventListener('change', (e) => {
          this.activeDonor.available = e.target.checked;
          this.updateDonorDashboardUI();
          this.updateDonorAvailabilityInDB(e.target.checked);
        });
      }

      // Trust Score Badge Tap -> Modal
      const trustScoreCard = document.getElementById('trustScoreCard');
      if (trustScoreCard) {
        trustScoreCard.addEventListener('click', () => this.openTrustScoreModal());
      }

      // Manual Widen Search Wave Button
      const widenBtn = document.getElementById('manualWidenBtn');
      if (widenBtn) {
        widenBtn.addEventListener('click', () => this.widenSearchWave());
      }

      // Donor Response Buttons (Alert Modal)
      const acceptBtn = document.getElementById('acceptMatchBtn');
      const declineBtn = document.getElementById('declineMatchBtn');
      if (acceptBtn) {
        acceptBtn.addEventListener('click', () => this.handleDonorAcceptMatch());
      }
      if (declineBtn) {
        declineBtn.addEventListener('click', () => this.handleDonorDeclineMatch());
      }

      // Demo Simulator Buttons
      const demoTriggerBtn = document.getElementById('demoTriggerMatchBtn');
      if (demoTriggerBtn) {
        demoTriggerBtn.addEventListener('click', () => {
          this.showIncomingMatchAlert({
            blood_group_needed: 'O+',
            urgency: 'urgent',
            locality: 'Kakkanad',
            hospital_name: 'Aster Medcity, Cheranalloor',
            distance: '2.4 km'
          });
        });
      }

      // Setup Donor Signup Wizard Flow & OTP Auto-Advance
      this.setupSignupWizard();
    }

    // ====================================================================
    // SCREEN 1: DONOR SIGNUP WIZARD & 6-DIGIT DEV OTP ENGINE
    // ====================================================================
    setupSignupWizard() {
      const nextBtn = document.getElementById('signupNextBtn');
      const prevBtn = document.getElementById('signupPrevBtn');

      if (nextBtn) {
        nextBtn.addEventListener('click', () => this.handleSignupStepAdvance());
      }
      if (prevBtn) {
        prevBtn.addEventListener('click', () => this.handleSignupStepBack());
      }

      // Auto-advancing 6-digit OTP Inputs
      const otpInputs = document.querySelectorAll('.otp-box');
      otpInputs.forEach((input, idx) => {
        input.addEventListener('input', (e) => {
          const val = e.target.value.replace(/[^0-9]/g, '');
          e.target.value = val;
          if (val && idx < otpInputs.length - 1) {
            otpInputs[idx + 1].focus();
          }
          // Auto-submit on 6th digit
          const fullCode = Array.from(otpInputs).map(i => i.value).join('');
          if (fullCode.length === 6) {
            this.verifySubmittedOtp(fullCode);
          }
        });

        input.addEventListener('keydown', (e) => {
          if (e.key === 'Backspace' && !input.value && idx > 0) {
            otpInputs[idx - 1].focus();
          }
        });
      });

      const resendBtn = document.getElementById('resendOtpBtn');
      if (resendBtn) {
        resendBtn.addEventListener('click', () => this.generateAndDisplayOtp());
      }
    }

    handleSignupStepAdvance() {
      if (this.signupStep === 1) {
        const name = document.getElementById('signupName').value.trim();
        const phone = document.getElementById('signupPhone').value.trim();
        if (!name || !phone) {
          alert('Please enter your full name and mobile number.');
          return;
        }
        this.signupData.name = name;
        this.signupData.phone = phone;
        this.goToSignupStep(2);
      } else if (this.signupStep === 2) {
        this.goToSignupStep(3);
      } else if (this.signupStep === 3) {
        this.signupData.district = document.getElementById('signupDistrict').value;
        this.signupData.locality = document.getElementById('signupLocality').value;
        this.goToSignupStep(4);
        this.generateAndDisplayOtp();
      }
    }

    handleSignupStepBack() {
      if (this.signupStep > 1) {
        this.goToSignupStep(this.signupStep - 1);
      }
    }

    goToSignupStep(step) {
      this.signupStep = step;
      for (let s = 1; s <= 4; s++) {
        const el = document.getElementById(`signupStep${s}`);
        const dot = document.getElementById(`stepDot${s}`);
        if (el) el.style.display = (s === step) ? 'block' : 'none';
        if (dot) {
          dot.classList.toggle('active', s === step);
          dot.classList.toggle('completed', s < step);
        }
      }
      const prevBtn = document.getElementById('signupPrevBtn');
      const nextBtn = document.getElementById('signupNextBtn');
      if (prevBtn) prevBtn.style.display = (step > 1) ? 'inline-flex' : 'none';
      if (nextBtn) nextBtn.style.display = (step === 4) ? 'none' : 'inline-flex';
    }

    async generateAndDisplayOtp() {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      this.generatedOtp = code;
      this.otpAttempts = 0;

      const bannerCode = document.getElementById('devOtpCodeDisplay');
      if (bannerCode) bannerCode.textContent = code;

      const statusMsg = document.getElementById('otpStatusMsg');
      if (statusMsg) {
        statusMsg.textContent = 'Enter the 6-digit code shown above';
        statusMsg.style.color = 'var(--text-muted)';
      }

      // Clear inputs
      document.querySelectorAll('.otp-box').forEach(i => {
        i.value = '';
        i.disabled = false;
        i.classList.remove('shake-error');
      });
      const firstInput = document.querySelector('.otp-box');
      if (firstInput) firstInput.focus();

      // Save to Supabase if connected
      const client = typeof getSupabase === 'function' ? getSupabase() : null;
      if (client) {
        try {
          await client.rpc('save_otp', { p_phone: this.signupData.phone, p_code: code });
        } catch (e) {
          console.log('OTP saved in local memory');
        }
      }
    }

    async verifySubmittedOtp(code) {
      const otpGrid = document.querySelector('.otp-box-grid');
      const statusMsg = document.getElementById('otpStatusMsg');

      if (this.otpLockoutSeconds > 0) return;

      if (code === this.generatedOtp) {
        // SUCCESS: Satisfying unlock micro-interaction!
        this.playChime('unlock');
        if (statusMsg) {
          statusMsg.textContent = '✓ Verified successfully! Creating donor profile...';
          statusMsg.style.color = 'var(--success)';
        }

        // Trigger unlock animation modal
        this.showUnlockSuccessModal(this.signupData.name, () => {
          this.activeDonor = {
            name: this.signupData.name,
            phone: this.signupData.phone,
            blood_group: this.signupData.blood_group,
            district: this.signupData.district,
            locality: this.signupData.locality,
            available: true,
            trust_score: 85,
            last_donation_date: document.getElementById('signupLastDonation').value || null
          };
          this.updateDonorDashboardUI();
          this.setMode('donor');
        });

      } else {
        // FAILED: Shake-and-clear animation
        this.otpAttempts++;
        if (otpGrid) {
          otpGrid.classList.add('shake-error');
          setTimeout(() => otpGrid.classList.remove('shake-error'), 450);
        }
        document.querySelectorAll('.otp-box').forEach(i => i.value = '');
        const first = document.querySelector('.otp-box');
        if (first) first.focus();

        if (this.otpAttempts >= 3) {
          // 60-Second Lockout
          this.startOtpLockout();
        } else {
          if (statusMsg) {
            statusMsg.textContent = `✕ Incorrect code. ${3 - this.otpAttempts} attempt(s) remaining.`;
            statusMsg.style.color = 'var(--primary)';
          }
        }
      }
    }

    startOtpLockout() {
      this.otpLockoutSeconds = 60;
      const statusMsg = document.getElementById('otpStatusMsg');
      document.querySelectorAll('.otp-box').forEach(i => i.disabled = true);

      this.otpLockoutTimer = setInterval(() => {
        this.otpLockoutSeconds--;
        if (statusMsg) {
          statusMsg.textContent = `⏳ 3 wrong attempts. Locked out for ${this.otpLockoutSeconds}s...`;
          statusMsg.style.color = 'var(--primary)';
        }
        if (this.otpLockoutSeconds <= 0) {
          clearInterval(this.otpLockoutTimer);
          document.querySelectorAll('.otp-box').forEach(i => i.disabled = false);
          this.generateAndDisplayOtp();
        }
      }, 1000);
    }

    showUnlockSuccessModal(donorName, callback) {
      const modal = document.getElementById('unlockAnimationModal');
      const text = document.getElementById('unlockModalDonorName');
      if (text) text.textContent = donorName;
      if (modal) {
        modal.classList.add('active');
        setTimeout(() => {
          modal.classList.remove('active');
          if (callback) callback();
        }, 2200);
      } else {
        if (callback) callback();
      }
    }

    // ====================================================================
    // SCREEN 2: DONOR HOME & HERO AVAILABILITY DASHBOARD
    // ====================================================================
    updateDonorDashboardUI() {
      const donor = this.activeDonor;
      const ring = document.getElementById('availCircleBadge');
      const bloodDisplay = document.getElementById('donorBloodDisplay');
      const statusTag = document.getElementById('availStatusTag');
      const toggle = document.getElementById('availabilityToggle');
      const toggleLabel = document.getElementById('toggleStatusLabel');
      const nameDisplay = document.getElementById('donorNameDisplay');
      const locDisplay = document.getElementById('donorLocDisplay');
      const trustVal = document.getElementById('donorTrustScoreVal');

      if (bloodDisplay) bloodDisplay.textContent = donor.blood_group;
      if (nameDisplay) nameDisplay.textContent = donor.name;
      if (locDisplay) locDisplay.textContent = `${donor.locality}, ${donor.district}`;
      if (trustVal) trustVal.textContent = donor.trust_score;

      if (ring) {
        ring.classList.toggle('available', donor.available);
        ring.classList.toggle('resting', !donor.available);
      }

      if (statusTag) {
        statusTag.textContent = donor.available ? 'Available' : 'Resting';
      }

      if (toggle) toggle.checked = donor.available;

      if (toggleLabel) {
        toggleLabel.textContent = donor.available ? 'Available for Urgent Requests' : 'Resting (Standby)';
        toggleLabel.style.color = donor.available ? 'var(--success)' : 'var(--text-muted)';
      }

      // 90-Day Safe Cooldown Ring Calculation
      this.updateCooldownRing(donor.last_donation_date);
    }

    updateCooldownRing(lastDonationDateStr) {
      const circle = document.getElementById('cooldownFgCircle');
      const daysText = document.getElementById('cooldownDaysText');
      const subtitle = document.getElementById('cooldownSubtitle');
      if (!circle || !daysText) return;

      const radius = 25;
      const circumference = 2 * Math.PI * radius; // ~157.08
      circle.style.strokeDasharray = circumference;

      if (!lastDonationDateStr) {
        circle.style.strokeDashoffset = 0;
        circle.style.stroke = 'var(--success)';
        daysText.textContent = 'Eligible';
        daysText.style.fontSize = '12px';
        if (subtitle) subtitle.textContent = 'Ready to donate immediately (0 cooldown)';
        return;
      }

      const lastDate = new Date(lastDonationDateStr);
      const today = new Date();
      const diffTime = today - lastDate;
      const daysElapsed = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const daysRemaining = Math.max(0, 90 - daysElapsed);

      if (daysRemaining === 0) {
        circle.style.strokeDashoffset = 0;
        circle.style.stroke = 'var(--success)';
        daysText.textContent = 'Ready';
        daysText.style.fontSize = '12px';
        if (subtitle) subtitle.textContent = `Safe to donate (${daysElapsed} days since last donation)`;
      } else {
        const progress = (90 - daysRemaining) / 90;
        circle.style.strokeDashoffset = circumference * (1 - progress);
        circle.style.stroke = 'var(--primary)';
        daysText.textContent = `${daysRemaining}d`;
        daysText.style.fontSize = '14px';
        if (subtitle) subtitle.textContent = `${daysRemaining} days remaining in 90-day recovery cycle`;
      }
    }

    openTrustScoreModal() {
      const modal = document.getElementById('trustScoreModal');
      if (modal) modal.classList.add('active');
    }

    closeTrustScoreModal() {
      const modal = document.getElementById('trustScoreModal');
      if (modal) modal.classList.remove('active');
    }

    async updateDonorAvailabilityInDB(isAvailable) {
      const client = typeof getSupabase === 'function' ? getSupabase() : null;
      if (client) {
        try {
          await client.from('donors').update({ available: isAvailable }).eq('phone', this.activeDonor.phone);
        } catch (e) {
          console.log('Availability updated in session');
        }
      }
    }

    // ====================================================================
    // SCREEN 3: INCOMING MATCH NOTIFICATION MODAL (DONOR SIDE)
    // ====================================================================
    showIncomingMatchAlert(matchData) {
      this.activeMatch = matchData;
      this.playChime('alert');

      const modal = document.getElementById('incomingMatchModalOverlay');
      const bloodNeeded = document.getElementById('matchBloodNeeded');
      const locality = document.getElementById('matchLocality');
      const hospital = document.getElementById('matchHospitalName');
      const urgencyTag = document.getElementById('matchUrgencyBadge');

      if (bloodNeeded) bloodNeeded.textContent = matchData.blood_group_needed || 'O+';
      if (locality) locality.textContent = `${matchData.locality} (${matchData.distance || '2.1 km'})`;
      if (hospital) hospital.textContent = matchData.hospital_name || 'Aster Medcity, Cheranalloor';

      if (urgencyTag) {
        urgencyTag.textContent = matchData.urgency === 'urgent' ? '🚨 EMERGENCY URGENT' : 'STANDARD MATCH';
        urgencyTag.className = `match-urgency-pill ${matchData.urgency || 'urgent'}`;
      }

      if (modal) modal.classList.add('active');
    }

    handleDonorAcceptMatch() {
      const modal = document.getElementById('incomingMatchModalOverlay');
      if (modal) modal.classList.remove('active');

      this.playChime('unlock');

      // Update match status in DB
      const client = typeof getSupabase === 'function' ? getSupabase() : null;
      if (client && this.activeMatch?.id) {
        client.from('matches').update({ status: 'accepted', responded_at: new Date() }).eq('id', this.activeMatch.id);
      }

      // Notify Requester Radar & Reveal Contact
      this.revealContactDetails({
        donor_name: this.activeDonor.name,
        donor_phone: this.activeDonor.phone,
        donor_blood_group: this.activeDonor.blood_group,
        donor_locality: this.activeDonor.locality,
        requester_name: this.activeRequest?.requester_name || 'Patient Emergency Desk',
        requester_phone: this.activeRequest?.requester_phone || '+91 98479 99888',
        hospital_name: this.activeMatch?.hospital_name || 'Aster Medcity, Cheranalloor'
      });
    }

    handleDonorDeclineMatch() {
      const modal = document.getElementById('incomingMatchModalOverlay');
      if (modal) modal.classList.remove('active');

      const client = typeof getSupabase === 'function' ? getSupabase() : null;
      if (client && this.activeMatch?.id) {
        client.from('matches').update({ status: 'declined', responded_at: new Date() }).eq('id', this.activeMatch.id);
      }
    }

    // ====================================================================
    // SCREEN 4 & 5: REQUESTER FORM & LIVE ESCALATION RADAR MATCHING
    // ====================================================================
    async handleEmergencyRequestSubmit() {
      const name = document.getElementById('reqName').value.trim();
      const phone = document.getElementById('reqPhone').value.trim();
      const district = document.getElementById('reqDistrict').value;
      const locality = document.getElementById('reqLocality').value;
      const hospital = document.getElementById('reqHospital').value;

      this.activeRequest = {
        requester_name: name,
        requester_phone: phone,
        blood_group_needed: this.selectedBloodReq,
        district: district,
        locality: locality,
        hospital_name: hospital,
        urgency: this.selectedUrgency,
        current_wave: 1
      };

      // Hide form, Show Live Radar
      const formCard = document.getElementById('requestFormCard');
      const radarSection = document.getElementById('liveRadarSection');
      if (formCard) formCard.style.display = 'none';
      if (radarSection) radarSection.style.display = 'block';

      this.updateRadarDisplay(1);
      this.startRadarCountdownTimer();

      // Query Masked Donors from Supabase / Seed Data
      await this.fetchAndRenderMaskedDonors(1);

      // If in Split View, simulate incoming broadcast to Donor Hub!
      if (this.selectedBloodReq === this.activeDonor.blood_group && this.activeDonor.available) {
        setTimeout(() => {
          this.showIncomingMatchAlert({
            blood_group_needed: this.selectedBloodReq,
            locality: locality,
            hospital_name: hospital,
            urgency: this.selectedUrgency,
            distance: '2.4 km'
          });
        }, 1200);
      }
    }

    updateRadarDisplay(waveNumber) {
      const ring1 = document.getElementById('waveRing1');
      const ring2 = document.getElementById('waveRing2');
      const ring3 = document.getElementById('waveRing3');

      const step1 = document.getElementById('waveStepBadge1');
      const step2 = document.getElementById('waveStepBadge2');
      const step3 = document.getElementById('waveStepBadge3');

      const title = document.getElementById('waveStatusTitle');
      const desc = document.getElementById('waveDescription');

      if (ring1) ring1.className = 'concentric-ring ring-1' + (waveNumber >= 1 ? ' active-cherry' : '');
      if (ring2) ring2.className = 'concentric-ring ring-2' + (waveNumber >= 2 ? ' active-cherry' : '');
      if (ring3) ring3.className = 'concentric-ring ring-3' + (waveNumber >= 3 ? ' active-cherry' : '');

      if (step1) step1.className = 'wave-step-pill' + (waveNumber === 1 ? ' active' : ' passed');
      if (step2) step2.className = 'wave-step-pill' + (waveNumber === 2 ? ' active' : (waveNumber > 2 ? ' passed' : ''));
      if (step3) step3.className = 'wave-step-pill' + (waveNumber === 3 ? ' active' : '');

      if (waveNumber === 1) {
        if (title) title.textContent = 'Wave 1: Alerting 3 Nearest Local Donors';
        if (desc) desc.textContent = `Restricted to ${this.activeRequest.locality} to prevent donor broadcast fatigue.`;
      } else if (waveNumber === 2) {
        if (title) title.textContent = 'Wave 2: Widened to Adjacent Localities';
        if (desc) desc.textContent = `Broadcasting to high-trust verified donors across adjacent ${this.activeRequest.district} zones.`;
      } else {
        if (title) title.textContent = 'Wave 3: District-Wide Emergency Escalation';
        if (desc) desc.textContent = `All eligible verified donors across ${this.activeRequest.district} notified.`;
      }
    }

    startRadarCountdownTimer() {
      this.radarSecondsLeft = 300; // 5 mins
      if (this.radarTimerInterval) clearInterval(this.radarTimerInterval);

      const countdownText = document.getElementById('waveCountdownDisplay');
      this.radarTimerInterval = setInterval(() => {
        this.radarSecondsLeft--;
        const mins = Math.floor(this.radarSecondsLeft / 60);
        const secs = this.radarSecondsLeft % 60;
        const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        if (countdownText) {
          countdownText.textContent = `Auto-widening to Wave 2 in ${timeStr}`;
        }
        if (this.radarSecondsLeft <= 0) {
          this.widenSearchWave();
        }
      }, 1000);
    }

    widenSearchWave() {
      if (!this.activeRequest) return;
      this.activeRequest.current_wave = Math.min(3, (this.activeRequest.current_wave || 1) + 1);
      this.updateRadarDisplay(this.activeRequest.current_wave);
      this.fetchAndRenderMaskedDonors(this.activeRequest.current_wave);
    }

    async fetchAndRenderMaskedDonors(wave) {
      const container = document.getElementById('maskedDonorsList');
      if (!container) return;

      container.innerHTML = '<div style="padding: 12px; color: var(--text-muted); font-size: 13px;">Searching database-level masked donor view...</div>';

      const client = typeof getSupabase === 'function' ? getSupabase() : null;
      let donors = [];

      if (client) {
        try {
          // Zero-leakage query from public_donor_view (structurally no name/phone)
          const { data, error } = await client
            .from('public_donor_view')
            .select('*')
            .eq('blood_group', this.activeRequest.blood_group_needed)
            .eq('available', true)
            .order('trust_score', { ascending: false })
            .limit(wave === 1 ? 3 : 6);

          if (!error && data && data.length > 0) {
            donors = data;
          }
        } catch (e) {
          console.warn('Using local masked donor dataset');
        }
      }

      if (donors.length === 0) {
        // Fallback seed masked donors
        donors = [
          { id: 'd1', trust_score: 96, locality: 'Kakkanad', last_donation_date: '2026-05-28', distance: '1.8 km' },
          { id: 'd2', trust_score: 92, locality: 'Kakkanad', last_donation_date: '2026-04-12', distance: '2.4 km' },
          { id: 'd3', trust_score: 89, locality: 'Edappally', last_donation_date: '2026-06-02', distance: '4.1 km' }
        ];
      }

      container.innerHTML = '';
      donors.forEach((d, idx) => {
        const lastDays = d.last_donation_date ? Math.floor((new Date() - new Date(d.last_donation_date)) / (1000*60*60*24)) : 110;
        const card = document.createElement('div');
        card.className = 'masked-donor-card';
        card.innerHTML = `
          <div class="masked-avatar-box">👤</div>
          <div class="masked-donor-title">Donor #${idx + 1}</div>
          <div class="masked-donor-meta">
            <div>📍 ${d.distance || (1.5 + idx * 0.8).toFixed(1) + ' km'} · ${d.locality || 'Locality'}</div>
            <div>⏱️ Donated ${lastDays} days ago</div>
            <div style="font-weight: 700; color: var(--secondary); margin-top: 4px;">⭐ Trust Score: ${d.trust_score || 90}</div>
          </div>
        `;
        container.appendChild(card);
      });
    }

    // ====================================================================
    // SCREEN 6: MATCH ACCEPTED & CONTACT REVEAL SCREEN
    // ====================================================================
    revealContactDetails(details) {
      if (this.radarTimerInterval) clearInterval(this.radarTimerInterval);

      const radarCard = document.getElementById('radarDisplayCard');
      const revealContainer = document.getElementById('matchRevealedContainer');

      if (radarCard) radarCard.style.display = 'none';
      if (revealContainer) {
        revealContainer.style.display = 'block';
        revealContainer.innerHTML = `
          <div class="contact-reveal-card screen-transition">
            <div class="unlock-animation-wrapper unlock-spring">
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                <path class="checkmark-svg-path" d="M10 23L18 31L34 13" stroke="var(--success)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>

            <span class="badge-pill badge-success" style="margin-bottom: 12px;">✓ Emergency Match Confirmed</span>
            <h2 style="color: var(--secondary); margin-bottom: 4px;">Contact Revealed</h2>
            <p style="font-size: 0.9rem; color: var(--text-muted); max-width: 440px; margin: 0 auto 20px;">
              Privacy shield safely unlocked. Both parties have verified access to coordinate immediate transport.
            </p>

            <div class="revealed-contact-box">
              <div class="revealed-contact-row">
                <span style="color: var(--text-muted); font-size: 14px;">Matched Hero Donor</span>
                <strong style="color: var(--secondary); font-size: 16px;">${details.donor_name} (${details.donor_blood_group})</strong>
              </div>
              <div class="revealed-contact-row">
                <span style="color: var(--text-muted); font-size: 14px;">Donor Location</span>
                <span style="font-weight: 600;">${details.donor_locality}</span>
              </div>
              <div class="revealed-contact-row">
                <span style="color: var(--text-muted); font-size: 14px;">Hospital Destination</span>
                <strong style="color: var(--primary);">${details.hospital_name}</strong>
              </div>
            </div>

            <div style="display: flex; gap: 14px; justify-content: center; flex-wrap: wrap;">
              <a href="tel:${details.donor_phone}" class="btn btn-primary" style="padding: 14px 32px; font-size: 16px;">
                📞 Call Donor (${details.donor_phone})
              </a>
              <button onclick="window.location.reload()" class="btn btn-outline-navy">
                Start New Request
              </button>
            </div>
          </div>
        `;
      }
    }

    // Supabase Realtime Listener
    listenToSupabaseRealtime() {
      const client = typeof getSupabase === 'function' ? getSupabase() : null;
      if (!client) return;

      try {
        const channel = client.channel('viora-live-matches');
        channel.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'requests' }, (payload) => {
          console.log('Realtime Request payload:', payload);
          if (payload.new && payload.new.blood_group_needed === this.activeDonor.blood_group && this.activeDonor.available) {
            this.showIncomingMatchAlert(payload.new);
          }
        });

        channel.on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'matches' }, (payload) => {
          console.log('Realtime Match payload:', payload);
          if (payload.new && payload.new.status === 'accepted') {
            this.revealContactDetails({
              donor_name: this.activeDonor.name,
              donor_phone: this.activeDonor.phone,
              donor_blood_group: this.activeDonor.blood_group,
              donor_locality: this.activeDonor.locality,
              requester_name: 'Patient Emergency Desk',
              requester_phone: '+91 98479 99888',
              hospital_name: 'Aster Medcity, Cheranalloor'
            });
          }
        });
        channel.subscribe();
      } catch (e) {
        console.warn('Realtime subscription fallback active');
      }
    }
  }

  window.VioraApp = new VioraApp();
  document.addEventListener('DOMContentLoaded', () => window.VioraApp.init());
})();
