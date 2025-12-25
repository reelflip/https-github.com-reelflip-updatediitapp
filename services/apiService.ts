import { StudentData, UserRole, UserAccount, SystemEvent, Chapter } from '../types';
import { INITIAL_STUDENT_DATA } from '../mockData';

const API_CONFIG = {
  VERSION: 'v18.0-MASTER-ENGINE',
  // Change this to your real URL for production (e.g. 'https://yourdomain.com/api/api.php')
  BASE_URL: '/api/api.php', 
  MODE_KEY: 'jeepro_datasource_mode',
  DEMO_DISABLED_KEY: 'jeepro_demo_identities_disabled'
};

const DB_KEYS = {
  ACCOUNTS: 'jeepro_db_accounts',
  STUDENT_DATA: 'jeepro_db_student_data'
};

const DEMO_ACCOUNTS: UserAccount[] = [
  { id: '163110', name: 'Aryan Sharma', email: 'ishu@gmail.com', role: UserRole.STUDENT, createdAt: '2024-01-01' },
  { id: 'P-4402', name: 'Mr. Ramesh Sharma', email: 'parent@family.com', role: UserRole.PARENT, createdAt: '2024-01-01', connectedId: '163110' },
  { id: 'ADMIN-001', name: 'System Admin', email: 'admin@jeepro.in', role: UserRole.ADMIN, createdAt: '2024-01-01' }
];

const getDB = <T>(key: string, defaultValue: T): T => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
};

const saveDB = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const api = {
  getMode: (): 'MOCK' | 'LIVE' => (localStorage.getItem(API_CONFIG.MODE_KEY) as 'MOCK' | 'LIVE') || 'MOCK',
  setMode: (mode: 'MOCK' | 'LIVE') => { localStorage.setItem(API_CONFIG.MODE_KEY, mode); window.location.reload(); },
  isDemoDisabled: (): boolean => localStorage.getItem(API_CONFIG.DEMO_DISABLED_KEY) === 'true',
  setDemoDisabled: (disabled: boolean) => localStorage.setItem(API_CONFIG.DEMO_DISABLED_KEY, disabled.toString()),

  async login(credentials: { email: string; role: UserRole }) {
    if (!this.isDemoDisabled()) {
      const demoUser = DEMO_ACCOUNTS.find(a => a.email === credentials.email && a.role === credentials.role);
      if (demoUser) return { success: true, user: demoUser };
    }
    if (this.getMode() === 'LIVE') {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}?module=auth&action=login`, {
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials)
        });
        return await res.json();
      } catch(e) { return { success: false, error: 'Production Backend Offline (Check XAMPP)' }; }
    }
    const accounts = getDB<UserAccount[]>(DB_KEYS.ACCOUNTS, []);
    const user = accounts.find(a => a.email === credentials.email && a.role === credentials.role);
    return user ? { success: true, user } : { success: false, error: 'Identity not found.' };
  },

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
        return { success: false, error: 'Registration service unavailable' };
      }
    }
    const accounts = getDB<UserAccount[]>(DB_KEYS.ACCOUNTS, []);
    const newUser: UserAccount = {
      id: `U-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: data.role,
      password: data.password,
      createdAt: new Date().toISOString()
    };
    saveDB(DB_KEYS.ACCOUNTS, [...accounts, newUser]);
    return { success: true, user: newUser };
  },

  async getAccounts(): Promise<UserAccount[]> {
    if (this.getMode() === 'LIVE') {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}?module=auth&action=get_accounts`);
        const live = await res.json();
        return Array.isArray(live) ? (this.isDemoDisabled() ? live : [...DEMO_ACCOUNTS, ...live]) : DEMO_ACCOUNTS;
      } catch (e) { return DEMO_ACCOUNTS; }
    }
    return getDB<UserAccount[]>(DB_KEYS.ACCOUNTS, DEMO_ACCOUNTS);
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
    const allData = getDB<Record<string, StudentData>>(DB_KEYS.STUDENT_DATA, {});
    return allData[studentId] || INITIAL_STUDENT_DATA;
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
    const allData = getDB<Record<string, StudentData>>(DB_KEYS.STUDENT_DATA, {});
    allData[studentId] = updatedData;
    saveDB(DB_KEYS.STUDENT_DATA, allData);
    return { success: true };
  }
};