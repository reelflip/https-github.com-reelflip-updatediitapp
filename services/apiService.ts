
import { StudentData, UserRole, UserAccount, RoutineConfig, TestResult, Chapter, PsychometricScore } from '../types';
import { INITIAL_STUDENT_DATA } from '../mockData';

const API_CONFIG = {
  BASE_URL: './api/', 
  MODE_KEY: 'jeepro_datasource_mode_v10_final'
};

const DEMO_ACCOUNTS: Record<string, UserAccount> = {
  'ishu@gmail.com': { id: '163110', name: 'Aryan Sharma', email: 'ishu@gmail.com', role: UserRole.STUDENT, createdAt: '2025-01-01' },
  'parent@demo.in': { id: 'P-4402', name: 'Mr. Ramesh Sharma', email: 'parent@demo.in', role: UserRole.PARENT, createdAt: '2025-01-01' },
  'admin@demo.in': { id: 'ADMIN-001', name: 'System Admin', email: 'admin@demo.in', role: UserRole.ADMIN, createdAt: '2025-01-01' }
};

const safeJson = async (response: Response) => {
  const text = await response.text();
  
  if (!response.ok) {
    return { 
      success: false, 
      error: response.status === 404 
        ? "Uplink Node Not Found (404). Ensure the /api/ folder and PHP files are correctly placed on your server." 
        : `Server Fault (${response.status}): ${text.substring(0, 50)}...`
    };
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse API response:", text);
    // If it's HTML, the server likely threw a PHP error or a 404 page
    if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html') || text.trim().startsWith('<br')) {
      return { 
        success: false, 
        error: "Server Error: The backend returned HTML instead of JSON. This usually means a PHP crash or a missing file. Check your server logs." 
      };
    }
    return { success: false, error: "Malformed API Response. The server sent invalid data. Check console for raw output." };
  }
};

export const api = {
  getMode: (): 'MOCK' | 'LIVE' => (localStorage.getItem(API_CONFIG.MODE_KEY) as 'MOCK' | 'LIVE') || 'MOCK',
  
  setMode: (mode: 'MOCK' | 'LIVE') => { 
    localStorage.setItem(API_CONFIG.MODE_KEY, mode); 
    window.location.reload(); 
  },

  async login(credentials: { email: string; password?: string; role?: UserRole }) {
    const email = credentials.email.toLowerCase();
    
    // Always allow demo accounts to bypass everything for stability
    if (DEMO_ACCOUNTS[email]) {
      return { success: true, user: DEMO_ACCOUNTS[email] };
    }

    if (this.getMode() === 'MOCK') {
      return { 
        success: true, 
        user: { 
          id: 'USER-' + btoa(email).substring(0, 8), 
          name: email.split('@')[0], 
          email: credentials.email, 
          role: credentials.role || UserRole.STUDENT, 
          createdAt: new Date().toISOString() 
        } 
      };
    }

    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}auth_login.php`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      return await safeJson(res);
    } catch(e) { 
      return { success: false, error: "Network Error: Could not reach authentication node. Ensure your domain is correct." }; 
    }
  },

  async register(data: any) {
    if (this.getMode() === 'MOCK') {
      const id = 'USER-' + Math.random().toString(36).substr(2, 9);
      const newUser = { ...data, id, createdAt: new Date().toISOString() };
      return { success: true, user: newUser };
    }
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}auth_register.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await safeJson(res);
    } catch(e) { 
      return { success: false, error: "Registration Node Offline. Ensure PHP backend is uploaded to /api/ and database is configured." }; 
    }
  },

  async getStudentData(studentId: string): Promise<StudentData> {
    const localKey = `jeepro_data_${studentId}`;
    const localData = localStorage.getItem(localKey);
    
    if (this.getMode() === 'LIVE') {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}get_dashboard.php?id=${studentId}`);
        const result = await safeJson(res);
        if (result && result.success) {
            localStorage.setItem(localKey, JSON.stringify(result.data));
            return result.data;
        }
      } catch(e) { 
        console.warn("Live data fetch failed, falling back to cache.");
      }
    }

    if (localData) {
        try { return JSON.parse(localData); } catch(e) {}
    }

    if (studentId === '163110') return INITIAL_STUDENT_DATA;

    return {
        ...INITIAL_STUDENT_DATA,
        id: studentId,
        name: studentId.startsWith('USER') ? 'New Aspirant' : studentId,
        chapters: INITIAL_STUDENT_DATA.chapters.map(c => ({ ...c, progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' })),
        testHistory: [],
        psychometricHistory: [],
        pendingInvitations: [],
        timeSummary: { notes: 0, videos: 0, practice: 0, tests: 0 }
    };
  },

  async updateStudentData(studentId: string, updatedData: StudentData) {
    localStorage.setItem(`jeepro_data_${studentId}`, JSON.stringify(updatedData));

    if (this.getMode() === 'LIVE') {
      try {
        await fetch(`${API_CONFIG.BASE_URL}sync_progress.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            student_id: studentId, 
            chapters: updatedData.chapters.map(c => ({
              id: c.id,
              progress: c.progress,
              accuracy: c.accuracy,
              status: c.status,
              timeSpent: c.timeSpent,
              timeSpentNotes: c.timeSpentNotes,
              timeSpentVideos: c.timeSpentVideos,
              timeSpentPractice: c.timeSpentPractice,
              timeSpentTests: c.timeSpentTests
            })),
            connectedParent: updatedData.connectedParent,
            pendingInvitations: updatedData.pendingInvitations
          })
        });
      } catch(e) {}
    }
    return { success: true };
  },

  async saveEntity(type: string, data: any) {
    if (this.getMode() === 'LIVE') {
      let endpoint = `manage_${type.toLowerCase()}.php`;
      if (type === 'Result') endpoint = 'save_attempt.php';
      if (type === 'Psychometric') endpoint = 'save_psychometric.php';

      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}${endpoint}?action=save`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        return await safeJson(res);
      } catch(e) { return { success: false, error: "Uplink Failed" }; }
    }
    return { success: true };
  },

  async getAccounts(): Promise<UserAccount[]> {
    if (this.getMode() === 'LIVE') {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}manage_users.php`);
        const result = await safeJson(res);
        if (result?.users) return result.users;
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
      } catch(e) { return { success: false, error: "Profile Sync Failed" }; }
    }
    return { success: true };
  },

  async saveRoutine(studentId: string, routine: RoutineConfig) {
    if (this.getMode() === 'LIVE') {
      try {
        await fetch(`${API_CONFIG.BASE_URL}save_routine.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ student_id: studentId, routine })
        });
      } catch (e) {}
    }
    return { success: true };
  },

  async saveTimetable(studentId: string, smartPlan: any) {
    if (this.getMode() === 'LIVE') {
      try {
        await fetch(`${API_CONFIG.BASE_URL}save_timetable.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ student_id: studentId, smartPlan })
        });
      } catch(e) {}
    }
    return { success: true };
  }
};
