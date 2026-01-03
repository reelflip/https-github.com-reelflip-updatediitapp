
import React, { useEffect, useState } from 'react';
import { StudentData } from '../types';
import { api } from '../services/apiService';
import { getSmartStudyAdvice } from '../services/intelligenceService';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { Sparkles, Timer, Target, Brain, TrendingUp, Loader2, ChevronRight, Activity, Box, Quote, ChevronLeft, CloudSync, Wifi, ShieldCheck } from 'lucide-react';

interface StudentDashboardProps {
  data: StudentData;
}

const MOTIVATIONAL_QUOTES = [
  { text: "AIR-1 is not a destination; it is a daily habit of non-negotiable discipline.", author: "Solaris Core" },
  { text: "One more numerical. One more derivation. One step closer to the Apex.", author: "Tactical Protocol" },
  { text: "Pressure is a privilege. It is the friction that polishes the engineering mind.", author: "Performance Kernel" },
  { text: "The forgetting curve is your only enemy. Spaced recall is your primary weapon.", author: "Neural Link" },
  { text: "Consistency scales exponentially. Intensity without routine is just noise.", author: "Systems Analyst" }
];

const StudentDashboard: React.FC<StudentDashboardProps> = ({ data }) => {
  const [advice, setAdvice] = useState<any>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const mode = api.getMode();

  useEffect(() => {
    const fetchAdvice = async () => {
      if (!data || !data.chapters || data.chapters.length === 0) return;
      setLoadingAdvice(true);
      try {
        const res = await getSmartStudyAdvice(data);
        setAdvice(res);
      } catch (err) {
        console.error("AI Advice failed", err);
      }
      setLoadingAdvice(false);
    };
    fetchAdvice();
  }, [data]);

  // Motivational Slider Logic - Simplified to cycle quotes without a visual progress bar
  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex((current) => (current + 1) % MOTIVATIONAL_QUOTES.length);
    }, 10000); // 10 second discrete cycle
    return () => clearInterval(timer);
  }, []);

  const chapters = data?.chapters || [];
  const psychHistory = data?.psychometricHistory || [];
  const timeSummary = data?.timeSummary || { notes: 0, videos: 0, practice: 0, tests: 0 };

  const totalTime = (Object.values(timeSummary) as number[]).reduce((a, b) => a + (b || 0), 0);
  
  const avgAccuracy = chapters.length > 0 
    ? (chapters.reduce((acc, c) => acc + (c.accuracy || 0), 0) / chapters.length) 
    : 0;
    
  const currentStress = psychHistory.length > 0 
    ? (psychHistory[psychHistory.length - 1]?.stress || 5) 
    : 5;

  const confidenceIndex = Math.round((avgAccuracy + (10 - currentStress) * 10) / 2);

  const getForgettingColor = (accuracy: number) => {
    if (accuracy > 80) return '#10b981';
    if (accuracy > 60) return '#6366f1';
    return '#f43f5e';
  };

  const weakChapter = chapters.length > 0 
    ? (chapters.find(c => c.accuracy < 60) || null) 
    : null;

  const renderPriority = (p: any) => {
    if (typeof p === 'string') return p;
    if (p && typeof p === 'object') return p.task || p.description || "Study Task";
    return "Study Task";
  };

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in duration-700 pb-20">
      
      {/* --- UPLINK STATUS BAR --- */}
      <div className="flex justify-between items-center bg-white px-8 py-3 rounded-full border border-slate-100 shadow-sm mx-2">
         <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${mode === 'LIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`}></div>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
               {mode === 'LIVE' ? 'LIVE SQL PERSISTENCE ACTIVE' : 'SANDBOX MODE (LOCAL STORAGE)'}
            </span>
         </div>
         <div className="flex items-center gap-2 text-[8px] font-black text-slate-300 uppercase tracking-widest">
            <ShieldCheck className="w-3 h-3" /> Encrypted Handshake Established
         </div>
      </div>

      {/* --- MOTIVATIONAL SLIDER --- */}
      <section className="bg-[#0a1128] rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-14 text-white shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12 transition-transform duration-[10s] group-hover:scale-110 group-hover:rotate-45">
            <Quote className="w-64 h-64" />
         </div>
         
         <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="w-20 h-20 bg-indigo-500/20 rounded-[2rem] flex items-center justify-center shrink-0 border border-indigo-400/30 backdrop-blur-xl">
               <Sparkles className="w-10 h-10 text-indigo-400 animate-pulse" />
            </div>
            
            <div className="flex-1 text-center md:text-left space-y-4 md:space-y-6 min-h-[120px] flex flex-col justify-center">
               <div className="space-y-2">
                  <div className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.5em] mb-2 flex items-center justify-center md:justify-start gap-3">
                     <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div> Mental Calibration Active
                  </div>
                  <h2 className="text-2xl md:text-4xl font-black italic tracking-tighter leading-tight font-space animate-in slide-in-from-right-4 duration-500">
                    "{MOTIVATIONAL_QUOTES[quoteIndex].text}"
                  </h2>
               </div>
               <div className="flex flex-col md:flex-row items-center gap-6">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Source: {MOTIVATIONAL_QUOTES[quoteIndex].author}</span>
               </div>
            </div>

            <div className="flex gap-3">
               <button 
                  onClick={() => { setQuoteIndex((prev) => (prev - 1 + MOTIVATIONAL_QUOTES.length) % MOTIVATIONAL_QUOTES.length); }}
                  className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all"
               >
                  <ChevronLeft className="w-5 h-5 text-indigo-400" />
               </button>
               <button 
                  onClick={() => { setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length); }}
                  className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all"
               >
                  <ChevronRight className="w-5 h-5 text-indigo-400" />
               </button>
            </div>
         </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
         <div className="bg-white p-6 md:p-10 rounded-3xl md:rounded-[3.5rem] border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-[#82c341] transition-all">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-50 text-[#82c341] rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform shadow-inner"><Target className="w-5 h-5 md:w-6 md:h-6" /></div>
            <div>
               <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Confidence Index</div>
               <div className="text-3xl md:text-4xl font-black text-[#0a1128] font-space italic">{confidenceIndex || 0}%</div>
            </div>
         </div>
         <div className="bg-white p-6 md:p-10 rounded-3xl md:rounded-[3.5rem] border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-indigo-400 transition-all">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform shadow-inner"><Timer className="w-5 h-5 md:w-6 md:h-6" /></div>
            <div>
               <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Effort Log</div>
               <div className="text-3xl md:text-4xl font-black text-[#0a1128] font-space italic">{Math.round(totalTime / 60) || 0}h</div>
            </div>
         </div>
         <div className="sm:col-span-2 bg-[#0a1128] p-6 md:p-10 rounded-3xl md:rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12 group-hover:scale-110 transition-transform duration-[5s]"><Sparkles className="w-32 md:w-48 h-32 md:h-48" /></div>
            <div className="relative z-10 flex h-full items-center justify-between gap-4 md:gap-10">
               <div className="space-y-2">
                  <div className="text-[9px] md:text-[10px] font-black uppercase text-indigo-400 tracking-[0.3em] md:tracking-[0.4em] mb-2 md:mb-4 flex items-center gap-2 md:gap-3">
                     <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div> {data?.name || 'Aspirant'}
                  </div>
                  <h3 className="text-2xl md:text-4xl font-black italic tracking-tighter uppercase font-space leading-tight">Performance <br className="hidden md:block" /> <span className="text-[#82c341]">Metrics.</span></h3>
               </div>
               <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'learn' }))}
                  className="p-4 md:p-6 bg-white/10 rounded-2xl md:rounded-[2.5rem] border border-white/20 hover:bg-white hover:text-[#0a1128] transition-all shadow-xl shrink-0"
               >
                  <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
               </button>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-10">
        <div className="xl:col-span-8 space-y-6 md:space-y-10">
           <section className="bg-white p-6 md:p-12 rounded-3xl md:rounded-[4rem] border border-slate-200 shadow-sm space-y-8 md:space-y-12">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-2">
                 <h3 className="text-xl md:text-2xl font-black text-[#0a1128] italic tracking-tight font-space">Stability Heatmap</h3>
                 <div className="flex gap-3 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                    <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-slate-400 whitespace-nowrap"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Stable</div>
                    <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-slate-400 whitespace-nowrap"><div className="w-2 h-2 rounded-full bg-indigo-600"></div> Active</div>
                    <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-slate-400 whitespace-nowrap"><div className="w-2 h-2 rounded-full bg-rose-500"></div> Drift</div>
                 </div>
              </div>
              <div className="h-64 md:h-80 w-full">
                {chapters.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chapters} barGap={4}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" hide axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 'bold', fill: '#94a3b8'}} />
                      <Tooltip 
                        cursor={{fill: '#f8fafc'}}
                        contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)'}}
                      />
                      <Bar dataKey="accuracy" radius={[6, 6, 0, 0]} barSize={24}>
                        {chapters.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getForgettingColor(entry.accuracy || 0)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-300 font-black uppercase text-[10px] tracking-widest border-2 border-dashed border-slate-50 rounded-3xl">
                    No Tracking Active
                  </div>
                )}
              </div>
           </section>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
              <div className="bg-[#f8fafc] p-8 md:p-12 rounded-3xl md:rounded-[4rem] border border-slate-100 shadow-inner space-y-8 md:space-y-10">
                 <h4 className="text-[10px] font-black uppercase text-[#0a1128] tracking-[0.4em] flex items-center gap-3"><Activity className="w-4 h-4 text-emerald-500" /> Projections</h4>
                 <div className="space-y-6 md:space-y-8">
                    {chapters.length > 0 ? (
                      chapters.slice(0, 3).map((ch, i) => (
                        <div key={i} className="space-y-2">
                           <div className="flex justify-between items-end">
                              <span className="text-[10px] md:text-xs font-black text-slate-500 italic tracking-tight truncate max-w-[70%]">{ch.name}</span>
                              <span className="text-base md:text-lg font-black text-[#0a1128]">{ch.progress}%</span>
                           </div>
                           <div className="w-full h-2 bg-white rounded-full overflow-hidden shadow-inner border border-slate-50">
                              <div className="h-full bg-indigo-600 transition-all duration-[1.5s]" style={{ width: `${ch.progress}%` }}></div>
                           </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-slate-400 italic">No syllabus units tracked.</div>
                    )}
                 </div>
              </div>

              <div className="bg-[#0a1128] p-8 md:p-12 rounded-3xl md:rounded-[4rem] text-white shadow-2xl space-y-6 md:space-y-10 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-125 transition-transform duration-[5s]"><Box className="w-48 h-48" /></div>
                 <h4 className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.4em] flex items-center gap-3"><Sparkles className="w-4 h-4 text-[#82c341]" /> Insight</h4>
                 <p className="text-lg md:text-xl font-medium leading-relaxed italic text-indigo-100 relative z-10">
                   {weakChapter 
                    ? `"Precision drift detected in ${weakChapter.name}. Revision recommended."`
                    : `"Establish your academic roadmap to unlock analytical directives."`}
                 </p>
                 <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'learn' }))}
                  className="w-full py-4 md:py-5 bg-white text-[#0a1128] rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl hover:scale-105 transition-all relative z-10 active:scale-95"
                 >
                    Adjust Subject Metrics
                 </button>
              </div>
           </div>
        </div>

        <div className="xl:col-span-4">
           <section className="bg-white p-8 md:p-12 rounded-3xl md:rounded-[4rem] border border-slate-200 shadow-sm h-full flex flex-col">
              <div className="flex items-center gap-4 mb-8 md:mb-12">
                 <div className="w-12 h-12 md:w-14 md:h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-indigo-400 shadow-xl shrink-0"><Brain className="w-6 h-6 md:w-7 md:h-7" /></div>
                 <div>
                    <h3 className="text-xl md:text-2xl font-black text-[#0a1128] italic uppercase font-space tracking-tight">Assistance.</h3>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Guidance Engine</p>
                 </div>
              </div>

              {loadingAdvice ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-4 py-12">
                   <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Thinking...</p>
                </div>
              ) : advice ? (
                <div className="flex-1 flex flex-col justify-between space-y-8 md:space-y-12">
                   <div className="space-y-8">
                      <div>
                         <div className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4 md:mb-6">Immediate Priorities</div>
                         <div className="space-y-4 md:space-y-6">
                            {(advice.priorities || []).map((p: any, i: number) => (
                              <div key={i} className="flex gap-4 md:gap-5 group">
                                 <div className="w-5 h-5 md:w-6 md:h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-[9px] md:text-[10px] font-black shrink-0 border border-indigo-100">0{i+1}</div>
                                 <p className="text-xs md:text-sm font-bold text-slate-600 italic leading-relaxed group-hover:text-[#0a1128] transition-colors line-clamp-2">
                                   "{renderPriority(p)}"
                                 </p>
                              </div>
                            ))}
                         </div>
                      </div>

                      <div className="p-6 md:p-8 bg-[#f8fafc] rounded-2xl md:rounded-[2.5rem] border border-slate-100 shadow-inner">
                         <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-200 pb-2 mb-4">Functional Tip</div>
                         <p className="text-sm md:text-base font-bold text-[#0a1128] italic leading-relaxed">"{advice.mindsetTip || "Focus on consistency."}"</p>
                      </div>
                   </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-12">
                   <Sparkles className="w-6 h-6 text-slate-200" />
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Connect to Kernel</p>
                </div>
              )}
           </section>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
