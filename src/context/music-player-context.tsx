'use client';

import type { Song } from '@/types';
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface MusicPlayerContextType {
  queue: Song[];
  currentSong: Song | null;
  isPlaying: boolean;
  playSong: (song: Song, playlist?: Song[]) => void;
  togglePlayPause: () => void;
  playNext: () => void;
  playPrevious: () => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

export const MusicPlayerProvider = ({ children }: { children: ReactNode }) => {
  const [queue, setQueue] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

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
    if (currentIndex < queue.length - 1) {
      setCurrentSong(queue[currentIndex + 1]);
      setIsPlaying(true);
    } else {
      // Reached end of queue
      setCurrentSong(null);
      setIsPlaying(false);
      setQueue([]);
    }
  }, [currentSong, queue]);

  const playPrevious = useCallback(() => {
    if (!currentSong) return;
    const currentIndex = queue.findIndex(song => song.id === currentSong.id);
    if (currentIndex > 0) {
      setCurrentSong(queue[currentIndex - 1]);
      setIsPlaying(true);
    }
  }, [currentSong, queue]);

  const value = { queue, currentSong, isPlaying, playSong, togglePlayPause, playNext, playPrevious };

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
