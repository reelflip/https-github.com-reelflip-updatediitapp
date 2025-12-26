import React, { useState, useEffect, useRef } from 'react';
import { StudentData, Subject, Chapter, MockTest, ChapterStatus } from '../types';
import { 
  Search, ChevronRight, BookOpen, ArrowLeft, Target, 
  Play, Clock, Edit2, X, TrendingUp, Layers, ChevronDown, Activity
} from 'lucide-react';
import TestsView from './TestsView';

interface LearnModuleProps {
  data: StudentData;
  setData: (data: StudentData) => void;
}

const LearnModule: React.FC<LearnModuleProps> = ({ data, setData }) => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null);
  const [takingTest, setTakingTest] = useState<MockTest | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedUnits, setExpandedUnits] = useState<string[]>([]);
  const [activeContentTab, setActiveContentTab] = useState<'notes' | 'video' | 'practice'>('notes');
  const [editingStatusId, setEditingStatusId] = useState<string | null>(null);
  const [tempProgress, setTempProgress] = useState(0);

  // Persistence Refs
  const sessionDataRef = useRef({ notes: 0, video: 0, practice: 0 });
  const [sessionDisplay, setSessionDisplay] = useState(0);

  useEffect(() => {
    let interval: any;
    if (activeChapter && !takingTest) {
      interval = setInterval(() => {
        setSessionDisplay(prev => prev + 1);
        if (activeContentTab === 'notes') sessionDataRef.current.notes += 1;
        else if (activeContentTab === 'video') sessionDataRef.current.video += 1;
        else if (activeContentTab === 'practice') sessionDataRef.current.practice += 1;
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
      if (activeChapter) syncSessionToDatabase();
    };
  }, [activeChapter, takingTest, activeContentTab]);

  const syncSessionToDatabase = () => {
    if (!activeChapter) return;
    const updatedChapters = data.chapters.map(c => {
      if (c.id === activeChapter.id) {
        return {
          ...c,
          timeSpent: c.timeSpent + (sessionDataRef.current.notes + sessionDataRef.current.video + sessionDataRef.current.practice),
          timeSpentNotes: c.timeSpentNotes + sessionDataRef.current.notes,
          timeSpentVideos: c.timeSpentVideos + sessionDataRef.current.video,
          timeSpentPractice: c.timeSpentPractice + sessionDataRef.current.practice
        };
      }
      return c;
    });
    setData({ ...data, chapters: updatedChapters });
    sessionDataRef.current = { notes: 0, video: 0, practice: 0 };
    setSessionDisplay(0);
  };

  const groupedChapters = data.chapters.reduce((acc, chapter) => {
    if (selectedSubject && chapter.subject !== selectedSubject) return acc;
    if (!chapter.name.toLowerCase().includes(searchQuery.toLowerCase())) return acc;
    if (!acc[chapter.unit]) acc[chapter.unit] = [];
    acc[chapter.unit].push(chapter);
    return acc;
  }, {} as Record<string, Chapter[]>);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  };

  if (takingTest) {
    return <TestsView data={data} setData={setData} initialTest={takingTest} onExit={() => setTakingTest(null)} />;
  }

  if (activeChapter) {
    const chapterQuestions = data.questions.filter(q => q.topicId === activeChapter.id);
    return (
      <div className="max-w-7xl mx-auto space-y-6 animate-in slide-in-from-right duration-500 pb-20">
        <div className="flex items-center justify-between">
          <button onClick={() => { syncSessionToDatabase(); setActiveChapter(null); }} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Syllabus
          </button>
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-500 flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-500" /> Session Active: {formatTime(sessionDisplay)}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-xl space-y-8">
           <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-slate-100 pb-8">
              <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">{activeChapter.name}</h2>
                <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-2">{activeChapter.subject} • {activeChapter.unit}</div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => { setTempProgress(activeChapter.progress); setEditingStatusId(activeChapter.id); }} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Edit2 className="w-4 h-4" /> Update Progress</button>
              </div>
           </div>

           <div className="flex gap-4 p-1.5 bg-slate-50 rounded-2xl w-fit">
              {['notes', 'video', 'practice'].map((tab: any) => (
                <button key={tab} onClick={() => setActiveContentTab(tab)} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeContentTab === tab ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>
                  {tab === 'notes' ? 'Theory' : tab === 'video' ? 'Lecture' : 'Practice'}
                </button>
              ))}
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
             <div className="lg:col-span-8">
               {activeContentTab === 'notes' && <div className="p-10 bg-[#fcfaf7] rounded-[2rem] border border-slate-200 min-h-[400px] italic text-slate-600">Deep Work: Reading theoretical core concepts... (Data auto-syncs)</div>}
               {activeContentTab === 'video' && <div className="aspect-video bg-slate-900 rounded-[2rem] flex items-center justify-center text-white/50 flex-col gap-4"><Play className="w-12 h-12" /><span className="text-xs font-black uppercase">Lecture Stream Active</span></div>}
               {activeContentTab === 'practice' && (
                 <div className="space-y-4">
                    {chapterQuestions.map((q, idx) => (
                      <div key={q.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="font-bold text-slate-700">Q{idx+1}: {q.text}</div>
                      </div>
                    ))}
                 </div>
               )}
             </div>
             <div className="lg:col-span-4 bg-indigo-50 p-8 rounded-[2rem] border border-indigo-100 space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-indigo-600 flex items-center gap-2"><Activity className="w-4 h-4" /> Effort Log</h3>
                <div className="space-y-4">
                   <div className="flex justify-between text-[10px] font-black uppercase text-slate-500"><span>Theoretical</span><span>{formatTime(activeChapter.timeSpentNotes + (activeContentTab === 'notes' ? sessionDisplay : 0))}</span></div>
                   <div className="flex justify-between text-[10px] font-black uppercase text-slate-500"><span>Visuals</span><span>{formatTime(activeChapter.timeSpentVideos + (activeContentTab === 'video' ? sessionDisplay : 0))}</span></div>
                   <div className="flex justify-between text-[10px] font-black uppercase text-slate-500"><span>Solving</span><span>{formatTime(activeChapter.timeSpentPractice + (activeContentTab === 'practice' ? sessionDisplay : 0))}</span></div>
                </div>
             </div>
           </div>
        </div>

        {editingStatusId && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setEditingStatusId(null)}></div>
            <div className="bg-white w-full max-w-md p-10 rounded-[3rem] shadow-2xl relative z-10">
               <h3 className="text-xl font-black text-slate-900 text-center mb-8">Override Progress</h3>
               <input type="range" min="0" max="100" step="5" value={tempProgress} onChange={(e) => setTempProgress(parseInt(e.target.value))} className="w-full h-2 bg-slate-100 rounded-full appearance-none accent-indigo-600 mb-6" />
               <div className="text-center text-3xl font-black text-indigo-600 mb-8">{tempProgress}%</div>
               <button onClick={() => {
                 const updated = data.chapters.map(c => c.id === editingStatusId ? {...c, progress: tempProgress, status: tempProgress === 100 ? 'COMPLETED' : 'LEARNING' as ChapterStatus} : c);
                 setData({...data, chapters: updated});
                 setEditingStatusId(null);
               }} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest">Apply Metrics</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-50/30">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Filter units..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-600" />
          </div>
          <div className="flex gap-2">
             {['Physics', 'Chemistry', 'Mathematics'].map((s: any) => (
               <button key={s} onClick={() => setSelectedSubject(s === selectedSubject ? null : s)} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${selectedSubject === s ? 'bg-slate-900 border-slate-900 text-white shadow-xl' : 'bg-white border-slate-200 text-slate-500'}`}>{s}</button>
             ))}
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {/* Fix: Explicitly cast Object.entries to resolve type inference error on 'chapters' being 'unknown' */}
          {(Object.entries(groupedChapters) as [string, Chapter[]][]).map(([unit, chapters]) => (
            <div key={unit}>
              <button onClick={() => setExpandedUnits(prev => prev.includes(unit) ? prev.filter(u => u !== unit) : [...prev, unit])} className="w-full px-10 py-8 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <Layers className="w-6 h-6 text-slate-400" />
                  <h3 className="font-black text-xl text-slate-800">{unit}</h3>
                </div>
                <ChevronDown className={`transition-transform ${expandedUnits.includes(unit) ? 'rotate-180' : ''}`} />
              </button>
              {expandedUnits.includes(unit) && (
                <div className="bg-slate-50/50 px-10 pb-8 space-y-2">
                  {chapters.map(c => (
                    <div key={c.id} onClick={() => setActiveChapter(c)} className="p-5 bg-white border border-slate-200 rounded-2xl hover:border-indigo-400 cursor-pointer flex justify-between items-center">
                       <div className="font-bold text-slate-800">{c.name}</div>
                       <div className="text-[10px] font-black text-indigo-600">{c.progress}%</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearnModule;