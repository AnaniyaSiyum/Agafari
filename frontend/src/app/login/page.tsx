'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  Mail,
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Crown,
  Briefcase,
  Heart,
  ScanLine,
  Shield,
  ChevronDown,
  ChevronUp,
  LogOut,
  Sparkles,
  ExternalLink,
  QrCode,
  Copy,
  Check
} from 'lucide-react';

interface TestAccount {
  role: string;
  badge: string;
  email: string;
  pass: string;
  destination: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TEST_ACCOUNTS: TestAccount[] = [
  {
    role: 'System Super Admin',
    badge: '1 Platform Admin',
    email: 'admin@agafari.com',
    pass: 'admin123',
    destination: '/admin',
    icon: Crown,
  },
];

function resolveDestination(userRole?: string, redirectParam?: string | null, serverRedirectUrl?: string): string {
  const defaultDestination = serverRedirectUrl || '/login';
  if (!redirectParam || redirectParam === '/login') {
    return defaultDestination;
  }

  const cleanRedirect = redirectParam.toLowerCase().split('?')[0];

  // System Admin can visit any requested dashboard; prefer /admin/dashboard if accessing root admin
  if (userRole === 'SYSTEM_ADMIN') {
    if (cleanRedirect === '/admin' || cleanRedirect === '/admin/' || cleanRedirect === '/system-admin') {
      return serverRedirectUrl || '/admin/dashboard';
    }
    return redirectParam;
  }

  // Couples can only visit couple routes; prefer scoped wedding couple URL
  if (userRole === 'COUPLE' || userRole === 'BRIDE_GROOM') {
    if (cleanRedirect === '/couple' || cleanRedirect === '/couple/' || cleanRedirect === '/couple/dashboard') {
      return serverRedirectUrl || '/couple';
    }
    if (cleanRedirect.includes('/couple')) {
      return redirectParam;
    }
    return serverRedirectUrl || '/couple';
  }

  // Organizers can visit organizer routes; prefer scoped organizer dashboard with ?id=
  if (userRole === 'EVENT_ORGANIZER' || userRole === 'ORGANIZER_OWNER') {
    if (cleanRedirect.startsWith('/admin') || cleanRedirect.startsWith('/system-admin') || cleanRedirect.startsWith('/couple')) {
      return serverRedirectUrl || '/organizer/dashboard';
    }
    if (cleanRedirect === '/organizer' || cleanRedirect === '/organizer/' || cleanRedirect === '/organizer/dashboard') {
      return serverRedirectUrl || redirectParam;
    }
    return redirectParam;
  }

  // Staff roles (Scanner, Moderator, Streamer)
  if (userRole === 'GATE_SCANNER') {
    return cleanRedirect.includes('/scanner') ? redirectParam : (serverRedirectUrl || '/login');
  }
  if (userRole === 'LIVE_STREAMER') {
    return cleanRedirect.includes('/live-streamer') ? redirectParam : (serverRedirectUrl || '/login');
  }
  if (userRole === 'MEDIA_MODERATOR' || userRole === 'MODERATOR' || userRole === 'CONTENT_MODERATOR') {
    return cleanRedirect.includes('/moderation') ? redirectParam : (serverRedirectUrl || '/login');
  }

  return defaultDestination;
}

export default function UniversalLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 2FA TOTP state for Admin
  const [requireTotp, setRequireTotp] = useState(false);
  const [requireTotpSetup, setRequireTotpSetup] = useState(false);
  const [totpSetupData, setTotpSetupData] = useState<{ secret?: string; qrUri?: string; setupToken?: string } | null>(null);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [totpCode, setTotpCode] = useState('');
  const [totpMessage, setTotpMessage] = useState<string | null>(null);

  // Active session check
  const [currentUser, setCurrentUser] = useState<{ email?: string; role?: string } | null>(null);
  const [showDirectory, setShowDirectory] = useState(false);

