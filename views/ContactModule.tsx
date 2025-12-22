
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle, Loader2 } from 'lucide-react';
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
    
    // Simulate API delay
    setTimeout(() => {
        setIsSubmitting(false);
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 pb-20">
       <div className="max-w-6xl mx-auto px-4 mt-12">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Contact Info */}
              <div className="lg:col-span-1 space-y-6">
                 <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 flex items-start space-x-5 group hover:border-indigo-400 transition-all">
                    <div className="bg-blue-50 p-4 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                       <Mail className="w-7 h-7" />
                    </div>
                    <div>
                       <h3 className="font-black text-slate-800 text-lg italic tracking-tight">Email Us</h3>
                       <p className="text-sm text-slate-500 mt-1 font-medium">support@iitgeeprep.com</p>
                       <p className="text-sm text-slate-400 font-medium">admin@iitgeeprep.com</p>
                    </div>
                 </div>

                 <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 flex items-start space-x-5 group hover:border-emerald-400 transition-all">
                    <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-inner">
                       <Phone className="w-7 h-7" />
                    </div>
                    <div>
                       <h3 className="font-black text-slate-800 text-lg italic tracking-tight">Call Us</h3>
                       <p className="text-sm text-slate-500 mt-1 font-medium">Mon-Fri from 9am to 6pm</p>
                       <p className="text-sm text-emerald-600 font-black tracking-widest mt-1">+91 98765 43210</p>
                    </div>
                 </div>

                 <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 flex items-start space-x-5 group hover:border-orange-400 transition-all">
                    <div className="bg-orange-50 p-4 rounded-2xl text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all shadow-inner">
                       <MapPin className="w-7 h-7" />
                    </div>
                    <div>
                       <h3 className="font-black text-slate-800 text-lg italic tracking-tight">Office</h3>
                       <p className="text-sm text-slate-500 mt-1 leading-relaxed font-medium">
                          123 Education Hub,<br/>
                          Kota, Rajasthan 324005
                       </p>
                    </div>
                 </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2 bg-white rounded-[4rem] shadow-2xl border border-slate-200 p-12 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12"><MessageSquare className="w-64 h-64 text-indigo-600" /></div>
                 
                 {submitted ? (
                   <div className="py-20 text-center space-y-8 animate-in zoom-in-95 duration-500">
                      <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                         <CheckCircle className="w-12 h-12" />
                      </div>
                      <div>
                         <h3 className="text-3xl font-black italic tracking-tighter text-slate-900">Message Sent.</h3>
                         <p className="text-slate-500 max-w-sm mx-auto font-medium mt-3 leading-relaxed">Our support hub has received your transmission. We typically respond within 120 minutes.</p>
                      </div>
                      <button onClick={() => setSubmitted(false)} className="bg-indigo-600 text-white px-10 py-4 rounded-[2rem] font-black uppercase text-[10px] tracking-widest hover:bg-slate-900 transition-all shadow-xl">New Inquiry</button>
                   </div>
                 ) : (
                   <>
                    <h2 className="text-3xl font-black text-slate-900 mb-10 flex items-center italic tracking-tight">
                        <MessageSquare className="w-8 h-8 mr-4 text-indigo-600" /> Send us a Message
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="space-y-2">
                              <label htmlFor="name" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Full Identity</label>
                              <input 
                                id="name"
                                type="text" 
                                required
                                className="w-full p-5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none text-sm font-black text-slate-800 transition-all shadow-inner"
                                placeholder="Aryan Sharma"
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                              />
                           </div>
                           <div className="space-y-2">
                              <label htmlFor="email" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Digital Address</label>
                              <input 
                                id="email"
                                type="email" 
                                required
                                className="w-full p-5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none text-sm font-black text-slate-800 transition-all shadow-inner"
                                placeholder="aryan@iit.ac.in"
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                              />
                           </div>
                        </div>

                        <div className="space-y-2">
                           <label htmlFor="subject" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Communication Subject</label>
                           <input 
                             id="subject"
                             type="text" 
                             required
                             className="w-full p-5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none text-sm font-black text-slate-800 transition-all shadow-inner"
                             placeholder="How can our engineers assist you?"
                             value={formData.subject}
                             onChange={e => setFormData({...formData, subject: e.target.value})}
                           />
                        </div>

                        <div className="space-y-2">
                           <label htmlFor="message" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Detailed Inquiry</label>
                           <textarea 
                             id="message"
                             required
                             className="w-full p-8 bg-slate-50 border-none rounded-[2.5rem] focus:ring-4 focus:ring-indigo-100 outline-none h-48 resize-none text-sm font-medium text-slate-700 transition-all shadow-inner leading-relaxed"
                             placeholder="State your query with precision..."
                             value={formData.message}
                             onChange={e => setFormData({...formData, message: e.target.value})}
                           />
                        </div>

                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full bg-indigo-600 text-white py-6 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.4em] shadow-2xl shadow-indigo-100 hover:bg-slate-900 transition-all flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                        >
                            {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Send className="w-5 h-5" /> Execute Transmission</>}
                        </button>
                    </form>
                   </>
                 )}
              </div>
           </div>
       </div>
    </div>
  );
};

export default ContactModule;
