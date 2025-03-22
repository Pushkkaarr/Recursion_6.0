// File: src/types/pdf.ts
export interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
  }
  
  export type SummaryType = 'general' | 'executive' | 'detailed';
  
  export interface SummaryOptions {
    documentId: string;
    maxLength: number;
    summaryType: SummaryType;
  }