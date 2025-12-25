
import React, { useState } from 'react';
import { UserRole, UserAccount } from '../types';
import { api } from '../services/apiService';
import { 
  Mail, Lock, Loader2, TrendingUp, AlertCircle, Zap, 
  Shield, ArrowLeft, RefreshCw, KeyRound, Home, 
  Info, BookOpen, Layers, Phone, ChevronRight, UserCircle2, GraduationCap, HeartHandshake
} from 'lucide-react';

interface LoginModuleProps {
  onLoginSuccess: (user: UserAccount) => void;
  onCancel: () => void;
  onNavigate?: (tab: string) => void;
}

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
    recoveryPhrase: '' 
  });

  const showDemoLogins = (window as any).SHOW_DEMO_LOGINS && !api.isDemoDisabled();

  const handleLinkClick = (tab: string) => {
    if (onNavigate) {
      onNavigate(tab);
    } else {
      onCancel();
    }
  };

  const executeAuth = async (email: string, targetRole: UserRole) => {
    if (isAuthMode === 'register') {
      if (formData.password !== formData.confirmPassword) {
        setAuthError("Passwords do not match.");
        return;
      }
      if (formData.password.length < 6) {
        setAuthError("Password must be at least 6 characters.");
        return;
      }
      if (!formData.recoveryPhrase.trim()) {
        setAuthError("Please provide a recovery phrase for security.");
        return;
      }
    }

    setIsProcessing(true);
    setAuthError(null);

    let result;
    if (isAuthMode === 'login') {
      result = await api.login({ email, role: targetRole });
    } else {
      result = await api.register({ ...formData, role: targetRole });
    }

    if (result.success && result.user) {
      onLoginSuccess(result.user);
    } else {
      setAuthError(result.error || 'Authentication failed');
    }
    setIsProcessing(false);
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    executeAuth(formData.email, role);
  };

  const handleDemoLogin = (demoRole: UserRole, demoEmail: string) => {
    setRole(demoRole);
    setFormData({ ...formData, email: demoEmail });
    setIsAuthMode('login');
    setTimeout(() => executeAuth(demoEmail, demoRole), 100);
  };

  const footerLinks = [
    { id: 'about', label: 'About', icon: Info },
    { id: 'features', label: 'Tech', icon: Layers },
    { id: 'contact', label: 'Support', icon: Phone },
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex items-center justify-center p-4 font-sans overflow-hidden selection:bg-indigo-500/30">
      {/* Sophisticated Background with Animated Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-blue-500/10 blur-[100px] rounded-full animate-bounce duration-[10s]"></div>
        <div className="absolute -bottom-[10%] left-[20%] w-[35%] h-[35%] bg-violet-600/15 blur-[120px] rounded-full animate-pulse delay-700"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
      </div>

      <div className="max-w-[440px] w-full animate-in fade-in zoom-in-95 duration-700 relative z-10">
        {/* Branding Header */}
        <div className="text-center space-y-3 mb-8">
          <div onClick={onCancel} className="inline-flex p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl cursor-pointer hover:bg-white/10 transition-all hover:scale-105 group">
            <TrendingUp className="text-indigo-400 w-6 h-6 transition-transform group-hover:rotate-12" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase leading-none">
            IITGEE<span className="text-indigo-500">PREP</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase text-[8px] tracking-[0.6em]">Academic Intelligence Node v5.0</p>
        </div>

        {/* Auth Glass Card */}
        <div className="bg-white/[0.03] backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] space-y-6 relative overflow-hidden">
          
          {/* Mode Switcher */}
          <div className="flex bg-black/40 p-1 rounded-2xl border border-white/5">
            <button 
              onClick={() => { setIsAuthMode('login'); setAuthError(null); }} 
              className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all ${isAuthMode === 'login' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => { setIsAuthMode('register'); setAuthError(null); }} 
              className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all ${isAuthMode === 'register' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Join
            </button>
          </div>

          {authError && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400 text-[10px] font-bold animate-in slide-in-from-top-2">
               <AlertCircle className="w-4 h-4 shrink-0" /> {authError}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            {isAuthMode === 'register' && (
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase text-slate-500 tracking-[0.15em] ml-2">Full Name</label>
                <div className="relative group">
                  <UserCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                  <input 
                    type="text" required 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-black/20 border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-white text-sm font-medium focus:ring-2 focus:ring-indigo-500/40 focus:bg-black/30 outline-none transition-all placeholder:text-slate-700" 
                    placeholder="Enter full name..." 
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-slate-500 tracking-[0.15em] ml-2">Digital Node ID (Email)</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                <input 
                  type="email" required 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-black/20 border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-white text-sm font-medium focus:ring-2 focus:ring-indigo-500/40 focus:bg-black/30 outline-none transition-all placeholder:text-slate-700" 
                  placeholder="name@institute.com" 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-slate-500 tracking-[0.15em] ml-2">Access Cipher</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                <input 
                  type="password" required 
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-black/20 border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-white text-sm font-medium focus:ring-2 focus:ring-indigo-500/40 focus:bg-black/30 outline-none transition-all placeholder:text-slate-700" 
                  placeholder="••••••••" 
                />
              </div>
            </div>

            {isAuthMode === 'register' && (
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase text-slate-500 tracking-[0.15em] ml-2">Recovery Keyphrase</label>
                <div className="relative group">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-emerald-400 transition-colors" />
                  <input 
                    type="text" required 
                    value={formData.recoveryPhrase}
                    onChange={e => setFormData({...formData, recoveryPhrase: e.target.value})}
                    className="w-full bg-black/20 border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-white text-sm font-medium focus:ring-2 focus:ring-emerald-500/40 focus:bg-black/30 outline-none transition-all placeholder:text-slate-700" 
                    placeholder="Memorable security word..." 
                  />
                </div>
              </div>
            )}
            
            {/* Role Selection Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setRole(UserRole.STUDENT)} 
                  className={`py-3 rounded-xl flex items-center justify-center gap-2 border-2 transition-all ${
                    role === UserRole.STUDENT ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400' : 'border-white/5 text-slate-500 hover:border-white/10'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Student</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => setRole(UserRole.PARENT)} 
                  className={`py-3 rounded-xl flex items-center justify-center gap-2 border-2 transition-all ${
                    role === UserRole.PARENT ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400' : 'border-white/5 text-slate-500 hover:border-white/10'
                  }`}
                >
                  <HeartHandshake className="w-4 h-4" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Parent</span>
                </button>
            </div>

            <button 
              type="submit" disabled={isProcessing}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] shadow-[0_10px_30px_-5px_rgba(79,70,229,0.5)] transition-all flex items-center justify-center gap-3 hover:scale-[1.01] active:scale-95 disabled:opacity-50 mt-4"
            >
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  {isAuthMode === 'login' ? 'Establish Session' : 'Create Identity'}
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Sandbox Tray */}
          {showDemoLogins && (
            <div className="pt-6 mt-4 border-t border-white/5">
              <div className="text-center mb-4">
                <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.3em]">Developer Sandbox Access</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => handleDemoLogin(UserRole.STUDENT, 'ishu@gmail.com')} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-indigo-500/10 hover:border-indigo-500/20 transition-all group">
                  <Zap className="w-3.5 h-3.5 text-indigo-500" />
                  <span className="text-[7px] font-black text-slate-500 uppercase tracking-tighter">Student</span>
                </button>
                <button onClick={() => handleDemoLogin(UserRole.PARENT, 'parent@family.com')} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all group">
                  <HeartHandshake className="w-3.5 h-3.5 text-rose-500" />
                  <span className="text-[7px] font-black text-slate-500 uppercase tracking-tighter">Parent</span>
                </button>
                <button onClick={() => handleDemoLogin(UserRole.ADMIN, 'admin@jeepro.in')} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/20 transition-all group">
                  <Shield className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-[7px] font-black text-slate-500 uppercase tracking-tighter">Admin</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Global Navigation Links */}
        <div className="mt-8 text-center space-y-6">
           <div className="flex justify-center gap-8">
              {footerLinks.map(link => (
                <button 
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className="flex items-center gap-2 text-[9px] font-black uppercase text-slate-500 hover:text-indigo-400 transition-colors tracking-widest"
                >
                  <link.icon className="w-3 h-3" />
                  {link.label}
                </button>
              ))}
           </div>
           
           <button 
              onClick={onCancel}
              className="group flex items-center justify-center gap-2 mx-auto text-slate-600 hover:text-slate-300 transition-colors font-black text-[9px] uppercase tracking-[0.4em]"
            >
              <Home className="w-3 h-3 transition-transform group-hover:-translate-y-0.5" /> 
              Return to Terminal
            </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModule;
