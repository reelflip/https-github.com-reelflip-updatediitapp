
import { StudentData, UserRole, Chapter, Question, Subject } from './types';

// --- NCERT CONTENT SEEDS ---

const PHYSICS_UNITS_NOTES = `
<h2 class="text-3xl font-black italic tracking-tighter mt-8 mb-6 uppercase text-indigo-600">1. Units and Measurements: The Foundation</h2>
<p class="text-slate-600 font-medium leading-relaxed mb-6">Measurement of any physical quantity involves comparison with a certain basic, arbitrarily chosen, internationally accepted reference standard called unit. The result of a measurement of a physical quantity is expressed by a number accompanied by a unit.</p>

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
<p class="text-slate-500 italic text-sm border-l-4 border-indigo-500 pl-4 py-2 bg-indigo-50">JEE Strategy: Significant figures and rounding off are critical for numerical-type questions in Paper-1.</p>
`;

const CHEMISTRY_BASIC_NOTES = `
<h2 class="text-3xl font-black italic tracking-tighter mt-8 mb-6 uppercase text-emerald-600">1. Basic Concepts of Chemistry: Mole Logic</h2>
<p class="text-slate-600 font-medium leading-relaxed mb-6">Chemistry deals with the composition, structure, and properties of matter. Matter is anything which has mass and occupies space.</p>

<h3 class="text-xl font-black italic tracking-tight mt-8 mb-4 uppercase text-slate-800">1.1 Laws of Chemical Combination</h3>
<ul class="list-disc pl-8 space-y-3 my-6">
  <li><strong>Law of Conservation of Mass:</strong> Mass can neither be created nor destroyed (Lavoisier, 1789).</li>
  <li><strong>Law of Definite Proportions:</strong> A given compound always contains exactly the same proportion of elements by weight.</li>
  <li><strong>Law of Multiple Proportions:</strong> (Dalton, 1803) If two elements combine to form more than one compound, the masses of one element that combine with a fixed mass of the other element are in small whole number ratios.</li>
</ul>

<h3 class="text-xl font-black italic tracking-tight mt-8 mb-4 uppercase text-slate-800">1.2 Dalton's Atomic Theory</h3>
<p class="text-slate-600 font-medium leading-relaxed mb-4">In 1808, Dalton published 'A New System of Chemical Philosophy' where he proposed: Matter consists of indivisible atoms. All atoms of a given element have identical properties.</p>

<h3 class="text-xl font-black italic tracking-tight mt-8 mb-4 uppercase text-slate-800">1.3 The Mole Concept (JEE High Yield)</h3>
<p class="text-slate-600 font-medium leading-relaxed mb-4">One mole is the amount of a substance that contains as many particles as there are atoms in exactly 12g of the C-12 isotope. This number is the <strong>Avogadro Constant (6.022 × 10^23)</strong>.</p>
<div class="bg-emerald-50 p-6 rounded-2xl border border-emerald-200 my-6 font-mono text-emerald-700">
  Number of Moles = Given Mass / Molar Mass<br>
  Molarity (M) = Moles of Solute / Volume of Solution in Litres<br>
  Molality (m) = Moles of Solute / Mass of Solvent in Kilograms
</div>

<h3 class="text-xl font-black italic tracking-tight mt-8 mb-4 uppercase text-slate-800">1.4 Empirical and Molecular Formulas</h3>
<p class="text-slate-600 font-medium leading-relaxed mb-4">Empirical formula represents the simplest whole number ratio of atoms, while Molecular formula shows the exact number of atoms of each element in a molecule.</p>
`;

