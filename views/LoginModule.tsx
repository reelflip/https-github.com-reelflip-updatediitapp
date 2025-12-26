import React, { useState, useMemo } from 'react';
import { UserRole, UserAccount } from '../types';
import { api } from '../services/apiService';
import { 
  Mail, Lock, Loader2, Home, ChevronRight, GraduationCap, 
  ShieldCheck, Fingerprint, AlertTriangle, Building, Target, 
  Calendar, User, ArrowRight, Users, KeyRound, CheckCircle2, Heart
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
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '', 
    institute: INSTITUTES[0],
    targetExam: NATIONAL_EXAMS[0],
    targetYear: TARGET_YEARS[0],
    birthDate: '',
    gender: '',
    recoveryQuestion: '',
    recoveryAnswer: '' 
  });

  const passwordMatch = useMemo(() => {
    if (isAuthMode === 'login') return true;
    return formData.password !== '' && formData.password === formData.confirmPassword;
  }, [formData.password, formData.confirmPassword, isAuthMode]);

  const executeAuth = async () => {
    setAuthError(null);
    if (!formData.email.trim() || !formData.email.includes('@')) {
      return setAuthError("Protocol Error: Uplink address invalid.");
    }
    if (!formData.password.trim()) {
      return setAuthError("Security Violation: Cipher key missing.");
    }

    setIsProcessing(true);
    try {
      let result;
      if (isAuthMode === 'login') {
        // Backend handles role detection now
        result = await api.login({ email: formData.email, role: UserRole.STUDENT, password: formData.password });
      } else {
        result = await api.register({ ...formData, role });
      }

      if (result.success && result.user) {
        setIsVerified(true);
        setTimeout(() => onLoginSuccess(result.user), 1000);
      } else {
        setAuthError(result.error || 'Access Denied: Credentials rejected by node.');
        setIsProcessing(false);
      }
    } catch (err) {
      setAuthError("Network Fault: Gateway link interrupted.");
      setIsProcessing(false);
    }
  };

  const handleQuickLogin = (email: string, targetRole: UserRole) => {
    setIsProcessing(true);
    setAuthError(null);
    localStorage.setItem('jeepro_datasource_mode', 'MOCK');
    setTimeout(() => {
      let mockUser: UserAccount = { 
        id: Math.random().toString(36).substr(2, 9), 
        name: email.split('@')[0], 
        email, 
        role: targetRole, 
        createdAt: new Date().toISOString() 
      };
      setIsVerified(true);
      setTimeout(() => onLoginSuccess(mockUser), 800);
    }, 800);
  };

  if (isVerified) {
    return (
      <div className="fixed inset-0 z-[200] bg-[#0a0c1a] flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-500">
         <div className="w-24 h-24 bg-indigo-500/20 border-2 border-indigo-500 rounded-full flex items-center justify-center text-indigo-400 shadow-[0_0_40px_rgba(99,102,241,0.3)]">
            <CheckCircle2 className="w-12 h-12 animate-in zoom-in-50 duration-500" />
         </div>
         <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Handshake Successful.</h2>
            <p className="text-indigo-400 font-bold uppercase text-[10px] tracking-[0.4em]">Establishing Academic Link...</p>
         </div>
      </div>
    );
  }

  const labelClasses = "text-[10px] font-black uppercase text-[#4a5578] tracking-[0.2em] mb-4 block";
  const inputContainerClasses = "relative group bg-[#0d1021] border border-[#1e2440] rounded-2xl transition-all focus-within:border-indigo-500/50 focus-within:bg-[#0a0c1a]";
  const inputClasses = "w-full bg-transparent py-5 pl-14 pr-6 text-white text-sm font-bold outline-none placeholder:text-[#2d3656]";

  return (
    <div className="min-h-screen z-[100] bg-[#0a0c1a] flex flex-col items-center justify-center p-6 font-sans selection:bg-indigo-500/20">
      
      {/* BRANDING TOP */}
      <div className="text-center space-y-8 mb-12 animate-in fade-in slide-in-from-top-4 duration-1000">
         <div className="relative inline-block">
            <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 rounded-full"></div>
            <div className="relative w-20 h-20 bg-[#161a2e] border border-[#2d3656] rounded-[2rem] flex items-center justify-center text-indigo-400 shadow-2xl">
               <Fingerprint className="w-10 h-10" />
            </div>
         </div>
         <div className="space-y-1">
            <h1 className="text-6xl font-black text-white tracking-tighter italic uppercase leading-none">
              IITGEE<span className="text-[#5d5fef]">PREP.</span>
            </h1>
            <p className="text-[#4a5578] font-black uppercase text-[10px] tracking-[0.5em]">Intelligence Gateway v5.6.2</p>
         </div>
      </div>

      <div className="max-w-[550px] w-full animate-in fade-in zoom-in-95 duration-700">
        
        {/* MAIN INTERFACE CARD */}
        <div className="bg-[#161a2e] p-8 md:p-12 rounded-[4rem] border border-[#2d3656] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] space-y-12">
          
          {/* TOP NAV TABS */}
          <div className="flex bg-[#0d1021] p-1.5 rounded-3xl border border-[#1e2440]">
            <button 
              onClick={() => setIsAuthMode('login')}
              className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all ${isAuthMode === 'login' ? 'bg-[#5d5fef] text-white shadow-xl shadow-indigo-500/20' : 'text-[#4a5578] hover:text-[#7d8cb8]'}`}
            >
              <Lock className="w-4 h-4" /> Sign In
            </button>
            <button 
              onClick={() => setIsAuthMode('register')}
              className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all ${isAuthMode === 'register' ? 'bg-[#5d5fef] text-white shadow-xl shadow-indigo-500/20' : 'text-[#4a5578] hover:text-[#7d8cb8]'}`}
            >
              <User className="w-4 h-4" /> Registration
            </button>
          </div>

          <div className="space-y-10">
            {authError && (
              <div className="p-5 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-4 animate-in shake duration-300">
                 <AlertTriangle className="w-5 h-5 shrink-0" /> {authError}
              </div>
            )}

            {/* REGISTRATION EXTRA FIELDS (Includes Protocol Role) */}
            {isAuthMode === 'register' && (
              <div className="space-y-10 animate-in slide-in-from-left duration-500">
                {/* PROTOCOL ROLE SELECTOR - ONLY ON REGISTRATION */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className={labelClasses.replace('mb-4', 'mb-0')}>Protocol Role</label>
                    <span className="text-[8px] font-black text-[#2d3656] uppercase tracking-widest">Target Node</span>
                  </div>
                  <div className="flex bg-[#0d1021] p-1.5 rounded-3xl border border-[#1e2440]">
                    <button 
                      onClick={() => setRole(UserRole.STUDENT)}
                      className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all ${role === UserRole.STUDENT ? 'bg-[#5d5fef] text-white' : 'text-[#4a5578] hover:text-[#7d8cb8]'}`}
                    >
                      <GraduationCap className="w-4 h-4" /> Student
                    </button>
                    <button 
                      onClick={() => setRole(UserRole.PARENT)}
                      className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all ${role === UserRole.PARENT ? 'bg-[#5d5fef] text-white' : 'text-[#4a5578] hover:text-[#7d8cb8]'}`}
                    >
                      <Heart className="w-4 h-4" /> Guardian
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className={labelClasses}>Personal Identity</label>
                  <div className={inputContainerClasses}>
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2d3656] group-focus-within:text-indigo-400" />
                    <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={inputClasses} placeholder="Full legal name" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className={labelClasses}>Institute</label>
                    <select value={formData.institute} onChange={e => setFormData({...formData, institute: e.target.value})} className="w-full bg-[#0d1021] border border-[#1e2440] rounded-2xl p-5 text-white text-[10px] font-black uppercase tracking-widest appearance-none outline-none focus:border-indigo-500/50">
                      {INSTITUTES.map(inst => <option key={inst} value={inst}>{inst}</option>)}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className={labelClasses}>Target Year</label>
                    <select value={formData.targetYear} onChange={e => setFormData({...formData, targetYear: e.target.value})} className="w-full bg-[#0d1021] border border-[#1e2440] rounded-2xl p-5 text-white text-[10px] font-black uppercase tracking-widest appearance-none outline-none focus:border-indigo-500/50">
                      {TARGET_YEARS.map(yr => <option key={yr} value={yr}>{yr}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* PRIMARY CREDENTIALS */}
            <div className="space-y-10">
              <div className="space-y-3">
                <label className={labelClasses}>Uplink Address</label>
                <div className={inputContainerClasses}>
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2d3656] group-focus-within:text-indigo-400" />
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className={inputClasses}
                    placeholder="aspirant@institute.ac.in" 
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className={labelClasses}>Cipher Key</label>
                <div className={inputContainerClasses}>
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2d3656] group-focus-within:text-indigo-400" />
                  <input 
                    type="password" 
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    className={inputClasses}
                    placeholder="••••••••" 
                  />
                </div>
              </div>

              {isAuthMode === 'register' && (
                <div className="space-y-3 animate-in slide-in-from-bottom-2">
                  <label className={labelClasses}>Verify Cipher</label>
                  <div className={`${inputContainerClasses} ${formData.confirmPassword && !passwordMatch ? 'border-rose-500/50' : ''}`}>
                    <ShieldCheck className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2d3656] group-focus-within:text-indigo-400" />
                    <input 
                      type="password" 
                      value={formData.confirmPassword}
                      onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                      className={inputClasses}
                      placeholder="Repeat key" 
                    />
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={executeAuth}
              disabled={isProcessing}
              className="w-full py-6 bg-[#5d5fef] hover:bg-[#4b4dec] text-white rounded-[1.8rem] font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 shadow-[0_15px_35px_-10px_rgba(93,95,239,0.5)] disabled:opacity-50 active:scale-95"
            >
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{isAuthMode === 'login' ? 'Execute Uplink' : 'Initialize Node'} <ArrowRight className="w-5 h-5" /></>}
            </button>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="mt-12 space-y-8 text-center animate-in fade-in delay-500">
           <div className="flex items-center justify-center gap-8">
              <button onClick={onCancel} className="text-[#4a5578] hover:text-white font-black text-[9px] uppercase tracking-[0.4em] transition-colors flex items-center gap-3">
                 <Home className="w-3.5 h-3.5" /> Return Home
              </button>
              <div className="w-1 h-1 rounded-full bg-[#1e2440]"></div>
              <button className="text-[#4a5578] hover:text-white font-black text-[9px] uppercase tracking-[0.4em] transition-colors flex items-center gap-3">
                 <KeyRound className="w-3.5 h-3.5" /> Recover Key
              </button>
           </div>

           {/* QUICK SIMULATOR (Subtle) */}
           <div className="pt-8 border-t border-[#1e2440]/50 space-y-6">
              <span className="text-[8px] font-black uppercase text-[#2d3656] tracking-[0.5em]">Simulation Overrides</span>
              <div className="flex justify-center gap-4">
                 {[
                   { label: 'Admin', email: 'admin@jeepro.in', role: UserRole.ADMIN, icon: ShieldCheck },
                   { label: 'Student', email: 'ishu@gmail.com', role: UserRole.STUDENT, icon: GraduationCap },
                   { label: 'Parent', email: 'parent@jeepro.in', role: UserRole.PARENT, icon: Users },
                 ].map(sim => (
                   <button 
                    key={sim.label} 
                    onClick={() => handleQuickLogin(sim.email, sim.role)}
                    className="group px-6 py-3 bg-[#0d1021] border border-[#1e2440] rounded-xl hover:border-indigo-500/40 transition-all flex items-center gap-3"
                   >
                      <sim.icon className="w-3 h-3 text-[#2d3656] group-hover:text-indigo-400" />
                      <span className="text-[8px] font-black uppercase text-[#4a5578] group-hover:text-white tracking-widest">{sim.label}</span>
                   </button>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModule;