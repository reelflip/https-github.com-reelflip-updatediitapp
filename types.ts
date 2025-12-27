export enum UserRole {
  STUDENT = 'STUDENT',
  PARENT = 'PARENT',
  ADMIN = 'ADMIN'
}

export type Subject = 'Physics' | 'Chemistry' | 'Mathematics';

export type ChapterStatus = 'NOT_STARTED' | 'LEARNING' | 'REVISION' | 'COMPLETED';

export interface RoutineConfig {
  wakeUp: string;
  sleep: string;
  schoolStart: string;
  schoolEnd: string;
  coachingStart: string;
  coachingEnd: string;
}

export interface Chapter {
  id: string;
  subject: Subject;
  unit: string;
  name: string;
  progress: number; 
  accuracy: number;
  timeSpent: number; // Total cumulative
  timeSpentNotes: number; // Time in seconds
  timeSpentVideos: number; // Time in seconds
  timeSpentPractice: number; // Time in seconds
  timeSpentTests: number; // Time in seconds
  status: ChapterStatus;
  lastStudied?: string;
  notes?: string; // Changed to string for easier CMS editing
  videoUrl?: string;
  targetCompletionDate?: string; // New field for roadmap planning
}

export interface BacklogItem {
  id: string;
  title: string;
  subject: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'PENDING' | 'COMPLETED';
  deadline: string;
  createdAt: string;
}

export interface Question {
  id: string;
  topicId: string;
  subject: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  source?: string;
}

export interface MockTest {
  id: string;
  name: string;
  duration: number;
  totalMarks: number;
  category: string;
  difficulty: string;
  questionIds: string[];
  chapterIds: string[];
}

export interface TestResult {
  testId: string;
  testName: string;
  score: number;
  totalMarks: number;
  date: string;
  chapterIds: string[];
  accuracy: number;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  subject: Subject;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  type: string;
}

export interface MemoryHack {
  id: string;
  title: string;
  description: string;
  hack: string;
  category: string;
  subject: Subject;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  status: 'DRAFT' | 'PUBLISHED';
  coverImage?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  isRead: boolean;
}

export interface PsychometricScore {
  stress: number;
  focus: number;
  motivation: number;
  examFear: number;
  timestamp: string;
  studentSummary?: string;
  parentAdvice?: string;
}

export interface StudentData {
  id: string;
  name: string;
  email?: string;
  chapters: Chapter[];
  backlogs: BacklogItem[];
  flashcards: Flashcard[];
  memoryHacks: MemoryHack[];
  questions: Question[];
  mockTests: MockTest[];
  blogs: Blog[];
  messages: ContactMessage[];
  psychometricHistory: PsychometricScore[];
  testHistory: TestResult[];
  timeSummary: {
    notes: number;
    videos: number;
    practice: number;
    tests: number;
  };
  routine?: RoutineConfig;
  targetExamDate?: string;
  targetYear?: string;
  coachingName?: string;
  schoolName?: string;
  targetExams?: string[];
  aiTutorModel?: string;
  dataSourceMode?: 'MOCK' | 'LIVE';
  smartPlan?: any;
  oauthClientId?: string;
  analyticsId?: string;
  connectedParent?: {
    name: string;
    id: string;
    linkedSince: string;
  };
  // Detailed Profile Fields
  institute?: string;
  targetExam?: string;
  birthDate?: string;
  gender?: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
  createdAt: string;
  connectedId?: string; 
  // Detailed Profile Fields
  institute?: string;
  targetExam?: string;
  targetYear?: string;
  birthDate?: string;
  gender?: string;
}

export interface SystemEvent {
  id: string;
  timestamp: string;
  type: 'AUTH' | 'ACADEMIC' | 'WELLNESS' | 'ADMIN';
  description: string;
  user: string;
  status: 'SUCCESS' | 'FAILURE';
}