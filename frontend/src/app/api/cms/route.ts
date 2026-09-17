export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const sections = await query(`
      SELECT id, section_key, content_json, updated_at
      FROM cms_sections
      ORDER BY section_key ASC
    `);

    const cmsData: Record<string, any> = {};
    sections.forEach((row) => {
      cmsData[row.section_key] = row.content_json;
    });

    return NextResponse.json({ cms: cmsData, sections });
  } catch (error) {
    console.error('Failed to fetch CMS sections from DB:', error);

    const fallbackCms = {
      memories_powered_by_agafari_card: {
        title: "Memories Powered by Agafari Card",
        description: "Candid video blessings and authentic photos captured by loved ones across every table.",
        enabled: true
      },
      packages: {
        silverTitle: "Silver Cultural Package",
        goldTitle: "Gold Royal Package",
        platTitle: "Platinum Executive Package",
        enabled: true
      },
      experience_agafari_live: {
        title: "Experience Agafari Operation Live",
        description: "Live interactive simulator demonstrating gate pass scanning, digital RSVPs, and video feeds.",
        enabled: true
      }
    };

    return NextResponse.json({ cms: fallbackCms, note: 'Fallback CMS sections used due to DB offline state' });
  }
}
