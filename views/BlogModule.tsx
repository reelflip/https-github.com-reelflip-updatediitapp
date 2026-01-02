
import React, { useState } from 'react';
import { StudentData, Blog } from '../types';
import { Calendar, User, ArrowLeft, Share2, Bookmark, Clock, Sparkles, ChevronRight, Search, TrendingUp, BookOpen, Zap, Newspaper } from 'lucide-react';

interface BlogModuleProps {
  data: StudentData;
}

const BlogModule: React.FC<BlogModuleProps> = ({ data }) => {
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Use dynamic blogs from the database instead of hardcoded ones
  const blogs = (data.blogs || []).filter(b => b.status === 'PUBLISHED');

  const filteredBlogs = blogs.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/g).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} MIN`;
  };

  if (selectedBlog) {
    const blog = selectedBlog;
    return (
      <div className="bg-[#0a0c1a] min-h-screen text-white pt-20 px-6 max-w-5xl mx-auto space-y-16 animate-in slide-in-from-bottom-8 duration-700 pb-40">
        <button 
          onClick={() => setSelectedBlog(null)}
          className="flex items-center gap-4 text-[#4a5578] hover:text-white font-black text-[10px] uppercase tracking-[0.4em] transition-all group"
        >
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-2" /> Back to Newsroom
        </button>

        <article className="bg-[#161a2e] rounded-[5rem] overflow-hidden border border-[#2d3656] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] relative">
          <div className="h-[400px] bg-slate-950 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-[#161a2e] via-[#0d1021]/60 to-transparent"></div>
            <div className="absolute bottom-20 left-16 right-16 space-y-8">
              <div className="flex gap-4">
                 <span className="bg-[#5d5fef] text-white px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-[0_15px_30px_rgba(93,95,239,0.4)]">Technical Release</span>
                 <span className="bg-white/5 backdrop-blur-md text-[#7d8cb8] px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">{calculateReadTime(blog.content)} READ</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter leading-[0.85] uppercase drop-shadow-2xl">{blog.title}</h1>
            </div>
          </div>

          <div className="p-12 md:p-24 space-y-16">
            <div className="flex flex-wrap items-center justify-between gap-10 pb-12 border-b border-[#1e2440]">
               <div className="flex items-center gap-8">
                  <div className="w-16 h-16 bg-[#0d1021] border border-[#1e2440] rounded-2xl flex items-center justify-center text-indigo-400 shadow-inner">
                     <User className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="text-xl font-black text-white tracking-tight uppercase italic leading-none">{blog.author}</div>
                    <div className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.4em] mt-3">{blog.date} • SYSTEM VERIFIED</div>
                  </div>
               </div>
               <div className="flex gap-4">
                  <button className="p-4 bg-[#0d1021] text-[#4a5578] rounded-xl hover:bg-[#5d5fef] hover:text-white transition-all border border-[#1e2440]"><Share2 className="w-5 h-5" /></button>
                  <button className="p-4 bg-[#0d1021] text-[#4a5578] rounded-xl hover:bg-rose-500 hover:text-white transition-all border border-[#1e2440]"><Bookmark className="w-5 h-5" /></button>
               </div>
            </div>

            <div 
              className="prose prose-invert max-w-none prose-p:text-[#7d8cb8] prose-p:text-xl prose-p:leading-relaxed prose-headings:font-black prose-headings:tracking-tighter prose-img:rounded-[3rem] prose-strong:text-white italic font-medium"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0c1a] min-h-screen text-white pt-20 px-6 max-w-7xl mx-auto space-y-20 animate-in fade-in duration-1000 pb-40">
      
      {/* --- HUB HEADER --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-3 bg-indigo-500/10 border border-indigo-500/20 px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.4em] text-indigo-400">
            <Newspaper className="w-4 h-4" /> Strategy Reports
          </div>
          <h2 className="text-7xl font-black text-white tracking-tighter italic leading-[0.85] uppercase">STRATEGY <br /> <span className="text-[#5d5fef]">LOGS.</span></h2>
          <p className="text-[#7d8cb8] text-xl font-medium max-w-xl leading-relaxed italic">"Official guidance and technical insights synced directly from the Admin Node."</p>
        </div>
        
        <div className="w-full lg:w-[400px] relative group">
           <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-6 h-6 text-[#2d3656] group-focus-within:text-[#5d5fef] transition-colors" />
           <input 
            type="text" 
            placeholder="Search active logs..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-16 pr-10 py-6 bg-[#0d1021] border border-[#1e2440] rounded-[2rem] text-sm font-bold text-white placeholder:text-[#2d3656] focus:ring-8 focus:ring-indigo-500/10 shadow-inner transition-all outline-none"
           />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredBlogs.length === 0 ? (
          <div className="col-span-full py-32 text-center bg-[#161a2e] rounded-[4rem] border-4 border-dashed border-[#1e2440] flex flex-col items-center gap-6">
             <Zap className="w-12 h-12 text-[#2d3656]" />
             <p className="text-xs font-black uppercase text-[#4a5578] tracking-[0.4em] italic">No published articles detected on this node.</p>
          </div>
        ) : (
          filteredBlogs.map((blog) => (
            <div 
              key={blog.id} 
              onClick={() => setSelectedBlog(blog)}
              className="group bg-[#161a2e] rounded-[3.5rem] border border-[#2d3656] overflow-hidden shadow-xl hover:border-indigo-500/40 transition-all cursor-pointer flex flex-col h-full"
            >
              <div className="h-64 bg-[#0d1021] relative overflow-hidden p-10 flex items-center justify-center">
                 <div className="absolute inset-0 bg-indigo-500/5 group-hover:scale-110 transition-transform duration-[3s]"></div>
                 <BookOpen className="w-14 h-14 text-[#1e2440] group-hover:text-indigo-500/20 transition-colors" />
                 <div className="absolute top-8 left-8">
                    <span className="px-4 py-1.5 bg-[#161a2e] border border-[#2d3656] text-[8px] font-black uppercase tracking-widest text-indigo-400 rounded-lg">OFFICIAL</span>
                 </div>
              </div>
              <div className="p-10 space-y-8 flex-1 flex flex-col">
                <div className="flex items-center gap-4 text-[9px] font-black text-[#4a5578] uppercase tracking-[0.3em]">
                  <Calendar className="w-4 h-4" /> {blog.date}
                  <div className="w-1 h-1 bg-[#2d3656] rounded-full"></div>
                  <Clock className="w-4 h-4" /> {calculateReadTime(blog.content)}
                </div>
                <h3 className="text-2xl font-black text-white tracking-tighter group-hover:text-[#5d5fef] transition-colors leading-tight italic uppercase line-clamp-2">{blog.title}</h3>
                <div className="pt-8 mt-auto border-t border-[#1e2440] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#0d1021] flex items-center justify-center text-[10px] font-black border border-[#1e2440]">{blog.author[0]}</div>
                    <span className="text-[9px] font-black text-[#4a5578] uppercase tracking-widest">{blog.author}</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-[#0d1021] border border-[#1e2440] text-[#2d3656] flex items-center justify-center group-hover:bg-[#5d5fef] group-hover:text-white transition-all shadow-inner">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        
        {/* Placeholder for Subscription or Action */}
        <div className="bg-[#0d1021] p-12 rounded-[3.5rem] text-white space-y-8 flex flex-col justify-center relative overflow-hidden shadow-2xl border border-[#1e2440] group min-h-[400px]">
           <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12 scale-150 group-hover:rotate-45 transition-transform duration-[4s]"><TrendingUp className="w-48 h-48 text-indigo-400" /></div>
           <div className="space-y-4 relative z-10">
              <h4 className="text-4xl font-black italic tracking-tighter leading-[0.9] uppercase text-indigo-400">Integrated <br /> Insight.</h4>
              <p className="text-[#7d8cb8] text-sm font-medium leading-relaxed italic">"Syncing the latest pedagogical research and exam intelligence modules."</p>
           </div>
           <div className="relative z-10 pt-4">
              <div className="text-[8px] font-black uppercase text-indigo-500 tracking-[0.4em] mb-4">Uplink Status</div>
              <div className="flex items-center gap-3 text-emerald-500">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-widest">Connection Stable</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BlogModule;
