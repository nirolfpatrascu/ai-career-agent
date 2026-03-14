import type { Locale } from '@/lib/i18n';

export interface PrivacyDataRow {
  category: string;
  examples: string;
  basis: string;
}

export interface PrivacyProcessorRow {
  name: string;
  processes: string;
  location: string;
}

export interface PrivacyRightsCard {
  title: string;
  items: string[];
}

export interface PrivacySection {
  id: string;
  title: string;
  content: string[];          // paragraphs / bullets / [note] notes
  dataTable?: PrivacyDataRow[];
  processorTable?: PrivacyProcessorRow[];
  rightsCards?: PrivacyRightsCard[];
  highlight?: boolean;        // blue AI-processing highlight box
}

export interface PrivacyLocaleContent {
  pageTitle: string;
  intro: string;
  tableHeaders?: { category: string; examples: string; basis: string };
  processorHeaders?: { name: string; processes: string; location: string };
  sections: PrivacySection[];
}

export const PRIVACY_CONTENT: Record<Locale, PrivacyLocaleContent> = {

  // ── ENGLISH ────────────────────────────────────────────────────────────────
  en: {
    pageTitle: 'Privacy Policy',
    intro: 'We respect your privacy. This policy explains what data GapZero collects, why, how long we keep it, and what rights you have. We\'ve written it in plain English — no unnecessary legal complexity.',
    tableHeaders: { category: 'Data category', examples: 'What we collect', basis: 'Legal basis (GDPR)' },
    processorHeaders: { name: 'Processor', processes: 'What they process', location: 'Location' },
    sections: [
      {
        id: 'controller',
        title: '1. Who Is Responsible for Your Data',
        content: [
          'GapZero is operated by [Company Name], registered at [Company Address] ("we", "us", "our").',
          'For the purposes of the UK GDPR and EU GDPR, we are the data controller of the personal data you provide when using gapzero.app.',
          'Data Protection contact: [privacy@gapzero.app]',
        ],
      },
      {
        id: 'what-we-collect',
        title: '2. What Data We Collect',
        content: ['We only collect data that is necessary to provide the service to you.'],
        dataTable: [
          { category: 'Account data', examples: 'Email address, hashed password (via Supabase Auth), account creation date', basis: 'Contract performance (Art. 6(1)(b))' },
          { category: 'CV content', examples: 'Text extracted from your uploaded CV PDF — name, work history, skills, education, certifications, summary', basis: 'Contract performance (Art. 6(1)(b))' },
          { category: 'LinkedIn PDF export', examples: 'Text extracted from your LinkedIn PDF — profile, experience, skills (optional upload)', basis: 'Contract performance (Art. 6(1)(b))' },
          { category: 'Job posting text', examples: 'The job description you paste or fetch — role title, requirements, employer details', basis: 'Contract performance (Art. 6(1)(b))' },
          { category: 'Career questionnaire', examples: 'Current role, target role, years of experience, country, work preference (remote/hybrid/on-site)', basis: 'Contract performance (Art. 6(1)(b))' },
          { category: 'GitHub URL', examples: 'Your public GitHub profile URL (optional) — used to fetch public repository data for analysis', basis: 'Contract performance / Consent (Art. 6(1)(a))' },
          { category: 'Analysis results', examples: 'Fit scores, gap analysis, salary benchmarks, ATS scores, CV suggestions, cover letters, GitHub assessments, action plans — saved to your account history', basis: 'Contract performance (Art. 6(1)(b))' },
          { category: 'Usage data', examples: 'Pages visited, features used, analysis count, session identifiers', basis: 'Legitimate interests (Art. 6(1)(f))' },
          { category: 'Payment data', examples: 'Subscription status, billing period — payment card details held exclusively by Stripe', basis: 'Contract performance (Art. 6(1)(b))' },
        ],
      },
      {
        id: 'how-we-use',
        title: '3. How We Use Your Data',
        content: [
          'To provide the service: We send your CV text, job posting, and questionnaire responses to Anthropic\'s Claude API to generate your analysis. We store the results in Supabase so you can access your history. We use your email to authenticate your account.',
          'To operate the platform: We use usage data to enforce your plan\'s analysis quota, prevent abuse, and monitor platform health.',
          'To improve the platform: We may analyse anonymised, aggregated usage patterns to improve GapZero. We do not use your personal CV content for this purpose.',
          'To communicate with you: We may send transactional emails (account confirmation, subscription receipts). We will only send marketing communications if you opt in.',
        ],
      },
      {
        id: 'ai-processing',
        title: '4. How AI Processes Your Data',
        highlight: true,
        content: [
          'Your CV is sent to Anthropic. When you run an analysis, your CV text, LinkedIn export (if provided), job posting, and questionnaire are transmitted to Anthropic\'s API. Anthropic processes this data to generate your career analysis. Anthropic is our data processor under a Data Processing Agreement.',
          'Your data is not used to train AI models. Anthropic\'s API usage policies prohibit using API-submitted data to train or fine-tune their models. Your CV content is used solely to generate your analysis and is not retained by Anthropic beyond the API call.',
          'No automated decision-making with legal effect. GapZero does not make automated decisions about you under GDPR Article 22. All outputs are tools to inform your own decisions. You remain in control.',
          'GitHub analysis uses only publicly accessible repository data from GitHub\'s public API, limited to repositories you have made public.',
        ],
      },
      {
        id: 'processors',
        title: '5. Third-Party Data Processors',
        content: [],
        processorTable: [
          { name: 'Anthropic', processes: 'CV text, job posting, questionnaire (during analysis only)', location: 'USA' },
          { name: 'Supabase', processes: 'Account data, analysis history, profile, job tracker', location: 'EU / USA' },
          { name: 'Stripe', processes: 'Payment card details, subscription status', location: 'USA / EU' },
          { name: 'Vercel', processes: 'Web request logs, serverless function execution', location: 'Global CDN' },
        ],
      },
      {
        id: 'transfers',
        title: '6. International Data Transfers',
        content: [
          'Some of our processors are based in the United States. If you are in the EU or UK, this means your personal data may be transferred outside the EEA or United Kingdom.',
          'We rely on the following safeguards:',
          '• Anthropic: EU Standard Contractual Clauses (SCCs) and Anthropic\'s DPA, including UK IDTA provisions.',
          '• Supabase: SCCs with EU data residency options where selected.',
          '• Stripe: EU-US Data Privacy Framework certification and SCCs.',
          '• Vercel: SCCs included in Vercel\'s DPA.',
          'You may request a copy of the relevant safeguards by contacting us at the address in Section 10.',
        ],
      },
      {
        id: 'retention',
        title: '7. How Long We Keep Your Data',
        content: [
          '• Analysis results and career history — kept while your account is active. Deleted when you delete your account.',
          '• CV text submitted for analysis — not stored by GapZero after the analysis is complete. The extracted results are stored, but not the raw CV text.',
          '• Account data (email) — retained until you delete your account or request erasure.',
          '• Subscription/billing records — retained for 7 years for tax and accounting compliance, even after account deletion.',
          '• Usage logs — retained for up to 90 days for security and fraud prevention.',
          'You can delete your account and all associated data from your dashboard at any time.',
        ],
      },
      {
        id: 'cookies',
        title: '8. Cookies',
        content: [
          'GapZero uses session cookies only — small pieces of data stored in your browser that keep you logged in between page loads. We do not use advertising cookies, third-party tracking cookies, or analytics cookies that follow you across the web.',
          '• Authentication cookie — set by Supabase Auth to maintain your login session. Expires when you log out or after 7 days of inactivity.',
          '• Locale preference — stores your language preference. Not personally identifiable.',
          'You can disable cookies in your browser settings, but doing so will prevent you from staying logged in to GapZero.',
        ],
      },
      {
        id: 'your-rights',
        title: '9. Your Rights',
        content: ['You have meaningful rights over your data, depending on where you are.'],
        rightsCards: [
          {
            title: 'GDPR (EU) & UK GDPR',
            items: [
              'Access — get a copy of your data',
              'Rectification — correct inaccurate data',
              'Erasure — delete your data ("right to be forgotten")',
              'Portability — export your data in a common format',
              'Restriction — pause processing while a dispute is resolved',
              'Objection — object to processing based on legitimate interests',
              'No automated decisions with legal effect',
            ],
          },
          {
            title: 'CCPA (California, USA)',
            items: [
              'Right to know what data we collect and how we use it',
              'Right to delete your personal information',
              'Right to opt out of the sale of your data',
              'Right to non-discrimination for exercising your rights',
              'We do not sell your personal information to any third party',
            ],
          },
        ],
      },
      {
        id: 'contact-privacy',
        title: '10. Contact & Data Protection Officer',
        content: [
          '[Company Name]',
          '[Company Address]',
          'Email: [privacy@gapzero.app]',
          '[note] DPO (if applicable): [DPO Name or "Not appointed — SME exemption applies"]',
        ],
      },
      {
        id: 'changes-privacy',
        title: '11. Changes to This Policy',
        content: [
          'We may update this Privacy Policy from time to time. For material changes, we will notify you by email (if you have an account) or by a prominent notice on the Platform at least 30 days before the changes take effect.',
        ],
      },
    ],
  },

  // ── ROMÂNĂ ─────────────────────────────────────────────────────────────────
  ro: {
    pageTitle: 'Politică de Confidențialitate',
    intro: 'Respectăm confidențialitatea ta. Această politică explică ce date colectează GapZero, de ce, cât timp le păstrăm și ce drepturi ai. Am redactat-o în limbaj clar — fără complexitate juridică inutilă.',
    tableHeaders: { category: 'Categorie date', examples: 'Ce colectăm', basis: 'Temei juridic (RGPD)' },
    processorHeaders: { name: 'Procesator', processes: 'Ce procesează', location: 'Locație' },
    sections: [
      {
        id: 'controller',
        title: '1. Cine este responsabil pentru datele tale',
        content: [
          'GapZero este operat de [Denumire Companie], înregistrată la [Adresă Companie] ("noi", "nouă", "nostru").',
          'În scopurile RGPD UE și RGPD Marea Britanie, suntem operatorul de date al datelor cu caracter personal pe care le furnizezi când utilizezi gapzero.app.',
          'Contact protecția datelor: [privacy@gapzero.app]',
        ],
      },
      {
        id: 'what-we-collect',
        title: '2. Ce date colectăm',
        content: ['Colectăm doar datele necesare pentru furnizarea serviciului.'],
        dataTable: [
          { category: 'Date cont', examples: 'Adresă email, parolă criptată, data creării contului', basis: 'Executarea contractului (Art. 6(1)(b))' },
          { category: 'Conținut CV', examples: 'Text extras din CV-ul PDF — nume, istoric profesional, competențe, studii, certificări, rezumat', basis: 'Executarea contractului (Art. 6(1)(b))' },
          { category: 'Export PDF LinkedIn', examples: 'Text extras din PDF-ul LinkedIn — profil, experiență, competențe (încărcare opțională)', basis: 'Executarea contractului (Art. 6(1)(b))' },
          { category: 'Text ofertă de muncă', examples: 'Descrierea postului — titlu, cerințe, detalii angajator', basis: 'Executarea contractului (Art. 6(1)(b))' },
          { category: 'Chestionar carieră', examples: 'Rol actual, rol țintă, ani experiență, țară, preferință de lucru', basis: 'Executarea contractului (Art. 6(1)(b))' },
          { category: 'URL GitHub', examples: 'URL-ul profilului tău public GitHub (opțional)', basis: 'Executarea contractului / Consimțământ (Art. 6(1)(a))' },
          { category: 'Rezultate analize', examples: 'Scoruri de potrivire, analiză lacune, repere salariale, scoruri ATS, sugestii CV, scrisori de intenție, planuri de acțiune', basis: 'Executarea contractului (Art. 6(1)(b))' },
          { category: 'Date de utilizare', examples: 'Pagini vizitate, funcții utilizate, număr analize, identificatori sesiune', basis: 'Interes legitim (Art. 6(1)(f))' },
          { category: 'Date de plată', examples: 'Status abonament, perioadă facturare — datele cardului sunt deținute exclusiv de Stripe', basis: 'Executarea contractului (Art. 6(1)(b))' },
        ],
      },
      {
        id: 'how-we-use',
        title: '3. Cum utilizăm datele tale',
        content: [
          'Pentru furnizarea serviciului: Trimitem textul CV-ului, oferta de muncă și răspunsurile la chestionar către API-ul Claude de la Anthropic pentru a genera analiza ta. Stocăm rezultatele în Supabase pentru ca tu să poți accesa istoricul. Folosim emailul tău pentru autentificarea contului.',
          'Pentru operarea platformei: Folosim datele de utilizare pentru a aplica cota de analize a planului tău, a preveni abuzurile și a monitoriza starea platformei.',
          'Pentru îmbunătățirea platformei: Putem analiza tipare de utilizare anonimizate și agregate pentru a îmbunătăți GapZero. Nu folosim conținutul personal al CV-ului tău în acest scop.',
          'Pentru a comunica cu tine: Putem trimite emailuri tranzacționale. Vom trimite comunicări de marketing doar dacă optezi pentru aceasta.',
        ],
      },
      {
        id: 'ai-processing',
        title: '4. Cum procesează IA datele tale',
        highlight: true,
        content: [
          'CV-ul tău este trimis la Anthropic. Când rulezi o analiză, textul CV-ului, exportul LinkedIn (dacă este furnizat), oferta de muncă și chestionarul sunt transmise API-ului Anthropic. Anthropic este împuternicitul nostru în temeiul unui Acord de Procesare a Datelor.',
          'Datele tale nu sunt utilizate pentru antrenarea modelelor IA. Politicile de utilizare ale API-ului Anthropic interzic utilizarea datelor trimise prin API pentru antrenarea sau ajustarea modelelor lor. Conținutul CV-ului tău este utilizat exclusiv pentru generarea analizei tale.',
          'Nicio decizie automată cu efect juridic. GapZero nu ia decizii automate despre tine conform Articolului 22 din RGPD. Toate rezultatele sunt instrumente pentru a-ți informa propriile decizii.',
          'Analiza GitHub utilizează doar datele din depozitele publice accesibile prin API-ul public al GitHub.',
        ],
      },
      {
        id: 'processors',
        title: '5. Împuterniciți terți',
        content: [],
        processorTable: [
          { name: 'Anthropic', processes: 'Text CV, ofertă de muncă, chestionar (doar în timpul analizei)', location: 'SUA' },
          { name: 'Supabase', processes: 'Date cont, istoric analize, profil, tracker joburi', location: 'UE / SUA' },
          { name: 'Stripe', processes: 'Date card de plată, status abonament', location: 'SUA / UE' },
          { name: 'Vercel', processes: 'Jurnale cereri web, execuție funcții serverless', location: 'CDN global' },
        ],
      },
      {
        id: 'transfers',
        title: '6. Transferuri internaționale de date',
        content: [
          'Unii dintre împuterniciții noștri sunt bazați în Statele Unite. Dacă ești în UE sau Marea Britanie, datele tale personale pot fi transferate în afara SEE sau Regatului Unit.',
          'Ne bazăm pe următoarele garanții:',
          '• Anthropic: Clauze Contractuale Standard UE (CCS) și Acordul de Procesare a Datelor Anthropic, inclusiv prevederi IDTA pentru Marea Britanie.',
          '• Supabase: CCS cu opțiuni de rezidență a datelor în UE.',
          '• Stripe: Certificare Cadru de Confidențialitate Date UE-SUA și CCS.',
          '• Vercel: CCS incluse în DPA Vercel.',
        ],
      },
      {
        id: 'retention',
        title: '7. Cât timp păstrăm datele tale',
        content: [
          '• Rezultatele analizelor și istoricul carierei — păstrate cât timp contul tău este activ. Șterse când îți ștergi contul.',
          '• Textul CV-ului trimis pentru analiză — nu este stocat de GapZero după finalizarea analizei.',
          '• Date cont (email) — păstrate până când îți ștergi contul sau soliciți ștergerea.',
          '• Înregistrări de facturare — păstrate 7 ani pentru conformitate fiscală și contabilă.',
          '• Jurnale de utilizare — păstrate până la 90 de zile pentru securitate și prevenirea fraudelor.',
        ],
      },
      {
        id: 'cookies',
        title: '8. Cookie-uri',
        content: [
          'GapZero utilizează doar cookie-uri de sesiune — fragmente mici de date stocate în browserul tău pentru a menține conectarea. Nu folosim cookie-uri publicitare, cookie-uri de urmărire terțe sau cookie-uri de analiză care te urmăresc pe web.',
          '• Cookie de autentificare — setat de Supabase Auth pentru a menține sesiunea ta. Expiră la deconectare sau după 7 zile de inactivitate.',
          '• Preferință limbă — stochează preferința ta de limbă. Nu este de identificare personală.',
        ],
      },
      {
        id: 'your-rights',
        title: '9. Drepturile tale',
        content: ['Ai drepturi semnificative asupra datelor tale, în funcție de locul în care te afli.'],
        rightsCards: [
          {
            title: 'RGPD (UE) & RGPD Marea Britanie',
            items: [
              'Acces — obține o copie a datelor tale',
              'Rectificare — corectarea datelor inexacte',
              'Ștergere — ștergerea datelor tale ("dreptul de a fi uitat")',
              'Portabilitate — exportul datelor tale',
              'Restricție — suspendarea procesării în timp ce o dispută este rezolvată',
              'Opoziție — opoziție la procesarea bazată pe interese legitime',
              'Nicio decizie automată cu efect juridic',
            ],
          },
          {
            title: 'CCPA (California, SUA)',
            items: [
              'Dreptul de a ști ce date colectăm și cum le folosim',
              'Dreptul de a solicita ștergerea datelor personale',
              'Dreptul de a renunța la vânzarea datelor tale',
              'Dreptul de a nu fi discriminat pentru exercitarea drepturilor tale',
              'Nu vindem datele tale personale niciunei terțe părți',
            ],
          },
        ],
      },
      {
        id: 'contact-privacy',
        title: '10. Contact și Responsabil cu Protecția Datelor',
        content: [
          '[Denumire Companie]',
          '[Adresă Companie]',
          'Email: [privacy@gapzero.app]',
          '[note] DPO (dacă este cazul): [Nume DPO sau "Nenumit — scutire IMM aplicabilă"]',
        ],
      },
      {
        id: 'changes-privacy',
        title: '11. Modificări ale acestei Politici',
        content: [
          'Putem actualiza această Politică de Confidențialitate periodic. Pentru modificări semnificative, te vom notifica prin email (dacă ai cont) sau prin notificare prominentă pe Platformă cu cel puțin 30 de zile înainte de intrarea în vigoare.',
        ],
      },
    ],
  },

  // ── DEUTSCH ────────────────────────────────────────────────────────────────
  de: {
    pageTitle: 'Datenschutzerklärung',
    intro: 'Wir respektieren Ihre Privatsphäre. Diese Erklärung beschreibt, welche Daten GapZero erhebt, warum, wie lange wir sie speichern und welche Rechte Sie haben. Wir haben sie in verständlicher Sprache verfasst.',
    tableHeaders: { category: 'Datenkategorie', examples: 'Was wir erheben', basis: 'Rechtsgrundlage (DSGVO)' },
    processorHeaders: { name: 'Auftragsverarbeiter', processes: 'Was verarbeitet wird', location: 'Standort' },
    sections: [
      {
        id: 'controller',
        title: '1. Wer für Ihre Daten verantwortlich ist',
        content: [
          'GapZero wird betrieben von [Unternehmensname], eingetragen unter [Unternehmensadresse] ("wir", "uns", "unser").',
          'Im Sinne der EU-DSGVO und des UK-GDPR sind wir der Verantwortliche für die personenbezogenen Daten, die Sie bei der Nutzung von gapzero.app bereitstellen.',
          'Datenschutzkontakt: [privacy@gapzero.app]',
        ],
      },
      {
        id: 'what-we-collect',
        title: '2. Welche Daten wir erheben',
        content: ['Wir erheben nur die Daten, die zur Erbringung des Dienstes erforderlich sind.'],
        dataTable: [
          { category: 'Kontodaten', examples: 'E-Mail-Adresse, gehashtes Passwort, Erstellungsdatum', basis: 'Vertragserfüllung (Art. 6(1)(b))' },
          { category: 'Lebenslauf-Inhalt', examples: 'Aus Ihrem Lebenslauf-PDF extrahierter Text — Name, Berufserfahrung, Kompetenzen, Ausbildung', basis: 'Vertragserfüllung (Art. 6(1)(b))' },
          { category: 'LinkedIn-PDF-Export', examples: 'Aus LinkedIn-PDF extrahierter Text — Profil, Erfahrung, Kompetenzen (optionaler Upload)', basis: 'Vertragserfüllung (Art. 6(1)(b))' },
          { category: 'Stellenbeschreibungstext', examples: 'Die eingefügte oder abgerufene Stellenbeschreibung', basis: 'Vertragserfüllung (Art. 6(1)(b))' },
          { category: 'Karriere-Fragebogen', examples: 'Aktuelle Stelle, Zielstelle, Berufserfahrung, Land, Arbeitspräferenz', basis: 'Vertragserfüllung (Art. 6(1)(b))' },
          { category: 'GitHub-URL', examples: 'Ihre öffentliche GitHub-Profil-URL (optional)', basis: 'Vertragserfüllung / Einwilligung (Art. 6(1)(a))' },
          { category: 'Analyseergebnisse', examples: 'Eignungswerte, Lückenanalysen, Gehaltsrichtwerte, ATS-Bewertungen, Lebenslauf-Vorschläge, Aktionspläne', basis: 'Vertragserfüllung (Art. 6(1)(b))' },
          { category: 'Nutzungsdaten', examples: 'Besuchte Seiten, genutzte Funktionen, Analyseanzahl, Sitzungskennungen', basis: 'Berechtigte Interessen (Art. 6(1)(f))' },
          { category: 'Zahlungsdaten', examples: 'Abonnementstatus, Abrechnungszeitraum — Kartendaten ausschließlich bei Stripe', basis: 'Vertragserfüllung (Art. 6(1)(b))' },
        ],
      },
      {
        id: 'how-we-use',
        title: '3. Wie wir Ihre Daten verwenden',
        content: [
          'Zur Erbringung des Dienstes: Wir übermitteln Ihren Lebenslauftext, die Stellenbeschreibung und die Fragebogenantworten an Anthropics Claude-API, um Ihre Analyse zu erstellen.',
          'Zum Plattformbetrieb: Wir nutzen Nutzungsdaten zur Durchsetzung Ihres Analysekontingents und zur Missbrauchsprävention.',
          'Zur Plattformverbesserung: Wir analysieren anonymisierte, aggregierte Nutzungsmuster. Wir verwenden Ihre persönlichen Lebenslaufdaten nicht für diesen Zweck.',
          'Zur Kommunikation: Wir senden Transaktions-E-Mails. Marketingmitteilungen werden nur mit Ihrer Einwilligung versandt.',
        ],
      },
      {
        id: 'ai-processing',
        title: '4. Wie KI Ihre Daten verarbeitet',
        highlight: true,
        content: [
          'Ihr Lebenslauf wird an Anthropic übermittelt. Beim Starten einer Analyse werden Ihr Lebenslauftext, LinkedIn-Export (sofern bereitgestellt), Stellenbeschreibung und Fragebogen an Anthropics API übertragen. Anthropic ist unser Auftragsverarbeiter gemäß einem Datenverarbeitungsvertrag.',
          'Ihre Daten werden nicht zum Trainieren von KI-Modellen verwendet. Anthropics API-Nutzungsrichtlinien untersagen die Verwendung von API-übermittelten Daten zum Training oder Fine-Tuning ihrer Modelle.',
          'Keine automatisierten Entscheidungen mit Rechtswirkung. GapZero trifft keine automatisierten Entscheidungen über Sie gemäß Art. 22 DSGVO. Alle Ausgaben sind Werkzeuge zur Unterstützung Ihrer eigenen Entscheidungsfindung.',
          'Die GitHub-Analyse verwendet ausschließlich öffentlich zugängliche Repository-Daten über GitHubs öffentliche API.',
        ],
      },
      {
        id: 'processors',
        title: '5. Auftragsverarbeiter',
        content: [],
        processorTable: [
          { name: 'Anthropic', processes: 'Lebenslauftext, Stellenbeschreibung, Fragebogen (nur während der Analyse)', location: 'USA' },
          { name: 'Supabase', processes: 'Kontodaten, Analyseverlauf, Profil, Job-Tracker', location: 'EU / USA' },
          { name: 'Stripe', processes: 'Zahlungskartendaten, Abonnementstatus', location: 'USA / EU' },
          { name: 'Vercel', processes: 'Web-Anfrage-Protokolle, Serverless-Funktionsausführung', location: 'Globales CDN' },
        ],
      },
      {
        id: 'transfers',
        title: '6. Internationale Datenübermittlungen',
        content: [
          'Einige unserer Auftragsverarbeiter sind in den Vereinigten Staaten ansässig. Wenn Sie sich in der EU oder Großbritannien befinden, können Ihre personenbezogenen Daten in Länder außerhalb des EWR oder Vereinigten Königreichs übermittelt werden.',
          'Wir stützen uns auf folgende Schutzmaßnahmen:',
          '• Anthropic: EU-Standardvertragsklauseln (SCC) und Anthropics DPA, einschließlich UK-IDTA-Bestimmungen.',
          '• Supabase: SCCs mit EU-Datenresidenzoptionen.',
          '• Stripe: EU-US Data Privacy Framework-Zertifizierung und SCCs.',
          '• Vercel: In Vercels DPA enthaltene SCCs.',
        ],
      },
      {
        id: 'retention',
        title: '7. Wie lange wir Ihre Daten speichern',
        content: [
          '• Analyseergebnisse und Karriereverlauf — gespeichert, solange Ihr Konto aktiv ist. Gelöscht bei Kontolöschung.',
          '• Für die Analyse übermittelter Lebenslauftext — wird nach Abschluss der Analyse nicht von GapZero gespeichert.',
          '• Kontodaten (E-Mail) — bis zur Kontolöschung oder Löschanfrage.',
          '• Abrechnungsunterlagen — 7 Jahre aus steuer- und buchhalterischen Gründen.',
          '• Nutzungsprotokolle — bis zu 90 Tage für Sicherheit und Betrugsprävention.',
        ],
      },
      {
        id: 'cookies',
        title: '8. Cookies',
        content: [
          'GapZero verwendet ausschließlich Session-Cookies — kleine Datenstücke in Ihrem Browser, die Sie eingeloggt halten. Wir verwenden keine Werbe-Cookies, Drittanbieter-Tracking-Cookies oder webseitenübergreifende Analyse-Cookies.',
          '• Authentifizierungs-Cookie — von Supabase Auth gesetzt. Läuft bei Abmeldung oder nach 7 Tagen Inaktivität ab.',
          '• Sprachpräferenz — speichert Ihre Spracheinstellung. Nicht personenidentifizierbar.',
        ],
      },
      {
        id: 'your-rights',
        title: '9. Ihre Rechte',
        content: ['Sie haben je nach Ihrem Standort bedeutende Rechte bezüglich Ihrer Daten.'],
        rightsCards: [
          {
            title: 'DSGVO (EU) & UK-GDPR',
            items: [
              'Auskunft — Kopie Ihrer Daten erhalten',
              'Berichtigung — unrichtige Daten korrigieren',
              'Löschung — Ihre Daten löschen lassen ("Recht auf Vergessenwerden")',
              'Datenübertragbarkeit — Daten in einem gängigen Format exportieren',
              'Einschränkung — Verarbeitung während einer Streitigkeit aussetzen',
              'Widerspruch — gegen auf berechtigten Interessen basierende Verarbeitung widersprechen',
              'Keine automatisierten Entscheidungen mit Rechtswirkung',
            ],
          },
          {
            title: 'CCPA (Kalifornien, USA)',
            items: [
              'Recht zu erfahren, welche Daten wir erheben und wie wir sie verwenden',
              'Recht auf Löschung Ihrer personenbezogenen Daten',
              'Recht auf Opt-out vom Verkauf Ihrer Daten',
              'Recht auf Nichtdiskriminierung bei Rechtsausübung',
              'Wir verkaufen Ihre personenbezogenen Daten nicht',
            ],
          },
        ],
      },
      {
        id: 'contact-privacy',
        title: '10. Kontakt und Datenschutzbeauftragter',
        content: [
          '[Unternehmensname]',
          '[Unternehmensadresse]',
          'E-Mail: [privacy@gapzero.app]',
          '[note] DSB (sofern bestellt): [Name DSB oder "Nicht bestellt — KMU-Ausnahme gilt"]',
        ],
      },
      {
        id: 'changes-privacy',
        title: '11. Änderungen dieser Datenschutzerklärung',
        content: [
          'Bei wesentlichen Änderungen werden wir Sie mindestens 30 Tage vorher per E-Mail oder durch einen deutlichen Hinweis auf der Plattform informieren.',
        ],
      },
    ],
  },

  // ── FRANÇAIS ───────────────────────────────────────────────────────────────
  fr: {
    pageTitle: 'Politique de Confidentialité',
    intro: 'Nous respectons votre vie privée. Cette politique explique quelles données GapZero collecte, pourquoi, combien de temps nous les conservons et quels sont vos droits. Nous l\'avons rédigée en langage clair — sans complexité juridique inutile.',
    tableHeaders: { category: 'Catégorie de données', examples: 'Ce que nous collectons', basis: 'Base légale (RGPD)' },
    processorHeaders: { name: 'Sous-traitant', processes: 'Ce qu\'il traite', location: 'Localisation' },
    sections: [
      {
        id: 'controller',
        title: '1. Qui est responsable de vos données',
        content: [
          'GapZero est exploité par [Nom de la Société], immatriculée à [Adresse de la Société] ("nous", "notre").',
          'Au sens du RGPD UE et du RGPD britannique, nous sommes le responsable du traitement des données personnelles que vous fournissez en utilisant gapzero.app.',
          'Contact protection des données : [privacy@gapzero.app]',
        ],
      },
      {
        id: 'what-we-collect',
        title: '2. Quelles données nous collectons',
        content: ['Nous ne collectons que les données nécessaires à la fourniture du service.'],
        dataTable: [
          { category: 'Données de compte', examples: 'Adresse e-mail, mot de passe haché, date de création du compte', basis: 'Exécution du contrat (Art. 6(1)(b))' },
          { category: 'Contenu du CV', examples: 'Texte extrait de votre PDF CV — nom, historique professionnel, compétences, formation', basis: 'Exécution du contrat (Art. 6(1)(b))' },
          { category: 'Export PDF LinkedIn', examples: 'Texte extrait de votre PDF LinkedIn — profil, expérience, compétences (upload optionnel)', basis: 'Exécution du contrat (Art. 6(1)(b))' },
          { category: 'Texte de l\'offre d\'emploi', examples: 'La description de poste collée ou récupérée', basis: 'Exécution du contrat (Art. 6(1)(b))' },
          { category: 'Questionnaire carrière', examples: 'Poste actuel, poste cible, années d\'expérience, pays, préférence de travail', basis: 'Exécution du contrat (Art. 6(1)(b))' },
          { category: 'URL GitHub', examples: 'Votre URL de profil GitHub public (optionnel)', basis: 'Exécution du contrat / Consentement (Art. 6(1)(a))' },
          { category: 'Résultats d\'analyses', examples: 'Scores d\'adéquation, analyses des lacunes, benchmarks salariaux, scores ATS, suggestions CV, lettres de motivation, plans d\'action', basis: 'Exécution du contrat (Art. 6(1)(b))' },
          { category: 'Données d\'utilisation', examples: 'Pages visitées, fonctionnalités utilisées, nombre d\'analyses, identifiants de session', basis: 'Intérêts légitimes (Art. 6(1)(f))' },
          { category: 'Données de paiement', examples: 'Statut d\'abonnement, période de facturation — données de carte détenues exclusivement par Stripe', basis: 'Exécution du contrat (Art. 6(1)(b))' },
        ],
      },
      {
        id: 'how-we-use',
        title: '3. Comment nous utilisons vos données',
        content: [
          'Pour fournir le service : Nous envoyons votre texte de CV, l\'offre d\'emploi et les réponses au questionnaire à l\'API Claude d\'Anthropic pour générer votre analyse.',
          'Pour opérer la plateforme : Nous utilisons les données d\'utilisation pour appliquer le quota d\'analyses de votre plan et prévenir les abus.',
          'Pour améliorer la plateforme : Nous analysons des tendances d\'utilisation anonymisées et agrégées. Nous n\'utilisons pas votre contenu CV personnel à cette fin.',
          'Pour communiquer avec vous : Nous envoyons des e-mails transactionnels. Nous n\'enverrons des communications marketing qu\'avec votre consentement.',
        ],
      },
      {
        id: 'ai-processing',
        title: '4. Comment l\'IA traite vos données',
        highlight: true,
        content: [
          'Votre CV est envoyé à Anthropic. Lors d\'une analyse, votre texte de CV, l\'export LinkedIn (si fourni), l\'offre d\'emploi et le questionnaire sont transmis à l\'API d\'Anthropic. Anthropic est notre sous-traitant au titre d\'un Accord de Traitement des Données.',
          'Vos données ne sont pas utilisées pour entraîner des modèles d\'IA. Les politiques d\'utilisation de l\'API d\'Anthropic interdisent l\'utilisation des données soumises via l\'API pour entraîner ou affiner leurs modèles.',
          'Aucune décision automatisée avec effet juridique. GapZero ne prend pas de décisions automatisées vous concernant au sens de l\'article 22 du RGPD. Tous les résultats sont des outils pour éclairer vos propres décisions.',
          'L\'analyse GitHub utilise uniquement les données de dépôts publics accessibles via l\'API publique de GitHub.',
        ],
      },
      {
        id: 'processors',
        title: '5. Sous-traitants',
        content: [],
        processorTable: [
          { name: 'Anthropic', processes: 'Texte CV, offre d\'emploi, questionnaire (pendant l\'analyse uniquement)', location: 'USA' },
          { name: 'Supabase', processes: 'Données de compte, historique des analyses, profil, suivi d\'emplois', location: 'UE / USA' },
          { name: 'Stripe', processes: 'Données de carte bancaire, statut d\'abonnement', location: 'USA / UE' },
          { name: 'Vercel', processes: 'Journaux de requêtes web, exécution de fonctions serverless', location: 'CDN mondial' },
        ],
      },
      {
        id: 'transfers',
        title: '6. Transferts internationaux de données',
        content: [
          'Certains de nos sous-traitants sont basés aux États-Unis. Si vous êtes dans l\'UE ou au Royaume-Uni, vos données personnelles peuvent être transférées hors de l\'EEE ou du Royaume-Uni.',
          'Nous nous appuyons sur les garanties suivantes :',
          '• Anthropic : Clauses Contractuelles Types (CCT) de l\'UE et DPA d\'Anthropic, incluant les dispositions UK IDTA.',
          '• Supabase : CCT avec options de résidence des données en UE.',
          '• Stripe : Certification EU-US Data Privacy Framework et CCT.',
          '• Vercel : CCT incluses dans le DPA de Vercel.',
        ],
      },
      {
        id: 'retention',
        title: '7. Durée de conservation de vos données',
        content: [
          '• Résultats des analyses et historique de carrière — conservés tant que votre compte est actif. Supprimés lors de la suppression du compte.',
          '• Texte de CV soumis pour analyse — non conservé par GapZero après l\'analyse.',
          '• Données de compte (e-mail) — jusqu\'à la suppression du compte ou demande d\'effacement.',
          '• Données de facturation — conservées 7 ans pour conformité fiscale et comptable.',
          '• Journaux d\'utilisation — jusqu\'à 90 jours pour la sécurité et la prévention des fraudes.',
        ],
      },
      {
        id: 'cookies',
        title: '8. Cookies',
        content: [
          'GapZero utilise uniquement des cookies de session — de petits fichiers stockés dans votre navigateur pour maintenir votre connexion. Nous n\'utilisons pas de cookies publicitaires, de cookies de suivi tiers ou de cookies d\'analyse inter-sites.',
          '• Cookie d\'authentification — défini par Supabase Auth. Expire à la déconnexion ou après 7 jours d\'inactivité.',
          '• Préférence de langue — stocke votre préférence linguistique. Non personnellement identifiable.',
        ],
      },
      {
        id: 'your-rights',
        title: '9. Vos droits',
        content: ['Vous disposez de droits importants sur vos données, selon votre localisation.'],
        rightsCards: [
          {
            title: 'RGPD (UE) & RGPD Britannique',
            items: [
              'Accès — obtenir une copie de vos données',
              'Rectification — corriger les données inexactes',
              'Effacement — supprimer vos données ("droit à l\'oubli")',
              'Portabilité — exporter vos données dans un format courant',
              'Limitation — suspendre le traitement pendant la résolution d\'un litige',
              'Opposition — s\'opposer au traitement basé sur les intérêts légitimes',
              'Aucune décision automatisée avec effet juridique',
            ],
          },
          {
            title: 'CCPA (Californie, USA)',
            items: [
              'Droit de savoir quelles données nous collectons et comment nous les utilisons',
              'Droit de supprimer vos informations personnelles',
              'Droit de refuser la vente de vos données',
              'Droit à la non-discrimination pour l\'exercice de vos droits',
              'Nous ne vendons pas vos données personnelles à des tiers',
            ],
          },
        ],
      },
      {
        id: 'contact-privacy',
        title: '10. Contact et Délégué à la Protection des Données',
        content: [
          '[Nom de la Société]',
          '[Adresse de la Société]',
          'E-mail : [privacy@gapzero.app]',
          '[note] DPD (le cas échéant) : [Nom DPD ou "Non désigné — exemption PME applicable"]',
        ],
      },
      {
        id: 'changes-privacy',
        title: '11. Modifications de cette Politique',
        content: [
          'Pour les modifications importantes, nous vous informerons au moins 30 jours à l\'avance par e-mail ou par un avis prominent sur la Plateforme.',
        ],
      },
    ],
  },

  // ── ESPAÑOL ────────────────────────────────────────────────────────────────
  es: {
    pageTitle: 'Política de Privacidad',
    intro: 'Respetamos tu privacidad. Esta política explica qué datos recopila GapZero, por qué, cuánto tiempo los conservamos y qué derechos tienes. La hemos redactado en lenguaje claro — sin complejidad legal innecesaria.',
    tableHeaders: { category: 'Categoría de datos', examples: 'Qué recopilamos', basis: 'Base legal (RGPD)' },
    processorHeaders: { name: 'Encargado', processes: 'Qué procesa', location: 'Ubicación' },
    sections: [
      {
        id: 'controller',
        title: '1. Quién es responsable de tus datos',
        content: [
          'GapZero es operado por [Nombre de la Empresa], registrada en [Dirección de la Empresa] ("nosotros", "nos", "nuestro").',
          'A efectos del RGPD de la UE y el RGPD del Reino Unido, somos el responsable del tratamiento de los datos personales que proporcionas al usar gapzero.app.',
          'Contacto de protección de datos: [privacy@gapzero.app]',
        ],
      },
      {
        id: 'what-we-collect',
        title: '2. Qué datos recopilamos',
        content: ['Solo recopilamos los datos necesarios para prestarte el servicio.'],
        dataTable: [
          { category: 'Datos de cuenta', examples: 'Dirección de correo electrónico, contraseña cifrada, fecha de creación de cuenta', basis: 'Ejecución del contrato (Art. 6(1)(b))' },
          { category: 'Contenido del CV', examples: 'Texto extraído de tu PDF de CV — nombre, historial laboral, competencias, formación', basis: 'Ejecución del contrato (Art. 6(1)(b))' },
          { category: 'Exportación PDF de LinkedIn', examples: 'Texto extraído de tu PDF de LinkedIn — perfil, experiencia, competencias (carga opcional)', basis: 'Ejecución del contrato (Art. 6(1)(b))' },
          { category: 'Texto de la oferta de trabajo', examples: 'La descripción del puesto pegada o recuperada', basis: 'Ejecución del contrato (Art. 6(1)(b))' },
          { category: 'Cuestionario de carrera', examples: 'Rol actual, rol objetivo, años de experiencia, país, preferencia de trabajo', basis: 'Ejecución del contrato (Art. 6(1)(b))' },
          { category: 'URL de GitHub', examples: 'Tu URL de perfil público de GitHub (opcional)', basis: 'Ejecución del contrato / Consentimiento (Art. 6(1)(a))' },
          { category: 'Resultados de análisis', examples: 'Puntuaciones de idoneidad, análisis de brechas, benchmarks salariales, puntuaciones ATS, sugerencias de CV, cartas de presentación, planes de acción', basis: 'Ejecución del contrato (Art. 6(1)(b))' },
          { category: 'Datos de uso', examples: 'Páginas visitadas, funciones utilizadas, número de análisis, identificadores de sesión', basis: 'Intereses legítimos (Art. 6(1)(f))' },
          { category: 'Datos de pago', examples: 'Estado de la suscripción, período de facturación — datos de tarjeta en manos exclusivas de Stripe', basis: 'Ejecución del contrato (Art. 6(1)(b))' },
        ],
      },
      {
        id: 'how-we-use',
        title: '3. Cómo usamos tus datos',
        content: [
          'Para prestar el servicio: Enviamos tu texto de CV, la oferta de trabajo y las respuestas al cuestionario a la API Claude de Anthropic para generar tu análisis.',
          'Para operar la plataforma: Utilizamos datos de uso para aplicar la cuota de análisis de tu plan y prevenir el abuso.',
          'Para mejorar la plataforma: Analizamos patrones de uso anonimizados y agregados. No utilizamos el contenido personal de tu CV para este propósito.',
          'Para comunicarnos contigo: Enviamos correos electrónicos transaccionales. Solo enviaremos comunicaciones de marketing si das tu consentimiento.',
        ],
      },
      {
        id: 'ai-processing',
        title: '4. Cómo la IA procesa tus datos',
        highlight: true,
        content: [
          'Tu CV se envía a Anthropic. Al ejecutar un análisis, tu texto de CV, exportación de LinkedIn (si se proporcionó), oferta de trabajo y cuestionario se transmiten a la API de Anthropic. Anthropic es nuestro encargado del tratamiento en virtud de un Acuerdo de Tratamiento de Datos.',
          'Tus datos no se usan para entrenar modelos de IA. Las políticas de uso de la API de Anthropic prohíben el uso de datos enviados a través de la API para entrenar o ajustar sus modelos.',
          'Sin decisiones automatizadas con efecto jurídico. GapZero no toma decisiones automatizadas sobre ti en el sentido del artículo 22 del RGPD. Todos los resultados son herramientas para informar tus propias decisiones.',
          'El análisis de GitHub utiliza únicamente datos de repositorios públicos accesibles a través de la API pública de GitHub.',
        ],
      },
      {
        id: 'processors',
        title: '5. Encargados del tratamiento',
        content: [],
        processorTable: [
          { name: 'Anthropic', processes: 'Texto CV, oferta de trabajo, cuestionario (solo durante el análisis)', location: 'EE.UU.' },
          { name: 'Supabase', processes: 'Datos de cuenta, historial de análisis, perfil, seguimiento de empleos', location: 'UE / EE.UU.' },
          { name: 'Stripe', processes: 'Datos de tarjeta de pago, estado de suscripción', location: 'EE.UU. / UE' },
          { name: 'Vercel', processes: 'Registros de solicitudes web, ejecución de funciones serverless', location: 'CDN global' },
        ],
      },
      {
        id: 'transfers',
        title: '6. Transferencias internacionales de datos',
        content: [
          'Algunos de nuestros encargados están ubicados en Estados Unidos. Si estás en la UE o el Reino Unido, tus datos personales pueden transferirse fuera del EEE o el Reino Unido.',
          'Nos basamos en las siguientes salvaguardias:',
          '• Anthropic: Cláusulas Contractuales Tipo (CCT) de la UE y DPA de Anthropic, incluidas disposiciones UK IDTA.',
          '• Supabase: CCT con opciones de residencia de datos en la UE.',
          '• Stripe: Certificación del Marco de Privacidad de Datos UE-EE.UU. y CCT.',
          '• Vercel: CCT incluidas en el DPA de Vercel.',
        ],
      },
      {
        id: 'retention',
        title: '7. Cuánto tiempo conservamos tus datos',
        content: [
          '• Resultados de análisis e historial de carrera — conservados mientras tu cuenta esté activa. Eliminados al eliminar tu cuenta.',
          '• Texto de CV enviado para análisis — no almacenado por GapZero tras completar el análisis.',
          '• Datos de cuenta (correo electrónico) — hasta la eliminación de la cuenta o solicitud de supresión.',
          '• Registros de facturación — conservados 7 años por cumplimiento fiscal y contable.',
          '• Registros de uso — hasta 90 días para seguridad y prevención del fraude.',
        ],
      },
      {
        id: 'cookies',
        title: '8. Cookies',
        content: [
          'GapZero utiliza únicamente cookies de sesión — pequeños archivos almacenados en tu navegador para mantenerte conectado. No utilizamos cookies publicitarias, cookies de seguimiento de terceros ni cookies de análisis entre sitios.',
          '• Cookie de autenticación — establecida por Supabase Auth. Caduca al cerrar sesión o tras 7 días de inactividad.',
          '• Preferencia de idioma — almacena tu preferencia de idioma. No es de identificación personal.',
        ],
      },
      {
        id: 'your-rights',
        title: '9. Tus Derechos',
        content: ['Tienes derechos significativos sobre tus datos, según dónde te encuentres.'],
        rightsCards: [
          {
            title: 'RGPD (UE) & RGPD Reino Unido',
            items: [
              'Acceso — obtener una copia de tus datos',
              'Rectificación — corregir datos inexactos',
              'Supresión — eliminar tus datos ("derecho al olvido")',
              'Portabilidad — exportar tus datos en un formato común',
              'Limitación — suspender el tratamiento mientras se resuelve una disputa',
              'Oposición — oponerte al tratamiento basado en intereses legítimos',
              'Sin decisiones automatizadas con efecto jurídico',
            ],
          },
          {
            title: 'CCPA (California, EE.UU.)',
            items: [
              'Derecho a saber qué datos recopilamos y cómo los usamos',
              'Derecho a eliminar tu información personal',
              'Derecho a optar por no vender tus datos',
              'Derecho a no ser discriminado por ejercer tus derechos',
              'No vendemos tu información personal a ningún tercero',
            ],
          },
        ],
      },
      {
        id: 'contact-privacy',
        title: '10. Contacto y Delegado de Protección de Datos',
        content: [
          '[Nombre de la Empresa]',
          '[Dirección de la Empresa]',
          'Correo electrónico: [privacy@gapzero.app]',
          '[note] DPD (si procede): [Nombre DPD o "No designado — exención PYME aplicable"]',
        ],
      },
      {
        id: 'changes-privacy',
        title: '11. Cambios en esta Política',
        content: [
          'Para cambios materiales, te informaremos con al menos 30 días de antelación por correo electrónico o mediante un aviso destacado en la Plataforma.',
        ],
      },
    ],
  },

  // ── ITALIANO ───────────────────────────────────────────────────────────────
  it: {
    pageTitle: 'Informativa sulla Privacy',
    intro: 'Rispettiamo la tua privacy. Questa informativa spiega quali dati raccoglie GapZero, perché, per quanto tempo li conserviamo e quali diritti hai. L\'abbiamo redatta in un linguaggio chiaro — senza complessità legale inutile.',
    tableHeaders: { category: 'Categoria di dati', examples: 'Cosa raccogliamo', basis: 'Base giuridica (GDPR)' },
    processorHeaders: { name: 'Responsabile', processes: 'Cosa elabora', location: 'Sede' },
    sections: [
      {
        id: 'controller',
        title: '1. Chi è responsabile dei tuoi dati',
        content: [
          'GapZero è gestito da [Nome Società], registrata a [Indirizzo Società] ("noi", "ci", "nostro").',
          'Ai sensi del GDPR UE e del GDPR UK, siamo il titolare del trattamento dei dati personali che fornisci utilizzando gapzero.app.',
          'Contatto per la protezione dei dati: [privacy@gapzero.app]',
        ],
      },
      {
        id: 'what-we-collect',
        title: '2. Quali dati raccogliamo',
        content: ['Raccogliamo solo i dati necessari per fornirti il servizio.'],
        dataTable: [
          { category: 'Dati account', examples: 'Indirizzo e-mail, password crittografata, data di creazione account', basis: 'Esecuzione del contratto (Art. 6(1)(b))' },
          { category: 'Contenuto del CV', examples: 'Testo estratto dal tuo PDF CV — nome, storico lavorativo, competenze, formazione', basis: 'Esecuzione del contratto (Art. 6(1)(b))' },
          { category: 'Esportazione PDF LinkedIn', examples: 'Testo estratto dal tuo PDF LinkedIn — profilo, esperienza, competenze (upload opzionale)', basis: 'Esecuzione del contratto (Art. 6(1)(b))' },
          { category: 'Testo dell\'offerta di lavoro', examples: 'La descrizione del posto incollata o recuperata', basis: 'Esecuzione del contratto (Art. 6(1)(b))' },
          { category: 'Questionario carriera', examples: 'Ruolo attuale, ruolo target, anni di esperienza, paese, preferenza di lavoro', basis: 'Esecuzione del contratto (Art. 6(1)(b))' },
          { category: 'URL GitHub', examples: 'Il tuo URL del profilo GitHub pubblico (opzionale)', basis: 'Esecuzione del contratto / Consenso (Art. 6(1)(a))' },
          { category: 'Risultati analisi', examples: 'Punteggi di adeguatezza, analisi lacune, benchmark retributivi, punteggi ATS, suggerimenti CV, lettere di presentazione, piani d\'azione', basis: 'Esecuzione del contratto (Art. 6(1)(b))' },
          { category: 'Dati di utilizzo', examples: 'Pagine visitate, funzioni utilizzate, numero di analisi, identificatori di sessione', basis: 'Interessi legittimi (Art. 6(1)(f))' },
          { category: 'Dati di pagamento', examples: 'Stato abbonamento, periodo di fatturazione — dati carta detenuti esclusivamente da Stripe', basis: 'Esecuzione del contratto (Art. 6(1)(b))' },
        ],
      },
      {
        id: 'how-we-use',
        title: '3. Come utilizziamo i tuoi dati',
        content: [
          'Per fornire il servizio: Inviamo il testo del tuo CV, l\'offerta di lavoro e le risposte al questionario all\'API Claude di Anthropic per generare la tua analisi.',
          'Per operare la piattaforma: Utilizziamo i dati di utilizzo per applicare la quota di analisi del tuo piano e prevenire gli abusi.',
          'Per migliorare la piattaforma: Analizziamo pattern di utilizzo anonimi e aggregati. Non utilizziamo il contenuto personale del tuo CV per questo scopo.',
          'Per comunicare con te: Inviamo e-mail transazionali. Invieremo comunicazioni di marketing solo con il tuo consenso.',
        ],
      },
      {
        id: 'ai-processing',
        title: '4. Come l\'IA elabora i tuoi dati',
        highlight: true,
        content: [
          'Il tuo CV viene inviato ad Anthropic. Quando esegui un\'analisi, il testo del tuo CV, l\'esportazione LinkedIn (se fornita), l\'offerta di lavoro e il questionario vengono trasmessi all\'API di Anthropic. Anthropic è il nostro responsabile del trattamento ai sensi di un Accordo sul Trattamento dei Dati.',
          'I tuoi dati non vengono utilizzati per addestrare modelli IA. Le politiche d\'uso dell\'API di Anthropic vietano l\'utilizzo dei dati inviati tramite API per addestrare o perfezionare i loro modelli.',
          'Nessuna decisione automatizzata con effetto giuridico. GapZero non prende decisioni automatizzate che ti riguardano ai sensi dell\'articolo 22 del GDPR. Tutti i risultati sono strumenti per informare le tue decisioni.',
          'L\'analisi GitHub utilizza solo dati di repository pubblici accessibili tramite l\'API pubblica di GitHub.',
        ],
      },
      {
        id: 'processors',
        title: '5. Responsabili del trattamento terzi',
        content: [],
        processorTable: [
          { name: 'Anthropic', processes: 'Testo CV, offerta di lavoro, questionario (solo durante l\'analisi)', location: 'USA' },
          { name: 'Supabase', processes: 'Dati account, cronologia analisi, profilo, job tracker', location: 'UE / USA' },
          { name: 'Stripe', processes: 'Dati carta di pagamento, stato abbonamento', location: 'USA / UE' },
          { name: 'Vercel', processes: 'Registri richieste web, esecuzione funzioni serverless', location: 'CDN globale' },
        ],
      },
      {
        id: 'transfers',
        title: '6. Trasferimenti internazionali di dati',
        content: [
          'Alcuni dei nostri responsabili del trattamento sono basati negli Stati Uniti. Se sei nell\'UE o nel Regno Unito, i tuoi dati personali possono essere trasferiti al di fuori dello SEE o del Regno Unito.',
          'Ci basiamo sulle seguenti garanzie:',
          '• Anthropic: Clausole Contrattuali Standard (SCC) UE e DPA di Anthropic, incluse disposizioni UK IDTA.',
          '• Supabase: SCC con opzioni di residenza dei dati nell\'UE.',
          '• Stripe: Certificazione EU-US Data Privacy Framework e SCC.',
          '• Vercel: SCC incluse nel DPA di Vercel.',
        ],
      },
      {
        id: 'retention',
        title: '7. Per quanto tempo conserviamo i tuoi dati',
        content: [
          '• Risultati delle analisi e cronologia carriera — conservati finché il tuo account è attivo. Eliminati alla cancellazione dell\'account.',
          '• Testo CV inviato per l\'analisi — non conservato da GapZero dopo il completamento dell\'analisi.',
          '• Dati account (e-mail) — fino alla cancellazione dell\'account o richiesta di cancellazione.',
          '• Registrazioni di fatturazione — conservate 7 anni per conformità fiscale e contabile.',
          '• Registri di utilizzo — fino a 90 giorni per sicurezza e prevenzione delle frodi.',
        ],
      },
      {
        id: 'cookies',
        title: '8. Cookie',
        content: [
          'GapZero utilizza solo cookie di sessione — piccoli file di dati memorizzati nel tuo browser per mantenerti connesso. Non utilizziamo cookie pubblicitari, cookie di tracciamento di terze parti o cookie analitici che ti seguono sul web.',
          '• Cookie di autenticazione — impostato da Supabase Auth. Scade al logout o dopo 7 giorni di inattività.',
          '• Preferenza lingua — memorizza la tua preferenza linguistica. Non identificativa personalmente.',
        ],
      },
      {
        id: 'your-rights',
        title: '9. I Tuoi Diritti',
        content: ['Hai diritti significativi sui tuoi dati, a seconda di dove ti trovi.'],
        rightsCards: [
          {
            title: 'GDPR (UE) & GDPR UK',
            items: [
              'Accesso — ottenere una copia dei tuoi dati',
              'Rettifica — correggere dati inesatti',
              'Cancellazione — eliminare i tuoi dati ("diritto all\'oblio")',
              'Portabilità — esportare i tuoi dati in un formato comune',
              'Limitazione — sospendere il trattamento durante la risoluzione di una controversia',
              'Opposizione — opporsi al trattamento basato su interessi legittimi',
              'Nessuna decisione automatizzata con effetto giuridico',
            ],
          },
          {
            title: 'CCPA (California, USA)',
            items: [
              'Diritto di sapere quali dati raccogliamo e come li utilizziamo',
              'Diritto di eliminare le tue informazioni personali',
              'Diritto di rinunciare alla vendita dei tuoi dati',
              'Diritto alla non discriminazione per l\'esercizio dei tuoi diritti',
              'Non vendiamo le tue informazioni personali a terzi',
            ],
          },
        ],
      },
      {
        id: 'contact-privacy',
        title: '10. Contatti e Responsabile della Protezione dei Dati',
        content: [
          '[Nome Società]',
          '[Indirizzo Società]',
          'E-mail: [privacy@gapzero.app]',
          '[note] DPO (se applicabile): [Nome DPO o "Non designato — esenzione PMI applicabile"]',
        ],
      },
      {
        id: 'changes-privacy',
        title: '11. Modifiche a questa Informativa',
        content: [
          'Per modifiche sostanziali, ti informeremo con almeno 30 giorni di preavviso tramite e-mail o con un avviso prominente sulla Piattaforma.',
        ],
      },
    ],
  },
};
