
import React from 'react';
import { StudentData, Subject } from '../types';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  BarChart, Bar, Legend, ComposedChart, Line
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  Zap, 
  Clock, 
  Target, 
  AlertCircle, 
  CheckCircle2, 
  Activity, 
  ArrowUpRight,
  Brain,
  Layers,
  ShieldAlert
} from 'lucide-react';

const AnalyticsView: React.FC<{ data: StudentData }> = ({ data }) => {
  // --- DATA DERIVATION ---
  
  const subjects: Subject[] = ['Physics', 'Chemistry', 'Mathematics'];
  
  // 1. Subject Mastery Data
  const subjectMastery = subjects.map(s => {
    const chapters = data.chapters.filter(c => c.subject === s);
    const avgProgress = chapters.length > 0 
      ? Math.round(chapters.reduce((acc, c) => acc + c.progress, 0) / chapters.length)
      : 0;
    const avgAccuracy = chapters.length > 0 
      ? Math.round(chapters.reduce((acc, c) => acc + (c.accuracy || 0), 0) / chapters.length)
      : 0;
    return { subject: s, progress: avgProgress, accuracy: avgAccuracy };
  });

  // 2. Test Performance Trend
  const testTrend = data.testHistory.slice(-10).map(t => ({
    name: t.testName.substring(0, 10) + '...',
    score: Math.round((t.score / t.totalMarks) * 100),
    accuracy: t.accuracy
  }));

  // 3. Backlog vs Completion Pie
  const totalChapters = data.chapters.length;
  const completedChapters = data.chapters.filter(c => c.status === 'COMPLETED').length;
  const learningChapters = data.chapters.filter(c => c.status === 'LEARNING').length;
  const backlogsCount = data.backlogs.length + data.chapters.filter(c => c.progress < 30).length;

  const debtData = [
    { name: 'Completed', value: completedChapters, color: '#10b981' },
    { name: 'In Progress', value: learningChapters, color: '#6366f1' },
    { name: 'Academic Debt', value: backlogsCount, color: '#ef4444' }
  ];

  // 4. Executive KPIs
  const overallMastery = Math.round(data.chapters.reduce((acc, c) => acc + c.progress, 0) / (data.chapters.length || 1));
  const overallAccuracy = Math.round(data.chapters.reduce((acc, c) => acc + c.accuracy, 0) / (data.chapters.length || 1));
  const velocity = Math.round((data.timeSummary.practice + data.timeSummary.tests) / 60);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Executive Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Overall Mastery', val: `${overallMastery}%`, sub: 'Syllabus Completion', icon: Target, color: 'indigo' },
          { label: 'Avg Accuracy', val: `${overallAccuracy}%`, sub: 'Retention Strength', icon: Brain, color: 'emerald' },
          { label: 'Study Velocity', val: `${velocity}h`, sub: 'Practice & Testing', icon: Activity, color: 'blue' },
          { label: 'Backlog Load', val: backlogsCount.toString(), sub: 'Pending Units', icon: ShieldAlert, color: 'rose' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group hover:border-indigo-400 transition-all">
             <div className={`absolute -right-4 -top-4 w-24 h-24 bg-${kpi.color}-50 rounded-full opacity-20 group-hover:scale-150 transition-transform`}></div>
             <div className={`w-12 h-12 bg-${kpi.color}-50 text-${kpi.color}-600 rounded-2xl flex items-center justify-center mb-6`}>
                <kpi.icon className="w-6 h-6" />
             </div>
             <div>
                <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{kpi.label}</div>
                <div className="text-3xl font-black text-slate-900">{kpi.val}</div>
                <div className="text-[10px] font-bold text-slate-400 mt-2 uppercase">{kpi.sub}</div>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Performance Comparison */}
        <div className="lg:col-span-8 bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-10">
          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Subject Vertical Analysis</h3>
              <p className="text-slate-500 text-sm font-medium mt-1">Comparison of Syllabus Coverage vs. Accuracy</p>
            </div>
            <div className="flex gap-4">
               <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400">
                  <div className="w-3 h-3 rounded-full bg-indigo-600"></div> Progress
               </div>
               <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div> Accuracy
               </div>
            </div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectMastery} barGap={12}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 'bold', fill: '#94a3b8'}} />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="progress" fill="#6366f1" radius={[10, 10, 0, 0]} />
                <Bar dataKey="accuracy" fill="#10b981" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Backlog Intensity Donut */}
        <div className="lg:col-span-4 bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl flex flex-col justify-between">
           <div>
              <h3 className="text-xl font-black italic">Academic Debt Mix</h3>
              <p className="text-slate-400 text-xs mt-1">Distribution of prep health</p>
           </div>
           
           <div className="h-64 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={debtData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {debtData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{borderRadius: '16px', background: '#1e293b', border: 'none', color: '#fff'}}
                    itemStyle={{color: '#fff'}}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                 <div className="text-2xl font-black">{totalChapters}</div>
                 <div className="text-[8px] font-black uppercase text-slate-500 tracking-widest">Units</div>
              </div>
           </div>

           <div className="space-y-3 pt-6 border-t border-white/10">
              {debtData.map((d, i) => (
                <div key={i} className="flex justify-between items-center">
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{backgroundColor: d.color}}></div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{d.name}</span>
                   </div>
                   <span className="text-xs font-black">{d.value}</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Test History Trend */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-10">
           <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Test Score History</h3>
                <p className="text-slate-500 text-sm font-medium mt-1">Performance trend across last 10 mock sessions</p>
              </div>
              <TrendingUp className="w-8 h-8 text-indigo-100" />
           </div>

           <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={testTrend}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}}
                  />
                  <Area type="monotone" dataKey="score" stroke="#6366f1" fillOpacity={1} fill="url(#colorScore)" strokeWidth={4} />
                  <Area type="monotone" dataKey="accuracy" stroke="#10b981" fillOpacity={0} strokeWidth={2} strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Strategic Insights */}
        <div className="bg-indigo-50 p-10 rounded-[3.5rem] border border-indigo-100 space-y-8">
           <h3 className="text-xl font-black text-indigo-900 flex items-center gap-3">
              <Zap className="w-6 h-6" /> Strategic Insights
           </h3>
           
           <div className="space-y-6">
              {[
                { 
                  title: 'Accuracy Threshold', 
                  desc: overallAccuracy < 80 ? 'Average accuracy is below target. Focus on error logging in Mathematics.' : 'Accuracy is healthy. Maintain current revision cycle.',
                  status: overallAccuracy < 80 ? 'alert' : 'success'
                },
                { 
                  title: 'Prep Imbalance', 
                  desc: subjectMastery.find(s => s.progress < 50) ? `Physics syllabus is lagging. Allocate 2 extra hours for Mechanics.` : 'Subject distribution is balanced.',
                  status: subjectMastery.find(s => s.progress < 50) ? 'alert' : 'success'
                },
                { 
                  title: 'Testing Momentum', 
                  desc: data.testHistory.length < 5 ? 'Not enough test data. Aim for 2 mock tests this week.' : 'Great testing consistency. Review mistakes from Jan 10 paper.',
                  status: data.testHistory.length < 5 ? 'neutral' : 'success'
                }
              ].map((insight, i) => (
                <div key={i} className="flex gap-4">
                   <div className={`mt-1 shrink-0 ${insight.status === 'alert' ? 'text-rose-500' : insight.status === 'success' ? 'text-emerald-500' : 'text-slate-400'}`}>
                      {insight.status === 'alert' ? <ShieldAlert className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                   </div>
                   <div>
                      <div className="text-xs font-black uppercase text-slate-900 tracking-widest">{insight.title}</div>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{insight.desc}</p>
                   </div>
                </div>
              ))}
           </div>

           <button 
            onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'aitutor' }))}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all"
           >
              Ask AI for Detailed Report <ArrowUpRight className="w-4 h-4" />
           </button>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
