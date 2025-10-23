import React from 'react';
import { ProposalWithVoteCounts, ProposalStatus } from '../types';
import { CountdownTimer } from './CountdownTimer';
import { Button } from './ui/Button';
import { Avatar } from './ui/Avatar';

interface ProposalCardProps {
  proposal: ProposalWithVoteCounts;
  onSelect: (proposal: ProposalWithVoteCounts) => void;
  onTagSelect: (tag: string) => void;
}

const statusStyles = {
  [ProposalStatus.ACTIVE]: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border border-green-200 dark:border-green-700/50',
  [ProposalStatus.CLOSED]: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border border-red-200 dark:border-red-700/50',
  [ProposalStatus.EXPIRED]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-700/50',
};

const VoteBar: React.FC<{ yes: number; no: number; abstain: number }> = ({ yes, no, abstain }) => {
    const total = yes + no + abstain;
    if (total === 0) return <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full"></div>;
    
    const yesWidth = (yes / total) * 100;
    const noWidth = (no / total) * 100;
    
    return (
        <div className="w-full flex h-2.5 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
            <div style={{ width: `${yesWidth}%` }} className="bg-emerald-500 transition-all duration-500"></div>
            <div style={{ width: `${noWidth}%` }} className="bg-rose-500 transition-all duration-500"></div>
        </div>
    );
};

export const ProposalCard: React.FC<ProposalCardProps> = ({ proposal, onSelect, onTagSelect }) => {
  const totalVotes = proposal.votes.yes + proposal.votes.no + proposal.votes.abstain;
  return (
    <article className="bg-white dark:bg-dark-card rounded-lg shadow-md hover:shadow-xl dark:hover:shadow-brand-accent/10 transition-shadow duration-300 flex flex-col border border-gray-200 dark:border-dark-border transform hover:-translate-y-1">
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusStyles[proposal.status]}`}>{proposal.status}</span>
          <div className="flex flex-wrap gap-2 justify-end max-w-[60%]">
             {proposal.tags.map(tag => (
                <button 
                  key={tag} 
                  onClick={(e) => { e.stopPropagation(); onTagSelect(tag); }}
                  className="text-xs bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 px-2.5 py-1 rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-800/70 transition-colors"
                >
                  #{tag}
                </button>
             ))}
          </div>
        </div>
        <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-dark-text-primary">{proposal.title}</h3>
        <p className="text-sm text-gray-600 dark:text-dark-text-secondary line-clamp-3 mb-4 flex-grow">{proposal.description}</p>
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <Avatar name={proposal.authorName} className="h-6 w-6 mr-2" />
            <span className="font-semibold text-gray-700 dark:text-gray-300">{proposal.authorName}</span>
            <span className="mx-1.5">&bull;</span>
            <span>Created {new Date(proposal.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-dark-border/50 flex items-center justify-end space-x-4 text-sm text-gray-500 dark:text-dark-text-secondary">
          <div className="flex items-center gap-1.5" title={`${totalVotes} Votes`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            <span>{totalVotes}</span>
          </div>
          <div className="flex items-center gap-1.5" title={`${proposal.commentCount} Comments`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            <span>{proposal.commentCount}</span>
          </div>
        </div>
      </div>
      <div className="p-5 bg-gray-50 dark:bg-dark-bg/50 rounded-b-lg border-t border-gray-100 dark:border-dark-border/50">
        {proposal.status === ProposalStatus.ACTIVE ? (
            <div>
                <p className="text-sm font-semibold mb-3 text-center text-gray-700 dark:text-gray-300">Voting ends in:</p>
                <CountdownTimer deadline={proposal.deadline} />
            </div>
        ) : (
             <div>
                <div className="flex justify-between text-sm mb-2 px-1">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">Yes ({proposal.votes.yes})</span>
                    <span className="font-semibold text-rose-600 dark:text-rose-400">No ({proposal.votes.no})</span>
                </div>
                <VoteBar {...proposal.votes} />
             </div>
        )}
        <Button onClick={() => onSelect(proposal)} className="w-full mt-4">
          View Details & Vote
        </Button>
      </div>
    </article>
  );
};