export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const templates = await query(`
      SELECT id, name, preview_url, config_json, is_active, created_at
      FROM templates
      WHERE is_active = TRUE
      ORDER BY name ASC
    `);

    return NextResponse.json({ templates });
  } catch (error) {
    console.error('Failed to fetch templates from DB:', error);
    
    // Minimal fallback templates matching database seeds if DB connection is unavailable
    const fallbackTemplates = [
      {
        id: 'tmpl_royal_gold',
        name: 'Royal Gold Habesha',
        preview_url: '/images/hero_couple_bg.png',
        config_json: { primaryColor: '#D4AF37', accentColor: '#111827', font: 'royal-serif' },
        is_active: true,
      },
      {
        id: 'tmpl_ethiopian_classic',
        name: 'Ethiopian Classic Floral',
        preview_url: '/images/feature_countdown.png',
        config_json: { primaryColor: '#B45309', accentColor: '#065F46', font: 'script' },
        is_active: true,
      },
      {
        id: 'tmpl_modern_minimal',
        name: 'Modern Luxury Minimal',
        preview_url: '/images/feature_qr_pass.png',
        config_json: { primaryColor: '#000000', accentColor: '#D4AF37', font: 'sans' },
        is_active: true,
      },
    ];

    return NextResponse.json({ templates: fallbackTemplates, note: 'Fallback mock template list used due to DB offline state' });
  }
}
