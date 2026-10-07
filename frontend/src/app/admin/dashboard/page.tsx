'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Crown, 
  Calendar, 
  Users, 
  Video, 
  Plus, 
  ExternalLink, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  LogOut, 
  Search, 
  Check, 
  X, 
  Sparkles, 
  Layers, 
  KeyRound, 
  FileText, 
  UserPlus, 
  Briefcase, 
  QrCode, 
  Eye, 
  EyeOff, 
  Lock, 
  ChevronRight, 
  Activity, 
  DollarSign, 
  Film, 
  ScanLine, 
  Share2, 
  Radio, 
  Trash2, 
  Clock, 
  Archive, 
  MapPin, 
  Send, 
  Copy, 
  Menu, 
  AlertCircle, 
  Settings, 
  RefreshCw,
  Building2
} from 'lucide-react';
import { useTranslation, LanguageSwitcher } from '@/lib/i18n';

interface EventCredential {
  fullName: string;
  email: string;
  temporaryPassword?: string;
  role: string;
}

interface EventData {
  id: string;
  slug: string;
  title: string;
  brideName: string;
  groomName: string;
  eventDate: string;
  startTime?: string;
  venueName: string;
  venueAddress?: string;
  dressCode?: string;
  coverImageUrl?: string;
  status: 'DRAFT' | 'COMING_SOON' | 'LIVE' | 'COMPLETED' | 'ARCHIVED';
  adminApprovalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  managedBy?: 'ORGANIZER' | 'ADMIN' | 'INDIVIDUAL';
  organizerId?: string | null;
  organizerName?: string | null;
  isIndividual?: boolean;
  coupleCredentials?: {
    email: string;
    temporaryPassword?: string;
  };
  youtubeVideoId?: string;
  isLive?: boolean;
  credentials?: {
    couple: EventCredential;
    organizer: EventCredential;
    streamer: EventCredential;
    scanner: EventCredential;
    moderator?: EventCredential;
  };
  stats?: {
    totalInvites: number;
    totalWishes: number;
    totalMedia: number;
  };
}

interface UserData {
  id: string;
  email: string;
  fullName: string;
  companyName?: string;
  description?: string;
  organizerId?: string;
  role: 'SYSTEM_ADMIN' | 'EVENT_ORGANIZER' | 'BRIDE_GROOM' | 'LIVE_STREAMER' | 'GATE_SCANNER' | 'GUEST';
  eventId?: string | null;
  temporaryPassword?: string;
}

interface MediaAssetData {
  id: string;
  eventId: string;
  uploaderName: string;
  mediaType: 'VIDEO' | 'IMAGE';
  cdnUrl: string;
  caption: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

const DEFAULT_PLATFORM_USERS: UserData[] = [
  {
    id: 'usr-admin-1',
    email: 'admin@agafari.com',
    fullName: 'System Super Admin',
    companyName: 'Agafari Headquarters',
    role: 'SYSTEM_ADMIN',
    temporaryPassword: 'admin123',
  },
  {
    id: 'usr-org-1',
    email: 'organizer@agafari.com',
    fullName: 'Agafari Luxury Event Production',
    companyName: 'Agafari Luxury Event Production',
    description: 'Official certified event management partner. Specializing in full-service luxury weddings, guest registration, and live broadcast production.',
    organizerId: 'org-usr-org-1',
    role: 'EVENT_ORGANIZER',
    temporaryPassword: 'org123',
  },
  {
    id: 'usr-org-2',
    email: 'royal@agafari.com',
    fullName: 'Ethiopian Royal Wedding Planners',
    companyName: 'Ethiopian Royal Wedding Planners',
    description: 'Certified premium event agency specializing in high-profile traditional Ethiopian weddings, VIP guest management, and stage design.',
    organizerId: 'org-usr-org-2',
    role: 'EVENT_ORGANIZER',
    temporaryPassword: 'org123',
  },
  {
    id: 'usr-org-3',
    email: 'agency@kanaevents.com',
    fullName: 'Kana Events & Wedding Production',
    companyName: 'Kana Events & Wedding Production',
    description: 'Full-service event production studio managing venue setup, guest seating charts, live video streaming, and digital invitations.',
    organizerId: 'org-usr-org-3',
    role: 'EVENT_ORGANIZER',
    temporaryPassword: 'org123',
  },
  {
    id: 'usr-org-4',
    email: 'contact@habeshaelite.com',
    fullName: 'Habesha Elite Wedding Coordinators',
    companyName: 'Habesha Elite Wedding Coordinators',
    description: 'Bespoke Ethiopian wedding planning agency offering gate QR scanning, live broadcast management, and guest wish moderation.',
    organizerId: 'org-usr-org-4',
    role: 'EVENT_ORGANIZER',
    temporaryPassword: 'org123',
  },
];

export default function SystemAdminDashboardPage() {
  const { t } = useTranslation();
  const router = useRouter();
  // Navigation: 'APPROVALS' | 'EVENTS' | 'ORGANIZERS' | 'USERS'
  const [activeTab, setActiveTab] = useState<'APPROVALS' | 'EVENTS' | 'ORGANIZERS' | 'USERS'>('APPROVALS');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [events, setEvents] = useState<EventData[]>([]);
  const [users, setUsers] = useState<UserData[]>(DEFAULT_PLATFORM_USERS);
  const [loading, setLoading] = useState(true);

  // Selected Drill-Down Event & Impersonation Hub
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);

  // Event Fleet Directory Filters
  const [fleetFilter, setFleetFilter] = useState<'ALL' | 'ACTIVE' | 'ARCHIVE' | 'PENDING'>('ALL');
  const [searchFleetQuery, setSearchFleetQuery] = useState('');

  // User Management State
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('ALL');
  const [resettingUser, setResettingUser] = useState<UserData | null>(null);
  const [newPasswordVal, setNewPasswordVal] = useState('');

  // New Event Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBrideName, setNewBrideName] = useState('');
  const [newGroomName, setNewGroomName] = useState('');
  const [newEventDate, setNewEventDate] = useState('2026-11-25');
  const [newVenueName, setNewVenueName] = useState('');
  const [newVenueAddress, setNewVenueAddress] = useState('Addis Ababa, Ethiopia');
  const [newCoupleEmail, setNewCoupleEmail] = useState('');
  const [newExpectedGuests, setNewExpectedGuests] = useState<number | ''>(300);
  const [creatingEvent, setCreatingEvent] = useState(false);
  const [createdAdminControlUrl, setCreatedAdminControlUrl] = useState<string | null>(null);
  const [createdOrgCreds, setCreatedOrgCreds] = useState<{ id: string; email: string; password?: string; url: string } | null>(null);

  // New Organizer Agency Onboarding State
  const [orgAgencyName, setOrgAgencyName] = useState('');
  const [orgContactEmail, setOrgContactEmail] = useState('');
  const [orgCompanyDesc, setOrgCompanyDesc] = useState('');
  const [orgPassword, setOrgPassword] = useState('org123');
  const [creatingOrg, setCreatingOrg] = useState(false);
  const [orgSuccessMsg, setOrgSuccessMsg] = useState('');
  const [orgErrorMsg, setOrgErrorMsg] = useState('');

  // Helper functions for organizer company branding
  function getOrganizerCompanyName(org: UserData): string {
    if (org.companyName && org.companyName.trim()) return org.companyName.trim();
    if (org.fullName && !org.fullName.includes('@') && org.fullName.trim() !== 'Event Organizer') {
      return org.fullName.trim();
    }
    if (org.email) {
      const username = org.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
      const titleCase = username.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      return `${titleCase} Event Production Agency`;
    }
    return 'Certified Event Organizer Agency';
  }

