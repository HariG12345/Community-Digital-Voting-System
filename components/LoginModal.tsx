import React, { useState } from 'react';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface LoginModalProps {
  isOpen: boolean;
  onLogin: (username: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onLogin }) => {
  const [username, setUsername] = useState('Hari G');

  const handleLogin = () => {
    if (username.trim()) {
      onLogin(username.trim());
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} title="Welcome! Please identify yourself.">
      <div className="space-y-4">
        <p className="text-gray-600 dark:text-dark-text-secondary">To participate in voting, please enter your name. This is a mock login for prototype purposes.</p>
        <Input 
          id="username"
          label="Your Name"
          value={username} 
          onChange={(e) => setUsername(e.target.value)}
          placeholder="e.g., Jane Doe" 
          onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
        />
      </div>
      <div className="mt-6 flex justify-end">
        <Button onClick={handleLogin} disabled={!username.trim()}>
          Continue as {username.trim() || '...'}
        </Button>
      </div>
    </Modal>
  );
};