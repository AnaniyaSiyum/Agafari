export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { checkEventAccess } from '@/lib/eventScope';
import { queryOne } from '@/lib/db';

// PATCH: the couple picks a template, then customizes the allowed fields on
// top of it (name/location/definition live on the event row itself — see
// PATCH /api/events/[slug] — this endpoint only owns template_id and the
// template's own config overrides, per the spec: "after they choose the
// template there is only some changes on that template.")
//
// NEW in this revision — organizer/admin lock: per the spec, "the organizer
// can change main things or essential things that must be different from
// couples to couples." Once an organizer/admin has made their edits, they can
// set `lock: true` so the couple can't accidentally overwrite them; `lock: false`
// reopens it. Only organizer/admin may pass `lock` at all — a couple's request
// silently ignores that field rather than erroring, since it's not something
// they're expected to know exists.
//
// Excludes STAFF entirely (checked via `access.via !== 'STAFF'`) — picking or
// locking a template isn't a gate-scanner/streamer/moderator/delegate job.
export async function PATCH(req: NextRequest, { params }: { params: { slug: string } }) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { templateId, customization, lock } = await req.json();

    const event = await queryOne<{ id: string; template_locked_at: string | null }>(
      'SELECT id, template_locked_at FROM events WHERE slug = $1',
      [params.slug]
    );
    if (!event) return NextResponse.json({ error: 'Event not found.' }, { status: 404 });

    const access = await checkEventAccess(user, event.id);
    if (!access.allowed || access.via === 'STAFF') {
      return NextResponse.json({ error: 'Forbidden — only the couple, their organizer, or an admin can change the template.' }, { status: 403 });
    }

    const isOrganizerOrAdmin = access.via === 'ORGANIZER_OWNER' || access.via === 'SYSTEM_ADMIN';

    if ((templateId || customization !== undefined) && event.template_locked_at && !isOrganizerOrAdmin) {
      return NextResponse.json(
        { error: 'The template is locked by your organizer. Contact them to make further changes.' },
        { status: 403 }
      );
    }

    let template: { id: string } | null = null;
    if (templateId) {
      template = await queryOne('SELECT id FROM templates WHERE id = $1 AND is_active = TRUE', [templateId]);
      if (!template) return NextResponse.json({ error: 'Template not found or no longer available.' }, { status: 404 });
    }

    const lockClause =
      lock !== undefined && isOrganizerOrAdmin
        ? { locked_at: lock ? new Date().toISOString() : null, locked_by: lock ? user.userId : null }
        : null;

    const updated = await queryOne(
      `UPDATE events SET
         template_id = COALESCE($1, template_id),
         template_customization_json = COALESCE($2, template_customization_json),
         template_locked_at = CASE WHEN $3::boolean IS NOT NULL THEN $4::timestamptz ELSE template_locked_at END,
         template_locked_by = CASE WHEN $3::boolean IS NOT NULL THEN $5::uuid ELSE template_locked_by END
       WHERE id = $6
       RETURNING id, slug, template_id, template_customization_json, template_locked_at, template_locked_by`,
      [
        templateId ?? null,
        customization ? JSON.stringify(customization) : null,
        lockClause ? lock : null,
        lockClause ? lockClause.locked_at : null,
        lockClause ? lockClause.locked_by : null,
        event.id,
      ]
    );

    return NextResponse.json({ success: true, event: updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update template.' }, { status: 500 });
  }
}
