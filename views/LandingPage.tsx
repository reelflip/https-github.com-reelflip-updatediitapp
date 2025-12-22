
import React, { useState } from 'react';
// Fix: Added missing Sparkles icon to imports
import { Brain, Zap, Target, Mail, Send, CheckCircle, Heart, Shield, Award, Users, Sparkles } from 'lucide-react';
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
    
    // Simulate API delay
    setTimeout(() => {
      const newMessage: ContactMessage = {
        id: `m-${Date.now()}`,
        ...contactForm,
        date: new Date().toISOString().split('T')[0],
        isRead: false
      };
      
      setStudentData({
        ...studentData,
        messages: [...studentData.messages, newMessage]
      });
      
      setIsSubmitting(false);
      setSubmitted(true);
      setContactForm({ name: '', email: '', subject: '', message: '' });
    }, 1000);
  };

  return (
    <div className="bg-slate-950 text-white min-h-screen font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-black">J</div>
          <span className="font-black text-xl tracking-tighter italic">JEE-PRO</span>
        </div>
        <div className="hidden md:flex gap-8 text-xs font-bold uppercase tracking-widest text-slate-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#about" className="hover:text-white transition-colors">About Us</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
        </div>
        <button 
          onClick={onLogin}
          className="bg-indigo-600 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-indigo-500 transition-all"
        >
          Launch Platform
        </button>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-20 px-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-indigo-600/10 blur-[120px] rounded-full"></div>
        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 bg-indigo-900/30 border border-indigo-500/30 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-300">
            <Sparkles className="w-3 h-3" /> Powered by Gemini 2.5 Intelligence
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter italic leading-[0.9]">
            MASTER THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500">CURRICULUM</span> OF SUCCESS.
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            The most advanced cognitive JEE prep tracker. Academic mastery meets mental wellbeing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button onClick={onLogin} className="bg-white text-slate-950 px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all text-sm">Join the Elite 1%</button>
            <button className="bg-slate-900 text-white border border-white/10 px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all text-sm">Watch Demo</button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-8 bg-slate-900/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black mb-4 italic">ADVANCED CORE.</h2>
            <p className="text-slate-500 uppercase font-black text-[10px] tracking-[0.3em]">Precision Engineering for Aspirants</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Target, title: 'Tactical Tracking', desc: 'Real-time accuracy and progress heatmaps for every chapter in Physics, Chemistry, and Math.' },
              { icon: Brain, title: 'Psychometric Insight', desc: 'A dedicated wellbeing suite that monitors stress and focus levels to prevent prep burnout.' },
              { icon: Zap, title: 'AI Study Coach', desc: 'Daily actionable tasks generated by Gemini API based on your performance data.' }
            ].map((f, i) => (
              <div key={i} className="bg-slate-950 p-10 rounded-[2.5rem] border border-white/5 hover:border-indigo-500/50 transition-all group">
                <div className="w-14 h-14 bg-indigo-600/10 text-indigo-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <f.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-4">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-black italic">BEYOND JUST MARKS.</h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              We founded JEE-PRO with one goal: to humanize the most competitive exam in the world. We believe that a student's mental state is just as important as their molarity calculations.
            </p>
            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-2">
                 <div className="text-3xl font-black text-indigo-500">12k+</div>
                 <div className="text-[10px] uppercase font-black tracking-widest text-slate-500">Active Aspirants</div>
               </div>
               <div className="space-y-2">
                 <div className="text-3xl font-black text-indigo-500">99.8%</div>
                 <div className="text-[10px] uppercase font-black tracking-widest text-slate-500">Uptime Stability</div>
               </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-indigo-600 p-8 rounded-[3rem] text-center space-y-4">
                <Award className="w-10 h-10 mx-auto" />
                <div className="font-bold text-sm">Strategic Excellence</div>
             </div>
             <div className="bg-slate-900 p-8 rounded-[3rem] text-center space-y-4 translate-y-8">
                <Users className="w-10 h-10 mx-auto" />
                <div className="font-bold text-sm">Vibrant Community</div>
             </div>
             <div className="bg-slate-900 p-8 rounded-[3rem] text-center space-y-4">
                <Shield className="w-10 h-10 mx-auto" />
                <div className="font-bold text-sm">Data Privacy</div>
             </div>
             <div className="bg-rose-600 p-8 rounded-[3rem] text-center space-y-4 translate-y-8">
                <Heart className="w-10 h-10 mx-auto" />
                <div className="font-bold text-sm">Mental Wellness</div>
             </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 px-8 bg-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black italic mb-4">GET IN TOUCH.</h2>
            <p className="text-slate-500 text-sm">Questions? Concerns? We're here to support your journey.</p>
          </div>

          <div className="bg-slate-950 p-10 rounded-[3rem] border border-white/5 shadow-2xl">
            {submitted ? (
              <div className="py-20 text-center space-y-6 animate-in zoom-in duration-500">
                <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold">Message Transmitted!</h3>
                <p className="text-slate-500">Our support team has received your inquiry and will respond via email shortly.</p>
                <button onClick={() => setSubmitted(false)} className="text-indigo-500 font-bold hover:underline">Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest ml-4">Full Name</label>
                    <input 
                      type="text" required
                      value={contactForm.name}
                      onChange={e => setContactForm({...contactForm, name: e.target.value})}
                      className="w-full bg-slate-900 border-none rounded-2xl p-4 text-sm font-bold text-white focus:ring-2 focus:ring-indigo-600" 
                      placeholder="e.g. Rahul Sharma"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest ml-4">Email Address</label>
                    <input 
                      type="email" required
                      value={contactForm.email}
                      onChange={e => setContactForm({...contactForm, email: e.target.value})}
                      className="w-full bg-slate-900 border-none rounded-2xl p-4 text-sm font-bold text-white focus:ring-2 focus:ring-indigo-600" 
                      placeholder="name@domain.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest ml-4">Subject</label>
                  <input 
                    type="text" required
                    value={contactForm.subject}
                    onChange={e => setContactForm({...contactForm, subject: e.target.value})}
                    className="w-full bg-slate-900 border-none rounded-2xl p-4 text-sm font-bold text-white focus:ring-2 focus:ring-indigo-600" 
                    placeholder="e.g. Account Access Issue"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest ml-4">Detailed Message</label>
                  <textarea 
                    required rows={5}
                    value={contactForm.message}
                    onChange={e => setContactForm({...contactForm, message: e.target.value})}
                    className="w-full bg-slate-900 border-none rounded-2xl p-6 text-sm font-medium text-white focus:ring-2 focus:ring-indigo-600" 
                    placeholder="Tell us how we can help..."
                  />
                </div>
                <button 
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-500 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? <span className="animate-pulse">Transmitting...</span> : <><Send className="w-4 h-4" /> Send Message</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <footer className="py-10 px-8 border-t border-white/5 text-center text-[10px] font-bold text-slate-600 uppercase tracking-widest">
        &copy; 2024 JEE-PRO INTELLIGENCE. ALL RIGHTS RESERVED.
      </footer>
    </div>
  );
};

export default LandingPage;
