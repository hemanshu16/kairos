import React, { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/storageKeys';

export interface Track {
  name: string;
  mood: string;
  url: string;
}

export const TRACKS: Track[] = [
  { name: 'Rain on Roof', mood: 'Nature / Focus', url: 'https://actions.google.com/sounds/v1/weather/rain_on_roof.ogg' },
  { name: 'Ocean Waves', mood: 'White Noise', url: 'https://actions.google.com/sounds/v1/water/waves_crashing_on_rock_beach.ogg' },
  { name: 'Beautiful Piano', mood: 'Calm / Study', url: 'https://github.com/rafaelcastrocouto/lofi/raw/master/tracks/3.mp3' },
  { name: 'Lo-Fi Chill', mood: 'Coffee Shop', url: 'https://github.com/rafaelcastrocouto/lofi/raw/master/tracks/1.mp3' },
  { name: 'Deep Space', mood: 'Ambient Focus', url: 'https://github.com/rafaelcastrocouto/lofi/raw/master/tracks/2.mp3' },
  { name: 'Summer Night', mood: 'Calm / Nature', url: 'https://archive.org/download/NatureSoundsCrickets/crickets.mp3' },
];

interface MusicSettings {
  volume: number;
  currentTrackIndex: number;
}

const DEFAULT_SETTINGS: MusicSettings = {
  volume: 50,
  currentTrackIndex: 0,
};

interface MusicContextType {
  isPlaying: boolean;
  currentTrack: Track;
  currentTrackIndex: number;
  volume: number;
  tracks: Track[];
  playPause: () => void;
  selectTrack: (index: number) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setVolume: (vol: number) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useLocalStorage<MusicSettings>(STORAGE_KEYS.MUSIC_SETTINGS, DEFAULT_SETTINGS);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(TRACKS[settings.currentTrackIndex].url);
      audioRef.current.loop = true;
    }
    audioRef.current.volume = settings.volume / 100;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playPause = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const selectTrack = useCallback((index: number) => {
    if (!audioRef.current) return;
    audioRef.current.src = TRACKS[index].url;
    setSettings(prev => ({ ...prev, currentTrackIndex: index }));
    if (isPlaying) {
      audioRef.current.play().catch(console.error);
    }
  }, [isPlaying, setSettings]);

  const nextTrack = useCallback(() => {
    const nextIndex = (settings.currentTrackIndex + 1) % TRACKS.length;
    selectTrack(nextIndex);
  }, [settings.currentTrackIndex, selectTrack]);

  const prevTrack = useCallback(() => {
    const prevIndex = (settings.currentTrackIndex - 1 + TRACKS.length) % TRACKS.length;
    selectTrack(prevIndex);
  }, [settings.currentTrackIndex, selectTrack]);

  const setGlobalVolume = useCallback((vol: number) => {
    if (!audioRef.current) return;
    audioRef.current.volume = vol / 100;
    setSettings(prev => ({ ...prev, volume: vol }));
  }, [setSettings]);

  const value: MusicContextType = {
    isPlaying,
    currentTrack: TRACKS[settings.currentTrackIndex],
    currentTrackIndex: settings.currentTrackIndex,
    volume: settings.volume,
    tracks: TRACKS,
    playPause,
    selectTrack,
    nextTrack,
    prevTrack,
    setVolume: setGlobalVolume
  };

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
};

export const useMusicContext = () => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusicContext must be used within a MusicProvider');
  }
  return context;
};
