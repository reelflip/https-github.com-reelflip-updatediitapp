
import React, { useState, useMemo } from 'react';
import { StudentData, RoutineConfig, Chapter, Subject } from '../types';
import { 
  Calendar, Clock, Coffee, Zap, Moon, Sun, School, BookOpen, 
  Settings2, Target, TrendingUp, Sparkles, Save, 
  AlertCircle, Loader2, Brain, Flag, CalendarDays, 
  CheckCircle2, ListTodo, GraduationCap, RefreshCw, Map, ChevronRight,
  CalendarCheck, Trash2, Edit3, ArrowRight, Tag, Settings, RotateCcw, ChevronDown, ChevronUp
} from 'lucide-react';
import { api } from '../services/apiService';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const ICON_MAP: Record<string, any> = {
  Sun: Sun,
  GraduationCap: GraduationCap,
  Brain: Brain,
  School: School,
  Coffee: Coffee,
  Zap: Zap,
  Moon: Moon
};

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
  const [isDailyConfigExpanded, setIsDailyConfigExpanded] = useState(generatedSchedule.length === 0);

  // Course Plan State
  const [planStartDate, setPlanStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [targetExamDate, setTargetExamDate] = useState('2026-06-27');
  const [roadmap, setRoadmap] = useState<RoadmapWeek[]>(data.smartPlan?.roadmap || []);
  const [isCourseConfigExpanded, setIsCourseConfigExpanded] = useState(roadmap.length === 0);

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
      { time: routine.wakeUp, label: 'Wake Up & Activation', type: 'REST', iconId: 'Sun' },
      { time: routine.coachingStart, label: 'JEE Coaching Stream', type: 'FIXED', iconId: 'GraduationCap' },
      { time: '09:15 AM', label: 'Priority Revision: ' + (data.chapters.find(c => c.accuracy < 70)?.name || 'Physics'), type: 'DEEP', iconId: 'Brain' },
      { time: routine.schoolStart, label: 'School Academic Session', type: 'FIXED', iconId: 'School' },
      { time: '04:30 PM', label: 'Cognitive Recovery', type: 'REST', iconId: 'Coffee' },
      { time: '05:30 PM', label: 'Problem Solving Sprint', type: 'DEEP', iconId: 'Zap' },
      { time: '08:30 PM', label: 'Dinner & Buffer', type: 'REST', iconId: 'Coffee' },
      { time: routine.sleep, label: 'Restorative Sleep', type: 'REST', iconId: 'Moon' }
    ];
    setGeneratedSchedule(schedule);
    setIsGenerating(false);
    setIsDailyConfigExpanded(false);
  };

  const generateMasterPlan = async () => {
    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 1800));
    
    const start = new Date(planStartDate);
    const end = new Date(targetExamDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
    
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
    setIsCourseConfigExpanded(false);
  };

  // Fix: Defined the toggleWeekDone function to allow marking weeks as completed in the roadmap
  const toggleWeekDone = (idx: number) => {
    setRoadmap(prev => prev.map((week, i) => i === idx ? { ...week, isDone: !week.isDone } : week));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const newData = {
        ...data,
        routine: routine,
        smartPlan: {
            ...data.smartPlan,
            schedule: generatedSchedule,
            roadmap: roadmap
        }
    };
    setData(newData);
    if (api.getMode() === 'LIVE') {
        try {
            await api.saveRoutine(data.id, routine);
            await api.saveTimetable(data.id, { schedule: generatedSchedule, roadmap });
        } catch (e) { console.error("Sync error"); }
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
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-black text-slate-700 focus:bg-white focus:border-indigo-500 transition-all outline-none" />
        <Clock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500" />
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-32 animate-in fade-in duration-500 px-4">
      {/* Header */}
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
        <button onClick={handleSave} disabled={isSaving} className="px-10 py-4 bg-slate-900 text-white rounded-[1.5rem] text-xs font-black uppercase tracking-widest flex items-center gap-3 shadow-2xl hover:bg-black transition-all disabled:opacity-50">
           {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Save All Changes</>}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm w-fit mx-auto">
        <button onClick={() => setActiveTab('daily')} className={`px-10 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-3 transition-all ${activeTab === 'daily' ? 'bg-[#2b4c8c] text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>
          <Clock className="w-4 h-4" /> Daily Routine
        </button>
        <button onClick={() => setActiveTab('course')} className={`px-10 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-3 transition-all ${activeTab === 'course' ? 'bg-[#2b4c8c] text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>
          <Map className="w-4 h-4" /> Full Course Plan
        </button>
      </div>

      {activeTab === 'daily' ? (
        <div className="space-y-8 animate-in slide-in-from-left duration-500">
           {/* Daily Config Section */}
           <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-xl overflow-hidden">
              <div className="p-10 bg-[#1e293b] text-white flex justify-between items-center relative overflow-hidden cursor-pointer" onClick={() => setIsDailyConfigExpanded(!isDailyConfigExpanded)}>
                 <div className="absolute top-0 right-0 p-8 opacity-5"><Settings className="w-32 h-32" /></div>
                 <div className="space-y-2 relative z-10">
                    <div className="flex items-center gap-4">
                       <Clock className="w-8 h-8 text-indigo-400" />
                       <h2 className="text-3xl font-black italic tracking-tight uppercase">Daily Routine Configuration</h2>
                    </div>
                    <p className="text-indigo-300 text-sm font-medium">Define your constraints to generate a performance-optimized schedule.</p>
                 </div>
                 {generatedSchedule.length > 0 && (
                   <div className="relative z-10">
                     {isDailyConfigExpanded ? <ChevronUp className="w-6 h-6" /> : <button className="px-6 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Edit Protocol</button>}
                   </div>
                 )}
              </div>

              {isDailyConfigExpanded ? (
                <div className="p-12 md:p-16 space-y-16 animate-in slide-in-from-top-4">
                   <div className="space-y-8">
                      <h3 className="text-xs font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-3"><BookOpen className="w-4 h-4" /> Coaching Schedule</h3>
                      <div className="flex flex-wrap gap-3">
                         {DAYS.map(day => (
                           <button key={day} onClick={() => handleToggleDay(day)} className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest border-2 transition-all ${routine.coachingDays.includes(day) ? 'bg-[#2b4c8c] border-[#2b4c8c] text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-indigo-200'}`}>{day}</button>
                         ))}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <TimeInput label="Coaching Start" value={routine.coachingStart} onChange={(v: string) => setRoutine({...routine, coachingStart: v})} />
                         <TimeInput label="Coaching End" value={routine.coachingEnd} onChange={(v: string) => setRoutine({...routine, coachingEnd: v})} />
                      </div>
                   </div>

                   <div className="space-y-8 pt-10 border-t border-slate-50">
                      <div className="flex justify-between items-center">
                         <h3 className="text-xs font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-3"><School className="w-4 h-4" /> School / College</h3>
                         <button onClick={() => setRoutine({...routine, hasSchool: !routine.hasSchool})} className={`w-14 h-7 rounded-full p-1 transition-all ${routine.hasSchool ? 'bg-emerald-500' : 'bg-slate-200'}`}><div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${routine.hasSchool ? 'translate-x-7' : 'translate-x-0'}`} /></button>
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

                   <button onClick={handleGenerateDaily} disabled={isGenerating} className="w-full py-6 bg-[#0a1128] text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-4 active:scale-95">
                      {isGenerating ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Zap className="w-6 h-6 text-yellow-400 fill-yellow-400" /> Generate Active Protocol</>}
                   </button>
                </div>
              ) : (
                <div className="p-8 bg-slate-50 flex flex-wrap gap-8 items-center border-t border-slate-100">
                   <div className="flex items-center gap-3"><div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-indigo-600"><Sun className="w-5 h-5" /></div><div><div className="text-[8px] font-black uppercase text-slate-400">Wake Up</div><div className="text-xs font-black">{routine.wakeUp}</div></div></div>
                   <div className="flex items-center gap-3"><div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-indigo-600"><GraduationCap className="w-5 h-5" /></div><div><div className="text-[8px] font-black uppercase text-slate-400">Coaching Days</div><div className="text-xs font-black">{routine.coachingDays.length} Days/Wk</div></div></div>
                   {routine.hasSchool && <div className="flex items-center gap-3"><div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-indigo-600"><School className="w-5 h-5" /></div><div><div className="text-[8px] font-black uppercase text-slate-400">School Session</div><div className="text-xs font-black">{routine.schoolStart} - {routine.schoolEnd}</div></div></div>}
                   <div className="ml-auto px-4 py-2 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-indigo-100"><Sparkles className="w-3 h-3" /> System Calibrated</div>
                </div>
              )}
           </div>

           {/* Generated Daily Schedule List */}
           {generatedSchedule.length > 0 && (
             <div className="space-y-10 animate-in slide-in-from-bottom-8">
                <div className="flex justify-between items-center px-4">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center"><CalendarDays className="w-6 h-6" /></div>
                      <div><h3 className="text-2xl font-black italic tracking-tight uppercase">Daily Timeline</h3><p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Calculated Focus Cycles</p></div>
                </div>
                <button onClick={() => setIsDailyConfigExpanded(true)} className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:underline"><RotateCcw className="w-3.5 h-3.5" /> Re-Calibrate Daily Logic</button>
                </div>
                
                <div className="relative pl-12 md:pl-20 space-y-10">
                   <div className="absolute left-6 md:left-10 top-0 bottom-0 w-1 bg-slate-100 rounded-full" />
                   {generatedSchedule.map((slot, i) => {
                     const IconComp = ICON_MAP[slot.iconId] || Clock;
                     return (
                       <div key={i} className="relative group">
                          <div className={`absolute -left-7 md:-left-11 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-4 border-white ring-2 ring-slate-100 transition-all ${slot.type === 'DEEP' ? 'bg-indigo-600 ring-indigo-100 scale-125 shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-slate-300'}`} />
                          <div className={`flex flex-col md:flex-row items-start md:items-center gap-8 p-8 rounded-[3rem] border transition-all ${slot.type === 'DEEP' ? 'bg-indigo-50 border-indigo-100 shadow-xl' : 'bg-white border-slate-100 hover:bg-slate-50'}`}>
                             <div className="w-24 shrink-0">
                                <div className="text-xl font-black text-slate-900 tracking-tight italic">{slot.time}</div>
                                <div className="text-[8px] font-black uppercase text-slate-400 tracking-widest mt-1">START POINT</div>
                             </div>
                             <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${slot.type === 'DEEP' ? 'bg-white text-indigo-600 border border-indigo-100' : 'bg-slate-50 text-slate-400'}`}>
                                <IconComp className="w-6 h-6" />
                             </div>
                             <div className="flex-1">
                                <h4 className="text-xl font-black italic tracking-tighter uppercase leading-none">{slot.label}</h4>
                                <div className="flex gap-4 mt-3">
                                   <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${slot.type === 'DEEP' ? 'bg-indigo-100 border-indigo-200 text-indigo-700' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>{slot.type} Task</span>
                                   <span className="text-[10px] font-bold text-slate-400 italic">Expected Duration: {slot.type === 'DEEP' ? '3h 15m' : '45m'}</span>
                                </div>
                             </div>
                          </div>
                       </div>
                     );
                   })}
                </div>
             </div>
           )}
        </div>
      ) : (
        <div className="space-y-10 animate-in slide-in-from-right duration-500">
           {/* Course Config Section */}
           <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-2xl overflow-hidden">
              <div className="p-10 bg-[#4f46e5] text-white flex justify-between items-center relative overflow-hidden cursor-pointer" onClick={() => setIsCourseConfigExpanded(!isCourseConfigExpanded)}>
                 <div className="absolute top-0 right-0 p-8 opacity-5"><Map className="w-32 h-32" /></div>
                 <div className="space-y-2 relative z-10">
                    <div className="flex items-center gap-4">
                       <Map className="w-8 h-8 text-indigo-200" />
                       <h2 className="text-3xl font-black italic tracking-tight uppercase">Master Roadmap Builder</h2>
                    </div>
                    <p className="text-indigo-100 text-sm font-medium">Synchronize syllabus distribution with your final target date.</p>
                 </div>
                 {roadmap.length > 0 && (
                   <div className="relative z-10">
                     {isCourseConfigExpanded ? <ChevronUp className="w-6 h-6" /> : <button className="px-6 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Re-generate Strategy</button>}
                   </div>
                 )}
              </div>

              {isCourseConfigExpanded ? (
                <div className="p-10 md:p-14 space-y-12 animate-in slide-in-from-top-4">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-3">
                         <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">Deployment Start Date</label>
                         <input type="date" value={planStartDate} onChange={(e) => setPlanStartDate(e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black italic outline-none focus:ring-4 focus:ring-indigo-100 transition-all shadow-inner" />
                      </div>
                      <div className="space-y-3">
                         <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">Target Exam (Target)</label>
                         <input type="date" value={targetExamDate} onChange={(e) => setTargetExamDate(e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black italic outline-none focus:ring-4 focus:ring-indigo-100 transition-all shadow-inner" />
                      </div>
                   </div>
                   <button onClick={generateMasterPlan} disabled={isGenerating} className="w-full py-6 bg-[#2b4c8c] text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:bg-[#1e3a8a] transition-all flex items-center justify-center gap-4 active:scale-95">
                      {isGenerating ? <Loader2 className="w-6 h-6 animate-spin" /> : <><CalendarCheck className="w-6 h-6" /> Calculate Syllabus Load</>}
                   </button>
                </div>
              ) : (
                <div className="p-8 bg-slate-50 flex flex-wrap gap-8 items-center border-t border-slate-100">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-indigo-600"><Calendar className="w-5 h-5" /></div>
                      <div><div className="text-[8px] font-black uppercase text-slate-400">Target</div><div className="text-xs font-black">{targetExamDate}</div></div>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-indigo-600"><TrendingUp className="w-5 h-5" /></div>
                      <div><div className="text-[8px] font-black uppercase text-slate-400">Plan Span</div><div className="text-xs font-black">{roadmap.length} Weeks Remaining</div></div>
                   </div>
                   <div className="ml-auto px-4 py-2 bg-emerald-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg"><CheckCircle2 className="w-3 h-3" /> Roadmap Operational</div>
                </div>
              )}
           </div>

           {/* Roadmap List */}
           {roadmap.length > 0 && (
             <div className="space-y-8 animate-in slide-in-from-bottom-8">
                <div className="flex justify-between items-center px-4">
                   <h3 className="text-2xl font-black italic text-slate-800 tracking-tight uppercase">Operational Roadmap</h3>
                   <button onClick={() => setIsCourseConfigExpanded(true)} className="flex items-center gap-2 text-[#2b4c8c] font-black text-[10px] uppercase tracking-widest hover:underline"><RotateCcw className="w-3.5 h-3.5" /> Modify Strategy Dates</button>
                </div>
                <div className="space-y-6">
                   {roadmap.map((week, idx) => (
                     <div key={idx} className={`bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm transition-all hover:shadow-xl group ${week.isDone ? 'opacity-60' : ''}`}>
                        <div className="p-8 flex flex-col md:flex-row justify-between items-center gap-8">
                           <div className="flex items-center gap-8">
                              <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black transition-all ${week.isDone ? 'bg-emerald-500 text-white shadow-xl' : 'bg-[#dbeafe] text-[#3b82f6]'}`}>
                                 <span className="text-[9px] uppercase tracking-tighter leading-none">Week</span>
                                 <span className="text-2xl leading-none">{week.weekNumber}</span>
                              </div>
                              <div className="space-y-1">
                                 <div className="flex items-center gap-4">
                                    <h4 className="text-xl font-black italic text-slate-800 tracking-tight">{week.startDate} - {week.endDate}</h4>
                                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${week.phase === 'LEARNING' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>{week.phase}</span>
                                 </div>
                                 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{week.chapters.length} Units Scheduled</p>
                              </div>
                           </div>
                           <button onClick={() => toggleWeekDone(idx)} className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 border-2 ${week.isDone ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}>
                             <Flag className="w-4 h-4" /> {week.isDone ? 'COMPLETED' : 'MARK DONE'}
                           </button>
                        </div>
                        <div className="px-8 pb-8 flex flex-wrap gap-3">
                           {week.chapters.length > 0 ? week.chapters.map((ch, ci) => (
                             <div key={ci} className={`px-5 py-2.5 rounded-2xl border text-[10px] font-black tracking-tight italic transition-all group-hover:scale-105 ${getSubjectColor(ch.subject)}`}>{ch.name}</div>
                           )) : <div className="text-[10px] font-black text-slate-300 italic tracking-widest uppercase py-2">System Buffer Week / Consolidation Phase</div>}
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
