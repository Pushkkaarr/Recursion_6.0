"use client";

import { useState, useRef } from "react";
import { jsPDF } from "jspdf";
import { 
  Camera, 
  Upload, 
  X, 
  FileDown, 
  Loader2, 
  BookOpen,
  ScanSearch,
  CheckCircle
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

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
    
    // Also show important messages as toasts
    if (message.includes("successfully") || message.includes("Error")) {
      toast(message, {
        icon: message.includes("Error") ? "🚫" : "✅"
      });
    }
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
      toast.error("Please upload a valid image file (e.g., PNG, JPG).");
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
      toast.error("Failed to access camera. Please allow permissions.");
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
      toast.error("Failed to generate solution. Please try again.");
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
      toast.success("Study plan generated successfully!");
    } catch (error) {
      addLog(`Error generating study plan: ${error instanceof Error ? error.message : "Unknown error"}`);
      setStudyPlan("Failed to generate study plan. Please try again.");
      toast.error("Failed to generate study plan. Please try again.");
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
          <li key={index} className="ml-6 list-disc mb-1">
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
            <h3 key={index} className="font-bold text-lg mt-5 mb-3 text-primary">
              {content}
            </h3>
          ) : (
            <h4 key={index} className="font-semibold text-md mt-3 mb-2 text-primary/80">
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

      // Handle numbered lists (e.g., "1. ")
      if (line.trim().match(/^\d+\.\s/)) {
        const content = line.trim().replace(/^\d+\.\s/, "");
        return (
          <li key={index} className="ml-6 list-decimal mb-1">
            {content}
          </li>
        );
      }

      // Handle emoji indicators
      if (line.match(/^[📌📊📅📖🔥]/)) {
        return (
          <p key={index} className="mb-3 font-semibold flex items-center">
            <Badge variant="outline" className="mr-2 py-1 px-2">
              {line.substring(0, 1)}
            </Badge>
            {line.substring(1)}
          </p>
        );
      }

      // Regular paragraph
      return (
        <p key={index} className="mb-3">
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
    
    const textLines = content.split('\n');
    let yPosition = 20;
    
    textLines.forEach(line => {
      // Skip empty lines
      if (line.trim() === '') return;
      
      // Handle different line types
      if (line.trim().startsWith('#')) {
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text(line.replace(/^#+\s/, ''), 10, yPosition);
        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
      } else {
        const wrappedText = doc.splitTextToSize(line, 180);
        doc.text(wrappedText, 10, yPosition);
        yPosition += 5 * wrappedText.length;
        return;
      }
      
      yPosition += 8;
    });
    
    doc.save(filename);
    addLog(`${filename} downloaded successfully.`);
    toast.success(`${filename} downloaded successfully.`);
  };

  return (
    <div className="w-full px-4 py-6 mx-auto max-w-5xl space-y-8 animate-in fade-in duration-500">
      <Card className="border border-border/40 shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="px-3 py-1 text-xs bg-primary/5">
              AI Tools
            </Badge>
          </div>
          <CardTitle className="text-2xl mt-2 font-medium">Study Enhancement Tools</CardTitle>
          <CardDescription>
            Scan homework questions for solutions or generate personalized study plans.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="scanner" className="data-[state=active]:bg-primary/10">
                <div className="flex items-center space-x-2">
                  <ScanSearch size={16} />
                  <span>Question Scanner</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="planner" className="data-[state=active]:bg-primary/10">
                <div className="flex items-center space-x-2">
                  <BookOpen size={16} />
                  <span>Study Planner</span>
                </div>
              </TabsTrigger>
            </TabsList>

            {/* Question Scanner Tab */}
            <TabsContent value="scanner" className="space-y-4">
              {!imageSrc && (
                <Card className="border border-border/30 bg-background/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">Question Scanner</CardTitle>
                    <CardDescription>
                      Upload an image of your homework question and get a detailed solution.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-3 mt-4">
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Button onClick={triggerFileInput} className="group">
                        <Upload size={16} className="mr-2 group-hover:animate-bounce" />
                        Upload Image
                      </Button>
                      <Button 
                        onClick={startCamera} 
                        variant="outline"
                        className="border-primary/20 group"
                      >
                        <Camera size={16} className="mr-2 group-hover:animate-pulse" />
                        Use Camera
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Camera Preview */}
              {!imageSrc && videoRef.current?.srcObject && (
                <Card className="overflow-hidden border border-border/30">
                  <CardContent className="p-0">
                    <div className="relative">
                      <video ref={videoRef} className="w-full h-full rounded-t-lg" />
                      <canvas ref={canvasRef} className="hidden" />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between p-4 bg-muted/30">
                    <Button onClick={captureImage} variant="default">
                      <CheckCircle size={16} className="mr-2" />
                      Capture
                    </Button>
                    <Button onClick={stopCamera} variant="destructive">
                      <X size={16} className="mr-2" />
                      Cancel
                    </Button>
                  </CardFooter>
                </Card>
              )}

              {/* Display Captured/Uploaded Image */}
              {imageSrc && (
                <Card className="overflow-hidden border border-border/30">
                  <CardContent className="p-0">
                    <div className="relative">
                      <img 
                        src={imageSrc} 
                        alt="Question" 
                        className="w-full object-contain max-h-[400px] rounded-t-lg" 
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between p-4 bg-muted/30">
                    <Button 
                      onClick={() => {
                        setImageSrc(null);
                        setSolution(null);
                      }} 
                      variant="outline"
                      className="border-destructive/20 text-destructive hover:bg-destructive/10"
                    >
                      <X size={16} className="mr-2" />
                      Clear Image
                    </Button>
                    {isLoading && (
                      <div className="flex items-center">
                        <Loader2 size={16} className="mr-2 animate-spin" />
                        <span>Analyzing...</span>
                      </div>
                    )}
                  </CardFooter>
                </Card>
              )}

              {/* Loading Indicator */}
              {isLoading && !solution && (
                <Alert variant="default" className="bg-primary/5 border-primary/10">
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin text-primary" />
                    <AlertDescription>
                      Generating detailed solution... This may take a moment.
                    </AlertDescription>
                  </div>
                </Alert>
              )}

              {/* Display Solution */}
              {solution && (
                <Card className="border border-border/30 overflow-hidden shadow-sm transition-all hover:shadow-md">
                  <CardHeader className="space-y-1 pb-4">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="px-3 py-1 bg-green-50 text-green-700 border-green-200">
                        Solution Ready
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">Problem Solution</CardTitle>
                  </CardHeader>
                  <Separator />
                  <CardContent className="pt-6 text-sm leading-relaxed">
                    <div className="prose prose-sm max-w-none text-card-foreground">
                      {formatText(solution)}
                    </div>
                  </CardContent>
                  <CardFooter className="pb-6">
                    <Button 
                      onClick={() => downloadPDF(solution, "question-solution.pdf")} 
                      className="w-full group transition-all"
                    >
                      <FileDown size={16} className="mr-2 group-hover:animate-bounce" />
                      Download Solution as PDF
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </TabsContent>

            {/* Study Planner Tab */}
            <TabsContent value="planner" className="space-y-4">
              <Card className="border border-border/30 bg-background/50">
                <CardHeader>
                  <CardTitle className="text-xl">Smart Study Planner</CardTitle>
                  <CardDescription>
                    Get a personalized study plan based on your attendance and quiz performance.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Alert className="bg-muted/30 border-primary/20">
                      <AlertDescription>
                        Our AI analyzes your class attendance and quiz scores to create a tailored study schedule for the upcoming week.
                      </AlertDescription>
                    </Alert>
                    <Button 
                      onClick={generateStudyPlan} 
                      disabled={isPlanLoading} 
                      className="w-full group"
                    >
                      {isPlanLoading ? (
                        <>
                          <Loader2 size={16} className="mr-2 animate-spin" />
                          Generating Plan...
                        </>
                      ) : (
                        <>
                          <BookOpen size={16} className="mr-2 group-hover:animate-pulse" />
                          Generate Study Plan
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Display Study Plan */}
              {studyPlan && (
                <Card className="border border-border/30 overflow-hidden shadow-sm transition-all hover:shadow-md">
                  <CardHeader className="space-y-1 pb-4">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="px-3 py-1 bg-blue-50 text-blue-700 border-blue-200">
                        Plan Ready
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">Your Personalized Study Plan</CardTitle>
                  </CardHeader>
                  <Separator />
                  <CardContent className="pt-6 text-sm leading-relaxed">
                    <div className="prose prose-sm max-w-none text-card-foreground">
                      {formatText(studyPlan)}
                    </div>
                  </CardContent>
                  <CardFooter className="pb-6">
                    <Button 
                      onClick={() => downloadPDF(studyPlan, "study-plan.pdf")} 
                      className="w-full group transition-all"
                    >
                      <FileDown size={16} className="mr-2 group-hover:animate-bounce" />
                      Download Study Plan as PDF
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
