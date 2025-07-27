
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/auth-context';
import { MusicPlayerProvider } from '@/context/music-player-context';
import { PlaylistProvider } from '@/context/playlist-context';


export const metadata: Metadata = {
  title: 'EchoStream',
  description: 'Your personal music streaming experience.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          <MusicPlayerProvider>
            <PlaylistProvider>
              {children}
              <Toaster />
            </PlaylistProvider>
          </MusicPlayerProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
