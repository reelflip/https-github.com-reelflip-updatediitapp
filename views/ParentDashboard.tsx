
import React, { useState, useEffect } from 'react';
import { StudentData, UserAccount, ParentInvitation, Chapter, TestResult, PsychometricScore } from '../types';
import { api } from '../services/apiService';
import { 
  Heart, ShieldAlert, Calendar, CheckCircle2, Trophy,
  UserPlus, Search, LineChart as LineChartIcon, BookOpen,
  LayoutDashboard, Brain, ShieldCheck, Activity, BarChart, 
  Eye, Sparkles, Target, Clock, History, AlertTriangle,
  RefreshCcw, Mail, Send, Loader2, ChevronRight, ArrowUpRight
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart as ReBarChart, Bar } from 'recharts';

interface ParentDashboardProps {
  data: StudentData; // Note: This 'data' is the parent's meta data
  externalActiveTab?: string;
}

const ParentDashboard: React.FC<ParentDashboardProps> = ({ externalActiveTab }) => {
  const [activeSection, setActiveSection] = useState<'status' | 'analytics' | 'syllabus' | 'wellness'>('status');
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState<UserAccount | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteSentForId, setInviteSentForId] = useState<string | null>(null);
  
  const [linkedStudentData, setLinkedStudentData] = useState<StudentData | null>(null);
  const [parentAccount, setParentAccount] = useState<UserAccount | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('jeepro_user');
    if (savedUser) setParentAccount(JSON.parse(savedUser));
    loadLinkedStudent();
  }, []);

  const loadLinkedStudent = async () => {
    // In this simulation, we check if the current parent has an active linked child
    const keys = Object.keys(localStorage);
    const parentEmail = JSON.parse(localStorage.getItem('jeepro_user') || '{}').email;
    
    for (const key of keys) {
      if (key.startsWith('jeepro_data_')) {
        const student = JSON.parse(localStorage.getItem(key) || '{}') as StudentData;
        if (student.connectedParent?.email === parentEmail) {
          setLinkedStudentData(student);
          return;
        }
      }
    }
  };

  const handleSearch = async () => {
    if (!searchId.trim()) return;
    setIsSearching(true);
    const result = await api.searchStudent(searchId);
    setSearchResult(result);
    setIsSearching(false);
  };

  const sendInvitation = async (student: UserAccount) => {
    if (!parentAccount) return;
    setIsInviting(true);
    
    const invitation: ParentInvitation = {
      id: `INV-${Math.random().toString(36).substr(2, 9)}`,
      parentName: parentAccount.name,
      parentEmail: parentAccount.email,
      sentAt: new Date().toISOString()
    };

    await api.sendInvite(student.id, invitation);
    
    setInviteSentForId(student.id);
    setIsInviting(false);
  };

  const renderConnectionPanel = () => (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-2xl text-center space-y-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 p-12 opacity-5"><UserPlus className="w-64 h-64" /></div>
        <div className="w-20 h-20 bg-indigo-600 text-white rounded-[2rem] flex items-center justify-center mx-auto border-8 border-indigo-50 shadow-xl relative z-10"><Search className="w-8 h-8" /></div>
        <div className="relative z-10">
          <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic">Establish Handshake.</h3>
          <p className="text-slate-500 max-w-sm mx-auto mt-2 text-sm font-medium italic">Search for your student's unique ID to request live academic access.</p>
        </div>
        <div className="flex flex-col md:flex-row gap-3 max-w-lg mx-auto relative z-10">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Enter Student ID or Name..." value={searchId} onChange={(e) => setSearchId(e.target.value)} className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-[1.5rem] text-sm font-bold focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all shadow-inner outline-none" />
          </div>
          <button onClick={handleSearch} disabled={isSearching} className="bg-slate-900 text-white px-10 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-xl flex items-center gap-2">
            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Execute Lookup'}
          </button>
        </div>

        {searchResult && (
          <div className="bg-indigo-50 p-10 rounded-[3rem] border border-indigo-100 flex flex-col md:flex-row items-center justify-between animate-in zoom-in-95 duration-500 relative z-10">
            <div className="flex items-center gap-6 text-left">
              <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center font-black text-4xl text-indigo-600 shadow-xl border border-indigo-100">{searchResult.name[0]}</div>
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
    </div>
  );

  if (!linkedStudentData) {
    return (
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="space-y-3">
          <div className="text-[11px] font-black uppercase text-indigo-600 tracking-widest">Parental Sentinel Protocol</div>
          <h2 className="text-6xl font-black text-slate-900 tracking-tighter italic leading-none">Access <br /><span className="text-indigo-600">Restricted.</span></h2>
        </div>
        {renderConnectionPanel()}
      </div>
    );
  }

  // Calculate Metrics for the linked student
  const student = linkedStudentData;
  const recentTests = student.testHistory.slice(0, 3);
  const avgAccuracy = Math.round(student.chapters.reduce((acc, c) => acc + (c.accuracy || 0), 0) / (student.chapters.length || 1));
  const latestWellness = student.psychometricHistory[student.psychometricHistory.length - 1];

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-32 animate-in fade-in duration-700 px-4">
      {/* Header Panel */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 px-4 py-1.5 rounded-full w-fit">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[9px] font-black uppercase text-emerald-600 tracking-widest">Live Feed: {student.name}</span>
          </div>
          <h2 className="text-6xl font-black text-slate-900 tracking-tighter italic leading-none">Guardian <br /><span className="text-indigo-600">Console.</span></h2>
        </div>

        <nav className="flex p-2 bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-x-auto">
          {[
            { id: 'status', label: 'Summary', icon: LayoutDashboard },
            { id: 'analytics', label: 'Exams', icon: BarChart },
            { id: 'syllabus', label: 'Course', icon: BookOpen },
            { id: 'wellness', label: 'Mental State', icon: Brain }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveSection(tab.id as any)} className={`px-8 py-3.5 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 whitespace-nowrap ${activeSection === tab.id ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-700'}`}><tab.icon className="w-4 h-4" />{tab.label}</button>
          ))}
        </nav>
      </div>

      <main className="space-y-12">
        {activeSection === 'status' && (
          <div className="space-y-12">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Academic Standing', val: avgAccuracy > 70 ? 'Superior' : 'Building', color: 'indigo', icon: Target },
                  { label: 'Recent Accuracy', val: `${avgAccuracy}%`, color: 'emerald', icon: Activity },
                  { label: 'Stress Buffer', val: latestWellness ? (latestWellness.stress < 5 ? 'High' : 'Medium') : 'Unknown', color: 'rose', icon: Heart },
                  { label: 'Handshake Status', val: 'Verified', color: 'blue', icon: ShieldCheck }
                ].map((s, i) => (
                  <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-indigo-400 transition-all">
                    <div className={`w-12 h-12 bg-${s.color}-50 text-${s.color}-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}><s.icon className="w-6 h-6" /></div>
                    <div><div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{s.label}</div><div className="text-2xl font-black text-slate-800">{s.val}</div></div>
                  </div>
                ))}
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 bg-slate-900 rounded-[4rem] p-12 text-white relative overflow-hidden shadow-2xl">
                   <div className="absolute top-0 right-0 p-12 opacity-5"><Activity className="w-64 h-64" /></div>
                   <div className="relative z-10 space-y-10">
                      <div className="space-y-2">
                        <h3 className="text-3xl font-black italic tracking-tighter uppercase text-indigo-400">Current Phase Analysis.</h3>
                        <p className="text-slate-400 font-medium italic">Integrated diagnostic of student engagement.</p>
                      </div>
                      <div className="p-8 bg-white/5 border border-white/10 rounded-3xl">
                        <p className="text-lg md:text-xl font-bold italic text-indigo-100 leading-relaxed">
                          "{student.name} is currently focused on <b>{student.chapters.find(c => c.status === 'LEARNING')?.name || 'Inorganic Chemistry'}</b>. Their mock test stability is currently trending upwards with a 4% improvement in accuracy over the last 3 sessions."
                        </p>
                      </div>
                      <div className="flex gap-6">
                        <button onClick={() => setActiveSection('analytics')} className="px-8 py-3 bg-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all flex items-center gap-3">Full Data Review <ChevronRight className="w-4 h-4" /></button>
                      </div>
                   </div>
                </div>

                <div className="lg:col-span-4 bg-white p-10 rounded-[4rem] border border-slate-200 shadow-sm space-y-8">
                   <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-[0.3em]">Latest Mock Scores</h4>
                   <div className="space-y-6">
                      {recentTests.map((test, i) => (
                        <div key={i} className="flex items-center justify-between group">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center font-black text-xs shadow-inner">{i+1}</div>
                              <div className="font-bold text-slate-800 text-sm italic">{test.testName}</div>
                           </div>
                           <div className="text-right">
                              <div className="text-base font-black text-indigo-600">{test.score}</div>
                              <div className="text-[8px] font-black text-slate-300 uppercase">{test.accuracy}% Acc.</div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeSection === 'analytics' && (
           <div className="space-y-12 animate-in slide-in-from-bottom-4">
              <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden">
                 <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="text-2xl font-black italic text-slate-800 flex items-center gap-4"><History className="w-6 h-6 text-indigo-600" /> Exam Ledger</h3>
                    <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Total Mock Sessions: {student.testHistory.length}</div>
                 </div>
                 <div className="divide-y divide-slate-50">
                    {student.testHistory.map((res, i) => (
                      <div key={i} className="p-8 flex flex-col md:flex-row justify-between items-center gap-6 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-6">
                          <div className="w-12 h-12 bg-white rounded-2xl border border-slate-200 flex items-center justify-center text-slate-400"><Target className="w-6 h-6" /></div>
                          <div>
                            <div className="text-xl font-black text-slate-800 italic tracking-tight">{res.testName}</div>
                            <div className="text-[10px] font-black text-slate-400 uppercase mt-1 tracking-widest">{res.date} • {res.totalMarks} Total Points</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-10">
                           <div className="text-center">
                              <div className="text-[10px] font-black text-slate-400 uppercase">Score Delta</div>
                              <div className="text-2xl font-black text-slate-900">{res.score}</div>
                           </div>
                           <div className="px-6 py-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full font-black text-xs">{res.accuracy}% Accuracy</div>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        )}

        {activeSection === 'syllabus' && (
          <div className="space-y-12 animate-in slide-in-from-bottom-4">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {['Physics', 'Chemistry', 'Mathematics'].map(s => {
                   const sChapters = student.chapters.filter(c => c.subject === s);
                   const sProgress = Math.round(sChapters.reduce((acc, c) => acc + c.progress, 0) / (sChapters.length || 1));
                   const mastered = sChapters.filter(c => c.status === 'COMPLETED').length;
                   
                   return (
                     <div key={s} className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-8">
                        <div className="flex justify-between items-center">
                           <h4 className="text-2xl font-black italic text-slate-800">{s}</h4>
                           <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">Core Node</span>
                        </div>
                        <div className="space-y-4">
                           <div className="flex justify-between items-end">
                              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Global Coverage</span>
                              <span className="text-xl font-black text-slate-900">{sProgress}%</span>
                           </div>
                           <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${sProgress}%` }}></div>
                           </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="p-4 bg-slate-50 rounded-2xl text-center">
                              <div className="text-[8px] font-black uppercase text-slate-400 mb-1">Mastered</div>
                              <div className="text-lg font-black">{mastered}</div>
                           </div>
                           <div className="p-4 bg-slate-50 rounded-2xl text-center">
                              <div className="text-[8px] font-black uppercase text-slate-400 mb-1">Remaining</div>
                              <div className="text-lg font-black">{sChapters.length - mastered}</div>
                           </div>
                        </div>
                     </div>
                   );
                })}
             </div>
          </div>
        )}

        {activeSection === 'wellness' && (
          <div className="space-y-12 animate-in slide-in-from-bottom-4">
            {!latestWellness ? (
              <div className="bg-white p-20 rounded-[4rem] border-4 border-dashed border-slate-100 text-center space-y-6">
                 <Brain className="w-16 h-16 text-slate-200 mx-auto" />
                 <h3 className="text-2xl font-black text-slate-400 italic">No Wellness Telemetry Found.</h3>
                 <p className="text-slate-400 max-w-xs mx-auto text-sm italic">Wellness metrics are generated when the student completes their monthly Mindset Calibration.</p>
              </div>
            ) : (
              <div className="space-y-12">
                 <div className="bg-slate-900 rounded-[3.5rem] p-12 md:p-20 text-white relative overflow-hidden shadow-2xl group">
                    <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-110 transition-transform"><Heart className="w-64 h-64" /></div>
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20">
                       <div className="space-y-10">
                          <div className="space-y-2">
                             <div className="inline-flex items-center gap-3 bg-white/10 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 text-indigo-300">Guardian Advisory Node</div>
                             <h3 className="text-5xl font-black italic tracking-tighter uppercase leading-none">The Parent's <br /><span className="text-indigo-400">Toolkit.</span></h3>
                          </div>
                          
                          <div className="space-y-8">
                             <div className="p-10 bg-white/5 border border-white/10 rounded-[3rem] space-y-6">
                                <h4 className="flex items-center gap-3 text-lg font-black italic text-emerald-400"><Sparkles className="w-5 h-5" /> How to Help Right Now</h4>
                                <p className="text-indigo-100 text-lg font-medium leading-relaxed italic">
                                   "Student shows elevated focus capacity but high stress on backlogs. Encourage them to use the <b>Backlog Recovery Protocol</b> instead of extending study hours beyond 10:30 PM."
                                </p>
                             </div>
                             <div className="flex gap-10">
                                <div><div className="text-[10px] font-black uppercase text-indigo-400 tracking-widest mb-1">Status</div><div className="text-xl font-black">Supportive Phase</div></div>
                                <div><div className="text-[10px] font-black uppercase text-indigo-400 tracking-widest mb-1">Priority</div><div className="text-xl font-black">Rest Recovery</div></div>
                             </div>
                          </div>
                       </div>

                       <div className="space-y-8">
                          <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Mental Health Vectors</h4>
                          <div className="space-y-6">
                             {[
                               { label: 'Anxiety Load', val: latestWellness.stress, color: 'bg-rose-500' },
                               { label: 'Focus Depth', val: latestWellness.focus, color: 'bg-indigo-500' },
                               { label: 'Motivation', val: latestWellness.motivation, color: 'bg-emerald-500' },
                               { label: 'Exam Stoicism', val: latestWellness.examFear, color: 'bg-amber-500' }
                             ].map(v => (
                               <div key={v.label} className="space-y-3">
                                  <div className="flex justify-between text-[11px] font-black uppercase tracking-widest"><span>{v.label}</span><span>{v.val}/10</span></div>
                                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                     <div className={`${v.color} h-full transition-all duration-1000`} style={{ width: `${v.val * 10}%` }}></div>
                                  </div>
                               </div>
                             ))}
                          </div>
                          <div className="p-6 bg-amber-50/5 border border-amber-500/20 rounded-2xl flex gap-5 items-start">
                             <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0" />
                             <p className="text-xs text-slate-400 italic">High Anxiety levels detected in the 'Numerical Phobia' dimension. Avoid asking for test results immediately after mock sessions.</p>
                          </div>
                       </div>
                    </div>
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
