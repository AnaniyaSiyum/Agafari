import fs from 'fs';
import path from 'path';
import { hashPassword, verifyPassword, UserRole } from '@/lib/auth';

export interface PersistentUserRecord {
  id: string;
  email: string;
  fullName: string;
  companyName?: string;
  description?: string;
  role: UserRole;
  organizerId?: string;
  passwordHash: string;
  temporaryPassword?: string;
  isActive?: boolean;
  createdAt?: string;
}

const CACHE_FILE_PATH = path.join(process.cwd(), 'src', 'db', 'users_cache.json');

const INITIAL_USERS: PersistentUserRecord[] = [
  {
    id: 'usr-admin-1',
    email: 'admin@agafari.com',
    fullName: 'System Super Admin',
    companyName: 'Agafari Headquarters',
    role: 'SYSTEM_ADMIN',
    passwordHash: hashPassword('admin123'),
    temporaryPassword: 'admin123',
    isActive: true,
  },
];

export function getStoredUsers(): PersistentUserRecord[] {
  try {
    if (fs.existsSync(CACHE_FILE_PATH)) {
      const content = fs.readFileSync(CACHE_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to read users_cache.json, using in-memory defaults:', err);
  }

  // If cache doesn't exist yet, save initial users
  try {
    const dir = path.dirname(CACHE_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(INITIAL_USERS, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Failed to write initial users_cache.json:', err);
  }

  return INITIAL_USERS;
}

export function saveStoredUser(user: PersistentUserRecord): void {
  try {
    const existing = getStoredUsers();
    const idx = existing.findIndex(
      (u) =>
        u.id === user.id ||
        u.email.toLowerCase() === user.email.toLowerCase() ||
        (user.organizerId && u.organizerId === user.organizerId)
    );

    if (idx >= 0) {
      existing[idx] = { ...existing[idx], ...user };
    } else {
      existing.unshift(user);
    }

    fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(existing, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Failed to persist user to users_cache.json:', err);
  }
}

export function updateStoredUserCredentials(idOrEmail: string, newPassword: string): PersistentUserRecord | null {
  try {
    const existing = getStoredUsers();
    const query = idOrEmail.toLowerCase().trim();
    const idx = existing.findIndex(
      (u) =>
        u.id.toLowerCase() === query ||
        u.email.toLowerCase() === query ||
        (u.organizerId && u.organizerId.toLowerCase() === query) ||
        (u.fullName && u.fullName.toLowerCase() === query)
    );

    if (idx >= 0) {
      const hashedPassword = hashPassword(newPassword);
      existing[idx].passwordHash = hashedPassword;
      existing[idx].temporaryPassword = newPassword;
      fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(existing, null, 2), 'utf-8');
      return existing[idx];
    }
  } catch (err) {
    console.warn('Failed to update credentials in users_cache.json:', err);
  }
  return null;
}

export function findStoredUser(identifier: string): PersistentUserRecord | null {
  const users = getStoredUsers();
  const clean = identifier.toLowerCase().trim();
  const withoutOrg = clean.replace(/^org-/, '');
  const withoutUsr = clean.replace(/^usr-/, '');

  return (
    users.find(
      (u) =>
        (u.email || '').toLowerCase() === clean ||
        (u.fullName || '').toLowerCase() === clean ||
        (u.companyName || '').toLowerCase() === clean ||
        (u.id || '').toLowerCase() === clean ||
        (u.id || '').toLowerCase().replace(/^usr-/, '') === withoutUsr ||
        (u.organizerId || '').toLowerCase() === clean ||
        (u.organizerId || '').toLowerCase().replace(/^org-/, '') === withoutOrg ||
        `org-${(u.id || '').toLowerCase()}` === clean
    ) || null
  );
}
