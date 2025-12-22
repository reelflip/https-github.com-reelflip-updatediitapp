
import React from 'react';
import { UserRole } from '../types';
import { Bell, Search, UserCircle } from 'lucide-react';

interface HeaderProps {
  role: UserRole;
  studentName: string;
}

const Header: React.FC<HeaderProps> = ({ role, studentName }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search syllabus, flashcards, hacks..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-slate-400 hover:text-slate-600">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
          <div className="text-right">
            <div className="text-sm font-semibold">{studentName}</div>
            <div className="text-xs text-slate-500 capitalize">{role.toLowerCase()}</div>
          </div>
          <UserCircle className="w-8 h-8 text-slate-400" />
        </div>
      </div>
    </header>
  );
};

export default Header;
