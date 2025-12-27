
import React, { useState, useEffect } from 'react';
import { StudentData, MockTest, Question, TestResult, Chapter } from '../types';
import { api } from '../services/apiService';
import { calculateConfidenceLevel } from '../services/intelligenceService';
import { 
  Clock, Target, Trophy, ArrowLeft, Award, Zap, 
  ListFilter, History, X, BookOpen, BarChart, 
  ChevronLeft, Lightbulb, Eye, CheckCircle, 
  ChevronRight, AlertCircle, Activity, TrendingUp
} from 'lucide-react';

interface TestsViewProps {
  data: StudentData;
  setData: (data: StudentData) => void;
  initialTest?: MockTest | null;
  onExit?: () => void;
}

const TestsView: React.FC<TestsViewProps> = ({ data, setData, initialTest = null, onExit }) => {
  const [activeTab, setActiveTab] = useState<'library' | 'history' | 'analytics'>('library');
  const [activeTest, setActiveTest] = useState<MockTest | null>(initialTest);
  const [testMode, setTestMode] = useState(!!initialTest);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Safe initialization of timeLeft
  const [timeLeft, setTimeLeft] = useState(initialTest && initialTest.duration ? initialTest.duration * 60 : 0);
  const [viewingResult, setViewingResult] = useState<TestResult | null>(null);

  useEffect(() => {
    // Ensure we don't auto-submit if the duration hasn't been set yet or if testMode is false
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
    let correct = 0;
    
    activeTest.questionIds.forEach(id => {
      const q = data.questions.find(qu => qu.id === id);
      if (q) {
        const userAns = answers[id];
        if (userAns === q.correctAnswer) { 
          score += 4; 
          correct++; 
        } else if (userAns !== undefined && userAns !== -1) { 
          score -= 1; 
        }
      }
    });

    const result: TestResult = {
      testId: activeTest.id,
      testName: activeTest.name,
      score: score,
      totalMarks: activeTest.totalMarks || (activeTest.questionIds.length * 4),
      date: new Date().toISOString().split('T')[0],
      chapterIds: activeTest.chapterIds,
      accuracy: Math.round((correct / (activeTest.questionIds.length || 1)) * 100),
      category: activeTest.category || 'ADMIN'
    };

    setIsSubmitted(true);
    setViewingResult(result);

    const updatedHistory = [result, ...data.testHistory];
    setData({ ...data, testHistory: updatedHistory });
    await api.saveEntity('Result', result);
  };

  const formatTimer = (s: number) => {
    const m = Math.floor(s / 60);
    const secs = s % 60;
    return `${m}:${secs.toString().padStart(2, '0')}`;
  };

  const handleExitTest = () => {
    if (confirm("Are you sure you want to exit? Your progress in this test will be lost forever.")) {
      if (onExit) {
        onExit();
      } else {
        setTestMode(false);
        setActiveTest(null);
        setAnswers({});
        setCurrentIdx(0);
      }
    }
  };

  if (testMode && activeTest && !isSubmitted) {
    const questions = data.questions.filter(q => activeTest.questionIds.includes(q.id));
    const currentQ = questions[currentIdx];

    return (
      <div className="fixed inset-0 z-[100] bg-slate-50 flex flex-col font-sans overflow-hidden animate-in fade-in">
        <div className="h-16 bg-white border-b border-slate-200 px-6 md:px-10 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-6">
            <button 
              onClick={handleExitTest} 
              className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-100 transition-all border border-rose-100"
            >
              <X className="w-4 h-4" /> Exit Test
            </button>
            <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
            <div className="hidden md:block">
               <h1 className="text-sm font-black text-slate-800 uppercase tracking-tight truncate max-w-xs">{activeTest.name}</h1>
               <div className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">Active Examination</div>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3 bg-slate-100 px-5 py-2 rounded-xl border border-slate-200">
               <Clock className="w-4 h-4 text-slate-500" />
               <span className="font-mono text-xl font-black text-slate-900 tracking-tighter">{formatTimer(timeLeft)}</span>
            </div>
            <button 
              onClick={() => { if(confirm("Are you ready to submit your final answers?")) handleFinalSubmit(); }} 
              className="bg-indigo-600 text-white px-8 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              Submit Exam
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-y-auto bg-white p-8 md:p-16 lg:p-24 flex flex-col items-center">
            <div className="max-w-4xl w-full space-y-12">
               <div className="flex justify-between items-center pb-8 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <span className="bg-slate-900 text-white px-4 py-2 rounded-lg font-black text-xs">QUESTION {currentIdx + 1}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{currentQ?.subject}</span>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest">+4.0 Correct</div>
                    <div className="bg-rose-50 text-rose-600 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest">-1.0 Wrong</div>
                  </div>
               </div>

               <div className="space-y-12">
                  <p className="text-3xl font-bold text-slate-800 leading-tight italic tracking-tight">
                    {currentQ?.text || "Synchronizing question data..."}
                  </p>

                  <div className="grid grid-cols-1 gap-4">
                    {currentQ?.options.map((opt, i) => (
                      <button 
                        key={i} 
                        onClick={() => setAnswers({...answers, [currentQ.id]: i})}
                        className={`p-6 rounded-2xl border-2 text-left transition-all flex items-center group ${
                          answers[currentQ.id] === i 
                          ? 'border-indigo-600 bg-indigo-50/30 ring-2 ring-indigo-100 shadow-md scale-[1.01]' 
                          : 'border-slate-100 bg-slate-50 hover:border-indigo-200'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black mr-6 shrink-0 transition-all ${
                          answers[currentQ.id] === i ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-slate-400 border border-slate-200 group-hover:border-indigo-300'
                        }`}>
                          {String.fromCharCode(65+i)}
                        </div>
                        <span className={`text-lg font-bold ${answers[currentQ.id] === i ? 'text-indigo-900' : 'text-slate-600'}`}>{opt}</span>
                      </button>
                    ))}
                  </div>
               </div>
            </div>
          </div>

          <div className="w-80 bg-slate-50 border-l border-slate-200 flex flex-col hidden lg:flex">
             <div className="p-8 bg-white border-b border-slate-100">
                <h3 className="text-xs font-black uppercase text-slate-400 tracking-[0.2em] mb-8">Question Palette</h3>
                <div className="grid grid-cols-5 gap-3">
                   {questions.map((q, i) => (
                     <button 
                      key={q.id}
                      onClick={() => setCurrentIdx(i)}
                      className={`h-10 rounded-xl flex items-center justify-center text-xs font-black transition-all border-2 ${
                        currentIdx === i ? 'border-indigo-600 scale-105' : 'border-transparent'
                      } ${
                        answers[q.id] !== undefined && answers[q.id] !== -1 
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                          : 'bg-white text-slate-400 border-slate-200'
                      }`}
                     >
                       {i + 1}
                     </button>
                   ))}
                </div>
             </div>
             
             <div className="p-8 space-y-6">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Real-time Statistics</h4>
                <div className="space-y-4">
                   <div className="flex justify-between items-center p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Attempted</span>
                      <span className="text-xl font-black text-indigo-600 tabular-nums">{Object.values(answers).filter(v => v !== -1).length}</span>
                   </div>
                   <div className="flex justify-between items-center p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Unvisited</span>
                      <span className="text-xl font-black text-slate-300 tabular-nums">{questions.length - Object.keys(answers).length}</span>
                   </div>
                </div>
             </div>

             <div className="mt-auto p-10 bg-white border-t border-slate-50">
                <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                   <AlertCircle className="w-4 h-4 text-indigo-600 shrink-0" />
                   <p className="text-[10px] font-bold text-indigo-900 leading-relaxed uppercase">Use the header button to submit the entire exam once finished.</p>
                </div>
             </div>
          </div>
        </div>

        <div className="h-20 bg-white border-t border-slate-200 px-8 md:px-12 flex items-center justify-between shrink-0">
           <button 
            disabled={currentIdx === 0} 
            onClick={() => setCurrentIdx(currentIdx - 1)}
            className="flex items-center gap-3 px-8 py-3 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-indigo-600 disabled:opacity-10 transition-all"
           >
             <ChevronLeft className="w-5 h-5" /> Previous Question
           </button>

           <div className="flex gap-4">
             <button 
              onClick={() => setAnswers({...answers, [currentQ.id]: -1})} 
              className="px-8 py-3 text-rose-500 font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 rounded-xl transition-all"
             >
               Clear Answer
             </button>
             <button 
              onClick={() => {
                if (currentIdx < questions.length - 1) setCurrentIdx(currentIdx + 1);
                else if (confirm("Finalized all questions? Confirm to submit the exam.")) handleFinalSubmit();
              }}
              className="bg-indigo-600 text-white px-12 py-3.5 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-700 shadow-xl shadow-indigo-100 flex items-center gap-4 transition-all"
             >
               {currentIdx === questions.length - 1 ? 'Finish & Submit' : 'Save & Next'} <ChevronRight className="w-5 h-5" />
             </button>
           </div>
        </div>
      </div>
    );
  }

  if (viewingResult) {
    const testSource = data.mockTests.find(t => t.id === viewingResult.testId) || (initialTest && initialTest.id === viewingResult.testId ? initialTest : null);
    const questions = data.questions.filter(q => testSource?.questionIds.includes(q.id));

    return (
      <div className="fixed inset-0 z-[110] bg-slate-50 flex flex-col font-sans animate-in zoom-in-95 duration-500 overflow-hidden">
        <div className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 shadow-sm">
           <div className="flex items-center gap-4">
             <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white"><Award className="w-5 h-5" /></div>
             <h2 className="text-sm font-black text-slate-800 uppercase italic tracking-tighter">Graded Result: {viewingResult.testName}</h2>
           </div>
           <button 
            onClick={() => { 
              if (onExit) {
                onExit();
              } else {
                setViewingResult(null); 
                setTestMode(false); 
                setIsSubmitted(false); 
              }
            }} 
            className="text-[10px] font-black text-white uppercase tracking-widest bg-slate-900 px-8 py-2.5 rounded-lg hover:bg-black transition-all shadow-xl"
           >
            {onExit ? 'Return to Syllabus' : 'Back to Library'}
           </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-12 lg:p-16">
           <div className="max-w-6xl mx-auto space-y-12 pb-32">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 text-center shadow-sm">
                   <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Aggregate Score</div>
                   <div className="text-6xl font-black text-slate-900 tracking-tighter">{viewingResult.score}<span className="text-xl opacity-20 ml-2">/ {viewingResult.totalMarks}</span></div>
                </div>
                <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 text-center shadow-sm">
                   <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Accuracy Rate</div>
                   <div className="text-6xl font-black text-emerald-500 tracking-tighter">{viewingResult.accuracy}%</div>
                </div>
                <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 text-center shadow-sm">
                   <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Verdict</div>
                   <div className="text-2xl font-black text-indigo-600 uppercase italic mt-1">{viewingResult.accuracy > 70 ? 'Excellent' : viewingResult.accuracy > 40 ? 'Satisfactory' : 'Critical Review'}</div>
                </div>
                <div className="bg-slate-900 p-10 rounded-[3.5rem] shadow-2xl text-white text-center">
                   <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2">Estimated Rank</div>
                   <div className="text-4xl font-black italic tracking-tighter text-indigo-400">TOP 1%</div>
                </div>
              </div>

              <div className="bg-white rounded-[4rem] border border-slate-200 overflow-hidden shadow-sm">
                 <div className="p-12 border-b bg-slate-50/50 flex justify-between items-center">
                    <h3 className="text-3xl font-black italic text-slate-800 flex items-center gap-6"><ListFilter className="w-10 h-10 text-indigo-600" /> Response Analysis</h3>
                 </div>
                 <div className="p-12 space-y-10">
                    {questions.map((q, i) => {
                      const userAns = answers[q.id];
                      const isCorrect = userAns === q.correctAnswer;
                      const isSkipped = userAns === undefined || userAns === -1;
                      return (
                        <div key={q.id} className={`p-10 rounded-[3rem] border-2 transition-all ${isCorrect ? 'border-emerald-100 bg-emerald-50/5' : isSkipped ? 'border-slate-100 bg-slate-50' : 'border-rose-100 bg-rose-50/5'}`}>
                           <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10">
                              <div className="flex gap-8">
                                 <span className="w-14 h-14 bg-white border-2 border-slate-200 rounded-[1.5rem] flex items-center justify-center font-black text-slate-400 text-lg shadow-inner shrink-0">Q{i+1}</span>
                                 <p className="text-2xl font-bold text-slate-800 italic leading-relaxed tracking-tight">{q.text}</p>
                              </div>
                              <span className={`px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shrink-0 ${isCorrect ? 'bg-emerald-500 text-white border-emerald-600' : isSkipped ? 'bg-white text-slate-400 border-slate-200' : 'bg-rose-500 text-white border-rose-600'}`}>
                                {isCorrect ? 'Correct' : isSkipped ? 'Skipped' : 'Incorrect'}
                              </span>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {q.options.map((opt, oi) => (
                                <div key={oi} className={`p-6 rounded-2xl text-base font-black border-2 transition-all ${oi === q.correctAnswer ? 'bg-emerald-500 border-emerald-600 text-white shadow-lg' : oi === userAns ? 'bg-rose-500 border-rose-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400'}`}>
                                   <span className="opacity-40 mr-4 italic">{String.fromCharCode(65+oi)}.</span> {opt}
                                </div>
                              ))}
                           </div>

                           {q.explanation && (
                             <div className="mt-10 p-8 bg-indigo-50/50 rounded-[2.5rem] border border-indigo-100 flex gap-8">
                                <div className="p-3 bg-indigo-600 text-white rounded-xl h-fit shadow-xl shadow-indigo-100 shrink-0"><Lightbulb className="w-6 h-6" /></div>
                                <div className="space-y-1">
                                   <div className="text-[10px] font-black uppercase text-indigo-600 tracking-widest">Master Solution</div>
                                   <p className="text-base font-bold text-slate-600 italic leading-relaxed">"{q.explanation}"</p>
                                </div>
                             </div>
                           )}
                        </div>
                      )
                    })}
                 </div>
              </div>
           </div>
        </div>
      </div>
    )
  }

  // Filter history to show ONLY Mock Tests (category 'ADMIN')
  const mockTestHistory = data.testHistory.filter(res => res.category === 'ADMIN');

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-500 pb-20 px-4">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
        <div>
           <div className="text-[11px] font-black uppercase text-indigo-600 tracking-[0.5em] mb-4 flex items-center gap-3"><Target className="w-5 h-5" /> Standardized Exams</div>
           <h2 className="text-7xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">TEST <br /><span className="text-indigo-600">CENTRE.</span></h2>
        </div>
        <nav className="flex bg-white p-2 rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden shrink-0">
           {[
             { id: 'library', label: 'Library', icon: BookOpen },
             { id: 'history', label: 'History', icon: History },
             { id: 'analytics', label: 'Tracking', icon: BarChart }
           ].map(tab => (
             <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`px-10 py-3.5 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-700'}`}>
               <tab.icon className="w-4 h-4" /> {tab.label}
             </button>
           ))}
        </nav>
      </div>

      <main className="animate-in slide-in-from-bottom-4 duration-700">
        {activeTab === 'library' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
             {data.mockTests.filter(t => t.category === 'ADMIN').length === 0 ? (
                <div className="col-span-full py-40 text-center bg-white rounded-[4rem] border-4 border-dashed border-slate-100 flex flex-col items-center gap-6">
                   <Target className="w-12 h-12 text-slate-200" />
                   <p className="text-xs font-black uppercase text-slate-400 tracking-[0.4em] italic">No active exams synchronized from the server.</p>
                </div>
             ) : (
                data.mockTests.filter(t => t.category === 'ADMIN').map(test => (
                  <div key={test.id} className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-indigo-400 hover:shadow-xl transition-all flex flex-col justify-between group h-64 relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform"><Zap className="w-24 h-24 text-indigo-600" /></div>
                     <div className="relative z-10 space-y-4">
                        <div className="flex justify-between items-center">
                           <span className="px-3 py-1 bg-slate-900 text-white rounded-full text-[8px] font-black tracking-widest uppercase">{test.difficulty}</span>
                           <Clock className="w-3.5 h-3.5 text-slate-300" />
                        </div>
                        <h4 className="text-lg font-black text-slate-800 italic leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2 tracking-tight">{test.name}</h4>
                        <div className="flex gap-4">
                           <div className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-1.5"><Clock className="w-3 h-3 text-indigo-400" /> {test.duration}m</div>
                           <div className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-1.5"><Target className="w-3 h-3 text-rose-400" /> {test.questionIds.length} Qs</div>
                        </div>
                     </div>
                     <button onClick={() => startTest(test)} className="w-full py-3.5 bg-slate-50 text-slate-900 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-sm">Take Test</button>
                  </div>
                ))
             )}
          </div>
        ) : activeTab === 'history' ? (
          <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-right duration-500">
             <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100"><tr className="text-[9px] font-black uppercase text-slate-400 tracking-[0.4em]"><th className="p-8">Mock Exam Identity</th><th className="p-8 text-center">Date Taken</th><th className="p-8 text-center">Score Delta</th><th className="p-8 text-center">Precision</th><th className="p-8 text-right">Review</th></tr></thead>
                <tbody className="divide-y divide-slate-50">
                   {mockTestHistory.length === 0 ? (
                     <tr><td colSpan={5} className="p-32 text-center text-slate-300 font-black uppercase text-xs tracking-widest italic">No historical Mock Exam sessions synchronized.</td></tr>
                   ) : (
                     mockTestHistory.map((res, i) => (
                       <tr key={i} className="hover:bg-slate-50/80 transition-colors group">
                          <td className="p-8 font-black text-slate-800 italic text-lg group-hover:text-indigo-600 transition-colors tracking-tight">{res.testName}</td>
                          <td className="p-8 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">{res.date}</td>
                          <td className="p-8 text-center font-black text-2xl text-slate-900">{res.score}<span className="text-xs opacity-20 mx-1">/</span>{res.totalMarks}</td>
                          <td className="p-8 text-center">
                             <span className={`px-5 py-1.5 rounded-full text-[9px] font-black tracking-widest border ${res.accuracy > 70 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : res.accuracy > 40 ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                {res.accuracy}% ACC
                             </span>
                          </td>
                          <td className="p-8 text-right">
                             <button onClick={() => setViewingResult(res)} className="p-4 bg-white border border-slate-100 text-indigo-600 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm group-hover:scale-105">
                                <Eye className="w-5 h-5" />
                             </button>
                          </td>
                       </tr>
                     ))
                   )}
                </tbody>
             </table>
          </div>
        ) : (
          <div className="space-y-10">
             <div className="bg-indigo-900 p-12 rounded-[4rem] text-white shadow-2xl flex flex-col md:flex-row justify-between items-center gap-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-[3s]"><TrendingUp className="w-80 h-80" /></div>
                <div className="space-y-4 relative z-10">
                   <h3 className="text-3xl font-black italic tracking-tighter uppercase leading-none">Intelligence Tracking.</h3>
                   <p className="text-indigo-200 text-sm max-w-lg font-medium">Drill down into every chapter to identify time-sink areas and confidence gaps. Precision is your only edge.</p>
                </div>
                <div className="flex gap-6 relative z-10">
                   <div className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-[2rem] border border-white/10 text-center">
                      <div className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">Active Units</div>
                      <div className="text-3xl font-black">{data.chapters.filter(c => c.status !== 'NOT_STARTED').length}</div>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-1 gap-8">
                {data.chapters.map(c => {
                  const conf = calculateConfidenceLevel(c.progress, c.accuracy);
                  return (
                    <div key={c.id} className="p-10 bg-white rounded-[3rem] border border-slate-200 flex flex-col xl:flex-row items-center gap-12 group hover:border-indigo-400 hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
                       <div className="flex-1 space-y-6 w-full relative z-10">
                          <div className="flex flex-wrap items-center gap-5">
                             <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border shadow-inner ${
                               c.subject === 'Physics' ? 'bg-blue-50 text-blue-600 border-blue-100' : c.subject === 'Chemistry' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                             }`}>
                                <BookOpen className="w-6 h-6" />
                             </div>
                             <div>
                                <h4 className="text-2xl font-black text-slate-800 italic tracking-tighter leading-none">{c.name}</h4>
                                <div className="flex items-center gap-3 mt-2">
                                   <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{c.subject}</span>
                                   <div className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${conf.bg} ${conf.color} ${conf.border}`}>{conf.label} Confidence</div>
                                </div>
                             </div>
                          </div>
                          <div className="space-y-3">
                             <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                                <span>Mastery Progress</span>
                                <span className="text-slate-800">{c.progress}%</span>
                             </div>
                             <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                <div className={`h-full transition-all duration-1000 ${c.accuracy > 70 ? 'bg-emerald-500' : 'bg-indigo-600'}`} style={{ width: `${c.progress}%` }}></div>
                             </div>
                          </div>
                       </div>
                       
                       <div className="grid grid-cols-2 md:grid-cols-4 gap-12 shrink-0 xl:border-l xl:pl-12 border-slate-100 w-full xl:w-auto relative z-10">
                          {[
                            { icon: BookOpen, label: 'Theory', val: c.timeSpentNotes, color: 'indigo' },
                            { icon: Eye, label: 'Lectures', val: c.timeSpentVideos, color: 'amber' },
                            { icon: Target, label: 'Drills', val: c.timeSpentPractice, color: 'emerald' },
                            { icon: History, label: 'Exams', val: c.timeSpentTests, color: 'rose' }
                          ].map((stat, si) => (
                            <div key={si} className="flex flex-col items-center gap-2 group/stat">
                               <div className="w-10 h-10 bg-slate-50 text-slate-300 rounded-xl flex items-center justify-center group-hover/stat:bg-indigo-600 group-hover/stat:text-white transition-all shadow-sm">
                                  <stat.icon className="w-4 h-4" />
                               </div>
                               <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>
                               <div className="text-lg font-black text-slate-900 tabular-nums">{Math.round((stat.val || 0) / 60)}m</div>
                            </div>
                          ))}
                       </div>

                       <div className="absolute top-1/2 -translate-y-1/2 -right-10 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none">
                          <Activity className="w-40 h-40 text-indigo-600" />
                       </div>
                    </div>
                  )
                })}
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TestsView;
