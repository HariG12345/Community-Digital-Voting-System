// components/ui/Illustrations.tsx
import React from 'react';

export const NoProposalsIllustration: React.FC = () => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g className="stroke-current stroke-2 fill-none">
            <path d="M30 70 L70 70" strokeLinecap="round" />
            <path d="M30 60 L70 60" strokeLinecap="round" />
            <path d="M30 50 L50 50" strokeLinecap="round" />
            <rect x="20" y="30" width="60" height="50" rx="5" className="fill-gray-100 dark:fill-dark-card" />
            <circle cx="65" cy="25" r="10" className="fill-yellow-300 dark:fill-yellow-600" />
            <path d="M62 22 l6 6 m0 -6 l-6 6" className="stroke-yellow-800 dark:stroke-yellow-300" />
        </g>
    </svg>
);

export const NoResultsIllustration: React.FC = () => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
         <g className="stroke-current stroke-2 fill-none">
            <circle cx="45" cy="45" r="20" />
            <line x1="60" y1="60" x2="75" y2="75" strokeLinecap="round" />
            <path d="M35 55 L40 60 L55 45" className="stroke-red-500" strokeWidth="3" />
             <path d="M55 55 L40 40" className="stroke-red-500" strokeWidth="3" />
        </g>
    </svg>
);


export const NoCommentsIllustration: React.FC = () => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g className="stroke-current stroke-2 fill-none">
            <path d="M30 65 C 30 50, 70 50, 70 65" className="fill-gray-100 dark:fill-dark-card" />
            <path d="M20 50 L 30 65 L 40 50 Z" className="fill-gray-100 dark:fill-dark-card" />
            <path d="M60 40 L 70 25 L 80 40 Z" className="fill-blue-100 dark:fill-blue-900/50" />
        </g>
    </svg>
);

export const NoNotificationsIllustration: React.FC = () => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g className="stroke-current stroke-2 fill-none">
            <path d="M40 70 A 20 20 0 1 0 60 70 Z" />
            <path d="M50 70 V 75 A 5 5 0 0 0 55 80 H 45 A 5 5 0 0 0 50 75" />
            <path d="M50 30 L 50 20" strokeLinecap="round"/>
            <path d="M70 50 L 80 50" strokeLinecap="round"/>
            <path d="M30 50 L 20 50" strokeLinecap="round"/>
            <path d="M60 35 L 67 28" strokeLinecap="round"/>
            <path d="M40 35 L 33 28" strokeLinecap="round"/>
        </g>
    </svg>
);
