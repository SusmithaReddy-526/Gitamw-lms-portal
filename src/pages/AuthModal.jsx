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
  useEffect(() => {
    setRole(initialRole);
    const hasReg = dbService.hasRegisteredRole(initialRole);
    setAuthMode(hasReg ? 'login' : 'register');
    setError('');
    setRegisteredUserPayload(null);
  }, [isOpen, initialRole]);

  // Role tab switch handler
  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setError('');
    setRegisteredUserPayload(null);
    const hasReg = dbService.hasRegisteredRole(newRole);
    setAuthMode(hasReg ? 'login' : 'register');
  };

  // Student Form State
  const [studentReg, setStudentReg] = useState({
    fullName: '',
    rollNumber: '',
    email: '',
    mobile: '',
    branch: 'CSE',
    year: '3rd',
    semester: 'Sem 5',
    password: '',
    confirmPassword: ''
  });

  // Faculty Form State
  const [facultyReg, setFacultyReg] = useState({
    fullName: '',
    employeeId: '',
    department: 'CSE',
    email: '',
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
        if (studentReg.password !== studentReg.confirmPassword) {
          setError('Passwords do not match.');
          return;
        }
        const res = registerStudent(studentReg);
        setRegisteredUserPayload(res);
        triggerConfetti();
      } else if (role === 'faculty') {
        if (facultyReg.password !== facultyReg.confirmPassword) {
          setError('Passwords do not match.');
          return;
        }
        const username = facultyReg.employeeId.toUpperCase();
        const res = registerFaculty({ ...facultyReg, username });
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
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
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
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  role === 'student'
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                Student
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('faculty')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  role === 'faculty'
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                Faculty
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('admin')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  role === 'admin'
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
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
                          onChange={e => setStudentReg({ ...studentReg, branch: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none"
                        >
                          {BRANCHES.map(b => (
                            <option key={b.id} value={b.id}>{b.code} - {b.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Academic Year *
                        </label>
                        <select
                          value={studentReg.year}
                          onChange={e => setStudentReg({ ...studentReg, year: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none"
                        >
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
                          onChange={e => setStudentReg({ ...studentReg, semester: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none"
                        >
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
                          placeholder="••••••••"
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
                          placeholder="••••••••"
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
                          onChange={e => setFacultyReg({ ...facultyReg, department: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none"
                        >
                          {BRANCHES.map(b => (
                            <option key={b.id} value={b.id}>{b.code} - {b.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

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

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Password *
                        </label>
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
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
                          placeholder="••••••••"
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
                          placeholder="••••••••"
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
                          placeholder="••••••••"
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
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {role === 'student' ? 'Student Username (e.g. 23CSE045)' : role === 'faculty' ? 'Faculty Employee ID / Username (e.g. EMP-CSE-01)' : 'Admin Username'}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder={role === 'student' ? '23CSE045' : role === 'faculty' ? 'EMP-CSE-01' : 'admin'}
                      value={loginUsername}
                      onChange={e => setLoginUsername(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-xs focus:ring-2 focus:ring-brand-500 outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
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
              </form>
            )}

          </div>
        )}

      </motion.div>
    </div>
  );
}
