
import React, { useState, useMemo } from 'react';
import { StudentData, Blog } from '../types';
import { 
  Calendar, ArrowLeft, Share2, Clock, 
  ChevronRight, Search, Target, Brain, Cpu,
  Newspaper, Bookmark
} from 'lucide-react';

interface CategorizedBlog extends Blog {
  category: 'EXAM' | 'STRATEGY' | 'TECH';
}

interface BlogModuleProps {
  data: StudentData;
}

const BlogModule: React.FC<BlogModuleProps> = ({ data }) => {
  const [selectedBlog, setSelectedBlog] = useState<CategorizedBlog | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'EXAM' | 'STRATEGY' | 'TECH'>('ALL');

  const blogs = useMemo(() => (data.blogs || [])
    .filter(b => b.status === 'PUBLISHED')
    .map(b => {
        let cat: 'EXAM' | 'STRATEGY' | 'TECH' = 'STRATEGY';
        const titleLow = b.title.toLowerCase();
        if (titleLow.includes('exam') || titleLow.includes('jee')) cat = 'EXAM';
        if (titleLow.includes('system') || titleLow.includes('sync')) cat = 'TECH';
        return { ...b, category: cat } as CategorizedBlog;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [data.blogs]);

  const filteredBlogs = useMemo(() => blogs.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = activeCategory === 'ALL' || b.category === activeCategory;
    return matchesSearch && matchesCat;
  }), [blogs, searchQuery, activeCategory]);

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = (content || '').split(/\s+/g).length;
    return `${Math.max(1, Math.ceil(wordCount / wordsPerMinute))} min read`;
  };

  if (selectedBlog) {
    return (
      <div className="min-h-screen bg-white text-slate-900 animate-in fade-in duration-500 pb-20">
        <div className="max-w-3xl mx-auto px-6 pt-12 md:pt-20">
          <button 
            onClick={() => { setSelectedBlog(null); window.scrollTo(0,0); }}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-bold text-sm mb-12 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Articles
          </button>

          <article className="space-y-10">
            <header className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                  {selectedBlog.category}
                </span>
                <span className="text-slate-400 text-xs font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {calculateReadTime(selectedBlog.content)}
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight italic tracking-tighter uppercase font-space">
                {selectedBlog.title}
              </h1>
              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500 text-xs border border-slate-200 uppercase">
                    {selectedBlog.author[0]}
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-800">{selectedBlog.author}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">{selectedBlog.date}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-slate-100">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </header>

            <div 
              className="prose prose-slate max-w-none prose-headings:font-black prose-headings:italic prose-headings:tracking-tighter prose-p:text-lg prose-p:text-slate-600 prose-p:leading-relaxed prose-strong:text-indigo-600"
              dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
            />
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 pt-12 md:pt-20 px-6 max-w-6xl mx-auto animate-in fade-in duration-700 pb-40">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-16">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 text-indigo-600">
            <Newspaper className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Knowledge Hub</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter italic uppercase leading-none font-space">
            Academic <span className="text-indigo-600">Insights.</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl italic leading-relaxed">
            Latest trends, preparation strategies, and technical guides for engineering aspirants.
          </p>
        </div>
        
        <div className="w-full md:w-80 space-y-4">
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input 
                type="text" 
                placeholder="Search articles..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold placeholder:text-slate-300 focus:bg-white focus:border-indigo-600 outline-none transition-all shadow-inner"
              />
           </div>
        </div>
      </div>

      <div className="flex gap-2 p-1.5 bg-slate-50 rounded-2xl border border-slate-100 w-fit mb-12 overflow-x-auto">
        {[
          { id: 'ALL', label: 'All Articles', icon: Newspaper },
          { id: 'EXAM', label: 'Exams', icon: Target },
          { id: 'STRATEGY', label: 'Strategy', icon: Brain },
          { id: 'TECH', label: 'Tech', icon: Cpu }
        ].map(cat => (
          <button 
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as any)}
            className={`px-8 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeCategory === cat.id ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-700'}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredBlogs.length === 0 ? (
          <div className="col-span-full py-32 text-center border-4 border-dashed border-slate-50 rounded-[3rem] space-y-4">
            <Newspaper className="w-12 h-12 text-slate-200 mx-auto" />
            <p className="text-slate-300 font-black uppercase text-xs tracking-[0.2em]">No articles found matching your query.</p>
          </div>
        ) : (
          filteredBlogs.map((blog) => (
            <div 
              key={blog.id} 
              onClick={() => { setSelectedBlog(blog); window.scrollTo(0,0); }}
              className="group bg-white p-8 md:p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:border-indigo-300 hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between h-full"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-full border ${
                    blog.category === 'EXAM' ? 'bg-rose-50 border-rose-100 text-rose-600' :
                    blog.category === 'TECH' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                    'bg-indigo-50 border-indigo-100 text-indigo-600'
                  }`}>{blog.category}</span>
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{blog.date}</span>
                </div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tighter leading-tight italic uppercase group-hover:text-indigo-600 transition-colors">
                  {blog.title}
                </h2>
                <p className="text-slate-500 font-medium italic leading-relaxed line-clamp-2">
                  {blog.content.replace(/<[^>]*>?/gm, '').substring(0, 140)}...
                </p>
              </div>
              
              <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-400 border border-slate-100 uppercase">
                    {blog.author[0]}
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{blog.author}</span>
                </div>
                <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest group-hover:gap-4 transition-all">
                  Read Article <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-20 pt-20 border-t border-slate-50 text-center">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] italic">
          IITGEEPREP Editorial Branch v22.5
        </p>
      </div>
    </div>
  );
};

export default BlogModule;
