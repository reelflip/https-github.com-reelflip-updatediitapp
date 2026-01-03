
import React, { useState, useEffect } from 'react';
import { StudentData, UserAccount, Subject, Question, MockTest, Chapter, Flashcard, MemoryHack, Blog, UserRole, ContactMessage } from '../types';
import { api } from '../services/apiService';
import { generateChapterNotes } from '../services/intelligenceService';
import JSZip from 'jszip';
import saveAs from 'file-saver';
import { 
  ShieldCheck, BookOpen, Layers, Zap, Loader2, Plus, Trash2, Edit3, X, Target, 
  Code2, Save, Users, PenTool, Check, HelpCircle, Video, Award, Type, Lightbulb, 
  Activity, Filter, Search, Clock, ChevronRight, Layout, List, FileText, Calendar, 
  Globe, Settings, Cpu, Database, Cloud, Download, Eye, AlertTriangle, Star, 
  RefreshCw, CheckCircle, ShieldAlert, Trash, Mail, Send, MessageSquare, Inbox,
  Sparkles
} from 'lucide-react';

interface AdminCMSProps {
  activeTab: string;
  data: StudentData;
  setData: (data: StudentData) => void;
}

// --- SUB-COMPONENTS ---

const InputGroup = ({ label, children }: any) => (
  <div className="space-y-3">
     <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-2">{label}</label>
     {children}
  </div>
);

const MessageDetailModal = ({ message, onClose }: { message: ContactMessage; onClose: () => void }) => (
  <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose}></div>
    <div className="bg-white w-full max-w-2xl rounded-[3.5rem] shadow-2xl relative z-10 animate-in zoom-in-95 overflow-hidden">
       <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-5">
             <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg"><Mail className="w-6 h-6" /></div>
             <div><h3 className="text-xl font-black italic tracking-tighter text-slate-900 uppercase">Incoming <span className="text-indigo-600">Payload.</span></h3><p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mt-1">Date: {message.date}</p></div>
          </div>
          <button onClick={onClose} className="p-3 bg-white text-slate-400 hover:text-slate-900 rounded-xl border border-slate-100"><X className="w-5 h-5" /></button>
       </div>
       <div className="p-12 space-y-10">
          <div className="grid grid-cols-2 gap-8">
             <div><div className="text-[8px] font-black uppercase text-slate-400 tracking-widest mb-1">Sender Entity</div><div className="font-bold text-slate-800">{message.name}</div></div>
             <div><div className="text-[8px] font-black uppercase text-slate-400 tracking-widest mb-1">Origin Node</div><div className="font-bold text-slate-800">{message.email}</div></div>
          </div>
          <div><div className="text-[8px] font-black uppercase text-slate-400 tracking-widest mb-1">Operational Objective</div><div className="text-lg font-black text-indigo-600 italic">"{message.subject}"</div></div>
          <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100"><p className="text-slate-600 font-medium leading-relaxed italic">"{message.message}"</p></div>
       </div>
       <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-3"><button onClick={onClose} className="px-8 py-3.5 bg-slate-900 text-white rounded-xl font-black text-[9px] uppercase tracking-widest">Acknowledge</button></div>
    </div>
  </div>
);

