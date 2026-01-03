
import { StudentData, UserRole, UserAccount, RoutineConfig, TestResult, Chapter, PsychometricScore, ContactMessage, ParentInvitation } from '../types';
import { INITIAL_STUDENT_DATA } from '../mockData';

const API_CONFIG = {
  BASE_URL: './api/', 
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
      } catch(e) { return { success: false, error: "Registration Node Offline." }; }
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
                return s ? { ...t, ...s } : t;
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
      } catch(e) {}
    }
    const cached = localStorage.getItem(`jeepro_data_${studentId}`);
    return cached ? JSON.parse(cached) : getZeroStateStudentData(studentId, 'Aspirant');
  },

  async searchStudent(query: string): Promise<UserAccount | null> {
    const q = query.toLowerCase();
    
    // LIVE SERVER MODE: Real-time Database Search
    if (this.getMode() === 'LIVE') {
        try {
            const res = await fetch(`${API_CONFIG.BASE_URL}manage_users.php?action=search&query=${encodeURIComponent(q)}&role=STUDENT`);
            const result = await safeJson(res);
            if (result?.success && result.users && result.users.length > 0) {
                return result.users[0]; // Return the most relevant match
            }
        } catch(e) { console.error("Database search failed"); }
    }
    
    // MOCK MODE FALLBACK
    const registry = JSON.parse(localStorage.getItem(API_CONFIG.GLOBAL_USERS_KEY) || '[]');
    const student = registry.find((u: UserAccount) => 
      u.role === UserRole.STUDENT && 
      (u.id.toLowerCase() === q || u.name.toLowerCase().includes(q) || u.email.toLowerCase() === q)
    );
    if (student) return student;

    if (q === '163110' || q === 'aryan') return { id: '163110', name: 'Aryan Sharma', email: 'ishu@gmail.com', role: UserRole.STUDENT, createdAt: '2025-01-01' };
    
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
            chapters: updatedData.chapters.map(c => ({ id: c.id, progress: c.progress, accuracy: c.accuracy, status: c.status, timeSpent: c.timeSpent })),
            testHistory: updatedData.testHistory,
            connectedParent: updatedData.connectedParent || null,
            pendingInvitations: updatedData.pendingInvitations || []
          })
        });
      } catch(e) {}
    }
    return { success: true };
  },

  async getAccounts(): Promise<UserAccount[]> {
    // LIVE SERVER MODE: Fetch full user list from MySQL
    if (this.getMode() === 'LIVE') {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}manage_users.php?action=list`);
        const result = await safeJson(res);
        if (result?.success && result.users) return result.users;
      } catch(e) { console.error("Database fetch failed"); }
    }
    
    // MOCK MODE FALLBACK
    const registry = JSON.parse(localStorage.getItem(API_CONFIG.GLOBAL_USERS_KEY) || '[]');
    const demoAccounts = [
      { id: 'USER-ADMIN', name: 'Admin', email: 'admin@demo.in', role: UserRole.ADMIN, createdAt: '2025-01-01' },
      { id: 'USER-PARENT', name: 'Parent', email: 'parent@demo.in', role: UserRole.PARENT, createdAt: '2025-01-01' },
      { id: '163110', name: 'Aryan Sharma', email: 'ishu@gmail.com', role: UserRole.STUDENT, createdAt: '2025-01-01' }
    ];
    
    const combined = [...registry];
    demoAccounts.forEach(demo => { if (!combined.some(u => u.email.toLowerCase() === demo.email.toLowerCase())) combined.push(demo); });
    return combined;
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
    if (this.getMode() === 'LIVE') await fetch(`${API_CONFIG.BASE_URL}manage_messages.php?action=read&id=${id}`);
    return { success: true };
  },

  async saveRoutine(studentId: string, routine: RoutineConfig) {
    if (this.getMode() === 'LIVE') await fetch(`${API_CONFIG.BASE_URL}manage_routine.php`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ student_id: studentId, routine }) });
    return { success: true };
  },

  async saveTimetable(studentId: string, timetable: any) {
    if (this.getMode() === 'LIVE') await fetch(`${API_CONFIG.BASE_URL}manage_timetable.php`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ student_id: studentId, ...timetable }) });
    return { success: true };
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

  async resetProgress(studentId: string): Promise<StudentData> {
    if (this.getMode() === 'LIVE') await fetch(`${API_CONFIG.BASE_URL}sync_progress.php?action=reset&student_id=${studentId}`, { method: 'POST' });
    const cleanData = getZeroStateStudentData(studentId, 'Aspirant');
    localStorage.setItem(`jeepro_data_${studentId}`, JSON.stringify(cleanData));
    return cleanData;
  }
};
