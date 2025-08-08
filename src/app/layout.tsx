'use client';

import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/hooks/use-language';
import { PageLoader } from '@/components/page-loader';
import { Sidebar } from '@/components/sidebar';
import { Suspense } from 'react';
import { Open_Sans, Poppins } from 'next/font/google';
import { cn } from '@/lib/utils';

const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-open-sans',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Dev Showcase</title>
        <meta name="description" content="A portfolio to showcase development projects and skills." />
      </head>
      <body className={cn("font-body antialiased bg-background text-foreground", openSans.variable, poppins.variable)}>
        <Suspense>
          <PageLoader />
        </Suspense>
        <LanguageProvider>
          <div className="flex">
            <Sidebar />
            <main className="flex-grow md:ml-60">
                {children}
            </main>
          </div>
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
