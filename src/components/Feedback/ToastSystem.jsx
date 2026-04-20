import React, { useEffect, useState } from 'react';
import { AlertCircle, X, Bell } from 'lucide-react';
import { useAppContext } from '../../store/AppContext';

export default function ToastSystem() {
  const { simulation } = useAppContext();
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    if (simulation.activeAlerts.length > 0) {
      const latestAlert = simulation.activeAlerts[simulation.activeAlerts.length - 1];
      
      // Avoid duplicate toasts for the same alert message
      if (!toasts.find(t => t.text === latestAlert)) {
        const id = Date.now();
        setToasts(prev => [...prev, { id, text: latestAlert }]);
        
        // Auto-remove after 6 seconds
        setTimeout(() => {
          removeToast(id);
        }, 6000);
      }
    }
  }, [simulation.activeAlerts]);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map(toast => (
        <div 
          key={toast.id}
          className="toast-entrance pointer-events-auto glass-panel !bg-rose-500/10 border-rose-500/30 p-4 rounded-xl shadow-2xl flex items-start gap-3 max-w-sm"
        >
          <div className="bg-rose-500/20 p-2 rounded-lg">
            <Bell className="w-4 h-4 text-rose-400 animate-bounce" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-1">Live Station Alert</p>
            <p className="text-xs font-medium text-white leading-relaxed">{toast.text}</p>
          </div>
          <button 
            onClick={() => removeToast(toast.id)}
            className="text-gray-500 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