  useEffect(() => {
    // Check if user has active session in localStorage
    const savedUser = localStorage.getItem('agafari_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch {}
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    localStorage.removeItem('agafari_user');
    localStorage.removeItem('agafari_role');
    localStorage.removeItem('agafari_token');
    sessionStorage.clear();
    setCurrentUser(null);
  };

  const handleConfirmTotpSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!totpCode.trim() || totpCode.trim().length !== 6) {
      setError('Please enter the 6-digit verification code from your authenticator app.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/totp/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: totpCode.trim(),
          setupToken: totpSetupData?.setupToken,
          email: identifier.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid 6-digit code. Please try again.');
        setLoading(false);
        return;
      }

      if (data.token) {
        localStorage.setItem('agafari_token', data.token);
      }
      if (data.user) {
        localStorage.setItem('agafari_user', JSON.stringify(data.user));
        localStorage.setItem('agafari_role', data.user.role);
      }

      window.location.href = data.redirectUrl || '/admin';
    } catch (err) {
      console.error('TOTP confirm error:', err);
      setError('Network connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (requireTotpSetup) {
      return handleConfirmTotpSetup(e);
    }

    if (!identifier.trim()) {
      setError('Please enter your email, username, or phone number.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }
    if (requireTotp && !totpCode.trim()) {
      setError('Please enter your 6-digit authenticator code.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: identifier.trim(),
          password: password.trim(),
          totpCode: requireTotp ? totpCode.trim() : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setError(data.error || 'Too many failed attempts. Rate limited. Please try again later.');
        } else if (res.status === 403) {
          setError(data.error || 'Access denied. Account is inactive or unauthorized.');
        } else {
          setError(data.error || 'Invalid credentials.');
        }
        setLoading(false);
        return;
      }

      // Check if Admin TOTP Setup is required (first-time enrollment)
      if (data.requireTotpSetup) {
        setRequireTotpSetup(true);
        setRequireTotp(false);
        setTotpSetupData({
          secret: data.secret,
          qrUri: data.qrUri,
          setupToken: data.setupToken,
        });
        setTotpMessage(data.message || 'Two-Factor Authentication setup required for System Admin.');
        setLoading(false);
        return;
      }

      // Check if Admin TOTP Verification is required (subsequent logins)
      if (data.requireTotp) {
        setRequireTotp(true);
        setRequireTotpSetup(false);
        setTotpMessage(data.message || 'Two-Factor Authentication required for System Admin.');
        setLoading(false);
        return;
      }

      // Check if user has multiple memberships
      if (data.requireSelectAccess) {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('agafari_memberships', JSON.stringify(data.memberships));
          sessionStorage.setItem('agafari_login_email', identifier.trim());
          sessionStorage.setItem('agafari_login_pass', password.trim());
        }
        router.push('/select-access');
        return;
      }

      // Save user session
      if (data.token) {
        localStorage.setItem('agafari_token', data.token);
      }
      if (data.user) {
        localStorage.setItem('agafari_user', JSON.stringify(data.user));
        localStorage.setItem('agafari_role', data.user.role);
        if (data.user.eventSlug || data.user.slug) {
          localStorage.setItem('agafari_couple_slug', data.user.eventSlug || data.user.slug);
        }
      }

      // Redirect to dedicated dashboard based on authorized role
      const redirectParam = searchParams.get('redirect');
      const finalDestination = resolveDestination(data.user?.role, redirectParam, data.redirectUrl);
      window.location.href = finalDestination;
    } catch (err) {
      console.error('Login error:', err);
      setError('Network connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUseAccount = (acc: TestAccount) => {
    setIdentifier(acc.email);
    setPassword(acc.pass);
    setRequireTotp(false);
    setRequireTotpSetup(false);
    setTotpCode('');
    setError(null);
  };

  const redirectTarget = searchParams.get('redirect');

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-4 selection:bg-amber-500 selection:text-black">
      {/* Background Decorative Lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/10 blur-[130px] rounded-full" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-rose-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative w-full max-w-md space-y-6">
        {/* Active Session Notice Banner */}
        {currentUser && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 bg-neutral-900/90 border border-amber-500/30 rounded-2xl flex items-center justify-between text-xs backdrop-blur-md shadow-lg"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-neutral-300">
                Active: <strong className="text-white">{currentUser.email}</strong>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  const role = currentUser.role || localStorage.getItem('agafari_role') || '';
                  const dest = (role === 'COUPLE' || role === 'BRIDE_GROOM') 
                    ? (localStorage.getItem('agafari_couple_slug') ? `/couple/${localStorage.getItem('agafari_couple_slug')}` : '/couple')
                    : (role === 'SYSTEM_ADMIN' ? '/admin' : '/organizer');
                  window.location.href = dest;
                }}
                className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="text-neutral-400 hover:text-rose-400 font-semibold flex items-center gap-1 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Security Gate Banner for Protected Dashboards */}
        {redirectTarget && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-amber-500/10 border border-amber-500/40 rounded-2xl text-xs backdrop-blur-md space-y-1 shadow-md"
          >
            <div className="flex items-center gap-2 font-bold text-amber-400">
              <Lock className="w-4 h-4 shrink-0 text-amber-400" />
              <span>Authentication Required</span>
            </div>
            <p className="text-[11px] text-neutral-300 font-medium">
              Please enter your credentials below to unlock access to{' '}
              <span className="font-mono text-amber-300 bg-black/40 px-1.5 py-0.5 rounded break-all">
                {redirectTarget}
              </span>
            </p>
          </motion.div>
        )}

        {/* Main Login Card */}
        <div className="bg-neutral-900/95 border border-neutral-800 rounded-3xl p-7 sm:p-8 shadow-2xl backdrop-blur-xl relative space-y-6">
          {/* Header Branding */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 text-black rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
              <Crown className="w-7 h-7" />
            </div>
            <h1 className="font-serif text-2xl font-bold tracking-tight text-white pt-1">
              Agafari Wedding Platform
            </h1>
            <p className="text-xs text-neutral-400 max-w-xs mx-auto leading-relaxed">
              Universal Sign In. Enter your credentials; the system automatically resolves your dedicated dashboard.
            </p>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-red-200 text-xs flex items-center gap-2 overflow-hidden"
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {requireTotpSetup ? (
              /* TOTP Setup / Enrollment Screen */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4 p-5 bg-amber-500/10 border border-amber-500/30 rounded-2xl"
              >
                <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
                  <ShieldCheck className="w-5 h-5 shrink-0" />
                  <span>System Admin 2FA Enrollment</span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Two-factor authentication is required for System Administrators. Scan this QR code in your Authenticator app (Google Authenticator, Authy, etc.):
                </p>

                {totpSetupData?.qrUri && (
                  <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl shadow-md mx-auto max-w-[200px]">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(totpSetupData.qrUri)}`}
                      alt="TOTP 2FA QR Code"
                      className="w-40 h-40 object-contain"
                    />
                  </div>
                )}

                {totpSetupData?.secret && (
                  <div className="space-y-1 bg-black/40 p-2.5 rounded-xl border border-neutral-800">
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Manual Key</span>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs text-amber-300 tracking-wider break-all select-all">
                        {totpSetupData.secret}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (totpSetupData.secret) {
                            navigator.clipboard.writeText(totpSetupData.secret);
                            setCopiedSecret(true);
                            setTimeout(() => setCopiedSecret(false), 2000);
                          }
                        }}
                        className="text-xs text-neutral-400 hover:text-white p-1 rounded bg-neutral-800 shrink-0 flex items-center gap-1"
                      >
                        {copiedSecret ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span className="text-[10px]">{copiedSecret ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-1.5 pt-1">
                  <label className="block text-xs font-semibold text-neutral-200">
                    Enter 6-Digit Authenticator Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    autoFocus
                    required
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    className="w-full text-center tracking-[0.5em] text-xl font-mono py-2.5 bg-neutral-950 border border-amber-500/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setRequireTotpSetup(false);
                    setRequireTotp(false);
                    setTotpCode('');
                  }}
                  className="text-[11px] text-neutral-400 hover:text-white underline block mx-auto pt-1"
                >
                  Cancel & Return to Login
                </button>
              </motion.div>
            ) : requireTotp ? (
              /* TOTP Verification Screen */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl"
              >
                <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Two-Factor Authentication (TOTP)</span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  {totpMessage || 'Enter the 6-digit code from your authenticator app (or enter master dev code 123456):'}
                </p>
                <input
                  type="text"
                  maxLength={6}
                  autoFocus
                  required
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-full text-center tracking-[0.5em] text-xl font-mono py-2.5 bg-neutral-950 border border-amber-500/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    setRequireTotp(false);
                    setTotpCode('');
                  }}
                  className="text-[11px] text-neutral-400 hover:text-white underline block mx-auto pt-1"
                >
                  Back to credentials
                </button>
              </motion.div>
            ) : (
              <>
                {/* Identifier Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-neutral-300">
                    Email / Username / Phone
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      autoFocus
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. admin@agafari.com or kebkab@agafari.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-neutral-300">
                    Password
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-sm rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {requireTotpSetup
                      ? 'Confirm & Enable 2FA'
                      : requireTotp
                      ? 'Verify Code & Enter'
                      : 'Sign In to Dashboard'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Collapsible Test Accounts Quick Reference */}
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl overflow-hidden backdrop-blur-md">
          <button
            type="button"
            onClick={() => setShowDirectory(!showDirectory)}
            className="w-full p-4 flex items-center justify-between text-xs font-semibold text-neutral-300 hover:text-white transition"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Testing Accounts Directory (5 Roles)</span>
            </div>
            {showDirectory ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
          </button>

          <AnimatePresence>
            {showDirectory && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="px-4 pb-4 space-y-2 border-t border-neutral-800/80 pt-3"
              >
                <p className="text-[11px] text-neutral-400 pb-1">
                  Click any account below to populate fields for testing:
                </p>

                {TEST_ACCOUNTS.map((acc) => {
                  const Icon = acc.icon;
                  return (
                    <div
                      key={acc.email}
                      className="p-3 bg-neutral-950/80 border border-neutral-800 rounded-xl flex items-center justify-between text-xs hover:border-amber-500/40 transition group"
                    >
                      <div className="space-y-0.5">
                        <div className="font-semibold text-white flex items-center gap-1.5">
                          <Icon className="w-3.5 h-3.5 text-amber-500" />
                          <span>{acc.role}</span>
                          <span className="text-[10px] text-amber-400 font-mono bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                            {acc.badge}
                          </span>
                        </div>
                        <div className="font-mono text-[11px] text-neutral-400">
                          {acc.email} • pass: <strong className="text-neutral-200">{acc.pass}</strong>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleUseAccount(acc)}
                        className="px-2.5 py-1.5 bg-neutral-800 hover:bg-amber-500 hover:text-black text-neutral-300 rounded-lg text-[11px] font-semibold transition"
                      >
                        Use Account
                      </button>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
