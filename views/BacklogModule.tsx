
import React from 'react';
import { StudentData, BacklogItem, Chapter } from '../types';
import { 
  ListChecks, 
  Calendar, 
  AlertCircle, 
  ArrowRight, 
  Clock, 
  ShieldAlert, 
  Sparkles,
  TrendingUp,
  Tag,
  Check,
  BookOpen
} from 'lucide-react';

interface BacklogModuleProps {
  data: StudentData;
}

const BacklogModule: React.FC<BacklogModuleProps> = ({ data }) => {
  // Combine automated backlogs from chapters and manual backlogs from table
  const automatedBacklogs = data.chapters.filter(c => c.progress < 100);
  const manualBacklogs = data.backlogs;

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      {/* Strategy Header */}
      <div className="bg-slate-900 p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
          <ShieldAlert className="w-64 h-64" />
        </div>
        <div className="relative z-10 space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-rose-600 rounded-2xl flex items-center justify-center shadow-lg">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-4xl font-black tracking-tight">Tactical Backlog Recovery</h2>
              <div className="text-rose-400 text-xs font-black uppercase tracking-widest mt-1">Operational Protocol</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <p className="text-slate-400 font-medium leading-relaxed italic">
                "A backlog isn't a failure of intelligence; it's a failure of scheduling. To clear it, you must stop racing against the present and start negotiating with the past."
              </p>
              <div className="flex gap-4 pt-4">
                 <div className="px-4 py-2 bg-white/10 rounded-xl border border-white/10 text-xs font-bold flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" /> Efficiency-First
                 </div>
                 <div className="px-4 py-2 bg-white/10 rounded-xl border border-white/10 text-xs font-bold flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-400" /> Deadline Driven
                 </div>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 space-y-6">
               <h4 className="text-sm font-black uppercase tracking-widest text-indigo-400">The Eisenhower Strategy</h4>
               <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-500 flex items-center justify-center font-bold shrink-0">H</div>
                    <p className="text-xs text-slate-300"><strong>High Priority:</strong> High-weightage chapters (Calculus, Organic, Mechanics). Clear these during morning peak focus.</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">M</div>
                    <p className="text-xs text-slate-300"><strong>Medium Priority:</strong> Medium-weightage or nearly finished units. Use late afternoon slots.</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Backlog Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <ListChecks className="w-6 h-6 text-indigo-600" />
              Active Debt List
            </h3>
            <button className="text-indigo-600 font-bold text-xs uppercase tracking-widest hover:underline">+ Manual Entry</button>
          </div>

          <div className="space-y-4">
            {manualBacklogs.map(item => (
              <div key={item.id} className="group bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:border-indigo-400 hover:shadow-xl transition-all flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${
                    item.priority === 'High' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {item.priority[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{item.title}</h4>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1">
                        <Tag className="w-3 h-3" /> {item.subject}
                      </span>
                      <span className="text-[10px] font-black uppercase text-rose-500 tracking-widest flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Due {item.deadline}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Fixed: Check icon is now properly imported */}
                <button className="p-3 bg-slate-50 rounded-xl text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <Check className="w-5 h-5" />
                </button>
              </div>
            ))}

            {automatedBacklogs.map(chapter => (
              <div key={chapter.id} className="group bg-white p-6 rounded-[2rem] border border-slate-200 border-l-4 border-l-rose-500 shadow-sm hover:shadow-lg transition-all flex items-center justify-between opacity-80 hover:opacity-100">
                <div className="flex items-center gap-6">
                  {/* Fixed: BookOpen icon is now properly imported */}
                  <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 italic">Syllabus Gap: {chapter.name}</h4>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{chapter.subject}</span>
                      <span className="text-[10px] font-black uppercase text-indigo-500 tracking-widest">{chapter.progress}% Progress</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'learn' }))}
                  className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all"
                >
                  Resume
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
              <h4 className="font-black text-slate-900 flex items-center gap-2 uppercase text-xs tracking-[0.2em]">
                <Clock className="w-4 h-4 text-indigo-600" /> Recovery Timer
              </h4>
              <div className="text-center py-6">
                 <div className="text-5xl font-black text-slate-900 mb-2">00:45:00</div>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Suggested Daily Backlog Sprint</p>
              </div>
              <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-indigo-600 transition-all">
                 Start Sprint Session
              </button>
           </div>

           <div className="bg-indigo-50 p-8 rounded-[2.5rem] border border-indigo-100 space-y-4">
              <Sparkles className="w-8 h-8 text-indigo-600" />
              <h4 className="font-black text-slate-900 leading-tight">Sync-Bot Insight</h4>
              <p className="text-xs text-indigo-700 leading-relaxed">
                "Based on your 2025 target, your Chemistry backlogs in <b>Physical Chemistry</b> are blocking progress in <b>Inorganic</b>. Prioritize 'Redox Reactions' to unlock deeper learning."
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BacklogModule;
