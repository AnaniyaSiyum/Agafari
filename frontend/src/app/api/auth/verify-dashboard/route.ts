export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { queryOne } from '@/lib/db';
import { mockStore } from '@/lib/mockData';
import { verifyPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const dashboardType = (body.dashboardType || '').trim().toLowerCase(); // 'admin' | 'organizer' | 'couple' | 'scanner' | 'streamer' | 'moderator'
    const slug = (body.slug || '').trim().toLowerCase();
    const identifier = (body.identifier || body.email || body.username || '').trim().toLowerCase();
    const password = (body.password || '').trim();

    if (!dashboardType || !password) {
      return NextResponse.json(
        { error: 'Dashboard type and password are required.' },
        { status: 400 }
      );
    }

    let isMatch = false;
    let matchedRole = '';

    // 1. Check Platform Super Admin Dashboard
    if (dashboardType === 'admin' || dashboardType === 'system-admin') {
      if (
        identifier === 'admin' ||
        identifier === 'admin@agafari.com' ||
        identifier === 'superadmin' ||
        identifier === 'systemadmin' ||
        !identifier
      ) {
        if (password === 'admin' || password === 'admin123' || password === 'agafari2026') {
          isMatch = true;
          matchedRole = 'SYSTEM_ADMIN';
        }
      }
    }

    // 2. Check Event Organizer Dashboard
    if (!isMatch && (dashboardType === 'organizer' || dashboardType === 'admin')) {
      if (
        identifier === 'organizer' ||
        identifier === 'organizer@agafari.com' ||
        identifier.includes('org') ||
        !identifier
      ) {
        if (password === 'org123' || password === 'org2026' || password === 'agafari2026' || password === 'admin') {
          isMatch = true;
          matchedRole = 'EVENT_ORGANIZER';
        }
      }
    }

    // 3. Check Per-Event Suite Dashboards (couple, scanner, streamer, moderator)
    if (!isMatch && slug) {
      // Find event in DB or mockStore
      let evt: any = null;
      try {
        evt = await queryOne<any>(
          `SELECT id, slug, title, couple_credentials, credentials FROM events WHERE LOWER(slug) = $1`,
          [slug]
        );
      } catch (e) {
        // Fallback to mockStore
      }

      if (!evt) {
        evt = (mockStore.events as any[]).find((e) => (e.slug || '').toLowerCase() === slug);
      }

      if (evt) {
        const creds = evt.credentials || {};
        const coupleCreds = evt.coupleCredentials || evt.couple_credentials || creds.couple || {};

        if (dashboardType === 'scanner') {
          const scannerCred = creds.scanner || {};
          const expectedEmail = (scannerCred.email || `scanner@${slug}.com`).toLowerCase();
          const expectedPass = scannerCred.temporaryPassword || 'scan123';
          if ((!identifier || identifier === expectedEmail || identifier.includes('scan')) && (password === expectedPass || password === 'scan123' || password === 'agafari2026')) {
            isMatch = true;
            matchedRole = 'GATE_SCANNER';
          }
        } else if (dashboardType === 'streamer' || dashboardType === 'live-streamer') {
          const streamerCred = creds.streamer || {};
          const expectedEmail = (streamerCred.email || `streamer@${slug}.com`).toLowerCase();
          const expectedPass = streamerCred.temporaryPassword || 'stream123';
          if ((!identifier || identifier === expectedEmail || identifier.includes('stream')) && (password === expectedPass || password === 'stream123' || password === 'agafari2026')) {
            isMatch = true;
            matchedRole = 'LIVE_STREAMER';
          }
        } else if (dashboardType === 'moderator' || dashboardType === 'moderation') {
          const modCred = creds.moderator || {};
          const expectedEmail = (modCred.email || `moderator@${slug}.com`).toLowerCase();
          const expectedPass = modCred.temporaryPassword || 'mod123';
          if ((!identifier || identifier === expectedEmail || identifier.includes('mod')) && (password === expectedPass || password === 'mod123' || password === 'agafari2026')) {
            isMatch = true;
            matchedRole = 'MEDIA_MODERATOR';
          }
        } else if (dashboardType === 'couple') {
          const expectedEmail = (coupleCreds.email || `couple@${slug}.com`).toLowerCase();
          const expectedPass = coupleCreds.temporaryPassword || creds.couple?.temporaryPassword || 'agafari2026';
          if ((!identifier || identifier === expectedEmail || identifier.includes('couple') || identifier.includes('bride') || identifier.includes('groom')) && (password === expectedPass || password === 'agafari2026' || password === 'couple123')) {
            isMatch = true;
            matchedRole = 'BRIDE_GROOM';
          }
        }
      } else {
        // Fallback default password matches for dynamic slugs
        if (dashboardType === 'scanner' && (password === 'scan123' || password === 'agafari2026')) isMatch = true;
        if ((dashboardType === 'streamer' || dashboardType === 'live-streamer') && (password === 'stream123' || password === 'agafari2026')) isMatch = true;
        if ((dashboardType === 'moderator' || dashboardType === 'moderation') && (password === 'mod123' || password === 'agafari2026')) isMatch = true;
        if (dashboardType === 'couple' && (password === 'agafari2026' || password === 'couple123')) isMatch = true;
      }
    }

    // Universal Admin master key fallback for emergency support
    if (!isMatch && (password === 'agafari2026' || password === 'admin' || password === 'admin123')) {
      isMatch = true;
      matchedRole = 'SYSTEM_ADMIN';
    }

    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid dashboard credentials. Please verify your username and password for this dashboard.' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Dashboard credentials verified and unlocked.',
      dashboardId: `${dashboardType}:${slug || 'default'}`,
      role: matchedRole
    });
  } catch (error) {
    console.error('Failed to verify dashboard credentials:', error);
    return NextResponse.json(
      { error: 'Internal server error during dashboard verification.' },
      { status: 500 }
    );
  }
}
