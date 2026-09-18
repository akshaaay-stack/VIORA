/**
 * VIORA - Supabase & App Configuration
 * Production Supabase integration for Viora Emergency Blood Network
 */
window.VIORA_CONFIG = {
  // Live Connected Supabase Credentials
  SUPABASE_URL: "https://jpultvoodifhjqmbsjvh.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwdWx0dm9vZGlmaGpxbWJzanZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2NTQ4MTcsImV4cCI6MjEwNTIzMDgxN30.xnGN2RbFYl2HHj583swTzU83GdOr9oHNO2EMPYjY6sk",
  
  // App Timing Constants
  COOLDOWN_DAYS: 90,
  WAVE_INTERVAL_SECONDS: 300, // 5 minutes auto escalation
  OTP_COOLDOWN_SECONDS: 30,
  OTP_LOCKOUT_SECONDS: 60,
  MAX_OTP_ATTEMPTS: 3,

  // Save custom keys if desired
  saveKeys: function(url, anonKey) {
    if (url) localStorage.setItem('VIORA_SUPABASE_URL', url.trim());
    if (anonKey) localStorage.setItem('VIORA_SUPABASE_ANON_KEY', anonKey.trim());
    window.location.reload();
  },

  isConfigured: function() {
    return true;
  }
};

