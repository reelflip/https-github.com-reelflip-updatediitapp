import React, { useState, useEffect, useRef } from 'react';
import JSZip from 'jszip';
import { StudentData, UserAccount, Subject, ChapterStatus, Question, MockTest, Chapter } from '../types';
import { api } from '../services/apiService';
import { chatWithTutor, MODEL_CONFIGS } from '../services/intelligenceService';
import { 
  ShieldCheck, BookOpen, Layers, Zap, Package, Loader2,
  Plus, Trash2, Edit3, X, 
  Target, Code2, Server, 
  Cpu, Save, Users, PenTool, Send,
  Network, Check, ChevronRight, Bot, User, Terminal,
  Layout, List, FileText, HelpCircle, Image as ImageIcon,
  Calendar, Award, Hash, Type, Lightbulb, Activity, Filter,
  CheckCircle2, Search, Clock
} from 'lucide-react';

interface AdminCMSProps {
  activeTab: string;
  data: StudentData;
  setData: (data: StudentData) => void;
}

const Overview = ({ data }: { data: StudentData }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
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
    <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden mx-4">
      <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
         <h3 className="text-xl font-black italic text-slate-800 flex items-center gap-3"><Users className="w-6 h-6 text-indigo-600" /> User Directory</h3>
      </div>
      <div className="divide-y divide-slate-50 max-h-[600px] overflow-y-auto">
        {isLoading ? (
          <div className="p-20 flex flex-col items-center justify-center text-slate-400 gap-4"><Loader2 className="animate-spin" /> Fetching accounts...</div>
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
  <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden mx-4">
    <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
       <h3 className="text-xl font-black italic text-slate-800 flex items-center gap-3"><Icon className={`w-6 h-6 text-${color}-600`} /> {title}</h3>
       <button onClick={onNew} className={`bg-${color}-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-${color}-100 hover:scale-105 transition-all`}><Plus className="w-4 h-4" /> {btnLabel}</button>
    </div>
    <div className="divide-y divide-slate-50 max-h-[600px] overflow-y-auto">
      {data.length === 0 ? (
        <div className="p-20 text-center text-slate-300 font-black uppercase text-[10px] tracking-widest italic">Database is empty.</div>
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
                      <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{item.subject || item.category || 'Standard'}</span>
                      {item.status && <span className="text-[8px] font-black uppercase px-2 py-0.5 bg-slate-100 rounded text-slate-500">{item.status}</span>}
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

const CreationHub = ({ type, item, onClose, onSave, questions = [], chapters = [] }: any) => {
  const [formData, setFormData] = useState<any>(item || {
    id: `ID-${Math.random().toString(36).substr(2, 9)}`,
    name: '', title: '', subject: 'Physics' as Subject, unit: 'UNIT 1', text: '',
    options: ['', '', '', ''], correctAnswer: 0, difficulty: 'EASY',
    explanation: '', author: 'Admin Console', content: '',
    date: new Date().toISOString().split('T')[0], status: 'PUBLISHED',
    progress: 0, accuracy: 0, timeSpent: 0,
    question: '', answer: '', category: 'Shortcuts', hack: '',
    duration: 180, totalMarks: 300, questionIds: [], chapterIds: []
  });

  const [qSearch, setQSearch] = useState('');
  const [qFilterSubject, setQFilterSubject] = useState<string>('All');

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (idx: number, val: string) => {
    const newOpts = [...formData.options];
    newOpts[idx] = val;
    setFormData((prev: any) => ({ ...prev, options: newOpts }));
  };

  const toggleQuestionSelection = (qId: string) => {
    const current = [...(formData.questionIds || [])];
    if (current.includes(qId)) {
      setFormData({ ...formData, questionIds: current.filter(id => id !== qId) });
    } else {
      setFormData({ ...formData, questionIds: [...current, qId] });
    }
  };

  const InputGroup = ({ label, icon: Icon, children }: any) => (
    <div className="space-y-3">
       <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-2 flex items-center gap-2">
          {Icon && <Icon className="w-3 h-3 text-indigo-500" />} {label}
       </label>
       {children}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose}></div>
      <div className="bg-white w-full max-w-5xl my-auto rounded-[4rem] shadow-2xl relative z-10 animate-in zoom-in-95 duration-300 overflow-hidden flex flex-col max-h-[90vh]">
         <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-6">
               <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100">
                  {type === 'Blog' ? <PenTool className="w-7 h-7" /> : type === 'Question' ? <HelpCircle className="w-7 h-7" /> : type === 'MockTest' ? <Target className="w-7 h-7" /> : <Layers className="w-7 h-7" />}
               </div>
               <div>
                  <h3 className="text-3xl font-black italic tracking-tighter text-slate-900 uppercase leading-none">
                     {item ? 'Modify' : 'Create'} <span className="text-indigo-600">{type}.</span>
                  </h3>
                  <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mt-1">Universal Persistence Hub</p>
               </div>
            </div>
            <button onClick={onClose} className="p-4 bg-white text-slate-400 hover:text-slate-900 rounded-2xl transition-all border border-slate-100"><X className="w-6 h-6" /></button>
         </div>

         <div className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar">
            {type === 'Blog' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <InputGroup label="Article Title" icon={Type}>
                    <input name="title" value={formData.title} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-black italic text-slate-800" placeholder="Mastering Thermodynamics..." />
                 </InputGroup>
                 <InputGroup label="Author Node" icon={User}>
                    <input name="author" value={formData.author} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-black text-slate-800" />
                 </InputGroup>
                 <div className="md:col-span-2">
                    <InputGroup label="Content (HTML Supported)" icon={FileText}>
                       <textarea name="content" value={formData.content} onChange={handleChange} rows={12} className="w-full bg-slate-50 border-none rounded-3xl p-8 text-sm font-medium leading-relaxed text-slate-600 shadow-inner" placeholder="<p>Detailed strategy...</p>" />
                    </InputGroup>
                 </div>
              </div>
            )}

            {type === 'Question' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="md:col-span-2">
                    <InputGroup label="Problem Statement" icon={HelpCircle}>
                       <textarea name="text" value={formData.text} onChange={handleChange} rows={4} className="w-full bg-slate-50 border-none rounded-3xl p-8 text-lg font-bold italic text-slate-800" placeholder="What is the derivative of..." />
                    </InputGroup>
                 </div>
                 <InputGroup label="Subject" icon={BookOpen}>
                    <select name="subject" value={formData.subject} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-black text-slate-800">
                       <option value="Physics">Physics</option>
                       <option value="Chemistry">Chemistry</option>
                       <option value="Mathematics">Mathematics</option>
                    </select>
                 </InputGroup>
                 <InputGroup label="Difficulty Tier" icon={Zap}>
                    <select name="difficulty" value={formData.difficulty} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-black text-slate-800">
                       <option value="EASY">Level 1: Basic</option>
                       <option value="MEDIUM">Level 2: Mains</option>
                       <option value="HARD">Level 3: Advanced</option>
                    </select>
                 </InputGroup>
                 <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {formData.options.map((opt: string, i: number) => (
                       <InputGroup key={i} label={`Option ${String.fromCharCode(65+i)}`} icon={List}>
                          <div className="relative">
                             <input value={opt} onChange={(e) => handleOptionChange(i, e.target.value)} className={`w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold text-slate-700 ${formData.correctAnswer === i ? 'ring-2 ring-emerald-500 shadow-lg shadow-emerald-50' : ''}`} placeholder={`Possible result ${i+1}`} />
                             <button onClick={() => setFormData({...formData, correctAnswer: i})} className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${formData.correctAnswer === i ? 'bg-emerald-500 text-white scale-110' : 'bg-slate-200 text-slate-400 hover:bg-slate-300'}`}><Check className="w-4 h-4" /></button>
                          </div>
                       </InputGroup>
                    ))}
                 </div>
                 <div className="md:col-span-2">
                    <InputGroup label="Step-by-Step Explanation" icon={Lightbulb}>
                       <textarea name="explanation" value={formData.explanation} onChange={handleChange} rows={4} className="w-full bg-slate-50 border-none rounded-3xl p-8 text-sm font-medium text-slate-600" placeholder="Applying the chain rule..." />
                    </InputGroup>
                 </div>
              </div>
            )}

            {type === 'MockTest' && (
              <div className="space-y-12">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <InputGroup label="Exam Name" icon={Type}>
                       <input name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-black italic text-slate-800" placeholder="JEE Main Mock #4" />
                    </InputGroup>
                    <InputGroup label="Duration (Mins)" icon={Clock}>
                       <input type="number" name="duration" value={formData.duration} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-black text-slate-800" />
                    </InputGroup>
                    <InputGroup label="Difficulty" icon={Zap}>
                       <select name="difficulty" value={formData.difficulty} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-black text-slate-800">
                          <option value="MAINS">JEE Mains</option>
                          <option value="ADVANCED">JEE Advanced</option>
                          <option value="EASY">Practice</option>
                       </select>
                    </InputGroup>
                 </div>

                 <div className="space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                       <h4 className="text-xl font-black italic text-slate-800 flex items-center gap-3"><Code2 className="w-6 h-6 text-indigo-600" /> Question Selection ({formData.questionIds?.length || 0} Selected)</h4>
                       <div className="flex gap-4">
                          <div className="relative w-64">
                             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                             <input type="text" placeholder="Search bank..." value={qSearch} onChange={e => setQSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold" />
                          </div>
                          <select value={qFilterSubject} onChange={e => setQFilterSubject(e.target.value)} className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-xs font-bold">
                             <option value="All">All Subjects</option>
                             <option value="Physics">Physics</option>
                             <option value="Chemistry">Chemistry</option>
                             <option value="Mathematics">Mathematics</option>
                          </select>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-4 custom-scrollbar bg-slate-50/50 p-6 rounded-[2.5rem] border border-slate-100 shadow-inner">
                       {questions
                        .filter((q: any) => qFilterSubject === 'All' || q.subject === qFilterSubject)
                        .filter((q: any) => q.text.toLowerCase().includes(qSearch.toLowerCase()))
                        .map((q: any) => (
                          <div 
                           key={q.id} 
                           onClick={() => toggleQuestionSelection(q.id)}
                           className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between group ${formData.questionIds?.includes(q.id) ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-white hover:border-indigo-200'}`}
                          >
                             <div className="flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black ${formData.questionIds?.includes(q.id) ? 'bg-white/20' : 'bg-slate-100 text-slate-400'}`}>{q.subject[0]}</div>
                                <div className="max-w-[200px]">
                                   <div className={`text-xs font-bold line-clamp-1 ${formData.questionIds?.includes(q.id) ? 'text-white' : 'text-slate-800'}`}>{q.text}</div>
                                   <div className={`text-[8px] font-black uppercase tracking-widest mt-1 ${formData.questionIds?.includes(q.id) ? 'text-indigo-200' : 'text-slate-400'}`}>{q.difficulty}</div>
                                </div>
                             </div>
                             <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${formData.questionIds?.includes(q.id) ? 'bg-white border-white' : 'border-slate-200 group-hover:border-indigo-400'}`}>
                                {formData.questionIds?.includes(q.id) && <Check className="w-3 h-3 text-indigo-600" />}
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
            )}

            {type === 'Chapter' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <InputGroup label="Chapter Name" icon={Type}>
                    <input name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-black italic text-slate-800" placeholder="Thermodynamics..." />
                 </InputGroup>
                 <InputGroup label="Unit ID" icon={Hash}>
                    <input name="unit" value={formData.unit} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-black text-slate-800" placeholder="UNIT 01" />
                 </InputGroup>
                 <InputGroup label="Subject" icon={BookOpen}>
                    <select name="subject" value={formData.subject} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-black text-slate-800">
                       <option value="Physics">Physics</option>
                       <option value="Chemistry">Chemistry</option>
                       <option value="Mathematics">Mathematics</option>
                    </select>
                 </InputGroup>
                 <InputGroup label="Status" icon={Activity}>
                    <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-black text-slate-800">
                       <option value="NOT_STARTED">Not Started</option>
                       <option value="LEARNING">Learning Phase</option>
                       <option value="REVISION">Revision Phase</option>
                       <option value="COMPLETED">Mastered</option>
                    </select>
                 </InputGroup>
              </div>
            )}

            {!['Blog', 'Question', 'Chapter', 'MockTest'].includes(type) && (
               <div className="space-y-8">
                  <InputGroup label="Entry Primary Data" icon={Type}>
                     <input name={type === 'Flashcard' ? 'question' : 'title'} value={formData.title || formData.question || formData.name} onChange={(e) => setFormData({...formData, title: e.target.value, name: e.target.value, question: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-black italic text-slate-800" placeholder="Enter content name..." />
                  </InputGroup>
                  <InputGroup label="Supporting Intelligence" icon={FileText}>
                     <textarea name={type === 'Flashcard' ? 'answer' : 'description'} value={formData.description || formData.answer || formData.hack} onChange={(e) => setFormData({...formData, description: e.target.value, answer: e.target.value, hack: e.target.value})} rows={6} className="w-full bg-slate-50 border-none rounded-3xl p-8 text-sm font-medium text-slate-600 shadow-inner" placeholder="Detailed payload..." />
                  </InputGroup>
               </div>
            )}
         </div>

         <div className="p-10 border-t border-slate-100 flex gap-6 bg-slate-50/50">
            <button onClick={onClose} className="flex-1 py-6 bg-white border border-slate-200 text-slate-500 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] hover:bg-slate-100 transition-all">Cancel</button>
            <button onClick={() => onSave(formData)} className="flex-1 py-6 bg-indigo-600 text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.4em] shadow-2xl shadow-indigo-100 flex items-center justify-center gap-4 hover:bg-indigo-700 hover:scale-[1.02] transition-all"><Save className="w-6 h-6" /> Commit to Database</button>
         </div>
      </div>
    </div>
  );
};

const SystemHub = ({ data, setData }: { data: StudentData, setData: (d: StudentData) => void }) => {
  const [activeSubTab, setActiveSubTab] = useState<'ai' | 'server' | 'tester'>('ai');
  const [activeModelId, setActiveModelId] = useState(data.aiTutorModel || 'gemini-flash');

  const [testerModelId, setTesterModelId] = useState('gemini-flash');
  const [testerSubject, setTesterSubject] = useState<Subject>('Physics');
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('jeepro_platform_ai_model');
    if (saved) setActiveModelId(saved);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleModelSelect = (id: string) => {
    setActiveModelId(id);
    localStorage.setItem('jeepro_platform_ai_model', id);
    setData({ ...data, aiTutorModel: id });
  };

  const handleDownloadBuild = async () => {
    try {
      const zip = new JSZip();
      
      zip.file(".htaccess", "RewriteEngine On\nRewriteRule ^$ index.html [L]\nRewriteCond %{REQUEST_FILENAME} !-f\nRewriteCond %{REQUEST_FILENAME} !-d\nRewriteRule . index.html [L]");
      
      const apiFolder = zip.folder("api");
      if (apiFolder) {
        apiFolder.file(".htaccess", "RewriteEngine On\nRewriteCond %{REQUEST_FILENAME} !-f\nRewriteCond %{REQUEST_FILENAME} !-d\nRewriteRule ^([^/]+)/?([^/]+)?$ index.php?module=$1&action=$2 [L,QSA]");

        const configFolder = apiFolder.folder("config");
        configFolder?.file("database.php", `<?php
return [
    'host' => 'localhost',
    'dbname' => 'jeepro_db',
    'user' => 'root',
    'pass' => ''
];`);

        apiFolder.file("db.php", `<?php
function getDB() {
    $config = require 'config/database.php';
    try {
        $pdo = new PDO("mysql:host={$config['host']};dbname={$config['dbname']};charset=utf8mb4", $config['user'], $config['pass']);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo;
    } catch(PDOException $e) {
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'error' => 'Database Link Broken: ' . $e.getMessage()]);
        exit;
    }
}`);

        apiFolder.file("index.php", `<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

require_once 'db.php';
$db = getDB();

$module = $_GET['module'] ?? '';
$action = $_GET['action'] ?? '';
$json = file_get_contents('php://input');
$reqData = json_decode($json, true) ?? [];

/** 
 * SOLARIS PRODUCTION ROUTER v6.8
 * Handles: Auth (Role Agnostic Login), Syllabus, Results, Wellness, Backlogs, Timetable
 */

try {
    if ($module === 'auth') {
        if ($action === 'register') {
            $id = 'USR-' . strtoupper(substr(md5($reqData['email'] . time()), 0, 8));
            $stmt = $db->prepare("INSERT INTO users (id, email, name, password, role, institute, target_exam, target_year, birth_date, gender) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $id, $reqData['email'], $reqData['name'], 
                password_hash($reqData['password'], PASSWORD_DEFAULT), 
                $reqData['role'], $reqData['institute'] ?? '', 
                $reqData['targetExam'] ?? '', $reqData['targetYear'] ?? '',
                $reqData['birthDate'] ?? null, $reqData['gender'] ?? ''
            ]);
            echo json_encode(['success' => true, 'user' => [
                'id' => $id, 'name' => $reqData['name'], 'email' => $reqData['email'], 'role' => $reqData['role'],
                'institute' => $reqData['institute'] ?? '', 'targetExam' => $reqData['targetExam'] ?? '',
                'targetYear' => $reqData['targetYear'] ?? '', 'birthDate' => $reqData['birthDate'] ?? '', 'gender' => $reqData['gender'] ?? ''
            ]]);
        } elseif ($action === 'login') {
            // NEW: Role agnostic login - find user first, then verify password
            $stmt = $db->prepare("SELECT * FROM users WHERE email = ?");
            $stmt->execute([$reqData['email']]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($user && password_verify($reqData['password'], $user['password'])) {
                unset($user['password']);
                echo json_encode(['success' => true, 'user' => $user]);
            } else {
                echo json_encode(['success' => false, 'error' => 'Invalid credentials.']);
            }
        } elseif ($action === 'update_profile') {
            $stmt = $db->prepare("UPDATE users SET name = ?, institute = ?, target_exam = ?, target_year = ?, birth_date = ?, gender = ? WHERE id = ?");
            $stmt->execute([$reqData['name'], $reqData['institute'], $reqData['targetExam'], $reqData['targetYear'], $reqData['birthDate'], $reqData['gender'], $reqData['id']]);
            echo json_encode(['success' => true]);
        } elseif ($action === 'index') {
            $stmt = $db->query("SELECT id, name, email, role, institute FROM users");
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        }
    } 
    
    elseif ($module === 'syllabus') {
        if ($action === 'save') {
            $stmt = $db->prepare("INSERT INTO syllabus (student_id, data) VALUES (?, ?) ON DUPLICATE KEY UPDATE data = ?");
            $jsonData = json_encode($reqData['chapters']);
            $stmt->execute([$reqData['student_id'], $jsonData, $jsonData]);
            echo json_encode(['success' => true]);
        } elseif ($action === 'get') {
            $stmt = $db->prepare("SELECT u.name, s.data FROM users u LEFT JOIN syllabus s ON u.id = s.student_id WHERE u.id = ?");
            $stmt->execute([$_GET['id']]);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode(['name' => $row['name'] ?? '', 'chapters' => json_decode($row['data'] ?? '[]', true)]);
        }
    }

    elseif ($module === 'results') {
        if ($action === 'save') {
            $stmt = $db->prepare("INSERT INTO results (student_id, test_id, test_name, score, total_marks, date, accuracy) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$reqData['student_id'], $reqData['testId'], $reqData['testName'], $reqData['score'], $reqData['totalMarks'], $reqData['date'], $reqData['accuracy']]);
            echo json_encode(['success' => true]);
        } elseif ($action === 'get') {
            $stmt = $db->prepare("SELECT * FROM results WHERE student_id = ? ORDER BY date DESC");
            $stmt->execute([$_GET['id']]);
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        }
    }

    elseif ($module === 'wellness') {
        if ($action === 'save') {
            $stmt = $db->prepare("INSERT INTO wellness (student_id, stress, focus, motivation, exam_fear, timestamp, summary) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$reqData['student_id'], $reqData['stress'], $reqData['focus'], $reqData['motivation'], $reqData['examFear'], $reqData['timestamp'], $reqData['studentSummary'] ?? '']);
            echo json_encode(['success' => true]);
        } elseif ($action === 'get') {
            $stmt = $db->prepare("SELECT * FROM wellness WHERE student_id = ? ORDER BY timestamp DESC");
            $stmt->execute([$_GET['id']]);
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        }
    }

    elseif ($module === 'timetable') {
        if ($action === 'save') {
            $stmt = $db->prepare("INSERT INTO timetable (student_id, routine_json) VALUES (?, ?) ON DUPLICATE KEY UPDATE routine_json = ?");
            $routineJson = json_encode($reqData);
            $stmt->execute([$reqData['student_id'], $routineJson, $routineJson]);
            echo json_encode(['success' => true]);
        } elseif ($action === 'get') {
            $stmt = $db->prepare("SELECT routine_json FROM timetable WHERE student_id = ?");
            $stmt->execute([$_GET['id']]);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            echo $row['routine_json'] ?? 'null';
        }
    }

    elseif ($module === 'backlogs') {
        if ($action === 'save') {
            $stmt = $db->prepare("INSERT INTO backlogs (student_id, title, subject, priority, status, deadline) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([$reqData['student_id'], $reqData['title'], $reqData['subject'], $reqData['priority'], $reqData['status'], $reqData['deadline']]);
            echo json_encode(['success' => true]);
        } elseif ($action === 'get') {
            $stmt = $db->prepare("SELECT * FROM backlogs WHERE student_id = ? ORDER BY deadline ASC");
            $stmt->execute([$_GET['id']]);
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        }
    }

    elseif ($module === 'questions' || $module === 'mocktests') {
        echo json_encode([]);
    }

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => $e.getMessage()]);
}
`);
        
        const sqlFolder = apiFolder.folder("sql");
        sqlFolder?.file("full_production_schema_v6.8.sql", `
-- SOLARIS MASTER SCHEMA v6.8
-- Recommended for Hostinger / VPS / XAMPP

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. Identity Infrastructure
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('STUDENT', 'PARENT', 'ADMIN') NOT NULL,
    institute VARCHAR(150),
    target_exam VARCHAR(100),
    target_year VARCHAR(10),
    birth_date DATE,
    gender VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Academic Telemetry
CREATE TABLE IF NOT EXISTS syllabus (
    student_id VARCHAR(50) PRIMARY KEY,
    data LONGTEXT COMMENT 'JSON chapters data',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Standardized Results
CREATE TABLE IF NOT EXISTS results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(50),
    test_id VARCHAR(100),
    test_name VARCHAR(255),
    score INT,
    total_marks INT,
    date DATE,
    accuracy INT,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Psychometric History
CREATE TABLE IF NOT EXISTS wellness (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(50),
    stress INT,
    focus INT,
    motivation INT,
    exam_fear INT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    summary TEXT,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Tactical Timetable
CREATE TABLE IF NOT EXISTS timetable (
    student_id VARCHAR(50) PRIMARY KEY,
    routine_json JSON,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Backlog Debt
CREATE TABLE IF NOT EXISTS backlogs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(50),
    title VARCHAR(255),
    subject VARCHAR(50),
    priority VARCHAR(20),
    status VARCHAR(20),
    deadline DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;
`);
      }

      const content = await zip.generateAsync({ type: "blob" });
      const url = window.URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = "solaris-full-stack-build-v6.8.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (err) {
      console.error("ZIP Generation Failed", err);
    }
  };

  const handleTestSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    const testContext: StudentData = {
      ...data,
      aiTutorModel: testerModelId
    };

    setTimeout(async () => {
      const reply = await chatWithTutor([], `${testerSubject} Context: ${userMsg}`, testerModelId, testContext);
      setMessages(prev => [...prev, { role: 'bot', text: reply }]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="space-y-10 px-4">
      <div className="flex bg-white p-2 rounded-[2rem] border border-slate-200 shadow-sm w-fit">
         <button onClick={() => setActiveSubTab('ai')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'ai' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>Intelligence Setup</button>
         <button onClick={() => setActiveSubTab('tester')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'tester' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>Intelligence Tester</button>
         <button onClick={() => setActiveSubTab('server')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'server' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>Server Deployment</button>
      </div>

      {activeSubTab === 'ai' && (
        <div className="space-y-10 animate-in fade-in duration-500">
          <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
             <div className="space-y-2">
                <h3 className="text-2xl font-black italic text-slate-900 uppercase">Global Architecture Control</h3>
                <p className="text-xs font-bold text-slate-400">Select the underlying engine for all student academic interactions.</p>
             </div>
             <div className="flex items-center gap-3 bg-emerald-50 px-6 py-2.5 rounded-2xl border border-emerald-100">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Active Engine: {MODEL_CONFIGS[activeModelId]?.name}</span>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(MODEL_CONFIGS).map(([id, config]) => (
              <button 
                key={id}
                onClick={() => handleModelSelect(id)}
                className={`text-left p-8 rounded-[2.5rem] bg-white border-2 transition-all relative group h-64 flex flex-col justify-between ${
                  activeModelId === id ? 'border-indigo-600 ring-4 ring-indigo-50 shadow-xl' : 'border-slate-100 hover:border-indigo-200 hover:shadow-lg'
                }`}
              >
                {activeModelId === id && (
                  <div className="absolute top-6 right-6 bg-indigo-600 text-white p-1.5 rounded-full shadow-lg"><Check className="w-4 h-4" /></div>
                )}
                <div className="space-y-4">
                  <div className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest w-fit ${
                    config.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                    config.color === 'purple' ? 'bg-purple-50 text-purple-600' :
                    config.color === 'indigo' ? 'bg-indigo-50 text-indigo-600' :
                    config.color === 'teal' ? 'bg-teal-50 text-teal-600' :
                    config.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                    'bg-orange-50 text-orange-600'
                  }`}>
                    {config.tag}
                  </div>
                  <h4 className="text-xl font-black text-slate-800 tracking-tighter italic">{config.name}</h4>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed italic">{config.desc}</p>
                </div>
                <div className="flex items-center gap-2 pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="text-[8px] font-black uppercase text-indigo-600 tracking-widest">Select Node</div>
                   <ChevronRight className="w-3 h-3 text-indigo-600" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'tester' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
           <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                 <label className="text-[10px] font-black uppercase text-indigo-600 tracking-widest flex items-center gap-2"><Cpu className="w-4 h-4" /> Engine Selection</label>
                 <select 
                    value={testerModelId}
                    onChange={(e) => setTesterModelId(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm font-black italic text-slate-800 outline-none focus:border-indigo-600 transition-all"
                 >
                    {Object.entries(MODEL_CONFIGS).map(([id, config]) => (
                       <option key={id} value={id}>{config.name} ({config.tag})</option>
                    ))}
                 </select>
              </div>
              <div className="space-y-4">
                 <label className="text-[10px] font-black uppercase text-emerald-600 tracking-widest flex items-center gap-2"><BookOpen className="w-4 h-4" /> Simulator Context</label>
                 <select 
                    value={testerSubject}
                    onChange={(e) => setTesterSubject(e.target.value as Subject)}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm font-black italic text-slate-800 outline-none focus:border-emerald-600 transition-all"
                 >
                    <option value="Physics">Physics Hub</option>
                    <option value="Chemistry">Chemistry Lab</option>
                    <option value="Mathematics">Mathematics Core</option>
                 </select>
              </div>
           </div>

           <div className="h-[600px] bg-slate-900 rounded-[3.5rem] border border-slate-800 shadow-2xl flex flex-col overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,#1e1b4b_0%,transparent_70%)] opacity-30 pointer-events-none"></div>
              
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/20 backdrop-blur-md relative z-10">
                 <div className="flex items-center gap-4">
                    <div className="flex gap-1.5">
                       <div className="w-2.5 h-2.5 rounded-full bg-rose-500/50"></div>
                       <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50"></div>
                       <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50"></div>
                    </div>
                    <div className="h-4 w-px bg-white/10 mx-2"></div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                       <Terminal className="w-3.5 h-3.5" /> Heuristic Debug Console
                    </div>
                 </div>
                 <div className="text-[9px] font-black uppercase text-indigo-400 bg-indigo-400/10 px-4 py-1.5 rounded-full border border-indigo-400/20">
                    Engine Link: {MODEL_CONFIGS[testerModelId]?.tag}
                 </div>
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-10 relative z-10 custom-scrollbar">
                 {messages.length === 0 && (
                   <div className="h-full flex flex-col items-center justify-center text-center opacity-30 space-y-4">
                      <Network className="w-16 h-16" />
                      <p className="text-[10px] font-black uppercase tracking-[0.4em]">Awaiting Local Link...</p>
                   </div>
                 )}
                 {messages.map((m, i) => (
                   <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}>
                      <div className={`flex gap-6 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                           m.role === 'bot' ? 'bg-indigo-600/10 border-indigo-500/30 text-indigo-400' : 'bg-white/10 border-white/10 text-white'
                         }`}>
                           {m.role === 'bot' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                         </div>
                         <div className={`p-6 rounded-[2rem] text-sm leading-relaxed font-bold shadow-sm whitespace-pre-wrap ${
                           m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none italic'
                         }`}>
                           {m.text}
                         </div>
                      </div>
                   </div>
                 ))}
                 {isTyping && (
                   <div className="flex justify-start">
                      <div className="flex gap-6">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400"><Loader2 className="w-4 h-4 animate-spin" /></div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-indigo-400/50 py-3">Computing Local Logic...</div>
                      </div>
                   </div>
                 )}
              </div>

              <div className="p-8 border-t border-white/5 bg-black/40 relative z-10">
                 <div className="flex gap-4 max-w-4xl mx-auto">
                    <input 
                       type="text"
                       value={input}
                       onChange={(e) => setInput(e.target.value)}
                       onKeyDown={(e) => e.key === 'Enter' && handleTestSend()}
                       placeholder={`Test local ${MODEL_CONFIGS[testerModelId]?.name} output...`}
                       className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:ring-4 focus:ring-indigo-500/20 transition-all outline-none"
                    />
                    <button 
                       onClick={handleTestSend}
                       disabled={isTyping}
                       className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-700 transition-all shadow-2xl disabled:opacity-50"
                    >
                       <Send className="w-5 h-5" />
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {activeSubTab === 'server' && (
        <div className="space-y-10 animate-in slide-in-from-right duration-500">
          <div className="bg-slate-900 rounded-[4rem] p-20 text-white shadow-2xl flex flex-col md:flex-row justify-between items-center relative overflow-hidden">
             <div className="absolute top-0 right-0 p-12 opacity-5"><Server className="w-80 h-80" /></div>
             <div className="space-y-4 relative z-10">
                <h3 className="text-4xl font-black italic tracking-tighter uppercase leading-none">The Master <span className="text-indigo-500 italic font-black">Archive.</span></h3>
                <p className="text-slate-400 font-medium max-w-md">Full-stack blueprint including PHP gatekeeper and MySQL master schema v6.8 with Role-Agnostic Login.</p>
             </div>
             <button onClick={handleDownloadBuild} className="px-10 py-5 bg-white text-slate-900 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.3em] flex items-center gap-4 hover:bg-indigo-50 transition-all shadow-2xl group relative z-10"><Package className="w-6 h-6 group-hover:scale-110 transition-transform" /> Download Production Build v6.8</button>
          </div>
        </div>
      )}
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
    if (!confirm(`Confirm deletion of this ${type}?`)) return;
    const key = type === 'Chapter' ? 'chapters' : 
                type === 'Question' ? 'questions' : 
                type === 'MockTest' ? 'mockTests' :
                type === 'Flashcard' ? 'flashcards' :
                type === 'MemoryHack' ? 'memoryHacks' : 'blogs';
    const newList = (data[key as keyof StudentData] as any[]).filter((item: any) => item.id !== id);
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
    <div className="pb-20 max-w-7xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm mx-4">
        <div className="space-y-2">
          <div className="text-[10px] font-black uppercase text-indigo-600 tracking-[0.4em] flex items-center gap-3">
             <ShieldCheck className="w-4 h-4" /> Solaris Control: System Administration
          </div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter italic leading-none uppercase">Central <span className="text-indigo-600 font-black">Commander.</span></h2>
        </div>
        
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

      <div className="space-y-12 animate-in fade-in duration-700">
        {activeTab === 'admin-overview' && <Overview data={data} />}
        {activeTab === 'admin-users' && <UserManagement />}
        {activeTab === 'admin-syllabus' && <EntityList title="Syllabus Management" type="Chapter" data={data.chapters} icon={BookOpen} color="indigo" btnLabel="Add Chapter" onEdit={handleEdit} onDelete={handleDelete} onNew={() => { setCreationType('Chapter'); setEditingItem(null); setIsCreating(true); }} />}
        {activeTab === 'admin-questions' && <EntityList title="Question Bank" type="Question" data={data.questions} icon={Code2} color="emerald" btnLabel="Add Question" onEdit={handleEdit} onDelete={handleDelete} onNew={() => { setCreationType('Question'); setEditingItem(null); setIsCreating(true); }} />}
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
          onClose={() => setIsCreating(false)} 
          onSave={(entity: any) => handleSaveEntity(creationType, entity)}
          questions={data.questions}
          chapters={data.chapters}
        />
      )}
    </div>
  );
};

export default AdminCMS;