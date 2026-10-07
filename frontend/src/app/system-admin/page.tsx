'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SystemAdminRootRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/system-admin/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-gold-400 font-mono">Redirecting to System Admin Control Panel...</span>
      </div>
    </div>
  );
}
