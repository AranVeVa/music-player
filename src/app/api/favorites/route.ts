import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import sql from '@/lib/db';

interface FavoriteRow {
    song_id: number;
}

interface FavoriteBody {
    songId: number;
}

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const rows = (await sql`
    SELECT song_id FROM favorites WHERE user_id = ${session.user.id}
  `) as FavoriteRow[];

    return NextResponse.json({ favorites: rows.map((r) => r.song_id) });
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { songId }: FavoriteBody = await request.json();
    await sql`
    INSERT INTO favorites (user_id, song_id)
    VALUES (${session.user.id}, ${songId})
    ON CONFLICT (user_id, song_id) DO NOTHING
  `;
    return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { songId }: FavoriteBody = await request.json();
    await sql`
    DELETE FROM favorites WHERE user_id = ${session.user.id} AND song_id = ${songId}
  `;
    return NextResponse.json({ success: true });
}