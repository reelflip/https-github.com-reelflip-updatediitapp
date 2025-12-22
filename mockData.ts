
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
    { 
      id: 'b1', 
      title: "Mastering the Forgetting Curve for JEE 2025", 
      content: `
        <p>Start early and focus on concepts. The biggest challenge for JEE aspirants is not learning, but <strong>retaining</strong>. Every time you learn a formula, your brain begins to lose it within 24 hours.</p>
        <h2>The Science of Recall</h2>
        <p>Active recall and spaced repetition are your best friends. JEE-PRO's automated flashcard system uses these principles to ensure you review exactly when your memory trace is weakest.</p>
        <img src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=1000" alt="Study focus" />
        <p>Allocate 15 minutes of your 'Prime Hour' in the morning purely for formula flushes. Don't solve problems during this time—just recall definitions and derivations.</p>
      `, 
      author: "Admin", 
      date: "2024-12-20", 
      status: "PUBLISHED" 
    },
    { 
      id: 'b2', 
      title: "Organic Chemistry: From Fear to Mastery", 
      content: `
        <p>Organic chemistry is often viewed as a subject of rote memorization. This is the first mistake. Organic chemistry is about <strong>mechanisms</strong>.</p>
        <h2>Visualization over Memorization</h2>
        <p>Instead of memorizing reagents, try to visualize the movement of electrons. Use our Memory Hacks vault to find mnemonics for the reactivity series, but spend 80% of your time on reaction pathways.</p>
        <p>The "Mole-Tunnel" method we provide in the hacks module is specifically designed to help you navigate stoichiometric conversions without getting lost in the math.</p>
      `, 
      author: "Dr. Chemistry", 
      date: "2024-12-22", 
      status: "PUBLISHED" 
    },
    { 
      id: 'b3', 
      title: "The Silent AIR Killer: Performance Anxiety", 
      content: `
        <p>Many students score 280+ in home practice but drop to 180 in the exam hall. Why? Psychometric stability.</p>
        <h2>Building a Mental Shield</h2>
        <p>Your brain is a biological machine. High cortisol (stress) shut downs the prefrontal cortex—the part of the brain responsible for complex solving. Use the Wellness Module to track your sleep integrity.</p>
        <p>Taking a diagnostic assessment every 14 days helps desensitize the 'Fear Response' your brain has to exam patterns.</p>
      `, 
      author: "Psych Lead", 
      date: "2024-12-25", 
      status: "PUBLISHED" 
    }
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
  connectedParent: {
    name: "Mr. Ramesh Sharma",
    id: "P-4402",
    linkedSince: "2025-11-15"
  },
  oauthClientId: '',
  analyticsId: ''
};
