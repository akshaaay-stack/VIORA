/**
 * VIORA - Supabase Client & API Helper Library
 * Supports Dev-Mode Server/Client-Side OTP generation & verification
 */

let _supabaseClient = null;

function getSupabase() {
  if (_supabaseClient) return _supabaseClient;

  const url = window.VIORA_CONFIG?.SUPABASE_URL;
  const key = window.VIORA_CONFIG?.SUPABASE_ANON_KEY;

  if (window.supabase && url && key && window.VIORA_CONFIG.isConfigured()) {
    try {
      _supabaseClient = window.supabase.createClient(url, key);
      return _supabaseClient;
    } catch (err) {
      console.warn("Could not initialize live Supabase client:", err);
    }
  }
  return null;
}

/**
 * Format phone to E.164 (+91XXXXXXXXXX)
 */
function formatE164Phone(phone) {
  if (!phone) return "";
  let cleaned = phone.replace(/[^0-9+]/g, '');
  if (cleaned.startsWith('+91')) {
    return cleaned;
  }
  if (cleaned.startsWith('91') && cleaned.length === 12) {
    return '+' + cleaned;
  }
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }
  if (cleaned.length === 10) {
    return '+91' + cleaned;
  }
  return cleaned.startsWith('+') ? cleaned : '+' + cleaned;
}

/**
 * Send / Generate Dev-Mode OTP
 * Stores code in database (or localStorage fallback) with 10-min expiry
 * Returns the 6-digit code to display in the on-screen DEV MODE banner
 */
async function sendDonorOtp(phone) {
  const formattedPhone = formatE164Phone(phone);
  const client = getSupabase();

  if (client) {
    // Call Supabase RPC generate_dev_otp
    const { data, error } = await client.rpc('generate_dev_otp', {
      p_phone: formattedPhone
    });

    if (error) {
      console.warn("generate_dev_otp RPC failed, falling back to direct table insert:", error);
      // Fallback: direct insert to otp_verifications table
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
      
      // Invalidate previous
      await client.from('otp_verifications').update({ consumed: true }).eq('phone', formattedPhone);
      
      await client.from('otp_verifications').insert([{
        phone: formattedPhone,
        otp_code: code,
        attempts: 0,
        expires_at: expiresAt,
        consumed: false
      }]);

      return { success: true, dev_mode: true, code, expires_at: expiresAt };
    }

    return {
      success: true,
      dev_mode: true,
      code: data.otp_code,
      expires_at: data.expires_at
    };
  } else {
    // Client-side local dev engine
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    const otpStore = JSON.parse(localStorage.getItem('viora_dev_otps') || '{}');
    // Resend invalidation: overwrite previous entry for this phone
    otpStore[formattedPhone] = {
      code: code,
      expires_at: expiresAt,
      attempts: 0,
      consumed: false
    };
    localStorage.setItem('viora_dev_otps', JSON.stringify(otpStore));

    return {
      success: true,
      dev_mode: true,
      code: code,
      expires_at: new Date(expiresAt).toISOString()
    };
  }
}

/**
 * Verify Dev-Mode OTP
 * Enforces: Exact 6-digit match, 10-min expiration, 3-attempt lockout
 */
