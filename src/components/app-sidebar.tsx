
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Library, Music, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';
import AppLogo from './app-logo';
import { playlists } from '@/lib/data';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';

const mainNav = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Search', href: '/search', icon: Search },
  { name: 'Your Library', href: '/library', icon: Library },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 flex-col bg-card md:flex">
        <div className="flex items-center gap-2 p-4">
            <AppLogo className="h-8 w-8 text-primary" />
            <span className="font-headline font-bold text-xl">
                EchoStream
            </span>
        </div>
      <div className="flex flex-col gap-y-4 px-2 py-4">
        {mainNav.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'flex items-center gap-x-3 rounded-md p-2 text-sm font-medium transition hover:bg-accent hover:text-accent-foreground',
              pathname === item.href
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground'
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </Link>
        ))}
      </div>
      <Separator className="my-2" />
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-y-2 px-2 py-2">
            <p className="px-2 py-1 text-xs font-semibold text-muted-foreground">Playlists</p>
            {playlists.map((playlist) => (
                <Link
                key={playlist.id}
                href={`/playlist/${playlist.id}`}
                className={cn(
                    'flex items-center gap-x-3 rounded-md p-2 text-sm font-medium text-muted-foreground transition hover:text-foreground',
                    pathname === `/playlist/${playlist.id}` && 'text-foreground'
                )}
                >
                <Music className="h-5 w-5" />
                <span className="truncate">{playlist.title}</span>
                </Link>
            ))}
        </div>
      </ScrollArea>
    </aside>
  );
}
