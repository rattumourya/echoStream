'use client';

import Image from 'next/image';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Play } from 'lucide-react';
import type { Album, Playlist, Song } from '@/types';
import { useMusicPlayer } from '@/context/music-player-context';
import { songs as allSongs } from '@/lib/data';

interface SongCardProps {
  item: Album | Playlist;
  type: 'album' | 'playlist';
  aspectRatio?: "portrait" | "square";
}

export default function SongCard({ item, type, aspectRatio = 'portrait' }: SongCardProps) {
  const { playSong } = useMusicPlayer();

  const handlePlay = () => {
    let songsToPlay: Song[];
    if (type === 'album') {
      songsToPlay = allSongs.filter(song => song.album === item.title);
    } else {
      // For playlists, we'd typically have a list of song IDs.
      // Here we'll just play the first 5 songs for demo purposes.
      songsToPlay = allSongs.slice(0, 5);
    }
    if (songsToPlay.length > 0) {
      playSong(songsToPlay[0], songsToPlay);
    }
  };

  return (
    <div className="group relative cursor-pointer" onClick={handlePlay}>
      <Card className="overflow-hidden">
        <div className="relative">
          <Image
            src={item.coverArt}
            alt={item.title}
            width={300}
            height={aspectRatio === 'square' ? 300 : 400}
            className={`w-full object-cover transition-transform group-hover:scale-105 ${
              aspectRatio === 'square' ? 'aspect-square' : 'aspect-[3/4]'
            }`}
            data-ai-hint={`${type} cover`}
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="icon" className="h-10 w-10 rounded-full bg-accent shadow-lg">
              <Play className="h-5 w-5 fill-white text-white" />
            </Button>
          </div>
        </div>
      </Card>
      <div className="mt-2">
        <p className="font-semibold truncate">{item.title}</p>
        <p className="text-sm text-muted-foreground truncate">{item.artist || 'Playlist'}</p>
      </div>
    </div>
  );
}
