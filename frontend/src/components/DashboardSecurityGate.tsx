'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  ShieldCheck,
  KeyRound,
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowRight,
  Crown,
  Briefcase,
  Heart,
  User,
  ScanLine,
  Radio,
  Shield,
  ChevronDown,
  ChevronUp,
  Copy,
  Check
} from 'lucide-react';

interface DashboardSecurityGateProps {
  dashboardTitle?: string;
  dashboardId?: string;
  dashboardType?: 'admin' | 'organizer' | 'couple' | 'scanner' | 'streamer' | 'moderator' | 'any';
  slug?: string;
  organizerSlug?: string;
  defaultEmail?: string;
  children: React.ReactNode;
}

export type PlatformRoleCategory =
  | 'admin'
  | 'organizer'
  | 'couple'
  | 'scanner'
  | 'streamer'
  | 'moderator';

interface RoleConfig {
  id: PlatformRoleCategory;
  name: string;
  scopeBadge: string;
  scopeDescription: string;
  placeholder: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

const PLATFORM_ROLES: RoleConfig[] = [
  {
    id: 'admin',
    name: 'System Admin',
    scopeBadge: '1 Single Global Admin',
    scopeDescription: 'The only single universal platform administrator across the entire system.',
    placeholder: 'admin@agafari.com',
    icon: Crown,
    accentColor: 'border-gold-500 text-gold-400 bg-gold-500/10',
  },
  {
    id: 'organizer',
    name: 'Event Organizer',
    scopeBadge: 'Multiple Agencies',
    scopeDescription: 'Several independent event organizer agencies exist (e.g. Matrimony Planners, Agafari Events, and custom agencies).',
    placeholder: 'e.g. organizer@agafari.com or Agency Username',
    icon: Briefcase,
    accentColor: 'border-amber-500 text-amber-400 bg-amber-500/10',
  },
  {
    id: 'couple',
    name: 'Bride & Groom',
    scopeBadge: 'Per-Event Couple',
    scopeDescription: 'Event-specific couple portal. Each wedding event has its own dedicated bride & groom account.',
    placeholder: 'e.g. couple@agafari.com or Couple Username',
    icon: Heart,
    accentColor: 'border-rose-500 text-rose-400 bg-rose-500/10',
  },
  {
    id: 'scanner',
    name: 'Gate Scanner',
    scopeBadge: 'Per-Event Staff',
    scopeDescription: 'Event-specific ticket check-in terminal. Each wedding event has dedicated gate scanners.',
    placeholder: 'e.g. scanner@agafari.com or Scanner Username',
    icon: ScanLine,
    accentColor: 'border-indigo-500 text-indigo-400 bg-indigo-500/10',
  },
  {
    id: 'streamer',
    name: 'Live Streamer',
    scopeBadge: 'Per-Event Streamer',
    scopeDescription: 'Event-specific broadcast studio. Each wedding event has its own dedicated live broadcast manager.',
    placeholder: 'e.g. streamer@agafari.com or Streamer Username',
    icon: Radio,
    accentColor: 'border-red-500 text-red-400 bg-red-500/10',
  },
  {
    id: 'moderator',
    name: 'Content Moderator',
    scopeBadge: 'Per-Event Moderator',
    scopeDescription: 'Event-specific guest wishes and media review studio. Each wedding has its assigned moderator.',
    placeholder: 'e.g. moderator@agafari.com or Moderator Username',
    icon: Shield,
    accentColor: 'border-emerald-500 text-emerald-400 bg-emerald-500/10',
  },
];

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

  // Form State: strictly unpopulated by default
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Selected role context (for guidance and filter only, DOES NOT autofill credentials)
  const [selectedRole, setSelectedRole] = useState<PlatformRoleCategory | null>(null);
  const [showDirectory, setShowDirectory] = useState(dashboardId === 'platform-login' || dashboardType === 'any');
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  const storageKey = `agafari_unlocked_dashboard_${dashboardId}`;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('agafari_token');
      const userStr = localStorage.getItem('agafari_user');
      let currentUser: any = null;
      if (userStr) {
        try {
          currentUser = JSON.parse(userStr);
        } catch (e) {}
      }

      const isGeneralLogin = pathname?.includes('/login') || dashboardId === 'platform-login' || dashboardType === 'any';

