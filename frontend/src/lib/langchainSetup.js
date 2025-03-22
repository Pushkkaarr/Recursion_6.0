import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { RecursiveCharacterTextSplitter } from "@langchain/core/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { loadQAChain } from "langchain/chains";
import { GoogleGenerativeAIChat } from "@langchain/google-genai";

export const initLangChain = (apiKey) => {
  // Initialize Google Generative AI with your API key
  const genAI = new GoogleGenerativeAI(apiKey);

  // Create embeddings model
  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: apiKey,
    modelName: "embedding-001",
  });

  // Text splitter for chunking documents
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  // Initialize Gemini model
  const model = new GoogleGenerativeAIChat({
    apiKey: apiKey,
    modelName: "gemini-pro",
    temperature: 0.2,
  });

  // Create QA chain
  const chain = loadQAChain(model, { type: "stuff" });

  return {
    genAI,
    embeddings,
    textSplitter,
    model,
    chain,
  };
};
