import React, { useState, useEffect, Suspense, lazy } from 'react';
import { UserRole, StudentData, UserAccount } from './types';
import { INITIAL_STUDENT_DATA } from './mockData';
import { api } from './services/apiService';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { 
  LayoutDashboard, BookOpen, Bot, FileText, Menu, Settings, 
  Loader2, X, LogOut, Brain, Timer, BarChart3, Calendar, 
  RefreshCw, AlertCircle, Layers, ListChecks, Lightbulb, 
  Heart, User, UserPlus, Target, FileCode, Inbox, Users, PenTool
} from 'lucide-react';

const AboutModule = lazy(() => import('./views/AboutModule'));
const FeaturesModule = lazy(() => import('./views/FeaturesModule'));
const ExamGuideModule = lazy(() => import('./views/ExamGuideModule'));
const BlogModule = lazy(() => import('./views/BlogModule'));
const ContactModule = lazy(() => import('./views/ContactModule'));
const LoginModule = lazy(() => import('./views/LoginModule'));
const StudentDashboard = lazy(() => import('./views/StudentDashboard'));
const ParentDashboard = lazy(() => import('./views/ParentDashboard'));
const AdminCMS = lazy(() => import('./views/AdminCMS'));
const LearnModule = lazy(() => import('./views/LearnModule'));
const AITutor = lazy(() => import('./views/AITutor'));
const TestsView = lazy(() => import('./views/TestsView'));
const AnalyticsView = lazy(() => import('./views/AnalyticsView'));
const WellnessModule = lazy(() => import('./views/WellnessModule'));
const PsychometricTest = lazy(() => import('./views/PsychometricTest'));
const FlashcardsModule = lazy(() => import('./views/FlashcardsModule'));
const HacksModule = lazy(() => import('./views/HacksModule'));
const TimetableModule = lazy(() => import('./views/TimetableModule'));
const RevisionModule = lazy(() => import('./views/RevisionModule'));
const MistakesLog = lazy(() => import('./views/MistakesLog'));
const BacklogModule = lazy(() => import('./views/BacklogModule'));
const FocusTimer = lazy(() => import('./views/FocusTimer'));
const ProfileModule = lazy(() => import('./views/ProfileModule'));

const LoadingFallback = () => (
  <div className="flex h-full w-full items-center justify-center p-20">
    <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
  </div>
);

