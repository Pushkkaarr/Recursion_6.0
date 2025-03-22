"use client";

import { useState, useEffect, useRef } from 'react';
import { useUser } from "@clerk/nextjs"; // Import Clerk's useUser hook
import { BarChart, LineChart, PieChart, Bar, Line, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronDown, Download, Share2, Calendar, ClipboardCheck, Trophy, Clock } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

// Initial data (unchanged)
const initialPerformanceData = [
  { month: 'Jan', Mathematics: 34, Science: 56, English: 67, History: 30 },
  { month: 'Feb', Mathematics: 50, Science: 60, English: 73, History: 45 },
  { month: 'Mar', Mathematics: 55, Science: 69, English: 79, History: 59 },
  { month: 'Apr', Mathematics: 65, Science: 79, English: 85, History: 69 },
  { month: 'May', Mathematics: 75, Science: 85, English: 90, History: 76 },
  { month: 'Jun', Mathematics: 85, Science: 87, English: 90, History: 80 },
];

const initialTimeSpentData = [
  { subject: 'Mathematics', hours: 32 },
  { subject: 'Science', hours: 26 },
  { subject: 'English', hours: 18 },
  { subject: 'History', hours: 14 },
  { subject: 'Other', hours: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const initialQuizScoreData = [
  { quiz: 'Quiz 1', score: 75, average: 72 },
  { quiz: 'Quiz 2', score: 82, average: 76 },
  { quiz: 'Quiz 3', score: 78, average: 75 },
  { quiz: 'Quiz 4', score: 85, average: 78 },
  { quiz: 'Quiz 5', score: 90, average: 80 },
  { quiz: 'Quiz 6', score: 88, average: 82 },
];

const initialStrengthsAndWeaknesses = [
  { 
    strength: true, 
    topic: "Essay Writing", 
    subject: "English",
    description: "You consistently score above 90% in writing assignments.",
    recommendation: "Consider participating in essay competitions or the school newspaper."
  },
  { 
    strength: true, 
    topic: "Data Analysis", 
    subject: "Mathematics",
    description: "Your performance in statistical problems is exceptional.",
    recommendation: "Advanced statistics could be a good area to explore further."
  },
  { 
    strength: false, 
    topic: "Organic Chemistry", 
    subject: "Science",
    description: "Quiz results indicate difficulties with organic compounds and reactions.",
    recommendation: "Schedule additional practice sessions and utilize visual learning resources."
  },
  { 
    strength: false, 
    topic: "Historical Analysis", 
    subject: "History",
    description: "You struggle with connecting historical events and their implications.",
    recommendation: "Try creating timelines and cause-effect diagrams to visualize connections."
  },
];

// Helper function to generate a PDF-like report as an image
const generateReportImage = (canvas) => {
  const dataURL = canvas.toDataURL('image/png');
  return dataURL;
};

// Helper function to download the report
const downloadReport = (dataURL, filename) => {
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const AnalyticsPage = () => {
  const { user } = useUser(); // Get the logged-in user from Clerk

  // State for time period and student selection
  const [timePeriod, setTimePeriod] = useState("last6Months");
  const [performanceData, setPerformanceData] = useState(initialPerformanceData);
  const [timeSpentData, setTimeSpentData] = useState(initialTimeSpentData);
  const [quizScoreData, setQuizScoreData] = useState(initialQuizScoreData);
  const [strengthsAndWeaknesses, setStrengthsAndWeaknesses] = useState(initialStrengthsAndWeaknesses);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportImage, setReportImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [interactionCount, setInteractionCount] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState("all");
  
  const reportRef = useRef(null);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, []);

  // Simulate data changes based on selected time period
  useEffect(() => {
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      if (timePeriod === "last3Months") {
        setPerformanceData([
          { month: 'Apr', Mathematics: 65, Science: 79, English: 85, History: 69 },
          { month: 'May', Mathematics: 75, Science: 85, English: 90, History: 76 },
          { month: 'Jun', Mathematics: 85, Science: 87, English: 90, History: 80 },
        ]);
        
        setQuizScoreData([
          { quiz: 'Quiz 4', score: 85, average: 78 },
          { quiz: 'Quiz 5', score: 90, average: 80 },
          { quiz: 'Quiz 6', score: 88, average: 82 },
        ]);
      } else if (timePeriod === "lastYear") {
        const newPerformanceData = [
          { month: 'Jul', Mathematics: 30, Science: 50, English: 60, History: 25 },
          { month: 'Aug', Mathematics: 35, Science: 55, English: 65, History: 30 },
          { month: 'Sep', Mathematics: 40, Science: 60, English: 70, History: 35 },
          { month: 'Oct', Mathematics: 45, Science: 65, English: 75, History: 40 },
          { month: 'Nov', Mathematics: 50, Science: 70, English: 80, History: 45 },
          { month: 'Dec', Mathematics: 55, Science: 75, English: 85, History: 50 },
          ...initialPerformanceData
        ];
        setPerformanceData(newPerformanceData);
        
        const newQuizData = [
          { quiz: 'Quiz -5', score: 65, average: 62 },
          { quiz: 'Quiz -4', score: 68, average: 65 },
          { quiz: 'Quiz -3', score: 70, average: 68 },
          { quiz: 'Quiz -2', score: 72, average: 70 },
          { quiz: 'Quiz -1', score: 74, average: 71 },
          { quiz: 'Quiz 0', score: 72, average: 70 },
          ...initialQuizScoreData
        ];
        setQuizScoreData(newQuizData);
      } else {
        setPerformanceData(initialPerformanceData);
        setQuizScoreData(initialQuizScoreData);
      }
      
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [timePeriod]);

  // Effect to filter data based on selected subject
  useEffect(() => {
    if (selectedSubject === 'all') {
      setTimeSpentData(initialTimeSpentData);
    } else {
      const otherSubjects = initialTimeSpentData.filter(item => item.subject !== selectedSubject);
      const selectedSubjectData = initialTimeSpentData.find(item => item.subject === selectedSubject);
      
      if (selectedSubjectData) {
        const enhancedData = [
          { ...selectedSubjectData, hours: selectedSubjectData.hours * 1.2 },
          ...otherSubjects.map(subject => ({ ...subject, hours: subject.hours * 0.8 }))
        ];
        setTimeSpentData(enhancedData);
      }
    }
  }, [selectedSubject]);

  // Function to handle time period change
  const handleTimePeriodChange = (value) => {
    setTimePeriod(value);
    setInteractionCount(prev => prev + 1);
    toast.success(`Data updated for ${value === "last3Months" ? "Last 3 Months" : value === "lastYear" ? "Last Year" : "Last 6 Months"}`);
  };

  // Function to handle report generation
  const handleGenerateReport = () => {
    setIsGeneratingReport(true);
    setShowReportDialog(true);
    
    setTimeout(() => {
      if (reportRef.current) {
        html2canvas(reportRef.current).then((canvas) => {
          const reportImg = generateReportImage(canvas);
          setReportImage(reportImg);
          setIsGeneratingReport(false);
        });
      } else {
        setIsGeneratingReport(false);
        setReportImage("https://via.placeholder.com/800x600?text=Student+Performance+Report");
      }
    }, 2000);
  };

  // Function to download the report
  const handleDownloadReport = () => {
    if (reportImage) {
      downloadReport(reportImage, `${(user?.fullName || user?.firstName || "Student").replace(' ', '_')}_Performance_Report.png`);
      toast.success("Report downloaded successfully!");
    }
  };

  // Function to handle share button click
  const handleShareReport = () => {
    toast.success("Report link copied to clipboard!");
    navigator.clipboard.writeText(`https://your-school-domain.com/student/report/${user?.id}`);
  };

  // Function to simulate user interaction and data changes
  const simulateInteraction = () => {
    setInteractionCount(prev => prev + 1);
    
    if (interactionCount % 3 === 0) {
      const newPerformanceData = [...performanceData];
      const randomSubject = ["Mathematics", "Science", "English", "History"][Math.floor(Math.random() * 4)];
      const randomMonth = Math.floor(Math.random() * performanceData.length);
      
      newPerformanceData[randomMonth][randomSubject] = Math.min(100, Math.max(0, 
        newPerformanceData[randomMonth][randomSubject] + (Math.random() > 0.5 ? 2 : -2)
      ));
      
      setPerformanceData(newPerformanceData);
      toast.info(`New data point received for ${randomSubject}`);
    }
  };

  if (isLoading || !user) { // Show loading if user data isn't available yet
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 relative">
            <div className="absolute inset-0 rounded-full border-4 border-secondary opacity-25"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin"></div>
          </div>
          <p className="text-lg font-medium text-muted-foreground">Loading your analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto p-4 transition-all duration-500 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={user.imageUrl}
                alt={user.fullName || user.firstName || "Student"}
                className="w-14 h-14 rounded-full object-cover border-2 border-primary/20 hover:border-primary/80 transition-all duration-300"
              />
              <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{user.fullName || user.firstName || "Student"}'s Analytics</h1>
              <div className="flex items-center space-x-2 text-muted-foreground text-sm">
                <span>{user.unsafeMetadata?.grade || "10th Grade"}</span>
                <span>•</span>
                <span>{user.unsafeMetadata?.school || "Westlake High School"}</span>
                <span>•</span>
                <span>ID: {user.id}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1 relative overflow-hidden group">
                <Calendar size={16} className="transition-transform group-hover:scale-110" />
                <span>
                  {timePeriod === "last3Months" ? "Last 3 Months" : 
                   timePeriod === "lastYear" ? "Last Year" : "Last 6 Months"}
                </span>
                <ChevronDown size={16} className="transition-transform group-hover:rotate-180" />
                <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full"></div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-0 bg-white/80 backdrop-blur-sm border border-slate-200 shadow-lg rounded-lg">
              <div className="flex flex-col divide-y">
                <Button 
                  variant="ghost" 
                  className={`justify-start rounded-none py-2 px-4 ${timePeriod === "last3Months" ? "bg-primary/10" : ""}`}
                  onClick={() => handleTimePeriodChange("last3Months")}
                >
                  Last 3 Months
                </Button>
                <Button 
                  variant="ghost" 
                  className={`justify-start rounded-none py-2 px-4 ${timePeriod === "last6Months" ? "bg-primary/10" : ""}`}
                  onClick={() => handleTimePeriodChange("last6Months")}
                >
                  Last 6 Months
                </Button>
                <Button 
                  variant="ghost" 
                  className={`justify-start rounded-none py-2 px-4 ${timePeriod === "lastYear" ? "bg-primary/10" : ""}`}
                  onClick={() => handleTimePeriodChange("lastYear")}
                >
                  Last Year
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1 relative overflow-hidden group"
            onClick={handleGenerateReport}
          >
            <Download size={16} className="transition-transform group-hover:scale-110" />
            <span>Export Report</span>
            <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full"></div>
          </Button>
          
          <Button 
            size="sm" 
            className="gap-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white relative overflow-hidden"
            onClick={handleShareReport}
          >
            <div className="absolute inset-0 bg-white/10 rounded-md scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            <Share2 size={16} className="z-10" />
            <span className="z-10">Share Report</span>
          </Button>
        </div>
      </div>
      
      {/* Student overview stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="overflow-hidden group hover:shadow-md transition-all duration-300">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 transition-colors group-hover:bg-blue-200 dark:group-hover:bg-blue-800/40">
              <Trophy size={24} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Overall GPA</p>
              <h2 className="text-3xl font-bold">{user.unsafeMetadata?.overallGPA || 8.7}</h2>
              <p className="text-xs text-green-600">+0.2 from last semester</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden group hover:shadow-md transition-all duration-300">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 transition-colors group-hover:bg-green-200 dark:group-hover:bg-green-800/40">
              <ClipboardCheck size={24} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Attendance Rate</p>
              <h2 className="text-3xl font-bold">{user.unsafeMetadata?.attendance || 96.4}%</h2>
              <p className="text-xs text-green-600">Above school average</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden group hover:shadow-md transition-all duration-300">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 transition-colors group-hover:bg-orange-200 dark:group-hover:bg-orange-800/40">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Study Hours</p>
              <h2 className="text-3xl font-bold">{timeSpentData.reduce((acc, curr) => acc + curr.hours, 0)}</h2>
              <p className="text-xs text-green-600">+8 hours from last month</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab navigation */}
      <Tabs 
        defaultValue="overview" 
        className="w-full" 
        onValueChange={() => simulateInteraction()}
      >
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
          <TabsTrigger 
            value="overview"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground relative overflow-hidden transition-all duration-300 group"
          >
            <span className="relative z-10">Overview</span>
            <span className="absolute inset-0 bg-primary/10 transform origin-left scale-x-0 group-hover:scale-x-100 group-data-[state=active]:scale-x-0 transition-transform duration-300"></span>
          </TabsTrigger>
          <TabsTrigger 
            value="subjects"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground relative overflow-hidden transition-all duration-300 group"
          >
            <span className="relative z-10">Subject Analysis</span>
            <span className="absolute inset-0 bg-primary/10 transform origin-left scale-x-0 group-hover:scale-x-100 group-data-[state=active]:scale-x-0 transition-transform duration-300"></span>
          </TabsTrigger>
          <TabsTrigger 
            value="quizzes"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground relative overflow-hidden transition-all duration-300 group"
          >
            <span className="relative z-10">Quiz Performance</span>
            <span className="absolute inset-0 bg-primary/10 transform origin-left scale-x-0 group-hover:scale-x-100 group-data-[state=active]:scale-x-0 transition-transform duration-300"></span>
          </TabsTrigger>
          <TabsTrigger 
            value="time"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground relative overflow-hidden transition-all duration-300 group"
          >
            <span className="relative z-10">Time Management</span>
            <span className="absolute inset-0 bg-primary/10 transform origin-left scale-x-0 group-hover:scale-x-100 group-data-[state=active]:scale-x-0 transition-transform duration-300"></span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6 mt-6 transition-all duration-300">
          {isLoading ? (
            <div className="animate-pulse space-y-6">
              <Card>
                <CardHeader>
                  <div className="h-8 bg-slate-200 rounded w-1/3"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px] w-full bg-slate-200 rounded"></div>
                </CardContent>
              </Card>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <div className="h-8 bg-slate-200 rounded w-1/3"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="h-24 bg-slate-200 rounded w-full"></div>
                      <div className="h-24 bg-slate-200 rounded w-full"></div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <div className="h-8 bg-slate-200 rounded w-1/3"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="h-24 bg-slate-200 rounded w-full"></div>
                      <div className="h-24 bg-slate-200 rounded w-full"></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <>
              {/* Performance Trend */}
              <Card className="overflow-hidden transition-all duration-500 hover:shadow-md border-slate-200">
                <CardHeader className="bg-white/60 backdrop-blur-sm">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Performance Trend</CardTitle>
                      <CardDescription>Your progress in each subject over time</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select 
                        value={selectedSubject} 
                        onValueChange={(value) => {
                          setSelectedSubject(value);
                          simulateInteraction();
                        }}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="All Subjects" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Subjects</SelectItem>
                          <SelectItem value="Mathematics">Mathematics</SelectItem>
                          <SelectItem value="Science">Science</SelectItem>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="History">History</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 pt-4">
                  <div className="h-[350px] w-full transition-all duration-500">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={performanceData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            border: '1px solid #eaeaea',
                          }}
                          cursor={{ stroke: '#ddd', strokeWidth: 1 }}
                        />
                        <Legend 
                          wrapperStyle={{ paddingTop: 15 }}
                          onClick={(e) => {
                            setSelectedSubject(e.dataKey);
                            simulateInteraction();
                            toast.info(`Filtering by ${e.dataKey}`);
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="Mathematics" 
                          stroke="#8884d8" 
                          strokeWidth={selectedSubject === "all" || selectedSubject === "Mathematics" ? 3 : 1} 
                          dot={selectedSubject === "all" || selectedSubject === "Mathematics" ? { r: 4 } : { r: 2 }}
                          opacity={selectedSubject === "all" || selectedSubject === "Mathematics" ? 1 : 0.3}
                          animationDuration={1000}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="Science" 
                          stroke="#82ca9d" 
                          strokeWidth={selectedSubject === "all" || selectedSubject === "Science" ? 3 : 1}
                          dot={selectedSubject === "all" || selectedSubject === "Science" ? { r: 4 } : { r: 2 }}
                          opacity={selectedSubject === "all" || selectedSubject === "Science" ? 1 : 0.3}
                          animationDuration={1200}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="English" 
                          stroke="#ffc658" 
                          strokeWidth={selectedSubject === "all" || selectedSubject === "English" ? 3 : 1}
                          dot={selectedSubject === "all" || selectedSubject === "English" ? { r: 4 } : { r: 2 }}
                          opacity={selectedSubject === "all" || selectedSubject === "English" ? 1 : 0.3}
                          animationDuration={1400}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="History" 
                          stroke="#ff8042" 
                          strokeWidth={selectedSubject === "all" || selectedSubject === "History" ? 3 : 1}
                          dot={selectedSubject === "all" || selectedSubject === "History" ? { r: 4 } : { r: 2 }}
                          opacity={selectedSubject === "all" || selectedSubject === "History" ? 1 : 0.3}
                          animationDuration={1600}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Strengths and Weaknesses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-green-100 transition-all duration-300 hover:shadow-md">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-transparent">
                    <CardTitle>Strengths</CardTitle>
                    <CardDescription>Areas where you excel based on your performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {strengthsAndWeaknesses.filter(item => item.strength).map((item, index) => (
                        <div 
                          key={index} 
                          className="p-4 rounded-lg bg-green-50/50 backdrop-blur-sm border border-green-200 hover:shadow-sm hover:bg-green-50/80 transition-all duration-300"
                          onClick={() => {
                            toast.info(`Viewing details for ${item.topic}`);
                            simulateInteraction();
                          }}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{item.topic}</h3>
                              <p className="text-sm text-muted-foreground">{item.subject}</p>
                            </div>
                            <div className="bg-green-100 text-green-800 rounded-full px-2 py-0.5 text-xs font-medium">
                              Top 15%
                            </div>
                          </div>
                          <p className="text-sm mt-2">{item.description}</p>
                          <p className="text-sm font-medium mt-2 text-green-600 dark:text-green-400">Recommendation: {item.recommendation}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-red-100 transition-all duration-300 hover:shadow-md">
                  <CardHeader className="bg-gradient-to-r from-red-50 to-transparent">
                    <CardTitle>Areas for Improvement</CardTitle>
                    <CardDescription>Topics that need more attention based on your results</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {strengthsAndWeaknesses.filter(item => !item.strength).map((item, index) => (
                        <div 
                          key={index} 
                          className="p-4 rounded-lg bg-red-50/50 backdrop-blur-sm border border-red-200 hover:shadow-sm hover:bg-red-50/80 transition-all duration-300"
                          onClick={() => {
                            toast.info(`Viewing improvement plan for ${item.topic}`);
                            simulateInteraction();
                          }}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{item.topic}</h3>
                              <p className="text-sm text-muted-foreground">{item.subject}</p>
                            </div>
                            <div className="bg-red-100 text-red-800 rounded-full px-2 py-0.5 text-xs font-medium">
                              Needs Focus
                            </div>
                          </div>
                          <p className="text-sm mt-2">{item.description}</p>
                          <p className="text-sm font-medium mt-2 text-red-600 dark:text-red-400">Recommendation: {item.recommendation}</p>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="w-full mt-2 text-center justify-center text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 mt-3"
                            onClick={(e) => {
                              e.stopPropagation();
                              toast.success(`Practice resources for ${item.topic} will be sent to your email`);
                              simulateInteraction();
                            }}
                          >
                            Get Practice Resources
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Recent Activity */}
              <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest academic activities and achievements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(user.unsafeMetadata?.recentActivity || [
                      { date: "2023-11-02", action: "Completed Science Quiz 6", score: "88/100" },
                      { date: "2023-10-30", action: "Submitted History Essay", status: "Pending" },
                      { date: "2023-10-27", action: "Mathematics Test", score: "92/100" },
                      { date: "2023-10-25", action: "English Presentation", score: "A-" },
                    ]).map((activity, index) => (
                      <div 
                        key={index} 
                        className="flex items-center p-3 border rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                        onClick={() => {
                          toast.info(`Viewing details for activity on ${activity.date}`);
                          simulateInteraction();
                        }}
                      >
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                          <span className="text-primary font-bold">
                            {new Date(activity.date).getDate()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{activity.action}</h3>
                          <p className="text-sm text-muted-foreground">{new Date(activity.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                        {activity.score && (
                          <div className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-sm font-medium">
                            {activity.score}
                          </div>
                        )}
                        {activity.status && (
                          <div className="bg-yellow-100 text-yellow-800 py-1 px-3 rounded-full text-sm font-medium">
                            {activity.status}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="subjects" className="space-y-6 mt-6 transition-all duration-300">
          {isLoading ? (
            <div className="animate-pulse">
              <Card>
                <CardHeader>
                  <div className="h-8 bg-slate-200 rounded w-1/3"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px] w-full bg-slate-200 rounded"></div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <>
              <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
                <CardHeader className="bg-white/60 backdrop-blur-sm">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Subject Distribution</CardTitle>
                      <CardDescription>How you've divided your time across subjects</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select 
                        value={selectedSubject} 
                        onValueChange={(value) => {
                          setSelectedSubject(value);
                          simulateInteraction();
                        }}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="All Subjects" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Subjects</SelectItem>
                          <SelectItem value="Mathematics">Mathematics</SelectItem>
                          <SelectItem value="Science">Science</SelectItem>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="History">History</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="h-[350px] w-full md:w-1/2">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={timeSpentData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="hours"
                          label={({ subject, percent }) => `${subject}: ${(percent * 100).toFixed(0)}%`}
                          animationBegin={0}
                          animationDuration={1500}
                          className="hover:opacity-95 transition-opacity"
                        >
                          {timeSpentData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]} 
                              className="transition-all duration-500"
                              opacity={selectedSubject === "all" || selectedSubject === entry.subject ? 1 : 0.6}
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            border: '1px solid #eaeaea',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="w-full md:w-1/2 space-y-6">
                    <h3 className="text-lg font-medium">Subject Breakdown</h3>
                    
                    <div className="space-y-4">
                      {timeSpentData.map((subject, index) => (
                        <div 
                          key={index}
                          className={`space-y-2 p-3 rounded-lg transition-all duration-300 ${
                            selectedSubject === subject.subject ? 'bg-blue-50 border border-blue-200' : ''
                          }`}
                          onClick={() => {
                            setSelectedSubject(subject.subject === selectedSubject ? "all" : subject.subject);
                            simulateInteraction();
                          }}
                        >
                          <div className="flex justify-between">
                            <span className="font-medium flex items-center">
                              <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                              {subject.subject}
                            </span>
                            <span>{subject.hours} hours</span>
                          </div>
                          <Progress 
                            value={subject.hours / timeSpentData.reduce((acc, curr) => Math.max(acc, curr.hours), 0) * 100} 
                            className="h-2 w-full" 
                            style={{ backgroundColor: `${COLORS[index % COLORS.length]}20` }}
                            indicatorColor={COLORS[index % COLORS.length]} 
                          />
                          {selectedSubject === subject.subject && (
                            <div className="text-sm animate-fade-in">
                              <p className="font-medium mt-2">Performance Correlation:</p>
                              <p className="text-muted-foreground">
                                {subject.subject === "Mathematics" 
                                  ? "Your time investment in Mathematics correlates strongly with your improving test scores."
                                  : subject.subject === "Science" 
                                  ? "Consider increasing study time for Science to improve in Organic Chemistry."
                                  : subject.subject === "English"
                                  ? "Your time investment in English is very efficient, yielding high returns."
                                  : subject.subject === "History"
                                  ? "More time needed on Historical Analysis concepts."
                                  : "Consider focusing more on core subjects by reducing time here."}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full mt-4"
                      onClick={() => {
                        toast.success("Time optimization suggestions have been generated!");
                        simulateInteraction();
                      }}
                    >
                      Generate Time Optimization Plan
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="transition-all duration-300 hover:shadow-md">
                  <CardHeader>
                    <CardTitle>Subject Performance</CardTitle>
                    <CardDescription>Latest assessment results by subject</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {performanceData[performanceData.length - 1] && Object.entries(performanceData[performanceData.length - 1])
                        .filter(([key]) => key !== "month")
                        .sort(([,a], [,b]) => b - a)
                        .map(([subject, score], index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{subject}</span>
                              <span className="text-sm font-medium">
                                {score}/100
                                <span className={`ml-2 text-xs ${
                                  performanceData.length > 1 && performanceData[performanceData.length - 2][subject] < score
                                    ? 'text-green-600'
                                    : performanceData.length > 1 && performanceData[performanceData.length - 2][subject] > score
                                    ? 'text-red-600'
                                    : 'text-gray-500'
                                }`}>
                                  {performanceData.length > 1 
                                    ? (performanceData[performanceData.length - 2][subject] < score 
                                      ? `↑ ${(score - performanceData[performanceData.length - 2][subject]).toFixed(1)}`
                                      : performanceData[performanceData.length - 2][subject] > score
                                      ? `↓ ${(performanceData[performanceData.length - 2][subject] - score).toFixed(1)}`
                                      : '–') 
                                    : ''}
                                </span>
                              </span>
                            </div>
                            <div className="w-full relative h-2 bg-secondary rounded-full overflow-hidden">
                              <div 
                                className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000" 
                                style={{ 
                                  width: `${score}%`,
                                  backgroundColor: COLORS[index % COLORS.length] 
                                }}
                              ></div>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {score >= 90 ? "Excellent" : 
                               score >= 80 ? "Very Good" : 
                               score >= 70 ? "Good" : 
                               score >= 60 ? "Satisfactory" : "Needs Improvement"}
                            </p>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="transition-all duration-300 hover:shadow-md">
                  <CardHeader>
                    <CardTitle>Recommended Focus Areas</CardTitle>
                    <CardDescription>Based on recent performance analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 border rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">Chemistry Formula Practice</h3>
                          <span className="bg-red-100 text-red-800 py-0.5 px-2 rounded-full text-xs font-medium">High Priority</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Focus on organic chemistry formulas and reactions</p>
                        <Button 
                          variant="link" 
                          className="text-blue-600 h-auto p-0 mt-1"
                          onClick={() => {
                            toast.success("Chemistry practice materials sent to your email!");
                            simulateInteraction();
                          }}
                        >
                          Get Practice Materials
                        </Button>
                      </div>
                      
                      <div className="p-3 border rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">Historical Timelines</h3>
                          <span className="bg-orange-100 text-orange-800 py-0.5 px-2 rounded-full text-xs font-medium">Medium Priority</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Create cause-effect diagrams for key historical events</p>
                        <Button 
                          variant="link" 
                          className="text-blue-600 h-auto p-0 mt-1"
                          onClick={() => {
                            toast.success("History study guide generated!");
                            simulateInteraction();
                          }}
                        >
                          Access Study Guide
                        </Button>
                      </div>
                      
                      <div className="p-3 border rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">Advanced Algebra</h3>
                          <span className="bg-green-100 text-green-800 py-0.5 px-2 rounded-full text-xs font-medium">Enhancement</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Continue excelling with more challenging problems</p>
                        <Button 
                          variant="link" 
                          className="text-blue-600 h-auto p-0 mt-1"
                          onClick={() => {
                            toast.success("Advanced algebra problems unlocked!");
                            simulateInteraction();
                          }}
                        >
                          Challenge Yourself
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="quizzes" className="space-y-6 mt-6 transition-all duration-300">
          {isLoading ? (
            <div className="animate-pulse">
              <Card>
                <CardHeader>
                  <div className="h-8 bg-slate-200 rounded w-1/3"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px] w-full bg-slate-200 rounded"></div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <>
              <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
                <CardHeader className="bg-white/60 backdrop-blur-sm">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Quiz Performance</CardTitle>
                      <CardDescription>Your quiz scores compared to class average</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select 
                        value={selectedSubject} 
                        onValueChange={(value) => {
                          setSelectedSubject(value);
                          simulateInteraction();
                        }}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="All Subjects" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Subjects</SelectItem>
                          <SelectItem value="Mathematics">Mathematics</SelectItem>
                          <SelectItem value="Science">Science</SelectItem>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="History">History</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 pt-4">
                  <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={quizScoreData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="quiz" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip 
                          cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            border: '1px solid #eaeaea',
                          }}
                        />
                        <Legend 
                          wrapperStyle={{ paddingTop: 15 }}
                          onClick={() => simulateInteraction()}
                        />
                        <Bar 
                          name="Your Score" 
                          dataKey="score" 
                          fill="#8884d8"
                          animationDuration={1500}
                          animationBegin={0}
                        >
                          {quizScoreData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.score > entry.average ? '#8884d8' : '#d88884'} 
                              className="hover:opacity-80 transition-opacity"
                              cursor="pointer"
                              onClick={() => {
                                toast.info(`Viewing detailed breakdown for ${entry.quiz}`);
                                simulateInteraction();
                              }}
                            />
                          ))}
                        </Bar>
                        <Bar 
                          name="Class Average" 
                          dataKey="average" 
                          fill="#82ca9d"
                          animationDuration={1500}
                          animationBegin={300}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="transition-all duration-300 hover:shadow-md">
                  <CardHeader>
                    <CardTitle>Quiz Trend Analysis</CardTitle>
                    <CardDescription>How your performance has evolved over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Overall Progress</h3>
                        <span className="text-green-600 font-medium text-sm">↑ Improving</span>
                      </div>
                      <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={quizScoreData}
                            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                          >
                            <XAxis dataKey="quiz" />
                            <YAxis domain={[60, 100]} />
                            <Tooltip />
                            <Line type="monotone" dataKey="score" stroke="#8884d8" strokeWidth={2} dot={{ strokeWidth: 2 }} />
                            <Line type="monotone" dataKey="average" stroke="#82ca9d" strokeWidth={2} dot={{ strokeWidth: 2 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <div className="p-3 border rounded-lg bg-blue-50/50">
                        <h3 className="font-medium">Performance Insights</h3>
                        <p className="text-sm text-muted-foreground mt-1">Your quiz scores show a positive trend, with a 15-point improvement from Quiz 1 to Quiz 5. You're consistently performing above the class average, with the gap widening over time.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="transition-all duration-300 hover:shadow-md">
                  <CardHeader>
                    <CardTitle>Quiz Breakdown</CardTitle>
                    <CardDescription>Analysis of your most recent quiz</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-100 mb-2">
                          <span className="text-3xl font-bold text-blue-700">
                            {quizScoreData[quizScoreData.length - 1].score}%
                          </span>
                        </div>
                        <h3 className="font-medium">{quizScoreData[quizScoreData.length - 1].quiz}</h3>
                        <p className="text-sm text-muted-foreground">
                          {quizScoreData[quizScoreData.length - 1].score - quizScoreData[quizScoreData.length - 1].average >= 0 
                            ? `${(quizScoreData[quizScoreData.length - 1].score - quizScoreData[quizScoreData.length - 1].average).toFixed(1)}% above average` 
                            : `${(quizScoreData[quizScoreData.length - 1].average - quizScoreData[quizScoreData.length - 1].score).toFixed(1)}% below average`}
                        </p>
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="font-medium text-sm">Question Type Performance</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Multiple Choice</span>
                            <span>95%</span>
                          </div>
                          <Progress value={95} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Short Answer</span>
                            <span>88%</span>
                          </div>
                          <Progress value={88} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Problem Solving</span>
                            <span>82%</span>
                          </div>
                          <Progress value={82} className="h-2" />
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-500"
                        onClick={() => {
                          toast.success("Detailed quiz analysis generated!");
                          simulateInteraction();
                        }}
                      >
                        View Complete Analysis
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="transition-all duration-300 hover:shadow-md">
                <CardHeader>
                  <CardTitle>Upcoming Quizzes</CardTitle>
                  <CardDescription>Prepare for your next assessments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Science Quiz 7</h3>
                          <p className="text-sm text-muted-foreground">Organic Chemistry & Reactions</p>
                        </div>
                        <div className="bg-yellow-100 text-yellow-800 py-1 px-3 rounded-full text-sm font-medium">
                          In 3 Days
                        </div>
                      </div>
                      <div className="mt-3 flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toast.success("Study materials for Science Quiz 7 opened");
                            simulateInteraction();
                          }}
                        >
                          Study Materials
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toast.success("Practice test for Science Quiz 7 started");
                            simulateInteraction();
                          }}
                        >
                          Take Practice Test
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Mathematics Quiz 7</h3>
                          <p className="text-sm text-muted-foreground">Advanced Algebra & Functions</p>
                        </div>
                        <div className="bg-green-100 text-green-800 py-1 px-3 rounded-full text-sm font-medium">
                          In 8 Days
                        </div>
                      </div>
                      <div className="mt-3 flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toast.success("Study materials for Mathematics Quiz 7 opened");
                            simulateInteraction();
                          }}
                        >
                          Study Materials
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toast.success("Practice test for Mathematics Quiz 7 started");
                            simulateInteraction();
                          }}
                        >
                          Take Practice Test
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="time" className="space-y-6 mt-6 transition-all duration-300">
          {isLoading ? (
            <div className="animate-pulse">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <div className="h-8 bg-slate-200 rounded w-1/3"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px] w-full bg-slate-200 rounded"></div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="md:col-span-2 transition-all duration-300 hover:shadow-md overflow-hidden">
                  <CardHeader className="bg-white/60 backdrop-blur-sm">
                    <CardTitle>Time Spent vs Performance</CardTitle>
                    <CardDescription>Correlation between study hours and quiz scores</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0 pt-4">
                    <div className="h-[350px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { subject: 'Mathematics', hours: 32, score: 85 },
                            { subject: 'Science', hours: 26, score: 87 },
                            { subject: 'English', hours: 18, score: 90 },
                            { subject: 'History', hours: 14, score: 80 },
                          ]}
                          margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="subject" stroke="#888" />
                          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                          <Tooltip 
                            cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                            contentStyle={{
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              borderRadius: '8px',
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                              border: '1px solid #eaeaea',
                            }}
                          />
                          <Legend onClick={() => simulateInteraction()} />
                          <Bar 
                            yAxisId="left" 
                            name="Hours Spent" 
                            dataKey="hours" 
                            fill="#8884d8"
                            animationDuration={1500}
                            radius={[4, 4, 0, 0]}
                            onClick={(data) => {
                              toast.info(`You've spent ${data.hours} hours on ${data.subject}`);
                              simulateInteraction();
                            }}
                          />
                          <Bar 
                            yAxisId="right" 
                            name="Score" 
                            dataKey="score" 
                            fill="#82ca9d"
                            animationDuration={1500}
                            animationBegin={300}
                            radius={[4, 4, 0, 0]}
                            onClick={(data) => {
                              toast.info(`Your average score in ${data.subject} is ${data.score}%`);
                              simulateInteraction();
                            }}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="transition-all duration-300 hover:shadow-md">
                  <CardHeader>
                    <CardTitle>Productivity by Time of Day</CardTitle>
                    <CardDescription>When you're most effective at learning</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div 
                        className="space-y-2 p-3 rounded-lg hover:bg-blue-50/30 transition-all duration-300 cursor-pointer"
                        onClick={() => {
                          toast.info("Morning is your most productive time!");
                          simulateInteraction();
                        }}
                      >
                        <div className="flex justify-between">
                          <span className="text-sm font-medium flex items-center">
                            <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                            Morning (6 AM - 12 PM)
                          </span>
                          <span className="text-sm font-medium">High</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                          <div className="bg-green-500 rounded-full h-2 transition-all duration-1000" style={{ width: "85%" }} />
                        </div>
                        <p className="text-xs text-muted-foreground">Your most productive period for challenging tasks</p>
                      </div>
                      
                      <div 
                        className="space-y-2 p-3 rounded-lg hover:bg-blue-50/30 transition-all duration-300 cursor-pointer"
                        onClick={() => {
                          toast.info("Afternoon is moderately productive for you");
                          simulateInteraction();
                        }}
                      >
                        <div className="flex justify-between">
                          <span className="text-sm font-medium flex items-center">
                            <span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
                            Afternoon (12 PM - 5 PM)
                          </span>
                          <span className="text-sm font-medium">Medium</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                          <div className="bg-yellow-500 rounded-full h-2 transition-all duration-1000" style={{ width: "65%" }} />
                        </div>
                        <p className="text-xs text-muted-foreground">Good for review and practice work</p>
                      </div>
                      
                      <div 
                        className="space-y-2 p-3 rounded-lg hover:bg-blue-50/30 transition-all duration-300 cursor-pointer"
                        onClick={() => {
                          toast.info("Evening is good for creative work");
                          simulateInteraction();
                        }}
                      >
                        <div className="flex justify-between">
                          <span className="text-sm font-medium flex items-center">
                            <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                            Evening (5 PM - 10 PM)
                          </span>
                          <span className="text-sm font-medium">Medium-High</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                          <div className="bg-blue-500 rounded-full h-2 transition-all duration-1000" style={{ width: "75%" }} />
                        </div>
                        <p className="text-xs text-muted-foreground">Effective for creative work and reading</p>
                      </div>
                      
                      <div 
                        className="space-y-2 p-3 rounded-lg hover:bg-blue-50/30 transition-all duration-300 cursor-pointer"
                        onClick={() => {
                          toast.info("Night is your least productive time");
                          simulateInteraction();
                        }}
                      >
                        <div className="flex justify-between">
                          <span className="text-sm font-medium flex items-center">
                            <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                            Night (10 PM - 6 AM)
                          </span>
                          <span className="text-sm font-medium">Low</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                          <div className="bg-red-500 rounded-full h-2 transition-all duration-1000" style={{ width: "30%" }} />
                        </div>
                        <p className="text-xs text-muted-foreground">Avoid studying during this period if possible</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="transition-all duration-300 hover:shadow-md">
                  <CardHeader>
                    <CardTitle>Study Efficiency Tips</CardTitle>
                    <CardDescription>Based on your time usage patterns</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div 
                        className="p-3 border rounded-lg hover:bg-blue-50/30 transition-all duration-300 cursor-pointer"
                        onClick={() => {
                          toast.info("Optimizing your morning study routine");
                          simulateInteraction();
                        }}
                      >
                        <h3 className="font-medium">Schedule difficult topics in the morning</h3>
                        <p className="text-sm text-muted-foreground mt-1">Your data shows you're 30% more efficient during morning hours.</p>
                        <div className="w-full bg-blue-100 h-1 mt-3 rounded-full">
                          <div className="bg-blue-500 h-1 rounded-full" style={{ width: "80%" }}></div>
                        </div>
                        <p className="text-xs text-right mt-1 text-blue-600">Effectiveness: 80%</p>
                      </div>
                      
                      <div 
                        className="p-3 border rounded-lg hover:bg-blue-50/30 transition-all duration-300 cursor-pointer"
                        onClick={() => {
                          toast.info("Adding more breaks to your study routine");
                          simulateInteraction();
                        }}
                      >
                        <h3 className="font-medium">Take breaks every 45 minutes</h3>
                        <p className="text-sm text-muted-foreground mt-1">Your focus drops after continuous study beyond this timeframe.</p>
                        <div className="w-full bg-blue-100 h-1 mt-3 rounded-full">
                          <div className="bg-blue-500 h-1 rounded-full" style={{ width: "75%" }}></div>
                        </div>
                        <p className="text-xs text-right mt-1 text-blue-600">Effectiveness: 75%</p>
                      </div>
                      
                      <div 
                        className="p-3 border rounded-lg hover:bg-blue-50/30 transition-all duration-300 cursor-pointer"
                        onClick={() => {
                          toast.info("Adjusting your Science study time");
                          simulateInteraction();
                        }}
                      >
                        <h3 className="font-medium">Increase Science study time</h3>
                        <p className="text-sm text-muted-foreground mt-1">You're spending less time on Science relative to its difficulty for you.</p>
                        <div className="w-full bg-blue-100 h-1 mt-3 rounded-full">
                          <div className="bg-blue-500 h-1 rounded-full" style={{ width: "90%" }}></div>
                        </div>
                        <p className="text-xs text-right mt-1 text-blue-600">Effectiveness: 90%</p>
                      </div>
                      
                      <Button 
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-500"
                        onClick={() => {
                          toast.success("Personalized study schedule generated!");
                          simulateInteraction();
                        }}
                      >
                        Generate Optimal Study Schedule
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Report Generation Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle>Performance Report</DialogTitle>
            <DialogDescription>
              {isGeneratingReport 
                ? "Generating your comprehensive performance report..." 
                : "Your personalized performance report is ready."}
            </DialogDescription>
          </DialogHeader>
          
          {isGeneratingReport ? (
            <div className="p-6 space-y-4">
              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 animate-pulse" style={{ width: "60%" }}></div>
              </div>
              <p className="text-center text-sm text-muted-foreground">
                This may take a few moments. We're analyzing your data and preparing a comprehensive report.
              </p>
            </div>
          ) : (
            <div className="p-6">
              <div 
                ref={reportRef} 
                className="border rounded-lg p-6 bg-white mb-4 space-y-6"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold">{user.fullName || user.firstName || "Student"} - Performance Report</h2>
                    <p className="text-muted-foreground">{user.unsafeMetadata?.grade || "10th Grade"} | {user.unsafeMetadata?.school || "Westlake High School"}</p>
                    <p className="text-sm text-muted-foreground">Generated on {new Date().toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Overall GPA: {user.unsafeMetadata?.overallGPA || 3.7}</p>
                    <p className="text-sm text-green-600">Top 15% of class</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Subject Performance</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>English</span>
                        <span className="font-medium">90%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: "90%" }}></div>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span>Mathematics</span>
                        <span className="font-medium">85%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: "85%" }}></div>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span>Science</span>
                        <span className="font-medium">87%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: "87%" }}></div>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span>History</span>
                        <span className="font-medium">80%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full">
                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: "80%" }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Key Strengths</h3>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-start">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500 mt-1.5 mr-2"></span>
                        <span>Exceptional essay writing and language skills</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500 mt-1.5 mr-2"></span>
                        <span>Strong analytical skills in mathematics</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500 mt-1.5 mr-2"></span>
                        <span>Consistent improvement in all subjects</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500 mt-1.5 mr-2"></span>
                        <span>Excellent time management skills</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Areas for Development</h3>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-start">
                        <span className="inline-block w-2 h-2 rounded-full bg-orange-500 mt-1.5 mr-2"></span>
                        <span>Organic Chemistry concepts in Science</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block w-2 h-2 rounded-full bg-orange-500 mt-1.5 mr-2"></span>
                        <span>Historical analysis and connecting events</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block w-2 h-2 rounded-full bg-orange-500 mt-1.5 mr-2"></span>
                        <span>Historical analysis and connecting events</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block w-2 h-2 rounded-full bg-orange-500 mt-1.5 mr-2"></span>
                        <span>Consistency in lower-scoring quiz sections</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Performance Summary</h3>
                  <p className="text-sm text-muted-foreground">
                    {user.fullName || user.firstName || "Student"} has shown remarkable progress across all subjects, with a notable strength in English and Mathematics. Continued focus on Science and History will help maintain a balanced academic profile. Your dedication to studying, especially in the mornings, is paying off with consistent improvements in quiz scores and overall GPA.
                  </p>
                </div>

                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={performanceData}
                      margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                    >
                      <XAxis dataKey="month" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Line type="monotone" dataKey="Mathematics" stroke="#8884d8" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="Science" stroke="#82ca9d" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="English" stroke="#ffc658" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="History" stroke="#ff8042" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowReportDialog(false)}
                >
                  Close
                </Button>
                <Button 
                  onClick={handleDownloadReport}
                  className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white"
                >
                  <Download size={16} className="mr-2" />
                  Download Report
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AnalyticsPage;