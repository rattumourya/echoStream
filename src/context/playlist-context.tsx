'use client';

import type { Playlist } from '@/types';
import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { getPlaylists as fetchPlaylists } from '@/lib/data';

interface PlaylistContextType {
  playlists: Playlist[];
  loading: boolean;
  refreshPlaylists: () => Promise<void>;
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

export const PlaylistProvider = ({ children }: { children: ReactNode }) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshPlaylists = useCallback(async () => {
    setLoading(true);
    try {
      const playlistData = await fetchPlaylists();
      setPlaylists(playlistData);
    } catch (error) {
      console.error("Failed to fetch playlists:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshPlaylists();
  }, [refreshPlaylists]);

  const value = { playlists, loading, refreshPlaylists };

  return (
    <PlaylistContext.Provider value={value}>
      {children}
    </PlaylistContext.Provider>
  );
};

export const usePlaylists = () => {
  const context = useContext(PlaylistContext);
  if (context === undefined) {
    throw new Error('usePlaylists must be used within a PlaylistProvider');
  }
  return context;
};
