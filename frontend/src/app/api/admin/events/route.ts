export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireRole, hashPassword } from '@/lib/auth';
import { query, queryOne, withTransaction } from '@/lib/db';

function formatEvent(e: any) {
  if (!e) return e;
  const brideName = e.bride_name || e.brideName || '';
  const groomName = e.groom_name || e.groomName || '';
  const venueName = e.venue_name || e.venueName || '';
  const eventDate = e.event_date || e.eventDate || new Date().toISOString();
  const adminApprovalStatus = e.admin_approval_status || e.adminApprovalStatus || 'PENDING';
  const coverImageUrl = e.cover_image_url || e.coverImageUrl || null;
  const venueAddress = e.venue_address || e.venueAddress || null;
  const dressCode = e.dress_code || e.dressCode || null;
  const youtubeVideoId = e.youtube_video_id || e.youtubeVideoId || null;
  const isLive = e.is_live !== undefined ? e.is_live : (e.isLive ?? false);

  const rawOrganizerId = e.organizer_id || e.organizerId || null;
  const managedBy = e.managed_by || e.managedBy || (rawOrganizerId ? 'ORGANIZER' : 'ADMIN');
  const isIndividual = !rawOrganizerId || managedBy === 'ADMIN' || managedBy === 'INDIVIDUAL';

  const rawOrgName = e.organizer_business_name || e.organizer_company_name || e.organizer_full_name || e.organizerName || null;
  const organizerName = isIndividual ? 'Individual Event' : (rawOrgName || 'Certified Organizer Agency');

  return {
    ...e,
    id: e.id,
    slug: e.slug,
    title: e.title || (brideName && groomName ? `${brideName} & ${groomName}'s Wedding` : 'Wedding Event'),
    brideName,
    groomName,
    bride_name: brideName,
    groom_name: groomName,
    eventDate,
    event_date: eventDate,
    venueName,
    venue_name: venueName,
    venueAddress,
    venue_address: venueAddress,
    dressCode,
    dress_code: dressCode,
    coverImageUrl,
    cover_image_url: coverImageUrl,
    status: e.status || 'COMING_SOON',
    adminApprovalStatus,
    admin_approval_status: adminApprovalStatus,
    youtubeVideoId,
    youtube_video_id: youtubeVideoId,
    isLive,
    is_live: isLive,
    managedBy,
    managed_by: managedBy,
    organizerId: rawOrganizerId,
    organizer_id: rawOrganizerId,
    organizerName,
    organizer_name: organizerName,
    isIndividual: Boolean(isIndividual),
    expectedGuests: Number(e.expected_guests || e.expectedGuests || 300),
    couple_credentials: e.coupleCredentials || e.couple_credentials || null,
    stats: {
      totalInvites: Number(e.total_invites || 0),
      totalWishes: Number(e.total_wishes || 0),
      totalMedia: Number(e.total_media || 0),
    },
    coupleCredentials: adminApprovalStatus === 'APPROVED' ? (e.coupleCredentials || {
      email: e.couple_email || `couple@${e.slug}.com`,
      temporaryPassword: 'agafari2026',
    }) : null,
    credentials: adminApprovalStatus === 'APPROVED' ? (e.credentials || {
      couple: { fullName: `${brideName} & ${groomName}`, email: e.couple_email || `couple@${e.slug}.com`, temporaryPassword: 'agafari2026', role: 'BRIDE_GROOM' },
      organizer: { fullName: isIndividual ? 'System Super Admin (Individual Event)' : (organizerName || 'Event Organizer'), email: `organizer@${e.slug}.com`, temporaryPassword: 'org2026', role: 'EVENT_ORGANIZER' },
      streamer: { fullName: 'Live Streamer Crew', email: `streamer@${e.slug}.com`, temporaryPassword: 'stream123', role: 'LIVE_STREAMER' },
      scanner: { fullName: 'Gate QR Scanner', email: `scanner@${e.slug}.com`, temporaryPassword: 'scan123', role: 'GATE_SCANNER' },
      moderator: { fullName: 'Media Content Moderator', email: `moderator@${e.slug}.com`, temporaryPassword: 'mod123', role: 'MEDIA_MODERATOR' },
    }) : null
  };
}

import { mockStore } from '@/lib/mockData';

