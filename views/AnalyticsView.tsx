
import React from 'react';
import { StudentData, Subject } from '../types';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  BarChart, Bar, Legend, ComposedChart, Line
} from 'recharts';
import { 
  BarChart3, TrendingUp, Zap, Clock, Target, AlertCircle, 
  CheckCircle2, Activity, ArrowUpRight, Brain, Layers, ShieldAlert,
  BookOpen, Video, FileText
} from 'lucide-react';

const AnalyticsView: React.FC<{ data: StudentData }> = ({ data }) => {
  const subjects: Subject[] = ['Physics', 'Chemistry', 'Mathematics'];
  const chapters = data.chapters || [];
  
  const subjectMastery = subjects.map(s => {
    const sChapters = chapters.filter(c => c.subject === s);
    const avgProgress = sChapters.length > 0 ? Math.round(sChapters.reduce((acc, c) => acc + (c.progress || 0), 0) / sChapters.length) : 0;
    const avgAccuracy = sChapters.length > 0 ? Math.round(sChapters.reduce((acc, c) => acc + (c.accuracy || 0), 0) / sChapters.length) : 0;
    return { subject: s, progress: avgProgress, accuracy: avgAccuracy };
  });

  // Activity Breakdown Data
  const totalNotesTime = chapters.reduce((acc, c) => acc + (c.timeSpentNotes || 0), 0);
  const totalVideoTime = chapters.reduce((acc, c) => acc + (c.timeSpentVideos || 0), 0);
  const totalPracticeTime = chapters.reduce((acc, c) => acc + (c.timeSpentPractice || 0), 0);
  const totalTestTime = chapters.reduce((acc, c) => acc + (c.timeSpentTests || 0), 0);

  const activityDistribution = [
    { name: 'Theory (Notes)', value: totalNotesTime, color: '#6366f1', icon: BookOpen },
    { name: 'Lectures (Video)', value: totalVideoTime, color: '#f59e0b', icon: Video },
    { name: 'Drills (Practice)', value: totalPracticeTime, color: '#10b981', icon: Target },
    { name: 'Mock Exams', value: totalTestTime, color: '#ef4444', icon: FileText }
  ].filter(a => a.value > 0);

  const formatHrs = (s: number) => Math.round(s / 3600);

  const totalEffort = chapters.reduce((a,c) => a + (c.timeSpent || 0), 0);
  const avgAccuracyTotal = chapters.length > 0 ? Math.round(chapters.reduce((a,c) => a + (c.accuracy || 0), 0) / chapters.length) : 0;

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Effort', val: `${formatHrs(totalEffort)}h`, sub: 'Across 3 Subjects', icon: Clock, color: 'indigo' },
          { label: 'Retention Strength', val: `${avgAccuracyTotal}%`, sub: 'Avg Accuracy', icon: Brain, color: 'emerald' },
          { label: 'Study Velocity', val: `${Math.round((totalPracticeTime + totalTestTime) / 3600)}h`, sub: 'Active Problem Solving', icon: Activity, color: 'blue' },
          { label: 'Passive Load', val: `${Math.round((totalNotesTime + totalVideoTime) / 3600)}h`, sub: 'Theory & Lectures', icon: ShieldAlert, color: 'amber' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm group hover:border-indigo-400 transition-all">
             <div className={`w-12 h-12 bg-${kpi.color}-50 text-${kpi.color}-600 rounded-2xl flex items-center justify-center mb-6`}><kpi.icon className="w-6 h-6" /></div>
             <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{kpi.label}</div>
             <div className="text-3xl font-black text-slate-900">{kpi.val}</div>
             <div className="text-[10px] font-bold text-slate-400 mt-2 uppercase">{kpi.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-10">
          <div className="flex justify-between items-end">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic">Knowledge vs Stability Matrix</h3>
            <div className="flex gap-4">
               <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400"><div className="w-3 h-3 rounded-full bg-indigo-600"></div> Progress</div>
               <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Accuracy</div>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectMastery} barGap={12}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 'bold', fill: '#94a3b8'}} />
                <YAxis hide />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="progress" fill="#6366f1" radius={[10, 10, 0, 0]} />
                <Bar dataKey="accuracy" fill="#10b981" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl flex flex-col">
           <h3 className="text-xl font-black italic mb-2">Activity Entropy</h3>
           <p className="text-slate-400 text-xs mb-8">Effort distribution across modalities</p>
           
           <div className="h-64 relative flex-1">
              {activityDistribution.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={activityDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={8} dataKey="value">
                        {activityDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{borderRadius: '16px', background: '#1e293b', border: 'none', color: '#fff'}} itemStyle={{color: '#fff'}} formatter={(v:any) => `${Math.round(v/3600)}h`} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                     <div className="text-2xl font-black">LOGS</div>
                     <div className="text-[8px] font-black uppercase text-slate-500">Master Stream</div>
                  </div>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 italic text-[10px] font-black uppercase tracking-widest text-center border border-white/5 rounded-3xl">
                   No activity logged
                </div>
              )}
           </div>

           <div className="space-y-4 pt-6 border-t border-white/10">
              {activityDistribution.length > 0 ? activityDistribution.map((d, i) => (
                <div key={i} className="flex justify-between items-center">
                   <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{backgroundColor: d.color}}></div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{d.name}</span>
                   </div>
                   <span className="text-xs font-black">{Math.round(d.value / 3600)}h</span>
                </div>
              )) : (
                <p className="text-[9px] font-bold text-slate-500 uppercase italic">Waiting for student interaction data...</p>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
