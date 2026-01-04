
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
      return { success: false, error: `HTTP ${response.status}: Ensure the 'api/' folder is uploaded correctly.` };
    }
    return JSON.parse(text);
  } catch (e) {
    return { success: false, error: "DATA ERROR: The server returned an invalid response. Run the SQL Patch." };
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
    if (this.getMode() === 'LIVE' && !DEMO_BYPASS_IDS.includes(generateStableId(email))) {
        try {
          const res = await fetch(`${API_CONFIG.BASE_URL}auth_login.php`, {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
          });
          return await safeJson(res);
        } catch(e) { return { success: false, error: "UPLINK FAILURE" }; }
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

  async getStudentData(studentId: string): Promise<StudentData> {
    if (this.getMode() === 'LIVE' && !DEMO_BYPASS_IDS.includes(studentId)) {
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
                    progress: Number(s.progress || 0),
                    accuracy: Number(s.accuracy || 0),
                    status: s.status || 'NOT_STARTED',
                    timeSpent: Number(s.timeSpent || 0),
                    timeSpentNotes: Number(s.timeSpentNotes || 0),
                    timeSpentVideos: Number(s.timeSpentVideos || 0),
                    timeSpentPractice: Number(s.timeSpentPractice || 0),
                    timeSpentTests: Number(s.timeSpentTests || 0)
                  };
                }
                return t;
            });

            return {
                ...zeroState,
                ...serverData,
                chapters: mergedChapters,
                testHistory: (serverData.testHistory || []).map((t: any) => ({
                    ...t,
                    score: Number(t.score),
                    totalMarks: Number(t.totalMarks),
                    accuracy: Number(t.accuracy)
                })),
                routine: serverData.routine || undefined,
                smartPlan: serverData.smartPlan || undefined
            };
        }
      } catch(e) { console.error("Sync Error", e); }
    }
    const cached = localStorage.getItem(`jeepro_data_${studentId}`);
    return cached ? JSON.parse(cached) : getZeroStateStudentData(studentId, 'Aspirant');
  },

  async updateStudentData(studentId: string, updatedData: StudentData) {
    localStorage.setItem(`jeepro_data_${studentId}`, JSON.stringify(updatedData));
    
    if (this.getMode() === 'LIVE' && !DEMO_BYPASS_IDS.includes(studentId)) {
      try {
        const payload = { 
          student_id: studentId, 
          chapters: (updatedData.chapters || []).map(c => ({ 
            id: c.id, 
            progress: c.progress || 0, 
            accuracy: c.accuracy || 0, 
            status: c.status || 'NOT_STARTED', 
            timeSpent: c.timeSpent || 0,
            timeSpentNotes: c.timeSpentNotes || 0,
            timeSpentVideos: c.timeSpentVideos || 0,
            timeSpentPractice: c.timeSpentPractice || 0,
            timeSpentTests: c.timeSpentTests || 0
          })),
          testHistory: (updatedData.testHistory || []).map(t => ({
             testId: t.testId,
             testName: t.testName,
             score: t.score,
             totalMarks: t.totalMarks,
             accuracy: t.accuracy,
             category: t.category,
             chapterIds: t.chapterIds || [],
             date: String(t.date) 
          })),
          routine: updatedData.routine || null,
          smartPlan: updatedData.smartPlan || null,
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

  async register(data: any) {
    if (this.getMode() === 'LIVE') {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}auth_register.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        return await safeJson(res);
      } catch(e) { return { success: false, error: "HANDSHAKE ERROR" }; }
    }
    const id = generateStableId(data.email);
    const newUser = { ...data, id, createdAt: new Date().toISOString() };
    const registry = JSON.parse(localStorage.getItem(API_CONFIG.GLOBAL_USERS_KEY) || '[]');
    registry.push(newUser);
    localStorage.setItem(API_CONFIG.GLOBAL_USERS_KEY, JSON.stringify(registry));
    localStorage.setItem(`jeepro_data_${id}`, JSON.stringify(getZeroStateStudentData(id, data.name)));
    return { success: true, user: newUser };
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
      } catch(e) { return { success: false, error: "SYNC FAILED" }; }
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

  async searchStudent(query: string): Promise<UserAccount | null> {
    const accounts = await this.getAccounts();
    return accounts.find(u => (u.id === query || u.name.toLowerCase().includes(query.toLowerCase())) && u.role === UserRole.STUDENT) || null;
  },

  async sendInvite(studentId: string, invitation: ParentInvitation) {
    const studentData = await this.getStudentData(studentId);
    if (studentData) {
      const updatedData: StudentData = {
        ...studentData,
        pendingInvitations: [...(studentData.pendingInvitations || []), invitation]
      };
      return await this.updateStudentData(studentId, updatedData);
    }
    return { success: false, error: "Student not found" };
  },

  async updateUserProfile(userId: string, profile: any) {
    if (this.getMode() === 'LIVE' && !DEMO_BYPASS_IDS.includes(userId)) {
      const res = await fetch(`${API_CONFIG.BASE_URL}manage_users.php?action=update&id=${userId}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(profile) });
      return await safeJson(res);
    }
    return { success: true };
  },

  async saveRoutine(studentId: string, routine: RoutineConfig) {
    const data = await this.getStudentData(studentId);
    if (data) {
      data.routine = routine;
      return await this.updateStudentData(studentId, data);
    }
    return { success: false };
  },

  async saveTimetable(studentId: string, timetable: { schedule: any[], roadmap: any[] }) {
    const data = await this.getStudentData(studentId);
    if (data) {
      data.smartPlan = { ...data.smartPlan, schedule: timetable.schedule, roadmap: timetable.roadmap };
      return await this.updateStudentData(studentId, data);
    }
    return { success: false };
  },

  async markMessageRead(messageId: string) {
    if (this.getMode() === 'LIVE') {
      await fetch(`${API_CONFIG.BASE_URL}manage_messages.php?action=read&id=${messageId}`);
    }
    return { success: true };
  },

  async resetProgress(studentId: string): Promise<StudentData> {
    if (this.getMode() === 'LIVE' && !DEMO_BYPASS_IDS.includes(studentId)) {
        await fetch(`${API_CONFIG.BASE_URL}sync_progress.php?action=reset&student_id=${studentId}`, { method: 'POST' });
    }
    const clean = getZeroStateStudentData(studentId, 'Aspirant');
    localStorage.setItem(`jeepro_data_${studentId}`, JSON.stringify(clean));
    return clean;
  }
};
