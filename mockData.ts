
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
      id: 'jee-main-2024', 
      name: 'JEE Main 2024 - January Session Official', 
      duration: 180, 
      totalMarks: 300, 
      category: 'ADMIN', 
      difficulty: 'MAINS', 
      questionIds: ['q_24_1', 'q_24_2', 'q_24_3', 'q_24_4', 'q_24_5', 'q_24_6', 'q_24_7', 'q_24_8', 'q_24_9', 'q_24_10'],
      chapterIds: ['p-units', 'm-sets', 'c-basic'] 
    },
    { 
      id: 'jee-main-2023', 
      name: 'JEE Main 2023 - Session 2 Official', 
      duration: 180, 
      totalMarks: 300, 
      category: 'ADMIN', 
      difficulty: 'MAINS', 
      questionIds: ['q_23_1', 'q_23_2', 'q_23_3', 'q_23_4', 'q_23_5', 'q_23_6', 'q_23_7', 'q_23_8', 'q_23_9', 'q_23_10'],
      chapterIds: ['p-kinematics', 'm-complex', 'c-atomic']
    },
    { 
      id: 'jee-main-2022', 
      name: 'JEE Main 2022 - Full Syllabus Paper', 
      duration: 180, 
      totalMarks: 300, 
      category: 'ADMIN', 
      difficulty: 'MAINS', 
      questionIds: ['q_22_1', 'q_22_2', 'q_22_3', 'q_22_4', 'q_22_5', 'q_22_6', 'q_22_7', 'q_22_8', 'q_22_9', 'q_22_10'],
      chapterIds: ['p-units', 'm-sets']
    },
    { 
      id: 'jee-main-2021', 
      name: 'JEE Main 2021 - March Session Official', 
      duration: 180, 
      totalMarks: 300, 
      category: 'ADMIN', 
      difficulty: 'MAINS', 
      questionIds: ['q_21_1', 'q_21_2', 'q_21_3', 'q_21_4', 'q_21_5', 'q_21_6', 'q_21_7', 'q_21_8', 'q_21_9', 'q_21_10'],
      chapterIds: ['p-kinematics', 'c-basic']
    },
    { 
      id: 'jee-main-2020', 
      name: 'JEE Main 2020 - September Session Official', 
      duration: 180, 
      totalMarks: 300, 
      category: 'ADMIN', 
      difficulty: 'MAINS', 
      questionIds: ['q_20_1', 'q_20_2', 'q_20_3', 'q_20_4', 'q_20_5', 'q_20_6', 'q_20_7', 'q_20_8', 'q_20_9', 'q_20_10'],
      chapterIds: ['p-units', 'm-sets']
    },
    { 
      id: 'jee-main-2019', 
      name: 'JEE Main 2019 - January Session Official', 
      duration: 180, 
      totalMarks: 300, 
      category: 'ADMIN', 
      difficulty: 'MAINS', 
      questionIds: ['q_19_1', 'q_19_2', 'q_19_3', 'q_19_4', 'q_19_5', 'q_19_6', 'q_19_7', 'q_19_8', 'q_19_9', 'q_19_10'],
      chapterIds: ['p-units', 'm-complex', 'c-atomic']
    },
    { 
      id: 'jee-main-2018', 
      name: 'JEE Main 2018 - Offline Official Paper', 
      duration: 180, 
      totalMarks: 300, 
      category: 'ADMIN', 
      difficulty: 'MAINS', 
      questionIds: ['q_18_1', 'q_18_2', 'q_18_3', 'q_18_4', 'q_18_5', 'q_18_6', 'q_18_7', 'q_18_8', 'q_18_9', 'q_18_10'],
      chapterIds: ['p-units', 'm-sets']
    },
    { 
      id: 'jee-main-2017', 
      name: 'JEE Main 2017 - Official Paper', 
      duration: 180, 
      totalMarks: 300, 
      category: 'ADMIN', 
      difficulty: 'MAINS', 
      questionIds: ['q_17_1', 'q_17_2', 'q_17_3', 'q_17_4', 'q_17_5', 'q_17_6', 'q_17_7', 'q_17_8', 'q_17_9', 'q_17_10'],
      chapterIds: ['p-kinematics', 'c-basic']
    },
    { 
      id: 'jee-main-2016', 
      name: 'JEE Main 2016 - Official Paper', 
      duration: 180, 
      totalMarks: 300, 
      category: 'ADMIN', 
      difficulty: 'MAINS', 
      questionIds: ['q_16_1', 'q_16_2', 'q_16_3', 'q_16_4', 'q_16_5', 'q_16_6', 'q_16_7', 'q_16_8', 'q_16_9', 'q_16_10'],
      chapterIds: ['p-units', 'm-sets']
    },
    { 
      id: 'jee-main-2015', 
      name: 'JEE Main 2015 - Official Paper', 
      duration: 180, 
      totalMarks: 300, 
      category: 'ADMIN', 
      difficulty: 'MAINS', 
      questionIds: ['q_15_1', 'q_15_2', 'q_15_3', 'q_15_4', 'q_15_5', 'q_15_6', 'q_15_7', 'q_15_8', 'q_15_9', 'q_15_10'],
      chapterIds: ['p-units', 'c-basic']
    }
  ],
  questions: [
    // --- 2024 SET ---
    { id: 'q_24_1', topicId: 'p-units', subject: 'Physics', text: "A capacitor of 10 μF is charged to 50V. The energy stored in the capacitor is:", options: ["12.5 mJ", "25 mJ", "0.125 J", "1.25 J"], correctAnswer: 0, explanation: "E = 1/2 CV² = 0.5 * 10e-6 * (50)² = 0.5 * 10e-6 * 2500 = 12.5 mJ.", difficulty: 'EASY' },
    { id: 'q_24_2', topicId: 'm-sets', subject: 'Mathematics', text: "The set of all values of x for which log(x-1) is defined is:", options: ["x > 0", "x > 1", "x ≥ 1", "x < 1"], correctAnswer: 1, explanation: "Argument of log must be positive: x-1 > 0 => x > 1.", difficulty: 'EASY' },
    { id: 'q_24_3', topicId: 'c-basic', subject: 'Chemistry', text: "The oxidation state of Cr in K₂Cr₂O₇ is:", options: ["+3", "+6", "+4", "+2"], correctAnswer: 1, explanation: "2(1) + 2x + 7(-2) = 0 => 2x = 12 => x = +6.", difficulty: 'EASY' },
    { id: 'q_24_4', topicId: 'p-kinematics', subject: 'Physics', text: "A car covers first half distance with speed 40 km/h and second half with 60 km/h. Average speed is:", options: ["50 km/h", "48 km/h", "52 km/h", "45 km/h"], correctAnswer: 1, explanation: "Vavg = 2v1v2 / (v1+v2) = 2*40*60 / 100 = 48 km/h.", difficulty: 'MEDIUM' },
    { id: 'q_24_5', topicId: 'm-complex', subject: 'Mathematics', text: "If |z - 4| < |z - 2|, its locus is:", options: ["Re(z) > 3", "Re(z) < 3", "Im(z) > 0", "Circle"], correctAnswer: 0, explanation: "Distance from 4 is less than distance from 2. Bisector is x=3. So x > 3.", difficulty: 'MEDIUM' },
    { id: 'q_24_6', topicId: 'c-atomic', subject: 'Chemistry', text: "Which orbital has two radial nodes?", options: ["2s", "3s", "3p", "4d"], correctAnswer: 1, explanation: "Radial nodes = n - l - 1. For 3s: 3 - 0 - 1 = 2.", difficulty: 'EASY' },
    { id: 'q_24_7', topicId: 'p-lom', subject: 'Physics', text: "Force F = 5i + 2j. Displacement d = 2i + 3j. Work done is:", options: ["10 J", "6 J", "16 J", "20 J"], correctAnswer: 2, explanation: "W = F·d = (5*2) + (2*3) = 10 + 6 = 16 J.", difficulty: 'EASY' },
    { id: 'q_24_8', topicId: 'm-matrices', subject: 'Mathematics', text: "If A is a 3x3 matrix and |A|=5, then |2A| is:", options: ["10", "40", "20", "80"], correctAnswer: 1, explanation: "|kA| = k^n |A|. For n=3, 2³ * 5 = 8 * 5 = 40.", difficulty: 'MEDIUM' },
    { id: 'q_24_9', topicId: 'c-bonding', subject: 'Chemistry', text: "The shape of XeF₄ molecule is:", options: ["Tetrahedral", "Square Planar", "Octahedral", "Pyramidal"], correctAnswer: 1, explanation: "Xe has 8 valence electrons. 4 bonds + 2 lone pairs = sp³d². Square planar due to lone pairs.", difficulty: 'MEDIUM' },
    { id: 'q_24_10', topicId: 'p-thermo', subject: 'Physics', text: "Efficiency of a Carnot engine between 27°C and 127°C is:", options: ["25%", "33%", "50%", "75%"], correctAnswer: 0, explanation: "η = 1 - T2/T1 = 1 - 300/400 = 0.25 = 25%.", difficulty: 'MEDIUM' },

    // --- 2023 SET ---
    { id: 'q_23_1', topicId: 'p-optics', subject: 'Physics', text: "Focal length of a convex lens in air is 20cm. In water (μ=1.33), it becomes approx:", options: ["20cm", "40cm", "80cm", "10cm"], correctAnswer: 2, explanation: "Using lens maker formula, f_water ≈ 4 * f_air.", difficulty: 'HARD' },
    { id: 'q_23_2', topicId: 'm-calculus-limit', subject: 'Mathematics', text: "Limit x->0 of (sin x / x) is:", options: ["0", "1", "Infinity", "Undefined"], correctAnswer: 1, explanation: "Standard limit result.", difficulty: 'EASY' },
    { id: 'q_23_3', topicId: 'c-redox-electro', subject: 'Chemistry', text: "The strongest reducing agent among following is:", options: ["Li", "Na", "K", "Cs"], correctAnswer: 0, explanation: "Lithium has the most negative reduction potential.", difficulty: 'EASY' },
    { id: 'q_23_4', topicId: 'p-electrostatics', subject: 'Physics', text: "Electric field inside a hollow charged sphere is:", options: ["Uniform", "Zero", "Variable", "Maximum"], correctAnswer: 1, explanation: "By Gauss's law, enclosed charge is zero.", difficulty: 'EASY' },
    { id: 'q_23_5', topicId: 'm-sequence', subject: 'Mathematics', text: "Sum of infinite GP: 1, 1/2, 1/4... is:", options: ["1", "1.5", "2", "Infinity"], correctAnswer: 2, explanation: "S = a / (1-r) = 1 / (1 - 0.5) = 2.", difficulty: 'EASY' },
    { id: 'q_23_6', topicId: 'c-goc', subject: 'Chemistry', text: "Which effect is permanent?", options: ["Inductive", "Electromeric", "Inductomeric", "None"], correctAnswer: 0, explanation: "Inductive and Resonance are permanent, Electromeric is temporary.", difficulty: 'EASY' },
    { id: 'q_23_7', topicId: 'p-current', subject: 'Physics', text: "Color code for a 47kΩ resistor with 5% tolerance is:", options: ["Yellow-Violet-Orange-Gold", "Yellow-Violet-Red-Silver", "Blue-Grey-Orange-Gold", "Yellow-Violet-Yellow-Gold"], correctAnswer: 0, explanation: "4(Yellow) 7(Violet) x10³(Orange) ±5%(Gold).", difficulty: 'MEDIUM' },
    { id: 'q_23_8', topicId: 'm-trigo', subject: 'Mathematics', text: "Value of sin(15°) is:", options: ["(√3-1)/2√2", "(√3+1)/2√2", "1/2", "√3/2"], correctAnswer: 0, explanation: "sin(45-30) = sin45 cos30 - cos45 sin30 = (1/√2 * √3/2) - (1/√2 * 1/2) = (√3-1)/2√2.", difficulty: 'MEDIUM' },
    { id: 'q_23_9', topicId: 'c-hydrocarbons', subject: 'Chemistry', text: "Ozonolysis of 2-Butene gives:", options: ["Methanol", "Ethanol", "Ethanal", "Propanal"], correctAnswer: 2, explanation: "CH3-CH=CH-CH3 breaks to 2 molecules of CH3CHO.", difficulty: 'MEDIUM' },
    { id: 'q_23_10', topicId: 'p-dualnature', subject: 'Physics', text: "De Broglie wavelength of electron accelerated by 100V is approx:", options: ["1.227 Å", "12.27 Å", "0.122 Å", "122 Å"], correctAnswer: 0, explanation: "λ = 12.27 / √V Å. For V=100, λ = 1.227 Å.", difficulty: 'MEDIUM' },

    // --- 2022 SET ---
    { id: 'q_22_1', topicId: 'p-magnetism', subject: 'Physics', text: "SI unit of Magnetic Flux is:", options: ["Tesla", "Weber", "Gauss", "Henry"], correctAnswer: 1, explanation: "Flux = B*A, units is Weber.", difficulty: 'EASY' },
    { id: 'q_22_2', topicId: 'm-pnc', subject: 'Mathematics', text: "Number of ways to arrange word 'APPLE' is:", options: ["120", "60", "24", "100"], correctAnswer: 1, explanation: "5! / 2! (for P repeating) = 120 / 2 = 60.", difficulty: 'EASY' },
    { id: 'q_22_3', topicId: 'c-solutions', subject: 'Chemistry', text: "Colligative properties depend on:", options: ["Nature of solute", "Number of particles", "Nature of solvent", "Temperature"], correctAnswer: 1, explanation: "Defined as properties depending only on particle count.", difficulty: 'EASY' },
    { id: 'q_22_4', topicId: 'p-emi-ac', subject: 'Physics', text: "In a pure inductive circuit, current ____ voltage by 90°.", options: ["Leads", "Lags", "Is in phase with", "None"], correctAnswer: 1, explanation: "CIVIL rule: In L, I lags V.", difficulty: 'EASY' },
    { id: 'q_22_5', topicId: 'm-diff-eq', subject: 'Mathematics', text: "The degree of (dy/dx)² + y = 0 is:", options: ["1", "2", "3", "Not defined"], correctAnswer: 1, explanation: "Degree is the power of highest order derivative.", difficulty: 'EASY' },
    { id: 'q_22_6', topicId: 'c-kinetics', subject: 'Chemistry', text: "Units of rate constant for 1st order reaction:", options: ["mol/L/s", "L/mol/s", "s⁻¹", "mol²/L²/s"], correctAnswer: 2, explanation: "Rate = k[A]. Units of k = Rate/[A] = (mol/L/s) / (mol/L) = s⁻¹.", difficulty: 'EASY' },
    { id: 'q_22_7', topicId: 'p-electronics', subject: 'Physics', text: "Boolean expression for NAND gate is:", options: ["A+B", "A·B", "!(A+B)", "!(A·B)"], correctAnswer: 3, explanation: "NAND is NOT of AND.", difficulty: 'EASY' },
    { id: 'q_22_8', topicId: 'm-stats', subject: 'Mathematics', text: "Variance of first n natural numbers is:", options: ["(n²-1)/12", "(n²-1)/6", "n/2", "n²/4"], correctAnswer: 0, explanation: "Standard formula for variance.", difficulty: 'MEDIUM' },
    { id: 'q_22_9', topicId: 'c-biomolecules', subject: 'Chemistry', text: "Which vitamin is water soluble?", options: ["A", "D", "E", "C"], correctAnswer: 3, explanation: "B and C are water soluble, ADEK are fat soluble.", difficulty: 'EASY' },
    { id: 'q_22_10', topicId: 'p-gravitation', subject: 'Physics', text: "Escape velocity from Earth is approx:", options: ["9.8 km/s", "11.2 km/s", "42 km/s", "7.9 km/s"], correctAnswer: 1, explanation: "Standard value √2gR ≈ 11.2 km/s.", difficulty: 'EASY' },

    // --- 2021 SET ---
    { id: 'q_21_1', topicId: 'p-oscillations', subject: 'Physics', text: "Total energy of a particle in SHM is proportional to:", options: ["Amplitude", "Amplitude²", "1/Amplitude", "√Amplitude"], correctAnswer: 1, explanation: "E = 1/2 k A².", difficulty: 'EASY' },
    { id: 'q_21_2', topicId: 'm-3d-geo', subject: 'Mathematics', text: "Angle between two planes x+y+z=1 and x+y+z=5 is:", options: ["0°", "90°", "45°", "180°"], correctAnswer: 0, explanation: "Normals are same (1,1,1), so planes are parallel.", difficulty: 'EASY' },
    { id: 'q_21_3', topicId: 'c-halogens', subject: 'Chemistry', text: "Which halogen is liquid at room temp?", options: ["F₂", "Cl₂", "Br₂", "I₂"], correctAnswer: 2, explanation: "Bromine is the only liquid non-metal.", difficulty: 'EASY' },
    { id: 'q_21_4', topicId: 'p-atoms', subject: 'Physics', text: "Ionization energy of Hydrogen atom is:", options: ["13.6 eV", "-13.6 eV", "0 eV", "10.2 eV"], correctAnswer: 0, explanation: "Energy needed to remove electron from ground state.", difficulty: 'EASY' },
    { id: 'q_21_5', topicId: 'm-coord-geo', subject: 'Mathematics', text: "The eccentricity of a rectangular hyperbola is:", options: ["1", "√2", "2", "√3"], correctAnswer: 1, explanation: "For x²-y²=a², e = √1 + b²/a² = √2.", difficulty: 'MEDIUM' },
    { id: 'q_21_6', topicId: 'c-nitrogen', subject: 'Chemistry', text: "Hoffmann Bromamide degradation is used to prepare:", options: ["Primary amine", "Secondary amine", "Tertiary amine", "Amide"], correctAnswer: 0, explanation: "Conversion of Amide to Amine with one less carbon.", difficulty: 'MEDIUM' },
    { id: 'q_21_7', topicId: 'p-solids', subject: 'Physics', text: "Young's modulus of a perfectly rigid body is:", options: ["Zero", "Infinity", "1", "Variable"], correctAnswer: 1, explanation: "Strain is zero for any stress.", difficulty: 'EASY' },
    { id: 'q_21_8', topicId: 'm-vectors', subject: 'Mathematics', text: "If |a|=3, |b|=4 and a·b=0, then |a+b| is:", options: ["7", "1", "5", "12"], correctAnswer: 2, explanation: "√(3² + 4² + 2*0) = 5.", difficulty: 'EASY' },
    { id: 'q_21_9', topicId: 'c-oxygen', subject: 'Chemistry', text: "Lucas reagent is:", options: ["Anhydrous ZnCl₂ + Conc HCl", "Dilute HCl", "Zn + HCl", "PCl₅"], correctAnswer: 0, explanation: "Used to distinguish alcohols.", difficulty: 'EASY' },
    { id: 'q_21_10', topicId: 'p-ktg', subject: 'Physics', text: "Universal gas constant R in SI units is approx:", options: ["8.314 J/mol/K", "0.0821 L·atm/mol/K", "2 cal/mol/K", "1.38e-23 J/K"], correctAnswer: 0, explanation: "Standard SI value.", difficulty: 'EASY' },

    // --- REPEATING / MOCK PATTERNS FOR 2015-2020 ---
    { id: 'q_20_1', topicId: 'm-calculus-integral', subject: 'Mathematics', text: "Integral of sec²x is:", options: ["tan x", "-tan x", "sec x tan x", "log|sec x|"], correctAnswer: 0, explanation: "Basic integration formula.", difficulty: 'EASY' },
    { id: 'q_19_1', topicId: 'c-periodicity', subject: 'Chemistry', text: "Highest electronegativity is of:", options: ["Oxygen", "Fluorine", "Chlorine", "Nitrogen"], correctAnswer: 1, explanation: "Fluorine is the most electronegative element.", difficulty: 'EASY' },
    { id: 'q_18_1', topicId: 'p-emwaves', subject: 'Physics', text: "Speed of light in vacuum c equals:", options: ["1/√(μ₀ε₀)", "μ₀ε₀", "√(μ₀ε₀)", "μ₀/ε₀"], correctAnswer: 0, explanation: "Maxwell's relation.", difficulty: 'EASY' },
    { id: 'q_17_1', topicId: 'm-binomial', subject: 'Mathematics', text: "Number of terms in (x+y)¹⁰ is:", options: ["10", "11", "9", "20"], correctAnswer: 1, explanation: "n+1 terms in expansion.", difficulty: 'EASY' },
    { id: 'q_16_1', topicId: 'c-equilibrium', subject: 'Chemistry', text: "pH of 0.01M HCl is:", options: ["1", "2", "3", "0.01"], correctAnswer: 1, explanation: "-log(10⁻²) = 2.", difficulty: 'EASY' },
    { id: 'q_15_1', topicId: 'p-units', subject: 'Physics', text: "Dimension of Force is:", options: ["MLT⁻²", "ML²T⁻²", "MLT⁻¹", "M²LT⁻²"], correctAnswer: 0, explanation: "F=ma.", difficulty: 'EASY' }
  ],
  chapters: [
    // MATHEMATICS
    { 
      id: 'm-sets', subject: 'Mathematics', unit: 'Sets, Relations and Functions', name: 'Basics of Sets & Relations', 
      progress: 15, accuracy: 75, timeSpent: 3600, timeSpentNotes: 1200, timeSpentVideos: 800, timeSpentPractice: 1000, timeSpentTests: 600, status: 'LEARNING',
      notes: "<h2>Sets & Functions</h2><p>A set is a well-defined collection of objects. Standard sets: N (Natural), Z (Integers), Q (Rational), R (Real).</p><h3>Types of Relations</h3><ul><li>Reflexive: (a,a) ∈ R</li><li>Symmetric: (a,b) ∈ R => (b,a) ∈ R</li><li>Transitive: (a,b), (b,c) ∈ R => (a,c) ∈ R</li></ul>"
    },
    { 
      id: 'm-complex', subject: 'Mathematics', unit: 'Complex Numbers & Quadratic Equations', name: 'Complex Plane & Equation Roots', 
      progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED',
      notes: "<h2>Complex Numbers</h2><p>Defined as z = a + ib. i = √-1. Euler Form: z = re^(iθ).</p><h3>Quadratics</h3><p>Roots: x = [-b ± √(b² - 4ac)] / 2a.</p>"
    },
    { 
      id: 'm-matrices', subject: 'Mathematics', unit: 'Matrices and Determinants', name: 'Matrix Algebra & Determinants', 
      progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED',
      notes: "<h2>Matrices</h2><p>Algebra of matrices, inverse, adjoint. Determinant properties: det(AB) = det(A)det(B).</p>"
    },
    { 
      id: 'm-pnc', subject: 'Mathematics', unit: 'Permutations and Combinations', name: 'Counting Principles & Selection', 
      progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED',
      notes: "<h2>P&C</h2><p>nPr = n!/(n-r)!. nCr = n!/[r!(n-r)!]. Principle of counting: Multiplicative vs Additive.</p>"
    },
    { 
      id: 'm-binomial', subject: 'Mathematics', unit: 'Binomial Theorem', name: 'Expansion & Simple Applications', 
      progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED',
      notes: "<h2>Binomial Theorem</h2><p>(a+b)^n = Σ (nCk) a^(n-k) b^k. Middle term formula, General term Tr+1.</p>"
    },
    { 
      id: 'm-sequence', subject: 'Mathematics', unit: 'Sequence and Series', name: 'Progression & Series Summation', 
      progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED',
      notes: "<h2>AP/GP/HP</h2><p>Sum of n terms in AP: (n/2)[2a + (n-1)d]. GP Sum: a(r^n - 1)/(r-1). AM >= GM relation.</p>"
    },
    { 
      id: 'm-calculus-limit', subject: 'Mathematics', unit: 'Limit, Continuity & Differentiability', name: 'Limits & Calculus Foundations', 
      progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED',
      notes: "<h2>Calculus I</h2><p>L'Hopital's Rule, First principle of differentiation, Chain rule, Monotonicity.</p>"
    },
    { 
      id: 'm-calculus-integral', subject: 'Mathematics', unit: 'Integral Calculus', name: 'Indefinite & Definite Integration', 
      progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED',
      notes: "<h2>Integration</h2><p>Indefinite vs Definite. Area under curves. Substitution and By-parts (ILATE rule).</p>"
    },
    { 
      id: 'm-diff-eq', subject: 'Mathematics', unit: 'Differential Equations', name: 'First Order DE & Solutions', 
      progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED',
      notes: "<h2>ODE</h2><p>Variable separable, Homogeneous, Linear form: dy/dx + Py = Q.</p>"
    },
    { 
      id: 'm-coord-geo', subject: 'Mathematics', unit: 'Co-ordinate Geometry', name: 'Lines, Circles & Conics', 
      progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED',
      notes: "<h2>Coordinate Geo</h2><p>Straight lines, Circles, Conics (Parabola, Ellipse, Hyperbola). Focus, directrix properties.</p>"
    },
    { 
      id: 'm-3d-geo', subject: 'Mathematics', unit: 'Three Dimensional Geometry', name: 'Planes & Lines in Space', 
      progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED',
      notes: "<h2>3D Geometry</h2><p>Direction Cosines, Direction Ratios, Planes, Lines in space, shortest distance between skew lines.</p>"
    },
    { 
      id: 'm-vectors', subject: 'Mathematics', unit: 'Vector Algebra', name: 'Dot & Cross Products', 
      progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED',
      notes: "<h2>Vectors</h2><p>Dot product, Cross product, Scalar Triple Product (STP), Vector Triple Product (VTP).</p>"
    },
    { 
      id: 'm-stats', subject: 'Mathematics', unit: 'Statistics and Probability', name: 'Data Analysis & Probability Laws', 
      progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED',
      notes: "<h2>Stats & Prob</h2><p>Variance, Std Deviation, Bayes' Theorem, Bernoulli trials, Conditional probability.</p>"
    },
    { 
      id: 'm-trigo', subject: 'Mathematics', unit: 'Trigonometry', name: 'Identities & Equations', 
      progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED',
      notes: "<h2>Trigonometry</h2><p>Identities, Sine rule, Cosine rule, Inverse Trigonometric Functions (Domain/Range).</p>"
    },

    // PHYSICS
    { 
      id: 'p-units', subject: 'Physics', unit: 'Units and Measurements', name: 'SI Units & Dimension Analysis', 
      progress: 40, accuracy: 85, timeSpent: 7200, timeSpentNotes: 2400, timeSpentVideos: 1800, timeSpentPractice: 2000, timeSpentTests: 1000, status: 'LEARNING',
      notes: "<h2>Measurements</h2><p>SI Units, Errors, Dimensions. Standard dimensions like [Force] = MLT^-2.</p>"
    },
    { 
      id: 'p-kinematics', subject: 'Physics', unit: 'Kinematics', name: 'Motion in 1D & 2D', 
      progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED',
      notes: "<h2>Kinematics</h2><p>1D & 2D Motion. Equations of motion: v = u + at, s = ut + 0.5at². Projectile motion trajectory.</p>"
    },
    { 
      id: 'p-lom', subject: 'Physics', unit: 'Laws of Motion', name: "Newton's Laws & Friction", 
      progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED',
      notes: "<h2>Newton's Laws</h2><p>F = ma. Conservation of momentum. Static vs Kinetic friction. Circular motion dynamics.</p>"
    },
    { 
      id: 'p-wep', subject: 'Physics', unit: 'Work, Energy and Power', name: 'Energy Core & Collisions', 
      progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED',
      notes: "<h2>Energy Core</h2><p>W = F·s. Potential energy mgh, Kinetic energy 1/2mv². Work-Energy Theorem.</p>"
    },
    { 
      id: 'p-rotational', subject: 'Physics', unit: 'Rotational Motion', name: 'Moment of Inertia & Torque', 
      progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED',
      notes: "<h2>Rotation</h2><p>Torque = r x F. Moment of Inertia, Angular momentum L = Iω. Parallel & Perpendicular axes theorems.</p>"
    },
    { 
      id: 'p-gravitation', subject: 'Physics', unit: 'Gravitation', name: 'Planetary Motion & Satellite Dynamics', 
      progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED',
      notes: "<h2>Gravitation</h2><p>F = Gm1m2/r². Kepler's laws, escape velocity v = √(2GM/R), orbital velocity.</p>"
    },
    { 
      id: 'p-solids', subject: 'Physics', unit: 'Properties of Solids and Liquids', name: 'Elasticity & Fluid Mechanics', 
      progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED',
      notes: "<h2>Matter Properties</h2><p>Elasticity (Hooke's Law), Viscosity (Stokes' Law), Surface Tension, Fluid Pressure (Pascal's Law).</p>"
    },
    { 
      id: 'p-thermo', subject: 'Physics', unit: 'Thermodynamics', name: 'Thermal Expansion & Laws of Thermo', 
      progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED',
      notes: "<h2>Thermodynamics</h2><p>First Law: Q = ΔU + W. Second Law, Heat Engines, Reversible vs Irreversible processes.</p>"
    },
    { 
      id: 'p-ktg', subject: 'Physics', unit: 'Kinetic Theory of Gases', name: 'Gas Laws & Molecule Dynamics', 
      progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED',
      notes: "<h2>KTG</h2><p>PV = nRT. RMS speed, degree of freedom, equipartition of energy, Avogadro's number.</p>"
    },
    { 
      id: 'p-oscillations', subject: 'Physics', unit: 'Oscillations and Waves', name: 'SHM & Wave Motion', 
      progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED',
      notes: "<h2>SHM & Waves</h2><p>F = -kx. Simple pendulum, Doppler effect, Resonance, superposition of waves.</p>"
    },
    { 
      id: 'p-electrostatics', subject: 'Physics', unit: 'Electrostatics', name: 'Electric Field & Capacitance', 
      progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED',
      notes: "<h2>Electrostatics</h2><p>Coulomb's Law, Electric field, Gauss's Law, Potential, Capacitors, Dielectrics.</p>"
    },
    { 
      id: 'p-current', subject: 'Physics', unit: 'Current Electricity', name: 'DC Circuits & Ohm\'s Law', 
      progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED',
      notes: "<h2>Current</h2><p>Ohm's Law, Drift velocity, Kirchhoff's Laws, Wheatstone bridge, Potentiometer.</p>"
    },
    { 
      id: 'p-magnetism', subject: 'Physics', unit: 'Magnetic Effects of Current and Magnetism', name: 'Magnetic Force & Materials', 
      progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED',
      notes: "<h2>Magnetism</h2><p>Biot-Savart Law, Ampere's Law, Lorentz force, Cyclotron, MC galvanometer, Bar magnet.</p>"
    },
    { 
      id: 'p-emi-ac', subject: 'Physics', unit: 'Electromagnetic Induction and Alternating Currents', name: 'Faraday\'s Laws & LCR Circuits', 
      progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED',
      notes: "<h2>EMI & AC</h2><p>Faraday's Laws, Lenz's Law, LCR circuit, Power factor, Transformers.</p>"
    },
    { 
      id: 'p-emwaves', subject: 'Physics', unit: 'Electromagnetic Waves', name: 'Maxwell\'s Equations & Spectrum', 
      progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED',
      notes: "<h2>EM Waves</h2><p>Displacement current, Maxwell's equations, EM spectrum (Radio to Gamma).</p>"
    },
    { 
      id: 'p-optics', subject: 'Physics', unit: 'Optics', name: 'Ray & Wave Optics', 
      progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED',
      notes: "<h2>Ray & Wave Optics</h2><p>Reflection, Refraction, Lens maker formula, Huygens Principle, Young's Double Slit Experiment (YDSE).</p>"
    },
    { 
      id: 'p-dualnature', subject: 'Physics', unit: 'Dual Nature of Matter and Radiation', name: 'Photoelectric Effect & De Broglie', 
      progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED',
      notes: "<h2>Quantum Physics</h2><p>Photoelectric effect, Einstein's equation, De Broglie wavelength λ = h/p.</p>"
    },
    { 
      id: 'p-atoms', subject: 'Physics', unit: 'Atoms and Nuclei', name: 'Nuclear Structure & Radioactivity', 
      progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED',
      notes: "<h2>Atomic Structure</h2><p>Bohr model, Rutherford experiment, Nuclear fusion, fission, radioactivity laws.</p>"
    },
    { 
      id: 'p-electronics', subject: 'Physics', unit: 'Electronic Devices', name: 'Semiconductors & Logic Gates', 
      progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED',
      notes: "<h2>Semiconductors</h2><p>P-N junction, Zener diode, Logic gates (AND, OR, NOT, etc.).</p>"
    },
    { 
      id: 'p-experimental', subject: 'Physics', unit: 'Experimental Skills', name: 'Lab Techniques & Observations', 
      progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED',
      notes: "<h2>Lab Skills</h2><p>Vernier calipers, screw gauge, simple pendulum, metre bridge, Ohm's law experiments.</p>"
    },

    // CHEMISTRY
    { 
      id: 'c-basic', subject: 'Chemistry', unit: 'Some Basic Concepts in Chemistry', name: 'Mole Concept & Stoichiometry', 
      progress: 20, accuracy: 60, timeSpent: 2400, timeSpentNotes: 800, timeSpentVideos: 600, timeSpentPractice: 600, timeSpentTests: 400, status: 'LEARNING',
      notes: "<h2>Mole Concept</h2><p>Dalton's atomic theory, Mole concept, molar mass, stoichiometry, empirical formulae.</p>"
    },
    { 
      id: 'c-atomic', subject: 'Chemistry', unit: 'Atomic Structure', name: 'Quantum Numbers & Orbitals', 
      progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED',
      notes: "<h2>Atoms</h2><p>Quantum mechanical model, orbitals, Heisenberg uncertainty, Aufbau, Pauli, Hund's rules.</p>"
    },
    { 
      id: 'c-bonding', subject: 'Chemistry', unit: 'Chemical Bonding and Molecular Structure', name: 'Valence Theory & MOT', 
      progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED',
      notes: "<h2>Bonding</h2><p>Ionic, Covalent, VSEPR Theory, Hybridization, Molecular Orbital Theory (MOT).</p>"
    },
    { 
      id: 'c-thermo', subject: 'Chemistry', unit: 'Chemical Thermodynamics', name: 'Enthalpy & Spontaneity', 
      progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED',
      notes: "<h2>Thermodynamics</h2><p>Enthalpy, Hess's Law, Entropy ΔS, Gibbs Free Energy ΔG, Spontaneity.</p>"
    },
    { 
      id: 'c-solutions', subject: 'Chemistry', unit: 'Solutions', name: 'Raoult\'s Law & Colligative Properties', 
      progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED',
      notes: "<h2>Solutions</h2><p>Raoult's Law, Ideal solutions, Colligative properties: Elevation in Boiling point, depression in freezing point.</p>"
    },
    { 
      id: 'c-equilibrium', subject: 'Chemistry', unit: 'Equilibrium', name: 'Chemical & Ionic Equilibrium', 
      progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED',
      notes: "<h2>Chemical & Ionic</h2><p>Kc, Kp, Le Chatelier's, pH scale, solubility products, buffer solutions.</p>"
    },
    { 
      id: 'c-redox-electro', subject: 'Chemistry', unit: 'Redox Reactions and Electrochemistry', name: 'Nernst Equation & Cell Potential', 
      progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED',
      notes: "<h2>Electrochem</h2><p>Oxidation number, Kohlrausch's law, Nernst equation, Galvanic cells, Dry cell.</p>"
    },
    { 
      id: 'c-kinetics', subject: 'Chemistry', unit: 'Chemical Kinetics', name: 'Rate Laws & Arrhenius Theory', 
      progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED',
      notes: "<h2>Kinetics</h2><p>Rate law, order, molecularity, Arrhenius theory, half-life periods.</p>"
    },
    { 
      id: 'c-periodicity', subject: 'Chemistry', unit: 'Classification of Elements and Periodicity in Properties', name: 'Periodic Trends & Elements', 
      progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED',
      notes: "<h2>Periodic Table</h2><p>Atomic radii, ionization enthalpy, electron gain enthalpy, electronegativity trends.</p>"
    },
    { 
      id: 'c-pblock', subject: 'Chemistry', unit: 'p-Block Elements', name: 'Groups 13 to 18 Characteristics', 
      progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED',
      notes: "<h2>p-Block</h2><p>Groups 13 to 18. Properties, unique behavior of first elements, allotropes.</p>"
    },
    { 
      id: 'c-dfblock', subject: 'Chemistry', unit: 'd - and f- Block Elements', name: 'Transition & Inner Transition Elements', 
      progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED',
      notes: "<h2>Transition Elements</h2><p>Magnetic properties, color, alloys, Lanthanoid contraction.</p>"
    },
    { 
      id: 'c-coordination', subject: 'Chemistry', unit: 'Coordination Compounds', name: 'Werner\'s Theory & Isomerism', 
      progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED',
      notes: "<h2>Coordination</h2><p>Werner's theory, ligands, IUPAC nomenclature, isomerism, Valence Bond Approach.</p>"
    },
    { 
      id: 'c-purification', subject: 'Chemistry', unit: 'Purification and Characterisation of Organic Compounds', name: 'Qualitative & Quantitative Analysis', 
      progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED',
      notes: "<h2>Organic Analysis</h2><p>Crystallization, distillation, detection of elements, empirical formulae.</p>"
    },
    { 
      id: 'c-goc', subject: 'Chemistry', unit: 'Some Basic Principles of Organic Chemistry', name: 'Nomenclature & Reaction Types', 
      progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED',
      notes: "<h2>GOC</h2><p>Inductive effect, Mesomeric, Resonance, IUPAC naming, free radicals, electrophiles.</p>"
    },
    { 
      id: 'c-hydrocarbons', subject: 'Chemistry', unit: 'Hydrocarbons', name: 'Alkanes, Alkenes & Alkynes', 
      progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED',
      notes: "<h2>Hydrocarbons</h2><p>Alkanes, Alkenes (Markownikoff), Alkynes (acidic nature), Benzene electrophilic substitution.</p>"
    },
    { 
      id: 'c-halogens', subject: 'Chemistry', unit: 'Organic Compounds Containing Halogens', name: 'SN1/SN2 Mechanisms & Halides', 
      progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED',
      notes: "<h2>Halides</h2><p>SN1, SN2 mechanisms, properties of chloroform, iodoform, DDT.</p>"
    },
    { 
      id: 'c-oxygen', subject: 'Chemistry', unit: 'Organic Compounds Containing Oxygen', name: 'Alcohols, Phenols & Carbonyls', 
      progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED',
      notes: "<h2>Alcohols/Ethers/Aldehydes</h2><p>Reimer-Tiemann, Aldol, Cannizzaro, Haloform reactions.</p>"
    },
    { 
      id: 'c-nitrogen', subject: 'Chemistry', unit: 'Organic Compounds Containing Nitrogen', name: 'Amines & Diazonium Salts', 
      progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED',
      notes: "<h2>Amines</h2><p>Diazonium salts, classification of amines, basic character trends.</p>"
    },
    { 
      id: 'c-biomolecules', subject: 'Chemistry', unit: 'Biomolecules', name: 'Carbohydrates, Proteins & Vitamins', 
      progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED',
      notes: "<h2>Biomolecules</h2><p>Carbohydrates, Proteins (α-amino acids), Vitamins, Nucleic Acids (DNA/RNA).</p>"
    },
    { 
      id: 'c-practical', subject: 'Chemistry', unit: 'Principles Related to Practical Chemistry', name: 'Salt Analysis & Titration', 
      progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED',
      notes: "<h2>Practical Chemistry</h2><p>Detection of extra elements, qualitative salt analysis, titrimetric exercises.</p>"
    }
  ],
  connectedParent: {
    name: "Mr. Ramesh Sharma",
    id: "P-4402",
    linkedSince: "2025-11-15"
  }
};
