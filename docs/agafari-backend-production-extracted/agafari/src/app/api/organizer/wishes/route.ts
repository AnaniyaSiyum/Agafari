export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { checkEventAccess } from '@/lib/eventScope';
import { query, queryOne } from '@/lib/db';

// GET /api/organizer/wishes?eventId=...&status=PENDING
// Moderation queue for text wishes — even though wishes auto-publish (APPROVED
// by default), an organizer/moderator/couple needs to be able to review and
// take one down after the fact, or feature a favorite on the public wall.
export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get('eventId');
  const status = searchParams.get('status'); // optional filter
  if (!eventId) return NextResponse.json({ error: 'eventId is required.' }, { status: 400 });

  const access = await checkEventAccess(user, eventId, ['CONTENT_MODERATOR']);
  if (!access.allowed) return NextResponse.json({ error: 'Forbidden for this event.' }, { status: 403 });

  const wishes = await query(
    `SELECT * FROM wishes WHERE event_id = $1 AND ($2::admin_approval_enum IS NULL OR status = $2)
     ORDER BY created_at DESC`,
    [eventId, status]
  );

  return NextResponse.json({ wishes });
}

// PATCH { eventId, wishId, action: 'approve' | 'reject' | 'feature' | 'unfeature' }
export async function PATCH(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { eventId, wishId, action } = await req.json();
    if (!eventId || !wishId || !action) {
      return NextResponse.json({ error: 'eventId, wishId, and action are required.' }, { status: 400 });
    }

    const access = await checkEventAccess(user, eventId, ['CONTENT_MODERATOR']);
    if (!access.allowed) return NextResponse.json({ error: 'Forbidden for this event.' }, { status: 403 });

    let updated;
    if (action === 'approve' || action === 'reject') {
      const newStatus = action === 'approve' ? 'APPROVED' : 'REJECTED';
      updated = await queryOne(
        `UPDATE wishes SET status = $1 WHERE id = $2 AND event_id = $3 RETURNING *`,
        [newStatus, wishId, eventId]
      );
    } else if (action === 'feature' || action === 'unfeature') {
      updated = await queryOne(
        `UPDATE wishes SET is_featured = $1 WHERE id = $2 AND event_id = $3 RETURNING *`,
        [action === 'feature', wishId, eventId]
      );
    } else {
      return NextResponse.json({ error: "action must be one of approve, reject, feature, unfeature." }, { status: 400 });
    }

    if (!updated) return NextResponse.json({ error: 'Wish not found for this event.' }, { status: 404 });
    return NextResponse.json({ success: true, wish: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update wish.' }, { status: 500 });
  }
}
