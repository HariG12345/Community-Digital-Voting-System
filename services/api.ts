import { Proposal, ProposalStatus, ProposalWithVoteCounts, ProposalWithDetails, Vote, VoteOption, Comment, User, UserWithStats, LeaderboardUser, Notification, NotificationType } from '../types';

// --- MOCK DATABASE ---
const now = new Date();

let users: User[] = [
    { id: 1, name: 'Hari G', joinDate: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(), followers: [2, 4], following: [2, 3] },
    { id: 2, name: 'Arun Kumar', joinDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(), followers: [1], following: [1] },
    { id: 3, name: 'Priya Sharma', joinDate: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString(), followers: [1], following: [] },
    { id: 4, name: 'Rajesh Patel', joinDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), followers: [], following: [1] },
    { id: 5, name: 'Sunita Devi', joinDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(), followers: [], following: [] },
    { id: 6, name: 'Vijay Singh', joinDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(), followers: [], following: [] },
    { id: 7, name: 'Anjali Mehta', joinDate: now.toISOString(), followers: [], following: [] },
];

let proposals: Proposal[] = [
  {
    id: 1,
    title: 'Install a Community Garden in Central Park',
    description: 'This proposal suggests converting the underutilized northern section of Central Park into a community garden...',
    authorId: 1,
    authorName: 'Hari G',
    tags: ['community', 'parks', 'environment'],
    status: ProposalStatus.ACTIVE,
    createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    title: 'Fund a new Public Art Mural Downtown',
    description: 'We propose commissioning a local artist to paint a large-scale mural on the side of the public library building...',
    authorId: 2,
    authorName: 'Arun Kumar',
    tags: ['arts', 'funding', 'community'],
    status: ProposalStatus.ACTIVE,
    createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    title: 'Upgrade the City\'s Recycling Program',
    description: 'This proposal aims to expand our current recycling program to include glass and compostable materials...',
    authorId: 3,
    authorName: 'Priya Sharma',
    tags: ['environment', 'infrastructure'],
    status: ProposalStatus.CLOSED,
    createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

let votes: Vote[] = [
    { id: 1, proposalId: 1, voterId: 4, voterName: 'Rajesh Patel', vote: VoteOption.YES },
    { id: 2, proposalId: 1, voterId: 5, voterName: 'Sunita Devi', vote: VoteOption.YES },
    { id: 3, proposalId: 1, voterId: 6, voterName: 'Vijay Singh', vote: VoteOption.NO },
    { id: 4, proposalId: 2, voterId: 1, voterName: 'Hari G', vote: VoteOption.YES },
    { id: 5, proposalId: 3, voterId: 1, voterName: 'Hari G', vote: VoteOption.YES },
    { id: 6, proposalId: 3, voterId: 2, voterName: 'Arun Kumar', vote: VoteOption.YES },
    { id: 7, proposalId: 3, voterId: 3, voterName: 'Priya Sharma', vote: VoteOption.YES },
    { id: 8, proposalId: 3, voterId: 4, voterName: 'Rajesh Patel', vote: VoteOption.NO },
    { id: 9, proposalId: 3, voterId: 5, voterName: 'Sunita Devi', vote: VoteOption.ABSTAIN },
];

let comments: Comment[] = [
  { id: 1, proposalId: 1, authorId: 4, authorName: 'Rajesh Patel', content: 'Great idea! I\'d love to have a place to grow vegetables.', createdAt: new Date().toISOString() },
  { id: 2, proposalId: 1, authorId: 6, authorName: 'Vijay Singh', content: 'I\'m concerned about the maintenance costs. Who will manage it?', createdAt: new Date().toISOString() },
  { id: 3, proposalId: 3, authorId: 2, authorName: 'Arun Kumar', content: 'This is long overdue.', createdAt: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000).toISOString() },
];

let notifications: Notification[] = [
    { id: 1, type: 'deadline_soon', message: "Proposal 'Fund a new Public Art Mural Downtown' is nearing its deadline.", read: false, timestamp: now.toISOString(), linkId: 2 },
    { id: 2, type: 'welcome', message: "Welcome to the Community Digital Voting System!", read: true, timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString() },
];

let nextId = { proposal: 4, vote: 10, comment: 4, notification: 3 };

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const addNotification = (type: NotificationType, message: string, linkId?: number) => {
    notifications.unshift({ id: nextId.notification++, type, message, read: false, timestamp: new Date().toISOString(), linkId });
}

// --- API FUNCTIONS ---

export const getProposals = async (): Promise<ProposalWithVoteCounts[]> => {
  await delay(500);
  proposals.forEach(p => {
    if (p.status === ProposalStatus.ACTIVE && new Date(p.deadline) < new Date()) {
      p.status = ProposalStatus.EXPIRED;
    }
  });
  return proposals.map(p => ({
    ...p,
    votes: {
      yes: votes.filter(v => v.proposalId === p.id && v.vote === VoteOption.YES).length,
      no: votes.filter(v => v.proposalId === p.id && v.vote === VoteOption.NO).length,
      abstain: votes.filter(v => v.proposalId === p.id && v.vote === VoteOption.ABSTAIN).length,
    },
    commentCount: comments.filter(c => c.proposalId === p.id).length,
  }));
};

export const getProposalById = async (id: number): Promise<ProposalWithDetails | null> => {
    await delay(500);
    const proposal = proposals.find(p => p.id === id);
    if (!proposal) return null;
    if (proposal.status === ProposalStatus.ACTIVE && new Date(proposal.deadline) < new Date()) {
      proposal.status = ProposalStatus.EXPIRED;
    }
    return {
        ...proposal,
        votes: votes.filter(v => v.proposalId === id),
        comments: comments.filter(c => c.proposalId === id).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    };
}

export const createProposal = async (data: { title: string; description: string; tags: string[]; authorId: number; authorName: string }): Promise<Proposal> => {
    await delay(1000);
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 7);
    const newProposal: Proposal = { id: nextId.proposal++, ...data, status: ProposalStatus.ACTIVE, createdAt: new Date().toISOString(), deadline: deadline.toISOString() };
    proposals.unshift(newProposal);
    addNotification('new_proposal', `${data.authorName} created a new proposal: "${data.title}"`, newProposal.id);
    return newProposal;
}

