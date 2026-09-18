/**
 * VIORA - Donor Authentication & Dev-Mode OTP Controller
 * Real random 6-digit generation + server/db storage + visible on-screen banner
 */

let otpAttempts = 0;
let lockoutTimer = null;
let resendTimer = null;
let expiryCheckTimer = null;
let currentPhone = "";
let currentOtpExpiry = null;
let pendingDonorData = null;

document.addEventListener('DOMContentLoaded', () => {
  initKeralaDropdowns('donorDistrict', 'donorLocality');
  setupOtpInputs();
  setupForms();
});

function setupForms() {
  const signupForm = document.getElementById('donorSignupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('donorName').value.trim();
      const rawPhone = document.getElementById('donorPhone').value.trim();
      const bloodGroup = document.getElementById('donorBloodGroup').value;
      const district = document.getElementById('donorDistrict').value;
      const locality = document.getElementById('donorLocality').value;
      const lastDonation = document.getElementById('lastDonationDate').value || null;

      if (!name || !rawPhone || !bloodGroup || !district || !locality) {
        showFeedback('Please fill in all required fields.', 'danger');
        return;
      }

      currentPhone = formatE164Phone(rawPhone);
      pendingDonorData = {
        name,
        phone: currentPhone,
        blood_group: bloodGroup,
        district,
        locality,
        last_donation_date: lastDonation,
        available: true,
        trust_score: 85
      };

      const submitBtn = signupForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Generating Verification Code...';

      try {
        const res = await sendDonorOtp(currentPhone);
        currentOtpExpiry = res.expires_at ? new Date(res.expires_at).getTime() : Date.now() + 10 * 60 * 1000;
        openOtpModal(currentPhone, res.code);
      } catch (err) {
        console.error(err);
        showFeedback(err.message || 'Could not generate verification code.', 'danger');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Register & Verify Phone';
      }
    });
  }

  const resendBtn = document.getElementById('resendOtpBtn');
  if (resendBtn) {
    resendBtn.addEventListener('click', async () => {
      if (resendBtn.disabled || lockoutTimer) return;
      startResendCooldown();
      showOtpMessage('Generating new verification code...', 'info');

      try {
        // Resend invalidates previous code immediately
        const res = await sendDonorOtp(currentPhone);
        currentOtpExpiry = res.expires_at ? new Date(res.expires_at).getTime() : Date.now() + 10 * 60 * 1000;
        
        // Update the visible Dev Mode banner
        renderDevOtpBanner(res.code);
        clearOtpInputs();
        showOtpMessage('New code generated. Enter the 6 digits above.', 'info');
      } catch (err) {
        showOtpMessage(err.message || 'Failed to generate new code.', 'danger');
      }
    });
  }
}

/**
 * Configure the 6 individual OTP input boxes
 */
function setupOtpInputs() {
  const inputs = document.querySelectorAll('.otp-digit');
  inputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
      const val = e.target.value.replace(/[^0-9]/g, '');
      e.target.value = val ? val[0] : '';

      if (val && index < inputs.length - 1) {
        inputs[index + 1].focus();
      }

      const code = getEnteredOtp();
      if (code.length === 6) {
        submitOtp(code);
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !input.value && index > 0) {
        inputs[index - 1].focus();
      }
    });

    input.addEventListener('paste', (e) => {
      e.preventDefault();
      const pasted = (e.clipboardData || window.clipboardData).getData('text').trim();
      const digits = pasted.replace(/[^0-9]/g, '').slice(0, 6);
      if (digits) {
        digits.split('').forEach((d, i) => {
          if (inputs[i]) inputs[i].value = d;
        });
        if (digits.length < 6 && inputs[digits.length]) {
          inputs[digits.length].focus();
        } else if (digits.length === 6) {
          submitOtp(digits);
        }
      }
    });
  });
}

function getEnteredOtp() {
  const inputs = document.querySelectorAll('.otp-digit');
  return Array.from(inputs).map(i => i.value).join('');
}

function clearOtpInputs() {
  const inputs = document.querySelectorAll('.otp-digit');
  inputs.forEach(i => i.value = '');
  if (inputs[0] && !lockoutTimer) inputs[0].focus();
}

function shakeOtpInputs() {
  const container = document.getElementById('otpInputsContainer');
  if (container) {
    container.classList.add('shake');
    setTimeout(() => {
      container.classList.remove('shake');
      clearOtpInputs();
    }, 400);
  }
}

/**
 * Render prominent Dev Mode On-Screen Banner
 */
function renderDevOtpBanner(otpCode) {
  const bannerContainer = document.getElementById('devOtpBannerContainer');
  if (!bannerContainer) return;

  bannerContainer.innerHTML = `
    <div class="dev-otp-banner">
      <div class="dev-otp-title">DEV MODE — Your OTP is:</div>
      <div class="dev-otp-code">${otpCode}</div>
      <div class="dev-otp-disclosure">⚠️ SMS delivery mocked for Hackathon Demo &bull; 10-minute expiry</div>
    </div>
  `;
}

