
import React, { useState, useEffect } from 'react';
import { StudentData, Subject, ParentInvitation } from '../types';
import { api } from '../services/apiService';
import { 
  Heart, ShieldAlert, MessageSquare, Calendar, CheckCircle2, Trophy,
  UserPlus, Search, Users, LineChart as LineChartIcon, BookOpen,
  LayoutDashboard, User, Bell, ArrowRight, TrendingUp, Brain,
  ShieldCheck, Activity, BarChart, Eye, Settings, Sparkles, Zap,
  Target, Clock, History, Trash2, Lightbulb, AlertTriangle,
  HeartHandshake, RotateCw, RefreshCcw, Unlink, Mail, Send, Loader2
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface ConnectedStudent {
  id: string;
  name: string;
  school: string;
  avatar: string;
}

interface ParentDashboardProps {
  data: StudentData;
  externalActiveTab?: string;
}

const ParentDashboard: React.FC<ParentDashboardProps> = ({ data, externalActiveTab }) => {
  const [activeSection, setActiveSection] = useState<'status' | 'analytics' | 'syllabus' | 'psychometric' | 'connection' | 'profile'>('status');
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState<ConnectedStudent | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteSentForId, setInviteSentForId] = useState<string | null>(null);

  const [connectedStudent, setConnectedStudent] = useState<ConnectedStudent | null>(null);
  const [parentAccount, setParentAccount] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('jeepro_user');
    if (savedUser) setParentAccount(JSON.parse(savedUser));

    // For demo: If student 163110 is already connected in global data
    if (data.connectedParent && data.id === '163110') {
        setConnectedStudent({ id: '163110', name: 'Aryan Sharma', school: 'Delhi Public School', avatar: 'A' });
    }
  }, [data]);

  useEffect(() => {
    if (externalActiveTab) {
      const section = externalActiveTab.replace('parent-', '') as any;
      if (['status', 'analytics', 'syllabus', 'psychometric', 'connection', 'profile'].includes(section)) {
        setActiveSection(section);
      }
    }
  }, [externalActiveTab]);

  const handleSearch = () => {
    if (searchId === '163110' || searchId.toLowerCase() === 'aryan') {
      setSearchResult({ id: '163110', name: 'Aryan Sharma', school: 'Delhi Public School', avatar: 'A' });
    } else if (searchId === '202199' || searchId.toLowerCase() === 'sneha') {
      setSearchResult({ id: '202199', name: 'Sneha Kapoor', school: 'Modern Academy', avatar: 'S' });
    } else {
      setSearchResult(null);
    }
  };

  const sendInvitation = async (student: ConnectedStudent) => {
    setIsInviting(true);
    // Simulation: Add invitation to student's record
    const localKey = `jeepro_data_${student.id}`;
    const studentRaw = localStorage.getItem(localKey);
    let studentDataObj: StudentData;
    
    if (studentRaw) {
      studentDataObj = JSON.parse(studentRaw);
    } else {
      studentDataObj = await api.getStudentData(student.id);
    }

    const invitation: ParentInvitation = {
      id: `INV-${Math.random().toString(36).substr(2, 9)}`,
      parentName: parentAccount?.name || 'A Parent',
      parentEmail: parentAccount?.email || 'parent@demo.in',
      sentAt: new Date().toISOString()
    };

    studentDataObj.pendingInvitations = [...(studentDataObj.pendingInvitations || []), invitation];
    localStorage.setItem(localKey, JSON.stringify(studentDataObj));

    setTimeout(() => {
      setInviteSentForId(student.id);
      setIsInviting(false);
    }, 1200);
  };

  const disconnect = () => {
    if (confirm("Disconnecting will revoke your access to this student's real-time data. Continue?")) {
      setConnectedStudent(null);
      // Update student's data to remove parent
      if (connectedStudent) {
         const localKey = `jeepro_data_${connectedStudent.id}`;
         const studentRaw = localStorage.getItem(localKey);
         if (studentRaw) {
           const studentObj = JSON.parse(studentRaw);
           delete studentObj.connectedParent;
           localStorage.setItem(localKey, JSON.stringify(studentObj));
         }
      }
    }
  };

  const renderStatus = () => {
    if (!connectedStudent) {
      return (
        <div className="bg-white p-20 rounded-[4rem] text-center space-y-8 border border-slate-100 shadow-sm animate-in zoom-in-95 duration-500">
           <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto border border-rose-100 shadow-inner">
              <ShieldAlert className="w-12 h-12" />
           </div>
           <div className="space-y-3">
              <h3 className="text-3xl font-black text-slate-900 italic">Sentinel Handshake Offline.</h3>
              <p className="text-slate-500 max-w-sm mx-auto font-medium">Please send a connection request to a student to unlock live academic insights.</p>
           </div>
           <button onClick={() => setActiveSection('connection')} className="bg-indigo-600 text-white px-12 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-indigo-700 transition-all flex items-center gap-4 mx-auto">
              Send Connection Invite <UserPlus className="w-5 h-5" />
           </button>
        </div>
      );
    }

    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Current Phase', val: 'Active Study', icon: Zap, color: 'indigo' },
            { label: 'Today\'s Effort', val: '6.5 hrs', icon: Clock, color: 'emerald' },
            { label: 'Next Mock Test', val: 'Jan 25', icon: Target, color: 'rose' },
            { label: 'Prep Health', val: 'Optimal', icon: ShieldCheck, color: 'blue' },
          ].map((s, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-indigo-400 transition-all">
              <div className={`w-12 h-12 bg-${s.color}-50 text-${s.color}-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}><s.icon className="w-6 h-6" /></div>
              <div><div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{s.label}</div><div className="text-2xl font-black text-slate-800">{s.val}</div></div>
            </div>
          ))}
        </div>
        <div className="bg-indigo-900 p-10 rounded-[3rem] text-white flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10"><Sparkles className="w-48 h-48" /></div>
          <div className="w-20 h-20 bg-white/10 rounded-[2.5rem] flex items-center justify-center shrink-0 backdrop-blur-md border border-white/20"><Brain className="w-10 h-10 text-indigo-300" /></div>
          <div className="flex-1 text-center md:text-left space-y-2">
             <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10">Live Handshake: {connectedStudent.name}</div>
             <h3 className="text-3xl font-black italic tracking-tight">{connectedStudent.name} is currently in "Flow State".</h3>
             <p className="text-indigo-200 text-sm max-w-xl">Study session started 22 minutes ago. Focus stability is exceptional.</p>
          </div>
          <button onClick={() => setActiveSection('connection')} className="px-6 py-3 bg-white text-indigo-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl">Manage Link</button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto pb-24 space-y-12">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
        <div className="space-y-3">
           <div className="text-[11px] font-black uppercase text-indigo-600 tracking-widest flex items-center gap-3">
              <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
              Parental Console: {connectedStudent?.name || 'Unlinked'}
           </div>
           <h2 className="text-6xl font-black text-slate-900 tracking-tighter italic leading-none">
              {activeSection === 'connection' ? 'Handshake.' : 'Live Pulse.'}
           </h2>
        </div>
        <nav className="flex p-2 bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-x-auto max-w-full">
          {[
            { id: 'status', label: 'Home', icon: Activity },
            { id: 'connection', label: 'Invitations', icon: UserPlus }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveSection(tab.id as any)} className={`px-8 py-3.5 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 whitespace-nowrap ${activeSection === tab.id ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-700'}`}><tab.icon className="w-4 h-4" />{tab.label}</button>
          ))}
        </nav>
      </div>

      <main className="min-h-[65vh]">
        {activeSection === 'status' && renderStatus()}
        {activeSection === 'connection' && (
          <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
            <div className="bg-amber-50 border border-amber-200 p-8 rounded-[3rem] flex items-center gap-6 shadow-sm">
               <div className="w-14 h-14 bg-amber-200 text-amber-700 rounded-2xl flex items-center justify-center shrink-0"><ShieldAlert className="w-8 h-8" /></div>
               <div>
                  <h4 className="text-base font-black text-amber-900 uppercase tracking-tight">Security Handshake Protocol</h4>
                  <p className="text-sm text-amber-700 font-medium">To protect student privacy, you must send an invitation. The student will see your request in their <b>Profile Settings</b> and must approve it before data synchronization begins.</p>
               </div>
            </div>

            <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-2xl text-center space-y-10 relative overflow-hidden">
              <div className="absolute top-0 left-0 p-12 opacity-5"><UserPlus className="w-64 h-64" /></div>
              <div className="w-20 h-20 bg-indigo-600 text-white rounded-[2rem] flex items-center justify-center mx-auto border-8 border-indigo-50 shadow-xl relative z-10"><Search className="w-8 h-8" /></div>
              <div className="relative z-10">
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic">Find Your Student</h3>
                <p className="text-slate-500 max-w-sm mx-auto mt-2 text-sm font-medium">Search for the unique Student ID to send a handshake invite.</p>
              </div>
              <div className="flex flex-col md:flex-row gap-3 max-w-lg mx-auto relative z-10">
                <div className="relative flex-1">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" placeholder="Search ID: 163110..." value={searchId} onChange={(e) => setSearchId(e.target.value)} className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-[1.5rem] text-sm font-bold focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all shadow-inner" />
                </div>
                <button onClick={handleSearch} className="bg-slate-900 text-white px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-xl">Lookup</button>
              </div>

              {searchResult && (
                <div className="bg-indigo-50 p-10 rounded-[3rem] border border-indigo-100 flex flex-col md:flex-row items-center justify-between animate-in zoom-in-95 duration-500 relative z-10">
                  <div className="flex items-center gap-6 text-left">
                    <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center font-black text-4xl text-indigo-600 shadow-xl border border-indigo-100">{searchResult.avatar}</div>
                    <div>
                      <div className="font-black text-2xl text-slate-900 italic tracking-tight">{searchResult.name}</div>
                      <div className="text-[10px] font-black uppercase text-indigo-600 bg-white px-3 py-1 rounded-lg w-fit mt-1 tracking-widest">ID: {searchResult.id}</div>
                    </div>
                  </div>
                  <div className="mt-6 md:mt-0">
                     {inviteSentForId === searchResult.id ? (
                       <div className="flex items-center gap-3 px-8 py-4 bg-emerald-100 text-emerald-700 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-emerald-200">
                          <CheckCircle2 className="w-5 h-5" /> Invite Sent
                       </div>
                     ) : (
                       <button onClick={() => sendInvitation(searchResult)} disabled={isInviting} className="bg-indigo-600 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all shadow-xl flex items-center gap-3">
                          {isInviting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> Send Invite</>}
                       </button>
                     )}
                  </div>
                </div>
              )}
            </div>

            {connectedStudent && (
              <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
                 <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Active Connection</h4>
                 <div className="flex flex-col md:flex-row items-center justify-between p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:border-indigo-200 transition-all group">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center font-black text-white text-3xl shadow-2xl group-hover:rotate-3 transition-transform">{connectedStudent.avatar}</div>
                      <div>
                         <div className="font-black text-2xl text-slate-900 tracking-tight">{connectedStudent.name}</div>
                         <div className="text-[9px] font-black uppercase text-emerald-500 flex items-center gap-2 mt-1 tracking-widest">Linked & Authorized</div>
                      </div>
                    </div>
                    <button onClick={disconnect} className="p-4 text-rose-500 bg-white rounded-2xl shadow-sm hover:bg-rose-500 hover:text-white transition-all border border-slate-100 group-hover:scale-105"><Unlink className="w-6 h-6" /></button>
                 </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ParentDashboard;
