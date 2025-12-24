import { StudentData, UserRole, UserAccount, SystemEvent } from '../types';
import { INITIAL_STUDENT_DATA } from '../mockData';

const API_CONFIG = {
  VERSION: 'v5.6.0-PRO-SECURITY',
  BASE_URL: '/api', 
  MODE_KEY: 'jeepro_datasource_mode',
  DEMO_DISABLED_KEY: 'jeepro_demo_identities_disabled'
};

const DB_KEYS = {
  ACCOUNTS: 'jeepro_db_accounts',
  EVENTS: 'jeepro_db_events',
  STUDENT_DATA: 'jeepro_db_student_data'
};

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

  isDemoDisabled: (): boolean => {
    return localStorage.getItem(API_CONFIG.DEMO_DISABLED_KEY) === 'true';
  },

  setDemoDisabled: (disabled: boolean) => {
    localStorage.setItem(API_CONFIG.DEMO_DISABLED_KEY, disabled.toString());
  },

  // --- AUTHENTICATION ---
  async login(credentials: { email: string; role: UserRole }) {
    // Check if demo identities are allowed
    if (!this.isDemoDisabled()) {
      const demoUser = DEMO_ACCOUNTS.find(a => a.email === credentials.email && a.role === credentials.role);
      if (demoUser) return { success: true, user: demoUser };
    }

    if (this.getMode() === 'LIVE') {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/auth.php?action=login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials)
        });
        const data = await response.json();
        if (data.success) return data;
        throw new Error(data.error || "Access Denied: Check local MySQL records.");
      } catch (e: any) {
        alert("LIVE SERVER ERROR: " + (e.message || "Uplink Failure. Check XAMPP/PHP."));
        return { success: false, error: e.message };
      }
    }

    const accounts = getDB<UserAccount[]>(DB_KEYS.ACCOUNTS, []);
    const user = accounts.find(a => a.email === credentials.email && a.role === credentials.role);
    return user ? { success: true, user } : { success: false, error: 'Identity not found in database.' };
  },

  async register(userData: { name: string; email: string; role: UserRole }) {
    if (this.getMode() === 'LIVE') {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/auth.php?action=register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData)
        });
        const data = await response.json();
        if (data.success) return data;
        throw new Error(data.error);
      } catch (e: any) {
        alert("LIVE SERVER ERROR: " + e.message);
        return { success: false, error: e.message };
      }
    }
    const accounts = getDB<UserAccount[]>(DB_KEYS.ACCOUNTS, []);
    const newAccount = { ...userData, id: userData.role === 'STUDENT' ? `S-${Date.now()}` : `P-${Date.now()}`, createdAt: new Date().toISOString() };
    saveDB(DB_KEYS.ACCOUNTS, [...accounts, newAccount]);
    return { success: true, user: newAccount };
  },

  async getAccounts(): Promise<UserAccount[]> {
    let baseAccounts: UserAccount[] = [];
    if (this.getMode() === 'LIVE') {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/auth.php?action=get_accounts`);
        if (response.ok) baseAccounts = await response.json();
      } catch (e) {
        console.error("Live fetch failed");
      }
    } else {
      baseAccounts = getDB<UserAccount[]>(DB_KEYS.ACCOUNTS, []);
    }

    // Mix in demos only if not disabled
    if (!this.isDemoDisabled()) {
      return [...DEMO_ACCOUNTS, ...baseAccounts];
    }
    return baseAccounts;
  },

  async getStudentData(studentId: string): Promise<StudentData> {
    if (this.getMode() === 'LIVE') {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/sync_engine.php?action=get_full&id=${studentId}`);
        const data = await response.json();
        if (data.success && data.payload) {
          return { ...INITIAL_STUDENT_DATA, ...data.payload, id: studentId };
        }
        throw new Error(data.error || "Node payload missing.");
      } catch (e: any) {
        alert("LIVE DATA ERROR: " + e.message);
        throw e;
      }
    }
    const allData = getDB<Record<string, StudentData>>(DB_KEYS.STUDENT_DATA, {});
    return allData[studentId] || INITIAL_STUDENT_DATA;
  },

  async updateStudentData(studentId: string, updatedData: StudentData) {
    if (this.getMode() === 'LIVE') {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/sync_engine.php?action=sync`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ student_id: studentId, data: updatedData })
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.error);
        return { success: true };
      } catch (e: any) {
        alert("CRITICAL SYNC FAILURE: Changes were not saved to MySQL.");
        return { success: false };
      }
    }
    const allData = getDB<Record<string, StudentData>>(DB_KEYS.STUDENT_DATA, {});
    allData[studentId] = updatedData;
    saveDB(DB_KEYS.STUDENT_DATA, allData);
    return { success: true };
  },

  getEvents() { return getDB<SystemEvent[]>(DB_KEYS.EVENTS, []); },
  clearLogs() { saveDB(DB_KEYS.EVENTS, []); }
};