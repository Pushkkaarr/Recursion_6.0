"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Bell, BookOpen, CheckCircle2, Users, FileText, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link"; // Use Next.js Link

// Sample data for charts and tables
const performanceData = [
  { name: "Math", score: 85, average: 75 },
  { name: "Science", score: 92, average: 78 },
  { name: "History", score: 78, average: 72 },
  { name: "English", score: 88, average: 80 },
  { name: "CS", score: 95, average: 82 },
];

const recentStudents = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", subject: "Mathematics", performance: "Excellent", avatar: "/placeholder.svg" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", subject: "Physics", performance: "Good", avatar: "/placeholder.svg" },
  { id: 3, name: "Carol Williams", email: "carol@example.com", subject: "Chemistry", performance: "Needs Improvement", avatar: "/placeholder.svg" },
  { id: 4, name: "David Brown", email: "david@example.com", subject: "Biology", performance: "Good", avatar: "/placeholder.svg" },
];

const upcomingQuizzes = [
  { id: 1, title: "Algebra Midterm", date: "2023-11-15", subject: "Mathematics", students: 32 },
  { id: 2, title: "Physics Concepts", date: "2023-11-18", subject: "Physics", students: 28 },
  { id: 3, title: "Literature Review", date: "2023-11-20", subject: "English", students: 35 },
];

export default function TeacherDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here’s an overview of your classroom performance.
          </p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <Button>
            <Link href="/teacher/quizzes/create">
              <FileText className="mr-2 h-4 w-4" />
              Create Quiz
            </Link>
          </Button>
          <Button variant="outline">
            <Link href="/teacher/meetings">
              <Users className="mr-2 h-4 w-4" />
              Schedule Meeting
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Total Students</p>
                <p className="text-3xl font-bold">124</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-500/10 p-3 rounded-full">
                <BookOpen className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Active Courses</p>
                <p className="text-3xl font-bold">8</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-500/10 p-3 rounded-full">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Quizzes Created</p>
                <p className="text-3xl font-bold">42</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-amber-500/10 p-3 rounded-full">
                <Bell className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Pending Reviews</p>
                <p className="text-3xl font-bold">7</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Student Performance Overview</CardTitle>
            <CardDescription>
              Average class performance across subjects compared to overall averages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" name="Class Average" fill="#3b82f6" />
                <Bar dataKey="average" name="Overall Average" fill="#94a3b8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Students Requiring Attention */}
        <Card>
          <CardHeader>
            <CardTitle>Students Needing Attention</CardTitle>
            <CardDescription>Students who may need additional support</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentStudents.slice(0, 3).map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between space-x-4 p-3 rounded-lg border border-border"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={student.avatar} />
                      <AvatarFallback>{student.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-muted-foreground">{student.subject}</p>
                    </div>
                  </div>
                  {student.performance === "Needs Improvement" ? (
                    <div className="flex items-center text-amber-500">
                      <AlertTriangle className="h-5 w-5 mr-1" />
                      <span className="text-xs">Attention Needed</span>
                    </div>
                  ) : null}
                </div>
              ))}
              <Button variant="outline" className="w-full">
                <Link href="/teacher/students">View All Students</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Students */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Student Activity</CardTitle>
            <CardDescription>View recent student participation and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={student.avatar} />
                          <AvatarFallback>{student.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-xs text-muted-foreground">{student.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{student.subject}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          student.performance === "Excellent"
                            ? "bg-green-100 text-green-800"
                            : student.performance === "Good"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {student.performance}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost">
                        <Link href={`/teacher/students/${student.id}`}>View Details</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Upcoming Quizzes */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Quizzes</CardTitle>
            <CardDescription>Scheduled quizzes for your classes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingQuizzes.map((quiz) => (
                <div key={quiz.id} className="border border-border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{quiz.title}</h4>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      {new Date(quiz.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{quiz.subject}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-muted-foreground flex items-center">
                      <Users className="h-3 w-3 mr-1" /> {quiz.students} students
                    </span>
                    <Button variant="ghost" size="sm">
                      <Link href={`/teacher/quizzes/edit/${quiz.id}`}>Edit</Link>
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                <Link href="/teacher/quizzes">View All Quizzes</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}