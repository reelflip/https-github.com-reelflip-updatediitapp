import React, { useState, useEffect } from 'react';
import { StudentData, Subject, Chapter, MockTest, Question, ChapterStatus, TestResult } from '../types';
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
  const [sessionTime, setSessionTime] = useState(0);
  const [activeQIdx, setActiveQIdx] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  
  const [editingStatusId, setEditingStatusId] = useState<string | null>(null);
  const [tempProgress, setTempProgress] = useState(0);
  const [tempStatus, setTempStatus] = useState<ChapterStatus>('NOT_STARTED');

  useEffect(() => {
    let interval: any;
    if (activeChapter && !takingTest) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    } else {
      setSessionTime(0);
    }
    return () => clearInterval(interval);
  }, [activeChapter, takingTest]);

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
    const chapterHistory = data.testHistory.filter(h => h.chapterIds.includes(activeChapter.id));
    const pages = activeChapter.notes || [];

    return (
      <div className="max-w-7xl mx-auto space-y-6 animate-in slide-in-from-right duration-500 pb-20">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => { setActiveChapter(null); setCurrentPage(0); setActiveQIdx(null); }} 
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
                Session: {Math.floor(sessionTime / 60)}:{(sessionTime % 60).toString().padStart(2, '0')}
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
                    <div className="text-[10px] uppercase font-black text-slate-400 mb-1">Effort</div>
                    <div className="text-xl font-black text-slate-800">{formatTime(activeChapter.timeSpent)}</div>
                 </div>
                 <div className="w-px h-10 bg-slate-200"></div>
                 <div className="text-center">
                    <div className="text-[10px] uppercase font-black text-slate-400 mb-1">Drills</div>
                    <div className="text-xl font-black text-slate-800">{chapterQuestions.length}</div>
                 </div>
                 <div className="w-px h-10 bg-slate-200"></div>
                 <div className="text-center">
                    <div className="text-[10px] uppercase font-black text-slate-400 mb-1">Mastery</div>
                    <div className="text-xl font-black text-indigo-600">{activeChapter.progress}%</div>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
             <div className="xl:col-span-8 space-y-10">
               <div className="space-y-6">
                 <div className="flex justify-between items-center">
                   <h3 className="font-black text-xl flex items-center gap-2 text-slate-800">
                     <BookOpen className="w-6 h-6 text-indigo-500" />
                     Theoretical Concepts
                   </h3>
                   <div className="text-[10px] font-black text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 uppercase tracking-widest">
                      Page {currentPage + 1} of {pages.length || 1}
                   </div>
                 </div>

                 <div className="relative group">
                   {pages.length > 1 && (
                     <>
                      <button 
                        disabled={currentPage === 0}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                        className="absolute -left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white shadow-xl rounded-full flex items-center justify-center text-slate-800 hover:bg-indigo-600 hover:text-white transition-all disabled:opacity-0"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button 
                        disabled={currentPage === pages.length - 1}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        className="absolute -right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white shadow-xl rounded-full flex items-center justify-center text-slate-800 hover:bg-indigo-600 hover:text-white transition-all disabled:opacity-0"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                     </>
                   )}

                   <div className="bg-[#fcfaf7] min-h-[400px] rounded-[2.5rem] border border-slate-200 shadow-inner p-10 lg:p-14 overflow-hidden relative">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-100"></div>
                      <div 
                        key={currentPage} 
                        className="animate-in fade-in slide-in-from-bottom-4 duration-500 prose prose-slate max-w-none prose-headings:font-black prose-p:text-slate-700 prose-p:leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: pages[currentPage] || '<div class="text-center py-20 text-slate-400 italic">No notes available for this section yet.</div>' }}
                      />
                   </div>
                 </div>
               </div>

               <div className="space-y-6 pt-10 border-t border-slate-100">
                  <div className="flex justify-between items-center">
                    <h3 className="font-black text-xl flex items-center gap-2 text-slate-800">
                      <Target className="w-6 h-6 text-emerald-500" />
                      Topic Practice (Questions)
                    </h3>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{chapterQuestions.length} Problems available</span>
                  </div>
                  
                  {chapterQuestions.length > 0 ? (
                    <div className="space-y-4">
                       {chapterQuestions.map((q, idx) => (
                         <div key={q.id} className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm hover:border-indigo-200 transition-all">
                            <button 
                              onClick={() => { setActiveQIdx(activeQIdx === idx ? null : idx); setShowExplanation(false); }}
                              className="w-full p-6 text-left flex items-center justify-between"
                            >
                               <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400">Q{idx+1}</div>
                                  <div className="font-bold text-slate-700 line-clamp-1">{q.text}</div>
                               </div>
                               <ChevronDown className={`w-5 h-5 text-slate-300 transition-transform ${activeQIdx === idx ? 'rotate-180' : ''}`} />
                            </button>
                            
                            {activeQIdx === idx && (
                              <div className="px-8 pb-8 space-y-6 animate-in slide-in-from-top-2 duration-300">
                                 <p className="text-slate-800 font-medium leading-relaxed">{q.text}</p>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {q.options.map((opt, i) => (
                                      <div key={i} className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-600 flex items-center gap-3">
                                         <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[10px] border border-slate-200">{String.fromCharCode(65 + i)}</div>
                                         {opt}
                                      </div>
                                    ))}
                                 </div>
                                 <div className="pt-4 flex items-center justify-between">
                                    <button 
                                      onClick={() => setShowExplanation(!showExplanation)}
                                      className="text-[10px] font-black uppercase text-indigo-600 flex items-center gap-2"
                                    >
                                       {showExplanation ? 'Hide Solution' : 'Reveal Solution'}
                                    </button>
                                 </div>
                                 {showExplanation && (
                                   <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl animate-in fade-in duration-300">
                                      <div className="text-[10px] font-black text-emerald-600 uppercase mb-2">Answer Key: {String.fromCharCode(65 + q.correctAnswer)}</div>
                                      <p className="text-sm text-emerald-900 leading-relaxed font-medium">{q.explanation}</p>
                                   </div>
                                 )}
                              </div>
                            )}
                         </div>
                       ))}
                    </div>
                  ) : (
                    <div className="p-12 border-2 border-dashed border-slate-100 rounded-[3rem] text-center bg-slate-50/50">
                       <AlertCircle className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                       <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No topic-specific questions found</p>
                    </div>
                  )}
               </div>
             </div>

             <div className="xl:col-span-4 space-y-10">
               <div className="space-y-4">
                 <h3 className="font-black text-xl flex items-center gap-2 text-slate-800">
                   <Play className="w-6 h-6 text-rose-500" />
                   Video Lecture
                 </h3>
                 <div className="aspect-video bg-slate-900 rounded-[2rem] flex items-center justify-center group cursor-pointer relative overflow-hidden shadow-xl ring-8 ring-slate-50">
                   {activeChapter.videoUrl ? (
                     <iframe 
                       src={activeChapter.videoUrl.replace('watch?v=', 'embed/')} 
                       className="absolute inset-0 w-full h-full border-none"
                       allowFullScreen
                     />
                   ) : (
                     <div className="flex flex-col items-center gap-2 text-slate-600">
                        <Video className="w-10 h-10 opacity-20" />
                        <span className="text-[10px] font-black uppercase tracking-widest">No Video Attached</span>
                     </div>
                   )}
                 </div>
               </div>

               <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <h3 className="font-black text-xl flex items-center gap-2 text-slate-800">
                      <Award className="w-6 h-6 text-indigo-500" />
                      Topic Assessments
                    </h3>
                 </div>
                 <div className="space-y-3">
                    {chapterTests.length > 0 ? (
                      chapterTests.map((test, idx) => (
                        <button 
                          key={test.id}
                          onClick={() => setTakingTest(test)}
                          className="w-full flex items-center justify-between p-6 bg-white border border-slate-200 rounded-2xl hover:border-indigo-400 hover:shadow-lg transition-all group text-left"
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                               <FileText className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="font-black text-sm text-slate-800">Practice Drill #{idx + 1}</div>
                              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{test.questionIds.length} Qs • {test.duration}m</div>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                        </button>
                      ))
                    ) : (
                      <div className="p-10 border-2 border-dashed border-slate-200 rounded-[2.5rem] text-center text-slate-400 italic text-xs bg-slate-50/50">
                        No assessments linked to this unit.
                      </div>
                    )}
                 </div>
               </div>
             </div>
           </div>
        </div>

        {editingStatusId && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setEditingStatusId(null)}></div>
            <div className="bg-white w-full max-w-md p-10 rounded-[3rem] shadow-2xl relative z-10 animate-in zoom-in-95 duration-300">
               <button onClick={() => setEditingStatusId(null)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors">
                  <X className="w-6 h-6" />
               </button>
               <div className="mb-10 text-center">
                  <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                     <TrendingUp className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Update Mastery</h3>
               </div>
               <div className="space-y-10">
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Completion</label>
                      <span className="text-2xl font-black text-indigo-600">{tempProgress}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="100" step="5"
                      value={tempProgress}
                      onChange={(e) => setTempProgress(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-100 rounded-full appearance-none accent-indigo-600 cursor-pointer"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Status Phase</label>
                    <div className="grid grid-cols-2 gap-3">
                       {(['LEARNING', 'REVISION', 'NOT_STARTED'] as ChapterStatus[]).map(s => (
                         <button 
                          key={s}
                          onClick={() => setTempStatus(s)}
                          className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${
                            tempStatus === s ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-500'
                          }`}
                         >
                           {s.replace('_', ' ')}
                         </button>
                       ))}
                       <button 
                        disabled={tempProgress < 100}
                        onClick={() => { setTempStatus('COMPLETED'); setTempProgress(100); }}
                        className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${
                          tempProgress === 100 ? 'bg-emerald-600 text-white' : 'bg-slate-50 text-slate-300'
                        }`}
                       >
                         COMPLETED
                       </button>
                    </div>
                  </div>
                  <button 
                    onClick={saveStatusUpdate}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-600 transition-all"
                  >
                    Confirm Transmission
                  </button>
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
          const progress = chapters.length > 0 
            ? Math.round(chapters.reduce((acc, c) => acc + c.progress, 0) / chapters.length)
            : 0;
          return (
            <div key={s} className="bg-white p-6 rounded-[2rem] border border-slate-200 flex items-center gap-5 shadow-sm">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                s === 'Physics' ? 'bg-blue-50 text-blue-600' : s === 'Chemistry' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
              }`}>
                <Activity className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{s} Matrix</div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-2xl font-black text-slate-800">{progress}%</span>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-md">{chapters.filter(c => c.status === 'COMPLETED').length}/{chapters.length} Units</span>
                </div>
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
            <input 
              type="text" 
              placeholder="Query syllabus units..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-600 transition-all shadow-sm"
            />
          </div>
          <div className="flex gap-2">
             {subjects.map(s => (
               <button 
                key={s} 
                onClick={() => setSelectedSubject(s === selectedSubject ? null : s)}
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${selectedSubject === s ? 'bg-slate-900 border-slate-900 text-white shadow-xl' : 'bg-white border-slate-200 text-slate-500'}`}
               >
                 {s}
               </button>
             ))}
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {Object.entries(groupedChapters).map(([unit, chaptersList]) => {
            const chapters = chaptersList as Chapter[];
            const unitProgress = Math.round(chapters.reduce((a,c) => a+c.progress, 0) / chapters.length);
            
            return (
              <div key={unit} className="overflow-hidden">
                <button 
                  onClick={() => toggleUnit(unit)}
                  className="w-full px-10 py-8 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 shadow-sm">
                      <Layers className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-black text-xl text-slate-800 tracking-tight">{unit}</h3>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex gap-3">
                         <span>{chapters.length} Chapters</span>
                         <span>•</span>
                         <span className="text-indigo-500">{unitProgress}% Stable</span>
                      </div>
                    </div>
                  </div>
                  <ChevronDown className={`w-6 h-6 text-slate-300 transition-transform ${expandedUnits.includes(unit) ? 'rotate-180' : ''}`} />
                </button>

                {expandedUnits.includes(unit) && (
                  <div className="bg-slate-50/50 px-10 pb-8 space-y-3 animate-in slide-in-from-top-4 duration-300">
                    {chapters.map(chapter => (
                      <div 
                        key={chapter.id}
                        className="group flex flex-col p-5 bg-white border border-slate-200 rounded-[1.5rem] hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer"
                        onClick={() => setActiveChapter(chapter)}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex-1 flex items-center gap-5">
                            <div className={`w-3 h-3 rounded-full ${chapter.status === 'COMPLETED' ? 'bg-emerald-500' : chapter.status === 'REVISION' ? 'bg-amber-400' : 'bg-indigo-400'}`}></div>
                            <div>
                                <span className="font-black text-slate-800 text-base">{chapter.name}</span>
                                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex gap-2 mt-1">
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatTime(chapter.timeSpent)}</span>
                                    <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> {chapter.status.replace('_', ' ')}</span>
                                </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                                <div className="text-[10px] font-black text-slate-400 uppercase">Mastery</div>
                                <div className="text-sm font-black text-slate-800">{chapter.progress}%</div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                          </div>
                        </div>
                        <div className="w-full h-1 bg-slate-100 rounded-full mt-4 overflow-hidden">
                          <div className={`h-full transition-all duration-1000 ${chapter.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-indigo-500'}`} style={{ width: `${chapter.progress}%` }}></div>
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