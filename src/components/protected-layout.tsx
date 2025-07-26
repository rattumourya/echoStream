
'use client';

import React from 'react';
import { MusicPlayerProvider } from '@/context/music-player-context';
import { PlaylistProvider } from '@/context/playlist-context';
import Player from '@/components/player';
import AppHeader from '@/components/app-header';
import SidebarLoader from '@/components/sidebar-loader';
import { useAuth } from '@/context/auth-context';
import { Skeleton } from './ui/skeleton';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  if (loading || !user) {
    return (
        <div className="flex h-dvh items-center justify-center">
            <div className="space-y-4 text-center">
                <p className="text-muted-foreground">Loading your experience...</p>
            </div>
        </div>
    )
  }

  return (
    <MusicPlayerProvider>
      <PlaylistProvider>
        <div className="relative flex h-dvh overflow-hidden">
          <SidebarLoader />
          <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            <AppHeader />
            <main className="pb-24">
              <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                {children}
              </div>
            </main>
          </div>
        </div>
        <Player />
      </PlaylistProvider>
    </MusicPlayerProvider>
  );
}
