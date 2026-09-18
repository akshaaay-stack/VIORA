-- ====================================================================
-- VIORA - Kerala Realistic Seed Data (All 14 Districts & Real Donors)
-- ====================================================================

-- Clean prior seed data
DELETE FROM public.matches;
DELETE FROM public.requests;
DELETE FROM public.donors;

-- Insert 18 realistic verified donors across Kerala
INSERT INTO public.donors (name, phone, phone_verified, blood_group, locality, district, last_donation_date, available, trust_score) VALUES
-- Ernakulam (Kakkanad, Edappally, Aluva, Kalamassery)
('Rahul Menon', '+919847123450', TRUE, 'O-', 'Kakkanad', 'Ernakulam', CURRENT_DATE - INTERVAL '112 days', TRUE, 94),
('Anjali Nair', '+919847123451', TRUE, 'O-', 'Edappally', 'Ernakulam', CURRENT_DATE - INTERVAL '95 days', TRUE, 88),
('Fahad Kabeer', '+919847123452', TRUE, 'O-', 'Kakkanad', 'Ernakulam', NULL, TRUE, 75),
('Gopika Krishnan', '+919847123453', TRUE, 'A+', 'Aluva', 'Ernakulam', CURRENT_DATE - INTERVAL '120 days', TRUE, 92),
('Mathew Thomas', '+919847123454', TRUE, 'B+', 'Kalamassery', 'Ernakulam', CURRENT_DATE - INTERVAL '40 days', FALSE, 85),
('Sneha Paul', '+919847123455', TRUE, 'O+', 'Fort Kochi', 'Ernakulam', CURRENT_DATE - INTERVAL '100 days', TRUE, 90),

-- Thiruvananthapuram (Pattom, Kowdiar, Technopark, Sreekaryam)
('Adarsh Varma', '+919847123456', TRUE, 'O-', 'Pattom', 'Thiruvananthapuram', CURRENT_DATE - INTERVAL '140 days', TRUE, 96),
('Devika Suresh', '+919847123457', TRUE, 'O-', 'Kowdiar', 'Thiruvananthapuram', CURRENT_DATE - INTERVAL '105 days', TRUE, 89),
('Vishnu Namboothiri', '+919847123458', TRUE, 'A-', 'Technopark', 'Thiruvananthapuram', CURRENT_DATE - INTERVAL '98 days', TRUE, 82),
('Arun Kumar', '+919847123459', TRUE, 'AB+', 'Sreekaryam', 'Thiruvananthapuram', NULL, TRUE, 70),

-- Kozhikode (Mananchira, Beypore, Koyilandy)
('Mohammed Nihal', '+919847123460', TRUE, 'O-', 'Mananchira', 'Kozhikode', CURRENT_DATE - INTERVAL '130 days', TRUE, 95),
('Aswathi Raj', '+919847123461', TRUE, 'B+', 'Beypore', 'Kozhikode', CURRENT_DATE - INTERVAL '150 days', TRUE, 91),
('Shyam Sundar', '+919847123462', TRUE, 'O+', 'Koyilandy', 'Kozhikode', CURRENT_DATE - INTERVAL '91 days', TRUE, 84),

-- Thrissur (Swaraj Round, Guruvayur, Chalakudy)
('Tony Joseph', '+919847123463', TRUE, 'O-', 'Swaraj Round', 'Thrissur', CURRENT_DATE - INTERVAL '110 days', TRUE, 93),
('Haritha Pillai', '+919847123464', TRUE, 'A+', 'Guruvayur', 'Thrissur', CURRENT_DATE - INTERVAL '102 days', TRUE, 87),

-- Kottayam (Kottayam Town, Changanassery, Pala)
('Roshni George', '+919847123465', TRUE, 'O-', 'Kottayam Town', 'Kottayam', CURRENT_DATE - INTERVAL '160 days', TRUE, 97),
('Jithin Varghese', '+919847123466', TRUE, 'AB-', 'Changanassery', 'Kottayam', CURRENT_DATE - INTERVAL '93 days', TRUE, 80),

-- Palakkad (Palakkad Town, Ottapalam)
('Sujith Ram', '+919847123467', TRUE, 'O-', 'Palakkad Town', 'Palakkad', CURRENT_DATE - INTERVAL '115 days', TRUE, 86);
