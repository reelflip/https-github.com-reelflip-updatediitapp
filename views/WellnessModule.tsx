
import React from 'react';
import { StudentData } from '../types';
import { Heart, Moon, Sun, Activity, Brain, CheckCircle, Sparkles, ArrowRight } from 'lucide-react';

interface WellnessModuleProps {
  data: StudentData;
  activeView?: string;
}

const WellnessModule: React.FC<WellnessModuleProps> = ({ data, activeView }) => {
  const current = data.psychometricHistory[data.psychometricHistory.length - 1];

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Student Wellness</h2>
          <p className="text-slate-500">Optimizing mental performance for the long run.</p>
        </div>
        <div className="flex gap-2">
           <button className="bg-white border border-slate-200 px-6 py-2.5 rounded-2xl text-sm font-bold shadow-sm flex items-center gap-2 hover:bg-slate-50 transition-all">
             <Activity className="w-4 h-4 text-indigo-500" /> Log Daily Habits
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Brain, label: 'Stress', val: current.stress, color: 'rose', unit: '/10' },
          { icon: Sun, label: 'Focus', val: current.focus, color: 'indigo', unit: '/10' },
          { icon: Moon, label: 'Sleep', val: 7.5, color: 'violet', unit: 'hrs' },
          { icon: Heart, label: 'Mood', val: 8, color: 'emerald', unit: '/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
             <div className={`w-10 h-10 bg-${stat.color}-100 text-${stat.color}-600 rounded-xl flex items-center justify-center mb-4`}>
                <stat.icon className="w-6 h-6" />
             </div>
             <div className="text-xs font-bold text-slate-400 uppercase mb-1">{stat.label}</div>
             <div className="text-3xl font-black text-slate-800">
               {stat.val}<span className="text-sm font-medium text-slate-400 ml-1">{stat.unit}</span>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5"><Sparkles className="w-32 h-32" /></div>
              <h3 className="font-bold text-lg mb-6">Mental Performance Snapshot</h3>
              <div className="space-y-8">
                <div>
                   <div className="flex justify-between text-sm mb-3">
                      <span className="font-bold text-slate-700">Exam Anxiety Management</span>
                      <span className={`font-bold ${current.examFear > 7 ? 'text-rose-500' : 'text-emerald-500'}`}>
                        {current.examFear > 7 ? 'Needs Work' : 'Optimal'}
                      </span>
                   </div>
                   <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${current.examFear > 7 ? 'bg-rose-400' : 'bg-emerald-400'}`} 
                        style={{ width: `${100 - (current.examFear * 10)}%` }}
                      ></div>
                   </div>
                </div>
                <div>
                   <div className="flex justify-between text-sm mb-3">
                      <span className="font-bold text-slate-700">Motivation Velocity</span>
                      <span className="text-slate-400">High Stability</span>
                   </div>
                   <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600" style={{ width: `${current.motivation * 10}%` }}></div>
                   </div>
                </div>
              </div>
              
              <div className="mt-10 p-8 bg-indigo-900 rounded-[2rem] text-white flex flex-col md:flex-row items-center gap-6 shadow-xl">
                 <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                    <Brain className="w-8 h-8 text-indigo-300" />
                 </div>
                 <div className="flex-1 text-center md:text-left">
                    <div className="text-xs font-black text-indigo-300 uppercase tracking-widest mb-1">Weekly Diagnostic</div>
                    <div className="text-xl font-bold">Mental State Assessment</div>
                    <div className="text-sm text-indigo-100/70">Analyze your focus trends and burnout risk.</div>
                 </div>
                 <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'psychometric' }))}
                  className="bg-white text-indigo-900 px-8 py-3 rounded-2xl font-black text-sm hover:bg-indigo-50 transition-all flex items-center gap-2"
                 >
                    Start Test <ArrowRight className="w-4 h-4" />
                 </button>
              </div>
           </div>
        </div>

        <div className="space-y-6">
           <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
              <h3 className="font-bold text-indigo-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" /> Mindset Habits
              </h3>
              <div className="space-y-4">
                 {[
                   { label: '8 glasses of water', done: true },
                   { label: '20 mins morning sunlight', done: false },
                   { label: 'Screen-free dinner', done: true },
                   { label: 'Deep breathing (3 sets)', done: false }
                 ].map((goal, i) => (
                   <div key={i} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded border ${goal.done ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300'} flex items-center justify-center`}>
                        {goal.done && <CheckCircle className="w-3 h-3 text-white" />}
                      </div>
                      <span className={`text-sm ${goal.done ? 'text-indigo-900 font-bold line-through opacity-50' : 'text-slate-600'}`}>{goal.label}</span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                 <Activity className="w-8 h-8 text-slate-400" />
              </div>
              <h4 className="font-bold mb-1">Burnout Shield</h4>
              <p className="text-xs text-slate-500 mb-4">Your current stress/fatigue ratio is safe. Keep the current focus blocks steady.</p>
              <button className="text-indigo-600 text-xs font-bold hover:underline">How we calculate this →</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default WellnessModule;