async function verifyDonorOtp(phone, token) {
  const formattedPhone = formatE164Phone(phone);
  const client = getSupabase();

  if (client) {
    const { data, error } = await client.rpc('verify_dev_otp', {
      p_phone: formattedPhone,
      p_code: token.trim()
    });

    if (error) {
      console.warn("verify_dev_otp RPC failed, verifying via table query:", error);
      // Direct table verification fallback
      const { data: record, error: recError } = await client
        .from('otp_verifications')
        .select('*')
        .eq('phone', formattedPhone)
        .eq('consumed', false)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (recError || !record) {
        throw { error_type: 'NOT_FOUND', message: 'No active verification code found. Request a new one.' };
      }

      if (new Date() > new Date(record.expires_at)) {
        throw { error_type: 'EXPIRED', message: 'This code has expired — tap Resend to get a new one' };
      }

      if (record.attempts >= 3) {
        throw { error_type: 'LOCKED_OUT', message: 'Too many attempts. Please wait 60s.' };
      }

      if (record.otp_code !== token.trim()) {
        await client.from('otp_verifications').update({ attempts: record.attempts + 1 }).eq('id', record.id);
        throw { error_type: 'MISMATCH', message: "That code didn't match. Try again." };
      }

      // Valid!
      await client.from('otp_verifications').update({ consumed: true }).eq('id', record.id);
      await client.from('donors').update({ phone_verified: true }).eq('phone', formattedPhone);
      return { success: true };
    }

    if (!data.success) {
      throw {
        error_type: data.error_type || 'MISMATCH',
        message: data.message || "That code didn't match. Try again."
      };
    }

    return { success: true };
  } else {
    // Client-side local verification engine
    const otpStore = JSON.parse(localStorage.getItem('viora_dev_otps') || '{}');
    const entry = otpStore[formattedPhone];

    if (!entry || entry.consumed) {
      throw { error_type: 'NOT_FOUND', message: 'No active verification code found. Request a new one.' };
    }

    // Expiry check (10 minutes)
    if (Date.now() > entry.expires_at) {
      throw { error_type: 'EXPIRED', message: 'This code has expired — tap Resend to get a new one' };
    }

    // 3-attempt lockout check
    if (entry.attempts >= 3) {
      throw { error_type: 'LOCKED_OUT', message: 'Too many attempts. Please wait 60s.' };
    }

    // Code comparison
    if (entry.code !== token.trim()) {
      entry.attempts += 1;
      otpStore[formattedPhone] = entry;
      localStorage.setItem('viora_dev_otps', JSON.stringify(otpStore));
      throw { error_type: 'MISMATCH', attempts: entry.attempts, message: "That code didn't match. Try again." };
    }

    // Success: consume code
    entry.consumed = true;
    otpStore[formattedPhone] = entry;
    localStorage.setItem('viora_dev_otps', JSON.stringify(otpStore));

    return { success: true };
  }
}

/**
 * Save or Register a Donor
 */
async function registerDonor(donorData) {
  const formattedPhone = formatE164Phone(donorData.phone);
  const client = getSupabase();

  const payload = {
    name: donorData.name,
    phone: formattedPhone,
    phone_verified: donorData.phone_verified || false,
    blood_group: donorData.blood_group,
    locality: donorData.locality,
    district: donorData.district,
    last_donation_date: donorData.last_donation_date || null,
    available: donorData.available ?? true,
    trust_score: donorData.trust_score || 50
  };

  if (client) {
    const { data, error } = await client
      .from('donors')
      .upsert(payload, { onConflict: 'phone' })
      .select()
      .single();

    if (error) throw error;
    return data;
  } else {
    const donors = JSON.parse(localStorage.getItem('viora_demo_donors') || '[]');
    const existingIndex = donors.findIndex(d => d.phone === formattedPhone);
    const donorRecord = {
      id: existingIndex >= 0 ? donors[existingIndex].id : 'donor-' + Date.now(),
      ...payload
    };

    if (existingIndex >= 0) {
      donors[existingIndex] = donorRecord;
    } else {
      donors.push(donorRecord);
    }
    localStorage.setItem('viora_demo_donors', JSON.stringify(donors));
    return donorRecord;
  }
}

/**
 * Fetch Public Masked Donors for a Request Wave
 */
async function fetchEligibleDonors(requestId, bloodGroup, district, locality, wave = 1) {
  const client = getSupabase();

  if (client) {
    const { data, error } = await client.rpc('find_eligible_donors', {
      p_request_id: requestId,
      p_wave: wave
    });

    if (error) {
      console.warn("RPC call error, falling back to public_donor_view:", error);
      let query = client
        .from('public_donor_view')
        .select('*')
        .eq('blood_group', bloodGroup)
        .eq('available', true);

      if (wave === 1) {
        query = query.eq('locality', locality);
      } else {
        query = query.eq('district', district);
      }

      const { data: viewData, error: viewError } = await query
        .order('trust_score', { ascending: false })
        .limit(wave === 1 ? 3 : (wave === 2 ? 5 : 10));

      if (viewError) throw viewError;
      return viewData;
    }

    return data || [];
  } else {
    const seed = getDemoDonors();
    let matches = seed.filter(d => {
      const matchBlood = d.blood_group === bloodGroup;
      const isAvail = d.available !== false;
      const daysSince = d.last_donation_date 
        ? Math.floor((Date.now() - new Date(d.last_donation_date).getTime()) / (1000 * 60 * 60 * 24))
        : null;
      const cooldownOk = daysSince === null || daysSince >= 90;

      if (!matchBlood || !isAvail || !cooldownOk) return false;

      if (wave === 1) {
        return d.locality.toLowerCase() === locality.toLowerCase();
      } else {
        return d.district.toLowerCase() === district.toLowerCase();
      }
    });

    matches.sort((a, b) => (b.trust_score || 50) - (a.trust_score || 50));
    const limit = wave === 1 ? 3 : (wave === 2 ? 5 : 10);
    return matches.slice(0, limit).map(d => ({
      donor_id: d.id,
      id: d.id,
      blood_group: d.blood_group,
      locality: d.locality,
      district: d.district,
      trust_score: d.trust_score,
      days_since_donation: d.last_donation_date 
        ? Math.floor((Date.now() - new Date(d.last_donation_date).getTime()) / (1000 * 60 * 60 * 24))
        : null
    }));
  }
}

