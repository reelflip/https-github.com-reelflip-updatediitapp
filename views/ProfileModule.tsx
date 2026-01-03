
import React, { useState, useEffect } from 'react';
import { StudentData, UserAccount, ParentInvitation } from '../types';
import { api } from '../services/apiService';
import { 
  UserCircle, Save, School, Briefcase, Calendar, 
  GraduationCap, CheckCircle, Globe, HeartHandshake, 
  ShieldCheck, Trash2, Mail, Building, Target, User, Info, Loader2,
  Clock, Check, X, Bell, RotateCcw, AlertTriangle
} from 'lucide-react';

interface ProfileModuleProps {
  data: StudentData;
  setData: (data: StudentData) => void;
}

const INSTITUTES = ["Allen Career Institute", "FIITJEE", "Resonance", "Aakash Institute", "Physics Wallah (PW)", "Other / Self Study"];
const NATIONAL_EXAMS = ["JEE Main & Advanced", "JEE Main Only", "BITSAT", "NEET (Medical)", "CUET"];
const TARGET_YEARS = ["2025", "2026", "2027", "2028"];

const ProfileModule: React.FC<ProfileModuleProps> = ({ data, setData }) => {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isReseting, setIsReseting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('jeepro_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const [profile, setProfile] = useState({
    name: data.name,
    email: '',
    targetYear: data.targetYear || TARGET_YEARS[0],
    institute: data.institute || INSTITUTES[0],
    targetExam: data.targetExam || NATIONAL_EXAMS[0],
    birthDate: data.birthDate || '',
    gender: data.gender || ''
  });

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || data.name,
        email: user.email || '',
        targetYear: user.targetYear || data.targetYear || TARGET_YEARS[0],
        institute: user.institute || data.institute || INSTITUTES[0],
        targetExam: user.targetExam || data.targetExam || NATIONAL_EXAMS[0],
        birthDate: user.birthDate || data.birthDate || '',
        gender: user.gender || data.gender || ''
      });
    }
  }, [user, data]);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    const result = await api.updateUserProfile(user.id, profile);
    if (result.success) {
      const updatedUser = { ...user, ...profile };
      localStorage.setItem('jeepro_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setData({ ...data, ...profile });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
    setIsSaving(false);
  };

  const handleHardReset = async () => {
    if (!confirm("CRITICAL ACTION: This will permanently wipe all syllabus progress and test history. This cannot be undone. Proceed?")) return;
    setIsReseting(true);
    const resetData = await api.resetProgress(data.id);
    setData(resetData);
    setIsReseting(false);
    alert("Node Reset Complete. All status returned to 0.");
  };

  const acceptInvitation = (inv: ParentInvitation) => {
    const newData = {
      ...data,
      connectedParent: {
        name: inv.parentName,
        id: inv.id,
        linkedSince: new Date().toLocaleDateString()
      },
      pendingInvitations: (data.pendingInvitations || []).filter(i => i.id !== inv.id)
    };
    setData(newData);
    api.updateStudentData(data.id, newData);
  };

  const rejectInvitation = (invId: string) => {
    const newData = {
      ...data,
      pendingInvitations: (data.pendingInvitations || []).filter(i => i.id !== invId)
    };
    setData(newData);
    api.updateStudentData(data.id, newData);
  };

  const revokeHandshake = () => {
    if (confirm("Terminate parent visibility?")) {
      const newData = { ...data, connectedParent: undefined };
      setData(newData);
      api.updateStudentData(data.id, newData);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight italic">Academic Profile.</h2>
          <p className="text-slate-500 font-medium">Manage your identity and handshake protocols.</p>
        </div>
        <button onClick={handleSave} disabled={isSaving} className={`px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center gap-3 ${isSaved ? 'bg-emerald-500 text-white shadow-emerald-100' : 'bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700 hover:scale-105'} disabled:opacity-50`}>
          {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : isSaved ? <><CheckCircle className="w-5 h-5" /> Saved</> : <><Save className="w-5 h-5" /> Save Profile</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-white p-12 rounded-[3.5rem] border border-slate-200 text-center shadow-sm relative overflow-hidden group">
              <div className="w-36 h-36 bg-slate-100 rounded-[3rem] mx-auto mb-8 flex items-center justify-center border-8 border-slate-50 overflow-hidden shadow-inner relative z-10"><UserCircle className="w-full h-full text-slate-200" /></div>
              <h3 className="text-2xl font-black text-slate-800 italic relative z-10">{profile.name}</h3>
              <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.3em] mt-2 relative z-10">Student Node: {data.id}</p>
           </div>
           
           <div className="bg-indigo-950 p-10 rounded-[3rem] text-white space-y-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10"><ShieldCheck className="w-32 h-32" /></div>
              <div className="flex items-center gap-4"><div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 backdrop-blur-md"><HeartHandshake className="w-6 h-6 text-indigo-300" /></div><h4 className="font-black italic text-xl">Handshake</h4></div>

              {data.connectedParent ? (
                <div className="space-y-6">
                   <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10 space-y-4">
                      <div><div className="text-[10px] font-black uppercase text-indigo-400 tracking-widest mb-1">Parent Entity</div><div className="text-lg font-black">{data.connectedParent.name}</div></div>
                      <div className="flex justify-between items-end"><div><div className="text-[10px] font-black uppercase text-indigo-400 tracking-widest mb-1">Since</div><div className="text-xs font-bold text-slate-300">{data.connectedParent.linkedSince}</div></div><button onClick={revokeHandshake} className="p-3 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl transition-all border border-white/10"><Trash2 className="w-5 h-5" /></button></div>
                   </div>
                </div>
              ) : (data.pendingInvitations && data.pendingInvitations.length > 0) ? (
                <div className="space-y-4">
                   <div className="text-[10px] font-black uppercase text-amber-400 tracking-widest flex items-center gap-2"><Bell className="w-3 h-3" /> Incoming Handshake Requests</div>
                   {data.pendingInvitations.map(inv => (
                     <div key={inv.id} className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-4">
                        <div>
                          <div className="text-sm font-black text-white">{inv.parentName}</div>
                          <div className="text-[9px] font-bold text-slate-400 uppercase">{inv.parentEmail}</div>
                        </div>
                        <div className="flex gap-2">
                           <button onClick={() => acceptInvitation(inv)} className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2"><Check className="w-3 h-3" /> Accept</button>
                           <button onClick={() => rejectInvitation(inv.id)} className="flex-1 py-2 bg-white/10 text-slate-400 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-rose-500/20 hover:text-rose-400"><X className="w-3 h-3" /> Reject</button>
                        </div>
                     </div>
                   ))}
                </div>
              ) : (
                <div className="space-y-4 text-center py-6 border-2 border-dashed border-white/10 rounded-[2rem]">
                   <Globe className="w-10 h-10 text-slate-500 mx-auto opacity-50" />
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No Active Links</p>
                </div>
              )}
           </div>

           <div className="p-10 bg-rose-50 border border-rose-100 rounded-[3rem] space-y-6">
              <div className="flex items-center gap-4 text-rose-600">
                <AlertTriangle className="w-6 h-6" />
                <h4 className="font-black italic text-lg">Danger Zone</h4>
              </div>
              <p className="text-xs text-rose-500 font-medium">Use this to reset your syllabus status to 0 and clear history.</p>
              <button 
                onClick={handleHardReset} 
                disabled={isReseting}
                className="w-full py-4 bg-white border border-rose-200 text-rose-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center gap-3"
              >
                {isReseting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><RotateCcw className="w-4 h-4" /> Reset My Progress</>}
              </button>
           </div>
        </div>

        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-sm space-y-12">
            <section className="space-y-8">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-3"><GraduationCap className="w-5 h-5" /> Personal Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-6 tracking-[0.2em]">Legal Name</label>
                  <div className="relative"><User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" /><input type="text" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} className="w-full bg-slate-50 border-none rounded-[2rem] py-6 pl-14 pr-6 text-sm font-black text-slate-800 focus:ring-4 focus:ring-indigo-100 transition-all shadow-inner" /></div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-6 tracking-[0.2em]">Email</label>
                  <div className="relative"><Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" /><input type="text" value={profile.email} disabled className="w-full bg-slate-100 border-none rounded-[2rem] py-6 pl-14 pr-6 text-sm font-black text-slate-400 cursor-not-allowed" /></div>
                </div>
              </div>
            </section>
            <section className="space-y-8 pt-8 border-t border-slate-100">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-3"><Target className="w-5 h-5" /> Academic Nodes</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-6 tracking-[0.2em]">Institute</label>
                  <select value={profile.institute} onChange={(e) => setProfile({...profile, institute: e.target.value})} className="w-full bg-slate-50 border-none rounded-[2rem] p-6 text-sm font-black text-slate-800 focus:ring-4 focus:ring-indigo-100 transition-all shadow-inner">
                    {INSTITUTES.map(inst => <option key={inst} value={inst}>{inst}</option>)}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-6 tracking-[0.2em]">Target Exam</label>
                  <select value={profile.targetExam} onChange={(e) => setProfile({...profile, targetExam: e.target.value})} className="w-full bg-slate-50 border-none rounded-[2rem] p-6 text-sm font-black text-slate-800 focus:ring-4 focus:ring-indigo-100 transition-all shadow-inner">
                    {NATIONAL_EXAMS.map(ex => <option key={ex} value={ex}>{ex}</option>)}
                  </select>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModule;
