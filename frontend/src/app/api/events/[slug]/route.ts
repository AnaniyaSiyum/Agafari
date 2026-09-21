export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { queryOne, query } from '@/lib/db';
import { mockStore } from '@/lib/mockData';

// Helper to sanitize & parse template customization JSON
function parseCustomization(customization: any) {
  let parsed = customization;
  if (typeof customization === 'string') {
    try {
      parsed = JSON.parse(customization);
    } catch (e) {
      parsed = {};
    }
  }
  return parsed || {};
}

function formatEvent(e: any) {
  if (!e) return e;
  const customization = parseCustomization(e.template_customization_json);

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

  const backgroundAudioUrl = e.backgroundAudioUrl || e.background_audio_url || customization.backgroundAudioUrl || '';
  const couplePhotoUrl = e.couplePhotoUrl || e.couple_photo_url || customization.couplePhotoUrl || coverImageUrl || '';

  const rawOrganizerId = e.organizer_id || e.organizerId || null;
  const managedBy = e.managed_by || e.managedBy || (rawOrganizerId ? 'ORGANIZER' : 'ADMIN');
  const isIndividual = !rawOrganizerId || managedBy === 'ADMIN' || managedBy === 'INDIVIDUAL';

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
    startTime: e.start_time || e.startTime || '14:00',
    start_time: e.start_time || e.startTime || '14:00',
    venueName,
    venue_name: venueName,
    venueAddress,
    venue_address: venueAddress,
    dressCode,
    dress_code: dressCode,
    coverImageUrl,
    cover_image_url: coverImageUrl,
    backgroundAudioUrl,
    background_audio_url: backgroundAudioUrl,
    couplePhotoUrl,
    couple_photo_url: couplePhotoUrl,
    loveStory: e.loveStory || customization.loveStory || null,
    programs: e.programs || customization.programs || [],
    additionalLocations: e.additionalLocations || customization.additionalLocations || [],
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
    isIndividual: Boolean(isIndividual),
    customization
  };
}

// GET: fetch dynamic event details for specific wedding slug
export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params;

  try {
    const event = await queryOne(
      `SELECT id, slug, title, bride_name, groom_name, event_date, start_time, second_event_date,
              venue_name, venue_address, venue_map_url, dress_code, welcome_message, cover_image_url,
              status, admin_approval_status, is_live, youtube_video_id, thank_you_message, thank_you_image_url,
              template_id, template_customization_json, organizer_id, managed_by
       FROM events WHERE LOWER(slug) = LOWER($1) OR id = $1 OR id = $2`,
      [slug, `evt-${slug}`]
    );

    if (event) {
      const customization = parseCustomization(event.template_customization_json);

      const formattedEvent = {
        id: event.id,
        slug: event.slug,
        title: event.title || `${event.bride_name} & ${event.groom_name}'s Wedding`,
        brideName: event.bride_name,
        groomName: event.groom_name,
        eventDate: event.event_date ? new Date(event.event_date).toISOString() : new Date().toISOString(),
        startTime: event.start_time || '14:00',
        venueName: event.venue_name || 'Wedding Venue',
        venueAddress: event.venue_address || '',
        venueMapUrl: event.venue_map_url || '',
        dressCode: event.dress_code || 'Formal Black Tie & Habesha Kemis',
        welcomeMessage: event.welcome_message || 'We are overjoyed to welcome you to our special day!',
        coverImageUrl: event.cover_image_url || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200',
        backgroundAudioUrl: customization.backgroundAudioUrl || '',
        couplePhotoUrl: customization.couplePhotoUrl || event.cover_image_url || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800',
        status: event.status || 'COMING_SOON',
        adminApprovalStatus: (event as any).admin_approval_status || 'PENDING',
        admin_approval_status: (event as any).admin_approval_status || 'PENDING',
        isLive: Boolean(event.is_live),
        youtubeVideoId: event.youtube_video_id || '',
        organizerId: event.organizer_id,
        organizer_id: event.organizer_id,
        managedBy: event.managed_by || (event.organizer_id ? 'ORGANIZER' : 'ADMIN'),
        managed_by: event.managed_by || (event.organizer_id ? 'ORGANIZER' : 'ADMIN'),
        isIndividual: !event.organizer_id || event.managed_by === 'ADMIN' || event.managed_by === 'INDIVIDUAL',
        loveStory: customization.loveStory || {
          headline: 'Our Journey to Forever',
          firstMetDate: '2024-05-12',
          firstMetStory: `${event.bride_name} and ${event.groom_name} first crossed paths on a sunny afternoon. What began as a simple coffee conversation turned into hours of deep dialogue about faith, family traditions, and their shared vision for the future.`,
          proposalDate: '2025-12-25',
          proposalStory: `During a weekend getaway, ${event.groom_name} surprised ${event.bride_name} with a romantic proposal. With music playing, he got down on one knee and proposed. ${event.bride_name} joyfully answered YES!`
        },
        programs: customization.programs || [
          {
            id: 'p1',
            time: '10:00 AM',
            title: 'Holy Matrimony & Blessing',
            location: event.venue_name ? `${event.venue_name} Chapel` : 'Holy Trinity Cathedral',
            description: 'Sacred church wedding ceremony, prayer of blessing, and exchange of rings.'
          },
          {
            id: 'p2',
            time: '04:00 PM',
            title: 'Grand Wedding Reception',
            location: event.venue_name || 'Sheraton Luxury Ballroom',
            description: 'Grand entrance of the couple, champagne toast, multi-course dinner banquet, and couple dance.'
          },
          {
            id: 'p3',
            time: '08:00 PM',
            title: 'Melse & Cultural Tradition',
            location: event.venue_name ? `${event.venue_name} Cultural Hall` : 'Traditional Cultural Hall',
            description: 'Ethio-Eritrean traditional attire celebration, kebero music performance, and cutting of the Himbasha.'
          }
        ],
        additionalLocations: customization.additionalLocations || [],
        customization
      };

      let locations: any[] = [];
      try {
        locations = await query(
          'SELECT label, address, map_url, order_index FROM event_locations WHERE event_id = $1 ORDER BY order_index ASC',
          [event.id]
        );
      } catch (e) {
        locations = customization.additionalLocations || [];
      }

      return NextResponse.json({ event: formattedEvent, locations });
    }
  } catch (err) {
    console.error('DB query error in GET /api/events/[slug]:', err);
  }

  // Fallback to mockStore
  const mockEvt = mockStore.events.find(
    (e) =>
      e.slug?.toLowerCase() === slug.toLowerCase() ||
      e.id === slug ||
      e.id === `evt-${slug}` ||
      e.slug === slug.replace(/^evt-/, '')
  );
  if (mockEvt) {
    return NextResponse.json({ event: mockEvt, locations: [] });
  }

  return NextResponse.json({ error: 'Event not found.' }, { status: 404 });
}

