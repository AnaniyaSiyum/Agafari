'use client';

import React from 'react';
import MediaPortalFeedPage from '@/app/event/[slug]/feed/page';

export default function OrganizedMediaFeedPage({
  params,
}: {
  params: { organizerSlug: string; eventSlug: string };
}) {
  return <MediaPortalFeedPage params={{ slug: params.eventSlug }} />;
}
