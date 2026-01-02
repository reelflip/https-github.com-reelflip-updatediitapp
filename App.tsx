
import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { 
  LayoutDashboard, BookOpen, Bot, FileText, Menu, Settings, Loader2, 
  Search, UserCircle, Bell, Layout, List, Calendar, Globe, Eye, 
  AlertTriangle, Star, Signal, SignalHigh, SignalLow, ClipboardCheck, 
  RefreshCw, CheckCircle, ShieldAlert, FlaskConical, Map, HeartHandshake, 
  Trash, Mail, Shield, FileBox, Heart, Activity, ArrowRight, Zap, 
  TrendingUp, Target, Brain, Timer, ChevronRight, ChevronLeft, 
  Award, ListFilter, X, Play, Clock, Edit2, Edit3, Plus, Trash2, 
  Save, Users, PenTool, Check, HelpCircle, Video, Type, Lightbulb, 
  CheckCircle2, Fingerprint, Coffee, Sun, Moon, GraduationCap, 
  Flag, CalendarDays, ArrowUpRight, Share2, Bookmark, Newspaper, 
  MapPin, Terminal, MonitorCheck, Briefcase, Info, KeyRound, EyeOff, 
  ShieldCheck, Box, Bold, Italic, List as ListIcon, Heading1, Heading2, 
  Link as LinkIcon, Maximize2, Minimize2, Send, Pause, Volume2, 
  VolumeX, Music, History, Sun as SunIcon, Trophy, Activity as ActivityIcon, 
  User as UserIcon, Tag, Gauge, Compass, Thermometer, Flame,
  // Added missing icons ArrowLeft and Download
  ArrowLeft, Download
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, AreaChart, Area, PieChart, Pie, Radar, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Legend, ComposedChart, Line
} from 'recharts';
import { GoogleGenAI } from "@google/genai";
import JSZip from 'jszip';
import saveAs from 'file-saver';

// --- TYPES & INTERFACES ---

export enum UserRole { STUDENT = 'STUDENT', PARENT = 'PARENT', ADMIN = 'ADMIN' }
export type Subject = 'Physics' | 'Chemistry' | 'Mathematics';
export type ChapterStatus = 'NOT_STARTED' | 'LEARNING' | 'REVISION' | 'COMPLETED';

export interface Chapter {
  id: string; subject: Subject; unit: string; name: string; progress: number; 
  accuracy: number; timeSpent: number; timeSpentNotes: number; timeSpentVideos: number; 
  timeSpentPractice: number; timeSpentTests: number; status: ChapterStatus; 
  lastStudied?: string; notes?: string; videoUrl?: string; targetCompletionDate?: string;
  highYield?: boolean;
}

