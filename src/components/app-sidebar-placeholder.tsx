import AppLogo from './app-logo';
import { Skeleton } from './ui/skeleton';

export default function AppSidebarPlaceholder() {
  return (
    <aside className="hidden w-64 flex-col bg-card md:flex">
      <div className="flex items-center gap-2 p-4">
        <AppLogo className="h-8 w-8 text-primary" />
        <span className="font-headline font-bold text-xl">EchoStream</span>
      </div>
      <div className="flex flex-col gap-y-4 px-2 py-4">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
      </div>
      <Skeleton className="h-px w-full my-2" />
      <div className="flex-1 px-2 py-2 space-y-2">
        <Skeleton className="h-5 w-24" />
        <div className="space-y-2">
            {Array.from({length: 5}).map((_, i) => <Skeleton key={i} className="h-7 w-full" />)}
        </div>
      </div>
    </aside>
  );
}
