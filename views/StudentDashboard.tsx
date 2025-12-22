
import React, { useEffect, useState } from 'react';
import { StudentData } from '../types';
import { getSmartStudyAdvice } from '../services/geminiService';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line
} from 'recharts';
import { Sparkles, Timer, Target, Brain, AlertCircle, TrendingUp, Users, ShieldCheck, HeartHandshake } from 'lucide-react';

interface StudentDashboardProps {
  data: StudentData;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ data }) => {
  const [advice, setAdvice] = useState<any>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  useEffect(() => {
    const fetchAdvice = async () => {
      setLoadingAdvice(true);
      const res = await getSmartStudyAdvice(data);
      setAdvice(res);
      setLoadingAdvice(false);
    };
    fetchAdvice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalTime = (Object.values(data.timeSummary) as number[]).reduce((a, b) => a + b, 0);
  const confidenceIndex = Math.round(
    (data.chapters.reduce((acc, c) => acc + c.accuracy, 0) / data.chapters.length + 
    (10 - (data.psychometricHistory[data.psychometricHistory.length-1]?.stress || 5)) * 10) / 2
  );

  const getForgettingColor = (accuracy: number) => {
    if (accuracy > 80) return '#22c55e'; // Green
    if (accuracy > 60) return '#f59e0b'; // Amber
    return '#ef4444'; // Red
  };

  const weakChapter = data.chapters.find(c => c.accuracy < 60) || data.chapters[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Smart Coach Header */}
      <section className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Brain className="w-48 h-48" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
               <h2 className="text-4xl font-black italic flex items-center gap-3 tracking-tighter">
                <Sparkles className="w-8 h-8 text-indigo-300" />
                Smart Study Coach
               </h2>
               {data.connectedParent && (
                 <div className="inline-flex items-center gap-2 bg-indigo-500/50 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">
                    <ShieldCheck className="w-4 h-4 text-emerald-300" />
                    Linked Guardian: {data.connectedParent.name}
                 </div>
               )}
            </div>
            <p className="text-indigo-100 font-medium text-lg">Personalized trajectory for {data.name}.</p>
          </div>
          
          <div className="flex gap-4">
             <div className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/20 text-center min-w-[140px]">
                <div className="text-[10px] uppercase font-black text-indigo-200 tracking-widest mb-1">Confidence</div>
                <div className="text-5xl font-black">{confidenceIndex}%</div>
             </div>
             <div className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/20 text-center min-w-[140px]">
                <div className="text-[10px] uppercase font-black text-indigo-200 tracking-widest mb-1">Streak</div>
                <div className="text-5xl font-black">12D</div>
             </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {loadingAdvice ? (
            <div className="col-span-3 py-16 flex flex-col items-center justify-center bg-white/5 rounded-[2rem] border border-white/10 border-dashed">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white mb-4"></div>
              <p className="text-sm font-black uppercase tracking-widest opacity-50">Analyzing Performance Patterns...</p>
            </div>
          ) : advice ? (
            <>
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-[2rem] border border-white/20">
                <div className="font-black mb-4 flex items-center gap-2 text-[10px] uppercase tracking-widest text-indigo-300">
                  <Target className="w-4 h-4" /> Top 3 Priorities
                </div>
                <ul className="space-y-3 text-sm font-bold text-indigo-50">
                  {advice.priorities.map((p: string, i: number) => (
                    <li key={i} className="flex gap-3">
                      <span className="text-indigo-300">0{i+1}.</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-[2rem] border border-white/20">
                <div className="font-black mb-4 flex items-center gap-2 text-[10px] uppercase tracking-widest text-amber-300">
                  <AlertCircle className="w-4 h-4" /> Health & Focus
                </div>
                <p className="text-sm italic font-medium text-indigo-50 leading-relaxed">"{advice.mindsetTip}"</p>
                {advice.burnoutAlert && (
                   <div className="mt-4 text-[10px] bg-red-500/20 p-3 rounded-xl border border-red-500/30 text-red-100 font-black uppercase tracking-widest">
                      {advice.burnoutAlert}
                   </div>
                )}
              </div>
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-[2rem] border border-white/20">
                <div className="font-black mb-4 flex items-center gap-2 text-[10px] uppercase tracking-widest text-emerald-300">
                  <TrendingUp className="w-4 h-4" /> Error Intelligence
                </div>
                <p className="text-xs font-medium text-indigo-100 leading-relaxed italic">Analysis shows calculation drifts in {weakChapter?.name}. Targeted revision cards queued.</p>
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'mistakes' }))}
                  className="mt-4 w-full bg-white text-indigo-600 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl"
                >
                  Correct Mistakes
                </button>
              </div>
            </>
          ) : (
             <div className="col-span-3 text-center py-6 bg-white/5 rounded-2xl border border-white/10 border-dashed">
                Connect API Key for Personalized AI Coaching.
             </div>
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress Overview */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-200">
            <h3 className="text-xl font-black mb-8 flex items-center justify-between italic tracking-tight">
              Mastery & Retention Risk
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Repetition Analytics</span>
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.chapters}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}}
                  />
                  <Bar dataKey="accuracy" radius={[8, 8, 0, 0]}>
                    {data.chapters.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getForgettingColor(entry.accuracy)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-200">
            <h3 className="text-xl font-black mb-8 italic tracking-tight">Psychometric Resilience</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.psychometricHistory}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="timestamp" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} />
                  <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}}
                  />
                  <Line type="monotone" dataKey="stress" stroke="#ef4444" strokeWidth={4} dot={{r: 6, fill: '#ef4444'}} />
                  <Line type="monotone" dataKey="focus" stroke="#6366f1" strokeWidth={4} dot={{r: 6, fill: '#6366f1'}} />
                  <Line type="monotone" dataKey="motivation" stroke="#22c55e" strokeWidth={4} dot={{r: 6, fill: '#22c55e'}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-200 space-y-6">
            <h4 className="font-black mb-4 flex items-center gap-2 text-sm italic">
              <Timer className="w-5 h-5 text-indigo-500" /> Unified Temporal Log
            </h4>
            <div className="space-y-6">
              {(Object.entries(data.timeSummary) as [string, number][]).map(([key, val]) => (
                <div key={key}>
                  <div className="flex justify-between text-[10px] font-black mb-2 uppercase text-slate-400 tracking-widest">
                    <span>{key}</span>
                    <span className="text-slate-900">{Math.round(val / 60)} Hours</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className="h-full bg-indigo-600 transition-all duration-1000" 
                      style={{ width: `${(val / (totalTime || 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Handshake Awareness Widget */}
          {data.connectedParent ? (
             <div className="bg-indigo-900 p-8 rounded-[3rem] text-white space-y-4 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><HeartHandshake className="w-24 h-24" /></div>
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                      <Users className="w-5 h-5 text-indigo-300" />
                   </div>
                   <h4 className="font-black italic text-lg">Active Handshake</h4>
                </div>
                <p className="text-xs font-medium text-indigo-100 leading-relaxed border-l-2 border-indigo-500 pl-4 py-1">
                   Linked with <b>{data.connectedParent.name}</b>. Your progress and mental health data is being shared securely for collaborative support.
                </p>
                <div className="text-[9px] font-black uppercase tracking-widest text-indigo-400">Linked since {data.connectedParent.linkedSince}</div>
             </div>
          ) : (
            <div className="bg-amber-50 p-8 rounded-[3rem] border border-amber-100 space-y-4 shadow-sm">
                <ShieldCheck className="w-8 h-8 text-amber-500" />
                <h4 className="font-black text-amber-900 italic">No Active Family Node</h4>
                <p className="text-xs font-medium text-amber-700 leading-relaxed italic">Handshake protocol is currently inactive. Parents can search for your ID <b>({data.id})</b> to initiate a link.</p>
            </div>
          )}

          <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-200 space-y-6">
            <h4 className="font-black italic text-lg">Revision Queue</h4>
            <div className="space-y-4">
              {data.flashcards.slice(0, 2).map(card => (
                <div key={card.id} className="p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 hover:border-indigo-300 transition-all cursor-pointer group">
                  <div className="font-bold text-slate-800 mb-2 leading-tight group-hover:text-indigo-600 transition-colors">{card.question}</div>
                  <div className="flex justify-between items-center text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">
                    <span>{card.difficulty} • {card.type}</span>
                    <span className="text-rose-500 animate-pulse">Critical</span>
                  </div>
                </div>
              ))}
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'flashcards' }))}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-600 transition-all"
              >
                Launch Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
