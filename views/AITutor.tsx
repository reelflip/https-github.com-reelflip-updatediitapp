
import React, { useState, useRef, useEffect } from 'react';
import { StudentData } from '../types';
import { chatWithTutor } from '../services/intelligenceService';
import { Send, Bot, User, Sparkles, Loader2, Cpu } from 'lucide-react';

interface Message {
  role: 'bot' | 'user';
  text: string;
}

interface AITutorProps {
  data: StudentData;
}

const AITutor: React.FC<AITutorProps> = ({ data }) => {
  const modelNames: Record<string, string> = {
    'solaris-core': 'Solaris Heuristic',
    'gpt-4o-edu': 'GPT-4o Academic',
    'claude-3-stu': 'Claude 3 Student',
    'gemini-flash-base': 'Gemini 2.0 Flash',
    'deepseek-coder': 'DeepSeek Numeric',
    'iit-pulse': 'IIT-Pulse Engine'
  };

  const [activeModelId, setActiveModelId] = useState('solaris-core');

  useEffect(() => {
    const globalModel = localStorage.getItem('jeepro_platform_ai_model');
    if (globalModel) setActiveModelId(globalModel);
    else if (data.aiTutorModel) setActiveModelId(data.aiTutorModel);
  }, [data.aiTutorModel]);

  const activeModelName = modelNames[activeModelId] || 'Solaris Core';

  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: `Hello ${data.name}! I'm your IITGEE-PRO Doubt Assistant. I'm currently running on the **${activeModelName}** engine. How can I help you understand a concept today?` }
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

    const botReply = await chatWithTutor([], userMsg, activeModelId);
    setMessages(prev => [...prev, { role: 'bot', text: botReply || 'Connection lost. Please try again.' }]);
    setIsLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-160px)] flex flex-col bg-white rounded-[4rem] border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in duration-700">
      <div className="p-8 bg-slate-900 text-white flex items-center justify-between shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5"><Cpu className="w-32 h-32" /></div>
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center shadow-2xl border border-white/10">
            <Bot className="w-8 h-8" />
          </div>
          <div>
            <h2 className="font-black italic text-2xl tracking-tight leading-none uppercase">Doubt <span className="text-indigo-400">Assistant.</span></h2>
            <div className="text-[10px] uppercase font-black text-indigo-400 tracking-[0.3em] mt-2">
               Engine: {activeModelName} • Secure Connection
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6 relative z-10">
           <div className="hidden md:flex flex-col items-end">
              <div className="text-[10px] font-black uppercase text-slate-500">Service Status</div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div><span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Operational</span></div>
           </div>
           <Sparkles className="w-6 h-6 text-indigo-400" />
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-10 bg-[#fdfdfd] custom-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}>
            <div className={`flex gap-6 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${m.role === 'bot' ? 'bg-white text-indigo-600 border border-slate-100' : 'bg-slate-800 text-white'}`}>
                {m.role === 'bot' ? <Bot className="w-7 h-7" /> : <User className="w-7 h-7" />}
              </div>
              <div className={`p-8 rounded-[2.5rem] text-base leading-relaxed font-bold shadow-sm whitespace-pre-wrap ${
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
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-lg"><Loader2 className="w-6 h-6 text-indigo-600 animate-spin" /></div>
              <div className="p-8 bg-indigo-50/50 border border-indigo-100 rounded-[2.5rem] rounded-tl-none text-indigo-400 text-[10px] font-black uppercase tracking-widest italic flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping"></div>
                Analyzing Technical Query...
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-8 bg-white border-t border-slate-100 relative z-10">
        <div className="flex gap-4 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Ask ${activeModelName} about any technical concept...`}
            className="flex-1 bg-slate-50 border-none rounded-[2rem] px-8 py-5 text-sm font-black text-slate-800 focus:ring-4 focus:ring-indigo-100 transition-all shadow-inner"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading}
            className="w-16 h-16 bg-indigo-600 text-white rounded-[2rem] flex items-center justify-center hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-100 hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <Send className="w-7 h-7" />
          </button>
        </div>
      </div>
      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f5f9; border-radius: 10px; }`}</style>
    </div>
  );
};

export default AITutor;
