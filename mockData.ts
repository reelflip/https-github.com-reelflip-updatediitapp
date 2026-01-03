
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
`;

const MATHS_SETS_NOTES = `
<h2 class="text-3xl font-black italic tracking-tighter mt-8 mb-6 uppercase text-rose-600">1. Sets: Foundations of Algebra</h2>
<p class="text-slate-600 font-medium leading-relaxed mb-6">The theory of sets was developed by German mathematician Georg Cantor. A <strong>Set</strong> is a well-defined collection of objects.</p>

<h3 class="text-xl font-black italic tracking-tight mt-8 mb-4 uppercase text-slate-800">1.1 Representation of Sets</h3>
<ul class="list-disc pl-8 space-y-3 my-6">
  <li><strong>Roster or Tabular Form:</strong> Elements are listed within braces { } and separated by commas. Ex: {2, 4, 6, 8}.</li>
  <li><strong>Set-builder Form:</strong> Elements possess a single common property. Ex: {x : x is a natural number and x < 10}.</li>
</ul>
`;

// Helper for generic NCERT template
const getGenericNotes = (name: string, subject: string, unit: string) => `
<h2 class="text-3xl font-black italic tracking-tighter mt-8 mb-6 uppercase text-slate-600">${name}</h2>
<p class="text-slate-500 font-medium leading-relaxed mb-6 italic">This module is aligned with the official 2025 ${subject} syllabus for JEE Preparation.</p>

<h3 class="text-xl font-black italic tracking-tight mt-8 mb-4 uppercase text-slate-800">1. Overview</h3>
<p class="text-slate-600 font-medium leading-relaxed mb-4">This unit constitutes a vital part of the entrance framework. It focuses on the fundamental principles and theoretical derivations necessary for complex problem solving in ${unit}.</p>

<h3 class="text-xl font-black italic tracking-tight mt-8 mb-4 uppercase text-slate-800">2. Critical NCERT Objectives</h3>
<ul class="list-disc pl-8 space-y-3 my-6">
  <li>Identify and define the core parameters of <strong>${name}</strong>.</li>
  <li>Derive mathematical expressions from first principles.</li>
  <li>Apply concepts to solve numerical problems featured in previous JEE papers.</li>
</ul>

