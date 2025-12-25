
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, Loader2, Sparkles, Building } from 'lucide-react';
import { StudentData } from '../types';

interface ContactModuleProps {
  data: StudentData;
}

const ContactModule: React.FC<ContactModuleProps> = ({ data }) => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
        setIsSubmitting(false);
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 pb-32">
       <div className="max-w-6xl mx-auto space-y-16">
           <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 px-4">
              <div className="space-y-4">
                 <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-600">
                    <Sparkles className="w-4 h-4" /> Operational Support Nodes
                 </div>
                 <h2 className="text-7xl font-black text-slate-900 tracking-tighter leading-none italic">Get in <br /><span className="text-indigo-600">Touch.</span></h2>
              </div>
              <p className="text-slate-500 font-medium max-w-sm text-lg leading-relaxed">Technical assistance for the 2025 prep season is available 24/7 via digital uplink.</p>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 px-4">
              <div className="lg:col-span-4 space-y-8">
                 {[
                   { icon: Mail, label: 'Uplink Address', val: 'support@iitgeeprep.com', color: 'indigo' },
                   { icon: Phone, label: 'Student Hotline', val: '+91 98765 43210', color: 'emerald' },
                   { icon: Building, label: 'Corporate HQ', val: 'Cyber Hub, Gurgaon, India', color: 'rose' }
                 ].map((info, i) => (
                   <div key={i} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm group hover:border-indigo-400 transition-all">
                      <div className={`w-14 h-14 bg-${info.color}-50 text-${info.color}-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner`}>
                         <info.icon className="w-7 h-7" />
                      </div>
                      <div className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1">{info.label}</div>
                      <div className="text-xl font-black text-slate-800 italic">{info.val}</div>
                   </div>
                 ))}
              </div>

              <div className="lg:col-span-8 bg-white rounded-[4rem] shadow-2xl border border-slate-200 p-12 lg:p-20 relative overflow-hidden">
                 {submitted ? (
                   <div className="py-20 text-center space-y-10 animate-in zoom-in-95 duration-500">
                      <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-200">
                         <CheckCircle className="w-12 h-12" />
                      </div>
                      <div className="space-y-4">
                         <h3 className="text-4xl font-black italic tracking-tighter text-slate-900">Uplink Established.</h3>
                         <p className="text-slate-500 max-w-sm mx-auto font-medium text-lg">Our engineering support team has logged your transmission. Check your inbox within 120 minutes.</p>
                      </div>
                      <button onClick={() => setSubmitted(false)} className="bg-indigo-600 text-white px-12 py-5 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.3em] hover:bg-slate-900 transition-all shadow-xl">New Transmission</button>
                   </div>
                 ) : (
                   <form onSubmit={handleSubmit} className="space-y-12">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6">Full Identity</label>
                           <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-6 bg-slate-50 border-none rounded-[2rem] focus:ring-4 focus:ring-indigo-100 outline-none text-sm font-black text-slate-800 transition-all shadow-inner" placeholder="Aryan Sharma" />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6">Email Address</label>
                           <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-6 bg-slate-50 border-none rounded-[2rem] focus:ring-4 focus:ring-indigo-100 outline-none text-sm font-black text-slate-800 transition-all shadow-inner" placeholder="aryan@iit.ac.in" />
                        </div>
                      </div>
                      <div className="space-y-3">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6">Message Intel</label>
                         <textarea required rows={6} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full p-10 bg-slate-50 border-none rounded-[3rem] focus:ring-4 focus:ring-indigo-100 outline-none text-sm font-medium text-slate-700 transition-all shadow-inner leading-relaxed" placeholder="State your requirements with technical precision..." />
                      </div>
                      <button disabled={isSubmitting} type="submit" className="w-full bg-slate-900 text-white py-6 rounded-[3rem] font-black uppercase text-xs tracking-[0.4em] shadow-2xl flex items-center justify-center gap-4 hover:bg-indigo-600 transition-all disabled:opacity-50">
                        {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Send className="w-5 h-5" /> Execute Transmission</>}
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
