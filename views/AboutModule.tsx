import React from 'react';
import { 
  BookOpen, Target, CalendarClock, ClipboardList, 
  Brain, Award, Cpu, Network, Fingerprint, Activity,
  Sparkles, Zap, ShieldCheck, ChevronRight, BarChart3, RotateCw as LucideRotateCw, ArrowRight as LucideArrowRight
} from 'lucide-react';

const AboutModule: React.FC = () => {
  return (
    <div className="bg-[#0a0c1a] text-white min-h-screen selection:bg-[#5d5fef]/20">
      <div className="max-w-[1600px] mx-auto py-12 md:py-24 px-6 md:px-16 space-y-24 md:space-y-48 animate-in fade-in duration-1000">
        
        {/* --- HERO SECTION --- */}
        <section className="relative text-center space-y-10 md:space-y-16 pt-10">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[300px] md:w-[1000px] h-[300px] md:h-[1000px] bg-indigo-500/10 blur-[160px] rounded-full pointer-events-none -z-10"></div>
          
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-3 px-6 md:px-8 py-2 md:py-3 bg-[#161a2e] border border-[#2d3656] rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-[0.5em] text-indigo-400 shadow-2xl">
               <Sparkles className="w-3 md:w-4 h-3 md:h-4" /> Global Intelligence Node 01
            </div>
          </div>
          
          <div className="space-y-6">
            <h1 className="text-4xl md:text-8xl lg:text-[11rem] font-black tracking-tighter italic leading-[0.9] md:leading-[0.8] uppercase text-white">
              DATA-DRIVEN <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#5d5fef] to-[#1e2440]">DOMINANCE.</span>
            </h1>
            <p className="text-[#7d8cb8] max-w-4xl mx-auto leading-relaxed text-lg md:text-2xl lg:text-3xl font-medium italic px-4 md:px-6">
              "Generic preparation leads to linear results. High-frequency architecture leads to IIT. Track every performance vector in real-time."
            </p>
          </div>

          <div className="pt-6 md:pt-10 flex flex-col sm:flex-row justify-center gap-4 md:gap-8 px-4">
             <div className="px-10 md:px-16 py-6 md:py-8 bg-[#5d5fef] text-white rounded-[1.5rem] md:rounded-[2rem] font-black text-[10px] md:text-xs uppercase tracking-[0.5em] shadow-[0_20px_60px_-15px_rgba(93,95,239,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer group flex items-center justify-center gap-4">
                Initialize Protocol <LucideArrowRight className="w-4 md:w-5 h-4 md:h-5 group-hover:translate-x-2 transition-transform" />
             </div>
             <div className="px-10 md:px-16 py-6 md:py-8 bg-[#161a2e] border border-[#2d3656] text-[#7d8cb8] rounded-[1.5rem] md:rounded-[2rem] font-black text-[10px] md:text-xs uppercase tracking-[0.5em] hover:bg-[#1e2440] hover:text-white transition-all cursor-pointer shadow-sm text-center">
                Explore The Engine
             </div>
          </div>
        </section>

        {/* --- INFORMATION ARCHITECTURE --- */}
        <section className="space-y-16 md:space-y-24">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
            <div className="space-y-4 md:space-y-6">
              <div className="text-[10px] md:text-[12px] font-black uppercase text-indigo-400 tracking-[0.6em]">The Mastery Matrix</div>
              <h2 className="text-4xl md:text-7xl lg:text-8xl font-black italic tracking-tighter leading-none text-white uppercase">Operational <br />Intelligence.</h2>
            </div>
            <p className="text-[#4a5578] font-medium text-base md:text-xl max-w-md md:text-right italic leading-relaxed">"Optimizing the six fundamental dimensions of JEE performance through localized heuristics."</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {[
              { title: 'Pulse Heatmaps', icon: BarChart3, desc: 'Stop guessing your stability. Dynamic heatmaps use real-time accuracy data to visualize mastered units vs "Retention Decays".' },
              { title: 'Neural Spacing', icon: LucideRotateCw, desc: 'Logic engines flag concept expiration exactly when they leave your long-term memory buffer. Retain 90% of the syllabus until D-Day.' },
              { title: 'Psychometric Guard', icon: Brain, desc: 'We monitor cognitive load and stress levels. If burnout is detected, the gateway automatically pivots to "Active Recovery".' },
              { title: 'Error Ledgers', icon: ClipboardList, desc: 'Classification system for errors: conceptual gaps, calculation slips, or time-pressure artifacts. Focus only on what hurts the rank.' },
              { title: 'Syllabus Burn-down', icon: Target, desc: 'A precision roadmap of your total academic debt. See exactly where your trajectory sits relative to the 2025 exam window.' },
              { title: 'Sentinel Link', icon: ShieldCheck, desc: 'Secure data handshakes allow parents to view live velocity logs and wellness scores, replacing friction with transparent synergy.' },
            ].map((tool, i) => (
              <div key={i} className="bg-[#161a2e] p-8 md:p-14 rounded-[3rem] md:rounded-[5rem] border border-[#2d3656] hover:border-[#5d5fef]/40 transition-all duration-700 hover:shadow-[0_0_80px_rgba(0,0,0,0.6)] group relative overflow-hidden">
                <div className="absolute -right-8 -bottom-8 md:-right-12 md:-bottom-12 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-110 transition-all duration-1000">
                  <tool.icon className="w-32 md:w-64 h-32 md:h-64" />
                </div>
                <div className="w-14 h-14 md:w-20 md:h-20 bg-[#0d1021] border border-[#1e2440] text-indigo-400 rounded-[1.2rem] md:rounded-[2rem] flex items-center justify-center mb-8 md:mb-12 group-hover:scale-110 group-hover:bg-[#5d5fef] group-hover:text-white transition-all shadow-inner">
                  <tool.icon className="w-6 md:w-9 h-6 md:h-9" />
                </div>
                <h3 className="text-xl md:text-3xl font-black mb-4 md:mb-6 italic tracking-tighter text-white uppercase">{tool.title}</h3>
                <p className="text-[#7d8cb8] text-sm md:text-lg leading-relaxed font-medium transition-colors group-hover:text-slate-300">
                  {tool.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* --- PHILOSOPHY SECTION --- */}
        <section className="bg-[#0d1021] rounded-[3.5rem] md:rounded-[6rem] p-8 md:p-16 lg:p-32 grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center border border-[#1e2440] shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-20 opacity-[0.02] rotate-12 group-hover:scale-110 transition-transform duration-[4s]"><Fingerprint className="w-[300px] md:w-[700px] h-[300px] md:h-[700px] text-white" /></div>
           <div className="space-y-8 md:space-y-12 relative z-10">
              <h2 className="text-4xl md:text-8xl font-black tracking-tighter leading-[1] md:leading-[0.9] italic text-white uppercase">SYSTEM: <br /> <span className="text-[#5d5fef]">Architecture.</span></h2>
              <div className="space-y-6 md:space-y-10">
                <p className="text-[#7d8cb8] text-lg md:text-2xl font-bold leading-relaxed">
                  Success isn't about working harder—it's about <span className="text-indigo-400 underline decoration-indigo-400/30 decoration-4 md:decoration-8 underline-offset-[8px] md:underline-offset-[16px] italic">eliminating performance friction.</span>
                </p>
                <div className="space-y-4 md:space-y-8">
                   <div className="flex gap-4 md:gap-8">
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#5d5fef] rounded-full mt-2 md:mt-3 shrink-0 shadow-[0_0_10px_#5d5fef]"></div>
                      <p className="text-[#4a5578] font-medium text-base md:text-xl italic leading-relaxed">Aspirants often fail because their performance data is siloed across thousands of disorganized notebook pages.</p>
                   </div>
                   <div className="flex gap-4 md:gap-8">
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#5d5fef] rounded-full mt-2 md:mt-3 shrink-0 shadow-[0_0_10px_#5d5fef]"></div>
                      <p className="text-[#4a5578] font-medium text-base md:text-xl italic leading-relaxed">We unify your academic pulse into a single gateway that identifies roadblocks before they impact your mock tests.</p>
                   </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 md:gap-5 pt-4 md:pt-8">
                 {["Zero-Latency Sync", "Burnout Defense", "Heuristic Optimization"].map((tag, i) => (
                   <span key={i} className="px-5 py-2 md:px-7 md:py-3 bg-[#161a2e] rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] border border-[#2d3656] text-indigo-400">{tag}</span>
                 ))}
              </div>
           </div>
           
           <div className="bg-[#161a2e] p-10 md:p-20 rounded-[3rem] md:rounded-[5rem] shadow-2xl text-center space-y-8 md:space-y-12 border border-[#2d3656] relative z-10 hover:-rotate-1 transition-transform duration-700">
              <div className="w-20 h-20 md:w-28 md:h-28 bg-[#0d1021] text-indigo-400 rounded-[2rem] md:rounded-[3rem] flex items-center justify-center mx-auto border border-[#1e2440] shadow-inner">
                 <Cpu className="w-8 md:w-12 h-8 md:h-12" />
              </div>
              <div className="space-y-4 md:space-y-6">
                 <h3 className="text-2xl md:text-4xl font-black italic text-white tracking-tight uppercase">Identity Handshake</h3>
                 <p className="text-[#4a5578] text-base md:text-xl font-medium leading-relaxed italic px-2 md:px-6">
                    "Track the past to own the present. Engineer the future to dominate the curve. All systems operational."
                 </p>
              </div>
              <div className="flex justify-center gap-3 md:gap-4 pt-6 md:pt-10">
                 <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-[#5d5fef] animate-pulse shadow-[0_0_20px_rgba(93,95,239,1)]"></div>
                 <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-[#1e2440]"></div>
                 <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-[#1e2440]"></div>
              </div>
           </div>
        </section>

        {/* --- CLOSING CTA --- */}
        <section className="text-center py-16 md:py-24 bg-gradient-to-b from-transparent to-[#0d1021] rounded-[3.5rem] md:rounded-[6rem] border border-[#1e2440]/50 relative overflow-hidden group">
           <div className="absolute inset-0 bg-[#5d5fef]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
           <h2 className="text-4xl md:text-7xl font-black italic tracking-tighter uppercase mb-10 md:mb-16 relative z-10">Ready to Initialize?</h2>
           <button className="px-10 py-6 md:px-20 md:py-10 bg-white text-slate-900 rounded-[1.5rem] md:rounded-[2.5rem] font-black uppercase text-[10px] md:text-sm tracking-[0.5em] md:tracking-[0.6em] hover:bg-indigo-500 hover:text-white transition-all shadow-2xl relative z-10 active:scale-95">
              ESTABLISH UPLINK NOW
           </button>
        </section>
      </div>
    </div>
  );
};

export default AboutModule;