import React, { useState } from 'react';
import { ProposalWithDetails } from '../types';
import { getProposalSummary } from '../services/ai';
import { Button } from './ui/Button';
import { useToast } from '../contexts/ToastContext';

interface AISummaryProps {
  proposal: ProposalWithDetails;
}

export const AISummary: React.FC<AISummaryProps> = ({ proposal }) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const handleGenerateSummary = async () => {
    setIsLoading(true);
    setSummary(null);
    try {
      const result = await getProposalSummary(proposal);
      setSummary(result);
      addToast('AI Summary generated!', 'success');
    } catch (error: any) {
      addToast(error.message || 'Failed to generate summary.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border border-indigo-200 dark:border-brand-accent/30 rounded-lg bg-indigo-50 dark:bg-dark-bg">
      <h4 className="font-semibold text-gray-800 dark:text-dark-text-primary mb-2 flex items-center">
        <span role="img" aria-label="robot" className="mr-2">🤖</span> AI-Powered Summary
      </h4>
      {summary && (
        <div className="mt-2 p-3 bg-white dark:bg-dark-card rounded-md text-sm text-gray-700 dark:text-dark-text-secondary whitespace-pre-wrap font-mono">
            {summary}
        </div>
      )}
      {isLoading && (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-primary dark:border-brand-accent"></div>
          <p className="ml-3 text-sm">Generating summary...</p>
        </div>
      )}
      <div className="mt-3 text-center">
        <Button variant="secondary" onClick={handleGenerateSummary} disabled={isLoading}>
          {summary ? 'Regenerate Summary' : 'Get AI Summary'}
        </Button>
      </div>
    </div>
  );
};