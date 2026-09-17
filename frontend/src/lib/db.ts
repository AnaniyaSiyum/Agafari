import mysql from 'mysql2/promise';

declare global {
  // eslint-disable-next-line no-var
  var __agafariMysqlPool: mysql.Pool | undefined;
}

function getMysqlPool(): mysql.Pool {
  if (!global.__agafariMysqlPool) {
    const host = process.env.MYSQL_HOST || '127.0.0.1';
    const port = parseInt(process.env.MYSQL_PORT || '3306', 10);
    const user = process.env.MYSQL_USER || 'root';
    const password = process.env.MYSQL_PASSWORD || '';
    const database = process.env.MYSQL_DATABASE || 'agafari';

    global.__agafariMysqlPool = mysql.createPool({
      host,
      port,
      user,
      password,
      database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      charset: 'utf8mb4'
    });
  }
  return global.__agafariMysqlPool;
}

/**
 * Converts Postgres $1, $2 parameter placeholders into MySQL ? placeholders
 * and constructs positional mysqlParams array matching ? occurrences.
 */
function convertPgToMysqlQuery(
  text: string,
  params: unknown[] = []
): { sql: string; mysqlParams: unknown[] } {
  const mysqlParams: unknown[] = [];
  const sql = text.replace(/\$(\d+)/g, (_, numStr) => {
    const idx = parseInt(numStr, 10) - 1;
    if (idx >= 0 && idx < params.length) {
      mysqlParams.push(params[idx]);
    } else {
      mysqlParams.push(null);
    }
    return '?';
  });
  return { sql, mysqlParams };
}

export async function query<T = any>(
  text: string,
  params: unknown[] = []
): Promise<T[]> {
  const pool = getMysqlPool();
  const { sql, mysqlParams } = convertPgToMysqlQuery(text, params);
  const [rows] = await pool.query(sql, mysqlParams as any[]);
  return Array.isArray(rows) ? (rows as T[]) : [];
}

export async function queryOne<T = any>(
  text: string,
  params: unknown[] = []
): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] ?? null;
}

export interface MysqlTransactionClient {
  query: <T = any>(text: string, params?: unknown[]) => Promise<{ rows: T[] }>;
}

export async function withTransaction<T>(fn: (client: MysqlTransactionClient) => Promise<T>): Promise<T> {
  const pool = getMysqlPool();
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const client: MysqlTransactionClient = {
      query: async <T = any>(text: string, params: unknown[] = []) => {
        const { sql, mysqlParams } = convertPgToMysqlQuery(text, params);
        const [rows] = await connection.query(sql, mysqlParams as any[]);
        const rowArray = Array.isArray(rows) ? (rows as T[]) : [];
        return { rows: rowArray };
      }
    };

    const result = await fn(client);
    await connection.commit();
    return result;

  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}
