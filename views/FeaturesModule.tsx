
import React from 'react';
import { 
  Target, Brain, Activity, RotateCw, Layers, ShieldCheck, Zap, Sparkles, Users, 
  Clock, TrendingUp, ShieldAlert, BookOpen, GraduationCap, ArrowRight
} from 'lucide-react';

const FeaturesModule: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* --- HERO SECTION --- */}
      <section className="cloud-bg py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-blue-50 border border-blue-100 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-[#1e3a8a] mb-4">
             <Zap className="w-4 h-4" /> Operational Ecosystem v6.7
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-[#1e3a8a] tracking-tight leading-none">
            Battle-Tested <br />
            <span className="text-[#82c341]">Protocols.</span>
          </h1>
          <p className="text-slate-500 text-xl max-w-3xl mx-auto leading-relaxed font-medium italic">
            Precision-engineered tools designed to eliminate friction points in the competitive JEE Advanced preparation lifecycle.
          </p>
        </div>
      </section>

      {/* --- CORE FEATURES GRID --- */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[
            { 
              icon: Target, 
              label: 'Pulse Heatmaps', 
              desc: 'Real-time synchronization of syllabus status. We correlate Effort Logs with Accuracy Delta to identify instability.',
              color: 'blue'
            },
            { 
              icon: Brain, 
              label: 'AI Psychometrics', 
              desc: 'Identify mental fatigue before it impacts your rank. Our model analyzes focus stamina and detects burnout risk.',
              color: 'emerald'
            },
            { 
              icon: TrendingUp, 
              label: 'Velocity Tracking', 
              desc: 'Master the clock. Track your solving speed vs Accuracy. Execution velocity under pressure is the vital edge.',
              color: 'indigo'
            },
            { 
              icon: RotateCw, 
              label: 'Neural Persistence', 
              desc: 'Spaced repetition cycles injected into your daily routine. Flashcards refresh at your forgetting curve peaks.',
              color: 'rose'
            },
            { 
              icon: ShieldAlert, 
              label: 'Error Ledgers', 
              desc: 'Stop repeat failures. Ledgers classify mistakes into Gaps vs Slips, allowing you to drill specific vectors.',
              color: 'amber'
            },
            { 
              icon: ShieldCheck, 
              label: 'Sentinel Security', 
              desc: 'Enterprise-grade encryption for performance data. Synchronize seamlessly with 100% integrity.',
              color: 'slate'
            },
          ].map((f, i) => (
            <div key={i} className="bg-white p-12 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 bg-slate-50 rounded-[1.5rem] flex items-center justify-center group-hover:scale-110 transition-transform">
                <f.icon className="w-10 h-10 text-[#1e3a8a]" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">{f.label}</h3>
              <p className="text-slate-500 leading-relaxed italic">
                "{f.desc}"
              </p>
              <div className="pt-4">
                 <button className="text-[11px] font-black uppercase tracking-widest text-[#1e3a8a] flex items-center gap-2 hover:gap-4 transition-all">
                    Full Spec <ArrowRight className="w-4 h-4" />
                 </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- FAMILY NODE SECTION --- */}
      <section className="py-24 px-6 md:px-12 bg-[#f8fafc] border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
          <div className="lg:w-1/2 space-y-8">
            <h2 className="text-5xl font-black text-[#1e3a8a] tracking-tight">Family Node <br /><span className="text-[#82c341]">Synergy.</span></h2>
            <p className="text-slate-600 text-xl leading-relaxed italic font-medium">
              Bridge the transparency gap. Our Secure Handshake Protocol allows parents to view syllabus velocity and health scores without interfering with deep-work cycles.
            </p>
            <div className="flex flex-wrap gap-4">
               {['Performance Stream', 'Telemetry', 'Benchmarking'].map(tag => (
                 <span key={tag} className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-500 shadow-sm">{tag}</span>
               ))}
            </div>
          </div>
          <div className="lg:w-1/2 flex justify-center">
             <div className="relative bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-50 max-w-md w-full">
                <div className="flex items-center gap-4 mb-10">
                   <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">A</div>
                   <div>
                      <h4 className="font-bold text-slate-800">Aryan Sharma</h4>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Active Node: 163110</p>
                   </div>
                </div>
                <div className="space-y-6">
                   <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold uppercase text-slate-400"><span>Syllabus Mastered</span><span>72%</span></div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-[72%]"></div></div>
                   </div>
                   <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold uppercase text-slate-400"><span>Focus Stamina</span><span>8/10</span></div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-green-500 w-[80%]"></div></div>
                   </div>
                </div>
                <div className="mt-10 pt-10 border-t border-slate-50">
                   <div className="text-[10px] font-black uppercase text-blue-500 tracking-widest text-center">Encrypted Family Link Active</div>
                </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeaturesModule;