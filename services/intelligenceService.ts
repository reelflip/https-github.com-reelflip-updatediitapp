import { StudentData } from "../types";

/**
 * SOLARIS HEURISTIC ENGINE v12.0 - "ACADEMIC KERNEL"
 * Pure Local Intelligence - Deep Contextual Analysis
 * Status: 100% KEY-AGNOSTIC / ZERO EXTERNAL CALLS
 */

export interface ModelConfig {
  name: string;
  tag: string;
  desc: string;
  color: string;
}

export const MODEL_CONFIGS: Record<string, ModelConfig> = {
  'gemini-flash': { 
    name: 'Solaris Flash', 
    tag: 'SPEED', 
    desc: 'Rapid tactical scanning. Best for scheduling and syllabus velocity checks.', 
    color: 'blue'
  },
  'gemini-pro': { 
    name: 'Solaris Pro', 
    tag: 'REASONING', 
    desc: 'Deep derivation logic. Analyzes complex physics and math relationships.', 
    color: 'purple'
  },
  'llama-3-1': { 
    name: 'Pedagogy Node', 
    tag: 'THEORY', 
    desc: 'Detailed concept explanations and pedagogical guidance.', 
    color: 'indigo'
  },
  'deepseek-v3': { 
    name: 'Logic Node', 
    tag: 'ANALYSIS', 
    desc: 'High-precision logical checks for Chemistry and Formula stability.', 
    color: 'teal'
  },
  'qwen-math': { 
    name: 'Math Master', 
    tag: 'MATH', 
    desc: 'Calculus, Algebra, and Coordinate Geometry optimization heuristics.', 
    color: 'emerald'
  },
  'mistral-large': { 
    name: 'Guidance Node', 
    tag: 'STRATEGY', 
    desc: 'Balanced long-term strategy and psychometric stability support.', 
    color: 'orange'
  }
};

const getActiveModelId = (userSelected?: string): string => {
  return localStorage.getItem('jeepro_platform_ai_model') || userSelected || 'gemini-flash';
};

/**
 * ACADEMIC KNOWLEDGE MATRIX
 * Hardcoded logic patterns for JEE-specific queries
 */
const KNOWLEDGE_MAP: Record<string, string> = {
  'physics': 'In Physics, focus on visual mapping of vectors. For mechanics, your Free Body Diagrams must be 100% accurate before you touch a formula.',
  'math': 'Mathematics requires pattern recognition. If you are stuck on Calculus, re-verify your Limits and Continuity foundations.',
  'chemistry': 'Chemistry is a data subject. For Organic, track electron density; for Inorganic, group trends are your best friend.',
  'thermodynamics': 'Thermodynamics Tip: Keep your sign conventions (Work done BY vs ON) consistent across all solving sessions.',
  'mechanics': 'Rotational mechanics is often the "rank-killer". Break the motion into Translational + Rotational parts.',
  'organic': 'Stop memorizing reactions. Start understanding Nucleophiles and Electrophiles. The mechanism is the map.',
  'calculus': 'Calculus is the language of JEE. If your integration is weak, your Physics score will likely plateau.',
  'strategy': 'Current high-performance strategy: Solve easy Qs first to build momentum, then attack multi-concept Hard Qs.'
};

export const getSmartStudyAdvice = async (data: StudentData) => {
  const modelId = getActiveModelId(data.aiTutorModel);
  const config = MODEL_CONFIGS[modelId] || MODEL_CONFIGS['gemini-flash'];
  
  const weakChapters = data.chapters
    .filter(c => c.accuracy < 70 && c.status !== 'NOT_STARTED')
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 3);

  const priorities = weakChapters.length > 0 
    ? weakChapters.map(c => `[${config.tag}] Intensive Drill: ${c.name} (Goal: 85% Accuracy)`)
    : ["Global Syllabus Sync", "Mock Test Simulation Phase", "High-Yield Formula Review"];

  const currentPsych = data.psychometricHistory[data.psychometricHistory.length - 1];
  const stress = currentPsych?.stress || 5;
  const focus = currentPsych?.focus || 5;
  
  let mindsetTip = `${config.name} suggests maintaining your current solving velocity.`;
  if (stress > 7) mindsetTip = "WARNING: Cognitive saturation detected. Switch to passive reading for 30m.";
  if (focus < 4) mindsetTip = "ADVICE: Low focus stamina. Use the Pomodoro timer in the Focus tab for 25m blocks.";

  return {
    priorities,
    burnoutAlert: stress > 8 ? "CRITICAL: Physiological Reset Required. 0% Load for 4 hours." : null,
    mindsetTip
  };
};

export const generateSmartTimetable = async (data: StudentData) => {
  const modelId = getActiveModelId(data.aiTutorModel);
  const config = MODEL_CONFIGS[modelId] || MODEL_CONFIGS['gemini-flash'];
  
  return {
    strategy: `${config.name} Optimized Trajectory`,
    optimization: `Injecting ${config.tag}-based focus blocks to maximize retention for your upcoming Mock Tests.`,
    focusBlocks: ["60m Concept Deep-Dive", "90m Accuracy Practice", "30m Mental Recovery"]
  };
};

export const chatWithTutor = async (history: any[], userMessage: string, modelId?: string, data?: StudentData) => {
  const activeId = getActiveModelId(modelId || data?.aiTutorModel);
  const config = MODEL_CONFIGS[activeId] || MODEL_CONFIGS['gemini-flash'];
  const msg = userMessage.toLowerCase();

  // Search Knowledge Matrix
  let response = "";
  for (const [key, val] of Object.entries(KNOWLEDGE_MAP)) {
    if (msg.includes(key)) {
      response = val;
      break;
    }
  }

  if (response) {
    return `[${config.name} - ${config.tag}] ${response} Looking at your profile, I see you have ${(data?.chapters.filter(c=>c.progress >= 100).length || 0)} units completed. Let's build on that.`;
  }

  if (msg.includes('hello') || msg.includes('hi')) {
    return `Identity Verified: ${data?.name || 'Aspirant'}. I am the ${config.name} engine operating in ${config.tag} mode. How shall we optimize your 2025 prep today?`;
  }

  // Adaptive Failback
  return `[${config.name}] I have processed your query via local heuristics. Based on your current performance matrix (Avg Accuracy: ${Math.round((data?.chapters.reduce((a,c)=>a+c.accuracy,0)||0)/(data?.chapters.length||1))}%), I recommend focusing on concept stability over solving speed for this specific query.`;
};