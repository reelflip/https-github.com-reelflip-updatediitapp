
import React, { useEffect, useState } from 'react';
import { StudentData } from '../types';
import { getSmartStudyAdvice } from '../services/intelligenceService';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { Sparkles, Timer, Target, Brain, AlertCircle, TrendingUp, ShieldCheck, Loader2, ChevronRight, Activity, Box } from 'lucide-react';

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
    if (accuracy > 80) return '#10b981';
    if (accuracy > 60) return '#6366f1';
    return '#f43f5e';
  };

  const weakChapter = data.chapters.find(c => c.accuracy < 60) || data.chapters[0];

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-32">
      {/* Header Stat Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
         <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-[#82c341] transition-all">
            <div className="w-12 h-12 bg-emerald-50 text-[#82c341] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner"><Target className="w-6 h-6" /></div>
            <div>
               <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Confidence Index</div>
               <div className="text-4xl font-black text-[#0a1128] font-space italic">{confidenceIndex}%</div>
            </div>
         </div>
         <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-indigo-400 transition-all">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner"><Timer className="w-6 h-6" /></div>
            <div>
               <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Effort Log</div>
               <div className="text-4xl font-black text-[#0a1128] font-space italic">{Math.round(totalTime / 60)}h</div>
            </div>
         </div>
         <div className="md:col-span-2 bg-[#0a1128] p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12 group-hover:scale-110 transition-transform duration-[5s]"><Sparkles className="w-48 h-48" /></div>
            <div className="relative z-10 flex h-full items-center justify-between gap-10">
               <div className="space-y-2">
                  <div className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.4em] mb-4 flex items-center gap-3">
                     <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div> Active Session: {data.name}
                  </div>
                  <h3 className="text-4xl font-black italic tracking-tighter uppercase font-space">Strategic <br /> <span className="text-[#82c341]">Dominance.</span></h3>
               </div>
               <button className="p-6 bg-white/10 rounded-[2.5rem] border border-white/20 hover:bg-white hover:text-[#0a1128] transition-all shadow-xl">
                  <ChevronRight className="w-8 h-8" />
               </button>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Left: Intelligence Stream */}
        <div className="xl:col-span-8 space-y-10">
           <section className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-sm space-y-12">
              <div className="flex justify-between items-center px-4">
                 <h3 className="text-2xl font-black text-[#0a1128] italic tracking-tight font-space">Syllabus Stability Heatmap</h3>
                 <div className="flex gap-4">
                    <div className="flex items-center gap-2 text-[9px] font-black uppercase text-slate-400"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div> Stable</div>
                    <div className="flex items-center gap-2 text-[9px] font-black uppercase text-slate-400"><div className="w-2.5 h-2.5 rounded-full bg-indigo-600"></div> Active</div>
                    <div className="flex items-center gap-2 text-[9px] font-black uppercase text-slate-400"><div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div> Drift</div>
                 </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.chapters} barGap={8}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" hide axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} />
                    <Tooltip 
                      cursor={{fill: '#f8fafc'}}
                      contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)'}}
                    />
                    <Bar dataKey="accuracy" radius={[8, 8, 0, 0]} barSize={32}>
                      {data.chapters.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getForgettingColor(entry.accuracy)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
           </section>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="bg-[#f8fafc] p-12 rounded-[4rem] border border-slate-100 shadow-inner space-y-10">
                 <h4 className="text-[10px] font-black uppercase text-[#0a1128] tracking-[0.4em] flex items-center gap-3"><Activity className="w-4 h-4 text-emerald-500" /> Mastery Projections</h4>
                 <div className="space-y-8">
                    {data.chapters.slice(0, 3).map((ch, i) => (
                      <div key={i} className="space-y-2">
                         <div className="flex justify-between items-end">
                            <span className="text-xs font-black text-slate-500 italic tracking-tight">{ch.name}</span>
                            <span className="text-lg font-black text-[#0a1128]">{ch.progress}%</span>
                         </div>
                         <div className="w-full h-2 bg-white rounded-full overflow-hidden shadow-inner border border-slate-50">
                            <div className="h-full bg-indigo-600 transition-all duration-[1.5s]" style={{ width: `${ch.progress}%` }}></div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="bg-[#0a1128] p-12 rounded-[4rem] text-white shadow-2xl space-y-10 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-125 transition-transform duration-[5s]"><Box className="w-48 h-48" /></div>
                 <h4 className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.4em] flex items-center gap-3"><Sparkles className="w-4 h-4 text-[#82c341]" /> Tactical Hint</h4>
                 <p className="text-xl font-medium leading-relaxed italic text-indigo-100 relative z-10">
                   "Your drift in {weakChapter?.name} is caused by a focus gap in morning slots. Shift your Calculus drills to 08:00 AM for maximum retention."
                 </p>
                 <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'mistakes' }))}
                  className="w-full py-5 bg-white text-[#0a1128] rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl hover:scale-105 transition-all relative z-10"
                 >
                    Address Weak Zones
                 </button>
              </div>
           </div>
        </div>

        {/* Right: Coach Advice */}
        <div className="xl:col-span-4 space-y-10">
           <section className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-sm h-full flex flex-col">
              <div className="flex items-center gap-4 mb-12">
                 <div className="w-14 h-14 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-indigo-400 shadow-xl"><Brain className="w-7 h-7" /></div>
                 <div>
                    <h3 className="text-2xl font-black text-[#0a1128] italic uppercase font-space tracking-tight">Coach.</h3>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Neural Directives</p>
                 </div>
              </div>

              {loadingAdvice ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                   <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Computing Logic...</p>
                </div>
              ) : advice ? (
                <div className="flex-1 flex flex-col justify-between space-y-12">
                   <div className="space-y-10">
                      <div>
                         <div className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-6">Immediate Priorities</div>
                         <div className="space-y-6">
                            {advice.priorities.map((p: string, i: number) => (
                              <div key={i} className="flex gap-5 group">
                                 <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-black shrink-0 border border-indigo-100 transition-all group-hover:bg-[#0a1128] group-hover:text-white">0{i+1}</div>
                                 <p className="text-sm font-bold text-slate-600 italic leading-relaxed group-hover:text-[#0a1128] transition-colors">"{p}"</p>
                              </div>
                            ))}
                         </div>
                      </div>

                      <div className="p-8 bg-[#f8fafc] rounded-[2.5rem] border border-slate-100 shadow-inner">
                         <div className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4">Mindset State</div>
                         <p className="text-base font-bold text-[#0a1128] italic leading-relaxed">"{advice.mindsetTip}"</p>
                      </div>
                   </div>

                   <button className="w-full py-6 bg-slate-50 border border-slate-200 text-[#0a1128] rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-[#0a1128] hover:text-white transition-all shadow-sm">
                      Establish Sync
                   </button>
                </div>
              ) : null}
           </section>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
