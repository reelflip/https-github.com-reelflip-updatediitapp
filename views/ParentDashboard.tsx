
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
  Lightbulb
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart as ReBarChart, Bar, Cell } from 'recharts';

interface ParentDashboardProps {
  data: StudentData;
  externalActiveTab?: string;
}

const ParentDashboard: React.FC<ParentDashboardProps> = ({ data, externalActiveTab }) => {
  const [activeSection, setActiveSection] = useState<'status' | 'analytics' | 'syllabus' | 'psychometric' | 'connection' | 'profile'>('status');
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [requestSent, setRequestSent] = useState(false);

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
    if (searchId === data.id || searchId.toLowerCase() === data.name.toLowerCase()) {
      setSearchResult({ id: data.id, name: data.name, school: data.schoolName || 'St. Xavier High' });
    } else {
      setSearchResult(null);
    }
  };

  const sendRequest = () => {
    setRequestSent(true);
    setTimeout(() => setRequestSent(false), 3000);
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
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className={`w-12 h-12 bg-${s.color}-50 text-${s.color}-600 rounded-2xl flex items-center justify-center mb-6`}>
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
        <div className="w-20 h-20 bg-white/10 rounded-[2rem] flex items-center justify-center shrink-0 backdrop-blur-md">
           <Brain className="w-10 h-10 text-indigo-300" />
        </div>
        <div className="flex-1 text-center md:text-left space-y-2">
           <h3 className="text-2xl font-black italic">Student Real-time Pulse</h3>
           <p className="text-indigo-200 text-sm max-w-xl">{data.name} is currently completing a Practice Set in <b>Physics (Rotational Mechanics)</b>. His concentration depth is currently high.</p>
        </div>
        <div className="flex gap-4">
           <div className="px-6 py-3 bg-white/5 rounded-2xl border border-white/10 text-xs font-black uppercase tracking-widest">
              Live Connection: Active
           </div>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
           <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-slate-800">Retention & Mastery Trend</h3>
              <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Performance Metrics (Processed)</div>
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
                  <Tooltip />
                  <Area type="monotone" dataKey="v" stroke="#6366f1" fillOpacity={1} fill="url(#parentColor)" strokeWidth={4} />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
           <h3 className="text-xl font-black text-slate-800">Standardized Results</h3>
           <div className="space-y-6">
              {[
                { label: 'Last Mock Test', score: '242/300', date: '2 days ago', color: 'indigo' },
                { label: 'Weekly Practice', score: '88% Acc', date: 'Yesterday', color: 'emerald' },
                { label: 'Chapter Drills', score: '14 Completed', date: 'Last 7 days', color: 'blue' }
              ].map((res, i) => (
                <div key={i} className="flex items-center gap-4 group">
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
           <button className="w-full py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-all">Download Analysis Report</button>
        </div>
      </div>
    </div>
  );

  const renderSyllabus = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
       <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm">
          <div className="flex justify-between items-end mb-12">
             <div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Syllabus Mastery Map</h3>
                <p className="text-slate-400 text-sm font-medium mt-1">Real-time completion tracking for JEE 2025.</p>
             </div>
             <div className="flex gap-4">
                <div className="text-center">
                   <div className="text-[10px] font-black uppercase text-slate-400">Total Units</div>
                   <div className="text-xl font-black">94</div>
                </div>
                <div className="text-center border-l border-slate-100 pl-4">
                   <div className="text-[10px] font-black uppercase text-slate-400">Mastered</div>
                   <div className="text-xl font-black text-emerald-500">62</div>
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
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s === 'Physics' ? 'bg-blue-50 text-blue-600' : s === 'Chemistry' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                           <BookOpen className="w-5 h-5" />
                        </div>
                        <span className="font-black text-lg text-slate-800">{s} Vertical</span>
                     </div>
                     <span className="text-2xl font-black text-slate-900">{progress}%</span>
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
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
       <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-10">
             <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center">
                <Brain className="w-8 h-8" />
             </div>
             <div>
                <h3 className="text-2xl font-black">Student Wellbeing Analysis</h3>
                <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest mt-1">AI-Powered Guardianship Advice</p>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-b border-slate-100 pb-12 mb-12">
             <div className="space-y-8">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Latest Dimension Scores</h4>
                <div className="space-y-6">
                   <div>
                      <div className="flex justify-between text-xs font-bold text-slate-700 mb-2"><span>Stress Resistance</span><span>{10 - currentPsych.stress}/10</span></div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-rose-500" style={{ width: `${(10 - currentPsych.stress) * 10}%` }}></div></div>
                   </div>
                   <div>
                      <div className="flex justify-between text-xs font-bold text-slate-700 mb-2"><span>Focus Stability</span><span>{currentPsych.focus}/10</span></div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-indigo-500" style={{ width: `${currentPsych.focus * 10}%` }}></div></div>
                   </div>
                   <div>
                      <div className="flex justify-between text-xs font-bold text-slate-700 mb-2"><span>Motivation Level</span><span>{currentPsych.motivation}/10</span></div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-500" style={{ width: `${currentPsych.motivation * 10}%` }}></div></div>
                   </div>
                </div>
             </div>

             <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase text-indigo-600 tracking-[0.2em] flex items-center gap-2"><Lightbulb className="w-4 h-4" /> Parent Support Strategy</h4>
                <div className="bg-indigo-900 rounded-[2.5rem] p-8 text-white space-y-6 shadow-xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-5"><Zap className="w-24 h-24" /></div>
                   <p className="text-sm leading-relaxed text-indigo-100 italic">
                     {currentPsych.parentAdvice || "No specific advice generated for this snapshot yet. Wait for the next check-in."}
                   </p>
                   <div className="pt-4 border-t border-white/10">
                      <div className="text-[9px] font-black uppercase tracking-widest text-indigo-400 mb-1">Impact Goal</div>
                      <div className="text-[10px] font-bold">Mental Resilience & Stamina</div>
                   </div>
                </div>
             </div>
          </div>

          <div className="space-y-6">
             <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Summary of Assessment</h4>
             <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-sm text-slate-700 leading-relaxed">
                {currentPsych.studentSummary || "Awaiting student's first detailed assessment response."}
             </div>
          </div>
       </div>

       <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
          <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-6">Historical Snapshots</h4>
          <div className="divide-y divide-slate-100">
             {data.psychometricHistory.map((h, i) => (
               <div key={i} className="py-4 flex justify-between items-center hover:bg-slate-50 px-4 rounded-xl transition-all group">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center font-bold text-xs">{i+1}</div>
                     <div>
                        <div className="text-sm font-black text-slate-800">Routine Check-in Assessment</div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase">{h.timestamp}</div>
                     </div>
                  </div>
                  <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors"><Eye className="w-4 h-4" /></button>
               </div>
             ))}
          </div>
       </div>
    </div>
  );

  const renderConnection = () => (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-12 rounded-[3.5rem] border border-slate-200 shadow-sm text-center space-y-8">
        <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto border border-indigo-100">
          <UserPlus className="w-10 h-10" />
        </div>
        <div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">Link with Your Aspirant</h3>
          <p className="text-slate-500 max-w-sm mx-auto mt-2">Connect to see their real-time progress and mental wellbeing summaries.</p>
        </div>
        
        <div className="flex gap-3 max-w-md mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" placeholder="Student ID or Name..." 
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-600 transition-all"
            />
          </div>
          <button onClick={handleSearch} className="bg-slate-900 text-white px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl">Search</button>
        </div>

        {searchResult && (
          <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200 flex items-center justify-between animate-in zoom-in-95 duration-300">
            <div className="flex items-center gap-6 text-left">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center font-black text-2xl text-indigo-600 shadow-sm border border-slate-100">{searchResult.name[0]}</div>
              <div>
                <div className="font-black text-xl text-slate-800">{searchResult.name}</div>
                <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">ID: {searchResult.id} • {searchResult.school}</div>
              </div>
            </div>
            <button onClick={sendRequest} disabled={requestSent} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${requestSent ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>{requestSent ? 'Request Sent!' : 'Send Request'}</button>
          </div>
        )}
      </div>

      <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
         <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-6 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" /> Active Oversight Links
         </h4>
         <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center font-black text-white text-lg shadow-lg">A</div>
              <div>
                 <div className="font-black text-slate-800">{data.name}</div>
                 <div className="text-[9px] font-black uppercase text-emerald-500 flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> Active Handshake</div>
              </div>
            </div>
            <button className="p-3 text-rose-500 bg-white rounded-xl shadow-sm hover:bg-rose-50 transition-all"><Trash2 className="w-5 h-5" /></button>
         </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-12 rounded-[3.5rem] border border-slate-200 shadow-sm text-center">
        <div className="w-32 h-32 bg-slate-50 rounded-full mx-auto mb-8 flex items-center justify-center border-4 border-slate-100 shadow-inner">
          <User className="w-16 h-16 text-slate-300" />
        </div>
        <h3 className="text-3xl font-black text-slate-800">Parent Profile</h3>
        <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.3em] mt-1">Verified Family Account</p>
        
        <div className="mt-12 grid grid-cols-1 gap-6 text-left">
           <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-5 tracking-widest">Display Name</label>
              <input type="text" defaultValue="Guardian Account" className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-black text-slate-700" />
           </div>
           <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-5 tracking-widest">Email for Alerts</label>
              <input type="email" defaultValue="guardian@family.com" className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-black text-slate-700" />
           </div>
           <button className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-indigo-700 transition-all mt-6">Save Preferences</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto pb-20 space-y-12">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
        <div className="space-y-2">
           <div className="text-[10px] font-black uppercase text-indigo-600 tracking-[0.3em] flex items-center gap-2">
              <Heart className="w-4 h-4 fill-indigo-600/10" /> Guardianship Hub
           </div>
           <h2 className="text-5xl font-black text-slate-900 tracking-tighter italic">
              {activeSection === 'status' && "Live Pulse."}
              {activeSection === 'analytics' && "Data Mastery."}
              {activeSection === 'syllabus' && "Study Trajectory."}
              {activeSection === 'psychometric' && "Mental Health."}
              {activeSection === 'connection' && "Family Link."}
              {activeSection === 'profile' && "Your Profile."}
           </h2>
        </div>
      </div>

      <main className="min-h-[60vh]">
        {activeSection === 'status' && renderStatus()}
        {activeSection === 'analytics' && renderAnalytics()}
        {activeSection === 'syllabus' && renderSyllabus()}
        {activeSection === 'psychometric' && renderPsychometric()}
        {activeSection === 'connection' && renderConnection()}
        {activeSection === 'profile' && renderProfile()}
      </main>
    </div>
  );
};

export default ParentDashboard;
