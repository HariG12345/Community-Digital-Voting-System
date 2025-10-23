import React from 'react';
import { useTimer } from '../hooks/useTimer';

interface CountdownTimerProps {
  deadline: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ deadline }) => {
  const timeLeft = useTimer(deadline);

  if (!timeLeft) {
    return <span className="font-semibold text-gray-500 dark:text-dark-text-secondary">Voting Closed</span>;
  }

  return (
    <div className="flex space-x-2 text-sm text-gray-700 dark:text-dark-text-secondary">
      {Object.entries(timeLeft).map(([interval, value]) => (
        <div key={interval} className="flex flex-col items-center bg-white/50 dark:bg-white/10 p-2 rounded-md w-16">
          <span className="text-2xl font-bold text-brand-primary dark:text-brand-accent">{String(value).padStart(2, '0')}</span>
          <span className="text-xs uppercase text-gray-500 dark:text-dark-text-secondary">{interval}</span>
        </div>
      ))}
    </div>
  );
};