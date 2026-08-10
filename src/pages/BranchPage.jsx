import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { dbService, BRANCHES, YEARS } from '../services/dbService';
import { ArrowLeft, BookOpen, ArrowRight, FileText, Trash2, Filter, RefreshCw } from 'lucide-react';

export function BranchPage({ selectedYear, selectedBranch, onSelectUnitTopic, onBack, user }) {
  const [activeYear, setActiveYear] = useState(selectedYear || '');
  const [activeBranch, setActiveBranch] = useState(selectedBranch || '');
  const [selectedSubject, setSelectedSubject] = useState(null);
  
  // Refreshable subjects state
  const [subjectsList, setSubjectsList] = useState(() => 
    (selectedYear && selectedBranch) ? dbService.getSubjectsForBranchAndYear(selectedYear, selectedBranch) : []
  );

  useEffect(() => {
    if (activeYear && activeBranch) {
      setSubjectsList(dbService.getSubjectsForBranchAndYear(activeYear, activeBranch));
    } else {
      setSubjectsList([]);
    }
  }, [activeYear, activeBranch]);

  const handleYearChange = (year) => {
    setActiveYear(year);
    setSelectedSubject(null);
    setSubjectsList(dbService.getSubjectsForBranchAndYear(year, activeBranch));
  };

  const handleBranchChange = (branch) => {
    setActiveBranch(branch);
    setSelectedSubject(null);
    setSubjectsList(dbService.getSubjectsForBranchAndYear(activeYear, branch));
  };

  const handleDeleteSubject = (e, subjectCode, subjectName) => {
    e.stopPropagation(); // Stop card click
    if (window.confirm(`Are you sure you want to delete "${subjectName} (${subjectCode})" from curriculum?`)) {
      dbService.deleteSubjectFromCurriculum(subjectCode);
      setSubjectsList(dbService.getSubjectsForBranchAndYear(activeYear, activeBranch));
    }
  };

  // Standard 5 Units
  const standardUnits = [
    { unitId: 'unit-1', name: 'Unit-1' },
    { unitId: 'unit-2', name: 'Unit-2' },
    { unitId: 'unit-3', name: 'Unit-3' },
    { unitId: 'unit-4', name: 'Unit-4' },
    { unitId: 'unit-5', name: 'Unit-5' }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Navigation & Control Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800">
        <button
          onClick={() => {
            if (selectedSubject) {
              setSelectedSubject(null);
            } else {
              onBack();
            }
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-card text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          {selectedSubject ? 'Back to Subject Cards' : 'Back to Dashboard'}
        </button>

        {/* Dynamic Year & Branch Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-brand-500" />
            <select
              value={activeYear}
              onChange={e => handleYearChange(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-brand-500/40 bg-brand-50/30 dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none cursor-pointer"
            >
              <option value="">-- Select Academic Year --</option>
              {YEARS.map(y => (
                <option key={y.id} value={y.id}>{y.title}</option>
              ))}
            </select>
          </div>

          <select
            value={activeBranch}
            onChange={e => handleBranchChange(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-brand-500 outline-none cursor-pointer"
          >
            {BRANCHES.map(b => (
              <option key={b.id} value={b.id}>{b.code} - {b.name}</option>
            ))}
          </select>
        </div>
      </div>

      {!selectedSubject ? (
        /* STEP 1: SUBJECT CARDS GRID */
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white font-outfit">
              Course Subjects {activeYear ? `(${activeYear} Year ${activeBranch})` : ''}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Select an Academic Year above to view Unit-1 through Unit-5 and access study files.
            </p>
          </div>

          {activeYear ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjectsList.map((sub) => (
                <motion.div
                  key={sub.subjectCode}
                  whileHover={{ y: -6, scale: 1.02 }}
                  onClick={() => setSelectedSubject(sub)}
                  className="p-7 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 hover:border-brand-500 shadow-xl transition-all cursor-pointer group flex flex-col justify-between relative overflow-hidden"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 rounded-full text-[11px] font-mono font-extrabold uppercase bg-brand-500/10 text-brand-500 border border-brand-500/20">
                        {sub.subjectCode}
                      </span>
                      
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-500">
                          5 Units
                        </span>

                        {/* Faculty Direct Delete Button */}
                        {user?.role === 'faculty' && (
                          <button
                            onClick={(e) => handleDeleteSubject(e, sub.subjectCode, sub.subjectName)}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                            title="Delete Subject"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 font-outfit group-hover:text-brand-500 transition-colors">
                      {sub.subjectName}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                      JNTUA Autonomous Curriculum • Credits: {sub.credits || 3}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-brand-500 group-hover:translate-x-1 transition-transform">
                    <span>Open Unit-1 to Unit-5</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </motion.div>
              ))}

              {subjectsList.length === 0 && (
                <div className="col-span-full p-12 rounded-3xl glass-card text-center space-y-4 border border-brand-500/30">
                  <BookOpen className="w-12 h-12 text-brand-500 mx-auto opacity-60" />
                  <h4 className="font-bold text-slate-900 dark:text-white text-lg">No Subjects Loaded for {activeYear} Year {activeBranch}</h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Click the button below to instantly load and restore the official 3rd Year CSE (5th Sem) subjects!
                  </p>
                  <button
                    onClick={() => {
                      setSubjectsList(dbService.resetCurriculumToDefault());
                    }}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg inline-flex items-center gap-2 transition-all cursor-pointer hover:scale-105"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Load & Restore 3rd Year CSE Subjects
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-16 rounded-3xl glass-card text-center space-y-4 border border-brand-500/20">
              <BookOpen className="w-14 h-14 text-brand-500/40 mx-auto" />
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-lg">Select Academic Year to View Subjects</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Please select an Academic Year (1st, 2nd, 3rd, or 4th Year) and Branch from the dropdown selector above.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* STEP 2: STRICT CLEAN 5 UNIT CARDS (Unit-1, Unit-2, Unit-3, Unit-4, Unit-5) */
        <div className="space-y-6">
          <div className="p-8 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="px-3 py-1 rounded-full bg-brand-500/10 text-brand-500 text-xs font-bold font-mono">
              {selectedSubject.subjectCode}
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white font-outfit">
              {selectedSubject.subjectName}
            </h2>
            <p className="text-xs text-slate-500">
              Select any Unit card below to view and download faculty uploaded PDF reference materials.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {standardUnits.map((uItem) => {
              const matchingUnit = selectedSubject.units?.find(
                u => u.unitId === uItem.unitId || u.title.toLowerCase().includes(uItem.name.toLowerCase())
              ) || { unitId: uItem.unitId, title: uItem.name, topics: [] };

              return (
                <motion.div
                  key={uItem.unitId}
                  whileHover={{ y: -6, scale: 1.03 }}
                  className="p-6 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 hover:border-brand-500 shadow-md transition-all cursor-pointer flex flex-col justify-between text-center group"
                  onClick={() => onSelectUnitTopic(selectedSubject, matchingUnit)}
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 font-extrabold mx-auto flex items-center justify-center text-lg shadow-inner group-hover:bg-brand-500 group-hover:text-white transition-colors">
                      <FileText className="w-6 h-6" />
                    </div>

                    <h3 className="text-2xl font-black text-slate-900 dark:text-white font-outfit tracking-wide">
                      {uItem.name}
                    </h3>
                    
                    <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300">
                      PDF Reference Files
                    </span>
                  </div>

                  <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1.5 text-xs font-bold text-brand-500 group-hover:translate-x-0.5 transition-transform">
                    <span>Open PDF Notes</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
