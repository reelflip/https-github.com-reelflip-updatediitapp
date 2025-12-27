
import { StudentData, UserRole, UserAccount, RoutineConfig, TestResult } from '../types';
import { INITIAL_STUDENT_DATA } from '../mockData';

const API_CONFIG = {
  // Direct relative path to the api folder containing all modules
  BASE_URL: './api/', 
  MODE_KEY: 'jeepro_datasource_mode_v9'
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
    throw new Error("API Node returned invalid data. Check server logs.");
  }
};

export const api = {
  getMode: (): 'MOCK' | 'LIVE' => (localStorage.getItem(API_CONFIG.MODE_KEY) as 'MOCK' | 'LIVE') || 'MOCK',
  
  setMode: (mode: 'MOCK' | 'LIVE') => { 
    localStorage.setItem(API_CONFIG.MODE_KEY, mode); 
    window.location.reload(); 
  },

  async login(credentials: { email: string; password?: string; role?: UserRole }) {
    if (this.getMode() === 'MOCK') {
      const user = DEMO_USERS[credentials.email.toLowerCase()];
      if (user) return { success: true, user };
      return { success: false, error: "Identity not recognized in Sandbox mode." };
    }
    
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}auth_login.php`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      return await safeJson(res);
    } catch(e) { return { success: false, error: "Uplink Failure. Deployment node unreachable." }; }
  },

  async register(data: any) {
    if (this.getMode() === 'MOCK') return { success: true, user: { ...data, id: 'MOCK-' + Math.random().toString(36).substr(2, 5) } };
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}auth_register.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await safeJson(res);
    } catch(e) { return { success: false, error: "Registration node unreachable." }; }
  },

  async getStudentData(studentId: string): Promise<StudentData> {
    if (this.getMode() === 'LIVE') {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}get_dashboard.php?id=${studentId}`);
        const result = await safeJson(res);
        if (result.success) return result.data;
      } catch(e) { console.error("Sync fault:", e); }
    }
    return INITIAL_STUDENT_DATA;
  },

  async saveRoutine(studentId: string, routine: RoutineConfig) {
    if (this.getMode() === 'LIVE') {
      await fetch(`${API_CONFIG.BASE_URL}save_routine.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId, routine })
      });
    }
  },

  async saveTimetable(studentId: string, tasks: any) {
    if (this.getMode() === 'LIVE') {
      await fetch(`${API_CONFIG.BASE_URL}save_timetable.php`, {
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
      await fetch(`${API_CONFIG.BASE_URL}manage_syllabus.php?action=update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId, chapters: updatedData.chapters })
      });
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
      const connector = endpoint.includes('?') ? '&' : '?';
      
      const res = await fetch(`${API_CONFIG.BASE_URL}${endpoint}${connector}action=save`, {
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
      const res = await fetch(`${API_CONFIG.BASE_URL}manage_users.php`);
      return await safeJson(res);
    }
    return Object.values(DEMO_USERS);
  },

  async updateUserProfile(studentId: string, profileData: any) {
    if (this.getMode() === 'LIVE') {
      const res = await fetch(`${API_CONFIG.BASE_URL}manage_settings.php?action=profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: studentId, ...profileData })
      });
      return await safeJson(res);
    }
    return { success: true };
  }
};
