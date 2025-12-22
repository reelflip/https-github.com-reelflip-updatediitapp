
import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Coffee, Zap } from 'lucide-react';

const FocusTimer: React.FC = () => {
  const [seconds, setSeconds] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'study' | 'break'>('study');

  useEffect(() => {
    let interval: any;
    if (isActive && seconds > 0) {
      interval = setInterval(() => setSeconds(s => s - 1), 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.play().catch(() => {});
      alert(mode === 'study' ? 'Time for a break!' : 'Back to work!');
    }
    return () => clearInterval(interval);
  }, [isActive, seconds, mode]);

  const toggle = () => setIsActive(!isActive);
  const reset = () => {
    setIsActive(false);
    setSeconds(mode === 'study' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[60vh] space-y-10">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-slate-900">Focus Mode</h2>
        <p className="text-slate-500">Eliminate distractions and enter a flow state.</p>
      </div>

      <div className="flex gap-4 p-1 bg-slate-200 rounded-2xl w-fit">
        <button 
          onClick={() => { setMode('study'); setSeconds(25 * 60); setIsActive(false); }}
          className={`px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${mode === 'study' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Zap className="w-4 h-4" /> Deep Work
        </button>
        <button 
          onClick={() => { setMode('break'); setSeconds(5 * 60); setIsActive(false); }}
          className={`px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${mode === 'break' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Coffee className="w-4 h-4" /> Short Break
        </button>
      </div>

      <div className="relative w-80 h-80 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle 
            cx="160" cy="160" r="140" fill="transparent" stroke="#e2e8f0" strokeWidth="12"
            style={{ transform: 'translate(0, 0)' }}
          />
          <circle 
            cx="160" cy="160" r="140" fill="transparent" 
            stroke={mode === 'study' ? '#4f46e5' : '#10b981'} 
            strokeWidth="12" strokeDasharray={880}
            strokeDashoffset={880 - (880 * seconds) / (mode === 'study' ? 25 * 60 : 5 * 60)}
            strokeLinecap="round" className="transition-all duration-1000"
          />
        </svg>
        <div className="relative text-7xl font-black text-slate-800 font-mono tracking-tighter">
          {formatTime(seconds)}
        </div>
      </div>

      <div className="flex gap-6">
        <button onClick={reset} className="p-4 bg-white border border-slate-200 rounded-full text-slate-500 hover:text-slate-900 transition-colors shadow-sm">
          <RotateCcw className="w-6 h-6" />
        </button>
        <button onClick={toggle} className={`px-12 py-4 rounded-3xl font-bold text-white shadow-xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3 ${
          isActive ? 'bg-rose-500 shadow-rose-200' : 'bg-indigo-600 shadow-indigo-200'
        }`}>
          {isActive ? <><Pause className="w-6 h-6" /> Pause</> : <><Play className="w-6 h-6" /> Start Session</>}
        </button>
      </div>

      <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl max-w-md text-center">
        <div className="text-amber-600 font-bold text-sm mb-1 uppercase tracking-widest">Focus Hack</div>
        <p className="text-amber-900 text-sm">"The first 10 minutes are the hardest. Push through the 'friction phase' and focus will become automatic."</p>
      </div>
    </div>
  );
};

export default FocusTimer;
