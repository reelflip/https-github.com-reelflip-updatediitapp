import { StudentData, UserRole, UserAccount, Chapter } from '../types';
import { INITIAL_STUDENT_DATA } from '../mockData';

const API_CONFIG = {
  BASE_URL: '/api/router.php', // Main gateway
  MODE_KEY: 'jeepro_datasource_mode'
};

export const api = {
  getMode: (): 'MOCK' | 'LIVE' => (localStorage.getItem(API_CONFIG.MODE_KEY) as 'MOCK' | 'LIVE') || 'MOCK',
  setMode: (mode: 'MOCK' | 'LIVE') => { localStorage.setItem(API_CONFIG.MODE_KEY, mode); window.location.reload(); },
  isDemoDisabled: (): boolean => false,

  // Fix: Added register method to resolve Error in file views/LoginModule.tsx on line 29
  async register(data: { name: string; email: string; role: UserRole; password?: string }) {
    if (this.getMode() === 'LIVE') {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}?module=auth&action=register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        return await res.json();
      } catch (e) {
        return { success: false, error: 'Production Backend Offline' };
      }
    }
    // Return a mock user for the sandbox environment
    return { 
      success: true, 
      user: { 
        id: Math.floor(Math.random() * 1000000).toString(), 
        name: data.name, 
        email: data.email, 
        role: data.role, 
        createdAt: new Date().toISOString() 
      } as UserAccount
    };
  },

  async login(credentials: { email: string; role: UserRole }) {
    if (this.getMode() === 'LIVE') {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}?module=auth&action=login`, {
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials)
        });
        return await res.json();
      } catch(e) { return { success: false, error: 'Production Backend Offline' }; }
    }
    return { success: true, user: { id: '163110', name: 'Aryan Sharma', email: 'ishu@gmail.com', role: UserRole.STUDENT, createdAt: '' } };
  },

  // Fix: Added getAccounts method to resolve Error in file views/AdminCMS.tsx on line 109 and 158
  async getAccounts(): Promise<UserAccount[]> {
    if (this.getMode() === 'LIVE') {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}?module=admin&action=get_users`);
        return await res.json();
      } catch (e) {
        return [];
      }
    }
    // Mock accounts for development/sandbox mode
    return [
      { id: '163110', name: 'Aryan Sharma', email: 'ishu@gmail.com', role: UserRole.STUDENT, createdAt: '2025-01-01' },
      { id: 'P-4402', name: 'Ramesh Sharma', email: 'parent@family.com', role: UserRole.PARENT, createdAt: '2025-01-01' },
      { id: 'ADM-001', name: 'Super Admin', email: 'admin@jeepro.in', role: UserRole.ADMIN, createdAt: '2025-01-01' }
    ];
  },

  async getStudentData(studentId: string): Promise<StudentData> {
    if (this.getMode() === 'LIVE') {
      try {
        const [syllabusRes, backlogsRes, wellnessRes, resultsRes] = await Promise.all([
          fetch(`${API_CONFIG.BASE_URL}?module=syllabus&action=get&student_id=${studentId}`),
          fetch(`${API_CONFIG.BASE_URL}?module=academic&type=backlogs&action=get&student_id=${studentId}`),
          fetch(`${API_CONFIG.BASE_URL}?module=wellness&student_id=${studentId}`),
          fetch(`${API_CONFIG.BASE_URL}?module=results&student_id=${studentId}`)
        ]);

        const syllabus = await syllabusRes.json();
        const backlogs = await backlogsRes.json();
        const wellness = await wellnessRes.json();
        const results = await resultsRes.json();
        
        return {
          ...INITIAL_STUDENT_DATA,
          id: studentId,
          chapters: (syllabus.chapters && syllabus.chapters.length) ? syllabus.chapters.map((c: any) => ({
            ...c,
            progress: Number(c.progress),
            accuracy: Number(c.accuracy),
            timeSpent: Number(c.time_spent)
          })) : INITIAL_STUDENT_DATA.chapters,
          backlogs: Array.isArray(backlogs) ? backlogs : INITIAL_STUDENT_DATA.backlogs,
          psychometricHistory: Array.isArray(wellness) ? wellness : INITIAL_STUDENT_DATA.psychometricHistory,
          testHistory: Array.isArray(results) ? results : INITIAL_STUDENT_DATA.testHistory
        };
      } catch(e) { return INITIAL_STUDENT_DATA; }
    }
    return INITIAL_STUDENT_DATA;
  },

  async updateStudentData(studentId: string, updatedData: StudentData) {
    if (this.getMode() === 'LIVE') {
      try {
        await Promise.all([
          fetch(`${API_CONFIG.BASE_URL}?module=syllabus&action=batch_sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ student_id: studentId, chapters: updatedData.chapters })
          }),
          fetch(`${API_CONFIG.BASE_URL}?module=academic&type=backlogs&action=sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ student_id: studentId, backlogs: updatedData.backlogs })
          })
        ]);
        return { success: true };
      } catch(e) { return { success: false, error: 'Sync failed' }; }
    }
    return { success: true };
  }
};