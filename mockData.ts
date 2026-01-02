
import { StudentData, UserRole, Chapter } from './types';

const generateMockChapters = (): Chapter[] => {
  const chapters: Chapter[] = [
    // PHYSICS (30 Chapters)
    { id: 'p-units', subject: 'Physics', unit: 'Mechanics', name: 'Units and Measurements', progress: 40, accuracy: 85, timeSpent: 7200, timeSpentNotes: 2400, timeSpentVideos: 1800, timeSpentPractice: 2000, timeSpentTests: 1000, status: 'LEARNING' },
    { id: 'p-kinematics', subject: 'Physics', unit: 'Mechanics', name: 'Kinematics', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'p-lom', subject: 'Physics', unit: 'Mechanics', name: 'Laws of Motion', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'p-wep', subject: 'Physics', unit: 'Mechanics', name: 'Work, Energy and Power', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'p-rotational', subject: 'Physics', unit: 'Mechanics', name: 'Rotational Motion', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'p-gravitation', subject: 'Physics', unit: 'Mechanics', name: 'Gravitation', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'p-solids', subject: 'Physics', unit: 'Properties of Matter', name: 'Mechanical Properties of Solids', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'p-fluids', subject: 'Physics', unit: 'Properties of Matter', name: 'Mechanical Properties of Fluids', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'p-thermal-prop', subject: 'Physics', unit: 'Thermodynamics', name: 'Thermal Properties of Matter', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'p-thermo', subject: 'Physics', unit: 'Thermodynamics', name: 'Thermodynamics (Physics)', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'p-ktg', subject: 'Physics', unit: 'Thermodynamics', name: 'Kinetic Theory of Gases', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'p-oscillations', subject: 'Physics', unit: 'Waves', name: 'Oscillations', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'p-waves', subject: 'Physics', unit: 'Waves', name: 'Waves', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'p-electrostatics', subject: 'Physics', unit: 'Electromagnetism', name: 'Electrostatics', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'p-current', subject: 'Physics', unit: 'Electromagnetism', name: 'Current Electricity', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'p-magnetism', subject: 'Physics', unit: 'Electromagnetism', name: 'Moving Charges and Magnetism', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'p-matter-mag', subject: 'Physics', unit: 'Electromagnetism', name: 'Magnetism and Matter', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'p-emi', subject: 'Physics', unit: 'Electromagnetism', name: 'Electromagnetic Induction', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'p-ac', subject: 'Physics', unit: 'Electromagnetism', name: 'Alternating Current', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'p-emwaves', subject: 'Physics', unit: 'Electromagnetism', name: 'Electromagnetic Waves', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'p-ray-optics', subject: 'Physics', unit: 'Optics', name: 'Ray Optics', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'p-wave-optics', subject: 'Physics', unit: 'Optics', name: 'Wave Optics', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'p-dual-nature', subject: 'Physics', unit: 'Modern Physics', name: 'Dual Nature of Matter', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'p-atoms', subject: 'Physics', unit: 'Modern Physics', name: 'Atoms', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'p-nuclei', subject: 'Physics', unit: 'Modern Physics', name: 'Nuclei', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'p-semiconductors', subject: 'Physics', unit: 'Modern Physics', name: 'Semiconductor Electronics', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'p-communication', subject: 'Physics', unit: 'Modern Physics', name: 'Communication Systems', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },

    // CHEMISTRY (30 Chapters)
    { id: 'c-basic', subject: 'Chemistry', unit: 'General Chemistry', name: 'Some Basic Concepts of Chemistry', progress: 20, accuracy: 60, timeSpent: 2400, timeSpentNotes: 800, timeSpentVideos: 600, timeSpentPractice: 600, timeSpentTests: 400, status: 'LEARNING' },
    { id: 'c-atomic', subject: 'Chemistry', unit: 'General Chemistry', name: 'Structure of Atom', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0 },
    { id: 'c-periodicity', subject: 'Chemistry', unit: 'General Chemistry', name: 'Classification of Elements', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0 },
    { id: 'c-bonding', subject: 'Chemistry', unit: 'General Chemistry', name: 'Chemical Bonding', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0 },
    { id: 'c-states', subject: 'Chemistry', unit: 'Physical Chemistry', name: 'States of Matter', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0 },
    { id: 'c-thermo', subject: 'Chemistry', unit: 'Physical Chemistry', name: 'Thermodynamics (Chemistry)', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0 },
    { id: 'c-equilibrium', subject: 'Chemistry', unit: 'Physical Chemistry', name: 'Equilibrium', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0 },
    { id: 'c-redox-electro', subject: 'Chemistry', unit: 'Physical Chemistry', name: 'Redox and Electrochemistry', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0 },
    { id: 'c-kinetics', subject: 'Chemistry', unit: 'Physical Chemistry', name: 'Chemical Kinetics', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0 },
    { id: 'c-solutions', subject: 'Chemistry', unit: 'Physical Chemistry', name: 'Solutions', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0 },
    { id: 'c-hydrogen', subject: 'Chemistry', unit: 'Inorganic Chemistry', name: 'Hydrogen', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0 },
    { id: 'c-sblock', subject: 'Chemistry', unit: 'Inorganic Chemistry', name: 'The s-Block Elements', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0 },
    { id: 'c-pblock-1', subject: 'Chemistry', unit: 'Inorganic Chemistry', name: 'The p-Block Elements (13-14)', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0 },
    { id: 'c-pblock-2', subject: 'Chemistry', unit: 'Inorganic Chemistry', name: 'The p-Block Elements (15-18)', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0 },
    { id: 'c-dfblock', subject: 'Chemistry', unit: 'Inorganic Chemistry', name: 'The d- and f-Block Elements', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0 },
    { id: 'c-coordination', subject: 'Chemistry', unit: 'Inorganic Chemistry', name: 'Coordination Compounds', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0 },
    { id: 'c-organic-basics', subject: 'Chemistry', unit: 'Organic Chemistry', name: 'Organic Chemistry Principles', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0 },
    { id: 'c-hydrocarbons', subject: 'Chemistry', unit: 'Organic Chemistry', name: 'Hydrocarbons', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0 },
    { id: 'c-haloalkanes', subject: 'Chemistry', unit: 'Organic Chemistry', name: 'Haloalkanes and Haloarenes', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0 },
    { id: 'c-alcohols', subject: 'Chemistry', unit: 'Organic Chemistry', name: 'Alcohols, Phenols and Ethers', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0 },
    { id: 'c-carbonyl', subject: 'Chemistry', unit: 'Organic Chemistry', name: 'Aldehydes, Ketones and Carboxylic Acids', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0 },
    { id: 'c-amines', subject: 'Chemistry', unit: 'Organic Chemistry', name: 'Organic Compounds Containing Nitrogen', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0 },
    { id: 'c-biomolecules', subject: 'Chemistry', unit: 'Applied Chemistry', name: 'Biomolecules', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0 },
    { id: 'c-polymers', subject: 'Chemistry', unit: 'Applied Chemistry', name: 'Polymers', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0 },

    // MATHEMATICS (30 Chapters)
    { id: 'm-sets', subject: 'Mathematics', unit: 'Algebra', name: 'Sets, Relations and Functions', progress: 15, accuracy: 75, timeSpent: 3600, timeSpentNotes: 1200, timeSpentVideos: 800, timeSpentPractice: 1000, timeSpentTests: 600, status: 'LEARNING', notes: "<h2>Sets & Functions</h2><p>A set is a well-defined collection of objects.</p>" },
    { id: 'm-complex', subject: 'Mathematics', unit: 'Algebra', name: 'Complex Numbers', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0 },
    { id: 'm-matrices', subject: 'Mathematics', unit: 'Algebra', name: 'Matrices and Determinants', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0 },
    { id: 'm-pnc', subject: 'Mathematics', unit: 'Algebra', name: 'Permutations and Combinations', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0 },
    { id: 'm-induction', subject: 'Mathematics', unit: 'Algebra', name: 'Mathematical Induction', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0 },
    { id: 'm-binomial', subject: 'Mathematics', unit: 'Algebra', name: 'Binomial Theorem', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0 },
    { id: 'm-sequence', subject: 'Mathematics', unit: 'Algebra', name: 'Sequences and Series', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0 },
    { id: 'm-calculus-limit', subject: 'Mathematics', unit: 'Calculus', name: 'Limits, Continuity and Differentiability', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0 },
    { id: 'm-calculus-integral', subject: 'Mathematics', unit: 'Calculus', name: 'Integral Calculus', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0 },
    { id: 'm-diff-eq', subject: 'Mathematics', unit: 'Calculus', name: 'Differential Equations', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0 },
    { id: 'm-coordinate-geo', subject: 'Mathematics', unit: 'Geometry', name: 'Coordinate Geometry', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0 },
    { id: 'm-3d-geo', subject: 'Mathematics', unit: 'Geometry', name: 'Three Dimensional Geometry', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0 },
    { id: 'm-vectors', subject: 'Mathematics', unit: 'Geometry', name: 'Vector Algebra', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0 },
    { id: 'm-stats-prob', subject: 'Mathematics', unit: 'Statistics and Probability', name: 'Statistics and Probability', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0 },
    { id: 'm-trigonometry', subject: 'Mathematics', unit: 'Trigonometry', name: 'Trigonometry', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0 },
    { id: 'm-reasoning', subject: 'Mathematics', unit: 'Mathematical Reasoning', name: 'Mathematical Reasoning', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0 },
  ];
  return chapters;
};

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
    { id: 'fc-1', question: "Dimensional formula of Planck's Constant (h)", answer: "ML²T⁻¹", subject: 'Physics', difficulty: 'EASY', type: 'Formula' },
    { id: 'fc-2', question: "Force between two point charges (Coulomb's Law)", answer: "F = k(q1q2)/r²", subject: 'Physics', difficulty: 'EASY', type: 'Formula' },
    { id: 'fc-3', question: "Work-Energy Theorem Statement", answer: "Work done by all forces = Change in Kinetic Energy", subject: 'Physics', difficulty: 'MEDIUM', type: 'Concept' },
    { id: 'fc-4', question: "Ideal Gas Equation", answer: "PV = nRT", subject: 'Chemistry', difficulty: 'EASY', type: 'Formula' },
    { id: 'fc-5', question: "Oxidation state of Oxygen in OF2", answer: "+2", subject: 'Chemistry', difficulty: 'HARD', type: 'Concept' },
    { id: 'fc-6', question: "Huckel's Rule for Aromaticity", answer: "(4n + 2) pi electrons", subject: 'Chemistry', difficulty: 'MEDIUM', type: 'Concept' },
    { id: 'fc-7', question: "Euler's Formula for Complex Numbers", answer: "e^(ix) = cos(x) + i sin(x)", subject: 'Mathematics', difficulty: 'MEDIUM', type: 'Formula' },
    { id: 'fc-8', question: "Integral of tan(x) dx", answer: "log|sec(x)| + C", subject: 'Mathematics', difficulty: 'EASY', type: 'Formula' },
    { id: 'fc-9', question: "Condition for Perpendicular Vectors A and B", answer: "A . B = 0", subject: 'Mathematics', difficulty: 'EASY', type: 'Concept' },
    { id: 'fc-10', question: "Lens Maker's Formula", answer: "1/f = (mu-1)(1/R1 - 1/R2)", subject: 'Physics', difficulty: 'MEDIUM', type: 'Formula' }
  ],
  memoryHacks: [
    { id: 'mh-1', title: "Trigonometry Ratios", description: "Sine, Cosine, Tangent basic formulas", hack: "SOH CAH TOA", category: "Mnemonics", subject: "Mathematics" },
    { id: 'mh-2', title: "Redox Reactions", description: "Oxidation vs Reduction definitions", hack: "OIL RIG (Oxidation Is Loss, Reduction Is Gain)", category: "Mnemonics", subject: "Chemistry" },
    { id: 'mh-3', title: "Visible Spectrum", description: "Colors in increasing frequency", hack: "VIBGYOR", category: "Mnemonics", subject: "Physics" },
    { id: 'mh-4', title: "Reactivity Series", description: "Order of metal reactivity", hack: "Please Stop Calling Me A Careless Zebra...", category: "Mnemonics", subject: "Chemistry" },
    { id: 'mh-5', title: "Integration by Parts", description: "Priority order for choosing 'u'", hack: "ILATE (Inverse, Log, Algeb, Trig, Expo)", category: "Shortcuts", subject: "Mathematics" },
    { id: 'mh-6', title: "Periodic Table Grp 1", description: "Alkali Metals recall", hack: "Li-Na-K-Rb-Cs-Fr (Li Na Kar Rab Se Fariyad)", category: "Mnemonics", subject: "Chemistry" },
    { id: 'mh-7', title: "Thermodynamics Laws", description: "Summary of 0, 1, 2 Laws", hack: "Energy is conserved; Entropy increases.", category: "Shortcuts", subject: "Physics" }
  ],
  blogs: [
    { id: 'b1', title: "Mastering the Forgetting Curve for JEE 2025", content: "<h1>Strategic Recall</h1><p>Master the curve using spaced repetition algorithms.</p>", author: "Admin", date: "2024-12-20", status: "PUBLISHED" }
  ],
  messages: [],
  mockTests: [
    { id: 'jee-main-2024', name: 'JEE Main 2024 Official', duration: 180, totalMarks: 300, category: 'ADMIN', difficulty: 'MAINS', questionIds: ['q_24_1', 'q_24_2', 'q_24_3', 'q_24_4', 'q_24_5', 'q_24_6', 'q_24_7', 'q_24_8', 'q_24_9', 'q_24_10'], chapterIds: ['p-units', 'm-sets', 'c-basic'] },
    { id: 'jee-main-2023', name: 'JEE Main 2023 Official', duration: 180, totalMarks: 300, category: 'ADMIN', difficulty: 'MAINS', questionIds: ['q_23_1', 'q_23_2', 'q_23_3', 'q_23_4', 'q_23_5', 'q_23_6', 'q_23_7', 'q_23_8', 'q_23_9', 'q_23_10'], chapterIds: ['p-kinematics', 'm-complex', 'c-atomic'] },
    { id: 'jee-main-2022', name: 'JEE Main 2022 Official', duration: 180, totalMarks: 300, category: 'ADMIN', difficulty: 'MAINS', questionIds: ['q_22_1', 'q_22_2', 'q_22_3', 'q_22_4', 'q_22_5', 'q_22_6', 'q_22_7', 'q_22_8', 'q_22_9', 'q_22_10'], chapterIds: ['p-magnetism', 'm-pnc', 'c-solutions'] }
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
  chapters: generateMockChapters(),
  connectedParent: undefined,
  pendingInvitations: []
};
