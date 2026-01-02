
import React from 'react';
import { 
  BookOpen, 
  Target, 
  ChevronRight, 
  ArrowRight,
  Layers,
  Zap,
  TrendingUp,
  Brain,
  ShieldCheck,
  Cpu,
  Globe,
  Database,
  BarChart3
} from 'lucide-react';

const AboutModule: React.FC = () => {
  return (
    <div className="bg-white min-h-screen animate-in fade-in duration-700">
      {/* --- METHODOLOGY HERO --- */}
      <section className="py-20 md:py-32 px-6 md:px-12 text-center max-w-6xl mx-auto relative">
        <div className="inline-flex items-center gap-3 px-5 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8">
           Academic Performance Kernel v10.0
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[1.1] mb-10 uppercase italic font-space">
          Syllabus-Aligned <br /><span className="text-indigo-600">Analytics</span> for JEE.
        </h1>
        <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed max-w-3xl mx-auto italic mb-12">
          A structured monitoring environment for IIT-JEE and engineering entrance exams. We focus on <span className="font-bold text-slate-800">retention metrics</span>, <span className="font-bold text-slate-800">error classification</span>, and <span className="font-bold text-slate-800">syllabus velocity</span> tracking.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
           <button 
             onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'login' }))}
             className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-3"
           >
             Initialize Tracking <ArrowRight className="w-4 h-4" />
           </button>
           <button 
             onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'features' }))}
             className="px-10 py-5 bg-white border border-slate-200 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:border-indigo-600 hover:text-indigo-600 transition-all"
           >
             View Technical Specs
           </button>
        </div>
      </section>

      {/* --- CORE METHODOLOGY --- */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="bg-slate-900 rounded-[3.5rem] p-12 md:p-24 space-y-20 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-20 opacity-5"><Database className="w-80 h-80 text-white" /></div>
          
          <div className="max-w-2xl space-y-6 relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-none">
              Preparation <br /><span className="text-indigo-400">Architecture.</span>
            </h2>
            <p className="text-slate-400 text-lg font-medium leading-relaxed italic">
              JEE preparation requires consistency across a 700+ hour syllabus. Our platform serves as a digital ledger to ensure every study hour translates into measurable progress.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
            {[
              { 
                title: "Error Classification", 
                desc: "Classify mock test mistakes into conceptual gaps, calculation slips, or time-pressure errors for targeted improvement.",
                icon: ShieldCheck 
              },
              { 
                title: "Velocity Mapping", 
                desc: "Monitor syllabus coverage speed against exam deadlines with automated alerts for lagging subject verticals.",
                icon: TrendingUp 
              },
              { 
                title: "Recall Intervals", 
                desc: "Integrated spaced repetition logic to maintain high-weightage formulas in active memory cycles.",
                icon: Zap 
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

      {/* --- OPERATIONAL FEATURES --- */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
         <div className="space-y-10">
            <div className="space-y-4">
              <h3 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic leading-none">Structured <span className="text-indigo-600">Syllabus Sync.</span></h3>
              <p className="text-slate-500 text-lg font-medium leading-relaxed italic">The platform handles the complexity of the 3-subject JEE ecosystem through modular tracking.</p>
            </div>
            
            <div className="space-y-6">
               {[
                 { label: "Physics Mechanics & Electrodynamics", val: "Deep vector-based problem logs." },
                 { label: "Chemistry Organic & Physical", val: "Mechanism mapping and numerical persistence." },
                 { label: "Mathematics Calculus & Algebra", val: "Execution accuracy and formula retrieval grids." }
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
                  <BarChart3 className="w-10 h-10" />
               </div>
               <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">Integrated Performance Node</div>
            </div>
         </div>
      </section>
    </div>
  );
};

export default AboutModule;
