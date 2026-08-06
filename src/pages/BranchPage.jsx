import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { dbService } from '../services/dbService';
import { ArrowLeft, BookOpen, Layers, ArrowRight, Sparkles } from 'lucide-react';

export function BranchPage({ selectedYear, selectedBranch, onSelectUnitTopic, onBack }) {
  const subjects = dbService.getSubjectsForBranchAndYear(selectedYear, selectedBranch);

  const [activeSubjectId, setActiveSubjectId] = useState(() => {
    return subjects.length > 0 ? subjects[0].subjectId : null;
  });

  const activeSubject = subjects.find(s => s.subjectId === activeSubjectId) || subjects[0];

  return (
    <div className="space-y-8 pb-12">
      {/* Back & Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl glass-card text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Branches
        </button>

        <span className="px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase">
          {selectedYear} Year • {selectedBranch}
        </span>
      </div>

      <div className="space-y-2">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white font-outfit">
          Curriculum & Unit Portal
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Select a subject to open Unit-1 through Unit-5 and access complete AI generated study notes.
        </p>
      </div>

      {/* Subject Tabs */}
      {subjects.length > 0 ? (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {subjects.map(sub => (
            <button
              key={sub.subjectId}
              onClick={() => setActiveSubjectId(sub.subjectId)}
              className={`px-5 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeSubject?.subjectId === sub.subjectId
                  ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg shadow-brand-500/20'
                  : 'glass-card text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              {sub.subjectName} ({sub.subjectCode})
            </button>
          ))}
        </div>
      ) : (
        <div className="p-8 rounded-2xl glass-card text-center space-y-3">
          <BookOpen className="w-10 h-10 text-brand-500 mx-auto opacity-40" />
          <h4 className="font-bold text-slate-900 dark:text-white">No Subjects Uploaded Yet</h4>
          <p className="text-xs text-slate-500">Faculty can upload syllabus files for this branch from the Faculty Portal.</p>
        </div>
      )}

      {/* Active Subject Unit Cards */}
      {activeSubject && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white font-outfit">
                {activeSubject.subjectName}
              </h3>
              <p className="text-xs text-slate-500">Code: {activeSubject.subjectCode} • Units Available: {activeSubject.units?.length || 0}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeSubject.units?.map((unit, index) => (
              <motion.div
                key={unit.unitId}
                whileHover={{ y: -6, scale: 1.02 }}
                className="p-6 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 hover:border-brand-400 transition-all cursor-pointer flex flex-col justify-between"
                onClick={() => onSelectUnitTopic(activeSubject, unit)}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 font-bold flex items-center justify-center text-sm">
                      U{index + 1}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400">
                      {unit.topics?.length || 0} Topics
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2 font-outfit">
                    {unit.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                    {unit.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs font-bold pt-4 border-t border-slate-100 dark:border-slate-800 text-brand-600 dark:text-brand-400">
                  <span>Open Topics & AI Notes</span>
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