/**
 * Create Blood Request
 */
async function createBloodRequest(requestData) {
  const client = getSupabase();
  const payload = {
    requester_name: requestData.requester_name,
    requester_phone: formatE164Phone(requestData.requester_phone),
    blood_group_needed: requestData.blood_group_needed,
    locality: requestData.locality,
    district: requestData.district,
    hospital_name: requestData.hospital_name,
    urgency: requestData.urgency || 'normal',
    status: 'open',
    current_wave: 1
  };

  if (client) {
    const { data, error } = await client
      .from('requests')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    return data;
  } else {
    const requests = JSON.parse(localStorage.getItem('viora_demo_requests') || '[]');
    const newReq = {
      id: 'req-' + Date.now(),
      created_at: new Date().toISOString(),
      ...payload
    };
    requests.push(newReq);
    localStorage.setItem('viora_demo_requests', JSON.stringify(requests));
    return newReq;
  }
}

/**
 * Dispatch matches for Wave
 */
async function dispatchWaveMatches(requestId, donorIds, waveNumber) {
  const client = getSupabase();
  const matchRows = donorIds.map(donorId => ({
    request_id: requestId,
    donor_id: donorId,
    wave_number: waveNumber,
    status: 'pending'
  }));

  if (client) {
    const { data, error } = await client
      .from('matches')
      .insert(matchRows)
      .select();
    if (error) throw error;
    return data;
  } else {
    const matches = JSON.parse(localStorage.getItem('viora_demo_matches') || '[]');
    const created = matchRows.map((row, idx) => ({
      id: 'match-' + Date.now() + '-' + idx,
      ...row,
      notified_at: new Date().toISOString()
    }));
    matches.push(...created);
    localStorage.setItem('viora_demo_matches', JSON.stringify(matches));
    
    window.dispatchEvent(new CustomEvent('viora_match_created', { detail: created }));
    return created;
  }
}

/**
 * Donor Responds to Match (Accept / Decline)
 */
async function respondToMatch(matchId, status) {
  const client = getSupabase();
  const now = new Date().toISOString();

  if (client) {
    const { data, error } = await client
      .from('matches')
      .update({ status: status, responded_at: now })
      .eq('id', matchId)
      .select()
      .single();

    if (error) throw error;

    if (status === 'accepted') {
      await client
        .from('requests')
        .update({ status: 'matched' })
        .eq('id', data.request_id);
    }
    return data;
  } else {
    const matches = JSON.parse(localStorage.getItem('viora_demo_matches') || '[]');
    const match = matches.find(m => m.id === matchId);
    if (match) {
      match.status = status;
      match.responded_at = now;
      localStorage.setItem('viora_demo_matches', JSON.stringify(matches));

      if (status === 'accepted') {
        const requests = JSON.parse(localStorage.getItem('viora_demo_requests') || '[]');
        const req = requests.find(r => r.id === match.request_id);
        if (req) {
          req.status = 'matched';
          localStorage.setItem('viora_demo_requests', JSON.stringify(requests));
        }
      }
      window.dispatchEvent(new CustomEvent('viora_match_updated', { detail: match }));
    }
    return match;
  }
}

/**
 * Secure Contact Reveal (only allowed when match is accepted)
 */
