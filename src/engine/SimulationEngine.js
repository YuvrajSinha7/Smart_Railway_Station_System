import { useState, useEffect } from 'react';

// Define the static station zones
const INITIAL_ZONES = {
  'Main Entrance': { id: 'Main Entrance', density: 20, type: 'entry', trend: 0 },
  'Exit A': { id: 'Exit A', density: 10, type: 'exit', trend: 0 },
  'Exit B': { id: 'Exit B', density: 15, type: 'exit', trend: 0 },
  'Ticket Counter': { id: 'Ticket Counter', density: 30, type: 'facility', trend: 0 },
  'Hall A': { id: 'Hall A', density: 25, type: 'waiting', trend: 0 },
  'Hall B': { id: 'Hall B', density: 20, type: 'waiting', trend: 0 },
  'Footbridge 1': { id: 'Footbridge 1', density: 40, type: 'transit', trend: 0 },
  'Footbridge 2': { id: 'Footbridge 2', density: 35, type: 'transit', trend: 0 },
  'Platform 1': { id: 'Platform 1', density: 50, type: 'platform', trend: 0 },
  'Platform 2': { id: 'Platform 2', density: 45, type: 'platform', trend: 0 },
  'Platform 3': { id: 'Platform 3', density: 60, type: 'platform', trend: 0 },
  'Platform 4': { id: 'Platform 4', density: 15, type: 'platform', trend: 0 },
  'Platform 5': { id: 'Platform 5', density: 10, type: 'platform', trend: 0 },
  'Platform 6': { id: 'Platform 6', density: 20, type: 'platform', trend: 0 },
  'Platform 7': { id: 'Platform 7', density: 10, type: 'platform', trend: 0, temp: 24, waitTime: 2 },
  'Overbridge Hub A': { id: 'Overbridge Hub A', density: 5, type: 'entry', trend: 0, temp: 24, waitTime: 1 },
  'Overbridge Hub B': { id: 'Overbridge Hub B', density: 5, type: 'entry', trend: 0, temp: 24, waitTime: 1 },
};

const TIME_SLOTS = [
  { time: '06:00 AM', type: 'Off-Peak', multiplier: 0.5 },
  { time: '08:30 AM', type: 'Peak', multiplier: 1.5 },
  { time: '11:00 AM', type: 'Off-Peak', multiplier: 0.7 },
  { time: '01:30 PM', type: 'Moderate', multiplier: 1.0 },
  { time: '05:30 PM', type: 'Peak', multiplier: 1.8 },
  { time: '09:00 PM', type: 'Moderate', multiplier: 0.9 },
];

export default function useSimulationEngine() {
  const [zones, setZones] = useState(INITIAL_ZONES);
  const [timeIndex, setTimeIndex] = useState(1); // Start at peak
  const [isEvacuationMode, setIsEvacuationMode] = useState(false);
  const [activeAlerts, setActiveAlerts] = useState([]);

  useEffect(() => {
    // Tick every 3 seconds to simulate live dynamic feeling
    const interval = setInterval(() => {
      if (isEvacuationMode) return; // Freeze density logic in evacuation
      
      const currentTimeObj = TIME_SLOTS[timeIndex];
      const newZones = { ...zones };
      let newAlerts = [];

      Object.keys(newZones).forEach(key => {
        const oldDensity = newZones[key].density;
        
        // Random variance between -10 and +10
        const variance = Math.floor(Math.random() * 21) - 10;
        
        // Base density changes based on time of day multiplier
        let newDensity = oldDensity + variance;
        
        // Spike some platforms occasionally to simulate a train arrival (Predictive Trigger)
        if (newZones[key].type === 'platform' && Math.random() > 0.9) {
           newDensity += 40; 
        }

        // Apply time multiplier baseline
        const baseline = 40 * currentTimeObj.multiplier;
        newDensity = Math.max(5, Math.min(100, Math.round((newDensity * 0.7) + (baseline * 0.3))));
        
        // Calculate Trend for Predictive Engine
        newZones[key].trend = newDensity - oldDensity;
        newZones[key].density = newDensity;

        // 6. Calculate Environment Factors for Comfort Index
        newZones[key].temp = Math.round(24 + (newDensity / 10) + (Math.random() * 2)); // Temp increases with density
        newZones[key].waitTime = Math.round((newDensity / 20) * 2); // Wait time scales with density

        // Generate alerts for dangerous crowding
        if (newDensity > 85 && newZones[key].type !== 'exit') {
          newAlerts.push(`⚠️ Predictive Alert: High congestion bottleneck forming at ${key}!`);
        }
      });
      
      setZones(newZones);
      setActiveAlerts(newAlerts.slice(0, 2)); // Keep max 2 alerts
      
      // Advance time clock every 5 ticks (15 seconds)
      if (Math.random() > 0.8) {
         setTimeIndex((prev) => (prev + 1) % TIME_SLOTS.length);
      }

    }, 3000);

    return () => clearInterval(interval);
  }, [zones, timeIndex, isEvacuationMode]);

  const triggerEvacuation = (status) => {
    setIsEvacuationMode(status);
    if(status) {
      setActiveAlerts(["EMERGENCY EVACUATION ACTIVE. PROCEED TO EXITS."]);
      // Force all non-exits to high alert, exits to safe
      const evZones = {...zones};
      Object.keys(evZones).forEach(k => {
        evZones[k].density = evZones[k].type === 'exit' ? 10 : 95;
      });
      setZones(evZones);
    } else {
      setActiveAlerts([]);
    }
  }

  return {
    zones,
    timeOfDay: TIME_SLOTS[timeIndex].time,
    timeType: TIME_SLOTS[timeIndex].type,
    isEvacuationMode,
    triggerEvacuation,
    activeAlerts
  };
}
