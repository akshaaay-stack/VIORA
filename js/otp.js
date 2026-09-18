/**
 * VIORA - OTP Verification Flow Controller
 * Implements banking-grade UX:
 * 1. 6 individual digit input boxes with auto-advance & paste
 * 2. Auto-submit on 6th digit
 * 3. Wrong OTP: Shake animation, red outline for 1 sec, gentle message
 * 4. 3-attempt lockout with 60s countdown
 * 5. 10-minute code expiry & 30s resend timer
 */

class VioraOTP {
  constructor(options = {}) {
    this.containerId = options.containerId || "otp-container";
    this.phoneNumber = options.phoneNumber || "";
    this.onSuccess = options.onSuccess || (() => {});
    this.onBack = options.onBack || (() => {});
    
    this.expectedCode = (window.VIORA_CONFIG && window.VIORA_CONFIG.DEV_MODE_OTP) || "742918";
    this.attempts = 0;
    this.maxAttempts = 3;
    this.lockedUntil = 0;
    this.expiresAt = Date.now() + 10 * 60 * 1000; // 10 mins
    this.resendAvailableAt = Date.now() + 30 * 1000; // 30s
    this.timerInterval = null;
  }

  render() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    const maskedPhone = this.phoneNumber 
      ? `+91 ${this.phoneNumber.slice(0, 2)}XXXXX ${this.phoneNumber.slice(-3)}`
      : "+91 98XXXXX 210";

    container.innerHTML = `
      <div class="viora-card">
        <div class="dev-banner" id="otp-dev-banner">
          Demo Mode: Verification OTP is <strong>${this.expectedCode}</strong>
        </div>

        <div style="margin-top: 16px; margin-bottom: 20px;">
          <h2 class="section-title">Verify Mobile Number</h2>
          <p class="section-subtitle" style="margin-bottom: 8px;">
            Code sent to <strong>${maskedPhone}</strong>
            <button id="btn-edit-phone" style="background:none;border:none;color:var(--primary-cherry);cursor:pointer;font-weight:600;margin-left:6px;">Edit</button>
          </p>
        </div>

        <div class="otp-inputs-row" id="otp-boxes-row">
          <input type="text" maxlength="1" class="otp-box" inputmode="numeric" autocomplete="one-time-code" data-index="0" autofocus>
          <input type="text" maxlength="1" class="otp-box" inputmode="numeric" data-index="1">
          <input type="text" maxlength="1" class="otp-box" inputmode="numeric" data-index="2">
          <input type="text" maxlength="1" class="otp-box" inputmode="numeric" data-index="3">
          <input type="text" maxlength="1" class="otp-box" inputmode="numeric" data-index="4">
          <input type="text" maxlength="1" class="otp-box" inputmode="numeric" data-index="5">
        </div>

        <div id="otp-error-msg" style="color:var(--primary-cherry);text-align:center;font-size:14px;min-height:22px;font-weight:600;margin-bottom:12px;"></div>

        <div class="otp-meta-text">
          <span id="otp-timer-label">Resend code in </span>
          <span class="otp-timer" id="otp-countdown">0:30</span>
          <a href="javascript:void(0)" class="resend-link disabled" id="btn-resend-otp" style="display:none;">Resend OTP</a>
        </div>
      </div>
    `;

