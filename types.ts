// types.ts

export enum VoteOption {
  YES = 'yes',
  NO = 'no',
  ABSTAIN = 'abstain',
}

export enum ProposalStatus {
  ACTIVE = 'active',
  CLOSED = 'closed',
  EXPIRED = 'expired',
}

export interface Vote {
  id: number;
  proposalId: number;
  voterId: number;
  voterName: string;
  vote: VoteOption;
}

export interface Comment {
  id: number;
  proposalId: number;
  authorId: number;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface Proposal {
  id: number;
  title: string;
  description: string;
  authorId: number;
  authorName: string;
  tags: string[];
  status: ProposalStatus;
  createdAt: string;
  deadline: string;
}

export interface ProposalWithVoteCounts extends Proposal {
  votes: {
    yes: number;
    no: number;
    abstain: number;
  };
  commentCount: number;
}

export interface ProposalWithDetails extends Proposal {
  votes: Vote[];
  comments: Comment[];
}

export interface User {
  id: number;
  name: string;
  joinDate: string;
  followers: number[]; // Array of user IDs
  following: number[]; // Array of user IDs
}

export interface UserWithStats extends User {
  proposalsCreated: number;
  votesCast: number;
}

export interface LeaderboardUser extends UserWithStats {
    communityScore: number;
}

export type NotificationType = 'new_proposal' | 'vote_cast' | 'deadline_soon' | 'new_follower' | 'welcome';

export interface Notification {
  id: number;
  type: NotificationType;
  message: string;
  linkId?: number; // e.g., proposal ID
  read: boolean;
  timestamp: string;
}