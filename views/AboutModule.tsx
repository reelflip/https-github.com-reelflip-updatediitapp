
import React from 'react';
import { 
  BookOpen, 
  Target, 
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Database,
  BarChart3,
  Clock,
  Activity,
  Cpu,
  Zap,
  Globe,
  Binary,
  GraduationCap
} from 'lucide-react';

const AboutModule: React.FC = () => {
  return (
    <div className="bg-white min-h-screen animate-in fade-in duration-700">
      {/* --- HERO SECTION --- */}
      <section className="py-20 md:py-32 px-6 md:px-12 text-center max-w-6xl mx-auto relative">
        <div className="inline-flex items-center gap-3 px-5 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8">
           Academic Performance Kernel v10.5
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[1.1] mb-10 uppercase italic font-space">
          The Elite <br /><span className="text-indigo-600">IIT-JEE Tracking Ecosystem.</span>
        </h1>
        <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed max-w-3xl mx-auto italic mb-12">
          IITGEEPREP is a high-performance academic ledger designed for serious engineering aspirants. We provide the technical infrastructure to track syllabus coverage, identify critical weak areas, and master mock tests through real-time analytics.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
           <button 
             onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'login' }))}
             className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-3"
           >
             Initialize Study Profile <ArrowRight className="w-4 h-4" />
           </button>
           <button 
             onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'features' }))}
             className="px-10 py-5 bg-white border border-slate-200 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:border-indigo-600 hover:text-indigo-600 transition-all"
           >
             Technical Features
           </button>
        </div>
      </section>

      {/* --- BRAND DNA SECTION --- */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto border-t border-slate-50">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight uppercase italic leading-none">The Brand <span className="text-indigo-600">Architecture.</span></h2>
          <p className="text-slate-400 font-bold uppercase text-[11px] tracking-[0.3em]">Decoding IITGEEPREP = IIT + GEE + PREP</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 rounded-[4rem] overflow-hidden border border-slate-200 shadow-2xl">
          <div className="bg-slate-900 p-12 text-white flex flex-col justify-between group">
             <div className="space-y-6">
                <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center text-indigo-400 border border-white/10 shadow-xl group-hover:scale-110 transition-transform"><Target className="w-8 h-8" /></div>
                <h3 className="text-6xl font-black italic tracking-tighter text-indigo-400">IIT.</h3>
                <p className="text-slate-400 font-medium italic leading-relaxed">
                  <strong>Indian Institutes of Technology:</strong> The ultimate objective. We represent the gold standard of engineering education in India, setting the benchmark for our technical curriculum mapping.
                </p>
             </div>
             <div className="mt-10 pt-6 border-t border-white/5 text-[9px] font-black uppercase text-slate-500 tracking-widest">The Destination Pillar</div>
          </div>

          <div className="bg-white p-12 text-slate-900 flex flex-col justify-between group border-x border-slate-200">
             <div className="space-y-6">
                <div className="w-16 h-16 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 shadow-inner group-hover:scale-110 transition-transform"><Binary className="w-8 h-8" /></div>
                <h3 className="text-6xl font-black italic tracking-tighter text-indigo-600">GEE.</h3>
                <p className="text-slate-500 font-medium italic leading-relaxed">
                  <strong>Generation of Elite Engineers:</strong> The human factor. "GEE" signifies our commitment to nurturing a new generation of technical minds who think beyond rote learning to achieve true engineering mastery.
                </p>
             </div>
             <div className="mt-10 pt-6 border-t border-slate-100 text-[9px] font-black uppercase text-slate-400 tracking-widest">The Identity Pillar</div>
          </div>

          <div className="bg-slate-50 p-12 text-slate-900 flex flex-col justify-between group">
             <div className="space-y-6">
                <div className="w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-600 shadow-inner group-hover:scale-110 transition-transform"><Activity className="w-8 h-8" /></div>
                <h3 className="text-6xl font-black italic tracking-tighter text-emerald-600">PREP.</h3>
                <p className="text-slate-500 font-medium italic leading-relaxed">
                  <strong>Systematic Preparation:</strong> The functional protocol. Our platform is the "Prep" engine—transforming raw data into actionable study insights through structured diagnostic analysis.
                </p>
             </div>
             <div className="mt-10 pt-6 border-t border-slate-200 text-[9px] font-black uppercase text-slate-400 tracking-widest">The Process Pillar</div>
          </div>
        </div>
      </section>

      {/* --- CORE METHODOLOGY --- */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="bg-slate-50 rounded-[4rem] p-12 md:p-20 border border-slate-200 relative overflow-hidden">
          <div className="absolute top-0 left-0 p-10 opacity-5"><Zap className="w-64 h-64 text-indigo-600" /></div>
          <div className="text-center mb-16 space-y-4 relative z-10">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight uppercase italic leading-none">Engineering <span className="text-indigo-600">Excellence.</span></h2>
            <p className="text-slate-400 font-bold uppercase text-[11px] tracking-[0.3em]">Decoding the Performance Protocol</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            <article className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 hover:border-indigo-300 transition-all group">
               <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform shadow-lg shadow-indigo-100"><Target className="w-8 h-8" /></div>
               <h3 className="text-2xl font-black text-slate-900 mb-4 italic uppercase">Syllabus Mapping.</h3>
               <p className="text-slate-500 font-medium leading-relaxed italic">
                 Granular tracking of Physics, Chemistry, and Mathematics units. We ensure no concept is left unvisited before the final exam.
               </p>
            </article>
            <article className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 hover:border-indigo-300 transition-all group">
               <div className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform shadow-lg shadow-emerald-100"><Globe className="w-8 h-8" /></div>
               <h3 className="text-2xl font-black text-slate-900 mb-4 italic uppercase">Mock Test Center.</h3>
               <p className="text-slate-500 font-medium leading-relaxed italic">
                 Simulated examination environments with standardized JEE difficulty levels to build stamina and execution precision.
               </p>
            </article>
            <article className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 hover:border-indigo-300 transition-all group">
               <div className="w-14 h-14 bg-indigo-900 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform shadow-lg shadow-indigo-200"><Cpu className="w-8 h-8" /></div>
               <h3 className="text-2xl font-black text-slate-900 mb-4 italic uppercase">Weak Area Audit.</h3>
               <p className="text-slate-500 font-medium leading-relaxed italic">
                 Advanced data filters to isolate low-accuracy chapters and prioritize remediation for high-yield JEE Advanced topics.
               </p>
            </article>
          </div>
        </div>
      </section>

      {/* --- PHILOSOPHY SECTION --- */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="bg-slate-900 rounded-[3.5rem] p-12 md:p-24 space-y-20 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-20 opacity-5"><Database className="w-80 h-80 text-white" /></div>
          
          <div className="max-w-2xl space-y-6 relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-none">
              A Strategic <br /><span className="text-indigo-400">Preparation Framework.</span>
            </h2>
            <p className="text-slate-400 text-lg font-medium leading-relaxed italic">
              Competitive examinations like JEE Main and Advanced are not just tests of knowledge, but of consistency and tactical planning. Our framework is built on three pillars of data-driven preparation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
            <div className="space-y-5 p-8 bg-white/5 border border-white/10 rounded-3xl">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-black text-white italic tracking-tight uppercase">Accuracy Drift Analysis</h4>
              <p className="text-slate-400 text-sm leading-relaxed">Identifying patterns in "silly mistakes" versus conceptual gaps to refine problem-solving techniques.</p>
            </div>
            <div className="space-y-5 p-8 bg-white/5 border border-white/10 rounded-3xl">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-black text-white italic tracking-tight uppercase">Velocity Benchmarking</h4>
              <p className="text-slate-400 text-sm leading-relaxed">Tracking coverage speed to ensure full syllabus completion well before the final target date.</p>
            </div>
            <div className="space-y-5 p-8 bg-white/5 border border-white/10 rounded-3xl">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-black text-white italic tracking-tight uppercase">Recall Optimization</h4>
              <p className="text-slate-400 text-sm leading-relaxed">Integrated spaced repetition protocols for long-term retention of complex formulas and reaction mechanisms.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutModule;
