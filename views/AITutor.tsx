
import React, { useState, useRef, useEffect } from 'react';
import { StudentData } from '../types';
import { chatWithTutor, MODEL_CONFIGS } from '../services/intelligenceService';
import { Send, Bot, User, Loader2, Cpu, ShieldCheck } from 'lucide-react';

interface Message {
  role: 'bot' | 'user';
  text: string;
}

interface AITutorProps {
  data: StudentData;
}

const AITutor: React.FC<AITutorProps> = ({ data }) => {
  // Always use the model selected in Admin (localStorage)
  const [activeModelId, setActiveModelId] = useState('gemini-3-flash');

  useEffect(() => {
    const syncModel = () => {
      const globalModel = localStorage.getItem('jeepro_platform_ai_model');
      if (globalModel) setActiveModelId(globalModel);
    };
    
    syncModel();
    // Also listen for potential changes
    const interval = setInterval(syncModel, 2000);
    return () => clearInterval(interval);
  }, []);

  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: `Hello ${data.name}! Academic assistant active. I'm your integrated AI tutor. How can I assist your prep today?` }
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
    setMessages(prev => [...prev, { role: 'bot', text: botReply }]);
    setIsLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-140px)] flex flex-col bg-[#fcfdfe] rounded-[3.5rem] border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in duration-700">
      
      {/* HEADER SECTION */}
      <div className="p-8 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-black italic text-xl tracking-tight text-slate-900 leading-none uppercase">Solaris <span className="text-indigo-600">Intelligence.</span></h2>
            <div className="flex items-center gap-2 mt-1.5">
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                 Active Engine: {MODEL_CONFIGS[activeModelId]?.name || "Standard Core"}
               </span>
               <div className="w-1 h-1 rounded-full bg-slate-200"></div>
               <div className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div><span className="text-[9px] font-black uppercase text-emerald-600">Sync Active</span></div>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
           <div className="hidden md:flex items-center gap-3 px-6 py-2.5 bg-slate-50 rounded-xl border border-slate-100 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span className="text-[9px] font-black uppercase tracking-widest">AIR-1 Priority Handshake</span>
           </div>
        </div>
      </div>

      {/* CHAT DISPLAY - Redesigned to match image bubbles */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-12 bg-white custom-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-3 animate-in fade-in duration-300`}>
            {m.role === 'bot' && (
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-md mb-2 shrink-0">
                <Bot className="w-5 h-5 text-indigo-600" />
              </div>
            )}
            
            <div className={`p-8 rounded-[2.5rem] text-sm leading-relaxed font-bold shadow-sm max-w-[70%] whitespace-pre-wrap ${
              m.role === 'user' 
              ? 'bg-[#4f46e5] text-white rounded-br-none' 
              : 'bg-[#f8fafc] text-slate-800 border border-slate-100 rounded-bl-none'
            }`}>
              {m.text}
            </div>

            {m.role === 'user' && (
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-md mb-2 shrink-0">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start items-end gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-md mb-2 shrink-0">
              <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
            </div>
            <div className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] rounded-bl-none text-indigo-400 text-[9px] font-black uppercase tracking-widest italic flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping"></div>
              Processing cognitive input...
            </div>
          </div>
        )}
      </div>

      {/* INPUT AREA */}
      <div className="p-8 bg-white border-t border-slate-50 relative z-10 shrink-0">
        <div className="flex gap-4 max-w-5xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Ask ${MODEL_CONFIGS[activeModelId]?.name || 'Solaris'} about any concept...`}
            className="flex-1 bg-slate-50 border-none rounded-2xl px-8 py-5 text-sm font-black text-slate-800 focus:ring-4 focus:ring-indigo-100 transition-all shadow-inner outline-none"
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
