/**
 * Creates the first SYSTEM_ADMIN account. There is intentionally no public
 * signup route for this role (see lib/auth.ts) — this script is the only way
 * to create one.
 *
 * Usage:
 *   DATABASE_URL=postgres://... node scripts/seed-admin.js "Full Name" admin@example.com "a-strong-password"
 */
const { randomBytes, pbkdf2Sync, randomUUID } = require('crypto');
const { Client } = require('pg');

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = pbkdf2Sync(password, salt, 100_000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

async function main() {
  const [fullName, email, password] = process.argv.slice(2);
  if (!fullName || !email || !password) {
    console.error('Usage: node scripts/seed-admin.js "Full Name" admin@example.com "password"');
    process.exit(1);
  }
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is required.');
    process.exit(1);
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
  });
  await client.connect();

  const id = randomUUID();
  const passwordHash = hashPassword(password);

  await client.query(
    `INSERT INTO users (id, full_name, email, password_hash, role, is_active)
     VALUES ($1, $2, $3, $4, 'SYSTEM_ADMIN', true)`,
    [id, fullName, email, passwordHash]
  );

  console.log(`SYSTEM_ADMIN created: ${email} (id ${id})`);
  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
