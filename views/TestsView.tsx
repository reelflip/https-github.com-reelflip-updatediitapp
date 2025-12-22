
import React, { useState, useEffect } from 'react';
import { StudentData, MockTest, Question } from '../types';
import { FileText, Clock, Target, ChevronRight, Play, CheckCircle2, Trophy, AlertCircle, ArrowLeft, History, Bookmark } from 'lucide-react';

interface TestsViewProps {
  data: StudentData;
  initialTest?: MockTest | null;
  onExit?: () => void;
}

const TestsView: React.FC<TestsViewProps> = ({ data, initialTest = null, onExit }) => {
  const [activeTest, setActiveTest] = useState<MockTest | null>(initialTest);
  const [testMode, setTestMode] = useState(!!initialTest);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Automatically start test if initialTest is provided
  useEffect(() => {
    if (initialTest) {
      startTest(initialTest);
    }
  }, [initialTest]);

  // Full Syllabus Tests: Use safety checks for chapterIds
  const fullTests = data.mockTests.filter(t => (t.chapterIds?.length || 0) > 1 || (t.chapterIds?.length || 0) === 0);
  
  // Distinguish Archive (Previous Year) papers
  const archiveTests = fullTests.filter(t => t.name.toLowerCase().includes('archive') || t.name.toLowerCase().includes('jee 20'));
  const regularMockTests = fullTests.filter(t => !archiveTests.includes(t));

  const startTest = (test: MockTest) => {
    setActiveTest(test);
    setTestMode(true);
    setCurrentQuestionIdx(0);
    setAnswers({});
    setIsSubmitted(false);
  };

  const handleSelectOption = (qId: string, optIdx: number) => {
    if (isSubmitted) return;
    setAnswers({ ...answers, [qId]: optIdx });
  };

  const calculateScore = () => {
    if (!activeTest) return 0;
    let score = 0;
    activeTest.questionIds.forEach(qId => {
      const q = data.questions.find(quest => quest.id === qId);
      if (q && answers[qId] === q.correctAnswer) {
        score += 4; // Standard JEE marking
      } else if (q && answers[qId] !== undefined) {
        score -= 1; // Negative marking
      }
    });
    return score;
  };

  const exitTest = () => {
    if (onExit) {
      onExit();
    } else {
      setTestMode(false);
      setActiveTest(null);
    }
  };

  if (testMode && activeTest) {
    const questions = data.questions.filter(q => activeTest.questionIds.includes(q.id));
    const currentQ = questions[currentQuestionIdx];

    if (questions.length === 0) {
      return (
        <div className="max-w-4xl mx-auto p-20 text-center bg-white rounded-3xl border border-slate-200">
           <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
           <h3 className="text-xl font-bold">No Questions Found</h3>
           <p className="text-slate-500 mt-2">This test has no valid questions linked in the database yet.</p>
           <button onClick={exitTest} className="mt-6 bg-indigo-600 text-white px-8 py-2 rounded-xl font-bold">Return to Tests</button>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto animate-in fade-in duration-300">
        <div className="mb-8 flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-20 z-20">
          <div className="flex items-center gap-4">
            <button onClick={exitTest} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-400" />
            </button>
            <div>
              <h3 className="font-black text-xl text-slate-900">{activeTest.name}</h3>
              <div className="flex gap-4 text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {activeTest.duration} Mins</span>
                <span className="flex items-center gap-1"><Target className="w-3 h-3" /> {activeTest.questionIds.length} Qs</span>
              </div>
            </div>
          </div>
          {!isSubmitted && (
            <button 
              onClick={() => setIsSubmitted(true)}
              className="bg-rose-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-rose-100 hover:bg-rose-700 transition-all"
            >
              Finish Test
            </button>
          )}
          {isSubmitted && (
            <button 
              onClick={exitTest}
              className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
            >
              Exit Review
            </button>
          )}
        </div>

        {isSubmitted ? (
          <div className="space-y-8 pb-20">
            <div className="bg-indigo-900 text-white p-10 rounded-[2.5rem] text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10"><Trophy className="w-40 h-40" /></div>
              <h2 className="text-3xl font-black mb-2">Test Result</h2>
              <div className="text-6xl font-black my-6">{calculateScore()} <span className="text-2xl text-indigo-300">/ {activeTest.questionIds.length * 4}</span></div>
              <p className="text-indigo-200 max-w-md mx-auto text-sm">Review your mistakes to turn them into mastery.</p>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-lg flex items-center gap-2 px-4">
                <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                Review & Analysis
              </h4>
              {questions.map((q, idx) => (
                <div key={q.id} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-lg text-xs font-bold">Q{idx + 1}</span>
                    {answers[q.id] === q.correctAnswer ? (
                      <span className="text-emerald-500 font-bold text-xs flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Correct (+4)</span>
                    ) : (
                      <span className="text-rose-500 font-bold text-xs flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {answers[q.id] === undefined ? 'Skipped' : 'Incorrect (-1)'}</span>
                    )}
                  </div>
                  <p className="font-bold text-slate-800">{q.text}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {q.options.map((opt, i) => (
                      <div 
                        key={i} 
                        className={`p-4 rounded-2xl border-2 text-sm transition-all ${
                          i === q.correctAnswer ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold' : 
                          i === answers[q.id] ? 'bg-rose-50 border-rose-500 text-rose-900' : 'bg-slate-50 border-transparent text-slate-500 opacity-60'
                        }`}
                      >
                        {String.fromCharCode(65 + i)}. {opt}
                      </div>
                    ))}
                  </div>
                  <div className="p-4 bg-indigo-50 rounded-2xl text-xs text-indigo-800 leading-relaxed border border-indigo-100">
                    <span className="font-black uppercase tracking-widest text-[10px] block mb-1">Coach Note</span>
                    {q.explanation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm min-h-[400px] flex flex-col justify-between">
                {currentQ ? (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">{currentQ.subject}</span>
                      <span className="text-xs font-bold text-slate-400">Question {currentQuestionIdx + 1} of {questions.length}</span>
                    </div>
                    <p className="text-xl font-bold text-slate-800 mb-10 leading-relaxed">{currentQ.text}</p>
                    <div className="space-y-3">
                      {currentQ.options.map((opt, i) => (
                        <button 
                          key={i} 
                          onClick={() => handleSelectOption(currentQ.id, i)}
                          className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center gap-4 group ${
                            answers[currentQ.id] === i 
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100 translate-x-2' 
                            : 'bg-white border-slate-100 text-slate-600 hover:border-indigo-300'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold ${
                            answers[currentQ.id] === i ? 'bg-white/20' : 'bg-slate-100 text-slate-400'
                          }`}>
                            {String.fromCharCode(65 + i)}
                          </div>
                          <span className="font-medium">{opt}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                   <div className="flex-1 flex items-center justify-center italic text-slate-400">Loading question...</div>
                )}
                <div className="flex justify-between mt-10 pt-10 border-t border-slate-100">
                  <button 
                    disabled={currentQuestionIdx === 0}
                    onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
                    className="px-6 py-2 text-sm font-bold text-slate-400 hover:text-slate-900 disabled:opacity-20"
                  >
                    Previous
                  </button>
                  <button 
                    disabled={currentQuestionIdx === questions.length - 1}
                    onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                    className="px-8 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-black transition-all disabled:opacity-20"
                  >
                    Next Question
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-sm mb-4 uppercase tracking-widest text-slate-400">Question Palette</h4>
                <div className="grid grid-cols-5 gap-2">
                  {questions.map((_, i) => (
                    <button 
                      key={i}
                      onClick={() => setCurrentQuestionIdx(i)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                        currentQuestionIdx === i ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 
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
    <div className="space-y-12 animate-in fade-in duration-500 max-w-6xl mx-auto pb-20">
      <div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Full Syllabus Mastery</h2>
        <p className="text-slate-500 font-medium">Standardized mock papers and previous year archives.</p>
      </div>

      <div className="space-y-12">
        {/* Archive Section */}
        {archiveTests.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 rounded-xl">
                 <History className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Previous Year Archive Papers</h3>
              <div className="h-px flex-1 bg-slate-100"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {archiveTests.map(test => (
                <div key={test.id} className="group bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all flex flex-col h-full relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <History className="w-24 h-24 rotate-12" />
                  </div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-all">
                      <Bookmark className="w-7 h-7" />
                    </div>
                    <span className="text-[10px] font-black bg-slate-900 text-white px-3 py-1 rounded-full uppercase tracking-wider">Historical</span>
                  </div>
                  <h4 className="font-bold text-xl mb-2 group-hover:text-amber-700 transition-colors leading-tight">{test.name}</h4>
                  <div className="flex gap-4 text-xs font-bold text-slate-400 mb-8 uppercase tracking-widest">
                    <span>{test.duration} Mins</span>
                    <span>{test.questionIds.length} Qs</span>
                  </div>
                  <div className="mt-auto pt-6 border-t border-slate-50 flex justify-between items-center">
                    <div className="text-xs font-bold text-slate-500">{test.totalMarks} Marks</div>
                    <button 
                      onClick={() => startTest(test)}
                      className="flex items-center gap-2 text-amber-600 font-bold text-sm group-hover:gap-3 transition-all"
                    >
                      Launch Paper <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Regular Mock Tests */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-xl">
               <FileText className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Standard Mock Assessments</h3>
            <div className="h-px flex-1 bg-slate-100"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularMockTests.length > 0 ? regularMockTests.map(test => (
              <div key={test.id} className="group bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-400 transition-all flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <FileText className="w-7 h-7" />
                  </div>
                  <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full uppercase tracking-wider">Active</span>
                </div>
                <h4 className="font-bold text-xl mb-2 group-hover:text-indigo-600 transition-colors">{test.name}</h4>
                <div className="flex gap-4 text-xs font-bold text-slate-400 mb-8 uppercase tracking-widest">
                  <span>{test.duration} Mins</span>
                  <span>{test.questionIds.length} Qs</span>
                </div>
                <div className="mt-auto pt-6 border-t border-slate-50 flex justify-between items-center">
                  <div className="text-xs font-bold text-slate-500">{test.totalMarks} Marks</div>
                  <button 
                    onClick={() => startTest(test)}
                    className="flex items-center gap-2 text-indigo-600 font-bold text-sm group-hover:gap-3 transition-all"
                  >
                    Start Test <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )) : (
                <div className="col-span-full py-20 bg-white rounded-3xl border border-dashed border-slate-200 text-center">
                    <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No regular mock tests published yet</p>
                </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default TestsView;
