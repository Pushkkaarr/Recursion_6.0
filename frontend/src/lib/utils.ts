import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import { jsPDF } from "jspdf";

export function generatePDF(content: string, filename: string) {
  const doc = new jsPDF();
  doc.text("EduSync Notes", 10, 10);
  doc.text(content, 10, 20, { maxWidth: 180 });
  doc.save(filename);
}