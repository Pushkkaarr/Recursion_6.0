import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { topic, difficulty, numQuestions } = await request.json();

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    // Create the model and generate content
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Generate a quiz on the topic of "${topic}" with ${numQuestions || 5} multiple-choice questions. 
      The difficulty level should be ${difficulty || 'medium'}.
      Format the response as a JSON array with objects containing:
      - question: the question text
      - options: an array of 4 possible answers
      - correctAnswer: the index of the correct answer (0-3)
      - explanation: a brief explanation of why the answer is correct`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract the JSON part from the response
    let quizData;
    try {
      // Find JSON content between ```json and ``` if present
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch && jsonMatch[1]) {
        quizData = JSON.parse(jsonMatch[1]);
      } else {
        // Try to parse the whole response as JSON
        quizData = JSON.parse(text);
      }
    } catch (error) {
      console.error('Failed to parse JSON from AI response:', error);
      return NextResponse.json(
        { 
          error: 'Failed to parse quiz data', 
          rawResponse: text 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ quiz: quizData });
  } catch (error) {
    console.error('Error generating quiz:', error);
    return NextResponse.json(
      { error: 'Failed to generate quiz' },
      { status: 500 }
    );
  }
}