      let isSessionAuthorized = false;
      if (token && currentUser && !isGeneralLogin) {
        if (dashboardType === 'admin') {
          isSessionAuthorized = currentUser.role === 'SYSTEM_ADMIN';
        } else if (dashboardType === 'organizer') {
          const isOrgUser = currentUser.role === 'EVENT_ORGANIZER' || currentUser.role === 'ORGANIZER_OWNER';
          const isSysAdmin = currentUser.role === 'SYSTEM_ADMIN';
          isSessionAuthorized = isOrgUser || isSysAdmin;
        } else if (dashboardType === 'couple') {
          const isCouple = currentUser.role === 'BRIDE_GROOM' || currentUser.role === 'COUPLE';
          const isStaffOrAdmin = currentUser.role === 'SYSTEM_ADMIN' || currentUser.role === 'EVENT_ORGANIZER' || currentUser.role === 'ORGANIZER_OWNER';
          isSessionAuthorized = isCouple || isStaffOrAdmin;
        } else if (dashboardType === 'scanner') {
          isSessionAuthorized = currentUser.role === 'GATE_SCANNER';
        } else if (dashboardType === 'streamer') {
          isSessionAuthorized = currentUser.role === 'LIVE_STREAMER';
        } else if (dashboardType === 'moderator') {
          isSessionAuthorized = currentUser.role === 'MODERATOR' || currentUser.role === 'MEDIA_MODERATOR';
        }
      }

