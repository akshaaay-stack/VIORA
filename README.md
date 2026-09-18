# 🩸 Viora — Privacy-First Blood Donor Matching for Kerala

> Built for Hackathon Selection Round | 2-Day Deadline

Viora is a privacy-first emergency blood donor matching platform for Kerala. Instead of broadcasting unvetted blood requests to 400+ person WhatsApp groups, Viora uses a progressive wave escalation algorithm to notify the closest, most eligible donors first, strictly preserving phone number privacy and enforcing 90-day medical cooldowns at the database level.

---

## 🚀 Key Features

1. **Intelligent Wave Escalation**:
   - **Wave 1 (T+0 min)**: 3 nearest eligible donors in the exact locality (e.g., Kakkanad, Ernakulam).
   - **Wave 2 (T+5 min)**: Widens to adjacent localities within the district.
   - **Wave 3 (T+10 min)**: Full district-wide escalation.
   - *Manual "Widen Search Now"* override button for emergency situations.

2. **Database-Level Privacy Enforcement**:
   - Requesters can only query `public_donor_view` where phone numbers and names are structurally excluded.
   - Contact details are ONLY revealed via Postgres RPC (`reveal_match_contact`) after a donor explicitly clicks **"I Can Help"**.

3. **Strict 90-Day Medical Cooldown**:
   - Donors who donated within the last 90 days are never disturbed by matching algorithms.

4. **Real-Time OTP Verification**:
   - 6 individual auto-advancing input boxes with auto-submit on the 6th digit.
   - Shake animation + friendly error handling.
   - 60-second lockout after 3 failed attempts.
   - 30-second resend cooldown timer.

5. **Medical-Trust Design System**:
   - Palette: Cherry Red (`#990011`), Navy (`#1E2761`), Off-white (`#FCF6F5`).
   - Circular availability badge, 90-day cooldown circular SVG ring, concentric radar wave rings.

---

## 🛠️ Tech Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+), `@supabase/supabase-js` via CDN.
- **Backend & Database**: Supabase (Postgres, Row Level Security, Realtime, RPCs).
- **Authentication & SMS**: Supabase Auth + Twilio Verify.
- **Hosting**: Netlify / Vercel (Auto-deploy on GitHub push).

---

## 📦 Setup & Deployment Instructions

### 1. Supabase Database Setup
1. Create a free project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase Dashboard.
3. Run the SQL scripts in this exact order:
   - `supabase/schema.sql` (Creates tables: `donors`, `requests`, `matches` + Realtime publications)
   - `supabase/privacy_rls.sql` (Creates `public_donor_view`, RLS policies, and RPC matching/reveal functions)
   - `supabase/seed.sql` (Seeds 20 realistic sample donors across 7+ Kerala districts)

### 2. Twilio Verify SMS Integration (Supabase Auth)
1. Go to **Authentication > Providers > Phone** in your Supabase Dashboard.
2. Enable the **Phone** provider and select **Twilio Verify**.
3. Add your Twilio **Account SID**, **Auth Token**, and **Verify Service SID**.

### 3. Connect Frontend with Supabase
Open `config.js` or click **⚙️ Settings** in the app header and input:
- `SUPABASE_URL`: `https://<your-project-id>.supabase.co`
- `SUPABASE_ANON_KEY`: `eyJhbGciOi...`

*(Note: Viora also includes a built-in instant Demo/Mock mode with seed donors for zero-latency testing).*

### 4. Deploying to Netlify / Vercel
1. Push this repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: initial release of Viora blood matching app"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```
2. In Netlify or Vercel:
   - Click **Add New Site / Project** and import your GitHub repository.
   - Set publish directory to the root `/`.
   - Click **Deploy**!
