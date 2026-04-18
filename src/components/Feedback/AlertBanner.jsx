import React from 'react';
import { useAppContext } from '../../store/AppContext';
import { AlertTriangle } from 'lucide-react';

export default function AlertBanner() {
  const { simulation } = useAppContext();
  const alerts = simulation.activeAlerts;

  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="w-full flex justify-center absolute top-20 z-50 pointer-events-none px-4">
      <div className="flex flex-col gap-2 w-full max-w-2xl">
        {alerts.map((alert, index) => (
          <div key={index} className="bg-danger/90 backdrop-blur-md text-white px-4 py-3 rounded-lg shadow-xl border border-red-400 flex items-center gap-3 animate-in slide-in-from-top-2 pointer-events-auto">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <p className="font-semibold text-sm">{alert}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
