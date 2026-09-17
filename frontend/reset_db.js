const { Pool } = require('pg');
const crypto = require('crypto');

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

const pool = new Pool({ connectionString: 'postgres://postgres@localhost:5432/agafari' });

async function resetDb() {
  try {
    await pool.query('DELETE FROM media_comments');
    await pool.query('DELETE FROM post_likes');
    await pool.query('DELETE FROM media_assets');
    await pool.query('DELETE FROM wishes');
    await pool.query('DELETE FROM rsvps');
    await pool.query('DELETE FROM invitations');
    await pool.query('DELETE FROM event_locations');
    await pool.query('DELETE FROM event_staff');
    await pool.query('DELETE FROM live_streams');
    await pool.query('DELETE FROM mezmur_playlist');
    await pool.query('DELETE FROM events');
    await pool.query('DELETE FROM organizers');
    await pool.query('DELETE FROM users');
    
    // Seed System Super Admin accounts
    // Admin 1: admin@agafari.com / Admin123!
    await pool.query(
      `INSERT INTO users (id, email, password_hash, full_name, role)
       VALUES ('00000000-0000-0000-0000-000000000001', 'admin@agafari.com', $1, 'System Super Admin', 'SYSTEM_ADMIN')`,
      [hashPassword('Admin123!')]
    );

    // Admin 2: admin@hamelmal.com / admin123
    await pool.query(
      `INSERT INTO users (id, email, password_hash, full_name, role)
       VALUES ('00000000-0000-0000-0000-000000000010', 'admin@hamelmal.com', $1, 'System Admin (Hamelmal)', 'SYSTEM_ADMIN')`,
      [hashPassword('admin123')]
    );

    // Seed Templates
    await pool.query(
      `INSERT INTO templates (id, name, preview_url, config_json, is_active) VALUES
       ('00000000-0000-0000-0000-000000000101', 'Classic Ivory', NULL, '{"palette":["#F8F5EF","#B08D57","#2E2A25"],"font":"serif"}', TRUE),
       ('00000000-0000-0000-0000-000000000102', 'Habesha Gold', NULL, '{"palette":["#0B3D2E","#D4AF37","#FFFFFF"],"font":"serif"}', TRUE),
       ('00000000-0000-0000-0000-000000000103', 'Modern Minimal', NULL, '{"palette":["#FFFFFF","#111111","#C9A27E"],"font":"sans"}', TRUE)
       ON CONFLICT DO NOTHING`
    );

    // Seed CMS Sections
    await pool.query(
      `INSERT INTO cms_sections (section_key, content_json) VALUES
       ('memories_powered_by_agafari_card', '{"headline":"Memories, powered by your Agafari card","body":"Every wedding on Agafari comes with a shareable digital keepsake.","cta_label":"See how it works","cta_url":"/how-it-works"}'),
       ('packages', '{"headline":"Packages","tiers":[{"name":"Essential","price":"","features":["Coming-soon invitation page","RSVP + QR check-in"]},{"name":"Signature","price":"","features":["Everything in Essential","TikTok-style memory feed","Live broadcast"]}]}'),
       ('experience_agafari_live', '{"headline":"Experience Agafari, live","body":"Watch real weddings streaming right now.","cta_label":"Watch live","cta_url":"/live"}')
       ON CONFLICT (section_key) DO NOTHING`
    );

    console.log('Database successfully reset to clean System Super Admin state!');
  } catch (err) {
    console.error('Reset failed:', err);
  } finally {
    await pool.end();
  }
}

resetDb();

