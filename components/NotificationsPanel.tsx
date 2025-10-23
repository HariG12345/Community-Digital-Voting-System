import React, { useState, useEffect, useRef } from 'react';
import { getNotifications, markNotificationAsRead } from '../services/api';
import { Notification, NotificationType } from '../types';
import { EmptyState } from './ui/EmptyState';
import { NoNotificationsIllustration } from './ui/Illustrations';

interface NotificationsPanelProps {
    onSelectProposal: (proposalId: number) => void;
}

const NotificationIcon: React.FC<{ type: NotificationType }> = ({ type }) => {
    const iconStyles = "h-5 w-5 rounded-full flex items-center justify-center text-white";
    switch (type) {
        case 'new_proposal': return <div className={`${iconStyles} bg-blue-500`}>&#10022;</div>;
        case 'vote_cast': return <div className={`${iconStyles} bg-green-500`}>&#10003;</div>;
        case 'deadline_soon': return <div className={`${iconStyles} bg-yellow-500`}>&#9200;</div>;
        case 'new_follower': return <div className={`${iconStyles} bg-purple-500`}>&#43;</div>;
        default: return <div className={`${iconStyles} bg-gray-500`}>&#128276;</div>;
    }
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ onSelectProposal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    const data = await getNotifications();
    setNotifications(data);
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  // Close panel on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [panelRef]);

  const handleMarkAsRead = async (id: number) => {
    await markNotificationAsRead(id);
    fetchNotifications();
  };
  
  const handleNotificationClick = (n: Notification) => {
    if (!n.read) handleMarkAsRead(n.id);
    if (n.linkId) {
        onSelectProposal(n.linkId);
        setIsOpen(false);
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative" ref={panelRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-dark-card focus:ring-brand-accent">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 block h-4 w-4 text-xs flex items-center justify-center font-bold text-white rounded-full bg-red-500 ring-2 ring-white dark:ring-dark-card">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-dark-card rounded-md shadow-lg ring-1 ring-black ring-opacity-5 animate-fade-in origin-top-right">
          <div className="p-3 font-semibold border-b dark:border-dark-border text-gray-800 dark:text-gray-200">Notifications</div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map(n => (
                <div key={n.id} onClick={() => handleNotificationClick(n)} className={`flex items-start p-3 hover:bg-gray-100 dark:hover:bg-dark-bg/80 border-b border-gray-100 dark:border-dark-border/50 ${!n.read ? 'bg-indigo-50/50 dark:bg-indigo-900/20' : ''} transition-colors cursor-pointer`}>
                  <div className="flex-shrink-0 mr-3 mt-1 relative">
                    <NotificationIcon type={n.type} />
                    {!n.read && <div className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-blue-500 border-2 border-white dark:border-dark-card"></div>}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${!n.read ? 'font-semibold text-gray-800 dark:text-gray-200' : 'text-gray-600 dark:text-gray-400'}`}>{n.message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{new Date(n.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              ))
            ) : (
                <div className="p-4">
                    <EmptyState title="All Caught Up!" message="You have no new notifications." illustration={<NoNotificationsIllustration />} />
                </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
