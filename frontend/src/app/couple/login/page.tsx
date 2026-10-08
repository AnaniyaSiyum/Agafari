'use client';

import React from 'react';
import DashboardSecurityGate from '@/components/DashboardSecurityGate';

export default function CoupleLoginPage() {
  return (
    <DashboardSecurityGate
      dashboardTitle="Agafari Platform Login"
      dashboardId="platform-login"
      dashboardType="couple"
    >
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 text-center font-serif">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-gold-400">Authenticated & Redirecting...</h2>
          <p className="text-xs text-gray-400">Welcome to your Agafari Bride & Groom Suite.</p>
        </div>
      </div>
    </DashboardSecurityGate>
  );
}

