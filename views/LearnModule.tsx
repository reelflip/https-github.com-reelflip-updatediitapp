
import React, { useState, useRef, useMemo } from 'react';
import { StudentData, Subject, Chapter, MockTest, ChapterStatus, TestResult } from '../types';
import { 
  Search, ChevronRight, BookOpen, ArrowLeft, Target, 
  Video, History, Award, Clock, Layers, X, PlayCircle,
  CheckCircle, ChevronDown, BarChart3, Timer, PieChart as PieIcon, Activity, TrendingUp, Zap
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as ReTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
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
  const [activeContentTab, setActiveContentTab] = useState<'notes' | 'video' | 'practice' | 'history' | 'analytics'>('notes');
  
  const handleFinish = () => {
    if (!activeChapter) return;
    const chapters = data.chapters || [];
    const updatedChapters = chapters.map(c => 
      c.id === activeChapter.id ? { ...c, progress: 100, status: 'COMPLETED' as ChapterStatus } : c
    );
    setData({ ...data, chapters: updatedChapters });
    setActiveChapter(null);
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    try {
      if (url.includes('youtube.com/watch?v=')) return url.replace('watch?v=', 'embed/');
      if (url.includes('youtu.be/')) return url.replace('youtu.be/', 'youtube.com/embed/');
      return url;
    } catch(e) { return url; }
  };

  if (takingTest) return <TestsView data={data} setData={setData} initialTest={takingTest} onExit={() => setTakingTest(null)} />;

  if (activeChapter) {
    const questions = data.questions || [];
    const history = data.testHistory || [];
    const chapterQuestions = questions.filter(q => q.topicId === activeChapter.id);
    const chapterHistory = history.filter(t => (t.chapterIds || []).includes(activeChapter.id));
    const videoEmbed = getEmbedUrl(activeChapter.videoUrl || '');

    const startChapterPractice = () => {
      const qIds = chapterQuestions.slice(0, 20).map(q => q.id);
      setTakingTest({
        id: `chapter-drill-${activeChapter.id}`,
        name: `Mastery Challenge: ${activeChapter.name}`,
        duration: 40,
        totalMarks: qIds.length * 4,
        category: 'PRACTICE',
        difficulty: 'MIXED',
        questionIds: qIds,
        chapterIds: [activeChapter.id]
      });
    };

    const timeData = [
      { name: 'Theory', value: activeChapter.timeSpentNotes || 0, color: '#6366f1' },
      { name: 'Video', value: activeChapter.timeSpentVideos || 0, color: '#f59e0b' },
      { name: 'Practice', value: activeChapter.timeSpentPractice || 0, color: '#10b981' },
      { name: 'Tests', value: activeChapter.timeSpentTests || 0, color: '#ef4444' }
    ].filter(d => d.value > 0);
    const totalChapterTime = (activeChapter.timeSpent || 0) / 60;
    const stabilityIndex = activeChapter.accuracy > 0 ? Math.round((activeChapter.accuracy * 0.8) + (activeChapter.progress * 0.2)) : 0;

    return (
      <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1.5">
            <button onClick={() => setActiveChapter(null)} className="flex items-center gap-2 text-[9px] font-black uppercase text-indigo-600 tracking-widest hover:gap-4 transition-all">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Syllabus
            </button>
            <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">{activeChapter.name}</h2>
            <div className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">{activeChapter.subject} • {activeChapter.unit}</div>
          </div>
          
          <div className="flex p-1 bg-white rounded-xl md:rounded-2xl border border-slate-200 shadow-sm overflow-x-auto w-full md:w-auto hide-scrollbar">
            {[
              { id: 'notes', label: 'Theory', icon: BookOpen },
              { id: 'video', label: 'Lecture', icon: Video },
              { id: 'practice', label: 'Drills', icon: Target },
              { id: 'history', label: 'History', icon: History },
              { id: 'analytics', label: 'Telemetry', icon: BarChart3 }
            ].map((tab: any) => (
              <button 
                key={tab.id}
                onClick={() => setActiveContentTab(tab.id)}
                className={`flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 rounded-lg md:rounded-xl text-[8px] md:text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap active:scale-95 ${activeContentTab === tab.id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <tab.icon className="w-3 h-3" /> {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl md:rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden min-h-[50vh]">
          {activeContentTab === 'notes' ? (
            <div className="p-6 md:p-16">
               <div className="max-w-4xl mx-auto prose prose-slate max-w-none prose-headings:font-black prose-headings:italic prose-headings:tracking-tighter prose-headings:text-2xl md:prose-headings:text-3xl prose-p:text-base md:prose-p:text-lg prose-p:font-medium prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600 prose-li:font-medium prose-strong:text-indigo-600 animate-in slide-in-from-bottom-4" dangerouslySetInnerHTML={{ __html: activeChapter.notes || '<p class="text-slate-300 italic">No data found.</p>' }} />
               <div className="mt-12 pt-8 border-t border-slate-100 flex justify-center">
                  <button onClick={handleFinish} className="w-full md:w-auto px-10 py-4 bg-emerald-500 text-white rounded-xl md:rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 flex items-center justify-center gap-3">Mark Completed <CheckCircle className="w-4 h-4" /></button>
               </div>
            </div>
          ) : activeContentTab === 'video' ? (
            <div className="p-4 md:p-16 flex flex-col items-center justify-center animate-in zoom-in-95">
               <div className="w-full max-w-5xl aspect-video bg-slate-900 rounded-xl md:rounded-[2.5rem] shadow-2xl relative overflow-hidden flex items-center justify-center text-white/50 border-4 md:border-8 border-slate-50">
                  {videoEmbed ? <iframe src={videoEmbed} className="absolute inset-0 w-full h-full" allowFullScreen></iframe> : <div className="text-center space-y-4"><Video className="w-12 h-12 mx-auto text-slate-800" /><p className="text-[9px] font-black uppercase tracking-widest text-slate-600 italic">No Media linked</p></div>}
               </div>
            </div>
          ) : activeContentTab === 'practice' ? (
            <div className="p-6 md:p-16 animate-in slide-in-from-bottom-4">
               <div className="max-w-5xl mx-auto py-8">
                  <div className="bg-indigo-900 rounded-2xl md:rounded-[3rem] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-[4s]"><Target className="w-32 md:w-48 h-32 md:h-48" /></div>
                     <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="space-y-3 text-center md:text-left">
                           <div className="inline-flex px-3 py-1 bg-white/10 border border-white/20 rounded-full text-[8px] font-black uppercase tracking-widest">Mastery Challenge</div>
                           <h3 className="text-2xl md:text-4xl font-black italic tracking-tighter uppercase leading-none">20 Question <br className="hidden md:block" /><span className="text-indigo-400">Drill session.</span></h3>
                        </div>
                        <button onClick={startChapterPractice} className="w-full md:w-auto px-10 py-4 bg-[#82c341] text-white rounded-xl md:rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 flex items-center justify-center gap-4">Start Practice <PlayCircle className="w-5 h-5" /></button>
                     </div>
                  </div>
               </div>
            </div>
          ) : activeContentTab === 'analytics' ? (
            <div className="p-6 md:p-16 animate-in slide-in-from-bottom-4 space-y-8 md:space-y-12">
               <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                  <div className="bg-slate-50 p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-slate-100 flex flex-col justify-between group">
                     <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm mb-4"><Timer className="w-5 h-5" /></div>
                     <div><div className="text-[8px] font-black uppercase text-slate-400 mb-0.5">Effort</div><div className="text-xl md:text-3xl font-black text-slate-800 italic">{Math.round(totalChapterTime)}m</div></div>
                  </div>
                  <div className="bg-slate-50 p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-slate-100 flex flex-col justify-between">
                     <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl flex items-center justify-center text-emerald-500 shadow-sm mb-4"><Activity className="w-5 h-5" /></div>
                     <div><div className="text-[8px] font-black uppercase text-slate-400 mb-0.5">Stability</div><div className="text-xl md:text-3xl font-black text-slate-800 italic">{stabilityIndex}%</div></div>
                  </div>
               </div>
            </div>
          ) : (
            <div className="p-6 md:p-16 animate-in fade-in">
               <div className="max-w-4xl mx-auto space-y-6">
                  <h3 className="text-xl md:text-2xl font-black italic uppercase text-slate-800">History</h3>
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-inner overflow-hidden">
                     {chapterHistory.length === 0 ? <div className="py-20 text-center text-slate-300 font-black uppercase text-[8px] tracking-widest italic">No drill data.</div> : 
                     <div className="divide-y divide-slate-50">{chapterHistory.map((res, idx) => (
                        <div key={idx} className="p-6 flex justify-between items-center hover:bg-slate-50 transition-colors">
                           <div><div className="font-black text-slate-800 text-xs md:text-sm italic line-clamp-1">{res.testName}</div><div className="text-[7px] md:text-[8px] font-black uppercase text-slate-400 mt-0.5">{res.date}</div></div>
                           <div className="text-right font-black text-indigo-600 text-sm md:text-lg">{res.accuracy}%</div>
                        </div>
                     ))}</div>}
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const groupedChapters = (data.chapters || []).reduce((acc, chapter) => {
    if (selectedSubject && chapter.subject !== selectedSubject) return acc;
    if (!chapter.name.toLowerCase().includes(searchQuery.toLowerCase())) return acc;
    if (!acc[chapter.unit]) acc[chapter.unit] = [];
    acc[chapter.unit].push(chapter);
    return acc;
  }, {} as Record<string, Chapter[]>);

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="bg-white rounded-2xl md:rounded-[4rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 md:p-10 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-50/30">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search syllabus units..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3.5 md:py-5 bg-white border border-slate-200 rounded-xl md:rounded-3xl text-sm font-black focus:ring-4 focus:ring-indigo-50 transition-all outline-none" />
          </div>
          <div className="flex gap-2 p-1 bg-white rounded-xl border border-slate-100 overflow-x-auto w-full md:w-auto hide-scrollbar">
             {['Physics', 'Chemistry', 'Mathematics'].map((s: any) => (
               <button key={s} onClick={() => setSelectedSubject(s === selectedSubject ? null : s)} className={`px-6 md:px-8 py-2 md:py-3 rounded-lg md:rounded-xl text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap active:scale-95 ${selectedSubject === s ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-700'}`}>{s}</button>
             ))}
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {Object.keys(groupedChapters).length === 0 ? <div className="p-20 text-center text-slate-300 font-black uppercase text-[10px] italic tracking-widest">No matching units found.</div> : 
            (Object.entries(groupedChapters) as [string, Chapter[]][]).map(([unit, chapters]) => {
              const unitAvgProgress = Math.round(chapters.reduce((acc, c) => acc + (c.progress || 0), 0) / chapters.length);
              const isExpanded = expandedUnits.includes(unit);
              return (
                <div key={unit}>
                  <button onClick={() => setExpandedUnits(prev => isExpanded ? prev.filter(u => u !== unit) : [...prev, unit])} className="w-full px-5 md:px-12 py-6 md:py-10 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                    <div className="flex items-center gap-4 md:gap-6 text-left flex-1 min-w-0">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all shrink-0"><Layers className="w-5 h-5 md:w-6 md:h-6" /></div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-black text-lg md:text-2xl text-slate-800 italic tracking-tight line-clamp-1 uppercase">{unit}</h3>
                        <div className="flex items-center gap-2 md:gap-3 mt-0.5">
                          <div className="w-16 md:w-24 h-1 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-emerald-500" style={{ width: `${unitAvgProgress}%` }}></div></div>
                          <span className="text-[7px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">{unitAvgProgress}% COMPLETED</span>
                        </div>
                      </div>
                    </div>
                    <ChevronDown className={`transition-transform duration-500 shrink-0 text-slate-300 ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                  {isExpanded && (
                    <div className="bg-slate-50/50 px-4 md:px-12 pb-6 md:pb-10 space-y-2 md:space-y-3 animate-in slide-in-from-top-2">
                      {chapters.map(c => (
                        <div key={c.id} onClick={() => { setActiveChapter(c); setActiveContentTab('notes'); }} className="p-4 md:p-6 bg-white border border-slate-200 rounded-xl md:rounded-[2rem] hover:border-indigo-300 hover:shadow-lg cursor-pointer flex justify-between items-center transition-all group/item active:scale-[0.98]">
                           <div className="flex items-center gap-4 md:gap-6 min-w-0 flex-1">
                              <div className="relative shrink-0 w-10 md:w-12 h-10 md:h-12 flex items-center justify-center">
                                <svg className="w-full h-full -rotate-90 absolute">
                                  <circle cx="50%" cy="50%" r="40%" fill="transparent" stroke="#f1f5f9" strokeWidth="2.5" />
                                  <circle cx="50%" cy="50%" r="40%" fill="transparent" stroke={c.progress === 100 ? '#10b981' : '#6366f1'} strokeWidth="2.5" strokeDasharray="100 100" strokeDashoffset={100 - (c.progress || 0)} pathLength="100" strokeLinecap="round" className="transition-all duration-1000" />
                                </svg>
                                <span className="text-[7px] md:text-[9px] font-black text-slate-900 relative">{c.progress || 0}%</span>
                              </div>
                              <div className="min-w-0">
                                 <div className="font-black text-slate-800 group-hover/item:text-indigo-600 transition-colors italic tracking-tight text-sm md:text-base truncate">{c.name}</div>
                                 <div className="text-[7px] md:text-[9px] font-black uppercase text-slate-400 mt-0.5">Acc: {c.accuracy || 0}% {c.status === 'COMPLETED' && '• Mastered'}</div>
                              </div>
                           </div>
                           <ChevronRight className="w-5 h-5 text-slate-200 group-hover/item:text-indigo-600 transition-all" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          }
        </div>
      </div>
    </div>
  );
};

export default LearnModule;
