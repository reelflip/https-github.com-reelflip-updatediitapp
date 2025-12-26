import React, { useState, useMemo } from 'react';
import { UserRole, UserAccount } from '../types';
import { api } from '../services/apiService';
import { 
  Mail, Lock, Loader2, Shield, ArrowLeft, RefreshCw, KeyRound, Home, 
  BookOpen, Layers, Phone, ChevronRight, UserCircle2, GraduationCap, HeartHandshake,
  ShieldCheck, Fingerprint, HelpCircle, Sparkles, UserPlus, CheckCircle2, AlertTriangle
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
  const [isVerified, setIsVerified] = useState(false);
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
    if (isAuthMode === 'login') return true;
    return formData.password !== '' && formData.password === formData.confirmPassword;
  }, [formData.password, formData.confirmPassword, isAuthMode]);

  const executeAuth = async () => {
    setAuthError(null);
    
    if (!formData.email.trim() || !formData.email.includes('@')) {
      return setAuthError("Identity Required: Valid email address is missing.");
    }
    if (!formData.password.trim()) {
      return setAuthError("Security Required: Password cannot be empty.");
    }

    if (isAuthMode === 'register') {
      if (!formData.name.trim()) return setAuthError("Identity Required: Signature is missing.");
      if (formData.password.length < 6) return setAuthError("Security Weak: Key must be 6+ characters.");
      if (!passwordMatch) return setAuthError("Verify Cipher Mismatch: Input does not match.");
    }

    setIsProcessing(true);

    try {
      let result;
      if (isAuthMode === 'login') {
        let finalRole = role;
        if (formData.email === 'admin@jeepro.in') finalRole = UserRole.ADMIN;
        if (formData.email === 'parent@jeepro.in') finalRole = UserRole.PARENT;
        
        result = await api.login({ email: formData.email, role: finalRole });
      } else {
        result = await api.register({ 
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: role,
          recoveryQuestion: formData.recoveryQuestion,
          recoveryAnswer: formData.recoveryAnswer
        });
      }

      if (result.success && result.user) {
        setIsVerified(true);
        setTimeout(() => {
          onLoginSuccess(result.user);
        }, 1200);
      } else {
        setAuthError(result.error || 'Uplink Denied: Identity could not be verified.');
        setIsProcessing(false);
      }
    } catch (err) {
      setAuthError("Network Fault: Connection to master node timed out.");
      setIsProcessing(false);
    }
  };

  const forceSandbox = () => {
    api.setMode('MOCK');
  };

  const handleQuickLogin = (email: string, targetRole: UserRole) => {
    setFormData({ ...formData, email: email, password: 'demo-password' });
    setRole(targetRole);
    setIsProcessing(true);
    setAuthError(null);
    
    api.login({ email, role: targetRole }).then(result => {
      if (result.success && result.user) {
        setIsVerified(true);
        setTimeout(() => onLoginSuccess(result.user), 800);
      } else {
        setAuthError(result.error);
        setIsProcessing(false);
      }
    });
  };

  if (isVerified) {
    return (
      <div className="fixed inset-0 z-[200] bg-[#020617] flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-500">
         <div className="w-24 h-24 bg-emerald-500/20 border-2 border-emerald-500 rounded-full flex items-center justify-center text-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
            <CheckCircle2 className="w-12 h-12 animate-in zoom-in-50 duration-500" />
         </div>
         <div className="text-center space-y-2">
            <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase">Identity Verified.</h2>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em]">Initializing Academic Node...</p>
         </div>
      </div>
    );
  }

  const showDemo = (window as any).SHOW_DEMO_LOGINS !== false;

  return (
    <div className="min-h-screen z-[100] bg-[#020617] flex flex-col items-center justify-start p-4 py-12 lg:py-20 font-sans overflow-y-auto selection:bg-indigo-500/30">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_20%,#1e1b4b_0%,#020617_100%)] opacity-60"></div>
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
            <p className="text-slate-500 font-bold uppercase text-[9px] tracking-[0.6em] mt-2">Intelligence Gateway v5.6.2</p>
          </div>
        </div>

        <div className="bg-white/[0.02] backdrop-blur-3xl p-8 lg:p-12 rounded-[3.5rem] border border-white/10 shadow-2xl space-y-8 relative overflow-hidden">
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

          <div className="space-y-6 relative z-10">
            <div className="space-y-3">
              <div className="flex items-center justify-between px-2">
                 <label className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">Protocol Role</label>
                 <span className="text-[8px] font-bold text-slate-600 uppercase">Target Node</span>
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

            {authError && (
              <div className="p-5 bg-rose-500/10 border border-rose-500/20 rounded-3xl flex flex-col gap-4 text-rose-400 text-[11px] font-bold animate-in zoom-in-95 shadow-xl">
                 <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 shrink-0" /> 
                    <span>{authError}</span>
                 </div>
                 {authError.includes('Unreachable') && (
                   <button 
                    onClick={forceSandbox}
                    className="w-full py-3 bg-rose-500 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all flex items-center justify-center gap-2"
                   >
                     <RefreshCw className="w-3 h-3" /> Force Sandbox Mode (Bypass Server)
                   </button>
                 )}
              </div>
            )}

            <div className="space-y-5">
              {isAuthMode === 'register' && (
                <div className="space-y-2 animate-in fade-in duration-300">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-3">Identity Signature</label>
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
                    placeholder="aspirant@institute.ac.in" 
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
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-3">Verify Cipher</label>
                    <div className="relative group">
                      <RefreshCw className={`absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 ${passwordMatch && formData.confirmPassword ? 'text-emerald-500' : 'text-slate-600'}`} />
                      <input 
                        type="password" 
                        value={formData.confirmPassword}
                        onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                        className={`w-full bg-black/40 border rounded-2xl py-4 pl-14 pr-6 text-white text-sm font-medium focus:ring-2 outline-none transition-all placeholder:text-slate-700 ${
                          formData.confirmPassword ? (passwordMatch ? 'border-emerald-500/30 focus:ring-emerald-500/20' : 'border-rose-500/30 focus:ring-rose-500/20') : 'border-white/5 focus:ring-indigo-500/40'
                        }`} 
                        placeholder="Confirm cipher key..." 
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={executeAuth}
              disabled={isProcessing}
              className={`w-full py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4 shadow-2xl active:scale-95 disabled:opacity-50 ${
                isAuthMode === 'login' ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-900/40' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-900/40'
              }`}
            >
              {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                <>
                  {isAuthMode === 'login' ? 'Initialize Node' : 'Commit Registration'}
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          {isAuthMode === 'login' && showDemo && (
            <div className="pt-6 border-t border-white/5 space-y-4 relative z-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
               <div className="text-center">
                  <span className="text-[8px] font-black uppercase text-slate-600 tracking-[0.3em]">Verified Demo Uplinks</span>
               </div>
               <div className="grid grid-cols-3 gap-3">
                  <button onClick={() => handleQuickLogin('ishu@gmail.com', UserRole.STUDENT)} className="flex flex-col items-center gap-2 p-3 bg-white/5 hover:bg-indigo-600/20 border border-white/5 hover:border-indigo-500/30 rounded-2xl transition-all group">
                     <GraduationCap className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                     <span className="text-[7px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white">Student</span>
                  </button>
                  <button onClick={() => handleQuickLogin('parent@jeepro.in', UserRole.PARENT)} className="flex flex-col items-center gap-2 p-3 bg-white/5 hover:bg-rose-600/20 border border-white/5 hover:border-rose-500/30 rounded-2xl transition-all group">
                     <HeartHandshake className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
                     <span className="text-[7px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white">Parent</span>
                  </button>
                  <button onClick={() => handleQuickLogin('admin@jeepro.in', UserRole.ADMIN)} className="flex flex-col items-center gap-2 p-3 bg-white/5 hover:bg-emerald-600/20 border border-white/5 hover:border-emerald-500/30 rounded-2xl transition-all group">
                     <ShieldCheck className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                     <span className="text-[7px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white">Admin</span>
                  </button>
               </div>
            </div>
          )}
        </div>

        <div className="mt-12 text-center pb-12 relative z-10">
           <button onClick={onCancel} className="group flex items-center justify-center gap-3 mx-auto text-slate-600 hover:text-slate-300 transition-colors font-black text-[10px] uppercase tracking-[0.4em] bg-white/5 px-10 py-3.5 rounded-2xl border border-white/5 shadow-sm">
              <Home className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" /> 
              Exit Terminal
            </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModule;