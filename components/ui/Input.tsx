import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export const Input: React.FC<InputProps> = ({ label, id, ...props }) => {
  return (
    <div className="relative">
        {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-1">{label}</label>}
        <input
            id={id}
            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-md shadow-sm bg-white dark:bg-dark-card focus:outline-none focus:ring-1 focus:ring-brand-primary dark:focus:ring-brand-accent focus:border-brand-primary dark:focus:border-brand-accent"
            {...props}
        />
    </div>
  );
};