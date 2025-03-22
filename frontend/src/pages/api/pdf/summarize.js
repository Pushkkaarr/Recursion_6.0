import { getGeminiModel } from '../../../lib/gemini';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { sessionId } = req.body;

  if (!sessionId) {
    return res.status(400).json({ error: 'Session ID is required' });
  }

  try {
    // Get the PDF text from session
    if (!global.pdfSessions || !global.pdfSessions[sessionId]) {
      return res.status(404).json({ error: 'PDF session not found' });
    }

    const { text } = global.pdfSessions[sessionId];
    const model = await getGeminiModel();

    const prompt = `
    Please provide a concise summary of the following document content:
    
    ${text.slice(0, 15000)}
    
    Your summary should highlight the key points, main arguments, and important conclusions.
    `;

    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    return res.status(200).json({ summary });
  } catch (error) {
    console.error('Error summarizing PDF:', error);
    return res.status(500).json({ error: 'Failed to summarize PDF' });
  }
}
