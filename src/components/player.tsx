
'use client';

import { useMusicPlayer } from '@/context/music-player-context';
import Image from 'next/image';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  ListMusic,
} from 'lucide-react';
import { Slider } from './ui/slider';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';


export default function Player() {
  const {
    currentSong,
    isPlaying,
    togglePlayPause,
    playNext,
    playPrevious,
    queue,
    playSong,
  } = useMusicPlayer();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && currentSong) {
      const durationParts = currentSong.duration.split(':');
      if (durationParts.length === 2) {
        const durationSeconds = parseInt(durationParts[0]) * 60 + parseInt(durationParts[1]);
        if (!isNaN(durationSeconds) && durationSeconds > 0) {
            timer = setInterval(() => {
                setProgress(prev => {
                    const nextProgress = prev + (100 / durationSeconds);
                    if (nextProgress >= 100) {
                        playNext();
                        return 0;
                    }
                    return nextProgress;
                });
            }, 1000);
        }
      }
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentSong, playNext]);

  useEffect(() => {
    setProgress(0);
  }, [currentSong]);

  if (!currentSong) {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 h-24 border-t bg-background/95 backdrop-blur-sm">
            <div className="flex h-full items-center justify-center text-muted-foreground">
                <p>No song selected. Choose a song to start playing.</p>
            </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 h-24 border-t bg-background/95 backdrop-blur-sm">
      <div className="grid h-full grid-cols-3 items-center px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Image
            src={currentSong.albumArt}
            alt={currentSong.title}
            width={64}
            height={64}
            className="h-16 w-16 rounded-md object-cover"
            data-ai-hint="album cover"
          />
          <div className="hidden md:block">
            <p className="font-semibold truncate">{currentSong.title}</p>
            <p className="text-sm text-muted-foreground">{currentSong.artist}</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={playPrevious}>
              <SkipBack className="h-6 w-6" />
            </Button>
            <Button
              variant="default"
              size="icon"
              className="h-12 w-12 rounded-full bg-accent hover:bg-accent/90"
              onClick={togglePlayPause}
            >
              {isPlaying ? (
                <Pause className="h-6 w-6 fill-white text-white" />
              ) : (
                <Play className="h-6 w-6 fill-white text-white" />
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={playNext}>
              <SkipForward className="h-6 w-6" />
            </Button>
          </div>
          <div className="w-full max-w-sm flex items-center gap-2">
            <span className="text-xs text-muted-foreground">0:00</span>
            <Slider defaultValue={[0]} value={[progress]} max={100} step={1} className="w-full" />
            <span className="text-xs text-muted-foreground">{currentSong.duration}</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 md:gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <ListMusic className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Up Next</SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-[calc(100%-4rem)] pr-4">
                <div className="flex flex-col gap-y-1 mt-4">
                  {queue.length > 0 ? (
                    queue.map((song, index) => (
                      <div
                        key={`${song.id}-${index}`}
                        className={cn(
                          "flex items-center gap-4 p-2 rounded-md cursor-pointer hover:bg-muted",
                          song.id === currentSong?.id && "bg-muted/50"
                        )}
                        onClick={() => playSong(song, queue)}
                      >
                        <Image
                          src={song.albumArt}
                          alt={song.title}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-md object-cover"
                          data-ai-hint="album cover"
                        />
                        <div className="flex-1">
                          <p className="font-semibold truncate">{song.title}</p>
                          <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                        </div>
                        {song.id === currentSong?.id && isPlaying && (
                           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-accent h-5 w-5">
                                <rect x="6" y="5" width="2" height="14" fill="currentColor"><animate attributeName="height" values="14;8;14" begin="0s" dur="1s" repeatCount="indefinite" /></rect>
                                <rect x="11" y="5" width="2" height="14" fill="currentColor"><animate attributeName="height" values="14;8;14" begin="0.2s" dur="1s" repeatCount="indefinite" /></rect>
                                <rect x="16" y="5" width="2" height="14" fill="currentColor"><animate attributeName="height" values="14;8;14" begin="0.4s" dur="1s" repeatCount="indefinite" /></rect>
                            </svg>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center mt-8">Your queue is empty.</p>
                  )}
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            <Slider defaultValue={[50]} max={100} step={1} className="w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}
