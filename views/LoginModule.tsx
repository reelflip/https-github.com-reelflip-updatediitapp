import React, { useState } from 'react';
import { UserRole, UserAccount } from '../types';
import { api } from '../services/apiService';
import { Mail, Lock, Brain, ShieldCheck, Loader2, TrendingUp, AlertCircle, Zap, Shield, Users, ArrowLeft } from 'lucide-react';

interface LoginModuleProps {
  onLoginSuccess: (user: UserAccount) => void;
  onCancel: () => void;
}

const LoginModule: React.FC<LoginModuleProps> = ({ onLoginSuccess, onCancel }) => {
  const [isAuthMode, setIsAuthMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [isProcessing, setIsProcessing] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  // Hide demo logins if manually disabled or if the global flag is false
  const showDemoLogins = (window as any).SHOW_DEMO_LOGINS && !api.isDemoDisabled();

  const executeAuth = async (email: string, targetRole: UserRole) => {
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

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex items-center justify-center p-6 font-sans overflow-y-auto">
      <div className="max-w-md w-full space-y-8 animate-in fade-in zoom-in-95 duration-500 py-12">
        <div className="text-center">
          <button onClick={onCancel} className="w-20 h-20 bg-blue-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-2xl group transition-all hover:scale-105">
            <TrendingUp className="text-white w-10 h-10 stroke-[3]" />
          </button>
          <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase">IITGEEPREP</h1>
          <p className="text-slate-400 mt-2 font-medium uppercase text-[10px] tracking-[0.4em]">Database Verification Protocol</p>
        </div>

        <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="flex bg-slate-800 p-1 rounded-2xl relative z-10">
            <button onClick={() => { setIsAuthMode('login'); setAuthError(null); }} className={`flex-1 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${isAuthMode === 'login' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500'}`}>Login</button>
            <button onClick={() => { setIsAuthMode('register'); setAuthError(null); }} className={`flex-1 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${isAuthMode === 'register' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500'}`}>Join</button>
          </div>

          {authError && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-400 text-xs font-bold animate-pulse relative z-10">
               <AlertCircle className="w-4 h-4 shrink-0" /> {authError}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-6 relative z-10">
            {isAuthMode === 'register' && (
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em] ml-2">Full Identity Name</label>
                <input 
                  type="text" required 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-800 border-none rounded-2xl py-4 px-6 text-white text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600" placeholder="e.g. Aryan Sharma" 
                />
              </div>
            )}
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em] ml-2">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="email" required 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-slate-800 border-none rounded-2xl py-4 pl-14 pr-6 text-white text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600" placeholder="aryan@iit.ac.in" 
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em] ml-2">Target Interface</label>
              <div className="grid grid-cols-2 gap-3">
                  {Object.values(UserRole).filter(r => r !== UserRole.ADMIN).map(r => (
                    <button 
                      key={r} type="button" onClick={() => setRole(r)} 
                      className={`py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                        role === r ? 'border-blue-600 bg-blue-600/10 text-blue-400' : 'border-slate-800 text-slate-500 hover:border-slate-700'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
              </div>
            </div>

            <button 
              type="submit" disabled={isProcessing}
              className="w-full bg-blue-600 text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] shadow-2xl shadow-blue-900/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : (isAuthMode === 'login' ? 'Establish Sync' : 'Create Profile')}
            </button>
          </form>

          {showDemoLogins && (
            <div className="pt-6 border-t border-slate-800 relative z-10">
              <div className="text-center mb-6">
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">Sandbox Quick Access</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <button 
                  onClick={() => handleDemoLogin(UserRole.STUDENT, 'ishu@gmail.com')}
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-blue-600/10 border border-blue-600/20 hover:bg-blue-600/20 transition-all group"
                >
                  <Zap className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[8px] font-black text-blue-300 uppercase tracking-tighter">Student</span>
                </button>
                <button 
                  onClick={() => handleDemoLogin(UserRole.PARENT, 'parent@family.com')}
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-rose-600/10 border border-rose-600/20 hover:bg-rose-600/20 transition-all group"
                >
                  <Users className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[8px] font-black text-rose-300 uppercase tracking-tighter">Parent</span>
                </button>
                <button 
                  onClick={() => handleDemoLogin(UserRole.ADMIN, 'admin@jeepro.in')}
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-emerald-600/10 border border-emerald-600/20 hover:bg-emerald-600/20 transition-all group"
                >
                  <Shield className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[8px] font-black text-emerald-300 uppercase tracking-tighter">Admin</span>
                </button>
              </div>
              <p className="text-[8px] text-center text-slate-700 font-bold uppercase mt-4 tracking-widest italic">Demo identities are pre-configured for sandbox review.</p>
            </div>
          )}
        </div>

        <button 
          onClick={onCancel}
          className="w-full flex items-center justify-center gap-2 text-slate-500 hover:text-white transition-colors font-black text-[10px] uppercase tracking-widest"
        >
          <ArrowLeft className="w-3 h-3" /> Back to Intelligence Hub
        </button>
      </div>
    </div>
  );
};

export default LoginModule;