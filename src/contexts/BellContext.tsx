import React, { createContext, useContext, useEffect, useRef, useCallback, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/storageKeys';
import { useApp } from './AppContext';

export interface BellSettings {
  enabled: boolean;
  intervalMinutes: number;
  soundType: 'chime' | 'bell' | 'ding';
  volume: number;
  promptActivity: boolean;
}

const DEFAULT_SETTINGS: BellSettings = {
  enabled: false,
  intervalMinutes: 60,
  soundType: 'chime',
  volume: 70,
  promptActivity: true,
};

interface BellContextType {
  settings: BellSettings;
  updateSettings: (partial: Partial<BellSettings>) => void;
  playSound: () => void;
}

const BellContext = createContext<BellContextType | undefined>(undefined);

export const BellProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useLocalStorage<BellSettings>(STORAGE_KEYS.BELL_SETTINGS, DEFAULT_SETTINGS);
  const { setActivePanel } = useApp();
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastFiredRef = useRef<number | null>(null);

  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioCtxRef.current;
  }, []);

  const playSound = useCallback(() => {
    try {
      const { volume, soundType } = settings;
      console.log(`[useBell] Playing sound: ${soundType} at volume ${volume}%`);
      
      const ctx = getAudioCtx();
      if (ctx.state === 'suspended') {
        console.log('[useBell] AudioContext was suspended, resuming...');
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
      } else {
        tone(1200, 'sine', now, 0.002, 0.01, 0.35, 0.9);
        tone(1800, 'sine', now, 0.002, 0.01, 0.20, 0.4);
        tone(900, 'sine', now + 0.06, 0.002, 0.01, 0.30, 0.5);
      }
    } catch (e) {
      console.warn('Bell audio error:', e);
    }
  }, [getAudioCtx, settings]);

  // Interval checker (Background Singleton)
  useEffect(() => {
    if (!settings.enabled) return;

    const interval = setInterval(() => {
      const now = new Date();
      const totalMins = now.getHours() * 60 + now.getMinutes();
      const intervalMins = Math.max(1, settings.intervalMinutes);

      if (totalMins % intervalMins === 0 && totalMins !== lastFiredRef.current) {
        lastFiredRef.current = totalMins;
        console.log(`[useBell] Triggered at ${now.toLocaleTimeString()}. Total mins: ${totalMins}, Interval: ${intervalMins}min`);
        playSound();
        if (settings.promptActivity) {
          console.log('[useBell] Prompting activity log...');
          setTimeout(() => setActivePanel('worklog'), 800);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [settings.enabled, settings.intervalMinutes, settings.promptActivity, playSound, setActivePanel]);

  const updateSettings = useCallback((partial: Partial<BellSettings>) => {
    setSettings(prev => ({ ...prev, ...partial }));
  }, [setSettings]);

  const value: BellContextType = {
    settings,
    updateSettings,
    playSound
  };

  return <BellContext.Provider value={value}>{children}</BellContext.Provider>;
};

export const useBellContext = () => {
  const context = useContext(BellContext);
  if (context === undefined) {
    throw new Error('useBellContext must be used within a BellProvider');
  }
  return context;
};
