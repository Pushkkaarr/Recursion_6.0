// File: src/app/api/pdf/summarize/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { documentId, maxLength = 500, summaryType = 'general' } = await request.json();
    
    if (!documentId) {
      return NextResponse.json({ error: 'Document ID is required' }, { status: 400 });
    }
    
    const API_KEY = process.env.PDF_AI_API_KEY;
    if (!API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }
    
    const response = await fetch('https://api.pdf.ai/api/v1/summarize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        document_id: documentId,
        max_length: maxLength,
        summary_type: summaryType
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: `Summary request failed: ${errorText}` }, { status: response.status });
    }
    
    const data = await response.json();
    return NextResponse.json({ summary: data.summary });
  } catch (error) {
    console.error('Error in summarize route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}