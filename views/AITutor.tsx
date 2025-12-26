
import React, { useState, useRef, useEffect } from 'react';
import { StudentData } from '../types';
import { chatWithTutor, MODEL_CONFIGS } from '../services/intelligenceService';
import { Send, Bot, User, Sparkles, Loader2, Cpu, Settings2, X, Check, ShieldCheck } from 'lucide-react';

interface Message {
  role: 'bot' | 'user';
  text: string;
}

interface AITutorProps {
  data: StudentData;
}

const AITutor: React.FC<AITutorProps> = ({ data }) => {
  const [activeModelId, setActiveModelId] = useState('gemini-flash');

  useEffect(() => {
    // Priority: Local Storage (Admin override) -> Student Context -> Default
    const globalModel = localStorage.getItem('jeepro_platform_ai_model');
    if (globalModel) setActiveModelId(globalModel);
    else if (data.aiTutorModel) setActiveModelId(data.aiTutorModel);
  }, [data.aiTutorModel]);

  // For students, we use a generic naming convention
  const displayName = "Solaris Intelligence";
  const displayTrait = "Advanced Academic Node";

  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: `Hello ${data.name}! Academic link established. I'm your integrated AI tutor. How can I assist your prep today?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const botReply = await chatWithTutor([], userMsg, activeModelId, data);
    setMessages(prev => [...prev, { role: 'bot', text: botReply || 'Link unstable. Please try again.' }]);
    setIsLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-140px)] flex flex-col bg-white rounded-[3.5rem] border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in duration-700">
      
      {/* HEADER SECTION (Simplified for Students) */}
      <div className="p-8 bg-slate-900 text-white flex items-center justify-between shadow-xl relative overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 p-8 opacity-5"><Cpu className="w-32 h-32" /></div>
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl border border-white/10">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <h2 className="font-black italic text-xl tracking-tight leading-none uppercase">Central <span className="text-indigo-400">Intelligence.</span></h2>
            <div className="flex items-center gap-2 mt-2">
               <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">{displayName}</span>
               <div className="w-1 h-1 rounded-full bg-slate-700"></div>
               <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div><span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Operational</span></div>
            </div>
          </div>
        </div>
        <div className="px-6 py-3 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3 relative z-10 opacity-50 cursor-default">
           <ShieldCheck className="w-4 h-4 text-indigo-400" />
           <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Locked by Admin</span>
        </div>
      </div>

      {/* CHAT DISPLAY */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-10 bg-[#fafbfc] custom-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}>
            <div className={`flex gap-6 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${m.role === 'bot' ? 'bg-white text-indigo-600 border border-slate-100' : 'bg-slate-800 text-white'}`}>
                {m.role === 'bot' ? <Bot className="w-6 h-6" /> : <User className="w-6 h-6" />}
              </div>
              <div className={`p-8 rounded-[2.5rem] text-sm leading-relaxed font-bold shadow-sm whitespace-pre-wrap ${
                m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
              }`}>
                {m.text}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-6">
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-lg"><Loader2 className="w-5 h-5 text-indigo-600 animate-spin" /></div>
              <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] rounded-tl-none text-indigo-400 text-[9px] font-black uppercase tracking-widest italic flex items-center gap-3">
                <div className="w-1 h-1 bg-indigo-400 rounded-full animate-ping"></div>
                Computing response...
              </div>
            </div>
          </div>
        )}
      </div>

      {/* INPUT AREA */}
      <div className="p-8 bg-white border-t border-slate-100 relative z-10 shrink-0">
        <div className="flex gap-4 max-w-5xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Ask Solaris about Physics, Math or Strategy...`}
            className="flex-1 bg-slate-50 border-none rounded-2xl px-8 py-5 text-sm font-black text-slate-800 focus:ring-4 focus:ring-indigo-100 transition-all shadow-inner"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading}
            className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-100 hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }`}</style>
    </div>
  );
};

export default AITutor;
