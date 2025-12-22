
import React, { useState } from 'react';
import { StudentData, PsychometricScore } from '../types';
import { 
  Brain, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Smile, 
  Frown, 
  Zap, 
  Target, 
  Clock, 
  ShieldAlert,
  Loader2,
  RefreshCw,
  HeartHandshake
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

interface PsychometricTestProps {
  data: StudentData;
  setData: (data: StudentData) => void;
}

const PsychometricTest: React.FC<PsychometricTestProps> = ({ data, setData }) => {
  const [step, setStep] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<{
    profile: string;
    description: string;
    action: string;
    advice: string;
  } | null>(null);

  const [scores, setScores] = useState({
    stress: 5,
    focus: 5,
    motivation: 5,
    examFear: 5,
    fatigue: 5
  });

  const questions = [
    { id: 'stress', title: 'Stress Levels', subtitle: 'How overwhelmed do you feel by backlogs?', low: 'Calm', high: 'Panic', icon: ShieldAlert, color: 'rose' },
    { id: 'focus', title: 'Focus Depth', subtitle: 'Ability to stay in Flow state.', low: 'Distracted', high: 'Laser', icon: Target, color: 'indigo' },
    { id: 'motivation', title: 'Drive', subtitle: 'Excitement for solving problems.', low: 'Drained', high: 'Driven', icon: Zap, color: 'emerald' },
    { id: 'examFear', title: 'Exam Anxiety', subtitle: 'Nervousness regarding final day.', low: 'Ready', high: 'Dread', icon: Brain, color: 'violet' },
    { id: 'fatigue', title: 'Fatigue', subtitle: 'Current brain tiredness.', low: 'Fresh', high: 'Burnt Out', icon: Clock, color: 'amber' }
  ];

  const handleFinish = async () => {
    setIsFinishing(true);
    let studentSummary = "";
    let parentAdvice = "";

    // Fetch AI Analysis
    if (process.env.API_KEY) {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Act as a student psychologist for IIT-JEE aspirants. Analyze these scores (0-10):
        Stress: ${scores.stress}, Focus: ${scores.focus}, Motivation: ${scores.motivation}, Exam Fear: ${scores.examFear}.
        
        Generate two outputs:
        1. A student-facing profile and advice (Empowering).
        2. A PARENT-facing strategy on how to support the student based on these results (Practical, non-intrusive).
        
        Return JSON: { "profile": "Name", "description": "Student analysis", "action": "Immediate student step", "advice": "Mindset advice", "parentSupport": "Strategic advice for parents" }
      `;

      try {
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                profile: { type: Type.STRING },
                description: { type: Type.STRING },
                action: { type: Type.STRING },
                advice: { type: Type.STRING },
                parentSupport: { type: Type.STRING }
              },
              required: ["profile", "description", "action", "advice", "parentSupport"]
            }
          }
        });
        const res = JSON.parse(response.text || '{}');
        setAiAnalysis(res);
        studentSummary = res.description;
        parentAdvice = res.parentSupport;
      } catch (e) {
        console.error(e);
      }
    }

    // Update global data with BOTH summaries for storage
    const newEntry: PsychometricScore = {
      stress: scores.stress,
      focus: scores.focus,
      motivation: scores.motivation,
      examFear: scores.examFear,
      timestamp: new Date().toISOString().split('T')[0],
      studentSummary: studentSummary,
      parentAdvice: parentAdvice
    };

    setData({
      ...data,
      psychometricHistory: [...data.psychometricHistory, newEntry]
    });
    
    setIsFinishing(false);
    setStep(questions.length);
  };

  const currentQ = questions[step];

  if (step === questions.length) {
    return (
      <div className="max-w-3xl mx-auto space-y-8 animate-in zoom-in-95 duration-500 pb-20">
        <div className="bg-indigo-900 text-white p-12 rounded-[3rem] text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12"><Sparkles className="w-64 h-64" /></div>
          <h2 className="text-4xl font-black mb-4">Assessment Complete</h2>
          <p className="text-indigo-200">Your profile is saved. Your connected parent can now see support strategies based on this result.</p>
        </div>

        {aiAnalysis ? (
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
               <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                     <Brain className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">Cognitive State</div>
                    <h3 className="text-2xl font-black text-slate-900">{aiAnalysis.profile}</h3>
                  </div>
               </div>
               <p className="text-slate-600 leading-relaxed">{aiAnalysis.description}</p>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
                    <h4 className="font-bold text-emerald-900 mb-2 flex items-center gap-2"><Zap className="w-4 h-4" /> Priority Step</h4>
                    <p className="text-emerald-800 text-sm">{aiAnalysis.action}</p>
                  </div>
                  <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
                    <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2"><HeartHandshake className="w-4 h-4" /> Mindset Focus</h4>
                    <p className="text-indigo-800 text-sm">{aiAnalysis.advice}</p>
                  </div>
               </div>
               <button onClick={() => setStep(0)} className="w-full py-4 border-2 border-slate-100 text-slate-400 font-black rounded-2xl hover:bg-slate-50 transition-all uppercase text-[10px] tracking-widest">Retake Check-in</button>
          </div>
        ) : (
          <div className="py-20 flex flex-col items-center justify-center space-y-4 bg-white rounded-[3rem]">
             <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
             <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Generating Strategic Insights...</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500 pb-20">
      <div className="text-center">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Psychometric Check-in</h2>
        <p className="text-slate-500 mt-2">Update your mental status to sync with Parent & Coach.</p>
      </div>

      <div className="bg-white p-12 rounded-[3.5rem] border border-slate-200 shadow-xl relative overflow-hidden">
        <div className="flex flex-col items-center text-center space-y-10">
          <div className={`w-20 h-20 bg-${currentQ.color}-50 text-${currentQ.color}-600 rounded-[2rem] flex items-center justify-center`}>
            <currentQ.icon className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h3 className="text-3xl font-black text-slate-900">{currentQ.title}</h3>
            <p className="text-slate-500 font-medium max-w-md">{currentQ.subtitle}</p>
          </div>
          <div className="w-full max-w-xl space-y-10">
            <input 
              type="range" min="0" max="10" step="1"
              value={scores[currentQ.id as keyof typeof scores]}
              onChange={(e) => setScores({...scores, [currentQ.id]: parseInt(e.target.value)})}
              className="w-full h-3 bg-slate-100 rounded-full appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between mt-10">
              <button disabled={step === 0} onClick={() => setStep(step - 1)} className="flex items-center gap-2 text-slate-400 font-bold disabled:opacity-0 transition-opacity"><ChevronLeft className="w-5 h-5" /> Back</button>
              {step === questions.length - 1 ? (
                <button onClick={handleFinish} className="bg-indigo-600 text-white px-12 py-4 rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-indigo-700 transition-all flex items-center gap-2">Finish & Save <Sparkles className="w-5 h-5" /></button>
              ) : (
                <button onClick={() => setStep(step + 1)} className="bg-slate-900 text-white px-12 py-4 rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-black transition-all flex items-center gap-2">Next <ChevronRight className="w-5 h-5" /></button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PsychometricTest;
