import React, { useState, useEffect } from 'react';
import { useAppContext } from '../store/AppContext';
import StationMap from '../components/Heatmap/StationMap';
import PNRChecker from '../components/PNR/PNRChecker';
import TrainSchedule from '../components/Train/TrainSchedule';
import { calculateBestRoutes, getBestTimePrediction, generateContextAlert } from '../engine/DecisionEngine';
import { MapPin, User, Navigation2, Clock, TrendingDown, ShieldAlert } from 'lucide-react';

export default function PassengerDashboard() {
  const { simulation, userProfile, setUserProfile, origin, setOrigin, destination, setDestination } = useAppContext();
  const [routes, setRoutes] = useState([]);
  const [activeTab, setActiveTab] = useState('navigate'); // navigate, pnr, schedule
  
  const locations = Object.keys(simulation.zones);

  useEffect(() => {
    if (origin && destination) {
      const results = calculateBestRoutes(origin, destination, userProfile, simulation.zones, simulation.isEvacuationMode);
      setRoutes(results);
    }
  }, [origin, destination, userProfile, simulation.zones, simulation.isEvacuationMode]);

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Sidebar - Controls & Information */}
      <div className="space-y-6 lg:col-span-1">
        
        {/* Tab Navigation */}
        <div 
          className="flex gap-1 bg-surface/50 rounded-lg p-1 border border-white/5"
          role="tablist"
          aria-label="Dashboard views"
        >
          <button
            onClick={() => setActiveTab('navigate')}
            role="tab"
            aria-selected={activeTab === 'navigate'}
            aria-controls="navigate-panel"
            id="tab-navigate"
            className={`flex-1 py-2 px-3 rounded text-xs font-semibold transition-all ${
              activeTab === 'navigate'
                ? 'bg-primary text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Navigate
          </button>
          <button
            onClick={() => setActiveTab('pnr')}
            role="tab"
            aria-selected={activeTab === 'pnr'}
            aria-controls="pnr-panel"
            id="tab-pnr"
            className={`flex-1 py-2 px-3 rounded text-xs font-semibold transition-all ${
              activeTab === 'pnr'
                ? 'bg-primary text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            PNR Status
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            role="tab"
            aria-selected={activeTab === 'schedule'}
            aria-controls="schedule-panel"
            id="tab-schedule"
            className={`flex-1 py-2 px-3 rounded text-xs font-semibold transition-all ${
              activeTab === 'schedule'
                ? 'bg-primary text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Trains
          </button>
        </div>

        {/* Navigation Tab */}
        {activeTab === 'navigate' && (
          <div id="navigate-panel" role="tabpanel" aria-labelledby="tab-navigate" className="space-y-6">
            {/* Navigation Form */}
            <div className="glass-panel p-5 rounded-xl">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Navigation2 className="w-5 h-5 text-primary"/> Navigation</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="profile-select" className="text-xs text-gray-400 mb-1 block">Your Profile</label>
                  <select 
                    id="profile-select"
                    className="w-full bg-surface border border-white/10 rounded-lg p-2 text-sm focus:ring-1 focus:ring-primary"
                    value={userProfile}
                    onChange={(e) => setUserProfile(e.target.value)}
                    aria-label="Select passenger profile"
                  >
                    <option value="Normal">Normal Passenger</option>
                    <option value="Elderly">Elderly / Reduced Mobility</option>
                    <option value="Luggage">With Heavy Luggage</option>
                    <option value="Hurry">In a Hurry</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="origin-select" className="text-xs text-gray-400 mb-1 block">Current Location</label>
                  <select 
                    id="origin-select"
                    className="w-full bg-surface border border-white/10 rounded-lg p-2 text-sm focus:ring-1 focus:ring-primary"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    aria-label="Select current location"
                  >
                    {locations.filter(l => !l.startsWith('Exit')).map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="dest-select" className="text-xs text-gray-400 mb-1 block">Destination</label>
                  <select 
                    id="dest-select"
                    className="w-full bg-surface border border-white/10 rounded-lg p-2 text-sm focus:ring-1 focus:ring-primary"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    aria-label="Select destination"
                  >
                    <option value="">-- Select Destination --</option>
                    {locations.filter(l => l !== origin).map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Proactive System Alerts */}
            <div className="space-y-2 mb-4" role="alert" aria-live="polite">
              {generateContextAlert(simulation.zones, userProfile, destination).map((alert, idx) => (
                <div key={idx} className="bg-primary/10 border border-primary/30 text-primary-light text-[11px] p-2 rounded-lg flex items-center gap-2 animate-pulse">
                   <ShieldAlert className="w-3 h-3"/> {alert}
                </div>
              ))}
            </div>

            {/* Dynamic Route Results */}
            {routes.length > 0 && destination && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-300 px-1 flex justify-between">
                  Suggested Optimization Paths
                  <span className="text-[10px] font-normal text-gray-500 italic">Cost = α(Effort)+β(Time)+γ(Crowd)</span>
                </h3>
                {routes.map((route, i) => (
                  <div key={i} className={`glass-panel p-4 rounded-xl border transition-all duration-300 ${i === 0 ? 'border-primary/50 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'border-white/5 opacity-80 hover:opacity-100'}`}>
                    <div className="flex justify-between items-start mb-2">
                       <div>
                         <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                           route.label?.includes('FASTEST') ? 'bg-info/20 text-info' : 
                           route.label?.includes('EFFORT') ? 'bg-safe/20 text-safe' : 'bg-warning/20 text-warning'
                         }`}>
                           {route.label || `Alternative ${i+1}`}
                         </span>
                         <div className="mt-1 text-xs font-semibold text-white">~{route.time} mins travel time</div>
                       </div>
                       <div className="text-right">
                          <div className="text-[10px] text-gray-400 mb-1">Comfort Index</div>
                          <div className="flex items-center gap-2">
                             <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden" role="progressbar" aria-valuenow={route.score} aria-valuemin="0" aria-valuemax="100">
                                <div 
                                  className={`h-full rounded-full ${route.score > 80 ? 'bg-safe' : route.score > 50 ? 'bg-warning' : 'bg-danger'}`}
                                  style={{ width: `${route.score}%` }}
                                ></div>
                             </div>
                             <span className="text-xs font-bold text-white">{route.score}</span>
                          </div>
                       </div>
                    </div>
                    
                    <div className="relative pl-4 border-l-1 border-gray-700/50 space-y-2 my-3">
                      {route.path.map((step, idx) => (
                        <div key={idx} className="relative text-[13px] text-gray-300 flex items-center gap-2">
                          <div className="absolute w-1.5 h-1.5 bg-gray-600 rounded-full -left-[17px] top-1.5 border border-surface"></div>
                          {step}
                          {step === '...waiting...' && <span className="text-[10px] bg-warning/10 text-warning px-1.5 rounded animate-bounce">Strategic Pause</span>}
                          {simulation.zones[step]?.density > 75 && <span className="text-[9px] text-danger animate-pulse">⚡ Crowded</span>}
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 text-[11px] leading-relaxed text-blue-300/90 bg-blue-500/5 p-2 rounded-lg border border-blue-500/10">
                       <strong className="text-blue-400 text-[10px] uppercase tracking-wider block mb-0.5">Decision Rationale:</strong> 
                       {route.reason}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Best Time Predictor */}
            <div className="glass-panel p-5 rounded-xl border border-primary/20 bg-gradient-to-br from-surface to-surface/40">
               <h2 className="text-sm font-bold flex items-center gap-2 text-primary mb-2"><Clock className="w-4 h-4"/> Predictive Intelligence HUD</h2>
               <p className="text-[11px] text-gray-300 leading-relaxed italic">{getBestTimePrediction()}</p>
            </div>

            {/* AI Expected Impact Metrics */}
            <div className="glass-panel p-4 rounded-xl border border-safe/30 bg-gradient-to-br from-safe/5 to-transparent">
              <h2 className="text-sm font-bold flex items-center gap-2 text-safe mb-3"><TrendingDown className="w-4 h-4"/> System Impact Analytics</h2>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-gray-400">Bottleneck Prevention:</span>
                  <span className="font-bold text-white">Active</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-gray-400">Accessibility Gain:</span>
                  <span className="font-bold text-white">+${userProfile === 'Elderly' ? '45' : '15'}% Comfort</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-gray-400">Optimization Mode:</span>
                  <span className="font-bold text-primary-light">Dijkstra-Adaptive</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PNR Checking Tab */}
        {activeTab === 'pnr' && (
          <div id="pnr-panel" role="tabpanel" aria-labelledby="tab-pnr" className="space-y-6">
            <PNRChecker />
            <div className="glass-panel p-3 rounded-xl bg-info/10 border border-blue-500/20 text-xs text-blue-200">
              <p><strong>Tip:</strong> Enter your 10-digit PNR number to check booking status, seat information, and confirmation details.</p>
            </div>
          </div>
        )}

        {/* Train Schedule Tab */}
        {activeTab === 'schedule' && (
          <div id="schedule-panel" role="tabpanel" aria-labelledby="tab-schedule">
            <TrainSchedule />
          </div>
        )}

      </div>

      {/* Main Map Area */}
      <div className="lg:col-span-2 h-[600px]">
        <StationMap />
      </div>

    </div>
  );
}
