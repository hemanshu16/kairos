import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/storageKeys';

interface AppContextType {
  username: string;
  setUsername: (name: string) => void;
  birthDate: string | null;
  setBirthDate: (date: string | null) => void;
  lifeExpectancy: number;
  setLifeExpectancy: (age: number) => void;
  timezone: string;
  setTimezone: (tz: string) => void;
  use24Hour: boolean;
  setUse24Hour: (use24: boolean) => void;
  customBg: string | null;
  setCustomBg: (bg: string | null) => void;
  showLife: boolean;
  setShowLife: (show: boolean) => void;
  isPremium: boolean;
  setIsPremium: (premium: boolean) => void;
  activePanel: string;
  setActivePanel: (panel: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // Supabase user data
  const { user } = useAuth();
  // Persistent name from onboarding (guest mode or fallback for email login)
  const [guestName, setGuestName] = useLocalStorage<string>(STORAGE_KEYS.USERNAME, '');

  // Derivation priority: 
  // 1. Guest name (locally stored during onboarding)
  // 2. Supabase metadata (full_name from social providers)
  // 3. Email prefix (fallback)
  const username = guestName || user?.user_metadata?.full_name || user?.email?.split('@')[0] || '';

  // User preferences (still localStorage — these are app-specific, not auth)
  const [birthDate, setBirthDate] = useLocalStorage<string | null>(STORAGE_KEYS.BIRTHDATE, null);
  const [lifeExpectancy, setLifeExpectancy] = useLocalStorage<number>(STORAGE_KEYS.LIFE_EXPECTANCY, 80);

  // Preferences
  const [timezone, setTimezone] = useLocalStorage<string>(STORAGE_KEYS.TIMEZONE, Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [use24Hour, setUse24Hour] = useLocalStorage<boolean>(STORAGE_KEYS.USE_24_HOUR, true);
  const [customBg, setCustomBg] = useLocalStorage<string | null>(STORAGE_KEYS.CUSTOM_BG, null);
  const [showLife, setShowLife] = useLocalStorage<boolean>(STORAGE_KEYS.SHOW_LIFE, false);

  // Premium
  const [isPremium, setIsPremium] = useLocalStorage<boolean>(STORAGE_KEYS.IS_PREMIUM, false);

  // UI state
  const [activePanel, setActivePanel] = useState<string>('dashboard');

  const value: AppContextType = {
    // User data (from Supabase)
    username,
    setUsername: setGuestName,

    // User preferences
    birthDate,
    setBirthDate,
    lifeExpectancy,
    setLifeExpectancy,

    // Preferences
    timezone,
    setTimezone,
    use24Hour,
    setUse24Hour,
    customBg,
    setCustomBg,
    showLife,
    setShowLife,

    // Premium
    isPremium,
    setIsPremium,

    // UI state
    activePanel,
    setActivePanel,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;
