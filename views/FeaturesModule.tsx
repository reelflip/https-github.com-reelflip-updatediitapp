
import React from 'react';
import { 
  Target, Brain, Activity, RotateCw, Layers, ShieldCheck, Zap, Sparkles, Users 
} from 'lucide-react';

const FeaturesModule: React.FC = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 pb-20 max-w-7xl mx-auto space-y-20">
      
      {/* Visual Identity Section */}
      <div className="bg-white p-12 lg:p-20 rounded-[4rem] border border-slate-200 shadow-sm overflow-hidden relative">
         <div className="absolute top-0 right-0 p-12 opacity-5"><Sparkles className="w-80 h-80 text-indigo-600" /></div>
         <div className="max-w-3xl space-y-8 relative z-10">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-600">
               <Zap className="w-4 h-4" /> Feature Ecosystem v5.0
            </div>
            <h1 className="text-7xl font-black tracking-tighter leading-[0.95] text-slate-900 italic">Precision. <br /><span className="text-indigo-600">Performance.</span></h1>
            <p className="text-xl text-slate-500 font-medium leading-relaxed">
               The JEE-PRO ecosystem is a high-frequency tracking environment designed to eliminate academic friction.
            </p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { icon: Target, label: 'Pulse Heatmaps', desc: 'Visualize your syllabus coverage with unit-wise heatmaps based on actual question accuracy.', color: 'blue' },
          { icon: Brain, label: 'AI Psychometrics', desc: 'Predict burnout before it happens. Our heuristic model analyzes your stress vs. focus stability.', color: 'rose' },
          { icon: Activity, label: 'Velocity Tracking', desc: 'Monitor your "Solved Questions Per Hour" to master the speed requirements of JEE Main.', color: 'emerald' },
          { icon: RotateCw, label: 'Memory Persistence', desc: 'Spaced Repetition engine that flags aging concepts for immediate formula flushes.', color: 'violet' },
          { icon: Layers, label: 'Active Vault', desc: 'Searchable database of personal mistakes and high-weightage shortcuts.', color: 'amber' },
          { icon: ShieldCheck, label: 'Sentinel Security', desc: 'Encryption-grade data syncing between your local profile and the production node.', color: 'slate' },
        ].map((f, i) => (
          <div key={i} className="group p-10 rounded-[3rem] bg-white border border-slate-100 hover:border-indigo-400 hover:shadow-2xl transition-all duration-500">
            <div className={`w-14 h-14 bg-${f.color}-50 text-${f.color}-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-inner`}>
              <f.icon className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-4 italic tracking-tight">{f.label}</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Family Node Highlight */}
      <div className="bg-slate-900 rounded-[4rem] p-12 lg:p-20 text-white flex flex-col lg:flex-row items-center gap-16 relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 p-10 opacity-10"><Users className="w-96 h-96" /></div>
         <div className="w-32 h-32 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center shrink-0 border-8 border-white/10 shadow-2xl">
            <Users className="w-12 h-12" />
         </div>
         <div className="flex-1 space-y-6 relative z-10 text-center lg:text-left">
            <h2 className="text-4xl font-black italic tracking-tighter">Family Node Transparency.</h2>
            <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
               Bridge the gap between parental concern and student pressure. Secure data handshake allows parents to view <strong>Live Syllabus Velocity</strong> and <strong>Prep Health</strong> without non-essential interference. Support powered by clinical data.
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
               {['Score Transparency', 'Effort Logs', 'Stress Monitoring'].map(tag => (
                 <span key={tag} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest">{tag}</span>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default FeaturesModule;
