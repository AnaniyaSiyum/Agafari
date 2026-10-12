'use client';

import React from 'react';
import DashboardSecurityGate from '@/components/DashboardSecurityGate';

export default function GeneralLoginPage() {
  return (
    <DashboardSecurityGate
      dashboardTitle="Agafari Wedding Platform Login"
      dashboardId="platform-login"
      dashboardType="any"
    >
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 text-center font-serif">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-gold-400">Authenticated & Redirecting...</h2>
          <p className="text-xs text-gray-400">Welcome to Agafari Smart Wedding Ecosystem.</p>
        </div>
      </div>
    </DashboardSecurityGate>
  );
}

