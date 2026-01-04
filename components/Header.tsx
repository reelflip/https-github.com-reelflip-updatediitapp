
import React from 'react';
import { UserRole } from '../types';
import { Bell, Search, UserCircle } from 'lucide-react';

interface HeaderProps {
  role: UserRole;
  studentName: string;
}

const Header: React.FC<HeaderProps> = ({ role, studentName }) => {
  return (
    <header className="h-14 md:h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md hidden sm:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search syllabus, flashcards, hacks..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="sm:hidden font-black text-xs uppercase tracking-widest text-indigo-600">
          Solaris Core
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <button className="relative text-slate-400 hover:text-slate-600 p-2">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="flex items-center gap-2 md:gap-3 pl-2 md:pl-6 border-l border-slate-200">
          <div className="text-right hidden xs:block">
            <div className="text-[10px] md:text-sm font-black text-slate-800 line-clamp-1">{studentName}</div>
            <div className="text-[8px] md:text-xs text-slate-500 uppercase tracking-widest">{role.toLowerCase()}</div>
          </div>
          <UserCircle className="w-7 h-7 md:w-8 md:h-8 text-slate-300" />
        </div>
      </div>
    </header>
  );
};

export default Header;
