import React, { useState, useEffect, useCallback } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Spinner } from './ui/Spinner';
import { getProposals, deleteProposal, updateProposalStatus } from '../services/api';
import { ProposalWithVoteCounts, ProposalStatus } from '../types';
import { useToast } from '../contexts/ToastContext';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProposalsUpdate: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({ isOpen, onClose, onProposalsUpdate }) => {
  const [proposals, setProposals] = useState<ProposalWithVoteCounts[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const fetchProposalsForAdmin = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getProposals();
      setProposals(data);
    } catch (error) {
      addToast('Failed to load proposals for admin dashboard.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    if (isOpen) {
      fetchProposalsForAdmin();
    }
  }, [isOpen, fetchProposalsForAdmin]);

  const handleDelete = async (proposalId: number) => {
    if (window.confirm('Are you sure you want to permanently delete this proposal and all its data?')) {
      try {
        await deleteProposal(proposalId);
        addToast('Proposal deleted successfully.', 'success');
        onProposalsUpdate();
        fetchProposalsForAdmin();
      } catch (error) {
        addToast('Failed to delete proposal.', 'error');
      }
    }
  };
  
  const handleStatusChange = async (proposalId: number, status: ProposalStatus) => {
     try {
        await updateProposalStatus(proposalId, status);
        addToast('Proposal status updated.', 'success');
        onProposalsUpdate();
        fetchProposalsForAdmin();
      } catch (error) {
        addToast('Failed to update status.', 'error');
      }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Admin Dashboard">
      <div className="max-h-[60vh] overflow-y-auto">
        {isLoading ? (
          <Spinner />
        ) : (
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Title</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {proposals.map(p => (
                <tr key={p.id} className="bg-white border-b dark:bg-dark-card dark:border-dark-border">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{p.title}</td>
                  <td className="px-6 py-4 capitalize">{p.status}</td>
                  <td className="px-6 py-4 space-x-2">
                    <select 
                        onChange={(e) => handleStatusChange(p.id, e.target.value as ProposalStatus)} 
                        value={p.status}
                        className="p-1 rounded text-xs bg-gray-200 dark:bg-dark-bg"
                    >
                        <option value={ProposalStatus.ACTIVE}>Active</option>
                        <option value={ProposalStatus.CLOSED}>Closed</option>
                        <option value={ProposalStatus.EXPIRED}>Expired</option>
                    </select>
                    <Button variant="danger" onClick={() => handleDelete(p.id)} className="px-2 py-1 text-xs">Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Modal>
  );
};