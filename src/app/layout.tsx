import './globals.css';
import type { Metadata } from 'next';
import { AudioProvider } from '@/context/AudioContext';
import Providers from '@/components/Providers';

export const metadata: Metadata = {
  title: 'Music Player App',
  description: 'Reproductor de música con login y favoritos',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        <Providers>
          <AudioProvider>{children}</AudioProvider>
        </Providers>
      </body>
    </html>
  );
}