
import { GoogleGenAI, Type } from "@google/genai";
import { StudentData } from "../types";

/**
 * INTELLIGENCE SERVICE v6.6
 * Optimized for Schema Enforcement and Data Resiliency
 */

// Fix for TypeScript environment error in browser-based ESM context
declare var process: {
  env: {
    API_KEY: string;
  };
};

// Initialize the API client strictly from process.env as per requirements
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Internal mapping of UI engine IDs to actual Gemini Model names
const MODEL_MAP: Record<string, string> = {
  'solaris-core': 'gemini-3-flash-preview',
  'gpt-4o-edu': 'gemini-3-pro-preview',
  'claude-3-stu': 'gemini-3-flash-preview',
  'gemini-flash-base': 'gemini-3-flash-preview',
  'llama-3-heuristic': 'gemini-3-flash-preview',
  'deepseek-coder': 'gemini-3-pro-preview',
  'iit-pulse': 'gemini-3-pro-preview'
};

/**
 * Utility to clean AI output and ensure it's parseable JSON.
 * Specifically handles trailing commas and markdown bloat.
 */
const parseAIJSON = (text: string) => {
  try {
    // 1. Strip markdown artifacts
    let cleaned = text.replace(/```json\n?|```/g, '').trim();
    
    // 2. Remove trailing commas in objects and arrays which break JSON.parse
    cleaned = cleaned.replace(/,\s*([\]}])/g, '$1');
    
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("AI JSON Parse Error. Raw text:", text);
    throw new Error(`JSON_PARSE_FAILURE`);
  }
};

/**
 * Gets the active AI model selected by Admin from global storage
 */
const getActiveModelId = (userSelected?: string): string => {
  const globalModel = localStorage.getItem('jeepro_platform_ai_model');
  return globalModel || userSelected || 'solaris-core';
};

export const getSmartStudyAdvice = async (data: StudentData) => {
  try {
    const activeModelId = getActiveModelId(data.aiTutorModel);
    const modelName = MODEL_MAP[activeModelId] || 'gemini-3-flash-preview';
    
    const weakChapters = data.chapters.filter(c => c.accuracy < 65).slice(0, 3);
    const currentPsych = data.psychometricHistory[data.psychometricHistory.length - 1];

    const prompt = `As a specialized IIT-JEE academic coach, analyze this student profile:
      Name: ${data.name}
      Weak Chapters: ${weakChapters.map(c => `${c.name} (${c.accuracy}% accuracy)`).join(', ')}
      Current Stress: ${currentPsych?.stress}/10
      Focus: ${currentPsych?.focus}/10`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            priorities: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 tactical study actions"
            },
            burnoutAlert: {
              type: Type.STRING,
              nullable: true,
              description: "Short warning if stress is high"
            },
            mindsetTip: {
              type: Type.STRING,
              description: "One-liner motivation"
            }
          },
          required: ["priorities", "mindsetTip"]
        }
      }
    });

    return parseAIJSON(response.text || '{}');
  } catch (err) {
    console.error("Heuristic fallback triggered:", err);
    return {
      priorities: ["Revise weak mechanics units", "Complete 10 PYQs", "Take a 15-min break"],
      burnoutAlert: null,
      mindsetTip: "Consistency builds the bridge to success."
    };
  }
};

export const generateSmartTimetable = async (data: StudentData) => {
  try {
    const activeModelId = getActiveModelId(data.aiTutorModel);
    const modelName = MODEL_MAP[activeModelId] || 'gemini-3-flash-preview';

    const prompt = `Generate a strategic 2:1:1 study split for a JEE aspirant named ${data.name}. 
    Focus on these chapters: ${data.chapters.slice(0, 5).map(c => c.name).join(', ')}.`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            strategy: { type: Type.STRING },
            optimization: { type: Type.STRING },
            focusBlocks: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["strategy", "optimization", "focusBlocks"]
        }
      }
    });

    return parseAIJSON(response.text || '{}');
  } catch (err) {
    return {
      strategy: "Balanced 2:1:1 Split",
      optimization: "Prioritize Mathematics in your high-focus morning window.",
      focusBlocks: ["Math Fundamentals", "Physics Drill", "Chemistry Recall"]
    };
  }
};

export const chatWithTutor = async (history: any[], userMessage: string, modelId?: string) => {
  try {
    const activeModelId = getActiveModelId(modelId);
    const geminiModel = MODEL_MAP[activeModelId] || 'gemini-3-flash-preview';

    const response = await ai.models.generateContent({
      model: geminiModel,
      contents: userMessage,
      config: {
        systemInstruction: "You are an elite IIT-JEE Tutor. Use technical PCM language. Provide LaTeX for math if needed using standard notation. Be concise."
      }
    });

    return response.text;
  } catch (err) {
    console.error("Chat failure:", err);
    return "The intelligence node encountered a transmission error. Please check your admin configuration.";
  }
};