export const castVote = async (proposalId: number, voterId: number, voterName: string, vote: VoteOption): Promise<Vote> => {
    await delay(300);
    if (votes.some(v => v.proposalId === proposalId && v.voterId === voterId)) {
        throw new Error("You have already voted on this proposal.");
    }
    const newVote: Vote = { id: nextId.vote++, proposalId, voterId, voterName, vote };
    votes.push(newVote);
    const proposal = proposals.find(p => p.id === proposalId);
    if (proposal) {
        addNotification('vote_cast', `${voterName} voted on "${proposal.title}"`, proposalId);
    }
    return newVote;
}

export const addComment = async (proposalId: number, authorId: number, authorName: string, content: string): Promise<Comment> => {
    await delay(400);
    const newComment: Comment = { id: nextId.comment++, proposalId, authorId, authorName, content, createdAt: new Date().toISOString() };
    comments.push(newComment);
    return newComment;
}

export const deleteProposal = async (proposalId: number): Promise<void> => {
    await delay(700);
    proposals = proposals.filter(p => p.id !== proposalId);
    votes = votes.filter(v => v.proposalId !== proposalId);
    comments = comments.filter(c => c.proposalId !== proposalId);
}

export const updateProposalStatus = async (proposalId: number, status: ProposalStatus): Promise<Proposal> => {
    await delay(200);
    const proposal = proposals.find(p => p.id === proposalId);
    if (!proposal) throw new Error("Proposal not found.");
    proposal.status = status;
    return proposal;
}

export const getUserByName = async (name: string): Promise<User | null> => {
    await delay(100);
    return users.find(u => u.name.toLowerCase() === name.toLowerCase()) || null;
}

export const getUserById = async (id: number): Promise<UserWithStats | null> => {
    await delay(200);
    const user = users.find(u => u.id === id);
    if (!user) return null;
    return {
        ...user,
        proposalsCreated: proposals.filter(p => p.authorId === id).length,
        votesCast: votes.filter(v => v.voterId === id).length,
    };
}

export const getLeaderboard = async (): Promise<LeaderboardUser[]> => {
    await delay(600);
    const usersWithStats: UserWithStats[] = users.map(user => ({
        ...user,
        proposalsCreated: proposals.filter(p => p.authorId === user.id).length,
        votesCast: votes.filter(v => v.voterId === user.id).length,
    }));
    return usersWithStats
        .map(u => ({ ...u, communityScore: (u.proposalsCreated * 5) + (u.votesCast * 1) + (u.followers.length * 2) }))
        .sort((a,b) => b.communityScore - a.communityScore);
}

export const getNotifications = async (): Promise<Notification[]> => {
    await delay(100);
    return [...notifications].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export const markNotificationAsRead = async (id: number): Promise<void> => {
    await delay(50);
    const notification = notifications.find(n => n.id === id);
    if (notification) notification.read = true;
}

export const followUser = async (currentUserId: number, targetUserId: number): Promise<void> => {
    await delay(300);
    const currentUser = users.find(u => u.id === currentUserId);
    const targetUser = users.find(u => u.id === targetUserId);
    if (currentUser && targetUser) {
        if (!currentUser.following.includes(targetUserId)) {
            currentUser.following.push(targetUserId);
            targetUser.followers.push(currentUserId);
            addNotification('new_follower', `${currentUser.name} started following you.`);
        }
    }
}

export const unfollowUser = async (currentUserId: number, targetUserId: number): Promise<void> => {
    await delay(300);
    const currentUser = users.find(u => u.id === currentUserId);
    const targetUser = users.find(u => u.id === targetUserId);
    if (currentUser && targetUser) {
        currentUser.following = currentUser.following.filter(id => id !== targetUserId);
        targetUser.followers = targetUser.followers.filter(id => id !== currentUserId);
    }
}