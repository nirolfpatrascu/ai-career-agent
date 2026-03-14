import type { Metadata } from 'next';
import { PrivacyContent } from './PrivacyContent';

export const metadata: Metadata = {
  title: 'Privacy Policy — GapZero',
  description:
    'Privacy Policy for GapZero. Learn what data we collect, how we use it, how long we keep it, and your rights under GDPR (EU & UK) and CCPA (California).',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://gapzero.app/privacy' },
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}
