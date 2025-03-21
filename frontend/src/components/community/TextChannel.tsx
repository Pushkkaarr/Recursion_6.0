'use client';

import { useState, useEffect, useRef } from 'react';
import { Paperclip, Send, Image, Film, Smile, Loader, PenLine, User, X } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';

interface Message {
  _id: string;
  content: string;
  sender: {
    id?: string;
    name: string;
    isGuest: boolean;
  };
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'file';
  createdAt: string;
}

interface TextChannelProps {
  channelId: string;
  channelName: string;
  username: string;
  isGuest: boolean;
  userId?: string;
}

export default function TextChannel({ channelId, channelName, username, isGuest, userId }: TextChannelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Connect to WebSocket
  useEffect(() => {
    const newSocket = io(`${process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:5000'}`);
    
    newSocket.on('connect', () => {
      console.log('Connected to WebSocket');
      newSocket.emit('joinChannel', channelId);
    });
    
    newSocket.on('newMessage', (newMessage: Message) => {
      setMessages(prev => [...prev, newMessage]);
    });
    
    newSocket.on('disconnect', () => {
      console.log('Disconnected from WebSocket');
    });
    
    setSocket(newSocket);
    
    return () => {
      if (newSocket) {
        newSocket.emit('leaveChannel', channelId);
        newSocket.disconnect();
      }
    };
  }, [channelId]);
  
  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/messages/${channelId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }
        
        const data = await response.json();
        setMessages(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast.error('Failed to load messages. Please try again.');
        setIsLoading(false);
        
        // Add sample messages for demo if API fails
        setMessages([
          {
            _id: '1',
            content: `Welcome to the ${channelName} channel!`,
            sender: {
              name: 'System',
              isGuest: false
            },
            createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
          },
          {
            _id: '2',
            content: 'Hey everyone, how is the project going?',
            sender: {
              id: '123',
              name: 'Alex',
              isGuest: false
            },
            createdAt: new Date(Date.now() - 1800000).toISOString()
          },
        ]);
      }
    };
    
    fetchMessages();
  }, [channelId, channelName]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    try {
      setIsSending(true);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/messages/${channelId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: message,
          senderName: username,
          senderId: userId,
          isGuest
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      setMessage('');
      setIsSending(false);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
      setIsSending(false);
    }
  };
  
  const handleFileUpload = async () => {
    if (!fileInputRef.current?.files?.length) return;
    
    const file = fileInputRef.current.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('senderName', username);
    if (userId) formData.append('senderId', userId);
    formData.append('isGuest', String(isGuest));
    
    try {
      setIsSending(true);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/messages/${channelId}/media`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload file');
      }
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      toast.success('File uploaded successfully!');
      setIsSending(false);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file. Please try again.');
      setIsSending(false);
    }
  };
  
  // Format date/time
  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric'
      }).format(date);
    }
  };
  
  // Group messages by date
  const messagesByDate: Record<string, Message[]> = {};
  
  messages.forEach(message => {
    const dateStr = formatMessageDate(message.createdAt);
    if (!messagesByDate[dateStr]) {
      messagesByDate[dateStr] = [];
    }
    messagesByDate[dateStr].push(message);
  });
  
  return (
    <div className="flex flex-col h-full">
      {/* Channel Header */}
      <div className="h-14 flex items-center px-4 border-b border-gray-200 bg-white shadow-sm">
        <div className="flex items-center">
          <PenLine size={18} className="text-blue-500 mr-2" />
          <h2 className="font-medium">{channelName}</h2>
        </div>
      </div>
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader className="animate-spin text-blue-500" />
          </div>
        ) : (
          <>
            {Object.entries(messagesByDate).map(([date, dateMessages]) => (
              <div key={date} className="mb-6">
                <div className="flex items-center mb-4">
                  <div className="h-px bg-gray-200 flex-1"></div>
                  <span className="px-2 text-xs font-medium text-gray-500">{date}</span>
                  <div className="h-px bg-gray-200 flex-1"></div>
                </div>
                
                {dateMessages.map(msg => (
                  <div key={msg._id} className="mb-4 flex items-start">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium mr-3 mt-1">
                      {msg.sender.name === 'System' ? 
                        <User size={16} /> : 
                        msg.sender.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline">
                        <span className="font-medium mr-2">{msg.sender.name}</span>
                        {msg.sender.isGuest && (
                          <span className="text-xs text-gray-500 mr-2">(Guest)</span>
                        )}
                        <span className="text-xs text-gray-500">{formatMessageTime(msg.createdAt)}</span>
                      </div>
                      <div className="mt-1">
                        {!msg.mediaType && (
                          <p className="text-gray-800">{msg.content}</p>
                        )}
                        
                        {msg.mediaType === 'image' && msg.mediaUrl && (
                          <div>
                            <p className="text-gray-600 text-sm mb-1">{msg.content}</p>
                            <img 
                              src={msg.mediaUrl} 
                              alt="Shared"
                              className="max-w-md rounded-lg border border-gray-200 shadow-sm"
                            />
                          </div>
                        )}
                        
                        {msg.mediaType === 'video' && msg.mediaUrl && (
                          <div>
                            <p className="text-gray-600 text-sm mb-1">{msg.content}</p>
                            <video 
                              controls
                              className="max-w-md rounded-lg border border-gray-200 shadow-sm"
                            >
                              <source src={msg.mediaUrl} />
                              Your browser does not support the video tag.
                            </video>
                          </div>
                        )}
                        
                        {msg.mediaType === 'file' && msg.mediaUrl && (
                          <div>
                            <p className="text-gray-600 text-sm mb-1">{msg.content}</p>
                            <a 
                              href={msg.mediaUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center p-2 bg-gray-50 rounded-md border border-gray-200 text-blue-600 hover:bg-gray-100"
                            >
                              <Paperclip size={16} className="mr-2" />
                              <span>Download File</span>
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      
      {/* Input Area */}
      <div className="p-3 bg-white border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex items-center">
          <div className="flex space-x-2 mr-2">
            <button 
              type="button" 
              className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
              onClick={() => fileInputRef.current?.click()}
            >
              <Image size={20} />
            </button>
            <button 
              type="button" 
              className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
              onClick={() => fileInputRef.current?.click()}
            >
              <Film size={20} />
            </button>
            <button 
              type="button" 
              className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip size={20} />
            </button>
            <input 
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              accept="image/*,video/*,application/pdf"
            />
          </div>
          
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Message #${channelName}`}
            className="flex-1 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isSending}
          />
          
          <div className="flex ml-2 space-x-2">
            <button type="button" className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
              <Smile size={20} />
            </button>
            <button 
              type="submit" 
              className={`p-2 rounded-full ${
                isSending || !message.trim() 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
              disabled={isSending || !message.trim()}
            >
              {isSending ? <Loader size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
