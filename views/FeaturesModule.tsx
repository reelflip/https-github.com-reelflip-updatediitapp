
import React from 'react';
import { 
  BookOpen, Target, Brain, BarChart2, Calendar, 
  RotateCw, Users, ShieldCheck, Zap, Layers, 
  CheckCircle2, TrendingUp, Clock, FileText, Activity, Heart, Bell, Layout 
} from 'lucide-react';

const FeaturesModule: React.FC = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 pb-20 max-w-7xl mx-auto">
      
      {/* Hero Section */}
      <div className="bg-slate-900 text-white rounded-[3.5rem] pt-20 pb-24 px-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 bg-gradient-to-l from-blue-600 to-transparent pointer-events-none"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
            <span className="inline-block py-1.5 px-4 rounded-full bg-indigo-900/50 backdrop-blur-md text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-indigo-800">
                v13.5 Platform Intelligence
            </span>
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-tight mb-8 italic">
                The Complete Toolkit for <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Engineering Excellence.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-medium">
                IITGEEPrep integrates syllabus tracking, AI-driven testing, and performance analytics into one cohesive ecosystem designed for JEE Main, Advanced, BITSAT, and all major entrance exams.
            </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-12 relative z-20">
        
        {/* Key Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
            
            {/* Feature 1: Syllabus Tracker */}
            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-200 hover:-translate-y-2 transition-all duration-300 group">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <BookOpen className="w-9 h-9" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 italic tracking-tight">Granular Syllabus Tracker</h3>
                <p className="text-slate-500 leading-relaxed text-sm font-medium">
                    Don't just check off chapters. Track sub-topics across Physics, Chemistry, and Maths with statuses like 'Backlog', 'In Progress', and 'Revision Due'.
                </p>
            </div>

            {/* Feature 2: Test Center */}
            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-200 hover:-translate-y-2 transition-all duration-300 group">
                <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-8 shadow-inner group-hover:bg-purple-600 group-hover:text-white transition-all">
                    <Target className="w-9 h-9" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 italic tracking-tight">Adaptive Test Engine</h3>
                <p className="text-slate-500 leading-relaxed text-sm font-medium">
                    Attempt full-length mock tests or create custom practice sessions by chapter and difficulty. Includes NTA-style interface and negative marking.
                </p>
            </div>

            {/* Feature 3: Analytics */}
            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-200 hover:-translate-y-2 transition-all duration-300 group">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-8 shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <BarChart2 className="w-9 h-9" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 italic tracking-tight">Deep Performance Analytics</h3>
                <p className="text-slate-500 leading-relaxed text-sm font-medium">
                    Go beyond scores. Analyze your accuracy, question-wise time management, and identify weak chapters via multi-dimensional radar charts.
                </p>
            </div>

            {/* Feature 4: AI Tutor */}
            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-200 hover:-translate-y-2 transition-all duration-300 group">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-8 shadow-inner group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    <Brain className="w-9 h-9" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 italic tracking-tight">AI Personal Tutor</h3>
                <p className="text-slate-500 leading-relaxed text-sm font-medium">
                    Stuck on a concept at 2 AM? Ask doubts instantly. Provides step-by-step explanations for complex Physics and Math problems via Gemini API.
                </p>
            </div>

            {/* Feature 5: Revision Manager */}
            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-200 hover:-translate-y-2 transition-all duration-300 group">
                <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-8 shadow-inner group-hover:bg-orange-600 group-hover:text-white transition-all">
                    <RotateCw className="w-9 h-9" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 italic tracking-tight">Smart Revision Manager</h3>
                <p className="text-slate-500 leading-relaxed text-sm font-medium">
                    Based on the 1-7-30 spaced repetition rule. The system automatically flags topics for review to ensure long-term retention.
                </p>
            </div>

            {/* Feature 6: Parent Connect */}
            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-200 hover:-translate-y-2 transition-all duration-300 group">
                <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center mb-8 shadow-inner group-hover:bg-pink-600 group-hover:text-white transition-all">
                    <Users className="w-9 h-9" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 italic tracking-tight">Parent Family Console</h3>
                <p className="text-slate-500 leading-relaxed text-sm font-medium">
                    Parents can link to their child's account to view non-intrusive reports. See study hours and test scores without constant nagging.
                </p>
            </div>

        </div>

        {/* Detailed Parent Roles Section */}
        <div className="mb-24 bg-white rounded-[4rem] border border-slate-200 shadow-2xl overflow-hidden">
            <div className="bg-slate-900 p-12 text-white text-center relative overflow-hidden">
                <div className="relative z-10 space-y-4">
                    <h2 className="text-4xl font-black italic tracking-tighter">Parent Role & Synergy.</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg font-medium">
                        Parents have access to a dedicated dashboard to monitor, support, and track their child’s preparation safely.
                    </p>
                </div>
                <Users className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 text-slate-800 opacity-20 pointer-events-none" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                <div className="p-12 space-y-12">
                    <FeatureBlock 
                        title="Student Performance Monitoring" 
                        points={[
                            "View overall academic progress",
                            "Track subject-wise and topic-wise performance",
                            "Monitor test scores, rankings, and improvement trends"
                        ]}
                        icon={<TrendingUp className="w-7 h-7 text-blue-600" />}
                    />
                    <FeatureBlock 
                        title="Test & Assessment Visibility" 
                        points={[
                            "Access results of diagnostic and mock tests",
                            "Review detailed reports and analytics",
                            "See strengths and recommended focus areas"
                        ]}
                        icon={<FileText className="w-7 h-7 text-purple-600" />}
                    />
                    <FeatureBlock 
                        title="Psychometric & Career Insights" 
                        points={[
                            "View psychometric assessment results",
                            "Understand the student’s learning style and aptitude",
                            "Get guidance insights aligned with IIT preparation"
                        ]}
                        icon={<Brain className="w-7 h-7 text-pink-600" />}
                    />
                </div>
                <div className="p-12 space-y-12">
                    <FeatureBlock 
                        title="Activity & Engagement Tracking" 
                        points={[
                            "Monitor test participation status",
                            "Check consistency and practice frequency",
                            "Engagement level heatmaps"
                        ]}
                        icon={<Activity className="w-7 h-7 text-orange-600" />}
                    />
                    <FeatureBlock 
                        title="Communication & Support" 
                        points={[
                            "Receive important updates and alerts",
                            "Help plan study schedules based on insights",
                            "Encourage corrective actions based on data"
                        ]}
                        icon={<Bell className="w-7 h-7 text-green-600" />}
                    />
                    <FeatureBlock 
                        title="Account & Profile Management" 
                        points={[
                            "View student profile details",
                            "Ensure data accuracy and completeness",
                            "Manage linked family node security"
                        ]}
                        icon={<ShieldCheck className="w-7 h-7 text-slate-600" />}
                    />
                </div>
            </div>
        </div>

        {/* Tools Showcase */}
        <div className="mb-24 space-y-12">
            <div className="text-center">
                <h2 className="text-4xl font-black text-slate-900 italic tracking-tighter">More Than Just Tracking.</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { icon: Clock, label: 'Pomodoro Timer', desc: 'Focus Protocol', color: 'orange' },
                  { icon: Layers, label: 'Flashcards', desc: 'Active Recall', color: 'teal' },
                  { icon: FileText, label: 'Mistake Log', desc: 'Error Analysis', color: 'red' },
                  { icon: Heart, label: 'Wellness Node', desc: 'Stress Control', color: 'blue' }
                ].map((tool, i) => (
                  <div key={i} className="p-10 bg-white border border-slate-200 rounded-[2.5rem] text-center hover:shadow-2xl hover:border-indigo-400 transition-all group">
                      <div className={`bg-${tool.color}-50 p-4 rounded-2xl w-fit mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                        <tool.icon className={`w-10 h-10 text-${tool.color}-500`} />
                      </div>
                      <h4 className="font-black text-slate-800 text-lg">{tool.label}</h4>
                      <p className="text-[10px] font-black uppercase text-slate-400 mt-1 tracking-widest">{tool.desc}</p>
                  </div>
                ))}
            </div>
        </div>

        {/* CTA */}
        <div className="bg-slate-900 rounded-[4rem] p-16 text-center text-white relative overflow-hidden mb-12 shadow-2xl">
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                <h2 className="text-5xl font-black italic tracking-tighter">Start Your Journey Today.</h2>
                <p className="text-slate-400 mb-10 text-lg font-medium">
                    Join thousands of aspirants organizing their preparation with IITGEEPrep. It's time to turn your hard work into clinical results.
                </p>
                <button className="bg-white text-slate-900 px-14 py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] shadow-xl hover:bg-indigo-600 hover:text-white transition-all">Establish Profile</button>
            </div>
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-80 h-80 bg-blue-600/20 rounded-full blur-[100px] -ml-20 -mt-20"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-600/20 rounded-full blur-[100px] -mr-20 -mb-20"></div>
        </div>

      </div>
    </div>
  );
};

const FeatureBlock = ({ title, points, icon }: { title: string, points: string[], icon: React.ReactNode }) => (
    <div className="flex gap-6">
        <div className="shrink-0 mt-1 bg-slate-50 p-3 rounded-2xl border border-slate-100 h-fit shadow-inner">
            {icon}
        </div>
        <div className="space-y-3">
            <h4 className="font-black text-slate-900 text-xl italic tracking-tight">{title}</h4>
            <ul className="space-y-2">
                {points.map((p, i) => (
                    <li key={i} className="flex items-start text-sm text-slate-500 leading-relaxed font-medium">
                        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 mr-3 shrink-0"></span>
                        {p}
                    </li>
                ))}
            </ul>
        </div>
    </div>
);

export default FeaturesModule;
