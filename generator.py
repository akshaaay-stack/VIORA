import os

def write_file(path, content):
    d = os.path.dirname(path)
    if d:
        os.makedirs(d, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Generated: {path} ({len(content)} bytes)")

# ----------------------------------------------------------------------
# 1. css/design-system.css & css/main.css
# ----------------------------------------------------------------------
DESIGN_SYSTEM_CSS = """/* ==========================================================================
   VIORA DESIGN SYSTEM - KERALA EMERGENCY BLOOD MATCHING
   Colors: Cherry Red (#990011), Navy (#1E2761), Off-White (#FCF6F5)
   Cards: 16px radius, Soft Box Shadow (0 4px 12px rgba(0,0,0,0.08))
   Interactive elements: Pill-shaped (9999px), 200-250ms ease transitions
   ========================================================================== */

:root {
  --primary: #990011;
  --primary-hover: #7d000e;
  --primary-light: rgba(153, 0, 17, 0.08);
  --primary-glow: rgba(153, 0, 17, 0.25);
  
  --secondary: #1E2761;
  --secondary-hover: #161c47;
  --secondary-light: rgba(30, 39, 97, 0.08);
  
  --success: #1F6E43;
  --success-light: rgba(31, 110, 67, 0.12);
  --success-glow: rgba(31, 110, 67, 0.3);
  
  --warning: #B8860B;
  --warning-light: rgba(184, 134, 11, 0.12);
  
  --bg-page: #FCF6F5;
  --bg-card: #FFFFFF;
  --text-main: #1C1C1E;
  --text-muted: #5A6275;
  --text-light: #8E95A5;
  --border: #E8ECEF;
  --border-focus: #1E2761;
  
  --radius-card: 16px;
  --radius-pill: 9999px;
  --radius-sm: 8px;
  
  --shadow-sm: 0 2px 8px rgba(30, 39, 97, 0.04);
  --shadow-card: 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-hover: 0 8px 24px rgba(30, 39, 97, 0.12);
  --shadow-modal: 0 20px 45px rgba(30, 39, 97, 0.22);

  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  -webkit-tap-highlight-color: transparent;
}

body {
  background-color: var(--bg-page);
  color: var(--text-main);
  font-family: var(--font-sans);
  font-size: 16px;
  line-height: 1.5;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

h1, h2, h3, h4 {
  color: var(--secondary);
  font-weight: 700;
  line-height: 1.25;
}

h1 { font-size: 32px; letter-spacing: -0.5px; }
h2 { font-size: 26px; letter-spacing: -0.3px; }
h3 { font-size: 20px; }
h4 { font-size: 16px; font-weight: 600; }

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
}

.container-narrow {
  max-width: 560px;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
}

.container-wide {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
}

.card {
  background: var(--bg-card);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  border: 1px solid var(--border);
  padding: 28px;
  margin-bottom: 24px;
  transition: box-shadow 220ms ease, transform 220ms ease;
}

.card:hover {
  box-shadow: var(--shadow-hover);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 26px;
  border-radius: var(--radius-pill);
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  border: 1.5px solid transparent;
  cursor: pointer;
  transition: all 220ms ease;
  outline: none;
  user-select: none;
}

.btn:active {
  transform: scale(0.97);
}

.btn-primary {
  background: var(--primary);
  color: #FFFFFF;
  border-color: var(--primary);
  box-shadow: 0 4px 12px rgba(153, 0, 17, 0.25);
}

.btn-primary:hover {
  background: var(--primary-hover);
  border-color: var(--primary-hover);
  box-shadow: 0 6px 16px rgba(153, 0, 17, 0.35);
  color: #FFFFFF;
}

.btn-secondary {
  background: var(--secondary);
  color: #FFFFFF;
  border-color: var(--secondary);
}

.btn-secondary:hover {
  background: var(--secondary-hover);
  color: #FFFFFF;
}

.btn-outline-cherry {
  background: transparent;
  color: var(--primary);
  border-color: var(--primary);
}

.btn-outline-cherry:hover {
  background: var(--primary-light);
}

.btn-outline-navy {
  background: transparent;
  color: var(--secondary);
  border-color: var(--secondary);
}

.btn-outline-navy:hover {
  background: var(--secondary-light);
}

.btn-block {
  display: flex;
  width: 100%;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--secondary);
  margin-bottom: 8px;
}

.form-control {
  width: 100%;
  padding: 13px 18px;
  border-radius: 12px;
  border: 1.5px solid var(--border);
  background: #FFFFFF;
  font-size: 15px;
  color: var(--text-main);
  transition: border-color 200ms ease, box-shadow 200ms ease;
  outline: none;
}

.form-control:focus {
  border-color: var(--secondary);
  box-shadow: 0 0 0 3px var(--secondary-light);
}

.form-hint {
  font-size: 13px;
  color: var(--text-muted);
  margin-top: 6px;
}

/* 8-Blood Group Grid */
.blood-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 20px;
}

.blood-pill {
  padding: 12px 6px;
  text-align: center;
  border-radius: var(--radius-pill);
  border: 1.5px solid var(--border);
  background: #FFFFFF;
  font-weight: 700;
  font-size: 15px;
  color: var(--secondary);
  cursor: pointer;
  transition: all 220ms ease;
  user-select: none;
}

.blood-pill:hover {
  border-color: var(--primary);
  transform: translateY(-2px);
}

.blood-pill.active, .blood-pill.selected {
  background: var(--primary) !important;
  color: #FFFFFF !important;
  border-color: var(--primary) !important;
  box-shadow: 0 4px 12px rgba(153, 0, 17, 0.28);
  transform: scale(1.04);
}

/* Urgency Selector Cards */
.urgency-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}

.urgency-card {
  border: 2px solid var(--border);
  border-radius: var(--radius-card);
  padding: 18px 16px;
  cursor: pointer;
  background: #FFFFFF;
  transition: all 220ms ease;
  text-align: center;
}

.urgency-card:hover {
  border-color: var(--secondary);
}

.urgency-card.active-normal {
  border-color: var(--secondary);
  background: var(--secondary-light);
}

.urgency-card.active-urgent {
  border-color: var(--primary);
  background: #FFF5F5;
  animation: urgentBorderPulse 2s infinite ease-in-out;
}

/* Progress Dots */
.progress-dots-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 28px;
}

.progress-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--border);
  transition: all 250ms ease;
}

.progress-dot.active {
  background: var(--primary);
  transform: scale(1.3);
  box-shadow: 0 0 8px rgba(153, 0, 17, 0.4);
}

.progress-dot.completed {
  background: var(--success);
}

/* 6-Box OTP Inputs */
.otp-box-grid {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 20px 0;
}

.otp-box {
  width: 48px;
  height: 54px;
  border-radius: 12px;
  border: 2px solid var(--border);
  text-align: center;
  font-size: 22px;
  font-weight: 700;
  color: var(--secondary);
  background: #FFFFFF;
  transition: all 200ms ease;
  outline: none;
}

.otp-box:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 4px var(--primary-light);
  transform: scale(1.06);
}

/* Dev Mode Banner */
.dev-otp-banner {
  background: #FFFBEB;
  border: 1.5px dashed var(--warning);
  border-radius: 12px;
  padding: 12px 16px;
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: #92400E;
}

.dev-otp-code {
  font-family: monospace;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: 2px;
  background: #FEF3C7;
  padding: 4px 10px;
  border-radius: 6px;
  color: #B45309;
}

/* Pill Badges */
.badge-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: var(--radius-pill);
  font-size: 13px;
  font-weight: 600;
}

.badge-cherry {
  background: var(--primary-light);
  color: var(--primary);
}

.badge-navy {
  background: var(--secondary-light);
  color: var(--secondary);
}

.badge-success {
  background: var(--success-light);
  color: var(--success);
}

.badge-warning {
  background: var(--warning-light);
  color: var(--warning);
}

/* Navbar */
.app-navbar {
  background: #FFFFFF;
  border-bottom: 1px solid var(--border);
  padding: 14px 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: var(--shadow-sm);
}

.nav-flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}

.brand-icon {
  width: 34px;
  height: 34px;
  background: var(--primary);
  color: #FFFFFF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.brand-title {
  font-size: 22px;
  font-weight: 800;
  color: var(--primary);
  letter-spacing: -0.5px;
}

.brand-tag {
  font-size: 11px;
  background: var(--secondary-light);
  color: var(--secondary);
  padding: 2px 8px;
  border-radius: var(--radius-pill);
  font-weight: 700;
  letter-spacing: 0.5px;
}

.nav-pills {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.nav-tab-btn {
  padding: 8px 18px;
  border-radius: var(--radius-pill);
  border: 1.5px solid transparent;
  background: transparent;
  color: var(--text-muted);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 200ms ease;
  text-decoration: none;
}

.nav-tab-btn:hover {
  background: var(--secondary-light);
  color: var(--secondary);
}

.nav-tab-btn.active {
  background: var(--secondary);
  color: #FFFFFF;
}

.split-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 24px;
  align-items: start;
}

@media (max-width: 900px) {
  .split-grid {
    grid-template-columns: 1fr;
  }
}

.app-footer {
  margin-top: auto;
  background: #FFFFFF;
  border-top: 1px solid var(--border);
  padding: 24px 0;
  text-align: center;
  font-size: 14px;
  color: var(--text-muted);
}
"""

write_file("css/design-system.css", DESIGN_SYSTEM_CSS)
write_file("css/main.css", DESIGN_SYSTEM_CSS)

ANIMATIONS_CSS = """/* VIORA ANIMATIONS & MICRO-INTERACTIONS */
@keyframes availableGreenGlow {
  0% { box-shadow: 0 0 0 0 rgba(31, 110, 67, 0.45); }
  70% { box-shadow: 0 0 0 18px rgba(31, 110, 67, 0); }
  100% { box-shadow: 0 0 0 0 rgba(31, 110, 67, 0); }
}

@keyframes wavePulseCherry {
  0% { transform: scale(0.96); box-shadow: 0 0 0 0 rgba(153, 0, 17, 0.4); }
  70% { transform: scale(1.04); box-shadow: 0 0 0 20px rgba(153, 0, 17, 0); }
  100% { transform: scale(0.96); box-shadow: 0 0 0 0 rgba(153, 0, 17, 0); }
}

@keyframes urgentBorderPulse {
  0% { border-color: rgba(153, 0, 17, 0.4); box-shadow: 0 0 0 0 rgba(153, 0, 17, 0.25); }
  50% { border-color: rgba(153, 0, 17, 1); box-shadow: 0 0 0 6px rgba(153, 0, 17, 0.15); }
  100% { border-color: rgba(153, 0, 17, 0.4); box-shadow: 0 0 0 0 rgba(153, 0, 17, 0.25); }
}

@keyframes urgentBadgePulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.06); opacity: 0.9; }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes otpShake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-6px); }
  80% { transform: translateX(6px); }
}

.shake-error {
  animation: otpShake 0.4s ease-in-out !important;
  border-color: var(--primary) !important;
  background-color: #FFF0F0 !important;
}

@keyframes lockShackleOpen {
  0% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(-8px) rotate(-28deg); transform-origin: left top; }
}

@keyframes checkmarkDraw {
  0% { stroke-dashoffset: 60; }
  100% { stroke-dashoffset: 0; }
}

@keyframes scaleUpSpring {
  0% { transform: scale(0.7); opacity: 0; }
  60% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}

.unlock-spring {
  animation: scaleUpSpring 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

.checkmark-svg-path {
  stroke-dasharray: 60;
  stroke-dashoffset: 60;
  animation: checkmarkDraw 0.6s 0.2s ease forwards;
}

.screen-transition {
  animation: screenFadeSlide 180ms ease-out forwards;
}

@keyframes screenFadeSlide {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
"""

DONOR_CSS = """/* VIORA DONOR DASHBOARD & ALERTS */
.donor-hero-card {
  text-align: center;
  padding: 36px 24px;
  background: #FFFFFF;
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  border: 1px solid var(--border);
  margin-bottom: 24px;
}

.avail-badge-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.avail-circle {
  width: 124px;
  height: 124px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 250ms ease;
}

.avail-circle.available {
  border: 4px solid var(--success);
  background: radial-gradient(circle, #FFFFFF 65%, var(--success-light) 100%);
  animation: availableGreenGlow 2.5s infinite ease-in-out;
}

.avail-circle.resting {
  border: 4px solid var(--border);
  background: #F8F9FA;
  box-shadow: none;
}

.avail-blood-group {
  font-size: 32px;
  font-weight: 800;
  line-height: 1;
  color: var(--primary);
  margin-bottom: 2px;
}

.avail-status-tag {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.avail-circle.available .avail-status-tag { color: var(--success); }
.avail-circle.resting .avail-status-tag { color: var(--text-muted); }

.hero-toggle-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.toggle-switch-container {
  position: relative;
  display: inline-block;
  width: 88px;
  height: 46px;
  cursor: pointer;
}

.toggle-switch-container input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #D1D5DB;
  transition: background-color 250ms ease;
  border-radius: 9999px;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 38px;
  width: 38px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms ease;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
}

.toggle-switch-container input:checked + .toggle-slider {
  background-color: var(--success);
}

.toggle-switch-container input:checked + .toggle-slider:before {
  transform: translateX(42px);
}

.toggle-label-text {
  font-size: 16px;
  font-weight: 700;
  transition: color 250ms ease;
}

.donor-stats-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  background: #FFFFFF;
  border-radius: var(--radius-card);
  padding: 22px 18px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-card);
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all 220ms ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
  border-color: var(--secondary);
}

.cooldown-ring-box {
  position: relative;
  width: 64px;
  height: 64px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cooldown-svg {
  width: 64px;
  height: 64px;
  transform: rotate(-90deg);
}

.cooldown-bg-circle {
  fill: none;
  stroke: var(--border);
  stroke-width: 5;
}

.cooldown-fg-circle {
  fill: none;
  stroke: var(--primary);
  stroke-width: 5;
  stroke-linecap: round;
  transition: stroke-dashoffset 800ms ease;
}

.cooldown-center-val {
  position: absolute;
  font-size: 14px;
  font-weight: 800;
  color: var(--secondary);
  text-align: center;
}

.trust-score-badge {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--secondary-light);
  border: 3px solid var(--secondary);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 220ms ease;
}

.trust-val {
  font-size: 20px;
  font-weight: 800;
  color: var(--secondary);
  line-height: 1;
}

.trust-sub {
  font-size: 9px;
  font-weight: 700;
  color: var(--secondary);
  text-transform: uppercase;
}

.incoming-match-modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(30, 39, 97, 0.78);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 1000;
  opacity: 0;
  pointer-events: none;
  transition: opacity 250ms ease;
}

.incoming-match-modal-overlay.active {
  opacity: 1;
  pointer-events: auto;
}

.incoming-match-card {
  background: #FFFFFF;
  border-radius: 20px;
  width: 100%;
  max-width: 520px;
  box-shadow: var(--shadow-modal);
  padding: 32px 28px;
  text-align: center;
  position: relative;
  transform: translateY(20px);
  transition: transform 250ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.incoming-match-modal-overlay.active .incoming-match-card {
  transform: translateY(0);
}

.match-urgency-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  border-radius: var(--radius-pill);
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 16px;
}

.match-urgency-pill.urgent {
  background: var(--primary-light);
  color: var(--primary);
  border: 1.5px solid var(--primary);
  animation: urgentBadgePulse 1.8s infinite ease-in-out;
}

.match-urgency-pill.normal {
  background: var(--secondary-light);
  color: var(--secondary);
  border: 1.5px solid var(--secondary);
}

.match-info-box {
  background: var(--bg-page);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 20px;
  margin: 20px 0;
  text-align: left;
}

.match-info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.match-info-row:last-child {
  margin-bottom: 0;
  padding-top: 12px;
  border-top: 1px solid var(--border);
}

.match-action-buttons {
  display: flex;
  gap: 14px;
  margin-top: 24px;
}
"""

REQUESTER_CSS = """/* VIORA REQUESTER & RADAR MATCHING */
.radar-hero-box {
  background: #FFFFFF;
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  border: 1px solid var(--border);
  padding: 32px 24px;
  text-align: center;
  margin-bottom: 24px;
}

.radar-concentric-container {
  position: relative;
  width: 220px;
  height: 220px;
  margin: 0 auto 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.concentric-ring {
  position: absolute;
  border-radius: 50%;
  border: 2px solid var(--border);
  transition: all 400ms ease;
}

.concentric-ring.ring-3 { width: 220px; height: 220px; }
.concentric-ring.ring-2 { width: 156px; height: 156px; }
.concentric-ring.ring-1 { width: 96px; height: 96px; }

.concentric-ring.active-cherry {
  border-color: var(--primary) !important;
  background: rgba(153, 0, 17, 0.04);
  animation: wavePulseCherry 2.2s infinite ease-in-out;
}

.concentric-ring.active-navy {
  border-color: var(--secondary) !important;
  background: rgba(30, 39, 97, 0.04);
}

.radar-center-core {
  width: 48px;
  height: 48px;
  background: var(--primary);
  color: #FFFFFF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  z-index: 2;
  box-shadow: 0 4px 12px rgba(153, 0, 17, 0.4);
}

.wave-steps-row {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.wave-step-pill {
  padding: 6px 16px;
  border-radius: var(--radius-pill);
  font-size: 13px;
  font-weight: 700;
  border: 1.5px solid var(--border);
  background: #FFFFFF;
  color: var(--text-muted);
  transition: all 220ms ease;
}

.wave-step-pill.active {
  background: var(--primary);
  color: #FFFFFF;
  border-color: var(--primary);
  box-shadow: 0 2px 8px rgba(153, 0, 17, 0.3);
}

.wave-step-pill.passed {
  background: var(--secondary);
  color: #FFFFFF;
  border-color: var(--secondary);
}

.masked-donors-carousel {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding: 8px 4px 16px;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}

.masked-donor-card {
  min-width: 240px;
  flex: 0 0 240px;
  background: #FFFFFF;
  border: 1.5px solid var(--border);
  border-radius: 14px;
  padding: 18px 16px;
  scroll-snap-align: start;
  text-align: left;
  transition: all 220ms ease;
  box-shadow: var(--shadow-sm);
}

.masked-donor-card:hover {
  border-color: var(--secondary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-card);
}

.masked-avatar-box {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--secondary-light);
  color: var(--secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-bottom: 12px;
}

.masked-donor-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--secondary);
  margin-bottom: 4px;
}

.masked-donor-meta {
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.4;
}

.contact-reveal-card {
  background: #FFFFFF;
  border-radius: 20px;
  border: 2px solid var(--success);
  padding: 36px 28px;
  text-align: center;
  box-shadow: var(--shadow-modal);
  margin-bottom: 24px;
}

.unlock-animation-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--success-light);
  border: 3px solid var(--success);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.revealed-contact-box {
  background: var(--bg-page);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 24px;
  margin: 24px 0;
  text-align: left;
}

.revealed-contact-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid var(--border);
}

.revealed-contact-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
"""

write_file("css/animations.css", ANIMATIONS_CSS)
write_file("css/donor.css", DONOR_CSS)
write_file("css/requester.css", REQUESTER_CSS)
APP_JS = """/* ==========================================================================
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
"""

write_file("js/app.js", APP_JS)

# ----------------------------------------------------------------------
# 6. index.html (Master Application with All Views & Live Demo Simulator)
# ----------------------------------------------------------------------
INDEX_HTML = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Viora — Privacy-First Blood Donor Matching for Kerala</title>
  <link rel="stylesheet" href="css/main.css">
  <link rel="stylesheet" href="css/animations.css">
  <link rel="stylesheet" href="css/donor.css">
  <link rel="stylesheet" href="css/requester.css">
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script src="config.js"></script>
  <script src="js/kerala-data.js"></script>
  <script src="js/supabase-client.js"></script>
  <script src="js/app.js" defer></script>
</head>
<body>

  <!-- App Header / Navigation -->
  <header class="app-navbar">
    <div class="container-wide nav-flex">
      <a href="index.html" class="brand-wrapper">
        <div class="brand-icon">🩸</div>
        <div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="brand-title">Viora</span>
            <span class="brand-tag">KERALA</span>
          </div>
        </div>
      </a>

      <!-- View Selector / Demo Mode Tabs -->
      <nav class="nav-pills" id="navTabs">
        <button class="nav-tab-btn active" data-mode="split">⚡ Dual Demo Simulator</button>
        <button class="nav-tab-btn" data-mode="requester">🚨 Emergency Requester</button>
        <button class="nav-tab-btn" data-mode="donor">❤️ Donor Hub</button>
        <button class="nav-tab-btn" data-mode="signup">🛡️ Register as Donor</button>
      </nav>

      <div>
        <button id="cfgBtn" class="btn btn-outline-navy" style="padding: 6px 14px; font-size: 13px;" onclick="document.getElementById('configModal').classList.add('active')">
          ⚙️ Supabase
        </button>
      </div>
    </div>
  </header>

  <!-- MAIN APP CONTAINER -->
  <main class="container-wide" style="padding-top: 24px; padding-bottom: 40px; flex: 1;">

    <!-- ============================================================== -->
    <!-- VIEW 1: DUAL SIMULATOR (SPLIT SCREEN FOR JUDGES) -->
    <!-- ============================================================== -->
    <div id="splitView" class="split-grid screen-transition">
      
      <!-- LEFT PANE: REQUESTER RADAR FLOW -->
      <div class="pane-column">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
          <span class="badge-pill badge-cherry">Persona 1: Hospital Requester</span>
          <span style="font-size: 13px; color: var(--text-muted);">Step 1: Dispatch Emergency</span>
        </div>

        <!-- REQUESTER FORM CARD -->
        <div id="requestFormCard" class="card">
          <h2 style="margin-bottom: 6px;">Find Blood Donors</h2>
          <p style="font-size: 14px; color: var(--text-muted); margin-bottom: 20px;">
            Wave 1 automatically dispatches to the 3 nearest eligible donors in your locality.
          </p>

          <form id="bloodRequestForm">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
              <div class="form-group">
                <label class="form-label" for="reqName">Patient / Requester Name *</label>
                <input type="text" id="reqName" class="form-control" value="Rahul Kumar" required>
              </div>
              <div class="form-group">
                <label class="form-label" for="reqPhone">Phone Number *</label>
                <input type="tel" id="reqPhone" class="form-control" value="+91 98479 99888" required>
              </div>
            </div>

            <!-- 8-Blood Group Grid Selector -->
            <div class="form-group">
              <label class="form-label">Blood Group Needed *</label>
              <div class="blood-grid">
                <div class="blood-pill blood-pill-req selected active" data-bg="O+">O+</div>
                <div class="blood-pill blood-pill-req" data-bg="O-">O-</div>
                <div class="blood-pill blood-pill-req" data-bg="A+">A+</div>
                <div class="blood-pill blood-pill-req" data-bg="A-">A-</div>
                <div class="blood-pill blood-pill-req" data-bg="B+">B+</div>
                <div class="blood-pill blood-pill-req" data-bg="B-">B-</div>
                <div class="blood-pill blood-pill-req" data-bg="AB+">AB+</div>
                <div class="blood-pill blood-pill-req" data-bg="AB-">AB-</div>
              </div>
            </div>

            <!-- Kerala Cascading Dropdowns -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
              <div class="form-group">
                <label class="form-label" for="reqDistrict">District in Kerala *</label>
                <select id="reqDistrict" class="form-control" required></select>
              </div>
              <div class="form-group">
                <label class="form-label" for="reqLocality">Locality / Area *</label>
                <select id="reqLocality" class="form-control" required></select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="reqHospital">Hospital / Blood Bank *</label>
              <select id="reqHospital" class="form-control" required></select>
            </div>

            <!-- Urgency Cards -->
            <div class="form-group">
              <label class="form-label">Urgency Level *</label>
              <div class="urgency-grid">
                <div id="urgencyCardUrgent" class="urgency-card active-urgent">
                  <div style="font-size: 22px; margin-bottom: 4px;">🚨</div>
                  <strong style="color: var(--primary); font-size: 15px;">Emergency Urgent</strong>
                  <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">Immediate transfusion</div>
                </div>
                <div id="urgencyCardNormal" class="urgency-card">
                  <div style="font-size: 22px; margin-bottom: 4px;">⏱️</div>
                  <strong style="color: var(--secondary); font-size: 15px;">Standard Need</strong>
                  <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">Within 24 hours</div>
                </div>
              </div>
            </div>

            <button type="submit" class="btn btn-primary btn-block" style="padding: 14px; font-size: 16px;">
              ⚡ Launch Wave 1 Escalation Search
            </button>
          </form>
        </div>

        <!-- LIVE RADAR SCREEN (Initially Hidden) -->
        <div id="liveRadarSection" style="display: none;">
          <div id="radarDisplayCard" class="card" style="text-align: center;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 14px; margin-bottom: 20px;">
              <div>
                <span class="badge-pill badge-cherry">🚨 EMERGENCY RADAR ACTIVE</span>
                <div id="radarHospitalText" style="font-size: 14px; font-weight: 700; color: var(--secondary); margin-top: 4px;">Aster Medcity, Kakkanad</div>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 11px; color: var(--text-light); text-transform: uppercase;">Blood Group</div>
                <strong style="font-size: 24px; color: var(--primary);">O+</strong>
              </div>
            </div>

            <!-- Concentric Escalation Rings -->
            <div class="radar-concentric-container">
              <div id="waveRing3" class="concentric-ring ring-3"></div>
              <div id="waveRing2" class="concentric-ring ring-2"></div>
              <div id="waveRing1" class="concentric-ring ring-1 active-cherry"></div>
              <div class="radar-center-core">🩸</div>
            </div>

            <h3 id="waveStatusTitle" style="color: var(--secondary); margin-bottom: 4px;">Wave 1: Alerting 3 Nearest Local Donors</h3>
            <p id="waveDescription" style="font-size: 13px; color: var(--text-muted); max-width: 440px; margin: 0 auto 16px;">
              Restricted to Kakkanad locality to prevent donor fatigue.
            </p>

            <div class="wave-steps-row">
              <div id="waveStepBadge1" class="wave-step-pill active">● Wave 1 (Locality)</div>
              <div id="waveStepBadge2" class="wave-step-pill">○ Wave 2 (Adjacent)</div>
              <div id="waveStepBadge3" class="wave-step-pill">○ Wave 3 (District)</div>
            </div>

            <div id="waveCountdownDisplay" style="font-size: 14px; font-weight: 700; color: var(--primary); margin-bottom: 16px;">
              Auto-widening to Wave 2 in 05:00
            </div>

            <button id="manualWidenBtn" class="btn btn-outline-navy" style="font-size: 13px; padding: 8px 18px;">
              ⚡ Widen Search Radius Now
            </button>

            <!-- Masked Donors Carousel -->
            <div style="border-top: 1px solid var(--border); padding-top: 18px; margin-top: 20px; text-align: left;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <h4 style="color: var(--secondary);">🛡️ Masked Eligible Donors Notified</h4>
                <span style="font-size: 12px; color: var(--success); font-weight: 700;">Zero-Leakage View</span>
              </div>
              <div id="maskedDonorsList" class="masked-donors-carousel"></div>
            </div>
          </div>

          <!-- Contact Revealed Container -->
          <div id="matchRevealedContainer" style="display: none;"></div>
        </div>

      </div>

      <!-- RIGHT PANE: DONOR HUB & INCOMING ALERT -->
      <div class="pane-column">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
          <span class="badge-pill badge-navy">Persona 2: Registered Hero Donor</span>
          <span style="font-size: 13px; color: var(--text-muted);">Live Standby Dashboard</span>
        </div>

        <!-- DONOR HERO DASHBOARD -->
        <div class="donor-hero-card">
          <!-- Large Circular Availability Badge -->
          <div class="avail-badge-wrapper">
            <div id="availCircleBadge" class="avail-circle available">
              <div id="donorBloodDisplay" class="avail-blood-group">O+</div>
              <span id="availStatusTag" class="avail-status-tag">Available</span>
            </div>
          </div>

          <h2 id="donorNameDisplay" style="margin-bottom: 2px;">Arjun Nair</h2>
          <p id="donorLocDisplay" style="font-size: 14px; color: var(--text-muted); margin-bottom: 16px;">Kakkanad, Ernakulam</p>

          <!-- Pill Availability Toggle Switch -->
          <div class="hero-toggle-section">
            <label class="toggle-switch-container">
              <input type="checkbox" id="availabilityToggle" checked>
              <span class="toggle-slider"></span>
            </label>
            <span id="toggleStatusLabel" class="toggle-label-text" style="color: var(--success);">
              Available for Urgent Requests
            </span>
          </div>
        </div>

        <!-- Stats Grid: 90-Day Cooldown & Trust Score -->
        <div class="donor-stats-row">
          <!-- Cooldown Ring Card -->
          <div class="stat-card">
            <div class="cooldown-ring-box">
              <svg class="cooldown-svg" viewBox="0 0 60 60">
                <circle class="cooldown-bg-circle" cx="30" cy="30" r="25"></circle>
                <circle id="cooldownFgCircle" class="cooldown-fg-circle" cx="30" cy="30" r="25"></circle>
              </svg>
              <div id="cooldownDaysText" class="cooldown-center-val">Ready</div>
            </div>
            <div>
              <h4 style="margin-bottom: 2px;">90-Day Cooldown</h4>
              <p id="cooldownSubtitle" style="font-size: 12px; color: var(--text-muted);">Safe medical window</p>
            </div>
          </div>

          <!-- Trust Score Card -->
          <div class="stat-card" id="trustScoreCard">
            <div class="trust-score-badge">
              <span id="donorTrustScoreVal" class="trust-val">96</span>
              <span class="trust-sub">Score</span>
            </div>
            <div>
              <h4 style="margin-bottom: 2px;">Trust Score ⭐</h4>
              <p style="font-size: 12px; color: var(--text-muted);">Tap for breakdown</p>
            </div>
          </div>
        </div>

        <!-- Simulation Trigger Button -->
        <div class="card" style="text-align: center; padding: 20px;">
          <h4 style="color: var(--secondary); margin-bottom: 6px;">🧪 Hackathon Live Broadcast Simulation</h4>
          <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 14px;">
            Simulate an emergency hospital broadcast directly to this donor.
          </p>
          <button id="demoTriggerMatchBtn" class="btn btn-outline-cherry" style="font-size: 14px; padding: 10px 22px;">
            ⚡ Simulate Incoming Match Alert
          </button>
        </div>
      </div>

    </div>

    <!-- ============================================================== -->
    <!-- VIEW 2: STANDALONE REQUESTER VIEW -->
    <!-- ============================================================== -->
    <div id="requesterStandaloneView" style="display: none;" class="container-narrow screen-transition">
      <!-- (Mirrors Requester Form) -->
    </div>

    <!-- ============================================================== -->
    <!-- VIEW 3: STANDALONE DONOR VIEW -->
    <!-- ============================================================== -->
    <div id="donorStandaloneView" style="display: none;" class="container-narrow screen-transition">
      <!-- (Mirrors Donor Hub) -->
    </div>

    <!-- ============================================================== -->
    <!-- VIEW 4: DONOR SIGNUP WIZARD & OTP -->
    <!-- ============================================================== -->
    <div id="signupStandaloneView" style="display: none;" class="container-narrow screen-transition">
      <div class="card" style="text-align: center;">
        <span class="badge-pill badge-navy" style="margin-bottom: 12px;">Donor Protection Shield</span>
        <h2 style="margin-bottom: 6px;">Register as a Hero Donor</h2>
        <p style="font-size: 14px; color: var(--text-muted); margin-bottom: 24px;">
          Your phone number is locked by RLS and never shared unless you click "I Can Help".
        </p>

        <!-- 4 Progress Dots -->
        <div class="progress-dots-container">
          <div id="stepDot1" class="progress-dot active"></div>
          <div id="stepDot2" class="progress-dot"></div>
          <div id="stepDot3" class="progress-dot"></div>
          <div id="stepDot4" class="progress-dot"></div>
        </div>

        <!-- Step 1: Personal Details -->
        <div id="signupStep1" class="screen-transition">
          <div class="form-group">
            <label class="form-label" for="signupName">Full Name *</label>
            <input type="text" id="signupName" class="form-control" placeholder="e.g. Fathima Zahra" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="signupPhone">Mobile Number (Kerala / India) *</label>
            <input type="tel" id="signupPhone" class="form-control" placeholder="e.g. 98470 12345" required>
            <div class="form-hint">We will verify with a 6-digit dev-mode OTP.</div>
          </div>
        </div>

        <!-- Step 2: Blood Group Grid -->
        <div id="signupStep2" style="display: none;" class="screen-transition">
          <div class="form-group">
            <label class="form-label">Select Your Blood Group *</label>
            <div class="blood-grid">
              <div class="blood-pill blood-pill-signup selected active" data-bg="O+">O+</div>
              <div class="blood-pill blood-pill-signup" data-bg="O-">O-</div>
              <div class="blood-pill blood-pill-signup" data-bg="A+">A+</div>
              <div class="blood-pill blood-pill-signup" data-bg="A-">A-</div>
              <div class="blood-pill blood-pill-signup" data-bg="B+">B+</div>
              <div class="blood-pill blood-pill-signup" data-bg="B-">B-</div>
              <div class="blood-pill blood-pill-signup" data-bg="AB+">AB+</div>
              <div class="blood-pill blood-pill-signup" data-bg="AB-">AB-</div>
            </div>
          </div>
        </div>

        <!-- Step 3: Kerala Location -->
        <div id="signupStep3" style="display: none;" class="screen-transition">
          <div class="form-group">
            <label class="form-label" for="signupDistrict">District *</label>
            <select id="signupDistrict" class="form-control" required></select>
          </div>
          <div class="form-group">
            <label class="form-label" for="signupLocality">Locality / Town *</label>
            <select id="signupLocality" class="form-control" required></select>
          </div>
        </div>

        <!-- Step 4: Cooldown & OTP Verification -->
        <div id="signupStep4" style="display: none;" class="screen-transition">
          <div class="form-group">
            <label class="form-label" for="signupLastDonation">Last Blood Donation Date (Optional)</label>
            <input type="date" id="signupLastDonation" class="form-control">
            <div class="form-hint">Used strictly for your 90-day recovery window.</div>
          </div>

          <!-- Dev-Mode Visible Code Banner -->
          <div class="dev-otp-banner">
            <span>DEV MODE — Verification Code:</span>
            <span id="devOtpCodeDisplay" class="dev-otp-code">------</span>
          </div>

          <!-- 6-Box Auto-Advancing Inputs -->
          <div class="otp-box-grid">
            <input type="text" inputmode="numeric" maxlength="1" class="otp-box">
            <input type="text" inputmode="numeric" maxlength="1" class="otp-box">
            <input type="text" inputmode="numeric" maxlength="1" class="otp-box">
            <input type="text" inputmode="numeric" maxlength="1" class="otp-box">
            <input type="text" inputmode="numeric" maxlength="1" class="otp-box">
            <input type="text" inputmode="numeric" maxlength="1" class="otp-box">
          </div>

          <div id="otpStatusMsg" style="font-size: 13px; color: var(--text-muted); margin-bottom: 16px;">
            Enter 6-digit code
          </div>

          <button id="resendOtpBtn" class="btn btn-outline-navy" style="font-size: 13px; padding: 6px 16px;">
            🔄 Resend Code
          </button>
        </div>

        <!-- Navigation Buttons -->
        <div style="display: flex; justify-content: space-between; margin-top: 24px;">
          <button id="signupPrevBtn" class="btn btn-outline-navy" style="display: none;">
            ← Back
          </button>
          <button id="signupNextBtn" class="btn btn-primary" style="margin-left: auto;">
            Continue →
          </button>
        </div>
      </div>
    </div>

  </main>

  <!-- ============================================================== -->
  <!-- MODAL: FULL-SCREEN INCOMING MATCH ALERT (DONOR SIDE) -->
  <!-- ============================================================== -->
  <div id="incomingMatchModalOverlay" class="incoming-match-modal-overlay">
    <div class="incoming-match-card">
      <div id="matchUrgencyBadge" class="match-urgency-pill urgent">
        🚨 EMERGENCY URGENT
      </div>
      <h2 style="color: var(--secondary); margin-bottom: 4px;">Immediate Blood Need</h2>
      <p style="font-size: 14px; color: var(--text-muted); margin-bottom: 18px;">
        You were matched in Wave 1 as the closest eligible verified donor.
      </p>

      <div class="match-info-box">
        <div class="match-info-row">
          <div>
            <div style="font-size: 11px; color: var(--text-light); text-transform: uppercase;">Blood Needed</div>
            <strong id="matchBloodNeeded" style="font-size: 26px; color: var(--primary);">O+</strong>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 11px; color: var(--text-light); text-transform: uppercase;">Proximity</div>
            <strong id="matchLocality" style="font-size: 16px; color: var(--secondary);">Kakkanad (2.4 km)</strong>
          </div>
        </div>
        <div class="match-info-row">
          <div>
            <div style="font-size: 11px; color: var(--text-light); text-transform: uppercase;">Hospital Destination</div>
            <strong id="matchHospitalName" style="font-size: 15px; color: var(--secondary);">Aster Medcity, Cheranalloor</strong>
          </div>
        </div>
      </div>

      <div class="match-action-buttons">
        <button id="acceptMatchBtn" class="btn btn-primary btn-block" style="padding: 14px; font-size: 16px;">
          ❤️ I Can Help
        </button>
        <button id="declineMatchBtn" class="btn btn-outline-navy btn-block" style="padding: 14px; font-size: 16px;">
          Not This Time
        </button>
      </div>

      <p style="font-size: 12px; color: var(--text-light); margin-top: 16px;">
        Clicking "I Can Help" securely unlocks your contact to the hospital dispatch team.
      </p>
    </div>
  </div>

  <!-- ============================================================== -->
  <!-- MODAL: SATISFYING UNLOCK MICRO-INTERACTION -->
  <!-- ============================================================== -->
  <div id="unlockAnimationModal" class="incoming-match-modal-overlay">
    <div class="incoming-match-card" style="max-width: 400px;">
      <div class="unlock-animation-wrapper unlock-spring">
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <path class="checkmark-svg-path" d="M10 23L18 31L34 13" stroke="var(--success)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h3 style="color: var(--secondary); margin-bottom: 6px;">Identity Verified</h3>
      <p style="font-size: 14px; color: var(--text-muted);">
        Welcome to Viora, <strong id="unlockModalDonorName">Donor</strong>! Your privacy shield is active.
      </p>
    </div>
  </div>

  <!-- ============================================================== -->
  <!-- MODAL: TRUST SCORE BREAKDOWN -->
  <!-- ============================================================== -->
  <div id="trustScoreModal" class="incoming-match-modal-overlay">
    <div class="incoming-match-card" style="max-width: 440px; text-align: left;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <h3 style="color: var(--secondary);">⭐ Trust Score Breakdown</h3>
        <button onclick="window.VioraApp.closeTrustScoreModal()" style="border: none; background: transparent; font-size: 20px; cursor: pointer;">✕</button>
      </div>
      <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 16px;">
        Trust scores rank eligible donors to maximize response rate without revealing identities.
      </p>

      <div style="background: var(--bg-page); border-radius: 12px; padding: 16px; margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px;">
          <span>✓ Phone Verification</span>
          <strong style="color: var(--success);">+40 pts (Verified)</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px;">
          <span>✓ Response Rate (98%)</span>
          <strong style="color: var(--success);">+35 pts</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px;">
          <span>✓ Safe 90-Day Cooldown</span>
          <strong style="color: var(--success);">+15 pts</strong>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 14px; border-top: 1px solid var(--border); padding-top: 10px;">
          <span>✓ Account Age (4 mos)</span>
          <strong style="color: var(--success);">+6 pts</strong>
        </div>
      </div>

      <div style="text-align: right;">
        <button onclick="window.VioraApp.closeTrustScoreModal()" class="btn btn-primary" style="padding: 8px 22px;">Close</button>
      </div>
    </div>
  </div>

  <!-- ============================================================== -->
  <!-- MODAL: SUPABASE CONFIGURATION -->
  <!-- ============================================================== -->
  <div id="configModal" class="incoming-match-modal-overlay">
    <div class="incoming-match-card" style="max-width: 480px; text-align: left;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <h3 style="color: var(--secondary);">⚙️ Supabase Integration</h3>
        <button onclick="document.getElementById('configModal').classList.remove('active')" style="border: none; background: transparent; font-size: 20px; cursor: pointer;">✕</button>
      </div>
      <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 16px;">
        Directly connected to project <strong>VIORA</strong> (<code>jpultvoodifhjqmbsjvh</code>).
      </p>

      <div class="form-group">
        <label class="form-label">Supabase URL</label>
        <input type="text" id="cfgUrl" class="form-control" value="https://jpultvoodifhjqmbsjvh.supabase.co">
      </div>
      <div class="form-group">
        <label class="form-label">Anon Public Key</label>
        <input type="password" id="cfgKey" class="form-control" value="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwdWx0dm9vZGlmaGpxbWJzanZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2NTQ4MTcsImV4cCI6MjEwNTIzMDgxN30.xnGN2RbFYl2HHj583swTzU83GdOr9oHNO2EMPYjY6sk">
      </div>

      <div style="display: flex; gap: 10px; margin-top: 20px;">
        <button onclick="window.VIORA_CONFIG.saveKeys(document.getElementById('cfgUrl').value, document.getElementById('cfgKey').value)" class="btn btn-primary" style="flex: 1;">Save & Reconnect</button>
        <button onclick="document.getElementById('configModal').classList.remove('active')" class="btn btn-outline-navy" style="flex: 1;">Close</button>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <footer class="app-footer">
    <div class="container-wide">
      Viora &copy; 2026 — Built for Kerala Hackathon Selection Round. Privacy-First Medical Trust Blood Network.
    </div>
  </footer>

</body>
</html>
"""

write_file("index.html", INDEX_HTML)
write_file("donor.html", INDEX_HTML)
write_file("request.html", INDEX_HTML)
write_file("donor-signup.html", INDEX_HTML)

print("All HTML files written!")

