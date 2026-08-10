import React from 'react';
import { GraduationCap, ShieldCheck, Cpu, Heart, Sparkles, Zap } from 'lucide-react';

export function Footer() {
  return (
    <footer className="aurora-glass-panel border-t border-fuchsia-500/20 text-slate-300 mt-20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
          
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3 text-white">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-fuchsia-600 to-amber-500 flex items-center justify-center text-white font-bold shadow-lg shadow-fuchsia-500/30 border border-fuchsia-300/40">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-lg font-outfit text-white">
                GITAMW <span className="aurora-text">AUTONOMOUS</span>
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Official Digital Learning & Curriculum Management System. Powered by interactive vector diagrams, faculty PDF material uploads, offline access, and exam revision guides.
            </p>
            <div className="flex items-center gap-2 text-xs text-cyan-300 font-semibold">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Protected Academic Portal v2.4</span>
            </div>
          </div>

          <div>
            <h5 className="text-sm font-extrabold text-white uppercase tracking-wider mb-4 font-outfit flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-fuchsia-400" />
              Academic Branches
            </h5>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="hover:text-cyan-300 transition-colors">Computer Science & Engineering (CSE)</li>
              <li className="hover:text-fuchsia-300 transition-colors">Artificial Intelligence & Machine Learning (AIML)</li>
              <li className="hover:text-amber-300 transition-colors">Electronics & Communication (ECE)</li>
              <li className="hover:text-cyan-300 transition-colors">Electrical & Electronics (EEE)</li>
              <li className="hover:text-emerald-300 transition-colors">Mechanical & Civil Engineering</li>
            </ul>
          </div>

          <div>
            <h5 className="text-sm font-extrabold text-white uppercase tracking-wider mb-4 font-outfit flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Curriculum Resources
            </h5>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="hover:text-cyan-300 transition-colors">Vector Flowcharts & Memory Maps</li>
              <li className="hover:text-fuchsia-300 transition-colors">Faculty PDF Document Downloads</li>
              <li className="hover:text-amber-300 transition-colors">Interactive Practice Quizzes</li>
              <li className="hover:text-emerald-300 transition-colors">Offline Study Guide Exporter</li>
            </ul>
          </div>

          <div>
            <h5 className="text-sm font-extrabold text-white uppercase tracking-wider mb-4 font-outfit">University Portal</h5>
            <p className="text-xs text-slate-300 mb-3">
              Office of Academic Technology & Curriculum Digitization.
            </p>
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-fuchsia-500/30 text-xs backdrop-blur-md shadow-lg">
              <div className="flex items-center gap-2 text-slate-200 font-bold mb-1">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>Portal System Status</span>
              </div>
              <span className="text-[11px] text-cyan-300 font-mono font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                All Systems Operational & Fast
              </span>
            </div>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} GITAMW Autonomous College. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-300 font-medium">
            <span>Designed for</span>
            <span className="text-fuchsia-300 font-bold">GITAMW Autonomous Students & Faculty</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
