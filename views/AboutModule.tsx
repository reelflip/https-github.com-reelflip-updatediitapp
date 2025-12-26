
import React from 'react';
import { 
  BookOpen, Target, CalendarClock, BarChart2, ClipboardList, 
  Heart, Brain, Award, Users, Globe, CheckCircle2, 
  Sparkles, Zap, TrendingUp, ShieldCheck, ChevronRight,
  Cpu, Network, Fingerprint, Activity
} from 'lucide-react';

const AboutModule: React.FC = () => {
  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen selection:bg-indigo-600/10">
      <div className="max-w-7xl mx-auto py-24 px-6 space-y-32 animate-in fade-in duration-1000">
        
        {/* --- HERO SECTION --- */}
        <section className="relative text-center space-y-10 pt-10">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-600/5 blur-[140px] rounded-full pointer-events-none -z-10"></div>
          
          <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-white rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600 border border-slate-200 shadow-sm">
             <Sparkles className="w-4 h-4" /> Global Intelligence Node 01
          </div>
          
          <h1 className="text-7xl md:text-[9rem] font-black tracking-tighter italic leading-[0.8] uppercase text-slate-900">
            ENGINEER <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-indigo-600 to-slate-900">DESTINY.</span>
          </h1>
          
          <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed text-xl md:text-2xl font-medium italic">
            "The digital infrastructure for high-velocity engineering aspirants. Track mastery, solve gaps, dominate the curve."
          </p>

          <div className="pt-10 flex flex-wrap justify-center gap-6">
             <div className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-indigo-200 hover:scale-105 transition-all cursor-pointer">
                Initialize Session
             </div>
             <div className="px-10 py-5 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-slate-50 transition-all cursor-pointer shadow-sm">
                Explore Protocol
             </div>
          </div>
        </section>

        {/* --- CORE PILLARS --- */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {[
            { label: 'IIT', tagline: 'The Gold Standard', desc: 'Precision-engineered tracking for JEE Advanced. We prioritize cognitive depth over volume.', icon: Cpu },
            { label: 'GEE', tagline: 'Unified Access', desc: 'Strategic coverage for BITSAT, VITEEE, and State Entrances. One node, unlimited options.', icon: Network },
            { label: 'PREP', tagline: 'Data Synergy', desc: 'Transforming chaotic study hours into a measurable science using local heuristics.', icon: Fingerprint },
          ].map((item, i) => (
            <div key={i} className="p-12 rounded-[4.5rem] bg-white border border-slate-200 hover:border-indigo-600/30 transition-all group relative overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-indigo-100">
               <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform duration-1000"><item.icon className="w-40 h-40 text-indigo-600" /></div>
               <span className="text-7xl font-black block mb-8 italic tracking-tighter text-slate-200 group-hover:text-indigo-600 transition-colors">{item.label}</span>
               <h3 className="text-[10px] uppercase font-black tracking-[0.4em] text-indigo-600 block mb-4">{item.tagline}</h3>
               <p className="text-slate-500 leading-relaxed font-bold text-sm">
                 {item.desc}
               </p>
            </div>
          ))}
        </section>

        {/* --- SYSTEM TOOLS --- */}
        <section className="space-y-16">
          <div className="flex flex-col md:flex-row justify-between items-end gap-10">
            <div className="space-y-4">
              <div className="text-[11px] font-black uppercase text-indigo-600 tracking-[0.5em]">Tactical Interface</div>
              <h2 className="text-6xl font-black italic tracking-tighter leading-none text-slate-900">The Engine.</h2>
            </div>
            <p className="text-slate-400 font-medium text-lg max-w-sm md:text-right italic">"Optimizing the six fundamental dimensions of prep performance."</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Pulse Heatmaps', icon: Activity, desc: 'Real-time visualization of syllabus mastery based on historical accuracy.' },
              { title: 'Mock Matrix', icon: Target, desc: 'Standardized test environments designed to simulate high-pressure exam day conditions.' },
              { title: 'Neural Planner', icon: CalendarClock, desc: 'Dynamic scheduling that adapts to your school rhythm and coaching load.' },
              { title: 'Retention Hub', icon: Zap, desc: 'Spaced repetition algorithms that prevent formula decay and concept drift.' },
              { title: 'Error Ledger', icon: ClipboardList, desc: 'Classify and eliminate repetitive mistakes with topper-grade logging protocols.' },
              { title: 'Wellness Sync', icon: Brain, desc: 'Psychometric monitoring to detect burnout risks and optimize mental stamina.' },
            ].map((tool, i) => (
              <div key={i} className="bg-white p-12 rounded-[4rem] border border-slate-100 hover:border-indigo-600 transition-all hover:shadow-2xl hover:shadow-indigo-100 group">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-[1.5rem] flex items-center justify-center mb-10 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
                  <tool.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black mb-4 italic tracking-tight text-slate-900">{tool.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium group-hover:text-slate-600 transition-colors">
                  {tool.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* --- WHY SECTION --- */}
        <section className="bg-slate-900 rounded-[5rem] p-16 md:p-24 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-20 opacity-5 rotate-12 group-hover:scale-110 transition-transform duration-[3s]"><ShieldCheck className="w-[500px] h-[500px] text-white" /></div>
           <div className="space-y-10 relative z-10">
              <h2 className="text-7xl font-black tracking-tighter leading-[0.9] italic text-white uppercase">WHY <br /> IITGEEPREP?</h2>
              <div className="space-y-6">
                <p className="text-slate-300 text-xl font-bold leading-relaxed">
                  Success in IIT is not an accident of intelligence. It is a <span className="text-indigo-400 underline decoration-indigo-400/30 decoration-4 underline-offset-8">consequence of architecture</span>.
                </p>
                <p className="text-slate-400 text-lg font-medium leading-relaxed opacity-80">
                  Most aspirants fail because their data is scattered across notebooks. We unify your performance into a single Intelligence Node.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                 {["Zero-Latency Sync", "Parent Sentinel Mode", "Psychometric Defense"].map((tag, i) => (
                   <span key={i} className="px-5 py-2 bg-white/5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 text-slate-400">{tag}</span>
                 ))}
              </div>
           </div>
           
           <div className="bg-white p-16 rounded-[4rem] shadow-2xl text-center space-y-8 border border-slate-100 relative z-10 group-hover:-rotate-1 transition-transform duration-700">
              <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[2.5rem] flex items-center justify-center mx-auto border border-indigo-100 shadow-inner">
                 <Zap className="w-10 h-10" />
              </div>
              <div className="space-y-4">
                 <h3 className="text-3xl font-black italic text-slate-900">Dominance Protocol</h3>
                 <p className="text-slate-500 font-medium leading-relaxed italic">
                    "Track the past. Solve the present. Engineer the future. All systems operational."
                 </p>
              </div>
              <div className="flex justify-center gap-3 pt-6">
                 <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
};

export default AboutModule;
