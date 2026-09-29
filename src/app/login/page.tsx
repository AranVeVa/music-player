'use client';

import { signIn } from 'next-auth/react';
import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        const result = await signIn('credentials', { email, password, redirect: false });
        if (result?.error) setError('Credenciales incorrectas');
        else router.push('/player');
    };

    return (
        <main className="flex min-h-screen items-center justify-center p-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm space-y-4 rounded-2xl border border-white/10 bg-slate-900 p-6"
            >
                <h1 className="text-center text-2xl font-black">🎵 Music Player</h1>
                <p className="text-center text-sm text-slate-400">Inicia sesión para continuar</p>

                {error && (
                    <p className="rounded-lg bg-rose-500/10 p-2 text-sm text-rose-300">{error}</p>
                )}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-slate-100 outline-none focus:border-emerald-400/60"
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-slate-100 outline-none focus:border-emerald-400/60"
                />
                <button
                    type="submit"
                    className="w-full rounded-xl bg-emerald-500 py-3 font-bold text-slate-950 hover:brightness-110"
                >
                    Iniciar Sesión
                </button>

                <p className="text-center text-xs text-slate-500">
                    ¿No tienes cuenta?{' '}
                    <Link href="/register" className="text-emerald-400">
                        Regístrate
                    </Link>
                </p>
                <p className="rounded-lg bg-slate-800/50 p-2 text-center text-[11px] text-slate-400">
                    Usuario demo: <b>demo@example.com</b> / <b>123456</b>
                </p>
            </form>
        </main>
    );
}