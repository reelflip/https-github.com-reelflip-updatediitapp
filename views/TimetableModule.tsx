
import React, { useState } from 'react';
import { StudentData, RoutineConfig } from '../types';
import { Calendar, Clock, Coffee, Zap, Moon, Sun, School, BookOpen, Settings2, Target, TrendingUp, ChevronRight, Sparkles, Save, AlertCircle, Loader2, Brain, ArrowRight } from 'lucide-react';
import { generateSmartTimetable } from '../services/intelligenceService';

interface TimetableModuleProps {
  data: StudentData;
}

const TimetableModule: React.FC<TimetableModuleProps> = ({ data }) => {
  const [activeView, setActiveView] = useState<'daily' | 'exam'>('daily');
  const [isGenerating, setIsGenerating] = useState(false);
  const [smartPlan, setSmartPlan] = useState<any>(null);
  
  const [routine, setRoutine] = useState<RoutineConfig>(data.routine || {
    wakeUp: '06:00', sleep: '23:00', schoolStart: '08:00', schoolEnd: '14:00', coachingStart: '16:00', coachingEnd: '19:00'
  });
  const [examDate, setExamDate] = useState(data.targetExamDate || '2025-05-20');

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    const result = await generateSmartTimetable({ ...data, routine });
    setSmartPlan(result);
    setIsGenerating(false);
  };

  const generateDailySchedule = () => {
    return [
      { time: routine.wakeUp, label: 'Wake Up & Mindset', type: 'rest', icon: Sun, color: 'amber' },
      { time: routine.schoolStart, label: 'Academic School Hours', type: 'routine', icon: School, color: 'slate' },
      { time: routine.schoolEnd, label: 'Lunch & Relax', type: 'rest', icon: Coffee, color: 'emerald' },
      { time: routine.coachingStart, label: 'JEE Coaching Sessions', type: 'routine', icon: Target, color: 'blue' },
      { time: routine.coachingEnd, label: 'Deep Work: Concepts', type: 'study', icon: BookOpen, color: 'violet' },
      { time: routine.sleep, label: 'Sleep & Recovery', type: 'rest', icon: Moon, color: 'slate' }
    ];
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
        <div>
          <h2 className="text-6xl font-black text-slate-900 tracking-tighter italic">Strategic Planner.</h2>
          <p className="text-slate-500 font-medium text-lg">Local analysis of syllabus velocity.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-2 rounded-[2.5rem] border border-slate-200 shadow-xl">
          <button 
            onClick={handleGeneratePlan}
            disabled={isGenerating}
            className="bg-indigo-600 text-white px-10 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 shadow-2xl hover:bg-indigo-700 disabled:opacity-50"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Sparkles className="w-5 h-5" /> Calculate Plan</>}
          </button>
          <div className="w-px h-10 bg-slate-100"></div>
          <button onClick={() => setActiveView('daily')} className={`px-8 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-widest ${activeView === 'daily' ? 'bg-slate-900 text-white' : 'text-slate-400'}`}>Daily Flow</button>
        </div>
      </div>

      {!smartPlan && !isGenerating ? (
        <div className="bg-slate-900 p-20 rounded-[4rem] text-center space-y-8 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 left-0 p-12 opacity-5"><Brain className="w-80 h-80" /></div>
           <div className="w-24 h-24 bg-white/10 rounded-[2.5rem] flex items-center justify-center mx-auto backdrop-blur-md">
              <Sparkles className="w-12 h-12 text-indigo-400" />
           </div>
           <div className="space-y-4 max-w-xl mx-auto">
              <h3 className="text-4xl font-black text-white italic tracking-tight">Generate Strategy Matrix</h3>
              <p className="text-slate-400 text-lg leading-relaxed">Let the local engine analyze your chapter accuracies and routine constraints.</p>
           </div>
           <button onClick={handleGeneratePlan} className="bg-white text-slate-950 px-14 py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] shadow-2xl hover:scale-105 transition-all">Start Optimization</button>
        </div>
      ) : isGenerating ? (
        <div className="py-40 flex flex-col items-center justify-center space-y-10">
           <Loader2 className="w-20 h-20 text-indigo-600 animate-spin" />
           <div className="text-center space-y-3">
              <p className="text-3xl font-black text-slate-900 italic tracking-tight">Computing Temporal Alignment...</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">Analyzing 94 Academic Units</p>
           </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
           <div className="xl:col-span-4 space-y-8">
              <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-10">
                 <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3"><Settings2 className="w-6 h-6 text-indigo-600" /> Routine Matrix</h3>
                 <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">Wake Up</label>
                          <input type="time" value={routine.wakeUp} className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-black text-slate-800" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">Sleep At</label>
                          <input type="time" value={routine.sleep} className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-black text-slate-800" />
                       </div>
                    </div>
                    <div className="p-8 bg-indigo-50 rounded-[2.5rem] border border-indigo-100 space-y-6">
                       <h4 className="text-[10px] font-black uppercase text-indigo-600 tracking-widest border-b border-indigo-200 pb-3">AI Tactical Inversion</h4>
                       <p className="text-sm font-bold text-indigo-900 leading-relaxed italic">"{smartPlan.optimization}"</p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="xl:col-span-8 space-y-6">
              <div className="space-y-4">
                 {generateDailySchedule().map((item, i) => (
                  <div key={i} className="group relative flex items-center gap-8 animate-in slide-in-from-right duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                    <div className="w-24 text-right">
                      <div className="text-sm font-black text-slate-400 group-hover:text-slate-900 transition-colors">{item.time}</div>
                    </div>
                    <div className={`w-2 h-16 rounded-full bg-${item.color}-500 shadow-xl shadow-${item.color}-200 group-hover:scale-y-125 transition-transform`}></div>
                    <div className="flex-1 bg-white p-8 rounded-[3rem] border border-slate-200 group-hover:border-indigo-400 group-hover:shadow-2xl transition-all flex items-center justify-between">
                      <div className="flex items-center gap-8">
                        <div className={`w-14 h-14 bg-${item.color}-50 text-${item.color}-600 rounded-2xl flex items-center justify-center`}>
                          <item.icon className="w-7 h-7" />
                        </div>
                        <div>
                          <h4 className="font-black text-slate-800 text-xl italic tracking-tight">{item.label}</h4>
                          <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest">{item.type}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-6 h-6 text-slate-100 group-hover:text-indigo-600 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default TimetableModule;
