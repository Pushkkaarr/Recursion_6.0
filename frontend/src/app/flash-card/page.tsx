"use client";

import { useState, useRef } from "react";
import { jsPDF } from "jspdf";
import { 
  Upload, 
  X, 
  FileDown, 
  Loader2, 
  BookOpen,
  CheckCircle,
  Layers,
  Sparkles,
  MessageSquare,
  Zap,
  Download,
  AlertTriangle,
  Trash2,
  Terminal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

interface Flashcard {
  id: string;
  topic: string;
  notes: string[];
  isExpanded: boolean;
}

export default function FlashcardPage() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Log helper function
  const addLog = (message: string) => {
    console.log(message);
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()} - ${message}`]);
    if (message.includes("successfully") || message.includes("Error")) {
      toast(message, {
        icon: message.includes("Error") ? "🚫" : "✅",
      });
    }
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      addLog(`File uploaded: ${file.name}`);
      if (file.type.startsWith("image/")) {
        processImage(file);
      } else if (file.type === "application/pdf") {
        processPDF(file);
      } else {
        addLog("Error: Unsupported file type. Please upload an image or PDF.");
        toast.error("Please upload a valid image (e.g., PNG, JPG) or PDF.");
      }
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    addLog("Triggering file input.");
    fileInputRef.current?.click();
  };

  // Process image file
  const processImage = async (file: File) => {
    addLog("Processing uploaded image...");
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Image = (reader.result as string).split(",")[1];
      await fetchGeminiFlashcards(base64Image, "image");
    };
    reader.readAsDataURL(file);
  };

  // Process PDF file (mocked extraction)
  const processPDF = async (file: File) => {
    addLog("Processing uploaded PDF...");
    // Placeholder: Use pdf-parse or backend service in production
    const mockText = `Sample content extracted from ${file.name}`;
    await fetchGeminiFlashcards(mockText, "text");
  };

  // Fetch flashcards from Gemini API
  const fetchGeminiFlashcards = async (content: string, type: "image" | "text") => {
    setIsLoading(true);
    addLog(`Sending ${type} content to Gemini API for flashcard generation...`);

    try {
      const prompt = type === "image"
        ? "Generate flashcards from the content in this image. Each flashcard should have a topic heading and 5-6 concise notes."
        : "Generate flashcards from this text content. Each flashcard should have a topic heading and 5-6 concise notes:\n\n" + content;

      const body = type === "image"
        ? {
            contents: [
              {
                parts: [
                  { inlineData: { mimeType: "image/png", data: content } },
                  { text: prompt },
                ],
              },
            ],
          }
        : {
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
          };

      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": process.env.NEXT_PUBLIC_GEMINI_API_KEY || "",
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.candidates || !data.candidates[0]?.content?.parts[0]?.text) {
        throw new Error("Invalid response from Gemini API.");
      }

      const generatedText = data.candidates[0].content.parts[0].text;
      const parsedFlashcards = parseFlashcardText(generatedText);
      setFlashcards(parsedFlashcards);
      addLog("Flashcards generated successfully.");
      toast.success("Flashcards generated successfully!");
    } catch (error) {
      addLog(`Error fetching Gemini flashcards: ${error instanceof Error ? error.message : "Unknown error"}`);
      toast.error("Failed to generate flashcards. Please try again.");
    } finally {
      setIsLoading(false);
      addLog("Flashcard generation process completed.");
    }
  };

  // Parse Gemini response into flashcards
  const parseFlashcardText = (text: string): Flashcard[] => {
    // Improved parsing to handle various formats including markdown and dash/bullet formatted lists
    const flashcardRegex = /(?:#+\s*(.+?)\s*\n+|\*\*Topic:\*\*\s*(.+?)\s*\n+|\*\*Flashcard\s+\d+:\s*(.+?)\*\*\s*\n+)(?:(?:\s*[-*]\s+(.+?)(?:\n|$)|\s*\*\s+(.+?)(?:\n|$)|\s*\d+\.\s+(.+?)(?:\n|$)))+/gm;
    const noteRegex = /(?:[-*]\s+(.+?)(?:\n|$)|\*\s+(.+?)(?:\n|$)|\d+\.\s+(.+?)(?:\n|$))/gm;
    
    const flashcards: Flashcard[] = [];
    let match;
    
    // Extract flashcards
    while ((match = flashcardRegex.exec(text)) !== null) {
      const topic = match[1] || match[2] || match[3] || "Untitled Topic";
      const noteMatches = match[0].matchAll(noteRegex);
      const notes: string[] = [];
      
      for (const noteMatch of noteMatches) {
        const note = noteMatch[1] || noteMatch[2] || noteMatch[3];
        if (note && !topic.includes(note)) {
          notes.push(note.replace(/\*\*/g, '').trim());
        }
      }
      
      if (notes.length > 0) {
        flashcards.push({
          id: `card-${flashcards.length}-${Date.now()}`,
          topic: topic.replace(/\*\*/g, '').trim(),
          notes,
          isExpanded: false,
        });
      }
    }
    
    // If regex didn't work well, fallback to the original method
    if (flashcards.length === 0) {
      const lines = text.split("\n").filter(line => line.trim() !== "");
      let currentTopic = "";
      let currentNotes: string[] = [];

      lines.forEach((line, index) => {
        if (line.trim().startsWith("#") || 
            line.trim().startsWith("**Topic:") || 
            line.trim().startsWith("**Flashcard") ||
            (index === 0 && !line.trim().startsWith("-") && !line.trim().startsWith("*"))) {
          if (currentTopic && currentNotes.length > 0) {
            flashcards.push({
              id: `${flashcards.length}-${Date.now()}`,
              topic: currentTopic.replace(/\*\*/g, '').trim(),
              notes: currentNotes,
              isExpanded: false,
            });
          }
          currentTopic = line.replace(/^#+/, "")
                           .replace(/\*\*Topic:\*\*/, "")
                           .replace(/\*\*Flashcard \d+:\s*(.+?)\*\*/, "$1")
                           .trim();
          currentNotes = [];
        } else if (line.trim().startsWith("-") || line.trim().startsWith("*")) {
          const note = line.replace(/^[-*]\s/, "").trim();
          if (note && !note.includes("**Topic:**")) {
            currentNotes.push(note.replace(/\*\*/g, '').trim());
          }
        }
      });

      if (currentTopic && currentNotes.length > 0) {
        flashcards.push({
          id: `${flashcards.length}-${Date.now()}`,
          topic: currentTopic.replace(/\*\*/g, '').trim(),
          notes: currentNotes,
          isExpanded: false,
        });
      }
    }

    return flashcards;
  };

  // Toggle flashcard expansion
  const toggleFlashcard = (id: string) => {
    setFlashcards(prev =>
      prev.map(card =>
        card.id === id ? { ...card, isExpanded: !card.isExpanded } : { ...card, isExpanded: false }
      )
    );
  };

  // Generate and download PDF
  const downloadPDF = () => {
    if (flashcards.length === 0) {
      addLog("Error: No flashcards available to download.");
      toast.error("No flashcards to download.");
      return;
    }
    addLog("Generating and downloading flashcards.pdf...");
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(41, 98, 255); // Blue title
    doc.text("Study Flashcards", 10, 10);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100); // Gray text
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 10, 16);
    doc.line(10, 18, 200, 18); // Add a separator line
    
    let yPosition = 25;
    flashcards.forEach((card, index) => {
      // Check if we need a new page
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(14);
      doc.setTextColor(41, 98, 255); // Blue titles
      doc.setFont(undefined, "bold");
      doc.text(`${index + 1}. ${card.topic}`, 10, yPosition);
      yPosition += 8;
      
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60); // Dark gray for content
      doc.setFont(undefined, "normal");

      card.notes.forEach(note => {
        const wrappedText = doc.splitTextToSize(`• ${note}`, 180);
        doc.text(wrappedText, 15, yPosition);
        yPosition += 6 * wrappedText.length;
      });
      yPosition += 10;
    });

    doc.save("flashcards.pdf");
    addLog("flashcards.pdf downloaded successfully.");
    toast.success("Flashcards downloaded successfully!");
  };

  return (
    <div className="w-full px-6 py-8 mx-auto max-w-6xl space-y-8 animate-in fade-in duration-500">
      <Card className="border border-indigo-100 shadow-lg bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-indigo-100/30 transition-all duration-300">
        <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-white">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="px-3 py-1 text-xs bg-indigo-100 text-indigo-600 font-medium rounded-full border-indigo-200 animate-pulse">
              <Sparkles size={14} className="mr-1" />
              AI Powered
            </Badge>
          </div>
          <CardTitle className="text-3xl mt-3 font-bold text-gray-800 flex items-center">
            <BookOpen size={28} className="mr-3 text-indigo-500" />
            Flashcard Generator
          </CardTitle>
          <CardDescription className="text-gray-600 mt-1 text-base">
            Transform images or PDFs into organized study flashcards with AI-powered analysis.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 pb-8">
          {/* Input Section */}
          {!flashcards.length && (
            <Card className="border border-indigo-100 bg-white shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-white">
                <CardTitle className="text-xl flex items-center gap-2 text-gray-800">
                  <Zap size={20} className="text-indigo-500" />
                  Create Study Materials
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Upload an image of your notes or a PDF document to generate concise, organized flashcards.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 pb-6">
                <div className="flex flex-wrap gap-3 mt-2">
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button 
                    onClick={triggerFileInput} 
                    className="group bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all"
                  >
                    <Upload size={16} className="mr-2 group-hover:animate-bounce" />
                    Upload File
                  </Button>
                </div>
                
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-blue-50 border border-blue-100 flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <MessageSquare size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-800">Easy Learning</h4>
                      <p className="text-sm text-blue-600 mt-1">Break down complex topics into digestible notes</p>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-100 flex items-start">
                    <div className="bg-indigo-100 p-2 rounded-full mr-3">
                      <Zap size={18} className="text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-indigo-800">AI Powered</h4>
                      <p className="text-sm text-indigo-600 mt-1">Smart extraction of key concepts and definitions</p>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-purple-50 border border-purple-100 flex items-start">
                    <div className="bg-purple-100 p-2 rounded-full mr-3">
                      <Download size={18} className="text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-purple-800">Exportable</h4>
                      <p className="text-sm text-purple-600 mt-1">Save your flashcards as PDF for offline study</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
  
          {/* Loading Indicator */}
          {isLoading && (
            <Alert variant="default" className="bg-blue-50 border border-blue-200 shadow-sm animate-pulse">
              <div className="flex items-center">
                <Loader2 className="h-6 w-6 mr-3 animate-spin text-blue-500" />
                <AlertDescription className="text-base font-medium text-blue-700">
                  AI is analyzing your content and generating flashcards...
                </AlertDescription>
              </div>
              <div className="mt-3 h-2 w-full bg-blue-100 rounded-full overflow-hidden">
                <div className="h-2 bg-blue-500 rounded-full animate-[pulse_2s_ease-in-out_infinite]" style={{ width: '75%' }}></div>
              </div>
            </Alert>
          )}
  
          {/* Flashcard Display */}
          {flashcards.length > 0 && (
            <Card className="border border-indigo-100 overflow-hidden shadow-md transition-all hover:shadow-lg">
              <CardHeader className="space-y-2 pb-4 bg-gradient-to-r from-blue-50 to-white">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="px-3 py-1 bg-green-50 text-green-600 border-green-200 flex items-center gap-1.5 rounded-full">
                      <CheckCircle size={14} className="animate-pulse" />
                      {flashcards.length} Flashcards Ready
                    </Badge>
                  </div>
                  <Button
                    onClick={downloadPDF}
                    variant="outline"
                    className="group border-indigo-200 bg-white hover:bg-indigo-50 hover:border-indigo-300 text-indigo-600 transition-all"
                  >
                    <FileDown size={16} className="mr-2 group-hover:animate-bounce" />
                    Download as PDF
                  </Button>
                </div>
                <CardTitle className="text-xl flex items-center gap-2 text-gray-800">
                  <Layers size={20} className="text-indigo-500" />
                  Your Study Flashcards
                </CardTitle>
              </CardHeader>
              <Separator className="bg-indigo-100" />
              <CardContent className="pt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {flashcards.map(card => (
                  <div
                    key={card.id}
                    onClick={() => toggleFlashcard(card.id)}
                    className={`relative bg-white border rounded-xl overflow-hidden transition-all duration-300 cursor-pointer ${
                      card.isExpanded
                        ? "col-span-full shadow-xl scale-102 z-10 border-indigo-300 transform -rotate-1 hover:rotate-0"
                        : "hover:shadow-md hover:-translate-y-1 border-gray-200/80 hover:border-indigo-200"
                    }`}
                  >
                    <div className={`p-5 ${card.isExpanded ? "bg-gradient-to-r from-indigo-50 to-white" : ""}`}>
                      <h3 className={`font-semibold ${
                        card.isExpanded ? "text-xl mb-4 text-indigo-700" : "text-lg mb-1 text-gray-800"
                      }`}>
                        {card.topic}
                      </h3>
                      {!card.isExpanded && (
                        <div className="flex items-center text-xs text-indigo-400 mt-2 font-medium">
                          <MessageSquare size={12} className="mr-1" />
                          {card.notes.length} note{card.notes.length !== 1 ? 's' : ''} - Click to expand
                        </div>
                      )}
                      {card.isExpanded && (
                        <ul className="space-y-3 mt-4">
                          {card.notes.map((note, index) => (
                            <li key={index} className="flex items-start gap-3 text-gray-700 group">
                              <div className="min-w-6 min-h-6 w-6 h-6 mt-0.5 rounded-full bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                                <div className="text-xs font-medium text-indigo-600">{index + 1}</div>
                              </div>
                              <span className="block text-base leading-relaxed">{note}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    {card.isExpanded && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-indigo-100 text-indigo-600 hover:bg-indigo-200">
                          Tap anywhere to collapse
                        </Badge>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
              <CardFooter className="pt-4 pb-6 px-6">
                <Button
                  onClick={() => {
                    setFlashcards([]);
                  }}
                  variant="outline"
                  className="w-full border-red-200 text-red-500 hover:bg-red-50 group"
                >
                  <Trash2 size={16} className="mr-2 group-hover:animate-spin" />
                  Clear All Flashcards
                </Button>
              </CardFooter>
            </Card>
          )}
        </CardContent>
      </Card>
  
      {/* Logs (optional, for debugging) */}
      {logs.length > 0 && (
        <Card className="border border-gray-200 bg-gray-50 shadow-sm rounded-xl overflow-hidden">
          <CardHeader className="bg-gray-100 flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2 text-gray-700">
              <Terminal size={18} className="text-gray-500" />
              Activity Logs
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 border-gray-200 text-gray-500 hover:bg-gray-200"
              onClick={() => setLogs([])}
            >
              <X size={14} className="mr-1" />
              Clear
            </Button>
          </CardHeader>
          <CardContent className="py-3 px-0">
            <div className="text-sm text-gray-600 space-y-0 max-h-40 overflow-y-auto bg-white p-0 rounded-md">
              {logs.map((log, index) => (
                <div key={index} className="py-2 px-4 border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  {log.includes("Error") ? (
                    <div className="flex items-center">
                      <AlertTriangle size={14} className="text-red-500 mr-2 flex-shrink-0" />
                      <span className="text-red-600">{log}</span>
                    </div>
                  ) : log.includes("successfully") ? (
                    <div className="flex items-center">
                      <CheckCircle size={14} className="text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-green-600">{log}</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-2 flex-shrink-0"></div>
                      {log}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}