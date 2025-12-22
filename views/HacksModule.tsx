
import React, { useState } from 'react';
import { StudentData } from '../types';
import { Lightbulb, Search, BookOpen, Brain, Zap, Layers } from 'lucide-react';

const HacksModule: React.FC<{ data: StudentData }> = ({ data }) => {
  const [filter, setFilter] = useState<'all' | 'mnemonics' | 'shortcuts' | 'formulas'>('all');

  const hacks = [
    { title: 'Modern Physics Constants', category: 'mnemonics', text: 'Speed of Light, Planck\'s Constant, etc.', hack: 'Remember "C-P-E-M" for chronological discovery.' },
    { title: 'Integration by Parts', category: 'shortcuts', text: 'Mathematical Calculus shortcuts.', hack: 'The "ILATE" rule for picking U and V functions.' },
    { title: 'Reactivity Series', category: 'mnemonics', text: 'Metals Reactivity in Chemistry.', hack: 'Please Stop Calling Me A Careless Zebra Instead Try Learning How Copper Saves Gold.' },
    { title: 'Circular Motion', category: 'formulas', text: 'Centripetal Force & Acceleration.', hack: 'F = mv²/r — Visualize mass wanting to fly away but string pulling it in.' },
    { title: 'Stoichiometry Steps', category: 'shortcuts', text: 'Fast molar calculations.', hack: 'The "Mole-Tunnel" method — always convert to moles first!' },
  ];

  const filteredHacks = filter === 'all' ? hacks : hacks.filter(h => h.category === filter);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Memory Hacks Vault</h2>
          <p className="text-slate-500">Mnemonics and mental maps for instant recall.</p>
        </div>
        <div className="relative w-full lg:w-96">
           <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
           <input type="text" placeholder="Find a hack (e.g. Periodic Table)..." className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500" />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {[
          { id: 'all', label: 'All Vaults', icon: Layers },
          { id: 'mnemonics', label: 'Mnemonics', icon: Brain },
          { id: 'shortcuts', label: 'Solving Shortcuts', icon: Zap },
          { id: 'formulas', label: 'Key Formulas', icon: BookOpen },
        ].map(cat => (
          <button 
            key={cat.id}
            onClick={() => setFilter(cat.id as any)}
            className={`px-6 py-2.5 rounded-2xl text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all border ${
              filter === cat.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400'
            }`}
          >
            <cat.icon className="w-4 h-4" />
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHacks.map((hack, i) => (
          <div key={i} className="group bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:border-indigo-400 hover:shadow-xl transition-all cursor-pointer relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4">
                <Lightbulb className="w-12 h-12 text-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity" />
             </div>
             <div className="mb-4">
               <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full">{hack.category}</span>
             </div>
             <h4 className="font-bold text-lg text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">{hack.title}</h4>
             <p className="text-xs text-slate-500 mb-6">{hack.text}</p>
             <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-sm italic text-slate-700 leading-relaxed font-medium">"{hack.hack}"</p>
             </div>
          </div>
        ))}

        <div className="bg-indigo-900 rounded-3xl p-8 flex flex-col items-center justify-center text-center text-white space-y-4 shadow-xl">
           <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
              <Lightbulb className="w-8 h-8 text-indigo-300" />
           </div>
           <div>
              <h4 className="font-bold">Add Your Own Hack</h4>
              <p className="text-xs text-indigo-200">Personalized mnemonics stick better than generic ones.</p>
           </div>
           <button className="bg-indigo-500 px-6 py-2 rounded-xl text-xs font-bold hover:bg-indigo-400 transition-colors">Create New</button>
        </div>
      </div>
    </div>
  );
};

export default HacksModule;
