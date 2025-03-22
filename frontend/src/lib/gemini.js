import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API
const geminiAPI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export async function getGeminiModel() {
  return geminiAPI.getGenerativeModel({ model: "gemini-pro" });
}

export async function getEmbeddingModel() {
  return geminiAPI.getGenerativeModel({ model: "embedding-001" });
}