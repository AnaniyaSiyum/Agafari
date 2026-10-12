'use client';

import EventGateScannerPage from '@/app/event/[slug]/scanner/page';

export default function OrganizerEventGatePage({
  params,
}: {
  params: { organizerSlug: string; eventSlug: string };
}) {
  return <EventGateScannerPage params={{ slug: params.eventSlug }} />;
}
