'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminRootRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('agafari_user');
      const token = localStorage.getItem('agafari_token');
      if (userStr && token) {
        try {
          const userObj = JSON.parse(userStr);
          if (userObj.role === 'EVENT_ORGANIZER' || userObj.role === 'ORGANIZER_OWNER') {
            const myOrgId = userObj?.organizerId || userObj?.scopeId || userObj?.tenantId;
            router.replace(myOrgId ? `/organizer/dashboard?id=${encodeURIComponent(myOrgId)}` : '/organizer/dashboard');
            return;
          }
          if (userObj.role === 'COUPLE' || userObj.role === 'BRIDE_GROOM') {
            router.replace('/couple');
            return;
          }
        } catch {}
      }
    }
    router.replace('/admin/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-stone-950 text-white flex items-center justify-center p-6">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-gold-400 font-mono">Redirecting to Admin Dashboard...</span>
      </div>
    </div>
  );
}