const CreationHub = ({ type, item, onClose, onSave, allQuestions = [], allChapters = [] }: any) => {
  const [formData, setFormData] = useState<any>(item || {
    id: item?.id || `ID-${Math.random().toString(36).substr(2, 9)}`,
    name: '', title: '', subject: 'Physics' as Subject, unit: '', text: '',
    options: ['', '', '', ''], correctAnswer: 0, difficulty: 'EASY',
    explanation: '', author: 'Platform Admin', content: '',
    date: new Date().toISOString().split('T')[0], status: 'PUBLISHED',
    progress: 0, accuracy: 0, timeSpent: 0,
    question: '', answer: '', category: 'Mnemonics', hack: '',
    duration: 180, totalMarks: 300, questionIds: [], chapterIds: [],
    notes: '', videoUrl: ''
  });

  const [isSeeding, setIsSeeding] = useState(false);

  const handleAutoSeed = async () => {
    if (!formData.name) return alert("Enter chapter name.");
    setIsSeeding(true);
    try {
      const content = await generateChapterNotes(formData.name, formData.subject, formData.unit);
      setFormData((prev: any) => ({ ...prev, notes: content }));
    } catch(e) { alert("Seed error."); } finally { setIsSeeding(false); }
  };

  const handleChange = (e: any) => {
    const { name, value, type: itype, checked } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: itype === 'checkbox' ? checked : value }));
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={onClose}></div>
      <div className="bg-white w-full max-w-6xl rounded-[4rem] shadow-2xl relative z-10 animate-in zoom-in-95 flex flex-col overflow-hidden max-h-[95vh]">
         <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-6">
               <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                  {type === 'Chapter' ? <BookOpen className="w-7 h-7" /> : type === 'MockTest' ? <Target className="w-7 h-7" /> : <HelpCircle className="w-7 h-7" />}
               </div>
               <div>
                  <h3 className="text-2xl font-black italic tracking-tighter text-slate-900 uppercase">{item ? 'Edit' : 'Deploy'} <span className="text-indigo-600">{type}.</span></h3>
                  <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mt-1">SQL Asset Management</p>
               </div>
            </div>
            <button onClick={onClose} className="p-4 bg-white text-slate-400 hover:text-slate-900 rounded-2xl border border-slate-100"><X className="w-6 h-6" /></button>
         </div>

         <div className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar">
            {type === 'Chapter' && (
              <div className="space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <InputGroup label="Chapter Name"><input name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black shadow-inner" placeholder="Ex: Optics" /></InputGroup>
                    <InputGroup label="Subject"><select name="subject" value={formData.subject} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black shadow-inner"><option value="Physics">Physics</option><option value="Chemistry">Chemistry</option><option value="Mathematics">Mathematics</option></select></InputGroup>
                    <InputGroup label="Unit Name"><input name="unit" value={formData.unit} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black shadow-inner" placeholder="Ex: Mechanics" /></InputGroup>
                    <InputGroup label="Video URL"><input name="videoUrl" value={formData.videoUrl} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black shadow-inner" placeholder="YouTube Embed Link" /></InputGroup>
                 </div>
                 <InputGroup label="Theory (HTML Core)">
                    <div className="space-y-4">
                       <button onClick={handleAutoSeed} disabled={isSeeding} className="bg-indigo-600/10 text-indigo-600 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-indigo-200">
                         {isSeeding ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />} Auto-Seed NCERT
                       </button>
                       <textarea name="notes" value={formData.notes} onChange={handleChange} rows={12} className="w-full bg-slate-50 border-none rounded-[2.5rem] p-8 text-sm font-mono shadow-inner" placeholder="Enter HTML structured content..." />
                    </div>
                 </InputGroup>
              </div>
            )}

            {type === 'Question' && (
               <div className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     <InputGroup label="Subject"><select name="subject" value={formData.subject} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black shadow-inner"><option value="Physics">Physics</option><option value="Chemistry">Chemistry</option><option value="Mathematics">Mathematics</option></select></InputGroup>
                     <InputGroup label="Difficulty"><select name="difficulty" value={formData.difficulty} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black shadow-inner"><option value="EASY">EASY</option><option value="MEDIUM">MEDIUM</option><option value="HARD">HARD</option></select></InputGroup>
                     <InputGroup label="Linked Chapter"><select name="topicId" value={formData.topicId} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black shadow-inner"><option value="">Select Unit</option>{allChapters.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></InputGroup>
                  </div>
                  <InputGroup label="MCQ Prompt Text"><textarea name="text" value={formData.text} onChange={handleChange} rows={4} className="w-full bg-slate-50 border-none rounded-3xl p-8 text-xl font-black italic shadow-inner" placeholder="Problem description..." /></InputGroup>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {formData.options.map((opt: string, i: number) => (
                       <div key={i} className="space-y-2">
                          <div className="flex justify-between items-center ml-2"><label className="text-[10px] font-black uppercase text-slate-400">Option {String.fromCharCode(65+i)}</label><button onClick={() => setFormData({...formData, correctAnswer: i})} className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase ${formData.correctAnswer === i ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>{formData.correctAnswer === i ? 'CORRECT' : 'SET CORRECT'}</button></div>
                          <input value={opt} onChange={(e) => { const newO = [...formData.options]; newO[i] = e.target.value; setFormData({...formData, options: newO}); }} className={`w-full p-5 rounded-2xl text-sm font-bold border-2 ${formData.correctAnswer === i ? 'border-emerald-500 bg-emerald-50/10' : 'bg-slate-50 border-transparent'}`} />
                       </div>
                     ))}
                  </div>
               </div>
            )}

            {type === 'MockTest' && (
              <div className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <InputGroup label="Exam Label"><input name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-xl font-black italic shadow-inner" /></InputGroup>
                   <div className="grid grid-cols-2 gap-4">
                      <InputGroup label="Duration (m)"><input name="duration" type="number" value={formData.duration} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black shadow-inner" /></InputGroup>
                      <InputGroup label="Marks"><input name="totalMarks" type="number" value={formData.totalMarks} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black shadow-inner" /></InputGroup>
                   </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <InputGroup label="Link Questions (Multiple)">
                      <div className="bg-slate-50 rounded-2xl p-4 max-h-60 overflow-y-auto border border-slate-200 space-y-2">
                         {allQuestions.map((q: any) => (
                           <label key={q.id} className="flex items-center gap-3 p-3 bg-white rounded-xl cursor-pointer hover:border-indigo-400 border border-transparent">
                              <input type="checkbox" checked={formData.questionIds.includes(q.id)} onChange={(e) => {
                                 const next = e.target.checked ? [...formData.questionIds, q.id] : formData.questionIds.filter((id: string) => id !== q.id);
                                 setFormData({...formData, questionIds: next});
                              }} className="w-4 h-4 rounded text-indigo-600" />
                              <span className="text-[10px] font-bold text-slate-600 truncate italic">{q.text}</span>
                           </label>
                         ))}
                      </div>
                   </InputGroup>
                </div>
              </div>
            )}
         </div>

         <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
            <button onClick={onClose} className="flex-1 py-5 bg-white border border-slate-200 text-slate-400 rounded-3xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-100 transition-all">Abort</button>
            <button onClick={() => onSave(formData)} className="flex-[2] py-5 bg-indigo-600 text-white rounded-3xl font-black uppercase text-[10px] tracking-[0.4em] shadow-xl hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-3"><Save className="w-5 h-5" /> Synchronize SQL Context</button>
         </div>
      </div>
    </div>
  );
};

