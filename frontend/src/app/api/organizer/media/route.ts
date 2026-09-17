export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { checkEventAccess } from '@/lib/eventScope';
import { query, queryOne } from '@/lib/db';

// GET /api/organizer/media?eventId=...&status=PENDING&category=BTS
export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get('eventId');
  const status = searchParams.get('status') ?? 'PENDING';
  const category = searchParams.get('category');
  const statusVal = status === 'ALL' ? null : status;

  if (!eventId) {
    if (user?.role === 'SYSTEM_ADMIN') {
      try {
        const rawItems = await query(
          `SELECT * FROM media_assets
           WHERE ($1 IS NULL OR status = $1)
             AND ($2 IS NULL OR category = $2)
           ORDER BY created_at DESC`,
          [statusVal, category || null]
        );
        const items = rawItems.map((m: any) => ({
          ...m,
          uploaderName: m.uploader_name || m.uploaderName || 'Guest',
          mediaType: m.media_type || m.mediaType || 'IMAGE',
          cdnUrl: m.cdn_url || m.cdnUrl || m.url || '',
          likesCount: m.likes_count || m.likesCount || 0
        }));
        return NextResponse.json({ mediaAssets: items, items });
      } catch (err) {
        return NextResponse.json({ mediaAssets: [], items: [] });
      }
    }
    return NextResponse.json({ mediaAssets: [], items: [] });
  }

  const access = await checkEventAccess(user, eventId, ['CONTENT_MODERATOR']);
  if (!access.allowed) return NextResponse.json({ error: 'Forbidden for this event.' }, { status: 403 });

  const rawItems = await query(
    `SELECT * FROM media_assets
     WHERE event_id = $1
       AND ($2 IS NULL OR status = $2)
       AND ($3 IS NULL OR category = $3)
     ORDER BY created_at DESC`,
    [eventId, statusVal, category || null]
  );

  const items = rawItems.map((m: any) => ({
    ...m,
    uploaderName: m.uploader_name || m.uploaderName || 'Guest',
    mediaType: m.media_type || m.mediaType || 'IMAGE',
    cdnUrl: m.cdn_url || m.cdnUrl || m.url || '',
    likesCount: m.likes_count || m.likesCount || 0
  }));

  const counts = await queryOne<{ pending: number; approved: number; rejected: number }>(
    `SELECT
       COUNT(CASE WHEN status = 'PENDING' THEN 1 END)  AS pending,
       COUNT(CASE WHEN status = 'APPROVED' THEN 1 END) AS approved,
       COUNT(CASE WHEN status = 'REJECTED' THEN 1 END) AS rejected
     FROM media_assets WHERE event_id = $1`,
    [eventId]
  );

  return NextResponse.json({ mediaAssets: items, items, counts });
}

// POST: Direct Media Upload by Moderator / Organizer (Auto-APPROVED)
export async function POST(req: NextRequest) {
  const user = getAuthUser(req);

  try {
    const body = await req.json();
    const { eventId, uploaderName, mediaType, category, cdnUrl, caption, status } = body;

    if (!eventId || !cdnUrl) {
      return NextResponse.json({ error: 'eventId and cdnUrl are required.' }, { status: 400 });
    }

    if (user && eventId) {
      const access = await checkEventAccess(user, eventId, ['CONTENT_MODERATOR']);
      if (!access.allowed) return NextResponse.json({ error: 'Forbidden for this event.' }, { status: 403 });
    }

    const mediaId = `med_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const finalStatus = status || 'APPROVED';

    await query(
      `INSERT INTO media_assets (id, event_id, uploader_name, media_type, category, cdn_url, caption, status, moderated_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mediaId,
        eventId,
        (uploaderName || 'Media Moderator').trim(),
        mediaType || 'IMAGE',
        category || 'GALLERY',
        cdnUrl,
        caption ? caption.trim() : null,
        finalStatus,
        user?.userId || null
      ]
    );

    // If wish video/photo with message, sync to wishes table
    if (category === 'WISHES' && caption) {
      try {
        const wishId = 'w_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
        await query(
          `INSERT INTO wishes (id, event_id, sender_name, message, media_type, video_url, status)
           VALUES ($1,$2,$3,$4,$5,$6,$7)`,
          [
            wishId,
            eventId,
            (uploaderName || 'Media Moderator').trim(),
            caption.trim(),
            mediaType || 'VIDEO',
            cdnUrl,
            finalStatus
          ]
        );
      } catch (wErr) {
        console.warn('Wishes table sync optional insert error:', wErr);
      }
    }

    const item = await queryOne('SELECT * FROM media_assets WHERE id = $1', [mediaId]);

    const formattedItem = {
      ...item,
      uploaderName: item.uploader_name || item.uploaderName,
      mediaType: item.media_type || item.mediaType,
      cdnUrl: item.cdn_url || item.cdnUrl
    };

    return NextResponse.json({ success: true, item: formattedItem }, { status: 201 });
  } catch (err) {
    console.error('Failed to create media asset:', err);
    return NextResponse.json({ error: 'Failed to create media asset.' }, { status: 500 });
  }
}

// PATCH { eventId, mediaId, action: 'approve' | 'reject', status }
export async function PATCH(req: NextRequest) {
  const user = getAuthUser(req);

  try {
    const body = await req.json();
    const { eventId, mediaId, action, status } = body;
    const requestedAction = action || (status === 'APPROVED' ? 'approve' : 'reject');

    if (!mediaId) {
      return NextResponse.json({ error: 'mediaId is required.' }, { status: 400 });
    }

    if (user && eventId) {
      const access = await checkEventAccess(user, eventId, ['CONTENT_MODERATOR']);
      if (!access.allowed) return NextResponse.json({ error: 'Forbidden for this event.' }, { status: 403 });
    }

    const newStatus = requestedAction === 'approve' || status === 'APPROVED' ? 'APPROVED' : 'REJECTED';
    await query(
      `UPDATE media_assets SET status = $1, moderated_by = $2 WHERE id = $3`,
      [newStatus, user?.userId || null, mediaId]
    );

    const updated = await queryOne(`SELECT * FROM media_assets WHERE id = $1`, [mediaId]);

    if (!updated) return NextResponse.json({ error: 'Media item not found.' }, { status: 404 });

    const formattedItem = {
      ...updated,
      uploaderName: updated.uploader_name || updated.uploaderName,
      mediaType: updated.media_type || updated.mediaType,
      cdnUrl: updated.cdn_url || updated.cdnUrl
    };

    return NextResponse.json({ success: true, item: formattedItem });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update media status.' }, { status: 500 });
  }
}

// DELETE /api/organizer/media?mediaId=...&eventId=...
export async function DELETE(req: NextRequest) {
  const user = getAuthUser(req);
  const { searchParams } = new URL(req.url);
  const mediaId = searchParams.get('mediaId');
  const eventId = searchParams.get('eventId');

  if (!mediaId) {
    return NextResponse.json({ error: 'mediaId is required.' }, { status: 400 });
  }

  try {
    if (user && eventId) {
      const access = await checkEventAccess(user, eventId, ['CONTENT_MODERATOR']);
      if (!access.allowed) return NextResponse.json({ error: 'Forbidden for this event.' }, { status: 403 });
    }

    await query('DELETE FROM media_assets WHERE id = $1', [mediaId]);
    return NextResponse.json({ success: true, mediaId });
  } catch (err) {
    console.error('Failed to delete media asset:', err);
    return NextResponse.json({ error: 'Failed to delete media asset.' }, { status: 500 });
  }
}
