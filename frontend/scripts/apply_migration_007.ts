import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: parseInt(process.env.MYSQL_PORT || '3306', 10),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'agafari',
    multipleStatements: true,
  });

  console.log('Connected to MySQL. Applying migration 007...');
  const sql = fs.readFileSync(path.join(__dirname, '../db/migrations/007_admin_controlled_auth.sql'), 'utf-8');
  await connection.query(sql);
  console.log('Migration 007 applied successfully!');
  await connection.end();
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
