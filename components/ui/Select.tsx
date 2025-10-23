import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  children: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({ label, id, children, ...props }) => {
  return (
    <div>
      {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-1">{label}</label>}
      <select
        id={id}
        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-md shadow-sm bg-white dark:bg-dark-card focus:outline-none focus:ring-1 focus:ring-brand-primary dark:focus:ring-brand-accent focus:border-brand-primary dark:focus:border-brand-accent"
        {...props}
      >
        {children}
      </select>
    </div>
  );
};
