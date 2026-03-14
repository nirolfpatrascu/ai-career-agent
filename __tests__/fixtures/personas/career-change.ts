import type { SyntheticPersona } from './types';

export const careerChangePersonas: SyntheticPersona[] = [
  // ────────────────────────────────────────────────────────────────────────────
  // D01: High School Teacher → Junior Full-Stack Developer
  // ────────────────────────────────────────────────────────────────────────────
  {
    id: 'D01',
    category: 'career-change',
    description: 'High school teacher pivoting to junior full-stack developer after completing a coding bootcamp. Zero professional tech experience.',
    cvText: `SARAH MITCHELL
Chicago, IL | sarah.mitchell@email.com | (312) 555-0198

PROFESSIONAL SUMMARY
Passionate educator with 8 years of experience teaching high school mathematics and computer science fundamentals, now transitioning into software development. Recently completed an intensive 16-week full-stack coding bootcamp. Strong analytical thinking, classroom management, and communication skills honed through years of explaining complex concepts to diverse learners. Eager to apply problem-solving mindset and newly acquired technical skills in a junior developer role.

EDUCATION
Full-Stack Web Development Bootcamp — Coding Temple, Chicago, IL (2025)
- 16-week immersive program covering HTML, CSS, JavaScript, React, Node.js, Express, PostgreSQL
- Capstone project: Built a classroom management app with user authentication and real-time notifications

Bachelor of Science in Mathematics Education — University of Illinois at Urbana-Champaign (2016)
- Minor in Computer Science
- GPA: 3.7/4.0

PROFESSIONAL EXPERIENCE

Mathematics & Introductory CS Teacher — Lincoln Park High School, Chicago, IL (2016 – 2025)
- Taught Algebra II, Pre-Calculus, AP Calculus AB, and Introduction to Computer Science to 120+ students per semester
- Developed custom curriculum for the introductory CS course including Scratch, basic Python exercises, and logic puzzles
- Implemented data-driven instruction by tracking student performance metrics in Excel and Google Sheets to identify at-risk students, improving pass rates by 18%
- Mentored the school's STEM club, guiding students through building simple websites and participating in math competitions
- Collaborated with 12 teachers in the math department on cross-curricular projects integrating technology
- Received Teacher of the Year nomination in 2021 and 2023 for innovative teaching methods
- Led professional development workshops on integrating technology tools (Google Classroom, Desmos, Khan Academy) into daily instruction

After-School Tutoring Coordinator — Lincoln Park High School (2018 – 2024)
- Managed a tutoring program serving 40+ students weekly across math and science subjects
- Trained and supervised 15 peer tutors, developing their communication and pedagogical skills
- Designed scheduling systems and tracked attendance using spreadsheets, streamlining program operations

BOOTCAMP PROJECTS

ClassTrack — Full-Stack Classroom Management App
- Built with React, Node.js, Express, and PostgreSQL
- Features include student roster management, grade tracking, parent communication portal
- Implemented JWT-based authentication and role-based access control
- Deployed on Render with CI/CD pipeline via GitHub Actions

MathQuiz Pro — Interactive Quiz Platform
- React front-end with dynamic question generation and score tracking
- RESTful API backend with Express serving quiz data from PostgreSQL
- Responsive design using Tailwind CSS

TECHNICAL SKILLS
Languages: JavaScript (ES6+), HTML5, CSS3, Python (basic), SQL
Frameworks: React, Node.js, Express
Databases: PostgreSQL
Tools: Git, GitHub, VS Code, Postman, Render, Netlify
Concepts: REST APIs, MVC architecture, responsive design, agile development (introduced in bootcamp)

ADDITIONAL SKILLS
- Strong written and verbal communication
- Curriculum development and instructional design
- Data analysis using spreadsheets for student performance tracking
- Public speaking and presentation skills
- Team collaboration and leadership`,
    questionnaire: {
      currentRole: 'High School Teacher',
      targetRole: 'Junior Full-Stack Developer',
      yearsExperience: 8,
      country: 'United States',
      workPreference: 'remote',
      currentSalary: 58000,
      targetSalary: 70000,
      language: 'en',
    },
    expectedTraits: {
      minFitScore: 2,
      maxFitScore: 4,
      expectedGapSeverities: ['critical', 'moderate'],
      mustHaveStrengthKeywords: ['communication', 'teaching', 'analytical', 'mentoring'],
      mustHaveGapKeywords: ['professional coding', 'frameworks', 'databases', 'deployment'],
      expectedCurrency: 'EUR',
      shouldIncludeTargetRole: true,
    },
  },

  // ────────────────────────────────────────────────────────────────────────────
  // D02: Accountant → Data Analyst
  // ────────────────────────────────────────────────────────────────────────────
  {
    id: 'D02',
    category: 'career-change',
    description: 'Accountant with strong Excel skills pivoting to data analyst. Learning SQL and Python through online courses, zero professional tech experience.',
    cvText: `JAMES WHITFIELD
Manchester, UK | james.whitfield@email.com | +44 7700 900123

PROFESSIONAL SUMMARY
Chartered accountant with 6 years of experience in financial reporting, auditing, and management accounting. Expert-level proficiency in Microsoft Excel including advanced formulas, pivot tables, VLOOKUP, and macro creation. Currently pursuing a career transition into data analytics, completing online courses in SQL, Python, and data visualization. Brings a strong foundation in numerical analysis, attention to detail, and the ability to translate data into actionable business insights.

PROFESSIONAL QUALIFICATIONS
- ACCA (Association of Chartered Certified Accountants) — Qualified 2021
- AAT Level 4 (Association of Accounting Technicians) — 2018

EDUCATION
BSc (Hons) Accounting and Finance — University of Manchester (2018)
- First Class Honours
- Dissertation: "Predictive Financial Modelling for SMEs Using Statistical Methods"

Google Data Analytics Professional Certificate — Coursera (In Progress, 2025)
- Modules completed: Foundations, Ask Questions, Prepare Data, Process Data, Analyze Data
- Working through the Share and Act phases with capstone project

PROFESSIONAL EXPERIENCE

Management Accountant — Greenfield Manufacturing Ltd, Manchester (2021 – 2025)
- Prepared monthly management accounts, budgets, and financial forecasts for a company with GBP 45M annual revenue
- Created advanced Excel dashboards consolidating data from multiple departments, reducing monthly reporting time from 5 days to 2 days
- Performed variance analysis on manufacturing costs, identifying GBP 320K in cost savings over 18 months
- Automated repetitive reporting tasks using Excel VBA macros, saving approximately 15 hours per month across the finance team
- Collaborated with operations and sales teams to develop KPI tracking systems using Excel and basic Power BI reports
- Presented quarterly financial summaries to the board of directors and senior leadership

Audit Associate — Price & Partners LLP, Manchester (2018 – 2021)
- Conducted statutory audits for 20+ clients across retail, manufacturing, and services sectors
- Analysed large financial datasets to identify discrepancies, trends, and potential risks
- Developed standardized audit workpapers and checklists improving team efficiency by 25%
- Trained and supervised 3 junior auditors on audit procedures and data sampling techniques
- Used IDEA (data analytics software) for audit sampling and anomaly detection in transactional data

SELF-STUDY & PROJECTS

Sales Data Analysis Project (Personal)
- Downloaded Kaggle retail sales dataset (100K+ rows) and performed exploratory analysis
- Used Excel for initial cleaning, then replicated analysis in Python with pandas and matplotlib
- Created summary dashboards in Google Sheets

SQL Practice — SQLZoo, LeetCode, HackerRank
- Completed 80+ SQL challenges covering joins, subqueries, window functions, and aggregation
- Practicing query optimization and database design concepts

TECHNICAL SKILLS
Advanced: Microsoft Excel (VLOOKUP, INDEX-MATCH, pivot tables, VBA macros, Power Query), financial modelling
Intermediate: Power BI (basic reports and DAX), IDEA audit analytics
Beginner: SQL (PostgreSQL, MySQL syntax), Python (pandas, matplotlib, NumPy basics), Google Sheets, Tableau (introductory)

ADDITIONAL SKILLS
- Financial analysis and reporting
- Strong numerical reasoning and attention to detail
- Stakeholder communication and board-level presentations
- Process improvement and workflow automation
- Team training and mentoring`,
    questionnaire: {
      currentRole: 'Management Accountant',
      targetRole: 'Data Analyst',
      yearsExperience: 6,
      country: 'United Kingdom',
      workPreference: 'hybrid',
      currentSalary: 48000,
      targetSalary: 45000,
      language: 'en',
    },
    expectedTraits: {
      minFitScore: 3,
      maxFitScore: 5,
      expectedGapSeverities: ['critical', 'moderate'],
      mustHaveStrengthKeywords: ['analytics', 'Excel', 'numerical', 'reporting'],
      mustHaveGapKeywords: ['SQL', 'Python', 'data visualization', 'Tableau'],
      expectedCurrency: 'GBP',
      shouldIncludeTargetRole: true,
    },
  },

  // ────────────────────────────────────────────────────────────────────────────
  // D03: Mechanical Engineer → Cloud Engineer
  // ────────────────────────────────────────────────────────────────────────────
  {
    id: 'D03',
    category: 'career-change',
    description: 'Mechanical engineer with some Python scripting experience looking to break into cloud engineering. No professional IT experience.',
    cvText: `FELIX BRAUN
Munich, Germany | felix.braun@email.com | +49 176 12345678

BERUFSPROFIL / PROFESSIONAL SUMMARY
Mechanical engineer with 7 years of experience in automotive product development and manufacturing process optimization. Developed Python scripts for automating CAD file processing and test data analysis. Strong foundation in systems thinking, process optimization, and cross-functional project management. Pursuing a career change to cloud engineering, currently studying for AWS Solutions Architect Associate certification and learning infrastructure-as-code tools.

EDUCATION
Diplom-Ingenieur (Dipl.-Ing.) Maschinenbau — Technische Universitat Munchen (2017)
- Specialization: Automotive Engineering and Production Technology
- Thesis: "Optimization of Injection Moulding Parameters Using Simulation and Statistical Analysis"

AWS Solutions Architect Associate — In Preparation (Expected Q2 2025)
- Completed: AWS Cloud Practitioner (CLF-C02) — March 2025
- Studying via Adrian Cantrill's course, Stephane Maarek on Udemy, and AWS Skill Builder labs

PROFESSIONAL EXPERIENCE

Senior Mechanical Engineer — BMW Group, Munich (2020 – 2025)
- Led design and development of structural components for the iX series, managing a team of 4 engineers
- Created Python scripts to automate batch processing of CATIA V5 models, reducing file conversion time by 60%
- Developed automated test data analysis pipelines using Python (pandas, matplotlib) to process vibration and fatigue test results from 50+ sensor channels
- Coordinated with suppliers across 5 countries, managing component specifications and quality requirements
- Implemented statistical process control (SPC) systems for production monitoring using Python and Excel
- Managed project timelines and resource allocation for 3 concurrent vehicle programs with budgets exceeding EUR 2M each
- Conducted root cause analysis using structured methodologies (8D, Ishikawa, FMEA)

Mechanical Engineer — ZF Friedrichshafen AG, Schweinfurt (2017 – 2020)
- Designed and tested transmission components using CATIA V5 and ANSYS Mechanical
- Performed finite element analysis (FEA) and computational fluid dynamics (CFD) simulations
- Wrote MATLAB scripts for processing test bench data and generating automated reports
- Collaborated with electronics and software teams on mechatronic systems integration
- Participated in agile-like sprint cycles for rapid prototyping and iterative design improvements

SELF-STUDY & CERTIFICATIONS

AWS Cloud Practitioner (CLF-C02) — Amazon Web Services (2025)

Cloud & DevOps Self-Study Projects:
- Built a personal website hosted on AWS (S3 + CloudFront + Route 53), deployed via GitHub Actions
- Created a simple serverless API using AWS Lambda, API Gateway, and DynamoDB for a personal expense tracker
- Completed the AWS Well-Architected Labs and 100 Days of Cloud challenge
- Practicing Terraform basics: provisioning EC2 instances, VPCs, and S3 buckets in a sandbox environment
- Studying Linux fundamentals using "The Linux Command Line" book and OverTheWire challenges

TECHNICAL SKILLS
Engineering: CATIA V5, ANSYS Mechanical, SolidWorks, MATLAB/Simulink, SAP PLM
Programming: Python (intermediate — scripting, pandas, automation), MATLAB, Bash (basic)
Cloud (learning): AWS (EC2, S3, Lambda, DynamoDB, VPC, IAM, CloudFront), Terraform (basic), GitHub Actions
Operating Systems: Windows (advanced), Linux (basic — Ubuntu)
Languages: German (native), English (fluent — C1)

ADDITIONAL SKILLS
- Systems thinking and complex problem decomposition
- Cross-functional project management and team leadership
- Statistical analysis and process optimization
- Vendor management and international collaboration
- Strong documentation and technical writing`,
    questionnaire: {
      currentRole: 'Senior Mechanical Engineer',
      targetRole: 'Cloud Engineer',
      yearsExperience: 7,
      country: 'Germany',
      workPreference: 'hybrid',
      currentSalary: 72000,
      targetSalary: 65000,
      language: 'en',
    },
    expectedTraits: {
      minFitScore: 2,
      maxFitScore: 4,
      expectedGapSeverities: ['critical', 'moderate'],
      mustHaveStrengthKeywords: ['problem-solving', 'automation', 'Python', 'project management'],
      mustHaveGapKeywords: ['cloud platforms', 'networking', 'IaC', 'Linux administration'],
      expectedCurrency: 'EUR',
      shouldIncludeTargetRole: true,
    },
  },

  // ────────────────────────────────────────────────────────────────────────────
  // D04: Nurse → Health-Tech Product Manager
  // ────────────────────────────────────────────────────────────────────────────
  {
    id: 'D04',
    category: 'career-change',
    description: 'Registered nurse with deep healthcare domain expertise pivoting to health-tech product management. No tech industry experience.',
    cvText: `PRIYA SHARMA
Toronto, ON, Canada | priya.sharma@email.com | (416) 555-0234

PROFESSIONAL SUMMARY
Registered Nurse (RN) with 10 years of clinical experience in emergency medicine and hospital informatics. Deep expertise in healthcare workflows, patient safety protocols, and clinical documentation systems. Served as a nurse informaticist and super-user for Epic EHR implementation, bridging the gap between clinical staff and IT teams. Passionate about leveraging technology to improve patient outcomes. Seeking to transition into health-tech product management where clinical expertise and user-centered thinking can drive meaningful product decisions.

EDUCATION
Bachelor of Science in Nursing (BScN) — University of Toronto (2014)
- Dean's List, graduated with distinction
- Clinical rotations: Emergency, ICU, Medical-Surgical, Community Health

Product Management Foundations — Product School, Online (2025)
- 8-week program covering product lifecycle, user research, roadmapping, and agile development
- Capstone: Designed a product requirements document for a patient triage mobile application

PROFESSIONAL EXPERIENCE

Clinical Nurse Informaticist — Sunnybrook Health Sciences Centre, Toronto (2022 – 2025)
- Served as clinical liaison between nursing staff and the IT department during Epic EHR implementation across 12 units
- Gathered workflow requirements from 200+ nurses through interviews, shadowing sessions, and surveys, translating clinical needs into system configuration specifications
- Created training materials and conducted 40+ training sessions for clinical staff on new EHR features
- Identified and documented 85 clinical workflow pain points, prioritizing them with the IT team and resolving 70% within the first 6 months post-go-live
- Participated in weekly stand-ups with the IT project team, contributing clinical perspective to sprint planning and user acceptance testing
- Reduced medication administration errors by 22% through advocating for improved alert design in the computerized physician order entry (CPOE) system
- Authored user stories and acceptance criteria for 15+ system enhancement requests

Senior Emergency Department Nurse (RN) — Toronto General Hospital (2017 – 2022)
- Provided direct patient care in a Level 1 trauma centre seeing 70,000+ annual visits
- Triaged patients using the Canadian Triage and Acuity Scale (CTAS), making rapid assessment decisions under pressure
- Served as charge nurse, coordinating shift operations for teams of 15+ nurses and managing patient flow
- Precepted and mentored 20+ new graduate nurses during their first year of practice
- Led a quality improvement project reducing patient wait times by 15% through workflow redesign and improved triage protocols
- Member of the Emergency Department Patient Safety Committee, contributing to incident analysis and process improvements

Staff Nurse (RN) — St. Michael's Hospital, Toronto (2014 – 2017)
- Provided patient care on a 30-bed medical-surgical unit
- Participated in the hospital's transition from paper charting to electronic health records
- Volunteered as a floor champion during the initial EHR rollout, supporting colleagues with adoption

CERTIFICATIONS & CONTINUING EDUCATION
- Registered Nurse (RN) — College of Nurses of Ontario
- Basic Life Support (BLS) and Advanced Cardiovascular Life Support (ACLS)
- Epic EHR Credentialed Trainer
- Product Management Foundations Certificate — Product School (2025)
- Agile Fundamentals — LinkedIn Learning (2025)
- Currently reading: "Inspired" by Marty Cagan, "The Lean Startup" by Eric Ries

SKILLS
Clinical: Emergency nursing, patient triage, EHR systems (Epic), clinical documentation, patient safety, quality improvement
Transferable: Requirements gathering, stakeholder management, user training, cross-functional collaboration, workflow analysis, process improvement, data-driven decision making
Technical Awareness: Basic understanding of FHIR/HL7 standards, healthcare data privacy (PHIPA/PIPEDA), experience writing user stories
Tools: Epic EHR, Microsoft Office Suite, Jira (basic exposure during EHR project), Miro, Confluence (view access)`,
    questionnaire: {
      currentRole: 'Clinical Nurse Informaticist',
      targetRole: 'Health-Tech Product Manager',
      yearsExperience: 10,
      country: 'Canada',
      workPreference: 'remote',
      currentSalary: 85000,
      targetSalary: 95000,
      language: 'en',
    },
    expectedTraits: {
      minFitScore: 3,
      maxFitScore: 5,
      expectedGapSeverities: ['critical', 'moderate'],
      mustHaveStrengthKeywords: ['healthcare', 'stakeholder', 'requirements', 'communication'],
      mustHaveGapKeywords: ['product management', 'agile', 'technical communication', 'roadmapping'],
      expectedCurrency: 'EUR',
      shouldIncludeTargetRole: true,
    },
  },

  // ────────────────────────────────────────────────────────────────────────────
  // D05: Lawyer → Legal-Tech Developer
  // ────────────────────────────────────────────────────────────────────────────
  {
    id: 'D05',
    category: 'career-change',
    description: 'Corporate lawyer with strong logical reasoning, beginning to learn Python programming, aiming to become a legal-tech developer.',
    cvText: `MAARTEN VAN DER BERG
Amsterdam, Netherlands | maarten.vdberg@email.com | +31 6 12345678

PROFESSIONAL SUMMARY
Corporate lawyer with 9 years of experience in contract law, mergers and acquisitions, and regulatory compliance at top-tier Dutch law firms. Recognized for structured analytical thinking, meticulous attention to detail, and the ability to navigate complex regulatory frameworks. Increasingly drawn to the intersection of law and technology, particularly contract automation, legal document analysis, and compliance tooling. Currently self-studying Python programming and web development fundamentals with the goal of transitioning into legal-tech software development.

EDUCATION
Master of Laws (LL.M.) in Corporate Law — University of Amsterdam (2015)
- Cum laude
- Thesis: "Smart Contracts and Their Legal Enforceability Under Dutch Law"

Bachelor of Laws (LL.B.) — Leiden University (2013)
- Specialization: European Business Law

CS50's Introduction to Computer Science — Harvard/edX (Completed 2025)
- Covered C, Python, SQL, HTML/CSS, JavaScript fundamentals
- Final project: A simple contract clause search tool built with Python and Flask

PROFESSIONAL EXPERIENCE

Senior Associate, Corporate & M&A — De Brauw Blackstone Westbroek, Amsterdam (2020 – 2025)
- Advised multinational clients on cross-border mergers, acquisitions, and joint ventures with deal values ranging from EUR 10M to EUR 500M
- Drafted, reviewed, and negotiated complex commercial contracts including share purchase agreements, shareholder agreements, and licensing deals
- Led due diligence processes coordinating teams of 5-8 lawyers and external advisors across multiple jurisdictions
- Developed standardized contract templates and clause libraries, improving drafting efficiency by 30%
- Mentored 4 junior associates on legal research methodology and contract drafting best practices
- Served as the firm's informal technology liaison, evaluating legal-tech tools such as Luminance (AI contract review), Kira Systems, and ContractPodAi for potential adoption
- Authored internal memoranda on the legal implications of AI-assisted contract analysis and automated compliance checking

Associate, Corporate Law — Houthoff, Amsterdam (2015 – 2020)
- Handled corporate governance matters, regulatory filings, and compliance reviews for financial services clients
- Analysed regulatory frameworks including GDPR, PSD2, and Dutch Financial Supervision Act (Wft)
- Conducted legal research on emerging fintech regulations and drafted client advisories
- Managed document review processes for litigation matters involving 10,000+ documents
- Participated in the firm's innovation committee exploring legal-tech solutions for document management

SELF-STUDY & PROJECTS

Contract Clause Analyzer (Python/Flask)
- Built a web application that allows users to upload contracts (PDF) and search for specific clause types
- Used Python with PyPDF2 for text extraction and basic regex pattern matching for clause identification
- Flask backend with simple HTML/CSS frontend; SQLite database for storing analyzed documents
- Deployed locally; learning Docker for containerization

Python Scripting for Legal Tasks
- Wrote scripts to automate repetitive document formatting tasks (merge PDFs, extract text, batch rename)
- Built a simple script using the OpenAI API to summarize long legal documents
- Practicing web scraping (BeautifulSoup) to collect Dutch case law from open databases

Ongoing Learning
- Currently working through "Automate the Boring Stuff with Python"
- Starting The Odin Project for web development fundamentals (HTML, CSS, JavaScript)
- Enrolled in an SQL course on DataCamp; completed basic joins and aggregation modules

TECHNICAL SKILLS
Programming: Python (beginner — scripts, Flask basics), SQL (beginner), HTML/CSS (basic), JavaScript (very basic)
Legal Tech Tools: Luminance, Kira Systems, ContractPodAi, Relativity (eDiscovery)
Other Tools: Microsoft Office Suite (advanced), Adobe Acrobat, iManage DMS

LANGUAGES
Dutch (native), English (fluent — C2), German (conversational — B2), French (basic — A2)

ADDITIONAL SKILLS
- Structured analytical and logical reasoning
- Contract drafting and negotiation
- Regulatory analysis and compliance
- Due diligence and project coordination
- Cross-jurisdictional legal research
- Client relationship management`,
    questionnaire: {
      currentRole: 'Senior Associate Corporate Lawyer',
      targetRole: 'Legal-Tech Developer',
      yearsExperience: 9,
      country: 'Netherlands',
      workPreference: 'hybrid',
      currentSalary: 95000,
      targetSalary: 65000,
      language: 'en',
    },
    expectedTraits: {
      minFitScore: 2,
      maxFitScore: 4,
      expectedGapSeverities: ['critical', 'moderate'],
      mustHaveStrengthKeywords: ['analytical', 'logic', 'legal', 'attention to detail'],
      mustHaveGapKeywords: ['programming', 'web development', 'databases', 'software engineering'],
      expectedCurrency: 'EUR',
      shouldIncludeTargetRole: true,
    },
  },

  // ────────────────────────────────────────────────────────────────────────────
  // D06: Graphic Designer → UI/UX Developer
  // ────────────────────────────────────────────────────────────────────────────
  {
    id: 'D06',
    category: 'career-change',
    description: 'Graphic designer with 2 years of design experience and basic HTML/CSS knowledge, transitioning to UI/UX developer role.',
    cvText: `LUCIA FERNANDEZ GARCIA
Barcelona, Spain | lucia.fernandez@email.com | +34 612 345 678

PROFESSIONAL SUMMARY
Creative graphic designer with 2 years of professional experience in branding, print design, and digital marketing assets. Self-taught in HTML and CSS through personal projects and online tutorials, with a growing passion for building interactive web experiences. Strong visual design sensibility including typography, colour theory, layout composition, and user-centered design principles. Seeking to transition into a UI/UX developer role where design skills can be combined with front-end coding to create beautiful, functional interfaces.

EDUCATION
Bachelor's Degree in Graphic Design — Escola Massana, Barcelona (2022)
- Final project: Complete brand identity and responsive website mockup for a local sustainable fashion brand
- Coursework included typography, visual communication, colour theory, interaction design, and art history

Google UX Design Professional Certificate — Coursera (2024)
- Completed all 7 courses covering UX research, wireframing, prototyping, and usability testing
- Case study: Designed a mobile app for neighbourhood event discovery, from research through high-fidelity prototype

freeCodeCamp Responsive Web Design Certification (2024)
- Completed curriculum covering HTML5, CSS3, Flexbox, CSS Grid, and accessibility fundamentals

PROFESSIONAL EXPERIENCE

Graphic Designer — Estudio Creativo Sol, Barcelona (2023 – 2025)
- Designed brand identities, marketing materials, and social media assets for 15+ clients across hospitality, fashion, and tech sectors
- Created UI mockups and design assets for 3 client websites using Figma, collaborating with external web developers on implementation
- Developed email newsletter templates with custom HTML/CSS coding within Mailchimp, achieving a 20% improvement in click-through rates
- Produced responsive email designs tested across 10+ email clients and devices
- Conducted informal user feedback sessions on website mockups with client stakeholders, iterating on designs based on input
- Managed multiple concurrent projects with tight deadlines, coordinating with copywriters, photographers, and printers

Junior Graphic Designer — Agencia Pixel, Barcelona (2022 – 2023)
- Assisted senior designers with layout production for print and digital campaigns
- Created social media graphics and banner ads for 8 clients using Adobe Creative Suite
- Maintained brand consistency across deliverables by developing and enforcing style guides
- Contributed to the agency's website redesign project by creating Figma wireframes and visual mockups

PERSONAL PROJECTS

Personal Portfolio Website — luciafernandez.dev
- Built from scratch using HTML5, CSS3 (Flexbox and Grid), and basic JavaScript for navigation interactions
- Fully responsive design across mobile, tablet, and desktop breakpoints
- Hosted on GitHub Pages; uses semantic HTML for basic accessibility

Restaurant Landing Page (Practice Project)
- One-page responsive site for a fictional tapas restaurant
- Implemented CSS animations for scroll effects and a mobile-friendly hamburger menu using vanilla JavaScript
- Focused on performance: optimized images, minimal dependencies

Currently Learning
- JavaScript fundamentals through The Odin Project (completed DOM manipulation module)
- Introduction to React via Scrimba's free course (in progress)
- Studying WCAG 2.1 accessibility guidelines

TECHNICAL SKILLS
Design: Figma (advanced), Adobe Photoshop, Adobe Illustrator, Adobe InDesign, Sketch
Front-End: HTML5 (intermediate), CSS3 (intermediate — Flexbox, Grid, animations), JavaScript (beginner — DOM manipulation)
Tools: GitHub/Git (basic), VS Code, Chrome DevTools, Mailchimp (HTML templates), Canva
Concepts: Responsive design (basic), wireframing, prototyping, user research, typography, colour theory, brand identity

LANGUAGES
Spanish (native), Catalan (native), English (fluent — B2/C1)`,
    questionnaire: {
      currentRole: 'Graphic Designer',
      targetRole: 'UI/UX Developer',
      yearsExperience: 2,
      country: 'Spain',
      workPreference: 'remote',
      currentSalary: 26000,
      targetSalary: 35000,
      language: 'en',
    },
    expectedTraits: {
      minFitScore: 4,
      maxFitScore: 6,
      expectedGapSeverities: ['critical', 'moderate', 'minor'],
      mustHaveStrengthKeywords: ['design', 'Figma', 'typography', 'visual'],
      mustHaveGapKeywords: ['JavaScript', 'React', 'responsive design', 'accessibility'],
      expectedCurrency: 'EUR',
      shouldIncludeTargetRole: true,
    },
  },

  // ────────────────────────────────────────────────────────────────────────────
  // D07: Restaurant Manager → Scrum Master
  // ────────────────────────────────────────────────────────────────────────────
  {
    id: 'D07',
    category: 'career-change',
    description: 'Restaurant manager with strong team leadership experience but zero tech background, aiming to become a Scrum Master.',
    cvText: `ANDREI POPESCU
Bucharest, Romania | andrei.popescu@email.com | +40 722 123 456

PROFESSIONAL SUMMARY
Experienced restaurant and hospitality manager with 8 years of leading high-pressure, fast-paced teams in premium dining establishments. Proven track record in team coordination, conflict resolution, operational efficiency, and delivering exceptional customer experiences under tight constraints. Natural servant-leader who thrives on removing obstacles for team members and fostering a collaborative environment. Pursuing a transition into the technology sector as a Scrum Master, leveraging extensive people management skills and a growing understanding of agile methodologies.

EDUCATION
Bachelor's Degree in Hospitality Management — Academy of Economic Studies (ASE), Bucharest (2016)
- Specialization: Hotel and Restaurant Management
- Dissertation: "Operational Efficiency in High-Volume Restaurant Settings"

Professional Scrum Master I (PSM I) — Scrum.org (2025)
- Passed with 92% score
- Studied using the Scrum Guide, Scrum.org learning paths, and "Scrum: The Art of Doing Twice the Work in Half the Time" by Jeff Sutherland

Agile Foundations — LinkedIn Learning (2025)
- Covered Scrum, Kanban, XP, and Lean principles

PROFESSIONAL EXPERIENCE

General Manager — La Maison, Bucharest (2021 – 2025)
- Managed all daily operations of a 120-seat fine dining restaurant with annual revenue of approximately RON 4.5M
- Led a cross-functional team of 35 staff including kitchen, front-of-house, bar, and administrative personnel
- Conducted daily pre-shift briefings (analogous to daily stand-ups) to align the team on priorities, special events, reservations, and any operational challenges
- Implemented a visual task management system using a physical Kanban board in the kitchen and service areas, reducing order errors by 25% and improving table turnover time
- Resolved inter-team conflicts between kitchen and service staff through facilitated discussions and process improvements, improving team satisfaction scores by 30%
- Managed vendor relationships with 20+ suppliers, negotiating contracts and ensuring consistent quality of ingredients and supplies
- Introduced a weekly retrospective practice with team leads to identify operational improvements, resulting in 15+ implemented process changes over 2 years
- Coordinated event planning for private dining (50+ events per year), managing timelines, resource allocation, and stakeholder expectations
- Trained and onboarded 60+ new employees, creating standardized training materials and mentoring programs

Assistant Manager — Caru' cu Bere, Bucharest (2018 – 2021)
- Supported the General Manager in overseeing operations for one of Bucharest's most iconic restaurants (300+ seats)
- Managed shift scheduling for 25 front-of-house staff, optimizing coverage based on reservation data and historical demand patterns
- Developed and implemented a customer feedback tracking system, categorizing and prioritizing service improvement areas
- Led the restaurant's transition to a digital reservation and table management system (TheFork Manager)
- Handled customer complaints and escalations, maintaining a 4.7/5.0 average rating on Google Reviews

Shift Supervisor — Hard Rock Cafe, Bucharest (2016 – 2018)
- Supervised teams of 10-15 staff during high-volume shifts serving 400+ covers per night
- Ensured adherence to Hard Rock's global brand standards and operational procedures
- Assisted with inventory management, stock control, and waste reduction initiatives

CERTIFICATIONS & TRAINING
- Professional Scrum Master I (PSM I) — Scrum.org (2025)
- Food Safety & Hygiene Level 4 — HACCP certified
- First Aid at Work — Red Cross Romania
- Currently studying: "Coaching Agile Teams" by Lyssa Adkins; preparing for PSM II

SKILLS
Leadership: Team management (35+ people), servant leadership, conflict resolution, mentoring, onboarding
Operational: Process improvement, workflow optimization, event coordination, vendor management, scheduling
Agile Knowledge: Scrum framework (theoretical), Kanban (practical implementation in hospitality), retrospectives, daily stand-ups
Technical: Microsoft Office (intermediate), Google Workspace, POS systems, reservation management software (TheFork, OpenTable)
Languages: Romanian (native), English (fluent — C1), French (conversational — B1)`,
    questionnaire: {
      currentRole: 'Restaurant General Manager',
      targetRole: 'Scrum Master',
      yearsExperience: 8,
      country: 'Romania',
      workPreference: 'onsite',
      currentSalary: 5500,
      targetSalary: 7000,
      language: 'en',
    },
    expectedTraits: {
      minFitScore: 3,
      maxFitScore: 5,
      expectedGapSeverities: ['critical', 'moderate'],
      mustHaveStrengthKeywords: ['leadership', 'team management', 'conflict resolution', 'process improvement'],
      mustHaveGapKeywords: ['agile methodology', 'technical understanding', 'tooling', 'software development lifecycle'],
      expectedCurrency: 'RON',
      shouldIncludeTargetRole: true,
    },
  },

  // ────────────────────────────────────────────────────────────────────────────
  // D08: Journalist → Content Strategist / SEO Tech
  // ────────────────────────────────────────────────────────────────────────────
  {
    id: 'D08',
    category: 'career-change',
    description: 'Journalist with 5 years of writing experience and basic WordPress knowledge transitioning to content strategist with SEO tech focus.',
    cvText: `EMMA RICHARDSON
Sydney, Australia | emma.richardson@email.com | +61 412 345 678

PROFESSIONAL SUMMARY
Award-winning journalist with 5 years of experience in digital and print media, specializing in technology news, business features, and investigative reporting. Published 300+ articles across major Australian media outlets with a combined readership of millions. Experienced in deadline-driven writing, audience research, and editorial strategy. Proficient in WordPress for content publishing and basic site management. Transitioning into content strategy and SEO technology, seeking to combine strong editorial skills with data-driven content optimization to drive organic growth for technology companies.

EDUCATION
Bachelor of Arts (Journalism) — University of Technology Sydney (2019)
- Major in Digital Media, Minor in Business
- Vice-Chancellor's Award for Academic Excellence
- Editor of the university newspaper Vertigo in final year

HubSpot Content Marketing Certification (2025)
HubSpot SEO Certification (2025)
Google Analytics 4 Certification — Google Skillshop (2025)

PROFESSIONAL EXPERIENCE

Senior Technology Reporter — The Sydney Morning Herald, Sydney (2022 – 2025)
- Wrote 150+ articles on technology companies, startups, cybersecurity, and digital policy with an average of 15,000 page views per article
- Managed a weekly technology column covering emerging trends in AI, fintech, and SaaS, growing newsletter subscribers from 2,000 to 8,500 over 2 years
- Conducted data-driven investigations using public datasets, FOI requests, and basic data analysis in Google Sheets
- Developed an internal style guide for digital-first publishing, improving SEO visibility of technology section articles by establishing consistent headline and meta description practices
- Published and managed articles in the WordPress CMS, including featured images, categories, tags, and basic on-page SEO optimization
- Interviewed 200+ industry executives, founders, and policy makers, building a extensive professional network in the Australian tech ecosystem
- Mentored 3 junior reporters on digital journalism techniques and audience engagement strategies

Journalist — Business Insider Australia, Sydney (2019 – 2022)
- Produced 180+ articles covering business, finance, and technology news in a high-volume digital newsroom
- Achieved top-10 most-read articles ranking 12 times during tenure, with the highest-performing piece reaching 250,000 views
- Managed story workflow in WordPress, scheduling content for optimal publishing times based on audience analytics
- Used Google Analytics to track article performance, identifying trending topics and audience preferences to inform editorial planning
- Created multimedia content packages including written articles, social media threads, and short-form video scripts
- Collaborated with the SEO team on keyword research for major feature articles, learning the basics of Ahrefs and Google Search Console

Freelance Writer (Part-time alongside full-time roles) — Various Publications (2020 – Present)
- Contributing writer for Wired Australia, Gizmodo, and various industry blogs
- Managed own WordPress blog covering tech career advice, achieving 3,000 monthly organic visitors
- Handled all aspects of blog management: content planning, writing, on-page SEO, image optimization, and basic Google Analytics reporting

SELF-STUDY & PROJECTS

Personal Tech Career Blog — techcareerinsider.com.au
- Self-hosted WordPress site with custom theme modifications (basic PHP/CSS edits)
- Implemented Yoast SEO plugin, Google Analytics 4, and Google Search Console
- Grew organic traffic from 0 to 3,000 monthly visitors over 12 months through consistent content and basic SEO practices
- Experimented with A/B testing headlines and meta descriptions

SEO & Analytics Learning
- Completed Ahrefs Academy free courses (keyword research, link building, site audit)
- Studying Screaming Frog for technical SEO audits
- Learning basic HTML/CSS to better understand technical SEO elements (schema markup, structured data)
- Practising Google Looker Studio (Data Studio) for building content performance dashboards

TECHNICAL SKILLS
Writing & Publishing: WordPress (intermediate — publishing, basic theme customization, plugin management), Medium, Substack, Google Docs
SEO & Analytics: Google Analytics 4 (beginner-intermediate), Google Search Console (basic), Ahrefs (basic), Yoast SEO, Screaming Frog (learning)
Marketing Tools: HubSpot (certified — content marketing module), Mailchimp (email campaigns), Canva (social graphics)
Data: Google Sheets (intermediate — pivot tables, charts), Google Looker Studio (basic)
Technical: HTML/CSS (basic understanding for CMS customization), basic command line for WordPress hosting

AWARDS
- Walkley Young Journalist of the Year — Finalist (2023)
- IT Journalism Awards — Best Technology Feature (2022)`,
    questionnaire: {
      currentRole: 'Senior Technology Reporter',
      targetRole: 'Content Strategist',
      targetRole2: 'SEO Specialist',
      yearsExperience: 5,
      country: 'Australia',
      workPreference: 'hybrid',
      currentSalary: 85000,
      targetSalary: 90000,
      language: 'en',
    },
    expectedTraits: {
      minFitScore: 3,
      maxFitScore: 5,
      expectedGapSeverities: ['critical', 'moderate', 'minor'],
      mustHaveStrengthKeywords: ['writing', 'editorial', 'content', 'communication'],
      mustHaveGapKeywords: ['analytics', 'SEO tools', 'technical content', 'CMS customization'],
      expectedCurrency: 'AUD',
      shouldIncludeTargetRole: true,
    },
  },

  // ────────────────────────────────────────────────────────────────────────────
  // D09: Electrician → IoT Developer
  // ────────────────────────────────────────────────────────────────────────────
  {
    id: 'D09',
    category: 'career-change',
    description: 'Licensed electrician with electronics knowledge but zero programming experience, aiming to become an IoT developer.',
    cvText: `TOMASZ KOWALSKI
Krakow, Poland | tomasz.kowalski@email.com | +48 512 345 678

PROFESSIONAL SUMMARY
Licensed electrician with 12 years of experience in industrial and commercial electrical installations, automation systems, and building management systems (BMS). Deep practical knowledge of electrical circuits, sensors, actuators, PLCs, and industrial communication protocols. Hands-on experience with Siemens and Allen-Bradley programmable logic controllers for factory automation. Increasingly interested in the convergence of traditional electrical systems with the Internet of Things, seeking to transition into IoT development where practical electronics expertise can be combined with software skills.

EDUCATION
Technical Diploma in Electrical Engineering — Zespol Szkol Elektrycznych nr 1, Krakow (2013)
- Specialization: Industrial Electrical Systems and Automation
- Graduated with distinction

Journeyman Electrician Certificate — Polish Electrical Association (SEP) (2013)
- Category E (installation) and D (supervision) qualifications up to 1kV

Arduino & IoT Fundamentals — Udemy Course by Rui Santos (Completed 2025)
- Covered Arduino programming (C/C++ basics), sensor interfacing, Wi-Fi connectivity, MQTT protocol basics

PROFESSIONAL EXPERIENCE

Senior Electrician / Automation Technician — TAURON Polska Energia, Krakow (2019 – 2025)
- Led electrical installation and maintenance for industrial facilities including power substations, factory floor automation, and building management systems
- Programmed and maintained Siemens S7-1200 and S7-1500 PLCs using TIA Portal for production line automation, developing ladder logic and structured text programs
- Configured industrial HMI (Human-Machine Interface) panels for operator control stations
- Installed and commissioned industrial sensor networks including temperature, pressure, flow, and vibration sensors across 5 manufacturing facilities
- Designed and implemented a building management system (BMS) for a 20,000 sqm office complex, integrating HVAC, lighting, and access control systems via BACnet and Modbus protocols
- Troubleshot complex electrical and automation faults using oscilloscopes, multimeters, and protocol analyzers, reducing mean time to repair by 35%
- Read and interpreted electrical schematics, P&ID diagrams, and network architecture drawings
- Trained and supervised a team of 4 junior electricians on safety procedures and technical best practices
- Maintained documentation for all installations including as-built drawings and maintenance schedules

Electrician — ElektroMontaz Krakow Sp. z o.o. (2015 – 2019)
- Performed commercial and residential electrical installations complying with Polish PN-IEC standards
- Installed structured cabling systems (Ethernet Cat6, fibre optic) for office buildings
- Worked on smart home installations including KNX bus systems for lighting and climate control
- Conducted periodic electrical inspections and safety audits for commercial premises

Apprentice Electrician — Various contractors, Krakow (2013 – 2015)
- Assisted with residential and light commercial electrical installations
- Gained foundational skills in conduit work, panel wiring, circuit testing, and safety compliance

SELF-STUDY & PROJECTS

Home Automation Prototype
- Built a home environment monitoring system using Arduino Mega and ESP32 microcontrollers
- Integrated temperature (DHT22), humidity, motion (PIR), and light (LDR) sensors
- Configured ESP32 to send sensor data via MQTT to a Mosquitto broker running on a Raspberry Pi
- Created a basic Node-RED dashboard for data visualization
- Currently learning to push data to InfluxDB and visualize with Grafana

Smart Garden Irrigation System
- Designed a soil moisture monitoring and automated irrigation system using Arduino and relay modules
- Used basic C/C++ (Arduino IDE) to program sensor reading, threshold logic, and relay control
- Planning to add Wi-Fi connectivity and a simple web interface using ESP32

Ongoing Learning
- Working through "Exploring Arduino" by Jeremy Blum
- Starting Python basics on Codecademy (15% complete)
- Watching YouTube tutorials on MQTT, REST APIs, and cloud platforms (AWS IoT Core overview)
- Interested in learning about LoRaWAN and other LPWAN technologies for industrial IoT

TECHNICAL SKILLS
Electrical: Industrial installations (up to 1kV), power distribution, motor control, cable management, testing and commissioning
Automation: Siemens PLC (S7-1200, S7-1500, TIA Portal), Allen-Bradley (RSLogix), HMI programming, ladder logic, structured text
Protocols: BACnet, Modbus (RTU/TCP), KNX, 4-20mA, RS-485 — MQTT (learning)
Electronics: Circuit design (basic), sensor interfacing, relay logic, oscilloscope and multimeter operation
IoT (learning): Arduino (intermediate), ESP32 (beginner), Raspberry Pi (basic), Node-RED (basic), MQTT (basic)
Programming: C/C++ for Arduino (beginner), Python (very beginner), ladder logic (intermediate)
Tools: TIA Portal, ETS (KNX), AutoCAD Electrical (basic), Fluke testing instruments

LANGUAGES
Polish (native), English (intermediate — B1/B2), German (basic — A2)`,
    questionnaire: {
      currentRole: 'Senior Electrician / Automation Technician',
      targetRole: 'IoT Developer',
      yearsExperience: 12,
      country: 'Poland',
      workPreference: 'onsite',
      currentSalary: 8500,
      targetSalary: 12000,
      language: 'en',
    },
    expectedTraits: {
      minFitScore: 2,
      maxFitScore: 4,
      expectedGapSeverities: ['critical', 'moderate'],
      mustHaveStrengthKeywords: ['electronics', 'sensors', 'automation', 'hardware'],
      mustHaveGapKeywords: ['programming', 'embedded systems', 'networking protocols', 'cloud'],
      expectedCurrency: 'PLN',
      shouldIncludeTargetRole: true,
    },
  },

  // ────────────────────────────────────────────────────────────────────────────
  // D10: Music Producer → Audio Software Developer
  // ────────────────────────────────────────────────────────────────────────────
  {
    id: 'D10',
    category: 'career-change',
    description: 'Music producer with 3 years of audio engineering experience and basic Python scripting, aiming to become an audio software developer.',
    cvText: `ERIK LINDQVIST
Stockholm, Sweden | erik.lindqvist@email.com | +46 70 123 4567

PROFESSIONAL SUMMARY
Music producer and audio engineer with 3 years of professional experience in music production, sound design, and studio recording. Deep understanding of digital audio fundamentals including signal processing, synthesis, sampling, mixing, and mastering. Experienced with Digital Audio Workstations (DAWs), plugin architectures (VST/AU), and MIDI systems. Basic Python scripting skills developed through automating audio file processing workflows. Passionate about the technical foundations of audio software and seeking to transition into audio software development, with a focus on building plugins, synthesizers, and audio processing tools.

EDUCATION
Bachelor of Arts in Music Production — Royal College of Music (KMH), Stockholm (2021)
- Specialization: Electronic Music Production and Sound Design
- Coursework included acoustics, psychoacoustics, digital audio theory, music technology, and studio engineering
- Thesis project: Designed and produced an album using only custom-built software synthesizers (Max/MSP)

CS50's Introduction to Computer Science — Harvard/edX (Completed 2025)
- Covered C, Python, data structures, algorithms
- Final project: A Python-based audio file batch processor with metadata editing

PROFESSIONAL EXPERIENCE

Music Producer & Sound Designer — Epidemic Sound, Stockholm (2022 – 2025)
- Produced 200+ original music tracks for the Epidemic Sound library, spanning electronic, ambient, cinematic, and pop genres
- Designed 500+ custom sound effects and Foley recordings for film, gaming, and commercial clients
- Operated and maintained a professional recording studio including a 32-channel Avid S6 console, Pro Tools HDX system, and extensive outboard processing gear
- Developed deep expertise in plugin architectures through extensive daily use of 50+ VST/AU plugins for synthesis, effects processing, and mixing
- Created custom Max/MSP patches for generative music experiments and unique sound design techniques
- Wrote Python scripts to automate audio file processing workflows: batch format conversion (WAV/FLAC/MP3), loudness normalization (LUFS), metadata tagging (ID3/BWF), and file organization
- Collaborated with the engineering team to beta-test and provide detailed feedback on internal audio tools and platform features
- Provided technical specifications and requirements to software developers for custom audio processing tools needed by the production team

Freelance Audio Engineer / Producer — Self-employed, Stockholm (2021 – 2022)
- Recorded, mixed, and mastered tracks for 10+ independent artists and bands in rented studio spaces
- Handled all technical aspects of sessions: microphone selection, signal chain configuration, recording, editing, mixing, and mastering
- Managed client relationships, project timelines, and invoicing
- Built a personal studio setup including acoustic treatment design, equipment selection, and DAW configuration

Studio Intern — Cosmos Studios, Stockholm (2020 – 2021)
- Assisted senior engineers with recording sessions for advertising and film scoring projects
- Learned studio maintenance including calibration of monitoring systems, cable management, and equipment troubleshooting
- Gained hands-on experience with analog synthesis (Moog, Roland, Elektron hardware)

SELF-STUDY & PROJECTS

Simple Python Synthesizer
- Built a basic subtractive synthesizer in Python using NumPy for waveform generation and sounddevice for audio output
- Implemented oscillators (sine, saw, square), a simple low-pass filter, and ADSR envelope
- MIDI input support via mido library for real-time keyboard playing
- Learning to port concepts to C++ for real-time performance

Audio Analysis Tool (Python)
- Developed a script using librosa and matplotlib to visualize audio spectrograms, waveforms, and frequency content
- Added beat detection and tempo estimation features
- Used for analysing reference tracks and understanding mixing decisions visually

Ongoing Learning
- Working through "The Audio Programming Book" by Richard Boulanger (MIT Press)
- Started learning C++ through "Programming: Principles and Practice Using C++" by Bjarne Stroustrup (Chapter 8)
- Exploring the JUCE framework documentation and tutorials for building audio plugins
- Studying DSP fundamentals: "Understanding Digital Signal Processing" by Richard Lyons (Chapters 1-4)
- Experimenting with Faust, a functional audio DSP language, for prototyping audio effects

TECHNICAL SKILLS
Audio Production: Pro Tools HDX (expert), Ableton Live (expert), Logic Pro (advanced), Cubase (intermediate)
Sound Design: Max/MSP (intermediate), Kontakt (sampling), Serum/Vital (synthesis), iZotope suite
Audio Formats & Standards: WAV, FLAC, MP3, AIFF, LUFS loudness standards, BWF metadata, MIDI protocol
Programming: Python (beginner-intermediate — scripting, NumPy, librosa, mido), C++ (very beginner), Max/MSP patching
DSP Knowledge: Basic understanding of filters, FFT, convolution, oscillators, envelopes (theoretical + Max/MSP)
Tools: Git (basic), VS Code, command line (macOS), FFmpeg (command line audio processing)

LANGUAGES
Swedish (native), English (fluent — C2), Norwegian (conversational)`,
    questionnaire: {
      currentRole: 'Music Producer & Sound Designer',
      targetRole: 'Audio Software Developer',
      yearsExperience: 3,
      country: 'Sweden',
      workPreference: 'remote',
      currentSalary: 35000,
      targetSalary: 45000,
      language: 'en',
    },
    expectedTraits: {
      minFitScore: 2,
      maxFitScore: 4,
      expectedGapSeverities: ['critical', 'moderate'],
      mustHaveStrengthKeywords: ['audio', 'sound design', 'DSP', 'music production'],
      mustHaveGapKeywords: ['C++', 'DSP programming', 'software architecture', 'audio frameworks'],
      expectedCurrency: 'EUR',
      shouldIncludeTargetRole: true,
    },
  },
];
