import type { Metadata } from 'next';
import { Sora, IBM_Plex_Sans } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { LanguageProvider } from '@/components/providers/LanguageProvider';
import { Navbar } from '@/components/layout/Navbar';
import { BackgroundGradients } from '@/components/layout/BackgroundGradients';
import './globals.css';

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

const ibmPlex = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'WhatScreenSize - Screen Size Calculator',
  description: 'Find the perfect TV size and monitor resolution for your viewing distance. Expert recommendations backed by SMPTE and THX standards.',
  openGraph: {
    title: 'WhatScreenSize - Screen Size Calculator',
    description: 'Find the perfect TV size and monitor resolution for your viewing distance.',
    images: ['/assets/og-image.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Analytics */}
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
            `,
          }}
        />
      </head>
      <body className={`${sora.variable} ${ibmPlex.variable} font-body antialiased`}>
        <ThemeProvider>
          <LanguageProvider>
            <BackgroundGradients />
            <div className="relative z-10 min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1 max-w-4xl mx-auto w-full px-4 pb-8">
                {children}
              </main>
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
