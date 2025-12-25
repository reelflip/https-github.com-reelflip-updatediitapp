
import React, { useState, useEffect, useRef } from 'react';
import { StudentData, Subject, Chapter, MockTest, Question, ChapterStatus } from '../types';
import { 
  Search, ChevronRight, ChevronLeft, ChevronDown, BookOpen, ArrowLeft, Target, 
  FileText, Video, Layers, Activity, Play, Clock, Zap, BarChart, AlertCircle, 
  Award, Settings, X, Edit2, History, TrendingUp, Percent
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
  const [currentPage, setCurrentPage] = useState(0);
  const [activeQIdx, setActiveQIdx] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [activeContentTab, setActiveContentTab] = useState<'notes' | 'video' | 'practice'>('notes');
  
  // Timer States
  const [sessionTime, setSessionTime] = useState(0);
  const sessionDataRef = useRef<{notes: number, video: number, practice: number}>({notes: 0, video: 0, practice: 0});

  const [editingStatusId, setEditingStatusId] = useState<string | null>(null);
  const [tempProgress, setTempProgress] = useState(0);
  const [tempStatus, setTempStatus] = useState<ChapterStatus>('NOT_STARTED');

  // Background Telemetry Engine
  useEffect(() => {
    let interval: any;
    if (activeChapter && !takingTest) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
        if (activeContentTab === 'notes') sessionDataRef.current.notes += 1;
        else if (activeContentTab === 'video') sessionDataRef.current.video += 1;
        else if (activeContentTab === 'practice') sessionDataRef.current.practice += 1;
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
      if (activeChapter) syncTelemetry();
    };
  }, [activeChapter, takingTest, activeContentTab]);

  const syncTelemetry = () => {
    if (!activeChapter) return;
    
    const updatedChapters = data.chapters.map(c => {
      if (c.id === activeChapter.id) {
        return {
          ...c,
          timeSpent: c.timeSpent + sessionTime,
          timeSpentNotes: c.timeSpentNotes + sessionDataRef.current.notes,
          timeSpentVideos: c.timeSpentVideos + sessionDataRef.current.video,
          timeSpentPractice: c.timeSpentPractice + sessionDataRef.current.practice
        };
      }
      return c;
    });

    setData({ ...data, chapters: updatedChapters });
    // Reset session counters for the next potential chapter selection
    setSessionTime(0);
    sessionDataRef.current = {notes: 0, video: 0, practice: 0};
  };

  const subjects: Subject[] = ['Physics', 'Chemistry', 'Mathematics'];

  const groupedChapters = data.chapters.reduce((acc, chapter) => {
    if (selectedSubject && chapter.subject !== selectedSubject) return acc;
    if (!chapter.name.toLowerCase().includes(searchQuery.toLowerCase())) return acc;
    
    if (!chapter.unit) return acc;
    if (!acc[chapter.unit]) acc[chapter.unit] = [];
    acc[chapter.unit].push(chapter);
    return acc;
  }, {} as Record<string, Chapter[]>);

  const toggleUnit = (unit: string) => {
    setExpandedUnits(prev => 
      prev.includes(unit) ? prev.filter(u => u !== unit) : [...prev, unit]
    );
  };

  const handleUpdateStatus = (chapter: Chapter) => {
    setEditingStatusId(chapter.id);
    setTempProgress(chapter.progress);
    setTempStatus(chapter.status);
  };

  const saveStatusUpdate = () => {
    if (!editingStatusId) return;
    
    const updatedChapters = data.chapters.map(c => {
      if (c.id === editingStatusId) {
        const newProgress = tempProgress;
        const newStatus = newProgress === 100 ? 'COMPLETED' : tempStatus;
        return { ...c, progress: newProgress, status: newStatus as ChapterStatus };
      }
      return c;
    });

    setData({ ...data, chapters: updatedChapters });
    setEditingStatusId(null);
    if (activeChapter && activeChapter.id === editingStatusId) {
       setActiveChapter({ ...activeChapter, progress: tempProgress, status: (tempProgress === 100 ? 'COMPLETED' : tempStatus) as ChapterStatus });
    }
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  };

  if (takingTest) {
    return <TestsView data={data} setData={setData} initialTest={takingTest} onExit={() => setTakingTest(null)} />;
  }

  if (activeChapter) {
    const chapterTests = data.mockTests.filter(t => t.chapterIds.includes(activeChapter.id));
    const chapterQuestions = data.questions.filter(q => q.topicId === activeChapter.id);
    const pages = activeChapter.notes || [];

    return (
      <div className="max-w-7xl mx-auto space-y-6 animate-in slide-in-from-right duration-500 pb-20">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => { syncTelemetry(); setActiveChapter(null); setCurrentPage(0); setActiveQIdx(null); }} 
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Syllabus
          </button>
          
          <div className="flex gap-3">
             <button 
              onClick={() => handleUpdateStatus(activeChapter)}
              className="bg-indigo-600 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-white flex items-center gap-2 shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all"
             >
                <Edit2 className="w-4 h-4" /> Update Status
             </button>
             <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-500 flex items-center gap-2 shadow-sm">
                <Clock className="w-4 h-4 text-indigo-500" />
                Session Active: {formatTime(sessionTime)}
             </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-xl space-y-10">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-100 pb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                   <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                      activeChapter.subject === 'Physics' ? 'bg-blue-50 text-blue-600' : 
                      activeChapter.subject === 'Chemistry' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                   }`}>
                      {activeChapter.subject}
                   </span>
                   <span className="text-slate-300">•</span>
                   <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">{activeChapter.unit}</span>
                   <span className="text-slate-300">•</span>
                   <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                     activeChapter.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'
                   }`}>{activeChapter.status.replace('_', ' ')}</span>
                </div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">{activeChapter.name}</h2>
              </div>
              
              <div className="flex items-center gap-8 bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                 <div className="text-center">
                    <div className="text-[10px] uppercase font-black text-slate-400 mb-1">Total Effort</div>
                    <div className="text-xl font-black text-slate-800">{formatTime(activeChapter.timeSpent)}</div>
                 </div>
                 <div className="w-px h-10 bg-slate-200"></div>
                 <div className="text-center">
                    <div className="text-[10px] uppercase font-black text-slate-400 mb-1">Mastery</div>
                    <div className="text-xl font-black text-indigo-600">{activeChapter.progress}%</div>
                 </div>
              </div>
           </div>

           <div className="flex gap-4 p-1.5 bg-slate-50 rounded-2xl w-fit">
              <button onClick={() => setActiveContentTab('notes')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeContentTab === 'notes' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>Theoretical Core</button>
              <button onClick={() => setActiveContentTab('video')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeContentTab === 'video' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>Video Stream</button>
              <button onClick={() => setActiveContentTab('practice')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeContentTab === 'practice' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>Unit Drills</button>
           </div>

           <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
             <div className="xl:col-span-8 space-y-10">
               {activeContentTab === 'notes' && (
                 <div className="space-y-6 animate-in fade-in duration-300">
                   <div className="flex justify-between items-center">
                     <h3 className="font-black text-xl flex items-center gap-2 text-slate-800">
                       <BookOpen className="w-6 h-6 text-indigo-500" /> Theoretical Concepts
                     </h3>
                     <div className="text-[10px] font-black text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 uppercase tracking-widest">
                        Page {currentPage + 1} of {pages.length || 1}
                     </div>
                   </div>
                   <div className="bg-[#fcfaf7] min-h-[450px] rounded-[2.5rem] border border-slate-200 shadow-inner p-10 lg:p-14 overflow-hidden relative">
                      <div 
                        key={currentPage} 
                        className="animate-in fade-in slide-in-from-bottom-4 duration-500 prose prose-slate max-w-none prose-p:text-slate-700 prose-p:leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: pages[currentPage] || '<div class="text-center py-20 text-slate-400 italic">No notes available for this section yet.</div>' }}
                      />
                   </div>
                 </div>
               )}

               {activeContentTab === 'video' && (
                 <div className="space-y-6 animate-in fade-in duration-300">
                    <h3 className="font-black text-xl flex items-center gap-2 text-slate-800">
                      <Play className="w-6 h-6 text-rose-500" /> Video Lecture
                    </h3>
                    <div className="aspect-video bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl relative">
                       {activeChapter.videoUrl ? (
                         <iframe src={activeChapter.videoUrl.replace('watch?v=', 'embed/')} className="absolute inset-0 w-full h-full border-none" allowFullScreen />
                       ) : (
                         <div className="flex flex-col items-center justify-center h-full text-slate-600 gap-4">
                            <Video className="w-16 h-16 opacity-10" />
                            <span className="text-[10px] font-black uppercase tracking-widest">No Unit Video Found</span>
                         </div>
                       )}
                    </div>
                 </div>
               )}

               {activeContentTab === 'practice' && (
                 <div className="space-y-6 animate-in fade-in duration-300">
                    <h3 className="font-black text-xl flex items-center gap-2 text-slate-800">
                      <Target className="w-6 h-6 text-emerald-500" /> Problem Matrix
                    </h3>
                    <div className="space-y-4">
                       {chapterQuestions.map((q, idx) => (
                         <div key={q.id} className="bg-white border border-slate-200 rounded-[2rem] p-6">
                            <div className="font-bold text-slate-700 mb-4 italic">Q{idx+1}: {q.text}</div>
                            <div className="grid grid-cols-2 gap-3">
                               {q.options.map((opt, i) => (
                                 <div key={i} className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-500">
                                    {String.fromCharCode(65+i)}. {opt}
                                 </div>
                               ))}
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
               )}
             </div>

             <div className="xl:col-span-4 space-y-10">
                <div className="bg-indigo-50 p-8 rounded-[3rem] border border-indigo-100 space-y-6">
                   <h3 className="text-sm font-black uppercase text-indigo-600 tracking-widest flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" /> Activity Pulse
                   </h3>
                   <div className="space-y-4">
                      {[
                        { label: 'Reading', val: formatTime(activeChapter.timeSpentNotes + (activeContentTab === 'notes' ? sessionTime : 0)), p: (activeChapter.timeSpentNotes / (activeChapter.timeSpent || 1)) * 100 },
                        { label: 'Watching', val: formatTime(activeChapter.timeSpentVideos + (activeContentTab === 'video' ? sessionTime : 0)), p: (activeChapter.timeSpentVideos / (activeChapter.timeSpent || 1)) * 100 },
                        { label: 'Solving', val: formatTime(activeChapter.timeSpentPractice + (activeContentTab === 'practice' ? sessionTime : 0)), p: (activeChapter.timeSpentPractice / (activeChapter.timeSpent || 1)) * 100 }
                      ].map((pulse, i) => (
                        <div key={i}>
                           <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 mb-1">
                              <span>{pulse.label}</span>
                              <span>{pulse.val}</span>
                           </div>
                           <div className="w-full h-1.5 bg-white/50 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500" style={{ width: `${pulse.p}%` }}></div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="space-y-4">
                   <h3 className="font-black text-lg flex items-center gap-2 text-slate-800">
                      <Award className="w-6 h-6 text-indigo-500" /> Performance Archive
                   </h3>
                   <div className="space-y-3">
                      {chapterTests.map((test, idx) => (
                        <button key={test.id} onClick={() => setTakingTest(test)} className="w-full p-6 bg-white border border-slate-200 rounded-2xl hover:border-indigo-400 transition-all flex items-center justify-between group">
                           <div>
                              <div className="font-black text-sm text-slate-800">Mock Phase #{idx+1}</div>
                              <div className="text-[10px] text-slate-400 font-bold uppercase">{test.questionIds.length} MCQs</div>
                           </div>
                           <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                        </button>
                      ))}
                   </div>
                </div>
             </div>
           </div>
        </div>

        {editingStatusId && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setEditingStatusId(null)}></div>
            <div className="bg-white w-full max-w-md p-10 rounded-[3rem] shadow-2xl relative z-10 animate-in zoom-in-95 duration-300">
               <button onClick={() => setEditingStatusId(null)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors"><X className="w-6 h-6" /></button>
               <h3 className="text-2xl font-black text-slate-900 text-center mb-8 italic">Telemetry Override</h3>
               <div className="space-y-10">
                  <div className="space-y-4">
                    <div className="flex justify-between items-end"><label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Completion</label><span className="text-2xl font-black text-indigo-600">{tempProgress}%</span></div>
                    <input type="range" min="0" max="100" step="5" value={tempProgress} onChange={(e) => setTempProgress(parseInt(e.target.value))} className="w-full h-2 bg-slate-100 rounded-full appearance-none accent-indigo-600 cursor-pointer" />
                  </div>
                  <button onClick={saveStatusUpdate} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-600 transition-all">Apply Modification</button>
               </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {subjects.map(s => {
          const chapters = data.chapters.filter(c => c.subject === s);
          const progress = chapters.length > 0 ? Math.round(chapters.reduce((acc, c) => acc + c.progress, 0) / chapters.length) : 0;
          return (
            <div key={s} className="bg-white p-6 rounded-[2rem] border border-slate-200 flex items-center gap-5 shadow-sm">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${s === 'Physics' ? 'bg-blue-50 text-blue-600' : s === 'Chemistry' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}><Activity className="w-8 h-8" /></div>
              <div className="flex-1">
                <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{s} Depth</div>
                <div className="flex items-center justify-between mt-1"><span className="text-2xl font-black text-slate-800">{progress}%</span></div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
                  <div className={`h-full ${s === 'Physics' ? 'bg-blue-500' : s === 'Chemistry' ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-50/30">
          <div className="relative w-full max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Query syllabus units..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-600 shadow-sm transition-all" />
          </div>
          <div className="flex gap-2">
             {subjects.map(s => (
               <button key={s} onClick={() => setSelectedSubject(s === selectedSubject ? null : s)} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${selectedSubject === s ? 'bg-slate-900 border-slate-900 text-white shadow-xl' : 'bg-white border-slate-200 text-slate-500'}`}>{s}</button>
             ))}
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {Object.entries(groupedChapters).map(([unit, chaptersList]) => {
            const chapters = chaptersList as Chapter[];
            return (
              <div key={unit} className="overflow-hidden">
                <button onClick={() => toggleUnit(unit)} className="w-full px-10 py-8 flex items-center justify-between hover:bg-slate-50 transition-colors text-left">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 shadow-sm"><Layers className="w-6 h-6" /></div>
                    <div>
                      <h3 className="font-black text-xl text-slate-800 tracking-tight">{unit}</h3>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{chapters.length} Chapters Active</div>
                    </div>
                  </div>
                  <ChevronDown className={`w-6 h-6 text-slate-300 transition-transform ${expandedUnits.includes(unit) ? 'rotate-180' : ''}`} />
                </button>
                {expandedUnits.includes(unit) && (
                  <div className="bg-slate-50/50 px-10 pb-8 space-y-3">
                    {chapters.map(chapter => (
                      <div key={chapter.id} className="group flex flex-col p-5 bg-white border border-slate-200 rounded-[1.5rem] hover:border-indigo-400 transition-all cursor-pointer shadow-sm" onClick={() => setActiveChapter(chapter)}>
                        <div className="flex items-center justify-between w-full">
                          <div className="flex-1 flex items-center gap-5">
                            <div className={`w-3 h-3 rounded-full ${chapter.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-indigo-400'}`}></div>
                            <div>
                                <span className="font-black text-slate-800 text-base">{chapter.name}</span>
                                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex gap-2 mt-1">
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatTime(chapter.timeSpent)} Effort</span>
                                </div>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                        </div>
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
