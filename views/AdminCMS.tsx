
import React, { useState, useEffect, useRef } from 'react';
import { StudentData, UserAccount, Subject, Question, MockTest, Chapter, Flashcard, MemoryHack, Blog, UserRole, ContactMessage } from '../types';
import { api } from '../services/apiService';
import { generateChapterNotes, generateBlogDraft } from '../services/intelligenceService';
import { INITIAL_STUDENT_DATA } from '../mockData';
import JSZip from 'jszip';
import saveAs from 'file-saver';
import { 
  ShieldCheck, BookOpen, Layers, Zap, Loader2, Plus, Trash2, Edit3, X, Target, 
  Code2, Save, Users, PenTool, Check, HelpCircle, Video, Award, Type, Lightbulb, 
  Activity, Filter, Search, Clock, ChevronRight, Layout, List, FileText, Calendar, 
  Globe, Settings, Cpu, Database, Cloud, Download, Eye, AlertTriangle, Star, 
  RefreshCw, CheckCircle, ShieldAlert, Trash, Mail, Send, MessageSquare, Inbox,
  Sparkles, Bold, Italic, Heading1, Heading2, ListIcon, LinkIcon, FileJson, Newspaper
} from 'lucide-react';

interface AdminCMSProps {
  activeTab: string;
  data: StudentData;
  setData: (data: StudentData) => void;
}

