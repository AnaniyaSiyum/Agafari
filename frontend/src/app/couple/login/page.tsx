'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ArrowRight, Heart, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useTranslation, LanguageSwitcher } from '@/lib/i18n';

export default function CoupleLoginPage() {
  const { t } = useTranslation();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username.trim() || !password.trim()) {
      setErrorMsg(t('auth.fillBothFields'));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password: password.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('agafari_user', JSON.stringify(data.user));
          localStorage.setItem('agafari_role', data.user.role || 'BRIDE_GROOM');
          if (data.token) {
            localStorage.setItem('agafari_token', data.token);
            document.cookie = `agafari_token=${data.token}; path=/; max-age=31536000`;
          }
        }
        router.push(data.redirectUrl || '/couple/dashboard');
      } else {
        setErrorMsg(data.error || t('auth.invalidCreds'));
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrorMsg(t('auth.networkError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-rose-950/20 text-gray-900 flex items-center justify-center p-4 sm:p-6 relative font-sans">
      <div className="absolute top-6 right-6">
        <LanguageSwitcher />
      </div>

      <div className="max-w-md w-full bg-white p-8 md:p-10 rounded-3xl border-2 border-rose-200 shadow-2xl space-y-6">
        <div className="text-center">
          <img
            src="/branding/artboard-14.png"
            alt="Agafari (አጋፋሪ) Logo"
            className="h-14 w-auto mx-auto mb-4 object-contain"
          />
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900">
            {t('auth.coupleTitle')}
          </h1>
          <p className="text-xs text-rose-600 font-semibold uppercase tracking-wider mt-1 flex items-center justify-center gap-1">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            {t('auth.coupleSubtitle')}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-rose-500" />
              {t('auth.usernameOrEmail')}
            </label>
            <input
              type="text"
              required
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your email or username"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-xs focus:ring-2 focus:ring-rose-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-rose-500" />
              {t('auth.passwordLabel')}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-xs focus:ring-2 focus:ring-rose-500 font-medium pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 active:scale-95"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Heart className="w-4 h-4 text-white fill-white" />
            )}
            <span>{t('auth.signInBtn')}</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </form>

        <div className="pt-2 border-t border-gray-100 text-center">
          <p className="text-[11px] text-emerald-600 font-semibold flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> {t('auth.authorizedLoginRequired')}
          </p>
        </div>
      </div>
    </div>
  );
}

