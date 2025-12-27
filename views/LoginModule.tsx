
import React, { useState } from 'react';
import { UserRole, UserAccount } from '../types';
import { api } from '../services/apiService';
import { 
  Mail, Lock, Loader2, User, KeyRound, CheckCircle2, Eye, EyeOff, ShieldCheck, 
  BookOpen, GraduationCap, Zap, ChevronRight, Pencil, Library, Calculator, 
  Target, Bookmark, Award, Building, Calendar, Users, Briefcase, Info, Heart
} from 'lucide-react';

interface LoginModuleProps {
  onLoginSuccess: (user: UserAccount) => void;
  onCancel: () => void;
  onNavigate?: (tab: string) => void;
}

// Global declaration to handle dynamic hiding in index.html
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
  <div className="space-y-2">
    {label && <label className="text-[9px] font-black uppercase text-slate-400 ml-4 tracking-widest">{label}</label>}
    <div className="relative group">
      <Icon className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
      <input 
        type={type} placeholder={placeholder}
        value={value} onChange={onChange}
        className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-black italic shadow-inner focus:bg-white focus:border-indigo-600 transition-all outline-none"
      />
    </div>
  </div>
);

const SelectField = ({ icon: Icon, label, options, value, onChange }: any) => (
  <div className="space-y-2">
     <label className="text-[9px] font-black uppercase text-slate-400 ml-4 tracking-widest">{label}</label>
     <div className="relative group">
        <Icon className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
        <select 
          value={value} onChange={onChange}
          className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-black italic shadow-inner focus:bg-white focus:border-indigo-600 transition-all outline-none appearance-none"
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
      setAuthError("Handshake with server failed.");
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
      <div className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-500">
         <div className="relative">
            <div className="absolute -inset-8 bg-indigo-500 rounded-full animate-ping opacity-10"></div>
            <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl relative z-10 rotate-12">
               <CheckCircle2 className="w-12 h-12" />
            </div>
         </div>
         <div className="text-center space-y-2">
            <h2 className="text-3xl font-black italic tracking-tighter uppercase font-space text-slate-900">Verified.</h2>
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.6em]">Initializing Academic Node...</p>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfdfe] relative selection:bg-indigo-100 overflow-hidden">
      <div className="absolute top-0 right-0 w-[40%] h-[100%] bg-slate-50 border-l border-slate-100 pointer-events-none -z-10 blueprint-bg opacity-40"></div>
      
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center p-6 lg:p-12 gap-12 lg:gap-24 max-w-7xl mx-auto w-full relative z-10">
        
        <div className="lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left space-y-8 animate-in slide-in-from-left duration-1000">
           <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full shadow-sm">
                 <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">The Solaris Hub</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.85] uppercase italic font-space">
                IITJEE <br /><span className="text-indigo-600">PRO.</span>
              </h1>
              <p className="text-slate-500 text-xl font-medium max-w-md italic leading-relaxed">
                "Where rigorous problem solving meets high-performance academic tracking."
              </p>
           </div>

           <div className="relative w-full max-w-sm aspect-square hidden md:block">
              <div className="absolute -top-10 -left-6 p-6 bg-white rounded-3xl shadow-xl border border-slate-100 animate-bounce duration-[6s] z-20"><Pencil className="w-8 h-8 text-indigo-600" /></div>
              <div className="absolute top-[20%] -right-10 p-6 bg-white rounded-3xl shadow-xl border border-slate-100 animate-pulse z-20"><BookOpen className="w-8 h-8 text-emerald-500" /></div>
              <div className="absolute -bottom-6 -left-10 p-8 bg-slate-900 rounded-[2.5rem] shadow-2xl text-white z-20"><Library className="w-10 h-10 text-indigo-300" /></div>
              <div className="relative z-10 w-full h-full glass-card rounded-[5rem] p-4 flex items-center justify-center overflow-hidden group shadow-2xl">
                 <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop" alt="Learning" className="w-full h-full object-cover rounded-[4.5rem] opacity-90 group-hover:scale-105 transition-transform duration-[10s]" />
              </div>
           </div>
        </div>

        <div className="w-full max-w-xl space-y-10 animate-in slide-in-from-right duration-1000 py-10">
           <div className="bg-white rounded-[4rem] p-8 md:p-12 space-y-8 relative overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] border border-slate-50 max-h-[90vh] overflow-y-auto custom-scrollbar">
              
              <div className="text-center space-y-3 pt-4">
                 <h2 className="text-4xl font-black italic tracking-tighter text-slate-900 uppercase font-space">
                   {isAuthMode === 'login' ? 'Sign In.' : 'New Account.'}
                 </h2>
                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.4em]">Integrated JEE Ecosystem</p>
              </div>

              {isAuthMode === 'register' && (
                <div className="flex bg-slate-50 p-1.5 rounded-[1.8rem] border border-slate-100 shadow-inner">
                   <button 
                    onClick={() => setFormData({...formData, role: UserRole.STUDENT})}
                    className={`flex-1 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${formData.role === UserRole.STUDENT ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                   >
                     <User className="w-4 h-4" /> Aspirant
                   </button>
                   <button 
                    onClick={() => setFormData({...formData, role: UserRole.PARENT})}
                    className={`flex-1 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${formData.role === UserRole.PARENT ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                   >
                     <Users className="w-4 h-4" /> Guardian
                   </button>
                </div>
              )}

              {authError && (
                <div className="bg-rose-50 border border-rose-100 text-rose-600 px-6 py-4 rounded-2xl text-xs font-bold flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 shrink-0" /> {authError}
                </div>
              )}

              <div className="space-y-6">
                 {isAuthMode === 'register' ? (
                   <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField icon={User} type="text" label="Full Name" placeholder="Full Legal Name" value={formData.name} onChange={(e:any) => setFormData({...formData, name: e.target.value})} />
                        <InputField icon={Mail} type="email" label="Email Address" placeholder="aspirant@gmail.com" value={formData.email} onChange={(e:any) => setFormData({...formData, email: e.target.value})} />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6">
                        <InputField icon={Lock} type="password" label="Pass-Key" placeholder="••••••••" value={formData.password} onChange={(e:any) => setFormData({...formData, password: e.target.value})} />
                        <InputField icon={KeyRound} type="password" label="Confirm" placeholder="••••••••" value={formData.confirmPassword} onChange={(e:any) => setFormData({...formData, confirmPassword: e.target.value})} />
                      </div>

                      <div className="pt-6 border-t border-slate-50 space-y-6">
                        {formData.role === UserRole.STUDENT && (
                          <>
                            <div className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.3em] text-center italic flex items-center justify-center gap-3">
                               <div className="h-px bg-indigo-100 flex-1"></div>
                               Academic Target
                               <div className="h-px bg-indigo-100 flex-1"></div>
                            </div>

                            <SelectField icon={Building} label="Coaching Institute" options={INSTITUTES} value={formData.institute} onChange={(e:any) => setFormData({...formData, institute: e.target.value})} />
                            
                            <div className="grid grid-cols-2 gap-6">
                               <SelectField icon={Target} label="Target Exam" options={NATIONAL_EXAMS} value={formData.targetExam} onChange={(e:any) => setFormData({...formData, targetExam: e.target.value})} />
                               <SelectField icon={Calendar} label="Year" options={TARGET_YEARS} value={formData.targetYear} onChange={(e:any) => setFormData({...formData, targetYear: e.target.value})} />
                            </div>
                          </>
                        )}

                        <div className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.3em] text-center italic flex items-center justify-center gap-3">
                           <div className="h-px bg-indigo-100 flex-1"></div>
                           Profile Meta
                           <div className="h-px bg-indigo-100 flex-1"></div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          <InputField icon={Calendar} type="date" label="Birth Date" value={formData.birthDate} onChange={(e:any) => setFormData({...formData, birthDate: e.target.value})} />
                          <SelectField icon={Users} label="Gender" options={['Male', 'Female', 'Other']} value={formData.gender} onChange={(e:any) => setFormData({...formData, gender: e.target.value})} />
                        </div>
                      </div>
                   </>
                 ) : (
                   <div className="space-y-6 py-6">
                      <InputField icon={Mail} type="email" label="Uplink Address" placeholder="aspirant@gmail.com" value={formData.email} onChange={(e:any) => setFormData({...formData, email: e.target.value})} />
                      <div className="relative group space-y-2">
                        <label className="text-[9px] font-black uppercase text-slate-400 ml-4 tracking-widest">Secret Pass-Key</label>
                        <div className="relative">
                          <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                          <input 
                            type={showPass ? "text" : "password"} placeholder="••••••••"
                            value={formData.password} onChange={(e:any) => setFormData({...formData, password: e.target.value})}
                            className="w-full pl-14 pr-14 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-black italic shadow-inner focus:bg-white focus:border-indigo-600 transition-all outline-none"
                          />
                          <button onClick={() => setShowPass(!showPass)} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-200 hover:text-slate-400 transition-colors">
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
                  className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                >
                  {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <>{isAuthMode === 'login' ? 'Establish Link' : 'Initialize Workspace'} <ChevronRight className="w-4 h-4" /></>}
                </button>

                <div className="text-center">
                  <p className="text-xs font-bold text-slate-400">
                      {isAuthMode === 'login' ? "New to the platform? " : "Already established? "}
                      <button onClick={() => setIsAuthMode(isAuthMode === 'login' ? 'register' : 'login')} className="text-indigo-600 hover:underline font-black uppercase tracking-widest ml-1">
                        {isAuthMode === 'login' ? 'Sign Up' : 'Login'}
                      </button>
                  </p>
                </div>
              </div>

              {/* SIMULATED QUICK ENTRY: Conditioned for visibility control via index.html flag */}
              {!window.HIDE_DEMO_SIGNIN && (
                <div className="pt-8 border-t border-slate-50 space-y-6 pb-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                   <div className="text-center text-[9px] font-black uppercase text-slate-300 tracking-[0.4em]">Simulated Quick Entry</div>
                   <div className="flex gap-2">
                      {[{ role: UserRole.STUDENT, email: 'ishu@gmail.com', label: 'Aspirant' }, { role: UserRole.PARENT, email: 'parent@demo.in', label: 'Guardian' }, { role: UserRole.ADMIN, email: 'admin@demo.in', label: 'Sentinel' }].map(demo => (
                        <button key={demo.label} onClick={() => loginAsDemo(demo.email)} className="flex-1 py-3 bg-slate-50 rounded-2xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-transparent hover:border-indigo-100">
                           {demo.label}
                        </button>
                      ))}
                   </div>
                </div>
              )}
           </div>
        </div>
      </main>

      <footer className="py-8 text-center relative z-10 opacity-30">
         <p className="text-[10px] font-black text-slate-900 uppercase tracking-[1em]">&copy; iitgrrprep architecture 2025</p>
      </footer>
    </div>
  );
};

export default LoginModule;
