import React, { useState, useEffect, useCallback } from 'react';
import { Modal } from './ui/Modal';
import { Spinner } from './ui/Spinner';
import { Avatar } from './ui/Avatar';
import { Button } from './ui/Button';
import { getUserById, followUser, unfollowUser } from '../services/api';
import { UserWithStats } from '../types';
import { useToast } from '../contexts/ToastContext';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  currentUserId?: number;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose, userId, currentUserId }) => {
  const [user, setUser] = useState<UserWithStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getUserById(userId);
      setUser(data);
    } catch (error) {
      addToast('Failed to load user profile.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [userId, addToast]);

  useEffect(() => {
    if (isOpen) {
      fetchProfile();
    }
  }, [isOpen, fetchProfile]);

  const handleFollow = async () => {
    if (!currentUserId || !user) return;
    try {
      await followUser(currentUserId, user.id);
      addToast(`You are now following ${user.name}`, 'success');
      fetchProfile(); // Refetch to update follower count and button state
    } catch {
      addToast('Failed to follow user.', 'error');
    }
  }

  const handleUnfollow = async () => {
    if (!currentUserId || !user) return;
    try {
      await unfollowUser(currentUserId, user.id);
      addToast(`You have unfollowed ${user.name}`, 'info');
      fetchProfile(); // Refetch
    } catch {
      addToast('Failed to unfollow user.', 'error');
    }
  }

  const isFollowing = user?.followers.includes(currentUserId || -1);
  const isSelf = currentUserId === userId;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="User Profile">
      {isLoading ? (
        <Spinner />
      ) : user ? (
        <div className="flex flex-col items-center space-y-4">
          <Avatar name={user.name} className="h-24 w-24 text-4xl ring-4 ring-white dark:ring-dark-card ring-offset-4 ring-offset-gray-100 dark:ring-offset-dark-bg" />
          <div className="text-center">
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-sm text-gray-500 dark:text-dark-text-secondary">Member since {new Date(user.joinDate).toLocaleDateString()}</p>
          </div>
          <div className="flex space-x-8 pt-4 text-center">
            <div><div className="text-2xl font-bold text-brand-primary dark:text-brand-accent">{user.proposalsCreated}</div><div className="text-sm text-gray-500">Proposals</div></div>
            <div><div className="text-2xl font-bold text-brand-primary dark:text-brand-accent">{user.votesCast}</div><div className="text-sm text-gray-500">Votes Cast</div></div>
            <div><div className="text-2xl font-bold text-brand-primary dark:text-brand-accent">{user.followers.length}</div><div className="text-sm text-gray-500">Followers</div></div>
          </div>
          {!isSelf && currentUserId && (
            <div className="pt-4">
              {isFollowing ? (
                 <Button variant="secondary" onClick={handleUnfollow}>Unfollow</Button>
              ) : (
                <Button variant="primary" onClick={handleFollow}>Follow</Button>
              )}
            </div>
          )}
        </div>
      ) : (
        <p>Could not load user profile.</p>
      )}
    </Modal>
  );
};
