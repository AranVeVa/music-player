'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        });

        if (!res.ok) {
            const data: { error?: string } = await res.json();
            setError(data.error || 'Error al registrarse');
            return;
        }

        await signIn('credentials', { email, password, redirect: false });
        router.push('/player');
    };

    return (
        <main className="flex min-h-screen items-center justify-center p-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm space-y-4 rounded-2xl border border-white/10 bg-slate-900 p-6"
            >
                <h1 className="text-center text-2xl font-black">Crear cuenta</h1>

                {error && (
                    <p className="rounded-lg bg-rose-500/10 p-2 text-sm text-rose-300">{error}</p>
                )}

                <input
                    type="text"
                    placeholder="Nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-slate-100 outline-none focus:border-emerald-400/60"
                />
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
                    minLength={6}
                    className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-slate-100 outline-none focus:border-emerald-400/60"
                />
                <button
                    type="submit"
                    className="w-full rounded-xl bg-emerald-500 py-3 font-bold text-slate-950 hover:brightness-110"
                >
                    Registrarme
                </button>

                <p className="text-center text-xs text-slate-500">
                    ¿Ya tienes cuenta?{' '}
                    <Link href="/login" className="text-emerald-400">
                        Inicia sesión
                    </Link>
                </p>
            </form>
        </main>
    );
}