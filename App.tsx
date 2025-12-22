
import React, { useState, useEffect } from 'react';
import { UserRole, StudentData } from './types';
import { INITIAL_STUDENT_DATA } from './mockData';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StudentDashboard from './views/StudentDashboard';
import ParentDashboard from './views/ParentDashboard';
import AdminCMS from './views/AdminCMS';
import FlashcardsModule from './views/FlashcardsModule';
import LearnModule from './views/LearnModule';
import AITutor from './views/AITutor';
import FocusTimer from './views/FocusTimer';
import MistakesLog from './views/MistakesLog';
import WellnessModule from './views/WellnessModule';
import AnalyticsView from './views/AnalyticsView';
import TimetableModule from './views/TimetableModule';
import RevisionModule from './views/RevisionModule';
import HacksModule from './views/HacksModule';
import TestsView from './views/TestsView';
import PsychometricTest from './views/PsychometricTest';
import ProfileModule from './views/ProfileModule';
import BacklogModule from './views/BacklogModule';
import LandingPage from './views/LandingPage';
import { Brain, Sparkles, Lock, Mail, User as UserIcon, ArrowLeft, ShieldCheck, UserCheck } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  
  // Initialize student data and check for persisted data source mode
  const [studentData, setStudentData] = useState<StudentData>(() => {
    const savedMode = localStorage.getItem('jeepro_data_source');
    return {
      ...INITIAL_STUDENT_DATA,
      dataSourceMode: (savedMode as 'MOCK' | 'LIVE') || 'MOCK'
    };
  });
  
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isAuthMode, setIsAuthMode] = useState<'login' | 'register' | 'forgot' | 'landing'>('landing');

  const showDemoLogins = (window as any).SHOW_DEMO_LOGINS !== false;

  useEffect(() => {
    // Synchronize window global and localStorage for apiService and persistence
    (window as any).DATA_SOURCE_MODE = studentData.dataSourceMode;
    if (studentData.dataSourceMode) {
      localStorage.setItem('jeepro_data_source', studentData.dataSourceMode);
    }
  }, [studentData.dataSourceMode]);

  useEffect(() => {
    const savedUser = localStorage.getItem('jeepro_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setRole(parsedUser.role);
      if (parsedUser.role === UserRole.PARENT && activeTab === 'dashboard') {
        setActiveTab('parent-status');
      }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const mockUser = { id: 1, name: 'Aryan Sharma', email: 'aryan@example.com', role: role };
    setUser(mockUser);
    localStorage.setItem('jeepro_user', JSON.stringify(mockUser));
    
    if (role === UserRole.ADMIN) {
      setActiveTab('admin-overview');
    } else if (role === UserRole.PARENT) {
      setActiveTab('parent-status');
    } else {
      setActiveTab('dashboard');
    }
  };

  const handleDemoLogin = (demoRole: UserRole) => {
    const mockUser = { id: Date.now(), name: 'Demo User', email: `demo@jeepro.in`, role: demoRole };
    setRole(demoRole);
    setUser(mockUser);
    localStorage.setItem('jeepro_user', JSON.stringify(mockUser));
    
    if (demoRole === UserRole.ADMIN) {
      setActiveTab('admin-overview');
    } else if (demoRole === UserRole.PARENT) {
      setActiveTab('parent-status');
    } else {
      setActiveTab('dashboard');
    }
  };

  if (!user && isAuthMode === 'landing') {
    return <LandingPage onLogin={() => setIsAuthMode('login')} studentData={studentData} setStudentData={setStudentData} />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full space-y-8 animate-in fade-in zoom-in-95 duration-500">
           <div className="text-center">
              <button onClick={() => setIsAuthMode('landing')} className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <Brain className="text-white w-10 h-10" />
              </button>
              <h1 className="text-4xl font-black text-white tracking-tighter italic">JEE-PRO</h1>
           </div>

           <div className="bg-slate-900 p-10 rounded-[2.5rem] border border-slate-800 shadow-2xl">
              <div className="flex bg-slate-800 p-1 rounded-2xl mb-8">
                <button onClick={() => setIsAuthMode('login')} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${isAuthMode === 'login' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>Login</button>
                <button onClick={() => setIsAuthMode('register')} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${isAuthMode === 'register' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>Sign Up</button>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <input type="email" required className="w-full bg-slate-800 border-none rounded-2xl py-4 px-6 text-white" placeholder="Email" />
                <input type="password" required className="w-full bg-slate-800 border-none rounded-2xl py-4 px-6 text-white" placeholder="Password" />
                <div className="grid grid-cols-2 gap-3">
                    {Object.values(UserRole).filter(r => r !== UserRole.ADMIN).map(r => (
                      <button key={r} type="button" onClick={() => setRole(r)} className={`py-3 rounded-2xl text-xs font-black uppercase border-2 ${role === r ? 'border-indigo-600 text-indigo-400' : 'border-slate-800 text-slate-500'}`}>{r}</button>
                    ))}
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl">Launch</button>
              </form>

              {showDemoLogins && (
                <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-3 gap-2">
                   <button onClick={() => handleDemoLogin(UserRole.STUDENT)} className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-slate-800"><UserIcon className="w-4 h-4 text-indigo-400" /><span className="text-[9px] text-slate-500">Student</span></button>
                   <button onClick={() => handleDemoLogin(UserRole.PARENT)} className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-slate-800"><UserCheck className="w-4 h-4 text-rose-400" /><span className="text-[9px] text-slate-500">Parent</span></button>
                   <button onClick={() => handleDemoLogin(UserRole.ADMIN)} className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-slate-800"><ShieldCheck className="w-4 h-4 text-emerald-400" /><span className="text-[9px] text-slate-500">Admin</span></button>
                </div>
              )}
           </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (role === UserRole.PARENT || activeTab.startsWith('parent-')) {
      return <ParentDashboard data={studentData} externalActiveTab={activeTab} />;
    }
    if (role === UserRole.ADMIN || activeTab.startsWith('admin-')) {
      return <AdminCMS activeTab={activeTab} data={studentData} setData={setStudentData} />;
    }
    switch (activeTab) {
      case 'dashboard': return <StudentDashboard data={studentData} />;
      case 'learn': return <LearnModule data={studentData} setData={setStudentData} />;
      case 'aitutor': return <AITutor data={studentData} />;
      case 'tests': return <TestsView data={studentData} />;
      case 'analytics': return <AnalyticsView data={studentData} />;
      case 'wellness': return <WellnessModule data={studentData} />;
      case 'psychometric': return <PsychometricTest data={studentData} setData={setStudentData} />;
      case 'flashcards': return <FlashcardsModule data={studentData} />;
      case 'hacks': return <HacksModule data={studentData} />;
      case 'timetable': return <TimetableModule data={studentData} />;
      case 'revision': return <RevisionModule data={studentData} />;
      case 'mistakes': return <MistakesLog data={studentData} />;
      case 'backlogs': return <BacklogModule data={studentData} />;
      case 'focus': return <FocusTimer />;
      case 'profile': return <ProfileModule data={studentData} setData={setStudentData} />;
      default: return <div className="text-center p-20">Module Loading...</div>;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      <Sidebar role={role} activeTab={activeTab} setActiveTab={setActiveTab} setRole={setRole} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header role={role} studentName={studentData.name} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-10 bg-slate-50/50">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
