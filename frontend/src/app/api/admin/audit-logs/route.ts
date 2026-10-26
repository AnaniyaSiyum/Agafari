export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/lib/auth';
import { query } from '@/lib/db';
import { mockStore } from '@/lib/mockData';
import { logAuditEvent } from '@/lib/audit';

export async function GET(req: NextRequest) {
  const auth = requirePermission(req, 'audit:read');
  if (!auth.ok) return auth.response;

  try {
    // 1. Audit this sensitive security log read operation
    await logAuditEvent({
      actorId: auth.user.userId,
      actorRole: auth.user.role,
      targetResource: 'AUDIT_LOG',
      operation: 'READ_SENSITIVE',
      action: 'AUDIT_LOGS_ACCESSED',
      req,
      outcome: 'SUCCESS',
      details: { countRequested: 100 },
    });

    let combinedRows: any[] = [];

    // 2. Query from audit_log (migration 007)
    try {
      const rows1 = await query(`
        SELECT id, actor_id, action, target_type, target_id, ip, meta_json, created_at
        FROM audit_log
        ORDER BY created_at DESC
        LIMIT 100
      `);
      if (rows1 && rows1.length > 0) {
        combinedRows.push(
          ...rows1.map((l: any) => {
            const parsedMeta = typeof l.meta_json === 'string' ? JSON.parse(l.meta_json) : l.meta_json || {};
            return {
              id: l.id,
              actorId: l.actor_id,
              targetUserId: l.target_id,
              targetResource: l.target_type || 'SYSTEM',
              operation: parsedMeta.operation || 'READ_SENSITIVE',
              action: l.action,
              ipAddress: l.ip,
              outcome: parsedMeta.outcome || 'SUCCESS',
              userAgent: parsedMeta.userAgent || 'unknown',
              details: parsedMeta,
              createdAt: l.created_at,
            };
          })
        );
      }
    } catch {}

    // 3. Query from audit_logs (migration 005)
    try {
      const rows2 = await query(`
        SELECT id, actor_id, target_user_id, action, ip_address, details, created_at
        FROM audit_logs
        ORDER BY created_at DESC
        LIMIT 100
      `);
      if (rows2 && rows2.length > 0) {
        combinedRows.push(
          ...rows2.map((l: any) => {
            const parsed = typeof l.details === 'string' ? JSON.parse(l.details) : l.details || {};
            return {
              id: l.id,
              actorId: l.actor_id,
              targetUserId: l.target_user_id,
              targetResource: 'USER',
              operation: parsed.operation || 'UPDATE',
              action: l.action,
              ipAddress: l.ip_address,
              outcome: parsed.outcome || 'SUCCESS',
              userAgent: parsed.userAgent || 'unknown',
              details: parsed,
              createdAt: l.created_at,
            };
          })
        );
      }
    } catch {}

    // 4. Merge mockStore audit logs
    const mockLogs = ((mockStore as any).auditLogs || []).map((m: any) => ({
      id: m.id,
      actorId: m.actorId,
      targetUserId: m.targetId || m.targetUserId,
      targetResource: m.targetResource || 'SYSTEM',
      operation: m.operation || 'UPDATE',
      action: m.action,
      ipAddress: m.clientIp || m.ipAddress || '127.0.0.1',
      userAgent: m.userAgent || 'unknown',
      outcome: m.outcome || 'SUCCESS',
      details: m.details,
      createdAt: m.timestamp || m.createdAt,
    }));

    // Deduplicate by ID and sort descending
    const seenIds = new Set<string>();
    const allLogs = [...mockLogs, ...combinedRows].filter((entry) => {
      if (seenIds.has(entry.id)) return false;
      seenIds.add(entry.id);
      return true;
    });

    allLogs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ auditLogs: allLogs.slice(0, 100) });
  } catch (error) {
    console.error('Failed to fetch audit logs:', error);
    return NextResponse.json({ error: 'Failed to retrieve audit logs.' }, { status: 500 });
  }
}
