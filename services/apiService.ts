import { StudentData, UserRole, UserAccount, Chapter, TestResult, BacklogItem, Question, MockTest, RoutineConfig } from '../types';
import { INITIAL_STUDENT_DATA } from '../mockData';

const API_CONFIG = {
  BASE_URL: './api/', 
  MODE_KEY: 'jeepro_datasource_mode'
};

const safeJson = async (response: Response) => {
  if (response.status === 404) {
    throw new Error("Endpoint Not Found (404). Ensure your /api/ folder and .htaccess are correctly uploaded.");
  }
  
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    if (text.includes('<?php') || text.includes('Fatal error') || text.includes('PDOException')) {
        throw new Error("Database Server Error: Check your PHP config/database.php file.");
    }
    throw new Error("Invalid Server Response: The backend did not return valid JSON.");
  }
};

export const api = {
  getMode: (): 'MOCK' | 'LIVE' => (localStorage.getItem(API_CONFIG.MODE_KEY) as 'MOCK' | 'LIVE') || 'MOCK',
  
  setMode: (mode: 'MOCK' | 'LIVE') => { 
    localStorage.setItem(API_CONFIG.MODE_KEY, mode); 
    localStorage.removeItem('jeepro_user');
    localStorage.removeItem('jeepro_student_data');
    window.location.reload(); 
  },

  async login(credentials: { email: string; role: UserRole; password?: string }) {
    // STRICT PRODUCTION ONLY: No demo checks here.
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}auth/login`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      return await safeJson(res);
    } catch(e: any) { 
      return { 
        success: false, 
        error: "Production Node Unreachable: " + (e.message || "Please check your internet or server status.") 
      }; 
    }
  },

  async register(data: any) {
    // STRICT PRODUCTION ONLY: Must hit the real database.
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await safeJson(res);
      
      if (result.success) {
        localStorage.setItem(API_CONFIG.MODE_KEY, 'LIVE');
      }
      return result;
    } catch(e: any) { 
      return { 
        success: false, 
        error: "Sync Failed: " + (e.message || "Database node unreachable.") 
      }; 
    }
  },

  async getStudentData(studentId: string): Promise<StudentData> {
    // If we are in LIVE mode, we fetch from DB. If in MOCK (Demo), we use INITIAL_STUDENT_DATA.
    if (this.getMode() === 'LIVE') {
      try {
        const [sRes, bRes, wRes, rRes, qRes, tRes, rtRes] = await Promise.all([
          fetch(`${API_CONFIG.BASE_URL}syllabus/get?id=${studentId}`),
          fetch(`${API_CONFIG.BASE_URL}backlogs/get?id=${studentId}`),
          fetch(`${API_CONFIG.BASE_URL}wellness/get?id=${studentId}`),
          fetch(`${API_CONFIG.BASE_URL}results/get?id=${studentId}`),
          fetch(`${API_CONFIG.BASE_URL}questions/index`),
          fetch(`${API_CONFIG.BASE_URL}mocktests/index`),
          fetch(`${API_CONFIG.BASE_URL}timetable/get?id=${studentId}`)
        ]);

        const syllabus = await safeJson(sRes);
        const backlogs = await safeJson(bRes);
        const wellness = await safeJson(wRes);
        const results = await safeJson(rRes);
        const questions = await safeJson(qRes);
        const tests = await safeJson(tRes);
        const routine = await safeJson(rtRes);
        
        return {
          ...INITIAL_STUDENT_DATA,
          id: studentId,
          name: syllabus?.name || 'Verified User',
          chapters: Array.isArray(syllabus?.chapters) ? syllabus.chapters : INITIAL_STUDENT_DATA.chapters,
          backlogs: Array.isArray(backlogs) ? backlogs : [],
          testHistory: Array.isArray(results) ? results : [],
          questions: Array.isArray(questions) ? questions : INITIAL_STUDENT_DATA.questions,
          mockTests: Array.isArray(tests) ? tests : INITIAL_STUDENT_DATA.mockTests,
          psychometricHistory: wellness?.length ? wellness : INITIAL_STUDENT_DATA.psychometricHistory,
          routine: routine || INITIAL_STUDENT_DATA.routine
        };
      } catch(e) { 
          // If live fetch fails, we return a blank state for that user ID, NOT the demo student.
          return { ...INITIAL_STUDENT_DATA, id: studentId, name: 'User ' + studentId, chapters: INITIAL_STUDENT_DATA.chapters.map(c => ({...c, progress: 0, accuracy: 0})) }; 
      }
    }
    return INITIAL_STUDENT_DATA;
  },

  async saveRoutine(studentId: string, routine: RoutineConfig) {
    if (this.getMode() === 'LIVE') {
      await fetch(`${API_CONFIG.BASE_URL}timetable/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId, ...routine })
      });
    }
  },

  async saveEntity(module: string, data: any) {
    if (this.getMode() === 'LIVE') {
      const res = await fetch(`${API_CONFIG.BASE_URL}${module.toLowerCase()}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await safeJson(res);
    }
    return { success: true };
  },

  async updateStudentData(studentId: string, updatedData: StudentData) {
    if (this.getMode() === 'LIVE') {
        if (updatedData.routine) {
            await this.saveRoutine(studentId, updatedData.routine);
        }
        return this.saveEntity('Syllabus', { student_id: studentId, chapters: updatedData.chapters });
    }
    return { success: true };
  },

  async getAccounts(): Promise<UserAccount[]> {
     if (this.getMode() === 'LIVE') {
       try {
         const res = await fetch(`${API_CONFIG.BASE_URL}auth/index`);
         const data = await safeJson(res);
         return Array.isArray(data) ? data : [];
       } catch(e) { return []; }
     }
     return [];
  }
};