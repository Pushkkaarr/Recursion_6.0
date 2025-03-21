"use client";

import { useState, useRef } from "react";
import { jsPDF } from "jspdf";

export default function QuestionScanner() {
  const [solution, setSolution] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [logs, setLogs] = useState([]);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Log helper function
  const addLog = (message) => {
    console.log(message);
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()} - ${message}`]);
  };

  // Handle image file upload
  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      addLog(`Image file uploaded: ${file.name}`);
      const imageUrl = URL.createObjectURL(file);
      setImageSrc(imageUrl);
      setSolution(null);
      processImage(file);
    } else {
      addLog("Error: Invalid file type. Please upload an image.");
      alert("Please upload a valid image file (e.g., PNG, JPG).");
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    addLog("Triggering file input.");
    fileInputRef.current?.click();
  };

  // Start camera
  const startCamera = async () => {
    addLog("Starting camera...");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        addLog("Camera started successfully.");
      }
    } catch (error) {
      addLog(`Error starting camera: ${error instanceof Error ? error.message : "Unknown error"}`);
      alert("Failed to access camera. Please allow permissions.");
    }
  };

  // Capture image from camera
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      addLog("Capturing image from camera...");
      const context = canvasRef.current.getContext("2d");
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const imageDataUrl = canvasRef.current.toDataURL("image/png");
        setImageSrc(imageDataUrl);
        setSolution(null);
        processImageDataUrl(imageDataUrl);
        stopCamera();
      }
    } else {
      addLog("Error: Video or canvas element not ready.");
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      addLog("Camera stopped.");
    }
  };

  // Process image (file or data URL) and send to Gemini
  const processImage = async (file) => {
    addLog("Processing uploaded image...");
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Image = reader.result.split(",")[1];
      await fetchGeminiSolution(base64Image);
    };
    reader.readAsDataURL(file);
  };

  const processImageDataUrl = async (dataUrl) => {
    addLog("Processing captured image...");
    const base64Image = dataUrl.split(",")[1];
    await fetchGeminiSolution(base64Image);
  };

  // Fetch solution from Gemini API
  const fetchGeminiSolution = async (base64Image) => {
    setIsLoading(true);
    addLog("Sending image to Gemini API...");

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
                    inlineData: {
                      mimeType: "image/png",
                      data: base64Image,
                    },
                  },
                  {
                    text: "Solve the problem shown in this image and provide a detailed solution.",
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

      const generatedSolution = data.candidates[0].content.parts[0].text;
      addLog("Solution generated successfully.");
      setSolution(generatedSolution);
    } catch (error) {
      addLog(`Error fetching Gemini solution: ${error instanceof Error ? error.message : "Unknown error"}`);
      setSolution("Failed to generate solution. Please try again.");
    } finally {
      setIsLoading(false);
      addLog("Solution generation process completed.");
    }
  };

  // Format the solution text for display
  const formatSolution = (text) => {
    if (!text) return null;

    // Split by newlines and handle basic list formatting
    const lines = text.split("\n").filter((line) => line.trim() !== "");
    return lines.map((line, index) => {
      // Check for bullet points (e.g., "- " or "* ")
      if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        const content = line.trim().substring(2);
        return (
          <li key={index} className="ml-4 list-disc">
            {content}
          </li>
        );
      }
      // Regular paragraph
      return (
        <p key={index} className="mb-2">
          {line}
        </p>
      );
    });
  };

  // Generate and download PDF
  const downloadPDF = () => {
    if (!solution) {
      addLog("Error: No solution available to download.");
      return;
    }
    addLog("Generating and downloading PDF...");
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Question Solution", 10, 10);
    doc.setFontSize(12);
    doc.text(solution, 10, 20, { maxWidth: 180 });
    doc.save("question-solution.pdf");
    addLog("PDF downloaded successfully.");
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {/* Image Input Options */}
      {!imageSrc && (
        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={triggerFileInput}
            className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 mr-2"
          >
            Upload Image
          </button>
          <button
            onClick={startCamera}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Use Camera
          </button>
          <p className="text-sm text-gray-600 mt-2">
            Upload an image or use your camera to scan a question.
          </p>
        </div>
      )}

      {/* Camera Preview */}
      {!imageSrc && videoRef.current?.srcObject && (
        <div className="mb-4">
          <video ref={videoRef} className="w-full rounded-lg shadow-md" />
          <button
            onClick={captureImage}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Capture
          </button>
          <button
            onClick={stopCamera}
            className="mt-2 ml-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Stop Camera
          </button>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}

      {/* Display Captured/Uploaded Image */}
      {imageSrc && (
        <div className="mb-4">
          <img src={imageSrc} alt="Question" className="w-full rounded-lg shadow-md" />
        </div>
      )}

      {/* Logs Display */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg max-h-40 overflow-y-auto">
        <h3 className="text-sm font-semibold">Progress Logs</h3>
        {logs.length > 0 ? (
          <ul className="text-xs text-gray-600">
            {logs.map((log, index) => (
              <li key={index}>{log}</li>
            ))}
          </ul>
        ) : (
          <p>No logs yet.</p>
        )}
      </div>

      {/* Display Solution */}
      {solution && (
        <div className="mt-4 p-6 bg-white rounded-lg shadow-md border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Solution</h3>
          <div className="text-gray-700 leading-relaxed">
            {formatSolution(solution)}
          </div>
          <button
            onClick={downloadPDF}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Download Solution as PDF
          </button>
        </div>
      )}
    </div>
  );
}