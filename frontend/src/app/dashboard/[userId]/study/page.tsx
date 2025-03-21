import { Link } from "react-router-dom";
import { Calendar, Clock, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const weeklySchedule = [
  {
    day: "Monday",
    sessions: [
      { subject: "Mathematics", topic: "Calculus Integration", time: "10:00 AM - 11:30 AM", priority: "high" },
      { subject: "Science", topic: "Physics Lab Preparation", time: "2:00 PM - 3:30 PM", priority: "medium" },
    ]
  },
  {
    day: "Tuesday",
    sessions: [
      { subject: "English", topic: "Literature Essay Draft", time: "9:00 AM - 10:30 AM", priority: "medium" },
      { subject: "History", topic: "Research Project", time: "1:00 PM - 2:30 PM", priority: "low" },
    ]
  },
  {
    day: "Wednesday",
    sessions: [
      { subject: "Mathematics", topic: "Problem Solving Session", time: "11:00 AM - 12:30 PM", priority: "high" },
      { subject: "Science", topic: "Lab Report Writing", time: "3:00 PM - 4:30 PM", priority: "high" },
    ]
  },
  {
    day: "Thursday",
    sessions: [
      { subject: "English", topic: "Essay Review", time: "10:00 AM - 11:00 AM", priority: "medium" },
      { subject: "History", topic: "Document Analysis", time: "2:00 PM - 3:00 PM", priority: "medium" },
    ]
  },
  {
    day: "Friday",
    sessions: [
      { subject: "Mathematics", topic: "Quiz Preparation", time: "9:00 AM - 10:30 AM", priority: "high" },
      { subject: "Science", topic: "Final Lab Review", time: "1:00 PM - 2:30 PM", priority: "high" },
    ]
  },
  {
    day: "Saturday",
    sessions: [
      { subject: "General", topic: "Review Session", time: "10:00 AM - 12:00 PM", priority: "medium" },
    ]
  },
  {
    day: "Sunday",
    sessions: [
      { subject: "Rest Day", topic: "Light Reading", time: "Flexible", priority: "low" },
    ]
  },
];

const upcomingDeadlines = [
  {
    id: 1,
    title: "Calculus Quiz",
    subject: "Mathematics",
    date: "June 15, 2023",
    remainingDays: 2,
  },
  {
    id: 2,
    title: "Physics Lab Report",
    subject: "Science",
    date: "June 18, 2023",
    remainingDays: 5,
  },
  {
    id: 3,
    title: "Literature Essay",
    subject: "English",
    date: "June 20, 2023",
    remainingDays: 7,
  },
];

const StudyPlanPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Study Planner</h1>
          <p className="text-muted-foreground">
            Your AI-generated personalized study schedule based on your habits, quiz results, and availability.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Calendar size={16} />
            June 2023
          </Button>
          <Button size="sm" className="gap-1">
            <Clock size={16} />
            Adjust Schedule
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Schedule */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Study Schedule</CardTitle>
            <CardDescription>AI-optimized schedule based on your learning patterns and priorities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {weeklySchedule.map((day) => (
              <div key={day.day} className="space-y-3">
                <h3 className="font-semibold text-lg">{day.day}</h3>
                <div className="space-y-2">
                  {day.sessions.map((session, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        session.priority === 'high'
                          ? 'border-red-200 bg-red-50 dark:bg-red-900/10'
                          : session.priority === 'medium'
                          ? 'border-amber-200 bg-amber-50 dark:bg-amber-900/10'
                          : 'border-green-200 bg-green-50 dark:bg-green-900/10'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{session.subject}</h4>
                          <p className="text-sm text-muted-foreground">{session.topic}</p>
                        </div>
                        <div className="text-sm font-medium">{session.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
            <CardDescription>Tasks and assessments that need your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingDeadlines.map((deadline) => (
                <div
                  key={deadline.id}
                  className="p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{deadline.title}</h4>
                      <p className="text-sm text-muted-foreground">{deadline.subject}</p>
                    </div>
                    <div className={`text-sm font-medium px-2 py-1 rounded-full ${
                      deadline.remainingDays <= 2
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                        : deadline.remainingDays <= 5
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                        : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                    }`}>
                      {deadline.remainingDays} days left
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{deadline.date}</p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <Button variant="outline" className="w-full justify-center">
                View All Deadlines
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Study Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Personalized Study Tips</CardTitle>
          <CardDescription>Based on your learning patterns and performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <h3 className="font-medium mb-2">Focus on Calculus Integration</h3>
              <p className="text-sm text-muted-foreground">Your quiz results show you need more practice with integration techniques. We've scheduled extra time for this topic.</p>
            </div>
            <div className="p-4 rounded-lg bg-accent/50 border border-border">
              <h3 className="font-medium mb-2">Take breaks between Physics and Math</h3>
              <p className="text-sm text-muted-foreground">Your productivity metrics show that you perform better when alternating between these subjects with short breaks.</p>
            </div>
            <div className="p-4 rounded-lg bg-accent/50 border border-border">
              <h3 className="font-medium mb-2">Morning sessions for difficult topics</h3>
              <p className="text-sm text-muted-foreground">Based on your activity patterns, you focus better on challenging material during morning hours.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudyPlanPage;
