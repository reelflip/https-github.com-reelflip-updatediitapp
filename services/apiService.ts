import { StudentData, UserRole, UserAccount, Chapter, TestResult, BacklogItem, Question, MockTest, RoutineConfig } from '../types';
import { INITIAL_STUDENT_DATA } from '../mockData';

const API_CONFIG = {
  BASE_URL: './api/', 
  MODE_KEY: 'jeepro_datasource_mode'
};

const DEMO_IDS = ['163110', 'P-4402', 'ADMIN-001'];

const getBlankStudentData = (id: string, name: string): StudentData => ({
  ...INITIAL_STUDENT_DATA,
  id,
  name,
  chapters: INITIAL_STUDENT_DATA.chapters.map(c => ({
    ...c,
    progress: 0,
    accuracy: 0,
    timeSpent: 0,
    timeSpentNotes: 0,
    timeSpentVideos: 0,
    timeSpentPractice: 0,
    timeSpentTests: 0,
    status: 'NOT_STARTED'
  })),
  backlogs: [],
  testHistory: [],
  psychometricHistory: [{ stress: 5, focus: 5, motivation: 5, examFear: 5, timestamp: new Date().toISOString().split('T')[0] }],
  timeSummary: { notes: 0, videos: 0, practice: 0, tests: 0 }
});

const safeJson = async (response: Response) => {
  if (response.status === 404) {
    throw new Error("Endpoint Not Found (404). Ensure /api/ folder and .htaccess are uploaded.");
  }
  
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    if (text.includes('<?php') || text.includes('Fatal error') || text.includes('PDOException')) {
        throw new Error("Database Logic Error: " + text.substring(0, 150));
    }
    throw new Error("Invalid Server Response.");
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
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}auth/login`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      const result = await safeJson(res);
      if (result.success) {
        localStorage.setItem(API_CONFIG.MODE_KEY, 'LIVE');
      }
      return result;
    } catch(e: any) { 
      return { success: false, error: "Uplink Failed: " + (e.message || "Database unreachable.") }; 
    }
  },

  async register(data: any) {
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
      return { success: false, error: "Registration Failed: " + (e.message || "Server error.") }; 
    }
  },

  async updateUserProfile(studentId: string, profileData: any) {
    if (this.getMode() === 'LIVE') {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}auth/update_profile`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: studentId, ...profileData })
        });
        return await safeJson(res);
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }
    return { success: true };
  },

  async getStudentData(studentId: string): Promise<StudentData> {
    const isDemo = DEMO_IDS.includes(studentId);
    
    if (this.getMode() === 'LIVE' || !isDemo) {
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
        if (!syllabus || !syllabus.chapters) {
          return getBlankStudentData(studentId, 'Verified Student');
        }

        const backlogs = await safeJson(bRes);
        const wellness = await safeJson(wRes);
        const results = await safeJson(rRes);
        const questions = await safeJson(qRes);
        const tests = await safeJson(tRes);
        const routine = await safeJson(rtRes);
        
        return {
          ...getBlankStudentData(studentId, syllabus.name || 'User'),
          chapters: Array.isArray(syllabus.chapters) ? syllabus.chapters : [],
          backlogs: Array.isArray(backlogs) ? backlogs : [],
          testHistory: Array.isArray(results) ? results : [],
          questions: Array.isArray(questions) ? questions : INITIAL_STUDENT_DATA.questions,
          mockTests: Array.isArray(tests) ? tests : INITIAL_STUDENT_DATA.mockTests,
          psychometricHistory: wellness?.length ? wellness : [],
          routine: routine || undefined
        };
      } catch(e) { 
          return getBlankStudentData(studentId, 'Recovery User'); 
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