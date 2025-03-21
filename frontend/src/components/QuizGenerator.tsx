'use client';

import { useState } from 'react';
import QuizQuestion from './QuizQuestion';

type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};

const QuizGenerator = () => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [numQuestions, setNumQuestions] = useState(5);
  const [quizData, setQuizData] = useState<QuizQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const generateQuiz = async () => {
    setIsLoading(true);
    setError('');
    setShowResults(false);
    setQuizData([]);
    setUserAnswers([]);

    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          difficulty,
          numQuestions,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate quiz');
      }

      const data = await response.json();
      setQuizData(data.quiz);
      setUserAnswers(new Array(data.quiz.length).fill(-1));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[questionIndex] = answerIndex;
    setUserAnswers(newAnswers);
  };

  const submitQuiz = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    quizData.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return {
      score: correct,
      total: quizData.length,
      percentage: Math.round((correct / quizData.length) * 100),
    };
  };

  const resetQuiz = () => {
    setShowResults(false);
    setQuizData([]);
    setUserAnswers([]);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">AI Quiz Generator</h1>

      {!quizData.length ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Generate a Quiz</h2>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="topic">
              Topic
            </label>
            <input
              id="topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter a topic (e.g., World History)"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="difficulty">
              Difficulty
            </label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="numQuestions">
              Number of Questions
            </label>
            <input
              id="numQuestions"
              type="number"
              min="1"
              max="20"
              value={numQuestions}
              onChange={(e) => setNumQuestions(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <button
            onClick={generateQuiz}
            disabled={isLoading || !topic}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md disabled:bg-blue-300"
          >
            {isLoading ? 'Generating Quiz...' : 'Generate Quiz'}
          </button>
          {error && <p className="mt-4 text-red-500">{error}</p>}
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Quiz on: {topic} ({difficulty})
          </h2>
          
          {quizData.map((question, qIndex) => (
            <QuizQuestion
              key={qIndex}
              question={question}
              questionNumber={qIndex + 1}
              selectedAnswer={userAnswers[qIndex]}
              onSelectAnswer={(answer) => handleAnswerSelect(qIndex, answer)}
              showCorrectAnswer={showResults}
            />
          ))}
          
          {!showResults ? (
            <div className="mt-6 flex space-x-4">
              <button
                onClick={submitQuiz}
                disabled={userAnswers.includes(-1)}
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-md disabled:bg-green-300"
              >
                Submit Quiz
              </button>
              <button
                onClick={resetQuiz}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-md"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Quiz Results</h3>
              {(() => {
                const result = calculateScore();
                return (
                  <div>
                    <p className="text-lg">
                      You scored {result.score} out of {result.total} (
                      {result.percentage}%)
                    </p>
                    {result.percentage >= 80 ? (
                      <p className="text-green-600 mt-2">Excellent job!</p>
                    ) : result.percentage >= 60 ? (
                      <p className="text-blue-600 mt-2">Good effort!</p>
                    ) : (
                      <p className="text-orange-600 mt-2">Keep practicing!</p>
                    )}
                  </div>
                );
              })()}
              <button
                onClick={resetQuiz}
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-md"
              >
                Generate New Quiz
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizGenerator;
