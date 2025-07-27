# High-Level Design (HLD) - EchoStream

## 1. Introduction

This document outlines the high-level architecture, system components, and technology stack for the **EchoStream** music streaming application. The goal is to create a scalable, responsive, and personalized music platform with a secure, authentication-first user experience.

## 2. System Architecture

EchoStream is designed as a **client-server web application** leveraging a modern Jamstack architecture. The system enforces a strict authentication boundary, where unauthenticated users are directed to a login page, and all core application features are protected.

```
+-----------------+      +---------------------+      +---------------------+
|                 |      |                     |      |                     |
|   User Device   |--+-->|     Login Page      |----->| Firebase Auth       |
| (Browser)       |  |   |  (No App Shell)     |      | (Email/Password)    |
|                 |  |   |                     |      |                     |
+-----------------+  |   +---------------------+      +----------+----------+
                     |                                           ^
                     | (Authenticated)                           |
                     |                                           |
                     v                                           |
+------------------------------------+      +--------------------+
|                                    |      |
|     EchoStream Protected App       |      |
| +-----------------+ +------------+ |<---->|  Firebase Backend  |
| | App Shell       | | Page       | |      | (Firestore)        |
| | (Header,Sidebar)| | Content    | |      |                    |
| +-----------------+ +------------+ |      +--------------------+
+------------------------------------+                 |
                 ^                                     |
                 |                                     v
                 +---------------------------+---------+-----------+
                                             | Google Generative AI|
                                             | (Gemini Models via  |
                                             |      Genkit)        |
                                             +---------------------+

```

### 2.1. Components

-   **Login Page:** A standalone page for user authentication (Email/Password). It does not load the main application shell.
-   **Protected Application (Client):** A single-page application (SPA) built with Next.js and React. It is only rendered for authenticated users.
    -   **`ProtectedLayout`:** A core component that wraps all protected pages, providing the main UI shell (Header, Sidebar, Player).
    -   **Server Components:** The app leverages Next.js Server Components to improve performance by rendering on the server where possible.
-   **Backend (Serverless):** Firebase serves as the primary backend.
    -   **Firebase Authentication:** Manages user sign-up and sign-in using the Email/Password provider.
    -   **Firestore:** A NoSQL document database used to store application data such as playlists, songs, albums, and artists.
-   **AI Services:**
    -   **Genkit:** A framework used to define and manage AI-powered flows. It acts as an intermediary between the Next.js frontend and the Google AI models.
    -   **Google AI (Gemini):** Provides the underlying large language models (LLMs) for generating personalized music recommendations.

## 3. Technology Stack

-   **Framework:** **Next.js 14+** (App Router)
-   **Language:** **TypeScript**
-   **UI Library:** **React 18+**
-   **Styling:** **Tailwind CSS** with **ShadCN UI** for pre-built, accessible components.
-   **Authentication:** **Firebase Authentication** (Email/Password)
-   **Database:** **Cloud Firestore**
-   **AI Framework:** **Genkit**
-   **Deployment:** Firebase App Hosting

## 4. Data and Auth Flow

### 4.1. Authentication Flow
1.  A new user visits the site and is immediately redirected to the `/login` page by the `withAuth` HOC.
2.  The user signs up or signs in using their email and password.
3.  Firebase Authentication verifies the credentials and returns a user session to the client.
4.  The `AuthContext` state is updated with the authenticated user.
5.  The user is redirected to the originally requested page (e.g., the homepage).
6.  The `ProtectedLayout` component, seeing an authenticated user, now renders the full application shell and the page content.

### 4.2. Music & Playlist Data Flow

1.  A user navigates to a page (e.g., Home, Library).
2.  The React component on that page triggers a data fetch request.
3.  The request calls a function in `src/lib/data.ts` which communicates with the Firestore database.
4.  Data is returned to the component. For state shared across components (like the playlist list), a **React Context (`PlaylistContext`)** is used to synchronize data between all components that need it (e.g., `LibraryPage` and `AppSidebar`).

### 4.3. AI Recommendation Flow

1.  The user clicks the "Get Fresh Recommendations" button.
2.  The `Recommendations` component calls a Genkit flow defined in `src/ai/flows/personalized-music-recommendations.ts`.
3.  The flow sends a structured prompt to the Google AI Gemini model.
4.  The model returns a list of recommended song titles, which are then displayed in the UI.

## 5. Scalability and Performance

-   **Server-Side Rendering (SSR) & Server Components:** Next.js allows for rendering pages on the server, reducing the client-side JavaScript bundle and improving initial load times.
-   **Serverless Architecture:** Using Firebase for the backend allows for automatic scaling.
-   **Image Optimization:** The `next/image` component is used to automatically optimize and lazy-load images.
-   **Code Splitting:** Next.js automatically splits code by page, so users only download the JavaScript needed for the specific page they are viewing.

## 6. Security

-   **Authentication Boundary:** The use of `withAuth` and `ProtectedLayout` ensures that no application data or UI is accessible to unauthenticated users.
-   **Firebase Security Rules:** Access to the Firestore database can be (and should be) controlled by security rules to ensure that users can only access and modify their own data. (Note: Currently running in a more open test mode for development).
-   **Environment Variables:** Sensitive information like API keys is stored in environment variables and is not exposed to the client-side.
