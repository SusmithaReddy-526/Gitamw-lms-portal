import React from 'react';
import { motion } from 'framer-motion';
import { BRANCHES } from '../services/dbService';
import { Code, Cpu, Radio, Zap, Cog, Building2, Globe, ArrowRight, ArrowLeft } from 'lucide-react';

const ICON_MAP = {
  Code,
  Cpu,
  Radio,
  Zap,
  Cog,
  Building2,
  Globe
};

export function YearPage({ selectedYear, studentBranch = 'CSE', onSelectBranch, onBack }) {
  return (
    <div className="space-y-8 pb-12">
      {/* Header Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl glass-card text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <span className="px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase">
          B.Tech {selectedYear} Year
        </span>
      </div>

      <div className="space-y-2">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white font-outfit">
          Engineering Branches ({selectedYear} Year)
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Select an engineering specialization to view subject units and study notes.
        </p>
      </div>

      {/* Branch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {BRANCHES.map(branch => {
          const IconComponent = ICON_MAP[branch.icon] || Code;
          const isStudentBranch = branch.code === studentBranch;

          return (
            <motion.div
              key={branch.id}
              whileHover={{ y: -6, scale: 1.02 }}
              className={`p-6 rounded-2xl glass-card border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                isStudentBranch
                  ? 'border-brand-500 ring-2 ring-brand-500/30 shadow-xl'
                  : 'border-slate-200 dark:border-slate-800 hover:border-brand-400'
              }`}
              onClick={() => onSelectBranch(branch.id)}
            >
              {isStudentBranch && (
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-brand-500 text-white text-[10px] font-extrabold uppercase shadow">
                  Your Enrolled Branch
                </span>
              )}

              <div>
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${branch.color} text-white flex items-center justify-center mb-4 shadow-lg`}>
                  <IconComponent className="w-6 h-6" />
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 font-outfit">
                  {branch.code}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-4">
                  {branch.name}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs font-bold pt-4 border-t border-slate-100 dark:border-slate-800 text-brand-600 dark:text-brand-400">
                <span>View Subjects & Units</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
