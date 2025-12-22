
import React, { useEffect } from 'react';
import { UserRole } from '../types';
import { 
  LayoutDashboard, 
  BookOpen, 
  Bot, 
  FileText, 
  Brain, 
  Timer, 
  BarChart3, 
  Calendar, 
  RefreshCw, 
  AlertCircle, 
  Layers, 
  ListChecks, 
  Lightbulb, 
  Heart, 
  User,
  ShieldCheck,
  Users,
  Inbox,
  PenTool,
  Activity,
  Settings,
  CloudUpload,
  UserCheck,
  BarChart,
  UserPlus,
  FileCode
} from 'lucide-react';

interface SidebarProps {
  role: UserRole;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setRole: (role: UserRole) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ role, activeTab, setActiveTab, setRole }) => {
  useEffect(() => {
    const handleTabChange = (e: any) => {
      if (e.detail) setActiveTab(e.detail);
    };
    window.addEventListener('changeTab', handleTabChange);
    return () => window.removeEventListener('changeTab', handleTabChange);
  }, [setActiveTab]);

  const studentLinks = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'learn', label: 'Syllabus', icon: BookOpen },
    { id: 'aitutor', label: 'AI Tutor', icon: Bot },
    { id: 'tests', label: 'Tests', icon: FileText },
    { id: 'psychometric', label: 'Psychometric Test', icon: Brain },
    { id: 'focus', label: 'Focus', icon: Timer },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'timetable', label: 'Timetable', icon: Calendar },
    { id: 'revision', label: 'Revision', icon: RefreshCw },
    { id: 'mistakes', label: 'Mistakes', icon: AlertCircle },
    { id: 'flashcards', label: 'Cards', icon: Layers },
    { id: 'backlogs', label: 'Backlogs', icon: ListChecks },
    { id: 'hacks', label: 'Hacks', icon: Lightbulb },
    { id: 'wellness', label: 'Wellness', icon: Heart },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const adminLinks = [
    { id: 'admin-overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'admin-users', label: 'User Management', icon: Users },
    { id: 'admin-inbox', label: 'Inbox', icon: Inbox },
    { id: 'admin-syllabus', label: 'Syllabus', icon: BookOpen },
    { id: 'admin-questions', label: 'Question Bank', icon: FileCode },
    { id: 'admin-tests', label: 'Tests', icon: FileText },
    { id: 'admin-content', label: 'Learning Assets', icon: Layers },
    { id: 'admin-blog', label: 'Blog', icon: PenTool },
    { id: 'admin-analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'admin-diagnostics', label: 'Diagnostics', icon: Activity },
    { id: 'admin-system', label: 'System', icon: Settings },
    { id: 'admin-profile', label: 'Profile', icon: User },
  ];

  const parentLinks = [
    { id: 'parent-status', label: 'Current Status', icon: Activity },
    { id: 'parent-analytics', label: 'Student Analytics', icon: BarChart },
    { id: 'parent-syllabus', label: 'Syllabus Progress', icon: BookOpen },
    { id: 'parent-psychometric', label: 'Mental Wellbeing', icon: Brain },
    { id: 'parent-connection', label: 'Family Connection', icon: UserPlus },
    { id: 'parent-profile', label: 'My Profile', icon: User },
  ];

  const currentLinks = role === UserRole.ADMIN ? adminLinks : role === UserRole.PARENT ? parentLinks : studentLinks;

  return (
    <div className="w-64 bg-[#0a1128] text-slate-300 flex flex-col hidden lg:flex border-r border-slate-800 shrink-0">
      <div className="p-6 mb-2">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center">
            {role === UserRole.ADMIN ? <ShieldCheck className="w-5 h-5" /> : <Brain className="w-5 h-5" />}
          </div>
          {role === UserRole.ADMIN ? 'ADMIN-PANEL' : role === UserRole.PARENT ? 'FAMILY-PANEL' : 'JEE-PRO'}
        </h1>
      </div>

      <nav className="flex-1 overflow-y-auto custom-scrollbar px-3 space-y-1">
        {currentLinks.map((link) => (
          <button
            key={link.id}
            onClick={() => setActiveTab(link.id)}
            className={`w-full flex items-center gap-4 px-4 py-2.5 rounded-lg text-sm font-medium transition-all group ${
              activeTab === link.id 
              ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20' 
              : 'hover:bg-slate-800/50 hover:text-white'
            }`}
          >
            <link.icon className={`w-5 h-5 ${activeTab === link.id ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
            {link.label}
          </button>
        ))}
      </nav>

      <div className="p-4 bg-slate-900/50 mt-auto border-t border-slate-800">
        <div className="text-[10px] text-slate-500 mb-2 uppercase font-bold tracking-widest px-2">Access Control</div>
        <div className="grid grid-cols-1 gap-1">
           {Object.values(UserRole).map(r => (
             <button 
                key={r}
                onClick={() => {
                  setRole(r);
                  setActiveTab(r === UserRole.ADMIN ? 'admin-overview' : r === UserRole.PARENT ? 'parent-status' : 'dashboard');
                }}
                className={`text-[10px] px-3 py-1.5 rounded-md text-left transition-colors font-bold ${role === r ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
             >
                {r}
             </button>
           ))}
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Sidebar;
