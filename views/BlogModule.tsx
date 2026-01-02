
import React, { useState } from 'react';
import { StudentData, Blog } from '../types';
import { Calendar, User, ArrowLeft, Share2, Bookmark, Clock, Sparkles, ChevronRight, Search, TrendingUp, BookOpen, Zap } from 'lucide-react';

interface BlogModuleProps {
  data: StudentData;
}

const BlogModule: React.FC<BlogModuleProps> = ({ data }) => {
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [activeCategory, setActiveCategory] = useState('All Reports');

  const categories = ['All Reports', 'Physics Insights', 'Organic Hacks', 'Math Mechanics', 'Numerical Strategies', 'Wellness'];

  const strategyArticles = [
    {
      id: 's1',
      title: 'The Forgetting Curve: Applied Revision Methodology',
      author: 'Academic Node 01',
      date: 'DEC 24, 2024',
      readTime: '12 MIN',
      category: 'Psychology',
      content: `<h1>The Science of Memory Decay</h1><p>Standard revision often follows a linear path. This report analyzes how to exploit the science of spaced repetition to optimize retention velocity before the upcoming attempts.</p>`,
      excerpt: "Technical analysis of memory decay. Learn how to use Spaced Repetition algorithms to maintain high retention levels across the syllabus."
    },
    {
      id: 's2',
      title: 'Performance Stability: Analysis of Exam Stress',
      author: 'Graduated Researcher',
      date: 'DEC 22, 2024',
      readTime: '8 MIN',
      category: 'Exam Strategy',
      content: `<h1>Exam Stoicism</h1><p>Stability under pressure is a measurable metric. We analyze how to maintain a consistent focus pulse during high-stakes examinations and minimize error rates.</p>`,
      excerpt: "Minimizing silly mistakes requires consistent mental state monitoring. We examine the methodology for maintaining precision."
    },
    {
      id: 's3',
      title: 'Organic Chemistry: Mechanism Mapping vs Memorization',
      author: 'Chemistry Specialist',
      date: 'DEC 20, 2024',
      readTime: '15 MIN',
      category: 'Subject Strategy',
      content: `<h1>The Mechanism Map</h1><p>This report discusses shifting from memorization to understanding electron density and nucleophilic patterns for organic reaction prediction.</p>`,
      excerpt: "Understanding molecular architecture allows for more reliable reaction prediction than rote learning."
    }
  ];

  if (selectedBlog) {
    const blog = selectedBlog;
    return (
      <div className="bg-[#0a0c1a] min-h-screen text-white pt-20 px-6 max-w-5xl mx-auto space-y-16 animate-in slide-in-from-bottom-8 duration-700 pb-40">
        <button 
          onClick={() => setSelectedBlog(null)}
          className="flex items-center gap-4 text-[#4a5578] hover:text-white font-black text-[10px] uppercase tracking-[0.4em] transition-all group"
        >
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-2" /> Back to Technical Reports
        </button>

        <article className="bg-[#161a2e] rounded-[5rem] overflow-hidden border border-[#2d3656] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] relative">
          <div className="h-[550px] bg-slate-950 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-[#161a2e] via-[#0d1021]/60 to-transparent"></div>
            <div className="absolute bottom-20 left-16 right-16 space-y-8">
              <div className="flex gap-4">
                 <span className="bg-[#5d5fef] text-white px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-[0_15px_30px_rgba(93,95,239,0.4)]">Technical Report</span>
                 <span className="bg-white/5 backdrop-blur-md text-[#7d8cb8] px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">Academic Intel</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-white italic tracking-tighter leading-[0.85] uppercase drop-shadow-2xl">{blog.title}</h1>
            </div>
          </div>

          <div className="p-16 md:p-24 space-y-16">
            <div className="flex flex-wrap items-center justify-between gap-10 pb-12 border-b border-[#1e2440]">
               <div className="flex items-center gap-8">
                  <div className="w-20 h-20 bg-[#0d1021] border border-[#1e2440] rounded-[2rem] flex items-center justify-center text-indigo-400 shadow-inner">
                     <User className="w-10 h-10" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white tracking-tight uppercase italic leading-none">{blog.author}</div>
                    <div className="text-[11px] text-indigo-400 font-black uppercase tracking-[0.4em] mt-3">{blog.date} • VERIFIED SOURCE</div>
                  </div>
               </div>
               <div className="flex gap-6">
                  <button className="p-5 bg-[#0d1021] text-[#4a5578] rounded-2xl hover:bg-[#5d5fef] hover:text-white transition-all shadow-sm border border-[#1e2440]"><Share2 className="w-7 h-7" /></button>
                  <button className="p-5 bg-[#0d1021] text-[#4a5578] rounded-2xl hover:bg-rose-500 hover:text-white transition-all shadow-sm border border-[#1e2440]"><Bookmark className="w-7 h-7" /></button>
               </div>
            </div>

            <div 
              className="prose prose-invert max-w-none prose-p:text-[#7d8cb8] prose-p:text-2xl prose-p:leading-relaxed prose-headings:font-black prose-headings:tracking-tighter prose-img:rounded-[4rem] prose-img:shadow-2xl prose-strong:text-white italic font-medium selection:bg-indigo-500/30"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0c1a] min-h-screen text-white pt-20 px-6 max-w-7xl mx-auto space-y-24 animate-in fade-in duration-1000 pb-40">
      
      {/* --- HUB HEADER --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-3 bg-indigo-500/10 border border-indigo-500/20 px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.4em] text-indigo-400">
            <TrendingUp className="w-4 h-4" /> Strategy & Analytics
          </div>
          <h2 className="text-8xl font-black text-white tracking-tighter italic leading-[0.85] uppercase">TECHNICAL <br /> <span className="text-[#5d5fef]">HUB.</span></h2>
          <p className="text-[#7d8cb8] text-2xl font-medium max-w-xl leading-relaxed italic">"Analytical reports on preparation mechanics, subject-specific trends, and performance psychology."</p>
        </div>
        
        <div className="w-full lg:w-[450px] relative group">
           <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-6 h-6 text-[#2d3656] group-focus-within:text-[#5d5fef] transition-colors" />
           <input 
            type="text" 
            placeholder="Search reports..." 
            className="w-full pl-16 pr-10 py-7 bg-[#0d1021] border border-[#1e2440] rounded-[2.5rem] text-base font-bold text-white placeholder:text-[#2d3656] focus:ring-8 focus:ring-indigo-500/10 shadow-inner transition-all outline-none"
           />
        </div>
      </div>

      <nav className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide">
         {categories.map((cat, i) => (
           <button 
            key={i} 
            onClick={() => setActiveCategory(cat)}
            className={`px-10 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.25em] whitespace-nowrap transition-all border-2 ${activeCategory === cat ? 'bg-[#5d5fef] border-[#5d5fef] text-white shadow-[0_15px_30px_rgba(93,95,239,0.3)]' : 'bg-[#0d1021] border-[#1e2440] text-[#4a5578] hover:text-[#7d8cb8] hover:border-[#2d3656]'}`}
           >
             {cat}
           </button>
         ))}
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {strategyArticles.map((blog) => (
          <div 
            key={blog.id} 
            onClick={() => setSelectedBlog(blog as any)}
            className="group bg-[#161a2e] rounded-[4.5rem] border border-[#2d3656] overflow-hidden shadow-xl hover:border-indigo-500/40 transition-all cursor-pointer flex flex-col h-full"
          >
            <div className="h-72 bg-[#0d1021] relative overflow-hidden p-12 flex items-center justify-center">
               <div className="absolute inset-0 bg-indigo-500/5 group-hover:scale-110 transition-transform duration-[3s]"></div>
               <BookOpen className="w-16 h-16 text-[#1e2440] group-hover:text-indigo-500/20 transition-colors" />
               <div className="absolute top-10 left-10">
                  <span className="px-4 py-1.5 bg-[#161a2e] border border-[#2d3656] text-[8px] font-black uppercase tracking-widest text-indigo-400 rounded-lg">{blog.category}</span>
               </div>
            </div>
            <div className="p-12 space-y-10 flex-1 flex flex-col">
              <div className="flex items-center gap-5 text-[9px] font-black text-[#4a5578] uppercase tracking-[0.3em]">
                <Calendar className="w-4 h-4" /> {blog.date}
                <div className="w-1 h-1 bg-[#2d3656] rounded-full"></div>
                <Clock className="w-4 h-4" /> {blog.readTime}
              </div>
              <h3 className="text-3xl font-black text-white tracking-tighter group-hover:text-[#5d5fef] transition-colors leading-[1.1] italic uppercase">{blog.title}</h3>
              <p className="text-base text-[#7d8cb8] font-medium line-clamp-3 leading-relaxed italic">"{blog.excerpt}"</p>
              <div className="pt-10 mt-auto border-t border-[#1e2440] flex items-center justify-between">
                <span className="text-[10px] font-black text-[#4a5578] uppercase tracking-widest">By {blog.author}</span>
                <div className="w-12 h-12 rounded-2xl bg-[#0d1021] border border-[#1e2440] text-[#2d3656] flex items-center justify-center group-hover:bg-[#5d5fef] group-hover:text-white transition-all shadow-inner">
                  <ChevronRight className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        ))}
        
        <div className="bg-[#0d1021] p-16 rounded-[4.5rem] text-white space-y-12 flex flex-col justify-center relative overflow-hidden shadow-2xl border border-[#1e2440] group">
           <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12 scale-150 group-hover:rotate-45 transition-transform duration-[4s]"><TrendingUp className="w-64 h-64 text-indigo-400" /></div>
           <div className="space-y-6 relative z-10">
              <h4 className="text-5xl font-black italic tracking-tighter leading-[0.9] uppercase">Stay Performance <br /> Integrated.</h4>
              <p className="text-[#7d8cb8] text-lg font-medium leading-relaxed italic">"Weekly analytical insights, focused methodology, and critical examination updates."</p>
           </div>
           <div className="space-y-6 relative z-10">
              <input type="email" placeholder="aspirant@node.edu" className="w-full bg-[#161a2e] border border-[#2d3656] rounded-[1.8rem] px-8 py-7 text-base font-black text-white placeholder:text-[#2d3656] focus:ring-8 focus:ring-indigo-500/10 outline-none transition-all" />
              <button className="w-full bg-[#5d5fef] text-white py-8 rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.5em] shadow-[0_20px_50px_-10px_rgba(93,95,239,0.5)] hover:scale-105 transition-all">ESTABLISH UPLINK</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BlogModule;
