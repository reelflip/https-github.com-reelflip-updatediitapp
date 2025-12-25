
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
    <div className="bg-slate-50 text-slate-900 min-h-screen font-sans selection:bg-blue-600/10">
      {/* 
          Dedicated About/Marketing Content 
          Note: Contact section has been moved to its own module to prevent duplication 
          and improve core page performance.
      */}
      <AboutModule />
    </div>
  );
};

export default LandingPage;
