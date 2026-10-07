export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireRole, hashPassword, sanitizeUser, UserRole } from '@/lib/auth';
import { query, queryOne } from '@/lib/db';
import { mockStore } from '@/lib/mockData';

const VALID_ROLES: UserRole[] = [
  'SYSTEM_ADMIN',
  'EVENT_ORGANIZER',
  'BRIDE_GROOM',
  'LIVE_STREAMER',
  'GATE_SCANNER',
  'GUEST'
];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // 1. Strict Server-Side Role Enforcement: Only SYSTEM_ADMIN allowed
  const auth = requireRole(req, ['SYSTEM_ADMIN']);
  if (!auth.ok) return auth.response;

  try {
    const { id: userId } = await params;
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
    }

    const body = await req.json();
    const { email, fullName, role, newPassword } = body;

    // Validate email format if provided
    if (email && typeof email === 'string') {
      const emailTrimmed = email.trim().toLowerCase();
      if (!emailTrimmed.includes('@') || emailTrimmed.length < 5) {
        return NextResponse.json({ error: 'Invalid email address format.' }, { status: 400 });
      }

      // Unique email check in DB
      try {
        const existingDbUser = await queryOne<any>(
          'SELECT id FROM users WHERE LOWER(email) = LOWER($1) AND id != $2',
          [emailTrimmed, userId]
        );
        if (existingDbUser) {
          return NextResponse.json(
            { error: `The email '${emailTrimmed}' is already used by another user account.` },
            { status: 409 }
          );
        }
      } catch (dbErr) {
        console.warn('DB Unique Email Check fallback:', dbErr);
      }

      // Unique email check in mockStore
      const existingMock = mockStore.users.find(
        (u) => (u.email || '').toLowerCase() === emailTrimmed && u.id !== userId
      );
      if (existingMock) {
        return NextResponse.json(
          { error: `The email '${emailTrimmed}' is already used by another user account.` },
          { status: 409 }
        );
      }
    }

    // Validate role if provided
    if (role && !VALID_ROLES.includes(role)) {
      return NextResponse.json(
        { error: `Invalid role specified. Must be one of: ${VALID_ROLES.join(', ')}.` },
        { status: 400 }
      );
    }

    const hashedPassword = newPassword && newPassword.trim() ? hashPassword(newPassword.trim()) : null;
    let updatedUser: any = null;

    // 2. Update Database Record
    try {
      await query(
        `UPDATE users SET
           email = COALESCE($2, email),
           full_name = COALESCE($3, full_name),
           role = COALESCE($4, role),
           password_hash = COALESCE($5, password_hash)
         WHERE id = $1`,
        [
          userId,
          email ? email.trim().toLowerCase() : null,
          fullName ? fullName.trim() : null,
          role || null,
          hashedPassword
        ]
      );

      updatedUser = await queryOne(
        'SELECT id, email, full_name, role, is_active, created_at FROM users WHERE id = $1',
        [userId]
      );
    } catch (dbErr) {
      console.warn('DB User Credentials Update fallback:', dbErr);
    }

    // 3. Keep mockStore synchronized
    const mockIdx = mockStore.users.findIndex((u) => u.id === userId);
    if (mockIdx >= 0) {
      if (email) mockStore.users[mockIdx].email = email.trim().toLowerCase();
      if (fullName) mockStore.users[mockIdx].fullName = fullName.trim();
      if (role) mockStore.users[mockIdx].role = role as UserRole;
      if (newPassword && newPassword.trim()) {
        mockStore.users[mockIdx].passwordHash = hashedPassword!;
        mockStore.users[mockIdx].temporaryPassword = newPassword.trim();
      }
      if (!updatedUser) {
        updatedUser = {
          id: mockStore.users[mockIdx].id,
          email: mockStore.users[mockIdx].email,
          full_name: mockStore.users[mockIdx].fullName,
          fullName: mockStore.users[mockIdx].fullName,
          role: mockStore.users[mockIdx].role,
          created_at: new Date().toISOString()
        };
      }
    }

    if (!updatedUser) {
      return NextResponse.json({ error: 'User account not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'User credentials and permissions updated successfully.',
      user: sanitizeUser(updatedUser)
    });
  } catch (error) {
    console.error('Failed to update credentials:', error);
    return NextResponse.json(
      { error: 'Internal server error while updating user credentials.' },
      { status: 500 }
    );
  }
}
