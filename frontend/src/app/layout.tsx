import type { Metadata, Viewport } from 'next';
import './globals.css';
import { LanguageProvider } from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'Agafari (አጋፋሪ) — Smart Digital Wedding Celebration Ecosystem',
  description: 'Digital Invitations, Gate Scanning, Live Streaming, and Interactive TikTok Event Feeds by Hamelmal Creatives.',
  icons: {
    icon: '/branding/artboard-13.png',
    shortcut: '/branding/artboard-13.png',
    apple: '/branding/artboard-13.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth bg-white">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Abyssinica+SIL&family=Great+Vibes&family=Inter:wght@300;400;500;600;700;800&family=Noto+Sans+Ethiopic:wght@300;400;500;600;700;800;900&family=Noto+Serif+Ethiopic:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen w-full max-w-full overflow-x-hidden bg-white text-gray-900 antialiased selection:bg-gold-500 selection:text-black">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
