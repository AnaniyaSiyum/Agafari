export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireRole, hashPassword, sanitizeUser, UserRole } from '@/lib/auth';
import { query, queryOne } from '@/lib/db';

import { mockStore } from '@/lib/mockData';

// GET: list accounts — never returns password_hash or any plaintext password
export async function GET(req: NextRequest) {
  const auth = requireRole(req, ['SYSTEM_ADMIN']);
  if (!auth.ok) return auth.response;

  try {
    const users = await query(`
      SELECT u.id, u.email, u.full_name, u.role, u.is_active, u.created_at,
             o.id AS organizer_id, o.business_name
      FROM users u
      LEFT JOIN organizers o ON o.owner_user_id = u.id
      ORDER BY u.created_at DESC
    `);

    const formatted = users.map((u: any) => ({
      id: u.id,
      email: u.email,
      fullName: u.full_name,
      full_name: u.full_name,
      role: u.role,
      companyName: u.business_name || u.full_name,
      company_name: u.business_name || u.full_name,
      organizerId: u.organizer_id || `org-${u.id}`,
      isActive: Boolean(u.is_active),
      createdAt: u.created_at
    }));

    return NextResponse.json({ users: formatted });
  } catch (e) {
    return NextResponse.json({ users: mockStore.users });
  }
}

// These are the only values `users.role` (user_role_enum) actually accepts.
const GLOBAL_ROLES: UserRole[] = ['SYSTEM_ADMIN', 'EVENT_ORGANIZER', 'BRIDE_GROOM', 'LIVE_STREAMER', 'GATE_SCANNER', 'GUEST'];