const MATHS_SETS_NOTES = `
<h2 class="text-3xl font-black italic tracking-tighter mt-8 mb-6 uppercase text-rose-600">1. Sets: Foundations of Algebra</h2>
<p class="text-slate-600 font-medium leading-relaxed mb-6">The theory of sets was developed by German mathematician Georg Cantor. A <strong>Set</strong> is a well-defined collection of objects.</p>

<h3 class="text-xl font-black italic tracking-tight mt-8 mb-4 uppercase text-slate-800">1.1 Representation of Sets</h3>
<ul class="list-disc pl-8 space-y-3 my-6">
  <li><strong>Roster or Tabular Form:</strong> Elements are listed within braces { } and separated by commas. Ex: {2, 4, 6, 8}.</li>
  <li><strong>Set-builder Form:</strong> Elements possess a single common property. Ex: {x : x is a natural number and x < 10}.</li>
</ul>

<h3 class="text-xl font-black italic tracking-tight mt-8 mb-4 uppercase text-slate-800">1.2 Types of Sets</h3>
<ul class="list-disc pl-8 space-y-3 my-6">
  <li><strong>Empty Set (Φ):</strong> A set which does not contain any element.</li>
  <li><strong>Singleton Set:</strong> A set containing only one element.</li>
  <li><strong>Finite and Infinite Sets:</strong> Based on whether elements can be counted.</li>
  <li><strong>Equal Sets:</strong> Two sets A and B are equal if they have exactly the same elements.</li>
</ul>

<h3 class="text-xl font-black italic tracking-tight mt-8 mb-4 uppercase text-slate-800">1.3 Subsets and Power Sets</h3>
<p class="text-slate-600 font-medium leading-relaxed mb-4">Set A is a subset of B (A ⊆ B) if every element of A is also an element of B. The collection of all subsets of a set A is called the <strong>Power Set P(A)</strong>. If n(A) = m, then n[P(A)] = 2^m.</p>

<h3 class="text-xl font-black italic tracking-tight mt-8 mb-4 uppercase text-slate-800">1.4 Operations on Sets</h3>
<div class="bg-rose-50 p-6 rounded-2xl border border-rose-200 my-6 font-mono text-rose-700">
  Union (A ∪ B): Elements in A or B or both.<br>
  Intersection (A ∩ B): Elements common to both A and B.<br>
  Difference (A - B): Elements in A but not in B.<br>
  De Morgan's Laws: (A ∪ B)' = A' ∩ B' and (A ∩ B)' = A' ∪ B'
</div>
`;

// Helper for generic NCERT template
const getGenericNotes = (name: string, subject: string, unit: string) => `
<h2 class="text-3xl font-black italic tracking-tighter mt-8 mb-6 uppercase text-slate-600">${name}</h2>
<p class="text-slate-500 font-medium leading-relaxed mb-6 italic">This module is aligned with the NCERT ${subject} curriculum for JEE Preparation.</p>

<h3 class="text-xl font-black italic tracking-tight mt-8 mb-4 uppercase text-slate-800">1. Overview</h3>
<p class="text-slate-600 font-medium leading-relaxed mb-4">This unit falls under <strong>${unit}</strong> and constitutes a vital part of the secondary examination framework. It focuses on the fundamental principles and theoretical derivations necessary for complex problem solving.</p>

<h3 class="text-xl font-black italic tracking-tight mt-8 mb-4 uppercase text-slate-800">2. Critical NCERT Objectives</h3>
<ul class="list-disc pl-8 space-y-3 my-6">
  <li>Identify and define the core parameters of <strong>${name}</strong>.</li>
  <li>Derive mathematical expressions from first principles.</li>
  <li>Apply concepts to solve numerical problems featured in previous JEE papers.</li>
  <li>Analyze the limitations and boundary conditions of established laws.</li>
</ul>

<h3 class="text-xl font-black italic tracking-tight mt-8 mb-4 uppercase text-slate-800">3. Important Formulas</h3>
<div class="bg-slate-50 p-6 rounded-2xl border border-slate-200 my-6 font-mono text-slate-600">
  [Mathematical Proof Pending Dynamic Update]<br>
  Standard relation: Φ = ∫ E . dA (Example format)
</div>

<h3 class="text-xl font-black italic tracking-tight mt-8 mb-4 uppercase text-slate-800">4. Strategic Notes for JEE</h3>
<p class="text-slate-600 font-medium leading-relaxed mb-4">Focus on conceptual clarity over rote memorization. Previous years' analysis shows that questions from ${name} often integrate with other topics in ${subject}.</p>
`;

