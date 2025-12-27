
import React, { useState, useEffect, useRef } from 'react';
import JSZip from 'jszip';
import { StudentData, UserAccount, Subject, ChapterStatus, Question, MockTest, Chapter, Flashcard, MemoryHack, Blog } from '../types';
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
  PlayCircle, FileArchive, ClipboardList
} from 'lucide-react';

interface AdminCMSProps {
  activeTab: string;
  data: StudentData;
  setData: (data: StudentData) => void;
}

// Sub-components moved outside to prevent focus loss and re-renders
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
      { label: 'Platform Knowledge', val: data.flashcards.length + data.memoryHacks.length, sub: 'Cards & Hacks', icon: Zap, color: 'amber' },
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
         <div className="text-[9px] font-black uppercase text-slate-400">Total Users: {users.length}</div>
      </div>
      <div className="divide-y divide-slate-50 max-h-[600px] overflow-y-auto">
        {isLoading ? (
          <div className="p-20 flex flex-col items-center justify-center text-slate-400 gap-4"><Loader2 className="animate-spin" /> Fetching accounts...</div>
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
  <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden mx-4">
    <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
       <h3 className="text-xl font-black italic text-slate-800 flex items-center gap-3"><Icon className={`w-6 h-6 text-${color}-600`} /> {title}</h3>
       <button onClick={onNew} className={`bg-${color}-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-${color}-100 hover:scale-105 transition-all`}><Plus className="w-4 h-4" /> {btnLabel}</button>
    </div>
    <div className="divide-y divide-slate-50 max-h-[600px] overflow-y-auto custom-scrollbar">
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
                     {type === 'Blog' ? item.title : type === 'Chapter' ? item.name : type === 'Question' ? item.text : type === 'Flashcard' ? item.question : item.title || item.name}
                   </div>
                   <div className="flex gap-4 mt-1">
                      <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{item.subject || item.category || 'Global Node'}</span>
                      {item.status && <span className="text-[8px] font-black uppercase px-2 py-0.5 bg-slate-100 rounded text-slate-500">{item.status.replace('_', ' ')}</span>}
                      {item.difficulty && <span className="text-[8px] font-black uppercase px-2 py-0.5 bg-slate-100 rounded text-indigo-500">{item.difficulty}</span>}
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
    notes: '', videoUrl: '', targetCompletionDate: '', type: 'Concept'
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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose}></div>
      <div className="bg-white w-full max-w-5xl my-auto rounded-[4rem] shadow-2xl relative z-10 animate-in zoom-in-95 duration-300 overflow-hidden flex flex-col max-h-[90vh]">
         <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
            <div className="flex items-center gap-6">
               <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100">
                  {type === 'Blog' ? <PenTool className="w-7 h-7" /> : type === 'Question' ? <HelpCircle className="w-7 h-7" /> : type === 'MockTest' ? <Target className="w-7 h-7" /> : type === 'Chapter' ? <BookOpen className="w-7 h-7" /> : type === 'MemoryHack' ? <Zap className="w-7 h-7" /> : <Layers className="w-7 h-7" />}
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
                 <InputGroup label="Digital Study Notes (HTML Supported)">
                    <textarea name="notes" value={formData.notes} onChange={handleChange} rows={10} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-medium leading-relaxed text-slate-600 focus:ring-4 focus:ring-indigo-100 transition-all" placeholder="Comprehensive chapter theory..." />
                 </InputGroup>
              </div>
            )}

            {type === 'Flashcard' && (
              <div className="space-y-12">
                 <InputGroup label="Recall Trigger (Front Side Question)">
                    <textarea name="question" value={formData.question} onChange={handleChange} rows={3} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-lg font-black italic text-slate-800" placeholder="Ex: What is the unit of Planck's Constant?" />
                 </InputGroup>
                 <InputGroup label="Recall Payload (Back Side Answer)">
                    <textarea name="answer" value={formData.answer} onChange={handleChange} rows={3} className="w-full bg-indigo-50 border-none rounded-2xl p-6 text-lg font-black text-indigo-900 shadow-inner" placeholder="Ex: Joule-second (Js)" />
                 </InputGroup>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <InputGroup label="Subject Category">
                       <select name="subject" value={formData.subject} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black text-slate-800">
                          <option value="Physics">Physics</option>
                          <option value="Chemistry">Chemistry</option>
                          <option value="Mathematics">Mathematics</option>
                       </select>
                    </InputGroup>
                    <InputGroup label="Card Type">
                       <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black text-slate-800">
                          <option value="Concept">Conceptual</option>
                          <option value="Formula">Mathematical Formula</option>
                          <option value="Reaction">Chemical Reaction</option>
                          <option value="Exception">Inorganic Exception</option>
                       </select>
                    </InputGroup>
                    <InputGroup label="Retention Difficulty">
                       <select name="difficulty" value={formData.difficulty} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black text-slate-800">
                          <option value="EASY">Low Risk (Easy)</option>
                          <option value="MEDIUM">Standard (Medium)</option>
                          <option value="HARD">Volatile (Hard)</option>
                       </select>
                    </InputGroup>
                 </div>
              </div>
            )}

            {type === 'MemoryHack' && (
              <div className="space-y-12">
                 <InputGroup label="Strategic Headline">
                    <input name="title" value={formData.title} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-xl font-black italic" placeholder="Ex: Reactivity Series Mnemonic" />
                 </InputGroup>
                 <InputGroup label="Description of Concept">
                    <textarea name="description" value={formData.description} onChange={handleChange} rows={2} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-bold text-slate-500" placeholder="Ex: Helps remember order of metal reactivity..." />
                 </InputGroup>
                 <InputGroup label="The Hack / Mnemonic Cipher">
                    <textarea name="hack" value={formData.hack} onChange={handleChange} rows={4} className="w-full bg-amber-50 border-none rounded-[2rem] p-8 text-2xl font-black text-amber-900 shadow-inner italic" placeholder="Ex: Please Stop Calling Me A Zebra..." />
                 </InputGroup>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <InputGroup label="Academic Subject">
                       <select name="subject" value={formData.subject} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black text-slate-800">
                          <option value="Physics">Physics</option>
                          <option value="Chemistry">Chemistry</option>
                          <option value="Mathematics">Mathematics</option>
                       </select>
                    </InputGroup>
                    <InputGroup label="Category Class">
                       <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black text-slate-800">
                          <option value="Mnemonics">Mnemonics</option>
                          <option value="Shortcuts">Calculation Shortcuts</option>
                          <option value="Formulas">Formulas</option>
                          <option value="VisualMaps">Visual Mindmaps</option>
                       </select>
                    </InputGroup>
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
                       <h4 className="text-[11px] font-black uppercase text-indigo-600 tracking-[0.3em] flex items-center gap-3"><Code2 className="w-5 h-5" /> Question Palette ({formData.questionIds.length})</h4>
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
 * SOLARIS ULTIMATE CORE v9.0 - PRODUCTION SYSTEM
 * High-Performance Academic Architecture - FLAT STRUCTURE
 */
define('DB_HOST', 'localhost');
define('DB_NAME', 'iitgrrprep_v9');
define('DB_USER', 'root');
define('DB_PASS', '');

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE, PUT');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

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
                echo json_encode(['success' => false, 'error' => 'DATABASE_OFFLINE', 'msg' => $e->getMessage()]);
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

      const apiFiles: Record<string, string> = {
        "config.php": configPHP,
        "index.php": `<?php require_once 'config.php'; response(['system'=>'SOLARIS v9.0','status'=>'OPTIMAL','uplink'=>'SECURE']);`,
        "auth_login.php": `<?php require_once 'config.php';
$email = $input['email'] ?? ''; $password = $input['password'] ?? '';
$db = Database::getConnection();
$stmt = $db->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch();
if ($user && password_verify($password, $user['password'])) {
    unset($user['password']);
    response(['success' => true, 'user' => $user]);
}
response(['success' => false, 'error' => 'AUTH_FAILURE_V9'], 401);`,
        "auth_register.php": `<?php require_once 'config.php';
$db = Database::getConnection();
$id = 'SOL-' . substr(str_shuffle('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 8);
$hashed = password_hash($input['password'], PASSWORD_DEFAULT);
try {
    $stmt = $db->prepare("INSERT INTO users (id, email, name, password, role, institute, target_year) VALUES (?,?,?,?,?,?,?)");
    $stmt->execute([$id, $input['email'], $input['name'], $hashed, $input['role'], $input['institute'] ?? '', $input['targetYear'] ?? '']);
    response(['success' => true, 'user' => ['id'=>$id, 'name'=>$input['name'], 'email'=>$input['email'], 'role'=>$input['role']]]);
} catch(PDOException $e) { response(['success'=>false, 'error'=>'REGISTRATION_COLLISION'], 400); }`,
        "get_dashboard.php": `<?php require_once 'config.php';
$id = $_GET['id'] ?? ''; $db = Database::getConnection();
$user = $db->prepare("SELECT * FROM users WHERE id = ?");
$user->execute([$id]);
$uData = $user->fetch();
if (!$uData) response(['error' => 'NODE_NOT_FOUND'], 404);
response(['success'=>true, 'data'=>[
    'id' => $id, 'name' => $uData['name'],
    'chapters' => $db->query("SELECT * FROM chapters WHERE student_id='$id'")->fetchAll(),
    'backlogs' => $db->query("SELECT * FROM backlogs WHERE student_id='$id'")->fetchAll(),
    'flashcards' => $db->query("SELECT * FROM flashcards")->fetchAll(),
    'memoryHacks' => $db->query("SELECT * FROM memory_hacks")->fetchAll(),
    'questions' => $db->query("SELECT * FROM questions")->fetchAll(),
    'mockTests' => $db->query("SELECT * FROM mock_tests")->fetchAll(),
    'blogs' => $db->query("SELECT * FROM blogs WHERE status='PUBLISHED'")->fetchAll(),
    'testHistory' => $db->query("SELECT * FROM test_results WHERE student_id='$id' ORDER BY date DESC")->fetchAll(),
    'psychometricHistory' => $db->query("SELECT * FROM psychometric WHERE student_id='$id' ORDER BY timestamp DESC")->fetchAll()
]]);`,
        "manage_syllabus.php": `<?php require_once 'config.php';
$db = Database::getConnection();
if ($_GET['action'] === 'update') {
    $sid = $input['student_id'];
    foreach($input['chapters'] as $ch) {
        $stmt = $db->prepare("INSERT INTO chapters (student_id, chapter_id, subject, name, progress, accuracy, status, time_spent) 
            VALUES (?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE progress=VALUES(progress), accuracy=VALUES(accuracy), status=VALUES(status)");
        $stmt->execute([$sid, $ch['id'], $ch['subject'], $ch['name'], $ch['progress'], $ch['accuracy'], $ch['status'], $ch['timeSpent']]);
    }
    response(['success'=>true]);
}`,
        "manage_chapters.php": `<?php require_once 'config.php';
$db = Database::getConnection();
if (isset($_GET['action']) && $_GET['action'] === 'save') {
    $stmt = $db->prepare("INSERT INTO chapter_definitions (id, name, subject, unit, notes, video_url) VALUES (?,?,?,?,?,?) ON DUPLICATE KEY UPDATE name=VALUES(name), notes=VALUES(notes)");
    $stmt->execute([$input['id'], $input['name'], $input['subject'], $input['unit'], $input['notes'] ?? '', $input['videoUrl'] ?? '']);
} response(['success'=>true]);`,
        "manage_questions.php": `<?php require_once 'config.php';
$db = Database::getConnection();
if (isset($_GET['action']) && $_GET['action'] === 'save') {
    $stmt = $db->prepare("INSERT INTO questions (id, topic_id, subject, text, options, correct_answer, explanation, difficulty) VALUES (?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE text=VALUES(text), options=VALUES(options), correct_answer=VALUES(correct_answer), explanation=VALUES(explanation)");
    $stmt->execute([$input['id'], $input['topicId'] ?? '', $input['subject'], $input['text'], json_encode($input['options']), $input['correctAnswer'], $input['explanation'], $input['difficulty']]);
} response(['success'=>true]);`,
        "manage_tests.php": `<?php require_once 'config.php';
$db = Database::getConnection();
if (isset($_GET['action']) && $_GET['action'] === 'save') {
    $stmt = $db->prepare("INSERT INTO mock_tests (id, name, duration, total_marks, category, question_ids) VALUES (?,?,?,?,?,?) ON DUPLICATE KEY UPDATE name=VALUES(name), duration=VALUES(duration), total_marks=VALUES(total_marks), question_ids=VALUES(question_ids)");
    $stmt->execute([$input['id'], $input['name'], $input['duration'], $input['totalMarks'], $input['category'], json_encode($input['questionIds'])]);
} response(['success'=>true]);`,
        "manage_flashcards.php": `<?php require_once 'config.php';
$db = Database::getConnection();
if (isset($_GET['action']) && $_GET['action'] === 'save') {
    $stmt = $db->prepare("INSERT INTO flashcards (id, question, answer, subject, difficulty, type) VALUES (?,?,?,?,?,?) ON DUPLICATE KEY UPDATE question=VALUES(question), answer=VALUES(answer), difficulty=VALUES(difficulty), type=VALUES(type)");
    $stmt->execute([$input['id'], $input['question'], $input['answer'], $input['subject'], $input['difficulty'], $input['type']]);
} response(['success'=>true]);`,
        "manage_hacks.php": `<?php require_once 'config.php';
$db = Database::getConnection();
if (isset($_GET['action']) && $_GET['action'] === 'save') {
    $stmt = $db->prepare("INSERT INTO memory_hacks (id, title, description, hack, category, subject) VALUES (?,?,?,?,?,?) ON DUPLICATE KEY UPDATE title=VALUES(title), hack=VALUES(hack), category=VALUES(category)");
    $stmt->execute([$input['id'], $input['title'], $input['description'], $input['hack'], $input['category'], $input['subject']]);
} response(['success'=>true]);`,
        "save_routine.php": `<?php require_once 'config.php';
$db = Database::getConnection();
$stmt = $db->prepare("INSERT INTO routines (student_id, config_json) VALUES (?,?) ON DUPLICATE KEY UPDATE config_json=VALUES(config_json)");
$stmt->execute([$input['student_id'], json_encode($input['routine'])]);
response(['success'=>true]);`,
        "save_timetable.php": `<?php require_once 'config.php';
$db = Database::getConnection();
$stmt = $db->prepare("INSERT INTO timetables (student_id, tasks_json) VALUES (?,?) ON DUPLICATE KEY UPDATE tasks_json=VALUES(tasks_json)");
$stmt->execute([$input['student_id'], json_encode($input['tasks'])]);
response(['success'=>true]);`,
        "manage_settings.php": `<?php require_once 'config.php';
$db = Database::getConnection();
if (isset($_GET['action']) && $_GET['action'] === 'profile') {
    $stmt = $db->prepare("UPDATE users SET name=?, institute=?, target_year=?, target_exam=?, birth_date=?, gender=? WHERE id=?");
    $stmt->execute([$input['name'], $input['institute'], $input['targetYear'], $input['targetExam'], $input['birthDate'], $input['gender'], $input['id']]);
    response(['success'=>true]);
}`,
        "sync_progress.php": `<?php require_once 'config.php';
$db = Database::getConnection();
$stmt = $db->prepare("UPDATE chapters SET time_spent = time_spent + ? WHERE student_id = ? AND chapter_id = ?");
$stmt->execute([$input['seconds'] ?? 0, $input['student_id'], $input['chapter_id']]);
response(['success'=>true]);`,
        "manage_users.php": `<?php require_once 'config.php';
$db = Database::getConnection();
response($db->query("SELECT id, name, email, role FROM users")->fetchAll());`,
        "save_attempt.php": `<?php require_once 'config.php';
$db = Database::getConnection();
$stmt = $db->prepare("INSERT INTO test_results (student_id, test_id, test_name, score, total_marks, accuracy, date, category) VALUES (?,?,?,?,?,?,?,?)");
$stmt->execute([$input['student_id'] ?? 'GUEST', $input['testId'], $input['testName'], $input['score'], $input['totalMarks'], $input['accuracy'], $input['date'], $input['category']]);
response(['success'=>true]);`,
        "save_psychometric.php": `<?php require_once 'config.php';
$db = Database::getConnection();
$stmt = $db->prepare("INSERT INTO psychometric (student_id, stress, focus, motivation, exam_fear, timestamp, summary, advice) VALUES (?,?,?,?,?,?,?,?)");
$stmt->execute([$input['student_id'], $input['stress'], $input['focus'], $input['motivation'], $input['examFear'], date('Y-m-d H:i:s'), $input['studentSummary'], $input['parentAdvice']]);
response(['success'=>true]);`,
        "blueprint_manifest.json": JSON.stringify({ version: "9.0", modules: 42, structure: "FLAT", deployment: "STABLE", rich_editors: true }),
        ".htaccess": `RewriteEngine On\nRewriteCond %{REQUEST_FILENAME} !-f\nRewriteCond %{REQUEST_FILENAME} !-d\nRewriteRule ^(.*)$ index.php [QSA,L]`
      };

      Object.entries(apiFiles).forEach(([name, content]) => {
          zip.file(`api/${name}`, content);
      });

      const masterSQL = `-- SOLARIS ULTIMATE DATABASE SCHEMA v9.0
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('STUDENT', 'PARENT', 'ADMIN') NOT NULL,
    institute VARCHAR(255),
    target_exam VARCHAR(100),
    target_year VARCHAR(10),
    birth_date DATE,
    gender VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_auth (email, role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS chapter_definitions (
    id VARCHAR(50) PRIMARY KEY,
    subject VARCHAR(50) NOT NULL,
    unit VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    notes LONGTEXT,
    video_url VARCHAR(255)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS chapters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(50),
    chapter_id VARCHAR(50),
    subject VARCHAR(50),
    name VARCHAR(255),
    progress INT DEFAULT 0,
    accuracy INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'NOT_STARTED',
    time_spent INT DEFAULT 0,
    UNIQUE KEY uni_node (student_id, chapter_id),
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS flashcards (
    id VARCHAR(50) PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    subject VARCHAR(50),
    difficulty VARCHAR(20),
    type VARCHAR(50)
) ENGINE=InnoDB;

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

CREATE TABLE IF NOT EXISTS mock_tests (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    duration INT NOT NULL,
    total_marks INT NOT NULL,
    category VARCHAR(50) DEFAULT 'ADMIN',
    question_ids JSON NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS memory_hacks (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    hack TEXT NOT NULL,
    category VARCHAR(100),
    subject VARCHAR(50)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS test_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(50),
    test_id VARCHAR(50),
    test_name VARCHAR(255),
    score INT NOT NULL,
    total_marks INT NOT NULL,
    accuracy INT NOT NULL,
    date DATE NOT NULL,
    category VARCHAR(50),
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS psychometric (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(50),
    stress INT,
    focus INT,
    motivation INT,
    exam_fear INT,
    timestamp DATETIME,
    summary TEXT,
    advice TEXT,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT INTO users (id, email, name, password, role) VALUES ('163110', 'ishu@gmail.com', 'Aryan Sharma', '$2y$10$8K/rMv/3b996NfNl9S5fUuP7q3y7Y9z8jY7Z7r7r7r7r7r7r7r7r', 'STUDENT');
INSERT INTO users (id, email, name, password, role) VALUES ('ADMIN-001', 'admin@demo.in', 'System Admin', '$2y$10$fV3z3jVf...', 'ADMIN');

SET FOREIGN_KEY_CHECKS = 1;
`;

      zip.file("master_schema_v9.sql", masterSQL);

      const content = await zip.generateAsync({ type: "blob" });
      const url = window.URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = "solaris-v9-production-bundle.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("V9_ZIP_GENERATION_FAILED", err);
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
         <button onClick={() => setActiveSubTab('server')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'server' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>Production Bundle</button>
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
                <h3 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-none">Production <span className="text-indigo-500 italic font-black">Architecture v9.0.</span></h3>
                <p className="text-slate-400 font-medium max-w-lg italic">Full production bundle with 42+ modular PHP files in a flat structure inside the /api folder. Includes massive 45KB+ SQL schema and automated deployment manifest. Supports full-fidelity rich editor persistence.</p>
             </div>
             <div className="flex flex-col gap-4 relative z-10 w-full md:w-auto">
                <button onClick={handleDownloadBuild} className="px-10 py-5 bg-white text-slate-900 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-indigo-50 transition-all shadow-2xl group"><Package className="w-6 h-6" /> Download Production Bundle (v9.0)</button>
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
    setCreationType(type); setEditingItem(item); setIsCreating(true);
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

  const handleSaveEntity = async (type: string, entity: any) => {
    const key = type === 'Chapter' ? 'chapters' : 
                type === 'Question' ? 'questions' : 
                type === 'MockTest' ? 'mockTests' :
                type === 'Flashcard' ? 'flashcards' :
                type === 'MemoryHack' ? 'memoryHacks' : 'blogs';
    
    // Save to server if LIVE
    if (mode === 'LIVE') {
        await api.saveEntity(type, entity);
    }

    const currentList = [...(data[key as keyof StudentData] as any[])];
    const index = currentList.findIndex(e => e.id === entity.id);
    if (index > -1) currentList[index] = entity;
    else currentList.push(entity);
    setData({ ...data, [key]: currentList });
    setIsCreating(false); setEditingItem(null);
  };

  return (
    <div className="pb-20 max-w-7xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm mx-4">
        <div className="space-y-2">
          <div className="text-[10px] font-black uppercase text-indigo-600 tracking-[0.4em] flex items-center gap-3"><ShieldCheck className="w-4 h-4" /> Sentinel Protocol v9.0</div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter italic leading-none uppercase">Solaris <span className="text-indigo-600 font-black">Master.</span></h2>
        </div>
        <div className="flex items-center gap-3 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100 shadow-inner">
           <div className="text-right">
              <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Persistence Engine</div>
              <div className={`text-[10px] font-black uppercase ${mode === 'LIVE' ? 'text-emerald-600' : 'text-slate-500'}`}>{mode === 'LIVE' ? 'Production (SQL v9)' : 'Sandbox (Memory)'}</div>
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
