'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, ArrowRight, Calendar, UserCheck } from 'lucide-react';

interface Membership {
  id: string;
  role: string;
  scope_type: string;
  scope_id: string;
}

export default function SelectAccessPage() {
  const router = useRouter();
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('agafari_memberships');
    if (raw) {
      try {
        setMemberships(JSON.parse(raw));
      } catch {}
    }
  }, []);

  const selectMembership = async (membershipId: string) => {
    setLoading(true);
    setError(null);
    try {
      const email = sessionStorage.getItem('agafari_login_email') || '';
      const password = sessionStorage.getItem('agafari_login_pass') || '';

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, membershipId }),
      });

      const data = await res.json();
      if (res.ok && data.redirectUrl) {
        sessionStorage.removeItem('agafari_login_pass');
        router.push(data.redirectUrl);
      } else {
        setError(data.error || 'Failed to select access.');
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-xl flex items-center justify-center mx-auto">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Select Access Workspace</h1>
          <p className="text-sm text-neutral-400">
            Your account possesses multiple active memberships. Choose where you want to work today:
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/50 border border-red-500/30 rounded-xl text-red-300 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-3">
          {memberships.length === 0 ? (
            <p className="text-sm text-neutral-500 text-center py-4">
              No pending memberships stored in session. Please log in again.
            </p>
          ) : (
            memberships.map((m) => (
              <button
                key={m.id}
                onClick={() => selectMembership(m.id)}
                disabled={loading}
                className="w-full flex items-center justify-between p-4 bg-neutral-800/60 hover:bg-neutral-800 border border-neutral-700/60 hover:border-amber-500/40 rounded-xl transition text-left group"
              >
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-neutral-200 group-hover:text-amber-400 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-amber-500" />
                    {m.role.replace(/_/g, ' ')}
                  </div>
                  <div className="text-xs text-neutral-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                    Scope: {m.scope_id}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-amber-400 transition transform group-hover:translate-x-0.5" />
              </button>
            ))
          )}
        </div>

        <button
          onClick={() => router.push('/login')}
          className="w-full py-2.5 text-xs font-medium text-neutral-400 hover:text-white transition"
        >
          Return to Sign In
        </button>
      </div>
    </div>
  );
}
