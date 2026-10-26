// Run DB migration for Agafari - security tables + demo data + role fix
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

(async () => {
  const conn = await mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '',
    database: 'agafari',
    multipleStatements: true,
  });

  const sqlFile = path.join(__dirname, 'migration_security_and_demo.sql');
  const raw = fs.readFileSync(sqlFile, 'utf8');

  console.log('Running migration_security_and_demo.sql...');
  await conn.query(raw);
  console.log('Migration executed successfully!');

  // Verification queries
  console.log('\n--- Verification ---');
  const [u] = await conn.query("SELECT email, role FROM users WHERE email IN ('kebron@gmail.com','sara@agafari.com')");
  u.forEach(r => console.log('User:', r.email, '=>', r.role));

  const [ev] = await conn.query("SELECT slug, status FROM events ORDER BY created_at");
  ev.forEach(r => console.log('Event:', r.slug, '=>', r.status));

  const [inv] = await conn.query("SELECT COUNT(*) as cnt FROM invitations WHERE event_id='evt-sara-and-dawit-2026'");
  console.log('Sara invitations:', inv[0].cnt);

  const [wi] = await conn.query("SELECT COUNT(*) as cnt FROM wishes WHERE event_id='evt-sara-and-dawit-2026'");
  console.log('Sara wishes:', wi[0].cnt);

  const [s] = await conn.query("SHOW TABLES LIKE 'php_sessions'");
  console.log('php_sessions table:', s.length ? 'EXISTS ✓' : 'MISSING ✗');

  const [rl] = await conn.query("SHOW TABLES LIKE 'php_rate_limits'");
  console.log('php_rate_limits table:', rl.length ? 'EXISTS ✓' : 'MISSING ✗');

  await conn.end();
})().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
