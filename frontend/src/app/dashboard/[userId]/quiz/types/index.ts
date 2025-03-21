
export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TEXT_INPUT = 'TEXT_INPUT'
}

export enum QuizState {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED_CHEATING = 'FAILED_CHEATING',
  FAILED_TIMEOUT = 'FAILED_TIMEOUT'
}

export interface QuizSchedule {
  id: string;
  name: string;
  description: string;
  scheduledDate: Date;
  duration: number; // in minutes
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[]; // For multiple choice questions
  correctAnswer: string;
}

export interface UserAnswer {
  questionId: string;
  answer: string;
}

export interface QuizResult {
  quizId: string;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  percentageScore: number;
  timeTaken: number; // in seconds
  violations: number;
  state: QuizState;
  userAnswers: UserAnswer[];
}

export interface ViolationEvent {
  type: 'BLUR' | 'KEY' | 'RIGHT_CLICK';
  timestamp: number;
}

export interface QuizContextType {
  availableQuizzes: QuizSchedule[];
  currentQuiz: QuizSchedule | null;
  currentQuestion: number;
  quizState: QuizState;
  userAnswers: UserAnswer[];
  timeRemaining: number;
  violations: ViolationEvent[];
  quizResult: QuizResult | null;
  
  startQuiz: (quizId: string) => void;
  answerQuestion: (answer: string) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  submitQuiz: () => void;
  resetQuiz: () => void;
  addViolation: (type: ViolationEvent['type']) => void;
}
