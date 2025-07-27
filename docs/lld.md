# Low-Level Design (LLD) - EchoStream

## 1. Introduction

This document provides a detailed breakdown of the components, data models, and specific implementation details for the EchoStream application. It complements the High-Level Design (HLD).

## 2. Component Architecture

The UI is built using a hierarchy of reusable React components, with a strict separation between the public-facing login page and the protected application.

### 2.1. Core Layout and Auth Components

-   **`src/app/layout.tsx`**: The root layout of the application. It is kept minimal. Its primary responsibilities are setting up the HTML structure and wrapping the entire application in all necessary context providers (`AuthProvider`, `MusicPlayerProvider`, `PlaylistProvider`) to ensure global state is available everywhere.
-   **`src/app/login/page.tsx`**: A standalone page for user sign-in and sign-up. It does *not* use the `ProtectedLayout` and thus has no application shell. On sign-up, it creates the user in Firebase Auth and also creates their profile document in Firestore.
-   **`src/components/with-auth.tsx`**: A Higher-Order Component (HOC) that wraps protected pages. It checks the user's authentication status from `AuthContext` and redirects to `/login` if the user is not authenticated.
-   **`src/components/protected-layout.tsx`**: A layout component that wraps the content of all authenticated pages. It checks the auth status and only renders the main application UI shell (sidebar, header, player) and the page's children if a user is logged in.

### 2.2. Page-Level Components (within `ProtectedLayout`)

-   **`src/app/page.tsx`**: The homepage, displaying featured albums, playlists, and AI recommendations.
-   **`src/app/library/page.tsx`**: Displays the user's saved playlists. Contains logic for creating and deleting playlists, which now uses the shared `PlaylistContext` to trigger UI updates across the app.
-   **`src/app/playlist/[id]/page.tsx`**: A dynamic page that displays the songs within a specific playlist. Allows users to add or remove songs. Visually indicates premium songs for non-premium users.
-   **`src/app/search/page.tsx`**: Contains the search input and displays results for songs, artists, and albums. Also indicates premium content.
-   **`src/app/settings/page.tsx`**: Allows authenticated users to update their profile information and view their subscription status.

### 2.3. Reusable UI Components

-   **`AppHeader`**: The top navigation bar, containing the app logo and the `UserNav` component.
-   **`AppSidebar`**: The main navigation sidebar. It consumes `PlaylistContext` to display an always-up-to-date list of the user's playlists.
-   **`Player`**: The persistent music player fixed at the bottom of the screen. This is a presentational component that gets all of its state (current song, progress, etc.) from the `MusicPlayerContext`. It does **not** contain the `<audio>` element itself.
-   **`UserNav`**: The user avatar and dropdown menu in the header. It shows the user's profile information from `AuthContext`. If the user has no profile image, it displays their initials as a fallback (e.g., "RM" for "Ratan Mourya").
-   **`ui/`**: Directory of generic, reusable UI components from ShadCN (Button, Card, etc.).

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
  songIds?: string[]; // Array of song IDs
}

export interface UserProfile {
    id: string;
    isPremium: boolean;
    email?: string;
    name?: string;
}
```

## 4. State Management (React Context)

State management is centralized using React Context, with providers located in the root layout to ensure availability throughout the component tree.

### 4.1. `AuthContext`
-   **Purpose:** Manages the global authentication state of the user, including their profile and premium status.
-   **State:**
    -   `user: User | null`: The currently authenticated Firebase user object.
    -   `userProfile: UserProfile | null`: The user's profile data from Firestore, including `isPremium`.
    -   `loading: boolean`: The loading state for the initial auth and profile check.

### 4.2. `MusicPlayerContext`
-   **Purpose:** Manages the global state and logic for the audio player to ensure persistent, uninterrupted playback.
-   **State & Logic:**
    -   It holds a single, persistent `Audio` element instance in a `useRef`.
    -   `queue: Song[]`: The current list of songs to be played.
    -   `currentSong: Song | null`: The song that is currently loaded or playing.
    -   `isPlaying: boolean`: The current playback status.
    -   `currentTime`, `duration`: The progress of the current track.
    -   All playback functions (`playSong`, `togglePlayPause`, `playNext`, `seek`) are defined here and manipulate the single audio instance.

### 4.3. `PlaylistContext`
-   **Purpose:** Manages the global list of user playlists to ensure UI consistency across components like the sidebar and library page.
-   **State:**
    -   `playlists: Playlist[]`: The list of all playlists for the *currently logged-in user*.
    -   `loading: boolean`: The loading state for the playlist fetch.
-   **Actions:**
    -   `refreshPlaylists()`: A function to re-fetch the playlists from Firestore and update the global state. This is called after a playlist is created or deleted.

## 5. UI/UX Flow Example: Deleting a Playlist

1.  **Pre-condition**: User is logged in. The `LibraryPage` and `AppSidebar` are both rendered and are consuming the same `PlaylistContext`.
2.  **User Action**: User clicks the "Trash" icon on a playlist in the `LibraryPage`.
3.  **UI Change**: An `AlertDialog` appears for confirmation, displaying the name of the playlist to be deleted.
4.  **User Action**: User clicks the "Delete" button in the dialog.
5.  **Frontend Logic (`LibraryPage.tsx`):**
    -   The `onClick` handler calls the `deletePlaylist(playlist.id)` function from `src/lib/data.ts` to delete the document from Firestore.
    -   Upon successful deletion, it calls `refreshPlaylists()` from the `usePlaylists` context hook.
6.  **State Management Logic (`PlaylistContext.tsx`):**
    -   `refreshPlaylists()` re-fetches the list of playlists from Firestore for the current user.
    -   The `playlists` state variable within the context is updated.
7.  **UI Re-render:**
    -   Because the `playlists` state in the context has changed, any component consuming that context will re-render.
    -   This means the `LibraryPage` updates its grid and the `AppSidebar` updates its list simultaneously and automatically. The deleted playlist vanishes from both places.
