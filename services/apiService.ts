
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
    if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html') || text.trim().startsWith('<br')) {
      return { 
        success: false, 
        error: "Server Error: The backend returned HTML instead of JSON. This usually means a PHP crash or a missing file." 
      };
    }
    return { success: false, error: "Malformed API Response. Check console for raw output." };
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
      return { success: false, error: "Network Error: Could not reach authentication node." }; 
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
      return { success: false, error: "Registration Node Offline." }; 
    }
  },

  async getStudentData(studentId: string): Promise<StudentData> {
    const localKey = `jeepro_data_${studentId}`;
    let baseData: StudentData = (studentId === '163110' || studentId.startsWith('ADMIN')) ? INITIAL_STUDENT_DATA : {
        ...INITIAL_STUDENT_DATA,
        id: studentId,
        name: 'New Aspirant',
        chapters: INITIAL_STUDENT_DATA.chapters.map(c => ({ ...c, progress: 0, accuracy: 0, status: 'NOT_STARTED' })),
        testHistory: [],
        psychometricHistory: [],
        pendingInvitations: [],
        timeSummary: { notes: 0, videos: 0, practice: 0, tests: 0 }
    };

    if (this.getMode() === 'LIVE') {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}get_dashboard.php?id=${studentId}`);
        const result = await safeJson(res);
        if (result && result.success && result.data) {
            const serverData = result.data;
            
            // Critical Fix: Merge server progress with local syllabus template
            // We use 'map' to ensure the final list is ALWAYS exactly the template's length
            const mergedChapters = INITIAL_STUDENT_DATA.chapters.map(templateCh => {
                const serverCh = serverData.chapters?.find((c: any) => c.id === templateCh.id);
                return serverCh ? { ...templateCh, ...serverCh } : templateCh;
            });

            // Ensure we don't wipe out global questions or tests if server returns empty arrays
            const mergedTests = (serverData.mockTests && serverData.mockTests.length > 0) ? serverData.mockTests : INITIAL_STUDENT_DATA.mockTests;
            const mergedQuestions = (serverData.questions && serverData.questions.length > 0) ? serverData.questions : INITIAL_STUDENT_DATA.questions;

            const finalData = {
                ...baseData,
                ...serverData,
                chapters: mergedChapters,
                mockTests: mergedTests,
                questions: mergedQuestions
            };

            localStorage.setItem(localKey, JSON.stringify(finalData));
            return finalData;
        }
      } catch(e) { 
        console.warn("Live data fetch failed, falling back to cache.");
      }
    }

    const cached = localStorage.getItem(localKey);
    if (cached) {
        try { 
            const parsed = JSON.parse(cached);
            // Safety check: if cached chapters are empty, use baseline
            if (parsed && parsed.chapters && parsed.chapters.length > 0) {
                return parsed; 
            }
        } catch(e) {}
    }

    return baseData;
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
              timeSpent: c.timeSpent
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
