
import React, { useState } from 'react';
// Added missing Calendar icon to the import list
import { Brain, Zap, Target, Mail, Send, CheckCircle, Heart, Shield, Award, Users, Sparkles, ChevronRight, Star, Globe, ShieldCheck, MapPin, Phone, Calendar } from 'lucide-react';
import { StudentData, ContactMessage } from '../types';

interface LandingPageProps {
  onLogin: () => void;
  studentData: StudentData;
  setStudentData: (data: StudentData) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, studentData, setStudentData }) => {
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      const newMessage: ContactMessage = {
        id: `m-${Date.now()}`,
        ...contactForm,
        date: new Date().toISOString().split('T')[0],
        isRead: false
      };
      setStudentData({ ...studentData, messages: [...studentData.messages, newMessage] });
      setIsSubmitting(false);
      setSubmitted(true);
      setContactForm({ name: '', email: '', subject: '', message: '' });
    }, 1000);
  };

  return (
    <div className="bg-white text-slate-900 min-h-screen font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      {/* Top Header / Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100 px-6 lg:px-20 py-5 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <span className="text-white font-black text-xl italic">J</span>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-2xl tracking-tighter text-slate-900 leading-none">IIT-JEE PREP</span>
            <span className="text-[8px] font-black tracking-[0.3em] text-indigo-600 uppercase">Intelligence Hub</span>
          </div>
        </div>
        <div className="hidden lg:flex gap-10 text-[11px] font-black uppercase tracking-widest text-slate-500">
          <a href="#features" className="hover:text-indigo-600 transition-colors">Course Features</a>
          <a href="#about" className="hover:text-indigo-600 transition-colors">Our Vision</a>
          <a href="#results" className="hover:text-indigo-600 transition-colors">Success Stories</a>
          <a href="#contact" className="hover:text-indigo-600 transition-colors">Support</a>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={onLogin}
            className="bg-indigo-600 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center gap-2"
          >
            Launch Portal <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Modern Hero Section */}
      <section className="relative pt-48 pb-32 px-6 lg:px-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50 -skew-x-12 translate-x-1/4 -z-10"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10 animate-in fade-in slide-in-from-left duration-700">
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-600">
              <Sparkles className="w-3.5 h-3.5" /> India's Most Advanced JEE Tracker
            </div>
            <h1 className="text-7xl lg:text-8xl font-black tracking-tighter text-slate-900 leading-[0.9] italic">
              ENGINEER YOUR <br />
              <span className="text-indigo-600">SUCCESS.</span>
            </h1>
            <p className="text-slate-500 text-xl max-w-xl font-medium leading-relaxed">
              We provide the digital infrastructure for future IITians. Tactical tracking, AI diagnostics, and psychometric monitoring for AIR-1 aspirants.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 pt-4">
              <button onClick={onLogin} className="bg-slate-900 text-white px-12 py-5 rounded-[2rem] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all text-xs shadow-2xl">Start Preparation</button>
              <button className="bg-white text-slate-900 border-2 border-slate-100 px-12 py-5 rounded-[2rem] font-black uppercase tracking-widest hover:border-indigo-600 transition-all text-xs flex items-center justify-center gap-2">Watch Methodology</button>
            </div>
            <div className="flex items-center gap-8 pt-8 border-t border-slate-100">
               <div className="flex -space-x-4">
                  {[1,2,3,4].map(i => <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-200"></div>)}
               </div>
               <div className="text-xs font-bold text-slate-400">
                  <span className="text-slate-900 font-black block">14,200+ Students</span>
                  Already training with JEE-PRO
               </div>
            </div>
          </div>
          <div className="relative animate-in fade-in zoom-in duration-1000 delay-300">
             <div className="absolute inset-0 bg-indigo-600/10 blur-[100px] rounded-full scale-75"></div>
             <div className="bg-white p-10 rounded-[4rem] border-8 border-slate-50 shadow-2xl relative z-10 space-y-8">
                <div className="flex justify-between items-center">
                   <div className="font-black text-xl italic tracking-tight">Active Pulse</div>
                   <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_#10b981]"></div>
                </div>
                <div className="space-y-6">
                   {[
                     { label: 'Mechanics Mastery', val: 82, color: 'indigo' },
                     { label: 'Organic Velocity', val: 65, color: 'emerald' },
                     { label: 'Calculus Precision', val: 94, color: 'rose' }
                   ].map((item, idx) => (
                     <div key={idx} className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                           <span>{item.label}</span>
                           <span className="text-slate-900">{item.val}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                           <div className={`h-full bg-${item.color}-600`} style={{ width: `${item.val}%` }}></div>
                        </div>
                     </div>
                   ))}
                </div>
                <div className="p-6 bg-slate-900 rounded-[2.5rem] text-white">
                   <div className="flex items-center gap-3 mb-3">
                      <Brain className="w-5 h-5 text-indigo-400" />
                      <span className="text-[10px] font-black uppercase tracking-widest">AI Strategy Node</span>
                   </div>
                   <p className="text-xs text-slate-400 font-medium leading-relaxed italic">
                      "Analyzing performance peaks... Increasing weightage for Inorganic Chemistry in tonight's smart timetable."
                   </p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Trust & Results Section */}
      <section id="results" className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
              {[
                { val: '12', label: 'Top 100 AIRs', icon: Award },
                { val: '99.9%', label: 'Student Satisfaction', icon: Star },
                { val: '250+', label: 'Mock Test Banks', icon: Target },
                { val: '24/7', label: 'AI Support', icon: Zap }
              ].map((stat, i) => (
                <div key={i} className="space-y-4 group">
                   <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all group-hover:scale-110 group-hover:rotate-3">
                      <stat.icon className="w-8 h-8" />
                   </div>
                   <div>
                      <div className="text-4xl font-black text-slate-900">{stat.val}</div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{stat.label}</div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Strategic Features */}
      <section id="features" className="py-32 px-6 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-20">
            <div className="space-y-4">
              <h2 className="text-5xl font-black italic tracking-tighter text-slate-900">THE PROTOCOL.</h2>
              <p className="text-slate-500 font-medium text-lg">Four pillars of dominant JEE preparation.</p>
            </div>
            <div className="h-px flex-1 bg-slate-100 hidden md:block mx-12 mb-6"></div>
            <button onClick={onLogin} className="text-indigo-600 font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all">
              Explore Modules <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Syllabus Pulse', desc: 'Real-time mastery tracking with topic-wise heatmaps.', color: 'indigo', icon: Target },
              { title: 'Memory Hacks', desc: 'A vast repository of mnemonics and solving shortcuts.', color: 'rose', icon: Zap },
              { title: 'Wellness Node', desc: 'Psychometric tests to maintain mental stamina.', color: 'emerald', icon: Heart },
              { title: 'Smart Planner', desc: 'AI-generated schedules that adapt to your routine.', color: 'amber', icon: Calendar }
            ].map((f, i) => (
              <div key={i} className="group p-10 rounded-[3rem] bg-white border border-slate-100 shadow-sm hover:shadow-2xl hover:border-indigo-200 transition-all flex flex-col justify-between min-h-[350px]">
                <div className={`w-16 h-16 bg-${f.color}-50 text-${f.color}-600 rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform`}>
                  <f.icon className="w-8 h-8" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-black text-slate-900 italic">{f.title}</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us & Vision */}
      <section id="about" className="py-32 px-6 lg:px-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-20 opacity-5"><Globe className="w-96 h-96" /></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
           <div className="space-y-10">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-900/40">
                <Users className="w-4 h-4" /> Our Identity
              </div>
              <h2 className="text-6xl font-black tracking-tighter italic leading-none">ROOTED IN <br /> <span className="text-indigo-400">EXCELLENCE.</span></h2>
              <p className="text-slate-400 text-lg font-medium leading-relaxed">
                JEE-PRO was founded by a collective of IIT alumni and top educators who realized that traditional coaching lacks personalized data integrity. We didn't just build a tracker; we built a cockpit for your academic career.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                 <div className="space-y-3">
                    <ShieldCheck className="w-8 h-8 text-indigo-400" />
                    <h4 className="font-bold text-xl">Integrity First</h4>
                    <p className="text-xs text-slate-500 leading-relaxed uppercase font-black tracking-widest">We never compromise on student well-being.</p>
                 </div>
                 <div className="space-y-3">
                    <Brain className="w-8 h-8 text-emerald-400" />
                    <h4 className="font-bold text-xl">Cognitive Science</h4>
                    <p className="text-xs text-slate-500 leading-relaxed uppercase font-black tracking-widest">Our methodology is backed by memory research.</p>
                 </div>
              </div>
           </div>
           <div className="grid grid-cols-2 gap-6">
              <div className="p-8 bg-indigo-600 rounded-[3rem] shadow-2xl flex flex-col justify-center items-center text-center space-y-4 translate-y-12">
                 <div className="text-5xl font-black">AIR-1</div>
                 <div className="text-[10px] font-black uppercase tracking-widest opacity-80">Visionary Target</div>
              </div>
              <div className="p-8 bg-white text-slate-900 rounded-[3rem] shadow-2xl flex flex-col justify-center items-center text-center space-y-4">
                 <div className="text-5xl font-black">99%</div>
                 <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Retention Goal</div>
              </div>
              <div className="p-8 bg-slate-800 rounded-[3rem] shadow-2xl flex flex-col justify-center items-center text-center space-y-4 translate-y-12">
                 <div className="text-5xl font-black">2025</div>
                 <div className="text-[10px] font-black uppercase tracking-widest opacity-80">Batch Launch</div>
              </div>
              <div className="p-8 bg-indigo-900 rounded-[3rem] shadow-2xl flex flex-col justify-center items-center text-center space-y-4">
                 <div className="text-5xl font-black">∞</div>
                 <div className="text-[10px] font-black uppercase tracking-widest opacity-80">Potential</div>
              </div>
           </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 px-6 lg:px-20 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20">
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-4">
              <h2 className="text-5xl font-black italic tracking-tighter text-slate-900">GET IN TOUCH.</h2>
              <p className="text-slate-500 text-lg font-medium leading-relaxed">Have questions about our methodology or account access? Our technical support team is standing by.</p>
            </div>
            
            <div className="space-y-10">
               <div className="flex gap-6 group">
                  <div className="w-14 h-14 bg-slate-50 text-indigo-600 rounded-3xl flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                     <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Official Support</div>
                    <div className="text-xl font-black text-slate-900">support@iitgeeprep.com</div>
                  </div>
               </div>
               <div className="flex gap-6 group">
                  <div className="w-14 h-14 bg-slate-50 text-emerald-600 rounded-3xl flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                     <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Student Hotline</div>
                    <div className="text-xl font-black text-slate-900">+91 98765 43210</div>
                  </div>
               </div>
               <div className="flex gap-6 group">
                  <div className="w-14 h-14 bg-slate-50 text-rose-600 rounded-3xl flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-rose-600 group-hover:text-white transition-all shadow-sm">
                     <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Corporate HQ</div>
                    <div className="text-xl font-black text-slate-900 italic">Sector 18, Gurgaon, India</div>
                  </div>
               </div>
            </div>
          </div>

          <div className="lg:col-span-7">
             <div className="bg-slate-50 p-12 rounded-[4rem] border border-slate-100 shadow-inner relative overflow-hidden">
                {submitted ? (
                  <div className="py-20 text-center space-y-8 animate-in zoom-in duration-500">
                     <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-100">
                        <CheckCircle className="w-12 h-12" />
                     </div>
                     <div>
                        <h3 className="text-3xl font-black italic tracking-tight">Transmission Received.</h3>
                        <p className="text-slate-500 max-w-sm mx-auto font-medium mt-3">Our support hub has logged your request. We typically respond within 120 minutes.</p>
                     </div>
                     <button onClick={() => setSubmitted(false)} className="text-indigo-600 font-black text-sm uppercase tracking-widest border-b-4 border-indigo-100 hover:border-indigo-600 transition-all">Send Another Inquiry</button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-8">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase text-slate-400 ml-6 tracking-widest">Full Name</label>
                           <input 
                             type="text" required
                             value={contactForm.name}
                             onChange={e => setContactForm({...contactForm, name: e.target.value})}
                             className="w-full bg-white border-none rounded-[1.5rem] p-5 text-sm font-black text-slate-900 focus:ring-4 focus:ring-indigo-100 transition-all shadow-sm" 
                             placeholder="e.g. Aryan Sharma"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase text-slate-400 ml-6 tracking-widest">Email Identity</label>
                           <input 
                             type="email" required
                             value={contactForm.email}
                             onChange={e => setContactForm({...contactForm, email: e.target.value})}
                             className="w-full bg-white border-none rounded-[1.5rem] p-5 text-sm font-black text-slate-900 focus:ring-4 focus:ring-indigo-100 transition-all shadow-sm" 
                             placeholder="aryan@aspirant.com"
                           />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-6 tracking-widest">Inquiry Type</label>
                        <select 
                          required
                          value={contactForm.subject}
                          onChange={e => setContactForm({...contactForm, subject: e.target.value})}
                          className="w-full bg-white border-none rounded-[1.5rem] p-5 text-sm font-black text-slate-900 focus:ring-4 focus:ring-indigo-100 transition-all shadow-sm appearance-none"
                        >
                           <option value="">Select Category...</option>
                           <option value="Enrollment">Course Enrollment</option>
                           <option value="Technical">Technical Support</option>
                           <option value="Corporate">Corporate / Partnerships</option>
                           <option value="Other">Other Queries</option>
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-6 tracking-widest">Detailed Message</label>
                        <textarea 
                          required rows={6}
                          value={contactForm.message}
                          onChange={e => setContactForm({...contactForm, message: e.target.value})}
                          className="w-full bg-white border-none rounded-[2rem] p-8 text-sm font-medium text-slate-800 focus:ring-4 focus:ring-indigo-100 transition-all shadow-sm" 
                          placeholder="Provide specific details..."
                        />
                     </div>
                     <button 
                       disabled={isSubmitting}
                       className="w-full bg-indigo-600 text-white py-6 rounded-[2.5rem] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-100 disabled:opacity-50"
                     >
                       {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Send className="w-5 h-5" /> Execute Uplink</>}
                     </button>
                  </form>
                )}
             </div>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="bg-slate-900 pt-32 pb-20 px-6 lg:px-20 text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 pb-20 border-b border-slate-800">
           <div className="lg:col-span-5 space-y-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-black italic text-xl">J</span>
                </div>
                <span className="font-black text-2xl tracking-tighter italic">IIT-JEE PREP</span>
              </div>
              <p className="text-slate-500 text-sm max-w-sm font-medium leading-relaxed">
                The strategic digital hub for serious IIT aspirants. We combine deep tracking with psychological resilience to build AIR-1 trajectories.
              </p>
              <div className="flex gap-4">
                 {[1,2,3,4].map(i => <div key={i} className="w-10 h-10 bg-slate-800 rounded-xl hover:bg-indigo-600 transition-all cursor-pointer"></div>)}
              </div>
           </div>
           <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
              <div className="space-y-6">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Platform</h4>
                 <ul className="space-y-4 text-sm font-bold text-slate-400">
                    <li className="hover:text-white transition-colors cursor-pointer">Syllabus Pulse</li>
                    <li className="hover:text-white transition-colors cursor-pointer">Test Center</li>
                    <li className="hover:text-white transition-colors cursor-pointer">AI Study Coach</li>
                    <li className="hover:text-white transition-colors cursor-pointer">Family Node</li>
                 </ul>
              </div>
              <div className="space-y-6">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Identity</h4>
                 <ul className="space-y-4 text-sm font-bold text-slate-400">
                    <li className="hover:text-white transition-colors cursor-pointer">About Us</li>
                    <li className="hover:text-white transition-colors cursor-pointer">Faculty Hub</li>
                    <li className="hover:text-white transition-colors cursor-pointer">Results</li>
                    <li className="hover:text-white transition-colors cursor-pointer">Careers</li>
                 </ul>
              </div>
              <div className="space-y-6">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Policy</h4>
                 <ul className="space-y-4 text-sm font-bold text-slate-400">
                    <li className="hover:text-white transition-colors cursor-pointer">Privacy Protocol</li>
                    <li className="hover:text-white transition-colors cursor-pointer">Student Safety</li>
                    <li className="hover:text-white transition-colors cursor-pointer">Cookie Logs</li>
                    <li className="hover:text-white transition-colors cursor-pointer">Contact</li>
                 </ul>
              </div>
           </div>
        </div>
        <div className="max-w-7xl mx-auto pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
           <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-600">&copy; 2025 IIT-JEE PREP INTELLIGENCE. ALL SYSTEMS OPERATIONAL.</p>
           <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-600">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              Node Status: SECURE
           </div>
        </div>
      </footer>
    </div>
  );
};

const Loader2 = ({ className }: { className?: string }) => (
  <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default LandingPage;
