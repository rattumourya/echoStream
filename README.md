# EchoStream - Personalized Music Streaming

EchoStream is a modern, web-based music streaming application designed to provide a personalized listening experience. It features a curated library of music, robust playlist management, and AI-powered recommendations. Built with Next.js, React, and Firebase, it offers a fast, responsive, and scalable platform for music discovery.

## ✨ Features

- **Secure Authentication**: Robust Email/Password sign-up and sign-in flow. The application is protected, requiring users to log in before accessing any features.
- **Persistent Music Playback**: Browse and play songs with a persistent player that continues to play seamlessly across page navigations.
- **Premium Content Tier**: Differentiates between free and premium songs, restricting access for non-premium users with clear upgrade prompts.
- **Playlist Management**: Create, view, and manage your own custom playlists. Add or remove songs with ease.
- **AI Recommendations**: Get personalized song suggestions based on your listening history, time of day, and day of the week, powered by Google's Generative AI.
- **Search**: Quickly find songs, artists, and albums within the library.
- **Responsive UI**: A sleek, dark-mode interface that works seamlessly across desktop and mobile devices.
- **Real-time State Sync**: Playlists created or deleted are instantly reflected across the app thanks to a shared React Context.
- **Personalized Avatars**: User avatars default to their initials if no profile picture is set.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **UI**: [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/), [ShadCN UI](https://ui.shadcn.com/)
- **State Management**: React Context API
- **AI**: [Google AI & Genkit](https://firebase.google.com/docs/genkit)
- **Backend & Database**: [Firebase](https://firebase.google.com/) (Firestore for database, Firebase Authentication for users)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- A Firebase Project

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd echostream
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Firebase:**
    - Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/).
    - In the "Authentication" section, go to the "Sign-in method" tab and **enable the Email/Password** provider.
    - In the "Build" -> "Firestore Database" section, create a database. You can start in **test mode** for initial development, which allows open read/write access. For production, you would configure security rules.
    - Go to your Project Settings (click the gear icon) and add a new **Web App**.
    - Copy the `firebaseConfig` object provided.
    - Paste this configuration into the `src/lib/firebase.ts` file, replacing the existing placeholder config.

4.  **Set up Environment Variables:**
    - Create a `.env` file in the root of the project.
    - Add your Google AI API key for Genkit functionality:
      ```
      GEMINI_API_KEY=your_google_ai_api_key
      ```
    - *Note: If you don't have a key, the AI recommendation feature will not work, but the rest of the app will.*

### Running the Application

The application requires two separate processes to run concurrently in development.

1.  **Run the Next.js Frontend:**
    - This serves the main application on `http://localhost:9002`.
    ```bash
    npm run dev
    ```

2.  **Run the Genkit Server (for AI features):**
    - In a **separate terminal**, run this command to start the local server for AI flows.
    ```bash
    npm run genkit:dev
    ```

Once both are running, you can access the application at `http://localhost:9002`. The app will automatically seed initial data to Firestore if the collections are empty on first run.

## 📄 Project Documentation

For a detailed understanding of the application's architecture and design, please refer to the following documents:

- **[High-Level Design (HLD)](./docs/hld.md)**: System architecture, technology choices, and data flow.
- **[Low-Level Design (LLD)](./docs/lld.md)**: Component breakdown, data models, and API contracts.
