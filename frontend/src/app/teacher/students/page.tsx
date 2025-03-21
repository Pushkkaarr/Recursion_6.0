"use client";
import { useState } from "react";
import  Link  from "next/link";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  FileText, 
  Mail,
  Download,
  Users,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";

// Sample student data
const students = [
  {
    id: 1,
    name: "oshnik",
    email: "tiiwarioshnikdeep@gmail.com",
    subject: "Mathematics",
    performance: "Excellent",
    attendance: "95%",
    avatar: "/placeholder.svg",
    status: "active",
  },
  {
    id: 2,
    name: "James Smith",
    email: "james.smith@example.com",
    subject: "Physics",
    performance: "Good",
    attendance: "88%",
    avatar: "/placeholder.svg",
    status: "active",
  },
  {
    id: 3,
    name: "Sophia Brown",
    email: "sophia.brown@example.com",
    subject: "Chemistry",
    performance: "Needs Improvement",
    attendance: "72%",
    avatar: "/placeholder.svg",
    status: "at risk",
  },
  {
    id: 4,
    name: "Noah Davis",
    email: "noah.davis@example.com",
    subject: "Biology",
    performance: "Good",
    attendance: "85%",
    avatar: "/placeholder.svg",
    status: "active",
  },
  {
    id: 5,
    name: "Olivia Johnson",
    email: "olivia.johnson@example.com",
    subject: "Computer Science",
    performance: "Excellent",
    attendance: "98%",
    avatar: "/placeholder.svg",
    status: "active",
  },
  {
    id: 6,
    name: "William Taylor",
    email: "william.taylor@example.com",
    subject: "Literature",
    performance: "Needs Improvement",
    attendance: "68%",
    avatar: "/placeholder.svg",
    status: "at risk",
  },
  {
    id: 7,
    name: "Ava Miller",
    email: "ava.miller@example.com",
    subject: "History",
    performance: "Good",
    attendance: "90%",
    avatar: "/placeholder.svg",
    status: "active",
  },
  {
    id: 8,
    name: "Liam Wilson",
    email: "liam.wilson@example.com",
    subject: "Geography",
    performance: "Excellent",
    attendance: "93%",
    avatar: "/placeholder.svg",
    status: "active",
  },
];

export default function StudentManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Filter students based on search query and filters
  const filteredStudents = students.filter((student) => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSubject = selectedSubject === "All Subjects" || student.subject === selectedSubject;
    const matchesStatus = selectedStatus === "All" || student.status === selectedStatus.toLowerCase();
    
    return matchesSearch && matchesSubject && matchesStatus;
  });

  // Get unique subjects for filter dropdown
  const subjects = ["All Subjects", ...new Set(students.map(student => student.subject))];
  const {user}=useUser();
  const userId=user?.id;
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Management</h1>
          <p className="text-muted-foreground">
            Manage and track all your students' performance and engagement.
          </p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
                <DialogDescription>
                  Add a new student to your classroom. They will receive an email invitation.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="name" className="text-right">
                    Name
                  </label>
                  <Input id="name" placeholder="Enter student name" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="email" className="text-right">
                    Email
                  </label>
                  <Input id="email" placeholder="Enter student email" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="subject" className="text-right">
                    Subject
                  </label>
                  <Input id="subject" placeholder="Main subject" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Send Invitation</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline" asChild>
            <Link href="/teacher/quizzes">
              <FileText className="mr-2 h-4 w-4" />
              Assign Quiz
            </Link>
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Total Students</p>
                <p className="text-3xl font-bold">{students.length}</p>
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
                <p className="text-muted-foreground text-sm">Active Students</p>
                <p className="text-3xl font-bold">
                  {students.filter(s => s.status === "active").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-amber-500/10 p-3 rounded-full">
                <AlertTriangle className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">At Risk Students</p>
                <p className="text-3xl font-bold">
                  {students.filter(s => s.status === "at risk").length}
                </p>
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
                <p className="text-muted-foreground text-sm">Subjects Taught</p>
                <p className="text-3xl font-bold">{subjects.length - 1}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student Management Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
          <CardDescription>
            View, filter, and manage all students in your classes
          </CardDescription>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
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
                  <DropdownMenuItem onClick={() => setSelectedStatus("At Risk")}>
                    At Risk
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
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
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      student.performance === 'Excellent' 
                        ? 'bg-green-100 text-green-800' 
                        : student.performance === 'Good' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-amber-100 text-amber-800'
                    }`}>
                      {student.performance}
                    </span>
                  </TableCell>
                  <TableCell>{student.attendance}</TableCell>
                  <TableCell>
                    <Badge variant={student.status === "active" ? "default" : "destructive"}>
                      {student.status === "active" ? "Active" : "At Risk"}
                    </Badge>
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
                          <Link href={`/dashboard/${userId}`}>View Details</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/teacher/quizzes">Assign Quiz</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="h-4 w-4 mr-2" /> Send Email
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
