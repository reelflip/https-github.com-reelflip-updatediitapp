
import React, { useState, useEffect } from 'react';
import { StudentData, MockTest, Question, TestResult } from '../types';
import { api } from '../services/apiService';
import { 
  FileText, Clock, Target, ChevronRight, CheckCircle2, Trophy, 
  AlertCircle, ArrowLeft, History, Bookmark, Calendar, BarChart3,
  Search, Filter, Activity, TrendingUp, Award, Zap, Timer, Layout,
  SearchCode, ListFilter, ArrowUpDown, ExternalLink, Download,
  // Added Brain icon import to fix the missing name error
  Brain
} from 'lucide-react';

interface TestsViewProps {
  data: StudentData;
  setData: (data: StudentData) => void;
  initialTest?: MockTest | null;
  onExit?: () => void;
}

const TestsView: React.FC<TestsViewProps> = ({ data, setData, initialTest = null, onExit }) => {
  const [activeTab, setActiveTab] = useState<'mocks' | 'practice' | 'history'>('mocks');
  const [activeTest, setActiveTest] = useState<MockTest | null>(initialTest);
  const [testMode, setTestMode] = useState(!!initialTest);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [historySearch, setHistorySearch] = useState('');

  useEffect(() => {
    if (initialTest) startTest(initialTest);
  }, [initialTest]);

  // Timer Logic
  useEffect(() => {
    let timer: any;
    if (testMode && !isSubmitted && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && testMode && !isSubmitted) {
      handleSubmitTest();
    }
    return () => clearInterval(timer);
  }, [testMode, isSubmitted, timeLeft]);

  const archiveTests = data.mockTests.filter(t => 
    t.name.toLowerCase().includes('archive') || t.name.toLowerCase().includes('jee 20')
  );
  
  const regularMockTests = data.mockTests.filter(t => 
    !archiveTests.includes(t) && t.category === 'ADMIN'
  );

  const practiceTests = data.mockTests.filter(t => t.category === 'CHAPTER');

  const startTest = (test: MockTest) => {
    setActiveTest(test);
    setTestMode(true);
    setCurrentQuestionIdx(0);
    setAnswers({});
    setIsSubmitted(false);
    setTimeLeft(test.duration * 60);
  };

  const handleSubmitTest = async () => {
    if (!activeTest) return;
    
    const questionsCount = activeTest.questionIds.length;
    let score = 0;
    let correctCount = 0;

    activeTest.questionIds.forEach(qId => {
      const q = data.questions.find(qu => qu.id === qId);
      if (q) {
        if (answers[qId] === q.correctAnswer) {
           score += 4;
           correctCount++;
        } else if (answers[qId] !== undefined) {
           score -= 1;
        }
      }
    });

    const accuracy = Math.round((correctCount / (questionsCount || 1)) * 100);
    
    const newResult: TestResult = {
      testId: activeTest.id,
      testName: activeTest.name,
      score: score,
      totalMarks: questionsCount * 4,
      date: new Date().toISOString().split('T')[0],
      chapterIds: activeTest.chapterIds,
      accuracy: accuracy
    };

    // Update global state and persist to DB
    const updatedHistory = [newResult, ...data.testHistory];
    setData({ ...data, testHistory: updatedHistory });
    await api.saveEntity('Result', newResult);
    
    setIsSubmitted(true);
  };

  const formatTimer = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (testMode && activeTest) {
    const questions = data.questions.filter(q => activeTest.questionIds.includes(q.id));
    const currentQ = questions[currentQuestionIdx];

    return (
      <div className="fixed inset-0 z-[100] bg-slate-50 flex flex-col animate-in fade-in duration-300">
        {/* ULTRA-COMPACT STICKY HUD */}
        <div className="h-14 bg-slate-950 text-white flex items-center justify-between px-6 shrink-0 border-b border-white/5">
           <div className="flex items-center gap-4">
              <button onClick={() => { if(confirm("End session? Progress will be lost.")) setTestMode(false); }} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="h-4 w-px bg-white/10"></div>
              <div>
                 <h2 className="text-xs font-black uppercase tracking-widest text-indigo-400 leading-none mb-1">Active: {activeTest.name}</h2>
                 <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Unit Matrix v5.4.0 • Local Secure</div>
              </div>
           </div>
           
           <div className="flex items-center gap-6">
              <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border ${timeLeft < 300 ? 'bg-rose-500/20 border-rose-500 text-rose-500 animate-pulse' : 'bg-white/5 border-white/10 text-slate-300'}`}>
                 <Clock className="w-3.5 h-3.5" />
                 <span className="text-sm font-black tabular-nums">{formatTimer(timeLeft)}</span>
              </div>
              {!isSubmitted ? (
                <button onClick={() => { if(confirm("Submit final response?")) handleSubmitTest(); }} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-900/40">Finish Exam</button>
              ) : (
                <button onClick={() => setTestMode(false)} className="bg-white text-slate-900 px-6 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-[0.2em]">Close Review</button>
              )}
           </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* SCROLLABLE QUESTION CANVAS */}
          <div className="flex-1 overflow-y-auto p-6 lg:p-12 custom-scrollbar bg-white/50">
            {isSubmitted ? (
              <div className="max-w-4xl mx-auto space-y-10 pb-20">
                <div className="bg-slate-900 p-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-12">
                   <div className="absolute top-0 right-0 p-8 opacity-5"><Trophy className="w-64 h-64" /></div>
                   <div className="w-32 h-32 bg-white/10 rounded-[2.5rem] flex items-center justify-center shrink-0 border border-white/10">
                      <Award className="w-16 h-16 text-indigo-400" />
                   </div>
                   <div className="space-y-6 flex-1 text-center md:text-left">
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 mb-2">Diagnostic Summary</div>
                        <h3 className="text-4xl font-black italic tracking-tighter">Session Terminated.</h3>
                      </div>
                      <div className="flex justify-center md:justify-start gap-10">
                         <div><div className="text-5xl font-black">{Math.round((data.testHistory[0]?.score / data.testHistory[0]?.totalMarks) * 100)}%</div><div className="text-[9px] uppercase font-black text-slate-500">Mastery</div></div>
                         <div className="w-px h-10 bg-white/10 self-center"></div>
                         <div><div className="text-5xl font-black">{data.testHistory[0]?.accuracy}%</div><div className="text-[9px] uppercase font-black text-slate-500">Precision</div></div>
                      </div>
                   </div>
                   <button onClick={() => setTestMode(false)} className="px-8 py-4 bg-white text-slate-950 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-50 shadow-2xl shrink-0">Return to Node</button>
                </div>

                <div className="space-y-4">
                   <h3 className="text-xl font-black italic flex items-center gap-3 text-slate-800"><ListFilter className="w-5 h-5 text-indigo-600" /> Corrective Analysis</h3>
                   {questions.map((q, idx) => {
                      const isCorrect = answers[q.id] === q.correctAnswer;
                      return (
                        <div key={q.id} className={`p-8 bg-white rounded-[3rem] border border-slate-200 transition-all ${isCorrect ? 'border-l-[12px] border-l-emerald-500' : 'border-l-[12px] border-l-rose-500'}`}>
                           <div className="flex justify-between mb-6">
                              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Q-Unit {idx+1}</span>
                              <span className={`text-[10px] font-black uppercase ${isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>{isCorrect ? 'VALID +4' : 'INVALID -1'}</span>
                           </div>
                           <p className="text-lg font-bold text-slate-700 italic mb-8">"{q.text}"</p>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                              {q.options.map((opt, i) => (
                                <div key={i} className={`p-4 rounded-xl border flex items-center gap-3 text-xs font-bold ${
                                  i === q.correctAnswer ? 'bg-emerald-50 border-emerald-500 text-emerald-900' : 
                                  i === answers[q.id] ? 'bg-rose-50 border-rose-500 text-rose-900' : 'bg-slate-50 border-slate-100 text-slate-400'
                                }`}>
                                   <span className="w-6 h-6 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0">{String.fromCharCode(65+i)}</span>
                                   {opt}
                                </div>
                              ))}
                           </div>
                           <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-100 text-[11px] font-medium text-indigo-900 leading-relaxed italic">
                              <span className="font-black uppercase text-[8px] block mb-1">Tactical Logic:</span>
                              {q.explanation}
                           </div>
                        </div>
                      );
                   })}
                </div>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto space-y-12 h-full flex flex-col justify-center">
                 <div className="bg-white p-12 lg:p-20 rounded-[4rem] border border-slate-200 shadow-sm space-y-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-5"><Brain className="w-64 h-64" /></div>
                    <div className="flex justify-between items-center relative z-10">
                       <div className="flex items-center gap-3">
                          <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest">{currentQ?.subject}</span>
                          <div className="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Question {currentQuestionIdx + 1} / {questions.length}</span>
                       </div>
                       <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Single Choice Correct</div>
                    </div>
                    
                    <h2 className="text-3xl font-black text-slate-900 leading-tight italic tracking-tight relative z-10">"{currentQ?.text}"</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                       {currentQ?.options.map((opt, i) => (
                         <button 
                           key={i} 
                           onClick={() => setAnswers(prev => ({ ...prev, [currentQ.id]: i }))}
                           className={`p-8 rounded-[2.5rem] border-2 transition-all flex items-center gap-6 group ${
                             answers[currentQ.id] === i ? 'bg-slate-900 border-slate-900 text-white shadow-2xl scale-[1.02]' : 'bg-white border-slate-100 text-slate-500 hover:border-indigo-400 hover:bg-slate-50'
                           }`}
                         >
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 font-black text-xl shadow-inner ${
                              answers[currentQ.id] === i ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-white'
                            }`}>
                               {String.fromCharCode(65+i)}
                            </div>
                            <span className="text-lg font-bold text-left leading-tight">{opt}</span>
                         </button>
                       ))}
                    </div>

                    <div className="flex justify-between items-center pt-10 border-t border-slate-100 relative z-10">
                       <button 
                        disabled={currentQuestionIdx === 0} 
                        onClick={() => setCurrentQuestionIdx(prev => prev - 1)} 
                        className="p-4 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl font-black uppercase text-[10px] tracking-widest disabled:opacity-0 transition-all flex items-center gap-2"
                       >
                          <ChevronRight className="w-4 h-4 rotate-180" /> Back
                       </button>
                       <div className="flex gap-4">
                          <button 
                            onClick={() => setAnswers(prev => { const n = {...prev}; delete n[currentQ.id]; return n; })}
                            className="px-6 py-2 text-[10px] font-black uppercase text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                          >
                            Reset selection
                          </button>
                          <button 
                            onClick={() => { if(currentQuestionIdx < questions.length - 1) setCurrentQuestionIdx(prev => prev + 1); }} 
                            className="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.4em] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
                          >
                            {currentQuestionIdx === questions.length - 1 ? 'End Matrix' : 'Next Unit'}
                          </button>
                       </div>
                    </div>
                 </div>
              </div>
            )}
          </div>

          {/* FIXED SIDEBAR MATRIX */}
          <div className="w-80 bg-white border-l border-slate-200 p-8 flex flex-col gap-8 shrink-0">
             <div className="space-y-6 overflow-y-auto flex-1 custom-scrollbar">
                <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center justify-between">
                   <span className="flex items-center gap-2"><Target className="w-4 h-4" /> Solution Matrix</span>
                   <span>{Object.keys(answers).length}/{questions.length}</span>
                </div>
                <div className="grid grid-cols-5 gap-2 pb-10">
                   {questions.map((_, i) => (
                     <button 
                      key={i}
                      onClick={() => setCurrentQuestionIdx(i)}
                      className={`w-11 h-11 rounded-xl flex items-center justify-center text-[10px] font-black transition-all ${
                        currentQuestionIdx === i ? 'bg-indigo-600 text-white shadow-xl scale-110 ring-4 ring-indigo-50 z-10' : 
                        answers[questions[i].id] !== undefined ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                      }`}
                     >
                       {i + 1}
                     </button>
                   ))}
                </div>
             </div>

             <div className="pt-6 border-t border-slate-100 space-y-4">
                <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-widest text-slate-400">
                   <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Solved</div>
                   <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-indigo-600"></div> Active</div>
                   <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-slate-100"></div> Void</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                   <p className="text-[10px] text-slate-500 font-bold italic leading-relaxed text-center">"Precision is the only variable you can control. Speed is a byproduct."</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  const filteredHistory = data.testHistory.filter(h => h.testName.toLowerCase().includes(historySearch.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-500 pb-32 px-4">
      {/* COMPACT DASHBOARD HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
         <div>
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">TESTING <span className="text-indigo-600">HUB.</span></h2>
            <div className="flex items-center gap-3 mt-3">
               <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-indigo-100">Persistence Enabled</span>
               <span className="text-slate-300">•</span>
               <span className="text-slate-400 text-[9px] font-black uppercase tracking-widest">{data.testHistory.length} Sessions Logged</span>
            </div>
         </div>
         
         <nav className="flex p-1.5 bg-white rounded-2xl border border-slate-200 shadow-lg">
            {[
              { id: 'mocks', label: 'Full Mocks', icon: Zap },
              { id: 'practice', label: 'Unit Drills', icon: Target },
              { id: 'history', label: 'Archive', icon: History }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all flex items-center gap-3 ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-700'}`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
         </nav>
      </div>

      <main className="min-h-[60vh]">
        {activeTab === 'mocks' && (
          <div className="space-y-12">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularMockTests.map(test => (
                  <div key={test.id} className="group bg-white p-10 rounded-[4rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-indigo-400 transition-all flex flex-col justify-between overflow-hidden relative">
                     <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12 group-hover:scale-110 transition-transform duration-[3s]"><FileText className="w-48 h-48" /></div>
                     <div className="relative z-10">
                        <div className="flex justify-between items-start mb-10">
                           <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner"><Zap className="w-8 h-8" /></div>
                           <span className="px-3 py-1 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-lg">JEE MAINS</span>
                        </div>
                        <h4 className="text-2xl font-black text-slate-800 leading-tight italic tracking-tight mb-4">{test.name}</h4>
                        <div className="flex gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-10">
                           <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {test.duration}m</span>
                           <span className="flex items-center gap-2"><Target className="w-4 h-4" /> {test.questionIds.length} MCQs</span>
                        </div>
                     </div>
                     <button onClick={() => startTest(test)} className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-[10px] tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-indigo-600 transition-all shadow-xl relative z-10">Initiate Protocol</button>
                  </div>
                ))}
             </div>

             <section className="space-y-8 pt-12 border-t border-slate-100">
                <h3 className="text-3xl font-black text-slate-400 italic uppercase tracking-tighter">Previous Year Node</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   {archiveTests.map(test => (
                     <div key={test.id} className="bg-white/50 p-10 rounded-[3.5rem] border border-slate-200 border-dashed hover:bg-white hover:border-amber-400 transition-all flex flex-col justify-between">
                        <div>
                           <div className="flex justify-between mb-8">
                              <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl"><Bookmark className="w-6 h-6" /></div>
                              <span className="text-[10px] font-black uppercase text-amber-600 mt-2">Archive PYQ</span>
                           </div>
                           <h4 className="text-xl font-black text-slate-700 italic tracking-tight leading-tight mb-4">{test.name}</h4>
                        </div>
                        <button onClick={() => startTest(test)} className="w-full py-4 border-2 border-amber-100 text-amber-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-400 hover:text-white transition-all">Restore Session</button>
                     </div>
                   ))}
                </div>
             </section>
          </div>
        )}

        {activeTab === 'practice' && (
          <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden">
             <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-2xl font-black italic text-slate-800">Unit-Specific Drills</h3>
                <div className="flex gap-2">
                   {['Physics', 'Chemistry', 'Mathematics'].map(s => (
                     <button key={s} className="px-6 py-2 bg-white border border-slate-200 rounded-full text-[10px] font-black uppercase text-slate-500 hover:border-indigo-600 transition-all">{s}</button>
                   ))}
                </div>
             </div>
             <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {practiceTests.map(test => (
                  <button key={test.id} onClick={() => startTest(test)} className="p-6 bg-slate-50 rounded-3xl border border-transparent hover:border-indigo-400 hover:bg-white transition-all text-left flex items-center justify-between group">
                     <div>
                        <div className="text-[9px] font-black uppercase text-indigo-500 mb-1">{test.category} Drill</div>
                        <div className="text-sm font-bold text-slate-800">{test.name}</div>
                        <div className="text-[10px] font-bold text-slate-400 mt-2">{test.questionIds.length} Problems • {test.duration}m</div>
                     </div>
                     <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                  </button>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-8">
             <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="relative w-full md:w-96 group">
                   <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-600" />
                   <input 
                    type="text" value={historySearch} onChange={e => setHistorySearch(e.target.value)} 
                    placeholder="Search past attempts..." 
                    className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold shadow-sm outline-none focus:ring-4 focus:ring-indigo-50"
                   />
                </div>
                <div className="flex gap-4">
                   <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase text-slate-400 hover:text-indigo-600 transition-all shadow-sm">
                      <Download className="w-4 h-4" /> Export CSV
                   </button>
                </div>
             </div>

             <div className="bg-white rounded-[3rem] border border-slate-200 shadow-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                   <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                         <th className="p-8 text-[10px] font-black uppercase text-slate-400 tracking-widest">Session Logic</th>
                         <th className="p-8 text-[10px] font-black uppercase text-slate-400 tracking-widest">Date</th>
                         <th className="p-8 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Net Score</th>
                         <th className="p-8 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Stability</th>
                         <th className="p-8 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Review</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      {filteredHistory.map((res, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                           <td className="p-8">
                              <div className="flex items-center gap-5">
                                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${res.accuracy > 70 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                    <TrendingUp className="w-6 h-6" />
                                 </div>
                                 <div>
                                    <div className="font-black text-slate-800 text-lg italic tracking-tight">{res.testName}</div>
                                    <div className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mt-1">ID: SES-{i+1001} • {res.chapterIds.length} Nodes Involved</div>
                                 </div>
                              </div>
                           </td>
                           <td className="p-8">
                              <div className="flex items-center gap-2 text-xs font-black text-slate-400">
                                 <Calendar className="w-4 h-4 opacity-30" />
                                 {res.date}
                              </div>
                           </td>
                           <td className="p-8 text-center">
                              <div className="text-xl font-black text-slate-900">{res.score}<span className="text-slate-300 font-bold mx-1">/</span>{res.totalMarks}</div>
                           </td>
                           <td className="p-8 text-center">
                              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-tighter">
                                 {res.accuracy}% Acc
                              </div>
                           </td>
                           <td className="p-8 text-right">
                              <button className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm">
                                 <ExternalLink className="w-5 h-5" />
                              </button>
                           </td>
                        </tr>
                      ))}
                      {filteredHistory.length === 0 && (
                        <tr>
                           <td colSpan={5} className="p-20 text-center">
                              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                 <SearchCode className="w-10 h-10 text-slate-200" />
                              </div>
                              <p className="text-xs font-black text-slate-400 uppercase tracking-[0.4em]">Handshake Integrity: No local records match your query.</p>
                           </td>
                        </tr>
                      )}
                   </tbody>
                </table>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TestsView;
