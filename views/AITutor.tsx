
import React, { useState, useRef, useEffect } from 'react';
import { StudentData } from '../types';
import { chatWithTutor } from '../services/geminiService';
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
    { role: 'bot', text: `Hello ${data.name}! I'm your JEE-PRO AI Tutor. Need help with a tricky Physics derivation or a Chemistry reaction today?` }
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

    const botReply = await chatWithTutor([], userMsg, data.aiTutorModel || 'gemini-3-flash-preview');
    setMessages(prev => [...prev, { role: 'bot', text: botReply || 'Thinking...' }]);
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-160px)] flex flex-col bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 bg-indigo-600 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold">AI Tutor</h2>
            <div className="text-[10px] uppercase font-bold text-indigo-200">Active Node: {data.aiTutorModel?.split('-').slice(0, 2).join(' ') || 'Gemini Flash'}</div>
          </div>
        </div>
        <Sparkles className="w-5 h-5 text-indigo-300" />
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[80%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${m.role === 'bot' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-800 text-white'}`}>
                {m.role === 'bot' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
              }`}>
                {m.text}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
              </div>
              <div className="p-4 bg-white border border-slate-100 rounded-2xl rounded-tl-none text-slate-400 text-sm italic">
                {data.aiTutorModel?.includes('pro') ? 'Analyzing via Pro reasoning node...' : 'Analyzing your query...'}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-white border-t border-slate-100">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Explain quantum mechanics like I'm 5..."
            className="flex-1 bg-slate-100 border-none rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-indigo-500"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading}
            className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-700 transition-all disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AITutor;
