"use client"
import { useState } from "react";
import Link from "next/link";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Clock, 
  FileText, 
  Download,
  Users,
  CheckCircle2,
  ClipboardList,
  Eye,
  Pencil,
  Copy,
  Trash2,
} from "lucide-react";

// Sample quizzes data
const quizzes = [
  {
    id: 1,
    title: "Algebra Fundamentals",
    subject: "Mathematics",
    createdDate: "2023-10-15",
    dueDate: "2023-10-25",
    status: "active",
    questions: 25,
    completions: 18,
    students: 32,
    avgScore: 85,
  },
  {
    id: 2,
    title: "Physics Forces Quiz",
    subject: "Physics",
    createdDate: "2023-10-10",
    dueDate: "2023-10-20",
    status: "active",
    questions: 20,
    completions: 15,
    students: 28,
    avgScore: 78,
  },
  {
    id: 3,
    title: "Chemical Bonds",
    subject: "Chemistry",
    createdDate: "2023-09-28",
    dueDate: "2023-10-08",
    status: "completed",
    questions: 15,
    completions: 25,
    students: 25,
    avgScore: 82,
  },
  {
    id: 4,
    title: "Literature Analysis",
    subject: "English",
    createdDate: "2023-09-20",
    dueDate: "2023-09-30",
    status: "completed",
    questions: 18,
    completions: 30,
    students: 30,
    avgScore: 88,
  },
  {
    id: 5,
    title: "World History - Modern Era",
    subject: "History",
    createdDate: "2023-09-15",
    dueDate: "2023-09-25",
    status: "completed",
    questions: 22,
    completions: 28,
    students: 28,
    avgScore: 75,
  },
  {
    id: 6,
    title: "Programming Basics",
    subject: "Computer Science",
    createdDate: "2023-11-01",
    dueDate: "2023-11-10",
    status: "draft",
    questions: 30,
    completions: 0,
    students: 35,
    avgScore: 0,
  },
];

export default function QuizManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Filter quizzes based on search query and filters
  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          quiz.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSubject = selectedSubject === "All Subjects" || quiz.subject === selectedSubject;
    const matchesStatus = selectedStatus === "All" || quiz.status === selectedStatus.toLowerCase();
    
    return matchesSearch && matchesSubject && matchesStatus;
  });

  // Get unique subjects for filter dropdown
  const subjects = ["All Subjects", ...new Set(quizzes.map(quiz => quiz.subject))];
  
  // Get statistics
  const activeQuizzes = quizzes.filter(q => q.status === "active").length;
  const completedQuizzes = quizzes.filter(q => q.status === "completed").length;
  const draftQuizzes = quizzes.filter(q => q.status === "draft").length;
  const totalQuestions = quizzes.reduce((total, quiz) => total + quiz.questions, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quiz Management</h1>
          <p className="text-muted-foreground">
            Create, assign, and manage quizzes for your students.
          </p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <Button asChild>
            <Link href="/teacher/quizzes/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Quiz
            </Link>
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Results
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <ClipboardList className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Total Quizzes</p>
                <p className="text-3xl font-bold">{quizzes.length}</p>
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
                <p className="text-muted-foreground text-sm">Active Quizzes</p>
                <p className="text-3xl font-bold">{activeQuizzes}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-500/10 p-3 rounded-full">
                <FileText className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Total Questions</p>
                <p className="text-3xl font-bold">{totalQuestions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-amber-500/10 p-3 rounded-full">
                <Users className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Avg. Completion</p>
                <p className="text-3xl font-bold">
                  {Math.round(
                    quizzes.filter(q => q.status === "completed").reduce((acc, q) => acc + (q.completions / q.students), 0) /
                    (completedQuizzes || 1) * 100
                  )}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quiz Management Table */}
      <Card>
        <CardHeader>
          <CardTitle>Quiz List</CardTitle>
          <CardDescription>
            View, filter, and manage all your quizzes
          </CardDescription>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title or subject..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    {selectedSubject} <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {subjects.map((subject) => (
                    <DropdownMenuItem 
                      key={subject}
                      onClick={() => setSelectedSubject(subject)}
                    >
                      {subject}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    {selectedStatus} <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSelectedStatus("All")}>
                    All
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedStatus("Active")}>
                    Active
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedStatus("Completed")}>
                    Completed
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedStatus("Draft")}>
                    Draft
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quiz Title</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Completion</TableHead>
                <TableHead>Avg. Score</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuizzes.map((quiz) => (
                <TableRow key={quiz.id}>
                  <TableCell className="font-medium">{quiz.title}</TableCell>
                  <TableCell>{quiz.subject}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        quiz.status === "active" 
                          ? "default" 
                          : quiz.status === "completed" 
                            ? "secondary" 
                            : "outline"
                      }
                    >
                      {quiz.status === "active" 
                        ? "Active" 
                        : quiz.status === "completed" 
                          ? "Completed" 
                          : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      {new Date(quiz.dueDate).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    {quiz.status !== "draft" ? (
                      <span>
                        {quiz.completions}/{quiz.students} ({Math.round(quiz.completions / quiz.students * 100)}%)
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Not assigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {quiz.status === "completed" ? (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        quiz.avgScore >= 85 
                          ? 'bg-green-100 text-green-800' 
                          : quiz.avgScore >= 75 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-amber-100 text-amber-800'
                      }`}>
                        {quiz.avgScore}%
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/teacher/quizzes/edit/${quiz.id}`}>
                            <Pencil className="h-4 w-4 mr-2" /> Edit Quiz
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" /> View Results
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="h-4 w-4 mr-2" /> Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper component for dropdown
function ChevronDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
