
import React from 'react';
import { StudentData } from '../types';
import { AlertTriangle, TrendingUp, Search, ArrowRight } from 'lucide-react';

interface MistakesLogProps {
  data: StudentData;
}

const MistakesLog: React.FC<MistakesLogProps> = ({ data }) => {
  const weakChapters = data.chapters.filter(c => c.accuracy < 60);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Mistakes Analysis</h2>
          <p className="text-slate-500">Targeted revision of low-accuracy concepts.</p>
        </div>
        <div className="bg-red-50 text-red-600 px-6 py-3 rounded-2xl border border-red-100 font-bold">
          {weakChapters.length} Critical Weak Zones
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-[10px] uppercase font-bold text-slate-400">Total Errors Logged</div>
          <div className="text-4xl font-black text-slate-800">142</div>
          <div className="flex items-center gap-1 text-xs text-red-500 font-bold">
            <TrendingUp className="w-3 h-3" /> +12% vs last week
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-[10px] uppercase font-bold text-slate-400">Recovery Rate</div>
          <div className="text-4xl font-black text-emerald-600">68%</div>
          <div className="text-xs text-slate-500 font-medium">Concepts successfully corrected</div>
        </div>
        <div className="bg-indigo-600 p-6 rounded-3xl shadow-lg shadow-indigo-100 space-y-4 text-white">
          <h3 className="font-bold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Priority One
          </h3>
          <p className="text-xs text-indigo-100">Math Calculus - Limits shows 45% accuracy. 8 out of 10 errors were calculation-based.</p>
          <button className="w-full bg-white text-indigo-600 py-2 rounded-xl text-xs font-bold hover:bg-indigo-50 transition-colors">
            Start Drill session
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold">Hot Zones (Needs Immediate Review)</h3>
          <div className="relative">
             <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
             <input type="text" placeholder="Search mistakes..." className="pl-10 pr-4 py-2 bg-slate-50 rounded-xl text-xs border-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {weakChapters.map(chapter => (
            <div key={chapter.id} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between hover:bg-slate-50 transition-colors gap-4">
              <div className="flex gap-4 items-center">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  chapter.subject === 'Physics' ? 'bg-blue-100 text-blue-600' : 
                  chapter.subject === 'Chemistry' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                }`}>
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{chapter.subject}</div>
                  <div className="font-bold text-slate-800">{chapter.name}</div>
                  <div className="text-xs text-slate-500">Last mistake identified: Yesterday</div>
                </div>
              </div>

              <div className="flex gap-8 items-center w-full md:w-auto">
                 <div className="text-right">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Accuracy</div>
                    <div className="text-lg font-black text-red-500">{chapter.accuracy}%</div>
                 </div>
                 <button className="bg-slate-100 p-3 rounded-xl hover:bg-indigo-600 hover:text-white transition-all text-slate-400 group">
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                 </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MistakesLog;
