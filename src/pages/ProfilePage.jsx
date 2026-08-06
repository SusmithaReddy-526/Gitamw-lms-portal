import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { dbService, BRANCHES, YEARS } from '../services/dbService';
import { User, Mail, Phone, Lock, CheckCircle2, AlertCircle, KeyRound, ShieldCheck } from 'lucide-react';

export function ProfilePage() {
  const { user, updateProfile } = useAuth();
  
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [mobile, setMobile] = useState(user?.mobile || '');
  const [branch, setBranch] = useState(user?.branch || 'CSE');
  const [year, setYear] = useState(user?.year || '3rd');
  const [semester, setSemester] = useState(user?.semester || 'Sem 5');
  const [password, setPassword] = useState(user?.password || '');

  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  if (!user) {
    return (
      <div className="py-20 text-center space-y-2">
        <p className="text-slate-500 font-bold">Please log in to view and update your profile.</p>
      </div>
    );
  }

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setMsg('');
    setErr('');

    try {
      const updated = dbService.updateUserProfile(user, {
        fullName,
        email,
        mobile,
        branch,
        year,
        semester,
        password
      });

      // Update auth context state
      updateProfile(updated);
      setMsg('Account details updated successfully!');
    } catch (e) {
      setErr(e.message || 'Failed to update profile details.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Profile Header */}
      <div className="p-8 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-brand-600 via-blue-600 to-indigo-600 text-white font-extrabold text-3xl flex items-center justify-center shadow-xl shadow-brand-500/20 shrink-0">
          {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
        </div>

        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white font-outfit">
              {user.fullName || user.username}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400">
              {user.role}
            </span>
          </div>

          <p className="text-xs text-slate-500 font-mono">
            {user.role === 'student' ? `Generated Username: ${user.username}` : `Employee ID / Username: ${user.employeeId || user.username}`}
          </p>

          <p className="text-xs text-slate-400">
            Registered on GITAMW Autonomous LMS Portal
          </p>
        </div>
      </div>

      {msg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {err && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <span>{err}</span>
        </div>
      )}

      {/* Details Update Form */}
      <div className="p-8 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 space-y-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white font-outfit">
          Edit Account Details & Credentials
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-xs font-medium outline-none"
              />
            </div>

            {user.role === 'student' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                  <span>Roll Number</span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1"><Lock className="w-3 h-3" /> Locked</span>
                </label>
                <input
                  type="text"
                  disabled
                  value={user.rollNumber || '045'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-mono font-bold cursor-not-allowed"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                  <span>Employee / User ID</span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1"><Lock className="w-3 h-3" /> Locked</span>
                </label>
                <input
                  type="text"
                  disabled
                  value={user.employeeId || user.username}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-bold cursor-not-allowed"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                value={mobile}
                onChange={e => setMobile(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-xs outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Account Password *
              </label>
              <input
                type="text"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-xs font-mono outline-none"
              />
            </div>

            {user.role === 'student' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Branch
                </label>
                <select
                  value={branch}
                  onChange={e => setBranch(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none"
                >
                  {BRANCHES.map(b => (
                    <option key={b.id} value={b.id}>{b.code} - {b.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="py-3 px-8 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg transition-all"
          >
            Update Account Details
          </button>
        </form>
      </div>
    </div>
  );
}