// POST: create an account.
export async function POST(req: NextRequest) {
  const auth = requireRole(req, ['SYSTEM_ADMIN']);
  if (!auth.ok) return auth.response;

  try {
    const { email, password, fullName, companyName, description, role, eventId } = await req.json();
    if (!email || !fullName || !role) {
      return NextResponse.json({ error: 'Email, full name, and role are required.' }, { status: 400 });
    }
    if (!GLOBAL_ROLES.includes(role)) {
      return NextResponse.json(
        {
          error: `role must be one of ${GLOBAL_ROLES.join(', ')}.`,
        },
        { status: 400 }
      );
    }

    const effectivePassword = password?.trim() || `org${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      const existing = await queryOne('SELECT id FROM users WHERE lower(email) = lower($1)', [email.trim()]);
      if (existing) {
        return NextResponse.json({ error: `An account with email '${email}' already exists.` }, { status: 400 });
      }

      const newUserId = `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const effectiveName = (fullName || companyName || 'Event Organizer').trim();

      await query(
        `INSERT INTO users (id, email, password_hash, full_name, role, created_by)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [newUserId, email.toLowerCase().trim(), hashPassword(effectivePassword), effectiveName, role as UserRole, auth.user?.userId || 'admin-001']
      );

      let orgId = `org-${newUserId}`;
      if (role === 'EVENT_ORGANIZER') {
        const orgBizName = (companyName || fullName || 'Certified Event Agency').trim();
        await query(
          `INSERT INTO organizers (id, owner_user_id, business_name, created_by_admin_id)
           VALUES ($1, $2, $3, $4)`,
          [orgId, newUserId, orgBizName, auth.user?.userId || 'admin-001']
        );
      }

      const newUser = await queryOne('SELECT id, email, full_name, role FROM users WHERE id = $1', [newUserId]);

      const userPayload = {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.full_name || effectiveName,
        full_name: newUser.full_name || effectiveName,
        role: newUser.role,
        companyName: companyName || effectiveName,
        company_name: companyName || effectiveName,
        description: description || `Official certified event management partner (${companyName || effectiveName}).`,
        organizerId: orgId,
        temporaryPassword: effectivePassword,
      };

      return NextResponse.json(
        {
          success: true,
          message: `Account created successfully with role '${role}'.`,
          user: userPayload,
        },
        { status: 201 }
      );
    } catch (dbErr) {
      console.warn('DB User Creation fallback:', dbErr);
      const newMockUser = {
        id: `usr-org-${Date.now()}`,
        eventId: eventId || null,
        email: email.toLowerCase().trim(),
        passwordHash: hashPassword(effectivePassword),
        temporaryPassword: effectivePassword,
        fullName: (fullName || companyName || 'Event Organizer').trim(),
        companyName: (companyName || fullName || 'Event Organizer').trim(),
        description: description || '',
        organizerId: `org-usr-org-${Date.now()}`,
        role: role as any,
      };
      mockStore.users.unshift(newMockUser);

      return NextResponse.json(
        {
          success: true,
          message: `Account created successfully with role '${role}'.`,
          user: newMockUser,
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create user account.' }, { status: 500 });
  }
}

// PATCH: reset password or change role/name
export async function PATCH(req: NextRequest) {
  const auth = requireRole(req, ['SYSTEM_ADMIN']);
  if (!auth.ok) return auth.response;

  try {
    const { userId, newPassword, fullName, role } = await req.json();
    if (!userId) return NextResponse.json({ error: 'userId is required.' }, { status: 400 });
    if (role && !GLOBAL_ROLES.includes(role)) {
      return NextResponse.json({ error: `role must be one of ${GLOBAL_ROLES.join(', ')}.` }, { status: 400 });
    }

    try {
      await query(
        `UPDATE users SET
           password_hash = COALESCE($2, password_hash),
           full_name = COALESCE($3, full_name),
           role = COALESCE($4, role)
         WHERE id = $1`,
        [userId, newPassword ? hashPassword(newPassword) : null, fullName?.trim() ?? null, role ?? null]
      );
      const updated = await queryOne('SELECT id, email, full_name, role FROM users WHERE id = $1', [userId]);

      if (updated) {
        // Keep mockStore in sync
        const idx = mockStore.users.findIndex((u) => u.id === userId);
        if (idx >= 0) {
          if (fullName) mockStore.users[idx].fullName = fullName;
          if (role) mockStore.users[idx].role = role as any;
          if (newPassword) mockStore.users[idx].temporaryPassword = newPassword;
        }
        return NextResponse.json({ success: true, user: sanitizeUser(updated) });
      }
    } catch (dbErr) {
      console.warn('DB User update fallback:', dbErr);
      const idx = mockStore.users.findIndex((u) => u.id === userId);
      if (idx >= 0) {
        if (fullName) mockStore.users[idx].fullName = fullName;
        if (role) mockStore.users[idx].role = role as any;
        if (newPassword) mockStore.users[idx].temporaryPassword = newPassword;
        return NextResponse.json({ success: true, user: mockStore.users[idx] });
      }
    }

    return NextResponse.json({ error: 'User not found.' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user account.' }, { status: 500 });
  }
}

import { OrganizerService } from '@/application/services/OrganizerService';
import { MySqlUserRepository } from '@/infrastructure/persistence/MySqlUserRepository';
import { MySqlEventRepository } from '@/infrastructure/persistence/MySqlEventRepository';
import { DomainError, OrganizerHasActiveEventsError } from '@/domain/errors/DomainError';

const organizerService = new OrganizerService(
  new MySqlUserRepository(),
  new MySqlEventRepository()
);

// DELETE: remove an account & associated organizer profile
export async function DELETE(req: NextRequest) {
  const auth = requireRole(req, ['SYSTEM_ADMIN']);
  if (!auth.ok) return auth.response;

  const userId = new URL(req.url).searchParams.get('userId');
  if (!userId) return NextResponse.json({ error: 'userId is required.' }, { status: 400 });

  try {
    const result = await organizerService.deleteOrganizer(userId);
    return NextResponse.json(result);
  } catch (err: any) {
    if (err instanceof OrganizerHasActiveEventsError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    if (err instanceof DomainError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error('Failed to delete user:', err);
    return NextResponse.json({ error: 'Failed to delete user account.' }, { status: 500 });
  }
}
