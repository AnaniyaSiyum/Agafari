export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, sanitizeUser } from '@/lib/auth';
import { queryOne } from '@/lib/db';

export async function GET(req: NextRequest) {
  const authPayload = getAuthUser(req);
  if (!authPayload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await queryOne(
    'SELECT id, email, full_name, role, is_active, created_at FROM users WHERE id = $1',
    [authPayload.userId]
  );
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({ user: sanitizeUser(user) });
}
