'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';
import { PRIVACY_CONTENT } from '@/lib/legal/privacy-content';
import type {
  PrivacySection,
  PrivacyLocaleContent,
  PrivacyDataRow,
  PrivacyProcessorRow,
  PrivacyRightsCard,
} from '@/lib/legal/privacy-content';
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

function DataTableComponent({
  rows,
  headers,
}: {
  rows: PrivacyDataRow[];
  headers: { category: string; examples: string; basis: string };
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-black/[0.08] mt-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-surface-secondary border-b border-black/[0.06]">
            <th className="text-left px-4 py-3 font-semibold text-text-primary">{headers.category}</th>
            <th className="text-left px-4 py-3 font-semibold text-text-primary">{headers.examples}</th>
            <th className="text-left px-4 py-3 font-semibold text-text-primary">{headers.basis}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? '' : 'bg-surface-secondary/50'}>
              <td className="px-4 py-3 font-medium text-text-primary align-top">{row.category}</td>
              <td className="px-4 py-3 text-text-secondary align-top">{row.examples}</td>
              <td className="px-4 py-3 text-text-tertiary align-top text-xs">{row.basis}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProcessorTableComponent({
  rows,
  headers,
}: {
  rows: PrivacyProcessorRow[];
  headers: { name: string; processes: string; location: string };
}) {
  return (
    <div className="rounded-xl border border-black/[0.08] overflow-hidden mt-2">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-surface-secondary border-b border-black/[0.06]">
            <th className="text-left px-4 py-3 font-semibold text-text-primary">{headers.name}</th>
            <th className="text-left px-4 py-3 font-semibold text-text-primary">{headers.processes}</th>
            <th className="text-left px-4 py-3 font-semibold text-text-primary">{headers.location}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? '' : 'bg-surface-secondary/50'}>
              <td className="px-4 py-3 font-medium text-text-primary">{row.name}</td>
              <td className="px-4 py-3 text-text-secondary">{row.processes}</td>
              <td className="px-4 py-3 text-text-tertiary">{row.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RightsCardComponent({ title, items }: PrivacyRightsCard) {
  return (
    <div className="rounded-xl border border-black/[0.08] bg-surface-primary p-5">
      <h3 className="font-semibold text-text-primary mb-3 text-sm uppercase tracking-wide">{title}</h3>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
            <svg className="w-4 h-4 text-success flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function PrivacySectionRenderer({
  section,
  content,
}: {
  section: PrivacySection;
  content: PrivacyLocaleContent;
}) {
  const body = (
    <>
      {renderLines(section.content)}
      {section.dataTable && content.tableHeaders && (
        <DataTableComponent rows={section.dataTable} headers={content.tableHeaders} />
      )}
      {section.processorTable && content.processorHeaders && (
        <ProcessorTableComponent rows={section.processorTable} headers={content.processorHeaders} />
      )}
      {section.rightsCards && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {section.rightsCards.map((card, i) => (
            <RightsCardComponent key={i} title={card.title} items={card.items} />
          ))}
        </div>
      )}
    </>
  );

  if (section.highlight) {
    return (
      <section id={section.id} className="scroll-mt-24">
        <div className="mt-10 rounded-2xl border border-primary/20 bg-primary/[0.03] p-6">
          <h2 className="text-xl font-bold text-text-primary font-display mb-4 pb-2 border-b border-primary/10">
            {section.title}
          </h2>
          <div className="space-y-3 text-[15px] text-text-secondary leading-relaxed">{body}</div>
        </div>
      </section>
    );
  }

  return (
    <section id={section.id} className="scroll-mt-24">
      <h2 className="text-xl font-bold text-text-primary font-display mb-4 mt-10 pb-2 border-b border-black/[0.06]">
        {section.title}
      </h2>
      <div className="space-y-3 text-text-secondary leading-relaxed text-[15px]">{body}</div>
    </section>
  );
}

export function PrivacyContent() {
  const { locale } = useTranslation();
  const content = PRIVACY_CONTENT[locale];

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

        {content.sections.map((section) => (
          <PrivacySectionRenderer key={section.id} section={section} content={content} />
        ))}

        <div className="mt-12 pt-8 border-t border-black/[0.06] text-center">
          <p className="text-text-tertiary text-sm">
            See also:{' '}
            <Link href="/terms" className="text-primary hover:underline font-medium">
              Terms &amp; Conditions
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
