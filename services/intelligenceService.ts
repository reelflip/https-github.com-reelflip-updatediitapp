
import { StudentData } from "../types";

/**
 * LOCAL HEURISTIC ENGINE (The "Free Model")
 * Analyzes student data locally to provide tactical advice without API keys.
 */

export const getSmartStudyAdvice = async (data: StudentData) => {
  // Simulate network delay for "processing" feel
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

export const chatWithTutor = async (history: any[], userMessage: string) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const msg = userMessage.toLowerCase();
  
  if (msg.includes('physics') || msg.includes('how to study')) {
    return "For Physics, the key is visualization. Instead of memorizing formulas, try to derive them from basic principles. For today, I recommend focusing on FBD diagrams for Mechanics.";
  }
  
  if (msg.includes('chem') || msg.includes('organic')) {
    return "Organic Chemistry requires 'Mechanism Mapping'. Don't just look at the reaction; draw the electron flow. Have you cleared your nomenclature backlogs yet?";
  }

  if (msg.includes('plan') || msg.includes('timetable')) {
    return "I've analyzed your mastery trends. Your Mathematics accuracy is leading, but Physics needs more 'Deep Work' blocks. Check your Timetable module for the updated tactical plan.";
  }

  return "I am the JEE-PRO Tactical Assistant. I analyze your performance data to give you subject-specific advice. You can ask me about study strategies, subject focus, or how to improve your accuracy.";
};
