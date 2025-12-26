
import React, { useState, useEffect } from 'react';
import JSZip from 'jszip';
import saveAs from 'file-saver';
import { StudentData, UserAccount, Subject } from '../types';
import { api } from '../services/apiService';
import { chatWithTutor, MODEL_CONFIGS } from '../services/intelligenceService';
import { 
  ShieldCheck, BookOpen, Layers, Zap, Package, Loader2,
  Plus, Trash2, Edit3, X, 
  CheckCircle2, Target, Code2, Server, 
  Cpu, Save, Users, PenTool, Activity, Send, Hammer,
  Brain, Network, Radio, FolderTree, ListOrdered, Check, Sparkles,
  ChevronRight
} from 'lucide-react';

interface AdminCMSProps {
  activeTab: string;
  data: StudentData;
  setData: (data: StudentData) => void;
}

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
    const newList = (data[key as keyof StudentData] as any[]).filter(item => item.id !== id);
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
    
    if (type === 'MockTest') {
      entity.category = 'ADMIN';
    }
    
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
    <div className="pb-20 max-w-7xl mx-auto space-y-10 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
        <div className="space-y-2">
          <div className="text-[10px] font-black uppercase text-indigo-600 tracking-[0.4em] flex items-center gap-3">
             <ShieldCheck className="w-4 h-4" /> Solaris Control: System Administration
          </div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter italic leading-none uppercase">Central <span className="text-indigo-600 font-black">Commander.</span></h2>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
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
          questions={data.questions}
          onClose={() => setIsCreating(false)} 
          onSave={(entity: any) => handleSaveEntity(creationType, entity)}
        />
      )}
    </div>
  );
};

