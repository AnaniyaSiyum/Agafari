export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/config/env';
import { getAuthUser } from '@/lib/auth';
import { checkEventAccess } from '@/lib/eventScope';
import { CheckInService } from '@/application/services/CheckInService';
import { MySqlEventRepository } from '@/infrastructure/persistence/MySqlEventRepository';
import { MySqlInvitationRepository } from '@/infrastructure/persistence/MySqlInvitationRepository';
import { DomainError } from '@/domain/errors/DomainError';
import { captureException } from '@/lib/errorTracking';
import { verifyRateLimit, buildRateLimitResponse } from '@/lib/rateLimit';

const checkInService = new CheckInService(
  new MySqlEventRepository(),
  new MySqlInvitationRepository()
);

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const rateLimitRes = await verifyRateLimit(`qr_scan:${user.userId}`, { max: 120, windowSeconds: 60 });
  if (!rateLimitRes.success) {
    return buildRateLimitResponse(rateLimitRes);
  }

  try {
    const { eventId, inviteCode, maxGuests, sig, admitCount, clientScannedAt } = await req.json();

    if (!eventId || !inviteCode || maxGuests === undefined || !sig) {
      return NextResponse.json({ error: 'eventId, inviteCode, maxGuests, and sig are required.' }, { status: 400 });
    }

    const access = await checkEventAccess(user, eventId, ['GATE_SCANNER']);
    if (!access.allowed) return NextResponse.json({ error: 'Forbidden — not a gate scanner for this event.' }, { status: 403 });

    const signingSecret = config.ticketSigningSecret;

    const outcome = await checkInService.performCheckIn({
      eventId,
      inviteCode,
      maxGuests: Number(maxGuests),
      sig,
      admitCount: admitCount ? Number(admitCount) : undefined,
      clientScannedAt,
      staffUserId: user.userId,
      signingSecret,
    });

    return NextResponse.json(outcome);
  } catch (error: any) {
    captureException(error, { route: '/api/qr/[code]', userId: user.userId, role: user.role });
    if (error instanceof DomainError) {
      return NextResponse.json(
        { result: error.name.toUpperCase().replace('ERROR', ''), message: error.message },
        { status: error.name === 'NotFoundError' ? 404 : error.name === 'ForbiddenError' ? 403 : 400 }
      );
    }
    return NextResponse.json({ error: 'Scan processing failed.' }, { status: 500 });
  }
}