// --- MAIN ADMIN COMPONENT ---

const AdminCMS: React.FC<AdminCMSProps> = ({ activeTab, data, setData }) => {
  const mode = api.getMode();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [creationType, setCreationType] = useState<string>('Question');
  const [userList, setUserList] = useState<UserAccount[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    if (activeTab === 'admin-users') loadUsers();
    else if (activeTab === 'admin-messages') loadMessages();
  }, [activeTab]);

  const loadUsers = async () => { setIsLoadingUsers(true); const users = await api.getAccounts(); setUserList(users || []); setIsLoadingUsers(false); };
  const loadMessages = async () => { setIsLoadingMessages(true); const msgs = await api.getMessages(); setData({ ...data, messages: msgs }); setIsLoadingMessages(false); };

  const handleEdit = (type: string, item: any) => { setCreationType(type); setEditingItem(item); setIsCreating(true); };

  const handleDelete = async (type: string, id: string) => {
    if (!confirm(`Purge this ${type}?`)) return;
    const keyMap: any = { 'Chapter': 'chapters', 'Question': 'questions', 'MockTest': 'mockTests', 'Flashcard': 'flashcards', 'MemoryHack': 'memoryHacks', 'Blog': 'blogs', 'Message': 'messages' };
    const key = keyMap[type];
    
    if (mode === 'LIVE' && type === 'Message') await api.markMessageRead(id); 
    if (key) setData({ ...data, [key]: (data[key] as any[]).filter((item: any) => item.id !== id) });
    if (type === 'User' && mode === 'LIVE') await fetch(`${api.getMode() === 'LIVE' ? './api/' : ''}manage_users.php?action=delete&id=${id}`);
    if (type === 'User') setUserList(prev => prev.filter(u => u.id !== id));
  };

  const handleSaveEntity = async (type: string, entity: any) => {
    if (mode === 'LIVE') { const res = await api.saveEntity(type, entity); if (!res.success) { alert(`Sync fail: ${res.error}`); return; } }
    const keyMap: any = { 'Chapter': 'chapters', 'Question': 'questions', 'MockTest': 'mockTests', 'Flashcard': 'flashcards', 'MemoryHack': 'memoryHacks', 'Blog': 'blogs' };
    const key = keyMap[type];
    const currentList = [...(data[key] as any[])];
    const index = currentList.findIndex(e => e.id === entity.id);
    if (index > -1) currentList[index] = entity; else currentList.push(entity);
    setData({ ...data, [key]: currentList });
    setIsCreating(false); setEditingItem(null);
  };

  const handleDownloadProduction = async () => {
    setIsDownloading(true);
    try {
      const zip = new JSZip();
      
      // Master SQL Schema
      zip.file("sql/master_schema_v21.sql", `-- IITGEEPREP Solaris v21.0 Production Schema
CREATE TABLE IF NOT EXISTS users (id VARCHAR(100) PRIMARY KEY, name VARCHAR(255), email VARCHAR(255) UNIQUE, role VARCHAR(50), institute VARCHAR(255), targetExam VARCHAR(255), targetYear INT, birthDate DATE, gender VARCHAR(20), password_hash VARCHAR(255), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS chapters (id VARCHAR(100) PRIMARY KEY, name VARCHAR(255), subject VARCHAR(50), unit VARCHAR(255), notes LONGTEXT, videoUrl VARCHAR(512));
CREATE TABLE IF NOT EXISTS student_progress (student_id VARCHAR(100), chapter_id VARCHAR(100), progress INT DEFAULT 0, accuracy INT DEFAULT 0, status VARCHAR(50), time_spent INT DEFAULT 0, PRIMARY KEY (student_id, chapter_id));
CREATE TABLE IF NOT EXISTS questions (id VARCHAR(100) PRIMARY KEY, topicId VARCHAR(100), text TEXT, options JSON, correctAnswer INT, difficulty VARCHAR(20), subject VARCHAR(50));
CREATE TABLE IF NOT EXISTS mock_tests (id VARCHAR(100) PRIMARY KEY, name VARCHAR(255), duration INT, totalMarks INT, category VARCHAR(50), difficulty VARCHAR(50), questionIds JSON, chapterIds JSON);
CREATE TABLE IF NOT EXISTS test_results (id INT AUTO_INCREMENT PRIMARY KEY, student_id VARCHAR(100), test_id VARCHAR(100), test_name VARCHAR(255), score INT, total_marks INT, accuracy INT, category VARCHAR(50), taken_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS messages (id VARCHAR(100) PRIMARY KEY, name VARCHAR(255), email VARCHAR(255), subject VARCHAR(255), message TEXT, date DATE, is_read BOOLEAN DEFAULT FALSE);
CREATE TABLE IF NOT EXISTS routines (student_id VARCHAR(100) PRIMARY KEY, routine_data JSON);
CREATE TABLE IF NOT EXISTS timetables (student_id VARCHAR(100) PRIMARY KEY, schedule JSON, roadmap JSON);
CREATE TABLE IF NOT EXISTS flashcards (id VARCHAR(100) PRIMARY KEY, question TEXT, answer TEXT, subject VARCHAR(50), difficulty VARCHAR(50), type VARCHAR(50));
CREATE TABLE IF NOT EXISTS memory_hacks (id VARCHAR(100) PRIMARY KEY, title VARCHAR(255), description TEXT, hack TEXT, category VARCHAR(50), subject VARCHAR(50));
CREATE TABLE IF NOT EXISTS blogs (id VARCHAR(100) PRIMARY KEY, title VARCHAR(255), content LONGTEXT, author VARCHAR(255), date DATE, status VARCHAR(50));`);

      // DB Config
      zip.file("config/database.php", `<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit(0); }
\$host = 'localhost'; \$db = 'iitjeeprep_v21'; \$user = 'root'; \$pass = '';
try { \$pdo = new PDO("mysql:host=\$host;dbname=\$db;charset=utf8mb4", \$user, \$pass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]); }
catch (PDOException \$e) { echo json_encode(['success' => false, 'error' => 'Handshake Failed']); exit; } ?>`);

      // Auth Login
      zip.file("auth_login.php", `<?php require_once 'config/database.php';
\$input = json_decode(file_get_contents('php://input'), true); 
\$email = strtolower(\$input['email'] ?? '');
// Priority Demo Logic
if (\$email == 'admin@demo.in') { echo json_encode(['success'=>true, 'user'=>['id'=>'USER-ADMIN', 'name'=>'Admin', 'email'=>'admin@demo.in', 'role'=>'ADMIN']]); exit; }
if (\$email == 'parent@demo.in') { echo json_encode(['success'=>true, 'user'=>['id'=>'USER-PARENT', 'name'=>'Parent', 'email'=>'parent@demo.in', 'role'=>'PARENT']]); exit; }

\$stmt = \$pdo->prepare("SELECT * FROM users WHERE email = ?"); 
\$stmt->execute([\$email]); 
\$user = \$stmt->fetch();
if (\$user && password_verify(\$input['password'] ?? '', \$user['password_hash'])) { 
    unset(\$user['password_hash']); 
    echo json_encode(['success'=>true, 'user'=>\$user]); 
} else { 
    echo json_encode(['success'=>false, 'error'=>'Authentication failure: Node mismatch.']); 
} ?>`);

      // Auth Register
      zip.file("auth_register.php", `<?php require_once 'config/database.php';
\$input = json_decode(file_get_contents('php://input'), true);
if (!isset(\$input['email']) || !isset(\$input['password'])) { echo json_encode(['success'=>false, 'error'=>'Missing payload']); exit; }
\$hash = password_hash(\$input['password'], PASSWORD_DEFAULT);
\$id = 'USER-' . substr(md5(strtolower(\$input['email'])), 0, 10);
try {
    \$stmt = \$pdo->prepare("INSERT INTO users (id, name, email, role, institute, targetExam, targetYear, birthDate, gender, password_hash) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    \$stmt->execute([\$id, \$input['name'], strtolower(\$input['email']), \$input['role'], \$input['institute'] ?? null, \$input['targetExam'] ?? null, \$input['targetYear'] ?? null, \$input['birthDate'] ?? null, \$input['gender'] ?? null, \$hash]);
    echo json_encode(['success'=>true, 'user'=>['id'=>\$id, 'name'=>\$input['name'], 'email'=>\$input['email'], 'role'=>\$input['role']]]);
} catch (Exception \$e) { echo json_encode(['success'=>false, 'error'=>'Node collision or SQL fault']); } ?>`);

      // Sync Progress
      zip.file("sync_progress.php", `<?php require_once 'config/database.php';
\$input = json_decode(file_get_contents('php://input'), true); 
\$studentId = \$input['student_id'] ?? null;
if (!\$studentId) { exit; }
try { 
    \$pdo->beginTransaction();
    if (isset(\$input['chapters'])) { 
        \$stmt = \$pdo->prepare("INSERT INTO student_progress (student_id, chapter_id, progress, accuracy, status, time_spent) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE progress=VALUES(progress), accuracy=VALUES(accuracy), status=VALUES(status), time_spent=VALUES(time_spent)");
        foreach (\$input['chapters'] as \$ch) { 
            \$stmt->execute([\$studentId, \$ch['id'], \$ch['progress'], \$ch['accuracy'], \$ch['status'], \$ch['timeSpent'] ?? 0]); 
        } 
    }
    if (isset(\$input['testHistory'])) { 
        \$pdo->prepare("DELETE FROM test_results WHERE student_id = ?")->execute([\$studentId]);
        \$st = \$pdo->prepare("INSERT INTO test_results (student_id, test_id, test_name, score, total_marks, accuracy, category) VALUES (?, ?, ?, ?, ?, ?, ?)");
        foreach (\$input['testHistory'] as \$t) { 
            \$st->execute([\$studentId, \$t['testId'], \$t['testName'], \$t['score'], \$t['totalMarks'], \$t['accuracy'], \$t['category'] ?? 'PRACTICE']); 
        } 
    }
    \$pdo->commit(); 
    echo json_encode(['success'=>true]); 
} catch(Exception \$e) { 
    \$pdo->rollBack(); 
    echo json_encode(['success'=>false, 'error' => \$e->getMessage()]); 
} ?>`);

      // Dashboard Fetcher
      zip.file("get_dashboard.php", `<?php require_once 'config/database.php';
\$id = \$_GET['id'] ?? null; if (!\$id) exit;
\$stmt = \$pdo->prepare("SELECT * FROM users WHERE id = ?"); \$stmt->execute([\$id]); \$u = \$stmt->fetch(); if (!\$u) exit;
\$sp = \$pdo->prepare("SELECT chapter_id as id, progress, accuracy, status, time_spent as timeSpent FROM student_progress WHERE student_id = ?"); \$sp->execute([\$id]); \$progress = \$sp->fetchAll();
\$st = \$pdo->prepare("SELECT test_id as testId, test_name as testName, score, total_marks as totalMarks, accuracy, category, taken_at as date FROM test_results WHERE student_id = ? ORDER BY taken_at DESC"); \$st->execute([\$id]); \$tests = \$st->fetchAll();
echo json_encode(['success'=>true, 'data'=>array_merge(\$u, ['individual_progress'=>\$progress, 'testHistory'=>\$tests])]); ?>`);

      // Manage Entity (CMS)
      zip.file("manage_entity.php", `<?php require_once 'config/database.php';
\$type = \$_GET['type'] ?? '';
\$input = json_decode(file_get_contents('php://input'), true);
if (!\$input) exit;
try {
    if (\$type === 'Chapter') {
        \$st = \$pdo->prepare("INSERT INTO chapters (id, name, subject, unit, notes, videoUrl) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=VALUES(name), subject=VALUES(subject), unit=VALUES(unit), notes=VALUES(notes), videoUrl=VALUES(videoUrl)");
        \$st->execute([\$input['id'], \$input['name'], \$input['subject'], \$input['unit'], \$input['notes'], \$input['videoUrl']]);
    } else if (\$type === 'Question') {
        \$st = \$pdo->prepare("INSERT INTO questions (id, topicId, text, options, correctAnswer, difficulty, subject) VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE text=VALUES(text), options=VALUES(options), correctAnswer=VALUES(correctAnswer), difficulty=VALUES(difficulty)");
        \$st->execute([\$input['id'], \$input['topicId'], \$input['text'], json_encode(\$input['options']), \$input['correctAnswer'], \$input['difficulty'], \$input['subject']]);
    } else if (\$type === 'MockTest') {
        \$st = \$pdo->prepare("INSERT INTO mock_tests (id, name, duration, totalMarks, category, difficulty, questionIds, chapterIds) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=VALUES(name), duration=VALUES(duration), totalMarks=VALUES(totalMarks), questionIds=VALUES(questionIds)");
        \$st->execute([\$input['id'], \$input['name'], \$input['duration'], \$input['totalMarks'], \$input['category'], \$input['difficulty'], json_encode(\$input['questionIds']), json_encode(\$input['chapterIds'])]);
    } else if (\$type === 'Message') {
        \$st = \$pdo->prepare("INSERT INTO messages (id, name, email, subject, message, date) VALUES (?, ?, ?, ?, ?, ?)");
        \$st->execute([\$input['id'], \$input['name'], \$input['email'], \$input['subject'], \$input['message'], \$input['date']]);
    }
    echo json_encode(['success'=>true]);
} catch (Exception \$e) { echo json_encode(['success'=>false, 'error' => \$e->getMessage()]); } ?>`);

      // Manage Users
      zip.file("manage_users.php", `<?php require_once 'config/database.php';
\$action = \$_GET['action'] ?? 'list';
\$id = \$_GET['id'] ?? '';
if (\$action === 'list') {
    \$stmt = \$pdo->query("SELECT id, name, email, role, created_at as createdAt FROM users");
    echo json_encode(['success'=>true, 'users'=>\$stmt->fetchAll()]);
} else if (\$action === 'delete') {
    \$pdo->prepare("DELETE FROM users WHERE id = ?")->execute([\$id]);
    echo json_encode(['success'=>true]);
} else if (\$action === 'update') {
    \$input = json_decode(file_get_contents('php://input'), true);
    \$pdo->prepare("UPDATE users SET name=?, institute=?, targetExam=?, targetYear=?, birthDate=?, gender=? WHERE id=?")
        ->execute([\$input['name'], \$input['institute'], \$input['targetExam'], \$input['targetYear'], \$input['birthDate'], \$input['gender'], \$id]);
    echo json_encode(['success'=>true]);
} ?>`);

      // Manage Messages
      zip.file("manage_messages.php", `<?php require_once 'config/database.php';
\$action = \$_GET['action'] ?? 'list';
if (\$action === 'list') {
    \$stmt = \$pdo->query("SELECT * FROM messages ORDER BY date DESC");
    echo json_encode(['success'=>true, 'messages'=>\$stmt->fetchAll()]);
} else if (\$action === 'read') {
    \$id = \$_GET['id'] ?? '';
    \$pdo->prepare("UPDATE messages SET is_read = 1 WHERE id = ?")->execute([\$id]);
    echo json_encode(['success'=>true]);
} ?>`);

      // Manage Routine
      zip.file("manage_routine.php", `<?php require_once 'config/database.php';
\$input = json_decode(file_get_contents('php://input'), true);
\$studentId = \$input['student_id'] ?? null;
if (!\$studentId) exit;
\$pdo->prepare("INSERT INTO routines (student_id, routine_data) VALUES (?, ?) ON DUPLICATE KEY UPDATE routine_data = VALUES(routine_data)")
    ->execute([\$studentId, json_encode(\$input['routine'])]);
echo json_encode(['success'=>true]); ?>`);

      // Manage Timetable
      zip.file("manage_timetable.php", `<?php require_once 'config/database.php';
\$input = json_decode(file_get_contents('php://input'), true);
\$studentId = \$input['student_id'] ?? null;
if (!\$studentId) exit;
\$pdo->prepare("INSERT INTO timetables (student_id, schedule, roadmap) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE schedule=VALUES(schedule), roadmap=VALUES(roadmap)")
    ->execute([\$studentId, json_encode(\$input['schedule']), json_encode(\$input['roadmap'])]);
echo json_encode(['success'=>true]); ?>`);

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "solaris_v21_full_api_stack.zip");
    } catch (e) { alert("ZIP creation failed."); } finally { setIsDownloading(false); }
  };

  return (
    <div className="pb-32 max-w-7xl mx-auto space-y-10 px-4">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-10 bg-white p-12 rounded-[3.5rem] border border-slate-200 shadow-sm">
        <div className="space-y-2 text-center lg:text-left"><h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic">Admin Dashboard</h2><p className="text-slate-400 font-bold uppercase text-[11px] tracking-widest">Master Management Node</p></div>
        <div className="flex items-center gap-6 bg-slate-50 p-6 rounded-3xl border border-slate-100">
           <div className="text-right">
              <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Core Status</div>
              <div className={`text-xs font-black uppercase tracking-widest ${mode === 'LIVE' ? 'text-emerald-500' : 'text-amber-500'}`}>{mode === 'LIVE' ? 'Production (Live)' : 'Sandbox Mode'}</div>
           </div>
           <button onClick={() => api.setMode(mode === 'MOCK' ? 'LIVE' : 'MOCK')} className={`w-14 h-8 rounded-full p-1 transition-all ${mode === 'LIVE' ? 'bg-emerald-500' : 'bg-slate-300'}`}><div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${mode === 'LIVE' ? 'translate-x-6' : 'translate-x-0'}`} /></button>
        </div>
      </div>

      <div className="space-y-12 animate-in fade-in duration-700">
        {activeTab === 'admin-overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
            {[ { label: 'Syllabus Units', val: data.chapters.length, icon: BookOpen, color: 'indigo' }, { label: 'Question Bank', val: data.questions.length, icon: Code2, color: 'emerald' }, { label: 'Exams Deployed', val: data.mockTests.length, icon: Target, color: 'rose' }, { label: 'Admin Inbox', val: data.messages?.length || 0, icon: Mail, color: 'amber' }].map((stat, i) => (
              <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <div className={`w-12 h-12 bg-${stat.color}-50 text-${stat.color}-600 rounded-2xl flex items-center justify-center mb-6`}><stat.icon className="w-6 h-6" /></div>
                <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{stat.label}</div>
                <div className="text-3xl font-black text-slate-800 tracking-tighter">{stat.val}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'admin-users' && (
           <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden mx-4">
             <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
               <h3 className="text-xl font-black italic text-slate-800 flex items-center gap-3"><Users className="w-6 h-6 text-indigo-600" /> Authorized Identities</h3>
               <button onClick={loadUsers} className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 shadow-sm transition-all"><RefreshCw className={`w-4 h-4 ${isLoadingUsers ? 'animate-spin' : ''}`} /></button>
             </div>
             <div className="overflow-x-auto"><table className="w-full text-left min-w-[800px]"><thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-widest"><tr><th className="p-6">Account</th><th className="p-6">Role</th><th className="p-6">Date</th><th className="p-6 text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-50">{userList.length === 0 ? (<tr><td colSpan={4} className="p-20 text-center text-slate-300 font-black uppercase text-[10px] tracking-widest italic">No identities in database.</td></tr>) : (userList.map(user => (<tr key={user.id} className="hover:bg-slate-50/50 transition-colors group"><td className="p-6"><div className="flex items-center gap-4"><div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black text-xs">{user.name[0]}</div><div><div className="text-sm font-bold text-slate-800">{user.name}</div><div className="text-[10px] font-medium text-slate-400">{user.email}</div></div></div></td><td className="p-6"><span className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase border ${user.role === UserRole.ADMIN ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>{user.role}</span></td><td className="p-6 text-xs font-bold text-slate-400 uppercase">{user.createdAt}</td><td className="p-6 text-right"><div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => handleDelete('User', user.id)} className="p-3 bg-white border border-slate-100 text-slate-400 rounded-xl hover:text-rose-600 shadow-sm"><Trash2 className="w-4 h-4" /></button></div></td></tr>)))}</tbody></table></div>
           </div>
        )}

        {activeTab === 'admin-messages' && (
           <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden mx-4">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                 <h3 className="text-xl font-black italic text-slate-800 flex items-center gap-3"><Inbox className="w-6 h-6 text-amber-500" /> Secure Messages</h3>
                 <button onClick={loadMessages} className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 shadow-sm transition-all"><RefreshCw className={`w-4 h-4 ${isLoadingMessages ? 'animate-spin' : ''}`} /></button>
              </div>
              <div className="divide-y divide-slate-50 max-h-[600px] overflow-y-auto">
                 {(!data.messages || data.messages.length === 0) ? (<div className="p-24 text-center space-y-4"><MessageSquare className="w-12 h-12 text-slate-100 mx-auto" /><p className="text-slate-300 font-black uppercase text-[10px] tracking-widest italic">Inbox Clear.</p></div>) : (data.messages.map(msg => (<div key={msg.id} onClick={() => setSelectedMessage(msg)} className={`p-8 flex items-center justify-between hover:bg-slate-50 transition-all cursor-pointer border-l-4 ${msg.isRead ? 'border-transparent' : 'border-indigo-600 bg-indigo-50/10'}`}><div className="flex items-center gap-6"><div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${msg.isRead ? 'bg-slate-50 text-slate-300' : 'bg-indigo-600 text-white shadow-lg'}`}>{msg.isRead ? <Mail className="w-5 h-5" /> : <Send className="w-5 h-5" />}</div><div><div className="flex items-center gap-3"><span className="text-sm font-black text-slate-800 italic">{msg.subject}</span>{!msg.isRead && <span className="px-2 py-0.5 bg-indigo-600 text-white text-[8px] font-black uppercase rounded-full tracking-widest">New</span>}</div><div className="text-[10px] font-bold text-slate-400 uppercase mt-1">{msg.name} ({msg.email})</div></div></div><div className="flex items-center gap-8"><div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{msg.date}</div></div></div>)))}
              </div>
           </div>
        )}
        
        {/* --- DYNAMIC ENTITY LISTS --- */}
        {activeTab === 'admin-syllabus' && <EntityList title="Unit Management" type="Chapter" data={data.chapters} icon={BookOpen} color="indigo" btnLabel="Add Unit" onEdit={handleEdit} onDelete={handleDelete} onNew={() => { setCreationType('Chapter'); setEditingItem(null); setIsCreating(true); }} />}
        {activeTab === 'admin-questions' && <EntityList title="MCQ Bank" type="Question" data={data.questions} icon={Code2} color="emerald" btnLabel="New MCQ" onEdit={handleEdit} onDelete={handleDelete} onNew={() => { setCreationType('Question'); setEditingItem(null); setIsCreating(true); }} />}
        {activeTab === 'admin-tests' && <EntityList title="Exam Center" type="MockTest" data={data.mockTests} icon={Target} color="rose" btnLabel="Deploy Exam" onEdit={handleEdit} onDelete={handleDelete} onNew={() => { setCreationType('MockTest'); setEditingItem(null); setIsCreating(true); }} />}
        {activeTab === 'admin-flashcards' && <EntityList title="Memory Cards" type="Flashcard" data={data.flashcards} icon={Layers} color="amber" btnLabel="Add Card" onEdit={handleEdit} onDelete={handleDelete} onNew={() => { setCreationType('Flashcard'); setEditingItem(null); setIsCreating(true); }} />}
        {activeTab === 'admin-hacks' && <EntityList title="Study Hacks" type="MemoryHack" data={data.memoryHacks} icon={Lightbulb} color="blue" btnLabel="Add Hack" onEdit={handleEdit} onDelete={handleDelete} onNew={() => { setCreationType('MemoryHack'); setEditingItem(null); setIsCreating(true); }} />}
        {activeTab === 'admin-blogs' && <EntityList title="Journal Manager" type="Blog" data={data.blogs} icon={PenTool} color="violet" btnLabel="New Article" onEdit={handleEdit} onDelete={handleDelete} onNew={() => { setCreationType('Blog'); setEditingItem(null); setIsCreating(true); }} />}

        {activeTab === 'admin-system' && (
           <div className="space-y-8 animate-in slide-in-from-bottom-4">
              <div className="bg-slate-900 p-12 rounded-[4rem] text-white shadow-2xl space-y-10 max-w-4xl mx-auto overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-8 opacity-5"><Database className="w-64 h-64" /></div>
                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                     <div className="space-y-4 md:text-left"><h3 className="text-3xl font-black italic tracking-tighter uppercase leading-none text-indigo-400">Environment Node</h3><p className="text-slate-400 text-sm max-w-md italic">Switch between local simulation (Sandbox) and Production SQL persistence.</p></div>
                     <div className="flex items-center gap-6 bg-white/5 p-8 rounded-[2.5rem] border border-white/10">
                        <div className="text-right"><div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">System Status</div><div className={`text-xs font-black uppercase tracking-widest ${mode === 'LIVE' ? 'text-emerald-400' : 'text-amber-400'}`}>{mode === 'LIVE' ? 'Production (Live)' : 'Sandbox Mode'}</div></div>
                        <button onClick={() => api.setMode(mode === 'MOCK' ? 'LIVE' : 'MOCK')} className={`w-16 h-9 rounded-full p-1.5 transition-all duration-500 relative shadow-inner ${mode === 'LIVE' ? 'bg-emerald-500' : 'bg-slate-700'}`}><div className={`w-6 h-6 bg-white rounded-full shadow-lg transition-transform duration-500 transform ${mode === 'LIVE' ? 'translate-x-7' : 'translate-x-0'}`}></div></button>
                     </div>
                  </div>
                  <div className="pt-10 border-t border-white/10 text-center"><button onClick={handleDownloadProduction} disabled={isDownloading} className="bg-indigo-600 px-12 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:scale-105 transition-all disabled:opacity-50 mx-auto">{isDownloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />} {isDownloading ? 'Building Bundle...' : 'Download Production ZIP'}</button></div>
              </div>
           </div>
        )}
      </div>

      {isCreating && (
        <CreationHub type={creationType} item={editingItem} onClose={() => { setIsCreating(false); setEditingItem(null); }} onSave={(entity: any) => handleSaveEntity(creationType, entity)} allQuestions={data.questions} allChapters={data.chapters} />
      )}

      {selectedMessage && (
        <MessageDetailModal message={selectedMessage} onClose={async () => {
            const updated = data.messages.map(m => m.id === selectedMessage.id ? { ...m, isRead: true } : m);
            setData({ ...data, messages: updated });
            if (mode === 'LIVE') await api.markMessageRead(selectedMessage.id);
            setSelectedMessage(null);
          }} 
        />
      )}
    </div>
  );
};

