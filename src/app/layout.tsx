import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { MusicPlayerProvider } from '@/context/music-player-context';
import Player from '@/components/player';
import AppHeader from '@/components/app-header';
import SidebarLoader from '@/components/sidebar-loader';


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
        <MusicPlayerProvider>
          <div className="relative flex h-dvh overflow-hidden">
            <SidebarLoader />
            <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
              <AppHeader />
              <main className="pb-24">
                <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                  {children}
                </div>
              </main>
            </div>
          </div>
          <Player />
          <Toaster />
        </MusicPlayerProvider>
      </body>
    </html>
  );
}
