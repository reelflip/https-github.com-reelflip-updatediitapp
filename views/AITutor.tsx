
import React, { useState, useRef, useEffect } from 'react';
import { StudentData } from '../types';
import { chatWithTutor } from '../services/intelligenceService';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';

interface Message {
  role: 'bot' | 'user';
  text: string;
}

interface AITutorProps {
  data: StudentData;
}

const AITutor: React.FC<AITutorProps> = ({ data }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: `Hello ${data.name}! I'm your local JEE-PRO Tactical Bot. I provide advice based on your syllabus data without needing an internet connection. How can I help?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const botReply = await chatWithTutor([], userMsg);
    setMessages(prev => [...prev, { role: 'bot', text: botReply || 'Thinking...' }]);
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-160px)] flex flex-col bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500">
      <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <h2 className="font-black italic text-lg">Tactical Advisor</h2>
            <div className="text-[9px] uppercase font-black text-indigo-400 tracking-widest">Local Heuristic Mode • Offline Secure</div>
          </div>
        </div>
        <Sparkles className="w-5 h-5 text-indigo-400" />
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/50">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-4 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${m.role === 'bot' ? 'bg-white text-indigo-600 border border-indigo-100' : 'bg-slate-800 text-white'}`}>
                {m.role === 'bot' ? <Bot className="w-6 h-6" /> : <User className="w-6 h-6" />}
              </div>
              <div className={`p-5 rounded-[2rem] text-sm leading-relaxed font-medium shadow-sm ${
                m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
              }`}>
                {m.text}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-2xl bg-white border border-indigo-100 flex items-center justify-center shadow-sm">
                <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
              </div>
              <div className="p-5 bg-white/50 border border-slate-100 rounded-[2rem] rounded-tl-none text-slate-400 text-sm italic font-medium">
                Analyzing your trajectory...
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-white border-t border-slate-100">
        <div className="flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about Physics, Chemistry, or your Study Plan..."
            className="flex-1 bg-slate-50 border-none rounded-[1.5rem] px-6 py-4 text-sm font-bold text-slate-800 focus:ring-4 focus:ring-indigo-100 transition-all shadow-inner"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading}
            className="w-14 h-14 bg-indigo-600 text-white rounded-[1.5rem] flex items-center justify-center hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AITutor;
