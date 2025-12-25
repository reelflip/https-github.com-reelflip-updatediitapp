
import { StudentData, UserRole, UserAccount, Chapter, TestResult, BacklogItem } from '../types';
import { INITIAL_STUDENT_DATA } from '../mockData';

const API_CONFIG = {
  BASE_URL: '/api/router.php',
  MODE_KEY: 'jeepro_datasource_mode'
};

export const api = {
  getMode: (): 'MOCK' | 'LIVE' => (localStorage.getItem(API_CONFIG.MODE_KEY) as 'MOCK' | 'LIVE') || 'MOCK',
  setMode: (mode: 'MOCK' | 'LIVE') => { localStorage.setItem(API_CONFIG.MODE_KEY, mode); window.location.reload(); },
  isDemoDisabled: (): boolean => false,

  async login(credentials: { email: string; role: UserRole }) {
    if (this.getMode() === 'LIVE') {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}?module=auth&action=login`, {
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials)
        });
        return await res.json();
      } catch(e) { return { success: false, error: 'PHP Server Offline' }; }
    }
    // Mock for development
    if (credentials.email === 'ishu@gmail.com') return { success: true, user: { id: '163110', name: 'Aryan Sharma', email: 'ishu@gmail.com', role: UserRole.STUDENT, createdAt: '' } };
    if (credentials.email === 'admin@jeepro.in') return { success: true, user: { id: 'ADMIN-001', name: 'System Admin', email: 'admin@jeepro.in', role: UserRole.ADMIN, createdAt: '' } };
    return { success: false, error: 'User not found in Mock DB' };
  },

  // Fixed: Added register method to resolve the error in LoginModule
  async register(data: { name: string; email: string; role: UserRole }) {
    if (this.getMode() === 'LIVE') {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}?module=auth&action=register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        return await res.json();
      } catch(e) { return { success: false, error: 'PHP Server Offline' }; }
    }
    // Mock register
    return { success: true, user: { id: `S-${Date.now()}`, name: data.name, email: data.email, role: data.role, createdAt: new Date().toISOString() } };
  },

  async getStudentData(studentId: string): Promise<StudentData> {
    if (this.getMode() === 'LIVE') {
      try {
        const [syllabusRes, backlogsRes, wellnessRes, resultsRes] = await Promise.all([
          fetch(`${API_CONFIG.BASE_URL}?module=syllabus&action=get&student_id=${studentId}`),
          fetch(`${API_CONFIG.BASE_URL}?module=academic&action=get_backlogs&student_id=${studentId}`),
          fetch(`${API_CONFIG.BASE_URL}?module=wellness&student_id=${studentId}`),
          fetch(`${API_CONFIG.BASE_URL}?module=academic&action=get_results&student_id=${studentId}`)
        ]);

        const syllabus = await syllabusRes.json();
        const backlogs = await backlogsRes.json();
        const wellness = await wellnessRes.json();
        const results = await resultsRes.json();
        
        // Merge DB data with Static Content (notes/videos) from mockData
        const mergedChapters = INITIAL_STUDENT_DATA.chapters.map(staticCh => {
           const dbCh = syllabus.chapters?.find((c: any) => c.id === staticCh.id);
           if (dbCh) {
               return {
                   ...staticCh,
                   progress: Number(dbCh.progress),
                   accuracy: Number(dbCh.accuracy),
                   timeSpent: Number(dbCh.time_spent),
                   status: dbCh.status
               };
           }
           return staticCh;
        });

        return {
          ...INITIAL_STUDENT_DATA,
          id: studentId,
          chapters: mergedChapters,
          backlogs: Array.isArray(backlogs) ? backlogs : INITIAL_STUDENT_DATA.backlogs,
          testHistory: Array.isArray(results) ? results : INITIAL_STUDENT_DATA.testHistory,
          psychometricHistory: Array.isArray(wellness) ? wellness.map((w: any) => ({
            stress: Number(w.stress), focus: Number(w.focus), motivation: Number(w.motivation), 
            examFear: Number(w.exam_fear), timestamp: w.timestamp, studentSummary: w.student_summary, 
            parentAdvice: w.parent_advice
          })) : INITIAL_STUDENT_DATA.psychometricHistory
        };
      } catch(e) { return INITIAL_STUDENT_DATA; }
    }
    return INITIAL_STUDENT_DATA;
  },

  async updateStudentData(studentId: string, updatedData: StudentData) {
    if (this.getMode() === 'LIVE') {
      try {
        // Sync Chapters and Backlogs to DB
        await Promise.all([
          fetch(`${API_CONFIG.BASE_URL}?module=syllabus&action=batch_sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ student_id: studentId, chapters: updatedData.chapters })
          }),
          fetch(`${API_CONFIG.BASE_URL}?module=academic&action=sync_backlogs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ student_id: studentId, backlogs: updatedData.backlogs })
          })
        ]);
        return { success: true };
      } catch(e) { return { success: false, error: 'Sync failed' }; }
    }
    return { success: true };
  },

  async getAccounts(): Promise<UserAccount[]> {
     if (this.getMode() === 'LIVE') {
       const res = await fetch(`${API_CONFIG.BASE_URL}?module=admin`);
       return await res.json();
     }
     return [{ id: '163110', name: 'Aryan Sharma', email: 'ishu@gmail.com', role: UserRole.STUDENT, createdAt: '2024-01-01' }];
  }
};
