'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';
import { TERMS_CONTENT } from '@/lib/legal/terms-content';
import type { LegalSection } from '@/lib/legal/terms-content';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

const LAST_UPDATED = 'March 2026';
const EFFECTIVE_DATE = 'March 14, 2026';

function renderLines(lines: string[]) {
  const nodes: React.ReactNode[] = [];
  let bullets: string[] = [];

  const flush = (key: string | number) => {
    if (bullets.length > 0) {
      nodes.push(
        <ul key={`ul-${key}`} className="list-disc pl-5 space-y-1.5">
          {bullets.map((b, i) => <li key={i}>{b}</li>)}
        </ul>
      );
      bullets = [];
    }
  };

  lines.forEach((line, idx) => {
    if (line.startsWith('• ')) {
      bullets.push(line.slice(2));
    } else if (line.startsWith('[note] ')) {
      flush(idx);
      nodes.push(<p key={idx} className="text-sm text-text-tertiary">{line.slice(7)}</p>);
    } else {
      flush(idx);
      nodes.push(<p key={idx}>{line}</p>);
    }
  });
  flush('end');

  return nodes;
}

function NormalSection({ section }: { section: LegalSection }) {
  return (
    <section id={section.id} className="scroll-mt-24">
      <h2 className="text-xl font-bold text-text-primary font-display mb-4 mt-10 pb-2 border-b border-black/[0.06]">
        {section.title}
      </h2>
      <div className="space-y-3 text-text-secondary leading-relaxed text-[15px]">
        {renderLines(section.content)}
      </div>
    </section>
  );
}

function HighlightSection({ section, label }: { section: LegalSection; label: string }) {
  return (
    <section id={section.id} className="scroll-mt-24">
      <div className="mt-10 rounded-2xl border-2 border-[#E8890A]/30 bg-[#E8890A]/[0.04] p-6 sm:p-8">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#E8890A]/10 border border-[#E8890A]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-5 h-5 text-[#E8890A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-primary font-display mb-1">{section.title}</h2>
            <p className="text-sm text-[#E8890A] font-medium">{label}</p>
          </div>
        </div>
        <div className="space-y-4 text-[15px] text-text-secondary leading-relaxed">
          {renderLines(section.content)}
        </div>
      </div>
    </section>
  );
}

export function TermsContent() {
  const { locale } = useTranslation();
  const content = TERMS_CONTENT[locale];

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 pt-24 pb-16 max-w-3xl">
        <div className="mb-10">
          <p className="text-sm text-text-tertiary uppercase tracking-wider font-medium mb-2">Legal</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-text-primary font-display mb-4">
            {content.pageTitle}
          </h1>
          <p className="text-text-secondary">
            Last updated: <strong className="text-text-primary">{LAST_UPDATED}</strong> · Effective: {EFFECTIVE_DATE}
          </p>
          <p className="mt-3 text-text-secondary">{content.intro}</p>
        </div>

        {content.sections.map((section) =>
          section.highlight ? (
            <HighlightSection key={section.id} section={section} label={content.importantSection} />
          ) : (
            <NormalSection key={section.id} section={section} />
          )
        )}

        <div className="mt-12 pt-8 border-t border-black/[0.06] text-center">
          <p className="text-text-tertiary text-sm">
            See also:{' '}
            <Link href="/privacy" className="text-primary hover:underline font-medium">
              Privacy Policy
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
