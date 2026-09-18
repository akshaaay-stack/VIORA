-- ====================================================================
-- VIORA - Privacy-First Blood Donor Matching Database Schema
-- Target: PostgreSQL / Supabase
-- ====================================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Clean existing tables if needed
DROP VIEW IF EXISTS public.masked_matches_view CASCADE;
DROP VIEW IF EXISTS public.masked_donors_view CASCADE;
DROP TABLE IF EXISTS public.matches CASCADE;
DROP TABLE IF EXISTS public.requests CASCADE;
DROP TABLE IF EXISTS public.donors CASCADE;

-- 3. Donors Table
CREATE TABLE public.donors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    phone_verified BOOLEAN DEFAULT FALSE,
    blood_group TEXT NOT NULL CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    locality TEXT NOT NULL,
    district TEXT NOT NULL,
    last_donation_date DATE,
    available BOOLEAN DEFAULT TRUE,
    trust_score INTEGER DEFAULT 50 CHECK (trust_score BETWEEN 0 AND 100),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Requests Table
CREATE TABLE public.requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requester_name TEXT NOT NULL,
    requester_phone TEXT NOT NULL,
    blood_group_needed TEXT NOT NULL CHECK (blood_group_needed IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    locality TEXT NOT NULL,
    district TEXT NOT NULL,
    hospital_name TEXT NOT NULL,
    urgency TEXT DEFAULT 'urgent' CHECK (urgency IN ('normal', 'urgent')),
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'matched', 'fulfilled', 'cancelled')),
    current_wave INTEGER DEFAULT 1 CHECK (current_wave IN (1, 2, 3)),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Matches Table
CREATE TABLE public.matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID NOT NULL REFERENCES public.requests(id) ON DELETE CASCADE,
    donor_id UUID NOT NULL REFERENCES public.donors(id) ON DELETE CASCADE,
    wave_number INTEGER DEFAULT 1,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
    notified_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    responded_at TIMESTAMPTZ
);

-- Indexes for ultra-fast matching queries
CREATE INDEX idx_donors_matching ON public.donors (blood_group, district, locality, available);
CREATE INDEX idx_matches_request ON public.matches (request_id);
CREATE INDEX idx_matches_donor ON public.matches (donor_id);

-- ====================================================================
-- PRIVACY ENFORCEMENT LAYER (Database-Level Protection)
-- ====================================================================

-- Secure view: Requesters query this view to see matched donors.
-- CRITICAL PRIVACY RULE: Name and phone are OMITTED by definition in this view.
CREATE OR REPLACE VIEW public.masked_donors_view AS
SELECT 
    d.id AS donor_id,
    d.blood_group,
    d.locality,
    d.district,
    d.last_donation_date,
    d.available,
    d.trust_score,
    CASE 
        WHEN d.last_donation_date IS NULL THEN 999
        ELSE (CURRENT_DATE - d.last_donation_date)
    END AS days_since_last_donation,
    CASE 
        WHEN d.last_donation_date IS NULL THEN TRUE
        WHEN (CURRENT_DATE - d.last_donation_date) >= 90 THEN TRUE
        ELSE FALSE
    END AS is_cooldown_eligible
FROM public.donors d;

-- Secure View for Requester's active matches (Masked donor data only)
CREATE OR REPLACE VIEW public.masked_matches_view AS
SELECT 
    m.id AS match_id,
    m.request_id,
    m.donor_id,
    m.wave_number,
    m.status AS match_status,
    m.notified_at,
    m.responded_at,
    d.blood_group,
    d.locality,
    d.district,
    d.trust_score,
    d.days_since_last_donation,
    d.is_cooldown_eligible
FROM public.matches m
JOIN public.masked_donors_view d ON m.donor_id = d.donor_id;

-- Secure Function (RPC) to Reveal Contact Details ONLY IF match is accepted
CREATE OR REPLACE FUNCTION public.get_accepted_donor_contact(p_match_id UUID)
RETURNS TABLE (
    match_id UUID,
    donor_name TEXT,
    donor_phone TEXT,
    blood_group TEXT,
    hospital_name TEXT,
    urgency TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m.id AS match_id,
        d.name AS donor_name,
        d.phone AS donor_phone,
        d.blood_group,
        r.hospital_name,
        r.urgency
    FROM public.matches m
    JOIN public.donors d ON m.donor_id = d.id
    JOIN public.requests r ON m.request_id = r.id
    WHERE m.id = p_match_id AND m.status = 'accepted';
END;
$$;

-- Function to find & create wave 1 matches
CREATE OR REPLACE FUNCTION public.find_wave1_matches(p_request_id UUID)
RETURNS SETOF public.matches
LANGUAGE plpgsql
AS $$
DECLARE
    v_req public.requests%ROWTYPE;
BEGIN
    SELECT * INTO v_req FROM public.requests WHERE id = p_request_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Request not found';
    END IF;

    -- Match donors: same blood group, same locality, available = true, cooldown >= 90 days or null
    -- Insert top 3 ordered by trust_score DESC
    INSERT INTO public.matches (request_id, donor_id, wave_number, status)
    SELECT 
        v_req.id,
        d.id,
        1,
        'pending'
    FROM public.donors d
    WHERE d.blood_group = v_req.blood_group_needed
      AND d.locality = v_req.locality
      AND d.district = v_req.district
      AND d.available = TRUE
      AND (d.last_donation_date IS NULL OR (CURRENT_DATE - d.last_donation_date) >= 90)
    ORDER BY d.trust_score DESC
    LIMIT 3;

    RETURN QUERY SELECT * FROM public.matches WHERE request_id = p_request_id AND wave_number = 1;
END;
$$;

-- Function to escalate search to Wave 2 (Full District)
CREATE OR REPLACE FUNCTION public.escalate_to_wave2(p_request_id UUID)
RETURNS SETOF public.matches
LANGUAGE plpgsql
AS $$
DECLARE
    v_req public.requests%ROWTYPE;
BEGIN
    SELECT * INTO v_req FROM public.requests WHERE id = p_request_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Request not found';
    END IF;

    -- Update request wave
    UPDATE public.requests SET current_wave = 2 WHERE id = p_request_id;

    -- Insert district-level matches excluding already matched donors
    INSERT INTO public.matches (request_id, donor_id, wave_number, status)
    SELECT 
        v_req.id,
        d.id,
        2,
        'pending'
    FROM public.donors d
    WHERE d.blood_group = v_req.blood_group_needed
      AND d.district = v_req.district
      AND d.available = TRUE
      AND (d.last_donation_date IS NULL OR (CURRENT_DATE - d.last_donation_date) >= 90)
      AND d.id NOT IN (SELECT donor_id FROM public.matches WHERE request_id = p_request_id)
    ORDER BY d.trust_score DESC
    LIMIT 5;

    RETURN QUERY SELECT * FROM public.matches WHERE request_id = p_request_id;
END;
$$;

-- Enable Row Level Security (RLS)
ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Allow public read/write for prototype with anon key
CREATE POLICY "Allow anon select on donors" ON public.donors FOR SELECT USING (true);
CREATE POLICY "Allow anon insert on donors" ON public.donors FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update on donors" ON public.donors FOR UPDATE USING (true);

CREATE POLICY "Allow anon all on requests" ON public.requests FOR ALL USING (true);
CREATE POLICY "Allow anon all on matches" ON public.matches FOR ALL USING (true);
