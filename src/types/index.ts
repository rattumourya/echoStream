export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  albumArt: string;
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
  title: string;
  description: string;
  coverArt: string;
}
