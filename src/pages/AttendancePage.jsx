import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { dbService, BRANCHES, YEARS } from '../services/dbService';
import { 
  UserCheck, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Calendar, 
  BookOpen, 
  Award, 
  Save, 
  Plus, 
  Search, 
  BarChart3, 
  FileText,
  ShieldAlert,
  Clock
} from 'lucide-react';

export function AttendancePage({ user }) {
  const isFaculty = user?.role === 'faculty';
  const isAdmin = user?.role === 'admin';
  const rollNumber = user?.rollNumber || user?.username || '238U1A0561';

  // State for Faculty Posting
  const [selectedYear, setSelectedYear] = useState('4th');
  const [selectedBranch, setSelectedBranch] = useState('CSE');
  const [selectedSubjectCode, setSelectedSubjectCode] = useState('23A30602T');
  
  const [inputRollNumber, setInputRollNumber] = useState('238U1A0561');
  const [studentNameInput, setStudentNameInput] = useState('B.Tech CSE Student');
  const [totalClassesInput, setTotalClassesInput] = useState('45');
  const [attendedClassesInput, setAttendedClassesInput] = useState('40');
  
  const [postingMessage, setPostingMessage] = useState('');
  const [postingError, setPostingError] = useState('');

  // Attendance Records State
  const [attendanceRecords, setAttendanceRecords] = useState(() => dbService.getAttendanceRecords());

  const handlePostAttendance = (e) => {
    e.preventDefault();
    setPostingMessage('');
    setPostingError('');

    const total = parseInt(totalClassesInput, 10);
    const attended = parseInt(attendedClassesInput, 10);

    if (isNaN(total) || isNaN(attended) || total <= 0) {
      setPostingError('Please enter valid total and attended classes counts.');
      return;
    }

    if (attended > total) {
      setPostingError('Attended classes cannot be greater than total classes conducted.');
      return;
    }

    const subjects = dbService.getSubjectsForBranchAndYear(selectedYear, selectedBranch);
    const foundSub = subjects.find(s => s.subjectCode === selectedSubjectCode) || {
      subjectName: 'Deep Learning',
      subjectCode: selectedSubjectCode
    };

    const newRecord = {
      rollNumber: inputRollNumber.trim().toUpperCase(),
      studentName: studentNameInput.trim() || 'Student',
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
    setPostingMessage(`Successfully updated attendance for Roll No: ${newRecord.rollNumber} in ${foundSub.subjectName}! (${newRecord.percentage}%)`);
  };

  // Student Attendance Overview Calculations
  const studentRecords = dbService.getStudentAttendance(user?.rollNumber || user?.username || '238U1A0561');
  
  const totalConducted = studentRecords.reduce((acc, curr) => acc + curr.totalClasses, 0);
  const totalAttended = studentRecords.reduce((acc, curr) => acc + curr.attendedClasses, 0);
  const overallPercentage = totalConducted > 0 ? parseFloat(((totalAttended / totalConducted) * 100).toFixed(1)) : 88.5;

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
            GITAMW ECAP Attendance Portal
          </div>
          <h1 className="text-4xl font-extrabold font-outfit tracking-tight">
            {isFaculty ? 'Faculty Attendance Management' : 'My Attendance & ECAP Record'}
          </h1>
          <p className="text-sm text-slate-300">
            {isFaculty 
              ? 'Mark, update, and publish official subject-wise attendance for B.Tech students.'
              : `Official semester attendance statement for ${user?.fullName || user?.username} (Roll No: ${user?.rollNumber || rollNumber}).`
            }
          </p>
        </div>
      </div>

      {/* STUDENT VIEW (STRICT READ-ONLY ATTENDANCE STATEMENT) */}
      {!isFaculty && (
        <div className="space-y-8">
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
                <li>• <strong>65% - 74%</strong>: Condonation permitted upon Principal approval with medical certificate.</li>
                <li>• <strong>&lt; 65%</strong>: Detained (Must repeat semester).</li>
              </ul>
            </div>
          </div>

          {/* Subject Wise Attendance Statement Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-outfit flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-brand-500" />
                Subject-Wise Attendance Breakdown (7th Sem CSE)
              </h3>
              <span className="text-xs font-mono text-slate-400">Read-Only Student Access</span>
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
        </div>
      )}

      {/* FACULTY VIEW (FULL POSTING & EDITING ACCESS) */}
      {isFaculty && (
        <div className="space-y-8">
          {/* Post Attendance Form */}
          <div className="p-8 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-brand-500/10 text-brand-500 font-bold flex items-center justify-center">
                <Plus className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white font-outfit">
                  Post / Update Student Attendance
                </h3>
                <p className="text-xs text-slate-500">Select subject and enter student roll number with conducted vs attended class count.</p>
              </div>
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

            <form onSubmit={handlePostAttendance} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Academic Year *
                  </label>
                  <select
                    value={selectedYear}
                    onChange={e => setSelectedYear(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:ring-2 focus:ring-brand-500 outline-none"
                  >
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
                    onChange={e => setSelectedBranch(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:ring-2 focus:ring-brand-500 outline-none"
                  >
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-500/40 bg-brand-50/20 dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                  >
                    {dbService.getSubjectsForBranchAndYear(selectedYear, selectedBranch).map(s => (
                      <option key={s.subjectCode} value={s.subjectCode}>
                        {s.subjectName} ({s.subjectCode})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Student Roll Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 238U1A0561"
                    value={inputRollNumber}
                    onChange={e => setInputRollNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold font-mono focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Student Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. B.Tech Student"
                    value={studentNameInput}
                    onChange={e => setStudentNameInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Total Classes Conducted *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 45"
                    value={totalClassesInput}
                    onChange={e => setTotalClassesInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-center focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Classes Attended *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 40"
                    value={attendedClassesInput}
                    onChange={e => setAttendedClassesInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-emerald-600 text-center focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.01] cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Publish & Save Attendance to Student Portal
              </button>
            </form>
          </div>

          {/* Published Attendance Log */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-outfit">
              Published Attendance Log ({attendanceRecords.length} Records)
            </h3>

            <div className="rounded-3xl glass-card border border-slate-200 dark:border-slate-800 overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 font-bold uppercase text-slate-400">
                    <th className="p-4">Roll Number</th>
                    <th className="p-4">Subject</th>
                    <th className="p-4 text-center">Conducted / Attended</th>
                    <th className="p-4 text-center">Percentage</th>
                    <th className="p-4 text-right">Posted By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {attendanceRecords.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">
                        {item.rollNumber}
                      </td>
                      <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">
                        {item.subjectName} ({item.subjectCode})
                      </td>
                      <td className="p-4 text-center font-mono font-bold">
                        {item.attendedClasses} / {item.totalClasses}
                      </td>
                      <td className="p-4 text-center">
                        <span className="font-extrabold text-emerald-500 font-outfit text-sm">
                          {item.percentage}%
                        </span>
                      </td>
                      <td className="p-4 text-right text-slate-400 font-medium">
                        {item.postedBy}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
