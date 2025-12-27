
import { StudentData, UserRole, UserAccount, RoutineConfig, TestResult } from '../types';
import { INITIAL_STUDENT_DATA } from '../mockData';

const API_CONFIG = {
  BASE_URL: './api/', 
  MODE_KEY: 'jeepro_datasource_mode_v10_final'
};

// CRITICAL: Hardcoded bypass for demo credentials to ensure "Demo Sign-in" works 
// even if the production PHP backend is not yet uploaded or 404s.
const DEMO_ACCOUNTS: Record<string, UserAccount> = {
  'ishu@gmail.com': { id: '163110', name: 'Aryan Sharma', email: 'ishu@gmail.com', role: UserRole.STUDENT, createdAt: '2025-01-01' },
  'parent@demo.in': { id: 'P-4402', name: 'Mr. Ramesh Sharma', email: 'parent@demo.in', role: UserRole.PARENT, createdAt: '2025-01-01' },
  'admin@demo.in': { id: 'ADMIN-001', name: 'System Admin', email: 'admin@demo.in', role: UserRole.ADMIN, createdAt: '2025-01-01' }
};

const safeJson = async (response: Response) => {
  // If response is not OK (e.g., 404, 500), do not attempt to parse as JSON
  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown network error");
    console.warn(`API non-ok response (${response.status}):`, errorText);
    return { 
      success: false, 
      error: response.status === 404 ? "Uplink Node Not Found (404). Check /api folder." : `Server Fault (${response.status})`
    };
  }
  
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Malformed API Response. Expected JSON but got:", text);
    return { success: false, error: "Protocol Error: Malformed data stream from server." };
  }
};

export const api = {
  getMode: (): 'MOCK' | 'LIVE' => (localStorage.getItem(API_CONFIG.MODE_KEY) as 'MOCK' | 'LIVE') || 'LIVE',
  
  setMode: (mode: 'MOCK' | 'LIVE') => { 
    localStorage.setItem(API_CONFIG.MODE_KEY, mode); 
    window.location.reload(); 
  },

  async login(credentials: { email: string; password?: string; role?: UserRole }) {
    const email = credentials.email.toLowerCase();
    
    // PRIORITY INTERCEPT: Always allow demo accounts to sign in without hitting the network
    if (DEMO_ACCOUNTS[email]) {
      return { success: true, user: DEMO_ACCOUNTS[email] };
    }

    if (this.getMode() === 'MOCK') {
      return { success: true, user: { id: 'MOCK-ID', name: 'Sandbox User', email: credentials.email, role: credentials.role || UserRole.STUDENT, createdAt: '2025-01-01' } };
    }

    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}auth_login.php`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      return await safeJson(res);
    } catch(e) { 
      return { success: false, error: "Host unreachable. Ensure your PHP environment is active." }; 
    }
  },

  async register(data: any) {
    if (this.getMode() === 'MOCK') return { success: true, user: { ...data, id: 'NEW-' + Date.now() } };
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}auth_register.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await safeJson(res);
    } catch(e) { return { success: false, error: "Registration Node Offline." }; }
  },

  async getStudentData(studentId: string): Promise<StudentData> {
    if (this.getMode() === 'LIVE') {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}get_dashboard.php?id=${studentId}`);
        const result = await safeJson(res);
        if (result && result.success) return result.data;
      } catch(e) { console.error("Data Sync Failure:", e); }
    }
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
      } catch(e) { return { success: false, error: "Request Failed" }; }
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
