import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function SystemClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="flex items-center space-x-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full font-mono text-xs text-primary-light">
      <Clock className="w-3 h-3 text-primary animate-pulse" />
      <span>{formatTime(time)}</span>
    </div>
  );
}
