
import React, { useState } from 'react';
import { UserRole, UserAccount } from '../types';
import { api } from '../services/apiService';
import { 
  Mail, Lock, Loader2, User, KeyRound, CheckCircle2, Eye, EyeOff, ShieldCheck, 
  BookOpen, GraduationCap, Zap, ChevronRight, Pencil, Library, Calculator, 
  Target, Bookmark, Award
} from 'lucide-react';

interface LoginModuleProps {
  onLoginSuccess: (user: UserAccount) => void;
  onCancel: () => void;
  onNavigate?: (tab: string) => void;
}

const INSTITUTES = [
  "Allen Career Institute", "FIITJEE", "Resonance", "Aakash Institute",
  "Physics Wallah (PW)", "Narayana Educational Institutions", "Sri Chaitanya",
  "Other / Self Study"
];

const NATIONAL_EXAMS = [
  "JEE Main & Advanced", "JEE Main Only", "BITSAT", "VITEEE", "NEET (Medical)"
];

const TARGET_YEARS = ["2025", "2026", "2027", "2028"];

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
    targetYear: TARGET_YEARS[0]
  });

  const executeAuth = async () => {
    setAuthError(null);
    if (isAuthMode === 'register' && formData.password !== formData.confirmPassword) {
      return setAuthError("Passwords do not match.");
    }

    setIsProcessing(true);
    try {
      let result;
      if (isAuthMode === 'login') {
        result = await api.login({ email: formData.email, role: formData.role, password: formData.password });
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

  const loginAsDemo = async (email: string, role: UserRole) => {
    setIsProcessing(true);
    setAuthError(null);
    const result = await api.login({ email, role, password: 'password' }); 
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
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.6em]">Initializing Study Workspace...</p>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfdfe] relative selection:bg-indigo-100 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[40%] h-[100%] bg-slate-50 border-l border-slate-100 pointer-events-none -z-10 blueprint-bg opacity-40"></div>
      
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center p-6 lg:p-12 gap-12 lg:gap-32 max-w-7xl mx-auto w-full relative z-10">
        
        {/* LEFT: EDUCATION & PREP BRANDING */}
        <div className="lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left space-y-12 animate-in slide-in-from-left duration-1000">
           <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full shadow-sm">
                 <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">The IIT-JEE Portal</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.85] uppercase italic font-space">
                IITJEE <br /><span className="text-indigo-600">PREP.</span>
              </h1>
              <p className="text-slate-500 text-xl font-medium max-w-md italic leading-relaxed">
                "Where rigorous problem solving meets high-performance academic tracking."
              </p>
           </div>

           <div className="relative w-full max-w-sm aspect-square">
              {/* Floating Academic Assets */}
              <div className="absolute -top-10 -left-6 p-6 bg-white rounded-3xl shadow-xl border border-slate-100 animate-bounce duration-[6s] z-20">
                 <Pencil className="w-8 h-8 text-indigo-600" />
              </div>
              <div className="absolute top-[20%] -right-10 p-6 bg-white rounded-3xl shadow-xl border border-slate-100 animate-pulse z-20">
                 <BookOpen className="w-8 h-8 text-emerald-500" />
              </div>
              <div className="absolute -bottom-6 -left-10 p-8 bg-slate-900 rounded-[2.5rem] shadow-2xl text-white z-20">
                 <Library className="w-10 h-10 text-indigo-300" />
              </div>
              <div className="absolute bottom-[10%] -right-6 p-5 bg-white rounded-2xl shadow-lg border border-slate-100 z-20">
                 <Calculator className="w-6 h-6 text-rose-500" />
              </div>

              <div className="relative z-10 w-full h-full glass-card rounded-[5rem] p-4 flex items-center justify-center overflow-hidden group shadow-2xl">
                 <img 
                   src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop" 
                   alt="Learning Environment" 
                   className="w-full h-full object-cover rounded-[4.5rem] opacity-90 group-hover:scale-105 transition-transform duration-[10s]"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent"></div>
                 <div className="absolute bottom-10 left-10 flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center"><Award className="w-6 h-6 text-white" /></div>
                    <div className="text-white text-xs font-black uppercase tracking-widest leading-none">Engineering <br/> Excellence.</div>
                 </div>
              </div>
           </div>
        </div>

        {/* RIGHT: PROFESSIONAL LOGIN FORM */}
        <div className="w-full max-w-md space-y-10 animate-in slide-in-from-right duration-1000">
           <div className="bg-white rounded-[4rem] p-10 md:p-14 space-y-10 relative overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] border border-slate-50">
              
              <div className="text-center space-y-3">
                 <h2 className="text-4xl font-black italic tracking-tighter text-slate-900 uppercase font-space">
                   {isAuthMode === 'login' ? 'Sign In.' : 'New Account.'}
                 </h2>
                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.4em]">Integrated JEE Ecosystem</p>
              </div>

              {authError && (
                <div className="bg-rose-50 border border-rose-100 text-rose-600 px-6 py-4 rounded-2xl text-xs font-bold flex items-center gap-3 animate-in slide-in-from-top-2">
                  <ShieldCheck className="w-5 h-5 shrink-0" /> {authError}
                </div>
              )}

              <div className="space-y-4">
                 {isAuthMode === 'register' && (
                    <div className="relative group">
                       <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                       <input 
                         type="text" placeholder="Candidate Full Name"
                         value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                         className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-black italic shadow-inner focus:bg-white focus:border-indigo-600 transition-all outline-none"
                       />
                    </div>
                 )}

                 <div className="relative group">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                    <input 
                      type="email" placeholder="aspirant@gmail.com"
                      value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-black italic shadow-inner focus:bg-white focus:border-indigo-600 transition-all outline-none"
                    />
                 </div>

                 <div className="relative group">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                    <input 
                      type={showPass ? "text" : "password"} placeholder="Study Pass-Key"
                      value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                      className="w-full pl-14 pr-14 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-black italic shadow-inner focus:bg-white focus:border-indigo-600 transition-all outline-none"
                    />
                    <button 
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-200 hover:text-slate-400 transition-colors"
                    >
                       {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                 </div>
              </div>

              <div className="space-y-6">
                <button 
                  onClick={executeAuth}
                  disabled={isProcessing}
                  className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                >
                  {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <>{isAuthMode === 'login' ? 'Enter Workspace' : 'Begin Prep'} <ChevronRight className="w-4 h-4" /></>}
                </button>

                <div className="text-center">
                  <p className="text-xs font-bold text-slate-400">
                      {isAuthMode === 'login' ? "New to the platform? " : "Already established? "}
                      <button 
                        onClick={() => setIsAuthMode(isAuthMode === 'login' ? 'register' : 'login')}
                        className="text-indigo-600 hover:underline font-black uppercase tracking-widest ml-1"
                      >
                        {isAuthMode === 'login' ? 'Sign Up' : 'Login'}
                      </button>
                  </p>
                </div>
              </div>

              <div className="pt-10 border-t border-slate-50 space-y-6">
                 <div className="text-center text-[9px] font-black uppercase text-slate-300 tracking-[0.4em]">Simulated Academic Profiles</div>
                 <div className="flex gap-2">
                    {[
                      { role: UserRole.STUDENT, email: 'ishu@gmail.com', label: 'Student', color: 'indigo' },
                      { role: UserRole.PARENT, email: 'parent@demo.in', label: 'Parent', color: 'emerald' },
                      { role: UserRole.ADMIN, email: 'admin@demo.in', label: 'Admin', color: 'rose' }
                    ].map(demo => (
                      <button 
                        key={demo.label}
                        onClick={() => loginAsDemo(demo.email, demo.role)}
                        className={`flex-1 py-3.5 bg-slate-50 rounded-2xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-transparent hover:border-indigo-100`}
                      >
                         {demo.label}
                      </button>
                    ))}
                 </div>
              </div>

              <p className="text-[9px] text-center text-slate-400 font-medium italic leading-relaxed px-4">
                "Preparation for India's toughest battles requires focus. By entering, you agree to our <span className="text-indigo-600 underline">Terms of Study</span>."
              </p>
           </div>
        </div>
      </main>

      <footer className="py-12 text-center relative z-10">
         <p className="text-[10px] font-black text-slate-200 uppercase tracking-[1em]">&copy; iitgrrprep architecture 2025</p>
      </footer>
    </div>
  );
};

export default LoginModule;
