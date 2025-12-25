import React, { useState, useEffect } from 'react';
import { StudentData, MockTest, Question, TestResult } from '../types';
import { FileText, Clock, Target, ChevronRight, CheckCircle2, Trophy, AlertCircle, ArrowLeft, History, Bookmark } from 'lucide-react';

interface TestsViewProps {
  data: StudentData;
  setData?: (data: StudentData) => void;
  initialTest?: MockTest | null;
  onExit?: () => void;
}

const TestsView: React.FC<TestsViewProps> = ({ data, setData, initialTest = null, onExit }) => {
  const [activeTest, setActiveTest] = useState<MockTest | null>(initialTest);
  const [testMode, setTestMode] = useState(!!initialTest);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (initialTest) {
      startTest(initialTest);
    }
  }, [initialTest]);

  const archiveTests = data.mockTests.filter(t => 
    t.name.toLowerCase().includes('archive') || 
    t.name.toLowerCase().includes('jee 20') || 
    t.name.toLowerCase().includes('iit-jee')
  );
  
  const regularMockTests = data.mockTests.filter(t => 
    !archiveTests.includes(t) && (t.chapterIds?.length > 1 || t.category === 'ADMIN')
  );

  const startTest = (test: MockTest) => {
    setActiveTest(test);
    setTestMode(true);
    setCurrentQuestionIdx(0);
    setAnswers({});
    setIsSubmitted(false);
  };

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    if (isSubmitted) return;
    setAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  const calculateFinalScore = () => {
    if (!activeTest) return 0;
    let score = 0;
    activeTest.questionIds.forEach(qId => {
      const q = data.questions.find(qu => qu.id === qId);
      if (q && answers[qId] === q.correctAnswer) score += 4;
      else if (q && answers[qId] !== undefined) score -= 1;
    });
    return score;
  };

  const handleSubmitTest = () => {
    if (!activeTest || !setData) return;
    const finalScore = calculateFinalScore();
    const correctCount = activeTest.questionIds.filter(qId => {
      const q = data.questions.find(qu => qu.id === qId);
      return q && answers[qId] === q.correctAnswer;
    }).length;

    const accuracy = Math.round((correctCount / (activeTest.questionIds.length || 1)) * 100);
    
    const newResult: TestResult = {
      testId: activeTest.id,
      testName: activeTest.name,
      score: finalScore,
      totalMarks: activeTest.questionIds.length * 4,
      date: new Date().toISOString().split('T')[0],
      chapterIds: activeTest.chapterIds,
      accuracy: accuracy
    };

    setData({
      ...data,
      testHistory: [newResult, ...data.testHistory]
    });
    setIsSubmitted(true);
  };

  const exitTest = () => {
    if (onExit) onExit();
    else {
      setTestMode(false);
      setActiveTest(null);
    }
  };

  if (testMode && activeTest) {
    const questions = data.questions.filter(q => activeTest.questionIds.includes(q.id));
    const currentQ = questions[currentQuestionIdx];
    const finalScore = isSubmitted ? calculateFinalScore() : 0;

    if (questions.length === 0) {
      return (
        <div className="max-w-4xl mx-auto p-20 text-center bg-white rounded-3xl border border-slate-200 shadow-xl animate-in zoom-in-95">
           <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
           <h3 className="text-xl font-bold">Incomplete Resource Set</h3>
           <p className="text-slate-500 mt-2">The selected test node lacks valid mapped questions in the local bank.</p>
           <button onClick={exitTest} className="mt-6 bg-indigo-600 text-white px-8 py-2 rounded-xl font-bold">Return to Hub</button>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto animate-in fade-in duration-300">
        <div className="mb-8 flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-20 z-20">
          <div className="flex items-center gap-4">
            <button onClick={exitTest} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400"><ArrowLeft className="w-5 h-5" /></button>
            <div>
              <h3 className="font-black text-xl text-slate-900">{activeTest.name}</h3>
              <div className="flex gap-4 text-xs font-bold text-slate-400 mt-1 uppercase">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {activeTest.duration}m</span>
                <span className="flex items-center gap-1"><Target className="w-3 h-3" /> {activeTest.questionIds.length} Qs</span>
              </div>
            </div>
          </div>
          {!isSubmitted ? (
            <button onClick={handleSubmitTest} className="bg-rose-600 text-white px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-rose-100">Commit Paper</button>
          ) : (
            <button onClick={exitTest} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl">Exit Review</button>
          )}
        </div>

        {isSubmitted ? (
          <div className="space-y-8 pb-20">
            <div className="bg-indigo-900 text-white p-10 rounded-[2.5rem] text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10"><Trophy className="w-40 h-40" /></div>
              <h2 className="text-2xl font-black uppercase tracking-widest text-indigo-300">Performance Summary</h2>
              <div className="text-7xl font-black my-6 tabular-nums">
                {finalScore} 
                <span className="text-2xl text-indigo-400 ml-2">/ {activeTest.questionIds.length * 4}</span>
              </div>
              <p className="text-indigo-200 text-sm font-medium">Session recorded and archived in the student node.</p>
            </div>

            <div className="space-y-6">
              <h4 className="font-black text-lg px-4 text-slate-800 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                Strategic Breakdown
              </h4>
              {questions.map((q, idx) => (
                <div key={q.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
                  <div className="flex justify-between items-start">
                    <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">Q{idx + 1}</span>
                    <span className={`font-black text-[10px] uppercase tracking-widest ${answers[q.id] === q.correctAnswer ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {answers[q.id] === q.correctAnswer ? 'Success (+4)' : (answers[q.id] === undefined ? 'Skipped' : 'Error (-1)')}
                    </span>
                  </div>
                  <p className="font-bold text-slate-800 text-lg italic leading-relaxed">"{q.text}"</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {q.options.map((opt, i) => (
                      <div key={i} className={`p-5 rounded-2xl border-2 text-sm transition-all ${
                          i === q.correctAnswer ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold' : 
                          i === answers[q.id] ? 'bg-rose-50 border-rose-500 text-rose-900' : 'bg-slate-50 border-transparent text-slate-500 opacity-60'
                        }`}>
                        {String.fromCharCode(65 + i)}. {opt}
                      </div>
                    ))}
                  </div>
                  <div className="p-6 bg-indigo-50 rounded-[1.5rem] text-xs text-indigo-800 border border-indigo-100">
                    <span className="font-black uppercase tracking-widest text-[9px] block mb-2 opacity-50">Solution Intel</span>
                    <p className="font-medium leading-relaxed">{q.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-sm min-h-[450px] flex flex-col justify-between">
                {currentQ && (
                  <div className="space-y-10">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full">{currentQ.subject}</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Question {currentQuestionIdx + 1} of {questions.length}</span>
                    </div>
                    <p className="text-2xl font-black text-slate-800 tracking-tight leading-relaxed italic">"{currentQ.text}"</p>
                    <div className="space-y-4">
                      {currentQ.options.map((opt, i) => (
                        <button 
                          key={i} 
                          onClick={() => handleSelectOption(currentQ.id, i)}
                          className={`w-full text-left p-6 rounded-2xl border-2 transition-all flex items-center gap-5 group ${
                            answers[currentQ.id] === i 
                            ? 'bg-slate-900 border-slate-900 text-white shadow-2xl translate-x-1' 
                            : 'bg-white border-slate-100 text-slate-500 hover:border-indigo-200'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-black text-sm ${
                            answers[currentQ.id] === i ? 'bg-indigo-500' : 'bg-slate-100 text-slate-400'
                          }`}>
                            {String.fromCharCode(65 + i)}
                          </div>
                          <span className="font-bold text-lg">{opt}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex justify-between mt-12 pt-10 border-t border-slate-100">
                  <button disabled={currentQuestionIdx === 0} onClick={() => setCurrentQuestionIdx(prev => prev - 1)} className="px-8 py-3 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 disabled:opacity-0 transition-all">Previous</button>
                  <button disabled={currentQuestionIdx === questions.length - 1} onClick={() => setCurrentQuestionIdx(prev => prev + 1)} className="px-10 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg disabled:opacity-0">Next Question</button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <h4 className="font-black text-[10px] mb-6 uppercase tracking-[0.3em] text-slate-400 border-b border-slate-50 pb-4">Progress Matrix</h4>
                <div className="grid grid-cols-5 gap-3">
                  {questions.map((_, i) => (
                    <button 
                      key={i}
                      onClick={() => setCurrentQuestionIdx(i)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black transition-all ${
                        currentQuestionIdx === i ? 'bg-indigo-600 text-white shadow-xl scale-110' : 
                        answers[questions[i].id] !== undefined ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-16 animate-in fade-in duration-500 max-w-6xl mx-auto pb-32">
      <div className="space-y-4">
        <h2 className="text-6xl font-black text-slate-900 tracking-tighter italic leading-none">TESTING <br /><span className="text-indigo-600">LEDGER.</span></h2>
        <p className="text-slate-500 text-xl font-medium max-w-xl">Unified access to standardized archives and institutional mocks.</p>
      </div>

      <div className="space-y-20">
        {archiveTests.length > 0 && (
          <section className="space-y-8">
            <div className="flex items-center gap-4 border-l-4 border-amber-400 pl-6">
              <h3 className="text-3xl font-black italic tracking-tight text-slate-800">Historical Archives</h3>
              <div className="h-px flex-1 bg-slate-100"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {archiveTests.map(test => (
                <div key={test.id} className="group bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-amber-400 transition-all flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-5"><History className="w-32 h-32 rotate-12" /></div>
                  <div className="flex justify-between items-start mb-8">
                    <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-all shadow-inner"><Bookmark className="w-8 h-8" /></div>
                    <span className="text-[9px] font-black bg-slate-900 text-white px-3 py-1 rounded-full uppercase tracking-widest shadow-xl">Archive</span>
                  </div>
                  <h4 className="font-black text-2xl mb-4 group-hover:text-amber-700 transition-colors leading-tight italic tracking-tight">{test.name}</h4>
                  <div className="flex gap-4 text-[10px] font-black text-slate-400 mb-10 uppercase tracking-widest">
                    <span>{test.duration}m</span>
                    <span>{test.questionIds.length} MCQs</span>
                  </div>
                  <button onClick={() => startTest(test)} className="mt-auto flex items-center gap-3 text-amber-600 font-black text-[10px] uppercase tracking-[0.3em] group-hover:gap-5 transition-all">Initialize Session <ChevronRight className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="space-y-8">
          <div className="flex items-center gap-4 border-l-4 border-indigo-600 pl-6">
            <h3 className="text-3xl font-black italic tracking-tight text-slate-800">Master Mock Papers</h3>
            <div className="h-px flex-1 bg-slate-100"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularMockTests.map(test => (
              <div key={test.id} className="group bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-indigo-400 transition-all flex flex-col relative">
                <div className="flex justify-between items-start mb-8">
                  <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner"><FileText className="w-8 h-8" /></div>
                  <span className="text-[9px] font-black bg-emerald-500 text-white px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">New</span>
                </div>
                <h4 className="font-black text-2xl mb-4 group-hover:text-indigo-600 transition-colors leading-tight italic tracking-tight">{test.name}</h4>
                <div className="flex gap-4 text-[10px] font-black text-slate-400 mb-10 uppercase tracking-widest">
                  <span>{test.duration}m</span>
                  <span>{test.questionIds.length} MCQs</span>
                </div>
                <button onClick={() => startTest(test)} className="mt-auto flex items-center gap-3 text-indigo-600 font-black text-[10px] uppercase tracking-[0.3em] group-hover:gap-5 transition-all">Begin Drill <ChevronRight className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default TestsView;