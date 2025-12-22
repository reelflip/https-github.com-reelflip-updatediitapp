
import React, { useState, useEffect } from 'react';
import { StudentData, RoutineConfig, Chapter } from '../types';
import { 
  Calendar, 
  Clock, 
  Coffee, 
  Zap, 
  Moon, 
  Sun, 
  School, 
  BookOpen, 
  Settings2, 
  Target, 
  TrendingUp, 
  ChevronRight,
  Sparkles,
  Save,
  AlertCircle,
  Loader2,
  Brain,
  ArrowRight
} from 'lucide-react';
import { generateSmartTimetable } from '../services/geminiService';

interface TimetableModuleProps {
  data: StudentData;
}

const TimetableModule: React.FC<TimetableModuleProps> = ({ data }) => {
  const [activeView, setActiveView] = useState<'daily' | 'exam'>('daily');
  const [isGenerating, setIsGenerating] = useState(false);
  const [smartPlan, setSmartPlan] = useState<any>(null);
  
  const [routine, setRoutine] = useState<RoutineConfig>(data.routine || {
    wakeUp: '06:00',
    sleep: '23:00',
    schoolStart: '08:00',
    schoolEnd: '14:00',
    coachingStart: '16:00',
    coachingEnd: '19:00'
  });
  const [examDate, setExamDate] = useState(data.targetExamDate || '2025-01-20');

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    const result = await generateSmartTimetable({ ...data, routine });
    if (result) {
      setSmartPlan(result);
    }
    setIsGenerating(false);
  };

  // Logic to generate daily blocks from routine
  const generateDailySchedule = () => {
    const blocks = [];
    
    // Convert string time to numeric hours for sorting
    const toMinutes = (time: string) => {
      const [h, m] = time.split(':').map(Number);
      return h * 60 + m;
    };

    blocks.push({ time: routine.wakeUp, label: 'Wake Up & Mindset', type: 'rest', icon: Sun, color: 'amber' });
    
    // Morning Study Slot (If space permits)
    if (toMinutes(routine.schoolStart) - toMinutes(routine.wakeUp) > 60) {
      blocks.push({ 
        time: routine.wakeUp, 
        label: 'Prime Hour Revision', 
        type: 'study', 
        icon: Zap, 
        color: 'indigo',
        duration: Math.floor((toMinutes(routine.schoolStart) - toMinutes(routine.wakeUp)) / 60) + 'h'
      });
    }

    blocks.push({ time: routine.schoolStart, label: 'Academic School Hours', type: 'routine', icon: School, color: 'slate' });
    
    // Post-School Slot
    if (toMinutes(routine.coachingStart) - toMinutes(routine.schoolEnd) > 60) {
       blocks.push({ time: routine.schoolEnd, label: 'Lunch & Relax', type: 'rest', icon: Coffee, color: 'emerald' });
    }

    blocks.push({ time: routine.coachingStart, label: 'JEE Coaching Sessions', type: 'routine', icon: Target, color: 'blue' });
    
    // Evening Deep Work
    blocks.push({ time: routine.coachingEnd, label: 'Deep Work: Concepts', type: 'study', icon: BookOpen, color: 'violet' });
    
    blocks.push({ time: routine.sleep, label: 'Sleep & Recovery', type: 'rest', icon: Moon, color: 'slate' });

    return blocks.sort((a, b) => toMinutes(a.time) - toMinutes(b.time));
  };

  // Logic to generate Exam Plan
  const getExamPlanStats = () => {
    const today = new Date();
    const target = new Date(examDate);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const remainingChapters = data.chapters.filter(c => c.progress < 100);
    const totalChapters = remainingChapters.length;
    
    const chaptersPerWeek = diffDays > 0 ? ((totalChapters / diffDays) * 7).toFixed(1) : 'N/A';

    return { diffDays, totalChapters, chaptersPerWeek, remainingChapters };
  };

  const { diffDays, totalChapters, chaptersPerWeek, remainingChapters } = getExamPlanStats();

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Strategic Planner</h2>
          <p className="text-slate-500 font-medium mt-1">Balancing daily discipline with long-term syllabus mastery.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={handleGeneratePlan}
            disabled={isGenerating}
            className="bg-indigo-600 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-xl shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50"
          >
            {isGenerating ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Calculating Plan...</>
            ) : (
              <><Sparkles className="w-4 h-4" /> {smartPlan ? 'Regenerate Smart Plan' : 'Generate Smart Plan'}</>
            )}
          </button>
          
          <div className="flex p-1.5 bg-white rounded-[2rem] border border-slate-200 shadow-sm">
            <button 
              onClick={() => setActiveView('daily')}
              className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeView === 'daily' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-700'}`}
            >
              <Clock className="w-4 h-4" /> Daily Flow
            </button>
            <button 
              onClick={() => setActiveView('exam')}
              className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeView === 'exam' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-700'}`}
            >
              <Target className="w-4 h-4" /> Exam Strategy
            </button>
          </div>
        </div>
      </div>

      {!smartPlan && !isGenerating && (
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-12 rounded-[3.5rem] text-white flex flex-col items-center text-center space-y-8 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 left-0 p-10 opacity-10"><Brain className="w-64 h-64" /></div>
           <div className="w-20 h-20 bg-white/10 rounded-[2rem] flex items-center justify-center backdrop-blur-md">
              <Sparkles className="w-10 h-10 text-indigo-300" />
           </div>
           <div className="space-y-4 max-w-xl">
              <h3 className="text-3xl font-black italic">No AI Plan Detected</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Let our intelligence engine analyze your current syllabus mastery, backlog load, and routine constraints to build your optimal path to AIR-1.</p>
           </div>
           <button 
            onClick={handleGeneratePlan}
            className="bg-white text-indigo-950 px-12 py-4 rounded-3xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl hover:scale-105 transition-all flex items-center gap-3"
           >
              Create My Smart Strategy <ArrowRight className="w-4 h-4" />
           </button>
        </div>
      )}

      {isGenerating && (
        <div className="py-32 flex flex-col items-center justify-center space-y-6">
           <div className="relative">
              <Loader2 className="w-16 h-16 text-indigo-600 animate-spin" />
              <Sparkles className="w-6 h-6 text-indigo-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
           </div>
           <div className="text-center">
              <p className="text-lg font-black text-slate-800">Calculating Temporal Alignment...</p>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Processing 94 Units & Routine Peaks</p>
           </div>
        </div>
      )}

      {(smartPlan || activeView === 'exam') && !isGenerating && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
          {/* LEFT: INPUTS & SETTINGS */}
          <div className="xl:col-span-4 space-y-8">
            {activeView === 'daily' ? (
              <div className="space-y-8">
                <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                      <Settings2 className="w-5 h-5" />
                    </div>
                    <h3 className="font-black text-xl text-slate-800">Routine Inputs</h3>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400">Wake Up</label>
                        <input type="time" value={routine.wakeUp} onChange={(e) => setRoutine({...routine, wakeUp: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold text-slate-800" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400">Sleep At</label>
                        <input type="time" value={routine.sleep} onChange={(e) => setRoutine({...routine, sleep: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold text-slate-800" />
                      </div>
                    </div>

                    <div className="p-6 bg-slate-50 rounded-[2rem] space-y-4">
                      <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-200 pb-2">School Commitments</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-400 uppercase">Starts</label>
                            <input type="time" value={routine.schoolStart} onChange={(e) => setRoutine({...routine, schoolStart: e.target.value})} className="w-full bg-white border-none rounded-xl px-4 py-2 text-xs font-bold" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-400 uppercase">Ends</label>
                            <input type="time" value={routine.schoolEnd} onChange={(e) => setRoutine({...routine, schoolEnd: e.target.value})} className="w-full bg-white border-none rounded-xl px-4 py-2 text-xs font-bold" />
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-slate-50 rounded-[2rem] space-y-4">
                      <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-200 pb-2">Coaching Commitments</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-400 uppercase">Starts</label>
                            <input type="time" value={routine.coachingStart} onChange={(e) => setRoutine({...routine, coachingStart: e.target.value})} className="w-full bg-white border-none rounded-xl px-4 py-2 text-xs font-bold" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-400 uppercase">Ends</label>
                            <input type="time" value={routine.coachingEnd} onChange={(e) => setRoutine({...routine, coachingEnd: e.target.value})} className="w-full bg-white border-none rounded-xl px-4 py-2 text-xs font-bold" />
                        </div>
                      </div>
                    </div>

                    <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center justify-center gap-2">
                      <Save className="w-4 h-4" /> Save Routine
                    </button>
                  </div>
                </div>

                {smartPlan && (
                  <div className="bg-indigo-600 p-8 rounded-[3rem] text-white space-y-6 shadow-xl relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12"><Zap className="w-24 h-24" /></div>
                     <div className="flex items-center gap-3">
                        <Sparkles className="w-6 h-6 text-indigo-300" />
                        <h4 className="font-black italic text-xl">AI Insights</h4>
                     </div>
                     <div className="space-y-4">
                        <div>
                           <div className="text-[9px] font-black uppercase text-indigo-300 tracking-widest mb-1">Time Distribution</div>
                           <p className="text-xs font-medium leading-relaxed">{smartPlan.strategy}</p>
                        </div>
                        <div className="pt-4 border-t border-white/10">
                           <div className="text-[9px] font-black uppercase text-indigo-300 tracking-widest mb-1">Critical Modification</div>
                           <p className="text-xs font-medium leading-relaxed">{smartPlan.optimization}</p>
                        </div>
                     </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center">
                    <Target className="w-5 h-5" />
                  </div>
                  <h3 className="font-black text-xl text-slate-800">Goal Configuration</h3>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400">JEE Mains Target Date</label>
                    <input 
                      type="date" 
                      value={examDate} 
                      onChange={(e) => setExamDate(e.target.value)}
                      className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-rose-500 transition-all" 
                    />
                  </div>

                  <div className="p-8 bg-rose-600 rounded-[2.5rem] text-white space-y-6 shadow-xl shadow-rose-100">
                    <div>
                      <div className="text-[10px] font-black uppercase text-rose-200 tracking-[0.2em] mb-1">Time Remaining</div>
                      <div className="text-4xl font-black">{diffDays} <span className="text-sm font-medium">Days</span></div>
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase text-rose-200 tracking-[0.2em] mb-1">Velocity Target</div>
                      <div className="text-2xl font-black">{chaptersPerWeek} <span className="text-xs font-medium opacity-80 uppercase tracking-widest">Chapters / Wk</span></div>
                    </div>
                    <div className="pt-4 border-t border-rose-500/50">
                      <p className="text-[10px] font-medium leading-relaxed italic opacity-80">"At this speed, you will complete the syllabus 10 days before the exam for full-length mocks."</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest">Current Backlog</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200">
                        <span className="text-xs font-bold text-slate-700">Physics Units</span>
                        <span className="text-xs font-black text-indigo-600">{data.chapters.filter(c => c.subject === 'Physics' && c.progress < 100).length}</span>
                      </div>
                      <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200">
                        <span className="text-xs font-bold text-slate-700">Chemistry Units</span>
                        <span className="text-xs font-black text-emerald-600">{data.chapters.filter(c => c.subject === 'Chemistry' && c.progress < 100).length}</span>
                      </div>
                      <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200">
                        <span className="text-xs font-bold text-slate-700">Math Units</span>
                        <span className="text-xs font-black text-rose-600">{data.chapters.filter(c => c.subject === 'Mathematics' && c.progress < 100).length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: GENERATED TABLE / TIMELINE */}
          <div className="xl:col-span-8 space-y-6">
            {activeView === 'daily' ? (
              <div className="space-y-4">
                 {generateDailySchedule().map((item, i) => (
                  <div key={i} className="group relative flex items-center gap-8 animate-in slide-in-from-right duration-300" style={{ animationDelay: `${i * 100}ms` }}>
                    <div className="w-24 text-right">
                      <div className="text-sm font-black text-slate-400 group-hover:text-slate-900 transition-colors">{item.time}</div>
                    </div>
                    
                    <div className={`w-2 h-16 rounded-full bg-${item.color}-500 shadow-[0_0_15px_rgba(0,0,0,0.1)] group-hover:scale-y-110 transition-transform origin-top`}></div>

                    <div className="flex-1 bg-white p-6 rounded-[2rem] border border-slate-200 group-hover:border-indigo-400 group-hover:shadow-2xl transition-all flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className={`w-12 h-12 bg-${item.color}-50 text-${item.color}-600 rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-transform`}>
                          <item.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-black text-slate-800 text-lg">{item.label}</h4>
                          <div className="flex gap-4">
                             <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                                <span className={`w-1.5 h-1.5 rounded-full bg-${item.color}-500`}></span>
                                {item.type}
                             </span>
                             {item.duration && (
                               <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{item.duration} Duration</span>
                             )}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-6 h-6 text-slate-100 group-hover:text-indigo-600 transition-colors" />
                    </div>
                  </div>
                ))}

                {smartPlan && (
                  <div className="mt-12 bg-slate-900 p-8 rounded-[3rem] border border-slate-800 flex flex-col md:flex-row items-center gap-8 shadow-2xl">
                    <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center shadow-lg shrink-0">
                        <Target className="w-10 h-10 text-white" />
                    </div>
                    <div>
                        <h4 className="font-black text-white text-xl">Top Priority Focus Units</h4>
                        <div className="flex flex-wrap gap-2 mt-4">
                           {smartPlan.focusBlocks.map((block: string, idx: number) => (
                             <span key={idx} className="bg-white/10 text-indigo-300 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
                                {block}
                             </span>
                           ))}
                        </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-xl overflow-hidden">
                 <div className="p-10 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight">Syllabus Velocity Matrix</h3>
                      <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Recommended Weekly Targets</p>
                    </div>
                    <div className="flex gap-2">
                      <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold flex items-center gap-2">
                         <TrendingUp className="w-4 h-4 text-emerald-500" /> Balanced Load
                      </div>
                    </div>
                 </div>

                 <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead className="bg-slate-50">
                         <tr className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
                            <th className="px-10 py-6">Week Timeline</th>
                            <th className="px-10 py-6">Primary Target Units</th>
                            <th className="px-10 py-6 text-right">Status</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                         {remainingChapters.length > 0 ? (
                           // Mocking a weekly distribution
                           Array.from({ length: Math.ceil(remainingChapters.length / 2) }).map((_, i) => (
                             <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-10 py-8 whitespace-nowrap">
                                   <div className="font-black text-slate-800">Week {i + 1}</div>
                                   <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                      {new Date(Date.now() + i * 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                                   </div>
                                </td>
                                <td className="px-10 py-8">
                                   <div className="flex flex-wrap gap-2">
                                      {remainingChapters.slice(i * 2, i * 2 + 2).map(ch => (
                                         <span key={ch.id} className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                            ch.subject === 'Physics' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                                            ch.subject === 'Chemistry' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                                         }`}>
                                            {ch.name}
                                         </span>
                                      ))}
                                   </div>
                                </td>
                                <td className="px-10 py-8 text-right">
                                   {i === 0 ? (
                                     <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-indigo-600 animate-pulse">
                                        <span className="w-2 h-2 rounded-full bg-indigo-600"></span> Current
                                     </span>
                                   ) : (
                                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Upcoming</span>
                                   )}
                                </td>
                             </tr>
                           ))
                         ) : (
                           <tr>
                              <td colSpan={3} className="px-10 py-20 text-center">
                                 <div className="flex flex-col items-center gap-4 text-slate-400">
                                    <AlertCircle className="w-12 h-12 opacity-20" />
                                    <div className="font-black uppercase tracking-[0.2em] text-xs">Full Syllabus Mastered</div>
                                    <p className="text-xs italic">All chapters are marked 100% progress. Start Full-Length Mocks.</p>
                                 </div>
                              </td>
                           </tr>
                         )}
                      </tbody>
                   </table>
                 </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimetableModule;
