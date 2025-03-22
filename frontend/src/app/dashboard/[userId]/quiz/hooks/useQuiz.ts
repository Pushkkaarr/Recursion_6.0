
import { useState, useEffect, useCallback, useRef } from 'react';
import { quizzes } from '../data/quizzes';
import { 
  QuizSchedule, 
  QuizState, 
  UserAnswer, 
  ViolationEvent, 
  QuizResult, 
  QuizContextType
} from '../types';

export const useQuiz = (): QuizContextType => {
  // State for quizzes and current quiz
  const [availableQuizzes, setAvailableQuizzes] = useState<QuizSchedule[]>(quizzes);
  const [currentQuiz, setCurrentQuiz] = useState<QuizSchedule | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [quizState, setQuizState] = useState<QuizState>(QuizState.NOT_STARTED);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [violations, setViolations] = useState<ViolationEvent[]>([]);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  
  // Refs
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  // Clear timer on component unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Start the quiz
  const startQuiz = useCallback((quizId: string) => {
    const quiz = availableQuizzes.find(q => q.id === quizId);
    
    if (!quiz) {
      console.error(`Quiz with ID ${quizId} not found.`);
      return;
    }
    
    setCurrentQuiz(quiz);
    setCurrentQuestion(0);
    setQuizState(QuizState.IN_PROGRESS);
    setUserAnswers([]);
    setTimeRemaining(quiz.duration * 60); // Convert minutes to seconds
    setViolations([]);
    setQuizResult(null);
    
    // Record start time
    startTimeRef.current = Date.now();
    
    // Start timer
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Time's up, end the quiz
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          setQuizState(QuizState.FAILED_TIMEOUT);
          generateQuizResult();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [availableQuizzes]);

  // Record an answer
  const answerQuestion = useCallback((answer: string) => {
    if (!currentQuiz || quizState !== QuizState.IN_PROGRESS) return;
    
    const question = currentQuiz.questions[currentQuestion];
    
    setUserAnswers(prev => {
      // Check if we already have an answer for this question
      const existingIndex = prev.findIndex(a => a.questionId === question.id);
      
      if (existingIndex !== -1) {
        // Update existing answer
        const updated = [...prev];
        updated[existingIndex] = { questionId: question.id, answer };
        return updated;
      } else {
        // Add new answer
        return [...prev, { questionId: question.id, answer }];
      }
    });
  }, [currentQuiz, currentQuestion, quizState]);

  // Navigation
  const nextQuestion = useCallback(() => {
    if (!currentQuiz || quizState !== QuizState.IN_PROGRESS) return;
    
    if (currentQuestion < currentQuiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  }, [currentQuiz, currentQuestion, quizState]);

  const previousQuestion = useCallback(() => {
    if (!currentQuiz || quizState !== QuizState.IN_PROGRESS) return;
    
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  }, [currentQuiz, currentQuestion, quizState]);

  // Submit quiz
  const submitQuiz = useCallback(() => {
    if (!currentQuiz || quizState !== QuizState.IN_PROGRESS) return;
    
    // Stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setQuizState(QuizState.COMPLETED);
    generateQuizResult();
  }, [currentQuiz, quizState]);

  // Reset quiz
  const resetQuiz = useCallback(() => {
    setCurrentQuiz(null);
    setCurrentQuestion(0);
    setQuizState(QuizState.NOT_STARTED);
    setUserAnswers([]);
    setTimeRemaining(0);
    setViolations([]);
    setQuizResult(null);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, []);

  // Add violation
  const addViolation = useCallback((type: ViolationEvent['type']) => {
    if (quizState !== QuizState.IN_PROGRESS) return;
    
    const newViolation: ViolationEvent = {
      type,
      timestamp: Date.now()
    };
    
    setViolations(prev => {
      const updated = [...prev, newViolation];
      
      // Check if we've reached the violation limit
      if (updated.length >= 5) {
        // End quiz due to cheating
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        
        setQuizState(QuizState.FAILED_CHEATING);
        generateQuizResult();
      }
      
      return updated;
    });
  }, [quizState]);

  // Helper to generate quiz result
  const generateQuizResult = useCallback(() => {
    if (!currentQuiz) return;
    
    let correctCount = 0;
    let incorrectCount = 0;
    
    currentQuiz.questions.forEach(question => {
      const userAnswer = userAnswers.find(a => a.questionId === question.id);
      
      if (userAnswer) {
        if (userAnswer.answer.toLowerCase() === question.correctAnswer.toLowerCase()) {
          correctCount++;
        } else {
          incorrectCount++;
        }
      } else {
        incorrectCount++;
      }
    });
    
    const totalQuestions = currentQuiz.questions.length;
    const percentageScore = Math.round((correctCount / totalQuestions) * 100);
    const timeTaken = Math.floor((Date.now() - startTimeRef.current) / 1000);
    
    const result: QuizResult = {
      quizId: currentQuiz.id,
      totalQuestions,
      correctAnswers: correctCount,
      incorrectAnswers: incorrectCount,
      percentageScore,
      timeTaken,
      violations: violations.length,
      state: quizState,
      userAnswers
    };
    
    setQuizResult(result);
    return result;
  }, [currentQuiz, userAnswers, quizState, violations]);

  return {
    availableQuizzes,
    currentQuiz,
    currentQuestion,
    quizState,
    userAnswers,
    timeRemaining,
    violations,
    quizResult,
    startQuiz,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    submitQuiz,
    resetQuiz,
    addViolation
  };
};
