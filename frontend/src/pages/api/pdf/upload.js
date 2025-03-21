import formidable from 'formidable';
import fs from 'fs';
import { extractTextFromPDF, splitTextIntoChunks, generateEmbeddings } from '@/utils/pdfProcessor';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable({ keepExtensions: true });
    
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });
    
    const pdfFile = files.pdf;
    const buffer = fs.readFileSync(pdfFile.filepath);
    
    // Extract text from PDF
    const text = await extractTextFromPDF(buffer);
    
    // Generate a session ID for this PDF
    const sessionId = Date.now().toString();
    
    // Store text in session storage or database
    // This is simplified - you would use a database in production
    global.pdfSessions = global.pdfSessions || {};
    global.pdfSessions[sessionId] = { text };
    
    return res.status(200).json({ 
      success: true, 
      sessionId,
      textPreview: text.slice(0, 300) + '...' 
    });
  } catch (error) {
    console.error('Error processing PDF:', error);
    return res.status(500).json({ error: 'Failed to process PDF' });
  }
}
