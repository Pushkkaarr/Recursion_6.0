"use client";

import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs"; // Import Clerk's useUser hook
import { 
  BarChart, 
  Bar, 
  XAxis, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line,
  Tooltip,
  Legend
} from "recharts";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  CalendarDays, 
  BarChart2, 
  BookOpen, 
  Clock, 
  ChevronRight, 
  ArrowUpRight,
  Download,
  CheckCircle2,
  AlertCircle,
  X,
  Bell
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";

// Mock data with dynamic features
const generateActivityData = () => {
  const baseData = [
    { name: "Mon", progress: Math.floor(Math.random() * 40) + 30 },
    { name: "Tue", progress: Math.floor(Math.random() * 30) + 30 },
    { name: "Wed", progress: Math.floor(Math.random() * 40) + 40 },
    { name: "Thu", progress: Math.floor(Math.random() * 30) + 60 },
    { name: "Fri", progress: Math.floor(Math.random() * 20) + 60 },
    { name: "Sat", progress: Math.floor(Math.random() * 40) + 20 },
    { name: "Sun", progress: Math.floor(Math.random() * 30) + 10 },
  ];
  
  const totalHours = baseData.reduce((sum, day) => sum + (day.progress * 5 / 60), 0).toFixed(1);
  return { activityData: baseData, totalHours };
};

const { activityData: weeklyActivityData, totalHours } = generateActivityData();

const progressData = [
  { name: "Mathematics", value: 80, lastWeek: 72, color: "#4F46E5" },
  { name: "Science", value: 65, lastWeek: 59, color: "#06B6D4" },
  { name: "History", value: 45, lastWeek: 38, color: "#EC4899" },
  { name: "English", value: 92, lastWeek: 87, color: "#10B981" },
];

const generateUpcomingTasks = () => {
  const now = new Date();
  const today = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const friday = new Date(now);
  friday.setDate(now.getDate() + (5 - now.getDay() + 7) % 7);
  
  return [
    {
      id: 1,
      title: "Calculus Quiz",
      subject: "Mathematics",
      deadline: `Today, ${today.getHours() % 12 + 1}:00 ${today.getHours() >= 12 ? 'PM' : 'AM'}`,
      dueDate: today,
      type: "quiz",
      status: "pending",
      completed: false,
    },
    {
      id: 2,
      title: "Physics Lab Report",
      subject: "Science",
      deadline: `Tomorrow, 11:59 PM`,
      dueDate: tomorrow,
      type: "assignment",
      status: "in-progress",
      completed: false,
      progress: 65,
    },
    {
      id: 3,
      title: "Literature Essay",
      subject: "English",
      deadline: `Friday, 5:00 PM`,
      dueDate: friday,
      type: "assignment",
      status: "pending",
      completed: false,
    },
    {
      id: 4,
      title: "World War II Summary",
      subject: "History",
      deadline: `Completed`,
      dueDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      type: "assignment",
      status: "completed",
      completed: true,
      grade: "A-",
    },
  ];
};

const upcomingTasks = generateUpcomingTasks();
const pendingTasksCount = upcomingTasks.filter(task => !task.completed).length;

const recommendedCourses = [
  {
    id: 1,
    title: "Advanced Statistics",
    description: "Master probability, hypothesis testing, and regression analysis.",
    progress: 0,
    image: "https://images.unsplash.com/photo-1509869175650-a1d97972541a?auto=format&fit=crop&w=128&h=128&q=80",
    matchScore: 98,
    enrolled: false,
    duration: "8 weeks",
    difficulty: "Advanced",
    instructor: "Dr. Sarah Johnson",
  },
  {
    id: 2,
    title: "Creative Writing",
    description: "Learn storytelling techniques and narrative development.",
    progress: 0,
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=128&h=128&q=80",
    matchScore: 94,
    enrolled: false,
    duration: "6 weeks",
    difficulty: "Intermediate",
    instructor: "Prof. Michael Chen",
  },
  {
    id: 3,
    title: "Web Development",
    description: "Build responsive websites with HTML, CSS, and JavaScript.",
    progress: 0,
    image: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?auto=format&fit=crop&w=128&h=128&q=80",
    matchScore: 87,
    enrolled: false,
    duration: "10 weeks",
    difficulty: "Beginner to Intermediate",
    instructor: "Julia Rodriguez",
  },
];

