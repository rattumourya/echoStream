# High-Level Design (HLD) - EchoStream

## 1. Introduction

This document outlines the high-level architecture, system components, and technology stack for the **EchoStream** music streaming application. The goal is to create a scalable, responsive, and personalized music platform.

## 2. System Architecture

EchoStream is designed as a **client-server web application** leveraging a modern Jamstack architecture. The system is divided into three primary layers: the client (frontend), the backend (serverless functions and database), and third-party services (AI).

```
+-----------------+      +---------------------+      +---------------------+
|                 |      |                     |      |                     |
|   User Device   |<---->|   Next.js Frontend  |<---->|  Firebase Backend   |
| (Browser)       |      | (React Components)  |      | (Firestore, Auth)   |
|                 |      |                     |      |                     |
+-----------------+      +----------+----------+      +----------+----------+
                                    ^                       |
                                    |                       |
                                    v                       v
                              +-----+------+      +---------+-----------+
                              |   Genkit   |      | Google Generative AI|
                              | (AI Flows) |<---->| (Gemini Models)     |
                              +------------+      +---------------------+
```

### 2.1. Components

-   **Frontend (Client):** A single-page application (SPA) built with Next.js and React. It is responsible for rendering the UI, managing client-side state, and interacting with the backend services. It uses the Next.js App Router for server-rendered components where possible to improve performance.
-   **Backend (Serverless):** Firebase serves as the primary backend.
    -   **Firestore:** A NoSQL document database used to store application data such as playlists, songs, albums, and artists.
    -   **Firebase Authentication (Future):** While not fully implemented, the system is designed to integrate Firebase Auth for user management.
-   **AI Services:**
    -   **Genkit:** A framework used to define and manage AI-powered flows. It acts as an intermediary between the Next.js frontend and the Google AI models.
    -   **Google AI (Gemini):** Provides the underlying large language models (LLMs) for generating personalized music recommendations.

## 3. Technology Stack

-   **Framework:** **Next.js 14+** (App Router)
-   **Language:** **TypeScript**
-   **UI Library:** **React 18+**
-   **Styling:** **Tailwind CSS** with **ShadCN UI** for pre-built, accessible components.
-   **Database:** **Cloud Firestore**
-   **AI Framework:** **Genkit**
-   **Deployment:** Firebase App Hosting (or Vercel/Netlify)

## 4. Data Flow

### 4.1. Music & Playlist Data Flow

1.  A user visits a page (e.g., Home, Library).
2.  The React component on that page (e.g., `Home`, `LibraryPage`) triggers a data fetch request.
3.  The request calls a function in `src/lib/data.ts`.
4.  This function communicates with the Firestore database to `get`, `add`, `update`, or `delete` documents (e.g., playlists).
5.  The data is returned to the component, which updates its state and re-renders the UI.
6.  For state shared across components (like the playlist list), a **React Context (`PlaylistContext`)** is used to synchronize data between the `LibraryPage` and the `AppSidebar`.

### 4.2. AI Recommendation Flow

1.  The user clicks the "Get Fresh Recommendations" button on the homepage.
2.  The `Recommendations` component calls the `getPersonalizedRecommendations` function.
3.  This function is a Genkit flow defined in `src/ai/flows/personalized-music-recommendations.ts`.
4.  The flow sends a structured prompt (containing listening history, time of day, etc.) to the Google AI Gemini model.
5.  The model returns a list of recommended song titles.
6.  The flow parses the response and returns it to the frontend component.
7.  The `Recommendations` component then filters the application's song list to find and display the recommended tracks.

## 5. Scalability and Performance

-   **Server-Side Rendering (SSR) & Server Components:** Next.js allows for rendering static and dynamic pages on the server, reducing the client-side JavaScript bundle and improving initial load times.
-   **Serverless Architecture:** Using Firebase for the backend allows for automatic scaling. Firestore can handle millions of concurrent users without manual intervention.
-   **Image Optimization:** The `next/image` component is used to automatically optimize and lazy-load images, improving performance.
-   **Code Splitting:** Next.js automatically splits code by page, so users only download the JavaScript needed for the specific page they are viewing.

## 6. Security

-   **Firebase Security Rules:** Access to the Firestore database will be controlled by security rules to ensure that users can only access and modify their own data. (Note: Currently running in a more open test mode).
-   **Environment Variables:** Sensitive information like API keys is stored in environment variables and is not exposed to the client-side.
-   **Public Config:** The Firebase client configuration is public and does not contain sensitive keys. Security is enforced by backend rules, not by hiding the config.
