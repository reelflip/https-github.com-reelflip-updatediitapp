
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
import { LayoutDashboard, BookOpen, Bot, FileText, Menu, Settings } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [studentData, setStudentData] = useState<StudentData>(INITIAL_STUDENT_DATA);
  const [activeTab, setActiveTab] = useState<string>('about');

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('jeepro_user');
      const savedData = localStorage.getItem('jeepro_student_data');
      
      if (savedUser && savedUser !== 'undefined') {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser && parsedUser.id) {
          setUser(parsedUser);
          setRole(parsedUser.role);
          
          if (savedData && savedData !== 'undefined') {
            const parsedData = JSON.parse(savedData);
            if (parsedData && parsedData.chapters) {
              setStudentData(parsedData);
            } else {
              loadUserData(parsedUser);
            }
          } else {
            loadUserData(parsedUser);
          }
        }
      }
    } catch (e) {
      console.error("Storage Recovery Failed:", e);
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
    
    const targetTab = authenticatedUser.role === UserRole.ADMIN ? 'admin-overview' : 
                      authenticatedUser.role === UserRole.PARENT ? 'parent-status' : 'dashboard';
    setActiveTab(targetTab);
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
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-100 px-2 py-3 flex justify-around items-center z-[100] safe-pb shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
      {[
        { id: role === UserRole.ADMIN ? 'admin-overview' : role === UserRole.PARENT ? 'parent-status' : 'dashboard', label: 'Home', icon: LayoutDashboard },
        { id: role === UserRole.ADMIN ? 'admin-syllabus' : role === UserRole.PARENT ? 'parent-syllabus' : 'learn', label: 'Learn', icon: BookOpen },
        { id: role === UserRole.ADMIN ? 'admin-system' : 'aitutor', label: role === UserRole.ADMIN ? 'Core' : 'Coach', icon: role === UserRole.ADMIN ? Settings : Bot },
        { id: role === UserRole.ADMIN ? 'admin-tests' : 'tests', label: 'Exams', icon: FileText },
        { id: 'profile', label: 'Menu', icon: Menu },
      ].map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`flex flex-col items-center gap-1 transition-all px-4 py-1 rounded-xl ${activeTab === item.id ? 'text-indigo-600' : 'text-slate-400'}`}
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
        case 'wellness': return <WellnessModule data={studentData} />;
        case 'psychometric': return <PsychometricTest data={studentData} setData={syncStudentData} />;
        case 'flashcards': return <FlashcardsModule data={studentData} />;
        case 'hacks': return <HacksModule data={studentData} />;
        case 'timetable': return <TimetableModule data={studentData} setData={syncStudentData} />;
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
      <div className="flex h-screen overflow-hidden bg-[#fcfdfe] font-sans">
        <Sidebar role={role} activeTab={activeTab} setActiveTab={setActiveTab} setRole={setRole} handleLogout={handleLogout} />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          <Header role={role} studentName={user.name} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10 pb-24 lg:pb-10 custom-scrollbar">
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
      case 'blog': return <BlogModule data={studentData} />;
      case 'contact': return <ContactModule data={studentData} />;
      case 'login': return <LoginModule onLoginSuccess={onLoginSuccess} onCancel={() => setActiveTab('about')} onNavigate={setActiveTab} />;
      default: return <AboutModule />;
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col overflow-x-hidden">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 w-full">
        {renderPublicContent()}
      </main>
      <footer className="py-12 md:py-20 border-t border-slate-100 bg-white relative z-10 px-6 safe-pb">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="flex items-center gap-1">
                 <span className="font-black tracking-tight text-2xl uppercase text-[#2b4c8c]">IITJEEPRO</span>
              </div>
              <p className="text-xs font-bold text-slate-400">Solaris v10.5: Elite Performance Engine.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-6 md:gap-12">
               {['Methodology', 'Functionality', 'Privacy', 'Legal'].map(link => (
                 <button key={link} className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors">{link}</button>
               ))}
            </div>
            <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest">&copy; 2025 Solaris Ultimate v10.5</p>
         </div>
      </footer>
    </div>
  );
};

export default App;