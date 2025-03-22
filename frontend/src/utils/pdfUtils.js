import fs from 'fs';
import path from 'path';
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

// Process PDF and return document chunks
export const processPdf = async (filePath, textSplitter) => {
  try {
    const loader = new PDFLoader(filePath);
    const docs = await loader.load();
    
    // Split the document into chunks
    const textChunks = await textSplitter.splitDocuments(docs);
    
    return {
      success: true,
      chunks: textChunks,
      fullText: docs.map(doc => doc.pageContent).join('\n'),
    };
  } catch (error) {
    console.error("Error processing PDF:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Create a vector store from text chunks
export const createVectorStore = async (textChunks, embeddings) => {
  try {
    // Create vector store from the chunks
    const vectorStore = await MemoryVectorStore.fromDocuments(
      textChunks,
      embeddings
    );
    
    return {
      success: true,
      vectorStore,
    };
  } catch (error) {
    console.error("Error creating vector store:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Generate PDF summary
export const generateSummary = async (model, fullText) => {
  try {
    const response = await model.invoke(
      `Please provide a comprehensive summary of the following document: ${fullText.substring(0, 15000)}`
    );
    
    return {
      success: true,
      summary: response.text(),
    };
  } catch (error) {
    console.error("Error generating summary:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};