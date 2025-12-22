
import { StudentData, UserRole, UserAccount, SystemEvent } from '../types';
import { INITIAL_STUDENT_DATA } from '../mockData';

const API_CONFIG = {
  VERSION: 'v5.1.1-PROD',
  BASE_URL: '/api', 
  MODE_KEY: 'jeepro_datasource_mode'
};

const DB_KEYS = {
  ACCOUNTS: 'jeepro_db_accounts',
  EVENTS: 'jeepro_db_events',
  STUDENT_DATA: 'jeepro_db_student_data',
  SMART_PLAN: 'jeepro_db_smart_plan'
};

// Hardcoded Demo Accounts for one-click access
const DEMO_ACCOUNTS: UserAccount[] = [
  { 
    id: '163110', 
    name: 'Aryan Sharma', 
    email: 'ishu@gmail.com', 
    role: UserRole.STUDENT, 
    createdAt: '2024-01-01T00:00:00Z' 
  },
  { 
    id: 'P-4402', 
    name: 'Mr. Ramesh Sharma', 
    email: 'parent@family.com', 
    role: UserRole.PARENT, 
    createdAt: '2024-01-01T00:00:00Z',
    connectedId: '163110'
  },
  { 
    id: 'ADMIN-001', 
    name: 'System Admin', 
    email: 'admin@jeepro.in', 
    role: UserRole.ADMIN, 
    createdAt: '2024-01-01T00:00:00Z' 
  }
];

const getDB = <T>(key: string, defaultValue: T): T => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
};

const saveDB = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const api = {
  getMode: (): 'MOCK' | 'LIVE' => {
    return (localStorage.getItem(API_CONFIG.MODE_KEY) as 'MOCK' | 'LIVE') || 'MOCK';
  },

  setMode: (mode: 'MOCK' | 'LIVE') => {
    localStorage.setItem(API_CONFIG.MODE_KEY, mode);
    window.location.reload();
  },

  // --- AUTHENTICATION ---
  async login(credentials: { email: string; role: UserRole }) {
    const demoUser = DEMO_ACCOUNTS.find(a => a.email === credentials.email && a.role === credentials.role);
    if (demoUser) return { success: true, user: demoUser };

    if (this.getMode() === 'LIVE') {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/auth.php?action=login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials)
        });
        const data = await response.json();
        if (data.success) return data;
      } catch (e) {
        console.error("Live login failure", e);
      }
    }

    const accounts = getDB<UserAccount[]>(DB_KEYS.ACCOUNTS, []);
    const user = accounts.find(a => a.email === credentials.email && a.role === credentials.role);
    return user ? { success: true, user } : { success: false, error: 'Identity not found.' };
  },

  async register(userData: { name: string; email: string; role: UserRole }) {
    if (this.getMode() === 'LIVE') {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/auth.php?action=register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData)
        });
        return await response.json();
      } catch (e) {
        return { success: false, error: 'Server unreachable.' };
      }
    }
    const accounts = getDB<UserAccount[]>(DB_KEYS.ACCOUNTS, []);
    const newAccount = { ...userData, id: userData.role === 'STUDENT' ? `S-${Date.now()}` : `P-${Date.now()}`, createdAt: new Date().toISOString() };
    saveDB(DB_KEYS.ACCOUNTS, [...accounts, newAccount]);
    return { success: true, user: newAccount };
  },

  // --- ADMINISTRATIVE LIVE UPLINK ---
  async adminAction(action: string, payload: any) {
    if (this.getMode() === 'LIVE') {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/admin_api.php?action=${action}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        return await response.json();
      } catch (e) {
        console.error("Admin Live Action Failed", e);
        return { success: false, error: "Uplink Failure" };
      }
    }
    return { success: true, mock: true };
  },

  // --- CORE ACADEMIC SYNC ---
  async getStudentData(studentId: string): Promise<StudentData> {
    if (this.getMode() === 'LIVE') {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/sync_engine.php?action=get_full&id=${studentId}`);
        const data = await response.json();
        if (data.payload) {
          return { ...INITIAL_STUDENT_DATA, ...data.payload, id: studentId };
        }
      } catch (e) { console.warn("Live fetch failed"); }
    }
    const allData = getDB<Record<string, StudentData>>(DB_KEYS.STUDENT_DATA, {});
    return allData[studentId] || INITIAL_STUDENT_DATA;
  },

  async updateStudentData(studentId: string, updatedData: StudentData) {
    if (this.getMode() === 'LIVE') {
      try {
        await fetch(`${API_CONFIG.BASE_URL}/sync_engine.php?action=sync`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ student_id: studentId, data: updatedData })
        });
      } catch (e) { console.error("Sync Failed"); }
    }
    const allData = getDB<Record<string, StudentData>>(DB_KEYS.STUDENT_DATA, {});
    allData[studentId] = updatedData;
    saveDB(DB_KEYS.STUDENT_DATA, allData);
    return { success: true };
  },

  getAccounts() { return getDB<UserAccount[]>(DB_KEYS.ACCOUNTS, []); },
  getEvents() { return getDB<SystemEvent[]>(DB_KEYS.EVENTS, []); },
  clearLogs() { saveDB(DB_KEYS.EVENTS, []); }
};
