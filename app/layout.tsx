import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Bricolage_Grotesque } from 'next/font/google';
import { I18nProvider } from '@/lib/i18n';
import { AuthProvider } from '@/lib/auth/context';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-jakarta',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});

const bricolage = Bricolage_Grotesque({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'GapZero — AI Career Gap Analysis & Career Roadmap',
  description:
    'Upload your CV, get a personalized career strategy in under 2 minutes. AI-powered skill gap analysis, salary benchmarks, role recommendations, and 30/90/365-day action plans.',
  keywords: [
    'career advice',
    'AI career coach',
    'CV analysis',
    'skill gap analysis',
    'salary benchmarks',
    'career transition',
    'resume analysis',
    'career roadmap',
    'job match score',
    'career planning tool',
  ],
  metadataBase: new URL('https://gapzero.app'),
  openGraph: {
    title: 'GapZero — AI Career Gap Analysis & Career Roadmap',
    description:
      'Upload your CV, get a personalized career strategy in under 2 minutes. Gap analysis, salary benchmarks, role recommendations, and a 30/90/365-day action plan — powered by AI.',
    type: 'website',
    url: 'https://gapzero.app',
    siteName: 'GapZero',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'GapZero — AI-Powered Career Gap Analysis',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GapZero — AI Career Gap Analysis & Career Roadmap',
    description:
      'Upload your CV, get a personalized career strategy in under 2 minutes.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://gapzero.app',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jakarta.variable} ${bricolage.variable}`}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'GapZero',
              description:
                'AI-powered career gap analysis and career roadmap tool. Upload your CV and get personalized career advice.',
              url: 'https://gapzero.app',
              applicationCategory: 'BusinessApplication',
              operatingSystem: 'Any',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              author: {
                '@type': 'Person',
                name: 'Florin Pătrascu',
              },
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <I18nProvider><AuthProvider>{children}</AuthProvider></I18nProvider>
      </body>
    </html>
  );
}