  function getOrganizerDescription(org: UserData): string {
    if (org.description && org.description.trim()) return org.description.trim();
    const compName = getOrganizerCompanyName(org);
    return `Official certified event management partner (${compName}). Specializing in full-service luxury weddings, guest registration, and live broadcast production.`;
  }

  // Password Visibility & Copy Feedback
  const [copiedKey, setCopiedKey] = useState<string>('');
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('agafari_user');
      const token = localStorage.getItem('agafari_token');
      const role = localStorage.getItem('agafari_role');
      const allowedRoles = ['SYSTEM_ADMIN', 'EVENT_ORGANIZER', 'ADMIN'];
      if (!userStr || !token || !allowedRoles.includes(role || '')) {
        localStorage.removeItem('agafari_user');
        localStorage.removeItem('agafari_role');
        localStorage.removeItem('agafari_token');
        document.cookie = 'agafari_token=; path=/; max-age=0';
        router.push('/login');
        return;
      }
    }
    fetchAdminData();
  }, []);

  const handleSignOut = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('agafari_user');
      localStorage.removeItem('agafari_role');
      localStorage.removeItem('agafari_token');
      document.cookie = 'agafari_token=; path=/; max-age=0';
    }
    router.push('/admin/login');
  };

  const getAdminAuthHeaders = () => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('agafari_token');
      if (storedToken) {
        headers['Authorization'] = `Bearer ${storedToken}`;
      }
    }
    return headers;
  };

  async function fetchAdminData() {
    try {
      const headers = getAdminAuthHeaders();

      const [eventsRes, usersRes, mediaRes] = await Promise.all([
        fetch('/api/admin/events', { headers }),
        fetch('/api/admin/users', { headers }),
        fetch('/api/organizer/media', { headers }),
      ]);

      if (eventsRes.ok) {
        const eventsData = await eventsRes.json();
        const loadedEvents: EventData[] = eventsData.events || [];
        setEvents(loadedEvents);
        if (loadedEvents.length > 0) {
          setSelectedEvent((prev) => prev || loadedEvents[0]);
        } else {
          setSelectedEvent(null);
        }
      }

      let loadedUsers: UserData[] = [];
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        loadedUsers = usersData.users || [];
      }

      const existingEmails = new Set(loadedUsers.map((u) => (u.email || '').toLowerCase()));
      for (const defUser of DEFAULT_PLATFORM_USERS) {
        if (!existingEmails.has(defUser.email.toLowerCase())) {
          loadedUsers.push(defUser);
        }
      }

      setUsers(loadedUsers);
    } catch (err) {
      console.error('Failed to load admin data:', err);
      setUsers((prev) => (prev.length > 0 ? prev : DEFAULT_PLATFORM_USERS));
    } finally {
      setLoading(false);
    }
  }

  // 1-Click Approve Organizer Wedding Request (Module 1)
  const handleApproveEventRequest = async (eventId: string) => {
    try {
      const res = await fetch('/api/admin/events', {
        method: 'PATCH',
        headers: getAdminAuthHeaders(),
        body: JSON.stringify({ eventId, adminApprovalStatus: 'APPROVED', status: 'COMING_SOON' }),
      });

      if (res.ok) {
        setEvents((prev) =>
          prev.map((e) => (e.id === eventId ? { ...e, adminApprovalStatus: 'APPROVED', status: 'COMING_SOON' } : e))
        );
        if (selectedEvent && selectedEvent.id === eventId) {
          setSelectedEvent((prev) => prev ? { ...prev, adminApprovalStatus: 'APPROVED', status: 'COMING_SOON' } : null);
        }
      }
    } catch (err) {
      console.error('Failed to approve event:', err);
    }
  };

  // 1-Click Reject Organizer Wedding Request
  const handleRejectEventRequest = async (eventId: string) => {
    if (!confirm('Reject this wedding licensing request?')) return;
    try {
      const res = await fetch('/api/admin/events', {
        method: 'PATCH',
        headers: getAdminAuthHeaders(),
        body: JSON.stringify({ eventId, adminApprovalStatus: 'REJECTED' }),
      });

      if (res.ok) {
        setEvents((prev) =>
          prev.map((e) => (e.id === eventId ? { ...e, adminApprovalStatus: 'REJECTED' } : e))
        );
      }
    } catch (err) {
      console.error('Failed to reject event:', err);
    }
  };

  // Delete Event / Wedding Handler (Asks TWICE to prevent accidental deletion)
  const handleDeleteEvent = async (e: React.MouseEvent | null, eventId: string, title: string) => {
    if (e) e.stopPropagation();

    // Confirmation Step 1: First Confirmation
    const step1Confirmed = window.confirm(
      `⚠️ CONFIRMATION 1 OF 2:\nAre you sure you want to delete wedding event "${title}"?\n\nThis will revoke access to the wedding event.`
    );
    if (!step1Confirmed) return;

    // Confirmation Step 2: Final Warning Confirmation
    const step2Confirmed = window.confirm(
      `🚨 FINAL WARNING (CONFIRMATION 2 OF 2):\nTHIS ACTION IS PERMANENT & CANNOT BE UNDONE!\n\nAre you 100% SURE you want to PERMANENTLY DELETE wedding event "${title}"? All invitations, media assets, and wishes for this wedding will be erased.`
    );
    if (!step2Confirmed) return;

    try {
      const res = await fetch(`/api/admin/events?eventId=${encodeURIComponent(eventId)}`, {
        method: 'DELETE',
        headers: getAdminAuthHeaders(),
      });

      if (res.ok) {
        setEvents((prev) => prev.filter((ev) => ev.id !== eventId && ev.slug !== eventId));
        if (selectedEvent && (selectedEvent.id === eventId || selectedEvent.slug === eventId)) {
          setSelectedEvent(null);
        }
      } else {
        const data = await res.json();
        alert(`Failed to delete event: ${data.error || 'Server error'}`);
      }
    } catch (err) {
      console.error('Failed to delete event:', err);
      alert('A network error occurred while deleting the wedding event.');
    }
  };

  // Delete User Handler
  const handleDeleteUser = async (userId: string, email: string) => {
    if (!confirm(`Are you sure you want to permanently delete user account "${email}"?`)) return;

    try {
      const res = await fetch(`/api/admin/users?userId=${encodeURIComponent(userId)}`, {
        method: 'DELETE',
        headers: getAdminAuthHeaders(),
      });

      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
      }
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  // Delete Organizer Agency Handler (Asks twice for safety)
  const handleDeleteOrganizer = async (org: UserData) => {
    const companyName = getOrganizerCompanyName(org);

    // Confirmation Step 1: First Confirmation
    const step1Confirmed = window.confirm(
      `⚠️ CONFIRMATION 1 OF 2:\nAre you sure you want to delete organizer agency "${companyName}" (${org.email})?`
    );
    if (!step1Confirmed) return;

    // Confirmation Step 2: Final Warning Confirmation
    const step2Confirmed = window.confirm(
      `🚨 FINAL WARNING (CONFIRMATION 2 OF 2):\nTHIS ACTION IS PERMANENT & CANNOT BE UNDONE!\n\nAre you 100% SURE you want to PERMANENTLY DELETE organizer "${companyName}"? All associated agency portal access will be revoked.`
    );
    if (!step2Confirmed) return;

    try {
      const res = await fetch(`/api/admin/users?userId=${encodeURIComponent(org.id)}`, {
        method: 'DELETE',
        headers: getAdminAuthHeaders(),
      });

      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== org.id));
      } else {
        const data = await res.json();
        alert(`Failed to delete organizer: ${data.error || 'Server error'}`);
      }
    } catch (err) {
      console.error('Failed to delete organizer:', err);
      alert('A network error occurred while deleting the organizer agency.');
    }
  };

  // Toggle Live Broadcast Stream State
  const handleToggleLiveStream = async (eventId: string, currentIsLive: boolean) => {
    const nextIsLive = !currentIsLive;
    try {
      const res = await fetch('/api/admin/events', {
        method: 'PATCH',
        headers: getAdminAuthHeaders(),
        body: JSON.stringify({ eventId, isLive: nextIsLive, status: nextIsLive ? 'LIVE' : 'COMING_SOON' }),
      });

      if (res.ok) {
        setEvents((prev) =>
          prev.map((e) => (e.id === eventId ? { ...e, isLive: nextIsLive, status: nextIsLive ? 'LIVE' : 'COMING_SOON' } : e))
        );
        if (selectedEvent && selectedEvent.id === eventId) {
          setSelectedEvent((prev) => prev ? { ...prev, isLive: nextIsLive, status: nextIsLive ? 'LIVE' : 'COMING_SOON' } : null);
        }
      }
    } catch (err) {
      console.error('Failed to toggle live stream:', err);
    }
  };

  // Direct Admin Creation of a Wedding
  const handleCreateWeddingEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrideName || !newGroomName || !newVenueName || !newCoupleEmail) return;

    setCreatingEvent(true);
    const cleanSlug = `${newBrideName.toLowerCase().replace(/[^a-z0-9]/g, '')}-and-${newGroomName.toLowerCase().replace(/[^a-z0-9]/g, '')}-${new Date(newEventDate).getFullYear()}`;

    try {
      const res = await fetch('/api/admin/events', {
        method: 'POST',
        headers: getAdminAuthHeaders(),
        body: JSON.stringify({
          title: `${newBrideName} & ${newGroomName}'s Royal Wedding`,
          slug: cleanSlug,
          brideName: newBrideName,
          groomName: newGroomName,
          eventDate: newEventDate,
          venueName: newVenueName,
          venueAddress: newVenueAddress,
          coupleEmail: newCoupleEmail,
          expectedGuests: Number(newExpectedGuests),
          managedBy: 'ADMIN',
        }),
      });

      const data = await res.json();
      if (res.ok && data.event) {
        setEvents((prev) => [data.event, ...prev]);
        setSelectedEvent(data.event);

        const adminUrl = data.adminControlUrl || `/org-${cleanSlug}/${cleanSlug}`;
        setCreatedAdminControlUrl(adminUrl);

        // Also refresh data
        fetchAdminData();

        setNewBrideName('');
        setNewGroomName('');
        setNewVenueName('');
        setNewCoupleEmail('');
        setNewExpectedGuests(300);
      }
    } catch (err) {
      console.error('Failed to create wedding:', err);
    } finally {
      setCreatingEvent(false);
    }
  };

  // Create New Verified Event Organizer Agency
  const handleCreateOrganizerAgency = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrgErrorMsg('');
    setOrgSuccessMsg('');

    if (!orgAgencyName.trim() || !orgContactEmail.trim()) {
      setOrgErrorMsg('Please fill in all required fields (Agency Name, Contact Email).');
      return;
    }

    setCreatingOrg(true);
    try {
      const effectivePassword = orgPassword.trim() || `org${Math.floor(1000 + Math.random() * 9000)}`;

      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: getAdminAuthHeaders(),
        body: JSON.stringify({
          fullName: orgAgencyName.trim(),
          companyName: orgAgencyName.trim(),
          description: orgCompanyDesc.trim(),
          email: orgContactEmail.trim(),
          password: effectivePassword,
          role: 'EVENT_ORGANIZER',
        }),
      });

      const data = await res.json();
      if (res.ok && data.user) {
        const createdUser: UserData = {
          id: data.user.id,
          email: data.user.email,
          fullName: orgAgencyName.trim(),
          companyName: orgAgencyName.trim(),
          description: orgCompanyDesc.trim() || `Official certified event management partner (${orgAgencyName.trim()}).`,
          role: 'EVENT_ORGANIZER',
          temporaryPassword: effectivePassword,
        };

        setUsers((prev) => [createdUser, ...prev]);

        const orgIdVal = data.user.organizerId || `org-${data.user.id}`;
        const dedicatedLink = `/organizer/dashboard?id=${encodeURIComponent(orgIdVal)}`;

        setOrgSuccessMsg(`Agency "${orgAgencyName.trim()}" onboarded successfully! Dedicated Dashboard Link: ${dedicatedLink}`);
        setOrgAgencyName('');
        setOrgContactEmail('');
        setOrgCompanyDesc('');
      } else {
        setOrgErrorMsg(data.error || 'Failed to onboard agency partner.');
      }
    } catch (err) {
      console.error('Failed to onboard organizer:', err);
      setOrgErrorMsg('A network error occurred while connecting to the server.');
    } finally {
      setCreatingOrg(false);
    }
  };

  // Password Reset Handler
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resettingUser || !newPasswordVal) return;

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: getAdminAuthHeaders(),
        body: JSON.stringify({ userId: resettingUser.id, newPassword: newPasswordVal }),
      });

      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === resettingUser.id ? { ...u, temporaryPassword: newPasswordVal } : u))
        );
        setResettingUser(null);
        setNewPasswordVal('');
      }
    } catch (err) {
      console.error('Failed to reset password:', err);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 3000);
  };

  const toggleShowPassword = (key: string) => {
    setShowPasswords((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Metric Computations
  const pendingApprovals = events.filter((e) => e.adminApprovalStatus === 'PENDING');
  const activeHosting = events.filter((e) => e.status !== 'COMPLETED' && e.status !== 'ARCHIVED' && e.adminApprovalStatus === 'APPROVED');
  const hostedArchives = events.filter((e) => e.status === 'COMPLETED' || e.status === 'ARCHIVED');
  const organizerUsers = users.filter((u) => u.role && u.role.toUpperCase() === 'EVENT_ORGANIZER');

  // Filtered Fleet
  const filteredEvents = events.filter((evt) => {
    const query = (searchFleetQuery || '').toLowerCase();
    const matchesSearch = (evt.title || '').toLowerCase().includes(query) ||
                          (evt.venueName || '').toLowerCase().includes(query) ||
                          (evt.brideName || '').toLowerCase().includes(query) ||
                          (evt.groomName || '').toLowerCase().includes(query);
    if (!matchesSearch) return false;
    if (fleetFilter === 'ALL') return true;
    if (fleetFilter === 'ACTIVE') return evt.status !== 'COMPLETED' && evt.status !== 'ARCHIVED' && evt.adminApprovalStatus === 'APPROVED';
    if (fleetFilter === 'ARCHIVE') return evt.status === 'COMPLETED' || evt.status === 'ARCHIVED';
    if (fleetFilter === 'PENDING') return evt.adminApprovalStatus === 'PENDING';
    return true;
  });

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const query = (userSearchQuery || '').toLowerCase();
    const matchesSearch = (u.fullName || '').toLowerCase().includes(query) ||
                          (u.email || '').toLowerCase().includes(query);
    if (!matchesSearch) return false;
    if (userRoleFilter === 'ALL') return true;
    return u.role === userRoleFilter;
  });

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-white text-gray-900 flex font-sans selection:bg-gold-500 selection:text-black">
      
      {/* =========================================================================
          1. SYSTEM ADMIN EXECUTIVE SIDEBAR
         ========================================================================= */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-gray-950 text-white flex flex-col justify-between border-r border-gold-500/30 transition-transform duration-300 ease-in-out
        md:translate-x-0 ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-gold-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="/branding/artboard-13.png"
                  alt="Agafari (አጋፋሪ) Logo"
                  className="h-10 w-auto object-contain"
                />
                <div>
                  <h2 className="font-serif font-bold text-base text-gold-400 tracking-wide">
                    {t('adminDashboard.brand')}
                  </h2>
                  <span className="text-[10px] text-gold-500/80 font-semibold uppercase tracking-widest block">
                    {t('adminDashboard.subtitle')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="md:hidden p-1 text-white/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-black/20 border border-white/5">
                <div className="text-amber-300 font-bold text-base">{pendingApprovals.length}</div>
                <div className="text-white/70 text-[10px]">{t('adminDashboard.kpiPending')}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-black/20 border border-white/5">
                <div className="text-emerald-400 font-bold text-base">{activeHosting.length}</div>
                <div className="text-white/70 text-[10px]">{t('adminDashboard.kpiActive')}</div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 text-xs font-semibold">
            
            {/* 1. Licensing & Approvals */}
            <button
              onClick={() => { setActiveTab('APPROVALS'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                activeTab === 'APPROVALS'
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-black font-bold shadow-md'
                  : 'text-white/80 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-gold-400" />
                <span>{t('adminDashboard.tabs.approvals')}</span>
              </div>
              {pendingApprovals.length > 0 ? (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 font-bold animate-pulse">
                  {pendingApprovals.length}
                </span>
              ) : (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/40 text-gold-300 font-bold">
                  0
                </span>
              )}
            </button>

            {/* 2. Global Weddings Fleet & Role Command */}
            <button
              onClick={() => { setActiveTab('EVENTS'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                activeTab === 'EVENTS'
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-black font-bold shadow-md'
                  : 'text-white/80 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Layers className="w-4 h-4 text-gold-400" />
                <span>{t('adminDashboard.tabs.events')}</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/40 text-gold-300 font-bold">
                {events.length}
              </span>
            </button>

            {/* 3. Event Organizing Agencies */}
            <button
              onClick={() => { setActiveTab('ORGANIZERS'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                activeTab === 'ORGANIZERS'
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-black font-bold shadow-md'
                  : 'text-white/80 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Building2 className="w-4 h-4 text-gold-400" />
                <span>{t('adminDashboard.tabs.organizers')}</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/40 text-gold-300 font-bold">
                {organizerUsers.length}
              </span>
            </button>

            {/* 4. Platform Users & RBAC */}
            <button
              onClick={() => { setActiveTab('USERS'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                activeTab === 'USERS'
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-black font-bold shadow-md'
                  : 'text-white/80 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-gold-400" />
                <span>{t('adminDashboard.tabs.users')}</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/40 text-gold-300 font-bold">
                {users.length}
              </span>
            </button>

            {/* 5. System Admin Credentials Panel Link */}
            <Link
              href="/system-admin"
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-gold-300 bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/30 font-bold"
            >
              <div className="flex items-center gap-3">
                <Crown className="w-4 h-4 text-gold-400" />
                <span>System Admin Control Panel</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-gold-400" />
            </Link>
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full py-2.5 px-3 rounded-xl hover:bg-rose-950/40 text-rose-300 text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('nav.signOut', 'Sign Out')}</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
        />
      )}

      {/* =========================================================================
          2. MAIN EXECUTIVE WORKSPACE
         ========================================================================= */}
      <div className="flex-1 md:pl-72 flex flex-col min-w-0">
        
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gold-500/30 px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div>
              <div className="text-[11px] text-gold-600 font-semibold uppercase tracking-wider">
                {t('adminDashboard.header.tag')}
              </div>
              <h1 className="font-serif font-bold text-lg sm:text-xl text-gray-900">
                {activeTab === 'APPROVALS' && t('adminDashboard.approvals.title')}
                {activeTab === 'EVENTS' && t('adminDashboard.fleet.title')}
                {activeTab === 'ORGANIZERS' && t('adminDashboard.agencies.title')}
                {activeTab === 'USERS' && t('adminDashboard.users.title')}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 ml-auto">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 rounded-xl bg-black hover:bg-gray-800 text-gold-400 text-xs font-bold shadow-md transition-all flex items-center gap-1.5 border border-gold-500/40"
            >
              <Plus className="w-3.5 h-3.5 text-gold-400" />
              <span className="hidden sm:inline">{t('adminDashboard.header.createBtn')}</span>
            </button>

            <LanguageSwitcher />
          </div>
        </header>

        {/* Workspace Main Area */}
        <main className="p-6 max-w-7xl w-full mx-auto space-y-6">
          
          {/* =========================================================================
              TAB 1: LICENSING & APPROVALS PIPELINE
             ========================================================================= */}
          {activeTab === 'APPROVALS' && (
            <div className="space-y-6">
              
              {/* Header Box */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gold-500/30 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                  <div>
                    <h2 className="font-serif font-bold text-xl text-gray-900 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-gold-500" />
                      {t('adminDashboard.approvals.title')} ({pendingApprovals.length})
                    </h2>
                    <p className="text-xs text-gray-500 font-light mt-0.5">
                      {t('adminDashboard.approvals.subtitle')}
                    </p>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-700" />
                    {pendingApprovals.length} Awaiting Verification
                  </span>
                </div>

                {pendingApprovals.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 text-xs">
                    🎉 All wedding onboarding requests have been reviewed and approved!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {pendingApprovals.map((evt) => (
                      <div
                        key={evt.id}
                        className="p-5 rounded-2xl border-[1.5px] border-amber-300 bg-amber-50/40 flex flex-col justify-between space-y-4 shadow-sm"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2 flex-wrap gap-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-950 text-[10px] font-bold">
                                🟡 Pending Review
                              </span>
                              {evt.isIndividual ? (
                                <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 text-[10px] font-bold border border-purple-200">
                                  👤 Individual Event
                                </span>
                              ) : (
                                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 text-[10px] font-bold border border-blue-200 flex items-center gap-1">
                                  <Building2 className="w-3 h-3 text-blue-700" />
                                  {evt.organizerName || 'Organizer Agency'}
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] font-mono text-gray-500 font-bold">
                              {new Date(evt.eventDate).toLocaleDateString()}
                            </span>
                          </div>

                          <h3 className="font-serif font-bold text-base text-gray-900">
                            {evt.brideName} & {evt.groomName}
                          </h3>
                          <div className="text-xs text-gray-500 flex items-center gap-1.5 mt-1">
                            <MapPin className="w-3.5 h-3.5 text-gold-500" />
                            <span>{evt.venueName}</span>
                          </div>

                          <div className="mt-3 p-3 rounded-xl bg-white border border-amber-200 text-xs space-y-1">
                            <div className="flex justify-between">
                              <span className="text-gray-500 text-[11px]">Event Host / Company:</span>
                              <span className="font-mono font-bold text-gray-900 text-[11px]">
                                {evt.isIndividual ? '👤 Individual Event (Direct)' : `🏢 ${evt.organizerName || 'Organizer Agency'}`}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500 text-[11px]">Couple Email:</span>
                              <span className="font-mono font-bold text-gray-900">
                                {evt.coupleCredentials?.email || `couple@${evt.slug}.com`}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500 text-[11px]">Proposed Slug:</span>
                              <span className="font-mono text-gray-900 text-[11px]">/event/{evt.slug}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 pt-2 border-t border-amber-200">
                          <button
                            onClick={() => handleApproveEventRequest(evt.id)}
                            className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4 text-white" />
                            <span>Accept & Approve Request ✓</span>
                          </button>

                          <button
                            onClick={() => handleRejectEventRequest(evt.id)}
                            className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                            title="Reject Request"
                          >
                            <XCircle className="w-4 h-4 text-white" />
                            <span>Reject ✗</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Approved & Active Licenses Grid (2nd Image Card Style) */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gold-500/30 shadow-sm space-y-4">
                <h3 className="font-serif font-bold text-lg text-gray-900">
                  {t('adminDashboard.approvals.approvedTableTitle')} ({events.filter((e) => e.adminApprovalStatus === 'APPROVED').length})
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {events.filter((e) => e.adminApprovalStatus === 'APPROVED').length === 0 ? (
                    <div className="md:col-span-2 p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-300 text-gray-500 text-xs">
                      No active wedding platform licenses found. Create or approve your first wedding event to get started!
                    </div>
                  ) : (
                    events.filter((e) => e.adminApprovalStatus === 'APPROVED').map((evt) => {
                      const rawOrgId = (evt as any).organizerId || (evt as any).organizer_id || `org-${evt.slug}`;
                      const cleanOrgId = String(rawOrgId).startsWith('org-') ? String(rawOrgId) : `org-${String(rawOrgId)}`;
                      const dedicatedUrl = `/${cleanOrgId}/${evt.slug}`;

                      const coupleEmail = evt.credentials?.couple?.email || evt.coupleCredentials?.email || `couple@${evt.slug}.com`;

                      return (
                        <div
                          key={evt.id}
                          className="p-5 rounded-2xl border border-gold-500/30 bg-gray-50/50 flex flex-col justify-between space-y-3 shadow-sm hover:shadow-md transition-all"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3.5">
                              <div className="w-12 h-12 rounded-2xl bg-black text-gold-400 flex items-center justify-center font-bold text-lg shadow-sm shrink-0 border border-gold-500/30">
                                <Crown className="w-6 h-6 text-gold-400" />
                              </div>
                              <div>
                                <div className="font-serif font-bold text-gray-900 text-sm">{evt.title}</div>
                                <div className="text-xs text-gray-500 font-mono">{coupleEmail}</div>
                                <div className="text-[10px] text-gold-600 font-mono font-bold mt-0.5 flex items-center gap-2 flex-wrap">
                                  <span>Wedding ID: <span className="bg-gold-500/20 px-2 py-0.5 rounded text-black">evt-{evt.slug}</span></span>
                                  {evt.isIndividual ? (
                                    <span className="bg-purple-100 text-purple-900 px-2 py-0.5 rounded font-sans text-[10px] font-bold border border-purple-200">
                                      👤 Individual Event
                                    </span>
                                  ) : (
                                    <span className="bg-blue-100 text-blue-900 px-2 py-0.5 rounded font-sans text-[10px] font-bold border border-blue-200 flex items-center gap-1">
                                      <Building2 className="w-3 h-3 text-blue-700" /> {evt.organizerName || 'Organizer Agency'}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                              ✓ Certified License
                            </span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-white border border-gray-200 text-xs font-mono text-gray-600 flex items-center justify-between">
                            <span className="truncate text-[11px]">{dedicatedUrl}</span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(`${window.location.origin}${dedicatedUrl}`);
                                setCopiedKey(`approved-${evt.id}`);
                                setTimeout(() => setCopiedKey(''), 2500);
                              }}
                              className="px-2.5 py-1 rounded bg-black text-gold-400 text-[10px] font-bold hover:bg-gray-800 shrink-0 ml-2"
                            >
                              {copiedKey === `approved-${evt.id}` ? 'Copied ✓' : 'Copy Link'}
                            </button>
                          </div>

                          <div className="pt-2 border-t border-gray-200 flex items-center justify-between gap-2">
                            <button
                              onClick={(e) => handleDeleteEvent(e, evt.id, evt.title)}
                              className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all flex items-center gap-1.5 border border-rose-200 cursor-pointer shadow-sm"
                              title="Delete Wedding Event (Asks twice)"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                              <span>Delete Event</span>
                            </button>

                            <Link
                              href={dedicatedUrl}
                              className="px-4 py-2 rounded-xl bg-black hover:bg-gray-800 text-gold-400 text-xs font-bold flex items-center gap-1.5 shadow-sm border border-gold-500/30"
                            >
                              <span>Open Dedicated Dashboard</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

            </div>
          )}

          {/* =========================================================================
              TAB 2: GLOBAL WEDDINGS FLEET & 1-CLICK ROLE COMMAND (PILLAR 2)
             ========================================================================= */}
          {activeTab === 'EVENTS' && (
            <div className="space-y-6">
              
              {/* Filter Pills & Search */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-gold-500/30 shadow-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setFleetFilter('ALL')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      fleetFilter === 'ALL'
                        ? 'bg-black text-gold-400 shadow-sm'
                        : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {t('organizerDashboard.fleet.all')} ({events.length})
                  </button>

                  <button
                    onClick={() => setFleetFilter('ACTIVE')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      fleetFilter === 'ACTIVE'
                        ? 'bg-emerald-800 text-white shadow-sm'
                        : 'bg-gray-50 text-emerald-900 hover:bg-emerald-50'
                    }`}
                  >
                    {t('organizerDashboard.fleet.active')} ({activeHosting.length})
                  </button>

                  <button
                    onClick={() => setFleetFilter('ARCHIVE')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      fleetFilter === 'ARCHIVE'
                        ? 'bg-blue-800 text-white shadow-sm'
                        : 'bg-gray-50 text-blue-900 hover:bg-blue-50'
                    }`}
                  >
                    {t('organizerDashboard.fleet.archive')} ({hostedArchives.length})
                  </button>

                  <button
                    onClick={() => setFleetFilter('PENDING')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      fleetFilter === 'PENDING'
                        ? 'bg-amber-800 text-white shadow-sm'
                        : 'bg-gray-50 text-amber-900 hover:bg-amber-50'
                    }`}
                  >
                    {t('organizerDashboard.fleet.pending')} ({pendingApprovals.length})
                  </button>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchFleetQuery}
                    onChange={(e) => setSearchFleetQuery(e.target.value)}
                    placeholder={t('organizerDashboard.fleet.searchPlaceholder')}
                    className="pl-8 pr-4 py-1.5 rounded-xl border border-gold-500/30 text-xs text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>
              </div>

              {/* Fleet Cards Grid */}
              {filteredEvents.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-white border border-gold-500/30 shadow-sm space-y-4">
                  <Crown className="w-12 h-12 text-gold-500 mx-auto" />
                  <h3 className="font-serif font-bold text-xl text-gray-900">System Super Admin Command Center</h3>
                  <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
                    Zero active weddings currently in database. Everything starts from here! Onboard an Event Organizer Agency or directly create and license your first wedding.
                  </p>
                  <button onClick={() => setShowCreateModal(true)} className="px-6 py-3 rounded-xl bg-black text-gold-400 font-bold text-xs shadow-md">
                    Direct Create & License First Wedding Event 💍
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map((evt) => {
                    const isSelected = selectedEvent?.id === evt.id;
                    const isArchive = evt.status === 'COMPLETED' || evt.status === 'ARCHIVED';

                    return (
                      <div
                        key={evt.id}
                        onClick={() => setSelectedEvent(evt)}
                        className={`
                          rounded-3xl p-5 border cursor-pointer transition-all flex flex-col justify-between relative overflow-hidden bg-white
                          ${isSelected ? 'border-gold-500 ring-2 ring-gold-500/50 shadow-lg' : 'border-gold-500/30 hover:border-gold-500 shadow-sm'}
                        `}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {evt.adminApprovalStatus === 'PENDING' ? (
                                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                                  🟡 Pending Admin
                                </span>
                              ) : isArchive ? (
                                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[10px] font-bold">
                                  📜 Hosted Archive
                                </span>
                              ) : evt.isLive ? (
                                <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-900 text-[10px] font-bold animate-pulse">
                                  🔴 LIVE NOW
                                </span>
                              ) : (
                                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                                  🟢 Active Instance
                                </span>
                              )}

                              {evt.isIndividual ? (
                                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 text-[10px] font-bold border border-purple-200">
                                  👤 Individual Event
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 text-[10px] font-bold border border-blue-200 flex items-center gap-1">
                                  <Building2 className="w-3 h-3 text-blue-700" />
                                  {evt.organizerName || 'Organizer Agency'}
                                </span>
                              )}
                            </div>

                            <span className="text-[10px] font-mono text-gray-500 font-bold">
                              {new Date(evt.eventDate).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="h-32 rounded-2xl overflow-hidden mb-3 relative bg-black/10">
                            {evt.coverImageUrl ? (
                              <img
                                src={evt.coverImageUrl}
                                alt={evt.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-black text-gold-400 font-serif font-bold border border-gold-500/30">
                                {evt.brideName} & {evt.groomName}
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3 text-white">
                              <div>
                                <div className="font-serif font-bold text-sm">{evt.brideName} & {evt.groomName}</div>
                                <div className="text-[10px] text-gold-400 flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-gold-400" /> {evt.venueName}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-bold">
                          <span className="text-gray-900">
                            {isSelected ? '✓ Selected in Command Room' : 'Click to Inspect Roles'}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => handleDeleteEvent(e, evt.id, evt.title)}
                              className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                              title="Delete Wedding Event (Asks twice)"
                            >
                              <Trash2 className="w-3 h-3 text-rose-600" />
                              <span>Delete</span>
                            </button>
                            <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'rotate-90 text-gold-500' : 'text-gray-400'}`} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}


            </div>
          )}

          {/* =========================================================================
              TAB 3: EVENT ORGANIZING AGENCY PARTNERS
             ========================================================================= */}
          {activeTab === 'ORGANIZERS' && (
            <div className="space-y-6">
              
              {/* Form to Onboard New Agency */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gold-500/30 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
                  <div>
                    <h2 className="font-serif font-bold text-xl text-gray-900 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-gold-500" />
                      {t('adminDashboard.agencies.title')}
                    </h2>
                    <p className="text-xs text-gray-500 font-light mt-0.5">
                      {t('adminDashboard.agencies.subtitle')}
                    </p>
                  </div>
                </div>

                {orgErrorMsg && (
                  <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-950 text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    <span>{orgErrorMsg}</span>
                  </div>
                )}

                {orgSuccessMsg && (
                  <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>{orgSuccessMsg}</span>
                  </div>
                )}

                <form onSubmit={handleCreateOrganizerAgency} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-900 mb-1">
                      {t('adminDashboard.agencies.agencyName')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={orgAgencyName}
                      onChange={(e) => setOrgAgencyName(e.target.value)}
                      placeholder="e.g. Kana Events Production"
                      className="w-full px-4 py-2.5 rounded-xl border border-gold-500/30 bg-gray-50 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-900 mb-1">
                      Company Description / Specialty
                    </label>
                    <input
                      type="text"
                      value={orgCompanyDesc}
                      onChange={(e) => setOrgCompanyDesc(e.target.value)}
                      placeholder="e.g. Luxury Wedding Planner & Production Studio"
                      className="w-full px-4 py-2.5 rounded-xl border border-gold-500/30 bg-gray-50 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-900 mb-1">
                      {t('adminDashboard.agencies.contactEmail')} *
                    </label>
                    <input
                      type="email"
                      required
                      value={orgContactEmail}
                      onChange={(e) => setOrgContactEmail(e.target.value)}
                      placeholder="agency@kanaevents.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-gold-500/30 bg-gray-50 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-900 mb-1">
                      {t('adminDashboard.agencies.password')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={orgPassword}
                      onChange={(e) => setOrgPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gold-500/30 bg-gray-50 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-4 flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={creatingOrg}
                      className="px-8 py-3.5 rounded-xl bg-black hover:bg-gray-800 text-gold-400 font-bold text-xs shadow-md transition-all flex items-center gap-2 border border-gold-500/40 cursor-pointer"
                    >
                      <UserPlus className="w-4 h-4 text-gold-400" />
                      <span>{creatingOrg ? t('common.loading') : t('adminDashboard.agencies.onboardBtn')}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Agency List */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gold-500/30 shadow-sm space-y-4">
                <h3 className="font-serif font-bold text-lg text-gray-900">
                  {t('adminDashboard.agencies.listTitle')} ({organizerUsers.length})
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {organizerUsers.length === 0 ? (
                    <div className="md:col-span-2 p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-300 text-gray-500 text-xs">
                      No Event Organizers created yet. Use the form above to onboard your first Event Organizer partner!
                    </div>
                  ) : (
                    organizerUsers.map((org) => {
                      const specificOrgId = org.id.startsWith('org-') ? org.id : `org-${org.id}`;
                      const specificOrgUrl = `/organizer/dashboard?id=${encodeURIComponent(specificOrgId)}`;
                      const companyName = getOrganizerCompanyName(org);
                      const companyDesc = getOrganizerDescription(org);

                      return (
                        <div
                          key={org.id}
                          className="p-5 rounded-2xl border border-gold-500/30 bg-gray-50/50 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-all"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3.5">
                              <div className="w-12 h-12 rounded-2xl bg-black text-gold-400 flex items-center justify-center font-bold text-lg shadow-sm shrink-0 border border-gold-500/30 mt-0.5">
                                <Briefcase className="w-6 h-6 text-gold-400" />
                              </div>
                              <div>
                                <h4 className="font-serif font-bold text-gray-900 text-base leading-snug">
                                  {companyName}
                                </h4>
                                <div className="text-xs text-gray-500 font-mono mt-0.5">{org.email}</div>
                                <div className="text-[10px] text-gold-700 font-bold mt-1">
                                  Organizer Name: <span className="bg-gold-500/20 px-2 py-0.5 rounded text-black font-semibold">{org.fullName && !org.fullName.includes('@') ? org.fullName : companyName}</span>
                                </div>
                              </div>
                            </div>

                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold shrink-0">
                              ✓ Certified
                            </span>
                          </div>

                          {/* Company Description Box */}
                          <div className="p-3.5 rounded-xl bg-white border border-gold-500/20 text-xs text-gray-700 space-y-1">
                            <div className="font-bold text-[11px] text-gold-700 flex items-center gap-1.5 uppercase tracking-wider">
                              <Building2 className="w-3.5 h-3.5 text-gold-600" />
                              <span>Company Profile & Description</span>
                            </div>
                            <p className="text-[11px] text-gray-600 leading-relaxed font-light">
                              {companyDesc}
                            </p>
                          </div>

                          <div className="p-2.5 rounded-xl bg-white border border-gray-200 text-xs font-mono text-gray-600 flex items-center justify-between">
                            <span className="truncate text-[11px]">{specificOrgUrl}</span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(`${window.location.origin}${specificOrgUrl}`);
                                setCopiedKey(`org-${org.id}`);
                                setTimeout(() => setCopiedKey(''), 2500);
                              }}
                              className="px-2.5 py-1 rounded bg-black text-gold-400 text-[10px] font-bold hover:bg-gray-800 shrink-0 ml-2 cursor-pointer"
                            >
                              {copiedKey === `org-${org.id}` ? 'Copied ✓' : 'Copy Link'}
                            </button>
                          </div>

                          <div className="pt-2 border-t border-gray-200 flex items-center justify-between gap-2">
                            <button
                              onClick={() => handleDeleteOrganizer(org)}
                              className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all flex items-center gap-1.5 border border-rose-200 cursor-pointer shadow-sm"
                              title="Delete Organizer Agency (Asks twice)"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                              <span>Delete Agency</span>
                            </button>

                            <Link
                              href={specificOrgUrl}
                              className="px-4 py-2 rounded-xl bg-black hover:bg-gray-800 text-gold-400 text-xs font-bold flex items-center gap-1.5 shadow-sm border border-gold-500/30"
                            >
                              <span>Open Dedicated Dashboard</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

            </div>
          )}

          {/* =========================================================================
              TAB 4: PLATFORM USERS & RBAC DIRECTORY
             ========================================================================= */}
          {activeTab === 'USERS' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gold-500/30 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                <div>
                  <h2 className="font-serif font-bold text-xl text-gray-900">
                    {t('adminDashboard.users.title')} ({users.length})
                  </h2>
                  <p className="text-xs text-gray-500 font-light mt-0.5">
                    {t('adminDashboard.users.subtitle')}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={userSearchQuery}
                      onChange={(e) => setUserSearchQuery(e.target.value)}
                      placeholder={t('common.search')}
                      className="pl-8 pr-3 py-1.5 rounded-xl border border-gold-500/30 text-xs text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>

                  <select
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-gold-500/30 text-xs text-gray-900 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-gold-500"
                  >
                    <option value="ALL">All Roles</option>
                    <option value="SYSTEM_ADMIN">👑 System Admins</option>
                    <option value="EVENT_ORGANIZER">👔 Event Organizers</option>
                    <option value="BRIDE_GROOM">💍 Bride & Groom</option>
                    <option value="LIVE_STREAMER">📹 Live Streamers</option>
                    <option value="GATE_SCANNER">📱 Gate Scanners</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 text-[10px] text-gray-500 font-bold uppercase tracking-wider bg-gray-50">
                      <th className="py-3 px-4 rounded-l-xl">User / Organization</th>
                      <th className="py-3 px-4">Email Address</th>
                      <th className="py-3 px-4">System Role</th>
                      <th className="py-3 px-4">Account ID</th>
                      <th className="py-3 px-4">Active Password</th>
                      <th className="py-3 px-4 text-right rounded-r-xl">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-gray-500 text-xs">
                          No registered platform users found matching your search.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => {
                        const nameVal = u.fullName || (u as any).full_name || u.email.split('@')[0];
                        const roleVal = u.role || (u as any).role || 'GUEST';
                        return (
                          <tr key={u.id} className="hover:bg-gray-50/80 transition-colors">
                            <td className="py-3.5 px-4 font-serif font-bold text-gray-900">
                              {nameVal}
                            </td>
                            <td className="py-3.5 px-4 font-mono text-gray-600">
                              {u.email}
                            </td>
                            <td className="py-3.5 px-4">
                              {roleVal === 'SYSTEM_ADMIN' && (
                                <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 text-[10px] font-bold">
                                  👑 Master Admin
                                </span>
                              )}
                              {roleVal === 'EVENT_ORGANIZER' && (
                                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 text-[10px] font-bold">
                                  👔 Event Organizer
                                </span>
                              )}
                              {roleVal === 'BRIDE_GROOM' && (
                                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                                  💍 Bride & Groom
                                </span>
                              )}
                              {roleVal === 'LIVE_STREAMER' && (
                                <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-900 text-[10px] font-bold">
                                  📹 Live Streamer
                                </span>
                              )}
                              {roleVal === 'GATE_SCANNER' && (
                                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                                  📱 Gate Scanner
                                </span>
                              )}
                              {roleVal === 'GUEST' && (
                                <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800 text-[10px] font-bold">
                                  👥 Guest User
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 font-mono text-[10px] text-gray-500">
                              {u.id}
                            </td>
                            <td className="py-3.5 px-4 font-mono text-[11px] text-gray-900 font-bold">
                              {u.temporaryPassword || '••••••••'}
                            </td>
                            <td className="py-3.5 px-4 text-right flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setResettingUser(u);
                                  setNewPasswordVal('newpass123');
                                }}
                                className="px-3 py-1 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-900 text-[11px] font-bold shadow-sm"
                              >
                                {t('adminDashboard.users.resetPassword')}
                              </button>

                              <button
                                onClick={() => roleVal === 'EVENT_ORGANIZER' ? handleDeleteOrganizer(u) : handleDeleteUser(u.id, u.email)}
                                className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs transition-colors cursor-pointer"
                                title={roleVal === 'EVENT_ORGANIZER' ? 'Delete Organizer Agency (Asks twice)' : 'Delete User Account'}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* =========================================================================
          MODAL 1: DIRECT CREATE & LICENSE WEDDING
         ========================================================================= */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border-2 border-gold-500 relative shadow-2xl space-y-4">
              <button
                onClick={() => setShowCreateModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-900"
              >
                ✕
              </button>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-black text-gold-400 flex items-center justify-center border border-gold-500/30">
                  <Crown className="w-4 h-4 text-gold-400" />
                </div>
                <h3 className="font-serif font-bold text-xl text-gray-900">
                  {t('adminDashboard.header.createBtn')}
                </h3>
              </div>

              {createdAdminControlUrl ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 space-y-2 text-xs">
                    <div className="flex items-center gap-2 font-bold text-sm text-emerald-900">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>Individual Wedding Event Provisioned & Licensed!</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed font-sans">
                      The System Admin Control Room and Couple Access have been provisioned under the System Admin dashboard URL path:
                    </p>

                    <div className="p-3 rounded-xl bg-white border border-emerald-200 font-mono space-y-1.5 text-[11px] text-gray-900">
                      <div>Couple Portal URL: <strong className="text-gold-600 font-bold">{createdAdminControlUrl.replace('/admin/event/', '/event/')}/couple</strong></div>
                      <div>System Admin URL: <strong className="text-gray-900">{createdAdminControlUrl}</strong></div>
                      <div>Couple Login Email: <strong className="text-gray-900">{newCoupleEmail || 'couple@agafari.com'}</strong></div>
                      <div>Couple Password: <strong className="text-gray-900">agafari2026</strong></div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}${createdAdminControlUrl.replace('/admin/event/', '/event/')}/couple`);
                        setCopiedKey('modal-admin-url');
                        setTimeout(() => setCopiedKey(''), 2500);
                      }}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold text-xs border border-gray-300 shadow-sm"
                    >
                      {copiedKey === 'modal-admin-url' ? 'Copied ✓' : 'Copy Couple Suite URL'}
                    </button>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Link
                        href={`${createdAdminControlUrl.replace('/admin/event/', '/event/')}/couple`}
                        onClick={() => {
                          setShowCreateModal(false);
                          setCreatedAdminControlUrl(null);
                        }}
                        className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-extrabold text-xs shadow-md flex items-center justify-center gap-1.5"
                      >
                        <span>🚀 Launch Couple Suite</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>

                      <Link
                        href={createdAdminControlUrl}
                        onClick={() => {
                          setShowCreateModal(false);
                          setCreatedAdminControlUrl(null);
                        }}
                        className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-black hover:bg-gray-800 text-gold-400 font-bold text-xs border border-gold-500/30 shadow-md flex items-center justify-center gap-1.5"
                      >
                        <span>👑 Enter Admin Control Room</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleCreateWeddingEvent} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-900 mb-1">{t('coupleDashboard.setup.brideName')}</label>
                      <input
                        type="text"
                        required
                        value={newBrideName}
                        onChange={(e) => setNewBrideName(e.target.value)}
                        placeholder="Sara Tadesse"
                        className="w-full px-3 py-2 rounded-xl border border-gold-500/30 bg-gray-50 text-xs focus:outline-none focus:ring-2 focus:ring-gold-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-900 mb-1">{t('coupleDashboard.setup.groomName')}</label>
                      <input
                        type="text"
                        required
                        value={newGroomName}
                        onChange={(e) => setNewGroomName(e.target.value)}
                        placeholder="Dawit Alemayehu"
                        className="w-full px-3 py-2 rounded-xl border border-gold-500/30 bg-gray-50 text-xs focus:outline-none focus:ring-2 focus:ring-gold-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-900 mb-1">{t('coupleDashboard.setup.eventDate')}</label>
                      <input
                        type="date"
                        required
                        value={newEventDate}
                        onChange={(e) => setNewEventDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gold-500/30 bg-gray-50 text-xs focus:outline-none focus:ring-2 focus:ring-gold-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-900 mb-1">{t('organizerDashboard.credentials.email')}</label>
                      <input
                        type="email"
                        required
                        value={newCoupleEmail}
                        onChange={(e) => setNewCoupleEmail(e.target.value)}
                        placeholder="couple@sara-dawit.com"
                        className="w-full px-3 py-2 rounded-xl border border-gold-500/30 bg-gray-50 text-xs focus:outline-none focus:ring-2 focus:ring-gold-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-900 mb-1">{t('coupleDashboard.setup.venueName')}</label>
                    <input
                      type="text"
                      required
                      value={newVenueName}
                      onChange={(e) => setNewVenueName(e.target.value)}
                      placeholder="Sheraton Addis Luxury Ballroom"
                      className="w-full px-3 py-2 rounded-xl border border-gold-500/30 bg-gray-50 text-xs focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-900 mb-1">
                      Permitted Guest Limit / Quota (Max Guests) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="50000"
                      value={newExpectedGuests}
                      onChange={(e) => {
                        const val = e.target.value;
                        setNewExpectedGuests(val === '' ? '' : Number(val));
                      }}
                      onBlur={() => {
                        if (newExpectedGuests === '' || Number(newExpectedGuests) < 1) {
                          setNewExpectedGuests(1);
                        }
                      }}
                      placeholder="e.g. 300"
                      className="w-full px-3 py-2 rounded-xl border border-gold-500/30 bg-gray-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-gold-50 border border-gold-300 text-[11px] text-gray-800">
                    ℹ️ <strong>System Admin Control:</strong> Creating an individual wedding provisions a dedicated Wedding Control Suite URL (<code className="font-mono font-bold text-gold-700">/[organizerSlug]/[slug]</code>) so you can directly manage all event features.
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateModal(false);
                        setCreatedOrgCreds(null);
                      }}
                      className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50"
                    >
                      {t('common.cancel')}
                    </button>
                    <button
                      type="submit"
                      disabled={creatingEvent}
                      className="px-6 py-2 rounded-xl bg-black hover:bg-gray-800 text-gold-400 text-xs font-bold shadow-md border border-gold-500/30"
                    >
                      {creatingEvent ? t('common.loading') : 'Create & License Wedding 💍'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          MODAL 2: RESET PASSWORD MODAL
         ========================================================================= */}
      <AnimatePresence>
        {resettingUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <div className="w-full max-w-sm bg-white rounded-3xl p-6 border-2 border-gold-500 relative shadow-2xl space-y-4">
              <button
                onClick={() => setResettingUser(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-900"
              >
                ✕
              </button>

              <h3 className="font-serif font-bold text-lg text-gray-900">
                {t('adminDashboard.users.resetPassword')} for {resettingUser.fullName}
              </h3>
              <p className="text-xs text-gray-500">
                Account: <strong>{resettingUser.email}</strong>
              </p>

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-900 mb-1">
                    {t('adminDashboard.users.newPassword')}
                  </label>
                  <input
                    type="text"
                    required
                    value={newPasswordVal}
                    onChange={(e) => setNewPasswordVal(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gold-500/30 text-xs focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setResettingUser(null)}
                    className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-black text-gold-400 text-xs font-bold shadow-md border border-gold-500/30"
                  >
                    {t('adminDashboard.users.updatePasswordBtn')}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Mobile Bottom Ball Navigation Menu (Replacing Hamburger Button) */}
      <nav aria-label="Mobile Navigation" className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-black/90 backdrop-blur-xl border-2 border-gold-500/50 rounded-full px-5 py-2.5 flex items-center gap-3.5 shadow-2xl ring-2 ring-gold-500/20">
        <button
          onClick={() => setActiveTab('APPROVALS')}
          className={`p-3 rounded-full transition-all flex items-center justify-center relative ${
            activeTab === 'APPROVALS'
              ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-black shadow-lg scale-110'
              : 'text-gold-400/80 hover:text-gold-400 hover:bg-white/10'
          }`}
          title={t('adminDashboard.tabs.approvals')}
        >
          <ShieldCheck className="w-5 h-5" />
          {pendingApprovals.length > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('EVENTS')}
          className={`p-3 rounded-full transition-all flex items-center justify-center ${
            activeTab === 'EVENTS'
              ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-black shadow-lg scale-110'
              : 'text-gold-400/80 hover:text-gold-400 hover:bg-white/10'
          }`}
          title={t('adminDashboard.tabs.fleet')}
        >
          <Layers className="w-5 h-5" />
        </button>

        <button
          onClick={() => setActiveTab('ORGANIZERS')}
          className={`p-3 rounded-full transition-all flex items-center justify-center ${
            activeTab === 'ORGANIZERS'
              ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-black shadow-lg scale-110'
              : 'text-gold-400/80 hover:text-gold-400 hover:bg-white/10'
          }`}
          title={t('adminDashboard.tabs.agencies')}
        >
          <Briefcase className="w-5 h-5" />
        </button>

        <button
          onClick={() => setActiveTab('USERS')}
          className={`p-3 rounded-full transition-all flex items-center justify-center ${
            activeTab === 'USERS'
              ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-black shadow-lg scale-110'
              : 'text-gold-400/80 hover:text-gold-400 hover:bg-white/10'
          }`}
          title={t('adminDashboard.tabs.users')}
        >
          <Users className="w-5 h-5" />
        </button>

        <Link
          href="/admin/login"
          className="p-3 rounded-full text-rose-400/90 hover:text-rose-400 hover:bg-rose-950/40 transition-all flex items-center justify-center"
          title={t('nav.signOut')}
        >
          <LogOut className="w-5 h-5" />
        </Link>
      </nav>

    </div>
  );
}
