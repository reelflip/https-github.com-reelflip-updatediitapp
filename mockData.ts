
import { StudentData, UserRole, Chapter, Question, Subject, MockTest } from './types';

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
`;

const CHEMISTRY_BASIC_NOTES = `
<h2 class="text-3xl font-black italic tracking-tighter mt-8 mb-6 uppercase text-emerald-600">1. Basic Concepts of Chemistry: Mole Logic</h2>
<p class="text-slate-600 font-medium leading-relaxed mb-6">Chemistry deals with the composition, structure, and properties of matter. Matter is anything which has mass and occupies space.</p>

<h3 class="text-xl font-black italic tracking-tight mt-8 mb-4 uppercase text-slate-800">1.1 The Mole Concept (JEE High Yield)</h3>
<p class="text-slate-600 font-medium leading-relaxed mb-4">One mole is the amount of a substance that contains as many particles as there are atoms in exactly 12g of the C-12 isotope. This number is the <strong>Avogadro Constant (6.022 × 10^23)</strong>.</p>
<div class="bg-emerald-50 p-6 rounded-2xl border border-emerald-200 my-6 font-mono text-emerald-700">
  Number of Moles = Given Mass / Molar Mass<br>
  Molarity (M) = Moles of Solute / Volume of Solution in Litres<br>
</div>
`;

const MATHS_SETS_NOTES = `
<h2 class="text-3xl font-black italic tracking-tighter mt-8 mb-6 uppercase text-rose-600">1. Sets: Foundations of Algebra</h2>
<p class="text-slate-600 font-medium leading-relaxed mb-6">The theory of sets was developed by German mathematician Georg Cantor. A <strong>Set</strong> is a well-defined collection of objects.</p>
`;

const getGenericNotes = (name: string, subject: string, unit: string) => `
<h2 class="text-3xl font-black italic tracking-tighter mt-8 mb-6 uppercase text-slate-600">${name}</h2>
<p class="text-slate-500 font-medium leading-relaxed mb-6 italic">This module is aligned with the official 2025 ${subject} syllabus for JEE Preparation.</p>
<h3 class="text-xl font-black italic tracking-tight mt-8 mb-4 uppercase text-slate-800">Overview</h3>
<p class="text-slate-600 font-medium leading-relaxed mb-4">Core theoretical framework for ${unit}.</p>
`;

// --- CHAPTERS ---
const MOCK_CHAPTERS: Chapter[] = [
  { id: 'p-units', subject: 'Physics', unit: 'UNIT 1: Units and Measurements', name: 'Units and Measurements', progress: 85, accuracy: 72, timeSpent: 12600, timeSpentNotes: 3600, timeSpentVideos: 5400, timeSpentPractice: 3600, timeSpentTests: 0, status: 'LEARNING', notes: PHYSICS_UNITS_NOTES },
  { id: 'p-kinematics', subject: 'Physics', unit: 'UNIT 2: Kinematics', name: 'Kinematics', progress: 40, accuracy: 65, timeSpent: 7200, timeSpentNotes: 2400, timeSpentVideos: 3600, timeSpentPractice: 1200, timeSpentTests: 0, status: 'LEARNING', notes: getGenericNotes('Kinematics', 'Physics', 'Kinematics') },
  { id: 'c-basic', subject: 'Chemistry', unit: 'UNIT 1: Some Basic Concepts in Chemistry', name: 'Basic Concepts of Chemistry', progress: 100, accuracy: 88, timeSpent: 18000, timeSpentNotes: 3600, timeSpentVideos: 7200, timeSpentPractice: 3600, timeSpentTests: 3600, status: 'COMPLETED', notes: CHEMISTRY_BASIC_NOTES },
  { id: 'm-sets-relations', subject: 'Mathematics', unit: 'UNIT 1: Sets, Relations and Functions', name: 'Sets, Relations and Functions', progress: 100, accuracy: 92, timeSpent: 14400, timeSpentNotes: 3600, timeSpentVideos: 3600, timeSpentPractice: 7200, timeSpentTests: 0, status: 'COMPLETED', notes: MATHS_SETS_NOTES },
];

// --- QUESTION GENERATOR ---
const generateAcademicBatch = (topicId: string, subject: Subject, baseTopic: string, startIdx: number): Question[] => {
  return Array.from({ length: 30 }).map((_, i) => {
    const idx = startIdx + i;
    return {
      id: `q_batch_${topicId}_${idx}`,
      topicId,
      subject,
      text: `${subject} Numerical Challenge: Evaluate ${baseTopic} for a system at State-${idx}. Calculate the net scalar magnitude under JEE parameters.`,
      options: [`Option ${idx}.A`, `Option ${idx}.B`, `Option ${idx}.C`, `Option ${idx}.D`],
      correctAnswer: idx % 4,
      explanation: `Conceptual derivation follows JEE Main 2024 pattern for ${baseTopic}. Verify dimensional homogeneity.`,
      difficulty: idx % 3 === 0 ? 'EASY' : idx % 3 === 1 ? 'MEDIUM' : 'HARD'
    };
  });
};

const ALL_QUESTIONS: Question[] = [];
MOCK_CHAPTERS.forEach(ch => {
    ALL_QUESTIONS.push(...generateAcademicBatch(ch.id, ch.subject, ch.name, ALL_QUESTIONS.length));
});

// --- 10 YEARS OF MOCK TESTS ---
const JEE_MAINS_ARCHIVE: MockTest[] = Array.from({ length: 10 }).map((_, i) => {
    const year = 2015 + i;
    return {
        id: `jee-main-${year}`,
        name: `JEE Main ${year} - Official Archive`,
        duration: 180,
        totalMarks: 300,
        category: 'ADMIN',
        difficulty: 'MAINS',
        questionIds: ALL_QUESTIONS.slice(i * 10, (i * 10) + 75).map(q => q.id),
        chapterIds: ['p-units', 'm-sets-relations', 'c-basic']
    };
});

export const INITIAL_STUDENT_DATA: StudentData = {
  id: '163110',
  name: 'Aryan Sharma',
  email: 'student@iitgeeprep.com',
  timeSummary: { notes: 0, videos: 0, practice: 0, tests: 0 },
  psychometricHistory: [],
  testHistory: [
     { testId: 't1', testName: 'Diagnostic: Sets & Relations', score: 28, totalMarks: 40, accuracy: 70, date: '2024-06-01', chapterIds: ['m-sets-relations'], category: 'PRACTICE' }
  ],
  backlogs: [],
  flashcards: [],
  memoryHacks: [],
  blogs: [
    { id: 'b1', title: "Mastering the Forgetting Curve for JEE 2025", content: "<h1>Strategic Recall</h1><p>Master the curve using spaced repetition algorithms.</p>", author: "Admin", date: "2024-12-20", status: "PUBLISHED" }
  ],
  messages: [],
  mockTests: JEE_MAINS_ARCHIVE,
  questions: ALL_QUESTIONS,
  chapters: MOCK_CHAPTERS,
  pendingInvitations: []
};
