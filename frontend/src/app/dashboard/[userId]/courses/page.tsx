"use client"
import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  Clock,
  Filter,
  Search,
  Star,
  Users,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@clerk/nextjs";

const courses = [
  {
    id: 1,
    title: "Introduction to Calculus",
    description: "Learn fundamental calculus concepts including limits, derivatives, and integrals.",
    category: "Mathematics",
    level: "Intermediate",
    duration: "8 weeks",
    enrolled: 1245,
    rating: 4.8,
    progress: 65,
    image: "/placeholder.svg",
    tags: ["Mathematics", "Calculus"],
    recommended: true,
  },
  {
    id: 2,
    title: "World History: Modern Era",
    description: "Explore major historical events and developments from the 18th century to present day.",
    category: "History",
    level: "Beginner",
    duration: "10 weeks",
    enrolled: 950,
    rating: 4.6,
    progress: 30,
    image: "/placeholder.svg",
    tags: ["History", "Modern"],
    recommended: false,
  },
  {
    id: 3,
    title: "Literary Analysis",
    description: "Develop skills to analyze and interpret various literary works and genres.",
    category: "English",
    level: "Intermediate",
    duration: "6 weeks",
    enrolled: 800,
    rating: 4.5,
    progress: 0,
    image: "/placeholder.svg",
    tags: ["English", "Literature"],
    recommended: true,
  },
  {
    id: 4,
    title: "Introduction to Psychology",
    description: "Explore the fundamental principles and theories of human behavior and mental processes.",
    category: "Psychology",
    level: "Beginner",
    duration: "12 weeks",
    enrolled: 1500,
    rating: 4.9,
    progress: 0,
    image: "/placeholder.svg",
    tags: ["Psychology", "Behavior"],
    recommended: false,
  },
  {
    id: 5,
    title: "Data Structures and Algorithms",
    description: "Learn essential computer science concepts for efficient program design and problem-solving.",
    category: "Computer Science",
    level: "Advanced",
    duration: "14 weeks",
    enrolled: 1100,
    rating: 4.7,
    progress: 15,
    image: "/placeholder.svg",
    tags: ["Programming", "Algorithms"],
    recommended: true,
  },
  {
    id: 6,
    title: "Environmental Science Fundamentals",
    description: "Understand the principles of ecosystems, biodiversity, and environmental challenges.",
    category: "Science",
    level: "Beginner",
    duration: "8 weeks",
    enrolled: 760,
    rating: 4.4,
    progress: 0,
    image: "/placeholder.svg",
    tags: ["Science", "Environment"],
    recommended: false,
  },
];

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const {user}=useUser()
  const userId=user?.id

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || course.category === categoryFilter;
    const matchesLevel = levelFilter === "all" || course.level === levelFilter;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Courses</h1>
          <p className="text-muted-foreground">
            Discover and enroll in courses tailored to your learning goals
          </p>
        </div>
        <Button variant="outline" className="mt-4 md:mt-0 gap-2" onClick={() => setIsFilterOpen(!isFilterOpen)}>
          <Filter size={16} />
          Filter Courses
        </Button>
      </div>

      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search courses..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {isFilterOpen && (
            <div className="flex flex-wrap gap-4 w-full sm:w-auto">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="History">History</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Psychology">Psychology</SelectItem>
                  <SelectItem value="Computer Science">Computer Science</SelectItem>
                  <SelectItem value="Science">Science</SelectItem>
                </SelectContent>
              </Select>

              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="overflow-hidden group hover:shadow-md transition-shadow">
            <div className="relative h-48 overflow-hidden">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {course.recommended && (
                <div className="absolute top-3 right-3">
                  <Badge className="bg-primary hover:bg-primary/90">Recommended</Badge>
                </div>
              )}
              {course.progress > 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              )}
            </div>
            <CardContent className="p-5">
              <div className="flex flex-wrap gap-2 mb-3">
                {course.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="bg-secondary/50">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                {course.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                {course.description}
              </p>
              
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock size={14} className="mr-1" />
                  {course.duration}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <BookOpen size={14} className="mr-1" />
                  {course.level}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users size={14} className="mr-1" />
                  {course.enrolled.toLocaleString()}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Star size={14} className="mr-1 text-amber-500" />
                  {course.rating}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  {course.progress > 0 ? `${course.progress}% completed` : "Not started"}
                </span>
                <Link href={`/dashboard/${userId}/courses/${course.id}`}>
                  <Button size="sm" variant="outline" className="gap-1 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    View Course
                    <ChevronRight size={14} />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Search size={24} className="text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No courses found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or filter criteria
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("");
              setCategoryFilter("all");
              setLevelFilter("all");
            }}
          >
            Reset filters
          </Button>
        </div>
      )}
    </div>
  );
}