import { StudentData, UserRole, UserAccount, Chapter } from '../types';
import { INITIAL_STUDENT_DATA } from '../mockData';

const API_CONFIG = {
  BASE_URL: '/api/router.php',
  MODE_KEY: 'jeepro_datasource_mode',
  DEMO_DISABLED_KEY: 'jeepro_demo_disabled'
};

export const api = {
  getMode: (): 'MOCK' | 'LIVE' => (localStorage.getItem(API_CONFIG.MODE_KEY) as 'MOCK' | 'LIVE') || 'MOCK',
  setMode: (mode: 'MOCK' | 'LIVE') => { localStorage.setItem(API_CONFIG.MODE_KEY, mode); window.location.reload(); },

  // Fix: Added isDemoDisabled to resolve property missing error in AdminCMS.tsx and LoginModule.tsx
  isDemoDisabled: (): boolean => localStorage.getItem(API_CONFIG.DEMO_DISABLED_KEY) === 'true',

  async register(data: { name: string; email: string; role: UserRole; password?: string }) {
    if (this.getMode() === 'LIVE') {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}?module=auth&action=register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        return await res.json();
      } catch (e) { return { success: false, error: 'Production Backend Offline' }; }
    }
    return { success: true, user: { id: `U-${Date.now()}`, ...data, createdAt: new Date().toISOString() } as UserAccount };
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
    // Mock Login Logic
    if (credentials.email === 'ishu@gmail.com') return { success: true, user: { id: '163110', name: 'Aryan Sharma', email: 'ishu@gmail.com', role: UserRole.STUDENT, createdAt: '' } };
    if (credentials.email === 'admin@jeepro.in') return { success: true, user: { id: 'ADMIN-001', name: 'System Admin', email: 'admin@jeepro.in', role: UserRole.ADMIN, createdAt: '' } };
    return { success: false, error: 'User not found in Mock DB' };
  },

  async getAccounts(): Promise<UserAccount[]> {
    if (this.getMode() === 'LIVE') {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}?module=admin`);
        return await res.json();
      } catch (e) { return []; }
    }
    return [
      { id: '163110', name: 'Aryan Sharma', email: 'ishu@gmail.com', role: UserRole.STUDENT, createdAt: '2024-01-01' },
      { id: 'ADMIN-001', name: 'Admin', email: 'admin@jeepro.in', role: UserRole.ADMIN, createdAt: '2024-01-01' }
    ];
  },

  async getStudentData(studentId: string): Promise<StudentData> {
    if (this.getMode() === 'LIVE') {
      try {
        const [syllabusRes, backlogsRes, wellnessRes] = await Promise.all([
          fetch(`${API_CONFIG.BASE_URL}?module=syllabus&action=get&student_id=${studentId}`),
          fetch(`${API_CONFIG.BASE_URL}?module=academic&action=get_backlogs&student_id=${studentId}`),
          fetch(`${API_CONFIG.BASE_URL}?module=wellness&student_id=${studentId}`)
        ]);

        const syllabus = await syllabusRes.json();
        const backlogs = await backlogsRes.json();
        const wellness = await wellnessRes.json();
        
        return {
          ...INITIAL_STUDENT_DATA,
          id: studentId,
          chapters: (syllabus.chapters && syllabus.chapters.length) ? syllabus.chapters.map((c: any) => ({
            ...INITIAL_STUDENT_DATA.chapters.find(i => i.id === c.id),
            progress: Number(c.progress),
            accuracy: Number(c.accuracy),
            timeSpent: Number(c.time_spent),
            status: c.status
          })) : INITIAL_STUDENT_DATA.chapters,
          backlogs: Array.isArray(backlogs) ? backlogs : INITIAL_STUDENT_DATA.backlogs,
          psychometricHistory: Array.isArray(wellness) ? wellness.map((w: any) => ({
            stress: Number(w.stress), focus: Number(w.focus), motivation: Number(w.motivation), 
            examFear: Number(w.exam_fear), timestamp: w.timestamp, studentSummary: w.student_summary, 
            parentAdvice: w.parent_advice
          })) : INITIAL_STUDENT_DATA.psychometricHistory
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
          fetch(`${API_CONFIG.BASE_URL}?module=academic&action=sync_backlogs`, {
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