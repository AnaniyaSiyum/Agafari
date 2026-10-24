export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { RsvpService } from '@/application/services/RsvpService';
import { MySqlEventRepository } from '@/infrastructure/persistence/MySqlEventRepository';
import { MySqlInvitationRepository } from '@/infrastructure/persistence/MySqlInvitationRepository';
import { DomainError, RsvpLockedError, NotFoundError } from '@/domain/errors/DomainError';
import { captureException } from '@/lib/errorTracking';
import { verifyRateLimit, getClientIp, buildRateLimitResponse } from '@/lib/rateLimit';

const rsvpService = new RsvpService(
  new MySqlEventRepository(),
  new MySqlInvitationRepository()
);

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { inviteCode, attendanceStatus, attendingCount, songRecommendation, dietaryNotes, guestName, guestPhone } =
      await req.json();

    const clientIp = getClientIp(req);
    const rateLimitKey = `rsvp:${params.slug}:${inviteCode || clientIp}`;
    const rateLimitRes = await verifyRateLimit(rateLimitKey, { max: 5, windowSeconds: 600 });
    if (!rateLimitRes.success) {
      return buildRateLimitResponse(rateLimitRes.retryAfterSeconds, 'Too many RSVP submission attempts. Please wait before retrying.', 5, 0);
    }

    if (!attendanceStatus) {
      return NextResponse.json({ error: 'attendanceStatus is required.' }, { status: 400 });
    }


    const result = await rsvpService.submitRsvp({
      slug: params.slug,
      inviteCode,
      attendanceStatus,
      attendingCount: attendingCount ? Number(attendingCount) : undefined,
      songRecommendation,
      dietaryNotes,
      guestName,
      guestPhone,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    captureException(error, { route: '/api/events/[slug]/rsvp', eventSlug: params.slug });
    if (error instanceof RsvpLockedError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to submit RSVP.' }, { status: 500 });
  }
}

