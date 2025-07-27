# High-Level Design (HLD) - EchoStream

## 1. Introduction

This document outlines the high-level architecture, system components, and technology stack for the **EchoStream** music streaming application. The goal is to create a scalable, responsive, and personalized music platform with a secure, authentication-first user experience and a premium content tier.

## 2. System Architecture

EchoStream is designed as a **client-server web application** leveraging a modern Jamstack architecture. The system enforces a strict authentication boundary, where unauthenticated users are directed to a login page, and all core application features are protected. The application state is managed centrally via React Context to ensure UI consistency.

```
+-----------------+      +---------------------+      +---------------------+
|                 |      |                     |      |                     |
|   User Device   |--+-->|     Login Page      |----->| Firebase Auth       |
| (Browser)       |  |   |  (No App Shell)     |      | (Email/Password)    |
|                 |  |   |                     |      |                     |
+-----------------+  |   +---------------------+      +----------+----------+
                     |                                           ^
                     | (Authenticated)                           |
                     |                                           v
+------------------------------------+      +--------------------------------+
|                                    |      |                                |
|     EchoStream Protected App       |      |  Firebase Backend              |
| +-----------------+ +------------+ |<--+-->| +----------------------------+ |
| | App Shell       | | Page       | |   |  | | Firestore                    |
| | (Header,Sidebar)| | Content    | |   |  | | (Songs, Albums, Playlists, |
| +-----------------+ +------------+ |   |  | |  Users [isPremium])        |
|      ^                             |   |  | +----------------------------+ |
|      |                             |   |  |                                |
|      +---(Player State via Ctx)----+   |  +--------------------------------+
|                                        |                 |
+------------------------------------+   |                 v
                 ^                       |   +---------------------+
                 |                       |   | Google Generative AI|
                 +--(Playlist via Ctx)---+   | (Gemini Models via  |
                                             |      Genkit)        |
                                             +---------------------+

```

### 2.1. Components

-   **Login Page:** A standalone page for user authentication (Email/Password). It does not load the main application shell.
-   **Protected Application (Client):** A single-page application (SPA) built with Next.js and React. It is only rendered for authenticated users.
    -   **`RootLayout`**: The top-level layout that wraps the entire application in global state providers (`AuthProvider`, `MusicPlayerProvider`, `PlaylistProvider`).
    -   **`ProtectedLayout`:** A core component that wraps all protected pages, providing the main UI shell (Header, Sidebar, Player).
    -   **Server Components:** The app leverages Next.js Server Components to improve performance by rendering on the server where possible.
-   **Backend (Serverless):** Firebase serves as the primary backend.
    -   **Firebase Authentication:** Manages user sign-up and sign-in using the Email/Password provider.
    -   **Firestore:** A NoSQL document database used to store application data:
        -   `songs`, `albums`, `artists`: The music library content.
        -   `playlists`: User-created playlists, associated with a `userId`.
        -   `users`: Stores user profile information, including the `isPremium` flag.
-   **AI Services:**
    -   **Genkit:** A framework used to define and manage AI-powered flows. It acts as an intermediary between the Next.js frontend and the Google AI models.
    -   **Google AI (Gemini):** Provides the underlying large language models (LLMs) for generating personalized music recommendations.

## 3. Technology Stack

-   **Framework:** **Next.js 14+** (App Router)
-   **Language:** **TypeScript**
-   **UI Library:** **React 18+**
-   **Styling:** **Tailwind CSS** with **ShadCN UI** for pre-built, accessible components.
-   **State Management:** **React Context API** (`AuthProvider`, `MusicPlayerProvider`, `PlaylistProvider`)
-   **Authentication:** **Firebase Authentication** (Email/Password)
-   **Database:** **Cloud Firestore**
-   **AI Framework:** **Genkit**
-   **Deployment:** Firebase App Hosting

## 4. Data and Auth Flow

### 4.1. Authentication Flow
1.  A new user visits the site and is immediately redirected to the `/login` page by the `withAuth` HOC.
2.  The user signs up. A new user account is created in Firebase Auth, and a corresponding user document is created in Firestore with `isPremium: false`.
3.  The user signs in. Firebase Authentication verifies the credentials and returns a session.
4.  The `AuthContext` state is updated with the authenticated user and their profile data (including `isPremium` status) from Firestore.
5.  The user is redirected to the homepage, and the `ProtectedLayout` renders the full application UI.

### 4.2. Music & Playlist Data Flow
1.  Upon login, the `PlaylistProvider` fetches all playlists belonging to the current user and provides them via the `usePlaylists` hook.
2.  The `AppSidebar` consumes this context to display the user's playlists.
3.  When a user creates or deletes a playlist (e.g., in `LibraryPage`), the component calls an action that updates Firestore and then calls a `refreshPlaylists` function from the context.
4.  This updates the central state, and all subscribed components (like `AppSidebar` and `LibraryPage`) re-render automatically.

### 4.3. Music Playback Flow
1.  A user clicks a play button on a song.
2.  The UI component checks if the song `isPremium` and if the user `isPremium`. If access is denied, a toast notification appears.
3.  If access is granted, the component calls `playSong` from the `useMusicPlayer` hook.
4.  The `MusicPlayerContext` manages a single, persistent `<audio>` element instance for the entire application lifecycle. It updates its state with the new song and queue.
5.  The `Player` component, a "dumb" UI component, listens to the context and displays the current song info, progress, and controls. It does not contain the `<audio>` element itself.
6.  This ensures audio playback is seamless and continues uninterrupted during page navigation.

## 5. Scalability and Performance

-   **Server-Side Rendering (SSR) & Server Components:** Next.js allows for rendering pages on the server, reducing the client-side JavaScript bundle and improving initial load times.
-   **Serverless Architecture:** Using Firebase for the backend allows for automatic scaling.
-   **Image Optimization:** The `next/image` component is used to automatically optimize and lazy-load images.
-   **Code Splitting:** Next.js automatically splits code by page, so users only download the JavaScript needed for the specific page they are viewing.

## 6. Security

-   **Authentication Boundary:** The use of `withAuth` and `ProtectedLayout` ensures that no application data or UI is accessible to unauthenticated users.
-   **Firestore Security Rules:** Access to the Firestore database is controlled by security rules. User-specific data (like playlists) is protected, ensuring users can only access their own data.
-   **Environment Variables:** Sensitive information like API keys is stored in environment variables and is not exposed to the client-side.
