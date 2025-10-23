import React, { useState } from 'react';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { useToast } from '../contexts/ToastContext';

interface CreateProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; description: string; tags: string[] }) => Promise<void>;
}

export const CreateProposalModal: React.FC<CreateProposalModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async () => {
    if (!title || !description) {
      addToast('Title and description are required.', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);
      await onSubmit({ title, description, tags: tagsArray });
      setTitle('');
      setDescription('');
      setTags('');
      onClose();
    } catch (err) {
      addToast('Failed to create proposal. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Proposal"
      footer={
        <div className="flex space-x-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Create Proposal'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <Input
          id="proposal-title"
          label="Proposal Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Fund a new park"
        />
        <div>
          <label htmlFor="proposal-description" className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-1">Description</label>
          <textarea
            id="proposal-description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-md shadow-sm bg-white dark:bg-dark-card focus:outline-none focus:ring-1 focus:ring-brand-primary dark:focus:ring-brand-accent focus:border-brand-primary dark:focus:border-brand-accent"
            placeholder="Provide details about your proposal..."
          ></textarea>
        </div>
         <Input
          id="proposal-tags"
          label="Tags (comma-separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g., community, parks, funding"
        />
        <p className="text-sm text-gray-500 dark:text-dark-text-secondary">Note: The voting deadline will be automatically set to 48 hours from creation.</p>
      </div>
    </Modal>
  );
};