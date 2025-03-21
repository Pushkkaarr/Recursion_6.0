"use client"
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Send, MoreVertical, Phone, VideoIcon, Image, Paperclip, Info } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

const conversations = [
  {
    id: 1,
    user: {
      name: "Jordan Smith",
      avatar: "/placeholder.svg",
      role: "Teacher",
      status: "online"
    },
    lastMessage: "Have you started working on the assignment?",
    timestamp: "10:32 AM",
    unread: 1
  },
  {
    id: 2,
    user: {
      name: "Alex Chen",
      avatar: "/placeholder.svg",
      role: "Student",
      status: "online"
    },
    lastMessage: "Thanks for your help with the calculus problem!",
    timestamp: "Yesterday",
    unread: 0
  },
  {
    id: 3,
    user: {
      name: "Study Group - Physics",
      avatar: "/placeholder.svg",
      role: "Group",
      status: "active"
    },
    lastMessage: "Morgan: Let's meet on Friday to prepare for the lab.",
    timestamp: "Yesterday",
    unread: 3
  },
  {
    id: 4,
    user: {
      name: "Dr. Williams",
      avatar: "/placeholder.svg",
      role: "Professor",
      status: "offline"
    },
    lastMessage: "Office hours have been rescheduled to Thursday.",
    timestamp: "Monday",
    unread: 0
  },
  {
    id: 5,
    user: {
      name: "Taylor Kim",
      avatar: "/placeholder.svg",
      role: "Student",
      status: "online"
    },
    lastMessage: "Can I borrow your notes from yesterday's class?",
    timestamp: "Monday",
    unread: 0
  },
];

const messages = [
  {
    id: 1,
    sender: "Jordan Smith",
    content: "Hi there! How's your progress on the mathematics assignment coming along?",
    timestamp: "10:15 AM",
    isSender: false
  },
  {
    id: 2,
    sender: "You",
    content: "I've completed most of it, but I'm stuck on the integration problems in section 3.",
    timestamp: "10:18 AM",
    isSender: true
  },
  {
    id: 3,
    sender: "Jordan Smith",
    content: "Those can be tricky. Do you want to go over them during office hours tomorrow?",
    timestamp: "10:20 AM",
    isSender: false
  },
  {
    id: 4,
    sender: "You",
    content: "That would be really helpful. What time works for you?",
    timestamp: "10:22 AM",
    isSender: true
  },
  {
    id: 5,
    sender: "Jordan Smith",
    content: "I'm available from 2-4 PM. Does 2:30 work for you?",
    timestamp: "10:25 AM",
    isSender: false
  },
  {
    id: 6,
    sender: "You",
    content: "Perfect! I'll see you then. Thanks for your help!",
    timestamp: "10:28 AM",
    isSender: true
  },
  {
    id: 7,
    sender: "Jordan Smith",
    content: "No problem at all. Also, have you started working on the assignment for next week?",
    timestamp: "10:32 AM",
    isSender: false
  },
];

const MessagesPage = () => {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [newMessage, setNewMessage] = useState("");
  
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Logic to send message would go here
      setNewMessage("");
    }
  };
  
  return (
    <div className="h-[calc(100vh-13rem)]">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full">
        {/* Conversations List */}
        <div className="md:col-span-4 h-full">
          <Card className="h-full flex flex-col">
            <CardHeader className="px-4 pb-2">
              <div className="flex justify-between items-center mb-2">
                <CardTitle>Messages</CardTitle>
                <Button variant="ghost" size="icon">
                  <MoreVertical size={18} />
                </Button>
              </div>
              <div className="flex items-center space-x-1">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search conversations..." className="h-8" />
              </div>
            </CardHeader>
            <ScrollArea className="flex-1 px-4 py-2">
              {conversations.map((conversation) => (
                <div key={conversation.id}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start px-2 ${
                      selectedConversation?.id === conversation.id ? 'bg-accent' : ''
                    }`}
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <div className="flex items-center w-full">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={conversation.user.avatar} alt={conversation.user.name} />
                          <AvatarFallback>{conversation.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${
                          conversation.user.status === 'online' ? 'bg-green-500' : 
                          conversation.user.status === 'active' ? 'bg-blue-500' : 'bg-gray-300'
                        }`}></span>
                      </div>
                      <div className="ml-3 flex-1 overflow-hidden">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium">{conversation.user.name}</p>
                          <p className="text-xs text-muted-foreground">{conversation.timestamp}</p>
                        </div>
                        <p className="text-xs line-clamp-1 text-muted-foreground">
                          {conversation.lastMessage}
                        </p>
                      </div>
                      {conversation.unread > 0 && (
                        <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                          {conversation.unread}
                        </Badge>
                      )}
                    </div>
                  </Button>
                  <Separator className="my-1" />
                </div>
              ))}
            </ScrollArea>
          </Card>
        </div>
        
        {/* Chat Area */}
        <div className="md:col-span-8 h-full">
          <Card className="h-full flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Avatar>
                        <AvatarImage src={selectedConversation.user.avatar} alt={selectedConversation.user.name} />
                        <AvatarFallback>{selectedConversation.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="ml-3">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium">{selectedConversation.user.name}</p>
                          <Badge variant="outline">{selectedConversation.user.role}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {selectedConversation.user.status === 'online' ? 'Online' : 
                           selectedConversation.user.status === 'active' ? 'Active now' : 'Offline'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="icon">
                        <Phone size={18} />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <VideoIcon size={18} />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Info size={18} />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div 
                        key={message.id} 
                        className={`flex ${message.isSender ? 'justify-end' : 'justify-start'}`}
                      >
                        {!message.isSender && (
                          <Avatar className="h-8 w-8 mr-2 mt-1">
                            <AvatarImage src={selectedConversation.user.avatar} alt={selectedConversation.user.name} />
                            <AvatarFallback>{selectedConversation.user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        )}
                        <div>
                          <div 
                            className={`max-w-md px-4 py-2 rounded-lg ${
                              message.isSender 
                                ? 'bg-primary text-primary-foreground ml-auto' 
                                : 'bg-muted'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                
                {/* Message Input */}
                <CardContent className="p-4 border-t">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon">
                      <Image size={18} />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Paperclip size={18} />
                    </Button>
                    <Input 
                      placeholder="Type a message..." 
                      className="flex-1"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button 
                      size="icon"
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                    >
                      <Send size={18} />
                    </Button>
                  </div>
                </CardContent>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Select a conversation to start messaging
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
