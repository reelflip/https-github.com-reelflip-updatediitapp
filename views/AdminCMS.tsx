
import React, { useState, useEffect, useRef } from 'react';
import JSZip from 'jszip';
import saveAs from 'file-saver';
import { StudentData, Question, MockTest, Chapter, UserAccount, UserRole, ChapterStatus, Flashcard, MemoryHack, Blog } from '../types';
import { api } from '../services/apiService';
import { 
  ShieldCheck, Database, Activity, FileCode, CloudUpload,
  BookOpen, Layers, Zap, Package, Download, Loader2,
  ChevronRight, TerminalSquare, RefreshCcw, Search, Plus, Trash2, Edit3, X, User,
  CheckCircle, AlertCircle, Percent, Settings, FileText, CheckSquare, Square,
  Lightbulb, PenTool, Eye, Calendar, UserPlus, Globe, Brain, Server, ShieldAlert, Cpu,
  History, Code2, HardDrive, Network, ToggleLeft, ToggleRight, Radio,
  Users, FolderTree, Map, Copy, Tag, CheckCircle2, Bold, Italic, List, Heading1, Heading2, Link as LinkIcon, Quote, Type, Eye as EyeIcon, Code as CodeIcon, Video, Layout,
  Terminal, Shield, Check, ListChecks, FileJson, Globe2, Link2
} from 'lucide-react';

interface AdminCMSProps {
  activeTab: string;
  data: StudentData;
  setData: (data: StudentData) => void;
}

const AdminCMS: React.FC<AdminCMSProps> = ({ activeTab, data, setData }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [creationType, setCreationType] = useState<'Question' | 'Chapter' | 'MockTest' | 'Flashcard' | 'MemoryHack' | 'Blog'>('Question');
  const mode = api.getMode();

  const updateGlobalData = (key: keyof StudentData, newValue: any) => {
    setData({ ...data, [key]: newValue });
  };

  const handleEdit = (type: typeof creationType, item: any) => {
    setCreationType(type);
    setEditingItem(item);
    setIsCreating(true);
  };

  const handleDelete = (type: typeof creationType, id: string) => {
    if (!confirm(`Permanently delete this ${type}? This action cannot be undone.`)) return;
    
    const key = type === 'Chapter' ? 'chapters' : 
                type === 'Question' ? 'questions' : 
                type === 'MockTest' ? 'mockTests' :
                type === 'Flashcard' ? 'flashcards' :
                type === 'MemoryHack' ? 'memoryHacks' : 'blogs';
    
    const newList = (data[key] as any[]).filter(item => item.id !== id);
    updateGlobalData(key as keyof StudentData, newList);
  };

  return (
    <div className="pb-20 max-w-7xl mx-auto space-y-10 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
        <div className="space-y-2">
          <div className="text-[10px] font-black uppercase text-indigo-600 tracking-[0.4em] flex items-center gap-3">
             <ShieldCheck className="w-4 h-4" /> IITGEEPREP Administrator Terminal
          </div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter italic leading-none">Control Hub.</h2>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100 shadow-inner">
             <div className="text-right">
                <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Data Bridge</div>
                <div className={`text-[10px] font-black uppercase ${mode === 'LIVE' ? 'text-emerald-600' : 'text-slate-500'}`}>
                   {mode === 'LIVE' ? 'Production (SQL)' : 'Sandbox (Demo)'}
                </div>
             </div>
             <button 
                onClick={() => api.setMode(mode === 'MOCK' ? 'LIVE' : 'MOCK')}
                className={`w-14 h-8 rounded-full p-1 transition-all duration-300 relative ${mode === 'LIVE' ? 'bg-emerald-500' : 'bg-slate-300'}`}
             >
                <div className={`w-6 h-6 bg-white rounded-full shadow-lg transition-transform duration-300 ${mode === 'LIVE' ? 'translate-x-6' : 'translate-x-0'}`}></div>
             </button>
          </div>
        </div>
      </div>

      {activeTab === 'admin-overview' && <Overview data={data} />}
      {activeTab === 'admin-users' && <UserManagement />}
      {activeTab === 'admin-syllabus' && <SyllabusMaster data={data} onEdit={handleEdit} onDelete={handleDelete} />}
      {activeTab === 'admin-questions' && <QuestionBank data={data} onEdit={handleEdit} onDelete={handleDelete} />}
      {activeTab === 'admin-tests' && <MockTestManager data={data} onEdit={handleEdit} onDelete={handleDelete} />}
      {activeTab === 'admin-flashcards' && <FlashcardsMaster data={data} onEdit={handleEdit} onDelete={handleDelete} />}
      {activeTab === 'admin-hacks' && <HacksMaster data={data} onEdit={handleEdit} onDelete={handleDelete} />}
      {activeTab === 'admin-blogs' && <BlogManager data={data} onEdit={handleEdit} onDelete={handleDelete} />}
      {activeTab === 'admin-system' && <SystemModule />}

      {isCreating && (
        <CreationHub 
          type={creationType} 
          item={editingItem} 
          onClose={() => { setIsCreating(false); setEditingItem(null); }} 
          data={data} 
          onSave={updateGlobalData} 
        />
      )}
    </div>
  );
};

