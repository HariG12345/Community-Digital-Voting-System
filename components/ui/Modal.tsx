import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  return (
    <AnimatePresence>
        {isOpen && (
             <motion.div 
                className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
                onClick={onClose}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
             >
                <motion.div 
                    className="bg-white dark:bg-dark-card rounded-lg shadow-xl w-full max-w-2xl" 
                    onClick={e => e.stopPropagation()}
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                    <div className="flex justify-between items-center p-4 border-b dark:border-dark-border">
                      <h2 className="text-xl font-bold text-gray-800 dark:text-dark-text-primary">{title}</h2>
                      <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="p-6 max-h-[70vh] overflow-y-auto">
                      {children}
                    </div>
                    {footer && (
                      <div className="flex justify-end p-4 bg-gray-50 dark:bg-dark-bg border-t dark:border-dark-border rounded-b-lg">
                        {footer}
                      </div>
                    )}
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
  );
};