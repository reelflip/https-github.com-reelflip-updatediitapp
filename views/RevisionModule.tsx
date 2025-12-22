
import React from 'react';
import { StudentData } from '../types';
import { RefreshCw, ArrowRight, Zap, AlertCircle } from 'lucide-react';

const RevisionModule: React.FC<{ data: StudentData }> = ({ data }) => {
  const needsRevision = data.chapters.filter(c => c.accuracy < 70 || c.progress < 100);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Strategic Revision</h2>
          <p className="text-slate-500">Beat the forgetting curve with targeted recalls.</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-indigo-50 border border-indigo-100 px-6 py-3 rounded-2xl flex flex-col items-center">
              <span className="text-[10px] uppercase font-bold text-indigo-400">Retention Score</span>
              <span className="text-xl font-black text-indigo-600">82%</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-emerald-600 p-6 rounded-3xl text-white shadow-lg shadow-emerald-100 flex flex-col justify-between h-48">
            <h3 className="font-bold text-lg leading-tight">Quick Recall Sprint</h3>
            <p className="text-xs text-emerald-100 opacity-80">15 minutes focused on high-weightage formulas from Optics.</p>
            <button className="w-fit bg-white text-emerald-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-50">Start Sprint</button>
         </div>
         <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-lg shadow-indigo-100 flex flex-col justify-between h-48">
            <h3 className="font-bold text-lg leading-tight">Error Analysis</h3>
            <p className="text-xs text-indigo-100 opacity-80">Revisit mistakes from yesterday's Practice Test on Integration.</p>
            <button className="w-fit bg-white text-indigo-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-50">Review Errors</button>
         </div>
         <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-lg shadow-slate-100 flex flex-col justify-between h-48">
            <h3 className="font-bold text-lg leading-tight">Weekly Review</h3>
            <p className="text-xs text-slate-400 opacity-80">Comprehensive summary of all 4 subjects from this week.</p>
            <button className="w-fit bg-white text-slate-900 px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-50">View Summary</button>
         </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100">
           <h3 className="font-bold flex items-center gap-2">
             <AlertCircle className="w-5 h-5 text-amber-500" />
             Chapters Aging Out (Last Touched 7+ Days Ago)
           </h3>
        </div>
        <div className="divide-y divide-slate-100">
           {needsRevision.map(chapter => (
             <div key={chapter.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                     chapter.subject === 'Physics' ? 'bg-blue-100 text-blue-600' : 
                     chapter.subject === 'Chemistry' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-700'
                   }`}>
                      <RefreshCw className="w-5 h-5" />
                   </div>
                   <div>
                      <h4 className="font-bold text-slate-800">{chapter.name}</h4>
                      <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{chapter.subject} • Last studied: 8 days ago</div>
                   </div>
                </div>
                
                <div className="flex items-center gap-8">
                   <div className="text-right">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Accuracy Risk</div>
                      <div className="text-lg font-black text-amber-500">{chapter.accuracy}%</div>
                   </div>
                   <button className="p-2 bg-slate-100 rounded-xl hover:bg-indigo-600 hover:text-white transition-all">
                      <ArrowRight className="w-5 h-5" />
                   </button>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default RevisionModule;
