// DashboardLayout.jsx
"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// Add this import at the top
import { usePathname } from 'next/navigation';
// import { FaFirefoxBrowser } from "react-icons/fa6";

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
  X,
  Chrome,
  Bot
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@clerk/nextjs';


import { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  interface StudentAuth {
    name: string;
    isAuthenticated: boolean;
  }

  const [studentAuth, setStudentAuth] = useState<StudentAuth | null>(null);
  const router = useRouter();
  const { user }=useUser();
  

// Inside your component
const pathname = usePathname();
//   useEffect(() => {
//     const authData = localStorage.getItem('studentAuth');
//     if (!authData) {
//       router.push('/login');
//       return;
//     }

//     try {
//       const parsedData = JSON.parse(authData);
//       if (!parsedData.isAuthenticated) {
//         router.push('/login');
//         return;
//       }
//       setStudentAuth(parsedData);
//     } catch (error) {
//       localStorage.removeItem('studentAuth');
//       router.push('/login');
//     }
//   }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('studentAuth');
    router.push('/login');
  };

  // Get user ID from local storage for dynamic routing
  const userId = user?.id || "default";

  const studentNavItems = [
    {
      title: 'Dashboard',
      href: `/dashboard/${userId}`,
      icon: <LayoutDashboard size={20} />,
    },
    {
      title: 'Courses',
      href: `/dashboard/${userId}/courses`,
      icon: <BookOpen size={20} />,
    },
    {
      title: 'Study Plan',
      href: `/dashboard/${userId}/study`,
      icon: <Calendar size={20} />,
    },
    {
      title: 'Analytics',
      href: `/dashboard/${userId}/analytics`,
      icon: <BarChart3 size={20} />,
    },
    {
      title: 'Daily Quizzes',
      href: `/dashboard/${userId}/quiz`,
      icon: <Users size={20} />,
    },
    {
      title: 'Messages',
      href: `/dashboard/${userId}/messages`,
      icon: <MessageSquare size={20} />,
    },
    {
      title: 'Browse courses',
      href: `/dashboard/${userId}/browse`,
      icon: <Chrome size={20} />,
    },
    {
        title: 'AI Quiz',
        href: `/dashboard/${userId}/quiz`,
        icon: <Bot size={20} />,
      },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transition-transform transform bg-card border-r border-border shadow-sm ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b border-border">
            <Link 
              href="/" 
              className="flex items-center"
            >
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                EduSync
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
              {studentNavItems.map((item) => (
  <Link
    key={item.href}
    href={item.href}
    className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg group transition-colors ${
      pathname === item.href
        ? 'bg-primary text-primary-foreground'
        : 'text-foreground/70 hover:text-foreground hover:bg-primary/10'
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
                <AvatarFallback>
                  {studentAuth?.name ? studentAuth.name.split(' ').map(n => n[0]).join('') : 'JD'}
                </AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium">{studentAuth?.name || "Student"}</p>
                <p className="text-xs text-muted-foreground">Student</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto"
                onClick={handleLogout}
              >
                <LogOut size={16} />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Content */}
      <div className={`flex flex-col flex-1 ${isSidebarOpen ? 'md:ml-64' : ''}`}>
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
            <span>Dashboard</span>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <Button variant="ghost" size="sm" className="gap-1" onClick={handleLogout}>
              <LogOut size={16} />
              <span className="sr-only md:not-sr-only md:ml-2">
                Logout
              </span>
            </Button>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}