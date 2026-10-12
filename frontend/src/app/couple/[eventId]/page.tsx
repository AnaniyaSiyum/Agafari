'use client';

import React from 'react';
import ScopedCouplePortalPage from '@/app/[organizerSlug]/[eventSlug]/couple/page';

export default function CoupleEventPage({ params }: { params: { eventId: string } }) {
  return <ScopedCouplePortalPage params={{ organizerSlug: 'org', eventSlug: params.eventId }} />;
}
