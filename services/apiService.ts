
import { StudentData, UserRole, UserAccount, RoutineConfig, TestResult, Chapter, PsychometricScore, ContactMessage } from '../types';
import { INITIAL_STUDENT_DATA } from '../mockData';

const API_CONFIG = {
  BASE_URL: './api/', 
  MODE_KEY: 'jeepro_datasource_mode_v10_final'
};

// --- HELPER: Stable ID Generator for Mock Mode ---
const generateStableId = (email: string) => 'USER-' + btoa(email.toLowerCase()).substring(0, 10);

// --- TEMPLATE GENERATORS ---

/**
 * Creates a strictly clean, 0% progress version of the syllabus.
 */
const getCleanChapters = (): Chapter[] => {
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

const getCleanStudentData = (id: string, name: string): StudentData => ({
  ...INITIAL_STUDENT_DATA,
  id,
  name,
  chapters: getCleanChapters(),
  flashcards: INITIAL_STUDENT_DATA.flashcards || [],
  memoryHacks: INITIAL_STUDENT_DATA.memoryHacks || [],
  testHistory: [],
  psychometricHistory: [],
  backlogs: [],
  pendingInvitations: [],
  timeSummary: { notes: 0, videos: 0, practice: 0, tests: 0 },
  smartPlan: undefined,
  routine: undefined
});

const DEMO_ACCOUNTS: Record<string, UserAccount> = {
  'ishu@gmail.com': { id: '163110', name: 'Aryan Sharma', email: 'ishu@gmail.com', role: UserRole.STUDENT, createdAt: '2025-01-01' },
  'parent@demo.in': { id: 'P-4402', name: 'Mr. Ramesh Sharma', email: 'parent@demo.in', role: UserRole.PARENT, createdAt: '2025-01-01' },
  'admin@demo.in': { id: 'ADMIN-001', name: 'System Admin', email: 'admin@demo.in', role: UserRole.ADMIN, createdAt: '2025-01-01' }
};

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
  getMode: (): 'MOCK' | 'LIVE' => (localStorage.getItem(API_CONFIG.MODE_KEY) as 'MOCK' | 'LIVE') || 'MOCK',
  
  setMode: (mode: 'MOCK' | 'LIVE') => { 
    localStorage.setItem(API_CONFIG.MODE_KEY, mode); 
    window.location.reload(); 
  },

  async login(credentials: { email: string; password?: string; role?: UserRole }) {
    const email = credentials.email.toLowerCase();
    if (DEMO_ACCOUNTS[email]) return { success: true, user: DEMO_ACCOUNTS[email] };

    if (this.getMode() === 'MOCK') {
      return { 
        success: true, 
        user: { 
          id: generateStableId(email), 
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
    } catch(e) { return { success: false, error: "Authentication node offline." }; }
  },

  async register(data: any) {
    if (this.getMode() === 'MOCK') {
      const id = generateStableId(data.email);
      const newUser = { ...data, id, createdAt: new Date().toISOString() };
      localStorage.setItem(`jeepro_data_${id}`, JSON.stringify(getCleanStudentData(id, data.name)));
      return { success: true, user: newUser };
    }
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
    const localKey = `jeepro_data_${studentId}`;
    const mode = this.getMode();

    // 1. In LIVE mode, ALWAYS try fetching from server first to get new messages/syncs
    if (mode === 'LIVE') {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}get_dashboard.php?id=${studentId}`);
        const result = await safeJson(res);
        if (result && result.success && result.data) {
            const serverData = result.data;
            const templateChapters = getCleanChapters();
            const mergedChapters = templateChapters.map(templateCh => {
                const serverCh = serverData.chapters?.find((c: any) => c.id === templateCh.id);
                return serverCh ? { ...templateCh, ...serverCh } : templateCh;
            });
            
            // Map messages read status from SQL 0/1 to Boolean
            const mappedMessages = (serverData.messages || []).map((m: any) => ({
              ...m,
              isRead: m.is_read === 1 || m.is_read === "1" || !!m.is_read
            }));

            const finalData: StudentData = {
                ...getCleanStudentData(studentId, 'Aspirant'),
                ...serverData,
                chapters: mergedChapters,
                messages: mappedMessages,
                flashcards: (serverData.flashcards && serverData.flashcards.length > 0) ? serverData.flashcards : INITIAL_STUDENT_DATA.flashcards,
                memoryHacks: (serverData.memoryHacks && serverData.memoryHacks.length > 0) ? serverData.memoryHacks : INITIAL_STUDENT_DATA.memoryHacks,
                mockTests: (serverData.mockTests && serverData.mockTests.length > 0) ? serverData.mockTests : INITIAL_STUDENT_DATA.mockTests,
                questions: (serverData.questions && serverData.questions.length > 0) ? serverData.questions : INITIAL_STUDENT_DATA.questions,
                testHistory: serverData.testHistory || []
            };
            localStorage.setItem(localKey, JSON.stringify(finalData));
            return finalData;
        }
      } catch(e) {
        console.warn("Live fetch failed, falling back to local state.");
      }
    }

    // 2. Fallback to cache if offline or in MOCK mode
    const cached = localStorage.getItem(localKey);
    if (cached) {
        try { 
            const parsed = JSON.parse(cached);
            if (parsed && parsed.chapters && parsed.chapters.length > 0) {
                return parsed; 
            }
        } catch(e) {}
    }

    return studentId === '163110' 
      ? INITIAL_STUDENT_DATA 
      : getCleanStudentData(studentId, 'New Aspirant');
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
            backlogs: updatedData.backlogs,
            testHistory: updatedData.testHistory,
            psychometric: updatedData.psychometricHistory[updatedData.psychometricHistory.length -1]
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
         if (result && result.messages) {
            return result.messages.map((m: any) => ({
              ...m,
              isRead: m.is_read === 1 || m.is_read === "1" || !!m.is_read
            }));
         }
       } catch(e) {}
    }
    return [];
  },

  async markMessageRead(id: string) {
    if (this.getMode() === 'LIVE') {
      try {
        await fetch(`${API_CONFIG.BASE_URL}manage_messages.php?action=read&id=${id}`);
      } catch(e) {}
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
