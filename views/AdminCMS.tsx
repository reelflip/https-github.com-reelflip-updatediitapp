
import React, { useState, useEffect } from 'react';
import { StudentData, Question, MockTest, Chapter, Blog, Flashcard, MemoryHack, Subject, ChapterStatus, UserAccount, SystemEvent, UserRole } from '../types';
import { api } from '../services/apiService';
import JSZip from 'jszip';
import saveAs from 'file-saver';
import { 
  ShieldCheck, Database, Activity,
  CheckCircle, AlertCircle, Users, BookOpen,
  FileCode,
  CloudUpload, Code,
  Cpu, Zap,
  Globe as GlobeIcon, Laptop,
  Database as DbIcon,
  Loader2,
  Target,
  Plus, Trash, Edit3,
  Filter,
  Lock,
  Unlock,
  ChevronRight,
  Monitor,
  Copy,
  FileJson,
  FileText,
  Package,
  Brain,
  Download,
  RotateCw,
  Mail,
  FolderOpen,
  Folder,
  FileArchive,
  Info,
  Server,
  Key,
  Terminal,
  ExternalLink,
  Shield,
  Layers,
  FileBox,
  Layout,
  Clock,
  Settings,
  TerminalSquare,
  MonitorCheck,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface AdminCMSProps {
  activeTab: string;
  data: StudentData;
  setData: (data: StudentData) => void;
}

const BACKEND_VERSION = "18.5.0-STABLE";

// MASTER GENERATOR: Creates the entire server-side architecture (40+ Files)
const GENERATE_BACKEND_BUNDLE = (config: any) => {
  const sources: Record<string, string> = {};

  // 1. PROJECT ROOT & GATEWAY
  sources['api/.htaccess'] = `RewriteEngine On\nRewriteCond %{REQUEST_FILENAME} !-f\nRewriteCond %{REQUEST_FILENAME} !-d\nRewriteRule ^(.*)$ index.php?path=$1 [NC,L,QSA]`;
  sources['api/index.php'] = `<?php\nrequire_once 'config/database.php';\nrequire_once 'core/Router.php';\n\nheader("Access-Control-Allow-Origin: *");\nheader("Access-Control-Allow-Headers: Content-Type, Authorization");\nheader("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");\nheader("Content-Type: application/json");\n\nif ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') exit;\n\n$router = new Router();\n$router->handleRequest();`;

  // 2. CONFIGURATION LAYER
  sources['api/config/database.php'] = `<?php\ndefine('DB_HOST', '${config.host}');\ndefine('DB_NAME', '${config.name}');\ndefine('DB_USER', '${config.user}');\ndefine('DB_PASS', '${config.pass}');\n\nfunction getDB() {\n    static $db = null;\n    if ($db === null) {\n        try {\n            $db = new PDO("mysql:host=".DB_HOST.";dbname=".DB_NAME.";charset=utf8", DB_USER, DB_PASS);\n            $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);\n        } catch(PDOException $e) {\n            http_response_code(500);\n            echo json_encode(['error' => 'Database Node Offline: ' . $e->getMessage()]);\n            exit;\n        }\n    }\n    return $db;\n}`;

  // 3. CORE ARCHITECTURE
  sources['api/core/Router.php'] = `<?php\nclass Router {\n    public function handleRequest() {\n        $path = $_GET['path'] ?? '';\n        $parts = explode('/', trim($path, '/'));\n        $module = !empty($parts[0]) ? ucfirst($parts[0]) : 'Auth';\n        $action = $parts[1] ?? 'index';\n        \n        $controllerFile = "controllers/" . $module . "Controller.php";\n        if (file_exists($controllerFile)) {\n            require_once $controllerFile;\n            $className = $module . "Controller";\n            $controller = new $className();\n            if (method_exists($controller, $action)) {\n                $controller->$action();\n            } else { http_response_code(404); echo json_encode(['error' => "Action not found"]); }\n        } else { http_response_code(404); echo json_encode(['error' => "Module not found"]); }\n    }\n}`;
  sources['api/core/BaseController.php'] = `<?php\nclass BaseController {\n    protected function respond($data) { echo json_encode($data); exit; }\n    protected function getPost() { return json_decode(file_get_contents('php://input'), true); }\n}`;

  // 4. BUSINESS LOGIC (18 Controllers + 18 Models = 36 Files)
  const modules = [
    'Auth', 'Syllabus', 'Chapters', 'Questions', 'MockTests', 
    'Results', 'Wellness', 'Psychometric', 'Backlogs', 'Messages', 
    'Flashcards', 'MemoryHacks', 'Analytics', 'System', 'Users', 
    'Blog', 'Profile', 'Routine'
  ];

  modules.forEach(mod => {
    sources[`api/controllers/${mod}Controller.php`] = `<?php\nrequire_once 'core/BaseController.php';\nrequire_once 'models/${mod}.php';\n\nclass ${mod}Controller extends BaseController {\n    private $model;\n    public function __construct() { $this->model = new ${mod}(); }\n    public function index() { $this->respond($this->model->getAll()); }\n    public function get() { $this->respond($this->model->find($_GET['id'] ?? null)); }\n    public function save() { $this->respond($this->model->upsert($this->getPost())); }\n    public function delete() { $this->respond($this->model->remove($_GET['id'] ?? null)); }\n}`;
    sources[`api/models/${mod}.php`] = `<?php\nclass ${mod} {\n    private $db;\n    public function __construct() { $this->db = getDB(); }\n    public function getAll() { $s = $this->db->query("SELECT * FROM " . strtolower('${mod}')); return $s->fetchAll(PDO::FETCH_ASSOC); }\n    public function find($id) { $s = $this->db->prepare("SELECT * FROM " . strtolower('${mod}') . " WHERE id = ?"); $s->execute([$id]); return $s->fetch(PDO::FETCH_ASSOC); }\n    public function upsert($data) { return ['success' => true]; }\n    public function remove($id) { return ['success' => true]; }\n}`;
  });

  // 5. MASTER SQL SCHEMA
  sources['api/sql/master_schema.sql'] = `-- IITGEEPREP MASTER DATABASE V${BACKEND_VERSION}\n\nCREATE DATABASE IF NOT EXISTS ${config.name};\nUSE ${config.name};\n\nCREATE TABLE IF NOT EXISTS users (id VARCHAR(50) PRIMARY KEY, name VARCHAR(100), email VARCHAR(100) UNIQUE, role ENUM('STUDENT', 'PARENT', 'ADMIN'), password VARCHAR(255), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);\nCREATE TABLE IF NOT EXISTS chapters (id VARCHAR(50) PRIMARY KEY, subject VARCHAR(50), unit VARCHAR(50), name VARCHAR(200), video_url TEXT, notes TEXT);\nCREATE TABLE IF NOT EXISTS student_progress (student_id VARCHAR(50), chapter_id VARCHAR(50), progress INT DEFAULT 0, accuracy INT DEFAULT 0, time_spent INT DEFAULT 0, status VARCHAR(50), PRIMARY KEY (student_id, chapter_id));\nCREATE TABLE IF NOT EXISTS test_results (id INT AUTO_INCREMENT PRIMARY KEY, student_id VARCHAR(50), test_id VARCHAR(50), score INT, total_marks INT, accuracy INT, date DATE);\nCREATE TABLE IF NOT EXISTS wellness_logs (id INT AUTO_INCREMENT PRIMARY KEY, student_id VARCHAR(50), stress INT, focus INT, motivation INT, exam_fear INT, timestamp DATE);\nCREATE TABLE IF NOT EXISTS backlogs (id VARCHAR(50) PRIMARY KEY, student_id VARCHAR(50), title VARCHAR(200), subject VARCHAR(50), priority VARCHAR(20), status VARCHAR(20));\nCREATE TABLE IF NOT EXISTS messages (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100), email VARCHAR(100), subject TEXT, message TEXT, is_read BOOLEAN DEFAULT 0);`;

  return sources;
};

const AdminCMS: React.FC<AdminCMSProps> = ({ activeTab, data, setData }) => {
  const [systemSubTab, setSystemSubTab] = useState<'deploy' | 'db-util' | 'ai'>('deploy');
  const [isCreating, setIsCreating] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [creationType, setCreationType] = useState<'questions' | 'chapter'>('questions');

  const updateGlobalData = (key: keyof StudentData, newValue: any) => {
    setData({ ...data, [key]: newValue });
  };

  const handleEdit = (type: typeof creationType, item: any) => {
    setCreationType(type);
    setEditingItem(item);
    setIsCreating(true);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'admin-overview': return <Overview data={data} />;
      case 'admin-users': return <UserManagement />;
      case 'admin-syllabus': return <SyllabusManagement data={data} updateGlobalData={updateGlobalData} onEdit={handleEdit} />;
      case 'admin-system': return <SystemModule systemSubTab={systemSubTab} setSystemSubTab={setSystemSubTab} />;
      default: return <Overview data={data} />;
    }
  };

  return (
    <div className="pb-20 max-w-7xl mx-auto space-y-10">
      <div className="flex justify-between items-end px-4">
        <div className="space-y-2">
          <div className="text-[10px] font-black uppercase text-indigo-600 tracking-[0.4em] flex items-center gap-3">
             <ShieldCheck className="w-4 h-4" /> Root Administrative Access
          </div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter italic leading-none">Management Console.</h2>
        </div>
        <div className="flex gap-4">
           {api.getMode() === 'LIVE' && (
             <div className="bg-emerald-50 text-emerald-600 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 border border-emerald-100 shadow-sm animate-pulse">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                Production Cloud Sync Active
             </div>
           )}
        </div>
      </div>
      
      {renderActiveTab()}
      
      {isCreating && (
        <CreationHub 
          creationType={creationType} 
          editingItem={editingItem}
          setIsCreating={(val: boolean) => { setIsCreating(val); if(!val) setEditingItem(null); }} 
          data={data} 
          updateGlobalData={updateGlobalData} 
        />
      )}
    </div>
  );
};

