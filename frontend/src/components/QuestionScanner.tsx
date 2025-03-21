"use client";

import { useState, useRef } from "react";
import { jsPDF } from "jspdf";

export default function QuestionScanner() {
  const [solution, setSolution] = useState(null);
  const [studyPlan, setStudyPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlanLoading, setIsPlanLoading] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [logs, setLogs] = useState([]);
  const [activeTab, setActiveTab] = useState("scanner"); // "scanner" or "planner"
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

  // Generate Smart Study Plan using Gemini API
  const generateStudyPlan = async () => {
    setIsPlanLoading(true);
    setStudyPlan(null);
    addLog("Generating smart study plan...");

    // Generate a random quiz score between 50-70%
    const mathScore = Math.floor(Math.random() * 21) + 50;
    const physicsScore = Math.floor(Math.random() * 21) + 50;

    // Mock prompt for Gemini API
    const prompt = `
      You are an AI-powered smart study planner that helps students stay on track with their learning. The user follows a weekly study plan from Monday to Friday. Based on their attendance and quiz performance, generate a customized study plan for the upcoming week.

      ### Student Data:
      - Study Days: Monday, Tuesday, Wednesday (Absent), Thursday, Friday
      - Missed Study Topics: The student was absent on Wednesday, so the missing topics should be rescheduled for the upcoming week.
      - Quiz Performance: The student has taken quizzes and scored ${mathScore}% on Math and ${physicsScore}% on Physics. Identify the weakest subjects based on this performance.
      - Study Material Suggestions: Provide at least 2-3 study resources for weak subjects.

      Please provide the following:
      1. Missed Topics Rescheduling
      2. Quiz Performance Analysis
      3. Personalized Study Plan for Next Week (Monday to Friday)
      4. A motivational message for the student
    `;

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
                    text: prompt,
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

      const generatedPlan = data.candidates[0].content.parts[0].text;
      addLog("Study plan generated successfully.");
      setStudyPlan(generatedPlan);
    } catch (error) {
      addLog(`Error generating study plan: ${error instanceof Error ? error.message : "Unknown error"}`);
      setStudyPlan("Failed to generate study plan. Please try again.");
    } finally {
      setIsPlanLoading(false);
      addLog("Study plan generation completed.");
    }
  };

  // Format the solution or study plan text for display
  const formatText = (text) => {
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

      // Check for headers (e.g., "## " or "# " or bold text with **)
      if (line.trim().startsWith("#") || line.trim().startsWith("**")) {
        let content = line.trim();
        if (content.startsWith("#")) {
          const level = content.match(/^#+/)[0].length;
          content = content.substring(level + 1).trim();
          return level <= 3 ? (
            <h3 key={index} className="font-bold text-lg mt-4 mb-2">
              {content}
            </h3>
          ) : (
            <h4 key={index} className="font-semibold text-md mt-2 mb-1">
              {content}
            </h4>
          );
        } else if (content.startsWith("**") && content.endsWith("**")) {
          content = content.substring(2, content.length - 2);
          return (
            <p key={index} className="font-bold mb-2">
              {content}
            </p>
          );
        }
      }

      // Handle emoji indicators
      if (line.match(/^[📌📊📅📖🔥]/)) {
        return (
          <p key={index} className="mb-2 font-semibold">
            {line}
          </p>
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
  const downloadPDF = (content, filename) => {
    if (!content) {
      addLog(`Error: No ${filename === "study-plan.pdf" ? "study plan" : "solution"} available to download.`);
      return;
    }
    addLog(`Generating and downloading ${filename}...`);
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(filename === "study-plan.pdf" ? "Smart Study Plan" : "Question Solution", 10, 10);
    doc.setFontSize(12);
    doc.text(content, 10, 20, { maxWidth: 180 });
    doc.save(filename);
    addLog(`${filename} downloaded successfully.`);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {/* Tab Navigation */}
      <div className="flex mb-4 border-b">
        <button
          onClick={() => setActiveTab("scanner")}
          className={`px-4 py-2 ${
            activeTab === "scanner"
              ? "border-b-2 border-blue-500 text-blue-600 font-semibold"
              : "text-gray-600"
          }`}
        >
          Question Scanner
        </button>
        <button
          onClick={() => setActiveTab("planner")}
          className={`px-4 py-2 ${
            activeTab === "planner"
              ? "border-b-2 border-blue-500 text-blue-600 font-semibold"
              : "text-gray-600"
          }`}
        >
          Smart Study Planner
        </button>
      </div>

      {/* Question Scanner Section */}
      {activeTab === "scanner" && (
        <>
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
              <button
                onClick={() => {
                  setImageSrc(null);
                  setSolution(null);
                }}
                className="mt-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Clear Image
              </button>
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2">Generating solution...</span>
            </div>
          )}

          {/* Display Solution */}
          {solution && (
            <div className="mt-4 p-6 bg-white rounded-lg shadow-md border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Solution</h3>
              <div className="text-gray-700 leading-relaxed">
                {formatText(solution)}
              </div>
              <button
                onClick={() => downloadPDF(solution, "question-solution.pdf")}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                Download Solution as PDF
              </button>
            </div>
          )}
        </>
      )}

      {/* Smart Study Planner Section */}
      {activeTab === "planner" && (
        <div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Smart Study Planner</h3>
            <p className="text-gray-600 mb-4">
              Get a personalized study plan based on your attendance and quiz performance. Our AI will analyze your data and create a tailored study schedule for the upcoming week.
            </p>
            <button
              onClick={generateStudyPlan}
              disabled={isPlanLoading}
              className={`px-4 py-2 ${
                isPlanLoading 
                  ? "bg-gray-400" 
                  : "bg-indigo-600 hover:bg-indigo-700"
              } text-white rounded transition-colors`}
            >
              {isPlanLoading ? "Generating..." : "Generate Study Plan"}
            </button>
          </div>

          {/* Loading Indicator */}
          {isPlanLoading && (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
              <span className="ml-2">Generating your study plan...</span>
            </div>
          )}

          {/* Display Study Plan */}
          {studyPlan && (
            <div className="mt-4 p-6 bg-white rounded-lg shadow-md border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Your Personalized Study Plan</h3>
              <div className="text-gray-700 leading-relaxed">
                {formatText(studyPlan)}
              </div>
              <button
                onClick={() => downloadPDF(studyPlan, "study-plan.pdf")}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                Download Study Plan as PDF
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}