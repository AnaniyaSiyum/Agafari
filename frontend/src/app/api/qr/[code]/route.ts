export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { checkEventAccess } from '@/lib/eventScope';
import { CheckInService } from '@/application/services/CheckInService';
import { MySqlEventRepository } from '@/infrastructure/persistence/MySqlEventRepository';
import { MySqlInvitationRepository } from '@/infrastructure/persistence/MySqlInvitationRepository';
import { DomainError } from '@/domain/errors/DomainError';

const checkInService = new CheckInService(
  new MySqlEventRepository(),
  new MySqlInvitationRepository()
);

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { eventId, inviteCode, maxGuests, sig, admitCount, clientScannedAt } = await req.json();
    if (!eventId || !inviteCode || maxGuests === undefined || !sig) {
      return NextResponse.json({ error: 'eventId, inviteCode, maxGuests, and sig are required.' }, { status: 400 });
    }

    const access = await checkEventAccess(user, eventId, ['GATE_SCANNER']);
    if (!access.allowed) return NextResponse.json({ error: 'Forbidden — not a gate scanner for this event.' }, { status: 403 });

    const signingSecret = process.env.TICKET_SIGNING_SECRET || 'fallback-signing-secret-agafari-2026';

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
    if (error instanceof DomainError) {
      return NextResponse.json(
        { result: error.name.toUpperCase().replace('ERROR', ''), message: error.message },
        { status: error.name === 'NotFoundError' ? 404 : error.name === 'ForbiddenError' ? 403 : 400 }
      );
    }
    console.error('Scan processing error:', error);
    return NextResponse.json({ error: 'Scan processing failed.' }, { status: 500 });
  }
}
