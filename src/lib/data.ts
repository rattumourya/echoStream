
import { collection, getDocs, doc, getDoc, updateDoc, setDoc, deleteDoc, query, where, addDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { Song, Artist, Album, Playlist } from '@/types';

// Static data is now used purely for seeding the database if it's empty.
const artists: Omit<Artist, 'id'>[] = [
  { name: 'Cosmic Pulse', imageUrl: 'https://placehold.co/300x300.png', "data-ai-hint": 'space galaxy' },
  { name: 'Stella Wave', imageUrl: 'https://placehold.co/300x300.png', "data-ai-hint": 'beach sunset' },
  { name: 'Neon Dreams', imageUrl: 'https://placehold.co/300x300.png', "data-ai-hint": 'city night' },
  { name: 'Echo Collective', imageUrl: 'https://placehold.co/300x300.png', "data-ai-hint": 'forest path' },
];

const albums: Omit<Album, 'id'>[] = [
  { title: 'Starlight', artist: 'Cosmic Pulse', coverArt: 'https://placehold.co/600x600.png', "data-ai-hint": 'stars nebula' },
  { title: 'Ocean Drive', artist: 'Stella Wave', coverArt: 'https://placehold.co/600x600.png', "data-ai-hint": 'ocean road' },
  { title: 'Metropolis', artist: 'Neon Dreams', coverArt: 'https://placehold.co/600x600.png', "data-ai-hint": 'futuristic city' },
  { title: 'Chronos', artist: 'Echo Collective', coverArt: 'https://placehold.co/600x600.png', "data-ai-hint": 'clock gears' },
  { title: 'Galaxy', artist: 'Cosmic Pulse', coverArt: 'https://placehold.co/600x600.png', "data-ai-hint": 'spiral galaxy' },
  { title: 'Mirage', artist: 'Stella Wave', coverArt: 'https://placehold.co/600x600.png', "data-ai-hint": 'desert dunes' },
];

const songs: Omit<Song, 'id'>[] = [
    { title: 'Orion', artist: 'Cosmic Pulse', album: 'Starlight', duration: '3:45', albumArt: 'https://placehold.co/600x600.png', url: 'https://www.bensound.com/bensound-music/bensound-dreams.mp3', "data-ai-hint": 'stars nebula', isPremium: false },
    { title: 'Nebula', artist: 'Cosmic Pulse', album: 'Starlight', duration: '4:12', albumArt: 'https://placehold.co/600x600.png', url: 'https://www.bensound.com/bensound-music/bensound-creativeminds.mp3', "data-ai-hint": 'stars nebula', isPremium: false },
    { title: 'Sunset', artist: 'Stella Wave', album: 'Ocean Drive', duration: '3:30', albumArt: 'https://placehold.co/600x600.png', url: 'https://www.bensound.com/bensound-music/bensound-anewbeginning.mp3', "data-ai-hint": 'ocean road', isPremium: false },
    { title: 'Palm Trees', artist: 'Stella Wave', album: 'Ocean Drive', duration: '2:58', albumArt: 'https://placehold.co/600x600.png', url: 'https://www.bensound.com/bensound-music/bensound-happyrock.mp3', "data-ai-hint": 'ocean road', isPremium: false },
    { title: 'Skyline', artist: 'Neon Dreams', album: 'Metropolis', duration: '3:55', albumArt: 'https://placehold.co/600x600.png', url: 'https://www.bensound.com/bensound-music/bensound-jazzyfrenchy.mp3', "data-ai-hint": 'futuristic city', isPremium: true },
    { title: 'Nightride', artist: 'Neon Dreams', album: 'Metropolis', duration: '4:20', albumArt: 'https://placehold.co/600x600.png', url: 'https://www.bensound.com/bensound-music/bensound-funkyelement.mp3', "data-ai-hint": 'futuristic city', isPremium: true },
    { title: 'Timeless', artist: 'Echo Collective', album: 'Chronos', duration: '5:01', albumArt: 'https://placehold.co/600x600.png', url: 'https://www.bensound.com/bensound-music/bensound-memories.mp3', "data-ai-hint": 'clock gears', isPremium: false },
    { title: 'Hourglass', artist: 'Echo Collective', album: 'Chronos', duration: '4:44', albumArt: 'https://placehold.co/600x600.png', url: 'https://www.bensound.com/bensound-music/bensound-perception.mp3', "data-ai-hint": 'clock gears', isPremium: true },
    { title: 'Supernova', artist: 'Cosmic Pulse', album: 'Galaxy', duration: '3:21', albumArt: 'https://placehold.co/600x600.png', url: 'https://www.bensound.com/bensound-music/bensound-rumble.mp3', "data-ai-hint": 'spiral galaxy', isPremium: true },
    { title: 'Andromeda', artist: 'Cosmic Pulse', album: 'Galaxy', duration: '4:05', albumArt: 'https://placehold.co/600x600.png', url: 'https://www.bensound.com/bensound-music/bensound-scifi.mp3', "data-ai-hint": 'spiral galaxy', isPremium: true },
    { title: 'Oasis', artist: 'Stella Wave', album: 'Mirage', duration: '3:15', albumArt: 'https://placehold.co/600x600.png', url: 'https://www.bensound.com/bensound-music/bensound-slowmotion.mp3', "data-ai-hint": 'desert dunes', isPremium: false },
    { title: 'Dunes', artist: 'Stella Wave', album: 'Mirage', duration: '3:50', albumArt: 'https://placehold.co/600x600.png', url: 'https://www.bensound.com/bensound-music/bensound-summer.mp3', "data-ai-hint": 'desert dunes', isPremium: true },
];

const staticPlaylists: Omit<Playlist, 'id' | 'userId'>[] = [
    { title: 'Chill Vibes', description: 'Relax and unwind with these laid-back tracks.', coverArt: 'https://placehold.co/600x600.png', "data-ai-hint": 'coffee shop', songIds: ['3', '7', '11'] },
    { title: 'Focus Flow', description: 'Instrumental tracks to help you concentrate.', coverArt: 'https://placehold.co/600x600.png', "data-ai-hint": 'library books', songIds: ['2', '8', '10'] },
];

async function seedCollection<T extends object>(collectionName: string, data: T[]) {
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(collectionRef);
    if (snapshot.empty) {
        console.log(`Seeding '${collectionName}' collection...`);
        for (const item of data) {
            await addDoc(collectionRef, item);
        }
    }
}

async function seedAllData() {
    await Promise.all([
        seedCollection('artists', artists),
        seedCollection('albums', albums),
        seedCollection('songs', songs),
    ]);
}

// Seed the database on startup
seedAllData();

export async function getArtists(): Promise<Artist[]> {
    const artistsCol = collection(db, 'artists');
    const artistSnapshot = await getDocs(artistsCol);
    return artistSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Artist));
}

export async function getAlbums(): Promise<Album[]> {
    const albumsCol = collection(db, 'albums');
    const albumSnapshot = await getDocs(albumsCol);
    return albumSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Album));
}

export async function getSongs(): Promise<Song[]> {
    const songsCol = collection(db, 'songs');
    const songSnapshot = await getDocs(songsCol);
    return songSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Song));
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
        
        if (userPlaylists.length === 0) {
            console.log(`Seeding initial playlists for user ${userId}...`);
            const allSongs = await getSongs();
            const songIdMap = new Map(allSongs.map(s => [s.title, s.id]));

            for (const p of staticPlaylists) {
                // This seeding logic is simplified and assumes song titles are unique
                // A more robust system might use a predefined mapping or IDs
                const songIds = p.songIds?.map(id => {
                    const foundSong = allSongs.find(s => s.id === id);
                    return foundSong ? foundSong.id : null;
                }).filter((id): id is string => id !== null) || [];

                await addDoc(playlistsCol, { ...p, userId: userId, songIds });
            }
            const seededSnapshot = await getDocs(q);
            return seededSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Playlist));
        }

        return userPlaylists;

    } catch (error) {
        console.error("Error fetching playlists from Firestore:", error);
        return [];
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
