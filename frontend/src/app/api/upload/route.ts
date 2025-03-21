// File: src/app/api/pdf/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    const API_KEY = process.env.PDF_AI_API_KEY;
    if (!API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }
    
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    
    const response = await fetch('https://api.pdf.ai/api/v1/documents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      },
      body: uploadFormData
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: `Upload failed: ${errorText}` }, { status: response.status });
    }
    
    const data = await response.json();
    return NextResponse.json({ documentId: data.document_id });
  } catch (error) {
    console.error('Error in upload route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}