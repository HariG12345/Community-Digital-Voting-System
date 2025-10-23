import React from 'react';
import { Vote, VoteOption } from '../types';
import { Avatar } from './ui/Avatar';

interface VoterListProps {
  votes: Vote[];
  onSelectUser: (userId: number) => void;
}

export const VoterList: React.FC<VoterListProps> = ({ votes, onSelectUser }) => {
  const votersByOption = {
    [VoteOption.YES]: votes.filter(v => v.vote === VoteOption.YES),
    [VoteOption.NO]: votes.filter(v => v.vote === VoteOption.NO),
    [VoteOption.ABSTAIN]: votes.filter(v => v.vote === VoteOption.ABSTAIN),
  };

  return (
    <div>
      <h4 className="font-semibold text-lg mb-3">Who's Voted</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h5 className="font-semibold text-emerald-600 dark:text-emerald-400 mb-2">Yes ({votersByOption.yes.length})</h5>
          <div className="space-y-2">
            {votersByOption.yes.map(vote => (
              <button key={vote.id} onClick={() => onSelectUser(vote.voterId)} className="flex items-center space-x-2 text-sm w-full text-left hover:bg-gray-100 dark:hover:bg-dark-bg/50 p-1 rounded-md">
                <Avatar name={vote.voterName} className="h-6 w-6 text-xs" />
                <span>{vote.voterName}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <h5 className="font-semibold text-rose-600 dark:text-rose-400 mb-2">No ({votersByOption.no.length})</h5>
          <div className="space-y-2">
            {votersByOption.no.map(vote => (
              <button key={vote.id} onClick={() => onSelectUser(vote.voterId)} className="flex items-center space-x-2 text-sm w-full text-left hover:bg-gray-100 dark:hover:bg-dark-bg/50 p-1 rounded-md">
                <Avatar name={vote.voterName} className="h-6 w-6 text-xs" />
                <span>{vote.voterName}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <h5 className="font-semibold text-gray-600 dark:text-gray-400 mb-2">Abstain ({votersByOption.abstain.length})</h5>
          <div className="space-y-2">
            {votersByOption.abstain.map(vote => (
              <button key={vote.id} onClick={() => onSelectUser(vote.voterId)} className="flex items-center space-x-2 text-sm w-full text-left hover:bg-gray-100 dark:hover:bg-dark-bg/50 p-1 rounded-md">
                <Avatar name={vote.voterName} className="h-6 w-6 text-xs" />
                <span>{vote.voterName}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
