
import React, { useState, useEffect, useRef } from 'react';
import { StudentData, UserAccount, Subject, Question, MockTest, Chapter, Flashcard, MemoryHack, Blog, UserRole } from '../types';
import { api } from '../services/apiService';
import { MODEL_CONFIGS } from '../services/intelligenceService';
import JSZip from 'jszip';
import saveAs from 'file-saver';
import { 
  ShieldCheck, BookOpen, Layers, Zap, Loader2, Plus, Trash2, Edit3, X, Target, Code2, Save, Users, PenTool, Check, HelpCircle, Video, Award, Type, Lightbulb, Activity, Filter, Search, Clock, ChevronRight, Layout, List, FileText, Calendar, Globe, Settings, Cpu, Database, Cloud, Download, Eye, AlertTriangle, Star, Signal, SignalHigh, SignalLow, Activity as DiagnosticIcon, ClipboardCheck, RefreshCw, CheckCircle, ShieldAlert, FlaskConical, Map, HeartHandshake, Trash, Mail, Bell, Shield, FileBox, Heart, Bold, Italic, List as ListIcon, Heading1, Heading2, Link as LinkIcon, Maximize2, Minimize2, UserCircle
} from 'lucide-react';

interface AdminCMSProps {
  activeTab: string;
  data: StudentData;
  setData: (data: StudentData) => void;
}

// --- HELPER COMPONENTS ---

const InputGroup = ({ label, children }: any) => (
  <div className="space-y-3">
     <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-2">{label}</label>
     {children}
  </div>
);

