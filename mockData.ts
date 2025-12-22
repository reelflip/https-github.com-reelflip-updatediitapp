
import { StudentData, UserRole } from './types';

export const INITIAL_STUDENT_DATA: StudentData = {
  id: '163110',
  name: 'Aryan Sharma',
  email: 'ishu@gmail.com',
  timeSummary: { notes: 1200, videos: 800, practice: 1500, tests: 600 },
  psychometricHistory: [
    { stress: 4, focus: 8, motivation: 9, examFear: 3, timestamp: '2025-12-18' }
  ],
  testHistory: [
    { testId: 'test_jee_main_1', testName: 'JEE Main 2024 - Full Mock 1', score: 242, totalMarks: 300, date: '2025-12-10', chapterIds: ['p-units'], accuracy: 82 }
  ],
  backlogs: [
    { id: 'bl_1', title: 'Circular Motion Practice', subject: 'Physics', priority: 'High', status: 'PENDING', deadline: '2025-01-01', createdAt: '2025-12-15' },
    { id: 'bl_2', title: 'Organic Nomenclature', subject: 'Chemistry', priority: 'Medium', status: 'PENDING', deadline: '2025-01-05', createdAt: '2025-12-16' }
  ],
  flashcards: [
    { id: '1', question: "Newton's Second Law", answer: "F = ma", subject: 'Physics', difficulty: 'EASY', type: 'Formula' },
    { id: '11', question: "Ideal Gas Equation", answer: "PV = nRT", subject: 'Chemistry', difficulty: 'EASY', type: 'Concept' }
  ],
  memoryHacks: [
    { id: '1', title: "Trigonometry Ratios", description: "Sine, Cosine, Tangent", hack: "SOH CAH TOA", category: "Mnemonics", subject: "Mathematics" },
    { id: '3', title: "Redox Reactions", description: "Oxidation vs Reduction", hack: "OIL RIG", category: "Mnemonics", subject: "Chemistry" }
  ],
  blogs: [
    { id: 'b1', title: "10 Tips for JEE Advanced", content: "<p>Start early and focus on concepts...</p>", author: "Admin", date: "2024-12-20", status: "PUBLISHED" }
  ],
  messages: [
    { id: 'm1', name: "Rahul Gupta", email: "rahul@test.com", subject: "Access Issue", message: "Hi, I cannot access the Physics notes.", date: "2024-12-21", isRead: false }
  ],
  mockTests: [
    { 
      id: 'test_jee_main_1', 
      name: 'JEE Main 2024 - Full Mock 1', 
      duration: 180, 
      totalMarks: 300, 
      category: 'ADMIN', 
      difficulty: 'MAINS', 
      questionIds: ['q_p_units_1', 'q_p_units_2', 'q_p_units_3'],
      chapterIds: ['p-units'] 
    }
  ],
  questions: [
    { 
      id: 'q_p_units_1', 
      topicId: 'p-units', 
      subject: 'Physics', 
      text: "Dimensional formula of Planck's Constant is:", 
      options: ["[ML²T⁻¹]", "[ML²T⁻²]", "[MLT⁻¹]", "[MLT⁻²]"], 
      correctAnswer: 0, 
      explanation: "Planck's constant (h) = Energy / Frequency. [ML²T⁻²] / [T⁻¹] = [ML²T⁻¹].",
      difficulty: 'EASY' 
    },
    { 
      id: 'q_p_units_2', 
      topicId: 'p-units', 
      subject: 'Physics', 
      text: "Which of the following is not a fundamental SI unit?", 
      options: ["Meter", "Candela", "Newton", "Kelvin"], 
      correctAnswer: 2, 
      explanation: "Newton is a derived unit (kg⋅m/s²). The 7 fundamental units are m, kg, s, A, K, mol, cd.",
      difficulty: 'EASY' 
    }
  ],
  chapters: [
    { id: 'p-units', subject: 'Physics', unit: 'Units and Measurements', name: 'Units & Dimensions', progress: 100, accuracy: 95, timeSpent: 200, status: 'COMPLETED', notes: ["<h1>1. Fundamental & Derived Quantities</h1><p>Physics explains nature through measurement.</p>"] },
    { id: 'c-basic', subject: 'Chemistry', unit: 'Physical Chemistry', name: 'Some Basic Concepts', progress: 100, accuracy: 92, timeSpent: 300, status: 'COMPLETED' },
    { id: 'm-sets', subject: 'Mathematics', unit: 'Sets & Relations', name: 'Sets, Relations & Functions', progress: 90, accuracy: 85, timeSpent: 600, status: 'LEARNING' },
  ],
  oauthClientId: '',
  analyticsId: ''
};
