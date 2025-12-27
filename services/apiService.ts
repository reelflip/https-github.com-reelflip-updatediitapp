import { StudentData, UserRole, UserAccount, RoutineConfig, TestResult } from '../types';
import { INITIAL_STUDENT_DATA } from '../mockData';

const API_CONFIG = {
  BASE_URL: './api/', 
  // v10.5: Global mode key for tracking datasource
  MODE_KEY: 'jeepro_datasource_mode_v10_5'
};

// High-priority local demo accounts for system verification
const DEMO_ACCOUNTS: Record<string, UserAccount> = {
  'ishu@gmail.com': { id: '163110', name: 'Aryan Sharma', email: 'ishu@gmail.com', role: UserRole.STUDENT, createdAt: '2025-01-01' },
  'parent@demo.in': { id: 'P-4402', name: 'Mr. Ramesh Sharma', email: 'parent@demo.in', role: UserRole.PARENT, createdAt: '2025-01-01' },
  'admin@demo.in': { id: 'ADMIN-001', name: 'System Admin', email: 'admin@demo.in', role: UserRole.ADMIN, createdAt: '2025-01-01' }
};

const safeJson = async (response: Response) => {
  if (!response.ok) {
    if (response.status === 404) {
        return { success: false, error: "Backend node not found (404). Ensure PHP files are in /api/." };
    }
    return { success: false, error: `Server error (${response.status})` };
  }
  
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Malformed API Response:", text);
    return { success: false, error: "Malformed server response. Check PHP logs." };
  }
};

export const api = {
  // Production Priority: Defaulting to 'LIVE'
  getMode: (): 'MOCK' | 'LIVE' => (localStorage.getItem(API_CONFIG.MODE_KEY) as 'MOCK' | 'LIVE') || 'LIVE',
  
  setMode: (mode: 'MOCK' | 'LIVE') => { 
    localStorage.setItem(API_CONFIG.MODE_KEY, mode); 
    window.location.reload(); 
  },

  async login(credentials: { email: string; password?: string; role?: UserRole }) {
    const email = credentials.email.toLowerCase();
    
    // ALLOW DEMO SIGN: Check hardcoded demo accounts first to allow immediate access even if DB is offline
    if (DEMO_ACCOUNTS[email]) {
      return { success: true, user: DEMO_ACCOUNTS[email] };
    }

    if (this.getMode() === 'MOCK') {
      return { success: true, user: { id: 'DEMO-NEW', name: 'Sandbox User', email: credentials.email, role: credentials.role || UserRole.STUDENT, createdAt: '2025-01-01' } };
    }

    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}auth_login.php`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      return await safeJson(res);
    } catch(e) { 
      return { success: false, error: "Production server node unreachable. Check connection or path." }; 
    }
  },

  async register(data: any) {
    if (this.getMode() === 'MOCK') return { success: true, user: { ...data, id: 'M-TEMP-' + Date.now() } };
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}auth_register.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await safeJson(res);
    } catch(e) { return { success: false, error: "Registration gateway timeout." }; }
  },

  async getStudentData(studentId: string): Promise<StudentData> {
    if (this.getMode() === 'LIVE') {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}get_dashboard.php?id=${studentId}`);
        const result = await safeJson(res);
        if (result && result.success) return result.data;
      } catch(e) { console.error("Sync fault during data fetch:", e); }
    }
    // Fallback to initial data if LIVE fetch fails or in MOCK mode
    return INITIAL_STUDENT_DATA;
  },

  async syncProgress(studentId: string, metrics: any) {
    if (this.getMode() === 'LIVE') {
       try {
         await fetch(`${API_CONFIG.BASE_URL}sync_progress.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ student_id: studentId, ...metrics })
        });
       } catch (e) {}
    }
    return { success: true };
  },

  async updateStudentData(studentId: string, updatedData: StudentData) {
    if (this.getMode() === 'LIVE') {
      try {
        await fetch(`${API_CONFIG.BASE_URL}manage_syllabus.php?action=update`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ student_id: studentId, chapters: updatedData.chapters })
        });
      } catch(e) {}
    }
    return { success: true };
  },

  async saveEntity(type: string, data: any) {
    if (this.getMode() === 'LIVE') {
      const typeMap: Record<string, string> = {
        'Chapter': 'manage_chapters.php',
        'Question': 'manage_questions.php',
        'MockTest': 'manage_tests.php',
        'Flashcard': 'manage_flashcards.php',
        'MemoryHack': 'manage_hacks.php',
        'Blog': 'manage_blogs.php',
        'Result': 'save_attempt.php',
        'Psychometric': 'save_psychometric.php'
      };
      const endpoint = typeMap[type] || `manage_${type.toLowerCase()}.php`;
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}${endpoint}?action=save`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        return await safeJson(res);
      } catch(e) { return { success: false, error: "Network Error" }; }
    }
    return { success: true };
  },

  async getAccounts(): Promise<UserAccount[]> {
    if (this.getMode() === 'LIVE') {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}manage_users.php`);
        const result = await safeJson(res);
        if (Array.isArray(result)) return result;
        if (result && Array.isArray(result.users)) return result.users;
        return [];
      } catch(e) { return []; }
    }
    return Object.values(DEMO_ACCOUNTS);
  },

  async updateUserProfile(studentId: string, profileData: any) {
    if (this.getMode() === 'LIVE') {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}manage_settings.php?action=profile`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: studentId, ...profileData })
        });
        return await safeJson(res);
      } catch(e) { return { success: false, error: "Profile Update Failed" }; }
    }
    return { success: true };
  },

  async saveRoutine(studentId: string, routine: RoutineConfig) {
    if (this.getMode() === 'LIVE') {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}save_routine.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ student_id: studentId, routine })
        });
        return await safeJson(res);
      } catch (e) {}
    }
    return { success: true };
  },

  async saveTimetable(studentId: string, tasks: any) {
    if (this.getMode() === 'LIVE') {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}save_timetable.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ student_id: studentId, tasks })
        });
        return await safeJson(res);
      } catch(e) {}
    }
    return { success: true };
  }
};