import mysql from 'mysql2/promise';

async function verifySchema() {
  const conn = await mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '',
    database: 'agafari',
  });

  const [tables]: any = await conn.query('SHOW TABLES');
  const tableNames = tables.map((t: any) => Object.values(t)[0]);
  console.log('Database tables:', tableNames.filter((t: string) => ['users', 'memberships', 'account_requests', 'audit_log'].includes(t)));

  const [userCols]: any = await conn.query('DESCRIBE users');
  const colNames = userCols.map((c: any) => c.Field);
  console.log('Users columns:', colNames.filter((c: string) => ['phone', 'password_set_by', 'password_set_at', 'status', 'totp_secret', 'totp_enabled', 'session_version'].includes(c)));

  const [membershipCols]: any = await conn.query('DESCRIBE memberships');
  console.log('Memberships columns:', membershipCols.map((c: any) => c.Field));

  const [reqCols]: any = await conn.query('DESCRIBE account_requests');
  console.log('Account requests columns:', reqCols.map((c: any) => c.Field));

  const [auditCols]: any = await conn.query('DESCRIBE audit_log');
  console.log('Audit log columns:', auditCols.map((c: any) => c.Field));

  await conn.end();
}

verifySchema().catch((err) => {
  console.error('Schema verification error:', err);
  process.exit(1);
});
