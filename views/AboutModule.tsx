
import React from 'react';
import { 
  BookOpen, 
  Target, 
  ChevronRight, 
  ArrowRight,
  Layers,
  Zap,
  TrendingUp,
  Brain
} from 'lucide-react';

const AboutModule: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* --- HERO SECTION --- */}
      <section className="py-20 md:py-32 px-6 md:px-12 text-center max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-tight mb-8">
          Master Your <span className="text-indigo-600">IIT JEE Preparation</span>
        </h1>
        <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed max-w-3xl mx-auto italic mb-12">
          <span className="font-bold text-slate-800">IITGEEPrep</span> provides the digital infrastructure for serious engineering aspirants. 
          We combine an advanced <span className="text-indigo-600 font-bold">syllabus tracker</span>, high-yield <span className="text-indigo-600 font-bold">mock tests</span>, and data-driven insights to help you crack India's toughest entrance exams.
        </p>
      </section>

      {/* --- PHILOSOPHY SECTION --- */}
      <section className="py-12 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-[0_40px_100px_-20px_rgba(10,17,40,0.08)] p-12 md:p-20 space-y-16">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 text-center tracking-tight">
            The IITGEEPrep Philosophy
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* IIT Card */}
            <div className="bg-blue-50/50 p-10 rounded-[2.5rem] border border-blue-100 flex flex-col h-full group hover:shadow-xl transition-all">
              <h3 className="text-5xl font-black text-blue-600 mb-2 italic">IIT</h3>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-6">Targeting Excellence</div>
              <p className="text-slate-600 text-sm leading-relaxed flex-1">
                Focused on the rigor required for the <span className="font-bold text-slate-900">Indian Institutes of Technology</span>. 
                We provide the depth needed for JEE Advanced.
              </p>
            </div>

            {/* GEE Card */}
            <div className="bg-amber-50/50 p-10 rounded-[2.5rem] border border-amber-100 flex flex-col h-full group hover:shadow-xl transition-all">
              <h3 className="text-5xl font-black text-amber-500 mb-2 italic">GEE</h3>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400 mb-6">General Engineering Education</div>
              <p className="text-slate-600 text-sm leading-relaxed flex-1">
                Beyond IITs, we cover all major <span className="font-bold text-slate-900">engineering entrance exams</span> like BITSAT, VITEEE, and MET to ensure you have options.
              </p>
            </div>

            {/* Prep Card */}
            <div className="bg-emerald-50/50 p-10 rounded-[2.5rem] border border-emerald-100 flex flex-col h-full group hover:shadow-xl transition-all">
              <h3 className="text-5xl font-black text-emerald-500 mb-2 italic">Prep</h3>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-6">Strategic Preparation</div>
              <p className="text-slate-600 text-sm leading-relaxed flex-1">
                Moving beyond rote learning. We use <span className="font-bold text-slate-900">analytics and study planners</span> to optimize your routine for maximum output.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- TOOLS SECTION --- */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Tools for Engineering Success</h2>
          <p className="text-slate-500 text-lg font-medium italic">Our platform is built around the core pillars of effective exam preparation.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Syllabus Tracker */}
          <div className="bg-[#fcfdfe] p-10 rounded-[3rem] border border-slate-100 shadow-sm flex gap-8 group hover:border-indigo-200 transition-all">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0 shadow-inner group-hover:scale-110 transition-transform">
              <BookOpen className="w-8 h-8" />
            </div>
            <div className="space-y-4">
              <h4 className="text-2xl font-black text-slate-800 tracking-tight italic leading-none">Syllabus Tracker & Progress</h4>
              <p className="text-slate-500 leading-relaxed text-sm">
                A granular syllabus tracker for Physics, Chemistry, and Maths. Mark topics as complete, track exercises (Ex-1, Ex-2), and visualize your mastery levels with real-time analytics.
              </p>
            </div>
          </div>

          {/* Mock Tests */}
          <div className="bg-[#fcfdfe] p-10 rounded-[3rem] border border-slate-100 shadow-sm flex gap-8 group hover:border-rose-200 transition-all">
            <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 shrink-0 shadow-inner group-hover:scale-110 transition-transform">
              <Target className="w-8 h-8" />
            </div>
            <div className="space-y-4">
              <h4 className="text-2xl font-black text-slate-800 tracking-tight italic leading-none">Mock Tests & Question Bank</h4>
              <p className="text-slate-500 leading-relaxed text-sm">
                Practice with realistic mock tests based on previous year patterns. Access a question bank of high-yield problems to test your conceptual depth and solving velocity.
              </p>
            </div>
          </div>

          {/* AI Insights (Implicitly part of the "Insights" mentioned in description) */}
          <div className="bg-[#fcfdfe] p-10 rounded-[3rem] border border-slate-100 shadow-sm flex gap-8 group hover:border-emerald-200 transition-all">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 shrink-0 shadow-inner group-hover:scale-110 transition-transform">
              <Brain className="w-8 h-8" />
            </div>
            <div className="space-y-4">
              <h4 className="text-2xl font-black text-slate-800 tracking-tight italic leading-none">Data-Driven Intelligence</h4>
              <p className="text-slate-500 leading-relaxed text-sm">
                Identify weak zones and "silly mistake" patterns automatically. Our algorithms suggest the best revision topics based on your personal forgetting curve.
              </p>
            </div>
          </div>

          {/* Resource Hub */}
          <div className="bg-[#fcfdfe] p-10 rounded-[3rem] border border-slate-100 shadow-sm flex gap-8 group hover:border-amber-200 transition-all">
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 shrink-0 shadow-inner group-hover:scale-110 transition-transform">
              <Zap className="w-8 h-8" />
            </div>
            <div className="space-y-4">
              <h4 className="text-2xl font-black text-slate-800 tracking-tight italic leading-none">High-Frequency Learning</h4>
              <p className="text-slate-500 leading-relaxed text-sm">
                Access curated formula maps, mnemonics, and subject-specific hacks. Designed for zero-latency recall during high-pressure exam environments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-32 px-6 text-center bg-slate-50">
        <div className="max-w-4xl mx-auto space-y-10">
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">Ready to <span className="text-indigo-600">Begin?</span></h2>
          <p className="text-slate-400 text-xl md:text-2xl font-medium italic leading-relaxed max-w-2xl mx-auto">"Join the aspirants who treat their study table like a laboratory for success."</p>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'login' }))}
            className="px-16 py-8 bg-indigo-600 text-white rounded-[3rem] font-black text-sm uppercase tracking-[0.5em] shadow-[0_30px_60px_-15px_rgba(79,70,229,0.4)] hover:scale-110 transition-all hover:bg-indigo-700 flex items-center justify-center gap-4 mx-auto"
          >
            Establish Workspace <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default AboutModule;
