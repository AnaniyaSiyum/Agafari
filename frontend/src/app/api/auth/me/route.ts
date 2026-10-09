export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, sanitizeUser } from '@/lib/auth';
import { queryOne } from '@/lib/db';
import { mockStore } from '@/lib/mockData';

export async function GET(req: NextRequest) {
  const authPayload = getAuthUser(req);
  if (!authPayload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let user: any = null;
  try {
    user = await queryOne(
      'SELECT id, email, full_name, role, is_active, created_at FROM users WHERE id = $1',
      [authPayload.userId]
    );
  } catch (e) {
    console.warn('DB /api/auth/me query fallback:', e);
  }

  if (!user) {
    const mockUser = mockStore.users.find(
      (u) => u.id === authPayload.userId || u.email.toLowerCase() === authPayload.email.toLowerCase()
    );
    if (mockUser) {
      user = {
        id: mockUser.id,
        email: mockUser.email,
        full_name: mockUser.fullName,
        role: mockUser.role,
        is_active: true,
        organizer_id: mockUser.organizerId,
      };
    }
  }

  if (!user) {
    user = {
      id: authPayload.userId,
      email: authPayload.email,
      full_name: authPayload.email,
      role: authPayload.role,
      is_active: true,
    };
  }

  return NextResponse.json({
    user: {
      ...sanitizeUser(user),
      role: user.role || authPayload.role,
      tenantId: authPayload.tenantId || user.organizer_id,
      organizerId: authPayload.tenantId || user.organizer_id,
      permissions: authPayload.permissions || [],
    },
  });
}

