export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { checkEventAccess } from '@/lib/eventScope';
import { query, queryOne } from '@/lib/db';

// GET /api/organizer/media?eventId=...&status=PENDING&category=BTS
// The content-moderator dashboard: a TikTok-like feed view with an approve/
// reject/pending indicator per item, scoped to one event. Defaults to the
// PENDING queue since that's the moderator's actual workload.
export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get('eventId');
  const status = searchParams.get('status') ?? 'PENDING';
  const category = searchParams.get('category'); // WISHES | BTS | LIVE
  if (!eventId) return NextResponse.json({ error: 'eventId is required.' }, { status: 400 });

  const access = await checkEventAccess(user, eventId, ['CONTENT_MODERATOR']);
  if (!access.allowed) return NextResponse.json({ error: 'Forbidden for this event.' }, { status: 403 });

  const items = await query(
    `SELECT * FROM media_assets
     WHERE event_id = $1
       AND ($2::admin_approval_enum IS NULL OR status = $2)
       AND ($3::media_category_enum IS NULL OR category = $3)
     ORDER BY created_at ASC`, // oldest-pending-first so nothing sits unreviewed
    [eventId, status === 'ALL' ? null : status, category]
  );

  const counts = await queryOne<{ pending: string; approved: string; rejected: string }>(
    `SELECT
       COUNT(*) FILTER (WHERE status = 'PENDING')  AS pending,
       COUNT(*) FILTER (WHERE status = 'APPROVED') AS approved,
       COUNT(*) FILTER (WHERE status = 'REJECTED') AS rejected
     FROM media_assets WHERE event_id = $1`,
    [eventId]
  );

  return NextResponse.json({ items, counts });
}

// PATCH { eventId, mediaId, action: 'approve' | 'reject' }
export async function PATCH(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { eventId, mediaId, action } = await req.json();
    if (!eventId || !mediaId || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'eventId, mediaId, and action (approve|reject) are required.' }, { status: 400 });
    }

    const access = await checkEventAccess(user, eventId, ['CONTENT_MODERATOR']);
    if (!access.allowed) return NextResponse.json({ error: 'Forbidden for this event.' }, { status: 403 });

    const newStatus = action === 'approve' ? 'APPROVED' : 'REJECTED';
    const updated = await queryOne(
      `UPDATE media_assets SET status = $1, moderated_by = $2 WHERE id = $3 AND event_id = $4 RETURNING *`,
      [newStatus, user.userId, mediaId, eventId]
    );

    if (!updated) return NextResponse.json({ error: 'Media item not found for this event.' }, { status: 404 });
    return NextResponse.json({ success: true, item: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update media status.' }, { status: 500 });
  }
}
