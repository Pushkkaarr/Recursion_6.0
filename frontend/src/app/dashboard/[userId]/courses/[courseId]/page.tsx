"use client"
import { useState } from "react";
import Link from "next/link";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  BookOpen,
  Calendar,
  CheckCircle,
  ChevronLeft,
  Clock,
  FileText,
  Layout,
  MessageSquare,
  PlayCircle,
  Star,
  Users,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function CourseDetail() {
  const { courseId } = useParams();
  const [activeModule, setActiveModule] = useState("module-1");

  // Mock course data
  const course = {
    id: courseId,
    title: "Introduction to Calculus",
    description:
      "A comprehensive introduction to calculus concepts including limits, derivatives, integrals, and their applications. This course is designed for students with a strong foundation in algebra and trigonometry who want to develop their mathematical reasoning and problem-solving skills.",
    category: "Mathematics",
    level: "Intermediate",
    duration: "8 weeks",
    enrolled: 1245,
    rating: 4.8,
    progress: 65,
    image: "/placeholder.svg",
    tags: ["Mathematics", "Calculus"],
    instructor: {
      name: "Dr. Sarah Chen",
      title: "Professor of Mathematics",
      avatar: "/placeholder.svg",
      bio: "Ph.D. in Mathematics with 15 years of teaching experience. Specializes in calculus and differential equations.",
    },
    overview:
      "This course provides a solid foundation in calculus, starting with limits and continuity, then moving to derivatives and their applications, and finally covering integral calculus. You'll learn through video lectures, interactive problem sets, and practical applications.",
    objectives: [
      "Understand the concept of limits and continuity",
      "Master differentiation techniques and their applications",
      "Learn fundamental integration methods",
      "Apply calculus to solve real-world problems",
      "Develop mathematical reasoning and proof skills",
    ],
    modules: [
      {
        id: "module-1",
        title: "Introduction and Limits",
        description: "Fundamental concepts and limit theory",
        duration: "1.5 hours",
        completed: true,
        lessons: [
          {
            id: "lesson-1-1",
            title: "Course Overview",
            type: "video",
            duration: "15 min",
            completed: true,
          },
          {
            id: "lesson-1-2",
            title: "The Concept of Limits",
            type: "video",
            duration: "25 min",
            completed: true,
          },
          {
            id: "lesson-1-3",
            title: "Calculating Limits",
            type: "interactive",
            duration: "35 min",
            completed: true,
          },
          {
            id: "lesson-1-4",
            title: "Module 1 Quiz",
            type: "quiz",
            duration: "15 min",
            completed: true,
          },
        ],
      },
      {
        id: "module-2",
        title: "Derivatives: Concepts and Rules",
        description: "Understanding derivatives and differentiation",
        duration: "2 hours",
        completed: true,
        lessons: [
          {
            id: "lesson-2-1",
            title: "Definition of the Derivative",
            type: "video",
            duration: "30 min",
            completed: true,
          },
          {
            id: "lesson-2-2",
            title: "Basic Differentiation Rules",
            type: "video",
            duration: "25 min",
            completed: true,
          },
          {
            id: "lesson-2-3",
            title: "Product and Quotient Rules",
            type: "interactive",
            duration: "35 min",
            completed: true,
          },
          {
            id: "lesson-2-4",
            title: "Chain Rule",
            type: "video",
            duration: "20 min",
            completed: true,
          },
          {
            id: "lesson-2-5",
            title: "Module 2 Quiz",
            type: "quiz",
            duration: "15 min",
            completed: true,
          },
        ],
      },
      {
        id: "module-3",
        title: "Applications of Derivatives",
        description: "Using derivatives to solve problems",
        duration: "1.8 hours",
        completed: false,
        lessons: [
          {
            id: "lesson-3-1",
            title: "Rate of Change Problems",
            type: "video",
            duration: "25 min",
            completed: true,
          },
          {
            id: "lesson-3-2",
            title: "Max-Min Problems",
            type: "interactive",
            duration: "35 min",
            completed: true,
          },
          {
            id: "lesson-3-3",
            title: "Related Rates",
            type: "video",
            duration: "30 min",
            completed: false,
          },
          {
            id: "lesson-3-4",
            title: "Curve Sketching",
            type: "interactive",
            duration: "30 min",
            completed: false,
          },
          {
            id: "lesson-3-5",
            title: "Module 3 Quiz",
            type: "quiz",
            duration: "15 min",
            completed: false,
          },
        ],
      },
      {
        id: "module-4",
        title: "Introduction to Integration",
        description: "Basic integration concepts and techniques",
        duration: "2.2 hours",
        completed: false,
        lessons: [
          {
            id: "lesson-4-1",
            title: "Antiderivatives and Indefinite Integrals",
            type: "video",
            duration: "30 min",
            completed: false,
          },
          {
            id: "lesson-4-2",
            title: "Definite Integrals",
            type: "video",
            duration: "25 min",
            completed: false,
          },
          {
            id: "lesson-4-3",
            title: "The Fundamental Theorem of Calculus",
            type: "interactive",
            duration: "40 min",
            completed: false,
          },
          {
            id: "lesson-4-4",
            title: "Basic Integration Rules",
            type: "video",
            duration: "25 min",
            completed: false,
          },
          {
            id: "lesson-4-5",
            title: "Module 4 Quiz",
            type: "quiz",
            duration: "15 min",
            completed: false,
          },
        ],
      },
    ],
  };

  // Find the active module
  const currentModule = course.modules.find((m) => m.id === activeModule);

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <Link
        href="/dashboard/courses"
        className="inline-flex items-center mb-6 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft size={16} className="mr-1" />
        Back to Courses
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Content - Left Side */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative rounded-xl overflow-hidden aspect-video mb-6">
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Button size="lg" className="gap-2">
                <PlayCircle size={20} />
                Resume Course
              </Button>
            </div>
          </div>

          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              {course.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="bg-secondary/50">
                  {tag}
                </Badge>
              ))}
            </div>
            <h1 className="text-3xl font-bold mb-3">{course.title}</h1>
            <p className="text-muted-foreground mb-4">{course.description}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-lg p-3 text-center">
              <Clock size={18} className="mx-auto mb-1 text-primary" />
              <p className="text-xs text-muted-foreground">Duration</p>
              <p className="font-medium">{course.duration}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-3 text-center">
              <Layout size={18} className="mx-auto mb-1 text-primary" />
              <p className="text-xs text-muted-foreground">Level</p>
              <p className="font-medium">{course.level}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-3 text-center">
              <Users size={18} className="mx-auto mb-1 text-primary" />
              <p className="text-xs text-muted-foreground">Enrolled</p>
              <p className="font-medium">{course.enrolled.toLocaleString()}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-3 text-center">
              <Star size={18} className="mx-auto mb-1 text-amber-500" />
              <p className="text-xs text-muted-foreground">Rating</p>
              <p className="font-medium">{course.rating}/5</p>
            </div>
          </div>

          <Tabs defaultValue="overview" className="mt-6">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="content">Course Content</TabsTrigger>
              <TabsTrigger value="discussion">Discussion</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-3">Course Overview</h2>
                  <p className="text-muted-foreground">{course.overview}</p>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mb-3">Learning Objectives</h2>
                  <ul className="space-y-2">
                    {course.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle size={16} className="mr-2 mt-1 text-primary flex-shrink-0" />
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Meet Your Instructor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={course.instructor.avatar} alt={course.instructor.name} />
                        <AvatarFallback>{course.instructor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{course.instructor.name}</h3>
                        <p className="text-sm text-muted-foreground">{course.instructor.title}</p>
                        <p className="text-sm mt-2">{course.instructor.bio}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="content">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Course Content</h2>
                <div className="space-y-1">
                  {course.modules.map((module) => (
                    <Accordion
                      key={module.id}
                      type="single"
                      collapsible
                      defaultValue={activeModule === module.id ? module.id : undefined}
                    >
                      <AccordionItem value={module.id}>
                        <AccordionTrigger
                          onClick={() => setActiveModule(module.id)}
                          className={`px-4 py-3 rounded-lg ${
                            activeModule === module.id ? "bg-primary/10" : "hover:bg-secondary/50"
                          }`}
                        >
                          <div className="flex items-center gap-3 text-left">
                            <div
                              className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                module.completed
                                  ? "bg-primary/20 text-primary"
                                  : "bg-secondary text-muted-foreground"
                              }`}
                            >
                              {module.completed ? (
                                <CheckCircle size={16} />
                              ) : (
                                <BookOpen size={16} />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{module.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {module.description} • {module.duration}
                              </p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pt-2 pb-4">
                          <ul className="space-y-2 pl-11">
                            {module.lessons.map((lesson) => (
                              <li
                                key={lesson.id}
                                className={`flex items-center justify-between p-2 rounded-md ${
                                  lesson.completed
                                    ? "text-muted-foreground"
                                    : "text-foreground"
                                } hover:bg-secondary/30 transition-colors`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="text-muted-foreground">
                                    {lesson.type === "video" && <PlayCircle size={16} />}
                                    {lesson.type === "interactive" && <Layout size={16} />}
                                    {lesson.type === "quiz" && <FileText size={16} />}
                                  </div>
                                  <span className="text-sm">{lesson.title}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {lesson.completed && (
                                    <CheckCircle size={14} className="text-primary" />
                                  )}
                                  <span className="text-xs text-muted-foreground">
                                    {lesson.duration}
                                  </span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="discussion">
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <MessageSquare size={24} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Join the Discussion</h3>
                <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                  Connect with your peers and instructor to ask questions and share insights.
                </p>
                <Button>View Discussion Forum</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Course Sidebar - Right Side */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="mb-4">
                <div className="w-full bg-secondary rounded-full h-2 mb-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span>{course.progress}% completed</span>
                  <span>
                    {course.modules.filter((m) => m.completed).length}/{course.modules.length} modules
                  </span>
                </div>
              </div>

              <Button className="w-full mb-4 gap-2">
                <PlayCircle size={16} />
                Continue Learning
              </Button>

              <div className="space-y-4">
                <h3 className="font-semibold">Current Progress</h3>
                
                {currentModule && (
                  <div className="bg-secondary/50 rounded-lg p-4">
                    <p className="text-sm font-medium mb-1">{currentModule.title}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                      <span>
                        {currentModule.lessons.filter((l) => l.completed).length}/
                        {currentModule.lessons.length} lessons
                      </span>
                      <span>{currentModule.duration}</span>
                    </div>
                    
                    {/* Next lesson */}
                    {currentModule.lessons.find((l) => !l.completed) && (
                      <div className="mt-3">
                        <p className="text-xs text-muted-foreground mb-1">Next Lesson:</p>
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">
                            {
                              currentModule.lessons.find((l) => !l.completed)?.title
                            }
                          </p>
                          <Button size="sm" variant="outline" className="h-7 px-2 text-xs">
                            Start
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="border-t border-border mt-6 pt-6">
                <h3 className="font-semibold mb-4">Upcoming Deadlines</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Calendar size={16} className="text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Module 3 Quiz</p>
                      <p className="text-xs text-muted-foreground">Due in 3 days</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar size={16} className="text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Final Project Submission</p>
                      <p className="text-xs text-muted-foreground">Due in 2 weeks</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Course Resources</CardTitle>
              <CardDescription>
                Additional materials to support your learning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="flex items-center text-sm hover:text-primary transition-colors"
                  >
                    <FileText size={14} className="mr-2" />
                    Calculus Formula Sheet
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center text-sm hover:text-primary transition-colors"
                  >
                    <FileText size={14} className="mr-2" />
                    Practice Problem Set
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center text-sm hover:text-primary transition-colors"
                  >
                    <FileText size={14} className="mr-2" />
                    Recommended Readings
                  </a>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
