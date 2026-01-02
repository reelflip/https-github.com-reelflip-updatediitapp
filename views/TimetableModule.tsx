
import React, { useState, useMemo } from 'react';
import { StudentData, RoutineConfig, Chapter, Subject } from '../types';
import { 
  Calendar, Clock, Coffee, Zap, Moon, Sun, School, BookOpen, 
  Settings2, Target, TrendingUp, Sparkles, Save, 
  AlertCircle, Loader2, Brain, Flag, CalendarDays, 
  CheckCircle2, ListTodo, GraduationCap, RefreshCw, Map, ChevronRight,
  CalendarCheck, Trash2, Edit3, ArrowRight, Tag
} from 'lucide-react';
import { api } from '../services/apiService';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface RoadmapWeek {
  weekNumber: number;
  startDate: string;
  endDate: string;
  phase: 'LEARNING' | 'REVISION' | 'MOCK_DRILLS';
  chapters: Chapter[];
  isDone: boolean;
}

const TimetableModule: React.FC<{ data: StudentData; setData: (data: StudentData) => void }> = ({ data, setData }) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'course'>('daily');
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Daily Routine State
  const [routine, setRoutine] = useState<RoutineConfig>(data.routine || {
    wakeUp: '05:30 AM',
    sleep: '10:30 PM',
    schoolStart: '10:00 AM',
    schoolEnd: '04:00 PM',
    hasSchool: true,
    coachingStart: '06:00 AM',
    coachingEnd: '09:00 AM',
    coachingDays: ['Mon', 'Wed', 'Fri']
  });

  const [generatedSchedule, setGeneratedSchedule] = useState<any[]>(data.smartPlan?.schedule || []);

  // Course Plan State
  const [planStartDate, setPlanStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [targetExamDate, setTargetExamDate] = useState('2026-06-27');
  const [roadmap, setRoadmap] = useState<RoadmapWeek[]>(data.smartPlan?.roadmap || []);

  const handleToggleDay = (day: string) => {
    setRoutine(prev => ({
      ...prev,
      coachingDays: prev.coachingDays.includes(day) 
        ? prev.coachingDays.filter(d => d !== day) 
        : [...prev.coachingDays, day]
    }));
  };

  const handleGenerateDaily = async () => {
    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 1200));
    const schedule = [
      { time: routine.wakeUp, label: 'Wake Up & Activation', type: 'REST', icon: Sun },
      { time: routine.coachingStart, label: 'JEE Coaching Stream', type: 'FIXED', icon: GraduationCap },
      { time: '09:15 AM', label: 'Priority Revision: ' + (data.chapters.find(c => c.accuracy < 70)?.name || 'Physics'), type: 'DEEP', icon: Brain },
      { time: routine.schoolStart, label: 'School Academic Session', type: 'FIXED', icon: School },
      { time: '04:30 PM', label: 'Cognitive Recovery', type: 'REST', icon: Coffee },
      { time: '05:30 PM', label: 'Problem Solving Sprint', type: 'DEEP', icon: Zap },
      { time: '08:30 PM', label: 'Dinner & Buffer', type: 'REST', icon: Coffee },
      { time: routine.sleep, label: 'Restorative Sleep', type: 'REST', icon: Moon }
    ];
    setGeneratedSchedule(schedule);
    setIsGenerating(false);
  };

  const generateMasterPlan = async () => {
    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 1800));
    
    const start = new Date(planStartDate);
    const end = new Date(targetExamDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
    
    // Simple logic: distribute unfinished chapters across weeks
    const unfinished = data.chapters.filter(c => c.status !== 'COMPLETED');
    const chPerWeek = Math.ceil(unfinished.length / (totalWeeks || 1));
    
    const newRoadmap: RoadmapWeek[] = [];
    for (let i = 0; i < totalWeeks; i++) {
      const wStart = new Date(start);
      wStart.setDate(start.getDate() + (i * 7));
      const wEnd = new Date(wStart);
      wEnd.setDate(wStart.getDate() + 6);

      const weekChapters = unfinished.slice(i * chPerWeek, (i + 1) * chPerWeek);
      
      newRoadmap.push({
        weekNumber: i + 1,
        startDate: wStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        endDate: wEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        phase: i > totalWeeks * 0.8 ? 'REVISION' : 'LEARNING',
        chapters: weekChapters,
        isDone: false
      });
    }
    
    setRoadmap(newRoadmap);
    setIsGenerating(false);
  };

  const toggleWeekDone = (idx: number) => {
    const next = [...roadmap];
    next[idx].isDone = !next[idx].isDone;
    setRoadmap(next);
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Construct the new state
    const newData = {
        ...data,
        routine: routine,
        smartPlan: {
            ...data.smartPlan,
            schedule: generatedSchedule,
            roadmap: roadmap
        }
    };

    // Global App Sync (Handles LocalStorage and LIVE API if enabled)
    setData(newData);

    // Call individual API endpoints if in LIVE mode
    if (api.getMode() === 'LIVE') {
        await api.saveRoutine(data.id, routine);
        await api.saveTimetable(data.id, { schedule: generatedSchedule, roadmap });
    }

    setTimeout(() => setIsSaving(false), 800);
  };

  const getSubjectColor = (s: Subject) => {
    switch(s) {
      case 'Physics': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'Chemistry': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Mathematics': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const TimeInput = ({ label, value, onChange }: any) => (
    <div className="flex-1 space-y-2">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative group">
        <input 
          type="text" 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm font-black text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all"
        />
        <Clock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500" />
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-32 animate-in fade-in duration-500 px-4">
      {/* --- HEADER BAR --- */}
      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm p-10 flex flex-col lg:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-6">
           <div className="w-16 h-16 bg-[#10b981] rounded-[1.5rem] flex items-center justify-center text-white shadow-xl shadow-emerald-100">
              <CalendarCheck className="w-8 h-8" />
           </div>
           <div>
              <h1 className="text-4xl font-black italic tracking-tighter text-[#0a1128] uppercase leading-none">Schedule & Planner</h1>
              <p className="text-slate-400 text-sm font-medium mt-1">Manage your daily routine and generate a long-term master plan.</p>
           </div>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={handleSave}
             disabled={isSaving}
             className="px-10 py-4 bg-white border border-slate-200 text-[#0a1128] rounded-[1.5rem] text-xs font-black uppercase tracking-widest flex items-center gap-3 shadow-xl hover:bg-slate-50 transition-all disabled:opacity-50"
           >
             {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Save Changes</>}
           </button>
        </div>
      </div>

      {/* --- TAB NAVIGATION --- */}
      <div className="flex p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm w-fit mx-auto">
        <button 
          onClick={() => setActiveTab('daily')}
          className={`px-10 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-3 transition-all ${activeTab === 'daily' ? 'bg-[#2b4c8c] text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Clock className="w-4 h-4" /> Daily Routine
        </button>
        <button 
          onClick={() => setActiveTab('course')}
          className={`px-10 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-3 transition-all ${activeTab === 'course' ? 'bg-[#2b4c8c] text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Map className="w-4 h-4" /> Full Course Plan
        </button>
      </div>

      {activeTab === 'daily' ? (
        <div className="space-y-8 animate-in slide-in-from-left duration-500">
           <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-2xl overflow-hidden">
              <div className="p-10 bg-[#1e293b] text-white space-y-2 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 opacity-5"><Clock className="w-32 h-32" /></div>
                 <div className="flex items-center gap-4 relative z-10">
                    <Clock className="w-8 h-8 text-indigo-400" />
                    <h2 className="text-3xl font-black italic tracking-tight uppercase">Daily Routine Generator</h2>
                 </div>
                 <p className="text-indigo-300 text-sm font-medium relative z-10">Auto-allocates Revision based on your progress history.</p>
              </div>

              <div className="p-12 md:p-16 space-y-16">
                 <div className="space-y-8">
                    <h3 className="text-xs font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-3"><BookOpen className="w-4 h-4" /> Coaching Schedule</h3>
                    <div className="flex flex-wrap gap-3">
                       {DAYS.map(day => (
                         <button 
                          key={day}
                          onClick={() => handleToggleDay(day)}
                          className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest border-2 transition-all ${routine.coachingDays.includes(day) ? 'bg-[#2b4c8c] border-[#2b4c8c] text-white shadow-lg shadow-indigo-100' : 'bg-white border-slate-100 text-slate-400 hover:border-indigo-200'}`}
                         >
                           {day}
                         </button>
                       ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <TimeInput label="Start Time" value={routine.coachingStart} onChange={(v: string) => setRoutine({...routine, coachingStart: v})} />
                       <TimeInput label="End Time" value={routine.coachingEnd} onChange={(v: string) => setRoutine({...routine, coachingEnd: v})} />
                    </div>
                 </div>

                 <div className="space-y-8 pt-10 border-t border-slate-50">
                    <div className="flex justify-between items-center">
                       <h3 className="text-xs font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-3"><School className="w-4 h-4" /> School / College</h3>
                       <button 
                        onClick={() => setRoutine({...routine, hasSchool: !routine.hasSchool})}
                        className={`w-14 h-7 rounded-full p-1 transition-all ${routine.hasSchool ? 'bg-emerald-500' : 'bg-slate-200'}`}
                       >
                          <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${routine.hasSchool ? 'translate-x-7' : 'translate-x-0'}`} />
                       </button>
                    </div>
                    {routine.hasSchool && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-top-4">
                         <TimeInput label="Starts" value={routine.schoolStart} onChange={(v: string) => setRoutine({...routine, schoolStart: v})} />
                         <TimeInput label="Ends" value={routine.schoolEnd} onChange={(v: string) => setRoutine({...routine, schoolEnd: v})} />
                      </div>
                    )}
                 </div>

                 <div className="space-y-8 pt-10 border-t border-slate-50">
                    <h3 className="text-xs font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-3"><Moon className="w-4 h-4" /> Sleep Cycle</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <TimeInput label="Wake Up" value={routine.wakeUp} onChange={(v: string) => setRoutine({...routine, wakeUp: v})} />
                       <TimeInput label="Bed Time" value={routine.sleep} onChange={(v: string) => setRoutine({...routine, sleep: v})} />
                    </div>
                 </div>

                 <button 
                  onClick={handleGenerateDaily}
                  disabled={isGenerating}
                  className="w-full py-6 bg-[#0a1128] text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-4 active:scale-95"
                 >
                    {isGenerating ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Zap className="w-6 h-6 text-yellow-400 fill-yellow-400" /> Generate Daily Schedule</>}
                 </button>
              </div>
           </div>

           {generatedSchedule.length > 0 && (
             <div className="bg-white rounded-[4rem] border border-slate-200 p-12 space-y-12 animate-in slide-in-from-bottom-8">
                <div className="flex items-center gap-4 border-b border-slate-50 pb-8">
                   <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center"><CalendarDays className="w-6 h-6" /></div>
                   <div>
                      <h3 className="text-2xl font-black italic tracking-tight">Daily Protocol</h3>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Optimized Study Cycles</p>
                   </div>
                </div>
                
                <div className="relative pl-12 md:pl-20 space-y-10">
                   <div className="absolute left-6 md:left-10 top-0 bottom-0 w-1 bg-slate-100 rounded-full" />
                   {generatedSchedule.map((slot, i) => (
                     <div key={i} className="relative group">
                        <div className={`absolute -left-7 md:-left-11 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-4 border-white ring-2 ring-slate-100 transition-all ${slot.type === 'DEEP' ? 'bg-indigo-600 ring-indigo-100 scale-125 shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-slate-300'}`} />
                        <div className={`flex flex-col md:flex-row items-start md:items-center gap-8 p-8 rounded-[2.5rem] border transition-all ${slot.type === 'DEEP' ? 'bg-indigo-50 border-indigo-100 shadow-lg' : 'bg-slate-50 border-slate-100 hover:bg-white hover:shadow-xl'}`}>
                           <div className="w-24 shrink-0">
                              <div className="text-xl font-black text-slate-900 tracking-tight">{slot.time}</div>
                              <div className="text-[8px] font-black uppercase text-slate-400 tracking-widest mt-1">START</div>
                           </div>
                           <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-inner ${slot.type === 'DEEP' ? 'bg-white text-indigo-600' : 'bg-white text-slate-400'}`}>
                              <slot.icon className="w-6 h-6" />
                           </div>
                           <div className="flex-1">
                              <h4 className="text-lg font-black italic tracking-tighter uppercase leading-none">{slot.label}</h4>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{slot.type} Session Core</p>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           )}
        </div>
      ) : (
        <div className="space-y-10 animate-in slide-in-from-right duration-500">
           {/* --- STRATEGY GENERATOR CARD --- */}
           <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-2xl overflow-hidden">
              <div className="p-10 bg-[#4f46e5] text-white space-y-2 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 opacity-5"><Map className="w-32 h-32" /></div>
                 <div className="flex items-center gap-4 relative z-10">
                    <Map className="w-8 h-8 text-indigo-200" />
                    <h2 className="text-3xl font-black italic tracking-tight uppercase">Long-Term Strategy Generator</h2>
                 </div>
                 <p className="text-indigo-100 text-sm font-medium relative z-10">Auto-distributes syllabus into weeks until your exam date.</p>
              </div>

              <div className="p-10 md:p-14 space-y-12">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">Start Date</label>
                       <div className="relative">
                          <input 
                            type="date" 
                            value={planStartDate} 
                            onChange={(e) => setPlanStartDate(e.target.value)}
                            className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black italic outline-none focus:ring-4 focus:ring-indigo-100 transition-all shadow-inner" 
                          />
                       </div>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">Target Exam Date</label>
                       <div className="relative">
                          <input 
                            type="date" 
                            value={targetExamDate} 
                            onChange={(e) => setTargetExamDate(e.target.value)}
                            className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black italic outline-none focus:ring-4 focus:ring-indigo-100 transition-all shadow-inner" 
                          />
                       </div>
                    </div>
                 </div>

                 <button 
                  onClick={generateMasterPlan}
                  disabled={isGenerating}
                  className="w-full py-6 bg-[#2b4c8c] text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:bg-[#1e3a8a] transition-all flex items-center justify-center gap-4 active:scale-95"
                 >
                    {isGenerating ? <Loader2 className="w-6 h-6 animate-spin" /> : <><CalendarCheck className="w-6 h-6" /> Generate Master Plan</>}
                 </button>
              </div>
           </div>

           {/* --- ROADMAP OUTPUT --- */}
           {roadmap.length > 0 && (
             <div className="space-y-8 animate-in slide-in-from-bottom-8">
                <h3 className="text-2xl font-black italic text-slate-800 tracking-tight px-4">Your Roadmap ({roadmap.length} Weeks)</h3>
                <div className="space-y-6">
                   {roadmap.map((week, idx) => (
                     <div key={idx} className={`bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm transition-all hover:shadow-xl group ${week.isDone ? 'opacity-60' : ''}`}>
                        <div className="p-8 flex flex-col md:flex-row justify-between items-center gap-8">
                           <div className="flex items-center gap-8">
                              <div className={`w-14 h-14 rounded-[1.5rem] flex flex-col items-center justify-center font-black transition-all ${week.isDone ? 'bg-emerald-500 text-white' : 'bg-[#dbeafe] text-[#3b82f6]'}`}>
                                 <span className="text-[9px] uppercase tracking-tighter leading-none">Week</span>
                                 <span className="text-2xl leading-none">{week.weekNumber}</span>
                              </div>
                              <div className="space-y-2">
                                 <div className="flex items-center gap-4">
                                    <h4 className="text-xl font-black italic text-slate-800 tracking-tight">{week.startDate} - {week.endDate}</h4>
                                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${week.phase === 'LEARNING' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                       {week.phase}
                                    </span>
                                 </div>
                                 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{week.chapters.length} Chapters Assigned</p>
                              </div>
                           </div>

                           <button 
                             onClick={() => toggleWeekDone(idx)}
                             className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 border-2 ${week.isDone ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
                           >
                             <Flag className="w-4 h-4" /> {week.isDone ? 'Done' : 'Mark Done'}
                           </button>
                        </div>
                        
                        <div className="px-8 pb-8 flex flex-wrap gap-3">
                           {week.chapters.length > 0 ? week.chapters.map((ch, ci) => (
                             <div key={ci} className={`px-5 py-2.5 rounded-2xl border text-[10px] font-black tracking-tight italic transition-all group-hover:scale-105 ${getSubjectColor(ch.subject)}`}>
                                {ch.name}
                             </div>
                           )) : (
                             <div className="text-[10px] font-black text-slate-300 italic tracking-widest uppercase py-2">Rest / Consolidation Buffer Week</div>
                           )}
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           )}
        </div>
      )}
    </div>
  );
};

export default TimetableModule;
