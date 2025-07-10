import React, { useEffect } from 'react';
import { Icons } from './icons';
import { ToastMessage } from '../contexts/NotificationContext';

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: number) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 5000); // Auto-dismiss after 5 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [toast.id, onDismiss]);

  const typeClasses = {
    success: 'bg-green-100 border-green-500 text-green-700 dark:bg-green-900/50 dark:border-green-700 dark:text-green-300',
    error: 'bg-red-100 border-red-500 text-red-700 dark:bg-red-900/50 dark:border-red-700 dark:text-red-300',
    info: 'bg-blue-100 border-blue-500 text-blue-700 dark:bg-blue-900/50 dark:border-blue-700 dark:text-blue-300',
  };

  const iconMap = {
      success: <Icons.Approve className="h-5 w-5" />,
      error: <Icons.X className="h-5 w-5" />,
      info: <Icons.Bot className="h-5 w-5" />
  };

  return (
    <div
      className={`relative flex items-center w-full max-w-sm p-4 text-sm border-l-4 rounded-md shadow-lg animate-toast-in ${typeClasses[toast.type]}`}
      role="alert"
    >
      <div className="mr-3">{iconMap[toast.type]}</div>
      <div className="flex-1">{toast.message}</div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="ml-4 -mr-1 p-1 rounded-md hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-current"
        aria-label="Dismiss"
      >
        <Icons.X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Toast;
