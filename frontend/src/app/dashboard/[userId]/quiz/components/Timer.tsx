import React, { useEffect, useState } from 'react';
import { formatTime, getTimerColorClass } from '../utils/timer';

interface TimerProps {
  remainingTime: number;
  totalDuration: number;
  onTimeUp?: () => void;
}

const Timer: React.FC<TimerProps> = ({ remainingTime, totalDuration, onTimeUp }) => {
  const [isWarning, setIsWarning] = useState(false);
  const [isDanger, setIsDanger] = useState(false);
  
  useEffect(() => {
    const percentage = remainingTime / (totalDuration * 60);
    
    setIsWarning(percentage <= 0.5 && percentage > 0.25);
    setIsDanger(percentage <= 0.25);
    
    if (remainingTime <= 0 && onTimeUp) {
      onTimeUp();
    }
  }, [remainingTime, totalDuration, onTimeUp]);

  const colorClass = getTimerColorClass(remainingTime, totalDuration);
  const progressPercentage = Math.min(100, Math.max(0, (remainingTime / (totalDuration * 60)) * 100));

  return (
    <div className="p-4 flex flex-col items-center backdrop-blur-md bg-white bg-opacity-70 border border-white border-opacity-20 shadow-lg rounded-2xl">
      <div className="text-sm font-medium text-gray-500 mb-1">Time Remaining</div>
      
      <div className={`text-3xl font-bold transition-colors ${
        isDanger ? 'text-red-500 animate-pulse' : 
        isWarning ? 'text-orange-500' : 
        'text-blue-500'
      }`}>
        {formatTime(remainingTime)}
      </div>
      
      <div className="w-full h-1.5 bg-gray-200 rounded-full mt-3 overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ease-linear ${
            isDanger ? 'bg-red-500' : 
            isWarning ? 'bg-orange-500' : 
            'bg-blue-500'
          }`}
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Timer;