const EntityList = ({ title, type, data, icon: Icon, color, onEdit, onDelete, onNew, btnLabel = "Add Entry" }: any) => (
  <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden mx-4">
    <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/30">
       <h3 className="text-xl font-black italic text-slate-800 flex items-center gap-3"><Icon className={`w-6 h-6 text-${color}-600`} /> {title}</h3>
       {onNew && <button onClick={onNew} className={`bg-${color}-600 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-xl hover:scale-105 active:scale-95 transition-all`}><Plus className="w-4 h-4" /> {btnLabel}</button>}
    </div>
    <div className="divide-y divide-slate-50 max-h-[500px] overflow-y-auto custom-scrollbar">
      {!data || data.length === 0 ? (
        <div className="p-20 text-center text-slate-300 font-black uppercase text-[10px] tracking-widest italic">No records detected in SQL context.</div>
      ) : (
        data.map((item: any) => (
          <div key={item.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group">
             <div className="flex items-center gap-6">
                <div className={`w-10 h-10 bg-${color}-50 text-${color}-600 rounded-xl flex items-center justify-center shrink-0`}><Icon className="w-5 h-5" /></div>
                <div>
                   <div className="text-sm font-bold text-slate-800 italic tracking-tight line-clamp-1">{type === 'Question' ? item.text : item.title || item.name || item.question}</div>
                   <div className="text-[9px] font-black uppercase text-slate-400 mt-0.5 tracking-widest">{item.subject || item.category || 'System Asset'} • {item.id}</div>
                </div>
             </div>
             <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => onEdit(type, item)} className="p-3 bg-white border border-slate-100 text-slate-400 rounded-xl hover:text-indigo-600 shadow-sm"><Edit3 className="w-4 h-4" /></button>
                <button onClick={() => onDelete(type, item.id)} className="p-3 bg-white border border-slate-100 text-slate-400 rounded-xl hover:text-rose-600 shadow-sm"><Trash2 className="w-4 h-4" /></button>
             </div>
          </div>
        ))
      )}
    </div>
  </div>
);

export default AdminCMS;
