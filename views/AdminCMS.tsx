
import React, { useState, useEffect, useRef } from 'react';
import JSZip from 'jszip';
import saveAs from 'file-saver';
import { StudentData, Question, MockTest, Chapter, UserRole, ChapterStatus, Flashcard, MemoryHack, Blog, Subject, UserAccount } from '../types';
import { api } from '../services/apiService';
import { chatWithTutor } from '../services/intelligenceService';
import { 
  ShieldCheck, Database, FileCode, CloudUpload,
  BookOpen, Layers, Zap, Package, Download, Loader2,
  ChevronRight, Search, Plus, Trash2, Edit3, X, 
  CheckCircle2, Target, History, Code2, Server, 
  Cpu, Terminal, Shield, ListChecks, Link2, Info, Sparkles, Save,
  Users, PenTool, Eye, Layout, Settings, Activity, Bot, Send, User, MessageSquare,
  Brain, Network, Globe, Radio, Database as DBIcon, CheckCircle, FolderTree, ListOrdered, AlertTriangle, HelpCircle
} from 'lucide-react';

interface AdminCMSProps {
  activeTab: string;
  data: StudentData;
  setData: (data: StudentData) => void;
}

const AdminCMS: React.FC<AdminCMSProps> = ({ activeTab, data, setData }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [creationType, setCreationType] = useState<string>('Question');
  const mode = api.getMode();

  const handleEdit = (type: string, item: any) => {
    setCreationType(type);
    setEditingItem(item);
    setIsCreating(true);
  };

  const handleDelete = (type: string, id: string) => {
    if (!confirm(`Confirm deletion of this ${type}?`)) return;
    const key = type === 'Chapter' ? 'chapters' : 
                type === 'Question' ? 'questions' : 
                type === 'MockTest' ? 'mockTests' :
                type === 'Flashcard' ? 'flashcards' :
                type === 'MemoryHack' ? 'memoryHacks' : 'blogs';
    const newList = (data[key as keyof StudentData] as any[]).filter(item => item.id !== id);
    setData({ ...data, [key]: newList });
  };

  const handleSaveEntity = (type: string, entity: any) => {
    const key = type === 'Chapter' ? 'chapters' : 
                type === 'Question' ? 'questions' : 
                type === 'MockTest' ? 'mockTests' :
                type === 'Flashcard' ? 'flashcards' :
                type === 'MemoryHack' ? 'memoryHacks' : 'blogs';
    
    const currentList = [...(data[key as keyof StudentData] as any[])];
    const index = currentList.findIndex(e => e.id === entity.id);
    
    if (type === 'MockTest') {
      entity.category = 'ADMIN';
    }
    
    if (index > -1) {
      currentList[index] = entity;
    } else {
      currentList.push(entity);
    }
    
    setData({ ...data, [key]: currentList });
    setIsCreating(false);
    setEditingItem(null);
  };

  return (
    <div className="pb-20 max-w-7xl mx-auto space-y-10 px-4">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
        <div className="space-y-2">
          <div className="text-[10px] font-black uppercase text-indigo-600 tracking-[0.4em] flex items-center gap-3">
             <ShieldCheck className="w-4 h-4" /> Solaris Control: System Administration
          </div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter italic leading-none uppercase">Central <span className="text-indigo-600 font-black">Commander.</span></h2>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100 shadow-inner">
             <div className="text-right">
                <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Active Database</div>
                <div className={`text-[10px] font-black uppercase ${mode === 'LIVE' ? 'text-emerald-600' : 'text-slate-500'}`}>
                   {mode === 'LIVE' ? 'Production (MySQL)' : 'Sandbox (Memory)'}
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

      <div className="space-y-12 animate-in fade-in duration-700">
        {activeTab === 'admin-overview' && <Overview data={data} />}
        {activeTab === 'admin-users' && <UserManagement />}
        {activeTab === 'admin-syllabus' && <EntityList title="Syllabus Management" type="Chapter" data={data.chapters} icon={BookOpen} color="indigo" btnLabel="Add Chapter" onEdit={handleEdit} onDelete={handleDelete} onNew={() => { setCreationType('Chapter'); setEditingItem(null); setIsCreating(true); }} />}
        {activeTab === 'admin-questions' && <EntityList title="Question Bank" type="Question" data={data.questions} icon={Terminal} color="emerald" btnLabel="Add Question" onEdit={handleEdit} onDelete={handleDelete} onNew={() => { setCreationType('Question'); setEditingItem(null); setIsCreating(true); }} />}
        {activeTab === 'admin-tests' && <EntityList title="Mock Test Suite" type="MockTest" data={data.mockTests} icon={Target} color="rose" btnLabel="Create Mock Test" onEdit={handleEdit} onDelete={handleDelete} onNew={() => { setCreationType('MockTest'); setEditingItem(null); setIsCreating(true); }} />}
        {activeTab === 'admin-flashcards' && <EntityList title="Revision Cards" type="Flashcard" data={data.flashcards} icon={Layers} color="blue" btnLabel="Add Card" onEdit={handleEdit} onDelete={handleDelete} onNew={() => { setCreationType('Flashcard'); setEditingItem(null); setIsCreating(true); }} />}
        {activeTab === 'admin-hacks' && <EntityList title="Memory Hacks" type="MemoryHack" data={data.memoryHacks} icon={Zap} color="amber" btnLabel="Add Hack" onEdit={handleEdit} onDelete={handleDelete} onNew={() => { setCreationType('MemoryHack'); setEditingItem(null); setIsCreating(true); }} />}
        {activeTab === 'admin-blogs' && <EntityList title="Resource Articles" type="Blog" data={data.blogs} icon={PenTool} color="indigo" btnLabel="New Post" onEdit={handleEdit} onDelete={handleDelete} onNew={() => { setCreationType('Blog'); setEditingItem(null); setIsCreating(true); }} />}
        {activeTab === 'admin-system' && <SystemHub data={data} setData={setData} />}
      </div>

      {isCreating && (
        <CreationHub 
          type={creationType} 
          item={editingItem} 
          questions={data.questions}
          onClose={() => setIsCreating(false)} 
          onSave={(entity: any) => handleSaveEntity(creationType, entity)}
        />
      )}
    </div>
  );
};

