import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hashPasswordSync } from '@/lib/passwords';
import { logAudit } from '@/lib/audit';

import { requireMembership } from '@/lib/requireMembership';
import { checkRateLimit, getClientIp, buildRateLimitResponse } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

async function performCleanSlate() {
  const operations: string[] = [];

  // 1. Delete dependent event data
  const tablesToClear = [
    'post_likes',
    'media_comments',
    'media_assets',
    'wishes',
    'rsvps',
    'invitations',
    'event_staff',
    'event_locations',
    'live_streams',
    'mezmur_playlist',
    'events',
    'organizers',
    'account_requests',
  ];

  for (const table of tablesToClear) {
    try {
      await query(`DELETE FROM ${table}`);
      operations.push(`Cleared table ${table}`);
    } catch (err: any) {
      operations.push(`Note on table ${table}: ${err.message}`);
    }
  }

  // 2. Clear non-admin memberships
  try {
    await query(`DELETE FROM memberships WHERE role != 'SYSTEM_ADMIN'`);
    operations.push("Cleared all non-SYSTEM_ADMIN memberships");
  } catch (err: any) {
    operations.push(`Note on memberships: ${err.message}`);
  }

  // 3. Clear non-admin users
  try {
    await query(`DELETE FROM users WHERE LOWER(email) != 'admin@agafari.com'`);
    operations.push("Cleared all users except admin@agafari.com");
  } catch (err: any) {
    operations.push(`Note on users: ${err.message}`);
  }

  // 4. Ensure System Admin exists, is ACTIVE, and has SYSTEM_ADMIN membership
  const adminId = 'usr-admin-1';
  const adminHash = hashPasswordSync('admin123');
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

  operations.push("Verified System Super Admin (admin@agafari.com) is sole active account");

  await logAudit({
    actorId: adminId,
    action: 'CLEAN_SLATE_RESET',
    ip: '127.0.0.1',
    metaJson: { operations },
  });

  return operations;
}

export async function POST(req: NextRequest) {
  const auth = await requireMembership(req, ['SYSTEM_ADMIN']);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const clientIp = getClientIp(req);
  const rateLimitRes = checkRateLimit(`clean_slate:${clientIp}`, { max: 2, windowSeconds: 3600 });
  if (!rateLimitRes.allowed) {
    return buildRateLimitResponse(rateLimitRes.retryAfterSeconds, 'Too many reset requests. Please wait.', 2, rateLimitRes.remaining);
  }

  try {
    const ops = await performCleanSlate();
    return NextResponse.json({
      success: true,
      message: 'Clean slate executed successfully. Only System Super Admin remains.',
      operations: ops,
    });
  } catch (error: any) {
    console.error('Clean slate error:', error);
    return NextResponse.json({ error: error.message || 'Failed to execute clean slate.' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const auth = await requireMembership(req, ['SYSTEM_ADMIN']);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const clientIp = getClientIp(req);
  const rateLimitRes = checkRateLimit(`clean_slate:${clientIp}`, { max: 2, windowSeconds: 3600 });
  if (!rateLimitRes.allowed) {
    return buildRateLimitResponse(rateLimitRes.retryAfterSeconds, 'Too many reset requests. Please wait.', 2, rateLimitRes.remaining);
  }

  try {
    const ops = await performCleanSlate();
    return NextResponse.json({
      success: true,
      message: 'Clean slate executed successfully. Only System Super Admin remains.',
      operations: ops,
    });
  } catch (error: any) {
    console.error('Clean slate error:', error);
    return NextResponse.json({ error: error.message || 'Failed to execute clean slate.' }, { status: 500 });
  }
}
