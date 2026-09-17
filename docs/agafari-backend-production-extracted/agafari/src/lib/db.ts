import { Pool, QueryResultRow } from 'pg';

// Single pooled connection, reused across requests/serverless invocations.
// Requires DATABASE_URL in the environment, e.g.:
//   DATABASE_URL=postgres://user:pass@host:5432/agafari
declare global {
  // eslint-disable-next-line no-var
  var __agafariPgPool: Pool | undefined;
}

function getPool(): Pool {
  if (!global.__agafariPgPool) {
    global.__agafariPgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
      max: 10,
    });
  }
  return global.__agafariPgPool;
}

export async function query<T extends QueryResultRow = any>(
  text: string,
  params: unknown[] = []
): Promise<T[]> {
  const pool = getPool();
  const result = await pool.query<T>(text, params);
  return result.rows;
}

export async function queryOne<T extends QueryResultRow = any>(
  text: string,
  params: unknown[] = []
): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] ?? null;
}

// Use for multi-statement operations that must succeed or fail together
// (e.g. creating an event + its first event_locations rows).
export async function withTransaction<T>(fn: (client: import('pg').PoolClient) => Promise<T>): Promise<T> {
  const pool = getPool();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
