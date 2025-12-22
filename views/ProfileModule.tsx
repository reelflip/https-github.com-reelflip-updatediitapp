
import React, { useState } from 'react';
import { StudentData } from '../types';
import { UserCircle, Save, School, Briefcase, Calendar, GraduationCap, CheckCircle, Globe, HeartHandshake, ShieldCheck, Trash2 } from 'lucide-react';

interface ProfileModuleProps {
  data: StudentData;
  setData: (data: StudentData) => void;
}

const ProfileModule: React.FC<ProfileModuleProps> = ({ data, setData }) => {
  const [profile, setProfile] = useState({
    name: data.name,
    targetYear: data.targetYear || '2025',
    coachingName: data.coachingName || '',
    schoolName: data.schoolName || '',
    targetExams: data.targetExams || ['JEE Mains']
  });
  const [isSaved, setIsSaved] = useState(false);

  const availableExams = ['JEE Mains', 'JEE Advanced', 'BITSAT', 'VITEEE', 'KVPY', 'Olympiads'];

  const toggleExam = (exam: string) => {
    const current = [...profile.targetExams];
    if (current.includes(exam)) {
      setProfile({ ...profile, targetExams: current.filter(e => e !== exam) });
    } else {
      setProfile({ ...profile, targetExams: [...current, exam] });
    }
  };

  const handleSave = () => {
    setData({
      ...data,
      name: profile.name,
      targetYear: profile.targetYear,
      coachingName: profile.coachingName,
      schoolName: profile.schoolName,
      targetExams: profile.targetExams
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const revokeHandshake = () => {
    if (confirm("Revoking the handshake will terminate real-time visibility for your parent. Continue?")) {
      setData({ ...data, connectedParent: undefined });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight italic">Academic Profile.</h2>
          <p className="text-slate-500 font-medium">Manage your identity and academic targets.</p>
        </div>
        <button 
          onClick={handleSave}
          className={`px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all ${isSaved ? 'bg-emerald-500 text-white shadow-emerald-100' : 'bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700 hover:scale-105'}`}
        >
          {isSaved ? <><CheckCircle className="w-5 h-5 inline mr-2" /> Saved</> : <><Save className="w-5 h-5 inline mr-2" /> Save Profile</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-white p-12 rounded-[3.5rem] border border-slate-200 text-center shadow-sm relative overflow-hidden group">
              <div className="absolute inset-0 bg-slate-50/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-36 h-36 bg-slate-100 rounded-[3rem] mx-auto mb-8 flex items-center justify-center border-8 border-slate-50 overflow-hidden shadow-inner relative z-10">
                <UserCircle className="w-full h-full text-slate-200" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 italic relative z-10">{profile.name}</h3>
              <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.3em] mt-2 relative z-10">Student Node: {data.id}</p>
           </div>
           
           <div className="bg-indigo-950 p-10 rounded-[3rem] text-white space-y-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10"><ShieldCheck className="w-32 h-32" /></div>
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 backdrop-blur-md">
                    <HeartHandshake className="w-6 h-6 text-indigo-300" />
                 </div>
                 <h4 className="font-black italic text-xl">Handshake Status</h4>
              </div>

              {data.connectedParent ? (
                <div className="space-y-6">
                   <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10 space-y-4">
                      <div>
                         <div className="text-[10px] font-black uppercase text-indigo-400 tracking-widest mb-1">Connected Parent</div>
                         <div className="text-lg font-black">{data.connectedParent.name}</div>
                      </div>
                      <div className="flex justify-between items-end">
                         <div>
                            <div className="text-[10px] font-black uppercase text-indigo-400 tracking-widest mb-1">Since</div>
                            <div className="text-xs font-bold text-slate-300">{data.connectedParent.linkedSince}</div>
                         </div>
                         <button 
                          onClick={revokeHandshake}
                          className="p-3 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl transition-all border border-white/10"
                         >
                            <Trash2 className="w-5 h-5" />
                         </button>
                      </div>
                   </div>
                   <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">
                      "Family Handshake allows Mr. Ramesh Sharma to view your Live Syllabus Progress, Mock Results, and Psychometric Profile."
                   </p>
                </div>
              ) : (
                <div className="space-y-4 text-center py-6 border-2 border-dashed border-white/10 rounded-[2rem]">
                   <Globe className="w-10 h-10 text-slate-500 mx-auto opacity-50" />
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No Active Connections</p>
                </div>
              )}
           </div>
        </div>

        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-sm space-y-12">
            <section className="space-y-8">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-3">
                <GraduationCap className="w-5 h-5" /> Personal Information
              </h4>
              <div className="grid grid-cols-1 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-6 tracking-[0.2em]">Full Legal Name</label>
                  <input 
                    type="text" 
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-[2rem] p-6 text-sm font-black text-slate-800 focus:ring-4 focus:ring-indigo-100 transition-all shadow-inner" 
                    placeholder="Enter your name" 
                  />
                </div>
              </div>
            </section>

            <section className="space-y-8">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-3">
                <Calendar className="w-5 h-5" /> Goal Configuration
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-6 tracking-[0.2em]">Target Exam Year</label>
                  <select 
                    value={profile.targetYear}
                    onChange={(e) => setProfile({...profile, targetYear: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-[2rem] p-6 text-sm font-black text-slate-800 appearance-none focus:ring-4 focus:ring-indigo-100 transition-all shadow-inner"
                  >
                    <option>2025</option>
                    <option>2026</option>
                    <option>2027</option>
                  </select>
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-6 tracking-[0.2em]">Priority Target Exams</label>
                <div className="flex flex-wrap gap-3 ml-4">
                  {availableExams.map(exam => (
                    <button 
                      key={exam}
                      onClick={() => toggleExam(exam)}
                      className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                        profile.targetExams.includes(exam) 
                        ? 'bg-slate-900 border-slate-900 text-white shadow-xl' 
                        : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      {exam}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className="space-y-8 pt-8 border-t border-slate-100">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-3">
                <School className="w-5 h-5" /> Academic Nodes
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-6 tracking-[0.2em]">Coaching Institute</label>
                  <div className="relative">
                    <Briefcase className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <input 
                      type="text" 
                      value={profile.coachingName}
                      onChange={(e) => setProfile({...profile, coachingName: e.target.value})}
                      className="w-full bg-slate-50 border-none rounded-[2rem] py-6 pl-16 pr-6 text-sm font-black text-slate-800 shadow-inner" 
                      placeholder="Allen, FIITJEE..." 
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-6 tracking-[0.2em]">School Affiliation</label>
                  <div className="relative">
                    <School className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <input 
                      type="text" 
                      value={profile.schoolName}
                      onChange={(e) => setProfile({...profile, schoolName: e.target.value})}
                      className="w-full bg-slate-50 border-none rounded-[2rem] py-6 pl-16 pr-6 text-sm font-black text-slate-800 shadow-inner" 
                      placeholder="Enter school name" 
                    />
                  </div>
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
