export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { checkEventAccess } from '@/lib/eventScope';
import { queryOne, query } from '@/lib/db';

// GET /api/organizer/media/comments?eventId=...&mediaId=...
// Moderator view of comments on one post (or every post in the event, if
// mediaId is omitted) — for spotting abuse that needs removing.
export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get('eventId');
  const mediaId = searchParams.get('mediaId');
  if (!eventId) return NextResponse.json({ error: 'eventId is required.' }, { status: 400 });

  const access = await checkEventAccess(user, eventId, ['CONTENT_MODERATOR']);
  if (!access.allowed) return NextResponse.json({ error: 'Forbidden for this event.' }, { status: 403 });

  const comments = await query(
    `SELECT c.*, m.event_id FROM media_comments c
     JOIN media_assets m ON m.id = c.media_id
     WHERE m.event_id = $1 AND ($2::uuid IS NULL OR c.media_id = $2)
     ORDER BY c.created_at DESC`,
    [eventId, mediaId]
  );
  return NextResponse.json({ comments });
}

// DELETE { eventId, commentId } — removes one comment. Scoped through a join
// back to the event so a moderator can't be tricked into deleting a comment
// that belongs to a different wedding by guessing an id.
export async function DELETE(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { eventId, commentId } = await req.json();
    if (!eventId || !commentId) {
      return NextResponse.json({ error: 'eventId and commentId are required.' }, { status: 400 });
    }

    const access = await checkEventAccess(user, eventId, ['CONTENT_MODERATOR']);
    if (!access.allowed) return NextResponse.json({ error: 'Forbidden for this event.' }, { status: 403 });

    const deleted = await queryOne(
      `DELETE FROM media_comments c USING media_assets m
       WHERE c.id = $1 AND c.media_id = m.id AND m.event_id = $2
       RETURNING c.id`,
      [commentId, eventId]
    );
    if (!deleted) return NextResponse.json({ error: 'Comment not found for this event.' }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete comment.' }, { status: 500 });
  }
}
