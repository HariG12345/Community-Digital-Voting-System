import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Logo } from './ui/Logo';
import { Avatar } from './ui/Avatar';
import { ToggleSwitch } from './ui/ToggleSwitch';
import { NotificationsPanel } from './NotificationsPanel';
import { User } from '../types';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
  onCreateProposal: () => void;
  onAdmin: () => void;
  onLeaderboard: () => void;
  onProfile: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout, onCreateProposal, onAdmin, onLeaderboard, onProfile, theme, toggleTheme }) => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  
  return (
    <header className="bg-white dark:bg-dark-card shadow-sm sticky top-0 z-40 border-b border-gray-200 dark:border-dark-border">
      <div className="container mx-auto px-4 md:px-8 py-3 flex justify-between items-center">
        <Logo />
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="hidden sm:flex items-center space-x-2">
            <span role="img" aria-label="sun" className="text-yellow-500 text-lg">☀️</span>
            <ToggleSwitch checked={theme === 'dark'} onChange={toggleTheme} />
            <span role="img" aria-label="moon" className="text-indigo-400 text-lg">🌙</span>
          </div>

          {user && (
            <>
              <Button onClick={onCreateProposal} className="hidden md:inline-flex !px-3 !py-1.5 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                New Proposal
              </Button>
              <NotificationsPanel onSelectProposal={() => { /* Implement proposal selection from notification */ }} />
              <div className="relative">
                <button onClick={() => setMenuOpen(!isMenuOpen)} className="block focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary dark:focus:ring-offset-dark-card rounded-full">
                  <Avatar name={user.name} />
                </button>
                {isMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-card rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 origin-top-right animate-fade-in"
                    onMouseLeave={() => setMenuOpen(false)}
                  >
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-dark-border">
                        <p className="text-sm">Signed in as</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.name}</p>
                    </div>
                    <button onClick={() => { onProfile(); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-dark-text-secondary hover:bg-gray-100 dark:hover:bg-gray-700">Your Profile</button>
                    <button onClick={() => { onLeaderboard(); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-dark-text-secondary hover:bg-gray-100 dark:hover:bg-gray-700">Leaderboard</button>
                    {user.name.toLowerCase() === 'admin' && <button onClick={() => { onAdmin(); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-dark-text-secondary hover:bg-gray-100 dark:hover:bg-gray-700">Admin Panel</button>}
                    <div className="border-t border-gray-100 dark:border-dark-border my-1"></div>
                    <button onClick={onLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10">Logout</button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};