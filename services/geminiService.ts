
import { GoogleGenAI, Type } from "@google/genai";
import { StudentData } from "../types";

// Always instantiate GoogleGenAI inside functions to ensure the latest API key is used
export const getSmartStudyAdvice = async (data: StudentData) => {
  if (!process.env.API_KEY) return null;

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Act as a senior IIT-JEE coach. Analyze the following student progress data and provide exactly 3 priority tasks for today and a brief burnout warning if applicable.
    
    Student Name: ${data.name}
    Weak Areas (Low Accuracy): ${data.chapters.filter(c => c.accuracy < 60).map(c => c.name).join(', ')}
    Revision Needed: ${data.flashcards.length} cards due.
    Current Stress Level (1-10): ${data.psychometricHistory[data.psychometricHistory.length - 1].stress}
    
    Return the response as a JSON object with:
    - priorities: string[] (3 items)
    - burnoutAlert: string (short sentence or null)
    - mindsetTip: string (motivational tip based on psychometric trends)
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

    const jsonStr = response.text?.trim();
    return jsonStr ? JSON.parse(jsonStr) : null;
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};

export const generateSmartTimetable = async (data: StudentData) => {
  if (!process.env.API_KEY) return null;

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Analyze this JEE student's routine and performance to generate a tactical study plan.
    Routine: Wake @ ${data.routine?.wakeUp}, Sleep @ ${data.routine?.sleep}, School ${data.routine?.schoolStart}-${data.routine?.schoolEnd}.
    Backlogs: ${data.backlogs.length} items.
    Weakest Subject: ${data.chapters.sort((a,b) => a.accuracy - b.accuracy)[0]?.subject || 'N/A'}.

    Provide:
    1. "strategy": A summary of how to distribute hours (e.g., 2:1:1 ratio).
    2. "optimization": A specific change to their routine for better results.
    3. "focusBlocks": 3 specific topics they should prioritize this week.

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
  if (!process.env.API_KEY) return "API Key not configured. Please contact admin.";

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const chat = ai.chats.create({
    model: modelName,
    config: {
      systemInstruction: "You are 'JEE-PRO AI Tutor', a brilliant IIT-JEE coach specializing in Physics, Chemistry, and Math. Answer student queries with clarity, use simple analogies for complex concepts, and always keep responses encouraging. If they ask a problem, guide them step-by-step rather than just giving the answer.",
    }
  });

  try {
    const response = await chat.sendMessage({ message: userMessage });
    return response.text;
  } catch (error) {
    console.error("AI Tutor Error:", error);
    return `Error from ${modelName}: I encountered a slight glitch. Ensure the API key and model selection are valid.`;
  }
};
