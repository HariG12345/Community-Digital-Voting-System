import React from 'react';
import { ProposalWithVoteCounts, ProposalStatus } from '../types';
import { Button } from './ui/Button';
import { Avatar } from './ui/Avatar';

interface ProposalListItemProps {
  proposal: ProposalWithVoteCounts;
  onSelect: (proposal: ProposalWithVoteCounts) => void;
  onTagSelect: (tag: string) => void;
}

const statusStyles = {
    [ProposalStatus.ACTIVE]: 'bg-green-500',
    [ProposalStatus.CLOSED]: 'bg-red-500',
    [ProposalStatus.EXPIRED]: 'bg-yellow-500',
};

export const ProposalListItem: React.FC<ProposalListItemProps> = ({ proposal, onSelect, onTagSelect }) => {
    const totalVotes = proposal.votes.yes + proposal.votes.no + proposal.votes.abstain;

    return (
        <article
            className="bg-white dark:bg-dark-card rounded-lg shadow-sm hover:shadow-lg dark:hover:shadow-brand-accent/10 transition-all duration-300 flex items-center p-4 border border-gray-200 dark:border-dark-border cursor-pointer transform hover:scale-[1.02]"
            onClick={() => onSelect(proposal)}
        >
            <div className={`w-2 h-16 rounded-full mr-4 flex-shrink-0 ${statusStyles[proposal.status]}`} title={proposal.status}></div>
            
            <div className="flex-grow min-w-0">
                <h3 className="text-md font-bold text-gray-900 dark:text-dark-text-primary mb-1 truncate">{proposal.title}</h3>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
                    <Avatar name={proposal.authorName} className="h-5 w-5 mr-1.5" />
                    <span className="font-semibold text-gray-700 dark:text-gray-300">{proposal.authorName}</span>
                    <span className="mx-1.5">&bull;</span>
                    <span>Created {new Date(proposal.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                    {proposal.tags.slice(0, 3).map(tag => (
                        <button
                            key={tag}
                            onClick={(e) => { e.stopPropagation(); onTagSelect(tag); }}
                            className="text-xs bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 px-2 py-0.5 rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-800/70 transition-colors"
                        >
                            #{tag}
                        </button>
                    ))}
                    {proposal.tags.length > 3 && <span className="text-xs text-gray-400 self-center">...</span>}
                </div>
            </div>

            <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600 dark:text-dark-text-secondary mx-6 flex-shrink-0">
                <div className="flex items-center gap-1.5" title={`${totalVotes} Votes`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                    <span className="font-medium">{totalVotes}</span>
                </div>
                <div className="flex items-center gap-1.5" title={`${proposal.commentCount} Comments`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    <span className="font-medium">{proposal.commentCount}</span>
                </div>
            </div>

            <Button onClick={(e) => { e.stopPropagation(); onSelect(proposal); }} className="!px-3 !py-1.5 text-sm flex-shrink-0 ml-4">
                View
            </Button>
        </article>
    );
};
