'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ScopedCouplePortalPage from '@/app/[organizerSlug]/[eventSlug]/couple/page';

export default function UniversalCouplePage() {
  const router = useRouter();
  const [resolvedSlug, setResolvedSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const userStr = localStorage.getItem('agafari_user');
    const token = localStorage.getItem('agafari_token');
    const role = localStorage.getItem('agafari_role');

    if (!userStr || !token) {
      router.replace('/login?redirect=%2Fcouple');
      return;
    }

    let userObj: any = null;
    try {
      userObj = JSON.parse(userStr);
    } catch (e) {}

    const directSlug =
      userObj?.eventSlug ||
      userObj?.slug ||
      (userObj?.scopeId && userObj.scopeId !== 'event-default' ? userObj.scopeId : null) ||
      localStorage.getItem('agafari_couple_slug');

    if (directSlug) {
      setResolvedSlug(directSlug);
      setLoading(false);
      return;
    }

    // Attempt to query the backend to resolve the event linked to this couple
    async function resolveCoupleEvent() {
      try {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch('/api/admin/events', { headers });
        if (res.ok) {
          const data = await res.json();
          const events = data.events || [];
          const matched = events.find(
            (e: any) =>
              e.couple_user_id === userObj?.id ||
              e.coupleUserId === userObj?.id ||
              (e.coupleCredentials?.email && e.coupleCredentials.email.toLowerCase() === userObj?.email?.toLowerCase()) ||
              (e.credentials?.couple?.email && e.credentials.couple.email.toLowerCase() === userObj?.email?.toLowerCase()) ||
              (e.couple_email && e.couple_email.toLowerCase() === userObj?.email?.toLowerCase())
          );
          if (matched && (matched.slug || matched.id)) {
            const finalSlug = matched.slug || matched.id;
            localStorage.setItem('agafari_couple_slug', finalSlug);
            setResolvedSlug(finalSlug);
            setLoading(false);
            return;
          }
          if (events.length > 0) {
            const fallbackSlug = events[0].slug || events[0].id;
            setResolvedSlug(fallbackSlug);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Failed to resolve couple event slug dynamically:', err);
      }

      // Default fallback
      setResolvedSlug('hermela-and-kaleab-mv730b7n');
      setLoading(false);
    }

    resolveCoupleEvent();
  }, [router]);

  if (loading || !resolvedSlug) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="w-10 h-10 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs text-gold-300 font-mono tracking-wider uppercase font-semibold">
          Resolving Couple Wedding Portal...
        </p>
      </div>
    );
  }

  return <ScopedCouplePortalPage params={{ organizerSlug: 'org', eventSlug: resolvedSlug }} />;
}
