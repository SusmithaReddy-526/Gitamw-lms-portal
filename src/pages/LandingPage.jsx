import React from 'react';
import { 
  GraduationCap, 
  UserCheck, 
  ShieldCheck, 
  Sparkles, 
  ShieldAlert, 
  ArrowRight,
  Crown,
  Award
} from 'lucide-react';

export function LandingPage({ onOpenAuth }) {
  return (
    <div className="py-8 space-y-12">
      {/* Exclusive Royal Gateway Hero Section with 3 Role Login Cards */}
      <section className="relative overflow-hidden pt-12 pb-16 rounded-3xl bg-gradient-to-b from-[#0a0f26] via-[#0d1435] to-[#060919] text-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] px-6 sm:px-12 border border-amber-500/25">
        
        {/* Subtle Royal Radial Glow Background Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/15 via-indigo-600/10 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          
          {/* Top Royal Pill Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/15 via-indigo-500/15 to-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider backdrop-blur-xl shadow-lg shadow-amber-500/10">
            <Crown className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>GITAMW Autonomous Imperial Gateway</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>

          {/* Main Royal Title */}
          <h1 className="text-4xl sm:text-6xl font-extrabold font-outfit leading-tight tracking-tight">
            GITAMW Autonomous <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-300 drop-shadow-sm">Academic Portal</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Welcome to the official digital learning portal. Please select your portal role below to log in or register. Direct access to curriculum, notes, and study materials is granted upon authentication.
          </p>

          {/* 3 Royal Portal Login Cards (Student, Faculty, Admin) */}
          <div className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            
            {/* Student Login Card - Royal Indigo & Gold */}
            <div 
              className="p-7 rounded-3xl royal-card cursor-pointer group flex flex-col justify-between relative overflow-hidden"
              onClick={() => onOpenAuth('student')}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl group-hover:bg-indigo-500/20 transition-all pointer-events-none" />

              <div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-indigo-600 to-indigo-700 text-white flex items-center justify-center mb-5 shadow-xl shadow-indigo-600/30 group-hover:scale-110 group-hover:rotate-1 transition-transform border border-amber-400/30">
                  <GraduationCap className="w-7 h-7 text-amber-200" />
                </div>
                
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/15 text-amber-300 border border-amber-400/30 tracking-wider">
                  Student Portal
                </span>
                
                <h3 className="text-2xl font-black text-white mt-3 mb-2 font-outfit group-hover:text-amber-300 transition-colors">
                  Student Login
                </h3>
                
                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  First-time students register with unique Roll Number to generate short username (e.g. 23CSE045).
                </p>
              </div>

              <div className="flex items-center justify-between text-xs font-extrabold text-amber-300 pt-4 border-t border-slate-800/80 group-hover:translate-x-1 transition-transform">
                <span>Sign In / Student Portal</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </div>
            </div>

            {/* Faculty Login Card - Royal Purple & Gold */}
            <div 
              className="p-7 rounded-3xl royal-card cursor-pointer group flex flex-col justify-between relative overflow-hidden"
              onClick={() => onOpenAuth('faculty')}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-xl group-hover:bg-purple-500/20 transition-all pointer-events-none" />

              <div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-amber-500 text-white flex items-center justify-center mb-5 shadow-xl shadow-purple-600/30 group-hover:scale-110 group-hover:-rotate-1 transition-transform border border-amber-400/30">
                  <UserCheck className="w-7 h-7 text-amber-200" />
                </div>
                
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-purple-500/15 text-purple-300 border border-purple-400/30 tracking-wider">
                  Faculty Portal
                </span>
                
                <h3 className="text-2xl font-black text-white mt-3 mb-2 font-outfit group-hover:text-amber-300 transition-colors">
                  Faculty Login
                </h3>
                
                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  Log in or register with Employee ID to upload syllabus PDF notes and reference files directly.
                </p>
              </div>

              <div className="flex items-center justify-between text-xs font-extrabold text-purple-300 pt-4 border-t border-slate-800/80 group-hover:translate-x-1 transition-transform">
                <span>Sign In / Faculty Portal</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </div>
            </div>

            {/* Admin Login Card - Royal Dark Velvet */}
            <div 
              className="p-7 rounded-3xl royal-card cursor-pointer group flex flex-col justify-between relative overflow-hidden"
              onClick={() => onOpenAuth('admin')}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />

              <div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-800 via-indigo-950 to-slate-900 text-white flex items-center justify-center mb-5 shadow-xl group-hover:scale-110 transition-transform border border-amber-400/40">
                  <ShieldCheck className="w-7 h-7 text-amber-400" />
                </div>
                
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-slate-800 text-slate-200 border border-slate-700 tracking-wider">
                  Admin Control
                </span>
                
                <h3 className="text-2xl font-black text-white mt-3 mb-2 font-outfit group-hover:text-amber-300 transition-colors">
                  Admin Login
                </h3>
                
                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  University Admin portal to manage faculty credentials, student accounts, and notices.
                </p>
              </div>

              <div className="flex items-center justify-between text-xs font-extrabold text-slate-200 pt-4 border-t border-slate-800/80 group-hover:translate-x-1 transition-transform">
                <span>Sign In / Admin Access</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </div>
            </div>

          </div>

          <div className="inline-flex items-center gap-2 text-xs text-slate-300 bg-slate-900/80 px-5 py-2.5 rounded-2xl border border-amber-500/30 backdrop-blur-md shadow-lg">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Students: First-time login requires registration. Login using short username (e.g. 23CSE045) or Roll Number.</span>
          </div>

        </div>
      </section>
    </div>
  );
}
