
export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  albumArt: string;
  url: string;
  isPremium?: boolean;
}

export interface Artist {
  id: string;
  name: string;
  imageUrl: string;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  coverArt: string;
}

export interface Playlist {
  id: string;
  userId: string;
  title: string;
  description: string;
  coverArt: string;
  songIds?: string[];
}

export interface UserProfile {
    id: string;
    isPremium: boolean;
    email?: string;
    name?: string;
}
