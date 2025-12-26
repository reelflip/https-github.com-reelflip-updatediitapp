import React from 'react';
import { 
  Target, Brain, Activity, RotateCw, Layers, ShieldCheck, Zap, Sparkles, Users, 
  Clock, TrendingUp, ShieldAlert, BookOpen, GraduationCap, ArrowRight
} from 'lucide-react';

const FeaturesModule: React.FC = () => {
  return (
    <div className="bg-[#0a0c1a] text-white min-h-screen animate-in fade-in slide-in-from-bottom-4 pb-40 px-8 md:px-16 max-w-[1600px] mx-auto space-y-40 pt-20">
      
      {/* --- FEATURE HERO --- */}
      <div className="bg-[#161a2e] p-16 lg:p-32 rounded-[6rem] border border-[#2d3656] shadow-2xl overflow-hidden relative group">
         <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-110 transition-transform duration-[5s]"><Sparkles className="w-[600px] h-[600px] text-indigo-400" /></div>
         <div className="max-w-4xl space-y-12 relative z-10">
            <div className="inline-flex items-center gap-4 px-6 py-3 bg-[#0d1021] border border-[#1e2440] rounded-full text-[11px] font-black uppercase tracking-[0.5em] text-indigo-400 shadow-xl">
               <Zap className="w-5 h-5" /> Feature Ecosystem v6.7
            </div>
            <h1 className="text-8xl md:text-9xl font-black tracking-tighter leading-[0.85] text-white italic uppercase">BATTLE-TESTED <br /><span className="text-[#5d5fef]">PROTOCOLS.</span></h1>
            <p className="text-3xl text-[#7d8cb8] font-medium leading-relaxed italic max-w-2xl">
               Precision-engineered protocols designed to eliminate friction points in the JEE Advanced preparation lifecycle.
            </p>
         </div>
      </div>

      {/* --- PRIMARY PROTOCOLS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {[
          { 
            icon: Target, 
            label: 'Pulse Heatmaps', 
            desc: 'Real-time synchronization of syllabus status. We correlate "Effort Logs" with "Accuracy Delta" to identify chapters entering memory instability.',
            meta: 'STABILITY INDEX'
          },
          { 
            icon: Brain, 
            label: 'AI Psychometrics', 
            desc: 'Identify mental fatigue before it impacts your rank. Our model analyzes focus stamina across solving blocks and detects cognitive burnout risk.',
            meta: 'FOCUS RECOVERY'
          },
          { 
            icon: TrendingUp, 
            label: 'Velocity Tracking', 
            desc: 'Master the clock. Track your solving speed (Qs/Hr) vs Accuracy. Success in JEE Main is determined by execution velocity under pressure.',
            meta: 'PERFORMANCE DATA'
          },
          { 
            icon: RotateCw, 
            label: 'Neural Persistence', 
            desc: 'Spaced repetition cycles injected directly into your daily routine. Formula flashcards refresh exactly at your personal forgetting curve peaks.',
            meta: 'MEMORY CACHE'
          },
          { 
            icon: ShieldAlert, 
            label: 'Error Ledgers', 
            desc: 'Stop repeat failures. Ledgers classify mistakes into Conceptual Gaps vs Calculation Slips, allowing you to drill specific weak vectors.',
            meta: 'FAILURE ANALYSIS'
          },
          { 
            icon: ShieldCheck, 
            label: 'Sentinel Security', 
            desc: 'Enterprise-grade encryption for all performance data. Synchronize seamlessly across nodes with 100% data integrity and offline support.',
            meta: 'INFRASTRUCTURE'
          },
        ].map((f, i) => (
          <div key={i} className="group p-16 rounded-[5.5rem] bg-[#161a2e] border border-[#2d3656] hover:border-[#5d5fef]/50 transition-all duration-700 hover:shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col justify-between h-full relative overflow-hidden">
            <div className="absolute -right-12 -bottom-12 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-1000"><f.icon className="w-64 h-64" /></div>
            <div>
              <div className="w-20 h-20 bg-[#0d1021] border border-[#1e2440] text-indigo-400 rounded-3xl flex items-center justify-center mb-14 group-hover:scale-110 group-hover:bg-[#5d5fef] group-hover:text-white transition-all shadow-inner">
                <f.icon className="w-9 h-9" />
              </div>
              <div className="space-y-6">
                 <div className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.4em]">{f.meta}</div>
                 <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">{f.label}</h3>
                 <p className="text-[#7d8cb8] text-lg leading-relaxed font-medium group-hover:text-slate-200 transition-colors italic">
                    "{f.desc}"
                 </p>
              </div>
            </div>
            <div className="pt-12 flex items-center gap-4 text-indigo-400 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-2">
               <span className="text-[10px] font-black uppercase tracking-[0.3em]">Full Spec</span>
               <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      {/* --- FAMILY NODE TRANSPARENCY --- */}
      <div className="bg-[#0d1021] rounded-[6rem] p-16 lg:p-32 text-white flex flex-col lg:flex-row items-center gap-24 relative overflow-hidden shadow-2xl border border-[#1e2440]">
         <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform duration-[6s]"><Users className="w-[800px] h-[800px]" /></div>
         <div className="w-48 h-48 bg-[#161a2e] border border-[#2d3656] rounded-[4rem] flex items-center justify-center shrink-0 shadow-2xl text-indigo-400 relative z-10 group-hover:rotate-12 transition-transform">
            <Users className="w-20 h-20" />
         </div>
         <div className="flex-1 space-y-10 relative z-10 text-center lg:text-left">
            <h2 className="text-6xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">Family Node <br /><span className="text-[#5d5fef]">Synergy.</span></h2>
            <p className="text-[#7d8cb8] text-2xl leading-relaxed max-w-3xl italic font-medium">
               Bridge the transparency gap. Our <strong>Secure Handshake Protocol</strong> allows parents to view syllabus velocity and psychological health scores without interfering with daily deep-work cycles.
            </p>
            <div className="flex flex-wrap gap-5 justify-center lg:justify-start">
               {['Live Performance Stream', 'Mental State Telemetry', 'Strategic Benchmarking'].map(tag => (
                 <span key={tag} className="px-8 py-4 bg-[#161a2e] border border-[#2d3656] rounded-2xl text-[11px] font-black uppercase tracking-widest text-indigo-400 shadow-sm">{tag}</span>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default FeaturesModule;