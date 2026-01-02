
import React from 'react';
import { Target, Zap, Building, Calendar, Layers, ChevronRight, Cpu, FileText, ClipboardCheck, ArrowUpRight } from 'lucide-react';

const ExamGuideModule: React.FC = () => {
  const exams = [
    { 
      name: 'JEE Advanced', 
      difficulty: 'High Concept Rigor', 
      focus: 'Multi-concept integration', 
      requirement: 'Requires deep stability metrics in over 85% of the syllabus. Focused on application of multiple concepts in a single problem.',
      target: 'IIT Institutions', 
      cycle: 'Annual: May/June',
      icon: Target,
      tag: 'Conceptual Depth'
    },
    { 
      name: 'JEE Main', 
      difficulty: 'Moderate Speed-Accuracy', 
      focus: 'Syllabus breadth & coverage', 
      requirement: 'Requires high execution speed and 100% syllabus visibility. Accuracy in repetitive NCERT-based patterns is key.',
      target: 'NIT, IIIT, GFTI', 
      cycle: 'Dual: Jan & April',
      icon: Layers,
      tag: 'Speed & Precision'
    },
    { 
      name: 'BITSAT', 
      difficulty: 'High Efficiency Surge', 
      focus: 'Logical reasoning & Velocity', 
      requirement: 'Focus on time management. Requires tracking of "Solved per Minute" metrics. Accuracy must be maintained under tight constraints.',
      target: 'BITS Pilani / Goa', 
      cycle: 'Annual: May/June',
      icon: Zap,
      tag: 'Process Efficiency'
    }
  ];

  return (
    <div className="bg-white min-h-screen animate-in fade-in duration-700">
      {/* --- HEADER --- */}
      <section className="py-20 md:py-32 px-6 md:px-12 text-center border-b border-slate-100">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-3 px-5 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
             <ClipboardCheck className="w-4 h-4" /> Exam Matrix Alignment
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase italic font-space">
            Tactical <br /><span className="text-indigo-600">Alignment.</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl font-medium italic max-w-2xl mx-auto leading-relaxed">
            Success in entrance exams is a function of aligning your tracking methodology with the specific patterns of your target exam.
          </p>
        </div>
      </section>

      {/* --- EXAM CARDS --- */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {exams.map((exam, i) => (
            <div key={i} className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm hover:border-indigo-400 transition-all flex flex-col justify-between space-y-10 relative overflow-hidden">
               <div className="space-y-8 relative z-10">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg">
                       <exam.icon className="w-6 h-6" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-md border border-indigo-100">{exam.tag}</span>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">{exam.name}</h3>
                  <div className="space-y-4">
                     <div className="text-[10px] font-black uppercase text-indigo-600 tracking-widest flex items-center gap-2">Operational Requirement <ArrowUpRight className="w-3 h-3" /></div>
                     <p className="text-slate-500 leading-relaxed italic text-sm font-medium">"{exam.requirement}"</p>
                  </div>
               </div>
               
               <div className="pt-8 border-t border-slate-50 space-y-4 relative z-10">
                  <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                     <Building className="w-4 h-4 text-indigo-500" /> Target: <span className="text-slate-800">{exam.target}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                     <Calendar className="w-4 h-4 text-emerald-500" /> Cycle: <span className="text-slate-800">{exam.cycle}</span>
                  </div>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- PREPARATION MATRIX --- */}
      <section className="py-20 px-6 md:px-12 bg-slate-900">
         <div className="max-w-7xl mx-auto bg-white p-12 md:p-24 rounded-[3.5rem] shadow-2xl flex flex-col lg:flex-row items-center gap-16 relative overflow-hidden">
            <div className="w-24 h-24 bg-indigo-50 rounded-[2rem] flex items-center justify-center shrink-0 border border-indigo-100">
               <Cpu className="w-12 h-12 text-indigo-600" />
            </div>
            <div className="space-y-8 relative z-10 text-center lg:text-left">
               <div className="space-y-4">
                  <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Operational <br /><span className="text-indigo-600">Metric Matrix.</span></h2>
                  <p className="text-slate-500 text-lg max-w-xl font-medium leading-relaxed italic">
                    The platform tracks these 5 vital vectors to ensure your preparation matches historical success patterns.
                  </p>
               </div>
               <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                  {[
                    "Conceptual Stability", "Calculation Precision", "Syllabus Coverage", "Revision Frequency", "Stress Threshold"
                  ].map(skill => (
                    <span key={skill} className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-widest">{skill}</span>
                  ))}
               </div>
               <button 
                 onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'login' }))}
                 className="flex items-center gap-3 text-indigo-600 font-black text-[10px] uppercase tracking-[0.3em] hover:gap-6 transition-all group mx-auto lg:mx-0"
               >
                 Establish Performance Sync <ChevronRight className="w-4 h-4" />
               </button>
            </div>
         </div>
      </section>
    </div>
  );
};

export default ExamGuideModule;
