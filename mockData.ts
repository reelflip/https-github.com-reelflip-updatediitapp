
import { StudentData, UserRole, Chapter, Question } from './types';

// --- NCERT CONTENT SEEDS ---

const PHYSICS_UNITS_NOTES = `
<h2 class="text-3xl font-black italic tracking-tighter mt-8 mb-6 uppercase text-indigo-600">1. Units and Measurements: The Foundation</h2>
<p class="text-slate-600 font-medium leading-relaxed mb-6">Measurement of any physical quantity involves comparison with a certain basic, internationally accepted reference standard called unit. The result of a measurement of a physical quantity is expressed by a number accompanied by a unit.</p>

<h3 class="text-xl font-black italic tracking-tight mt-8 mb-4 uppercase text-slate-800">1.1 The International System of Units (SI)</h3>
<p class="text-slate-600 font-medium leading-relaxed mb-4">In 1971, the General Conference on Weights and Measures developed the SI system. There are seven base units:</p>
<ul class="list-disc pl-8 space-y-3 my-6">
  <li><strong>Length:</strong> Metre (m) - defined by the speed of light in vacuum.</li>
  <li><strong>Mass:</strong> Kilogram (kg) - defined by the Planck constant.</li>
  <li><strong>Time:</strong> Second (s) - defined by Cesium-133 atom vibrations.</li>
  <li><strong>Electric Current:</strong> Ampere (A).</li>
  <li><strong>Thermodynamic Temperature:</strong> Kelvin (K).</li>
  <li><strong>Amount of Substance:</strong> Mole (mol).</li>
  <li><strong>Luminous Intensity:</strong> Candela (cd).</li>
</ul>

<h3 class="text-xl font-black italic tracking-tight mt-8 mb-4 uppercase text-slate-800">1.2 Dimensional Analysis</h3>
<p class="text-slate-600 font-medium leading-relaxed mb-4">The dimensions of a physical quantity are the powers to which the base quantities are raised to represent that quantity. <strong>The Principle of Homogeneity</strong> states that dimensions of each of the terms of a physical equation on both sides should be the same.</p>
<div class="bg-slate-50 p-6 rounded-2xl border border-slate-200 my-6 font-mono text-indigo-600">
  [Force] = [M][L][T^-2]<br>
  [Work/Energy] = [M][L^2][T^-2]<br>
  [Pressure/Stress] = [M][L^-1][T^-2]
</div>

<h3 class="text-xl font-black italic tracking-tight mt-8 mb-4 uppercase text-slate-800">1.3 Errors in Measurement</h3>
<p class="text-slate-600 font-medium leading-relaxed mb-4">No measurement is perfect. Errors are classified as Systematic or Random.</p>
<ul class="list-disc pl-8 space-y-3 my-6">
  <li><strong>Absolute Error:</strong> Δa = |a_mean - a_i|</li>
  <li><strong>Relative Error:</strong> Δa_mean / a_mean</li>
  <li><strong>Percentage Error:</strong> Relative Error × 100%</li>
</ul>
<p class="text-slate-500 italic text-sm border-l-4 border-indigo-500 pl-4 py-2 bg-indigo-50 uppercase font-black">JEE Strategy: Significant figures and rounding off are critical for numerical-type questions in Paper-1.</p>
`;

