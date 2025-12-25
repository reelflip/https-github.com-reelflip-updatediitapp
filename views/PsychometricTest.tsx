
import React, { useState } from 'react';
import { StudentData, PsychometricScore } from '../types';
import { 
  Brain, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Zap, 
  Target, 
  Clock, 
  ShieldAlert,
  Loader2,
  HeartHandshake,
  Moon,
  Activity,
  UserCheck,
  Users,
  Layout,
  Trophy,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Fingerprint,
  BarChart,
  LineChart
} from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { GoogleGenAI, Type } from "@google/genai";

declare var process: { env: { API_KEY: string } };

interface PsychometricTestProps {
  data: StudentData;
  setData: (data: StudentData) => void;
}

const PsychometricTest: React.FC<PsychometricTestProps> = ({ data, setData }) => {
  const [step, setStep] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<{
    profile: string;
    archetype: string;
    description: string;
    tacticalActions: string[];
    mindsetShifts: string[];
    parentSupport: string;
    weeklyGoal: string;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  } | null>(null);

  const [scores, setScores] = useState({
    stress: 5,
    focus: 5,
    motivation: 5,
    examFear: 5,
    fatigue: 5,
    sleep: 5,
    consistency: 5,
    confidence: 5,
    socialSupport: 5,
    vitality: 5,
    backlogGuilt: 5,
    subjectDread: 5
  });

  const questions = [
    { id: 'stress', title: 'Academic Pressure', subtitle: 'Feeling overwhelmed by the volume of syllabus and pending backlogs.', low: 'Calm', high: 'In Crisis', icon: ShieldAlert, color: 'rose' },
    { id: 'focus', title: 'Concentration Depth', subtitle: 'Ability to enter "Flow State" without digital or mental distractions.', low: 'Scattered', high: 'Laser-Like', icon: Target, color: 'indigo' },
    { id: 'motivation', title: 'Intrinsic Drive', subtitle: 'The genuine desire to solve problems vs. feeling like a forced chore.', low: 'Extinguished', high: 'Unstoppable', icon: Zap, color: 'emerald' },
    { id: 'examFear', title: 'Performance Anxiety', subtitle: 'Level of nervousness when thinking about the final JEE exam day.', low: 'Unfazed', high: 'Paralyzing', icon: Brain, color: 'violet' },
    { id: 'fatigue', title: 'Cognitive Burnout', subtitle: 'General mental tiredness and inability to process new concepts.', low: 'Sharp', high: 'Exhausted', icon: Clock, color: 'amber' },
    { id: 'sleep', title: 'Sleep Integrity', subtitle: 'Restfulness and ability to maintain a consistent 6-8 hour cycle.', low: 'Insomniac', high: 'Restorative', icon: Moon, color: 'blue' },
    { id: 'consistency', title: 'Routine Adherence', subtitle: 'Strictness in following study blocks vs. random sporadic study.', low: 'Random', high: 'Clockwork', icon: Activity, color: 'cyan' },
    { id: 'confidence', title: 'Mock Test Morale', subtitle: 'Belief in your ability to crack difficult problems under pressure.', low: 'Doubting', high: 'Dominating', icon: Trophy, color: 'orange' },
    { id: 'socialSupport', title: 'Social Integration', subtitle: 'Feeling connected to family/friends vs. feeling isolated in prep.', low: 'Isolated', high: 'Supported', icon: Users, color: 'pink' },
    { id: 'vitality', title: 'Energy Levels', subtitle: 'Physical fitness, nutrition, and general biological stamina.', low: 'Lethargic', high: 'Vibrant', icon: UserCheck, color: 'teal' },
    { id: 'backlogGuilt', title: 'Backlog Guilt', subtitle: 'Mental baggage of pending chapters affecting current study focus.', low: 'Clean Slate', high: 'Crushing', icon: AlertTriangle, color: 'red' },
    { id: 'subjectDread', title: 'Subject Friction', subtitle: 'Avoiding a specific subject (P, C, or M) due to fear of failure.', low: 'Balanced', high: 'Avoidant', icon: ShieldAlert, color: 'slate' }
  ];

  const radarData = questions.map(q => ({
    subject: q.title,
    A: scores[q.id as keyof typeof scores] * 10,
    fullMark: 100
  }));

  const handleFinish = async () => {
    setIsFinishing(true);
    let studentSummary = "";
    let parentAdvice = "";

    const apiKey = (typeof process !== 'undefined' && process.env?.API_KEY) || null;

    if (apiKey) {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
        Act as a performance psychologist for IIT-JEE aspirants. Analyze these scores (0-10):
        ${Object.entries(scores).map(([k, v]) => `${k}: ${v}`).join(', ')}.
        Return a valid JSON report:
        { 
          "profile": "Title",
          "archetype": "Archetype",
          "description": "200-word analysis", 
          "tacticalActions": ["..."],
          "mindsetShifts": ["..."],
          "parentSupport": "advice string",
          "weeklyGoal": "goal string",
          "riskLevel": "MEDIUM"
        }
      `;

      try {
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: prompt,
          config: { 
            responseMimeType: "application/json",
            thinkingConfig: { thinkingBudget: 500 }
          }
        });
        const res = JSON.parse(response.text || '{}');
        setAiAnalysis(res);
        studentSummary = res.description;
        parentAdvice = res.parentSupport;
      } catch (e) {
        console.error("AI Diagnostic Failure:", e);
      }
    }

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
      <div className="max-w-6xl mx-auto space-y-10 animate-in zoom-in-95 duration-700 pb-24">
        {aiAnalysis ? (
          <>
            <section className={`p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-10 transition-all duration-1000 ${
              aiAnalysis.riskLevel === 'HIGH' ? 'bg-rose-900' : aiAnalysis.riskLevel === 'MEDIUM' ? 'bg-indigo-900' : 'bg-emerald-900'
            }`}>
              <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12"><Fingerprint className="w-80 h-80" /></div>
              <div className="w-40 h-40 bg-white/10 rounded-[3rem] flex items-center justify-center backdrop-blur-xl shrink-0 border border-white/20">
                <Brain className="w-20 h-20 text-white" />
              </div>
              <div className="space-y-4 text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/10">
                   {aiAnalysis.riskLevel} Burnout Risk
                </div>
                <h2 className="text-5xl font-black tracking-tighter italic leading-none">{aiAnalysis.profile}</h2>
                <p className="text-white/70 text-lg font-medium max-w-2xl">{aiAnalysis.archetype} Strategy Profile</p>
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-8">
                <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-10">
                  <div className="flex items-center gap-4 border-b border-slate-100 pb-8">
                    <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center">
                       <Layout className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-800 tracking-tight">Clinical Insights</h3>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">Generated via Gemini Reasoning Node</p>
                    </div>
                  </div>
                  <p className="text-slate-600 text-lg leading-relaxed font-medium">{aiAnalysis.description}</p>
                </div>
              </div>
              <div className="lg:col-span-4 space-y-8">
                <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
                  <h4 className="font-black text-slate-400 uppercase text-[10px] tracking-widest text-center mb-6">Cognitive Map</h4>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                        <PolarGrid stroke="#f1f5f9" />
                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 8, fontWeight: 'bold', fill: '#94a3b8' }} />
                        <Radar name="Student" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} strokeWidth={3} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-8 bg-white rounded-[4rem] border border-slate-100 shadow-sm">
             <Loader2 className="w-24 h-24 text-indigo-600 animate-spin" />
             <p className="text-3xl font-black text-slate-900 italic tracking-tight">Processing Cognitive Matrix...</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-1 text-center md:text-left">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight italic leading-none">Diagnostic Interface.</h2>
          <p className="text-slate-500 font-medium">Dimension analysis for competitive dominance.</p>
        </div>
      </div>

      <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-2xl relative overflow-hidden min-h-[550px] flex flex-col justify-between">
        <div className="relative z-10 flex flex-col items-center text-center space-y-8">
          <div className={`w-28 h-28 bg-${currentQ.color}-50 text-${currentQ.color}-600 rounded-[3rem] flex items-center justify-center shadow-inner`}>
            <currentQ.icon className="w-14 h-14" />
          </div>
          <div className="space-y-3">
            <h3 className="text-4xl font-black text-slate-900 tracking-tight leading-none">{currentQ.title}</h3>
            <p className="text-slate-500 text-lg font-medium max-w-xl">{currentQ.subtitle}</p>
          </div>
          <div className="w-full max-w-2xl pt-10">
               <input 
                type="range" min="0" max="10" step="1"
                value={scores[currentQ.id as keyof typeof scores]}
                onChange={(e) => setScores({...scores, [currentQ.id]: parseInt(e.target.value)})}
                className="w-full h-4 bg-slate-100 rounded-full appearance-none cursor-pointer accent-indigo-600 outline-none"
               />
               <div className="flex justify-between mt-8">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{currentQ.low}</span>
                  <span className="text-3xl font-black text-indigo-600">{scores[currentQ.id as keyof typeof scores]}</span>
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{currentQ.high}</span>
               </div>
            <div className="flex justify-between items-center gap-6 pt-16">
              <button disabled={step === 0} onClick={() => setStep(step - 1)} className="px-10 py-5 border-2 border-slate-100 text-slate-400 font-black rounded-[2rem] hover:bg-slate-50 disabled:opacity-0 transition-all uppercase text-[10px] tracking-widest">Previous</button>
              {step === questions.length - 1 ? (
                <button onClick={handleFinish} disabled={isFinishing} className="bg-indigo-600 text-white px-14 py-5 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl flex items-center gap-4 hover:scale-105 transition-all">Construct Blueprint <Sparkles className="w-5 h-5" /></button>
              ) : (
                <button onClick={() => setStep(step + 1)} className="bg-slate-900 text-white px-14 py-5 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:bg-black transition-all flex items-center gap-4">Continue <ChevronRight className="w-5 h-5" /></button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PsychometricTest;
