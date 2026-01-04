
import React from 'react';
import { 
  Target, Brain, Activity, Layers, ShieldCheck, Zap, 
  Clock, TrendingUp, ShieldAlert, BookOpen, GraduationCap, 
  ArrowRight, Cpu, FileBarChart, MonitorCheck
} from 'lucide-react';

const FeaturesModule: React.FC = () => {
  return (
    <div className="bg-white min-h-screen animate-in fade-in duration-700">
      {/* --- HERO --- */}
      <section className="py-20 md:py-28 px-6 md:px-12 border-b border-slate-100 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-3 px-5 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">
             <MonitorCheck className="w-4 h-4" /> Professional Academic Toolkit
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase italic font-space">
            Advanced <br />
            <span className="text-indigo-600">Preparation Features.</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto italic font-medium">
            A comprehensive suite of tools designed to monitor, analyze, and optimize your preparation for IIT-JEE, NEET, and national engineering entrances.
          </p>
        </div>
      </section>

      {/* --- FEATURE GRID --- */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { 
              icon: Layers, 
              label: 'Smart Syllabus Tracker', 
              desc: 'Manage over 100 high-yield chapters in Physics, Chemistry, and Math. Real-time progress indicators track your journey from basics to mastery.',
              color: 'indigo'
            },
            { 
              icon: ShieldAlert, 
              label: 'Mistake Diagnostics', 
              desc: 'Identify recurring patterns in your errors. Distinguish between calculation slips, conceptual gaps, and time-pressure failures.',
              color: 'rose'
            },
            { 
              icon: Activity, 
              label: 'Accuracy Stability Index', 
              desc: 'A unique performance metric that correlates study time with accuracy to determine which topics are "stable" versus "drifting".',
              color: 'emerald'
            },
            { 
              icon: Clock, 
              label: 'Timed Practice Engine', 
              desc: 'Build solving speed for JEE Main and BITSAT with integrated timers that track your seconds-per-question metrics.',
              color: 'blue'
            },
            { 
              icon: Brain, 
              label: 'Mindset Calibration', 
              desc: 'Track exam anxiety, focus stamina, and motivation levels through psychometric pulses to maintain peak psychological performance.',
              color: 'amber'
            },
            { 
              icon: ShieldCheck, 
              label: 'Parent HANDSHAKE', 
              desc: 'Establish a secure uplink for guardians to monitor progress milestones and performance trajectories through private analytics.',
              color: 'slate'
            },
          ].map((f, i) => (
            <article key={i} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-indigo-200 transition-all group">
              <div className={`w-12 h-12 bg-${f.color}-50 text-${f.color}-600 rounded-xl flex items-center justify-center mb-6 shadow-inner`}>
                <f.icon className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-black text-slate-800 italic uppercase tracking-tight mb-4">{f.label}</h2>
              <p className="text-slate-500 text-sm leading-relaxed italic mb-8">"{f.desc}"</p>
              <div className="h-px bg-slate-50 w-full mb-6"></div>
              <div className="text-[9px] font-black uppercase text-indigo-600 tracking-widest flex items-center gap-2">
                Operational Tech <ArrowRight className="w-3 h-3" />
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* --- ANALYTICS PREVIEW --- */}
      <section className="py-20 px-6 md:px-12 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 space-y-8">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-tight">Data-Driven <br /><span className="text-indigo-600">Excellence.</span></h2>
            <p className="text-slate-600 text-lg leading-relaxed italic font-medium">
              Eliminate guesswork from your preparation. Our platform converts your study history into visual heatmaps and performance deltas, allowing you to pivot your strategy based on evidence.
            </p>
            <div className="grid grid-cols-2 gap-4">
               {['Syllabus Velocity', 'Accuracy Deltas', 'Retention Grids', 'Stress Buffer Logs'].map(tag => (
                 <div key={tag} className="px-5 py-3 bg-white border border-slate-200 rounded-xl text-[9px] font-black uppercase text-slate-400 tracking-widest text-center shadow-sm">{tag}</div>
               ))}
            </div>
          </div>
          <div className="lg:w-1/2 w-full">
             <div className="bg-white p-10 md:p-14 rounded-[3.5rem] shadow-xl border border-slate-200 space-y-8">
                <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                   <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white"><FileBarChart className="w-6 h-6" /></div>
                   <div className="text-xs font-black uppercase text-slate-400 tracking-widest">Diagnostic Analytics</div>
                </div>
                <div className="space-y-6">
                   {[
                     { label: 'Syllabus Stability', val: 78, color: 'bg-indigo-600' },
                     { label: 'Problem Precision', val: 84, color: 'bg-emerald-500' },
                     { label: 'Time Management', val: 62, color: 'bg-amber-500' }
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
