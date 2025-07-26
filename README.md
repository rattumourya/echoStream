# EchoStream - Personalized Music Streaming

EchoStream is a modern, web-based music streaming application designed to provide a personalized listening experience. It features a curated library of music, robust playlist management, and AI-powered recommendations. Built with Next.js, React, and Firebase, it offers a fast, responsive, and scalable platform for music discovery.

## ✨ Features

- **Core Music Playback**: Browse and play songs, albums, and playlists with a persistent player.
- **Playlist Management**: Create, view, and manage your own custom playlists. Add or remove songs with ease.
- **AI Recommendations**: Get personalized song suggestions based on your listening history, time of day, and day of the week, powered by Google's Generative AI.
- **Search**: Quickly find songs, artists, and albums within the library.
- **Responsive UI**: A sleek, dark-mode interface that works seamlessly across desktop and mobile devices.
- **Real-time Updates**: Playlists are synced in real-time across the application using a shared state context.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **UI**: [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/), [ShadCN UI](https://ui.shadcn.com/)
- **AI**: [Google AI & Genkit](https://firebase.google.com/docs/genkit)
- **Backend & Database**: [Firebase](https://firebase.google.com/) (Firestore for database)
- **State Management**: React Context API

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

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
    - Add a new Web App to your project.
    - Copy the Firebase configuration object and paste it into `src/lib/firebase.ts`.
    - In Firestore, enable the database. You can start in test mode for initial development. The app will automatically seed initial data if the collections are empty.

4.  **Set up Environment Variables:**
    - Create a `.env` file in the root of the project.
    - Add your Google AI API key for Genkit functionality:
      ```
      GEMINI_API_KEY=your_google_ai_api_key
      ```

### Running the Application

- **Development Server:** To run the app in development mode with live reloading.
  ```bash
  npm run dev
  ```
  The application will be available at `http://localhost:9002`.

- **Genkit Server (for AI features):** To run the Genkit flows for AI recommendations.
  ```bash
  npm run genkit:dev
  ```

- **Build for Production:**
  ```bash
  npm run build
  ```

- **Start Production Server:**
  ```bash
  npm run start
  ```

## 📄 Project Documentation

For a detailed understanding of the application's architecture and design, please refer to the following documents:

- **[High-Level Design (HLD)](./docs/hld.md)**: System architecture, technology choices, and data flow.
- **[Low-Level Design (LLD)](./docs/lld.md)**: Component breakdown, data models, and API contracts.
