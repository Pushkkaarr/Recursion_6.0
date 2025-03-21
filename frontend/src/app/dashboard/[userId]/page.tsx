// Dashboard.jsx
"use client";
import  Link  from "next/link";
import { BarChart, Bar, XAxis, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CalendarDays, BarChart2, BookOpen, Clock, ChevronRight, ArrowUpRight } from "lucide-react";

const weeklyActivityData = [
  { name: "Mon", progress: 40 },
  { name: "Tue", progress: 30 },
  { name: "Wed", progress: 70 },
  { name: "Thu", progress: 90 },
  { name: "Fri", progress: 80 },
  { name: "Sat", progress: 50 },
  { name: "Sun", progress: 20 },
];

const progressData = [
  { name: "Mathematics", value: 80 },
  { name: "Science", value: 65 },
  { name: "History", value: 45 },
  { name: "English", value: 92 },
];

const upcomingTasks = [
  {
    id: 1,
    title: "Calculus Quiz",
    subject: "Mathematics",
    deadline: "Today, 2:00 PM",
    type: "quiz",
  },
  {
    id: 2,
    title: "Physics Lab Report",
    subject: "Science",
    deadline: "Tomorrow, 11:59 PM",
    type: "assignment",
  },
  {
    id: 3,
    title: "Literature Essay",
    subject: "English",
    deadline: "Friday, 5:00 PM",
    type: "assignment",
  },
];

const recommendedCourses = [
  {
    id: 1,
    title: "Advanced Statistics",
    description: "Master probability, hypothesis testing, and regression analysis.",
    progress: 0,
    image: "/placeholder.svg",
  },
  {
    id: 2,
    title: "Creative Writing",
    description: "Learn storytelling techniques and narrative development.",
    progress: 0,
    image: "/placeholder.svg",
  },
  {
    id: 3,
    title: "Web Development",
    description: "Build responsive websites with HTML, CSS, and JavaScript.",
    progress: 0,
    image: "/placeholder.svg",
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, John! Here's an overview of your learning progress.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <CalendarDays size={16} />
            June 2023
          </Button>
          <Button size="sm" className="gap-1">
            <BarChart2 size={16} />
            View Reports
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Courses in Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">7</div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <BookOpen size={20} className="text-primary" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-emerald-500">+2</span> courses since last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Study Hours This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">18.5</div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock size={20} className="text-primary" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-emerald-500">+3.5</span> hours compared to last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">87%</div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <ArrowUpRight size={20} className="text-primary" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-emerald-500">+12%</span> from previous month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">14 days</div>
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
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Learning Activity</CardTitle>
            <CardDescription>Your study time and progress over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyActivityData} margin={{ top: 5, right: 30, left: 20, bottom: 30 }}>
                  <XAxis dataKey="name" />
                  <defs>
                    <linearGradient id="progressFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={1} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                  <Bar dataKey="progress" fill="url(#progressFill)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Subject Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Subject Performance</CardTitle>
            <CardDescription>Your progress across different subjects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {progressData.map((subject) => (
                <div key={subject.name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{subject.name}</span>
                    <span className="text-sm font-medium">{subject.value}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary rounded-full h-2"
                      style={{ width: `${subject.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Tasks and Recommended Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Upcoming Tasks</CardTitle>
              <CardDescription>Tasks and assignments due soon</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="gap-1">
              View All
              <ChevronRight size={16} />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex justify-between items-center p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                >
                  <div className="flex gap-3 items-center">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        task.type === 'quiz'
                          ? 'bg-blue-500/10 text-blue-500'
                          : 'bg-purple-500/10 text-purple-500'
                      }`}
                    >
                      {task.type === 'quiz' ? (
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
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-muted-foreground">{task.subject}</p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">{task.deadline}</div>
                </div>
              ))}
            </div>
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
                  className="flex gap-4 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                >
                  <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{course.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {course.description}
                    </p>
                    <Link href={`/dashboard/courses/${course.id}`}>
                      <Button size="sm" variant="outline" className="w-full justify-center text-xs">
                        Explore Course
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}