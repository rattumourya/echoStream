
import type { Song, Artist, Album, Playlist } from '@/types';

export const artists: Artist[] = [
  { id: '1', name: 'Cosmic Pulse', imageUrl: 'https://placehold.co/300x300.png' },
  { id: '2', name: 'Stella Wave', imageUrl: 'https://placehold.co/300x300.png' },
  { id: '3', name: 'Neon Dreams', imageUrl: 'https://placehold.co/300x300.png' },
  { id: '4', name: 'Echo Collective', imageUrl: 'https://placehold.co/300x300.png' },
];

export const albums: Album[] = [
  { id: '1', title: 'Starlight', artist: 'Cosmic Pulse', coverArt: 'https://placehold.co/600x600.png' },
  { id: '2', title: 'Ocean Drive', artist: 'Stella Wave', coverArt: 'https://placehold.co/600x600.png' },
  { id: '3', title: 'Metropolis', artist: 'Neon Dreams', coverArt: 'https://placehold.co/600x600.png' },
  { id: '4', title: 'Chronos', artist: 'Echo Collective', coverArt: 'https://placehold.co/600x600.png' },
  { id: '5', title: 'Galaxy', artist: 'Cosmic Pulse', coverArt: 'https://placehold.co/600x600.png' },
  { id: '6', title: 'Mirage', artist: 'Stella Wave', coverArt: 'https://placehold.co/600x600.png' },
];

export const songs: Song[] = [
  { id: '1', title: 'Orion', artist: 'Cosmic Pulse', album: 'Starlight', duration: '3:45', albumArt: 'https://placehold.co/600x600.png', url: 'https://storage.googleapis.com/music-8282/bensound-dreams.mp3' },
  { id: '2', title: 'Nebula', artist: 'Cosmic Pulse', album: 'Starlight', duration: '4:12', albumArt: 'https://placehold.co/600x600.png', url: 'https://storage.googleapis.com/music-8282/bensound-creativeminds.mp3' },
  { id: '3', title: 'Sunset', artist: 'Stella Wave', album: 'Ocean Drive', duration: '3:30', albumArt: 'https://placehold.co/600x600.png', url: 'https://storage.googleapis.com/music-8282/bensound-anewbeginning.mp3' },
  { id: '4', title: 'Palm Trees', artist: 'Stella Wave', album: 'Ocean Drive', duration: '2:58', albumArt: 'https://placehold.co/600x600.png', url: 'https://storage.googleapis.com/music-8282/bensound-happyrock.mp3' },
  { id: '5', title: 'Skyline', artist: 'Neon Dreams', album: 'Metropolis', duration: '3:55', albumArt: 'https://placehold.co/600x600.png', url: 'https://storage.googleapis.com/music-8282/bensound-jazzyfrenchy.mp3' },
  { id: '6', title: 'Nightride', artist: 'Neon Dreams', album: 'Metropolis', duration: '4:20', albumArt: 'https://placehold.co/600x600.png', url: 'https://storage.googleapis.com/music-8282/bensound-funkyelement.mp3' },
  { id: '7', title: 'Timeless', artist: 'Echo Collective', album: 'Chronos', duration: '5:01', albumArt: 'https://placehold.co/600x600.png', url: 'https://storage.googleapis.com/music-8282/bensound-memories.mp3' },
  { id: '8', title: 'Hourglass', artist: 'Echo Collective', album: 'Chronos', duration: '4:44', albumArt: 'https://placehold.co/600x600.png', url: 'https://storage.googleapis.com/music-8282/bensound-perception.mp3' },
  { id: '9', title: 'Supernova', artist: 'Cosmic Pulse', album: 'Galaxy', duration: '3:21', albumArt: 'https://placehold.co/600x600.png', url: 'https://storage.googleapis.com/music-8282/bensound-rumble.mp3' },
  { id: '10', title: 'Andromeda', artist: 'Cosmic Pulse', album: 'Galaxy', duration: '4:05', albumArt: 'https://placehold.co/600x600.png', url: 'https://storage.googleapis.com/music-8282/bensound-scifi.mp3' },
  { id: '11', title: 'Oasis', artist: 'Stella Wave', album: 'Mirage', duration: '3:15', albumArt: 'https://placehold.co/600x600.png', url: 'https://storage.googleapis.com/music-8282/bensound-slowmotion.mp3' },
  { id: '12', title: 'Dunes', artist: 'Stella Wave', album: 'Mirage', duration: '3:50', albumArt: 'https://placehold.co/600x600.png', url: 'https://storage.googleapis.com/music-8282/bensound-summer.mp3' },
];

export const playlists: Playlist[] = [
    { id: '1', title: 'Chill Vibes', description: 'Relax and unwind with these laid-back tracks.', coverArt: 'https://placehold.co/600x600.png' },
    { id: '2', title: 'Focus Flow', description: 'Instrumental tracks to help you concentrate.', coverArt: 'https://placehold.co/600x600.png' },
    { id: '3', title: 'Workout Hits', description: 'High-energy tracks to power your workout.', coverArt: 'https://placehold.co/600x600.png' },
    { id: '4', title: 'Late Night Drive', description: 'Synthwave and electronic beats for the open road.', coverArt: 'https://placehold.co/600x600.png' },
    { id: '5', title: 'Indie Discovery', description: 'Fresh tracks from emerging artists.', coverArt: 'https://placehold.co/600x600.png' },
    { id: '6', title: 'Acoustic Morning', description: 'Gentle acoustic songs to start your day.', coverArt: 'https://placehold.co/600x600.png' },
];
