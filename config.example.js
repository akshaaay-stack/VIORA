/**
 * Viora Configuration Template
 * 
 * Instructions:
 * 1. Copy this file to `config.js`
 * 2. Replace the placeholder values with your real Supabase project URL and anon public key
 * 3. In production on Netlify/Vercel, you can inject these via window.VIORA_CONFIG or localStorage
 */

window.VIORA_CONFIG = {
  // Your Supabase Project URL (e.g. 'https://xyzcompany.supabase.co')
  SUPABASE_URL: "https://YOUR_SUPABASE_PROJECT_ID.supabase.co",
  
  // Your Supabase Public Anon Key
  SUPABASE_ANON_KEY: "YOUR_SUPABASE_ANON_KEY",
  
  // Set to true to run in realistic in-memory demo mode if Supabase is not connected
  ENABLE_MOCK_FALLBACK: true,
  
  // Dev mode OTP (displays mock OTP on screen for fast testing)
  DEV_MODE_OTP: "742918"
};
