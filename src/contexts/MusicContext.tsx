import React, { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/storageKeys';

export interface Track {
  name: string;
  mood: string;
  url: string;
}

export const TRACKS: Track[] = [
  { name: 'Piano Ambient', mood: 'Calm', url: 'https://cdn.pixabay.com/audio/2022/11/22/audio_febc508520.mp3' },
  { name: 'Lo-Fi Chill', mood: 'Focus', url: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf5f5.mp3' },
  { name: 'Deep Space', mood: 'Ambient', url: 'https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d2.mp3' },
  { name: 'Study Vibes', mood: 'Study', url: 'https://cdn.pixabay.com/audio/2022/10/25/audio_17b6dc1a61.mp3' },
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
