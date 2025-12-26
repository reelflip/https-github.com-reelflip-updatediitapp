
import { StudentData } from "../types";

/**
 * LOCAL HEURISTIC ENGINE (The "Free Model")
 * Analyzes student data locally to provide tactical advice without API keys.
 */

export const getSmartStudyAdvice = async (data: StudentData) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  const weakChapters = data.chapters.filter(c => c.accuracy < 65).slice(0, 2);
  const backlogs = data.backlogs.slice(0, 1);
  const currentPsych = data.psychometricHistory[data.psychometricHistory.length - 1];

  const priorities = [
    weakChapters.length > 0 
      ? `Intensive Drill: ${weakChapters[0].name} (Current Accuracy: ${weakChapters[0].accuracy}%)` 
      : "Complete 25 mixed-concept MCQs in Mathematics.",
    backlogs.length > 0 
      ? `Clear Backlog: ${backlogs[0].title} (${backlogs[0].subject})` 
      : "Revise Organic Chemistry Nomenclature notes.",
    currentPsych?.stress > 7 
      ? "Take a 20-minute 'Active Recovery' break to lower cortisol." 
      : "Attempt 1 timed Topic Mock for high-weightage Physics units."
  ];

  let mindsetTip = "Your consistency index is stable. Keep following the current routine for maximum momentum.";
  if (currentPsych?.stress > 7) mindsetTip = "Stress levels are drifting high. Shift from learning new concepts to light revision today.";
  if (currentPsych?.focus < 5) mindsetTip = "Focus stability detected as 'Scattered'. Use the Focus Timer with White Noise atmosphere.";

  return {
    priorities,
    burnoutAlert: currentPsych?.stress > 8 ? "High burnout risk identified. Reduce evening session duration." : null,
    mindsetTip
  };
};

export const generateSmartTimetable = async (data: StudentData) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const weakSubject = data.chapters.reduce((prev, curr) => (prev.accuracy < curr.accuracy ? prev : curr)).subject;
  return {
    strategy: `Strategic 2:1:1 split favoring ${weakSubject}. Heavy focus on problem-solving during your peak energy hours.`,
    optimization: "Shift your high-difficulty tasks (Calculus/Physics) to immediately after school hours when brain plasticity is highest.",
    focusBlocks: [
      `${weakSubject} - Critical Revision`,
      "Mathematics - Problem Sprinting",
      "Chemistry - Memory Hook Drill"
    ]
  };
};

export const chatWithTutor = async (history: any[], userMessage: string, modelId: string = 'solaris-core') => {
  await new Promise(resolve => setTimeout(resolve, 600));
  const msg = userMessage.toLowerCase();
  
  // Model Personalities Logic
  const responses: Record<string, string> = {
    'solaris-core': "System focus: Data-driven efficiency. Based on local telemetry, Darwin's theory (Natural Selection) mirrors your testing phase: only the most practiced concepts survive the exam pressure. Focus on your 45% accuracy units first.",
    
    'gpt-4o-edu': "Mathematical Precision Mode: Darwin's theory can be modeled as a stochastic process where traits (p) increase frequency based on fitness (w). For your prep, 'fitness' is your MCQ speed. Currently, your Physics speed is 2.4 min/q—needs optimization.",
    
    'claude-3-stu': "Conceptual Deep-Dive: Understanding Darwin requires looking at the 'Variation' within a population. Similarly, look at the 'Variation' in your mistakes. Are they calculation errors or conceptual gaps? Notes for Biology/Evolution are being prioritized in your feed.",
    
    'gemini-flash-base': "Multimodal Insight: I've processed your query. Darwin's Theory is often illustrated via the 'Finches of Galapagos'. I suggest you visualize the Evolutionary Tree. I can help you map out the connections between Genetics and Evolution chapters next.",
    
    'llama-3-heuristic': "Conversational Coach: Hey! Darwin's theory is all about adapting to stay alive. In JEE, you adapt by failing Mocks and learning. Don't sweat the low scores; they are just 'mutations' that help you find the right solving path. Keep at it!",
    
    'deepseek-coder': "Logic & Algorithm Node: Darwin_Theory_v1.0. Error correction detected. The 'Survival of the Fittest' algorithm is a recursive loop of testing. If your Accuracy < 60, break current loop and re-initialize basic theory. Recursive solving advised.",
    
    'iit-pulse': "Topper Strategy Mode: Darwin's theory is a high-weightage topic for KVPY and certain JEE advanced biological applications. Realistically, if you don't master the 'Evidence' section, you'll lose 4 marks. Memorize the 'Analogous vs Homologous' table tonight. High priority."
  };

  // Subject specific overrides if the query is clear
  if (msg.includes('physics')) return `[${modelId.toUpperCase()}] Analytical focus: Physics requires first-principle thinking. Your Mechanics accuracy is currently drifting. Drill 10 FBD problems.`;
  if (msg.includes('chem')) return `[${modelId.toUpperCase()}] Chemical properties sync: Inorganic requires daily recall. Organic requires mechanism mapping. Clear the 'Nomenclature' backlog before moving to 'Hydrocarbons'.`;

  return responses[modelId] || "Intelligence node active. Ready for query.";
};