const CHEMISTRY_BASIC_NOTES = `
<h2 class="text-3xl font-black italic tracking-tighter mt-8 mb-6 uppercase text-emerald-600">1. Basic Concepts: Mole Logic</h2>
<p class="text-slate-600 font-medium leading-relaxed mb-6">Chemistry deals with the composition, structure, and properties of matter. Matter is anything which has mass and occupies space.</p>

<h3 class="text-xl font-black italic tracking-tight mt-8 mb-4 uppercase text-slate-800">1.1 Laws of Chemical Combination</h3>
<ul class="list-disc pl-8 space-y-3 my-6">
  <li><strong>Law of Conservation of Mass:</strong> Mass can neither be created nor destroyed (Lavoisier, 1789).</li>
  <li><strong>Law of Definite Proportions:</strong> A compound always contains exactly the same proportion of elements by weight.</li>
  <li><strong>Law of Multiple Proportions:</strong> Small whole number ratios for masses of one element combining with fixed mass of another.</li>
</ul>

<h3 class="text-xl font-black italic tracking-tight mt-8 mb-4 uppercase text-slate-800">1.2 The Mole Concept (JEE High Yield)</h3>
<p class="text-slate-600 font-medium leading-relaxed mb-4">One mole contains <strong>6.022 × 10^23</strong> particles (Avogadro Constant).</p>
<div class="bg-emerald-50 p-6 rounded-2xl border border-emerald-200 my-6 font-mono text-emerald-700">
  Number of Moles = Given Mass / Molar Mass<br>
  Molarity (M) = Moles of Solute / Volume of Solution in Litres<br>
  Molality (m) = Moles of Solute / Mass of Solvent in Kilograms
</div>
`;

const MATHS_SETS_NOTES = `
<h2 class="text-3xl font-black italic tracking-tighter mt-8 mb-6 uppercase text-rose-600">1. Sets: Algebraic Foundations</h2>
<p class="text-slate-600 font-medium leading-relaxed mb-6">A <strong>Set</strong> is a well-defined collection of objects. Foundations laid by Georg Cantor.</p>

<h3 class="text-xl font-black italic tracking-tight mt-8 mb-4 uppercase text-slate-800">1.1 Representation</h3>
<ul class="list-disc pl-8 space-y-3 my-6">
  <li><strong>Roster Form:</strong> Elements listed within { }.</li>
  <li><strong>Set-builder Form:</strong> Characterizing property x.</li>
</ul>

<h3 class="text-xl font-black italic tracking-tight mt-8 mb-4 uppercase text-slate-800">1.2 Operations</h3>
<div class="bg-rose-50 p-6 rounded-2xl border border-rose-200 my-6 font-mono text-rose-700">
  Union (A ∪ B): Elements in either A or B.<br>
  Intersection (A ∩ B): Common elements.<br>
  De Morgan's Laws: (A ∪ B)' = A' ∩ B' and (A ∩ B)' = A' ∪ B'
</div>
`;

const getGenericNotes = (name: string, subject: string, unit: string) => `
<h2 class="text-3xl font-black italic tracking-tighter mt-8 mb-6 uppercase text-slate-600">${name}</h2>
<p class="text-slate-600 font-medium leading-relaxed mb-6">This module covers the core NCERT objectives for <strong>${name}</strong> within the <strong>${unit}</strong> stream of ${subject}.</p>

<h3 class="text-xl font-black italic tracking-tight mt-8 mb-4 uppercase text-slate-800">1. Theoretical Framework</h3>
<p class="text-slate-600 font-medium leading-relaxed mb-4">The concepts in this chapter form the bedrock for advanced JEE problem solving. Key focus areas include conceptual derivations and boundary condition analysis.</p>

<h3 class="text-xl font-black italic tracking-tight mt-8 mb-4 uppercase text-slate-800">2. Critical Formula Matrix</h3>
<div class="bg-slate-50 p-8 rounded-3xl border border-slate-200 my-6 font-mono text-slate-700 text-sm">
  <strong>Key Relation A:</strong> ΔV = ∫ E . dl (Contextual Application)<br>
  <strong>Key Relation B:</strong> P = F/A (Fundamental Constraint)<br>
  <strong>Key Relation C:</strong> η = 1 - (T_low / T_high) (Efficiency Model)
</div>

<h3 class="text-xl font-black italic tracking-tight mt-8 mb-4 uppercase text-slate-800">3. Competitive Strategy</h3>
<ul class="list-disc pl-8 space-y-4 my-6">
  <li class="text-slate-600 font-medium italic">Identify cross-functional applications with previous units.</li>
  <li class="text-slate-600 font-medium italic">Focus on graphical analysis for Paper-2 advanced questions.</li>
  <li class="text-slate-600 font-medium italic">Memorize anomalous cases which are frequent targets in JEE Main.</li>
</ul>

<h3 class="text-xl font-black italic tracking-tight mt-8 mb-4 uppercase text-slate-800">4. Sectional Summary</h3>
<p class="text-slate-500 font-medium leading-relaxed mb-6">Consistency in practicing multi-step numericals from this unit will yield high stability in mock results.</p>
`;

