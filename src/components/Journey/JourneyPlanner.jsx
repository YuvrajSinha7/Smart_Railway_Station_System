import React, { useState } from 'react';
import { MapPin, Navigation, Info, Users, Clock } from 'lucide-react';
import { RailAPI } from '../../services/railApi';

export default function JourneyPlanner({ onPlan }) {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [profile, setProfile] = useState('normal');

  const stationNodes = [
    'Main Entrance', 'Ticket Counter', 'Hall A', 'Hall B',
    'Platform 1', 'Platform 2', 'Platform 3', 'Platform 4',
    'Platform 5', 'Platform 6', 'Platform 7'
  ];

  return (
    <div className="glass-card flex flex-col gap-6">
      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
        <div className="bg-blue-600/20 p-2 rounded-lg">
          <Navigation className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Smart Navigator</h2>
          <p className="text-xs text-gray-400">Plan your route within Dhanbad Station</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Departure Point</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select 
              value={origin} 
              onChange={(e) => setOrigin(e.target.value)}
              className="input-field pl-10 appearance-none cursor-pointer"
            >
              <option value="">Current Location</option>
              {stationNodes.map(node => <option key={node} value={node}>{node}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Destination</label>
          <div className="relative">
            <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rotate-45" />
            <select 
              value={destination} 
              onChange={(e) => setDestination(e.target.value)}
              className="input-field pl-10 appearance-none cursor-pointer"
            >
              <option value="">Where to?</option>
              {stationNodes.map(node => <option key={node} value={node}>{node}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1 mb-2 block">Travel Profile</label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'normal', label: 'Standard', sub: 'Balanced' },
            { id: 'elderly', label: 'Assisted', sub: 'No Stairs' },
            { id: 'hurry', label: 'Express', sub: 'Fastest' }
          ].map(p => (
            <button
              key={p.id}
              onClick={() => setProfile(p.id)}
              className={`p-3 rounded-xl border transition-all text-left ${
                profile === p.id 
                  ? 'bg-blue-600/10 border-blue-500 text-blue-400' 
                  : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/10'
              }`}
            >
              <p className="text-xs font-bold">{p.label}</p>
              <p className="text-[9px] opacity-60 font-medium">{p.sub}</p>
            </button>
          ))}
        </div>
      </div>

      <button 
        onClick={() => onPlan(origin, destination, profile)}
        className="btn-primary w-full mt-2"
        disabled={!origin || !destination || origin === destination}
      >
        Calculate Smart Route
      </button>

      <div className="flex items-center gap-2 text-[11px] text-gray-500 bg-white/5 p-3 rounded-lg border border-white/5 mt-2">
        <Info className="w-3 h-3 text-blue-400" />
        Our AI calculates paths using live crowd density (updated every 3s).
      </div>
    </div>
  );
}
