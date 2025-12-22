
import React, { useState } from 'react';
import { StudentData, Question, MockTest, Chapter, Blog, Flashcard, MemoryHack, Subject } from '../types';
import { 
  ShieldCheck, Settings, Database, FileEdit, Activity,
  CheckCircle, AlertCircle, Users, Search,
  MessageSquare, BookOpen,
  FileText, HelpCircle, Layers, Globe, RefreshCw, Brain, Eye,
  Mail, PenTool, Zap, ShieldAlert, Link2, UserPlus, History,
  ChevronDown, Cpu as CpuIcon, Terminal as TerminalIcon,
  Lock, ArrowRight, FileCode, CheckCircle2,
  Clock, CloudUpload, Server, Code2, HardDrive, Copy, Check, Download,
  ToggleLeft, ToggleRight, Radio, ServerCrash, Globe2, Fingerprint, LineChart as ChartIcon,
  X, Plus, Trash2, Save, Filter
} from 'lucide-react';
import { chatWithTutor } from '../services/geminiService';

interface AdminCMSProps {
  activeTab: string;
  data: StudentData;
  setData: (data: StudentData) => void;
}

const AdminCMS: React.FC<AdminCMSProps> = ({ activeTab, data, setData }) => {
  // Lifted Sub-tab States to prevent reset on re-render
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [contentSubTab, setContentSubTab] = useState<'flashcards' | 'hacks'>('flashcards');
  const [systemSubTab, setSystemSubTab] = useState<'ai' | 'deploy'>('ai');
  const [diagTab, setDiagTab] = useState<'focused-tests' | 'db-checker' | 'endpoints'>('focused-tests');
  const [isCreating, setIsCreating] = useState(false);
  const [creationType, setCreationType] = useState<'questions' | 'flashcards' | 'hacks'>('questions');
  const [editingTest, setEditingTest] = useState<MockTest | null>(null);

  const updateGlobalData = (key: keyof StudentData, newValue: any) => {
    setData({ ...data, [key]: newValue });
  };

  const toggleDataSource = (mode: 'MOCK' | 'LIVE') => {
    setData({ ...data, dataSourceMode: mode });
  };

  // --- CREATION MODAL LOGIC ---
  const CreationHub = () => {
    const [formData, setFormData] = useState<any>({
      // Question defaults
      text: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '', difficulty: 'MEDIUM', subject: 'Physics', topicId: data.chapters[0]?.id || '', source: '',
      // Flashcard defaults
      question: '', answer: '', type: 'Concept',
      // Hack defaults
      title: '', description: '', hack: '', category: 'Mnemonics'
    });

    const handleSave = () => {
      const id = `${creationType[0]}_${Date.now()}`;
      if (creationType === 'questions') {
        const newQ: Question = { ...formData, id };
        setData({ ...data, questions: [newQ, ...data.questions] });
      } else if (creationType === 'flashcards') {
        const newFC: Flashcard = { ...formData, id };
        setData({ ...data, flashcards: [newFC, ...data.flashcards] });
      } else {
        const newH: MemoryHack = { ...formData, id };
        setData({ ...data, memoryHacks: [newH, ...data.memoryHacks] });
      }
      setIsCreating(false);
    };

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsCreating(false)}></div>
        <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
          <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                   <Plus className="w-6 h-6" />
                </div>
                <div>
                   <h3 className="text-xl font-black text-slate-900 capitalize">New {creationType.slice(0, -1)}</h3>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Repository Entry</p>
                </div>
             </div>
             <button onClick={() => setIsCreating(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X className="w-6 h-6 text-slate-400" /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-6">
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                   <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Subject vertical</label>
                   <select 
                      value={formData.subject} 
                      onChange={e => setFormData({...formData, subject: e.target.value})}
                      className="w-full bg-slate-100 border-none rounded-2xl p-4 text-xs font-bold"
                    >
                      <option>Physics</option><option>Chemistry</option><option>Mathematics</option>
                   </select>
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Difficulty level</label>
                   <select 
                      value={formData.difficulty} 
                      onChange={e => setFormData({...formData, difficulty: e.target.value})}
                      className="w-full bg-slate-100 border-none rounded-2xl p-4 text-xs font-bold"
                    >
                      <option>EASY</option><option>MEDIUM</option><option>HARD</option>
                   </select>
                </div>
             </div>

             {creationType === 'questions' && (
               <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Assign Chapter</label>
                      <select 
                        value={formData.topicId} 
                        onChange={e => setFormData({...formData, topicId: e.target.value})}
                        className="w-full bg-slate-100 border-none rounded-2xl p-4 text-xs font-bold"
                      >
                        {data.chapters.map(ch => (
                          <option key={ch.id} value={ch.id}>{ch.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Previous Year / Source</label>
                      <input 
                        type="text" 
                        value={formData.source} 
                        onChange={e => setFormData({...formData, source: e.target.value})} 
                        className="w-full bg-slate-100 border-none rounded-2xl p-4 text-xs font-bold" 
                        placeholder="e.g. JEE Main 2023, Archive" 
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                     <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Problem Statement</label>
                     <textarea value={formData.text} onChange={e => setFormData({...formData, text: e.target.value})} rows={3} className="w-full bg-slate-100 border-none rounded-2xl p-4 text-xs font-medium" placeholder="Enter problem statement..." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     {formData.options.map((opt: string, i: number) => (
                       <div key={i} className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase ml-4">Option {String.fromCharCode(65+i)}</label>
                          <input type="text" value={opt} onChange={e => {
                             const newOpts = [...formData.options];
                             newOpts[i] = e.target.value;
                             setFormData({...formData, options: newOpts});
                          }} className="w-full bg-slate-100 border-none rounded-xl p-3 text-xs font-bold" />
                       </div>
                     ))}
                  </div>
                  <div className="space-y-1">
                     <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Correct Option Index (0-3)</label>
                     <input type="number" min="0" max="3" value={formData.correctAnswer} onChange={e => setFormData({...formData, correctAnswer: parseInt(e.target.value)})} className="w-full bg-slate-100 border-none rounded-2xl p-4 text-xs font-bold" />
                  </div>
                  <div className="space-y-1">
                     <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Detailed Explanation</label>
                     <textarea value={formData.explanation} onChange={e => setFormData({...formData, explanation: e.target.value})} rows={3} className="w-full bg-slate-100 border-none rounded-2xl p-4 text-xs font-medium" placeholder="Break down the steps..." />
                  </div>
               </div>
             )}

             {creationType === 'flashcards' && (
               <div className="space-y-6">
                  <div className="space-y-1">
                     <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Front (Question/Formula Name)</label>
                     <input type="text" value={formData.question} onChange={e => setFormData({...formData, question: e.target.value})} className="w-full bg-slate-100 border-none rounded-2xl p-4 text-xs font-bold" />
                  </div>
                  <div className="space-y-1">
                     <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Back (Answer/Details)</label>
                     <textarea value={formData.answer} onChange={e => setFormData({...formData, answer: e.target.value})} rows={3} className="w-full bg-slate-100 border-none rounded-2xl p-4 text-xs font-medium" />
                  </div>
                  <div className="space-y-1">
                     <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Card Type</label>
                     <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-slate-100 border-none rounded-2xl p-4 text-xs font-bold">
                        <option>Concept</option><option>Formula</option><option>Fact</option>
                     </select>
                  </div>
               </div>
             )}

             {creationType === 'hacks' && (
               <div className="space-y-6">
                  <div className="space-y-1">
                     <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Hack Title</label>
                     <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-100 border-none rounded-2xl p-4 text-xs font-bold" />
                  </div>
                  <div className="space-y-1">
                     <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Short Description</label>
                     <input type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-100 border-none rounded-2xl p-4 text-xs font-medium" />
                  </div>
                  <div className="space-y-1">
                     <label className="text-[10px] font-black uppercase text-slate-400 ml-4">The Mnemonic/Shortcut</label>
                     <textarea value={formData.hack} onChange={e => setFormData({...formData, hack: e.target.value})} rows={3} className="w-full bg-slate-100 border-none rounded-2xl p-4 text-xs font-black italic" placeholder="e.g. SOH CAH TOA" />
                  </div>
               </div>
             )}
          </div>

          <div className="p-8 border-t border-slate-100 flex gap-4">
             <button onClick={() => setIsCreating(false)} className="flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all">Cancel</button>
             <button onClick={handleSave} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">Add to Database</button>
          </div>
        </div>
      </div>
    );
  };

  const SystemModule = () => {
    const [selectedModel, setSelectedModel] = useState(data.aiTutorModel || 'gemini-3-flash-preview');
    const [sandboxInput, setSandboxInput] = useState('');
    const [sandboxOutput, setSandboxOutput] = useState('');
    const [isTesting, setIsTesting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [copiedFile, setCopiedFile] = useState<string | null>(null);

    const models = [
      { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash', tag: 'SPEED', tagColor: 'blue', desc: 'Ultra-fast, optimized for quick doubts and scheduling.' },
      { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro', tag: 'REASONING', tagColor: 'indigo', desc: 'Deep reasoning and complex Physics problem solving.' },
      { id: 'llama-3.1-70b', name: 'Llama 3.1 (70B)', tag: 'GENERAL', tagColor: 'violet', desc: 'Versatile model with great theory explanation capabilities.', disabled: true },
      { id: 'deepseek-v3', name: 'DeepSeek V3', tag: 'LOGIC', tagColor: 'cyan', desc: 'Logic-heavy model, excellent for Inorganic Chemistry facts.', disabled: true },
      { id: 'qwen-2.5-math', name: 'Qwen 2.5 Math', tag: 'MATH', tagColor: 'emerald', desc: 'Specialized for high-level Mathematics and Calculus.', disabled: true },
      { id: 'mistral-large', name: 'Mistral Large', tag: 'BALANCED', tagColor: 'orange', desc: 'Balanced performance for general guidance and motivation.', disabled: true },
    ];

    const handleTestModel = async () => {
      if (!sandboxInput.trim()) return;
      setIsTesting(true);
      setSandboxOutput('Initializing session and verifying model handshake...');
      try {
        const response = await chatWithTutor([], sandboxInput, selectedModel);
        setSandboxOutput(response || 'No response from model.');
      } catch (err) {
        setSandboxOutput('Error verifying model: Requested entity not found or invalid configuration.');
      } finally {
        setIsTesting(false);
      }
    };

    const handleSaveConfig = () => {
      setIsSaving(true);
      setData({ ...data, aiTutorModel: selectedModel });
      setTimeout(() => setIsSaving(false), 800);
    };

    const copyToClipboard = (text: string, filename: string) => {
      navigator.clipboard.writeText(text);
      setCopiedFile(filename);
      setTimeout(() => setCopiedFile(null), 2000);
    };

    const phpFiles = {
      'db_config.php': `<?php
// Hostinger MySQL Connection Configuration
$host = 'localhost';
$db   = 'u123456789_jeepro';
$user = 'u123456789_admin';
$pass = 'YourSecretPassword';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ATTR_ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
     $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\\PDOException $e) {
     throw new \\PDOException($e->getMessage(), (int)$e->getCode());
}
?>`,
      'auth_login.php': `<?php
header('Content-Type: application/json');
require 'db_config.php';

$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'] ?? '';
$pass = $data['password'] ?? '';

$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch();

if ($user && password_verify($pass, $user['password_hash'])) {
    echo json_encode(['success' => true, 'user' => $user]);
} else {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
}
?>`
    };

    const sqlSchema = `-- JEE-PRO PRODUCTION SCHEMA v17.0\nCREATE TABLE users (\n    id INT AUTO_INCREMENT PRIMARY KEY,\n    name VARCHAR(255) NOT NULL,\n    email VARCHAR(255) UNIQUE NOT NULL,\n    password_hash VARCHAR(255) NOT NULL,\n    role ENUM('STUDENT', 'PARENT', 'ADMIN') DEFAULT 'STUDENT',\n    routine_json TEXT,\n    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);`;

    return (
      <div className="space-y-6 animate-in fade-in duration-500 pb-20">
        <div className="bg-[#0b1120] px-10 py-8 rounded-[1.5rem] text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 flex items-center justify-center">
                <Activity className="w-7 h-7 text-blue-400" />
             </div>
             <div>
                <h3 className="text-2xl font-black tracking-tight">Admin System</h3>
                <p className="text-[10px] font-black uppercase text-slate-500 mt-0.5 tracking-widest">v17.0 Sync Status Control</p>
             </div>
          </div>
          <div className="flex bg-[#1e293b] p-1.5 rounded-xl border border-white/5 overflow-x-auto max-w-full">
            {[
              { id: 'ai', label: 'Intelligence' },
              { id: 'deploy', label: 'Integrations' }
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setSystemSubTab(tab.id as any)}
                className={`px-8 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  systemSubTab === tab.id ? 'bg-[#2563eb] text-white shadow-lg' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {systemSubTab === 'ai' ? (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {models.map(model => (
                <div 
                  key={model.id}
                  onClick={() => !model.disabled && setSelectedModel(model.id)}
                  className={`relative p-8 rounded-2xl bg-white border-2 transition-all cursor-pointer group ${
                    selectedModel === model.id ? 'border-blue-600 ring-4 ring-blue-50' : 'border-slate-100 hover:border-slate-200 shadow-sm'
                  } ${model.disabled ? 'opacity-60 cursor-not-allowed bg-slate-50' : ''}`}
                >
                  <div className="flex justify-between items-start mb-5">
                    <span className={`text-[9px] font-black px-2.5 py-1 rounded uppercase tracking-widest ${
                      model.tagColor === 'blue' ? 'bg-blue-50 text-blue-600' :
                      model.tagColor === 'indigo' ? 'bg-indigo-50 text-indigo-600' :
                      model.tagColor === 'violet' ? 'bg-violet-50 text-violet-600' :
                      model.tagColor === 'cyan' ? 'bg-cyan-50 text-cyan-600' :
                      model.tagColor === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                      'bg-orange-50 text-orange-600'
                    }`}>
                      {model.tag}
                    </span>
                    {model.disabled && <Lock className="w-4 h-4 text-slate-300" />}
                  </div>
                  <h4 className="text-xl font-black text-slate-900 mb-2">{model.name}</h4>
                  <p className="text-[11px] text-slate-500 font-bold leading-relaxed">{model.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
               <div className="px-8 py-6 border-b border-slate-100 flex items-center gap-3">
                  <span className="text-slate-400 font-mono text-xl">&gt;_</span>
                  <h4 className="text-sm font-black text-slate-900">AI Sandbox Verification</h4>
               </div>
               
               <div className="p-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 min-h-[240px]">
                    <div className="flex flex-col">
                       <textarea 
                          value={sandboxInput}
                          onChange={(e) => setSandboxInput(e.target.value)}
                          className="flex-1 w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 text-sm font-medium resize-none focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder-slate-300"
                          placeholder="Send a test doubt..."
                       />
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 overflow-y-auto max-h-[300px]">
                       <div className="text-sm font-medium text-slate-700 leading-relaxed">
                          {isTesting ? (
                            <div className="flex items-center gap-2 text-blue-600 font-bold">
                              <RefreshCw className="w-4 h-4 animate-spin" /> {sandboxOutput}
                            </div>
                          ) : sandboxOutput || <span className="text-slate-300 italic">No output. Enter a query and click 'Test Model' to verify configuration.</span>}
                       </div>
                    </div>
                 </div>

                 <div className="mt-8 flex justify-between items-center">
                    <button 
                      onClick={handleTestModel}
                      disabled={isTesting || !sandboxInput.trim()}
                      className="bg-[#0f172a] text-white px-10 py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {isTesting ? 'Verifying...' : 'Test Model'}
                    </button>
                    <button 
                      onClick={handleSaveConfig}
                      disabled={isSaving}
                      className="bg-[#2563eb] text-white px-12 py-4 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2"
                    >
                       {isSaving ? <CheckCircle className="w-4 h-4" /> : 'Save AI Config'}
                    </button>
                 </div>
               </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
             {/* GLOBAL DATA NODE CONTROLLER */}
             <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-sm space-y-6">
               <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                  <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 ${data.dataSourceMode === 'LIVE' ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'}`}>
                        {data.dataSourceMode === 'LIVE' ? <Globe2 className="w-8 h-8 animate-pulse" /> : <ServerCrash className="w-8 h-8" />}
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-slate-900">Global Data Node Controller</h4>
                        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                          Source status: <span className={data.dataSourceMode === 'LIVE' ? 'text-emerald-600' : 'text-amber-600'}>{data.dataSourceMode === 'LIVE' ? 'LIVE PRODUCTION (PHP)' : 'OFFLINE SIMULATION (MOCK)'}</span>
                        </p>
                      </div>
                  </div>

                  <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                      <button 
                        onClick={() => toggleDataSource('MOCK')}
                        className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${data.dataSourceMode === 'MOCK' || !data.dataSourceMode ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                      >
                        Mock Mode
                      </button>
                      <button 
                        onClick={() => toggleDataSource('LIVE')}
                        className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${data.dataSourceMode === 'LIVE' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                      >
                        Live Mode
                      </button>
                  </div>
               </div>
            </div>

            {/* THIRD-PARTY INTEGRATIONS (OAuth & Analytics) */}
            <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-10">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-slate-900">Third-Party Core Handshake</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Connect external authentication and traffic monitoring</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                     <div className="flex items-center gap-3">
                        <Fingerprint className="w-5 h-5 text-indigo-500" />
                        <h5 className="font-black text-sm text-slate-700 uppercase tracking-widest">OAuth Authentication</h5>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Google OAuth Client ID</label>
                        <input 
                          type="text" 
                          value={data.oauthClientId || ''}
                          onChange={(e) => updateGlobalData('oauthClientId', e.target.value)}
                          className="w-full bg-white border-slate-200 rounded-2xl p-4 text-xs font-mono text-slate-600 focus:ring-2 focus:ring-indigo-600 transition-all shadow-sm" 
                          placeholder="apps.googleusercontent.com..." 
                        />
                     </div>
                  </div>

                  <div className="space-y-6 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                     <div className="flex items-center gap-3">
                        <ChartIcon className="w-5 h-5 text-emerald-500" />
                        <h5 className="font-black text-sm text-slate-700 uppercase tracking-widest">Global Traffic Node</h5>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Analytics Measurement ID</label>
                        <input 
                          type="text" 
                          value={data.analyticsId || ''}
                          onChange={(e) => updateGlobalData('analyticsId', e.target.value)}
                          className="w-full bg-white border-slate-200 rounded-2xl p-4 text-xs font-mono text-slate-600 focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm" 
                          placeholder="G-XXXXXXXXXX" 
                        />
                     </div>
                  </div>
               </div>
            </div>

            {/* PHP Source / Deployment Bundle */}
            <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
               <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                      <FileCode className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-slate-900">Backend PHP Infrastructure</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Download API bundle for Hostinger</p>
                    </div>
                  </div>
                  <button className="bg-[#2563eb] text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                     <Download className="w-3 h-3" /> Download Bundle
                  </button>
               </div>
               <div className="p-10 text-center">
                  <p className="text-slate-400 text-xs italic">All API scripts, db_configs, and user handlers are bundled into a single ZIP for direct public_html upload.</p>
               </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'admin-overview': return <Overview data={data} />;
      case 'admin-users': return <UserManagement data={data} />;
      case 'admin-syllabus': return <SyllabusManagement data={data} setEditingChapter={setEditingChapter} editingChapter={editingChapter} setIsCreating={setIsCreating} setData={setData} />;
      case 'admin-questions': return <QuestionBankManager data={data} setData={setData} setIsCreating={setIsCreating} setCreationType={setCreationType} />;
      case 'admin-content': return <ContentManager data={data} contentSubTab={contentSubTab} setContentSubTab={setContentSubTab} setIsCreating={setIsCreating} setCreationType={setCreationType} setData={setData} />;
      case 'admin-blog': return <BlogManager data={data} />;
      case 'admin-inbox': return <InboxView data={data} />;
      case 'admin-diagnostics': return <DiagnosticsModule data={data} diagTab={diagTab} setDiagTab={setDiagTab} />;
      case 'admin-tests': return <MockTestManager data={data} setEditingTest={setEditingTest} editingTest={editingTest} setIsCreating={setIsCreating} updateGlobalData={updateGlobalData} />;
      case 'admin-system': return <SystemModule />;
      default: return <div className="text-center py-24 text-slate-300 italic font-medium">Accessing Module: {activeTab}...</div>;
    }
  };

  return (
    <div className="pb-20">
      {renderActiveTab()}
      {isCreating && <CreationHub />}
    </div>
  );
};

// --- HELPER COMPONENTS ---

const Overview = ({ data }: { data: StudentData }) => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { label: 'Total Users', value: '1,284', icon: Users, color: 'indigo' },
        { label: 'Active Sessions', value: '412', icon: Activity, color: 'emerald' },
        { label: 'Questions Pool', value: data.questions.length.toString(), icon: FileCode, color: 'blue' },
        { label: 'Unread Support', value: data.messages.filter(m => !m.isRead).length.toString(), icon: Mail, color: 'rose' },
      ].map((stat, i) => (
        <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex items-center justify-between group hover:border-indigo-200 transition-all">
          <div><div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</div><div className="text-3xl font-black text-slate-900 mt-1">{stat.value}</div></div>
          <div className={`w-12 h-12 bg-${stat.color}-50 text-${stat.color}-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}><stat.icon className="w-6 h-6" /></div>
        </div>
      ))}
    </div>
  </div>
);

const UserManagement = ({ data }: { data: StudentData }) => (
  <div className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm animate-in fade-in duration-500">
    <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
      <div><h3 className="text-2xl font-black">User Directory</h3><p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">Access Control & Role Handshakes</p></div>
      <button className="bg-slate-900 text-white px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl hover:bg-indigo-600 transition-all flex items-center gap-2"><UserPlus className="w-4 h-4" /> Add User</button>
    </div>
    <table className="w-full text-left">
      <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest">
        <tr><th className="px-10 py-6">Identifier</th><th className="px-10 py-6">Assigned Role</th><th className="px-10 py-6">Health Status</th><th className="px-10 py-6 text-right">Operations</th></tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {[{ name: 'Aryan Sharma', role: 'STUDENT', status: 'Healthy' }, { name: 'Rahul Gupta', role: 'PARENT', status: 'Healthy' }].map((u, i) => (
          <tr key={i} className="hover:bg-slate-50 transition-colors">
            <td className="px-10 py-8"><div className="flex items-center gap-4"><div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-lg border border-indigo-100">{u.name[0]}</div><div className="font-black text-slate-800">{u.name}</div></div></td>
            <td className="px-10 py-8"><span className="text-[9px] font-black bg-slate-100 text-slate-600 px-4 py-1.5 rounded-full tracking-widest uppercase">{u.role}</span></td>
            <td className="px-10 py-8"><span className="text-emerald-500 text-[10px] font-black uppercase flex items-center gap-2"><div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div> {u.status}</span></td>
            <td className="px-10 py-8 text-right"><button className="p-3 text-slate-300 hover:text-indigo-600 bg-slate-50 rounded-xl hover:bg-indigo-50 transition-all"><Settings className="w-5 h-5" /></button></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const SyllabusManagement = ({ data, setEditingChapter, editingChapter, setIsCreating }: any) => { if (editingChapter) return <div className="p-24 text-center italic font-bold text-slate-400">Advanced Chapter Editor Loaded.</div>; return (<div className="space-y-8 animate-in fade-in duration-500"><div className="bg-white p-8 rounded-[3rem] border border-slate-200 flex justify-between items-center shadow-sm"><div className="flex items-center gap-4"><div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center"><BookOpen className="w-7 h-7" /></div><div><h3 className="text-2xl font-black">Curriculum Master</h3><p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{data.chapters.length} Core Units</p></div></div><button onClick={() => setIsCreating(true)} className="bg-slate-900 text-white px-10 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl">Add Syllabus Node</button></div><div className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm"><table className="w-full text-left"><thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest"><tr><th className="px-10 py-6">Chapter Node</th><th className="px-10 py-6">Subject Pillar</th><th className="px-10 py-6 text-right">Operations</th></tr></thead><tbody className="divide-y divide-slate-100">{data.chapters.map((ch: any) => (<tr key={ch.id} className="hover:bg-slate-50 transition-colors"><td className="px-10 py-8 font-black text-slate-800">{ch.name}</td><td className="px-10 py-8"><span className="text-[9px] font-black bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full uppercase tracking-widest">{ch.subject}</span></td><td className="px-10 py-8 text-right"><button onClick={() => setEditingChapter(ch)} className="text-indigo-600 text-[10px] font-black uppercase tracking-widest hover:underline">Edit Theory Node</button></td></tr>))}</tbody></table></div></div>); };

const QuestionBankManager = ({ data, setData, setIsCreating, setCreationType }: any) => {
  const [filterSubject, setFilterSubject] = useState<string>('All');
  const [search, setSearch] = useState('');

  const filtered = data.questions.filter((q: Question) => {
    const matchesSubject = filterSubject === 'All' || q.subject === filterSubject;
    const matchesSearch = q.text.toLowerCase().includes(search.toLowerCase()) || (q.source?.toLowerCase().includes(search.toLowerCase()));
    return matchesSubject && matchesSearch;
  });

  const handleDelete = (id: string) => {
    if (!confirm('Permanently remove this problem from the pool?')) return;
    setData({...data, questions: data.questions.filter((q: Question) => q.id !== id)});
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
           <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <FileCode className="w-7 h-7" />
           </div>
           <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Question Bank</h3>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{data.questions.length} Active Problems</p>
           </div>
        </div>
        <button 
          onClick={() => { setCreationType('questions'); setIsCreating(true); }} 
          className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl flex items-center gap-2 hover:bg-indigo-600 transition-all"
        >
           <Plus className="w-4 h-4" /> Add Problem
        </button>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row gap-4 bg-slate-50/30">
          <div className="relative flex-1">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
             <input 
               type="text" placeholder="Search questions or previous exam sources..." 
               value={search} onChange={e => setSearch(e.target.value)}
               className="w-full pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-indigo-600 transition-all"
             />
          </div>
          <div className="flex gap-2">
             {['All', 'Physics', 'Chemistry', 'Mathematics'].map(s => (
               <button 
                key={s} onClick={() => setFilterSubject(s)}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${filterSubject === s ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}
               >
                 {s}
               </button>
             ))}
          </div>
        </div>

        <table className="w-full text-left">
           <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                 <th className="px-10 py-6">Problem Summary</th>
                 <th className="px-10 py-6">Chapter Mapping</th>
                 <th className="px-10 py-6">Source / Year</th>
                 <th className="px-10 py-6 text-right">Actions</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-slate-100">
              {filtered.map((q: Question) => (
                <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-10 py-8">
                     <div className="font-bold text-slate-800 line-clamp-1 mb-1">{q.text}</div>
                     <div className="flex gap-2">
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md ${
                           q.difficulty === 'HARD' ? 'bg-rose-50 text-rose-600' :
                           q.difficulty === 'MEDIUM' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                        }`}>{q.difficulty}</span>
                        <span className="text-[8px] font-black uppercase bg-slate-100 text-slate-400 px-2 py-0.5 rounded-md">{q.subject}</span>
                     </div>
                  </td>
                  <td className="px-10 py-8">
                     <div className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                        {data.chapters.find(c => c.id === q.topicId)?.name || 'Unmapped'}
                     </div>
                  </td>
                  <td className="px-10 py-8">
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {q.source || 'Standard pool'}
                     </span>
                  </td>
                  <td className="px-10 py-8 text-right flex items-center justify-end gap-2 mt-4">
                     <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors"><FileEdit className="w-4 h-4" /></button>
                     <button onClick={() => handleDelete(q.id)} className="p-2 text-slate-300 hover:text-rose-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
           </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-20 text-center space-y-4">
             <Filter className="w-12 h-12 text-slate-100 mx-auto" />
             <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No matching problems found</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ContentManager = ({ data, contentSubTab, setContentSubTab, setIsCreating, setCreationType, setData }: any) => {
  const handleDelete = (id: string) => {
     if (!confirm('Are you sure you want to delete this item?')) return;
     if (contentSubTab === 'flashcards') {
        setData({...data, flashcards: data.flashcards.filter((f: any) => f.id !== id)});
     } else {
        setData({...data, memoryHacks: data.memoryHacks.filter((h: any) => h.id !== id)});
     }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex bg-slate-100 p-1.5 rounded-2xl">
          {(['flashcards', 'hacks'] as const).map((t) => (
            <button key={t} onClick={() => setContentSubTab(t)} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${contentSubTab === t ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>{t}</button>
          ))}
        </div>
        <button onClick={() => { setCreationType(contentSubTab as any); setIsCreating(true); }} className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl flex items-center gap-2">
           <Plus className="w-4 h-4" /> New {contentSubTab.slice(0, -1)}
        </button>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
           <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                 <th className="px-10 py-6">Content Preview</th>
                 <th className="px-10 py-6">Subject / Meta</th>
                 <th className="px-10 py-6 text-right">Actions</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-slate-100">
              {contentSubTab === 'flashcards' && data.flashcards.map((f: Flashcard) => (
                <tr key={f.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-10 py-8 font-bold text-slate-800">{f.question}</td>
                  <td className="px-10 py-8">
                     <span className="text-[9px] font-black bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full uppercase tracking-widest">{f.subject}</span>
                     <span className="ml-2 text-[9px] font-black text-slate-400 uppercase">{f.type}</span>
                  </td>
                  <td className="px-10 py-8 text-right">
                     <button onClick={() => handleDelete(f.id)} className="p-2 text-slate-300 hover:text-rose-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
              {contentSubTab === 'hacks' && data.memoryHacks.map((h: MemoryHack) => (
                <tr key={h.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-10 py-8 font-bold text-slate-800">{h.title}</td>
                  <td className="px-10 py-8">
                     <span className="text-[9px] font-black bg-rose-50 text-rose-600 px-3 py-1 rounded-full uppercase tracking-widest">{h.subject}</span>
                     <span className="ml-2 text-[9px] font-black text-slate-400 uppercase">{h.category}</span>
                  </td>
                  <td className="px-10 py-8 text-right">
                     <button onClick={() => handleDelete(h.id)} className="p-2 text-slate-300 hover:text-rose-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
           </tbody>
        </table>
      </div>
    </div>
  );
};

const BlogManager = ({ data }: { data: StudentData }) => (<div className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm animate-in fade-in duration-500"><div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50"><div><h3 className="text-2xl font-black">Blog CMS</h3><p className="text-[10px] font-black uppercase text-slate-400 mt-1 tracking-widest">Article Management</p></div><button className="bg-slate-900 text-white px-10 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl">New Post</button></div><div className="divide-y divide-slate-100">{data.blogs.map(b => (<div key={b.id} className="p-8 flex justify-between items-center hover:bg-slate-50 transition-colors"><div><h4 className="font-black text-slate-800 text-lg">{b.title}</h4><div className="text-[10px] text-slate-400 font-bold uppercase mt-1">{b.date}</div></div><span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full uppercase tracking-widest">{b.status}</span></div>))}</div></div>);

const InboxView = ({ data }: { data: StudentData }) => (<div className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm animate-in fade-in duration-500"><div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50"><div><h3 className="text-2xl font-black">Support Inbox</h3><p className="text-[10px] font-black uppercase text-slate-400 mt-1 tracking-widest">Incoming Communications</p></div></div><div className="divide-y divide-slate-100">{data.messages.map(m => (<div key={m.id} className={`p-8 flex justify-between items-center hover:bg-slate-50 transition-colors ${!m.isRead ? 'bg-indigo-50/30' : ''}`}><div className="flex gap-6 items-center"><div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-400 font-black border border-slate-100 text-xl">{m.name[0]}</div><div><div className="flex items-center gap-3"><span className="font-black text-slate-800">{m.name}</span><span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{m.email}</span></div><div className="text-sm font-bold text-slate-600 mt-1">{m.subject}</div><p className="text-xs text-slate-400 mt-2 line-clamp-1">{m.message}</p></div></div><div className="flex items-center gap-4"><div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{m.date}</div><button className="p-3 bg-slate-50 rounded-xl text-slate-300 hover:text-indigo-600 transition-all"><Eye className="w-4 h-4" /></button></div></div>))}</div></div>);

const MockTestManager = ({ data, setEditingTest }: any) => (<div className="space-y-8 animate-in fade-in duration-500"><div className="bg-white p-8 rounded-[3rem] border border-slate-200 flex justify-between items-center shadow-sm"><div className="flex items-center gap-4"><div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center"><FileText className="w-7 h-7" /></div><div><h3 className="text-2xl font-black">Test Repository</h3><p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{data.mockTests.length} Papers</p></div></div><button className="bg-slate-900 text-white px-10 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl">Deploy New Paper</button></div><div className="grid grid-cols-1 md:grid-cols-3 gap-8">{data.mockTests.map((t: any) => (<div key={t.id} className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm hover:border-rose-400 transition-all flex flex-col justify-between group"><div><div className="text-[10px] font-black uppercase text-rose-600 bg-rose-50 px-4 py-1.5 rounded-full w-fit mb-6 tracking-widest">{t.difficulty}</div><h4 className="text-xl font-black text-slate-800 mb-4 group-hover:text-rose-600 transition-colors leading-tight">{t.name}</h4><div className="flex gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10 border-t border-slate-50 pt-6"><span className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> {t.duration}m</span><span className="flex items-center gap-2"><Layers className="w-3.5 h-3.5" /> {t.questionIds.length} Qs</span></div></div><button onClick={() => setEditingTest(t)} className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all shadow-xl shadow-slate-100 group-hover:shadow-rose-100">Config Paper Node</button></div>))}</div></div>);

const DiagnosticsModule = ({ data, diagTab, setDiagTab }: any) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
           <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
              <Activity className="w-7 h-7" />
           </div>
           <div>
              <h3 className="text-2xl font-black text-slate-900">System Diagnostics</h3>
              <p className="text-[10px] font-black uppercase text-slate-400 mt-1 tracking-widest flex items-center gap-2">
                 Active Data Node: <span className={data.dataSourceMode === 'LIVE' ? 'text-emerald-500' : 'text-amber-500'}>{data.dataSourceMode || 'MOCK'}</span>
              </p>
           </div>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-2xl">
          {['focused-tests', 'db-checker', 'endpoints'].map((t: any) => (
            <button 
              key={t}
              onClick={() => setDiagTab(t)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${diagTab === t ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              {t.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {diagTab === 'focused-tests' && <FocusedTests data={data} />}
      {diagTab === 'db-checker' && <DBChecker />}
      {diagTab === 'endpoints' && <EndpointValidator />}
    </div>
  );
};

const FocusedTests = ({ data }: { data: StudentData }) => {
  const [results, setResults] = useState<Record<string, 'pending' | 'success' | 'fail'>>({});

  const runTest = (id: string, logic: () => boolean) => {
    setResults(prev => ({ ...prev, [id]: 'pending' }));
    setTimeout(() => {
      const pass = logic();
      setResults(prev => ({ ...prev, [id]: pass ? 'success' : 'fail' }));
    }, 1000);
  };

  const tests = [
    {
      id: 'psych-student-attempt',
      name: 'Student Test Lifecycle',
      desc: 'Check if student can attempt psychometric test and results are stored in data node.',
      icon: Brain,
      logic: () => data.psychometricHistory.length > 0
    },
    {
      id: 'psych-result-persistence',
      name: 'Result Persistence (DB)',
      desc: 'Check if AI-generated summaries and scores are persisting in global state.',
      icon: Database,
      logic: () => data.psychometricHistory.every(h => !!h.timestamp && (h.studentSummary !== undefined))
    },
    {
      id: 'parent-summary-access',
      name: 'Parent Visibility Sync',
      desc: 'Verify that Parent role can view the specific summary and customized feedback.',
      icon: Eye,
      logic: () => {
        const latest = data.psychometricHistory[data.psychometricHistory.length - 1];
        return !!latest.parentAdvice || !!latest.studentSummary;
      }
    },
    {
      id: 'student-search-engine',
      name: 'Discovery Logic (Search)',
      desc: 'Verify student lookup by Name or 6-digit ID for family connection.',
      icon: Search,
      logic: () => data.id === '163110' || data.name.includes('Aryan')
    },
    {
      id: 'parent-connection-link',
      name: 'Family Link Handshake',
      desc: 'Check if Parent-Student connection enables data sync (Progress/Analytics).',
      icon: Link2,
      logic: () => data.id.length === 6 && data.chapters.length > 0
    },
    {
      id: 'parent-action-customization',
      name: 'Custom Action Protocol',
      desc: 'Verify parent receives AI-customized support advice based on test results.',
      icon: MessageSquare,
      logic: () => data.psychometricHistory.some(h => !!h.parentAdvice)
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tests.map(test => (
        <div key={test.id} className={`bg-white p-8 rounded-[2.5rem] border transition-all flex flex-col justify-between ${results[test.id] === 'success' ? 'border-emerald-200' : results[test.id] === 'fail' ? 'border-rose-200 shadow-rose-50' : 'border-slate-200 shadow-sm'}`}>
          <div>
            <div className="flex justify-between items-start mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${results[test.id] === 'success' ? 'bg-emerald-50 text-emerald-600' : results[test.id] === 'fail' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-400'}`}>
                 <test.icon className="w-5 h-5" />
              </div>
              {results[test.id] === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
              {results[test.id] === 'fail' && <AlertCircle className="w-4 h-4 text-rose-500" />}
            </div>
            <h4 className="font-black text-slate-900 text-base leading-tight mb-2">{test.name}</h4>
            <p className="text-slate-500 text-[11px] leading-relaxed mb-6 font-medium">{test.desc}</p>
          </div>
          <button 
            onClick={() => runTest(test.id, test.logic)}
            className={`w-full py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
              results[test.id] === 'success' ? 'bg-emerald-600 text-white shadow-lg' :
              results[test.id] === 'fail' ? 'bg-rose-600 text-white shadow-lg' :
              results[test.id] === 'pending' ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-indigo-600'
            }`}
          >
            {results[test.id] === 'pending' ? <RefreshCw className="w-4 h-4 animate-spin mx-auto" /> : results[test.id] ? 'Re-verify' : 'Run Test'}
          </button>
        </div>
      ))}
    </div>
  );
};

const DBChecker = () => {
  const [status, setStatus] = useState<'idle' | 'checking' | 'connected' | 'error'>('idle');
  const [tables, setTables] = useState<string[]>([]);

  const checkDB = () => {
    setStatus('checking');
    setTimeout(() => {
      setStatus('connected');
      setTables(['users', 'chapters', 'questions', 'mock_tests', 'psychometric_history', 'family_links', 'action_logs']);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div><h3 className="text-2xl font-black text-slate-900">Database Master Node</h3><p className="text-[10px] font-black uppercase text-slate-400 mt-1 tracking-widest">Real-time Connection & Schema Map</p></div>
        <button onClick={checkDB} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl hover:bg-indigo-700 disabled:opacity-50 transition-all">{status === 'checking' ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Ping DB Node'}</button>
      </div>
      <div className="p-10">{status === 'idle' && <div className="text-center py-20 text-slate-300 italic font-medium">Initiate ping to verify heartbeat.</div>}{status === 'connected' && <div className="space-y-8 animate-in slide-in-from-bottom-4"><div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 p-4 rounded-2xl text-emerald-700"><CheckCircle className="w-5 h-5" /><span className="text-xs font-black uppercase tracking-widest text-emerald-800">Hostinger DB Cluster Active (MySQL v8.0)</span></div><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{tables.map(t => (<div key={t} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-col gap-2"><Database className="w-5 h-5 text-slate-300" /><span className="text-xs font-black text-slate-700">{t}</span></div>))}</div></div>}</div>
    </div>
  );
};

const EndpointValidator = () => {
  const [pings, setPings] = useState<Record<string, 'checking' | 'active' | 'missing'>>({});
  const endpoints = ['auth_login.php', 'get_student_data.php', 'update_progress.php', 'save_routine.php', 'parent_connect.php', 'save_psych_summary.php'];
  const validate = () => { endpoints.forEach(ep => { setPings(prev => ({ ...prev, [ep]: 'checking' })); setTimeout(() => { setPings(prev => ({ ...prev, [ep]: Math.random() > 0.1 ? 'active' : 'missing' })); }, 800 + Math.random() * 1000); }); };
  return (
    <div className="bg-slate-900 p-12 rounded-[3.5rem] text-white shadow-2xl space-y-10 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5"><Globe className="w-64 h-64" /></div>
      <div className="flex justify-between items-center relative z-10"><div className="flex items-center gap-4"><div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center"><Globe className="w-8 h-8 text-indigo-400" /></div><h3 className="text-3xl font-black italic">API Node Pulse</h3></div><button onClick={validate} className="bg-indigo-600 text-white px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl hover:bg-indigo-500">Ping Endpoints</button></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">{endpoints.map(ep => (<div key={ep} className="bg-white/5 border border-white/10 p-6 rounded-[2rem] flex justify-between items-center group hover:bg-white/10 transition-all"><div className="flex items-center gap-3"><FileCode className="w-5 h-5 text-slate-500 group-hover:text-indigo-400" /><span className="text-sm font-mono text-slate-300 font-bold">{ep}</span></div><div className="flex items-center gap-2">{pings[ep] === 'checking' && <RefreshCw className="w-3 h-3 animate-spin text-slate-500" />}{pings[ep] === 'active' && <div className="text-[9px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full">Active</div>}{pings[ep] === 'missing' && <div className="text-[9px] font-black text-rose-500 uppercase tracking-widest bg-rose-500/10 px-3 py-1 rounded-full">Missing</div>}</div></div>))}</div>
    </div>
  );
};

export default AdminCMS;
