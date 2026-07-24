import { useState, useEffect } from 'react';
import { formatTime12Hour } from '../utils/dateUtils';

export const useLiveClock = () => {
  const [currentTime, setCurrentTime] = useState(formatTime12Hour());
  const [currentDate, setCurrentDate] = useState(new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }));

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(formatTime12Hour(now));
      setCurrentDate(now.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return { currentTime, currentDate };
};
