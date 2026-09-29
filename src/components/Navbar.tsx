'use client';

import { signOut, type useSession } from 'next-auth/react';

interface NavbarProps {
    session: ReturnType<typeof useSession>['data'];
}

export default function Navbar({ session }: NavbarProps) {
    return (
        <nav className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur">
            <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
                <h1 className="text-lg font-black">🎵 Music Player</h1>
                <div className="flex items-center gap-3">
                    <span className="hidden text-xs text-slate-400 sm:inline">{session?.user?.email}</span>
                    <button
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:border-rose-400/50 hover:text-rose-300"
                    >
                        Salir
                    </button>
                </div>
            </div>
        </nav>
    );
}