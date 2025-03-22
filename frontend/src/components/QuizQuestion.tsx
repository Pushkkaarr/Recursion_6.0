'use client';

import React from 'react';

type QuestionProps = {
  question: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  };
  questionNumber: number;
  selectedAnswer: number;
  onSelectAnswer: (index: number) => void;
  showCorrectAnswer: boolean;
};

const QuizQuestion = ({
  question,
  questionNumber,
  selectedAnswer,
  onSelectAnswer,
  showCorrectAnswer,
}: QuestionProps) => {
  return (
    <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-3">
        {questionNumber}. {question.question}
      </h3>
      <div className="space-y-2">
        {question.options.map((option, index) => (
          <div
            key={index}
            className={`p-3 rounded-md cursor-pointer border ${
              selectedAnswer === index
                ? showCorrectAnswer
                  ? index === question.correctAnswer
                    ? 'bg-green-100 border-green-500'
                    : 'bg-red-100 border-red-500'
                  : 'bg-blue-100 border-blue-500'
                : showCorrectAnswer && index === question.correctAnswer
                ? 'bg-green-100 border-green-500'
                : 'hover:bg-gray-100 border-gray-300'
            }`}
            onClick={() => {
              if (!showCorrectAnswer) {
                onSelectAnswer(index);
              }
            }}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-2">
                <span 
                  className={`inline-block w-6 h-6 text-center rounded-full border ${
                    selectedAnswer === index
                      ? showCorrectAnswer
                        ? index === question.correctAnswer
                          ? 'bg-green-500 text-white border-green-500'
                          : 'bg-red-500 text-white border-red-500'
                        : 'bg-blue-500 text-white border-blue-500'
                      : showCorrectAnswer && index === question.correctAnswer
                      ? 'bg-green-500 text-white border-green-500'
                      : 'bg-gray-200 border-gray-300'
                  }`}
                >
                  {String.fromCharCode(65 + index)}
                </span>
              </div>
              <div className="flex-1">{option}</div>
            </div>
          </div>
        ))}
      </div>
      
      {showCorrectAnswer && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <p className="font-semibold">Explanation:</p>
          <p>{question.explanation}</p>
        </div>
      )}
    </div>
  );
};

export default QuizQuestion;