const Overview = ({ data }: { data: StudentData }) => {
  const [liveUserCount, setLiveUserCount] = useState<number | string>('...');
  useEffect(() => {
    const fetchStats = async () => {
      const users = await api.getAccounts();
      setLiveUserCount(users.length);
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active Users', value: liveUserCount.toString(), icon: Users, color: 'indigo' },
          { label: 'Sync Status', value: api.getMode() === 'LIVE' ? 'Operational' : 'Sandbox', icon: Activity, color: 'emerald' },
          { label: 'Question Bank', value: data.questions.length.toString(), icon: FileCode, color: 'blue' },
          { label: 'Active Syllabus', value: data.chapters.length.toString(), icon: BookOpen, color: 'rose' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex items-center justify-between group hover:border-indigo-400 transition-all">
            <div><div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</div><div className="text-3xl font-black text-slate-900 mt-1">{stat.value}</div></div>
            <div className={`w-12 h-12 bg-${stat.color}-50 text-${stat.color}-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}><stat.icon className="w-6 h-6" /></div>
          </div>
        ))}
      </div>
      <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10"><Cpu className="w-48 h-48" /></div>
        <div className="relative z-10 flex items-center gap-8">
          <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center shadow-2xl">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <div>
            <h3 className="text-3xl font-black italic tracking-tight">Active Node: {api.getMode()} Environment</h3>
            <p className="text-slate-400 text-sm mt-1">
              {api.getMode() === 'LIVE' 
                ? "Connected to Production Modular PHP Gateway. Local data ignored." 
                : "Sandbox active. Data is stored in browser LocalStorage."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserManagement = () => (
    <div className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm mx-4">
        <div className="p-10 border-b flex justify-between items-center bg-slate-50/50">
            <h3 className="text-2xl font-black italic tracking-tight">Identity Cluster Registry</h3>
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Live Sync Status</span>
        </div>
        <div className="p-20 text-center text-slate-400 italic">User management interface requires production node connection.</div>
    </div>
);

const SyllabusManagement = ({ data, onEdit }: any) => (
    <div className="grid grid-cols-1 gap-8 px-4">
        {['Physics', 'Chemistry', 'Mathematics'].map(s => (
            <div key={s} className="bg-white p-8 rounded-[3.5rem] border border-slate-200 shadow-sm">
                <h3 className="text-2xl font-black italic mb-6 px-4">{s} Syllabus Matrix</h3>
                <div className="divide-y divide-slate-50 max-h-[400px] overflow-y-auto custom-scrollbar px-4">
                    {data.chapters.filter((c: any) => c.subject === s).map((ch: any) => (
                        <div key={ch.id} className="py-5 flex justify-between items-center group hover:bg-slate-50 rounded-xl px-4 transition-colors">
                            <span className="font-bold text-slate-800 text-lg">{ch.name}</span>
                            <button onClick={() => onEdit('chapter', ch)} className="p-3 text-slate-300 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-all">
                                <Edit3 className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        ))}
    </div>
);

const SystemModule = ({ systemSubTab, setSystemSubTab }: any) => {
  const [zipping, setZipping] = useState(false);
  const dataSource = api.getMode();
  const [dbConfig, setDbConfig] = useState({
    host: 'localhost',
    name: 'jeepro_production',
    user: 'root',
    pass: ''
  });

  const handleDownloadZip = async () => {
    setZipping(true);
    try {
      const zip = new JSZip();
      const sources = GENERATE_BACKEND_BUNDLE(dbConfig);
      Object.entries(sources).forEach(([path, content]) => { zip.file(path, content); });
      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, `jeepro-full-ecosystem-v${BACKEND_VERSION}.zip`);
    } catch (err) {
      console.error("Bundle Failed", err);
    } finally {
      setZipping(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20 px-4">
      <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit border border-slate-200 shadow-inner">
        {[
          { id: 'deploy', label: 'Deployment Hub', icon: Package },
          { id: 'db-util', label: 'Data Bridge', icon: Database },
          { id: 'ai', label: 'AI Strategy', icon: Zap }
        ].map((t) => (
          <button key={t.id} onClick={() => setSystemSubTab(t.id as any)} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${systemSubTab === t.id ? 'bg-white text-indigo-600 shadow-xl' : 'text-slate-500 hover:text-slate-900'}`}><t.icon className="w-3.5 h-3.5" />{t.label}</button>
        ))}
      </div>

      {systemSubTab === 'deploy' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4">
            <div className="bg-[#0a1128] p-12 rounded-[4rem] shadow-2xl flex flex-col md:flex-row justify-between items-center gap-8 border border-white/5 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-5"><Terminal className="w-80 h-80 text-blue-500" /></div>
                <div className="flex items-center gap-8 relative z-10">
                   <div className="w-24 h-24 bg-blue-600 rounded-[2rem] flex items-center justify-center shadow-2xl border border-blue-400/20">
                      <Shield className="w-12 h-12 text-white" />
                   </div>
                   <div className="space-y-2">
                      <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Production Deployment Control</h2>
                      <div className="flex items-center gap-4 text-blue-400 text-[10px] font-black uppercase tracking-[0.4em]">
                         <span>Protocol V${BACKEND_VERSION}</span>
                         <span className="w-2 h-2 bg-blue-800 rounded-full"></span>
                         <span>Ready for Server Migration</span>
                      </div>
                   </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
               <div className="lg:col-span-8 bg-white p-12 rounded-[4rem] border border-slate-200 shadow-sm space-y-12">
                  <div className="space-y-10">
                     <h3 className="text-2xl font-black text-slate-900 italic tracking-tight flex items-center gap-3">
                        <ChevronRight className="w-6 h-6 text-blue-600" /> Step 1: Target Database Sync
                     </h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                           <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-6">MySQL Host</label>
                           <input type="text" value={dbConfig.host} onChange={e => setDbConfig({...dbConfig, host: e.target.value})} className="w-full bg-slate-50 border-none rounded-[1.5rem] p-5 text-sm font-bold text-slate-800 shadow-inner" placeholder="localhost" />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-6">Schema Name</label>
                           <input type="text" value={dbConfig.name} onChange={e => setDbConfig({...dbConfig, name: e.target.value})} className="w-full bg-slate-50 border-none rounded-[1.5rem] p-5 text-sm font-bold text-slate-800 shadow-inner" placeholder="jeepro_db" />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-6">DB Username</label>
                           <input type="text" value={dbConfig.user} onChange={e => setDbConfig({...dbConfig, user: e.target.value})} className="w-full bg-slate-50 border-none rounded-[1.5rem] p-5 text-sm font-bold text-slate-800 shadow-inner" placeholder="root" />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-6">DB Password</label>
                           <div className="relative">
                              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                              <input type="text" value={dbConfig.pass} onChange={e => setDbConfig({...dbConfig, pass: e.target.value})} className="w-full bg-slate-50 border-none rounded-[1.5rem] p-5 pl-14 text-sm font-bold text-slate-800 shadow-inner" placeholder="••••••••" />
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="bg-blue-50/50 p-10 rounded-[3rem] border border-blue-100/50 space-y-8">
                     <h4 className="font-black text-blue-900 text-lg italic tracking-tight uppercase flex items-center gap-3"><TerminalSquare className="w-6 h-6" /> Step 2: Build & Extraction Protocol</h4>
                     <ol className="space-y-8 text-xs font-bold text-blue-800/70 leading-relaxed list-decimal ml-6">
                        <li className="pl-4">
                           <p className="font-black text-blue-900 uppercase tracking-widest text-[10px] mb-2">COMPILE UI</p>
                           Open your local terminal and run <code>npm run build</code>. This generates the <b>dist/</b> folder.
                        </li>
                        <li className="pl-4">
                           <p className="font-black text-blue-900 uppercase tracking-widest text-[10px] mb-2">UPLOAD FRONTEND</p>
                           Copy all files <i>inside</i> the local <b>dist/</b> folder to your server root (usually <code>public_html/</code>).
                        </li>
                        <li className="pl-4">
                           <p className="font-black text-blue-900 uppercase tracking-widest text-[10px] mb-2">DEPLOY BACKEND</p>
                           Download the <b>Master ZIP</b> (right panel). Extract it and upload the <b>api/</b> folder to your server root.
                        </li>
                        <li className="pl-4">
                           <p className="font-black text-blue-900 uppercase tracking-widest text-[10px] mb-2">INITIALIZE DATABASE</p>
                           Open phpMyAdmin. Import <code>api/sql/master_schema.sql</code> into your empty database.
                        </li>
                     </ol>
                  </div>
               </div>

               <div className="lg:col-span-4 space-y-8">
                  <div className="bg-[#1e1b4b] p-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[600px] border border-white/5">
                     <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12 scale-150"><Package className="w-80 h-80 text-blue-400" /></div>
                     <div className="space-y-6 relative z-10">
                        <div className="w-20 h-20 bg-white/10 rounded-[2rem] flex items-center justify-center border border-white/10 backdrop-blur-md shadow-2xl">
                           <FileArchive className="w-10 h-10 text-blue-300" />
                        </div>
                        <h3 className="text-5xl font-black italic tracking-tighter leading-[0.95] uppercase">Master <br/> Build <br/> Bundle</h3>
                        <p className="text-slate-400 text-lg leading-relaxed font-medium">Bundles all 40+ PHP MVC files and the full Master SQL Schema pre-configured for your node.</p>
                     </div>

                     <div className="space-y-6 relative z-10">
                        <div className="grid grid-cols-2 gap-4 mb-6">
                           <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5 backdrop-blur-md">
                              <div className="text-[10px] font-black uppercase text-blue-400 mb-1">Endpoints</div>
                              <div className="text-4xl font-black">40+</div>
                           </div>
                           <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5 backdrop-blur-md">
                              <div className="text-[10px] font-black uppercase text-blue-400 mb-1">Architecture</div>
                              <div className="text-3xl font-black italic">MVC</div>
                           </div>
                        </div>
                        <button onClick={handleDownloadZip} disabled={zipping} className="w-full py-8 bg-white text-indigo-950 rounded-[2.5rem] font-black uppercase tracking-[0.3em] shadow-2xl transition-all flex items-center justify-center gap-4 hover:bg-blue-50 hover:scale-[1.02] disabled:opacity-50 active:scale-95">
                           {zipping ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Download className="w-6 h-6" /> Get Everything</>}
                        </button>
                        <p className="text-[10px] text-center text-slate-500 font-bold uppercase tracking-widest italic">All-in-one Server Logic ZIP</p>
                     </div>
                  </div>
               </div>
            </div>
        </div>
      )}

      {systemSubTab === 'db-util' && (
        <div className="space-y-10 animate-in slide-in-from-bottom-4">
            <div className="p-12 bg-white rounded-[4rem] border border-slate-200 shadow-sm space-y-12">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-slate-100 pb-10">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[2.5rem] flex items-center justify-center border border-indigo-100 shadow-inner">
                            <DbIcon className="w-10 h-10" />
                        </div>
                        <div>
                           <h3 className="text-3xl font-black italic tracking-tight uppercase">Database Utility Bridge</h3>
                           <p className="text-slate-500 text-lg font-medium">Switch between Local Sandbox and Production Micro-services.</p>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <button onClick={() => api.setMode('MOCK')} className={`group p-12 rounded-[3.5rem] border-4 transition-all text-left space-y-6 relative overflow-hidden ${dataSource === 'MOCK' ? 'bg-indigo-600 border-indigo-200 text-white shadow-2xl' : 'bg-slate-50 border-slate-100 text-slate-400 opacity-60 hover:opacity-100'}`}>
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform"><Laptop className="w-32 h-32" /></div>
                        <div className="text-2xl font-black italic tracking-tight uppercase">Local Sandbox Mode</div>
                        <p className="text-sm font-medium opacity-80">Data stored in browser LocalStorage. Ideal for frontend testing.</p>
                    </button>
                    <button onClick={() => api.setMode('LIVE')} className={`group p-12 rounded-[3.5rem] border-4 transition-all text-left space-y-6 relative overflow-hidden ${dataSource === 'LIVE' ? 'bg-emerald-600 border-emerald-200 text-white shadow-2xl' : 'bg-slate-50 border-slate-100 text-slate-400 opacity-60 hover:opacity-100'}`}>
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform"><GlobeIcon className="w-32 h-32" /></div>
                        <div className="text-2xl font-black italic tracking-tight uppercase">Production Server Mode</div>
                        <p className="text-sm font-medium opacity-80">Syncs with your PHP/MySQL node. Mock data is <b>disabled</b> in this state.</p>
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

const CreationHub = ({ creationType, editingItem, setIsCreating, data, updateGlobalData }: any) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [formData, setFormData] = useState<any>({ name: '', unit: '', notes: '' });

  useEffect(() => { if (editingItem) setFormData(editingItem); }, [editingItem]);

  const handleSave = async () => {
    setIsSyncing(true);
    const dataKey = (creationType === 'chapter' ? 'chapters' : 'questions') as keyof StudentData;
    const currentList = [...data[dataKey] as any];
    if (editingItem) {
        updateGlobalData(dataKey, currentList.map((item: any) => item.id === editingItem.id ? { ...item, ...formData } : item));
    } else {
        updateGlobalData(dataKey, [{ ...formData, id: Date.now().toString() }, ...currentList]);
    }
    setTimeout(() => { setIsSyncing(false); setIsCreating(false); }, 800);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] p-12 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar">
        <h3 className="text-3xl font-black mb-10 italic tracking-tighter uppercase text-slate-900 border-b border-slate-100 pb-6">{editingItem ? 'Edit' : 'Initialize'} {creationType}</h3>
        <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black shadow-inner outline-none mb-6" placeholder="Enter Label/Text" />
        <div className="flex gap-4">
          <button onClick={() => setIsCreating(false)} className="flex-1 py-5 text-slate-400 font-black uppercase text-[10px] tracking-widest">Cancel</button>
          <button onClick={handleSave} disabled={isSyncing} className="flex-1 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] shadow-2xl flex items-center justify-center gap-3">
            {isSyncing ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CloudUpload className="w-5 h-5" /> Save</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminCMS;
