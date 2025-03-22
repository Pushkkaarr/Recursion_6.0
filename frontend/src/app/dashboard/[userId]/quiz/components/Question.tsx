import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { Question as QuestionType, QuestionType as QuestionTypeEnum } from '../types';

interface QuestionProps {
  question: QuestionType;
  questionNumber: number;
  totalQuestions: number;
  userAnswer?: string;
  onAnswer: (answer: string) => void;
  disabled?: boolean;
  showCorrectAnswer?: boolean;
}

const Question = forwardRef<HTMLInputElement, QuestionProps>(({
  question,
  questionNumber,
  totalQuestions,
  userAnswer,
  onAnswer,
  disabled = false,
  showCorrectAnswer = false
}, ref) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(userAnswer || null);
  const [inputValue, setInputValue] = useState<string>(userAnswer || '');
  const inputRef = useRef<HTMLInputElement>(null);

  // Combine the refs
  const combinedRef = (node: HTMLInputElement) => {
    // Update our internal ref
    if (inputRef.current !== node) {
      inputRef.current = node;
    }
    
    // Forward to any ref passed from the parent
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  useEffect(() => {
    // Update local state when userAnswer prop changes
    if (userAnswer) {
      if (question.type === QuestionTypeEnum.MULTIPLE_CHOICE) {
        setSelectedOption(userAnswer);
      } else {
        setInputValue(userAnswer);
      }
    } else {
      setSelectedOption(null);
      setInputValue('');
    }
  }, [userAnswer, question.type]);

  const handleOptionClick = (option: string) => {
    if (disabled) return;
    
    setSelectedOption(option);
    onAnswer(option);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    const value = e.target.value;
    setInputValue(value);
    onAnswer(value);
  };

  return (
    <div className="w-full animate-fade-in">
      <div className="mb-6 flex justify-between items-center">
        <span className="text-sm font-medium text-gray-500">
          Question {questionNumber} of {totalQuestions}
        </span>
        
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
          {question.type === QuestionTypeEnum.MULTIPLE_CHOICE ? 'Multiple Choice' : 'Text Input'}
        </span>
      </div>
      
      <h3 className="text-xl font-medium mb-6">{question.text}</h3>
      
      {question.type === QuestionTypeEnum.MULTIPLE_CHOICE && question.options ? (
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <div
              key={index}
              className={`bg-white border rounded-xl p-4 transition-all duration-200 cursor-pointer flex items-center gap-3 ${
                selectedOption === option 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-500'
              } ${
                showCorrectAnswer && option === question.correctAnswer 
                  ? 'border-green-500 bg-green-50' 
                  : ''
              } ${
                showCorrectAnswer && selectedOption === option && option !== question.correctAnswer 
                  ? 'border-red-500 bg-red-50' 
                  : ''
              }`}
              onClick={() => handleOptionClick(option)}
            >
              <div 
                className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                  selectedOption === option 
                    ? 'border-blue-500 bg-blue-500' 
                    : 'border-gray-300 bg-white'
                }`}
              >
                {selectedOption === option && (
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                )}
              </div>
              <span>{option}</span>
              
              {showCorrectAnswer && option === question.correctAnswer && (
                <span className="ml-auto text-green-600 text-sm font-medium">Correct</span>
              )}
              
              {showCorrectAnswer && selectedOption === option && option !== question.correctAnswer && (
                <span className="ml-auto text-red-600 text-sm font-medium">Incorrect</span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div>
          <input
            ref={combinedRef}
            type="text"
            className={`w-full p-4 rounded-xl border outline-none transition-colors ${
              disabled ? 'bg-gray-50' : 'bg-white'
            } ${
              showCorrectAnswer 
                ? inputValue.toLowerCase() === question.correctAnswer.toLowerCase()
                  ? 'border-green-500'
                  : 'border-red-500'
                : 'border-gray-200 focus:border-blue-500'
            }`}
            placeholder="Type your answer here..."
            value={inputValue}
            onChange={handleInputChange}
            disabled={disabled}
          />
          
          {showCorrectAnswer && (
            <div className="mt-3 text-sm">
              <span className="font-medium">Correct answer:</span>{' '}
              <span className="text-green-600">{question.correctAnswer}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

Question.displayName = 'Question';

export default Question;