
import { collection, getDocs, doc, getDoc, updateDoc, setDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from './firebase';
import type { Song, Artist, Album, Playlist } from '@/types';

export const artists: Artist[] = [
  { id: '1', name: 'Cosmic Pulse', imageUrl: 'https://placehold.co/300x300.png', "data-ai-hint": 'space galaxy' },
  { id: '2', name: 'Stella Wave', imageUrl: 'https://placehold.co/300x300.png', "data-ai-hint": 'beach sunset' },
  { id: '3', name: 'Neon Dreams', imageUrl: 'https://placehold.co/300x300.png', "data-ai-hint": 'city night' },
  { id: '4', name: 'Echo Collective', imageUrl: 'https://placehold.co/300x300.png', "data-ai-hint": 'forest path' },
];

export const albums: Album[] = [
  { id: '1', title: 'Starlight', artist: 'Cosmic Pulse', coverArt: 'https://placehold.co/600x600.png', "data-ai-hint": 'stars nebula' },
  { id: '2', title: 'Ocean Drive', artist: 'Stella Wave', coverArt: 'https://placehold.co/600x600.png', "data-ai-hint": 'ocean road' },
  { id: '3', title: 'Metropolis', artist: 'Neon Dreams', coverArt: 'https://placehold.co/600x600.png', "data-ai-hint": 'futuristic city' },
  { id: '4', title: 'Chronos', artist: 'Echo Collective', coverArt: 'https://placehold.co/600x600.png', "data-ai-hint": 'clock gears' },
  { id: '5', title: 'Galaxy', artist: 'Cosmic Pulse', coverArt: 'https://placehold.co/600x600.png', "data-ai-hint": 'spiral galaxy' },
  { id: '6', title: 'Mirage', artist: 'Stella Wave', coverArt: 'https://placehold.co/600x600.png', "data-ai-hint": 'desert dunes' },
];

export const songs: Song[] = [
    { id: '1', title: 'Orion', artist: 'Cosmic Pulse', album: 'Starlight', duration: '3:45', albumArt: 'https://placehold.co/600x600.png', url: 'https://www.bensound.com/bensound-music/bensound-dreams.mp3', "data-ai-hint": 'stars nebula', isPremium: false },
    { id: '2', title: 'Nebula', artist: 'Cosmic Pulse', album: 'Starlight', duration: '4:12', albumArt: 'https://placehold.co/600x600.png', url: 'https://www.bensound.com/bensound-music/bensound-creativeminds.mp3', "data-ai-hint": 'stars nebula', isPremium: false },
    { id: '3', title: 'Sunset', artist: 'Stella Wave', album: 'Ocean Drive', duration: '3:30', albumArt: 'https://placehold.co/600x600.png', url: 'https://www.bensound.com/bensound-music/bensound-anewbeginning.mp3', "data-ai-hint": 'ocean road', isPremium: false },
    { id: '4', title: 'Palm Trees', artist: 'Stella Wave', album: 'Ocean Drive', duration: '2:58', albumArt: 'https://placehold.co/600x600.png', url: 'https://www.bensound.com/bensound-music/bensound-happyrock.mp3', "data-ai-hint": 'ocean road', isPremium: false },
    { id: '5', title: 'Skyline', artist: 'Neon Dreams', album: 'Metropolis', duration: '3:55', albumArt: 'https://placehold.co/600x600.png', url: 'https://www.bensound.com/bensound-music/bensound-jazzyfrenchy.mp3', "data-ai-hint": 'futuristic city', isPremium: true },
    { id: '6', title: 'Nightride', artist: 'Neon Dreams', album: 'Metropolis', duration: '4:20', albumArt: 'https://placehold.co/600x600.png', url: 'https://www.bensound.com/bensound-music/bensound-funkyelement.mp3', "data-ai-hint": 'futuristic city', isPremium: true },
    { id: '7', title: 'Timeless', artist: 'Echo Collective', album: 'Chronos', duration: '5:01', albumArt: 'https://placehold.co/600x600.png', url: 'https://www.bensound.com/bensound-music/bensound-memories.mp3', "data-ai-hint": 'clock gears', isPremium: false },
    { id: '8', title: 'Hourglass', artist: 'Echo Collective', album: 'Chronos', duration: '4:44', albumArt: 'https://placehold.co/600x600.png', url: 'https://www.bensound.com/bensound-music/bensound-perception.mp3', "data-ai-hint": 'clock gears', isPremium: true },
    { id: '9', title: 'Supernova', artist: 'Cosmic Pulse', album: 'Galaxy', duration: '3:21', albumArt: 'https://placehold.co/600x600.png', url: 'https://www.bensound.com/bensound-music/bensound-rumble.mp3', "data-ai-hint": 'spiral galaxy', isPremium: true },
    { id: '10', title: 'Andromeda', artist: 'Cosmic Pulse', album: 'Galaxy', duration: '4:05', albumArt: 'https://placehold.co/600x600.png', url: 'https://www.bensound.com/bensound-music/bensound-scifi.mp3', "data-ai-hint": 'spiral galaxy', isPremium: true },
    { id: '11', title: 'Oasis', artist: 'Stella Wave', album: 'Mirage', duration: '3:15', albumArt: 'https://placehold.co/600x600.png', url: 'https://www.bensound.com/bensound-music/bensound-slowmotion.mp3', "data-ai-hint": 'desert dunes', isPremium: false },
    { id: '12', title: 'Dunes', artist: 'Stella Wave', album: 'Mirage', duration: '3:50', albumArt: 'https://placehold.co/600x600.png', url: 'https://www.bensound.com/bensound-music/bensound-summer.mp3', "data-ai-hint": 'desert dunes', isPremium: true },
];

// Seed data for playlists, now without user association.
export const staticPlaylists: Omit<Playlist, 'id' | 'userId'>[] = [
    { title: 'Chill Vibes', description: 'Relax and unwind with these laid-back tracks.', coverArt: 'https://placehold.co/600x600.png', "data-ai-hint": 'coffee shop', songIds: ['3', '7', '11'] },
    { title: 'Focus Flow', description: 'Instrumental tracks to help you concentrate.', coverArt: 'https://placehold.co/600x600.png', "data-ai-hint": 'library books', songIds: ['2', '8', '10'] },
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
    if (songList.length > 0) {
        return songList;
    }
    // Seed if empty
    for (const song of songs) {
        const songDocRef = doc(db, 'songs', song.id);
        await setDoc(songDocRef, song);
    }
    return songs;
}

export async function getPlaylists(userId: string): Promise<Playlist[]> {
    if (!userId) {
        return [];
    }

    try {
        const playlistsCol = collection(db, 'playlists');
        const q = query(playlistsCol, where("userId", "==", userId));
        const playlistSnapshot = await getDocs(q);
        
        const userPlaylists = playlistSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Playlist));
        
        // Seed initial playlists for a new user if they have none.
        if (userPlaylists.length === 0) {
            for (const p of staticPlaylists) {
                await addDoc(playlistsCol, { ...p, userId: userId });
            }
            // Fetch again after seeding
            const seededSnapshot = await getDocs(q);
            return seededSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Playlist));
        }

        return userPlaylists;

    } catch (error) {
        console.error("Error fetching playlists from Firestore:", error);
        return []; // Return empty array on error
    }
}

export async function getPlaylistById(id: string): Promise<Playlist | null> {
    try {
        const playlistDocRef = doc(db, 'playlists', id);
        const playlistDocSnap = await getDoc(playlistDocRef);

        if (playlistDocSnap.exists()) {
            return { id: playlistDocSnap.id, ...playlistDocSnap.data() } as Playlist;
        } else {
             console.warn(`Playlist with id ${id} not found in Firestore.`);
             return null;
        }
    } catch (error) {
        console.error("Error fetching playlist from Firestore:", error);
        return null;
    }
}

export async function updatePlaylistSongs(playlistId: string, songIds: string[]): Promise<void> {
    const playlistDocRef = doc(db, 'playlists', playlistId);
    await updateDoc(playlistDocRef, { songIds });
}

export async function deletePlaylist(playlistId: string): Promise<void> {
    const playlistDocRef = doc(db, 'playlists', playlistId);
    try {
        await deleteDoc(playlistDocRef);
    } catch (e) {
        console.error(`Failed to delete playlist ${playlistId}`, e);
        throw e;
    }
}
