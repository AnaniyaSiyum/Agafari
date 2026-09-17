export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Call this on a schedule (e.g. Vercel Cron, hourly) with header:
//   Authorization: Bearer <CRON_SECRET>
// It sets rsvp_locked_at for any invitation whose event is within 2 days and
// isn't locked yet. This is the piece that was missing — the lock rule existed
// only as a comment/plan, not as code that actually runs.
export async function POST(req: NextRequest) {
  const secret = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const locked = await query(
    `UPDATE invitations i SET rsvp_locked_at = CURRENT_TIMESTAMP
     FROM events e
     WHERE i.event_id = e.id
       AND i.rsvp_locked_at IS NULL
       AND e.event_date <= CURRENT_TIMESTAMP + INTERVAL '2 days'
     RETURNING i.id`
  );

  return NextResponse.json({ success: true, lockedCount: locked.length });
}
