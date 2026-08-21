import type { Metadata } from 'next';
import './globals.css';
import { SocketProvider } from '@/context/SocketContext';
import { Header } from '@/components/Header';
import { ConnectionBanner } from '@/components/ConnectionBanner';
import { ToastContainer } from '@/components/GoalToast';

export const metadata: Metadata = {
  title: 'LiveMatch Pro - Real-Time Football Center',
  description: 'Track live football scores, events, match statistics, and join fan chat in real-time.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-slate-950 text-slate-100 min-h-screen flex flex-col selection:bg-cyan-500 selection:text-slate-950">
        <SocketProvider>
          <ConnectionBanner />
          <Header />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>
          <ToastContainer />
        </SocketProvider>
      </body>
    </html>
  );
}
