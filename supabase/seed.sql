-- ============================================================================
-- VIORA: Seed Data for Kerala Donors
-- Spread across 7+ Districts with realistic blood groups, cooldowns & trust scores
-- ============================================================================

-- Clean existing seed data if needed
delete from matches;
delete from requests;
delete from donors;

insert into donors (name, phone, phone_verified, blood_group, locality, district, last_donation_date, available, trust_score) values
-- Ernakulam (Kakkanad, Edappally, Aluva, Fort Kochi)
('Arjun Nair', '+919847000001', true, 'O+', 'Kakkanad', 'Ernakulam', current_date - interval '112 days', true, 94),
('Sneha Kurian', '+919847000002', true, 'O+', 'Kakkanad', 'Ernakulam', current_date - interval '95 days', true, 88),
('Fahad Muhammed', '+919847000003', true, 'O+', 'Edappally', 'Ernakulam', current_date - interval '140 days', true, 92),
('Ananya Menont', '+919847000004', true, 'A+', 'Aluva', 'Ernakulam', current_date - interval '100 days', true, 85),
('Rohit Varghese', '+919847000005', true, 'B+', 'Fort Kochi', 'Ernakulam', null, true, 78),
('Nikhila Joy', '+919847000006', true, 'O-', 'Kakkanad', 'Ernakulam', current_date - interval '200 days', true, 97),

-- Thiruvananthapuram (Pattom, Kowdiar, Technopark)
('Dr. Gautham Pillai', '+919847000007', true, 'O+', 'Pattom', 'Thiruvananthapuram', current_date - interval '120 days', true, 96),
('Kavya Sreedharan', '+919847000008', true, 'O+', 'Kowdiar', 'Thiruvananthapuram', current_date - interval '92 days', true, 89),
('Vipin Das', '+919847000009', true, 'A-', 'Technopark', 'Thiruvananthapuram', current_date - interval '110 days', true, 91),
('Aparna Ramesh', '+919847000010', true, 'B+', 'Pattom', 'Thiruvananthapuram', current_date - interval '30 days', false, 82), -- on cooldown / unavailable

-- Kozhikode (Mananchira, Beypore)
('Musthafa K.', '+919847000011', true, 'O+', 'Mananchira', 'Kozhikode', current_date - interval '130 days', true, 95),
('Devika Nambiar', '+919847000012', true, 'AB+', 'Beypore', 'Kozhikode', current_date - interval '105 days', true, 84),
('Ashwin Raj', '+919847000013', true, 'O+', 'Beypore', 'Kozhikode', current_date - interval '98 days', true, 87),

-- Thrissur (Swaraj Round, Guruvayur)
('Gopika Krishnan', '+919847000014', true, 'A+', 'Swaraj Round', 'Thrissur', current_date - interval '150 days', true, 93),
('Joji Thomas', '+919847000015', true, 'O+', 'Guruvayur', 'Thrissur', current_date - interval '91 days', true, 86),

-- Kottayam (Kottayam Town, Changanassery)
('Mathew Joseph', '+919847000016', true, 'O+', 'Kottayam Town', 'Kottayam', current_date - interval '160 days', true, 90),
('Reshma Mohan', '+919847000017', true, 'B-', 'Changanassery', 'Kottayam', null, true, 80),

-- Kollam (Chinnakada, Karunagappally)
('Bilal Ahmed', '+919847000018', true, 'O+', 'Chinnakada', 'Kollam', current_date - interval '115 days', true, 88),

-- Malappuram (Manjeri, Kottakkal)
('Shahid Rahman', '+919847000019', true, 'O+', 'Manjeri', 'Malappuram', current_date - interval '102 days', true, 92),
('Fathima Hameed', '+919847000020', true, 'AB-', 'Kottakkal', 'Malappuram', current_date - interval '180 days', true, 95);
