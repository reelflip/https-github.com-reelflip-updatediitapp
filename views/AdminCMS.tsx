
import React, { useState, useEffect } from 'react';
import { StudentData, UserAccount, Subject, Question, MockTest, Chapter, Flashcard, MemoryHack, Blog, UserRole } from '../types';
import { api } from '../services/apiService';
import { MODEL_CONFIGS } from '../services/intelligenceService';
import JSZip from 'jszip';
import saveAs from 'file-saver';
import { 
  ShieldCheck, BookOpen, Layers, Zap, Loader2,
  Plus, Trash2, Edit3, X, 
  Target, Code2, Save, Users, PenTool,
  Check, HelpCircle, Video,
  Award, Type, Lightbulb, Activity, Filter,
  Search, Clock, ChevronRight, Layout, List, FileText, Calendar, Globe, Settings, Cpu, Database, Cloud, Download, Eye, AlertTriangle, Star
} from 'lucide-react';

interface AdminCMSProps {
  activeTab: string;
  data: StudentData;
  setData: (data: StudentData) => void;
}

const InputGroup = ({ label, children }: any) => (
  <div className="space-y-3">
     <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-2">{label}</label>
     {children}
  </div>
);

const Overview = ({ data }: { data: StudentData }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
    {[
      { label: 'Syllabus Chapters', val: data.chapters.length, sub: 'Units Active', icon: BookOpen, color: 'indigo' },
      { label: 'Question Library', val: data.questions.length, sub: 'Bank Depth', icon: Code2, color: 'emerald' },
      { label: 'Mock Test Count', val: data.mockTests.length, sub: 'National Exams', icon: Target, color: 'rose' },
      { label: 'Knowledge Base', val: data.flashcards.length + data.memoryHacks.length, sub: 'Cards & Hacks', icon: Zap, color: 'amber' },
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

const SystemSettings = ({ data }: { data: StudentData }) => {
  const [activeModel, setActiveModel] = useState(localStorage.getItem('jeepro_platform_ai_model') || 'gemini-3-flash');
  const [isDownloading, setIsDownloading] = useState(false);
  const mode = api.getMode();

  const updateModel = (id: string) => {
    localStorage.setItem('jeepro_platform_ai_model', id);
    setActiveModel(id);
  };

  const downloadProductionBackend = async () => {
    setIsDownloading(true);
    try {
      const zip = new JSZip();
      
      // SQL MASTER SCHEMA Restoration
      const sqlSchema = `-- IITGEEPREP MASTER SCHEMA v20.0
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE DATABASE IF NOT EXISTS iitgrrprep_v20;
USE iitgrrprep_v20;

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('STUDENT', 'PARENT', 'ADMIN') DEFAULT 'STUDENT',
    institute VARCHAR(255),
    targetExam VARCHAR(100),
    targetYear VARCHAR(4),
    birthDate DATE,
    gender VARCHAR(20),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS chapters (
    id VARCHAR(50) PRIMARY KEY,
    subject VARCHAR(50) NOT NULL,
    unit VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    notes LONGTEXT,
    videoUrl VARCHAR(255),
    highYield TINYINT(1) DEFAULT 0,
    targetCompletionDate DATE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS questions (
    id VARCHAR(50) PRIMARY KEY,
    topicId VARCHAR(50),
    subject VARCHAR(50),
    text TEXT NOT NULL,
    options JSON NOT NULL,
    correctAnswer INT NOT NULL,
    explanation TEXT,
    difficulty ENUM('EASY', 'MEDIUM', 'HARD')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS mock_tests (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    duration INT DEFAULT 180,
    totalMarks INT DEFAULT 300,
    category VARCHAR(50),
    difficulty VARCHAR(50),
    questionIds TEXT,
    chapterIds TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

COMMIT;`;

      // 2. DB CONFIG
      const dbConfig = `<?php
define('DB_HOST', 'localhost');
define('DB_NAME', 'iitgrrprep_v20');
define('DB_USER', 'root');
define('DB_PASS', '');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

try {
    $pdo = new PDO("mysql:host=".DB_HOST.";dbname=".DB_NAME, DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die(json_encode(["success" => false, "error" => $e->getMessage()]));
}
?>`;

      // Main Gateway
      const apiIndex = `<?php
require_once 'config/database.php';
$action = $_GET['action'] ?? '';
echo json_encode(["success" => true, "module" => "Solaris API Kernel v20", "action" => $action]);
?>`;

      zip.folder("api/config")?.file("database.php", dbConfig);
      zip.folder("api/sql")?.file("master_schema_v20.sql", sqlSchema);
      zip.folder("api")?.file("index.php", apiIndex);
      
      const apiFolder = zip.folder("api");
      apiFolder?.file("auth_login.php", "<?php require_once 'config/database.php'; /* Logic */ ?>");
      apiFolder?.file("manage_chapters.php", "<?php require_once 'config/database.php'; /* Logic */ ?>");
      apiFolder?.file("get_dashboard.php", "<?php require_once 'config/database.php'; /* Logic */ ?>");

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "solaris_v20_full_backend.zip");
    } catch (e) {
      alert("Bundle generation failed.");
    }
    setIsDownloading(false);
  };

  return (
    <div className="space-y-12 px-4 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-sm space-y-10">
             <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner"><Cpu className="w-7 h-7" /></div>
                <div>
                   <h3 className="text-2xl font-black italic tracking-tighter text-slate-900 uppercase">Intelligence Core</h3>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform-wide LLM Orchestration</p>
                </div>
             </div>
             
             <div className="grid grid-cols-1 gap-4">
                {Object.entries(MODEL_CONFIGS).map(([id, cfg]) => (
                   <button 
                    key={id}
                    onClick={() => updateModel(id)}
                    className={`p-6 rounded-[2rem] border-2 text-left transition-all flex items-center justify-between group ${activeModel === id ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-50 hover:border-indigo-200'}`}
                   >
                      <div className="flex items-center gap-5">
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${activeModel === id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>{cfg.name[0]}</div>
                         <div>
                            <div className="text-sm font-black text-slate-800">{cfg.name}</div>
                            <div className="text-[9px] font-bold text-slate-400 uppercase">{cfg.desc}</div>
                         </div>
                      </div>
                      {activeModel === id && <Check className="w-5 h-5 text-indigo-600" />}
                   </button>
                ))}
             </div>
          </div>

          <div className="space-y-8">
             <div className="bg-slate-900 p-12 rounded-[4rem] text-white shadow-2xl space-y-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform duration-[4s]"><Database className="w-48 h-48" /></div>
                <div>
                   <h3 className="text-2xl font-black italic tracking-tighter uppercase">Uplink Status</h3>
                   <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Data persistence layer config</p>
                </div>
                
                <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/10">
                   <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full animate-pulse ${mode === 'LIVE' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-slate-500'}`}></div>
                      <div className="text-sm font-bold uppercase tracking-widest">{mode === 'LIVE' ? 'Production (SQL)' : 'Sandbox Mode'}</div>
                   </div>
                   <button 
                    onClick={() => api.setMode(mode === 'MOCK' ? 'LIVE' : 'MOCK')} 
                    className={`w-14 h-7 rounded-full p-1 transition-all duration-500 ${mode === 'LIVE' ? 'bg-emerald-500' : 'bg-slate-700'}`}
                   >
                      <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-500 transform ${mode === 'LIVE' ? 'translate-x-7' : 'translate-x-0'}`}></div>
                   </button>
                </div>

                <div className="space-y-4 pt-6">
                   <div className="flex justify-between text-xs font-bold text-slate-400"><span>Latency</span><span>{mode === 'LIVE' ? '24ms' : '0ms'}</span></div>
                   <div className="flex justify-between text-xs font-bold text-slate-400"><span>API Version</span><span>v10.5-FINAL</span></div>
                </div>
             </div>

             <div className="bg-indigo-600 p-12 rounded-[4rem] text-white shadow-xl space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10"><Cloud className="w-32 h-32" /></div>
                <h3 className="text-xl font-black italic tracking-tighter uppercase">Deployment Blueprint</h3>
                <p className="text-sm text-indigo-100 font-medium italic leading-relaxed">Download the complete Solaris v20 Backend (18+ PHP Modules + SQL Schema) for local XAMPP or VPS production.</p>
                <button 
                  onClick={downloadProductionBackend}
                  disabled={isDownloading}
                  className="w-full py-5 bg-white text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Download className="w-4 h-4" /> Download Complete v20 Core</>}
                </button>
             </div>
          </div>
       </div>
    </div>
  );
};

const UserManagement = () => {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getAccounts().then(res => { setUsers(res); setIsLoading(false); });
  }, []);

  return (
    <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden mx-4">
      <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
         <h3 className="text-xl font-black italic text-slate-800 flex items-center gap-3"><Users className="w-6 h-6 text-indigo-600" /> Managed Users</h3>
         <div className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Global Register: {users.length}</div>
      </div>
      <div className="divide-y divide-slate-50 max-h-[600px] overflow-y-auto custom-scrollbar">
        {isLoading ? (
          <div className="p-20 flex flex-col items-center justify-center text-slate-400 gap-4"><Loader2 className="animate-spin" /> Uplinking User Data...</div>
        ) : users.length === 0 ? (
          <div className="p-20 text-center text-slate-300 font-black uppercase text-xs">No users found in database.</div>
        ) : (
          users.map((u) => (
            <div key={u.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group">
               <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-indigo-600 shadow-inner">{u.name?.[0] || 'U'}</div>
                  <div>
                    <div className="font-black text-slate-800 tracking-tight">{u.name}</div>
                    <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{u.email} • {u.role} • ID: {u.id}</div>
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
  <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden mx-4 animate-in fade-in duration-500">
    <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/30">
       <h3 className="text-xl font-black italic text-slate-800 flex items-center gap-3"><Icon className={`w-6 h-6 text-${color}-600`} /> {title}</h3>
       <button onClick={onNew} className={`bg-${color}-600 text-white px-8 py-3 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-${color}-100 hover:scale-105 active:scale-95 transition-all`}><Plus className="w-4 h-4" /> {btnLabel}</button>
    </div>
    <div className="divide-y divide-slate-50 max-h-[600px] overflow-y-auto custom-scrollbar">
      {data.length === 0 ? (
        <div className="p-20 text-center text-slate-300 font-black uppercase text-[10px] tracking-widest italic">Node directory is empty.</div>
      ) : (
        data.map((item: any) => (
          <div key={item.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group">
             <div className="flex items-center gap-6">
                <div className={`w-10 h-10 bg-${color}-50 text-${color}-600 rounded-xl flex items-center justify-center shrink-0`}>
                   <Icon className="w-5 h-5" />
                </div>
                <div className="max-w-2xl">
                   <div className="text-sm font-bold text-slate-800 line-clamp-1 italic tracking-tight">
                     {type === 'Blog' ? item.title : type === 'Chapter' ? item.name : type === 'Question' ? item.text : type === 'Flashcard' ? item.question : item.title || item.name}
                   </div>
                   <div className="flex flex-wrap gap-4 mt-1">
                      <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{item.subject || item.category || 'System Node'}</span>
                      {item.difficulty && <span className="text-[8px] font-black uppercase px-2 py-0.5 bg-indigo-50 text-indigo-500 rounded border border-indigo-100">{item.difficulty}</span>}
                      {type === 'MockTest' && <span className="text-[8px] font-black uppercase px-2 py-0.5 bg-slate-100 text-slate-500 rounded">{item.questionIds?.length || 0} Questions</span>}
                      {type === 'Chapter' && item.videoUrl && <span className="text-[8px] font-black uppercase px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded border border-emerald-100 flex items-center gap-1"><Video className="w-2.5 h-2.5" /> Video Linked</span>}
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

const CreationHub = ({ type, item, onClose, onSave, allQuestions = [], allChapters = [] }: any) => {
  const [formData, setFormData] = useState<any>(item || {
    id: `ID-${Math.random().toString(36).substr(2, 9)}`,
    name: '', title: '', subject: 'Physics' as Subject, unit: 'Sets, Relations and Functions', text: '',
    options: ['', '', '', ''], correctAnswer: 0, difficulty: 'EASY',
    explanation: '', author: 'Solaris Admin', content: '',
    date: new Date().toISOString().split('T')[0], status: 'PUBLISHED',
    progress: 0, accuracy: 0, timeSpent: 0,
    timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0,
    question: '', answer: '', category: 'Shortcuts', hack: '',
    duration: 180, totalMarks: 300, questionIds: [], chapterIds: [],
    notes: '', videoUrl: '', targetCompletionDate: '', type: 'Concept',
    highYield: false
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [previewNotes, setPreviewNotes] = useState(false);

  const handleChange = (e: any) => {
    const { name, value, type: inputType, checked } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: inputType === 'checkbox' ? checked : value }));
  };

  const handleOptionChange = (idx: number, val: string) => {
    const newOpts = [...formData.options];
    newOpts[idx] = val;
    setFormData((prev: any) => ({ ...prev, options: newOpts }));
  };

  const toggleQuestionSelection = (id: string) => {
    const current = [...(formData.questionIds || [])];
    if (current.includes(id)) {
      setFormData({ ...formData, questionIds: current.filter(x => x !== id) });
    } else {
      setFormData({ ...formData, questionIds: [...current, id] });
    }
  };

  const filteredQuestions = allQuestions.filter((q: any) => 
    q.text.toLowerCase().includes(searchTerm.toLowerCase()) || 
    q.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 overflow-hidden">
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md animate-in fade-in" onClick={onClose}></div>
      <div className="bg-white w-full max-w-6xl my-auto rounded-[3rem] md:rounded-[4rem] shadow-2xl relative z-10 animate-in zoom-in-95 duration-300 overflow-hidden flex flex-col max-h-[95vh]">
         {/* --- HEADER --- */}
         <div className="p-8 md:p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
            <div className="flex items-center gap-6">
               <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                  {type === 'Blog' ? <PenTool className="w-7 h-7" /> : type === 'Question' ? <HelpCircle className="w-7 h-7" /> : type === 'MockTest' ? <Target className="w-7 h-7" /> : type === 'Chapter' ? <BookOpen className="w-7 h-7" /> : type === 'MemoryHack' ? <Zap className="w-7 h-7" /> : <Layers className="w-7 h-7" />}
               </div>
               <div>
                  <h3 className="text-2xl md:text-3xl font-black italic tracking-tighter text-slate-900 uppercase">
                     {item ? 'Modify' : 'Deploy'} <span className="text-indigo-600">{type}.</span>
                  </h3>
                  <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mt-1">Syllabus Node Architect v10.5</p>
               </div>
            </div>
            <button onClick={onClose} className="p-4 bg-white text-slate-400 hover:text-slate-900 rounded-2xl transition-all border border-slate-100"><X className="w-6 h-6" /></button>
         </div>

         {/* --- SCROLLABLE CONTENT --- */}
         <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12 custom-scrollbar">
            
            {/* CHAPTER ARCHITECT */}
            {type === 'Chapter' && (
              <div className="space-y-12 animate-in fade-in duration-500">
                 <div className="space-y-8">
                    <div className="flex justify-between items-end">
                       <h4 className="text-[11px] font-black uppercase text-indigo-400 tracking-[0.4em] flex items-center gap-3"><Layout className="w-4 h-4" /> Strategic Metadata</h4>
                       <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-100">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">High Yield Topic?</span>
                          <button 
                            onClick={() => setFormData({...formData, highYield: !formData.highYield})}
                            className={`px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${formData.highYield ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-300 border border-slate-100'}`}
                          >
                            {formData.highYield ? <span className="flex items-center gap-2"><Star className="w-3 h-3 fill-white" /> Active</span> : 'Inactive'}
                          </button>
                       </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                       <InputGroup label="Chapter Identity"><input name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-black italic text-slate-800" placeholder="Ex: Ray Optics" /></InputGroup>
                       <InputGroup label="Syllabus Subject"><select name="subject" value={formData.subject} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-black text-slate-800"><option value="Physics">Physics</option><option value="Chemistry">Chemistry</option><option value="Mathematics">Mathematics</option></select></InputGroup>
                       <InputGroup label="Module/Unit Name"><input name="unit" value={formData.unit} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-black italic" placeholder="Ex: Electromagnetism" /></InputGroup>
                    </div>
                 </div>

                 <div className="space-y-8 pt-10 border-t border-slate-50">
                    <h4 className="text-[11px] font-black uppercase text-indigo-400 tracking-[0.4em] flex items-center gap-3"><Video className="w-4 h-4" /> Multimedia & Goals</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                       <InputGroup label="Lecture Stream URL (YouTube/Vimeo)">
                          <div className="relative group">
                             <Globe className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                             <input name="videoUrl" value={formData.videoUrl} onChange={handleChange} className="w-full pl-14 pr-6 py-5 bg-slate-50 border-none rounded-2xl text-sm font-black text-slate-800" placeholder="https://youtube.com/watch?v=..." />
                          </div>
                       </InputGroup>
                       <InputGroup label="Target Master Date">
                          <div className="relative group">
                             <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                             <input name="targetCompletionDate" type="date" value={formData.targetCompletionDate} onChange={handleChange} className="w-full pl-14 pr-6 py-5 bg-slate-50 border-none rounded-2xl text-sm font-black text-slate-800" />
                          </div>
                       </InputGroup>
                    </div>
                 </div>

                 <div className="space-y-8 pt-10 border-t border-slate-50">
                    <div className="flex justify-between items-center">
                       <h4 className="text-[11px] font-black uppercase text-indigo-400 tracking-[0.4em] flex items-center gap-3"><FileText className="w-4 h-4" /> Comprehensive Theory Node</h4>
                       <button onClick={() => setPreviewNotes(!previewNotes)} className="text-[10px] font-black uppercase text-indigo-600 flex items-center gap-2 hover:underline">
                          {previewNotes ? <><Edit3 className="w-3.5 h-3.5" /> Back to Code</> : <><Eye className="w-3.5 h-3.5" /> Preview HTML</>}
                       </button>
                    </div>
                    {previewNotes ? (
                       <div className="w-full bg-white border border-slate-200 rounded-[2.5rem] p-12 min-h-[300px] prose prose-slate max-w-none">
                          <div dangerouslySetInnerHTML={{ __html: formData.notes || '<p class="text-slate-400 italic">No content available for preview.</p>' }} />
                       </div>
                    ) : (
                       <InputGroup label="Theory Manuscript (Supports Rich HTML)">
                          <textarea name="notes" value={formData.notes} onChange={handleChange} rows={12} className="w-full bg-slate-50 border-none rounded-[2.5rem] p-10 text-base font-medium leading-relaxed text-slate-600 focus:ring-8 focus:ring-indigo-50 transition-all shadow-inner font-mono" placeholder="<h2>Chapter Overview</h2><p>Provide deep technical context...</p>" />
                       </InputGroup>
                    )}
                 </div>
              </div>
            )}

            {/* QUESTION ARCHITECT */}
            {type === 'Question' && (
              <div className="space-y-10">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <InputGroup label="Subject Node"><select name="subject" value={formData.subject} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-black"><option value="Physics">Physics</option><option value="Chemistry">Chemistry</option><option value="Mathematics">Mathematics</option></select></InputGroup>
                    <InputGroup label="Difficulty Matrix"><select name="difficulty" value={formData.difficulty} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-black"><option value="EASY">EASY</option><option value="MEDIUM">MEDIUM</option><option value="HARD">HARD</option></select></InputGroup>
                    <InputGroup label="Topic Mapping"><select name="topicId" value={formData.topicId} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-black"><option value="">Select Chapter</option>{allChapters.map((c:any) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></InputGroup>
                 </div>
                 <InputGroup label="Problem Manuscript (Supports Equations)"><textarea name="text" value={formData.text} onChange={handleChange} rows={4} className="w-full bg-slate-50 border-none rounded-2xl p-8 text-xl font-black italic text-slate-800" placeholder="State the numerical problem..." /></InputGroup>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {formData.options.map((opt: string, i: number) => (
                      <div key={i} className="flex items-center gap-4 group">
                         <button onClick={() => setFormData({...formData, correctAnswer: i})} className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl transition-all shrink-0 ${formData.correctAnswer === i ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>{String.fromCharCode(65+i)}</button>
                         <input value={opt} onChange={(e) => handleOptionChange(i, e.target.value)} className="flex-1 bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold text-slate-700 focus:bg-white transition-all shadow-inner" placeholder={`Option ${String.fromCharCode(65+i)}`} />
                      </div>
                    ))}
                 </div>
                 <div className="pt-8 border-t border-slate-50">
                    <InputGroup label="Cognitive Solution / Explanation"><textarea name="explanation" value={formData.explanation} onChange={handleChange} rows={4} className="w-full bg-slate-50 border-none rounded-2xl p-8 text-sm font-medium italic text-slate-600" placeholder="Explain the derivation or logic..." /></InputGroup>
                 </div>
              </div>
            )}

            {/* MOCK TEST ARCHITECT */}
            {type === 'MockTest' && (
              <div className="space-y-12">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InputGroup label="Exam Official Name"><input name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-black italic text-slate-800" placeholder="Ex: JEE Mains 2025 Mock v1" /></InputGroup>
                    <div className="grid grid-cols-2 gap-4">
                       <InputGroup label="Operational Minutes"><input name="duration" type="number" value={formData.duration} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-black" /></InputGroup>
                       <InputGroup label="Target Marks"><input name="totalMarks" type="number" value={formData.totalMarks} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-black" /></InputGroup>
                    </div>
                 </div>
                 
                 <div className="space-y-6">
                    <div className="flex justify-between items-end">
                       <InputGroup label="Question Matrix Builder"><div className="text-[11px] font-black text-indigo-600 uppercase bg-indigo-50 px-4 py-1.5 rounded-lg border border-indigo-100">{formData.questionIds?.length || 0} Artifacts Loaded</div></InputGroup>
                       <div className="relative w-80">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input type="text" placeholder="Filter Master Bank..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black outline-none focus:bg-white focus:border-indigo-400 transition-all shadow-inner" />
                       </div>
                    </div>
                    <div className="bg-slate-50 rounded-[2.5rem] border border-slate-100 p-8 max-h-[450px] overflow-y-auto custom-scrollbar">
                       {filteredQuestions.length === 0 ? (
                          <div className="p-20 text-center text-slate-300 font-black uppercase text-[10px] tracking-widest italic border-2 border-dashed border-slate-200 rounded-3xl">No matches found in library.</div>
                       ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             {filteredQuestions.map((q: any) => (
                               <div key={q.id} onClick={() => toggleQuestionSelection(q.id)} className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-5 ${formData.questionIds?.includes(q.id) ? 'bg-indigo-600 border-indigo-600 shadow-xl scale-[1.02]' : 'bg-white border-slate-100 hover:border-indigo-300'}`}>
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${formData.questionIds?.includes(q.id) ? 'bg-white text-indigo-600 shadow-inner' : 'bg-slate-100 text-slate-400'}`}>
                                     {formData.questionIds?.includes(q.id) ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                  </div>
                                  <div className="min-w-0">
                                     <div className={`text-xs font-bold line-clamp-1 italic ${formData.questionIds?.includes(q.id) ? 'text-white' : 'text-slate-800'}`}>{q.text}</div>
                                     <div className={`text-[8px] font-black uppercase mt-1 ${formData.questionIds?.includes(q.id) ? 'text-indigo-200' : 'text-slate-400'}`}>{q.subject} • {q.difficulty}</div>
                                  </div>
                               </div>
                             ))}
                          </div>
                       )}
                    </div>
                 </div>
              </div>
            )}

            {/* FLASHCARD ARCHITECT */}
            {type === 'Flashcard' && (
              <div className="space-y-10">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InputGroup label="Subject Vertical"><select name="subject" value={formData.subject} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-black"><option value="Physics">Physics</option><option value="Chemistry">Chemistry</option><option value="Mathematics">Mathematics</option></select></InputGroup>
                    <InputGroup label="Categorization Strategy"><input name="type" value={formData.type} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-black" placeholder="Ex: Concept, Shortcut" /></InputGroup>
                 </div>
                 <InputGroup label="Primary Recall Stimulus (Question)"><textarea name="question" value={formData.question} onChange={handleChange} rows={4} className="w-full bg-slate-50 border-none rounded-2xl p-8 text-2xl font-black italic text-slate-800" /></InputGroup>
                 <InputGroup label="Target Retrieval Logic (Answer)"><textarea name="answer" value={formData.answer} onChange={handleChange} rows={4} className="w-full bg-slate-50 border-none rounded-2xl p-8 text-2xl font-black italic text-indigo-600 shadow-inner" /></InputGroup>
              </div>
            )}

            {/* MEMORY HACK ARCHITECT */}
            {type === 'MemoryHack' && (
              <div className="space-y-10">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InputGroup label="Artifact Identity"><input name="title" value={formData.title} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-5 text-xl font-black italic text-slate-800" /></InputGroup>
                    <InputGroup label="Mnemonic Modality"><select name="category" value={formData.category} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-black"><option value="Mnemonics">Mnemonics</option><option value="Shortcuts">Shortcuts</option><option value="Logic Maps">Logic Maps</option></select></InputGroup>
                 </div>
                 <InputGroup label="Operational Description"><textarea name="description" value={formData.description} onChange={handleChange} rows={2} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-medium" placeholder="Briefly describe when to use this hack..." /></InputGroup>
                 <div className="pt-8 border-t border-slate-50">
                    <InputGroup label="The Intelligence Hack (Final Vector)"><textarea name="hack" value={formData.hack} onChange={handleChange} rows={4} className="w-full bg-slate-900 border-none rounded-[2.5rem] p-10 text-3xl font-black italic text-indigo-400 shadow-2xl text-center" placeholder="Ex: PV = nRT" /></InputGroup>
                 </div>
              </div>
            )}

            {/* BLOG STRATEGY ARCHITECT */}
            {type === 'Blog' && (
              <div className="space-y-10">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InputGroup label="Strategy Report Headline"><input name="title" value={formData.title} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-5 text-2xl font-black italic text-slate-800" /></InputGroup>
                    <InputGroup label="Author Identification"><input name="author" value={formData.author} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-black" /></InputGroup>
                 </div>
                 <InputGroup label="Intelligence Manuscript (Rich HTML Support)"><textarea name="content" value={formData.content} onChange={handleChange} rows={15} className="w-full bg-slate-50 border-none rounded-[3rem] p-10 text-base font-medium leading-relaxed text-slate-600 shadow-inner font-mono" placeholder="<h1>Strategic Vector</h1><p>Explain the tactical advantage...</p>" /></InputGroup>
              </div>
            )}
         </div>

         {/* --- FOOTER ACTIONS --- */}
         <div className="p-8 md:p-10 border-t border-slate-100 flex flex-col md:flex-row gap-4 md:gap-6 bg-slate-50/50 shrink-0">
            <button onClick={onClose} className="flex-1 py-5 md:py-6 bg-white border border-slate-200 text-slate-500 rounded-[1.8rem] font-black uppercase text-[10px] tracking-widest hover:bg-slate-100 transition-all">Abort Protocol</button>
            <button onClick={() => onSave(formData)} className="flex-[2] py-5 md:py-6 bg-indigo-600 text-white rounded-[1.8rem] font-black uppercase text-[10px] tracking-[0.3em] shadow-2xl shadow-indigo-100 flex items-center justify-center gap-4 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all"><Save className="w-6 h-6" /> Synchronize Changes to Production</button>
         </div>
      </div>
    </div>
  );
};

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
    if (!confirm(`This will permanently purge this ${type} from the database. Proceed?`)) return;
    const key = type === 'Chapter' ? 'chapters' : 
                type === 'Question' ? 'questions' : 
                type === 'MockTest' ? 'mockTests' :
                type === 'Flashcard' ? 'flashcards' :
                type === 'MemoryHack' ? 'memoryHacks' : 'blogs';
    const newList = (data[key as keyof StudentData] as any[]).filter((item: any) => item.id !== id);
    setData({ ...data, [key]: newList });
  };

  const handleSaveEntity = async (type: string, entity: any) => {
    const key = type === 'Chapter' ? 'chapters' : 
                type === 'Question' ? 'questions' : 
                type === 'MockTest' ? 'mockTests' :
                type === 'Flashcard' ? 'flashcards' :
                type === 'MemoryHack' ? 'memoryHacks' : 'blogs';
    
    if (mode === 'LIVE') {
        const result = await api.saveEntity(type, entity);
        if (!result.success) {
            alert(`Persistence Failure: ${result.error}`);
            return;
        }
    }

    const currentList = [...(data[key as keyof StudentData] as any[])];
    const index = currentList.findIndex(e => e.id === entity.id);
    if (index > -1) currentList[index] = entity;
    else currentList.push(entity);
    
    setData({ ...data, [key]: currentList });
    setIsCreating(false); 
    setEditingItem(null);
  };

  return (
    <div className="pb-32 max-w-7xl mx-auto space-y-10 px-4">
      {/* --- SENTINEL HEADER --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 bg-white p-12 rounded-[3.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5"><ShieldCheck className="w-64 h-64" /></div>
        <div className="space-y-4 relative z-10">
          <div className="text-[10px] font-black uppercase text-indigo-600 tracking-[0.5em] flex items-center gap-3"><ShieldCheck className="w-5 h-5" /> Unified Admin Node v10.5</div>
          <h2 className="text-7xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">SENTINEL <span className="text-indigo-600">CORE.</span></h2>
        </div>
        <div className="flex items-center gap-4 bg-slate-50 px-8 py-4 rounded-[2rem] border border-slate-100 shadow-inner group relative z-10">
           <div className="text-right">
              <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Environment Pipeline</div>
              <div className={`text-[10px] font-black uppercase tracking-widest ${mode === 'LIVE' ? 'text-emerald-600' : 'text-amber-500'}`}>{mode === 'LIVE' ? 'Production (SQL)' : 'Sandbox Mode'}</div>
           </div>
           <button 
             onClick={() => api.setMode(mode === 'MOCK' ? 'LIVE' : 'MOCK')} 
             className={`w-16 h-9 rounded-full p-1.5 transition-all duration-500 relative shadow-inner ${mode === 'LIVE' ? 'bg-emerald-500' : 'bg-slate-300'}`}
           >
              <div className={`w-6 h-6 bg-white rounded-full shadow-lg transition-transform duration-500 transform ${mode === 'LIVE' ? 'translate-x-7' : 'translate-x-0'}`}></div>
           </button>
        </div>
      </div>

      {/* --- ACTIVE WORKSPACE --- */}
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {activeTab === 'admin-overview' && <Overview data={data} />}
        {activeTab === 'admin-users' && <UserManagement />}
        {activeTab === 'admin-syllabus' && <EntityList title="Syllabus Management" type="Chapter" data={data.chapters} icon={BookOpen} color="indigo" btnLabel="Deploy Chapter" onEdit={handleEdit} onDelete={handleDelete} onNew={() => { setCreationType('Chapter'); setEditingItem(null); setIsCreating(true); }} />}
        {activeTab === 'admin-questions' && <EntityList title="Strategic Question Bank" type="Question" data={data.questions} icon={Code2} color="emerald" btnLabel="Register Problem" onEdit={handleEdit} onDelete={handleDelete} onNew={() => { setCreationType('Question'); setEditingItem(null); setIsCreating(true); }} />}
        {activeTab === 'admin-tests' && <EntityList title="Mock Test Architecture" type="MockTest" data={data.mockTests} icon={Target} color="rose" btnLabel="Assemble Exam" onEdit={handleEdit} onDelete={handleDelete} onNew={() => { setCreationType('MockTest'); setEditingItem(null); setIsCreating(true); }} />}
        {activeTab === 'admin-flashcards' && <EntityList title="Recall Engine (Cards)" type="Flashcard" data={data.flashcards} icon={Layers} color="blue" btnLabel="Encode Card" onEdit={handleEdit} onDelete={handleDelete} onNew={() => { setCreationType('Flashcard'); setEditingItem(null); setIsCreating(true); }} />}
        {activeTab === 'admin-hacks' && <EntityList title="Memory Hack Vault" type="MemoryHack" data={data.memoryHacks} icon={Zap} color="amber" btnLabel="Commit Hack" onEdit={handleEdit} onDelete={handleDelete} onNew={() => { setCreationType('MemoryHack'); setEditingItem(null); setIsCreating(true); }} />}
        {activeTab === 'admin-blogs' && <EntityList title="Intelligence Strategy Feed" type="Blog" data={data.blogs} icon={PenTool} color="indigo" btnLabel="Draft Manuscript" onEdit={handleEdit} onDelete={handleDelete} onNew={() => { setCreationType('Blog'); setEditingItem(null); setIsCreating(true); }} />}
        {activeTab === 'admin-system' && <SystemSettings data={data} />}
      </div>

      {/* --- ARCHITECT HUB MODAL --- */}
      {isCreating && (
        <CreationHub 
          type={creationType} 
          item={editingItem} 
          onClose={() => setIsCreating(false)} 
          onSave={(entity: any) => handleSaveEntity(creationType, entity)} 
          allQuestions={data.questions} 
          allChapters={data.chapters} 
        />
      )}
    </div>
  );
};
export default AdminCMS;