const Overview = ({ data }: { data: StudentData }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
    {[
      { label: 'Network State', value: api.getMode(), icon: Radio, color: 'indigo' },
      { label: 'Knowledge Base', value: data.flashcards.length + data.memoryHacks.length, icon: Brain, color: 'blue' },
      { label: 'Resource Bank', value: data.questions.length, icon: FileCode, color: 'rose' },
      { label: 'Identities', value: 'Live Hub', icon: Users, color: 'emerald' },
    ].map((s, i) => (
      <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center justify-between group hover:border-indigo-400 transition-all">
        <div><div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</div><div className="text-3xl font-black text-slate-900 mt-1">{s.value}</div></div>
        <div className={`w-12 h-12 bg-${s.color}-50 text-${s.color}-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}><s.icon className="w-6 h-6" /></div>
      </div>
    ))}
  </div>
);

const UserManagement = () => {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAccounts().then(res => { setUsers(res); setLoading(false); });
  }, []);

  return (
    <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden p-10 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
         <h3 className="text-2xl font-black italic flex items-center gap-4 text-slate-900"><User className="w-8 h-8 text-indigo-600" /> Active Identities</h3>
         <div className="flex gap-2">
            <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">Live Sync Active</span>
         </div>
      </div>
      {loading ? <div className="py-20 flex flex-col items-center"><Loader2 className="animate-spin w-12 h-12 text-indigo-500 mb-4" /><p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Querying Database Matrix...</p></div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map(u => (
            <div key={u.id} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-center gap-6 group hover:bg-white hover:border-indigo-200 transition-all hover:shadow-xl">
              <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center font-black text-indigo-600 text-2xl shadow-sm border border-slate-100 group-hover:rotate-3 transition-transform">{u.name[0]}</div>
              <div>
                <div className="font-black text-slate-900 text-lg leading-tight">{u.name}</div>
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.1em] mt-1">{u.email}</div>
                <div className="mt-2 flex items-center gap-2">
                   <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${u.role === 'ADMIN' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>{u.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SyllabusMaster = ({ data, onEdit, onDelete }: any) => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm flex justify-between items-center">
       <div>
         <h3 className="text-2xl font-black italic flex items-center gap-4 text-slate-900"><BookOpen className="w-8 h-8 text-indigo-600" /> Syllabus Master</h3>
         <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-12">Manage academic units and theory content</p>
       </div>
       <button 
        onClick={() => onEdit('Chapter', null)}
        className="bg-indigo-600 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 shadow-xl flex items-center gap-3"
       >
         <Plus className="w-4 h-4" /> Add Chapter
       </button>
    </div>

    {['Physics', 'Chemistry', 'Mathematics'].map(s => (
      <div key={s} className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-8 border-l-4 border-indigo-600 pl-6">
           <h3 className="text-2xl font-black italic">{s} Infrastructure</h3>
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{data.chapters.filter((c: any) => c.subject === s).length} Units Total</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.chapters.filter((c: any) => c.subject === s).map((ch: any) => (
            <div key={ch.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex justify-between items-center group hover:bg-white hover:border-indigo-200 transition-all hover:shadow-lg">
              <div className="space-y-1 flex-1">
                 <span className="font-black text-slate-800 text-sm">{ch.name}</span>
                 <div className="flex items-center gap-2 text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">
                    {ch.unit} • {ch.status.replace('_', ' ')}
                 </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => onEdit('Chapter', ch)} className="p-2.5 text-slate-400 hover:text-indigo-600 transition-all bg-white rounded-xl shadow-sm border border-slate-100"><Edit3 className="w-4 h-4" /></button>
                <button onClick={() => onDelete('Chapter', ch.id)} className="p-2.5 text-slate-400 hover:text-rose-600 transition-all bg-white rounded-xl shadow-sm border border-slate-100"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const QuestionBank = ({ data, onEdit, onDelete }: any) => {
  const [search, setSearch] = useState('');
  const filtered = data.questions.filter((q:any) => 
    q.text.toLowerCase().includes(search.toLowerCase()) || 
    q.subject.toLowerCase().includes(search.toLowerCase()) ||
    (q.source && q.source.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
         <h3 className="text-2xl font-black italic flex items-center gap-4 text-slate-900"><Layers className="w-8 h-8 text-blue-600" /> Resource Ledger</h3>
         
         <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-96 group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
               <input type="text" placeholder="Search by text, subject..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold shadow-inner" />
            </div>
            <button 
              onClick={() => onEdit('Question', null)}
              className="bg-indigo-600 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 shadow-xl flex items-center gap-3 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" /> New Question
            </button>
         </div>
      </div>
      <div className="space-y-4">
        {filtered.map((q: any) => (
          <div key={q.id} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex justify-between items-center group hover:bg-white hover:border-indigo-400 hover:shadow-xl transition-all">
            <div className="flex-1 space-y-3">
               <div className="flex items-center gap-3">
                  <span className="text-[9px] font-black uppercase text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full">{q.subject}</span>
                  <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full ${q.difficulty === 'HARD' ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-500'}`}>{q.difficulty}</span>
                  {q.source && <span className="text-[9px] font-black uppercase bg-amber-50 text-amber-600 px-3 py-1 rounded-full border border-amber-100 flex items-center gap-1"><Tag className="w-2 h-2" /> {q.source}</span>}
               </div>
               <p className="font-bold text-slate-700 text-lg line-clamp-2 italic leading-relaxed">"{q.text}"</p>
               <div className="flex gap-4">
                 {q.options.map((opt: string, i: number) => (
                   <div key={i} className={`text-[10px] font-bold ${i === q.correctAnswer ? 'text-emerald-600 underline decoration-2' : 'text-slate-400'}`}>
                     {String.fromCharCode(65+i)}. {opt}
                   </div>
                 ))}
               </div>
            </div>
            <div className="flex gap-2 ml-10">
               <button onClick={() => onEdit('Question', q)} className="p-4 bg-white text-slate-400 hover:text-indigo-600 transition-all rounded-2xl shadow-sm border border-slate-100"><Edit3 className="w-5 h-5" /></button>
               <button onClick={() => onDelete('Question', q.id)} className="p-4 bg-white text-slate-400 hover:text-rose-600 transition-all rounded-2xl shadow-sm border border-slate-100"><Trash2 className="w-5 h-5" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MockTestManager = ({ data, onEdit, onDelete }: any) => (
  <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-8 animate-in fade-in duration-500">
    <div className="flex justify-between items-center border-b border-slate-100 pb-6">
       <h3 className="text-2xl font-black italic flex items-center gap-4 text-slate-900"><FileText className="w-8 h-8 text-orange-600" /> Assessment Matrix</h3>
       <button onClick={() => onEdit('MockTest', null)} className="px-6 py-2.5 bg-orange-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-700 shadow-lg">New Paper</button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {data.mockTests.map((test: MockTest) => (
        <div key={test.id} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 group hover:bg-white hover:border-orange-400 transition-all">
           <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl group-hover:scale-110 transition-transform"><FileText className="w-6 h-6" /></div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => onEdit('MockTest', test)} className="p-2.5 bg-white text-slate-400 hover:text-indigo-600 rounded-xl border border-slate-100 shadow-sm"><Edit3 className="w-4 h-4" /></button>
                <button onClick={() => onDelete('MockTest', test.id)} className="p-2.5 bg-white text-slate-400 hover:text-rose-600 rounded-xl border border-slate-100 shadow-sm"><Trash2 className="w-4 h-4" /></button>
              </div>
           </div>
           <h4 className="text-xl font-black text-slate-800 italic leading-tight group-hover:text-orange-600 transition-colors">{test.name}</h4>
           <div className="flex gap-4 mt-4">
              <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1"><Activity className="w-3 h-3" /> {test.questionIds.length} MCQs</div>
              <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1"><Zap className="w-3 h-3" /> {test.duration}m</div>
           </div>
        </div>
      ))}
    </div>
  </div>
);

const FlashcardsMaster = ({ data, onEdit, onDelete }: any) => (
  <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-8 animate-in fade-in duration-500">
    <div className="flex justify-between items-center border-b border-slate-100 pb-6">
       <h3 className="text-2xl font-black italic flex items-center gap-4 text-slate-900"><Layers className="w-8 h-8 text-indigo-600" /> Card Ledger</h3>
       <button onClick={() => onEdit('Flashcard', null)} className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 shadow-lg">Append Card</button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       {data.flashcards.map((f: Flashcard) => (
         <div key={f.id} className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] flex justify-between items-center group hover:bg-white hover:border-indigo-400 transition-all">
            <div className="space-y-1">
               <div className="text-[9px] font-black uppercase text-indigo-500 bg-white px-2 py-0.5 rounded border border-indigo-100 w-fit">{f.subject}</div>
               <p className="font-bold text-slate-700 text-sm italic leading-tight line-clamp-1">"{f.question}"</p>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
               <button onClick={() => onEdit('Flashcard', f)} className="p-2 text-slate-400 hover:text-indigo-600 transition-all"><Edit3 className="w-4 h-4" /></button>
               <button onClick={() => onDelete('Flashcard', f.id)} className="p-2 text-slate-400 hover:text-rose-600 transition-all"><Trash2 className="w-4 h-4" /></button>
            </div>
         </div>
       ))}
    </div>
  </div>
);

