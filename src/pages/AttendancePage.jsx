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

  // Faculty Posting Form State - STRICTLY INITIALIZED TO EMPTY (NO AUTO-SELECTED DEFAULTS)
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedSubjectCode, setSelectedSubjectCode] = useState('');
  
  const [inputRollNumber, setInputRollNumber] = useState('');
  const [isManualRollInput, setIsManualRollInput] = useState(false);
  const [totalClassesInput, setTotalClassesInput] = useState('');
  const [attendedClassesInput, setAttendedClassesInput] = useState('');
  
  const [postingMessage, setPostingMessage] = useState('');
  const [postingError, setPostingError] = useState('');

  // Attendance Records State
  const [attendanceRecords, setAttendanceRecords] = useState(() => dbService.getAttendanceRecords());

  // Registered Students Filtered by Selected Year & Branch
  const allStudents = dbService.getStudentsList();

  const normYear = (y) => {
    if (!y) return '';
    const str = y.toString().toLowerCase();
    if (str.includes('1')) return '1st';
    if (str.includes('2')) return '2nd';
    if (str.includes('3') || str.includes('5') || str.includes('6')) return '3rd';
    if (str.includes('4') || str.includes('7') || str.includes('8')) return '4th';
    return str;
  };

  const filteredStudents = allStudents.filter(s => {
    const matchYr = !selectedYear || normYear(s.year) === normYear(selectedYear);
    const matchBr = !selectedBranch || (s.branch || '').toString().trim().toUpperCase() === selectedBranch.trim().toUpperCase();
    return matchYr && matchBr;
  });

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

      {/* FACULTY VIEW (FULL POSTING & EDITING ACCESS - NO DUMMY 88.5% CARD) */}
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
                  Post Student Attendance
                </h3>
                <p className="text-xs text-slate-500">Select year, branch, subject, student roll number, and class counts.</p>
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
              {/* Dropdowns - No Auto-Selected Defaults */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Academic Year *
                  </label>
                  <select
                    value={selectedYear}
                    onChange={e => {
                      setSelectedYear(e.target.value);
                      setSelectedSubjectCode('');
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:ring-2 focus:ring-brand-500 outline-none"
                  >
                    <option value="">-- Select Academic Year --</option>
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:ring-2 focus:ring-brand-500 outline-none"
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

              {/* Class Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Student Roll Number *
                    </label>
                    {filteredStudents.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsManualRollInput(!isManualRollInput);
                          setInputRollNumber('');
                        }}
                        className="text-[10px] font-bold text-brand-500 hover:underline cursor-pointer"
                      >
                        {isManualRollInput ? '📋 Use Registered Dropdown' : '✏️ Type Manually'}
                      </button>
                    )}
                  </div>

                  {!isManualRollInput ? (
                    <select
                      value={inputRollNumber}
                      onChange={e => {
                        if (e.target.value === '__MANUAL__') {
                          setIsManualRollInput(true);
                          setInputRollNumber('');
                        } else {
                          setInputRollNumber(e.target.value);
                        }
                      }}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-brand-500/60 bg-white dark:bg-slate-900 text-xs font-mono font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none cursor-pointer"
                    >
                      <option value="">
                        {filteredStudents.length > 0 
                          ? `-- Select Registered Student Roll Number (${filteredStudents.length} Available) --`
                          : `-- No Registered Students in ${selectedYear || 'Select'} Year ${selectedBranch || 'Branch'} --`
                        }
                      </option>
                      {filteredStudents.map(s => (
                        <option key={s.id || s.rollNumber} value={s.rollNumber}>
                          {s.rollNumber} - {s.fullName} ({s.year || selectedYear} Year {s.branch || selectedBranch})
                        </option>
                      ))}
                      <option value="__MANUAL__">✏️ Type Custom Roll Number manually...</option>
                    </select>
                  ) : (
                    <div className="space-y-1">
                      <input
                        type="text"
                        required
                        placeholder="Type Student Roll No (e.g. 238U1A0561)"
                        value={inputRollNumber}
                        onChange={e => setInputRollNumber(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold font-mono focus:ring-2 focus:ring-brand-500 outline-none"
                      />
                    </div>
                  )}
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

            {attendanceRecords.length > 0 ? (
              <div className="rounded-3xl glass-card border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl">
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
            ) : (
              <div className="p-10 rounded-3xl glass-card text-center text-slate-500 border border-slate-200 dark:border-slate-800">
                <p className="text-xs font-semibold">No attendance records published yet. Fill out the form above to publish student attendance.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
