import React from 'react';
import { useNotification } from '../contexts/NotificationContext';
import Toast from './Toast';

const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useNotification();

  return (
    <div
      aria-live="assertive"
      className="fixed inset-0 flex flex-col items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-end z-[100]"
    >
      <div className="w-full max-w-sm space-y-4">
        {toasts.map(toast => (
          <Toast key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
      </div>
    </div>
  );
};

export default ToastContainer;