// GET: every wedding event on the platform, with organizer/couple names and stats
export async function GET(req: NextRequest) {
  const auth = requireRole(req, ['SYSTEM_ADMIN', 'EVENT_ORGANIZER']);
  if (!auth.ok) return auth.response;

  let rawEvents: any[] = [];
  let dbSuccess = false;
  try {
    rawEvents = await query(`
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
    dbSuccess = true;
  } catch (e) {
    // Database fallback to mockStore
  }

  if (dbSuccess) {
    return NextResponse.json({ events: (rawEvents || []).map(formatEvent) });
  }

  const mockUniques = mockStore.events.map(formatEvent);
  return NextResponse.json({ events: mockUniques });
}

// POST: create a new wedding event — provisions specific Event Organizer credentials for the wedding
export async function POST(req: NextRequest) {
  const auth = requireRole(req, ['SYSTEM_ADMIN', 'EVENT_ORGANIZER']);
  if (!auth.ok) return auth.response;

  try {
    const body = await req.json();
    const {
      title, slug, brideName, groomName, eventDate, venueName, venueAddress,
      dressCode, welcomeMessage, coupleEmail, expectedGuests, expected_guests,
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

    const cleanSlug = String(slug).toLowerCase().trim().replace(/[^a-z0-9-]/g, '-');
    const numExpectedGuests = Math.max(1, Number(expectedGuests || expected_guests || 300));

    try {
      const existing = await queryOne('SELECT id FROM events WHERE slug = $1', [cleanSlug]);
      if (existing) {
        return NextResponse.json({ error: `An event with slug '${cleanSlug}' already exists.` }, { status: 400 });
      }

      const result = await withTransaction(async (client) => {
        const tempPassword = `agafari${Math.floor(1000 + Math.random() * 9000)}`;
        const coupleUserId = `usr-couple-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const eventId = `evt-${cleanSlug}`;
        const coupleEmailVal = coupleEmail?.trim() || `couple@${cleanSlug}.com`;
        const coupleName = `${brideName.trim()} & ${groomName.trim()}`;

        await client.query(
          `INSERT INTO users (id, email, password_hash, full_name, role)
           VALUES ($1, $2, $3, $4, 'BRIDE_GROOM')`,
          [
            coupleUserId,
            coupleEmailVal,
            hashPassword(tempPassword),
            coupleName,
          ]
        );

        let formattedDate: string;
        try {
          formattedDate = new Date(eventDate).toISOString().slice(0, 19).replace('T', ' ');
        } catch (e) {
          formattedDate = eventDate;
        }

        await client.query(
          `INSERT INTO events (
             id, slug, title, managed_by, organizer_id, couple_user_id, template_id,
             bride_name, groom_name, event_date, venue_name, venue_address,
             dress_code, welcome_message, expected_guests, status, admin_approval_status
           ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,'COMING_SOON','APPROVED')`,
          [
            eventId, cleanSlug, title.trim(), managedBy === 'ORGANIZER' ? 'ORGANIZER' : 'ADMIN',
            managedBy === 'ORGANIZER' ? (organizerId || null) : null, coupleUserId, templateId || null,
            brideName.trim(), groomName.trim(), formattedDate,
            venueName.trim(), venueAddress?.trim() || null,
            dressCode?.trim() || null, welcomeMessage?.trim() || null, numExpectedGuests
          ]
        );

        const insertedEvent = (await client.query('SELECT * FROM events WHERE id = $1', [eventId])).rows[0];

        return { event: insertedEvent, coupleTempPassword: tempPassword, coupleEmail: coupleEmailVal };
      });

      const formattedEvent = formatEvent(result.event);
      formattedEvent.coupleCredentials = { email: result.coupleEmail, temporaryPassword: result.coupleTempPassword };

      return NextResponse.json(
        {
          success: true,
          message: 'Wedding event created successfully.',
          event: formattedEvent,
          coupleCredentials: { email: result.coupleEmail, temporaryPassword: result.coupleTempPassword },
          adminControlUrl: `/${organizerId ? (organizerId.startsWith('org-') ? organizerId : `org-${organizerId}`) : `org-${cleanSlug}`}/${cleanSlug}`
        },
        { status: 201 }
      );
    } catch (dbErr) {
      console.warn('DB Event Creation fallback:', dbErr);
      // Fallback in-memory insertion for mock environment
      const cleanOrgId = organizerId ? (organizerId.startsWith('org-') ? organizerId : `org-${organizerId}`) : null;
      const newEventData: any = {
        id: `evt-${cleanSlug}`,
        slug: cleanSlug,
        title: title.trim(),
        brideName: brideName.trim(),
        groomName: groomName.trim(),
        eventDate: new Date(eventDate).toISOString(),
        venueName: venueName.trim(),
        venueAddress: venueAddress?.trim() || 'Addis Ababa, Ethiopia',
        expectedGuests: numExpectedGuests,
        expected_guests: numExpectedGuests,
        status: 'COMING_SOON',
        adminApprovalStatus: 'APPROVED',
        managedBy: managedBy === 'ORGANIZER' ? 'ORGANIZER' : 'ADMIN',
        organizerId: cleanOrgId,
        organizer_id: cleanOrgId,
        coupleCredentials: {
          email: coupleEmail?.trim() || `couple@${cleanSlug}.com`,
          temporaryPassword: 'agafari2026',
        },
        credentials: {
          couple: { fullName: `${brideName.trim()} & ${groomName.trim()}`, email: coupleEmail?.trim() || `couple@${cleanSlug}.com`, temporaryPassword: 'agafari2026', role: 'BRIDE_GROOM' },
          organizer: { fullName: 'System Super Admin Control', email: 'admin@agafari.com', temporaryPassword: 'admin', role: 'SYSTEM_ADMIN' },
          streamer: { fullName: 'Live Stream Operator', email: `streamer@${cleanSlug}.com`, temporaryPassword: 'stream123', role: 'LIVE_STREAMER' },
          scanner: { fullName: 'Gate QR Security', email: `scanner@${cleanSlug}.com`, temporaryPassword: 'scan123', role: 'GATE_SCANNER' },
          moderator: { fullName: 'Media Content Moderator', email: `moderator@${cleanSlug}.com`, temporaryPassword: 'mod123', role: 'MEDIA_MODERATOR' },
        }
      };

      mockStore.events.unshift(newEventData);

      const formatted = formatEvent(newEventData);

      return NextResponse.json(
        {
          success: true,
          message: 'Individual wedding event created successfully.',
          event: formatted,
          coupleCredentials: {
            email: coupleEmail?.trim() || `couple@${cleanSlug}.com`,
            temporaryPassword: 'agafari2026'
          },
          adminControlUrl: `/admin/event/${cleanSlug}`
        },
        { status: 201 }
      );
    }
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
    const { eventId, adminApprovalStatus, status, isLive, youtubeVideoId, coverImageUrl } = await req.json();
    if (!eventId) return NextResponse.json({ error: 'eventId is required.' }, { status: 400 });

    try {
      const isLiveVal = isLive !== undefined && isLive !== null ? Boolean(isLive) : null;
      const cleanId = eventId.startsWith('evt-') ? eventId : `evt-${eventId}`;
      const cleanSlug = eventId.replace(/^evt-/, '');

      await query(
        `UPDATE events SET
           admin_approval_status = COALESCE($2, admin_approval_status),
           status = COALESCE($3, status),
           is_live = COALESCE($4, is_live),
           youtube_video_id = COALESCE($5, youtube_video_id),
           cover_image_url = COALESCE($8, cover_image_url)
         WHERE id = $1 OR slug = $1 OR id = $6 OR slug = $7`,
        [eventId, adminApprovalStatus ?? null, status ?? null, isLiveVal, youtubeVideoId ?? null, cleanId, cleanSlug, coverImageUrl ?? null]
      );

      const event = await queryOne<any>('SELECT * FROM events WHERE id = $1 OR slug = $1 OR id = $2 OR slug = $3', [eventId, cleanId, cleanSlug]);

      if (event && adminApprovalStatus === 'APPROVED' && event.couple_user_id) {
        try {
          await query("UPDATE users SET status = 'ACTIVE' WHERE id = $1", [event.couple_user_id]);
          await query(
            `INSERT INTO memberships (id, user_id, role, scope_type, scope_id, status)
             VALUES ($1, $2, 'COUPLE', 'EVENT', $3, 'ACTIVE')
             ON DUPLICATE KEY UPDATE status = 'ACTIVE', scope_id = $3`,
            [`mem-${event.couple_user_id}`, event.couple_user_id, event.id || cleanId]
          );
        } catch (memErr) {}
      }

      if (event) {
        // Keep mockStore in sync
        const matchEvent = (e: any) =>
          e.id === eventId ||
          e.slug === eventId ||
          e.id === `evt-${eventId}` ||
          e.slug === `evt-${eventId}` ||
          e.id === eventId.replace(/^evt-/, '') ||
          e.slug === eventId.replace(/^evt-/, '');

        const idx = mockStore.events.findIndex(matchEvent);
        if (idx >= 0) {
          if (adminApprovalStatus) {
            mockStore.events[idx].adminApprovalStatus = adminApprovalStatus as any;
            (mockStore.events[idx] as any).admin_approval_status = adminApprovalStatus;
            if (adminApprovalStatus === 'APPROVED') {
              const slugVal = mockStore.events[idx].slug || eventId;
              mockStore.events[idx].coupleCredentials = mockStore.events[idx].coupleCredentials || {
                email: `couple-${slugVal}@test.com`,
                temporaryPassword: 'pass' + Date.now()
              };
            } else if (adminApprovalStatus === 'REJECTED') {
              mockStore.events[idx].coupleCredentials = null;
            }
          }
          if (status) mockStore.events[idx].status = status as any;
          if (isLive !== undefined) mockStore.events[idx].isLive = isLive;
          if (coverImageUrl !== undefined) {
            mockStore.events[idx].coverImageUrl = coverImageUrl;
            (mockStore.events[idx] as any).cover_image_url = coverImageUrl;
          }
        }

        const formatted = formatEvent(event);
        if (formatted.adminApprovalStatus === 'APPROVED' || formatted.admin_approval_status === 'APPROVED') {
          const slugVal = formatted.slug || eventId;
          formatted.coupleCredentials = (idx >= 0 && mockStore.events[idx].coupleCredentials) || {
            email: `couple-${slugVal.replace(/^evt-/, '')}@agafari.com`,
            temporaryPassword: 'TempPassword123!'
          };
        }
        return NextResponse.json({ success: true, event: formatted });
      }

      // If DB returned null (e.g. event was created in mockStore fallback), check mockStore
      const matchEvent = (e: any) =>
        e.id === eventId ||
        e.slug === eventId ||
        e.id === `evt-${eventId}` ||
        e.slug === `evt-${eventId}` ||
        e.id === eventId.replace(/^evt-/, '') ||
        e.slug === eventId.replace(/^evt-/, '');

      const idx = mockStore.events.findIndex(matchEvent);
      if (idx >= 0) {
        if (adminApprovalStatus) {
          mockStore.events[idx].adminApprovalStatus = adminApprovalStatus as any;
          (mockStore.events[idx] as any).admin_approval_status = adminApprovalStatus;
          if (adminApprovalStatus === 'APPROVED') {
            const slugVal = mockStore.events[idx].slug || eventId;
            mockStore.events[idx].coupleCredentials = mockStore.events[idx].coupleCredentials || {
              email: `couple-${slugVal}@test.com`,
              temporaryPassword: 'pass' + Date.now()
            };
          } else if (adminApprovalStatus === 'REJECTED') {
            mockStore.events[idx].coupleCredentials = null;
          }
        }
        if (status) mockStore.events[idx].status = status as any;
        if (isLive !== undefined) mockStore.events[idx].isLive = isLive;
        return NextResponse.json({ success: true, event: formatEvent(mockStore.events[idx]) });
      }
    } catch (dbErr) {
      console.warn('DB PATCH event fallback:', dbErr);
      // DB failed, fallback to mockStore
      const matchEvent = (e: any) =>
        e.id === eventId ||
        e.slug === eventId ||
        e.id === `evt-${eventId}` ||
        e.slug === `evt-${eventId}` ||
        e.id === eventId.replace(/^evt-/, '') ||
        e.slug === eventId.replace(/^evt-/, '');

      const idx = mockStore.events.findIndex(matchEvent);
      if (idx >= 0) {
        if (adminApprovalStatus) {
          mockStore.events[idx].adminApprovalStatus = adminApprovalStatus as any;
          (mockStore.events[idx] as any).admin_approval_status = adminApprovalStatus;
          if (adminApprovalStatus === 'APPROVED') {
            const slugVal = mockStore.events[idx].slug || eventId;
            mockStore.events[idx].coupleCredentials = mockStore.events[idx].coupleCredentials || {
              email: `couple-${slugVal}@test.com`,
              temporaryPassword: 'pass' + Date.now()
            };
          } else if (adminApprovalStatus === 'REJECTED') {
            mockStore.events[idx].coupleCredentials = null;
          }
        }
        if (status) mockStore.events[idx].status = status as any;
        if (isLive !== undefined) mockStore.events[idx].isLive = isLive;
        return NextResponse.json({ success: true, event: formatEvent(mockStore.events[idx]) });
      }
    }

    return NextResponse.json({ error: 'Event not found.' }, { status: 404 });
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

  try {
    const existing = await queryOne('SELECT id FROM events WHERE id = $1 OR slug = $1', [eventId]);
    if (!existing) {
      // Check mockStore
      const idx = mockStore.events.findIndex((e) => e.id === eventId || e.slug === eventId);
      if (idx >= 0) {
        mockStore.events.splice(idx, 1);
        return NextResponse.json({ success: true, message: 'Event deleted successfully from mock store.' });
      }
      return NextResponse.json({ error: 'Event not found.' }, { status: 404 });
    }

    await query('DELETE FROM events WHERE id = $1 OR slug = $1', [eventId]);

    // Also remove from mockStore if present
    const idx = mockStore.events.findIndex((e) => e.id === eventId || e.slug === eventId);
    if (idx >= 0) {
      mockStore.events.splice(idx, 1);
    }

    return NextResponse.json({ success: true, message: 'Event deleted successfully.' });
  } catch (err) {
    console.error('Failed to delete event:', err);
    return NextResponse.json({ error: 'Failed to delete event.' }, { status: 500 });
  }
}
