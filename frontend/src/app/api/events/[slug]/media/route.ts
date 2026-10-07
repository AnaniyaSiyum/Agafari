export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { checkEventAccess } from '@/lib/eventScope';
import { query, queryOne } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category'); // WISHES | BTS | LIVE
  const guestIdentifier = searchParams.get('guestId'); // device/session id, for "did I like this"

  try {
    const event = await queryOne<{ id: string }>('SELECT id FROM events WHERE LOWER(slug) = LOWER($1)', [params.slug]);
    if (!event) return NextResponse.json({ error: 'Event not found.' }, { status: 404 });

    const user = getAuthUser(req);
    const access = user ? await checkEventAccess(user, event.id, ['CONTENT_MODERATOR']) : { allowed: false as const };
    const isModerator = access.allowed;

    const rawStatus = searchParams.get('status');
    const statusFilter = (rawStatus === 'ALL' || rawStatus === 'null') ? null : (isModerator ? (rawStatus ?? null) : (rawStatus ?? 'APPROVED'));

    const rawItems = await query(
      `SELECT m.*,
              ${guestIdentifier ? '(pl.id IS NOT NULL) AS liked_by_me' : 'FALSE AS liked_by_me'}
       FROM media_assets m
       ${guestIdentifier ? 'LEFT JOIN post_likes pl ON pl.media_id = m.id AND pl.guest_identifier = $4' : ''}
       WHERE m.event_id = $1
         AND ($2 IS NULL OR m.category = $2)
         AND ($3 IS NULL OR m.status = $3)
       ORDER BY m.created_at DESC`,
      guestIdentifier
        ? [event.id, category || null, statusFilter, guestIdentifier]
        : [event.id, category || null, statusFilter]
    );

    const items = rawItems.map((item: any) => ({
      ...item,
      id: item.id,
      uploaderName: item.uploader_name || item.uploaderName || 'Guest',
      mediaType: item.media_type || item.mediaType || 'VIDEO',
      category: item.category || (typeof item.caption === 'string' && item.caption.trim().startsWith('{') ? 'MEZMUR' : 'WISHES'),
      cdnUrl: item.cdn_url || item.cdnUrl || item.url || '',
      thumbnailUrl: item.thumbnail_url || item.thumbnailUrl || null,
      caption: item.caption || '',
      viewsCount: Number(item.views_count || item.viewsCount || 0),
      likesCount: Number(item.likes_count || item.likesCount || 0),
      status: item.status || 'APPROVED'
    }));

    return NextResponse.json({ items, mediaAssets: items });
  } catch (err) {
    console.error('Error fetching media:', err);
    return NextResponse.json({ items: [], mediaAssets: [] });
  }
}

// POST: guest or media moderator uploads a wish/BTS clip
export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { uploaderName, mediaType, category, cdnUrl, thumbnailUrl, caption, status } = await req.json();
    if (!uploaderName || !mediaType || !cdnUrl) {
      return NextResponse.json({ error: 'uploaderName, mediaType, and cdnUrl are required.' }, { status: 400 });
    }

    const event = await queryOne<{ id: string }>('SELECT id FROM events WHERE LOWER(slug) = LOWER($1)', [params.slug]);
    if (!event) return NextResponse.json({ error: 'Event not found.' }, { status: 404 });

    const user = getAuthUser(req);
    const initialStatus = (user?.role === 'SYSTEM_ADMIN' || user?.role === 'EVENT_ORGANIZER' || status === 'APPROVED') ? 'APPROVED' : 'PENDING';

    const mediaId = `med_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    await query(
      `INSERT INTO media_assets (id, event_id, uploader_name, media_type, category, cdn_url, thumbnail_url, caption, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [mediaId, event.id, uploaderName.trim(), mediaType, category ?? 'WISHES', cdnUrl, thumbnailUrl ?? null, caption ?? null, initialStatus]
    );

    const item = await queryOne('SELECT * FROM media_assets WHERE id = $1', [mediaId]);

    return NextResponse.json({ success: true, item }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to upload media.' }, { status: 500 });
  }
}

// PATCH: like/unlike a post
export async function PATCH(req: NextRequest) {
  try {
    const { mediaId, guestIdentifier, action } = await req.json(); // action: 'like' | 'unlike'
    if (!mediaId || !guestIdentifier || !action) {
      return NextResponse.json({ error: 'mediaId, guestIdentifier, and action are required.' }, { status: 400 });
    }

    const targetMedia = await queryOne<{ id: string; category: string }>(
      'SELECT id, category FROM media_assets WHERE id = $1',
      [mediaId]
    );

    if (!targetMedia) {
      return NextResponse.json({ error: 'Media post not found.' }, { status: 404 });
    }

    if (targetMedia.category === 'LIVE') {
      return NextResponse.json({ error: 'Likes are disabled on live broadcasts.' }, { status: 403 });
    }

    if (action === 'like') {
      const likeId = `like_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      await query(
        'INSERT IGNORE INTO post_likes (id, media_id, guest_identifier) VALUES ($1,$2,$3)',
        [likeId, mediaId, guestIdentifier]
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
