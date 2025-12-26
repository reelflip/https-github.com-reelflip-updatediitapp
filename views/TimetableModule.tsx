import React, { useState, useMemo } from 'react';
import { StudentData, RoutineConfig, Chapter } from '../types';
import { 
  Calendar, Clock, Coffee, Zap, Moon, Sun, School, BookOpen, 
  Settings2, Target, TrendingUp, ChevronRight, Sparkles, Save, 
  AlertCircle, Loader2, Brain, ArrowRight, Flag, CalendarDays, 
  CheckCircle2, ListTodo, BarChart
} from 'lucide-react';
import { api } from '../services/apiService';

interface TimetableModuleProps {
  data: StudentData;
}

const TimetableModule: React.FC<TimetableModuleProps> = ({ data }) => {
  const [activeMode, setActiveMode] = useState<'daily' | 'roadmap'>('daily');
  const [isSaving, setIsSaving] = useState(false);
  
  const [routine, setRoutine] = useState<RoutineConfig>(data.routine || {
    wakeUp: '06:00', sleep: '23:00', schoolStart: '08:00', schoolEnd: '14:00', coachingStart: '16:00', coachingEnd: '19:00'
  });

  // Roadmap Logic
  const roadmapStats = useMemo(() => {
    const targetDate = data.targetExamDate ? new Date(data.targetExamDate) : new Date('2025-05-24');
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const pendingChapters = data.chapters.filter(c => c.status !== 'COMPLETED');
    const totalPending = pendingChapters.length;
    const velocityNeeded = totalPending > 0 ? (totalPending / (daysLeft / 7)).toFixed(1) : '0';

    return { daysLeft, totalPending, velocityNeeded, pendingChapters };
  }, [data.chapters, data.targetExamDate]);

  const saveRoutine = async () => {
    setIsSaving(true);
    await api.saveRoutine(data.id, routine);
    setIsSaving(false);
  };

  const dailySlots = [
    { time: routine.wakeUp, label: 'Activation Cycle', type: 'REST', icon: Sun, color: 'amber' },
    { time: routine.schoolStart, label: 'Academic School Node', type: 'FIXED', icon: School, color: 'slate' },
    { time: routine.schoolEnd, label: 'Physiological Recovery', type: 'REST', icon: Coffee, color: 'emerald' },
    { time: '15:00', label: 'AI Injected: Quick Formula Flush', type: 'DEEP WORK', icon: Brain, color: 'indigo' },
    { time: routine.coachingStart, label: 'JEE Coaching Stream', type: 'FIXED', icon: Target, color: 'rose' },
    { time: routine.coachingEnd, label: 'Deep Work: Concepts & Drills', type: 'DEEP WORK', icon: BookOpen, color: 'indigo' },
    { time: '21:30', label: 'Error Log & Plan Sync', type: 'REVIEW', icon: ListTodo, color: 'blue' },
    { time: routine.sleep, label: 'Neural Rejuvenation', type: 'REST', icon: Moon, color: 'slate' }
  ].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500 pb-32 px-4">
      {/* Header & Mode Switch */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
        <div>
           <div className="text-[10px] font-black uppercase text-indigo-600 tracking-[0.5em] mb-4 flex items-center gap-3">
              <CalendarDays className="w-5 h-5" /> Operational Scheduling
           </div>
           <h2 className="text-7xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">
              Strategic <br /> <span className="text-indigo-600">Planner.</span>
           </h2>
        </div>

        <div className="flex bg-white p-2 rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden shrink-0">
           <button 
            onClick={() => setActiveMode('daily')} 
            className={`px-10 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${activeMode === 'daily' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-700'}`}
           >
             <Clock className="w-4 h-4" /> Daily Routine
           </button>
           <button 
            onClick={() => setActiveMode('roadmap')} 
            className={`px-10 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${activeMode === 'roadmap' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-700'}`}
           >
             <Flag className="w-4 h-4" /> Syllabus Roadmap
           </button>
        </div>
      </div>

      {activeMode === 'daily' ? (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
           {/* Sidebar: Config */}
           <div className="xl:col-span-4 space-y-8">
              <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-10">
                 <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3 italic"><Settings2 className="w-6 h-6 text-indigo-600" /> Routine Matrix</h3>
                    {isSaving ? <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" /> : <button onClick={saveRoutine} className="text-[10px] font-black uppercase text-emerald-500 hover:underline">Save Sync</button>}
                 </div>
                 
                 <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-4">Wake Up</label>
                          <input type="time" value={routine.wakeUp} onChange={e => setRoutine({...routine, wakeUp: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-black text-slate-800 focus:ring-2 focus:ring-indigo-100 transition-all" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-4">Neural Shutdown</label>
                          <input type="time" value={routine.sleep} onChange={e => setRoutine({...routine, sleep: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-black text-slate-800 focus:ring-2 focus:ring-indigo-100 transition-all" />
                       </div>
                    </div>

                    <div className="p-8 bg-indigo-50 rounded-[2.5rem] border border-indigo-100 space-y-4">
                       <h4 className="text-[10px] font-black uppercase text-indigo-600 tracking-widest flex items-center gap-2"><Sparkles className="w-4 h-4" /> AI Optimization</h4>
                       <p className="text-xs font-bold text-indigo-900 leading-relaxed italic">
                         "Detected a {parseInt(routine.sleep.split(':')[0]) - parseInt(routine.wakeUp.split(':')[0]) > 16 ? 'high-fatigue' : 'healthy'} window. Morning slots are optimized for Mathematical Derivations where focus is peak."
                       </p>
                    </div>

                    <div className="space-y-4">
                       <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">Fixed Constraints</h4>
                       <div className="grid grid-cols-1 gap-4">
                          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                             <span className="text-xs font-bold text-slate-500 uppercase">School Cycle</span>
                             <div className="flex gap-2">
                                <input type="time" value={routine.schoolStart} onChange={e => setRoutine({...routine, schoolStart: e.target.value})} className="bg-white border-none rounded-lg p-2 text-[10px] font-black" />
                                <input type="time" value={routine.schoolEnd} onChange={e => setRoutine({...routine, schoolEnd: e.target.value})} className="bg-white border-none rounded-lg p-2 text-[10px] font-black" />
                             </div>
                          </div>
                          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                             <span className="text-xs font-bold text-slate-500 uppercase">Coaching Hub</span>
                             <div className="flex gap-2">
                                <input type="time" value={routine.coachingStart} onChange={e => setRoutine({...routine, coachingStart: e.target.value})} className="bg-white border-none rounded-lg p-2 text-[10px] font-black" />
                                <input type="time" value={routine.coachingEnd} onChange={e => setRoutine({...routine, coachingEnd: e.target.value})} className="bg-white border-none rounded-lg p-2 text-[10px] font-black" />
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Main Timeline */}
           <div className="xl:col-span-8 space-y-6">
              <div className="bg-white rounded-[4rem] border border-slate-200 shadow-sm p-10 space-y-12">
                 <div className="flex justify-between items-center px-4">
                    <h3 className="text-2xl font-black text-slate-800 italic tracking-tight">Daily Execution Node</h3>
                    <div className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl">Today's Protocol: Operational</div>
                 </div>

                 <div className="relative pl-12 md:pl-20 space-y-10">
                    <div className="absolute left-6 md:left-10 top-0 bottom-0 w-1 bg-slate-100 rounded-full"></div>
                    {dailySlots.map((slot, i) => (
                       <div key={i} className="relative group">
                          {/* Dot */}
                          <div className={`absolute -left-7 md:-left-11 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-4 border-white ring-2 transition-all group-hover:scale-150 ${
                            slot.type === 'DEEP WORK' ? 'bg-indigo-600 ring-indigo-200' : slot.type === 'FIXED' ? 'bg-slate-400 ring-slate-100' : 'bg-emerald-500 ring-emerald-100'
                          }`}></div>
                          
                          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 group-hover:border-indigo-400 group-hover:bg-white group-hover:shadow-2xl transition-all duration-500">
                             <div className="w-20 text-center shrink-0">
                                <div className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{slot.time}</div>
                                <div className="text-[8px] font-black uppercase text-slate-400 mt-1">{slot.type}</div>
                             </div>
                             <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border shadow-inner ${
                               slot.type === 'DEEP WORK' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-white text-slate-300 border-slate-100'
                             }`}>
                                <slot.icon className="w-7 h-7" />
                             </div>
                             <div className="flex-1">
                                <h4 className="text-xl font-black text-slate-800 italic tracking-tighter leading-none">{slot.label}</h4>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                                  {slot.type === 'DEEP WORK' ? 'Maximize solving speed & conceptual clarity' : slot.type === 'FIXED' ? 'Mandatory academic attendance' : 'Restoration for next high-load slot'}
                                </p>
                             </div>
                             <ChevronRight className="w-6 h-6 text-slate-200 group-hover:text-indigo-600 transition-all hidden md:block" />
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      ) : (
        <div className="space-y-10 animate-in slide-in-from-right duration-500">
           {/* Roadmap Stats */}
           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Days to D-Day', val: roadmapStats.daysLeft, icon: Calendar, color: 'rose' },
                { label: 'Pending Units', val: roadmapStats.totalPending, icon: BookOpen, color: 'indigo' },
                { label: 'Weekly Velocity', val: `${roadmapStats.velocityNeeded} Ch/Wk`, icon: TrendingUp, color: 'emerald' },
                { label: 'Mastery Level', val: `${Math.round((data.chapters.filter(c=>c.status==='COMPLETED').length / (data.chapters.length || 1)) * 100)}%`, icon: Target, color: 'blue' }
              ].map((s, i) => (
                <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-indigo-400 transition-all">
                  <div className={`w-12 h-12 bg-${s.color}-50 text-${s.color}-600 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform shadow-inner`}><s.icon className="w-6 h-6" /></div>
                  <div>
                    <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{s.label}</div>
                    <div className="text-3xl font-black text-slate-900 tracking-tighter">{s.val}</div>
                  </div>
                </div>
              ))}
           </div>

           {/* Tactical Burn-down */}
           <div className="bg-white rounded-[4rem] border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                 <h3 className="text-2xl font-black italic text-slate-800 flex items-center gap-3"><Flag className="w-6 h-6 text-rose-600" /> Syllabus Burn-down Chart</h3>
                 <div className="px-5 py-2 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-rose-100">Action Required: {roadmapStats.totalPending} Nodes</div>
              </div>

              <div className="divide-y divide-slate-100">
                 {roadmapStats.pendingChapters.length === 0 ? (
                   <div className="py-40 text-center space-y-6">
                      <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
                      <h4 className="text-2xl font-black italic text-slate-800">Syllabus Mastered.</h4>
                      <p className="text-slate-400 font-medium text-sm">Every unit has been synchronized to 100% completion.</p>
                   </div>
                 ) : (
                   roadmapStats.pendingChapters.sort((a,b) => a.accuracy - b.accuracy).map((ch, i) => (
                    <div key={ch.id} className="p-8 hover:bg-slate-50 transition-colors flex flex-col lg:flex-row items-center justify-between gap-10 group">
                       <div className="flex-1 flex items-center gap-8">
                          <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-xs shrink-0 shadow-xl group-hover:scale-110 transition-transform">0{i+1}</div>
                          <div className="space-y-1">
                             <div className="flex items-center gap-3">
                                <h4 className="text-xl font-black text-slate-800 italic group-hover:text-indigo-600 transition-colors">{ch.name}</h4>
                                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${ch.accuracy < 60 ? 'bg-rose-50 text-rose-500' : 'bg-indigo-50 text-indigo-500'}`}>
                                   {ch.accuracy}% Accuracy
                                </span>
                             </div>
                             <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{ch.subject} • {ch.unit}</p>
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-12 w-full lg:w-auto">
                          <div className="flex-1 lg:w-64 space-y-2">
                             <div className="flex justify-between text-[8px] font-black uppercase text-slate-400">
                                <span>Stability Matrix</span>
                                <span>{ch.progress}% Sync</span>
                             </div>
                             <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500" style={{ width: `${ch.progress}%` }}></div>
                             </div>
                          </div>
                          
                          <div className="text-right shrink-0">
                             <div className="text-[10px] font-black uppercase text-slate-400 mb-1">Target Week</div>
                             <div className="text-lg font-black text-slate-800">Week {Math.ceil((i + 1) / parseFloat(roadmapStats.velocityNeeded))}</div>
                          </div>

                          <button 
                            onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'learn' }))}
                            className="p-4 bg-white border border-slate-100 text-slate-400 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm group-hover:rotate-6"
                          >
                             <ArrowRight className="w-5 h-5" />
                          </button>
                       </div>
                    </div>
                   ))
                 )}
              </div>
           </div>

           <div className="bg-slate-900 p-12 rounded-[4rem] text-white flex flex-col md:flex-row items-center gap-10 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform duration-[3s]"><BarChart className="w-80 h-80" /></div>
              <div className="w-24 h-24 bg-white/10 rounded-[2.5rem] flex items-center justify-center shrink-0 backdrop-blur-md border border-white/20">
                 <Zap className="w-12 h-12 text-indigo-400" />
              </div>
              <div className="space-y-4 relative z-10 text-center md:text-left">
                 <h3 className="text-3xl font-black italic tracking-tighter uppercase leading-none">Intelligence Burn Rate.</h3>
                 <p className="text-indigo-200 text-sm max-w-2xl font-medium leading-relaxed">
                   Based on your current velocity of <strong>{roadmapStats.velocityNeeded} chapters/week</strong>, you are scheduled to hit 100% syllabus synchronization exactly <strong>14 days</strong> before the main exam. This leaves an optimal window for Full-Syllabus Mock Drills.
                 </p>
                 <div className="flex gap-4 pt-2">
                    <span className="px-4 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-500/30">Strategy: Optimal</span>
                    <span className="px-4 py-1.5 bg-indigo-500/20 text-indigo-400 rounded-full text-[9px] font-black uppercase tracking-widest border border-indigo-500/30">Buffer Node: Active</span>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default TimetableModule;