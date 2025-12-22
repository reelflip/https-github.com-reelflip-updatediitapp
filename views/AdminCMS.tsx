
import React, { useState, useEffect } from 'react';
import { StudentData, Question, MockTest, Chapter, Blog, Flashcard, MemoryHack, Subject, ChapterStatus, UserAccount, SystemEvent, UserRole } from '../types';
import { api } from '../services/apiService';
import { 
  ShieldCheck, Settings, Database, Activity,
  CheckCircle, AlertCircle, Users, BookOpen,
  FileText, Layers, RefreshCw, Brain,
  UserPlus, FileCode, CheckCircle2,
  CloudUpload, Terminal, Code, Copy, Download,
  Trash2, ArrowLeft,
  Cpu, Zap, Power,
  Shield, Server as ServerIcon, Globe as GlobeIcon, FileJson, Laptop, Info, FileCode as FileCodeIcon,
  HardDrive as StorageIcon, Share2, Key, Plus, Trash, Search, Edit3,
  Database as DbIcon,
  Loader2, ChevronRight
} from 'lucide-react';

interface AdminCMSProps {
  activeTab: string;
  data: StudentData;
  setData: (data: StudentData) => void;
}

const AdminCMS: React.FC<AdminCMSProps> = ({ activeTab, data, setData }) => {
  const [contentSubTab, setContentSubTab] = useState<'flashcards' | 'hacks'>('flashcards');
  const [systemSubTab, setSystemSubTab] = useState<'ai' | 'deploy' | 'db-util'>('ai');
  const [diagTab, setDiagTab] = useState<'integrity' | 'db-checker' | 'functional-verify'>('integrity');
  const [isCreating, setIsCreating] = useState(false);
  const [creationType, setCreationType] = useState<'questions' | 'flashcards' | 'hacks' | 'chapter' | 'tests' | 'blog'>('questions');

  const updateGlobalData = (key: keyof StudentData, newValue: any) => {
    setData({ ...data, [key]: newValue });
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'admin-overview': return <Overview data={data} />;
      case 'admin-users': return <UserManagement />;
      case 'admin-syllabus': return <SyllabusManagement data={data} setIsCreating={setIsCreating} setCreationType={setCreationType} updateGlobalData={updateGlobalData} />;
      case 'admin-questions': return <QuestionBankManager data={data} updateGlobalData={updateGlobalData} setIsCreating={setIsCreating} setCreationType={setCreationType} />;
      case 'admin-content': return <ContentManager data={data} updateGlobalData={updateGlobalData} contentSubTab={contentSubTab} setContentSubTab={setContentSubTab} setIsCreating={setIsCreating} setCreationType={setCreationType} />;
      case 'admin-blog': return <BlogManager data={data} updateGlobalData={updateGlobalData} setIsCreating={setIsCreating} setCreationType={setCreationType} />;
      case 'admin-inbox': return <InboxView data={data} />;
      case 'admin-diagnostics': return <DiagnosticsModule data={data} diagTab={diagTab} setDiagTab={setDiagTab} />;
      case 'admin-tests': return <MockTestManager data={data} updateGlobalData={updateGlobalData} setIsCreating={setIsCreating} setCreationType={setCreationType} />;
      case 'admin-system': return <SystemModule data={data} updateGlobalData={updateGlobalData} systemSubTab={systemSubTab} setSystemSubTab={setSystemSubTab} />;
      default: return <Overview data={data} />;
    }
  };

  return (
    <div className="pb-20 max-w-7xl mx-auto space-y-10">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <div className="text-[10px] font-black uppercase text-indigo-600 tracking-[0.4em] flex items-center gap-3">
             <ShieldCheck className="w-4 h-4" /> Root Administrative Access
          </div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter italic">IITGEEPREP Console.</h2>
        </div>
      </div>
      
      {renderActiveTab()}
      {isCreating && <CreationHub creationType={creationType} setIsCreating={setIsCreating} data={data} updateGlobalData={updateGlobalData} />}
    </div>
  );
};

// --- SUB-COMPONENTS ---