const KEY_MAP: Record<string, keyof StudentData> = {
  'Chapter': 'chapters',
  'Question': 'questions',
  'MockTest': 'mockTests',
  'Flashcard': 'flashcards',
  'MemoryHack': 'memoryHacks',
  'Blog': 'blogs',
  'Message': 'messages'
};

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
    notes: '', videoUrl: '', coverImage: ''
  });

  const [isSeeding, setIsSeeding] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const handleAutoSeed = async () => {
    if (type === 'Chapter') {
        if (!formData.name) return alert("Enter chapter name.");
        setIsSeeding(true);
        try {
          const content = await generateChapterNotes(formData.name, formData.subject, formData.unit);
          setFormData((prev: any) => ({ ...prev, notes: content }));
        } catch(e) { alert("Seed error."); } finally { setIsSeeding(false); }
    } else if (type === 'Blog') {
        if (!formData.title) return alert("Enter article title.");
        setIsSeeding(true);
        try {
          const content = await generateBlogDraft(formData.title);
          setFormData((prev: any) => ({ ...prev, content: content }));
        } catch(e) { alert("Draft error."); } finally { setIsSeeding(false); }
    }
  };

  const insertTag = (tag: string, closingTag?: string) => {
    if (!contentRef.current) return;
    const start = contentRef.current.selectionStart;
    const end = contentRef.current.selectionEnd;
    const text = contentRef.current.value;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);
    const selection = text.substring(start, end);
    const nextText = closingTag ? `${before}<${tag}>${selection}</${closingTag}>${after}` : `${before}<${tag}>${after}`;
    setFormData((prev: any) => ({ ...prev, [type === 'Chapter' ? 'notes' : 'content']: nextText }));
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
                  {type === 'Chapter' ? <BookOpen className="w-7 h-7" /> : type === 'MockTest' ? <Target className="w-7 h-7" /> : type === 'Blog' ? <Newspaper className="w-7 h-7" /> : <HelpCircle className="w-7 h-7" />}
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
                       <textarea ref={contentRef} name="notes" value={formData.notes} onChange={handleChange} rows={12} className="w-full bg-slate-50 border-none rounded-[2.5rem] p-8 text-sm font-mono shadow-inner" placeholder="Enter HTML structured content..." />
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
            {type === 'Blog' && (
               <div className="space-y-10">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                     <div className="lg:col-span-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <InputGroup label="Article Headline"><input name="title" value={formData.title} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-xl font-black italic shadow-inner" placeholder="Enter headline..." /></InputGroup>
                           <InputGroup label="Author Node"><input name="author" value={formData.author} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black shadow-inner" /></InputGroup>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                           <InputGroup label="Date"><input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black shadow-inner" /></InputGroup>
                           <InputGroup label="Status"><select name="status" value={formData.status} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black shadow-inner"><option value="PUBLISHED">Public</option><option value="DRAFT">Archive (Draft)</option></select></InputGroup>
                           <InputGroup label="Seed Content"><button onClick={handleAutoSeed} disabled={isSeeding} className="w-full py-5 bg-indigo-600/10 text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all">{isSeeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Sparkles className="w-4 h-4" /> AI Draft Article</>}</button></InputGroup>
                        </div>
                        <div className="space-y-4">
                           <div className="flex justify-between items-center">
                              <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-2">Content Canvas</label>
                              <div className="flex gap-2 p-1.5 bg-slate-50 rounded-xl border border-slate-100">
                                 <button onClick={() => insertTag('b', 'b')} className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-indigo-600 transition-all shadow-sm" title="Bold"><Bold className="w-4 h-4" /></button>
                                 <button onClick={() => insertTag('i', 'i')} className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-indigo-600 transition-all shadow-sm" title="Italic"><Italic className="w-4 h-4" /></button>
                                 <button onClick={() => insertTag('h2', 'h2')} className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-indigo-600 transition-all shadow-sm" title="Heading 1"><Heading1 className="w-4 h-4" /></button>
                                 <button onClick={() => insertTag('h3', 'h3')} className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-indigo-600 transition-all shadow-sm" title="Heading 2"><Heading2 className="w-4 h-4" /></button>
                                 <button onClick={() => insertTag('li', 'li')} className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-indigo-600 transition-all shadow-sm" title="List Item"><ListIcon className="w-4 h-4" /></button>
                                 <button onClick={() => insertTag('a href=""', 'a')} className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-indigo-600 transition-all shadow-sm" title="Link"><LinkIcon className="w-4 h-4" /></button>
                                 <div className="w-px bg-slate-200 mx-1"></div>
                                 <button onClick={() => setPreviewMode(!previewMode)} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${previewMode ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-indigo-600'}`}>{previewMode ? 'Editor' : 'Preview'}</button>
                              </div>
                           </div>
                           {previewMode ? (
                             <div className="w-full bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100 min-h-[400px] prose prose-indigo max-w-none prose-headings:font-black prose-p:text-slate-600 prose-strong:text-indigo-600" dangerouslySetInnerHTML={{ __html: formData.content || '<p class="text-slate-300 italic">No content rendered.</p>' }} />
                           ) : (
                             <textarea ref={contentRef} name="content" value={formData.content} onChange={handleChange} rows={16} className="w-full bg-slate-50 border-none rounded-[2.5rem] p-8 text-sm font-mono shadow-inner outline-none focus:ring-4 focus:ring-indigo-100 transition-all" placeholder="Enter HTML content..." />
                           )}
                        </div>
                     </div>
                     <div className="lg:col-span-4 space-y-8">
                        <div className="p-8 bg-indigo-50 border border-indigo-100 rounded-[2.5rem] space-y-6">
                           <div className="flex items-center gap-3 text-indigo-600"><Newspaper className="w-5 h-5" /><h4 className="text-sm font-black uppercase tracking-widest">Metadata</h4></div>
                           <InputGroup label="Cover URL (Static)"><input name="coverImage" value={formData.coverImage} onChange={handleChange} className="w-full bg-white border border-indigo-100 rounded-xl p-4 text-xs font-bold shadow-sm" placeholder="https://..." /></InputGroup>
                           <div className="bg-white/50 p-6 rounded-2xl border border-indigo-50"><p className="text-[10px] text-slate-500 font-medium italic">"Blogs marked as 'Public' will be instantly visible to all users across the platform."</p></div>
                        </div>
                        <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white space-y-4">
                           <h4 className="text-lg font-black italic text-indigo-400">Editorial Logic</h4>
                           <p className="text-xs text-slate-400 leading-relaxed">Ensure all technical terms are wrapped in <code>&lt;strong&gt;</code> tags for better indexing in the student search engine.</p>
                        </div>
                     </div>
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

  const loadUsers = async () => { 
    setIsLoadingUsers(true); 
    try {
      const users = await api.getAccounts(); 
      setUserList(users || []); 
    } catch (e) {
      console.error("Failed to load users", e);
    } finally {
      setIsLoadingUsers(false); 
    }
  };
  
  const loadMessages = async () => { setIsLoadingMessages(true); const msgs = await api.getMessages(); setData({ ...data, messages: msgs }); setIsLoadingMessages(false); };

  const handleEdit = (type: string, item: any) => { setCreationType(type); setEditingItem(item); setIsCreating(true); };

  const handleDelete = async (type: string, id: string) => {
    if (!confirm(`Purge this ${type}?`)) return;
    const key = KEY_MAP[type];
    if (mode === 'LIVE' && type === 'Message') await api.markMessageRead(id); 
    if (key && Array.isArray(data[key])) {
       const filtered = (data[key] as any[]).filter((item: any) => item.id !== id);
       setData({ ...data, [key]: filtered });
    }
    if (type === 'User' && mode === 'LIVE') await fetch(`${api.getMode() === 'LIVE' ? 'api/' : ''}manage_users.php?action=delete&id=${id}`);
    if (type === 'User') setUserList(prev => prev.filter(u => u.id !== id));
  };

  const handleSaveEntity = async (type: string, entity: any) => {
    if (mode === 'LIVE') { const res = await api.saveEntity(type, entity); if (!res.success) { alert(`Sync fail: ${res.error}`); return; } }
    const key = KEY_MAP[type];
    if (key && Array.isArray(data[key])) {
        const currentList = [...(data[key] as any[])];
        const index = currentList.findIndex(e => e.id === entity.id);
        if (index > -1) currentList[index] = entity; else currentList.push(entity);
        setData({ ...data, [key]: currentList });
    }
    setIsCreating(false); setEditingItem(null);
  };

  const handleDownloadProduction = async () => {
    setIsDownloading(true);
    try {
      const zip = new JSZip();
      
      // 1. FRESH COMPREHENSIVE SQL SCHEMA
      let sqlDump = `-- IITGEEPREP Solaris v22.0 Production Master Schema\n\n`;
      sqlDump += `SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";\nSTART TRANSACTION;\nSET time_zone = "+00:00";\n\n`;
      
      sqlDump += `-- IDENTITY MANAGEMENT\n`;
      sqlDump += `CREATE TABLE IF NOT EXISTS users (id VARCHAR(100) PRIMARY KEY, name VARCHAR(255), email VARCHAR(255) UNIQUE, role VARCHAR(50), institute VARCHAR(255), targetExam VARCHAR(255), targetYear INT, birthDate DATE, gender VARCHAR(20), password_hash VARCHAR(255), connected_parent JSON DEFAULT NULL, pending_invitations JSON DEFAULT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;
      
      sqlDump += `-- ACADEMIC CURRICULUM\n`;
      sqlDump += `CREATE TABLE IF NOT EXISTS chapters (id VARCHAR(100) PRIMARY KEY, name VARCHAR(255), subject VARCHAR(50), unit VARCHAR(255), notes LONGTEXT, videoUrl VARCHAR(512)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;
      
      sqlDump += `-- STUDENT PROGRESS LEDGER\n`;
      sqlDump += `CREATE TABLE IF NOT EXISTS student_progress (student_id VARCHAR(100), chapter_id VARCHAR(100), progress INT DEFAULT 0, accuracy INT DEFAULT 0, status VARCHAR(50), time_spent INT DEFAULT 0, time_spent_notes INT DEFAULT 0, time_spent_videos INT DEFAULT 0, time_spent_practice INT DEFAULT 0, time_spent_tests INT DEFAULT 0, PRIMARY KEY (student_id, chapter_id), FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;
      
      sqlDump += `-- STANDARDIZED QUESTIONS\n`;
      sqlDump += `CREATE TABLE IF NOT EXISTS questions (id VARCHAR(100) PRIMARY KEY, topicId VARCHAR(100), text TEXT, options JSON, correctAnswer INT, difficulty VARCHAR(20), subject VARCHAR(50)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;
      
      sqlDump += `-- MOCK EXAM CENTER\n`;
      sqlDump += `CREATE TABLE IF NOT EXISTS mock_tests (id VARCHAR(100) PRIMARY KEY, name VARCHAR(255), duration INT, totalMarks INT, category VARCHAR(50), difficulty VARCHAR(50), questionIds JSON, chapterIds JSON) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;
      
      sqlDump += `-- EXAMINATION LOGS\n`;
      sqlDump += `CREATE TABLE IF NOT EXISTS test_results (id INT AUTO_INCREMENT PRIMARY KEY, student_id VARCHAR(100), test_id VARCHAR(100), test_name VARCHAR(255), score INT, total_marks INT, accuracy INT, category VARCHAR(50), taken_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;
      
      sqlDump += `-- UPLINK COMMUNICATIONS\n`;
      sqlDump += `CREATE TABLE IF NOT EXISTS messages (id VARCHAR(100) PRIMARY KEY, name VARCHAR(255), email VARCHAR(255), subject VARCHAR(255), message TEXT, date DATE, is_read BOOLEAN DEFAULT FALSE) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;
      
      sqlDump += `-- STRATEGIC PLANNING\n`;
      sqlDump += `CREATE TABLE IF NOT EXISTS routines (student_id VARCHAR(100) PRIMARY KEY, routine_data JSON, FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n`;
      sqlDump += `CREATE TABLE IF NOT EXISTS timetables (student_id VARCHAR(100) PRIMARY KEY, schedule JSON, roadmap JSON, FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;
      
      sqlDump += `-- WELLNESS & PSYCHOMETRICS\n`;
      sqlDump += `CREATE TABLE IF NOT EXISTS wellness_metrics (id INT AUTO_INCREMENT PRIMARY KEY, student_id VARCHAR(100), stress INT, focus INT, motivation INT, exam_fear INT, summary TEXT, recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;

      INITIAL_STUDENT_DATA.chapters.forEach(ch => {
          const notesSafe = (ch.notes || '').replace(/'/g, "''").replace(/\\/g, "\\\\");
          sqlDump += `INSERT IGNORE INTO chapters (id, name, subject, unit, notes, videoUrl) VALUES ('${ch.id}', '${ch.name.replace(/'/g, "''")}', '${ch.subject}', '${ch.unit.replace(/'/g, "''")}', '${notesSafe}', '${ch.videoUrl || ''}');\n`;
      });
      sqlDump += `\nCOMMIT;`;
      zip.file("api/master_schema_v22.sql", sqlDump);

      // 2. FRESH FLAT PHP INFRASTRUCTURE
      zip.file("api/database.php", `<?php
session_start();
define('DB_HOST', 'localhost');
define('DB_NAME', 'iitjeeprep_v22');
define('DB_USER', 'root');   
define('DB_PASS', '');       

function getPDO() {
    try {
        \$pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4", DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
        return \$pdo;
    } catch (PDOException \$e) {
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'error' => 'Core Handshake Failed']);
        exit;
    }
}
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
if (\$_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);
?>`);

      zip.file("api/Response.php", `<?php
class Response {
    public static function json(\$data, \$code = 200) {
        http_response_code(\$code);
        header('Content-Type: application/json');
        echo json_encode(\$data);
        exit;
    }
    public static function error(\$message, \$code = 400) {
        self::json(['success' => false, 'error' => \$message], \$code);
    }
    public static function success(\$data = []) {
        self::json(array_merge(['success' => true], \$data));
    }
} ?>`);

      const endpoints = [
          { name: "auth_login.php", content: `<?php require_once 'database.php'; require_once 'Response.php'; \$input = json_decode(file_get_contents('php://input'), true); \$pdo = getPDO(); \$st = \$pdo->prepare("SELECT * FROM users WHERE email = ?"); \$st->execute([\$input['email']]); \$u = \$st->fetch(); if(\$u && password_verify(\$input['password'], \$u['password_hash'])) { \$_SESSION['user_id'] = \$u['id']; unset(\$u['password_hash']); Response::success(['user' => \$u]); } Response::error('Invalid Credentials'); ?>` },
          { name: "auth_register.php", content: `<?php require_once 'database.php'; require_once 'Response.php'; \$input = json_decode(file_get_contents('php://input'), true); \$pdo = getPDO(); \$hash = password_hash(\$input['password'], PASSWORD_DEFAULT); \$id = 'USER-'.substr(md5(strtolower(\$input['email'])), 0, 8); \$st = \$pdo->prepare("INSERT INTO users (id, name, email, role, password_hash) VALUES (?,?,?,?,?)"); \$st->execute([\$id, \$input['name'], strtolower(\$input['email']), \$input['role'], \$hash]); Response::success(['user' => ['id'=>\$id, 'role'=>\$input['role']]]); ?>` },
          { name: "get_dashboard.php", content: `<?php require_once 'database.php'; require_once 'Response.php'; \$id = \$_GET['id'] ?? ''; \$pdo = getPDO(); 
          \$u = \$pdo->prepare("SELECT * FROM users WHERE id = ?"); \$u->execute([\$id]); \$user = \$u->fetch(); 
          \$prog = \$pdo->prepare("SELECT chapter_id as id, progress, accuracy, status, time_spent as timeSpent, time_spent_notes as timeSpentNotes, time_spent_videos as timeSpentVideos, time_spent_practice as timeSpentPractice, time_spent_tests as timeSpentTests FROM student_progress WHERE student_id = ?"); \$prog->execute([\$id]);
          \$tests = \$pdo->prepare("SELECT test_id as testId, test_name as testName, score, total_marks as totalMarks, accuracy, category, DATE_FORMAT(taken_at, '%Y-%m-%d %H:%i:%s') as date FROM test_results WHERE student_id = ? ORDER BY taken_at DESC"); \$tests->execute([\$id]);
          Response::success(['data' => array_merge(\$user ?: [], ['individual_progress' => \$prog->fetchAll(), 'testHistory' => \$tests->fetchAll()])]); ?>` },
          { name: "sync_progress.php", content: `<?php require_once 'database.php'; require_once 'Response.php'; \$in = json_decode(file_get_contents('php://input'), true); \$pdo = getPDO(); 
          try {
            \$pdo->beginTransaction();
            foreach((\$in['chapters'] ?? []) as \$c) { 
              \$st = \$pdo->prepare("INSERT INTO student_progress (student_id, chapter_id, progress, accuracy, status, time_spent, time_spent_notes, time_spent_videos, time_spent_practice, time_spent_tests) VALUES (?,?,?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE progress=VALUES(progress), accuracy=VALUES(accuracy), status=VALUES(status), time_spent=VALUES(time_spent), time_spent_notes=VALUES(time_spent_notes), time_spent_videos=VALUES(time_spent_videos), time_spent_practice=VALUES(time_spent_practice), time_spent_tests=VALUES(time_spent_tests)"); 
              \$st->execute([\$in['student_id'], \$c['id'], \$c['progress'], \$c['accuracy'], \$c['status'], \$c['timeSpent'] ?? 0, \$c['timeSpentNotes'] ?? 0, \$c['timeSpentVideos'] ?? 0, \$c['timeSpentPractice'] ?? 0, \$c['timeSpentTests'] ?? 0]); 
            }
            foreach((\$in['testHistory'] ?? []) as \$t) {
              \$check = \$pdo->prepare("SELECT id FROM test_results WHERE student_id = ? AND test_id = ? AND taken_at = ?");
              \$check->execute([\$in['student_id'], \$t['testId'], \$t['date']]);
              if(!\$check->fetch()) {
                \$st = \$pdo->prepare("INSERT INTO test_results (student_id, test_id, test_name, score, total_marks, accuracy, category, taken_at) VALUES (?,?,?,?,?,?,?,?)");
                \$st->execute([\$in['student_id'], \$t['testId'], \$t['testName'], \$t['score'], \$t['totalMarks'], \$t['accuracy'], \$t['category'], \$t['date']]);
              }
            }
            \$pdo->commit();
            Response::success();
          } catch(Exception \$e) { \$pdo->rollBack(); Response::error(\$e->getMessage()); } ?>` },
          { name: "manage_users.php", content: `<?php require_once 'database.php'; require_once 'Response.php'; \$action = \$_GET['action'] ?? ''; \$pdo = getPDO(); if(\$action == 'list') Response::success(['users' => \$pdo->query("SELECT id, name, email, role FROM users")->fetchAll()]); ?>` },
          { name: "manage_messages.php", content: `<?php require_once 'database.php'; require_once 'Response.php'; \$pdo = getPDO(); Response::success(['messages' => \$pdo->query("SELECT * FROM messages")->fetchAll()]); ?>` },
          { name: "manage_entity.php", content: `<?php require_once 'database.php'; require_once 'Response.php'; \$type = \$_GET['type'] ?? ''; \$in = json_decode(file_get_contents('php://input'), true); \$pdo = getPDO(); if(\$type == 'Psychometric') { \$st = \$pdo->prepare("INSERT INTO wellness_metrics (student_id, stress, focus, motivation, exam_fear, summary) VALUES (?,?,?,?,?,?)"); \$st->execute([\$in['student_id'], \$in['stress'], \$in['focus'], \$in['motivation'], \$in['examFear'], \$in['studentSummary']]); } Response::success(['status' => 'acknowledged']); ?>` },
          { name: "manage_routine.php", content: `<?php require_once 'database.php'; require_once 'Response.php'; \$in = json_decode(file_get_contents('php://input'), true); \$pdo = getPDO(); \$st = \$pdo->prepare("INSERT INTO routines (student_id, routine_data) VALUES (?, ?) ON DUPLICATE KEY UPDATE routine_data = VALUES(routine_data)"); \$st->execute([\$in['student_id'], json_encode(\$in['routine'])]); Response::success(); ?>` },
          { name: "manage_timetable.php", content: `<?php require_once 'database.php'; require_once 'Response.php'; \$in = json_decode(file_get_contents('php://input'), true); \$pdo = getPDO(); \$st = \$pdo->prepare("INSERT INTO timetables (student_id, schedule, roadmap) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE schedule=VALUES(schedule), roadmap=VALUES(roadmap)"); \$st->execute([\$in['student_id'], json_encode(\$in['schedule']), json_encode(\$in['roadmap'])]); Response::success(); ?>` }
      ];

      endpoints.forEach(e => zip.file(`api/${e.name}`, e.content));
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "solaris_v22_CORE_SYNC_BUILD.zip");
    } catch (e) { alert("Bundle generation error."); } finally { setIsDownloading(false); }
  };

  return (
    <div className="pb-32 max-w-7xl mx-auto space-y-10 px-4">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-10 bg-white p-12 rounded-[3.5rem] border border-slate-200 shadow-sm">
        <div className="space-y-2 text-center lg:text-left"><h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic">Admin Dashboard</h2><p className="text-slate-400 font-bold uppercase text-[11px] tracking-widest">Master Management Node</p></div>
        <div className="flex items-center gap-6 bg-slate-50 p-6 rounded-3xl border border-slate-100">
           <div className="text-right">
              <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">System Status</div>
              <div className={`text-xs font-black uppercase tracking-widest ${mode === 'LIVE' ? 'text-emerald-500' : 'text-amber-500'}`}>{mode === 'LIVE' ? 'Production (Live)' : 'Sandbox Mode'}</div>
           </div>
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
             <div className="overflow-x-auto"><table className="w-full text-left min-w-[800px]"><thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-widest"><tr><th className="p-6">Account</th><th className="p-6">Role</th><th className="p-6">Date</th><th className="p-6 text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-50">{userList.length === 0 ? (<tr><td colSpan={4} className="p-20 text-center text-slate-300 font-black uppercase text-[10px] tracking-widest italic">No identities in database.</td></tr>) : (userList.map(user => (<tr key={user.id} className="hover:bg-slate-50/50 transition-colors group"><td className="p-6"><div className="flex items-center gap-4"><div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black text-xs">{user.name?.[0] || '?'}</div><div><div className="text-sm font-bold text-slate-800">{user.name || 'Unknown'}</div><div className="text-[10px] font-medium text-slate-400">{user.email}</div></div></div></td><td className="p-6"><span className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase border ${user.role === UserRole.ADMIN ? 'bg-rose-50 text-rose-600 border-rose-100' : user.role === UserRole.PARENT ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>{user.role}</span></td><td className="p-6 text-xs font-bold text-slate-400 uppercase">{user.createdAt || 'N/A'}</td><td className="p-6 text-right"><div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => handleDelete('User', user.id)} className="p-3 bg-white border border-slate-100 text-slate-400 rounded-xl hover:text-rose-600 shadow-sm"><Trash2 className="w-4 h-4" /></button></div></td></tr>)))}</tbody></table></div>
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
        
        {activeTab === 'admin-syllabus' && <EntityList title="Unit Management" type="Chapter" data={data.chapters} icon={BookOpen} color="indigo" btnLabel="Add Unit" onEdit={handleEdit} onDelete={handleDelete} onNew={() => { setCreationType('Chapter'); setEditingItem(null); setIsCreating(true); }} />}
        {activeTab === 'admin-questions' && <EntityList title="MCQ Bank" type="Question" data={data.questions} icon={Code2} color="emerald" btnLabel="New MCQ" onEdit={handleEdit} onDelete={handleDelete} onNew={() => { setCreationType('Question'); setEditingItem(null); setIsCreating(true); }} />}
        {activeTab === 'admin-tests' && <EntityList title="Exam Center" type="MockTest" data={data.mockTests} icon={Target} color="rose" btnLabel="Deploy Exam" onEdit={handleEdit} onDelete={handleDelete} onNew={() => { setCreationType('MockTest'); setEditingItem(null); setIsCreating(true); }} />}
        {activeTab === 'admin-flashcards' && <EntityList title="Memory Cards" type="Flashcard" data={data.flashcards} icon={Layers} color="amber" btnLabel="Add Card" onEdit={handleEdit} onDelete={handleDelete} onNew={() => { setCreationType('Flashcard'); setEditingItem(null); setIsCreating(true); }} />}
        {activeTab === 'admin-hacks' && <EntityList title="Study Hacks" type="MemoryHack" data={data.memoryHacks} icon={Lightbulb} color="blue" btnLabel="Add Hack" onEdit={handleEdit} onDelete={handleDelete} onNew={() => { setCreationType('MemoryHack'); setEditingItem(null); setIsCreating(true); }} />}
        {activeTab === 'admin-blogs' && <EntityList title="Journal Manager" type="Blog" data={data.blogs} icon={PenTool} color="violet" btnLabel="New Article" onEdit={handleEdit} onDelete={handleDelete} onNew={() => { setCreationType('Blog'); setEditingItem(null); setIsCreating(true); }} />}

        {activeTab === 'admin-system' && (
           <div className="space-y-10 animate-in slide-in-from-bottom-4">
              <div className="bg-slate-900 p-12 rounded-[4rem] text-white shadow-2xl space-y-10 max-w-4xl mx-auto overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-8 opacity-5"><Database className="w-64 h-64" /></div>
                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                     <div className="space-y-4 md:text-left"><h3 className="text-3xl font-black italic tracking-tighter uppercase leading-none text-indigo-400">Environment Node</h3><p className="text-slate-400 text-sm max-w-md italic">System mode is forced to LIVE on non-localhost domains for integrity.</p></div>
                     <div className="flex items-center gap-6 bg-white/5 p-8 rounded-[2.5rem] border border-white/10">
                        <div className="text-right"><div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">System Status</div><div className={`text-xs font-black uppercase tracking-widest ${mode === 'LIVE' ? 'text-emerald-400' : 'text-amber-400'}`}>{mode === 'LIVE' ? 'Production (Live)' : 'Sandbox Mode'}</div></div>
                     </div>
                  </div>
                  <div className="pt-10 border-t border-white/10 text-center"><button onClick={handleDownloadProduction} disabled={isDownloading} className="bg-indigo-600 px-12 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:scale-105 transition-all disabled:opacity-50 mx-auto">{isDownloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />} {isDownloading ? 'Finalizing Core...' : 'Download Fresh Deploy Bundle (ZIP)'}</button></div>
              </div>

              <div className="bg-white p-12 rounded-[4rem] border border-rose-200 shadow-xl max-w-4xl mx-auto space-y-8 animate-pulse">
                  <div className="flex items-center gap-6 text-rose-600">
                     <AlertTriangle className="w-12 h-12 shrink-0" />
                     <div>
                        <h3 className="text-2xl font-black italic tracking-tight uppercase">Fix Test Results Loading Issue</h3>
                        <p className="text-slate-500 font-medium italic">Your existing PHP backend is missing the logic to return test history.</p>
                     </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="p-8 bg-slate-50 rounded-3xl space-y-4 border border-slate-100">
                        <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-black text-xs">01</div>
                        <h4 className="font-black text-slate-800 uppercase text-xs tracking-widest">Refresh All PHP Files</h4>
                        <p className="text-xs text-slate-500 leading-relaxed italic">The ZIP above contains upgraded <b>sync_progress.php</b> and <b>get_dashboard.php</b>. Delete your old ones and upload these.</p>
                     </div>
                     <div className="p-8 bg-slate-50 rounded-3xl space-y-4 border border-slate-100">
                        <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-black text-xs">02</div>
                        <h4 className="font-black text-slate-800 uppercase text-xs tracking-widest">SQL Auto-Increment</h4>
                        <p className="text-xs text-slate-500 leading-relaxed italic">Ensure your <b>test_results</b> table has an 'id' column with <b>AUTO_INCREMENT</b>. The new SQL file handles this.</p>
                     </div>
                  </div>
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
