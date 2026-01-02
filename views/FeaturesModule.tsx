
import React from 'react';
import { 
  Target, Brain, Activity, RotateCw, Layers, ShieldCheck, Zap, Sparkles, Users, 
  Clock, TrendingUp, ShieldAlert, BookOpen, GraduationCap, ArrowRight, Cpu, FileBarChart, MonitorCheck
} from 'lucide-react';

const FeaturesModule: React.FC = () => {
  return (
    <div className="bg-white min-h-screen animate-in fade-in duration-700">
      {/* --- HERO --- */}
      <section className="py-20 md:py-28 px-6 md:px-12 border-b border-slate-100 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-3 px-5 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">
             <MonitorCheck className="w-4 h-4" /> Platform Functionality Matrix
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase italic font-space">
            Platform <br />
            <span className="text-indigo-600">Features.</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto italic font-medium">
            A suite of analytical tools designed to remove ambiguity from engineering entrance preparation.
          </p>
        </div>
      </section>

      {/* --- FEATURE LIST --- */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { 
              icon: Layers, 
              label: 'Syllabus Pulse', 
              desc: 'Visual progress mapping across 90+ units of Physics, Chemistry, and Math. Identify uncovered topics instantly.',
              color: 'indigo'
            },
            { 
              icon: ShieldAlert, 
              label: 'Mistake Ledger', 
              desc: 'Log and categorize every incorrect MCQ. The platform identifies reoccurring conceptual weaknesses.',
              color: 'rose'
            },
            { 
              icon: Activity, 
              label: 'Stability Metrics', 
              desc: 'Correlate study hours with mock test accuracy to measure the stability of your knowledge in specific units.',
              color: 'emerald'
            },
            { 
              icon: Clock, 
              label: 'Execution Speed', 
              desc: 'Track solving time per question to optimize time management for JEE Main and BITSAT speed tests.',
              color: 'blue'
            },
            { 
              icon: Brain, 
              label: 'Cognitive Status', 
              desc: 'Analyze focus levels and neural fatigue through structured psychometric self-assessments.',
              color: 'amber'
            },
            { 
              icon: ShieldCheck, 
              label: 'Secure Handshake', 
              desc: 'Optional invitation-based performance visibility for parents and mentors with strict data privacy.',
              color: 'slate'
            },
          ].map((f, i) => (
            <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-indigo-200 transition-all group">
              <div className={`w-12 h-12 bg-${f.color}-50 text-${f.color}-600 rounded-xl flex items-center justify-center mb-6 shadow-inner`}>
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 italic uppercase tracking-tight mb-4">{f.label}</h3>
              <p className="text-slate-500 text-sm leading-relaxed italic mb-8">"{f.desc}"</p>
              <div className="h-px bg-slate-50 w-full mb-6"></div>
              <div className="text-[9px] font-black uppercase text-indigo-600 tracking-widest flex items-center gap-2">
                Operational Module <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- ANALYTICS PREVIEW --- */}
      <section className="py-20 px-6 md:px-12 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 space-y-8">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-tight">Evidence-Based <br /><span className="text-indigo-600">Reporting.</span></h2>
            <p className="text-slate-600 text-lg leading-relaxed italic font-medium">
              Data is visualized through heatmaps and stability charts, allowing for a neutral assessment of preparation quality without relying on intuition.
            </p>
            <div className="grid grid-cols-2 gap-4">
               {['Velocity Logs', 'Accuracy Deltas', 'Retention Grids', 'Stress Buffers'].map(tag => (
                 <div key={tag} className="px-5 py-3 bg-white border border-slate-200 rounded-xl text-[9px] font-black uppercase text-slate-400 tracking-widest text-center shadow-sm">{tag}</div>
               ))}
            </div>
          </div>
          <div className="lg:w-1/2 w-full">
             <div className="bg-white p-10 md:p-14 rounded-[3.5rem] shadow-xl border border-slate-200 space-y-8">
                <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                   <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white"><FileBarChart className="w-6 h-6" /></div>
                   <div className="text-xs font-black uppercase text-slate-400 tracking-widest">Performance Dashboard</div>
                </div>
                <div className="space-y-6">
                   {[
                     { label: 'Syllabus Stability', val: 68, color: 'bg-indigo-600' },
                     { label: 'Numerical Precision', val: 82, color: 'bg-emerald-500' },
                     { label: 'Time Management', val: 54, color: 'bg-amber-500' }
                   ].map(bar => (
                     <div key={bar.label} className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 tracking-widest"><span>{bar.label}</span><span>{bar.val}%</span></div>
                        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden"><div className={`${bar.color} h-full transition-all duration-1000`} style={{ width: `${bar.val}%` }}></div></div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeaturesModule;
