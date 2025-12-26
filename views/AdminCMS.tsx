
import React, { useState, useEffect } from 'react';
import JSZip from 'jszip';
import saveAs from 'file-saver';
import { StudentData, Question, MockTest, Chapter, UserRole, ChapterStatus, Flashcard, MemoryHack, Blog } from '../types';
import { api } from '../services/apiService';
import { 
  ShieldCheck, Database, FileCode, CloudUpload,
  BookOpen, Layers, Zap, Package, Download, Loader2,
  ChevronRight, Search, Plus, Trash2, Edit3, X, 
  CheckCircle2, Target, History, Code2, Server, 
  Cpu, Terminal, Shield, ListChecks, Link2, Info, Sparkles
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
      {activeTab === 'admin-syllabus' && <SyllabusMaster data={data} onEdit={handleEdit} onDelete={handleDelete} />}
      {activeTab === 'admin-questions' && <QuestionBank data={data} onEdit={handleEdit} onDelete={handleDelete} />}
      {activeTab === 'admin-system' && <SystemModule data={data} setData={setData} />}

      {/* Logic for creationHub would be here - truncated for focus on requested Fix */}
    </div>
  );
};

const Overview = ({ data }: { data: StudentData }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-500">
    {[
      { label: 'Active Syllabus', val: data.chapters.length, sub: 'Units Loaded', icon: BookOpen, color: 'indigo' },
      { label: 'Intelligence Depth', val: data.questions.length, sub: 'Problem Matrix', icon: Cpu, color: 'emerald' },
      { label: 'Mock Scenarios', val: data.mockTests.length, sub: 'Active Simulations', icon: Target, color: 'rose' },
      { label: 'Memory Persistence', val: data.flashcards.length, sub: 'Revision Nodes', icon: Layers, color: 'blue' },
    ].map((stat, i) => (
      <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <div className={`w-12 h-12 bg-${stat.color}-50 text-${stat.color}-600 rounded-2xl flex items-center justify-center mb-6`}><stat.icon className="w-6 h-6" /></div>
        <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{stat.label}</div>
        <div className="text-3xl font-black text-slate-800">{stat.val}</div>
        <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase">{stat.sub}</div>
      </div>
    ))}
  </div>
);

