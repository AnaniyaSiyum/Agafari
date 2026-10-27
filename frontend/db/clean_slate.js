// AGAFARI PLATFORM — CLEAN SLATE RESET SCRIPT
// Leaves ONLY the single System Super Admin credentials (admin@agafari.com / admin123)
// Cleans all demo events, organizers, test users, and stale sessions.

const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

(async () => {
  const conn = await mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '',
    database: 'agafari',
    multipleStatements: true,
  });

  console.log('--- AGAFARI CLEAN SLATE: Starting ---');

  // Disable FK checks temporarily for clean cascade deletion
  await conn.query('SET FOREIGN_KEY_CHECKS = 0');

  const tablesToClear = [
    'post_likes',
    'media_comments',
    'media_assets',
    'wishes',
    'rsvps',
    'invitations',
    'gate_scan_logs',
    'event_staff',
    'event_locations',
    'live_streams',
    'mezmur_playlist',
    'events',
    'quota_groups',
    'account_requests',
    'organizers',
    'php_sessions',
    'php_rate_limits',
  ];

  for (const table of tablesToClear) {
    try {
      const [res] = await conn.query(`TRUNCATE TABLE ${table}`);
      console.log(`✓ Truncated table: ${table}`);
    } catch (err) {
      // If table does not exist or truncate fails, fallback to DELETE
      try {
        await conn.query(`DELETE FROM ${table}`);
        console.log(`✓ Deleted rows from: ${table}`);
      } catch (e) {
        console.log(`- Note on ${table}: ${e.message}`);
      }
    }
  }

  // Clear non-admin memberships
  try {
    await conn.query("DELETE FROM memberships WHERE role != 'SYSTEM_ADMIN' OR user_id != 'usr-admin-1'");
    console.log("✓ Cleared non-admin memberships");
  } catch (err) {
    console.log(`- Note on memberships: ${err.message}`);
  }

  // Clear non-admin users
  try {
    await conn.query("DELETE FROM users WHERE LOWER(email) != 'admin@agafari.com' AND id != 'usr-admin-1'");
    console.log("✓ Cleared all non-admin users");
  } catch (err) {
    console.log(`- Note on users: ${err.message}`);
  }

  // Re-enable FK checks
  await conn.query('SET FOREIGN_KEY_CHECKS = 1');

  // Ensure sole System Super Admin account exists with bcrypt password 'admin123'
  const adminId = 'usr-admin-1';
  const salt = bcrypt.genSaltSync(12);
  const adminHash = bcrypt.hashSync('admin123', salt);
  const adminTotpSecret = 'JBSWY3DPEHPK3PXPJBSWY3DPEHPK3PXP';

  // Check columns on users table
  const [cols] = await conn.query('DESCRIBE users');
  const colNames = cols.map(c => c.Field);

  let updateFields = [
    "email = 'admin@agafari.com'",
    "full_name = 'System Super Admin'",
    `password_hash = '${adminHash}'`,
    "role = 'SYSTEM_ADMIN'",
    "is_active = 1",
  ];

  if (colNames.includes('status')) updateFields.push("status = 'ACTIVE'");
  if (colNames.includes('totp_secret')) updateFields.push(`totp_secret = '${adminTotpSecret}'`);
  if (colNames.includes('totp_enabled')) updateFields.push("totp_enabled = 1");
  if (colNames.includes('session_version')) updateFields.push("session_version = 1");
  if (colNames.includes('password_set_by')) updateFields.push(`password_set_by = '${adminId}'`);

  const [existingAdmin] = await conn.query("SELECT id FROM users WHERE id = ? OR email = 'admin@agafari.com'", [adminId]);

  if (existingAdmin.length > 0) {
    await conn.query(`UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`, [existingAdmin[0].id]);
    console.log('✓ Updated existing System Super Admin record');
  } else {
    await conn.query(`
      INSERT INTO users (id, email, full_name, password_hash, role, is_active, status, totp_secret, totp_enabled, session_version)
      VALUES (?, 'admin@agafari.com', 'System Super Admin', ?, 'SYSTEM_ADMIN', 1, 'ACTIVE', ?, 1, 1)
    `, [adminId, adminHash, adminTotpSecret]);
    console.log('✓ Inserted fresh System Super Admin record');
  }

  // Ensure membership exists for admin
  await conn.query(`
    INSERT INTO memberships (id, user_id, role, scope_type, scope_id, status)
    VALUES ('mem-admin-1', ?, 'SYSTEM_ADMIN', 'PLATFORM', 'global', 'ACTIVE')
    ON DUPLICATE KEY UPDATE status = 'ACTIVE', role = 'SYSTEM_ADMIN', scope_type = 'PLATFORM', scope_id = 'global'
  `, [adminId]);
  console.log('✓ Ensured System Super Admin platform membership');

  // Verification report
  console.log('\n--- VERIFICATION AUDIT ---');
  const [users] = await conn.query('SELECT id, email, full_name, role, is_active FROM users');
  console.log('Users count in database:', users.length);
  users.forEach(u => console.log(' -> User:', u.email, '| Role:', u.role, '| Active:', u.is_active));

  const [memberships] = await conn.query('SELECT id, user_id, role, scope_type, status FROM memberships');
  console.log('Memberships count in database:', memberships.length);
  memberships.forEach(m => console.log(' -> Membership:', m.id, '| Role:', m.role, '| Scope:', m.scope_type));

  const [events] = await conn.query('SELECT COUNT(*) as count FROM events');
  console.log('Events count in database:', events[0].count);

  const [organizers] = await conn.query('SELECT COUNT(*) as count FROM organizers');
  console.log('Organizers count in database:', organizers[0].count);

  const [invitations] = await conn.query('SELECT COUNT(*) as count FROM invitations');
  console.log('Invitations count in database:', invitations[0].count);

  const [wishes] = await conn.query('SELECT COUNT(*) as count FROM wishes');
  console.log('Wishes count in database:', wishes[0].count);

  await conn.end();
  console.log('\n=== Platform Clean Slate Completed Successfully ===');
})().catch(err => {
  console.error('FATAL clean slate error:', err);
  process.exit(1);
});
