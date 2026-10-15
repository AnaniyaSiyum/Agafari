'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import OrganizerDashboardPage from './dashboard/page';

export default function OrganizerMainPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('agafari_user');
      const token = localStorage.getItem('agafari_token');
      if (!userStr || !token) {
        router.push('/login?redirect=%2Forganizer');
        return;
      }
      try {
        const userObj = JSON.parse(userStr);
        const myOrgId = userObj?.organizerId || userObj?.scopeId || userObj?.tenantId;
        if (myOrgId && (userObj.role === 'EVENT_ORGANIZER' || userObj.role === 'ORGANIZER_OWNER')) {
          router.replace(`/organizer/${myOrgId}`);
        }
      } catch {}
    }
  }, [router]);

  return <OrganizerDashboardPage />;
}

