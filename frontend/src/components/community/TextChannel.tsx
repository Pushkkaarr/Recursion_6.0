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
  const [uploadingFile, setUploadingFile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Connect to WebSocket
  useEffect(() => {
    const newSocket = io(`${process.env.NEXT_PUBLIC_WS_URL || 'https://192.168.1.223:5001'}`);
    
    newSocket.on('connect', () => {
      console.log('Connected to WebSocket');
      newSocket.emit('joinChannel', channelId);
    });
    
    newSocket.on('newMessage', (newMessage: Message) => {
      console.log('Received new message via WebSocket:', newMessage);
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
      
      // Log the message data being sent
      console.log('Sending message with:', { 
        content: message, 
        senderName: username,
        isGuest 
      });
      
      // Get auth token from localStorage if user is logged in
      const token = !isGuest ? localStorage.getItem('token') : null;
      
      // For logged-in mode, we'll not send the senderId at all and let the backend
      // extract it from the JWT token instead to avoid ObjectId casting issues
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/messages/${channelId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include Authorization header for logged-in users
          ...(token ? {'Authorization': `Bearer ${token}`} : {})
        },
        body: JSON.stringify({
          content: message,
          senderName: username,
          // For guest mode only, we'll pass the isGuest flag
          isGuest
          // We're intentionally not sending senderId to avoid the ObjectId casting error
          // The backend should extract the user ID from the JWT token for logged-in users
        }),
      });
      
      if (!response.ok) {
        // Try to get detailed error from the server
        const errorData = await response.json().catch(() => null);
        console.error('Server error response:', errorData, 'Status:', response.status);
        throw new Error(`Failed to send message: ${errorData?.message || response.statusText}`);
      }
      
      setMessage('');
      setIsSending(false);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
      setIsSending(false);
    }
  };
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('senderName', username);
    formData.append('isGuest', String(isGuest));
    
    // Add a caption/content for the media
    const fileType = file.type.startsWith('image/') ? 'image' : 
                    file.type.startsWith('video/') ? 'video' : 'file';
    formData.append('content', `Shared a ${fileType}: ${file.name}`);
    
    try {
      setUploadingFile(true);
      
      // Get auth token if user is logged in
      const token = !isGuest ? localStorage.getItem('token') : null;
      
      console.log(`Uploading ${fileType}:`, file.name);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/messages/${channelId}/media`, {
        method: 'POST',
        headers: {
          // Include Authorization header for logged-in users
          ...(token ? {'Authorization': `Bearer ${token}`} : {})
        },
        body: formData,
      });
      
      if (!response.ok) {
        // Try to get detailed error from the server
        const errorText = await response.text();
        console.error('Server error response:', errorText, 'Status:', response.status);
        throw new Error(`Failed to upload file: ${response.statusText}`);
      }
      
      const uploadedMessage = await response.json();
      console.log('File uploaded successfully:', uploadedMessage);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      toast.success(`${fileType} uploaded successfully!`);
      setUploadingFile(false);
      
      // WebSocket will handle adding the message to all clients, but we can also
      // add it locally to avoid delay
      // setMessages(prev => [...prev, uploadedMessage]);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file. Please try again.');
      setUploadingFile(false);
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
  
  // Rendering media content based on type
  const renderMediaContent = (msg: Message) => {
    if (!msg.mediaType || !msg.mediaUrl) return null;
    
    switch (msg.mediaType) {
      case 'image':
        return (
          <div className="mt-2">
            <img 
              src={msg.mediaUrl} 
              alt="Shared image"
              className="max-w-md max-h-64 rounded-lg border border-gray-200 shadow-sm object-contain cursor-pointer"
              onClick={() => window.open(msg.mediaUrl, '_blank')}
              loading="lazy"
            />
          </div>
        );
      case 'video':
        return (
          <div className="mt-2">
            <video 
              controls
              className="max-w-md max-h-64 rounded-lg border border-gray-200 shadow-sm"
            >
              <source src={msg.mediaUrl} />
              Your browser does not support the video tag.
            </video>
          </div>
        );
      case 'file':
        return (
          <div className="mt-2">
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
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="flex flex-col h-full bg-background/40 backdrop-blur-sm">
      {/* Channel Header */}
      <div className="h-16 flex items-center px-6 border-b border-border/60 bg-background/80 backdrop-blur-sm sticky top-0 z-10 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-primary mr-3">
            <PenLine size={16} className="stroke-primary" />
          </div>
          <h2 className="font-semibold text-lg text-foreground"># {channelName}</h2>
        </div>
        <div className="ml-auto text-sm text-muted-foreground">
          {isGuest ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800/30">
              <User size={12} className="mr-1" />
              Guest Mode
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800/30">
              <User size={12} className="mr-1" />
              Connected
            </span>
          )}
        </div>
      </div>
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent space-y-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin"></div>
                <div className="absolute inset-2 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center">
                  <Loader size={20} className="text-primary" />
                </div>
              </div>
              <p className="text-muted-foreground text-sm font-medium">Loading messages...</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-full text-muted-foreground">
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <PenLine size={24} className="text-muted-foreground/50" />
            </div>
            <p className="text-lg mb-1 font-medium">No messages yet</p>
            <p className="text-sm max-w-xs text-center">Start the conversation by sending the first message in this channel!</p>
          </div>
        ) : (
          <>
            {Object.entries(messagesByDate).map(([date, dateMessages]) => (
              <div key={date} className="space-y-5">
                <div className="flex items-center mb-6">
                  <div className="h-px bg-border/40 flex-1"></div>
                  <span className="px-3 py-1 text-xs font-medium text-muted-foreground bg-background/80 rounded-full mx-2 shadow-sm backdrop-blur-sm border border-border/10">
                    {date}
                  </span>
                  <div className="h-px bg-border/40 flex-1"></div>
                </div>
                
                {dateMessages.map(msg => (
                  <div key={msg._id} className="group pl-2 hover:bg-muted/20 py-2 -mx-2 px-2 rounded-lg transition-colors duration-200 space-y-1">
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium mr-3 mt-0.5 border border-primary/5 shadow-sm ring-2 ring-background">
                        {msg.sender.name === 'System' ? 
                          <User size={16} /> : 
                          msg.sender.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline flex-wrap gap-1.5">
                          <span className="font-semibold text-foreground">
                            {msg.sender.name}
                          </span>
                          {msg.sender.isGuest && (
                            <span className="text-xs px-1.5 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded">
                              Guest
                            </span>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {formatMessageTime(msg.createdAt)}
                          </span>
                        </div>
                        <div className="mt-1 text-foreground/90 break-words">
                          <p className="leading-relaxed">{msg.content}</p>
                          {msg.mediaType === 'image' && msg.mediaUrl && (
                            <div className="mt-2 group/img relative">
                              <img 
                                src={msg.mediaUrl} 
                                alt="Shared image"
                                className="max-w-xs sm:max-w-sm md:max-w-md max-h-64 rounded-lg border border-border shadow-md object-contain cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
                                onClick={() => window.open(msg.mediaUrl, '_blank')}
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity rounded-lg pointer-events-none"></div>
                            </div>
                          )}
                          {msg.mediaType === 'video' && msg.mediaUrl && (
                            <div className="mt-2 overflow-hidden rounded-lg border border-border shadow-md">
                              <video 
                                controls
                                className="max-w-xs sm:max-w-sm md:max-w-md max-h-64"
                              >
                                <source src={msg.mediaUrl} />
                                Your browser does not support the video tag.
                              </video>
                            </div>
                          )}
                          {msg.mediaType === 'file' && msg.mediaUrl && (
                            <div className="mt-2">
                              <a 
                                href={msg.mediaUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center p-2.5 bg-primary/5 rounded-md border border-primary/10 text-primary hover:bg-primary/10 transition-colors shadow-sm"
                              >
                                <Paperclip size={16} className="mr-2 flex-shrink-0" />
                                <span>Download File</span>
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
            <div ref={messagesEndRef} className="h-4" />
          </>
        )}
      </div>
      
      {/* Input Area */}
      <div className="p-4 bg-background/80 backdrop-blur-sm border-t border-border/60 shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <div className="flex gap-1">
            <label 
              className="p-2.5 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors cursor-pointer relative"
              htmlFor="mediaUpload"
            >
              <Paperclip size={20} />
              <input 
                id="mediaUpload"
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                accept="image/*,video/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                disabled={uploadingFile}
              />
              {uploadingFile && (
                <span className="absolute inset-0 flex items-center justify-center bg-background/30 rounded-full backdrop-blur-sm">
                  <Loader size={20} className="animate-spin text-primary" />
                </span>
              )}
            </label>
          </div>
          
          <div className="relative flex-1">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Message #${channelName}`}
              className="w-full p-3 rounded-lg bg-muted/50 border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              disabled={isSending || uploadingFile}
            />
          </div>
          
          <div className="flex gap-1">
            <button 
              type="button" 
              className="p-2.5 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
            >
              <Smile size={20} />
            </button>
            <button 
              type="submit" 
              className={`p-2.5 rounded-full transition-all ${
                isSending || uploadingFile || !message.trim() 
                  ? 'bg-primary/30 text-primary-foreground/70 cursor-not-allowed' 
                  : 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-md'
              }`}
              disabled={isSending || uploadingFile || !message.trim()}
            >
              {isSending ? 
                <Loader size={20} className="animate-spin" /> : 
                <Send size={20} />
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
