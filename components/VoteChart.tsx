import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Vote, VoteOption } from '../types';

interface VoteChartProps {
  votes: Vote[];
}

const COLORS = {
    [VoteOption.YES]: '#10b981',
    [VoteOption.NO]: '#ef4444',
    [VoteOption.ABSTAIN]: '#6b7280'
};

export const VoteChart: React.FC<VoteChartProps> = ({ votes }) => {
  const voteCounts = votes.reduce((acc, vote) => {
    acc[vote.vote] = (acc[vote.vote] || 0) + 1;
    return acc;
  }, {} as Record<VoteOption, number>);

  const data = [
    { name: 'Yes', value: voteCounts.yes || 0 },
    { name: 'No', value: voteCounts.no || 0 },
    { name: 'Abstain', value: voteCounts.abstain || 0 },
  ];
  
  if (votes.length === 0) {
    return <p className="text-center text-gray-500 dark:text-dark-text-secondary py-8">No votes have been cast yet.</p>;
  }

  return (
    <div style={{ width: '100%', height: 200 }}>
        <ResponsiveContainer>
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#8b949e' }} />
                <Tooltip 
                    cursor={{fill: 'rgba(128, 128, 128, 0.1)'}}
                    contentStyle={{
                        backgroundColor: 'rgba(31, 41, 55, 0.8)',
                        borderColor: '#30363d',
                        borderRadius: '0.5rem',
                        color: '#c9d1d9'
                    }} 
                />
                <Bar dataKey="value" barSize={30} radius={[0, 4, 4, 0]}>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[entry.name.toLowerCase() as VoteOption]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    </div>
  );
};