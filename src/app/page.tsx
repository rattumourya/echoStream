
'use client';

import { useEffect, useState } from 'react';
import { getAlbums, getPlaylists } from '@/lib/data';
import SongCard from '@/components/song-card';
import Recommendations from '@/components/recommendations';
import { Skeleton } from '@/components/ui/skeleton';
import type { Album, Playlist } from '@/types';
import withAuth from '@/components/with-auth';
import ProtectedLayout from '@/components/protected-layout';

function Home() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [albumData, playlistData] = await Promise.all([
          getAlbums(),
          getPlaylists(),
        ]);
        setAlbums(albumData);
        setPlaylists(playlistData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <ProtectedLayout>
      <div className="space-y-12">
        <section>
          <h1 className="text-4xl font-headline font-bold mb-2">Welcome to EchoStream</h1>
          <p className="text-muted-foreground">Discover new music tailored just for you.</p>
        </section>

        <Recommendations />
        
        <section>
          <h2 className="text-2xl font-headline font-semibold mb-4">Featured Albums</h2>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                      <Skeleton className="h-auto aspect-[3/4] rounded-lg" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                  </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {albums.slice(0, 6).map((album) => (
                <SongCard key={album.id} item={album} type="album" />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-headline font-semibold mb-4">Popular Playlists</h2>
           {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                      <Skeleton className="h-auto aspect-[3/4] rounded-lg" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                  </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {playlists.slice(0, 6).map((playlist) => (
                <SongCard key={playlist.id} item={playlist} type="playlist" />
              ))}
            </div>
          )}
        </section>
      </div>
    </ProtectedLayout>
  );
}

export default withAuth(Home);