export interface Question {
  id: string; topicId: string; subject: string; text: string; options: string[]; 
  correctAnswer: number; explanation: string; difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

export interface MockTest {
  id: string; name: string; duration: number; totalMarks: number; category: string; 
  difficulty: string; questionIds: string[]; chapterIds: string[];
}

export interface TestResult {
  testId: string; testName: string; score: number; totalMarks: number; date: string; 
  chapterIds: string[]; accuracy: number; category?: string; 
}

export interface Flashcard {
  id: string; question: string; answer: string; subject: Subject; 
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'; type: string;
}

export interface MemoryHack {
  id: string; title: string; description: string; hack: string; category: string; subject: Subject;
}

export interface Blog {
  id: string; title: string; content: string; author: string; date: string; status: 'DRAFT' | 'PUBLISHED';
}

export interface PsychometricScore {
  stress: number; focus: number; motivation: number; examFear: number; 
  timestamp: string; studentSummary?: string; parentAdvice?: string;
}

export interface StudentData {
  id: string; name: string; email?: string; chapters: Chapter[]; backlogs: any[]; 
  flashcards: Flashcard[]; memoryHacks: MemoryHack[]; questions: Question[]; 
  mockTests: MockTest[]; blogs: Blog[]; messages: any[]; psychometricHistory: PsychometricScore[]; 
  testHistory: TestResult[]; timeSummary: { notes: number; videos: number; practice: number; tests: number; };
  routine?: any; smartPlan?: any; connectedParent?: any; pendingInvitations?: any[];
  institute?: string; targetExam?: string; birthDate?: string; gender?: string;
}

export interface UserAccount {
  id: string; name: string; email: string; role: UserRole; password?: string; 
  createdAt: string; connectedId?: string; institute?: string; targetExam?: string; 
  targetYear?: string; birthDate?: string; gender?: string;
}

// --- MOCK DATA ---

const INITIAL_STUDENT_DATA: StudentData = {
  id: '163110', name: 'Aryan Sharma', email: 'ishu@gmail.com',
  timeSummary: { notes: 1200, videos: 800, practice: 1500, tests: 600 },
  psychometricHistory: [{ stress: 4, focus: 8, motivation: 9, examFear: 3, timestamp: '2025-12-18' }],
  testHistory: [{ testId: 'jee-main-2024', testName: 'JEE Main 2024 - Session 1 Official', score: 242, totalMarks: 300, date: '2025-12-10', chapterIds: ['p-units', 'm-sets'], accuracy: 82, category: 'ADMIN' }],
  backlogs: [{ id: 'bl_1', title: 'Circular Motion Practice', subject: 'Physics', priority: 'High', status: 'PENDING', deadline: '2025-01-01', createdAt: '2025-12-15' }],
  flashcards: [
    { id: '1', question: "Dimensional formula of Planck's Constant (h)", answer: "ML²T⁻¹", subject: 'Physics', difficulty: 'EASY', type: 'Formula' },
    { id: '11', question: "Ideal Gas Equation", answer: "PV = nRT", subject: 'Chemistry', difficulty: 'EASY', type: 'Concept' }
  ],
  memoryHacks: [
    { id: '1', title: "Trigonometry Ratios", description: "Sine, Cosine, Tangent", hack: "SOH CAH TOA", category: "Mnemonics", subject: "Mathematics" },
    { id: '3', title: "Redox Reactions", description: "Oxidation vs Reduction", hack: "OIL RIG", category: "Mnemonics", subject: "Chemistry" }
  ],
  blogs: [{ id: 'b1', title: "Mastering the Forgetting Curve for JEE 2025", content: "<h1>Strategic Recall</h1><p>Master the curve using spaced repetition algorithms.</p>", author: "Admin", date: "2024-12-20", status: "PUBLISHED" }],
  messages: [],
  mockTests: [
    { id: 'jee-main-2024', name: 'JEE Main 2024 Official', duration: 180, totalMarks: 300, category: 'ADMIN', difficulty: 'MAINS', questionIds: ['q_24_1', 'q_24_2', 'q_24_3', 'q_24_4', 'q_24_5'], chapterIds: ['p-units', 'm-sets'] }
  ],
  questions: [
    { id: 'q_24_1', topicId: 'p-units', subject: 'Physics', text: "A capacitor of 10 μF is charged to 50V. The energy stored is:", options: ["12.5 mJ", "25 mJ", "0.125 J", "1.25 J"], correctAnswer: 0, explanation: "E = 1/2 CV²", difficulty: 'EASY' },
    { id: 'q_24_2', topicId: 'm-sets', subject: 'Mathematics', text: "Number of subsets of a set containing 5 elements is:", options: ["5", "10", "25", "32"], correctAnswer: 3, explanation: "2^5 = 32", difficulty: 'EASY' }
  ],
  chapters: [
    { id: 'p-units', subject: 'Physics', unit: 'Mechanics', name: 'Units and Measurements', progress: 40, accuracy: 85, timeSpent: 7200, timeSpentNotes: 2400, timeSpentVideos: 1800, timeSpentPractice: 2000, timeSpentTests: 1000, status: 'LEARNING' },
    { id: 'p-kinematics', subject: 'Physics', unit: 'Mechanics', name: 'Kinematics', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'm-sets', subject: 'Mathematics', unit: 'Algebra', name: 'Sets and Relations', progress: 15, accuracy: 75, timeSpent: 3600, timeSpentNotes: 1200, timeSpentVideos: 800, timeSpentPractice: 1000, timeSpentTests: 600, status: 'LEARNING' }
  ],
  pendingInvitations: []
};

// --- SERVICES ---

const API_CONFIG = { BASE_URL: './api/', MODE_KEY: 'jeepro_datasource_mode_v10_final' };

export const api = {
  getMode: (): 'MOCK' | 'LIVE' => (localStorage.getItem(API_CONFIG.MODE_KEY) as 'MOCK' | 'LIVE') || 'MOCK',
  setMode: (mode: 'MOCK' | 'LIVE') => { localStorage.setItem(API_CONFIG.MODE_KEY, mode); window.location.reload(); },
  async login(credentials: any) {
    if (this.getMode() === 'MOCK') return { success: true, user: { ...INITIAL_STUDENT_DATA, role: UserRole.STUDENT, createdAt: new Date().toISOString() } };
    try { const res = await fetch(`${API_CONFIG.BASE_URL}auth_login.php`, { method: 'POST', body: JSON.stringify(credentials) }); return await res.json(); } catch(e) { return { success: false, error: "Network Error" }; }
  },
  async getStudentData(studentId: string): Promise<StudentData> {
    if (this.getMode() === 'LIVE') { try { const res = await fetch(`${API_CONFIG.BASE_URL}get_dashboard.php?id=${studentId}`); const resJson = await res.json(); if(resJson.success) return resJson.data; } catch(e) {} }
    return INITIAL_STUDENT_DATA;
  },
  async updateStudentData(studentId: string, updatedData: StudentData) {
    localStorage.setItem(`jeepro_data_${studentId}`, JSON.stringify(updatedData));
    if (this.getMode() === 'LIVE') { try { await fetch(`${API_CONFIG.BASE_URL}sync_progress.php`, { method: 'POST', body: JSON.stringify({ student_id: studentId, chapters: updatedData.chapters }) }); } catch(e) {} }
    return { success: true };
  },
  async saveEntity(type: string, data: any) {
    if (this.getMode() === 'LIVE') { try { const res = await fetch(`${API_CONFIG.BASE_URL}manage_resource.php?table=${type.toLowerCase()}`, { method: 'POST', body: JSON.stringify(data) }); return await res.json(); } catch(e) { return { success: false }; } }
    return { success: true };
  },
  async saveRoutine(studentId: string, routine: any) { return this.saveEntity('Routine', { student_id: studentId, ...routine }); },
  async saveTimetable(studentId: string, smartPlan: any) { return this.saveEntity('Timetable', { student_id: studentId, ...smartPlan }); },
  async updateUserProfile(studentId: string, profile: any) { return this.saveEntity('User', { id: studentId, ...profile }); }
};

export const MODEL_CONFIGS: any = {
  'gemini-3-flash': { name: 'Gemini 3 Flash', actualModel: 'gemini-3-flash-preview', desc: 'Fast' },
  'gemini-3-pro': { name: 'Gemini 3 Pro', actualModel: 'gemini-3-pro-preview', desc: 'Deep' }
};

// Global process declaration for API Key access
declare var process: { env: { API_KEY: string } };

export const getSmartStudyAdvice = async (data: StudentData) => {
  // Initialize GoogleGenAI with the required named parameter and process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: "Analyze progress and provide 3 priorities.", config: { responseMimeType: "application/json" } });
    return JSON.parse(response.text || '{}');
  } catch (err) { return { priorities: ["Review weak chapters", "Solve PYQs", "Formula recall"], mindsetTip: "Stay focused." }; }
};