<h3 class="text-xl font-black italic tracking-tight mt-8 mb-4 uppercase text-slate-800">3. Strategic Notes for JEE</h3>
<p class="text-slate-600 font-medium leading-relaxed mb-4">Focus on conceptual clarity over rote memorization. Previous years' analysis shows that questions from ${name} often integrate with other topics in ${subject}.</p>
`;

// --- COMPREHENSIVE CHAPTERS DATA ---

const MOCK_CHAPTERS: Chapter[] = [
  // --- PHYSICS (20 Units) ---
  { id: 'p-units', subject: 'Physics', unit: 'UNIT 1: Units and Measurements', name: 'Units and Measurements', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED', notes: PHYSICS_UNITS_NOTES },
  { id: 'p-kinematics', subject: 'Physics', unit: 'UNIT 2: Kinematics', name: 'Kinematics', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED', notes: getGenericNotes('Kinematics', 'Physics', 'Kinematics') },
  { id: 'p-lom', subject: 'Physics', unit: 'UNIT 3: Laws of Motion', name: 'Laws of Motion', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED', notes: getGenericNotes('Laws of Motion', 'Physics', 'Mechanics') },
  { id: 'p-wep', subject: 'Physics', unit: 'UNIT 4: Work, Energy and Power', name: 'Work, Energy and Power', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED', notes: getGenericNotes('Work, Energy and Power', 'Physics', 'Mechanics') },
  { id: 'p-rotational', subject: 'Physics', unit: 'UNIT 5: Rotational Motion', name: 'Rotational Motion', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED', notes: getGenericNotes('Rotational Motion', 'Physics', 'Mechanics') },
  { id: 'p-gravitation', subject: 'Physics', unit: 'UNIT 6: Gravitation', name: 'Gravitation', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED', notes: getGenericNotes('Gravitation', 'Physics', 'Mechanics') },
  { id: 'p-solids-liquids', subject: 'Physics', unit: 'UNIT 7: Properties of Solids and Liquids', name: 'Properties of Solids and Liquids', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED', notes: getGenericNotes('Properties of Solids and Liquids', 'Physics', 'Matter') },
  { id: 'p-thermo', subject: 'Physics', unit: 'UNIT 8: Thermodynamics', name: 'Thermodynamics', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED', notes: getGenericNotes('Thermodynamics', 'Physics', 'Thermodynamics') },
  { id: 'p-ktg', subject: 'Physics', unit: 'UNIT 9: Kinetic Theory of Gases', name: 'Kinetic Theory of Gases', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED', notes: getGenericNotes('Kinetic Theory of Gases', 'Physics', 'Thermal') },
  { id: 'p-oscillations-waves', subject: 'Physics', unit: 'UNIT 10: Oscillations and Waves', name: 'Oscillations and Waves', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED', notes: getGenericNotes('Oscillations and Waves', 'Physics', 'Waves') },
  { id: 'p-electrostatics', subject: 'Physics', unit: 'UNIT 11: Electrostatics', name: 'Electrostatics', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED', notes: getGenericNotes('Electrostatics', 'Physics', 'Electricity') },
  { id: 'p-current', subject: 'Physics', unit: 'UNIT 12: Current Electricity', name: 'Current Electricity', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED', notes: getGenericNotes('Current Electricity', 'Physics', 'Electricity') },
  { id: 'p-magnetic-effects', subject: 'Physics', unit: 'UNIT 13: Magnetic Effects of Current and Magnetism', name: 'Magnetic Effects of Current and Magnetism', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED', notes: getGenericNotes('Magnetic Effects', 'Physics', 'Magnetism') },
  { id: 'p-emi-ac', subject: 'Physics', unit: 'UNIT 14: Electromagnetic Induction and Alternating Currents', name: 'Electromagnetic Induction and AC', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED', notes: getGenericNotes('EMI and AC', 'Physics', 'Magnetism') },
  { id: 'p-em-waves', subject: 'Physics', unit: 'UNIT 15: Electromagnetic Waves', name: 'Electromagnetic Waves', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED', notes: getGenericNotes('EM Waves', 'Physics', 'Waves') },
  { id: 'p-optics', subject: 'Physics', unit: 'UNIT 16: Optics', name: 'Optics (Ray and Wave)', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED', notes: getGenericNotes('Optics', 'Physics', 'Optics') },
  { id: 'p-dual-nature', subject: 'Physics', unit: 'UNIT 17: Dual Nature of Matter and Radiation', name: 'Dual Nature of Matter and Radiation', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED', notes: getGenericNotes('Dual Nature', 'Physics', 'Modern') },
  { id: 'p-atoms-nuclei', subject: 'Physics', unit: 'UNIT 18: Atoms and Nuclei', name: 'Atoms and Nuclei', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED', notes: getGenericNotes('Atoms and Nuclei', 'Physics', 'Modern') },
  { id: 'p-electronic-devices', subject: 'Physics', unit: 'UNIT 19: Electronic Devices', name: 'Electronic Devices', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED', notes: getGenericNotes('Electronic Devices', 'Physics', 'Electronics') },
  { id: 'p-experimental-skills', subject: 'Physics', unit: 'UNIT 20: Experimental Skills', name: 'Experimental Skills', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED', notes: getGenericNotes('Experimental Skills', 'Physics', 'Lab') },

  // --- CHEMISTRY (20 Units) ---
  { id: 'c-basic', subject: 'Chemistry', unit: 'UNIT 1: Some Basic Concepts in Chemistry', name: 'Basic Concepts of Chemistry', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED', notes: CHEMISTRY_BASIC_NOTES },
  { id: 'c-atomic-structure', subject: 'Chemistry', unit: 'UNIT 2: Atomic Structure', name: 'Atomic Structure', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, notes: getGenericNotes('Atomic Structure', 'Chemistry', 'General') },
  { id: 'c-bonding', subject: 'Chemistry', unit: 'UNIT 3: Chemical Bonding and Molecular Structure', name: 'Chemical Bonding', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, notes: getGenericNotes('Chemical Bonding', 'Chemistry', 'General') },
  { id: 'c-thermo', subject: 'Chemistry', unit: 'UNIT 4: Chemical Thermodynamics', name: 'Chemical Thermodynamics', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, notes: getGenericNotes('Thermodynamics', 'Chemistry', 'Physical') },
  { id: 'c-solutions', subject: 'Chemistry', unit: 'UNIT 5: Solutions', name: 'Solutions', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, notes: getGenericNotes('Solutions', 'Chemistry', 'Physical') },
  { id: 'c-equilibrium', subject: 'Chemistry', unit: 'UNIT 6: Equilibrium', name: 'Equilibrium', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, notes: getGenericNotes('Equilibrium', 'Chemistry', 'Physical') },
  { id: 'c-redox-electro', subject: 'Chemistry', unit: 'UNIT 7: Redox Reactions and Electrochemistry', name: 'Redox Reactions and Electrochemistry', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, notes: getGenericNotes('Electrochemistry', 'Chemistry', 'Physical') },
  { id: 'c-kinetics', subject: 'Chemistry', unit: 'UNIT 8: Chemical Kinetics', name: 'Chemical Kinetics', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, notes: getGenericNotes('Chemical Kinetics', 'Chemistry', 'Physical') },
  { id: 'c-periodicity', subject: 'Chemistry', unit: 'UNIT 9: Classification of Elements and Periodicity', name: 'Periodicity in Properties', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, notes: getGenericNotes('Periodicity', 'Chemistry', 'Inorganic') },
  { id: 'c-pblock', subject: 'Chemistry', unit: 'UNIT 10: p-Block Elements', name: 'p-Block Elements', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, notes: getGenericNotes('p-Block', 'Chemistry', 'Inorganic') },
  { id: 'c-dfblock', subject: 'Chemistry', unit: 'UNIT 11: d- and f- Block Elements', name: 'd- and f- Block Elements', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, notes: getGenericNotes('d-f Block', 'Chemistry', 'Inorganic') },
  { id: 'c-coordination', subject: 'Chemistry', unit: 'UNIT 12: Coordination Compounds', name: 'Coordination Compounds', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, notes: getGenericNotes('Coordination', 'Chemistry', 'Inorganic') },
  { id: 'c-purification', subject: 'Chemistry', unit: 'UNIT 13: Purification and Characterisation', name: 'Purification and Characterisation of Organic Compounds', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, notes: getGenericNotes('Purification', 'Chemistry', 'Organic') },
  { id: 'c-organic-principles', subject: 'Chemistry', unit: 'UNIT 14: Some Basic Principles of Organic Chemistry', name: 'Organic Chemistry Principles', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, notes: getGenericNotes('Organic Principles', 'Chemistry', 'Organic') },
  { id: 'c-hydrocarbons', subject: 'Chemistry', unit: 'UNIT 15: Hydrocarbons', name: 'Hydrocarbons', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, notes: getGenericNotes('Hydrocarbons', 'Chemistry', 'Organic') },
  { id: 'c-halogens', subject: 'Chemistry', unit: 'UNIT 16: Organic Compounds containing Halogens', name: 'Haloalkanes and Haloarenes', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, notes: getGenericNotes('Halogens', 'Chemistry', 'Organic') },
  { id: 'c-oxygen', subject: 'Chemistry', unit: 'UNIT 17: Organic Compounds containing Oxygen', name: 'Alcohols, Phenols, Ethers, Aldehydes, Ketones and Acids', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, notes: getGenericNotes('Oxygen Compounds', 'Chemistry', 'Organic') },
  { id: 'c-nitrogen', subject: 'Chemistry', unit: 'UNIT 18: Organic Compounds containing Nitrogen', name: 'Amines and Diazonium Salts', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, notes: getGenericNotes('Nitrogen Compounds', 'Chemistry', 'Organic') },
  { id: 'c-biomolecules', subject: 'Chemistry', unit: 'UNIT 19: Biomolecules', name: 'Biomolecules', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, notes: getGenericNotes('Biomolecules', 'Chemistry', 'Organic') },
  { id: 'c-practical', subject: 'Chemistry', unit: 'UNIT 20: Principles Related to Practical Chemistry', name: 'Practical Chemistry Principles', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, notes: getGenericNotes('Practical Chemistry', 'Chemistry', 'Practical') },

  // --- MATHEMATICS (14 Units) ---
  { id: 'm-sets-relations', subject: 'Mathematics', unit: 'UNIT 1: Sets, Relations and Functions', name: 'Sets, Relations and Functions', progress: 0, accuracy: 0, timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, status: 'NOT_STARTED', notes: MATHS_SETS_NOTES },
  { id: 'm-complex', subject: 'Mathematics', unit: 'UNIT 2: Complex Numbers and Quadratic Equations', name: 'Complex Numbers and Quadratic Equations', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, notes: getGenericNotes('Complex Numbers', 'Mathematics', 'Algebra') },
  { id: 'm-matrices', subject: 'Mathematics', unit: 'UNIT 3: Matrices and Determinants', name: 'Matrices and Determinants', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, notes: getGenericNotes('Matrices', 'Mathematics', 'Algebra') },
  { id: 'm-pnc', subject: 'Mathematics', unit: 'UNIT 4: Permutations and Combinations', name: 'Permutations and Combinations', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, notes: getGenericNotes('P&C', 'Mathematics', 'Algebra') },
  { id: 'm-binomial', subject: 'Mathematics', unit: 'UNIT 5: Binomial Theorem', name: 'Binomial Theorem and Its Simple Applications', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, notes: getGenericNotes('Binomial', 'Mathematics', 'Algebra') },
  { id: 'm-sequence-series', subject: 'Mathematics', unit: 'UNIT 6: Sequence and Series', name: 'Sequence and Series', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, notes: getGenericNotes('Sequence and Series', 'Mathematics', 'Algebra') },
  { id: 'm-calculus-limit', subject: 'Mathematics', unit: 'UNIT 7: Limit, Continuity and Differentiability', name: 'Limits, Continuity and Differentiability', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, notes: getGenericNotes('Limits', 'Mathematics', 'Calculus') },
  { id: 'm-integral', subject: 'Mathematics', unit: 'UNIT 8: Integral Calculus', name: 'Integral Calculus', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, notes: getGenericNotes('Integrals', 'Mathematics', 'Calculus') },
  { id: 'm-diff-eq', subject: 'Mathematics', unit: 'UNIT 9: Differential Equations', name: 'Differential Equations', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, notes: getGenericNotes('Differential Equations', 'Mathematics', 'Calculus') },
  { id: 'm-coordinate-geometry', subject: 'Mathematics', unit: 'UNIT 10: Co-ordinate Geometry', name: 'Straight Lines, Circles and Conics', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, notes: getGenericNotes('Coordinate Geometry', 'Mathematics', 'Geometry') },
  { id: 'm-3d-geometry', subject: 'Mathematics', unit: 'UNIT 11: Three Dimensional Geometry', name: 'Three Dimensional Geometry', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, notes: getGenericNotes('3D Geometry', 'Mathematics', 'Geometry') },
  { id: 'm-vectors', subject: 'Mathematics', unit: 'UNIT 12: Vector Algebra', name: 'Vector Algebra', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, notes: getGenericNotes('Vectors', 'Mathematics', 'Algebra') },
  { id: 'm-stats-probability', subject: 'Mathematics', unit: 'UNIT 13: Statistics and Probability', name: 'Statistics and Probability', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, notes: getGenericNotes('Statistics and Probability', 'Mathematics', 'Probability') },
  { id: 'm-trigonometry', subject: 'Mathematics', unit: 'UNIT 14: Trigonometry', name: 'Trigonometry', progress: 0, accuracy: 0, status: 'NOT_STARTED', timeSpent: 0, timeSpentNotes: 0, timeSpentVideos: 0, timeSpentPractice: 0, timeSpentTests: 0, notes: getGenericNotes('Trigonometry', 'Mathematics', 'Trigonometry') },
];

// --- SEEDED REAL QUESTIONS ---

const REAL_QUESTIONS: Question[] = [
  // Physics: Units and Measurements
  {
    id: 'q-p-units-1',
    topicId: 'p-units',
    subject: 'Physics',
    text: "The dimensional formula of Planck's Constant (h) is the same as that of:",
    options: ["Angular Momentum", "Linear Momentum", "Work", "Coefficient of Viscosity"],
    correctAnswer: 0,
    explanation: "Planck's constant (h) = E/ν = [ML²T⁻²] / [T⁻¹] = [ML²T⁻¹]. Angular momentum (L) = mvr = [M][LT⁻¹][L] = [ML²T⁻¹]. Both have the same dimensions.",
    difficulty: 'EASY'
  },
  {
    id: 'q-p-units-2',
    topicId: 'p-units',
    subject: 'Physics',
    text: "The percentage error in the measurement of the radius of a sphere is 1%. What will be the percentage error in the measurement of its volume?",
    options: ["1%", "2%", "3%", "4%"],
    correctAnswer: 2,
    explanation: "Volume of a sphere V = (4/3)πr³. Taking log and differentiating: dV/V = 3(dr/r). Therefore, % error in V = 3 × % error in r = 3 × 1% = 3%.",
    difficulty: 'EASY'
  },

  // Chemistry: Basic Concepts
  {
    id: 'q-c-basic-1',
    topicId: 'c-basic',
    subject: 'Chemistry',
    text: "Calculate the molarity of a solution containing 5g of NaOH in 450 mL solution.",
    options: ["0.278 M", "0.312 M", "0.450 M", "0.125 M"],
    correctAnswer: 0,
    explanation: "Moles of NaOH = 5g / 40g/mol = 0.125 mol. Volume = 0.450 L. Molarity = 0.125 / 0.450 = 0.2777... ≈ 0.278 M.",
    difficulty: 'EASY'
  },

  // Mathematics: Sets
  {
    id: 'q-m-sets-1',
    topicId: 'm-sets-relations',
    subject: 'Mathematics',
    text: "If set A has 3 elements, how many elements are there in the Power Set P(A)?",
    options: ["3", "6", "8", "9"],
    correctAnswer: 2,
    explanation: "The number of elements in the power set P(A) of a set with n elements is 2ⁿ. Here n=3, so 2³ = 8.",
    difficulty: 'EASY'
  }
];

// --- BATCH QUESTION GENERATOR (For volume, but with subject-specific context) ---
const generateAcademicBatch = (topicId: string, subject: Subject, baseTopic: string, startIdx: number): Question[] => {
  return Array.from({ length: 15 }).map((_, i) => {
    const idx = startIdx + i;
    let text = "";
    let options = ["Option A", "Option B", "Option C", "Option D"];
    let explanation = "Refer to NCERT Chapter logic.";
    
    if (subject === 'Physics') {
      text = `Evaluate the ${baseTopic} phenomenon for a system in state ψ_${idx}. Using first principles of mechanics, the resulting vector magnitude is:`;
      options = [`√${idx} units`, `${idx}² units`, `1/${idx} units`, `Zero` ];
    } else if (subject === 'Chemistry') {
      text = `In the reaction involving ${baseTopic}, calculate the theoretical yield if ${idx} moles of reactant are consumed under STP.`;
      options = [`${idx * 22.4} L`, `${idx * 2} mol`, `${idx} g`, `None` ];
    } else {
      text = `Consider the ${baseTopic} function f(x). Find the range of the set for the interval [${idx}, ${idx+10}].`;
      options = [`(0, ∞)`, `[-${idx}, ${idx}]`, `R - {${idx}}`, `Empty Set` ];
    }

    return {
      id: `q_batch_${topicId}_${idx}`,
      topicId,
      subject,
      text,
      options,
      correctAnswer: idx % 4,
      explanation: `Analyze the boundary conditions for ${baseTopic} as per JEE Main 2024 patterns. ${explanation}`,
      difficulty: idx % 3 === 0 ? 'EASY' : idx % 3 === 1 ? 'MEDIUM' : 'HARD'
    };
  });
};

const ALL_QUESTIONS: Question[] = [...REAL_QUESTIONS];
MOCK_CHAPTERS.forEach(ch => {
    // Fill up the rest with contextual academic questions
    ALL_QUESTIONS.push(...generateAcademicBatch(ch.id, ch.subject, ch.name, ALL_QUESTIONS.length));
});

export const INITIAL_STUDENT_DATA: StudentData = {
  id: '163110',
  name: 'Aryan Sharma',
  email: 'ishu@gmail.com',
  timeSummary: { notes: 0, videos: 0, practice: 0, tests: 0 },
  psychometricHistory: [],
  testHistory: [],
  backlogs: [],
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
    { id: 'jee-main-2024', name: 'JEE Main 2024 Official', duration: 180, totalMarks: 300, category: 'ADMIN', difficulty: 'MAINS', questionIds: ALL_QUESTIONS.slice(0, 75).map(q => q.id), chapterIds: ['p-units', 'm-sets-relations', 'c-basic'] },
  ],
  questions: ALL_QUESTIONS,
  chapters: MOCK_CHAPTERS,
  connectedParent: undefined,
  pendingInvitations: []
};
