import React from 'react';
import { QuizResult, QuizState } from '../types';
import { formatTime } from '../utils/timer';

interface ResultsProps {
  result: QuizResult;
  onRetry: () => void;
  onHome: () => void;
}

const Results: React.FC<ResultsProps> = ({ result, onRetry, onHome }) => {
  const getResultTitle = () => {
    switch (result.state) {
      case QuizState.COMPLETED:
        return result.percentageScore >= 70 
          ? 'Quiz Completed Successfully!' 
          : 'Quiz Completed';
      case QuizState.FAILED_CHEATING:
        return 'Quiz Failed - Excessive Violations';
      case QuizState.FAILED_TIMEOUT:
        return 'Quiz Failed - Time Ran Out';
      default:
        return 'Quiz Results';
    }
  };

  const getResultDescription = () => {
    switch (result.state) {
      case QuizState.COMPLETED:
        return result.percentageScore >= 70
          ? 'Great job! You have successfully completed the quiz.'
          : 'You have completed the quiz, but you might want to study more.';
      case QuizState.FAILED_CHEATING:
        return 'The quiz was ended automatically due to too many detected violations.';
      case QuizState.FAILED_TIMEOUT:
        return 'You ran out of time. The quiz was automatically submitted.';
      default:
        return '';
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-10 animate-scale-in">
      <div className="backdrop-blur-md bg-white bg-opacity-70 border border-white border-opacity-20 shadow-lg rounded-2xl p-8 flex flex-col items-center mb-8">
        <h1 className="text-3xl font-semibold mb-3">{getResultTitle()}</h1>
        <p className="text-gray-500 mb-8 text-center max-w-md">{getResultDescription()}</p>
        
        <div className="flex flex-col items-center">
          <span className={`text-6xl font-bold ${
            result.state === QuizState.FAILED_CHEATING || result.state === QuizState.FAILED_TIMEOUT
              ? 'text-red-500'
              : result.percentageScore >= 70
                ? 'text-green-600'
                : 'text-red-500'
          }`}>
            {result.percentageScore}%
          </span>
          <span className="text-sm text-gray-500 mt-2">Your Score</span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-10 w-full">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-semibold">{result.correctAnswers}</span>
            <span className="text-sm text-gray-500 mt-1">Correct</span>
          </div>
          
          <div className="flex flex-col items-center">
            <span className="text-3xl font-semibold">{result.incorrectAnswers}</span>
            <span className="text-sm text-gray-500 mt-1">Incorrect</span>
          </div>
          
          <div className="flex flex-col items-center">
            <span className="text-3xl font-semibold">{formatTime(result.timeTaken)}</span>
            <span className="text-sm text-gray-500 mt-1">Time Taken</span>
          </div>
          
          <div className="flex flex-col items-center">
            <span className="text-3xl font-semibold">{result.violations}</span>
            <span className="text-sm text-gray-500 mt-1">Violations</span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 justify-center">
        <button 
          onClick={onRetry} 
          className="bg-blue-500 text-white font-medium px-5 py-2.5 rounded-full shadow-sm transition-all duration-300 hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Try Again
        </button>
        <button 
          onClick={onHome} 
          className="px-5 py-2.5 border border-gray-200 text-gray-900 font-medium rounded-full transition-all hover:bg-gray-50"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default Results;