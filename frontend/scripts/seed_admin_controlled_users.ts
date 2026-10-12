import { hashPasswordSync } from '../src/lib/passwords';
import { query } from '../src/lib/db';

async function seed() {
  console.log('Seeding initial users and memberships for admin-controlled architecture...');

  // 1. SYSTEM ADMIN
  const adminId = 'usr-admin-1';
  const adminHash = hashPasswordSync('admin123');
  // Seed a fixed Base32 secret for testing so tests can generate codes reproducibly
  const adminTotpSecret = 'JBSWY3DPEHPK3PXPJBSWY3DPEHPK3PXP';

  await query(`
    INSERT INTO users (id, email, phone, full_name, password_hash, password_set_by, password_set_at, status, totp_secret, totp_enabled, session_version)
    VALUES ($1, 'admin@agafari.com', '+251911000000', 'System Super Admin', $2, $1, NOW(), 'ACTIVE', $3, TRUE, 1)
    ON DUPLICATE KEY UPDATE password_hash = $2, status = 'ACTIVE', totp_secret = $3, totp_enabled = TRUE
  `, [adminId, adminHash, adminTotpSecret]);

  await query(`
    INSERT INTO memberships (id, user_id, role, scope_type, scope_id, status)
    VALUES ('mem-admin-1', $1, 'SYSTEM_ADMIN', 'PLATFORM', 'global', 'ACTIVE')
    ON DUPLICATE KEY UPDATE status = 'ACTIVE', role = 'SYSTEM_ADMIN'
  `, [adminId]);

  // 2. ORGANIZER OWNER (Kebkab Events)
  const kebkabId = 'usr-kebkab-1';
  const kebkabHash = hashPasswordSync('org123');
  await query(`
    INSERT INTO users (id, email, phone, full_name, password_hash, password_set_by, password_set_at, status, session_version)
    VALUES ($1, 'kebkab@agafari.com', '+251911111111', 'Kebkab Wedding Planners', $2, $3, NOW(), 'ACTIVE', 1)
    ON DUPLICATE KEY UPDATE password_hash = $2, status = 'ACTIVE'
  `, [kebkabId, kebkabHash, adminId]);

  await query(`
    INSERT INTO memberships (id, user_id, role, scope_type, scope_id, status)
    VALUES ('mem-kebkab-1', $1, 'ORGANIZER_OWNER', 'ORGANIZER', 'org-kebkab', 'ACTIVE')
    ON DUPLICATE KEY UPDATE status = 'ACTIVE', role = 'ORGANIZER_OWNER'
  `, [kebkabId]);

  // 3. COUPLE (Bethlehem & Yonas, event: evt-bethlehem-yonas)
  const coupleId = 'usr-couple-kebkab';
  const coupleHash = hashPasswordSync('couple123');
  await query(`
    INSERT INTO users (id, email, phone, full_name, password_hash, password_set_by, password_set_at, status, session_version)
    VALUES ($1, 'couple@kebkab-wedding.com', '+251922222222', 'Bethlehem & Yonas', $2, $3, NOW(), 'ACTIVE', 1)
    ON DUPLICATE KEY UPDATE password_hash = $2, status = 'ACTIVE'
  `, [coupleId, coupleHash, adminId]);

  await query(`
    INSERT INTO memberships (id, user_id, role, scope_type, scope_id, status)
    VALUES ('mem-couple-1', $1, 'COUPLE', 'EVENT', 'evt-bethlehem-yonas', 'ACTIVE')
    ON DUPLICATE KEY UPDATE status = 'ACTIVE', role = 'COUPLE', scope_id = 'evt-bethlehem-yonas'
  `, [coupleId]);

  // 4. GATE SCANNER (event: evt-bethlehem-yonas)
  const scannerId = 'usr-scanner-kebkab';
  const scannerHash = hashPasswordSync('scan123');
  await query(`
    INSERT INTO users (id, email, phone, full_name, password_hash, password_set_by, password_set_at, status, session_version)
    VALUES ($1, 'scanner@kebkab-wedding.com', '+251933333333', 'Gate Scanner - Bethlehem & Yonas', $2, $3, NOW(), 'ACTIVE', 1)
    ON DUPLICATE KEY UPDATE password_hash = $2, status = 'ACTIVE'
  `, [scannerId, scannerHash, adminId]);

  await query(`
    INSERT INTO memberships (id, user_id, role, scope_type, scope_id, status)
    VALUES ('mem-scanner-1', $1, 'GATE_SCANNER', 'EVENT', 'evt-bethlehem-yonas', 'ACTIVE')
    ON DUPLICATE KEY UPDATE status = 'ACTIVE', role = 'GATE_SCANNER', scope_id = 'evt-bethlehem-yonas'
  `, [scannerId]);

  // 5. MEDIA MODERATOR (event: evt-bethlehem-yonas)
  const modId = 'usr-mod-kebkab';
  const modHash = hashPasswordSync('mod123');
  await query(`
    INSERT INTO users (id, email, phone, full_name, password_hash, password_set_by, password_set_at, status, session_version)
    VALUES ($1, 'moderator@kebkab-wedding.com', '+251944444444', 'Media Moderator - Bethlehem & Yonas', $2, $3, NOW(), 'ACTIVE', 1)
    ON DUPLICATE KEY UPDATE password_hash = $2, status = 'ACTIVE'
  `, [modId, modHash, adminId]);

  await query(`
    INSERT INTO memberships (id, user_id, role, scope_type, scope_id, status)
    VALUES ('mem-mod-1', $1, 'MEDIA_MODERATOR', 'EVENT', 'evt-bethlehem-yonas', 'ACTIVE')
    ON DUPLICATE KEY UPDATE status = 'ACTIVE', role = 'MEDIA_MODERATOR', scope_id = 'evt-bethlehem-yonas'
  `, [modId]);

  // 6. PENDING ACCOUNT (Created by organizer, no password set yet)
  const pendingId = 'usr-pending-staff';
  await query(`
    INSERT INTO users (id, email, phone, full_name, password_hash, status, session_version)
    VALUES ($1, 'pending@kebkab-wedding.com', '+251955555555', 'Pending Gate Staff', NULL, 'PENDING', 1)
    ON DUPLICATE KEY UPDATE status = 'PENDING', password_hash = NULL
  `, [pendingId]);

  await query(`
    INSERT INTO memberships (id, user_id, role, scope_type, scope_id, status)
    VALUES ('mem-pending-1', $1, 'GATE_SCANNER', 'EVENT', 'evt-bethlehem-yonas', 'DISABLED')
    ON DUPLICATE KEY UPDATE status = 'DISABLED'
  `, [pendingId]);

  console.log('Seeding completed successfully!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
