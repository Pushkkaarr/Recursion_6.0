"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import {
  ArrowLeft,
  CalendarIcon,
  CheckCircle2,
  ChevronDown,
  Clock,
  FileText,
  Plus,
  Trash2,
  Users,
  Check,
  X,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const sampleQuiz = {
  id: 1,
  title: "Algebra Fundamentals",
  description: "This quiz covers the basic concepts of algebra including equations, expressions, and functions.",
  subject: "Mathematics",
  dueDate: new Date("2023-12-25"),
  timeLimit: 45,
  passingScore: 70,
  isAdaptive: true,
  showResults: true,
  questions: [
    {
      id: 1,
      type: "multiple-choice",
      text: "Which of the following is a solution to the equation 2x + 5 = 11?",
      options: [
        { id: 1, text: "x = 2", isCorrect: false },
        { id: 2, text: "x = 3", isCorrect: true },
        { id: 3, text: "x = 4", isCorrect: false },
        { id: 4, text: "x = 5", isCorrect: false },
      ],
      points: 5,
      difficulty: "medium",
    },
    {
      id: 2,
      type: "true-false",
      text: "The equation y = 3x + 7 represents a line with a slope of 3.",
      isTrue: true,
      points: 3,
      difficulty: "easy",
    },
    {
      id: 3,
      type: "short-answer",
      text: "Factorize the expression: x² - 9",
      answer: "(x+3)(x-3)",
      points: 8,
      difficulty: "hard",
    },
  ],
  students: [
    { id: 1, name: "Emma Wilson" },
    { id: 2, name: "James Smith" },
    { id: 3, name: "Sophia Brown" },
  ],
};

const questionTypes = [
  { value: "multiple-choice", label: "Multiple Choice" },
  { value: "true-false", label: "True/False" },
  { value: "short-answer", label: "Short Answer" },
  { value: "fill-blank", label: "Fill in the Blank" },
];

const difficultyLevels = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

const allStudents = [
  { id: 1, name: "Emma Wilson", grade: "11th", subject: "Mathematics" },
  { id: 2, name: "James Smith", grade: "10th", subject: "Physics" },
  { id: 3, name: "Sophia Brown", grade: "12th", subject: "Chemistry" },
  { id: 4, name: "Noah Davis", grade: "10th", subject: "Biology" },
  { id: 5, name: "Olivia Johnson", grade: "11th", subject: "Computer Science" },
  { id: 6, name: "William Taylor", grade: "12th", subject: "Literature" },
  { id: 7, name: "Ava Miller", grade: "10th", subject: "History" },
  { id: 8, name: "Liam Wilson", grade: "11th", subject: "Geography" },
];

