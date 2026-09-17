export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { checkEventAccess } from '@/lib/eventScope';
import { query, queryOne } from '@/lib/db';

// GET: the TikTok-style feed for one wedding, filtered by category (WISHES | BTS | LIVE).
// Guests only ever see APPROVED items; a CONTENT_MODERATOR/ORGANIZER_OWNER/COUPLE/
// SYSTEM_ADMIN for *this specific event* can pass ?status= to see the moderation queue.
//
// CHANGED from Phase 3a: `isModerator` was `hasRole(user, ['SYSTEM_ADMIN'])`, a
// placeholder noted at the time as "event-scoped moderator check happens in
// Phase 3b." This wires that up via checkEventAccess now that it exists —
// otherwise an event's own CONTENT_MODERATOR/organizer/couple could never see
// their own pending queue through this endpoint.
export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category'); // WISHES | BTS | LIVE
  const guestIdentifier = searchParams.get('guestId'); // device/session id, for "did I like this"

  const event = await queryOne<{ id: string }>('SELECT id FROM events WHERE slug = $1', [params.slug]);
  if (!event) return NextResponse.json({ error: 'Event not found.' }, { status: 404 });

  const user = getAuthUser(req);
  const access = user ? await checkEventAccess(user, event.id, ['CONTENT_MODERATOR']) : { allowed: false as const };
  const isModerator = access.allowed;

  const statusFilter = isModerator ? (searchParams.get('status') ?? null) : 'APPROVED';

  const items = await query(
    `SELECT m.*,
            ${guestIdentifier ? '(pl.id IS NOT NULL) AS liked_by_me' : 'FALSE AS liked_by_me'}
     FROM media_assets m
     ${guestIdentifier ? 'LEFT JOIN post_likes pl ON pl.media_id = m.id AND pl.guest_identifier = $4' : ''}
     WHERE m.event_id = $1
       AND ($2::media_category_enum IS NULL OR m.category = $2)
       AND ($3::admin_approval_enum IS NULL OR m.status = $3)
     ORDER BY m.created_at DESC`,
    guestIdentifier
      ? [event.id, category, statusFilter, guestIdentifier]
      : [event.id, category, statusFilter]
  );

  return NextResponse.json({ items });
}

// POST: guest uploads a wish/BTS clip — always starts PENDING, a moderator must approve it
export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { uploaderName, mediaType, category, cdnUrl, thumbnailUrl, caption } = await req.json();
    if (!uploaderName || !mediaType || !cdnUrl) {
      return NextResponse.json({ error: 'uploaderName, mediaType, and cdnUrl are required.' }, { status: 400 });
    }

    const event = await queryOne<{ id: string }>('SELECT id FROM events WHERE slug = $1', [params.slug]);
    if (!event) return NextResponse.json({ error: 'Event not found.' }, { status: 404 });

    const item = await queryOne(
      `INSERT INTO media_assets (event_id, uploader_name, media_type, category, cdn_url, thumbnail_url, caption, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,'PENDING') RETURNING *`,
      [event.id, uploaderName.trim(), mediaType, category ?? 'WISHES', cdnUrl, thumbnailUrl ?? null, caption ?? null]
    );

    return NextResponse.json({ success: true, item }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to upload media.' }, { status: 500 });
  }
}

// PATCH: like/unlike a post — idempotent per guestIdentifier via the post_likes
// UNIQUE constraint; likes_count on media_assets stays in sync via a DB trigger.
// Deliberately allows LIVE-category items to be liked (spec: no like/comment on
// live only means comments are off — the schema doesn't distinguish for likes,
// confirm with the team if live should also block likes before shipping).
export async function PATCH(req: NextRequest) {
  try {
    const { mediaId, guestIdentifier, action } = await req.json(); // action: 'like' | 'unlike'
    if (!mediaId || !guestIdentifier || !action) {
      return NextResponse.json({ error: 'mediaId, guestIdentifier, and action are required.' }, { status: 400 });
    }

    if (action === 'like') {
      await query(
        'INSERT INTO post_likes (media_id, guest_identifier) VALUES ($1,$2) ON CONFLICT (media_id, guest_identifier) DO NOTHING',
        [mediaId, guestIdentifier]
      );
    } else if (action === 'unlike') {
      await query('DELETE FROM post_likes WHERE media_id = $1 AND guest_identifier = $2', [mediaId, guestIdentifier]);
    } else {
      return NextResponse.json({ error: "action must be 'like' or 'unlike'." }, { status: 400 });
    }

    const updated = await queryOne('SELECT id, likes_count FROM media_assets WHERE id = $1', [mediaId]);
    return NextResponse.json({ success: true, media: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update like.' }, { status: 500 });
  }
}
