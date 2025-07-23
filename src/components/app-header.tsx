import Link from 'next/link';
import AppLogo from './app-logo';
import { UserNav } from './user-nav';

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center space-x-2">
          <AppLogo className="h-8 w-8 text-primary" />
          <span className="font-headline font-bold text-xl hidden sm:inline-block">
            EchoStream
          </span>
        </Link>
        <div className="flex items-center space-x-4">
          <UserNav />
        </div>
      </div>
    </header>
  );
}
