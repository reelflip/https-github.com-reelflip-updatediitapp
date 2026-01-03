
import { StudentData, UserRole, UserAccount, RoutineConfig, TestResult, Chapter, PsychometricScore, ContactMessage, ParentInvitation } from '../types';
import { INITIAL_STUDENT_DATA } from '../mockData';

const API_CONFIG = {
  BASE_URL: './api/', 
  MODE_KEY: 'jeepro_datasource_mode_v10_final'
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
  if (!response.ok) return { success: false, error: `Server Fault (${response.status})` };
  try {
    return JSON.parse(text);
  } catch (e) {
    return { success: false, error: "Malformed API Response" };
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
        } catch(e) { return { success: false, error: "Authentication node offline." }; }
    }

    let determinedRole = UserRole.STUDENT;
    if (email === 'admin@demo.in') determinedRole = UserRole.ADMIN;
    else if (email === 'parent@demo.in') determinedRole = UserRole.PARENT;

    return { 
      success: true, 
      user: { 
        id: generateStableId(email), 
        name: email.split('@')[0], 
        email: email, 
        role: determinedRole, 
        createdAt: new Date().toISOString() 
      } 
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
      } catch(e) { return { success: false, error: "Registration Node Offline." }; }
    }
    const id = generateStableId(data.email);
    const newUser = { ...data, id, createdAt: new Date().toISOString() };
    localStorage.setItem(`jeepro_data_${id}`, JSON.stringify(getZeroStateStudentData(id, data.name)));
    return { success: true, user: newUser };
  },

  async getStudentData(studentId: string): Promise<StudentData> {
    const mode = this.getMode();

    if (mode === 'LIVE') {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}get_dashboard.php?id=${studentId}`);
        const result = await safeJson(res);
        if (result && result.success && result.data) {
            const serverData = result.data;
            const templateChapters = getZeroStateChapters();
            
            const mergedChapters = templateChapters.map(templateCh => {
                const serverCh = serverData.individual_progress?.find((c: any) => c.id === templateCh.id);
                return serverCh ? { ...templateCh, ...serverCh } : templateCh;
            });
            
            const mappedMessages = (serverData.messages || []).map((m: any) => ({
              ...m,
              isRead: m.is_read === 1 || m.is_read === "1" || !!m.is_read
            }));

            return {
                ...getZeroStateStudentData(studentId, serverData.name || 'Aspirant'),
                ...serverData,
                chapters: mergedChapters,
                messages: mappedMessages,
                testHistory: serverData.testHistory || [],
                connectedParent: serverData.connectedParent || null,
                pendingInvitations: serverData.pendingInvitations || []
            };
        }
      } catch(e) { console.error("Live sync failed."); }
    }
    const cached = localStorage.getItem(`jeepro_data_${studentId}`);
    return cached ? JSON.parse(cached) : getZeroStateStudentData(studentId, 'New Aspirant');
  },

  async searchStudent(query: string): Promise<UserAccount | null> {
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (key.startsWith('jeepro_data_')) {
        const data = JSON.parse(localStorage.getItem(key) || '{}');
        if (data.id === query || data.name?.toLowerCase().includes(query.toLowerCase())) {
          return {
            id: data.id,
            name: data.name,
            email: data.email || 'hidden@aspirant.edu',
            role: UserRole.STUDENT,
            createdAt: ''
          };
        }
      }
    }
    if (query === '163110' || query.toLowerCase() === 'aryan') {
      return { id: '163110', name: 'Aryan Sharma', email: 'ishu@gmail.com', role: UserRole.STUDENT, createdAt: '2025-01-01' };
    }
    return null;
  },

  async sendInvite(studentId: string, invite: ParentInvitation) {
    const studentData = await this.getStudentData(studentId);
    studentData.pendingInvitations = [...(studentData.pendingInvitations || []), invite];
    await this.updateStudentData(studentId, studentData);
    return { success: true };
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
              id: c.id, progress: c.progress, accuracy: c.accuracy, status: c.status, timeSpent: c.timeSpent
            })),
            testHistory: updatedData.testHistory,
            connectedParent: updatedData.connectedParent || null,
            pendingInvitations: updatedData.pendingInvitations || []
          })
        });
      } catch(e) {}
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

  async markMessageRead(id: string) {
    if (this.getMode() === 'LIVE') {
      await fetch(`${API_CONFIG.BASE_URL}manage_messages.php?action=read&id=${id}`);
    }
    return { success: true };
  },

  async getAccounts(): Promise<UserAccount[]> {
    if (this.getMode() === 'LIVE') {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}manage_users.php`);
        const result = await safeJson(res);
        if (result?.users) return result.users;
      } catch(e) {}
    }
    return [];
  },

  async saveRoutine(studentId: string, routine: RoutineConfig) {
    if (this.getMode() === 'LIVE') {
      await fetch(`${API_CONFIG.BASE_URL}manage_routine.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId, routine })
      });
    }
    return { success: true };
  },

  async saveTimetable(studentId: string, timetable: any) {
    if (this.getMode() === 'LIVE') {
      await fetch(`${API_CONFIG.BASE_URL}manage_timetable.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId, ...timetable })
      });
    }
    return { success: true };
  },

  async updateUserProfile(userId: string, profile: any) {
    if (this.getMode() === 'LIVE') {
      const res = await fetch(`${API_CONFIG.BASE_URL}manage_users.php?action=update&id=${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      return await safeJson(res);
    }
    return { success: true };
  },

  async resetProgress(studentId: string): Promise<StudentData> {
    if (this.getMode() === 'LIVE') {
        await fetch(`${API_CONFIG.BASE_URL}sync_progress.php?action=reset&student_id=${studentId}`, { method: 'POST' });
    }
    const cleanData = getZeroStateStudentData(studentId, 'Aspirant');
    localStorage.setItem(`jeepro_data_${studentId}`, JSON.stringify(cleanData));
    return cleanData;
  }
};