export const chatWithTutor = async (history: any[], userMessage: string, modelId: string, data: StudentData) => {
  // Initialize GoogleGenAI with the required named parameter and process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const chat = ai.chats.create({ model: MODEL_CONFIGS[modelId]?.actualModel || 'gemini-3-flash-preview' });
    const result = await chat.sendMessage({ message: userMessage });
    return result.text || "No response.";
  } catch (err) { return "AI Connection Unstable."; }
};

// --- COMPONENTS ---

const Navbar = ({ activeTab, setActiveTab }: any) => (
  <nav className="w-full bg-white border-b border-slate-100 py-5 px-6 md:px-12 sticky top-0 z-50">
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      <div className="flex items-center gap-1 cursor-pointer" onClick={() => setActiveTab('about')}>
        <span className="text-2xl font-black tracking-tighter text-[#2b4c8c] uppercase italic">IITGEEPREP</span>
      </div>
      <div className="hidden md:flex justify-end items-center gap-8 flex-1 mr-10">
        {['about', 'features', 'examguide', 'blog', 'contact'].map(id => (
          <button key={id} onClick={() => setActiveTab(id)} className={`text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === id ? 'text-indigo-600' : 'text-slate-400'}`}>
            {id.replace('guide', ' pattern')}
          </button>
        ))}
      </div>
      <button onClick={() => setActiveTab('login')} className="px-8 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">Access Portal</button>
    </div>
  </nav>
);

