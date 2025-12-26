
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
import { TrendingUp } from 'lucide-react';

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
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header role={role} studentName={user.name} />
          <main className="flex-1 overflow-y-auto p-4 lg:p-10 bg-slate-50/50">
            {renderPrivateContent()}
          </main>
        </div>
      </div>
    );
  }

  const renderPublicContent = () => {
    switch (activeTab) {
      case 'features': return <FeaturesModule />;
      case 'examguide': return <ExamGuideModule />;
      case 'blog': return <BlogModule data={studentData} />;
      case 'contact': return <ContactModule data={studentData} />;
      case 'login': return <LoginModule onLoginSuccess={onLoginSuccess} onCancel={() => setActiveTab('about')} onNavigate={setActiveTab} />;
      default: return <LandingPage onLogin={() => setActiveTab('login')} studentData={studentData} setStudentData={syncStudentData} />;
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1">
        {renderPublicContent()}
      </main>
      <footer className="py-20 border-t border-slate-100 mt-20">
         <div className="max-w-7xl mx-auto px-6 text-center space-y-6">
            <div className="flex items-center justify-center gap-2 opacity-50">
               <TrendingUp className="w-5 h-5 text-blue-600" />
               <span className="font-black tracking-tighter text-xl uppercase italic text-slate-900">IITGEE<span className="text-indigo-600">PREP</span></span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">&copy; 2025 Solaris Hub Intelligence.</p>
         </div>
      </footer>
    </div>
  );
};

export default App;
