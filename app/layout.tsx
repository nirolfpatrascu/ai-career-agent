import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'GapZero — AI-Powered Career Growth Advisor',
  description:
    'Upload your CV, get a personalized career strategy in 60 seconds. AI-powered gap analysis, learning plans, salary benchmarks, and CV optimization.',
  keywords: [
    'career advice',
    'AI career coach',
    'CV analysis',
    'skill gap analysis',
    'salary benchmarks',
    'career transition',
  ],
  metadataBase: new URL('https://ai-career-agent-gamma.vercel.app'),
  openGraph: {
    title: 'GapZero — AI-Powered Career Growth Advisor',
    description:
      'Upload your CV, get a personalized career strategy in 60 seconds. Gap analysis, salary benchmarks, role recommendations, and a 30/90/365-day action plan — powered by AI.',
    type: 'website',
    url: 'https://ai-career-agent-gamma.vercel.app',
    siteName: 'GapZero',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GapZero — AI-Powered Career Growth Advisor',
    description:
      'Upload your CV, get a personalized career strategy in 60 seconds.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
