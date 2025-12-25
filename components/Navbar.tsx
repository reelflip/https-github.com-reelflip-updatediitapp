
import React from 'react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'about', label: 'ABOUT US' },
    { id: 'features', label: 'FEATURES' },
    { id: 'examguide', label: 'EXAM GUIDE' },
    { id: 'blog', label: 'RESOURCES' },
    { id: 'contact', label: 'CONTACT US' },
  ];

  return (
    <nav className="w-full bg-white/80 border-b border-slate-200 py-6 px-10 sticky top-0 z-50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo/Branding Left */}
        <div className="flex items-center gap-2 lg:w-48 cursor-pointer" onClick={() => setActiveTab('about')}>
           <div className="w-2.5 h-6 bg-blue-600 rounded-full animate-pulse"></div>
           <span className="text-xl font-black tracking-tighter text-slate-900 uppercase italic">IITGEE<span className="text-blue-600">PREP</span></span>
        </div>
        
        <div className="flex justify-center items-center gap-10 flex-1 hidden lg:flex">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`text-[10px] font-black tracking-[0.25em] transition-all hover:text-blue-600 ${
                activeTab === item.id ? 'text-blue-600' : 'text-slate-400'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="lg:w-48 flex justify-end">
           <button 
            onClick={() => setActiveTab('login')}
            className={`text-[10px] font-black tracking-[0.2em] px-8 py-3 rounded-xl transition-all border-2 ${
              activeTab === 'login' 
              ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-100' 
              : 'border-slate-100 text-slate-500 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50/50'
            }`}
           >
            LOGIN / JOIN
           </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
