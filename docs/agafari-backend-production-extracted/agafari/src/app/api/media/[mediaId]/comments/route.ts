export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { queryOne, query } from '@/lib/db';

// GET: comments on one feed post. No auth — same guest model as likes/wishes.
// Only returns comments for posts that are actually APPROVED and visible, so
// a rejected/pending item's comments (if any slipped in before moderation)
// can't be scraped by guessing its id.
export async function GET(_req: NextRequest, { params }: { params: { mediaId: string } }) {
  const media = await queryOne<{ id: string; status: string }>(
    'SELECT id, status FROM media_assets WHERE id = $1',
    [params.mediaId]
  );
  if (!media || media.status !== 'APPROVED') {
    return NextResponse.json({ error: 'Post not found.' }, { status: 404 });
  }

  const comments = await query(
    'SELECT id, sender_name, comment, created_at FROM media_comments WHERE media_id = $1 ORDER BY created_at ASC',
    [params.mediaId]
  );
  return NextResponse.json({ comments });
}

// POST { senderName, comment } — spec: like/comment applies to individual
// wish/BTS videos, explicitly NOT to live-stream items (enforce that here,
// not just hidden in the UI, so the button being hidden isn't the only guard).
export async function POST(req: NextRequest, { params }: { params: { mediaId: string } }) {
  try {
    const { senderName, comment } = await req.json();
    if (!senderName?.trim() || !comment?.trim()) {
      return NextResponse.json({ error: 'senderName and comment are required.' }, { status: 400 });
    }
    if (comment.length > 500) {
      return NextResponse.json({ error: 'comment is too long (max 500 characters).' }, { status: 400 });
    }

    const media = await queryOne<{ id: string; status: string; category: string }>(
      'SELECT id, status, category FROM media_assets WHERE id = $1',
      [params.mediaId]
    );
    if (!media || media.status !== 'APPROVED') {
      return NextResponse.json({ error: 'Post not found.' }, { status: 404 });
    }
    if (media.category === 'LIVE') {
      return NextResponse.json({ error: 'Comments are disabled on live broadcasts.' }, { status: 403 });
    }

    const created = await queryOne(
      'INSERT INTO media_comments (media_id, sender_name, comment) VALUES ($1,$2,$3) RETURNING *',
      [params.mediaId, senderName.trim(), comment.trim()]
    );
    return NextResponse.json({ success: true, comment: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add comment.' }, { status: 500 });
  }
}
