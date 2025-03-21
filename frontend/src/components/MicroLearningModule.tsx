"use client";

import { useState, useRef } from "react";
import { jsPDF } from "jspdf";

export default function MicroLearningModule() {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [transcript, setTranscript] = useState<string>("");
  const [youtubeUrl, setYoutubeUrl] = useState<string>("");
  const [logs, setLogs] = useState<string[]>([]);
  const urlInputRef = useRef<HTMLInputElement>(null);

  // Log helper function
  const addLog = (message: string) => {
    console.log(message);
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()} - ${message}`]);
  };

  // Extract YouTube video ID from URL
  const getVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Fetch transcript from YouTube URL with fallback
  const fetchTranscript = async (url: string) => {
    const videoId = getVideoId(url);
    if (!videoId) {
      addLog("Error: Invalid YouTube URL.");
      return;
    }

    addLog(`Fetching transcript for video ID: ${videoId}`);
    setIsLoading(true);

    const proxies = [
      `https://youtube-transcript-api.vercel.app/api/transcript/${videoId}`,
      `https://yt-subtitles-api.herokuapp.com/transcript/${videoId}`, // Fallback proxy (example, check availability)
    ];

    for (const proxy of proxies) {
      try {
        const response = await fetch(proxy, { mode: "cors" });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (!data || data.length === 0) {
          throw new Error("No transcript available for this video.");
        }

        const transcriptText = data.map((entry: { text: string }) => entry.text).join(" ");
        addLog(`Transcript fetched successfully from ${proxy}.`);
        setTranscript(transcriptText);
        setIsLoading(false);
        return; // Exit if successful
      } catch (error) {
        addLog(`Error with ${proxy}: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    }

    addLog("All proxy attempts failed. This video may not have captions.");
    setTranscript("");
    setIsLoading(false);
  };

  // Handle URL submission
  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (youtubeUrl) {
      fetchTranscript(youtubeUrl);
    } else {
      addLog("Error: Please enter a YouTube URL.");
    }
  };

  // Gemini AI summary generation
  const generateAISummary = async () => {
    if (!transcript) {
      addLog("Error: No transcript available. Please fetch a transcript first.");
      setSummary("Please fetch a transcript from a YouTube video first.");
      return;
    }

    addLog("Generating AI summary...");
    setIsLoading(true);
    setSummary(null);

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
                    text: `Summarize this video content in an advanced and concise way: ${transcript}`,
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
      addLog("AI summary generated successfully.");
      setSummary(generatedSummary);
    } catch (error) {
      addLog(`Error fetching Gemini summary: ${error instanceof Error ? error.message : "Unknown error"}`);
      setSummary("Failed to generate summary. Please try again.");
    } finally {
      setIsLoading(false);
      addLog("Summary generation process completed.");
    }
  };

  // Generate and download PDF
  const downloadPDF = () => {
    if (!summary) {
      addLog("Error: No summary available to download.");
      return;
    }
    addLog("Generating and downloading PDF...");
    const doc = new jsPDF();
    doc.text("Micro-Learning Module Notes", 10, 10);
    doc.text(summary, 10, 20, { maxWidth: 180 });
    doc.save("micro-learning-notes.pdf");
    addLog("PDF downloaded successfully.");
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {/* YouTube URL Input */}
      <form onSubmit={handleUrlSubmit} className="mb-4">
        <input
          type="text"
          ref={urlInputRef}
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          placeholder="Enter YouTube video URL"
          className="w-full p-2 border rounded mb-2"
        />
        <button
          type="submit"
          disabled={isLoading}
          className={`px-4 py-2 text-white rounded ${
            isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-teal-500 hover:bg-teal-600"
          }`}
        >
          {isLoading ? "Fetching..." : "Fetch Transcript"}
        </button>
        <p className="text-sm text-gray-600 mt-2">
          Enter a YouTube URL with available captions to generate an AI summary.
        </p>
      </form>

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

      {/* Display Transcript */}
      {transcript && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold">Transcript</h3>
          <p className="text-xs text-gray-600">{transcript}</p>
        </div>
      )}

      {/* AI Summary Button */}
      {transcript && (
        <button
          onClick={generateAISummary}
          disabled={isLoading}
          className={`mt-4 px-4 py-2 text-white rounded ${
            isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isLoading ? "Generating..." : "Generate AI Summary"}
        </button>
      )}

      {/* Display Summary */}
      {summary && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-semibold">AI Summary</h3>
          <p>{summary}</p>
          <button
            onClick={downloadPDF}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Download Notes as PDF
          </button>
        </div>
      )}
    </div>
  );
}