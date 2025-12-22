
import { StudentData, UserRole } from '../types';
import { INITIAL_STUDENT_DATA } from '../mockData';

const API_BASE = '/api'; // Adjust this to your Hostinger subfolder path

// Helper to determine if we should use mock data based on local app state
const isMockMode = () => {
  // In a real app, this would check a global state or a value in localStorage
  // For this implementation, we'll try to check a window variable set by AdminCMS
  return (window as any).DATA_SOURCE_MODE !== 'LIVE';
};

export const api = {
  async login(credentials: any) {
    if (isMockMode()) {
       return { success: true, user: { id: '163110', name: 'Aryan Sharma', role: 'STUDENT' } };
    }
    const res = await fetch(`${API_BASE}/auth_login.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return res.json();
  },

  async register(userData: any) {
    if (isMockMode()) return { success: true };
    const res = await fetch(`${API_BASE}/auth_register.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return res.json();
  },

  async getStudentData(userId: string) {
    if (isMockMode()) return INITIAL_STUDENT_DATA;
    const res = await fetch(`${API_BASE}/get_student_data.php?userId=${userId}`);
    return res.json();
  },

  async updateChapterProgress(userId: string, chapterId: string, progress: number, accuracy: number) {
    if (isMockMode()) return Promise.resolve({ ok: true });
    return fetch(`${API_BASE}/update_progress.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, chapterId, progress, accuracy })
    });
  },

  async saveRoutine(userId: string, routine: any) {
    if (isMockMode()) return Promise.resolve({ ok: true });
    return fetch(`${API_BASE}/save_routine.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, ...routine })
    });
  }
};
