export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { checkEventAccess } from '@/lib/eventScope';
import { query, queryOne } from '@/lib/db';
import { verifyRateLimit, getClientIp, buildRateLimitResponse } from '@/lib/rateLimit';
import { mockStore } from '@/infrastructure/dev/mockData';

// GET: the couple's public wishes wall. Guests only ever see APPROVED wishes;
// an organizer/couple/admin/moderator can pass ?status= to review PENDING/REJECTED.
// (Text wishes default to APPROVED per schema — auto-publish is the intended
// behavior here, unlike video posts which always start PENDING. Anything that
// slips through gets taken down after the fact via /api/organizer/wishes.)
export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const { searchParams } = new URL(req.url);
  const requestedStatus = searchParams.get('status');

  let event: { id: string } | null = null;
  try {
    event = await queryOne<{ id: string }>('SELECT id FROM events WHERE LOWER(slug) = LOWER($1)', [params.slug]);
  } catch (e) {}

  if (!event) {
    const mockEvt = mockStore.events.find(
      (e: any) =>
        e.slug?.toLowerCase() === params.slug.toLowerCase() ||
        e.id === params.slug ||
        e.id === `evt-${params.slug}`
    );
    if (mockEvt) {
      event = { id: mockEvt.id };
    }
  }

  if (!event) return NextResponse.json({ error: 'Event not found.' }, { status: 404 });

  let statusFilter: string | null = 'APPROVED';
  if (requestedStatus) {
    const user = getAuthUser(req);
    const access = user ? await checkEventAccess(user, event.id, ['CONTENT_MODERATOR']) : { allowed: false as const };
    if (access.allowed) statusFilter = requestedStatus;
    // if not authorized to see other statuses, silently fall back to APPROVED
    // rather than erroring — this endpoint is also hit by the public page.
  }

  let wishes: any[] = [];
  try {
    wishes = await query(
      `SELECT id, sender_name, message, media_type, video_url, is_featured, created_at
       FROM wishes WHERE event_id = $1 AND ($2 IS NULL OR status = $2)
       ORDER BY is_featured DESC, created_at DESC`,
      [event.id, statusFilter]
    );
  } catch (e) {}

  if (!wishes || wishes.length === 0) {
    wishes = mockStore.wishes
      .filter((w: any) => w.eventId === event?.id || w.eventId === params.slug || w.eventId === `evt-${params.slug}`)
      .map((w: any) => ({
        id: w.id,
        sender_name: w.senderName,
        message: w.message,
        media_type: w.mediaType || 'TEXT',
        video_url: w.videoUrl || null,
        is_featured: false,
        created_at: w.createdAt,
      }));
  }

  return NextResponse.json({ wishes });
}

// POST: a guest leaves a wish/blessing for the couple. No auth required — guests
// aren't logged-in users on this platform, same as RSVP and media uploads.
export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const clientIp = getClientIp(req);
  const rateLimitRes = await verifyRateLimit(`wishes:${params.slug}:${clientIp}`, { max: 3, windowSeconds: 300 });
  if (!rateLimitRes.success) {
    return buildRateLimitResponse(rateLimitRes);
  }

  try {

    const { senderName, message, mediaType, videoUrl } = await req.json();
    if (!senderName?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'senderName and message are required.' }, { status: 400 });
    }
    if (message.length > 2000) {
      return NextResponse.json({ error: 'message is too long (max 2000 characters).' }, { status: 400 });
    }

    const event = await queryOne<{ id: string }>('SELECT id FROM events WHERE LOWER(slug) = LOWER($1)', [params.slug]);
    if (!event) return NextResponse.json({ error: 'Event not found.' }, { status: 404 });

    const wishId = 'w_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
    await query(
      `INSERT INTO wishes (id, event_id, sender_name, message, media_type, video_url, status)
       VALUES ($1,$2,$3,$4,$5,$6,'PENDING')`,
      [wishId, event.id, senderName.trim(), message.trim(), mediaType ?? 'TEXT', videoUrl ?? null]
    );

    // If wish contains a video, also create a media_assets record for moderation
    if (mediaType === 'VIDEO' || videoUrl) {
      const mediaId = `med_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      await query(
        `INSERT INTO media_assets (id, event_id, uploader_name, media_type, category, cdn_url, caption, status)
         VALUES ($1,$2,$3,'VIDEO','WISHES',$4,$5,'PENDING')`,
        [mediaId, event.id, senderName.trim(), videoUrl || '', message.trim()]
      );
    }

    const wish = await queryOne(
      'SELECT id, sender_name, message, media_type, video_url, status, created_at FROM wishes WHERE id = $1',
      [wishId]
    );

    return NextResponse.json({ success: true, wish }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit wish.' }, { status: 500 });
  }
}
