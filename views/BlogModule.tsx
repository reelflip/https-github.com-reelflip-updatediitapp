
import React, { useState } from 'react';
import { StudentData, Blog } from '../types';
import { 
  Calendar, ArrowLeft, Share2, Bookmark, Clock, Sparkles, 
  ChevronRight, Search, TrendingUp, Zap, Newspaper, 
  Terminal, Rocket, ShieldCheck, Activity, Target, Brain, Cpu
} from 'lucide-react';

interface BlogModuleProps {
  data: StudentData;
}

const BlogModule: React.FC<BlogModuleProps> = ({ data }) => {
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'EXAM' | 'STRATEGY' | 'TECH'>('ALL');

  const blogs = (data.blogs || []).filter(b => b.status === 'PUBLISHED').map(b => {
    let cat: 'EXAM' | 'STRATEGY' | 'TECH' = 'STRATEGY';
    if (b.title.toLowerCase().includes('exam') || b.title.toLowerCase().includes('jee')) cat = 'EXAM';
    if (b.title.toLowerCase().includes('system') || b.title.toLowerCase().includes('sync')) cat = 'TECH';
    return { ...b, category: cat };
  });

  const filteredBlogs = blogs.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = activeCategory === 'ALL' || b.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = (content || '').split(/\s+/g).length;
    return `${Math.ceil(wordCount / wordsPerMinute)} MIN`;
  };

  if (selectedBlog) {
    const blog = selectedBlog;
    return (
      <div className="bg-white min-h-screen text-slate-900 pt-10 md:pt-20 px-4 md:px-6 max-w-5xl mx-auto space-y-12 animate-in slide-in-from-bottom-8 duration-700 pb-40">
        <button 
          onClick={() => setSelectedBlog(null)}
          className="flex items-center gap-4 text-slate-400 hover:text-indigo-600 font-black text-[10px] uppercase tracking-[0.4em] transition-all group"
        >
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-2" /> Back to Archive
        </button>

        <article className="space-y-12 md:space-y-16">
          <div className="space-y-8">
            <div className="flex gap-3">
               <span className="bg-indigo-600 text-white px-4 py-1.5 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100">Editorial Journal</span>
               <span className="bg-slate-50 text-slate-400 px-4 py-1.5 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest border border-slate-100">{calculateReadTime(blog.content)} Read</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[1.05] uppercase italic font-space">{blog.title}</h1>
            
            <div className="flex flex-wrap items-center justify-between gap-6 py-10 border-y border-slate-100">
               <div className="flex items-center gap-6">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
                     <Terminal className="w-6 h-6 md:w-8 md:h-8" />
                  </div>
                  <div>
                    <div className="text-lg font-black text-slate-800 tracking-tight uppercase italic leading-none">{blog.author}</div>
                    <div className="text-[9px] text-slate-400 font-black uppercase tracking-[0.4em] mt-2">{blog.date} • Verified Academic Insight</div>
                  </div>
               </div>
               <div className="flex gap-3">
                  <button className="p-3 bg-white text-slate-400 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-slate-100"><Share2 className="w-4 h-4" /></button>
                  <button className="p-3 bg-white text-slate-400 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all border border-slate-100"><Bookmark className="w-4 h-4" /></button>
               </div>
            </div>
          </div>

          <div 
            className="prose prose-slate max-w-none prose-p:text-slate-600 prose-p:text-lg md:prose-p:text-xl prose-p:leading-relaxed prose-headings:font-black prose-headings:tracking-tighter prose-headings:italic prose-strong:text-indigo-600 font-medium"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </article>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen text-slate-900 pt-10 md:pt-20 px-4 md:px-6 max-w-7xl mx-auto space-y-12 md:space-y-20 animate-in fade-in duration-1000 pb-40">
      
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-3 bg-indigo-50 border border-indigo-100 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600">
            <Rocket className="w-4 h-4" /> Official Solaris Journal
          </div>
          <h2 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter italic leading-[0.85] uppercase font-space">THE <br /> <span className="text-indigo-600">INSIGHTS.</span></h2>
          <p className="text-slate-500 text-lg md:text-xl font-medium max-w-xl leading-relaxed italic">Strategic bulletins, psychological protocols, and exam patterns from the Solaris editorial board.</p>
        </div>
        
        <div className="w-full lg:w-[400px] space-y-6">
           <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Search articles..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 placeholder:text-slate-300 focus:bg-white focus:border-indigo-600 shadow-inner transition-all outline-none"
              />
           </div>
           <div className="flex gap-2 p-1 bg-slate-50 rounded-xl border border-slate-100">
              {[
                { id: 'ALL', label: 'ALL', icon: Activity },
                { id: 'EXAM', label: 'EXAM', icon: Target },
                { id: 'STRATEGY', label: 'STRAT', icon: Brain },
                { id: 'TECH', label: 'SYS', icon: Cpu }
              ].map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as any)}
                  className={`flex-1 py-2 rounded-lg text-[8px] font-black tracking-widest flex items-center justify-center gap-2 transition-all ${activeCategory === cat.id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-700'}`}
                >
                  <cat.icon className="w-3 h-3" /> {cat.label}
                </button>
              ))}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        {filteredBlogs.length === 0 ? (
          <div className="col-span-full py-32 text-center bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-100 flex flex-col items-center gap-6">
             <ShieldCheck className="w-12 h-12 text-slate-200" />
             <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.4em] italic">No publications detected in this sector.</p>
          </div>
        ) : (
          filteredBlogs.map((blog) => (
            <div 
              key={blog.id} 
              onClick={() => setSelectedBlog(blog)}
              className="group bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-sm hover:border-indigo-600/40 transition-all cursor-pointer flex flex-col h-full hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="h-56 md:h-64 bg-slate-50 relative overflow-hidden p-10 flex items-center justify-center border-b border-slate-50">
                 <div className="absolute inset-0 bg-indigo-600/5 group-hover:scale-110 transition-transform duration-[3s]"></div>
                 {blog.category === 'EXAM' ? <Target className="w-16 h-16 text-slate-200 group-hover:text-rose-500/20 transition-colors" /> : 
                  blog.category === 'TECH' ? <Cpu className="w-16 h-16 text-slate-200 group-hover:text-emerald-500/20 transition-colors" /> :
                  <Zap className="w-16 h-16 text-slate-200 group-hover:text-indigo-500/20 transition-colors" />}
                 <div className="absolute top-8 left-8">
                    <span className={`px-4 py-1.5 border text-[8px] font-black uppercase tracking-widest rounded-lg ${
                      blog.category === 'EXAM' ? 'bg-rose-50 border-rose-100 text-rose-500' :
                      blog.category === 'TECH' ? 'bg-emerald-50 border-emerald-100 text-emerald-500' :
                      'bg-indigo-50 border-indigo-100 text-indigo-500'
                    }`}>{blog.category}</span>
                 </div>
              </div>
              <div className="p-8 md:p-10 space-y-6 md:space-y-8 flex-1 flex flex-col">
                <div className="flex items-center gap-4 text-[8px] md:text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">
                  <Calendar className="w-4 h-4" /> {blog.date}
                  <div className="w-1 h-1 bg-slate-100 rounded-full"></div>
                  <Clock className="w-4 h-4" /> {calculateReadTime(blog.content)}
                </div>
                <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tighter group-hover:text-indigo-600 transition-colors leading-tight italic uppercase line-clamp-2">{blog.title}</h3>
                <div className="pt-6 md:pt-8 mt-auto border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black border border-slate-200">{blog.author[0]}</div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{blog.author}</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 text-slate-300 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        
        <div className="bg-slate-900 p-10 md:p-12 rounded-[3rem] text-white space-y-8 flex flex-col justify-center relative overflow-hidden shadow-2xl border border-slate-800 group min-h-[400px]">
           <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12 scale-150 group-hover:rotate-45 transition-transform duration-[4s]"><TrendingUp className="w-48 h-48 text-indigo-400" /></div>
           <div className="space-y-4 relative z-10">
              <h4 className="text-3xl md:text-4xl font-black italic tracking-tighter leading-[0.9] uppercase text-indigo-400">Join the <br /> Ecosystem.</h4>
              <p className="text-slate-400 text-sm font-medium leading-relaxed italic">Access personalized analytics and deeper strategic journals by initializing your student node.</p>
           </div>
           <div className="relative z-10 pt-4">
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'login' }))}
                className="bg-indigo-600 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-3"
              >
                Access Portal <ChevronRight className="w-4 h-4" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BlogModule;
