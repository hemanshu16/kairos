import React, { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/storageKeys';

export interface Track {
  name: string;
  mood: string;
  url: string;
}

export const TRACKS: Track[] = [
  { name: 'Lofi Study Beats', mood: 'Calm / Focus', url: 'https://raw.githubusercontent.com/rafaelcastrocouto/lofi/master/tracks/1.mp3' },
  { name: 'Deep Focus Ambient', mood: 'Intense Concentration', url: 'https://raw.githubusercontent.com/rafaelcastrocouto/lofi/master/tracks/2.mp3' },
  { name: 'Pure Rainy Piano', mood: 'Soothing / Flow', url: 'https://raw.githubusercontent.com/rafaelcastrocouto/lofi/master/tracks/3.mp3' },
  { name: 'Forest Ambience', mood: 'Natural Calm', url: 'https://archive.org/download/NatureSoundsCrickets/crickets.mp3' },
  { name: 'Coffee Shop Lofi', mood: 'Comfort / Study', url: 'https://raw.githubusercontent.com/rafaelcastrocouto/lofi/master/tracks/4.mp3' },
];

interface MusicSettings {
  volume: number;
  currentTrackIndex: number;
}

const DEFAULT_SETTINGS: MusicSettings = {
  volume: 40,
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

  // Initialize audio once
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(TRACKS[settings.currentTrackIndex].url);
      audioRef.current.loop = true;
      audioRef.current.volume = settings.volume / 100;
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Sync volume change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = settings.volume / 100;
    }
  }, [settings.volume]);

  // Primary Action: Play/Pause (Always from user click)
  const playPause = useCallback(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Force reload if src is empty for some reason
      if (!audioRef.current.src) {
        audioRef.current.src = TRACKS[settings.currentTrackIndex].url;
      }
      
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          console.error("Playback block:", err);
          setIsPlaying(false);
        });
    }
  }, [isPlaying, settings.currentTrackIndex]);

  // Primary Action: Select Track
  const selectTrack = useCallback((index: number) => {
    if (!audioRef.current) return;
    
    const wasPlaying = isPlaying;
    audioRef.current.pause();
    audioRef.current.src = TRACKS[index].url;
    audioRef.current.load();
    
    setSettings(prev => ({ ...prev, currentTrackIndex: index }));
    
    // Always start playing when a new track is selected (User explicitly clicked it)
    audioRef.current.play()
      .then(() => setIsPlaying(true))
      .catch(err => {
        console.error("Selection play fail:", err);
        setIsPlaying(false);
      });
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
