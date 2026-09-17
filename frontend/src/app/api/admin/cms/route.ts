export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { query, queryOne } from '@/lib/db';

export async function PATCH(req: NextRequest) {
  const auth = requireRole(req, ['SYSTEM_ADMIN']);
  if (!auth.ok) return auth.response;

  try {
    const { sectionKey, contentJson } = await req.json();
    if (!sectionKey || !contentJson) {
      return NextResponse.json({ error: 'sectionKey and contentJson are required.' }, { status: 400 });
    }

    const sectionId = `cms-${sectionKey}`;
    await query(
      `INSERT INTO cms_sections (id, section_key, content_json, updated_by)
       VALUES ($1, $2, $3, $4)
       ON DUPLICATE KEY UPDATE
         content_json = VALUES(content_json),
         updated_by = VALUES(updated_by),
         updated_at = CURRENT_TIMESTAMP`,
      [sectionId, sectionKey, JSON.stringify(contentJson), auth.user?.userId || 'admin-001']
    );

    const section = await queryOne('SELECT * FROM cms_sections WHERE section_key = $1', [sectionKey]);

    return NextResponse.json({ success: true, section });
  } catch (error) {
    console.error('Failed to update CMS section:', error);
    return NextResponse.json({ error: 'Failed to update CMS section.' }, { status: 500 });
  }
}