const Overview = ({ data }: { data: StudentData }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
    <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4">
      <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
         <h3 className="text-xl font-black italic text-slate-800 flex items-center gap-3"><Users className="w-6 h-6 text-indigo-600" /> User Directory</h3>
         <button className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl hover:scale-105 transition-all"><Plus className="w-4 h-4" /> Add Student</button>
      </div>
      <div className="divide-y divide-slate-50 max-h-[600px] overflow-y-auto">
        {isLoading ? (
          <div className="p-20 flex flex-col items-center justify-center text-slate-400 gap-4"><Loader2 className="animate-spin" /> Fetching secure accounts...</div>
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
  <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4">
    <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
       <h3 className="text-xl font-black italic text-slate-800 flex items-center gap-3"><Icon className={`w-6 h-6 text-${color}-600`} /> {title}</h3>
       <button onClick={onNew} className={`bg-${color}-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-${color}-100 hover:scale-105 transition-all`}><Plus className="w-4 h-4" /> {btnLabel}</button>
    </div>
    <div className="divide-y divide-slate-50 max-h-[600px] overflow-y-auto">
      {data.length === 0 ? (
        <div className="p-20 text-center text-slate-300 font-black uppercase text-[10px] tracking-widest italic">Database is empty. Please create an entry.</div>
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
                      <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{item.subject || item.category || 'National Level'}</span>
                      <span className="text-[9px] font-black uppercase text-indigo-500 tracking-widest">{item.difficulty || (item.questionIds ? `${item.questionIds.length} Questions` : 'Standard')}</span>
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

const SystemHub = ({ data, setData }: { data: StudentData, setData: (d: StudentData) => void }) => {
  const [activeSubTab, setActiveSubTab] = useState<'ai' | 'server'>('ai');
  const [activeModelId, setActiveModelId] = useState(data.aiTutorModel || 'gemini-flash');

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
    const zip = new JSZip();
    const rootHtaccess = `# SOLARIS Hub - Apache Configuration\nRewriteEngine On\nRewriteRule ^api/(.*)$ api/index.php [QSA,L]\nRewriteRule ^index\\.html$ - [L]\nRewriteCond %{REQUEST_FILENAME} !-f\nRewriteCond %{REQUEST_FILENAME} !-d\nRewriteRule . /index.html [L]`;
    zip.file(".htaccess", rootHtaccess);
    const apiRoot = zip.folder("api")!;
    apiRoot.file("index.php", "<?php echo json_encode(['status' => 'active']); ?>");
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "solaris-production-fix.zip");
  };

  return (
    <div className="space-y-10">
      <div className="flex bg-white p-2 rounded-[2rem] border border-slate-200 shadow-sm w-fit">
         <button onClick={() => setActiveSubTab('ai')} className={`px-10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'ai' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>Intelligence Setup</button>
         <button onClick={() => setActiveSubTab('server')} className={`px-10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'server' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>Server Deployment</button>
      </div>

      {activeSubTab === 'ai' ? (
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
                  <div className="absolute top-6 right-6 bg-indigo-600 text-white p-1.5 rounded-full shadow-lg shadow-indigo-200"><Check className="w-4 h-4" /></div>
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

          <div className="bg-indigo-900 p-10 rounded-[3.5rem] text-white flex items-center justify-between shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-10 opacity-5"><Cpu className="w-48 h-48" /></div>
             <div className="space-y-2 relative z-10">
                <h4 className="text-xl font-black italic tracking-tight uppercase">Operational Security</h4>
                <p className="text-indigo-200 text-sm max-w-xl">The student interface is set to **"Silent Architecture"**. Students will see the AI as "Solaris Intelligence" regardless of the engine selected here.</p>
             </div>
             <button className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all backdrop-blur-md">Lock Configuration</button>
          </div>
        </div>
      ) : (
        <div className="space-y-10 animate-in slide-in-from-right duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-8">
               <h3 className="text-xl font-black italic flex items-center gap-3"><FolderTree className="w-6 h-6 text-indigo-600" /> Deployment Map</h3>
               <div className="font-mono text-xs p-6 bg-slate-950 text-emerald-400 rounded-3xl overflow-x-auto">
                 <pre>{`/xampp/htdocs/iitgeeprep/\n├── .htaccess\n├── assets/\n├── api/\n└── index.html`}</pre>
               </div>
            </div>
            <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-8">
               <h3 className="text-xl font-black italic flex items-center gap-3"><ListOrdered className="w-6 h-6 text-indigo-600" /> Success Steps</h3>
               <div className="space-y-4">
                  {["Run 'npm run build' locally.","Download the FIX ZIP below.","Upload everything to htdocs/your_folder/."].map((step, i) => (
                    <div key={i} className="flex items-center gap-4 group">
                       <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center font-black text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all text-[10px]">0{i+1}</div>
                       <span className="text-xs font-bold text-slate-700">{step}</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>
          <div className="bg-slate-900 rounded-[4rem] p-12 lg:p-20 text-white shadow-2xl flex justify-between items-center relative overflow-hidden">
             <div className="absolute top-0 right-0 p-12 opacity-5"><Server className="w-80 h-80" /></div>
             <h3 className="text-4xl font-black italic tracking-tighter uppercase leading-none">The Master <span className="text-indigo-500 italic font-black">Archive.</span></h3>
             <button onClick={handleDownloadBuild} className="px-10 py-5 bg-white text-slate-900 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.3em] flex items-center gap-4 hover:bg-indigo-50 transition-all shadow-2xl group"><Package className="w-6 h-6 group-hover:scale-110 transition-transform" /> Download Production Fix ZIP</button>
          </div>
        </div>
      )}
    </div>
  );
};

const CreationHub = ({ type, item, questions = [], onClose, onSave }: any) => {
  const [formData, setFormData] = useState<any>(item || {
    id: `ID-${Math.random().toString(36).substr(2, 9)}`,
    name: '', title: '', subject: 'Physics' as Subject, unit: 'UNIT 1', text: '',
    question: '', answer: '', content: '', author: 'Admin', hack: '',
    description: '', options: ['', '', '', ''], correctAnswer: 0, difficulty: 'EASY',
    category: 'ADMIN', duration: 180, totalMarks: 300, questionIds: [], chapterIds: [],
    date: new Date().toISOString().split('T')[0], status: 'PUBLISHED'
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose}></div>
      <div className="bg-white w-full max-w-5xl p-12 rounded-[4rem] shadow-2xl relative z-10 animate-in zoom-in-95 duration-300 overflow-hidden max-h-[90vh] flex flex-col">
         <button onClick={onClose} className="absolute top-10 right-10 text-slate-400 hover:text-slate-900 transition-colors"><X className="w-8 h-8" /></button>
         <h3 className="text-4xl font-black italic tracking-tighter text-slate-900 mb-10 shrink-0 uppercase leading-none">Creator: <span className="text-indigo-600 italic font-black">{type}</span></h3>
         <div className="flex-1 overflow-y-auto px-4 space-y-8 custom-scrollbar">
            {type === 'Question' ? (
              <div className="space-y-8">
                <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400 ml-6 tracking-widest">Question Text</label><textarea value={formData.text} onChange={e => setFormData({...formData, text: e.target.value})} className="w-full bg-slate-50 p-8 rounded-[2.5rem] border-none text-sm font-black italic h-32 shadow-inner" /></div>
                <div className="grid grid-cols-2 gap-4">
                  {formData.options.map((opt: string, i: number) => (
                    <div key={i} className="space-y-1"><label className="text-[9px] font-black uppercase text-slate-400 ml-6 tracking-widest">Option {String.fromCharCode(65+i)}</label><input value={opt} onChange={e => { const newOpts = [...formData.options]; newOpts[i] = e.target.value; setFormData({...formData, options: newOpts}); }} className="w-full bg-slate-50 p-5 rounded-2xl border-none text-xs font-bold" /></div>
                  ))}
                </div>
              </div>
            ) : (
               <div className="p-20 text-center bg-slate-50 rounded-[4rem] border-4 border-dashed border-slate-100 flex flex-col items-center gap-4"><Activity className="w-12 h-12 text-slate-200" /><div className="text-xs font-black uppercase text-slate-400 tracking-widest italic">Protocol setup for {type}...</div></div>
            )}
         </div>
         <div className="mt-10 flex gap-6 shrink-0">
            <button onClick={onClose} className="flex-1 py-6 bg-slate-100 text-slate-500 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] hover:bg-slate-200 transition-all">Cancel Entry</button>
            <button onClick={() => onSave(formData)} className="flex-1 py-6 bg-indigo-600 text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.4em] shadow-2xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-4 group"><Save className="w-6 h-6 group-hover:scale-110 transition-transform" /> Save to Database</button>
         </div>
      </div>
    </div>
  );
};

export default AdminCMS;
