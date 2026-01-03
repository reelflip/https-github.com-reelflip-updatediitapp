
import React, { useState, useEffect, useMemo } from 'react';
import { StudentData, UserAccount, ParentInvitation } from '../types';
import { api } from '../services/apiService';
import { 
  Heart, ShieldAlert, Calendar, CheckCircle2,
  UserPlus, Search, BookOpen,
  Brain, ShieldCheck, Activity, BarChart, 
  Sparkles, Target, History,
  RefreshCcw, Send, Loader2, ChevronRight,
  TrendingUp, Link, User, Zap
} from 'lucide-react';

interface ParentDashboardProps {
  data: StudentData; 
  externalActiveTab?: string;
}

const PlaceholderView = ({ title }: { title: string }) => (
  <div className="max-w-4xl mx-auto py-20 px-4 animate-in fade-in duration-500">
    <div className="bg-white p-16 rounded-[4rem] border border-slate-200 shadow-sm text-center space-y-8">
      <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner">
        <Link className="w-8 h-8" />
      </div>
      <div className="space-y-3">
        <h3 className="text-3xl font-black text-slate-800 italic uppercase tracking-tighter">{title} Unavailable.</h3>
        <p className="text-slate-500 max-w-sm mx-auto font-medium leading-relaxed italic">
          This academic stream is locked. You must first establish a student handshake in the "Connect Student" section.
        </p>
      </div>
      <button 
        onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'parent-connect' }))}
        className="bg-indigo-600 text-white px-10 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-indigo-700 transition-all flex items-center gap-3 mx-auto"
      >
        Go to Connection Hub <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  </div>
);

