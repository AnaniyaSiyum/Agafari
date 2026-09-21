import fs from 'fs';
import path from 'path';
import { query } from '../../src/lib/db';

const migrationsDir = path.join(process.cwd(), 'db', 'migrations');

const migrationFiles = [
  '001_schema.sql',
  '002_add_foreign_key_indexes.sql',
  '003_gate_scan_logs.sql',
  '004_quota_groups.sql',
  '005_template_lock.sql',
  '006_seed_templates_and_cms.sql'
];

async function runMigrations() {
  console.log('=== Item 3 Migration Order Execution Test ===\n');

  try {
    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file);
      console.log(`Executing migration: db/migrations/${file}...`);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      // Split statements on semicolon if needed or run via db query helper
      const statements = sql
        .split(/;\s*$/m)
        .map(s => s.trim())
        .filter(s => s.length > 0);

      for (const stmt of statements) {
        await query(stmt);
      }
      console.log(`  ✓ Successfully executed ${file}`);
    }
    console.log('\n✅ ALL 6 MIGRATIONS EXECUTED CLEANLY WITH ZERO ERRORS');
  } catch (err) {
    console.error('\n❌ Migration execution failed:', err);
    process.exitCode = 1;
  }
}

runMigrations();
