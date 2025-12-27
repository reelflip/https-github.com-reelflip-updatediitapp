
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const menuItems = [
    { id: 'about', label: 'Home' },
    { id: 'features', label: 'Features' },
    { id: 'examguide', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNav = (id: string) => {
    setActiveTab(id);
    setIsOpen(false);
  };

  return (
    <nav className="w-full bg-white border-b border-slate-100 py-4 px-6 md:px-12 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo Branding */}
        <div className="flex items-center gap-1 cursor-pointer group shrink-0" onClick={() => handleNav('about')}>
           <span className="text-2xl font-black tracking-tight text-[#2b4c8c] uppercase">IITGRRPREP</span>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex justify-end items-center gap-8 flex-1 mr-8">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`text-sm font-medium transition-all hover:text-blue-600 ${
                activeTab === item.id ? 'text-blue-600' : 'text-slate-600'
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
            className="hidden sm:block text-sm font-semibold px-6 py-2.5 bg-[#82c341] text-white rounded-lg hover:bg-[#74af3a] transition-all shadow-sm"
           >
            Get Started
           </button>
           
           <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-slate-600 p-2">
             {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
           </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 p-6 flex flex-col gap-4 animate-in slide-in-from-top duration-300 shadow-xl">
           {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`text-base font-semibold text-left py-2 ${
                activeTab === item.id ? 'text-blue-600' : 'text-slate-600'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button 
            onClick={() => handleNav('login')}
            className="w-full py-3 bg-[#82c341] text-white rounded-lg font-bold text-base mt-2"
          >
            Get Started
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;