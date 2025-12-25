
import { StudentData, UserRole, UserAccount, Chapter, TestResult, BacklogItem, Question, MockTest } from '../types';
import { INITIAL_STUDENT_DATA } from '../mockData';

const API_CONFIG = {
  BASE_URL: './api/', 
  MODE_KEY: 'jeepro_datasource_mode'
};

const safeJson = async (response: Response) => {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    if (text.includes('<?php') || text.includes('Fatal error')) {
        throw new Error("Backend Logic Fault. Use Admin > System > Build Hub to re-generate.");
    }
    throw new Error("Network Response Invalid");
  }
};

export const api = {
  getMode: (): 'MOCK' | 'LIVE' => (localStorage.getItem(API_CONFIG.MODE_KEY) as 'MOCK' | 'LIVE') || 'MOCK',
  setMode: (mode: 'MOCK' | 'LIVE') => { localStorage.setItem(API_CONFIG.MODE_KEY, mode); window.location.reload(); },
  
  isDemoDisabled: (): boolean => (window as any).DISABLE_DEMO_LOGINS === true,

  async checkBackendStatus() {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}check.php`);
      const text = await res.text();
      return { success: res.ok, html: text, status: res.status };
    } catch (e) {
      return { success: false, html: `<p style="color:red">Node Offline.</p>`, status: 0 };
    }
  },

  async login(credentials: { email: string; role: UserRole }) {
    // Check global kill-switch
    if (!this.isDemoDisabled()) {
      if (credentials.email === 'ishu@gmail.com') return { success: true, user: { id: '163110', name: 'Aryan Sharma', email: 'ishu@gmail.com', role: UserRole.STUDENT, createdAt: '2024-01-01' } };
      if (credentials.email === 'admin@jeepro.in') return { success: true, user: { id: 'ADMIN-001', name: 'System Admin', email: 'admin@jeepro.in', role: UserRole.ADMIN, createdAt: '2024-01-01' } };
    }

    if (this.getMode() === 'LIVE') {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}auth/login`, {
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials)
        });
        return await safeJson(res);
      } catch(e) { return { success: false, error: 'Database Unreachable' }; }
    }
    return { success: false, error: 'User not found in Sandbox' };
  },

  async register(data: { name: string; email: string; role: UserRole; password?: string }) {
    if (this.getMode() === 'LIVE') {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        return await safeJson(res);
      } catch (e) { return { success: false, error: 'Database Node Unreachable' }; }
    }
    return { success: true, user: { id: `REG-${Date.now()}`, name: data.name, email: data.email, role: data.role, createdAt: new Date().toISOString() } };
  },

  async getStudentData(studentId: string): Promise<StudentData> {
    if (this.getMode() === 'LIVE') {
      try {
        const [sRes, bRes, wRes, rRes, qRes, tRes] = await Promise.all([
          fetch(`${API_CONFIG.BASE_URL}syllabus/get?id=${studentId}`),
          fetch(`${API_CONFIG.BASE_URL}backlogs/get?id=${studentId}`),
          fetch(`${API_CONFIG.BASE_URL}wellness/get?id=${studentId}`),
          fetch(`${API_CONFIG.BASE_URL}results/get?id=${studentId}`),
          fetch(`${API_CONFIG.BASE_URL}questions/index`),
          fetch(`${API_CONFIG.BASE_URL}mocktests/index`)
        ]);

        const syllabus = await safeJson(sRes);
        const backlogs = await safeJson(bRes);
        const wellness = await safeJson(wRes);
        const results = await safeJson(rRes);
        const questions = await safeJson(qRes);
        const tests = await safeJson(tRes);
        
        return {
          ...INITIAL_STUDENT_DATA,
          id: studentId,
          name: syllabus?.name || 'User',
          chapters: Array.isArray(syllabus?.chapters) ? syllabus.chapters : INITIAL_STUDENT_DATA.chapters,
          backlogs: Array.isArray(backlogs) ? backlogs : [],
          testHistory: Array.isArray(results) ? results : [],
          questions: Array.isArray(questions) ? questions : INITIAL_STUDENT_DATA.questions,
          mockTests: Array.isArray(tests) ? tests : INITIAL_STUDENT_DATA.mockTests,
          psychometricHistory: wellness?.length ? wellness : INITIAL_STUDENT_DATA.psychometricHistory
        };
      } catch(e) { return { ...INITIAL_STUDENT_DATA, id: studentId }; }
    }
    return INITIAL_STUDENT_DATA;
  },

  // NEW CRUD METHODS FOR LIVE MODE
  async saveEntity(module: string, data: any) {
    if (this.getMode() === 'LIVE') {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}${module.toLowerCase()}/save`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        return await safeJson(res);
      } catch(e) { return { success: false }; }
    }
    return { success: true };
  },

  async updateStudentData(studentId: string, updatedData: StudentData) {
    return this.saveEntity('Syllabus', { student_id: studentId, chapters: updatedData.chapters });
  },

  async getAccounts(): Promise<UserAccount[]> {
     if (this.getMode() === 'LIVE') {
       try {
         const res = await fetch(`${API_CONFIG.BASE_URL}auth/index`);
         const data = await safeJson(res);
         return Array.isArray(data) ? data : [];
       } catch(e) { return []; }
     }
     return [{ id: '163110', name: 'Aryan Sharma', email: 'ishu@gmail.com', role: UserRole.STUDENT, createdAt: '2024-01-01' }];
  }
};
