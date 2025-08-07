'use client';

import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/hooks/use-language';
import { PageLoader } from '@/components/page-loader';
import { Sidebar } from '@/components/sidebar';
import { Suspense } from 'react';

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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground">
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
