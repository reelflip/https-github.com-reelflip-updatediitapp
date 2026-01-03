
import React, { useState, useRef, useMemo } from 'react';
import { StudentData, Subject, Chapter, MockTest, ChapterStatus, TestResult } from '../types';
import { 
  Search, ChevronRight, BookOpen, ArrowLeft, Target, 
  Video, History, Award, Clock, Layers, X, PlayCircle,
  CheckCircle, ChevronDown
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
  const [activeContentTab, setActiveContentTab] = useState<'notes' | 'video' | 'practice' | 'history'>('notes');
  
  const handleFinish = () => {
    if (!activeChapter) return;
    const updatedChapters = data.chapters.map(c => 
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

  if (takingTest) {
    return <TestsView data={data} setData={setData} initialTest={takingTest} onExit={() => setTakingTest(null)} />;
  }

  // --- CHAPTER VIEW (INLINE) ---
  if (activeChapter) {
    const chapterQuestions = data.questions.filter(q => q.topicId === activeChapter.id);
    const chapterHistory = data.testHistory.filter(t => t.category === 'PRACTICE' && t.chapterIds.includes(activeChapter.id));
    const videoEmbed = getEmbedUrl(activeChapter.videoUrl || '');

    const startChapterPractice = () => {
      const qIds = chapterQuestions.map(q => q.id);
      setTakingTest({
        id: `chapter-drill-${activeChapter.id}`,
        name: `Chapter Practice: ${activeChapter.name}`,
        duration: Math.max(15, qIds.length * 2), 
        totalMarks: qIds.length * 4,
        category: 'PRACTICE',
        difficulty: 'MIXED',
        questionIds: qIds,
        chapterIds: [activeChapter.id]
      });
    };

    return (
      <div className="space-y-8 animate-in fade-in duration-500 pb-20">
        {/* Breadcrumb & Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <button onClick={() => setActiveChapter(null)} className="flex items-center gap-2 text-[10px] font-black uppercase text-indigo-600 tracking-widest hover:gap-4 transition-all">
              <ArrowLeft className="w-4 h-4" /> Back to Syllabus
            </button>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">{activeChapter.name}</h2>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{activeChapter.subject} • {activeChapter.unit}</div>
          </div>
          
          <div className="flex p-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto w-full md:w-auto">
            {[
              { id: 'notes', label: 'Theory', icon: BookOpen },
              { id: 'video', label: 'Lecture', icon: Video },
              { id: 'practice', label: 'Drills', icon: Target },
              { id: 'history', label: 'History', icon: History }
            ].map((tab: any) => (
              <button 
                key={tab.id}
                onClick={() => setActiveContentTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeContentTab === tab.id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <tab.icon className="w-3.5 h-3.5" /> {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Region */}
        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden min-h-[60vh]">
          {activeContentTab === 'notes' ? (
            <div className="p-8 md:p-16">
               <div className="max-w-4xl mx-auto prose prose-slate max-w-none prose-headings:font-black prose-headings:italic prose-headings:tracking-tighter prose-p:text-lg prose-p:font-medium prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600 prose-li:font-medium prose-strong:text-indigo-600 animate-in slide-in-from-bottom-4" dangerouslySetInnerHTML={{ __html: activeChapter.notes || '' }} />
               <div className="mt-16 pt-10 border-t border-slate-100 flex justify-center">
                  <button onClick={handleFinish} className="px-12 py-5 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-emerald-600 transition-all flex items-center gap-3">
                    Mark Chapter as Completed <CheckCircle className="w-5 h-5" />
                  </button>
               </div>
            </div>
          ) : activeContentTab === 'video' ? (
            <div className="p-8 md:p-16 flex flex-col items-center justify-center animate-in zoom-in-95">
               <div className="w-full max-w-5xl aspect-video bg-slate-900 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex items-center justify-center text-white/50 border-8 border-slate-50 shadow-inner">
                  {videoEmbed ? (
                    <iframe src={videoEmbed} className="absolute inset-0 w-full h-full" allowFullScreen></iframe>
                  ) : (
                    <div className="text-center space-y-4">
                       <Video className="w-16 h-16 mx-auto text-slate-800" />
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 italic">No Media Source Linked</p>
                    </div>
                  )}
               </div>
            </div>
          ) : activeContentTab === 'practice' ? (
            <div className="p-8 md:p-16 animate-in slide-in-from-bottom-4">
               <div className="max-w-5xl mx-auto space-y-12">
                  <div className="bg-indigo-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-[4s]"><Target className="w-48 h-48" /></div>
                     <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                        <div className="space-y-4 text-center md:text-left">
                           <div className="inline-flex px-4 py-1 bg-white/10 border border-white/20 rounded-full text-[9px] font-black uppercase tracking-widest">Single Practice Session</div>
                           <h3 className="text-4xl font-black italic tracking-tighter uppercase leading-none">Chapter Mastery <br /><span className="text-indigo-400">Drill Engine.</span></h3>
                           <div className="flex gap-6 justify-center md:justify-start">
                              <div className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2"><Clock className="w-4 h-4 text-indigo-400" /> {chapterQuestions.length * 2} Minutes</div>
                              <div className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2"><Layers className="w-4 h-4 text-indigo-400" /> {chapterQuestions.length} Problems</div>
                           </div>
                        </div>
                        <button onClick={startChapterPractice} className="px-12 py-5 bg-[#82c341] text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4">
                           Start Full Drill <PlayCircle className="w-6 h-6" />
                        </button>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <h3 className="text-lg font-black italic tracking-tighter uppercase text-slate-400 px-4">Problem Bank Preview</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {chapterQuestions.map((q, idx) => (
                           <div key={q.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group">
                              <div className="flex items-center gap-6">
                                 <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-xs text-slate-300 border border-slate-100 shadow-inner">{idx + 1}</div>
                                 <div className="text-sm font-bold text-slate-800 italic leading-tight line-clamp-1">{q.text}</div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-indigo-400 transition-colors" />
                           </div>
                         ))}
                     </div>
                  </div>
               </div>
            </div>
          ) : (
            <div className="p-8 md:p-16 animate-in fade-in">
               <div className="max-w-4xl mx-auto space-y-12">
                  <h3 className="text-2xl font-black italic tracking-tighter uppercase text-slate-800">Practice History</h3>
                  <div className="bg-white rounded-[3rem] border border-slate-100 shadow-inner overflow-hidden">
                     {chapterHistory.length === 0 ? (
                       <div className="py-32 text-center text-slate-300 font-black uppercase text-[10px] tracking-widest italic">No historical drill data found.</div>
                     ) : (
                       <div className="divide-y divide-slate-50">
                          {chapterHistory.map((res, idx) => (
                            <div key={idx} className="p-8 flex justify-between items-center hover:bg-slate-50/50 transition-colors">
                               <div className="flex items-center gap-6">
                                  <div className="w-12 h-12 bg-indigo-50 text-indigo-400 rounded-2xl flex items-center justify-center"><Award className="w-6 h-6" /></div>
                                  <div>
                                     <div className="font-black text-slate-800 italic">{res.testName}</div>
                                     <div className="text-[9px] font-black uppercase text-slate-400 tracking-widest mt-1">{res.date} • {res.accuracy}% Accuracy</div>
                                  </div>
                               </div>
                               <div className="text-right">
                                  <div className="text-2xl font-black text-slate-900">{res.score}<span className="text-xs text-slate-300 ml-1">/ {res.totalMarks}</span></div>
                                  <div className="text-[8px] font-black uppercase text-slate-400 tracking-widest mt-1">Accuracy Stability</div>
                               </div>
                            </div>
                          ))}
                       </div>
                     )}
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- SYLLABUS LIST VIEW (STANDARD) ---
  const groupedChapters = data.chapters.reduce((acc, chapter) => {
    if (selectedSubject && chapter.subject !== selectedSubject) return acc;
    if (!chapter.name.toLowerCase().includes(searchQuery.toLowerCase())) return acc;
    if (!acc[chapter.unit]) acc[chapter.unit] = [];
    acc[chapter.unit].push(chapter);
    return acc;
  }, {} as Record<string, Chapter[]>);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="bg-white rounded-3xl md:rounded-[4rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 md:p-10 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-50/30">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search syllabus units..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-3xl text-sm font-black focus:ring-4 focus:ring-indigo-100 transition-all shadow-sm outline-none" />
          </div>
          <div className="flex gap-2 p-1.5 bg-white rounded-2xl border border-slate-100 overflow-x-auto w-full md:w-auto">
             {['Physics', 'Chemistry', 'Mathematics'].map((s: any) => (
               <button key={s} onClick={() => setSelectedSubject(s === selectedSubject ? null : s)} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${selectedSubject === s ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-700'}`}>{s}</button>
             ))}
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {/* Explicitly cast Object.entries to fix 'unknown' type inference error on 'chapters' variable */}
          {(Object.entries(groupedChapters) as [string, Chapter[]][]).map(([unit, chapters]) => {
            const unitAvgProgress = Math.round(chapters.reduce((acc, c) => acc + c.progress, 0) / chapters.length);
            return (
              <div key={unit}>
                <button onClick={() => setExpandedUnits(prev => prev.includes(unit) ? prev.filter(u => u !== unit) : [...prev, unit])} className="w-full px-8 md:px-12 py-10 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-6 text-left flex-1 min-w-0">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all shadow-inner shrink-0">
                      <Layers className="w-6 h-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-black text-2xl text-slate-800 italic tracking-tight leading-tight uppercase">{unit}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: `${unitAvgProgress}%` }}></div>
                        </div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{unitAvgProgress}% COMPLETION</span>
                      </div>
                    </div>
                  </div>
                  <ChevronDown className={`transition-transform duration-500 shrink-0 ${expandedUnits.includes(unit) ? 'rotate-180' : ''}`} />
                </button>
                {expandedUnits.includes(unit) && (
                  <div className="bg-slate-50/50 px-6 md:px-12 pb-10 space-y-3 animate-in slide-in-from-top-4">
                    {chapters.map(c => (
                      <div key={c.id} onClick={() => { setActiveChapter(c); setActiveContentTab('notes'); }} className="p-6 bg-white border border-slate-200 rounded-[2rem] hover:border-indigo-400 hover:shadow-xl cursor-pointer flex justify-between items-center transition-all group/item">
                         <div className="flex items-center gap-6 min-w-0 flex-1">
                            <div className="relative shrink-0">
                              <svg className="w-12 h-12 -rotate-90">
                                <circle cx="50%" cy="50%" r="40%" fill="transparent" stroke="#f1f5f9" strokeWidth="3" />
                                <circle cx="50%" cy="50%" r="40%" fill="transparent" stroke={c.progress === 100 ? '#10b981' : '#6366f1'} strokeWidth="3" strokeDasharray="100 100" strokeDashoffset={100 - c.progress} pathLength="100" strokeLinecap="round" className="transition-all duration-1000" />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center"><span className="text-[9px] font-black text-slate-900">{c.progress}%</span></div>
                            </div>
                            <div className="min-w-0">
                               <div className="font-black text-slate-800 group-hover/item:text-indigo-600 transition-colors italic tracking-tight text-base truncate">{c.name}</div>
                               <div className="flex gap-3 mt-0.5">
                                  <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Accuracy: {c.accuracy}%</div>
                                  {c.status === 'COMPLETED' && <div className="text-[10px] font-black uppercase text-emerald-500 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Mastered</div>}
                               </div>
                            </div>
                         </div>
                         <ChevronRight className="w-6 h-6 text-slate-200 group-hover/item:text-indigo-600 transition-all" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LearnModule;
