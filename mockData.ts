
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
    { id: 'jee-main-2024', name: 'JEE Main 2024 Official', duration: 180, totalMarks: 300, category: 'ADMIN', difficulty: 'MAINS', questionIds: ['q_24_1', 'q_24_2', 'q_24_3', 'q_24_4', 'q_24_5', 'q_24_6', 'q_24_7', 'q_24_8'], chapterIds: ['p-units', 'm-sets', 'c-basic'] },
    { id: 'jee-main-2023', name: 'JEE Main 2023 Official', duration: 180, totalMarks: 300, category: 'ADMIN', difficulty: 'MAINS', questionIds: ['q_23_1', 'q_23_2', 'q_23_3', 'q_23_4', 'q_23_5', 'q_23_6', 'q_23_7', 'q_23_8'], chapterIds: ['p-kinematics', 'm-complex', 'c-atomic'] },
    { id: 'jee-main-2022', name: 'JEE Main 2022 Official', duration: 180, totalMarks: 300, category: 'ADMIN', difficulty: 'MAINS', questionIds: ['q_22_1', 'q_22_2', 'q_22_3', 'q_22_4', 'q_22_5', 'q_22_6', 'q_22_7', 'q_22_8'], chapterIds: ['p-magnetism', 'm-pnc', 'c-solutions'] },
    { id: 'jee-main-2021', name: 'JEE Main 2021 Official', duration: 180, totalMarks: 300, category: 'ADMIN', difficulty: 'MAINS', questionIds: ['q_21_1', 'q_21_2', 'q_21_3', 'q_21_4', 'q_21_5', 'q_21_6', 'q_21_7', 'q_21_8'], chapterIds: ['p-oscillations', 'm-3d-geo', 'c-halogens'] },
    { id: 'jee-main-2020', name: 'JEE Main 2020 Official', duration: 180, totalMarks: 300, category: 'ADMIN', difficulty: 'MAINS', questionIds: ['q_20_1', 'q_20_2', 'q_20_3', 'q_20_4', 'q_20_5', 'q_20_6', 'q_20_7', 'q_20_8'], chapterIds: ['m-calculus-integral', 'p-thermo', 'c-equilibrium'] },
    { id: 'jee-main-2019', name: 'JEE Main 2019 Official', duration: 180, totalMarks: 300, category: 'ADMIN', difficulty: 'MAINS', questionIds: ['q_19_1', 'q_19_2', 'q_19_3', 'q_19_4', 'q_19_5', 'q_19_6', 'q_19_7', 'q_19_8'], chapterIds: ['c-periodicity', 'p-kinematics', 'm-complex'] },
    { id: 'jee-main-2018', name: 'JEE Main 2018 Official', duration: 180, totalMarks: 300, category: 'ADMIN', difficulty: 'MAINS', questionIds: ['q_18_1', 'q_18_2', 'q_18_3', 'q_18_4', 'q_18_5', 'q_18_6', 'q_18_7', 'q_18_8'], chapterIds: ['p-emwaves', 'm-matrices', 'c-redox-electro'] },
    { id: 'jee-main-2017', name: 'JEE Main 2017 Official', duration: 180, totalMarks: 300, category: 'ADMIN', difficulty: 'MAINS', questionIds: ['q_17_1', 'q_17_2', 'q_17_3', 'q_17_4', 'q_17_5', 'q_17_6', 'q_17_7', 'q_17_8'], chapterIds: ['m-binomial', 'p-lom', 'c-kinetics'] },
    { id: 'jee-main-2016', name: 'JEE Main 2016 Official', duration: 180, totalMarks: 300, category: 'ADMIN', difficulty: 'MAINS', questionIds: ['q_16_1', 'q_16_2', 'q_16_3', 'q_16_4', 'q_16_5', 'q_16_6', 'q_16_7', 'q_16_8'], chapterIds: ['c-equilibrium', 'p-wep', 'm-sequence'] },
    { id: 'jee-main-2015', name: 'JEE Main 2015 Official', duration: 180, totalMarks: 300, category: 'ADMIN', difficulty: 'MAINS', questionIds: ['q_15_1', 'q_15_2', 'q_15_3', 'q_15_4', 'q_15_5', 'q_15_6', 'q_15_7', 'q_15_8'], chapterIds: ['p-units', 'c-bonding', 'm-calculus-limit'] }
  ],
  questions: [
    // --- 2024 ---
    { id: 'q_24_1', topicId: 'p-units', subject: 'Physics', text: "A capacitor of 10 μF is charged to 50V. The energy stored in the capacitor is:", options: ["12.5 mJ", "25 mJ", "0.125 J", "1.25 J"], correctAnswer: 0, explanation: "E = 1/2 CV² = 0.5 * 10e-6 * (50)² = 12.5 mJ.", difficulty: 'EASY' },
    { id: 'q_24_2', topicId: 'm-sets', subject: 'Mathematics', text: "Number of subsets of a set containing 5 elements is:", options: ["5", "10", "25", "32"], correctAnswer: 3, explanation: "2^5 = 32.", difficulty: 'EASY' },
    { id: 'q_24_3', topicId: 'c-basic', subject: 'Chemistry', text: "Oxidation state of Cr in K2Cr2O7 is:", options: ["+3", "+6", "+4", "+2"], correctAnswer: 1, explanation: "2x = 12 => x = +6.", difficulty: 'EASY' },
    { id: 'q_24_4', topicId: 'p-kinematics', subject: 'Physics', text: "Average speed of a car covering halves at 40 and 60 km/h:", options: ["50", "48", "52", "45"], correctAnswer: 1, explanation: "2v1v2/(v1+v2) = 48.", difficulty: 'MEDIUM' },
    { id: 'q_24_5', topicId: 'm-complex', subject: 'Mathematics', text: "Locus of |z-4| < |z-2| is:", options: ["x > 3", "x < 3", "y > 0", "Circle"], correctAnswer: 0, explanation: "Bisector is x=3.", difficulty: 'MEDIUM' },
    { id: 'q_24_6', topicId: 'c-atomic', subject: 'Chemistry', text: "Radial nodes in 3s orbital:", options: ["0", "1", "2", "3"], correctAnswer: 2, explanation: "n-l-1 = 3-0-1 = 2.", difficulty: 'EASY' },
    { id: 'q_24_7', topicId: 'p-lom', subject: 'Physics', text: "Work done if F=5i+2j and d=2i+3j:", options: ["10", "6", "16", "20"], correctAnswer: 2, explanation: "5*2 + 2*3 = 16.", difficulty: 'EASY' },
    { id: 'q_24_8', topicId: 'm-matrices', subject: 'Mathematics', text: "If |A|=5 for 3x3 matrix, |2A| is:", options: ["10", "40", "20", "80"], correctAnswer: 1, explanation: "2^3 * 5 = 40.", difficulty: 'MEDIUM' },
    
    // --- 2023 ---
    { id: 'q_23_1', topicId: 'p-optics', subject: 'Physics', text: "Focal length of convex lens (f=20) in water (u=1.33) approx:", options: ["20", "40", "80", "10"], correctAnswer: 2, explanation: "f_w ≈ 4 * f_a.", difficulty: 'HARD' },
    { id: 'q_23_2', topicId: 'm-calculus-limit', subject: 'Mathematics', text: "Limit x->0 (sin x / x):", options: ["0", "1", "Inf", "NaN"], correctAnswer: 1, explanation: "Standard result.", difficulty: 'EASY' },
    { id: 'q_23_3', topicId: 'c-redox-electro', subject: 'Chemistry', text: "Strongest reducing agent among Li, Na, K, Cs:", options: ["Li", "Na", "K", "Cs"], correctAnswer: 0, explanation: "Most negative SRP.", difficulty: 'EASY' },
    { id: 'q_23_4', topicId: 'p-electrostatics', subject: 'Physics', text: "Field inside hollow charged sphere:", options: ["Uniform", "Zero", "Variable", "Max"], correctAnswer: 1, explanation: "Gauss law.", difficulty: 'EASY' },
    { id: 'q_23_5', topicId: 'm-sequence', subject: 'Mathematics', text: "Sum of 1, 1/2, 1/4...:", options: ["1", "1.5", "2", "Inf"], correctAnswer: 2, explanation: "a/(1-r).", difficulty: 'EASY' },
    { id: 'q_23_6', topicId: 'c-goc', subject: 'Chemistry', text: "Which effect is temporary?", options: ["Inductive", "Resonance", "Electromeric", "Hyperconjugation"], correctAnswer: 2, explanation: "Only in presence of reagent.", difficulty: 'EASY' },
    { id: 'q_23_7', topicId: 'p-current', subject: 'Physics', text: "Color code for 47k Ohm 5%:", options: ["Yellow-Violet-Orange-Gold", "Blue-Grey-Orange-Gold", "Yellow-Violet-Red-Silver", "None"], correctAnswer: 0, explanation: "4, 7, x10^3, 5%.", difficulty: 'MEDIUM' },
    { id: 'q_23_8', topicId: 'm-trigo', subject: 'Mathematics', text: "Value of sin 15 deg:", options: ["(v3-1)/2v2", "(v3+1)/2v2", "1/2", "v3/2"], correctAnswer: 0, explanation: "sin(45-30).", difficulty: 'MEDIUM' },

    // --- 2022 ---
    { id: 'q_22_1', topicId: 'p-magnetism', subject: 'Physics', text: "SI unit of Magnetic Flux:", options: ["Tesla", "Weber", "Gauss", "Henry"], correctAnswer: 1, explanation: "Weber = B*A.", difficulty: 'EASY' },
    { id: 'q_22_2', topicId: 'm-pnc', subject: 'Mathematics', text: "Ways to arrange 'APPLE':", options: ["120", "60", "24", "100"], correctAnswer: 1, explanation: "5!/2!.", difficulty: 'EASY' },
    { id: 'q_22_3', topicId: 'c-solutions', subject: 'Chemistry', text: "Colligative properties depend on:", options: ["Nature", "Count", "Volume", "Density"], correctAnswer: 1, explanation: "Number of particles.", difficulty: 'EASY' },
    { id: 'q_22_4', topicId: 'p-emi-ac', subject: 'Physics', text: "In pure L circuit, I ____ V by 90:", options: ["Leads", "Lags", "In Phase", "None"], correctAnswer: 1, explanation: "Lags.", difficulty: 'EASY' },
    { id: 'q_22_5', topicId: 'm-diff-eq', subject: 'Mathematics', text: "Degree of (dy/dx)^2 + y = 0:", options: ["1", "2", "3", "NaN"], correctAnswer: 1, explanation: "Power of highest derivative.", difficulty: 'EASY' },
    { id: 'q_22_6', topicId: 'c-kinetics', subject: 'Chemistry', text: "Unit of k for 1st order:", options: ["mol/L/s", "L/mol/s", "s-1", "None"], correctAnswer: 2, explanation: "Time inverse.", difficulty: 'EASY' },
    { id: 'q_22_7', topicId: 'p-electronics', subject: 'Physics', text: "Boolean for NAND:", options: ["A+B", "AB", "!(A+B)", "!(AB)"], correctAnswer: 3, explanation: "!(AB).", difficulty: 'EASY' },
    { id: 'q_22_8', topicId: 'm-stats', subject: 'Mathematics', text: "Variance of first n natural numbers:", options: ["(n2-1)/12", "(n2-1)/6", "n/2", "n2/4"], correctAnswer: 0, explanation: "Formulaic.", difficulty: 'MEDIUM' },

    // --- 2021 ---
    { id: 'q_21_1', topicId: 'p-oscillations', subject: 'Physics', text: "Total E in SHM proportional to:", options: ["A", "A2", "1/A", "vA"], correctAnswer: 1, explanation: "1/2 k A2.", difficulty: 'EASY' },
    { id: 'q_21_2', topicId: 'm-3d-geo', subject: 'Mathematics', text: "Angle between x+y+z=1 and x+y+z=5:", options: ["0", "90", "45", "180"], correctAnswer: 0, explanation: "Parallel planes.", difficulty: 'EASY' },
    { id: 'q_21_3', topicId: 'c-halogens', subject: 'Chemistry', text: "Liquid halogen at RT:", options: ["F", "Cl", "Br", "I"], correctAnswer: 2, explanation: "Bromine.", difficulty: 'EASY' },
    { id: 'q_21_4', topicId: 'p-atoms', subject: 'Physics', text: "IE of H-atom:", options: ["13.6", "-13.6", "0", "10.2"], correctAnswer: 0, explanation: "Energy to remove electron.", difficulty: 'EASY' },
    { id: 'q_21_5', topicId: 'm-coord-geo', subject: 'Mathematics', text: "Eccentricity of rectangular hyperbola:", options: ["1", "v2", "2", "v3"], correctAnswer: 1, explanation: "v(1+1) = v2.", difficulty: 'MEDIUM' },
    { id: 'q_21_6', topicId: 'c-nitrogen', subject: 'Chemistry', text: "Hoffmann Bromamide gives:", options: ["1 amine", "2 amine", "3 amine", "Amide"], correctAnswer: 0, explanation: "Primary amine.", difficulty: 'MEDIUM' },
    { id: 'q_21_7', topicId: 'p-solids', subject: 'Physics', text: "Young modulus of rigid body:", options: ["0", "Inf", "1", "Var"], correctAnswer: 1, explanation: "No strain.", difficulty: 'EASY' },
    { id: 'q_21_8', topicId: 'm-vectors', subject: 'Mathematics', text: "If dot product is 0, |a+b| is:", options: ["7", "1", "5", "12"], correctAnswer: 2, explanation: "v(3^2+4^2).", difficulty: 'EASY' },

    // --- Generic / Filling 2015-2020 ---
    { id: 'q_20_1', topicId: 'm-calculus-integral', subject: 'Mathematics', text: "Integral of sec^2 x:", options: ["tan x", "cot x", "sec x", "log x"], correctAnswer: 0, explanation: "Basic.", difficulty: 'EASY' },
    { id: 'q_19_1', topicId: 'c-periodicity', subject: 'Chemistry', text: "Highest electronegativity:", options: ["O", "F", "Cl", "N"], correctAnswer: 1, explanation: "Fluorine.", difficulty: 'EASY' },
    { id: 'q_18_1', topicId: 'p-emwaves', subject: 'Physics', text: "Speed c equals:", options: ["1/v(ue)", "ue", "v(ue)", "u/e"], correctAnswer: 0, explanation: "Maxwell.", difficulty: 'EASY' },
    { id: 'q_17_1', topicId: 'm-binomial', subject: 'Mathematics', text: "Terms in (x+y)^10:", options: ["10", "11", "9", "20"], correctAnswer: 1, explanation: "n+1.", difficulty: 'EASY' },
    { id: 'q_16_1', topicId: 'c-equilibrium', subject: 'Chemistry', text: "pH of 0.01M HCl:", options: ["1", "2", "3", "0"], correctAnswer: 1, explanation: "-log(0.01).", difficulty: 'EASY' },
    { id: 'q_15_1', topicId: 'p-units', subject: 'Physics', text: "Dimension of Force:", options: ["MLT-2", "ML2T-2", "MLT-1", "None"], correctAnswer: 0, explanation: "F=ma.", difficulty: 'EASY' }
  ],
  chapters: [
    // MATHEMATICS - Grouped by Chapter Names as Units
    { id: 'm-sets', subject: 'Mathematics', unit: 'Sets, Relations and Functions', name: 'Sets & Relations Core', progress: 15, accuracy: 75, timeSpent: 3600, timeSpentNotes: 1200, timeSpentVideos: 800, timeSpentPractice: 1000, timeSpentTests: 600, status: 'LEARNING', notes: "<h2>Sets & Functions</h2><p>A set is a well-defined collection of objects.</p>" },
    { id: 'm-complex', subject: 'Mathematics', unit: 'Complex Numbers and Quadratic Equations', name: 'Complex Roots & Plane', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED', notes: "<h2>Complex Algebra</h2><p>z = a+ib form.</p>" },
    { id: 'm-matrices', subject: 'Mathematics', unit: 'Matrices and Determinants', name: 'Matrix Algebra', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'm-pnc', subject: 'Mathematics', unit: 'Permutations and Combinations', name: 'Selection & Arrangement', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'm-binomial', subject: 'Mathematics', unit: 'Binomial Theorem', name: 'Expansion & Power Series', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'm-sequence', subject: 'Mathematics', unit: 'Sequence and Series', name: 'Progression Mastery', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'm-calculus-limit', subject: 'Mathematics', unit: 'Limit, Continuity and Differentiability', name: 'Limits & Differentiation', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'm-calculus-integral', subject: 'Mathematics', unit: 'Integral Calculus', name: 'Anti-derivatives', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'm-diff-eq', subject: 'Mathematics', unit: 'Differential Equations', name: 'ODE Solutions', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'm-coord-geo', subject: 'Mathematics', unit: 'Co-ordinate Geometry', name: 'Lines, Circles, Conics', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'm-3d-geo', subject: 'Mathematics', unit: 'Three Dimensional Geometry', name: 'Spatial Analysis', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'm-vectors', subject: 'Mathematics', unit: 'Vector Algebra', name: 'Dot & Cross Products', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'm-stats', subject: 'Mathematics', unit: 'Statistics and Probability', name: 'Data & Probability', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'm-trigo', subject: 'Mathematics', unit: 'Trigonometry', name: 'Identities & Functions', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },

    // PHYSICS
    { id: 'p-units', subject: 'Physics', unit: 'Units and Measurements', name: 'Dimensions & SI', progress: 40, accuracy: 85, timeSpent: 7200, timeSpentNotes: 2400, timeSpentVideos: 1800, timeSpentPractice: 2000, timeSpentTests: 1000, status: 'LEARNING' },
    { id: 'p-kinematics', subject: 'Physics', unit: 'Kinematics', name: '1D & 2D Motion', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'p-lom', subject: 'Physics', unit: 'Laws of Motion', name: 'Newtonian Dynamics', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'p-wep', subject: 'Physics', unit: 'Work, Energy and Power', name: 'Conservative Forces', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'p-rotational', subject: 'Physics', unit: 'Rotational Motion', name: 'Angular Momentum', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'p-gravitation', subject: 'Physics', unit: 'Gravitation', name: 'Planetary Fields', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'p-solids', subject: 'Physics', unit: 'Properties of Solids and Liquids', name: 'Elasticity & Fluids', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'p-thermo', subject: 'Physics', unit: 'Thermodynamics', name: 'Thermal Laws', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'p-ktg', subject: 'Physics', unit: 'Kinetic Theory of Gases', name: 'Gas Equations', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'p-oscillations', subject: 'Physics', unit: 'Oscillations and Waves', name: 'SHM & Doppler', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'p-electrostatics', subject: 'Physics', unit: 'Electrostatics', name: 'Charge & Fields', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'p-current', subject: 'Physics', unit: 'Current Electricity', name: 'Circuit Network', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'p-magnetism', subject: 'Physics', unit: 'Magnetic Effects of Current and Magnetism', name: 'Lorentz & Biot-Savart', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'p-emi-ac', subject: 'Physics', unit: 'Electromagnetic Induction and Alternating Currents', name: 'AC & Inductance', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'p-emwaves', subject: 'Physics', unit: 'Electromagnetic Waves', name: 'Maxwell Theory', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'p-optics', subject: 'Physics', unit: 'Optics', name: 'Ray & Wave Master', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'p-dualnature', subject: 'Physics', unit: 'Dual Nature of Matter and Radiation', name: 'Quantum Basics', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'p-atoms', subject: 'Physics', unit: 'Atoms and Nuclei', name: 'Nuclear Structure', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'p-electronics', subject: 'Physics', unit: 'Electronic Devices', name: 'Semiconductors', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'p-experimental', subject: 'Physics', unit: 'Experimental Skills', name: 'Lab Observations', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },

    // CHEMISTRY
    { id: 'c-basic', subject: 'Chemistry', unit: 'Some Basic Concepts in Chemistry', name: 'Mole Concept', progress: 20, accuracy: 60, timeSpent: 2400, timeSpentNotes: 800, timeSpentVideos: 600, timeSpentPractice: 600, timeSpentTests: 400, status: 'LEARNING' },
    { id: 'c-atomic', subject: 'Chemistry', unit: 'Atomic Structure', name: 'Quantum Models', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'c-bonding', subject: 'Chemistry', unit: 'Chemical Bonding and Molecular Structure', name: 'Valence & MOT', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'c-thermo', subject: 'Chemistry', unit: 'Chemical Thermodynamics', name: 'Enthalpy & ΔG', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'c-solutions', subject: 'Chemistry', unit: 'Solutions', name: 'Raoult & Colligative', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'c-equilibrium', subject: 'Chemistry', unit: 'Equilibrium', name: 'Ionic & Chemical', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'c-redox-electro', subject: 'Chemistry', unit: 'Redox Reactions and Electrochemistry', name: 'Galvanic Systems', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'c-kinetics', subject: 'Chemistry', unit: 'Chemical Kinetics', name: 'Rate Dynamics', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'c-periodicity', subject: 'Chemistry', unit: 'Classification of Elements and Periodicity in Properties', name: 'Trends & Radius', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'c-pblock', subject: 'Chemistry', unit: 'p-Block Elements', name: 'Main Group Elements', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'c-dfblock', subject: 'Chemistry', unit: 'd - and f- Block Elements', name: 'Transition Metals', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'c-coordination', subject: 'Chemistry', unit: 'Coordination Compounds', name: 'Ligands & Werner', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'c-purification', subject: 'Chemistry', unit: 'Purification and Characterisation of Organic Compounds', name: 'Analytical Tools', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'c-goc', subject: 'Chemistry', unit: 'Some Basic Principles of Organic Chemistry', name: 'General Organic (GOC)', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'c-hydrocarbons', subject: 'Chemistry', unit: 'Hydrocarbons', name: 'Alkanes/Alkenes/Benzene', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'c-halogens', subject: 'Chemistry', unit: 'Organic Compounds Containing Halogens', name: 'SN1/SN2 Mechanism', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'c-oxygen', subject: 'Chemistry', unit: 'Organic Compounds Containing Oxygen', name: 'Alcohols & Carbonyls', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'c-nitrogen', subject: 'Chemistry', unit: 'Organic Compounds Containing Nitrogen', name: 'Amines & Diazonium', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'c-biomolecules', subject: 'Chemistry', unit: 'Biomolecules', name: 'Proteins & Glucose', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' },
    { id: 'c-practical', subject: 'Chemistry', unit: 'Principles Related to Practical Chemistry', name: 'Lab Methods', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED' }
  ],
  connectedParent: {
    name: "Mr. Ramesh Sharma",
    id: "P-4402",
    linkedSince: "2025-11-15"
  }
};