const generateMockChapters = (): Chapter[] => {
  const baseChapters: any[] = [
    { id: 'p-units', subject: 'Physics', unit: 'Mechanics', name: 'Units and Measurements', notes: PHYSICS_UNITS_NOTES },
    { id: 'p-kinematics', subject: 'Physics', unit: 'Mechanics', name: 'Kinematics' },
    { id: 'p-lom', subject: 'Physics', unit: 'Mechanics', name: 'Laws of Motion' },
    { id: 'p-wep', subject: 'Physics', unit: 'Mechanics', name: 'Work, Energy and Power' },
    { id: 'p-rotational', subject: 'Physics', unit: 'Mechanics', name: 'Rotational Motion' },
    { id: 'p-gravitation', subject: 'Physics', unit: 'Mechanics', name: 'Gravitation' },
    { id: 'p-solids', subject: 'Physics', unit: 'Properties of Matter', name: 'Mechanical Properties of Solids' },
    { id: 'p-fluids', subject: 'Physics', unit: 'Properties of Matter', name: 'Mechanical Properties of Fluids' },
    { id: 'p-thermo', subject: 'Physics', unit: 'Thermodynamics', name: 'Thermodynamics (Physics)' },
    { id: 'p-oscillations', subject: 'Physics', unit: 'Waves', name: 'Oscillations' },
    { id: 'p-electrostatics', subject: 'Physics', unit: 'Electromagnetism', name: 'Electrostatics' },
    { id: 'p-current', subject: 'Physics', unit: 'Electromagnetism', name: 'Current Electricity' },
    { id: 'p-ray-optics', subject: 'Physics', unit: 'Optics', name: 'Ray Optics' },
    { id: 'p-modern', subject: 'Physics', unit: 'Modern Physics', name: 'Dual Nature and Atoms' },

    { id: 'c-basic', subject: 'Chemistry', unit: 'General Chemistry', name: 'Some Basic Concepts of Chemistry', notes: CHEMISTRY_BASIC_NOTES },
    { id: 'c-atomic', subject: 'Chemistry', unit: 'General Chemistry', name: 'Structure of Atom' },
    { id: 'c-bonding', subject: 'Chemistry', unit: 'General Chemistry', name: 'Chemical Bonding' },
    { id: 'c-thermo', subject: 'Chemistry', unit: 'Physical Chemistry', name: 'Thermodynamics (Chemistry)' },
    { id: 'c-equilibrium', subject: 'Chemistry', unit: 'Physical Chemistry', name: 'Equilibrium' },
    { id: 'c-kinetics', subject: 'Chemistry', unit: 'Physical Chemistry', name: 'Chemical Kinetics' },
    { id: 'c-organic-basics', subject: 'Chemistry', unit: 'Organic Chemistry', name: 'Organic Chemistry Principles' },
    { id: 'c-hydrocarbons', subject: 'Chemistry', unit: 'Organic Chemistry', name: 'Hydrocarbons' },
    { id: 'c-carbonyl', subject: 'Chemistry', unit: 'Organic Chemistry', name: 'Aldehydes and Ketones' },

    { id: 'm-sets', subject: 'Mathematics', unit: 'Algebra', name: 'Sets, Relations and Functions', notes: MATHS_SETS_NOTES },
    { id: 'm-complex', subject: 'Mathematics', unit: 'Algebra', name: 'Complex Numbers' },
    { id: 'm-matrices', subject: 'Mathematics', unit: 'Algebra', name: 'Matrices and Determinants' },
    { id: 'm-pnc', subject: 'Mathematics', unit: 'Algebra', name: 'Permutations and Combinations' },
    { id: 'm-calculus-limit', subject: 'Mathematics', unit: 'Calculus', name: 'Limits and Continuity' },
    { id: 'm-calculus-integral', subject: 'Mathematics', unit: 'Calculus', name: 'Integral Calculus' },
    { id: 'm-vectors', subject: 'Mathematics', unit: 'Geometry', name: 'Vector Algebra' },
    { id: 'm-stats-prob', subject: 'Mathematics', unit: 'Statistics', name: 'Probability' },
    { id: 'm-trigonometry', subject: 'Mathematics', unit: 'Trigonometry', name: 'Trigonometry' }
  ];

  return baseChapters.map(c => ({
    ...c,
    progress: Math.floor(Math.random() * 40),
    accuracy: Math.floor(Math.random() * 30) + 60,
    timeSpent: 0,
    timeSpentNotes: 0,
    timeSpentVideos: 0,
    timeSpentPractice: 0,
    timeSpentTests: 0,
    status: 'LEARNING',
    notes: c.notes || getGenericNotes(c.name, c.subject, c.unit || 'Standard Unit')
  }));
};

