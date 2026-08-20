import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { SuggestionModal } from './SuggestionModal';
import { 
  GraduationCap, 
  Home, 
  LayoutDashboard, 
  BookOpen, 
  Search, 
  Download, 
  User, 
  Shield, 
  Sun, 
  Moon, 
  LogOut, 
  Menu, 
  X,
  UserCheck,
  Sparkles,
  MessageSquarePlus
} from 'lucide-react';

export function Navbar({ activeTab, setActiveTab }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [suggestionOpen, setSuggestionOpen] = useState(false);

  let navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, requiresAuth: true },
    { id: 'subjects', label: 'Subjects', icon: BookOpen, requiresAuth: true },
    { id: 'attendance', label: 'Attendance', icon: UserCheck, requiresAuth: true, hideForAdmin: true },
    { id: 'search', label: 'Search', icon: Search, hideForAdmin: true },
    { id: 'downloads', label: 'Downloads', icon: Download, requiresAuth: true, hideForAdmin: true, hideForFaculty: true },
  ];

  if (user?.role === 'admin') {
    navItems = navItems.filter(item => !item.hideForAdmin);
    navItems.push({ id: 'admin', label: 'Admin Panel', icon: Shield });
  }

  if (user?.role === 'faculty') {
    navItems = navItems.filter(item => !item.hideForFaculty);
    navItems.push({ id: 'faculty-portal', label: 'Faculty Upload', icon: Sparkles });
  }

  return (
    <header className="sticky top-0 z-50 aurora-glass-panel transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveTab('home')}
          >
            <div className="w-11 h-11 rounded-2xl bg-white p-0.5 shadow-xl shadow-amber-500/20 border-2 border-amber-400/60 flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden shrink-0">
              <img 
                src={`${import.meta.env.BASE_URL}gitamw_logo.png`} 
                alt="GITAMW Emblem" 
                className="w-full h-full object-contain" 
              />
            </div>
            <div>
              <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white font-outfit flex items-center gap-1.5">
                GITAMW <span className="aurora-text">AUTONOMOUS</span>
              </span>
              <span className="block text-[10px] uppercase font-black tracking-widest text-indigo-600 dark:text-cyan-300 -mt-1 font-mono">
                Digital Academic Portal
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => {
              if (item.requiresAuth && !user) return null;
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-fuchsia-600 via-indigo-600 to-cyan-500 text-white shadow-lg shadow-fuchsia-500/25 font-bold scale-[1.03]'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Controls & Profile */}
          <div className="hidden md:flex items-center gap-3">
            {/* Suggestions & Feedback / Complaints Button (Logged In Only) */}
            {user && (
              <button
                onClick={() => setSuggestionOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 text-xs font-bold hover:bg-brand-500/20 transition-all cursor-pointer"
                title="Submit Suggestion / Complaint to Admin"
              >
                <MessageSquarePlus className="w-4 h-4 text-brand-500" />
                <span>Feedback</span>
              </button>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>

            {user ? (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border transition-all ${
                    activeTab === 'profile'
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400'
                      : 'border-slate-200 dark:border-slate-700 hover:border-brand-300 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-brand-600 text-white font-bold text-xs flex items-center justify-center">
                    {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
                  </div>
                  <div className="text-left text-xs">
                    <span className="block font-semibold leading-tight">{user.fullName || user.username}</span>
                    <span className="block text-[10px] text-slate-400 uppercase font-medium">
                      {user.role} {user.username ? `• ${user.username}` : ''}
                    </span>
                  </div>
                </button>

                <button
                  onClick={logout}
                  className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActiveTab('auth-login')}
                className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-md shadow-brand-500/20 transition-all hover:scale-105"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-slate-200 dark:border-slate-800 px-4 py-4 space-y-2">
          {navItems.map(item => {
            if (item.requiresAuth && !user) return null;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium ${
                  activeTab === item.id
                    ? 'bg-brand-500 text-white font-semibold'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}

          {user ? (
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <button
                onClick={() => {
                  setActiveTab('profile');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <User className="w-5 h-5 text-brand-500" />
                Profile ({user.username})
              </button>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setActiveTab('auth-login');
                setMobileMenuOpen(false);
              }}
              className="w-full mt-2 py-3 rounded-xl font-semibold text-white bg-brand-600 text-center"
            >
              Sign In
            </button>
          )}
        </div>
      )}

      {/* Suggestion & Complaint Submission Modal */}
      <SuggestionModal
        isOpen={suggestionOpen}
        onClose={() => setSuggestionOpen(false)}
        user={user}
      />
    </header>
  );
}
