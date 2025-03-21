"use client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Send, Filter, MessageSquare, UserPlus, ThumbsUp, MessageCircle, Flag } from "lucide-react";

const discussionChannels = [
  { id: 1, name: "Mathematics", unread: 5, members: 324 },
  { id: 2, name: "Science", unread: 2, members: 256 },
  { id: 3, name: "English Literature", unread: 0, members: 198 },
  { id: 4, name: "History", unread: 1, members: 142 },
  { id: 5, name: "Computer Science", unread: 8, members: 287 },
  { id: 6, name: "Study Techniques", unread: 3, members: 412 },
];

const discussionPosts = [
  {
    id: 1,
    user: {
      name: "Alex Chen",
      avatar: "/placeholder.svg",
      role: "Student"
    },
    channel: "Mathematics",
    title: "Having trouble with integration by parts",
    content: "I'm struggling with integration by parts, especially with choosing u and dv. Any tips or resources that might help?",
    timestamp: "2 hours ago",
    likes: 12,
    replies: 8,
    solved: false
  },
  {
    id: 2,
    user: {
      name: "Jamie Wilson",
      avatar: "/placeholder.svg",
      role: "Teaching Assistant"
    },
    channel: "Science",
    title: "Explanation of photosynthesis process",
    content: "I've created a detailed diagram explaining the process of photosynthesis. Would anyone find this helpful for their biology studies?",
    timestamp: "5 hours ago",
    likes: 31,
    replies: 14,
    solved: true
  },
  {
    id: 3,
    user: {
      name: "Morgan Lee",
      avatar: "/placeholder.svg",
      role: "Student"
    },
    channel: "English Literature",
    title: "Theme analysis in 'To Kill a Mockingbird'",
    content: "I'm writing an essay on the themes in 'To Kill a Mockingbird'. Has anyone analyzed the symbolism of the mockingbird in detail?",
    timestamp: "Yesterday",
    likes: 18,
    replies: 22,
    solved: false
  },
];

const activeUsers = [
  { id: 1, name: "Taylor Kim", avatar: "/placeholder.svg", status: "online", role: "Student" },
  { id: 2, name: "Jordan Smith", avatar: "/placeholder.svg", status: "online", role: "Teacher" },
  { id: 3, name: "Casey Brown", avatar: "/placeholder.svg", status: "online", role: "Student" },
  { id: 4, name: "Riley Johnson", avatar: "/placeholder.svg", status: "away", role: "Student" },
  { id: 5, name: "Quinn Davis", avatar: "/placeholder.svg", status: "online", role: "Teaching Assistant" },
];

const CommunityPage = () => {
  const [selectedChannel, setSelectedChannel] = useState(null);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Community</h1>
          <p className="text-muted-foreground">
            Connect with fellow students and teachers for discussions and collaborative learning
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Filter size={16} />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <MessageSquare size={16} />
            New Post
          </Button>
          <Button size="sm" className="gap-1">
            <UserPlus size={16} />
            Find People
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar with Channels */}
        <div className="w-full lg:w-64 shrink-0">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Channels</CardTitle>
                <Button variant="ghost" size="sm">
                  +
                </Button>
              </div>
              <div className="flex items-center space-x-1">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search channels..." 
                  className="h-8 w-full"
                />
              </div>
            </CardHeader>
            <CardContent className="pb-4 space-y-2">
              {discussionChannels.map((channel) => (
                <Button
                  key={channel.id}
                  variant={selectedChannel === channel.id ? "secondary" : "ghost"}
                  className="w-full justify-between"
                  onClick={() => setSelectedChannel(channel.id)}
                >
                  <span># {channel.name}</span>
                  {channel.unread > 0 && (
                    <Badge variant="secondary" className="ml-2 bg-primary text-primary-foreground">
                      {channel.unread}
                    </Badge>
                  )}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <Tabs defaultValue="discussions">
            <TabsList>
              <TabsTrigger value="discussions">Discussions</TabsTrigger>
              <TabsTrigger value="study-groups">Study Groups</TabsTrigger>
              <TabsTrigger value="questions">Q&A</TabsTrigger>
            </TabsList>
            
            {/* Discussions Tab */}
            <TabsContent value="discussions" className="space-y-4 pt-4">
              <div className="flex items-center space-x-2 mb-4">
                <Input placeholder="Search discussions..." />
                <Button variant="outline">Search</Button>
              </div>
              
              {discussionPosts.map((post) => (
                <Card key={post.id} className="mb-4">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={post.user.avatar} alt={post.user.name} />
                          <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{post.user.name}</span>
                            <Badge variant="outline">{post.user.role}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                        </div>
                      </div>
                      <Badge variant="outline">#{post.channel}</Badge>
                    </div>
                    <CardTitle className="text-lg mt-2">{post.title}</CardTitle>
                    {post.solved && (
                      <Badge className="bg-green-500 text-white">Solved</Badge>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{post.content}</p>
                    <div className="flex items-center space-x-4">
                      <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                        <ThumbsUp size={16} />
                        <span>{post.likes}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                        <MessageCircle size={16} />
                        <span>{post.replies} Replies</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                        <Flag size={16} />
                        Report
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button variant="outline" className="w-full">Load More</Button>
            </TabsContent>
            
            {/* Study Groups Tab */}
            <TabsContent value="study-groups">
              <div className="py-8 text-center">
                <h3 className="text-lg font-medium mb-2">Study Groups Coming Soon</h3>
                <p className="text-muted-foreground">
                  Create and join study groups for collaborative learning
                </p>
              </div>
            </TabsContent>
            
            {/* Q&A Tab */}
            <TabsContent value="questions">
              <div className="py-8 text-center">
                <h3 className="text-lg font-medium mb-2">Q&A Platform Coming Soon</h3>
                <p className="text-muted-foreground">
                  Ask and answer academic questions with your community
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Active Users Sidebar */}
        <div className="w-full lg:w-60 shrink-0">
          <Card>
            <CardHeader>
              <CardTitle>Active Now</CardTitle>
              <CardDescription>
                {activeUsers.filter(user => user.status === 'online').length} users online
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeUsers.map((user) => (
                <div key={user.id} className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${
                      user.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'
                    }`}></span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.role}</p>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full">
                View All
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Chat Input */}
      <Card className="mt-6">
        <CardContent className="p-4">
          <div className="flex space-x-2">
            <Input placeholder="Type your message..." className="flex-1" />
            <Button size="icon">
              <Send size={16} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityPage;
