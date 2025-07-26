# Low-Level Design (LLD) - EchoStream

## 1. Introduction

This document provides a detailed breakdown of the components, data models, and specific implementation details for the EchoStream application. It complements the High-Level Design (HLD).

## 2. Component Architecture

The UI is built using a hierarchy of reusable React components.

### 2.1. Core Layout Components

-   **`src/app/layout.tsx`**: The root layout of the application. It sets up the HTML structure, includes global CSS, fonts, and wraps the application in necessary context providers (`MusicPlayerProvider`, `PlaylistProvider`).
-   **`AppHeader`**: The top navigation bar, containing the app logo and user navigation dropdown.
-   **`SidebarLoader` / `AppSidebar`**: The main navigation sidebar on the left. It contains links to Home, Search, and Library, as well as a scrollable list of the user's playlists fetched from `PlaylistContext`. It is loaded dynamically on the client to prevent SSR hydration errors.
-   **`Player`**: The persistent music player fixed at the bottom of the screen. It manages audio playback state and controls (play/pause, skip, volume, progress) and consumes data from the `MusicPlayerContext`.

### 2.2. Page-Level Components

-   **`src/app/page.tsx`**: The homepage, displaying featured albums, playlists, and the AI recommendations section.
-   **`src/app/library/page.tsx`**: Displays the user's saved playlists and albums in separate tabs. Contains logic for creating and deleting playlists.
-   **`src/app/playlist/[id]/page.tsx`**: A dynamic page that displays the songs within a specific playlist. Allows users to add or remove songs from that playlist.
-   **`src/app/search/page.tsx`**: Contains the search input and logic to display results for songs, artists, and albums.
-   **`src/app/settings/page.tsx`**: A static page for user profile and account settings.

### 2.3. Reusable Components

-   **`SongCard`**: A versatile card component used to display albums and playlists throughout the app.
-   **`Recommendations`**: The component responsible for triggering the AI recommendation flow and displaying the results.
-   **`UserNav`**: The user avatar and dropdown menu in the header.
-   **`ui/`**: A directory of generic, reusable UI components provided by ShadCN (Button, Card, Dialog, etc.).

## 3. Data Models (`src/types/index.ts`)

The application uses the following TypeScript interfaces for data consistency.

```typescript
export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  albumArt: string;
  url: string; // URL to the audio file
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
  songIds?: string[]; // Array of song IDs
}
```

## 4. State Management (React Context)

### 4.1. `MusicPlayerContext`

-   **Purpose:** Manages the global state of the music player.
-   **State:**
    -   `queue: Song[]`: The current list of songs to be played.
    -   `currentSong: Song | null`: The song that is currently loaded or playing.
    -   `isPlaying: boolean`: The current playback status.
-   **Actions:**
    -   `playSong(song, playlist)`: Loads a new song and optionally a new queue.
    -   `togglePlayPause()`: Toggles the playback state.
    -   `playNext()`: Plays the next song in the queue.
    -   `playPrevious()`: Plays the previous song in the queue.

### 4.2. `PlaylistContext`

-   **Purpose:** Manages the global list of user playlists to ensure UI consistency.
-   **State:**
    -   `playlists: Playlist[]`: The list of all user playlists.
    -   `loading: boolean`: The loading state for the playlist fetch.
-   **Actions:**
    -   `refreshPlaylists()`: A function to re-fetch the playlists from Firestore and update the global state. This is called after a playlist is created or deleted.

## 5. Backend and AI Contracts

### 5.1. Data Access Layer (`src/lib/data.ts`)

This file abstracts all direct interactions with Firestore.

-   `getPlaylists(): Promise<Playlist[]>`: Fetches all playlists.
-   `getPlaylistById(id: string): Promise<Playlist | null>`: Fetches a single playlist by its ID.
-   `updatePlaylistSongs(playlistId: string, songIds: string[]): Promise<void>`: Updates the list of songs for a specific playlist.
-   `deletePlaylist(playlistId: string): Promise<void>`: Deletes a playlist document from Firestore.
-   `getSongs()`, `getAlbums()`, `getArtists()`: Fetch corresponding data collections.

### 5.2. AI Flow (`src/ai/flows/personalized-music-recommendations.ts`)

This file defines the contract for the AI recommendation feature.

-   **Input Schema (`PersonalizedRecommendationsInputSchema`)**:
    -   `listeningHistory: string`: Comma-separated list of song titles.
    -   `timeOfDay: string`: e.g., "morning", "evening".
    -   `dayOfWeek: string`: e.g., "Monday".
-   **Output Schema (`PersonalizedRecommendationsOutputSchema`)**:
    -   `recommendations: string`: Comma-separated list of recommended song titles.
-   **`getPersonalizedRecommendations(input)`**: The exported function that the frontend calls to execute the flow.

## 6. UI/UX Flow Example: Deleting a Playlist

1.  **User Action**: User hovers over a playlist card in the "Your Library" page.
2.  **UI Change**: A "Trash" icon button appears on the card.
3.  **User Action**: User clicks the "Trash" icon.
4.  **UI Change**: An `AlertDialog` appears, asking for confirmation.
    -   `Component`: `<AlertDialog>` from `shadcn/ui`.
5.  **User Action**: User clicks the "Delete" action button in the dialog.
6.  **Frontend Logic (`LibraryPage.tsx`):**
    -   The `onClick` handler calls the `deletePlaylist(playlist.id)` function.
    -   This function calls the `deletePlaylist` method from `src/lib/data.ts`, which deletes the document from Firestore.
    -   Upon successful deletion, it calls `refreshPlaylists()` from the `usePlaylists` context hook.
7.  **State Management Logic (`PlaylistContext.tsx`):**
    -   `refreshPlaylists()` re-fetches the list of playlists from Firestore.
    -   The `playlists` state variable is updated with the new, smaller list.
8.  **UI Re-render:**
    -   Because the `playlists` state in the context has changed, both `LibraryPage` and `AppSidebar` (which consume this context) automatically re-render.
    -   The deleted playlist disappears from the grid in the library and from the list in the sidebar simultaneously.
    -   A toast notification appears confirming the deletion.
