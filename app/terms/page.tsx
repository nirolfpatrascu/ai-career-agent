import type { Metadata } from 'next';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

export const metadata: Metadata = {
  title: 'Terms & Conditions — GapZero',
  description:
    'Terms and Conditions for GapZero, an AI-powered career intelligence platform. Understand how our AI-generated career guidance works, your rights, and our obligations.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://gapzero.app/terms' },
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

function Ul({ items }: { items: string[] }) {
  return (
    <ul className="list-disc pl-5 space-y-1.5">
      {items.map((item, i) => <li key={i}>{item}</li>)}
    </ul>
  );
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16 max-w-3xl">
        {/* Header */}
        <div className="mb-10">
          <p className="text-sm text-text-tertiary uppercase tracking-wider font-medium mb-2">Legal</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-text-primary font-display mb-4">
            Terms &amp; Conditions
          </h1>
          <p className="text-text-secondary">
            Last updated: <strong className="text-text-primary">{LAST_UPDATED}</strong> · Effective: {EFFECTIVE_DATE}
          </p>
          <p className="mt-3 text-text-secondary">
            By creating an account or using GapZero, you agree to these terms. Please read them — especially{' '}
            <a href="#ai-disclaimer" className="text-primary hover:underline font-medium">Section 3 on AI-generated content</a>,
            which is the most important part.
          </p>
        </div>

        {/* ── 1. Who we are ── */}
        <Section id="who-we-are" title="1. Who We Are">
          <P>
            GapZero (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is an AI-powered career intelligence platform
            operated by <strong>[Company Name]</strong>, registered at <strong>[Company Address]</strong>. We provide
            career analysis, skill gap assessments, CV optimisation, and career coaching tools powered by artificial
            intelligence.
          </P>
          <P>
            These Terms &amp; Conditions (&quot;Terms&quot;) govern your access to and use of the GapZero website at
            gapzero.app and all associated services (the &quot;Platform&quot;). By using the Platform, you confirm
            that you are at least 16 years old and have the legal capacity to enter into these Terms.
          </P>
        </Section>

        {/* ── 2. What GapZero Does ── */}
        <Section id="what-we-do" title="2. What GapZero Does">
          <P>
            GapZero is a career guidance tool. You upload your CV, optionally a LinkedIn PDF export and a job
            description, and our platform uses AI (Anthropic&apos;s Claude) to generate personalised outputs including:
          </P>
          <Ul items={[
            'Career fit scores and gap analysis',
            'Skill gap assessments and role recommendations',
            'Salary range benchmarks for your target role and country',
            'ATS (Applicant Tracking System) keyword and format scoring',
            'CV rewrite suggestions and optimised CV drafts',
            'Cover letter drafts',
            'GitHub profile assessments (if you provide a GitHub URL)',
            'Career coaching responses via the Career Coach chat',
            '30/90/365-day action plans',
          ]} />
          <P>
            GapZero is a <strong>guidance tool, not a professional service</strong>. Nothing on this platform
            constitutes professional career consulting, legal advice, financial advice, or an employment guarantee.
          </P>
        </Section>

        {/* ── 3. AI DISCLAIMER ── MOST IMPORTANT ── */}
        <section id="ai-disclaimer" className="scroll-mt-24">
          <div className="mt-10 rounded-2xl border-2 border-[#E8890A]/30 bg-[#E8890A]/[0.04] p-6 sm:p-8">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#E8890A]/10 border border-[#E8890A]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-5 h-5 text-[#E8890A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-text-primary font-display mb-1">
                  3. AI-Generated Content — Please Read This
                </h2>
                <p className="text-sm text-[#E8890A] font-medium">This is the most important section of these Terms.</p>
              </div>
            </div>

            <div className="space-y-4 text-[15px] text-text-secondary leading-relaxed">
              <p>
                <strong className="text-text-primary">Everything GapZero generates is produced by an AI system</strong> (Anthropic Claude) making
                probabilistic inferences based on your input. This includes, without limitation:
                fit scores, skill gap assessments, salary ranges, role recommendations, ATS scores,
                CV suggestions, optimised CV drafts, cover letters, GitHub assessments, career coaching
                responses, and action plans.
              </p>
              <p>
                <strong className="text-text-primary">AI outputs are best-effort estimates — not facts.</strong> They may
                contain inaccuracies, outdated information, oversimplifications, or in rare cases outright
                errors (&quot;hallucinations&quot;). Salary data is derived from publicly available benchmarks and may not
                reflect your local market, specific employer, or current conditions. Fit scores are probabilistic
                assessments, not guarantees of hiring success.
              </p>
              <p>
                <strong className="text-text-primary">You must apply your own judgment.</strong> GapZero outputs are
                starting points for your thinking — not final answers. Before making any career decision (changing
                jobs, declining an offer, pursuing a qualification, or submitting a CV), verify the information
                through independent research, speak with human professionals, and use your own knowledge of your
                situation.
              </p>
              <p>
                <strong className="text-text-primary">GapZero is not liable for outcomes.</strong> To the maximum extent
                permitted by applicable law, GapZero and its operators accept no liability for employment decisions,
                career outcomes, missed opportunities, financial loss, or any other consequence arising from your
                use of AI-generated content on this Platform.
              </p>
              <p className="text-sm text-text-tertiary">
                <strong>EU users — AI Act notice:</strong> GapZero provides AI-assisted career decision support
                in the employment domain. Consistent with EU AI Act requirements for human oversight,
                all outputs are tools to <em>assist</em> your decision-making. No output constitutes an
                automated decision with legal or similarly significant effects under GDPR Article 22 — a human
                (you) makes every career decision. You are always in control.
              </p>
            </div>
          </div>
        </section>

        {/* ── 4. Accounts ── */}
        <Section id="accounts" title="4. Your Account">
          <P>
            To save analyses and access your history, you create an account using your email address.
            You are responsible for:
          </P>
          <Ul items={[
            'Keeping your login credentials secure and confidential',
            'All activity that occurs under your account',
            'Providing accurate information when using the Platform — garbage in, garbage out applies especially to AI analysis',
            'Notifying us immediately if you suspect unauthorised access to your account',
          ]} />
          <P>
            You may delete your account at any time from your dashboard settings. Deletion permanently removes
            your analyses, saved results, and profile data from our systems, subject to our data retention policy.
          </P>
        </Section>

        {/* ── 5. Acceptable Use ── */}
        <Section id="acceptable-use" title="5. Acceptable Use">
          <P>You agree not to:</P>
          <Ul items={[
            'Scrape, crawl, or systematically extract data from the Platform by automated means',
            'Reverse engineer, decompile, or attempt to extract the Platform\'s source code or AI prompts',
            'Upload content you do not have the right to share (e.g., another person\'s CV without their consent)',
            'Use the Platform to screen, discriminate against, or profile job candidates if you are an employer — the Platform is designed for individual career development, not hiring decisions',
            'Attempt to circumvent usage quotas or access controls',
            'Use the Platform for any unlawful purpose or in violation of applicable laws',
            'Introduce malware, viruses, or any other harmful code',
            'Represent AI-generated outputs as your own original professional work without disclosure where required',
          ]} />
          <P>
            We reserve the right to suspend or terminate accounts that violate these rules, at our discretion
            and without prior notice where immediate action is warranted.
          </P>
        </Section>

        {/* ── 6. Subscriptions & Billing ── */}
        <Section id="billing" title="6. Subscriptions &amp; Billing">
          <P>
            GapZero offers a <strong>Free tier</strong> and a <strong>Pro subscription</strong> (available weekly at
            $9.99/week or monthly at $29.99/month, prices inclusive of applicable taxes where required by law).
            Prices are subject to change with 30 days&apos; notice.
          </P>
          <P><strong>Billing:</strong> Pro subscriptions are billed in advance on a recurring basis. Payments are
          processed by Stripe. You authorise us to charge your payment method on each billing cycle.</P>
          <P><strong>Cancellation:</strong> You may cancel your Pro subscription at any time from your account
          settings. Cancellation takes effect at the end of your current billing period — you retain Pro access
          until then. We do not provide partial-period refunds.</P>
          <P>
            <strong>Refund policy:</strong> If you are unhappy with your first Pro subscription payment,
            contact us within <strong>7 days</strong> of the charge at <strong>[support@gapzero.app]</strong> for
            a full refund. After 7 days, or after a second billing cycle, refunds are issued at our discretion.
            This does not affect your statutory rights under applicable consumer protection law.
          </P>
          <p className="text-sm text-text-tertiary">
            <strong>UK consumers:</strong> Under the Consumer Rights Act 2015 and the Consumer Contracts
            Regulations 2013, you have a 14-day cooling-off period for digital services unless you have
            already consumed the service. By requesting your first analysis, you acknowledge that the service
            has commenced and consent to waiving the cooling-off right for that analysis.
          </p>
          <p className="text-sm text-text-tertiary">
            <strong>EU consumers:</strong> Under the EU Consumer Rights Directive (2011/83/EU), the same
            14-day right of withdrawal applies. By initiating your first analysis, you consent to immediate
            service delivery and waive the right of withdrawal in respect of that delivery.
          </p>
        </Section>

        {/* ── 7. Intellectual Property ── */}
        <Section id="ip" title="7. Intellectual Property">
          <P>
            <strong>Your data is yours.</strong> You own your CV, LinkedIn export, and any other content you
            upload. By uploading content to GapZero, you grant us a limited, non-exclusive, worldwide licence
            to process that content solely for the purpose of providing the service to you.
          </P>
          <P>
            <strong>AI-generated outputs</strong> (fit scores, career plans, cover letters, CV drafts, etc.)
            are licensed to you for personal, non-commercial use. You may use them in your own job search,
            career planning, and CV development. You may not resell, redistribute, or represent them as a
            service you offer to others.
          </P>
          <P>
            <strong>The Platform itself</strong> — including its design, code, prompts, knowledge base, and
            brand — belongs to GapZero. Nothing in these Terms transfers ownership of Platform IP to you.
          </P>
        </Section>

        {/* ── 8. Disclaimers & Limitation of Liability ── */}
        <Section id="liability" title="8. Disclaimers &amp; Limitation of Liability">
          <P>
            <strong>AS IS.</strong> The Platform is provided &quot;as is&quot; and &quot;as available&quot; without
            warranties of any kind, express or implied, including but not limited to implied warranties of
            merchantability, fitness for a particular purpose, and non-infringement.
          </P>
          <P>
            <strong>No employment guarantee.</strong> GapZero makes no representation that using our Platform
            will result in job offers, salary increases, career advancement, or any other specific outcome.
          </P>
          <P>
            <strong>Limitation of liability.</strong> To the fullest extent permitted by law, GapZero&apos;s
            total liability to you for any claim arising from or related to these Terms or the Platform shall
            not exceed the amount you paid to GapZero in the 12 months preceding the claim, or $50, whichever
            is greater.
          </P>
          <P>
            We are not liable for indirect, incidental, special, consequential, or punitive damages,
            including loss of profits, data, goodwill, or career opportunities, even if advised of the
            possibility of such damages.
          </P>
          <p className="text-sm text-text-tertiary">
            <strong>Jurisdiction note:</strong> Some jurisdictions (including EU member states and UK under
            the Consumer Rights Act 2015) do not allow the exclusion of certain warranties or limitations on
            consumer rights. Nothing in these Terms is intended to exclude rights that cannot be lawfully
            excluded in your jurisdiction. UK and EU consumers retain all statutory rights under applicable
            consumer protection law.
          </p>
        </Section>

        {/* ── 9. Third-Party Services ── */}
        <Section id="third-parties" title="9. Third-Party Services">
          <P>GapZero relies on the following third-party services to operate:</P>
          <Ul items={[
            'Anthropic (Claude API) — processes your CV and job data to generate AI outputs. Anthropic\'s usage policies prohibit using API data to train their models.',
            'Supabase — stores your account data, analyses, and profile in a hosted database.',
            'Stripe — processes subscription payments. We do not store your payment card details.',
            'Vercel — hosts the Platform.',
          ]} />
          <P>
            We are not responsible for the actions, content, or availability of these third-party services.
            Your use of Stripe is subject to Stripe&apos;s own terms of service.
          </P>
        </Section>

        {/* ── 10. Termination ── */}
        <Section id="termination" title="10. Termination">
          <P>
            You may stop using the Platform and delete your account at any time. We may suspend or terminate
            your account if you breach these Terms, engage in fraudulent activity, or if we discontinue the
            service, with reasonable notice where practicable. If we terminate for cause (e.g., breach of
            Section 5), no refund will be issued for the current billing period.
          </P>
          <P>
            On account deletion or termination, your right to access the Platform ceases. Sections 3, 7, 8,
            and 11 survive termination.
          </P>
        </Section>

        {/* ── 11. Governing Law ── */}
        <Section id="governing-law" title="11. Governing Law &amp; Dispute Resolution">
          <P>
            These Terms are governed by the laws of <strong>[Governing Jurisdiction — e.g., England & Wales / Delaware, USA]</strong>.
            Any disputes shall first be addressed through good-faith negotiation. If unresolved, disputes
            shall be submitted to the courts of that jurisdiction, subject to any mandatory consumer
            protections in your country of residence.
          </P>
          <p className="text-sm text-text-tertiary">
            <strong>EU users:</strong> You may also use the EU Online Dispute Resolution platform at{' '}
            <a href="https://ec.europa.eu/consumers/odr" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
              ec.europa.eu/consumers/odr
            </a>.
          </p>
          <p className="text-sm text-text-tertiary">
            <strong>US — California users:</strong> Nothing in these Terms waives any rights you have under
            California law, including under the California Consumer Privacy Act (CCPA). See our Privacy
            Policy for details.
          </p>
        </Section>

        {/* ── 12. Changes ── */}
        <Section id="changes" title="12. Changes to These Terms">
          <P>
            We may update these Terms from time to time. For material changes, we will provide at least
            <strong> 30 days&apos; notice</strong> by email (if you have an account) or by prominent notice on
            the Platform before the changes take effect. Continued use of the Platform after the effective
            date constitutes acceptance of the updated Terms.
          </P>
          <P>
            We will always keep the current version of these Terms accessible at gapzero.app/terms with the
            &quot;Last updated&quot; date shown at the top.
          </P>
        </Section>

        {/* ── 13. Contact ── */}
        <Section id="contact-terms" title="13. Contact">
          <P>
            Questions about these Terms? Contact us at:{' '}
            <strong>[legal@gapzero.app]</strong> or write to <strong>[Company Address]</strong>.
          </P>
        </Section>

        {/* Divider to privacy */}
        <div className="mt-12 pt-8 border-t border-black/[0.06] text-center">
          <p className="text-text-tertiary text-sm">
            See also:{' '}
            <a href="/privacy" className="text-primary hover:underline font-medium">
              Privacy Policy
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
