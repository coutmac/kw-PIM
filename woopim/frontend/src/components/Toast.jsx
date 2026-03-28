import { useState, useEffect } from 'react';

let toastId = 0;
const toasts = [];

const Toast = () => {
  const [currentToasts, setCurrentToasts] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentToasts([...toasts]);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {currentToasts.slice(0, 3).map(toast => (
        <div key={toast.id} className={`p-4 rounded shadow-lg text-white ${toast.type === 'success' ? 'bg-green-500' : toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500'}`}>
          {toast.message}
        </div>
      ))}
    </div>
  );
};

export const useToast = () => {
  return (message, type = 'info') => {
    const id = ++toastId;
    toasts.push({ id, message, type });
    setTimeout(() => {
      const index = toasts.findIndex(t => t.id === id);
      if (index > -1) toasts.splice(index, 1);
      setCurrentToasts([...toasts]);
    }, 4000);
  };
};

export default Toast;