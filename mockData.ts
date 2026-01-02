
import { StudentData, UserRole, Chapter } from './types';

export const INITIAL_STUDENT_DATA: StudentData = {
  id: '163110',
  name: 'Aryan Sharma',
  email: 'ishu@gmail.com',
  timeSummary: { notes: 1200, videos: 800, practice: 1500, tests: 600 },
  psychometricHistory: [
    { stress: 4, focus: 8, motivation: 9, examFear: 3, timestamp: '2025-12-18' }
  ],
  testHistory: [
    { testId: 'jee-main-2024', testName: 'JEE Main 2024 - Session 1 Official', score: 242, totalMarks: 300, date: '2025-12-10', chapterIds: ['p-units', 'm-sets'], accuracy: 82, category: 'ADMIN' }
  ],
  backlogs: [
    { id: 'bl_1', title: 'Circular Motion Practice', subject: 'Physics', priority: 'High', status: 'PENDING', deadline: '2025-01-01', createdAt: '2025-12-15' }
  ],
  flashcards: [
    { id: '1', question: "Dimensional formula of Planck's Constant (h)", answer: "ML²T⁻¹", subject: 'Physics', difficulty: 'EASY', type: 'Formula' },
    { id: '11', question: "Ideal Gas Equation", answer: "PV = nRT", subject: 'Chemistry', difficulty: 'EASY', type: 'Concept' }
  ],
  memoryHacks: [
    { id: '1', title: "Trigonometry Ratios", description: "Sine, Cosine, Tangent", hack: "SOH CAH TOA", category: "Mnemonics", subject: "Mathematics" },
    { id: '3', title: "Redox Reactions", description: "Oxidation vs Reduction", hack: "OIL RIG", category: "Mnemonics", subject: "Chemistry" }
  ],
  blogs: [
    { id: 'b1', title: "Mastering the Forgetting Curve for JEE 2025", content: "<h1>Strategic Recall</h1><p>Master the curve using spaced repetition algorithms.</p>", author: "Admin", date: "2024-12-20", status: "PUBLISHED" }
  ],
  messages: [],
  mockTests: [
    { id: 'jee-main-2024', name: 'JEE Main 2024 Official', duration: 180, totalMarks: 300, category: 'ADMIN', difficulty: 'MAINS', questionIds: ['q_24_1', 'q_24_2', 'q_24_3', 'q_24_4', 'q_24_5', 'q_24_6', 'q_24_7', 'q_24_8', 'q_24_9', 'q_24_10'], chapterIds: ['p-units', 'm-sets', 'c-basic'] },
    { id: 'jee-main-2023', name: 'JEE Main 2023 Official', duration: 180, totalMarks: 300, category: 'ADMIN', difficulty: 'MAINS', questionIds: ['q_23_1', 'q_23_2', 'q_23_3', 'q_23_4', 'q_23_5', 'q_23_6', 'q_23_7', 'q_23_8', 'q_23_9', 'q_23_10'], chapterIds: ['p-kinematics', 'm-complex', 'c-atomic'] },
    { id: 'jee-main-2022', name: 'JEE Main 2022 Official', duration: 180, totalMarks: 300, category: 'ADMIN', difficulty: 'MAINS', questionIds: ['q_22_1', 'q_22_2', 'q_22_3', 'q_22_4', 'q_22_5', 'q_22_6', 'q_22_7', 'q_22_8', 'q_22_9', 'q_22_10'], chapterIds: ['p-magnetism', 'm-pnc', 'c-solutions'] },
    { id: 'jee-main-2021', name: 'JEE Main 2021 Official', duration: 180, totalMarks: 300, category: 'ADMIN', difficulty: 'MAINS', questionIds: ['q_21_1', 'q_21_2', 'q_21_3', 'q_21_4', 'q_21_5', 'q_21_6', 'q_21_7', 'q_21_8', 'q_21_9', 'q_21_10'], chapterIds: ['p-oscillations', 'm-3d-geo', 'c-halogens'] },
    { id: 'jee-main-2020', name: 'JEE Main 2020 Official', duration: 180, totalMarks: 300, category: 'ADMIN', difficulty: 'MAINS', questionIds: ['q_20_1', 'q_20_2', 'q_20_3', 'q_20_4', 'q_20_5', 'q_20_6', 'q_20_7', 'q_20_8', 'q_20_9', 'q_20_10'], chapterIds: ['m-calculus-integral', 'p-thermo', 'c-equilibrium'] },
    { id: 'jee-main-2019', name: 'JEE Main 2019 Official', duration: 180, totalMarks: 300, category: 'ADMIN', difficulty: 'MAINS', questionIds: ['q_19_1', 'q_19_2', 'q_19_3', 'q_19_4', 'q_19_5', 'q_19_6', 'q_19_7', 'q_19_8', 'q_19_9', 'q_19_10'], chapterIds: ['c-periodicity', 'p-kinematics', 'm-complex'] },
    { id: 'jee-main-2018', name: 'JEE Main 2018 Official', duration: 180, totalMarks: 300, category: 'ADMIN', difficulty: 'MAINS', questionIds: ['q_18_1', 'q_18_2', 'q_18_3', 'q_18_4', 'q_18_5', 'q_18_6', 'q_18_7', 'q_18_8', 'q_18_9', 'q_18_10'], chapterIds: ['p-emwaves', 'm-matrices', 'c-redox-electro'] },
    { id: 'jee-main-2017', name: 'JEE Main 2017 Official', duration: 180, totalMarks: 300, category: 'ADMIN', difficulty: 'MAINS', questionIds: ['q_17_1', 'q_17_2', 'q_17_3', 'q_17_4', 'q_17_5', 'q_17_6', 'q_17_7', 'q_17_8', 'q_17_9', 'q_17_10'], chapterIds: ['m-binomial', 'p-lom', 'c-kinetics'] },
    { id: 'jee-main-2016', name: 'JEE Main 2016 Official', duration: 180, totalMarks: 300, category: 'ADMIN', difficulty: 'MAINS', questionIds: ['q_16_1', 'q_16_2', 'q_16_3', 'q_16_4', 'q_16_5', 'q_16_6', 'q_16_7', 'q_16_8', 'q_16_9', 'q_16_10'], chapterIds: ['c-equilibrium', 'p-wep', 'm-sequence'] },
    { id: 'jee-main-2015', name: 'JEE Main 2015 Official', duration: 180, totalMarks: 300, category: 'ADMIN', difficulty: 'MAINS', questionIds: ['q_15_1', 'q_15_2', 'q_15_3', 'q_15_4', 'q_15_5', 'q_15_6', 'q_15_7', 'q_15_8', 'q_15_9', 'q_15_10'], chapterIds: ['p-units', 'c-bonding', 'm-calculus-limit'] }
  ],
  questions: [
    { id: 'q_24_1', topicId: 'p-units', subject: 'Physics', text: "A capacitor of 10 μF is charged to 50V. The energy stored in the capacitor is:", options: ["12.5 mJ", "25 mJ", "0.125 J", "1.25 J"], correctAnswer: 0, explanation: "E = 1/2 CV² = 0.5 * 10e-6 * (50)² = 12.5 mJ.", difficulty: 'EASY' },
    { id: 'q_24_2', topicId: 'm-sets', subject: 'Mathematics', text: "Number of subsets of a set containing 5 elements is:", options: ["5", "10", "25", "32"], correctAnswer: 3, explanation: "2^5 = 32.", difficulty: 'EASY' },
    { id: 'q_24_3', topicId: 'c-basic', subject: 'Chemistry', text: "Oxidation state of Cr in K2Cr2O7 is:", options: ["+3", "+6", "+4", "+2"], correctAnswer: 1, explanation: "2x = 12 => x = +6.", difficulty: 'EASY' },
    { id: 'q_24_4', topicId: 'p-kinematics', subject: 'Physics', text: "Average speed of a car covering halves at 40 and 60 km/h:", options: ["50 km/h", "48 km/h", "52 km/h", "45 km/h"], correctAnswer: 1, explanation: "Harmonic mean: 2v1v2/(v1+v2) = 48.", difficulty: 'MEDIUM' },
    { id: 'q_24_5', topicId: 'm-complex', subject: 'Mathematics', text: "Locus of |z-4| < |z-2| is:", options: ["Re(z) > 3", "Re(z) < 3", "Im(z) > 0", "Circle"], correctAnswer: 0, explanation: "The perpendicular bisector of 2 and 4 is x=3. The region closer to 4 is x > 3.", difficulty: 'MEDIUM' },
    { id: 'q_24_6', topicId: 'c-atomic', subject: 'Chemistry', text: "Radial nodes in 3s orbital:", options: ["0", "1", "2", "3"], correctAnswer: 2, explanation: "Radial nodes = n-l-1. For 3s: 3-0-1 = 2.", difficulty: 'EASY' },
    { id: 'q_24_7', topicId: 'p-lom', subject: 'Physics', text: "Work done if F=5i+2j and d=2i+3j:", options: ["10 J", "6 J", "16 J", "20 J"], correctAnswer: 2, explanation: "F·d = 10 + 6 = 16.", difficulty: 'EASY' },
    { id: 'q_24_8', topicId: 'm-matrices', subject: 'Mathematics', text: "If |A|=5 for 3x3 matrix, |2A| is:", options: ["10", "40", "20", "80"], correctAnswer: 1, explanation: "|kA| = k^n |A|. 2^3 * 5 = 40.", difficulty: 'MEDIUM' },
    { id: 'q_24_9', topicId: 'c-solutions', subject: 'Chemistry', text: "Which property is a colligative property?", options: ["Viscosity", "Surface Tension", "Osmotic Pressure", "Refractive Index"], correctAnswer: 2, explanation: "Osmotic pressure depends only on particle count.", difficulty: 'EASY' },
    { id: 'q_24_10', topicId: 'p-thermo', subject: 'Physics', text: "Efficiency of a Carnot engine between 27°C and 127°C is:", options: ["25%", "33%", "50%", "75%"], correctAnswer: 0, explanation: "1 - T_low/T_high = 1 - 300/400 = 0.25.", difficulty: 'MEDIUM' }
  ],
  chapters: [
    { id: 'm-sets', subject: 'Mathematics', unit: 'Sets, Relations and Functions', name: 'Sets & Relations Core', progress: 15, accuracy: 75, timeSpent: 3600, timeSpentNotes: 1200, timeSpentVideos: 800, timeSpentPractice: 1000, timeSpentTests: 600, status: 'LEARNING', notes: "<h2>Sets & Functions</h2><p>A set is a well-defined collection of objects.</p>" },
    { id: 'm-complex', subject: 'Mathematics', unit: 'Complex Numbers and Quadratic Equations', name: 'Complex Roots & Plane', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'm-matrices', subject: 'Mathematics', unit: 'Matrices and Determinants', name: 'Matrix Algebra', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'p-units', subject: 'Physics', unit: 'Units and Measurements', name: 'Dimensions & SI', progress: 40, accuracy: 85, timeSpent: 7200, timeSpentNotes: 2400, timeSpentVideos: 1800, timeSpentPractice: 2000, timeSpentTests: 1000, status: 'LEARNING' },
    { id: 'c-basic', subject: 'Chemistry', unit: 'Some Basic Concepts in Chemistry', name: 'Mole Concept', progress: 20, accuracy: 60, timeSpent: 2400, timeSpentNotes: 800, timeSpentVideos: 600, timeSpentPractice: 600, timeSpentTests: 400, status: 'LEARNING' }
  ],
  connectedParent: undefined,
  pendingInvitations: []
};
