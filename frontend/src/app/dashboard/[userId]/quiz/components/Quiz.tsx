import React, { useRef, useState, useEffect } from 'react';
import { QuizSchedule, QuizState, UserAnswer, QuestionType } from '../types';
import Timer from './Timer';
import Question from './Question';
import CheatDetection from './CheatDetection';

interface QuizProps {
  quiz: QuizSchedule;
  currentQuestionIndex: number;
  quizState: QuizState;
  userAnswers: UserAnswer[];
  timeRemaining: number;
  onAnswer: (answer: string) => void;
  onNextQuestion: () => void;
  onPrevQuestion: () => void;
  onSubmit: () => void;
  onAddViolation: (type: 'BLUR' | 'KEY' | 'RIGHT_CLICK') => void;
  violations: { type: 'BLUR' | 'KEY' | 'RIGHT_CLICK', timestamp: number }[];
}

const Quiz: React.FC<QuizProps> = ({
  quiz,
  currentQuestionIndex,
  quizState,
  userAnswers,
  timeRemaining,
  onAnswer,
  onNextQuestion,
  onPrevQuestion,
  onSubmit,
  onAddViolation,
  violations
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null!);
  
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const userAnswer = userAnswers.find(a => a.questionId === currentQuestion.id)?.answer;
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  
  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit();
      setIsSubmitting(false);
    }, 1000);
  };

  // Progress calculation
  const answeredCount = userAnswers.length;
  const progress = (answeredCount / quiz.questions.length) * 100;
  
  return (
    <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Left Sidebar */}
      <div className="md:col-span-1 space-y-6">
        <Timer 
          remainingTime={timeRemaining} 
          totalDuration={quiz.duration}
        />
        
        <CheatDetection
          isActive={quizState === QuizState.IN_PROGRESS}
          violations={violations}
          onViolation={onAddViolation}
          currentInputRef={currentQuestion.type === QuestionType.TEXT_INPUT ? inputRef : undefined}
        />
        
        <div className="p-4 backdrop-blur-md bg-white bg-opacity-70 border border-white border-opacity-20 shadow-lg rounded-2xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-500">Progress</span>
            <span className="text-sm font-medium">{answeredCount} of {quiz.questions.length}</span>
          </div>
          
          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        <div className="p-4 backdrop-blur-md bg-white bg-opacity-70 border border-white border-opacity-20 shadow-lg rounded-2xl">
          <h3 className="text-base font-medium mb-3">Quiz Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Title</span>
              <span className="font-medium">{quiz.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Questions</span>
              <span className="font-medium">{quiz.questions.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Duration</span>
              <span className="font-medium">{quiz.duration} minutes</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="md:col-span-2">
        <div className="p-6 md:p-8 mb-6 backdrop-blur-md bg-white bg-opacity-70 border border-white border-opacity-20 shadow-lg rounded-2xl">
          <Question
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={quiz.questions.length}
            userAnswer={userAnswer}
            onAnswer={onAnswer}
            disabled={quizState !== QuizState.IN_PROGRESS}
            ref={inputRef}
          />
        </div>
        
        <div className="flex justify-between mt-6">
          <button
            onClick={onPrevQuestion}
            disabled={isFirstQuestion || isSubmitting || quizState !== QuizState.IN_PROGRESS}
            className={`px-5 py-2.5 rounded-full font-medium transition-all ${
              isFirstQuestion ? 'opacity-0 cursor-default' : 'border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Previous
          </button>
          
          {isLastQuestion ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || quizState !== QuizState.IN_PROGRESS}
              className={`bg-blue-500 text-white font-medium px-5 py-2.5 rounded-full 
              shadow-sm transition-all duration-300 hover:bg-blue-600 active:bg-blue-700 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${isSubmitting ? 'opacity-75' : ''}`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          ) : (
            <button
              onClick={onNextQuestion}
              disabled={isSubmitting || quizState !== QuizState.IN_PROGRESS}
              className="bg-blue-500 text-white font-medium px-5 py-2.5 rounded-full 
              shadow-sm transition-all duration-300 hover:bg-blue-600 active:bg-blue-700 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Next Question
            </button>
          )}
        </div>
        
        <div className="flex justify-center mt-8">
          <div className="flex space-x-1.5">
            {quiz.questions.map((_, index) => {
              const isAnswered = userAnswers.some(a => a.questionId === quiz.questions[index].id);
              const isCurrent = index === currentQuestionIndex;
              
              return (
                <div 
                  key={index}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    isCurrent 
                      ? 'bg-blue-500 scale-125' 
                      : isAnswered 
                        ? 'bg-blue-500 opacity-50' 
                        : 'bg-gray-300'
                  }`}
                ></div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
