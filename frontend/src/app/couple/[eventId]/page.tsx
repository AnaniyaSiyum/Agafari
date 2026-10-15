'use client';

import React, { use } from 'react';
import ScopedCouplePortalPage from '@/app/[organizerSlug]/[eventSlug]/couple/page';

export default function CoupleEventPage({ params }: { params: Promise<{ eventId: string }> | { eventId: string } }) {
  const resolvedParams = typeof (params as any)?.then === 'function' ? use(params as Promise<{ eventId: string }>) : params;
  const eventId = resolvedParams?.eventId || '';

  return <ScopedCouplePortalPage params={{ organizerSlug: 'org', eventSlug: eventId }} />;
}