function openOtpModal(phone, generatedCode) {
  const modal = document.getElementById('otpModal');
  const phoneDisplay = document.getElementById('modalPhoneDisplay');
  if (phoneDisplay) phoneDisplay.textContent = phone;

  // Render the Dev-Mode OTP Banner
  renderDevOtpBanner(generatedCode);
  showOtpMessage('Enter the 6-digit verification code.', 'info');

  if (modal) {
    modal.classList.add('active');
    startResendCooldown();
    startExpiryChecker();
    setTimeout(() => {
      const firstInput = document.querySelector('.otp-digit');
      if (firstInput) firstInput.focus();
    }, 150);
  }
}

function closeOtpModal() {
  const modal = document.getElementById('otpModal');
  if (modal) modal.classList.remove('active');
  if (expiryCheckTimer) clearInterval(expiryCheckTimer);
}

/**
 * Periodically check 10-minute expiry
 */
function startExpiryChecker() {
  if (expiryCheckTimer) clearInterval(expiryCheckTimer);
  expiryCheckTimer = setInterval(() => {
    if (currentOtpExpiry && Date.now() > currentOtpExpiry) {
      showOtpMessage("This code has expired — tap Resend to get a new one", 'danger');
    }
  }, 5000);
}

/**
 * Handle OTP Submission & Verification
 */
async function submitOtp(code) {
  if (lockoutTimer) return;

  // Check client-side expiry first
  if (currentOtpExpiry && Date.now() > currentOtpExpiry) {
    shakeOtpInputs();
    showOtpMessage("This code has expired — tap Resend to get a new one", 'danger');
    return;
  }

  const otpStatus = document.getElementById('otpStatusMsg');
  if (otpStatus) {
    otpStatus.textContent = 'Verifying code...';
    otpStatus.className = 'form-hint';
  }

  try {
    const res = await verifyDonorOtp(currentPhone, code);

    if (res.success) {
      if (expiryCheckTimer) clearInterval(expiryCheckTimer);
      if (otpStatus) {
        otpStatus.textContent = '✓ Phone verified successfully!';
        otpStatus.className = 'form-hint badge-success';
      }

      if (pendingDonorData) {
        pendingDonorData.phone_verified = true;
        const saved = await registerDonor(pendingDonorData);
        sessionStorage.setItem('viora_current_donor', JSON.stringify(saved));
      }

      setTimeout(() => {
        window.location.href = 'donor.html';
      }, 700);
    }
  } catch (err) {
    otpAttempts++;
    console.warn("OTP Verification failure:", err);

    shakeOtpInputs();

    if (err.error_type === 'EXPIRED') {
      showOtpMessage("This code has expired — tap Resend to get a new one", 'danger');
    } else if (otpAttempts >= window.VIORA_CONFIG.MAX_OTP_ATTEMPTS || err.error_type === 'LOCKED_OUT') {
      lockoutUser();
    } else {
      // Gentle UX: never blame the user
      showOtpMessage("That code didn't match. Try again.", 'danger');
    }
  }
}

/**
 * 3 wrong attempts -> 60s input lockdown
 */
function lockoutUser() {
  let secondsRemaining = window.VIORA_CONFIG.OTP_LOCKOUT_SECONDS || 60;
  const inputs = document.querySelectorAll('.otp-digit');
  inputs.forEach(i => i.disabled = true);

  showOtpMessage(`Too many attempts. Please wait ${secondsRemaining}s before trying again.`, 'danger');

  if (lockoutTimer) clearInterval(lockoutTimer);
  lockoutTimer = setInterval(() => {
    secondsRemaining--;
    if (secondsRemaining <= 0) {
      clearInterval(lockoutTimer);
      lockoutTimer = null;
      otpAttempts = 0;
      inputs.forEach(i => i.disabled = false);
      showOtpMessage("You can now enter your verification code again.", 'info');
      clearOtpInputs();
    } else {
      showOtpMessage(`Too many attempts. Please wait ${secondsRemaining}s before trying again.`, 'danger');
    }
  }, 1000);
}

/**
 * Resend 30s Cooldown
 */
function startResendCooldown() {
  const resendBtn = document.getElementById('resendOtpBtn');
  if (!resendBtn) return;

  let cooldown = window.VIORA_CONFIG.OTP_COOLDOWN_SECONDS || 30;
  resendBtn.disabled = true;
  resendBtn.textContent = `Resend Code (${cooldown}s)`;

  if (resendTimer) clearInterval(resendTimer);
  resendTimer = setInterval(() => {
    cooldown--;
    if (cooldown <= 0) {
      clearInterval(resendTimer);
      resendTimer = null;
      resendBtn.disabled = false;
      resendBtn.textContent = 'Resend Code';
    } else {
      resendBtn.textContent = `Resend Code (${cooldown}s)`;
    }
  }, 1000);
}

function showOtpMessage(msg, type) {
  const el = document.getElementById('otpStatusMsg');
  if (!el) return;
  el.textContent = msg;
  el.className = `form-hint ${type === 'danger' ? 'badge-urgent' : (type === 'success' ? 'badge-success' : 'badge-navy')}`;
  el.style.display = 'block';
  el.style.padding = '8px 12px';
  el.style.marginTop = '12px';
}

function showFeedback(msg, type) {
  const el = document.getElementById('signupFeedback');
  if (!el) return;
  el.textContent = msg;
  el.className = `badge badge-${type}`;
  el.style.display = 'block';
  el.style.padding = '10px 16px';
  el.style.marginBottom = '16px';
}
