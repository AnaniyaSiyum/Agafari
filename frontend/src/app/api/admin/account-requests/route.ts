import { NextRequest, NextResponse } from 'next/server';
import { requireMembership } from '@/lib/requireMembership';
import { query } from '@/lib/db';

export async function GET(req: NextRequest) {
  const auth = await requireMembership(req, ['SYSTEM_ADMIN']);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const requests = await query<any>(`
    SELECT ar.id, ar.requested_by, ar.role, ar.scope_id, ar.details_json, ar.status, ar.handled_by,
           ar.created_at, ar.updated_at,
           u.full_name AS requester_name, u.email AS requester_email
    FROM account_requests ar
    LEFT JOIN users u ON ar.requested_by = u.id
    ORDER BY ar.created_at DESC
  `);

  return NextResponse.json({ success: true, requests });
}
