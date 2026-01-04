
import React, { useState, useMemo, useEffect } from 'react';
import { StudentData, Blog } from '../types';
import { 
  Calendar, ArrowLeft, Share2, Bookmark, Clock, Sparkles, 
  ChevronRight, Search, TrendingUp, Zap, Newspaper, 
  Terminal, Rocket, ShieldCheck, Activity, Target, Brain, Cpu,
  Eye, MousePointer2, MoveRight, BookMarked, BookmarkCheck
} from 'lucide-react';

interface BlogModuleProps {
  data: StudentData;
}

const BlogModule: React.FC<BlogModuleProps> = ({ data }) => {
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'EXAM' | 'STRATEGY' | 'TECH'>('ALL');
  const [readingProgress, setReadingProgress] = useState(0);

  // Sync Reading Progress
  useEffect(() => {
    const handleScroll = () => {
      if (!selectedBlog) return;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setReadingProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [selectedBlog]);

  const blogs = useMemo(() => (data.blogs || [])
    .filter(b => b.status === 'PUBLISHED')
    .map(b => {
        let cat: 'EXAM' | 'STRATEGY' | 'TECH' = 'STRATEGY';
        const titleLow = b.title.toLowerCase();
        if (titleLow.includes('exam') || titleLow.includes('jee')) cat = 'EXAM';
        if (titleLow.includes('system') || titleLow.includes('sync')) cat = 'TECH';
        return { ...b, category: cat };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [data.blogs]);

  const filteredBlogs = useMemo(() => blogs.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = activeCategory === 'ALL' || b.category === activeCategory;
    return matchesSearch && matchesCat;
  }), [blogs, searchQuery, activeCategory]);

  const featuredBlog = useMemo(() => blogs[0], [blogs]);
  const regularBlogs = useMemo(() => (searchQuery || activeCategory !== 'ALL') ? filteredBlogs : filteredBlogs.filter(b => b.id !== featuredBlog?.id), [filteredBlogs, featuredBlog, searchQuery, activeCategory]);

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = (content || '').split(/\s+/g).length;
    return `${Math.max(1, Math.ceil(wordCount / wordsPerMinute))} MIN`;
  };

  if (selectedBlog) {
    return (
      <div className="min-h-screen bg-white text-slate-900 animate-in fade-in duration-500">
        {/* Reading Progress Bar */}
        <div className="fixed top-0 left-0 w-full h-1.5 z-[100] bg-slate-100">
          <div 
            className="h-full bg-indigo-600 transition-all duration-150 ease-out" 
            style={{ width: `${readingProgress}%` }}
          ></div>
        </div>

        <div className="pt-10 md:pt-20 px-6 max-w-4xl mx-auto space-y-12 pb-40 relative">
          <button 
            onClick={() => { setSelectedBlog(null); window.scrollTo(0,0); }}
            className="flex items-center gap-3 text-slate-400 hover:text-indigo-600 font-black text-[10px] uppercase tracking-[0.4em] transition-all group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-2" /> Back to Intelligence Feed
          </button>

          <article className="space-y-12">
            <header className="space-y-8">
              <div className="flex flex-wrap gap-3">
                 <span className="bg-indigo-600 text-white px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100">Verified Protocol</span>
                 <span className="bg-slate-100 text-slate-500 px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border border-slate-200 flex items-center gap-2">
                    <Clock className="w-3 h-3" /> {calculateReadTime(selectedBlog.content)} Read Time
                 </span>
              </div>
              <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.95] uppercase italic font-space decoration-indigo-600/20 underline underline-offset-8">
                {selectedBlog.title}
              </h1>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 py-12 border-y border-slate-100">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-[#0a1128] rounded-[1.5rem] flex items-center justify-center text-indigo-400 shadow-2xl">
                       <Terminal className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="text-xl font-black text-slate-800 tracking-tight uppercase italic leading-none">{selectedBlog.author}</div>
                      <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.4em] mt-2">{selectedBlog.date} • Core Editorial Branch</div>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <button className="flex items-center gap-3 px-6 py-4 bg-slate-50 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-slate-100">
                      <Share2 className="w-4 h-4" /> Share
                    </button>
                    <button className="p-4 bg-white text-slate-400 rounded-2xl hover:bg-rose-50 hover:text-rose-600 transition-all border border-slate-100">
                      <Bookmark className="w-5 h-5" />
                    </button>
                 </div>
              </div>
            </header>

            <div 
              className="prose prose-slate max-w-none prose-p:text-slate-600 prose-p:text-xl prose-p:leading-[1.8] prose-headings:font-black prose-headings:tracking-tighter prose-headings:italic prose-strong:text-indigo-600 font-medium selection:bg-indigo-100"
              dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
            />

            <footer className="pt-20 mt-20 border-t border-slate-100">
               <div className="bg-[#0a1128] p-12 rounded-[4rem] text-white flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-12 opacity-5"><Zap className="w-64 h-64" /></div>
                  <div className="space-y-4 relative z-10 text-center md:text-left">
                     <h3 className="text-3xl font-black italic tracking-tighter uppercase leading-none">End of Dispatch.</h3>
                     <p className="text-indigo-200 font-medium text-lg italic max-w-sm">Ready to apply these insights to your curriculum metrics?</p>
                  </div>
                  <button 
                    onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'dashboard' }))}
                    className="bg-white text-[#0a1128] px-10 py-5 rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-2xl relative z-10"
                  >
                    Return to Mission Control
                  </button>
               </div>
            </footer>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 pt-10 md:pt-20 px-6 max-w-7xl mx-auto space-y-16 md:space-y-24 animate-in fade-in duration-700 pb-40">
      
      {/* Background Decal */}
      <div className="fixed top-20 right-0 opacity-[0.02] select-none pointer-events-none hidden xl:block">
         <span className="text-[300px] font-black italic tracking-tighter uppercase whitespace-nowrap -rotate-90 origin-top-right">SOLARIS JOURNAL</span>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 relative z-10">
        <div className="space-y-6 flex-1">
          <div className="inline-flex items-center gap-3 bg-indigo-50 border border-indigo-100 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600">
            <Newspaper className="w-4 h-4" /> High-Yield Intelligence
          </div>
          <h2 className="text-6xl md:text-[9rem] font-black text-[#0a1128] tracking-tighter italic leading-[0.8] uppercase font-space">
            DAILY <br /> <span className="text-indigo-600">LOGS.</span>
          </h2>
          <p className="text-slate-400 text-xl md:text-2xl font-medium max-w-2xl leading-relaxed italic border-l-4 border-slate-100 pl-8">
            Strategic bulletins, psychological battle-plans, and emerging exam patterns decrypted for top-tier aspirants.
          </p>
        </div>
        
        <div className="w-full lg:w-[450px] space-y-6">
           <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Search encrypted archives..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-8 py-6 bg-slate-50 border border-slate-200 rounded-[2rem] text-sm font-bold text-slate-800 placeholder:text-slate-300 focus:bg-white focus:border-indigo-600 shadow-inner transition-all outline-none"
              />
           </div>
           <div className="flex gap-2 p-1.5 bg-slate-50 rounded-2xl border border-slate-100">
              {[
                { id: 'ALL', label: 'ALL FILES', icon: Activity },
                { id: 'EXAM', label: 'EXAMS', icon: Target },
                { id: 'STRATEGY', label: 'STRATEGY', icon: Brain },
                { id: 'TECH', label: 'SYSTEM', icon: Cpu }
              ].map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as any)}
                  className={`flex-1 py-3 rounded-xl text-[8px] font-black tracking-widest flex items-center justify-center gap-2 transition-all ${activeCategory === cat.id ? 'bg-[#0a1128] text-white shadow-xl' : 'text-slate-400 hover:text-slate-700'}`}
                >
                  {cat.label}
                </button>
              ))}
           </div>
        </div>
      </div>

      {/* Featured Post (Visible when not searching/filtering) */}
      {!searchQuery && activeCategory === 'ALL' && featuredBlog && (
        <section className="relative z-10">
           <div 
            onClick={() => setSelectedBlog(featuredBlog)}
            className="group bg-[#0a1128] rounded-[4rem] overflow-hidden flex flex-col lg:flex-row cursor-pointer transition-all hover:shadow-[0_50px_100px_-20px_rgba(10,17,40,0.4)]"
           >
              <div className="lg:w-1/2 h-[400px] lg:h-auto bg-slate-900 relative p-12 flex items-center justify-center overflow-hidden">
                 <div className="absolute inset-0 bg-indigo-600/10 mix-blend-overlay group-hover:scale-110 transition-transform duration-[5s]"></div>
                 {featuredBlog.coverImage ? (
                   <img src={featuredBlog.coverImage} className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000" alt="Featured" />
                 ) : (
                   <Zap className="w-48 h-48 text-indigo-500/20 group-hover:scale-110 transition-transform duration-1000" />
                 )}
                 <div className="absolute bottom-10 left-10 flex items-center gap-4 bg-indigo-600 text-white px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl">
                    <Sparkles className="w-4 h-4" /> HIGHLIGHTED DISPATCH
                 </div>
              </div>
              <div className="lg:w-1/2 p-12 md:p-20 flex flex-col justify-center space-y-10">
                 <div className="flex items-center gap-6 text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">
                    <Calendar className="w-4 h-4" /> {featuredBlog.date} 
                    <div className="w-1.5 h-1.5 bg-indigo-500/30 rounded-full"></div>
                    <Clock className="w-4 h-4" /> {calculateReadTime(featuredBlog.content)}
                 </div>
                 <h3 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase leading-[0.95] group-hover:text-indigo-400 transition-colors">
                    {featuredBlog.title}
                 </h3>
                 <p className="text-slate-400 text-lg md:text-xl font-medium italic leading-relaxed line-clamp-3">
                   {featuredBlog.content.replace(/<[^>]*>?/gm, '').substring(0, 240)}...
                 </p>
                 <div className="flex items-center justify-between pt-10 border-t border-white/5">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 font-black text-sm">{featuredBlog.author[0]}</div>
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{featuredBlog.author}</span>
                    </div>
                    <button className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center group-hover:scale-110 group-hover:rotate-45 transition-all shadow-2xl shadow-indigo-600/40">
                       <MoveRight className="w-8 h-8" />
                    </button>
                 </div>
              </div>
           </div>
        </section>
      )}

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 relative z-10">
        {regularBlogs.length === 0 && (searchQuery || activeCategory !== 'ALL') ? (
          <div className="col-span-full py-40 text-center bg-slate-50 rounded-[4rem] border-4 border-dashed border-slate-100 flex flex-col items-center gap-8 animate-in zoom-in-95">
             <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center text-slate-200 shadow-inner">
                <Search className="w-10 h-10" />
             </div>
             <div className="space-y-2">
                <p className="text-2xl font-black text-slate-800 uppercase italic">Encryption: No match found.</p>
                <p className="text-slate-400 font-medium italic">Query result for "{searchQuery}" in Sector "{activeCategory}" is null.</p>
             </div>
             <button 
                onClick={() => { setSearchQuery(''); setActiveCategory('ALL'); }}
                className="bg-[#0a1128] text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all"
             >
                Clear Search Parameters
             </button>
          </div>
        ) : (
          regularBlogs.map((blog) => (
            <div 
              key={blog.id} 
              onClick={() => { setSelectedBlog(blog); window.scrollTo(0,0); }}
              className="group bg-white rounded-[3.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] transition-all cursor-pointer flex flex-col h-full hover:-translate-y-3"
            >
              <div className="h-64 bg-slate-50 relative overflow-hidden border-b border-slate-50">
                 <div className="absolute inset-0 bg-indigo-600/5 group-hover:bg-indigo-600/10 transition-colors"></div>
                 {blog.coverImage ? (
                   <img src={blog.coverImage} alt={blog.title} className="absolute inset-0 w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                 ) : (
                    <div className="h-full w-full flex items-center justify-center opacity-[0.15] group-hover:opacity-40 transition-opacity group-hover:scale-110 duration-700">
                      {blog.category === 'EXAM' ? <Target className="w-24 h-24" /> : 
                       blog.category === 'TECH' ? <Cpu className="w-24 h-24" /> :
                       <Brain className="w-24 h-24" /> }
                    </div>
                 )}
                 <div className="absolute top-8 left-8 flex items-center gap-3">
                    <span className={`px-4 py-1.5 border text-[9px] font-black uppercase tracking-widest rounded-xl backdrop-blur-md ${
                      blog.category === 'EXAM' ? 'bg-rose-50/80 border-rose-100 text-rose-600' :
                      blog.category === 'TECH' ? 'bg-emerald-50/80 border-emerald-100 text-emerald-600' :
                      'bg-indigo-50/80 border-indigo-100 text-indigo-600'
                    }`}>{blog.category}</span>
                 </div>
              </div>

              <div className="p-10 space-y-8 flex-1 flex flex-col">
                <div className="flex items-center gap-5 text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">
                  <span className="flex items-center gap-1.5 text-indigo-400"><Calendar className="w-3.5 h-3.5" /> {blog.date}</span>
                  <div className="w-1 h-1 bg-slate-100 rounded-full"></div>
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {calculateReadTime(blog.content)}</span>
                </div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tighter group-hover:text-indigo-600 transition-colors leading-[1.1] italic uppercase line-clamp-3">
                  {blog.title}
                </h3>
                <div className="pt-8 mt-auto border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all border border-slate-100">
                      {blog.author[0]}
                    </div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-600">{blog.author}</span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 text-slate-300 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner group-hover:scale-110 group-hover:rotate-12">
                    <ChevronRight className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        
        {/* Recruitment Card */}
        <div className="bg-[#0a1128] p-12 rounded-[4rem] text-white flex flex-col justify-center relative overflow-hidden shadow-2xl border border-white/5 group min-h-[450px]">
           <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12 scale-150 group-hover:scale-[1.7] group-hover:rotate-45 transition-transform duration-[6s]">
              <Cpu className="w-64 h-64 text-indigo-400" />
           </div>
           <div className="space-y-6 relative z-10">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-indigo-400 border border-white/10 mb-4">
                 <Zap className="w-7 h-7" />
              </div>
              <h4 className="text-4xl font-black italic tracking-tighter leading-[0.9] uppercase text-white">
                ELITE <br /> <span className="text-indigo-500">NETWORK.</span>
              </h4>
              <p className="text-slate-400 text-lg font-medium leading-relaxed italic">
                Unlock exclusive analytics, mental training protocols, and localized syllabus heatmaps by joining the Solaris ecosystem.
              </p>
              <div className="pt-8">
                 <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'login' }))}
                  className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black text-[10px] uppercase tracking-[0.4em] hover:bg-indigo-500 transition-all flex items-center justify-center gap-4 shadow-2xl shadow-indigo-600/20 active:scale-95"
                 >
                   Establish Connection <Rocket className="w-4 h-4" />
                 </button>
              </div>
           </div>
        </div>
      </div>
      
      {/* Editorial Disclaimer Footer */}
      <div className="pt-20 border-t border-slate-50 text-center relative z-10">
         <div className="inline-flex items-center gap-3 opacity-20 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.6em]">Verified Dispatch Node v22.3</span>
         </div>
      </div>
    </div>
  );
};

export default BlogModule;
