
import React, { useState } from 'react';
import { Mail, Phone, Send, CheckCircle, Loader2, Sparkles, Building, ArrowRight, ShieldCheck, Terminal, MapPin } from 'lucide-react';
import { StudentData } from '../types';

interface ContactModuleProps {
  data: StudentData;
}

const ContactModule: React.FC<ContactModuleProps> = ({ data }) => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'Academic Support Request', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
        setIsSubmitting(false);
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: 'Academic Support Request', message: '' });
    }, 1500);
  };

  const inputClasses = "w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none text-base font-medium text-slate-800 transition-all placeholder:text-slate-400";

  return (
    <div className="bg-white min-h-screen">
      {/* --- HERO SECTION --- */}
      <section className="cloud-bg py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto text-center space-y-8">
           <div className="inline-flex items-center gap-3 px-6 py-2 bg-blue-50 border border-blue-100 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-[#1e3a8a] mb-4">
              <Terminal className="w-4 h-4" /> Operational Support Nodes
           </div>
           <h1 className="text-5xl md:text-7xl font-black text-[#1e3a8a] tracking-tight leading-none uppercase italic">
             Establish <br /><span className="text-[#82c341]">Uplink.</span>
           </h1>
           <p className="text-slate-500 text-xl font-medium max-w-2xl mx-auto leading-relaxed italic">
             "Technical or academic assistance for the prep season is prioritized via encrypted channels."
           </p>
        </div>
      </section>

      {/* --- CONTENT SECTION --- */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
           
           {/* Sidebar Info */}
           <div className="lg:col-span-4 space-y-8">
              {[
                { icon: Mail, label: 'Direct Protocol', val: 'support@iitjeeprep.com', color: 'blue' },
                { icon: Phone, label: 'Emergency Hotline', val: '+91 98765 43210', color: 'green' },
                { icon: MapPin, label: 'Intelligence HQ', val: 'Cyber Hub, Sector 24, India', color: 'indigo' }
              ].map((item, i) => (
                <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                   <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <item.icon className="w-7 h-7 text-[#1e3a8a]" />
                   </div>
                   <div className="space-y-1">
                      <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{item.label}</div>
                      <div className="text-xl font-bold text-slate-800">{item.val}</div>
                   </div>
                </div>
              ))}

              <div className="p-10 bg-blue-50/50 border border-blue-100 rounded-[2.5rem] flex gap-6 items-start">
                 <ShieldCheck className="w-8 h-8 text-blue-500 shrink-0 mt-1" />
                 <p className="text-xs text-blue-700 font-bold italic leading-relaxed uppercase tracking-wider">
                    "All student-to-support communications are end-to-end encrypted. Data integrity is guaranteed."
                 </p>
              </div>
           </div>

           {/* Contact Form Card */}
           <div className="lg:col-span-8">
              <div className="bg-white p-12 md:p-20 rounded-[4rem] shadow-2xl border border-slate-50 relative overflow-hidden">
                 {submitted ? (
                   <div className="py-20 text-center space-y-10 animate-in zoom-in-95">
                      <CheckCircle className="w-24 h-24 text-[#82c341] mx-auto animate-bounce" />
                      <div className="space-y-4">
                         <h2 className="text-5xl font-black text-[#1e3a8a] tracking-tight italic">Transmission Logged.</h2>
                         <p className="text-slate-500 text-lg font-medium italic">Our support engineers have cached your request. Check your inbox shortly.</p>
                      </div>
                      <button onClick={() => setSubmitted(false)} className="bg-[#1e3a8a] text-white px-12 py-5 rounded-[2rem] font-bold shadow-xl hover:scale-105 transition-all">New Transmission</button>
                   </div>
                 ) : (
                   <form onSubmit={handleSubmit} className="space-y-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">Identity Token</label>
                            <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={inputClasses} placeholder="Your Name" />
                         </div>
                         <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">Uplink Address</label>
                            <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={inputClasses} placeholder="Email" />
                         </div>
                      </div>
                      <div className="space-y-3">
                         <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">Operational Objective</label>
                         <select value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className={`${inputClasses} appearance-none bg-slate-50`}>
                            <option>Academic Support Request</option>
                            <option>Technical Handshake Issue</option>
                            <option>Syllabus Mapping Query</option>
                            <option>Security/Identity Fault</option>
                         </select>
                      </div>
                      <div className="space-y-3">
                         <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">Request Payload</label>
                         <textarea required rows={5} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className={inputClasses} placeholder="Detailed technical requirement..." />
                      </div>
                      <button disabled={isSubmitting} type="submit" className="w-full bg-[#82c341] text-white py-6 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.4em] shadow-xl hover:bg-[#74af3a] transition-all disabled:opacity-50 flex items-center justify-center gap-4">
                        {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Send className="w-5 h-5" /> Execute Uplink</>}
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

export default ContactModule;