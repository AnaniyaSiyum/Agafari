'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ArrowRight, Crown } from 'lucide-react';
import { useTranslation, LanguageSwitcher } from '@/lib/i18n';

export default function AdminLoginPage() {
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
      router.push('/admin/dashboard');
    } catch (err) {
      router.push('/admin/dashboard');
    }
  };

  useEffect(() => {
    // Direct seamless entry
    handleEnterDashboard();
  }, []);

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-stone-950 text-white flex items-center justify-center p-4 sm:p-6 relative font-sans">
      <div className="absolute top-6 right-6">
        <LanguageSwitcher />
      </div>

      <div className="max-w-md w-full bg-black/90 p-8 md:p-10 rounded-3xl border-2 border-gold-500/40 shadow-2xl text-center space-y-6">
        <div>
          <img
            src="/branding/artboard-14.png"
            alt="Agafari (አጋፋሪ) Logo"
            className="h-14 w-auto mx-auto mb-4 object-contain"
          />
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-white">
            {t('auth.adminTitle')}
          </h1>
          <p className="text-xs text-gold-400 font-semibold uppercase tracking-wider mt-1">
            System Admin Fleet Control
          </p>
        </div>

        <p className="text-xs text-gray-300 font-light leading-relaxed">
          Direct open access to system administration, agency approvals, and multi-wedding fleet management.
        </p>

        <button
          onClick={handleEnterDashboard}
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-gold-500 hover:bg-gold-400 text-black font-extrabold text-xs shadow-gold transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
          ) : (
            <Crown className="w-4 h-4 text-black" />
          )}
          <span>Launch System Admin Dashboard</span>
          <ArrowRight className="w-4 h-4 text-black" />
        </button>

        <div className="pt-4 border-t border-stone-800">
          <p className="text-[11px] text-emerald-400 font-semibold flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Direct Open Admin Mode Active
          </p>
        </div>
      </div>
    </div>
  );
}
