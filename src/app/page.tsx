import { albums, playlists } from '@/lib/data';
import SongCard from '@/components/song-card';
import Recommendations from '@/components/recommendations';

export default function Home() {
  return (
    <div className="space-y-12">
      <section>
        <h1 className="text-4xl font-headline font-bold mb-2">Welcome to EchoStream</h1>
        <p className="text-muted-foreground">Discover new music tailored just for you.</p>
      </section>

      <Recommendations />
      
      <section>
        <h2 className="text-2xl font-headline font-semibold mb-4">Featured Albums</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {albums.slice(0, 6).map((album) => (
            <SongCard key={album.id} item={album} type="album" />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-headline font-semibold mb-4">Popular Playlists</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {playlists.slice(0, 6).map((playlist) => (
            <SongCard key={playlist.id} item={playlist} type="playlist" />
          ))}
        </div>
      </section>
    </div>
  );
}
