import { getGeminiModel } from '../../../lib/gemini';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { sessionId, question, chatHistory = [] } = req.body;

  if (!sessionId || !question) {
    return res.status(400).json({ error: 'Session ID and question are required' });
  }

  try {
    // Get the PDF text from session
    if (!global.pdfSessions || !global.pdfSessions[sessionId]) {
      return res.status(404).json({ error: 'PDF session not found' });
    }

    const { text } = global.pdfSessions[sessionId];
    const model = await getGeminiModel();

    // Format the history for Gemini
    const formattedHistory = chatHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Start a chat
    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 800,
      },
    });

    // Prepare context and question
    const prompt = `
    You are a helpful assistant that answers questions based on the provided PDF content.
    Stick to information present in the document.
    
    PDF Content:
    ${text.slice(0, 15000)}
    
    Please answer the following question based only on the PDF content above:
    ${question}
    `;

    // Generate response
    const result = await chat.sendMessage(prompt);
    const answer = result.response.text();

    return res.status(200).json({ answer });
  } catch (error) {
    console.error('Error chatting with PDF:', error);
    return res.status(500).json({ error: 'Failed to process question' });
  }
}
