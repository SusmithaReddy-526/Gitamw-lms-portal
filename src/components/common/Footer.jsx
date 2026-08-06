import React from 'react';
import { GraduationCap, ShieldCheck, Cpu, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 mt-20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg font-outfit">GITAMW AUTONOMOUS</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Official Digital Learning & Curriculum Management System. Powered by interactive vector diagrams, faculty PDF material uploads, offline access, and exam revision guides.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Protected Portal v2.4</span>
            </div>
          </div>

          <div>
            <h5 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Academic Branches</h5>
            <ul className="space-y-2 text-xs">
              <li>Computer Science & Engineering</li>
              <li>Artificial Intelligence & Machine Learning</li>
              <li>Electronics & Communication</li>
              <li>Electrical & Electronics</li>
              <li>Mechanical & Civil Engineering</li>
            </ul>
          </div>

          <div>
            <h5 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Curriculum Resources</h5>
            <ul className="space-y-2 text-xs">
              <li>Vector Flowcharts & Memory Maps</li>
              <li>Faculty PDF Document Downloads</li>
              <li>Interactive Practice Quizzes</li>
              <li>Offline Study Guide Exporter</li>
            </ul>
          </div>

          <div>
            <h5 className="text-sm font-bold text-white uppercase tracking-wider mb-4">University Portal</h5>
            <p className="text-xs text-slate-400 mb-3">
              Office of Academic Technology & Curriculum Digitization.
            </p>
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs">
              <div className="flex items-center gap-2 text-slate-300 font-semibold mb-1">
                <Cpu className="w-4 h-4 text-brand-400" />
                <span>Portal System Status</span>
              </div>
              <span className="text-[11px] text-emerald-400 font-mono">● All Systems Operational</span>
            </div>
          </div>

        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 GITAMW Autonomous Learning Management System. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for Next-Gen University Education
          </p>
        </div>
      </div>
    </footer>
  );
}
