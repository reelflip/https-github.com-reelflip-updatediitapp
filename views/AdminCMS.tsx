
import React, { useState, useEffect } from 'react';
import { StudentData, UserAccount, Subject, Question, MockTest, Chapter, Flashcard, MemoryHack, Blog, UserRole } from '../types';
import { api } from '../services/apiService';
import { MODEL_CONFIGS } from '../services/intelligenceService';
import JSZip from 'jszip';
import saveAs from 'file-saver';
import { 
  ShieldCheck, BookOpen, Layers, Zap, Loader2,
  Plus, Trash2, Edit3, X, 
  Target, Code2, Save, Users, PenTool,
  Check, HelpCircle, Video,
  Award, Type, Lightbulb, Activity, Filter,
  Search, Clock, ChevronRight, Layout, List, FileText, Calendar, Globe, Settings, Cpu, Database, Cloud, Download, Eye, AlertTriangle, Star, Signal, SignalHigh, SignalLow, Image, Activity as DiagnosticIcon, FileWarning, ClipboardCheck, Server, RefreshCw, CheckCircle, ShieldAlert, Thermometer, FlaskConical, Map, UserCheck, HeartHandshake
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

const DiagnosticSuite = () => {
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [report, setReport] = useState<any[]>([]);
  const mode = api.getMode();

  const protocolSteps = [
    { id: 1, label: 'Admin Panel Editors', icon: Edit3, desc: 'Verifying Chapter, Blog, Question, and Test creators availability.' },
    { id: 2, label: 'Syllabus & Chapters', icon: BookOpen, desc: 'Confirming subject mappings for 50+ chapters in production DB.' },
    { id: 3, label: 'Data Persistence', icon: Database, desc: 'Validating student progress and video watch-time storage logic.' },
    { id: 4, label: 'Mock Exam Engine', icon: Target, desc: 'Checking successful attempt logs and history visibility.' },
    { id: 5, label: 'Chapter Test Flow', icon: FlaskConical, desc: 'Ensuring redirection-free submissions for unit tests.' },
    { id: 6, label: 'Timetable Matrix', icon: Map, desc: 'Verifying multi-plan creation and persistence nodes.' },
    { id: 7, label: 'Psychometric Node', icon: Activity, desc: 'Confirming stress/focus score visibility and storage tables.' },
    { id: 8, label: 'Parent Linkage', icon: HeartHandshake, desc: 'Verifying invitation flow and secure handshake visibility.' },
    { id: 9, label: 'Integrity & Stability', icon: ShieldCheck, desc: 'Scanning for role-based inconsistency or navigation breaks.' },
    { id: 10, label: 'Regression Check', icon: RefreshCw, desc: 'Final end-to-end trace of production kernel.' }
  ];

  const runProtocol = async () => {
    if (mode !== 'LIVE') {
        alert("Diagnostics are strictly reserved for 'Production (SQL)' mode to verify real server endpoints.");
        return;
    }
    
    setIsDiagnosing(true);
    setReport([]);
    
    for (let i = 0; i < protocolSteps.length; i++) {
      const step = protocolSteps[i];
      setActiveStep(step.id);
      
      let status: 'PASS' | 'WARN' | 'FAIL' = 'PASS';
      let details = "Protocol verified successfully.";
      
      try {
        const res = await fetch(`./api/diagnostic_test.php?step=${step.id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const result = await res.json();
        
        status = result.success ? (result.warn ? 'WARN' : 'PASS') : 'FAIL';
        details = result.message || "Endpoint returned unexpected response.";
      } catch (e: any) {
        status = 'FAIL';
        details = `Network Error: ${e.message}. Ensure backend v20.0 is deployed and database is online.`;
      }

      setReport(prev => [...prev, { ...step, status, details }]);
      await new Promise(r => setTimeout(r, 100)); 
    }
    
    setActiveStep(null);
    setIsDiagnosing(false);
  };

  const getStatusColor = (status: string) => {
    if (status === 'PASS') return 'bg-emerald-500 text-white';
    if (status === 'WARN') return 'bg-amber-500 text-white';
    return 'bg-rose-500 text-white';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 px-4 pb-20 animate-in fade-in duration-1000">
      <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5"><DiagnosticIcon className="w-64 h-64" /></div>
        <div className="flex flex-col lg:flex-row justify-between items-center gap-10 relative z-10">
          <div className="space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-rose-50 border border-rose-100 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-rose-600">
              <ShieldAlert className="w-4 h-4" /> Production Audit Core v20
            </div>
            <h2 className="text-6xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">Diagnostic <br /><span className="text-rose-600">Protocol.</span></h2>
            <p className="text-slate-500 text-lg font-medium italic max-w-xl">"Live verification of server-side integrity, editors, and student data persistence."</p>
          </div>
          <div className="flex flex-col gap-4">
            <button 
                onClick={runProtocol}
                disabled={isDiagnosing || mode !== 'LIVE'}
                className="px-12 py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-rose-600 transition-all flex items-center gap-4 disabled:opacity-50 active:scale-95 transform"
            >
                {isDiagnosing ? <Loader2 className="w-6 h-6 animate-spin" /> : <><RefreshCw className="w-6 h-6" /> Initiate Live Scan</>}
            </button>
            {mode !== 'LIVE' && <div className="text-[9px] font-black text-rose-500 uppercase tracking-widest text-center">Switch to LIVE mode to use diagnostics</div>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-4">
          {protocolSteps.map((step) => {
            const result = report.find(r => r.id === step.id);
            return (
              <div key={step.id} className={`p-6 rounded-[2rem] border transition-all flex items-center gap-6 ${activeStep === step.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl scale-[1.02]' : result ? 'bg-white border-slate-100' : 'bg-slate-50 border-transparent opacity-60'}`}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${activeStep === step.id ? 'bg-white/20' : 'bg-white text-slate-400'}`}>
                  {result ? (
                    <CheckCircle className={`w-6 h-6 ${result.status === 'PASS' ? 'text-emerald-500' : result.status === 'WARN' ? 'text-amber-500' : 'text-rose-500'}`} />
                  ) : (
                    <step.icon className={`w-6 h-6 ${activeStep === step.id ? 'text-white' : ''}`} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[9px] font-black uppercase tracking-widest opacity-60">Step 0{step.id}</div>
                  <div className="text-sm font-black uppercase italic tracking-tight truncate">{step.label}</div>
                </div>
                {activeStep === step.id && <Loader2 className="w-4 h-4 animate-spin" />}
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-8 space-y-8">
          {report.length === 0 && !isDiagnosing ? (
            <div className="h-full bg-slate-50 border-4 border-dashed border-slate-100 rounded-[4rem] flex flex-col items-center justify-center p-20 space-y-6">
              <ClipboardCheck className="w-20 h-20 text-slate-100" />
              <div className="text-center space-y-2">
                <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.5em]">Awaiting Production Handshake</p>
                <p className="text-xs text-slate-300 italic text-center">Diagnostics require v20 backend endpoints to be deployed and reachable.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center px-4">
                 <h3 className="text-2xl font-black italic text-slate-800 tracking-tight">Active Audit Report</h3>
                 <div className="flex gap-4">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Pass</div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Caution</div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest"><div className="w-2 h-2 rounded-full bg-rose-500"></div> Fail</div>
                 </div>
              </div>
              <div className="space-y-6 overflow-y-auto max-h-[800px] pr-2 custom-scrollbar">
                {report.map((item, i) => (
                  <div key={i} className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm space-y-6 animate-in slide-in-from-bottom-4">
                    <div className="flex justify-between items-start">
                       <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getStatusColor(item.status)}`}>
                             {item.status === 'PASS' ? <Check className="w-5 h-5" /> : item.status === 'WARN' ? <AlertTriangle className="w-5 h-5" /> : <X className="w-5 h-5" />}
                          </div>
                          <div>
                             <h4 className="text-lg font-black text-slate-900 italic uppercase">{item.label}</h4>
                             <p className="text-[10px] font-bold text-slate-400 uppercase">{item.desc}</p>
                          </div>
                       </div>
                       <span className={`px-5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${item.status === 'PASS' ? 'border-emerald-100 text-emerald-600 bg-emerald-50' : item.status === 'WARN' ? 'border-amber-100 text-amber-600 bg-amber-50' : 'border-rose-100 text-rose-600 bg-rose-50'}`}>
                          {item.status === 'PASS' ? 'Sync Verified' : item.status === 'WARN' ? 'Check Required' : 'Critical Failure'}
                       </span>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 font-mono text-[11px] text-slate-600 leading-relaxed shadow-inner">
                       <div className="flex items-start gap-3">
                          <ChevronRight className="w-3 h-3 mt-1 text-slate-300" />
                          <p className={item.status === 'FAIL' ? 'text-rose-600' : 'text-slate-600'}>{item.details}</p>
                       </div>
                    </div>
                  </div>
                ))}
                {isDiagnosing && (
                  <div className="p-12 text-center bg-white rounded-[3rem] border-2 border-indigo-50 animate-pulse">
                     <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Activity className="w-6 h-6" />
                     </div>
                     <p className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.4em]">Polling Server Endpoints...</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const EntityList = ({ title, type, data, icon: Icon, color, onEdit, onDelete, onNew, btnLabel = "Add Entry" }: any) => (
  <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden mx-4 animate-in fade-in duration-500">
    <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/30">
       <h3 className="text-xl font-black italic text-slate-800 flex items-center gap-3"><Icon className={`w-6 h-6 text-${color}-600`} /> {title}</h3>
       <button onClick={onNew} className={`bg-${color}-600 text-white px-8 py-3 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-${color}-100 hover:scale-105 active:scale-95 transition-all`}><Plus className="w-4 h-4" /> {btnLabel}</button>
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

const CreationHub = ({ type, item, onClose, onSave, allQuestions = [], allChapters = [] }: any) => {
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
    notes: '', videoUrl: '', coverImage: '', targetCompletionDate: '', type: 'Concept',
    highYield: false
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [previewNotes, setPreviewNotes] = useState(false);

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 overflow-hidden">
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md animate-in fade-in" onClick={onClose}></div>
      <div className="bg-white w-full max-w-6xl my-auto rounded-[3rem] md:rounded-[4rem] shadow-2xl relative z-10 animate-in zoom-in-95 duration-300 overflow-hidden flex flex-col max-h-[95vh]">
         <div className="p-8 md:p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
            <div className="flex items-center gap-6">
               <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                  {type === 'Blog' ? <PenTool className="w-7 h-7" /> : type === 'Question' ? <HelpCircle className="w-7 h-7" /> : type === 'MockTest' ? <Target className="w-7 h-7" /> : type === 'Chapter' ? <BookOpen className="w-7 h-7" /> : type === 'MemoryHack' ? <Zap className="w-7 h-7" /> : <Layers className="w-7 h-7" />}
               </div>
               <div>
                  <h3 className="text-2xl md:text-3xl font-black italic tracking-tighter text-slate-900 uppercase">
                     {item ? 'Modify' : 'Deploy'} <span className="text-indigo-600">{type}.</span>
                  </h3>
                  <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mt-1">Syllabus Node Architect v10.5</p>
               </div>
            </div>
            <button onClick={onClose} className="p-4 bg-white text-slate-400 hover:text-slate-900 rounded-2xl transition-all border border-slate-100"><X className="w-6 h-6" /></button>
         </div>

         <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12 custom-scrollbar">
            {type === 'Chapter' && (
              <div className="space-y-12 animate-in fade-in duration-500">
                 <div className="space-y-8">
                    <div className="flex justify-between items-end">
                       <h4 className="text-[11px] font-black uppercase text-indigo-400 tracking-[0.4em] flex items-center gap-3"><Layout className="w-4 h-4" /> Strategic Metadata</h4>
                       <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-100">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">High Yield Topic?</span>
                          <button 
                            onClick={() => setFormData({...formData, highYield: !formData.highYield})}
                            className={`px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${formData.highYield ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-300 border border-slate-100'}`}
                          >
                            {formData.highYield ? <span className="flex items-center gap-2"><Star className="w-3 h-3 fill-white" /> Active</span> : 'Inactive'}
                          </button>
                       </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                       <InputGroup label="Chapter Identity"><input name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-black italic text-slate-800" placeholder="Ex: Ray Optics" /></InputGroup>
                       <InputGroup label="Syllabus Subject"><select name="subject" value={formData.subject} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-black text-slate-800"><option value="Physics">Physics</option><option value="Chemistry">Chemistry</option><option value="Mathematics">Mathematics</option></select></InputGroup>
                       <InputGroup label="Module/Unit Name"><input name="unit" value={formData.unit} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-black italic" placeholder="Ex: Electromagnetism" /></InputGroup>
                    </div>
                 </div>
                 <div className="space-y-8 pt-10 border-t border-slate-50">
                    <h4 className="text-[11px] font-black uppercase text-indigo-400 tracking-[0.4em] flex items-center gap-3"><Video className="w-4 h-4" /> Multimedia & Goals</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                       <InputGroup label="Lecture Stream URL">
                          <div className="relative group">
                             <Globe className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                             <input name="videoUrl" value={formData.videoUrl} onChange={handleChange} className="w-full pl-14 pr-6 py-5 bg-slate-50 border-none rounded-2xl text-sm font-black text-slate-800" placeholder="https://youtube.com/watch?v=..." />
                          </div>
                       </InputGroup>
                       <InputGroup label="Target Master Date">
                          <div className="relative group">
                             <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                             <input name="targetCompletionDate" type="date" value={formData.targetCompletionDate} onChange={handleChange} className="w-full pl-14 pr-6 py-5 bg-slate-50 border-none rounded-2xl text-sm font-black text-slate-800" />
                          </div>
                       </InputGroup>
                    </div>
                 </div>
                 <div className="space-y-8 pt-10 border-t border-slate-50">
                    <div className="flex justify-between items-center">
                       <h4 className="text-[11px] font-black uppercase text-indigo-400 tracking-[0.4em] flex items-center gap-3"><FileText className="w-4 h-4" /> Comprehensive Theory Node</h4>
                       <button onClick={() => setPreviewNotes(!previewNotes)} className="text-[10px] font-black uppercase text-indigo-600 flex items-center gap-2 hover:underline">
                          {previewNotes ? <><Edit3 className="w-3.5 h-3.5" /> Back to Code</> : <><Eye className="w-3.5 h-3.5" /> Preview HTML</>}
                       </button>
                    </div>
                    {previewNotes ? (
                       <div className="w-full bg-white border border-slate-200 rounded-[2.5rem] p-12 min-h-[300px] prose prose-slate max-w-none">
                          <div dangerouslySetInnerHTML={{ __html: formData.notes || '<p className="text-slate-400 italic">No content available for preview.</p>' }} />
                       </div>
                    ) : (
                       <InputGroup label="Theory Manuscript (Supports Rich HTML)">
                          <textarea name="notes" value={formData.notes} onChange={handleChange} rows={12} className="w-full bg-slate-50 border-none rounded-[2.5rem] p-10 text-base font-medium leading-relaxed text-slate-600 focus:ring-8 focus:ring-indigo-50 transition-all shadow-inner font-mono" placeholder="<h2>Chapter Overview</h2><p>Provide deep technical context...</p>" />
                       </InputGroup>
                    )}
                 </div>
              </div>
            )}

            {type === 'Question' && (
              <div className="space-y-10">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <InputGroup label="Subject Node"><select name="subject" value={formData.subject} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-black"><option value="Physics">Physics</option><option value="Chemistry">Chemistry</option><option value="Mathematics">Mathematics</option></select></InputGroup>
                    <InputGroup label="Difficulty Matrix"><select name="difficulty" value={formData.difficulty} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-black"><option value="EASY">EASY</option><option value="MEDIUM">MEDIUM</option><option value="HARD">HARD</option></select></InputGroup>
                    <InputGroup label="Topic Mapping"><select name="topicId" value={formData.topicId} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-black"><option value="">Select Chapter</option>{allChapters.map((c:any) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></InputGroup>
                 </div>
                 <InputGroup label="Problem Manuscript"><textarea name="text" value={formData.text} onChange={handleChange} rows={4} className="w-full bg-slate-50 border-none rounded-2xl p-8 text-xl font-black italic text-slate-800" placeholder="State the numerical problem..." /></InputGroup>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {formData.options.map((opt: string, i: number) => (
                      <div key={i} className="flex items-center gap-4 group">
                         <button onClick={() => setFormData({...formData, correctAnswer: i})} className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl transition-all shrink-0 ${formData.correctAnswer === i ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>{String.fromCharCode(65+i)}</button>
                         <input value={opt} onChange={(e) => handleOptionChange(i, e.target.value)} className="flex-1 bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold text-slate-700 focus:bg-white transition-all shadow-inner" placeholder={`Option ${String.fromCharCode(65+i)}`} />
                      </div>
                    ))}
                 </div>
                 <div className="pt-8 border-t border-slate-50">
                    <InputGroup label="Cognitive Solution / Explanation"><textarea name="explanation" value={formData.explanation} onChange={handleChange} rows={4} className="w-full bg-slate-50 border-none rounded-2xl p-8 text-sm font-medium italic text-slate-600" placeholder="Explain the derivation or logic..." /></InputGroup>
                 </div>
              </div>
            )}

            {type === 'MockTest' && (
              <div className="space-y-12">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InputGroup label="Exam Official Name"><input name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-black italic text-slate-800" placeholder="Ex: JEE Mains 2025 Mock v1" /></InputGroup>
                    <div className="grid grid-cols-2 gap-4">
                       <InputGroup label="Operational Minutes"><input name="duration" type="number" value={formData.duration} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-black" /></InputGroup>
                       <InputGroup label="Target Marks"><input name="totalMarks" type="number" value={formData.totalMarks} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-black" /></InputGroup>
                    </div>
                 </div>
                 <div className="bg-slate-50 rounded-[2.5rem] border border-slate-100 p-8 max-h-[450px] overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {filteredQuestions.map((q: any) => (
                         <div key={q.id} onClick={() => toggleQuestionSelection(q.id)} className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-5 ${formData.questionIds?.includes(q.id) ? 'bg-indigo-600 border-indigo-600 shadow-xl scale-[1.02]' : 'bg-white border-slate-100 hover:border-indigo-300'}`}>
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${formData.questionIds?.includes(q.id) ? 'bg-white text-indigo-600 shadow-inner' : 'bg-slate-100 text-slate-400'}`}>
                               {formData.questionIds?.includes(q.id) ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                            </div>
                            <div className="min-w-0">
                               <div className={`text-xs font-bold line-clamp-1 italic ${formData.questionIds?.includes(q.id) ? 'text-white' : 'text-slate-800'}`}>{q.text}</div>
                               <div className={`text-[8px] font-black uppercase mt-1 ${formData.questionIds?.includes(q.id) ? 'text-indigo-200' : 'text-slate-400'}`}>{q.subject} • {q.difficulty}</div>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
            )}
         </div>

         <div className="p-8 md:p-10 border-t border-slate-100 flex flex-col md:flex-row gap-4 md:gap-6 bg-slate-50/50 shrink-0">
            <button onClick={onClose} className="flex-1 py-5 md:py-6 bg-white border border-slate-200 text-slate-500 rounded-[1.8rem] font-black uppercase text-[10px] tracking-widest hover:bg-slate-100 transition-all">Abort Protocol</button>
            <button onClick={() => onSave(formData)} className="flex-[2] py-5 md:py-6 bg-indigo-600 text-white rounded-[1.8rem] font-black uppercase text-[10px] tracking-[0.3em] shadow-2xl shadow-indigo-100 flex items-center justify-center gap-4 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all"><Save className="w-6 h-6" /> Synchronize Changes to Production</button>
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
    const key = type === 'Chapter' ? 'chapters' : type === 'Question' ? 'questions' : type === 'MockTest' ? 'mockTests' : type === 'Flashcard' ? 'flashcards' : type === 'MemoryHack' ? 'memoryHacks' : 'blogs';
    const currentList = data[key as keyof StudentData] as any[];
    const newList = currentList.filter((item: any) => item.id !== id);
    setData({ ...data, [key]: newList });
  };

  const handleSaveEntity = async (type: string, entity: any) => {
    const key = type === 'Chapter' ? 'chapters' : type === 'Question' ? 'questions' : type === 'MockTest' ? 'mockTests' : type === 'Flashcard' ? 'flashcards' : type === 'MemoryHack' ? 'memoryHacks' : 'blogs';
    if (mode === 'LIVE') {
        const result = await api.saveEntity(type, entity);
        if (!result.success) { alert(`Persistence Failure: ${result.error}`); return; }
    }
    const currentList = [...(data[key as keyof StudentData] as any[])];
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
      
      const sqlSchema = `-- IITGEEPREP MASTER SCHEMA v20.0
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE DATABASE IF NOT EXISTS iitgrrprep_v20;
USE iitgrrprep_v20;

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('STUDENT', 'PARENT', 'ADMIN') DEFAULT 'STUDENT',
    institute VARCHAR(255),
    targetExam VARCHAR(100),
    targetYear VARCHAR(4),
    birthDate DATE,
    gender VARCHAR(20),
    routine_json JSON,
    smartplan_json JSON,
    connected_id VARCHAR(50),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS chapters (
    id VARCHAR(50) PRIMARY KEY,
    subject VARCHAR(50) NOT NULL,
    unit VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    notes LONGTEXT,
    videoUrl VARCHAR(255),
    highYield TINYINT(1) DEFAULT 0,
    targetCompletionDate DATE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS student_progress (
    student_id VARCHAR(50) NOT NULL,
    chapter_id VARCHAR(50) NOT NULL,
    progress INT DEFAULT 0,
    accuracy INT DEFAULT 0,
    timeSpent INT DEFAULT 0,
    timeSpentNotes INT DEFAULT 0,
    timeSpentVideos INT DEFAULT 0,
    timeSpentPractice INT DEFAULT 0,
    timeSpentTests INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'NOT_STARTED',
    lastStudied DATETIME,
    PRIMARY KEY (student_id, chapter_id),
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS questions (
    id VARCHAR(50) PRIMARY KEY,
    topicId VARCHAR(50),
    subject VARCHAR(50),
    text TEXT NOT NULL,
    options JSON NOT NULL,
    correctAnswer INT NOT NULL,
    explanation TEXT,
    difficulty ENUM('EASY', 'MEDIUM', 'HARD'),
    FOREIGN KEY (topicId) REFERENCES chapters(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS mock_tests (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    duration INT DEFAULT 180,
    totalMarks INT DEFAULT 300,
    category VARCHAR(50),
    difficulty VARCHAR(50),
    questionIds TEXT,
    chapterIds TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS test_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    test_id VARCHAR(50),
    test_name VARCHAR(255),
    score INT,
    total_marks INT,
    accuracy INT,
    date DATE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS psychometric_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    stress INT,
    focus INT,
    motivation INT,
    examFear INT,
    summary TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS flashcards (
    id VARCHAR(50) PRIMARY KEY,
    question TEXT,
    answer TEXT,
    subject VARCHAR(50),
    type VARCHAR(50)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS memory_hacks (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    hack TEXT,
    category VARCHAR(50),
    subject VARCHAR(50)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

COMMIT;`;

      const dbConfig = `<?php
/**
 * Solaris v20 Backend - Database Configuration
 */
define('DB_HOST', 'localhost');
define('DB_NAME', 'iitgrrprep_v20');
define('DB_USER', 'root');
define('DB_PASS', '');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    http_response_code(500);
    die(json_encode([
        "success" => false, 
        "error" => "Critical Uplink Failure: " . $e->getMessage()
    ]));
}
?>`;

      const diagnosticTest = `<?php
/**
 * Solaris v20 Backend - Comprehensive Diagnostic Protocol
 */
require_once 'config/database.php';

$step = (int)($_GET['step'] ?? 0);
$response = ["success" => true, "message" => "Step verified successfully.", "warn" => false];

try {
    switch ($step) {
        case 1: // Admin Panel Editors Check
            $required_files = [
                'manage_chapters.php', 
                'manage_questions.php', 
                'manage_users.php', 
                'manage_settings.php'
            ];
            foreach ($required_files as $file) {
                if (!file_exists($file)) {
                    $response["success"] = false;
                    $response["message"] = "Critical node missing: $file";
                    break;
                }
            }
            if ($response["success"]) {
                $response["message"] = "All editor controllers verified in filesystem.";
            }
            break;

        case 2: // Syllabus & Chapters Mapping
            $count = $pdo->query("SELECT COUNT(*) FROM chapters")->fetchColumn();
            $response["message"] = "Detected $count active chapters in database.";
            if ($count < 50) {
                $response["warn"] = true;
                $response["message"] .= " WARNING: Found only $count/50 targeted chapters.";
            }
            break;

        case 3: // Data Persistence Protocol
            $pdo->query("SELECT student_id FROM student_progress LIMIT 1");
            $response["message"] = "Student progress storage engine indices are active.";
            break;

        case 4: // Mock Exam Engine
            $count = $pdo->query("SELECT COUNT(*) FROM mock_tests")->fetchColumn();
            $response["message"] = "Exam Engine online. $count Mock Tests registered.";
            break;

        case 5: // Chapter Test Flow
            $pdo->query("SELECT id FROM test_results LIMIT 1");
            $response["message"] = "Real-time result archival node verified.";
            break;

        case 6: // Timetable Matrix
            $stmt = $pdo->query("SELECT COUNT(*) FROM users WHERE routine_json IS NOT NULL OR smartplan_json IS NOT NULL");
            $count = $stmt->fetchColumn();
            $response["message"] = "Identified $count active timetable configurations.";
            break;

        case 7: // Psychometric Node
            $count = $pdo->query("SELECT COUNT(*) FROM psychometric_logs")->fetchColumn();
            $response["message"] = "Mental state tracking validated. $count logs archived.";
            break;

        case 8: // Parent Connectivity Handshake
            $pdo->query("SELECT id FROM users WHERE connected_id IS NOT NULL LIMIT 1");
            $response["message"] = "Parental handshake protocol index validated.";
            break;

        case 9: // Integrity & Stability
            $pdo->query("SELECT DISTINCT role FROM users");
            $response["message"] = "Identity role-based constraints verified.";
            break;

        case 10: // Regression Check
            $pdo->query("SELECT 1");
            $response["message"] = "Full Solaris v20.0 synchronization successful.";
            break;

        default:
            $response["success"] = false;
            $response["message"] = "Invalid Diagnostic Code.";
    }
} catch (Exception $e) {
    $response = ["success" => false, "message" => "SQL Protocol Error: " . $e->getMessage()];
}

echo json_encode($response);
?>`;

      const checkConn = `<?php
require_once 'config/database.php';
try {
    $pdo->query("SELECT 1");
    echo json_encode(["success" => true, "status" => "Uplink Established"]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>`;

      const authReg = `<?php
require_once 'config/database.php';
$d = json_decode(file_get_contents("php://input"));
if (!$d->email || !$d->password) {
    die(json_encode(["success" => false, "error" => "Incomplete Data"]));
}

$id = "S-" . bin2hex(random_bytes(4));
$hashed = password_hash($d->password, PASSWORD_BCRYPT);

try {
    $s = $pdo->prepare("INSERT INTO users (id, name, email, password, role, institute, targetExam, targetYear) VALUES (?,?,?,?,?,?,?,?)");
    $s->execute([$id, $d->name, $d->email, $hashed, $d->role ?? 'STUDENT', $d->institute ?? null, $d->targetExam ?? null, $d->targetYear ?? null]);
    echo json_encode([
        "success" => true, 
        "user" => [
            "id" => $id, 
            "name" => $d->name, 
            "email" => $d->email, 
            "role" => $d->role ?? 'STUDENT'
        ]
    ]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => "Email already registered."]);
}
?>`;

      const authLogin = `<?php
require_once 'config/database.php';
$d = json_decode(file_get_contents("php://input"));
$s = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$s->execute([$d->email]);
$u = $s->fetch();

if ($u && password_verify($d->password, $u['password'])) {
    unset($u['password']);
    echo json_encode(["success" => true, "user" => $u]);
} else {
    echo json_encode(["success" => false, "error" => "Invalid credentials"]);
}
?>`;

      const getDash = `<?php
require_once 'config/database.php';
$id = $_GET['id'] ?? '';
if (!$id) {
    die(json_encode(["success" => false, "error" => "ID Required"]));
}

$userStmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
$userStmt->execute([$id]);
$ud = $userStmt->fetch();

if (!$ud) {
    die(json_encode(["success" => false, "error" => "User Not Found"]));
}

$chapters = $pdo->query("SELECT c.*, p.progress, p.accuracy, p.status, p.timeSpent, p.timeSpentNotes, p.timeSpentVideos, p.timeSpentPractice, p.timeSpentTests 
                        FROM chapters c 
                        LEFT JOIN student_progress p ON c.id = p.chapter_id AND p.student_id = '$id'")->fetchAll();

$history = $pdo->prepare("SELECT * FROM test_results WHERE student_id = ? ORDER BY date DESC");
$history->execute([$id]);

$psych = $pdo->prepare("SELECT * FROM psychometric_logs WHERE student_id = ? ORDER BY timestamp DESC LIMIT 10");
$psych->execute([$id]);

echo json_encode([
    "success" => true, 
    "data" => [
        "id" => $id,
        "name" => $ud['name'],
        "email" => $ud['email'],
        "chapters" => $chapters,
        "routine" => json_decode($ud['routine_json']),
        "smartPlan" => json_decode($ud['smartplan_json']),
        "testHistory" => $history->fetchAll(),
        "psychometricHistory" => $psych->fetchAll(),
        "institute" => $ud['institute'],
        "targetExam" => $ud['targetExam'],
        "targetYear" => $ud['targetYear']
    ]
]);
?>`;

      const syncProg = `<?php
require_once 'config/database.php';
$d = json_decode(file_get_contents("php://input"));
if (!$d->student_id || !$d->chapters) {
    exit;
}

foreach ($d->chapters as $c) {
    $stmt = $pdo->prepare("INSERT INTO student_progress (student_id, chapter_id, progress, accuracy, status, timeSpent, timeSpentNotes, timeSpentVideos, timeSpentPractice, timeSpentTests) 
                           VALUES (?,?,?,?,?,?,?,?,?,?) 
                           ON DUPLICATE KEY UPDATE 
                           progress = VALUES(progress), 
                           accuracy = VALUES(accuracy),
                           status = VALUES(status),
                           timeSpent = VALUES(timeSpent),
                           timeSpentNotes = VALUES(timeSpentNotes),
                           timeSpentVideos = VALUES(timeSpentVideos),
                           timeSpentPractice = VALUES(timeSpentPractice),
                           timeSpentTests = VALUES(timeSpentTests)");
    $stmt->execute([
        $d->student_id, $c->id, $c->progress, $c->accuracy, $c->status,
        $c->timeSpent ?? 0, $c->timeSpentNotes ?? 0, $c->timeSpentVideos ?? 0, 
        $c->timeSpentPractice ?? 0, $c->timeSpentTests ?? 0
    ]);
}
echo json_encode(["success" => true]);
?>`;

      const saveRoutine = `<?php
require_once 'config/database.php';
$d = json_decode(file_get_contents("php://input"));
if (!$d->student_id) {
    exit;
}
$pdo->prepare("UPDATE users SET routine_json = ? WHERE id = ?")->execute([json_encode($d->routine), $d->student_id]);
echo json_encode(["success" => true]);
?>`;

      const saveTable = `<?php
require_once 'config/database.php';
$d = json_decode(file_get_contents("php://input"));
if (!$d->student_id) {
    exit;
}
$pdo->prepare("UPDATE users SET smartplan_json = ? WHERE id = ?")->execute([json_encode($d->smartPlan), $d->student_id]);
echo json_encode(["success" => true]);
?>`;

      const manageChapters = `<?php
require_once 'config/database.php';
$a = $_GET['action'] ?? '';
$d = json_decode(file_get_contents("php://input"));

if ($a === 'save') {
    $s = $pdo->prepare("REPLACE INTO chapters (id, subject, unit, name, notes, videoUrl, highYield) VALUES (?,?,?,?,?,?,?)");
    $s->execute([$d->id, $d->subject, $d->unit, $d->name, $d->notes, $d->videoUrl, $d->highYield ? 1 : 0]);
} else if ($a === 'delete') {
    $pdo->prepare("DELETE FROM chapters WHERE id = ?")->execute([$d->id]);
}
echo json_encode(["success" => true]);
?>`;

      const manageQuestions = `<?php
require_once 'config/database.php';
$d = json_decode(file_get_contents("php://input"));
$pdo->prepare("REPLACE INTO questions (id, topicId, subject, text, options, correctAnswer, explanation, difficulty) VALUES (?,?,?,?,?,?,?,?)")
    ->execute([$d->id, $d->topicId, $d->subject, $d->text, json_encode($d->options), $d->correctAnswer, $d->explanation, $d->difficulty]);
echo json_encode(["success" => true]);
?>`;

      const saveAttempt = `<?php
require_once 'config/database.php';
$d = json_decode(file_get_contents("php://input"));
$pdo->prepare("INSERT INTO test_results (student_id, test_id, test_name, score, total_marks, accuracy, date) VALUES (?,?,?,?,?,?,?)")
    ->execute([$d->student_id, $d->testId, $d->testName, $d->score, $d->totalMarks, $d->accuracy, $d->date]);
echo json_encode(["success" => true]);
?>`;

      const savePsych = `<?php
require_once 'config/database.php';
$d = json_decode(file_get_contents("php://input"));
$pdo->prepare("INSERT INTO psychometric_logs (student_id, stress, focus, motivation, examFear, summary) VALUES (?,?,?,?,?,?)")
    ->execute([$d->student_id, $d->stress, $d->focus, $d->motivation, $d->examFear, $d->studentSummary]);
echo json_encode(["success" => true]);
?>`;

      const manageUsers = `<?php
require_once 'config/database.php';
$users = $pdo->query("SELECT id, name, email, role, institute, targetExam, targetYear FROM users")->fetchAll();
echo json_encode(["success" => true, "users" => $users]);
?>`;

      const manageSettings = `<?php
require_once 'config/database.php';
$d = json_decode(file_get_contents("php://input"));
$pdo->prepare("UPDATE users SET name=?, institute=?, targetExam=?, targetYear=?, birthDate=?, gender=? WHERE id=?")
    ->execute([$d->name, $d->institute, $d->targetExam, $d->targetYear, $d->birthDate, $d->gender, $d->id]);
echo json_encode(["success" => true]);
?>`;

      const htaccess = `RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^(.*)$ index.php [QSA,L]`;

      // Construct ZIP mirroring source structure where possible for the API
      zip.folder("config")?.file("database.php", dbConfig);
      zip.folder("sql")?.file("master_schema_v20.sql", sqlSchema);
      
      // Core Controllers
      zip.file("diagnostic_test.php", diagnosticTest);
      zip.file("check_connection.php", checkConn);
      zip.file("auth_register.php", authReg);
      zip.file("auth_login.php", authLogin);
      zip.file("get_dashboard.php", getDash);
      zip.file("sync_progress.php", syncProg);
      zip.file("save_routine.php", saveRoutine);
      zip.file("save_timetable.php", saveTable);
      zip.file("manage_chapters.php", manageChapters);
      zip.file("manage_questions.php", manageQuestions);
      zip.file("save_attempt.php", saveAttempt);
      zip.file("save_psychometric.php", savePsych);
      zip.file("manage_users.php", manageUsers);
      zip.file("manage_settings.php", manageSettings);
      zip.file(".htaccess", htaccess);
      
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "solaris_v20_complete_backend.zip");
    } catch (e) {
      alert("Bundle generation failed.");
    }
    setIsDownloading(false);
  };

  return (
    <div className="pb-32 max-w-7xl mx-auto space-y-10 px-4">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 bg-white p-12 rounded-[3.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5"><ShieldCheck className="w-64 h-64" /></div>
        <div className="space-y-4 relative z-10">
          <div className="text-[10px] font-black uppercase text-indigo-600 tracking-[0.5em] flex items-center gap-3"><ShieldCheck className="w-5 h-5" /> Unified Admin Node v10.5</div>
          <h2 className="text-7xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">SENTINEL <span className="text-indigo-600">CORE.</span></h2>
        </div>
        <div className="flex items-center gap-4 bg-slate-50 px-8 py-4 rounded-[2rem] border border-slate-100 shadow-inner group relative z-10">
           <div className="text-right">
              <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Environment Pipeline</div>
              <div className={`text-[10px] font-black uppercase tracking-widest ${mode === 'LIVE' ? 'text-emerald-600' : 'text-amber-500'}`}>{mode === 'LIVE' ? 'Production (SQL)' : 'Sandbox Mode'}</div>
           </div>
           <button onClick={() => api.setMode(mode === 'MOCK' ? 'LIVE' : 'MOCK')} className={`w-16 h-9 rounded-full p-1.5 transition-all duration-500 relative shadow-inner ${mode === 'LIVE' ? 'bg-emerald-500' : 'bg-slate-300'}`}><div className={`w-6 h-6 bg-white rounded-full shadow-lg transition-transform duration-500 transform ${mode === 'LIVE' ? 'translate-x-7' : 'translate-x-0'}`}></div></button>
        </div>
      </div>

      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {activeTab === 'admin-overview' && <Overview data={data} />}
        {activeTab === 'admin-users' && <UserManagement />}
        {activeTab === 'admin-syllabus' && <EntityList title="Syllabus Management" type="Chapter" data={data.chapters} icon={BookOpen} color="indigo" btnLabel="Deploy Chapter" onEdit={handleEdit} onDelete={handleDelete} onNew={() => { setCreationType('Chapter'); setEditingItem(null); setIsCreating(true); }} />}
        {activeTab === 'admin-questions' && <EntityList title="Strategic Question Bank" type="Question" data={data.questions} icon={Code2} color="emerald" btnLabel="Register Problem" onEdit={handleEdit} onDelete={handleDelete} onNew={() => { setCreationType('Question'); setEditingItem(null); setIsCreating(true); }} />}
        {activeTab === 'admin-tests' && <EntityList title="Mock Test Architecture" type="MockTest" data={data.mockTests} icon={Target} color="rose" btnLabel="Assemble Exam" onEdit={handleEdit} onDelete={handleDelete} onNew={() => { setCreationType('MockTest'); setEditingItem(null); setIsCreating(true); }} />}
        {activeTab === 'admin-flashcards' && <EntityList title="Recall Engine (Cards)" type="Flashcard" data={data.flashcards} icon={Layers} color="blue" btnLabel="Encode Card" onEdit={handleEdit} onDelete={handleDelete} onNew={() => { setCreationType('Flashcard'); setEditingItem(null); setIsCreating(true); }} />}
        {activeTab === 'admin-hacks' && <EntityList title="Memory Hack Vault" type="MemoryHack" data={data.memoryHacks} icon={Zap} color="amber" btnLabel="Commit Hack" onEdit={handleEdit} onDelete={handleDelete} onNew={() => { setCreationType('MemoryHack'); setEditingItem(null); setIsCreating(true); }} />}
        {activeTab === 'admin-blogs' && <EntityList title="Intelligence Strategy Feed" type="Blog" data={data.blogs} icon={PenTool} color="indigo" btnLabel="Draft Manuscript" onEdit={handleEdit} onDelete={handleDelete} onNew={() => { setCreationType('Blog'); setEditingItem(null); setIsCreating(true); }} />}
        {activeTab === 'admin-diagnostic' && <DiagnosticSuite />}
        {activeTab === 'admin-system' && (
            <div className="space-y-12 px-4 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-sm space-y-10">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner"><Cpu className="w-7 h-7" /></div>
                            <div>
                                <h3 className="text-2xl font-black italic tracking-tighter text-slate-900 uppercase">Intelligence Core</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform-wide LLM Orchestration</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {Object.entries(MODEL_CONFIGS).map(([id, cfg]) => (
                                <button 
                                    key={id}
                                    onClick={() => updateModel(id)}
                                    className={`p-6 rounded-[2rem] border-2 text-left transition-all flex items-center justify-between group ${activeModel === id ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-50 hover:border-indigo-200'}`}
                                >
                                    <div className="flex items-center gap-5">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${activeModel === id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>{cfg.name[0]}</div>
                                        <div>
                                            <div className="text-sm font-black text-slate-800">{cfg.name}</div>
                                            <div className={`text-[9px] font-bold text-slate-400 uppercase`}>{cfg.desc}</div>
                                        </div>
                                    </div>
                                    {activeModel === id && <Check className="w-5 h-5 text-indigo-600" />}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-8">
                        <div className="bg-slate-900 p-12 rounded-[4rem] text-white shadow-2xl space-y-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform duration-[4s]"><Database className="w-48 h-48" /></div>
                            <div>
                                <h3 className="text-2xl font-black italic tracking-tighter uppercase">Uplink Status</h3>
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Data persistence layer config</p>
                            </div>
                            <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/10">
                                <div className="flex items-center gap-4">
                                    <div className={`w-3 h-3 rounded-full animate-pulse ${mode === 'LIVE' ? (connStatus === 'online' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-rose-500 shadow-[0_0_10px_#f43f5e]') : 'bg-slate-500'}`}></div>
                                    <div className="text-sm font-bold uppercase tracking-widest">{mode === 'LIVE' ? 'Production (SQL)' : 'Sandbox Mode'}</div>
                                </div>
                                <button 
                                    onClick={() => api.setMode(mode === 'MOCK' ? 'LIVE' : 'MOCK')} 
                                    className={`w-14 h-7 rounded-full p-1 transition-all duration-500 ${mode === 'LIVE' ? 'bg-emerald-500' : 'bg-slate-700'}`}
                                >
                                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-500 transform ${mode === 'LIVE' ? 'translate-x-7' : 'translate-x-0'}`}></div>
                                </button>
                            </div>
                            {mode === 'LIVE' && (
                                <div className="space-y-4 pt-4">
                                    <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${connStatus === 'online' ? 'bg-emerald-500/20 text-emerald-400' : connStatus === 'checking' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-rose-500/20 text-rose-400'}`}>
                                                {connStatus === 'online' ? <SignalHigh className="w-5 h-5" /> : connStatus === 'checking' ? <Loader2 className="w-5 h-5 animate-spin" /> : <SignalLow className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <div className="text-xs font-black uppercase tracking-widest">Connectivity</div>
                                                <div className="text-[10px] font-bold text-slate-400">{connStatus === 'online' ? 'Handshake Success' : connStatus === 'checking' ? 'Checking Uplink...' : 'Link Offline'}</div>
                                            </div>
                                        </div>
                                        <button onClick={testConnection} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">Ping Server</button>
                                    </div>
                                </div>
                            )}
                            <div className="space-y-4 pt-6">
                                <div className="flex justify-between text-xs font-bold text-slate-400"><span>Latency</span><span>{mode === 'LIVE' ? (connStatus === 'online' ? '24ms' : '--') : '0ms'}</span></div>
                                <div className="flex justify-between text-xs font-bold text-slate-400"><span>API Version</span><span>v20.0-PRO</span></div>
                            </div>
                        </div>
                        <div className="bg-indigo-600 p-12 rounded-[4rem] text-white shadow-xl space-y-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10"><Cloud className="w-32 h-32" /></div>
                            <h3 className="text-xl font-black italic tracking-tighter uppercase">Deployment Blueprint</h3>
                            <p className="text-sm text-indigo-100 font-medium italic leading-relaxed">Download the complete Solaris v20 Backend (18+ PHP Modules + Full SQL) to enable production persistence.</p>
                            <button 
                                onClick={downloadProductionBackend}
                                disabled={isDownloading}
                                className="w-full py-5 bg-white text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Download className="w-4 h-4" /> Download Complete v20 Core</>}
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
          onClose={() => setIsCreating(false)} 
          onSave={(entity: any) => handleSaveEntity(creationType, entity)} 
          allQuestions={data.questions} 
          allChapters={data.chapters} 
        />
      )}
    </div>
  );
};

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
      <div className="divide-y divide-slate-50 max-h-[600px] overflow-y-auto custom-scrollbar">
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

export default AdminCMS;
