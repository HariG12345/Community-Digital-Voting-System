import React, { useState, useEffect, useCallback } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Spinner } from './ui/Spinner';
import { VoteChart } from './VoteChart';
import { VoterList } from './VoterList';
import { CommentSection } from './CommentSection';
import { AISummary } from './AISummary';
import { getProposalById, castVote } from '../services/api';
import { ProposalWithDetails, VoteOption, ProposalStatus, User } from '../types';
import { useToast } from '../contexts/ToastContext';
import { CountdownTimer } from './CountdownTimer';


interface ProposalDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposalId: number;
  currentUser: User | null;
  onVoteCasted: () => void;
  onSelectUser: (userId: number) => void;
}

export const ProposalDetailModal: React.FC<ProposalDetailModalProps> = ({ isOpen, onClose, proposalId, currentUser, onVoteCasted, onSelectUser }) => {
  const [proposal, setProposal] = useState<ProposalWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVoting, setIsVoting] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const { addToast } = useToast();
  
  const fetchProposal = useCallback(async () => {
    if (!proposalId) return;
    setIsLoading(true);
    try {
      const data = await getProposalById(proposalId);
      setProposal(data);
    } catch (error) {
      addToast('Failed to load proposal details.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [proposalId, addToast]);
  
  useEffect(() => {
    if (isOpen) {
      setActiveTab('details');
      fetchProposal();
    }
  }, [isOpen, fetchProposal]);

  const handleVote = async (vote: VoteOption) => {
    if (!currentUser || !proposal) {
        addToast('You must be logged in to vote.', 'error');
        return;
    }
    setIsVoting(true);
    try {
        await castVote(proposal.id, currentUser.id, currentUser.name, vote);
        addToast('Your vote has been cast!', 'success');
        fetchProposal();
        onVoteCasted();
    } catch (error: any) {
        addToast(error.message || 'Failed to cast vote.', 'error');
    } finally {
        setIsVoting(false);
    }
  }

  const userHasVoted = proposal?.votes.some(v => v.voterId === currentUser?.id);
  const canVote = proposal?.status === ProposalStatus.ACTIVE && currentUser && !userHasVoted;

  const renderContent = () => {
    if (!proposal) return null;
    switch(activeTab) {
      case 'details':
        return (
          <div className="space-y-4">
             <p className="text-gray-600 dark:text-dark-text-secondary whitespace-pre-wrap">{proposal.description}</p>
             <AISummary proposal={proposal} />
          </div>
        );
      case 'results':
        return (
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Current Results</h4>
            <VoteChart votes={proposal.votes} />
            <VoterList votes={proposal.votes} onSelectUser={onSelectUser} />
          </div>
        );
      case 'discussion':
        return <CommentSection proposal={proposal} currentUser={currentUser} onCommentAdded={fetchProposal} onSelectUser={onSelectUser} />;
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={proposal?.title || 'Loading...'}>
      {isLoading ? <Spinner /> : proposal ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center text-sm text-gray-500 dark:text-dark-text-secondary">
            <button onClick={() => onSelectUser(proposal.authorId)} className="hover:underline">By {proposal.authorName}</button>
            <span>Created: {new Date(proposal.createdAt).toLocaleDateString()}</span>
          </div>

          {proposal.status === ProposalStatus.ACTIVE ? (
             <div className="p-3 rounded-lg bg-indigo-50 dark:bg-dark-bg text-center">
                <p className="text-sm font-semibold mb-2">Voting ends in:</p>
                <CountdownTimer deadline={proposal.deadline} />
            </div>
          ) : (
             <div className="p-3 rounded-lg bg-gray-100 dark:bg-dark-bg text-center">
                <p className="font-bold text-lg">Voting is {proposal.status}.</p>
             </div>
          )}

          <div className="border-b border-gray-200 dark:border-dark-border">
            <nav className="-mb-px flex space-x-4" aria-label="Tabs">
              <button onClick={() => setActiveTab('details')} className={`${activeTab === 'details' ? 'border-brand-primary dark:border-brand-accent text-brand-primary dark:text-brand-accent' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:border-gray-300'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}>Details</button>
              <button onClick={() => setActiveTab('results')} className={`${activeTab === 'results' ? 'border-brand-primary dark:border-brand-accent text-brand-primary dark:text-brand-accent' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:border-gray-300'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}>Results & Voters</button>
              <button onClick={() => setActiveTab('discussion')} className={`${activeTab === 'discussion' ? 'border-brand-primary dark:border-brand-accent text-brand-primary dark:text-brand-accent' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:border-gray-300'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}>Discussion</button>
            </nav>
          </div>

          <div className="animate-fade-in">{renderContent()}</div>

          {canVote && (
            <div className="p-4 bg-gray-50 dark:bg-dark-bg rounded-lg">
                <h4 className="font-semibold text-center mb-3">Cast Your Vote</h4>
                <div className="grid grid-cols-3 gap-2">
                    <Button variant="primary" onClick={() => handleVote(VoteOption.YES)} disabled={isVoting}>Yes</Button>
                    <Button variant="danger" onClick={() => handleVote(VoteOption.NO)} disabled={isVoting}>No</Button>
                    <Button variant="secondary" onClick={() => handleVote(VoteOption.ABSTAIN)} disabled={isVoting}>Abstain</button>
                </div>
            </div>
          )}
          {userHasVoted && (
             <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/50 text-center text-green-800 dark:text-green-300 font-semibold">
                You have voted on this proposal.
             </div>
          )}
        </div>
      ) : (
        <p>Proposal not found.</p>
      )}
    </Modal>
  );
};
