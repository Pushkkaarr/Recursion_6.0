
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const calculateTimeTaken = (startTime: number, endTime: number): number => {
  return Math.floor((endTime - startTime) / 1000);
};

export const getTimerColorClass = (remainingTime: number, totalDuration: number): string => {
  const percentage = remainingTime / (totalDuration * 60);
  
  if (percentage <= 0.25) {
    return 'text-quiz-timer-danger';
  } else if (percentage <= 0.5) {
    return 'text-quiz-timer-warning';
  } else {
    return 'text-quiz-timer-normal';
  }
};
