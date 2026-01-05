
import React, { useState, useEffect } from 'react';
import { StudentData, MockTest, Question, TestResult, Chapter } from '../types';
import { api } from '../services/apiService';
import { 
  Clock, Target, Trophy, ArrowLeft, Award, Zap, 
  ListFilter, History, X, BookOpen, BarChart, 
  ChevronLeft, Lightbulb, Eye, CheckCircle, 
  ChevronRight, AlertCircle, Activity, TrendingUp, Menu
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
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-[0.2em]">Question Palette</h3>
            <p className="text-[10px] font-bold text-indigo-600 uppercase mt-0.5">{questions.length} Items Indexed</p>
          </div>
          <button onClick={() => setShowPalette(false)} className="lg:hidden p-2 bg-slate-100 rounded-lg"><X className="w-4 h-4" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
           <div className="grid grid-cols-5 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
             {questions.map((q, i) => (
               <button 
                key={q.id} 
                onClick={() => { setCurrentIdx(i); setShowPalette(false); }} 
                className={`h-11 md:h-12 rounded-xl flex items-center justify-center text-xs font-black transition-all border-2 ${
                  currentIdx === i ? 'border-indigo-600 scale-105 shadow-md z-10' : 'border-transparent'
                } ${
                  answers[q.id] !== undefined && answers[q.id] !== -1 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                  : 'bg-white text-slate-400 border-slate-100'
                }`}
               >
                 {i + 1}
               </button>
             ))}
           </div>
        </div>
        <div className="p-6 md:p-8 bg-white border-t border-slate-100 space-y-4 shrink-0">
           <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Attempted</span>
              <span className="text-xl font-black text-indigo-600 tabular-nums">{Object.values(answers).filter(v => v !== -1).length}</span>
           </div>
           <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Unvisited</span>
              <span className="text-xl font-black text-slate-300 tabular-nums">{questions.length - Object.keys(answers).length}</span>
           </div>
        </div>
      </div>
    );

    return (
      <div className="fixed inset-0 z-[200] bg-white flex flex-col font-sans overflow-hidden animate-in fade-in h-[100dvh]">
        {/* Header - Fixed Height */}
        <div className="h-16 md:h-20 bg-white border-b border-slate-200 px-4 md:px-10 flex items-center justify-between shrink-0 shadow-sm relative z-[210]">
          <div className="flex items-center gap-2 md:gap-6">
            <button onClick={handleExitTest} className="flex items-center gap-2 px-3 md:px-4 py-2 bg-rose-50 text-rose-600 rounded-lg md:rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-rose-100 transition-all border border-rose-100">
              <X className="w-3.5 h-3.5" /> <span className="hidden xs:inline">Exit</span>
            </button>
            <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
            <div className="hidden sm:block overflow-hidden">
               <h1 className="text-xs md:text-sm font-black text-slate-800 uppercase tracking-tight truncate max-w-[120px] md:max-w-xs">{activeTest.name}</h1>
               <div className="text-[8px] md:text-[9px] font-black text-indigo-500 uppercase tracking-widest">Active Test Environment</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-8">
            <div className="flex items-center gap-2 md:gap-3 bg-slate-100 px-3 md:px-5 py-1.5 md:py-2 rounded-lg md:rounded-xl border border-slate-200">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span className="font-mono text-sm md:text-xl font-black text-slate-900 tracking-tighter tabular-nums">{formatTimer(timeLeft)}</span>
            </div>
            <button onClick={() => setShowPalette(true)} className="lg:hidden p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Menu className="w-5 h-5" /></button>
            <button onClick={() => { if(confirm("Submit your answers for evaluation?")) handleFinalSubmit(); }} className="hidden xs:block bg-indigo-600 text-white px-4 md:px-8 py-2 md:py-2.5 rounded-lg md:rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">Submit</button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden relative">
          {/* Main Question Scroll Area */}
          <div className="flex-1 overflow-y-auto bg-white flex flex-col items-center custom-scrollbar">
            <div className="max-w-4xl w-full p-6 md:p-12 lg:p-20 space-y-8 md:space-y-12">
               <div className="flex justify-between items-center pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <span className="bg-slate-900 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-black text-[10px] md:text-xs">Q {currentIdx + 1}</span>
                    <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest hidden xs:block">{currentQ?.subject} • {currentQ?.difficulty}</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="bg-emerald-50 text-emerald-600 px-2 py-0.5 md:px-3 md:py-1 rounded text-[8px] md:text-[9px] font-black uppercase">+4.0</div>
                    <div className="bg-rose-50 text-rose-600 px-2 py-0.5 md:px-3 md:py-1 rounded text-[8px] md:text-[9px] font-black uppercase">-1.0</div>
                  </div>
               </div>
               <div className="space-y-8 md:space-y-12">
                  <p className="text-xl md:text-3xl font-black text-slate-800 leading-snug italic tracking-tight">{currentQ?.text || "Synchronizing question payload..."}</p>
                  <div className="grid grid-cols-1 gap-3 md:gap-4">
                    {currentQ?.options.map((opt, i) => (
                      <button 
                        key={i} 
                        onClick={() => setAnswers({...answers, [currentQ.id]: i})} 
                        className={`p-4 md:p-6 rounded-2xl border-2 text-left transition-all flex items-center group active:scale-[0.98] ${
                          answers[currentQ.id] === i 
                          ? 'border-indigo-600 bg-indigo-50/20 ring-4 ring-indigo-50 shadow-md' 
                          : 'border-slate-100 bg-slate-50 hover:border-indigo-200'
                        }`}
                      >
                        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center font-black mr-4 md:mr-6 shrink-0 transition-all ${
                          answers[currentQ.id] === i ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-200 group-hover:border-indigo-300'
                        }`}>
                          {String.fromCharCode(65+i)}
                        </div>
                        <span className={`text-sm md:text-lg font-bold italic ${answers[currentQ.id] === i ? 'text-indigo-900' : 'text-slate-600'}`}>{opt}</span>
                      </button>
                    ))}
                  </div>
               </div>
               {/* Mobile Bottom Spacer for fixed Nav */}
               <div className="h-24 lg:hidden"></div>
            </div>
          </div>

          {/* Desktop Sidebar Palette */}
          <div className="w-80 bg-slate-50 border-l border-slate-200 flex flex-col hidden lg:flex shrink-0">
             <QuestionPalette />
          </div>

          {/* Mobile Overlay Palette */}
          {showPalette && (
            <div className="lg:hidden fixed inset-0 z-[220] flex animate-in fade-in">
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowPalette(false)}></div>
              <div className="ml-auto w-[85%] max-w-sm bg-white shadow-2xl relative flex flex-col animate-in slide-in-from-right duration-300">
                <QuestionPalette />
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Bar - Fixed at bottom */}
        <div className="h-20 bg-white border-t border-slate-200 px-4 md:px-12 flex items-center justify-between shrink-0 relative z-[210] pb-safe">
          <button 
            disabled={currentIdx === 0} 
            onClick={() => setCurrentIdx(currentIdx - 1)} 
            className="flex items-center gap-2 md:gap-3 px-4 md:px-8 py-3 text-slate-400 font-black text-[10px] md:text-xs uppercase tracking-widest hover:text-indigo-600 disabled:opacity-10 transition-all"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" /> <span className="hidden sm:inline">Previous</span>
          </button>
          
          <div className="flex gap-2 md:gap-4">
            <button 
              onClick={() => setAnswers({...answers, [currentQ.id]: -1})} 
              className="px-4 md:px-8 py-3 text-rose-500 font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-rose-50 rounded-lg md:rounded-xl transition-all"
            >
              <span className="hidden xs:inline">Clear</span><span className="xs:hidden">X</span>
            </button>
            <button 
              onClick={() => { 
                if (currentIdx < questions.length - 1) setCurrentIdx(currentIdx + 1); 
                else if (confirm("Evaluate all final answers?")) handleFinalSubmit(); 
              }} 
              className="bg-indigo-600 text-white px-6 md:px-12 py-3 md:py-3.5 rounded-lg md:rounded-xl font-black text-[10px] md:text-xs uppercase tracking-[0.2em] hover:bg-indigo-700 shadow-xl shadow-indigo-100 flex items-center gap-3 md:gap-4 transition-all"
            >
              {currentIdx === questions.length - 1 ? 'Finish' : 'Next'} <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (viewingResult) {
    const testSource = (data.mockTests || []).find(t => t.id === viewingResult.testId) || (initialTest && initialTest.id === viewingResult.testId ? initialTest : null);
    const questions = (data.questions || []).filter(q => testSource?.questionIds.includes(q.id));
    return (
      <div className="fixed inset-0 z-[250] bg-slate-50 flex flex-col font-sans animate-in zoom-in-95 duration-500 overflow-hidden h-[100dvh]">
        <div className="h-16 md:h-20 bg-white border-b border-slate-200 px-6 md:px-8 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg"><Award className="w-5 h-5 md:w-6 md:h-6" /></div>
            <div>
              <h2 className="text-xs md:text-sm font-black text-slate-800 uppercase italic tracking-tighter truncate max-w-[150px] md:max-w-xs">Result: {viewingResult.testName}</h2>
              <div className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">Graded Performance Hub</div>
            </div>
          </div>
          <button 
            onClick={() => { if (onExit) onExit(); else { setViewingResult(null); setTestMode(false); setIsSubmitted(false); } }} 
            className="text-[9px] md:text-[10px] font-black text-white uppercase tracking-widest bg-slate-900 px-4 md:px-8 py-2 md:py-2.5 rounded-lg hover:bg-black transition-all shadow-xl"
          >
            {onExit ? 'Finish' : 'Close'}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-6xl mx-auto p-6 md:p-12 lg:p-16 space-y-8 md:space-y-12 pb-32">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3.5rem] border border-slate-200 text-center shadow-sm">
                <div className="text-[8px] md:text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Aggregate</div>
                <div className="text-3xl md:text-6xl font-black text-slate-900 tracking-tighter tabular-nums">{viewingResult.score}<span className="text-xs md:text-xl opacity-20 ml-1">/{viewingResult.totalMarks}</span></div>
              </div>
              <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3.5rem] border border-slate-200 text-center shadow-sm">
                <div className="text-[8px] md:text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Precision</div>
                <div className="text-3xl md:text-6xl font-black text-emerald-500 tracking-tighter tabular-nums">{viewingResult.accuracy}%</div>
              </div>
              <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3.5rem] border border-slate-200 text-center shadow-sm col-span-2 md:col-span-1">
                <div className="text-[8px] md:text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Verdict</div>
                <div className="text-lg md:text-2xl font-black text-indigo-600 uppercase italic mt-1 truncate">{viewingResult.accuracy > 70 ? 'Excellent' : viewingResult.accuracy > 40 ? 'Satisfactory' : 'Critical'}</div>
              </div>
              <div className="bg-slate-900 p-6 md:p-10 rounded-[2rem] md:rounded-[3.5rem] shadow-2xl text-white text-center col-span-2 md:col-span-1">
                <div className="text-[8px] md:text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2">AIR EST.</div>
                <div className="text-2xl md:text-4xl font-black italic tracking-tighter text-indigo-400">TOP 1%</div>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] md:rounded-[4rem] border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-8 md:p-12 border-b bg-slate-50/50 flex justify-between items-center">
                 <h3 className="text-2xl md:text-3xl font-black italic text-slate-800 flex items-center gap-4 md:gap-6"><ListFilter className="w-8 h-8 md:w-10 md:h-10 text-indigo-600" /> Response Audit</h3>
              </div>
              <div className="p-6 md:p-12 space-y-8 md:space-y-10">
                {questions.map((q, i) => { 
                  const userAns = answers[q.id]; 
                  const isCorrect = userAns === q.correctAnswer; 
                  const isSkipped = userAns === undefined || userAns === -1; 
                  return (
                    <div key={q.id} className={`p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border-2 transition-all ${isCorrect ? 'border-emerald-100 bg-emerald-50/5' : isSkipped ? 'border-slate-100 bg-slate-50' : 'border-rose-100 bg-rose-50/5'}`}>
                      <div className="flex flex-col md:flex-row justify-between items-start gap-4 md:gap-8 mb-6 md:mb-10">
                        <div className="flex gap-4 md:gap-8">
                          <span className="w-10 h-10 md:w-14 md:h-14 bg-white border-2 border-slate-200 rounded-xl md:rounded-[1.5rem] flex items-center justify-center font-black text-slate-400 text-sm md:text-lg shadow-inner shrink-0">Q{i+1}</span>
                          <p className="text-lg md:text-2xl font-black text-slate-800 italic leading-snug tracking-tight">{q.text}</p>
                        </div>
                        <span className={`px-4 md:px-8 py-1.5 md:py-2.5 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest border shrink-0 ${isCorrect ? 'bg-emerald-500 text-white border-emerald-600' : isSkipped ? 'bg-white text-slate-400 border-slate-200' : 'bg-rose-500 text-white border-rose-600'}`}>{isCorrect ? 'Correct' : isSkipped ? 'Skipped' : 'Incorrect'}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                        {q.options.map((opt, oi) => (
                          <div key={oi} className={`p-4 md:p-6 rounded-xl md:rounded-2xl text-xs md:text-base font-black border-2 transition-all ${oi === q.correctAnswer ? 'bg-emerald-500 border-emerald-600 text-white shadow-lg' : oi === userAns ? 'bg-rose-500 border-rose-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400'}`}>
                            <span className="opacity-40 mr-2 md:mr-4 italic">{String.fromCharCode(65+oi)}.</span> {opt}
                          </div>
                        ))}
                      </div>
                      {q.explanation && (
                        <div className="mt-8 md:mt-10 p-6 md:p-8 bg-indigo-50/50 rounded-[1.5rem] md:rounded-[2.5rem] border border-indigo-100 flex gap-4 md:gap-8">
                          <div className="p-2 md:p-3 bg-indigo-600 text-white rounded-lg md:rounded-xl h-fit shadow-xl shadow-indigo-100 shrink-0"><Lightbulb className="w-4 h-4 md:w-6 md:h-6" /></div>
                          <div className="space-y-1">
                            <div className="text-[8px] md:text-[10px] font-black uppercase text-indigo-600 tracking-widest">Strategic Insight</div>
                            <p className="text-sm md:text-base font-bold text-slate-600 italic leading-relaxed">"{q.explanation}"</p>
                          </div>
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

  // Filter library and history to strictly only show Mock Exams (ADMIN category)
  const mockTestHistory = (data?.testHistory || []).filter(res => res.category === 'ADMIN');
  const mockTestsLibrary = (data?.mockTests || []).filter(t => t.category === 'ADMIN');

  return (
    <div className="max-w-7xl mx-auto space-y-8 md:space-y-12 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 md:gap-10">
        <div className="px-2 md:px-0">
          <div className="text-[9px] md:text-[11px] font-black uppercase text-indigo-600 tracking-[0.4em] mb-2 md:mb-4 flex items-center gap-3">
            <Target className="w-4 h-4 md:w-5 md:h-5" /> Standardized Performance Testing
          </div>
          <h2 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter italic uppercase leading-none font-space">TEST <br className="hidden md:block" /><span className="text-indigo-600">CENTRE.</span></h2>
        </div>
        <nav className="flex bg-white p-1.5 md:p-2 rounded-2xl md:rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden shrink-0 w-full lg:w-auto">
          {[
            { id: 'library', label: 'Library', icon: BookOpen }, 
            { id: 'history', label: 'History', icon: History }
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id as any)} 
              className={`flex-1 lg:flex-none px-6 md:px-10 py-3 md:py-3.5 rounded-xl md:rounded-[2rem] text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 md:gap-3 ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-700'}`}
            >
              <tab.icon className="w-3.5 h-3.5 md:w-4 md:h-4" /> {tab.label}
            </button>
          ))}
        </nav>
      </div>
      
      <main className="animate-in slide-in-from-bottom-4 duration-700">
        {activeTab === 'library' ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 px-2 md:px-0">
            {mockTestsLibrary.length === 0 ? (
              <div className="col-span-full py-24 md:py-40 text-center bg-white rounded-[2.5rem] md:rounded-[4rem] border-4 border-dashed border-slate-100 flex flex-col items-center gap-4 md:gap-6">
                <Target className="w-10 h-10 md:w-12 md:h-12 text-slate-200" />
                <p className="text-[10px] md:text-xs font-black uppercase text-slate-400 tracking-widest italic px-4">No active exam sessions synchronized from central node.</p>
              </div>
            ) : (
              mockTestsLibrary.map(test => (
                <div key={test.id} className="bg-white p-6 md:p-7 rounded-[2rem] md:rounded-3xl border border-slate-200 hover:border-indigo-400 hover:shadow-xl transition-all flex flex-col justify-between group h-60 md:h-64 relative overflow-hidden active:scale-[0.98]">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform"><Zap className="w-20 md:w-24 h-20 md:h-24 text-indigo-600" /></div>
                  <div className="relative z-10 space-y-3 md:space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="px-2.5 py-1 bg-slate-900 text-white rounded-full text-[7px] md:text-[8px] font-black tracking-widest uppercase">{test.difficulty}</span>
                      <Clock className="w-3.5 h-3.5 text-slate-300" />
                    </div>
                    <h4 className="text-base md:text-lg font-black text-slate-800 italic leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2 tracking-tight">{test.name}</h4>
                    <div className="flex gap-3 md:gap-4">
                      <div className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase flex items-center gap-1.5"><Clock className="w-3 h-3 text-indigo-400" /> {test.duration}m</div>
                      <div className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase flex items-center gap-1.5"><Target className="w-3 h-3 text-rose-400" /> {(test.questionIds || []).length} Qs</div>
                    </div>
                  </div>
                  <button onClick={() => startTest(test)} className="w-full py-3 md:py-3.5 bg-slate-50 text-slate-900 rounded-xl md:rounded-2xl font-black text-[8px] md:text-[9px] font-space italic uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-sm">Initialize Exam</button>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="bg-white rounded-[2rem] md:rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-right duration-500 mx-2 md:mx-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr className="text-[8px] md:text-[9px] font-black uppercase text-slate-400 tracking-[0.3em]">
                    <th className="p-6 md:p-8">Exam Metadata Identity</th>
                    <th className="p-6 md:p-8 text-center">Session Timestamp</th>
                    <th className="p-6 md:p-8 text-center">Score Delta</th>
                    <th className="p-6 md:p-8 text-center">Precision %</th>
                    <th className="p-6 md:p-8 text-right">Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {mockTestHistory.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-24 md:p-32 text-center text-slate-300 font-black uppercase text-[10px] md:text-xs tracking-widest italic">No historical exam nodes detected.</td>
                    </tr>
                  ) : (
                    mockTestHistory.map((res, i) => (
                      <tr key={i} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="p-6 md:p-8 font-black text-slate-800 italic text-base md:text-lg group-hover:text-indigo-600 transition-colors tracking-tight">{res.testName}</td>
                        <td className="p-6 md:p-8 text-center text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">{res.date}</td>
                        <td className="p-6 md:p-8 text-center font-black text-xl md:text-2xl text-slate-900 tabular-nums">{res.score}<span className="text-xs opacity-20 mx-1">/</span>{res.totalMarks}</td>
                        <td className="p-6 md:p-8 text-center">
                          <span className={`px-3 md:px-5 py-1 md:py-1.5 rounded-full text-[8px] md:text-[9px] font-black tracking-widest border whitespace-nowrap ${res.accuracy > 70 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : res.accuracy > 40 ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>{res.accuracy}% ACC</span>
                        </td>
                        <td className="p-6 md:p-8 text-right">
                          <button onClick={() => setViewingResult(res)} className="p-3 md:p-4 bg-white border border-slate-100 text-indigo-600 rounded-xl md:rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm group-hover:scale-105 active:scale-95">
                            <Eye className="w-4 h-4 md:w-5 md:h-5" />
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
