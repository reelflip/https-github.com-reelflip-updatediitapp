
import React, { useMemo, useState } from 'react';
import { StudentData, Subject, Chapter, TestResult } from '../types';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip as ReTooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  BarChart, Bar, Legend, ComposedChart, Line, ScatterChart, Scatter, ZAxis
} from 'recharts';
import { 
  BarChart3, TrendingUp, Zap, Clock, Target, AlertCircle, 
  CheckCircle2, Activity, ArrowUpRight, Brain, Layers, ShieldAlert,
  BookOpen, Video, FileText, Timer, ChevronRight, Gauge, Filter, Search, 
  ArrowDownAZ, ArrowUpNarrowWide, Award, Flame, Fingerprint, Compass,
  LayoutGrid, List, Sparkles, GraduationCap
} from 'lucide-react';

const COLORS = {
  Physics: '#6366f1',
  Chemistry: '#10b981',
  Mathematics: '#f43f5e',
  Neutral: '#94a3b8',
  Accent: '#82c341'
};

const AnalyticsView: React.FC<{ data: StudentData }> = ({ data }) => {
  const [activeSubject, setActiveSubject] = useState<Subject | 'Global'>('Global');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'accuracy' | 'time' | 'efficiency'>('accuracy');

  const chapters = data?.chapters || [];
  const testHistory = data?.testHistory || [];

  // 1. Filtered Dataset based on subject toggle
  const filteredChapters = useMemo(() => {
    return activeSubject === 'Global' 
      ? chapters 
      : chapters.filter(c => c.subject === activeSubject);
  }, [chapters, activeSubject]);

  // 2. High-Level Metrics Calculation
  const metrics = useMemo(() => {
    const totalTime = filteredChapters.reduce((a, c) => a + (c.timeSpent || 0), 0);
    const avgAcc = filteredChapters.length > 0 
      ? Math.round(filteredChapters.reduce((a, c) => a + (c.accuracy || 0), 0) / filteredChapters.length)
      : 0;
    const progress = filteredChapters.length > 0
      ? Math.round(filteredChapters.reduce((a, c) => a + (c.progress || 0), 0) / filteredChapters.length)
      : 0;
    
    // Efficiency: Accuracy per hour of study
    const hours = totalTime / 3600 || 1;
    const efficiency = parseFloat((avgAcc / hours).toFixed(1));

    return { totalTime, avgAcc, progress, efficiency };
  }, [filteredChapters]);

  // 3. Application Gap Data (Practice vs Mock)
  const gapData = useMemo(() => {
    const subjects: Subject[] = ['Physics', 'Chemistry', 'Mathematics'];
    return subjects.map(s => {
      const sChapters = chapters.filter(c => c.subject === s);
      const practiceAcc = sChapters.length > 0 
        ? Math.round(sChapters.reduce((a, c) => a + (c.accuracy || 0), 0) / sChapters.length)
        : 0;
      
      const sTests = testHistory.filter(t => t.category === 'ADMIN' && (t.chapterIds || []).some(id => {
        const ch = chapters.find(c => c.id === id);
        return ch && ch.subject === s;
      }));
      const mockAcc = sTests.length > 0
        ? Math.round(sTests.reduce((a, t) => a + (t.accuracy || 0), 0) / sTests.length)
        : (practiceAcc > 10 ? practiceAcc - 8 : 0); // Simulated gap if no mocks

      return { subject: s, practice: practiceAcc, mock: mockAcc, gap: practiceAcc - mockAcc };
    });
  }, [chapters, testHistory]);

  // 4. Unit Intelligence Sorting
  const chapterLedger = useMemo(() => {
    return filteredChapters
      .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .map(c => {
        const hours = (c.timeSpent || 0) / 3600;
        const rot = hours > 0 ? ((c.accuracy || 0) / (hours + 0.1)).toFixed(1) : '0';
        return { ...c, hours: parseFloat(hours.toFixed(1)), rot: parseFloat(rot) };
      })
      .sort((a, b) => {
        if (sortBy === 'accuracy') return b.accuracy - a.accuracy;
        if (sortBy === 'time') return b.timeSpent - a.timeSpent;
        return b.rot - a.rot;
      });
  }, [filteredChapters, searchTerm, sortBy]);

  // 5. Predicted AIR Logic (Simulated for high-end product feel)
  const airPrediction = useMemo(() => {
    const baseRank = 1000000;
    const factor = (metrics.avgAcc / 100) * (metrics.progress / 100);
    const estimatedRank = Math.max(120, Math.round(baseRank * (1 - factor * 0.99)));
    const percentile = (100 - (estimatedRank / baseRank) * 100).toFixed(2);
    return { rank: estimatedRank, percentile };
  }, [metrics]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-40 max-w-screen-2xl mx-auto px-4 md:px-0">
      
      {/* --- EXECUTIVE HEADER & CONTROL PLANE --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm">
        <div className="space-y-3">
           <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">
              <Compass className="w-4 h-4" /> Global Positioning System
           </div>
           <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">Diagnostic <span className="text-indigo-600">Core.</span></h1>
           <p className="text-slate-400 font-medium italic">Synchronized telemetry from 96 syllabus nodes.</p>
        </div>

        <div className="flex bg-slate-50 p-2 rounded-[2rem] border border-slate-100 shadow-inner">
           {['Global', 'Physics', 'Chemistry', 'Mathematics'].map((tab) => (
             <button
               key={tab}
               onClick={() => setActiveSubject(tab as any)}
               className={`px-8 py-3.5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${
                 activeSubject === tab 
                  ? 'bg-white text-indigo-600 shadow-lg border border-indigo-100 scale-105' 
                  : 'text-slate-400 hover:text-slate-600'
               }`}
             >
               {tab}
             </button>
           ))}
        </div>
      </div>

      {/* --- THE BENTO GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Module 1: Precision Percentile (The High-Impact Dial) */}
        <div className="lg:col-span-4 bg-slate-900 rounded-[4rem] p-10 text-white relative overflow-hidden shadow-2xl group flex flex-col justify-between">
           <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-[5s]"><Award className="w-64 h-64" /></div>
           <div className="space-y-1 relative z-10">
              <h3 className="text-xl font-black italic tracking-tight uppercase text-indigo-400">Competitive standing.</h3>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Simulated JEE Percentile</p>
           </div>
           
           <div className="py-12 relative z-10 flex flex-col items-center">
              <div className="text-7xl font-black italic tracking-tighter text-white font-space leading-none mb-2">{airPrediction.percentile}</div>
              <div className="text-[10px] font-black uppercase text-indigo-500 tracking-[0.4em]">CURRENT PREPARATION DEPTH</div>
              
              <div className="mt-10 grid grid-cols-2 gap-4 w-full">
                 <div className="bg-white/5 border border-white/10 p-5 rounded-3xl text-center">
                    <div className="text-[8px] font-black text-slate-500 uppercase mb-1">Estimated AIR</div>
                    <div className="text-2xl font-black italic text-emerald-400">#{airPrediction.rank}</div>
                 </div>
                 <div className="bg-white/5 border border-white/10 p-5 rounded-3xl text-center">
                    <div className="text-[8px] font-black text-slate-500 uppercase mb-1">Target Year</div>
                    <div className="text-2xl font-black italic text-indigo-400">2025</div>
                 </div>
              </div>
           </div>

           <button className="w-full py-4 bg-indigo-600 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 shadow-xl transition-all relative z-10">Expand AIR Benchmarks</button>
        </div>

        {/* Module 2: Performance Pulse (The Trend Lines) */}
        <div className="lg:col-span-8 bg-white rounded-[4rem] p-10 md:p-14 border border-slate-200 shadow-sm space-y-10">
           <div className="flex justify-between items-end">
              <div className="space-y-1">
                 <h3 className="text-3xl font-black italic tracking-tighter text-slate-900 uppercase">Stability Pulse.</h3>
                 <p className="text-slate-400 text-sm font-medium italic">Longitudinal tracking of accuracy across {activeSubject} syllabus.</p>
              </div>
              <div className="flex gap-6 pb-2">
                 <div className="flex items-center gap-2 text-[9px] font-black uppercase text-slate-400"><div className="w-2.5 h-2.5 rounded-full bg-indigo-600"></div> Accuracy</div>
                 <div className="flex items-center gap-2 text-[9px] font-black uppercase text-slate-400"><div className="w-2.5 h-2.5 rounded-full bg-slate-100"></div> Coverage</div>
              </div>
           </div>
           <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={filteredChapters}>
                    <defs>
                      <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" hide />
                    <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 'bold'}} />
                    <ReTooltip 
                      contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)'}}
                      itemStyle={{fontSize: '11px', fontWeight: '900', textTransform: 'uppercase'}}
                    />
                    <Area type="monotone" dataKey="progress" stroke="none" fill="#f8fafc" fillOpacity={1} />
                    <Area type="monotone" dataKey="accuracy" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorAcc)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Module 3: Key Performance Indicators (KPIs) */}
        <div className="lg:col-span-12 grid grid-cols-2 lg:grid-cols-4 gap-6">
           {[
             { label: 'Time Invested', val: `${Math.round(metrics.totalTime / 3600)}h`, icon: Clock, color: 'indigo', sub: 'Active Study Stream' },
             { label: 'Yield Index (ROI)', val: metrics.efficiency, icon: Zap, color: 'amber', sub: 'Acc per Hour Study' },
             { label: 'Syllabus Depth', val: `${metrics.progress}%`, icon: Layers, color: 'emerald', sub: 'Completed Modules' },
             { label: 'System Precision', val: `${metrics.avgAcc}%`, icon: Target, color: 'rose', sub: 'Avg Problem Accuracy' }
           ].map((kpi, i) => (
             <div key={i} className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm group hover:border-indigo-400 hover:shadow-xl transition-all">
                <div className={`w-12 h-12 bg-${kpi.color}-50 text-${kpi.color}-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform`}><kpi.icon className="w-6 h-6" /></div>
                <div className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">{kpi.label}</div>
                <div className="text-3xl font-black text-slate-900 tracking-tighter italic font-space">{kpi.val}</div>
                <div className="text-[9px] font-bold text-slate-400 mt-1.5 uppercase tracking-widest">{kpi.sub}</div>
             </div>
           ))}
        </div>

        {/* Module 4: Application Gap (The Diagnostic Jewel) */}
        <div className="lg:col-span-7 bg-white rounded-[4rem] p-10 md:p-14 border border-slate-200 shadow-sm space-y-12">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-1">
                 <h3 className="text-2xl font-black italic tracking-tighter text-slate-900 uppercase">Application Gap Analysis.</h3>
                 <p className="text-slate-400 text-sm font-medium italic">Comparison: Relaxed Practice vs. Timed Mock Performance.</p>
              </div>
              <div className="flex gap-4">
                 <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[9px] font-black text-slate-400 uppercase tracking-widest">Calculated Risk Profile</div>
              </div>
           </div>

           <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={gapData} barGap={12}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{fontSize: 11, fontWeight: 'bold', fill: '#94a3b8'}} />
                    <YAxis hide domain={[0, 100]} />
                    <ReTooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} />
                    <Bar dataKey="practice" fill="#10b981" radius={[8, 8, 0, 0]} name="Practice Accuracy" />
                    <Bar dataKey="mock" fill="#6366f1" radius={[8, 8, 0, 0]} name="Mock Performance" />
                 </BarChart>
              </ResponsiveContainer>
           </div>

           <div className="p-8 bg-slate-900 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 text-white shadow-xl">
              <div className="flex items-center gap-6">
                 <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 border border-white/10"><ShieldAlert className="w-7 h-7 text-indigo-400" /></div>
                 <div>
                    <h4 className="text-lg font-black italic uppercase leading-none text-indigo-400">Vulnerability Alert.</h4>
                    <p className="text-xs text-slate-400 font-medium italic mt-2">Current gap in <b>Mathematics</b> (12%) suggests timing pressure issues. Advised to switch to timed drills.</p>
                 </div>
              </div>
              <button onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'mistakes' }))} className="px-8 py-3.5 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg whitespace-nowrap">View mistakes log</button>
           </div>
        </div>

        {/* Module 5: Study Modality (The Effort Breakdown) */}
        <div className="lg:col-span-5 bg-white rounded-[4rem] p-10 md:p-14 border border-slate-200 shadow-sm space-y-12">
           <div className="space-y-1">
              <h3 className="text-2xl font-black italic tracking-tighter text-slate-900 uppercase">Effort Distribution.</h3>
              <p className="text-slate-400 text-sm font-medium italic">Active time logged per learning modality.</p>
           </div>

           <div className="h-64 relative">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                      data={[
                        { name: 'Theory', value: filteredChapters.reduce((a,c) => a + (c.timeSpentNotes || 0), 0), color: '#6366f1' },
                        { name: 'Videos', value: filteredChapters.reduce((a,c) => a + (c.timeSpentVideos || 0), 0), color: '#f59e0b' },
                        { name: 'Drills', value: filteredChapters.reduce((a,c) => a + (c.timeSpentPractice || 0), 0), color: '#10b981' },
                        { name: 'Tests', value: filteredChapters.reduce((a,c) => a + (c.timeSpentTests || 0), 0), color: '#f43f5e' }
                      ].filter(d => d.value > 0)}
                      cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value"
                    >
                       {[0, 1, 2, 3].map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={['#6366f1', '#f59e0b', '#10b981', '#f43f5e'][index]} stroke="none" />
                       ))}
                    </Pie>
                    <ReTooltip contentStyle={{borderRadius: '20px', border: 'none', background: '#1e293b', color: '#fff'}} itemStyle={{color: '#fff', fontSize: '10px'}} />
                 </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <div className="text-3xl font-black italic tracking-tighter text-slate-800 leading-none">EFFORT</div>
                 <div className="text-[8px] font-black uppercase text-slate-400 tracking-[0.4em] mt-1">Allocation</div>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Conceptual', color: 'bg-indigo-600', val: '42%' },
                { label: 'Video Lectures', color: 'bg-amber-500', val: '28%' },
                { label: 'Active Practice', color: 'bg-emerald-500', val: '20%' },
                { label: 'Mock Sessions', color: 'bg-rose-500', val: '10%' }
              ].map((m, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                   <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${m.color}`}></div>
                      <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{m.label}</span>
                   </div>
                   <span className="text-xs font-black text-slate-900">{m.val}</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* --- REFINED UNIT LEDGER --- */}
      <div className="bg-white rounded-[4rem] border border-slate-200 shadow-sm overflow-hidden mt-10">
        <div className="p-10 border-b border-slate-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-slate-50/30">
           <div className="space-y-2">
              <h3 className="text-3xl font-black italic tracking-tighter text-slate-900 uppercase">Granular Unit intelligence.</h3>
              <p className="text-slate-400 text-sm font-medium italic">Exhaustive audit for all {activeSubject} syllabus chapters.</p>
           </div>
           
           <div className="flex flex-wrap gap-4 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-80">
                 <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                 <input 
                    type="text" placeholder="Filter specific unit..." 
                    value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-[1.5rem] text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all shadow-sm"
                 />
              </div>
              <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm shrink-0">
                 {[
                    { id: 'accuracy', label: 'Precision', icon: Target },
                    { id: 'time', label: 'Effort', icon: Clock },
                    { id: 'efficiency', label: 'ROI', icon: Zap }
                 ].map(btn => (
                    <button 
                       key={btn.id}
                       onClick={() => setSortBy(btn.id as any)}
                       className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${sortBy === btn.id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-700'}`}
                    >
                       <btn.icon className="w-3.5 h-3.5" /> {btn.label}
                    </button>
                 ))}
              </div>
           </div>
        </div>

        <div className="overflow-x-auto">
           <table className="w-full text-left min-w-[1000px]">
              <thead className="bg-slate-50 border-b border-slate-100">
                 <tr className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">
                    <th className="p-8">Subject Unit Identity</th>
                    <th className="p-8 text-center">Stability Heatmap</th>
                    <th className="p-8 text-center">Coverage Depth</th>
                    <th className="p-8 text-center">Study Intensity</th>
                    <th className="p-8 text-center">Efficiency (ROI)</th>
                    <th className="p-8 text-right">Drill Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                 {chapterLedger.length === 0 ? (
                    <tr><td colSpan={6} className="py-40 text-center text-slate-300 font-black uppercase text-xs italic tracking-widest">No matching prepare-nodes detected.</td></tr>
                 ) : (
                    chapterLedger.map((ch, i) => (
                       <tr key={ch.id} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="p-8">
                             <div className="flex items-center gap-6">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg shadow-inner ${
                                  ch.subject === 'Physics' ? 'bg-indigo-50 text-indigo-600' : 
                                  ch.subject === 'Chemistry' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                                }`}>
                                   {ch.name[0]}
                                </div>
                                <div>
                                   <div className="text-lg font-black text-slate-900 italic tracking-tight leading-none group-hover:text-indigo-600 transition-colors">{ch.name}</div>
                                   <div className="flex items-center gap-3 mt-2">
                                      <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{ch.subject}</span>
                                      <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                                      <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{ch.unit.split(':')[0]}</span>
                                   </div>
                                </div>
                             </div>
                          </td>
                          <td className="p-8 text-center">
                             <div className={`inline-flex items-center gap-3 px-5 py-2 rounded-full font-black text-[10px] tracking-widest border ${
                               ch.accuracy > 75 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                               ch.accuracy > 50 ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                             }`}>
                                <Activity className="w-3.5 h-3.5" />
                                {ch.accuracy}% STABLE
                             </div>
                          </td>
                          <td className="p-8">
                             <div className="flex flex-col items-center gap-2">
                                <div className="text-[11px] font-black text-slate-900">{ch.progress}%</div>
                                <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                   <div className="h-full bg-indigo-600 transition-all duration-[1s]" style={{ width: `${ch.progress}%` }}></div>
                                </div>
                             </div>
                          </td>
                          <td className="p-8 text-center">
                             <div className="text-xl font-black text-slate-900 italic leading-none">{ch.hours}h</div>
                             <div className="text-[9px] font-black text-slate-300 uppercase mt-1">Logged session</div>
                          </td>
                          <td className="p-8 text-center">
                             <div className="flex items-center justify-center gap-2">
                                <div className="text-2xl font-black text-slate-900 italic leading-none">{ch.rot}</div>
                                {ch.rot > 30 ? <Zap className="w-4 h-4 text-amber-500 fill-amber-500" /> : <Flame className="w-4 h-4 text-slate-200" />}
                             </div>
                          </td>
                          <td className="p-8 text-right">
                             <button 
                               onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'learn' }))}
                               className="p-4 bg-white border border-slate-200 text-slate-400 rounded-2xl hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm hover:shadow-xl hover:scale-105 active:scale-95"
                             >
                                <ArrowRightUp className="w-5 h-5" />
                             </button>
                          </td>
                       </tr>
                    ))
                 )}
              </tbody>
           </table>
        </div>
      </div>

      {/* --- GLOBAL STRATEGY SUGGESTION --- */}
      <div className="bg-indigo-900 rounded-[4rem] p-12 md:p-16 text-white shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center gap-12">
         <div className="absolute top-0 left-0 p-12 opacity-10 rotate-45"><Sparkles className="w-80 h-80" /></div>
         <div className="w-24 h-24 md:w-32 md:h-32 bg-white/10 rounded-[3rem] border-8 border-white/5 flex items-center justify-center shrink-0 shadow-2xl backdrop-blur-xl">
            <Brain className="w-12 h-12 md:w-16 md:h-16 text-indigo-300" />
         </div>
         <div className="space-y-6 relative z-10 flex-1 text-center lg:text-left">
            <div className="space-y-2">
               <h3 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase leading-none">Intelligence Directive.</h3>
               <p className="text-indigo-200 text-lg font-medium italic">Synthesized academic protocol for current preparations.</p>
            </div>
            <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] hover:bg-white/10 transition-colors">
               <p className="text-xl md:text-2xl font-bold italic leading-relaxed text-indigo-50">
                 "Your <b>{activeSubject === 'Global' ? 'Global' : activeSubject}</b> metrics show a 'Theory-Heavy' study bias. To achieve AIR &lt; 500, shift next 12 study hours to <b>Intensive Numerical Drills</b> for Equilibrium and Complex Numbers."
               </p>
            </div>
         </div>
         <button 
           onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'focus' }))}
           className="px-12 py-6 bg-white text-indigo-900 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl hover:scale-105 transition-all active:scale-95 shrink-0"
         >
           Initialize focus session
         </button>
      </div>

    </div>
  );
};

// Helper Icon not in lucide-react standard set
const ArrowRightUp = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

export default AnalyticsView;
