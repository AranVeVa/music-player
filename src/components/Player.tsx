'use client';

import { useAudio } from '@/context/AudioContext';
import { useEffect } from 'react';
import ProgressBar from './ProgressBar';
import type { Song } from '@/types/song';

interface PlayerProps {
    songs: Song[];
}

export default function Player({ songs }: PlayerProps) {
    const { currentSong, isPlaying, togglePlay, playSong, onEndedRef } = useAudio();

    useEffect(() => {
        onEndedRef.current = () => {
            if (!currentSong) return;
            const idx = songs.findIndex((s) => s.id === currentSong.id);
            const next = songs[(idx + 1) % songs.length];
            playSong(next);
        };
    }, [currentSong, songs, playSong, onEndedRef]);

    const handleNext = () => {
        if (!currentSong) return;
        const idx = songs.findIndex((s) => s.id === currentSong.id);
        playSong(songs[(idx + 1) % songs.length]);
    };

    const handlePrev = () => {
        if (!currentSong) return;
        const idx = songs.findIndex((s) => s.id === currentSong.id);
        playSong(songs[(idx - 1 + songs.length) % songs.length]);
    };

    if (!currentSong) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-slate-900/95 backdrop-blur">
            <div className="mx-auto max-w-4xl p-4">
                <div className="flex items-center gap-4">
                    <img
                        src={currentSong.cover}
                        alt={currentSong.title}
                        className="h-14 w-14 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold">{currentSong.title}</p>
                        <p className="truncate text-xs text-slate-400">{currentSong.artist}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={handlePrev} className="rounded-full p-2 hover:bg-white/10">
                            ⏮
                        </button>
                        <button
                            onClick={togglePlay}
                            className="rounded-full bg-emerald-500 p-3 text-slate-950 hover:brightness-110"
                        >
                            {isPlaying ? '⏸' : '▶'}
                        </button>
                        <button onClick={handleNext} className="rounded-full p-2 hover:bg-white/10">
                            ⏭
                        </button>
                    </div>
                </div>
                <ProgressBar />
            </div>
        </div>
    );
}