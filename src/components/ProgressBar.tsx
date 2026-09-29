'use client';

import { useAudio } from '@/context/AudioContext';
import type { MouseEvent } from 'react';

export default function ProgressBar() {
    const { progress, currentTime, duration, seek } = useAudio();

    const format = (s: number) => {
        if (!s || isNaN(s)) return '0:00';
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return `${m}:${sec.toString().padStart(2, '0')}`;
    };

    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const percent = ((e.clientX - rect.left) / rect.width) * 100;
        seek(percent);
    };

    return (
        <div className="mt-3 flex items-center gap-3 text-xs text-slate-400">
            <span>{format(currentTime)}</span>
            <div
                onClick={handleClick}
                className="h-1.5 flex-1 cursor-pointer rounded-full bg-slate-700"
            >
                <div
                    className="h-full rounded-full bg-emerald-400 transition-all"
                    style={{ width: `${progress}%` }}
                />
            </div>
            <span>{format(duration)}</span>
        </div>
    );
}