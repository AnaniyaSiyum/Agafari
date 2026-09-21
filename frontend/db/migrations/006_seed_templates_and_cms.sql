-- =============================================================================
-- Migration 006: Seed starter templates & CMS sections
-- =============================================================================

INSERT INTO templates (id, name, preview_url, config_json, is_active) VALUES
  ('00000000-0000-0000-0000-000000000101', 'Classic Ivory', NULL, '{"palette":["#F8F5EF","#B08D57","#2E2A25"],"font":"serif"}', TRUE),
  ('00000000-0000-0000-0000-000000000102', 'Habesha Gold', NULL, '{"palette":["#0B3D2E","#D4AF37","#FFFFFF"],"font":"serif"}', TRUE),
  ('00000000-0000-0000-0000-000000000103', 'Modern Minimal', NULL, '{"palette":["#FFFFFF","#111111","#C9A27E"],"font":"sans"}', TRUE)
ON DUPLICATE KEY UPDATE name=name;

INSERT INTO cms_sections (section_key, content_json) VALUES
  ('memories_powered_by_agafari_card', '{"headline":"Memories, powered by your Agafari card","body":"Every wedding on Agafari comes with a shareable digital keepsake.","cta_label":"See how it works","cta_url":"/how-it-works"}'),
  ('packages', '{"headline":"Packages","tiers":[{"name":"Essential","price":"","features":["Coming-soon invitation page","RSVP + QR check-in"]},{"name":"Signature","price":"","features":["Everything in Essential","TikTok-style memory feed","Live broadcast"]}]}'),
  ('experience_agafari_live', '{"headline":"Experience Agafari, live","body":"Watch real weddings streaming right now.","cta_label":"Watch live","cta_url":"/live"}')
ON DUPLICATE KEY UPDATE section_key=section_key;
