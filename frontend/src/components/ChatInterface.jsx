
import { useState, useRef, useEffect } from 'react';

export default function ChatInterface({ pdfInfo }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const messagesEndRef = useRef(null);

  // Check if pdfInfo is defined before accessing properties
  const fileName = pdfInfo?.fileName || 'document';
  const filePath = pdfInfo?.filePath || '';
  const sessionId = pdfInfo?.sessionId || Math.random().toString(36).substring(2, 15);

  useEffect(() => {
    // Scroll to bottom of messages
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading || !filePath) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filePath: filePath,
          query: userMessage,
          sessionId: sessionId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      // Add AI response to chat
      setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error processing your question. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSummarize = async () => {
    if (isSummarizing || !filePath) return;
    
    setIsSummarizing(true);

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filePath: filePath,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to summarize PDF');
      }

      setSummary(data.summary);
      
      // Add summary to chat
      setMessages([{ 
        role: 'assistant', 
        content: `📄 **Summary of ${fileName}**\n\n${data.summary}`
      }]);
    } catch (error) {
      console.error('Error summarizing PDF:', error);
      setMessages([{ 
        role: 'assistant', 
        content: 'Sorry, I encountered an error summarizing the PDF. Please try again.' 
      }]);
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden">
      <div className="bg-gray-100 p-4 border-b">
        <h2 className="text-xl font-semibold">Chat with PDF: {fileName}</h2>
        <button
          onClick={handleSummarize}
          disabled={isSummarizing || !filePath}
          className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isSummarizing ? 'Summarizing...' : 'Summarize PDF'}
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto bg-white">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 my-8">
            <p>{filePath ? 'Ask questions about the PDF content.' : 'Please upload a PDF first.'}</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-100 ml-auto max-w-3/4'
                  : 'bg-gray-100 mr-auto max-w-3/4'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="mb-4 p-3 rounded-lg bg-gray-100 mr-auto max-w-3/4">
            <p>Thinking...</p>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t">
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={filePath ? "Ask a question about the PDF..." : "Upload a PDF to start chatting"}
            className="flex-1 p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading || !filePath}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim() || !filePath}
            className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}