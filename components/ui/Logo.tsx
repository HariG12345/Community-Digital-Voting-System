import React from 'react';

export const Logo: React.FC = () => {
  return (
    <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.location.reload()}>
       <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-brand-primary dark:text-brand-accent">
            <path d="M7 12L12 2L17 12L12 22L7 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 17.02V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 2V6.98" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4.91016 9.00977L9.49016 11.0298" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19.0898 9.00977L14.5098 11.0298" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4.91016 14.9902L9.49016 12.9702" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19.0898 14.9902L14.5098 12.9702" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      <h1 className="text-base sm:text-lg font-bold text-gray-800 dark:text-dark-text-primary hidden sm:block">
        Community Digital Voting System
      </h1>
      <h1 className="text-lg font-bold text-gray-800 dark:text-dark-text-primary sm:hidden">
        CDVS
      </h1>
    </div>
  );
};
