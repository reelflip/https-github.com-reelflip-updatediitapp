import React, { useState, useEffect } from 'react';
import { UserRole, StudentData, UserAccount } from './types';
import { INITIAL_STUDENT_DATA } from './mockData';
import { api } from './services/apiService';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AboutModule from './views/AboutModule';
import FeaturesModule from './views/FeaturesModule';
import ExamGuideModule from './views/ExamGuideModule';
import BlogModule from './views/BlogModule';
import ContactModule from './views/ContactModule';
import LoginModule from './views/LoginModule';
import LandingPage from './views/LandingPage';
import StudentDashboard from './views/StudentDashboard';
import ParentDashboard from './views/ParentDashboard';
import AdminCMS from './views/AdminCMS';
import LearnModule from './views/LearnModule';
import AITutor from './views/AITutor';
import TestsView from './views/TestsView';
import AnalyticsView from './views/AnalyticsView';
import WellnessModule from './views/WellnessModule';
import PsychometricTest from './views/PsychometricTest';
import FlashcardsModule from './views/FlashcardsModule';
import HacksModule from './views/HacksModule';
import TimetableModule from './views/TimetableModule';
import RevisionModule from './views/RevisionModule';
import MistakesLog from './views/MistakesLog';
import BacklogModule from './views/BacklogModule';
import FocusTimer from './views/FocusTimer';
import ProfileModule from './views/ProfileModule';
import { TrendingUp, LayoutDashboard, BookOpen, Bot, FileText, Menu } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [studentData, setStudentData] = useState<StudentData>(INITIAL_STUDENT_DATA);
  const [activeTab, setActiveTab] = useState<string>('about');

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('jeepro_user');
      const savedData = localStorage.getItem('jeepro_student_data');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setRole(parsedUser.role);
        if (savedData) setStudentData(JSON.parse(savedData));
        else loadUserData(parsedUser);
      }
    } catch (e) {
      localStorage.removeItem('jeepro_user');
      localStorage.removeItem('jeepro_student_data');
    }
  }, []);

  const loadUserData = async (currentUser: UserAccount) => {
    try {
      if (currentUser.role === UserRole.STUDENT) {
        const data = await api.getStudentData(currentUser.id);
        setStudentData(data);
        localStorage.setItem('jeepro_student_data', JSON.stringify(data));
      }
    } catch (err) {
      console.error("Failed to load student context", err);
    }
  };

  const onLoginSuccess = (authenticatedUser: UserAccount) => {
    setUser(authenticatedUser);
    setRole(authenticatedUser.role);
    localStorage.setItem('jeepro_user', JSON.stringify(authenticatedUser));
    loadUserData(authenticatedUser);
    setActiveTab(authenticatedUser.role === UserRole.ADMIN ? 'admin-overview' : authenticatedUser.role === UserRole.PARENT ? 'parent-status' : 'dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('jeepro_user');
    localStorage.removeItem('jeepro_student_data');
    setUser(null);
    setActiveTab('about');
  };

  const syncStudentData = async (newData: StudentData) => {
    setStudentData(newData);
    localStorage.setItem('jeepro_student_data', JSON.stringify(newData));
    if (user && user.role === UserRole.STUDENT) {
      await api.updateStudentData(user.id, newData);
    }
  };

  const BottomNav = () => (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0a0c1a]/95 backdrop-blur-xl border-t border-[#1e2440] px-6 py-3 flex justify-between items-center z-[100]">
      {[
        { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
        { id: 'learn', label: 'Study', icon: BookOpen },
        { id: 'aitutor', label: 'AI', icon: Bot },
        { id: 'tests', label: 'Tests', icon: FileText },
        { id: 'profile', label: 'Menu', icon: Menu },
      ].map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === item.id ? 'text-[#5d5fef]' : 'text-slate-500'}`}
        >
          <item.icon className="w-5 h-5" />
          <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
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
        case 'wellness': return <WellnessModule data={studentData} />;
        case 'psychometric': return <PsychometricTest data={studentData} setData={syncStudentData} />;
        case 'flashcards': return <FlashcardsModule data={studentData} />;
        case 'hacks': return <HacksModule data={studentData} />;
        case 'timetable': return <TimetableModule data={studentData} />;
        case 'revision': return <RevisionModule data={studentData} />;
        case 'mistakes': return <MistakesLog data={studentData} />;
        case 'backlogs': return <BacklogModule data={studentData} />;
        case 'focus': return <FocusTimer />;
        case 'profile': return <ProfileModule data={studentData} setData={syncStudentData} />;
        case 'blog': return <BlogModule data={studentData} />;
        default: return <StudentDashboard data={studentData} />;
      }
    };

    return (
      <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
        <Sidebar role={role} activeTab={activeTab} setActiveTab={setActiveTab} setRole={setRole} handleLogout={handleLogout} />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden pb-20 lg:pb-0">
          <Header role={role} studentName={user.name} />
          <main className="flex-1 overflow-y-auto p-4 lg:p-10 bg-slate-50/50">
            {renderPrivateContent()}
          </main>
          <BottomNav />
        </div>
      </div>
    );
  }

  const renderPublicContent = () => {
    switch (activeTab) {
      case 'features': return <FeaturesModule />;
      case 'examguide': return <ExamGuideModule />;
      case 'contact': return <ContactModule data={studentData} />;
      case 'login': return <LoginModule onLoginSuccess={onLoginSuccess} onCancel={() => setActiveTab('about')} onNavigate={setActiveTab} />;
      default: return <LandingPage onLogin={() => setActiveTab('login')} studentData={studentData} setStudentData={syncStudentData} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0c1a] font-sans flex flex-col overflow-x-hidden">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 flex flex-col items-center w-full">
        <div className="w-full max-w-[1600px]">
          {renderPublicContent()}
        </div>
      </main>
      <footer className="py-20 border-t border-[#1e2440] bg-[#0a0c1a] relative z-10 px-6">
         <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="flex items-center gap-3">
                 <TrendingUp className="w-6 h-6 text-[#5d5fef]" />
                 <span className="font-black tracking-tighter text-2xl uppercase italic text-white">IITGEE<span className="text-[#5d5fef]">PREP</span></span>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#4a5578] text-center md:text-left">Operational Intelligence Gateway v6.7</p>
            </div>
            <div className="flex flex-wrap justify-center gap-8 md:gap-12">
               {['About', 'Features', 'Privacy', 'Compliance'].map(link => (
                 <button key={link} className="text-[9px] font-black uppercase text-[#4a5578] tracking-widest hover:text-white transition-colors">{link}</button>
               ))}
            </div>
            <p className="text-[9px] font-black uppercase tracking-widest text-[#2d3656] text-center md:text-right">&copy; 2025 Solaris Hub Intelligence.</p>
         </div>
      </footer>
    </div>
  );
};

export default App;