"use client";

import { BarChart, LineChart, PieChart, Bar, Line, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronDown, Download, Share2 } from "lucide-react";

const performanceData = [
  { month: 'Jan', Mathematics: 65, Science: 75, English: 78, History: 62 },
  { month: 'Feb', Mathematics: 68, Science: 73, English: 80, History: 65 },
  { month: 'Mar', Mathematics: 72, Science: 78, English: 82, History: 68 },
  { month: 'Apr', Mathematics: 75, Science: 82, English: 85, History: 72 },
  { month: 'May', Mathematics: 80, Science: 85, English: 88, History: 76 },
  { month: 'Jun', Mathematics: 85, Science: 87, English: 90, History: 80 },
];

const timeSpentData = [
  { subject: 'Mathematics', hours: 32 },
  { subject: 'Science', hours: 26 },
  { subject: 'English', hours: 18 },
  { subject: 'History', hours: 14 },
  { subject: 'Other', hours: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const quizScoreData = [
  { quiz: 'Quiz 1', score: 75, average: 72 },
  { quiz: 'Quiz 2', score: 82, average: 76 },
  { quiz: 'Quiz 3', score: 78, average: 75 },
  { quiz: 'Quiz 4', score: 85, average: 78 },
  { quiz: 'Quiz 5', score: 90, average: 80 },
  { quiz: 'Quiz 6', score: 88, average: 82 },
];

const strengthsAndWeaknesses = [
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

const AnalyticsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Performance Analytics</h1>
          <p className="text-muted-foreground">
            Interactive insights into your learning progress and performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <ChevronDown size={16} />
            Last 6 Months
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Download size={16} />
            Export
          </Button>
          <Button size="sm" className="gap-1">
            <Share2 size={16} />
            Share Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subjects">Subject Analysis</TabsTrigger>
          <TabsTrigger value="quizzes">Quiz Performance</TabsTrigger>
          <TabsTrigger value="time">Time Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Performance Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Trend</CardTitle>
              <CardDescription>Your progress in each subject over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={performanceData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Mathematics" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="Science" stroke="#82ca9d" strokeWidth={2} />
                    <Line type="monotone" dataKey="English" stroke="#ffc658" strokeWidth={2} />
                    <Line type="monotone" dataKey="History" stroke="#ff8042" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Strengths and Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Strengths</CardTitle>
                <CardDescription>Areas where you excel based on your performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {strengthsAndWeaknesses.filter(item => item.strength).map((item, index) => (
                    <div key={index} className="p-4 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/20">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{item.topic}</h3>
                          <p className="text-sm text-muted-foreground">{item.subject}</p>
                        </div>
                      </div>
                      <p className="text-sm mt-2">{item.description}</p>
                      <p className="text-sm font-medium mt-2 text-green-600 dark:text-green-400">Recommendation: {item.recommendation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Areas for Improvement</CardTitle>
                <CardDescription>Topics that need more attention based on your results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {strengthsAndWeaknesses.filter(item => !item.strength).map((item, index) => (
                    <div key={index} className="p-4 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{item.topic}</h3>
                          <p className="text-sm text-muted-foreground">{item.subject}</p>
                        </div>
                      </div>
                      <p className="text-sm mt-2">{item.description}</p>
                      <p className="text-sm font-medium mt-2 text-red-600 dark:text-red-400">Recommendation: {item.recommendation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="subjects" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Subject Distribution</CardTitle>
              <CardDescription>How you've divided your time across subjects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full">
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
                    >
                      {timeSpentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="quizzes" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Performance</CardTitle>
              <CardDescription>Your quiz scores compared to class average</CardDescription>
            </CardHeader>
            <CardContent>
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
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="quiz" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar name="Your Score" dataKey="score" fill="#8884d8" />
                    <Bar name="Class Average" dataKey="average" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="time" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Time Spent vs Performance</CardTitle>
                <CardDescription>Correlation between study hours and quiz scores</CardDescription>
              </CardHeader>
              <CardContent>
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
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="subject" />
                      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" name="Hours Spent" dataKey="hours" fill="#8884d8" />
                      <Bar yAxisId="right" name="Score" dataKey="score" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Productivity by Time of Day</CardTitle>
                <CardDescription>When you're most effective at learning</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Morning (6 AM - 12 PM)</span>
                      <span className="text-sm font-medium">High</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-green-500 rounded-full h-2" style={{ width: "85%" }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Afternoon (12 PM - 5 PM)</span>
                      <span className="text-sm font-medium">Medium</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-yellow-500 rounded-full h-2" style={{ width: "65%" }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Evening (5 PM - 10 PM)</span>
                      <span className="text-sm font-medium">Medium-High</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-blue-500 rounded-full h-2" style={{ width: "75%" }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Night (10 PM - 6 AM)</span>
                      <span className="text-sm font-medium">Low</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-red-500 rounded-full h-2" style={{ width: "30%" }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Study Efficiency Tips</CardTitle>
                <CardDescription>Based on your time usage patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border rounded-lg">
                    <h3 className="font-medium">Schedule difficult topics in the morning</h3>
                    <p className="text-sm text-muted-foreground mt-1">Your data shows you're 30% more efficient during morning hours.</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h3 className="font-medium">Take breaks every 45 minutes</h3>
                    <p className="text-sm text-muted-foreground mt-1">Your focus drops after continuous study beyond this timeframe.</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h3 className="font-medium">Increase Science study time</h3>
                    <p className="text-sm text-muted-foreground mt-1">You're spending less time on Science relative to its difficulty for you.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsPage;
