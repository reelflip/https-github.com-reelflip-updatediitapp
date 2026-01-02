
import React from 'react';
import { StudentData } from '../types';
import { 
  Brain, Heart, Activity, Target, Zap, 
  ChevronRight, ShieldCheck, Moon, Sun, Flame, 
  RefreshCcw, Sparkles, History
} from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, Radar as RadarArea, ResponsiveContainer } from 'recharts';

interface WellnessModuleProps {
  data: StudentData;
  setData: (data: StudentData) => void;
}

const WellnessModule: React.FC<WellnessModuleProps> = ({ data }) => {
  const currentScore = data.psychometricHistory?.[data.psychometricHistory.length - 1] || {
    stress: 0, focus: 0, motivation: 0, examFear: 0, timestamp: ''
  };

  const radarData = [
    { subject: 'Stress', A: (currentScore.stress || 5) * 10 },
    { subject: 'Focus', A: (currentScore.focus || 5) * 10 },
    { subject: 'Motivation', A: (currentScore.motivation || 5) * 10 },
    { subject: 'Exam Fear', A: (currentScore.examFear || 5) * 10 },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-32 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
        <div className="space-y-3 px-4">
           <div className="text-[11px] font-black uppercase text-indigo-600 tracking-[0.5em] flex items-center gap-3">
              <Activity className="w-5 h-5" /> Behavioral Telemetry
           </div>
           <h2 className="text-6xl font-black text-slate-900 tracking-tighter italic leading-none uppercase">Core <br /><span className="text-indigo-600">Wellness.</span></h2>
        </div>
        <button 
           onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'psychometric' }))} 
           className="bg-slate-900 text-white px-12 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all flex items-center gap-4"
        >
           {currentScore.timestamp ? 'Update Mindset Pulse' : 'Initialize Mindset Test'} <Brain className="w-5 h-5" />
        </button>
      </div>

      {!currentScore.timestamp ? (
        <div className="bg-white p-20 rounded-[4rem] text-center space-y-8 border-4 border-dashed border-slate-100 mx-4">
           <div className="w-24 h-24 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto shadow-inner"><Brain className="w-12 h-12" /></div>
           <div className="space-y-2">
              <h3 className="text-3xl font-black text-slate-900 italic uppercase">Mindset Calibration Required.</h3>
              <p className="text-slate-400 max-w-sm mx-auto font-medium">Please complete a Mindset Test to unlock your comprehensive wellness analytics and personalized protocols.</p>
           </div>
        </div>
      ) : (
        <div className="space-y-12 px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Anxiety Load', val: currentScore.stress, color: 'rose', icon: Activity },
              { label: 'Focus Depth', val: currentScore.focus, color: 'indigo', icon: Target },
              { label: 'Motivation', val: currentScore.motivation, color: 'emerald', icon: Flame },
              { label: 'Exam Fear', val: currentScore.examFear, color: 'amber', icon: ShieldCheck }
            ].map((s, i) => (
              <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-indigo-400 transition-all">
                <div className={`w-12 h-12 bg-${s.color}-50 text-${s.color}-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform`}><s.icon className="w-6 h-6" /></div>
                <div><div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{s.label}</div><div className="text-3xl font-black text-slate-800 font-space">{s.val}<span className="text-xs text-slate-300 ml-1">/10</span></div></div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
             <div className="lg:col-span-8 space-y-10">
                <div className="bg-slate-900 rounded-[3.5rem] p-12 md:p-16 text-white space-y-8 shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-110 transition-transform"><Heart className="w-64 h-64" /></div>
                   <div className="relative z-10 space-y-2">
                      <h3 className="text-3xl font-black italic tracking-tighter uppercase text-indigo-400">Psychological State.</h3>
                      <p className="text-slate-400 font-medium italic">Latest analysis from {currentScore.timestamp}</p>
                   </div>
                   <div className="p-8 bg-white/5 border border-white/10 rounded-3xl relative z-10">
                      <p className="text-lg md:text-xl font-bold italic text-indigo-100 leading-relaxed">
                        "{currentScore.studentSummary || "Maintain consistency and focus on core concepts."}"
                      </p>
                   </div>
                   <div className="pt-8 border-t border-white/10 flex justify-between items-center relative z-10">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live Health Sync</span>
                      </div>
                      <button onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'psychometric' }))} className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 hover:text-white transition-all flex items-center gap-2">Update Pulse <ChevronRight className="w-4 h-4" /></button>
                   </div>
                </div>
             </div>
             
             <div className="lg:col-span-4 bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm flex flex-col items-center justify-center space-y-8">
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                      <PolarGrid stroke="#f1f5f9" />
                      <PolarAngleAxis dataKey="subject" tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
                      <RadarArea name="Current State" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.5} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center space-y-2">
                   <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">Cognitive Balance</h4>
                   <p className="text-xs font-bold italic text-slate-500">Visual mapping of your psychological preparation vectors.</p>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WellnessModule;
