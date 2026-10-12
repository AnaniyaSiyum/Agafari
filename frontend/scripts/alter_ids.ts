import { query } from '../src/lib/db';

async function main() {
  await query('ALTER TABLE users MODIFY password_hash VARCHAR(255) NULL');
  await query('ALTER TABLE audit_log MODIFY id VARCHAR(64)');
  await query('ALTER TABLE memberships MODIFY id VARCHAR(64)');
  await query('ALTER TABLE account_requests MODIFY id VARCHAR(64)');
  console.log('Altered id columns and password_hash successfully');
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
