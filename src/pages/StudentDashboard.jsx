import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { dbService, YEARS } from '../services/dbService';
import { GraduationCap, ArrowRight, Lock, Unlock, Sparkles, BookOpen, Layers, Bell } from 'lucide-react';

export function StudentDashboard({ user, onSelectYear }) {
  const [unlockAll, setUnlockAll] = useState(false);
  const notices = dbService.getNotices();

  // Student's registered year (e.g. '3rd')
  const studentYear = user?.year || '3rd';

  return (
    <div className="space-y-10 pb-12">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-brand-900 via-blue-900 to-indigo-950 text-white shadow-xl relative overflow-hidden border border-brand-500/20">
        <div className="relative z-10 max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold border border-brand-400/30">
            <GraduationCap className="w-4 h-4 text-brand-400" />
            GITAMW Autonomous Student Dashboard
          </div>
          <h1 className="text-4xl font-extrabold font-outfit tracking-tight">
            B.Tech Student Portal
          </h1>
          <p className="text-sm text-slate-300">
            Welcome back, <span className="font-bold text-white">{user?.fullName || user?.username}</span>! ({user?.branch || 'CSE'} Branch • {user?.year || '3rd'} Year • {user?.semester || 'Sem 5'})
          </p>

          <div className="pt-2 flex items-center gap-4">
            <button
              onClick={() => setUnlockAll(!unlockAll)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-2 transition-colors"
            >
              {unlockAll ? <Unlock className="w-3.5 h-3.5 text-emerald-400" /> : <Lock className="w-3.5 h-3.5 text-amber-400" />}
              {unlockAll ? 'All Years Unlocked (Admin Access)' : 'Unlock All Years'}
            </button>
          </div>
        </div>
      </div>

      {/* Campus Announcements & Circulars Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-outfit">
              Campus Announcements & Circulars
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Official university exam schedules, circulars, and academic notifications for students.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {notices.map(notice => (
            <div 
              key={notice.id} 
              className="p-6 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400">
                    {notice.category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{notice.date}</span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-base leading-snug">
                  {notice.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {notice.content}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 text-[11px] text-slate-400 flex items-center justify-between">
                <span>By: {notice.author}</span>
                <span className="text-brand-500 font-semibold">GITAMW Notice</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Year Selection Section */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-outfit">
              Select B.Tech Year
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Only your registered year ({studentYear}) is clickable by default.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {YEARS.map((yr, idx) => {
            const isStudentOwnYear = yr.id === studentYear;
            const isAccessible = isStudentOwnYear || unlockAll || user?.role === 'admin' || user?.role === 'faculty';

            return (
              <motion.div
                key={yr.id}
                whileHover={isAccessible ? { y: -8, scale: 1.02 } : {}}
                className={`p-6 rounded-2xl border transition-all flex flex-col justify-between relative overflow-hidden ${
                  isStudentOwnYear
                    ? 'glass-card border-brand-500 ring-2 ring-brand-500/40 shadow-xl'
                    : isAccessible
                    ? 'glass-card border-slate-200 dark:border-slate-800 hover:border-brand-400'
                    : 'bg-slate-100/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60 cursor-not-allowed'
                }`}
                onClick={() => {
                  if (isAccessible) onSelectYear(yr.id);
                }}
              >
                {/* Own Year Badge */}
                {isStudentOwnYear && (
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-brand-500 text-white text-[10px] font-extrabold uppercase tracking-wider shadow">
                    Your Enrolled Year
                  </div>
                )}

                {!isAccessible && (
                  <div className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                )}

                <div>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl mb-4 shadow-lg ${
                    isStudentOwnYear 
                      ? 'bg-gradient-to-tr from-brand-600 to-indigo-600 text-white shadow-brand-500/30'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                  }`}>
                    0{idx + 1}
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-outfit mb-2">
                    {yr.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                    {yr.description}
                  </p>

                  <div className="flex gap-2 mb-6">
                    {yr.sem.map(s => (
                      <span key={s} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-bold pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className={isAccessible ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'}>
                    {isAccessible ? 'Open Year Portal' : 'Locked'}
                  </span>
                  {isAccessible ? <ArrowRight className="w-4 h-4 text-brand-600 dark:text-brand-400" /> : <Lock className="w-3.5 h-3.5 text-slate-400" />}
                </div>

              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
