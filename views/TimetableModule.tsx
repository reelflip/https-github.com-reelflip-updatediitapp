import React, { useState, useEffect } from 'react';
import { StudentData, RoutineConfig } from '../types';
import { Calendar, Clock, Coffee, Zap, Moon, Sun, School, BookOpen, Settings2, Target, TrendingUp, ChevronRight, Sparkles, Save, AlertCircle, Loader2, Brain, ArrowRight } from 'lucide-react';
import { generateSmartTimetable } from '../services/intelligenceService';
import { api } from '../services/apiService';

interface TimetableModuleProps {
  data: StudentData;
}

const TimetableModule: React.FC<TimetableModuleProps> = ({ data }) => {
  const [activeView, setActiveView] = useState<'daily' | 'exam'>('daily');
  const [isGenerating, setIsGenerating] = useState(false);
  const [smartPlan, setSmartPlan] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [routine, setRoutine] = useState<RoutineConfig>(data.routine || {
    wakeUp: '06:00', sleep: '23:00', schoolStart: '08:00', schoolEnd: '14:00', coachingStart: '16:00', coachingEnd: '19:00'
  });

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    const result = await generateSmartTimetable({ ...data, routine });
    setSmartPlan(result);
    setIsGenerating(false);
    
    // Auto-save routine to backend when generating new strategy
    if (api.getMode() === 'LIVE') {
        await api.saveRoutine(data.id, routine);
    }
  };

  const saveRoutineManual = async () => {
      setIsSaving(true);
      await api.saveRoutine(data.id, routine);
      setIsSaving(false);
      alert("Routine persisted to MySQL.");
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
          <button onClick={saveRoutineManual} className="px-8 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:bg-emerald-50">
             {isSaving ? "Saving..." : "Save Config"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
           <div className="xl:col-span-4 space-y-8">
              <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-10">
                 <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3"><Settings2 className="w-6 h-6 text-indigo-600" /> Routine Matrix</h3>
                 <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">Wake Up</label>
                          <input type="time" value={routine.wakeUp} onChange={e => setRoutine({...routine, wakeUp: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-black text-slate-800" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">Sleep At</label>
                          <input type="time" value={routine.sleep} onChange={e => setRoutine({...routine, sleep: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-black text-slate-800" />
                       </div>
                    </div>
                    <div className="space-y-4">
                       <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                             <label className="text-[8px] font-black uppercase text-slate-400 ml-4">School Start</label>
                             <input type="time" value={routine.schoolStart} onChange={e => setRoutine({...routine, schoolStart: e.target.value})} className="w-full bg-slate-50 border-none rounded-xl p-3 text-xs font-bold" />
                          </div>
                          <div className="space-y-1">
                             <label className="text-[8px] font-black uppercase text-slate-400 ml-4">School End</label>
                             <input type="time" value={routine.schoolEnd} onChange={e => setRoutine({...routine, schoolEnd: e.target.value})} className="w-full bg-slate-50 border-none rounded-xl p-3 text-xs font-bold" />
                          </div>
                       </div>
                    </div>
                    {smartPlan && (
                        <div className="p-8 bg-indigo-50 rounded-[2.5rem] border border-indigo-100 space-y-6">
                           <h4 className="text-[10px] font-black uppercase text-indigo-600 tracking-widest border-b border-indigo-200 pb-3">AI Tactical Inversion</h4>
                           <p className="text-sm font-bold text-indigo-900 leading-relaxed italic">"{smartPlan.optimization}"</p>
                        </div>
                    )}
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
                    <div className={`w-2 h-16 rounded-full bg-slate-200 group-hover:bg-indigo-500 transition-all`}></div>
                    <div className="flex-1 bg-white p-8 rounded-[3rem] border border-slate-200 group-hover:border-indigo-400 group-hover:shadow-2xl transition-all flex items-center justify-between">
                      <div className="flex items-center gap-8">
                        <div className={`w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center group-hover:text-indigo-600`}>
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
    </div>
  );
};

export default TimetableModule;