const Sidebar = ({ role, activeTab, setActiveTab, handleLogout }: any) => {
  const links = role === UserRole.ADMIN ? [
    { id: 'admin-overview', label: 'Admin Home', icon: LayoutDashboard },
    { id: 'admin-syllabus', label: 'Syllabus', icon: BookOpen },
    { id: 'admin-questions', label: 'MCQ Bank', icon: FileText },
    { id: 'admin-blogs', label: 'Blogs', icon: PenTool },
    { id: 'admin-system', label: 'System', icon: Settings }
  ] : [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'learn', label: 'Syllabus', icon: BookOpen },
    { id: 'aitutor', label: 'AI Tutor', icon: Bot },
    { id: 'tests', label: 'Exams', icon: FileText },
    { id: 'psychometric', label: 'Mindset', icon: Brain },
    { id: 'blog', label: 'Reports', icon: PenTool },
    { id: 'timetable', label: 'Planner', icon: Calendar },
    { id: 'profile', label: 'Profile', icon: UserCircle }
  ];

  return (
    <div className="w-64 bg-[#0a1128] text-slate-300 flex flex-col hidden lg:flex border-r border-slate-800 shrink-0">
      <div className="p-6 mb-2">
        <h1 className="text-sm font-black text-white flex items-center gap-3 italic"><ShieldCheck className="w-6 h-6 text-indigo-500" /> SOLARIS CORE</h1>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 space-y-1">
        {links.map(link => (
          <button key={link.id} onClick={() => setActiveTab(link.id)} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-xs font-bold transition-all ${activeTab === link.id ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-slate-800/50'}`}>
            <link.icon className="w-4 h-4" /> {link.label}
          </button>
        ))}
      </nav>
      <div className="p-4"><button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-slate-900 text-rose-400 rounded-2xl font-black text-xs uppercase tracking-widest border border-slate-800"><X className="w-4 h-4" /> Sign Out</button></div>
    </div>
  );
};

const Header = ({ studentName, role }: any) => (
  <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
    <div className="relative w-full max-w-md">
      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
      <input type="text" placeholder="Search preparation nodes..." className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-xs font-bold" />
    </div>
    <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
      <div className="text-right"><div className="text-xs font-black text-slate-800">{studentName}</div><div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{role}</div></div>
      <UserCircle className="w-8 h-8 text-slate-300" />
    </div>
  </header>
);

// --- VIEWS ---

const AboutModule = () => (
  <div className="bg-white min-h-screen py-20 px-6 text-center max-w-6xl mx-auto space-y-12">
    <h1 className="text-7xl font-black text-slate-900 tracking-tighter uppercase italic">ENGINEERING <span className="text-indigo-600">APEX.</span></h1>
    <p className="text-slate-500 text-xl font-medium italic max-w-3xl mx-auto">The most sophisticated preparation ecosystem for IIT-JEE aspirants.</p>
    <div className="flex justify-center gap-4"><button onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'login' }))} className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">Get Started</button></div>
  </div>
);

