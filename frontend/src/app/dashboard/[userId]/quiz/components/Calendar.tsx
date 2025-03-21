import React, { useMemo } from 'react';
import { format, isToday, isSameWeek } from 'date-fns';
import { QuizSchedule } from '../types';

interface CalendarProps {
  quizzes: QuizSchedule[];
  onStartQuiz: (quizId: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({ quizzes, onStartQuiz }) => {
  const { todayQuizzes, upcomingQuizzes } = useMemo(() => {
    // Filter quizzes for today
    const today = quizzes.filter(quiz => isToday(quiz.scheduledDate));
    
    // Filter quizzes for the rest of the week, excluding today
    const upcoming = quizzes.filter(quiz => 
      !isToday(quiz.scheduledDate) && 
      isSameWeek(quiz.scheduledDate, new Date())
    );
    
    return {
      todayQuizzes: today,
      upcomingQuizzes: upcoming
    };
  }, [quizzes]);

  return (
    <div className="w-full max-w-4xl mx-auto animate-scale-in">
      <h1 className="text-4xl font-semibold mb-8 text-center">Scheduled Quizzes</h1>
      
      {/* Today's Quizzes */}
      <div className="mb-12">
        <h2 className="text-xl font-medium mb-4 inline-flex items-center">
          <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
          Today's Quizzes
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {todayQuizzes.length > 0 ? (
            todayQuizzes.map(quiz => (
              <div 
                key={quiz.id} 
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md p-6 flex flex-col h-full group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-medium mb-1 group-hover:text-blue-500 transition-colors">
                      {quiz.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {format(quiz.scheduledDate, "h:mm a")} • {quiz.duration} minutes
                    </p>
                  </div>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    Today
                  </span>
                </div>
                
                <p className="text-sm mb-6 flex-grow">
                  {quiz.description}
                </p>
                
                <div className="mt-auto">
                  <button 
                    className="w-full bg-blue-500 text-white font-medium px-5 py-2.5 rounded-full shadow-sm transition-all duration-300 hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    onClick={() => onStartQuiz(quiz.id)}
                  >
                    Take Quiz
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-6 border border-dashed border-gray-200 rounded-xl bg-white bg-opacity-50">
              <p className="text-gray-500">No quizzes scheduled for today</p>
            </div>
          )}
        </div>
      </div>
      
      {/* This Week's Quizzes */}
      <div>
        <h2 className="text-xl font-medium mb-4 inline-flex items-center">
          <span className="inline-block w-3 h-3 bg-gray-400 rounded-full mr-2"></span>
          This Week
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {upcomingQuizzes.length > 0 ? (
            upcomingQuizzes.map(quiz => (
              <div 
                key={quiz.id} 
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md p-6 flex flex-col h-full group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-medium mb-1 group-hover:text-blue-500 transition-colors">
                      {quiz.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {format(quiz.scheduledDate, "EEEE, MMM d")} • {quiz.duration} minutes
                    </p>
                  </div>
                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                    {format(quiz.scheduledDate, "E")}
                  </span>
                </div>
                
                <p className="text-sm mb-6 flex-grow">
                  {quiz.description}
                </p>
                
                <div className="mt-auto">
                  <button
                    className="w-full py-2.5 border border-gray-200 text-blue-500 font-medium rounded-full transition-all hover:bg-gray-50"
                    disabled
                  >
                    Coming Soon
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-6 border border-dashed border-gray-200 rounded-xl bg-white bg-opacity-50">
              <p className="text-gray-500">No more quizzes scheduled for this week</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;