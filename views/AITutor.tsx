
import React, { useState, useRef, useEffect } from 'react';
import { StudentData } from '../types';
import { chatWithTutor, MODEL_CONFIGS } from '../services/intelligenceService';
import { Send, Bot, User, Loader2, ShieldCheck } from 'lucide-react';

interface Message {
  role: 'bot' | 'user';
  text: string;
}

interface AITutorProps {
  data: StudentData;
}

const AITutor: React.FC<AITutorProps> = ({ data }) => {
  const [activeModelId, setActiveModelId] = useState('gemini-3-flash');

  useEffect(() => {
    const syncModel = () => {
      const globalModel = localStorage.getItem('jeepro_platform_ai_model');
      if (globalModel) setActiveModelId(globalModel);
    };
    
    syncModel();
    const interval = setInterval(syncModel, 2000);
    return () => clearInterval(interval);
  }, []);

  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: `Hello ${data.name}. Assistance module online. How can I assist your study session today?` }
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
    <div className="max-w-7xl mx-auto h-[calc(100vh-160px)] md:h-[calc(100vh-140px)] flex flex-col bg-white rounded-3xl md:rounded-[3.5rem] border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in duration-700">
      
      <div className="px-6 py-5 md:p-8 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 md:gap-5">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-50 rounded-xl md:rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
            <Bot className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <h2 className="font-black italic text-base md:text-xl tracking-tight text-slate-900 leading-none uppercase">Solaris <span className="text-indigo-600">Coach.</span></h2>
            <div className="flex items-center gap-2 mt-1 md:mt-1.5">
               <span className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest truncate max-w-[80px] md:max-w-none">
                 {MODEL_CONFIGS[activeModelId]?.name || "Standard"}
               </span>
               <div className="w-1 h-1 rounded-full bg-slate-200"></div>
               <div className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div><span className="text-[8px] md:text-[9px] font-black uppercase text-emerald-600 whitespace-nowrap">Uplink Active</span></div>
            </div>
          </div>
        </div>
        <div className="hidden sm:flex gap-4">
           <div className="flex items-center gap-3 px-4 md:px-6 py-2 md:py-2.5 bg-slate-50 rounded-xl border border-slate-100 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span className="text-[9px] font-black uppercase tracking-widest">Aspirant Priority</span>
           </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-10 space-y-8 md:space-y-12 bg-[#fcfdfe] custom-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2 md:gap-3 animate-in fade-in duration-300`}>
            {m.role === 'bot' && (
              <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center shadow-md mb-2 shrink-0">
                <Bot className="w-4 h-4 text-indigo-600" />
              </div>
            )}
            
            <div className={`p-4 md:p-8 rounded-2xl md:rounded-[2.5rem] text-xs md:text-sm leading-relaxed font-bold shadow-sm max-w-[85%] md:max-w-[70%] whitespace-pre-wrap ${
              m.role === 'user' 
              ? 'bg-[#4f46e5] text-white rounded-br-none' 
              : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'
            }`}>
              {m.text}
            </div>

            {m.role === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center shadow-md mb-2 shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start items-end gap-3">
            <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center shadow-md mb-2 shrink-0">
              <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
            </div>
            <div className="p-4 md:p-8 bg-slate-50 border border-slate-100 rounded-2xl md:rounded-[2.5rem] rounded-bl-none text-indigo-400 text-[8px] md:text-[9px] font-black uppercase tracking-widest italic flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping"></div>
              Processing...
            </div>
          </div>
        )}
      </div>

      <div className="p-4 md:p-8 bg-white border-t border-slate-50 shrink-0">
        <div className="flex gap-3 md:gap-4 max-w-5xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Type academic query...`}
            className="flex-1 bg-slate-50 border-none rounded-xl md:rounded-2xl px-5 md:px-8 py-3 md:py-5 text-sm font-black text-slate-800 focus:ring-4 focus:ring-indigo-100 transition-all shadow-inner outline-none"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading}
            className="w-12 h-12 md:w-16 md:h-16 bg-indigo-600 text-white rounded-xl md:rounded-2xl flex items-center justify-center hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-100 hover:scale-105 active:scale-95 disabled:opacity-50 shrink-0"
          >
            <Send className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AITutor;