/* --- SUB-COMPONENTS --- */

const Overview = ({ data }: { data: StudentData }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {[
      { label: 'Syllabus Chapters', val: data.chapters.length, sub: 'Units Active', icon: BookOpen, color: 'indigo' },
      { label: 'Question Library', val: data.questions.length, sub: 'Bank Depth', icon: Code2, color: 'emerald' },
      { label: 'Mock Test Count', val: data.mockTests.length, sub: 'National Exams', icon: Target, color: 'rose' },
      { label: 'Blog Posts', val: data.blogs.length, sub: 'Resources', icon: PenTool, color: 'indigo' },
    ].map((stat, i) => (
      <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:scale-105 transition-transform group">
        <div className={`w-12 h-12 bg-${stat.color}-50 text-${stat.color}-600 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform`}><stat.icon className="w-6 h-6" /></div>
        <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{stat.label}</div>
        <div className="text-3xl font-black text-slate-800 tracking-tighter">{stat.val}</div>
        <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase">{stat.sub}</div>
      </div>
    ))}
  </div>
);

const UserManagement = () => {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getAccounts().then(res => { setUsers(res); setIsLoading(false); });
  }, []);

  return (
    <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4">
      <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
         <h3 className="text-xl font-black italic text-slate-800 flex items-center gap-3"><Users className="w-6 h-6 text-indigo-600" /> User Directory</h3>
         <button className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl hover:scale-105 transition-all"><Plus className="w-4 h-4" /> Add Student</button>
      </div>
      <div className="divide-y divide-slate-50 max-h-[600px] overflow-y-auto">
        {isLoading ? (
          <div className="p-20 flex flex-col items-center justify-center text-slate-400 gap-4"><Loader2 className="animate-spin" /> Fetching secure accounts...</div>
        ) : (
          users.map((u) => (
            <div key={u.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group">
               <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-indigo-600 shadow-inner">{u.name[0]}</div>
                  <div>
                    <div className="font-black text-slate-800 tracking-tight">{u.name}</div>
                    <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{u.email} • {u.role}</div>
                  </div>
               </div>
               <div className="flex gap-2">
                  <button className="p-3 text-slate-400 hover:text-indigo-600 transition-all"><Edit3 className="w-4 h-4" /></button>
                  <button className="p-3 text-slate-400 hover:text-rose-600 transition-all"><Trash2 className="w-4 h-4" /></button>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const EntityList = ({ title, type, data, icon: Icon, color, onEdit, onDelete, onNew, btnLabel = "Add Entry" }: any) => (
  <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4">
    <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
       <h3 className="text-xl font-black italic text-slate-800 flex items-center gap-3"><Icon className={`w-6 h-6 text-${color}-600`} /> {title}</h3>
       <button onClick={onNew} className={`bg-${color}-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-${color}-100 hover:scale-105 transition-all`}><Plus className="w-4 h-4" /> {btnLabel}</button>
    </div>
    <div className="divide-y divide-slate-50 max-h-[600px] overflow-y-auto">
      {data.length === 0 ? (
        <div className="p-20 text-center text-slate-300 font-black uppercase text-[10px] tracking-widest italic">Database is empty. Please create an entry.</div>
      ) : (
        data.map((item: any) => (
          <div key={item.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group">
             <div className="flex items-center gap-6">
                <div className={`w-10 h-10 bg-${color}-50 text-${color}-600 rounded-xl flex items-center justify-center shrink-0`}>
                   <Icon className="w-5 h-5" />
                </div>
                <div className="max-w-xl">
                   <div className="text-sm font-bold text-slate-800 line-clamp-1 italic tracking-tight">
                     {type === 'Blog' ? item.title : type === 'Chapter' ? item.name : type === 'Question' ? item.text : type === 'Flashcard' ? item.question : item.name || item.title}
                   </div>
                   <div className="flex gap-4 mt-1">
                      <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{item.subject || item.category || 'National Level'}</span>
                      <span className="text-[9px] font-black uppercase text-indigo-500 tracking-widest">{item.difficulty || (item.questionIds ? `${item.questionIds.length} Questions` : 'Standard')}</span>
                   </div>
                </div>
             </div>
             <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => onEdit(type, item)} className="p-3 bg-white border border-slate-100 text-slate-400 rounded-xl hover:text-indigo-600 transition-all shadow-sm"><Edit3 className="w-4 h-4" /></button>
                <button onClick={() => onDelete(type, item.id)} className="p-3 bg-white border border-slate-100 text-slate-400 rounded-xl hover:text-rose-600 transition-all shadow-sm"><Trash2 className="w-4 h-4" /></button>
             </div>
          </div>
        ))
      )}
    </div>
  </div>
);

const SystemHub = ({ data, setData }: { data: StudentData, setData: (d: StudentData) => void }) => {
  const [activeSubTab, setActiveSubTab] = useState<'ai' | 'server'>('ai');
  const [selectedModel, setSelectedModel] = useState(localStorage.getItem('jeepro_platform_ai_model') || 'solaris-core');
  const [testInput, setTestInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState<{role: 'bot'|'user', text: string}[]>([]);
  const [isComputing, setIsComputing] = useState(false);

  const saveModelConfig = (id: string) => {
    setSelectedModel(id);
    localStorage.setItem('jeepro_platform_ai_model', id);
    setData({ ...data, aiTutorModel: id });
  };

  const handleTestChat = async () => {
    if (!testInput.trim() || isComputing) return;
    const msg = testInput;
    setTestInput('');
    setTerminalLogs(prev => [...prev, {role: 'user', text: msg}]);
    setIsComputing(true);
    const reply = await chatWithTutor([], msg, selectedModel);
    setTerminalLogs(prev => [...prev, {role: 'bot', text: reply || 'Network Error: Link lost.'}]);
    setIsComputing(false);
  };

  const models = [
    { id: 'solaris-core', name: 'Solaris Heuristic', icon: Cpu, desc: 'Optimized logic for core JEE preparation.' },
    { id: 'gpt-4o-edu', name: 'GPT-4o Academic', icon: Brain, desc: 'Deep reasoning for JEE Advanced level.' },
    { id: 'claude-3-stu', name: 'Claude Student', icon: Zap, desc: 'Speed-optimized theory summarization.' },
    { id: 'gemini-flash-base', name: 'Gemini 2.0 Flash', icon: Radio, desc: 'Lowest latency for instant doubt clearing.' },
    { id: 'deepseek-coder', name: 'DeepSeek Numeric', icon: Code2, desc: 'Mathematics and calculation specialist.' },
    { id: 'iit-pulse', name: 'IIT-Pulse Engine', icon: Network, desc: 'Data-driven insights from successful candidates.' }
  ];

  const handleDownloadBuild = async () => {
    const zip = new JSZip();
    
    // 1. ROOT LEVEL CONFIG (Fixes Blank Page & MIME types on XAMPP)
    const rootHtaccess = `
# SOLARIS HUB XAMPP OPTIMIZER
<IfModule mod_mime.c>
  AddType application/javascript .js
  AddType application/javascript .mjs
</IfModule>

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  # Ensure all routes point to index.html for the SPA
  RewriteRule ^index\\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_URI} !^/api/
  RewriteRule . /index.html [L]
</IfModule>
    `.trim();
    zip.file(".htaccess", rootHtaccess);

    // 2. PHP Folder Structure
    const apiRoot = zip.folder("api")!;
    const config = apiRoot.folder("config")!;
    const controllers = apiRoot.folder("controllers")!;
    const core = apiRoot.folder("core")!;
    const modelsFolder = apiRoot.folder("models")!;
    const sqlFolder = apiRoot.folder("sql")!;

    // SQL MASTER SCHEMA
    const masterSQL = `-- IITGEEPREP MASTER PRODUCTION SQL v7.5\n` +
      `CREATE TABLE IF NOT EXISTS users (id VARCHAR(50) PRIMARY KEY, name VARCHAR(100), email VARCHAR(100) UNIQUE, password VARCHAR(255), role ENUM('STUDENT','PARENT','ADMIN'), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);\n` +
      `CREATE TABLE IF NOT EXISTS routines (student_id VARCHAR(50) PRIMARY KEY, wake_up VARCHAR(10), sleep VARCHAR(10), school_start VARCHAR(10), school_end VARCHAR(10), coaching_start VARCHAR(10), coaching_end VARCHAR(10));\n` +
      `CREATE TABLE IF NOT EXISTS chapters (id VARCHAR(50), student_id VARCHAR(50), subject VARCHAR(50), unit VARCHAR(100), name VARCHAR(255), progress INT DEFAULT 0, accuracy INT DEFAULT 0, PRIMARY KEY(id, student_id));\n` +
      `INSERT IGNORE INTO users (id, name, email, password, role) VALUES ('163110', 'Aryan Sharma', 'ishu@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'STUDENT');`;
    sqlFolder.file("master_schema.sql", masterSQL);

    // CONFIG & CORE
    config.file("database.php", `<?php\nclass Database {\n    private $host = "localhost";\n    private $db_name = "jeepro_db";\n    private $username = "root";\n    private $password = "";\n    public $conn;\n    public function getConnection() {\n        $this->conn = null;\n        try {\n            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);\n            $this->conn->exec("set names utf8");\n        } catch(PDOException $e) { }\n        return $this->conn;\n    }\n}\n?>`);
    core.file("Response.php", `<?php\nclass Response {\n    public static function json($data, $status = 200) {\n        header('Content-Type: application/json');\n        header('Access-Control-Allow-Origin: *');\n        http_response_code($status);\n        echo json_encode($data);\n        exit;\n    }\n}\n?>`);
    core.file("Controller.php", `<?php\nrequire_once __DIR__ . '/../config/database.php';\nclass Controller {\n    protected $db;\n    public function __construct() {\n        $database = new Database();\n        $this->db = $database->getConnection();\n    }\n}\n?>`);

    // ALL 21 MODULES
    const modules = ["Activity", "Analytics", "Auth", "Backlog", "Blog", "File", "Flashcard", "MemoryHack", "Message", "MockTest", "Notification", "Profile", "Question", "Report", "Result", "Routine", "Security", "Syllabus", "System", "User", "Wellness"];

    modules.forEach(m => {
      modelsFolder.file(`${m}.php`, `<?php\nclass ${m} {\n    private $conn; private $table;\n    public function __construct($db) { $this->conn = $db; $this->table = strtolower('${m}') . 's'; }\n    public function getAll() { $s = $this->conn->prepare("SELECT * FROM " . $this->table); $s->execute(); return $s->fetchAll(PDO::FETCH_ASSOC); }\n}\n?>`);
      controllers.file(`${m}Controller.php`, `<?php\nrequire_once __DIR__ . '/../core/Controller.php';\nrequire_once __DIR__ . '/../core/Response.php';\nrequire_once __DIR__ . '/../models/${m}.php';\nclass ${m}Controller extends Controller {\n    public function index() { $model = new ${m}($this->db); Response::json($model->getAll()); }\n}\n?>`);
    });

    apiRoot.file("index.php", `<?php\n$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);\n$parts = explode('/', trim($uri, '/'));\n$module = !empty($parts[1]) ? ucfirst($parts[1]) : 'System';\n$ctrlName = $module . "Controller";\nif (file_exists(__DIR__ . "/controllers/$ctrlName.php")) {\n    require_once __DIR__ . "/controllers/$ctrlName.php";\n    $instance = new $ctrlName();\n    $instance->index();\n} else {\n    require_once 'core/Response.php';\n    Response::json(["error" => "Endpoint not found"], 404);\n}\n?>`);
    apiRoot.file(".htaccess", "RewriteEngine On\nRewriteRule ^(.*)$ index.php [QSA,L]");

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "iitgeeprep-xampp-optimized-backend.zip");
  };

  return (
    <div className="pb-20 max-w-7xl mx-auto space-y-10 px-4">
      {/* Tab Switcher */}
      <div className="flex bg-white p-2 rounded-[2rem] border border-slate-200 shadow-sm w-fit">
         <button onClick={() => setActiveSubTab('ai')} className={`px-10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'ai' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>Intelligence Setup</button>
         <button onClick={() => setActiveSubTab('server')} className={`px-10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'server' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>Server Deployment</button>
      </div>

      {activeSubTab === 'ai' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-6 bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-8">
             <h3 className="text-xl font-black italic flex items-center gap-3"><Cpu className="w-6 h-6 text-indigo-600" /> AI Engine Selection</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {models.map(m => (
                  <button key={m.id} onClick={() => saveModelConfig(m.id)} className={`p-6 rounded-3xl border-2 text-left space-y-3 transition-all ${selectedModel === m.id ? 'bg-slate-900 border-slate-900 text-white shadow-2xl' : 'bg-slate-50 border-transparent text-slate-500 hover:border-indigo-400'}`}>
                    <m.icon className={`w-8 h-8 ${selectedModel === m.id ? 'text-indigo-400' : 'text-slate-400'}`} />
                    <div>
                      <div className="text-xs font-black uppercase tracking-widest">{m.name}</div>
                      <div className="text-[9px] opacity-60 font-bold leading-tight mt-1">{m.desc}</div>
                    </div>
                  </button>
                ))}
             </div>
          </div>

          <div className="lg:col-span-6 bg-slate-950 rounded-[3.5rem] p-10 text-white shadow-2xl flex flex-col h-[550px]">
             <div className="flex justify-between items-center mb-8 shrink-0">
                <div className="flex items-center gap-3"><div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-mono text-xs">AI</div><h3 className="font-black italic uppercase text-sm tracking-widest">Query Terminal</h3></div>
                <div className="flex gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div><span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live</span></div>
             </div>
             <div className="flex-1 overflow-y-auto font-mono text-xs space-y-4 pr-4 custom-scrollbar">
                {terminalLogs.map((log, i) => (
                  <div key={i} className={`flex gap-3 ${log.role === 'user' ? 'text-indigo-400' : 'text-emerald-400'}`}>
                    <span className="shrink-0 font-black uppercase">[{log.role}]:</span>
                    <p className="leading-relaxed">{log.text}</p>
                  </div>
                ))}
                {isComputing && <div className="text-slate-600 animate-pulse font-black uppercase">Thinking...</div>}
             </div>
             <div className="mt-8 relative shrink-0">
                <input type="text" value={testInput} onChange={e => setTestInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleTestChat()} placeholder="Ask AI a technical question..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-xs font-mono outline-none" />
                <button onClick={handleTestChat} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-indigo-400 hover:text-white transition-all"><Send className="w-4 h-4" /></button>
             </div>
          </div>
        </div>
      ) : (
        <div className="space-y-10 animate-in slide-in-from-right duration-500">
          {/* XAMPP Troubleshooting Panel */}
          <div className="bg-rose-50 border border-rose-200 p-8 rounded-[3rem] flex flex-col md:flex-row items-center gap-8 shadow-sm">
             <div className="w-20 h-20 bg-rose-600 text-white rounded-[2rem] flex items-center justify-center shadow-xl shrink-0 border-8 border-rose-100">
                <AlertTriangle className="w-8 h-8" />
             </div>
             <div className="flex-1 space-y-2">
                <h4 className="text-lg font-black text-rose-900 tracking-tight">Avoid the "Blank Page" Error</h4>
                <p className="text-sm text-rose-700 font-medium leading-relaxed">
                   When deploying to XAMPP, <b>never copy the source code directly</b> into htdocs. Browsers cannot read .tsx files. You MUST run <code>npm run build</code> and only copy the contents of the <code>dist/</code> folder.
                </p>
             </div>
             <button className="bg-rose-900 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-800 transition-all flex items-center gap-2"><HelpCircle className="w-4 h-4" /> Full Guide</button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Folder Structure Visualization */}
            <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-8">
               <h3 className="text-xl font-black italic flex items-center gap-3"><FolderTree className="w-6 h-6 text-indigo-600" /> Folder Roadmap</h3>
               <div className="font-mono text-xs p-6 bg-slate-950 text-emerald-400 rounded-3xl overflow-x-auto">
                 <pre>{`/xampp/htdocs/iitgeeprep/
├── .htaccess (New Root Optimizer)
├── assets/ (From dist/ folder)
├── api/ (The ZIP Backend)
│   ├── config/ (database.php)
│   ├── core/ (Controller.php, Response.php)
│   ├── controllers/ (21 Feature Nodes)
│   ├── models/ (21 DB Mappers)
│   ├── sql/ (master_schema.sql)
│   └── index.php (Central Router)
└── index.html (The main entry point)`}</pre>
               </div>
            </div>

            <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-8">
               <h3 className="text-xl font-black italic flex items-center gap-3"><ListOrdered className="w-6 h-6 text-indigo-600" /> Handover Steps</h3>
               <div className="space-y-4">
                  {[
                    "Run 'npm run build' locally and zip the 'dist' folder.",
                    "Upload and extract dist content to xampp/htdocs/iitgeeprep/.",
                    "Download the 'Granular Backend ZIP' from this dashboard.",
                    "Extract ZIP—place '.htaccess' in ROOT and 'api/' folder inside your project.",
                    "Import 'sql/master_schema.sql' via phpMyAdmin.",
                    "Configure DB in 'api/config/database.php' (Hostinger/XAMPP)."
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-4 group">
                       <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center font-black text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all text-[10px]">0{i+1}</div>
                       <span className="text-xs font-bold text-slate-700">{step}</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[4rem] p-12 lg:p-20 text-white shadow-2xl space-y-12 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-12 opacity-5"><Server className="w-80 h-80" /></div>
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 relative z-10">
                <div className="space-y-4">
                   <div className="inline-flex items-center gap-2 bg-indigo-600/30 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 text-indigo-300"><CloudUpload className="w-4 h-4" /> Production Sync</div>
                   <h3 className="text-4xl font-black italic tracking-tighter uppercase leading-none">Deployment <span className="text-indigo-500 italic font-black">Blueprint.</span></h3>
                </div>
                <button onClick={handleDownloadBuild} className="px-10 py-5 bg-white text-slate-900 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.3em] flex items-center gap-4 hover:bg-indigo-50 transition-all shadow-2xl group shrink-0"><Package className="w-6 h-6 group-hover:scale-110 transition-transform" /> Download Server ZIP</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* --- CREATION HUB COMPONENT --- */

const CreationHub = ({ type, item, questions = [], onClose, onSave }: any) => {
  const [formData, setFormData] = useState<any>(item || {
    id: `ID-${Math.random().toString(36).substr(2, 9)}`,
    name: '', title: '', subject: 'Physics' as Subject, unit: 'UNIT 1', text: '',
    question: '', answer: '', content: '', author: 'Admin', hack: '',
    description: '', options: ['', '', '', ''], correctAnswer: 0, difficulty: 'EASY',
    category: 'ADMIN', duration: 180, totalMarks: 300, questionIds: [], chapterIds: [],
    date: new Date().toISOString().split('T')[0], status: 'PUBLISHED'
  });

  const toggleQuestionSelection = (qid: string) => {
    const current = formData.questionIds || [];
    const newList = current.includes(qid) ? current.filter((id: string) => id !== qid) : [...current, qid];
    
    const selectedChapters = new Set<string>();
    newList.forEach((id: string) => {
      const q = questions.find((qu: any) => qu.id === id);
      if (q) selectedChapters.add(q.topicId);
    });

    setFormData({ 
      ...formData, 
      questionIds: newList, 
      chapterIds: Array.from(selectedChapters),
      totalMarks: newList.length * 4 
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose}></div>
      <div className="bg-white w-full max-w-5xl p-12 rounded-[4rem] shadow-2xl relative z-10 animate-in zoom-in-95 duration-300 overflow-hidden max-h-[90vh] flex flex-col">
         <button onClick={onClose} className="absolute top-10 right-10 text-slate-400 hover:text-slate-900 transition-colors"><X className="w-8 h-8" /></button>
         <h3 className="text-4xl font-black italic tracking-tighter text-slate-900 mb-10 shrink-0 uppercase leading-none">Creator: <span className="text-indigo-600 italic font-black">{type}</span></h3>
         
         <div className="flex-1 overflow-y-auto px-4 space-y-8 custom-scrollbar">
            {type === 'MockTest' ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-4 space-y-6">
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-slate-400 ml-6 tracking-widest">Test Title</label>
                     <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 p-6 rounded-[2rem] border-none text-sm font-black italic shadow-inner" placeholder="E.g. Full Syllabus Mock #1" />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Minutes</label>
                        <input type="number" value={formData.duration} onChange={e => setFormData({...formData, duration: parseInt(e.target.value)})} className="w-full bg-slate-50 p-4 rounded-2xl border-none text-sm font-black" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Exam Type</label>
                        <select value={formData.difficulty} onChange={e => setFormData({...formData, difficulty: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl border-none text-sm font-black">
                           <option>MAINS</option><option>ADVANCED</option><option>BITSAT</option>
                        </select>
                      </div>
                   </div>
                   <div className="bg-indigo-900 p-8 rounded-[2.5rem] text-white space-y-4">
                      <div className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Packaging Status</div>
                      <div className="text-4xl font-black italic">{formData.questionIds.length} <span className="text-sm font-bold opacity-50 not-italic uppercase">Selected</span></div>
                      <div className="text-xl font-black italic text-emerald-400">Total Marks: {formData.totalMarks}</div>
                   </div>
                </div>
                <div className="lg:col-span-8 space-y-4">
                   <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Available Questions (Select to Add)</label>
                   <div className="grid grid-cols-1 gap-2 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                      {questions.map((q: any) => (
                        <button key={q.id} onClick={() => toggleQuestionSelection(q.id)} className={`p-5 rounded-3xl border-2 text-left transition-all flex items-center justify-between group ${formData.questionIds.includes(q.id) ? 'bg-indigo-50 border-indigo-500' : 'bg-white border-slate-100 hover:border-indigo-300'}`}>
                           <div className="flex-1">
                              <div className="text-xs font-bold text-slate-800 line-clamp-1 italic">{q.text}</div>
                              <div className="flex gap-3 mt-1">
                                 <span className="text-[8px] font-black uppercase text-slate-400">{q.subject}</span>
                                 <span className="text-[8px] font-black uppercase text-indigo-400">{q.difficulty}</span>
                              </div>
                           </div>
                           <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${formData.questionIds.includes(q.id) ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-transparent'}`}><CheckCircle2 className="w-4 h-4" /></div>
                        </button>
                      ))}
                   </div>
                </div>
              </div>
            ) : type === 'Blog' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                   <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400 ml-6 tracking-widest">Entry Title</label><input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-50 p-6 rounded-[2rem] border-none text-sm font-black italic shadow-inner" /></div>
                   <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400 ml-6 tracking-widest">Content HTML</label><textarea value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full bg-slate-50 p-8 rounded-[3rem] border-none text-xs font-mono min-h-[400px] shadow-inner" /></div>
                </div>
                <div className="space-y-6 bg-white border border-slate-100 rounded-[3.5rem] p-10 min-h-[500px] prose max-w-none shadow-sm overflow-y-auto">
                   {formData.title && <h1 className="font-black italic tracking-tighter text-4xl mb-6">{formData.title}</h1>}
                   <div dangerouslySetInnerHTML={{ __html: formData.content || '<p class="text-slate-300 italic">Preview session active...</p>' }} />
                </div>
              </div>
            ) : type === 'Question' ? (
              <div className="space-y-8">
                <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400 ml-6 tracking-widest">Question Text</label><textarea value={formData.text} onChange={e => setFormData({...formData, text: e.target.value})} className="w-full bg-slate-50 p-8 rounded-[2.5rem] border-none text-sm font-black italic h-32 shadow-inner" /></div>
                <div className="grid grid-cols-2 gap-4">
                  {formData.options.map((opt: string, i: number) => (
                    <div key={i} className="space-y-1"><label className="text-[9px] font-black uppercase text-slate-400 ml-6 tracking-widest">Option {String.fromCharCode(65+i)}</label><input value={opt} onChange={e => { const newOpts = [...formData.options]; newOpts[i] = e.target.value; setFormData({...formData, options: newOpts}); }} className="w-full bg-slate-50 p-5 rounded-2xl border-none text-xs font-bold" /></div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-50">
                   <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400 ml-6 tracking-widest">Correct Option Index (0-3)</label><input type="number" min="0" max="3" value={formData.correctAnswer} onChange={e => setFormData({...formData, correctAnswer: parseInt(e.target.value)})} className="w-full bg-slate-900 text-white p-6 rounded-2xl border-none text-sm font-black" /></div>
                   <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400 ml-6 tracking-widest">Subject Vertical</label><select value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full bg-slate-50 p-6 rounded-2xl border-none text-sm font-black"><option>Physics</option><option>Chemistry</option><option>Mathematics</option></select></div>
                </div>
              </div>
            ) : (
               <div className="p-20 text-center bg-slate-50 rounded-[4rem] border-4 border-dashed border-slate-100 flex flex-col items-center gap-4"><Activity className="w-12 h-12 text-slate-200" /><div className="text-xs font-black uppercase text-slate-400 tracking-widest italic">Protocol setup for {type}...</div></div>
            )}
         </div>

         <div className="mt-10 flex gap-6 shrink-0">
            <button onClick={onClose} className="flex-1 py-6 bg-slate-100 text-slate-500 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] hover:bg-slate-200 transition-all">Cancel Entry</button>
            <button onClick={() => onSave(formData)} className="flex-1 py-6 bg-indigo-600 text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.4em] shadow-2xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-4 group"><Save className="w-6 h-6 group-hover:scale-110 transition-transform" /> Save to Database</button>
         </div>
      </div>
      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 6px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }`}</style>
    </div>
  );
};

export default AdminCMS;
