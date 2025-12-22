
import React from 'react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'about', label: 'ABOUT' },
    { id: 'features', label: 'FEATURES' },
    { id: 'examguide', label: 'EXAM GUIDE' },
    { id: 'blog', label: 'BLOG' },
    { id: 'contact', label: 'CONTACT' },
  ];

  return (
    <nav className="w-full bg-white border-b border-slate-100 py-6 px-10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Spacer to keep center items centered */}
        <div className="w-24 hidden lg:block"></div>
        
        <div className="flex justify-center items-center gap-12 flex-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`text-[13px] font-black tracking-[0.1em] transition-all hover:text-blue-600 ${
                activeTab === item.id ? 'text-blue-600' : 'text-slate-500'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="w-24 flex justify-end">
           <button 
            onClick={() => setActiveTab('login')}
            className={`text-[13px] font-black tracking-[0.1em] px-6 py-2 rounded-full transition-all border-2 ${
              activeTab === 'login' 
              ? 'bg-blue-600 border-blue-600 text-white shadow-lg' 
              : 'border-slate-200 text-slate-500 hover:border-blue-600 hover:text-blue-600'
            }`}
           >
            LOGIN
           </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
