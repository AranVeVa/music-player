'use client';

import {
    createContext,
    useContext,
    useRef,
    useState,
    useEffect,
    useCallback,
    type ReactNode,
    type MutableRefObject,
} from 'react';
import type { Song } from '@/types/song';

interface AudioContextValue {
    audioRef: MutableRefObject<HTMLAudioElement | null>;
    currentSong: Song | null;
    isPlaying: boolean;
    progress: number;
    duration: number;
    currentTime: number;
    playSong: (song: Song) => void;
    togglePlay: () => void;
    seek: (percent: number) => void;
    setIsPlaying: (v: boolean) => void;
    onEndedRef: MutableRefObject<(() => void) | null>;
}

const AudioCtx = createContext<AudioContextValue | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const onEndedRef = useRef<(() => void) | null>(null);

    const playSong = useCallback((song: Song) => {
        setCurrentSong(song);
        setIsPlaying(true);
        setTimeout(() => {
            audioRef.current?.play().catch(() => { });
        }, 50);
    }, []);

    const togglePlay = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;
        if (audio.paused) {
            audio.play().catch(() => { });
            setIsPlaying(true);
        } else {
            audio.pause();
            setIsPlaying(false);
        }
    }, []);

    const seek = useCallback((percent: number) => {
        const audio = audioRef.current;
        if (!audio || !audio.duration) return;
        audio.currentTime = (percent / 100) * audio.duration;
    }, []);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !currentSong) return;
        audio.src = currentSong.src;
        audio.load();
        audio.play().catch(() => { });
    }, [currentSong]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const onTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
            setProgress((audio.currentTime / audio.duration) * 100 || 0);
        };
        const onLoadedMetadata = () => setDuration(audio.duration);
        const onEnded = () => onEndedRef.current?.();

        audio.addEventListener('timeupdate', onTimeUpdate);
        audio.addEventListener('loadedmetadata', onLoadedMetadata);
        audio.addEventListener('ended', onEnded);

        return () => {
            audio.removeEventListener('timeupdate', onTimeUpdate);
            audio.removeEventListener('loadedmetadata', onLoadedMetadata);
            audio.removeEventListener('ended', onEnded);
        };
    }, []);

    return (
        <AudioCtx.Provider
            value={{
                audioRef,
                currentSong,
                isPlaying,
                progress,
                duration,
                currentTime,
                playSong,
                togglePlay,
                seek,
                setIsPlaying,
                onEndedRef,
            }}
        >
            {children}
            <audio ref={audioRef} />
        </AudioCtx.Provider>
    );
}

export function useAudio(): AudioContextValue {
    const ctx = useContext(AudioCtx);
    if (!ctx) throw new Error('useAudio debe usarse dentro de AudioProvider');
    return ctx;
}