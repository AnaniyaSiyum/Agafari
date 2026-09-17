export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { checkEventAccess } from '@/lib/eventScope';
import { ModerationService } from '@/application/services/ModerationService';
import { MySqlMediaRepository } from '@/infrastructure/persistence/MySqlMediaRepository';
import { MySqlWishRepository } from '@/infrastructure/persistence/MySqlWishRepository';
import { DomainError } from '@/domain/errors/DomainError';

const moderationService = new ModerationService(
  new MySqlMediaRepository(),
  new MySqlWishRepository()
);

// GET /api/organizer/media/comments?eventId=...&mediaId=...
export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get('eventId');
  const mediaId = searchParams.get('mediaId');
  if (!eventId || !mediaId) return NextResponse.json({ error: 'eventId and mediaId are required.' }, { status: 400 });

  const access = await checkEventAccess(user, eventId, ['CONTENT_MODERATOR']);
  if (!access.allowed) return NextResponse.json({ error: 'Forbidden for this event.' }, { status: 403 });

  try {
    const comments = await moderationService.getMediaComments(mediaId, user.role === 'SYSTEM_ADMIN' ? undefined : user.userId);
    return NextResponse.json({ comments });
  } catch (error: any) {
    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to fetch comments.' }, { status: 500 });
  }
}

// DELETE { eventId, commentId }
export async function DELETE(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { eventId, commentId } = await req.json();
    if (!eventId || !commentId) {
      return NextResponse.json({ error: 'eventId and commentId are required.' }, { status: 400 });
    }

    const access = await checkEventAccess(user, eventId, ['CONTENT_MODERATOR']);
    if (!access.allowed) return NextResponse.json({ error: 'Forbidden for this event.' }, { status: 403 });

    await moderationService.updateCommentStatus(commentId, 'REJECTED', user.role === 'SYSTEM_ADMIN' ? undefined : user.userId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete comment.' }, { status: 500 });
  }
}