const ParentDashboard: React.FC<ParentDashboardProps> = ({ externalActiveTab }) => {
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState<UserAccount | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteSentForId, setInviteSentForId] = useState<string | null>(null);
  const [linkedStudentData, setLinkedStudentData] = useState<StudentData | null>(null);
  const [parentAccount, setParentAccount] = useState<UserAccount | null>(null);

  const isDemoAccount = parentAccount?.email === 'parent@demo.in';

  // Derive active view from sidebar tab
  const activeView = useMemo(() => {
    if (!externalActiveTab) return 'status';
    return externalActiveTab.replace('parent-', '');
  }, [externalActiveTab]);

  useEffect(() => {
    const savedUser = localStorage.getItem('jeepro_user');
    if (savedUser) setParentAccount(JSON.parse(savedUser));
    loadLinkedStudent();
  }, []);

  const loadLinkedStudent = async () => {
    const keys = Object.keys(localStorage);
    const parentEmailStr = localStorage.getItem('jeepro_user');
    if (!parentEmailStr) return;
    
    const parentEmail = JSON.parse(parentEmailStr).email;
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

  const handleDemoConnect = async () => {
    if (!parentAccount) return;
    setIsSearching(true);
    const demoStudentId = '163110';
    const studentData = await api.getStudentData(demoStudentId);
    if (studentData) {
      const updatedData: StudentData = {
        ...studentData,
        connectedParent: {
          name: parentAccount.name,
          email: parentAccount.email,
          linkedSince: new Date().toLocaleDateString()
        }
      };
      await api.updateStudentData(demoStudentId, updatedData);
      setLinkedStudentData(updatedData);
    }
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

  const student = linkedStudentData;
  const recentTests = student?.testHistory?.slice(0, 5) || [];
  const avgAccuracy = student?.chapters?.length 
    ? Math.round(student.chapters.reduce((acc, c) => acc + (c.accuracy || 0), 0) / student.chapters.length) 
    : 0;
  const latestWellness = student?.psychometricHistory?.length 
    ? student.psychometricHistory[student.psychometricHistory.length - 1] 
    : null;

  const renderConnectionHub = () => (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500 py-10">
      <div className="bg-white p-12 rounded-[3.5rem] border border-slate-200 shadow-2xl text-center space-y-8 overflow-hidden relative">
        <div className="absolute top-0 left-0 p-12 opacity-5"><UserPlus className="w-64 h-64" /></div>
        <div className="w-20 h-20 bg-indigo-600 text-white rounded-[2rem] flex items-center justify-center mx-auto border-8 border-indigo-50 shadow-xl relative z-10">
          <UserPlus className="w-8 h-8" />
        </div>
        <div className="relative z-10">
          <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic">Establish Connection.</h3>
          <p className="text-slate-500 max-w-sm mx-auto mt-2 text-sm font-medium italic">Enter your student's unique ID to request access to their academic profile.</p>
        </div>

        {/* Quick Connect for Demo Parent */}
        {isDemoAccount && !linkedStudentData && (
          <div className="relative z-10 p-6 bg-indigo-50 border border-indigo-100 rounded-3xl animate-in zoom-in-95 duration-700">
             <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-4 text-left">
                   <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
                      <Zap className="w-6 h-6" />
                   </div>
                   <div>
                      <div className="font-black text-slate-800 text-sm italic">Demo Simulation Point</div>
                      <p className="text-[10px] text-slate-500 font-medium">Instantly connect to "Aryan Sharma" (ID: 163110) for preview.</p>
                   </div>
                </div>
                <button 
                  onClick={handleDemoConnect}
                  className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg flex items-center gap-2"
                >
                   Quick Link <ChevronRight className="w-4 h-4" />
                </button>
             </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-3 max-w-lg mx-auto relative z-10">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Student ID (e.g. 163110)" 
              value={searchId} 
              onChange={(e) => setSearchId(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-[1.5rem] text-sm font-bold focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all shadow-inner outline-none" 
            />
          </div>
          <button onClick={handleSearch} disabled={isSearching} className="bg-slate-900 text-white px-10 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-xl flex items-center gap-2">
            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Execute Search'}
          </button>
        </div>

        {searchResult && (
          <div className="bg-indigo-50 p-8 rounded-[2.5rem] border border-indigo-100 flex flex-col md:flex-row items-center justify-between animate-in zoom-in-95 duration-500 relative z-10">
            <div className="flex items-center gap-6 text-left">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center font-black text-2xl text-indigo-600 shadow-lg border border-indigo-100">{searchResult.name[0]}</div>
              <div>
                <div className="font-black text-xl text-slate-900 italic tracking-tight">{searchResult.name}</div>
                <div className="text-[9px] font-black uppercase text-indigo-600 bg-white px-3 py-1 rounded-lg w-fit mt-1 tracking-widest">ID: {searchResult.id}</div>
              </div>
            </div>
            <div className="mt-6 md:mt-0">
               {inviteSentForId === searchResult.id ? (
                 <div className="flex items-center gap-3 px-6 py-3 bg-emerald-100 text-emerald-700 rounded-xl text-[9px] font-black uppercase tracking-widest border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4" /> Invitation Transmitted
                 </div>
               ) : (
                 <button onClick={() => sendInvitation(searchResult)} disabled={isInviting} className="bg-indigo-600 text-white px-8 py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all shadow-xl flex items-center gap-3">
                    {isInviting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> Send Invitation</>}
                 </button>
               )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-32 animate-in fade-in duration-700 px-4">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 py-6 border-b border-slate-100">
        <div className="flex items-center gap-6">
           <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100"><ShieldCheck className="w-7 h-7" /></div>
           <div>
              <h1 className="text-3xl font-black italic tracking-tighter text-slate-900 uppercase">Guardian Console</h1>
              <div className="flex items-center gap-2 mt-1">
                 <div className={`w-2 h-2 rounded-full ${student ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
                 <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    {student ? `Live Sync: ${student.name}` : 'Sync Pending'}
                 </span>
              </div>
           </div>
        </div>
        <div className="flex gap-4">
           {student && (
             <div className="px-5 py-2 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Global Precision</div>
                <div className="text-sm font-black text-slate-900">{avgAccuracy}%</div>
             </div>
           )}
           <button onClick={() => window.location.reload()} className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 transition-all">
             <RefreshCcw className="w-4 h-4" />
           </button>
        </div>
      </div>

      <main className="animate-in slide-in-from-bottom-4 duration-700">
        {/* PULSE VIEW */}
        {activeView === 'status' && (
          student ? (
            <div className="space-y-10">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Exam Readiness', val: avgAccuracy > 70 ? 'Superior' : 'Satisfactory', color: 'indigo', icon: Target },
                    { label: 'Weekly Velocity', val: 'Active', color: 'emerald', icon: Activity },
                    { label: 'Stress Buffer', val: latestWellness ? (latestWellness.stress < 5 ? 'Stable' : 'Elevated') : 'Unknown', color: 'rose', icon: Brain },
                    { label: 'Next Mock', val: '24 Jun', color: 'amber', icon: Calendar }
                  ].map((s, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center gap-5 group hover:border-indigo-400 transition-all">
                      <div className={`w-12 h-12 bg-${s.color}-50 text-${s.color}-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}><s.icon className="w-6 h-6" /></div>
                      <div><div className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-0.5">{s.label}</div><div className="text-lg font-black text-slate-800">{s.val}</div></div>
                    </div>
                  ))}
               </div>
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-8 bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
                     <div className="absolute top-0 right-0 p-10 opacity-5"><TrendingUp className="w-64 h-64" /></div>
                     <div className="relative z-10 space-y-8">
                        <div className="space-y-1">
                          <h3 className="text-2xl font-black italic tracking-tighter uppercase text-indigo-400">Current Phase Analysis</h3>
                          <p className="text-slate-400 text-sm font-medium italic">Intelligence engine diagnostic.</p>
                        </div>
                        <div className="p-8 bg-white/5 border border-white/10 rounded-[2rem]">
                          <p className="text-lg font-bold italic text-indigo-100 leading-relaxed">
                            "Student node is currently prioritizing <b>Mathematics</b> with an emphasis on high-weightage Calculus units. Accuracy in mock drills has stabilized at {avgAccuracy}%, showing a positive trajectory."
                          </p>
                        </div>
                     </div>
                  </div>
                  <div className="lg:col-span-4 bg-white p-8 rounded-[3rem] border border-slate-200 space-y-6">
                     <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-[0.3em] flex items-center gap-3"><History className="w-4 h-4 text-indigo-600" /> Recent Mock Sessions</h4>
                     <div className="space-y-5">
                        {recentTests.length > 0 ? recentTests.map((test, i) => (
                          <div key={i} className="flex items-center justify-between group pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                             <div>
                                <div className="font-black text-slate-800 text-sm italic">{test.testName}</div>
                                <div className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-0.5">{test.date}</div>
                             </div>
                             <div className="text-right">
                                <div className="text-base font-black text-indigo-600">{test.accuracy}%</div>
                                <div className="text-[8px] font-black text-slate-400 uppercase">Precision</div>
                             </div>
                          </div>
                        )) : <p className="text-xs text-slate-400 italic">No historical exam data synchronized.</p>}
                     </div>
                  </div>
               </div>
            </div>
          ) : <PlaceholderView title="Student Pulse" />
        )}

        {/* EXAMS VIEW */}
        {activeView === 'analytics' && (
           student ? (
             <div className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                   <h3 className="text-xl font-black italic text-slate-800 flex items-center gap-4"><History className="w-5 h-5 text-indigo-600" /> Comprehensive Test Ledger</h3>
                </div>
                <div className="divide-y divide-slate-50">
                   {student.testHistory.length === 0 ? (
                     <div className="p-20 text-center text-slate-300 font-black uppercase text-xs italic tracking-widest">No exam records found.</div>
                   ) : student.testHistory.map((res, i) => (
                     <div key={i} className="p-8 flex flex-col md:flex-row justify-between items-center gap-6 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-6">
                          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400"><Target className="w-5 h-5" /></div>
                          <div><div className="text-lg font-black text-slate-800 italic tracking-tight">{res.testName}</div><div className="text-[9px] font-black text-slate-400 uppercase mt-0.5 tracking-widest">{res.date} • {res.totalMarks} Total Score Potential</div></div>
                        </div>
                        <div className="flex items-center gap-10">
                           <div className="text-center">
                              <div className="text-[9px] font-black text-slate-400 uppercase">Delta</div>
                              <div className="text-xl font-black text-slate-900">{res.score}</div>
                           </div>
                           <div className={`px-5 py-2 rounded-full font-black text-[10px] tracking-widest border ${res.accuracy > 70 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>{res.accuracy}% ACCURACY</div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           ) : <PlaceholderView title="Performance Ledger" />
        )}

        {/* SYLLABUS VIEW */}
        {activeView === 'syllabus' && (
          student ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {['Physics', 'Chemistry', 'Mathematics'].map(s => {
                  const sChapters = student.chapters.filter(c => c.subject === s);
                  const sProgress = Math.round(sChapters.reduce((acc, c) => acc + c.progress, 0) / (sChapters.length || 1));
                  const mastered = sChapters.filter(c => c.status === 'COMPLETED').length;
                  return (
                    <div key={s} className="bg-white p-8 rounded-[3rem] border border-slate-200 space-y-6">
                       <div className="flex justify-between items-center">
                          <h4 className="text-xl font-black italic text-slate-800">{s}</h4>
                          <span className="text-[9px] font-black uppercase text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">Subject Core</span>
                       </div>
                       <div className="space-y-3">
                          <div className="flex justify-between items-end"><span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Coverage Depth</span><span className="text-lg font-black text-slate-900">{sProgress}%</span></div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${sProgress}%` }}></div></div>
                       </div>
                       <div className="grid grid-cols-2 gap-3">
                          <div className="p-4 bg-slate-50 rounded-2xl text-center"><div className="text-[7px] font-black uppercase text-slate-400 mb-0.5">Mastered</div><div className="text-base font-black">{mastered}</div></div>
                          <div className="p-4 bg-slate-50 rounded-2xl text-center"><div className="text-[7px] font-black uppercase text-slate-400 mb-0.5">Remaining</div><div className="text-base font-black">{sChapters.length - mastered}</div></div>
                       </div>
                    </div>
                  );
               })}
            </div>
          ) : <PlaceholderView title="Syllabus Mapping" />
        )}

        {/* WELLNESS VIEW */}
        {activeView === 'psychometric' && (
           student ? (
             <div className="space-y-8">
                {!latestWellness ? (
                  <div className="bg-white p-20 rounded-[3rem] border-4 border-dashed border-slate-100 text-center space-y-4">
                     <Brain className="w-12 h-12 text-slate-200 mx-auto" />
                     <h3 className="text-xl font-black text-slate-400 italic">No Wellness Telemetry.</h3>
                     <p className="text-slate-400 max-w-xs mx-auto text-sm italic">Mental health metrics are updated upon student Mindset Calibration.</p>
                  </div>
                ) : (
                  <div className="bg-slate-900 rounded-[3.5rem] p-12 text-white relative overflow-hidden shadow-2xl">
                     <div className="absolute top-0 right-0 p-12 opacity-5"><Heart className="w-64 h-64" /></div>
                     <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16">
                        <div className="space-y-8">
                           <div className="space-y-2">
                              <div className="inline-flex items-center gap-3 bg-white/10 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10 text-indigo-300">Guardian Advisory</div>
                              <h3 className="text-4xl font-black italic tracking-tighter uppercase">Parental <span className="text-indigo-400">Tactics.</span></h3>
                           </div>
                           <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-4">
                              <h4 className="flex items-center gap-3 text-base font-black italic text-emerald-400"><Sparkles className="w-4 h-4" /> Recommendation</h4>
                              <p className="text-indigo-100 text-base font-medium leading-relaxed italic">
                                 "Student focus depth is currently high ({latestWellness.focus}/10), but anxiety levels are elevated regarding backlogs. Prioritize supportive dialogue and ensure adequate sleep cycles over the next 48 hours."
                              </p>
                           </div>
                        </div>
                        <div className="space-y-6">
                           <h4 className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Mental Vectors</h4>
                           <div className="space-y-5">
                              {[
                                { label: 'Anxiety Load', val: latestWellness.stress, color: 'bg-rose-500' },
                                { label: 'Focus Stamina', val: latestWellness.focus, color: 'bg-indigo-500' },
                                { label: 'Motivation', val: latestWellness.motivation, color: 'bg-emerald-500' },
                                { label: 'Exam Stoicism', val: latestWellness.examFear, color: 'bg-amber-500' }
                              ].map(v => (
                                <div key={v.label} className="space-y-2">
                                   <div className="flex justify-between text-[10px] font-black uppercase tracking-widest"><span>{v.label}</span><span>{v.val}/10</span></div>
                                   <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden"><div className={`${v.color} h-full transition-all duration-1000`} style={{ width: `${v.val * 10}%` }}></div></div>
                                </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>
                )}
             </div>
           ) : <PlaceholderView title="Mental Status" />
        )}

        {/* CONNECT VIEW */}
        {activeView === 'connect' && renderConnectionHub()}
      </main>
    </div>
  );
};

export default ParentDashboard;
