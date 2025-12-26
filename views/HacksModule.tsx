
import React, { useState } from 'react';
import { StudentData } from '../types';
// Added missing Sparkles import from lucide-react
import { Lightbulb, Search, BookOpen, Brain, Zap, Layers, Sparkles } from 'lucide-react';

const HacksModule: React.FC<{ data: StudentData }> = ({ data }) => {
  const [filter, setFilter] = useState<'all' | 'Mnemonics' | 'Shortcuts' | 'Formulas'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Re-bound to live global data
  const hacks = data.memoryHacks;

  const filteredHacks = hacks.filter(h => {
    const matchesFilter = filter === 'all' || h.category === filter;
    const matchesSearch = h.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          h.hack.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic">Mnemonics Vault.</h2>
          <p className="text-slate-500 font-medium">Strategic mental maps for zero-latency recall.</p>
        </div>
        <div className="relative w-full lg:w-96">
           <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
           <input 
            type="text" 
            placeholder="Search vault..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-4 bg-white border border-slate-200 rounded-[1.5rem] text-sm font-bold focus:ring-2 focus:ring-indigo-500 shadow-sm" 
           />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {[
          { id: 'all', label: 'All Artifacts', icon: Layers },
          { id: 'Mnemonics', label: 'Mnemonics', icon: Brain },
          { id: 'Shortcuts', label: 'Logic Shortcuts', icon: Zap },
          { id: 'Formulas', label: 'Formula Recall', icon: BookOpen },
        ].map(cat => (
          <button 
            key={cat.id}
            onClick={() => setFilter(cat.id as any)}
            className={`px-8 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest flex items-center gap-2 whitespace-nowrap transition-all border-2 ${
              filter === cat.id ? 'bg-slate-900 border-slate-900 text-white shadow-xl' : 'bg-white border-slate-200 text-slate-400 hover:border-indigo-400'
            }`}
          >
            <cat.icon className="w-4 h-4" />
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredHacks.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-100 flex flex-col items-center gap-4">
             <Lightbulb className="w-12 h-12 text-slate-200" />
             <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest">No matching artifacts found in local vault.</div>
          </div>
        ) : (
          filteredHacks.map((hack, i) => (
            <div key={hack.id} className="group bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm hover:border-indigo-400 hover:shadow-2xl transition-all cursor-pointer relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8">
                  <Lightbulb className="w-12 h-12 text-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity" />
               </div>
               <div className="mb-6 flex items-center gap-3">
                 <span className={`text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full ${
                   hack.subject === 'Physics' ? 'bg-blue-50 text-blue-600' : 
                   hack.subject === 'Chemistry' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                 }`}>{hack.category}</span>
                 <span className="text-[9px] font-black uppercase text-slate-300 tracking-widest">{hack.subject}</span>
               </div>
               <h4 className="font-black text-2xl text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors tracking-tight italic leading-none">{hack.title}</h4>
               <p className="text-xs text-slate-400 mb-8 font-bold uppercase tracking-widest">{hack.description}</p>
               <div className="bg-slate-950 p-6 rounded-[2rem] border border-white/10 shadow-inner">
                  <p className="text-lg italic text-indigo-300 leading-relaxed font-black tracking-tight">"{hack.hack}"</p>
               </div>
            </div>
          ))
        )}

        <div className="bg-indigo-900 rounded-[3.5rem] p-10 flex flex-col items-center justify-center text-center text-white space-y-6 shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform"><Lightbulb className="w-40 h-40" /></div>
           <div className="w-20 h-20 bg-white/10 rounded-[2rem] flex items-center justify-center backdrop-blur-md border border-white/20">
              <Sparkles className="w-10 h-10 text-indigo-300" />
           </div>
           <div>
              <h4 className="font-black text-2xl italic">Custom Protocol</h4>
              <p className="text-xs text-indigo-200 font-bold uppercase tracking-widest mt-2">Personalize your memory maps.</p>
           </div>
           <button className="bg-white text-indigo-900 px-10 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl">Establish Entry</button>
        </div>
      </div>
    </div>
  );
};

export default HacksModule;
