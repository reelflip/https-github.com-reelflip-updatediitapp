
import { StudentData, UserRole, UserAccount, SystemEvent } from '../types';
import { INITIAL_STUDENT_DATA } from '../mockData';

const API_CONFIG = {
  VERSION: 'v17.0-GRANULAR-CORE',
  BASE_URL: '/api', 
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
      const res = await fetch(`${API_CONFIG.BASE_URL}/auth.php?action=login`, {
        method: 'POST', body: JSON.stringify(credentials)
      });
      return await res.json();
    }
    const accounts = getDB<UserAccount[]>(DB_KEYS.ACCOUNTS, []);
    const user = accounts.find(a => a.email === credentials.email && a.role === credentials.role);
    return user ? { success: true, user } : { success: false, error: 'Identity not found.' };
  },

  // Fixed: Added register method to resolve Property 'register' does not exist error in LoginModule.
  async register(data: { name: string; email: string; role: UserRole; password?: string }) {
    if (this.getMode() === 'LIVE') {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}/auth.php?action=register`, {
          method: 'POST', body: JSON.stringify(data)
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
        const res = await fetch(`${API_CONFIG.BASE_URL}/auth.php?action=get_accounts`);
        const live = await res.json();
        return this.isDemoDisabled() ? live : [...DEMO_ACCOUNTS, ...live];
      } catch (e) { return DEMO_ACCOUNTS; }
    }
    return getDB<UserAccount[]>(DB_KEYS.ACCOUNTS, DEMO_ACCOUNTS);
  },

  async getStudentData(studentId: string): Promise<StudentData> {
    if (this.getMode() === 'LIVE') {
      // For Production, we fetch and reconstruct the full object from granular tables
      const [syllabus, backlogs, wellness, results] = await Promise.all([
        fetch(`${API_CONFIG.BASE_URL}/syllabus.php?action=get&student_id=${studentId}`).then(r => r.json()),
        fetch(`${API_CONFIG.BASE_URL}/academic.php?module=backlogs&action=get&student_id=${studentId}`).then(r => r.json()),
        fetch(`${API_CONFIG.BASE_URL}/wellness.php?student_id=${studentId}`).then(r => r.json()),
        fetch(`${API_CONFIG.BASE_URL}/results.php?student_id=${studentId}`).then(r => r.json())
      ]);
      
      return {
        ...INITIAL_STUDENT_DATA,
        id: studentId,
        chapters: syllabus.chapters?.length ? syllabus.chapters : INITIAL_STUDENT_DATA.chapters,
        backlogs: Array.isArray(backlogs) ? backlogs : INITIAL_STUDENT_DATA.backlogs,
        psychometricHistory: Array.isArray(wellness) ? wellness : INITIAL_STUDENT_DATA.psychometricHistory,
        testHistory: Array.isArray(results) ? results : INITIAL_STUDENT_DATA.testHistory
      };
    }
    const allData = getDB<Record<string, StudentData>>(DB_KEYS.STUDENT_DATA, {});
    return allData[studentId] || INITIAL_STUDENT_DATA;
  },

  async updateStudentData(studentId: string, updatedData: StudentData) {
    if (this.getMode() === 'LIVE') {
      // Parallel granular sync
      await Promise.all([
        fetch(`${API_CONFIG.BASE_URL}/syllabus.php?action=batch_sync`, {
          method: 'POST', body: JSON.stringify({ student_id: studentId, chapters: updatedData.chapters })
        }),
        fetch(`${API_CONFIG.BASE_URL}/academic.php?module=backlogs&action=sync`, {
            method: 'POST', body: JSON.stringify({ student_id: studentId, backlogs: updatedData.backlogs })
        })
      ]);
      return { success: true };
    }
    const allData = getDB<Record<string, StudentData>>(DB_KEYS.STUDENT_DATA, {});
    allData[studentId] = updatedData;
    saveDB(DB_KEYS.STUDENT_DATA, allData);
    return { success: true };
  }
};
