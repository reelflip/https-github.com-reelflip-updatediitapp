
import { StudentData, UserRole, UserAccount, RoutineConfig, TestResult, Chapter, PsychometricScore, ContactMessage, ParentInvitation } from '../types';
import { INITIAL_STUDENT_DATA } from '../mockData';

declare global {
  interface Window {
    SOLARIS_CONFIG?: {
      dataSourceMode: 'MOCK' | 'LIVE';
    };
  }
}

const API_CONFIG = {
  BASE_URL: 'api/', 
  MODE_KEY: 'jeepro_datasource_mode_v10_final',
  GLOBAL_USERS_KEY: 'jeepro_global_users_registry_v22'
};

const generateStableId = (email: string) => 'USER-' + btoa(email.toLowerCase()).substring(0, 10);

const getZeroStateChapters = (): Chapter[] => {
  return INITIAL_STUDENT_DATA.chapters.map(ch => ({
    ...ch,
    progress: 0,
    accuracy: 0,
    status: 'NOT_STARTED',
    timeSpent: 0,
    timeSpentNotes: 0,
    timeSpentVideos: 0,
    timeSpentPractice: 0,
    timeSpentTests: 0,
    lastStudied: undefined
  }));
};

const getZeroStateStudentData = (id: string, name: string): StudentData => ({
  ...INITIAL_STUDENT_DATA,
  id,
  name,
  chapters: getZeroStateChapters(),
  flashcards: INITIAL_STUDENT_DATA.flashcards || [],
  memoryHacks: INITIAL_STUDENT_DATA.memoryHacks || [],
  testHistory: [], 
  psychometricHistory: [],
  backlogs: [],
  pendingInvitations: [],
  messages: [],
  timeSummary: { notes: 0, videos: 0, practice: 0, tests: 0 },
  smartPlan: undefined,
  routine: undefined
});

const safeJson = async (response: Response) => {
  const text = await response.text();
  try {
    if (!response.ok) {
      return { 
        success: false, 
        error: `HTTP ${response.status}: Path '${response.url}' unreachable.` 
      };
    }
    const data = JSON.parse(text);
    if (data.error === "Core Handshake Failed") {
      return {
        success: false,
        error: "Database Connection Error: The PHP backend cannot connect to MySQL. Please edit 'api/database.php' (now in flat folder) with your correct database credentials."
      };
    }
    return data;
  } catch (e) {
    if (text.includes('<!DOCTYPE html>') || text.includes('<html>')) {
      return { 
        success: false, 
        error: "Server Route Fault: The server returned an HTML page instead of JSON. Ensure the 'api/' folder is in your web root." 
      };
    }
    return { success: false, error: "Protocol Mismatch: Backend returned invalid data stream." };
  }
};

