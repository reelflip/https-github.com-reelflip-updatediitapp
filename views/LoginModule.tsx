
import React, { useState } from 'react';
import { UserRole, UserAccount } from '../types';
import { api } from '../services/apiService';
import { 
  Mail, Lock, Loader2, User, KeyRound, CheckCircle2, Eye, EyeOff, Users, ShieldCheck, Sparkles, LogIn, ChevronRight, School, Target, Calendar, BookOpen, GraduationCap, Zap, Activity
} from 'lucide-react';

interface LoginModuleProps {
  onLoginSuccess: (user: UserAccount) => void;
  onCancel: () => void;
  onNavigate?: (tab: string) => void;
}

const INSTITUTES = [
  "Allen Career Institute", "FIITJEE", "Resonance", "Aakash Institute",
  "Physics Wallah (PW)", "Narayana Educational Institutions", "Sri Chaitanya",
  "Vibrant Academy", "Bansal Classes", "Unacademy Centre", "Byju's Tuition Centre",
  "Motion Education", "Reliable Institute", "Other / Self Study"
];

const NATIONAL_EXAMS = [
  "JEE Main & Advanced", "JEE Main Only", "BITSAT", "VITEEE", "NEET (Medical)",
  "WBJEE", "MHT-CET", "KVPY / Olympiads", "COMEDK / KCET", "CUET"
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
    
    if (isAuthMode === 'register') {
      if (!formData.name.trim()) return setAuthError("Full Name is required.");
      if (formData.password !== formData.confirmPassword) return setAuthError("Passwords do not match.");
    }
    if (!formData.email.trim()) return setAuthError("Email is required.");
    if (!formData.password.trim()) return setAuthError("Password is required.");

    setIsProcessing(true);
    try {
      let result;
      if (isAuthMode === 'login') {
        result = await api.login({ email: formData.email, role: formData.role, password: formData.password });
      } else {
        result = await api.register({ 
          name: formData.name, 
          email: formData.email, 
          password: formData.password, 
          role: formData.role,
          institute: formData.institute,
          targetExam: formData.targetExam,
          targetYear: formData.targetYear
        });
      }

      if (result.success && result.user) {
        setIsVerified(true);
        setTimeout(() => onLoginSuccess(result.user), 1000);
      } else {
        setAuthError(result.error || 'Authentication failed. Please check your credentials.');
        setIsProcessing(false);
      }
    } catch (err) {
      setAuthError("Server connection failed. Please try again.");
      setIsProcessing(false);
    }
  };

  const loginAsDemo = async (email: string, role: UserRole) => {
    setIsProcessing(true);
    setAuthError(null);
    const result = await api.login({ email, role, password: 'password' }); 
    if (result.success && result.user) {
      setIsVerified(true);
      setTimeout(() => onLoginSuccess(result.user), 1000);
    } else {
      setAuthError("Demo access failed.");
      setIsProcessing(false);
    }
  };

  if (isVerified) {
    return (
      <div className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center space-y-12 animate-in fade-in duration-500">
         <div className="relative">
            <div className="absolute -inset-8 bg-[#82c341] rounded-full animate-ping opacity-10"></div>
            <div className="absolute -inset-4 bg-[#82c341] rounded-full animate-pulse opacity-20"></div>
            <CheckCircle2 className="w-32 h-32 text-[#82c341] relative z-10" />
         </div>
         <div className="text-center space-y-4">
            <h2 className="text-5xl font-black text-[#0a1128] tracking-tighter uppercase italic font-space">
              Success.
            </h2>
            <p className="text-slate-400 font-black uppercase text-[11px] tracking-[0.6em]">Logging you into the platform...</p>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f7ff] flex flex-col relative overflow-x-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[100px] opacity-60"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[100px] opacity-60"></div>
      </div>

      <header className="w-full flex justify-between items-center py-6 px-12 relative z-10">
        <div className="text-2xl font-black text-[#2b4c8c] cursor-pointer tracking-tighter uppercase font-space" onClick={onCancel}>iitjeeprep</div>
        <button 
          onClick={() => setIsAuthMode(isAuthMode === 'login' ? 'register' : 'login')}
          className="px-8 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
        >
          {isAuthMode === 'login' ? 'Sign Up' : 'Login'}
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 pt-8 pb-20">
        <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center justify-center gap-12 xl:gap-24">
          
          {/* LEFT SIDE ILLUSTRATION (Now specifically next to form) */}
          <div className="hidden lg:flex lg:w-1/2 flex-col items-center space-y-12 animate-in slide-in-from-left duration-1000">
            <div className="relative w-full max-w-lg aspect-square">
               <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-[#82c341]/10 rounded-[6rem] blur-3xl opacity-50"></div>
               
               {/* Illustrative items */}
               <div className="absolute -top-10 -left-10 p-8 bg-white rounded-3xl shadow-2xl border border-slate-100 animate-bounce duration-[7s] z-20">
                  <BookOpen className="w-10 h-10 text-[#82c341]" />
               </div>
               <div className="absolute -bottom-6 -right-6 p-8 bg-indigo-900 rounded-3xl shadow-2xl text-white animate-pulse z-20">
                  <GraduationCap className="w-10 h-10 text-indigo-300" />
               </div>
               <div className="absolute top-[20%] -right-12 p-6 bg-white rounded-3xl shadow-xl border border-slate-100 z-20">
                  <Zap className="w-8 h-8 text-amber-400" />
               </div>

               <div className="relative z-10 w-full h-full bg-white/40 backdrop-blur-md rounded-[5rem] border border-white/50 shadow-2xl flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://img.freepik.com/free-vector/flat-hand-drawn-patient-doctor-illustration_23-2148858204.jpg?t=st=1720000000~exp=1720003600~hmac=..." 
                    alt="Study Concept" 
                    className="w-4/5 h-4/5 object-contain mix-blend-multiply opacity-90 transition-transform duration-[10s] hover:scale-105"
                    style={{ filter: 'hue-rotate(220deg)' }} 
                  />
               </div>
            </div>
            <div className="text-center space-y-4 max-w-md">
               <h2 className="text-4xl font-black text-[#0a1128] tracking-tighter uppercase italic leading-none">Engineering <br /><span className="text-[#82c341]">The Future.</span></h2>
               <p className="text-slate-500 font-medium italic leading-relaxed">"Join a network of elite aspirants using high-frequency telemetry to dominate the JEE Advanced battlefield."</p>
            </div>
          </div>

          {/* RIGHT SIDE AUTH CARD */}
          <div className="bg-white w-full max-w-[500px] p-10 md:p-14 rounded-[3.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] space-y-8 border border-slate-50 animate-in slide-in-from-right duration-1000">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-black text-[#0a1128] italic uppercase tracking-tighter font-space">
                {isAuthMode === 'login' ? 'Sign In.' : 'Create Account.'}
              </h1>
              <div className="h-1 w-16 bg-blue-600 mx-auto rounded-full"></div>
            </div>

            <div className="space-y-5">
              {authError && (
                <div className="bg-rose-50 border border-rose-100 text-rose-600 px-6 py-4 rounded-2xl text-xs font-bold flex items-center gap-3 animate-in slide-in-from-top-2">
                  <ShieldCheck className="w-5 h-5 shrink-0" /> {authError}
                </div>
              )}

              <div className="space-y-4">
                {isAuthMode === 'register' && (
                  <>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-100 py-4 pl-12 pr-4 rounded-xl text-sm font-medium outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner"
                        placeholder="Full Name" 
                      />
                    </div>

                    <div className="relative group">
                      <School className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                      <select 
                        value={formData.institute}
                        onChange={e => setFormData({...formData, institute: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-100 py-4 pl-12 pr-10 rounded-xl text-sm font-medium outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner appearance-none"
                      >
                        {INSTITUTES.map(inst => <option key={inst} value={inst}>{inst}</option>)}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative group">
                        <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                        <select 
                          value={formData.targetExam}
                          onChange={e => setFormData({...formData, targetExam: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-100 py-4 pl-12 pr-10 rounded-xl text-sm font-medium outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner appearance-none"
                        >
                          {NATIONAL_EXAMS.map(exam => <option key={exam} value={exam}>{exam}</option>)}
                        </select>
                      </div>
                      <div className="relative group">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                        <select 
                          value={formData.targetYear}
                          onChange={e => setFormData({...formData, targetYear: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-100 py-4 pl-12 pr-10 rounded-xl text-sm font-medium outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner appearance-none"
                        >
                          {TARGET_YEARS.map(year => <option key={year} value={year}>{year}</option>)}
                        </select>
                      </div>
                    </div>
                  </>
                )}

                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 py-4 pl-12 pr-10 rounded-xl text-sm font-medium outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner"
                    placeholder="aditya@gmail.com" 
                  />
                  {formData.email.includes('@') && <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />}
                </div>

                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <input 
                    type={showPass ? 'text' : 'password'} 
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 py-4 pl-12 pr-12 rounded-xl text-sm font-medium outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner"
                    placeholder="••••••" 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600"
                  >
                     {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {isAuthMode === 'register' && (
                  <div className="relative group">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <input 
                      type={showPass ? 'text' : 'password'} 
                      value={formData.confirmPassword}
                      onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 py-4 pl-12 pr-4 rounded-xl text-sm font-medium outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner"
                      placeholder="Confirm Password" 
                    />
                  </div>
                )}
              </div>

              <button 
                onClick={executeAuth}
                disabled={isProcessing}
                className="w-full py-4 bg-[#3a7bd5] hover:bg-[#3269b8] text-white rounded-xl font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95"
              >
                {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : isAuthMode === 'login' ? 'Login' : 'Create Account'}
              </button>

              <div className="text-center space-y-2">
                {isAuthMode === 'login' && (
                  <button className="text-xs font-bold text-blue-600 hover:underline">Forgot Password?</button>
                )}
                <p className="text-xs font-medium text-slate-500">
                  {isAuthMode === 'login' ? "Don't have an account? " : "Already have an account? "}
                  <button 
                    onClick={() => setIsAuthMode(isAuthMode === 'login' ? 'register' : 'login')}
                    className="text-blue-600 font-bold hover:underline"
                  >
                    {isAuthMode === 'login' ? 'Sign Up' : 'Login'}
                  </button>
                </p>
              </div>

              {/* QUICK ACCESS DEMO LOGIN */}
              <div id="demo-login-line" className="pt-6 border-t border-slate-50 flex flex-col items-center gap-3">
                 <span className="text-[10px] font-black uppercase text-slate-300 tracking-[0.3em]">Quick Demo Access</span>
                 <div className="flex justify-center gap-2 w-full">
                    {[
                      { email: 'ishu@gmail.com', role: UserRole.STUDENT, label: 'Student', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
                      { email: 'parent@demo.in', role: UserRole.PARENT, label: 'Parent', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
                      { email: 'admin@demo.in', role: UserRole.ADMIN, label: 'Admin', color: 'bg-rose-50 text-rose-600 border-rose-100' }
                    ].map((demo, i) => (
                      <button 
                        key={i}
                        onClick={() => loginAsDemo(demo.email, demo.role)}
                        className={`flex-1 px-2 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 ${demo.color} border shadow-sm flex items-center justify-center gap-1.5`}
                      >
                        <CheckCircle2 className="w-3 h-3" /> {demo.label}
                      </button>
                    ))}
                 </div>
              </div>

              <p className="text-[9px] text-center text-slate-400 font-medium leading-relaxed px-4 pt-4">
                By continuing, you agree to our <span className="text-blue-600 underline">Terms of Service</span> & <span className="text-blue-600 underline">Privacy Policy</span>
              </p>
            </div>
          </div>
        </div>

        {/* Feature Overview Section (Stayed below the row) */}
        <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 px-4 animate-in fade-in slide-in-from-bottom-10 duration-1000">
           {[
             { 
               title: 'Monitor Your Progress', 
               desc: 'Track subject-wise progress to see how prepared you are for Physics, Chemistry, and Maths.',
               img: 'https://cdn-icons-png.flaticon.com/512/1126/1126768.png',
               accent: 'blue'
             },
             { 
               title: 'Organized Study Plans', 
               desc: 'Daily study plans to keep you on track. Mark tasks as completed and stay organized.',
               img: 'https://cdn-icons-png.flaticon.com/512/3209/3209265.png',
               accent: 'emerald'
             },
             { 
               title: 'Analyze Mock Tests', 
               desc: 'Review your mock test scores and analyze performance to identify your strengths and areas to improve.',
               img: 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png',
               accent: 'rose'
             }
           ].map((feature, i) => (
             <div key={i} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col items-center text-center space-y-6 group">
                <div className="w-24 h-24 flex items-center justify-center p-4 bg-slate-50 rounded-full group-hover:scale-110 transition-transform duration-500 shadow-inner">
                   <img src={feature.img} alt={feature.title} className="w-full h-full object-contain" />
                </div>
                <div className="space-y-2">
                   <h3 className="text-xl font-bold text-[#0a1128] tracking-tight">{feature.title}</h3>
                   <p className="text-xs text-slate-500 font-medium leading-relaxed italic line-clamp-2">
                     "{feature.desc}"
                   </p>
                </div>
             </div>
           ))}
        </div>
      </main>

      <footer className="py-12 border-t border-slate-100 bg-white relative z-10 px-6 text-center">
         <p className="text-xs font-bold text-slate-300 uppercase tracking-[0.4em]">&copy; 2025 iitjeeprep platform</p>
      </footer>
    </div>
  );
};

export default LoginModule;
