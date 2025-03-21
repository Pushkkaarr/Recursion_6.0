import { GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiClient {
  constructor(apiKey) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
    this.chatSession = this.model.startChat({
      history: [],
      generationConfig: {
        temperature: 0.4,
        topP: 0.95,
        topK: 40,
      },
    });
  }

  async generateResponse(prompt) {
    try {
      const result = await this.chatSession.sendMessage(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error generating response:", error);
      throw error;
    }
  }
}