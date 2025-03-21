"use client";

import { useState, useRef } from "react";
import { jsPDF } from "jspdf";
import * as pdfjs from "pdfjs-dist";

// Set up PDF.js worker with fallback to local worker
try {
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
} catch (error) {
  console.error("Failed to load PDF.js worker from CDN. Falling back to local worker.");
  pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.js`;
}

export default function PdfSummary() {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfText, setPdfText] = useState("");
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [logs, setLogs] = useState([]);
  const fileInputRef = useRef(null);

  // Log helper function
  const addLog = (message) => {
    console.log(message);
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()} - ${message}`]);
  };

  // Handle PDF file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      addLog(`PDF file uploaded: ${file.name}`);
      setPdfFile(file);
      setSummary(null);
      await extractTextFromPdf(file);
    } else {
      addLog("Error: Invalid file type. Please upload a PDF.");
      alert("Please upload a valid PDF file.");
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    addLog("Triggering file input.");
    fileInputRef.current?.click();
  };

  // Extract text from PDF
  const extractTextFromPdf = async (file) => {
    setIsExtracting(true);
    addLog("Extracting text from PDF...");
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      addLog(`PDF loaded. Total pages: ${numPages}`);
      
      let fullText = "";
      
      // Extract text from each page
      for (let i = 1; i <= numPages; i++) {
        addLog(`Processing page ${i}/${numPages}...`);
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(" ");
        fullText += pageText + "\n\n";
      }
      
      addLog("Text extraction complete.");
      setPdfText(fullText);
      
      // If text was successfully extracted, generate summary
      if (fullText.trim().length > 0) {
        await generateSummary(fullText);
      } else {
        addLog("Error: No text could be extracted from the PDF.");
        alert("No text could be extracted from this PDF. It might be scanned or image-based.");
      }
    } catch (error) {
      addLog(`Error extracting text from PDF: ${error instanceof Error ? error.message : "Unknown error"}`);
      alert("Failed to extract text from the PDF. Please try another file.");
    } finally {
      setIsExtracting(false);
    }
  };

  // Generate summary using Gemini API
  const generateSummary = async (text) => {
    setIsLoading(true);
    addLog("Sending text to Gemini API for summarization...");

    // Truncate text if too long (Gemini has token limits)
    const truncatedText = text.length > 30000 ? text.substring(0, 30000) + "..." : text;

    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": process.env.NEXT_PUBLIC_GEMINI_API_KEY || "",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Summarize the following text in a point-wise format, organizing information by main topics with clear headings. Include all important details, facts, figures, and key insights. Make it comprehensive but concise:

${truncatedText}`,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.candidates || !data.candidates[0]?.content?.parts[0]?.text) {
        throw new Error("Invalid response from Gemini API.");
      }

      const generatedSummary = data.candidates[0].content.parts[0].text;
      addLog("Summary generated successfully.");
      setSummary(generatedSummary);
    } catch (error) {
      addLog(`Error generating summary: ${error instanceof Error ? error.message : "Unknown error"}`);
      setSummary("Failed to generate summary. Please try again.");
    } finally {
      setIsLoading(false);
      addLog("Summary generation process completed.");
    }
  };

  // Format the summary text for display
  const formatSummary = (text) => {
    if (!text) return null;

    // Split by newlines and handle basic formatting
    const lines = text.split("\n").filter((line) => line.trim() !== "");
    return lines.map((line, index) => {
      // Check for headings (e.g., "# ", "## ", etc.)
      if (line.match(/^#+\s/)) {
        const level = line.match(/^#+/)[0].length;
        const content = line.replace(/^#+\s/, "");
        
        if (level === 1) {
          return (
            <h2 key={index} className="text-xl font-bold mt-6 mb-3 text-gray-800">
              {content}
            </h2>
          );
        } else if (level === 2) {
          return (
            <h3 key={index} className="text-lg font-semibold mt-4 mb-2 text-gray-700">
              {content}
            </h3>
          );
        } else {
          return (
            <h4 key={index} className="text-base font-medium mt-3 mb-1 text-gray-700">
              {content}
            </h4>
          );
        }
      }
      
      // Check for bullet points (e.g., "- ", "* ", "• ")
      if (line.match(/^[-*•]\s/)) {
        const content = line.replace(/^[-*•]\s/, "");
        return (
          <li key={index} className="ml-6 list-disc my-1 text-gray-600">
            {content}
          </li>
        );
      }
      
      // Check for numbered points (e.g., "1. ", "2. ", etc.)
      if (line.match(/^\d+\.\s/)) {
        const content = line.replace(/^\d+\.\s/, "");
        return (
          <li key={index} className="ml-6 list-decimal my-1 text-gray-600">
            {content}
          </li>
        );
      }
      
      // Regular paragraph
      return (
        <p key={index} className="my-2 text-gray-600">
          {line}
        </p>
      );
    });
  };

  // Download summary as PDF
  const downloadSummaryAsPdf = () => {
    if (!summary) {
      addLog("Error: No summary available to download.");
      return;
    }
    
    addLog("Generating and downloading PDF summary...");
    
    try {
      const doc = new jsPDF();
      const fileName = pdfFile ? `Summary_of_${pdfFile.name}` : "PDF_Summary.pdf";
      
      doc.setFontSize(16);
      doc.text("PDF Summary", 10, 10);
      
      doc.setFontSize(12);
      const lines = summary.split("\n");
      let y = 20;
      
      lines.forEach(line => {
        // Check if adding this line would overflow the page
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
        
        if (line.match(/^#+\s/)) {
          // Handle headings
          const content = line.replace(/^#+\s/, "");
          doc.setFont(undefined, "bold");
          doc.text(content, 10, y);
          doc.setFont(undefined, "normal");
        } else if (line.match(/^[-*•]\s/) || line.match(/^\d+\.\s/)) {
          // Handle bullet points and numbered lists
          const content = line.replace(/^[-*•]\s/, "• ").replace(/^\d+\.\s/, match => match);
          doc.text(content, 15, y);
        } else if (line.trim() !== "") {
          // Handle regular paragraphs
          doc.text(line, 10, y, { maxWidth: 180 });
        }
        
        // Increase y by approximate line height (including wrapping consideration)
        const lines = doc.splitTextToSize(line, 180).length;
        y += 7 * lines;
      });
      
      doc.save(fileName);
      addLog("PDF summary downloaded successfully.");
    } catch (error) {
      addLog(`Error creating PDF: ${error instanceof Error ? error.message : "Unknown error"}`);
      alert("Failed to create PDF. Please try again.");
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">PDF Summary Generator</h1>
        <p className="text-gray-600">Upload a PDF file to generate a point-wise summary using AI</p>
      </div>
      
      {/* File Upload Section */}
      <div className="mb-6 bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center">
        <input
          type="file"
          accept="application/pdf"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
        />
        
        <button
          onClick={triggerFileInput}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Upload PDF File
        </button>
        
        {pdfFile && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-blue-800 font-medium">Selected file: {pdfFile.name}</p>
            <p className="text-blue-600 text-sm">Size: {(pdfFile.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        )}
      </div>
      
      {/* Progress Indicators */}
      {(isExtracting || isLoading) && (
        <div className="mb-6 flex justify-center items-center space-x-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-blue-600 font-medium">
            {isExtracting ? "Extracting text from PDF..." : "Generating summary..."}
          </span>
        </div>
      )}
      
      {/* Summary Section */}
      {summary && (
        <div className="mb-6 bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-gray-800">PDF Summary</h2>
            <button
              onClick={downloadSummaryAsPdf}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
            >
              Download as PDF
            </button>
          </div>
          
          <div className="prose max-w-none">
            {formatSummary(summary)}
          </div>
        </div>
      )}
      
      {/* Logs Display (Collapsible) */}
      <details className="mt-4 bg-gray-50 rounded-lg">
        <summary className="p-3 font-medium text-gray-700 cursor-pointer">View Process Logs</summary>
        <div className="p-3 pt-0 max-h-40 overflow-y-auto">
          {logs.length > 0 ? (
            <ul className="text-xs text-gray-600 space-y-1">
              {logs.map((log, index) => (
                <li key={index}>{log}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No logs yet.</p>
          )}
        </div>
      </details>
    </div>
  );
}