import React from 'react';

export default function HeatmapLegend() {
  return (
    <ul className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold py-3 px-4 glass-panel rounded-b-xl border-t-0" role="list">
      <li className="flex items-center gap-1.5" role="listitem">
        <span className="w-3 h-3 rounded-full bg-safe border border-white/20" aria-hidden="true"></span>
        <span>Clear (&lt;40%)</span>
      </li>
      <li className="flex items-center gap-1.5" role="listitem">
        <span className="w-3 h-3 rounded-full bg-warning border border-white/20" aria-hidden="true"></span>
        <span>Busy (40-75%)</span>
      </li>
      <li className="flex items-center gap-1.5" role="listitem">
        <span className="w-3 h-3 rounded-full bg-danger border border-white/20 animate-pulse" aria-hidden="true"></span>
        <span>Congested (&gt;75%)</span>
      </li>
      <li className="flex items-center gap-1.5" role="listitem">
        <span className="w-3 h-3 rounded-full bg-purple-600 border border-white/20" aria-hidden="true"></span>
        <span>Blocked / Emergency</span>
      </li>
    </ul>
  );
}
