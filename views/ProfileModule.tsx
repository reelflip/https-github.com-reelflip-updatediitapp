
import React, { useState } from 'react';
import { StudentData } from '../types';
import { UserCircle, Save, School, Briefcase, Calendar, GraduationCap, CheckCircle, Globe } from 'lucide-react';

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

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Academic Profile</h2>
          <p className="text-slate-500">Manage your identity and academic targets.</p>
        </div>
        <button 
          onClick={handleSave}
          className={`px-8 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all ${isSaved ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 hover:bg-indigo-700'}`}
        >
          {isSaved ? <><CheckCircle className="w-5 h-5" /> Saved Successfully</> : <><Save className="w-5 h-5" /> Save Changes</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 text-center shadow-sm">
              <div className="w-32 h-32 bg-slate-100 rounded-full mx-auto mb-6 flex items-center justify-center border-4 border-slate-50 overflow-hidden">
                <UserCircle className="w-full h-full text-slate-300" />
              </div>
              <h3 className="text-2xl font-black text-slate-800">{profile.name}</h3>
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">JEE Aspirant</p>
           </div>
           
           <div className="bg-indigo-900 p-8 rounded-[2.5rem] text-white space-y-6 shadow-xl">
              <div className="flex items-center gap-3">
                 <Globe className="w-6 h-6 text-indigo-400" />
                 <h4 className="font-bold">Privacy Control</h4>
              </div>
              <p className="text-xs text-indigo-100/70 leading-relaxed">Your academic profile is only visible to your assigned parent account and your primary mentor.</p>
           </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-10">
            <section className="space-y-6">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <GraduationCap className="w-4 h-4" /> Personal Information
              </h4>
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Full Name</label>
                  <input 
                    type="text" 
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold" 
                    placeholder="Enter your name" 
                  />
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Exam Targets
              </h4>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Target Year</label>
                  <select 
                    value={profile.targetYear}
                    onChange={(e) => setProfile({...profile, targetYear: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold appearance-none"
                  >
                    <option>2025</option>
                    <option>2026</option>
                    <option>2027</option>
                  </select>
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Targeted Competitions</label>
                <div className="flex flex-wrap gap-2">
                  {availableExams.map(exam => (
                    <button 
                      key={exam}
                      onClick={() => toggleExam(exam)}
                      className={`px-6 py-2 rounded-xl text-xs font-bold transition-all border-2 ${
                        profile.targetExams.includes(exam) 
                        ? 'bg-indigo-600 border-indigo-600 text-white' 
                        : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      {exam}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className="space-y-6 pt-4 border-t border-slate-50">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <School className="w-4 h-4" /> Institutional Affiliation
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Coaching Institute</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      value={profile.coachingName}
                      onChange={(e) => setProfile({...profile, coachingName: e.target.value})}
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold" 
                      placeholder="e.g. Allen, FIITJEE..." 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Current School</label>
                  <div className="relative">
                    <School className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      value={profile.schoolName}
                      onChange={(e) => setProfile({...profile, schoolName: e.target.value})}
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold" 
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
