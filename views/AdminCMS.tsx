
import React, { useState, useEffect, useRef } from 'react';
import JSZip from 'jszip';
import { StudentData, UserAccount, Subject, Question, MockTest, Chapter, Flashcard, MemoryHack, Blog } from '../types';
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
      <div className="divide-y divide-slate-50 max-h-[600px] overflow-y-auto">
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
  <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden mx-4">
    <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
       <h3 className="text-xl font-black italic text-slate-800 flex items-center gap-3"><Icon className={`w-6 h-6 text-${color}-600`} /> {title}</h3>
       <button onClick={onNew} className={`bg-${color}-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-${color}-100 hover:scale-105 transition-all`}><Plus className="w-4 h-4" /> {btnLabel}</button>
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
                <div className="max-w-xl">
                   <div className="text-sm font-bold text-slate-800 line-clamp-1 italic tracking-tight">
                     {type === 'Blog' ? item.title : type === 'Chapter' ? item.name : type === 'Question' ? item.text : type === 'Flashcard' ? item.question : item.title || item.name}
                   </div>
                   <div className="flex gap-4 mt-1">
                      <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{item.subject || item.category || 'System Node'}</span>
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
    name: '', title: '', subject: 'Physics' as Subject, unit: 'Sets, Relations and Functions', text: '',
    options: ['', '', '', ''], correctAnswer: 0, difficulty: 'EASY',
    explanation: '', author: 'Solaris Admin', content: '',
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
               <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                  {type === 'Blog' ? <PenTool className="w-7 h-7" /> : type === 'Question' ? <HelpCircle className="w-7 h-7" /> : type === 'MockTest' ? <Target className="w-7 h-7" /> : type === 'Chapter' ? <BookOpen className="w-7 h-7" /> : type === 'MemoryHack' ? <Zap className="w-7 h-7" /> : <Layers className="w-7 h-7" />}
               </div>
               <div>
                  <h3 className="text-3xl font-black italic tracking-tighter text-slate-900 uppercase">
                     {item ? 'Modify' : 'Deploy'} <span className="text-indigo-600">{type}.</span>
                  </h3>
                  <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mt-1">Operational Protocol v10.0</p>
               </div>
            </div>
            <button onClick={onClose} className="p-4 bg-white text-slate-400 hover:text-slate-900 rounded-2xl transition-all border border-slate-100"><X className="w-6 h-6" /></button>
         </div>

         <div className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar">
            {type === 'Chapter' && (
              <div className="space-y-12">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <InputGroup label="Chapter Identity"><input name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black italic text-slate-800" placeholder="Ex: Electrostatics" /></InputGroup>
                    <InputGroup label="Subject"><select name="subject" value={formData.subject} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black text-slate-800"><option value="Physics">Physics</option><option value="Chemistry">Chemistry</option><option value="Mathematics">Mathematics</option></select></InputGroup>
                 </div>
                 <InputGroup label="Unit Group"><input name="unit" value={formData.unit} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black italic" placeholder="Ex: Kinematics" /></InputGroup>
                 <InputGroup label="Theory Notes (HTML)"><textarea name="notes" value={formData.notes} onChange={handleChange} rows={10} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-medium leading-relaxed text-slate-600 focus:ring-4 focus:ring-indigo-100 transition-all" placeholder="Theory content..." /></InputGroup>
              </div>
            )}
            {/* ... Other specific types for Question, MockTest, Flashcard, Hack, Blog follow the same pattern ... */}
            {type === 'Question' && (
              <div className="space-y-12">
                 <InputGroup label="Question Text"><textarea name="text" value={formData.text} onChange={handleChange} rows={3} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-lg font-black italic text-slate-800" /></InputGroup>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {formData.options.map((opt: string, i: number) => (
                      <div key={i} className="flex items-center gap-4">
                         <button onClick={() => setFormData({...formData, correctAnswer: i})} className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl transition-all shrink-0 ${formData.correctAnswer === i ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}>{String.fromCharCode(65+i)}</button>
                         <input value={opt} onChange={(e) => handleOptionChange(i, e.target.value)} className="flex-1 bg-slate-50 border-none rounded-2xl p-6 text-sm font-bold text-slate-700" placeholder="Response text..." />
                      </div>
                    ))}
                 </div>
              </div>
            )}
         </div>

         <div className="p-10 border-t border-slate-100 flex gap-6 bg-slate-50/50 shrink-0">
            <button onClick={onClose} className="flex-1 py-6 bg-white border border-slate-200 text-slate-500 rounded-[2rem] font-black uppercase text-xs tracking-widest">Discard</button>
            <button onClick={() => onSave(formData)} className="flex-1 py-6 bg-indigo-600 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-2xl flex items-center justify-center gap-4 hover:bg-indigo-700 transition-all"><Save className="w-6 h-6" /> Finalize Node</button>
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
          <div className="text-[10px] font-black uppercase text-indigo-600 tracking-[0.4em] flex items-center gap-3"><ShieldCheck className="w-4 h-4" /> Sentinel Master v10.0</div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter italic uppercase">Solaris <span className="text-indigo-600">Admin.</span></h2>
        </div>
        <div className="flex items-center gap-3 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100 shadow-inner">
           <div className="text-right">
              <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Persistence Mode</div>
              <div className={`text-[10px] font-black uppercase ${mode === 'LIVE' ? 'text-emerald-600' : 'text-slate-500'}`}>{mode === 'LIVE' ? 'Production (SQL)' : 'Sandbox (Memory)'}</div>
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
        {activeTab === 'admin-blogs' && <EntityList title="Strategic Articles" type="Blog" data={data.blogs} icon={PenTool} color="indigo" btnLabel="New Post" onEdit={handleEdit} onDelete={handleDelete} onNew={() => { setCreationType('Blog'); setEditingItem(null); setIsCreating(true); }} />}
      </div>
      {isCreating && <CreationHub type={creationType} item={editingItem} onClose={() => setIsCreating(false)} onSave={(entity: any) => handleSaveEntity(creationType, entity)} questions={data.questions} chapters={data.chapters} />}
    </div>
  );
};
export default AdminCMS;
