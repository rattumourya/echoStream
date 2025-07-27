
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Clock, Plus, Trash2, Star } from 'lucide-react';
import { getPlaylistById, getSongs, updatePlaylistSongs } from '@/lib/data';
import { useMusicPlayer } from '@/context/music-player-context';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import type { Song, Playlist } from '@/types';
import { Input } from '@/components/ui/input';
import withAuth from '@/components/with-auth';
import ProtectedLayout from '@/components/protected-layout';
import { useAuth } from '@/context/auth-context';
import { Badge } from '@/components/ui/badge';

function PlaylistPage() {
  const params = useParams();
  const id = params.id as string;
  const { playSong } = useMusicPlayer();
  const { toast } = useToast();
  const { userProfile } = useAuth();
  const router = useRouter();

  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [allSongs, setAllSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddSongOpen, setAddSongOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      setLoading(true);
      try {
        const [playlistData, allSongsData] = await Promise.all([
          getPlaylistById(id),
          getSongs(),
        ]);
        
        setPlaylist(playlistData);
        setAllSongs(allSongsData);

        if (playlistData?.songIds) {
          const playlistSongs = allSongsData.filter(song => playlistData.songIds?.includes(song.id));
          setSongs(playlistSongs);
        } else {
          setSongs([]);
        }

      } catch (error) {
        console.error("Failed to fetch playlist data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const handleUpgrade = () => {
    router.push('/settings');
  };
  
  const handlePlay = (song: Song) => {
    if (song.isPremium && !userProfile?.isPremium) {
      toast({
        title: "Upgrade to Premium",
        description: "This song is only available to premium users.",
        variant: "destructive",
        action: <Button onClick={handleUpgrade}>Upgrade</Button>,
      });
      return;
    }
    playSong(song, songs);
  };
  
  const handleAddSong = async (song: Song) => {
    if (!playlist || !playlist.songIds) return;
    if (playlist.songIds.includes(song.id)) {
        toast({ title: 'Song already in playlist', variant: 'destructive' });
        return;
    }
    
    const newSongIds = [...playlist.songIds, song.id];
    try {
        await updatePlaylistSongs(playlist.id, newSongIds);
        const newSongs = [...songs, song];
        setSongs(newSongs);
        setPlaylist(prev => prev ? { ...prev, songIds: newSongIds } : null);
        toast({ title: 'Song added to playlist!' });
    } catch (error) {
        console.error("Failed to add song:", error);
        toast({ title: 'Error adding song', variant: 'destructive' });
    }
  };

  const handleRemoveSong = async (songToRemove: Song) => {
    if (!playlist || !playlist.songIds) return;
    const newSongIds = playlist.songIds.filter(songId => songId !== songToRemove.id);
     try {
        await updatePlaylistSongs(playlist.id, newSongIds);
        const newSongs = songs.filter(s => s.id !== songToRemove.id);
        setSongs(newSongs);
        setPlaylist(prev => prev ? { ...prev, songIds: newSongIds } : null);
        toast({ title: 'Song removed from playlist!' });
    } catch (error) {
        console.error("Failed to remove song:", error);
        toast({ title: 'Error removing song', variant: 'destructive' });
    }
  };

  const filteredAllSongs = searchTerm 
    ? allSongs.filter(song => song.title.toLowerCase().includes(searchTerm.toLowerCase()) || song.artist.toLowerCase().includes(searchTerm.toLowerCase()))
    : allSongs;

  if (loading) {
    return <ProtectedLayout><PlaylistSkeleton /></ProtectedLayout>;
  }

  if (!playlist) {
    return <ProtectedLayout><div className="text-center py-16">Playlist not found.</div></ProtectedLayout>;
  }

  return (
    <ProtectedLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row items-start gap-8">
          <Image
            src={playlist.coverArt}
            alt={playlist.title}
            width={250}
            height={250}
            className="h-48 w-48 md:h-64 md:w-64 rounded-lg object-cover shadow-lg"
            data-ai-hint="playlist cover"
          />
          <div className="flex-1 space-y-4 pt-4">
            <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Playlist</p>
            <h1 className="text-5xl md:text-7xl font-headline font-bold">{playlist.title}</h1>
            <p className="text-muted-foreground">{playlist.description}</p>
            <p className="text-sm text-muted-foreground">{songs.length} songs</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button onClick={() => songs.length > 0 && handlePlay(songs[0])} disabled={songs.length === 0} size="lg">
              Play
          </Button>
           <Dialog open={isAddSongOpen} onOpenChange={setAddSongOpen}>
              <DialogTrigger asChild>
                  <Button variant="outline" size="lg"><Plus className="mr-2 h-4 w-4" /> Add Songs</Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
                  <DialogHeader>
                      <DialogTitle>Add Songs to "{playlist.title}"</DialogTitle>
                  </DialogHeader>
                  <Input placeholder="Search for songs..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  <ScrollArea className="flex-1 -mx-6">
                      <div className="px-6">
                          {filteredAllSongs.map(song => (
                              <div key={song.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                                  <div className="flex items-center gap-4">
                                      <Image src={song.albumArt} alt={song.title} width={40} height={40} className="rounded" />
                                      <div>
                                          <p className="font-semibold">{song.title}</p>
                                          <p className="text-sm text-muted-foreground">{song.artist}</p>
                                      </div>
                                  </div>
                                  <Button size="sm" variant="ghost" onClick={() => handleAddSong(song)} disabled={playlist.songIds?.includes(song.id)}>
                                      <Plus className="h-4 w-4" />
                                  </Button>
                              </div>
                          ))}
                      </div>
                  </ScrollArea>
              </DialogContent>
          </Dialog>
        </div>

        <div>
          <div className="grid grid-cols-12 gap-4 px-4 py-2 text-muted-foreground font-medium">
            <div className="col-span-1">#</div>
            <div className="col-span-5">Title</div>
            <div className="col-span-4">Album</div>
            <div className="col-span-1 text-right"><Clock className="h-4 w-4 inline-block" /></div>
            <div className="col-span-1"></div>
          </div>
          <Separator />
          <div className="mt-4 space-y-1">
            {songs.length > 0 ? (
              songs.map((song, index) => (
                <div key={song.id} className="grid grid-cols-12 gap-4 items-center p-2 px-4 rounded-md group hover:bg-muted/50">
                  <div className="col-span-1 text-muted-foreground">{index + 1}</div>
                  <div className="col-span-5 flex items-center gap-4">
                     <Image src={song.albumArt} alt={song.title} width={40} height={40} className="rounded"/>
                     <div>
                       <div className="flex items-center gap-2">
                         <p className="font-semibold cursor-pointer" onClick={() => handlePlay(song)}>{song.title}</p>
                         {song.isPremium && !userProfile?.isPremium && <Badge variant="destructive" className="h-5">Premium</Badge>}
                       </div>
                       <p className="text-sm text-muted-foreground">{song.artist}</p>
                     </div>
                  </div>
                  <div className="col-span-4 text-muted-foreground truncate">{song.album}</div>
                  <div className="col-span-1 text-muted-foreground text-right">{song.duration}</div>
                  <div className="col-span-1 text-right">
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100" onClick={() => handleRemoveSong(song)}>
                          <Trash2 className="h-4 w-4"/>
                      </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 text-muted-foreground">
                <p>This playlist is empty. Add some songs to get started!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}

function PlaylistSkeleton() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-start gap-8">
                <Skeleton className="h-48 w-48 md:h-64 md:w-64 rounded-lg" />
                <div className="flex-1 space-y-4 pt-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-16 w-3/4" />
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-16" />
                </div>
            </div>
            <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-24" />
                <Skeleton className="h-12 w-32" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full" />
                ))}
            </div>
        </div>
    )
}

export default withAuth(PlaylistPage);
