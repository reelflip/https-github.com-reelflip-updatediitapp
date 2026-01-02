
import React, { useState } from 'react';
import { UserRole, UserAccount } from '../types';
import { api } from '../services/apiService';
import { 
  Mail, Lock, Loader2, User, KeyRound, CheckCircle2, Eye, EyeOff, ShieldCheck, 
  Target, Bookmark, Award, Building, Calendar, Users, Briefcase, Info, Heart, Cpu,
  Layers, Sparkles, MonitorCheck, Zap, ChevronRight, AlertCircle
} from 'lucide-react';

interface LoginModuleProps {
  onLoginSuccess: (user: UserAccount) => void;
  onCancel: () => void;
  onNavigate?: (tab: string) => void;
}

declare global {
  interface Window {
    HIDE_DEMO_SIGNIN?: boolean;
  }
}

const INSTITUTES = [
  "Allen Career Institute", "FIITJEE", "Resonance", "Aakash Institute",
  "Physics Wallah (PW)", "Narayana Educational Institutions", "Sri Chaitanya",
  "Vibrant Academy", "Bansal Classes", "Unacademy Centre", "Other / Self Study"
];

const NATIONAL_EXAMS = [
  "JEE Main & Advanced", "JEE Main Only", "BITSAT", "VITEEE", "NEET (Medical)", "MHT-CET", "WBJEE", "CUET"
];

const TARGET_YEARS = ["2025", "2026", "2027", "2028"];

const InputField = ({ icon: Icon, type, placeholder, value, onChange, label }: any) => (
  <div className="space-y-1.5">
    {label && <label className="text-[9px] font-black uppercase text-slate-400 ml-3 tracking-widest">{label}</label>}
    <div className="relative group">
      <Icon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
      <input 
        type={type} placeholder={placeholder}
        value={value} onChange={onChange}
        className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold italic shadow-inner focus:bg-white focus:border-indigo-600 transition-all outline-none"
      />
    </div>
  </div>
);

