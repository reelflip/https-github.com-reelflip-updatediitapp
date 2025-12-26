import React, { useState } from 'react';
import { Mail, Phone, Send, CheckCircle, Loader2, Sparkles, Building, ArrowRight, ShieldCheck, Terminal } from 'lucide-react';
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
    // Simulate operational logging
    setTimeout(() => {
        setIsSubmitting(false);
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: 'Academic Support Request', message: '' });
    }, 1800);
  };

  const labelClasses = "text-[10px] font-black uppercase text-[#4a5578] tracking-[0.3em] mb-4 block ml-8";
  const inputClasses = "w-full p-8 bg-[#0d1021] border border-[#1e2440] rounded-[2.5rem] focus:ring-8 focus:ring-indigo-500/10 focus:border-indigo-500/50 outline-none text-base font-bold text-white transition-all shadow-inner placeholder:text-[#2d3656]";

  return (
    <div className="bg-[#0a0c1a] min-h-screen text-white pt-20 animate-in fade-in duration-1000 pb-40">
       <div className="max-w-7xl mx-auto space-y-24">
           
           {/* --- TERMINAL HEADER --- */}
           <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 px-6">
              <div className="space-y-8">
                 <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[11px] font-black uppercase tracking-[0.4em] text-indigo-400 shadow-xl">
                    <Terminal className="w-4 h-4" /> Operational Support Nodes
                 </div>
                 <h2 className="text-8xl font-black text-white tracking-tighter leading-[0.85] italic uppercase">ESTABLISH <br /><span className="text-[#5d5fef]">UPLINK.</span></h2>
              </div>
              <p className="text-[#7d8cb8] font-medium max-w-sm text-2xl leading-relaxed italic">
                 "Technical or academic assistance for the 2025 prep season is prioritized via high-latency encrypted channels."
              </p>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 px-6">
              
              {/* --- SIDEBAR NODES --- */}
              <div className="lg:col-span-4 space-y-10">
                 {[
                   { icon: Mail, label: 'Direct Protocol', val: 'support@iitgeeprep.com', color: 'indigo', desc: 'Typical response within 60 mins.' },
                   { icon: Phone, label: 'Emergency Hotline', val: '+91 98765 43210', color: 'emerald', desc: 'Mon-Sat (10:00 - 18:00 IST)' },
                   { icon: Building, label: 'Intelligence HQ', val: 'Cyber Hub, Sector 24, India', color: 'rose', desc: 'Physical server operations node.' }
                 ].map((info, i) => (
                   <div key={i} className="bg-[#161a2e] p-12 rounded-[4.5rem] border border-[#2d3656] shadow-2xl group hover:border-indigo-500/40 transition-all duration-700 relative overflow-hidden">
                      <div className="absolute -right-6 -bottom-6 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity"><info.icon className="w-32 h-32" /></div>
                      <div className={`w-16 h-16 bg-[#0d1021] border border-[#1e2440] text-indigo-400 rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 group-hover:bg-[#5d5fef] group-hover:text-white transition-all shadow-inner`}>
                         <info.icon className="w-8 h-8" />
                      </div>
                      <div className="space-y-2">
                        <div className="text-[10px] font-black uppercase text-[#4a5578] tracking-[0.3em]">{info.label}</div>
                        <div className="text-2xl font-black text-white italic tracking-tighter uppercase leading-tight group-hover:text-[#5d5fef] transition-colors">{info.val}</div>
                        <p className="text-[10px] text-slate-500 font-bold italic pt-4">{info.desc}</p>
                      </div>
                   </div>
                 ))}
                 
                 <div className="p-10 bg-indigo-900/10 border border-indigo-500/20 rounded-[3.5rem] flex gap-6 items-start">
                    <ShieldCheck className="w-8 h-8 text-indigo-400 shrink-0 mt-1" />
                    <p className="text-xs text-indigo-300/80 font-medium italic leading-relaxed">
                       "All student-to-support communications are end-to-end encrypted. No academic performance data is shared outside of your primary node."
                    </p>
                 </div>
              </div>

              {/* --- MAIN FORM TERMINAL --- */}
              <div className="lg:col-span-8 bg-[#161a2e] rounded-[5rem] shadow-[0_60px_120px_-20px_rgba(0,0,0,0.8)] border border-[#2d3656] p-16 md:p-24 relative overflow-hidden">
                 {submitted ? (
                   <div className="py-32 text-center space-y-12 animate-in zoom-in-95 duration-700">
                      <div className="w-28 h-28 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-2xl border border-emerald-500/30">
                         <CheckCircle className="w-14 h-14" />
                      </div>
                      <div className="space-y-6">
                         <h3 className="text-6xl font-black italic tracking-tighter text-white uppercase leading-none">Transmission <br />Logged.</h3>
                         <p className="text-[#7d8cb8] max-w-sm mx-auto font-medium text-xl italic leading-relaxed">Our support engineers have cached your request. Check your uplink (inbox) shortly.</p>
                      </div>
                      <button onClick={() => setSubmitted(false)} className="bg-white text-slate-900 px-16 py-8 rounded-[2.5rem] font-black uppercase text-[11px] tracking-[0.5em] shadow-2xl hover:scale-105 transition-all">New Transmission</button>
                   </div>
                 ) : (
                   <form onSubmit={handleSubmit} className="space-y-16">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-4">
                           <label className={labelClasses}>Identity Token</label>
                           <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={inputClasses} placeholder="Aryan Sharma" />
                        </div>
                        <div className={inputClasses.includes('bg-') ? 'space-y-4' : ''}>
                           <div className="space-y-4">
                              <label className={labelClasses}>Uplink Address</label>
                              <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={inputClasses} placeholder="aryan@node.iit.ac.in" />
                           </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                         <label className={labelClasses}>Operational Objective</label>
                         <select value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className={`${inputClasses} appearance-none`}>
                            <option>Academic Support Request</option>
                            <option>Technical Handshake Issue</option>
                            <option>Syllabus Mapping Query</option>
                            <option>Parent Node Integration</option>
                            <option>Security/Identity Fault</option>
                         </select>
                      </div>
                      <div className="space-y-4">
                         <label className={labelClasses}>Request Payload</label>
                         <textarea required rows={6} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className={`${inputClasses} rounded-[4rem] p-12 resize-none`} placeholder="Describe your operational requirement with technical precision..." />
                      </div>
                      <button disabled={isSubmitting} type="submit" className="w-full bg-[#5d5fef] text-white py-10 rounded-[3.5rem] font-black uppercase text-[12px] tracking-[0.6em] shadow-[0_30px_60px_-10px_rgba(93,95,239,0.5)] flex items-center justify-center gap-8 hover:bg-[#4b4dec] transition-all disabled:opacity-50 active:scale-[0.98] group">
                        {isSubmitting ? <Loader2 className="w-8 h-8 animate-spin" /> : <><Send className="w-6 h-6 group-hover:translate-x-2 group-hover:-translate-y-1 transition-transform" /> EXECUTE UPLINK <ArrowRight className="w-6 h-6" /></>}
                      </button>
                   </form>
                 )}
              </div>
           </div>
       </div>
    </div>
  );
};

export default ContactModule;