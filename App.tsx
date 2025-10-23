import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { ProposalList } from './components/ProposalList';
import { LoginModal } from './components/LoginModal';
import { CreateProposalModal } from './components/CreateProposalModal';
import { ProposalDetailModal } from './components/ProposalDetailModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { UserProfileModal } from './components/UserProfileModal';
import { Spinner } from './components/ui/Spinner';
import { EmptyState } from './components/ui/EmptyState';
import { NoResultsIllustration, NoProposalsIllustration } from './components/ui/Illustrations';
import { getProposals, createProposal, getUserByName } from './services/api';
import { ProposalWithVoteCounts, ProposalStatus, User } from './types';
import { ToastProvider, useToast } from './contexts/ToastContext';
import { useTheme } from './hooks/useTheme';
import { Input } from './components/ui/Input';
import { Select } from './components/ui/Select';

const AppContent: React.FC = () => {
  const [proposals, setProposals] = useState<ProposalWithVoteCounts[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Modal states
  const [selectedProposalId, setSelectedProposalId] = useState<number | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isAdminModalOpen, setAdminModalOpen] = useState(false);
  const [isLeaderboardModalOpen, setLeaderboardModalOpen] = useState(false);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);

  // Filtering and sorting states
  const [sortBy, setSortBy] = useState('newest');
  const [filterStatus, setFilterStatus] = useState<ProposalStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { addToast } = useToast();
  const [theme, toggleTheme] = useTheme();

  const fetchProposals = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getProposals();
      setProposals(data);
    } catch (error) {
      addToast('Failed to load proposals.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchProposals();
  }, [fetchProposals]);

  const handleLogin = async (username: string) => {
    try {
        const user = await getUserByName(username);
        if (user) {
            setCurrentUser(user);
            addToast(`Welcome back, ${user.name}!`, 'success');
        } else {
            // In a real app, you'd have a registration flow. Here we just show an error.
            addToast(`User '${username}' not found. Try 'admin' or 'Hari G'.`, 'error');
        }
    } catch {
        addToast('Login failed.', 'error');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    addToast('You have been logged out.', 'info');
  };
  
  const handleCreateProposal = async (data: { title: string; description: string; tags: string[] }) => {
    if (!currentUser) {
        addToast('You must be logged in to create a proposal.', 'error');
        return;
    }
    await createProposal({ ...data, authorId: currentUser.id, authorName: currentUser.name });
    addToast('Proposal created successfully!', 'success');
    fetchProposals();
  };

  const handleSelectProposal = (proposal: ProposalWithVoteCounts) => {
    setSelectedProposalId(proposal.id);
  };

  const handleSelectUser = (userId: number) => {
    setSelectedUserId(userId);
  }
  
  const handleToggleTag = (tag: string) => {
    setActiveTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  }

  const filteredAndSortedProposals = useMemo(() => {
    return proposals
      .filter(p => filterStatus === 'all' || p.status === filterStatus)
      .filter(p => activeTags.length === 0 || activeTags.every(tag => p.tags.includes(tag)))
      .filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.description.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'ending_soon') {
          if (a.status !== ProposalStatus.ACTIVE) return 1;
          if (b.status !== ProposalStatus.ACTIVE) return -1;
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        }
        return 0;
      });
  }, [proposals, sortBy, filterStatus, searchTerm, activeTags]);

  const ViewToggleButton: React.FC<{mode: 'grid' | 'list', children: React.ReactNode}> = ({mode, children}) => (
      <button 
          onClick={() => setViewMode(mode)} 
          className={`p-1.5 rounded-md transition-colors ${viewMode === mode ? 'bg-brand-primary dark:bg-brand-accent text-white dark:text-dark-bg' : 'hover:bg-gray-300 dark:hover:bg-dark-border'}`}
          aria-label={`Switch to ${mode} view`}
      >
          {children}
      </button>
  );

  return (
    <div className="bg-gray-50 dark:bg-dark-bg min-h-screen text-gray-900 dark:text-dark-text-primary transition-colors duration-300">
      {!currentUser && <LoginModal isOpen={!currentUser} onLogin={handleLogin} />}

      <Header
        user={currentUser}
        onLogout={handleLogout}
        onCreateProposal={() => setCreateModalOpen(true)}
        onAdmin={() => setAdminModalOpen(true)}
        onLeaderboard={() => setLeaderboardModalOpen(true)}
        onProfile={() => currentUser && setSelectedUserId(currentUser.id)}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      
      { currentUser && (
        <div className="sticky top-[65px] z-30 bg-gray-50/80 dark:bg-dark-bg/80 backdrop-blur-sm">
            <div className="container mx-auto px-4 md:px-8 py-3 border-b border-gray-200 dark:border-dark-border">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="w-full md:w-auto flex-grow flex items-center gap-2">
                      <Input containerClassName="flex-grow" placeholder="Search proposals by keyword..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                       <div className="hidden sm:flex items-center bg-gray-200 dark:bg-dark-card p-1 rounded-lg">
                            <ViewToggleButton mode="grid">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                            </ViewToggleButton>
                             <ViewToggleButton mode="list">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                            </ViewToggleButton>
                       </div>
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                        <Select id="filter-status" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)}><option value="all">All Statuses</option><option value={ProposalStatus.ACTIVE}>Active</option><option value={ProposalStatus.CLOSED}>Closed</option><option value={ProposalStatus.EXPIRED}>Expired</option></Select>
                        <Select id="sort-by" value={sortBy} onChange={(e) => setSortBy(e.target.value)}><option value="newest">Newest</option><option value="ending_soon">Ending Soon</option></Select>
                    </div>
                </div>
            </div>
        </div>
      )}

      <main className="container mx-auto p-4 md:p-8">
        {isLoading ? <Spinner /> : proposals.length === 0 ? (
          <EmptyState title="No Proposals Yet" message="Be the first to create a proposal and start a discussion!" illustration={<NoProposalsIllustration />} />
        ) : filteredAndSortedProposals.length === 0 ? (
          <EmptyState title="No Matching Proposals" message="Try adjusting your search or filters." illustration={<NoResultsIllustration />} />
        ) : (
          <ProposalList proposals={filteredAndSortedProposals} onSelectProposal={handleSelectProposal} activeTags={activeTags} onTagSelect={handleToggleTag} onClearTags={() => setActiveTags([])} viewMode={viewMode} />
        )}
      </main>

      <CreateProposalModal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} onSubmit={handleCreateProposal} />
      
      {selectedProposalId && (
        <ProposalDetailModal isOpen={!!selectedProposalId} onClose={() => setSelectedProposalId(null)} proposalId={selectedProposalId} currentUser={currentUser} onVoteCasted={fetchProposals} onSelectUser={handleSelectUser} />
      )}
      
      {selectedUserId && (
        <UserProfileModal isOpen={!!selectedUserId} onClose={() => setSelectedUserId(null)} userId={selectedUserId} currentUserId={currentUser?.id} />
      )}

      {currentUser?.name.toLowerCase() === 'admin' && (
        <AdminDashboardModal isOpen={isAdminModalOpen} onClose={() => setAdminModalOpen(false)} onProposalsUpdate={fetchProposals} />
      )}

      <LeaderboardModal isOpen={isLeaderboardModalOpen} onClose={() => setLeaderboardModalOpen(false)} onSelectUser={handleSelectUser} />
    </div>
  );
}

const App: React.FC = () => (
  <ToastProvider>
    <AppContent />
  </ToastProvider>
);

export default App;