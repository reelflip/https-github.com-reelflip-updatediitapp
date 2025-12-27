
import React, { useEffect } from 'react';
import { UserRole } from '../types';
import { 
  LayoutDashboard, BookOpen, Bot, FileText, Brain, Timer, 
  BarChart3, Calendar, RefreshCw, AlertCircle, Layers, 
  ListChecks, Lightbulb, Heart, User, ShieldCheck,
  Users, Inbox, PenTool, Settings, LogOut, Info, Sparkles, Mail, Target, FileCode
} from 'lucide-react';

interface SidebarProps {
  role: UserRole;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setRole: (role: UserRole) => void;
  handleLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ role, activeTab, setActiveTab, handleLogout }) => {
  useEffect(() => {
    const handleTabChange = (e: any) => {
      if (e.detail) setActiveTab(e.detail);
    };
    window.addEventListener('changeTab', handleTabChange);
    return () => window.removeEventListener('changeTab', handleTabChange);
  }, [setActiveTab]);

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
  ];

  const currentLinks = role === UserRole.ADMIN ? adminLinks : role === UserRole.PARENT ? parentLinks : studentLinks;

  return (
    <div className="w-64 bg-[#0a1128] text-slate-300 flex flex-col hidden lg:flex border-r border-slate-800 shrink-0">
      <div className="p-6 mb-2">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center">
            {role === UserRole.ADMIN ? <ShieldCheck className="w-5 h-5" /> : <Brain className="w-5 h-5" />}
          </div>
          <div>
            <div className="leading-tight text-sm font-black tracking-tighter">
              {role === UserRole.ADMIN ? 'ADMIN CENTER' : role === UserRole.PARENT ? 'FAMILY PORTAL' : 'IITGRRPREP'}
            </div>
            <div className="text-[7px] font-black tracking-[0.4em] text-indigo-400 uppercase">Solaris v9.0</div>
          </div>
        </h1>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 space-y-1">
        {currentLinks.map((link) => (
          <button
            key={link.id}
            onClick={() => setActiveTab(link.id)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === link.id 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50 border border-indigo-500/50' 
              : 'hover:bg-slate-800/50 hover:text-slate-100'
            }`}
          >
            <link.icon className={`w-4 h-4 ${activeTab === link.id ? 'text-white' : 'text-slate-500'}`} />
            {link.label}
          </button>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-6 py-4 bg-slate-900 text-rose-400 hover:bg-rose-50 hover:text-white rounded-2xl transition-all font-black text-xs uppercase tracking-widest border border-slate-800 shadow-2xl"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
