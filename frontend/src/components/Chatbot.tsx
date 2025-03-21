"use client";

import { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { X, Maximize2, Minimize2, Send, Loader2, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

const Chatbot = ({ isOpen, onClose }: ChatbotProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [continuousMode, setContinuousMode] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    return <div className="text-red-500 p-4">Gemini API key is missing!</div>;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Focus input when chatbot opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Initialize Web Speech API for audio input
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      console.warn("Speech Recognition not supported in this browser.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true; // Enable continuous mode for conversation
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsRecording(true);
    };
    
    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      setInput(transcript);
      
      if (!continuousMode) {
        recognition.stop();
        setIsRecording(false);
        sendMessageWithText(transcript);
      } else {
        // In continuous mode, we submit the message but keep the mic open
        sendMessageWithText(transcript);
        // Clear input after sending
        setInput("");
      }
    };
    
    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsRecording(false);
      setContinuousMode(false);
      setMessages((prev) => [
        ...prev,
        { text: "Sorry, I couldn't understand the audio. Please try again.", isUser: false },
      ]);
    };
    
    recognition.onend = () => {
      // Only update recording state if we're not in continuous mode
      if (!continuousMode) {
        setIsRecording(false);
      } else {
        // If in continuous mode but recognition ended unexpectedly, restart it
        try {
          recognition.start();
        } catch (e) {
          console.error("Failed to restart recognition:", e);
          setContinuousMode(false);
          setIsRecording(false);
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [continuousMode]);

  // Initialize Speech Synthesis for audio output
  useEffect(() => {
    speechSynthesisRef.current = new SpeechSynthesisUtterance();
    
    // Find Hindi voice
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find(voice => voice.lang === 'hi-IN');
    
    if (hindiVoice) {
      speechSynthesisRef.current.voice = hindiVoice;
    } else {
      // On first load, voices might not be loaded yet
      window.speechSynthesis.onvoiceschanged = () => {
        const updatedVoices = window.speechSynthesis.getVoices();
        const voice = updatedVoices.find(v => v.lang === 'hi-IN');
        if (voice && speechSynthesisRef.current) {
          speechSynthesisRef.current.voice = voice;
        }
      };
    }
    
    speechSynthesisRef.current.lang = 'hi-IN';
    speechSynthesisRef.current.rate = 1;
    speechSynthesisRef.current.pitch = 1.4;
    
    speechSynthesisRef.current.onstart = () => {
      setIsSpeaking(true);
    };
    
    speechSynthesisRef.current.onend = () => {
      setIsSpeaking(false);
    };
    
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Send message (text or audio input)
  const sendMessageWithText = async (messageText: string) => {
    if (!messageText.trim() || loading) return;

    setMessages((prev) => [...prev, { text: messageText, isUser: true }]);
    setInput("");
    setLoading(true);

    try {
      const educationPrompt = `You are an expert educational assistant. Provide a clear, concise, and accurate response to the following education-related question or doubt. If the query is not education-specific, politely redirect the user to ask an education-related question:\n\n${messageText}`;
      const result = await model.generateContent(educationPrompt);
      const responseText = await result.response.text();
      setMessages((prev) => [...prev, { text: responseText, isUser: false }]);
      
      // Speak the response if audio is enabled
      if (audioEnabled && speechSynthesisRef.current) {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        
        // Set the response text
        speechSynthesisRef.current.text = responseText;
        
        // Speak
        window.speechSynthesis.speak(speechSynthesisRef.current);
      }
    } catch (error) {
      console.error("Error with Gemini API:", error);
      setMessages((prev) => [...prev, { text: "Error: Could not get response", isUser: false }]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    sendMessageWithText(input);
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) return;
    
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      setContinuousMode(false);
    } else {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error("Error starting recognition:", e);
      }
    }
  };
  
  const toggleContinuousConversation = () => {
    if (continuousMode) {
      // Turn off continuous mode
      setContinuousMode(false);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
    } else {
      // Turn on continuous mode
      setContinuousMode(true);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.error("Error starting continuous recognition:", e);
        }
      }
    }
  };
  
  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed bg-white shadow-xl rounded-lg flex flex-col z-50 transition-all duration-300 ${
        isExpanded
          ? "top-4 left-4 right-4 bottom-4 md:top-10 md:left-10 md:right-10 md:bottom-10"
          : "bottom-4 right-4 w-80 h-96 md:w-96 md:h-[28rem]"
      }`}
      role="dialog"
      aria-labelledby="chatbot-title"
      aria-modal="true"
    >
      {/* Header */}
      <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-t-lg">
        <h3 id="chatbot-title" className="text-lg font-semibold flex items-center">
          <span>EduBot - Your Study Assistant</span>
          {isSpeaking && <span className="ml-2 flex items-center animate-pulse">🔊</span>}
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={toggleAudio}
            className="p-1 hover:bg-blue-700 rounded transition-colors"
            aria-label={audioEnabled ? "Disable audio responses" : "Enable audio responses"}
            title={audioEnabled ? "Disable audio responses" : "Enable audio responses"}
          >
            {audioEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-blue-700 rounded transition-colors"
            aria-label={isExpanded ? "Collapse chatbot" : "Expand chatbot"}
            title={isExpanded ? "Collapse chatbot" : "Expand chatbot"}
          >
            {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-blue-700 rounded transition-colors"
            aria-label="Close chatbot"
            title="Close chatbot"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            <p>Ask me anything about your studies—math, science, history, or more!</p>
            <p className="mt-2 text-sm">
              Try using the <span className="font-medium">Conversation Mode</span> for a hands-free experience.
            </p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 max-w-[85%] ${msg.isUser ? "ml-auto" : "mr-auto"}`}
            >
              <div
                className={`p-3 rounded-lg ${
                  msg.isUser
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-800 rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {msg.isUser ? "You" : "EduBot"}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex items-center text-gray-500 mb-4">
            <Loader2 className="animate-spin mr-2" size={16} />
            <span>EduBot is thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Controls for Conversation Mode */}
      <div className="px-3 pt-2 border-t border-gray-200 bg-white">
        <Button
          type="button"
          onClick={toggleContinuousConversation}
          className={cn(
            "w-full mb-2 transition-all",
            continuousMode 
              ? "bg-red-600 hover:bg-red-700 text-white" 
              : "bg-green-600 hover:bg-green-700 text-white"
          )}
          disabled={loading}
        >
          {continuousMode ? (
            <><MicOff className="mr-2 h-4 w-4" /> Stop Conversation Mode</>
          ) : (
            <><Mic className="mr-2 h-4 w-4" /> Start Conversation Mode</>
          )}
        </Button>
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="p-3 border-t border-gray-200 bg-white rounded-b-lg">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            placeholder="Ask an education question..."
            disabled={loading || (isRecording && continuousMode)}
            aria-label="Chat input"
          />
          <button
            type="button"
            onClick={toggleRecording}
            className={`p-2 rounded ${
              isRecording && !continuousMode ? "bg-red-600" : "bg-gray-600"
            } text-white hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors`}
            disabled={loading || continuousMode}
            aria-label={isRecording ? "Stop recording" : "Start voice input"}
            title={isRecording ? "Stop recording" : "Start voice input"}
          >
            {isRecording && !continuousMode ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded-r-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            disabled={loading || (!input.trim() && !isRecording) || (isRecording && continuousMode)}
            aria-label="Send message"
            title="Send message"
          >
            <Send size={18} />
          </button>
        </div>
        {isRecording && (
          <div className="text-sm text-red-600 mt-1 flex items-center">
            <span className="animate-pulse mr-2">●</span>
            {continuousMode 
              ? "Conversation mode active - just speak your questions!" 
              : "Recording... Speak your question!"}
          </div>
        )}
      </form>
    </div>
  );
};

export default Chatbot;