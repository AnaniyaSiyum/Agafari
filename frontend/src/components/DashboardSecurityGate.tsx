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
  dashboardType?: 'admin' | 'organizer' | 'couple' | 'scanner' | 'streamer' | 'moderator';
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
  const [showDirectory, setShowDirectory] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

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
          const urlParams = new URLSearchParams(window.location.search);
          const effectiveOrg = organizerSlug || urlParams.get('id') || urlParams.get('organizerId');
          if (currentUser.role === 'EVENT_ORGANIZER' && effectiveOrg) {
            const userOrg = String(currentUser.organizerId || currentUser.tenantId || currentUser.id || '').toLowerCase().replace(/^org-/, '');
            const targetOrg = effectiveOrg.toLowerCase().replace(/^org-/, '');
            isSessionAuthorized = Boolean(userOrg && targetOrg && userOrg === targetOrg);
          } else if (currentUser.role === 'EVENT_ORGANIZER') {
            isSessionAuthorized = true;
          } else if (currentUser.role === 'SYSTEM_ADMIN') {
            isSessionAuthorized = true;
          } else {
            isSessionAuthorized = false;
          }
        } else if (dashboardType === 'couple') {
          isSessionAuthorized = currentUser.role === 'BRIDE_GROOM';
        } else if (dashboardType === 'scanner') {
          isSessionAuthorized = currentUser.role === 'GATE_SCANNER';
        } else if (dashboardType === 'streamer') {
          isSessionAuthorized = currentUser.role === 'LIVE_STREAMER';
        } else if (dashboardType === 'moderator') {
          isSessionAuthorized = currentUser.role === 'MODERATOR';
        }
      }

      if (isSessionAuthorized) {
        setIsUnlocked(true);
      } else {
        setIsUnlocked(false);
        const urlParams = new URLSearchParams(window.location.search);
        const queryIdentifier = urlParams.get('email') || urlParams.get('identifier') || urlParams.get('username') || '';
        // Only set if explicitly provided in URL or props; NEVER hardcode default credentials
        setIdentifier(defaultEmail || queryIdentifier || '');
        setPassword('');

        // Map initial role hint if arriving from a specific scoped dashboard URL
        if (dashboardType === 'admin') setSelectedRole('admin');
        else if (dashboardType === 'organizer') setSelectedRole('organizer');
        else if (dashboardType === 'couple') setSelectedRole('couple');
        else if (dashboardType === 'scanner') setSelectedRole('scanner');
        else if (dashboardType === 'streamer') setSelectedRole('streamer');
        else if (dashboardType === 'moderator') setSelectedRole('moderator');
      }
      setChecking(false);
    }
  }, [dashboardId, dashboardType, slug, organizerSlug, defaultEmail, storageKey, pathname]);

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
      const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
      const effectiveOrgSlug = organizerSlug || urlParams?.get('id') || urlParams?.get('organizerId') || undefined;

      const res = await fetch('/api/auth/verify-dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dashboardId,
          dashboardType: selectedRole || dashboardType,
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

      setIsUnlocked(true);

      const targetUrl = data.redirectUrl || '/admin/dashboard';
      const currentFullUrl = typeof window !== 'undefined' ? `${window.location.pathname}${window.location.search}` : pathname;
      if (pathname && (pathname.includes('/login') || (targetUrl && targetUrl !== currentFullUrl))) {
        router.push(targetUrl);
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
            {dashboardType === 'organizer' && organizerSlug
              ? `ORGANIZER WORKSPACE: ${organizerSlug}`
              : 'OFFICIAL PLATFORM ACCESS CONTROL'}
          </p>
        </div>

        {/* Role Portal Selector (Guides Context - Does NOT Fill Credentials) */}
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

        {/* Expandable Platform Roles & Demo Accounts Reference */}
        <div className="pt-2 border-t border-stone-800/80">
          <button
            type="button"
            onClick={() => setShowDirectory(!showDirectory)}
            className="w-full flex items-center justify-between text-[11px] text-stone-400 hover:text-gold-300 transition py-1.5 font-medium cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>Platform Roles & Accounts Directory</span>
            </span>
            {showDirectory ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <AnimatePresence>
            {showDirectory && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden pt-2 space-y-3"
              >
                {/* Architecture Clarity Box */}
                <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 text-[10px] text-stone-300 leading-relaxed space-y-1">
                  <p className="font-bold text-amber-300 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Role Architecture Rules:</span>
                  </p>
                  <p>• <strong>1 Single Platform Admin:</strong> Only one global super administrator exists across the system.</p>
                  <p>• <strong>Multiple Event Organizers:</strong> Several independent organizer agencies operate separately.</p>
                  <p>• <strong>Event-Specific Roles:</strong> Gate Scanners, Live Streamers, Content Moderators, and Couples are dedicated and specific to each individual wedding event.</p>
                </div>

                {/* Table of Demo Accounts */}
                <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1 text-[11px]">
                  {/* Super Admin */}
                  <div className="p-2 rounded-lg bg-stone-900/60 border border-stone-800 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <Crown className="w-3 h-3 text-gold-400" />
                        <span className="font-bold text-white text-[11px]">System Super Admin</span>
                        <span className="text-[9px] text-gold-400 font-mono">(1 Single Admin)</span>
                      </div>
                      <p className="text-[10px] text-stone-400 font-mono">admin@agafari.com • admin123</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleUseTestAccount('admin@agafari.com', 'admin123')}
                      className="text-[10px] px-2 py-1 rounded bg-stone-800 hover:bg-gold-500 hover:text-black text-stone-200 transition font-semibold"
                    >
                      {copiedAccount === 'admin@agafari.com' ? 'Filled ✓' : 'Use Account'}
                    </button>
                  </div>

                  {/* Organizer 1 */}
                  <div className="p-2 rounded-lg bg-stone-900/60 border border-stone-800 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <Briefcase className="w-3 h-3 text-amber-400" />
                        <span className="font-bold text-white text-[11px]">Agafari Luxury Events</span>
                        <span className="text-[9px] text-amber-400 font-mono">(Organizer Agency 1)</span>
                      </div>
                      <p className="text-[10px] text-stone-400 font-mono">organizer@agafari.com • org123</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleUseTestAccount('organizer@agafari.com', 'org123')}
                      className="text-[10px] px-2 py-1 rounded bg-stone-800 hover:bg-gold-500 hover:text-black text-stone-200 transition font-semibold"
                    >
                      {copiedAccount === 'organizer@agafari.com' ? 'Filled ✓' : 'Use Account'}
                    </button>
                  </div>

                  {/* Organizer 2 */}
                  <div className="p-2 rounded-lg bg-stone-900/60 border border-stone-800 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <Briefcase className="w-3 h-3 text-amber-400" />
                        <span className="font-bold text-white text-[11px]">Matrimony Event Planners</span>
                        <span className="text-[9px] text-amber-400 font-mono">(Organizer Agency 2)</span>
                      </div>
                      <p className="text-[10px] text-stone-400 font-mono">matrimony@agafari.com • org123</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleUseTestAccount('matrimony@agafari.com', 'org123')}
                      className="text-[10px] px-2 py-1 rounded bg-stone-800 hover:bg-gold-500 hover:text-black text-stone-200 transition font-semibold"
                    >
                      {copiedAccount === 'matrimony@agafari.com' ? 'Filled ✓' : 'Use Account'}
                    </button>
                  </div>

                  {/* Event 1: Adeday & Adisu Staff */}
                  <div className="p-2 rounded-lg bg-stone-900/40 border border-stone-800/80 space-y-1">
                    <span className="text-[10px] font-bold text-rose-300 block">
                      💍 Event 1: Adeday & Adisu Wedding (Per-Event Credentials):
                    </span>
                    <div className="grid grid-cols-2 gap-1 text-[10px] text-stone-300 font-mono">
                      <div className="flex items-center justify-between p-1 bg-stone-950 rounded">
                        <span>Couple: couple@agafari.com</span>
                        <button type="button" onClick={() => handleUseTestAccount('couple@agafari.com', 'agafari2026')} className="text-gold-400 hover:underline">Use</button>
                      </div>
                      <div className="flex items-center justify-between p-1 bg-stone-950 rounded">
                        <span>Scanner: scanner@agafari.com</span>
                        <button type="button" onClick={() => handleUseTestAccount('scanner@agafari.com', 'scan123')} className="text-gold-400 hover:underline">Use</button>
                      </div>
                      <div className="flex items-center justify-between p-1 bg-stone-950 rounded">
                        <span>Streamer: streamer@agafari.com</span>
                        <button type="button" onClick={() => handleUseTestAccount('streamer@agafari.com', 'stream123')} className="text-gold-400 hover:underline">Use</button>
                      </div>
                      <div className="flex items-center justify-between p-1 bg-stone-950 rounded">
                        <span>Moderator: moderator@agafari.com</span>
                        <button type="button" onClick={() => handleUseTestAccount('moderator@agafari.com', 'mod123')} className="text-gold-400 hover:underline">Use</button>
                      </div>
                    </div>
                  </div>

                  {/* Event 2: Sara & Dawit Staff */}
                  <div className="p-2 rounded-lg bg-stone-900/40 border border-stone-800/80 space-y-1">
                    <span className="text-[10px] font-bold text-indigo-300 block">
                      💍 Event 2: Sara & Dawit Matrimony (Per-Event Credentials):
                    </span>
                    <div className="grid grid-cols-2 gap-1 text-[10px] text-stone-300 font-mono">
                      <div className="flex items-center justify-between p-1 bg-stone-950 rounded">
                        <span>Couple: couple@matrimony.com</span>
                        <button type="button" onClick={() => handleUseTestAccount('couple@matrimony.com', 'agafari2026')} className="text-gold-400 hover:underline">Use</button>
                      </div>
                      <div className="flex items-center justify-between p-1 bg-stone-950 rounded">
                        <span>Scanner: scanner@matrimony.com</span>
                        <button type="button" onClick={() => handleUseTestAccount('scanner@matrimony.com', 'scan123')} className="text-gold-400 hover:underline">Use</button>
                      </div>
                      <div className="flex items-center justify-between p-1 bg-stone-950 rounded">
                        <span>Streamer: streamer@matrimony.com</span>
                        <button type="button" onClick={() => handleUseTestAccount('streamer@matrimony.com', 'stream123')} className="text-gold-400 hover:underline">Use</button>
                      </div>
                      <div className="flex items-center justify-between p-1 bg-stone-950 rounded">
                        <span>Moderator: moderator@matrimony.com</span>
                        <button type="button" onClick={() => handleUseTestAccount('moderator@matrimony.com', 'mod123')} className="text-gold-400 hover:underline">Use</button>
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

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

