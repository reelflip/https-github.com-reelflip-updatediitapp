
import React from 'react';
import { Flame, Target, BookOpen, Zap, Award, BarChart3, Building, Calendar, Layers, Globe, GraduationCap, ChevronRight, Lightbulb } from 'lucide-react';

const ExamGuideModule: React.FC = () => {
  const exams = [
    { 
      name: 'JEE Advanced', 
      difficulty: 5, 
      focus: 'Conceptual Depth', 
      strategy: 'Focus on multi-layer concept integration. Quality over quantity.',
      colleges: 'IITs Only', 
      dates: 'May/June Window',
      icon: Target
    },
    { 
      name: 'JEE Main', 
      difficulty: 4, 
      focus: 'Velocity & Coverage', 
      strategy: 'Master NCERT line-by-line. High speed MCQ accuracy is vital.',
      colleges: 'NITs, IIITs, CFTIs', 
      dates: 'Jan / April Cycles',
      icon: Layers
    },
    { 
      name: 'BITSAT', 
      difficulty: 3, 
      focus: 'Speed & Logic', 
      strategy: '130 questions in 3 hours. Efficiency is critical.',
      colleges: 'BITS Pilani / Goa / Hyd', 
      dates: 'May / June cycles',
      icon: Zap
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* --- HERO SECTION --- */}
      <section className="cloud-bg py-24 px-6 md:px-12 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-[#82c341]/10 border border-[#82c341]/20 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-[#1e3a8a] mb-4">
             Tactical Battlefield Analysis
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-[#1e3a8a] tracking-tight leading-tight">
            The Prep <br /><span className="text-[#82c341]">Landscape.</span>
          </h1>
          <p className="text-slate-500 text-xl font-medium italic leading-relaxed">
            "Understand the target, then initialize the attack. Success in competitive exams is about engineering, not just hard work."
          </p>
        </div>
      </section>

      {/* --- EXAM CARDS SECTION --- */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {exams.map((exam, i) => (
            <div key={i} className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between space-y-8">
               <div className="space-y-6">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-[#1e3a8a]">
                     <exam.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-800 tracking-tighter uppercase italic">{exam.name}</h3>
                  <div className="flex gap-2">
                     {[...Array(5)].map((_, j) => (
                        <Flame key={j} className={`w-4 h-4 ${j < exam.difficulty ? 'text-orange-500 fill-orange-500' : 'text-slate-200'}`} />
                     ))}
                  </div>
                  <p className="text-slate-500 leading-relaxed italic font-medium">"{exam.strategy}"</p>
               </div>
               
               <div className="pt-8 border-t border-slate-50 space-y-4">
                  <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                     <Building className="w-4 h-4 text-blue-500" /> {exam.colleges}
                  </div>
                  <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                     <Calendar className="w-4 h-4 text-green-500" /> {exam.dates}
                  </div>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- INFO BANNER --- */}
      <section className="py-24 px-6 md:px-12 bg-[#f8fafc] border-t border-slate-100">
         <div className="max-w-7xl mx-auto bg-white p-16 rounded-[4rem] shadow-2xl border border-slate-50 flex flex-col md:flex-row items-center gap-16 relative overflow-hidden">
            <div className="absolute -right-20 -bottom-20 opacity-5 rotate-12">
               <Award className="w-96 h-96 text-blue-600" />
            </div>
            <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center shrink-0">
               <Lightbulb className="w-12 h-12 text-blue-600" />
            </div>
            <div className="space-y-4 relative z-10 text-center md:text-left">
               <h2 className="text-3xl font-black text-[#1e3a8a]">Operational Excellence Matrix</h2>
               <p className="text-slate-500 text-lg max-w-2xl font-medium leading-relaxed italic">
                 Generic hard work fails. Elite architecture wins elite battles. Our guide helps you map your preparation strategy to specific exam requirements.
               </p>
               <div className="pt-4 flex flex-wrap gap-4 justify-center md:justify-start">
                  <span className="px-5 py-2 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">Physics Focus</span>
                  <span className="px-5 py-2 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest">Math Core</span>
                  <span className="px-5 py-2 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-widest">Inorganic Hacks</span>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};

export default ExamGuideModule;