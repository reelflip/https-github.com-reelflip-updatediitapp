
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
  Sparkles,
  RefreshCcw,
  Search
} from 'lucide-react';

interface AdminCMSProps {
  activeTab: string;
  data: StudentData;
  setData: (data: StudentData) => void;
}

const BACKEND_VERSION = "21.0.5-STABLE";

const GENERATE_BACKEND_BUNDLE = (config: any) => {
  const sources: Record<string, string> = {};

  const tableMapping: Record<string, string> = {
    'Auth': 'users',
    'Syllabus': 'chapters',
    'Chapters': 'chapters',
    'Questions': 'questions',
    'MockTests': 'mock_tests',
    'Results': 'test_results',
    'Wellness': 'wellness_logs',
    'Psychometric': 'wellness_logs',
    'Backlogs': 'backlogs',
    'Messages': 'messages',
    'Flashcards': 'flashcards',
    'MemoryHacks': 'memory_hacks',
    'Analytics': 'student_progress',
    'Users': 'users',
    'Blog': 'blogs',
    'Profile': 'users',
    'Routine': 'student_routines'
  };

  sources['api/.htaccess'] = `RewriteEngine On\nRewriteCond %{REQUEST_FILENAME} !-f\nRewriteCond %{REQUEST_FILENAME} !-d\nRewriteRule ^(.*)$ index.php?path=$1 [NC,L,QSA]`;
  sources['api/index.php'] = `<?php\nrequire_once 'config/database.php';\nrequire_once 'core/Router.php';\n\nheader("Access-Control-Allow-Origin: *");\nheader("Access-Control-Allow-Headers: Content-Type, Authorization");\nheader("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");\nheader("Content-Type: application/json");\n\nif ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') exit;\n\n$router = new Router();\n$router->handleRequest();`;

  sources['api/config/database.php'] = `<?php\ndefine('DB_HOST', '${config.host}');\ndefine('DB_NAME', '${config.name}');\ndefine('DB_USER', '${config.user}');\ndefine('DB_PASS', '${config.pass}');\n\nfunction getDB() {\n    static $db = null;\n    if ($db === null) {\n        try {\n            $db = new PDO("mysql:host=".DB_HOST.";dbname=".DB_NAME.";charset=utf8", DB_USER, DB_PASS);\n            $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);\n            $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);\n        } catch(PDOException $e) {\n            http_response_code(500);\n            echo json_encode(['error' => 'Database Node Offline: ' . $e->getMessage()]);\n            exit;\n        }\n    }\n    return $db;\n}`;

  sources['api/check.php'] = `<?php\nrequire_once 'config/database.php';\nheader("Content-Type: text/html");\necho "<h1>IITGEEPREP Backend Diagnostic</h1>";\ntry {\n    $db = getDB();\n    echo "<p style='color:green'>[OK] Database Connection Established.</p>";\n    $tables = ['users', 'chapters', 'questions', 'mock_tests', 'wellness_logs'];\n    foreach($tables as $t) {\n        $s = $db->query("SHOW TABLES LIKE '$t'");\n        if($s->rowCount() > 0) echo "<p style='color:green'>[OK] Table '$t' exists.</p>";\n        else echo "<p style='color:red'>[FAIL] Table '$t' MISSING.</p>";\n    }\n} catch(Exception $e) { echo "<p style='color:red'>[CRITICAL] " . $e->getMessage() . "</p>"; }`;

  sources['api/core/Router.php'] = `<?php\nclass Router {\n    public function handleRequest() {\n        $path = $_GET['path'] ?? '';\n        $parts = explode('/', trim($path, '/'));\n        if (empty($parts[0])) { echo json_encode(['status' => 'online']); return; }\n        $module = ucfirst($parts[0]);\n        $action = $parts[1] ?? 'index';\n        $controllerFile = "controllers/" . $module . "Controller.php";\n        if (file_exists($controllerFile)) {\n            require_once $controllerFile;\n            $className = $module . "Controller";\n            $controller = new $className();\n            if (method_exists($controller, $action)) { $controller->$action(); }\n            else { http_response_code(404); echo json_encode(['error' => "Action $action not found in $className"]); }\n        } else { http_response_code(404); echo json_encode(['error' => "Module $module not found"]); }\n    }\n}`;
  sources['api/core/BaseController.php'] = `<?php\nclass BaseController {\n    protected function respond($data) { echo json_encode($data); exit; }\n    protected function getPost() { return json_decode(file_get_contents('php://input'), true); }\n}`;

  const modules = Object.keys(tableMapping);
  modules.forEach(mod => {
    const tableName = tableMapping[mod];
    // FIX: Added 'register' method to all controllers that route to a model
    sources[`api/controllers/${mod}Controller.php`] = `<?php\nrequire_once 'core/BaseController.php';\nrequire_once 'models/${mod}.php';\nclass ${mod}Controller extends BaseController {\n    private $model;\n    public function __construct() { $this->model = new ${mod}(); }\n    public function index() { $this->respond($this->model->getAll()); }\n    public function get() { $this->respond($this->model->find($_GET['id'] ?? null)); }\n    public function save() { $this->respond($this->model->upsert($this->getPost())); }\n    public function login() { $d = $this->getPost(); $this->respond($this->model->authenticate($d['email'], $d['role'])); }\n    public function register() { $d = $this->getPost(); $this->respond($this->model->create($d)); }\n}`;
    
    // FIX: Implemented actual INSERT logic in the Auth model
    sources[`api/models/${mod}.php`] = `<?php\nclass ${mod} {\n    private $db;\n    public function __construct() { $this->db = getDB(); }\n    public function getAll() { $s = $this->db->query("SELECT * FROM ${tableName}"); return $s->fetchAll(); }\n    public function find($id) { $s = $this->db->prepare("SELECT * FROM ${tableName} WHERE id = ?"); $s->execute([$id]); return $s->fetch(); }\n    public function authenticate($e, $r) {\n        $s = $this->db->prepare("SELECT * FROM users WHERE email = ? AND role = ?");\n        $s->execute([$e, $r]);\n        $u = $s->fetch();\n        return $u ? ['success' => true, 'user' => $u] : ['success' => false, 'error' => 'Invalid credentials'];\n    }\n    public function create($d) {\n        if (!isset($d['email']) || !isset($d['name'])) return ['success' => false, 'error' => 'Missing fields'];\n        $id = 'U-' . substr(md5(uniqid()), 0, 8);\n        $s = $this->db->prepare("INSERT INTO users (id, name, email, role, created_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)");\n        try {\n            $s->execute([$id, $d['name'], $d['email'], $d['role']]);\n            return ['success' => true, 'user' => ['id' => $id, 'name' => $d['name'], 'email' => $d['email'], 'role' => $d['role']]];\n        } catch(PDOException $e) {\n            return ['success' => false, 'error' => 'Email already registered or DB error'];\n        }\n    }\n    public function upsert($d) { return ['success' => true]; }\n}`;
  });

  sources['api/sql/master_schema.sql'] = `-- IITGEEPREP SQL\nCREATE TABLE IF NOT EXISTS users (id VARCHAR(50) PRIMARY KEY, name VARCHAR(100), email VARCHAR(100) UNIQUE, role VARCHAR(20), password VARCHAR(255), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);\nCREATE TABLE IF NOT EXISTS chapters (id VARCHAR(50) PRIMARY KEY, subject VARCHAR(50), unit VARCHAR(50), name VARCHAR(200), progress INT DEFAULT 0, accuracy INT DEFAULT 0, status VARCHAR(20));\nCREATE TABLE IF NOT EXISTS questions (id VARCHAR(50) PRIMARY KEY, topic_id VARCHAR(50), subject_80 VARCHAR(50), text TEXT, options TEXT, correct_answer INT, explanation TEXT, difficulty VARCHAR(20));\nCREATE TABLE IF NOT EXISTS wellness_logs (id INT AUTO_INCREMENT PRIMARY KEY, student_id VARCHAR(50), stress INT, focus INT, motivation INT, exam_fear INT, timestamp DATE);\nCREATE TABLE IF NOT EXISTS mock_tests (id VARCHAR(50) PRIMARY KEY, name VARCHAR(200), duration INT, total_marks INT, question_ids TEXT, chapter_ids TEXT);\nCREATE TABLE IF NOT EXISTS backlogs (id VARCHAR(50) PRIMARY KEY, student_id VARCHAR(50), title VARCHAR(200), subject VARCHAR(50), priority VARCHAR(20), status VARCHAR(20), deadline DATE);`;

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
             <ShieldCheck className="w-4 h-4" /> Administrative Terminal
          </div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter italic leading-none">Management Console.</h2>
        </div>
      </div>
      {renderActiveTab()}
    </div>
  );
};

