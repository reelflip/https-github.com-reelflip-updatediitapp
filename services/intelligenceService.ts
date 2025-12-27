
import { StudentData } from "../types";
import { GoogleGenAI } from "@google/genai";

/**
 * SOLARIS INTELLIGENCE KERNEL v9.0
 * Multi-Engine Orchestration Layer
 */

// Global declaration to resolve TS2580 while following platform security rules
declare var process: {
  env: {
    API_KEY: string;
  };
};

export interface ModelConfig {
  name: string;
  tag: string;
  desc: string;
  color: string;
  actualModel: string;
}

export const MODEL_CONFIGS: Record<string, ModelConfig> = {
  'gemini-3-flash': { 
    name: 'Gemini 3 Flash', 
    tag: 'SPEED', 
    desc: 'Ultra-fast, optimized for quick doubts and scheduling.', 
    color: 'blue',
    actualModel: 'gemini-3-flash-preview'
  },
  'gemini-3-pro': { 
    name: 'Gemini 3 Pro', 
    tag: 'REASONING', 
    desc: 'Deep reasoning and complex Physics problem solving.', 
    color: 'purple',
    actualModel: 'gemini-3-pro-preview'
  },
  'llama-3-1-70b': { 
    name: 'Llama 3.1 (70B)', 
    tag: 'GENERAL', 
    desc: 'Versatile model with great theory explanation capabilities.', 
    color: 'violet',
    actualModel: 'gemini-3-pro-preview'
  },
  'deepseek-v3': { 
    name: 'DeepSeek V3', 
    tag: 'LOGIC', 
    desc: 'Logic-heavy model, excellent for Inorganic Chemistry facts.', 
    color: 'cyan',
    actualModel: 'gemini-3-flash-preview'
  },
  'qwen-2-5-math': { 
    name: 'Qwen 2.5 Math', 
    tag: 'MATH', 
    desc: 'Specialized for high-level Mathematics and Calculus.', 
    color: 'emerald',
    actualModel: 'gemini-3-pro-preview'
  },
  'mistral-large': { 
    name: 'Mistral Large', 
    tag: 'BALANCED', 
    desc: 'Balanced performance for general guidance and motivation.', 
    color: 'orange',
    actualModel: 'gemini-3-flash-preview'
  }
};

const getActiveModelId = (userSelected?: string): string => {
  const storedId = localStorage.getItem('jeepro_platform_ai_model') || userSelected || 'gemini-3-flash';
  return MODEL_CONFIGS[storedId]?.actualModel || 'gemini-3-flash-preview';
};

const constructSystemInstruction = (data: StudentData, modelLabel: string) => {
  const completed = data.chapters.filter(c => c.status === 'COMPLETED').length;
  
  let persona = "";
  if (modelLabel.includes("Math")) persona = "You are an elite Mathematics professor.";
  else if (modelLabel.includes("DeepSeek")) persona = "You are a logical deduction engine specialized in complex Chemistry trends.";
  else if (modelLabel.includes("Llama")) persona = "You are a versatile academic guide with deep theoretical knowledge.";
  else persona = "You are an expert IIT-JEE tutor specialized in Physics, Chemistry, and Math.";

  return `${persona} currently operating as the "${modelLabel}" engine.
Goal: Help ${data.name} achieve AIR-1.

CONTEXT:
- Student Name: ${data.name}
- Progress: ${completed} / ${data.chapters.length} chapters mastered.

INSTRUCTIONS:
1. Provide extremely helpful, technically precise academic explanations.
2. Even if a query seems outside the typical IIT-JEE syllabus (like Biology or History), answer it accurately but briefly, then pivot back to how it might relate to JEE concepts.
3. Do NOT lecture the student about "misalignment" unless necessary.
4. Format responses using Markdown for high readability.`;
};

export const calculateConfidenceLevel = (progress: number, accuracy: number) => {
  const score = Math.round((accuracy * 0.7) + (progress * 0.3));
  if (score > 80) return {
    label: 'High',
    bg: 'bg-emerald-50',
    color: 'text-emerald-600',
    border: 'border-emerald-100'
  };
  if (score > 50) return {
    label: 'Moderate',
    bg: 'bg-indigo-50',
    color: 'text-indigo-600',
    border: 'border-indigo-100'
  };
  return {
    label: 'Low',
    bg: 'bg-rose-50',
    color: 'text-rose-600',
    border: 'border-rose-100'
  };
};

export const getSmartStudyAdvice = async (data: StudentData) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const modelKey = localStorage.getItem('jeepro_platform_ai_model') || data.aiTutorModel || 'gemini-3-flash';
  const modelId = getActiveModelId(modelKey);
  
  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: "Analyze my progress and provide 3 priorities and 1 mindset tip.",
      config: {
        systemInstruction: constructSystemInstruction(data, MODEL_CONFIGS[modelKey]?.name || "Base Engine"),
        temperature: 0.7,
        responseMimeType: "application/json"
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return {
      priorities: parsed.priorities || ["Review weak chapters", "Solve PYQs", "Formula recall"],
      mindsetTip: parsed.mindsetTip || "Focus on consistency today.",
      burnoutAlert: null
    };
  } catch (err) {
    return { priorities: ["Syllabus Sync", "Mock Test", "Formula Check"], mindsetTip: "Stay focused.", burnoutAlert: null };
  }
};

export const chatWithTutor = async (history: any[], userMessage: string, modelId?: string, data?: StudentData) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const modelKey = localStorage.getItem('jeepro_platform_ai_model') || modelId || data?.aiTutorModel || 'gemini-3-flash';
  const activeId = getActiveModelId(modelKey);
  
  try {
    const chat = ai.chats.create({
      model: activeId,
      config: {
        systemInstruction: data 
          ? constructSystemInstruction(data, MODEL_CONFIGS[modelKey]?.name || "Selected AI Layer") 
          : "You are an IIT-JEE AI Tutor.",
        temperature: 0.8
      }
    });

    const result = await chat.sendMessage({ message: userMessage });
    return result.text || "Transmission error. Please retry.";
  } catch (err) {
    console.error("AI Error:", err);
    return "Intelligence Uplink Unstable. Please verify your API key or model availability.";
  }
};
