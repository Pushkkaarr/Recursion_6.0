"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Hardcoded teacher credentials
const TEACHER_CREDENTIALS = [
  { email: "teacher@edusync.com", password: "teacher123", name: "John Smith" },
  { email: "admin@edusync.com", password: "admin123", name: "Admin User" },
];

const TeacherLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const teacher = TEACHER_CREDENTIALS.find(
      (cred) => cred.email === email && cred.password === password
    );

    setTimeout(() => {
      setIsLoading(false);

      if (teacher) {
        localStorage.setItem(
          "teacherAuth",
          JSON.stringify({
            isAuthenticated: true,
            name: teacher.name,
            email: teacher.email,
            role: email.includes("admin") ? "admin" : "teacher",
          })
        );

        toast({
          title: "Success",
          description: `Welcome back, ${teacher.name}!`,
        });

        console.log("Redirecting to /teacher");
        router.push("/teacher");
      } else {
        toast({
          title: "Authentication failed",
          description: "Invalid teacher credentials. Please try again.",
          variant: "destructive",
        });
      }
    }, 1000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-blue-500/20 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="mx-auto max-w-md w-full">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-2 block">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              EduSync Teacher Portal
            </span>
          </div>
          <CardTitle className="text-2xl font-bold">Teacher Login</CardTitle>
          <CardDescription>Sign in to access your teaching dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="teacher@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={16} className="text-muted-foreground" />
                  ) : (
                    <Eye size={16} className="text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <Label htmlFor="remember" className="text-sm">
                Remember me
              </Label>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center">
          <p className="text-sm text-muted-foreground">This portal is for teachers only.</p>
        </CardFooter>
      </Card>

      <div className="fixed bottom-4 right-4 max-w-xs p-4 bg-card border rounded-lg shadow-sm">
        <h3 className="font-semibold mb-1">Demo Teacher Account</h3>
        <p className="text-sm text-muted-foreground mb-2">
          Use these credentials to login:
        </p>
        <div className="text-sm">
          <p>
            <span className="font-medium">Email:</span> teacher@edusync.com
          </p>
          <p>
            <span className="font-medium">Password:</span> teacher123
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeacherLoginPage;