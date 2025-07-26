
'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon } from 'lucide-react';
import { getSongs, getArtists, getAlbums } from '@/lib/data';
import SongCard from '@/components/song-card';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useMusicPlayer } from '@/context/music-player-context';
import type { Song, Artist, Album } from '@/types';

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [submittedSearchTerm, setSubmittedSearchTerm] = useState('');
  const [allSongs, setAllSongs] = useState<Song[]>([]);
  const [allArtists, setAllArtists] = useState<Artist[]>([]);
  const [allAlbums, setAllAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const { playSong } = useMusicPlayer();
  
  useEffect(() => {
    async function fetchData() {
      try {
        const [songData, artistData, albumData] = await Promise.all([
          getSongs(),
          getArtists(),
          getAlbums(),
        ]);
        setAllSongs(songData);
        setAllArtists(artistData);
        setAllAlbums(albumData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedSearchTerm(searchTerm);
  };

  const handlePlay = (song: Song) => {
    playSong(song, filteredSongs);
  };

  const filteredSongs = submittedSearchTerm
    ? allSongs.filter((song) => song.title.toLowerCase().includes(submittedSearchTerm.toLowerCase()))
    : [];
  const filteredArtists = submittedSearchTerm
    ? allArtists.filter((artist) => artist.name.toLowerCase().includes(submittedSearchTerm.toLowerCase()))
    : [];
  const filteredAlbums = submittedSearchTerm
    ? allAlbums.filter((album) => album.title.toLowerCase().includes(submittedSearchTerm.toLowerCase()))
    : [];

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-headline font-bold">Search</h1>
      <form onSubmit={handleSearchSubmit} className="flex w-full max-w-lg items-center space-x-2">
        <Input
          type="search"
          placeholder="Search for songs, artists, albums..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-12 text-lg"
        />
        <Button type="submit" size="lg">
          <SearchIcon className="mr-2 h-5 w-5" /> Search
        </Button>
      </form>

      {submittedSearchTerm && (
        <div className="space-y-12">
          {filteredSongs.length > 0 && (
            <section>
              <h2 className="text-2xl font-headline font-semibold mb-4">Songs</h2>
              <Card>
                <CardContent className="p-0">
                  <div className="space-y-2">
                    {filteredSongs.map((song, index) => (
                      <div key={song.id}>
                        <div className="flex items-center p-4 hover:bg-muted/50 rounded-lg cursor-pointer" onClick={() => handlePlay(song)}>
                          <div className="flex-1 flex items-center space-x-4">
                            <span className="text-muted-foreground">{index + 1}</span>
                            <div>
                                <p className="font-semibold">{song.title}</p>
                                <p className="text-sm text-muted-foreground">{song.artist}</p>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{song.duration}</p>
                        </div>
                        {index < filteredSongs.length - 1 && <Separator />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>
          )}

          {filteredArtists.length > 0 && (
            <section>
              <h2 className="text-2xl font-headline font-semibold mb-4">Artists</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filteredArtists.map((artist) => (
                    <div key={artist.id} className="flex flex-col items-center space-y-2 text-center">
                        <Avatar className="h-32 w-32">
                            <AvatarImage src={artist.imageUrl} alt={artist.name} data-ai-hint="artist image" />
                            <AvatarFallback>{artist.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <p className="font-semibold">{artist.name}</p>
                    </div>
                ))}
              </div>
            </section>
          )}

          {filteredAlbums.length > 0 && (
            <section>
              <h2 className="text-2xl font-headline font-semibold mb-4">Albums</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filteredAlbums.map((album) => (
                  <SongCard key={album.id} item={album} type="album" />
                ))}
              </div>
            </section>
          )}

          {filteredSongs.length === 0 && filteredArtists.length === 0 && filteredAlbums.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No results found for "{submittedSearchTerm}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
