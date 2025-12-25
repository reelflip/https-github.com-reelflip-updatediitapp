
import { StudentData, UserRole, UserAccount, Chapter, TestResult, BacklogItem } from '../types';
import { INITIAL_STUDENT_DATA } from '../mockData';

const API_CONFIG = {
  // Use relative path for XAMPP compatibility
  BASE_URL: './api/', 
  MODE_KEY: 'jeepro_datasource_mode'
};

const PRODUCTION_EMPTY_STATE: StudentData = {
  ...INITIAL_STUDENT_DATA,
  name: 'Sync Node Offline',
  chapters: INITIAL_STUDENT_DATA.chapters.map(c => ({ ...c, progress: 0, accuracy: 0, status: 'NOT_STARTED' })),
  backlogs: [],
  testHistory: [],
  psychometricHistory: [{ stress: 0, focus: 0, motivation: 0, examFear: 0, timestamp: new Date().toISOString() }]
};

// Robust JSON parser helper
const safeJson = async (response: Response) => {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Server returned non-JSON response:", text);
    // If we get HTML back, it's likely a PHP error or 404
    if (text.includes('<?php') || text.includes('<b>Fatal error</b>') || text.includes('<br />')) {
        throw new Error("Server-side PHP Error. Check api/check.php for details.");
    }
    throw new Error("Invalid Server Response (Check api/config/database.php)");
  }
};

export const api = {
  getMode: (): 'MOCK' | 'LIVE' => (localStorage.getItem(API_CONFIG.MODE_KEY) as 'MOCK' | 'LIVE') || 'MOCK',
  setMode: (mode: 'MOCK' | 'LIVE') => { localStorage.setItem(API_CONFIG.MODE_KEY, mode); window.location.reload(); },
  isDemoDisabled: (): boolean => false,

  // New diagnostic method to check backend health from the UI
  async checkBackendStatus() {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}check.php`);
      const text = await res.text();
      return { 
        success: res.ok, 
        html: text,
        status: res.status
      };
    } catch (e) {
      return { 
        success: false, 
        html: `<p style="color:red">Connection Refused. Ensure 'api/' folder is in the root and Apache is running.</p>`,
        status: 0
      };
    }
  },

  async login(credentials: { email: string; role: UserRole }) {
    // HYBRID LOGIC: Allow Demo Accounts to work even in LIVE mode for emergency access
    if (credentials.email === 'ishu@gmail.com') return { success: true, user: { id: '163110', name: 'Aryan Sharma', email: 'ishu@gmail.com', role: UserRole.STUDENT, createdAt: '2024-01-01' } };
    if (credentials.email === 'admin@jeepro.in') return { success: true, user: { id: 'ADMIN-001', name: 'System Admin', email: 'admin@jeepro.in', role: UserRole.ADMIN, createdAt: '2024-01-01' } };

    if (this.getMode() === 'LIVE') {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}auth/login`, {
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials)
        });
        return await safeJson(res);
      } catch(e) { 
        return { success: false, error: e instanceof Error ? e.message : 'Database Node Unreachable' }; 
      }
    }
    
    return { success: false, error: 'Identity not found in Sandbox DB' };
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
      } catch (e) {
        return { success: false, error: e instanceof Error ? e.message : 'Database Node Unreachable' };
      }
    }
    return { 
      success: true, 
      user: { 
        id: `REG-${Date.now()}`, 
        name: data.name, 
        email: data.email, 
        role: data.role, 
        createdAt: new Date().toISOString() 
      } 
    };
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

        const syllabus = await safeJson(sRes).catch(() => ({}));
        const backlogs = await safeJson(bRes).catch(() => []);
        const wellness = await safeJson(wRes).catch(() => []);
        const results = await safeJson(rRes).catch(() => []);
        
        const mergedChapters = INITIAL_STUDENT_DATA.chapters.map(staticCh => {
           const dbCh = Array.isArray(syllabus.chapters) 
            ? syllabus.chapters.find((c: any) => c.id === staticCh.id)
            : null;

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
          psychometricHistory: (Array.isArray(wellness) && wellness.length > 0) ? wellness : PRODUCTION_EMPTY_STATE.psychometricHistory
        };
      } catch(e) { 
        console.error("Cloud Sync Critical Failure", e);
        return { ...PRODUCTION_EMPTY_STATE, id: studentId }; 
      }
    }
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
        return await safeJson(res);
      } catch(e) { return { success: false, error: 'Direct Sync Operation Failed' }; }
    }
    return { success: true };
  },

  async getAccounts(): Promise<UserAccount[]> {
     if (this.getMode() === 'LIVE') {
       try {
         const res = await fetch(`${API_CONFIG.BASE_URL}users/index`);
         const data = await safeJson(res);
         return Array.isArray(data) ? data : [];
       } catch(e) { return []; }
     }
     return [{ id: '163110', name: 'Aryan Sharma', email: 'ishu@gmail.com', role: UserRole.STUDENT, createdAt: '2024-01-01' }];
  }
};