async function revealContact(matchId) {
  const client = getSupabase();

  if (client) {
    const { data, error } = await client.rpc('reveal_match_contact', {
      p_match_id: matchId
    });
    if (error) throw error;
    return data;
  } else {
    const matches = JSON.parse(localStorage.getItem('viora_demo_matches') || '[]');
    const match = matches.find(m => m.id === matchId);
    if (!match || match.status !== 'accepted') {
      return { success: false, error: 'Match not accepted yet' };
    }

    const donors = getDemoDonors();
    const donor = donors.find(d => d.id === match.donor_id) || {
      name: 'Arjun Nair',
      phone: '+919847000001',
      blood_group: 'O+',
      locality: 'Kakkanad',
      district: 'Ernakulam',
      trust_score: 94
    };

    const requests = JSON.parse(localStorage.getItem('viora_demo_requests') || '[]');
    const req = requests.find(r => r.id === match.request_id) || {};

    return {
      success: true,
      match_id: match.id,
      status: 'accepted',
      donor: {
        name: donor.name,
        phone: donor.phone,
        blood_group: donor.blood_group,
        locality: donor.locality,
        district: donor.district,
        trust_score: donor.trust_score
      },
      requester: {
        name: req.requester_name || 'Rahul Kumar',
        phone: req.requester_phone || '+919847999888',
        hospital_name: req.hospital_name || 'Aster Medcity',
        locality: req.locality || 'Kakkanad',
        district: req.district || 'Ernakulam',
        urgency: req.urgency || 'urgent'
      }
    };
  }
}

function getDemoDonors() {
  const localDonors = JSON.parse(localStorage.getItem('viora_demo_donors') || '[]');
  if (localDonors.length > 0) return localDonors;

  const defaultSeed = [
    { id: 'd1', name: 'Arjun Nair', phone: '+919847000001', phone_verified: true, blood_group: 'O+', locality: 'Kakkanad', district: 'Ernakulam', last_donation_date: '2026-05-15', available: true, trust_score: 94 },
    { id: 'd2', name: 'Sneha Kurian', phone: '+919847000002', phone_verified: true, blood_group: 'O+', locality: 'Kakkanad', district: 'Ernakulam', last_donation_date: '2026-06-01', available: true, trust_score: 88 },
    { id: 'd3', name: 'Fahad Muhammed', phone: '+919847000003', phone_verified: true, blood_group: 'O+', locality: 'Edappally', district: 'Ernakulam', last_donation_date: '2026-04-10', available: true, trust_score: 92 },
    { id: 'd4', name: 'Ananya Menon', phone: '+919847000004', phone_verified: true, blood_group: 'A+', locality: 'Aluva', district: 'Ernakulam', last_donation_date: '2026-05-20', available: true, trust_score: 85 },
    { id: 'd5', name: 'Dr. Gautham Pillai', phone: '+919847000007', phone_verified: true, blood_group: 'O+', locality: 'Pattom', district: 'Thiruvananthapuram', last_donation_date: '2026-05-01', available: true, trust_score: 96 },
    { id: 'd6', name: 'Kavya Sreedharan', phone: '+919847000008', phone_verified: true, blood_group: 'O+', locality: 'Kowdiar', district: 'Thiruvananthapuram', last_donation_date: '2026-06-10', available: true, trust_score: 89 },
    { id: 'd7', name: 'Musthafa K.', phone: '+919847000011', phone_verified: true, blood_group: 'O+', locality: 'Mananchira', district: 'Kozhikode', last_donation_date: '2026-04-20', available: true, trust_score: 95 },
    { id: 'd8', name: 'Gopika Krishnan', phone: '+919847000014', phone_verified: true, blood_group: 'A+', locality: 'Swaraj Round', district: 'Thrissur', last_donation_date: '2026-03-15', available: true, trust_score: 93 },
    { id: 'd9', name: 'Mathew Joseph', phone: '+919847000016', phone_verified: true, blood_group: 'O+', locality: 'Kottayam Town', district: 'Kottayam', last_donation_date: '2026-03-01', available: true, trust_score: 90 },
    { id: 'd10', name: 'Shahid Rahman', phone: '+919847000019', phone_verified: true, blood_group: 'O+', locality: 'Manjeri', district: 'Malappuram', last_donation_date: '2026-05-25', available: true, trust_score: 92 }
  ];

  localStorage.setItem('viora_demo_donors', JSON.stringify(defaultSeed));
  return defaultSeed;
}
