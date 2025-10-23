import React from 'react';

interface EmptyStateProps {
  title: string;
  message: string;
  illustration?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, message, illustration }) => {
  return (
    <div className="text-center py-16 px-6 bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border">
      <div className="mx-auto h-24 w-24 text-gray-400 dark:text-gray-500">
        {illustration || (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        )}
      </div>
      <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-dark-text-primary">{title}</h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-dark-text-secondary">{message}</p>
    </div>
  );
};
