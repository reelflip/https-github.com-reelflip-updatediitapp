
import React from 'react';
import { StudentData } from '../types';
import { Heart, Moon, Sun, Activity, Brain, CheckCircle, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface WellnessModuleProps {
  data: StudentData;
  activeView?: string;
}

const WellnessModule: React.FC<WellnessModuleProps> = ({ data }) => {
  // Safety Guard: Ensure current score exists, fallback to defaults for new users
  const history = data?.psychometricHistory || [];
  const current = history.length > 0 
    ? history[history.length - 1] 
    : { stress: 0, focus: 0, motivation: 0, examFear: 0 };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
      <div className="flex justify-between items-center px-4">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic">Student Wellness.</h2>
          <p className="text-slate-500 font-medium">Optimizing mental stamina for the JEE lifecycle.</p>
        </div>
        <div className="flex gap-2">
           <button className="bg-white border border-slate-200 px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-sm flex items-center gap-3 hover:bg-slate-50 transition-all">
             <Activity className="w-4 h-4 text-indigo-500" /> Daily Habits
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
        {[
          { icon: Brain, label: 'Anxiety', val: current.stress, color: 'rose', unit: '/10', desc: 'Stress Pressure' },
          { icon: Sun, label: 'Focus', val: current.focus, color: 'indigo', unit: '/10', desc: 'Stamina Depth' },
          { icon: Moon, label: 'Rest', val: 7.5, color: 'blue', unit: 'hrs', desc: 'Sleep Cycle' },
          { icon: Heart, label: 'Mood', val: current.motivation, color: 'emerald', unit: '/10', desc: 'Drive Index' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm group hover:border-indigo-400 transition-all">
             <div className={`w-12 h-12 bg-${stat.color}-50 text-${stat.color}-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner`}>
                <stat.icon className="w-6 h-6" />
             </div>
             <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{stat.label}</div>
             <div className="text-3xl font-black text-slate-800">
               {stat.val || 0}<span className="text-sm font-bold text-slate-300 ml-1 italic">{stat.unit}</span>
             </div>
             <div className="text-[9px] font-bold text-slate-400 mt-2 uppercase">{stat.desc}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 px-4">
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white p-10 rounded-[4rem] border border-slate-200 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity"><Brain className="w-64 h-64" /></div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-10">Neural Performance Tracking</h3>
              <div className="space-y-10">
                <div className="space-y-3">
                   <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 tracking-widest">
                      <span>Exam Anxiety Buffer</span>
                      <span className={current.examFear > 7 ? 'text-rose-500' : 'text-emerald-500'}>
                        {current.examFear > 0 ? (current.examFear > 7 ? 'Risk Level High' : 'Secure Level') : 'Awaiting Input'}
                      </span>
                   </div>
                   <div className="h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-50">
                      <div 
                        className={`h-full transition-all duration-1000 ${current.examFear > 7 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                        style={{ width: `${current.examFear > 0 ? 100 - (current.examFear * 10) : 0}%` }}
                      ></div>
                   </div>
                </div>
                <div className="space-y-3">
                   <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 tracking-widest">
                      <span>Motivation Stability</span>
                      <span className="text-indigo-600">High Velocity</span>
                   </div>
                   <div className="h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-50">
                      <div className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600" style={{ width: `${current.motivation * 10}%` }}></div>
                   </div>
                </div>
              </div>
              
              <div className="mt-12 p-10 bg-slate-900 rounded-[3rem] text-white flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform"><Sparkles className="w-40 h-40" /></div>
                 <div className="w-20 h-20 bg-white/10 rounded-[2rem] flex items-center justify-center shrink-0 border border-white/10 backdrop-blur-md">
                    <Brain className="w-10 h-10 text-indigo-300" />
                 </div>
                 <div className="flex-1 text-center md:text-left space-y-1">
                    <div className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.4em]">Integrated Intelligence</div>
                    <div className="text-2xl font-black italic tracking-tighter uppercase">Mental State Assessment</div>
                    <div className="text-xs text-slate-400 font-medium italic">Detect burnout risk factors using our diagnostic engine.</div>
                 </div>
                 <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'psychometric' }))}
                  className="bg-white text-slate-900 px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-3 shadow-xl"
                 >
                    Launch Test <ArrowRight className="w-4 h-4" />
                 </button>
              </div>
           </div>
        </div>

        <div className="space-y-8">
           <div className="bg-indigo-50 p-8 rounded-[3.5rem] border border-indigo-100 space-y-8">
              <h3 className="text-xs font-black text-indigo-900 uppercase tracking-[0.2em] flex items-center gap-3">
                <CheckCircle className="w-4 h-4" /> Performance Habits
              </h3>
              <div className="space-y-6">
                 {[
                   { label: '8 glasses of water', done: true },
                   { label: '20m Morning Sunlight', done: false },
                   { label: 'Screen-free dinner', done: true },
                   { label: 'Box Breathing Sets', done: false }
                 ].map((goal, i) => (
                   <div key={i} className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-lg border transition-all flex items-center justify-center ${goal.done ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300 shadow-sm'}`}>
                        {goal.done && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <span className={`text-sm font-bold italic ${goal.done ? 'text-indigo-900 line-through opacity-40' : 'text-slate-600'}`}>{goal.label}</span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm text-center space-y-6 relative overflow-hidden group">
              <div className="absolute top-0 left-0 p-8 opacity-5"><ShieldCheck className="w-24 h-24" /></div>
              <div className="w-16 h-16 bg-slate-50 rounded-2xl mx-auto flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                 <Activity className="w-8 h-8 text-slate-400" />
              </div>
              <div className="space-y-2">
                <h4 className="font-black text-lg text-slate-800 italic uppercase leading-none">Burnout Shield</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase leading-relaxed">Your current stress/fatigue ratio is being calibrated via mock data logs.</p>
              </div>
              <button className="text-indigo-600 text-[10px] font-black uppercase tracking-widest hover:underline transition-all">Detailed Logic Spec →</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default WellnessModule;
