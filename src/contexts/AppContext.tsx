import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, db, browserPopupRedirectResolver } from '../firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { MetalPrices, User } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface AppContextType {
  prices: MetalPrices | null;
  manualPrices: MetalPrices | null;
  useManualPrices: boolean;
  setUseManualPrices: (use: boolean) => void;
  setManualPrices: (prices: MetalPrices) => void;
  user: User | null;
  loading: boolean;
  refreshPrices: () => Promise<void>;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isAuthReady: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [prices, setPrices] = useState<MetalPrices | null>(null);
  const [manualPrices, setManualPrices] = useState<MetalPrices | null>(null);
  const [useManualPrices, setUseManualPrices] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const isAdminEmail = firebaseUser.email === 'robertwilliams.isaac@gmail.com';
          
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            if (isAdminEmail && userData.role !== 'admin') {
              const updatedUser: User = { ...userData, role: 'admin' };
              await setDoc(doc(db, 'users', firebaseUser.uid), updatedUser, { merge: true });
              setUser(updatedUser);
            } else {
              setUser(userData);
            }
          } else {
            const newUser: User = {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || 'Jeweler',
              role: isAdminEmail ? 'admin' : 'user'
            };
            await setDoc(doc(db, 'users', firebaseUser.uid), {
              ...newUser,
              createdAt: serverTimestamp()
            });
            setUser(newUser);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        setUser(null);
      }
      setIsAuthReady(true);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchPrices = async () => {
    try {
      // 1. Try to fetch from our local Express API (works in AI Studio)
      const response = await fetch('/api/prices');
      if (!response.ok) throw new Error('API fetch failed');
      const data = await response.json();
      
      setPrices(data);
      if (!manualPrices) setManualPrices(data);

      // 2. Cache the successful fetch to Firestore so it's available on Vercel
      if (user?.role === 'admin') {
        try {
          await setDoc(doc(db, 'market_data', 'latest'), {
            ...data,
            cachedAt: serverTimestamp()
          });
        } catch (e) {
          console.error('Failed to cache prices to Firestore:', e);
        }
      }
    } catch (err) {
      console.warn('API fetch failed, trying Firestore cache...', err);
      
      try {
        // 3. Fallback: Try to load from Firestore cache (works on Vercel)
        const cacheDoc = await getDoc(doc(db, 'market_data', 'latest'));
        if (cacheDoc.exists()) {
          const cachedData = cacheDoc.data() as MetalPrices;
          setPrices(cachedData);
          if (!manualPrices) setManualPrices(cachedData);
          return;
        }
      } catch (cacheErr) {
        console.error('Firestore cache fetch failed:', cacheErr);
      }

      // 4. Final Fallback: Hardcoded values
      const fallback = {
        gold: 2050.45,
        silver: 23.15,
        platinum: 920.80,
        palladium: 1050.20,
        rhodium: 14500,
        chartData: [
          { date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), price: 2000 },
          { date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), price: 2030 },
          { date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), price: 2050.45 }
        ],
        updatedAt: new Date().toISOString()
      };
      setPrices(fallback);
      if (!manualPrices) setManualPrices(fallback);
    }
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user?.role]); // Re-fetch when user role changes to potentially update cache

  const login = async () => {
    const provider = new GoogleAuthProvider();
    try {
      // Use the resolver to handle popups correctly in iframes
      await signInWithPopup(auth, provider, browserPopupRedirectResolver);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
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
      logout,
      isAuthReady
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
