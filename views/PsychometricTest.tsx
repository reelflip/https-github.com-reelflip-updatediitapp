
import React, { useState } from 'react';
import { StudentData, PsychometricScore } from '../types';
import { 
  Brain, ChevronRight, ChevronLeft, Sparkles, Zap, Target, Clock, ShieldAlert,
  Loader2, HeartHandshake, Moon, Activity, UserCheck, Users, Layout, Trophy,
  AlertTriangle, Lightbulb, CheckCircle2, Fingerprint, BarChart, LineChart
} from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface PsychometricTestProps {
  data: StudentData;
  setData: (data: StudentData) => void;
}

const PsychometricTest: React.FC<PsychometricTestProps> = ({ data, setData }) => {
  const [step, setStep] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);

  const [scores, setScores] = useState({
    stress: 5, focus: 5, motivation: 5, examFear: 5, fatigue: 5, sleep: 5,
    consistency: 5, confidence: 5, socialSupport: 5, vitality: 5, backlogGuilt: 5, subjectDread: 5
  });

  const questions = [
    { id: 'stress', title: 'Academic Pressure', subtitle: 'Overwhelmed by syllabus volume.', low: 'Calm', high: 'In Crisis', icon: ShieldAlert, color: 'rose' },
    { id: 'focus', title: 'Concentration Depth', subtitle: 'Ability to enter Flow State.', low: 'Scattered', high: 'Laser-Like', icon: Target, color: 'indigo' },
    { id: 'motivation', title: 'Intrinsic Drive', subtitle: 'Genuine desire to solve problems.', low: 'Low', high: 'Unstoppable', icon: Zap, color: 'emerald' },
    { id: 'examFear', title: 'Performance Anxiety', subtitle: 'Nervousness about the final JEE day.', low: 'Unfazed', high: 'Paralyzing', icon: Brain, color: 'violet' }
  ];

  // Fixed: explicitly casting Object.entries values to number to satisfy arithmetic operation requirements
  const radarData = (Object.entries(scores) as [string, number][]).slice(0, 4).map(([k, v]) => ({
    subject: k.toUpperCase(),
    A: v * 10,
    fullMark: 100
  }));

  const handleFinish = async () => {
    setIsFinishing(true);
    // Simulate Local Heuristic Calculation
    await new Promise(r => setTimeout(r, 1500));

    const riskLevel = scores.stress > 7 || scores.fatigue > 7 ? 'HIGH' : scores.stress > 4 ? 'MEDIUM' : 'LOW';
    
    const localReport = {
      profile: riskLevel === 'HIGH' ? "Burnout Buffer Mode" : "High Performance Flow",
      archetype: riskLevel === 'HIGH' ? "Over-Exerted Strategist" : "Consistent Optimizer",
      description: `Analysis shows a ${riskLevel.toLowerCase()} risk profile. Your focus scores indicate strong morning alertness but tapering evening stamina. Recommend shifting high-weightage math to morning slots.`,
      tacticalActions: ["Implement 50/10 Pomodoro Cycles", "Limit digital screen time 1hr before sleep"],
      mindsetShifts: ["Focus on inputs (hours), not outputs (test ranks)", "Celebrate small syllabus wins"],
      parentSupport: "Encourage frequent short breaks and maintain a positive, pressure-free evening atmosphere.",
      weeklyGoal: "Achieve 85% routine adherence without sacrificing sleep.",
      riskLevel: riskLevel
    };

    const newEntry: PsychometricScore = {
      stress: scores.stress,
      focus: scores.focus,
      motivation: scores.motivation,
      examFear: scores.examFear,
      timestamp: new Date().toISOString().split('T')[0],
      studentSummary: localReport.description,
      parentAdvice: localReport.parentSupport
    };

    setAiAnalysis(localReport);
    setData({ ...data, psychometricHistory: [...data.psychometricHistory, newEntry] });
    setIsFinishing(false);
    setStep(questions.length);
  };

  const currentQ = questions[step];

  if (step === questions.length) {
    return (
      <div className="max-w-6xl mx-auto space-y-10 animate-in zoom-in-95 duration-700 pb-24">
        {aiAnalysis && (
          <>
            <section className={`p-12 rounded-[3.5rem] text-white shadow-2xl flex flex-col md:flex-row items-center gap-10 ${
              aiAnalysis.riskLevel === 'HIGH' ? 'bg-rose-900' : 'bg-indigo-900'
            }`}>
              <div className="w-32 h-32 bg-white/10 rounded-[2.5rem] flex items-center justify-center shrink-0 border border-white/20">
                <Brain className="w-16 h-16 text-white" />
              </div>
              <div className="space-y-4 text-center md:text-left">
                <div className="inline-flex px-4 py-1 rounded-full bg-white/10 text-[10px] font-black uppercase tracking-widest border border-white/10">
                   {aiAnalysis.riskLevel} Stress Risk Detected
                </div>
                <h2 className="text-5xl font-black italic tracking-tighter">{aiAnalysis.profile}</h2>
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
                  <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3"><Layout className="w-6 h-6 text-indigo-600" /> Intelligence Insights</h3>
                  <p className="text-slate-600 text-lg leading-relaxed font-medium">{aiAnalysis.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                        <h4 className="text-xs font-black uppercase text-indigo-600 mb-4">Tactical Shift</h4>
                        <ul className="space-y-2 text-sm text-slate-600 font-bold">{aiAnalysis.tacticalActions.map((a:string, i:number) => <li key={i}>• {a}</li>)}</ul>
                     </div>
                     <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                        <h4 className="text-xs font-black uppercase text-indigo-600 mb-4">Mindset Tip</h4>
                        <p className="text-sm text-slate-600 font-medium italic">"{aiAnalysis.mindsetShifts[0]}"</p>
                     </div>
                  </div>
              </div>
              <div className="lg:col-span-4 bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col items-center">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Cognitive Balance</h4>
                 <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                        <PolarGrid stroke="#f1f5f9" />
                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 8, fontWeight: 'bold', fill: '#94a3b8' }} />
                        <Radar name="Student" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} strokeWidth={3} />
                      </RadarChart>
                    </ResponsiveContainer>
                 </div>
                 <button onClick={() => setStep(0)} className="w-full mt-6 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all">Retake Test</button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500 pb-20">
      <div className="space-y-1">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight italic">Performance Diagnostic.</h2>
        <p className="text-slate-500 font-medium">No API connection required. Local heuristic analysis.</p>
      </div>

      <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-2xl flex flex-col justify-between min-h-[500px]">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className={`w-24 h-24 bg-${currentQ.color}-50 text-${currentQ.color}-600 rounded-[2.5rem] flex items-center justify-center shadow-inner`}>
            <currentQ.icon className="w-12 h-12" />
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
            <div className="flex justify-between gap-6 pt-16">
              <button disabled={step === 0} onClick={() => setStep(step - 1)} className="px-10 py-5 border-2 border-slate-100 text-slate-400 font-black rounded-2xl transition-all uppercase text-[10px] tracking-widest">Previous</button>
              {step === questions.length - 1 ? (
                <button onClick={handleFinish} disabled={isFinishing} className="bg-indigo-600 text-white px-14 py-5 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl flex items-center gap-4 hover:scale-105 transition-all">
                  {isFinishing ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-5 h-5" /> Analyze Matrix</>}
                </button>
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