const App: React.FC = () => {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [studentData, setStudentData] = useState<StudentData>(INITIAL_STUDENT_DATA);
  const [activeTab, setActiveTab] = useState<string>('about');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const savedUser = localStorage.getItem('jeepro_user');
        if (savedUser && savedUser !== 'undefined') {
          const parsedUser = JSON.parse(savedUser);
          if (parsedUser && parsedUser.id) {
            setUser(parsedUser);
            setRole(parsedUser.role);
            await loadUserData(parsedUser);
          }
        }
      } catch (e) {
        console.error("Storage Recovery Failed:", e);
        localStorage.removeItem('jeepro_user');
      }
    };
    initializeApp();
  }, []);

  const loadUserData = async (currentUser: UserAccount) => {
    try {
      const data = await api.getStudentData(currentUser.id);
      setStudentData(data);
      localStorage.setItem(`jeepro_data_${currentUser.id}`, JSON.stringify(data));
      localStorage.setItem('jeepro_student_data', JSON.stringify(data));
    } catch (err) {
      console.error("Failed to load ecosystem context", err);
    }
  };

  const onLoginSuccess = (authenticatedUser: UserAccount) => {
    localStorage.removeItem('jeepro_student_data');
    setUser(authenticatedUser);
    setRole(authenticatedUser.role);
    localStorage.setItem('jeepro_user', JSON.stringify(authenticatedUser));
    loadUserData(authenticatedUser);
    const targetTab = authenticatedUser.role === UserRole.ADMIN ? 'admin-overview' : 
                      authenticatedUser.role === UserRole.PARENT ? 'parent-status' : 'dashboard';
    setActiveTab(targetTab);
  };

  const handleLogout = () => {
    localStorage.removeItem('jeepro_user');
    localStorage.removeItem('jeepro_student_data');
    setUser(null);
    setActiveTab('about');
    setIsMobileMenuOpen(false);
  };

  const syncStudentData = async (newData: StudentData) => {
    if (newData && newData.chapters && newData.chapters.length > 0) {
        setStudentData(newData);
        localStorage.setItem('jeepro_student_data', JSON.stringify(newData));
        if (user) {
          await api.updateStudentData(user.id, newData);
        }
    }
  };

  const MobileMenuOverlay = () => {
    if (!isMobileMenuOpen) return null;

    const studentLinks = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'learn', label: 'My Syllabus', icon: BookOpen },
      { id: 'aitutor', label: 'AI Tutor', icon: Bot },
      { id: 'tests', label: 'Tests & Exams', icon: FileText },
      { id: 'psychometric', label: 'Mindset Test', icon: Brain },
      { id: 'focus', label: 'Focus Timer', icon: Timer },
      { id: 'analytics', label: 'Analytics', icon: BarChart3 },
      { id: 'timetable', label: 'Schedule', icon: Calendar },
      { id: 'revision', label: 'Revision', icon: RefreshCw },
      { id: 'mistakes', label: 'My Mistakes', icon: AlertCircle },
      { id: 'flashcards', label: 'Memory Cards', icon: Layers },
      { id: 'backlogs', label: 'Backlogs', icon: ListChecks },
      { id: 'hacks', label: 'Study Hacks', icon: Lightbulb },
      { id: 'wellness', label: 'Wellness', icon: Heart },
      { id: 'profile', label: 'Profile Settings', icon: User },
    ];

    const adminLinks = [
      { id: 'admin-overview', label: 'Admin Overview', icon: LayoutDashboard },
      { id: 'admin-users', label: 'User Management', icon: Users },
      { id: 'admin-messages', label: 'Admin Inbox', icon: Inbox },
      { id: 'admin-syllabus', label: 'Syllabus Editor', icon: BookOpen },
      { id: 'admin-questions', label: 'Question Bank', icon: FileCode },
      { id: 'admin-tests', label: 'Mock Test Admin', icon: FileText },
      { id: 'admin-flashcards', label: 'Card Manager', icon: Layers },
      { id: 'admin-hacks', label: 'Hack Manager', icon: Lightbulb },
      { id: 'admin-blogs', label: 'Blog Manager', icon: PenTool },
      { id: 'admin-system', label: 'System Settings', icon: Settings },
    ];

    const parentLinks = [
      { id: 'parent-status', label: 'Student Pulse', icon: Target },
      { id: 'parent-analytics', label: 'Performance', icon: BarChart3 },
      { id: 'parent-syllabus', label: 'Syllabus', icon: BookOpen },
      { id: 'parent-psychometric', label: 'Mental State', icon: Brain },
      { id: 'parent-connect', label: 'Connect Student', icon: UserPlus },
    ];

    const currentLinks = role === UserRole.ADMIN ? adminLinks : role === UserRole.PARENT ? parentLinks : studentLinks;

    return (
      <div className="fixed inset-0 z-[150] bg-[#0a1128] text-white flex flex-col animate-in slide-in-from-bottom duration-300">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                <Menu className="w-5 h-5 text-white" />
             </div>
             <span className="font-black uppercase tracking-tighter text-lg italic font-space">Menu Control</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/10">
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-2 custom-scrollbar">
          {currentLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => { setActiveTab(link.id); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-5 p-5 rounded-2xl text-sm font-black italic tracking-tight transition-all border ${
                activeTab === link.id 
                ? 'bg-indigo-600 border-indigo-500 shadow-xl'
                : 'bg-white/5 border-white/5 hover:bg-white/10'
              }`}
            >
              <link.icon className={`w-5 h-5 ${activeTab === link.id ? 'text-white' : 'text-slate-400'}`} />
              {link.label}
            </button>
          ))}
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-5 p-5 bg-rose-600/10 border border-rose-500/20 text-rose-500 rounded-2xl text-sm font-black italic tracking-tight transition-all mt-4"
          >
            <LogOut className="w-5 h-5" /> Sign Out Protocol
          </button>
        </div>
      </div>
    );
  };

  const BottomNav = () => (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-100 px-2 py-3 pb-safe flex justify-around items-center z-[100] shadow-[0_-10px_30px_rgba(0,0,0,0.08)]">
      {[
        { id: role === UserRole.ADMIN ? 'admin-overview' : role === UserRole.PARENT ? 'parent-status' : 'dashboard', label: 'Home', icon: LayoutDashboard },
        { id: role === UserRole.ADMIN ? 'admin-syllabus' : role === UserRole.PARENT ? 'parent-syllabus' : 'learn', label: 'Learn', icon: BookOpen },
        { id: role === UserRole.ADMIN ? 'admin-system' : 'aitutor', label: role === UserRole.ADMIN ? 'Core' : 'Coach', icon: role === UserRole.ADMIN ? Settings : Bot },
        { id: role === UserRole.ADMIN ? 'admin-tests' : 'tests', label: 'Exams', icon: FileText },
        { id: 'mobile-menu', label: 'Menu', icon: Menu },
      ].map((item) => (
        <button
          key={item.id}
          onClick={() => {
            if (item.id === 'mobile-menu') {
              setIsMobileMenuOpen(true);
            } else {
              setActiveTab(item.id);
            }
          }}
          className={`flex flex-col items-center gap-1 transition-all px-4 py-1 rounded-xl active:scale-90 ${
            (item.id !== 'mobile-menu' && activeTab === item.id) || (item.id === 'mobile-menu' && isMobileMenuOpen) 
            ? 'text-indigo-600' : 'text-slate-400'
          }`}
        >
          <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'stroke-[2.5px]' : 'stroke-[2px]'}`} />
          <span className="text-[10px] font-black uppercase tracking-tighter">{item.label}</span>
        </button>
      ))}
    </div>
  );

  if (user) {
    const renderPrivateContent = () => {
      if (role === UserRole.PARENT || activeTab.startsWith('parent-')) return <ParentDashboard data={studentData} externalActiveTab={activeTab} />;
      if (role === UserRole.ADMIN || activeTab.startsWith('admin-')) return <AdminCMS activeTab={activeTab} data={studentData} setData={syncStudentData} />;
      switch (activeTab) {
        case 'dashboard': return <StudentDashboard data={studentData} />;
        case 'learn': return <LearnModule data={studentData} setData={syncStudentData} />;
        case 'aitutor': return <AITutor data={studentData} />;
        case 'tests': return <TestsView data={studentData} setData={syncStudentData} />;
        case 'analytics': return <AnalyticsView data={studentData} />;
        case 'wellness': return <WellnessModule data={studentData} setData={syncStudentData} />;
        case 'psychometric': return <PsychometricTest data={studentData} setData={syncStudentData} />;
        case 'flashcards': return <FlashcardsModule data={studentData} />;
        case 'hacks': return <HacksModule data={studentData} />;
        case 'timetable': return <TimetableModule data={studentData} setData={syncStudentData} />;
        case 'revision': return <RevisionModule data={studentData} />;
        case 'mistakes': return <MistakesLog data={studentData} />;
        case 'backlogs': return <BacklogModule data={studentData} />;
        case 'focus': return <FocusTimer />;
        case 'profile': return <ProfileModule data={studentData} setData={syncStudentData} />;
        default: return <StudentDashboard data={studentData} />;
      }
    };

    return (
      <div className="flex h-screen overflow-hidden bg-[#fcfdfe] font-sans app-height">
        <Sidebar role={role} activeTab={activeTab} setActiveTab={setActiveTab} setRole={setRole} handleLogout={handleLogout} />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          <Header role={role} studentName={user.name} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10 pb-24 lg:pb-10 custom-scrollbar overscroll-contain">
            <Suspense fallback={<LoadingFallback />}>
              {renderPrivateContent()}
            </Suspense>
          </main>
          <BottomNav />
          <MobileMenuOverlay />
        </div>
      </div>
    );
  }

  const renderPublicContent = () => {
    switch (activeTab) {
      case 'features': return <FeaturesModule />;
      case 'examguide': return <ExamGuideModule />;
      case 'blog': return <BlogModule data={studentData} />;
      case 'contact': return <ContactModule data={studentData} setData={syncStudentData} />;
      case 'login': return <LoginModule onLoginSuccess={onLoginSuccess} onCancel={() => setActiveTab('about')} onNavigate={setActiveTab} />;
      default: return <AboutModule />;
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col overflow-x-hidden">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 w-full">
        <Suspense fallback={<LoadingFallback />}>
          {renderPublicContent()}
        </Suspense>
      </main>
      <footer className="py-12 md:py-20 border-t border-slate-100 bg-white relative z-10 px-6 safe-pb">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="flex items-center gap-1">
                 <span className="font-black tracking-tight text-2xl uppercase text-[#2b4c8c]">IITGEEPREP</span>
              </div>
              <p className="text-xs font-bold text-slate-400">Solaris v22.0: Elite Performance Engine.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-6 md:gap-12">
               {['About Us', 'Features', 'Privacy', 'Legal'].map(link => (
                 <button key={link} onClick={() => setActiveTab(link === 'About Us' ? 'about' : link === 'Features' ? 'features' : activeTab)} className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors">{link}</button>
               ))}
            </div>
            <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest">&copy; 2025 Solaris Ultimate v22.0</p>
         </div>
      </footer>
    </div>
  );
};

export default App;