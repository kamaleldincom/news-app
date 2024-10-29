// src/app/layout.tsx
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';
import { ErrorBoundary } from '@/components/ui/error-boundary';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'News App',
  description: 'A transparent news aggregation platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
        <Providers>{children}</Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}