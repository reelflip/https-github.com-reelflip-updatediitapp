
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

const DEMO_BYPASS_IDS = [
    '163110', 
    generateStableId('admin@demo.in'),
    generateStableId('parent@demo.in'),
    generateStableId('ishu@gmail.com')
];

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
  questions: INITIAL_STUDENT_DATA.questions || [],
  mockTests: INITIAL_STUDENT_DATA.mockTests || [],
  blogs: INITIAL_STUDENT_DATA.blogs || [],
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
        error: `CRITICAL: Path Error. The API route '${response.url}' returned HTTP ${response.status}. Ensure the 'api/' folder exists in your web root.` 
      };
    }
    const data = JSON.parse(text);
    if (data.error === "Core Handshake Failed") {
      return {
        success: false,
        error: "FATAL: Database Handshake Failed. Open 'api/database.php' and replace 'root' and empty password with your actual live database credentials from your hosting cPanel."
      };
    }
    return data;
  } catch (e) {
    if (text.includes('<!DOCTYPE html>') || text.includes('<html>')) {
      return { 
        success: false, 
        error: "CONFIG FAULT: The server returned an HTML error page instead of JSON. Ensure PHP is enabled on your host and the 'api/' folder contains the fresh PHP files." 
      };
    }
    return { success: false, error: "DATA FAULT: Handshake completed but returned corrupted stream." };
  }
};

export const api = {
  getMode: (): 'MOCK' | 'LIVE' => {
    const isLocal = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' || 
                    window.location.hostname.startsWith('192.168.');
    
    if (!isLocal) return 'LIVE';

    if (window.SOLARIS_CONFIG && window.SOLARIS_CONFIG.dataSourceMode) {
      return window.SOLARIS_CONFIG.dataSourceMode;
    }
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
        } catch(e) { return { success: false, error: "UPLINK FAILURE: Request timed out. Ensure the api/ folder is uploaded." }; }
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
      } catch(e) { return { success: false, error: "HANDSHAKE ERROR: Verify folder permissions on server." }; }
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
    const isDemo = DEMO_BYPASS_IDS.includes(studentId);

    if (this.getMode() === 'LIVE' && !isDemo) {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}get_dashboard.php?id=${studentId}`);
        const result = await safeJson(res);
        if (result?.success && result.data) {
            const serverData = result.data;
            const zeroState = getZeroStateStudentData(studentId, serverData.name || 'Aspirant');
            
            const serverProgress = serverData.individual_progress || [];
            const mergedChapters = zeroState.chapters.map(t => {
                const s = serverProgress.find((c: any) => c.id === t.id);
                if (s) {
                  return { 
                    ...t, 
                    ...s, 
                    progress: Number(s.progress || 0),
                    accuracy: Number(s.accuracy || 0),
                    timeSpent: Number(s.timeSpent || 0)
                  };
                }
                return t;
            });

            return {
                ...zeroState,
                ...serverData,
                chapters: mergedChapters,
                questions: zeroState.questions, // Never overwrite questions with null
                mockTests: zeroState.mockTests, // Never overwrite mockTests with null
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
    const isDemo = DEMO_BYPASS_IDS.includes(studentId);
    localStorage.setItem(`jeepro_data_${studentId}`, JSON.stringify(updatedData));
    
    if (this.getMode() === 'LIVE' && !isDemo) {
      try {
        const payload = { 
          student_id: studentId, 
          chapters: (updatedData.chapters || []).map(c => ({ 
            id: c.id, 
            progress: c.progress || 0, 
            accuracy: c.accuracy || 0, 
            status: c.status || 'NOT_STARTED', 
            timeSpent: c.timeSpent || 0
          })),
          testHistory: updatedData.testHistory || [],
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
      } catch(e) { return { success: false, error: "DATABASE SYNC FAILED" }; }
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
    const isDemo = DEMO_BYPASS_IDS.includes(userId);
    if (this.getMode() === 'LIVE' && !isDemo) {
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
      } catch(e) { return { success: false, error: "Handshake fail" }; }
    }
    return { success: true };
  },

  async saveRoutine(studentId: string, routine: RoutineConfig) {
    const isDemo = DEMO_BYPASS_IDS.includes(studentId);
    if (this.getMode() === 'LIVE' && !isDemo) {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}manage_routine.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ student_id: studentId, routine })
        });
        return await safeJson(res);
      } catch(e) { return { success: false, error: "HANDSHAKE ERROR" }; }
    }
    const studentData = await this.getStudentData(studentId);
    if (studentData) {
      studentData.routine = routine;
      localStorage.setItem(`jeepro_data_${studentId}`, JSON.stringify(studentData));
    }
    return { success: true };
  },

  async saveTimetable(studentId: string, timetable: { schedule: any[], roadmap: any[] }) {
    const isDemo = DEMO_BYPASS_IDS.includes(studentId);
    if (this.getMode() === 'LIVE' && !isDemo) {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}manage_timetable.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ student_id: studentId, ...timetable })
        });
        return await safeJson(res);
      } catch(e) { return { success: false, error: "HANDSHAKE ERROR" }; }
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
    const isDemo = DEMO_BYPASS_IDS.includes(studentId);
    if (this.getMode() === 'LIVE' && !isDemo) await fetch(`${API_CONFIG.BASE_URL}sync_progress.php?action=reset&student_id=${studentId}`, { method: 'POST' });
    const cleanData = getZeroStateStudentData(studentId, 'Aspirant');
    localStorage.setItem(`jeepro_data_${studentId}`, JSON.stringify(cleanData));
    return cleanData;
  }
};
