import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { dbService, BRANCHES, YEARS } from '../services/dbService';
import { 
  UserCheck, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  BookOpen, 
  Save, 
  Plus, 
  ShieldAlert
} from 'lucide-react';

export function AttendancePage({ user }) {
  const isFaculty = user?.role === 'faculty';
  const rollNumber = user?.rollNumber || user?.username || '';

  // 2 Primary Mode Cards State for Faculty: 'day-to-day' vs 'monthly'
  const [selectedCardMode, setSelectedCardMode] = useState('day-to-day');

  // Faculty Selection State
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('Sem 1');
  const [selectedSubjectCode, setSelectedSubjectCode] = useState('');
  const [selectedRolls, setSelectedRolls] = useState([]);
  
  const [inputRollNumber, setInputRollNumber] = useState('');
  const [totalClassesInput, setTotalClassesInput] = useState('');
  const [attendedClassesInput, setAttendedClassesInput] = useState('');
  
  const [postingMessage, setPostingMessage] = useState('');
  const [postingError, setPostingError] = useState('');

  // Attendance Records State
  const [attendanceRecords, setAttendanceRecords] = useState(() => dbService.getAttendanceRecords());

  // Registered Students Filtered & Sorted in Ascending Order
  const sortedStudents = dbService.getStudentsByBranchAndYearSorted(selectedBranch, selectedYear);

  const handlePostDayToDayAttendance = (e) => {
    e?.preventDefault();
    setPostingMessage('');
    setPostingError('');

    if (!selectedBranch || !selectedYear || !selectedSubjectCode) {
      setPostingError('Please select Engineering Branch, Year, and Course Subject.');
      return;
    }

    if (selectedRolls.length === 0) {
      setPostingError('Please select at least one Present Student Roll Number.');
      return;
    }

    const subjects = dbService.getSubjectsForBranchAndYear(selectedYear, selectedBranch);
    const foundSub = subjects.find(s => s.subjectCode === selectedSubjectCode) || {
      subjectName: 'Course Subject',
      subjectCode: selectedSubjectCode
    };

    let count = 0;
    selectedRolls.forEach((roll) => {
      const existing = dbService.getStudentAttendance(roll).find(a => a.subjectCode === selectedSubjectCode);
      const prevTotal = existing ? existing.totalClasses : 0;
      const prevAttended = existing ? existing.attendedClasses : 0;

      const newTotal = prevTotal + 1;
      const newAttended = prevAttended + 1;

      const newRecord = {
        rollNumber: roll.toUpperCase(),
        yearId: selectedYear,
        branchId: selectedBranch,
        semester: selectedSemester,
        subjectCode: foundSub.subjectCode,
        subjectName: foundSub.subjectName,
        totalClasses: newTotal,
        attendedClasses: newAttended,
        percentage: parseFloat(((newAttended / newTotal) * 100).toFixed(1)),
        postedBy: user?.fullName ? `${user.fullName} (${user.employeeId || 'Faculty'})` : 'Department Faculty',
        updatedAt: new Date().toISOString().split('T')[0]
      };

      dbService.saveAttendanceRecord(newRecord);
      count++;
    });

    setAttendanceRecords(dbService.getAttendanceRecords());
    setPostingMessage(`Successfully published Day-to-Day attendance for ${count} student(s) in ${foundSub.subjectName}!`);
    setSelectedRolls([]);
  };

  const handlePostAttendance = (e) => {
    e.preventDefault();
    setPostingMessage('');
    setPostingError('');

    if (!selectedYear || !selectedBranch || !selectedSubjectCode) {
      setPostingError('Please select Academic Year, Engineering Branch, and Course Subject.');
      return;
    }

    if (!inputRollNumber.trim()) {
      setPostingError('Please enter Student Roll Number.');
      return;
    }

    const total = parseInt(totalClassesInput, 10);
    const attended = parseInt(attendedClassesInput, 10);

    if (isNaN(total) || isNaN(attended) || total <= 0) {
      setPostingError('Please enter valid Total Classes and Attended Classes.');
      return;
    }

    if (attended > total) {
      setPostingError('Attended classes cannot be greater than total classes conducted.');
      return;
    }

    const subjects = dbService.getSubjectsForBranchAndYear(selectedYear, selectedBranch);
    const foundSub = subjects.find(s => s.subjectCode === selectedSubjectCode) || {
      subjectName: 'Course Subject',
      subjectCode: selectedSubjectCode
    };

    const newRecord = {
      rollNumber: inputRollNumber.trim().toUpperCase(),
      yearId: selectedYear,
      branchId: selectedBranch,
      subjectCode: foundSub.subjectCode,
      subjectName: foundSub.subjectName,
      totalClasses: total,
      attendedClasses: attended,
      percentage: parseFloat(((attended / total) * 100).toFixed(1)),
      postedBy: user?.fullName ? `${user.fullName} (${user.employeeId || 'Faculty'})` : 'Department Faculty',
      updatedAt: new Date().toISOString().split('T')[0]
    };

    dbService.saveAttendanceRecord(newRecord);
    setAttendanceRecords(dbService.getAttendanceRecords());
    setPostingMessage(`Successfully published attendance for Roll No: ${newRecord.rollNumber} in ${foundSub.subjectName} (${newRecord.percentage}%)!`);
    
    // Clear inputs
    setInputRollNumber('');
    setTotalClassesInput('');
    setAttendedClassesInput('');
  };

  // Student Attendance Overview Calculations
  const studentRecords = dbService.getStudentAttendance(user?.rollNumber || user?.username || '');
  
  const totalConducted = studentRecords.reduce((acc, curr) => acc + curr.totalClasses, 0);
  const totalAttended = studentRecords.reduce((acc, curr) => acc + curr.attendedClasses, 0);
  const overallPercentage = totalConducted > 0 ? parseFloat(((totalAttended / totalConducted) * 100).toFixed(1)) : 0;

  const getStatusBadge = (pct) => {
    if (pct >= 75) {
      return {
        label: 'Eligible for End Exams (Safe)',
        color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        icon: CheckCircle2
      };
    } else if (pct >= 65) {
      return {
        label: 'Condonation Shortage (Medical Required)',
        color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
        icon: AlertTriangle
      };
    } else {
      return {
        label: 'Detained / Critical (< 65%)',
        color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
        icon: XCircle
      };
    }
  };

  const overallBadge = getStatusBadge(overallPercentage);
  const StatusIcon = overallBadge.icon;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-950 text-white shadow-xl relative overflow-hidden border border-brand-500/20">
        <div className="relative z-10 max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            GITAMW Attendance Portal
          </div>
          <h1 className="text-4xl font-extrabold font-outfit tracking-tight">
            {isFaculty ? 'Faculty Attendance Portal' : 'My Attendance Statement'}
          </h1>
          <p className="text-sm text-slate-300">
            {isFaculty 
              ? 'Publish and update subject-wise attendance for B.Tech students.'
              : `Official semester attendance statement for ${user?.fullName || user?.username || 'Student'}${user?.rollNumber ? ` (Roll No: ${user.rollNumber})` : ''}.`
            }
          </p>
        </div>
      </div>

      {/* STUDENT VIEW (STRICT READ-ONLY ATTENDANCE STATEMENT) */}
      {!isFaculty && (
        <div className="space-y-8">
          {studentRecords.length > 0 ? (
            <>
              {/* Overall Percentage Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-8 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">
                      Overall Aggregate Attendance
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-extrabold border flex items-center gap-1.5 ${overallBadge.color}`}>
                      <StatusIcon className="w-4 h-4" />
                      {overallBadge.label}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-4">
                    <span className="text-6xl font-black font-outfit text-slate-900 dark:text-white">
                      {overallPercentage}%
                    </span>
                    <div className="text-xs text-slate-500">
                      <p className="font-bold text-slate-700 dark:text-slate-300">{totalAttended} / {totalConducted} Total Periods Attended</p>
                      <p>Threshold Required: 75.0%</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${
                          overallPercentage >= 75 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' :
                          overallPercentage >= 65 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' :
                          'bg-gradient-to-r from-rose-500 to-red-400'
                        }`}
                        style={{ width: `${Math.min(overallPercentage, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Attendance Rules Card */}
                <div className="p-6 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-brand-500 font-bold text-sm">
                    <ShieldAlert className="w-5 h-5" />
                    JNTUA Regulations
                  </div>
                  <ul className="text-xs text-slate-500 space-y-2 leading-relaxed">
                    <li>• <strong>≥ 75%</strong>: Fully eligible for Semester End Examinations (SEE).</li>
                    <li>• <strong>65% - 74%</strong>: Condonation permitted upon Principal approval.</li>
                    <li>• <strong>&lt; 65%</strong>: Detained (Must repeat semester).</li>
                  </ul>
                </div>
              </div>

              {/* Subject Wise Attendance Statement Table */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-outfit flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-brand-500" />
                    Subject-Wise Attendance Breakdown
                  </h3>
                  <span className="text-xs font-mono text-slate-400">Read-Only Access</span>
                </div>

                <div className="rounded-3xl glass-card border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-[11px] font-extrabold uppercase text-slate-400">
                          <th className="p-4">Subject Name</th>
                          <th className="p-4">Subject Code</th>
                          <th className="p-4 text-center">Conducted</th>
                          <th className="p-4 text-center">Attended</th>
                          <th className="p-4 text-center">Percentage</th>
                          <th className="p-4 text-right">Exam Eligibility</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                        {studentRecords.map((item, idx) => {
                          const badge = getStatusBadge(item.percentage);
                          const BadgeIcon = badge.icon;

                          return (
                            <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                              <td className="p-4 font-bold text-slate-900 dark:text-white">
                                {item.subjectName}
                              </td>
                              <td className="p-4 font-mono text-slate-500 font-bold">
                                {item.subjectCode}
                              </td>
                              <td className="p-4 text-center font-mono font-bold text-slate-700 dark:text-slate-300">
                                {item.totalClasses}
                              </td>
                              <td className="p-4 text-center font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                {item.attendedClasses}
                              </td>
                              <td className="p-4 text-center">
                                <span className="font-extrabold font-outfit text-sm text-slate-900 dark:text-white">
                                  {item.percentage}%
                                </span>
                              </td>
                              <td className="p-4 text-right">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${badge.color}`}>
                                  <BadgeIcon className="w-3.5 h-3.5" />
                                  {item.percentage >= 75 ? 'Eligible' : item.percentage >= 65 ? 'Condonation' : 'Detained'}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="p-16 text-center rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
              <UserCheck className="w-14 h-14 text-brand-500/40 mx-auto" />
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-lg">No Attendance Posted Yet</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Faculty will publish subject-wise attendance for your roll number directly from the Faculty Attendance Portal.
              </p>
            </div>
          )}
        </div>
      )}
      {/* FACULTY VIEW (2 PRIMARY CARDS: DAY TO DAY ATTENDANCE & MONTHLY SUMMARY) */}
      {isFaculty && (
        <div className="space-y-8">
          {/* 2 Primary Mode Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => setSelectedCardMode('day-to-day')}
              className={`p-6 rounded-3xl border text-left flex items-center gap-5 transition-all cursor-pointer shadow-xl ${
                selectedCardMode === 'day-to-day'
                  ? 'bg-gradient-to-br from-brand-600 to-indigo-600 text-white border-brand-400 ring-4 ring-brand-400/30 scale-[1.02]'
                  : 'glass-card border-slate-200 dark:border-slate-800 hover:border-brand-400 text-slate-800 dark:text-slate-200'
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-2xl shrink-0 ${
                selectedCardMode === 'day-to-day' ? 'bg-white/20 text-white' : 'bg-brand-500/10 text-brand-500'
              }`}>
                📅
              </div>
              <div>
                <span className={`text-[10px] font-extrabold uppercase tracking-wider block ${selectedCardMode === 'day-to-day' ? 'text-brand-200' : 'text-brand-500'}`}>
                  Daily Roll Call Register
                </span>
                <h3 className="text-xl font-black font-outfit">
                  Day to Day Attendance Card
                </h3>
                <p className={`text-xs mt-1 ${selectedCardMode === 'day-to-day' ? 'text-brand-100' : 'text-slate-500'}`}>
                  Mark daily class attendance for multiple student roll numbers at once.
                </p>
              </div>
            </button>

            <button
              onClick={() => setSelectedCardMode('monthly')}
              className={`p-6 rounded-3xl border text-left flex items-center gap-5 transition-all cursor-pointer shadow-xl ${
                selectedCardMode === 'monthly'
                  ? 'bg-gradient-to-br from-purple-600 to-fuchsia-600 text-white border-purple-400 ring-4 ring-purple-400/30 scale-[1.02]'
                  : 'glass-card border-slate-200 dark:border-slate-800 hover:border-purple-400 text-slate-800 dark:text-slate-200'
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-2xl shrink-0 ${
                selectedCardMode === 'monthly' ? 'bg-white/20 text-white' : 'bg-purple-500/10 text-purple-400'
              }`}>
                📊
              </div>
              <div>
                <span className={`text-[10px] font-extrabold uppercase tracking-wider block ${selectedCardMode === 'monthly' ? 'text-purple-200' : 'text-purple-400'}`}>
                  Semester Aggregate Register
                </span>
                <h3 className="text-xl font-black font-outfit">
                  Monthly Attendance Summary Card
                </h3>
                <p className={`text-xs mt-1 ${selectedCardMode === 'monthly' ? 'text-purple-100' : 'text-slate-500'}`}>
                  Update cumulative total classes &amp; monthly percentage records for students.
                </p>
              </div>
            </button>
          </div>

          {postingMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-emerald-500 text-white font-bold text-xs shadow-lg flex items-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{postingMessage}</span>
            </motion.div>
          )}

          {postingError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-rose-500 text-white font-bold text-xs shadow-lg flex items-center gap-2"
            >
              <XCircle className="w-5 h-5 shrink-0" />
              <span>{postingError}</span>
            </motion.div>
          )}

          {/* CARD MODE 1: DAY TO DAY ATTENDANCE */}
          {selectedCardMode === 'day-to-day' && (
            <div className="p-8 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 space-y-6">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-2xl bg-brand-500/10 text-brand-500 font-bold flex items-center justify-center text-xl">
                  📅
                </span>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white font-outfit">
                    Day to Day Attendance Entry Form
                  </h3>
                  <p className="text-xs text-slate-500">
                    Select Branch, Year, Semester, Subject, and tick present Roll Numbers (sorted in ascending order).
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Branch, Year, Semester, Subject */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Engineering Branch *
                    </label>
                    <select
                      value={selectedBranch}
                      onChange={e => {
                        setSelectedBranch(e.target.value);
                        setSelectedSubjectCode('');
                        setSelectedRolls([]);
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold focus:ring-2 focus:ring-brand-500 outline-none"
                    >
                      <option value="">-- Select Branch --</option>
                      {BRANCHES.map(b => (
                        <option key={b.id} value={b.id}>{b.code} - {b.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Year *
                    </label>
                    <select
                      value={selectedYear}
                      onChange={e => {
                        setSelectedYear(e.target.value);
                        setSelectedSubjectCode('');
                        setSelectedRolls([]);
                        if (e.target.value === '1st') setSelectedSemester('Sem 1');
                        else if (e.target.value === '2nd') setSelectedSemester('Sem 3');
                        else if (e.target.value === '3rd') setSelectedSemester('Sem 5');
                        else if (e.target.value === '4th') setSelectedSemester('Sem 7');
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold focus:ring-2 focus:ring-brand-500 outline-none"
                    >
                      <option value="">-- Select Year --</option>
                      {YEARS.map(y => (
                        <option key={y.id} value={y.id}>{y.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Academic Semester *
                    </label>
                    <select
                      value={selectedSemester}
                      onChange={e => setSelectedSemester(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold focus:ring-2 focus:ring-brand-500 outline-none"
                    >
                      <option value="Sem 1">Sem 1</option>
                      <option value="Sem 2">Sem 2</option>
                      <option value="Sem 3">Sem 3</option>
                      <option value="Sem 4">Sem 4</option>
                      <option value="Sem 5">Sem 5</option>
                      <option value="Sem 6">Sem 6</option>
                      <option value="Sem 7">Sem 7</option>
                      <option value="Sem 8">Sem 8</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Course Subject *
                    </label>
                    <select
                      value={selectedSubjectCode}
                      onChange={e => setSelectedSubjectCode(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-brand-500/40 bg-brand-50/20 dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                    >
                      <option value="">-- Select Course Subject --</option>
                      {selectedYear && selectedBranch && dbService.getSubjectsForBranchAndYear(selectedYear, selectedBranch).map(s => (
                        <option key={s.subjectCode} value={s.subjectCode}>
                          {s.subjectName} ({s.subjectCode})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Registered Roll Numbers Selection Grid */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <label className="block text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                      Select Present Student Roll Numbers ({sortedStudents.length} Registered in {selectedBranch || 'Branch'} {selectedYear || 'Year'})
                    </label>
                    {sortedStudents.length > 0 && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedRolls(sortedStudents.map(s => s.rollNumber || s.username))}
                          className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition-all cursor-pointer"
                        >
                          ✓ Select All ({sortedStudents.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedRolls([])}
                          className="px-3 py-1 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-500/20 transition-all cursor-pointer"
                        >
                          ✕ Clear Selection
                        </button>
                      </div>
                    )}
                  </div>

                  {sortedStudents.length > 0 ? (
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-80 overflow-y-auto">
                      {sortedStudents.map((student) => {
                        const roll = student.rollNumber || student.username;
                        const isChecked = selectedRolls.includes(roll);

                        return (
                          <label
                            key={roll}
                            className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                              isChecked
                                ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-700 dark:text-emerald-300 font-bold'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedRolls([...selectedRolls, roll]);
                                  } else {
                                    setSelectedRolls(selectedRolls.filter(r => r !== roll));
                                  }
                                }}
                                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
                              />
                              <span className="font-mono text-xs font-extrabold">{roll}</span>
                            </div>
                            <span className="text-[11px] truncate max-w-[140px] text-slate-500">
                              {student.fullName}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-8 rounded-2xl glass-card text-center text-slate-500 border border-slate-200 dark:border-slate-800">
                      <p className="text-xs font-bold">Please select Engineering Branch and Year to load registered student roll numbers in strict ascending order.</p>
                    </div>
                  )}
                </div>

                {/* Submit Day to Day Attendance */}
                <button
                  type="button"
                  onClick={handlePostDayToDayAttendance}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.01] cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" />
                  Publish Day-to-Day Attendance for {selectedRolls.length} Selected Student(s)
                </button>
              </div>
            </div>
          )}

          {/* CARD MODE 2: MONTHLY ATTENDANCE SUMMARY */}
          {selectedCardMode === 'monthly' && (
            <div className="p-8 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 space-y-6">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-500 font-bold flex items-center justify-center text-xl">
                  📊
                </span>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white font-outfit">
                    Monthly Aggregate Attendance Entry Form
                  </h3>
                  <p className="text-xs text-slate-500">Update cumulative total conducted classes and attended classes for individual students.</p>
                </div>
              </div>

              <form onSubmit={handlePostAttendance} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Year *
                    </label>
                    <select
                      value={selectedYear}
                      onChange={e => {
                        setSelectedYear(e.target.value);
                        setSelectedSubjectCode('');
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:ring-2 focus:ring-purple-500 outline-none"
                    >
                      <option value="">-- Select Year --</option>
                      {YEARS.map(y => (
                        <option key={y.id} value={y.id}>{y.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Engineering Branch *
                    </label>
                    <select
                      value={selectedBranch}
                      onChange={e => {
                        setSelectedBranch(e.target.value);
                        setSelectedSubjectCode('');
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:ring-2 focus:ring-purple-500 outline-none"
                    >
                      <option value="">-- Select Engineering Branch --</option>
                      {BRANCHES.map(b => (
                        <option key={b.id} value={b.id}>{b.code} - {b.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Course Subject *
                    </label>
                    <select
                      value={selectedSubjectCode}
                      onChange={e => setSelectedSubjectCode(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-purple-500/40 bg-purple-50/20 dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                    >
                      <option value="">-- Select Course Subject --</option>
                      {selectedYear && selectedBranch && dbService.getSubjectsForBranchAndYear(selectedYear, selectedBranch).map(s => (
                        <option key={s.subjectCode} value={s.subjectCode}>
                          {s.subjectName} ({s.subjectCode})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Student Roll Number *
                    </label>
                    <select
                      value={inputRollNumber}
                      onChange={e => setInputRollNumber(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-purple-500/60 bg-white dark:bg-slate-900 text-xs font-mono font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none cursor-pointer"
                    >
                      <option value="">
                        {sortedStudents.length > 0 
                          ? `-- Select Student Roll Number (${sortedStudents.length} Available) --`
                          : `-- Select Branch & Year First --`
                        }
                      </option>
                      {sortedStudents.map(s => (
                        <option key={s.id || s.rollNumber} value={s.rollNumber || s.username}>
                          {s.rollNumber || s.username} - {s.fullName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Total Classes Conducted *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="e.g. 45"
                      value={totalClassesInput}
                      onChange={e => setTotalClassesInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono font-bold focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Classes Attended by Student *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="e.g. 40"
                      value={attendedClassesInput}
                      onChange={e => setAttendedClassesInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono font-bold focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.01] cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  Publish Monthly Cumulative Attendance Record
                </button>
              </form>
            </div>
          )}

          {/* Published Attendance Records Table */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-outfit">
              Published Attendance Directory ({attendanceRecords.length})
            </h3>

            {attendanceRecords.length > 0 ? (
              <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-extrabold">
                        <th className="p-3">Roll Number</th>
                        <th className="p-3">Year / Branch</th>
                        <th className="p-3">Subject</th>
                        <th className="p-3 text-center">Classes</th>
                        <th className="p-3 text-center">Attendance %</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {attendanceRecords.map((rec) => (
                        <tr key={rec.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="p-3 font-mono font-extrabold text-slate-900 dark:text-white">
                            {rec.rollNumber}
                          </td>
                          <td className="p-3 font-bold text-slate-600 dark:text-slate-300">
                            {rec.yearId} Year • {rec.branchId}
                          </td>
                          <td className="p-3 font-medium text-slate-700 dark:text-slate-300">
                            {rec.subjectName} <span className="font-mono text-slate-400">({rec.subjectCode})</span>
                          </td>
                          <td className="p-3 text-center font-mono font-bold text-slate-700 dark:text-slate-300">
                            {rec.attendedClasses} / {rec.totalClasses}
                          </td>
                          <td className="p-3 text-center font-black text-sm text-brand-600 dark:text-brand-400">
                            {rec.percentage}%
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete attendance record for Roll ${rec.rollNumber}?`)) {
                                  dbService.deleteAttendanceRecord(rec.id);
                                  setAttendanceRecords(dbService.getAttendanceRecords());
                                }
                              }}
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                              title="Delete Record"
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl glass-card text-slate-500 border border-slate-200 dark:border-slate-800">
                <p className="text-xs font-bold">No published attendance records found.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