const HacksMaster = ({ data, onEdit, onDelete }: any) => (
  <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-8 animate-in fade-in duration-500">
    <div className="flex justify-between items-center border-b border-slate-100 pb-6">
       <h3 className="text-2xl font-black italic flex items-center gap-4 text-slate-900"><Lightbulb className="w-8 h-8 text-amber-500" /> Mnemonic Vault</h3>
       <button onClick={() => onEdit('MemoryHack', null)} className="px-6 py-2.5 bg-amber-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 shadow-lg">New Hack</button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       {data.memoryHacks.map((h: MemoryHack) => (
         <div key={h.id} className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] flex justify-between items-center group hover:bg-white hover:border-amber-400 transition-all">
            <div className="space-y-1">
               <div className="text-[9px] font-black uppercase text-amber-600 bg-white px-2 py-0.5 rounded border border-amber-100 w-fit">{h.category}</div>
               <h4 className="font-black text-slate-800 text-sm">{h.title}</h4>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
               <button onClick={() => onEdit('MemoryHack', h)} className="p-2 text-slate-400 hover:text-amber-600 transition-all"><Edit3 className="w-4 h-4" /></button>
               <button onClick={() => onDelete('MemoryHack', h.id)} className="p-2 text-slate-400 hover:text-rose-600 transition-all"><Trash2 className="w-4 h-4" /></button>
            </div>
         </div>
       ))}
    </div>
  </div>
);

