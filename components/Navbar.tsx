import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const menuItems = [
    { id: 'about', label: 'ABOUT' },
    { id: 'features', label: 'FEATURES' },
    { id: 'examguide', label: 'GUIDE' },
    { id: 'contact', label: 'SUPPORT' },
  ];

  const handleNav = (id: string) => {
    setActiveTab(id);
    setIsOpen(false);
  };

  return (
    <nav className="w-full bg-[#0a0c1a]/90 border-b border-[#1e2440] py-4 md:py-6 px-6 md:px-12 sticky top-0 z-50 backdrop-blur-2xl">
      <div className="max-w-[1600px] mx-auto flex justify-between items-center">
        {/* Logo/Branding Left */}
        <div className="flex items-center gap-3 cursor-pointer group shrink-0" onClick={() => handleNav('about')}>
           <div className="w-2 h-6 md:w-2.5 md:h-7 bg-[#5d5fef] rounded-full animate-pulse shadow-[0_0_20px_#5d5fef] group-hover:scale-110 transition-transform"></div>
           <span className="text-xl md:text-2xl font-black tracking-tighter text-white uppercase italic">IITGEE<span className="text-[#5d5fef]">PREP</span></span>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex justify-center items-center gap-12 flex-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`text-[10px] font-black tracking-[0.3em] transition-all hover:text-white relative pb-1 ${
                activeTab === item.id ? 'text-white' : 'text-[#4a5578]'
              }`}
            >
              {item.label}
              {activeTab === item.id && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#5d5fef] rounded-full"></span>
              )}
            </button>
          ))}
        </div>

        {/* Mobile Toggle & Desktop CTA */}
        <div className="flex items-center gap-6">
           <button 
            onClick={() => handleNav('login')}
            className={`hidden sm:block text-[10px] font-black tracking-[0.25em] px-8 md:px-10 py-3 md:py-3.5 rounded-2xl transition-all border border-[#2d3656] ${
              activeTab === 'login' 
              ? 'bg-[#5d5fef] border-[#5d5fef] text-white shadow-2xl shadow-indigo-500/30' 
              : 'text-[#4a5578] hover:border-[#5d5fef] hover:text-white hover:bg-[#5d5fef]/10'
            }`}
           >
            ACCESS GATEWAY
           </button>
           
           <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white p-2">
             {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
           </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#0a0c1a] border-b border-[#1e2440] p-8 flex flex-col gap-6 animate-in slide-in-from-top duration-300">
           {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`text-xs font-black tracking-[0.3em] text-left transition-all ${
                activeTab === item.id ? 'text-[#5d5fef]' : 'text-[#4a5578]'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button 
            onClick={() => handleNav('login')}
            className="w-full py-4 bg-[#5d5fef] text-white rounded-xl text-[10px] font-black tracking-[0.3em]"
          >
            LOGIN / JOIN NOW
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;