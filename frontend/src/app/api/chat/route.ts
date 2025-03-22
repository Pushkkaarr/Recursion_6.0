// File: src/app/api/pdf/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { documentId, message } = await request.json();
    
    if (!documentId || !message) {
      return NextResponse.json({ error: 'Document ID and message are required' }, { status: 400 });
    }
    
    const API_KEY = process.env.PDF_AI_API_KEY;
    if (!API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }
    
    const response = await fetch('https://api.pdf.ai/api/v1/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        document_id: documentId,
        message: message
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: `Chat request failed: ${errorText}` }, { status: response.status });
    }
    
    const data = await response.json();
    return NextResponse.json({ answer: data.answer });
  } catch (error) {
    console.error('Error in chat route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}