"use client";

import QuestionScanner from "@/components/QuestionScanner";
import { useState, useEffect } from "react";
import { Calendar, Clock, ChevronRight, Plus, Trash, Edit, Check, X, ArrowDown, ArrowUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format, addDays } from "date-fns";

// Mock data structure for the weekly schedule
const initialWeeklySchedule = [
  {
    day: "Monday",
    sessions: [
      { id: "m1", subject: "Mathematics", topic: "Calculus Integration", time: "10:00 AM - 11:30 AM", priority: "high" },
      { id: "m2", subject: "Science", topic: "Physics Lab Preparation", time: "2:00 PM - 3:30 PM", priority: "medium" },
    ]
  },
  {
    day: "Tuesday",
    sessions: [
      { id: "t1", subject: "English", topic: "Literature Essay Draft", time: "9:00 AM - 10:30 AM", priority: "medium" },
      { id: "t2", subject: "History", topic: "Research Project", time: "1:00 PM - 2:30 PM", priority: "low" },
    ]
  },
  {
    day: "Wednesday",
    sessions: [
      { id: "w1", subject: "Mathematics", topic: "Problem Solving Session", time: "11:00 AM - 12:30 PM", priority: "high" },
      { id: "w2", subject: "Science", topic: "Lab Report Writing", time: "3:00 PM - 4:30 PM", priority: "high" },
    ]
  },
  {
    day: "Thursday",
    sessions: [
      { id: "th1", subject: "English", topic: "Essay Review", time: "10:00 AM - 11:00 AM", priority: "medium" },
      { id: "th2", subject: "History", topic: "Document Analysis", time: "2:00 PM - 3:00 PM", priority: "medium" },
    ]
  },
  {
    day: "Friday",
    sessions: [
      { id: "f1", subject: "Mathematics", topic: "Quiz Preparation", time: "9:00 AM - 10:30 AM", priority: "high" },
      { id: "f2", subject: "Science", topic: "Final Lab Review", time: "1:00 PM - 2:30 PM", priority: "high" },
    ]
  },
  {
    day: "Saturday",
    sessions: [
      { id: "sa1", subject: "General", topic: "Review Session", time: "10:00 AM - 12:00 PM", priority: "medium" },
    ]
  },
  {
    day: "Sunday",
    sessions: [
      { id: "su1", subject: "Rest Day", topic: "Light Reading", time: "Flexible", priority: "low" },
    ]
  },
];

// Mock data for the upcoming deadlines
const initialDeadlines = [
  {
    id: "d1",
    title: "Calculus Quiz",
    subject: "Mathematics",
    date: format(addDays(new Date(), 2), "MMMM d, yyyy"),
    remainingDays: 2,
    completed: false,
  },
  {
    id: "d2",
    title: "Physics Lab Report",
    subject: "Science",
    date: format(addDays(new Date(), 5), "MMMM d, yyyy"),
    remainingDays: 5,
    completed: false,
  },
  {
    id: "d3",
    title: "Literature Essay",
    subject: "English",
    date: format(addDays(new Date(), 7), "MMMM d, yyyy"),
    remainingDays: 7,
    completed: false,
  },
];

// Available subjects for dropdown selection
const subjects = [
  "Mathematics", 
  "Science", 
  "English", 
  "History", 
  "Computer Science",
  "Art",
  "Physical Education",
  "Music",
  "Foreign Language",
  "General"
];

// Time slots for the schedule
const timeSlots = [
  "8:00 AM - 9:30 AM",
  "9:00 AM - 10:30 AM",
  "10:00 AM - 11:30 AM",
  "11:00 AM - 12:30 PM",
  "1:00 PM - 2:30 PM",
  "2:00 PM - 3:30 PM",
  "3:00 PM - 4:30 PM",
  "4:00 PM - 5:30 PM",
  "5:00 PM - 6:30 PM",
  "7:00 PM - 8:30 PM",
  "Flexible"
];

