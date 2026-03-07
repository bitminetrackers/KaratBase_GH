import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MetalPrices, User } from '../types';

interface AppContextType {
  prices: MetalPrices | null;
  manualPrices: MetalPrices | null;
  useManualPrices: boolean;
  setUseManualPrices: (use: boolean) => void;
  setManualPrices: (prices: MetalPrices) => void;
  user: User | null;
  loading: boolean;
  refreshPrices: () => Promise<void>;
  login: (email: string, name: string) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [prices, setPrices] = useState<MetalPrices | null>(null);
  const [manualPrices, setManualPrices] = useState<MetalPrices | null>(null);
  const [useManualPrices, setUseManualPrices] = useState(false);
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('aura_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/prices');
      if (!response.ok) throw new Error('Failed to fetch prices');
      const data = await response.json();
      setPrices(data);
      if (!manualPrices) setManualPrices(data);
    } catch (err) {
      console.error('Error fetching prices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const login = (email: string, name: string) => {
    const newUser = { id: Math.random().toString(36).substr(2, 9), email, name };
    setUser(newUser);
    localStorage.setItem('aura_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('aura_user');
  };

  return (
    <AppContext.Provider value={{ 
      prices, 
      manualPrices, 
      useManualPrices, 
      setUseManualPrices, 
      setManualPrices, 
      user, 
      loading, 
      refreshPrices: fetchPrices, 
      login, 
      logout 
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
