import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { dbService, BRANCHES, YEARS } from '../services/dbService';
import { ArrowLeft, BookOpen, ArrowRight, FileText, Trash2, Filter, HelpCircle, ExternalLink, X, Sparkles } from 'lucide-react';

export function BranchPage({ selectedYear, selectedBranch, onSelectUnitTopic, onBack, user }) {
  const [activeYear, setActiveYear] = useState(selectedYear || user?.year || '2nd');
  const [activeBranch, setActiveBranch] = useState(selectedBranch || user?.branch || 'CSE');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [showQuizModal, setShowQuizModal] = useState(false);
  
  // Refreshable subjects state
  const [subjectsList, setSubjectsList] = useState(() => 
    dbService.getSubjectsForBranchAndYear(selectedYear || user?.year || '2nd', selectedBranch || user?.branch || 'CSE')
  );

  useEffect(() => {
    const yr = activeYear || selectedYear || user?.year || '2nd';
    const br = activeBranch || selectedBranch || user?.branch || 'CSE';
    setSubjectsList(dbService.getSubjectsForBranchAndYear(yr, br));
  }, [activeYear, activeBranch, selectedYear, selectedBranch, user]);

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

  const sName = (selectedSubject?.subjectName || '').toLowerCase();
  const sCode = (selectedSubject?.subjectCode || '').toLowerCase();
  const isLabSubject = selectedSubject?.isLab || sName.includes('lab') || sName.includes('laboratory') || sName.includes('practical') || sCode.endsWith('p') || sCode.includes('lab');

  const standardUnits = [
    { unitId: 'unit-1', name: 'Unit-1' },
    { unitId: 'unit-2', name: 'Unit-2' },
    { unitId: 'unit-3', name: 'Unit-3' },
    { unitId: 'unit-4', name: 'Unit-4' },
    { unitId: 'unit-5', name: 'Unit-5' }
  ];

  const standardLabWeeks = [
    { unitId: 'week-1', name: 'Week 1' },
    { unitId: 'week-2', name: 'Week 2' },
    { unitId: 'week-3', name: 'Week 3' },
    { unitId: 'week-4', name: 'Week 4' },
    { unitId: 'week-5', name: 'Week 5' },
    { unitId: 'week-6', name: 'Week 6' },
    { unitId: 'week-7', name: 'Week 7' },
    { unitId: 'week-8', name: 'Week 8' },
    { unitId: 'week-9', name: 'Week 9' },
    { unitId: 'week-10', name: 'Week 10' }
  ];

  const activeCardsList = isLabSubject ? standardLabWeeks : standardUnits;

  // Subject Quizzes list
  const subjectQuizzes = selectedSubject 
    ? dbService.getQuizzesForSubject(selectedSubject.subjectCode, selectedSubject.subjectName)
    : [];

  return (
    <div className="space-y-8 pb-12">
      {/* Header Navigation */}
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
          {selectedSubject ? 'Back to Course Subjects' : 'Back to Main Dashboard'}
        </button>

        <span className="px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase">
          {activeYear} Year • {activeBranch} Branch
        </span>
      </div>

      {/* FILTER BAR: YEAR & BRANCH SELECTORS */}
      <div className="p-6 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-brand-500" />
            <h2 className="text-xl font-black text-slate-900 dark:text-white font-outfit">
              Select Year & Branch
            </h2>
          </div>
        </div>

        {/* 4 Years Filter Buttons */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Academic Year:</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {YEARS.map(y => (
              <button
                key={y.id}
                onClick={() => handleYearChange(y.id)}
                className={`py-3 px-4 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeYear === y.id
                    ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg shadow-brand-500/25 scale-[1.02]'
                    : 'glass-card text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{y.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 4 Branches Filter Buttons */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Engineering Branch:</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {BRANCHES.map(b => (
              <button
                key={b.id}
                onClick={() => handleBranchChange(b.id)}
                className={`py-3 px-4 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeBranch === b.id
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/25 scale-[1.02]'
                    : 'glass-card text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{b.code}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {!selectedSubject ? (
        /* STEP 1: SUBJECT CARDS GRID */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white font-outfit">
              {activeYear} Year {activeBranch} Subjects ({subjectsList.length})
            </h3>
          </div>

          {subjectsList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjectsList.map((subject) => (
                <motion.div
                  key={subject.id || subject.subjectCode}
                  whileHover={{ y: -4 }}
                  onClick={() => setSelectedSubject(subject)}
                  className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 hover:border-brand-500 shadow-xl hover:shadow-2xl transition-all cursor-pointer flex flex-col justify-between space-y-4 group relative"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 font-mono font-bold text-xs">
                        {subject.subjectCode}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300">
                        {subject.credits || 3} Credits
                      </span>
                    </div>

                    <h4 className="text-xl font-bold text-slate-900 dark:text-white font-outfit group-hover:text-brand-500 transition-colors">
                      {subject.subjectName}
                    </h4>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-brand-500">
                    <span>
                      {(subject.subjectName || '').toLowerCase().includes('lab') || (subject.subjectName || '').toLowerCase().includes('laboratory') || (subject.subjectCode || '').toLowerCase().endsWith('p')
                        ? 'Open Week 1 to Week 10 & QUIZ'
                        : 'Open Unit-1 to Unit-5 & QUIZ'}
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-16 text-center rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
              <BookOpen className="w-16 h-16 text-brand-500/30 mx-auto" />
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                No Course Subjects for {activeYear} Year {activeBranch}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Please select an Academic Year (1st, 2nd, 3rd, or 4th Year) and Branch from the dropdown selector above.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* STEP 2: DYNAMIC CARDS (Week 1-10 for Labs, Unit 1-5 for Theory + QUIZ CARD) */
        <div className="space-y-6">
          <div className="p-8 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-brand-500/10 text-brand-500 text-xs font-bold font-mono">
                {selectedSubject.subjectCode}
              </span>
              {isLabSubject && (
                <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-extrabold font-mono">
                  🧪 LAB EXPERIMENT PORTAL
                </span>
              )}
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white font-outfit">
              {selectedSubject.subjectName}
            </h2>
            <p className="text-xs text-slate-500">
              {isLabSubject 
                ? 'Select Week 1 to Week 10 to view or upload lab manuals, experiment code & lab materials, or click QUIZ card for lab tests.' 
                : 'Select Unit 1-5 for PDF notes or click QUIZ card to participate in faculty published online quizzes.'}
            </p>
          </div>

          {/* CARDS GRID: 10 WEEK CARDS OR 5 UNIT CARDS + 1 QUIZ CARD */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${isLabSubject ? 'lg:grid-cols-5' : 'lg:grid-cols-6'} gap-5`}>
            {/* WEEK OR UNIT CARDS */}
            {activeCardsList.map((uItem) => {
              const matchingUnit = selectedSubject.units?.find(
                u => u.unitId === uItem.unitId || u.title.toLowerCase().includes(uItem.name.toLowerCase())
              ) || { unitId: uItem.unitId, title: uItem.name, topics: [] };

              return (
                <div
                  key={uItem.unitId}
                  className="p-6 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 hover:border-brand-500 shadow-md hover:-translate-y-1 hover:scale-[1.02] transition-all cursor-pointer flex flex-col justify-between text-center group"
                  onClick={() => onSelectUnitTopic(selectedSubject, matchingUnit)}
                >
                  <div className="space-y-4">
                    <div className={`w-12 h-12 rounded-2xl ${isLabSubject ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:bg-purple-600' : 'bg-brand-500/10 text-brand-600 dark:text-brand-400 group-hover:bg-brand-500'} font-extrabold mx-auto flex items-center justify-center text-lg shadow-inner group-hover:text-white transition-colors`}>
                      <FileText className="w-6 h-6" />
                    </div>

                    <h3 className="text-2xl font-black text-slate-900 dark:text-white font-outfit tracking-wide">
                      {uItem.name}
                    </h3>
                    
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold ${isLabSubject ? 'bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300'}`}>
                      {isLabSubject ? '🧪 Lab Manual & Code' : '📄 PDF Reference Files'}
                    </span>
                  </div>

                  <div className={`mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1.5 text-xs font-bold ${isLabSubject ? 'text-purple-600 dark:text-purple-400' : 'text-brand-500'} group-hover:translate-x-0.5 transition-transform`}>
                    <span>{isLabSubject ? 'Open Lab Experiment' : 'Open PDF Notes'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}

            {/* 6TH CARD: QUIZ CARD */}
            <div
              onClick={() => setShowQuizModal(true)}
              className="p-6 rounded-2xl bg-gradient-to-br from-fuchsia-950/80 via-purple-900/80 to-slate-900 border border-fuchsia-500/50 hover:border-fuchsia-400 shadow-xl hover:-translate-y-1 hover:scale-[1.02] transition-all cursor-pointer flex flex-col justify-between text-center group text-white relative overflow-hidden"
            >
              <div className="space-y-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-fuchsia-500/20 text-fuchsia-300 font-extrabold mx-auto flex items-center justify-center text-lg shadow-inner border border-fuchsia-400/30 group-hover:bg-fuchsia-500 group-hover:text-white transition-colors">
                  <HelpCircle className="w-6 h-6" />
                </div>

                <h3 className="text-2xl font-black text-white font-outfit tracking-wide">
                  QUIZ
                </h3>
                
                <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30">
                  {subjectQuizzes.length} Online Quizzes
                </span>
              </div>

              <div className="mt-6 pt-3 border-t border-fuchsia-500/30 flex items-center justify-center gap-1.5 text-xs font-bold text-cyan-300 group-hover:translate-x-0.5 transition-transform relative z-10">
                <span>Take Subject Quiz</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QUIZ MODAL FOR SELECTED SUBJECT */}
      <AnimatePresence>
        {showQuizModal && selectedSubject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-3xl bg-slate-900 rounded-3xl shadow-2xl border border-fuchsia-500/40 overflow-hidden flex flex-col max-h-[85vh]"
            >
              {/* Modal Header */}
              <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-fuchsia-400" />
                    <h3 className="font-extrabold text-white text-xl font-outfit">
                      {selectedSubject.subjectName} ({selectedSubject.subjectCode}) — Online Quizzes
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400">
                    Faculty published online test & quiz links for {selectedSubject.subjectName}.
                  </p>
                </div>

                <button
                  onClick={() => setShowQuizModal(false)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quizzes List */}
              <div className="p-6 overflow-y-auto space-y-4">
                {subjectQuizzes.length > 0 ? (
                  subjectQuizzes.map(quiz => (
                    <motion.div
                      key={quiz.id}
                      whileHover={{ y: -2 }}
                      className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-fuchsia-500/50 space-y-3 shadow-lg"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-fuchsia-400" />
                          ONLINE QUIZ
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">Published: {quiz.createdAt}</span>
                      </div>

                      <div>
                        <h4 className="text-lg font-bold text-white font-outfit mb-1">
                          {quiz.title}
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {quiz.description || 'Participate in this online quiz to test your knowledge.'}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">
                          By: <strong className="text-cyan-300">{quiz.uploadedBy || 'Course Faculty'}</strong>
                        </span>

                        <a
                          href={quiz.quizLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
                        >
                          <span>Take Quiz Online</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="p-12 text-center space-y-3 bg-slate-950/50 rounded-2xl border border-slate-800">
                    <HelpCircle className="w-12 h-12 text-fuchsia-500/40 mx-auto" />
                    <h4 className="font-extrabold text-white text-base">No Quizzes Published Yet for {selectedSubject.subjectName}</h4>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Course faculty will publish Google Form / Online Quiz links here for {selectedSubject.subjectName}.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
