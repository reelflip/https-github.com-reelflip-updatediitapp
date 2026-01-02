
import React, { useState } from 'react';
import { StudentData, Flashcard } from '../types';
import { Zap, RotateCcw, ChevronRight, Check, X, Info, Layers } from 'lucide-react';

interface FlashcardsModuleProps {
  data: StudentData;
}

const FlashcardsModule: React.FC<FlashcardsModuleProps> = ({ data }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  // Buffer: Ensure cards is never undefined or null
  const cards: Flashcard[] = data?.flashcards || [];

  const handleNext = () => {
    if (cards.length === 0) return;
    setIsFlipped(false);
    if (currentIdx < cards.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setSessionCompleted(true);
    }
  };

  // Safe Guard for Empty Deck
  if (cards.length === 0) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center p-12 bg-white rounded-[3rem] border-4 border-dashed border-slate-100 max-w-2xl mx-auto animate-in fade-in">
        <div className="bg-slate-50 text-slate-300 p-8 rounded-[2rem] mb-8 shadow-inner">
          <Layers className="w-16 h-16" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 italic tracking-tight uppercase">Archive Empty.</h2>
        <p className="text-slate-400 mt-4 font-medium italic max-w-xs leading-relaxed">Your personal memory card database is currently offline. Add cards from the Syllabus or Admin Node.</p>
      </div>
    );
  }

  // Safety: Bounds check currentIdx
  const safeIdx = Math.min(currentIdx, cards.length - 1);
  const currentCard = cards[safeIdx];

  if (sessionCompleted) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center p-8 bg-white rounded-[4rem] border border-slate-200 shadow-xl max-w-2xl mx-auto animate-in zoom-in-95">
        <div className="bg-emerald-50 text-emerald-500 p-6 rounded-3xl mb-8 shadow-inner">
          <Zap className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 italic tracking-tight uppercase">Recall Session Complete.</h2>
        <p className="text-slate-500 mt-4 mb-10 font-medium italic">Your active recall metrics have been synchronized with the core engine.</p>
        <button 
          onClick={() => { setSessionCompleted(false); setCurrentIdx(0); }}
          className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center gap-3 shadow-2xl"
        >
          <RotateCcw className="w-5 h-5" /> Re-Initialize Protocol
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-10 pb-20 animate-in fade-in duration-500">
      <div className="flex items-center justify-between px-2">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Memory Cards.</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Spaced Repetition Engine v10.0</p>
        </div>
        <div className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-5 py-2.5 rounded-full border border-indigo-100 shadow-sm">
          CARTRIDGE {safeIdx + 1} / {cards.length}
        </div>
      </div>

      <div className="perspective-1000">
        <div 
          onClick={() => setIsFlipped(!isFlipped)}
          className={`relative w-full h-[400px] transition-all duration-700 cursor-pointer preserve-3d shadow-2xl rounded-[3.5rem] ${isFlipped ? 'rotate-y-180' : ''}`}
        >
          {/* Front */}
          <div className="absolute inset-0 bg-white p-12 backface-hidden rounded-[3.5rem] flex flex-col items-center justify-center border-2 border-slate-100 shadow-inner">
             <div className="absolute top-10 left-10 flex items-center gap-3 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
                <Info className="w-4 h-4" />
                {currentCard.subject} • {currentCard.difficulty}
             </div>
             <div className="text-center space-y-6">
                <div className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.5em] mb-4">Prompt</div>
                <p className="text-3xl font-black text-slate-800 italic tracking-tight leading-snug">
                  {currentCard.question}
                </p>
             </div>
             <div className="absolute bottom-10 text-[9px] text-indigo-500 font-black uppercase tracking-widest animate-pulse border-b border-indigo-100 pb-1">
                Touch to flip artifact
             </div>
          </div>

          {/* Back */}
          <div className="absolute inset-0 bg-slate-900 p-12 backface-hidden rotate-y-180 rounded-[3.5rem] flex flex-col items-center justify-center text-white border-4 border-indigo-600 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-10 opacity-5"><Zap className="w-40 h-40" /></div>
             <div className="text-center space-y-6 relative z-10">
                <div className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.5em] mb-4">Resolution</div>
                <p className="text-4xl font-black italic tracking-tighter text-indigo-100 leading-none">
                  {currentCard.answer}
                </p>
             </div>
             <div className="absolute bottom-10 text-[9px] text-slate-500 font-black uppercase tracking-[0.5em]">
                Verified Concept Node
             </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-6">
        {[
          { label: 'Struggle', icon: X, color: 'rose', bg: 'bg-rose-50', text: 'text-rose-500', border: 'border-rose-100' },
          { label: 'Partial', icon: Info, color: 'amber', bg: 'bg-amber-50', text: 'text-amber-500', border: 'border-amber-100' },
          { label: 'Mastered', icon: Check, color: 'emerald', bg: 'bg-emerald-50', text: 'text-emerald-500', border: 'border-emerald-100' }
        ].map((btn) => (
          <button 
            key={btn.label}
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
            className={`flex-1 max-w-[160px] flex flex-col items-center gap-3 p-6 bg-white border-2 border-slate-100 rounded-[2.5rem] hover:shadow-xl transition-all group ${btn.label === 'Mastered' ? 'hover:border-emerald-400' : btn.label === 'Struggle' ? 'hover:border-rose-400' : 'hover:border-amber-400'}`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${btn.bg} ${btn.text} group-hover:scale-110`}>
              <btn.icon className="w-8 h-8" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-800">{btn.label}</span>
          </button>
        ))}
      </div>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};

export default FlashcardsModule;
