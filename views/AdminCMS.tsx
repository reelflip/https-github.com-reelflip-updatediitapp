
import React, { useState, useEffect, useRef } from 'react';
import { StudentData, UserAccount, Subject, Question, MockTest, Chapter, Flashcard, MemoryHack, Blog, UserRole } from '../types';
import { api } from '../services/apiService';
import { MODEL_CONFIGS } from '../services/intelligenceService';
import JSZip from 'jszip';
import saveAs from 'file-saver';
import { 
  ShieldCheck, BookOpen, Layers, Zap, Loader2, Plus, Trash2, Edit3, X, Target, Code2, Save, Users, PenTool, Check, HelpCircle, Video, Award, Type, Lightbulb, Activity, Filter, Search, Clock, ChevronRight, Layout, List, FileText, Calendar, Globe, Settings, Cpu, Database, Cloud, Download, Eye, AlertTriangle, Star, Signal, SignalHigh, SignalLow, Activity as DiagnosticIcon, ClipboardCheck, RefreshCw, CheckCircle, ShieldAlert, FlaskConical, Map, HeartHandshake, Trash, Mail, Bell, Shield, FileBox, Heart, Bold, Italic, List as ListIcon, Heading1, Heading2, Link as LinkIcon, Maximize2, Minimize2
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
    <button onClick={() => onInsert('<h2 class="text-3xl font-black italic tracking-tighter mt-12 mb-6 uppercase">', '</h2>')} className="p-2.5 hover:bg-white/10 rounded-lg text-white transition-colors" title="Heading 2"><Heading1 className="w-4 h-4" /></button>
    <button onClick={() => onInsert('<h3 class="text-xl font-black italic tracking-tight mt-8 mb-4 uppercase">', '</h3>')} className="p-2.5 hover:bg-white/10 rounded-lg text-white transition-colors" title="Heading 3"><Heading2 className="w-4 h-4" /></button>
    <div className="w-px h-6 bg-white/10 mx-1 self-center"></div>
    <button onClick={() => onInsert('<ul class="list-disc pl-8 space-y-3 my-6"><li>', '</li></ul>')} className="p-2.5 hover:bg-white/10 rounded-lg text-white transition-colors" title="Unordered List"><ListIcon className="w-4 h-4" /></button>
    <button onClick={() => onInsert('<p class="text-slate-400 font-medium leading-relaxed italic mb-6">', '</p>')} className="p-2.5 hover:bg-white/10 rounded-lg text-white transition-colors" title="Paragraph"><Type className="w-4 h-4" /></button>
    <button onClick={() => onInsert('<a href="#" class="text-indigo-400 hover:underline">', '</a>')} className="p-2.5 hover:bg-white/10 rounded-lg text-white transition-colors" title="Link"><LinkIcon className="w-4 h-4" /></button>
  </div>
);

