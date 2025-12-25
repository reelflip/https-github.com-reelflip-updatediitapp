
import React, { useState, useMemo } from 'react';
import { UserRole, UserAccount } from '../types';
import { api } from '../services/apiService';
import { 
  Mail, Lock, Loader2, TrendingUp, AlertCircle, Zap, 
  Shield, ArrowLeft, RefreshCw, KeyRound, Home, 
  Info, BookOpen, Layers, Phone, ChevronRight, UserCircle2, GraduationCap, HeartHandshake,
  CheckCircle2, XCircle, ShieldCheck, Fingerprint, HelpCircle
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
  "What is your favorite book for JEE prep?"
];

const LoginModule: React.FC<LoginModuleProps> = ({ onLoginSuccess, onCancel, onNavigate }) => {
  const [isAuthMode, setIsAuthMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [isProcessing, setIsProcessing] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  
  const footerLinks = [
    { id: 'features', label: 'Features', icon: Layers },
    { id: 'examguide', label: 'Exam Guide', icon: BookOpen },
    { id: 'contact', label: 'Contact', icon: Phone },
  ];

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

  const handleLinkClick = (tab: string) => {
    if (onNavigate) {
      onNavigate(tab);
    } else {
      onCancel();
    }
  };

  const executeAuth = async (email: string, targetRole: UserRole) => {
    if (isAuthMode === 'register') {
      if (!passwordMatch) {
        setAuthError("Handshake Error: Passwords do not match.");
        return;
      }
      if (passwordStrength < 50) {
        setAuthError("Security Protocol: Password is too weak.");
        return;
      }
      if (!formData.recoveryAnswer.trim()) {
        setAuthError("Recovery Error: Security answer is required.");
        return;
      }
    }

    setIsProcessing(true);
    setAuthError(null);

    let result;
    if (isAuthMode === 'login') {
      result = await api.login({ email, role: targetRole });
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
      setAuthError(result.error || 'Authentication sequence failed.');
    }
    setIsProcessing(false);
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    executeAuth(formData.email, role);
  };

  return (
    <div className="min-h-screen z-[100] bg-slate-950 flex flex-col items-center justify-start p-4 py-12 lg:py-20 font-sans overflow-y-auto selection:bg-indigo-500/30">
      {/* Dynamic Network Background - Fixed position to stay behind scrolling content */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#1e1b4b_0%,#020617_100%)] opacity-40"></div>
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-blue-50/10 blur-[100px] rounded-full animate-bounce duration-[15s]"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.05]"></div>
      </div>

      <div className="max-w-[480px] w-full animate-in fade-in zoom-in-95 duration-700 relative z-10">
        {/* Branding Header */}
        <div className="text-center space-y-4 mb-8">
          <div onClick={onCancel} className="inline-flex p-4 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl cursor-pointer hover:bg-white/10 transition-all hover:scale-105 group shadow-2xl">
            <Fingerprint className="text-indigo-400 w-8 h-8 transition-transform group-hover:rotate-12" />
          </div>
          <div>
            <h1 className="text-5xl font-black text-white tracking-tighter italic uppercase leading-none">
              JEE<span className="text-indigo-500">NODE.</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase text-[9px] tracking-[0.6em] mt-2">Verified Identity Gateway</p>
          </div>
        </div>

        {/* Auth Glass Card - No internal scrollbar, full height expansion */}
        <div className="bg-white/[0.02] backdrop-blur-3xl p-10 rounded-[3.5rem] border border-white/10 shadow-[0_30px_100px_-15px_rgba(0,0,0,0.7)] space-y-8 relative overflow-hidden">
          
          {/* Mode Switcher */}
          <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5 relative z-10">
            <button 
              onClick={() => { setIsAuthMode('login'); setAuthError(null); }} 
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${isAuthMode === 'login' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Lock className="w-3 h-3" /> Sign In
            </button>
            <button 
              onClick={() => { setIsAuthMode('register'); setAuthError(null); }} 
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${isAuthMode === 'register' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <UserCircle2 className="w-3 h-3" /> Registration
            </button>
          </div>

          {authError && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-400 text-[11px] font-bold animate-in slide-in-from-top-2 relative z-10">
               <Shield className="w-4 h-4 shrink-0" /> {authError}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-6 relative z-10">
            {isAuthMode === 'register' && (
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-3">Full Identity</label>
                <div className="relative group">
                  <UserCircle2 className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-indigo-400" />
                  <input 
                    type="text" required 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white text-sm font-medium focus:ring-2 focus:ring-indigo-500/40 outline-none transition-all placeholder:text-slate-700" 
                    placeholder="e.g. Aryan Sharma" 
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-3">Node Address (Email)</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-indigo-400" />
                <input 
                  type="email" required 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white text-sm font-medium focus:ring-2 focus:ring-indigo-500/40 outline-none transition-all placeholder:text-slate-700" 
                  placeholder="name@institute.com" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-3">Cipher Key</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-indigo-400" />
                  <input 
                    type="password" required 
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white text-sm font-medium focus:ring-2 focus:ring-indigo-500/40 outline-none transition-all placeholder:text-slate-700" 
                    placeholder="••••••••" 
                  />
                </div>
              </div>

              {isAuthMode === 'register' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-3">Verify Key</label>
                  <div className="relative group">
                    <RefreshCw className={`absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 ${passwordMatch ? 'text-emerald-500' : 'text-slate-600'}`} />
                    <input 
                      type="password" required 
                      value={formData.confirmPassword}
                      onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                      className={`w-full bg-black/40 border rounded-2xl py-4 pl-14 pr-6 text-white text-sm font-medium focus:ring-2 outline-none transition-all placeholder:text-slate-700 ${
                        formData.confirmPassword ? (passwordMatch ? 'border-emerald-500/30 focus:ring-emerald-500/20' : 'border-rose-500/30 focus:ring-rose-500/20') : 'border-white/5 focus:ring-indigo-500/40'
                      }`} 
                      placeholder="••••••••" 
                    />
                  </div>
                </div>
              )}
            </div>

            {isAuthMode === 'register' && (
               <div className="space-y-4 animate-in fade-in duration-500">
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${
                        passwordStrength < 50 ? 'bg-rose-500' : passwordStrength < 100 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`} 
                      style={{ width: `${passwordStrength}%` }}
                    ></div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-3 flex items-center gap-2">
                      <HelpCircle className="w-3 h-3" /> Recovery Challenge Question
                    </label>
                    <select 
                      value={formData.recoveryQuestion}
                      onChange={e => setFormData({...formData, recoveryQuestion: e.target.value})}
                      className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-white text-sm font-medium focus:ring-2 focus:ring-indigo-500/40 outline-none appearance-none"
                    >
                      {SECURITY_QUESTIONS.map(q => <option key={q} value={q} className="bg-slate-900">{q}</option>)}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-3">Encrypted Answer</label>
                    <div className="relative group">
                      <KeyRound className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-emerald-400" />
                      <input 
                        type="text" required 
                        value={formData.recoveryAnswer}
                        onChange={e => setFormData({...formData, recoveryAnswer: e.target.value})}
                        className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white text-sm font-medium focus:ring-2 focus:ring-indigo-500/40 outline-none transition-all placeholder:text-slate-700" 
                        placeholder="Security answer..." 
                      />
                    </div>
                  </div>
               </div>
            )}
            
            {/* Role Handshake Grid */}
            <div className="grid grid-cols-2 gap-4">
                <button 
                  type="button" 
                  onClick={() => setRole(UserRole.STUDENT)} 
                  className={`py-4 rounded-2xl flex flex-col items-center justify-center gap-2 border-2 transition-all group ${
                    role === UserRole.STUDENT ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400 shadow-xl' : 'border-white/5 text-slate-600 hover:border-white/10'
                  }`}
                >
                  <GraduationCap className={`w-5 h-5 transition-transform group-hover:scale-110 ${role === UserRole.STUDENT ? 'text-indigo-400' : 'text-slate-600'}`} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Student Node</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => setRole(UserRole.PARENT)} 
                  className={`py-4 rounded-2xl flex flex-col items-center justify-center gap-2 border-2 transition-all group ${
                    role === UserRole.PARENT ? 'border-rose-500 bg-rose-500/10 text-rose-400 shadow-xl' : 'border-white/5 text-slate-600 hover:border-white/10'
                  }`}
                >
                  <HeartHandshake className={`w-5 h-5 transition-transform group-hover:scale-110 ${role === UserRole.PARENT ? 'text-rose-400' : 'text-slate-600'}`} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Guardian Node</span>
                </button>
            </div>

            <button 
              type="submit" disabled={isProcessing || (isAuthMode === 'register' && (!passwordMatch || passwordStrength < 50))}
              className={`w-full py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4 shadow-2xl active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed ${
                isAuthMode === 'login' ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                <>
                  {isAuthMode === 'login' ? 'Initialize Node' : 'Register Handshake'}
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Global Footer Utilities - Consistent for both modes */}
        <div className="mt-12 text-center space-y-12 pb-12 relative z-10">
           <div className="flex justify-center gap-12">
              {footerLinks.map(link => (
                <button 
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className="flex flex-col items-center gap-2 text-[10px] font-black uppercase text-slate-600 hover:text-indigo-400 transition-colors tracking-[0.2em] group"
                >
                  <link.icon className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                  {link.label}
                </button>
              ))}
           </div>
           
           <button 
              onClick={onCancel}
              className="group flex items-center justify-center gap-3 mx-auto text-slate-600 hover:text-slate-300 transition-colors font-black text-[10px] uppercase tracking-[0.4em] bg-white/5 px-8 py-3 rounded-2xl border border-white/5 shadow-sm"
            >
              <Home className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" /> 
              Terminal Root
            </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModule;
