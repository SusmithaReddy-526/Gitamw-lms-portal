import React, { useState } from 'react';
import { dbService, YEARS } from '../services/dbService';
import { GraduationCap, ArrowRight, Lock, Unlock, Sparkles, BookOpen, Layers, Bell, UserCheck, CheckCircle2, Zap } from 'lucide-react';

export function StudentDashboard({ user, onSelectYear }) {
  const [unlockAll, setUnlockAll] = useState(false);
  const notices = dbService.getNotices();
  const facultyAnnouncements = dbService.getFacultyAnnouncements().filter(a => {
    const yrMatch = a.targetYear === 'All' || !user?.year || a.targetYear.toLowerCase().includes((user?.year || '').toLowerCase());
    const brMatch = a.targetBranch === 'All' || !user?.branch || a.targetBranch.toUpperCase() === (user?.branch || '').toUpperCase();
    return yrMatch && brMatch;
  });

  // Calculate Student Attendance
  const studentAttendance = dbService.getStudentAttendance(user?.rollNumber || user?.username || '238U1A0561');
  const totalConducted = studentAttendance.reduce((acc, curr) => acc + curr.totalClasses, 0);
  const totalAttended = studentAttendance.reduce((acc, curr) => acc + curr.attendedClasses, 0);
  const overallPercentage = totalConducted > 0 ? ((totalAttended / totalConducted) * 100).toFixed(1) : 88.5;

  // Student's registered year
  const studentYear = user?.year || '';

  return (
    <div className="space-y-10 pb-12">
      {/* Aurora Banner Header */}
      <div className="p-8 rounded-3xl aurora-glass-panel text-white shadow-2xl relative overflow-hidden border border-fuchsia-500/30">
        <div className="absolute top-0 right-0 w-80 h-80 bg-fuchsia-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/20 text-cyan-200 text-xs font-black uppercase tracking-wider border border-cyan-400/40 shadow-lg shadow-cyan-500/20">
            <GraduationCap className="w-4 h-4 text-cyan-300" />
            GITAMW Autonomous Student Portal
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-black font-outfit tracking-tight">
            B.Tech Student <span className="aurora-text">Academic Dashboard</span>
          </h1>
          
          <p className="text-sm text-slate-200">
            Welcome back, <span className="font-bold text-cyan-300">{user?.fullName || user?.username}</span>! {user?.branch ? `(${user.branch} Branch • ${user.year || ''} Year)` : ''}
          </p>

          <div className="pt-2 flex items-center gap-4">
            <button
              onClick={() => setUnlockAll(!unlockAll)}
              className="px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-xs font-bold text-slate-200 border border-fuchsia-500/40 flex items-center gap-2 transition-all shadow-md"
            >
              {unlockAll ? <Unlock className="w-4 h-4 text-cyan-400" /> : <Lock className="w-4 h-4 text-amber-400" />}
              {unlockAll ? 'All Years Unlocked (Admin Mode)' : 'Unlock All Academic Years'}
            </button>
          </div>
        </div>
      </div>

      {/* ECAP Attendance Quick Overview Banner */}
      <div className="p-7 rounded-3xl aurora-card border border-cyan-500/30 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-500 text-white font-black flex items-center justify-center text-2xl shadow-xl shadow-cyan-500/30 border border-cyan-300/40">
            <UserCheck className="w-8 h-8" />
          </div>
          <div>
            {totalConducted > 0 ? (
              <div className="flex items-center gap-3">
                <span className="text-3xl font-black font-outfit text-white">
                  {overallPercentage}%
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${overallPercentage >= 75 ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40' : 'bg-amber-500/20 text-amber-300 border border-amber-400/40'}`}>
                  {overallPercentage >= 75 ? '🟢 Eligible Aggregate (>75%)' : '🟡 Attendance Shortage (<75%)'}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-white">
                  No Attendance Posted Yet
                </span>
              </div>
            )}
            <p className="text-xs text-slate-300 mt-1 font-medium">
              {totalConducted > 0 
                ? `ECAP Aggregate Attendance Statement • ${totalAttended} / ${totalConducted} Periods Attended`
                : 'Faculty will publish subject-wise attendance for your roll number from the Faculty Attendance Portal.'
              }
            </p>
          </div>
        </div>

        <div className="text-xs font-bold text-cyan-300 bg-cyan-950/60 px-4 py-2 rounded-xl border border-cyan-500/30">
          ECAP Attendance Integration System
        </div>
      </div>

      {/* Faculty Announcements & Department Guest Lectures */}
      {facultyAnnouncements.length > 0 && (
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/20 border border-amber-300/40">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-white font-outfit">
                Faculty Announcements &amp; Guest Lectures
              </h2>
              <p className="text-xs text-slate-300">
                Department workshops, guest speaker visits, and academic announcements published by Faculty.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {facultyAnnouncements.map(a => (
              <div 
                key={a.id} 
                className="p-6 rounded-3xl aurora-card border border-amber-500/30 flex flex-col justify-between space-y-4 shadow-xl"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-400/40">
                        {a.targetYear === 'All' ? 'For All Years' : `${a.targetYear} Year`}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                        {a.targetBranch === 'All' ? 'For All Branches' : a.targetBranch}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {a.publishedAt ? new Date(a.publishedAt).toLocaleDateString() : 'Active'}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    {a.speakerImage && (
                      <img
                        src={a.speakerImage}
                        alt={a.speaker}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400/50 shadow-md shrink-0"
                      />
                    )}
                    <div>
                      <h4 className="font-extrabold text-white text-base font-outfit">
                        {a.topic}
                      </h4>
                      <p className="text-xs text-amber-300 font-bold">
                        Chief Guest / Speaker: {a.speaker}
                      </p>
                    </div>
                  </div>

                  {a.description && (
                    <p className="text-xs text-slate-200 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 leading-relaxed">
                      {a.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 font-semibold flex items-center justify-between">
                  <span>Published By: {a.publishedBy}</span>
                  <span className="text-amber-400 font-bold">GITAMW Event</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Campus Announcements & Circulars Section */}
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-fuchsia-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/20 border border-amber-300/40">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white font-outfit">
              Campus Announcements & Circulars
            </h2>
            <p className="text-xs text-slate-300">
              Official university exam schedules, circulars, and academic notifications.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {notices.map(notice => (
            <div 
              key={notice.id} 
              className="p-6 rounded-3xl aurora-card flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-400/40">
                    {notice.category}
                  </span>
                  <span className="text-xs text-cyan-300 font-mono font-bold">{notice.date}</span>
                </div>
                <h4 className="font-bold text-white mb-2 text-base leading-snug font-outfit">
                  {notice.title}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  {notice.content}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between font-semibold">
                <span>By: {notice.author}</span>
                <span className="text-cyan-300 font-bold">GITAMW Notice</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Year Selection Section */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-white font-outfit">
              Select B.Tech Academic Year
            </h2>
            <p className="text-xs text-slate-300">
              Choose your enrolled year below to view Subjects and 5 Units.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {YEARS.map((yr, idx) => {
            const isStudentOwnYear = yr.id === studentYear;
            const isAccessible = true;

            return (
              <div
                key={yr.id}
                className={`p-6 rounded-3xl aurora-card cursor-pointer flex flex-col justify-between relative overflow-hidden group ${
                  isStudentOwnYear
                    ? 'ring-2 ring-fuchsia-400/60 border-fuchsia-400 shadow-2xl'
                    : ''
                }`}
                onClick={() => {
                  if (isAccessible) onSelectYear(yr.id);
                }}
              >
                {/* Own Year Badge */}
                {isStudentOwnYear && (
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-wider shadow-lg border border-fuchsia-300/40">
                    Enrolled Year
                  </div>
                )}

                <div>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl mb-4 shadow-xl border ${
                    isStudentOwnYear 
                      ? 'bg-gradient-to-tr from-cyan-500 via-indigo-600 to-fuchsia-600 text-white shadow-fuchsia-500/30 border-fuchsia-300/40'
                      : 'bg-slate-900/90 text-cyan-300 border-slate-700'
                  }`}>
                    0{idx + 1}
                  </div>

                  <h3 className="text-2xl font-black text-white font-outfit mb-2 group-hover:text-cyan-300 transition-colors">
                    {yr.title}
                  </h3>
                  <p className="text-xs text-slate-300 mb-4 leading-relaxed font-normal">
                    {yr.description}
                  </p>

                  <div className="flex gap-2 mb-6">
                    {yr.sem.map(s => (
                      <span key={s} className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-900/80 text-cyan-300 border border-slate-700">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-black pt-4 border-t border-slate-800/90 text-cyan-300 group-hover:translate-x-1 transition-transform">
                  <span>Open Year Portal</span>
                  <ArrowRight className="w-4 h-4 text-cyan-400" />
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
