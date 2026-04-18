import React, { useState } from 'react';
import { useAppContext } from '../store/AppContext';
import StationMap from '../components/Heatmap/StationMap';
import DensityAnalytics from '../components/Analytics/DensityAnalytics';
import { ShieldAlert, Activity, Users, AlertOctagon, BarChart3 } from 'lucide-react';

export default function AdminDashboard() {
  const { simulation } = useAppContext();
  const { zones, isEvacuationMode, triggerEvacuation, timeOfDay, timeType } = simulation;
  const [activeTab, setActiveTab] = useState('overview');

  const totalCrowd = Object.values(zones).reduce((acc, zone) => acc + zone.density, 0);
  const avgDensity = Math.round(totalCrowd / Object.keys(zones).length);

  // Identify bottlenecks (> 75%)
  const bottlenecks = Object.values(zones).filter(z => z.density > 75);
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      
      {/* Tab Navigation */}
      <div className="flex gap-1 bg-surface/50 rounded-lg p-1 border border-white/5 mb-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 py-2 px-4 rounded text-sm font-semibold transition-all ${
            activeTab === 'overview'
              ? 'bg-primary text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Activity className="w-4 h-4" /> Overview
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 py-2 px-4 rounded text-sm font-semibold transition-all ${
            activeTab === 'analytics'
              ? 'bg-primary text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4" /> Analytics
        </button>
        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex items-center gap-2 py-2 px-4 rounded text-sm font-semibold transition-all ${
            activeTab === 'alerts'
              ? 'bg-primary text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <AlertOctagon className="w-4 h-4" /> Alerts
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Sidebar - Controls */}
          <div className="space-y-6 lg:col-span-1">
            
            {/* System Overview */}
            <div className="glass-panel p-5 rounded-xl">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-primary"/> Station Metrics</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface border border-white/5 p-3 rounded-lg flex flex-col items-center">
                  <span className="text-xs text-gray-400">Total Avg Density</span>
                  <span className="text-xl font-bold text-white">{avgDensity}%</span>
                </div>
                <div className="bg-surface border border-white/5 p-3 rounded-lg flex flex-col items-center">
                  <span className="text-xs text-gray-400">Time Profile</span>
                  <span className="text-lg font-bold text-primary text-center">{timeType}</span>
                </div>
              </div>
            </div>

            {/* Bottlenecks */}
            <div className="glass-panel p-5 rounded-xl border border-warning/30 relative overflow-hidden">
              <h2 className="text-sm font-bold mb-3 flex items-center gap-2 text-warning"><AlertOctagon className="w-4 h-4"/> Live Bottlenecks</h2>
              {bottlenecks.length === 0 ? (
                 <p className="text-xs text-gray-400">No major bottlenecks detected.</p>
              ) : (
                 <div className="space-y-2">
                   {bottlenecks.map(b => (
                     <div key={b.id} className="flex justify-between items-center bg-danger/20 p-2 rounded">
                       <span className="text-sm">{b.id}</span>
                       <span className="text-xs font-bold text-danger">{b.density}%</span>
                     </div>
                   ))}
                 </div>
              )}
            </div>

            {/* WOW FEATURE: Emergency Override */}
            <div className={`glass-panel p-5 rounded-xl border transition-colors ${isEvacuationMode ? 'border-danger bg-danger/10' : 'border-danger/30'}`}>
              <h2 className="text-lg font-bold mb-2 flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-danger"/> Emergency Controls</h2>
              <p className="text-xs text-gray-400 mb-4 block">Triggering this will bypass all passenger routing logic and direct everyone to the safest, nearest exits unconditionally.</p>
              
              <button 
                onClick={() => triggerEvacuation(!isEvacuationMode)}
                className={`w-full py-3 rounded-lg font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${isEvacuationMode ? 'bg-background border border-danger text-danger hover:bg-danger/20' : 'bg-danger text-white hover:bg-red-600' }`}
              >
                <ShieldAlert className="w-5 h-5"/> {isEvacuationMode ? 'Stand Down Evacuation' : 'Trigger Evacuation Mode'}
              </button>
            </div>

          </div>

          {/* Main Map Area */}
          <div className="lg:col-span-2 h-[600px]">
            <StationMap />
            <p className="text-center text-xs text-gray-500 mt-4 px-10">Map values are driven by the Time-Based Simulation Engine. In a live environment, this connects to Firebase Firestore pipelines consuming CCTV crowd-estimation data.</p>
          </div>

        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <DensityAnalytics />
      )}

      {/* Alerts Tab */}
      {activeTab === 'alerts' && (
        <div className="glass-panel p-6 rounded-xl">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><AlertOctagon className="w-5 h-5 text-danger"/> System Alerts</h2>
          
          {simulation.activeAlerts.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <AlertOctagon className="w-12 h-12 opacity-20 mx-auto mb-3" />
              <p>No active alerts. Station operating normally.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {simulation.activeAlerts.map((alert, idx) => (
                <div key={idx} className="bg-danger/20 border border-danger/50 rounded-lg p-4 flex items-start gap-3">
                  <AlertOctagon className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-danger">{alert}</p>
                    <p className="text-xs text-gray-400 mt-1">Alert at {new Date().toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
