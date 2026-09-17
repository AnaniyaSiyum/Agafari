export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { checkEventAccess } from '@/lib/eventScope';
import { query, queryOne } from '@/lib/db';

// GET: the couple's public wishes wall. Guests only ever see APPROVED wishes;
// an organizer/couple/admin/moderator can pass ?status= to review PENDING/REJECTED.
// (Text wishes default to APPROVED per schema — auto-publish is the intended
// behavior here, unlike video posts which always start PENDING. Anything that
// slips through gets taken down after the fact via /api/organizer/wishes.)
export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const { searchParams } = new URL(req.url);
  const requestedStatus = searchParams.get('status');

  const event = await queryOne<{ id: string }>('SELECT id FROM events WHERE slug = $1', [params.slug]);
  if (!event) return NextResponse.json({ error: 'Event not found.' }, { status: 404 });

  let statusFilter: string | null = 'APPROVED';
  if (requestedStatus) {
    const user = getAuthUser(req);
    const access = user ? await checkEventAccess(user, event.id, ['CONTENT_MODERATOR']) : { allowed: false as const };
    if (access.allowed) statusFilter = requestedStatus;
    // if not authorized to see other statuses, silently fall back to APPROVED
    // rather than erroring — this endpoint is also hit by the public page.
  }

  const wishes = await query(
    `SELECT id, sender_name, message, media_type, video_url, is_featured, created_at
     FROM wishes WHERE event_id = $1 AND ($2::admin_approval_enum IS NULL OR status = $2)
     ORDER BY is_featured DESC, created_at DESC`,
    [event.id, statusFilter]
  );

  return NextResponse.json({ wishes });
}

// POST: a guest leaves a wish/blessing for the couple. No auth required — guests
// aren't logged-in users on this platform, same as RSVP and media uploads.
export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { senderName, message, mediaType, videoUrl } = await req.json();
    if (!senderName?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'senderName and message are required.' }, { status: 400 });
    }
    if (message.length > 2000) {
      return NextResponse.json({ error: 'message is too long (max 2000 characters).' }, { status: 400 });
    }

    const event = await queryOne<{ id: string }>('SELECT id FROM events WHERE slug = $1', [params.slug]);
    if (!event) return NextResponse.json({ error: 'Event not found.' }, { status: 404 });

    const wish = await queryOne(
      `INSERT INTO wishes (event_id, sender_name, message, media_type, video_url)
       VALUES ($1,$2,$3,$4,$5) RETURNING id, sender_name, message, media_type, video_url, status, created_at`,
      [event.id, senderName.trim(), message.trim(), mediaType ?? null, videoUrl ?? null]
    );

    return NextResponse.json({ success: true, wish }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit wish.' }, { status: 500 });
  }
}
