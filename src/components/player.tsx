
'use client';

import { useMusicPlayer } from '@/context/music-player-context';
import Image from 'next/image';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  ListMusic,
} from 'lucide-react';
import { Slider } from './ui/slider';
import { Button } from './ui/button';
import { useEffect, useRef, useState } from 'react';
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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [lastVolume, setLastVolume] = useState(0.5);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
    };
    const setAudioTime = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration > 0) {
        setProgress((audio.currentTime / audio.duration) * 100);
      } else {
        setProgress(0);
      }
    };
    const handleEnded = () => {
        playNext();
    }

    if(currentSong) {
        if (audio.src !== currentSong.url) {
            audio.src = currentSong.url;
            audio.load();
        }

        if(isPlaying) {
             audio.play().catch(e => console.error("Error playing audio:", e));
        } else {
            audio.pause();
        }
    } else {
        audio.pause();
    }


    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentSong, isPlaying, playNext]);
  
  useEffect(() => {
    if (audioRef.current) {
        audioRef.current.volume = volume;
    }
  }, [volume]);


  const handleProgressChange = (value: number[]) => {
    if (audioRef.current && duration > 0) {
        const newTime = (value[0] / 100) * duration;
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0] / 100;
    setVolume(newVolume);
    setLastVolume(newVolume);
  }
  
  const toggleMute = () => {
    if (volume > 0) {
      setLastVolume(volume);
      setVolume(0);
    } else {
      setVolume(lastVolume > 0 ? lastVolume : 0.5);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || time === 0) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }


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
      <audio ref={audioRef} />
      <div className="grid h-full grid-cols-[1fr_2fr_1fr] items-center px-4 md:px-6">
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

        <div className="flex flex-col items-center justify-center gap-2">
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
            <div className="flex w-full max-w-sm items-center gap-2">
              <span className="text-xs text-muted-foreground">{formatTime(currentTime)}</span>
              <Slider value={[progress || 0]} max={100} step={1} className="w-full" onValueChange={handleProgressChange} />
              <span className="text-xs text-muted-foreground">{formatTime(duration)}</span>
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
                <div className="mt-4 flex flex-col gap-y-1">
                  {queue.length > 0 ? (
                    queue.map((song, index) => (
                      <div
                        key={`${song.id}-${index}`}
                        className={cn(
                          "flex items-center gap-4 rounded-md p-2 cursor-pointer hover:bg-muted",
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
                           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent">
                                <rect x="6" y="5" width="2" height="14" fill="currentColor"><animate attributeName="height" values="14;8;14" begin="0s" dur="1s" repeatCount="indefinite" /></rect>
                                <rect x="11" y="5" width="2" height="14" fill="currentColor"><animate attributeName="height" values="14;8;14" begin="0.2s" dur="1s" repeatCount="indefinite" /></rect>
                                <rect x="16" y="5" width="2" height="14" fill="currentColor"><animate attributeName="height" values="14;8;14" begin="0.4s" dur="1s" repeatCount="indefinite" /></rect>
                            </svg>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="mt-8 text-center text-muted-foreground">Your queue is empty.</p>
                  )}
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2">
             <Button variant="ghost" size="icon" onClick={toggleMute}>
                {volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
             </Button>
            <Slider value={[volume * 100]} max={100} step={1} className="w-24" onValueChange={handleVolumeChange} />
          </div>
        </div>
      </div>
    </div>
  );
}
