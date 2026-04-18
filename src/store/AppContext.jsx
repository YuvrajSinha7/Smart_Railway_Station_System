import React, { createContext, useContext, useState, useEffect } from 'react';
import useSimulationEngine from '../engine/SimulationEngine';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Global simulation state
  const simulation = useSimulationEngine();
  
  // Passenger state
  const [userProfile, setUserProfile] = useState('Normal'); // Normal, Elderly, Hurry, Luggage
  const [destination, setDestination] = useState('');
  const [origin, setOrigin] = useState('Main Entrance');

  return (
    <AppContext.Provider value={{
      simulation,
      userProfile, setUserProfile,
      destination, setDestination,
      origin, setOrigin
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