export default function QuizCreator() {
  const router = useRouter();
  const params = useParams();
  const quizId = params.quizId; // Will be undefined for /create, defined for /[quizId]/edit
  const isEditing = !!quizId;

  const [questions, setQuestions] = useState(isEditing ? sampleQuiz.questions : []);
  const [assignedStudents, setAssignedStudents] = useState(isEditing ? sampleQuiz.students : []);
  const [currentQuestionType, setCurrentQuestionType] = useState("multiple-choice");
  const [showNewQuestionDialog, setShowNewQuestionDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);

  const form = useForm({
    defaultValues: isEditing
      ? {
          title: sampleQuiz.title,
          description: sampleQuiz.description,
          subject: sampleQuiz.subject,
          dueDate: sampleQuiz.dueDate,
          timeLimit: sampleQuiz.timeLimit,
          passingScore: sampleQuiz.passingScore,
          isAdaptive: sampleQuiz.isAdaptive,
          showResults: sampleQuiz.showResults,
        }
      : {
          title: "",
          description: "",
          subject: "",
          dueDate: undefined,
          timeLimit: 30,
          passingScore: 70,
          isAdaptive: false,
          showResults: true,
        },
  });

  const handleSaveQuiz = (data: any) => {
    console.log("Saving quiz:", { ...data, questions, assignedStudents });
    router.push("/teacher/quizzes");
  };

  const addQuestion = (questionData: any) => {
    setQuestions([
      ...questions,
      {
        id: questions.length + 1,
        ...questionData,
      },
    ]);
    setShowNewQuestionDialog(false);
  };

  const removeQuestion = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const addStudents = (selectedStudents: any[]) => {
    setAssignedStudents(selectedStudents);
    setShowAssignDialog(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="flex items-center">
          <Button variant="ghost" className="mr-2" asChild>
            <Link href="/teacher/quizzes">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditing ? "Edit Quiz" : "Create New Quiz"}
          </h1>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
            <DialogTrigger asChild>
              <Button>
                <Users className="mr-2 h-4 w-4" />
                {assignedStudents.length > 0
                  ? `Assigned (${assignedStudents.length})`
                  : "Assign to Students"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Assign Quiz to Students</DialogTitle>
                <DialogDescription>
                  Select the students who should take this quiz.
                </DialogDescription>
              </DialogHeader>
              <StudentSelector
                allStudents={allStudents}
                selectedStudents={assignedStudents}
                onAssign={addStudents}
              />
            </DialogContent>
          </Dialog>
          <Button
            variant="outline"
            onClick={() => form.handleSubmit(handleSaveQuiz)()}
          >
            {isEditing ? "Update Quiz" : "Save as Draft"}
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSaveQuiz)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Information</CardTitle>
              <CardDescription>Basic information about your quiz</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quiz Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter quiz title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Mathematics, Physics" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter quiz description"
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Due Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className="w-full pl-3 text-left font-normal"
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span className="text-muted-foreground">Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="timeLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Limit (minutes)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="passingScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Passing Score (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <FormField
                  control={form.control}
                  name="isAdaptive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between p-3 rounded-lg border">
                      <div className="space-y-0.5">
                        <FormLabel>Adaptive Difficulty</FormLabel>
                        <FormDescription>
                          Adjust question difficulty based on student performance
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="showResults"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between p-3 rounded-lg border">
                      <div className="space-y-0.5">
                        <FormLabel>Show Results Immediately</FormLabel>
                        <FormDescription>
                          Students can see their results right after completion
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Quiz Questions</CardTitle>
                  <CardDescription>Add and manage questions for your quiz</CardDescription>
                </div>
                <Dialog open={showNewQuestionDialog} onOpenChange={setShowNewQuestionDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Question
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Add New Question</DialogTitle>
                      <DialogDescription>
                        Select the type of question you want to add.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <div className="mb-4">
                        <label className="text-sm font-medium">Question Type</label>
                        <Select
                          defaultValue={currentQuestionType}
                          onValueChange={setCurrentQuestionType}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select question type" />
                          </SelectTrigger>
                          <SelectContent>
                            {questionTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <QuestionForm
                        type={currentQuestionType}
                        onSave={addQuestion}
                        onCancel={() => setShowNewQuestionDialog(false)}
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {questions.length === 0 ? (
                <div className="text-center py-8 border border-dashed rounded-lg">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No questions yet</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Click the "Add Question" button to create your first question.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {questions.map((question, index) => (
                    <Card key={question.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <Badge variant="outline" className="mr-2">
                                Q{index + 1}
                              </Badge>
                              <Badge variant="secondary" className="mr-2 capitalize">
                                {question.type.replace("-", " ")}
                              </Badge>
                              <Badge variant="outline" className="capitalize">
                                {question.difficulty}
                              </Badge>
                              <span className="ml-auto text-sm text-muted-foreground">
                                {question.points} pts
                              </span>
                            </div>
                            <p className="font-medium">{question.text}</p>

                            {question.type === "multiple-choice" && (
                              <div className="mt-2 pl-4 space-y-1">
                                {question.options.map((option: any) => (
                                  <div
                                    key={option.id}
                                    className={`flex items-center ${
                                      option.isCorrect ? "text-green-600 font-medium" : ""
                                    }`}
                                  >
                                    {option.isCorrect && (
                                      <CheckCircle2 className="h-4 w-4 mr-1" />
                                    )}
                                    {option.text}
                                  </div>
                                ))}
                              </div>
                            )}

                            {question.type === "true-false" && (
                              <div className="mt-2 pl-4">
                                <p className="text-green-600 font-medium">
                                  Answer: {question.isTrue ? "True" : "False"}
                                </p>
                              </div>
                            )}

                            {question.type === "short-answer" && (
                              <div className="mt-2 pl-4">
                                <p className="text-green-600 font-medium">
                                  Answer: {question.answer}
                                </p>
                              </div>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeQuestion(question.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between border-t p-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <FileText className="h-4 w-4 mr-1" />
                <span>{questions.length} Questions</span>
                <Clock className="h-4 w-4 ml-4 mr-1" />
                <span>Total: {form.watch("timeLimit")} minutes</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => router.push("/teacher/quizzes")}
                >
                  Cancel
                </Button>
                <Button type="submit">{isEditing ? "Update Quiz" : "Save Quiz"}</Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}

function QuestionForm({
  type,
  onSave,
  onCancel,
}: {
  type: string;
  onSave: (data: any) => void;
  onCancel: () => void;
}) {
  const [questionText, setQuestionText] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [points, setPoints] = useState(5);

  const [options, setOptions] = useState([
    { id: 1, text: "", isCorrect: false },
    { id: 2, text: "", isCorrect: false },
    { id: 3, text: "", isCorrect: false },
    { id: 4, text: "", isCorrect: false },
  ]);

  const [isTrueCorrect, setIsTrueCorrect] = useState(true);

  const [correctAnswer, setCorrectAnswer] = useState("");

  const handleOptionChange = (id: number, text: string) => {
    setOptions(options.map((option) => (option.id === id ? { ...option, text } : option)));
  };

  const handleCorrectOptionChange = (id: number) => {
    setOptions(options.map((option) => ({ ...option, isCorrect: option.id === id })));
  };

  const handleSave = () => {
    const baseQuestion = {
      type,
      text: questionText,
      points,
      difficulty,
    };

    let questionData;
    switch (type) {
      case "multiple-choice":
        questionData = {
          ...baseQuestion,
          options,
        };
        break;
      case "true-false":
        questionData = {
          ...baseQuestion,
          isTrue: isTrueCorrect,
        };
        break;
      case "short-answer":
      case "fill-blank":
        questionData = {
          ...baseQuestion,
          answer: correctAnswer,
        };
        break;
    }

    onSave(questionData);
  };

  const hasValidData = () => {
    if (!questionText) return false;

    switch (type) {
      case "multiple-choice":
        return options.some((o) => o.isCorrect) && options.every((o) => o.text.trim() !== "");
      case "short-answer":
      case "fill-blank":
        return correctAnswer.trim() !== "";
      case "true-false":
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Question Text</label>
        <Textarea
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="Enter your question here"
          className="mt-1"
          rows={3}
        />
      </div>

      {type === "multiple-choice" && (
        <div>
          <label className="text-sm font-medium">Options (select correct answer)</label>
          <div className="space-y-2 mt-1">
            {options.map((option) => (
              <div key={option.id} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCorrectOptionChange(option.id)}
                  className={`h-5 w-5 rounded-full flex items-center justify-center border ${
                    option.isCorrect ? "bg-green-500 border-green-500 text-white" : "border-gray-300"
                  }`}
                >
                  {option.isCorrect && <Check className="h-3 w-3" />}
                </button>
                <Input
                  value={option.text}
                  onChange={(e) => handleOptionChange(option.id, e.target.value)}
                  placeholder={`Option ${option.id}`}
                  className="flex-1"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {type === "true-false" && (
        <div>
          <label className="text-sm font-medium">Correct Answer</label>
          <div className="flex gap-4 mt-1">
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setIsTrueCorrect(true)}
                className={`h-5 w-5 rounded-full flex items-center justify-center border mr-2 ${
                  isTrueCorrect ? "bg-green-500 border-green-500 text-white" : "border-gray-300"
                }`}
              >
                {isTrueCorrect && <Check className="h-3 w-3" />}
              </button>
              <span>True</span>
            </div>
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setIsTrueCorrect(false)}
                className={`h-5 w-5 rounded-full flex items-center justify-center border mr-2 ${
                  !isTrueCorrect ? "bg-green-500 border-green-500 text-white" : "border-gray-300"
                }`}
              >
                {!isTrueCorrect && <Check className="h-3 w-3" />}
              </button>
              <span>False</span>
            </div>
          </div>
        </div>
      )}

      {(type === "short-answer" || type === "fill-blank") && (
        <div>
          <label className="text-sm font-medium">Correct Answer</label>
          <Input
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            placeholder="Enter the correct answer"
            className="mt-1"
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Difficulty</label>
          <Select defaultValue={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger>
              <Select AscendTrigger /> {/* Replaced ChevronDown with AscendTrigger */}
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              {difficultyLevels.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">Points</label>
          <Input
            type="number"
            value={points}
            onChange={(e) => setPoints(parseInt(e.target.value, 10))}
            min={1}
            max={100}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!hasValidData()}>
          Add Question
        </Button>
      </div>
    </div>
  );
}

function StudentSelector({
  allStudents,
  selectedStudents,
  onAssign,
}: {
  allStudents: any[];
  selectedStudents: any[];
  onAssign: (selected: any[]) => void;
}) {
  const [selected, setSelected] = useState(selectedStudents.map((s) => s.id));
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStudents = allStudents.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleStudent = (studentId: number) => {
    if (selected.includes(studentId)) {
      setSelected(selected.filter((id) => id !== studentId));
    } else {
      setSelected([...selected, studentId]);
    }
  };

  const handleAssign = () => {
    const studentsToAssign = allStudents.filter((student) => selected.includes(student.id));
    onAssign(studentsToAssign);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search students..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="max-h-[300px] overflow-y-auto border rounded-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2">
          {filteredStudents.map((student) => (
            <div
              key={student.id}
              className={`p-3 rounded-lg border flex items-center gap-2 cursor-pointer ${
                selected.includes(student.id) ? "bg-primary/10 border-primary/30" : ""
              }`}
              onClick={() => toggleStudent(student.id)}
            >
              <div
                className={`h-5 w-5 rounded-md flex items-center justify-center border ${
                  selected.includes(student.id)
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-muted-foreground"
                }`}
              >
                {selected.includes(student.id) && <Check className="h-3 w-3" />}
              </div>
              <div>
                <p className="font-medium text-sm">{student.name}</p>
                <p className="text-xs text-muted-foreground">{`${student.grade} - ${student.subject}`}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <p className="text-sm text-muted-foreground">
          {selected.length} student{selected.length !== 1 ? "s" : ""} selected
        </p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setSelected([])} disabled={selected.length === 0}>
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
          <Button onClick={handleAssign}>
            <Check className="h-4 w-4 mr-1" />
            Assign to {selected.length} Student{selected.length !== 1 ? "s" : ""}
          </Button>
        </div>
      </div>
    </div>
  );
}