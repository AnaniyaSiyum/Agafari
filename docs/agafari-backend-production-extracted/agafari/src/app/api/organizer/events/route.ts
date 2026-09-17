export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireRole, hashPassword } from '@/lib/auth';
import { query, queryOne, withTransaction } from '@/lib/db';

async function resolveOrganizerId(userId: string): Promise<string | null> {
  const org = await queryOne<{ id: string }>('SELECT id FROM organizers WHERE owner_user_id = $1', [userId]);
  return org?.id ?? null;
}

// GET: all events this organizer owns (previously impossible — organizer was capped at one event)
export async function GET(req: NextRequest) {
  const auth = requireRole(req, ['EVENT_ORGANIZER']);
  if (!auth.ok) return auth.response;

  const organizerId = await resolveOrganizerId(auth.user.userId);
  if (!organizerId) return NextResponse.json({ events: [] });

  const events = await query(
    `SELECT e.*,
            (SELECT COUNT(*) FROM invitations i WHERE i.event_id = e.id) AS total_invites,
            (SELECT COUNT(*) FROM media_assets m WHERE m.event_id = e.id AND m.status = 'PENDING') AS pending_media
     FROM events e WHERE e.organizer_id = $1 ORDER BY e.event_date ASC`,
    [organizerId]
  );

  return NextResponse.json({ events });
}

// POST: organizer creates a new wedding under their own account
export async function POST(req: NextRequest) {
  const auth = requireRole(req, ['EVENT_ORGANIZER']);
  if (!auth.ok) return auth.response;

  const organizerId = await resolveOrganizerId(auth.user.userId);
  if (!organizerId) {
    return NextResponse.json({ error: 'No organizer profile found for this account.' }, { status: 404 });
  }

  try {
    const { title, slug, brideName, groomName, eventDate, venueName, venueAddress, dressCode, coupleEmail, templateId } =
      await req.json();

    if (!title || !slug || !brideName || !groomName || !eventDate || !venueName) {
      return NextResponse.json({ error: 'Missing required event fields.' }, { status: 400 });
    }

    const cleanSlug = String(slug).toLowerCase().trim().replace(/[^a-z0-9-]/g, '-');
    const existing = await queryOne('SELECT id FROM events WHERE slug = $1', [cleanSlug]);
    if (existing) {
      return NextResponse.json({ error: `An event with slug '${cleanSlug}' already exists.` }, { status: 400 });
    }

    const result = await withTransaction(async (client) => {
      const tempPassword = `agafari${Math.floor(1000 + Math.random() * 9000)}`;
      const coupleUser = (
        await client.query(
          `INSERT INTO users (email, password_hash, full_name, role)
           VALUES ($1,$2,$3,'BRIDE_GROOM') RETURNING id, email`,
          [coupleEmail?.trim() || `couple@${cleanSlug}.com`, hashPassword(tempPassword), `${brideName.trim()} & ${groomName.trim()}`]
        )
      ).rows[0];

      const event = (
        await client.query(
          `INSERT INTO events (
             slug, title, managed_by, organizer_id, couple_user_id, template_id,
             bride_name, groom_name, event_date, venue_name, venue_address, dress_code,
             status, admin_approval_status
           ) VALUES ($1,$2,'ORGANIZER',$3,$4,$5,$6,$7,$8,$9,$10,$11,'COMING_SOON','PENDING')
           RETURNING *`,
          [
            cleanSlug, title.trim(), organizerId, coupleUser.id, templateId || null,
            brideName.trim(), groomName.trim(), new Date(eventDate).toISOString(),
            venueName.trim(), venueAddress?.trim() || null, dressCode?.trim() || null,
          ]
        )
      ).rows[0];

      return { event, coupleTempPassword: tempPassword, coupleEmail: coupleUser.email };
    });

    return NextResponse.json(
      {
        success: true,
        event: result.event,
        coupleCredentials: { email: result.coupleEmail, temporaryPassword: result.coupleTempPassword },
        note: 'Event created with admin_approval_status = PENDING — awaiting System Admin review.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create event.' }, { status: 500 });
  }
}
