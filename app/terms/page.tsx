import type { Metadata } from 'next';
import { TermsContent } from './TermsContent';

export const metadata: Metadata = {
  title: 'Terms & Conditions — GapZero',
  description:
    'Terms and Conditions for GapZero, an AI-powered career intelligence platform. Understand how our AI-generated career guidance works, your rights, and our obligations.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://gapzero.app/terms' },
};

export default function TermsPage() {
  return <TermsContent />;
}
