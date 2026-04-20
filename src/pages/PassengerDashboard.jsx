import React, { useState, useEffect } from 'react';
import { useAppContext } from '../store/AppContext';
import StationMap from '../components/Heatmap/StationMap';
import PNRChecker from '../components/PNR/PNRChecker';
import TrainSchedule from '../components/Train/TrainSchedule';
import JourneyPlanner from '../components/Journey/JourneyPlanner';
import RouteResultCard from '../components/Journey/RouteResultCard';
import SkeletonLoader from '../components/Feedback/SkeletonLoader';
import ToastSystem from '../components/Feedback/ToastSystem';
import { calculateBestRoutes } from '../engine/DecisionEngine';
import { LayoutGrid, Ticket, Train, Map as MapIcon, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

export default function PassengerDashboard() {
  const { simulation, userProfile, setUserProfile, origin, setOrigin, destination, setDestination } = useAppContext();
  const [routes, setRoutes] = useState([]);
  const [showTools, setShowTools] = useState(false);
  const [isPlanning, setIsPlanning] = useState(false);
  
  useEffect(() => {
    if (origin && destination) {
      const results = calculateBestRoutes(origin, destination, userProfile || 'Normal', simulation.zones, simulation.isEvacuationMode);
      setRoutes(results);
    }
  }, [origin, destination, userProfile, simulation.zones, simulation.isEvacuationMode]);

  const handlePlan = async (start, end, prof) => {
    setIsPlanning(true);
    
    // Artificial "AI Thinking" delay for premium UX
    await new Promise(r => setTimeout(r, 1200));
    
    setOrigin(start);
    setDestination(end);
    setUserProfile(prof);
    setIsPlanning(false);
  };

  const clearRoute = () => {
    setOrigin('');
    setDestination('');
    setRoutes([]);
  };

  return (
    <div className="max-w-screen-2xl mx-auto p-4 md:p-8 page-transition">
      <ToastSystem />
      {/* Header Section */}
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight mb-2">Smart Station <span className="text-blue-500 text-lg font-medium ml-2 opacity-80">v2.0</span></h1>
          <p className="text-gray-400 max-w-lg">Next-gen crowd management and smart navigation for Dhanbad Jn. Optimized for comfort, speed, and safety.</p>
        </div>
        
        {/* Quick Tools Toggle */}
        <button 
          onClick={() => setShowTools(!showTools)}
          className="btn-secondary !py-2 flex items-center gap-2 text-sm"
        >
          {showTools ? <ChevronUp className="w-4 h-4"/> : <ChevronDown className="w-4 h-4"/>}
          Quick Station Tools
        </button>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Input & Results */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6">
          {isPlanning ? (
             <SkeletonLoader />
          ) : !origin || !destination || routes.length === 0 ? (
            <JourneyPlanner onPlan={handlePlan} />
          ) : (
            <RouteResultCard routes={routes} onClear={clearRoute} />
          )}

          {/* Quick Tools Panel (Conditionally Visible) */}
          {showTools && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-1 gap-6 step-entrance">
              <div className="glass-card">
                 <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><Ticket className="w-4 h-4 text-blue-400"/> Quick PNR Lookup</h3>
                 <PNRChecker />
              </div>
              <div className="glass-card">
                 <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><Train className="w-4 h-4 text-blue-400"/> Live Station Schedule</h3>
                 <TrainSchedule />
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Visual Heatmap */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-4 sticky top-8">
          <div className="glass-card !p-0 overflow-hidden relative">
            <div className="absolute top-4 left-4 z-10 bg-[#050810]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-[10px] font-bold text-white flex items-center gap-2 uppercase tracking-widest">
              <MapIcon className="w-3 h-3 text-blue-400" /> Live Station Heatmap
            </div>
            
            <div className="h-[500px] lg:h-[650px]">
               <StationMap />
            </div>

            <div className="absolute bottom-4 left-4 right-4 z-10">
               <div className="bg-[#050810]/90 backdrop-blur-md p-4 rounded-xl border border-white/10 flex justify-between items-center sm:flex-row flex-col gap-4">
                  <div className="flex gap-6">
                     <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Clear</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Busy</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)] animate-pulse" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Congested</span>
                     </div>
                  </div>
                  <div className="text-[10px] font-medium text-blue-400 italic flex items-center gap-2">
                     <Sparkles className="w-3 h-3" /> Real-time sync: Active
                  </div>
               </div>
            </div>
          </div>
        </div>

      </div>

      {/* Footer Navigation (Mobile) */}
      <footer className="fixed bottom-0 left-0 right-0 lg:hidden glass-panel p-4 flex justify-around items-center border-t border-white/10 z-40">
          <button className="text-blue-400 flex flex-col items-center gap-1">
            <LayoutGrid className="w-5 h-5"/>
            <span className="text-[9px] font-bold uppercase underline underline-offset-4">Navigate</span>
          </button>
          <button className="text-gray-500 flex flex-col items-center gap-1">
            <MapIcon className="w-5 h-5"/>
            <span className="text-[9px] font-bold uppercase">Map</span>
          </button>
          <button className="text-gray-500 flex flex-col items-center gap-1" onClick={() => setShowTools(true)}>
            <Train className="w-5 h-5"/>
            <span className="text-[9px] font-bold uppercase">Tools</span>
          </button>
      </footer>
    </div>
  );
}

