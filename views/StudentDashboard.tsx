
import React, { useEffect, useState } from 'react';
import { StudentData } from '../types';
import { getSmartStudyAdvice } from '../services/geminiService';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line
} from 'recharts';
import { Sparkles, Timer, Target, Brain, AlertCircle, TrendingUp } from 'lucide-react';

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

  // Fix: Explicitly cast to number[] to resolve '+' operator issues on unknown values
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
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Smart Coach Header */}
      <section className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Brain className="w-48 h-48" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="w-6 h-6" />
              Smart Study Coach
            </h2>
            <p className="text-indigo-100">Daily actionable strategy based on your performance data.</p>
          </div>
          
          <div className="flex gap-4">
             <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20">
                <div className="text-xs uppercase font-bold text-indigo-200">Confidence Index</div>
                <div className="text-3xl font-bold">{confidenceIndex}%</div>
             </div>
             <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20">
                <div className="text-xs uppercase font-bold text-indigo-200">Study Streak</div>
                <div className="text-3xl font-bold">12 Days</div>
             </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {loadingAdvice ? (
            <div className="col-span-3 py-12 flex flex-col items-center justify-center bg-white/5 rounded-xl border border-white/10 border-dashed">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
              <p>Analyzing performance trends...</p>
            </div>
          ) : advice ? (
            <>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
                <div className="font-bold mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-indigo-300" />
                  Top 3 Priorities
                </div>
                <ul className="space-y-2 text-sm text-indigo-50">
                  {advice.priorities.map((p: string, i: number) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-indigo-300 font-bold">{i+1}.</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
                <div className="font-bold mb-3 flex items-center gap-2 text-amber-300">
                  <AlertCircle className="w-4 h-4" />
                  Health & Focus
                </div>
                <p className="text-sm italic text-indigo-50">"{advice.mindsetTip}"</p>
                {advice.burnoutAlert && (
                   <div className="mt-3 text-xs bg-red-500/20 p-2 rounded border border-red-500/30 text-red-200">
                      {advice.burnoutAlert}
                   </div>
                )}
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
                <div className="font-bold mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-300" />
                  Mistake Intelligence
                </div>
                <p className="text-xs text-indigo-100">Recent analysis shows calculation errors in {weakChapter?.name || 'current focus area'}. 5 Error-based flashcards generated.</p>
                <button className="mt-3 w-full bg-white text-indigo-600 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-colors">
                  Review Mistakes
                </button>
              </div>
            </>
          ) : (
             <div className="col-span-3 text-center py-4 bg-white/5 rounded-xl border border-white/10 border-dashed">
                Configure API Key for personalized AI coaching.
             </div>
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress Overview */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold mb-6 flex items-center justify-between">
              Chapter Accuracy & Retention Risk
              <span className="text-xs font-normal text-slate-500 uppercase tracking-widest">Spaced Repetition Engine</span>
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.chapters}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                  <Bar dataKey="accuracy" radius={[4, 4, 0, 0]}>
                    {data.chapters.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getForgettingColor(entry.accuracy)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-6 mt-4 justify-center">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div> Safe
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div> Attention Needed
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <div className="w-3 h-3 rounded-full bg-red-500"></div> Immediate Revision
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold mb-6">Psychometric Wellbeing Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.psychometricHistory}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="timestamp" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                  <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                  <Line type="monotone" dataKey="stress" stroke="#ef4444" strokeWidth={3} dot={{r: 4, fill: '#ef4444'}} />
                  <Line type="monotone" dataKey="focus" stroke="#6366f1" strokeWidth={3} dot={{r: 4, fill: '#6366f1'}} />
                  <Line type="monotone" dataKey="motivation" stroke="#22c55e" strokeWidth={3} dot={{r: 4, fill: '#22c55e'}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <Timer className="w-4 h-4 text-indigo-500" />
              Unified Time Tracking
            </h4>
            <div className="space-y-4">
              {/* Fix: Assert entries type to resolve arithmetic operation errors on unknown values */}
              {(Object.entries(data.timeSummary) as [string, number][]).map(([key, val]) => (
                <div key={key}>
                  <div className="flex justify-between text-xs mb-1 uppercase text-slate-500">
                    <span>{key}</span>
                    <span className="font-bold text-slate-800">{Math.round(val / 60)} hrs</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500" 
                      style={{ width: `${(val / (totalTime || 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
            <h4 className="font-bold text-indigo-900 mb-2">Memory Hack of the Day</h4>
            <p className="text-sm text-indigo-700 mb-4 italic">
              "K-P-C-O-F-G-S: King Philip Came Over For Good Soup" 
              <span className="block mt-1 text-xs text-indigo-500 font-normal">Classification Taxonomy - Biology</span>
            </p>
            <button className="text-xs font-bold text-indigo-600 hover:underline">View All Hacks →</button>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h4 className="font-bold mb-4">Pending Spaced Revisions</h4>
            <div className="space-y-3">
              {data.flashcards.slice(0, 3).map(card => (
                <div key={card.id} className="p-3 bg-slate-50 rounded-lg text-sm border border-slate-100">
                  <div className="font-medium text-slate-800 mb-1">{card.question}</div>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 uppercase tracking-wider">
                    <span>{card.difficulty} • {card.type}</span>
                    <span className="text-indigo-600 font-bold">Due Today</span>
                  </div>
                </div>
              ))}
              <button className="w-full py-2 mt-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                Start Review Session
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
