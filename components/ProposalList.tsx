import React from 'react';
import { ProposalWithVoteCounts } from '../types';
import { ProposalCard } from './ProposalCard';
import { ProposalListItem } from './ProposalListItem';

interface ProposalListProps {
  proposals: ProposalWithVoteCounts[];
  onSelectProposal: (proposal: ProposalWithVoteCounts) => void;
  activeTags: string[];
  onTagSelect: (tag: string) => void;
  onClearTags: () => void;
  viewMode: 'grid' | 'list';
}

export const ProposalList: React.FC<ProposalListProps> = ({ proposals, onSelectProposal, activeTags, onTagSelect, onClearTags, viewMode }) => {

  return (
    <section>
      {activeTags.length > 0 && (
        <div className="mb-6 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg flex items-center gap-2 flex-wrap animate-fade-in">
          <span className="font-semibold text-sm mr-2">Filtering by:</span>
          {activeTags.map(tag => (
            <div key={tag} className="flex items-center bg-indigo-200 dark:bg-indigo-800/50 text-indigo-800 dark:text-indigo-200 text-sm font-medium px-2.5 py-1 rounded-full">
              <span>#{tag}</span>
              <button onClick={() => onTagSelect(tag)} className="ml-1.5 p-0.5 rounded-full hover:bg-indigo-300 dark:hover:bg-indigo-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
          <button onClick={onClearTags} className="text-sm text-indigo-600 dark:text-indigo-300 hover:underline ml-auto">Clear all</button>
        </div>
      )}
      <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-4"}>
        {proposals.map(proposal => (
            viewMode === 'grid' ? (
                <ProposalCard 
                    key={proposal.id} 
                    proposal={proposal} 
                    onSelect={onSelectProposal} 
                    onTagSelect={onTagSelect}
                />
            ) : (
                <ProposalListItem
                    key={proposal.id}
                    proposal={proposal}
                    onSelect={onSelectProposal}
                    onTagSelect={onTagSelect}
                />
            )
        ))}
      </div>
    </section>
  );
};