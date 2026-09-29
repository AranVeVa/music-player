'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Player from '@/components/Player';
import Playlist from '@/components/Playlist';
import Navbar from '@/components/Navbar';
import { SONGS } from '@/data/songs';

export default function PlayerPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/login');
    }, [status, router]);

    if (status === 'loading') {
        return (
            <div className="flex min-h-screen items-center justify-center text-slate-400">
                Cargando…
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-40">
            <Navbar session={session} />
            <main className="mx-auto max-w-4xl px-4 pt-6">
                <Playlist songs={SONGS} />
            </main>
            <Player songs={SONGS} />
        </div>
    );
}