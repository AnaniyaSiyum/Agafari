-- Seed file for Agafari Wedding Platform

-- 1. Insert default template
INSERT INTO templates (id, name, preview_url, config_json) 
VALUES (
    '11111111-1111-1111-1111-111111111111', 
    'Habesha Traditional Gold', 
    '/templates/habesha-gold.png', 
    '{"primaryColor":"#D4AF37","theme":"luxury"}'::jsonb
)
ON CONFLICT DO NOTHING;

-- 2. Insert System Admin (Password: Admin123!)
INSERT INTO users (id, email, password_hash, full_name, role)
VALUES (
    '00000000-0000-0000-0000-000000000001', 
    'admin@agafari.com', 
    'f53c93761b63031f4ef306065b11ae0a:a11b5b514cecfd36b43934135ea1df0d9223172f8954c07e5103950cacbda7ab6202e381ba6a1cddbf2278e084c4e1d7b1e867b886694224d1b761fe9dd958d1', 
    'System Admin', 
    'SYSTEM_ADMIN'
)
ON CONFLICT (email) DO NOTHING;

-- 3. Insert Event Organizer User (Password: Organizer123!)
INSERT INTO users (id, email, password_hash, full_name, role)
VALUES (
    '00000000-0000-0000-0000-000000000002', 
    'organizer@agafari.com', 
    'f53c93761b63031f4ef306065b11ae0a:a11b5b514cecfd36b43934135ea1df0d9223172f8954c07e5103950cacbda7ab6202e381ba6a1cddbf2278e084c4e1d7b1e867b886694224d1b761fe9dd958d1', 
    'Agafari Events Agency', 
    'EVENT_ORGANIZER'
)
ON CONFLICT (email) DO NOTHING;

-- 4. Insert Organizer Business Record
INSERT INTO organizers (id, owner_user_id, business_name, contact_phone)
VALUES (
    '00000000-0000-0000-0000-000000000003', 
    '00000000-0000-0000-0000-000000000002', 
    'Agafari Events Agency', 
    '+251911223344'
)
ON CONFLICT DO NOTHING;

-- 5. Insert Couple User (Password: Couple123!)
INSERT INTO users (id, email, password_hash, full_name, role)
VALUES (
    '00000000-0000-0000-0000-000000000004', 
    'couple@agafari.com', 
    'f53c93761b63031f4ef306065b11ae0a:a11b5b514cecfd36b43934135ea1df0d9223172f8954c07e5103950cacbda7ab6202e381ba6a1cddbf2278e084c4e1d7b1e867b886694224d1b761fe9dd958d1', 
    'Abenezer & Selam', 
    'BRIDE_GROOM'
)
ON CONFLICT (email) DO NOTHING;

-- 6. Insert Event
INSERT INTO events (
    id, slug, title, managed_by, organizer_id, couple_user_id, template_id,
    bride_name, groom_name, event_date, start_time, venue_name, venue_address,
    dress_code, welcome_message, status, admin_approval_status
) VALUES (
    '22222222-2222-2222-2222-222222222222',
    'abenezer-and-selam',
    'Abenezer & Selam Wedding Celebration',
    'ORGANIZER',
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000004',
    '11111111-1111-1111-1111-111111111111',
    'Selam Haile',
    'Abenezer Tadesse',
    NOW() + INTERVAL '30 days',
    '14:00',
    'Sheraton Addis Ballroom',
    'Taitu St, Addis Ababa, Ethiopia',
    'Traditional Habesha / Black Tie Optional',
    'Welcome to our special day! We are thrilled to celebrate with you.',
    'LIVE',
    'APPROVED'
) ON CONFLICT (slug) DO NOTHING;

-- 7. Insert Sample Invitation
INSERT INTO invitations (
    id, event_id, invite_code, invite_type, guest_name, guest_phone, max_guests, table_number, rsvp_status, qr_code_url
) VALUES (
    '33333333-3333-3333-3333-333333333333',
    '22222222-2222-2222-2222-222222222222',
    'AGAFARI-INV-1001',
    'CARD',
    'Solomon Kebede',
    '+251911000111',
    2,
    'Table 5 - VIP',
    'ATTENDING',
    'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=AGAFARI-INV-1001'
) ON CONFLICT (invite_code) DO NOTHING;

-- 8. Insert Sample CMS Sections
INSERT INTO cms_sections (section_key, content_json) VALUES
('memories_powered_by_agafari_card', '{"title":"Memories Powered by Agafari","subtitle":"Capture every unscripted smile, blessing, and dance step."}'::jsonb),
('packages', '{"title":"Our Packages","items":[{"name":"Silver","price":"25,000 ETB"},{"name":"Gold","price":"45,000 ETB"},{"name":"Platinum","price":"75,000 ETB"}]}'::jsonb),
('experience_agafari_live', '{"title":"Experience Agafari Live","description":"Watch real-time live streams and TikTok-style interactive guest feeds."}'::jsonb)
ON CONFLICT (section_key) DO NOTHING;
