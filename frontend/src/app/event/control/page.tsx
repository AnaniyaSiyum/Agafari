'use client';

import React, { Suspense } from 'react';
import DedicatedEventControlPage from '@/app/[organizerSlug]/[eventSlug]/page';

export default function StaticEventControlPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-amber-400 font-serif p-6">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold tracking-wider">Loading Dedicated Event Control Center...</p>
        </div>
      </div>
    }>
      <DedicatedEventControlPage />
    </Suspense>
  );
}
