export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { checkEventAccess } from '@/lib/eventScope';
import { checkRateLimit, getClientIp, buildRateLimitResponse } from '@/lib/rateLimit';

// GET: Fetch all Mezmur & Music recommendations for this event
export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const routeParams = await params;
  const { searchParams } = new URL(req.url);
  const statusFilter = searchParams.get('status'); // PENDING | APPROVED | REJECTED | ALL

  try {
    const event = await queryOne<{ id: string }>('SELECT id FROM events WHERE LOWER(slug) = LOWER($1)', [routeParams.slug]);
    if (!event) return NextResponse.json({ error: 'Event not found.' }, { status: 404 });

    const user = getAuthUser(req);
    const access = user ? await checkEventAccess(user, event.id, ['CONTENT_MODERATOR']) : { allowed: false as const };
    const isModerator = access.allowed;

    const targetStatus = statusFilter === 'ALL' ? null : (isModerator ? (statusFilter ?? null) : (statusFilter ?? 'APPROVED'));

    const rawItems = await query(
      `SELECT * FROM media_assets 
       WHERE event_id = $1 
         AND (category = 'MEZMUR' OR category = 'MUSIC' OR media_type = 'MEZMUR' OR caption LIKE '{"title"%')
         AND ($2 IS NULL OR status = $2)
       ORDER BY created_at DESC`,
      [event.id, targetStatus]
    );

    const items = rawItems.map((item: any) => {
      let parsedCaption = { title: item.caption || 'Untitled Song', artist: '' };
      try {
        if (item.caption && item.caption.trim().startsWith('{')) {
          const parsed = JSON.parse(item.caption);
          parsedCaption = { title: parsed.title || item.caption || 'Untitled Song', artist: parsed.artist || '' };
        } else if (item.caption && item.caption.includes('|')) {
          const parts = item.caption.split('|');
          parsedCaption = { title: parts[0].trim(), artist: parts[1]?.trim() || '' };
        } else {
          parsedCaption = { title: item.caption || 'Untitled Song', artist: '' };
        }
      } catch (e) {
        parsedCaption = { title: item.caption || 'Untitled Song', artist: '' };
      }

      return {
        id: item.id,
        guestName: item.uploader_name || item.uploaderName || 'Honored Guest',
        title: parsedCaption.title,
        artist: parsedCaption.artist,
        category: 'MEZMUR',
        status: item.status || 'PENDING',
        createdAt: item.created_at || item.createdAt || new Date().toISOString(),
      };
    });

    return NextResponse.json({ success: true, recommendations: items, items });
  } catch (err) {
    console.error('Error fetching music recommendations:', err);
    return NextResponse.json({ recommendations: [], items: [] });
  }
}

// POST: Guest submits a Mezmur or Music recommendation
export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const routeParams = await params;
  const clientIp = getClientIp(req);
  const rateLimitRes = checkRateLimit(`music:${routeParams.slug}:${clientIp}`, { max: 5, windowSeconds: 300 });
  if (!rateLimitRes.success) {
    return buildRateLimitResponse(rateLimitRes.retryAfterSeconds, 'Too many music recommendations submitted. Please wait before submitting another song.', 5, 0);
  }

  try {
    const { guestName, songTitle, artistName, title, artist } = await req.json();
    const finalTitle = (songTitle || title || '').trim();
    const finalArtist = (artistName || artist || '').trim();
    const finalGuestName = (guestName || 'Honored Guest').trim();

    if (!finalTitle) {
      return NextResponse.json({ error: 'Song or Mezmur title is required.' }, { status: 400 });
    }

    const event = await queryOne<{ id: string }>('SELECT id FROM events WHERE LOWER(slug) = LOWER($1)', [routeParams.slug]);
    if (!event) return NextResponse.json({ error: 'Event not found.' }, { status: 404 });

    const mediaId = `mez_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const captionJson = JSON.stringify({ title: finalTitle, artist: finalArtist });

    await query(
      `INSERT INTO media_assets (id, event_id, uploader_name, media_type, category, cdn_url, caption, status)
       VALUES ($1, $2, $3, 'IMAGE', 'MEZMUR', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800', $4, 'APPROVED')`,
      [mediaId, event.id, finalGuestName, captionJson]
    );

    return NextResponse.json(
      {
        success: true,
        recommendation: {
          id: mediaId,
          guestName: finalGuestName,
          title: finalTitle,
          artist: finalArtist,
          category: 'MEZMUR',
          status: 'APPROVED',
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to submit music recommendation:', error);
    return NextResponse.json({ error: 'Failed to submit recommendation.' }, { status: 500 });
  }
}
