import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { dbService, BRANCHES, YEARS } from '../services/dbService';
import { 
  ShieldCheck, 
  UserPlus, 
  Users, 
  Trash2, 
  Bell, 
  KeyRound, 
  Plus, 
  CheckCircle2, 
  AlertCircle,
  BarChart3,
  BookOpen
} from 'lucide-react';

export function AdminPanel() {
  const [activeSubTab, setActiveSubTab] = useState('faculty'); // 'faculty' | 'students' | 'notices' | 'analytics'

  const [facultyList, setFacultyList] = useState(dbService.getFacultyList());
  const [studentsList, setStudentsList] = useState(dbService.getStudentsList());
  const [noticesList, setNoticesList] = useState(dbService.getNotices());

  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  // Add Faculty Form State
  const [newFac, setNewFac] = useState({
    name: '',
    employeeId: '',
    department: 'CSE',
    email: '',
    username: '',
    password: ''
  });

  // Add Notice Form State
  const [newNotice, setNewNotice] = useState({
    title: '',
    category: 'Exam',
    author: 'University Admin',
    content: ''
  });

  const handleAddFaculty = (e) => {
    e.preventDefault();
    setMsg('');
    setErr('');

    try {
      const created = dbService.addFaculty({
        name: newFac.name,
        employeeId: newFac.employeeId,
        department: newFac.department,
        email: newFac.email,
        username: newFac.username || newFac.employeeId,
        password: newFac.password || 'password123'
      });

      setFacultyList(dbService.getFacultyList());
      setMsg(`Faculty account for ${created.name} (${created.employeeId}) created successfully!`);
      setNewFac({ name: '', employeeId: '', department: 'CSE', email: '', username: '', password: '' });
    } catch (e) {
      setErr(e.message || 'Failed to create faculty.');
    }
  };

  const handleDeleteFaculty = (id) => {
    if (window.confirm('Are you sure you want to delete this faculty account?')) {
      dbService.deleteFaculty(id);
      setFacultyList(dbService.getFacultyList());
      setMsg('Faculty account removed.');
    }
  };

  const handleDeleteStudent = (id) => {
    if (window.confirm('Are you sure you want to delete this student account?')) {
      dbService.deleteStudent(id);
      setStudentsList(dbService.getStudentsList());
      setMsg('Student account removed.');
    }
  };

  const handleAddNotice = (e) => {
    e.preventDefault();
    setMsg('');
    setErr('');

    if (!newNotice.title || !newNotice.content) {
      setErr('Title and Content are required.');
      return;
    }

    dbService.addNotice(newNotice);
    setNoticesList(dbService.getNotices());
    setMsg('Global notice published successfully!');
    setNewNotice({ title: '', category: 'Exam', author: 'University Admin', content: '' });
  };

  const handleDeleteNotice = (id) => {
    dbService.deleteNotice(id);
    setNoticesList(dbService.getNotices());
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Banner */}
      <div className="p-8 rounded-3xl aurora-glass-panel text-white shadow-2xl relative overflow-hidden border border-amber-500/30">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-200 text-xs font-black uppercase tracking-wider border border-amber-400/40 shadow-lg shadow-amber-500/20">
            <ShieldCheck className="w-4 h-4 text-amber-300" />
            University Admin Control Center
          </div>
          <h1 className="text-4xl font-black font-outfit">
            System <span className="gold-luxury-text">Administration Control</span>
          </h1>
          <p className="text-xs text-slate-200 font-medium">
            Create faculty accounts, manage student registrations, publish campus notices, and monitor portal analytics.
          </p>
        </div>
      </div>

      {/* Messages */}
      {msg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span>{msg}</span>
        </div>
      )}
      {err && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <span>{err}</span>
        </div>
      )}

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {[
          { id: 'faculty', label: 'Faculty Management', icon: UserPlus },
          { id: 'students', label: `Students (${studentsList.length})`, icon: Users },
          { id: 'notices', label: 'Campus Notices', icon: Bell },
          { id: 'analytics', label: 'LMS Analytics', icon: BarChart3 },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeSubTab === tab.id
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'glass-card text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Sub Tab 1: Faculty Management */}
      {activeSubTab === 'faculty' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Create Faculty Form */}
          <div className="p-6 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-outfit flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-brand-500" />
              Issue New Faculty Account
            </h3>

            <form onSubmit={handleAddFaculty} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Faculty Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Dr. A. V. Reddy"
                  value={newFac.name}
                  onChange={e => setNewFac({ ...newFac, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Employee ID * (Unique)
                </label>
                <input
                  type="text"
                  required
                  placeholder="EMP-CSE-104"
                  value={newFac.employeeId}
                  onChange={e => setNewFac({ ...newFac, employeeId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-xs font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Department *
                </label>
                <select
                  value={newFac.department}
                  onChange={e => setNewFac({ ...newFac, department: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none"
                >
                  {BRANCHES.map(b => (
                    <option key={b.id} value={b.id}>{b.code} - {b.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="reddy@apex.edu"
                  value={newFac.email}
                  onChange={e => setNewFac({ ...newFac, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Initial Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="password123"
                  value={newFac.password}
                  onChange={e => setNewFac({ ...newFac, password: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-xs outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow transition-all"
              >
                Create Faculty Credentials
              </button>
            </form>
          </div>

          {/* Faculty List */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-outfit">
              Active Faculty Members ({facultyList.length})
            </h3>

            <div className="space-y-3">
              {facultyList.map(fac => (
                <div key={fac.id} className="p-4 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400">
                        {fac.department}
                      </span>
                      <span className="text-xs font-mono text-slate-400">ID: {fac.employeeId}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{fac.name}</h4>
                    <p className="text-xs text-slate-500">{fac.email} • Username: <span className="font-mono text-brand-500 font-bold">{fac.username}</span></p>
                  </div>

                  <button
                    onClick={() => handleDeleteFaculty(fac.id)}
                    className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                    title="Delete Faculty"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Sub Tab 2: Students List */}
      {activeSubTab === 'students' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-outfit">
            Registered Student Accounts ({studentsList.length})
          </h3>

          <div className="overflow-x-auto rounded-2xl glass-card border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-800/50">
                  <th className="p-3 font-bold">Full Name</th>
                  <th className="p-3 font-bold">Roll Number</th>
                  <th className="p-3 font-bold">Auto Username</th>
                  <th className="p-3 font-bold">Branch & Year</th>
                  <th className="p-3 font-bold">Email / Mobile</th>
                  <th className="p-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {studentsList.map(st => (
                  <tr key={st.id} className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/30">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{st.fullName}</td>
                    <td className="p-3 font-mono font-bold text-indigo-500">{st.rollNumber}</td>
                    <td className="p-3 font-mono font-bold text-brand-600 dark:text-brand-400">{st.username}</td>
                    <td className="p-3">{st.branch} • {st.year} ({st.semester})</td>
                    <td className="p-3 text-slate-500">{st.email} <br /> {st.mobile}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDeleteStudent(st.id)}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                        title="Delete Student"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub Tab 3: Notices */}
      {activeSubTab === 'notices' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Post Notice Form */}
          <div className="p-6 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-outfit flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-500" />
              Publish Global Campus Circular
            </h3>

            <form onSubmit={handleAddNotice} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Notice Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. End Semester Exam Registration Open"
                  value={newNotice.title}
                  onChange={e => setNewNotice({ ...newNotice, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category *
                </label>
                <select
                  value={newNotice.category}
                  onChange={e => setNewNotice({ ...newNotice, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none"
                >
                  <option value="Exam">Exam Announcement</option>
                  <option value="Event">Hackathon & Technical Event</option>
                  <option value="General">General Campus Circular</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Content Body *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Details of the circular..."
                  value={newNotice.content}
                  onChange={e => setNewNotice({ ...newNotice, content: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-xs outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow transition-all"
              >
                Publish Announcement
              </button>
            </form>
          </div>

          {/* Published Notices */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-outfit">
              Published Circulars ({noticesList.length})
            </h3>
            {noticesList.map(n => (
              <div key={n.id} className="p-4 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                      {n.category}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{n.date}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{n.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">{n.content}</p>
                </div>
                <button
                  onClick={() => handleDeleteNotice(n.id)}
                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* Sub Tab 4: Analytics */}
      {activeSubTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Total Students</span>
            <div className="text-3xl font-extrabold text-brand-600 dark:text-brand-400 font-outfit">{studentsList.length}</div>
            <p className="text-[11px] text-emerald-500">100% Unique Roll Verified</p>
          </div>

          <div className="p-6 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Active Faculty</span>
            <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 font-outfit">{facultyList.length}</div>
            <p className="text-[11px] text-slate-400">Issued by Admin</p>
          </div>

          <div className="p-6 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Engineering Branches</span>
            <div className="text-3xl font-extrabold text-purple-600 dark:text-purple-400 font-outfit">7</div>
            <p className="text-[11px] text-slate-400">CSE, AIML, ECE, EEE, MECH, CIVIL, IT</p>
          </div>

          <div className="p-6 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Curriculum Modules</span>
            <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-outfit">100% Active</div>
            <p className="text-[11px] text-emerald-500">Vector Diagrams Online</p>
          </div>
        </div>
      )}

    </div>
  );
}