const BlogModule = ({ data }: { data: StudentData }) => {
  const [selected, setSelected] = useState<Blog | null>(null);
  const blogs = (data.blogs || []).filter(b => b.status === 'PUBLISHED');
  if (selected) return (
    <div className="max-w-4xl mx-auto py-20 px-6 space-y-10">
      <button onClick={() => setSelected(null)} className="flex items-center gap-3 text-slate-400 font-black uppercase text-[10px]"><ArrowLeft className="w-4 h-4" /> Back</button>
      <h1 className="text-6xl font-black italic uppercase text-slate-900 leading-none">{selected.title}</h1>
      <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: selected.content }} />
    </div>
  );
  return (
    <div className="max-w-7xl mx-auto py-20 px-6 space-y-12">
      <h2 className="text-6xl font-black italic uppercase text-slate-900">NEWSROOM.</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {blogs.map(b => (
          <div key={b.id} onClick={() => setSelected(b)} className="p-10 bg-white border border-slate-100 rounded-[3rem] shadow-sm hover:shadow-xl transition-all cursor-pointer space-y-6">
            <span className="text-[8px] font-black uppercase tracking-widest text-indigo-500">{b.date}</span>
            <h3 className="text-2xl font-black italic uppercase text-slate-800 leading-tight">{b.title}</h3>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">BY {b.author}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PsychometricTest = ({ data, setData }: any) => {
  const [step, setStep] = useState(0);
  const questions = [
    { id: 'stress', title: 'Stress Pressure', icon: Activity },
    { id: 'focus', title: 'Deep Work Capacity', icon: Timer }
  ];
  if (step === questions.length) return (
    <div className="text-center py-40 space-y-8">
      <h2 className="text-5xl font-black italic uppercase text-indigo-600">Sync Complete.</h2>
      <button onClick={() => setStep(0)} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs">Retake Diagnostic</button>
    </div>
  );
  return (
    <div className="max-w-4xl mx-auto py-20 text-center space-y-12">
      <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[2.5rem] flex items-center justify-center mx-auto"><Brain className="w-12 h-12" /></div>
      <h3 className="text-5xl font-black italic text-slate-900 uppercase">{questions[step].title}</h3>
      <button onClick={() => setStep(step + 1)} className="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs shadow-xl">Confirm Level</button>
    </div>
  );
};

const AdminCMS = ({ data, setData, activeTab }: any) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [type, setType] = useState('Blog');
  const [isDownloading, setIsDownloading] = useState(false);

  const handleSave = async (entity: any) => {
    const keyMap: any = { 'Chapter': 'chapters', 'Question': 'questions', 'Blog': 'blogs' };
    const key = keyMap[type]; if(!key) return;
    const current = [...(data[key] || [])];
    const idx = current.findIndex(e => e.id === entity.id);
    if(idx > -1) current[idx] = entity; else current.push(entity);
    setData({ ...data, [key]: current });
    setIsCreating(false);
  };

  const downloadZip = async () => {
    setIsDownloading(true);
    const zip = new JSZip();
    zip.file("config/database.php", "<?php define('DB_HOST','localhost'); ?>");
    zip.file("sql/master_schema.sql", "CREATE TABLE users (id VARCHAR(50) PRIMARY KEY);");
    zip.file("auth_login.php", "<?php echo json_encode(['success'=>true]); ?>");
    zip.file("get_dashboard.php", "<?php echo json_encode(['success'=>true]); ?>");
    zip.file("sync_progress.php", "<?php echo json_encode(['success'=>true]); ?>");
    zip.file("save_attempt.php", "<?php echo json_encode(['success'=>true]); ?>");
    zip.file("save_psychometric.php", "<?php echo json_encode(['success'=>true]); ?>");
    zip.file("save_timetable.php", "<?php echo json_encode(['success'=>true]); ?>");
    zip.file("manage_resource.php", "<?php echo json_encode(['success'=>true]); ?>");
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "solaris_v20_complete_backend.zip");
    setIsDownloading(false);
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 space-y-12">
      <div className="bg-slate-900 p-12 rounded-[4rem] text-white flex justify-between items-center shadow-2xl relative overflow-hidden">
        <h2 className="text-6xl font-black italic uppercase leading-none">SENTINEL <span className="text-indigo-500">CORE.</span></h2>
        <button onClick={downloadZip} disabled={isDownloading} className="px-10 py-5 bg-white text-indigo-900 rounded-2xl font-black uppercase text-xs flex items-center gap-3">
          {isDownloading ? <Loader2 className="animate-spin w-4 h-4" /> : <Download className="w-4 h-4" />} Download ZIP
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          { t: 'Chapter', l: 'Syllabus Nodes', d: data.chapters, i: BookOpen },
          { t: 'Question', l: 'MCQ Bank', d: data.questions, i: FileText },
          { t: 'Blog', l: 'Strategy Feed', d: data.blogs, i: PenTool }
        ].map(cat => (
          <div key={cat.t} className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black italic text-slate-800 flex items-center gap-3"><cat.i className="w-6 h-6 text-indigo-500" /> {cat.l}</h3>
              <button onClick={() => { setType(cat.t); setIsCreating(true); setEditItem(null); }} className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest">+ New Entry</button>
            </div>
            <div className="divide-y divide-slate-50 max-h-80 overflow-y-auto">
              {cat.d.map((item: any) => (
                <div key={item.id} className="py-4 flex justify-between items-center">
                   <div className="text-sm font-bold text-slate-700 italic">{item.name || item.text || item.title}</div>
                   <button onClick={() => { setType(cat.t); setEditItem(item); setIsCreating(true); }} className="text-indigo-600 hover:scale-110 transition-transform"><Edit3 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {isCreating && <CreationHub type={type} item={editItem} onClose={() => setIsCreating(false)} onSave={handleSave} allChapters={data.chapters} />}
    </div>
  );
};

const CreationHub = ({ type, item, onClose, onSave }: any) => {
  const [formData, setFormData] = useState<any>(item || { id: `ID-${Math.random().toString(36).substr(2, 9)}`, name: '', title: '', text: '', content: '', notes: '', status: 'PUBLISHED' });
  const [preview, setPreview] = useState(false);
  const insertTag = (tag: string, close: string) => { const f = type === 'Blog' ? 'content' : 'notes'; setFormData({ ...formData, [f]: (formData[f] || '') + tag + close }); };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={onClose}></div>
      <div className={`bg-white w-full max-w-5xl rounded-[4rem] shadow-2xl relative z-10 flex flex-col overflow-hidden max-h-[90vh]`}>
        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
           <h3 className="text-2xl font-black italic uppercase">Manage <span className="text-indigo-600">{type} Node.</span></h3>
           <button onClick={() => setPreview(!preview)} className="px-6 py-3 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase">{preview ? 'Edit' : 'Preview'}</button>
        </div>
        <div className="flex-1 overflow-y-auto p-12">
          {preview ? <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: formData.content || formData.notes }} /> : (
            <div className="space-y-8">
              <input value={formData.name || formData.title || formData.text} onChange={e => setFormData({ ...formData, [type === 'Question' ? 'text' : type === 'Blog' ? 'title' : 'name']: e.target.value })} className="w-full bg-slate-50 p-6 rounded-2xl text-xl font-black italic shadow-inner" placeholder="Title/Identity..." />
              <div className="flex gap-2 p-2 bg-slate-900 rounded-2xl"><button onClick={() => insertTag('<strong>', '</strong>')} className="p-3 text-white"><Bold className="w-4 h-4" /></button><button onClick={() => insertTag('<em>', '</em>')} className="p-3 text-white"><Italic className="w-4 h-4" /></button></div>
              <textarea value={formData.content || formData.notes} onChange={e => setFormData({ ...formData, [type === 'Blog' ? 'content' : 'notes']: e.target.value })} rows={12} className="w-full bg-slate-50 p-10 rounded-[3rem] text-sm font-mono shadow-inner" placeholder="Technical content..." />
            </div>
          )}
        </div>
        <div className="p-8 border-t flex gap-4"><button onClick={onClose} className="flex-1 py-5 bg-slate-100 rounded-2xl font-black uppercase text-[10px]">Abort</button><button onClick={() => onSave(formData)} className="flex-[2] py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] shadow-xl">Deploy Changes</button></div>
      </div>
    </div>
  );
};

const LearnModule = ({ data, setData }: any) => {
  const [active, setActive] = useState<Chapter | null>(null);
  if (active) return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-10">
      <button onClick={() => setActive(null)} className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Back to Syllabus</button>
      <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-xl space-y-10">
        <h2 className="text-5xl font-black italic uppercase text-slate-900">{active.name}</h2>
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: active.notes || 'Awaiting content uplink...' }} />
      </div>
    </div>
  );
  return (
    <div className="max-w-7xl mx-auto py-12 px-6 space-y-12">
      <h2 className="text-6xl font-black italic uppercase text-slate-900">SYLLABUS.</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {data.chapters.map((c: Chapter) => (
          <div key={c.id} onClick={() => setActive(c)} className="bg-white p-10 rounded-[3rem] border border-slate-200 hover:border-indigo-400 transition-all cursor-pointer group shadow-sm">
            <h3 className="text-2xl font-black italic uppercase text-slate-800 group-hover:text-indigo-600">{c.name}</h3>
            <div className="flex justify-between items-end mt-10">
              <div className="text-[10px] font-black uppercase text-slate-400">{c.subject}</div>
              <div className="text-3xl font-black text-slate-900">{c.progress}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- APP COMPONENT ---

const App: React.FC = () => {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [studentData, setStudentData] = useState<StudentData>(INITIAL_STUDENT_DATA);
  const [activeTab, setActiveTab] = useState<string>('about');

  useEffect(() => {
    const saved = localStorage.getItem('jeepro_user'); if(saved) setUser(JSON.parse(saved));
  }, []);

  const onLogin = (u: UserAccount) => { setUser(u); localStorage.setItem('jeepro_user', JSON.stringify(u)); setActiveTab(u.role === UserRole.ADMIN ? 'admin-overview' : 'dashboard'); };
  const logout = () => { localStorage.removeItem('jeepro_user'); setUser(null); setActiveTab('about'); };

  const renderContent = () => {
    if (!user) {
      switch(activeTab) {
        case 'features': return <div className="py-40 text-center text-4xl font-black uppercase italic">Technical Specifications.</div>;
        case 'examguide': return <div className="py-40 text-center text-4xl font-black uppercase italic">Exam Matrix Pattern.</div>;
        case 'blog': return <BlogModule data={studentData} />;
        case 'contact': return <div className="py-40 text-center text-4xl font-black uppercase italic">Operational Uplink.</div>;
        case 'login': return (
          <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
            <div className="bg-white p-12 rounded-[4rem] shadow-2xl max-w-md w-full space-y-10 text-center">
              <h2 className="text-4xl font-black italic uppercase">System Gateway.</h2>
              <button onClick={() => onLogin({ id: '163110', name: 'Aryan Sharma', role: UserRole.STUDENT, email: 'ishu@gmail.com', createdAt: '' })} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs">Enter as Aspirant</button>
              <button onClick={() => onLogin({ id: 'ADMIN-1', name: 'Master Admin', role: UserRole.ADMIN, email: 'admin@node.edu', createdAt: '' })} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs">Enter as Admin</button>
            </div>
          </div>
        );
        default: return <AboutModule />;
      }
    }

    if (activeTab.startsWith('admin-')) return <AdminCMS data={studentData} setData={setStudentData} activeTab={activeTab} />;
    switch(activeTab) {
      case 'dashboard': return <div className="py-20 text-4xl font-black uppercase italic">Dashboard Statistics.</div>;
      case 'learn': return <LearnModule data={studentData} setData={setStudentData} />;
      case 'aitutor': return <div className="py-20 text-4xl font-black uppercase italic">AI Academic Coach.</div>;
      case 'tests': return <div className="py-20 text-4xl font-black uppercase italic">Examination Hub.</div>;
      case 'blog': return <BlogModule data={studentData} />;
      case 'profile': return <div className="py-20 text-4xl font-black uppercase italic">Personal Identity Nodes.</div>;
      default: return <div className="py-20">View Component: {activeTab}</div>;
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      {!user ? <Navbar activeTab={activeTab} setActiveTab={setActiveTab} /> : (
        <div className="flex h-screen overflow-hidden">
          <Sidebar role={user.role} activeTab={activeTab} setActiveTab={setActiveTab} handleLogout={logout} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header studentName={user.name} role={user.role} />
            <main className="flex-1 overflow-y-auto p-10">{renderContent()}</main>
          </div>
        </div>
      )}
      {!user && <main className="flex-1">{renderContent()}</main>}
    </div>
  );
};

export default App;
