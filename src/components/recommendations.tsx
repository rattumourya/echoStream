
'use client';

import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { getPersonalizedRecommendations } from '@/ai/flows/personalized-music-recommendations';
import { getSongs } from '@/lib/data';
import { Card } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { useMusicPlayer } from '@/context/music-player-context';
import { Wand2, Play } from 'lucide-react';
import Image from 'next/image';
import type { Song } from '@/types';

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}

export default function Recommendations() {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [allSongs, setAllSongs] = useState<Song[]>([]);
  const { playSong } = useMusicPlayer();

  useEffect(() => {
    async function fetchSongs() {
      try {
        const songsData = await getSongs();
        setAllSongs(songsData);
      } catch (error) {
        console.error('Failed to fetch songs for recommendations:', error);
      }
    }
    fetchSongs();
  }, []);

  const handleGetRecommendations = async () => {
    setLoading(true);
    setRecommendations([]);

    const timeOfDay = getTimeOfDay();
    const dayOfWeek = new Date().toLocaleString('en-US', { weekday: 'long' });

    try {
      const result = await getPersonalizedRecommendations({
        listeningHistory:
          'Daft Punk - Get Lucky, The Weeknd - Blinding Lights, Tame Impala - The Less I Know The Better, Queen - Bohemian Rhapsody',
        timeOfDay,
        dayOfWeek,
      });

      if (result.recommendations) {
        setRecommendations(
          result.recommendations.split(',').map((s) => s.trim())
        );
      }
    } catch (error) {
      console.error('Failed to get recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const recommendedSongs = allSongs.filter((song) =>
    recommendations.some((rec) =>
      song.title.toLowerCase().includes(rec.toLowerCase())
    )
  );

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-headline font-semibold">For You</h2>
        <Button onClick={handleGetRecommendations} disabled={loading}>
          <Wand2 className="mr-2 h-4 w-4" />
          {loading ? 'Generating...' : 'Get Fresh Recommendations'}
        </Button>
      </div>

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-auto aspect-square rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      )}

      {!loading && recommendations.length === 0 && (
        <Card className="flex items-center justify-center p-16 text-center bg-muted/20 border-dashed">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Ready for something new?</h3>
            <p className="text-muted-foreground">
              Click the button to get personalized music recommendations from
              our AI.
            </p>
          </div>
        </Card>
      )}

      {!loading && recommendedSongs.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {recommendedSongs.map((song) => (
            <div
              key={song.id}
              className="group relative cursor-pointer"
              onClick={() => playSong(song, recommendedSongs)}
            >
              <Card className="overflow-hidden">
                <div className="relative">
                  <Image
                    src={song.albumArt}
                    alt={song.title}
                    width={300}
                    height={300}
                    className="aspect-square w-full object-cover transition-transform group-hover:scale-105"
                    data-ai-hint="album cover"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      className="h-10 w-10 rounded-full bg-accent shadow-lg"
                    >
                      <Play className="h-5 w-5 fill-white text-white" />
                    </Button>
                  </div>
                </div>
              </Card>
              <div className="mt-2">
                <p className="font-semibold truncate">{song.title}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {song.artist}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
