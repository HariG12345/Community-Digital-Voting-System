import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClasses = 'px-4 py-2 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-dark-card transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105';

  const variantClasses = {
    primary: 'bg-brand-primary text-white hover:bg-brand-secondary focus:ring-brand-primary dark:bg-brand-accent dark:text-dark-bg dark:hover:bg-brand-accent-hover dark:focus:ring-brand-accent',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400 dark:bg-dark-border dark:text-dark-text-primary dark:hover:bg-gray-600 dark:focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'bg-transparent text-brand-primary hover:bg-indigo-100 focus:ring-brand-primary dark:text-brand-accent dark:hover:bg-brand-accent/20'
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};