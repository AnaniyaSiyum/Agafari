-- =============================================================================
-- Phase 3e — starter content. Run once, after all schema/migration files.
-- Safe to re-run (ON CONFLICT DO NOTHING) — won't duplicate or clobber content
-- an admin has already edited through /api/admin/cms or /api/admin/templates.
-- =============================================================================

INSERT INTO templates (name, preview_url, config_json, is_active) VALUES
  ('Classic Ivory', NULL, '{"palette":["#F8F5EF","#B08D57","#2E2A25"],"font":"serif"}', TRUE),
  ('Habesha Gold', NULL, '{"palette":["#0B3D2E","#D4AF37","#FFFFFF"],"font":"serif"}', TRUE),
  ('Modern Minimal', NULL, '{"palette":["#FFFFFF","#111111","#C9A27E"],"font":"sans"}', TRUE)
ON CONFLICT DO NOTHING;

INSERT INTO cms_sections (section_key, content_json) VALUES
  ('memories_powered_by_agafari_card', '{"headline":"Memories, powered by your Agafari card","body":"Every wedding on Agafari comes with a shareable digital keepsake.","cta_label":"See how it works","cta_url":"/how-it-works"}'),
  ('packages', '{"headline":"Packages","tiers":[{"name":"Essential","price":"","features":["Coming-soon invitation page","RSVP + QR check-in"]},{"name":"Signature","price":"","features":["Everything in Essential","TikTok-style memory feed","Live broadcast"]}]}'),
  ('experience_agafari_live', '{"headline":"Experience Agafari, live","body":"Watch real weddings streaming right now.","cta_label":"Watch live","cta_url":"/live"}')
ON CONFLICT (section_key) DO NOTHING;
