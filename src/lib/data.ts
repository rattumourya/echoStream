
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { Song, Artist, Album, Playlist } from '@/types';

export const artists: Artist[] = [
  { id: '1', name: 'Cosmic Pulse', imageUrl: 'https://placehold.co/300x300.png', 'data-ai-hint': 'space galaxy' },
  { id: '2', name: 'Stella Wave', imageUrl: 'https://placehold.co/300x300.png', 'data-ai-hint': 'beach sunset' },
  { id: '3', name: 'Neon Dreams', imageUrl: 'https://placehold.co/300x300.png', 'data-ai-hint': 'city night' },
  { id: '4', name: 'Echo Collective', imageUrl: 'https://placehold.co/300x300.png', 'data-ai-hint': 'forest path' },
];

export const albums: Album[] = [
  { id: '1', title: 'Starlight', artist: 'Cosmic Pulse', coverArt: 'https://placehold.co/600x600.png', 'data-ai-hint': 'stars nebula' },
  { id: '2', title: 'Ocean Drive', artist: 'Stella Wave', coverArt: 'https://placehold.co/600x600.png', 'data-ai-hint': 'ocean road' },
  { id: '3', title: 'Metropolis', artist: 'Neon Dreams', coverArt: 'https://placehold.co/600x600.png', 'data-ai-hint': 'futuristic city' },
  { id: '4', title: 'Chronos', artist: 'Echo Collective', coverArt: 'https://placehold.co/600x600.png', 'data-ai-hint': 'clock gears' },
  { id: '5', title: 'Galaxy', artist: 'Cosmic Pulse', coverArt: 'https://placehold.co/600x600.png', 'data-ai-hint': 'spiral galaxy' },
  { id: '6', title: 'Mirage', artist: 'Stella Wave', coverArt: 'https://placehold.co/600x600.png', 'data-ai-hint': 'desert dunes' },
];

export const songs: Song[] = [
    { id: '1', title: 'Orion', artist: 'Cosmic Pulse', album: 'Starlight', duration: '3:45', albumArt: 'https://placehold.co/600x600.png', url: 'https://www.bensound.com/bensound-music/bensound-dreams.mp3', 'data-ai-hint': 'stars nebula' },
    { id: '2', title: 'Nebula', artist: 'Cosmic Pulse', album: 'Starlight', duration: '4:12', albumArt: 'https://placehold.co/600x600.png', url: 'https://www.bensound.com/bensound-music/bensound-creativeminds.mp3', 'data-ai-hint': 'stars nebula' },
    { id: '3', title: 'Sunset', artist: 'Stella Wave', album: 'Ocean Drive', duration: '3:30', albumArt: 'https://placehold.co/600x600.png', url: 'https://www.bensound.com/bensound-music/bensound-anewbeginning.mp3', 'data-ai-hint': 'ocean road' },
    { id: '4', title: 'Palm Trees', artist: 'Stella Wave', album: 'Ocean Drive', duration: '2:58', albumArt: 'https://placehold.co/600x600.png', url: 'https://www.bensound.com/bensound-music/bensound-happyrock.mp3', 'data-ai-hint': 'ocean road' },
    { id: '5', title: 'Skyline', artist: 'Neon Dreams', album: 'Metropolis', duration: '3:55', albumArt: 'https://placehold.co/600x600.png', url: 'https://www.bensound.com/bensound-music/bensound-jazzyfrenchy.mp3', 'data-ai-hint': 'futuristic city' },
    { id: '6', title: 'Nightride', artist: 'Neon Dreams', album: 'Metropolis', duration: '4:20', albumArt: 'https://placehold.co/600x600.png', url: 'https://www.bensound.com/bensound-music/bensound-funkyelement.mp3', 'data-ai-hint': 'futuristic city' },
    { id: '7', title: 'Timeless', artist: 'Echo Collective', album: 'Chronos', duration: '5:01', albumArt: 'https://placehold.co/600x600.png', url: 'https://www.bensound.com/bensound-music/bensound-memories.mp3', 'data-ai-hint': 'clock gears' },
    { id: '8', title: 'Hourglass', artist: 'Echo Collective', album: 'Chronos', duration: '4:44', albumArt: 'https://placehold.co/600x600.png', url: 'https://www.bensound.com/bensound-music/bensound-perception.mp3', 'data-ai-hint': 'clock gears' },
    { id: '9', title: 'Supernova', artist: 'Cosmic Pulse', album: 'Galaxy', duration: '3:21', albumArt: 'https://placehold.co/600x600.png', url: 'https://www.bensound.com/bensound-music/bensound-rumble.mp3', 'data-ai-hint': 'spiral galaxy' },
    { id: '10', title: 'Andromeda', artist: 'Cosmic Pulse', album: 'Galaxy', duration: '4:05', albumArt: 'https://placehold.co/600x600.png', url: 'https://www.bensound.com/bensound-music/bensound-scifi.mp3', 'data-ai-hint': 'spiral galaxy' },
    { id: '11', title: 'Oasis', artist: 'Stella Wave', album: 'Mirage', duration: '3:15', albumArt: 'https://placehold.co/600x600.png', url: 'https://www.bensound.com/bensound-music/bensound-slowmotion.mp3', 'data-ai-hint': 'desert dunes' },
    { id: '12', title: 'Dunes', artist: 'Stella Wave', album: 'Mirage', duration: '3:50', albumArt: 'https://placehold.co/600x600.png', url: 'https://www.bensound.com/bensound-music/bensound-summer.mp3', 'data-ai-hint': 'desert dunes' },
];

