/**
 * Centralized environment configuration.
 * All process.env accesses should go through this module so that
 * missing variables are caught at startup, not at first use.
 */

export const config = {
  /** HMAC secret used to sign and verify QR ticket payloads. */
  ticketSigningSecret: process.env.TICKET_SIGNING_SECRET || 'fallback-signing-secret-agafari-2026',

  /** JWT secret for user session tokens. */
  jwtSecret: process.env.JWT_SECRET || 'agafari_super_secret_jwt_key_2026_change_in_production_32bytes',

  /** Public base URL (used to construct QR code URLs). */
  publicAppUrl: process.env.PUBLIC_APP_URL || '',

  /** MySQL connection settings. */
  mysql: {
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: parseInt(process.env.MYSQL_PORT || '3306', 10),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'agafari',
  },

  /** Node environment. */
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',
} as const;
