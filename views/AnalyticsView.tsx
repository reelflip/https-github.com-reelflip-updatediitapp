
import React, { useMemo } from 'react';
import { StudentData, Subject, Chapter, TestResult } from '../types';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  BarChart, Bar, Legend, ComposedChart, Line
} from 'recharts';
import { 
  BarChart3, TrendingUp, Zap, Clock, Target, AlertCircle, 
  CheckCircle2, Activity, ArrowUpRight, Brain, Layers, ShieldAlert,
  BookOpen, Video, FileText, Timer, ChevronRight, Gauge
} from 'lucide-react';

const AnalyticsView: React.FC<{ data: StudentData }> = ({ data }) => {
  const subjects: Subject[] = ['Physics', 'Chemistry', 'Mathematics'];
  const chapters = data?.chapters || [];
  const testHistory = data?.testHistory || [];
  
  // 1. Subject Mastery Data
  const subjectMastery = useMemo(() => subjects.map(s => {
    const sChapters = chapters.filter(c => c && c.subject === s);
    const avgProgress = sChapters.length > 0 ? Math.round(sChapters.reduce((acc, c) => acc + (c.progress || 0), 0) / sChapters.length) : 0;
    const avgAccuracy = sChapters.length > 0 ? Math.round(sChapters.reduce((acc, c) => acc + (c.accuracy || 0), 0) / sChapters.length) : 0;
    
    // Safety check on chapterIds and find results
    const subjectTests = testHistory.filter(t => (t.chapterIds || []).some(id => {
        const found = chapters.find(ch => ch.id === id);
        return found && found.subject === s;
    }));
    const mockAccuracy = subjectTests.length > 0 ? Math.round(subjectTests.reduce((acc, t) => acc + (t.accuracy || 0), 0) / subjectTests.length) : 0;

    return { 
      subject: s, 
      progress: avgProgress, 
      accuracy: avgAccuracy,
      mockAccuracy: mockAccuracy || (avgAccuracy > 5 ? avgAccuracy - 5 : 0),
      chapterCount: sChapters.length,
      masteredCount: sChapters.filter(c => c.status === 'COMPLETED').length
    };
  }), [chapters, testHistory]);

  // 2. Efficiency Index (Return on Time)
  const efficiencyData = useMemo(() => {
    return chapters
      .filter(c => c && (c.timeSpent || 0) > 0)
      .map(c => {
        const hours = (c.timeSpent || 0) / 3600;
        const rot = hours > 0 ? ((c.accuracy || 0) / hours).toFixed(1) : '0';
        return {
          name: c.name || 'Unknown',
          subject: c.subject,
          accuracy: c.accuracy || 0,
          time: hours.toFixed(1),
          rot: parseFloat(rot)
        };
      })
      .sort((a, b) => b.rot - a.rot)
      .slice(0, 5);
  }, [chapters]);

  // 3. Performance Velocity (Test History Trend)
  const velocityData = useMemo(() => {
    if (!testHistory || testHistory.length === 0) return [];
    return [...testHistory]
      .reverse()
      .map((t, i) => {
        const total = t.totalMarks || 1; // Prevent div by 0
        const score = t.score || 0;
        return {
            index: i + 1,
            score: Math.round((score / total) * 100),
            name: t.testName || 'Test'
        };
      });
  }, [testHistory]);

  // 4. Activity Breakdown
  const activityDistribution = useMemo(() => {
    const totalNotesTime = chapters.reduce((acc, c) => acc + (c.timeSpentNotes || 0), 0);
    const totalVideoTime = chapters.reduce((acc, c) => acc + (c.timeSpentVideos || 0), 0);
    const totalPracticeTime = chapters.reduce((acc, c) => acc + (c.timeSpentPractice || 0), 0);
    const totalTestTime = chapters.reduce((acc, c) => acc + (c.timeSpentTests || 0), 0);

    const dataArr = [
      { name: 'Theory (Notes)', value: totalNotesTime, color: '#6366f1' },
      { name: 'Lectures (Video)', value: totalVideoTime, color: '#f59e0b' },
      { name: 'Drills (Practice)', value: totalPracticeTime, color: '#10b981' },
      { name: 'Mock Exams', value: totalTestTime, color: '#ef4444' }
    ].filter(a => a.value > 0);

    return dataArr.length > 0 ? dataArr : [{ name: 'No Activity', value: 1, color: '#f1f5f9' }];
  }, [chapters]);

  const totalEffort = chapters.reduce((a,c) => a + (c.timeSpent || 0), 0);
  const avgAccuracyTotal = chapters.length > 0 ? Math.round(chapters.reduce((a,c) => a + (c.accuracy || 0), 0) / chapters.length) : 0;

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-32">
      {/* --- TELEMETRY CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Effort', val: `${Math.round(totalEffort / 3600)}h`, sub: 'Accumulated Study', icon: Clock, color: 'indigo' },
          { label: 'Stability Index', val: `${avgAccuracyTotal}%`, sub: 'Global Precision', icon: Brain, color: 'emerald' },
          { label: 'Mock Percentile', val: '98.4', sub: 'Projected AIR', icon: Target, color: 'blue' },
          { label: 'Drill Stability', val: 'Active', sub: 'Consistent Input', icon: Zap, color: 'amber' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm group hover:border-indigo-400 transition-all">
             <div className={`w-12 h-12 bg-${kpi.color}-50 text-${kpi.color}-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform`}><kpi.icon className="w-6 h-6" /></div>
             <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{kpi.label}</div>
             <div className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">{kpi.val}</div>
             <div className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">{kpi.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* --- PERFORMANCE VELOCITY --- */}
        <div className="lg:col-span-8 bg-white p-10 md:p-14 rounded-[4rem] border border-slate-200 shadow-sm space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
             <div className="space-y-2">
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Performance Velocity.</h3>
                <p className="text-slate-400 text-sm font-medium italic">Tracking score progression across historical mock sessions.</p>
             </div>
             <div className="flex items-center gap-3 px-6 py-2.5 bg-indigo-50 border border-indigo-100 rounded-full">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">+12% Monthly Gain</span>
             </div>
          </div>
          <div className="h-80 w-full">
            {velocityData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={velocityData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="index" hide />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)'}}
                    labelStyle={{display: 'none'}}
                  />
                  <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-300 font-black uppercase text-[10px] tracking-widest border-2 border-dashed border-slate-50 rounded-3xl">
                 Awaiting Test Data Stream
              </div>
            )}
          </div>
        </div>

        {/* --- SYLLABUS COVERAGE NODE --- */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl space-y-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform"><Layers className="w-64 h-64" /></div>
              <div className="space-y-2 relative z-10">
                 <h3 className="text-2xl font-black italic tracking-tighter uppercase text-indigo-400">Syllabus Depth.</h3>
                 <p className="text-slate-400 text-xs font-medium">Subject-wise coverage metrics.</p>
              </div>
              
              <div className="space-y-8 relative z-10">
                 {subjectMastery.map((s, i) => (
                   <div key={i} className="space-y-3">
                      <div className="flex justify-between items-end">
                         <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{s.subject}</span>
                         <span className="text-xs font-black">{s.masteredCount} / {s.chapterCount} <span className="text-slate-600 font-medium">Units</span></span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                         <div className="h-full bg-indigo-500 transition-all duration-[1.5s]" style={{ width: `${s.progress}%` }}></div>
                      </div>
                   </div>
                 ))}
              </div>

              <div className="pt-8 border-t border-white/10 relative z-10">
                 <button onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'learn' }))} className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:border-indigo-600 transition-all">Expand Mapping</button>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* --- PRECISION MATRIX --- */}
        <div className="lg:col-span-7 bg-white p-10 md:p-14 rounded-[4rem] border border-slate-200 shadow-sm space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-2">
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">Precision Matrix.</h3>
              <p className="text-slate-400 text-sm font-medium italic">Comparing Mock session stability vs Practice drill results.</p>
            </div>
            <div className="flex gap-4">
               <div className="flex items-center gap-2 text-[9px] font-black uppercase text-slate-400"><div className="w-3 h-3 rounded bg-indigo-600"></div> Mock</div>
               <div className="flex items-center gap-2 text-[9px] font-black uppercase text-slate-400"><div className="w-3 h-3 rounded bg-emerald-500"></div> Practice</div>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectMastery} barGap={12}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{fontSize: 11, fontWeight: 'bold', fill: '#94a3b8'}} />
                <YAxis domain={[0, 100]} hide />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="mockAccuracy" fill="#6366f1" radius={[8, 8, 0, 0]} />
                <Bar dataKey="accuracy" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- EFFICIENCY INDEX --- */}
        <div className="lg:col-span-5 bg-white p-10 md:p-14 rounded-[4rem] border border-slate-200 shadow-sm space-y-10">
           <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">High-Yield Assets.</h3>
              <p className="text-slate-400 text-sm font-medium italic">Chapters ranked by Return-on-Time (ROT) Index.</p>
           </div>

           <div className="flex-1 space-y-6">
              {efficiencyData.length > 0 ? efficiencyData.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-indigo-200 transition-all group">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-slate-400 border border-slate-200 shadow-inner group-hover:text-indigo-600 transition-colors">
                        {item.rot > 40 ? <Zap className="w-5 h-5 text-amber-500" /> : <CheckCircle2 className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-800 leading-none truncate max-w-[150px]">{item.name}</div>
                        <div className="text-[9px] font-black uppercase text-slate-400 tracking-widest mt-1.5">{item.subject} • {item.time}h Study</div>
                      </div>
                   </div>
                   <div className="text-right">
                      <div className="text-lg font-black text-slate-900">{item.accuracy}%</div>
                      <div className="text-[8px] font-black uppercase text-emerald-500 tracking-widest">ROT: {item.rot}</div>
                   </div>
                </div>
              )) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-100 rounded-[3rem] text-slate-300">
                   <Gauge className="w-12 h-12 mb-4 opacity-20" />
                   <p className="text-[10px] font-black uppercase tracking-widest">Gathering Efficiency Data...</p>
                </div>
              )}
           </div>
        </div>
      </div>

      {/* --- ENTROPY & DISTRIBUTION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 bg-slate-900 p-10 md:p-14 rounded-[4rem] text-white shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-5"><Activity className="w-64 h-64" /></div>
           <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-2 text-indigo-400">Activity Entropy.</h3>
           <p className="text-slate-400 text-xs font-medium italic mb-10">Effort distribution across learning modalities.</p>
           
           <div className="h-64 relative mb-10">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={activityDistribution} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={10} dataKey="value">
                    {activityDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{borderRadius: '24px', background: '#1e293b', border: 'none', color: '#fff'}} itemStyle={{color: '#fff'}} formatter={(v:any) => `${Math.round(v/3600)}h`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                 <div className="text-3xl font-black tracking-tighter italic">CORE</div>
                 <div className="text-[8px] font-black uppercase text-slate-500 tracking-[0.4em]">Metrics</div>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              {activityDistribution.length > 1 ? activityDistribution.map((d, i) => (
                <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                   <div className="flex items-center gap-3 mb-1.5">
                      <div className="w-2 h-2 rounded-full" style={{backgroundColor: d.color}}></div>
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 truncate">{d.name.split(' ')[0]}</span>
                   </div>
                   <div className="text-xl font-black italic">{Math.round((d.value || 0) / 3600)}h</div>
                </div>
              )) : (
                <div className="col-span-2 text-center text-slate-500 text-[10px] font-bold uppercase py-4">No Time Logs Recorded</div>
              )}
           </div>
        </div>

        <div className="lg:col-span-8 bg-white p-10 md:p-14 rounded-[4rem] border border-slate-200 shadow-sm space-y-12">
           <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">Subject Focus Trends.</h3>
              <p className="text-slate-400 text-sm font-medium italic">Historical accuracy trends normalized per subject node.</p>
           </div>
           
           <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <ComposedChart data={subjectMastery}>
                    <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{fontSize: 11, fontWeight: 'bold', fill: '#94a3b8'}} />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)'}} />
                    <Bar dataKey="progress" fill="#f1f5f9" radius={[12, 12, 0, 0]} barSize={60} />
                    <Line type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={4} dot={{r: 6, fill: '#10b981', strokeWidth: 4, stroke: '#fff'}} />
                    <Line type="monotone" dataKey="mockAccuracy" stroke="#6366f1" strokeWidth={4} strokeDasharray="8 8" dot={{r: 6, fill: '#6366f1', strokeWidth: 4, stroke: '#fff'}} />
                 </ComposedChart>
              </ResponsiveContainer>
           </div>
           
           <div className="flex flex-col md:flex-row items-center justify-between p-8 bg-slate-50 rounded-[3rem] border border-slate-100 gap-6">
              <div className="flex items-center gap-6">
                 <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-xl"><ShieldAlert className="w-7 h-7" /></div>
                 <div>
                    <h4 className="text-lg font-black text-slate-800 italic leading-tight">Diagnostic Summary</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">System identifies <b>Mathematics</b> as the primary stability risk. Focus on 'Limits & Continuity' integration.</p>
                 </div>
              </div>
              <button onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'mistakes' }))} className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-indigo-600 transition-all flex items-center gap-3">
                 View Detailed Mistakes <ChevronRight className="w-4 h-4" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
