
import React from 'react';
import { 
  Rocket, ClipboardList, BarChart2, BookOpen, Lightbulb, 
  Target, Award, ShieldCheck, Zap, Cpu, GraduationCap, ChevronRight,
  TrendingUp, Activity, ShieldAlert, Sparkles, Box, Compass,
  LayoutDashboard, FileText, CheckCircle2, LineChart, ArrowRight
} from 'lucide-react';

const AboutModule: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* --- HERO SECTION: "ABOUT US" MIX --- */}
      <section className="cloud-bg py-24 px-6 md:px-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24 relative z-10">
          
          {/* Left Side: Messaging */}
          <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <h2 className="text-indigo-600 font-black text-xs uppercase tracking-[0.4em] italic flex items-center justify-center lg:justify-start gap-2">
                <Sparkles className="w-4 h-4" /> The Engineering Standard
              </h2>
              <h1 className="text-6xl md:text-8xl font-black text-[#0a1128] tracking-tighter leading-[0.9] uppercase italic font-space">
                About <span className="text-[#82c341]">Us.</span>
              </h1>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-700 tracking-tight leading-snug">
                Helping Students Succeed in <br className="hidden md:block" />
                <span className="text-indigo-900 italic uppercase">IIT-JEE Preparation</span>
              </h3>
            </div>
            
            <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0 italic">
              "At <span className="text-indigo-600 font-black uppercase">iitgrrprep</span>, our mission is to provide students with the tools they need to succeed in one of the most competitive exams in India. We are dedicated to making preparation organized, effective, and attainable."
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-4">
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'login' }))}
                className="px-12 py-6 bg-[#0a1128] text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:scale-105 transition-all flex items-center gap-4 group"
              >
                Get Started <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="flex -space-x-4 items-center">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-200 overflow-hidden shadow-lg">
                      <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                   </div>
                 ))}
                 <span className="pl-6 text-[9px] font-black text-slate-400 uppercase tracking-widest">15k+ Linked Nodes</span>
              </div>
            </div>
          </div>
          
          {/* Right Side: Sophisticated Graphic Mix */}
          <div className="lg:w-1/2 relative">
             <div className="relative w-full max-w-lg aspect-square mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-emerald-500/10 rounded-[5rem] blur-3xl opacity-40"></div>
                
                {/* Floating Elements from Image concept */}
                <div className="absolute -top-6 -right-6 p-8 bg-white rounded-[3rem] shadow-2xl border border-slate-100 animate-bounce duration-[6s] z-20">
                    <Lightbulb className="text-[#82c341] w-10 h-10" />
                </div>
                <div className="absolute -bottom-8 -left-8 p-10 bg-[#0a1128] rounded-[3.5rem] shadow-2xl border border-white/10 text-white animate-pulse z-20">
                   <Target className="w-10 h-10 text-indigo-400" />
                </div>

                <div className="relative z-10 w-full h-full bg-white/40 backdrop-blur-md rounded-[6rem] border border-white/50 shadow-[0_50px_100px_-20px_rgba(10,17,40,0.15)] flex items-center justify-center overflow-hidden group">
                    <img 
                      src="https://img.freepik.com/free-vector/flat-hand-drawn-patient-doctor-illustration_23-2148858204.jpg?t=st=1720000000~exp=1720003600~hmac=..." 
                      alt="Student Learning Illustration" 
                      className="w-4/5 h-4/5 object-contain group-hover:scale-110 transition-transform duration-[5s] opacity-90 mix-blend-multiply"
                      style={{ filter: 'hue-rotate(220deg)' }} // Shifting colors to match our theme
                    />
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* --- WHY CHOOSE SECTION: TRIPLE CARD MIX --- */}
      <section className="py-32 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto space-y-24">
           <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-6xl font-black text-[#0a1128] tracking-tighter uppercase italic leading-none">
                Why Choose <span className="text-[#82c341]">IITGRRPREP?</span>
              </h2>
              <div className="h-1 w-24 bg-[#82c341] mx-auto rounded-full"></div>
              <p className="text-slate-400 font-black text-xs uppercase tracking-[0.4em] mt-6">Our Commitment to Excellence</p>
              <p className="text-slate-500 text-lg max-w-3xl mx-auto font-medium leading-relaxed italic">
                We understand the unique challenges students face. Our platform is designed to ease the preparation process by providing precision tracking and deep analytical tools.
              </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                { 
                  title: 'Effective Tracking', 
                  desc: 'Monitor your progress in Physics, Chemistry, and Maths with high-frequency telemetry and heatmaps.', 
                  icon: Activity,
                  color: 'indigo'
                },
                { 
                  title: 'Personalized Plans', 
                  desc: 'Receive structure and daily study protocols tailored to your specific neural focus and speed.', 
                  icon: ClipboardList,
                  color: 'emerald'
                },
                { 
                  title: 'Comprehensive Analysis', 
                  desc: 'Analyze your mock test scores to identify conceptual drift and stabilize your performance curve.', 
                  icon: LineChart,
                  color: 'rose'
                }
              ].map((item, i) => (
                <div key={i} className="group bg-[#f8fafc] p-12 rounded-[4.5rem] border border-slate-100 hover:bg-[#0a1128] hover:text-white transition-all duration-700 shadow-sm hover:shadow-2xl hover:-translate-y-4">
                   <div className={`w-20 h-20 bg-white rounded-[2rem] shadow-xl flex items-center justify-center mb-10 transition-all group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white`}>
                      <item.icon className="w-10 h-10" />
                   </div>
                   <h4 className="text-2xl font-black tracking-tight uppercase italic leading-none mb-6">{item.title}</h4>
                   <p className="text-slate-500 group-hover:text-slate-300 text-base leading-relaxed font-medium italic">"{item.desc}"</p>
                   <div className="mt-10 pt-10 border-t border-slate-200/50 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#82c341]">Activate Node</span>
                      <ChevronRight className="w-5 h-5 text-indigo-400" />
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* --- IDENTITY SECTION --- */}
      <section className="py-32 px-6 md:px-12 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
           <div className="lg:w-1/2">
              <div className="bg-[#0a1128] p-16 rounded-[4.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] space-y-12 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:rotate-12 transition-transform duration-[5s]"><Cpu className="w-80 h-80 text-white" /></div>
                 
                 <div className="flex justify-between items-center relative z-10">
                    <h3 className="text-2xl font-black text-indigo-400 italic uppercase">System Sync.</h3>
                    <div className="bg-white/10 text-emerald-400 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 animate-pulse">Active Live Feed</div>
                 </div>
                 
                 <div className="space-y-8 relative z-10">
                    {[
                      { label: 'JEE Advanced Logic', val: 92, color: 'bg-indigo-500' },
                      { label: 'Numerical Precision', val: 88, color: 'bg-[#82c341]' },
                      { label: 'Exam Stoicism', val: 95, color: 'bg-emerald-500' }
                    ].map((stat, i) => (
                      <div key={i} className="space-y-3">
                         <div className="flex justify-between items-end">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</span>
                            <span className="text-xl font-black text-white">{stat.val}%</span>
                         </div>
                         <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden shadow-inner">
                            <div className={`h-full ${stat.color} transition-all duration-[2s]`} style={{ width: `${stat.val}%` }}></div>
                         </div>
                      </div>
                    ))}
                 </div>
                 <div className="pt-10 border-t border-white/5 text-center relative z-10">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] italic">Synchronizing results in real-time.</p>
                 </div>
              </div>
           </div>
           
           <div className="lg:w-1/2 space-y-10">
              <div className="space-y-6">
                <h2 className="text-5xl md:text-7xl font-black text-[#0a1128] tracking-tighter leading-[0.9] uppercase italic font-space">
                   Beyond the <br /> <span className="text-[#82c341]">IIT Barrier.</span>
                </h2>
                <p className="text-slate-500 text-2xl font-medium leading-relaxed italic">
                  "Training at the 'IIT Rigor' level makes national exams like BITSAT or VITEEE straightforward. One protocol, infinite gateways."
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                 {[
                   { title: 'BITSAT Speed', sub: 'High-Velocity Drills', icon: Zap },
                   { title: 'CET Coverage', sub: 'National Mapping', icon: Compass },
                   { title: 'VITEEE Protocol', sub: 'Mastery Tracks', icon: Box },
                   { title: 'Result Synergy', sub: 'Performance Link', icon: Award }
                 ].map((feat, i) => (
                   <div key={i} className="flex gap-6 items-center p-8 bg-white border border-slate-200 rounded-[3rem] hover:border-indigo-400 transition-all cursor-default shadow-sm hover:shadow-md">
                      <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600"><feat.icon className="w-7 h-7" /></div>
                      <div>
                        <div className="text-base font-black italic tracking-tight text-slate-800">{feat.title}</div>
                        <div className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{feat.sub}</div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </section>

      {/* --- REFINED CTA --- */}
      <section className="py-40 px-6 md:px-12 bg-white text-center relative">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-24 bg-slate-100"></div>
         <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8">
            <div className="w-24 h-24 bg-indigo-50 rounded-[2.5rem] shadow-xl flex items-center justify-center mx-auto text-indigo-600 border border-indigo-100">
               <ShieldCheck className="w-12 h-12" />
            </div>
            <div className="space-y-4">
               <h2 className="text-5xl md:text-8xl font-black text-[#0a1128] tracking-tighter uppercase italic leading-none">The Future is <br /><span className="text-[#82c341]">Engineered.</span></h2>
               <p className="text-slate-400 text-xl md:text-2xl font-medium italic leading-relaxed max-w-2xl mx-auto">"Join the elite aspirants who refuse to settle for mediocre preparation systems."</p>
            </div>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'login' }))}
              className="px-16 py-8 bg-[#0a1128] text-white rounded-[3rem] font-black text-sm uppercase tracking-[0.5em] shadow-[0_30px_60px_-15px_rgba(10,17,40,0.4)] hover:scale-110 transition-all hover:bg-black active:scale-95 flex items-center justify-center gap-4 mx-auto"
            >
              Sign Up Today <ArrowRight className="w-5 h-5" />
            </button>
         </div>
      </section>
    </div>
  );
};

export default AboutModule;
