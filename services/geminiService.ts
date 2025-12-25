
import { GoogleGenAI, Type } from "@google/genai";
import { StudentData } from "../types";

// TypeScript Safety for Browser Environment
declare var process: { env: { API_KEY: string } };

// Safely retrieve the API key to avoid runtime errors if missing
const getApiKey = () => {
  try {
    return process.env.API_KEY || null;
  } catch (e) {
    return null;
  }
};

export const getSmartStudyAdvice = async (data: StudentData) => {
  const apiKey = getApiKey();
  if (!apiKey) return null;

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Act as a senior IIT-JEE coach. Analyze the following student progress data and provide exactly 3 priority tasks for today and a brief burnout warning if applicable.
    
    Student Name: ${data.name}
    Weak Areas (Low Accuracy): ${data.chapters.filter(c => c.accuracy < 60).map(c => c.name).join(', ')}
    Revision Needed: ${data.flashcards.length} cards due.
    Current Stress Level (1-10): ${data.psychometricHistory[data.psychometricHistory.length - 1]?.stress || 5}
    
    Return JSON: { "priorities": ["...", "...", "..."], "burnoutAlert": "...", "mindsetTip": "..." }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            priorities: { type: Type.ARRAY, items: { type: Type.STRING } },
            burnoutAlert: { type: Type.STRING },
            mindsetTip: { type: Type.STRING }
          },
          required: ["priorities", "mindsetTip"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Failure:", error);
    return null;
  }
};

export const generateSmartTimetable = async (data: StudentData) => {
  const apiKey = getApiKey();
  if (!apiKey) return null;

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Analyze this JEE student's routine and performance to generate a tactical study plan.
    Routine: Wake @ ${data.routine?.wakeUp}, Sleep @ ${data.routine?.sleep}, School ${data.routine?.schoolStart}-${data.routine?.schoolEnd}.
    Backlogs: ${data.backlogs.length} items.
    Weakest Subject: ${data.chapters.sort((a,b) => a.accuracy - b.accuracy)[0]?.subject || 'N/A'}.

    Provide:
    1. "strategy": Hourly distribution summary.
    2. "optimization": Routine modification tip.
    3. "focusBlocks": 3 prioritized topics.

    Return JSON: { "strategy": "...", "optimization": "...", "focusBlocks": ["...", "...", "..."] }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
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
    return JSON.parse(response.text || '{}');
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const chatWithTutor = async (history: { role: string; content: string }[], userMessage: string, modelName: string = 'gemini-3-flash-preview') => {
  const apiKey = getApiKey();
  if (!apiKey) return "API Key not configured. Please contact admin.";

  const ai = new GoogleGenAI({ apiKey });
  const chat = ai.chats.create({
    model: modelName,
    config: {
      systemInstruction: "You are 'JEE-PRO AI Tutor', a brilliant IIT-JEE coach. Guide students step-by-step through Physics, Chemistry, and Math problems using Socratic questioning where possible.",
    }
  });

  try {
    const response = await chat.sendMessage({ message: userMessage });
    return response.text;
  } catch (error) {
    console.error("AI Tutor Node Error:", error);
    return `Error from ${modelName}: The intelligence node is temporarily overloaded.`;
  }
};
