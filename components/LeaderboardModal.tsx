import React, { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { Spinner } from './ui/Spinner';
import { getLeaderboard } from '../services/api';
import { LeaderboardUser } from '../types';
import { Avatar } from './ui/Avatar';
import { useToast } from '../contexts/ToastContext';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUser: (userId: number) => void;
}

const medalInfo = [
  { emoji: '🥇', color: 'text-yellow-400', shadow: 'shadow-yellow-400/50' },
  { emoji: '🥈', color: 'text-gray-400', shadow: 'shadow-gray-400/50' },
  { emoji: '🥉', color: 'text-orange-400', shadow: 'shadow-orange-400/50' },
];

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose, onSelectUser }) => {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      const fetchLeaderboard = async () => {
        setIsLoading(true);
        try {
          const data = await getLeaderboard();
          setUsers(data);
        } catch (error) {
          addToast('Failed to load leaderboard.', 'error');
        } finally {
          setIsLoading(false);
        }
      };
      fetchLeaderboard();
    }
  }, [isOpen, addToast]);

  const handleUserClick = (userId: number) => {
    onClose();
    onSelectUser(userId);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Community Leaderboard">
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="space-y-2">
          {users.map((user, index) => (
            <div 
              key={user.id} 
              className={`flex items-center p-3 rounded-lg transition-colors duration-200 cursor-pointer ${index < 3 ? 'bg-indigo-50 dark:bg-dark-bg' : 'bg-gray-50 dark:bg-dark-card/50'} hover:bg-indigo-100 dark:hover:bg-indigo-900/40`}
              onClick={() => handleUserClick(user.id)}
            >
              <div className="flex-shrink-0 w-10 text-2xl text-center font-bold">
                {index < 3 ? (
                  <span className={`${medalInfo[index].color} drop-shadow-lg ${medalInfo[index].shadow}`}>{medalInfo[index].emoji}</span>
                ) : (
                  <span className="text-gray-500 dark:text-gray-400">{index + 1}</span>
                )}
              </div>
              <div className="flex items-center space-x-3 flex-grow">
                <Avatar name={user.name} />
                <span className="font-semibold text-gray-800 dark:text-gray-200">{user.name}</span>
              </div>
              <div className="text-right text-sm">
                <div className="font-bold text-brand-primary dark:text-brand-accent">{user.communityScore} pts</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                    {user.proposalsCreated} proposals, {user.votesCast} votes
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
};