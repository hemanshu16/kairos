import React, { createContext, useContext, useEffect, useRef, useCallback, ReactNode, useState, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/storageKeys';

export type ReminderType = 'interval' | 'time';
export type SoundType = 'chime' | 'bell' | 'ding' | 'gong' | 'digital';

export interface Reminder {
  id: string;
  title: string;
  message: string;
  type: ReminderType;
  intervalMinutes?: number; 
  timeOfDay?: string; // "HH:MM"
  soundType: SoundType;
  enabled: boolean;
  lastTriggered?: number; 
}

export interface BellSettings {
  volume: number;
  reminders: Reminder[];
}

const DEFAULT_SETTINGS: BellSettings = {
  volume: 70,
  reminders: [],
};

interface BellContextType {
  settings: BellSettings;
  updateVolume: (vol: number) => void;
  addReminder: (r: Omit<Reminder, 'id'>) => void;
  updateReminder: (id: string, updates: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
  playSound: (type: SoundType) => void;
  activeAlert: Reminder | null;
  dismissAlert: () => void;
}

const BellContext = createContext<BellContextType | undefined>(undefined);

export const BellProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useLocalStorage<BellSettings>(STORAGE_KEYS.BELL_SETTINGS, DEFAULT_SETTINGS);
  const [activeAlert, setActiveAlert] = useState<Reminder | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioCtxRef.current;
  }, []);

  const playSound = useCallback((soundType: SoundType) => {
    try {
      const { volume } = settings;
      const ctx = getAudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const vol = volume / 100;
      const now = ctx.currentTime;

      const master = ctx.createGain();
      master.gain.setValueAtTime(vol, now);
      master.connect(ctx.destination);

      const tone = (freq: number, waveType: OscillatorType, startT: number, attackT: number, holdT: number, decayT: number, peakVol: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = waveType;
        osc.frequency.setValueAtTime(freq, startT);
        gain.gain.setValueAtTime(0, startT);
        gain.gain.linearRampToValueAtTime(peakVol, startT + attackT);
        gain.gain.setValueAtTime(peakVol, startT + attackT + holdT);
        gain.gain.exponentialRampToValueAtTime(0.0001, startT + attackT + holdT + decayT);
        osc.connect(gain);
        gain.connect(master);
        osc.start(startT);
        osc.stop(startT + attackT + holdT + decayT + 0.05);
      };

      if (soundType === 'chime') {
        tone(1047, 'sine', now, 0.005, 0.05, 0.9, 0.8);
        tone(1319, 'sine', now, 0.005, 0.05, 0.7, 0.5);
        tone(784, 'sine', now + 0.5, 0.005, 0.05, 1.0, 0.8);
        tone(659, 'sine', now + 0.5, 0.005, 0.05, 0.8, 0.4);
      } else if (soundType === 'bell') {
        tone(523, 'sine', now, 0.001, 0.01, 2.5, 0.9);
        tone(1046, 'sine', now, 0.001, 0.01, 1.8, 0.4);
        tone(1568, 'triangle', now, 0.002, 0.01, 1.2, 0.2);
        tone(2093, 'triangle', now, 0.002, 0.01, 0.8, 0.1);
      } else if (soundType === 'ding') {
        tone(1200, 'sine', now, 0.002, 0.01, 0.35, 0.9);
        tone(1800, 'sine', now, 0.002, 0.01, 0.20, 0.4);
        tone(900, 'sine', now + 0.06, 0.002, 0.01, 0.30, 0.5);
      } else if (soundType === 'gong') {
        tone(300, 'sine', now, 0.05, 0.2, 4.0, 1.0);
        tone(450, 'sine', now, 0.05, 0.1, 2.0, 0.5);
        tone(600, 'triangle', now, 0.05, 0.05, 1.0, 0.3);
      } else if (soundType === 'digital') {
        tone(1400, 'square', now, 0.01, 0.05, 0.1, 0.4);
        tone(2100, 'square', now + 0.1, 0.01, 0.05, 0.1, 0.4);
        tone(2800, 'square', now + 0.2, 0.01, 0.05, 0.1, 0.4);
      }
    } catch (e) {
      console.warn('Bell audio error:', e);
    }
  }, [getAudioCtx, settings]);

  // Unified background loop
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentDayMin = now.getHours() * 60 + now.getMinutes();
      const currentHHMM = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
      
      let needsSave = false;
      const updatedReminders = settings.reminders.map(r => {
        if (!r.enabled) return r;

        let shouldTrigger = false;
        
        if (r.type === 'interval' && r.intervalMinutes) {
          if (currentDayMin > 0 && currentDayMin % r.intervalMinutes === 0) {
            // Check to avoid continuous firing within the same minute
            if (r.lastTriggered !== currentDayMin) {
              shouldTrigger = true;
            }
          }
        } else if (r.type === 'time' && r.timeOfDay) {
          if (r.timeOfDay === currentHHMM) {
            if (r.lastTriggered !== currentDayMin) {
              shouldTrigger = true;
            }
          }
        }

        if (shouldTrigger) {
          console.log(`[useReminders] Triggering ${r.title}`);
          playSound(r.soundType);
          setActiveAlert(r);
          
          if (Notification.permission === 'granted') {
            new Notification(r.title, { body: r.message });
          }
          
          needsSave = true;
          return { ...r, lastTriggered: currentDayMin };
        }
        return r;
      });

      if (needsSave) {
        setSettings(prev => ({ ...prev, reminders: updatedReminders }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [settings.reminders, playSound, setSettings]);

  // Methods
  const addReminder = useCallback((r: Omit<Reminder, 'id'>) => {
    const id = 'rem-' + Math.random().toString(36).substr(2, 9);
    setSettings(prev => ({
      ...prev,
      reminders: [...(prev.reminders || []), { ...r, id }]
    }));
  }, [setSettings]);

  const updateReminder = useCallback((id: string, updates: Partial<Reminder>) => {
    setSettings(prev => ({
      ...prev,
      reminders: prev.reminders.map(r => r.id === id ? { ...r, ...updates } : r)
    }));
  }, [setSettings]);

  const deleteReminder = useCallback((id: string) => {
    setSettings(prev => ({
      ...prev,
      reminders: prev.reminders.map(r => r.id === id ? { ...r, enabled: false } : r).filter(r => r.id !== id)
    }));
  }, [setSettings]);

  const updateVolume = useCallback((vol: number) => {
    setSettings(prev => ({ ...prev, volume: vol }));
  }, [setSettings]);

  const dismissAlert = useCallback(() => {
    setActiveAlert(null);
  }, []);

  const value: BellContextType = useMemo(() => ({
    settings,
    updateVolume,
    addReminder,
    updateReminder,
    deleteReminder,
    playSound,
    activeAlert,
    dismissAlert
  }), [
    settings,
    updateVolume,
    addReminder,
    updateReminder,
    deleteReminder,
    playSound,
    activeAlert,
    dismissAlert
  ]);

  return <BellContext.Provider value={value}>{children}</BellContext.Provider>;
};

export const useBellContext = () => {
  const context = useContext(BellContext);
  if (context === undefined) {
    throw new Error('useBellContext must be used within a BellProvider');
  }
  return context;
};
