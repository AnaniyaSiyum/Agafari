import crypto from 'crypto';

const BASE32_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

/**
 * Encodes a buffer to Base32 string (RFC 4648)
 */
function toBase32(buffer: Buffer): string {
  let bits = 0;
  let value = 0;
  let output = '';

  for (let i = 0; i < buffer.length; i++) {
    value = (value << 8) | buffer[i];
    bits += 8;
    while (bits >= 5) {
      output += BASE32_CHARS[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += BASE32_CHARS[(value << (5 - bits)) & 31];
  }

  return output;
}

/**
 * Decodes a Base32 string to Buffer (RFC 4648)
 */
function fromBase32(base32: string): Buffer {
  const clean = base32.toUpperCase().replace(/=+$/, '').replace(/\s+/g, '');
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];

  for (let i = 0; i < clean.length; i++) {
    const idx = BASE32_CHARS.indexOf(clean[i]);
    if (idx === -1) continue;
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return Buffer.from(bytes);
}

/**
 * Generates a cryptographically secure 20-byte (32-character) Base32 secret for TOTP.
 */
export function generateTotpSecret(): string {
  const bytes = crypto.randomBytes(20);
  return toBase32(bytes);
}

/**
 * Generates a standard RFC 6238 6-digit TOTP code for a given counter.
 */
export function generateTotpCodeForCounter(secret: string, counter: number): string {
  const key = fromBase32(secret);
  const buffer = Buffer.alloc(8);
  buffer.writeBigInt64BE(BigInt(counter));

  const hmac = crypto.createHmac('sha1', key).update(buffer).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const binary =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);

  const otp = binary % 1_000_000;
  return otp.toString().padStart(6, '0');
}

/**
 * Generates the current valid 6-digit code for a secret.
 */
export function generateCurrentTotpCode(secret: string): string {
  const counter = Math.floor(Date.now() / 1000 / 30);
  return generateTotpCodeForCounter(secret, counter);
}

/**
 * Verifies a user-supplied TOTP code against the secret.
 * Checks current time window ± 1 step (30s past and 30s future) to handle minor clock skew.
 */
export function verifyTotpCode(secret: string, userCode: string, windowSteps = 1): boolean {
  if (!secret || !userCode || userCode.trim().length !== 6) {
    return false;
  }

  const cleanCode = userCode.trim();
  const currentCounter = Math.floor(Date.now() / 1000 / 30);

  for (let i = -windowSteps; i <= windowSteps; i++) {
    const validCode = generateTotpCodeForCounter(secret, currentCounter + i);
    if (crypto.timingSafeEqual(Buffer.from(cleanCode), Buffer.from(validCode))) {
      return true;
    }
  }

  return false;
}

/**
 * Generates the standard keyuri for scanning in Authenticator apps (Google Authenticator, Authy, etc.).
 */
export function generateTotpUri(email: string, secret: string, issuer = 'Agafari'): string {
  const label = encodeURIComponent(`${issuer}:${email}`);
  return `otpauth://totp/${label}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&digits=6&period=30`;
}
