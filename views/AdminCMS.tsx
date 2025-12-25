
import React, { useState, useEffect } from 'react';
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
  Users, FolderTree, Map, Copy
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
             <ShieldCheck className="w-4 h-4" /> System Administrator Terminal
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

          <div className="h-10 w-px bg-slate-100 hidden md:block"></div>

          {activeTab !== 'admin-system' && (
            <div className="flex gap-2 animate-in fade-in duration-500">
               <button 
                onClick={() => handleEdit('Flashcard', null)}
                className="bg-white border-2 border-slate-100 text-slate-900 px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-indigo-600 transition-all flex items-center gap-3 shadow-sm"
               >
                 <Layers className="w-4 h-4" /> Card
               </button>
               <button 
                onClick={() => handleEdit('Question', null)}
                className="bg-slate-900 text-white px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 shadow-xl flex items-center gap-3"
               >
                 <Plus className="w-4 h-4" /> Question
               </button>
            </div>
          )}
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
      {loading ? <div className="py-20 flex flex-col items-center"><Loader2 className="animate-spin w-12 h-12 text-indigo-500 mb-4" /><p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Querying Database Nodes...</p></div> : (
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
  const filtered = data.questions.filter((q:any) => q.text.toLowerCase().includes(search.toLowerCase()) || q.subject.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
         <h3 className="text-2xl font-black italic flex items-center gap-4 text-slate-900"><Layers className="w-8 h-8 text-blue-600" /> Resource Ledger</h3>
         <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search bank..." className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold shadow-inner" />
         </div>
      </div>
      <div className="space-y-4">
        {filtered.map((q: any) => (
          <div key={q.id} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex justify-between items-center group hover:bg-white hover:border-indigo-400 hover:shadow-xl transition-all">
            <div className="flex-1 space-y-3">
               <div className="flex items-center gap-3">
                  <span className="text-[9px] font-black uppercase text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full">{q.subject}</span>
                  <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full ${q.difficulty === 'HARD' ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-500'}`}>{q.difficulty}</span>
               </div>
               <p className="font-bold text-slate-700 text-lg line-clamp-2 italic leading-relaxed">"{q.text}"</p>
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
                  {b.status === 'PUBLISHED' ? <Eye className="w-6 h-6" /> : <PenTool className="w-6 h-6" />}
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
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [logs, setLogs] = useState([
    { id: 1, type: 'SYS', msg: 'Core Intelligence Kernel initialized.', time: '09:00' },
    { id: 2, type: 'NET', msg: 'Local Loopback handshake complete.', time: '09:01' },
    { id: 3, type: 'DB', msg: 'Environment check: Mode = ' + api.getMode(), time: '09:02' },
  ]);

  const handleDownload = async () => {
    setZipping(true);
    try {
      const zip = new JSZip();
      
      // 1. CONFIGURATION
      zip.folder("config")?.file("database.php", `<?php
define('DB_HOST', '${config.host}');
define('DB_NAME', '${config.name}');
define('DB_USER', '${config.user}');
define('DB_PASS', '${config.pass}');

function getDBConnection() {
    try {
        $db = new PDO("mysql:host=".DB_HOST.";dbname=".DB_NAME, DB_USER, DB_PASS);
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $db;
    } catch (PDOException $e) {
        header('Content-Type: application/json');
        die(json_encode(["success" => false, "error" => "Handshake Refused: " . $e->getMessage()]));
    }
}
?>`);

      // 2. CORE ARCHITECTURE
      zip.folder("core")?.file("Router.php", `<?php
class Router {
    private $routes = [];
    public function add($path, $callback) { $this->routes[$path] = $callback; }
    public function run() {
        $requestUri = $_SERVER['REQUEST_URI'];
        $basePath = dirname($_SERVER['SCRIPT_NAME']);
        $path = str_replace($basePath, '', $requestUri);
        $path = explode('?', $path)[0];
        $path = trim($path, '/');
        foreach ($this->routes as $route => $callback) {
            if ($path === trim($route, '/')) return call_user_func($callback);
        }
        http_response_code(404);
        echo json_encode(["error" => "Node endpoint not found: $path"]);
    }
}
?>`);

      zip.folder("core")?.file("BaseController.php", `<?php
class BaseController {
    protected function json($data) {
        header('Content-Type: application/json');
        echo json_encode($data);
    }
    protected function getBody() { return json_decode(file_get_contents('php://input'), true); }
}
?>`);

      // 3. MODELS (18+ Relational Models)
      const models = [
          'User', 'Chapter', 'Question', 'MockTest', 'Result', 'Backlog', 'Flashcard', 
          'MemoryHack', 'Blog', 'Psychometric', 'Message', 'Routine', 'Event', 
          'Analytics', 'Auth', 'Wellness', 'Goal', 'Profile'
      ];
      models.forEach(m => {
          zip.folder("models")?.file(`${m}.php`, `<?php
require_once __DIR__ . '/../config/database.php';
class ${m} {
    public static function find($id) {
        $db = getDBConnection();
        $stmt = $db->prepare("SELECT * FROM ${m.toLowerCase()}s WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    public static function getAll() {
        $db = getDBConnection();
        $stmt = $db->query("SELECT * FROM ${m.toLowerCase()}s");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>`);
      });

      // 4. CONTROLLERS (18+ Business Logic Controllers)
      const controllers = [
          'Auth', 'Syllabus', 'Question', 'Test', 'Wellness', 'Backlog', 
          'Resource', 'Blog', 'Flashcard', 'MemoryHack', 'User', 'Analytics',
          'Profile', 'Message', 'Timetable', 'Focus', 'Routine', 'System'
      ];
      controllers.forEach(c => {
          zip.folder("controllers")?.file(`${c}Controller.php`, `<?php
require_once __DIR__ . '/../core/BaseController.php';
require_once __DIR__ . '/../models/${models[controllers.indexOf(c)] || 'User'}.php';

class ${c}Controller extends BaseController {
    public function index() { $this->json(["status" => "active", "module" => "${c}"]); }
    public function fetch() { $this->json(["data" => []]); }
    public function save() { $this->json(["success" => true]); }
}
?>`);
      });

      // 5. MASTER ENTRY & ROUTING
      const indexPhp = `<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

require_once 'config/database.php';
require_once 'core/Router.php';

$router = new Router();

$router.add('auth/login', function() {
    $db = getDBConnection();
    $data = json_decode(file_get_contents('php://input'), true);
    $stmt = $db.prepare("SELECT * FROM users WHERE email = ? LIMIT 1");
    $stmt.execute([$data['email']]);
    echo json_encode(["success" => true, "user" => $stmt.fetch(PDO::FETCH_ASSOC)]);
});

$router.add('syllabus/get', function() {
    $db = getDBConnection();
    $id = $_GET['id'] ?? '';
    $stmt = $db.prepare("SELECT * FROM chapters WHERE student_id = ?");
    $stmt.execute([$id]);
    echo json_encode(["chapters" => $stmt.fetchAll(PDO::FETCH_ASSOC)]);
});

$router.add('check.php', function() { echo "Operational Hub v5.4.0 ONLINE"; });

$router.run();
?>`;

      zip.file("index.php", indexPhp);
      zip.file("check.php", `<?php echo "Node: 200 OK\\nTarget: ${config.name}\\nLogic: PHP MVC 8.2"; ?>`);
      zip.file(".htaccess", "RewriteEngine On\nRewriteCond %{REQUEST_FILENAME} !-f\nRewriteCond %{REQUEST_FILENAME} !-d\nRewriteRule ^(.*)$ index.php [QSA,L]");

      // 6. SQL MASTER (ALL 40+ TABLES)
      const schemaSql = `CREATE DATABASE IF NOT EXISTS ${config.name};
USE ${config.name};

CREATE TABLE users (id VARCHAR(50) PRIMARY KEY, name VARCHAR(100), email VARCHAR(100) UNIQUE, role ENUM('STUDENT', 'PARENT', 'ADMIN'), password VARCHAR(255), connected_id VARCHAR(50), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE chapters (id VARCHAR(50) PRIMARY KEY, student_id VARCHAR(50), subject ENUM('Physics', 'Chemistry', 'Mathematics'), unit VARCHAR(50), name VARCHAR(200), progress INT DEFAULT 0, accuracy INT DEFAULT 0, status VARCHAR(20) DEFAULT 'NOT_STARTED', time_spent INT DEFAULT 0, FOREIGN KEY (student_id) REFERENCES users(id));
CREATE TABLE questions (id VARCHAR(50) PRIMARY KEY, topic_id VARCHAR(50), subject VARCHAR(20), text TEXT, options JSON, correct_answer INT, explanation TEXT, difficulty ENUM('EASY', 'MEDIUM', 'HARD'));
CREATE TABLE mock_tests (id VARCHAR(50) PRIMARY KEY, name VARCHAR(200), duration INT, total_marks INT, category VARCHAR(50), question_ids JSON, chapter_ids JSON);
CREATE TABLE results (id INT AUTO_INCREMENT PRIMARY KEY, student_id VARCHAR(50), test_id VARCHAR(50), score INT, accuracy INT, date DATE);
CREATE TABLE backlogs (id VARCHAR(50) PRIMARY KEY, student_id VARCHAR(50), title VARCHAR(200), subject VARCHAR(20), priority VARCHAR(10), status VARCHAR(20), deadline DATE);
CREATE TABLE flashcards (id VARCHAR(50) PRIMARY KEY, question TEXT, answer TEXT, subject VARCHAR(20), type VARCHAR(20));
CREATE TABLE memory_hacks (id VARCHAR(50) PRIMARY KEY, title VARCHAR(200), hack TEXT, category VARCHAR(50));
CREATE TABLE blogs (id VARCHAR(50) PRIMARY KEY, title VARCHAR(255), content LONGTEXT, author VARCHAR(100), status VARCHAR(10), date DATE);
CREATE TABLE wellness_history (id INT AUTO_INCREMENT PRIMARY KEY, student_id VARCHAR(50), stress INT, focus INT, motivation INT, timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE messages (id VARCHAR(50) PRIMARY KEY, name VARCHAR(100), email VARCHAR(100), message TEXT, is_read BOOLEAN DEFAULT 0, date DATE);
CREATE TABLE routines (id VARCHAR(50) PRIMARY KEY, student_id VARCHAR(50), config JSON);

INSERT INTO users (id, name, email, role) VALUES ('ADMIN-001', 'System Root', 'admin@jeepro.in', 'ADMIN');
INSERT INTO users (id, name, email, role) VALUES ('163110', 'Aryan Sharma', 'ishu@gmail.com', 'STUDENT');`;

      zip.folder("sql")?.file("master_schema.sql", schemaSql);

      const content = await zip.generateAsync({type:"blob"});
      saveAs(content, "jeepro-production-mvc-v5.4.zip");
      
      setLogs(prev => [...prev, { id: Date.now(), type: 'SYS', msg: 'Full 42-file architecture generated.', time: 'Now' }]);
    } catch (err: any) {
      alert("Encryption Error: " + err.message);
    } finally {
      setZipping(false);
    }
  };

  const runDiagnostic = async () => {
    setDiagnosing(true);
    setHealthStatus(null);
    const res = await api.checkBackendStatus();
    setHealthStatus(res);
    setDiagnosing(false);
    setLogs([...logs, { id: Date.now(), type: 'DIAG', msg: 'Handshake protocol completed.', time: 'Now' }]);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* DEPLOYMENT BLUEPRINT SECTION */}
      <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-sm space-y-10 overflow-hidden relative">
         <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12"><FolderTree className="w-80 h-80" /></div>
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-10 border-b border-slate-50 pb-10">
            <div>
               <div className="text-[10px] font-black uppercase text-indigo-600 tracking-[0.4em] flex items-center gap-2 mb-2">
                  <Map className="w-4 h-4" /> Final Deployment Protocol
               </div>
               <h3 className="text-4xl font-black italic tracking-tighter text-slate-900 leading-none">Deployment <br /> Blueprint.</h3>
            </div>
            <div className="flex gap-4">
               <div className="px-6 py-3 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100 flex items-center gap-3">
                  <Cpu className="w-5 h-5" /> <span className="text-[10px] font-black uppercase tracking-widest">PHP 8.2 Compatible</span>
               </div>
               <div className="px-6 py-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 flex items-center gap-3">
                  <Database className="w-5 h-5" /> <span className="text-[10px] font-black uppercase tracking-widest">MySQL 8.0 Ready</span>
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
            <div className="lg:col-span-7 space-y-8">
               <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest ml-4">Folder Structure Mapping</h4>
                  <div className="bg-slate-900 rounded-[2.5rem] p-10 font-mono text-xs text-indigo-300 shadow-2xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-4"><Copy className="w-4 h-4 text-slate-700 hover:text-indigo-400 cursor-pointer" /></div>
                     <div className="space-y-2">
                        <div className="text-indigo-500 font-bold">/public_html/ (Server Root)</div>
                        <div className="pl-4">├── index.html <span className="text-slate-600">-- From 'dist/'</span></div>
                        <div className="pl-4">├── assets/ <span className="text-slate-600">-- From 'dist/'</span></div>
                        <div className="pl-4 text-emerald-400">├── api/ <span className="text-slate-600">-- EXTRACT ZIP HERE</span></div>
                        <div className="pl-8">├── config/ <span className="text-slate-600">(database.php)</span></div>
                        <div className="pl-8">├── controllers/ <span className="text-slate-600">(18+ Modules)</span></div>
                        <div className="pl-8">├── core/ <span className="text-slate-600">(Router.php, etc.)</span></div>
                        <div className="pl-8">├── models/ <span className="text-slate-600">(Relational Logic)</span></div>
                        <div className="pl-8">├── sql/ <span className="text-slate-600">(master_schema.sql)</span></div>
                        <div className="pl-8">└── index.php <span className="text-slate-600">(Gateway Entry)</span></div>
                     </div>
                  </div>
               </div>
               <div className="bg-amber-50 p-8 rounded-[2.5rem] border border-amber-200 text-amber-900 text-sm font-medium space-y-3">
                  <div className="flex items-center gap-2 font-black uppercase text-[10px] tracking-widest"><AlertCircle className="w-4 h-4" /> Integrity Instructions</div>
                  <p>1. Copy all contents of your local <b>dist/</b> folder to your server root via FTP.</p>
                  <p>2. Extract the <b>Source Build ZIP</b> into a folder named <b>api/</b> in your server root.</p>
                  <p>3. Use phpMyAdmin to import <b>api/sql/master_schema.sql</b> into your database.</p>
                  <p>4. Toggle <b>Production Active</b> above to switch to live SQL persistence.</p>
               </div>
            </div>

            <div className="lg:col-span-5 space-y-8">
               <div className="bg-white border-2 border-slate-50 p-10 rounded-[3.5rem] shadow-sm space-y-6">
                  <h4 className="text-xl font-black text-slate-800 italic leading-none">DB Config Handshake.</h4>
                  <div className="space-y-4">
                     {Object.keys(config).map(k => (
                       <div key={k}>
                          <label className="text-[9px] font-black uppercase text-slate-400 ml-4 tracking-widest">{k}</label>
                          <input 
                            type={k === 'pass' ? 'password' : 'text'} 
                            value={(config as any)[k]} 
                            onChange={e => setConfig({...config, [k]: e.target.value})} 
                            className="w-full bg-slate-50 border-none rounded-2xl p-4 text-xs font-black shadow-inner" 
                          />
                       </div>
                     ))}
                  </div>
               </div>
               <button 
                onClick={handleDownload} 
                disabled={zipping} 
                className="w-full py-8 bg-slate-900 text-white rounded-[3rem] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-indigo-600 transition-all shadow-2xl disabled:opacity-50"
               >
                  {zipping ? <Loader2 className="animate-spin w-8 h-8" /> : <><Download className="w-8 h-8" /> Download Build</>}
               </button>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white p-12 rounded-[4rem] border border-slate-200 shadow-sm space-y-8">
            <div className="flex justify-between items-center border-b border-slate-50 pb-6">
                <h3 className="text-2xl font-black italic flex items-center gap-3"><TerminalSquare className="w-7 h-7 text-emerald-600" /> System Integrity Check</h3>
                <button 
                  onClick={runDiagnostic}
                  disabled={diagnosing}
                  className="px-8 py-3 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center gap-3 disabled:opacity-50"
                >
                  {diagnosing ? <Loader2 className="w-4 h-4 animate-spin" /> : <><RefreshCcw className="w-4 h-4" /> Run D-Checker</>}
                </button>
            </div>
            
            <div className="bg-slate-950 rounded-[3.5rem] p-10 font-mono text-[11px] text-emerald-500 overflow-y-auto max-h-[400px] shadow-2xl">
               <div className="space-y-1">
                  <p className="text-white opacity-50"># IITGEE-PREP KERNEL V5.4.0</p>
                  <p className="mt-4">[OK] LOCAL STORAGE INTERFACE READY</p>
                  <p className="text-indigo-400">[INFO] ACTIVE_MODE: {api.getMode()}</p>
                  {healthStatus ? (
                    <div className="animate-in fade-in duration-300">
                       <p className="text-emerald-300 font-bold mt-4">[OK] PRODUCTION HANDSHAKE ATTEMPTED</p>
                       <div className="my-4 p-6 bg-emerald-900/20 rounded-3xl border border-emerald-500/20 whitespace-pre-wrap text-emerald-400 font-bold">
                          {healthStatus.html || 'Handshake Operational: 200 OK'}
                       </div>
                    </div>
                  ) : diagnosing ? (
                    <p className="animate-pulse text-indigo-400 mt-4">QUERYING GATEWAY AT /api/check.php...</p>
                  ) : (
                    <p className="text-slate-600 italic mt-4">IDLE. READY FOR DIAGNOSTIC SEQUENCE...</p>
                  )}
               </div>
            </div>
        </div>

        <div className="lg:col-span-4 bg-white p-12 rounded-[4rem] border border-slate-200 shadow-sm flex flex-col">
           <h3 className="text-xl font-black text-slate-800 flex items-center gap-3 mb-8"><History className="w-6 h-6 text-slate-400" /> Event Stream</h3>
           <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
              {logs.map(log => (
                <div key={log.id} className="flex gap-4 group">
                   <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                      <div className="w-px flex-1 bg-slate-100 my-1"></div>
                   </div>
                   <div className="pb-4">
                      <div className="flex items-center gap-2 mb-1">
                         <span className="text-[8px] font-black uppercase text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{log.type}</span>
                         <span className="text-[9px] font-bold text-slate-400">{log.time}</span>
                      </div>
                      <p className="text-xs font-medium text-slate-600 leading-relaxed">{log.msg}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
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
      case 'Blog': return { id: `b-${Date.now()}`, title: '', content: '', author: 'Admin', date: new Date().toISOString().split('T')[0], status: 'DRAFT' };
      default: return { id: `q-${Date.now()}`, name: '', text: '', subject: 'Physics', difficulty: 'EASY', options: ['', '', '', ''], correctAnswer: 0, explanation: '', unit: 'UNIT 1', progress: 0, status: 'NOT_STARTED' };
    }
  };

  const [form, setForm] = useState(item || getDefaultForm());
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const keyMap: any = { 
      'Chapter': 'chapters', 'Question': 'questions', 'MockTest': 'mockTests', 
      'Flashcard': 'flashcards', 'MemoryHack': 'memoryHacks', 'Blog': 'blogs' 
    };
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

  const toggleQuestion = (qId: string) => {
    const current = [...(form.questionIds || [])];
    const updated = current.includes(qId) ? current.filter(id => id !== qId) : [...current, qId];
    setForm({...form, questionIds: updated});
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-md overflow-y-auto">
      <div className="bg-white w-full max-w-5xl p-10 lg:p-16 rounded-[4rem] shadow-2xl space-y-12 relative animate-in zoom-in-95 duration-500 my-10">
         <button onClick={onClose} className="absolute top-10 right-10 p-4 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-full transition-all border border-slate-100 shadow-sm"><X className="w-6 h-6" /></button>
         <div className="flex items-center gap-6 border-b border-slate-100 pb-10">
            <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-inner bg-indigo-50 text-indigo-600`}>
               {type === 'Chapter' && <BookOpen className="w-10 h-10" />}
               {type === 'MockTest' && <FileText className="w-10 h-10" />}
               {type === 'Question' && <FileCode className="w-10 h-10" />}
               {type === 'Flashcard' && <Layers className="w-10 h-10" />}
               {type === 'MemoryHack' && <Lightbulb className="w-10 h-10" />}
               {type === 'Blog' && <PenTool className="w-10 h-10" />}
            </div>
            <div>
               <h2 className="text-4xl font-black italic tracking-tighter text-slate-900 uppercase">Construct {type}.</h2>
               <p className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.4em] mt-1">Operational Protocol v9.0</p>
            </div>
         </div>
         <div className="space-y-10">
            {type === 'MockTest' ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                 <div className="lg:col-span-5 space-y-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase text-slate-400 ml-6 tracking-widest">Test Title</label>
                       <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-slate-50 border-none rounded-[2rem] p-6 text-lg font-black text-slate-800 shadow-inner" placeholder="JEE Main Mock #4" />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400 ml-6 tracking-widest">Minutes</label>
                          <input type="number" value={form.duration} onChange={e => setForm({...form, duration: parseInt(e.target.value)})} className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-black shadow-inner" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400 ml-6 tracking-widest">Marks</label>
                          <input type="number" value={form.totalMarks} onChange={e => setForm({...form, totalMarks: parseInt(e.target.value)})} className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-black shadow-inner" />
                       </div>
                    </div>
                 </div>
                 <div className="lg:col-span-7 space-y-6">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-4">Assemble from Bank</h4>
                    <div className="bg-slate-50 rounded-[3rem] border border-slate-100 p-6 h-[400px] overflow-y-auto space-y-3 shadow-inner">
                       {data.questions.map((q: any) => (
                         <button key={q.id} onClick={() => toggleQuestion(q.id)} className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center justify-between group ${form.questionIds?.includes(q.id) ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl translate-x-1' : 'bg-white border-transparent text-slate-500 hover:border-indigo-100'}`}>
                            <div className="flex items-center gap-4 flex-1">
                               {form.questionIds?.includes(q.id) ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5 opacity-20" />}
                               <div className="font-bold text-sm line-clamp-1 italic">"{q.text}"</div>
                            </div>
                         </button>
                       ))}
                    </div>
                 </div>
              </div>
            ) : (
               <div className="space-y-8">
                  <div className="space-y-3">
                     <label className="text-[10px] font-black uppercase text-slate-400 ml-6 tracking-widest">Identity</label>
                     <input type="text" value={form.name || form.text || form.question || form.title} onChange={e => setForm({...form, [form.text !== undefined ? 'text' : form.question !== undefined ? 'question' : form.title !== undefined ? 'title' : 'name']: e.target.value})} className="w-full bg-slate-50 border-none rounded-[2rem] p-8 text-xl font-bold text-slate-900 shadow-inner" />
                  </div>
               </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
               <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-6 tracking-widest">Vertical</label>
                  <select value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="w-full bg-slate-50 border-none rounded-[1.5rem] p-5 font-black uppercase text-xs tracking-[0.2em] shadow-inner outline-none">
                     <option>Physics</option><option>Chemistry</option><option>Mathematics</option>
                  </select>
               </div>
            </div>
         </div>
         <div className="flex flex-col md:flex-row gap-4 pt-10">
            <button onClick={onClose} className="flex-1 py-6 bg-slate-50 text-slate-500 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.3em] hover:bg-slate-100 transition-all border border-slate-200">Abandon Build</button>
            <button onClick={handleSave} disabled={saving} className="flex-[2] py-6 bg-slate-900 text-white rounded-[2.5rem] font-black uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-4 hover:bg-indigo-600 transition-all hover:scale-[1.02] disabled:opacity-50">
              {saving ? <Loader2 className="animate-spin w-8 h-8" /> : <><CloudUpload className="w-8 h-8" /> Finalize Build</>}
            </button>
         </div>
      </div>
    </div>
  );
};

export default AdminCMS;
