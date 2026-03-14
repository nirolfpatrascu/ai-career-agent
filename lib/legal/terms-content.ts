import type { Locale } from '@/lib/i18n';

// Content encoding:
//   Plain string  → paragraph
//   "• ..."       → bullet list item
//   "[note] ..."  → small footnote paragraph

export interface LegalSection {
  id: string;
  title: string;
  content: string[];
  highlight?: boolean;      // renders as orange-bordered AI disclaimer box
  highlightLabel?: string;
}

export interface TermsLocaleContent {
  pageTitle: string;
  intro: string;
  importantSection: string;
  sections: LegalSection[];
}

export const TERMS_CONTENT: Record<Locale, TermsLocaleContent> = {

  // ── ENGLISH ────────────────────────────────────────────────────────────────
  en: {
    pageTitle: 'Terms & Conditions',
    intro: 'By creating an account or using GapZero, you agree to these terms. Please read them — especially Section 3 on AI-generated content, which is the most important part.',
    importantSection: 'This is the most important section of these Terms.',
    sections: [
      {
        id: 'who-we-are',
        title: '1. Who We Are',
        content: [
          'GapZero ("we", "us", "our") is an AI-powered career intelligence platform operated by [Company Name], registered at [Company Address]. We provide career analysis, skill gap assessments, CV optimisation, and career coaching tools powered by artificial intelligence.',
          'These Terms & Conditions ("Terms") govern your access to and use of the GapZero website at gapzero.app and all associated services (the "Platform"). By using the Platform, you confirm that you are at least 16 years old and have the legal capacity to enter into these Terms.',
        ],
      },
      {
        id: 'what-we-do',
        title: '2. What GapZero Does',
        content: [
          'GapZero is a career guidance tool. You upload your CV, optionally a LinkedIn PDF export and a job description, and our platform uses AI (Anthropic\'s Claude) to generate personalised outputs including:',
          '• Career fit scores and gap analysis',
          '• Skill gap assessments and role recommendations',
          '• Salary range benchmarks for your target role and country',
          '• ATS (Applicant Tracking System) keyword and format scoring',
          '• CV rewrite suggestions and optimised CV drafts',
          '• Cover letter drafts',
          '• GitHub profile assessments (if you provide a GitHub URL)',
          '• Career coaching responses via the Career Coach chat',
          '• 30/90/365-day action plans',
          'GapZero is a guidance tool, not a professional service. Nothing on this platform constitutes professional career consulting, legal advice, financial advice, or an employment guarantee.',
        ],
      },
      {
        id: 'ai-disclaimer',
        title: '3. AI-Generated Content — Please Read This',
        highlight: true,
        highlightLabel: 'This is the most important section of these Terms.',
        content: [
          'Everything GapZero generates is produced by an AI system (Anthropic Claude) making probabilistic inferences based on your input. This includes, without limitation: fit scores, skill gap assessments, salary ranges, role recommendations, ATS scores, CV suggestions, optimised CV drafts, cover letters, GitHub assessments, career coaching responses, and action plans.',
          'AI outputs are best-effort estimates — not facts. They may contain inaccuracies, outdated information, oversimplifications, or in rare cases outright errors ("hallucinations"). Salary data is derived from publicly available benchmarks and may not reflect your local market, specific employer, or current conditions. Fit scores are probabilistic assessments, not guarantees of hiring success.',
          'You must apply your own judgment. GapZero outputs are starting points for your thinking — not final answers. Before making any career decision (changing jobs, declining an offer, pursuing a qualification, or submitting a CV), verify the information through independent research, speak with human professionals, and use your own knowledge of your situation.',
          'GapZero is not liable for outcomes. To the maximum extent permitted by applicable law, GapZero and its operators accept no liability for employment decisions, career outcomes, missed opportunities, financial loss, or any other consequence arising from your use of AI-generated content on this Platform.',
          '[note] EU users — AI Act notice: GapZero provides AI-assisted career decision support in the employment domain. Consistent with EU AI Act requirements for human oversight, all outputs are tools to assist your decision-making. No output constitutes an automated decision with legal or similarly significant effects under GDPR Article 22 — a human (you) makes every career decision. You are always in control.',
        ],
      },
      {
        id: 'accounts',
        title: '4. Your Account',
        content: [
          'To save analyses and access your history, you create an account using your email address. You are responsible for:',
          '• Keeping your login credentials secure and confidential',
          '• All activity that occurs under your account',
          '• Providing accurate information when using the Platform — garbage in, garbage out applies especially to AI analysis',
          '• Notifying us immediately if you suspect unauthorised access to your account',
          'You may delete your account at any time from your dashboard settings. Deletion permanently removes your analyses, saved results, and profile data from our systems, subject to our data retention policy.',
        ],
      },
      {
        id: 'acceptable-use',
        title: '5. Acceptable Use',
        content: [
          'You agree not to:',
          '• Scrape, crawl, or systematically extract data from the Platform by automated means',
          '• Reverse engineer, decompile, or attempt to extract the Platform\'s source code or AI prompts',
          '• Upload content you do not have the right to share (e.g., another person\'s CV without their consent)',
          '• Use the Platform to screen, discriminate against, or profile job candidates if you are an employer — the Platform is designed for individual career development, not hiring decisions',
          '• Attempt to circumvent usage quotas or access controls',
          '• Use the Platform for any unlawful purpose or in violation of applicable laws',
          '• Introduce malware, viruses, or any other harmful code',
          '• Represent AI-generated outputs as your own original professional work without disclosure where required',
          'We reserve the right to suspend or terminate accounts that violate these rules, at our discretion and without prior notice where immediate action is warranted.',
        ],
      },
      {
        id: 'billing',
        title: '6. Subscriptions & Billing',
        content: [
          'GapZero offers a Free tier and a Pro subscription (available weekly at $9.99/week or monthly at $29.99/month, prices inclusive of applicable taxes where required by law). Prices are subject to change with 30 days\' notice.',
          'Billing: Pro subscriptions are billed in advance on a recurring basis. Payments are processed by Stripe. You authorise us to charge your payment method on each billing cycle.',
          'Cancellation: You may cancel your Pro subscription at any time from your account settings. Cancellation takes effect at the end of your current billing period — you retain Pro access until then. We do not provide partial-period refunds.',
          'Refund policy: If you are unhappy with your first Pro subscription payment, contact us within 7 days of the charge at [support@gapzero.app] for a full refund. After 7 days, or after a second billing cycle, refunds are issued at our discretion. This does not affect your statutory rights under applicable consumer protection law.',
          '[note] UK consumers: Under the Consumer Rights Act 2015 and the Consumer Contracts Regulations 2013, you have a 14-day cooling-off period for digital services unless you have already consumed the service. By requesting your first analysis, you acknowledge that the service has commenced and consent to waiving the cooling-off right for that analysis.',
          '[note] EU consumers: Under the EU Consumer Rights Directive (2011/83/EU), the same 14-day right of withdrawal applies. By initiating your first analysis, you consent to immediate service delivery and waive the right of withdrawal in respect of that delivery.',
        ],
      },
      {
        id: 'ip',
        title: '7. Intellectual Property',
        content: [
          'Your data is yours. You own your CV, LinkedIn export, and any other content you upload. By uploading content to GapZero, you grant us a limited, non-exclusive, worldwide licence to process that content solely for the purpose of providing the service to you.',
          'AI-generated outputs (fit scores, career plans, cover letters, CV drafts, etc.) are licensed to you for personal, non-commercial use. You may use them in your own job search, career planning, and CV development. You may not resell, redistribute, or represent them as a service you offer to others.',
          'The Platform itself — including its design, code, prompts, knowledge base, and brand — belongs to GapZero. Nothing in these Terms transfers ownership of Platform IP to you.',
        ],
      },
      {
        id: 'liability',
        title: '8. Disclaimers & Limitation of Liability',
        content: [
          'AS IS. The Platform is provided "as is" and "as available" without warranties of any kind, express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement.',
          'No employment guarantee. GapZero makes no representation that using our Platform will result in job offers, salary increases, career advancement, or any other specific outcome.',
          'Limitation of liability. To the fullest extent permitted by law, GapZero\'s total liability to you for any claim arising from or related to these Terms or the Platform shall not exceed the amount you paid to GapZero in the 12 months preceding the claim, or $50, whichever is greater.',
          'We are not liable for indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, goodwill, or career opportunities, even if advised of the possibility of such damages.',
          '[note] Jurisdiction note: Some jurisdictions (including EU member states and the UK under the Consumer Rights Act 2015) do not allow the exclusion of certain warranties or limitations on consumer rights. Nothing in these Terms is intended to exclude rights that cannot be lawfully excluded in your jurisdiction. UK and EU consumers retain all statutory rights under applicable consumer protection law.',
        ],
      },
      {
        id: 'third-parties',
        title: '9. Third-Party Services',
        content: [
          'GapZero relies on the following third-party services to operate:',
          '• Anthropic (Claude API) — processes your CV and job data to generate AI outputs. Anthropic\'s usage policies prohibit using API data to train their models.',
          '• Supabase — stores your account data, analyses, and profile in a hosted database.',
          '• Stripe — processes subscription payments. We do not store your payment card details.',
          '• Vercel — hosts the Platform.',
          'We are not responsible for the actions, content, or availability of these third-party services. Your use of Stripe is subject to Stripe\'s own terms of service.',
        ],
      },
      {
        id: 'termination',
        title: '10. Termination',
        content: [
          'You may stop using the Platform and delete your account at any time. We may suspend or terminate your account if you breach these Terms, engage in fraudulent activity, or if we discontinue the service, with reasonable notice where practicable. If we terminate for cause (e.g., breach of Section 5), no refund will be issued for the current billing period.',
          'On account deletion or termination, your right to access the Platform ceases. Sections 3, 7, 8, and 11 survive termination.',
        ],
      },
      {
        id: 'governing-law',
        title: '11. Governing Law & Dispute Resolution',
        content: [
          'These Terms are governed by the laws of [Governing Jurisdiction — e.g., England & Wales / Delaware, USA]. Any disputes shall first be addressed through good-faith negotiation. If unresolved, disputes shall be submitted to the courts of that jurisdiction, subject to any mandatory consumer protections in your country of residence.',
          '[note] EU users: You may also use the EU Online Dispute Resolution platform at ec.europa.eu/consumers/odr.',
          '[note] US — California users: Nothing in these Terms waives any rights you have under California law, including under the California Consumer Privacy Act (CCPA). See our Privacy Policy for details.',
        ],
      },
      {
        id: 'changes',
        title: '12. Changes to These Terms',
        content: [
          'We may update these Terms from time to time. For material changes, we will provide at least 30 days\' notice by email (if you have an account) or by prominent notice on the Platform before the changes take effect. Continued use of the Platform after the effective date constitutes acceptance of the updated Terms.',
          'We will always keep the current version of these Terms accessible at gapzero.app/terms with the "Last updated" date shown at the top.',
        ],
      },
      {
        id: 'contact-terms',
        title: '13. Contact',
        content: [
          'Questions about these Terms? Contact us at: [legal@gapzero.app] or write to [Company Address].',
        ],
      },
    ],
  },

  // ── ROMÂNĂ ─────────────────────────────────────────────────────────────────
  ro: {
    pageTitle: 'Termeni și Condiții',
    intro: 'Prin crearea unui cont sau utilizarea GapZero, ești de acord cu acești termeni. Te rugăm să îi citești — în special Secțiunea 3 privind conținutul generat de IA, care este cea mai importantă.',
    importantSection: 'Aceasta este cea mai importantă secțiune a acestor Termeni.',
    sections: [
      {
        id: 'who-we-are',
        title: '1. Cine suntem',
        content: [
          'GapZero ("noi", "nouă", "nostru") este o platformă de informații despre carieră bazată pe inteligență artificială, operată de [Denumire Companie], înregistrată la [Adresă Companie]. Oferim analize de carieră, evaluări ale lacunelor de competențe, optimizare CV și instrumente de coaching de carieră bazate pe inteligență artificială.',
          'Acești Termeni și Condiții ("Termenii") reglementează accesul și utilizarea site-ului GapZero de la gapzero.app și a tuturor serviciilor asociate ("Platforma"). Prin utilizarea Platformei, confirmi că ai cel puțin 16 ani și că ai capacitatea legală de a accepta acești Termeni.',
        ],
      },
      {
        id: 'what-we-do',
        title: '2. Ce face GapZero',
        content: [
          'GapZero este un instrument de orientare în carieră. Încarci CV-ul tău, opțional un export PDF LinkedIn și o descriere de post, iar platforma noastră utilizează IA (Claude de la Anthropic) pentru a genera rezultate personalizate, inclusiv:',
          '• Scoruri de potrivire pentru carieră și analiză a lacunelor',
          '• Evaluări ale lacunelor de competențe și recomandări de roluri',
          '• Repere salariale pentru rolul tău țintă și țara ta',
          '• Scoruri ATS (Applicant Tracking System) de cuvinte cheie și format',
          '• Sugestii de rescrierea CV-ului și variante optimizate',
          '• Scrisori de intenție',
          '• Evaluări ale profilului GitHub (dacă furnizezi un URL GitHub)',
          '• Răspunsuri de coaching de carieră prin chat',
          '• Planuri de acțiune pe 30/90/365 de zile',
          'GapZero este un instrument de orientare, nu un serviciu profesional. Nimic de pe această platformă nu constituie consultanță profesională în carieră, consiliere juridică, consiliere financiară sau garanție de angajare.',
        ],
      },
      {
        id: 'ai-disclaimer',
        title: '3. Conținut generat de IA — Te rugăm să citești',
        highlight: true,
        highlightLabel: 'Aceasta este cea mai importantă secțiune a acestor Termeni.',
        content: [
          'Tot ceea ce generează GapZero este produs de un sistem IA (Anthropic Claude) care face inferențe probabilistice pe baza datelor introduse de tine. Aceasta include, fără limitare: scoruri de potrivire, evaluări ale lacunelor de competențe, intervale salariale, recomandări de roluri, scoruri ATS, sugestii CV, scrisori de intenție, evaluări GitHub, răspunsuri de coaching și planuri de acțiune.',
          'Rezultatele IA sunt estimări orientative — nu fapte. Pot conține inexactități, informații depășite, simplificări excesive sau, în cazuri rare, erori flagrante ("halucinații"). Datele salariale provin din repere disponibile public și pot să nu reflecte piața ta locală, angajatorul specific sau condițiile actuale. Scorurile de potrivire sunt evaluări probabilistice, nu garanții ale succesului în angajare.',
          'Trebuie să îți folosești propriul raționament. Rezultatele GapZero sunt puncte de plecare pentru gândirea ta — nu răspunsuri finale. Înainte de a lua orice decizie de carieră (schimbarea locului de muncă, refuzul unei oferte, urmărirea unei calificări sau trimiterea unui CV), verifică informațiile prin cercetare independentă, consultă profesioniști umani și folosește-ți propria cunoaștere a situației tale.',
          'GapZero nu este răspunzătoare pentru rezultate. În măsura maximă permisă de legea aplicabilă, GapZero și operatorii săi nu acceptă nicio răspundere pentru decizii de angajare, rezultate în carieră, oportunități ratate, pierderi financiare sau orice altă consecință rezultată din utilizarea conținutului generat de IA pe această Platformă.',
          '[note] Utilizatori UE — Notificare conform Actului AI: GapZero oferă suport de luare a deciziilor de carieră asistat de IA în domeniul ocupării forței de muncă. În conformitate cu cerințele de supraveghere umană ale Actului AI al UE, toate rezultatele sunt instrumente pentru a-ți asista luarea deciziilor. Niciun rezultat nu constituie o decizie automată cu efecte juridice sau similare în temeiul Articolului 22 din RGPD — tu (un om) iei fiecare decizie de carieră. Ești întotdeauna în control.',
        ],
      },
      {
        id: 'accounts',
        title: '4. Contul tău',
        content: [
          'Pentru a salva analizele și a accesa istoricul tău, îți creezi un cont cu adresa de email. Ești responsabil pentru:',
          '• Păstrarea în siguranță a datelor de conectare',
          '• Toate activitățile care au loc în contul tău',
          '• Furnizarea de informații corecte — calitatea analizei depinde direct de calitatea datelor introduse',
          '• Notificarea noastră imediată dacă suspectezi acces neautorizat la contul tău',
          'Poți șterge contul oricând din setările tabloului de bord. Ștergerea elimină permanent analizele, rezultatele salvate și datele de profil, sub rezerva politicii noastre de retenție a datelor.',
        ],
      },
      {
        id: 'acceptable-use',
        title: '5. Utilizare acceptabilă',
        content: [
          'Ești de acord să nu:',
          '• Colectezi date de pe Platformă prin mijloace automate (scraping)',
          '• Decompilezi sau încerci să extragi codul sursă sau prompturile IA ale Platformei',
          '• Încarci conținut la care nu ai dreptul (ex. CV-ul altei persoane fără consimțământul ei)',
          '• Utilizezi Platforma pentru a selecta, discrimina sau profila candidați la angajare — Platforma este concepută pentru dezvoltarea individuală a carierei, nu pentru decizii de angajare',
          '• Încerci să ocolești cotele de utilizare sau controalele de acces',
          '• Utilizezi Platforma în orice scop ilegal sau cu încălcarea legilor aplicabile',
          '• Introduci malware, viruși sau orice alt cod dăunător',
          '• Prezinți rezultatele generate de IA ca lucrare profesională originală proprie, fără divulgare, acolo unde este necesar',
          'Ne rezervăm dreptul de a suspenda sau termina conturile care încalcă aceste reguli, la discreția noastră și fără notificare prealabilă acolo unde acțiunea imediată este justificată.',
        ],
      },
      {
        id: 'billing',
        title: '6. Abonamente și Facturare',
        content: [
          'GapZero oferă un nivel Gratuit și un abonament Pro (disponibil săptămânal la 9,99$/săptămână sau lunar la 29,99$/lună, prețuri incluzând taxele aplicabile acolo unde legea o impune). Prețurile pot fi modificate cu 30 de zile preaviz.',
          'Facturare: Abonamentele Pro sunt facturate în avans, pe bază recurentă. Plățile sunt procesate de Stripe. Autorizezi perceperea de pe metoda ta de plată la fiecare ciclu de facturare.',
          'Anulare: Poți anula abonamentul Pro oricând din setările contului. Anularea intră în vigoare la sfârșitul perioadei de facturare curente — reții accesul Pro până atunci. Nu oferim rambursări parțiale.',
          'Politica de rambursare: Dacă ești nemulțumit de prima plată Pro, contactează-ne în 7 zile de la tranzacție la [support@gapzero.app] pentru rambursare integrală. După 7 zile sau după un al doilea ciclu de facturare, rambursările se fac la discreția noastră. Aceasta nu afectează drepturile tale legale conform legislației aplicabile privind protecția consumatorilor.',
          '[note] Consumatori din UE: Conform Directivei UE privind drepturile consumatorilor (2011/83/UE), ai un drept de retragere de 14 zile. Prin inițierea primei analize, îți dai consimțământul pentru livrarea imediată a serviciului și renunți la dreptul de retragere în ceea ce privește acea livrare.',
        ],
      },
      {
        id: 'ip',
        title: '7. Proprietate Intelectuală',
        content: [
          'Datele tale îți aparțin. Deții CV-ul, exportul LinkedIn și orice alt conținut pe care îl încarci. Prin încărcarea conținutului pe GapZero, ne acorzi o licență limitată, neexclusivă, la nivel mondial, de a procesa acel conținut exclusiv în scopul furnizării serviciului.',
          'Rezultatele generate de IA (scoruri de potrivire, planuri de carieră, scrisori de intenție, variante de CV etc.) îți sunt licențiate pentru uz personal, necomercial. Le poți folosi în propria căutare de locuri de muncă, planificarea carierei și dezvoltarea CV-ului. Nu le poți revinde, redistribui sau prezenta ca serviciu oferit altora.',
          'Platforma în sine — inclusiv designul, codul, prompturile, baza de cunoștințe și marca — aparține GapZero. Nimic din acești Termeni nu transferă proprietatea IP a Platformei către tine.',
        ],
      },
      {
        id: 'liability',
        title: '8. Declinarea Răspunderii și Limitarea Răspunderii',
        content: [
          'CA ATARE. Platforma este furnizată "ca atare" și "conform disponibilității", fără garanții de niciun fel, exprese sau implicite.',
          'Fără garanție de angajare. GapZero nu garantează că utilizarea Platformei va duce la oferte de muncă, creșteri salariale, avansare în carieră sau orice alt rezultat specific.',
          'Limitarea răspunderii. În măsura maximă permisă de lege, răspunderea totală a GapZero față de tine pentru orice cerere nu va depăși suma plătită de tine în ultimele 12 luni, sau 50 USD, oricare este mai mare.',
          'Nu suntem răspunzători pentru daune indirecte, incidentale, speciale, consecutive sau punitive, inclusiv pierderea de profituri, date, reputație sau oportunități de carieră.',
          '[note] Notă jurisdicțională: Unele jurisdicții, inclusiv statele membre UE și Marea Britanie conform Consumer Rights Act 2015, nu permit excluderea anumitor garanții sau limitări ale drepturilor consumatorilor. Nimic din acești Termeni nu intenționează să excludă drepturile care nu pot fi excluse legal în jurisdicția ta.',
        ],
      },
      {
        id: 'third-parties',
        title: '9. Servicii Terțe',
        content: [
          'GapZero se bazează pe următoarele servicii terțe pentru a funcționa:',
          '• Anthropic (API Claude) — procesează datele CV-ului și ale postului pentru a genera rezultate IA. Politicile Anthropic interzic utilizarea datelor API pentru antrenarea modelelor.',
          '• Supabase — stochează datele contului, analizele și profilul tău.',
          '• Stripe — procesează plățile abonamentelor. Nu stocăm datele cardului tău de plată.',
          '• Vercel — găzduiește Platforma.',
          'Nu suntem responsabili pentru acțiunile, conținutul sau disponibilitatea acestor servicii terțe.',
        ],
      },
      {
        id: 'termination',
        title: '10. Încetare',
        content: [
          'Poți opri utilizarea Platformei și șterge contul oricând. Putem suspenda sau termina contul tău dacă încalci acești Termeni, te implici în activități frauduloase sau dacă discontinuăm serviciul, cu notificare rezonabilă acolo unde este posibil.',
          'La ștergerea sau terminarea contului, dreptul tău de acces la Platformă încetează. Secțiunile 3, 7, 8 și 11 supraviețuiesc terminării.',
        ],
      },
      {
        id: 'governing-law',
        title: '11. Legea Aplicabilă și Soluționarea Litigiilor',
        content: [
          'Acești Termeni sunt guvernați de legile din [Jurisdicție — ex. Anglia și Țara Galilor / Delaware, SUA]. Litigiile vor fi abordate mai întâi prin negociere de bună credință. Dacă rămân nerezolvate, vor fi supuse instanțelor din acea jurisdicție, sub rezerva oricăror protecții obligatorii ale consumatorilor din țara ta de reședință.',
          '[note] Utilizatori UE: Poți utiliza platforma UE de soluționare online a litigiilor la ec.europa.eu/consumers/odr.',
        ],
      },
      {
        id: 'changes',
        title: '12. Modificări ale Termenilor',
        content: [
          'Putem actualiza acești Termeni periodic. Pentru modificări semnificative, vom oferi cel puțin 30 de zile preaviz prin email (dacă ai cont) sau prin notificare prominentă pe Platformă înainte ca modificările să intre în vigoare. Continuarea utilizării Platformei după data efectivă constituie acceptarea Termenilor actualizați.',
        ],
      },
      {
        id: 'contact-terms',
        title: '13. Contact',
        content: [
          'Întrebări despre acești Termeni? Contactează-ne la: [legal@gapzero.app] sau scrie la [Adresă Companie].',
        ],
      },
    ],
  },

  // ── DEUTSCH ────────────────────────────────────────────────────────────────
  de: {
    pageTitle: 'Allgemeine Geschäftsbedingungen',
    intro: 'Durch die Erstellung eines Kontos oder die Nutzung von GapZero stimmen Sie diesen Bedingungen zu. Bitte lesen Sie sie — insbesondere Abschnitt 3 zu KI-generierten Inhalten, dem wichtigsten Teil.',
    importantSection: 'Dies ist der wichtigste Abschnitt dieser AGB.',
    sections: [
      {
        id: 'who-we-are',
        title: '1. Wer wir sind',
        content: [
          'GapZero ("wir", "uns", "unser") ist eine KI-gestützte Karriere-Intelligenzplattform, betrieben von [Unternehmensname], eingetragen unter [Unternehmensadresse]. Wir bieten Karriereanalysen, Kompetenzlückenanalysen, Lebenslauf-Optimierung und KI-gestütztes Karriere-Coaching an.',
          'Diese Allgemeinen Geschäftsbedingungen ("AGB") regeln Ihren Zugang zur und Nutzung der GapZero-Website unter gapzero.app und aller zugehörigen Dienste ("Plattform"). Durch die Nutzung der Plattform bestätigen Sie, dass Sie mindestens 16 Jahre alt sind und die Rechtsfähigkeit besitzen, diese AGB einzugehen.',
        ],
      },
      {
        id: 'what-we-do',
        title: '2. Was GapZero macht',
        content: [
          'GapZero ist ein Karriereberatungsinstrument. Sie laden Ihren Lebenslauf hoch, optional einen LinkedIn-PDF-Export und eine Stellenbeschreibung, und unsere Plattform nutzt KI (Anthropics Claude), um personalisierte Ausgaben zu erstellen, darunter:',
          '• Karriere-Eignungswerte und Lückenanalysen',
          '• Kompetenzlückenanalysen und Rollenempfehlungen',
          '• Gehaltsrichtwerte für Ihre Zielstelle und Ihr Land',
          '• ATS-Schlüsselwort- und Formatbewertungen',
          '• Vorschläge zur Überarbeitung und optimierte Lebenslauf-Entwürfe',
          '• Anschreiben-Entwürfe',
          '• GitHub-Profilbewertungen (wenn Sie eine GitHub-URL angeben)',
          '• Karriere-Coaching-Antworten im Chat',
          '• 30/90/365-Tage-Aktionspläne',
          'GapZero ist ein Beratungsinstrument, kein professioneller Dienst. Nichts auf dieser Plattform stellt professionelle Karriereberatung, Rechtsberatung, Finanzberatung oder eine Beschäftigungsgarantie dar.',
        ],
      },
      {
        id: 'ai-disclaimer',
        title: '3. KI-generierte Inhalte — Bitte lesen',
        highlight: true,
        highlightLabel: 'Dies ist der wichtigste Abschnitt dieser AGB.',
        content: [
          'Alles, was GapZero generiert, wird von einem KI-System (Anthropic Claude) erstellt, das probabilistische Schlussfolgerungen auf Basis Ihrer Eingaben zieht. Dies umfasst ohne Einschränkung: Eignungswerte, Kompetenzlückenanalysen, Gehaltsbandbreiten, Rollenempfehlungen, ATS-Bewertungen, Lebenslauf-Vorschläge, Anschreiben, GitHub-Bewertungen, Coaching-Antworten und Aktionspläne.',
          'KI-Ausgaben sind bestmögliche Schätzungen — keine Fakten. Sie können Ungenauigkeiten, veraltete Informationen, Vereinfachungen oder in seltenen Fällen vollständige Fehler ("Halluzinationen") enthalten. Gehaltsdaten basieren auf öffentlich verfügbaren Richtwerten und spiegeln möglicherweise nicht Ihren lokalen Markt, Ihren spezifischen Arbeitgeber oder aktuelle Bedingungen wider.',
          'Sie müssen Ihr eigenes Urteilsvermögen einsetzen. GapZero-Ausgaben sind Ausgangspunkte für Ihre Überlegungen — keine endgültigen Antworten. Bevor Sie Karriereentscheidungen treffen, überprüfen Sie die Informationen durch eigenständige Recherche und konsultieren Sie menschliche Fachleute.',
          'GapZero haftet nicht für Ergebnisse. Im größtmöglichen gesetzlich zulässigen Umfang übernehmen GapZero und seine Betreiber keine Haftung für Beschäftigungsentscheidungen, Karriereergebnisse, verpasste Chancen, finanzielle Verluste oder sonstige Konsequenzen aus der Nutzung KI-generierter Inhalte.',
          '[note] EU-Nutzer — KI-Verordnung: GapZero stellt KI-gestützte Karriereentscheidungsunterstützung im Beschäftigungsbereich bereit. Gemäß den Anforderungen an menschliche Aufsicht nach der EU-KI-Verordnung sind alle Ausgaben Werkzeuge zur Unterstützung Ihrer Entscheidungsfindung. Keine Ausgabe stellt eine automatisierte Entscheidung mit rechtlicher oder ähnlich bedeutsamer Wirkung gemäß Art. 22 DSGVO dar.',
        ],
      },
      {
        id: 'accounts',
        title: '4. Ihr Konto',
        content: [
          'Um Analysen zu speichern und auf Ihren Verlauf zuzugreifen, erstellen Sie ein Konto mit Ihrer E-Mail-Adresse. Sie sind verantwortlich für:',
          '• Die Sicherheit Ihrer Anmeldedaten',
          '• Alle Aktivitäten, die unter Ihrem Konto stattfinden',
          '• Die Angabe korrekter Informationen — die Qualität der KI-Analyse hängt direkt von der Qualität Ihrer Eingaben ab',
          '• Die sofortige Benachrichtigung bei Verdacht auf unbefugten Zugriff',
          'Sie können Ihr Konto jederzeit in den Dashboard-Einstellungen löschen.',
        ],
      },
      {
        id: 'acceptable-use',
        title: '5. Zulässige Nutzung',
        content: [
          'Sie verpflichten sich, Folgendes zu unterlassen:',
          '• Automatisiertes Scraping oder systematische Datenextraktion von der Plattform',
          '• Dekompilierung oder Versuch, den Quellcode oder KI-Prompts der Plattform zu extrahieren',
          '• Hochladen von Inhalten, zu denen Sie keine Berechtigung haben (z.B. fremde Lebensläufe ohne Zustimmung)',
          '• Nutzung der Plattform zur Bewerberselektion, Diskriminierung oder Profilierung von Stellenbewerbern',
          '• Umgehung von Nutzungskontingenten oder Zugriffskontrollen',
          '• Nutzung der Plattform für rechtswidrige Zwecke',
          '• Einschleusen von Malware, Viren oder anderen Schadcodes',
          'Wir behalten uns vor, Konten, die gegen diese Regeln verstoßen, nach eigenem Ermessen zu sperren oder zu kündigen.',
        ],
      },
      {
        id: 'billing',
        title: '6. Abonnements und Abrechnung',
        content: [
          'GapZero bietet eine kostenlose Stufe und ein Pro-Abonnement an (wöchentlich für 9,99 $/Woche oder monatlich für 29,99 $/Monat, Preise ggf. zzgl. gesetzlicher Steuern). Preisänderungen werden mit 30 Tagen Vorankündigung mitgeteilt.',
          'Abrechnung: Pro-Abonnements werden im Voraus auf wiederkehrender Basis abgerechnet. Zahlungen werden über Stripe abgewickelt.',
          'Kündigung: Sie können Ihr Pro-Abonnement jederzeit in Ihren Kontoeinstellungen kündigen. Die Kündigung wird zum Ende des aktuellen Abrechnungszeitraums wirksam.',
          'Erstattungsrichtlinie: Bei Unzufriedenheit mit Ihrer ersten Pro-Zahlung kontaktieren Sie uns innerhalb von 7 Tagen unter [support@gapzero.app] für eine vollständige Erstattung. Dies berührt nicht Ihre gesetzlichen Rechte.',
        ],
      },
      {
        id: 'ip',
        title: '7. Geistiges Eigentum',
        content: [
          'Ihre Daten gehören Ihnen. Sie behalten das Eigentum an Ihrem Lebenslauf, LinkedIn-Export und anderen hochgeladenen Inhalten.',
          'KI-generierte Ausgaben werden Ihnen für den persönlichen, nicht-kommerziellen Gebrauch lizenziert. Sie dürfen sie nicht weiterverkaufen oder als eigenen Dienst anbieten.',
          'Die Plattform selbst — einschließlich Design, Code, Prompts, Wissensbasis und Marke — gehört GapZero.',
        ],
      },
      {
        id: 'liability',
        title: '8. Haftungsausschluss und Haftungsbeschränkung',
        content: [
          'WIE BESEHEN. Die Plattform wird "wie besehen" und "wie verfügbar" ohne Gewährleistungen jeglicher Art bereitgestellt.',
          'Keine Beschäftigungsgarantie. GapZero gibt keine Zusicherung, dass die Nutzung der Plattform zu Stellenangeboten, Gehaltserhöhungen oder Karrierefortschritten führt.',
          'Haftungsbeschränkung. Die Gesamthaftung von GapZero übersteigt nicht den von Ihnen in den vorangegangenen 12 Monaten gezahlten Betrag, mindestens jedoch 50 USD.',
          '[note] Hinweis: Einige Rechtsordnungen, einschließlich EU-Mitgliedstaaten, lassen den Ausschluss bestimmter Gewährleistungen nicht zu. Diese AGB schränken keine Verbraucherrechte ein, die gesetzlich nicht ausgeschlossen werden können.',
        ],
      },
      {
        id: 'third-parties',
        title: '9. Drittanbieterdienste',
        content: [
          'GapZero nutzt folgende Drittanbieterdienste:',
          '• Anthropic (Claude API) — verarbeitet Lebenslauf- und Stellendaten zur Erstellung von KI-Ausgaben.',
          '• Supabase — speichert Kontodaten, Analysen und Profil.',
          '• Stripe — verarbeitet Abonnementzahlungen. Wir speichern keine Kartendaten.',
          '• Vercel — betreibt die Plattform.',
        ],
      },
      {
        id: 'termination',
        title: '10. Kündigung',
        content: [
          'Sie können die Nutzung der Plattform jederzeit einstellen und Ihr Konto löschen. Wir können Ihr Konto bei Verstoß gegen diese AGB oder bei betrügerischen Aktivitäten sperren oder kündigen.',
        ],
      },
      {
        id: 'governing-law',
        title: '11. Anwendbares Recht und Streitbeilegung',
        content: [
          'Diese AGB unterliegen dem Recht von [Rechtsordnung — z.B. England und Wales / Delaware, USA]. Streitigkeiten werden zunächst durch gütliche Einigung beigelegt.',
          '[note] EU-Nutzer: Sie können auch die EU-Plattform für Online-Streitbeilegung unter ec.europa.eu/consumers/odr nutzen.',
        ],
      },
      {
        id: 'changes',
        title: '12. Änderungen dieser AGB',
        content: [
          'Bei wesentlichen Änderungen informieren wir Sie mindestens 30 Tage vorher per E-Mail oder durch einen deutlichen Hinweis auf der Plattform. Die weitere Nutzung nach dem Inkrafttreten gilt als Zustimmung.',
        ],
      },
      {
        id: 'contact-terms',
        title: '13. Kontakt',
        content: [
          'Fragen zu diesen AGB? Kontaktieren Sie uns unter: [legal@gapzero.app] oder schreiben Sie an [Unternehmensadresse].',
        ],
      },
    ],
  },

  // ── FRANÇAIS ───────────────────────────────────────────────────────────────
  fr: {
    pageTitle: 'Conditions Générales d\'Utilisation',
    intro: 'En créant un compte ou en utilisant GapZero, vous acceptez ces conditions. Veuillez les lire attentivement — en particulier la Section 3 relative aux contenus générés par l\'IA, qui est la partie la plus importante.',
    importantSection: 'Il s\'agit de la section la plus importante de ces CGU.',
    sections: [
      {
        id: 'who-we-are',
        title: '1. Qui sommes-nous',
        content: [
          'GapZero ("nous", "notre") est une plateforme d\'intelligence de carrière alimentée par l\'IA, exploitée par [Nom de la Société], immatriculée à [Adresse de la Société]. Nous proposons des analyses de carrière, des évaluations des lacunes de compétences, l\'optimisation de CV et des outils de coaching de carrière basés sur l\'intelligence artificielle.',
          'Les présentes Conditions Générales d\'Utilisation ("CGU") régissent votre accès au site GapZero sur gapzero.app et à tous les services associés ("la Plateforme"). En utilisant la Plateforme, vous confirmez avoir au moins 16 ans et la capacité juridique d\'accepter ces CGU.',
        ],
      },
      {
        id: 'what-we-do',
        title: '2. Ce que fait GapZero',
        content: [
          'GapZero est un outil d\'orientation professionnelle. Vous téléchargez votre CV, éventuellement un export PDF LinkedIn et une offre d\'emploi, et notre plateforme utilise l\'IA (Claude d\'Anthropic) pour générer des résultats personnalisés, notamment :',
          '• Scores d\'adéquation professionnelle et analyse des lacunes',
          '• Évaluations des lacunes de compétences et recommandations de rôles',
          '• Benchmarks de rémunération pour votre poste cible et votre pays',
          '• Scores ATS (Applicant Tracking System) de mots-clés et de format',
          '• Suggestions de réécriture de CV et versions optimisées',
          '• Lettres de motivation',
          '• Évaluations du profil GitHub (si vous fournissez une URL GitHub)',
          '• Réponses de coaching de carrière via le chat',
          '• Plans d\'action sur 30/90/365 jours',
          'GapZero est un outil d\'orientation, pas un service professionnel. Rien sur cette plateforme ne constitue un conseil professionnel en carrière, un conseil juridique, un conseil financier ou une garantie d\'emploi.',
        ],
      },
      {
        id: 'ai-disclaimer',
        title: '3. Contenus générés par l\'IA — Veuillez lire attentivement',
        highlight: true,
        highlightLabel: 'Il s\'agit de la section la plus importante de ces CGU.',
        content: [
          'Tout ce que GapZero génère est produit par un système d\'IA (Anthropic Claude) effectuant des inférences probabilistes sur la base de vos données. Cela inclut, sans s\'y limiter : les scores d\'adéquation, les évaluations des lacunes de compétences, les fourchettes salariales, les recommandations de rôles, les scores ATS, les suggestions de CV, les lettres de motivation, les évaluations GitHub, les réponses de coaching et les plans d\'action.',
          'Les résultats de l\'IA sont des estimations au meilleur des connaissances — pas des faits. Ils peuvent contenir des inexactitudes, des informations obsolètes, des simplifications ou, dans de rares cas, des erreurs flagrantes ("hallucinations"). Les données salariales sont issues de benchmarks publics et peuvent ne pas refléter votre marché local, votre employeur spécifique ou les conditions actuelles.',
          'Vous devez exercer votre propre jugement. Les résultats de GapZero sont des points de départ pour votre réflexion — pas des réponses définitives. Avant toute décision de carrière, vérifiez les informations par des recherches indépendantes et consultez des professionnels.',
          'GapZero n\'est pas responsable des résultats. Dans toute la mesure permise par la loi applicable, GapZero et ses opérateurs déclinent toute responsabilité pour les décisions d\'emploi, les résultats de carrière, les opportunités manquées, les pertes financières ou toute autre conséquence découlant de l\'utilisation de contenus générés par l\'IA.',
          '[note] Utilisateurs UE — Notice Règlement IA : GapZero fournit un soutien à la prise de décision de carrière assisté par IA dans le domaine de l\'emploi. Conformément aux exigences de supervision humaine du Règlement européen sur l\'IA, tous les résultats sont des outils pour assister votre prise de décision. Aucun résultat ne constitue une décision automatisée au sens de l\'article 22 du RGPD.',
        ],
      },
      {
        id: 'accounts',
        title: '4. Votre compte',
        content: [
          'Pour sauvegarder vos analyses et accéder à votre historique, vous créez un compte avec votre adresse e-mail. Vous êtes responsable de :',
          '• La sécurité de vos identifiants de connexion',
          '• Toutes les activités effectuées sous votre compte',
          '• La fourniture d\'informations exactes — la qualité de l\'analyse dépend directement de la qualité des données fournies',
          '• Nous notifier immédiatement en cas d\'accès non autorisé suspecté',
          'Vous pouvez supprimer votre compte à tout moment depuis les paramètres de votre tableau de bord.',
        ],
      },
      {
        id: 'acceptable-use',
        title: '5. Utilisation acceptable',
        content: [
          'Vous vous engagez à ne pas :',
          '• Extraire des données de la Plateforme par des moyens automatisés (scraping)',
          '• Décompiler ou tenter d\'extraire le code source ou les prompts IA de la Plateforme',
          '• Télécharger du contenu que vous n\'êtes pas autorisé à partager',
          '• Utiliser la Plateforme pour sélectionner, discriminer ou profiler des candidats à l\'emploi',
          '• Tenter de contourner les quotas d\'utilisation ou les contrôles d\'accès',
          '• Utiliser la Plateforme à des fins illégales',
          '• Introduire des logiciels malveillants ou tout autre code nuisible',
          'Nous nous réservons le droit de suspendre ou de résilier les comptes qui enfreignent ces règles.',
        ],
      },
      {
        id: 'billing',
        title: '6. Abonnements et Facturation',
        content: [
          'GapZero propose un niveau Gratuit et un abonnement Pro (disponible à la semaine à 9,99 $/semaine ou au mois à 29,99 $/mois, prix TTC selon la législation applicable). Les prix sont susceptibles d\'être modifiés avec un préavis de 30 jours.',
          'Facturation : Les abonnements Pro sont facturés à l\'avance sur une base récurrente. Les paiements sont traités par Stripe.',
          'Résiliation : Vous pouvez résilier votre abonnement Pro à tout moment depuis les paramètres de votre compte, avec effet à la fin de la période de facturation en cours.',
          'Politique de remboursement : En cas d\'insatisfaction avec votre premier paiement Pro, contactez-nous dans les 7 jours à [support@gapzero.app] pour un remboursement intégral. Cela ne porte pas atteinte à vos droits légaux.',
          '[note] Consommateurs UE : Conformément à la Directive européenne sur les droits des consommateurs (2011/83/UE), vous bénéficiez d\'un droit de rétractation de 14 jours. En initiant votre première analyse, vous consentez à la fourniture immédiate du service et renoncez à ce droit pour cette prestation.',
        ],
      },
      {
        id: 'ip',
        title: '7. Propriété Intellectuelle',
        content: [
          'Vos données vous appartiennent. Vous conservez la propriété de votre CV, de votre export LinkedIn et de tout autre contenu téléchargé.',
          'Les résultats générés par l\'IA vous sont licenciés pour un usage personnel et non commercial. Vous ne pouvez pas les revendre ni les proposer comme service à des tiers.',
          'La Plateforme elle-même — y compris son design, code, prompts, base de connaissances et marque — appartient à GapZero.',
        ],
      },
      {
        id: 'liability',
        title: '8. Exclusions et Limitations de Responsabilité',
        content: [
          'EN L\'ÉTAT. La Plateforme est fournie "en l\'état" et "selon disponibilité" sans garantie d\'aucune sorte.',
          'Aucune garantie d\'emploi. GapZero ne garantit pas que l\'utilisation de la Plateforme aboutira à des offres d\'emploi, des augmentations de salaire ou une évolution de carrière.',
          'Limitation de responsabilité. La responsabilité totale de GapZero ne dépassera pas le montant que vous avez payé au cours des 12 derniers mois, ou 50 USD, selon le montant le plus élevé.',
          '[note] Note juridictionnelle : Certaines législations, notamment celles des États membres de l\'UE, ne permettent pas l\'exclusion de certaines garanties ou la limitation des droits des consommateurs. Ces CGU ne sauraient réduire les droits qui ne peuvent légalement être exclus.',
        ],
      },
      {
        id: 'third-parties',
        title: '9. Services Tiers',
        content: [
          'GapZero s\'appuie sur les services tiers suivants :',
          '• Anthropic (API Claude) — traite les données de CV et d\'offre d\'emploi pour générer les résultats IA.',
          '• Supabase — stocke les données de compte, les analyses et le profil.',
          '• Stripe — traite les paiements d\'abonnement. Nous ne stockons pas vos données de carte.',
          '• Vercel — héberge la Plateforme.',
        ],
      },
      {
        id: 'termination',
        title: '10. Résiliation',
        content: [
          'Vous pouvez cesser d\'utiliser la Plateforme et supprimer votre compte à tout moment. Nous pouvons suspendre ou résilier votre compte en cas de violation de ces CGU ou d\'activité frauduleuse.',
        ],
      },
      {
        id: 'governing-law',
        title: '11. Droit Applicable et Résolution des Litiges',
        content: [
          'Ces CGU sont régies par le droit de [Juridiction — ex. Angleterre et Pays de Galles / Delaware, États-Unis]. Les litiges seront d\'abord traités par négociation de bonne foi.',
          '[note] Utilisateurs UE : Vous pouvez également utiliser la plateforme européenne de règlement en ligne des litiges sur ec.europa.eu/consumers/odr.',
        ],
      },
      {
        id: 'changes',
        title: '12. Modifications des CGU',
        content: [
          'Pour les modifications importantes, nous vous informerons au moins 30 jours à l\'avance par e-mail ou par un avis prominent sur la Plateforme.',
        ],
      },
      {
        id: 'contact-terms',
        title: '13. Contact',
        content: [
          'Questions sur ces CGU ? Contactez-nous à : [legal@gapzero.app] ou écrivez à [Adresse de la Société].',
        ],
      },
    ],
  },

  // ── ESPAÑOL ────────────────────────────────────────────────────────────────
  es: {
    pageTitle: 'Términos y Condiciones',
    intro: 'Al crear una cuenta o usar GapZero, aceptas estos términos. Por favor, léelos — especialmente la Sección 3 sobre el contenido generado por IA, que es la parte más importante.',
    importantSection: 'Esta es la sección más importante de estos Términos.',
    sections: [
      {
        id: 'who-we-are',
        title: '1. Quiénes somos',
        content: [
          'GapZero ("nosotros", "nos", "nuestro") es una plataforma de inteligencia profesional impulsada por IA, operada por [Nombre de la Empresa], registrada en [Dirección de la Empresa]. Ofrecemos análisis de carrera, evaluaciones de brechas de competencias, optimización de CV y herramientas de coaching de carrera basadas en inteligencia artificial.',
          'Estos Términos y Condiciones ("Términos") rigen tu acceso y uso del sitio web de GapZero en gapzero.app y todos los servicios asociados ("la Plataforma"). Al usar la Plataforma, confirmas que tienes al menos 16 años y capacidad legal para aceptar estos Términos.',
        ],
      },
      {
        id: 'what-we-do',
        title: '2. Qué hace GapZero',
        content: [
          'GapZero es una herramienta de orientación profesional. Subes tu CV, opcionalmente un PDF de exportación de LinkedIn y una descripción de trabajo, y nuestra plataforma usa IA (Claude de Anthropic) para generar resultados personalizados, incluyendo:',
          '• Puntuaciones de idoneidad profesional y análisis de brechas',
          '• Evaluaciones de brechas de competencias y recomendaciones de roles',
          '• Benchmarks salariales para tu puesto objetivo y país',
          '• Puntuaciones ATS de palabras clave y formato',
          '• Sugerencias de reescritura de CV y versiones optimizadas',
          '• Borradores de cartas de presentación',
          '• Evaluaciones del perfil de GitHub (si proporcionas una URL de GitHub)',
          '• Respuestas de coaching de carrera vía chat',
          '• Planes de acción de 30/90/365 días',
          'GapZero es una herramienta de orientación, no un servicio profesional. Nada en esta plataforma constituye asesoramiento profesional en carrera, asesoramiento legal, financiero o una garantía de empleo.',
        ],
      },
      {
        id: 'ai-disclaimer',
        title: '3. Contenido Generado por IA — Por Favor Lea Esto',
        highlight: true,
        highlightLabel: 'Esta es la sección más importante de estos Términos.',
        content: [
          'Todo lo que GapZero genera es producido por un sistema de IA (Anthropic Claude) que realiza inferencias probabilísticas basadas en tus datos. Esto incluye, sin limitación: puntuaciones de idoneidad, evaluaciones de brechas de competencias, rangos salariales, recomendaciones de roles, puntuaciones ATS, sugerencias de CV, cartas de presentación, evaluaciones de GitHub, respuestas de coaching y planes de acción.',
          'Los resultados de IA son estimaciones de mejor esfuerzo — no hechos. Pueden contener imprecisiones, información desactualizada, simplificaciones o, en casos raros, errores flagrantes ("alucinaciones"). Los datos salariales provienen de benchmarks públicos y pueden no reflejar tu mercado local, empleador específico o condiciones actuales.',
          'Debes aplicar tu propio criterio. Los resultados de GapZero son puntos de partida para tu reflexión — no respuestas definitivas. Antes de tomar cualquier decisión de carrera, verifica la información mediante investigación independiente y consulta a profesionales.',
          'GapZero no es responsable de los resultados. En la máxima medida permitida por la ley aplicable, GapZero y sus operadores no aceptan responsabilidad alguna por decisiones de empleo, resultados profesionales, oportunidades perdidas, pérdidas financieras ni cualquier otra consecuencia derivada del uso de contenido generado por IA.',
          '[note] Usuarios de la UE — Aviso Reglamento IA: GapZero proporciona apoyo asistido por IA para la toma de decisiones profesionales en el ámbito del empleo. De conformidad con los requisitos de supervisión humana del Reglamento de IA de la UE, todos los resultados son herramientas para asistir tu toma de decisiones. Ningún resultado constituye una decisión automatizada con efectos jurídicos significativos en el sentido del artículo 22 del RGPD.',
        ],
      },
      {
        id: 'accounts',
        title: '4. Tu Cuenta',
        content: [
          'Para guardar análisis y acceder a tu historial, creas una cuenta con tu correo electrónico. Eres responsable de:',
          '• Mantener la seguridad de tus credenciales de acceso',
          '• Toda la actividad que ocurra en tu cuenta',
          '• Proporcionar información precisa — la calidad del análisis depende directamente de la calidad de los datos introducidos',
          '• Notificarnos inmediatamente si sospechas acceso no autorizado',
          'Puedes eliminar tu cuenta en cualquier momento desde la configuración del panel.',
        ],
      },
      {
        id: 'acceptable-use',
        title: '5. Uso Aceptable',
        content: [
          'Te comprometes a no:',
          '• Extraer datos de la Plataforma mediante medios automatizados (scraping)',
          '• Descompilar o intentar extraer el código fuente o los prompts de IA de la Plataforma',
          '• Cargar contenido al que no tienes derecho (p. ej., el CV de otra persona sin su consentimiento)',
          '• Usar la Plataforma para seleccionar, discriminar o perfilar candidatos a empleos',
          '• Intentar eludir cuotas de uso o controles de acceso',
          '• Usar la Plataforma para cualquier fin ilegal',
          '• Introducir malware, virus o cualquier otro código dañino',
          'Nos reservamos el derecho de suspender o cancelar cuentas que violen estas normas.',
        ],
      },
      {
        id: 'billing',
        title: '6. Suscripciones y Facturación',
        content: [
          'GapZero ofrece un nivel Gratuito y una suscripción Pro (disponible semanalmente a 9,99 $/semana o mensualmente a 29,99 $/mes, precios impuestos incluidos según la legislación aplicable). Los precios pueden modificarse con 30 días de aviso.',
          'Facturación: Las suscripciones Pro se facturan por adelantado de forma recurrente. Los pagos son procesados por Stripe.',
          'Cancelación: Puedes cancelar tu suscripción Pro en cualquier momento desde la configuración de tu cuenta, con efecto al final del período de facturación actual.',
          'Política de reembolso: Si no estás satisfecho con tu primer pago Pro, contáctanos en un plazo de 7 días a [support@gapzero.app] para un reembolso completo. Esto no afecta a tus derechos legales.',
          '[note] Consumidores de la UE: De conformidad con la Directiva europea sobre derechos de los consumidores (2011/83/UE), tienes un derecho de desistimiento de 14 días. Al iniciar tu primer análisis, consientes la prestación inmediata del servicio y renuncias a este derecho respecto a dicha prestación.',
        ],
      },
      {
        id: 'ip',
        title: '7. Propiedad Intelectual',
        content: [
          'Tus datos son tuyos. Eres propietario de tu CV, exportación de LinkedIn y cualquier otro contenido que cargues.',
          'Los resultados generados por IA te son licenciados para uso personal y no comercial. No puedes revenderlos ni ofrecerlos como servicio a terceros.',
          'La Plataforma en sí — incluyendo su diseño, código, prompts, base de conocimiento y marca — pertenece a GapZero.',
        ],
      },
      {
        id: 'liability',
        title: '8. Exenciones y Limitación de Responsabilidad',
        content: [
          'TAL COMO ESTÁ. La Plataforma se proporciona "tal como está" y "según disponibilidad" sin garantías de ningún tipo.',
          'Sin garantía de empleo. GapZero no garantiza que el uso de la Plataforma resulte en ofertas de trabajo, aumentos salariales o avance profesional.',
          'Limitación de responsabilidad. La responsabilidad total de GapZero no superará el importe que hayas pagado en los 12 meses anteriores, o 50 USD, lo que sea mayor.',
          '[note] Nota jurisdiccional: Algunas legislaciones, incluidas las de los estados miembros de la UE, no permiten la exclusión de ciertas garantías ni la limitación de los derechos de los consumidores. Estos Términos no reducen los derechos que no pueden excluirse legalmente.',
        ],
      },
      {
        id: 'third-parties',
        title: '9. Servicios de Terceros',
        content: [
          'GapZero depende de los siguientes servicios de terceros:',
          '• Anthropic (API Claude) — procesa datos de CV y empleo para generar resultados de IA.',
          '• Supabase — almacena datos de cuenta, análisis y perfil.',
          '• Stripe — procesa los pagos de suscripción. No almacenamos tus datos de tarjeta.',
          '• Vercel — aloja la Plataforma.',
        ],
      },
      {
        id: 'termination',
        title: '10. Terminación',
        content: [
          'Puedes dejar de usar la Plataforma y eliminar tu cuenta en cualquier momento. Podemos suspender o cancelar tu cuenta si incumples estos Términos o incurres en actividades fraudulentas.',
        ],
      },
      {
        id: 'governing-law',
        title: '11. Ley Aplicable y Resolución de Disputas',
        content: [
          'Estos Términos se rigen por las leyes de [Jurisdicción — p. ej., Inglaterra y Gales / Delaware, EE.UU.]. Las disputas se abordarán primero mediante negociación de buena fe.',
          '[note] Usuarios de la UE: También puedes utilizar la plataforma europea de resolución de litigios en línea en ec.europa.eu/consumers/odr.',
        ],
      },
      {
        id: 'changes',
        title: '12. Cambios en Estos Términos',
        content: [
          'Para cambios materiales, te informaremos con al menos 30 días de antelación por correo electrónico o mediante un aviso destacado en la Plataforma.',
        ],
      },
      {
        id: 'contact-terms',
        title: '13. Contacto',
        content: [
          '¿Preguntas sobre estos Términos? Contáctanos en: [legal@gapzero.app] o escribe a [Dirección de la Empresa].',
        ],
      },
    ],
  },

  // ── ITALIANO ───────────────────────────────────────────────────────────────
  it: {
    pageTitle: 'Termini e Condizioni',
    intro: 'Creando un account o utilizzando GapZero, accetti questi termini. Ti preghiamo di leggerli — in particolare la Sezione 3 sui contenuti generati dall\'IA, che è la parte più importante.',
    importantSection: 'Questa è la sezione più importante di questi Termini.',
    sections: [
      {
        id: 'who-we-are',
        title: '1. Chi siamo',
        content: [
          'GapZero ("noi", "ci", "nostro") è una piattaforma di intelligenza professionale basata su IA, gestita da [Nome Società], registrata a [Indirizzo Società]. Offriamo analisi della carriera, valutazioni delle lacune di competenze, ottimizzazione del CV e strumenti di coaching professionale basati sull\'intelligenza artificiale.',
          'I presenti Termini e Condizioni ("Termini") regolano l\'accesso e l\'utilizzo del sito web GapZero su gapzero.app e di tutti i servizi associati ("la Piattaforma"). Utilizzando la Piattaforma, confermi di avere almeno 16 anni e la capacità giuridica di accettare questi Termini.',
        ],
      },
      {
        id: 'what-we-do',
        title: '2. Cosa fa GapZero',
        content: [
          'GapZero è uno strumento di orientamento professionale. Carichi il tuo CV, opzionalmente un PDF esportato da LinkedIn e un annuncio di lavoro, e la nostra piattaforma usa l\'IA (Claude di Anthropic) per generare risultati personalizzati, tra cui:',
          '• Punteggi di adeguatezza professionale e analisi delle lacune',
          '• Valutazioni delle lacune di competenze e raccomandazioni di ruoli',
          '• Benchmark retributivi per il tuo ruolo target e paese',
          '• Punteggi ATS di parole chiave e formato',
          '• Suggerimenti per la riscrittura del CV e versioni ottimizzate',
          '• Bozze di lettere di presentazione',
          '• Valutazioni del profilo GitHub (se fornisci un URL GitHub)',
          '• Risposte di coaching professionale via chat',
          '• Piani d\'azione a 30/90/365 giorni',
          'GapZero è uno strumento di orientamento, non un servizio professionale. Nulla su questa piattaforma costituisce consulenza professionale di carriera, consulenza legale, consulenza finanziaria o garanzia di occupazione.',
        ],
      },
      {
        id: 'ai-disclaimer',
        title: '3. Contenuti Generati dall\'IA — Si prega di leggere',
        highlight: true,
        highlightLabel: 'Questa è la sezione più importante di questi Termini.',
        content: [
          'Tutto ciò che GapZero genera è prodotto da un sistema di IA (Anthropic Claude) che effettua inferenze probabilistiche sulla base dei tuoi dati. Ciò include, senza limitazione: punteggi di adeguatezza, valutazioni delle lacune di competenze, fasce salariali, raccomandazioni di ruoli, punteggi ATS, suggerimenti per il CV, lettere di presentazione, valutazioni GitHub, risposte di coaching e piani d\'azione.',
          'I risultati dell\'IA sono stime al meglio — non fatti. Possono contenere imprecisioni, informazioni obsolete, semplificazioni eccessive o, in rari casi, errori veri e propri ("allucinazioni"). I dati retributivi derivano da benchmark pubblicamente disponibili e potrebbero non riflettere il tuo mercato locale, il tuo specifico datore di lavoro o le condizioni attuali.',
          'Devi applicare il tuo giudizio. I risultati di GapZero sono punti di partenza per la tua riflessione — non risposte definitive. Prima di prendere decisioni di carriera, verifica le informazioni attraverso ricerche indipendenti e consulta professionisti.',
          'GapZero non è responsabile per i risultati. Nella massima misura consentita dalla legge applicabile, GapZero e i suoi operatori non accettano alcuna responsabilità per decisioni occupazionali, esiti professionali, opportunità mancate, perdite finanziarie o qualsiasi altra conseguenza derivante dall\'uso di contenuti generati dall\'IA.',
          '[note] Utenti UE — Avviso Regolamento IA: GapZero fornisce supporto decisionale di carriera assistito da IA nel settore dell\'occupazione. In conformità con i requisiti di supervisione umana del Regolamento UE sull\'IA, tutti i risultati sono strumenti per assistere il tuo processo decisionale. Nessun risultato costituisce una decisione automatizzata con effetti giuridici significativi ai sensi dell\'articolo 22 del GDPR.',
        ],
      },
      {
        id: 'accounts',
        title: '4. Il tuo Account',
        content: [
          'Per salvare le analisi e accedere alla cronologia, crei un account con il tuo indirizzo e-mail. Sei responsabile di:',
          '• Mantenere al sicuro le tue credenziali di accesso',
          '• Tutta l\'attività che si svolge nel tuo account',
          '• Fornire informazioni accurate — la qualità dell\'analisi dipende direttamente dalla qualità dei dati inseriti',
          '• Notificarci immediatamente in caso di sospetto accesso non autorizzato',
          'Puoi eliminare il tuo account in qualsiasi momento dalle impostazioni della dashboard.',
        ],
      },
      {
        id: 'acceptable-use',
        title: '5. Uso Accettabile',
        content: [
          'Ti impegni a non:',
          '• Estrarre dati dalla Piattaforma con mezzi automatizzati (scraping)',
          '• Decompilare o tentare di estrarre il codice sorgente o i prompt IA della Piattaforma',
          '• Caricare contenuti che non hai il diritto di condividere (es. il CV di un\'altra persona senza il suo consenso)',
          '• Utilizzare la Piattaforma per selezionare, discriminare o profilare candidati al lavoro',
          '• Tentare di aggirare le quote di utilizzo o i controlli di accesso',
          '• Utilizzare la Piattaforma per scopi illegali',
          '• Introdurre malware, virus o altro codice dannoso',
          'Ci riserviamo il diritto di sospendere o terminare gli account che violano queste regole.',
        ],
      },
      {
        id: 'billing',
        title: '6. Abbonamenti e Fatturazione',
        content: [
          'GapZero offre un livello Gratuito e un abbonamento Pro (disponibile settimanalmente a 9,99 $/settimana o mensilmente a 29,99 $/mese, prezzi IVA inclusa ove previsto dalla legge). I prezzi possono variare con un preavviso di 30 giorni.',
          'Fatturazione: Gli abbonamenti Pro vengono fatturati in anticipo su base ricorrente. I pagamenti sono elaborati da Stripe.',
          'Cancellazione: Puoi disdire il tuo abbonamento Pro in qualsiasi momento dalle impostazioni del tuo account, con effetto alla fine del periodo di fatturazione corrente.',
          'Politica di rimborso: Se non sei soddisfatto del tuo primo pagamento Pro, contattaci entro 7 giorni all\'indirizzo [support@gapzero.app] per un rimborso completo. Questo non pregiudica i tuoi diritti legali.',
          '[note] Consumatori UE: Ai sensi della Direttiva UE sui diritti dei consumatori (2011/83/UE), hai un diritto di recesso di 14 giorni. Avviando la tua prima analisi, acconsenti all\'esecuzione immediata del servizio e rinunci a tale diritto per quella prestazione.',
        ],
      },
      {
        id: 'ip',
        title: '7. Proprietà Intellettuale',
        content: [
          'I tuoi dati sono tuoi. Sei proprietario del tuo CV, dell\'esportazione LinkedIn e di qualsiasi altro contenuto caricato.',
          'I risultati generati dall\'IA ti sono concessi in licenza per uso personale e non commerciale. Non puoi rivenderli né proporli come servizio ad altri.',
          'La Piattaforma stessa — inclusi design, codice, prompt, base di conoscenze e marchio — appartiene a GapZero.',
        ],
      },
      {
        id: 'liability',
        title: '8. Esclusioni e Limitazioni di Responsabilità',
        content: [
          'COSÌ COM\'È. La Piattaforma è fornita "così com\'è" e "secondo disponibilità" senza garanzie di alcun tipo.',
          'Nessuna garanzia occupazionale. GapZero non garantisce che l\'utilizzo della Piattaforma porterà a offerte di lavoro, aumenti salariali o avanzamenti di carriera.',
          'Limitazione di responsabilità. La responsabilità totale di GapZero non supererà l\'importo pagato negli ultimi 12 mesi, o 50 USD, a seconda di quale sia maggiore.',
          '[note] Nota giurisdizionale: Alcune giurisdizioni, inclusi gli Stati membri UE, non consentono l\'esclusione di determinate garanzie o limitazioni dei diritti dei consumatori. I presenti Termini non riducono i diritti che non possono essere legalmente esclusi.',
        ],
      },
      {
        id: 'third-parties',
        title: '9. Servizi di Terze Parti',
        content: [
          'GapZero si avvale dei seguenti servizi di terze parti:',
          '• Anthropic (API Claude) — elabora i dati del CV e dell\'offerta di lavoro per generare risultati IA.',
          '• Supabase — archivia dati account, analisi e profilo.',
          '• Stripe — elabora i pagamenti degli abbonamenti. Non archiviamo i dati della tua carta.',
          '• Vercel — ospita la Piattaforma.',
        ],
      },
      {
        id: 'termination',
        title: '10. Risoluzione',
        content: [
          'Puoi smettere di utilizzare la Piattaforma ed eliminare il tuo account in qualsiasi momento. Possiamo sospendere o terminare il tuo account in caso di violazione di questi Termini o di attività fraudolenta.',
        ],
      },
      {
        id: 'governing-law',
        title: '11. Legge Applicabile e Risoluzione delle Controversie',
        content: [
          'I presenti Termini sono regolati dalla legge di [Giurisdizione — es. Inghilterra e Galles / Delaware, USA]. Le controversie saranno affrontate in primo luogo mediante negoziazione in buona fede.',
          '[note] Utenti UE: Puoi anche utilizzare la piattaforma europea di risoluzione online delle controversie su ec.europa.eu/consumers/odr.',
        ],
      },
      {
        id: 'changes',
        title: '12. Modifiche ai Termini',
        content: [
          'Per le modifiche sostanziali, ti informeremo con almeno 30 giorni di preavviso tramite e-mail o con un avviso prominente sulla Piattaforma.',
        ],
      },
      {
        id: 'contact-terms',
        title: '13. Contatti',
        content: [
          'Domande su questi Termini? Contattaci a: [legal@gapzero.app] o scrivi a [Indirizzo Società].',
        ],
      },
    ],
  },
};
