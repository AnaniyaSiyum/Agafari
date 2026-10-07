'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ShieldCheck, KeyRound, Sparkles, AlertCircle, Eye, EyeOff, CheckCircle2, ArrowRight } from 'lucide-react';

interface DashboardSecurityGateProps {
  dashboardTitle: string;
  dashboardId: string;
  dashboardType: 'admin' | 'organizer' | 'couple' | 'scanner' | 'streamer' | 'moderator';
  slug?: string;
  defaultEmail?: string;
  children: React.ReactNode;
}

export default function DashboardSecurityGate({
  dashboardTitle,
  dashboardId,
  dashboardType,
  slug,
  defaultEmail,
  children,
}: DashboardSecurityGateProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [checking, setChecking] = useState(true);

  // Form State
  const [identifier, setIdentifier] = useState(defaultEmail || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const storageKey = `agafari_unlocked_dashboard_${dashboardId}`;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const unlockedVal = sessionStorage.getItem(storageKey);
      if (unlockedVal === 'true') {
        setIsUnlocked(true);
      } else {
        // Pre-fill default email if provided
        const computedDefault = defaultEmail || (slug ? `${dashboardType}@${slug}.com` : `${dashboardType}@agafari.com`);
        setIdentifier(computedDefault);
      }
      setChecking(false);
    }
  }, [dashboardId, dashboardType, slug, defaultEmail, storageKey]);

  const handleUnlockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/auth/verify-dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dashboardId,
          dashboardType,
          slug,
          identifier: identifier.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Invalid credentials. Please enter the correct password for this dashboard.');
        setSubmitting(false);
        return;
      }

      // Success: Save unlock token in sessionStorage for this session
      sessionStorage.setItem(storageKey, 'true');
      setIsUnlocked(true);
    } catch (err) {
      console.error('Failed to verify dashboard credentials:', err);
      setErrorMsg('Network error. Please try verifying dashboard credentials again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-stone-950 text-white flex items-center justify-center p-6 font-sans">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-serif text-gold-400 text-sm">Verifying Dashboard Credentials...</p>
        </div>
      </div>
    );
  }

  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden">
      {/* Background Decorative Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full bg-stone-900/90 border-2 border-gold-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-xl relative z-10"
      >
        {/* Header Icon & Title */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-gold-500/10 border-2 border-gold-500/40 text-gold-400 flex items-center justify-center mx-auto shadow-lg shadow-gold-500/10">
            <Lock className="w-8 h-8 text-gold-400 animate-pulse" />
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
              <span>Unique Dashboard Credentials Required</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-white tracking-wide pt-1">{dashboardTitle}</h2>
            {slug && (
              <p className="text-xs text-stone-400 font-mono">
                Dashboard URL ID: <span className="text-gold-400 font-bold">{slug}</span>
              </p>
            )}
          </div>

          <p className="text-xs text-stone-400 leading-relaxed">
            Please enter the unique credentials assigned to this specific dashboard to unlock full administrative access.
          </p>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-400 text-xs flex items-start gap-2.5"
          >
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span className="leading-snug">{errorMsg}</span>
          </motion.div>
        )}

        {/* Credential Form */}
        <form onSubmit={handleUnlockSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider block">
              Dashboard Username / Email
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. scanner@event.com"
              className="w-full bg-stone-950 border border-stone-800 focus:border-gold-400 rounded-xl px-4 py-3 text-sm text-white placeholder-stone-600 outline-none transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider block">
              Dashboard Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password for this dashboard"
                className="w-full bg-stone-950 border border-stone-800 focus:border-gold-400 rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-stone-600 outline-none transition"
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

          <button
            type="submit"
            disabled={submitting || !password.trim()}
            className="w-full py-3.5 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-stone-950 shadow-lg shadow-gold-500/20 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <>
                <KeyRound className="w-4 h-4 text-stone-950" />
                <span>Unlock Dashboard</span>
                <ArrowRight className="w-4 h-4 text-stone-950" />
              </>
            )}
          </button>
        </form>

        {/* Security Notice */}
        <div className="pt-2 text-center border-t border-stone-800/60">
          <p className="text-[11px] text-stone-500">
            Agafari Smart Wedding Ecosystem &bull; Protected Access Control
          </p>
        </div>
      </motion.div>
    </div>
  );
}