const MOCK_CHAPTERS: Chapter[] = [
  // PHYSICS
  { id: 'p-units', subject: 'Physics', unit: 'Mechanics', name: 'Units and Measurements', progress: 40, accuracy: 85, timeSpent: 7200, timeSpentNotes: 2400, timeSpentVideos: 1800, timeSpentPractice: 2000, timeSpentTests: 1000, status: 'LEARNING', notes: PHYSICS_UNITS_NOTES },
  { id: 'p-kinematics', subject: 'Physics', unit: 'Mechanics', name: 'Kinematics', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED', notes: getGenericNotes('Kinematics', 'Physics', 'Mechanics') },
  { id: 'p-lom', subject: 'Physics', unit: 'Mechanics', name: 'Laws of Motion', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED', notes: getGenericNotes('Laws of Motion', 'Physics', 'Mechanics') },
  { id: 'p-wep', subject: 'Physics', unit: 'Mechanics', name: 'Work, Energy and Power', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED', notes: getGenericNotes('Work, Energy and Power', 'Physics', 'Mechanics') },
  { id: 'p-gravitation', subject: 'Physics', unit: 'Mechanics', name: 'Gravitation', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED', notes: getGenericNotes('Gravitation', 'Physics', 'Mechanics') },
  { id: 'p-thermo', subject: 'Physics', unit: 'Thermodynamics', name: 'Thermodynamics (Physics)', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED', notes: getGenericNotes('Thermodynamics', 'Physics', 'Thermodynamics') },
  { id: 'p-electrostatics', subject: 'Physics', unit: 'Electromagnetism', name: 'Electrostatics', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED', notes: getGenericNotes('Electrostatics', 'Physics', 'Electromagnetism') },
  { id: 'p-current', subject: 'Physics', unit: 'Electromagnetism', name: 'Current Electricity', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED', notes: getGenericNotes('Current Electricity', 'Physics', 'Electromagnetism') },
  { id: 'p-optics', subject: 'Physics', unit: 'Optics', name: 'Ray Optics', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED', notes: getGenericNotes('Ray Optics', 'Physics', 'Optics') },
  
  // CHEMISTRY
  { id: 'c-basic', subject: 'Chemistry', unit: 'General Chemistry', name: 'Some Basic Concepts of Chemistry', progress: 20, accuracy: 60, timeSpent: 2400, timeSpentNotes: 800, timeSpentVideos: 600, timeSpentPractice: 600, timeSpentTests: 400, status: 'LEARNING', notes: CHEMISTRY_BASIC_NOTES },
  { id: 'c-atomic', subject: 'Chemistry', unit: 'General Chemistry', name: 'Structure of Atom', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, notes: getGenericNotes('Structure of Atom', 'Chemistry', 'General Chemistry') },
  { id: 'c-bonding', subject: 'Chemistry', unit: 'General Chemistry', name: 'Chemical Bonding', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, notes: getGenericNotes('Chemical Bonding', 'Chemistry', 'General Chemistry') },
  { id: 'c-thermo', subject: 'Chemistry', unit: 'Physical Chemistry', name: 'Thermodynamics (Chemistry)', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, notes: getGenericNotes('Thermodynamics', 'Chemistry', 'Physical Chemistry') },
  { id: 'c-equilibrium', subject: 'Chemistry', unit: 'Physical Chemistry', name: 'Equilibrium', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, notes: getGenericNotes('Equilibrium', 'Chemistry', 'Physical Chemistry') },
  { id: 'c-organic-basics', subject: 'Chemistry', unit: 'Organic Chemistry', name: 'Organic Chemistry Principles', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, notes: getGenericNotes('Organic Chemistry Principles', 'Chemistry', 'Organic Chemistry') },

  // MATHEMATICS
  { id: 'm-sets', subject: 'Mathematics', unit: 'Algebra', name: 'Sets, Relations and Functions', progress: 15, accuracy: 75, timeSpent: 3600, timeSpentNotes: 1200, timeSpentVideos: 800, timeSpentPractice: 1000, timeSpentTests: 600, status: 'LEARNING', notes: MATHS_SETS_NOTES },
  { id: 'm-complex', subject: 'Mathematics', unit: 'Algebra', name: 'Complex Numbers', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, notes: getGenericNotes('Complex Numbers', 'Mathematics', 'Algebra') },
  { id: 'm-matrices', subject: 'Mathematics', unit: 'Algebra', name: 'Matrices and Determinants', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, notes: getGenericNotes('Matrices and Determinants', 'Mathematics', 'Algebra') },
  { id: 'm-calculus-limit', subject: 'Mathematics', unit: 'Calculus', name: 'Limits, Continuity and Differentiability', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, notes: getGenericNotes('Limits, Continuity and Differentiability', 'Mathematics', 'Calculus') },
  { id: 'm-trigonometry', subject: 'Mathematics', unit: 'Trigonometry', name: 'Trigonometry', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, notes: getGenericNotes('Trigonometry', 'Mathematics', 'Trigonometry') },
];

// --- BATCH QUESTION GENERATOR ---
const generateBatchQuestions = (topicId: string, subject: Subject, baseTopic: string): Question[] => {
  return Array.from({ length: 20 }).map((_, i) => ({
    id: `q_${topicId}_${i + 1}`,
    topicId,
    subject,
    text: `${baseTopic} Question ${i + 1}: Determine the characteristic value of the given system. Evaluate under standard NCERT conditions.`,
    options: ["Option A (Calculated)", "Option B (Derived)", "Option C (Edge Case)", "Option D (Invalid)"],
    correctAnswer: i % 4,
    explanation: `This problem requires applying the first principles of ${baseTopic}. Refer to the standard NCERT proof in Section ${i + 1}.`,
    difficulty: i < 5 ? 'EASY' : i < 15 ? 'MEDIUM' : 'HARD'
  }));
};

const ALL_QUESTIONS: Question[] = [];
MOCK_CHAPTERS.forEach(ch => {
    ALL_QUESTIONS.push(...generateBatchQuestions(ch.id, ch.subject, ch.name));
});

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
    { id: 'fc-4', question: "Ideal Gas Equation", answer: "PV = nRT", subject: 'Chemistry', difficulty: 'EASY', type: 'Formula' },
    { id: 'fc-7', question: "Euler's Formula for Complex Numbers", answer: "e^(ix) = cos(x) + i sin(x)", subject: 'Mathematics', difficulty: 'MEDIUM', type: 'Formula' },
  ],
  memoryHacks: [
    { id: 'mh-1', title: "Trigonometry Ratios", description: "Sine, Cosine, Tangent basic formulas", hack: "SOH CAH TOA", category: "Mnemonics", subject: "Mathematics" },
    { id: 'mh-2', title: "Redox Reactions", description: "Oxidation vs Reduction definitions", hack: "OIL RIG (Oxidation Is Loss, Reduction Is Gain)", category: "Mnemonics", subject: "Chemistry" },
  ],
  blogs: [
    { id: 'b1', title: "Mastering the Forgetting Curve for JEE 2025", content: "<h1>Strategic Recall</h1><p>Master the curve using spaced repetition algorithms.</p>", author: "Admin", date: "2024-12-20", status: "PUBLISHED" }
  ],
  messages: [],
  mockTests: [
    { id: 'jee-main-2024', name: 'JEE Main 2024 Official', duration: 180, totalMarks: 300, category: 'ADMIN', difficulty: 'MAINS', questionIds: ALL_QUESTIONS.slice(0, 75).map(q => q.id), chapterIds: ['p-units', 'm-sets', 'c-basic'] },
    { id: 'jee-adv-2024', name: 'JEE Advanced AITS Full Mock', duration: 180, totalMarks: 180, category: 'ADMIN', difficulty: 'ADVANCED', questionIds: ALL_QUESTIONS.slice(20, 80).map(q => q.id), chapterIds: ['p-kinematics', 'c-atomic', 'm-complex'] },
    { id: 'bitsat-2025-v1', name: 'BITSAT Efficiency Sprint v1', duration: 180, totalMarks: 390, category: 'ADMIN', difficulty: 'MAINS', questionIds: ALL_QUESTIONS.slice(40, 100).map(q => q.id), chapterIds: ['p-lom', 'c-bonding', 'm-matrices'] },
    { id: 'jee-mains-crash', name: 'Final Revision: 11th Syllabus', duration: 180, totalMarks: 300, category: 'ADMIN', difficulty: 'MAINS', questionIds: ALL_QUESTIONS.slice(60, 130).map(q => q.id), chapterIds: ['p-wep', 'c-thermo', 'm-trigonometry'] },
  ],
  questions: ALL_QUESTIONS,
  chapters: MOCK_CHAPTERS,
  connectedParent: undefined,
  pendingInvitations: []
};
