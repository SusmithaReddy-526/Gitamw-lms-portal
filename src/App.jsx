import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

import { LandingPage } from './pages/LandingPage';
import { AuthModal } from './pages/AuthModal';
import { StudentDashboard } from './pages/StudentDashboard';
import { YearPage } from './pages/YearPage';
import { BranchPage } from './pages/BranchPage';
import { UnitPage } from './pages/UnitPage';
import { TopicViewPage } from './pages/TopicViewPage';
import { FacultyDashboard } from './pages/FacultyDashboard';
import { AdminPanel } from './pages/AdminPanel';
import { GlobalSearch } from './pages/GlobalSearch';
import { ProfilePage } from './pages/ProfilePage';
import { DownloadsPage } from './pages/DownloadsPage';
import { AttendancePage } from './pages/AttendancePage';

function MainContent() {
  const { user } = useAuth();

  // Tab / View navigation state
  const [activeTab, setActiveTab] = useState('home');

  // Hierarchy Selection State
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);

  // Auth Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalRole, setAuthModalRole] = useState('student');

  // Auto-route on login status change
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') setActiveTab('admin');
      else if (user.role === 'faculty') setActiveTab('faculty-portal');
      else setActiveTab('dashboard');
    } else {
      setActiveTab('home');
    }
  }, [user]);

  const handleOpenAuth = (role = 'student') => {
    setAuthModalRole(role);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (loggedUser) => {
    if (loggedUser.role === 'admin') {
      setActiveTab('admin');
    } else if (loggedUser.role === 'faculty') {
      setActiveTab('faculty-portal');
    } else {
      setActiveTab('dashboard');
    }
  };

  // Hierarchy Navigation Handlers
  const handleSelectYear = (yrId) => {
    setSelectedYear(yrId);
    setActiveTab('year-view');
  };

  const handleSelectBranch = (brId) => {
    setSelectedBranch(brId);
    setActiveTab('branch-view');
  };

  const handleSelectUnitTopic = (subject, unit) => {
    setSelectedSubject(subject);
    setSelectedUnit(unit);
    setActiveTab('unit-view');
  };

  const handleOpenTopic = (subject, unit, topic) => {
    setSelectedSubject(subject);
    setSelectedUnit(unit);
    setSelectedTopic(topic);
    setActiveTab('topic-view');
  };

  // Protection Guard: If not logged in and requesting protected page, prompt auth
  const renderActiveView = () => {
    if (!user && activeTab !== 'search') {
      return (
        <LandingPage 
          onOpenAuth={handleOpenAuth} 
          onSelectYear={handleSelectYear}
          user={user}
        />
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return user ? <StudentDashboard user={user} onSelectYear={handleSelectYear} /> : <LandingPage onOpenAuth={handleOpenAuth} onSelectYear={handleSelectYear} user={user} />;
      
      case 'year-view':
        return (
          <YearPage 
            selectedYear={selectedYear} 
            studentBranch={user?.branch || 'CSE'}
            onSelectBranch={handleSelectBranch}
            onBack={() => setActiveTab('dashboard')}
          />
        );

      case 'branch-view':
        return (
          <BranchPage 
            selectedYear={selectedYear} 
            selectedBranch={selectedBranch}
            onSelectUnitTopic={handleSelectUnitTopic}
            onBack={() => setActiveTab('year-view')}
            user={user}
          />
        );

      case 'unit-view':
        return selectedSubject && selectedUnit ? (
          <UnitPage 
            subject={selectedSubject} 
            unit={selectedUnit}
            onOpenTopic={handleOpenTopic}
            onBack={() => setActiveTab('branch-view')}
          />
        ) : (user ? <StudentDashboard user={user} onSelectYear={handleSelectYear} /> : <LandingPage onOpenAuth={handleOpenAuth} onSelectYear={handleSelectYear} user={user} />);

      case 'topic-view':
        return selectedTopic ? (
          <TopicViewPage 
            topic={selectedTopic}
            subject={selectedSubject}
            unit={selectedUnit}
            user={user}
            onBack={() => setActiveTab('unit-view')}
          />
        ) : (user ? <StudentDashboard user={user} onSelectYear={handleSelectYear} /> : <LandingPage onOpenAuth={handleOpenAuth} onSelectYear={handleSelectYear} user={user} />);

      case 'subjects':
        return (
          <BranchPage 
            selectedYear={user?.year || '2nd'} 
            selectedBranch={user?.branch || 'CSE'}
            onSelectUnitTopic={handleSelectUnitTopic}
            onBack={() => setActiveTab(user ? 'dashboard' : 'home')}
            user={user}
          />
        );

      case 'faculty-portal':
        return user?.role === 'faculty' ? <FacultyDashboard user={user} /> : <LandingPage onOpenAuth={handleOpenAuth} onSelectYear={handleSelectYear} user={user} />;

      case 'admin':
        return user?.role === 'admin' ? <AdminPanel /> : <LandingPage onOpenAuth={handleOpenAuth} onSelectYear={handleSelectYear} user={user} />;

      case 'search':
        return user?.role === 'admin' ? <AdminPanel /> : <GlobalSearch onSelectTopic={handleOpenTopic} />;

      case 'profile':
        return user ? <ProfilePage /> : <LandingPage onOpenAuth={handleOpenAuth} onSelectYear={handleSelectYear} user={user} />;

      case 'downloads':
        return user?.role === 'admin' ? <AdminPanel /> : (user?.role === 'faculty' ? <FacultyDashboard user={user} /> : (user ? <DownloadsPage user={user} onSelectTopic={handleOpenTopic} /> : <LandingPage onOpenAuth={handleOpenAuth} onSelectYear={handleSelectYear} user={user} />));

      case 'attendance':
        return user?.role === 'admin' ? <AdminPanel /> : (user ? <AttendancePage user={user} /> : <LandingPage onOpenAuth={handleOpenAuth} onSelectYear={handleSelectYear} user={user} />);

      case 'home':
      default:
        if (!user) {
          return <LandingPage onOpenAuth={handleOpenAuth} onSelectYear={handleSelectYear} user={user} />;
        }
        if (user.role === 'admin') return <AdminPanel />;
        if (user.role === 'faculty') return <FacultyDashboard user={user} />;
        return <StudentDashboard user={user} onSelectYear={handleSelectYear} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-brand-500 selection:text-white">
      <div>
        <Navbar 
          activeTab={activeTab} 
          setActiveTab={(tab) => {
            if (tab === 'auth-login') {
              handleOpenAuth('student');
            } else {
              setActiveTab(tab);
            }
          }} 
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          {renderActiveView()}
        </main>
      </div>

      <Footer />

      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        initialRole={authModalRole}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
