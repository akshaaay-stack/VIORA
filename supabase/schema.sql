-- ============================================================================
-- VIORA: Supabase Schema Definition
-- Privacy-first Blood Donor Matching for Kerala
-- ============================================================================

-- Enable pgcrypto for gen_random_uuid
create extension if not exists pgcrypto;

-- 1. Create donors table
create table if not exists donors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text unique not null,
  phone_verified boolean default false,
  blood_group text not null check (blood_group in ('A+','A-','B+','B-','O+','O-','AB+','AB-')),
  locality text not null,
  district text not null,
  last_donation_date date,
  available boolean default true,
  trust_score numeric default 50 check (trust_score >= 0 and trust_score <= 100),
  auth_user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Create requests table
create table if not exists requests (
  id uuid primary key default gen_random_uuid(),
  requester_name text not null,
  requester_phone text not null,
  blood_group_needed text not null check (blood_group_needed in ('A+','A-','B+','B-','O+','O-','AB+','AB-')),
  locality text not null,
  district text not null,
  hospital_name text not null,
  urgency text check (urgency in ('normal','urgent')) default 'normal',
  status text check (status in ('open','matched','fulfilled','cancelled')) default 'open',
  current_wave int default 1 check (current_wave >= 1 and current_wave <= 3),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Create matches table
create table if not exists matches (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references requests(id) on delete cascade,
  donor_id uuid not null references donors(id) on delete cascade,
  wave_number int not null check (wave_number >= 1 and wave_number <= 3),
  status text check (status in ('pending','accepted','declined')) default 'pending',
  notified_at timestamptz default now(),
  responded_at timestamptz,
  created_at timestamptz default now()
);

-- 4. Create OTP verifications table (Dev Mode & Server-Side OTP Storage)
create table if not exists otp_verifications (
  id uuid primary key default gen_random_uuid(),
  phone text not null,
  otp_code text not null,
  attempts int default 0,
  expires_at timestamptz not null default (now() + interval '10 minutes'),
  consumed boolean default false,
  created_at timestamptz default now()
);

-- Indexes for fast matching queries & OTP lookups
create index if not exists idx_donors_matching 
  on donors(blood_group, district, locality, available, last_donation_date, trust_score desc);

create index if not exists idx_donors_phone 
  on donors(phone);

create index if not exists idx_matches_request 
  on matches(request_id);

create index if not exists idx_matches_donor 
  on matches(donor_id);

create index if not exists idx_requests_status 
  on requests(status, created_at desc);

create index if not exists idx_otp_phone 
  on otp_verifications(phone, consumed, expires_at);

-- Add tables to realtime publication if not already present
do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'requests') then
    alter publication supabase_realtime add table requests;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'matches') then
    alter publication supabase_realtime add table matches;
  end if;
end $$;
