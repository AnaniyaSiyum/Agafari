export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireRole, hashPassword } from '@/lib/auth';
import { query, queryOne, withTransaction } from '@/lib/db';

// GET: every wedding event on the platform, with organizer/couple names and stats
export async function GET(req: NextRequest) {
  const auth = requireRole(req, ['SYSTEM_ADMIN']);
  if (!auth.ok) return auth.response;

  const events = await query(`
    SELECT
      e.*,
      o.business_name AS organizer_business_name,
      cu.full_name AS couple_full_name,
      cu.email AS couple_email,
      (SELECT COUNT(*) FROM invitations i WHERE i.event_id = e.id) AS total_invites,
      (SELECT COUNT(*) FROM wishes w WHERE w.event_id = e.id) AS total_wishes,
      (SELECT COUNT(*) FROM media_assets m WHERE m.event_id = e.id) AS total_media
    FROM events e
    LEFT JOIN organizers o ON o.id = e.organizer_id
    LEFT JOIN users cu ON cu.id = e.couple_user_id
    ORDER BY e.created_at DESC
  `);

  return NextResponse.json({ events });
}

// POST: create a new wedding event — either ADMIN-managed or under an existing organizer
export async function POST(req: NextRequest) {
  const auth = requireRole(req, ['SYSTEM_ADMIN']);
  if (!auth.ok) return auth.response;

  try {
    const body = await req.json();
    const {
      title, slug, brideName, groomName, eventDate, venueName, venueAddress,
      dressCode, welcomeMessage, coupleEmail,
      managedBy,      // 'ORGANIZER' | 'ADMIN'
      organizerId,    // required when managedBy === 'ORGANIZER'
      templateId,
    } = body;

    if (!title || !slug || !brideName || !groomName || !eventDate || !venueName) {
      return NextResponse.json(
        { error: 'Missing required event fields (title, slug, bride, groom, date, venue).' },
        { status: 400 }
      );
    }
    if (managedBy === 'ORGANIZER' && !organizerId) {
      return NextResponse.json({ error: 'organizerId is required when managedBy is ORGANIZER.' }, { status: 400 });
    }

    const cleanSlug = String(slug).toLowerCase().trim().replace(/[^a-z0-9-]/g, '-');

    const existing = await queryOne('SELECT id FROM events WHERE slug = $1', [cleanSlug]);
    if (existing) {
      return NextResponse.json({ error: `An event with slug '${cleanSlug}' already exists.` }, { status: 400 });
    }

    const result = await withTransaction(async (client) => {
      // Create the couple's login for this event
      const tempPassword = `agafari${Math.floor(1000 + Math.random() * 9000)}`;
      const coupleUser = (
        await client.query(
          `INSERT INTO users (email, password_hash, full_name, role)
           VALUES ($1, $2, $3, 'BRIDE_GROOM') RETURNING id, email`,
          [
            coupleEmail?.trim() || `couple@${cleanSlug}.com`,
            hashPassword(tempPassword),
            `${brideName.trim()} & ${groomName.trim()}`,
          ]
        )
      ).rows[0];

      const event = (
        await client.query(
          `INSERT INTO events (
             slug, title, managed_by, organizer_id, couple_user_id, template_id,
             bride_name, groom_name, event_date, venue_name, venue_address,
             dress_code, welcome_message, status, admin_approval_status
           ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,'COMING_SOON','APPROVED')
           RETURNING *`,
          [
            cleanSlug, title.trim(), managedBy === 'ORGANIZER' ? 'ORGANIZER' : 'ADMIN',
            managedBy === 'ORGANIZER' ? organizerId : null, coupleUser.id, templateId || null,
            brideName.trim(), groomName.trim(), new Date(eventDate).toISOString(),
            venueName.trim(), venueAddress?.trim() || null,
            dressCode?.trim() || null, welcomeMessage?.trim() || null,
          ]
        )
      ).rows[0];

      return { event, coupleTempPassword: tempPassword, coupleEmail: coupleUser.email };
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Wedding event created successfully.',
        event: result.event,
        // Shown exactly once, at creation — never again on subsequent GETs.
        coupleCredentials: { email: result.coupleEmail, temporaryPassword: result.coupleTempPassword },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create wedding event.' }, { status: 500 });
  }
}

// PATCH: approve/reject, change status, toggle live broadcast
export async function PATCH(req: NextRequest) {
  const auth = requireRole(req, ['SYSTEM_ADMIN']);
  if (!auth.ok) return auth.response;

  try {
    const { eventId, adminApprovalStatus, status, isLive, youtubeVideoId } = await req.json();
    if (!eventId) return NextResponse.json({ error: 'eventId is required.' }, { status: 400 });

    const event = await queryOne(
      `UPDATE events SET
         admin_approval_status = COALESCE($2, admin_approval_status),
         status = COALESCE($3, status),
         is_live = COALESCE($4, is_live),
         youtube_video_id = COALESCE($5, youtube_video_id)
       WHERE id = $1 RETURNING *`,
      [eventId, adminApprovalStatus ?? null, status ?? null, isLive ?? null, youtubeVideoId ?? null]
    );
    if (!event) return NextResponse.json({ error: 'Event not found.' }, { status: 404 });

    return NextResponse.json({ success: true, event });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update event.' }, { status: 500 });
  }
}

// DELETE: remove an event (cascades to invitations/media/etc. via FK ON DELETE CASCADE)
export async function DELETE(req: NextRequest) {
  const auth = requireRole(req, ['SYSTEM_ADMIN']);
  if (!auth.ok) return auth.response;

  const eventId = new URL(req.url).searchParams.get('eventId');
  if (!eventId) return NextResponse.json({ error: 'eventId is required.' }, { status: 400 });

  const deleted = await queryOne('DELETE FROM events WHERE id = $1 RETURNING id', [eventId]);
  if (!deleted) return NextResponse.json({ error: 'Event not found.' }, { status: 404 });

  return NextResponse.json({ success: true, message: 'Event deleted successfully.' });
}
