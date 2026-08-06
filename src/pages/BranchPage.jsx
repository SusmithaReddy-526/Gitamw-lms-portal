import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { dbService } from '../services/dbService';
import { ArrowLeft, BookOpen, Layers, ArrowRight, Download, FileText, CheckCircle2 } from 'lucide-react';

export function BranchPage({ selectedYear, selectedBranch, onSelectUnitTopic, onBack }) {
  const subjects = dbService.getSubjectsForBranchAndYear(selectedYear, selectedBranch);

  const [selectedSubject, setSelectedSubject] = useState(null);

  return (
    <div className="space-y-8 pb-12">
      {/* Navigation & Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            if (selectedSubject) {
              setSelectedSubject(null);
            } else {
              onBack();
            }
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl glass-card text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {selectedSubject ? 'Back to Subject Cards' : 'Back to Branches'}
        </button>

        <span className="px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase">
          {selectedYear} Year • {selectedBranch} {selectedSubject ? `• ${selectedSubject.subjectCode}` : ''}
        </span>
      </div>

      {!selectedSubject ? (
        /* STEP 1: SUBJECT CARDS GRID */
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white font-outfit">
              Select Course Subject ({selectedYear} Year {selectedBranch})
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Click any subject card below to view its 5 Units and access Faculty PDF Documents.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((sub) => (
              <motion.div
                key={sub.subjectCode}
                whileHover={{ y: -6, scale: 1.02 }}
                onClick={() => setSelectedSubject(sub)}
                className="p-7 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 hover:border-brand-500 shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full text-[11px] font-mono font-extrabold uppercase bg-brand-500/10 text-brand-500 border border-brand-500/20">
                      {sub.subjectCode}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-500">
                      {sub.units?.length || 5} Units
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 font-outfit group-hover:text-brand-500 transition-colors">
                    {sub.subjectName}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                    JNTUA Autonomous Syllabus & Faculty Reference Material.
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-brand-500 group-hover:translate-x-1 transition-transform">
                  <span>Open 5 Units & Materials</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </motion.div>
            ))}

            {subjects.length === 0 && (
              <div className="col-span-full p-10 rounded-3xl glass-card text-center space-y-3">
                <BookOpen className="w-12 h-12 text-brand-500 mx-auto opacity-40" />
                <h4 className="font-bold text-slate-900 dark:text-white">No Subjects Uploaded Yet</h4>
                <p className="text-xs text-slate-500">Faculty can upload syllabus files for this branch from the Faculty Portal.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* STEP 2: 5 UNITS GRID FOR SELECTED SUBJECT */
        <div className="space-y-6">
          <div className="p-8 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="px-3 py-1 rounded-full bg-brand-500/10 text-brand-500 text-xs font-bold font-mono">
              {selectedSubject.subjectCode}
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white font-outfit">
              {selectedSubject.subjectName}
            </h2>
            <p className="text-xs text-slate-500">
              Select any Unit below to view and download faculty uploaded PDF reference files.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedSubject.units?.map((unit, index) => (
              <motion.div
                key={unit.unitId}
                whileHover={{ y: -6, scale: 1.02 }}
                className="p-6 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 hover:border-brand-500 transition-all cursor-pointer flex flex-col justify-between"
                onClick={() => onSelectUnitTopic(selectedSubject, unit)}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 font-bold flex items-center justify-center text-sm">
                      U{index + 1}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300">
                      PDF Materials
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2 font-outfit">
                    {unit.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4 line-clamp-2">
                    {unit.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-brand-500">
                  <span>View PDF Documents</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
