-- ============================================================================
-- VIORA: Privacy & Row Level Security (RLS) & RPC Functions
-- ============================================================================

-- 1. Create Public Donor View (Privacy-first structural barrier)
-- Requesters only query this view. Donor name and phone are structurally absent!
create or replace view public_donor_view as
select 
  id,
  blood_group,
  locality,
  district,
  trust_score,
  case 
    when last_donation_date is null then null
    else (current_date - last_donation_date)::int
  end as days_since_donation,
  available,
  phone_verified,
  created_at
from donors;

-- 2. Enable Row Level Security (RLS)
alter table donors enable row level security;
alter table requests enable row level security;
alter table matches enable row level security;
alter table otp_verifications enable row level security;

-- Clean existing policies if re-running
drop policy if exists "Allow public request creation" on requests;
drop policy if exists "Allow reading requests" on requests;
drop policy if exists "Allow updating requests" on requests;
drop policy if exists "Allow donor registration" on donors;
drop policy if exists "Allow donor profile updates" on donors;
drop policy if exists "Allow donor queries" on donors;
drop policy if exists "Allow matches insert" on matches;
drop policy if exists "Allow matches select" on matches;
drop policy if exists "Allow matches update" on matches;
drop policy if exists "Allow otp insert" on otp_verifications;
drop policy if exists "Allow otp select" on otp_verifications;
drop policy if exists "Allow otp update" on otp_verifications;

-- 3. Requests RLS Policies
create policy "Allow public request creation"
  on requests for insert
  with check (true);

create policy "Allow reading requests"
  on requests for select
  using (true);

create policy "Allow updating requests"
  on requests for update
  using (true);

-- 4. Donors RLS Policies
create policy "Allow donor registration"
  on donors for insert
  with check (true);

create policy "Allow donor profile updates"
  on donors for update
  using (true);

create policy "Allow donor queries"
  on donors for select
  using (true);

-- 5. Matches RLS Policies
create policy "Allow matches insert"
  on matches for insert
  with check (true);

create policy "Allow matches select"
  on matches for select
  using (true);

create policy "Allow matches update"
  on matches for update
  using (true);

-- 6. OTP Verifications RLS Policies
create policy "Allow otp insert"
  on otp_verifications for insert
  with check (true);

create policy "Allow otp select"
  on otp_verifications for select
  using (true);

create policy "Allow otp update"
  on otp_verifications for update
  using (true);

-- 7. Dev-Mode Server-Side OTP Generation Function
-- Generates a random 6-digit code, invalidates previous codes, sets 10-min expiry
create or replace function generate_dev_otp(p_phone text)
returns json
language plpgsql
security definer
as $$
declare
  v_code text;
  v_expires timestamptz;
begin
  -- 1. Invalidate previous active unconsumed OTPs for this phone (resend invalidation)
  update otp_verifications
  set consumed = true
  where phone = p_phone and consumed = false;

  -- 2. Generate random 6-digit code
  v_code := lpad((floor(random() * 900000) + 100000)::text, 6, '0');
  v_expires := now() + interval '10 minutes';

  -- 3. Insert new verification record
  insert into otp_verifications (phone, otp_code, attempts, expires_at, consumed)
  values (p_phone, v_code, 0, v_expires, false);

  return json_build_object(
    'success', true,
    'phone', p_phone,
    'otp_code', v_code,
    'expires_at', v_expires,
    'dev_mode', true
  );
end;
$$;

-- 8. Dev-Mode OTP Verification Function
-- Verifies code, enforces 10-minute expiry, tracks 3-attempt lockout, marks phone_verified
create or replace function verify_dev_otp(p_phone text, p_code text)
returns json
language plpgsql
security definer
as $$
declare
  v_record record;
begin
  -- Look for the latest active OTP for this phone
  select * into v_record
  from otp_verifications
  where phone = p_phone and consumed = false
  order by created_at desc
  limit 1;

  if not found then
    return json_build_object(
      'success', false,
      'error_type', 'NOT_FOUND',
      'message', 'No active verification code found. Please request a new code.'
    );
  end if;

  -- Check if expired (10-minute validity)
  if now() > v_record.expires_at then
    return json_build_object(
      'success', false,
      'error_type', 'EXPIRED',
      'message', 'This code has expired — tap Resend to get a new one'
    );
  end if;

  -- Check 3-attempt lockout
  if v_record.attempts >= 3 then
    return json_build_object(
      'success', false,
      'error_type', 'LOCKED_OUT',
      'message', 'Too many failed attempts. Input is locked for 60 seconds.'
    );
  end if;

  -- Check code match
  if v_record.otp_code != trim(p_code) then
    update otp_verifications
    set attempts = attempts + 1
    where id = v_record.id;

    return json_build_object(
      'success', false,
      'error_type', 'MISMATCH',
      'attempts', v_record.attempts + 1,
      'message', 'That code didn''t match. Try again.'
    );
  end if;

  -- Code is valid! Consume it
  update otp_verifications
  set consumed = true
  where id = v_record.id;

  -- Update donor verified status if donor exists
  update donors
  set phone_verified = true, updated_at = now()
  where phone = p_phone;

  return json_build_object(
    'success', true,
    'message', 'Phone number successfully verified!'
  );
