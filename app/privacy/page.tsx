import type { Metadata } from 'next';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy — GapZero',
  description:
    'Privacy Policy for GapZero. Learn what data we collect, how we use it, how long we keep it, and your rights under GDPR (EU & UK) and CCPA (California).',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://gapzero.app/privacy' },
};

const LAST_UPDATED = 'March 2026';
const EFFECTIVE_DATE = 'March 14, 2026';

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-xl font-bold text-text-primary font-display mb-4 mt-10 pb-2 border-b border-black/[0.06]">
        {title}
      </h2>
      <div className="space-y-3 text-text-secondary leading-relaxed text-[15px]">
        {children}
      </div>
    </section>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p>{children}</p>;
}

function DataTable({ rows }: { rows: { category: string; examples: string; basis: string }[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-black/[0.08] mt-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-surface-secondary border-b border-black/[0.06]">
            <th className="text-left px-4 py-3 font-semibold text-text-primary">Data category</th>
            <th className="text-left px-4 py-3 font-semibold text-text-primary">What we collect</th>
            <th className="text-left px-4 py-3 font-semibold text-text-primary">Legal basis (GDPR)</th>
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

function RightsCard({ title, items }: { title: string; items: string[] }) {
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

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16 max-w-3xl">

        {/* Header */}
        <div className="mb-10">
          <p className="text-sm text-text-tertiary uppercase tracking-wider font-medium mb-2">Legal</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-text-primary font-display mb-4">
            Privacy Policy
          </h1>
          <p className="text-text-secondary">
            Last updated: <strong className="text-text-primary">{LAST_UPDATED}</strong> · Effective: {EFFECTIVE_DATE}
          </p>
          <p className="mt-3 text-text-secondary">
            We respect your privacy. This policy explains what data GapZero collects, why, how long we keep it,
            and what rights you have. We&apos;ve written it in plain English — no unnecessary legal complexity.
          </p>
        </div>

        {/* ── 1. Controller ── */}
        <Section id="controller" title="1. Who Is Responsible for Your Data">
          <P>
            GapZero is operated by <strong>[Company Name]</strong>, registered at{' '}
            <strong>[Company Address]</strong> (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;).
          </P>
          <P>
            For the purposes of the UK GDPR and EU GDPR, we are the <strong>data controller</strong> of the
            personal data you provide when using gapzero.app.
          </P>
          <P>
            Data Protection contact: <strong>[privacy@gapzero.app]</strong>
          </P>
        </Section>

        {/* ── 2. What we collect ── */}
        <Section id="what-we-collect" title="2. What Data We Collect">
          <P>We only collect data that is necessary to provide the service to you.</P>
          <DataTable rows={[
            {
              category: 'Account data',
              examples: 'Email address, hashed password (via Supabase Auth), account creation date',
              basis: 'Contract performance (Art. 6(1)(b))',
            },
            {
              category: 'CV content',
              examples: 'Text extracted from your uploaded CV PDF — name, work history, skills, education, certifications, summary',
              basis: 'Contract performance (Art. 6(1)(b))',
            },
            {
              category: 'LinkedIn PDF export',
              examples: 'Text extracted from your LinkedIn PDF — profile, experience, skills (optional upload)',
              basis: 'Contract performance (Art. 6(1)(b))',
            },
            {
              category: 'Job posting text',
              examples: 'The job description you paste or fetch — role title, requirements, employer details',
              basis: 'Contract performance (Art. 6(1)(b))',
            },
            {
              category: 'Career questionnaire',
              examples: 'Current role, target role, years of experience, country, work preference (remote/hybrid/on-site)',
              basis: 'Contract performance (Art. 6(1)(b))',
            },
            {
              category: 'GitHub URL',
              examples: 'Your public GitHub profile URL (optional) — used to fetch public repository data for analysis',
              basis: 'Contract performance / Consent (Art. 6(1)(a))',
            },
            {
              category: 'Analysis results',
              examples: 'Fit scores, gap analysis, salary benchmarks, ATS scores, CV suggestions, cover letters, GitHub assessments, action plans — saved to your account history',
              basis: 'Contract performance (Art. 6(1)(b))',
            },
            {
              category: 'Usage data',
              examples: 'Pages visited, features used, analysis count, session identifiers — used to enforce usage quotas and improve the platform',
              basis: 'Legitimate interests (Art. 6(1)(f))',
            },
            {
              category: 'Payment data',
              examples: 'Subscription status, billing period — payment card details are held exclusively by Stripe, not by us',
              basis: 'Contract performance (Art. 6(1)(b))',
            },
          ]} />
        </Section>

        {/* ── 3. How we use your data ── */}
        <Section id="how-we-use" title="3. How We Use Your Data">
          <P>
            <strong>To provide the service:</strong> We send your CV text, job posting, and questionnaire
            responses to Anthropic&apos;s Claude API to generate your analysis. We store the results in Supabase
            so you can access your history. We use your email to authenticate your account.
          </P>
          <P>
            <strong>To operate the platform:</strong> We use usage data to enforce your plan&apos;s analysis quota,
            prevent abuse, and monitor platform health.
          </P>
          <P>
            <strong>To improve the platform:</strong> We may analyse anonymised, aggregated usage patterns
            (e.g., which features are used most) to improve GapZero. We do not use your personal CV content
            for this purpose.
          </P>
          <P>
            <strong>To communicate with you:</strong> We may send transactional emails (account confirmation,
            subscription receipts). We will only send marketing communications if you opt in.
          </P>
        </Section>

        {/* ── 4. AI processing ── */}
        <section id="ai-processing" className="scroll-mt-24">
          <div className="mt-10 rounded-2xl border border-primary/20 bg-primary/[0.03] p-6">
            <h2 className="text-xl font-bold text-text-primary font-display mb-4 pb-2 border-b border-primary/10">
              4. How AI Processes Your Data
            </h2>
            <div className="space-y-3 text-[15px] text-text-secondary leading-relaxed">
              <P>
                <strong className="text-text-primary">Your CV is sent to Anthropic.</strong> When you run an
                analysis, your CV text, LinkedIn export (if provided), job posting, and questionnaire are
                transmitted to Anthropic&apos;s API. Anthropic processes this data to generate your career analysis.
                Anthropic is our <strong>data processor</strong> under a Data Processing Agreement.
              </P>
              <P>
                <strong className="text-text-primary">Your data is not used to train AI models.</strong>{' '}
                Anthropic&apos;s API usage policies prohibit using API-submitted data to train or fine-tune their
                models. Your CV content is used solely to generate your analysis and is not retained by
                Anthropic beyond the API call.
              </P>
              <P>
                <strong className="text-text-primary">No automated decision-making with legal effect.</strong>{' '}
                GapZero does not make automated decisions about you under GDPR Article 22. All outputs — fit
                scores, role recommendations, salary estimates — are tools to inform your own decisions.
                You remain in control. No output is communicated to any employer on your behalf.
              </P>
              <P>
                <strong className="text-text-primary">GitHub analysis</strong> uses only publicly accessible
                repository data from GitHub&apos;s public API, limited to repositories you have made public.
              </P>
            </div>
          </div>
        </section>

        {/* ── 5. Third-party processors ── */}
        <Section id="processors" title="5. Third-Party Data Processors">
          <div className="rounded-xl border border-black/[0.08] overflow-hidden mt-2">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-secondary border-b border-black/[0.06]">
                  <th className="text-left px-4 py-3 font-semibold text-text-primary">Processor</th>
                  <th className="text-left px-4 py-3 font-semibold text-text-primary">What they process</th>
                  <th className="text-left px-4 py-3 font-semibold text-text-primary">Location</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-3 font-medium text-text-primary">Anthropic</td>
                  <td className="px-4 py-3 text-text-secondary">CV text, job posting, questionnaire (during analysis only)</td>
                  <td className="px-4 py-3 text-text-tertiary">USA</td>
                </tr>
                <tr className="bg-surface-secondary/50">
                  <td className="px-4 py-3 font-medium text-text-primary">Supabase</td>
                  <td className="px-4 py-3 text-text-secondary">Account data, analysis history, profile, job tracker</td>
                  <td className="px-4 py-3 text-text-tertiary">EU / USA</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-text-primary">Stripe</td>
                  <td className="px-4 py-3 text-text-secondary">Payment card details, subscription status</td>
                  <td className="px-4 py-3 text-text-tertiary">USA / EU</td>
                </tr>
                <tr className="bg-surface-secondary/50">
                  <td className="px-4 py-3 font-medium text-text-primary">Vercel</td>
                  <td className="px-4 py-3 text-text-secondary">Web request logs, serverless function execution</td>
                  <td className="px-4 py-3 text-text-tertiary">Global CDN</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Section>

        {/* ── 6. International transfers ── */}
        <Section id="transfers" title="6. International Data Transfers">
          <P>
            Some of our processors are based in the United States. If you are in the EU or UK, this means your
            personal data may be transferred outside the European Economic Area (EEA) or United Kingdom.
          </P>
          <P>
            We rely on the following safeguards for such transfers:
          </P>
          <ul className="list-disc pl-5 space-y-1.5 text-[15px] text-text-secondary">
            <li>
              <strong>Anthropic:</strong> EU Standard Contractual Clauses (SCCs) and Anthropic&apos;s Data Processing
              Agreement, which includes UK IDTA (International Data Transfer Agreement) provisions.
            </li>
            <li>
              <strong>Supabase:</strong> SCCs with EU data residency options where selected.
            </li>
            <li>
              <strong>Stripe:</strong> EU-US Data Privacy Framework certification and SCCs.
            </li>
            <li>
              <strong>Vercel:</strong> SCCs included in Vercel&apos;s DPA.
            </li>
          </ul>
          <P>
            You may request a copy of the relevant safeguards by contacting us at the address in Section 10.
          </P>
        </Section>

        {/* ── 7. Retention ── */}
        <Section id="retention" title="7. How Long We Keep Your Data">
          <ul className="list-disc pl-5 space-y-2 text-[15px] text-text-secondary">
            <li><strong>Analysis results and career history</strong> — kept while your account is active. Deleted when you delete your account.</li>
            <li><strong>CV text submitted for analysis</strong> — not stored by GapZero after the analysis is complete. The extracted results (fit score, gaps, etc.) are stored, but not the raw CV text.</li>
            <li><strong>Account data (email)</strong> — retained until you delete your account or request erasure.</li>
            <li><strong>Subscription/billing records</strong> — retained for 7 years for tax and accounting compliance, even after account deletion.</li>
            <li><strong>Usage logs</strong> — retained for up to 90 days for security and fraud prevention.</li>
          </ul>
          <P>
            You can delete your account and all associated data from your dashboard at any time. Deletion is
            permanent and irreversible except where retention is required by law (e.g., billing records).
          </P>
        </Section>

        {/* ── 8. Cookies ── */}
        <Section id="cookies" title="8. Cookies">
          <P>
            GapZero uses <strong>session cookies only</strong> — small pieces of data stored in your browser
            that keep you logged in between page loads. We do not use advertising cookies, third-party
            tracking cookies, or analytics cookies that follow you across the web.
          </P>
          <ul className="list-disc pl-5 space-y-1.5 text-[15px] text-text-secondary">
            <li><strong>Authentication cookie</strong> — set by Supabase Auth to maintain your login session. Expires when you log out or after 7 days of inactivity.</li>
            <li><strong>Locale preference</strong> — stores your language preference. Not personally identifiable.</li>
          </ul>
          <P>
            You can disable cookies in your browser settings, but doing so will prevent you from staying
            logged in to GapZero.
          </P>
        </Section>

        {/* ── 9. Your rights ── */}
        <Section id="your-rights" title="9. Your Rights">
          <P>You have meaningful rights over your data, depending on where you are.</P>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <RightsCard
              title="GDPR (EU) & UK GDPR"
              items={[
                'Access — get a copy of your data',
                'Rectification — correct inaccurate data',
                'Erasure — delete your data ("right to be forgotten")',
                'Portability — export your data in a common format',
                'Restriction — pause processing while a dispute is resolved',
                'Objection — object to processing based on legitimate interests',
                'No automated decisions with legal effect',
              ]}
            />
            <RightsCard
              title="CCPA (California, USA)"
              items={[
                'Right to know what data we collect and how we use it',
                'Right to delete your personal information',
                'Right to opt out of the sale of your data',
                'Right to non-discrimination for exercising your rights',
                'We do not sell your personal information to any third party',
              ]}
            />
          </div>

          <P>
            To exercise any of these rights, email <strong>[privacy@gapzero.app]</strong> with your request.
            We will respond within 30 days (GDPR/UK GDPR) or 45 days (CCPA). We may ask you to verify your
            identity before processing your request.
          </P>
          <P>
            <strong>EU users:</strong> If you believe we have handled your data unlawfully, you have the
            right to lodge a complaint with your national supervisory authority (e.g., the ICO in the UK,
            the CNIL in France, or the relevant DPA in your member state).
          </P>
        </Section>

        {/* ── 10. Contact ── */}
        <Section id="contact-privacy" title="10. Contact &amp; Data Protection Officer">
          <P>
            For privacy questions, data subject requests, or to reach our Data Protection contact:
          </P>
          <div className="rounded-xl border border-black/[0.08] bg-surface-primary p-5 mt-2">
            <p className="text-[15px] text-text-secondary space-y-1">
              <span className="block font-semibold text-text-primary">[Company Name]</span>
              <span className="block">[Company Address]</span>
              <span className="block">
                Email: <strong>[privacy@gapzero.app]</strong>
              </span>
              <span className="block text-sm text-text-tertiary mt-2">
                DPO (if applicable): <strong>[DPO Name or &quot;Not appointed — SME exemption applies&quot;]</strong>
              </span>
            </p>
          </div>
        </Section>

        {/* ── 11. Changes ── */}
        <Section id="changes-privacy" title="11. Changes to This Policy">
          <P>
            We may update this Privacy Policy from time to time. For material changes, we will notify you
            by email (if you have an account) or by a prominent notice on the Platform at least 30 days
            before the changes take effect. The &quot;Last updated&quot; date at the top of this page will always
            reflect the current version.
          </P>
        </Section>

        {/* Divider to terms */}
        <div className="mt-12 pt-8 border-t border-black/[0.06] text-center">
          <p className="text-text-tertiary text-sm">
            See also:{' '}
            <a href="/terms" className="text-primary hover:underline font-medium">
              Terms &amp; Conditions
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
