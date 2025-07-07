import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface AdContextType {
  isAdVisible: boolean;
  setIsAdVisible: (visible: boolean) => void;
  adMargin: number;
}

const AdContext = createContext<AdContextType | undefined>(undefined);

export const useAd = () => {
  const context = useContext(AdContext);
  if (context === undefined) {
    throw new Error('useAd must be used within an AdProvider');
  }
  return context;
};

export const AdProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdVisible, setIsAdVisible] = useState(false);
  const [adMargin, setAdMargin] = useState(0);
  const location = useLocation();

  useEffect(() => {
    // Don't show ads on login page
    if (location.pathname === '/login') {
      setIsAdVisible(false);
      setAdMargin(0);
      return;
    }

    // Show ad after 2 seconds
    const timer = setTimeout(() => {
      setIsAdVisible(true);
      setAdMargin(280); // Width of the ad banner
    }, 2000);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  const handleSetIsAdVisible = (visible: boolean) => {
    setIsAdVisible(visible);
    setAdMargin(visible ? 280 : 0);
  };

  return (
    <AdContext.Provider value={{ 
      isAdVisible, 
      setIsAdVisible: handleSetIsAdVisible, 
      adMargin 
    }}>
      {children}
    </AdContext.Provider>
  );
}; 