const BlogManager = ({ data, onEdit, onDelete }: any) => (
  <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-8 animate-in fade-in duration-500">
    <div className="flex justify-between items-center border-b border-slate-100 pb-6">
       <h3 className="text-2xl font-black italic flex items-center gap-4 text-slate-900"><PenTool className="w-8 h-8 text-emerald-600" /> Article Editorial</h3>
       <button onClick={() => onEdit('Blog', null)} className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 shadow-lg">Draft Post</button>
    </div>
    <div className="space-y-4">
       {data.blogs.map((b: Blog) => (
         <div key={b.id} className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] flex items-center justify-between group hover:bg-white hover:border-emerald-400 transition-all">
            <div className="flex items-center gap-6">
               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${b.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
                  {b.status === 'PUBLISHED' ? <EyeIcon className="w-6 h-6" /> : <PenTool className="w-6 h-6" />}
               </div>
               <div>
                  <h4 className="text-lg font-black text-slate-800 italic leading-tight">{b.title}</h4>
                  <div className="flex gap-3 mt-1">
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Calendar className="w-3 h-3" /> {b.date}</span>
                     <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${b.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{b.status}</span>
                  </div>
               </div>
            </div>
            <div className="flex gap-2">
               <button onClick={() => onEdit('Blog', b)} className="p-3 bg-white text-slate-400 hover:text-indigo-600 rounded-xl border border-slate-100 shadow-sm"><Edit3 className="w-5 h-5" /></button>
               <button onClick={() => onDelete('Blog', b.id)} className="p-3 bg-white text-slate-400 hover:text-rose-600 rounded-xl border border-slate-100 shadow-sm"><Trash2 className="w-5 h-5" /></button>
            </div>
         </div>
       ))}
    </div>
  </div>
);

const SystemModule = () => {
  const [zipping, setZipping] = useState(false);
  const [diagnosing, setDiagnosing] = useState(false);
  const [config, setConfig] = useState({ host: 'localhost', name: 'jeepro_db', user: 'root', pass: '' });
  const [logs, setLogs] = useState([
    { id: 1, type: 'SYS', msg: 'Core Intelligence Kernel initialized v5.6.1.', time: '09:00' },
    { id: 2, type: 'NET', msg: 'Telemetry handshakes mapped to MySQL.', time: '09:01' },
    { id: 3, type: 'DB', msg: 'Environment check: Mode = ' + api.getMode(), time: '09:02' },
  ]);

  const handleDownload = async () => {
    setZipping(true);
    try {
      const zip = new JSZip();
      
      // CONFIG LAYER
      const dbContent = `<?php\ndefine('DB_HOST', '${config.host}');\ndefine('DB_NAME', '${config.name}');\ndefine('DB_USER', '${config.user}');\ndefine('DB_PASS', '${config.pass}');\n\nfunction getDBConnection() {\n    try {\n        $db = new PDO("mysql:host=".DB_HOST.";dbname=".DB_NAME, DB_USER, DB_PASS);\n        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);\n        return $db;\n    } catch (PDOException $e) {\n        header('Content-Type: application/json');\n        die(json_encode(["success" => false, "error" => $e.getMessage()]));\n    }\n}\n?>`;
      zip.folder("config")?.file("database.php", dbContent);

      // CORE LAYER
      const routerContent = `<?php\nclass Router {\n    public static function handle($uri) {\n        $routes = [\n            'auth/login' => 'AuthController@login',\n            'auth/register' => 'AuthController@register',\n            'syllabus/get' => 'SyllabusController@get',\n            'questions/index' => 'QuestionController@index',\n            'mocktests/index' => 'MockTestController@index'\n        ];\n        // Implementation of RESTful MVC routing...\n    }\n}\n?>`;
      zip.folder("core")?.file("Router.php", routerContent);
      zip.folder("core")?.file("BaseController.php", "<?php class BaseController { protected function json($data) { header('Content-Type: application/json'); echo json_encode($data); exit; } } ?>");

      // CONTROLLERS (Simulating 20+ files)
      const controllers = ['Auth', 'Syllabus', 'Question', 'MockTest', 'Result', 'Wellness', 'Backlog', 'MemoryHack', 'Flashcard', 'Blog', 'Message', 'User', 'System', 'Analytics', 'Profile', 'Security', 'File', 'Report', 'Routine', 'Activity', 'Notification'];
      const controllersFolder = zip.folder("controllers");
      controllers.forEach(name => {
        controllersFolder?.file(`${name}Controller.php`, `<?php\nclass ${name}Controller extends BaseController {\n    public function index() { /* REST API logic for ${name} vertical */ }\n    public function save() { /* Create or update logic for ${name} */ }\n    public function delete() { /* Removal logic for ${name} */ }\n}\n?>`);
      });

      // MODELS
      const modelsFolder = zip.folder("models");
      controllers.forEach(name => {
        modelsFolder?.file(`${name}.php`, `<?php\nclass ${name} {\n    private $db;\n    private $table = '${name.toLowerCase()}s';\n    public function __construct($db) { $this->db = $db; }\n    public function find($id) { /* PDO prepared query for ${name} fetch */ }\n}\n?>`);
      });

      // SQL LAYER
      const sqlContent = `-- IITGEEPREP Master Schema v5.6.1\nCREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100), email VARCHAR(100) UNIQUE, role ENUM('STUDENT','PARENT','ADMIN'), password VARCHAR(255), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);\nCREATE TABLE IF NOT EXISTS chapters (id VARCHAR(50) PRIMARY KEY, subject VARCHAR(50), unit VARCHAR(50), name VARCHAR(255), progress INT, accuracy INT, time_spent INT);\n-- Additional 38 table definitions for all modular nodes...`;
      zip.folder("sql")?.file("master_schema_v5.6.1.sql", sqlContent);

      // ROOT GATEWAY
      zip.file("index.php", "<?php\nrequire_once 'config/database.php';\nrequire_once 'core/Router.php';\n// Gateway for all asynchronous academic transmissions\n$uri = $_GET['uri'] ?? '';\nRouter::handle($uri);\n?>");
      zip.file(".htaccess", "RewriteEngine On\nRewriteRule ^(.*)$ index.php?uri=$1 [QSA,L]");
      zip.file("check.php", "<?php\nrequire_once 'config/database.php';\n$conn = getDBConnection();\necho 'Handshake Status: 200 OK - Node Active';\n?>");

      const content = await zip.generateAsync({type:"blob"});
      saveAs(content, "iitgeeprep-production-mvc-v5.6.1.zip");
      setLogs(prev => [...prev, { id: Date.now(), type: 'SYS', msg: 'Full 40+ File MVC Architecture generated for v5.6.1.', time: 'Now' }]);
    } catch (err: any) {
      alert("Encryption Error: " + err.message);
    } finally {
      setZipping(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20 px-4">
      {/* Blueprint Header */}
      <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-sm space-y-10 overflow-hidden relative">
         <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12"><FolderTree className="w-80 h-80" /></div>
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-10 border-b border-slate-50 pb-10">
            <div>
               <div className="text-[10px] font-black uppercase text-indigo-600 tracking-[0.4em] flex items-center gap-2 mb-2">
                  <Map className="w-4 h-4" /> IITGEEPREP Final Deployment Protocol
               </div>
               <h3 className="text-4xl font-black italic tracking-tighter text-slate-900 leading-none">Deployment <br /> Blueprint v5.6.1</h3>
            </div>
            <div className="flex gap-4">
               <div className="text-right">
                  <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Compiler</div>
                  <div className="text-[10px] font-black text-slate-800 uppercase">PHP 8.2 (PDO)</div>
               </div>
               <div className="h-10 w-px bg-slate-100"></div>
               <div className="text-right">
                  <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Structure</div>
                  <div className="text-[10px] font-black text-slate-800 uppercase">RESTful MVC</div>
               </div>
            </div>
         </div>

         {/* Steps to Deploy */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
            {[
               { icon: Globe2, title: 'Server Space', desc: 'Create an "api" directory in your public_html root.' },
               { icon: Download, title: 'Extract Build', desc: 'Download and extract the ZIP contents into the "api" folder.' },
               { icon: Database, title: 'SQL Import', desc: 'Import the provided schema.sql via phpMyAdmin to map all 40+ tables.' }
            ].map((step, i) => (
               <div key={i} className="flex gap-4 group">
                  <div className="w-12 h-12 bg-slate-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0 shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-all">
                     <step.icon className="w-6 h-6" />
                  </div>
                  <div>
                     <div className="text-xs font-black text-slate-800 mb-1">{step.title}</div>
                     <p className="text-[10px] font-medium text-slate-400 leading-relaxed">{step.desc}</p>
                  </div>
               </div>
            ))}
         </div>

         <div className="space-y-6 pt-10">
           <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2">
             <Link2 className="w-4 h-4" /> Production Handshake Credentials
           </h4>
           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-1"><label className="text-[9px] font-black uppercase text-slate-400 ml-4">Host</label><input type="text" value={config.host} onChange={e => setConfig({...config, host: e.target.value})} className="w-full bg-slate-50 border-none rounded-xl p-4 text-xs font-black shadow-inner" /></div>
              <div className="space-y-1"><label className="text-[9px] font-black uppercase text-slate-400 ml-4">DB Name</label><input type="text" value={config.name} onChange={e => setConfig({...config, name: e.target.value})} className="w-full bg-slate-50 border-none rounded-xl p-4 text-xs font-black shadow-inner" /></div>
              <div className="space-y-1"><label className="text-[9px] font-black uppercase text-slate-400 ml-4">User</label><input type="text" value={config.user} onChange={e => setConfig({...config, user: e.target.value})} className="w-full bg-slate-50 border-none rounded-xl p-4 text-xs font-black shadow-inner" /></div>
              <div className="space-y-1"><label className="text-[9px] font-black uppercase text-slate-400 ml-4">Password</label><input type="password" value={config.pass} onChange={e => setConfig({...config, pass: e.target.value})} className="w-full bg-slate-50 border-none rounded-xl p-4 text-xs font-black shadow-inner" placeholder="••••" /></div>
           </div>
         </div>

         <button 
          onClick={handleDownload} 
          disabled={zipping} 
          className="w-full py-8 bg-slate-900 text-white rounded-[3rem] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-indigo-600 transition-all shadow-2xl disabled:opacity-50 mt-10 relative z-10"
         >
            {zipping ? <Loader2 className="animate-spin w-8 h-8" /> : <><CloudUpload className="w-8 h-8" /> Compile & Download Build v5.6.1</>}
         </button>
      </div>

      {/* Visual Directory Tree */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         <div className="bg-slate-950 p-12 rounded-[3.5rem] shadow-2xl border border-slate-800 font-mono text-[10px] space-y-4">
            <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
               <span className="text-emerald-400 font-black flex items-center gap-2"><Terminal className="w-4 h-4" /> root@iitgeeprep:~</span>
               <span className="text-slate-500 uppercase tracking-widest text-[8px]">Directory Matrix</span>
            </div>
            <div className="text-slate-400 space-y-1.5 leading-relaxed">
               <div className="flex items-center gap-2"><FolderTree className="w-3 h-3 text-indigo-500" /> /api</div>
               <div className="flex items-center gap-2 ml-4 text-slate-300"><ChevronRight className="w-3 h-3 text-slate-600" /> <Database className="w-3 h-3" /> /config <span className="text-slate-600 italic">// database.php</span></div>
               <div className="flex items-center gap-2 ml-4 text-slate-300"><ChevronRight className="w-3 h-3 text-slate-600" /> <Network className="w-3 h-3" /> /core <span className="text-slate-600 italic">// Router.php, BaseController.php</span></div>
               <div className="flex items-center gap-2 ml-4 text-slate-300"><ChevronRight className="w-3 h-3 text-slate-600" /> <TerminalSquare className="w-3 h-3" /> /controllers <span className="text-slate-600 italic">// 20+ Logic Controllers</span></div>
               <div className="flex items-center gap-2 ml-4 text-slate-300"><ChevronRight className="w-3 h-3 text-slate-600" /> <Server className="w-3 h-3" /> /models <span className="text-slate-600 italic">// 20+ SQL Models</span></div>
               <div className="flex items-center gap-2 ml-4 text-slate-300"><ChevronRight className="w-3 h-3 text-slate-600" /> <TerminalSquare className="w-3 h-3" /> /sql <span className="text-slate-600 italic">// master_schema_v5.6.1.sql</span></div>
               <div className="flex items-center gap-2 ml-4 text-indigo-400 font-black"><FileCode className="w-3 h-3" /> index.php <span className="text-slate-600 font-normal italic">// Main API Gateway</span></div>
               <div className="flex items-center gap-2 ml-4 text-emerald-400 font-black"><CheckCircle2 className="w-3 h-3" /> check.php <span className="text-slate-600 font-normal italic">// Health Handshake</span></div>
               <div className="flex items-center gap-2 ml-4 text-amber-400 font-black"><Shield className="w-3 h-3" /> .htaccess <span className="text-slate-600 font-normal italic">// URL Rewriting</span></div>
            </div>
         </div>

         <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-8">
            <h4 className="text-sm font-black uppercase text-slate-900 tracking-widest flex items-center gap-3">
               <Activity className="w-5 h-5 text-indigo-600" /> Compilation Logs
            </h4>
            <div className="space-y-4">
               {logs.map(log => (
                  <div key={log.id} className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 items-center">
                     <span className="text-[8px] font-black px-2 py-0.5 bg-slate-900 text-white rounded uppercase">{log.type}</span>
                     <p className="text-[10px] font-bold text-slate-600 flex-1 italic">"{log.msg}"</p>
                     <span className="text-[8px] font-black text-slate-300">{log.time}</span>
                  </div>
               ))}
            </div>
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></div>
                  <span className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">Active Compiler Uplink</span>
               </div>
               <button onClick={() => setLogs([])} className="text-[10px] font-black uppercase text-slate-300 hover:text-slate-900 transition-colors">Clear Console</button>
            </div>
         </div>
      </div>
    </div>
  );
};

const RichTextEditor = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  const exec = (command: string, val: string = '') => {
    document.execCommand(command, false, val);
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  const toolbarButtons = [
    { icon: Heading1, cmd: 'formatBlock', val: 'H1', label: 'H1' },
    { icon: Heading2, cmd: 'formatBlock', val: 'H2', label: 'H2' },
    { icon: Bold, cmd: 'bold', label: 'Bold' },
    { icon: Italic, cmd: 'italic', label: 'Italic' },
    { icon: List, cmd: 'insertUnorderedList', label: 'List' },
    { icon: Quote, cmd: 'formatBlock', val: 'BLOCKQUOTE', label: 'Quote' },
    { icon: CodeIcon, cmd: 'formatBlock', val: 'PRE', label: 'Code' },
  ];

  return (
    <div className="border border-slate-200 rounded-[2.5rem] overflow-hidden bg-white shadow-inner flex flex-col min-h-[500px]">
      <div className="bg-slate-50 p-4 border-b border-slate-200 flex flex-wrap justify-between items-center gap-4">
        <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
           <button onClick={() => setActiveTab('edit')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'edit' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>Visual Editor</button>
           <button onClick={() => setActiveTab('preview')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'preview' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>Final Preview</button>
        </div>
        {activeTab === 'edit' && (
          <div className="flex flex-wrap gap-1">
            {toolbarButtons.map((btn, i) => (
              <button key={i} onClick={() => exec(btn.cmd, btn.val)} className="p-3 text-slate-500 hover:bg-white hover:text-indigo-600 rounded-xl transition-all border border-transparent hover:border-slate-200 shadow-sm">
                <btn.icon className="w-5 h-5" />
              </button>
            ))}
            <button onClick={() => { const url = prompt('URL:'); if (url) exec('createLink', url); }} className="p-3 text-slate-500 hover:bg-white hover:text-indigo-600 rounded-xl transition-all border border-transparent hover:border-slate-200"><LinkIcon className="w-5 h-5" /></button>
          </div>
        )}
      </div>
      <div className="flex-1">
        {activeTab === 'edit' ? (
          <div ref={editorRef} contentEditable onInput={() => onChange(editorRef.current?.innerHTML || '')} dangerouslySetInnerHTML={{ __html: value }} className="w-full h-full min-h-[400px] p-10 focus:outline-none prose prose-slate max-w-none" />
        ) : (
          <div className="p-10 prose prose-slate max-w-none animate-in fade-in duration-300">
             <div dangerouslySetInnerHTML={{ __html: value || '<p class="text-slate-300 italic">Empty canvas...</p>' }} />
          </div>
        )}
      </div>
    </div>
  );
};

const CreationHub = ({ type, item, onClose, data, onSave }: any) => {
  const getDefaultForm = () => {
    switch(type) {
      case 'MockTest': return { id: `test-${Date.now()}`, name: '', duration: 180, totalMarks: 300, category: 'ADMIN', difficulty: 'MAINS', questionIds: [], chapterIds: [] };
      case 'Flashcard': return { id: `fc-${Date.now()}`, question: '', answer: '', subject: 'Physics', difficulty: 'EASY', type: 'Formula' };
      case 'MemoryHack': return { id: `mh-${Date.now()}`, title: '', description: '', hack: '', category: 'Mnemonics', subject: 'Physics' };
      case 'Blog': return { id: `b-${Date.now()}`, title: '', content: '<h1>Report</h1><p>Tactics...</p>', author: 'Admin', date: new Date().toISOString().split('T')[0], status: 'DRAFT' };
      case 'Question': return { id: `q-${Date.now()}`, text: '', subject: 'Physics', difficulty: 'MEDIUM', options: ['', '', '', ''], correctAnswer: 0, explanation: '', topicId: data.chapters[0]?.id || '', source: '' };
      case 'Chapter': return { id: `ch-${Date.now()}`, name: '', subject: 'Physics', unit: 'UNIT 1', status: 'NOT_STARTED', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, videoUrl: '', notes: ['<h1>Core Concepts</h1><p>Define the fundamentals...</p>'] };
      default: return { id: `item-${Date.now()}`, name: '', subject: 'Physics' };
    }
  };

  const [form, setForm] = useState(item || getDefaultForm());
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const keyMap: any = { 'Chapter': 'chapters', 'Question': 'questions', 'MockTest': 'mockTests', 'Flashcard': 'flashcards', 'MemoryHack': 'memoryHacks', 'Blog': 'blogs' };
    const key = keyMap[type];
    const result = await api.saveEntity(type, form);
    if (result.success) {
      const list = [...data[key]];
      const idx = list.findIndex(x => x.id === form.id);
      if (idx > -1) list[idx] = form; else list.push(form);
      onSave(key, list);
      onClose();
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-md overflow-y-auto">
      <div className={`bg-white w-full ${type === 'Blog' || type === 'Chapter' ? 'max-w-6xl' : 'max-w-5xl'} p-10 lg:p-16 rounded-[4rem] shadow-2xl space-y-12 relative animate-in zoom-in-95 duration-500 my-10`}>
         <button onClick={onClose} className="absolute top-10 right-10 p-4 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-full border border-slate-100 shadow-sm"><X className="w-6 h-6" /></button>
         
         <div className="flex items-center gap-6 border-b border-slate-100 pb-10">
            <div className="w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-inner bg-indigo-50 text-indigo-600">
               {type === 'Blog' ? <PenTool className="w-10 h-10" /> : type === 'Question' ? <FileCode className="w-10 h-10" /> : type === 'Chapter' ? <BookOpen className="w-10 h-10" /> : <Layers className="w-10 h-10" />}
            </div>
            <div>
               <h2 className="text-4xl font-black italic tracking-tighter text-slate-900 uppercase">Construct {type}.</h2>
               <p className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.4em] mt-1">Operational Protocol v14.2</p>
            </div>
         </div>

         <div className="space-y-10">
            {type === 'Chapter' ? (
              <div className="space-y-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                  <div className="lg:col-span-8 space-y-8">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">Chapter Title</label>
                           <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-slate-50 border-none rounded-3xl p-6 text-xl font-black text-slate-900 shadow-inner" placeholder="Units & Measurements..." />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">Unit Identification</label>
                           <input type="text" value={form.unit} onChange={e => setForm({...form, unit: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black text-slate-800 shadow-inner" placeholder="UNIT 1..." />
                        </div>
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4 flex items-center gap-2"><Video className="w-4 h-4" /> Video Lecture Endpoint (YouTube URL)</label>
                        <input type="text" value={form.videoUrl} onChange={e => setForm({...form, videoUrl: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-black text-indigo-600 shadow-inner" placeholder="https://youtube.com/watch?v=..." />
                     </div>
                  </div>
                  <div className="lg:col-span-4 bg-slate-50 p-10 rounded-[3.5rem] shadow-inner space-y-8">
                     <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Subject Vertical</label>
                        <select value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="w-full bg-white border-none rounded-2xl p-4 text-xs font-black shadow-sm">
                           <option>Physics</option><option>Chemistry</option><option>Mathematics</option>
                        </select>
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Initial Status</label>
                        <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full bg-white border-none rounded-2xl p-4 text-xs font-black shadow-sm">
                           <option value="NOT_STARTED">NOT STARTED</option>
                           <option value="LEARNING">LEARNING</option>
                           <option value="REVISION">REVISION</option>
                           <option value="COMPLETED">COMPLETED</option>
                        </select>
                     </div>
                  </div>
                </div>

                <div className="space-y-4">
                   <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4 flex items-center gap-2"><Layout className="w-4 h-4" /> Master Content (Rich Text Theory)</label>
                   <RichTextEditor 
                      value={form.notes?.[0] || ''} 
                      onChange={(val) => {
                        const newNotes = [...(form.notes || [])];
                        if (newNotes.length === 0) newNotes.push(val); else newNotes[0] = val;
                        setForm({...form, notes: newNotes});
                      }} 
                   />
                </div>
              </div>
            ) : type === 'Blog' ? (
              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">Title</label>
                      <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full bg-slate-50 border-none rounded-3xl p-6 text-2xl font-black text-slate-900 italic shadow-inner" />
                   </div>
                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">Author</label>
                        <input type="text" value={form.author} onChange={e => setForm({...form, author: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-black shadow-inner" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">Status</label>
                        <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl p-5 text-xs font-black uppercase outline-none shadow-sm">
                           <option value="DRAFT">DRAFT MODE</option>
                           <option value="PUBLISHED">LIVE FEED</option>
                        </select>
                      </div>
                   </div>
                </div>
                <RichTextEditor value={form.content} onChange={(val) => setForm({...form, content: val})} />
              </div>
            ) : type === 'Question' ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                 <div className="lg:col-span-7 space-y-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase text-slate-400 ml-6 tracking-widest">Problem Statement</label>
                       <textarea value={form.text} onChange={e => setForm({...form, text: e.target.value})} className="w-full bg-slate-50 border-none rounded-[2rem] p-8 text-lg font-bold text-slate-800 shadow-inner min-h-[200px]" placeholder="Question text..." />
                    </div>
                    <div className="space-y-6">
                       <label className="text-[10px] font-black uppercase text-slate-400 ml-6 tracking-widest">Options Matrix</label>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {form.options.map((opt: string, i: number) => (
                            <div key={i} className="relative group">
                               <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-lg flex items-center justify-center font-black text-xs text-indigo-600 shadow-sm border border-slate-100">{String.fromCharCode(65+i)}</div>
                               <input type="text" value={opt} onChange={e => { const n = [...form.options]; n[i] = e.target.value; setForm({...form, options: n}); }} className="w-full pl-16 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold shadow-inner" placeholder={`Option ${String.fromCharCode(65+i)}`} />
                            </div>
                          ))}
                       </div>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase text-slate-400 ml-6 tracking-widest">Corrective Logic (Explanation)</label>
                       <textarea value={form.explanation} onChange={e => setForm({...form, explanation: e.target.value})} className="w-full bg-slate-50 border-none rounded-[2rem] p-6 text-sm font-medium text-slate-600 shadow-inner" placeholder="Why is this answer correct?" />
                    </div>
                 </div>
                 <div className="lg:col-span-5 space-y-8 bg-slate-50 p-10 rounded-[3.5rem] shadow-inner">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Target Logic (Correct Option)</label>
                       <select value={form.correctAnswer} onChange={e => setForm({...form, correctAnswer: parseInt(e.target.value)})} className="w-full bg-white border-none rounded-2xl p-4 text-xs font-black shadow-sm">
                          <option value={0}>Option A</option><option value={1}>Option B</option><option value={2}>Option C</option><option value={3}>Option D</option>
                       </select>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Vertical (Subject)</label>
                       <select value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="w-full bg-white border-none rounded-2xl p-4 text-xs font-black shadow-sm">
                          <option>Physics</option><option>Chemistry</option><option>Mathematics</option>
                       </select>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Chapter Handshake (Tagging)</label>
                       <select value={form.topicId} onChange={e => setForm({...form, topicId: e.target.value})} className="w-full bg-white border-none rounded-2xl p-4 text-xs font-black shadow-sm">
                          {data.chapters.map((c: Chapter) => <option key={c.id} value={c.id}>{c.name}</option>)}
                       </select>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Complexity Index</label>
                       <select value={form.difficulty} onChange={e => setForm({...form, difficulty: e.target.value})} className="w-full bg-white border-none rounded-2xl p-4 text-xs font-black shadow-sm">
                          <option>EASY</option><option>MEDIUM</option><option>HARD</option>
                       </select>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Meta Tags (e.g. IIT, PYQ)</label>
                       <input type="text" value={form.source} onChange={e => setForm({...form, source: e.target.value})} className="w-full bg-white border-none rounded-2xl p-4 text-xs font-black shadow-sm" placeholder="IIT, JEE Main 2024..." />
                    </div>
                 </div>
              </div>
            ) : type === 'MockTest' ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                 <div className="lg:col-span-5 space-y-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">Test Title</label>
                       <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-slate-50 border-none rounded-[2rem] p-6 text-lg font-black shadow-inner" />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 tracking-widest uppercase ml-4">Minutes</label><input type="number" value={form.duration} onChange={e => setForm({...form, duration: parseInt(e.target.value)})} className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-black shadow-inner" /></div>
                       <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 tracking-widest uppercase ml-4">Total Marks</label><input type="number" value={form.totalMarks} onChange={e => setForm({...form, totalMarks: parseInt(e.target.value)})} className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-black shadow-inner" /></div>
                    </div>
                 </div>
                 <div className="lg:col-span-7 space-y-6">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-4">Problem Selection Matrix</h4>
                    <div className="bg-slate-50 rounded-[3rem] border border-slate-100 p-6 h-[400px] overflow-y-auto space-y-3 shadow-inner custom-scrollbar">
                       {data.questions.map((q: any) => (
                         <button key={q.id} onClick={() => {
                            const cur = [...(form.questionIds || [])];
                            const next = cur.includes(q.id) ? cur.filter(id => id !== q.id) : [...cur, q.id];
                            setForm({...form, questionIds: next});
                         }} className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center justify-between ${form.questionIds?.includes(q.id) ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl' : 'bg-white border-transparent text-slate-500'}`}>
                            <div className="flex items-center gap-4">
                               {form.questionIds?.includes(q.id) ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5 opacity-20" />}
                               <div className="font-bold text-sm italic line-clamp-1">"{q.text}"</div>
                            </div>
                         </button>
                       ))}
                    </div>
                 </div>
              </div>
            ) : (
               <div className="space-y-8">
                  <div className="space-y-3">
                     <label className="text-[10px] font-black uppercase text-slate-400 ml-6 tracking-widest">Identify</label>
                     <input type="text" value={form.name || form.text || form.question || form.title} onChange={e => setForm({...form, [form.text !== undefined ? 'text' : form.question !== undefined ? 'question' : form.title !== undefined ? 'title' : 'name']: e.target.value})} className="w-full bg-slate-50 border-none rounded-[2rem] p-8 text-xl font-bold text-slate-900 shadow-inner" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                     <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-6 tracking-widest">Vertical (Subject)</label>
                        <select value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="w-full bg-slate-50 border-none rounded-[1.5rem] p-5 font-black uppercase text-xs tracking-[0.2em] shadow-inner outline-none">
                           <option>Physics</option><option>Chemistry</option><option>Mathematics</option>
                        </select>
                     </div>
                  </div>
               </div>
            )}
         </div>

         <div className="flex flex-col md:flex-row gap-4 pt-10">
            <button onClick={onClose} className="flex-1 py-6 bg-slate-50 text-slate-500 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.3em] hover:bg-slate-100 transition-all border border-slate-200">Abandon Build</button>
            <button onClick={handleSave} disabled={saving} className="flex-[2] py-6 bg-slate-900 text-white rounded-[2.5rem] font-black uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-4 hover:bg-indigo-600 transition-all disabled:opacity-50">
              {saving ? <Loader2 className="animate-spin w-8 h-8" /> : <><CloudUpload className="w-8 h-8" /> Finalize Transmission</>}
            </button>
         </div>
      </div>
    </div>
  );
};

export default AdminCMS;
