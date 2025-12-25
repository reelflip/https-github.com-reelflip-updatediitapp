
import React, { useState } from 'react';
import { Brain, Zap, Target, Mail, Send, CheckCircle, ShieldCheck, Globe, BookOpen, BarChart2, CalendarClock, Users, Sparkles } from 'lucide-react';
import { StudentData, ContactMessage } from '../types';
import AboutModule from './AboutModule';

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
    <div className="bg-slate-50 text-slate-900 min-h-screen font-sans selection:bg-blue-600/10">
      {/* Core about content */}
      <AboutModule />

      {/* Contact Form Section */}
      <section id="contact" className="py-32 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-24">
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-6">
              <div className="text-[11px] font-black uppercase text-blue-600 tracking-[0.5em]">Global Uplink</div>
              <h2 className="text-6xl font-black text-slate-900 italic tracking-tighter leading-none">Get in <br /> Touch.</h2>
              <p className="text-slate-400 font-medium text-lg italic leading-relaxed">Technical assistance and institutional handshake requests are logged 24/7.</p>
            </div>
            
            <div className="space-y-8">
               {[
                 { icon: Mail, label: 'Support Channel', val: 'support@iitgeeprep.com', color: 'blue' },
                 { icon: Globe, label: 'Official Node', val: 'iitgeeprep.com', color: 'emerald' }
               ].map((item, i) => (
                 <div key={i} className="flex gap-6 items-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 border border-slate-200 shadow-sm">
                       <item.icon className={`w-7 h-7 text-${item.color}-600`} />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</div>
                      <div className="text-xl font-black text-slate-900 tracking-tight">{item.val}</div>
                    </div>
                 </div>
               ))}
            </div>
          </div>

          <div className="lg:col-span-7">
             <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.05)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl"></div>
                {submitted ? (
                  <div className="py-20 text-center space-y-8 animate-in zoom-in-95 duration-500">
                     <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto border border-blue-100 shadow-inner">
                        <CheckCircle className="w-12 h-12" />
                     </div>
                     <h3 className="text-4xl font-black italic tracking-tighter text-slate-900">Transmission Logged.</h3>
                     <p className="text-slate-400 text-lg max-w-xs mx-auto italic font-medium">Expected handshake resolution within 120 minutes.</p>
                     <button onClick={() => setSubmitted(false)} className="text-blue-600 font-black text-[10px] uppercase tracking-[0.4em] border-b-2 border-blue-100 hover:border-blue-600 transition-all pt-10">New Transmission</button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-10">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Full Identity</label>
                           <input 
                             type="text" required
                             value={contactForm.name}
                             onChange={e => setContactForm({...contactForm, name: e.target.value})}
                             className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 transition-all shadow-inner placeholder:text-slate-300" 
                             placeholder="Full Name"
                           />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Node Address</label>
                           <input 
                             type="email" required
                             value={contactForm.email}
                             onChange={e => setContactForm({...contactForm, email: e.target.value})}
                             className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 transition-all shadow-inner placeholder:text-slate-300" 
                             placeholder="email@node.com"
                           />
                        </div>
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Inquiry Intel</label>
                        <textarea 
                          required rows={5}
                          value={contactForm.message}
                          onChange={e => setContactForm({...contactForm, message: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] p-10 text-sm font-medium text-slate-600 focus:ring-2 focus:ring-blue-600 transition-all shadow-inner leading-relaxed placeholder:text-slate-300" 
                          placeholder="State your requirements with technical precision..."
                        />
                     </div>
                     <button 
                       disabled={isSubmitting}
                       className="w-full bg-blue-600 text-white py-6 rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-xs flex items-center justify-center gap-4 hover:bg-blue-700 transition-all shadow-2xl shadow-blue-100 disabled:opacity-50"
                     >
                       <Send className="w-5 h-5" /> Execute Transmission
                     </button>
                  </form>
                )}
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