      if (isSessionAuthorized) {
        setIsUnlocked(true);
        setChecking(false);
      } else {
        setIsUnlocked(false);
        if (!isGeneralLogin) {
          // Immediately redirect to universal login page with return destination preserved
          const currentDest = window.location.pathname + window.location.search;
          router.replace(`/login?redirect=${encodeURIComponent(currentDest)}`);
          return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const queryIdentifier = urlParams.get('email') || urlParams.get('identifier') || urlParams.get('username') || '';
        setIdentifier(defaultEmail || queryIdentifier || '');
        setPassword('');
        setSelectedRole(null);
        setChecking(false);
      }
    }
  }, [dashboardId, dashboardType, slug, organizerSlug, defaultEmail, pathname, router]);

  // Selecting a role tab updates guidance only, NEVER autofills input credentials
  const handleRoleTabClick = (roleId: PlatformRoleCategory) => {
    setSelectedRole((prev) => (prev === roleId ? null : roleId));
    setErrorMsg(null);
  };

  // Explicit user-driven action: fill specific test account from the reference directory
  const handleUseTestAccount = (loginId: string, pass: string) => {
    setIdentifier(loginId);
    setPassword(pass);
    setErrorMsg(null);
    setCopiedAccount(loginId);
    setTimeout(() => setCopiedAccount(null), 2000);
  };

  const handleUnlockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!identifier.trim()) {
      setErrorMsg('Please enter your username or email address.');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('Please enter your account password.');
      return;
    }

    setSubmitting(true);

    try {
      const isGeneralLogin = pathname?.includes('/login') || dashboardId === 'platform-login' || dashboardType === 'any';
      const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
      const effectiveOrgSlug = organizerSlug || urlParams?.get('id') || urlParams?.get('organizerId') || undefined;

      const res = await fetch('/api/auth/verify-dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dashboardId,
          dashboardType: isGeneralLogin ? 'any' : (selectedRole || dashboardType),
          slug,
          organizerSlug: effectiveOrgSlug,
          identifier: identifier.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Invalid credentials. Please verify your username and password.');
        setSubmitting(false);
        return;
      }

      // Save Auth State
      if (typeof window !== 'undefined') {
        if (data.user) {
          localStorage.setItem('agafari_user', JSON.stringify(data.user));
          localStorage.setItem('agafari_role', data.user.role || data.role);
          if (data.user.eventSlug || data.user.slug) {
            localStorage.setItem('agafari_couple_slug', data.user.eventSlug || data.user.slug);
          }
        }
        if (data.token) {
          localStorage.setItem('agafari_token', data.token);
          document.cookie = `agafari_token=${data.token}; path=/; max-age=31536000`;
        }
      }

      const authenticatedRole = (data.user?.role || data.role || '').toUpperCase();
      const targetUrl = data.redirectUrl || '/admin/dashboard';
      const currentFullUrl = typeof window !== 'undefined' ? `${window.location.pathname}${window.location.search}` : pathname;

      // STRICT ROLE-BASED DASHBOARD ROUTING:
      // If credentials entered are for System Admin, ALWAYS route to System Admin Dashboard!
      if (authenticatedRole === 'SYSTEM_ADMIN') {
        window.location.href = '/admin/dashboard';
        return;
      }

      // If credentials entered are for Event Organizer, ALWAYS route to Organizer Agency Dashboard!
      if (authenticatedRole === 'EVENT_ORGANIZER' || authenticatedRole === 'ORGANIZER_OWNER') {
        if (!pathname?.startsWith('/organizer')) {
          window.location.href = targetUrl.startsWith('/organizer') ? targetUrl : '/organizer/dashboard';
          return;
        }
      }

      // If credentials entered are for Couple, ALWAYS route to Couple Wedding Portal!
      if (authenticatedRole === 'COUPLE' || authenticatedRole === 'BRIDE_GROOM') {
        if (!pathname?.includes('/couple')) {
          window.location.href = targetUrl.includes('/couple') ? targetUrl : '/couple';
          return;
        }
      }

      setIsUnlocked(true);

      if (pathname && (pathname.includes('/login') || (targetUrl && targetUrl !== currentFullUrl))) {
        window.location.href = targetUrl;
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

  const activeRoleConfig = selectedRole ? PLATFORM_ROLES.find((r) => r.id === selectedRole) : null;
  const isGeneralLogin = pathname?.includes('/login') || dashboardId === 'platform-login' || dashboardType === 'any';

  return (
    <div className="min-h-screen bg-[#070707] text-stone-100 flex items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden">
      {/* Background Decorative Ambient Lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gold-500/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="max-w-lg w-full bg-black/95 border-2 border-gold-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-[0_0_60px_rgba(0,0,0,0.9)] backdrop-blur-2xl relative z-10"
      >
        {/* Header Section */}
        <div className="text-center space-y-2">
          <div className="flex flex-col items-center justify-center space-y-1 mb-2">
            <img
              src="/branding/artboard-14.png"
              alt="Agafari Logo"
              className="h-14 w-auto object-contain drop-shadow-[0_0_12px_rgba(212,175,55,0.4)]"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/branding/artboard-13.png';
              }}
            />
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-white tracking-wide">
            {dashboardTitle || 'Agafari Platform Login'}
          </h1>

          <p className="text-[11px] font-bold text-gold-500 uppercase tracking-widest block">
            {isGeneralLogin
              ? 'ENTER CREDENTIALS TO ACCESS YOUR SPECIFIC DASHBOARD'
              : (dashboardType === 'organizer' && organizerSlug
                  ? `ORGANIZER WORKSPACE: ${organizerSlug}`
                  : 'OFFICIAL PLATFORM ACCESS CONTROL')}
          </p>
        </div>

        {/* Role Portal Selector (Only shown if NOT general login) */}
        {!isGeneralLogin && (
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              SELECT ROLE CONTEXT (OPTIONAL):
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
              {PLATFORM_ROLES.map((role) => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.id;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => handleRoleTabClick(role.id)}
                    title={`${role.name}: ${role.scopeDescription}`}
                    className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      isSelected
                        ? `${role.accentColor} shadow-md ring-1 ring-gold-500/50 font-bold scale-[1.02]`
                        : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:border-gold-500/30 hover:text-stone-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-[9px] leading-tight truncate w-full">{role.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Role Architecture Guidance Banner */}
            {activeRoleConfig && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-stone-900/80 border border-stone-800 flex items-start gap-2.5 text-xs text-stone-300"
              >
                <activeRoleConfig.icon className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5 text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{activeRoleConfig.name}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-gold-500/20 text-gold-300 font-mono font-semibold border border-gold-500/30">
                      {activeRoleConfig.scopeBadge}
                    </span>
                  </div>
                  <p className="text-stone-400 leading-snug">{activeRoleConfig.scopeDescription}</p>
                </div>
              </motion.div>
            )}
          </div>
        )}

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
            <label className="text-xs font-bold text-gray-200 uppercase tracking-wider block flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-gold-400" />
                <span>USERNAME OR EMAIL ADDRESS</span>
              </span>
              {activeRoleConfig && (
                <span className="text-[10px] text-gold-400 font-mono font-bold">
                  {activeRoleConfig.name}
                </span>
              )}
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={activeRoleConfig ? activeRoleConfig.placeholder : 'Enter your account username or email'}
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
            disabled={submitting || !identifier.trim() || !password.trim()}
            className="w-full py-4 px-6 rounded-full font-extrabold text-sm bg-gradient-to-r from-gold-500 via-amber-500 to-gold-600 hover:from-gold-400 hover:to-amber-400 text-stone-950 shadow-[0_0_25px_rgba(212,175,55,0.4)] transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-98 mt-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                <span>Authenticating Identity...</span>
              </>
            ) : (
              <>
                <Crown className="w-4.5 h-4.5 text-stone-950" />
                <span>Sign In to Platform</span>
                <ArrowRight className="w-4 h-4 text-stone-950" />
              </>
            )}
          </button>
        </form>

        {/* Authorized Login Required Footer */}
        <div className="pt-1 text-center">
          <p className="text-xs text-emerald-400 font-semibold flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Multi-Tenant Enterprise Security Active</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