    this.bindEvents();
    this.startCountdown();
  }

  bindEvents() {
    const boxes = document.querySelectorAll(".otp-box");
    const editBtn = document.getElementById("btn-edit-phone");
    const resendBtn = document.getElementById("btn-resend-otp");

    if (editBtn) {
      editBtn.addEventListener("click", () => this.onBack());
    }

    if (resendBtn) {
      resendBtn.addEventListener("click", () => this.handleResend());
    }

    boxes.forEach((box, index) => {
      box.addEventListener("input", (e) => {
        const val = e.target.value.replace(/\D/g, "");
        e.target.value = val ? val[0] : "";

        if (val && index < 5) {
          boxes[index + 1].focus();
        }

        this.checkAutoSubmit();
      });

      box.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && !e.target.value && index > 0) {
          boxes[index - 1].focus();
        }
      });

      box.addEventListener("paste", (e) => {
        e.preventDefault();
        const pasteData = (e.clipboardData || window.clipboardData).getData("text").replace(/\D/g, "");
        if (!pasteData) return;

        for (let i = 0; i < 6 && i < pasteData.length; i++) {
          boxes[i].value = pasteData[i];
        }

        const nextFocus = Math.min(pasteData.length, 5);
        boxes[nextFocus].focus();
        this.checkAutoSubmit();
      });
    });

    if (boxes[0]) boxes[0].focus();
  }

  checkAutoSubmit() {
    const boxes = document.querySelectorAll(".otp-box");
    const code = Array.from(boxes).map(b => b.value).join("");
    if (code.length === 6) {
      this.verify(code);
    }
  }

  verify(enteredCode) {
    const now = Date.now();
    const errorDiv = document.getElementById("otp-error-msg");
    const boxesRow = document.getElementById("otp-boxes-row");
    const boxes = document.querySelectorAll(".otp-box");

    // Check lockout
    if (now < this.lockedUntil) {
      const remainingSec = Math.ceil((this.lockedUntil - now) / 1000);
      errorDiv.textContent = `Too many attempts. Try again in 0:${remainingSec < 10 ? '0' : ''}${remainingSec}`;
      return;
    }

    // Check expiry
    if (now > this.expiresAt) {
      errorDiv.textContent = "This code has expired — tap Resend to get a new one";
      this.enableResendImmediate();
      return;
    }

    // Check match
    if (enteredCode === this.expectedCode) {
      errorDiv.style.color = "var(--success-green)";
      errorDiv.textContent = "Phone number verified successfully";
      boxes.forEach(b => {
        b.style.borderColor = "var(--success-green)";
        b.disabled = true;
      });
      clearInterval(this.timerInterval);
      setTimeout(() => {
        this.onSuccess();
      }, 600);
    } else {
      this.attempts++;
      boxesRow.classList.add("shake");
      boxes.forEach(b => b.classList.add("error"));

      if (this.attempts >= this.maxAttempts) {
        this.lockedUntil = Date.now() + 60 * 1000;
        errorDiv.textContent = "Too many attempts. Try again in 0:59";
        boxes.forEach(b => b.disabled = true);
      } else {
        errorDiv.textContent = "That code didn't match. Try again.";
      }

      setTimeout(() => {
        boxesRow.classList.remove("shake");
        if (this.attempts < this.maxAttempts) {
          boxes.forEach(b => {
            b.classList.remove("error");
            b.value = "";
          });
          if (boxes[0]) boxes[0].focus();
        }
      }, 1000);
    }
  }

  handleResend() {
    this.expectedCode = Math.floor(100000 + Math.random() * 900000).toString();
    this.attempts = 0;
    this.lockedUntil = 0;
    this.expiresAt = Date.now() + 10 * 60 * 1000;
    this.resendAvailableAt = Date.now() + 30 * 1000;

    const devBanner = document.getElementById("otp-dev-banner");
    if (devBanner) {
      devBanner.innerHTML = `Demo Mode: Verification OTP is <strong>${this.expectedCode}</strong>`;
    }

    const errorDiv = document.getElementById("otp-error-msg");
    if (errorDiv) errorDiv.textContent = "";

    const boxes = document.querySelectorAll(".otp-box");
    boxes.forEach(b => {
      b.disabled = false;
      b.classList.remove("error");
      b.value = "";
    });
    if (boxes[0]) boxes[0].focus();

    this.startCountdown();
  }

  enableResendImmediate() {
    const timerLabel = document.getElementById("otp-timer-label");
    const countdown = document.getElementById("otp-countdown");
    const resendBtn = document.getElementById("btn-resend-otp");

    if (timerLabel) timerLabel.style.display = "none";
    if (countdown) countdown.style.display = "none";
    if (resendBtn) {
      resendBtn.style.display = "inline";
      resendBtn.classList.remove("disabled");
    }
  }

  startCountdown() {
    clearInterval(this.timerInterval);
    const timerLabel = document.getElementById("otp-timer-label");
    const countdown = document.getElementById("otp-countdown");
    const resendBtn = document.getElementById("btn-resend-otp");

    if (timerLabel) timerLabel.style.display = "inline";
    if (countdown) countdown.style.display = "inline";
    if (resendBtn) resendBtn.style.display = "none";

    this.timerInterval = setInterval(() => {
      const now = Date.now();
      
      // Update Lockout countdown if active
      if (now < this.lockedUntil) {
        const lockSec = Math.ceil((this.lockedUntil - now) / 1000);
        const errorDiv = document.getElementById("otp-error-msg");
        if (errorDiv) errorDiv.textContent = `Too many attempts. Try again in 0:${lockSec < 10 ? '0' : ''}${lockSec}`;
      } else if (this.lockedUntil > 0 && now >= this.lockedUntil) {
        this.lockedUntil = 0;
        this.attempts = 0;
        const boxes = document.querySelectorAll(".otp-box");
        boxes.forEach(b => b.disabled = false);
        const errorDiv = document.getElementById("otp-error-msg");
        if (errorDiv) errorDiv.textContent = "";
      }

      // Resend countdown
      if (now >= this.resendAvailableAt) {
        this.enableResendImmediate();
      } else {
        const remainingSec = Math.ceil((this.resendAvailableAt - now) / 1000);
        if (countdown) {
          countdown.textContent = `0:${remainingSec < 10 ? '0' : ''}${remainingSec}`;
        }
      }
    }, 1000);
  }
}

window.VioraOTP = VioraOTP;
