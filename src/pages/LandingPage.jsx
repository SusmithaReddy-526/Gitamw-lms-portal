import React from 'react';
import { 
  GraduationCap, 
  UserCheck, 
  ShieldCheck, 
  Sparkles, 
  ShieldAlert, 
  ArrowRight
} from 'lucide-react';

export function LandingPage({ onOpenAuth }) {
  return (
    <div className="py-8 space-y-12">
      {/* Exclusive Gateway Hero Section with 3 Role Login Cards */}
      <section className="relative overflow-hidden pt-12 pb-16 rounded-3xl bg-gradient-to-b from-brand-950 via-navy-900 to-slate-950 text-white shadow-2xl px-6 sm:px-12 border border-brand-500/20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-indigo-500/5 to-transparent pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-400/30 text-brand-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-brand-400" />
            GITAMW Autonomous Academic Gateway
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-extrabold font-outfit leading-tight tracking-tight">
            GITAMW Autonomous Portal Login
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Please select your portal role below to log in or register. Access to academic curriculum, subjects, and study materials is granted upon successful authentication.
          </p>

          {/* 3 Portal Login Cards (Student, Faculty, Admin) */}
          <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {/* Student Login Card */}
            <div 
              className="p-6 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-brand-500/40 hover:border-brand-400 shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
              onClick={() => onOpenAuth('student')}
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center mb-4 shadow-lg shadow-brand-500/30 group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-brand-500/20 text-brand-300 border border-brand-400/30">
                  Student Portal
                </span>
                <h3 className="text-xl font-bold text-white mt-2 mb-1 font-outfit">
                  Student Login
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  First-time students register with unique Roll Number to generate short username (e.g. CSE045).
                </p>
              </div>

              <div className="flex items-center justify-between text-xs font-bold text-brand-400 pt-3 border-t border-slate-800 group-hover:translate-x-1 transition-transform">
                <span>Sign In / Register Student</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Faculty Login Card */}
            <div 
              className="p-6 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-indigo-500/40 hover:border-indigo-400 shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
              onClick={() => onOpenAuth('faculty')}
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform">
                  <UserCheck className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  Faculty Portal
                </span>
                <h3 className="text-xl font-bold text-white mt-2 mb-1 font-outfit">
                  Faculty Login
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Log in or register with Employee ID to upload syllabus PDF notes and reference files directly.
                </p>
              </div>

              <div className="flex items-center justify-between text-xs font-bold text-indigo-400 pt-3 border-t border-slate-800 group-hover:translate-x-1 transition-transform">
                <span>Sign In / Register Faculty</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Admin Login Card */}
            <div 
              className="p-6 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
              onClick={() => onOpenAuth('admin')}
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-700 to-slate-900 text-white flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-6 h-6 text-brand-400" />
                </div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                  Admin Control
                </span>
                <h3 className="text-xl font-bold text-white mt-2 mb-1 font-outfit">
                  Admin Login
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  University Admin portal to manage faculty credentials, student accounts, and notices.
                </p>
              </div>

              <div className="flex items-center justify-between text-xs font-bold text-slate-300 pt-3 border-t border-slate-800 group-hover:translate-x-1 transition-transform">
                <span>Sign In / Admin Access</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 text-xs text-slate-400 bg-slate-900/60 px-4 py-2 rounded-xl border border-slate-800">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Students: First-time login requires registration. Login using short username (e.g. CSE045) or Roll Number.</span>
          </div>

        </div>
      </section>
    </div>
  );
}