const SelectField = ({ icon: Icon, label, options, value, onChange }: any) => (
  <div className="space-y-1.5">
     <label className="text-[9px] font-black uppercase text-slate-400 ml-3 tracking-widest">{label}</label>
     <div className="relative group">
        <Icon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
        <select 
          value={value} onChange={onChange}
          className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold italic shadow-inner focus:bg-white focus:border-indigo-600 transition-all outline-none appearance-none"
        >
           {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
     </div>
  </div>
);

const LoginModule: React.FC<LoginModuleProps> = ({ onLoginSuccess, onCancel }) => {
  const [isAuthMode, setIsAuthMode] = useState<'login' | 'register'>('login');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);
  
  const [formData, setFormData] = useState({ 
    name: '',
    email: '', 
    password: '',
    confirmPassword: '',
    role: UserRole.STUDENT,
    institute: INSTITUTES[0],
    targetExam: NATIONAL_EXAMS[0],
    targetYear: TARGET_YEARS[0],
    birthDate: '',
    gender: 'Male'
  });

  const executeAuth = async () => {
    setAuthError(null);
    if (isAuthMode === 'register') {
      if (formData.password !== formData.confirmPassword) {
        return setAuthError("Passwords do not match.");
      }
      if (!formData.name || !formData.email || !formData.birthDate || !formData.password) {
        return setAuthError("Please fill all mandatory fields.");
      }
    }

    setIsProcessing(true);
    try {
      let result;
      if (isAuthMode === 'login') {
        result = await api.login({ email: formData.email, password: formData.password });
      } else {
        result = await api.register({ ...formData });
      }

      if (result.success && result.user) {
        setIsVerified(true);
        setTimeout(() => onLoginSuccess(result.user), 1200);
      } else {
        setAuthError(result.error || 'Authentication error.');
        setIsProcessing(false);
      }
    } catch (err) {
      setAuthError("Handshake with server failed. Check your network or system mode.");
      setIsProcessing(false);
    }
  };

  const loginAsDemo = async (email: string) => {
    setIsProcessing(true);
    setAuthError(null);
    const result = await api.login({ email, password: 'password' }); 
    if (result.success && result.user) {
      setIsVerified(true);
      setTimeout(() => onLoginSuccess(result.user), 1200);
    } else {
      setAuthError("Demo entry restricted.");
      setIsProcessing(false);
    }
  };

  if (isVerified) {
    return (
      <div className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-500">
         <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-2xl relative z-10">
            <CheckCircle2 className="w-10 h-10" />
         </div>
         <div className="text-center space-y-1">
            <h2 className="text-2xl font-black italic tracking-tighter uppercase font-space text-slate-900">Uplink Success.</h2>
            <p className="text-slate-400 font-black uppercase text-[9px] tracking-[0.4em]">Establishing Node Context...</p>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfdfe] relative selection:bg-indigo-100 overflow-hidden font-sans animate-in fade-in duration-1000">
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center p-6 lg:p-12 gap-12 lg:gap-20 max-w-7xl mx-auto w-full relative z-10">
        
        <div className="lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left space-y-10">
           <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-5 py-1.5 bg-slate-50 border border-slate-200 rounded-full">
                 <MonitorCheck className="w-4 h-4 text-indigo-600" />
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">System Gateway</span>
              </div>
              <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[1.1] uppercase italic font-space">
                Analytical <br /><span className="text-indigo-600">Preparation.</span>
              </h1>
              <p className="text-slate-500 text-xl font-medium max-w-lg italic leading-relaxed">
                Log in to access your syllabus performance metrics and structured study environment.
              </p>
           </div>

           <div className="grid grid-cols-2 gap-4 w-full max-w-md hidden md:grid">
              {[
                { label: "Syllabus Mapping", icon: Layers, color: "text-indigo-600" },
                { label: "Data Persistence", icon: Cpu, color: "text-emerald-500" },
                { label: "Recall Metrics", icon: Zap, color: "text-amber-500" },
                { label: "Stability Grids", icon: Target, color: "text-rose-500" }
              ].map((item, i) => (
                <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 group">
                   <div className={`w-10 h-10 rounded-xl bg-slate-50 ${item.color} flex items-center justify-center shrink-0`}>
                      <item.icon className="w-5 h-5" />
                   </div>
                   <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{item.label}</span>
                </div>
              ))}
           </div>
        </div>

        <div className="w-full max-w-xl py-10">
           <div className="bg-white rounded-[3.5rem] p-10 md:p-14 space-y-10 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.08)] border border-slate-100 max-h-[90vh] overflow-y-auto custom-scrollbar">
              
              <div className="text-center space-y-2">
                 <h2 className="text-4xl font-black italic tracking-tighter text-slate-900 uppercase font-space">
                   {isAuthMode === 'login' ? 'System Login' : 'Create Node'}
                 </h2>
                 <p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.4em] italic">Authorized Personnel Only</p>
              </div>

              {isAuthMode === 'register' && (
                <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100 shadow-inner">
                   <button 
                    onClick={() => setFormData({...formData, role: UserRole.STUDENT})}
                    className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${formData.role === UserRole.STUDENT ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-400'}`}
                   >
                     <User className="w-4 h-4" /> Aspirant
                   </button>
                   <button 
                    onClick={() => setFormData({...formData, role: UserRole.PARENT})}
                    className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${formData.role === UserRole.PARENT ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-400'}`}
                   >
                     <Users className="w-4 h-4" /> Guardian
                   </button>
                </div>
              )}

              {authError && (
                <div className="bg-rose-50 border border-rose-100 text-rose-600 px-5 py-3 rounded-xl text-xs font-bold flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-4 h-4 shrink-0" /> {authError}
                  </div>
                  {(authError.includes("Server Configuration") || authError.includes("returned HTML")) && (
                    <div className="text-[9px] font-black uppercase text-rose-400 pl-7">
                      Hint: Check Admin Panel → System Hub → Mode. Switch to 'Sandbox' if database is not set up.
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-6">
                 {isAuthMode === 'register' ? (
                   <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField icon={User} type="text" label="Full Name" placeholder="Legal Name" value={formData.name} onChange={(e:any) => setFormData({...formData, name: e.target.value})} />
                        <InputField icon={Mail} type="email" label="Email" placeholder="aspirant@node.edu" value={formData.email} onChange={(e:any) => setFormData({...formData, email: e.target.value})} />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6">
                        <InputField icon={Lock} type="password" label="Password" placeholder="••••••••" value={formData.password} onChange={(e:any) => setFormData({...formData, password: e.target.value})} />
                        <InputField icon={KeyRound} type="password" label="Verify" placeholder="••••••••" value={formData.confirmPassword} onChange={(e:any) => setFormData({...formData, confirmPassword: e.target.value})} />
                      </div>

                      <div className="pt-6 border-t border-slate-50 space-y-6">
                        {formData.role === UserRole.STUDENT && (
                          <>
                            <SelectField icon={Building} label="Coaching Center" options={INSTITUTES} value={formData.institute} onChange={(e:any) => setFormData({...formData, institute: e.target.value})} />
                            <div className="grid grid-cols-2 gap-6">
                               <SelectField icon={Target} label="Target Exam" options={NATIONAL_EXAMS} value={formData.targetExam} onChange={(e:any) => setFormData({...formData, targetExam: e.target.value})} />
                               <SelectField icon={Calendar} label="Year" options={TARGET_YEARS} value={formData.targetYear} onChange={(e:any) => setFormData({...formData, targetYear: e.target.value})} />
                            </div>
                          </>
                        )}
                        <div className="grid grid-cols-2 gap-6">
                          <InputField icon={Calendar} type="date" label="Birth Date" value={formData.birthDate} onChange={(e:any) => setFormData({...formData, birthDate: e.target.value})} />
                          <SelectField icon={Users} label="Gender" options={['Male', 'Female', 'Other']} value={formData.gender} onChange={(e:any) => setFormData({...formData, gender: e.target.value})} />
                        </div>
                      </div>
                   </>
                 ) : (
                   <div className="space-y-6">
                      <InputField icon={Mail} type="email" label="Uplink Address" placeholder="aspirant@node.edu" value={formData.email} onChange={(e:any) => setFormData({...formData, email: e.target.value})} />
                      <div className="relative space-y-1.5">
                        <label className="text-[9px] font-black uppercase text-slate-400 ml-3 tracking-widest">Access Key</label>
                        <div className="relative">
                          <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                          <input 
                            type={showPass ? "text" : "password"} placeholder="••••••••"
                            value={formData.password} onChange={(e:any) => setFormData({...formData, password: e.target.value})}
                            className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold italic shadow-inner outline-none focus:bg-white focus:border-indigo-600 transition-all"
                          />
                          <button onClick={() => setShowPass(!showPass)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">
                             {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                   </div>
                 )}
              </div>

              <div className="space-y-6">
                <button 
                  onClick={executeAuth} disabled={isProcessing}
                  className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.4em] shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{isAuthMode === 'login' ? 'Authenticate' : 'Initialize Node'} <ChevronRight className="w-4 h-4" /></>}
                </button>

                <div className="text-center">
                  <p className="text-[11px] font-bold text-slate-400 italic uppercase tracking-wider">
                      {isAuthMode === 'login' ? "New node? " : "Already verified? "}
                      <button onClick={() => setIsAuthMode(isAuthMode === 'login' ? 'register' : 'login')} className="text-indigo-600 hover:underline font-black">
                        {isAuthMode === 'login' ? 'Register' : 'Login'}
                      </button>
                  </p>
                </div>
              </div>

              {!window.HIDE_DEMO_SIGNIN && (
                <div className="pt-8 border-t border-slate-100 space-y-4">
                   <div className="text-center text-[9px] font-black uppercase text-slate-300 tracking-[0.3em]">Access Simulation Points</div>
                   <div className="flex gap-2">
                      {[{ role: UserRole.STUDENT, email: 'ishu@gmail.com', label: 'Student' }, { role: UserRole.PARENT, email: 'parent@demo.in', label: 'Parent' }, { role: UserRole.ADMIN, email: 'admin@demo.in', label: 'Admin' }].map(demo => (
                        <button key={demo.label} onClick={() => loginAsDemo(demo.email)} className="flex-1 py-3 bg-slate-50 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                           {demo.label}
                        </button>
                      ))}
                   </div>
                </div>
              )}
           </div>
        </div>
      </main>
    </div>
  );
};

export default LoginModule;
