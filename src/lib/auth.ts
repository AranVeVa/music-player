import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import sql from './db';

interface DBUser {
    id: number;
    name: string | null;
    email: string;
    password: string;
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const users = (await sql`
          SELECT id, name, email, password FROM users WHERE email = ${credentials.email}
        `) as DBUser[];

                const user = users[0];
                if (!user) return null;
                if (user.password !== credentials.password) return null;

                // ✅ Convertimos el id a string porque NextAuth lo exige así
                return {
                    id: String(user.id),
                    name: user.name,
                    email: user.email,
                };
            },
        }),
    ],
    pages: { signIn: '/login' },
    session: { strategy: 'jwt' },
    callbacks: {
        async jwt({ token, user }) {
            if (user) token.id = user.id;
            return token;
        },
        async session({ session, token }) {
            if (session.user) session.user.id = token.id;
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);