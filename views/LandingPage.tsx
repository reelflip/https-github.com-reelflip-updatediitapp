
import React from 'react';
import { StudentData } from '../types';
import AboutModule from './AboutModule';

interface LandingPageProps {
  onLogin: () => void;
  studentData: StudentData;
  setStudentData: (data: StudentData) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, studentData, setStudentData }) => {
  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen font-sans selection:bg-indigo-100">
      {/* 
          Public Marketing Layer
          Focused on providing factual information about the platform's 
          data-driven approach to JEE preparation.
      */}
      <AboutModule />
    </div>
  );
};

export default LandingPage;
