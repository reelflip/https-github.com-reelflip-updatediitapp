
import React, { useState } from 'react';
import { StudentData, Blog } from '../types';
import { BookOpen, Calendar, User, ArrowLeft, Share2, Bookmark, Clock, Sparkles, ChevronRight, Search, TrendingUp } from 'lucide-react';

interface BlogModuleProps {
  data: StudentData;
}

const BlogModule: React.FC<BlogModuleProps> = ({ data }) => {
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [activeCategory, setActiveCategory] = useState('All Articles');

  const categories = ['All Articles', 'JEE Strategy', 'Physics Insights', 'Chemistry Lab', 'Math Shortcuts', 'Wellness'];

  if (selectedBlog) {
    return (
      <div className="max-w-4xl mx-auto space-y-12 animate-in slide-in-from-bottom-8 duration-500 pb-32">
        <button 
          onClick={() => setSelectedBlog(null)}
          className="flex items-center gap-3 text-slate-500 hover:text-indigo-600 font-black text-xs uppercase tracking-widest transition-all group"
        >
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" /> Back to Intelligence Hub
        </button>

        <article className="bg-white rounded-[4rem] overflow-hidden border border-slate-200 shadow-2xl">
          <div className="h-[450px] bg-slate-900 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
            <div className="absolute bottom-16 left-16 right-16 space-y-6">
              <div className="flex gap-3">
                 <span className="bg-indigo-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-900/40">Article Deep Dive</span>
                 <span className="bg-white/10 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">7 Min Detailed Read</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-white italic tracking-tighter leading-[0.95] drop-shadow-2xl">{selectedBlog.title}</h1>
            </div>
          </div>

          <div className="p-16 space-y-16">
            <div className="flex flex-wrap items-center justify-between gap-8 pb-10 border-b border-slate-100">
               <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-slate-300">
                     <User className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="text-lg font-black text-slate-900 tracking-tight">{selectedBlog.author}</div>
                    <div className="text-[10px] text-indigo-500 font-black uppercase tracking-[0.2em]">{selectedBlog.date}</div>
                  </div>
               </div>
               <div className="flex gap-4">
                  <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm border border-slate-100"><Share2 className="w-6 h-6" /></button>
                  <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-rose-500 hover:text-white transition-all shadow-sm border border-slate-100"><Bookmark className="w-6 h-6" /></button>
               </div>
            </div>

            <div 
              className="prose prose-slate max-w-none prose-p:text-slate-600 prose-p:text-xl prose-p:leading-relaxed prose-headings:font-black prose-headings:tracking-tighter prose-img:rounded-[3rem] prose-img:shadow-2xl prose-strong:text-slate-900"
              dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
            />
            
            <div className="pt-16 border-t border-slate-100">
               <div className="bg-indigo-50 p-10 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-10">
                  <div className="space-y-3 text-center md:text-left">
                     <h4 className="text-2xl font-black italic text-slate-900 tracking-tight">Enjoyed this strategy?</h4>
                     <p className="text-slate-500 font-medium">Join 12,000+ aspirants receiving weekly tactical reports.</p>
                  </div>
                  <button className="bg-indigo-600 text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-indigo-200">Subscribe Now</button>
               </div>
            </div>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-16 animate-in fade-in duration-700 pb-32">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-600">
            <Sparkles className="w-3.5 h-3.5" /> Tactics for AIR-1
          </div>
          <h2 className="text-6xl font-black text-slate-900 tracking-tighter italic leading-none">INTELLIGENCE <br /> <span className="text-indigo-600">HUB.</span></h2>
          <p className="text-slate-500 text-lg font-medium max-w-lg leading-relaxed">Deep dives into high-performance study mechanics, subject strategies, and exam day psychological warfare.</p>
        </div>
        
        <div className="w-full lg:w-96 relative group">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
           <input 
            type="text" 
            placeholder="Search articles..." 
            className="w-full pl-14 pr-8 py-5 bg-white border border-slate-200 rounded-[2rem] text-sm font-bold focus:ring-4 focus:ring-indigo-100 shadow-sm transition-all"
           />
        </div>
      </div>

      <nav className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
         {categories.map((cat, i) => (
           <button 
            key={i} 
            onClick={() => setActiveCategory(cat)}
            className={`px-8 py-3.5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all border-2 ${activeCategory === cat ? 'bg-slate-900 border-slate-900 text-white shadow-xl' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
           >
             {cat}
           </button>
         ))}
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {/* Featured Card */}
        <div 
          onClick={() => setSelectedBlog(data.blogs[0])}
          className="lg:col-span-2 group bg-white rounded-[4rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl hover:border-indigo-400 transition-all cursor-pointer flex flex-col md:flex-row min-h-[450px]"
        >
          <div className="md:w-1/2 bg-slate-900 relative overflow-hidden">
             <div className="absolute inset-0 bg-indigo-900 opacity-20 group-hover:scale-110 transition-transform duration-1000"></div>
             <div className="absolute top-10 left-10">
                <span className="bg-indigo-600 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">Masterclass</span>
             </div>
          </div>
          <div className="md:w-1/2 p-12 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <Calendar className="w-4 h-4" /> DEC 20, 2024
                <span>•</span>
                <Clock className="w-4 h-4" /> 12 MIN READ
              </div>
              <h3 className="text-4xl font-black text-slate-900 tracking-tighter italic leading-[0.95] group-hover:text-indigo-600 transition-colors">{data.blogs[0].title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed line-clamp-3 italic">"Standard preparation follows a linear path. Dominant preparation follows an exponential one. Learn how to exploit the science of recall to double your efficiency."</p>
            </div>
            <div className="flex items-center justify-between pt-8 border-t border-slate-50">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-300"><User className="w-5 h-5" /></div>
                  <span className="text-xs font-black text-slate-900 uppercase">By Admin Console</span>
               </div>
               <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all group-hover:rotate-12">
                  <ChevronRight className="w-6 h-6" />
               </div>
            </div>
          </div>
        </div>

        {/* Regular Article Card */}
        {data.blogs.slice(1).map((blog) => (
          <div 
            key={blog.id} 
            onClick={() => setSelectedBlog(blog)}
            className="group bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl hover:border-indigo-400 transition-all cursor-pointer flex flex-col h-full"
          >
            <div className="h-64 bg-slate-900 relative overflow-hidden">
               <div className="absolute inset-0 bg-slate-800 opacity-20 group-hover:scale-110 transition-transform duration-1000"></div>
            </div>
            <div className="p-10 space-y-6 flex-1 flex flex-col">
              <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <Calendar className="w-3.5 h-3.5" /> {blog.date}
                <span>•</span>
                <Clock className="w-3.5 h-3.5" /> 5 MIN
              </div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tighter group-hover:text-indigo-600 transition-colors leading-none italic">{blog.title}</h3>
              <p className="text-sm text-slate-500 font-medium line-clamp-3 leading-relaxed">Master the core concepts of JEE Advanced with our latest deep-dive strategy report. Precision beats volume every time.</p>
              <div className="pt-8 mt-auto border-t border-slate-50 flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">By {blog.author}</span>
                <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-300 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                  <ArrowLeft className="w-6 h-6 rotate-180" />
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Newsletter In-grid Widget */}
        <div className="bg-indigo-950 p-12 rounded-[3rem] text-white space-y-8 flex flex-col justify-center relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12 scale-150"><TrendingUp className="w-48 h-48" /></div>
           <div className="space-y-4 relative z-10">
              <h4 className="text-3xl font-black italic tracking-tighter leading-none">Stay ahead of <br /> the curve.</h4>
              <p className="text-indigo-200 text-sm font-medium leading-relaxed opacity-80">Subscribe for weekly tactical formula flushes and psychological focus hacks.</p>
           </div>
           <div className="space-y-4 relative z-10">
              <input type="email" placeholder="aspirant@iit.ac.in" className="w-full bg-white/10 border-none rounded-2xl p-5 text-sm font-black text-white placeholder-indigo-300/40 focus:ring-4 focus:ring-indigo-500/20" />
              <button className="w-full bg-white text-indigo-950 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] shadow-xl hover:scale-105 transition-all">Establish Uplink</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BlogModule;
