
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const menuItems = [
    { id: 'about', label: 'Methodology' },
    { id: 'features', label: 'Functionality' },
    { id: 'examguide', label: 'Exam Matrix' },
    { id: 'blog', label: 'Strategy Reports' },
    { id: 'contact', label: 'Technical Support' },
  ];

  const handleNav = (id: string) => {
    setActiveTab(id);
    setIsOpen(false);
  };

  return (
    <nav className="w-full bg-white border-b border-slate-100 py-5 px-6 md:px-12 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo Branding */}
        <div className="flex items-center gap-1 cursor-pointer group shrink-0" onClick={() => handleNav('about')}>
           <span className="text-2xl font-black tracking-tighter text-[#2b4c8c] uppercase italic font-space">IITJEEPRO</span>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex justify-end items-center gap-8 flex-1 mr-10">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`text-[10px] font-black uppercase tracking-widest transition-all hover:text-indigo-600 ${
                activeTab === item.id ? 'text-indigo-600' : 'text-slate-400'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Action Button */}
        <div className="flex items-center">
           <button 
            onClick={() => handleNav('login')}
            className="hidden sm:block text-[10px] font-black uppercase tracking-widest px-8 py-3 bg-slate-900 text-white rounded-xl hover:bg-indigo-600 transition-all shadow-lg"
           >
            Access Portal
           </button>
           
           <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-slate-600 p-2 ml-4">
             {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
           </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 p-8 flex flex-col gap-6 animate-in slide-in-from-top duration-300 shadow-2xl">
           {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`text-lg font-black italic tracking-tight text-left py-1 uppercase ${
                activeTab === item.id ? 'text-indigo-600' : 'text-slate-400'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button 
            onClick={() => handleNav('login')}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest mt-2 shadow-xl"
          >
            Access Portal
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