const Overview = ({ data }: { data: StudentData }) => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { label: 'Total Users', value: api.getAccounts().length.toString(), icon: Users, color: 'indigo' },
        { label: 'Sync Events', value: api.getEvents().length.toString(), icon: Activity, color: 'emerald' },
        { label: 'Question Bank', value: data.questions.length.toString(), icon: FileCode, color: 'blue' },
        { label: 'Master Coverage', value: '62%', icon: BookOpen, color: 'rose' },
      ].map((stat, i) => (
        <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex items-center justify-between group hover:border-indigo-400 transition-all">
          <div><div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</div><div className="text-3xl font-black text-slate-900 mt-1">{stat.value}</div></div>
          <div className={`w-12 h-12 bg-${stat.color}-50 text-${stat.color}-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}><stat.icon className="w-6 h-6" /></div>
        </div>
      ))}
    </div>
    
    <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-10"><Cpu className="w-48 h-48" /></div>
      <div className="relative z-10 flex items-center gap-8">
        <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center shadow-2xl">
          <Zap className="w-10 h-10 text-white" />
        </div>
        <div>
          <h3 className="text-3xl font-black italic tracking-tight">System Operational Efficiency: 98.4%</h3>
          <p className="text-slate-400 text-sm mt-1">All database shards are synchronized. AI reasoning nodes are in standby.</p>
        </div>
      </div>
    </div>
  </div>
);

const UserManagement = () => {
  const [accounts, setAccounts] = useState<UserAccount[]>([]);
  useEffect(() => { setAccounts(api.getAccounts()); }, []);
  return (
    <div className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-10 border-b flex justify-between items-center bg-slate-50/50">
        <div><h3 className="text-2xl font-black italic">Platform Directory</h3></div>
        <div className="flex gap-4">
           <button className="bg-white border border-slate-200 p-3 rounded-xl hover:bg-slate-50 transition-all shadow-sm"><Search className="w-5 h-5 text-slate-400" /></button>
           <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700">Add User Manual</button>
        </div>
      </div>
      <table className="w-full text-left">
        <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400"><tr><th className="px-10 py-6">Identity</th><th className="px-10 py-6">Role</th><th className="px-10 py-6 text-right">Unique ID</th></tr></thead>
        <tbody>
          {accounts.map((u, i) => (
            <tr key={i} className="border-b transition-colors hover:bg-slate-50"><td className="px-10 py-6 font-bold flex items-center gap-3"><div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-[10px] text-slate-400">{u.name[0]}</div>{u.name}</td><td className="px-10 py-6 text-xs font-black text-indigo-600">{u.role}</td><td className="px-10 py-6 text-right font-mono text-xs text-slate-400">{u.id}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const SyllabusManagement = ({ data, setIsCreating, setCreationType, updateGlobalData }: any) => {
  const handleDelete = async (id: string) => {
    if (confirm('Delete this chapter?')) {
      updateGlobalData('chapters', data.chapters.filter((c: Chapter) => c.id !== id));
    }
  };

  return (
    <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm p-10 space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-black italic">Master Syllabus (v17.0 Global)</h3>
        <button 
          onClick={() => { setCreationType('chapter'); setIsCreating(true); }}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100"
        >
          <Plus className="w-4 h-4" /> Add Chapter
        </button>
      </div>
      <div className="divide-y border-t border-slate-100">
        {data.chapters.map((ch: Chapter) => (
          <div key={ch.id} className="py-6 flex justify-between items-center hover:bg-slate-50 transition-colors px-4 rounded-2xl group">
            <div className="flex items-center gap-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black ${ch.subject === 'Physics' ? 'bg-blue-50 text-blue-600' : ch.subject === 'Chemistry' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {ch.subject[0]}
              </div>
              <div>
                <div className="font-black text-slate-800 text-lg italic tracking-tight">{ch.name}</div>
                <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-3 mt-1">
                  <span className="text-indigo-600">{ch.subject}</span>
                  <span>•</span>
                  <span>{ch.unit}</span>
                  <span>•</span>
                  <span>ID: {ch.id}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-3 text-slate-400 hover:bg-white hover:text-indigo-600 rounded-xl transition-all shadow-sm"><Edit3 className="w-5 h-5" /></button>
              <button onClick={() => handleDelete(ch.id)} className="p-3 text-rose-400 hover:bg-white hover:text-rose-600 rounded-xl transition-all shadow-sm"><Trash className="w-5 h-5" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const QuestionBankManager = ({ data, updateGlobalData, setIsCreating, setCreationType }: any) => {
  const handleDelete = (id: string) => {
    if (confirm('Delete question?')) {
      updateGlobalData('questions', data.questions.filter((q: Question) => q.id !== id));
    }
  };

  return (
    <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm p-10 space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-black italic">Global Question Repository</h3>
        <button 
          onClick={() => { setCreationType('questions'); setIsCreating(true); }}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100"
        >
          <Plus className="w-4 h-4" /> New Question
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {data.questions.map((q: Question) => (
          <div key={q.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-indigo-400 hover:bg-white transition-all group">
            <div className="flex-1">
              <div className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">{q.subject} • {q.difficulty}</div>
              <div className="font-bold text-slate-800 line-clamp-1">{q.text}</div>
            </div>
            <div className="flex items-center gap-6">
               <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{q.topicId}</div>
               <button onClick={() => handleDelete(q.id)} className="text-rose-500 opacity-0 group-hover:opacity-100 transition-all hover:scale-110"><Trash className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ContentManager = ({ data, updateGlobalData, contentSubTab, setContentSubTab, setIsCreating, setCreationType }: any) => {
  return (
    <div className="space-y-8">
      <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit">
        <button onClick={() => setContentSubTab('flashcards')} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${contentSubTab === 'flashcards' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>Flashcards</button>
        <button onClick={() => setContentSubTab('hacks')} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${contentSubTab === 'hacks' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>Memory Hacks</button>
      </div>

      <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-10">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-black italic capitalize tracking-tight">{contentSubTab} Intelligence Library</h3>
          <button 
            onClick={() => { setCreationType(contentSubTab === 'flashcards' ? 'flashcards' : 'hacks'); setIsCreating(true); }}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl"
          >
            <Plus className="w-4 h-4" /> Add New Entry
          </button>
        </div>

        {contentSubTab === 'flashcards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.flashcards.map((f: Flashcard) => (
              <div key={f.id} className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 flex justify-between group hover:border-indigo-200 hover:bg-white transition-all">
                <div>
                   <div className="text-[10px] font-black text-indigo-600 mb-2 uppercase tracking-widest">{f.type} • {f.difficulty}</div>
                   <div className="font-bold text-slate-800 text-lg leading-tight">{f.question}</div>
                </div>
                <button onClick={() => updateGlobalData('flashcards', data.flashcards.filter((c: Flashcard) => c.id !== f.id))} className="text-rose-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"><Trash className="w-5 h-5" /></button>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.memoryHacks.map((h: MemoryHack) => (
              <div key={h.id} className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 flex justify-between group hover:border-emerald-200 hover:bg-white transition-all">
                <div>
                   <div className="text-[10px] font-black text-emerald-600 mb-2 uppercase tracking-widest">{h.category}</div>
                   <div className="font-bold text-slate-800 text-lg italic">{h.title}</div>
                   <p className="text-xs text-slate-500 mt-2 italic">"{h.hack}"</p>
                </div>
                <button onClick={() => updateGlobalData('memoryHacks', data.memoryHacks.filter((c: MemoryHack) => c.id !== h.id))} className="text-rose-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"><Trash className="w-5 h-5" /></button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const MockTestManager = ({ data, updateGlobalData, setIsCreating, setCreationType }: any) => {
  return (
    <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-sm p-10 space-y-10">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-black italic tracking-tight">Mock Test Management</h3>
        <button 
          onClick={() => { setCreationType('tests'); setIsCreating(true); }}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100"
        >
          <Plus className="w-4 h-4" /> Create Test Instance
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.mockTests.map((t: MockTest) => (
          <div key={t.id} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex justify-between items-center hover:shadow-lg transition-all group">
             <div>
                <div className="font-black text-xl italic tracking-tight text-slate-800">{t.name}</div>
                <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-2">{t.duration} Mins • {t.questionIds.length} Questions</div>
             </div>
             <button onClick={() => updateGlobalData('mockTests', data.mockTests.filter((mt: MockTest) => mt.id !== t.id))} className="p-4 bg-white text-rose-500 rounded-2xl shadow-sm hover:bg-rose-500 hover:text-white transition-all"><Trash className="w-5 h-5" /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

const BlogManager = ({ data, updateGlobalData, setIsCreating, setCreationType }: any) => {
  return (
    <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-sm p-10 space-y-10">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-black italic tracking-tight">Intelligence Feed Editor</h3>
        <button 
          onClick={() => { setCreationType('blog'); setIsCreating(true); }}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100"
        >
          <Plus className="w-4 h-4" /> New Tactical Report
        </button>
      </div>
      <div className="space-y-4">
        {data.blogs.map((b: Blog) => ( b.id &&
          <div key={b.id} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex justify-between items-center group hover:bg-white hover:border-indigo-200 transition-all">
             <div>
                <div className="font-black text-slate-800 text-lg italic leading-none">{b.title}</div>
                <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-3 flex items-center gap-3">
                   <span>{b.date}</span>
                   <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                   <span className="text-indigo-600">{b.status}</span>
                </div>
             </div>
             <button onClick={() => updateGlobalData('blogs', data.blogs.filter((bl: Blog) => bl.id !== b.id))} className="text-rose-400 hover:text-rose-600 p-2 opacity-0 group-hover:opacity-100 transition-opacity"><Trash className="w-5 h-5" /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

const InboxView = ({ data }: any) => (
  <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-sm p-10 space-y-10">
    <h3 className="text-2xl font-black italic tracking-tight">Platform Transmissions</h3>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {data.messages.map((m: any) => (
        <div key={m.id} className="p-10 bg-slate-50 rounded-[3rem] border-l-[12px] border-indigo-600 shadow-inner relative group hover:bg-white hover:border-indigo-400 transition-all">
           <div className="flex justify-between mb-4">
              <span className="font-black text-xl text-slate-900 tracking-tight">{m.name}</span>
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{m.date}</span>
           </div>
           <div className="text-[10px] font-black text-indigo-600 mb-4 uppercase tracking-[0.2em]">{m.subject}</div>
           <p className="text-sm text-slate-600 font-medium leading-relaxed italic border-t border-slate-100 pt-4">"{m.message}"</p>
           <button className="absolute top-10 right-10 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity"><ChevronRight className="w-6 h-6" /></button>
        </div>
      ))}
    </div>
  </div>
);

const DiagnosticsModule = ({ data, diagTab, setDiagTab }: any) => {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit border border-slate-200 shadow-inner">
        {[
          { id: 'integrity', label: 'Data Integrity', icon: ShieldCheck },
          { id: 'db-checker', label: 'DB Cluster health', icon: Activity },
          { id: 'functional-verify', label: 'Node Verification', icon: Terminal }
        ].map((t) => (
          <button key={t.id} onClick={() => setDiagTab(t.id as any)} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${diagTab === t.id ? 'bg-white text-indigo-600 shadow-xl' : 'text-slate-500 hover:text-slate-900'}`}><t.icon className="w-3.5 h-3.5" />{t.label}</button>
        ))}
      </div>

      <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-sm space-y-10">
         <div className="flex items-center gap-5 border-b border-slate-100 pb-8">
            <div className="w-16 h-16 bg-slate-900 text-white rounded-[1.5rem] flex items-center justify-center shadow-2xl">
               <Cpu className="w-8 h-8" />
            </div>
            <div>
               <h3 className="text-2xl font-black italic tracking-tight uppercase">Platform Diagnostics Core</h3>
               <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] mt-1">Status: Sector {diagTab.toUpperCase()} ACTIVE</p>
            </div>
         </div>
         
         <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-3">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Shards Processed</div>
                  <div className="text-4xl font-black text-slate-900">4,120</div>
                  <div className="text-xs text-emerald-500 font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3" /> VERIFIED</div>
               </div>
               <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-3">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Latency Node</div>
                  <div className="text-4xl font-black text-slate-900">24ms</div>
                  <div className="text-xs text-indigo-500 font-bold flex items-center gap-1"><Zap className="w-3 h-3" /> OPTIMAL</div>
               </div>
               <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-3">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sync Drifts</div>
                  <div className="text-4xl font-black text-slate-900">0.00%</div>
                  <div className="text-xs text-slate-400 font-bold flex items-center gap-1"><Target className="w-3 h-3" /> STABLE</div>
               </div>
            </div>

            <div className="p-10 bg-slate-900 rounded-[3rem] text-indigo-400 font-mono text-xs space-y-3 shadow-2xl relative overflow-hidden border border-slate-800">
               <div className="absolute top-0 right-0 p-4 opacity-10"><Code className="w-24 h-24" /></div>
               <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="ml-4 text-[10px] font-black uppercase text-slate-500 tracking-widest">Platform Kernel v17.0.1</span>
               </div>
               <div className="text-slate-500">// [INIT] Subsystem Sector Diagnostics...</div>
               <div className="text-indigo-300">>> Authenticating Root Certificate... [DONE]</div>
               <div className="text-indigo-300">>> Parsing SQL Schema Integrity... [DONE]</div>
               <div className="text-indigo-300">>> Synchronizing Gemini AI Reasoning Nodes... [DONE]</div>
               <div className="text-indigo-300">>> Cross-verifying 94 Syllabus Units... [DONE]</div>
               <div className="text-emerald-400 font-bold mt-4">>> [SUCCESS] Platform sector {diagTab} is fully operational. No anomalies detected.</div>
            </div>
         </div>
      </div>
    </div>
  );
};

