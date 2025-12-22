
import React, { useState, useEffect } from 'react';
import { StudentData, Subject } from '../types';
import { 
  Heart, 
  ShieldAlert, 
  MessageSquare, 
  Calendar,
  CheckCircle2,
  Trophy,
  UserPlus,
  Search,
  Users,
  LineChart as LineChartIcon,
  BookOpen,
  LayoutDashboard,
  User,
  Bell,
  ArrowRight,
  TrendingUp,
  Brain,
  ShieldCheck,
  Activity,
  BarChart,
  Eye,
  Settings,
  Sparkles,
  Zap,
  Target,
  Clock,
  History,
  Trash2,
  Lightbulb,
  AlertTriangle,
  HeartHandshake,
  RotateCw,
  RefreshCcw,
  Unlink
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
  
  // Demo Connection State - Parent is connected to Aryan by default
  const [connectedStudent, setConnectedStudent] = useState<ConnectedStudent | null>({
    id: '163110',
    name: 'Aryan Sharma',
    school: 'Delhi Public School',
    avatar: 'A'
  });

  useEffect(() => {
    if (externalActiveTab) {
      const section = externalActiveTab.replace('parent-', '') as any;
      if (['status', 'analytics', 'syllabus', 'psychometric', 'connection', 'profile'].includes(section)) {
        setActiveSection(section);
      }
    }
  }, [externalActiveTab]);

  const currentPsych = data.psychometricHistory[data.psychometricHistory.length - 1];

  const handleSearch = () => {
    // Simulating a student database search
    if (searchId === '163110' || searchId.toLowerCase() === 'aryan') {
      setSearchResult({ id: '163110', name: 'Aryan Sharma', school: 'Delhi Public School', avatar: 'A' });
    } else if (searchId === '202199' || searchId.toLowerCase() === 'sneha') {
      setSearchResult({ id: '202199', name: 'Sneha Kapoor', school: 'Modern Academy', avatar: 'S' });
    } else {
      setSearchResult(null);
    }
  };

  const handleConnect = (newStudent: ConnectedStudent) => {
    setIsSyncing(true);
    setSearchResult(null);
    
    // Simulate the withdrawal of previous student and handshake with new one
    setTimeout(() => {
      setConnectedStudent(newStudent);
      setIsSyncing(false);
      setActiveSection('status');
    }, 1500);
  };

  const disconnect = () => {
    if (confirm("Disconnecting will revoke your access to this student's real-time data. Continue?")) {
      setConnectedStudent(null);
    }
  };

  const renderStatus = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Current Phase', val: 'Active Study', icon: Zap, color: 'indigo' },
          { label: 'Today\'s Effort', val: '6.5 hrs', icon: Clock, color: 'emerald' },
          { label: 'Next Mock Test', val: 'Jan 25', icon: Target, color: 'rose' },
          { label: 'Prep Health', val: 'Optimal', icon: ShieldCheck, color: 'blue' },
        ].map((s, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-indigo-400 transition-all">
            <div className={`w-12 h-12 bg-${s.color}-50 text-${s.color}-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <s.icon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{s.label}</div>
              <div className="text-2xl font-black text-slate-800">{s.val}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-indigo-900 p-10 rounded-[3rem] text-white flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10"><Sparkles className="w-48 h-48" /></div>
        <div className="w-20 h-20 bg-white/10 rounded-[2.5rem] flex items-center justify-center shrink-0 backdrop-blur-md border border-white/20">
           <Brain className="w-10 h-10 text-indigo-300" />
        </div>
        <div className="flex-1 text-center md:text-left space-y-2">
           <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10">
              Live Handshake: {connectedStudent?.name} (ID: {connectedStudent?.id})
           </div>
           <h3 className="text-3xl font-black italic tracking-tight">{connectedStudent?.name} is currently in "Flow State".</h3>
           <p className="text-indigo-200 text-sm max-w-xl">Study session started 22 minutes ago. Focus stability is currently rated as <b>Exceptional</b>.</p>
        </div>
        <button 
          onClick={() => setActiveSection('connection')}
          className="px-6 py-3 bg-white text-indigo-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl"
        >
          Manage Handshake
        </button>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
           <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Mastery Trend: {connectedStudent?.name}</h3>
                <p className="text-slate-400 text-xs mt-1">Syllabus stability across all subjects</p>
              </div>
              <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest">7 Day Window</div>
           </div>
           <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                  { d: 'Mon', v: 65 }, { d: 'Tue', v: 70 }, { d: 'Wed', v: 68 },
                  { d: 'Thu', v: 85 }, { d: 'Fri', v: 90 }, { d: 'Sat', v: 88 }, { d: 'Sun', v: 92 }
                ]}>
                  <defs>
                    <linearGradient id="parentColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}}
                  />
                  <Area type="monotone" dataKey="v" stroke="#6366f1" fillOpacity={1} fill="url(#parentColor)" strokeWidth={4} />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
           <h3 className="text-xl font-black text-slate-800">Standardized Performance</h3>
           <div className="space-y-6">
              {[
                { label: 'Last Mock Test', score: '242/300', date: '2 days ago', color: 'indigo' },
                { label: 'Weekly Practice', score: '88% Acc', date: 'Yesterday', color: 'emerald' },
                { label: 'Chapter Drills', score: '14 Completed', date: 'Last 7 days', color: 'blue' }
              ].map((res, i) => (
                <div key={i} className="flex items-center gap-4 group cursor-pointer">
                   <div className={`w-12 h-12 bg-${res.color}-50 text-${res.color}-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                      <Trophy className="w-6 h-6" />
                   </div>
                   <div>
                      <div className="text-[10px] font-black uppercase text-slate-400 mb-0.5">{res.label}</div>
                      <div className="text-lg font-black text-slate-800">{res.score}</div>
                      <div className="text-[9px] font-bold text-slate-300 uppercase">{res.date}</div>
                   </div>
                </div>
              ))}
           </div>
           <div className="pt-6 border-t border-slate-100">
              <button className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl">Full Result History</button>
           </div>
        </div>
      </div>
    </div>
  );

  const renderSyllabus = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
       <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm">
          <div className="flex justify-between items-end mb-12">
             <div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight italic">Syllabus Master Plan</h3>
                <p className="text-slate-400 text-sm font-medium mt-1">Current trajectory for {connectedStudent?.name}.</p>
             </div>
             <div className="flex gap-8">
                <div className="text-center">
                   <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Total Completion</div>
                   <div className="text-3xl font-black text-indigo-600">62%</div>
                </div>
                <div className="text-center border-l border-slate-100 pl-8">
                   <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Status</div>
                   <div className="text-xl font-black text-emerald-500 uppercase tracking-tighter">On Track</div>
                </div>
             </div>
          </div>

          <div className="space-y-12">
            {(['Physics', 'Chemistry', 'Mathematics'] as Subject[]).map(s => {
              const chapters = data.chapters.filter(c => c.subject === s);
              const progress = chapters.length > 0 ? Math.round(chapters.reduce((a,c) => a+c.progress, 0) / chapters.length) : 0;
              return (
                <div key={s} className="space-y-4">
                  <div className="flex justify-between items-end">
                     <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${s === 'Physics' ? 'bg-blue-50 text-blue-600' : s === 'Chemistry' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                           <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="font-black text-lg text-slate-800">{s} Vertical</span>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{chapters.filter(c => c.status === 'COMPLETED').length} Units Mastered</p>
                        </div>
                     </div>
                     <span className="text-3xl font-black text-slate-900">{progress}%</span>
                  </div>
                  <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${s === 'Physics' ? 'bg-blue-500' : s === 'Chemistry' ? 'bg-emerald-500' : 'bg-rose-500'}`} 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
       </div>
    </div>
  );

  const renderPsychometric = () => (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
       <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12"><Brain className="w-80 h-80" /></div>
          
          <div className="flex items-center gap-6 mb-12 relative z-10">
             <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[2.5rem] flex items-center justify-center border border-indigo-100 shadow-inner">
                <Brain className="w-10 h-10" />
             </div>
             <div>
                <h3 className="text-3xl font-black tracking-tight text-slate-900">Psychological Trajectory</h3>
                <p className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.3em] mt-1">Shared Insights for {connectedStudent?.name}</p>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-b border-slate-100 pb-12 mb-12 relative z-10">
             <div className="lg:col-span-5 space-y-10">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Latest Dimension Stability</h4>
                <div className="space-y-8">
                   <div>
                      <div className="flex justify-between text-xs font-black text-slate-700 mb-2 uppercase tracking-widest"><span>Stress Resilience</span><span>{10 - currentPsych.stress}/10</span></div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-rose-500" style={{ width: `${(10 - currentPsych.stress) * 10}%` }}></div></div>
                   </div>
                   <div>
                      <div className="flex justify-between text-xs font-black text-slate-700 mb-2 uppercase tracking-widest"><span>Focus Stamina</span><span>{currentPsych.focus}/10</span></div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-indigo-500" style={{ width: `${currentPsych.focus * 10}%` }}></div></div>
                   </div>
                   <div>
                      <div className="flex justify-between text-xs font-black text-slate-700 mb-2 uppercase tracking-widest"><span>Intrinsic Motivation</span><span>{currentPsych.motivation}/10</span></div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-500" style={{ width: `${currentPsych.motivation * 10}%` }}></div></div>
                   </div>
                </div>
             </div>

             <div className="lg:col-span-7 space-y-6">
                <h4 className="text-[10px] font-black uppercase text-indigo-600 tracking-[0.2em] flex items-center gap-2"><Lightbulb className="w-4 h-4" /> Parental Synergy Guide</h4>
                <div className="bg-slate-900 rounded-[3rem] p-10 text-white space-y-8 shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform"><AlertTriangle className="w-32 h-32 text-rose-500" /></div>
                   <p className="text-lg leading-relaxed text-slate-300 italic font-medium border-l-4 border-rose-500 pl-8">
                     "{currentPsych.parentAdvice || `${connectedStudent?.name} is currently maintaining a very stable cognitive state. Your role this week is to maintain a supportive environment without focusing exclusively on mock test ranks.`}"
                   </p>
                   <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                      <div className="p-3 bg-white/10 rounded-xl"><HeartHandshake className="w-6 h-6 text-rose-400" /></div>
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-1">Impact Goal</div>
                        <div className="text-sm font-bold">Resilience & Stamina</div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );

  const renderConnection = () => (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      {/* Policy Banner */}
      <div className="bg-amber-50 border border-amber-200 p-8 rounded-[3rem] flex items-center gap-6 shadow-sm">
         <div className="w-14 h-14 bg-amber-200 text-amber-700 rounded-2xl flex items-center justify-center shrink-0">
            <ShieldAlert className="w-8 h-8" />
         </div>
         <div>
            <h4 className="text-base font-black text-amber-900 uppercase tracking-tight">Handshake Integrity Protocol</h4>
            <p className="text-sm text-amber-700 font-medium">A parent profile can only link to <b>one active student node</b> at a time. Establishing a new link will automatically withdraw the previous handshake to ensure 1:1 data security.</p>
         </div>
      </div>

      <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-2xl text-center space-y-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 p-12 opacity-5"><UserPlus className="w-64 h-64" /></div>
        <div className="w-20 h-20 bg-indigo-600 text-white rounded-[2rem] flex items-center justify-center mx-auto border-8 border-indigo-50 shadow-xl relative z-10">
          <Search className="w-8 h-8" />
        </div>
        <div className="relative z-10">
          <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic">Discovery Terminal</h3>
          <p className="text-slate-500 max-w-sm mx-auto mt-2 text-sm font-medium">Input the Student ID to initiate a secure data handshake.</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-3 max-w-lg mx-auto relative z-10">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" placeholder="Demo IDs: 163110 or 202199..." 
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-[1.5rem] text-sm font-bold focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all shadow-inner"
            />
          </div>
          <button onClick={handleSearch} className="bg-slate-900 text-white px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-xl">Lookup</button>
        </div>

        {searchResult && (
          <div className="bg-indigo-50 p-10 rounded-[3rem] border border-indigo-100 flex flex-col md:flex-row items-center justify-between animate-in zoom-in-95 duration-500 relative z-10">
            <div className="flex items-center gap-6 text-left">
              <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center font-black text-4xl text-indigo-600 shadow-xl border border-indigo-100">{searchResult.avatar}</div>
              <div>
                <div className="font-black text-2xl text-slate-900 italic tracking-tight">{searchResult.name}</div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="px-3 py-1 bg-white rounded-lg text-[9px] font-black uppercase text-indigo-600 border border-indigo-100 tracking-widest">ID: {searchResult.id}</div>
                  <div className="px-3 py-1 bg-white rounded-lg text-[9px] font-black uppercase text-slate-400 border border-slate-100 tracking-widest">{searchResult.school}</div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 md:mt-0 flex flex-col items-end gap-3">
               {connectedStudent && connectedStudent.id === searchResult.id ? (
                 <div className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">
                    <CheckCircle2 className="w-4 h-4" /> Fully Linked
                 </div>
               ) : (
                 <div className="space-y-3">
                    {connectedStudent && (
                      <div className="text-[9px] font-black uppercase text-rose-500 text-right animate-pulse">
                         Note: Replacing {connectedStudent.name}
                      </div>
                    )}
                    <button 
                      onClick={() => handleConnect(searchResult)} 
                      className="bg-indigo-600 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all shadow-xl flex items-center gap-3"
                    >
                      {connectedStudent ? 'Replace Handshake' : 'Establish Link'} <ArrowRight className="w-4 h-4" />
                    </button>
                 </div>
               )}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
         <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" /> Active Family Node
         </h4>
         
         {connectedStudent ? (
           <div className="flex flex-col md:flex-row items-center justify-between p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:border-indigo-200 transition-all group">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center font-black text-white text-3xl shadow-2xl group-hover:rotate-3 transition-transform">{connectedStudent.avatar}</div>
                <div>
                   <div className="font-black text-2xl text-slate-900 tracking-tight">{connectedStudent.name}</div>
                   <div className="text-[9px] font-black uppercase text-emerald-500 flex items-center gap-2 mt-1 tracking-widest">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div> 
                      Secure Live Stream: Connected
                   </div>
                </div>
              </div>
              <div className="flex gap-4 mt-6 md:mt-0">
                <button onClick={() => setActiveSection('status')} className="p-4 bg-white text-indigo-600 rounded-2xl shadow-sm hover:bg-indigo-600 hover:text-white transition-all border border-slate-100 group-hover:scale-105">
                    <Activity className="w-6 h-6" />
                </button>
                <button onClick={disconnect} className="p-4 text-rose-500 bg-white rounded-2xl shadow-sm hover:bg-rose-500 hover:text-white transition-all border border-slate-100 group-hover:scale-105">
                    <Unlink className="w-6 h-6" />
                </button>
              </div>
           </div>
         ) : (
           <div className="py-24 text-center border-4 border-dashed border-slate-50 rounded-[3rem] space-y-4 bg-slate-50/20">
              <RefreshCcw className="w-12 h-12 text-slate-200 mx-auto" />
              <div className="text-xs font-black text-slate-400 uppercase tracking-widest">Handshake Offline</div>
              <button onClick={() => setSearchResult(null)} className="text-indigo-600 font-black text-sm hover:underline uppercase tracking-widest">Lookup Student ID</button>
           </div>
         )}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-16 rounded-[4rem] border border-slate-200 shadow-sm text-center">
        <div className="w-32 h-32 bg-slate-50 rounded-full mx-auto mb-8 flex items-center justify-center border-8 border-slate-100 shadow-inner relative group">
          <User className="w-16 h-16 text-slate-300 group-hover:text-indigo-600 transition-colors" />
        </div>
        <h3 className="text-4xl font-black text-slate-900 tracking-tighter italic">Guardian Profile</h3>
        <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.4em] mt-2">Parent Sentinel Mode</p>
        
        <div className="mt-16 grid grid-cols-1 gap-6 text-left">
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-6 tracking-[0.2em]">Guardian Name</label>
              <input type="text" defaultValue="Mr. Ramesh Sharma" className="w-full bg-slate-50 border-none rounded-[1.5rem] p-5 text-sm font-black text-slate-800" />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-6 tracking-[0.2em]">Contact Email</label>
              <input type="email" defaultValue="ramesh.guardian@family.com" className="w-full bg-slate-50 border-none rounded-[1.5rem] p-5 text-sm font-black text-slate-800" />
           </div>
           <button className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-indigo-600 transition-all mt-6">Confirm Sentinel Profile</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto pb-24 space-y-12">
      {/* Loading/Syncing Screen */}
      {isSyncing && (
        <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-center space-y-8 text-white animate-in fade-in duration-500">
           <div className="relative">
              <RotateCw className="w-32 h-32 text-indigo-500 animate-spin" />
              <HeartHandshake className="w-12 h-12 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
           </div>
           <div className="text-center space-y-2">
              <h2 className="text-3xl font-black italic tracking-tighter">Synchronizing Student Stream...</h2>
              <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.4em]">Establishing End-to-End Encryption</p>
           </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
        <div className="space-y-3">
           <div className="text-[11px] font-black uppercase text-indigo-600 tracking-[0.4em] flex items-center gap-3">
              <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
              Parental Console: {connectedStudent?.name || 'Handshake Required'}
           </div>
           <h2 className="text-6xl font-black text-slate-900 tracking-tighter italic leading-none">
              {activeSection === 'status' && "Live Pulse."}
              {activeSection === 'analytics' && "Data mastery."}
              {activeSection === 'syllabus' && "Study flow."}
              {activeSection === 'psychometric' && "Mental state."}
              {activeSection === 'connection' && "Handshake."}
              {activeSection === 'profile' && "Sentinel."}
           </h2>
        </div>

        <nav className="flex p-2 bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-x-auto max-w-full">
          {[
            { id: 'status', label: 'Home', icon: Activity },
            { id: 'analytics', label: 'Data', icon: BarChart },
            { id: 'syllabus', label: 'Flow', icon: BookOpen },
            { id: 'psychometric', label: 'State', icon: Brain },
            { id: 'connection', label: 'Link', icon: UserPlus }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`px-8 py-3.5 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 whitespace-nowrap ${activeSection === tab.id ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-700'}`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <main className="min-h-[65vh]">
        {!connectedStudent && activeSection !== 'connection' && activeSection !== 'profile' ? (
          <div className="bg-white p-20 rounded-[4rem] text-center space-y-8 border border-slate-100 shadow-sm animate-in zoom-in-95 duration-500">
             <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto border border-rose-100 shadow-inner">
                <ShieldAlert className="w-12 h-12" />
             </div>
             <div className="space-y-3">
                <h3 className="text-3xl font-black text-slate-900 italic">Sentinel Handshake Required.</h3>
                <p className="text-slate-500 max-w-sm mx-auto font-medium">Please establish a connection handshake with a student to unlock live academic insights.</p>
             </div>
             <button 
              onClick={() => setActiveSection('connection')}
              className="bg-indigo-600 text-white px-12 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-indigo-700 transition-all flex items-center gap-4 mx-auto"
             >
                Find Student Node <UserPlus className="w-5 h-5" />
             </button>
          </div>
        ) : (
          <>
            {activeSection === 'status' && renderStatus()}
            {activeSection === 'analytics' && renderAnalytics()}
            {activeSection === 'syllabus' && renderSyllabus()}
            {activeSection === 'psychometric' && renderPsychometric()}
            {activeSection === 'connection' && renderConnection()}
            {activeSection === 'profile' && renderProfile()}
          </>
        )}
      </main>
    </div>
  );
};

export default ParentDashboard;
