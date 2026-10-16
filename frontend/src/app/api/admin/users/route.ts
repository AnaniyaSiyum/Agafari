import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { requireMembership } from '@/lib/requireMembership';
import { hashPassword, generateStrongPassword } from '@/lib/passwords';
import { logAudit } from '@/lib/audit';
import { query, queryOne } from '@/lib/db';
import { AppRole, ScopeType } from '@/types/auth';

export const dynamic = 'force-dynamic';

async function ensureTemporaryPasswordColumn() {
  try {
    await query('ALTER TABLE users ADD COLUMN temporary_password VARCHAR(255) NULL AFTER password_hash');
  } catch {
    // Column already exists or table modified
  }
}

export async function GET(req: NextRequest) {
  const auth = await requireMembership(req, ['SYSTEM_ADMIN']);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  await ensureTemporaryPasswordColumn();

  try {
    // Ensure existing admins have default temporary password populated in DB if null
    try {
      await query(`
        UPDATE users 
        SET temporary_password = 'admin123' 
        WHERE (LOWER(email) = 'admin@agafari.com' OR role = 'SYSTEM_ADMIN') AND (temporary_password IS NULL OR temporary_password = '')
      `);
    } catch {}

    // 1. Auto-sync unlinked organizers into users table
    try {
      const unlinkedOrgs = await query<any>(`
        SELECT o.id, o.business_name, o.contact_phone, o.owner_user_id
        FROM organizers o
        LEFT JOIN users u ON (u.id = o.owner_user_id OR u.id = o.id OR u.id = CONCAT('usr-', o.id) OR u.id = REPLACE(o.id, 'org-', 'usr-org-'))
        WHERE u.id IS NULL
      `);
      for (const org of unlinkedOrgs) {
        const orgUserId = org.owner_user_id || `usr-org-${org.id.replace(/^org-/, '')}`;
        const orgEmail = `${(org.business_name || 'organizer').toLowerCase().replace(/[^a-z0-9]/g, '') || 'organizer'}@agafari.com`;
        const tempPass = 'org123';
        const hash = await hashPassword(tempPass);
        await query(
          `INSERT INTO users (id, email, phone, full_name, role, password_hash, temporary_password, status, session_version, created_at)
           VALUES ($1, $2, $3, $4, 'EVENT_ORGANIZER', $5, $6, 'ACTIVE', 1, NOW())
           ON DUPLICATE KEY UPDATE role = 'EVENT_ORGANIZER', status = 'ACTIVE', temporary_password = COALESCE(temporary_password, $6)`,
          [orgUserId, orgEmail, org.contact_phone || null, org.business_name, hash, tempPass]
        );
        await query('UPDATE organizers SET owner_user_id = $1 WHERE id = $2', [orgUserId, org.id]);
        await query(
          `INSERT INTO memberships (id, user_id, role, scope_type, scope_id, status, created_at)
           VALUES ($1, $2, 'ORGANIZER_OWNER', 'ORGANIZER', $3, 'ACTIVE', NOW())
           ON DUPLICATE KEY UPDATE status = 'ACTIVE'`,
          [`mem-${orgUserId}`, orgUserId, org.id]
        );
      }
    } catch (e) {
      console.warn('Auto-syncing unlinked organizers failed:', e);
    }

    // 2. Auto-sync unlinked wedding couple events into users table
    try {
      const unlinkedEvents = await query<any>(`
        SELECT e.id, e.slug, e.title, e.bride_name, e.groom_name, e.couple_user_id
        FROM events e
        LEFT JOIN users u ON (u.id = e.couple_user_id OR u.email = CONCAT('couple@', e.slug, '.com'))
        WHERE u.id IS NULL OR e.couple_user_id IS NULL
      `);
      for (const evt of unlinkedEvents) {
        const coupleUserId = evt.couple_user_id || `usr-couple-${evt.id.replace(/^evt-/, '')}`;
        const coupleEmail = `couple@${evt.slug}.com`;
        const coupleName = evt.bride_name && evt.groom_name ? `${evt.bride_name} & ${evt.groom_name}` : evt.title;
        const tempPass = 'couple123';
        const hash = await hashPassword(tempPass);
        await query(
          `INSERT INTO users (id, email, full_name, role, password_hash, temporary_password, status, session_version, created_at)
           VALUES ($1, $2, $3, 'BRIDE_GROOM', $4, $5, 'ACTIVE', 1, NOW())
           ON DUPLICATE KEY UPDATE role = 'BRIDE_GROOM', status = 'ACTIVE', temporary_password = COALESCE(temporary_password, $5)`,
          [coupleUserId, coupleEmail, coupleName, hash, tempPass]
        );
        await query('UPDATE events SET couple_user_id = $1 WHERE id = $2', [coupleUserId, evt.id]);
        await query(
          `INSERT INTO memberships (id, user_id, role, scope_type, scope_id, status, created_at)
           VALUES ($1, $2, 'COUPLE', 'EVENT', $3, 'ACTIVE', NOW())
           ON DUPLICATE KEY UPDATE status = 'ACTIVE'`,
          [`mem-${coupleUserId}`, coupleUserId, evt.id]
        );
      }
    } catch (e) {
      console.warn('Auto-syncing unlinked events failed:', e);
    }

    // 3. Query all users joined with memberships, organizers, and events
    const rawUsers = await query<any>(`
      SELECT u.id, u.email, u.phone, u.full_name, u.role AS user_role, u.status, u.temporary_password,
             u.password_set_by, u.password_set_at, u.totp_enabled, u.created_at,
             m.id AS membership_id, m.role AS membership_role, m.scope_type, m.scope_id,
             m.status AS membership_status, m.expires_at,
             o.id AS organizer_id, o.business_name,
             e.id AS event_id, e.slug AS event_slug
      FROM users u
      LEFT JOIN memberships m ON u.id = m.user_id
      LEFT JOIN organizers o ON (
        u.id = o.owner_user_id OR
        o.id = u.id OR
        o.id = CONCAT('org-', u.id) OR
        u.id = CONCAT('usr-', o.id) OR
        (m.scope_type = 'ORGANIZER' AND (m.scope_id = o.id OR m.scope_id = REPLACE(o.id, 'org-', '')))
      )
      LEFT JOIN events e ON (
        u.id = e.couple_user_id OR
        (m.scope_type = 'EVENT' AND (m.scope_id = e.id OR m.scope_id = e.slug))
      )
      ORDER BY u.created_at DESC
    `);

    // Deduplicate by user id
    const userMap = new Map<string, any>();
    for (const u of rawUsers) {
      if (!userMap.has(u.id)) {
        let displayRole: string = u.user_role || 'GUEST';
        if (u.user_role === 'EVENT_ORGANIZER' || u.membership_role === 'ORGANIZER_OWNER') {
          displayRole = 'EVENT_ORGANIZER';
        } else if (u.user_role === 'BRIDE_GROOM' || u.membership_role === 'COUPLE') {
          displayRole = 'BRIDE_GROOM';
        } else if (u.user_role === 'LIVE_STREAMER' || u.membership_role === 'MEDIA_MODERATOR') {
          displayRole = 'LIVE_STREAMER';
        } else if (u.user_role === 'GATE_SCANNER' || u.membership_role === 'GATE_SCANNER') {
          displayRole = 'GATE_SCANNER';
        } else if (u.user_role === 'SYSTEM_ADMIN' || u.membership_role === 'SYSTEM_ADMIN' || u.email?.toLowerCase() === 'admin@agafari.com') {
          displayRole = 'SYSTEM_ADMIN';
        }

        let tempPassword = u.temporary_password;
        if (!tempPassword) {
          if (u.email?.toLowerCase() === 'admin@agafari.com' || displayRole === 'SYSTEM_ADMIN') {
            tempPassword = 'admin123';
          } else if (displayRole === 'EVENT_ORGANIZER') {
            tempPassword = 'org123';
          } else if (displayRole === 'BRIDE_GROOM') {
            tempPassword = 'couple123';
          }
        }

        userMap.set(u.id, {
          id: u.id,
          email: u.email,
          phone: u.phone,
          fullName: u.full_name,
          companyName: u.business_name || (displayRole === 'EVENT_ORGANIZER' ? u.full_name : undefined),
          description: u.business_name ? `Official certified event management partner (${u.business_name}).` : undefined,
          role: displayRole,
          status: u.status,
          temporaryPassword: tempPassword,
          passwordSetBy: u.password_set_by,
          passwordSetAt: u.password_set_at,
          totpEnabled: !!u.totp_enabled,
          createdAt: u.created_at,
          membershipId: u.membership_id,
          membershipRole: u.membership_role,
          scopeType: u.scope_type,
          scopeId: u.scope_id,
          organizerId: u.organizer_id,
          eventId: u.event_id || (u.scope_type === 'EVENT' ? u.scope_id : undefined),
        });
      } else {
        const existing = userMap.get(u.id);
        if (!existing.organizerId && u.organizer_id) existing.organizerId = u.organizer_id;
        if (!existing.companyName && u.business_name) existing.companyName = u.business_name;
        if (!existing.eventId && u.event_id) existing.eventId = u.event_id;
      }
    }

    // Ensure all organizers from organizers table are in userMap
    try {
      const allOrgs = await query<any>('SELECT id, owner_user_id, business_name, contact_phone, created_at FROM organizers');
      for (const org of allOrgs) {
        const cleanOrgId = org.id.startsWith('org-') ? org.id : `org-${org.id}`;
        const alreadyPresent = Array.from(userMap.values()).some(
          (usr) => usr.organizerId === org.id || usr.organizerId === cleanOrgId || usr.id === org.owner_user_id || (usr.companyName && usr.companyName.toLowerCase() === org.business_name?.toLowerCase())
        );
        if (!alreadyPresent) {
          const orgUserId = org.owner_user_id || `usr-org-${org.id.replace(/^org-/, '')}`;
          userMap.set(orgUserId, {
            id: orgUserId,
            email: `${(org.business_name || 'organizer').toLowerCase().replace(/[^a-z0-9]/g, '')}@agafari.com`,
            phone: org.contact_phone || null,
            fullName: org.business_name,
            companyName: org.business_name,
            description: `Official certified event management partner (${org.business_name}).`,
            role: 'EVENT_ORGANIZER',
            status: 'ACTIVE',
            temporaryPassword: 'org123',
            createdAt: org.created_at || new Date().toISOString(),
            scopeType: 'ORGANIZER',
            scopeId: org.id,
            organizerId: cleanOrgId,
          });
        }
      }
    } catch (e) {
      console.warn('Failed to ensure all organizers in userMap:', e);
    }

    // Ensure all couple accounts from events table are in userMap
    try {
      const allEvents = await query<any>('SELECT id, slug, title, bride_name, groom_name, couple_user_id, created_at FROM events');
      for (const evt of allEvents) {
        const coupleEmail = `couple@${evt.slug}.com`;
        const coupleName = evt.bride_name && evt.groom_name ? `${evt.bride_name} & ${evt.groom_name}` : evt.title;
        const alreadyPresent = Array.from(userMap.values()).some(
          (usr) => usr.id === evt.couple_user_id || usr.email?.toLowerCase() === coupleEmail.toLowerCase() || usr.eventId === evt.id
        );
        if (!alreadyPresent) {
          const coupleUserId = evt.couple_user_id || `usr-couple-${evt.id.replace(/^evt-/, '')}`;
          userMap.set(coupleUserId, {
            id: coupleUserId,
            email: coupleEmail,
            fullName: coupleName,
            role: 'BRIDE_GROOM',
            status: 'ACTIVE',
            temporaryPassword: 'couple123',
            createdAt: evt.created_at || new Date().toISOString(),
            scopeType: 'EVENT',
            scopeId: evt.id,
            eventId: evt.id,
          });
        }
      }
    } catch (e) {
      console.warn('Failed to ensure all events in userMap:', e);
    }

    const users = Array.from(userMap.values());

    return NextResponse.json({ success: true, users });
  } catch (err: any) {
    console.error('Error fetching admin users:', err);
    return NextResponse.json({ error: err.message || 'Failed to fetch users.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireMembership(req, ['SYSTEM_ADMIN']);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  await ensureTemporaryPasswordColumn();

  try {
    const body = await req.json();
    const { email, phone, fullName, companyName, description, role, scopeType, scopeId, password: customPassword } = body;

    if (!email || !role) {
      return NextResponse.json({ error: 'Email and role are required.' }, { status: 400 });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const existing = await queryOne<any>('SELECT id FROM users WHERE email = $1', [cleanEmail]);
    if (existing) {
      return NextResponse.json({ error: 'A user with this email already exists.' }, { status: 409 });
    }

    // Use exact custom password if provided, or generate strong password
    const plainTextPassword = customPassword && String(customPassword).trim().length > 0
      ? String(customPassword).trim()
      : generateStrongPassword(12);

    const passwordHash = await hashPassword(plainTextPassword);
    const userId = `usr-${crypto.randomUUID()}`;
    const membershipId = `mem-${crypto.randomUUID()}`;
    const adminId = auth.user.id;

    // Normalize roles for users table vs memberships table
    const isOrganizer = role === 'EVENT_ORGANIZER' || role === 'ORGANIZER_OWNER';
    const isCouple = role === 'BRIDE_GROOM' || role === 'COUPLE';
    const isStreamer = role === 'LIVE_STREAMER' || role === 'MEDIA_MODERATOR';

    const userDbRole = isOrganizer
      ? 'EVENT_ORGANIZER'
      : isCouple
      ? 'BRIDE_GROOM'
      : isStreamer
      ? 'LIVE_STREAMER'
      : role === 'GATE_SCANNER'
      ? 'GATE_SCANNER'
      : role === 'SYSTEM_ADMIN'
      ? 'SYSTEM_ADMIN'
      : 'GUEST';

    const membershipRole = isOrganizer
      ? 'ORGANIZER_OWNER'
      : isCouple
      ? 'COUPLE'
      : isStreamer
      ? 'MEDIA_MODERATOR'
      : role === 'GATE_SCANNER'
      ? 'GATE_SCANNER'
      : 'SYSTEM_ADMIN';

    // 1. Insert user with explicit role and temporary_password
    await query(
      `INSERT INTO users (id, email, phone, full_name, role, password_hash, temporary_password, password_set_by, password_set_at, status, session_version, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), 'ACTIVE', 1, NOW())`,
      [userId, cleanEmail, phone || null, fullName || cleanEmail, userDbRole, passwordHash, plainTextPassword, adminId]
    );

    // 2. Insert membership with normalized membership role
    const finalScopeType: ScopeType = scopeType || (membershipRole === 'SYSTEM_ADMIN' ? 'PLATFORM' : membershipRole === 'ORGANIZER_OWNER' ? 'ORGANIZER' : 'EVENT');
    const finalScopeId = scopeId || (finalScopeType === 'PLATFORM' ? 'global' : isOrganizer ? `org-${userId}` : 'event-default');

    await query(
      `INSERT INTO memberships (id, user_id, role, scope_type, scope_id, status, created_at)
       VALUES ($1, $2, $3, $4, $5, 'ACTIVE', NOW())`,
      [membershipId, userId, membershipRole, finalScopeType, finalScopeId]
    );

    // 3. If organizer, insert into organizers table
    let organizerId = undefined;
    if (isOrganizer) {
      organizerId = `org-${userId}`;
      const businessName = companyName || fullName || cleanEmail;
      await query(
        `INSERT INTO organizers (id, owner_user_id, business_name, contact_phone, created_by_admin_id, created_at)
         VALUES ($1, $2, $3, $4, $5, NOW())
         ON DUPLICATE KEY UPDATE business_name = $3, owner_user_id = $2`,
        [organizerId, userId, businessName, phone || null, adminId]
      );
    }

    if (isCouple && scopeId && scopeId !== 'event-default') {
      await query('UPDATE events SET couple_user_id = $1 WHERE id = $2 OR slug = $2', [userId, scopeId]);
    }

    // 4. Immutable audit log
    await logAudit({
      actorId: adminId,
      action: isOrganizer ? 'ORGANIZER_CREATED' : 'USER_CREATED',
      targetType: 'USER',
      targetId: userId,
      ip: req.headers.get('x-forwarded-for') || '127.0.0.1',
      metaJson: { role: userDbRole, email: cleanEmail, scopeType: finalScopeType, scopeId: finalScopeId, organizerId },
    });

    return NextResponse.json({
      success: true,
      message: 'User created successfully.',
      user: {
        id: userId,
        email: cleanEmail,
        fullName: fullName || cleanEmail,
        companyName: companyName || fullName || cleanEmail,
        role: userDbRole,
        scopeType: finalScopeType,
        scopeId: finalScopeId,
        organizerId,
        temporaryPassword: plainTextPassword,
      },
      plainTextPassword,
    });
  } catch (err: any) {
    console.error('Error creating user:', err);
    return NextResponse.json({ error: err.message || 'Failed to create user.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await requireMembership(req, ['SYSTEM_ADMIN']);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  await ensureTemporaryPasswordColumn();

  try {
    const body = await req.json();
    const userId = body.userId || body.id;
    const newPassword = body.newPassword || body.password;

    if (!userId || !newPassword) {
      return NextResponse.json({ error: 'User ID and new password are required.' }, { status: 400 });
    }

    const cleanPass = String(newPassword).trim();
    if (cleanPass.length < 4) {
      return NextResponse.json({ error: 'Password must be at least 4 characters.' }, { status: 400 });
    }

    const target = await queryOne<any>('SELECT id, email, role FROM users WHERE id = $1', [userId]);
    if (!target) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    const passwordHash = await hashPassword(cleanPass);
    const adminId = auth.user.id;

    await query(
      `UPDATE users
       SET password_hash = $1,
           temporary_password = $2,
           password_set_by = $3,
           password_set_at = NOW(),
           status = 'ACTIVE',
           session_version = session_version + 1
       WHERE id = $4`,
      [passwordHash, cleanPass, adminId, userId]
    );

    await logAudit({
      actorId: adminId,
      action: 'PASSWORD_RESET',
      targetType: 'USER',
      targetId: userId,
      ip: req.headers.get('x-forwarded-for') || '127.0.0.1',
      metaJson: { email: target.email },
    });

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully.',
      temporaryPassword: cleanPass,
    });
  } catch (err: any) {
    console.error('Error updating password:', err);
    return NextResponse.json({ error: err.message || 'Failed to update password.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireMembership(req, ['SYSTEM_ADMIN']);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || searchParams.get('id');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
    }

    const target = await queryOne<any>(
      'SELECT id, email, role FROM users WHERE id = $1 OR LOWER(email) = $1 LIMIT 1',
      [userId.toLowerCase()]
    );

    if (!target) {
      return NextResponse.json({
        success: true,
        message: `User record with id ${userId} removed.`,
        deletedUserId: userId,
      });
    }

    if (target.email.toLowerCase() === 'admin@agafari.com') {
      return NextResponse.json(
        { error: 'Cannot delete the primary System Super Admin account.' },
        { status: 403 }
      );
    }

    const actualId = target.id;

    await query('DELETE FROM memberships WHERE user_id = $1', [actualId]);
    await query('DELETE FROM account_requests WHERE requested_by = $1', [actualId]);
    await query('DELETE FROM organizers WHERE owner_user_id = $1 OR id = $1', [actualId]);
    await query('DELETE FROM users WHERE id = $1', [actualId]);

    await logAudit({
      actorId: auth.user.id,
      action: 'USER_DELETED',
      targetType: 'USER',
      targetId: actualId,
      ip: req.headers.get('x-forwarded-for') || '127.0.0.1',
      metaJson: { email: target.email, role: target.role },
    });

    return NextResponse.json({
      success: true,
      message: `User ${target.email} permanently deleted.`,
      deletedUserId: actualId,
    });
  } catch (err: any) {
    console.error('Error deleting user:', err);
    return NextResponse.json({ error: err.message || 'Failed to delete user.' }, { status: 500 });
  }
}
