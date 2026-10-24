import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const BCRYPT_ROUNDS = 12;

/**
 * Hashes password using bcrypt with cost 12.
 * Never stores or logs plaintext.
 */
export async function hashPassword(plainText: string): Promise<string> {
  const salt = await bcrypt.genSalt(BCRYPT_ROUNDS);
  return bcrypt.hash(plainText, salt);
}

/**
 * Synchronous hash version for seed scripts.
 */
export function hashPasswordSync(plainText: string): string {
  const salt = bcrypt.genSaltSync(BCRYPT_ROUNDS);
  return bcrypt.hashSync(plainText, salt);
}

// Pre-computed bcrypt hash (cost 12) used to equalize execution times for non-existent accounts
export const DUMMY_BCRYPT_HASH = '$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';

/**
 * Timing-safe password verification.
 * If storedHash is null, undefined, or empty, executes a full bcrypt verification against
 * DUMMY_BCRYPT_HASH to ensure invariant response latency across existing and non-existent users.
 */
export async function timingSafeVerifyPassword(
  plainText: string,
  storedHash?: string | null
): Promise<boolean> {
  if (storedHash) {
    return verifyPassword(plainText, storedHash);
  }
  // Execute identical computational workload to prevent user enumeration
  await verifyPassword(plainText, DUMMY_BCRYPT_HASH);
  return false;
}

/**
 * Verifies a plaintext password against a stored bcrypt hash
 * (with fallback for legacy PBKDF2 hashes during transition).
 */
export async function verifyPassword(plainText: string, storedHash: string): Promise<boolean> {
  if (!storedHash || !plainText) return false;

  // 1. Standard Bcrypt check
  if (storedHash.startsWith('$2a$') || storedHash.startsWith('$2b$') || storedHash.startsWith('$2y$')) {
    return bcrypt.compare(plainText, storedHash);
  }

  // 2. Legacy PBKDF2 salt:hash fallback for smooth transition
  if (storedHash.includes(':')) {
    try {
      const [salt, originalHash] = storedHash.split(':');
      if (salt && originalHash) {
        const hash = crypto.pbkdf2Sync(plainText, salt, 100_000, 64, 'sha512').toString('hex');
        return hash === originalHash;
      }
    } catch {
      return false;
    }
  }

  return false;
}

/**
 * Generates an unguessable high-entropy random password (minimum 16 characters).
 * Combines uppercase, lowercase, numbers, and symbols.
 */
export function generateStrongPassword(length = 16): string {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghijkmnopqrstuvwxyz';
  const digits = '23456789';
  const symbols = '!@#$%^&*()-_=+';
  const all = upper + lower + digits + symbols;

  const bytes = crypto.randomBytes(length);
  const result: string[] = [
    upper[bytes[0] % upper.length],
    lower[bytes[1] % lower.length],
    digits[bytes[2] % digits.length],
    symbols[bytes[3] % symbols.length],
  ];

  for (let i = 4; i < length; i++) {
    result.push(all[bytes[i] % all.length]);
  }

  // Shuffle array using Fisher-Yates
  for (let i = result.length - 1; i > 0; i--) {
    const j = bytes[i] % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result.join('');
}
