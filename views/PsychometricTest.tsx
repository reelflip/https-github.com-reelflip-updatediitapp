
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

    if (process.env.API_KEY) {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Act as a high-performance clinical psychologist specialized in elite competitive exams (IIT-JEE). 
        Analyze these 12 dimension scores (0-10):
        ${Object.entries(scores).map(([k, v]) => `${k}: ${v}`).join(', ')}.

        Generate an EXHAUSTIVE, clinical-grade diagnostic report in JSON.
        Include:
        1. A unique psychological archetype (e.g., "The Resilient perfectionist", "The Stalled Engine").
        2. A deep-dive cognitive profile analysis.
        3. 3 High-impact tactical habit changes for study efficiency.
        4. 3 Mindset shifts for resilience.
        5. Detailed strategy for parents to support the student without adding pressure.
        6. A specific "Weekly Mindset Goal".
        7. Overall burnout risk (LOW, MEDIUM, HIGH).

        Response must be valid JSON:
        { 
          "profile": "Profile Title",
          "archetype": "Archetype name",
          "description": "250-word deep analysis", 
          "tacticalActions": ["..."],
          "mindsetShifts": ["..."],
          "parentSupport": "strategy text",
          "weeklyGoal": "one specific goal",
          "riskLevel": "HIGH"
        }
      `;

      try {
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: prompt,
          config: { 
            responseMimeType: "application/json",
            thinkingConfig: { thinkingBudget: 1000 }
          }
        });
        const res = JSON.parse(response.text || '{}');
        setAiAnalysis(res);
        studentSummary = res.description;
        parentAdvice = res.parentSupport;
      } catch (e) {
        console.error("AI Evaluation failed:", e);
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
            {/* Executive Header */}
            <section className={`p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-10 transition-all duration-1000 ${
              aiAnalysis.riskLevel === 'HIGH' ? 'bg-rose-900' : aiAnalysis.riskLevel === 'MEDIUM' ? 'bg-indigo-900' : 'bg-emerald-900'
            }`}>
              <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12"><Fingerprint className="w-80 h-80" /></div>
              <div className="w-40 h-40 bg-white/10 rounded-[3rem] flex items-center justify-center backdrop-blur-xl shrink-0 border border-white/20">
                <Brain className="w-20 h-20 text-white" />
              </div>
              <div className="space-y-4 text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/10">
                   Cognitive Profile: {aiAnalysis.riskLevel} Burnout Risk
                </div>
                <h2 className="text-5xl font-black tracking-tighter italic leading-none">{aiAnalysis.profile}</h2>
                <p className="text-white/70 text-lg font-medium max-w-2xl">{aiAnalysis.archetype} Archetype</p>
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Detailed Report */}
              <div className="lg:col-span-8 space-y-8">
                <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-10">
                  <div className="flex items-center gap-4 border-b border-slate-100 pb-8">
                    <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center">
                       <Layout className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-800">In-Depth Clinical Insights</h3>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">Generated via Gemini 2.5 Cognitive Analysis</p>
                    </div>
                  </div>
                  
                  <div className="prose prose-slate max-w-none prose-p:text-slate-600 prose-p:text-lg prose-p:leading-relaxed prose-p:font-medium">
                    <p>{aiAnalysis.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-6">
                      <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-500" /> Tactical Study Shifts
                      </h4>
                      <ul className="space-y-4">
                        {aiAnalysis.tacticalActions.map((action, i) => (
                          <li key={i} className="flex gap-4 text-sm text-slate-600 font-bold leading-relaxed">
                            <span className="text-indigo-600">0{i+1}.</span> {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-indigo-50 p-8 rounded-[2.5rem] border border-indigo-100 space-y-6">
                      <h4 className="font-black text-indigo-900 uppercase text-xs tracking-widest flex items-center gap-2">
                        <Target className="w-4 h-4 text-indigo-600" /> Resilience Protocol
                      </h4>
                      <ul className="space-y-4">
                        {aiAnalysis.mindsetShifts.map((shift, i) => (
                          <li key={i} className="flex gap-4 text-sm text-indigo-800 font-bold leading-relaxed">
                            <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" /> {shift}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Parent Support Section */}
                <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform"><AlertTriangle className="w-48 h-48" /></div>
                  <div className="flex items-center gap-4 mb-8">
                     <div className="w-16 h-16 bg-rose-500 rounded-[2rem] flex items-center justify-center">
                        <HeartHandshake className="w-9 h-9 text-white" />
                     </div>
                     <div>
                        <h3 className="text-2xl font-black italic">The Parent Synergy Guide</h3>
                        <p className="text-rose-400 text-[10px] font-black uppercase tracking-widest">Shared for Collaborative Support</p>
                     </div>
                  </div>
                  <p className="text-slate-300 text-lg italic leading-relaxed font-medium border-l-4 border-rose-500 pl-8">
                    "{aiAnalysis.parentSupport}"
                  </p>
                </div>
              </div>

              {/* Sidebar Visualization */}
              <div className="lg:col-span-4 space-y-8">
                <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm space-y-6 overflow-hidden">
                  <h4 className="font-black text-slate-400 uppercase text-[10px] tracking-widest text-center">Psychological Map</h4>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                        <PolarGrid stroke="#f1f5f9" />
                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 8, fontWeight: 'bold', fill: '#94a3b8' }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} axisLine={false} tick={false} />
                        <Radar
                          name="Student"
                          dataKey="A"
                          stroke="#6366f1"
                          fill="#6366f1"
                          fillOpacity={0.15}
                          strokeWidth={3}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-indigo-600 p-8 rounded-[3rem] text-white space-y-6 shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><Target className="w-32 h-32" /></div>
                   <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
                      <Lightbulb className="w-8 h-8 text-indigo-200" />
                   </div>
                   <div>
                      <h4 className="font-black text-xl leading-tight">Weekly Mindset Goal</h4>
                      <p className="text-indigo-100 text-sm mt-3 font-medium leading-relaxed italic">"{aiAnalysis.weeklyGoal}"</p>
                   </div>
                   <button onClick={() => setStep(0)} className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 transition-all">Retake Assessment</button>
                </div>

                <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm space-y-4">
                  <h4 className="font-black text-slate-400 uppercase text-[10px] tracking-widest">Dimension Breakdown</h4>
                  <div className="space-y-3">
                    {(Object.entries(scores) as [string, number][]).map(([key, val]) => (
                      <div key={key}>
                        <div className="flex justify-between text-[9px] font-black uppercase text-slate-500 mb-1">
                          <span>{key.replace(/([A-Z])/g, ' $1')}</span>
                          <span className={val > 7 ? 'text-rose-500' : 'text-slate-900'}>{val}/10</span>
                        </div>
                        <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                           <div className={`h-full transition-all duration-1000 ${val > 7 ? 'bg-rose-500' : 'bg-indigo-500'}`} style={{ width: `${val * 10}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-8 bg-white rounded-[4rem] border border-slate-100 shadow-sm">
             <div className="relative">
                <Loader2 className="w-32 h-32 text-indigo-600 animate-spin" />
                <Brain className="w-12 h-12 text-indigo-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
             </div>
             <div className="text-center space-y-3">
                <p className="text-3xl font-black text-slate-900 italic tracking-tight">Constructing Cognitive Blueprint...</p>
                <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.4em]">Querying Advanced Clinical Engine</p>
             </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-1 text-center md:text-left">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight italic">Performance Diagnostic.</h2>
          <p className="text-slate-500 font-medium">12-dimensional analysis of your competitive state.</p>
        </div>
        <div className="flex items-center gap-6 bg-white px-8 py-4 rounded-[2rem] border border-slate-200 shadow-sm">
           <div className="w-48 h-3 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600 transition-all duration-500" style={{ width: `${(step / questions.length) * 100}%` }}></div>
           </div>
           <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{step + 1} / {questions.length}</span>
        </div>
      </div>

      <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-2xl relative overflow-hidden min-h-[550px] flex flex-col justify-between">
        <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12 scale-150">
           <currentQ.icon className="w-80 h-80" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center text-center space-y-8">
          <div className={`w-28 h-28 bg-${currentQ.color}-50 text-${currentQ.color}-600 rounded-[3rem] flex items-center justify-center shadow-inner border border-${currentQ.color}-100`}>
            <currentQ.icon className="w-14 h-14" />
          </div>
          <div className="space-y-3">
            <h3 className="text-4xl font-black text-slate-900 tracking-tight">{currentQ.title}</h3>
            <p className="text-slate-500 text-lg font-medium max-w-xl leading-relaxed">{currentQ.subtitle}</p>
          </div>
          
          <div className="w-full max-w-2xl space-y-12 pt-10">
            <div className="relative pt-12 px-4">
               <div className="absolute -top-6 left-4 right-4 flex justify-between">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{currentQ.low}</span>
                  <span className={`text-3xl font-black ${scores[currentQ.id as keyof typeof scores] > 7 ? 'text-rose-600' : 'text-indigo-600'}`}>
                    {scores[currentQ.id as keyof typeof scores]}
                  </span>
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{currentQ.high}</span>
               </div>
               <input 
                type="range" min="0" max="10" step="1"
                value={scores[currentQ.id as keyof typeof scores]}
                onChange={(e) => setScores({...scores, [currentQ.id]: parseInt(e.target.value)})}
                className={`w-full h-5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-${currentQ.color}-600 focus:outline-none transition-all`}
               />
               <div className="flex justify-between px-1 mt-4">
                 {[0,1,2,3,4,5,6,7,8,9,10].map(n => (
                   <div key={n} className="w-0.5 h-2 bg-slate-200 rounded-full"></div>
                 ))}
               </div>
            </div>

            <div className="flex justify-between items-center gap-6 pt-10">
              <button 
                disabled={step === 0} 
                onClick={() => setStep(step - 1)} 
                className="flex items-center gap-3 px-10 py-5 border-2 border-slate-100 text-slate-400 font-black rounded-[2rem] hover:bg-slate-50 disabled:opacity-0 transition-all uppercase text-xs tracking-widest"
              >
                <ChevronLeft className="w-5 h-5" /> Previous
              </button>
              
              {step === questions.length - 1 ? (
                <button 
                  onClick={handleFinish} 
                  disabled={isFinishing}
                  className="bg-indigo-600 text-white px-14 py-5 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-4 hover:scale-105"
                >
                  Construct Blueprint <Sparkles className="w-5 h-5" />
                </button>
              ) : (
                <button 
                  onClick={() => setStep(step + 1)} 
                  className="bg-slate-900 text-white px-14 py-5 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-slate-200 hover:bg-black transition-all flex items-center gap-4 hover:scale-105"
                >
                  Continue <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PsychometricTest;
