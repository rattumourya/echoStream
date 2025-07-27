'use client';

import type { Song } from '@/types';
import React, { createContext, useContext, useState, ReactNode, useCallback, useRef, useEffect } from 'react';
import { useAuth } from './auth-context';

interface MusicPlayerContextType {
  queue: Song[];
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playSong: (song: Song, playlist?: Song[]) => void;
  togglePlayPause: () => void;
  playNext: () => void;
  playPrevious: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

export const MusicPlayerProvider = ({ children }: { children: ReactNode }) => {
  const [queue, setQueue] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.5);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { userProfile } = useAuth();

  useEffect(() => {
    // Initialize audio element only on the client side
    audioRef.current = new Audio();
    audioRef.current.volume = volume;

    const audio = audioRef.current;
    
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedData = () => setDuration(audio.duration);
    const handleEnded = () => playNext();

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    }
  }, []); // Empty dependency array ensures this runs only once

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;
    
    if (audio.src !== currentSong.url) {
      audio.src = currentSong.url;
    }
    
    if (isPlaying) {
      if (currentSong.isPremium && !userProfile?.isPremium) {
        setIsPlaying(false);
        // Optionally, you can add a toast notification here
        return;
      }
      audio.play().catch(e => console.error("Error playing audio:", e));
    } else {
      audio.pause();
    }
  }, [currentSong, isPlaying, userProfile]);

  const setVolume = useCallback((newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setVolumeState(newVolume);
    }
  }, []);
  
  const playSong = useCallback((song: Song, playlist: Song[] = []) => {
    setCurrentSong(song);
    const newQueue = playlist.length > 0 ? playlist : [song];
    setQueue(newQueue);
    setIsPlaying(true);
  }, []);

  const togglePlayPause = useCallback(() => {
    if (currentSong) {
      setIsPlaying(prev => !prev);
    }
  }, [currentSong]);

  const playNext = useCallback(() => {
    if (!currentSong) return;
    const currentIndex = queue.findIndex(song => song.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % queue.length;
    
    if (queue.length > 0) {
      setCurrentSong(queue[nextIndex]);
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
      setCurrentSong(null);
    }
  }, [currentSong, queue]);

  const playPrevious = useCallback(() => {
    if (!currentSong) return;
    const currentIndex = queue.findIndex(song => song.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;

    if (queue.length > 0) {
      setCurrentSong(queue[prevIndex]);
      setIsPlaying(true);
    }
  }, [currentSong, queue]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
        audioRef.current.currentTime = time;
    }
  }, []);

  const value = { 
    queue, 
    currentSong, 
    isPlaying,
    currentTime,
    duration,
    volume,
    playSong, 
    togglePlayPause, 
    playNext, 
    playPrevious,
    seek,
    setVolume
  };

  return (
    <MusicPlayerContext.Provider value={value}>
      {children}
    </MusicPlayerContext.Provider>
  );
};

export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext);
  if (context === undefined) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return context;
};
