import React, { useState } from 'react';
import { ProposalWithDetails, User } from '../types';
import { addComment } from '../services/api';
import { useToast } from '../contexts/ToastContext';
import { Button } from './ui/Button';
import { Avatar } from './ui/Avatar';
import { EmptyState } from './ui/EmptyState';
import { NoCommentsIllustration } from './ui/Illustrations';

interface CommentSectionProps {
  proposal: ProposalWithDetails;
  currentUser: User | null;
  onCommentAdded: () => void;
  onSelectUser: (userId: number) => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ proposal, currentUser, onCommentAdded, onSelectUser }) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await addComment(proposal.id, currentUser.id, currentUser.name, newComment);
      setNewComment('');
      onCommentAdded();
      addToast('Comment added!', 'success');
    } catch (error) {
      addToast('Failed to add comment.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h4 className="font-semibold text-lg">Discussion</h4>
      {currentUser && (
        <form onSubmit={handleSubmit} className="flex items-start space-x-3">
          <Avatar name={currentUser.name} />
          <div className="flex-1">
            <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-md shadow-sm bg-white dark:bg-dark-card focus:outline-none focus:ring-1 focus:ring-brand-primary dark:focus:ring-brand-accent focus:border-brand-primary dark:focus:border-brand-accent"
            />
            <div className="flex justify-end mt-2">
                <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
                {isSubmitting ? 'Posting...' : 'Post Comment'}
                </Button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {proposal.comments.length > 0 ? (
          proposal.comments.map(comment => (
            <div key={comment.id} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-dark-bg/50 rounded-lg">
              <button onClick={() => onSelectUser(comment.authorId)}><Avatar name={comment.authorName} /></button>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <button onClick={() => onSelectUser(comment.authorId)} className="font-semibold text-sm hover:underline">{comment.authorName}</button>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(comment.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-dark-text-secondary mt-1 whitespace-pre-wrap">{comment.content}</p>
              </div>
            </div>
          ))
        ) : (
          <EmptyState
            title="No Comments Yet"
            message="Be the first to share your thoughts and start the discussion!"
            illustration={<NoCommentsIllustration />}
          />
        )}
      </div>
    </div>
  );
};
