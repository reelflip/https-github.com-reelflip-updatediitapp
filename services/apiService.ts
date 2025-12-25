
import { StudentData, UserRole, UserAccount, Chapter, TestResult, BacklogItem } from '../types';
import { INITIAL_STUDENT_DATA } from '../mockData';

const API_CONFIG = {
  BASE_URL: '/api/', // Managed by .htaccess rewrite
  MODE_KEY: 'jeepro_datasource_mode'
};

// Clean state for production environment when disconnected
const PRODUCTION_EMPTY_STATE: StudentData = {
  ...INITIAL_STUDENT_DATA,
  name: 'Sync Node Offline',
  chapters: INITIAL_STUDENT_DATA.chapters.map(c => ({ ...c, progress: 0, accuracy: 0, status: 'NOT_STARTED' })),
  backlogs: [],
  testHistory: [],
  psychometricHistory: [{ stress: 0, focus: 0, motivation: 0, examFear: 0, timestamp: new Date().toISOString() }]
};

export const api = {
  getMode: (): 'MOCK' | 'LIVE' => (localStorage.getItem(API_CONFIG.MODE_KEY) as 'MOCK' | 'LIVE') || 'MOCK',
  setMode: (mode: 'MOCK' | 'LIVE') => { localStorage.setItem(API_CONFIG.MODE_KEY, mode); window.location.reload(); },
  isDemoDisabled: (): boolean => false,

  async login(credentials: { email: string; role: UserRole }) {
    if (this.getMode() === 'LIVE') {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}auth/login`, {
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials)
        });
        if (!res.ok) throw new Error();
        return await res.json();
      } catch(e) { return { success: false, error: 'Production Node Unreachable. Ensure Build Bundle is deployed to /api/.' }; }
    }
    // Sandbox Mock Identities
    if (credentials.email === 'ishu@gmail.com') return { success: true, user: { id: '163110', name: 'Aryan Sharma', email: 'ishu@gmail.com', role: UserRole.STUDENT, createdAt: '' } };
    if (credentials.email === 'admin@jeepro.in') return { success: true, user: { id: 'ADMIN-001', name: 'System Admin', email: 'admin@jeepro.in', role: UserRole.ADMIN, createdAt: '' } };
    return { success: false, error: 'Identity not found in Sandbox DB' };
  },

  async register(data: { name: string; email: string; role: UserRole }) {
    if (this.getMode() === 'LIVE') {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        return await res.json();
      } catch(e) { return { success: false, error: 'Cloud Registration Node Offline' }; }
    }
    return { success: true, user: { id: `S-${Date.now()}`, name: data.name, email: data.email, role: data.role, createdAt: new Date().toISOString() } };
  },

  async getStudentData(studentId: string): Promise<StudentData> {
    if (this.getMode() === 'LIVE') {
      try {
        const [sRes, bRes, wRes, rRes] = await Promise.all([
          fetch(`${API_CONFIG.BASE_URL}syllabus/get?id=${studentId}`),
          fetch(`${API_CONFIG.BASE_URL}backlogs/get?id=${studentId}`),
          fetch(`${API_CONFIG.BASE_URL}wellness/get?id=${studentId}`),
          fetch(`${API_CONFIG.BASE_URL}results/get?id=${studentId}`)
        ]);

        if (!sRes.ok) return { ...PRODUCTION_EMPTY_STATE, id: studentId };

        const [syllabus, backlogs, wellness, results] = await Promise.all([
          sRes.json(), bRes.json(), wRes.json(), rRes.json()
        ]);
        
        // Map server data to frontend structure
        const mergedChapters = INITIAL_STUDENT_DATA.chapters.map(staticCh => {
           const dbCh = syllabus.chapters?.find((c: any) => c.id === staticCh.id);
           return dbCh ? { 
             ...staticCh, 
             progress: Number(dbCh.progress) || 0, 
             accuracy: Number(dbCh.accuracy) || 0, 
             status: dbCh.status || 'NOT_STARTED' 
           } : { ...staticCh, progress: 0, accuracy: 0, status: 'NOT_STARTED' };
        });

        return {
          ...INITIAL_STUDENT_DATA,
          id: studentId,
          name: syllabus.name || 'Production User',
          chapters: mergedChapters,
          backlogs: Array.isArray(backlogs) ? backlogs : [],
          testHistory: Array.isArray(results) ? results : [],
          psychometricHistory: Array.isArray(wellness) && wellness.length > 0 ? wellness : PRODUCTION_EMPTY_STATE.psychometricHistory
        };
      } catch(e) { 
        console.error("Cloud Sync Critical Failure", e);
        return { ...PRODUCTION_EMPTY_STATE, id: studentId }; 
      }
    }
    // MOCK MODE: Strictly return local initial data
    return INITIAL_STUDENT_DATA;
  },

  async updateStudentData(studentId: string, updatedData: StudentData) {
    if (this.getMode() === 'LIVE') {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}syllabus/save`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ student_id: studentId, chapters: updatedData.chapters })
        });
        return await res.json();
      } catch(e) { return { success: false, error: 'Direct Sync Operation Failed' }; }
    }
    return { success: true };
  },

  async getAccounts(): Promise<UserAccount[]> {
     if (this.getMode() === 'LIVE') {
       try {
         const res = await fetch(`${API_CONFIG.BASE_URL}users/index`);
         if (!res.ok) return [];
         return await res.json();
       } catch(e) { return []; }
     }
     return [{ id: '163110', name: 'Aryan Sharma', email: 'ishu@gmail.com', role: UserRole.STUDENT, createdAt: '2024-01-01' }];
  }
};
