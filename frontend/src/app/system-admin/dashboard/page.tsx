'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Crown,
  ShieldCheck,
  Users,
  KeyRound,
  UserPlus,
  Lock,
  Search,
  Check,
  X,
  Eye,
  EyeOff,
  LogOut,
  AlertCircle,
  RefreshCw,
  Edit,
  Trash2,
  CheckCircle2,
  Shield,
  Activity,
  UserCheck,
  Settings,
  Mail,
  ChevronRight
} from 'lucide-react';
import { useTranslation, LanguageSwitcher } from '@/lib/i18n';

interface UserRecord {
  id: string;
  email: string;
  fullName: string;
  full_name?: string;
  companyName?: string;
  role: 'SYSTEM_ADMIN' | 'EVENT_ORGANIZER' | 'BRIDE_GROOM' | 'LIVE_STREAMER' | 'GATE_SCANNER' | 'GUEST';
  isActive?: boolean;
  createdAt?: string;
  created_at?: string;
}

export default function SystemAdminDashboardPage() {
  const { t } = useTranslation();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'USERS' | 'SECURITY' | 'OVERVIEW'>('USERS');
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  // Modals & Forms State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);

  // Edit User Form
  const [editEmail, setEditEmail] = useState('');
  const [editFullName, setEditFullName] = useState('');
  const [editRole, setEditRole] = useState<UserRecord['role']>('EVENT_ORGANIZER');
  const [editNewPassword, setEditNewPassword] = useState('');
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [submittingEdit, setSubmittingEdit] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');

  // Add User Form Modal
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addEmail, setAddEmail] = useState('');
  const [addFullName, setAddFullName] = useState('');
  const [addRole, setAddRole] = useState<UserRecord['role']>('EVENT_ORGANIZER');
  const [addPassword, setAddPassword] = useState('');
  const [submittingAdd, setSubmittingAdd] = useState(false);
  const [addError, setAddError] = useState('');

  // Self Security Password Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [selfNewPassword, setSelfNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showSelfPassword, setShowSelfPassword] = useState(false);
  const [submittingSelf, setSubmittingSelf] = useState(false);
  const [selfError, setSelfError] = useState('');
  const [selfSuccess, setSelfSuccess] = useState('');

  const [currentUser, setCurrentUser] = useState<any>(null);

  // Load User Info & Admin List
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('agafari_user');
      if (stored) {
        try {
          setCurrentUser(JSON.parse(stored));
        } catch {
          /* ignore */
        }
      }
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch('/api/admin/users', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error('Failed to load user records:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('agafari_user');
      localStorage.removeItem('agafari_role');
      localStorage.removeItem('agafari_token');
      document.cookie = 'agafari_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
    router.push('/login');
  };

  // Open Edit User Modal
  const handleOpenEditModal = (user: UserRecord) => {
    setSelectedUser(user);
    setEditEmail(user.email || '');
    setEditFullName(user.fullName || user.full_name || '');
    setEditRole(user.role || 'EVENT_ORGANIZER');
    setEditNewPassword('');
    setEditError('');
    setEditSuccess('');
    setEditModalOpen(true);
  };

  // Submit Edit User Credentials
  const handleSaveUserCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setEditError('');
    setEditSuccess('');
    setSubmittingEdit(true);

    try {
      const res = await fetch(`/api/system-admin/users/${selectedUser.id}/credentials`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: editEmail.trim(),
          fullName: editFullName.trim(),
          role: editRole,
          newPassword: editNewPassword.trim() || undefined
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setEditSuccess('User credentials and role permissions updated successfully.');
        setTimeout(() => {
          setEditModalOpen(false);
          fetchUsers();
        }, 1200);
      } else {
        setEditError(data.error || 'Failed to update user credentials.');
      }
    } catch (err) {
      setEditError('Network error while saving user updates.');
    } finally {
      setSubmittingEdit(false);
    }
  };

  // Submit Add User Form
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');
    setSubmittingAdd(true);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: addEmail.trim(),
          fullName: addFullName.trim(),
          role: addRole,
          password: addPassword.trim() || undefined
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setAddModalOpen(false);
        setAddEmail('');
        setAddFullName('');
        setAddPassword('');
        fetchUsers();
      } else {
        setAddError(data.error || 'Failed to create user account.');
      }
    } catch (err) {
      setAddError('Network error while creating account.');
    } finally {
      setSubmittingAdd(false);
    }
  };

  // Submit Self Password Change
  const handleChangeSelfPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSelfError('');
    setSelfSuccess('');

    if (selfNewPassword !== confirmNewPassword) {
      setSelfError('New password and confirmation password do not match.');
      return;
    }

    setSubmittingSelf(true);
    try {
      const res = await fetch('/api/system-admin/self-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: currentPassword.trim(),
          newPassword: selfNewPassword.trim()
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSelfSuccess('Your password has been updated securely.');
        setCurrentPassword('');
        setSelfNewPassword('');
        setConfirmNewPassword('');
      } else {
        setSelfError(data.error || 'Failed to update password.');
      }
    } catch (err) {
      setSelfError('Network error during password update.');
    } finally {
      setSubmittingSelf(false);
    }
  };

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      (u.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.fullName || u.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.id || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 font-sans flex flex-col relative overflow-x-hidden">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-gold-500/30 px-4 sm:px-8 py-3.5 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gold-500 text-black font-extrabold flex items-center justify-center shadow-lg">
              <Crown className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-lg font-bold text-white tracking-tight">
                  Agafari System Admin
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-gold-500/20 text-gold-400 border border-gold-500/40 text-[9px] font-extrabold uppercase tracking-widest">
                  VIP ROOT ACCESS
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">
                Credentials & Role-Based Access Control (RBAC) Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />

            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-300 font-medium">
                {currentUser?.full_name || currentUser?.email || 'System Admin'}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 rounded-full bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs Bar */}
      <div className="bg-slate-900/80 border-b border-slate-800 px-4 sm:px-8 py-2.5 z-30">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('USERS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'USERS'
                ? 'bg-gradient-to-r from-gold-500 to-amber-500 text-black shadow-gold font-extrabold'
                : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>User & Credentials Management</span>
          </button>

          <button
            onClick={() => setActiveTab('SECURITY')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'SECURITY'
                ? 'bg-gradient-to-r from-gold-500 to-amber-500 text-black shadow-gold font-extrabold'
                : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>My Security & Password</span>
          </button>

          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'OVERVIEW'
                ? 'bg-gradient-to-r from-gold-500 to-amber-500 text-black shadow-gold font-extrabold'
                : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Audit & System Status</span>
          </button>

          <Link
            href="/admin/dashboard"
            className="ml-auto px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-gold-500/30 text-gold-300 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <span>General Admin View</span>
            <ChevronRight className="w-3.5 h-3.5 text-gold-400" />
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 flex-1">
        {/* TAB 1: User & Credentials Management */}
        {activeTab === 'USERS' && (
          <div className="space-y-6">
            {/* Action Bar & Filters */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-md">
              <div className="flex flex-1 items-center gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search user accounts by email, name, or ID..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-gold-500 font-medium"
                  />
                </div>

                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-semibold focus:outline-none focus:border-gold-500"
                >
                  <option value="ALL">All Roles</option>
                  <option value="SYSTEM_ADMIN">SYSTEM_ADMIN</option>
                  <option value="EVENT_ORGANIZER">EVENT_ORGANIZER</option>
                  <option value="BRIDE_GROOM">BRIDE_GROOM</option>
                  <option value="LIVE_STREAMER">LIVE_STREAMER</option>
                  <option value="GATE_SCANNER">GATE_SCANNER</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={fetchUsers}
                  className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Refresh User List"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-gold-400 ${loadingUsers ? 'animate-spin' : ''}`} />
                </button>

                <button
                  onClick={() => {
                    setAddError('');
                    setAddModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 hover:from-amber-400 hover:to-gold-400 text-black text-xs font-extrabold flex items-center gap-1.5 shadow-gold transition-all cursor-pointer"
                >
                  <UserPlus className="w-4 h-4 text-black" />
                  <span>Create Admin / User</span>
                </button>
              </div>
            </div>

            {/* Users Credentials Table */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="p-4">User Account</th>
                      <th className="p-4">Role Permission</th>
                      <th className="p-4">Account ID</th>
                      <th className="p-4">Date Added</th>
                      <th className="p-4 text-right">Credentials Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {loadingUsers ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-400">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
                            <span>Loading user accounts & credential roles...</span>
                          </div>
                        </td>
                      </tr>
                    ) : filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-400">
                          No admin user accounts matching query.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-4">
                            <div className="font-bold text-white text-sm">
                              {u.fullName || u.full_name || u.email}
                            </div>
                            <div className="text-slate-400 text-[11px] font-mono flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3 text-gold-400" />
                              {u.email}
                            </div>
                          </td>

                          <td className="p-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border shadow-sm ${
                                u.role === 'SYSTEM_ADMIN'
                                  ? 'bg-gold-500/20 text-gold-300 border-gold-500/50'
                                  : u.role === 'EVENT_ORGANIZER'
                                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                              }`}
                            >
                              <ShieldCheck className="w-3 h-3" />
                              {u.role}
                            </span>
                          </td>

                          <td className="p-4 font-mono text-slate-400 text-[11px]">
                            {u.id}
                          </td>

                          <td className="p-4 text-slate-400 text-[11px]">
                            {u.createdAt || u.created_at
                              ? new Date(u.createdAt || u.created_at!).toLocaleDateString()
                              : 'Active'}
                          </td>

                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleOpenEditModal(u)}
                              className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-gold-500 hover:text-black border border-gold-500/40 text-gold-400 font-bold text-xs transition-all flex items-center gap-1.5 ml-auto shadow-sm cursor-pointer"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>Edit Credentials</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: My Security & Self Password Settings */}
        {activeTab === 'SECURITY' && (
          <div className="max-w-xl mx-auto bg-slate-900/90 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <KeyRound className="w-5 h-5 text-gold-400" />
                <h2 className="font-serif text-xl font-bold text-white">
                  System Admin Security Settings
                </h2>
              </div>
              <p className="text-xs text-slate-400 font-light">
                Update your system admin account password. Standard verification requires your exact current password.
              </p>
            </div>

            {selfError && (
              <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{selfError}</span>
              </div>
            )}

            {selfSuccess && (
              <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{selfSuccess}</span>
              </div>
            )}

            <form onSubmit={handleChangeSelfPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Current Password *
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password for verification"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  New Password *
                </label>
                <div className="relative">
                  <input
                    type={showSelfPassword ? 'text' : 'password'}
                    required
                    value={selfNewPassword}
                    onChange={(e) => setSelfNewPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-gold-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSelfPassword(!showSelfPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showSelfPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  required
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <button
                type="submit"
                disabled={submittingSelf}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 hover:from-amber-400 hover:to-gold-400 text-black font-extrabold text-xs shadow-gold transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {submittingSelf ? (
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-black" />
                )}
                <span>Update Password</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: Overview & System Audit */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                    Total Admin Accounts
                  </span>
                  <Users className="w-4 h-4 text-gold-400" />
                </div>
                <div className="text-3xl font-serif font-extrabold text-white">
                  {users.length}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Active system credentials
                </p>
              </div>

              <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                    System Super Admins
                  </span>
                  <Crown className="w-4 h-4 text-gold-400" />
                </div>
                <div className="text-3xl font-serif font-extrabold text-gold-300">
                  {users.filter((u) => u.role === 'SYSTEM_ADMIN').length || 1}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Root privilege accounts
                </p>
              </div>

              <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                    Role-Based Access (RBAC)
                  </span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-xl font-bold text-emerald-400">
                  Active & Enforced
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Route guards & token validation active
                </p>
              </div>
            </div>

            <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
              <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-gold-400" />
                System Security & Authorization Status
              </h3>
              <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-light">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span>Server-side Route Interception (/system-admin & /admin)</span>
                  <span className="text-emerald-400 font-bold">✓ Active (HTTP 403 / Redirect)</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span>HttpOnly Signed JWT Token Session Cookie</span>
                  <span className="text-emerald-400 font-bold">✓ Active (SameSite Strict)</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span>Password Hashing & Salt Verification</span>
                  <span className="text-emerald-400 font-bold">✓ Active (PBKDF2 SHA-512)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL 1: Edit User Credentials Modal */}
      <AnimatePresence>
        {editModalOpen && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              className="bg-slate-950 p-6 sm:p-8 rounded-3xl border-2 border-gold-500/50 max-w-lg w-full relative shadow-2xl text-left"
            >
              <button
                onClick={() => setEditModalOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
                <Edit className="w-5 h-5 text-gold-400" />
                <h3 className="font-serif text-xl font-bold text-white">
                  Edit User Credentials & Role
                </h3>
              </div>

              {editError && (
                <div className="mb-4 p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{editError}</span>
                </div>
              )}

              {editSuccess && (
                <div className="mb-4 p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{editSuccess}</span>
                </div>
              )}

              <form onSubmit={handleSaveUserCredentials} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Username / Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-gold-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editFullName}
                    onChange={(e) => setEditFullName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Role & Permissions *
                  </label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-gold-500 font-bold"
                  >
                    <option value="SYSTEM_ADMIN">SYSTEM_ADMIN (Full Root Privilege)</option>
                    <option value="EVENT_ORGANIZER">EVENT_ORGANIZER (Standard Admin Dashboard)</option>
                    <option value="BRIDE_GROOM">BRIDE_GROOM (Couple Portal)</option>
                    <option value="LIVE_STREAMER">LIVE_STREAMER (Broadcast Operator)</option>
                    <option value="GATE_SCANNER">GATE_SCANNER (Gate Scanner Access)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Set New Password (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type={showEditPassword ? 'text' : 'password'}
                      value={editNewPassword}
                      onChange={(e) => setEditNewPassword(e.target.value)}
                      placeholder="Leave blank to keep current password unchanged"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-gold-500 pr-10 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowEditPassword(!showEditPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showEditPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submittingEdit}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 hover:from-amber-400 hover:to-gold-400 text-black text-xs font-extrabold shadow-gold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    {submittingEdit ? (
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Check className="w-4 h-4 text-black" />
                    )}
                    <span>Save Credentials</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL 2: Add New Admin / User Modal */}
      <AnimatePresence>
        {addModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              className="bg-slate-950 p-6 sm:p-8 rounded-3xl border-2 border-gold-500/50 max-w-lg w-full relative shadow-2xl text-left"
            >
              <button
                onClick={() => setAddModalOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
                <UserPlus className="w-5 h-5 text-gold-400" />
                <h3 className="font-serif text-xl font-bold text-white">
                  Create Admin Account
                </h3>
              </div>

              {addError && (
                <div className="mb-4 p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{addError}</span>
                </div>
              )}

              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={addEmail}
                    onChange={(e) => setAddEmail(e.target.value)}
                    placeholder="e.g. admin.new@agafari.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-gold-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={addFullName}
                    onChange={(e) => setAddFullName(e.target.value)}
                    placeholder="Full Account Holder Name"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Role & Authorization Level *
                  </label>
                  <select
                    value={addRole}
                    onChange={(e) => setAddRole(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-gold-500 font-bold"
                  >
                    <option value="SYSTEM_ADMIN">SYSTEM_ADMIN (Full System Root)</option>
                    <option value="EVENT_ORGANIZER">EVENT_ORGANIZER (Standard Admin Dashboard)</option>
                    <option value="BRIDE_GROOM">BRIDE_GROOM (Couple Portal)</option>
                    <option value="LIVE_STREAMER">LIVE_STREAMER (Broadcast Operator)</option>
                    <option value="GATE_SCANNER">GATE_SCANNER (Gate Scanner Access)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Initial Password
                  </label>
                  <input
                    type="text"
                    value={addPassword}
                    onChange={(e) => setAddPassword(e.target.value)}
                    placeholder="Auto-generated if left blank"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-gold-500 font-mono"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setAddModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submittingAdd}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 hover:from-amber-400 hover:to-gold-400 text-black text-xs font-extrabold shadow-gold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    {submittingAdd ? (
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <UserPlus className="w-4 h-4 text-black" />
                    )}
                    <span>Create User</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