// Performance data for report
const performanceData = [
  { month: 'Jan', hours: 62, assignments: 8, quizzes: 5 },
  { month: 'Feb', hours: 58, assignments: 7, quizzes: 4 },
  { month: 'Mar', hours: 75, assignments: 9, quizzes: 6 },
  { month: 'Apr', hours: 80, assignments: 10, quizzes: 7 },
  { month: 'May', hours: 77, assignments: 8, quizzes: 5 },
  { month: 'Jun', hours: 69, assignments: 7, quizzes: 4 },
];

const subjectNames = progressData.map(subject => subject.name);
const gradeDistribution = [
  { name: "A", value: 9 },
  { name: "B", value: 4 },
  { name: "C", value: 1 },
  { name: "D", value: 0 },
  { name: "F", value: 0 },
];

const COLORS = ['#10B981', '#4F46E5', '#EC4899', '#F59E0B', '#EF4444'];

const Index = () => {
  const { user } = useUser(); // Get the logged-in user from Clerk
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [currentTab, setCurrentTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [showNewActivity, setShowNewActivity] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [currentMonth, setCurrentMonth] = useState("March 2025");
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [enrollingCourse, setEnrollingCourse] = useState(null);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [reportGenerating, setReportGenerating] = useState(false);
  const [hasViewedActivity, setHasViewedActivity] = useState(false);
  const [localTasks, setLocalTasks] = useState(upcomingTasks);
  const [userProgress, setUserProgress] = useState(progressData);
  
  const reportRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    const progressTimer = setTimeout(() => {
      setAnimatedProgress(user?.unsafeMetadata?.completionRate || 87); // Default to 87 if not set
    }, 1500);

    const notificationTimer = setTimeout(() => {
      if (!hasViewedActivity) {
        setShowNewActivity(true);
        toast({
          title: "New Activity Available",
          description: "Your weekly learning summary is ready to view",
          duration: 5000,
        });
      }
    }, 8000);

    return () => {
      clearTimeout(timer);
      clearTimeout(progressTimer);
      clearTimeout(notificationTimer);
    };
  }, [hasViewedActivity, toast, user]);

  const handleCalendarClick = () => {
    setCalendarVisible(true);
    setTimeout(() => {
      setCalendarVisible(false);
      toast({
        title: "Calendar Updated",
        description: "Your calendar has been synced with your latest schedule",
      });
    }, 1200);
  };

  const handleViewReport = () => {
    setShowReportDialog(true);
    setHasViewedActivity(true);
    setShowNewActivity(false);
  };

  const handleDownloadReport = () => {
    setReportGenerating(true);
    
    setTimeout(() => {
      setReportGenerating(false);
      toast({
        title: "Report Downloaded",
        description: "Your performance report has been saved to your device",
      });
    }, 2000);
  };

  const handleTaskAction = (taskId, action) => {
    setLocalTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        if (action === 'complete') {
          toast({
            title: "Task Completed",
            description: `You've completed: ${task.title}`,
          });
          return { ...task, completed: true, status: "completed" };
        }
        if (action === 'start') {
          toast({
            description: `You've started working on: ${task.title}`,
          });
          return { ...task, status: "in-progress", progress: 0 };
        }
      }
      return task;
    }));
  };

  const handleCourseEnroll = (courseId) => {
    setEnrollingCourse(courseId);
    
    setTimeout(() => {
      toast({
        title: "Enrollment Successful",
        description: `You've been enrolled in the course. Check your email for details.`,
      });
      setEnrollingCourse(null);
    }, 1500);
  };

  const getFormattedDate = () => {
    const date = new Date();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  if (isLoading || !user) { // Show loading if user data isn't available yet
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 relative">
            <div className="absolute inset-0 rounded-full border-4 border-secondary opacity-25"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin"></div>
          </div>
          <p className="text-lg font-medium text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-8 space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 mb-1">
            <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">Spring 2025</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.fullName || user.firstName || "Student"}! Here's an overview of your learning journey.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1 relative overflow-hidden"
            onClick={handleCalendarClick}
          >
            <CalendarDays size={16} />
            <span>{currentMonth}</span>
            {calendarVisible && (
              <div className="absolute inset-0 bg-background flex items-center justify-center animate-fade-in">
                <span className="animate-pulse">Syncing...</span>
              </div>
            )}
          </Button>
          <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
            <DialogTrigger asChild>
              <Button 
                size="sm" 
                className="gap-1 relative"
                onClick={handleViewReport}
              >
                <BarChart2 size={16} />
                <span>View Reports</span>
                {showNewActivity && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full animate-pulse" />
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Performance Report</DialogTitle>
                <DialogDescription>
                  Detailed overview of your academic performance this semester
                </DialogDescription>
              </DialogHeader>
              <div className="py-4" ref={reportRef}>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-medium">Student: {user.fullName || user.firstName || "Student"}</h3>
                    <p className="text-sm text-muted-foreground">Program: {user.unsafeMetadata?.program || "Computer Science"} | ID: {user.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">GPA: {user.unsafeMetadata?.gpa || 3.8}</p>
                    <p className="text-sm text-muted-foreground">Semester: {user.unsafeMetadata?.currentSemester || "Spring 2025"}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Monthly Study Hours</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={performanceData}>
                            <XAxis dataKey="month" />
                            <Tooltip />
                            <Line type="monotone" dataKey="hours" stroke="#4F46E5" strokeWidth={2} dot={{ r: 4 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Grade Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px] flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={gradeDistribution}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              fill="#8884d8"
                              paddingAngle={5}
                              dataKey="value"
                              label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {gradeDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="md:col-span-2">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Subject Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {userProgress.map((subject) => (
                          <div key={subject.name}>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">{subject.name}</span>
                              <div className="text-sm">
                                <span className="font-medium">{subject.value}%</span>
                                <span className="text-xs text-muted-foreground ml-2">
                                  {subject.value > subject.lastWeek ? (
                                    <span className="text-emerald-500">▲ {subject.value - subject.lastWeek}%</span>
                                  ) : (
                                    <span className="text-red-500">▼ {subject.lastWeek - subject.value}%</span>
                                  )}
                                </span>
                              </div>
                            </div>
                            <div className="w-full bg-secondary rounded-full h-2">
                              <div
                                className="rounded-full h-2 transition-all duration-1000 ease-in-out"
                                style={{ width: `${subject.value}%`, backgroundColor: subject.color }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="md:col-span-2">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Completion Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-primary/5 rounded-lg p-4">
                          <p className="text-sm text-muted-foreground">Assignments Completed</p>
                          <p className="text-2xl font-bold">{performanceData.reduce((sum, month) => sum + month.assignments, 0)}</p>
                        </div>
                        <div className="bg-primary/5 rounded-lg p-4">
                          <p className="text-sm text-muted  text-muted-foreground">Quizzes Taken</p>
                          <p className="text-2xl font-bold">{performanceData.reduce((sum, month) => sum + month.quizzes, 0)}</p>
                        </div>
                        <div className="bg-primary/5 rounded-lg p-4">
                          <p className="text-sm text-muted-foreground">Total Study Hours</p>
                          <p className="text-2xl font-bold">{performanceData.reduce((sum, month) => sum + month.hours, 0)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="border-t mt-6 pt-4 flex justify-end">
                  <Button 
                    onClick={handleDownloadReport} 
                    disabled={reportGenerating}
                    className="gap-2"
                  >
                    {reportGenerating ? (
                      <>
                        <div className="h-4 w-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                        Generating PDF...
                      </>
                    ) : (
                      <>
                        <Download size={16} />
                        Download Report
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Avatar and Summary */}
      <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
        <Avatar className="h-16 w-16 border-2 border-primary/10">
          <AvatarImage src={user.imageUrl} alt={user.fullName || user.firstName || "Student"} />
          <AvatarFallback>{(user.fullName || user.firstName || "S").split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div className="space-y-1 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <h2 className="text-xl font-semibold">{user.fullName || user.firstName || "Student"}</h2>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">{user.unsafeMetadata?.program || "Computer Science"}</span>
              <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-full">GPA: {user.unsafeMetadata?.gpa || 3.8}</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Enrolled since {user.unsafeMetadata?.enrollmentDate || "September 2022"} • {user.unsafeMetadata?.totalCreditHours || 68} credit hours completed
          </p>
          
          <div className="flex flex-wrap gap-6 mt-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Completion Rate</p>
              <div className="w-full max-w-[200px] h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${animatedProgress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">{animatedProgress}% complete</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium">Current Streak</p>
              <div className="flex items-center gap-1">
                <div className="text-lg font-bold">{user.unsafeMetadata?.studyStreak || 14} days</div>
                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg
                    className="h-3 w-3 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    ></path>
                  </svg>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Keep up the momentum!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs for Content */}
      <Tabs defaultValue="overview" value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview" className="relative">
            Overview
            {(showNewActivity && currentTab !== "overview") && (
              <span className="absolute top-1 right-1 h-2 w-2 bg-primary rounded-full animate-pulse" />
            )}
          </TabsTrigger>
          <TabsTrigger value="tasks" className="relative">
            Tasks
            {pendingTasksCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-primary/10 text-primary">
                {pendingTasksCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6 animate-fade-in">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Courses in Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{user.unsafeMetadata?.inProgressCourses || 7}</div>
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <BookOpen size={20} className="text-primary" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-emerald-500">+2</span> courses since last month
                </p>
              </CardContent>
            </Card>
            <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Study Hours This Week
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{totalHours}</div>
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock size={20} className="text-primary" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-emerald-500">+3.5</span> hours compared to last week
                </p>
              </CardContent>
            </Card>
            <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Completion Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{user.unsafeMetadata?.completionRate || 87}%</div>
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <ArrowUpRight size={20} className="text-primary" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-emerald-500">+12%</span> from previous month
                </p>
              </CardContent>
            </Card>
            <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Current Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{user.unsafeMetadata?.studyStreak || 14} days</div>
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg
                      className="h-5 w-5 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 7l-5 5-5-5"
                      ></path>
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Keep it going!</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Learning Activity */}
            <Card className="lg:col-span-2 overflow-hidden transition-all duration-300 hover:shadow-md">
              <CardHeader>
                <CardTitle>Weekly Learning Activity</CardTitle>
                <CardDescription>Your study time and progress over the past week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyActivityData} margin={{ top: 5, right: 30, left: 20, bottom: 30 }}>
                      <XAxis dataKey="name" />
                      <Tooltip 
                        formatter={(value) => [`${value} points (${(value * 5 / 60).toFixed(1)} hours)`, 'Progress']}
                        labelFormatter={(label) => `${label}`}
                      />
                      <defs>
                        <linearGradient id="progressFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={1} />
                          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                        </linearGradient>
                      </defs>
                      <Bar 
                        dataKey="progress" 
                        fill="url(#progressFill)" 
                        radius={[4, 4, 0, 0]} 
                        animationDuration={1500}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Subject Progress */}
            <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
              <CardHeader>
                <CardTitle>Subject Performance</CardTitle>
                <CardDescription>Your progress across different subjects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userProgress.map((subject) => (
                    <div key={subject.name} className="group cursor-pointer hover:bg-secondary/50 p-2 rounded-lg transition-colors">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{subject.name}</span>
                        <div className="text-sm">
                          <span className="font-medium">{subject.value}%</span>
                          <span className="text-xs text-muted-foreground ml-2">
                            {subject.value > subject.lastWeek ? (
                              <span className="text-emerald-500">▲ {subject.value - subject.lastWeek}%</span>
                            ) : (
                              <span className="text-red-500">▼ {subject.lastWeek - subject.value}%</span>
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                        <div
                          className="rounded-full h-2 transition-all duration-1000 ease-in-out"
                          style={{ width: `${subject.value}%`, backgroundColor: subject.color }}
                        />
                      </div>
                      <div className="h-0 overflow-hidden group-hover:h-auto group-hover:mt-2 transition-all duration-300">
                        <p className="text-xs text-muted-foreground">
                          {subject.value >= 80 ? "Excellent progress! Keep up the great work." : 
                           subject.value >= 60 ? "Good progress. Continue your efforts to improve." :
                           "More practice needed. Consider seeking additional help."}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="tasks" className="animate-fade-in">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Upcoming Tasks & Assignments</CardTitle>
                  <CardDescription>Track your deadlines and progress</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-1">
                  <Bell size={16} />
                  Notifications
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {localTasks.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                  <h3 className="font-medium text-lg">All caught up!</h3>
                  <p className="text-muted-foreground">You have no pending tasks right now.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {localTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`relative p-4 rounded-lg border transition-all duration-300 ${
                        task.completed 
                          ? 'border-emerald-200 bg-emerald-50/30' 
                          : activeTaskId === task.id
                            ? 'border-primary bg-primary/5 shadow-sm'
                            : 'border-border hover:border-primary/50 hover:bg-accent/50'
                      }`}
                      onClick={() => task.completed ? null : setActiveTaskId(task.id === activeTaskId ? null : task.id)}
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex gap-3 items-start">
                          <div
                            className={`h-10 w-10 rounded-full flex items-center justify-center ${
                              task.completed
                                ? 'bg-emerald-500/10 text-emerald-500'
                                : task.type === 'quiz'
                                  ? 'bg-blue-500/10 text-blue-500'
                                  : 'bg-purple-500/10 text-purple-500'
                            }`}
                          >
                            {task.completed ? (
                              <CheckCircle2 size={20} />
                            ) : task.type === 'quiz' ? (
                              <svg
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                                ></path>
                              </svg>
                            ) : (
                              <svg
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                ></path>
                              </svg>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center">
                              <p className={`font-medium ${task.completed ? 'text-muted-foreground' : ''}`}>
                                {task.title}
                              </p>
                              {task.status === "in-progress" && (
                                <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-blue-500/10 text-blue-500">
                                  In Progress
                                </span>
                              )}
                              {task.completed && task.grade && (
                                <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-emerald-500/10 text-emerald-500">
                                  Grade: {task.grade}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{task.subject}</p>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {task.completed ? "Completed" : task.deadline}
                        </div>
                      </div>
                      
                      {task.status === "in-progress" && task.progress !== undefined && (
                        <div className="mt-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Progress</span>
                            <span>{task.progress}%</span>
                          </div>
                          <Progress value={task.progress} className="h-1.5" />
                        </div>
                      )}
                      
                      {activeTaskId === task.id && !task.completed && (
                        <div className="mt-4 pt-3 border-t flex justify-end gap-2">
                          {task.status !== "in-progress" && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTaskAction(task.id, 'start');
                              }}
                            >
                              Start Working
                            </Button>
                          )}
                          <Button 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTaskAction(task.id, 'complete');
                            }}
                          >
                            Mark as Complete
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="courses" className="animate-fade-in">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Courses</CardTitle>
                <CardDescription>Courses you're currently enrolled in</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg border p-4 flex flex-col sm:flex-row gap-4">
                  <div className="h-24 sm:w-24 rounded-md overflow-hidden flex-shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=128&h=128&q=80"
                      alt="Discrete Mathematics"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <h3 className="font-semibold">Discrete Mathematics</h3>
                      <span className="px-2 py-0.5 text-xs bg-blue-500/10 text-blue-500 rounded-full">In Progress</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">Study of mathematical structures that are discrete rather than continuous.</p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Course Progress</span>
                        <span>64%</span>
                      </div>
                      <Progress value={64} className="h-1.5" />
                    </div>
                  </div>
                </div>
                
                <div className="rounded-lg border p-4 flex flex-col sm:flex-row gap-4">
                  <div className="h-24 sm:w-24 rounded-md overflow-hidden flex-shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1581089781785-603411fa81e5?auto=format&fit=crop&w=128&h=128&q=80"
                      alt="Algorithm Design"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <h3 className="font-semibold">Algorithm Design</h3>
                      <span className="px-2 py-0.5 text-xs bg-blue-500/10 text-blue-500 rounded-full">In Progress</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">Techniques for creating efficient solutions to computational problems.</p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Course Progress</span>
                        <span>72%</span>
                      </div>
                      <Progress value={72} className="h-1.5" />
                    </div>
                  </div>
                </div>
                
                <Button className="w-full" variant="outline">View All Courses</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recommended for You</CardTitle>
                  <CardDescription>Personalized course recommendations</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="gap-1">
                  View All
                  <ChevronRight size={16} />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendedCourses.map((course) => (
                    <div
                      key={course.id}
                      className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg border border-border hover:border-primary/20 hover:bg-accent/30 transition-all duration-300"
                    >
                      <div className="relative h-24 sm:w-24 rounded-md overflow-hidden flex-shrink-0 bg-secondary/50">
                        <img
                          src={course.image}
                          alt={course.title}
                          className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                        <div className="absolute top-0 right-0 px-1.5 py-0.5 text-xs rounded-bl-md bg-primary/90 text-white">
                          {course.matchScore}% Match
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{course.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {course.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="px-2 py-0.5 text-xs rounded-full bg-secondary text-secondary-foreground">
                            {course.duration}
                          </span>
                          <span className="px-2 py-0.5 text-xs rounded-full bg-secondary text-secondary-foreground">
                            {course.difficulty}
                          </span>
                          <span className="px-2 py-0.5 text-xs rounded-full bg-secondary text-secondary-foreground">
                            {course.instructor}
                          </span>
                        </div>
                        <Button 
                          size="sm" 
                          variant="default" 
                          className="w-full justify-center text-xs"
                          onClick={() => handleCourseEnroll(course.id)}
                          disabled={enrollingCourse === course.id}
                        >
                          {enrollingCourse === course.id ? (
                            <>
                              <div className="h-3 w-3 mr-1 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                              Enrolling...
                            </>
                          ) : "Enroll Now"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;