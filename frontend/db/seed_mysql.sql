-- =============================================================================
-- AGAFARI (አጋፋሪ) WEDDING PLATFORM — MYSQL SEEDING SCRIPT
-- Seeds initial System Admin accounts, Templates, and CMS sections
-- =============================================================================

-- Seed Admin 1: admin@agafari.com / Admin123!
INSERT INTO users (id, email, password_hash, full_name, role)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'admin@agafari.com',
    'aed45470c364698363f897226c1574c0:355c98d94da839d30f9e37e45ce2ff46712d8a792d76c0501b44028114cda21f9cdb2e7a2e7fbe3b68fcebd1c737f267df401ce5c5bb61da134d8d0028d0450b',
    'System Super Admin',
    'SYSTEM_ADMIN'
) ON DUPLICATE KEY UPDATE email=email;

-- Seed Admin 2: admin@hamelmal.com / admin123
INSERT INTO users (id, email, password_hash, full_name, role)
VALUES (
    '00000000-0000-0000-0000-000000000010',
    'admin@hamelmal.com',
    '3254d6390a3312ec1d0196b73aab0536:9c54c2be1f321f514a099095800e3aaee89dd90e8087f05663694ce4bedf4d290b26069f06affbc016b1e2dddf55cb6d1743b3f77834ecc5eba5c7ac12c844c7',
    'System Admin (Hamelmal)',
    'SYSTEM_ADMIN'
) ON DUPLICATE KEY UPDATE email=email;

-- Seed Templates
INSERT INTO templates (id, name, preview_url, config_json, is_active) VALUES
('00000000-0000-0000-0000-000000000101', 'Classic Ivory', NULL, '{"palette":["#F8F5EF","#B08D57","#2E2A25"],"font":"serif"}', TRUE),
('00000000-0000-0000-0000-000000000102', 'Habesha Gold', NULL, '{"palette":["#0B3D2E","#D4AF37","#FFFFFF"],"font":"serif"}', TRUE),
('00000000-0000-0000-0000-000000000103', 'Modern Minimal', NULL, '{"palette":["#FFFFFF","#111111","#C9A27E"],"font":"sans"}', TRUE)
ON DUPLICATE KEY UPDATE name=name;

-- Seed CMS Sections
INSERT INTO cms_sections (section_key, content_json) VALUES
('memories_powered_by_agafari_card', '{"headline":"Memories, powered by your Agafari card","body":"Every wedding on Agafari comes with a shareable digital keepsake.","cta_label":"See how it works","cta_url":"/how-it-works"}'),
('packages', '{"headline":"Packages","tiers":[{"name":"Essential","price":"","features":["Coming-soon invitation page","RSVP + QR check-in"]},{"name":"Signature","price":"","features":["Everything in Essential","TikTok-style memory feed","Live broadcast"]}]}'),
('experience_agafari_live', '{"headline":"Experience Agafari, live","body":"Watch real weddings streaming right now.","cta_label":"Watch live","cta_url":"/live"}')
ON DUPLICATE KEY UPDATE section_key=section_key;
