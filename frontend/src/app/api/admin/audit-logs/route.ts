export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/lib/auth';
import { query } from '@/lib/db';
import { mockStore } from '@/lib/mockData';

export async function GET(req: NextRequest) {
  const auth = requirePermission(req, 'audit:read');
  if (!auth.ok) return auth.response;

  try {
    let logs: any[] = [];
    try {
      logs = await query(`
        SELECT id, actor_id, target_user_id, action, ip_address, details, created_at
        FROM audit_logs
        ORDER BY created_at DESC
        LIMIT 100
      `);
    } catch (dbErr) {
      console.warn('DB Audit logs GET query fallback:', dbErr);
    }

    const formatted = (logs || []).map((l: any) => ({
      id: l.id,
      actorId: l.actor_id,
      targetUserId: l.target_user_id,
      action: l.action,
      ipAddress: l.ip_address,
      details: typeof l.details === 'string' ? JSON.parse(l.details) : l.details,
      createdAt: l.created_at,
    }));

    // Merge mockStore audit logs
    const mockLogs = (mockStore as any).auditLogs || [];
    const combined = [...formatted, ...mockLogs].slice(0, 100);

    return NextResponse.json({ auditLogs: combined });
  } catch (error) {
    console.error('Failed to fetch audit logs:', error);
    return NextResponse.json({ error: 'Failed to retrieve audit logs.' }, { status: 500 });
  }
}
