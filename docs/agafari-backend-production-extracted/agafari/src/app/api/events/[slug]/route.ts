export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { queryOne, query } from '@/lib/db';

// GET: public, unauthenticated — everything the coming-soon / invitation page needs
export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  const event = await queryOne(
    `SELECT id, slug, title, bride_name, groom_name, event_date, start_time, second_event_date,
            venue_name, venue_address, venue_map_url, dress_code, welcome_message, cover_image_url,
            status, is_live, youtube_video_id, thank_you_message, thank_you_image_url,
            template_id, template_customization_json
     FROM events WHERE slug = $1 AND admin_approval_status = 'APPROVED'`,
    [params.slug]
  );

  if (!event) {
    return NextResponse.json({ error: 'Event not found.' }, { status: 404 });
  }

  const locations = await query(
    'SELECT label, address, map_url, order_index FROM event_locations WHERE event_id = $1 ORDER BY order_index ASC',
    [event.id]
  );

  return NextResponse.json({ event, locations });
}