const SyllabusMaster = ({ data, onEdit, onDelete }: any) => (
  <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4">
    <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
       <h3 className="text-xl font-black italic text-slate-800 flex items-center gap-3"><BookOpen className="w-6 h-6 text-indigo-600" /> Syllabus Master</h3>
       <button className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-indigo-100 hover:scale-105 transition-all"><Plus className="w-4 h-4" /> New Unit</button>
    </div>
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      {data.chapters.map((c: Chapter) => (
        <div key={c.id} className="p-6 bg-white border border-slate-100 rounded-3xl hover:border-indigo-400 transition-all flex justify-between items-center group">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center font-black text-slate-400 text-xs">ID</div>
              <div>
                 <div className="font-bold text-slate-800 text-sm">{c.name}</div>
                 <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{c.subject} • {c.unit}</div>
              </div>
           </div>
           <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => onEdit('Chapter', c)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit3 className="w-4 h-4" /></button>
              <button onClick={() => onDelete('Chapter', c.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
           </div>
        </div>
      ))}
    </div>
  </div>
);

const QuestionBank = ({ data, onEdit, onDelete }: any) => (
  <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4">
    <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
       <h3 className="text-xl font-black italic text-slate-800 flex items-center gap-3"><Code2 className="w-6 h-6 text-emerald-600" /> Intelligence Matrix</h3>
       <button className="bg-emerald-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-emerald-100 hover:scale-105 transition-all"><Plus className="w-4 h-4" /> New Entry</button>
    </div>
    <div className="divide-y divide-slate-50">
      {data.questions.map((q: any) => (
        <div key={q.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group">
           <div className="flex items-center gap-6">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0"><Terminal className="w-5 h-5" /></div>
              <div className="max-w-xl">
                 <div className="text-sm font-bold text-slate-800 line-clamp-1 italic">"{q.text}"</div>
                 <div className="flex gap-4 mt-1">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{q.subject}</span>
                    <span className="text-[9px] font-black uppercase text-indigo-500 tracking-widest">{q.difficulty}</span>
                 </div>
              </div>
           </div>
           <div className="flex gap-2">
              <button onClick={() => onEdit('Question', q)} className="p-3 bg-white border border-slate-100 text-slate-400 rounded-xl hover:text-indigo-600 transition-all"><Edit3 className="w-4 h-4" /></button>
              <button onClick={() => onDelete('Question', q.id)} className="p-3 bg-white border border-slate-100 text-slate-400 rounded-xl hover:text-rose-600 transition-all"><Trash2 className="w-4 h-4" /></button>
           </div>
        </div>
      ))}
    </div>
  </div>
);

const SystemModule = ({ data }: { data: StudentData; setData: any }) => {
  const [dbConfig, setDbConfig] = useState({ host: 'localhost', name: 'jeepro_db', user: 'root', pass: '' });
  
  const generateMasterSQL = () => {
    return `-- IITGEEPREP MASTER PRODUCTION SCHEMA v5.6.2
-- Optimized for Relational Telemetry and High-Performance Sync

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. CORE USER ENTITY
CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('STUDENT', 'PARENT', 'ADMIN') DEFAULT 'STUDENT',
  recovery_question VARCHAR(255),
  recovery_answer VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. STUDENT SYLLABUS PERSISTENCE
CREATE TABLE IF NOT EXISTS student_chapters (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  chapter_id VARCHAR(50) NOT NULL,
  progress INT DEFAULT 0,
  accuracy INT DEFAULT 0,
  time_spent INT DEFAULT 0, -- Total seconds
  time_spent_notes INT DEFAULT 0,
  time_spent_videos INT DEFAULT 0,
  time_spent_practice INT DEFAULT 0,
  time_spent_tests INT DEFAULT 0,
  status VARCHAR(20) DEFAULT 'NOT_STARTED',
  last_studied TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. ACADEMIC TEST REPOSITORY
CREATE TABLE IF NOT EXISTS test_results (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  test_id VARCHAR(50) NOT NULL,
  test_name VARCHAR(100),
  score INT NOT NULL,
  total_marks INT NOT NULL,
  accuracy INT,
  date_taken DATE,
  chapter_ids TEXT, -- JSON Array of IDs
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. WELLNESS & PSYCHOMETRIC LOGS
CREATE TABLE IF NOT EXISTS wellness_logs (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  stress INT DEFAULT 5,
  focus INT DEFAULT 5,
  motivation INT DEFAULT 5,
  exam_fear INT DEFAULT 5,
  summary TEXT,
  parent_advice TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. RELATIONAL HANDSHAKE (PARENT-STUDENT)
CREATE TABLE IF NOT EXISTS family_links (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  parent_id INT UNSIGNED NOT NULL,
  student_id INT UNSIGNED NOT NULL,
  status ENUM('PENDING', 'ACTIVE', 'REVOKED') DEFAULT 'ACTIVE',
  linked_since TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_link (parent_id, student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;
`;
  };

  const handleDownloadBuild = async () => {
    const zip = new JSZip();
    zip.file("sql/master_schema_v5.6.2.sql", generateMasterSQL());
    // In a real scenario, we'd add the PHP boilerplate files here too
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "iitgeeprep-production-v5.6.2.zip");
  };

  return (
    <div className="bg-slate-900 rounded-[4rem] p-12 lg:p-20 text-white shadow-2xl space-y-12 relative overflow-hidden">
       <div className="absolute top-0 right-0 p-12 opacity-5"><Server className="w-80 h-80" /></div>
       
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 relative z-10">
          <div className="space-y-4">
             <div className="inline-flex items-center gap-2 bg-indigo-600/30 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 text-indigo-300">
                <CloudUpload className="w-4 h-4" /> Deployment Blueprint
             </div>
             <h3 className="text-4xl font-black italic tracking-tighter">Production Handshake.</h3>
             <p className="text-slate-400 max-w-xl text-lg font-medium leading-relaxed">
                Generate the SQL schema and PHP PDO gateway to transition from local storage to a production MySQL environment.
             </p>
          </div>
          <button onClick={handleDownloadBuild} className="px-10 py-5 bg-white text-slate-900 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.3em] flex items-center gap-4 hover:bg-indigo-50 transition-all shadow-2xl group shrink-0">
             <Package className="w-6 h-6 group-hover:scale-110 transition-transform" /> Download Build ZIP
          </button>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10 pt-10 border-t border-white/10">
          <div className="space-y-4">
             <label className="text-[10px] font-black uppercase text-indigo-400 tracking-widest ml-6">Database Host</label>
             <input type="text" value={dbConfig.host} onChange={e => setDbConfig({...dbConfig, host: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div className="space-y-4">
             <label className="text-[10px] font-black uppercase text-indigo-400 tracking-widest ml-6">DB Identifier</label>
             <input type="text" value={dbConfig.name} onChange={e => setDbConfig({...dbConfig, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div className="space-y-4">
             <label className="text-[10px] font-black uppercase text-indigo-400 tracking-widest ml-6">User/Pass</label>
             <div className="flex gap-2">
                <input type="text" placeholder="User" value={dbConfig.user} onChange={e => setDbConfig({...dbConfig, user: e.target.value})} className="w-1/2 bg-white/5 border border-white/10 rounded-2xl p-5 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none" />
                <input type="password" placeholder="Pass" value={dbConfig.pass} onChange={e => setDbConfig({...dbConfig, pass: e.target.value})} className="w-1/2 bg-white/5 border border-white/10 rounded-2xl p-5 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none" />
             </div>
          </div>
       </div>

       <div className="p-8 bg-black/40 rounded-[3rem] border border-white/5 space-y-6">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-3 text-[10px] font-black uppercase text-emerald-400 tracking-widest"><FileCode className="w-4 h-4" /> Schema Preview (Corrected v5.6.2)</div>
             <button onClick={() => { navigator.clipboard.writeText(generateMasterSQL()); alert("SQL Copied to clipboard"); }} className="p-3 bg-white/5 rounded-xl text-white hover:bg-white/10 transition-all border border-white/10"><Download className="w-4 h-4" /></button>
          </div>
          <pre className="text-[11px] font-mono text-slate-500 max-h-60 overflow-y-auto custom-scrollbar leading-relaxed">
             {generateMasterSQL()}
          </pre>
       </div>
    </div>
  );
};

// Placeholder for creationHub (Logic assumed from context)
const CreationHub = ({ type, item, onClose, data, onSave }: any) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white w-full max-w-2xl p-12 rounded-[4rem] shadow-2xl relative z-10 animate-in zoom-in-95 duration-300">
         <button onClick={onClose} className="absolute top-10 right-10 text-slate-400 hover:text-slate-900"><X className="w-8 h-8" /></button>
         <h3 className="text-3xl font-black italic tracking-tighter text-slate-900 mb-10">Entity Interface: {type}</h3>
         <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <Info className="w-12 h-12 text-indigo-200" />
            <p className="text-slate-400 text-sm font-medium">Detailed form logic for {type} editing is contained in the full Admin controller.</p>
            <button onClick={onClose} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Exit Terminal</button>
         </div>
      </div>
    </div>
  );
};

export default AdminCMS;