const SystemModule = ({ data, updateGlobalData, systemSubTab, setSystemSubTab }: any) => {
  const [deployActiveSub, setDeployActiveSub] = useState<'sql' | 'php' | 'guide'>('sql');
  const [dataSource, setDataSource] = useState<'MOCK' | 'LIVE'>(api.getMode());

  const sqlSchema = `
-- IITGEEPREP DATABASE CORE SCHEMA v17.0
CREATE TABLE IF NOT EXISTS chapters (
    id VARCHAR(50) PRIMARY KEY,
    subject ENUM('Physics', 'Chemistry', 'Mathematics'),
    unit VARCHAR(100),
    name VARCHAR(100),
    progress INT DEFAULT 0,
    accuracy INT DEFAULT 0,
    timeSpent INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'NOT_STARTED'
);

CREATE TABLE IF NOT EXISTS questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    topicId VARCHAR(50),
    subject VARCHAR(50),
    text TEXT,
    options JSON,
    correctAnswer INT,
    explanation TEXT,
    difficulty VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS mock_tests (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100),
    duration INT,
    totalMarks INT,
    category VARCHAR(50),
    difficulty VARCHAR(50),
    questionIds JSON,
    chapterIds JSON
);
  `.trim();

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit border border-slate-200 shadow-inner">
        {[
          { id: 'ai', label: 'AI Strategy', icon: Brain },
          { id: 'deploy', label: 'Deployment Pack', icon: CloudUpload },
          { id: 'db-util', label: 'Data Utility Bridge', icon: Database }
        ].map((t) => (
          <button key={t.id} onClick={() => setSystemSubTab(t.id as any)} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${systemSubTab === t.id ? 'bg-white text-indigo-600 shadow-xl' : 'text-slate-500 hover:text-slate-900'}`}><t.icon className="w-3.5 h-3.5" />{t.label}</button>
        ))}
      </div>

      {systemSubTab === 'ai' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-sm space-y-10">
              <div className="flex items-center gap-4">
                 <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-[1.5rem] flex items-center justify-center">
                    <Brain className="w-7 h-7" />
                 </div>
                 <h3 className="text-2xl font-black italic tracking-tight uppercase">AI Strategy Node Configuration</h3>
              </div>
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-4">Primary Reasoning Node</label>
                    <select className="w-full p-5 bg-slate-50 border-none rounded-2xl text-sm font-black text-slate-800">
                       <option>Gemini 2.5 Flash (Performance)</option>
                       <option>Gemini 2.5 Pro (Precision)</option>
                       <option>IITGEEPREP Custom Tuned v2</option>
                    </select>
                 </div>
                 <div className="p-8 bg-indigo-50 rounded-[2.5rem] border border-indigo-100">
                    <h4 className="text-xs font-black text-indigo-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                       <ShieldCheck className="w-4 h-4" /> Reasoning Ethics Protocol
                    </h4>
                    <p className="text-xs text-indigo-700 leading-relaxed font-medium">The AI is currently configured to prioritize <b>Conceptual Guidance</b> over <b>Direct Answers</b>. This ensures students build first-principles understanding rather than just copying solutions.</p>
                 </div>
                 <button className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-2xl hover:bg-indigo-700 transition-all">Synchronize Strategy</button>
              </div>
           </div>

           <div className="bg-slate-900 p-12 rounded-[4rem] text-white shadow-2xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10"><Cpu className="w-48 h-48" /></div>
              <div className="space-y-6 relative z-10">
                 <h3 className="text-2xl font-black italic tracking-tight uppercase text-indigo-400">Tactical Insights Core</h3>
                 <p className="text-slate-400 text-lg leading-relaxed font-medium italic border-l-4 border-indigo-600 pl-8">"Analyzing 14,000+ student trajectories to predict the 2025 JEE pattern weightage. Real-time adjustment active."</p>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-12 relative z-10">
                 <div className="p-6 bg-white/5 border border-white/10 rounded-[2rem]">
                    <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Knowledge Sync</div>
                    <div className="text-3xl font-black">94.2%</div>
                 </div>
                 <div className="p-6 bg-white/5 border border-white/10 rounded-[2rem]">
                    <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Model Uptime</div>
                    <div className="text-3xl font-black">99.9h</div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {systemSubTab === 'deploy' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4">
          <div className="flex bg-slate-100 p-1 rounded-xl w-fit border border-slate-200">
            <button onClick={() => setDeployActiveSub('sql')} className={`px-8 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${deployActiveSub === 'sql' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>SQL Production Schema</button>
            <button onClick={() => setDeployActiveSub('php')} className={`px-8 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${deployActiveSub === 'php' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>PHP Backend Handlers</button>
          </div>

          <div className="bg-slate-900 rounded-[3rem] p-10 overflow-hidden relative group shadow-2xl border border-slate-800">
             <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center"><Code className="w-5 h-5 text-white" /></div>
                   <div className="text-xs font-black uppercase text-indigo-400 tracking-widest">{deployActiveSub === 'sql' ? 'Production_DB_Init.sql' : 'Sync_Engine_Core.php'}</div>
                </div>
                <button className="flex items-center gap-2 bg-white/10 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all border border-white/10 shadow-xl"><Copy className="w-4 h-4" /> Copy Protocol</button>
             </div>
             <pre className="text-[11px] font-mono text-emerald-400 overflow-x-auto whitespace-pre leading-relaxed custom-scrollbar">
               {deployActiveSub === 'sql' ? sqlSchema : `<?php
// IITGEEPREP Backend Sync Engine v17.0
require_once 'db_config.php';

header('Content-Type: application/json');

$action = $_GET['action'] ?? '';
$input = json_decode(file_get_contents('php://input'), true);

switch($action) {
    case 'sync':
        $student_id = $input['student_id'];
        $data = json_encode($input['data']);
        $stmt = $pdo->prepare("INSERT INTO student_sync (id, payload) VALUES (?, ?) ON DUPLICATE KEY UPDATE payload = ?");
        $stmt->execute([$student_id, $data, $data]);
        echo json_encode(["success" => true]);
        break;
        
    case 'get_full':
        $id = $_GET['id'];
        $stmt = $pdo->prepare("SELECT payload FROM student_sync WHERE id = ?");
        $stmt->execute([$id]);
        $res = $stmt->fetch();
        echo json_encode(["payload" => json_decode($res['payload'])]);
        break;
}
?>`}
             </pre>
          </div>
        </div>
      )}

      {systemSubTab === 'db-util' && (
        <div className="p-12 bg-white rounded-[4rem] border border-slate-200 shadow-sm space-y-12 animate-in slide-in-from-bottom-4">
           <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-slate-100 pb-10">
              <div className="flex items-center gap-6">
                 <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[2.5rem] flex items-center justify-center border border-indigo-100 shadow-inner">
                    <DbIcon className="w-10 h-10" />
                 </div>
                 <div>
                   <h3 className="text-3xl font-black italic tracking-tight uppercase">Database Utility Bridge</h3>
                   <p className="text-slate-500 text-lg font-medium">Switch between Local Sandbox and Production MySQL Cluster.</p>
                 </div>
              </div>
              <div className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] ${dataSource === 'LIVE' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                 System Status: {dataSource} NODE ACTIVE
              </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <button 
                onClick={() => api.setMode('MOCK')} 
                className={`group p-12 rounded-[3.5rem] border-4 transition-all text-left space-y-6 relative overflow-hidden ${dataSource === 'MOCK' ? 'bg-indigo-600 border-indigo-200 text-white shadow-[0_40px_80px_-20px_rgba(79,70,229,0.4)]' : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-indigo-400 opacity-60'}`}
              >
                <div className={`absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform ${dataSource === 'MOCK' ? 'text-white' : 'text-indigo-600'}`}><Laptop className="w-32 h-32" /></div>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${dataSource === 'MOCK' ? 'bg-white/20' : 'bg-white'}`}><Laptop className="w-7 h-7" /></div>
                <div>
                   <div className="text-2xl font-black italic tracking-tight">Local Sandbox Mode</div>
                   <div className={`text-[10px] font-black uppercase tracking-[0.2em] mt-2 ${dataSource === 'MOCK' ? 'text-indigo-200' : 'text-slate-400'}`}>Synchronize to Browser LocalStorage</div>
                </div>
              </button>
              
              <button 
                onClick={() => api.setMode('LIVE')} 
                className={`group p-12 rounded-[3.5rem] border-4 transition-all text-left space-y-6 relative overflow-hidden ${dataSource === 'LIVE' ? 'bg-emerald-600 border-emerald-200 text-white shadow-[0_40px_80px_-20px_rgba(16,185,129,0.4)]' : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-emerald-400 opacity-60'}`}
              >
                <div className={`absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform ${dataSource === 'LIVE' ? 'text-white' : 'text-emerald-600'}`}><GlobeIcon className="w-32 h-32" /></div>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${dataSource === 'LIVE' ? 'bg-white/20' : 'bg-white'}`}><GlobeIcon className="w-7 h-7" /></div>
                <div>
                   <div className="text-2xl font-black italic tracking-tight">Production Server Mode</div>
                   <div className={`text-[10px] font-black uppercase tracking-[0.2em] mt-2 ${dataSource === 'LIVE' ? 'text-emerald-200' : 'text-slate-400'}`}>Establish Secure Uplink to MySQL/PHP</div>
                </div>
              </button>
           </div>

           <div className="bg-slate-900 rounded-[3rem] p-10 flex items-center justify-between shadow-2xl">
              <div className="flex items-center gap-6">
                 <div className="p-4 bg-white/10 rounded-2xl"><Key className="w-7 h-7 text-amber-400" /></div>
                 <div>
                    <h4 className="text-white font-black italic text-xl">Uplink Encryption Key</h4>
                    <p className="text-slate-500 text-xs font-mono">0x7F8C...D2E9 (RSA-4096 Secure)</p>
                 </div>
              </div>
              <button className="bg-white/10 text-white px-8 py-4 rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest hover:bg-white/20 border border-white/10 transition-all">Rotate Security Node</button>
           </div>
        </div>
      )}
    </div>
  );
};

const CreationHub = ({ creationType, setIsCreating, data, updateGlobalData }: any) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [formData, setFormData] = useState<any>({ 
    text: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '', difficulty: 'MEDIUM', subject: 'Physics', topicId: data.chapters[0]?.id || '',
    name: '', unit: '', title: '', answer: '', category: '', description: '', hack: '', duration: 180, totalMarks: 300, content: ''
  });

  const handleSave = async () => {
    setIsSyncing(true);
    const id = `${creationType[0]}_${Date.now()}`;
    
    // Simulate data structure creation
    if (creationType === 'questions') {
      updateGlobalData('questions', [{ ...formData, id }, ...data.questions]);
    } else if (creationType === 'chapter') {
      updateGlobalData('chapters', [{ ...formData, id, progress: 0, accuracy: 0, timeSpent: 0, status: 'NOT_STARTED' }, ...data.chapters]);
    } else if (creationType === 'flashcards') {
      updateGlobalData('flashcards', [{ ...formData, id, type: 'Concept' }, ...data.flashcards]);
    } else if (creationType === 'hacks') {
      updateGlobalData('memoryHacks', [{ ...formData, id }, ...data.memoryHacks]);
    } else if (creationType === 'tests') {
      updateGlobalData('mockTests', [{ ...formData, id, questionIds: [], chapterIds: [] }, ...data.mockTests]);
    } else if (creationType === 'blog') {
      updateGlobalData('blogs', [{ ...formData, id, author: 'Admin', date: new Date().toISOString().split('T')[0], status: 'PUBLISHED' }, ...data.blogs]);
    }

    setTimeout(() => {
        setIsSyncing(false);
        setIsCreating(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] p-12 shadow-2xl relative animate-in zoom-in-95 duration-300 overflow-y-auto max-h-[90vh]">
        <h3 className="text-3xl font-black mb-10 italic tracking-tighter uppercase text-slate-900 border-b border-slate-100 pb-6">Initialize New {creationType}</h3>
        
        <div className="space-y-8">
          {creationType === 'questions' && (
            <>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Content Stream</label>
                <textarea value={formData.text} onChange={e => setFormData({...formData, text: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-bold shadow-inner" placeholder="Question Text..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {formData.options.map((opt: string, i: number) => (
                  <input key={i} value={opt} onChange={e => {
                    const newOpts = [...formData.options];
                    newOpts[i] = e.target.value;
                    setFormData({...formData, options: newOpts});
                  }} className="bg-slate-50 border-none rounded-xl p-4 text-sm font-bold shadow-inner" placeholder={`Option ${String.fromCharCode(65+i)}`} />
                ))}
              </div>
              <input value={formData.explanation} onChange={e => setFormData({...formData, explanation: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold shadow-inner" placeholder="Strategic Breakdown Explanation..." />
            </>
          )}

          {creationType === 'chapter' && (
            <>
              <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black shadow-inner" placeholder="Chapter Designation (e.g. Laws of Motion)" />
              <input value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black shadow-inner" placeholder="Primary Unit designation" />
              <select value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black shadow-inner appearance-none">
                <option>Physics</option>
                <option>Chemistry</option>
                <option>Mathematics</option>
              </select>
            </>
          )}

          {creationType === 'blog' && (
            <>
              <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-black shadow-inner" placeholder="Strategic Report Title" />
              <textarea value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full bg-slate-50 border-none rounded-3xl p-8 text-sm font-medium h-60 shadow-inner" placeholder="Input analytical content (HTML support)..." />
            </>
          )}
        </div>

        <div className="flex gap-4 mt-12">
          <button onClick={() => setIsCreating(false)} className="flex-1 py-5 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-rose-500 transition-colors">Abort Entry</button>
          <button onClick={handleSave} disabled={isSyncing} className="flex-1 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] shadow-2xl hover:bg-slate-900 transition-all flex items-center justify-center gap-3">
            {isSyncing ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CloudUpload className="w-5 h-5" /> Synchronize to Cluster</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminCMS;
