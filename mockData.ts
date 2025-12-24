
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
      content: "<h1>Spaced Repetition</h1><p>Master the curve.</p>", 
      author: "Admin", 
      date: "2024-12-20", 
      status: "PUBLISHED" 
    }
  ],
  messages: [],
  mockTests: [
    { 
      id: 'test_jee_main_1', 
      name: 'JEE Main 2024 - Full Mock 1', 
      duration: 180, 
      totalMarks: 300, 
      category: 'ADMIN', 
      difficulty: 'MAINS', 
      questionIds: ['q_p_units_1', 'q_p_units_2'],
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
      explanation: "h = E/f = [ML²T⁻²]/[T⁻¹] = [ML²T⁻¹]",
      difficulty: 'EASY' 
    },
    { 
      id: 'q_p_units_2', 
      topicId: 'p-units', 
      subject: 'Physics', 
      text: "Which of the following is not a fundamental SI unit?", 
      options: ["Meter", "Candela", "Newton", "Kelvin"], 
      correctAnswer: 2, 
      explanation: "Newton is a derived unit.",
      difficulty: 'EASY' 
    }
  ],
  chapters: [
    // MATHEMATICS (14 Units)
    { id: 'm-sets', subject: 'Mathematics', unit: 'UNIT 1', name: 'Sets, Relations and Functions', progress: 0, accuracy: 0, timeSpent: 0, status: 'NOT_STARTED' },
    { id: 'm-complex', subject: 'Mathematics', unit: 'UNIT 2', name: 'Complex Numbers & Quadratic Equations', progress: 0, accuracy: 0, timeSpent: 0, status: 'NOT_STARTED' },
    { id: 'm-matrices', subject: 'Mathematics', unit: 'UNIT 3', name: 'Matrices and Determinants', progress: 0, accuracy: 0, timeSpent: 0, status: 'NOT_STARTED' },
    { id: 'm-permutations', subject: 'Mathematics', unit: 'UNIT 4', name: 'Permutations and Combinations', progress: 0, accuracy: 0, timeSpent: 0, status: 'NOT_STARTED' },
    { id: 'm-binomial', subject: 'Mathematics', unit: 'UNIT 5', name: 'Binomial Theorem & Simple Applications', progress: 0, accuracy: 0, timeSpent: 0, status: 'NOT_STARTED' },
    { id: 'm-sequence', subject: 'Mathematics', unit: 'UNIT 6', name: 'Sequence and Series', progress: 0, accuracy: 0, timeSpent: 0, status: 'NOT_STARTED' },
    { id: 'm-limit', subject: 'Mathematics', unit: 'UNIT 7', name: 'Limit, Continuity & Differentiability', progress: 0, accuracy: 0, timeSpent: 0, status: 'NOT_STARTED' },
    { id: 'm-integral', subject: 'Mathematics', unit: 'UNIT 8', name: 'Integral Calculus', progress: 0, accuracy: 0, timeSpent: 0, status: 'NOT_STARTED' },
    { id: 'm-diff', subject: 'Mathematics', unit: 'UNIT 9', name: 'Differential Equations', progress: 0, accuracy: 0, timeSpent: 0, status: 'NOT_STARTED' },
    { id: 'm-coords', subject: 'Mathematics', unit: 'UNIT 10', name: 'Co-ordinate Geometry', progress: 0, accuracy: 0, timeSpent: 0, status: 'NOT_STARTED' },
    { id: 'm-3d', subject: 'Mathematics', unit: 'UNIT 11', name: 'Three Dimensional Geometry', progress: 0, accuracy: 0, timeSpent: 0, status: 'NOT_STARTED' },
    { id: 'm-vectors', subject: 'Mathematics', unit: 'UNIT 12', name: 'Vector Algebra', progress: 0, accuracy: 0, timeSpent: 0, status: 'NOT_STARTED' },
    { id: 'm-stats', subject: 'Mathematics', unit: 'UNIT 13', name: 'Statistics and Probability', progress: 0, accuracy: 0, timeSpent: 0, status: 'NOT_STARTED' },
    { id: 'm-trig', subject: 'Mathematics', unit: 'UNIT 14', name: 'Trigonometry', progress: 0, accuracy: 0, timeSpent: 0, status: 'NOT_STARTED' },

    // PHYSICS (20 Units)
    { id: 'p-units', subject: 'Physics', unit: 'UNIT 1', name: 'Units and Measurements', progress: 0, accuracy: 0, timeSpent: 0, status: 'NOT_STARTED' },
    { id: 'p-kinematics', subject: 'Physics', unit: 'UNIT 2', name: 'Kinematics', progress: 0, accuracy: 0, timeSpent: 0, status: 'NOT_STARTED' },
    { id: 'p-laws', subject: 'Physics', unit: 'UNIT 3', name: 'Laws of Motion', progress: 0, accuracy: 0, timeSpent: 0, status: 'NOT_STARTED' },
    { id: 'p-work', subject: 'Physics', unit: 'UNIT 4', name: 'Work, Energy and Power', progress: 0, accuracy: 0, timeSpent: 0, status: 'NOT_STARTED' },
    { id: 'p-rotation', subject: 'Physics', unit: 'UNIT 5', name: 'Rotational Motion', progress: 0, accuracy: 0, timeSpent: 0, status: 'NOT_STARTED' },
    { id: 'p-gravitation', subject: 'Physics', unit: 'UNIT 6', name: 'Gravitation', progress: 0, accuracy: 0, timeSpent: 0, status: 'NOT_STARTED' },
    { id: 'p-solids', subject: 'Physics', unit: 'UNIT 7', name: 'Properties of Solids and Liquids', progress: 0, accuracy: 0, timeSpent: 0, status: 'NOT_STARTED' },
    { id: 'p-thermo', subject: 'Physics', unit: 'UNIT 8', name: 'Thermodynamics', progress: 0, accuracy: 0, timeSpent: 0, status: 'NOT_STARTED' },
    { id: 'p-ktg', subject: 'Physics', unit: 'UNIT 9', name: 'Kinetic Theory of Gases', progress: 0, accuracy: 0, timeSpent: 0, status: 'NOT_STARTED' },
    { id: 'p-oscillations', subject: 'Physics', unit: 'UNIT 10', name: 'Oscillations and Waves', progress: 0, accuracy: 0, timeSpent: 0, status: 'NOT_STARTED' },
    { id: 'p-electrostatics', subject: 'Physics', unit: 'UNIT 11', name: 'Electrostatics', progress: 0, accuracy: 0, timeSpent: 0, status: 'NOT_STARTED' },
    { id: 'p-current', subject: 'Physics', unit: 'UNIT 12', name: 'Current Electricity', progress: 0, accuracy: 0, timeSpent: 0, status: 'NOT_STARTED' },
    { id: 'p-magnetic', subject: 'Physics', unit: 'UNIT 13', name: 'Magnetic Effects of Current & Magnetism', progress: 0, accuracy: 0, timeSpent: 0, status: 'NOT_STARTED' },
    { id: 'p-induction', subject: 'Physics', unit: 'UNIT 14', name: 'Electromagnetic Induction & AC', progress: 0, accuracy: 0, timeSpent: 0, status: 'NOT_STARTED' },
    { id: 'p-waves', subject: 'Physics', unit: 'UNIT 15', name: 'Electromagnetic Waves', progress: 0, accuracy: 0, timeSpent: 0, status: 'NOT_STARTED' },
    { id: 'p-optics', subject: 'Physics', unit: 'UNIT 16', name: 'Optics', progress: 0, accuracy: 0, timeSpent: 0, status: 'NOT_STARTED' },
    { id: 'p-dual', subject: 'Physics', unit: 'UNIT 17', name: 'Dual Nature of Matter & Radiation', progress: 0, accuracy: 0, timeSpent: 0, status: 'NOT_STARTED' },
    { id: 'p-atoms', subject: 'Physics', unit: 'UNIT 18', name: 'Atoms and Nuclei', progress: 0, accuracy: 0, timeSpent: 0, status: 'NOT_STARTED' },
    { id: 'p-devices', subject: 'Physics', unit: 'UNIT 19', name: 'Electronic Devices', progress: 0, accuracy: 0, timeSpent: 0, status: 'NOT_STARTED' },
    { id: 'p-skills', subject: 'Physics', unit: 'UNIT 20', name: 'Experimental Skills', progress: 0, accuracy: 0, timeSpent: 0, status: 'NOT_STARTED' },

    // CHEMISTRY (20 Units)
    { id: 'c-basic', subject: 'Chemistry', unit: 'UNIT 1', name: 'Some Basic Concepts in Chemistry', progress: 0, accuracy: 0, timeSpent: 0, status: 'NOT_STARTED' },
    { id: 'c-atomic', subject: 'Chemistry', unit: 'UNIT 2', name: 'Atomic Structure', progress: 0, accuracy: 0, timeSpent: 0, status: 'NOT_STARTED' },
    { id: 'c-bonding', subject: 'Chemistry', unit: 'UNIT 3', name: 'Chemical Bonding & Molecular Structure', progress: 0, accuracy: 0, timeSpent: 0, status: 'NOT_STARTED' },
    { id: 'c-thermo', subject: 'Chemistry', unit: 'UNIT 4', name: 'Chemical Thermodynamics', progress: 0, accuracy: 0, timeSpent: 0, status: 'NOT_STARTED' },
    { id: 'c-solutions', subject: 'Chemistry', unit: 'UNIT 5', name: 'Solutions', progress: 0, accuracy: 0, timeSpent: 0, status: 'NOT_STARTED' },
    { id: 'c-equilibrium', subject: 'Chemistry', unit: 'UNIT 6', name: 'Equilibrium', progress: 0, accuracy: 0, timeSpent: 0, status: 'NOT_STARTED' },
    { id: 'c-redox', subject: 'Chemistry', unit: 'UNIT 7', name: 'Redox Reactions & Electrochemistry', progress: 0, accuracy: 0, timeSpent: 0, status: 'NOT_STARTED' },
    { id: 'c-kinetics', subject: 'Chemistry', unit: 'UNIT 8', name: 'Chemical Kinetics', progress: 0, accuracy: 0, timeSpent: 0, status: 'NOT_STARTED' },
    { id: 'c-classification', subject: 'Chemistry', unit: 'UNIT 9', name: 'Classification of Elements', progress: 0, accuracy: 0, timeSpent: 0, status: 'NOT_STARTED' },
    { id: 'c-pblock', subject: 'Chemistry', unit: 'UNIT 10', name: 'p-Block Elements', progress: 0, accuracy: 0, timeSpent: 0, status: 'NOT_STARTED' },
    { id: 'c-dblock', subject: 'Chemistry', unit: 'UNIT 11', name: 'd- and f-Block Elements', progress: 0, accuracy: 0, timeSpent: 0, status: 'NOT_STARTED' },
    { id: 'c-coordination', subject: 'Chemistry', unit: 'UNIT 12', name: 'Coordination Compounds', progress: 0, accuracy: 0, timeSpent: 0, status: 'NOT_STARTED' },
    { id: 'c-purification', subject: 'Chemistry', unit: 'UNIT 13', name: 'Purification & Characterisation', progress: 0, accuracy: 0, timeSpent: 0, status: 'NOT_STARTED' },
    { id: 'c-organic-basic', subject: 'Chemistry', unit: 'UNIT 14', name: 'Basic Principles of Organic Chemistry', progress: 0, accuracy: 0, timeSpent: 0, status: 'NOT_STARTED' },
    { id: 'c-hydrocarbons', subject: 'Chemistry', unit: 'UNIT 15', name: 'Hydrocarbons', progress: 0, accuracy: 0, timeSpent: 0, status: 'NOT_STARTED' },
    { id: 'c-halogens', subject: 'Chemistry', unit: 'UNIT 16', name: 'Organic Compounds with Halogens', progress: 0, accuracy: 0, timeSpent: 0, status: 'NOT_STARTED' },
    { id: 'c-oxygen', subject: 'Chemistry', unit: 'UNIT 17', name: 'Organic Compounds with Oxygen', progress: 0, accuracy: 0, timeSpent: 0, status: 'NOT_STARTED' },
    { id: 'c-nitrogen', subject: 'Chemistry', unit: 'UNIT 18', name: 'Organic Compounds with Nitrogen', progress: 0, accuracy: 0, timeSpent: 0, status: 'NOT_STARTED' },
    { id: 'c-biomolecules', subject: 'Chemistry', unit: 'UNIT 19', name: 'Biomolecules', progress: 0, accuracy: 0, timeSpent: 0, status: 'NOT_STARTED' },
    { id: 'c-practical', subject: 'Chemistry', unit: 'UNIT 20', name: 'Principles Related to Practical Chemistry', progress: 0, accuracy: 0, timeSpent: 0, status: 'NOT_STARTED' },
  ],
  connectedParent: {
    name: "Mr. Ramesh Sharma",
    id: "P-4402",
    linkedSince: "2025-11-15"
  },
  oauthClientId: '',
  analyticsId: ''
};
