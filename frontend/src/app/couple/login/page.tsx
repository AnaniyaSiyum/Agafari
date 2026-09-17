'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ArrowRight, Heart } from 'lucide-react';
import { useTranslation, LanguageSwitcher } from '@/lib/i18n';

export default function CoupleLoginPage() {
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
      router.push('/couple/dashboard');
    } catch (err) {
      router.push('/couple/dashboard');
    }
  };

  useEffect(() => {
    // Direct seamless entry
    handleEnterDashboard();
  }, []);

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-rose-950/20 text-gray-900 flex items-center justify-center p-4 sm:p-6 relative font-sans">
      <div className="absolute top-6 right-6">
        <LanguageSwitcher />
      </div>

      <div className="max-w-md w-full glass-panel p-8 md:p-10 rounded-3xl border-2 border-rose-300 shadow-xl bg-white text-center space-y-6">
        <div>
          <img
            src="/branding/artboard-14.png"
            alt="Agafari (አጋፋሪ) Logo"
            className="h-14 w-auto mx-auto mb-4 object-contain"
          />
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900">
            {t('auth.coupleTitle')}
          </h1>
          <p className="text-xs text-rose-600 font-semibold uppercase tracking-wider mt-1">
            Bride & Groom Private Portal
          </p>
        </div>

        <p className="text-xs text-gray-600 font-light leading-relaxed">
          Direct open access to manage your wedding invitation page, wish gallery, and guest lists.
        </p>

        <button
          onClick={handleEnterDashboard}
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-rose-400"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Heart className="w-4 h-4 text-white fill-white" />
          )}
          <span>Launch Couple Dashboard</span>
          <ArrowRight className="w-4 h-4 text-white" />
        </button>

        <div className="pt-4 border-t border-gray-100">
          <p className="text-[11px] text-emerald-600 font-semibold flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Direct Open Couple Access Active
          </p>
        </div>
      </div>
    </div>
  );
}
