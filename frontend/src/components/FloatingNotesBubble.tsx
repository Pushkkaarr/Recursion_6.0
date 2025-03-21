"use client";

import { useState, useRef, useEffect } from "react";
import { jsPDF } from "jspdf";

export default function FloatingNotesBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [activeTab, setActiveTab] = useState("type"); // Type, draw, image, voice
  const [isRecording, setIsRecording] = useState(false);
  const [logs, setLogs] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false); // State for expand
  const recognitionRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [typedText, setTypedText] = useState("");

  // Log helper function
  const addLog = (message) => {
    console.log(message);
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()} - ${message}`]);
  };

  // Initialize Web Speech API for voice input
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      addLog("Error: Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      addLog("Recording started.");
      setIsRecording(true);
    };
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(" ");
      addLog(`Transcript received: ${transcript}`);
      processVoiceToNotes(transcript);
    };
    recognition.onerror = (event) => {
      addLog(`Speech recognition error: ${event.error}`);
      setIsRecording(false);
    };
    recognition.onend = () => {
      addLog("Recording stopped.");
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, []);

  // Initialize and resize drawing canvas
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      canvas.width = isExpanded ? window.innerWidth * 0.9 : 340;
      canvas.height = isExpanded ? window.innerHeight * 0.65 : 150;
      context.lineWidth = 2;
      context.lineCap = "round";
      context.strokeStyle = "#000000";
    }
  }, [isExpanded]);

  // Start drawing
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.beginPath();
    context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  // Draw
  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    context.stroke();
  };

  // Stop drawing
  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Clear canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    addLog("Canvas cleared.");
  };

  // Process drawing to notes
  const processDrawingToNotes = () => {
    const canvas = canvasRef.current;
    const imageDataUrl = canvas.toDataURL("image/png");
    const base64Image = imageDataUrl.split(",")[1];
    addLog("Processing drawing...");
    fetchGeminiNotes(base64Image, "Convert this drawing into concise notes.");
  };

  // Process typed text to notes
  const processTypedTextToNotes = () => {
    if (!typedText) {
      addLog("Error: No text to process.");
      return;
    }
    addLog("Processing typed text...");
    fetchGeminiNotes(typedText, "Convert this text into concise, well-formatted notes.");
    setTypedText(""); // Clear input after processing
  };

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      addLog(`Image file uploaded: ${file.name}`);
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result.split(",")[1];
        fetchGeminiNotes(base64Image, "Extract and convert the text or content in this image into concise notes.");
      };
      reader.readAsDataURL(file);
    } else {
      addLog("Error: Invalid file type. Please upload an image.");
      alert("Please upload a valid image file (e.g., PNG, JPG).");
    }
  };

  // Trigger file input
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Process voice to notes
  const processVoiceToNotes = (transcript) => {
    fetchGeminiNotes(transcript, "Convert this spoken content into concise, well-formatted notes.");
  };

  // Fetch notes from Gemini API
  const fetchGeminiNotes = async (input, prompt) => {
    addLog("Sending to Gemini API...");
    try {
      const isImage = typeof input === "string" && input.length > 1000; // Rough check for base64
      const body = {
        contents: [
          {
            parts: isImage
              ? [
                  { inlineData: { mimeType: "image/png", data: input } },
                  { text: prompt },
                ]
              : [{ text: `${prompt}: ${input}` }],
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

      const generatedNotes = data.candidates[0].content.parts[0].text;
      addLog("Notes generated successfully.");
      setNotes((prev) => (prev ? `${prev}\n\n${generatedNotes}` : generatedNotes));
    } catch (error) {
      addLog(`Error fetching Gemini notes: ${error instanceof Error ? error.message : "Unknown error"}`);
      setNotes((prev) => prev + "\n\nError: Could not generate notes.");
    }
  };

  // Format notes for display
  const formatNotes = (text) => {
    if (!text) return null;
    const lines = text.split("\n").filter((line) => line.trim() !== "");
    return lines.map((line, index) => {
      if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        const content = line.trim().substring(2);
        return (
          <li key={index} className="ml-4 list-disc">
            {content}
          </li>
        );
      }
      return (
        <p key={index} className="mb-2">
          {line}
        </p>
      );
    });
  };

  // Download notes as PDF
  const downloadPDF = () => {
    if (!notes) {
      addLog("Error: No notes available to download.");
      return;
    }
    addLog("Generating and downloading PDF...");
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("My Notes", 10, 10);
    doc.setFontSize(12);
    doc.text(notes, 10, 20, { maxWidth: 180 });
    doc.save("my-notes.pdf");
    addLog("PDF downloaded successfully.");
  };

  return (
    <>
      {/* Floating Bubble */}
      <div
        className="fixed bottom-4 right-4 w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-teal-600 transition-colors z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-white text-2xl">✍️</span>
      </div>

      {/* Notepad Panel */}
      {isOpen && (
        <div
          className={`fixed ${
            isExpanded ? "inset-0 m-4" : "bottom-16 right-4"
          } bg-white rounded-lg shadow-xl p-4 border border-gray-200 z-50 transition-all overflow-y-auto ${
            isExpanded ? "w-[95vw] h-[95vh]" : "w-96 max-h-[80vh]"
          }`}
        >
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-gray-800">Notepad</h2>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              {isExpanded ? "Collapse" : "Expand"}
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-2 mb-4">
            {["type", "draw", "image", "voice"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded ${
                  activeTab === tab
                    ? "bg-teal-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="mb-4">
            {activeTab === "type" && (
              <div>
                <textarea
                  value={typedText}
                  onChange={(e) => setTypedText(e.target.value)}
                  placeholder="Type your notes here..."
                  className="w-full p-2 border rounded mb-2 resize-none"
                  rows={isExpanded ? 10 : 4}
                />
                <button
                  onClick={processTypedTextToNotes}
                  className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Convert to Notes
                </button>
              </div>
            )}

            {activeTab === "draw" && (
              <div>
                <canvas
                  ref={canvasRef}
                  className="border rounded mb-2 w-full"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseOut={stopDrawing}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={processDrawingToNotes}
                    className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Convert to Notes
                  </button>
                  <button
                    onClick={clearCanvas}
                    className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}

            {activeTab === "image" && (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  onClick={triggerFileInput}
                  className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Upload Image
                </button>
              </div>
            )}

            {activeTab === "voice" && (
              <div className="flex space-x-2">
                <button
                  onClick={() => recognitionRef.current?.start()}
                  disabled={isRecording}
                  className={`px-3 py-1 rounded text-white ${
                    isRecording ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  {isRecording ? "Recording..." : "Start Recording"}
                </button>
                <button
                  onClick={() => recognitionRef.current?.stop()}
                  disabled={!isRecording}
                  className={`px-3 py-1 rounded text-white ${
                    !isRecording ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  Stop
                </button>
              </div>
            )}
          </div>

          {/* Notes Display */}
          {notes && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg max-h-40 overflow-y-auto">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Notes</h3>
              <div className="text-gray-600 text-sm leading-relaxed">{formatNotes(notes)}</div>
            </div>
          )}

          {/* Download Button */}
          {notes && (
            <button
              onClick={downloadPDF}
              className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Download Notes as PDF
            </button>
          )}
        </div>
      )}
    </>
  );
}