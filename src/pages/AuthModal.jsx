import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { dbService, BRANCHES, YEARS } from '../services/dbService';
import confetti from 'canvas-confetti';
import { 
  GraduationCap, 
  UserCheck, 
  ShieldCheck, 
  KeyRound, 
  Mail, 
  Phone, 
  Hash, 
  User, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  Check,
  Building,
  Shield
} from 'lucide-react';

export function AuthModal({ isOpen, onClose, initialRole = 'student', onSuccess }) {
  const { login, registerStudent, registerFaculty, registerAdmin } = useAuth();
  
  const [role, setRole] = useState(initialRole); // 'student' | 'faculty' | 'admin'
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Auto-detect whether first-time registration or future login should be shown
  // Auto-detect whether first-time registration or future login should be shown
  useEffect(() => {
    setRole(initialRole);
    if (initialRole === 'admin') {
      setAuthMode('login');
    } else {
      const checkFn = dbService.hasRoleRegistered || dbService.hasRegisteredRole;
      const hasReg = checkFn ? checkFn(initialRole) : false;
      setAuthMode(hasReg ? 'login' : 'register');
    }
    setError('');
    setRegisteredUserPayload(null);
    setLoginUsername('');
    setLoginPassword('');
  }, [isOpen, initialRole]);

  // Role tab switch handler
  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setError('');
    setRegisteredUserPayload(null);
    setLoginUsername('');
    setLoginPassword('');
    if (newRole === 'admin') {
      setAuthMode('login');
    } else {
      const checkFn = dbService.hasRoleRegistered || dbService.hasRegisteredRole;
      const hasReg = checkFn ? checkFn(newRole) : false;
      setAuthMode(hasReg ? 'login' : 'register');
    }
  };

  // Student Form State
  const [studentReg, setStudentReg] = useState({
    fullName: '',
    rollNumber: '',
    email: '',
    mobile: '',
    branch: '',
    year: '',
    semester: '',
    password: '',
    confirmPassword: ''
  });

  // Faculty Form State
  const [facultyReg, setFacultyReg] = useState({
    fullName: '',
    employeeId: '',
    department: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });

  // Admin Form State
  const [adminReg, setAdminReg] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Login Form State
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Successful Registration Payload
  const [registeredUserPayload, setRegisteredUserPayload] = useState(null);

  if (!isOpen) return null;

  const triggerConfetti = () => {
    try {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch {}
  };

  // Form Submissions
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setError('');

    try {
      if (role === 'student') {
        if (!studentReg.branch || !studentReg.year || !studentReg.semester) {
          setError('Please select your Branch, Year, and Semester from the dropdowns.');
          return;
        }
        if (studentReg.password !== studentReg.confirmPassword) {
          setError('Passwords do not match.');
          return;
        }
        const res = registerStudent(studentReg);
        setRegisteredUserPayload(res);
        triggerConfetti();
      } else if (role === 'faculty') {
        if (!facultyReg.department) {
          setError('Please select your Department from the dropdown.');
          return;
        }
        if (!facultyReg.mobile || facultyReg.mobile.trim().length < 10) {
          setError('Please enter a valid 10-digit Mobile Number.');
          return;
        }
        if (facultyReg.password !== facultyReg.confirmPassword) {
          setError('Passwords do not match.');
          return;
        }
        const res = registerFaculty(facultyReg);
        setRegisteredUserPayload(res);
        triggerConfetti();
      } else if (role === 'admin') {
        if (adminReg.password !== adminReg.confirmPassword) {
          setError('Passwords do not match.');
          return;
        }
        const res = registerAdmin({ ...adminReg });
        setRegisteredUserPayload(res);
        triggerConfetti();
      }
    } catch (err) {
      setError(err.message || 'Registration failed.');
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');

    try {
      const loggedIn = login(loginUsername, loginPassword);
      onSuccess(loggedIn);
      onClose();
    } catch (err) {
      setError(err.message || 'Invalid Username or Password.');
    }
  };

  const handleCopyUsername = () => {
    if (registeredUserPayload?.username) {
      navigator.clipboard.writeText(registeredUserPayload.username);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const finishRegistrationModal = () => {
    if (registeredUserPayload) {
      setLoginUsername(registeredUserPayload.username);
      setAuthMode('login');
      setRegisteredUserPayload(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto">
      <div 
        className="w-full max-w-lg rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 my-8 relative overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Successful Registration Banner */}
        {registeredUserPayload ? (
          <div className="text-center space-y-6 py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white font-outfit">
                Registration Successful!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Your {role} account has been registered securely in the university database.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 space-y-2">
              <span className="text-xs uppercase tracking-wider font-bold text-brand-600 dark:text-brand-400">
                Your Official Login Username
              </span>
              <div className="flex items-center justify-center gap-3">
                <span className="text-3xl font-mono font-extrabold text-brand-700 dark:text-brand-300 tracking-wider">
                  {registeredUserPayload.username}
                </span>
                <button
                  onClick={handleCopyUsername}
                  className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow hover:bg-brand-100 text-slate-700 dark:text-slate-200 transition-colors"
                  title="Copy Username"
                >
                  {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-brand-700 dark:text-brand-300 font-medium">
                Please save this username! Future logins will directly ask for your username & password.
              </p>
            </div>

            <button
              onClick={finishRegistrationModal}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-bold shadow-lg hover:from-brand-500 hover:to-indigo-500 transition-all"
            >
              Proceed to Login
            </button>
          </div>
        ) : (
          <div>
            {/* Role Switcher Tabs */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 mb-6">
              <button
                type="button"
                onClick={() => handleRoleChange('student')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                  role === 'student'
                    ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/25 scale-[1.02]'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                Student
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('faculty')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                  role === 'faculty'
                    ? 'bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white shadow-lg shadow-fuchsia-500/25 scale-[1.02]'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                Faculty
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('admin')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                  role === 'admin'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25 scale-[1.02]'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <Shield className="w-4 h-4" />
                Admin
              </button>
            </div>

            {/* Title Header */}
            <div className="mb-6 text-center">
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white font-outfit uppercase">
                {role} Portal — {authMode === 'register' ? '1st-Time Registration' : 'Account Sign In'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {authMode === 'register' 
                  ? `First time visiting? Complete registration once to get your official username.`
                  : `Enter your registered username and password to access the portal.`}
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-4 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* REGISTRATION FORM */}
            {authMode === 'register' ? (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                
                {/* STUDENT REGISTRATION */}
                {role === 'student' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Student Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={studentReg.fullName}
                        onChange={e => setStudentReg({ ...studentReg, fullName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-xs outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Roll Number * (Unique)
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 045"
                          value={studentReg.rollNumber}
                          onChange={e => setStudentReg({ ...studentReg, rollNumber: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-xs font-mono outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Branch *
                        </label>
                        <select
                          value={studentReg.branch}
                          required
                          onChange={e => setStudentReg({ ...studentReg, branch: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none"
                        >
                          <option value="">-- Select Branch --</option>
                          {BRANCHES.map(b => (
                            <option key={b.id} value={b.id}>{b.code} - {b.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Year *
                        </label>
                        <select
                          value={studentReg.year}
                          required
                          onChange={e => setStudentReg({ ...studentReg, year: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none"
                        >
                          <option value="">-- Select Year --</option>
                          {YEARS.map(y => (
                            <option key={y.id} value={y.id}>{y.title}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Semester *
                        </label>
                        <select
                          value={studentReg.semester}
                          required
                          onChange={e => setStudentReg({ ...studentReg, semester: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none"
                        >
                          <option value="">-- Select Semester --</option>
                          {['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="student@gitamw.edu.in"
                          value={studentReg.email}
                          onChange={e => setStudentReg({ ...studentReg, email: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-xs outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Mobile Number *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="9876543210"
                          value={studentReg.mobile}
                          onChange={e => setStudentReg({ ...studentReg, mobile: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-xs outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Password *
                        </label>
                        <input
                          type="password"
                          required
                          placeholder=""
                          autoComplete="new-password"
                          value={studentReg.password}
                          onChange={e => setStudentReg({ ...studentReg, password: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-xs outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Confirm Password *
                        </label>
                        <input
                          type="password"
                          required
                          placeholder=""
                          autoComplete="new-password"
                          value={studentReg.confirmPassword}
                          onChange={e => setStudentReg({ ...studentReg, confirmPassword: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-xs outline-none"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* FACULTY REGISTRATION */}
                {role === 'faculty' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Faculty Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Dr. Vikram Sharma"
                        value={facultyReg.fullName}
                        onChange={e => setFacultyReg({ ...facultyReg, fullName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-xs outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Employee ID * (Unique)
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="EMP-CSE-01"
                          value={facultyReg.employeeId}
                          onChange={e => setFacultyReg({ ...facultyReg, employeeId: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-xs font-mono outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Department *
                        </label>
                        <select
                          value={facultyReg.department}
                          required
                          onChange={e => setFacultyReg({ ...facultyReg, department: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none"
                        >
                          <option value="">-- Select Department --</option>
                          {BRANCHES.map(b => (
                            <option key={b.id} value={b.id}>{b.code} - {b.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="faculty@gitamw.edu.in"
                          value={facultyReg.email}
                          onChange={e => setFacultyReg({ ...facultyReg, email: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-xs outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Mobile Number *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="9848012345"
                          value={facultyReg.mobile}
                          onChange={e => setFacultyReg({ ...facultyReg, mobile: e.target.value.replace(/[^0-9]/g, '').slice(0, 10) })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-xs font-mono outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Password *
                        </label>
                        <input
                          type="password"
                          required
                          placeholder=""
                          autoComplete="new-password"
                          value={facultyReg.password}
                          onChange={e => setFacultyReg({ ...facultyReg, password: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-xs outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Confirm Password *
                        </label>
                        <input
                          type="password"
                          required
                          placeholder=""
                          autoComplete="new-password"
                          value={facultyReg.confirmPassword}
                          onChange={e => setFacultyReg({ ...facultyReg, confirmPassword: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-xs outline-none"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* ADMIN REGISTRATION */}
                {role === 'admin' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Administrator Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Dr. Sarah Jenkins"
                        value={adminReg.fullName}
                        onChange={e => setAdminReg({ ...adminReg, fullName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-xs outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Admin Username *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="admin_gitamw"
                          value={adminReg.username}
                          onChange={e => setAdminReg({ ...adminReg, username: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-xs font-mono outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="admin@gitamw.edu.in"
                          value={adminReg.email}
                          onChange={e => setAdminReg({ ...adminReg, email: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-xs outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Password *
                        </label>
                        <input
                          type="password"
                          required
                          placeholder=""
                          autoComplete="new-password"
                          value={adminReg.password}
                          onChange={e => setAdminReg({ ...adminReg, password: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-xs outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Confirm Password *
                        </label>
                        <input
                          type="password"
                          required
                          placeholder=""
                          autoComplete="new-password"
                          value={adminReg.confirmPassword}
                          onChange={e => setAdminReg({ ...adminReg, confirmPassword: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-xs outline-none"
                        />
                      </div>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-bold text-sm shadow-lg hover:from-brand-500 hover:to-indigo-500 transition-all"
                >
                  Register {role.toUpperCase()} Account & Generate Username
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => { setAuthMode('login'); setError(''); }}
                    className="text-xs text-brand-600 dark:text-brand-400 font-semibold hover:underline"
                  >
                    Already registered? Switch to Sign In
                  </button>
                </div>

              </form>
            ) : (
              /* LOGIN FORM */
              <form onSubmit={handleLoginSubmit} autoComplete="off" className="space-y-4">
                {/* Hidden dummy inputs to capture browser autofill and keep visible fields 100% empty */}
                <input type="text" style={{ display: 'none' }} tabIndex={-1} name="prevent_autofill_username" />
                <input type="password" style={{ display: 'none' }} tabIndex={-1} name="prevent_autofill_password" />

                {/* OFFICIAL 4 EXECUTIVE ADMIN SELECTOR CARDS */}
                {role === 'admin' && (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-3 mb-4">
                    <div className="flex items-center justify-between font-bold text-amber-300">
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-amber-400" />
                        Select Executive Admin Role
                      </span>
                      <span className="text-[10px] font-black uppercase bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-400/40">
                        4 Roles Only
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                      {/* Principal */}
                      <div 
                        onClick={() => { 
                          setLoginUsername('principal_gitamw'); 
                          setLoginPassword(''); 
                          setError(''); 
                          document.getElementById('admin-password-input')?.focus();
                        }}
                        className={`p-3 rounded-xl border transition-all cursor-pointer ${
                          loginUsername === 'principal_gitamw'
                            ? 'bg-amber-500/20 border-amber-400 shadow-md ring-2 ring-amber-400/30'
                            : 'bg-slate-900/90 border-amber-500/20 hover:border-amber-400 hover:scale-[1.02]'
                        }`}
                      >
                        <div className="font-extrabold text-white font-outfit text-xs flex items-center justify-between">
                          <span>🏫 Principal</span>
                          {loginUsername === 'principal_gitamw' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                        </div>
                        <div className="text-slate-300 text-[10px] mt-1">User: <span className="text-cyan-300">principal_gitamw</span></div>
                      </div>

                      {/* Chairman */}
                      <div 
                        onClick={() => { 
                          setLoginUsername('chairman_gitamw'); 
                          setLoginPassword(''); 
                          setError(''); 
                          document.getElementById('admin-password-input')?.focus();
                        }}
                        className={`p-3 rounded-xl border transition-all cursor-pointer ${
                          loginUsername === 'chairman_gitamw'
                            ? 'bg-amber-500/20 border-amber-400 shadow-md ring-2 ring-amber-400/30'
                            : 'bg-slate-900/90 border-amber-500/20 hover:border-amber-400 hover:scale-[1.02]'
                        }`}
                      >
                        <div className="font-extrabold text-white font-outfit text-xs flex items-center justify-between">
                          <span>👑 Chairman</span>
                          {loginUsername === 'chairman_gitamw' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                        </div>
                        <div className="text-slate-300 text-[10px] mt-1">User: <span className="text-cyan-300">chairman_gitamw</span></div>
                      </div>

                      {/* Director */}
                      <div 
                        onClick={() => { 
                          setLoginUsername('director_gitamw'); 
                          setLoginPassword(''); 
                          setError(''); 
                          document.getElementById('admin-password-input')?.focus();
                        }}
                        className={`p-3 rounded-xl border transition-all cursor-pointer ${
                          loginUsername === 'director_gitamw'
                            ? 'bg-amber-500/20 border-amber-400 shadow-md ring-2 ring-amber-400/30'
                            : 'bg-slate-900/90 border-amber-500/20 hover:border-amber-400 hover:scale-[1.02]'
                        }`}
                      >
                        <div className="font-extrabold text-white font-outfit text-xs flex items-center justify-between">
                          <span>🏢 Director</span>
                          {loginUsername === 'director_gitamw' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                        </div>
                        <div className="text-slate-300 text-[10px] mt-1">User: <span className="text-cyan-300">director_gitamw</span></div>
                      </div>

                      {/* Examcell */}
                      <div 
                        onClick={() => { 
                          setLoginUsername('examcell_gitamw'); 
                          setLoginPassword(''); 
                          setError(''); 
                          document.getElementById('admin-password-input')?.focus();
                        }}
                        className={`p-3 rounded-xl border transition-all cursor-pointer ${
                          loginUsername === 'examcell_gitamw'
                            ? 'bg-amber-500/20 border-amber-400 shadow-md ring-2 ring-amber-400/30'
                            : 'bg-slate-900/90 border-amber-500/20 hover:border-amber-400 hover:scale-[1.02]'
                        }`}
                      >
                        <div className="font-extrabold text-white font-outfit text-xs flex items-center justify-between">
                          <span>📝 Examcell</span>
                          {loginUsername === 'examcell_gitamw' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                        </div>
                        <div className="text-slate-300 text-[10px] mt-1">User: <span className="text-cyan-300">examcell_gitamw</span></div>
                      </div>
                    </div>
                    
                    <p className="text-[10px] text-amber-300/90 text-center font-medium bg-amber-500/10 py-1.5 px-3 rounded-lg border border-amber-500/20">
                      💡 Click a card to select role, then enter its password below to log in.
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {role === 'student' ? 'Student Username' : role === 'faculty' ? 'Faculty Employee ID' : 'Selected Admin Account'}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder=""
                      autoComplete="off"
                      value={loginUsername}
                      onChange={e => setLoginUsername(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-xs focus:ring-2 focus:ring-brand-500 outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      id="admin-password-input"
                      type="password"
                      required
                      placeholder="Enter Admin Password"
                      autoComplete="new-password"
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-bold text-sm shadow-lg hover:from-brand-500 hover:to-indigo-500 transition-all"
                >
                  Sign In to {role.toUpperCase()} Dashboard
                </button>

                {role !== 'admin' && (
                  <div className="text-center pt-3 border-t border-slate-200 dark:border-slate-800">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">First-Time {role} user?</p>
                    <button
                      type="button"
                      onClick={() => { setAuthMode('register'); setError(''); }}
                      className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
                    >
                      Register New {role} Profile (1st Time Only)
                    </button>
                  </div>
                )}
              </form>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
