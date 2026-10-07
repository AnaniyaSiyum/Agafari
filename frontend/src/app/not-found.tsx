'use client';

import React from 'react';
import Link from 'next/link';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';
import { useTranslation, LanguageSwitcher } from '@/lib/i18n';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6 selection:bg-gold-500 selection:text-black">
      <div className="absolute top-6 right-6">
        <LanguageSwitcher />
      </div>
      <div className="max-w-md w-full text-center space-y-6 bg-gray-900/80 border border-gold-500/30 p-8 rounded-3xl shadow-2xl backdrop-blur-md">
        <div className="w-16 h-16 rounded-2xl bg-gold-500/10 border border-gold-500/30 text-gold-400 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8 text-gold-400" />
        </div>

        <div className="space-y-2">
          <h1 className="font-serif font-bold text-3xl text-gold-400">{t('notFound.title')}</h1>
          <p className="text-xs text-gray-400 leading-relaxed">
            {t('notFound.description')}
          </p>
        </div>

        <div className="pt-4 flex flex-col gap-3">
          <Link
            href="/"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-black text-xs font-bold shadow-md hover:brightness-110 transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>{t('notFound.returnHome')}</span>
          </Link>
          <button
            onClick={() => typeof window !== 'undefined' && window.history.back()}
            className="w-full py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('notFound.goBack')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

