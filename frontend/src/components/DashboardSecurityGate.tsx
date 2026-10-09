'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ShieldCheck, KeyRound, Sparkles, AlertCircle, Eye, EyeOff, CheckCircle2, ArrowRight, Crown, Briefcase, Heart, User, ScanLine } from 'lucide-react';

interface DashboardSecurityGateProps {
  dashboardTitle?: string;
  dashboardId?: string;
  dashboardType?: 'admin' | 'organizer' | 'couple' | 'scanner' | 'streamer' | 'moderator';
  slug?: string;
  organizerSlug?: string;
  defaultEmail?: string;
  children: React.ReactNode;
}

export default function DashboardSecurityGate({
  dashboardTitle,
  dashboardId = 'default',
  dashboardType = 'admin',
  slug,
  organizerSlug,
  defaultEmail,
  children,
}: DashboardSecurityGateProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [checking, setChecking] = useState(true);

  // Form State
  const [identifier, setIdentifier] = useState(defaultEmail || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedRolePreset, setSelectedRolePreset] = useState<'admin' | 'matrimony' | 'couple' | 'scanner' | null>(null);

  const storageKey = `agafari_unlocked_dashboard_${dashboardId}`;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const unlockedVal = sessionStorage.getItem(storageKey);
      const token = localStorage.getItem('agafari_token');
      const userStr = localStorage.getItem('agafari_user');
      let currentUser: any = null;
      if (userStr) {
        try {
          currentUser = JSON.parse(userStr);
        } catch (e) {}
      }

      const isGeneralLogin = pathname?.includes('/login') || dashboardId === 'platform-login';

      let isSessionAuthorized = false;
      if (unlockedVal === 'true') {
        isSessionAuthorized = true;
      } else if (token && currentUser && !isGeneralLogin) {
        if (dashboardType === 'admin') {
          isSessionAuthorized = currentUser.role === 'SYSTEM_ADMIN';
        } else if (dashboardType === 'organizer') {
          // Strict tenant check: logged in user must specifically match this organizerSlug
          if (currentUser.role === 'EVENT_ORGANIZER' && organizerSlug) {
            const userOrg = String(currentUser.organizerId || currentUser.tenantId || currentUser.id || '').toLowerCase().replace(/^org-/, '');
            const targetOrg = organizerSlug.toLowerCase().replace(/^org-/, '');
            isSessionAuthorized = Boolean(userOrg && targetOrg && userOrg === targetOrg);
          } else {
            isSessionAuthorized = false;
          }
        } else if (dashboardType === 'couple') {
          isSessionAuthorized = currentUser.role === 'BRIDE_GROOM';
        } else if (dashboardType === 'scanner') {
          isSessionAuthorized = currentUser.role === 'GATE_SCANNER';
        } else if (dashboardType === 'streamer') {
          isSessionAuthorized = currentUser.role === 'LIVE_STREAMER';
        }
      }

      if (isSessionAuthorized) {
        setIsUnlocked(true);
      } else {
        setIsUnlocked(false);
        const urlParams = new URLSearchParams(window.location.search);
        const queryIdentifier = urlParams.get('email') || urlParams.get('identifier') || urlParams.get('username') || '';
        const computedDefault =
          defaultEmail ||
          queryIdentifier ||
          (organizerSlug ? organizerSlug : slug ? `${dashboardType}@${slug}.com` : isGeneralLogin ? '' : `admin@agafari.com`);
        setIdentifier(computedDefault);
      }
      setChecking(false);
    }
  }, [dashboardId, dashboardType, slug, organizerSlug, defaultEmail, storageKey, pathname]);

  const handleRolePresetClick = (role: 'admin' | 'matrimony' | 'couple' | 'scanner') => {
    setSelectedRolePreset(role);
    setErrorMsg(null);
    if (role === 'admin') {
      setIdentifier('admin@agafari.com');
      setPassword('admin123');
    } else if (role === 'matrimony') {
      setIdentifier('matrimony@agafari.com');
      setPassword('org123');
    } else if (role === 'couple') {
      setIdentifier('couple@matrimony.com');
      setPassword('agafari2026');
    } else if (role === 'scanner') {
      setIdentifier('scanner@matrimony.com');
      setPassword('scan123');
    }
  };

  const handleUnlockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!password.trim()) {
      setErrorMsg('Please enter your account password to sign in.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/auth/verify-dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dashboardId,
          dashboardType,
          slug,
          organizerSlug,
          identifier: identifier.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Invalid credentials. Please verify your email and password.');
        setSubmitting(false);
        return;
      }

      // Save Auth State
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(storageKey, 'true');
        if (data.user) {
          localStorage.setItem('agafari_user', JSON.stringify(data.user));
          localStorage.setItem('agafari_role', data.user.role || data.role);
        }
        if (data.token) {
          localStorage.setItem('agafari_token', data.token);
          document.cookie = `agafari_token=${data.token}; path=/; max-age=31536000`;
        }
      }

      // Smart Redirect based on identified role credentials
      const targetUrl = data.redirectUrl || '/admin/dashboard';
      if (pathname && (pathname.includes('/login') || targetUrl !== pathname)) {
        router.push(targetUrl);
      } else {
        setIsUnlocked(true);
      }
    } catch (err) {
      console.error('Failed to verify dashboard credentials:', err);
      setErrorMsg('Network connection error. Please try signing in again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 font-sans">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-serif text-gold-400 text-sm">Verifying Access Control...</p>
        </div>
      </div>
    );
  }

  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#070707] text-stone-100 flex items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden">
      {/* Background Decorative Ambient Lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="max-w-md w-full bg-black/95 border-2 border-gold-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-[0_0_60px_rgba(0,0,0,0.9)] backdrop-blur-2xl relative z-10"
      >
        {/* Header Section */}
        <div className="text-center space-y-2">
          {/* Logo */}
          <div className="flex flex-col items-center justify-center space-y-1 mb-3">
            <img
              src="/branding/artboard-14.png"
              alt="Agafari Logo"
              className="h-16 w-auto object-contain drop-shadow-[0_0_12px_rgba(212,175,55,0.4)]"
              onError={(e) => {
                // Fallback to artboard-13 if artboard-14 not found
                (e.target as HTMLImageElement).src = '/branding/artboard-13.png';
              }}
            />
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-white tracking-wide">
            {dashboardTitle || 'Agafari Platform Login'}
          </h1>

          <p className="text-[11px] font-bold text-gold-500 uppercase tracking-widest block">
            {dashboardType === 'organizer' && organizerSlug
              ? `ORGANIZER ACCESS CONTROL: ${organizerSlug}`
              : 'OFFICIAL PLATFORM ACCESS CONTROL'}
          </p>
        </div>

        {/* Error Notification Banner */}
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs font-semibold flex items-center gap-2.5 shadow-sm"
          >
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="leading-snug">{errorMsg}</span>
          </motion.div>
        )}

        {/* Main Credential Form */}
        <form onSubmit={handleUnlockSubmit} className="space-y-4">
          
          {/* Field 1: Username or Email Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-200 uppercase tracking-wider block flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-gold-400" />
              <span>USERNAME OR EMAIL ADDRESS</span>
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                setSelectedRolePreset(null);
              }}
              placeholder={organizerSlug ? `e.g. ${organizerSlug} or email` : "e.g. admin@agafari.com or couple@agafari.com"}
              className="w-full bg-[#0d0d0d] border border-stone-800 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 rounded-xl px-4 py-3 text-xs text-white placeholder-stone-600 outline-none transition font-medium"
            />
          </div>

          {/* Field 2: Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gold-400 uppercase tracking-wider block flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-gold-400" />
              <span>PASSWORD</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-[#0d0d0d] border border-stone-800 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 rounded-xl px-4 py-3 pr-11 text-xs text-white placeholder-stone-600 outline-none transition font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white transition p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Main Action Button */}
          <button
            type="submit"
            disabled={submitting || !password.trim()}
            className="w-full py-4 px-6 rounded-full font-extrabold text-sm bg-gradient-to-r from-gold-500 via-amber-500 to-gold-600 hover:from-gold-400 hover:to-amber-400 text-stone-950 shadow-[0_0_25px_rgba(212,175,55,0.4)] transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-98 mt-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                <span>Identifying & Verifying...</span>
              </>
            ) : (
              <>
                <Crown className="w-4.5 h-4.5 text-stone-950" />
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4 text-stone-950" />
              </>
            )}
          </button>
        </form>

        {/* Quick Role Selection Presets Bar */}
        <div className="pt-3 border-t border-stone-800/80 space-y-2">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            
            {/* 1. Super Admin Preset */}
            <button
              type="button"
              onClick={() => handleRolePresetClick('admin')}
              className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                selectedRolePreset === 'admin'
                  ? 'bg-gold-500/20 border-gold-500 text-gold-300 shadow-md ring-1 ring-gold-500/50'
                  : 'bg-stone-900/60 border-stone-800 text-stone-300 hover:border-gold-500/40 hover:bg-stone-900'
              }`}
            >
              <Crown className="w-4 h-4 text-gold-400" />
              <span className="text-[10px] font-bold">Super Admin</span>
            </button>

            {/* 2. Matrimony Organizer Preset */}
            <button
              type="button"
              onClick={() => handleRolePresetClick('matrimony')}
              className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                selectedRolePreset === 'matrimony'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md ring-1 ring-amber-500/50'
                  : 'bg-stone-900/60 border-stone-800 text-stone-300 hover:border-amber-500/40 hover:bg-stone-900'
              }`}
            >
              <Briefcase className="w-4 h-4 text-amber-400" />
              <span className="text-[10px] font-bold">Matrimony Org</span>
            </button>

            {/* 3. Couple Preset */}
            <button
              type="button"
              onClick={() => handleRolePresetClick('couple')}
              className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                selectedRolePreset === 'couple'
                  ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-md ring-1 ring-rose-500/50'
                  : 'bg-stone-900/60 border-stone-800 text-stone-300 hover:border-rose-500/40 hover:bg-stone-900'
              }`}
            >
              <Heart className="w-4 h-4 text-rose-400" />
              <span className="text-[10px] font-bold">Couple</span>
            </button>

            {/* 4. Scanner Preset */}
            <button
              type="button"
              onClick={() => handleRolePresetClick('scanner')}
              className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                selectedRolePreset === 'scanner'
                  ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300 shadow-md ring-1 ring-indigo-500/50'
                  : 'bg-stone-900/60 border-stone-800 text-stone-300 hover:border-indigo-500/40 hover:bg-stone-900'
              }`}
            >
              <ScanLine className="w-4 h-4 text-indigo-400" />
              <span className="text-[10px] font-bold">Gate Scanner</span>
            </button>

          </div>
        </div>

        {/* Authorized Login Required Footer */}
        <div className="pt-2 text-center">
          <p className="text-xs text-emerald-400 font-semibold flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Authorized Login Required</span>
          </p>
        </div>

      </motion.div>
    </div>
  );
}

