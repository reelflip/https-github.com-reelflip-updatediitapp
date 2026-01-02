
import React, { useState, useEffect, useRef } from 'react';
import { StudentData, Subject, Chapter, MockTest, ChapterStatus } from '../types';
import { 
  Search, ChevronRight, BookOpen, ArrowLeft, Target, 
  Play, Clock, Edit2, X, TrendingUp, Layers, ChevronDown, Activity, Zap, Video, CheckCircle
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

  const calculateConfidence = (chapter: Chapter) => {
    const score = Math.round((chapter.accuracy * 0.7) + (chapter.progress * 0.3));
    if (score > 85) return { label: 'High', color: 'text-emerald-500' };
    if (score > 60) return { label: 'Moderate', color: 'text-indigo-500' };
    return { label: 'Low', color: 'text-rose-500' };
  };

  const syncSessionToDatabase = () => {
    if (!activeChapter) return;
    const updatedChapters = data.chapters.map(c => {
      if (c.id === activeChapter.id) {
        return {
          ...c,
          timeSpent: (c.timeSpent || 0) + (sessionDataRef.current.notes + sessionDataRef.current.video + sessionDataRef.current.practice),
          timeSpentNotes: (c.timeSpentNotes || 0) + sessionDataRef.current.notes,
          timeSpentVideos: (c.timeSpentVideos || 0) + sessionDataRef.current.video,
          timeSpentPractice: (c.timeSpentPractice || 0) + sessionDataRef.current.practice,
          timeSpentTests: c.timeSpentTests || 0
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

  if (activeChapter) {
    const chapterQuestions = data.questions.filter(q => q.topicId === activeChapter.id);
    const conf = calculateConfidence(activeChapter);
    const videoEmbed = getEmbedUrl(activeChapter.videoUrl || '');
    
    return (
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6 animate-in slide-in-from-right duration-500 pb-20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <button onClick={() => { syncSessionToDatabase(); setActiveChapter(null); }} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-black text-[10px] md:text-xs uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4" /> Back to Syllabus
          </button>
          <div className="bg-white px-4 md:px-6 py-2 md:py-2.5 rounded-xl md:rounded-2xl border border-slate-200 text-[10px] md:text-xs font-black text-slate-500 flex items-center gap-3 shadow-sm whitespace-nowrap">
            <Clock className="w-4 h-4 text-indigo-500" /> Active: {formatTime(sessionDisplay)}
          </div>
        </div>

        <div className="bg-white p-6 md:p-10 rounded-3xl md:rounded-[4rem] border border-slate-200 shadow-xl space-y-8 md:space-y-10">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-100 pb-8 md:pb-10">
              <div className="space-y-2">
                <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter italic leading-tight">{activeChapter.name}</h2>
                <div className="flex items-center gap-3">
                   <div className="text-[8px] md:text-[10px] font-black uppercase text-slate-400 tracking-widest">{activeChapter.subject} • {activeChapter.unit}</div>
                   <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest bg-slate-100 text-slate-500`}>{activeChapter.status?.replace('_', ' ')}</div>
                </div>
              </div>
              <button onClick={() => { setTempProgress(activeChapter.progress); setEditingStatusId(activeChapter.id); }} className="w-full md:w-auto bg-slate-900 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl hover:bg-indigo-600 transition-all"><Edit2 className="w-4 h-4" /> Update Progress</button>
           </div>

           <div className="flex gap-2 md:gap-4 p-1.5 md:p-2 bg-slate-50 rounded-xl md:rounded-2xl w-full sm:w-fit overflow-x-auto whitespace-nowrap">
              {[
                { id: 'notes', label: 'Theory', icon: BookOpen },
                { id: 'video', label: 'Lecture', icon: Play },
                { id: 'practice', label: 'Drills', icon: Target }
              ].map((tab: any) => (
                <button 
                  key={tab.id} 
                  onClick={() => setActiveContentTab(tab.id)} 
                  className={`flex-1 sm:flex-none px-4 md:px-8 py-2.5 md:py-3 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeContentTab === tab.id ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <tab.icon className="w-3.5 h-3.5 md:w-4 md:h-4" /> {tab.label}
                </button>
              ))}
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
             <div className="lg:col-span-8">
               {activeContentTab === 'notes' && (
                 <div className="p-6 md:p-12 bg-white rounded-2xl md:rounded-[3rem] border border-slate-100 min-h-[400px] md:min-h-[500px] space-y-6 md:space-y-8 animate-in fade-in">
                    <div className="flex items-center gap-3 md:gap-4 text-[9px] md:text-[10px] font-black uppercase text-indigo-500 tracking-[0.3em]">
                       <BookOpen className="w-4 h-4 md:w-5 md:h-5" /> Detailed Study Module
                    </div>
                    <div className="prose prose-sm md:prose-slate max-w-none">
                       {activeChapter.notes ? (
                         <div className="text-slate-600 font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: activeChapter.notes }} />
                       ) : (
                         <div className="py-20 border-2 border-dashed border-slate-50 rounded-2xl flex flex-col items-center justify-center text-slate-200">
                           <BookOpen className="w-12 h-12 mb-4" />
                           <p className="text-[9px] font-black uppercase tracking-widest">Interactive Notes Loading...</p>
                         </div>
                       )}
                    </div>
                 </div>
               )}
               {activeContentTab === 'video' && (
                 <div className="aspect-video bg-slate-900 rounded-2xl md:rounded-[3rem] flex items-center justify-center text-white/50 flex-col gap-6 shadow-2xl relative overflow-hidden animate-in zoom-in-95">
                    {videoEmbed ? (
                      <iframe 
                        src={videoEmbed} 
                        className="absolute inset-0 w-full h-full" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent"></div>
                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20">
                          <Video className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-center relative z-10 space-y-1">
                           <span className="text-[10px] font-black uppercase tracking-[0.4em]">Lecture Unlinked</span>
                           <p className="text-[8px] font-bold text-slate-500 uppercase italic">Awaiting media established</p>
                        </div>
                      </>
                    )}
                 </div>
               )}
               {activeContentTab === 'practice' && (
                 <div className="space-y-8 md:space-y-12 animate-in slide-in-from-bottom-4">
                    <div className="space-y-6">
                       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-2">
                          <h3 className="text-lg md:text-xl font-black italic text-slate-800">Chapter Drills ({chapterQuestions.length})</h3>
                          <div className="text-[9px] md:text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl whitespace-nowrap">Goal: 90% Accuracy</div>
                       </div>
                       <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                           {chapterQuestions.map((q, idx) => (
                             <div key={q.id} className="p-6 md:p-8 bg-slate-50 rounded-2xl md:rounded-[2.5rem] border border-slate-100 hover:border-indigo-200 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                               <div className="space-y-2 md:space-y-3">
                                  <div className="flex items-center gap-3">
                                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Problem {idx+1}</span>
                                     <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${q.difficulty === 'HARD' ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'}`}>{q.difficulty}</div>
                                  </div>
                                  <div className="font-bold md:font-black text-slate-800 italic leading-tight text-sm md:text-base">{q.text}</div>
                               </div>
                               <button onClick={() => setTakingTest({ id: `practice-${activeChapter.id}-${idx}`, name: `${activeChapter.name} Drill`, duration: 10, totalMarks: 4, category: 'PRACTICE', difficulty: q.difficulty, questionIds: [q.id], chapterIds: [activeChapter.id] })} className="w-full md:w-auto px-6 py-2.5 md:py-3 bg-white text-indigo-600 rounded-lg md:rounded-xl text-[9px] font-black uppercase tracking-widest border border-indigo-100 shadow-sm hover:bg-indigo-600 hover:text-white transition-all">Attempt</button>
                             </div>
                           ))}
                       </div>
                    </div>
                 </div>
               )}
             </div>

             <div className="lg:col-span-4 space-y-6 md:space-y-8">
                <div className="bg-slate-900 rounded-2xl md:rounded-[3rem] p-6 md:p-8 text-white shadow-2xl space-y-8 md:space-y-10 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform"><Activity className="w-32 md:w-40 h-32 md:h-40" /></div>
                   <div className="space-y-2 relative z-10">
                      <h3 className="text-lg md:text-xl font-black italic tracking-tight flex items-center gap-3"><TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-indigo-400" /> Mastery</h3>
                      <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Accuracy: {activeChapter.accuracy}%</p>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-3 md:gap-4 relative z-10">
                      <div className="p-4 md:p-6 bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl text-center space-y-1 md:space-y-2">
                         <div className="text-[8px] md:text-[9px] font-black uppercase text-slate-500 tracking-widest">Confidence</div>
                         <div className={`text-xl md:text-2xl font-black italic ${conf.color}`}>{conf.label}</div>
                      </div>
                      <div className="p-4 md:p-6 bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl text-center space-y-1 md:space-y-2">
                         <div className="text-[8px] md:text-[9px] font-black uppercase text-slate-500 tracking-widest">Stability</div>
                         <div className="text-xl md:text-2xl font-black italic text-white">{activeChapter.accuracy > 70 ? 'High' : 'Medium'}</div>
                      </div>
                   </div>

                   <div className="space-y-3 md:space-y-4 pt-6 border-t border-white/10 relative z-10">
                      {[
                        { icon: BookOpen, label: 'Theory', val: (activeChapter.timeSpentNotes || 0) + (activeContentTab === 'notes' ? sessionDisplay : 0) },
                        { icon: Play, label: 'Lecture', val: (activeChapter.timeSpentVideos || 0) + (activeContentTab === 'video' ? sessionDisplay : 0) },
                        { icon: Target, label: 'Drills', val: (activeChapter.timeSpentPractice || 0) + (activeContentTab === 'practice' ? sessionDisplay : 0) }
                      ].map((log, i) => (
                        <div key={i} className="flex justify-between items-center">
                           <div className="flex items-center gap-3">
                              <log.icon className="w-4 h-4 text-slate-500" />
                              <span className="text-[9px] font-black uppercase text-slate-400">{log.label}</span>
                           </div>
                           <span className="text-[10px] md:text-xs font-black">{formatTime(log.val)}</span>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
           </div>
        </div>

        {editingStatusId && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setEditingStatusId(null)}></div>
            <div className="bg-white w-full max-w-sm p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl relative z-10 animate-in zoom-in-95">
               <h3 className="text-lg md:text-xl font-black text-slate-900 text-center mb-6 md:mb-8 uppercase italic tracking-tight">Manual Mastery Calibration</h3>
               <input type="range" min="0" max="100" step="5" value={tempProgress} onChange={(e) => setTempProgress(parseInt(e.target.value))} className="w-full h-3 bg-slate-100 rounded-full appearance-none accent-indigo-600 mb-6" />
               <div className="text-center text-4xl md:text-5xl font-black text-indigo-600 mb-8 md:mb-10 font-space">{tempProgress}%</div>
               <button onClick={() => {
                 const newStatus = tempProgress === 100 ? 'COMPLETED' : tempProgress === 0 ? 'NOT_STARTED' : 'LEARNING';
                 const updated = data.chapters.map(c => c.id === editingStatusId ? {...c, progress: tempProgress, status: newStatus as ChapterStatus} : c);
                 setData({...data, chapters: updated});
                 setActiveChapter(updated.find(c => c.id === editingStatusId) || null);
                 setEditingStatusId(null);
               }} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all">Synchronize Metrics</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="bg-white rounded-3xl md:rounded-[4rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 md:p-10 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-50/30">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search syllabus units..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 md:pl-14 pr-6 py-4 md:py-5 bg-white border border-slate-200 rounded-2xl md:rounded-3xl text-sm font-black focus:ring-4 focus:ring-indigo-100 transition-all shadow-sm outline-none" />
          </div>
          <div className="flex gap-2 p-1.5 bg-white rounded-xl md:rounded-2xl border border-slate-100 overflow-x-auto w-full md:w-auto scrollbar-hide">
             {['Physics', 'Chemistry', 'Mathematics'].map((s: any) => (
               <button key={s} onClick={() => setSelectedSubject(s === selectedSubject ? null : s)} className={`flex-1 md:flex-none px-4 md:px-8 py-2.5 md:py-3 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${selectedSubject === s ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-700'}`}>{s}</button>
             ))}
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {Object.keys(groupedChapters).length === 0 ? (
            <div className="p-20 text-center text-slate-300 font-black uppercase text-[10px] tracking-widest italic">No matching units found</div>
          ) : (
            (Object.entries(groupedChapters) as [string, Chapter[]][]).map(([unit, chapters]) => (
              <div key={unit}>
                <button onClick={() => setExpandedUnits(prev => prev.includes(unit) ? prev.filter(u => u !== unit) : [...prev, unit])} className="w-full px-6 md:px-12 py-6 md:py-10 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-4 md:gap-6 text-left">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 rounded-xl md:rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all shadow-inner shrink-0"><Layers className="w-5 h-5 md:w-6 md:h-6" /></div>
                    <h3 className="font-black text-lg md:text-2xl text-slate-800 italic tracking-tight leading-tight line-clamp-1">{unit}</h3>
                  </div>
                  <ChevronDown className={`transition-transform duration-500 shrink-0 ${expandedUnits.includes(unit) ? 'rotate-180' : ''}`} />
                </button>
                {expandedUnits.includes(unit) && (
                  <div className="bg-slate-50/50 px-4 md:px-12 pb-6 md:pb-10 space-y-2 md:space-y-3 animate-in slide-in-from-top-4">
                    {chapters.map(c => (
                      <div key={c.id} onClick={() => setActiveChapter(c)} className="p-4 md:p-6 bg-white border border-slate-200 rounded-2xl md:rounded-[2rem] hover:border-indigo-400 hover:shadow-xl cursor-pointer flex justify-between items-center transition-all group/item">
                         <div className="flex items-center gap-4 md:gap-6 min-w-0">
                            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center font-black shrink-0 ${c.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>
                               {c.status === 'COMPLETED' ? <CheckCircle className="w-4 h-4 md:w-5 md:h-5" /> : <Clock className="w-4 h-4 md:w-5 md:h-5" />}
                            </div>
                            <div className="min-w-0">
                               <div className="font-bold md:font-black text-slate-800 group-hover/item:text-indigo-600 transition-colors italic tracking-tight text-sm md:text-base truncate">{c.name}</div>
                               <div className="flex gap-2 md:gap-3 mt-0.5">
                                  <div className="text-[8px] md:text-[10px] font-black uppercase text-slate-400 tracking-widest whitespace-nowrap">ACC: {c.accuracy}%</div>
                                  {c.videoUrl && <div className="text-[8px] md:text-[9px] font-black uppercase text-emerald-500 flex items-center gap-1"><Video className="w-2.5 h-2.5 md:w-3 md:h-3" /> Ready</div>}
                               </div>
                            </div>
                         </div>
                         <div className="flex items-center gap-4 md:gap-8 shrink-0">
                            <div className="text-right">
                               <div className="text-lg md:text-2xl font-black text-slate-900 tracking-tighter">{c.progress}%</div>
                            </div>
                            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-slate-200 group-hover/item:text-indigo-600 transition-all" />
                         </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LearnModule;