
import React from 'react';
import { Award, Zap, Building, GraduationCap, Flame, BookOpen, Target, Calendar, BarChart3, Layers, ChevronRight } from 'lucide-react';

const ExamGuideModule: React.FC = () => {
  const exams = [
    {
      name: 'JEE Advanced',
      difficulty: 5,
      focus: 'Depth & Concept Application',
      desc: 'The toughest engineering exam. Requires deep understanding of concepts, multi-concept application, and high IQ problem solving.',
      colleges: 'IITs (Indian Institutes of Technology)',
      dates: 'May/June',
      color: 'bg-rose-50 border-rose-100',
      barColor: 'bg-rose-500',
      icon: <Award className="w-7 h-7 text-rose-600" />
    },
    {
      name: 'JEE Main',
      difficulty: 4,
      focus: 'Speed & Accuracy (NCERT)',
      desc: 'Gateway to NITs and qualifying exam for Advanced. Focuses on speed, accuracy, and syllabus coverage. Chemistry is strictly NCERT based.',
      colleges: 'NITs, IIITs, GFTIs',
      dates: 'Jan & April',
      color: 'bg-indigo-50 border-indigo-100',
      barColor: 'bg-indigo-500',
      icon: <BookOpen className="w-7 h-7 text-indigo-600" />
    },
    {
      name: 'BITSAT',
      difficulty: 3,
      focus: 'Speed, English & Logic',
      desc: 'Entrance for BITS Pilani. Easier questions than JEE Main but requires extreme speed (130 questions in 3 hours). Includes English & Logic sections.',
      colleges: 'BITS Pilani, Goa, Hyderabad',
      dates: 'May & June',
      color: 'bg-violet-50 border-violet-100',
      barColor: 'bg-violet-500',
      icon: <Zap className="w-7 h-7 text-violet-600" />
    },
    {
      name: 'VITEEE',
      difficulty: 2,
      focus: 'Speed & Direct Formula',
      desc: 'For VIT Vellore. Questions are direct application of formulas. No negative marking usually, so guessing is part of the strategy.',
      colleges: 'VIT Vellore, Chennai',
      dates: 'April',
      color: 'bg-blue-50 border-blue-100',
      barColor: 'bg-blue-500',
      icon: <Building className="w-7 h-7 text-blue-600" />
    },
    {
      name: 'State Exams (CET)',
      difficulty: 2,
      focus: 'Regional Syllabus',
      desc: 'MHT-CET, WBJEE, KCET. Focus on 12th state board syllabus. High scoring exams for top state government colleges.',
      colleges: 'Top State Govt Colleges (COEP, VJTI, Jadavpur)',
      dates: 'May',
      color: 'bg-emerald-50 border-emerald-100',
      barColor: 'bg-emerald-500',
      icon: <GraduationCap className="w-7 h-7 text-emerald-600" />
    }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 pb-20 max-w-7xl mx-auto space-y-12">
      
      {/* Header */}
      <div className="bg-white py-16 px-8 rounded-[3.5rem] border border-slate-200 text-center space-y-4 shadow-sm relative overflow-hidden">
         <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12"><Target className="w-64 h-64" /></div>
         <div className="max-w-4xl mx-auto space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 bg-rose-50 text-rose-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
               Strategic Battlefield Guide
            </div>
            <h1 className="text-6xl font-black text-slate-900 italic tracking-tighter leading-none">Know Your Targets.</h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
                A comprehensive matrix of difficulty levels, target colleges, and tactical exam strategies for 2025 aspirants.
            </p>
         </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-16">
         
         {/* Main Comparison Matrix */}
         <div className="bg-white rounded-[4rem] shadow-2xl border border-slate-200 overflow-hidden">
             <div className="bg-slate-900 text-white p-10 flex items-center justify-between">
                 <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-white/10 rounded-[1.5rem] flex items-center justify-center backdrop-blur-md">
                       <BarChart3 className="w-8 h-8 text-amber-400" />
                    </div>
                    <div>
                       <h2 className="text-2xl font-black italic tracking-tight">Exam Comparison Matrix</h2>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Cross-Platform Difficulty Analysis</p>
                    </div>
                 </div>
                 <div className="hidden md:flex gap-2">
                    {[1,2,3,4,5].map(i => <Flame key={i} className="w-4 h-4 text-rose-500 fill-rose-500" />)}
                 </div>
             </div>
             
             <div className="divide-y divide-slate-100">
                 {exams.map((exam, idx) => (
                     <div key={idx} className={`p-10 transition-all hover:bg-slate-50/50 ${exam.color} border-l-[10px] border-l-transparent hover:border-l-indigo-500`}>
                         <div className="flex flex-col md:flex-row gap-10">
                             
                             {/* Left: Identity */}
                             <div className="w-full md:w-1/4 shrink-0 space-y-6">
                                 <div className="flex items-center gap-4">
                                     <div className="bg-white p-4 rounded-2xl shadow-xl border border-slate-100 transition-transform hover:rotate-3">{exam.icon}</div>
                                     <h3 className="text-2xl font-black text-slate-800 italic tracking-tight">{exam.name}</h3>
                                 </div>
                                 
                                 <div className="bg-white/50 p-5 rounded-2xl border border-slate-200/50">
                                     <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                         <span>Difficulty Score</span>
                                         <div className="flex gap-0.5">
                                             {[...Array(5)].map((_, i) => (
                                                 <Flame key={i} className={`w-3 h-3 ${i < exam.difficulty ? 'text-rose-500 fill-rose-500' : 'text-slate-200'}`} />
                                             ))}
                                         </div>
                                     </div>
                                     <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                         <div className={`h-full ${exam.barColor} transition-all duration-1000 shadow-[0_0_10px_rgba(0,0,0,0.1)]`} style={{ width: `${(exam.difficulty / 5) * 100}%` }}></div>
                                     </div>
                                 </div>
                             </div>

                             {/* Middle: Strategy */}
                             <div className="w-full md:w-1/3 flex flex-col justify-center md:border-l border-slate-200/30 md:pl-10 space-y-4">
                                 <div className="flex items-center gap-3">
                                     <Target className="w-5 h-5 text-indigo-500" />
                                     <p className="text-[10px] font-black uppercase text-indigo-600 tracking-[0.2em]">{exam.focus}</p>
                                 </div>
                                 <p className="text-base text-slate-500 font-medium leading-relaxed italic">
                                     "{exam.desc}"
                                 </p>
                             </div>

                             {/* Right: Logistics */}
                             <div className="w-full md:w-1/3 md:border-l border-slate-200/30 md:pl-10 space-y-6">
                                 <div className="flex items-start gap-4 group">
                                    <Building className="w-6 h-6 text-slate-300 mt-1 shrink-0 group-hover:text-indigo-500 transition-colors" />
                                    <div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Target Institutions</span>
                                        <p className="text-sm text-slate-800 font-black italic">{exam.colleges}</p>
                                    </div>
                                 </div>
                                 <div className="flex items-start gap-4 group">
                                    <Calendar className="w-6 h-6 text-slate-300 mt-1 shrink-0 group-hover:text-indigo-500 transition-colors" />
                                    <div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Exam Cycle Window</span>
                                        <p className="text-sm text-slate-800 font-black italic">{exam.dates}</p>
                                    </div>
                                 </div>
                             </div>

                         </div>
                     </div>
                 ))}
             </div>
         </div>

         {/* Strategy Cards */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10">
              <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group hover:-translate-y-2 transition-all">
                  <div className="relative z-10 space-y-4">
                      <h3 className="text-2xl font-black italic tracking-tighter text-rose-400">Advanced Mastery</h3>
                      <p className="text-sm text-slate-400 leading-relaxed font-medium">
                          Do not chase 100% syllabus. Focus on 100% depth in 80% of topics. Solve problems that mix multiple concepts (e.g. Electrostatics + Rotation).
                      </p>
                      <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white border-b border-white/20 pb-1 hover:text-rose-400 hover:border-rose-400 transition-all">Deep Dive Logic <ChevronRight className="w-3 h-3" /></button>
                  </div>
                  <Layers className="absolute -bottom-6 -right-6 w-32 h-32 text-slate-800 opacity-40 group-hover:rotate-12 transition-transform" />
              </div>

              <div className="bg-indigo-600 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group hover:-translate-y-2 transition-all">
                  <div className="relative z-10 space-y-4">
                      <h3 className="text-2xl font-black italic tracking-tighter text-indigo-100">Main Momentum</h3>
                      <p className="text-sm text-indigo-50 leading-relaxed font-medium">
                          Speed and Coverage are key. You cannot leave any chapter. For Chemistry, treat NCERT as your Bible. Memorize every line of Inorganic.
                      </p>
                      <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white border-b border-white/20 pb-1 hover:text-indigo-900 hover:border-indigo-900 transition-all">Coverage Strategy <ChevronRight className="w-3 h-3" /></button>
                  </div>
                  <BookOpen className="absolute -bottom-6 -right-6 w-32 h-32 text-indigo-700 opacity-40 group-hover:rotate-12 transition-transform" />
              </div>

              <div className="bg-violet-600 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group hover:-translate-y-2 transition-all">
                  <div className="relative z-10 space-y-4">
                      <h3 className="text-2xl font-black italic tracking-tighter text-violet-100">BITSAT Velocity</h3>
                      <p className="text-sm text-violet-50 leading-relaxed font-medium">
                          Time Management is everything. You have to solve 130 questions. Don't get stuck. English & Logic are bonus marks—don't ignore them!
                      </p>
                      <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white border-b border-white/20 pb-1 hover:text-violet-900 hover:border-violet-900 transition-all">Speed Tactics <ChevronRight className="w-3 h-3" /></button>
                  </div>
                  <Zap className="absolute -bottom-6 -right-6 w-32 h-32 text-violet-700 opacity-40 group-hover:rotate-12 transition-transform" />
              </div>
         </div>

      </div>
    </div>
  );
};

export default ExamGuideModule;
