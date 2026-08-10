import React from 'react';
import { 
  GraduationCap, 
  UserCheck, 
  ShieldCheck, 
  Sparkles, 
  ShieldAlert, 
  ArrowRight,
  Crown,
  Award,
  Zap,
  BookOpen
} from 'lucide-react';

export function LandingPage({ onOpenAuth }) {
  return (
    <div className="py-8 space-y-12">
      {/* Exclusive Aurora Neon Hero Gateway */}
      <section className="relative overflow-hidden pt-14 pb-20 rounded-3xl aurora-glass-panel text-white px-6 sm:px-12 border border-fuchsia-500/30">
        
        {/* Dynamic Neon Background Glow Spots */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/15 rounded-full blur-[90px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-7">
          
          {/* Top Aurora Badge */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-gradient-to-r from-indigo-500/20 via-fuchsia-500/20 to-cyan-500/20 border border-fuchsia-400/40 text-fuchsia-200 text-xs font-black uppercase tracking-widest backdrop-blur-2xl shadow-xl shadow-fuchsia-500/20">
            <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>GITAMW Autonomous Next-Gen Portal</span>
            <Crown className="w-4 h-4 text-amber-300" />
          </div>

          {/* Main Title with Multi-Color Gradient */}
          <h1 className="text-4xl sm:text-6xl font-extrabold font-outfit leading-tight tracking-tight">
            GITAMW Autonomous <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-amber-300 drop-shadow-md">Academic Gateway</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Welcome to the premier digital learning management system. Select your portal role below to sign in or create your profile for immediate access to curriculum, unit notes, and academic resources.
          </p>

          {/* 3 Ultra-Vibrant Aurora Cards */}
          <div className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-7 text-left">
            
            {/* Student Login Card - Electric Indigo & Cyan */}
            <div 
              className="p-8 rounded-3xl aurora-card cursor-pointer group flex flex-col justify-between relative overflow-hidden"
              onClick={() => onOpenAuth('student')}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/25 transition-all pointer-events-none" />

              <div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-fuchsia-600 text-white flex items-center justify-center mb-6 shadow-2xl shadow-cyan-500/30 group-hover:scale-110 group-hover:rotate-2 transition-transform border border-cyan-300/40">
                  <GraduationCap className="w-8 h-8 text-cyan-200" />
                </div>
                
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 tracking-wider">
                  Student Access
                </span>
                
                <h3 className="text-2xl font-black text-white mt-3 mb-2 font-outfit group-hover:text-cyan-300 transition-colors">
                  Student Login
                </h3>
                
                <p className="text-xs text-slate-300 leading-relaxed mb-6 font-medium">
                  First-time students register with unique Roll Number to generate short username (e.g. 23CSE045).
                </p>
              </div>

              <div className="flex items-center justify-between text-xs font-black text-cyan-300 pt-4 border-t border-slate-800/90 group-hover:translate-x-1 transition-transform">
                <span>Sign In / Student Portal</span>
                <ArrowRight className="w-4 h-4 text-cyan-400" />
              </div>
            </div>

            {/* Faculty Login Card - Fuchsia & Gold */}
            <div 
              className="p-8 rounded-3xl aurora-card cursor-pointer group flex flex-col justify-between relative overflow-hidden"
              onClick={() => onOpenAuth('faculty')}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/10 rounded-full blur-2xl group-hover:bg-fuchsia-500/25 transition-all pointer-events-none" />

              <div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-fuchsia-600 via-purple-600 to-amber-500 text-white flex items-center justify-center mb-6 shadow-2xl shadow-fuchsia-600/30 group-hover:scale-110 group-hover:-rotate-2 transition-transform border border-fuchsia-300/40">
                  <UserCheck className="w-8 h-8 text-fuchsia-200" />
                </div>
                
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-400/40 tracking-wider">
                  Faculty Access
                </span>
                
                <h3 className="text-2xl font-black text-white mt-3 mb-2 font-outfit group-hover:text-fuchsia-300 transition-colors">
                  Faculty Login
                </h3>
                
                <p className="text-xs text-slate-300 leading-relaxed mb-6 font-medium">
                  Log in or register with Employee ID to upload syllabus PDF notes and reference files directly.
                </p>
              </div>

              <div className="flex items-center justify-between text-xs font-black text-fuchsia-300 pt-4 border-t border-slate-800/90 group-hover:translate-x-1 transition-transform">
                <span>Sign In / Faculty Portal</span>
                <ArrowRight className="w-4 h-4 text-fuchsia-400" />
              </div>
            </div>

            {/* Admin Login Card - Emerald & Gold */}
            <div 
              className="p-8 rounded-3xl aurora-card cursor-pointer group flex flex-col justify-between relative overflow-hidden"
              onClick={() => onOpenAuth('admin')}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/25 transition-all pointer-events-none" />

              <div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-600 to-emerald-600 text-white flex items-center justify-center mb-6 shadow-2xl shadow-amber-500/30 group-hover:scale-110 transition-transform border border-amber-300/40">
                  <ShieldCheck className="w-8 h-8 text-amber-200" />
                </div>
                
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-400/40 tracking-wider">
                  Admin Control
                </span>
                
                <h3 className="text-2xl font-black text-white mt-3 mb-2 font-outfit group-hover:text-amber-300 transition-colors">
                  Admin Login
                </h3>
                
                <p className="text-xs text-slate-300 leading-relaxed mb-6 font-medium">
                  University Admin portal to manage faculty credentials, student accounts, and notices.
                </p>
              </div>

              <div className="flex items-center justify-between text-xs font-black text-amber-300 pt-4 border-t border-slate-800/90 group-hover:translate-x-1 transition-transform">
                <span>Sign In / Admin Access</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </div>
            </div>

          </div>

          <div className="inline-flex items-center gap-2.5 text-xs text-slate-200 bg-slate-950/90 px-6 py-3 rounded-2xl border border-fuchsia-500/40 backdrop-blur-2xl shadow-xl">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Students: First-time login requires registration. Login using short username (e.g. 23CSE045) or Roll Number.</span>
          </div>

        </div>
      </section>
    </div>
  );
}