// --- BULK QUESTION GENERATOR ---

const generateAllQuestions = (chapters: Chapter[]): Question[] => {
  const allQs: Question[] = [];
  const difficultyLevels: ('EASY' | 'MEDIUM' | 'HARD')[] = ['EASY', 'MEDIUM', 'HARD'];

  chapters.forEach(ch => {
    // Generate 25 questions per chapter as requested
    for (let i = 1; i <= 25; i++) {
      const diff = difficultyLevels[Math.floor(Math.random() * 3)];
      allQs.push({
        id: `q-${ch.id}-${i}`,
        topicId: ch.id,
        subject: ch.subject,
        text: `Level ${diff} Problem on ${ch.name}: Evaluate the conceptual validity of statement ${i} within the JEE ${ch.subject} framework.`,
        options: [
          `Conceptual Option A for problem ${i}`,
          `Calculated Result B for problem ${i}`,
          `Theoretical Derivation C for problem ${i}`,
          `Strategic Boundary Case D`
        ],
        correctAnswer: Math.floor(Math.random() * 4),
        explanation: `In the context of ${ch.name}, this problem requires application of fundamental laws. The core reasoning follows from first-principles derivation.`,
        difficulty: diff
      });
    }
  });

  return allQs;
};

const mockChapters = generateMockChapters();

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
  backlogs: [],
  flashcards: [
    { id: 'fc-1', question: "Dimensional formula of Planck's Constant (h)", answer: "ML²T⁻¹", subject: 'Physics', difficulty: 'EASY', type: 'Formula' },
    { id: 'fc-2', question: "Force between two point charges (Coulomb's Law)", answer: "F = k(q1q2)/r²", subject: 'Physics', difficulty: 'EASY', type: 'Formula' }
  ],
  memoryHacks: [
    { id: 'mh-1', title: "Trigonometry Ratios", description: "Sine, Cosine, Tangent basic formulas", hack: "SOH CAH TOA", category: "Mnemonics", subject: "Mathematics" },
    { id: 'mh-2', title: "Redox Reactions", description: "Oxidation vs Reduction definitions", hack: "OIL RIG (Oxidation Is Loss, Reduction Is Gain)", category: "Mnemonics", subject: "Chemistry" }
  ],
  blogs: [
    { id: 'b1', title: "Mastering the Forgetting Curve for JEE 2025", content: "<h1>Strategic Recall</h1><p>Master the curve using spaced repetition algorithms.</p>", author: "Admin", date: "2024-12-20", status: "PUBLISHED" }
  ],
  messages: [],
  mockTests: [
    { id: 'jee-main-2024', name: 'JEE Main 2024 Official', duration: 180, totalMarks: 300, category: 'ADMIN', difficulty: 'MAINS', questionIds: Array.from({length: 10}, (_, i) => `q-p-units-${i+1}`), chapterIds: ['p-units'] }
  ],
  questions: generateAllQuestions(mockChapters),
  chapters: mockChapters,
  connectedParent: undefined,
  pendingInvitations: []
};
