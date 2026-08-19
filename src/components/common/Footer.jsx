import React from 'react';
import { GraduationCap, Sparkles, Globe, MapPin, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="aurora-glass-panel border-t border-fuchsia-500/20 text-slate-300 mt-20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800/80">
          
          {/* Column 1: GITAMW Autonomous & Description */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-3 text-white">
              <div className="w-10 h-10 rounded-2xl bg-white p-0.5 shadow-lg shadow-amber-500/20 border-2 border-amber-400/60 flex items-center justify-center overflow-hidden shrink-0">
                <img 
                  src={`${import.meta.env.BASE_URL}gitamw_logo.png`} 
                  alt="GITAMW Emblem" 
                  className="w-full h-full object-contain" 
                />
              </div>
              <span className="font-extrabold text-lg font-outfit text-white">
                GITAMW <span className="aurora-text">AUTONOMOUS</span>
              </span>
            </div>

            <div className="space-y-1.5 pt-1">
              <h6 className="text-[11px] font-extrabold text-cyan-300 uppercase tracking-wider font-outfit">
                Description
              </h6>
              <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
                GITAMW was established in 2009 at Proddatur to promote women’s technical education.<br />
                It is managed by the Mother Teresa Christian Minority Educational Society.<br />
                The institute has a 5.10-acre green campus with modern infrastructure.<br />
                It is affiliated with JNTUA and approved by AICTE and the AP Government.<br />
                GITAMW is NAAC B++ accredited and recognized under UGC Section 2(f)
              </p>
            </div>
          </div>

          {/* Column 2: Academic Branches */}
          <div>
            <h5 className="text-sm font-extrabold text-white uppercase tracking-wider mb-4 font-outfit flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-fuchsia-400" />
              Academic Branches
            </h5>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="hover:text-cyan-300 transition-colors font-medium">Computer Science &amp; Engineering (CSE)</li>
              <li className="hover:text-fuchsia-300 transition-colors font-medium">Artificial Intelligence &amp; Machine Learning (AIML)</li>
              <li className="hover:text-amber-300 transition-colors font-medium">Electronics &amp; Communication Engineering (ECE)</li>
              <li className="hover:text-cyan-300 transition-colors font-medium">Electrical &amp; Electronics Engineering (EEE)</li>
            </ul>
          </div>

          {/* Column 3: University Portal (JNTUA) */}
          <div>
            <h5 className="text-sm font-extrabold text-white uppercase tracking-wider mb-4 font-outfit flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-400" />
              University Portal
            </h5>
            <div className="space-y-3">
              <p className="text-xs text-slate-300 leading-relaxed">
                Official Affiliated University Examination &amp; Academic Administration Portal:
              </p>
              <a
                href="https://www.jntua.ac.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 p-3.5 rounded-2xl bg-slate-900/90 border border-cyan-500/40 text-xs font-bold text-cyan-300 hover:text-white hover:border-cyan-400 transition-all shadow-lg group"
              >
                <span>🌐 JNTUA Official Website</span>
                <ExternalLink className="w-4 h-4 text-cyan-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </a>
              <span className="block text-[11px] text-slate-400 font-mono">
                URL: https://www.jntua.ac.in/
              </span>
            </div>
          </div>

          {/* Column 4: Address & Google Maps Location */}
          <div>
            <h5 className="text-sm font-extrabold text-white uppercase tracking-wider mb-4 font-outfit flex items-center gap-2">
              <MapPin className="w-4 h-4 text-fuchsia-400" />
              Address
            </h5>
            <div className="space-y-3 text-xs text-slate-300">
              <p className="leading-relaxed font-mono text-[11px] text-slate-200 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                QG96+F5X, Jammalamadug - Proddatur Road, Sai Nagar, Peddasettypalle(V, Proddatur(M, Pedda Shettipalle, Andhra Pradesh 516361
              </p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=QG96%2BF5X%2C+Jammalamadug+-+Proddatur+Road%2C+Sai+Nagar%2C+Peddasettypalle%2C+Proddatur%2C+Andhra+Pradesh+516361"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg transition-all hover:scale-105"
              >
                <span>🗺️ View Campus Google Map</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </a>
            </div>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} GITAMW Autonomous College. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-300 font-medium">
            <span>Designed for</span>
            <span className="text-fuchsia-300 font-bold">GITAMW Autonomous Students &amp; Faculty</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