// PUT / PATCH: update event details from Organizer Control Page
export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  return handleUpdate(req, params.slug);
}

export async function PATCH(req: NextRequest, { params }: { params: { slug: string } }) {
  return handleUpdate(req, params.slug);
}

async function handleUpdate(req: NextRequest, slug: string) {
  try {
    const body = await req.json();
    const {
      brideName,
      groomName,
      title,
      venueName,
      venueAddress,
      venueMapUrl,
      eventDate,
      startTime,
      dressCode,
      welcomeMessage,
      coverImageUrl,
      backgroundAudioUrl,
      couplePhotoUrl,
      isLive,
      youtubeVideoId,
      status,
      loveStory,
      programs,
      additionalLocations
    } = body;

    const cleanSlug = slug.toLowerCase();
    const cleanId = cleanSlug.startsWith('evt-') ? cleanSlug : `evt-${cleanSlug}`;
    const rawSlug = cleanSlug.replace(/^evt-/, '');

    try {
      const existing = await queryOne<{ id: string; template_customization_json: any }>(
        'SELECT id, template_customization_json FROM events WHERE LOWER(slug) = LOWER($1) OR id = $2 OR LOWER(slug) = LOWER($3) OR id = $4',
        [cleanSlug, cleanId, rawSlug, slug]
      );

      if (existing) {
        const currentCustomization = parseCustomization(existing.template_customization_json);
        const updatedCustomization = {
          ...currentCustomization,
          backgroundAudioUrl: backgroundAudioUrl !== undefined ? backgroundAudioUrl : currentCustomization.backgroundAudioUrl,
          couplePhotoUrl: couplePhotoUrl !== undefined ? couplePhotoUrl : currentCustomization.couplePhotoUrl,
          loveStory: loveStory !== undefined ? loveStory : currentCustomization.loveStory,
          programs: programs !== undefined ? programs : currentCustomization.programs,
          additionalLocations: additionalLocations !== undefined ? additionalLocations : currentCustomization.additionalLocations
        };

        let formattedEventDate: string | null = null;
        if (eventDate) {
          try {
            const d = new Date(eventDate);
            if (!isNaN(d.getTime())) {
              formattedEventDate = d.toISOString().slice(0, 19).replace('T', ' ');
            }
          } catch (e) {}
        }

        await query(
          `UPDATE events SET
             bride_name = COALESCE($1, bride_name),
             groom_name = COALESCE($2, groom_name),
             title = COALESCE($3, title),
             venue_name = COALESCE($4, venue_name),
             venue_address = COALESCE($5, venue_address),
             venue_map_url = COALESCE($6, venue_map_url),
             event_date = COALESCE($7, event_date),
             start_time = COALESCE($8, start_time),
             dress_code = COALESCE($9, dress_code),
             welcome_message = COALESCE($10, welcome_message),
             cover_image_url = COALESCE($11, cover_image_url),
             is_live = COALESCE($12, is_live),
             youtube_video_id = COALESCE($13, youtube_video_id),
             status = COALESCE($14, status),
             template_customization_json = $15
           WHERE id = $16`,
          [
            brideName ?? null,
            groomName ?? null,
            title ?? null,
            venueName ?? null,
            venueAddress ?? null,
            venueMapUrl ?? null,
            formattedEventDate,
            startTime ?? null,
            dressCode ?? null,
            welcomeMessage ?? null,
            coverImageUrl ?? null,
            isLive !== undefined && isLive !== null ? (isLive ? 1 : 0) : null,
            youtubeVideoId ?? null,
            status ?? null,
            JSON.stringify(updatedCustomization),
            existing.id
          ]
        );

        const updated = await queryOne(
          'SELECT * FROM events WHERE id = $1',
          [existing.id]
        );

        return NextResponse.json({ success: true, event: formatEvent(updated) });
      }
    } catch (e) {
      console.error('Failed to update event in DB:', e);
    }

    // In-memory mockStore update fallback
    let mockEvt = mockStore.events.find(
      (e) =>
        e.slug?.toLowerCase() === cleanSlug ||
        e.slug?.toLowerCase() === rawSlug ||
        e.id?.toLowerCase() === cleanSlug ||
        e.id === cleanId
    );

    if (!mockEvt) {
      mockEvt = {
        id: cleanId,
        slug: rawSlug,
        title: title || `${brideName || 'Bride'} & ${groomName || 'Groom'}'s Wedding`,
        brideName: brideName || 'Bride',
        groomName: groomName || 'Groom',
        eventDate: eventDate || new Date().toISOString(),
        venueName: venueName || 'Primary Venue',
        venueAddress: venueAddress || 'Addis Ababa',
        status: 'COMING_SOON',
        adminApprovalStatus: 'APPROVED'
      };
      mockStore.events.unshift(mockEvt);
    }

    if (brideName !== undefined) mockEvt.brideName = brideName;
    if (groomName !== undefined) mockEvt.groomName = groomName;
    if (title !== undefined) mockEvt.title = title;
    if (venueName !== undefined) mockEvt.venueName = venueName;
    if (venueAddress !== undefined) mockEvt.venueAddress = venueAddress;
    if (venueMapUrl !== undefined) mockEvt.venueMapUrl = venueMapUrl;
    if (eventDate !== undefined) mockEvt.eventDate = eventDate;
    if (dressCode !== undefined) mockEvt.dressCode = dressCode;
    if (welcomeMessage !== undefined) mockEvt.welcomeMessage = welcomeMessage;
    if (coverImageUrl !== undefined) mockEvt.coverImageUrl = coverImageUrl;
    if (backgroundAudioUrl !== undefined) {
      mockEvt.backgroundAudioUrl = backgroundAudioUrl;
      (mockEvt as any).background_audio_url = backgroundAudioUrl;
    }
    if (couplePhotoUrl !== undefined) {
      mockEvt.couplePhotoUrl = couplePhotoUrl;
      (mockEvt as any).couple_photo_url = couplePhotoUrl;
    }
    if (loveStory !== undefined) mockEvt.loveStory = loveStory;
    if (programs !== undefined) mockEvt.programs = programs;
    if (additionalLocations !== undefined) mockEvt.additionalLocations = additionalLocations;
    if (isLive !== undefined) mockEvt.isLive = isLive;
    if (youtubeVideoId !== undefined) mockEvt.youtubeVideoId = youtubeVideoId;
    if (status !== undefined) mockEvt.status = status;

    const existingCustomization = parseCustomization((mockEvt as any).template_customization_json);
    (mockEvt as any).template_customization_json = JSON.stringify({
      ...existingCustomization,
      backgroundAudioUrl: backgroundAudioUrl !== undefined ? backgroundAudioUrl : existingCustomization.backgroundAudioUrl,
      couplePhotoUrl: couplePhotoUrl !== undefined ? couplePhotoUrl : existingCustomization.couplePhotoUrl,
      loveStory: loveStory !== undefined ? loveStory : existingCustomization.loveStory,
      programs: programs !== undefined ? programs : existingCustomization.programs,
      additionalLocations: additionalLocations !== undefined ? additionalLocations : existingCustomization.additionalLocations
    });

    return NextResponse.json({ success: true, event: formatEvent(mockEvt) });
  } catch (err) {
    console.error('Failed to update event:', err);
    return NextResponse.json({ error: 'Failed to update event.' }, { status: 500 });
  }
}
