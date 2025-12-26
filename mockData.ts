
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
    { testId: 'test_jee_main_2024_p1', testName: 'JEE Main 2024 - Session 1 Official', score: 242, totalMarks: 300, date: '2025-12-10', chapterIds: ['p-units', 'm-sets'], accuracy: 82 }
  ],
  backlogs: [
    { id: 'bl_1', title: 'Circular Motion Practice', subject: 'Physics', priority: 'High', status: 'PENDING', deadline: '2025-01-01', createdAt: '2025-12-15' },
    { id: 'bl_2', title: 'Organic Nomenclature', subject: 'Chemistry', priority: 'Medium', status: 'PENDING', deadline: '2025-01-05', createdAt: '2025-12-16' }
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
    { 
      id: 'b1', 
      title: "Mastering the Forgetting Curve for JEE 2025", 
      content: "<h1>Strategic Recall</h1><p>Master the curve using spaced repetition algorithms.</p>", 
      author: "Admin", 
      date: "2024-12-20", 
      status: "PUBLISHED" 
    }
  ],
  messages: [],
  mockTests: [
    { 
      id: 'test_jee_main_2024_p1', 
      name: 'JEE Main 2024 - January Session A1', 
      duration: 180, 
      totalMarks: 300, 
      category: 'ADMIN', 
      difficulty: 'MAINS', 
      questionIds: ['q_p_units_1', 'q_p_units_2', 'q_p_units_3', 'q_m_sets_1', 'q_m_sets_2', 'q_c_basic_1', 'q_c_basic_2'],
      chapterIds: ['p-units', 'm-sets', 'c-basic'] 
    },
    {
      id: 'test_full_adv_mock_1',
      name: 'JEE Advanced High-Octane Mock #1',
      duration: 180,
      totalMarks: 360,
      category: 'ADMIN',
      difficulty: 'ADVANCED',
      questionIds: ['q_p_kinematics_1', 'q_m_complex_1', 'q_c_atomic_1', 'q_p_units_3'],
      chapterIds: ['p-kinematics', 'm-complex', 'c-atomic']
    }
  ],
  questions: [
    { 
      id: 'q_p_units_1', 
      topicId: 'p-units', 
      subject: 'Physics', 
      text: "Dimensional formula of Planck's Constant (h) is equivalent to:", 
      options: ["Angular Momentum", "Linear Momentum", "Energy", "Work"], 
      correctAnswer: 0, 
      explanation: "[h] = [E/f] = [ML²T⁻² / T⁻¹] = [ML²T⁻¹]. This matches Angular Momentum [L] = [r × p] = [L × MLT⁻¹] = [ML²T⁻¹].",
      difficulty: 'EASY' 
    },
    { 
      id: 'q_p_units_2', 
      topicId: 'p-units', 
      subject: 'Physics', 
      text: "Which of the following is not a fundamental SI unit?", 
      options: ["Meter", "Candela", "Newton", "Kelvin"], 
      correctAnswer: 2, 
      explanation: "Newton is a derived unit of Force (kg·m/s²).",
      difficulty: 'EASY' 
    },
    { 
      id: 'q_p_units_3', 
      topicId: 'p-units', 
      subject: 'Physics', 
      text: "The surface tension of a liquid is 70 dyne/cm. In MKS system, its value is:", 
      options: ["70 N/m", "7 × 10⁻² N/m", "7 × 10³ N/m", "7 × 10⁻³ N/m"], 
      correctAnswer: 1, 
      explanation: "1 dyne/cm = 10⁻³ N/m. So 70 dyne/cm = 70 × 10⁻³ = 0.07 = 7 × 10⁻² N/m.",
      difficulty: 'MEDIUM' 
    },
    { 
      id: 'q_p_kinematics_1', 
      topicId: 'p-kinematics', 
      subject: 'Physics', 
      text: "A projectile is fired at an angle of 45°. If the velocity is doubled, the range becomes:", 
      options: ["Doubled", "Four times", "Halved", "Unchanged"], 
      correctAnswer: 1, 
      explanation: "Range R = (u² sin 2θ) / g. R is proportional to u². If u is doubled, R becomes 2² = 4 times.",
      difficulty: 'MEDIUM' 
    },
    { 
      id: 'q_m_sets_1', 
      topicId: 'm-sets', 
      subject: 'Mathematics', 
      text: "If A and B are two sets such that n(A) = 15, n(B) = 20 and n(A ∪ B) = 30, then n(A ∩ B) is:", 
      options: ["2", "5", "10", "15"], 
      correctAnswer: 1, 
      explanation: "n(A ∩ B) = n(A) + n(B) - n(A ∪ B) = 15 + 20 - 30 = 5.",
      difficulty: 'EASY' 
    },
    { 
      id: 'q_m_sets_2', 
      topicId: 'm-sets', 
      subject: 'Mathematics', 
      text: "The number of subsets of a set containing 5 elements is:", 
      options: ["5", "10", "25", "32"], 
      correctAnswer: 3, 
      explanation: "Number of subsets = 2^n. For n=5, 2^5 = 32.",
      difficulty: 'EASY' 
    },
    { 
      id: 'q_m_complex_1', 
      topicId: 'm-complex', 
      subject: 'Mathematics', 
      text: "The value of i^243 is:", 
      options: ["i", "-i", "1", "-1"], 
      correctAnswer: 1, 
      explanation: "243 = 4 * 60 + 3. So i^243 = (i^4)^60 * i^3 = 1 * (-i) = -i.",
      difficulty: 'MEDIUM' 
    },
    { 
      id: 'q_c_basic_1', 
      topicId: 'c-basic', 
      subject: 'Chemistry', 
      text: "The number of significant figures in 0.0025 is:", 
      options: ["1", "2", "3", "4"], 
      correctAnswer: 1, 
      explanation: "Leading zeros are not significant. Only 2 and 5 are significant.",
      difficulty: 'EASY' 
    },
    { 
      id: 'q_c_basic_2', 
      topicId: 'c-basic', 
      subject: 'Chemistry', 
      text: "One mole of any gas at STP occupies a volume of:", 
      options: ["22.4 Liters", "11.2 Liters", "44.8 Liters", "2.24 Liters"], 
      correctAnswer: 0, 
      explanation: "Standard molar volume of an ideal gas at STP is 22.4 L.",
      difficulty: 'EASY' 
    },
    { 
      id: 'q_c_atomic_1', 
      topicId: 'c-atomic', 
      subject: 'Chemistry', 
      text: "The wavelength of spectral line for an electron jumping from n=2 to n=1 in Hydrogen atom is:", 
      options: ["121.6 nm", "656.3 nm", "486.1 nm", "102.5 nm"], 
      correctAnswer: 0, 
      explanation: "Lyman series alpha line. λ = 1 / [R(1/1² - 1/2²)] = 4 / (3R) ≈ 121.6 nm.",
      difficulty: 'MEDIUM' 
    }
  ],
  chapters: [
    { id: 'm-sets', subject: 'Mathematics', unit: 'UNIT 1', name: 'Sets, Relations and Functions', progress: 15, accuracy: 75, timeSpent: 3600, timeSpentNotes: 1200, timeSpentVideos: 800, timeSpentPractice: 1000, timeSpentTests: 600, status: 'LEARNING' },
    { id: 'm-complex', subject: 'Mathematics', unit: 'UNIT 2', name: 'Complex Numbers & Quadratic Equations', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'p-units', subject: 'Physics', unit: 'UNIT 1', name: 'Units and Measurements', progress: 40, accuracy: 85, timeSpent: 7200, timeSpentNotes: 2400, timeSpentVideos: 1800, timeSpentPractice: 2000, timeSpentTests: 1000, status: 'LEARNING' },
    { id: 'p-kinematics', subject: 'Physics', unit: 'UNIT 2', name: 'Kinematics', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'c-basic', subject: 'Chemistry', unit: 'UNIT 1', name: 'Some Basic Concepts in Chemistry', progress: 20, accuracy: 60, timeSpent: 2400, timeSpentNotes: 800, timeSpentVideos: 600, timeSpentPractice: 600, timeSpentTests: 400, status: 'LEARNING' },
    { id: 'c-atomic', subject: 'Chemistry', unit: 'UNIT 2', name: 'Atomic Structure', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
  ],
  connectedParent: {
    name: "Mr. Ramesh Sharma",
    id: "P-4402",
    linkedSince: "2025-11-15"
  }
};
