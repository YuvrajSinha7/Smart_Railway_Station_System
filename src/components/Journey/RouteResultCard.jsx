import React, { useState } from 'react';
import { ChevronRight, Clock, Users, ArrowRight, Info, Thermometer, Footprints, AlertCircle, Sparkles } from 'lucide-react';

export default function RouteResultCard({ routes, onClear }) {
  const [showDetails, setShowDetails] = useState(false);
  const bestRoute = routes[0];

  if (!bestRoute) return null;

  const getDensityColor = (density) => {
    if (density < 40) return 'text-emerald-400';
    if (density < 75) return 'text-amber-400';
    return 'text-rose-400';
  };

  return (
    <div className="space-y-4 step-entrance">
      {/* Primary Result Summary */}
      <div className="glass-card !border-blue-500/30 overflow-hidden relative">
        <div className="absolute top-0 right-0 bg-blue-600/20 text-blue-400 text-[10px] font-bold px-3 py-1 rounded-bl-xl flex items-center gap-1 uppercase tracking-tighter">
          <Sparkles className="w-3 h-3" /> Recommended
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white tracking-tight">{bestRoute.origin} <ArrowRight className="inline w-4 h-4 mx-1 text-gray-500" /> {bestRoute.destination}</h3>
              <p className="text-xs text-gray-500 mt-1">Smart Route curated by AI Decision Engine</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter mb-1">Travel Time</p>
              <div className="flex items-center gap-1.5 text-lg font-bold text-white">
                <Clock className="w-4 h-4 text-blue-400" /> {bestRoute.totalTime}m
              </div>
            </div>
            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter mb-1">Crowd Level</p>
              <div className="flex items-center gap-1.5 text-lg font-bold text-emerald-400">
                <Users className="w-4 h-4" /> Quiet
              </div>
            </div>
            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter mb-1">Reliability</p>
              <div className="flex items-center gap-1.5 text-lg font-bold text-blue-400">
                98%
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-white/5">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Route Path</p>
            <div className="flex flex-wrap items-center gap-2">
              {bestRoute.path.map((step, i) => (
                <React.Fragment key={i}>
                  <div className="bg-white/5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-200 border border-white/10">
                    {step}
                  </div>
                  {i < bestRoute.path.length - 1 && <ChevronRight className="w-3 h-3 text-gray-600" />}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* AI Rationale - Briefly summarized */}
          <div className="bg-blue-600/5 p-4 rounded-xl border border-blue-500/10 flex gap-3 italic text-gray-400 text-xs">
            <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />
            "{bestRoute.rationale.split('.')[0]}."
          </div>
        </div>
      </div>

      {/* Progressive Disclosure (The Details Toggle) */}
      <div className="flex justify-center">
        <button 
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs font-bold text-blue-400 hover:text-white transition-colors flex items-center gap-2 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/5"
        >
          {showDetails ? 'Hide Deep Metrics' : 'Expand Detailed Analytics'}
        </button>
      </div>

      {showDetails && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 step-entrance">
           {/* Detailed Path Steps */}
           <div className="glass-card space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2"><Footprints className="w-4 h-4 text-blue-400"/> Turn-by-Turn Guidance</h4>
              <div className="space-y-4 relative pl-4 before:content-[''] before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-white/5">
                {bestRoute.path.map((step, i) => (
                  <div key={i} className="relative pl-6">
                    <div className="absolute left-0 top-1 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-blue-500/20 z-10" />
                    <p className="text-xs font-bold text-white mb-0.5">{step}</p>
                    <p className="text-[10px] text-gray-500">Wait time: {Math.floor(Math.random()*3)} mins</p>
                  </div>
                ))}
              </div>
           </div>

           {/* Zone Metrics */}
           <div className="glass-card space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2"><Thermometer className="w-4 h-4 text-rose-400"/> Zone Health Analysis</h4>
              <div className="space-y-3">
                 {bestRoute.path.slice(0, 4).map((step, i) => (
                    <div key={i} className="bg-white/5 flex items-center justify-between p-3 rounded-xl border border-white/5">
                       <span className="text-xs font-semibold text-gray-300">{step}</span>
                       <div className="flex gap-4">
                          <div className="text-center">
                             <p className="text-[8px] text-gray-500 uppercase">Density</p>
                             <p className={`text-xs font-bold ${getDensityColor(30+i*10)}`}>{30+i*10}%</p>
                          </div>
                          <div className="text-center">
                             <p className="text-[8px] text-gray-500 uppercase">Temp</p>
                             <p className="text-xs font-bold text-white">26°C</p>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      )}

      {/* Quick Action Button to Close/Return */}
      <div className="flex gap-3 justify-between">
           <button 
             onClick={onClear}
             className="text-xs text-gray-500 hover:text-white font-bold transition-all p-3"
           >
             Clear & Plan New Route
           </button>
           <div className="flex gap-3">
              <button className="btn-secondary !py-2 !text-xs">Save Route</button>
              <button className="btn-primary !py-2 !text-xs px-8">Confirm Arrival</button>
           </div>
      </div>
    </div>
  );
}
