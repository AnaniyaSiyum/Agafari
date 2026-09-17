'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DedicatedEventControlPage from '@/app/[organizerSlug]/[eventSlug]/page';

export default function AdminIndividualEventControlPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const slug = params.slug;

  const [organizerSlug, setOrganizerSlug] = useState<string | null>(null);

  useEffect(() => {
    async function resolveAndRedirect() {
      try {
        const res = await fetch(`/api/events/${slug}`);
        if (res.ok) {
          const data = await res.json();
          if (data.event) {
            const orgId = data.event.organizerId || data.event.organizer_id || `org-${slug}`;
            const cleanOrgId = String(orgId).startsWith('org-') ? String(orgId) : `org-${String(orgId)}`;
            setOrganizerSlug(cleanOrgId);
            router.replace(`/${cleanOrgId}/${slug}`);
            return;
          }
        }
      } catch (err) {
        console.error('Error resolving organizer slug:', err);
      }
      const fallbackOrgId = `org-${slug}`;
      setOrganizerSlug(fallbackOrgId);
      router.replace(`/${fallbackOrgId}/${slug}`);
    }

    resolveAndRedirect();
  }, [slug, router]);

  return (
    <DedicatedEventControlPage
      params={{
        organizerSlug: organizerSlug || `org-${slug}`,
        eventSlug: slug,
      }}
    />
  );
}
