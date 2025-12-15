import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Bin, User, UserRole, CollectionRoute } from '../types';
import { INITIAL_BINS, MOCK_USERS } from '../services/mockData';

interface AppContextType {
  user: User | null;
  bins: Bin[];
  routes: CollectionRoute[];
  login: (role: UserRole) => void;
  logout: () => void;
  updateBin: (id: string, updates: Partial<Bin>) => void;
  addRoute: (route: CollectionRoute) => void;
  resetSimulation: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [bins, setBins] = useState<Bin[]>(INITIAL_BINS);
  const [routes, setRoutes] = useState<CollectionRoute[]>([]);

  // Simulate Real-time IoT Data Updates
  useEffect(() => {
    if (!user) return; // Only run simulation when logged in

    const interval = setInterval(() => {
      setBins(prevBins => prevBins.map(bin => {
        // Randomly increase fill level by 0-2% every 5 seconds to simulate waste accumulation
        const increment = Math.floor(Math.random() * 3);
        const newLevel = Math.min(bin.fillLevel + increment, 100);
        return { ...bin, fillLevel: newLevel };
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [user]);

  const login = (role: UserRole) => {
    const mockUser = MOCK_USERS.find(u => u.role === role) || MOCK_USERS[0];
    setUser(mockUser);
  };

  const logout = () => setUser(null);

  const updateBin = (id: string, updates: Partial<Bin>) => {
    setBins(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const addRoute = (route: CollectionRoute) => {
    setRoutes(prev => [route, ...prev]);
  };

  const resetSimulation = () => {
    setBins(INITIAL_BINS);
    setRoutes([]);
  };

  return (
    <AppContext.Provider value={{ user, bins, routes, login, logout, updateBin, addRoute, resetSimulation }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};