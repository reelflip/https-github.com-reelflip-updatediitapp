
import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Coffee, 
  Zap, 
  Volume2, 
  VolumeX, 
  Music, 
  Sparkles, 
  Target, 
  Brain, 
  Eye, 
  History, 
  ChevronRight,
  Sun,
  X,
  Trophy,
  Activity
} from 'lucide-react';

interface FocusSession {
  id: number;
  mode: string;
  duration: number; // in minutes
  timestamp: string;
}

const FocusTimer: React.FC = () => {
  const modes = [
    { id: 'marathon', label: 'Concept Marathon', duration: 90, desc: 'Deep Theoretical Understanding', icon: Brain, color: 'indigo' },
    { id: 'sprint', label: 'Problem Sprint', duration: 45, desc: 'High-Speed MCQ Practice', icon: Zap, color: 'rose' },
    { id: 'flush', label: 'Formula Flush', duration: 15, desc: 'Active Recall Session', icon: Target, color: 'amber' },
    { id: 'break', label: 'Active Recovery', duration: 10, desc: 'Brain Rejuvenation', icon: Coffee, color: 'emerald' },
  ];

  const atmospheres = [
    { id: 'silence', label: 'Total Silence', icon: VolumeX },
    { id: 'white', label: 'White Noise', icon: Volume2 },
    { id: 'lofi', label: 'Lo-Fi Beats', icon: Music },
  ];

  const recoveryTasks = [
    { label: 'Palming Exercise', desc: 'Cover eyes with palms for 60 seconds to reduce optic nerve strain.', icon: Eye },
    { label: 'Spine Decompression', desc: 'Stand up and reach for the ceiling, then touch your toes.', icon: Activity },
    { label: 'Hydration Cycle', desc: 'Drink 250ml of water and take 5 deep belly breaths.', icon: Sun },
  ];

  const [activeMode, setActiveMode] = useState(modes[1]);
  const [seconds, setSeconds] = useState(activeMode.duration * 60);
  const [isActive, setIsActive] = useState(false);
  const [atmosphere, setAtmosphere] = useState(atmospheres[0]);
  const [history, setHistory] = useState<FocusSession[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isActive && seconds > 0) {
      interval = setInterval(() => setSeconds(s => s - 1), 1000);
    } else if (seconds === 0 && isActive) {
      setIsActive(false);
      completeSession();
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.play().catch(() => {});
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const toggle = () => setIsActive(!isActive);
  
  const reset = () => {
    setIsActive(false);
    setSeconds(activeMode.duration * 60);
  };

  const changeMode = (mode: typeof modes[0]) => {
    setActiveMode(mode);
    setSeconds(mode.duration * 60);
    setIsActive(false);
  };

  const completeSession = () => {
    const newSession: FocusSession = {
      id: Date.now(),
      mode: activeMode.label,
      duration: activeMode.duration,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setHistory([newSession, ...history.slice(0, 4)]);
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = 1 - (seconds / (activeMode.duration * 60));

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in fade-in duration-700 pb-20">
      {/* Left Column: Controls & Modes */}
      <div className="lg:col-span-4 space-y-8">
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic">Deep Focus.</h2>
          <p className="text-slate-500 font-medium">Tactical intervals for cognitive dominance.</p>
        </div>

        <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
          <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-100 pb-4">JEE Focus Protocols</h4>
          <div className="space-y-4">
            {modes.map(m => (
              <button 
                key={m.id}
                onClick={() => changeMode(m)}
                className={`w-full p-6 rounded-[2.5rem] border-2 transition-all text-left flex items-center gap-5 group ${
                  activeMode.id === m.id ? 'bg-slate-900 border-slate-900 text-white shadow-2xl' : 'bg-white border-slate-50 text-slate-500 hover:border-indigo-100'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                  activeMode.id === m.id ? 'bg-white/10' : 'bg-slate-50 group-hover:bg-indigo-50 group-hover:text-indigo-600'
                }`}>
                  <m.icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-black">{m.label}</div>
                  <div className={`text-[10px] font-bold uppercase tracking-wider ${activeMode.id === m.id ? 'text-slate-400' : 'text-slate-400'}`}>
                    {m.duration} Mins • {m.desc}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100 space-y-6">
           <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Study Atmosphere</h4>
           <div className="flex justify-between gap-2">
             {atmospheres.map(a => (
               <button 
                key={a.id}
                onClick={() => setAtmosphere(a)}
                className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${
                  atmosphere.id === a.id ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-200 hover:border-indigo-400'
                }`}
               >
                 <a.icon className="w-5 h-5" />
                 <span className="text-[9px] font-black uppercase">{a.label}</span>
               </button>
             ))}
           </div>
        </div>
      </div>

      {/* Middle Column: Timer Visualization */}
      <div className="lg:col-span-5 flex flex-col items-center justify-center relative py-12">
        <div className="absolute inset-0 bg-indigo-50/50 blur-[120px] rounded-full scale-75 -z-10"></div>
        
        <div className="relative w-full max-w-sm aspect-square flex items-center justify-center">
          {/* Animated Glow Rings */}
          <div className={`absolute inset-0 rounded-full border border-indigo-100 transition-all duration-1000 ${isActive ? 'scale-110 opacity-100 animate-pulse' : 'scale-100 opacity-50'}`}></div>
          <div className={`absolute inset-4 rounded-full border border-indigo-50 transition-all duration-1000 ${isActive ? 'scale-110 opacity-100 animate-pulse delay-75' : 'scale-100 opacity-50'}`}></div>
          
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle 
              cx="50%" cy="50%" r="46%" 
              fill="transparent" stroke="#f1f5f9" strokeWidth="12" 
            />
            <circle 
              cx="50%" cy="50%" r="46%" 
              fill="transparent" 
              stroke={activeMode.id === 'break' ? '#10b981' : '#6366f1'} 
              strokeWidth="12" 
              strokeDasharray="100 100"
              strokeDashoffset={100 - (progress * 100)}
              pathLength="100"
              strokeLinecap="round" 
              className="transition-all duration-1000"
            />
          </svg>

          <div className="relative flex flex-col items-center text-center space-y-4">
             <div className="text-[10px] font-black uppercase text-slate-400 tracking-[0.4em] mb-2">{activeMode.label}</div>
             <div className="text-8xl font-black text-slate-900 tracking-tighter tabular-nums leading-none">
                {formatTime(seconds)}
             </div>
             {isActive && (
               <div className="flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100 animate-in slide-in-from-bottom-2 duration-500">
                  <Sparkles className="w-3 h-3" />
                  <span className="text-[10px] font-black uppercase tracking-widest">In Flow State</span>
               </div>
             )}
          </div>
        </div>

        <div className="mt-16 flex items-center gap-8">
           <button 
            onClick={reset}
            className="w-16 h-16 bg-white border border-slate-200 rounded-[2rem] flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all shadow-sm"
           >
              <RotateCcw className="w-6 h-6" />
           </button>
           <button 
            onClick={toggle}
            className={`px-16 py-6 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.3em] text-white shadow-2xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-4 ${
              isActive ? 'bg-rose-500 shadow-rose-200' : 'bg-indigo-600 shadow-indigo-200'
            }`}
           >
              {isActive ? <><Pause className="w-6 h-6" /> Pause</> : <><Play className="w-6 h-6" /> Start Focus</>}
           </button>
        </div>
      </div>

      {/* Right Column: Recovery & History */}
      <div className="lg:col-span-3 space-y-8">
        <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl space-y-8 overflow-hidden relative">
           <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12"><Coffee className="w-32 h-32" /></div>
           <div>
              <h4 className="font-black italic text-lg text-emerald-400">Recovery Protocol</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">For your next transition</p>
           </div>
           
           <div className="space-y-6 relative z-10">
              {recoveryTasks.map((task, i) => (
                <div key={i} className="flex gap-4">
                   <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0 border border-white/10">
                      <task.icon className="w-5 h-5 text-emerald-400" />
                   </div>
                   <div>
                      <div className="text-xs font-black">{task.label}</div>
                      <div className="text-[10px] text-slate-400 mt-1 leading-relaxed">{task.desc}</div>
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm space-y-6">
           <div className="flex justify-between items-center">
              <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Recent Successes</h4>
              <History className="w-4 h-4 text-slate-300" />
           </div>
           <div className="space-y-4">
              {history.length > 0 ? history.map(session => (
                <div key={session.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                         <Trophy className="w-4 h-4" />
                      </div>
                      <div>
                         <div className="text-xs font-black text-slate-800">{session.mode}</div>
                         <div className="text-[9px] font-bold text-slate-400 uppercase">{session.timestamp}</div>
                      </div>
                   </div>
                   <div className="text-xs font-black text-indigo-600">+{session.duration}m</div>
                </div>
              )) : (
                <div className="text-center py-8 text-slate-300 text-[10px] font-black uppercase tracking-widest italic border-2 border-dashed border-slate-50 rounded-[2rem]">
                   No sessions logged yet
                </div>
              )}
           </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-8 rounded-[3rem] text-white space-y-4 shadow-xl shadow-indigo-100">
           <Sparkles className="w-8 h-8 text-indigo-200" />
           <h4 className="font-black italic text-lg">Focus Hack</h4>
           <p className="text-xs text-indigo-50 font-medium leading-relaxed italic">
              "The first 12 minutes of a Concept Marathon are the hardest. Push through the 'Liminal Friction' and your brain will release dopamine automatically."
           </p>
        </div>
      </div>
    </div>
  );
};

export default FocusTimer;