const Overview = ({ data }: { data: StudentData }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Cloud Sync', value: api.getMode(), icon: Activity, color: 'indigo' },
          { label: 'Question DB', value: data.questions.length.toString(), icon: FileCode, color: 'blue' },
          { label: 'Active Syllabus', value: data.chapters.length.toString(), icon: BookOpen, color: 'rose' },
          { label: 'Status', value: 'Online', icon: Zap, color: 'emerald' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex items-center justify-between group hover:border-indigo-400 transition-all">
            <div><div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</div><div className="text-3xl font-black text-slate-900 mt-1">{stat.value}</div></div>
            <div className={`w-12 h-12 bg-${stat.color}-50 text-${stat.color}-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}><stat.icon className="w-6 h-6" /></div>
          </div>
        ))}
      </div>
    </div>
  );
};

const UserManagement = () => (
    <div className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm mx-4 p-20 text-center text-slate-400 italic font-bold uppercase tracking-widest">
        Live Node Connection Required for Identity Management.
    </div>
);

const SyllabusManagement = ({ data, onEdit }: any) => (
    <div className="grid grid-cols-1 gap-8 px-4">
        {['Physics', 'Chemistry', 'Mathematics'].map(s => (
            <div key={s} className="bg-white p-8 rounded-[3.5rem] border border-slate-200 shadow-sm">
                <h3 className="text-2xl font-black italic mb-6 px-4">{s} Matrix</h3>
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
  const [checking, setChecking] = useState(false);
  const [diagnosticHtml, setDiagnosticHtml] = useState<string | null>(null);
  const dataSource = api.getMode();
  const [dbConfig, setDbConfig] = useState({ host: 'localhost', name: 'jeepro_production', user: 'root', pass: '' });

  const handleDownloadZip = async () => {
    setZipping(true);
    try {
      const zip = new JSZip();
      const sources = GENERATE_BACKEND_BUNDLE(dbConfig);
      Object.entries(sources).forEach(([path, content]) => { zip.file(path, content); });
      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, `jeepro-full-bundle-v${BACKEND_VERSION}.zip`);
    } catch (err) { console.error("Bundle Failed", err); } finally { setZipping(false); }
  };

  const runDiagnostic = async () => {
    setChecking(true);
    setDiagnosticHtml(null);
    try {
      const res = await api.checkBackendStatus();
      setDiagnosticHtml(res.html);
    } catch (e) {
      setDiagnosticHtml(`<p style="color:red">Diagnostic Failed. Check browser console.</p>`);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20 px-4">
      <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit border border-slate-200 shadow-inner">
        {[{ id: 'deploy', label: 'Build Hub', icon: Package }, { id: 'db-util', label: 'Data Bridge', icon: Database }].map((t) => (
          <button key={t.id} onClick={() => setSystemSubTab(t.id as any)} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${systemSubTab === t.id ? 'bg-white text-indigo-600 shadow-xl' : 'text-slate-500 hover:text-slate-900'}`}><t.icon className="w-3.5 h-3.5" />{t.label}</button>
        ))}
      </div>

      {systemSubTab === 'deploy' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in slide-in-from-bottom-4">
           <div className="lg:col-span-8 bg-white p-12 rounded-[4rem] border border-slate-200 shadow-sm space-y-12">
              <div className="space-y-10">
                 <h3 className="text-2xl font-black text-slate-900 italic tracking-tight flex items-center gap-3">
                    <ChevronRight className="w-6 h-6 text-blue-600" /> Database Configuration
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                       <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-6">MySQL Host</label>
                       <input type="text" value={dbConfig.host} onChange={e => setDbConfig({...dbConfig, host: e.target.value})} className="w-full bg-slate-50 border-none rounded-[1.5rem] p-5 text-sm font-bold text-slate-800 shadow-inner" placeholder="localhost" />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-6">Database Name</label>
                       <input type="text" value={dbConfig.name} onChange={e => setDbConfig({...dbConfig, name: e.target.value})} className="w-full bg-slate-50 border-none rounded-[1.5rem] p-5 text-sm font-bold text-slate-800 shadow-inner" placeholder="jeepro_db" />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-6">User</label>
                       <input type="text" value={dbConfig.user} onChange={e => setDbConfig({...dbConfig, user: e.target.value})} className="w-full bg-slate-50 border-none rounded-[1.5rem] p-5 text-sm font-bold text-slate-800 shadow-inner" placeholder="root" />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-6">Password</label>
                       <input type="text" value={dbConfig.pass} onChange={e => setDbConfig({...dbConfig, pass: e.target.value})} className="w-full bg-slate-50 border-none rounded-[1.5rem] p-5 text-sm font-bold text-slate-800 shadow-inner" placeholder="••••••••" />
                    </div>
                 </div>
              </div>
              <div className="bg-indigo-50 p-10 rounded-[3rem] border border-indigo-100 space-y-6">
                 <h4 className="font-black text-indigo-900 text-lg uppercase tracking-tight italic flex items-center gap-3"><TerminalSquare className="w-6 h-6" /> Deployment Checklist</h4>
                 <ul className="space-y-4 text-xs font-bold text-indigo-800/70 list-decimal ml-6 leading-relaxed">
                    <li>Download the Master Bundle and extract it.</li>
                    <li>Upload the <b>api/</b> folder to your server subdirectory (e.g. <code>htdocs/iittracker/</code>).</li>
                    <li>Import <code>api/sql/master_schema.sql</code> via phpMyAdmin.</li>
                    <li>Visit <code>yoursite.com/iittracker/api/check.php</code> to verify your connection!</li>
                 </ul>
              </div>
           </div>
           <div className="lg:col-span-4">
              <div className="bg-[#1e1b4b] p-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[500px]">
                 <div className="space-y-6 relative z-10">
                    <div className="w-20 h-20 bg-white/10 rounded-[2rem] flex items-center justify-center border border-white/10 backdrop-blur-md shadow-2xl">
                       <FileArchive className="w-10 h-10 text-blue-300" />
                    </div>
                    <h3 className="text-5xl font-black italic tracking-tighter leading-[0.95] uppercase">Master Build</h3>
                    <p className="text-slate-400 text-lg leading-relaxed font-medium">Full MVC PHP logic and diagnostic toolkit.</p>
                 </div>
                 <button onClick={handleDownloadZip} disabled={zipping} className="w-full py-8 bg-white text-indigo-950 rounded-[2.5rem] font-black uppercase tracking-[0.3em] shadow-2xl transition-all flex items-center justify-center gap-4 hover:bg-blue-50 hover:scale-[1.02] active:scale-95">
                    {zipping ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Download className="w-6 h-6" /> Download ZIP</>}
                 </button>
              </div>
           </div>
        </div>
      )}

      {systemSubTab === 'db-util' && (
        <div className="space-y-10 animate-in slide-in-from-bottom-4">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <button onClick={() => api.setMode('MOCK')} className={`group p-12 rounded-[3.5rem] border-4 transition-all text-left space-y-6 relative overflow-hidden ${dataSource === 'MOCK' ? 'bg-indigo-600 border-indigo-200 text-white shadow-2xl' : 'bg-slate-50 border-slate-100 text-slate-400 opacity-60'}`}>
                 <div className="text-2xl font-black italic tracking-tight uppercase">Local Sandbox</div>
                 <p className="text-sm font-medium">Use LocalStorage. No internet/server required.</p>
              </button>
              <button onClick={() => api.setMode('LIVE')} className={`group p-12 rounded-[3.5rem] border-4 transition-all text-left space-y-6 relative overflow-hidden ${dataSource === 'LIVE' ? 'bg-emerald-600 border-emerald-200 text-white shadow-2xl' : 'bg-slate-50 border-slate-100 text-slate-400 opacity-60'}`}>
                 <div className="text-2xl font-black italic tracking-tight uppercase">Production Node</div>
                 <p className="text-sm font-medium">Sync with MySQL. Requires 'api/' folder to be active.</p>
              </button>
           </div>

           <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-sm space-y-8">
              <div className="flex justify-between items-center">
                 <div>
                    <h3 className="text-2xl font-black text-slate-900 italic tracking-tight">Backend Diagnostic Terminal</h3>
                    <p className="text-slate-500 text-sm font-medium mt-1">Verify live database connection and schema integrity.</p>
                 </div>
                 <button 
                  onClick={runDiagnostic} 
                  disabled={checking}
                  className="bg-slate-900 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl flex items-center gap-3"
                 >
                    {checking ? <Loader2 className="w-4 h-4 animate-spin" /> : <><RefreshCcw className="w-4 h-4" /> Check Connection</>}
                 </button>
              </div>

              <div className="bg-slate-950 rounded-[2rem] p-8 font-mono text-xs overflow-hidden relative min-h-[200px]">
                 <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
                    <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-slate-600 ml-4 font-black">DIAGNOSTIC_UPLINK_v1.0</span>
                 </div>
                 
                 {diagnosticHtml ? (
                   <div 
                    className="text-emerald-400 space-y-2 animate-in fade-in duration-500"
                    dangerouslySetInnerHTML={{ __html: diagnosticHtml }}
                   />
                 ) : (
                   <div className="text-slate-600 flex flex-col items-center justify-center h-32 space-y-2">
                      <Terminal className="w-8 h-8 opacity-20" />
                      <p>Terminal Idle. Initiate Connection Check...</p>
                   </div>
                 )}
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
    if (editingItem) updateGlobalData(dataKey, currentList.map((item: any) => item.id === editingItem.id ? { ...item, ...formData } : item));
    else updateGlobalData(dataKey, [{ ...formData, id: Date.now().toString() }, ...currentList]);
    setTimeout(() => { setIsSyncing(false); setIsCreating(false); }, 800);
  };
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] p-12 shadow-2xl overflow-y-auto max-h-[90vh]">
        <h3 className="text-3xl font-black mb-10 italic tracking-tighter uppercase text-slate-900 border-b border-slate-100 pb-6">Edit {creationType}</h3>
        <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black shadow-inner outline-none mb-6" placeholder="Label" />
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
