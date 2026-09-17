'use client';

import React from 'react';
import ScopedCouplePortalPage from '@/app/[organizerSlug]/[eventSlug]/couple/page';

export default function EventCouplePortalPage({ params }: { params: { slug: string } }) {
  return <ScopedCouplePortalPage params={{ organizerSlug: 'org', eventSlug: params.slug }} />;
}
