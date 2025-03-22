"use client";
import { useState } from "react";
import { usePathname } from "next/navigation"; // Only need usePathname for active link highlighting
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  BookOpen,
  Calendar,
  ChevronRight,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  Users,
  Video,
  FileText,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link"; // Use Next.js Link instead of react-router-dom

export default function TeacherDashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

  const teacherNavItems = [
    { title: "Dashboard", href: "/teacher", icon: <LayoutDashboard size={20} /> },
    { title: "Students", href: "/teacher/students", icon: <Users size={20} /> },
    { title: "Quizzes", href: "/teacher/quizzes", icon: <FileText size={20} /> },
    { title: "Content", href: "/teacher/content", icon: <BookOpen size={20} /> },
    { title: "Live Meetings", href: "/teacher/meeting", icon: <Video size={20} /> },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transition-transform transform bg-card border-r border-border shadow-sm ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b border-border">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                EduSync Teacher
              </span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X size={20} />
            </Button>
          </div>

          <div className="px-4 py-4 space-y-4 overflow-y-auto flex-grow">
            <div className="pb-4">
              <nav className="space-y-1">
                {teacherNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg group transition-colors ${
                      pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground/70 hover:text-foreground hover:bg-primary/10"
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.title}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          <div className="p-4 border-t border-border">
            <div className="flex items-center">
              <Avatar>
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>T</AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium">Teacher</p>
                <p className="text-xs text-muted-foreground">Instructor</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Content */}
      <div className={`flex flex-col flex-1 ${isSidebarOpen ? "md:ml-64" : ""}`}>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background px-4 md:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={20} />
          </Button>
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Home size={20} className="text-muted-foreground" />
            <ChevronRight size={16} className="text-muted-foreground" />
            <span>Teacher Dashboard</span>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Link href="/">Back to Main Site</Link>
            </Button>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}