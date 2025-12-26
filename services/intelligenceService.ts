
import { GoogleGenAI, Type } from "@google/genai";
import { StudentData } from "../types";

/**
 * INTELLIGENCE SERVICE v6.0
 * Restored 6-model suite for Solaris Hub
 */

declare var process: {
  env: {
    API_KEY: string;
  };
};

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Mapping 6 specialized UI models to production Gemini engines
const MODEL_MAP: Record<string, string> = {
  'solaris-core': 'gemini-3-flash-preview',
  'gpt-4o-edu': 'gemini-3-pro-preview',
  'claude-3-stu': 'gemini-3-flash-preview',
  'gemini-flash-base': 'gemini-3-flash-preview',
  'deepseek-coder': 'gemini-3-pro-preview',
  'iit-pulse': 'gemini-3-pro-preview'
};

const parseAIJSON = (text: string) => {
  try {
    let cleaned = text.replace(/```json\n?|```/g, '').trim();
    cleaned = cleaned.replace(/,\s*([\]}])/g, '$1');
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("AI JSON Parse Error:", text);
    throw new Error(`JSON_PARSE_FAILURE`);
  }
};

const getActiveModelId = (userSelected?: string): string => {
  return localStorage.getItem('jeepro_platform_ai_model') || userSelected || 'solaris-core';
};

export const getSmartStudyAdvice = async (data: StudentData) => {
  try {
    const activeModelId = getActiveModelId(data.aiTutorModel);
    const modelName = MODEL_MAP[activeModelId] || 'gemini-3-flash-preview';
    
    const weakChapters = data.chapters.filter(c => c.accuracy < 65).slice(0, 3);
    const currentPsych = data.psychometricHistory[data.psychometricHistory.length - 1];

    const prompt = `Student Name: ${data.name}
      Weak Chapters: ${weakChapters.map(c => `${c.name} (${c.accuracy}%)`).join(', ')}
      Stress/Focus: ${currentPsych?.stress || 5}/10, ${currentPsych?.focus || 5}/10`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            priorities: { type: Type.ARRAY, items: { type: Type.STRING } },
            burnoutAlert: { type: Type.STRING, nullable: true },
            mindsetTip: { type: Type.STRING }
          },
          required: ["priorities", "mindsetTip"]
        }
      }
    });

    return parseAIJSON(response.text || '{}');
  } catch (err) {
    return {
      priorities: ["Revise weak units", "Complete 10 PYQs", "Short break"],
      mindsetTip: "Focus on the process, not the outcome."
    };
  }
};

export const generateSmartTimetable = async (data: StudentData) => {
  try {
    const activeModelId = getActiveModelId(data.aiTutorModel);
    const modelName = MODEL_MAP[activeModelId] || 'gemini-3-flash-preview';

    const response = await ai.models.generateContent({
      model: modelName,
      contents: `Generate JEE split for ${data.name}. Chapters: ${data.chapters.slice(0, 3).map(c => c.name).join(', ')}`,
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            strategy: { type: Type.STRING },
            optimization: { type: Type.STRING },
            focusBlocks: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["strategy", "optimization", "focusBlocks"]
        }
      }
    });

    return parseAIJSON(response.text || '{}');
  } catch (err) {
    return {
      strategy: "Balanced Split",
      optimization: "Morning: Math, Afternoon: Physics, Evening: Chemistry.",
      focusBlocks: ["Concept Review", "MCQ Practice"]
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
        systemInstruction: "You are an elite IIT-JEE Tutor. Provide clear, technical, but easy-to-understand explanations. Use LaTeX for math. Be concise."
      }
    });

    return response.text;
  } catch (err) {
    return "Link Error: Intelligence Node unreachable.";
  }
};
