import pdf from 'pdf-parse';
import { getEmbeddingModel } from '../lib/gemini';

export async function extractTextFromPDF(buffer) {
  try {
    const data = await pdf(buffer);
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

export async function splitTextIntoChunks(text, chunkSize = 1000, overlap = 200) {
  const chunks = [];
  let i = 0;
  
  while (i < text.length) {
    const chunk = text.slice(i, i + chunkSize);
    chunks.push(chunk);
    i += (chunkSize - overlap);
  }
  
  return chunks;
}

export async function generateEmbeddings(chunks) {
  const embeddingModel = await getEmbeddingModel();
  const embeddings = [];
  
  for (const chunk of chunks) {
    const result = await embeddingModel.embedContent(chunk);
    const embedding = result.embedding.values;
    
    embeddings.push({
      text: chunk,
      embedding: embedding,
    });
  }
  
  return embeddings;
}
