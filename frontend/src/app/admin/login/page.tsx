'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ArrowRight, Crown, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useTranslation, LanguageSwitcher } from '@/lib/i18n';

export default function AdminLoginPage() {
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
          localStorage.setItem('agafari_role', data.user.role || 'SYSTEM_ADMIN');
          if (data.token) {
            localStorage.setItem('agafari_token', data.token);
            document.cookie = `agafari_token=${data.token}; path=/; max-age=31536000`;
          }
        }
        router.push(data.redirectUrl || '/admin/dashboard');
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
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-stone-950 text-white flex items-center justify-center p-4 sm:p-6 relative font-sans">
      <div className="absolute top-6 right-6">
        <LanguageSwitcher />
      </div>

      <div className="max-w-md w-full bg-black/90 p-8 md:p-10 rounded-3xl border-2 border-gold-500/40 shadow-2xl space-y-6">
        <div className="text-center">
          <img
            src="/branding/artboard-14.png"
            alt="Agafari (አጋፋሪ) Logo"
            className="h-14 w-auto mx-auto mb-4 object-contain"
          />
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-white">
            {t('auth.adminTitle')}
          </h1>
          <p className="text-xs text-gold-400 font-semibold uppercase tracking-wider mt-1 flex items-center justify-center gap-1">
            <Crown className="w-3.5 h-3.5 text-gold-400" />
            {t('auth.adminSubtitle')}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-gold-400" />
              {t('auth.usernameOrEmail')}
            </label>
            <input
              type="text"
              required
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your email or username"
              className="w-full px-4 py-3 rounded-xl border border-stone-800 bg-stone-900 text-white text-xs focus:ring-2 focus:ring-gold-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-gold-400" />
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
                className="w-full px-4 py-3 rounded-xl border border-stone-800 bg-stone-900 text-white text-xs focus:ring-2 focus:ring-gold-500 font-medium pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-black font-extrabold text-xs shadow-gold transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 active:scale-95"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <Crown className="w-4 h-4 text-black" />
            )}
            <span>{t('auth.signInBtn')}</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>
        </form>

        <div className="pt-2 border-t border-stone-800 text-center">
          <p className="text-[11px] text-emerald-400 font-semibold flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> {t('auth.authorizedLoginRequired')}
          </p>
        </div>
      </div>
    </div>
  );
}

