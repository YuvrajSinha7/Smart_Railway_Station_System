import React from 'react';
import HeatmapLegend from './HeatmapLegend';
import { useAppContext } from '../../store/AppContext';
import { Users } from 'lucide-react';

// Abstract Coordinate Map for Dhanbad Station Grid
const GRID_LAYOUT = {
  'Main Entrance': { top: '85%', left: '50%' },
  'Ticket Counter': { top: '75%', left: '30%' },
  'Hall A': { top: '75%', left: '50%' },
  'Hall B': { top: '75%', left: '70%' },
  'Footbridge 1': { top: '55%', left: '40%', isBridge: true },
  'Footbridge 2': { top: '55%', left: '60%', isBridge: true },
  'Platform 1': { top: '35%', left: '20%', width: '130px' },
  'Platform 2': { top: '35%', left: '50%', width: '130px' },
  'Platform 3': { top: '35%', left: '80%', width: '130px' },
  'Platform 4': { top: '22%', left: '20%', width: '130px' },
  'Platform 5': { top: '22%', left: '40%', width: '130px' },
  'Platform 6': { top: '22%', left: '60%', width: '130px' },
  'Platform 7': { top: '22%', left: '80%', width: '130px' },
  'Station A': { top: '45%', left: '10%' },
  'Station B': { top: '45%', left: '90%' },
  'Exit A': { top: '5%', left: '30%' },
  'Exit B': { top: '5%', left: '70%' },
}

export default function StationMap() {
  const { simulation } = useAppContext();
  const { zones, isEvacuationMode } = simulation;

  const getZoneColor = (density, type) => {
    if (isEvacuationMode && type !== 'exit') return 'bg-danger shadow-[0_0_15px_rgba(239,68,68,0.7)]';
    if (isEvacuationMode && type === 'exit') return 'bg-safe shadow-[0_0_20px_rgba(34,197,94,0.9)] animate-pulse';
    
    if (density < 40) return 'bg-safe';
    if (density < 75) return 'bg-warning';
    return 'bg-danger animate-pulse';
  };

  return (
    <div className="flex flex-col w-full h-full" role="region" aria-label="Interactive Station Heatmap">
      <div 
        className="relative w-full h-[500px] glass-panel rounded-t-xl overflow-hidden border-b-0 border-white/5 bg-[#1a2332]"
        aria-live="polite"
      >
        
        {/* Track Lines (Visual only) */}
        <div className="absolute top-[25%] left-0 w-full border-t-4 border-dashed border-gray-600/30"></div>
        <div className="absolute top-[35%] left-0 w-full border-t-4 border-dashed border-gray-600/30"></div>

        {/* Render Graph Nodes */}
        {Object.keys(GRID_LAYOUT).map((zoneId) => {
          const layout = GRID_LAYOUT[zoneId];
          const data = zones[zoneId] || { density: 0, type: 'unknown' };
          const colorClass = getZoneColor(data.density, data.type);

          return (
            <div 
              key={zoneId} 
              className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center transition-all duration-700 ease-in-out"
              style={{ top: layout.top, left: layout.left, width: layout.width || '100px' }}
              role="status"
              aria-label={`${zoneId}: ${isEvacuationMode ? 'Emergency Route' : `${data.density}% crowd density`}`}
            >
              <div className={`
                  ${layout.isBridge ? 'h-16 w-8 rounded-sm' : 'h-12 w-full rounded-lg'}
                  ${colorClass} opacity-80 backdrop-blur-md border border-white/30 flex items-center justify-center
                  shadow-lg transition-colors duration-500
              `}>
                <span className="text-[10px] font-bold text-white drop-shadow-md text-center px-1">
                  {zoneId}
                  {!isEvacuationMode && <div className="flex items-center justify-center gap-1 mt-1 opacity-90"><Users className="w-3 h-3"/> {data.density}%</div>}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <HeatmapLegend />
    </div>
  );
}