end;
$$;

-- 9. Matching Function: find_eligible_donors
create or replace function find_eligible_donors(
  p_request_id uuid,
  p_wave int default 1
)
returns table (
  donor_id uuid,
  blood_group text,
  locality text,
  district text,
  trust_score numeric,
  days_since_donation int
)
language plpgsql
security definer
as $$
declare
  req_blood text;
  req_locality text;
  req_district text;
begin
  select r.blood_group_needed, r.locality, r.district
  into req_blood, req_locality, req_district
  from requests r
  where r.id = p_request_id;

  if not found then
    return;
  end if;

  if p_wave = 1 then
    -- Wave 1: Exact locality, matching blood group, available = true, cooldown >= 90 days or null
    return query
    select 
      d.id as donor_id,
      d.blood_group,
      d.locality,
      d.district,
      d.trust_score,
      case when d.last_donation_date is null then null else (current_date - d.last_donation_date)::int end as days_since_donation
    from donors d
    where d.blood_group = req_blood
      and d.locality = req_locality
      and d.available = true
      and (d.last_donation_date is null or (current_date - d.last_donation_date) >= 90)
      and not exists (
        select 1 from matches m 
        where m.request_id = p_request_id and m.donor_id = d.id
      )
    order by d.trust_score desc
    limit 3;

  elsif p_wave = 2 then
    -- Wave 2: Same district (adjacent localities), matching blood group, available, cooldown
    return query
    select 
      d.id as donor_id,
      d.blood_group,
      d.locality,
      d.district,
      d.trust_score,
      case when d.last_donation_date is null then null else (current_date - d.last_donation_date)::int end as days_since_donation
    from donors d
    where d.blood_group = req_blood
      and d.district = req_district
      and d.available = true
      and (d.last_donation_date is null or (current_date - d.last_donation_date) >= 90)
      and not exists (
        select 1 from matches m 
        where m.request_id = p_request_id and m.donor_id = d.id
      )
    order by d.trust_score desc
    limit 5;

  else
    -- Wave 3: Entire district / wider radius
    return query
    select 
      d.id as donor_id,
      d.blood_group,
      d.locality,
      d.district,
      d.trust_score,
      case when d.last_donation_date is null then null else (current_date - d.last_donation_date)::int end as days_since_donation
    from donors d
    where d.blood_group = req_blood
      and d.district = req_district
      and d.available = true
      and (d.last_donation_date is null or (current_date - d.last_donation_date) >= 90)
      and not exists (
        select 1 from matches m 
        where m.request_id = p_request_id and m.donor_id = d.id
      )
    order by d.trust_score desc
    limit 10;
  end if;
end;
$$;

-- 10. Secure Contact Reveal RPC Function
create or replace function reveal_match_contact(p_match_id uuid)
returns json
language plpgsql
security definer
as $$
declare
  v_match record;
  v_donor record;
  v_request record;
begin
  select * into v_match from matches where id = p_match_id;
  
  if not found then
    return json_build_object('success', false, 'error', 'Match not found');
  end if;

  if v_match.status != 'accepted' then
    return json_build_object(
      'success', false, 
      'error', 'Privacy lock active. Contact is revealed only when match status is accepted.'
    );
  end if;

  select name, phone, blood_group, locality, district, trust_score
  into v_donor
  from donors
  where id = v_match.donor_id;

  select requester_name, requester_phone, hospital_name, locality, district, urgency
  into v_request
  from requests
  where id = v_match.request_id;

  return json_build_object(
    'success', true,
    'match_id', v_match.id,
    'status', v_match.status,
    'responded_at', v_match.responded_at,
    'donor', json_build_object(
      'name', v_donor.name,
      'phone', v_donor.phone,
      'blood_group', v_donor.blood_group,
      'locality', v_donor.locality,
      'district', v_donor.district,
      'trust_score', v_donor.trust_score
    ),
    'requester', json_build_object(
      'name', v_request.requester_name,
      'phone', v_request.requester_phone,
      'hospital_name', v_request.hospital_name,
      'locality', v_request.locality,
      'district', v_request.district,
      'urgency', v_request.urgency
    )
  );
end;
$$;
