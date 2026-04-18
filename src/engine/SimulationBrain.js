/**
 * STATION AI BRAIN (Fallback Engine)
 * 
 * This module provides intelligent station-aware responses by analyzing the 
 * current simulation state (crowd density, alerts, evacuation status).
 * It acts as a resilient backup when external LLM APIs are unavailable.
 */

export function getStationAIResponse(input, simulation) {
  const lowerInput = input.toLowerCase();
  const zones = simulation.zones;
  
  // 1. Emergency Overrides
  if (simulation.isEvacuationMode) {
    return "🚨 EMERGENCY ALERT: Station is currently in evacuation mode. Please proceed immediately to the nearest exit (Exit A or Exit B). Do not use elevators.";
  }

  // 2. Proactive Alert matching
  if (simulation.activeAlerts.length > 0 && (lowerInput.includes('status') || lowerInput.includes('alert') || lowerInput.includes('happen'))) {
    return `Currently, there is an active alert: ${simulation.activeAlerts[0]}. We recommend avoiding the affected zones and checking the live map for safe routes.`;
  }

  // 3. Navigation Intelligence
  if (lowerInput.includes('navigate') || lowerInput.includes('go to') || lowerInput.includes('direction')) {
    if (lowerInput.includes('exit')) {
      return "To reach the exits, head towards Hall A for Exit A, or Hall B for Exit B. Follow the green directional path on your dashboard for the shortest route.";
    }
    if (lowerInput.includes('platform')) {
      return "Platforms can be accessed via Footbridge 1 or 2. Platform 1 is near the main hall, while Platforms 2 & 3 require using the bridges.";
    }
  }

  // 4. Crowd Density Intelligence
  if (lowerInput.includes('crowd') || lowerInput.includes('busy') || lowerInput.includes('rush')) {
    const mostCrowded = Object.values(zones).reduce((a, b) => a.density > b.density ? a : b);
    if (mostCrowded.density > 75) {
      return `Currently, ${mostCrowded.id} is experiencing high congestion (${mostCrowded.density}% density). I suggest waiting in Hall A or the Ticket Counter area where it is calmer.`;
    }
    return "The station flow is currently stable. Most areas are under 40% capacity, making it a good time for transit.";
  }

  // 5. Specific Location Queries
  const locations = Object.keys(zones);
  for (const loc of locations) {
    if (lowerInput.includes(loc.toLowerCase())) {
      const density = zones[loc].density;
      let status = "clear";
      if (density > 75) status = "highly congested";
      else if (density > 40) status = "moderately busy";
      
      return `${loc} is currently ${status} with a ${density}% crowd density. ${density > 70 ? 'I recommend an alternative route if you are in a hurry.' : 'It is safe to proceed.'}`;
    }
  }

  // 6. Generic Station Info
  if (lowerInput.includes('train') || lowerInput.includes('time')) {
    return "You can check the 'Trains' tab on your dashboard for the latest live arrivals and platform assignments for Dhanbad Station.";
  }

  // 7. General Fallback (Intelligent sounding)
  return "I am monitoring the Dhanbad Smart Station systems. I can help with crowd status, safe navigation routes, or emergency procedures. What specifically would you like to know about the current station state?";
}
