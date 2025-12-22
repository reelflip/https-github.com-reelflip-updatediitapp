
import React, { useState } from 'react';
import { StudentData, Flashcard } from '../types';
import { Zap, RotateCcw, ChevronRight, Check, X, Info } from 'lucide-react';

interface FlashcardsModuleProps {
  data: StudentData;
}

const FlashcardsModule: React.FC<FlashcardsModuleProps> = ({ data }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  const cards = data.flashcards;

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIdx < cards.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setSessionCompleted(true);
    }
  };

  const currentCard = cards[currentIdx];

  if (sessionCompleted) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center p-8 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-2xl mx-auto">
        <div className="bg-emerald-100 text-emerald-600 p-4 rounded-full mb-6">
          <Zap className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Revision Session Complete!</h2>
        <p className="text-slate-500 mb-8">You've successfully reviewed all due cards. Your mastery level has been updated.</p>
        <button 
          onClick={() => { setSessionCompleted(false); setCurrentIdx(0); }}
          className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          Review Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Spaced Revision Engine</h2>
          <p className="text-sm text-slate-500">Mastery through active recall & timed intervals.</p>
        </div>
        <div className="text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100">
          Card {currentIdx + 1} of {cards.length}
        </div>
      </div>

      {/* Flashcard Component */}
      <div className="perspective-1000">
        <div 
          onClick={() => setIsFlipped(!isFlipped)}
          className={`relative w-full h-80 transition-all duration-500 cursor-pointer preserve-3d shadow-xl rounded-3xl ${isFlipped ? 'rotate-y-180' : ''}`}
        >
          {/* Front */}
          <div className="absolute inset-0 bg-white p-12 backface-hidden rounded-3xl flex flex-col items-center justify-center border border-slate-200">
             <div className="absolute top-6 left-8 flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <Info className="w-4 h-4" />
                {currentCard.type} • {currentCard.difficulty}
             </div>
             <p className="text-2xl font-medium text-center text-slate-800 leading-relaxed">
               {currentCard.question}
             </p>
             <div className="absolute bottom-8 text-xs text-indigo-500 font-bold animate-pulse">
                Click to reveal answer
             </div>
          </div>

          {/* Back */}
          <div className="absolute inset-0 bg-indigo-600 p-12 backface-hidden rotate-y-180 rounded-3xl flex flex-col items-center justify-center text-white border border-indigo-500">
             <p className="text-2xl font-bold text-center">
               {currentCard.answer}
             </p>
             <div className="absolute bottom-8 text-xs text-indigo-200 uppercase tracking-widest font-bold">
                Mastery Result
             </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        <button 
          onClick={handleNext}
          className="flex-1 max-w-[140px] flex flex-col items-center gap-2 p-4 bg-white border border-slate-200 rounded-2xl hover:bg-red-50 hover:border-red-200 transition-all group"
        >
          <X className="w-8 h-8 text-slate-300 group-hover:text-red-500" />
          <span className="text-xs font-bold text-slate-500">Still Struggling</span>
        </button>
        <button 
          onClick={handleNext}
          className="flex-1 max-w-[140px] flex flex-col items-center gap-2 p-4 bg-white border border-slate-200 rounded-2xl hover:bg-amber-50 hover:border-amber-200 transition-all group"
        >
          <div className="w-8 h-8 flex items-center justify-center text-slate-300 font-bold text-xl group-hover:text-amber-500">~</div>
          <span className="text-xs font-bold text-slate-500">Partial Recall</span>
        </button>
        <button 
          onClick={handleNext}
          className="flex-1 max-w-[140px] flex flex-col items-center gap-2 p-4 bg-white border border-slate-200 rounded-2xl hover:bg-emerald-50 hover:border-emerald-200 transition-all group"
        >
          <Check className="w-8 h-8 text-slate-300 group-hover:text-emerald-500" />
          <span className="text-xs font-bold text-slate-500">Mastered It</span>
        </button>
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
