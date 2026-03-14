import type { SyntheticPersona } from './types';

export const betterPayingPivotPersonas: SyntheticPersona[] = [
  // ── C01: QA Engineer → DevOps Engineer ─────────────────────────────────
  {
    id: 'C01',
    category: 'better-paying',
    description:
      'QA Engineer with 4 years experience pivoting to DevOps Engineer. Has some CI/CD and Linux exposure but lacks cloud platforms, IaC, and containerization depth. Romania, remote, 3 months prep.',
    cvText: `Andrei Popescu
QA Engineer

Contact
Email: andrei.popescu@email.com
Phone: +40 723 456 789
Location: Cluj-Napoca, Romania
LinkedIn: linkedin.com/in/andreipopescu

Professional Summary
Detail-oriented QA Engineer with 4 years of experience ensuring software quality across web and mobile applications. Proficient in manual and automated testing, with growing exposure to CI/CD pipelines and Linux server environments. Adept at identifying defects early in the development cycle and collaborating closely with development teams to improve release quality.

Experience

QA Engineer — CloudSoft Solutions, Cluj-Napoca
January 2022 – Present
- Design and execute test plans for microservices-based SaaS platform serving 50,000+ users
- Write and maintain automated regression suites using Selenium WebDriver and Python
- Configure and maintain Jenkins pipelines for nightly test runs across staging environments
- Perform basic Linux server administration for QA environments (Ubuntu 20.04/22.04)
- Collaborate with DevOps team on deployment validation and smoke testing after releases
- Reduced production escape rate by 35% through improved test coverage metrics
- Write Bash scripts to automate repetitive testing tasks and environment setup

Junior QA Engineer — TechBridge SRL, Bucharest
March 2020 – December 2021
- Executed manual test cases for e-commerce platform handling 10,000 daily transactions
- Created and maintained test documentation including test plans, test cases, and bug reports in Jira
- Assisted in setting up basic CI/CD pipelines using GitLab CI for automated smoke tests
- Participated in Agile ceremonies including sprint planning, daily standups, and retrospectives
- Performed API testing using Postman and documented API test scenarios
- Gained initial exposure to Docker by running test environments in containers

Education
B.Sc. Computer Science — Babes-Bolyai University, Cluj-Napoca, 2019

Technical Skills
Testing: Selenium WebDriver, Postman, JMeter, TestNG, manual testing, exploratory testing
Programming: Python (intermediate), Bash scripting (basic), SQL (intermediate)
CI/CD: Jenkins (basic configuration), GitLab CI (basic pipeline writing)
Tools: Jira, Confluence, Git, GitHub, VS Code
Operating Systems: Linux (Ubuntu — basic administration), Windows
Databases: MySQL, PostgreSQL (test data management)
Other: Agile/Scrum methodology, REST API testing, basic Docker usage

Certifications
- ISTQB Foundation Level (2020)
- Linux Essentials (LPI) (2022)

Languages
Romanian (native), English (professional proficiency)`,
    questionnaire: {
      currentRole: 'QA Engineer',
      targetRole: 'DevOps Engineer',
      yearsExperience: 4,
      country: 'Romania',
      workPreference: 'remote',
      currentSalary: 5500,
      targetSalary: 8500,
      language: 'en',
    },
    expectedTraits: {
      minFitScore: 4,
      maxFitScore: 6,
      expectedGapSeverities: ['critical', 'moderate'],
      mustHaveStrengthKeywords: ['testing', 'CI/CD', 'Linux', 'scripting', 'Jenkins'],
      mustHaveGapKeywords: ['cloud platforms', 'infrastructure as code', 'containerization'],
      expectedCurrency: 'EUR',
      shouldIncludeTargetRole: true,
    },
  },

  // ── C02: Frontend Dev → Full-Stack Dev ─────────────────────────────────
  {
    id: 'C02',
    category: 'better-paying',
    description:
      'Frontend Developer with 3 years of React/TypeScript pivoting to Full-Stack Developer. Strong on the frontend but lacks backend development and database skills. UK, hybrid, 2 months prep.',
    cvText: `Emily Richardson
Frontend Developer

Contact
Email: emily.richardson@email.co.uk
Phone: +44 7700 123456
Location: Manchester, United Kingdom
LinkedIn: linkedin.com/in/emilyrichardson
GitHub: github.com/emilyrich

Professional Summary
Frontend Developer with 3 years of experience building responsive, performant web applications using React and TypeScript. Passionate about delivering exceptional user experiences with clean, maintainable code. Experienced in working within Agile teams and collaborating closely with UX designers and backend engineers to ship features on schedule.

Experience

Frontend Developer — FinTech Flow Ltd, Manchester
June 2023 – Present
- Build and maintain customer-facing React application for a digital banking platform used by 200,000+ customers
- Develop complex UI components using React 18, TypeScript, and Tailwind CSS
- Implement state management patterns using Redux Toolkit and React Query for data fetching
- Write unit and integration tests with Jest and React Testing Library, maintaining 85%+ coverage
- Optimize application performance through code splitting, lazy loading, and memoization techniques
- Participate in code reviews and mentor junior frontend developers on React best practices
- Integrate with RESTful APIs built by the backend team; consume and display data from microservices

Junior Frontend Developer — Digital Agency North, Manchester
February 2022 – May 2023
- Developed responsive websites and web applications for clients across retail, healthcare, and education sectors
- Built interactive components using React, JavaScript ES6+, and CSS Modules
- Converted Figma designs to pixel-perfect responsive layouts using CSS Grid and Flexbox
- Worked with headless CMS platforms (Contentful, Strapi) to build dynamic content pages
- Implemented accessibility improvements achieving WCAG 2.1 AA compliance across client projects
- Collaborated with backend developers using REST APIs; basic understanding of Express.js endpoints

Intern Frontend Developer — WebCraft Studios, Leeds
September 2021 – January 2022
- Assisted in building landing pages and marketing sites using HTML, CSS, and JavaScript
- Gained foundational experience with React through pair programming with senior developers
- Participated in daily standups and learned Agile development workflows

Education
B.Sc. Computer Science — University of Manchester, 2021

Technical Skills
Frontend: React 18, TypeScript, JavaScript ES6+, HTML5, CSS3, Tailwind CSS, CSS Modules
State Management: Redux Toolkit, React Query, Context API
Testing: Jest, React Testing Library, Cypress (basic)
Build Tools: Vite, Webpack, ESLint, Prettier
Version Control: Git, GitHub, GitLab
Design Tools: Figma, Storybook
Other: REST API consumption, responsive design, accessibility (WCAG 2.1), Agile/Scrum

Certifications
- Meta Frontend Developer Professional Certificate (2022)

Languages
English (native)`,
    questionnaire: {
      currentRole: 'Frontend Developer',
      targetRole: 'Full-Stack Developer',
      yearsExperience: 3,
      country: 'United Kingdom',
      workPreference: 'hybrid',
      currentSalary: 42000,
      targetSalary: 55000,
      language: 'en',
    },
    expectedTraits: {
      minFitScore: 5,
      maxFitScore: 7,
      expectedGapSeverities: ['critical', 'moderate'],
      mustHaveStrengthKeywords: ['React', 'TypeScript', 'frontend', 'REST API', 'testing'],
      mustHaveGapKeywords: ['backend development', 'databases', 'server-side'],
      expectedCurrency: 'GBP',
      shouldIncludeTargetRole: true,
    },
  },

  // ── C03: Support Engineer → SRE ────────────────────────────────────────
  {
    id: 'C03',
    category: 'better-paying',
    description:
      'Support Engineer with 4 years of Linux and scripting experience pivoting to Site Reliability Engineer. Good troubleshooting fundamentals but lacks monitoring, incident response frameworks, and distributed systems knowledge. US, onsite, 4 months prep.',
    cvText: `Marcus Johnson
Support Engineer

Contact
Email: marcus.johnson@email.com
Phone: +1 (512) 555-0147
Location: Austin, Texas, United States
LinkedIn: linkedin.com/in/marcusjohnsontech

Professional Summary
Support Engineer with 4 years of experience providing advanced technical support for cloud-hosted SaaS applications. Strong background in Linux system administration, scripting, and troubleshooting complex technical issues. Experienced in working directly with engineering teams to diagnose production incidents and implement permanent fixes. Seeking to transition into a Site Reliability Engineering role to apply and deepen my operational expertise.

Experience

Senior Support Engineer — ScaleGrid Inc., Austin, TX
March 2023 – Present
- Serve as Tier 3 escalation point for complex technical issues affecting enterprise customers on a database-as-a-service platform
- Troubleshoot production issues across Linux servers (CentOS, Ubuntu), networking, and application layers
- Write Bash and Python scripts to automate diagnostic procedures and reduce mean time to diagnosis by 40%
- Collaborate with the SRE and engineering teams during P1/P2 incidents, providing real-time log analysis
- Maintain internal runbooks and documentation for common failure patterns and resolution procedures
- Analyze system logs using tools like grep, awk, and journalctl to identify root causes
- Basic exposure to Kubernetes through troubleshooting pod-level issues reported by customers
- Monitor service health dashboards in Datadog; escalate alerts when SLAs are at risk

Support Engineer — CloudBase Technologies, Austin, TX
January 2021 – February 2023
- Provided L2 technical support for a web hosting platform serving 5,000+ customers
- Diagnosed server-level issues including disk space exhaustion, memory leaks, and network connectivity problems
- Managed customer-facing Linux servers: performed routine maintenance, patched vulnerabilities, and managed user permissions
- Created automation scripts in Bash for common maintenance tasks like log rotation, backup verification, and health checks
- Participated in on-call rotation covering evenings and weekends; handled urgent escalations
- Documented troubleshooting procedures that reduced average ticket resolution time by 25%

Junior Technical Support — HostRight Solutions, Dallas, TX
June 2020 – December 2020
- Handled L1 support tickets for shared and VPS hosting customers
- Assisted customers with DNS configuration, SSL certificate installation, and email troubleshooting
- Gained foundational knowledge of Linux command line, Apache/Nginx configuration, and cPanel

Education
B.Sc. Information Technology — Texas State University, 2020

Technical Skills
Operating Systems: Linux (CentOS, Ubuntu, RHEL), Windows Server
Scripting: Bash (advanced), Python (intermediate)
Networking: TCP/IP, DNS, HTTP/HTTPS, firewalls (iptables), load balancers (basic)
Databases: MySQL, PostgreSQL (administration and troubleshooting)
Monitoring: Datadog (dashboard viewing), Nagios (basic), log analysis (grep, awk, journalctl)
Tools: Git, Jira, Confluence, SSH, systemd, cron
Cloud: Basic AWS exposure (EC2, S3 — support context only)
Containers: Basic Kubernetes troubleshooting (kubectl commands)
Other: Incident triage, runbook creation, on-call processes

Certifications
- CompTIA Linux+ (2021)
- AWS Cloud Practitioner (2023)

Languages
English (native), Spanish (conversational)`,
    questionnaire: {
      currentRole: 'Support Engineer',
      targetRole: 'Site Reliability Engineer',
      yearsExperience: 4,
      country: 'United States',
      workPreference: 'onsite',
      currentSalary: 75000,
      targetSalary: 120000,
      language: 'en',
    },
    expectedTraits: {
      minFitScore: 4,
      maxFitScore: 6,
      expectedGapSeverities: ['critical', 'moderate'],
      mustHaveStrengthKeywords: ['Linux', 'scripting', 'troubleshooting', 'on-call', 'log analysis'],
      mustHaveGapKeywords: ['monitoring', 'incident response', 'distributed systems'],
      expectedCurrency: 'USD',
      shouldIncludeTargetRole: true,
    },
  },

  // ── C04: Manual Tester → Automation Engineer ───────────────────────────
  {
    id: 'C04',
    category: 'better-paying',
    description:
      'Manual Tester with 5 years of manual testing and Jira experience pivoting to Automation Engineer. Deep domain knowledge in testing but lacks programming skills, test automation frameworks, and CI/CD integration. Poland, onsite, 2 months prep.',
    cvText: `Katarzyna Nowak
Manual Tester

Contact
Email: katarzyna.nowak@email.pl
Phone: +48 501 234 567
Location: Krakow, Poland
LinkedIn: linkedin.com/in/katarzynanowak-qa

Professional Summary
Dedicated Manual Tester with 5 years of experience in software quality assurance across fintech and e-commerce domains. Skilled in designing comprehensive test strategies, writing detailed test cases, and managing defect lifecycles. Known for thoroughness in exploratory testing and strong collaboration with cross-functional teams. Seeking to transition into Test Automation to leverage my deep testing expertise with programming skills.

Experience

Senior Manual Tester — PayNet Poland, Krakow
April 2022 – Present
- Lead manual testing efforts for a payment processing platform handling millions of transactions monthly
- Design and maintain test plans, test cases, and test matrices for new feature releases and regression cycles
- Perform comprehensive regression testing across web and mobile (iOS, Android) platforms before each release
- Conduct exploratory testing sessions that have uncovered 15+ critical edge-case defects missed by scripted tests
- Manage defect lifecycle in Jira: create detailed bug reports with reproduction steps, screenshots, and severity classification
- Collaborate with product owners to define acceptance criteria and with developers to clarify requirements
- Mentor two junior testers on test design techniques and best practices for defect reporting
- Participate in UAT coordination with business stakeholders
- Basic exposure to Selenium IDE for recording simple test scripts (not full programming)

Manual Tester — ShopDirect Sp. z o.o., Krakow
June 2020 – March 2022
- Executed manual test cases for a large e-commerce platform with 500,000+ monthly active users
- Performed API testing using Postman to validate backend endpoints and data integrity
- Participated in Agile ceremonies: sprint planning, daily standups, sprint reviews, and retrospectives
- Created and maintained test documentation in Confluence
- Conducted cross-browser and cross-device compatibility testing
- Gained basic understanding of SQL for test data verification and validation queries

Junior Tester — SoftHouse Consulting, Warsaw
January 2019 – May 2020
- Executed test cases designed by senior testers for government portal applications
- Logged defects in Jira with detailed reproduction steps and expected vs actual results
- Performed smoke testing and sanity testing after each deployment to staging
- Learned fundamentals of test management and defect tracking workflows

Education
B.Sc. Applied Mathematics — AGH University of Science and Technology, Krakow, 2018

Technical Skills
Testing: Manual testing, exploratory testing, regression testing, smoke testing, UAT coordination
Test Design: Test plans, test cases, test matrices, boundary value analysis, equivalence partitioning
API Testing: Postman (intermediate)
Tools: Jira (advanced), Confluence, TestRail, Zephyr, Selenium IDE (basic recording only)
Databases: SQL (basic queries for test data verification)
Platforms: Web testing, mobile testing (iOS, Android), cross-browser testing
Methodologies: Agile/Scrum, waterfall
Other: Defect lifecycle management, requirements analysis, UAT coordination
Programming: Very basic Python (currently learning)

Certifications
- ISTQB Foundation Level (2019)
- ISTQB Agile Tester Extension (2021)

Languages
Polish (native), English (professional proficiency)`,
    questionnaire: {
      currentRole: 'Manual Tester',
      targetRole: 'Automation Engineer',
      yearsExperience: 5,
      country: 'Poland',
      workPreference: 'onsite',
      currentSalary: 8000,
      targetSalary: 14000,
      language: 'en',
    },
    expectedTraits: {
      minFitScore: 4,
      maxFitScore: 6,
      expectedGapSeverities: ['critical', 'moderate'],
      mustHaveStrengthKeywords: ['manual testing', 'test cases', 'Jira', 'API testing', 'defect management'],
      mustHaveGapKeywords: ['programming', 'test frameworks', 'CI/CD'],
      expectedCurrency: 'PLN',
      shouldIncludeTargetRole: true,
    },
  },

  // ── C05: PHP Developer → Node.js Developer ─────────────────────────────
  {
    id: 'C05',
    category: 'better-paying',
    description:
      'PHP Developer with 5 years of PHP/MySQL experience pivoting to Node.js Developer. Strong programming fundamentals and backend experience but needs to learn the Node.js ecosystem and async patterns. Germany, hybrid, 1 month prep.',
    cvText: `Tobias Meier
PHP Developer

Contact
Email: tobias.meier@email.de
Phone: +49 176 12345678
Location: Berlin, Germany
LinkedIn: linkedin.com/in/tobiasmeier-dev
GitHub: github.com/tobiasmeier

Professional Summary
Experienced PHP Developer with 5 years of building and maintaining web applications using PHP, Laravel, and MySQL. Strong understanding of backend architecture, RESTful API design, and database optimization. Track record of delivering reliable, scalable solutions for e-commerce and content management systems. Eager to leverage my backend development expertise to transition into Node.js development.

Experience

PHP Developer — WebCommerce GmbH, Berlin
August 2022 – Present
- Develop and maintain e-commerce backend services using PHP 8.1, Laravel 10, and MySQL 8
- Design and implement RESTful APIs consumed by React and Vue.js frontend applications
- Optimize MySQL queries and implement database indexing strategies, reducing average query time by 60%
- Build and integrate payment processing modules with Stripe and PayPal APIs
- Write unit tests using PHPUnit with 80%+ code coverage on critical business logic
- Implement caching strategies using Redis to improve API response times
- Participate in architecture discussions and code reviews with the engineering team
- Manage database migrations and schema changes using Laravel migrations
- Basic exposure to JavaScript/TypeScript through reading frontend code during debugging

Senior PHP Developer — Digital Agency Berlin, Berlin
March 2020 – July 2022
- Built custom WordPress plugins and themes for enterprise clients in healthcare and real estate
- Developed RESTful APIs using Slim Framework and Symfony components
- Managed MySQL and MariaDB databases, writing complex queries, stored procedures, and views
- Implemented authentication systems using OAuth 2.0 and JWT tokens
- Set up deployment pipelines using GitLab CI/CD for automated testing and staging deployments
- Mentored two junior PHP developers on clean code practices and SOLID principles
- Integrated third-party APIs including Google Maps, SendGrid, and Twilio

PHP Developer — StartupHub UG, Berlin
June 2019 – February 2020
- Developed features for a SaaS project management tool using PHP 7.4 and MySQL
- Built REST API endpoints and wrote integration tests
- Gained initial exposure to Docker for local development environments
- Participated in Agile sprints and daily standups

Education
B.Sc. Computer Science — Technical University of Berlin, 2019

Technical Skills
Backend: PHP 8.x (advanced), Laravel 10 (advanced), Symfony (intermediate), Slim Framework
Databases: MySQL 8 (advanced), MariaDB, Redis (intermediate), basic PostgreSQL
API Design: RESTful APIs, OAuth 2.0, JWT, API versioning
Testing: PHPUnit, Pest (basic), Postman
DevOps: Docker (intermediate), GitLab CI/CD, Nginx, Apache
Version Control: Git, GitHub, GitLab
JavaScript: Basic reading proficiency (ES6+), very basic TypeScript awareness
Architecture: MVC, SOLID principles, design patterns, caching strategies
Other: Composer, Linux server management, Agile/Scrum

Certifications
- Zend Certified PHP Engineer (2021)
- Docker Essentials (LinkedIn Learning, 2022)

Languages
German (native), English (professional proficiency)`,
    questionnaire: {
      currentRole: 'PHP Developer',
      targetRole: 'Node.js Developer',
      yearsExperience: 5,
      country: 'Germany',
      workPreference: 'hybrid',
      currentSalary: 55000,
      targetSalary: 65000,
      language: 'en',
    },
    expectedTraits: {
      minFitScore: 6,
      maxFitScore: 8,
      expectedGapSeverities: ['moderate', 'minor'],
      mustHaveStrengthKeywords: ['backend development', 'REST API', 'databases', 'Git', 'CI/CD'],
      mustHaveGapKeywords: ['Node.js ecosystem', 'async patterns', 'JavaScript'],
      expectedCurrency: 'EUR',
      shouldIncludeTargetRole: true,
    },
  },

  // ── C06: WordPress Developer → React Developer ─────────────────────────
  {
    id: 'C06',
    category: 'better-paying',
    description:
      'WordPress Developer with 4 years of WordPress/PHP/CSS experience pivoting to React Developer. Has web fundamentals but lacks React, SPA architecture, and modern JavaScript tooling. Spain, remote, 3 months prep.',
    cvText: `Carlos Fernandez
WordPress Developer

Contact
Email: carlos.fernandez@email.es
Phone: +34 612 345 678
Location: Valencia, Spain
LinkedIn: linkedin.com/in/carlosfernandez-wp
Portfolio: carlosfernandez.dev

Professional Summary
WordPress Developer with 4 years of experience building custom themes, plugins, and full websites for clients across hospitality, education, and small business sectors. Strong command of PHP, HTML, CSS, and WordPress ecosystem. Experienced in translating design mockups into responsive, accessible websites. Looking to transition into React development to work on more dynamic, modern web applications.

Experience

WordPress Developer — Agencia Digital Costa, Valencia
May 2022 – Present
- Build custom WordPress themes from scratch using PHP, HTML5, CSS3, and vanilla JavaScript
- Develop custom WordPress plugins for client-specific functionality including booking systems, custom post types, and REST API extensions
- Create responsive layouts using CSS Grid, Flexbox, and Bootstrap framework
- Implement WooCommerce customizations for e-commerce clients including custom checkout flows and payment gateway integrations
- Optimize site performance through image optimization, caching plugins, and CDN configuration
- Manage hosting environments, DNS settings, and SSL certificates for 30+ client websites
- Collaborate with designers to convert Figma mockups to pixel-perfect WordPress implementations
- Write custom JavaScript for interactive elements: sliders, modals, form validation, dynamic filtering
- Basic exposure to React through a single project using headless WordPress with WPGraphQL

WordPress Developer — Freelance, Valencia
January 2021 – April 2022
- Developed and maintained WordPress websites for 20+ small business clients
- Built child themes and customized premium themes to match client branding requirements
- Created custom page templates using Advanced Custom Fields (ACF) for flexible content layouts
- Implemented SEO best practices and improved Google PageSpeed scores for client sites
- Managed client relationships, project timelines, and deliverables independently
- Set up staging environments and basic Git workflows for version control

Junior Web Developer — TechSoluciones SL, Madrid
March 2020 – December 2020
- Built and maintained WordPress websites under senior developer guidance
- Wrote custom CSS and basic JavaScript enhancements for client projects
- Gained foundational skills in HTML, CSS, PHP, and WordPress template hierarchy
- Assisted with QA testing and cross-browser compatibility checks

Education
Ciclo Superior Desarrollo de Aplicaciones Web — IES San Vicente, Valencia, 2019

Technical Skills
CMS: WordPress (advanced), WooCommerce, ACF, Elementor, WPGraphQL (basic)
Frontend: HTML5, CSS3, CSS Grid, Flexbox, Bootstrap, Sass/SCSS, vanilla JavaScript (ES6)
Backend: PHP 7/8 (WordPress context), MySQL, REST API (WordPress REST API)
Tools: Git (basic), VS Code, FileZilla, cPanel/Plesk, Figma (design handoff)
Performance: Image optimization, caching (WP Rocket, W3 Total Cache), CDN setup
SEO: Yoast SEO, technical SEO fundamentals, Core Web Vitals optimization
Other: Responsive design, cross-browser testing, basic accessibility (WCAG basics)
JavaScript Frameworks: Very basic React exposure (one headless WP project)

Languages
Spanish (native), English (intermediate — B2 level)`,
    questionnaire: {
      currentRole: 'WordPress Developer',
      targetRole: 'React Developer',
      yearsExperience: 4,
      country: 'Spain',
      workPreference: 'remote',
      currentSalary: 28000,
      targetSalary: 40000,
      language: 'en',
    },
    expectedTraits: {
      minFitScore: 4,
      maxFitScore: 6,
      expectedGapSeverities: ['critical', 'moderate'],
      mustHaveStrengthKeywords: ['HTML', 'CSS', 'JavaScript', 'responsive design', 'web development'],
      mustHaveGapKeywords: ['React', 'SPA architecture', 'modern JS tooling'],
      expectedCurrency: 'EUR',
      shouldIncludeTargetRole: true,
    },
  },

  // ── C07: Junior DBA → Data Engineer ────────────────────────────────────
  {
    id: 'C07',
    category: 'better-paying',
    description:
      'Junior DBA with 3 years of SQL/PostgreSQL experience pivoting to Data Engineer. Strong database fundamentals but lacks Python, ETL pipelines, and cloud data services. Canada, hybrid, 4 months prep.',
    cvText: `Priya Sharma
Junior Database Administrator

Contact
Email: priya.sharma@email.ca
Phone: +1 (416) 555-0289
Location: Toronto, Ontario, Canada
LinkedIn: linkedin.com/in/priyasharma-dba

Professional Summary
Junior Database Administrator with 3 years of experience managing and optimizing PostgreSQL and SQL Server databases for mid-size SaaS companies. Strong SQL skills, including query optimization, index management, and database monitoring. Comfortable with database backup and recovery procedures, performance tuning, and schema design. Seeking to transition into Data Engineering to apply my deep database knowledge in building scalable data pipelines and architectures.

Experience

Junior DBA — MapleSoft Analytics, Toronto
September 2022 – Present
- Administer and monitor 15+ PostgreSQL databases (versions 13-16) supporting production SaaS applications
- Write and optimize complex SQL queries, stored procedures, and materialized views for reporting
- Implement database indexing strategies that improved query performance by up to 50% on key report queries
- Manage database backup schedules, point-in-time recovery testing, and disaster recovery procedures
- Monitor database health using pgAdmin, pg_stat_statements, and custom monitoring queries
- Perform schema migrations using Flyway, coordinating with development teams for zero-downtime deployments
- Create and maintain data dictionaries and ER diagrams for 5 core application databases
- Assist in capacity planning by analyzing database growth trends and query patterns
- Basic exposure to AWS RDS through managing PostgreSQL instances in the cloud

Database Support Analyst — DataServ Inc., Toronto
July 2021 – August 2022
- Provided day-to-day support for SQL Server 2019 databases across internal business applications
- Wrote T-SQL queries and scripts for data extraction, reporting, and ad-hoc data fixes
- Monitored database performance using SQL Server Management Studio and Activity Monitor
- Assisted senior DBAs with index maintenance, statistics updates, and query plan analysis
- Created automated scripts for routine database maintenance tasks using PowerShell
- Managed database user access, roles, and permissions following security best practices

IT Data Assistant — CivicTech Solutions, Mississauga
March 2021 – June 2021
- Assisted with data migration from legacy Access databases to SQL Server
- Wrote SQL queries for data validation and integrity checks during migration
- Documented data mapping rules and transformation logic

Education
B.Sc. Computer Science — University of Toronto, 2020
Relevant coursework: Database Systems, Data Structures, Algorithms, Statistics

Technical Skills
Databases: PostgreSQL 13-16 (intermediate), SQL Server 2019 (intermediate), MySQL (basic), MongoDB (basic awareness)
SQL: Advanced queries, joins, subqueries, CTEs, window functions, stored procedures, materialized views
Administration: Backup/recovery, replication (basic), performance tuning, index optimization, schema migrations
Tools: pgAdmin, SQL Server Management Studio, DBeaver, Flyway, DataGrip
Monitoring: pg_stat_statements, custom monitoring queries, basic AWS CloudWatch
Scripting: PowerShell (basic), Bash (basic), very basic Python (learning)
Cloud: AWS RDS (basic), basic S3 exposure
Version Control: Git (basic)
Other: ER diagram design, data modeling, capacity planning, database security

Certifications
- PostgreSQL Associate Certification (EnterpriseDB, 2023)

Languages
English (native), Hindi (conversational), French (basic)`,
    questionnaire: {
      currentRole: 'Junior DBA',
      targetRole: 'Data Engineer',
      yearsExperience: 3,
      country: 'Canada',
      workPreference: 'hybrid',
      currentSalary: 65000,
      targetSalary: 90000,
      language: 'en',
    },
    expectedTraits: {
      minFitScore: 4,
      maxFitScore: 6,
      expectedGapSeverities: ['critical', 'moderate'],
      mustHaveStrengthKeywords: ['SQL', 'PostgreSQL', 'database', 'query optimization', 'data modeling'],
      mustHaveGapKeywords: ['Python', 'ETL pipelines', 'cloud data services'],
      expectedCurrency: 'CAD',
      shouldIncludeTargetRole: true,
    },
  },

  // ── C08: Desktop App Dev → Web Developer ───────────────────────────────
  {
    id: 'C08',
    category: 'better-paying',
    description:
      'Desktop Application Developer with 6 years of C#/.NET WinForms experience pivoting to Web Developer. Strong programming fundamentals but lacks HTML/CSS, web frameworks, and REST API design skills. Netherlands, hybrid, 2 months prep.',
    cvText: `Jeroen van Dijk
Desktop Application Developer

Contact
Email: jeroen.vandijk@email.nl
Phone: +31 6 12345678
Location: Amsterdam, Netherlands
LinkedIn: linkedin.com/in/jeroenvandijk-dev
GitHub: github.com/jeroenvdijk

Professional Summary
Experienced Desktop Application Developer with 6 years of expertise building enterprise Windows applications using C#, .NET Framework, and WinForms. Strong foundation in object-oriented programming, software design patterns, and database integration. Proven ability to deliver reliable, maintainable software solutions for manufacturing, logistics, and healthcare sectors. Seeking to transition into web development to apply my solid engineering skills in the modern web ecosystem.

Experience

Senior Desktop Developer — LogiSystems BV, Amsterdam
February 2022 – Present
- Architect and develop enterprise WinForms applications for warehouse management systems used by 500+ operators
- Build complex data entry forms, reporting modules, and real-time dashboard displays using C# and .NET 4.8
- Implement multi-threaded operations for background data synchronization and batch processing tasks
- Design and maintain SQL Server database schemas, stored procedures, and data access layers using ADO.NET and Dapper
- Create Windows Services for automated data import/export and scheduled task execution
- Write comprehensive unit tests using NUnit and Moq, maintaining 75%+ coverage on business logic
- Integrate with hardware peripherals including barcode scanners, label printers, and weighing scales
- Lead technical design discussions and mentor two junior developers on C# best practices and design patterns
- Manage application deployments using ClickOnce and custom MSI installers

Desktop Developer — MedTech Solutions, Rotterdam
March 2020 – January 2022
- Developed patient management desktop applications for healthcare clinics using C#, WinForms, and DevExpress controls
- Built data visualization components including charts, grids, and custom controls for clinical dashboards
- Implemented secure data handling complying with Dutch healthcare data regulations (NEN 7510)
- Integrated applications with REST APIs provided by external medical device vendors using HttpClient
- Created Crystal Reports and SSRS reports for clinical and administrative reporting needs
- Optimized application startup time by 40% through lazy loading and caching improvements

Junior Developer — SmallBiz Software, Utrecht
January 2019 – February 2020
- Developed and maintained invoicing and inventory management desktop applications
- Built database CRUD operations using Entity Framework and SQL Server
- Gained foundational skills in C#, .NET, WinForms, and SQL
- Participated in code reviews and learned software development best practices

Education
B.Sc. Informatica — Vrije Universiteit Amsterdam, 2018

Technical Skills
Languages: C# (advanced), SQL (advanced), VB.NET (intermediate), very basic JavaScript
Frameworks: .NET Framework 4.x (advanced), .NET 6 (basic), WinForms (advanced), DevExpress
Databases: SQL Server (advanced), SQLite, basic PostgreSQL
ORM/Data Access: Entity Framework, Dapper, ADO.NET
Testing: NUnit, Moq, MSTest
Tools: Visual Studio (expert), SQL Server Management Studio, Git, Azure DevOps
Architecture: MVVM pattern, Repository pattern, SOLID principles, dependency injection
Deployment: ClickOnce, MSI installers, Windows Services
Other: Multi-threading, background workers, Crystal Reports, SSRS, hardware integration

Certifications
- Microsoft Certified: Azure Fundamentals (AZ-900, 2023)
- C# Programming Specialization (Coursera, 2020)

Languages
Dutch (native), English (professional proficiency), German (basic)`,
    questionnaire: {
      currentRole: 'Desktop Application Developer',
      targetRole: 'Web Developer',
      yearsExperience: 6,
      country: 'Netherlands',
      workPreference: 'hybrid',
      currentSalary: 52000,
      targetSalary: 62000,
      language: 'en',
    },
    expectedTraits: {
      minFitScore: 5,
      maxFitScore: 7,
      expectedGapSeverities: ['critical', 'moderate'],
      mustHaveStrengthKeywords: ['C#', '.NET', 'SQL', 'design patterns', 'unit testing'],
      mustHaveGapKeywords: ['HTML/CSS', 'web frameworks', 'REST APIs'],
      expectedCurrency: 'EUR',
      shouldIncludeTargetRole: true,
    },
  },

  // ── C09: IT Helpdesk → Junior Cloud Engineer ───────────────────────────
  {
    id: 'C09',
    category: 'better-paying',
    description:
      'IT Helpdesk technician with 3 years of Windows/networking/basic Linux experience pivoting to Junior Cloud Engineer. Has IT fundamentals but significant gaps in cloud platforms, scripting, and IaC. India, remote, 5 months prep.',
    cvText: `Rajesh Kumar
IT Helpdesk Technician

Contact
Email: rajesh.kumar@email.in
Phone: +91 98765 43210
Location: Bangalore, India
LinkedIn: linkedin.com/in/rajeshkumar-it

Professional Summary
IT Helpdesk Technician with 3 years of experience providing technical support in enterprise environments. Skilled in Windows administration, basic networking, and user support. Experienced in troubleshooting hardware and software issues, managing Active Directory, and supporting hybrid office/remote work environments. Building foundational cloud skills and seeking to transition into a Junior Cloud Engineer role to grow in cloud infrastructure and automation.

Experience

IT Helpdesk Technician (L2) — Infosys BPO, Bangalore
August 2023 – Present
- Provide L2 technical support for 2,000+ employees across multiple office locations and remote workers
- Administer Active Directory: manage user accounts, group policies, security groups, and OUs
- Troubleshoot Windows 10/11 issues including domain join failures, driver conflicts, and Group Policy problems
- Manage Microsoft 365 administration: Exchange Online mailboxes, Teams, SharePoint permissions
- Configure and troubleshoot VPN connections, network printers, and Wi-Fi connectivity issues
- Maintain asset inventory using ServiceNow CMDB and process hardware requests
- Write basic PowerShell scripts for bulk user creation and automated reporting
- Assist network team with VLAN troubleshooting and switch port configurations
- Recently gained basic Linux exposure by setting up Ubuntu VMs for internal development team requests
- Completed AWS Cloud Practitioner certification to build cloud knowledge

IT Helpdesk Technician (L1) — TCS Digital Workplace, Bangalore
April 2022 – July 2023
- Handled 30+ support tickets daily for hardware, software, and network issues
- Performed Windows desktop imaging and deployment using SCCM/MDT
- Supported onboarding and offboarding: laptop setup, account provisioning, access configuration
- Documented troubleshooting procedures in knowledge base, reducing repeat tickets by 20%
- Gained initial networking knowledge: TCP/IP, DHCP, DNS, subnetting fundamentals
- Participated in after-hours support rotation for critical business systems

IT Support Intern — Local IT Solutions, Bangalore
January 2022 – March 2022
- Assisted with desktop support, software installations, and basic network troubleshooting
- Learned ITIL fundamentals and ticketing system workflows

Education
B.Tech Information Technology — VIT University, Vellore, 2021

Technical Skills
Windows: Windows 10/11 administration, Active Directory, Group Policy, SCCM/MDT
Microsoft 365: Exchange Online, Teams, SharePoint, Azure AD (basic user management)
Networking: TCP/IP, DNS, DHCP, VPN, VLAN basics, subnetting, Wi-Fi troubleshooting
Linux: Ubuntu (basic installation and command line), basic file management and permissions
Scripting: PowerShell (basic — bulk operations and reporting), Bash (very basic)
Tools: ServiceNow, Jira, Remote Desktop, TeamViewer, PuTTY
Hardware: Laptop/desktop troubleshooting, printer management, peripheral support
Security: Basic understanding of firewalls, antivirus management, access control
Cloud: AWS Cloud Practitioner level knowledge (EC2, S3, VPC — conceptual understanding only)
ITIL: ITIL v4 Foundation concepts

Certifications
- AWS Cloud Practitioner (2024)
- CompTIA A+ (2022)
- ITIL v4 Foundation (2023)

Languages
English (professional proficiency), Hindi (native), Kannada (conversational)`,
    questionnaire: {
      currentRole: 'IT Helpdesk Technician',
      targetRole: 'Junior Cloud Engineer',
      yearsExperience: 3,
      country: 'India',
      workPreference: 'remote',
      currentSalary: 500000,
      targetSalary: 900000,
      language: 'en',
    },
    expectedTraits: {
      minFitScore: 3,
      maxFitScore: 5,
      expectedGapSeverities: ['critical', 'moderate'],
      mustHaveStrengthKeywords: ['Windows', 'networking', 'Linux', 'troubleshooting', 'Active Directory'],
      mustHaveGapKeywords: ['cloud platforms', 'scripting', 'infrastructure as code'],
      expectedCurrency: 'EUR',
      shouldIncludeTargetRole: true,
    },
  },

  // ── C10: Technical Writer → Developer Relations Engineer ───────────────
  {
    id: 'C10',
    category: 'better-paying',
    description:
      'Technical Writer with 4 years of API documentation, Git, and some Python experience pivoting to Developer Relations Engineer. Strong written communication but lacks public speaking, community building, and demo coding experience. Ireland, remote, 3 months prep.',
    cvText: `Siobhan O'Brien
Technical Writer

Contact
Email: siobhan.obrien@email.ie
Phone: +353 87 123 4567
Location: Dublin, Ireland
LinkedIn: linkedin.com/in/siobhanobrien-techwriter
Portfolio: siobhanobrien.dev/writing

Professional Summary
Technical Writer with 4 years of experience creating developer-facing documentation for APIs, SDKs, and cloud platforms. Skilled at translating complex technical concepts into clear, structured documentation. Comfortable working directly with engineering teams, reading codebases, and testing API endpoints to ensure documentation accuracy. Proficient with docs-as-code workflows using Git, Markdown, and static site generators. Seeking to transition into Developer Relations to combine my technical communication skills with community engagement and developer advocacy.

Experience

Senior Technical Writer — CloudAPI Solutions, Dublin
January 2023 – Present
- Author and maintain API reference documentation for a payments API platform used by 3,000+ developers
- Write developer guides, quickstart tutorials, and integration walkthroughs in Markdown
- Manage documentation site built with Docusaurus, implementing information architecture improvements
- Review and test API endpoints using curl, Postman, and Python requests library to verify documentation accuracy
- Write sample code snippets in Python, JavaScript, and cURL for API documentation examples
- Collaborate with product and engineering teams during feature development to document APIs before launch
- Implement docs-as-code workflow: documentation lives in Git, reviewed via pull requests, deployed via CI/CD
- Analyze documentation analytics (page views, search queries, feedback) to identify and fill content gaps
- Created a developer onboarding guide that reduced support tickets from new integrators by 30%
- Contribute to API design reviews, providing developer experience feedback on endpoint naming and error messages

Technical Writer — DevTools Ireland, Dublin
June 2021 – December 2022
- Wrote end-user and developer documentation for a CI/CD platform
- Created release notes, changelog entries, and migration guides for major version updates
- Built and maintained a documentation site using MkDocs and Material theme
- Developed internal style guide and documentation templates adopted across the engineering organization
- Conducted documentation audits and reorganized content structure improving navigation and findability
- Participated in developer community forums to identify common pain points and documentation needs

Junior Technical Writer — SaaS Startup, Cork
March 2020 – May 2021
- Wrote help articles, FAQs, and knowledge base content for a project management SaaS tool
- Created user guides with screenshots and step-by-step instructions
- Learned technical writing fundamentals, style guides (Google Developer Documentation Style Guide), and information architecture

Education
M.A. Digital Humanities — Trinity College Dublin, 2019
B.A. English and Computer Science — University College Dublin, 2018

Technical Skills
Writing: API documentation, developer guides, tutorials, quickstarts, release notes, changelogs, style guides
Docs-as-Code: Git (proficient), GitHub/GitLab, Markdown, reStructuredText, pull request workflows
Documentation Platforms: Docusaurus, MkDocs, ReadMe, Swagger/OpenAPI, Redoc
API Tools: Postman (proficient), curl, Swagger UI, OpenAPI 3.0 specification
Programming: Python (intermediate — scripts, API testing, sample code), basic JavaScript (code snippets), SQL (basic queries)
Content Strategy: Information architecture, documentation analytics, user research, content audits
Design: Basic Figma (diagram creation), draw.io, Mermaid diagrams
Other: Agile/Scrum, CI/CD concepts, Docker basics (running local doc sites), SEO for documentation

Certifications
- Google Technical Writing Certificate (2021)
- Certified Professional Technical Communicator — Foundation (STC, 2022)

Languages
English (native), Irish (intermediate), French (basic)`,
    questionnaire: {
      currentRole: 'Technical Writer',
      targetRole: 'Developer Relations Engineer',
      yearsExperience: 4,
      country: 'Ireland',
      workPreference: 'remote',
      currentSalary: 55000,
      targetSalary: 75000,
      language: 'en',
    },
    expectedTraits: {
      minFitScore: 4,
      maxFitScore: 6,
      expectedGapSeverities: ['critical', 'moderate'],
      mustHaveStrengthKeywords: ['technical writing', 'API documentation', 'Git', 'Python', 'developer experience'],
      mustHaveGapKeywords: ['public speaking', 'community building', 'demo coding'],
      expectedCurrency: 'EUR',
      shouldIncludeTargetRole: true,
    },
  },
];
