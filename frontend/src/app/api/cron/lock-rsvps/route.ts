export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { RsvpService } from '@/application/services/RsvpService';
import { MySqlEventRepository } from '@/infrastructure/persistence/MySqlEventRepository';
import { MySqlInvitationRepository } from '@/infrastructure/persistence/MySqlInvitationRepository';

const rsvpService = new RsvpService(
  new MySqlEventRepository(),
  new MySqlInvitationRepository()
);

export async function POST(req: NextRequest) {
  const secret = req.headers.get('authorization')?.replace('Bearer ', '');
  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const maxRetries = 2;
  let attempt = 0;
  let lastError: any = null;

  while (attempt < maxRetries) {
    try {
      attempt++;
      console.log(`[CRON LOG] Executing RSVP lock scan (Attempt ${attempt}/${maxRetries})...`);
      
      const lockedCount = await rsvpService.lockEligibleRsvps();
      
      console.log(`[CRON LOG] RSVP lock scan completed successfully. Locked ${lockedCount} event(s).`);
      return NextResponse.json({
        success: true,
        message: 'RSVP lock cron executed successfully.',
        lockedCount,
        attempts: attempt,
      });
    } catch (error: any) {
      lastError = error;
      console.error(`[CRON WARNING] RSVP lock attempt ${attempt} failed:`, error.message || error);
      if (attempt < maxRetries) {
        await new Promise((res) => setTimeout(res, 1000)); // 1s backoff before retry
      }
    }
  }

  // Structured failure logging
  console.error('[CRON ALERT] All RSVP lock retry attempts exhausted. Final Error:', lastError);
  return NextResponse.json(
    { error: 'Failed to lock RSVPs after retries.', details: lastError?.message || String(lastError) },
    { status: 500 }
  );
}
