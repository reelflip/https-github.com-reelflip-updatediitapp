
import { StudentData, UserRole, UserAccount, RoutineConfig, TestResult } from '../types';
import { INITIAL_STUDENT_DATA } from '../mockData';

const API_CONFIG = {
  BASE_URL: './api/', 
  MODE_KEY: 'jeepro_datasource_mode'
};

const DEMO_USERS: Record<string, UserAccount> = {
  'ishu@gmail.com': { id: '163110', name: 'Aryan Sharma', email: 'ishu@gmail.com', role: UserRole.STUDENT, createdAt: '2024-01-01' },
  'parent@demo.in': { id: 'P-4402', name: 'Mr. Ramesh Sharma', email: 'parent@demo.in', role: UserRole.PARENT, createdAt: '2024-01-01' },
  'admin@demo.in': { id: 'ADMIN-001', name: 'System Admin', email: 'admin@demo.in', role: UserRole.ADMIN, createdAt: '2024-01-01' }
};

const safeJson = async (response: Response) => {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Malformed JSON response:", text);
    throw new Error("Invalid Server Response.");
  }
};

export const api = {
  getMode: (): 'MOCK' | 'LIVE' => (localStorage.getItem(API_CONFIG.MODE_KEY) as 'MOCK' | 'LIVE') || 'MOCK',
  
  setMode: (mode: 'MOCK' | 'LIVE') => { 
    localStorage.setItem(API_CONFIG.MODE_KEY, mode); 
    window.location.reload(); 
  },

  async login(credentials: { email: string; password?: string; role?: UserRole }) {
    // In MOCK mode, we find the user by email and return their inherent role
    if (this.getMode() === 'MOCK') {
      const user = DEMO_USERS[credentials.email.toLowerCase()];
      if (user) {
        return { success: true, user };
      }
      return { success: false, error: "Credentials not recognized in Sandbox." };
    }
    
    // In LIVE mode, the PHP backend handles the role lookup automatically
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}index.php?action=login`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      return await safeJson(res);
    } catch(e) { return { success: false, error: "Uplink Failed." }; }
  },

  async register(data: any) {
    if (this.getMode() === 'MOCK') return { success: true, user: { ...data, id: 'MOCK-' + Math.random() } };
    const res = await fetch(`${API_CONFIG.BASE_URL}index.php?action=register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await safeJson(res);
  },

  async getStudentData(studentId: string): Promise<StudentData> {
    if (this.getMode() === 'LIVE') {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}get_dashboard.php?id=${studentId}`);
        const result = await safeJson(res);
        if (result.success) return result.data;
      } catch(e) { console.error(e); }
    }
    return INITIAL_STUDENT_DATA;
  },

  async saveRoutine(studentId: string, routine: RoutineConfig) {
    if (this.getMode() === 'LIVE') {
      await fetch(`${API_CONFIG.BASE_URL}index.php?action=save_routine`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId, routine })
      });
    }
  },

  async saveTimetable(studentId: string, tasks: any) {
    if (this.getMode() === 'LIVE') {
      await fetch(`${API_CONFIG.BASE_URL}index.php?action=save_timetable`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId, tasks })
      });
    }
    return { success: true };
  },

  async syncProgress(studentId: string, metrics: any) {
    if (this.getMode() === 'LIVE') {
       await fetch(`${API_CONFIG.BASE_URL}sync_progress.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId, ...metrics })
      });
    }
    return { success: true };
  },

  async updateStudentData(studentId: string, updatedData: StudentData) {
    if (this.getMode() === 'LIVE') {
      await fetch(`${API_CONFIG.BASE_URL}index.php?action=update_syllabus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId, chapters: updatedData.chapters })
      });
    }
    return { success: true };
  },

  async saveEntity(type: string, data: any) {
    if (this.getMode() === 'LIVE') {
      const res = await fetch(`${API_CONFIG.BASE_URL}index.php?action=save_${type.toLowerCase()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await safeJson(res);
    }
    return { success: true };
  },

  async getAccounts(): Promise<UserAccount[]> {
    if (this.getMode() === 'LIVE') {
      const res = await fetch(`${API_CONFIG.BASE_URL}index.php?action=list_users`);
      return await safeJson(res);
    }
    return Object.values(DEMO_USERS);
  },

  async updateUserProfile(studentId: string, profileData: any) {
    if (this.getMode() === 'LIVE') {
      const res = await fetch(`${API_CONFIG.BASE_URL}index.php?action=update_profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: studentId, ...profileData })
      });
      return await safeJson(res);
    }
    return { success: true };
  }
};