export const api = {
  getMode: (): 'MOCK' | 'LIVE' => {
    // HARD LINE: Force LIVE mode if not on localhost
    const isLocal = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' || 
                    window.location.hostname.startsWith('192.168.');
    
    if (!isLocal) return 'LIVE';

    // Priority 1: Direct configuration in index.html (for local testing)
    if (window.SOLARIS_CONFIG && window.SOLARIS_CONFIG.dataSourceMode) {
      return window.SOLARIS_CONFIG.dataSourceMode;
    }
    // Priority 2: Persistent user choice (legacy support)
    return (localStorage.getItem(API_CONFIG.MODE_KEY) as 'MOCK' | 'LIVE') || 'MOCK';
  },
  
  setMode: (mode: 'MOCK' | 'LIVE') => { 
    localStorage.setItem(API_CONFIG.MODE_KEY, mode); 
    window.location.reload(); 
  },

  async login(credentials: { email: string; password?: string; role?: UserRole }) {
    const email = credentials.email.toLowerCase();
    const demoEmails = ['admin@demo.in', 'parent@demo.in', 'ishu@gmail.com'];
    const isDemo = demoEmails.includes(email);
    
    if (this.getMode() === 'LIVE' && !isDemo) {
        try {
          const res = await fetch(`${API_CONFIG.BASE_URL}auth_login.php`, {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
          });
          return await safeJson(res);
        } catch(e) { return { success: false, error: "Uplink Failure: Connection to PHP node refused." }; }
    }

    const registry = JSON.parse(localStorage.getItem(API_CONFIG.GLOBAL_USERS_KEY) || '[]');
    const registeredUser = registry.find((u: UserAccount) => u.email.toLowerCase() === email);
    if (registeredUser) return { success: true, user: registeredUser };

    let determinedRole = UserRole.STUDENT;
    if (email === 'admin@demo.in') determinedRole = UserRole.ADMIN;
    else if (email === 'parent@demo.in') determinedRole = UserRole.PARENT;

    return { 
      success: true, 
      user: { id: generateStableId(email), name: email.split('@')[0], email, role: determinedRole, createdAt: new Date().toISOString() } 
    };
  },

  async register(data: any) {
    if (this.getMode() === 'LIVE') {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}auth_register.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        return await safeJson(res);
      } catch(e) { return { success: false, error: "Handshake Timeout: Verify API deployment." }; }
    }
    
    const id = generateStableId(data.email);
    const newUser: UserAccount = { ...data, id, createdAt: new Date().toISOString() };
    
    const registry = JSON.parse(localStorage.getItem(API_CONFIG.GLOBAL_USERS_KEY) || '[]');
    if (!registry.some((u: UserAccount) => u.email.toLowerCase() === data.email.toLowerCase())) {
        registry.push(newUser);
        localStorage.setItem(API_CONFIG.GLOBAL_USERS_KEY, JSON.stringify(registry));
    }

    if (data.role === UserRole.STUDENT) {
      localStorage.setItem(`jeepro_data_${id}`, JSON.stringify(getZeroStateStudentData(id, data.name)));
    }
    return { success: true, user: newUser };
  },

  async getStudentData(studentId: string): Promise<StudentData> {
    if (this.getMode() === 'LIVE') {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}get_dashboard.php?id=${studentId}`);
        const result = await safeJson(res);
        if (result?.success && result.data) {
            const serverData = result.data;
            const templateChapters = getZeroStateChapters();
            const mergedChapters = templateChapters.map(t => {
                const s = serverData.individual_progress?.find((c: any) => c.id === t.id);
                if (s) {
                  return { 
                    ...t, 
                    ...s, 
                    progress: Number(s.progress),
                    accuracy: Number(s.accuracy),
                    timeSpent: Number(s.timeSpent),
                    timeSpentNotes: Number(s.timeSpentNotes || 0),
                    timeSpentVideos: Number(s.timeSpentVideos || 0),
                    timeSpentPractice: Number(s.timeSpentPractice || 0),
                    timeSpentTests: Number(s.timeSpentTests || 0)
                  };
                }
                return t;
            });
            return {
                ...getZeroStateStudentData(studentId, serverData.name || 'Aspirant'),
                ...serverData,
                chapters: mergedChapters,
                testHistory: serverData.testHistory || [],
                connectedParent: serverData.connectedParent || null,
                pendingInvitations: serverData.pendingInvitations || []
            };
        }
      } catch(e) { console.error("Sync Error", e); }
    }
    const cached = localStorage.getItem(`jeepro_data_${studentId}`);
    return cached ? JSON.parse(cached) : getZeroStateStudentData(studentId, 'Aspirant');
  },

  async searchStudent(query: string): Promise<UserAccount | null> {
    const q = query.toLowerCase();
    if (this.getMode() === 'LIVE') {
        try {
            const res = await fetch(`${API_CONFIG.BASE_URL}manage_users.php?action=search&query=${encodeURIComponent(q)}&role=STUDENT`);
            const result = await safeJson(res);
            if (result?.success && result.users?.length > 0) return result.users[0];
        } catch(e) {}
    }
    const registry = JSON.parse(localStorage.getItem(API_CONFIG.GLOBAL_USERS_KEY) || '[]');
    return registry.find((u: UserAccount) => u.role === UserRole.STUDENT && (u.id.toLowerCase() === q || u.name.toLowerCase().includes(q))) || null;
  },

  async updateStudentData(studentId: string, updatedData: StudentData) {
    localStorage.setItem(`jeepro_data_${studentId}`, JSON.stringify(updatedData));
    if (this.getMode() === 'LIVE') {
      try {
        const payload = { 
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
          testHistory: updatedData.testHistory,
          connectedParent: updatedData.connectedParent || null,
          pendingInvitations: updatedData.pendingInvitations || []
        };
        await fetch(`${API_CONFIG.BASE_URL}sync_progress.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch(e) { console.error("Persistence Error", e); }
    }
    return { success: true };
  },

  async saveEntity(type: string, data: any) {
    if (this.getMode() === 'LIVE') {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}manage_entity.php?type=${type}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        return await safeJson(res);
      } catch(e) { return { success: false, error: "Uplink Failed" }; }
    }
    return { success: true };
  },

  async getMessages(): Promise<ContactMessage[]> {
    if (this.getMode() === 'LIVE') {
       try {
         const res = await fetch(`${API_CONFIG.BASE_URL}manage_messages.php?action=list`);
         const result = await safeJson(res);
         if (result?.messages) return result.messages.map((m: any) => ({ ...m, isRead: m.is_read == 1 }));
       } catch(e) {}
    }
    return [];
  },

  async getAccounts(): Promise<UserAccount[]> {
    if (this.getMode() === 'LIVE') {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}manage_users.php?action=list`);
        const result = await safeJson(res);
        if (result?.success && result.users) return result.users;
      } catch(e) {}
    }
    return JSON.parse(localStorage.getItem(API_CONFIG.GLOBAL_USERS_KEY) || '[]');
  },

  async updateUserProfile(userId: string, profile: any) {
    if (this.getMode() === 'LIVE') {
      const res = await fetch(`${API_CONFIG.BASE_URL}manage_users.php?action=update&id=${userId}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(profile) });
      return await safeJson(res);
    }
    const registry = JSON.parse(localStorage.getItem(API_CONFIG.GLOBAL_USERS_KEY) || '[]');
    const index = registry.findIndex((u: UserAccount) => u.id === userId);
    if (index > -1) {
      registry[index] = { ...registry[index], ...profile };
      localStorage.setItem(API_CONFIG.GLOBAL_USERS_KEY, JSON.stringify(registry));
    }
    return { success: true };
  },

  async sendInvite(studentId: string, invitation: ParentInvitation) {
    const studentData = await this.getStudentData(studentId);
    if (studentData) {
      const updatedData = {
        ...studentData,
        pendingInvitations: [...(studentData.pendingInvitations || []), invitation]
      };
      return await this.updateStudentData(studentId, updatedData);
    }
    return { success: false, error: "Student not found" };
  },

  async markMessageRead(messageId: string) {
    if (this.getMode() === 'LIVE') {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}manage_messages.php?action=read&id=${messageId}`);
        return await safeJson(res);
      } catch(e) { return { success: false, error: "Sync failed" }; }
    }
    return { success: true };
  },

  async saveRoutine(studentId: string, routine: RoutineConfig) {
    if (this.getMode() === 'LIVE') {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}manage_routine.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ student_id: studentId, routine })
        });
        return await safeJson(res);
      } catch(e) { return { success: false, error: "Sync failed" }; }
    }
    const studentData = await this.getStudentData(studentId);
    if (studentData) {
      studentData.routine = routine;
      localStorage.setItem(`jeepro_data_${studentId}`, JSON.stringify(studentData));
    }
    return { success: true };
  },

  async saveTimetable(studentId: string, timetable: { schedule: any[], roadmap: any[] }) {
    if (this.getMode() === 'LIVE') {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}manage_timetable.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ student_id: studentId, ...timetable })
        });
        return await safeJson(res);
      } catch(e) { return { success: false, error: "Sync failed" }; }
    }
    const studentData = await this.getStudentData(studentId);
    if (studentData) {
      studentData.smartPlan = { 
        ...(studentData.smartPlan || {}), 
        schedule: timetable.schedule, 
        roadmap: timetable.roadmap 
      };
      localStorage.setItem(`jeepro_data_${studentId}`, JSON.stringify(studentData));
    }
    return { success: true };
  },

  async resetProgress(studentId: string): Promise<StudentData> {
    if (this.getMode() === 'LIVE') await fetch(`${API_CONFIG.BASE_URL}sync_progress.php?action=reset&student_id=${studentId}`, { method: 'POST' });
    const cleanData = getZeroStateStudentData(studentId, 'Aspirant');
    localStorage.setItem(`jeepro_data_${studentId}`, JSON.stringify(cleanData));
    return cleanData;
  }
};
