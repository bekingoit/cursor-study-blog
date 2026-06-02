import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

async function main(prompt) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured')
  }

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
  });
  return response.text
}

export default main;