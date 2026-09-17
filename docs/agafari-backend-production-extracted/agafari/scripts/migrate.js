/**
 * Minimal, dependency-free migration runner.
 *
 * Runs db/001_schema.sql, then every file in db/migrations/ in filename
 * order (002_, 003_, ...), inside a single transaction per file. Tracks
 * what's already been applied in a `schema_migrations` table so re-running
 * this script is safe.
 *
 * Usage:
 *   DATABASE_URL=postgres://... node scripts/migrate.js
 */
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL is required.');
    process.exit(1);
  }

  const client = new Client({
    connectionString,
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
  });
  await client.connect();

  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      filename TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
  `);

  const dbDir = path.join(__dirname, '..', 'db');
  const files = [
    '001_schema.sql',
    ...fs
      .readdirSync(path.join(dbDir, 'migrations'))
      .filter((f) => f.endsWith('.sql'))
      .sort()
      .map((f) => path.join('migrations', f)),
  ];

  for (const rel of files) {
    const { rows } = await client.query('SELECT 1 FROM schema_migrations WHERE filename = $1', [rel]);
    if (rows.length) {
      console.log(`skip  ${rel} (already applied)`);
      continue;
    }
    const sql = fs.readFileSync(path.join(dbDir, rel), 'utf8');
    console.log(`apply ${rel} ...`);
    try {
      await client.query('BEGIN');
      await client.query(sql);
      await client.query('INSERT INTO schema_migrations (filename) VALUES ($1)', [rel]);
      await client.query('COMMIT');
      console.log(`  ok`);
    } catch (err) {
      await client.query('ROLLBACK');
      console.error(`  FAILED: ${rel}`);
      console.error(err.message);
      process.exit(1);
    }
  }

  await client.end();
  console.log('All migrations applied.');
}

main();
