'use client';

import EventLiveStreamerPage from '@/app/event/[slug]/live-streamer/page';

export default function OrganizerEventLiveStreamerPage({
  params,
}: {
  params: { organizerSlug: string; eventSlug: string };
}) {
  return <EventLiveStreamerPage params={{ slug: params.eventSlug }} />;
}
