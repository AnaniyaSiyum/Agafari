export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireRole, hashPassword } from '@/lib/auth';
import { query, queryOne, withTransaction } from '@/lib/db';
import { mockStore } from '@/lib/mockData';

function cleanAgencyName(name?: string, email?: string, rawId?: string): string {
  if (
    name &&
    !name.includes('Organizer Agency') &&
    !name.startsWith('org-') &&
    !name.includes('@') &&
    name.trim() !== 'Event Organizer' &&
    !/[0-9a-f]{8,}/i.test(name)
  ) {
    return name.trim();
  }
  if (email && email.includes('@') && !email.startsWith('organizer-')) {
    const uname = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
    const titleCase = uname.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    return `${titleCase} Event Production Agency`;
  }
  if (rawId && !/[0-9a-f]{8,}/i.test(rawId)) {
    const cleanId = rawId.replace(/^org-/, '').replace(/[^a-zA-Z0-9]/g, ' ').trim();
    const titleCase = cleanId.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    return `${titleCase} Event Agency`;
  }
  return 'Event Organizer Agency Suite';
}

async function resolveOrCreateOrganizerInDb(targetOrgId: string | null, userId?: string | null) {
  const rawInput = (targetOrgId || userId || 'org-default').trim();
  const cleanKey = rawInput.startsWith('org-') ? rawInput : `org-${rawInput}`;
  const rawUserId = rawInput.replace(/^org-/, '');
  const normalizedKey = rawInput.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

  try {
    // 1. Try finding existing organizer row in DB with flexible matching
    let orgRow = await queryOne<{ id: string; business_name: string; owner_user_id: string; full_name?: string; email?: string }>(
      `SELECT o.id, o.business_name, o.owner_user_id, u.full_name, u.email
       FROM organizers o
       LEFT JOIN users u ON u.id = o.owner_user_id
       WHERE o.id = $1 
          OR o.owner_user_id = $1 
          OR o.owner_user_id = $2
          OR CONCAT('org-', o.owner_user_id) = $1 
          OR CONCAT('org-', o.id) = $1
          OR u.id = $1
          OR u.id = $2
          OR lower(u.email) = lower($1)
          OR lower(u.email) = lower($2)
          OR lower(replace(u.id, '-', '')) = $3
          OR lower(replace(o.id, '-', '')) = $3
          OR lower(replace(o.owner_user_id, '-', '')) = $3`,
      [rawInput, rawUserId, normalizedKey]
    );

    if (!orgRow) {
      // 2. Try finding user to attach an organizer record
      let ownerUser = await queryOne<{ id: string; full_name: string; email: string }>(
        `SELECT id, full_name, email FROM users 
         WHERE id = $1 
            OR id = $2 
            OR lower(email) = lower($1) 
            OR lower(email) = lower($2)
            OR lower(replace(id, '-', '')) = $3
            LIMIT 1`,
        [rawInput, rawUserId, normalizedKey]
      );

      if (!ownerUser) {
        const fallbackUserId = `usr-${rawUserId}`;
        const autoAgencyName = cleanAgencyName(undefined, undefined, rawInput);
        await query(
          `INSERT INTO users (id, email, password_hash, full_name, role)
           VALUES ($1, $2, $3, $4, 'EVENT_ORGANIZER')
           ON DUPLICATE KEY UPDATE id=id`,
          [fallbackUserId, rawInput.includes('@') ? rawInput : `organizer-${rawUserId}@agafari.com`, hashPassword('org2026'), autoAgencyName]
        );
        ownerUser = await queryOne<{ id: string; full_name: string; email: string }>(
          `SELECT id, full_name, email FROM users WHERE id = $1`,
          [fallbackUserId]
        );
      }

      if (ownerUser) {
        const autoAgencyName = cleanAgencyName(ownerUser.full_name, ownerUser.email, ownerUser.id);
        const newOrgId = `org-${ownerUser.id}`;
        await query(
          `INSERT INTO organizers (id, owner_user_id, business_name)
           VALUES ($1, $2, $3)
           ON DUPLICATE KEY UPDATE id=id`,
          [newOrgId, ownerUser.id, autoAgencyName]
        );
        orgRow = await queryOne<{ id: string; business_name: string; owner_user_id: string; full_name?: string; email?: string }>(
          `SELECT id, business_name, owner_user_id FROM organizers WHERE id = $1 OR owner_user_id = $2`,
          [newOrgId, ownerUser.id]
        );
        if (orgRow) {
          orgRow.full_name = ownerUser.full_name;
          orgRow.email = ownerUser.email;
        }
      }
    }

    if (orgRow) {
      const finalAgencyName = cleanAgencyName(orgRow.business_name || orgRow.full_name, orgRow.email, orgRow.id);
      return {
        dbOrganizerId: orgRow.id,
        cleanKey,
        rawUserId,
        organizerInfo: {
          agencyName: finalAgencyName,
          fullName: orgRow.full_name || finalAgencyName,
          email: orgRow.email || '',
        }
      };
    }
  } catch (err) {
    console.error('Failed to resolve/create organizer in DB:', err);
  }

  // 3. Fallback in-memory matching against mockStore.users
  const matchedUser = mockStore.users.find(
    (u) =>
      u.id === rawInput ||
      u.id === rawUserId ||
      ('org-' + u.id) === rawInput ||
      u.id.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() === normalizedKey ||
      ('org' + u.id.replace(/[^a-zA-Z0-9]/g, '')).toLowerCase() === normalizedKey ||
      (u.email && u.email.toLowerCase() === rawInput.toLowerCase()) ||
      (u.email && rawInput.toLowerCase().includes(u.email.split('@')[0].toLowerCase()))
  );

  if (matchedUser) {
    const finalAgencyName = cleanAgencyName((matchedUser as any).companyName || matchedUser.fullName, matchedUser.email, matchedUser.id);
    return {
      dbOrganizerId: matchedUser.id,
      cleanKey,
      rawUserId,
      organizerInfo: {
        agencyName: finalAgencyName,
        fullName: matchedUser.fullName,
        email: matchedUser.email,
      }
    };
  }

  // If no user exists, derive a unique clean agency name using rawInput
  const autoAgencyName = cleanAgencyName(undefined, undefined, rawInput);
  return {
    dbOrganizerId: null,
    cleanKey,
    rawUserId,
    organizerInfo: {
      agencyName: autoAgencyName,
      fullName: autoAgencyName,
      email: rawInput.includes('@') ? rawInput : `organizer@${rawUserId.slice(0, 8)}.com`,
    }
  };
}

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

  const coupleEmail = e.couple_email || e.coupleCredentials?.email || `couple@${e.slug}.com`;
  const couplePassword = e.coupleCredentials?.temporaryPassword || e.credentials?.couple?.temporaryPassword || 'agafari2026';

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
    expectedGuests: Number(e.expected_guests || e.expectedGuests || 300),
    expected_guests: Number(e.expected_guests || e.expectedGuests || 300),
    stats: {
      totalInvites: Number(e.total_invites || e.stats?.totalInvites || 0),
      totalWishes: Number(e.total_wishes || e.stats?.totalWishes || 0),
      totalMedia: Number(e.total_media || e.stats?.totalMedia || 0),
    },
    coupleCredentials: adminApprovalStatus === 'APPROVED' ? {
      email: coupleEmail,
      temporaryPassword: couplePassword,
    } : null,
    credentials: adminApprovalStatus === 'APPROVED' ? (e.credentials || {
      couple: { fullName: `${brideName} & ${groomName}`, email: coupleEmail, temporaryPassword: couplePassword, role: 'BRIDE_GROOM' },
      organizer: { fullName: 'Event Organizer', email: `organizer@${e.slug}.com`, temporaryPassword: 'org2026', role: 'EVENT_ORGANIZER' },
      streamer: { fullName: 'Live Streamer Crew', email: `streamer@${e.slug}.com`, temporaryPassword: 'stream123', role: 'LIVE_STREAMER' },
      scanner: { fullName: 'Gate QR Scanner', email: `scanner@${e.slug}.com`, temporaryPassword: 'scan123', role: 'GATE_SCANNER' },
      moderator: { fullName: 'Media Content Moderator', email: `moderator@${e.slug}.com`, temporaryPassword: 'mod123', role: 'MEDIA_MODERATOR' },
    }) : null
  };
}