const CreationHub = ({ type, item, onClose, onSave, allQuestions = [], allChapters = [] }: any) => {
  const [formData, setFormData] = useState<any>(item || {
    id: item?.id || `ID-${Math.random().toString(36).substr(2, 9)}`,
    name: '', title: '', subject: 'Physics' as Subject, unit: '', text: '',
    options: ['', '', '', ''], correctAnswer: 0, difficulty: 'EASY',
    explanation: '', author: 'Solaris Admin', content: '',
    date: new Date().toISOString().split('T')[0], status: 'PUBLISHED',
    progress: 0, accuracy: 0, timeSpent: 0,
    timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0,
    question: '', answer: '', category: 'Mnemonics', hack: '',
    duration: 180, totalMarks: 300, questionIds: [], chapterIds: [],
    notes: '', videoUrl: '', coverImage: '', targetCompletionDate: '', type: 'Formula',
    highYield: false
  });

  const [previewMode, setPreviewMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
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
    
    // Focus back and set cursor
    setTimeout(() => {
      el.focus();
      const newCursor = start + tag.length + selected.length + closeTag.length;
      el.setSelectionRange(newCursor, newCursor);
    }, 0);
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
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 overflow-hidden">
      <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-500" onClick={onClose}></div>
      <div className={`bg-white w-full ${previewMode ? 'max-w-full h-full rounded-none' : 'max-w-6xl rounded-[4rem]'} transition-all duration-500 shadow-2xl relative z-10 animate-in zoom-in-95 flex flex-col overflow-hidden max-h-[95vh]`}>
         
         <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
            <div className="flex items-center gap-6">
               <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                  {type === 'Blog' ? <PenTool className="w-7 h-7" /> : type === 'Question' ? <HelpCircle className="w-7 h-7" /> : type === 'MockTest' ? <Target className="w-7 h-7" /> : type === 'Chapter' ? <BookOpen className="w-7 h-7" /> : <Layers className="w-7 h-7" />}
               </div>
               <div>
                  <h3 className="text-2xl font-black italic tracking-tighter text-slate-900 uppercase">
                     {item ? 'Modify' : 'Deploy'} <span className="text-indigo-600">{type}.</span>
                  </h3>
                  <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mt-1">Resource Architect v20.5 Pro</p>
               </div>
            </div>
            <div className="flex gap-4">
              {(type === 'Blog' || type === 'Chapter') && (
                <button 
                  onClick={() => setPreviewMode(!previewMode)} 
                  className={`p-4 rounded-2xl transition-all border flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${previewMode ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-400 border-slate-100 hover:text-slate-900'}`}
                >
                  {previewMode ? <><Minimize2 className="w-4 h-4" /> Edit Code</> : <><Eye className="w-4 h-4" /> Full Preview</>}
                </button>
              )}
              <button onClick={onClose} className="p-4 bg-white text-slate-400 hover:text-slate-900 rounded-2xl transition-all border border-slate-100"><X className="w-6 h-6" /></button>
            </div>
         </div>

         <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
            {previewMode ? (
              <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in py-10">
                 <div className="bg-slate-900 p-12 rounded-[4rem] text-white space-y-6">
                    <div className="inline-flex px-4 py-1.5 bg-indigo-600/20 text-indigo-400 border border-indigo-600/30 rounded-full text-[9px] font-black uppercase tracking-[0.4em]">Live CMS Preview</div>
                    <h1 className="text-6xl font-black italic tracking-tighter leading-none uppercase">{formData.title || formData.name || 'Untitled Document'}</h1>
                    <div className="flex gap-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                       <span>By {formData.author || 'System'}</span>
                       <span>•</span>
                       <span>{formData.date || 'Today'}</span>
                    </div>
                 </div>
                 <div className="prose prose-lg prose-slate max-w-none px-10">
                    <div dangerouslySetInnerHTML={{ __html: (type === 'Blog' ? formData.content : formData.notes) || '<p class="text-slate-300 italic">No content established for this protocol.</p>' }} />
                 </div>
              </div>
            ) : (
              <div className="space-y-12 animate-in slide-in-from-bottom-4">
                 {/* BLOG EDITOR */}
                 {type === 'Blog' && (
                    <div className="grid grid-cols-1 gap-10">
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          <div className="md:col-span-2">
                             <InputGroup label="Article Master Title">
                                <input name="title" value={formData.title} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-2xl font-black italic text-slate-800 placeholder:text-slate-200 shadow-inner" placeholder="Ex: Mastering Entropy in Thermo" />
                             </InputGroup>
                          </div>
                          <InputGroup label="Author Identity">
                             <input name="author" value={formData.author} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black italic text-slate-800 shadow-inner" />
                          </InputGroup>
                       </div>
                       
                       <div className="space-y-4">
                          <RichTextToolbar onInsert={insertTag} />
                          <InputGroup label="Manuscript Content (HTML Engine)">
                             <textarea 
                                ref={textareaRef}
                                name="content" 
                                value={formData.content} 
                                onChange={handleChange} 
                                rows={20} 
                                className="w-full bg-slate-50 border-none rounded-[3rem] p-12 text-base font-medium leading-relaxed font-mono shadow-inner focus:ring-8 focus:ring-indigo-50/50 transition-all" 
                                placeholder="<h2>Begin Transmission...</h2><p>Write your technical insights here.</p>"
                             />
                          </InputGroup>
                       </div>
                    </div>
                 )}

                 {/* CHAPTER EDITOR */}
                 {type === 'Chapter' && (
                    <div className="space-y-12">
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                          <InputGroup label="Unit Identity">
                             <input name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black italic shadow-inner" placeholder="Ex: Wave Optics" />
                          </InputGroup>
                          <InputGroup label="Syllabus Subject">
                             <select name="subject" value={formData.subject} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black shadow-inner">
                                <option value="Physics">Physics</option>
                                <option value="Chemistry">Chemistry</option>
                                <option value="Mathematics">Mathematics</option>
                             </select>
                          </InputGroup>
                          <div className="flex items-end pb-2">
                             <label className="flex items-center gap-4 cursor-pointer group">
                                <input type="checkbox" name="highYield" checked={formData.highYield} onChange={handleChange} className="w-6 h-6 rounded-lg text-indigo-600 border-slate-200 focus:ring-indigo-500" />
                                <span className="text-[10px] font-black uppercase text-slate-400 group-hover:text-indigo-600 transition-colors tracking-widest">High Yield Topic?</span>
                             </label>
                          </div>
                       </div>
                       
                       <InputGroup label="Theory Manuscript (HTML enabled)">
                          <RichTextToolbar onInsert={insertTag} />
                          <textarea 
                             ref={textareaRef}
                             name="notes" 
                             value={formData.notes} 
                             onChange={handleChange} 
                             rows={12} 
                             className="w-full bg-slate-50 border-none rounded-[2.5rem] p-10 text-sm font-mono shadow-inner" 
                             placeholder="Detailed concepts and formulas..."
                          />
                       </InputGroup>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                          <InputGroup label="Lecture Stream URL">
                             <div className="relative">
                                <Globe className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                <input name="videoUrl" value={formData.videoUrl} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 pl-14 text-sm font-black italic shadow-inner" placeholder="https://youtube.com/..." />
                             </div>
                          </InputGroup>
                          <InputGroup label="Target Completion">
                             <div className="relative">
                                <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                <input type="date" name="targetCompletionDate" value={formData.targetCompletionDate} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 pl-14 text-sm font-black shadow-inner" />
                             </div>
                          </InputGroup>
                       </div>
                    </div>
                 )}

                 {/* QUESTION EDITOR */}
                 {type === 'Question' && (
                    <div className="space-y-10">
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                          <InputGroup label="Subject">
                             <select name="subject" value={formData.subject} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black shadow-inner"><option value="Physics">Physics</option><option value="Chemistry">Chemistry</option><option value="Mathematics">Mathematics</option></select>
                          </InputGroup>
                          <InputGroup label="Complexity">
                             <select name="difficulty" value={formData.difficulty} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black shadow-inner"><option value="EASY">EASY</option><option value="MEDIUM">MEDIUM</option><option value="HARD">HARD</option></select>
                          </InputGroup>
                          <InputGroup label="Link to Chapter">
                             <select name="topicId" value={formData.topicId} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black shadow-inner">
                                <option value="">Select Chapter</option>
                                {allChapters.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                             </select>
                          </InputGroup>
                       </div>
                       <InputGroup label="Problem Text">
                          <textarea name="text" value={formData.text} onChange={handleChange} rows={5} className="w-full bg-slate-50 border-none rounded-3xl p-8 text-xl font-black italic text-slate-800 shadow-inner" placeholder="Numerical or Conceptual problem statement..." />
                       </InputGroup>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {formData.options.map((opt: string, i: number) => (
                            <div key={i} className="space-y-2">
                               <div className="flex justify-between items-center ml-2">
                                  <label className="text-[10px] font-black uppercase text-slate-400">Option {String.fromCharCode(65+i)}</label>
                                  <button onClick={() => setFormData({...formData, correctAnswer: i})} className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest transition-all ${formData.correctAnswer === i ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}>{formData.correctAnswer === i ? 'Correct Choice' : 'Set as Correct'}</button>
                               </div>
                               <input value={opt} onChange={(e) => handleOptionChange(i, e.target.value)} className={`w-full p-6 rounded-2xl text-sm font-bold border-2 transition-all ${formData.correctAnswer === i ? 'border-emerald-500 bg-emerald-50/10' : 'bg-slate-50 border-transparent shadow-inner'}`} placeholder={`Option ${String.fromCharCode(65+i)} text...`} />
                            </div>
                          ))}
                       </div>
                       <InputGroup label="Master Explanation (Rich Context)">
                          <textarea name="explanation" value={formData.explanation} onChange={handleChange} rows={4} className="w-full bg-slate-50 border-none rounded-3xl p-8 text-sm font-medium italic text-slate-600 shadow-inner" placeholder="Derivation steps or logical breakdown..." />
                       </InputGroup>
                    </div>
                 )}

                 {/* MOCK TEST EDITOR */}
                 {type === 'MockTest' && (
                    <div className="space-y-12">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                          <InputGroup label="Exam Official Identity">
                             <input name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black italic shadow-inner" placeholder="Ex: Session 1 - Rank Booster" />
                          </InputGroup>
                          <div className="grid grid-cols-2 gap-6">
                             <InputGroup label="Duration (Mins)">
                                <input type="number" name="duration" value={formData.duration} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black shadow-inner" />
                             </InputGroup>
                             <InputGroup label="Total Marks">
                                <input type="number" name="totalMarks" value={formData.totalMarks} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black shadow-inner" />
                             </InputGroup>
                          </div>
                       </div>
                       <div className="space-y-6">
                          <div className="flex justify-between items-end px-2">
                             <div>
                                <h4 className="text-sm font-black italic uppercase text-slate-800">Question Assembly ({formData.questionIds?.length || 0})</h4>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Select items from Global Bank</p>
                             </div>
                             <div className="relative w-64">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
                                <input type="text" placeholder="Search Bank..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none border border-slate-100" />
                             </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                             {filteredQuestions.map((q: any) => (
                               <div key={q.id} onClick={() => toggleQuestionSelection(q.id)} className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-6 ${formData.questionIds?.includes(q.id) ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl scale-[1.01]' : 'bg-white border-slate-50 hover:border-indigo-200'}`}>
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${formData.questionIds?.includes(q.id) ? 'bg-white text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                                     {formData.questionIds?.includes(q.id) ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                  </div>
                                  <div className="min-w-0">
                                     <div className="text-xs font-black italic line-clamp-1">{q.text}</div>
                                     <div className={`text-[8px] font-black uppercase mt-1 ${formData.questionIds?.includes(q.id) ? 'text-indigo-200' : 'text-slate-400'}`}>{q.subject} • {q.difficulty}</div>
                                  </div>
                               </div>
                             ))}
                          </div>
                       </div>
                    </div>
                 )}

                 {/* FLASHCARD / HACK EDITOR */}
                 {(type === 'Flashcard' || type === 'MemoryHack') && (
                    <div className="space-y-10">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                          <InputGroup label={type === 'Flashcard' ? "Flashcard Front (Concept/Formula)" : "Strategic Mnemonic Title"}>
                             <input name={type === 'Flashcard' ? 'question' : 'title'} value={type === 'Flashcard' ? formData.question : formData.title} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black italic shadow-inner" />
                          </InputGroup>
                          <InputGroup label="Subject Mapping">
                             <select name="subject" value={formData.subject} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black shadow-inner"><option value="Physics">Physics</option><option value="Chemistry">Chemistry</option><option value="Mathematics">Mathematics</option></select>
                          </InputGroup>
                       </div>
                       <InputGroup label={type === 'Flashcard' ? "Flashcard Back (Technical Answer)" : "Mnemonic Protocol (The Hack)"}>
                          <textarea name={type === 'Flashcard' ? 'answer' : 'hack'} value={type === 'Flashcard' ? formData.answer : formData.hack} onChange={handleChange} rows={5} className="w-full bg-slate-900 border-none rounded-[2.5rem] p-12 text-2xl font-black italic text-indigo-400 shadow-2xl focus:ring-8 focus:ring-indigo-100" placeholder="Encode answer..." />
                       </InputGroup>
                    </div>
                 )}
              </div>
            )}
         </div>

         <div className="p-8 md:p-10 border-t border-slate-100 flex flex-col md:flex-row gap-6 bg-slate-50/50 shrink-0">
            <button onClick={onClose} className="flex-1 py-6 bg-white border border-slate-200 text-slate-500 rounded-[2rem] font-black uppercase text-[10px] tracking-widest hover:bg-slate-100 transition-all">Abort Protocol</button>
            <button onClick={() => onSave(formData)} className="flex-[2] py-6 bg-indigo-600 text-white rounded-[2rem] font-black uppercase text-[10px] tracking-[0.4em] shadow-2xl shadow-indigo-100 flex items-center justify-center gap-4 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all"><Save className="w-6 h-6" /> Synchronize Context to Production</button>
         </div>
      </div>
    </div>
  );
};

// --- MAIN ADMIN COMPONENT ---

const AdminCMS: React.FC<AdminCMSProps> = ({ activeTab, data, setData }) => {
  const mode = api.getMode();
  const [activeModel, setActiveModel] = useState(localStorage.getItem('jeepro_platform_ai_model') || 'gemini-3-flash');
  const [isDownloading, setIsDownloading] = useState(false);
  const [connStatus, setConnStatus] = useState<'idle' | 'checking' | 'online' | 'offline'>('idle');

  // Unified state for editors
  const [isCreating, setIsCreating] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [creationType, setCreationType] = useState<string>('Question');

  const updateModel = (id: string) => {
    localStorage.setItem('jeepro_platform_ai_model', id);
    setActiveModel(id);
  };

  const testConnection = async () => {
    if (mode !== 'LIVE') return;
    setConnStatus('checking');
    try {
      const res = await fetch('./api/check_connection.php');
      const result = await res.json();
      setConnStatus(result.success ? 'online' : 'offline');
    } catch (err) {
      setConnStatus('offline');
    }
  };

  const resetSystem = () => {
    if (confirm("Reset local cache and mode to Sandbox?")) {
        localStorage.clear();
        window.location.reload();
    }
  }

  useEffect(() => {
    if (mode === 'LIVE') testConnection();
  }, [mode]);

  const handleEdit = (type: string, item: any) => {
    setCreationType(type); 
    setEditingItem(item); 
    setIsCreating(true);
  };

  const handleDelete = (type: string, id: string) => {
    if (!confirm(`Permanently purge this ${type}?`)) return;
    const keyMap: Record<string, keyof StudentData> = {
      'Chapter': 'chapters', 'Question': 'questions', 'MockTest': 'mockTests', 
      'Flashcard': 'flashcards', 'MemoryHack': 'memoryHacks', 'Blog': 'blogs'
    };
    const key = keyMap[type];
    if (!key) return;
    const newList = (data[key] as any[]).filter((item: any) => item.id !== id);
    setData({ ...data, [key]: newList });
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
        if (!result.success) { alert(`Persistence Failure: ${result.error}`); return; }
    }

    const currentList = [...(data[key] as any[])];
    const index = currentList.findIndex(e => e.id === entity.id);
    if (index > -1) currentList[index] = entity; else currentList.push(entity);
    
    setData({ ...data, [key]: currentList });
    setIsCreating(false); 
    setEditingItem(null);
  };

  const downloadProductionBackend = async () => {
    setIsDownloading(true);
    try {
      const zip = new JSZip();
      const sqlSchema = `-- IITGEEPREP MASTER SCHEMA v20.5 (Comprehensive)
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
CREATE DATABASE IF NOT EXISTS iitgrrprep_v20;
USE iitgrrprep_v20;
CREATE TABLE users (id VARCHAR(50) PRIMARY KEY, name VARCHAR(100), email VARCHAR(100) UNIQUE, password VARCHAR(255), role ENUM('STUDENT','PARENT','ADMIN'), institute VARCHAR(255), targetExam VARCHAR(100), targetYear VARCHAR(4), birthDate DATE, gender VARCHAR(20), routine_json JSON, smartplan_json JSON, connected_id VARCHAR(50), createdAt DATETIME DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE chapters (id VARCHAR(50) PRIMARY KEY, subject VARCHAR(50), unit VARCHAR(100), name VARCHAR(255), notes LONGTEXT, videoUrl VARCHAR(255), highYield TINYINT(1));
CREATE TABLE questions (id VARCHAR(50) PRIMARY KEY, topicId VARCHAR(50), subject VARCHAR(50), text TEXT, options JSON, correctAnswer INT, explanation TEXT, difficulty ENUM('EASY','MEDIUM','HARD'));
CREATE TABLE mock_tests (id VARCHAR(50) PRIMARY KEY, name VARCHAR(255), duration INT, totalMarks INT, category VARCHAR(50), questionIds TEXT, chapterIds TEXT);
CREATE TABLE blogs (id VARCHAR(50) PRIMARY KEY, title VARCHAR(255), content LONGTEXT, author VARCHAR(100), date DATE, status ENUM('DRAFT','PUBLISHED'));
COMMIT;`;
      zip.folder("sql")?.file("master_schema_v20.sql", sqlSchema);
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "solaris_v20_complete_backend.zip");
    } catch (e) { alert("Bundle generation failed."); }
    setIsDownloading(false);
  };

  return (
    <div className="pb-32 max-w-7xl mx-auto space-y-10 px-4">
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 bg-white p-12 rounded-[3.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5"><ShieldCheck className="w-64 h-64" /></div>
        <div className="space-y-4 relative z-10">
          <div className="text-[10px] font-black uppercase text-indigo-600 tracking-[0.5em] flex items-center gap-3"><ShieldCheck className="w-5 h-5" /> Unified Admin Node v10.5</div>
          <h2 className="text-7xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">SENTINEL <span className="text-indigo-600">CORE.</span></h2>
        </div>
        <div className="flex items-center gap-4 bg-slate-50 px-8 py-4 rounded-[2rem] border border-slate-100 shadow-inner relative z-10">
           <div className="text-right">
              <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Environment</div>
              <div className={`text-[10px] font-black uppercase tracking-widest ${mode === 'LIVE' ? 'text-emerald-600' : 'text-amber-500'}`}>{mode === 'LIVE' ? 'Production (SQL)' : 'Sandbox Mode'}</div>
           </div>
           <button onClick={() => api.setMode(mode === 'MOCK' ? 'LIVE' : 'MOCK')} className={`w-16 h-9 rounded-full p-1.5 transition-all duration-500 relative shadow-inner ${mode === 'LIVE' ? 'bg-emerald-500' : 'bg-slate-300'}`}><div className={`w-6 h-6 bg-white rounded-full shadow-lg transition-transform duration-500 transform ${mode === 'LIVE' ? 'translate-x-7' : 'translate-x-0'}`}></div></button>
        </div>
      </div>

      <div className="space-y-12 animate-in fade-in duration-700">
        {activeTab === 'admin-overview' && (
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
        )}
        
        {activeTab === 'admin-users' && <EntityList title="Identity Directory" type="User" data={Object.values(MODEL_CONFIGS).map((m,i)=>({id:i, name:m.name, type:m.tag}))} icon={Users} color="indigo" />}
        
        {activeTab === 'admin-syllabus' && <EntityList title="Syllabus Architecture" type="Chapter" data={data.chapters} icon={BookOpen} color="indigo" btnLabel="Deploy Unit" onEdit={handleEdit} onDelete={handleDelete} onNew={() => { setCreationType('Chapter'); setEditingItem(null); setIsCreating(true); }} />}
        
        {activeTab === 'admin-questions' && <EntityList title="Strategic Question Bank" type="Question" data={data.questions} icon={Code2} color="emerald" btnLabel="Register MCQ" onEdit={handleEdit} onDelete={handleDelete} onNew={() => { setCreationType('Question'); setEditingItem(null); setIsCreating(true); }} />}
        
        {activeTab === 'admin-tests' && <EntityList title="Examination Matrix" type="MockTest" data={data.mockTests} icon={Target} color="rose" btnLabel="Assemble Exam" onEdit={handleEdit} onDelete={handleDelete} onNew={() => { setCreationType('MockTest'); setEditingItem(null); setIsCreating(true); }} />}
        
        {activeTab === 'admin-flashcards' && <EntityList title="Recall Engine" type="Flashcard" data={data.flashcards} icon={Layers} color="blue" btnLabel="Encode Card" onEdit={handleEdit} onDelete={handleDelete} onNew={() => { setCreationType('Flashcard'); setEditingItem(null); setIsCreating(true); }} />}
        
        {activeTab === 'admin-hacks' && <EntityList title="Mnemonic Vault" type="MemoryHack" data={data.memoryHacks} icon={Zap} color="amber" btnLabel="Commit Hack" onEdit={handleEdit} onDelete={handleDelete} onNew={() => { setCreationType('MemoryHack'); setEditingItem(null); setIsCreating(true); }} />}
        
        {activeTab === 'admin-blogs' && <EntityList title="Intelligence Strategy Feed" type="Blog" data={data.blogs} icon={PenTool} color="indigo" btnLabel="Draft Manuscript" onEdit={handleEdit} onDelete={handleDelete} onNew={() => { setCreationType('Blog'); setEditingItem(null); setIsCreating(true); }} />}

        {activeTab === 'admin-system' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 px-4">
                <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-sm space-y-10">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner"><Cpu className="w-7 h-7" /></div>
                        <div>
                            <h3 className="text-2xl font-black italic tracking-tighter text-slate-900 uppercase">Intelligence Hub</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform Orchestration</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        {Object.entries(MODEL_CONFIGS).map(([id, cfg]) => (
                            <button key={id} onClick={() => updateModel(id)} className={`p-6 rounded-[2rem] border-2 text-left transition-all flex items-center justify-between ${activeModel === id ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-50 hover:border-indigo-200'}`}>
                                <div className="flex items-center gap-5">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${activeModel === id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>{cfg.name[0]}</div>
                                    <div><div className="text-sm font-black text-slate-800">{cfg.name}</div><div className="text-[9px] font-bold text-slate-400 uppercase">{cfg.desc}</div></div>
                                </div>
                                {activeModel === id && <Check className="w-5 h-5 text-indigo-600" />}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="space-y-8">
                    <div className="bg-slate-900 p-12 rounded-[4rem] text-white shadow-2xl space-y-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform duration-[4s]"><Database className="w-48 h-48" /></div>
                        <div className="flex justify-between items-start">
                            <div><h3 className="text-2xl font-black italic tracking-tighter uppercase leading-none">Uplink Status</h3><p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">v20.5 Persistence</p></div>
                            <button onClick={resetSystem} className="p-3 bg-rose-500/20 text-rose-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm flex items-center gap-2 text-[8px] font-black uppercase tracking-widest"><Trash className="w-4 h-4" /> Reset</button>
                        </div>
                        <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/10">
                            <div className="flex items-center gap-4">
                                <div className={`w-3 h-3 rounded-full animate-pulse ${mode === 'LIVE' ? (connStatus === 'online' ? 'bg-emerald-500' : 'bg-rose-500') : 'bg-slate-500'}`}></div>
                                <div className="text-sm font-bold uppercase tracking-widest">{mode === 'LIVE' ? 'Production (SQL)' : 'Sandbox Mode'}</div>
                            </div>
                            <button onClick={() => api.setMode(mode === 'MOCK' ? 'LIVE' : 'MOCK')} className={`w-14 h-7 rounded-full p-1 transition-all duration-500 ${mode === 'LIVE' ? 'bg-emerald-500' : 'bg-slate-700'}`}><div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-500 transform ${mode === 'LIVE' ? 'translate-x-7' : 'translate-x-0'}`}></div></button>
                        </div>
                        <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white space-y-4">
                            <h3 className="text-lg font-black italic tracking-tighter uppercase leading-none">Deployment Bundle</h3>
                            <p className="text-xs text-indigo-100">Download the complete set of 24 tables and all supporting PHP files for deployment.</p>
                            <button onClick={downloadProductionBackend} disabled={isDownloading} className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-3">
                                {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Download className="w-4 h-4" /> Download v20.5 ZIP</>}
                            </button>
                        </div>
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
  <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden mx-4 animate-in fade-in duration-500">
    <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/30">
       <h3 className="text-xl font-black italic text-slate-800 flex items-center gap-3"><Icon className={`w-6 h-6 text-${color}-600`} /> {title}</h3>
       {onNew && (
         <button onClick={onNew} className={`bg-${color}-600 text-white px-8 py-3 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-${color}-100 hover:scale-105 active:scale-95 transition-all`}><Plus className="w-4 h-4" /> {btnLabel}</button>
       )}
    </div>
    <div className="divide-y divide-slate-50 max-h-[600px] overflow-y-auto custom-scrollbar">
      {!data || data.length === 0 ? (
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

export default AdminCMS;
