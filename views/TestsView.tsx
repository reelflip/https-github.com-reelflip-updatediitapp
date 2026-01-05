
import React, { useState, useEffect } from 'react';
import { StudentData, MockTest, Question, TestResult, Chapter } from '../types';
import { api } from '../services/apiService';
import { 
  Clock, Target, Trophy, ArrowLeft, Award, Zap, 
  ListFilter, History, X, BookOpen, BarChart, 
  ChevronLeft, Lightbulb, Eye, CheckCircle, 
  ChevronRight, AlertCircle, Activity, TrendingUp, Menu, Send
} from 'lucide-react';

interface TestsViewProps {
  data: StudentData;
  setData: (data: StudentData) => void;
  initialTest?: MockTest | null;
  onExit?: () => void;
}

const TestsView: React.FC<TestsViewProps> = ({ data, setData, initialTest = null, onExit }) => {
  const [activeTab, setActiveTab] = useState<'library' | 'history'>('library');
  const [activeTest, setActiveTest] = useState<MockTest | null>(initialTest);
  const [testMode, setTestMode] = useState(!!initialTest);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  
  const [timeLeft, setTimeLeft] = useState(initialTest && initialTest.duration ? initialTest.duration * 60 : 0);
  const [viewingResult, setViewingResult] = useState<TestResult | null>(null);

  useEffect(() => {
    if (testMode && timeLeft > 0 && !isSubmitted) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft <= 0 && testMode && !isSubmitted && activeTest && activeTest.duration > 0) {
      handleFinalSubmit();
    }
  }, [testMode, timeLeft, isSubmitted, activeTest]);

  const startTest = (test: MockTest) => {
    setActiveTest(test);
    setTestMode(true);
    setCurrentIdx(0);
    setAnswers({});
    setIsSubmitted(false);
    setTimeLeft(test.duration * 60);
    setViewingResult(null);
  };

  const handleFinalSubmit = async () => {
    if (!activeTest) return;
    if (isSubmitted) return;

    if (!confirm("Terminate session and evaluate performance? Partial progress will be graded.")) return;

    let score = 0;
    let correctCount = 0;
    
    (activeTest.questionIds || []).forEach(id => {
      const q = (data.questions || []).find(qu => qu.id === id);
      if (q) {
        const userAns = answers[id];
        if (userAns === q.correctAnswer) { 
          score += 4; 
          correctCount++; 
        } else if (userAns !== undefined && userAns !== -1) { 
          score -= 1; 
        }
      }
    });

    const accuracy = Math.round((correctCount / (activeTest.questionIds.length || 1)) * 100);

    const result: TestResult = {
      testId: activeTest.id,
      testName: activeTest.name,
      score: score,
      totalMarks: activeTest.totalMarks || (activeTest.questionIds.length * 4),
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      chapterIds: activeTest.chapterIds || [],
      accuracy: accuracy,
      category: activeTest.category || 'ADMIN'
    };

    const chapters = data?.chapters || [];
    const updatedChapters = chapters.map(ch => {
        if ((activeTest.chapterIds || []).includes(ch.id)) {
            const newAcc = (ch.accuracy || 0) === 0 ? accuracy : Math.round((ch.accuracy + accuracy) / 2);
            return { 
                ...ch, 
                accuracy: newAcc,
                timeSpentTests: (ch.timeSpentTests || 0) + (activeTest.duration * 60),
                timeSpent: (ch.timeSpent || 0) + (activeTest.duration * 60)
            };
        }
        return ch;
    });

    const updatedHistory = [result, ...(data?.testHistory || [])];
    const newData = { ...data, testHistory: updatedHistory, chapters: updatedChapters };
    
    setIsSubmitted(true);
    setViewingResult(result);
    setData(newData);
    
    if (api.getMode() === 'LIVE') {
      await api.updateStudentData(data.id, newData);
    }
  };

  const formatTimer = (s: number) => {
    const m = Math.floor(s / 60);
    const secs = s % 60;
    return `${m}:${secs.toString().padStart(2, '0')}`;
  };

  const handleExitTest = () => {
    if (confirm("Are you sure you want to exit? Your progress in this test will be lost forever.")) {
      if (onExit) onExit();
      else {
        setTestMode(false);
        setActiveTest(null);
        setAnswers({});
        setCurrentIdx(0);
      }
    }
  };

  if (testMode && activeTest && !isSubmitted) {
    const questions = (data.questions || []).filter(q => (activeTest.questionIds || []).includes(q.id));
    const currentQ = questions[currentIdx];

    const QuestionPalette = () => (
      <div className="flex flex-col h-full bg-slate-50 lg:bg-white overflow-hidden">
        <div className="p-6 md:p-8 bg-white border-b border-slate-100 flex justify-between items-center shrink-0">
          <div>
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-[0.2em]">Questions</h3>
            <p className="text-[10px] font-bold text-indigo-600 uppercase mt-0.5">{questions.length} Items</p>
          </div>
          <button onClick={() => setShowPalette(false)} className="lg:hidden p-2 bg-slate-100 rounded-lg"><X className="w-4 h-4" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
           <div className="grid grid-cols-5 md:grid-cols-4 lg:grid-cols-5 gap-2">
             {questions.map((q, i) => (
               <button 
                key={q.id} 
                onClick={() => { setCurrentIdx(i); setShowPalette(false); }} 
                className={`h-10 rounded-lg flex items-center justify-center text-[10px] font-black transition-all border-2 ${
                  currentIdx === i ? 'border-indigo-600 ring-2 ring-indigo-50 shadow-sm' : 'border-transparent'
                } ${
                  answers[q.id] !== undefined && answers[q.id] !== -1 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white text-slate-400 border-slate-100'
                }`}
               >
                 {i + 1}
               </button>
             ))}
           </div>
        </div>
        <div className="p-6 md:p-8 bg-white border-t border-slate-100 space-y-3 shrink-0">
           <div className="flex justify-between items-center">
              <span className="text-[9px] font-black uppercase text-slate-400">Attempted</span>
              <span className="text-sm font-black text-indigo-600">{Object.values(answers).filter(v => v !== -1).length}</span>
           </div>
           <div className="flex justify-between items-center">
              <span className="text-[9px] font-black uppercase text-slate-400">Remaining</span>
              <span className="text-sm font-black text-slate-300">{questions.length - Object.keys(answers).length}</span>
           </div>
           <button onClick={handleFinalSubmit} className="w-full py-4 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest mt-2">Submit Test</button>
        </div>
      </div>
    );

    return (
      <div className="fixed inset-0 z-[200] bg-[#fcfdfe] flex flex-col font-sans overflow-hidden animate-in fade-in h-[100dvh]">
        {/* Header - Optimized for touch and visibility */}
        <div className="h-16 md:h-20 bg-white border-b border-slate-200 px-3 md:px-10 flex items-center justify-between shrink-0 shadow-sm relative z-[210]">
          <button onClick={handleExitTest} className="p-2.5 md:px-4 md:py-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex-1 flex justify-center px-4">
            <div className="flex items-center gap-2 md:gap-3 bg-slate-900 px-4 md:px-6 py-2 md:py-2.5 rounded-xl md:rounded-2xl border border-slate-800 shadow-xl">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-mono text-sm md:text-xl font-black text-white tracking-tighter tabular-nums">{formatTimer(timeLeft)}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button onClick={() => setShowPalette(true)} className="lg:hidden p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-indigo-50 hover:text-indigo-600">
               <Menu className="w-5 h-5" />
            </button>
            <button 
              onClick={handleFinalSubmit} 
              className="bg-emerald-500 text-white p-2.5 md:px-8 md:py-2.5 rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-emerald-600 shadow-lg shadow-emerald-100 flex items-center gap-2"
            >
              <Send className="w-4 h-4" /> <span className="hidden md:inline">Submit Test</span>
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden relative">
          <div className="flex-1 overflow-y-auto bg-white flex flex-col items-center custom-scrollbar">
            <div className="max-w-4xl w-full p-6 md:p-12 lg:p-20 space-y-10">
               <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">{currentQ?.subject} • SECTION 1</span>
                    <h2 className="text-xs md:text-sm font-black text-slate-400 uppercase tracking-[0.2em]">QUESTION {currentIdx + 1} OF {questions.length}</h2>
                  </div>
                  <div className="flex gap-2">
                    <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase">+4</div>
                    <div className="bg-rose-50 text-rose-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase">-1</div>
                  </div>
               </div>
               
               <div className="space-y-8 md:space-y-12">
                  <p className="text-xl md:text-3xl font-black text-slate-800 leading-snug italic tracking-tight">{currentQ?.text || "Synchronizing data..."}</p>
                  <div className="grid grid-cols-1 gap-3 md:gap-4">
                    {currentQ?.options.map((opt, i) => (
                      <button 
                        key={i} 
                        onClick={() => setAnswers({...answers, [currentQ.id]: i})} 
                        className={`p-5 md:p-7 rounded-[1.5rem] md:rounded-[2rem] border-2 text-left transition-all flex items-center group active:scale-[0.98] ${
                          answers[currentQ.id] === i 
                          ? 'border-indigo-600 bg-indigo-50/30 ring-4 ring-indigo-50 shadow-md' 
                          : 'border-slate-100 bg-slate-50 hover:border-indigo-200'
                        }`}
                      >
                        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center font-black mr-4 md:mr-6 shrink-0 transition-all ${
                          answers[currentQ.id] === i ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400 border border-slate-200'
                        }`}>
                          {String.fromCharCode(65+i)}
                        </div>
                        <span className={`text-sm md:text-lg font-bold italic ${answers[currentQ.id] === i ? 'text-indigo-900' : 'text-slate-600'}`}>{opt}</span>
                      </button>
                    ))}
                  </div>
               </div>
               <div className="h-32"></div>
            </div>
          </div>

          <div className="w-80 bg-slate-50 border-l border-slate-200 flex flex-col hidden lg:flex shrink-0">
             <QuestionPalette />
          </div>

          {showPalette && (
            <div className="lg:hidden fixed inset-0 z-[220] flex animate-in fade-in">
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowPalette(false)}></div>
              <div className="ml-auto w-[80%] max-w-sm bg-white shadow-2xl relative flex flex-col animate-in slide-in-from-right duration-300">
                <QuestionPalette />
              </div>
            </div>
          )}
        </div>

        <div className="h-20 bg-white border-t border-slate-200 px-4 md:px-12 flex items-center justify-between shrink-0 relative z-[210] pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
          <button 
            disabled={currentIdx === 0} 
            onClick={() => setCurrentIdx(currentIdx - 1)} 
            className="flex items-center gap-2 text-slate-400 font-black text-[10px] md:text-xs uppercase tracking-widest hover:text-indigo-600 disabled:opacity-20 px-4 py-3"
          >
            <ChevronLeft className="w-5 h-5" /> Prev
          </button>
          
          <div className="flex gap-3">
            <button 
              onClick={() => setAnswers({...answers, [currentQ.id]: -1})} 
              className="px-6 py-3 text-rose-500 font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 rounded-xl"
            >
              Clear
            </button>
            <button 
              onClick={() => currentIdx < questions.length - 1 && setCurrentIdx(currentIdx + 1)} 
              disabled={currentIdx === questions.length - 1}
              className="bg-slate-900 text-white px-8 md:px-14 py-3 md:py-3.5 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.2em] shadow-xl flex items-center gap-3 disabled:opacity-20"
            >
              Next <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (viewingResult) {
    // Fix: Added definition for 'questions' variable which was missing in this scope.
    // It attempts to resolve question objects from data.questions based on testId or chapterIds.
    const questions = (activeTest && activeTest.id === viewingResult.testId)
      ? (data.questions || []).filter(q => (activeTest.questionIds || []).includes(q.id))
      : (() => {
          const test = data.mockTests.find(t => t.id === viewingResult.testId);
          if (test) return (data.questions || []).filter(q => (test.questionIds || []).includes(q.id));
          return (data.questions || []).filter(q => (viewingResult.chapterIds || []).includes(q.topicId)).slice(0, 20);
        })();

    return (
      <div className="fixed inset-0 z-[250] bg-slate-50 flex flex-col font-sans animate-in zoom-in-95 duration-500 overflow-hidden h-[100dvh]">
        <div className="h-16 md:h-20 bg-white border-b border-slate-200 px-6 md:px-8 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg"><Award className="w-5 h-5 md:w-6 md:h-6" /></div>
            <div>
              <h2 className="text-xs md:text-sm font-black text-slate-800 uppercase italic tracking-tighter truncate max-w-[150px] md:max-w-xs">Analysis: {viewingResult.testName}</h2>
              <div className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">Graded Performance</div>
            </div>
          </div>
          <button 
            onClick={() => { if (onExit) onExit(); else { setViewingResult(null); setTestMode(false); setIsSubmitted(false); } }} 
            className="text-[9px] md:text-[10px] font-black text-white uppercase tracking-widest bg-slate-900 px-6 py-2.5 rounded-xl hover:bg-black transition-all shadow-xl"
          >
            {onExit ? 'Finish' : 'Close Audit'}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-6xl mx-auto p-6 md:p-12 lg:p-16 space-y-8 md:space-y-12 pb-32">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-[2rem] border border-slate-200 text-center shadow-sm">
                <div className="text-[8px] md:text-[9px] font-black uppercase text-slate-400 mb-1">Score</div>
                <div className="text-2xl md:text-5xl font-black text-slate-900 tabular-nums">{viewingResult.score}<span className="text-[10px] md:text-xl opacity-20 ml-1">/{viewingResult.totalMarks}</span></div>
              </div>
              <div className="bg-white p-6 rounded-[2rem] border border-slate-200 text-center shadow-sm">
                <div className="text-[8px] md:text-[9px] font-black uppercase text-slate-400 mb-1">Precision</div>
                <div className="text-2xl md:text-5xl font-black text-emerald-500 tabular-nums">{viewingResult.accuracy}%</div>
              </div>
              <div className="bg-white p-6 rounded-[2rem] border border-slate-200 text-center shadow-sm col-span-2 md:col-span-1">
                <div className="text-[8px] md:text-[9px] font-black uppercase text-slate-400 mb-1">Status</div>
                <div className="text-lg md:text-2xl font-black text-indigo-600 uppercase italic mt-1">{viewingResult.accuracy > 70 ? 'Excellent' : 'In Review'}</div>
              </div>
              <div className="bg-slate-900 p-6 rounded-[2rem] shadow-2xl text-white text-center col-span-2 md:col-span-1">
                <div className="text-[8px] md:text-[9px] font-black uppercase text-slate-500 mb-1">Simulated Rank</div>
                <div className="text-xl md:text-3xl font-black italic text-indigo-400">TOP 1.2%</div>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] md:rounded-[4rem] border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-8 border-b bg-slate-50 flex items-center gap-4">
                 <ListFilter className="w-6 h-6 text-indigo-600" />
                 <h3 className="text-lg font-black italic text-slate-800 uppercase">Response Audit</h3>
              </div>
              <div className="p-6 md:p-12 space-y-8">
                {questions.map((q, i) => { 
                  const userAns = answers[q.id]; 
                  const isCorrect = userAns === q.correctAnswer; 
                  const isSkipped = userAns === undefined || userAns === -1; 
                  return (
                    <div key={q.id} className={`p-6 md:p-10 rounded-[2rem] border-2 ${isCorrect ? 'border-emerald-100 bg-emerald-50/5' : isSkipped ? 'border-slate-100 bg-slate-50' : 'border-rose-100 bg-rose-50/5'}`}>
                      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
                        <div className="flex gap-4">
                          <span className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center font-black text-slate-400 text-sm shrink-0">Q{i+1}</span>
                          <p className="text-lg md:text-2xl font-black text-slate-800 italic leading-snug tracking-tight">{q.text}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {q.options.map((opt, oi) => (
                          <div key={oi} className={`p-4 rounded-xl text-xs md:text-base font-black border-2 transition-all ${oi === q.correctAnswer ? 'bg-emerald-500 border-emerald-600 text-white' : oi === userAns ? 'bg-rose-500 border-rose-600 text-white' : 'bg-white border-slate-100 text-slate-400'}`}>
                            <span className="opacity-40 mr-2 italic">{String.fromCharCode(65+oi)}.</span> {opt}
                          </div>
                        ))}
                      </div>
                      {q.explanation && (
                        <div className="mt-8 p-6 bg-indigo-50 border border-indigo-100 rounded-2xl flex gap-4">
                          <Lightbulb className="w-6 h-6 text-indigo-600 shrink-0" />
                          <p className="text-sm font-bold text-slate-600 italic leading-relaxed">"{q.explanation}"</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const mockTestHistory = (data?.testHistory || []).filter(res => res.category === 'ADMIN');
  const mockTestsLibrary = (data?.mockTests || []).filter(t => t.category === 'ADMIN');

  return (
    <div className="max-w-7xl mx-auto space-y-8 md:space-y-12 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div className="px-2">
          <div className="text-[9px] md:text-[11px] font-black uppercase text-indigo-600 tracking-[0.4em] mb-3 flex items-center gap-3">
            <Target className="w-4 h-4" /> PERFORMANCE EVALUATION CENTER
          </div>
          <h2 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter italic uppercase leading-none font-space">TEST <span className="text-indigo-600">CENTRE.</span></h2>
        </div>
        <nav className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-2xl shrink-0 w-full lg:w-auto">
          {[
            { id: 'library', label: 'Exams', icon: BookOpen }, 
            { id: 'history', label: 'Results', icon: History }
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id as any)} 
              className={`flex-1 lg:flex-none px-8 md:px-10 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-700'}`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </nav>
      </div>
      
      <main className="animate-in slide-in-from-bottom-4 duration-700 px-2 md:px-0">
        {activeTab === 'library' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {mockTestsLibrary.length === 0 ? (
              <div className="col-span-full py-40 text-center bg-white rounded-[3rem] border-4 border-dashed border-slate-100 flex flex-col items-center gap-4">
                <Target className="w-12 h-12 text-slate-200" />
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest italic">No active exam nodes synchronized.</p>
              </div>
            ) : (
              mockTestsLibrary.map(test => (
                <div key={test.id} className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 hover:border-indigo-400 hover:shadow-2xl transition-all flex flex-col justify-between group h-64 relative overflow-hidden active:scale-[0.98]">
                  <div className="absolute top-0 right-0 p-4 opacity-5"><Zap className="w-24 h-24 text-indigo-600" /></div>
                  <div className="relative z-10 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="px-3 py-1 bg-slate-900 text-white rounded-full text-[8px] font-black tracking-widest uppercase">{test.difficulty}</span>
                      <Clock className="w-4 h-4 text-slate-200" />
                    </div>
                    <h4 className="text-lg font-black text-slate-800 italic leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2">{test.name}</h4>
                    <div className="flex gap-4">
                      <div className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> {test.duration}m</div>
                      <div className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-2"><Target className="w-3.5 h-3.5" /> {(test.questionIds || []).length} Qs</div>
                    </div>
                  </div>
                  <button onClick={() => startTest(test)} className="w-full py-4 bg-slate-50 text-slate-900 rounded-xl md:rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-sm">Initialize Exam</button>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-right duration-500">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[700px]">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr className="text-[9px] font-black uppercase text-slate-400 tracking-[0.3em]">
                    <th className="p-8">Exam Module</th>
                    <th className="p-8 text-center">Date</th>
                    <th className="p-8 text-center">Aggregate</th>
                    <th className="p-8 text-center">Precision</th>
                    <th className="p-8 text-right">Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {mockTestHistory.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-32 text-center text-slate-300 font-black uppercase text-xs tracking-widest italic">No historical data available.</td>
                    </tr>
                  ) : (
                    mockTestHistory.map((res, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="p-8 font-black text-slate-800 italic text-lg group-hover:text-indigo-600 transition-colors">{res.testName}</td>
                        <td className="p-8 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">{res.date}</td>
                        <td className="p-8 text-center font-black text-2xl text-slate-900 tabular-nums">{res.score}<span className="text-xs opacity-20 mx-1">/</span>{res.totalMarks}</td>
                        <td className="p-8 text-center">
                          <span className={`px-5 py-1.5 rounded-full text-[9px] font-black tracking-widest border ${res.accuracy > 70 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>{res.accuracy}% ACC</span>
                        </td>
                        <td className="p-8 text-right">
                          <button onClick={() => setViewingResult(res)} className="p-4 bg-white border border-slate-100 text-indigo-600 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                            <Eye className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))
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