// GET: all events this organizer owns
export async function GET(req: NextRequest) {
  const targetOrgId = req.nextUrl.searchParams.get('id') || req.nextUrl.searchParams.get('organizerId');

  try {
    let auth = requireRole(req, ['EVENT_ORGANIZER', 'SYSTEM_ADMIN']);
    const userId = auth.ok ? auth.user.userId : null;

    // Strict Multi-Tenant Isolation: An organizer can NEVER fetch another organizer's events
    let effectiveTargetOrgId = targetOrgId;
    if (auth.ok && auth.user.role === 'EVENT_ORGANIZER') {
      const myOrgId = auth.user.tenantId || auth.user.userId;
      if (targetOrgId) {
        const cleanTarget = targetOrgId.replace(/^org-/, '');
        const cleanMy = myOrgId.replace(/^org-/, '');
        const cleanUser = auth.user.userId.replace(/^org-/, '').replace(/^usr-/, '');
        if (cleanTarget !== cleanMy && cleanTarget !== cleanUser) {
          return NextResponse.json(
            { error: 'Forbidden: You are not authorized to view another organizer’s events.' },
            { status: 403 }
          );
        }
      }
      effectiveTargetOrgId = myOrgId;
    }
    
    // Resolve organizer details using unified helper
    const orgData = await resolveOrCreateOrganizerInDb(effectiveTargetOrgId, userId);
    const { dbOrganizerId, cleanKey, rawUserId, organizerInfo } = orgData;

    // Build target keys for matching
    const targetKeys = new Set([cleanKey, rawUserId, effectiveTargetOrgId, dbOrganizerId].filter(Boolean) as string[]);

    // Try DB fetch
    let rawEvents: any[] = [];
    let dbSuccess = false;
    if (dbOrganizerId || cleanKey || rawUserId) {
      try {
        rawEvents = await query(
          `SELECT e.*,
                  cu.email AS couple_email,
                  cu.full_name AS couple_full_name,
                  (SELECT COUNT(*) FROM invitations i WHERE i.event_id = e.id) AS total_invites,
                  (SELECT COUNT(*) FROM wishes w WHERE w.event_id = e.id) AS total_wishes,
                  (SELECT COUNT(*) FROM media_assets m WHERE m.event_id = e.id) AS total_media,
                  (SELECT COUNT(*) FROM media_assets m WHERE m.event_id = e.id AND m.status = 'PENDING') AS pending_media
           FROM events e
           LEFT JOIN users cu ON cu.id = e.couple_user_id
           WHERE e.organizer_id = $1 
              OR e.organizer_id = $2 
              OR e.organizer_id = $3
              OR e.organizer_id = (SELECT id FROM organizers WHERE owner_user_id = $2 OR owner_user_id = $3 LIMIT 1)
           ORDER BY e.event_date ASC`,
          [dbOrganizerId || cleanKey, cleanKey, rawUserId]
        );
        dbSuccess = true;
      } catch (e) {
        rawEvents = [];
      }
    }

    let combinedFormatted: any[] = [];
    if (dbSuccess && rawEvents && rawEvents.length > 0) {
      combinedFormatted = (rawEvents || []).map((dbEvt: any) => formatEvent(dbEvt));
    } else {
      // Fallback if DB returns 0 rows or is unavailable
      const mockEventsForOrg = mockStore.events.filter((e: any) => {
        const eOrgId = e.organizerId || e.organizer_id;
        if (!eOrgId) return false;
        const strOrgId = String(eOrgId);
        const cleanStrOrgId = strOrgId.startsWith('org-') ? strOrgId : `org-${strOrgId}`;
        const rawStrOrgId = strOrgId.replace(/^org-/, '');
        return targetKeys.has(strOrgId) || targetKeys.has(cleanStrOrgId) || targetKeys.has(rawStrOrgId);
      });
      combinedFormatted = mockEventsForOrg.map(formatEvent);
    }

    const activeHostingCount = combinedFormatted.filter((e) => e.status !== 'COMPLETED' && e.status !== 'ARCHIVED' && (e.adminApprovalStatus === 'APPROVED' || e.admin_approval_status === 'APPROVED')).length;
    const hostedArchiveCount = combinedFormatted.filter((e) => e.status === 'COMPLETED' || e.status === 'ARCHIVED').length;

    const enrichedOrganizerInfo = {
      ...organizerInfo,
      activeHostingCount,
      hostedArchiveCount,
    };

    return NextResponse.json({
      events: combinedFormatted,
      organizerInfo: enrichedOrganizerInfo,
    });
  } catch (err) {
    return NextResponse.json({
      events: [],
      organizerInfo: { agencyName: 'Event Organizer Agency Suite', fullName: 'Organizer Admin', email: 'organizer@agafari.com', activeHostingCount: 0, hostedArchiveCount: 0 },
    });
  }
}

