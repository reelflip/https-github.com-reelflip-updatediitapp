
import React, { useState, useMemo } from 'react';
import { UserRole, UserAccount } from '../types';
import { api } from '../services/apiService';
import { 
  Mail, Lock, Loader2, Shield, ArrowLeft, RefreshCw, KeyRound, Home, 
  BookOpen, Layers, Phone, ChevronRight, UserCircle2, GraduationCap, HeartHandshake,
  ShieldCheck, Fingerprint, HelpCircle, Sparkles, UserPlus
} from 'lucide-react';

interface LoginModuleProps {
  onLoginSuccess: (user: UserAccount) => void;
  onCancel: () => void;
  onNavigate?: (tab: string) => void;
}

const SECURITY_QUESTIONS = [
  "What was the name of your first school?",
  "What is your mother's maiden name?",
  "In what city was your first high school?",
  "What was the name of your first pet?",
  "What is your favorite book for IITGEEPREP?"
];

const LoginModule: React.FC<LoginModuleProps> = ({ onLoginSuccess, onCancel, onNavigate }) => {
  const [isAuthMode, setIsAuthMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [isProcessing, setIsProcessing] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '', 
    recoveryQuestion: SECURITY_QUESTIONS[0],
    recoveryAnswer: '' 
  });

  const passwordMatch = useMemo(() => {
    return formData.password !== '' && formData.password === formData.confirmPassword;
  }, [formData.password, formData.confirmPassword]);

  const passwordStrength = useMemo(() => {
    if (!formData.password) return 0;
    let strength = 0;
    if (formData.password.length >= 8) strength += 25;
    if (/[A-Z]/.test(formData.password)) strength += 25;
    if (/[0-9]/.test(formData.password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(formData.password)) strength += 25;
    return strength;
  }, [formData.password]);

  const handleLinkClick = (id: string) => {
    if (onNavigate) onNavigate(id);
  };

  const handleQuickLogin = (email: string, targetRole: UserRole) => {
    setFormData({ ...formData, email: email, password: '••••••••' });
    setRole(targetRole);
    executeAuth(email, targetRole);
  };

  const executeAuth = async (email: string, targetRole: UserRole) => {
    // Front-end validation for Registration
    if (isAuthMode === 'register') {
      if (!formData.name.trim()) return setAuthError("Identity Required: Please enter your full name.");
      if (!formData.email.trim() || !formData.email.includes('@')) return setAuthError("Contact Invalid: A valid email address is required.");
      if (formData.password.length < 6) return setAuthError("Security Weak: Password must be at least 6 characters.");
      if (!passwordMatch) return setAuthError("Credential Mismatch: Verification key does not match.");
      if (!formData.recoveryAnswer.trim()) return setAuthError("Recovery Missing: Please provide a security answer.");
    } else {
      // Basic login validation
      if (!formData.email.trim()) return setAuthError("Email required for authentication.");
      if (!formData.password.trim()) return setAuthError("Password required for authentication.");
    }

    setIsProcessing(true);
    setAuthError(null);

    let result;
    if (isAuthMode === 'login') {
      // For demo purposes, we infer role from email if it's a demo account, else default to student
      let finalRole = targetRole;
      if (email === 'admin@jeepro.in') finalRole = UserRole.ADMIN;
      if (email === 'parent@jeepro.in') finalRole = UserRole.PARENT;
      
      result = await api.login({ email, role: finalRole });
    } else {
      result = await api.register({ 
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: targetRole,
        recoveryQuestion: formData.recoveryQuestion,
        recoveryAnswer: formData.recoveryAnswer
      });
    }

    if (result.success && result.user) {
      onLoginSuccess(result.user);
    } else {
      setAuthError(result.error || 'Access Denied: Verification failed.');
    }
    setIsProcessing(false);
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    executeAuth(formData.email, role);
  };

  const showDemo = (window as any).SHOW_DEMO_LOGINS !== false;

  return (
    <div className="min-h-screen z-[100] bg-[#020617] flex flex-col items-center justify-start p-4 py-12 lg:py-20 font-sans overflow-y-auto selection:bg-indigo-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_20%,#1e1b4b_0%,#020617_100%)] opacity-60"></div>
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
      </div>

      <div className="max-w-[500px] w-full animate-in fade-in zoom-in-95 duration-700 relative z-10">
        <div className="text-center space-y-4 mb-8">
          <div onClick={onCancel} className="inline-flex p-4 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl cursor-pointer hover:bg-white/10 transition-all hover:scale-105 group shadow-2xl">
            <Fingerprint className="text-indigo-400 w-8 h-8 transition-transform group-hover:rotate-12" />
          </div>
          <div>
            <h1 className="text-5xl font-black text-white tracking-tighter italic uppercase leading-none">
              IITGEE<span className="text-indigo-500">PREP.</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase text-[9px] tracking-[0.6em] mt-2">Verified Identity Gateway</p>
          </div>
        </div>

        <div className="bg-white/[0.02] backdrop-blur-3xl p-8 lg:p-12 rounded-[3.5rem] border border-white/10 shadow-[0_30px_100px_-15px_rgba(0,0,0,0.7)] space-y-8 relative overflow-hidden">
          {/* AUTH MODE TOGGLE */}
          <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5 relative z-10">
            <button 
              onClick={() => { setIsAuthMode('login'); setAuthError(null); }} 
              className={`flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${isAuthMode === 'login' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Lock className="w-3 h-3" /> Sign In
            </button>
            <button 
              onClick={() => { setIsAuthMode('register'); setAuthError(null); }} 
              className={`flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${isAuthMode === 'register' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <UserPlus className="w-3 h-3" /> Registration
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-6 relative z-10">
            {/* ROLE SELECTION - ONLY VISIBLE DURING REGISTRATION */}
            {isAuthMode === 'register' && (
              <div className="space-y-3 animate-in slide-in-from-top-4 duration-500">
                <div className="flex items-center justify-between px-2">
                   <label className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">Account Type</label>
                   <span className="text-[8px] font-bold text-slate-600 uppercase">Step 01 / Selection</span>
                </div>
                <div className="grid grid-cols-2 gap-2 p-1.5 bg-black/30 rounded-2xl border border-white/5">
                    <button 
                      type="button" 
                      onClick={() => setRole(UserRole.STUDENT)} 
                      className={`py-3.5 rounded-xl flex items-center justify-center gap-3 transition-all ${
                        role === UserRole.STUDENT ? 'bg-indigo-600 text-white shadow-lg' : 'bg-transparent text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <GraduationCap className={`w-4 h-4 ${role === UserRole.STUDENT ? 'text-white' : 'text-slate-600'}`} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Student</span>
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setRole(UserRole.PARENT)} 
                      className={`py-3.5 rounded-xl flex items-center justify-center gap-3 transition-all ${
                        role === UserRole.PARENT ? 'bg-indigo-600 text-white shadow-lg' : 'bg-transparent text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <HeartHandshake className={`w-4 h-4 ${role === UserRole.PARENT ? 'text-white' : 'text-slate-600'}`} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Guardian</span>
                    </button>
                </div>
              </div>
            )}

            {authError && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-400 text-[11px] font-bold animate-in zoom-in-95">
                 <Shield className="w-4 h-4 shrink-0" /> {authError}
              </div>
            )}

            <div className="space-y-5">
              {isAuthMode === 'register' && (
                <div className="space-y-2 animate-in fade-in duration-300">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-3">Full Identity</label>
                  <div className="relative group">
                    <UserCircle2 className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-indigo-400" />
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white text-sm font-medium focus:ring-2 focus:ring-indigo-500/40 outline-none transition-all placeholder:text-slate-700" 
                      placeholder="e.g. Aryan Sharma" 
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-3">Uplink Address</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-indigo-400" />
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white text-sm font-medium focus:ring-2 focus:ring-indigo-500/40 outline-none transition-all placeholder:text-slate-700" 
                    placeholder="name@institute.com" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-3">Cipher Key</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-indigo-400" />
                  <input 
                    type="password" 
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white text-sm font-medium focus:ring-2 focus:ring-indigo-500/40 outline-none transition-all placeholder:text-slate-700" 
                    placeholder="••••••••" 
                  />
                </div>
              </div>

              {isAuthMode === 'register' && (
                <div className="space-y-5 animate-in fade-in duration-500">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-3">Verify Key</label>
                    <div className="relative group">
                      <RefreshCw className={`absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 ${passwordMatch ? 'text-emerald-500' : 'text-slate-600'}`} />
                      <input 
                        type="password" 
                        value={formData.confirmPassword}
                        onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                        className={`w-full bg-black/40 border rounded-2xl py-4 pl-14 pr-6 text-white text-sm font-medium focus:ring-2 outline-none transition-all placeholder:text-slate-700 ${
                          formData.confirmPassword ? (passwordMatch ? 'border-emerald-500/30 focus:ring-emerald-500/20' : 'border-rose-500/30 focus:ring-rose-500/20') : 'border-white/5 focus:ring-indigo-500/40'
                        }`} 
                        placeholder="Confirm password..." 
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="flex justify-between items-center px-2">
                       <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
                         <HelpCircle className="w-3 h-3" /> Recovery Protocol
                       </label>
                    </div>
                    <select 
                      value={formData.recoveryQuestion}
                      onChange={e => setFormData({...formData, recoveryQuestion: e.target.value})}
                      className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm font-medium focus:ring-2 focus:ring-indigo-500/40 outline-none appearance-none cursor-pointer"
                    >
                      {SECURITY_QUESTIONS.map(q => <option key={q} value={q} className="bg-slate-900">{q}</option>)}
                    </select>
                    <div className="relative group">
                      <KeyRound className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-emerald-400" />
                      <input 
                        type="text" 
                        value={formData.recoveryAnswer}
                        onChange={e => setFormData({...formData, recoveryAnswer: e.target.value})}
                        className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white text-sm font-medium focus:ring-2 focus:ring-indigo-500/40 outline-none transition-all placeholder:text-slate-700" 
                        placeholder="Secret answer..." 
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button 
              type="submit" disabled={isProcessing}
              className={`w-full py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4 shadow-2xl active:scale-95 disabled:opacity-50 ${
                isAuthMode === 'login' ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-900/40' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-900/40'
              }`}
            >
              {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                <>
                  {isAuthMode === 'login' ? 'Initialize Session' : 'Register Profile'}
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Quick Access Profiles */}
          {isAuthMode === 'login' && showDemo && (
            <div className="pt-6 border-t border-white/5 space-y-4 relative z-10 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300">
               <div className="text-center">
                  <span className="text-[8px] font-black uppercase text-slate-600 tracking-[0.3em]">Demo Access Nodes</span>
               </div>
               <div className="grid grid-cols-3 gap-3">
                  <button 
                    onClick={() => handleQuickLogin('ishu@gmail.com', UserRole.STUDENT)}
                    className="flex flex-col items-center gap-2 p-3 bg-white/5 hover:bg-indigo-600/20 border border-white/5 hover:border-indigo-500/30 rounded-2xl transition-all group"
                  >
                     <GraduationCap className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                     <span className="text-[7px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white">Student</span>
                  </button>
                  <button 
                    onClick={() => handleQuickLogin('parent@jeepro.in', UserRole.PARENT)}
                    className="flex flex-col items-center gap-2 p-3 bg-white/5 hover:bg-rose-600/20 border border-white/5 hover:border-rose-500/30 rounded-2xl transition-all group"
                  >
                     <HeartHandshake className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
                     <span className="text-[7px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white">Guardian</span>
                  </button>
                  <button 
                    onClick={() => handleQuickLogin('admin@jeepro.in', UserRole.ADMIN)}
                    className="flex flex-col items-center gap-2 p-3 bg-white/5 hover:bg-emerald-600/20 border border-white/5 hover:border-emerald-500/30 rounded-2xl transition-all group"
                  >
                     <ShieldCheck className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                     <span className="text-[7px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white">Admin</span>
                  </button>
               </div>
            </div>
          )}
        </div>

        <div className="mt-12 text-center space-y-12 pb-12 relative z-10">
           <button 
              onClick={onCancel}
              className="group flex items-center justify-center gap-3 mx-auto text-slate-600 hover:text-slate-300 transition-colors font-black text-[10px] uppercase tracking-[0.4em] bg-white/5 px-10 py-3.5 rounded-2xl border border-white/5 shadow-sm"
            >
              <Home className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" /> 
              Home Portal
            </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModule;
