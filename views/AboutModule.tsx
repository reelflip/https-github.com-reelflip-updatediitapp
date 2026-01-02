
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
  Globe
} from 'lucide-react';

const AboutModule: React.FC = () => {
  return (
    <div className="bg-white min-h-screen animate-in fade-in duration-700">
      {/* --- FUNCTIONAL HERO --- */}
      <section className="py-20 md:py-32 px-6 md:px-12 text-center max-w-6xl mx-auto relative">
        <div className="inline-flex items-center gap-3 px-5 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8">
           Performance Monitoring Kernel v10.5
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[1.1] mb-10 uppercase italic font-space">
          About <br /><span className="text-indigo-600">IITGEEPREP.</span>
        </h1>
        <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed max-w-3xl mx-auto italic mb-12">
          An elite academic ecosystem architected for the next generation of engineers. We transform raw study data into structured mastery pathways.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
           <button 
             onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'login' }))}
             className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-3"
           >
             Initialize Profile <ArrowRight className="w-4 h-4" />
           </button>
           <button 
             onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'features' }))}
             className="px-10 py-5 bg-white border border-slate-200 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:border-indigo-600 hover:text-indigo-600 transition-all"
           >
             Technical Specifications
           </button>
        </div>
      </section>

      {/* --- BRAND NOMENCLATURE BREAKDOWN --- */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="bg-slate-50 rounded-[4rem] p-12 md:p-20 border border-slate-200 relative overflow-hidden">
          <div className="absolute top-0 left-0 p-10 opacity-5"><Zap className="w-64 h-64 text-indigo-600" /></div>
          <div className="text-center mb-16 space-y-4 relative z-10">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight uppercase italic leading-none">The Solaris <span className="text-indigo-600">Identity.</span></h2>
            <p className="text-slate-400 font-bold uppercase text-[11px] tracking-[0.3em]">Decoding the IITGEEPREP protocol</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 hover:border-indigo-300 transition-all group">
               <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform shadow-lg shadow-indigo-100"><Target className="w-8 h-8" /></div>
               <h3 className="text-4xl font-black text-slate-900 mb-2 italic">IIT.</h3>
               <p className="text-slate-500 font-medium leading-relaxed">Representing the <b>Indian Institutes of Technology</b>—the primary objective and the pinnacle of global engineering rigor.</p>
            </div>
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 hover:border-indigo-300 transition-all group">
               <div className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform shadow-lg shadow-emerald-100"><Globe className="w-8 h-8" /></div>
               <h3 className="text-4xl font-black text-slate-900 mb-2 italic">GEE.</h3>
               <p className="text-slate-500 font-medium leading-relaxed">Symbolizing <b>General Engineering Excellence</b>. It represents the logical bridge between raw potential and advanced technical skillsets.</p>
            </div>
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 hover:border-indigo-300 transition-all group">
               <div className="w-14 h-14 bg-indigo-900 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform shadow-lg shadow-indigo-200"><Cpu className="w-8 h-8" /></div>
               <h3 className="text-4xl font-black text-slate-900 mb-2 italic">PREP.</h3>
               <p className="text-slate-500 font-medium leading-relaxed">Focusing on <b>Preparation</b>. The systematic, data-driven methodology required to dominate the entrance lifecycle.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- CORE METHODOLOGY --- */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="bg-slate-900 rounded-[3.5rem] p-12 md:p-24 space-y-20 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-20 opacity-5"><Database className="w-80 h-80 text-white" /></div>
          
          <div className="max-w-2xl space-y-6 relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-none">
              Preparation <br /><span className="text-indigo-400">Framework.</span>
            </h2>
            <p className="text-slate-400 text-lg font-medium leading-relaxed italic">
              Competitive examinations require data-driven consistency. Our platform acts as a technical ledger to correlate study hours with measurable proficiency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
            {[
              { 
                title: "Error Ledgers", 
                desc: "Systematically classify mock test mistakes into conceptual gaps or calculation slips for targeted remediation.",
                icon: ShieldCheck 
              },
              { 
                title: "Velocity Logs", 
                desc: "Monitor syllabus coverage speed against predefined milestones with automated alerts for lagging subject units.",
                icon: TrendingUp 
              },
              { 
                title: "Recall Cycles", 
                desc: "Integrated logic for spaced repetition to maintain active memory of high-weightage formulas and reaction mechanisms.",
                icon: Clock 
              }
            ].map((item, i) => (
              <div key={i} className="space-y-5 p-8 bg-white/5 border border-white/10 rounded-3xl">
                <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400">
                  <item.icon className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-black text-white italic tracking-tight uppercase">{item.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PERFORMANCE VECTORS --- */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
         <div className="space-y-10">
            <div className="space-y-4">
              <h3 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic leading-none">Structured <span className="text-indigo-600">Syllabus Mapping.</span></h3>
              <p className="text-slate-500 text-lg font-medium leading-relaxed italic">The platform handles the complexity of the JEE ecosystem through granular subject tracking.</p>
            </div>
            
            <div className="space-y-6">
               {[
                 { label: "Stability Analysis", val: "Measuring retention levels across Physics, Chemistry, and Math." },
                 { label: "Execution Precision", val: "Tracking accuracy trends in mock tests and chapter drills." },
                 { label: "Time Management", val: "Optimizing the ratio of theory study to problem-solving sessions." }
               ].map((p, i) => (
                 <div key={i} className="flex gap-5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-[10px] shrink-0">0{i+1}</div>
                    <div className="space-y-1">
                       <h5 className="font-black text-slate-800 uppercase text-[11px] tracking-widest">{p.label}</h5>
                       <p className="text-slate-500 text-xs italic font-medium">{p.val}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
         <div className="bg-slate-50 rounded-[3rem] p-12 border border-slate-100 shadow-inner flex items-center justify-center relative">
            <div className="text-center space-y-4">
               <div className="w-24 h-24 bg-white rounded-3xl shadow-xl mx-auto flex items-center justify-center text-indigo-600">
                  <Activity className="w-10 h-10" />
               </div>
               <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">Integrated Telemetry Node</div>
            </div>
         </div>
      </section>
    </div>
  );
};

export default AboutModule;