export const playlists: Playlist[] = [
    { id: '1', title: 'Chill Vibes', description: 'Relax and unwind with these laid-back tracks.', coverArt: 'https://placehold.co/600x600.png', 'data-ai-hint': 'coffee shop', songIds: ['3', '7', '11'] },
    { id: '2', title: 'Focus Flow', description: 'Instrumental tracks to help you concentrate.', coverArt: 'https://placehold.co/600x600.png', 'data-ai-hint': 'library books', songIds: ['2', '8', '10'] },
    { id: '3', title: 'Workout Hits', description: 'High-energy tracks to power your workout.', coverArt: 'https://placehold.co/600x600.png', 'data-ai-hint': 'gym weights', songIds: ['4', '6', '9'] },
    { id: '4', title: 'Late Night Drive', description: 'Synthwave and electronic beats for the open road.', coverArt: 'https://placehold.co/600x600.png', 'data-ai-hint': 'night road', songIds: ['5', '6', '10'] },
    { id: '5', title: 'Indie Discovery', description: 'Fresh tracks from emerging artists.', coverArt: 'https://placehold.co/600x600.png', 'data-ai-hint': 'guitar case', songIds: ['1', '4', '12'] },
    { id: '6', title: 'Acoustic Morning', description: 'Gentle acoustic songs to start your day.', coverArt: 'https://placehold.co/600x600.png', 'data-ai-hint': 'morning coffee', songIds: ['3', '7', '11'] },
];

export async function getArtists(): Promise<Artist[]> {
    const artistsCol = collection(db, 'artists');
    const artistSnapshot = await getDocs(artistsCol);
    const artistList = artistSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Artist));
    return artistList.length > 0 ? artistList : artists;
}

export async function getAlbums(): Promise<Album[]> {
    const albumsCol = collection(db, 'albums');
    const albumSnapshot = await getDocs(albumsCol);
    const albumList = albumSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Album));
    return albumList.length > 0 ? albumList : albums;
}

export async function getSongs(): Promise<Song[]> {
    const songsCol = collection(db, 'songs');
    const songSnapshot = await getDocs(songsCol);
    const songList = songSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Song));
    return songList.length > 0 ? songList : songs;
}

export async function getPlaylists(): Promise<Playlist[]> {
    try {
        const playlistsCol = collection(db, 'playlists');
        const playlistSnapshot = await getDocs(playlistsCol);
        if (!playlistSnapshot.empty) {
            return playlistSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Playlist));
        }
    } catch (error) {
        console.error("Error fetching playlists from Firestore:", error);
    }
    return playlists;
}

export async function getPlaylistById(id: string): Promise<Playlist | null> {
    try {
        const playlistDocRef = doc(db, 'playlists', id);
        const playlistDocSnap = await getDoc(playlistDocRef);

        if (playlistDocSnap.exists()) {
            return { id: playlistDocSnap.id, ...playlistDocSnap.data() } as Playlist;
        } else {
             console.warn(`Playlist with id ${id} not found in Firestore, falling back to static data.`);
             const staticPlaylist = playlists.find(p => p.id === id);
             return staticPlaylist || null;
        }
    } catch (error) {
        console.error("Error fetching playlist from Firestore:", error);
        const staticPlaylist = playlists.find(p => p.id === id);
        return staticPlaylist || null;
    }
}

export async function updatePlaylistSongs(playlistId: string, songIds: string[]): Promise<void> {
    const playlistDocRef = doc(db, 'playlists', playlistId);
    await updateDoc(playlistDocRef, { songIds });
}
