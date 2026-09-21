'use client';

import EventMediaModerationPage from '@/app/event/[slug]/moderation/page';

export default function OrganizerEventModerationPage({
  params,
}: {
  params: { organizerSlug: string; eventSlug: string };
}) {
  return <EventMediaModerationPage params={{ slug: params.eventSlug }} />;
}
