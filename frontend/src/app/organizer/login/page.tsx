'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ArrowRight, Briefcase } from 'lucide-react';
import { useTranslation, LanguageSwitcher } from '@/lib/i18n';

export default function OrganizerLoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleEnterDashboard = async () => {
    setLoading(true);
    try {
      await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      router.push('/organizer/dashboard');
    } catch (err) {
      router.push('/organizer/dashboard');
    }
  };

  useEffect(() => {
    // Direct seamless entry
    handleEnterDashboard();
  }, []);

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-white text-gray-900 flex items-center justify-center p-4 sm:p-6 selection:bg-gold-500 selection:text-black relative font-sans">
      <div className="absolute top-6 right-6">
        <LanguageSwitcher />
      </div>

      <div className="max-w-md w-full glass-panel p-8 md:p-10 rounded-3xl border-2 border-gold-500/40 shadow-xl bg-white text-center space-y-6">
        <div>
          <img
            src="/branding/artboard-14.png"
            alt="Agafari (አጋፋሪ) Logo"
            className="h-14 w-auto mx-auto mb-4 object-contain"
          />
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900">
            {t('auth.organizerTitle')}
          </h1>
          <p className="text-xs text-gold-600 font-semibold uppercase tracking-wider mt-1">
            Organizer Control Center Access
          </p>
        </div>

        <p className="text-xs text-gray-600 font-light leading-relaxed">
          Direct instant access to manage wedding events, itineraries, wishes, and guest check-ins.
        </p>

        <button
          onClick={handleEnterDashboard}
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-black hover:bg-gray-800 text-white font-extrabold text-xs shadow-xl transition-all flex items-center justify-center gap-2 border border-gold-500/40 cursor-pointer"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Briefcase className="w-4 h-4 text-gold-400" />
          )}
          <span>Launch Organizer Dashboard</span>
          <ArrowRight className="w-4 h-4 text-gold-400" />
        </button>

        <div className="pt-4 border-t border-gray-100">
          <p className="text-[11px] text-emerald-600 font-semibold flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Direct Open Dashboard Mode Active
          </p>
        </div>
      </div>
    </div>
  );
}