// Component for the study planner
const StudyPlanPage = () => {
  // State management for schedule and deadlines
  const [weeklySchedule, setWeeklySchedule] = useState(initialWeeklySchedule);
  const [deadlines, setDeadlines] = useState(initialDeadlines);
  const [isLoading, setIsLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(format(new Date(), "MMMM yyyy"));
  
  // Form state for adding/editing sessions
  const [editingSession, setEditingSession] = useState(null);
  const [newSession, setNewSession] = useState({
    subject: "",
    topic: "",
    time: "",
    priority: "medium",
    day: ""
  });
  
  // Form state for adding/editing deadlines
  const [editingDeadline, setEditingDeadline] = useState(null);
  const [newDeadline, setNewDeadline] = useState({
    title: "",
    subject: "",
    date: "",
    remainingDays: 0
  });
  
  // For drag and drop functionality
  const [draggedSession, setDraggedSession] = useState(null);
  const [dragOverDay, setDragOverDay] = useState(null);

  // Simulate loading data from API
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Function to add a new study session
  const handleAddSession = () => {
    if (!newSession.subject || !newSession.topic || !newSession.time || !newSession.day) {
      toast.error("Please fill all required fields");
      return;
    }

    const updatedSchedule = [...weeklySchedule];
    const dayIndex = updatedSchedule.findIndex(d => d.day === newSession.day);
    
    if (dayIndex !== -1) {
      updatedSchedule[dayIndex].sessions.push({
        id: `${newSession.day.toLowerCase().substring(0, 2)}${Date.now()}`,
        subject: newSession.subject,
        topic: newSession.topic,
        time: newSession.time,
        priority: newSession.priority
      });
      
      setWeeklySchedule(updatedSchedule);
      setNewSession({
        subject: "",
        topic: "",
        time: "",
        priority: "medium",
        day: ""
      });
      
      toast.success("Study session added successfully");
    }
  };

  // Function to update an existing study session
  const handleUpdateSession = () => {
    if (!editingSession) return;
    
    const updatedSchedule = [...weeklySchedule];
    const dayIndex = updatedSchedule.findIndex(d => d.day === editingSession.day);
    
    if (dayIndex !== -1) {
      const sessionIndex = updatedSchedule[dayIndex].sessions.findIndex(s => s.id === editingSession.id);
      
      if (sessionIndex !== -1) {
        updatedSchedule[dayIndex].sessions[sessionIndex] = {
          id: editingSession.id,
          subject: newSession.subject,
          topic: newSession.topic,
          time: newSession.time,
          priority: newSession.priority
        };
        
        setWeeklySchedule(updatedSchedule);
        setEditingSession(null);
        setNewSession({
          subject: "",
          topic: "",
          time: "",
          priority: "medium",
          day: ""
        });
        
        toast.success("Study session updated successfully");
      }
    }
  };

  // Function to delete a study session
  const handleDeleteSession = (day, sessionId) => {
    const updatedSchedule = [...weeklySchedule];
    const dayIndex = updatedSchedule.findIndex(d => d.day === day);
    
    if (dayIndex !== -1) {
      updatedSchedule[dayIndex].sessions = updatedSchedule[dayIndex].sessions.filter(s => s.id !== sessionId);
      setWeeklySchedule(updatedSchedule);
      toast.success("Study session removed");
    }
  };

  // Function to handle editing a session
  const handleEditSession = (day, session) => {
    setEditingSession({ ...session, day });
    setNewSession({
      subject: session.subject,
      topic: session.topic,
      time: session.time,
      priority: session.priority,
      day: day
    });
  };

  // Function to add a new deadline
  const handleAddDeadline = () => {
    if (!newDeadline.title || !newDeadline.subject || !newDeadline.date) {
      toast.error("Please fill all required fields");
      return;
    }

    // Calculate remaining days
    const today = new Date();
    const deadlineDate = new Date(newDeadline.date);
    const diffTime = Math.abs(deadlineDate - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const newDeadlineItem = {
      id: `d${Date.now()}`,
      title: newDeadline.title,
      subject: newDeadline.subject,
      date: format(new Date(newDeadline.date), "MMMM d, yyyy"),
      remainingDays: diffDays,
      completed: false
    };

    setDeadlines([...deadlines, newDeadlineItem]);
    setNewDeadline({
      title: "",
      subject: "",
      date: "",
      remainingDays: 0
    });
    
    toast.success("Deadline added successfully");
  };

  // Function to update an existing deadline
  const handleUpdateDeadline = () => {
    if (!editingDeadline) return;
    
    // Calculate remaining days
    const today = new Date();
    const deadlineDate = new Date(newDeadline.date);
    const diffTime = Math.abs(deadlineDate - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const updatedDeadlines = deadlines.map(deadline => 
      deadline.id === editingDeadline.id 
        ? {
            ...deadline,
            title: newDeadline.title,
            subject: newDeadline.subject,
            date: format(new Date(newDeadline.date), "MMMM d, yyyy"),
            remainingDays: diffDays
          }
        : deadline
    );
    
    setDeadlines(updatedDeadlines);
    setEditingDeadline(null);
    setNewDeadline({
      title: "",
      subject: "",
      date: "",
      remainingDays: 0
    });
    
    toast.success("Deadline updated successfully");
  };

  // Function to delete a deadline
  const handleDeleteDeadline = (id) => {
    setDeadlines(deadlines.filter(deadline => deadline.id !== id));
    toast.success("Deadline removed");
  };

  // Function to handle editing a deadline
  const handleEditDeadline = (deadline) => {
    setEditingDeadline(deadline);
    setNewDeadline({
      title: deadline.title,
      subject: deadline.subject,
      date: deadline.date,
      remainingDays: deadline.remainingDays
    });
  };

  // Function to toggle deadline completion
  const toggleDeadlineCompletion = (id) => {
    const updatedDeadlines = deadlines.map(deadline => 
      deadline.id === id 
        ? { ...deadline, completed: !deadline.completed }
        : deadline
    );
    
    setDeadlines(updatedDeadlines);
    
    const deadline = deadlines.find(d => d.id === id);
    if (deadline) {
      if (!deadline.completed) {
        toast.success(`Marked "${deadline.title}" as completed`);
      } else {
        toast.info(`Marked "${deadline.title}" as incomplete`);
      }
    }
  };

  // Handlers for drag and drop functionality
  const handleDragStart = (e, session, day) => {
    setDraggedSession({ ...session, fromDay: day });
  };

  const handleDragOver = (e, day) => {
    e.preventDefault();
    setDragOverDay(day);
  };

  const handleDrop = (e, targetDay) => {
    e.preventDefault();
    
    if (!draggedSession || draggedSession.fromDay === targetDay) {
      setDraggedSession(null);
      setDragOverDay(null);
      return;
    }
    
    // Remove from original day
    const updatedSchedule = [...weeklySchedule];
    const sourceDayIndex = updatedSchedule.findIndex(d => d.day === draggedSession.fromDay);
    
    if (sourceDayIndex !== -1) {
      updatedSchedule[sourceDayIndex].sessions = updatedSchedule[sourceDayIndex].sessions.filter(
        s => s.id !== draggedSession.id
      );
      
      // Add to target day
      const targetDayIndex = updatedSchedule.findIndex(d => d.day === targetDay);
      
      if (targetDayIndex !== -1) {
        updatedSchedule[targetDayIndex].sessions.push({
          ...draggedSession,
          id: `${targetDay.toLowerCase().substring(0, 2)}${Date.now()}`
        });
        
        setWeeklySchedule(updatedSchedule);
        toast.success(`Moved to ${targetDay}`);
      }
    }
    
    setDraggedSession(null);
    setDragOverDay(null);
  };

  const handleDragEnd = () => {
    setDraggedSession(null);
    setDragOverDay(null);
  };

  // Function to handle priority change
  const handlePriorityChange = (sessionId, day, direction) => {
    const priorities = ["low", "medium", "high"];
    const updatedSchedule = [...weeklySchedule];
    const dayIndex = updatedSchedule.findIndex(d => d.day === day);
    
    if (dayIndex !== -1) {
      const sessionIndex = updatedSchedule[dayIndex].sessions.findIndex(s => s.id === sessionId);
      
      if (sessionIndex !== -1) {
        const currentPriority = updatedSchedule[dayIndex].sessions[sessionIndex].priority;
        const currentIndex = priorities.indexOf(currentPriority);
        let newIndex;
        
        if (direction === "up" && currentIndex < priorities.length - 1) {
          newIndex = currentIndex + 1;
        } else if (direction === "down" && currentIndex > 0) {
          newIndex = currentIndex - 1;
        } else {
          return;
        }
        
        updatedSchedule[dayIndex].sessions[sessionIndex].priority = priorities[newIndex];
        setWeeklySchedule(updatedSchedule);
        
        toast.success(`Priority updated to ${priorities[newIndex]}`);
      }
    }
  };

  // Sort deadlines by remaining days and completion status
  const sortedDeadlines = [...deadlines].sort((a, b) => {
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;
    return a.remainingDays - b.remainingDays;
  });

  return (
    <div className="space-y-6">
      {/* Header with title and actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Study Planner</h1>
          <p className="text-muted-foreground">
            Your AI-generated personalized study schedule based on your habits, quiz results, and availability.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Calendar size={16} />
                {currentMonth}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[240px] p-0" align="end">
              <div className="p-4 grid gap-2">
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    setCurrentMonth("June 2023");
                    toast.info("Changed to June 2023");
                  }}
                >
                  June 2023
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    setCurrentMonth("July 2023");
                    toast.info("Changed to July 2023");
                  }}
                >
                  July 2023
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    setCurrentMonth("August 2023");
                    toast.info("Changed to August 2023");
                  }}
                >
                  August 2023
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1">
                <Clock size={16} />
                Adjust Schedule
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Adjust Study Hours</DialogTitle>
                <DialogDescription>
                  Set your preferred study hours and we'll optimize your schedule accordingly.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="weekday-hours" className="text-right">
                    Weekday Hours
                  </Label>
                  <Input
                    id="weekday-hours"
                    defaultValue="4"
                    className="col-span-2"
                    type="number"
                    min="1"
                    max="12"
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="weekend-hours" className="text-right">
                    Weekend Hours
                  </Label>
                  <Input
                    id="weekend-hours"
                    defaultValue="2"
                    className="col-span-2"
                    type="number"
                    min="0"
                    max="8"
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="preferred-time" className="text-right">
                    Preferred Time
                  </Label>
                  <Select defaultValue="morning">
                    <SelectTrigger className="col-span-2">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning</SelectItem>
                      <SelectItem value="afternoon">Afternoon</SelectItem>
                      <SelectItem value="evening">Evening</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => toast.success("Study hours updated successfully")}>
                  Apply Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Schedule Card */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Weekly Study Schedule</CardTitle>
              <CardDescription>AI-optimized schedule based on your learning patterns and priorities</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="gap-1">
                  <Plus size={16} />
                  Add Session
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{editingSession ? "Edit Study Session" : "Add Study Session"}</DialogTitle>
                  <DialogDescription>
                    {editingSession 
                      ? "Update the details of your study session." 
                      : "Create a new session for your study schedule."}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="session-day" className="text-right">
                      Day
                    </Label>
                    <Select 
                      value={newSession.day}
                      onValueChange={(value) => setNewSession({...newSession, day: value})}
                      disabled={!!editingSession}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                      <SelectContent>
                        {weeklySchedule.map((day) => (
                          <SelectItem key={day.day} value={day.day}>
                            {day.day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="session-subject" className="text-right">
                      Subject
                    </Label>
                    <Select 
                      value={newSession.subject}
                      onValueChange={(value) => setNewSession({...newSession, subject: value})}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="session-topic" className="text-right">
                      Topic
                    </Label>
                    <Input
                      id="session-topic"
                      value={newSession.topic}
                      onChange={(e) => setNewSession({...newSession, topic: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="session-time" className="text-right">
                      Time
                    </Label>
                    <Select 
                      value={newSession.time}
                      onValueChange={(value) => setNewSession({...newSession, time: value})}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="session-priority" className="text-right">
                      Priority
                    </Label>
                    <Select 
                      value={newSession.priority}
                      onValueChange={(value) => setNewSession({...newSession, priority: value})}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  {editingSession ? (
                    <div className="flex w-full justify-between">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setEditingSession(null);
                          setNewSession({
                            subject: "",
                            topic: "",
                            time: "",
                            priority: "medium",
                            day: ""
                          });
                        }}
                      >
                        Cancel
                      </Button>
                      <div className="space-x-2">
                        <Button 
                          variant="destructive" 
                          onClick={() => {
                            handleDeleteSession(editingSession.day, editingSession.id);
                            setEditingSession(null);
                          }}
                        >
                          Delete
                        </Button>
                        <Button onClick={handleUpdateSession}>
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button onClick={handleAddSession}>Add Session</Button>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
            {isLoading ? (
              // Skeleton loading state
              Array(7).fill(0).map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="h-6 w-24 bg-muted rounded animate-pulse"></div>
                  <div className="space-y-2">
                    {Array(Math.floor(Math.random() * 2) + 1).fill(0).map((_, j) => (
                      <div key={j} className="p-3 rounded-lg border border-muted h-16 bg-muted/50 animate-pulse"></div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              weeklySchedule.map((day) => (
                <div 
                  key={day.day} 
                  className={cn(
                    "space-y-3 p-3 rounded-lg transition-all",
                    dragOverDay === day.day && "bg-accent/30 border border-dashed border-primary"
                  )}
                  onDragOver={(e) => handleDragOver(e, day.day)}
                  onDrop={(e) => handleDrop(e, day.day)}
                  onDragLeave={() => setDragOverDay(null)}
                >
                  <h3 className="font-semibold text-lg">{day.day}</h3>
                  <div className="space-y-2">
                    {day.sessions.map((session) => (
                      <div
                        key={session.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, session, day.day)}
                        onDragEnd={handleDragEnd}
                        className={cn(
                          "p-3 rounded-lg border transition-all",
                          session.priority === 'high'
                            ? 'border-red-200 bg-red-50 dark:bg-red-900/10'
                            : session.priority === 'medium'
                            ? 'border-amber-200 bg-amber-50 dark:bg-amber-900/10'
                            : 'border-green-200 bg-green-50 dark:bg-green-900/10',
                          draggedSession?.id === session.id && "opacity-50"
                        )}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{session.subject}</h4>
                            <p className="text-sm text-muted-foreground">{session.topic}</p>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="text-sm font-medium">{session.time}</div>
                            <div className="flex items-center mt-2 space-x-1">
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="h-6 w-6" 
                                onClick={() => handlePriorityChange(session.id, day.day, "up")}
                              >
                                <ArrowUp size={12} />
                              </Button>
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="h-6 w-6" 
                                onClick={() => handlePriorityChange(session.id, day.day, "down")}
                              >
                                <ArrowDown size={12} />
                              </Button>
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="h-6 w-6" 
                                onClick={() => handleEditSession(day.day, session)}
                              >
                                <Edit size={12} />
                              </Button>
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="h-6 w-6" 
                                onClick={() => handleDeleteSession(day.day, session.id)}
                              >
                                <Trash size={12} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {day.sessions.length === 0 && (
                      <div className="p-3 rounded-lg border border-dashed border-muted-foreground/30 text-center">
                        <p className="text-sm text-muted-foreground">No sessions scheduled</p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="mt-2"
                          onClick={() => {
                            setNewSession({
                              ...newSession,
                              day: day.day
                            });
                            document.querySelector("[data-state='closed'] button")?.click();
                          }}
                        >
                          <Plus size={14} className="mr-1" />
                          Add session
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            <div className="text-center text-sm text-muted-foreground mt-4">
              <p>Tip: Drag and drop sessions to reschedule to different days</p>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Deadlines Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Upcoming Deadlines</CardTitle>
              <CardDescription>Tasks and assessments that need your attention</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="gap-1">
                  <Plus size={16} />
                  Add Deadline
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{editingDeadline ? "Edit Deadline" : "Add Deadline"}</DialogTitle>
                  <DialogDescription>
                    {editingDeadline 
                      ? "Update the details of your deadline." 
                      : "Add a new deadline or assignment to track."}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="deadline-title" className="text-right">
                      Title
                    </Label>
                    <Input
                      id="deadline-title"
                      value={newDeadline.title}
                      onChange={(e) => setNewDeadline({...newDeadline, title: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="deadline-subject" className="text-right">
                      Subject
                    </Label>
                    <Select 
                      value={newDeadline.subject}
                      onValueChange={(value) => setNewDeadline({...newDeadline, subject: value})}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="deadline-date" className="text-right">
                      Due Date
                    </Label>
                    <Input
                      id="deadline-date"
                      type="date"
                      value={newDeadline.date}
                      onChange={(e) => setNewDeadline({...newDeadline, date: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  {editingDeadline ? (
                    <div className="flex w-full justify-between">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setEditingDeadline(null);
                          setNewDeadline({
                            title: "",
                            subject: "",
                            date: "",
                            remainingDays: 0
                          });
                        }}
                      >
                        Cancel
                      </Button>
                      <div className="space-x-2">
                        <Button 
                          variant="destructive" 
                          onClick={() => {
                            handleDeleteDeadline(editingDeadline.id);
                            setEditingDeadline(null);
                          }}
                        >
                          Delete
                        </Button>
                        <Button onClick={handleUpdateDeadline}>
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button onClick={handleAddDeadline}>Add Deadline</Button>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {isLoading ? (
                // Skeleton loading state
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="p-3 rounded-lg border border-muted h-20 bg-muted/50 animate-pulse"></div>
                ))
              ) : (
                sortedDeadlines.length > 0 ? (
                  sortedDeadlines.map((deadline) => (
                    <div
                      key={deadline.id}
                      className={cn(
                        "p-3 rounded-lg border border-border hover:bg-accent/30 transition-colors",
                        deadline.completed && "opacity-60"
                      )}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-start space-x-2">
                          <Checkbox 
                            checked={deadline.completed}
                            onCheckedChange={() => toggleDeadlineCompletion(deadline.id)}
                            className="mt-1"
                          />
                          <div>
                            <h4 className={cn("font-medium", deadline.completed && "line-through")}>{deadline.title}</h4>
                            <p className="text-sm text-muted-foreground">{deadline.subject}</p>
                          </div>
                        </div>
                        {!deadline.completed && (
                          <div className={`text-sm font-medium px-2 py-1 rounded-full ${
                            deadline.remainingDays <= 2
                              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                              : deadline.remainingDays <= 5
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                              : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                          }`}>
                            {deadline.remainingDays} days left
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-sm text-muted-foreground">{deadline.date}</p>
                        <div className="flex space-x-1">
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-6 w-6" 
                            onClick={() => handleEditDeadline(deadline)}
                          >
                            <Edit size={12} />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-6 w-6" 
                            onClick={() => handleDeleteDeadline(deadline.id)}
                          >
                            <Trash size={12} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-muted-foreground mb-4">No deadlines added yet</p>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        document.querySelector("[data-state='closed'] button")?.click();
                      }}
                    >
                      <Plus size={14} className="mr-1" />
                      Add Your First Deadline
                    </Button>
                  </div>
                )
              )}
            </div>

            {sortedDeadlines.length > 0 && (
              <div className="mt-6">
                <Button variant="outline" className="w-full justify-center" onClick={() => toast.info("Showing all deadlines")}>
                  View All Deadlines
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Study Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Personalized Study Tips</CardTitle>
          <CardDescription>Based on your learning patterns and performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <h3 className="font-medium mb-2">Focus on Calculus Integration</h3>
              <p className="text-sm text-muted-foreground">Your quiz results show you need more practice with integration techniques. We've scheduled extra time for this topic.</p>
            </div>
            <div className="p-4 rounded-lg bg-accent/50 border border-border">
              <h3 className="font-medium mb-2">Take breaks between Physics and Math</h3>
              <p className="text-sm text-muted-foreground">Your productivity metrics show that you perform better when alternating between these subjects with short breaks.</p>
            </div>
            <div className="p-4 rounded-lg bg-accent/50 border border-border">
              <h3 className="font-medium mb-2">Morning sessions for difficult topics</h3>
              <p className="text-sm text-muted-foreground">Based on your activity patterns, you focus better on challenging material during morning hours.</p>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Study Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Smart Study Planner & Smart Scan</CardTitle>
        </CardHeader>
        <CardContent>
          <QuestionScanner />
        </CardContent>
      </Card>
    </div>
  );
};

export default StudyPlanPage;