// POST: organizer creates a new wedding under their account
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { title, slug, brideName, groomName, eventDate, venueName, venueAddress, dressCode, coupleEmail, templateId, expectedGuests, organizerId: bodyOrgId } = body;
    const targetOrgParam = req.nextUrl.searchParams.get('id') || req.nextUrl.searchParams.get('organizerId');
    let targetOrgId = bodyOrgId || targetOrgParam || null;
    const finalExpectedGuests = Math.max(1, Number(expectedGuests || 300));

    if (!brideName || !groomName || !eventDate || !venueName) {
      return NextResponse.json({ error: 'Missing required fields (brideName, groomName, eventDate, venueName).' }, { status: 400 });
    }

    if (!title) {
      title = `${brideName.trim()} & ${groomName.trim()}'s Wedding`;
    }

    let cleanSlug = slug
      ? String(slug).toLowerCase().trim().replace(/[^a-z0-9-]/g, '-')
      : `${brideName.toLowerCase().replace(/[^a-z0-9]/g, '')}-and-${groomName.toLowerCase().replace(/[^a-z0-9]/g, '')}-${new Date(eventDate).getFullYear()}`;

    const targetCoupleEmail = coupleEmail?.trim() || `couple@${cleanSlug}.com`;
    const tempPassword = `agafari${Math.floor(1000 + Math.random() * 9000)}`;

    let auth = requireRole(req, ['EVENT_ORGANIZER', 'SYSTEM_ADMIN']);
    const userId = auth.ok ? auth.user.userId : null;
    const orgData = await resolveOrCreateOrganizerInDb(targetOrgId, userId);
    const { dbOrganizerId, cleanKey, rawUserId } = orgData;

    // Use valid DB organizer ID if available, else cleanKey
    const assignedOrgId = dbOrganizerId || cleanKey;

    try {
      const result = await withTransaction(async (client) => {
        // Ensure slug is unique in DB
        const existingSlug = (await client.query('SELECT id FROM events WHERE slug = $1', [cleanSlug])).rows[0];
        if (existingSlug) {
          cleanSlug = `${cleanSlug}-${Math.floor(100 + Math.random() * 900)}`;
        }

        // Ensure organizer record exists if assignedOrgId is provided
        if (assignedOrgId) {
          try {
            await client.query(
              `INSERT INTO organizers (id, business_name, company_name) VALUES ($1, 'Certified Agency', 'Certified Agency') ON DUPLICATE KEY UPDATE id=id`,
              [assignedOrgId]
            );
          } catch (e) {}
        }

        // Reuse user if email already exists in DB
        let coupleUser = (await client.query('SELECT id, email FROM users WHERE email = $1', [targetCoupleEmail])).rows[0];
        if (!coupleUser) {
          const coupleUserId = `usr-couple-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
          await client.query(
            `INSERT INTO users (id, email, password_hash, full_name, role)
             VALUES ($1,$2,$3,$4,'BRIDE_GROOM')`,
            [coupleUserId, targetCoupleEmail, hashPassword(tempPassword), `${brideName.trim()} & ${groomName.trim()}`]
          );
          coupleUser = (await client.query('SELECT id, email FROM users WHERE id = $1', [coupleUserId])).rows[0];
        }

        const newEventId = `evt-${cleanSlug}`;
        let formattedDate: string;
        try {
          formattedDate = new Date(eventDate).toISOString().slice(0, 19).replace('T', ' ');
        } catch (e) {
          formattedDate = eventDate;
        }

        // Ensure column expected_guests exists
        try {
          await client.query('ALTER TABLE events ADD COLUMN IF NOT EXISTS expected_guests INT DEFAULT 300 NOT NULL');
        } catch (e) {}

        try {
          await client.query(
            `INSERT INTO events (
               id, slug, title, managed_by, organizer_id, couple_user_id, template_id,
               bride_name, groom_name, event_date, venue_name, venue_address, dress_code,
               expected_guests, status, admin_approval_status
             ) VALUES ($1,$2,$3,'ORGANIZER',$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,'COMING_SOON','PENDING')`,
            [
              newEventId, cleanSlug, title.trim(), assignedOrgId, coupleUser.id, templateId || null,
              brideName.trim(), groomName.trim(), formattedDate,
              venueName.trim(), venueAddress?.trim() || null, dressCode?.trim() || null,
              finalExpectedGuests,
            ]
          );
        } catch (e) {
          // Fallback query if expected_guests column not altered
          await client.query(
            `INSERT INTO events (
               id, slug, title, managed_by, organizer_id, couple_user_id, template_id,
               bride_name, groom_name, event_date, venue_name, venue_address, dress_code,
               status, admin_approval_status
             ) VALUES ($1,$2,$3,'ORGANIZER',$4,$5,$6,$7,$8,$9,$10,$11,$12,'COMING_SOON','PENDING')`,
            [
              newEventId, cleanSlug, title.trim(), assignedOrgId, coupleUser.id, templateId || null,
              brideName.trim(), groomName.trim(), formattedDate,
              venueName.trim(), venueAddress?.trim() || null, dressCode?.trim() || null,
            ]
          );
        }

        const event = (await client.query('SELECT * FROM events WHERE id = $1', [newEventId])).rows[0];

        return { event, coupleTempPassword: tempPassword, coupleEmail: coupleUser.email, organizerId: assignedOrgId };
      });

      const formattedEvent = formatEvent({
        ...result.event,
        couple_email: result.coupleEmail,
      });
      formattedEvent.organizerId = cleanKey;
      (formattedEvent as any).organizer_id = cleanKey;

      // Keep mockStore in sync with organizer ID attached
      const existingIdx = mockStore.events.findIndex((e) => e.id === formattedEvent.id || e.slug === formattedEvent.slug);
      if (existingIdx >= 0) {
        mockStore.events[existingIdx] = formattedEvent;
      } else {
        mockStore.events.unshift(formattedEvent);
      }

      return NextResponse.json(
        {
          success: true,
          event: formattedEvent,
          coupleCredentials: null,
          note: 'Event created with admin_approval_status = PENDING — awaiting System Admin review.',
        },
        { status: 201 }
      );
    } catch (dbErr) {
      console.error('DB Insert Event Failed, falling back to mockStore:', dbErr);
      // Fallback in-memory insertion for mock environment
      let safeIsoDate: string;
      try {
        safeIsoDate = new Date(eventDate).toISOString();
      } catch (e) {
        safeIsoDate = new Date().toISOString();
      }

      const newEventData: any = {
        id: `evt-${cleanSlug}`,
        slug: cleanSlug,
        title: title.trim(),
        brideName: brideName.trim(),
        groomName: groomName.trim(),
        eventDate: safeIsoDate,
        venueName: venueName.trim(),
        venueAddress: venueAddress?.trim() || 'Addis Ababa, Ethiopia',
        status: 'COMING_SOON',
        adminApprovalStatus: 'PENDING',
        organizerId: cleanKey,
        organizer_id: cleanKey,
        couple_email: targetCoupleEmail,
      };

      const existingIdx = mockStore.events.findIndex((e) => e.id === newEventData.id || e.slug === newEventData.slug);
      if (existingIdx >= 0) {
        mockStore.events[existingIdx] = newEventData;
      } else {
        mockStore.events.unshift(newEventData);
      }

      const formatted = formatEvent(newEventData);

      return NextResponse.json(
        {
          success: true,
          event: formatted,
          coupleCredentials: null,
          note: 'Event created with admin_approval_status = PENDING — awaiting System Admin review.'
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error('Failed to create event:', error);
    return NextResponse.json({ error: 'Failed to create event.' }, { status: 500 });
  }
}

