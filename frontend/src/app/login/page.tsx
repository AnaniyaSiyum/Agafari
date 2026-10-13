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
  ExternalLink
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
  {
    role: 'Event Organizer Agency',
    badge: 'Kebkab Events',
    email: 'kebkab@agafari.com',
    pass: 'org123',
    destination: '/organizer',
    icon: Briefcase,
  },
  {
    role: 'Bride & Groom Portal',
    badge: 'Bethlehem & Yonas',
    email: 'couple@kebkab-wedding.com',
    pass: 'couple123',
    destination: '/couple/evt-bethlehem-yonas',
    icon: Heart,
  },
  {
    role: 'Gate QR Scanner Terminal',
    badge: 'Dedicated Event Staff',
    email: 'scanner@kebkab-wedding.com',
    pass: 'scan123',
    destination: '/event/evt-bethlehem-yonas/scanner',
    icon: ScanLine,
  },
  {
    role: 'Content & Media Moderator',
    badge: 'Dedicated Event Staff',
    email: 'moderator@kebkab-wedding.com',
    pass: 'mod123',
    destination: '/event/evt-bethlehem-yonas/moderation',
    icon: Shield,
  },
];

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

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
        setError(data.error || 'Invalid credentials.');
        setLoading(false);
        return;
      }

      // Check if Admin TOTP is required
      if (data.requireTotp) {
        setRequireTotp(true);
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
      if (data.user) {
        localStorage.setItem('agafari_user', JSON.stringify(data.user));
        localStorage.setItem('agafari_role', data.user.role);
      }

      // Redirect to dedicated dashboard
      const redirectParam = searchParams.get('redirect');
      const finalDestination = redirectParam && redirectParam !== '/login' ? redirectParam : data.redirectUrl || '/admin';
      router.push(finalDestination);
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
    setTotpCode('');
    setError(null);
  };

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
            <button
              onClick={handleLogout}
              className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
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
            {!requireTotp ? (
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
            ) : (
              /* TOTP 2FA Input */
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
                  <span>{requireTotp ? 'Verify Code & Enter' : 'Sign In to Dashboard'}</span>
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
