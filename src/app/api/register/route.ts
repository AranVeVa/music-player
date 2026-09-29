import { NextResponse } from 'next/server';
import sql from '@/lib/db';

interface RegisterBody {
    name?: string;
    email: string;
    password: string;
}

export async function POST(request: Request) {
    const { name, email, password }: RegisterBody = await request.json();

    if (!email || !password) {
        return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
    }

    try {
        await sql`
      INSERT INTO users (name, email, password)
      VALUES (${name ?? null}, ${email}, ${password})
    `;
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'El email ya existe' }, { status: 409 });
    }
}