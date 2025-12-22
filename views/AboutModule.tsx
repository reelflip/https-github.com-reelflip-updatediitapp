
import React from 'react';
import { BookOpen, Target, CalendarClock, BarChart, BookX, Heart, CheckCircle2, Award, Users, Globe, Brain, TrendingUp } from 'lucide-react';

const AboutModule: React.FC = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 pb-20">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Philosophy Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-16">
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl transition-transform hover:-translate-y-2 duration-300">
                <span className="text-5xl font-black text-blue-600 block mb-2 italic tracking-tighter">IIT</span>
                <h3 className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] block mb-4">Targeting Excellence</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    Focused on the rigor required for the <strong>Indian Institutes of Technology</strong>. We provide the depth needed for JEE Advanced.
                </p>
            </div>
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl transition-transform hover:-translate-y-2 duration-300">
                <span className="text-5xl font-black text-orange-500 block mb-2 italic tracking-tighter">GEE</span>
                <h3 className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] block mb-4">General Engineering</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    Beyond IITs, we cover all major <strong>entrance exams</strong> like BITSAT, VITEEE, and MET to ensure you have options.
                </p>
            </div>
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl transition-transform hover:-translate-y-2 duration-300">
                <span className="text-5xl font-black text-green-600 block mb-2 italic tracking-tighter">Prep</span>
                <h3 className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] block mb-4">Strategic Preparation</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    Moving beyond rote learning. We use <strong>analytics and study planners</strong> to optimize your routine for maximum output.
                </p>
            </div>
        </div>

        {/* Feature Breakdown */}
        <div className="space-y-12 mb-24 pt-12">
            <div className="text-center max-w-2xl mx-auto space-y-4">
                <h2 className="text-5xl font-black text-slate-900 tracking-tighter italic">Tools for Success.</h2>
                <p className="text-slate-500 font-medium">Our platform is built around the core pillars of effective exam preparation.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <FeatureCard 
                    icon={<BookOpen className="w-6 h-6 text-blue-600" />}
                    bg="bg-blue-50"
                    title="Syllabus Tracker"
                    desc="Granular tracking for Physics, Chemistry, and Maths. Visualize your coverage instantly."
                />
                <FeatureCard 
                    icon={<Target className="w-6 h-6 text-orange-600" />}
                    bg="bg-orange-50"
                    title="Mock Tests"
                    desc="Realistic practice with pattern-based mock tests and a vast question bank."
                />
                <FeatureCard 
                    icon={<CalendarClock className="w-6 h-6 text-purple-600" />}
                    bg="bg-purple-50"
                    title="Smart Timetable"
                    desc="Personalized study schedules based on your school hours and sleep cycle."
                />
                <FeatureCard 
                    icon={<BarChart className="w-6 h-6 text-indigo-600" />}
                    bg="bg-indigo-50"
                    title="Analytics"
                    desc="Identify weak areas with detailed subject-wise performance reports."
                />
                <FeatureCard 
                    icon={<BookX className="w-6 h-6 text-red-600" />}
                    bg="bg-red-50"
                    title="Mistake Notebook"
                    desc="Log incorrect answers and review them systematically to prevent repetition."
                />
                <FeatureCard 
                    icon={<Heart className="w-6 h-6 text-pink-600" />}
                    bg="bg-pink-50"
                    title="Wellness"
                    desc="Guided breathing exercises and focus sounds to maintain peak mental health."
                />
            </div>
        </div>

        {/* Mission Section */}
        <div className="bg-slate-100 rounded-[4rem] p-12 md:p-20 mb-16 flex flex-col md:flex-row items-center gap-16 shadow-inner border border-slate-200/50">
            <div className="flex-1 space-y-8">
                <h2 className="text-5xl font-black text-slate-900 tracking-tighter italic">Why IITGEEPREP?</h2>
                <p className="text-slate-600 leading-relaxed font-medium text-lg">
                    The journey to an IIT or NIT is a marathon, not a sprint. Most students fail not due to a lack of effort, but due to a lack of <strong>structured planning</strong>.
                </p>
                <p className="text-slate-600 leading-relaxed font-medium text-lg">
                    We empower students with data. By tracking every hour spent and every question solved, we turn the chaotic JEE preparation process into a measurable, manageable science.
                </p>
                <ul className="space-y-4 pt-4">
                    {[
                        "Designed by Engineers for Aspirants",
                        "Supports JEE Main, Advanced, BITSAT & More",
                        "Free Access to Premium Tracking Tools"
                    ].map((item, i) => (
                        <li key={i} className="flex items-center text-slate-800 font-bold">
                            <CheckCircle2 className="w-6 h-6 text-indigo-600 mr-4" /> {item}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="flex-1 flex justify-center">
                <div className="bg-white p-12 rounded-full shadow-2xl border-8 border-slate-50 text-center w-80 h-80 flex flex-col justify-center items-center relative group">
                    <div className="absolute inset-0 bg-indigo-50 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 -z-10"></div>
                    <Brain className="w-20 h-20 text-indigo-500 mb-4 transition-transform group-hover:scale-110" />
                    <h3 className="text-xl font-black text-slate-900 mb-1 italic tracking-tight">Focus on Concepts</h3>
                    <p className="text-xs text-slate-400 font-black uppercase tracking-widest">"Don't just memorize. Understand."</p>
                </div>
            </div>
        </div>

        {/* Parent Feature */}
        <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-[3.5rem] p-12 text-white shadow-2xl mb-16 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform"><Users className="w-64 h-64" /></div>
            <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                <div className="bg-white/20 backdrop-blur-md p-8 rounded-[2.5rem] shrink-0 border border-white/20">
                    <Users className="w-16 h-16 text-white" />
                </div>
                <div className="flex-1 text-center md:text-left space-y-4">
                    <h3 className="text-4xl font-black italic tracking-tighter">Empowering Parents.</h3>
                    <p className="text-teal-50 leading-relaxed text-xl font-medium">
                        Preparation is a family effort. IITGEEPREP allows parents to securely connect to their child's account to view <strong>real-time progress reports</strong>, syllabus coverage, and mock test scores—without needing to nag. Support your child with data, not pressure.
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{icon: React.ReactNode, bg: string, title: string, desc: string}> = ({ icon, bg, title, desc }) => (
    <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-200 hover:border-indigo-400 transition-all hover:shadow-2xl group flex flex-col items-center text-center">
        <div className={`${bg} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300 shadow-inner`}>
            {icon}
        </div>
        <h3 className="text-xl font-black text-slate-800 mb-3 italic tracking-tight transition-colors">{title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed font-medium">
            {desc}
        </p>
    </div>
);

export default AboutModule;
