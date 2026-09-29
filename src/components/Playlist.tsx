'use client';

import { useEffect, useState } from 'react';
import { useAudio } from '@/context/AudioContext';
import { useSession } from 'next-auth/react';
import type { Song } from '@/types/song';

interface PlaylistProps {
    songs: Song[];
}

export default function Playlist({ songs }: PlaylistProps) {
    const { playSong, currentSong } = useAudio();
    const { data: session } = useSession();
    const [favorites, setFavorites] = useState<number[]>([]);

    useEffect(() => {
        if (!session) return;
        fetch('/api/favorites')
            .then((r) => r.json())
            .then((d: { favorites?: number[] }) => setFavorites(d.favorites || []))
            .catch(() => { });
    }, [session]);

    const toggleFav = async (songId: number) => {
        const isFav = favorites.includes(songId);
        const method = isFav ? 'DELETE' : 'POST';
        await fetch('/api/favorites', {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ songId }),
        });
        setFavorites((prev) =>
            isFav ? prev.filter((id) => id !== songId) : [...prev, songId]
        );
    };

    const favoriteSongs = songs.filter((s) => favorites.includes(s.id));
    const otherSongs = songs.filter((s) => !favorites.includes(s.id));

    return (
        <div className="space-y-6">
            {/* Sección de favoritos */}
            {favoriteSongs.length > 0 && (
                <section>
                    <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
                        ❤️ Tus Favoritos
                        <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-300">
                            {favoriteSongs.length}
                        </span>
                    </h2>
                    <div className="space-y-2">
                        {favoriteSongs.map((song) => (
                            <SongRow
                                key={song.id}
                                song={song}
                                isActive={currentSong?.id === song.id}
                                isFav={true}
                                onToggleFav={toggleFav}
                                onPlay={playSong}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Sección de todas las canciones */}
            <section>
                <h2 className="mb-3 text-lg font-bold">
                    {favoriteSongs.length > 0 ? '🎶 Todas las canciones' : '🎶 Playlist'}
                </h2>
                <div className="space-y-2">
                    {(favoriteSongs.length > 0 ? otherSongs : songs).map((song) => (
                        <SongRow
                            key={song.id}
                            song={song}
                            isActive={currentSong?.id === song.id}
                            isFav={favorites.includes(song.id)}
                            onToggleFav={toggleFav}
                            onPlay={playSong}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}

interface SongRowProps {
    song: Song;
    isActive: boolean;
    isFav: boolean;
    onToggleFav: (id: number) => void;
    onPlay: (song: Song) => void;
}

function SongRow({ song, isActive, isFav, onToggleFav, onPlay }: SongRowProps) {
    return (
        <div
            className={`flex items-center gap-3 rounded-xl border p-3 transition ${isActive
                    ? 'border-emerald-400/60 bg-emerald-500/10'
                    : 'border-white/10 bg-slate-900/60 hover:bg-slate-800/60'
                }`}
        >
            <img
                src={song.cover}
                alt={song.title}
                className="h-12 w-12 rounded-lg object-cover"
            />
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{song.title}</p>
                <p className="truncate text-xs text-slate-400">{song.artist}</p>
            </div>
            <button
                onClick={() => onToggleFav(song.id)}
                className="p-2 text-lg"
                aria-label={isFav ? 'Quitar de favoritos' : 'Añadir a favoritos'}
            >
                {isFav ? '❤️' : '🤍'}
            </button>
            <button
                onClick={() => onPlay(song)}
                className="rounded-full bg-emerald-500/20 p-2 text-emerald-300 hover:bg-emerald-500/30"
                aria-label="Reproducir"
            >
                ▶
            </button>
        </div>
    );
}