const RichTextToolbar = ({ onInsert }: { onInsert: (tag: string, closeTag?: string) => void }) => (
  <div className="flex flex-wrap gap-2 p-3 bg-slate-900 rounded-2xl border border-white/10 mb-4">
    <button onClick={() => onInsert('<strong>', '</strong>')} className="p-2.5 hover:bg-white/10 rounded-lg text-white transition-colors" title="Bold"><Bold className="w-4 h-4" /></button>
    <button onClick={() => onInsert('<em>', '</em>')} className="p-2.5 hover:bg-white/10 rounded-lg text-white transition-colors" title="Italic"><Italic className="w-4 h-4" /></button>
    <div className="w-px h-6 bg-white/10 mx-1 self-center"></div>
    <button onClick={() => onInsert('<h2 class="text-3xl font-black italic tracking-tighter mt-12 mb-6 uppercase text-indigo-600">', '</h2>')} className="p-2.5 hover:bg-white/10 rounded-lg text-white transition-colors" title="Heading 2"><Heading1 className="w-4 h-4" /></button>
    <button onClick={() => onInsert('<h3 class="text-xl font-black italic tracking-tight mt-8 mb-4 uppercase text-slate-800">', '</h3>')} className="p-2.5 hover:bg-white/10 rounded-lg text-white transition-colors" title="Heading 3"><Heading2 className="w-4 h-4" /></button>
    <div className="w-px h-6 bg-white/10 mx-1 self-center"></div>
    <button onClick={() => onInsert('<ul class="list-disc pl-8 space-y-3 my-6"><li>', '</li></ul>')} className="p-2.5 hover:bg-white/10 rounded-lg text-white transition-colors" title="Unordered List"><ListIcon className="w-4 h-4" /></button>
    <button onClick={() => onInsert('<p class="text-slate-600 font-medium leading-relaxed mb-6">', '</p>')} className="p-2.5 hover:bg-white/10 rounded-lg text-white transition-colors" title="Paragraph"><Type className="w-4 h-4" /></button>
    <button onClick={() => onInsert('<a href="#" class="text-indigo-600 hover:underline">', '</a>')} className="p-2.5 hover:bg-white/10 rounded-lg text-white transition-colors" title="Link"><LinkIcon className="w-4 h-4" /></button>
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
    timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0,
    question: '', answer: '', category: 'Mnemonics', hack: '',
    duration: 180, totalMarks: 300, questionIds: [], chapterIds: [],
    notes: '', videoUrl: '', coverImage: '', targetCompletionDate: '', type: 'Formula',
    highYield: false
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertTag = (tag: string, closeTag: string = '') => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const text = el.value;
    const before = text.substring(0, start);
    const selected = text.substring(start, end);
    const after = text.substring(end);
    
    const newText = before + tag + (selected || '') + closeTag + after;
    const fieldName = type === 'Blog' ? 'content' : 'notes';
    setFormData((prev: any) => ({ ...prev, [fieldName]: newText }));
  };

  const handleChange = (e: any) => {
    const { name, value, type: inputType, checked } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: inputType === 'checkbox' ? checked : value }));
  };

  const handleOptionChange = (idx: number, val: string) => {
    const newOpts = [...formData.options];
    newOpts[idx] = val;
    setFormData((prev: any) => ({ ...prev, options: newOpts }));
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6">
      <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={onClose}></div>
      <div className={`bg-white w-full max-w-6xl rounded-[4rem] shadow-2xl relative z-10 animate-in zoom-in-95 flex flex-col overflow-hidden max-h-[95vh]`}>
         <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-6">
               <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                  {type === 'Chapter' ? <BookOpen className="w-7 h-7" /> : type === 'MockTest' ? <Target className="w-7 h-7" /> : type === 'Question' ? <HelpCircle className="w-7 h-7" /> : type === 'Blog' ? <PenTool className="w-7 h-7" /> : <Layers className="w-7 h-7" />}
               </div>
               <div>
                  <h3 className="text-2xl font-black italic tracking-tighter text-slate-900 uppercase">{item ? 'Edit' : 'Deploy'} <span className="text-indigo-600">{type}.</span></h3>
                  <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mt-1">Resource Management Terminal</p>
               </div>
            </div>
            <button onClick={onClose} className="p-4 bg-white text-slate-400 hover:text-slate-900 rounded-2xl border border-slate-100"><X className="w-6 h-6" /></button>
         </div>

         <div className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar">
            {type === 'Chapter' && (
              <div className="space-y-12 animate-in slide-in-from-bottom-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <InputGroup label="Chapter Name"><input name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black italic shadow-inner" placeholder="Ex: Electromagnetism" /></InputGroup>
                    <InputGroup label="Subject"><select name="subject" value={formData.subject} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black shadow-inner"><option value="Physics">Physics</option><option value="Chemistry">Chemistry</option><option value="Mathematics">Mathematics</option></select></InputGroup>
                    <InputGroup label="Unit Name"><input name="unit" value={formData.unit} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black italic shadow-inner" placeholder="Ex: Mechanics" /></InputGroup>
                    <InputGroup label="Lecture URL"><input name="videoUrl" value={formData.videoUrl} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black italic shadow-inner" placeholder="YouTube Embed URL" /></InputGroup>
                 </div>
                 <div className="space-y-4">
                    <RichTextToolbar onInsert={insertTag} />
                    <InputGroup label="Theory Notes (HTML Core Engine)">
                       <textarea ref={textareaRef} name="notes" value={formData.notes} onChange={handleChange} rows={15} className="w-full bg-slate-50 border-none rounded-[2.5rem] p-10 text-sm font-mono shadow-inner focus:ring-8 focus:ring-indigo-50/50 transition-all" placeholder="Enter structured HTML content..." />
                    </InputGroup>
                 </div>
              </div>
            )}

            {type === 'Question' && (
               <div className="space-y-10 animate-in slide-in-from-bottom-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                     <InputGroup label="Subject"><select name="subject" value={formData.subject} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black shadow-inner"><option value="Physics">Physics</option><option value="Chemistry">Chemistry</option><option value="Mathematics">Mathematics</option></select></InputGroup>
                     <InputGroup label="Difficulty"><select name="difficulty" value={formData.difficulty} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black shadow-inner"><option value="EASY">EASY</option><option value="MEDIUM">MEDIUM</option><option value="HARD">HARD</option></select></InputGroup>
                     <InputGroup label="Link Chapter"><select name="topicId" value={formData.topicId} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black shadow-inner"><option value="">Select Chapter</option>{allChapters.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></InputGroup>
                  </div>
                  <InputGroup label="Problem Text"><textarea name="text" value={formData.text} onChange={handleChange} rows={4} className="w-full bg-slate-50 border-none rounded-3xl p-8 text-xl font-black italic text-slate-800 shadow-inner" placeholder="Conceptual or Numerical problem..." /></InputGroup>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {formData.options.map((opt: string, i: number) => (
                       <div key={i} className="space-y-2">
                          <div className="flex justify-between items-center ml-2"><label className="text-[10px] font-black uppercase text-slate-400">Option {String.fromCharCode(65+i)}</label><button onClick={() => setFormData({...formData, correctAnswer: i})} className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${formData.correctAnswer === i ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>{formData.correctAnswer === i ? 'Correct' : 'Set Correct'}</button></div>
                          <input value={opt} onChange={(e) => handleOptionChange(i, e.target.value)} className={`w-full p-6 rounded-2xl text-sm font-bold border-2 ${formData.correctAnswer === i ? 'border-emerald-500 bg-emerald-50/10' : 'bg-slate-50 border-transparent shadow-inner'}`} />
                       </div>
                     ))}
                  </div>
               </div>
            )}

            {type === 'Flashcard' && (
              <div className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <InputGroup label="Subject"><select name="subject" value={formData.subject} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black shadow-inner"><option value="Physics">Physics</option><option value="Chemistry">Chemistry</option><option value="Mathematics">Mathematics</option></select></InputGroup>
                  <InputGroup label="Difficulty"><select name="difficulty" value={formData.difficulty} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black shadow-inner"><option value="EASY">EASY</option><option value="MEDIUM">MEDIUM</option><option value="HARD">HARD</option></select></InputGroup>
                  <InputGroup label="Card Type"><select name="type" value={formData.type} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black shadow-inner"><option value="Formula">Formula</option><option value="Concept">Concept</option><option value="Reaction">Reaction</option></select></InputGroup>
                </div>
                <InputGroup label="Question / Prompt"><textarea name="question" value={formData.question} onChange={handleChange} rows={3} className="w-full bg-slate-50 border-none rounded-3xl p-8 text-xl font-black italic text-slate-800 shadow-inner" placeholder="Ex: What is the escape velocity formula?" /></InputGroup>
                <InputGroup label="Answer / Resolution"><textarea name="answer" value={formData.answer} onChange={handleChange} rows={3} className="w-full bg-indigo-50/30 border-none rounded-3xl p-8 text-xl font-black italic text-indigo-600 shadow-inner" placeholder="Ex: v = √(2GM/R)" /></InputGroup>
              </div>
            )}

            {type === 'MemoryHack' && (
              <div className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <InputGroup label="Artifact Title"><input name="title" value={formData.title} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-xl font-black shadow-inner" placeholder="Ex: Periodic Table Trends" /></InputGroup>
                  <InputGroup label="Subject"><select name="subject" value={formData.subject} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black shadow-inner"><option value="Physics">Physics</option><option value="Chemistry">Chemistry</option><option value="Mathematics">Mathematics</option></select></InputGroup>
                </div>
                <InputGroup label="Description"><input name="description" value={formData.description} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-bold shadow-inner" placeholder="Detailed context of the mnemonic..." /></InputGroup>
                <InputGroup label="The Hack (Recall String)"><textarea name="hack" value={formData.hack} onChange={handleChange} rows={2} className="w-full bg-emerald-50/30 border-none rounded-3xl p-8 text-3xl font-black italic text-emerald-600 shadow-inner" placeholder="Ex: OIL RIG" /></InputGroup>
              </div>
            )}

            {type === 'MockTest' && (
              <div className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <InputGroup label="Exam Identity"><input name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-xl font-black italic shadow-inner" placeholder="Ex: JEE Main 2025 Mock v1" /></InputGroup>
                   <div className="grid grid-cols-2 gap-4">
                      <InputGroup label="Duration (m)"><input name="duration" type="number" value={formData.duration} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black shadow-inner" /></InputGroup>
                      <InputGroup label="Total Marks"><input name="totalMarks" type="number" value={formData.totalMarks} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black shadow-inner" /></InputGroup>
                   </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <InputGroup label="Link Questions">
                      <div className="bg-slate-50 rounded-2xl p-4 max-h-60 overflow-y-auto custom-scrollbar space-y-2 border border-slate-200">
                         {allQuestions.map((q: any) => (
                           <label key={q.id} className="flex items-center gap-3 p-3 bg-white rounded-xl cursor-pointer hover:border-indigo-400 border border-transparent transition-all">
                              <input type="checkbox" checked={formData.questionIds.includes(q.id)} onChange={(e) => {
                                 const next = e.target.checked ? [...formData.questionIds, q.id] : formData.questionIds.filter((id: string) => id !== q.id);
                                 setFormData({...formData, questionIds: next});
                              }} className="w-5 h-5 rounded text-indigo-600" />
                              <span className="text-[10px] font-bold text-slate-600 line-clamp-1 italic">{q.text}</span>
                           </label>
                         ))}
                      </div>
                   </InputGroup>
                   <InputGroup label="Related Chapters">
                      <div className="bg-slate-50 rounded-2xl p-4 max-h-60 overflow-y-auto custom-scrollbar space-y-2 border border-slate-200">
                         {allChapters.map((c: any) => (
                           <label key={c.id} className="flex items-center gap-3 p-3 bg-white rounded-xl cursor-pointer hover:border-indigo-400 border border-transparent transition-all">
                              <input type="checkbox" checked={formData.chapterIds.includes(c.id)} onChange={(e) => {
                                 const next = e.target.checked ? [...formData.chapterIds, c.id] : formData.chapterIds.filter((id: string) => id !== c.id);
                                 setFormData({...formData, chapterIds: next});
                              }} className="w-5 h-5 rounded text-indigo-600" />
                              <span className="text-[10px] font-bold text-slate-600 italic">{c.name}</span>
                           </label>
                         ))}
                      </div>
                   </InputGroup>
                </div>
              </div>
            )}

            {type === 'Blog' && (
              <div className="space-y-10 animate-in slide-in-from-bottom-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <InputGroup label="Article Title"><input name="title" value={formData.title} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-xl font-black italic shadow-inner" placeholder="Ex: Spaced Repetition Mastery" /></InputGroup>
                    <InputGroup label="Author Node"><input name="author" value={formData.author} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black italic shadow-inner" /></InputGroup>
                    <InputGroup label="Publish Date"><input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black italic shadow-inner" /></InputGroup>
                 </div>
                 <div className="space-y-4">
                    <RichTextToolbar onInsert={insertTag} />
                    <InputGroup label="Manuscript Content (HTML Enabled)">
                       <textarea ref={textareaRef} name="content" value={formData.content} onChange={handleChange} rows={15} className="w-full bg-slate-50 border-none rounded-[2.5rem] p-10 text-sm font-mono shadow-inner focus:ring-8 focus:ring-indigo-50/50 transition-all" placeholder="Enter strategic blog content..." />
                    </InputGroup>
                 </div>
              </div>
            )}
         </div>

         <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
            <button onClick={onClose} className="flex-1 py-5 bg-white border border-slate-200 text-slate-400 rounded-3xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-100">Abort</button>
            <button onClick={() => onSave(formData)} className="flex-[2] py-5 bg-indigo-600 text-white rounded-3xl font-black uppercase text-[10px] tracking-[0.4em] shadow-xl hover:bg-indigo-700 active:scale-95 transition-all"><Save className="w-5 h-5" /> Synchronize Context</button>
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

  useEffect(() => {
    if (activeTab === 'admin-users') {
        loadUsers();
    }
  }, [activeTab]);

  const loadUsers = async () => {
    setIsLoadingUsers(true);
    try {
        const users = await api.getAccounts();
        setUserList(users || []);
    } catch(e) { console.error("User Load Error", e); }
    setIsLoadingUsers(false);
  };

  const handleEdit = (type: string, item: any) => { setCreationType(type); setEditingItem(item); setIsCreating(true); };

  const handleDelete = (type: string, id: string) => {
    if (!confirm(`Purge this ${type} from the database?`)) return;
    const keyMap: Record<string, keyof StudentData> = {
      'Chapter': 'chapters', 'Question': 'questions', 'MockTest': 'mockTests', 
      'Flashcard': 'flashcards', 'MemoryHack': 'memoryHacks', 'Blog': 'blogs'
    };
    const key = keyMap[type];
    if (key) setData({ ...data, [key]: (data[key] as any[]).filter((item: any) => item.id !== id) });
    if (type === 'User') setUserList(prev => prev.filter(u => u.id !== id));
  };

  const handleSaveEntity = async (type: string, entity: any) => {
    const keyMap: Record<string, keyof StudentData> = {
      'Chapter': 'chapters', 'Question': 'questions', 'MockTest': 'mockTests', 
      'Flashcard': 'flashcards', 'MemoryHack': 'memoryHacks', 'Blog': 'blogs'
    };
    const key = keyMap[type];
    if (!key) return;
    
    if (mode === 'LIVE') {
        const result = await api.saveEntity(type, entity);
        if (!result.success) { alert(`Sync failure: ${result.error}`); return; }
    }

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
      
      // 1. SQL Schema - Comprehensive for v21.0
      const sqlSchema = `-- IITGEEPREP Solaris v21.0 Production Schema
CREATE TABLE IF NOT EXISTS users (id VARCHAR(100) PRIMARY KEY, name VARCHAR(255), email VARCHAR(255) UNIQUE, role VARCHAR(50), institute VARCHAR(255), targetExam VARCHAR(255), targetYear INT, password_hash VARCHAR(255), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS chapters (id VARCHAR(100) PRIMARY KEY, name VARCHAR(255), subject VARCHAR(50), unit VARCHAR(255), notes TEXT, videoUrl VARCHAR(512));
CREATE TABLE IF NOT EXISTS student_progress (student_id VARCHAR(100), chapter_id VARCHAR(100), progress INT DEFAULT 0, accuracy INT DEFAULT 0, status VARCHAR(50), time_spent INT DEFAULT 0, PRIMARY KEY (student_id, chapter_id));
CREATE TABLE IF NOT EXISTS questions (id VARCHAR(100) PRIMARY KEY, topicId VARCHAR(100), text TEXT, options JSON, correctAnswer INT, difficulty VARCHAR(20), subject VARCHAR(50));
CREATE TABLE IF NOT EXISTS mock_tests (id VARCHAR(100) PRIMARY KEY, name VARCHAR(255), duration INT, totalMarks INT, category VARCHAR(50), difficulty VARCHAR(50), questionIds JSON, chapterIds JSON);
CREATE TABLE IF NOT EXISTS flashcards (id VARCHAR(100) PRIMARY KEY, question TEXT, answer TEXT, subject VARCHAR(50), difficulty VARCHAR(20), type VARCHAR(50));
CREATE TABLE IF NOT EXISTS memory_hacks (id VARCHAR(100) PRIMARY KEY, title VARCHAR(255), description TEXT, hack TEXT, category VARCHAR(100), subject VARCHAR(50));
CREATE TABLE IF NOT EXISTS test_results (id INT AUTO_INCREMENT PRIMARY KEY, student_id VARCHAR(100), test_id VARCHAR(100), test_name VARCHAR(255), score INT, total_marks INT, accuracy INT, category VARCHAR(50), taken_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS psychometric (id INT AUTO_INCREMENT PRIMARY KEY, student_id VARCHAR(100), stress INT, focus INT, motivation INT, examFear INT, timestamp DATE, studentSummary TEXT, parentAdvice TEXT);
`;
      zip.file("sql/full_schema_v21.sql", sqlSchema);

      // 2. SEED DATA SQL
      const seedSql = `-- Core Academic Seed Data
INSERT INTO mock_tests (id, name, duration, totalMarks, category, difficulty, questionIds, chapterIds) VALUES 
('jee-main-2024', 'JEE Main 2024 Official', 180, 300, 'ADMIN', 'MAINS', '["q_24_1", "q_24_2"]', '["p-units", "m-sets"]');

INSERT INTO questions (id, topicId, text, options, correctAnswer, difficulty, subject) VALUES 
('q_24_1', 'p-units', 'A capacitor of 10 μF is charged to 50V. The energy stored is:', '["12.5 mJ", "25 mJ", "0.125 J", "1.25 J"]', 0, 'EASY', 'Physics');

INSERT INTO flashcards (id, question, answer, subject, difficulty, type) VALUES 
('fc-1', 'Dimensional formula of Planck''s Constant (h)', 'ML²T⁻¹', 'Physics', 'EASY', 'Formula'),
('fc-2', 'Ideal Gas Equation', 'PV = nRT', 'Chemistry', 'EASY', 'Formula');

INSERT INTO memory_hacks (id, title, description, hack, category, subject) VALUES 
('mh-1', 'Trigonometry Ratios', 'Sine, Cosine, Tangent basic formulas', 'SOH CAH TOA', 'Mnemonics', 'Mathematics');
`;
      zip.file("sql/seed_data_v21.sql", seedSql);

      // 3. Main Logic Endpoints
      zip.file("auth_login.php", `<?php
header('Content-Type: application/json');
include 'config/database.php';
$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'] ?? '';
$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);
if ($user) {
    echo json_encode(['success' => true, 'user' => $user]);
} else {
    echo json_encode(['success' => false, 'error' => 'User not found in system database.']);
}
?>`);

      zip.file("get_dashboard.php", `<?php
header('Content-Type: application/json');
include 'config/database.php';
$sid = $_GET['id'] ?? '';
if(!$sid) die(json_encode(['success' => false, 'error' => 'No ID']));

// 1. Fetch Student Progress
$stmt = $pdo->prepare("SELECT chapter_id as id, progress, accuracy, status, time_spent as timeSpent FROM student_progress WHERE student_id = ?");
$stmt->execute([$sid]);
$chapters = $stmt->fetchAll(PDO::FETCH_ASSOC);

// 2. Fetch Test History
$stmt = $pdo->prepare("SELECT test_id as testId, test_name as testName, score, total_marks as totalMarks, accuracy, category, taken_at as date FROM test_results WHERE student_id = ? ORDER BY taken_at DESC");
$stmt->execute([$sid]);
$history = $stmt->fetchAll(PDO::FETCH_ASSOC);

// 3. Fetch Global Data (Metadata)
$mockTests = $pdo->query("SELECT * FROM mock_tests")->fetchAll(PDO::FETCH_ASSOC);
$questions = $pdo->query("SELECT * FROM questions")->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    'success' => true, 
    'data' => [
        'chapters' => $chapters,
        'testHistory' => $history,
        'mockTests' => $mockTests,
        'questions' => $questions
    ]
]);
?>`);

      zip.file("manage_users.php", `<?php
header('Content-Type: application/json');
include 'config/database.php';

$action = $_GET['action'] ?? 'list';
if($action == 'list') {
    $stmt = $pdo->query("SELECT id, name, email, role, created_at as createdAt FROM users ORDER BY created_at DESC");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'users' => $users]);
} else if($action == 'delete') {
    $id = $_GET['id'] ?? '';
    $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(['success' => true]);
}
?>`);

      zip.file("sync_progress.php", `<?php
header('Content-Type: application/json');
include 'config/database.php';
$data = json_decode(file_get_contents('php://input'), true);
$sid = $data['student_id'] ?? '';
if(!$sid) die(json_encode(['success' => false, 'error' => 'No ID']));

// Sync Chapters
foreach(($data['chapters'] ?? []) as $ch) {
    $stmt = $pdo->prepare("INSERT INTO student_progress (student_id, chapter_id, progress, accuracy, status, time_spent) VALUES (?,?,?,?,?,?) ON DUPLICATE KEY UPDATE progress=?, accuracy=?, status=?, time_spent=?");
    $stmt->execute([$sid, $ch['id'], $ch['progress'], $ch['accuracy'], $ch['status'], $ch['timeSpent'], $ch['progress'], $ch['accuracy'], $ch['status'], $ch['timeSpent']]);
}

// Sync Results
foreach(($data['testHistory'] ?? []) as $res) {
    $stmt = $pdo->prepare("INSERT IGNORE INTO test_results (student_id, test_id, test_name, score, total_marks, accuracy, category, taken_at) VALUES (?,?,?,?,?,?,?,?)");
    $stmt->execute([$sid, $res['testId'], $res['testName'], $res['score'], $res['totalMarks'], $res['accuracy'], $res['category'], $res['date']]);
}

echo json_encode(['success' => true]);
?>`);

      zip.file("config/database.php", "<?php\n\$host = 'localhost';\n\$db = 'iitjeeprep_v21';\n\$user = 'root';\n\$pass = '';\n\$pdo = new PDO(\"mysql:host=\$host;dbname=\$db\", \$user, \$pass, [PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]); ?>");

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "iitjeeprep_production_suite_v21.zip");
    } catch (error) {
      console.error("ZIP Generation Failed", error);
      alert("System could not generate production bundle.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="pb-32 max-w-7xl mx-auto space-y-10 px-4">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-10 bg-white p-12 rounded-[3.5rem] border border-slate-200 shadow-sm">
        <div className="space-y-2 text-center lg:text-left">
           <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic">Admin Dashboard</h2>
           <p className="text-slate-400 font-bold uppercase text-[11px] tracking-widest">Master Control Node</p>
        </div>
      </div>

      <div className="space-y-12 animate-in fade-in duration-700">
        {activeTab === 'admin-overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
            {[
              { label: 'Chapters', val: data.chapters.length, icon: BookOpen, color: 'indigo' },
              { label: 'MCQs', val: data.questions.length, icon: Code2, color: 'emerald' },
              { label: 'Exams', val: data.mockTests.length, icon: Target, color: 'rose' },
              { label: 'Cards/Hacks', val: (data.flashcards?.length || 0) + (data.memoryHacks?.length || 0), icon: Zap, color: 'amber' },
            ].map((stat, i) => (
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
               <h3 className="text-xl font-black italic text-slate-800 flex items-center gap-3"><Users className="w-6 h-6 text-indigo-600" /> Identity Management</h3>
               <button onClick={loadUsers} className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 shadow-sm transition-all"><RefreshCw className={`w-4 h-4 ${isLoadingUsers ? 'animate-spin' : ''}`} /></button>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[800px]">
                   <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                      <tr>
                        <th className="p-6">Account Identity</th>
                        <th className="p-6">Access Role</th>
                        <th className="p-6">Registered On</th>
                        <th className="p-6 text-right">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {userList.length === 0 ? (
                        <tr><td colSpan={4} className="p-20 text-center text-slate-300 font-black uppercase text-[10px] tracking-widest italic">No authorized identities detected.</td></tr>
                      ) : (
                        userList.map(user => (
                          <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="p-6">
                               <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black text-xs uppercase shadow-inner">{user.name[0]}</div>
                                  <div>
                                     <div className="text-sm font-bold text-slate-800">{user.name}</div>
                                     <div className="text-[10px] font-medium text-slate-400">{user.email}</div>
                                  </div>
                               </div>
                            </td>
                            <td className="p-6">
                               <span className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase border ${user.role === UserRole.ADMIN ? 'bg-rose-50 text-rose-600 border-rose-100' : user.role === UserRole.PARENT ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                                  {user.role}
                               </span>
                            </td>
                            <td className="p-6 text-xs font-bold text-slate-400 uppercase tracking-tight">{user.createdAt || 'Pre-System Epoch'}</td>
                            <td className="p-6 text-right">
                               <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button className="p-3 bg-white border border-slate-100 text-slate-400 rounded-xl hover:text-indigo-600 shadow-sm"><Edit3 className="w-4 h-4" /></button>
                                  <button onClick={() => handleDelete('User', user.id)} className="p-3 bg-white border border-slate-100 text-slate-400 rounded-xl hover:text-rose-600 shadow-sm"><Trash2 className="w-4 h-4" /></button>
                               </div>
                            </td>
                          </tr>
                        ))
                      )}
                   </tbody>
                </table>
             </div>
           </div>
        )}
        
        {activeTab === 'admin-syllabus' && <EntityList title="Syllabus Architect" type="Chapter" data={data.chapters} icon={BookOpen} color="indigo" btnLabel="Add Chapter" onEdit={handleEdit} onDelete={handleDelete} onNew={() => { setCreationType('Chapter'); setEditingItem(null); setIsCreating(true); }} />}
        {activeTab === 'admin-questions' && <EntityList title="MCQ Bank" type="Question" data={data.questions} icon={Code2} color="emerald" btnLabel="New MCQ" onEdit={handleEdit} onDelete={handleDelete} onNew={() => { setCreationType('Question'); setEditingItem(null); setIsCreating(true); }} />}
        {activeTab === 'admin-tests' && <EntityList title="Mock Exam Library" type="MockTest" data={data.mockTests} icon={Target} color="rose" btnLabel="Deploy Exam" onEdit={handleEdit} onDelete={handleDelete} onNew={() => { setCreationType('MockTest'); setEditingItem(null); setIsCreating(true); }} />}
        {activeTab === 'admin-flashcards' && <EntityList title="Card Manager" type="Flashcard" data={data.flashcards || []} icon={Layers} color="indigo" btnLabel="New Card" onEdit={handleEdit} onDelete={handleDelete} onNew={() => { setCreationType('Flashcard'); setEditingItem(null); setIsCreating(true); }} />}
        {activeTab === 'admin-hacks' && <EntityList title="Hack Manager" type="MemoryHack" data={data.memoryHacks || []} icon={Lightbulb} color="amber" btnLabel="Deploy Hack" onEdit={handleEdit} onDelete={handleDelete} onNew={() => { setCreationType('MemoryHack'); setEditingItem(null); setIsCreating(true); }} />}
        {activeTab === 'admin-blogs' && <EntityList title="Strategy Feed" type="Blog" data={data.blogs} icon={PenTool} color="indigo" btnLabel="Draft Post" onEdit={handleEdit} onDelete={handleDelete} onNew={() => { setCreationType('Blog'); setEditingItem(null); setIsCreating(true); }} />}

        {activeTab === 'admin-system' && (
           <div className="space-y-8 animate-in slide-in-from-bottom-4">
              <div className="bg-slate-900 p-12 rounded-[4rem] text-white shadow-2xl space-y-10 max-w-4xl mx-auto overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-8 opacity-5"><Database className="w-64 h-64" /></div>
                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                     <div className="space-y-4 text-center md:text-left">
                        <h3 className="text-3xl font-black italic tracking-tighter uppercase leading-none">Persistence Gateway</h3>
                        <p className="text-slate-400 text-sm max-w-md">Switch environment to Production for live SQL synchronization or use Sandbox for local testing.</p>
                     </div>
                     <div className="flex items-center gap-6 bg-white/5 p-8 rounded-[2.5rem] border border-white/10">
                        <div className="text-right">
                           <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Global Status</div>
                           <div className={`text-xs font-black uppercase tracking-widest ${mode === 'LIVE' ? 'text-emerald-400' : 'text-amber-400'}`}>{mode === 'LIVE' ? 'Production (SQL)' : 'Sandbox Mode'}</div>
                        </div>
                        <button onClick={() => api.setMode(mode === 'MOCK' ? 'LIVE' : 'MOCK')} className={`w-16 h-9 rounded-full p-1.5 transition-all duration-500 relative shadow-inner ${mode === 'LIVE' ? 'bg-emerald-500' : 'bg-slate-700'}`}><div className={`w-6 h-6 bg-white rounded-full shadow-lg transition-transform duration-500 transform ${mode === 'LIVE' ? 'translate-x-7' : 'translate-x-0'}`}></div></button>
                     </div>
                  </div>
                  
                  <div className="pt-10 border-t border-white/10 text-center">
                      <button 
                        onClick={handleDownloadProduction}
                        disabled={isDownloading}
                        className="bg-indigo-600 w-full md:w-auto px-12 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:scale-105 transition-all mx-auto disabled:opacity-50"
                      >
                        {isDownloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />} 
                        {isDownloading ? 'Building Payload...' : 'Download Production ZIP'}
                      </button>
                  </div>
              </div>
           </div>
        )}
      </div>

      {isCreating && (
        <CreationHub 
          type={creationType} 
          item={editingItem} 
          onClose={() => { setIsCreating(false); setEditingItem(null); }} 
          onSave={(entity: any) => handleSaveEntity(creationType, entity)} 
          allQuestions={data.questions} 
          allChapters={data.chapters} 
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
        <div className="p-20 text-center text-slate-300 font-black uppercase text-[10px] tracking-widest italic">No records detected.</div>
      ) : (
        data.map((item: any) => (
          <div key={item.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group">
             <div className="flex items-center gap-6">
                <div className={`w-10 h-10 bg-${color}-50 text-${color}-600 rounded-xl flex items-center justify-center shrink-0`}><Icon className="w-5 h-5" /></div>
                <div>
                   <div className="text-sm font-bold text-slate-800 italic tracking-tight">{type === 'Question' ? item.text : item.title || item.name || item.question}</div>
                   <div className="text-[9px] font-black uppercase text-slate-400 mt-0.5 tracking-widest">{item.subject || item.category || 'System Node'}</div>
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
