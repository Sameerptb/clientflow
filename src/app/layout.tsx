import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://clientflow-tau-beige.vercel.app'),
  title: 'ClientFlow | Project Management Dashboard',
  description:
    'Manage projects, track tasks, monitor progress, and organize clients with ClientFlow.',
  openGraph: {
    title: 'ClientFlow | Project Management Dashboard',
    description: 'Organize projects, track tasks, and manage client information with ClientFlow.',
    url: 'https://clientflow-tau-beige.vercel.app/',
    siteName: 'ClientFlow',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1712,
        height: 912,
        alt: 'ClientFlow project management dashboard',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ClientFlow | Project Management Dashboard',
    description: 'Organize projects, track tasks, and manage client information with ClientFlow.',
    images: ['/opengraph-image.png'],
  },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
