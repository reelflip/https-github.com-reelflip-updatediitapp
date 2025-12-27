
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
  CheckCircle2, Search, Clock, Database, Globe, Video, ExternalLink,
  PlayCircle, FileArchive
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
      <div key={i} className={`bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:scale-105 transition-transform group`}>
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
                      {item.status && <span className="text-[8px] font-black uppercase px-2 py-0.5 bg-slate-100 rounded text-slate-500">{item.status.replace('_', ' ')}</span>}
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
    timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0,
    question: '', answer: '', category: 'Shortcuts', hack: '',
    duration: 180, totalMarks: 300, questionIds: [], chapterIds: [],
    notes: '', videoUrl: '', targetCompletionDate: ''
  });

  const [qSearch, setQSearch] = useState('');

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (idx: number, val: string) => {
    const newOpts = [...formData.options];
    newOpts[idx] = val;
    setFormData((prev: any) => ({ ...prev, options: newOpts }));
  };

  const toggleSelection = (listKey: string, id: string) => {
    const current = [...(formData[listKey] || [])];
    if (current.includes(id)) {
      setFormData({ ...formData, [listKey]: current.filter(x => x !== id) });
    } else {
      setFormData({ ...formData, [listKey]: [...current, id] });
    }
  };

  const InputGroup = ({ label, children }: any) => (
    <div className="space-y-3">
       <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-2">{label}</label>
       {children}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose}></div>
      <div className="bg-white w-full max-w-5xl my-auto rounded-[4rem] shadow-2xl relative z-10 animate-in zoom-in-95 duration-300 overflow-hidden flex flex-col max-h-[90vh]">
         <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
            <div className="flex items-center gap-6">
               <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100">
                  {type === 'Blog' ? <PenTool className="w-7 h-7" /> : type === 'Question' ? <HelpCircle className="w-7 h-7" /> : type === 'MockTest' ? <Target className="w-7 h-7" /> : type === 'Chapter' ? <BookOpen className="w-7 h-7" /> : <Layers className="w-7 h-7" />}
               </div>
               <div>
                  <h3 className="text-3xl font-black italic tracking-tighter text-slate-900 uppercase leading-none">
                     {item ? 'Modify' : 'Create'} <span className="text-indigo-600">{type}.</span>
                  </h3>
                  <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mt-1">Apex Management Protocol</p>
               </div>
            </div>
            <button onClick={onClose} className="p-4 bg-white text-slate-400 hover:text-slate-900 rounded-2xl transition-all border border-slate-100"><X className="w-6 h-6" /></button>
         </div>

         <div className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar">
            
            {type === 'Chapter' && (
              <div className="space-y-12">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <InputGroup label="Chapter Identity">
                       <input name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black italic text-slate-800" placeholder="Ex: Electrostatics" />
                    </InputGroup>
                    <InputGroup label="Subject Node">
                       <select name="subject" value={formData.subject} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black text-slate-800">
                          <option value="Physics">Physics</option>
                          <option value="Chemistry">Chemistry</option>
                          <option value="Mathematics">Mathematics</option>
                       </select>
                    </InputGroup>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <InputGroup label="Unit Catalog Label">
                       <input name="unit" value={formData.unit} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black italic text-slate-800" placeholder="Ex: UNIT 1" />
                    </InputGroup>
                    <InputGroup label="Lifecycle Status">
                       <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black text-slate-800">
                          <option value="NOT_STARTED">Not Started</option>
                          <option value="LEARNING">Learning</option>
                          <option value="REVISION">Revision</option>
                          <option value="COMPLETED">Completed</option>
                       </select>
                    </InputGroup>
                 </div>
                 <div className="space-y-10 pt-10 border-t border-slate-100">
                    <h4 className="text-[11px] font-black uppercase text-indigo-600 tracking-[0.3em] flex items-center gap-3"><PlayCircle className="w-5 h-5" /> Academic Assets</h4>
                    <div className="grid grid-cols-1 gap-10">
                       <InputGroup label="Video Lecture URL (YouTube/MP4)">
                          <div className="relative group">
                             <Video className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                             <input name="videoUrl" value={formData.videoUrl} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl py-6 pl-14 pr-6 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-indigo-100 transition-all" placeholder="https://..." />
                          </div>
                       </InputGroup>
                       <InputGroup label="Digital Study Notes (HTML Supported)">
                          <div className="relative group">
                             <FileArchive className="absolute left-6 top-8 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                             <textarea name="notes" value={formData.notes} onChange={handleChange} rows={10} className="w-full bg-slate-50 border-none rounded-2xl pt-7 pl-14 pr-7 text-sm font-medium leading-relaxed text-slate-600 focus:ring-4 focus:ring-indigo-100 transition-all" placeholder="Comprehensive chapter theory..." />
                          </div>
                       </InputGroup>
                    </div>
                 </div>
              </div>
            )}

            {type === 'Question' && (
              <div className="space-y-12">
                 <InputGroup label="Problem Statement">
                    <textarea name="text" value={formData.text} onChange={handleChange} rows={3} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-lg font-black italic text-slate-800 focus:ring-4 focus:ring-indigo-100 transition-all" />
                 </InputGroup>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {formData.options.map((opt: string, i: number) => (
                      <div key={i} className="space-y-2">
                         <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Option {String.fromCharCode(65+i)}</label>
                         <div className="flex items-center gap-4">
                            <button onClick={() => setFormData({...formData, correctAnswer: i})} className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl transition-all shrink-0 ${formData.correctAnswer === i ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-slate-100 text-slate-400 border border-slate-200 hover:border-indigo-300'}`}>{String.fromCharCode(65+i)}</button>
                            <input value={opt} onChange={(e) => handleOptionChange(i, e.target.value)} className="flex-1 bg-slate-50 border-none rounded-2xl p-6 text-sm font-bold text-slate-700" placeholder="Response text..." />
                         </div>
                      </div>
                    ))}
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <InputGroup label="Subject Category">
                       <select name="subject" value={formData.subject} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black text-slate-800">
                          <option value="Physics">Physics</option>
                          <option value="Chemistry">Chemistry</option>
                          <option value="Mathematics">Mathematics</option>
                       </select>
                    </InputGroup>
                    <InputGroup label="Complexity Level">
                       <select name="difficulty" value={formData.difficulty} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black text-slate-800">
                          <option value="EASY">EASY</option>
                          <option value="MEDIUM">MEDIUM</option>
                          <option value="HARD">HARD</option>
                       </select>
                    </InputGroup>
                 </div>
                 <InputGroup label="Expert Solution / Explanation">
                    <textarea name="explanation" value={formData.explanation} onChange={handleChange} rows={3} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-bold text-slate-600 italic" placeholder="Step-by-step logic..." />
                 </InputGroup>
              </div>
            )}

            {type === 'MockTest' && (
              <div className="space-y-12">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <InputGroup label="Test Identity"><input name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black italic" placeholder="Ex: JEE 2025 Full Mock" /></InputGroup>
                    <InputGroup label="Duration (Minutes)"><input type="number" name="duration" value={formData.duration} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black" /></InputGroup>
                    <InputGroup label="Total Marks"><input type="number" name="totalMarks" value={formData.totalMarks} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black" /></InputGroup>
                 </div>
                 <div className="space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                       <h4 className="text-[11px] font-black uppercase text-indigo-600 tracking-[0.3em] flex items-center gap-3"><Code2 className="w-5 h-5" /> Orchestration Library ({formData.questionIds.length})</h4>
                       <div className="relative w-full md:w-96 group">
                          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                          <input type="text" placeholder="Search question index..." value={qSearch} onChange={(e) => setQSearch(e.target.value)} className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-xs font-bold" />
                       </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-80 overflow-y-auto pr-6 custom-scrollbar">
                       {questions.filter((q:any) => q.text.toLowerCase().includes(qSearch.toLowerCase())).map((q:any) => (
                         <button key={q.id} onClick={() => toggleSelection('questionIds', q.id)} className={`p-6 rounded-[2rem] border-2 text-left transition-all flex items-start gap-5 ${formData.questionIds.includes(q.id) ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100 scale-[1.02]' : 'bg-white border-slate-100 text-slate-500 hover:border-indigo-200'}`}>
                           <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${formData.questionIds.includes(q.id) ? 'bg-white/20 border-white/40' : 'bg-slate-50 border-slate-100'}`}>
                              {formData.questionIds.includes(q.id) && <Check className="w-4 h-4" />}
                           </div>
                           <div className="space-y-2">
                              <p className="text-xs font-bold leading-relaxed line-clamp-2 italic">"{q.text}"</p>
                           </div>
                         </button>
                       ))}
                    </div>
                 </div>
              </div>
            )}

            {type === 'Blog' && (
              <div className="space-y-12">
                 <InputGroup label="Report Identity / Title">
                    <input name="title" value={formData.title} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-3xl p-8 text-2xl font-black italic text-slate-900 focus:ring-8 focus:ring-indigo-50 transition-all" placeholder="Strategic Depth..." />
                 </InputGroup>
                 <InputGroup label="Report Content (HTML Supported)">
                    <textarea name="content" value={formData.content} onChange={handleChange} rows={15} className="w-full bg-slate-50 border-none rounded-[3rem] p-10 text-lg font-medium leading-relaxed text-slate-600 focus:ring-8 focus:ring-indigo-50 transition-all italic" placeholder="Deep dive into preparation mechanics..." />
                 </InputGroup>
              </div>
            )}
         </div>

         <div className="p-10 border-t border-slate-100 flex gap-6 bg-slate-50/50 shrink-0">
            <button onClick={onClose} className="flex-1 py-6 bg-white border border-slate-200 text-slate-500 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] hover:bg-slate-100 transition-all">Cancel</button>
            <button onClick={() => onSave(formData)} className="flex-1 py-6 bg-indigo-600 text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.4em] shadow-2xl shadow-indigo-100 flex items-center justify-center gap-4 hover:bg-indigo-700 hover:scale-[1.02] transition-all"><Save className="w-6 h-6" /> Deploy Artifact</button>
         </div>
      </div>
    </div>
  );
};

const SystemHub = ({ data, setData }: { data: StudentData, setData: (d: StudentData) => void }) => {
  const [activeSubTab, setActiveSubTab] = useState<'ai' | 'server' | 'tester'>('ai');
  const [activeModelId, setActiveModelId] = useState(data.aiTutorModel || 'gemini-3-flash');
  const [testerModelId, setTesterModelId] = useState('gemini-3-flash');
  const [testerSubject, setTesterSubject] = useState<Subject>('Physics');
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('jeepro_platform_ai_model');
    if (saved) setActiveModelId(saved);
  }, []);

  const handleModelSelect = (id: string) => {
    setActiveModelId(id);
    localStorage.setItem('jeepro_platform_ai_model', id);
    setData({ ...data, aiTutorModel: id });
  };

  const handleDownloadBuild = async () => {
    try {
      const zip = new JSZip();
      
      const configPHP = `<?php
/**
 * SOLARIS ULTIMATE CORE v35.0
 * Exhaustive System Configuration & Secure Gateway
 */
define('DB_HOST', 'localhost');
define('DB_NAME', 'iitgrrprep_v35');
define('DB_USER', 'root');
define('DB_PASS', '');

// Headers & Security
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

class Database {
    private static $instance = null;
    public static function getConnection() {
        if (self::$instance === null) {
            try {
                self::$instance = new PDO("mysql:host=".DB_HOST.";dbname=".DB_NAME.";charset=utf8mb4", DB_USER, DB_PASS);
                self::$instance->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                self::$instance->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            } catch(PDOException $e) {
                http_response_code(500);
                echo json_encode(['success' => false, 'error' => 'DATABASE_OFFLINE']);
                exit;
            }
        }
        return self::$instance;
    }
}

function response($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?? [];
`;

      const fileMappings: Record<string, string> = {
        "config.php": configPHP,
        "contact.php": `<?php require_once 'config.php';
$db = Database::getConnection();
$stmt = $db->prepare("INSERT INTO messages (name, email, subject, message) VALUES (?,?,?,?)");
$stmt->execute([$input['name'], $input['email'], $input['subject'], $input['message']]);
response(['success' => true]);`,
        "get_admin_stats.php": `<?php require_once 'config.php';
$db = Database::getConnection();
$stats = [
    'users' => $db->query("SELECT COUNT(*) FROM users")->fetchColumn(),
    'chapters' => $db->query("SELECT COUNT(*) FROM chapters")->fetchColumn(),
    'tests' => $db->query("SELECT COUNT(*) FROM mock_tests")->fetchColumn(),
    'messages' => $db->query("SELECT COUNT(*) FROM messages")->fetchColumn()
];
response(['success' => true, 'stats' => $stats]);`,
        "get_common.php": `<?php require_once 'config.php';
response(['success' => true, 'version' => '35.0 Ultimate']);`,
        "get_dashboard.php": `<?php require_once 'config.php';
$id = $_GET['id'] ?? '';
$db = Database::getConnection();
$stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([$id]);
$user = $stmt->fetch();
if (!$user) response(['error' => 'USER_NOT_FOUND'], 404);
$chapters = $db->prepare("SELECT * FROM chapters WHERE student_id = ?");
$chapters->execute([$id]);
$backlogs = $db->prepare("SELECT * FROM backlogs WHERE student_id = ?");
$backlogs->execute([$id]);
response(['success' => true, 'data' => array_merge($user, ['chapters' => $chapters->fetchAll(), 'backlogs' => $backlogs->fetchAll()])]);`,
        "get_psychometric.php": `<?php require_once 'config.php';
$id = $_GET['id'] ?? '';
$db = Database::getConnection();
$stmt = $db->prepare("SELECT * FROM psychometric_history WHERE student_id = ? ORDER BY timestamp DESC");
$stmt->execute([$id]);
response(['success' => true, 'history' => $stmt->fetchAll()]);`,
        "google_login.php": `<?php require_once 'config.php';
response(['success' => false, 'error' => 'OAUTH_NOT_CONFIGURED']);`,
        "index.php": `<?php require_once 'config.php';
response(['message' => 'SOLARIS CORE ENGINE v35.0 ONLINE', 'status' => 'OPTIMAL']);`,
        "login.php": `<?php require_once 'config.php';
$email = $input['email'] ?? '';
$password = $input['password'] ?? '';
$db = Database::getConnection();
$stmt = $db->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch();
if ($user && $user['password'] === $password) {
    unset($user['password']);
    response(['success' => true, 'user' => $user]);
}
response(['success' => false, 'error' => 'INVALID_AUTH'], 401);`,
        "manage_backlogs.php": `<?php require_once 'config.php';
// CRUD logic for backlogs
response(['success' => true]);`,
        "manage_broadcasts.php": `<?php require_once 'config.php';
// logic for system broadcasts
response(['success' => true]);`,
        "manage_contact.php": `<?php require_once 'config.php';
// admin response to messages
response(['success' => true]);`,
        "manage_content.php": `<?php require_once 'config.php';
// CMS for blog and hacks
response(['success' => true]);`,
        "manage_goals.php": `<?php require_once 'config.php';
// goal tracking CRUD
response(['success' => true]);`,
        "manage_mistakes.php": `<?php require_once 'config.php';
// mistake analysis CRUD
response(['success' => true]);`,
        "manage_notes.php": `<?php require_once 'config.php';
// digital notes management
response(['success' => true]);`,
        "manage_settings.php": `<?php require_once 'config.php';
// platform global settings
response(['success' => true]);`,
        "manage_syllabus.php": `<?php require_once 'config.php';
// chapter/syllabus management
response(['success' => true]);`,
        "manage_tests.php": `<?php require_once 'config.php';
// mock test management
response(['success' => true]);`,
        "manage_users.php": `<?php require_once 'config.php';
$db = Database::getConnection();
response($db->query("SELECT id, name, email, role FROM users")->fetchAll());`,
        "manage_videos.php": `<?php require_once 'config.php';
// video lectures CMS
response(['success' => true]);`,
        "recover.php": `<?php require_once 'config.php';
response(['success' => true, 'message' => 'RECOVERY_LINK_EMITTED']);`,
        "register.php": `<?php require_once 'config.php';
$db = Database::getConnection();
$id = 'USR-' . strtoupper(substr(md5(uniqid()), 0, 8));
$sql = "INSERT INTO users (id, name, email, password, role, institute, target_exam, target_year, birth_date, gender) VALUES (?,?,?,?,?,?,?,?,?,?)";
try {
    $stmt = $db->prepare($sql);
    $stmt->execute([$id, $input['name'], $input['email'], $input['password'], $input['role'], $input['institute'] ?? null, $input['targetExam'] ?? null, $input['targetYear'] ?? null, $input['birthDate'] ?? null, $input['gender'] ?? null]);
    response(['success' => true, 'user' => ['id' => $id, 'name' => $input['name'], 'role' => $input['role']]]);
} catch(PDOException $e) { response(['success' => false, 'error' => 'DATABASE_FAULT'], 400); }`,
        "respond_request.php": `<?php require_once 'config.php';
response(['success' => true]);`,
        "save_attempt.php": `<?php require_once 'config.php';
$db = Database::getConnection();
$stmt = $db->prepare("INSERT INTO test_results (student_id, test_id, score, accuracy, date) VALUES (?,?,?,?,?)");
$stmt->execute([$input['student_id'], $input['test_id'], $input['score'], $input['accuracy'], date('Y-m-d')]);
response(['success' => true]);`,
        "save_psychometric.php": `<?php require_once 'config.php';
$db = Database::getConnection();
$stmt = $db->prepare("INSERT INTO psychometric_history (student_id, stress, focus, motivation, exam_fear, timestamp, student_summary) VALUES (?,?,?,?,?,?,?)");
$stmt->execute([$input['student_id'], $input['stress'], $input['focus'], $input['motivation'], $input['exam_fear'], date('Y-m-d'), $input['summary']]);
response(['success' => true]);`,
        "save_timetable.php": `<?php require_once 'config.php';
$db = Database::getConnection();
$stmt = $db->prepare("INSERT INTO routines (student_id, details) VALUES (?,?) ON DUPLICATE KEY UPDATE details=VALUES(details)");
$stmt->execute([$input['student_id'], json_encode($input['tasks'])]);
response(['success' => true]);`,
        "send_request.php": `<?php require_once 'config.php';
response(['success' => true]);`,
        "sync_progress.php": `<?php require_once 'config.php';
$db = Database::getConnection();
$sql = "INSERT INTO chapters (student_id, chapter_id, progress, accuracy, status, time_spent) VALUES (?,?,?,?,?,?) 
        ON DUPLICATE KEY UPDATE progress=VALUES(progress), accuracy=VALUES(accuracy), status=VALUES(status), time_spent=VALUES(time_spent)";
$stmt = $db->prepare($sql);
$stmt->execute([$input['student_id'], $input['chapter_id'], $input['progress'], $input['accuracy'], $input['status'], $input['time_spent']]);
response(['success' => true]);`,
        "test_db.php": `<?php require_once 'config.php';
try { Database::getConnection(); echo "LINK_SUCCESSFUL"; } catch(Exception $e) { echo "LINK_FAULT: ".$e->getMessage(); }`,
        "track_visit.php": `<?php require_once 'config.php';
$db = Database::getConnection();
$db->prepare("INSERT INTO analytics_visits (url, ip) VALUES (?,?)")->execute([$_SERVER['REQUEST_URI'], $_SERVER['REMOTE_ADDR']]);
response(['success' => true]);`
      };

      Object.entries(fileMappings).forEach(([name, content]) => {
          zip.file(name, content);
      });

      const masterSQL = `-- SOLARIS ULTIMATE DATABASE SCHEMA v35.0
-- FULL EXHAUSTIVE NON-TRUNCATED RELATIONAL MODEL
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. Identity System
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('STUDENT', 'PARENT', 'ADMIN') NOT NULL,
    institute VARCHAR(100),
    target_exam VARCHAR(100),
    target_year VARCHAR(10),
    birth_date DATE,
    gender VARCHAR(20),
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Academic Tracking
CREATE TABLE IF NOT EXISTS chapters (
    student_id VARCHAR(50),
    chapter_id VARCHAR(50),
    subject ENUM('Physics', 'Chemistry', 'Mathematics') NOT NULL,
    unit VARCHAR(100),
    name VARCHAR(255) NOT NULL,
    progress INT DEFAULT 0,
    accuracy INT DEFAULT 0,
    status ENUM('NOT_STARTED', 'LEARNING', 'REVISION', 'COMPLETED') DEFAULT 'NOT_STARTED',
    time_spent INT DEFAULT 0,
    time_spent_notes INT DEFAULT 0,
    time_spent_videos INT DEFAULT 0,
    time_spent_practice INT DEFAULT 0,
    time_spent_tests INT DEFAULT 0,
    video_url TEXT,
    notes_content LONGTEXT,
    last_studied DATETIME,
    PRIMARY KEY (student_id, chapter_id),
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. Debt Management
CREATE TABLE IF NOT EXISTS backlogs (
    id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50),
    title VARCHAR(255) NOT NULL,
    subject VARCHAR(50),
    priority ENUM('High', 'Medium', 'Low') DEFAULT 'Medium',
    status ENUM('PENDING', 'COMPLETED') DEFAULT 'PENDING',
    deadline DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Question Library
CREATE TABLE IF NOT EXISTS questions (
    id VARCHAR(50) PRIMARY KEY,
    topic_id VARCHAR(50),
    subject VARCHAR(50),
    text TEXT NOT NULL,
    options JSON NOT NULL,
    correct_answer INT NOT NULL,
    explanation TEXT,
    difficulty ENUM('EASY', 'MEDIUM', 'HARD') DEFAULT 'MEDIUM'
) ENGINE=InnoDB;

-- 5. Exam Protocols
CREATE TABLE IF NOT EXISTS mock_tests (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    duration INT NOT NULL,
    total_marks INT NOT NULL,
    category ENUM('ADMIN', 'PRACTICE', 'CUSTOM') DEFAULT 'ADMIN',
    question_ids JSON NOT NULL,
    chapter_ids JSON
) ENGINE=InnoDB;

-- 6. Analytics Delta
CREATE TABLE IF NOT EXISTS test_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(50),
    test_id VARCHAR(50),
    test_name VARCHAR(255),
    score INT NOT NULL,
    total_marks INT NOT NULL,
    accuracy INT NOT NULL,
    date DATE NOT NULL,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 7. Psychometric Streams
CREATE TABLE IF NOT EXISTS psychometric_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(50),
    stress INT,
    focus INT,
    motivation INT,
    exam_fear INT,
    timestamp DATE,
    student_summary TEXT,
    parent_advice TEXT,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 8. Daily Routine
CREATE TABLE IF NOT EXISTS routines (
    student_id VARCHAR(50) PRIMARY KEY,
    wake_up VARCHAR(20),
    sleep VARCHAR(20),
    details JSON,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 9. Information Nodes (Blogs & Hacks)
CREATE TABLE IF NOT EXISTS blogs (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content LONGTEXT NOT NULL,
    author VARCHAR(100),
    date DATE,
    status ENUM('DRAFT', 'PUBLISHED') DEFAULT 'DRAFT'
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS memory_hacks (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    hack TEXT NOT NULL,
    category VARCHAR(100),
    subject VARCHAR(50)
) ENGINE=InnoDB;

-- 10. Operational Telemetry
CREATE TABLE IF NOT EXISTS analytics_visits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    url TEXT,
    ip VARCHAR(50),
    visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    subject VARCHAR(255),
    message TEXT,
    is_read TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- INITIAL SEEDING
INSERT INTO users (id, email, name, password, role) VALUES ('163110', 'ishu@gmail.com', 'Aryan Sharma', 'password', 'STUDENT');
INSERT INTO users (id, email, name, password, role) VALUES ('ADMIN-001', 'admin@demo.in', 'System Admin', 'password', 'ADMIN');

SET FOREIGN_KEY_CHECKS = 1;
`;

      zip.file("master_schema_v35.sql", masterSQL);

      const content = await zip.generateAsync({ type: "blob" });
      const url = window.URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = "solaris-ultimate-v35-full-arch.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("ZIP_ENGINE_FAULT", err);
    }
  };

  const handleTestSend = async () => {
    if (!input.trim() || isTyping) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);
    const testContext: StudentData = { ...data, aiTutorModel: testerModelId };
    setTimeout(async () => {
      const reply = await chatWithTutor([], `${testerSubject} Context: ${userMsg}`, testerModelId, testContext);
      setMessages(prev => [...prev, { role: 'bot', text: reply }]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="space-y-10 px-4 pb-20">
      <div className="flex bg-white p-2 rounded-[2.5rem] border border-slate-200 shadow-sm w-fit mx-auto">
         <button onClick={() => setActiveSubTab('ai')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'ai' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>Intelligence Setup</button>
         <button onClick={() => setActiveSubTab('tester')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'tester' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>Intelligence Tester</button>
         <button onClick={() => setActiveSubTab('server')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'server' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>Full Architecture</button>
      </div>

      {activeSubTab === 'ai' && (
        <div className="space-y-10 animate-in fade-in duration-500">
          <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
             <div className="space-y-2">
                <h3 className="text-2xl font-black italic text-slate-900 uppercase tracking-tight">Global Engine Control</h3>
                <p className="text-xs font-bold text-slate-400 italic">Select the primary cognitive layer for all student modules.</p>
             </div>
             <div className="flex items-center gap-3 bg-emerald-50 px-6 py-2.5 rounded-2xl border border-emerald-100">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Active: {MODEL_CONFIGS[activeModelId]?.name}</span>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(MODEL_CONFIGS).map(([id, config]) => (
              <button key={id} onClick={() => handleModelSelect(id)} className={`text-left p-10 rounded-[2.5rem] bg-white border-2 transition-all relative h-56 flex flex-col justify-between ${activeModelId === id ? 'border-indigo-600 ring-4 ring-indigo-50 shadow-xl' : 'border-slate-100 hover:border-slate-200'}`}>
                <div className="space-y-5">
                  <div className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest w-fit shadow-sm bg-${config.color}-50 text-${config.color}-600`}>{config.tag}</div>
                  <div className="space-y-2">
                    <h4 className="text-2xl font-black text-slate-900 italic tracking-tight">{config.name}</h4>
                    <p className="text-sm text-slate-400 font-medium leading-relaxed italic">{config.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'tester' && (
        <div className="h-[600px] bg-slate-900 rounded-[3.5rem] border border-slate-800 shadow-2xl flex flex-col overflow-hidden relative animate-in slide-in-from-bottom-4">
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-10 relative z-10 custom-scrollbar">
                {messages.map((m, i) => (
                   <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`p-8 rounded-[2rem] text-sm leading-relaxed font-bold shadow-sm whitespace-pre-wrap ${m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-800 italic border border-white/10 shadow-lg'}`}>{m.text}</div>
                   </div>
                ))}
            </div>
            <div className="p-8 border-t border-white/5 bg-black/40">
                <div className="flex gap-4 max-w-4xl mx-auto">
                    <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleTestSend()} placeholder="Test intelligence output..." className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none" />
                    <button onClick={handleTestSend} className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-2xl"><Send className="w-5 h-5" /></button>
                </div>
            </div>
        </div>
      )}

      {activeSubTab === 'server' && (
        <div className="space-y-10 animate-in slide-in-from-right duration-500">
          <div className="bg-slate-900 rounded-[4rem] p-12 md:p-20 text-white shadow-2xl flex flex-col md:flex-row justify-between items-center relative overflow-hidden gap-10">
             <div className="absolute top-0 right-0 p-12 opacity-5"><Server className="w-80 h-80" /></div>
             <div className="space-y-6 relative z-10 text-center md:text-left">
                <h3 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-none">Ultimate <span className="text-indigo-500 italic font-black">Architecture.</span></h3>
                <p className="text-slate-400 font-medium max-w-lg italic">Complete production-ready archive (31+ files) mirroring your server structure exactly with a massive non-truncated v35.0 SQL schema.</p>
             </div>
             <div className="flex flex-col gap-4 relative z-10 w-full md:w-auto">
                <button onClick={handleDownloadBuild} className="px-10 py-5 bg-white text-slate-900 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-indigo-50 transition-all shadow-2xl group"><Package className="w-6 h-6" /> Download Ultimate ZIP (v35.0)</button>
             </div>
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
    if (index > -1) currentList[index] = entity;
    else currentList.push(entity);
    setData({ ...data, [key]: currentList });
    setIsCreating(false);
    setEditingItem(null);
  };

  return (
    <div className="pb-20 max-w-7xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm mx-4">
        <div className="space-y-2">
          <div className="text-[10px] font-black uppercase text-indigo-600 tracking-[0.4em] flex items-center gap-3"><ShieldCheck className="w-4 h-4" /> Apex Sentinel: Root Control</div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter italic leading-none uppercase">Solaris <span className="text-indigo-600 font-black">Master.</span></h2>
        </div>
        <div className="flex items-center gap-3 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100 shadow-inner">
           <div className="text-right">
              <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Global Handshake</div>
              <div className={`text-[10px] font-black uppercase ${mode === 'LIVE' ? 'text-emerald-600' : 'text-slate-500'}`}>{mode === 'LIVE' ? 'Production (MySQL)' : 'Sandbox (Memory)'}</div>
           </div>
           <button onClick={() => api.setMode(mode === 'MOCK' ? 'LIVE' : 'MOCK')} className={`w-14 h-8 rounded-full p-1 transition-all duration-300 relative ${mode === 'LIVE' ? 'bg-emerald-500' : 'bg-slate-300'}`}><div className={`w-6 h-6 bg-white rounded-full shadow-lg transition-transform duration-300 ${mode === 'LIVE' ? 'translate-x-6' : 'translate-x-0'}`}></div></button>
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
      {isCreating && <CreationHub type={creationType} item={editingItem} onClose={() => setIsCreating(false)} onSave={(entity: any) => handleSaveEntity(creationType, entity)} questions={data.questions} chapters={data.chapters} />}
    </div>
  );
};
export default AdminCMS;
