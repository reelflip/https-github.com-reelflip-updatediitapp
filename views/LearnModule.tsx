
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

  if (takingTest) {
    return <TestsView data={data} setData={setData} initialTest={takingTest} onExit={() => setTakingTest(null)} />;
  }

  // --- CHAPTER VIEW (INLINE) ---
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

    // Calculate Chapter Specific Analytics
    const timeData = [
      { name: 'Theory', value: activeChapter.timeSpentNotes || 0, color: '#6366f1' },
      { name: 'Video', value: activeChapter.timeSpentVideos || 0, color: '#f59e0b' },
      { name: 'Practice', value: activeChapter.timeSpentPractice || 0, color: '#10b981' },
      { name: 'Tests', value: activeChapter.timeSpentTests || 0, color: '#ef4444' }
    ].filter(d => d.value > 0);

    const totalChapterTime = (activeChapter.timeSpent || 0) / 60; // in minutes
    const stabilityIndex = activeChapter.accuracy > 0 
      ? Math.round((activeChapter.accuracy * 0.8) + (activeChapter.progress * 0.2)) 
      : 0;

    return (
      <div className="space-y-8 animate-in fade-in duration-500 pb-20">
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
              { id: 'history', label: 'History', icon: History },
              { id: 'analytics', label: 'Telemetry', icon: BarChart3 }
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

        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden min-h-[60vh]">
          {activeContentTab === 'notes' ? (
            <div className="p-8 md:p-16">
               <div className="max-w-4xl mx-auto prose prose-slate max-w-none prose-headings:font-black prose-headings:italic prose-headings:tracking-tighter prose-p:text-lg prose-p:font-medium prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600 prose-li:font-medium prose-strong:text-indigo-600 animate-in slide-in-from-bottom-4" dangerouslySetInnerHTML={{ __html: activeChapter.notes || '<p class="text-slate-300 italic">No conceptual data found for this unit.</p>' }} />
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
               <div className="max-w-5xl mx-auto py-12">
                  <div className="bg-indigo-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-[4s]"><Target className="w-48 h-48" /></div>
                     <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                        <div className="space-y-4 text-center md:text-left">
                           <div className="inline-flex px-4 py-1 bg-white/10 border border-white/20 rounded-full text-[9px] font-black uppercase tracking-widest">Standardized Challenge</div>
                           <h3 className="text-4xl font-black italic tracking-tighter uppercase leading-none">20 Question <br /><span className="text-indigo-400">Mastery Test.</span></h3>
                           <div className="flex gap-6 justify-center md:justify-start">
                              <div className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2"><Clock className="w-4 h-4 text-indigo-400" /> 40 Minutes</div>
                              <div className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2"><Layers className="w-4 h-4 text-indigo-400" /> 20 Critical Problems</div>
                           </div>
                        </div>
                        <button onClick={startChapterPractice} className="px-12 py-5 bg-[#82c341] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4">
                           Start Practice Test <PlayCircle className="w-6 h-6" />
                        </button>
                     </div>
                  </div>
                  <div className="mt-8 text-center">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">System has synced {chapterQuestions.length} questions for this unit.</p>
                  </div>
               </div>
            </div>
          ) : activeContentTab === 'analytics' ? (
            <div className="p-8 md:p-16 animate-in slide-in-from-bottom-4 space-y-12">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 flex flex-col justify-between group">
                     <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm mb-6"><Timer className="w-6 h-6" /></div>
                     <div>
                        <div className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">Total Effort Log</div>
                        <div className="text-3xl font-black text-slate-800 italic">{Math.round(totalChapterTime)} <span className="text-xs text-slate-400">Minutes</span></div>
                     </div>
                  </div>
                  <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 flex flex-col justify-between">
                     <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm mb-6"><Activity className="w-6 h-6" /></div>
                     <div>
                        <div className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">Stability Index</div>
                        <div className="text-3xl font-black text-slate-800 italic">{stabilityIndex}%</div>
                     </div>
                  </div>
                  <div className="bg-[#0a1128] p-8 rounded-[2.5rem] text-white flex flex-col justify-between relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-4 opacity-10"><Zap className="w-20 h-20 text-indigo-400" /></div>
                     <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-indigo-300 border border-white/10 mb-6"><TrendingUp className="w-6 h-6" /></div>
                     <div>
                        <div className="text-[9px] font-black uppercase text-indigo-400 tracking-widest mb-1">Status Protocol</div>
                        <div className="text-2xl font-black italic uppercase tracking-tighter">{activeChapter.status}</div>
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
                     <h4 className="text-sm font-black uppercase text-slate-800 italic tracking-tight">Time Distribution Analysis</h4>
                     <div className="h-64 relative">
                        {timeData.length > 0 ? (
                           <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                 <Pie data={timeData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                                    {timeData.map((entry, index) => (
                                       <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                 </Pie>
                                 <ReTooltip 
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                                    formatter={(v: any) => `${Math.round(v/60)}m`}
                                 />
                              </PieChart>
                           </ResponsiveContainer>
                        ) : (
                           <div className="h-full flex items-center justify-center text-slate-300 text-[10px] font-black uppercase tracking-widest border-2 border-dashed border-slate-50 rounded-3xl">No Telemetry Recorded</div>
                        )}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                           <span className="text-2xl font-black italic text-slate-800">{Math.round(totalChapterTime)}m</span>
                           <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Total</span>
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        {timeData.map((d, i) => (
                           <div key={i} className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></div>
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{d.name}: {Math.round(d.value/60)}m</span>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8 flex flex-col justify-center">
                     <div className="space-y-2">
                        <h4 className="text-sm font-black uppercase text-slate-800 italic tracking-tight">Unit Insights</h4>
                        <p className="text-xs text-slate-500 font-medium italic leading-relaxed">Systematic analysis of your learning pattern for this unit.</p>
                     </div>
                     <div className="space-y-6">
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                           <div className="text-[8px] font-black uppercase text-indigo-600 tracking-widest">Efficiency Diagnostic</div>
                           <p className="text-xs font-bold text-slate-700 italic">
                              {activeChapter.accuracy > 70 
                                 ? "Superior conceptual retention detected. Unit is ready for high-difficulty JEE Advanced drills."
                                 : activeChapter.timeSpentPractice > activeChapter.timeSpentNotes
                                    ? "Execution-heavy learning detected. Spend more time on derivations to improve theory stability."
                                    : "Theory saturation detected. Divert upcoming effort to intensive problem-solving sessions."}
                           </p>
                        </div>
                        <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-slate-400">
                           <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><CheckCircle className="w-4 h-4" /></div>
                           Confidence Level: {stabilityIndex > 75 ? 'Superior' : stabilityIndex > 50 ? 'Stabilizing' : 'Vulnerable'}
                        </div>
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
  const chapters = data.chapters || [];
  const searchQueryLower = searchQuery.toLowerCase();
  
  const groupedChapters = chapters.reduce((acc, chapter) => {
    if (selectedSubject && chapter.subject !== selectedSubject) return acc;
    if (!chapter.name.toLowerCase().includes(searchQueryLower)) return acc;
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
          {Object.keys(groupedChapters).length === 0 ? (
            <div className="p-32 text-center text-slate-300 font-black uppercase text-xs italic tracking-widest">No matching units found in syllabus.</div>
          ) : (
            (Object.entries(groupedChapters) as [string, Chapter[]][]).map(([unit, chapters]) => {
              const unitAvgProgress = Math.round(chapters.reduce((acc, c) => acc + (c.progress || 0), 0) / chapters.length);
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
                                  <circle cx="50%" cy="50%" r="40%" fill="transparent" stroke={c.progress === 100 ? '#10b981' : '#6366f1'} strokeWidth="3" strokeDasharray="100 100" strokeDashoffset={100 - (c.progress || 0)} pathLength="100" strokeLinecap="round" className="transition-all duration-1000" />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center"><span className="text-[9px] font-black text-slate-900">{c.progress || 0}%</span></div>
                              </div>
                              <div className="min-w-0">
                                 <div className="font-black text-slate-800 group-hover/item:text-indigo-600 transition-colors italic tracking-tight text-base truncate">{c.name}</div>
                                 <div className="flex gap-3 mt-0.5">
                                    <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Accuracy: {c.accuracy || 0}%</div>
                                    {c.status === 'COMPLETED' && <div className="text-[10px] font-black uppercase text-emerald-500 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Mastered</div>}
                                 </div>
                              </div>
                           </div>
                           <div className="flex items-center gap-4">
                              <div className="text-right hidden sm:block">
                                 <div className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Total Study</div>
                                 <div className="text-xs font-black text-slate-500">{Math.round((c.timeSpent || 0) / 60)}m</div>
                              </div>
                              <ChevronRight className="w-6 h-6 text-slate-200 group-hover/item:text-indigo-600 transition-all" />
                           </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default LearnModule;
