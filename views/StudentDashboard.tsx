
import React, { useEffect, useState } from 'react';
import { StudentData } from '../types';
import { getSmartStudyAdvice } from '../services/intelligenceService';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line
} from 'recharts';
// Added missing Loader2 import
import { Sparkles, Timer, Target, Brain, AlertCircle, TrendingUp, Users, ShieldCheck, HeartHandshake, Loader2 } from 'lucide-react';

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
  }, [data]);

  const totalTime = (Object.values(data.timeSummary) as number[]).reduce((a, b) => a + b, 0);
  const confidenceIndex = Math.round(
    (data.chapters.reduce((acc, c) => acc + c.accuracy, 0) / data.chapters.length + 
    (10 - (data.psychometricHistory[data.psychometricHistory.length-1]?.stress || 5)) * 10) / 2
  );

  const getForgettingColor = (accuracy: number) => {
    if (accuracy > 80) return '#22c55e';
    if (accuracy > 60) return '#f59e0b';
    return '#ef4444';
  };

  const weakChapter = data.chapters.find(c => c.accuracy < 60) || data.chapters[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <section className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12">
          <Brain className="w-80 h-80" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
               <h2 className="text-5xl font-black italic flex items-center gap-3 tracking-tighter">
                <Sparkles className="w-10 h-10 text-indigo-500" />
                Smart Local Coach
               </h2>
               {data.connectedParent && (
                 <div className="inline-flex items-center gap-2 bg-indigo-600/30 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Live Handshake: {data.connectedParent.name}
                 </div>
               )}
            </div>
            <p className="text-slate-400 font-medium text-xl">Tactical analysis for {data.name}. (Offline Mode)</p>
          </div>
          
          <div className="flex gap-6">
             <div className="bg-white/5 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/10 text-center min-w-[160px] shadow-2xl">
                <div className="text-[10px] uppercase font-black text-indigo-400 tracking-[0.2em] mb-1">Confidence</div>
                <div className="text-6xl font-black italic">{confidenceIndex}%</div>
             </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {loadingAdvice ? (
            <div className="col-span-3 py-20 flex flex-col items-center justify-center bg-white/5 rounded-[2.5rem] border border-white/10 border-dashed">
              <Loader2 className="h-12 w-12 text-indigo-500 animate-spin mb-4" />
              <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Heuristic Engine Computing...</p>
            </div>
          ) : advice ? (
            <>
              <div className="bg-white/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 flex flex-col justify-between">
                <div>
                   <div className="font-black mb-6 flex items-center gap-2 text-[10px] uppercase tracking-widest text-indigo-400">
                     <Target className="w-4 h-4" /> Local Priorities
                   </div>
                   <ul className="space-y-4 text-sm font-bold text-slate-200">
                     {advice.priorities.map((p: string, i: number) => (
                       <li key={i} className="flex gap-4">
                         <span className="text-indigo-500 font-black">0{i+1}.</span>
                         <span className="leading-relaxed">{p}</span>
                       </li>
                     ))}
                   </ul>
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10">
                <div className="font-black mb-6 flex items-center gap-2 text-[10px] uppercase tracking-widest text-amber-400">
                  <AlertCircle className="w-4 h-4" /> Cognitive State
                </div>
                <p className="text-lg italic font-medium text-slate-300 leading-relaxed">"{advice.mindsetTip}"</p>
                {advice.burnoutAlert && (
                   <div className="mt-6 text-[10px] bg-rose-500/20 p-4 rounded-2xl border border-rose-500/30 text-rose-300 font-black uppercase tracking-widest animate-pulse">
                      {advice.burnoutAlert}
                   </div>
                )}
              </div>
              <div className="bg-white/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 flex flex-col justify-between">
                <div>
                   <div className="font-black mb-6 flex items-center gap-2 text-[10px] uppercase tracking-widest text-emerald-400">
                     <TrendingUp className="w-4 h-4" /> Error Intelligence
                   </div>
                   <p className="text-sm font-medium text-slate-300 leading-relaxed italic">Last drill analyzed. Drift detected in {weakChapter?.name}. Dynamic revision cards queued locally.</p>
                </div>
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'mistakes' }))}
                  className="mt-8 w-full bg-white text-slate-900 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl"
                >
                  Clear Errors
                </button>
              </div>
            </>
          ) : null}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white p-10 rounded-[4rem] shadow-sm border border-slate-200">
            <h3 className="text-2xl font-black mb-10 flex items-center justify-between italic tracking-tight text-slate-800">
              Retention Analytics
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Stability Map</span>
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.chapters}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 'bold', fill: '#94a3b8'}} />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)'}}
                  />
                  <Bar dataKey="accuracy" radius={[12, 12, 0, 0]} barSize={20}>
                    {data.chapters.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getForgettingColor(entry.accuracy)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-10">
          <div className="bg-white p-10 rounded-[4rem] shadow-sm border border-slate-200 space-y-8">
            <h4 className="font-black flex items-center gap-3 text-lg italic text-slate-800">
              <Timer className="w-6 h-6 text-indigo-600" /> Time Metrics
            </h4>
            <div className="space-y-8">
              {(Object.entries(data.timeSummary) as [string, number][]).map(([key, val]) => (
                <div key={key}>
                  <div className="flex justify-between text-[10px] font-black mb-3 uppercase text-slate-400 tracking-widest">
                    <span>{key}</span>
                    <span className="text-slate-900">{Math.round(val / 60)}h logged</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className="h-full bg-indigo-600 transition-all duration-1000" 
                      style={{ width: `${(val / (totalTime || 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
