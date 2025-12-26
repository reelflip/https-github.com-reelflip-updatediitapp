import React from 'react';
import { Flame, Target, BookOpen, Zap, Award, BarChart3, Building, Calendar, Layers, Globe, GraduationCap, ChevronRight, Lightbulb } from 'lucide-react';

const ExamGuideModule: React.FC = () => {
  const exams = [
    { 
      name: 'JEE Advanced', 
      difficulty: 5, 
      focus: 'Conceptual Depth', 
      strategy: 'Focus on multi-layer concept integration. Quality over quantity.',
      prepTip: 'Solve fewer but harder problems that combine at least 2 subjects (e.g. Physics + Calculus).',
      colleges: 'IITs Only', 
      dates: 'May/June Window', 
      borderColor: 'border-l-rose-500', 
      color: 'text-rose-400 bg-rose-500/10', 
      barColor: 'bg-rose-500' 
    },
    { 
      name: 'JEE Main', 
      difficulty: 4, 
      focus: 'Velocity & Coverage', 
      strategy: 'Master NCERT line-by-line. High speed MCQ accuracy is the vital edge.',
      prepTip: 'Chemistry is a scoring mine. Ensure 100% syllabus coverage to avoid leaving easy marks.',
      colleges: 'NITs, IIITs, CFTIs', 
      dates: 'Jan / April Cycles', 
      borderColor: 'border-l-indigo-500', 
      color: 'text-indigo-400 bg-indigo-500/10', 
      barColor: 'bg-indigo-500' 
    },
    { 
      name: 'BITSAT', 
      difficulty: 3, 
      focus: 'Speed & Logic', 
      strategy: '130 questions in 3 hours. Efficiency and English/Logic are critical.',
      prepTip: 'Practice full-length 3-hour mocks twice a week to build high-intensity mental endurance.',
      colleges: 'BITS Pilani / Goa / Hyd', 
      dates: 'May / June cycles', 
      borderColor: 'border-l-violet-500', 
      color: 'text-violet-400 bg-violet-500/10', 
      barColor: 'bg-violet-500' 
    }
  ];

  return (
    <div className="bg-[#0a0c1a] text-white min-h-screen max-w-7xl mx-auto space-y-24 animate-in fade-in slide-in-from-bottom-4 pb-40 px-6 pt-20">
      
      {/* --- HEADER --- */}
      <div className="text-center space-y-6 py-8">
         <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-[#161a2e] border border-[#2d3656] rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 shadow-xl mb-4">
            Tactical Battlefield Analysis
         </div>
         <h1 className="text-7xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-none">THE PREP <br /><span className="text-[#5d5fef]">LANDSCAPE.</span></h1>
         <p className="text-2xl text-[#7d8cb8] max-w-3xl mx-auto italic font-medium leading-relaxed">
            "Generic hard work fails generic exams. Elite architecture wins elite battles. Understand the target, then initialize the attack."
         </p>
      </div>

      {/* --- CORE TIERS: THE STRATEGY GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {[
            { 
              title: 'The National Titans', 
              icon: Globe, 
              desc: 'JEE Main & Advanced are the gold standard. They require deep cognitive mapping and unshakeable accuracy under extreme pressure.',
              features: ['IIT/NIT Placement Nodes', 'Highest Global Competition'],
              color: 'indigo'
            },
            { 
              title: 'Elite Private Nodes', 
              icon: Building, 
              desc: 'BITSAT and VITEEE offer world-class infrastructure. These exams prioritize speed over depth, rewarding rapid formula recall.',
              features: ['Speed-Based Mechanics', 'University Infrastructure'],
              color: 'violet'
            },
            { 
              title: 'Regional Operations', 
              icon: GraduationCap, 
              desc: 'MHT-CET and WBJEE provide strategic regional edges. Excellent for securing seats in top state government institutes with low latency.',
              features: ['Strategic Regional Edge', 'High-Scoring Environment'],
              color: 'blue'
            }
          ].map((tier, i) => (
            <div key={i} className="bg-[#161a2e] p-12 rounded-[4.5rem] shadow-2xl relative overflow-hidden border border-[#2d3656] group hover:border-indigo-500/40 transition-all duration-700">
                <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:scale-110 transition-transform duration-1000">
                    <tier.icon className="w-56 h-56 text-white" />
                </div>
                <div className="relative z-10 flex flex-col justify-between h-full">
                   <div>
                      <div className="bg-[#0d1021] border border-[#1e2440] w-16 h-16 rounded-2xl flex items-center justify-center mb-10 text-indigo-400 shadow-inner group-hover:bg-[#5d5fef] group-hover:text-white transition-all">
                          <tier.icon className="w-8 h-8" />
                      </div>
                      <h3 className="text-3xl font-black mb-6 uppercase italic tracking-tighter leading-none">{tier.title}</h3>
                      <p className="text-[#7d8cb8] mb-10 font-medium leading-relaxed group-hover:text-white transition-colors italic">
                        "{tier.desc}"
                      </p>
                   </div>
                   <ul className="space-y-4 pt-10 border-t border-[#1e2440]">
                      {tier.features.map(feat => (
                        <li key={feat} className="flex items-center gap-4 text-[10px] text-indigo-400 font-black uppercase tracking-widest">
                           <Target className="w-4 h-4 shrink-0"/> {feat}
                        </li>
                      ))}
                   </ul>
                </div>
            </div>
          ))}
      </div>

      {/* --- COMPARISON MATRIX: DEEP DIVE --- */}
      <div className="bg-[#161a2e] rounded-[5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] border border-[#2d3656] overflow-hidden">
         <div className="bg-[#0d1021] text-white p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-[#1e2440]">
             <div className="flex items-center space-x-6">
                 <BarChart3 className="w-10 h-10 text-[#5d5fef]" />
                 <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">Operational Matrix</h2>
             </div>
             <div className="text-[10px] font-black uppercase text-indigo-400 bg-indigo-400/10 px-8 py-3 rounded-full border border-indigo-400/20 tracking-widest flex items-center gap-3">
                 <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                 Updated for 2025 Node
             </div>
         </div>
         
         <div className="divide-y divide-[#1e2440]">
             {exams.map((exam, idx) => (
                 <div 
                    key={idx} 
                    className={`p-12 transition-all duration-500 group border-l-[12px] ${exam.borderColor} hover:bg-[#1e2440]/30`}
                 >
                     <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                         
                         {/* IDENTITY COLUMN */}
                         <div className="lg:col-span-3 space-y-6">
                            <div>
                                <h3 className="text-3xl font-black text-white mb-2 italic tracking-tighter uppercase leading-none group-hover:text-[#5d5fef] transition-colors">
                                    {exam.name}
                                </h3>
                                <span className={`text-[9px] uppercase font-black tracking-widest px-4 py-1.5 rounded-lg border inline-block ${exam.color}`}>
                                    {idx === 0 ? 'Tier 1 Strategic' : 'Primary Target'}
                                </span>
                            </div>
                            
                            <div className="space-y-4 pt-4 border-t border-[#1e2440]">
                                <div className="flex items-center space-x-3">
                                    <span className="text-[9px] font-black text-[#4a5578] uppercase tracking-widest">Complexity</span>
                                    <div className="flex gap-1.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Flame 
                                                key={i} 
                                                className={`w-4 h-4 ${i < exam.difficulty ? 'text-orange-500 fill-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.4)]' : 'text-[#1e2440]'}`} 
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="h-1.5 w-full bg-[#0d1021] rounded-full overflow-hidden shadow-inner">
                                    <div 
                                        className={`h-full ${exam.barColor} rounded-full transition-all duration-1000 group-hover:scale-x-105`} 
                                        style={{ width: `${(exam.difficulty / 5) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                         </div>

                         {/* STRATEGY COLUMN */}
                         <div className="lg:col-span-5 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-[#1e2440] pt-10 lg:pt-0 lg:pl-16 space-y-8">
                             <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <Zap className="w-6 h-6 text-indigo-400 shrink-0" />
                                    <p className="text-lg font-black text-white uppercase tracking-widest">{exam.focus}</p>
                                </div>
                                <p className="text-xl text-[#7d8cb8] leading-relaxed italic font-medium group-hover:text-white transition-colors">
                                   "{exam.strategy}"
                                </p>
                             </div>
                             <div className="p-8 bg-[#0d1021] rounded-[2.5rem] border border-[#1e2440] flex gap-6 group/tip">
                                <Lightbulb className="w-7 h-7 text-amber-500 shrink-0 group-hover/tip:scale-110 transition-transform" />
                                <p className="text-sm font-bold text-slate-500 italic leading-relaxed">
                                   <strong>Prep Hack:</strong> {exam.prepTip}
                                </p>
                             </div>
                         </div>

                         {/* LOGISTICS COLUMN */}
                         <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-[#1e2440] pt-10 lg:pt-0 lg:pl-16 space-y-10">
                             <div className="flex items-center gap-8 group/item">
                                <div className="w-16 h-16 bg-[#0d1021] rounded-2xl flex items-center justify-center shrink-0 border border-[#1e2440] group-hover:border-indigo-500/30 transition-all shadow-inner">
                                  <Building className="w-7 h-7 text-[#4a5578] group-hover:text-indigo-400 transition-colors" />
                                </div>
                                <div>
                                    <span className="text-[10px] font-black text-[#4a5578] uppercase block tracking-[0.2em] mb-1">Target Nodes</span>
                                    <p className="text-lg text-[#7d8cb8] font-black italic uppercase tracking-tighter group-hover:text-white">{exam.colleges}</p>
                                </div>
                             </div>
                             <div className="flex items-center gap-8 group/item">
                                <div className="w-16 h-16 bg-[#0d1021] rounded-2xl flex items-center justify-center shrink-0 border border-[#1e2440] group-hover:border-indigo-500/30 transition-all shadow-inner">
                                  <Calendar className="w-7 h-7 text-[#4a5578] group-hover:text-indigo-400 transition-colors" />
                                </div>
                                <div>
                                    <span className="text-[10px] font-black text-[#4a5578] uppercase block tracking-[0.2em] mb-1">Execution window</span>
                                    <p className="text-lg text-[#7d8cb8] font-black italic uppercase tracking-tighter group-hover:text-white">{exam.dates}</p>
                                </div>
                             </div>
                         </div>

                     </div>
                 </div>
             ))}
         </div>
      </div>

      {/* --- KEY TAKEAWAYS: THE FINAL REPORT --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { label: 'JEE Advanced', color: 'rose', icon: Target, text: 'Depth over volume. Solve 10 high-quality problems that combine rotation, electrostatics, and integration rather than 100 simple NCERT level drills.' },
            { label: 'JEE Main / BITSAT', color: 'indigo', icon: BookOpen, text: 'Speed and Coverage. NCERT Chemistry is a scoring minefield. Ensure no chapter is left un-read, as BITSAT rewards even the smallest Inorganic facts.' },
            { label: 'University Tier', color: 'emerald', icon: Zap, text: 'Zero Silly Mistakes. In exams like VITEEE, the questions are direct formula applications. The battle is to maintain 100% calculation precision under time pressure.' }
          ].map((item, i) => (
            <div key={i} className={`bg-[#161a2e] p-10 rounded-[4rem] border border-${item.color}-500/20 hover:border-${item.color}-500/50 transition-all shadow-2xl group flex flex-col justify-between`}>
              <div>
                <h3 className={`font-black text-${item.color}-400 mb-8 flex items-center uppercase italic tracking-tighter text-2xl`}>
                    <item.icon className="w-7 h-7 mr-4" /> {item.label}
                </h3>
                <p className="text-base text-[#7d8cb8] font-medium italic group-hover:text-white transition-colors leading-relaxed">
                   "{item.text}"
                </p>
              </div>
              <div className="pt-10 flex items-center gap-3 opacity-30 group-hover:opacity-100 transition-all">
                 <div className={`w-2 h-2 rounded-full bg-${item.color}-500`}></div>
                 <span className="text-[10px] font-black uppercase tracking-widest">Protocol Active</span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ExamGuideModule;