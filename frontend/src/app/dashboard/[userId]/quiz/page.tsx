"use client"
import React, { useEffect, useRef } from 'react';
import { useQuiz } from './hooks/useQuiz';
import Calendar from './components/Calendar';
import Quiz from './components/Quiz';
import Results from './components/Results';
import { QuizState } from './types';

const QuizPage: React.FC = () => {
  const {
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
  } = useQuiz();

  // Create a smooth transition back to the Calendar when leaving the quiz
  const contentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.opacity = '0';
      contentRef.current.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        if (contentRef.current) {
          contentRef.current.style.opacity = '1';
          contentRef.current.style.transform = 'translateY(0)';
        }
      }, 50);
    }
  }, [quizState]);

  const renderContent = () => {
    if (!currentQuiz || quizState === QuizState.NOT_STARTED) {
      return <Calendar quizzes={availableQuizzes} onStartQuiz={startQuiz} />;
    }

    if (quizState === QuizState.IN_PROGRESS) {
      return (
        <Quiz
          quiz={currentQuiz}
          currentQuestionIndex={currentQuestion}
          quizState={quizState}
          userAnswers={userAnswers}
          timeRemaining={timeRemaining}
          onAnswer={answerQuestion}
          onNextQuestion={nextQuestion}
          onPrevQuestion={previousQuestion}
          onSubmit={submitQuiz}
          onAddViolation={addViolation}
          violations={violations}
        />
      );
    }

    if (quizResult) {
      return <Results result={quizResult} onRetry={() => startQuiz(currentQuiz.id)} onHome={resetQuiz} />;
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] py-12 px-4 sm:px-6 lg:px-8">
      <div
        ref={contentRef}
        className="w-full transition-all duration-500"
      >
        {renderContent()}
      </div>
    </div>
  );
};

export default QuizPage;
