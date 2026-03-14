import type { SyntheticPersona } from './types';

export const techPivotPersonas: SyntheticPersona[] = [
  // ─── B01: Senior Backend Dev → Engineering Manager ────────────────────
  {
    id: 'B01',
    category: 'tech-pivot',
    description:
      'Senior Backend Developer pivoting to Engineering Manager — strong Python/Java but no formal people management experience',
    cvText: `MARCUS THOMPSON
Senior Backend Developer

CONTACT
marcus.thompson@email.com | San Francisco, CA | linkedin.com/in/marcusthompson

SUMMARY
Senior Backend Developer with 8 years of experience building scalable distributed systems in Python and Java. Proven track record of delivering high-throughput microservices architectures serving millions of users. Passionate about mentoring junior developers and improving team workflows, seeking to transition into engineering management to amplify impact through people and process.

EXPERIENCE

Senior Backend Developer — Stripe (2021–Present)
- Designed and implemented a payment reconciliation microservice handling 2M+ daily transactions using Python and Apache Kafka
- Led migration of monolithic billing system to event-driven architecture, reducing latency by 40%
- Mentored 3 junior engineers through code reviews, pair programming, and weekly 1:1 technical guidance sessions
- Authored internal RFC process for backend architecture decisions, adopted by 4 other teams
- Implemented comprehensive observability stack with Datadog, reducing mean-time-to-resolution by 55%

Backend Developer — Twilio (2018–2021)
- Built real-time messaging pipeline processing 500K messages/minute using Java Spring Boot and Redis
- Developed automated load testing framework that became standard across the backend org
- Contributed to open-source SDKs in Python and Java, receiving 800+ GitHub stars
- Participated in on-call rotation, resolving P1 incidents with minimal customer impact
- Collaborated with product managers to scope and estimate quarterly roadmap items

Junior Backend Developer — Accenture (2016–2018)
- Developed REST APIs for enterprise clients using Java and PostgreSQL
- Wrote unit and integration tests achieving 90%+ code coverage
- Participated in agile ceremonies and sprint retrospectives
- Built internal tooling to automate deployment pipelines using Jenkins and Docker

TECHNICAL SKILLS
Languages: Python, Java, Go, SQL
Frameworks: Django, Flask, Spring Boot, FastAPI
Infrastructure: AWS (EC2, Lambda, SQS, RDS), Docker, Kubernetes, Terraform
Databases: PostgreSQL, Redis, DynamoDB, MongoDB
Tools: Kafka, RabbitMQ, Datadog, Grafana, Jenkins, GitHub Actions

EDUCATION
B.S. Computer Science — University of California, Berkeley (2016)

CERTIFICATIONS
AWS Solutions Architect Associate (2020)
`,
    questionnaire: {
      currentRole: 'Senior Backend Developer',
      targetRole: 'Engineering Manager',
      yearsExperience: 8,
      country: 'United States',
      workPreference: 'hybrid',
      currentSalary: 185000,
      targetSalary: 210000,
      language: 'en',
    },
    expectedTraits: {
      minFitScore: 4,
      maxFitScore: 6,
      expectedGapSeverities: ['critical', 'moderate'],
      mustHaveStrengthKeywords: ['Python', 'Java', 'microservices', 'backend'],
      mustHaveGapKeywords: ['people management', 'hiring', 'budgeting'],
      expectedCurrency: 'USD',
      shouldIncludeTargetRole: true,
    },
  },

  // ─── B02: Senior Frontend Dev → Tech Lead ─────────────────────────────
  {
    id: 'B02',
    category: 'tech-pivot',
    description:
      'Senior Frontend Developer pivoting to Tech Lead — expert React/TypeScript but limited project planning and architectural decision-making experience',
    cvText: `EMMA ROBERTSON
Senior Frontend Developer

CONTACT
emma.robertson@email.co.uk | London, UK | github.com/emmarobertson

SUMMARY
Senior Frontend Developer with 7 years of experience crafting performant, accessible web applications using React and TypeScript. Deep expertise in design systems, state management, and frontend performance optimization. Seeking a Tech Lead role to drive technical direction and guide a team of frontend engineers toward delivering exceptional user experiences at scale.

EXPERIENCE

Senior Frontend Developer — Monzo Bank (2021–Present)
- Architected and built Monzo's next-generation web banking dashboard using React 18, TypeScript, and Zustand, serving 500K+ monthly active users
- Created a shared component library (60+ components) with Storybook documentation, adopted by 3 product teams
- Reduced bundle size by 35% through code splitting, tree shaking, and lazy loading strategies
- Implemented comprehensive E2E testing with Playwright, achieving 95% critical path coverage
- Championed accessibility standards, bringing the platform to WCAG 2.1 AA compliance
- Conducted 100+ code reviews per quarter, providing detailed constructive feedback

Frontend Developer — Deliveroo (2018–2021)
- Built the restaurant partner portal using React, Redux, and TypeScript
- Developed real-time order tracking interface with WebSocket integration
- Led frontend performance audit reducing Largest Contentful Paint from 4.2s to 1.8s
- Integrated analytics tracking with Segment and Amplitude for product insights
- Wrote and maintained 400+ unit tests using Jest and React Testing Library

Junior Frontend Developer — BBC (2017–2018)
- Contributed to BBC iPlayer web application using React and Node.js
- Implemented responsive layouts following BBC GEL design guidelines
- Participated in weekly design critiques and sprint planning meetings
- Fixed accessibility issues flagged during external WCAG audits

TECHNICAL SKILLS
Languages: TypeScript, JavaScript (ES2023), HTML5, CSS3
Frameworks: React 18, Next.js 14, Vue 3, Svelte
State Management: Zustand, Redux Toolkit, React Query, Apollo Client
Styling: Tailwind CSS, Styled Components, CSS Modules, Sass
Testing: Playwright, Jest, React Testing Library, Cypress
Build Tools: Vite, Webpack, Turborepo, esbuild
CI/CD: GitHub Actions, CircleCI, Vercel

EDUCATION
B.Sc. Computer Science — University of Edinburgh (2017)

OPEN SOURCE
- Maintainer of react-a11y-toolkit (2.3K GitHub stars) — accessibility primitives for React
`,
    questionnaire: {
      currentRole: 'Senior Frontend Developer',
      targetRole: 'Tech Lead',
      yearsExperience: 7,
      country: 'United Kingdom',
      workPreference: 'onsite',
      currentSalary: 85000,
      targetSalary: 105000,
      language: 'en',
    },
    expectedTraits: {
      minFitScore: 5,
      maxFitScore: 7,
      expectedGapSeverities: ['critical', 'moderate', 'minor'],
      mustHaveStrengthKeywords: ['React', 'TypeScript', 'frontend', 'accessibility'],
      mustHaveGapKeywords: ['project planning', 'technical decision-making'],
      expectedCurrency: 'GBP',
      shouldIncludeTargetRole: true,
    },
  },

  // ─── B03: DevOps Engineer → VP of Engineering ─────────────────────────
  {
    id: 'B03',
    category: 'tech-pivot',
    description:
      'DevOps Engineer / former startup CTO pivoting to VP of Engineering — deep AWS/K8s expertise but gaps in executive communication and organizational design',
    cvText: `FLORIAN KRÜGER
DevOps Engineer & Former Startup CTO

KONTAKT
florian.krueger@email.de | Berlin, Germany | linkedin.com/in/floriankrueger

SUMMARY
Seasoned DevOps Engineer and infrastructure leader with 12 years of experience scaling cloud-native platforms. Previously served as CTO of a 20-person startup where I built the engineering team from scratch. Expert in AWS, Kubernetes, and CI/CD automation at enterprise scale. Seeking a VP of Engineering role to drive engineering strategy, organizational growth, and technical excellence across multiple teams.

EXPERIENCE

CTO & Co-Founder — CloudMetrics GmbH (2020–2024)
- Co-founded an observability SaaS startup, growing from 0 to 20 engineers and 150 enterprise customers
- Designed the entire cloud infrastructure on AWS (EKS, RDS, S3, CloudFront) handling 10B+ data points daily
- Built and managed a team of 20 engineers across backend, frontend, and infrastructure squads
- Established engineering culture: introduced blameless post-mortems, architecture decision records, and weekly tech talks
- Secured SOC 2 Type II compliance within first 18 months of operation
- Raised EUR 4M seed round, presenting technical vision to investors (limited board interaction)
- Company acquired by a larger monitoring vendor in 2024

Senior DevOps Engineer — Zalando SE (2016–2020)
- Managed Kubernetes clusters running 2,000+ microservices across 3 AWS regions
- Implemented GitOps workflows with ArgoCD and Flux, reducing deployment failures by 70%
- Built internal developer platform serving 400+ engineers, enabling self-service infrastructure provisioning
- Automated compliance scanning and vulnerability management across 500+ container images
- Led migration from on-premise data centers to AWS, completing 18-month project on schedule
- Conducted training workshops on Kubernetes and Terraform for 80+ developers

DevOps Engineer — SAP (2012–2016)
- Managed CI/CD pipelines for enterprise SaaS products using Jenkins, Ansible, and Docker
- Implemented infrastructure-as-code practices across multiple product lines
- Maintained 99.95% uptime SLAs for critical production environments
- Collaborated with security teams on penetration testing and remediation

TECHNICAL SKILLS
Cloud: AWS (EKS, EC2, Lambda, RDS, S3, CloudFront, IAM), GCP (GKE)
Orchestration: Kubernetes, Helm, ArgoCD, Flux, Docker, Istio
IaC: Terraform, Pulumi, CloudFormation, Ansible
CI/CD: GitHub Actions, GitLab CI, Jenkins, Spinnaker
Monitoring: Prometheus, Grafana, Datadog, PagerDuty, OpenTelemetry
Languages: Go, Python, Bash, TypeScript

EDUCATION
M.Sc. Computer Science — Technische Universität Berlin (2012)

CERTIFICATIONS
AWS Solutions Architect Professional (2019)
Certified Kubernetes Administrator (CKA) (2018)
`,
    questionnaire: {
      currentRole: 'DevOps Engineer',
      targetRole: 'VP of Engineering',
      yearsExperience: 12,
      country: 'Germany',
      workPreference: 'hybrid',
      currentSalary: 110000,
      targetSalary: 150000,
      language: 'en',
    },
    expectedTraits: {
      minFitScore: 4,
      maxFitScore: 6,
      expectedGapSeverities: ['critical', 'moderate'],
      mustHaveStrengthKeywords: ['AWS', 'Kubernetes', 'DevOps', 'infrastructure'],
      mustHaveGapKeywords: ['executive communication', 'org design', 'organizational design'],
      expectedCurrency: 'EUR',
      shouldIncludeTargetRole: true,
    },
  },

  // ─── B04: ML Engineer → AI Product Manager ────────────────────────────
  {
    id: 'B04',
    category: 'tech-pivot',
    description:
      'ML Engineer pivoting to AI Product Manager — strong Python/PyTorch but lacks product strategy, roadmapping, and stakeholder management skills',
    cvText: `PRIYA CHAKRABORTY
Machine Learning Engineer

CONTACT
priya.chakraborty@email.com | Toronto, Canada | github.com/priyachakra

SUMMARY
Machine Learning Engineer with 6 years of experience designing and deploying production ML systems. Expertise in natural language processing, computer vision, and recommendation systems using Python, PyTorch, and TensorFlow. Passionate about bridging the gap between cutting-edge AI research and real-world product impact. Seeking to transition into AI Product Management to drive product strategy and shape how AI features reach end users.

EXPERIENCE

Senior ML Engineer — Shopify (2022–Present)
- Built and deployed a product recommendation engine using PyTorch and transformers, increasing merchant conversion rates by 18%
- Designed A/B testing framework for ML model evaluation across 500K+ Shopify stores
- Developed fraud detection pipeline processing 2M+ transactions daily with 99.2% precision
- Created internal model monitoring dashboard tracking drift, latency, and fairness metrics
- Authored 3 internal whitepapers on responsible AI practices adopted as company guidelines
- Collaborated closely with product managers to translate business requirements into ML problem statements

ML Engineer — Element AI (now ServiceNow) (2020–2022)
- Implemented NLP models for document classification and entity extraction using BERT and spaCy
- Built MLOps pipeline with MLflow, Kubeflow, and AWS SageMaker for reproducible training and deployment
- Reduced model inference latency by 60% through quantization and ONNX runtime optimization
- Participated in client-facing demos explaining model capabilities to non-technical stakeholders
- Contributed to research paper accepted at NeurIPS 2021 workshop on few-shot learning

Junior Data Scientist — Royal Bank of Canada (2018–2020)
- Developed credit risk models using gradient boosting and logistic regression
- Built data pipelines in PySpark for feature engineering on petabyte-scale datasets
- Created Jupyter notebook templates standardizing exploratory data analysis across the team
- Presented quarterly model performance reviews to risk management leadership

TECHNICAL SKILLS
Languages: Python, R, SQL, Scala
ML Frameworks: PyTorch, TensorFlow, Hugging Face Transformers, scikit-learn, XGBoost
MLOps: MLflow, Kubeflow, AWS SageMaker, Weights & Biases, DVC
NLP: BERT, GPT fine-tuning, spaCy, LangChain
Data: PySpark, Pandas, Airflow, dbt, BigQuery
Infrastructure: AWS (SageMaker, EC2, S3, Lambda), Docker, Kubernetes

EDUCATION
M.Sc. Computer Science (ML Specialization) — University of Toronto (2018)
B.Sc. Mathematics — McGill University (2016)

PUBLICATIONS
- "Few-Shot Classification for E-Commerce Product Taxonomies" — NeurIPS 2021 Workshop
- "Fairness-Aware Recommendation Systems: A Practical Framework" — Internal Shopify Research (2023)
`,
    questionnaire: {
      currentRole: 'Machine Learning Engineer',
      targetRole: 'AI Product Manager',
      yearsExperience: 6,
      country: 'Canada',
      workPreference: 'remote',
      currentSalary: 140000,
      targetSalary: 155000,
      language: 'en',
    },
    expectedTraits: {
      minFitScore: 4,
      maxFitScore: 6,
      expectedGapSeverities: ['critical', 'moderate'],
      mustHaveStrengthKeywords: ['Python', 'PyTorch', 'machine learning', 'NLP'],
      mustHaveGapKeywords: ['product strategy', 'roadmapping', 'stakeholder management'],
      expectedCurrency: 'EUR',
      shouldIncludeTargetRole: true,
    },
  },

  // ─── B05: Full-Stack Dev → Solutions Architect (sales overlay) ────────
  {
    id: 'B05',
    category: 'tech-pivot',
    description:
      'Full-Stack Developer pivoting to Solutions Architect with sales overlay — strong React/Node/AWS but lacks sales process and client presentation skills',
    cvText: `DAAN VAN DER BERG
Full-Stack Developer

CONTACT
daan.vanderberg@email.nl | Amsterdam, Netherlands | linkedin.com/in/daanvdberg

SUMMARY
Full-Stack Developer with 10 years of experience building end-to-end web applications and cloud architectures. Deep expertise in React, Node.js, and AWS with a strong focus on system design and scalability. Experienced in client-facing technical consulting engagements. Seeking to transition into a Solutions Architect role with pre-sales responsibilities to leverage both my technical depth and my growing interest in customer-facing solution design.

EXPERIENCE

Senior Full-Stack Developer — Adyen (2021–Present)
- Designed and built merchant onboarding platform using React, Node.js, and AWS, reducing integration time by 50%
- Architected event-driven payment processing system handling EUR 3B+ in annual transaction volume
- Led technical integration workshops with enterprise clients (Uber, Spotify) to design custom payment flows
- Created reference architectures and technical documentation for 20+ API integration patterns
- Built proof-of-concept demos for prospective enterprise clients during pre-sales evaluation phase
- Served as technical escalation point for Solutions Engineering team on complex integration challenges

Full-Stack Developer — Booking.com (2017–2021)
- Developed hotel search and booking features using React, GraphQL, and Java microservices
- Implemented real-time pricing engine with Redis caching and Elasticsearch, serving 10M+ daily queries
- Built internal A/B testing platform used by 200+ product experimenters
- Conducted technical interviews and onboarded 15+ new engineers
- Migrated legacy monolith components to serverless Lambda functions on AWS

Full-Stack Developer — Bol.com (2014–2017)
- Built product catalog management system using Angular, Node.js, and PostgreSQL
- Developed REST APIs serving the main e-commerce platform with 99.9% uptime
- Implemented search autocomplete feature using Elasticsearch
- Participated in agile Scrum teams with biweekly sprint deliveries

TECHNICAL SKILLS
Frontend: React, Next.js, TypeScript, Angular, GraphQL, Tailwind CSS
Backend: Node.js, Express, NestJS, Java, Python
Cloud: AWS (Lambda, API Gateway, DynamoDB, S3, CloudFront, ECS, SQS)
Databases: PostgreSQL, MongoDB, Redis, Elasticsearch, DynamoDB
DevOps: Docker, Kubernetes, Terraform, GitHub Actions, Datadog
Architecture: Microservices, Event-Driven, Serverless, REST, gRPC

EDUCATION
B.Sc. Computer Science — Universiteit van Amsterdam (2014)

CERTIFICATIONS
AWS Solutions Architect Professional (2022)
AWS Developer Associate (2019)

LANGUAGES
Dutch (native), English (fluent), German (conversational)
`,
    questionnaire: {
      currentRole: 'Full-Stack Developer',
      targetRole: 'Solutions Architect',
      yearsExperience: 10,
      country: 'Netherlands',
      workPreference: 'hybrid',
      currentSalary: 90000,
      targetSalary: 110000,
      language: 'en',
    },
    expectedTraits: {
      minFitScore: 5,
      maxFitScore: 7,
      expectedGapSeverities: ['critical', 'moderate', 'minor'],
      mustHaveStrengthKeywords: ['React', 'Node.js', 'AWS', 'full-stack'],
      mustHaveGapKeywords: ['sales process', 'client presentations'],
      expectedCurrency: 'EUR',
      shouldIncludeTargetRole: true,
    },
  },

  // ─── B06: Senior Data Engineer → Data Team Lead ───────────────────────
  {
    id: 'B06',
    category: 'tech-pivot',
    description:
      'Senior Data Engineer pivoting to Data Team Lead — expert Spark/Airflow/Python but lacks team management and data governance experience',
    cvText: `LIAM O'CONNOR
Senior Data Engineer

CONTACT
liam.oconnor@email.com.au | Sydney, Australia | linkedin.com/in/liamoconnor-data

SUMMARY
Senior Data Engineer with 7 years of experience building and optimizing large-scale data platforms. Expert in Apache Spark, Airflow, and Python with deep knowledge of data warehouse design, ETL orchestration, and real-time streaming. Proven track record of improving data pipeline reliability and reducing processing costs. Seeking to step into a Data Team Lead role to guide a team of data engineers and establish best practices for data infrastructure and governance across the organization.

EXPERIENCE

Senior Data Engineer — Atlassian (2021–Present)
- Designed and built enterprise data lakehouse on AWS using Spark, Delta Lake, and Glue, processing 5TB+ daily
- Orchestrated 200+ production Airflow DAGs powering analytics dashboards for 15 product teams
- Reduced monthly AWS data processing costs by 40% through partition optimization and spot instance strategies
- Implemented data quality framework using Great Expectations, catching 95% of schema issues before production
- Mentored 2 junior data engineers through pair programming and technical design reviews
- Led cross-team initiative to standardize data modeling conventions across 8 engineering teams

Data Engineer — Canva (2019–2021)
- Built real-time event streaming pipeline with Kafka and Spark Structured Streaming for user behavior analytics
- Developed Python-based ETL framework used across the data team for standardized data transformations
- Migrated legacy Redshift warehouse to Snowflake, improving query performance by 60%
- Created self-service data catalog using Apache Atlas for dataset discovery and lineage tracking
- Participated in on-call rotation for production pipeline monitoring and incident response

Junior Data Engineer — Commonwealth Bank of Australia (2017–2019)
- Built batch ETL pipelines using PySpark and Hive for regulatory reporting
- Developed data validation scripts ensuring compliance with APRA data quality standards
- Maintained scheduling and monitoring of 50+ daily data jobs in Autosys
- Assisted with data migration projects from on-premise Hadoop to cloud-based solutions

TECHNICAL SKILLS
Processing: Apache Spark, PySpark, Spark Structured Streaming, Flink
Orchestration: Apache Airflow, Prefect, dbt, Luigi
Languages: Python, SQL, Scala, Bash
Storage: Snowflake, Redshift, BigQuery, Delta Lake, Hive, Parquet
Streaming: Apache Kafka, Kinesis, Pub/Sub
Cloud: AWS (Glue, EMR, S3, Redshift, Lambda, Athena), GCP (BigQuery, Dataflow)
Quality: Great Expectations, dbt tests, Apache Griffin

EDUCATION
B.Eng. Software Engineering — University of New South Wales (2017)

CERTIFICATIONS
AWS Data Analytics Specialty (2022)
Databricks Certified Data Engineer Professional (2023)
`,
    questionnaire: {
      currentRole: 'Senior Data Engineer',
      targetRole: 'Data Team Lead',
      yearsExperience: 7,
      country: 'Australia',
      workPreference: 'onsite',
      currentSalary: 160000,
      targetSalary: 185000,
      language: 'en',
    },
    expectedTraits: {
      minFitScore: 5,
      maxFitScore: 7,
      expectedGapSeverities: ['critical', 'moderate', 'minor'],
      mustHaveStrengthKeywords: ['Spark', 'Airflow', 'Python', 'data engineering'],
      mustHaveGapKeywords: ['team management', 'data governance'],
      expectedCurrency: 'AUD',
      shouldIncludeTargetRole: true,
    },
  },

  // ─── B07: Senior QA Engineer → QA Director ────────────────────────────
  {
    id: 'B07',
    category: 'tech-pivot',
    description:
      'Senior QA Engineer pivoting to QA Director — strong automation and strategy skills but lacks department leadership and quality strategy experience',
    cvText: `AOIFE MURPHY
Senior QA Engineer

CONTACT
aoife.murphy@email.ie | Dublin, Ireland | linkedin.com/in/aoifemurphy-qa

SUMMARY
Senior QA Engineer with 9 years of experience in test automation, quality strategy, and process improvement. Expert in building scalable test frameworks using Selenium, Playwright, and Cypress with deep knowledge of CI/CD quality gates and shift-left testing practices. Experienced in defining QA standards for cross-functional product teams. Seeking to transition into a QA Director role to lead quality assurance at the organizational level, establish department-wide testing strategy, and drive quality culture from the top.

EXPERIENCE

Senior QA Engineer — Intercom (2021–Present)
- Architected end-to-end test automation framework using Playwright and TypeScript, covering 800+ test scenarios across web and mobile platforms
- Established shift-left testing practices, reducing production bugs by 45% through early integration of static analysis, contract testing, and unit test mandates
- Defined and enforced quality gates in CI/CD pipelines using GitHub Actions, blocking releases below 85% coverage threshold
- Led QA guild of 8 engineers across 4 product teams, facilitating knowledge sharing and standardizing testing approaches
- Introduced performance testing program using k6 and Grafana, identifying and resolving 12 critical bottlenecks
- Created monthly quality metrics dashboards for engineering leadership showing defect trends, test coverage, and release velocity

QA Engineer — Stripe (Dublin office) (2018–2021)
- Built API contract testing suite using Pact, validating 150+ microservice integrations
- Developed custom Selenium Grid infrastructure on AWS for parallel cross-browser testing
- Automated regression test suite reducing manual testing effort from 3 days to 4 hours per release
- Implemented chaos engineering tests using Gremlin to validate system resilience
- Mentored 2 junior QA engineers on test automation best practices

QA Engineer — Accenture (2015–2018)
- Executed manual and automated testing for financial services clients
- Built Selenium-based regression suites for web banking applications
- Introduced BDD testing with Cucumber, improving collaboration between QA and product
- Managed test environments and test data provisioning for large-scale enterprise projects
- Earned promotion from Junior to QA Engineer within 18 months

TECHNICAL SKILLS
Automation: Playwright, Selenium, Cypress, Appium, Detox
Performance: k6, JMeter, Gatling, Lighthouse
API Testing: Postman, Pact (contract testing), REST Assured
Languages: TypeScript, JavaScript, Python, Java
CI/CD: GitHub Actions, Jenkins, CircleCI, GitLab CI
Monitoring: Grafana, Datadog, Sentry, PagerDuty
Methodologies: Shift-Left Testing, BDD, TDD, Risk-Based Testing

EDUCATION
B.Sc. Computer Science — Trinity College Dublin (2015)

CERTIFICATIONS
ISTQB Advanced Level Test Automation Engineer (2020)
ISTQB Advanced Level Test Manager (2022)
AWS Certified Cloud Practitioner (2021)
`,
    questionnaire: {
      currentRole: 'Senior QA Engineer',
      targetRole: 'QA Director',
      yearsExperience: 9,
      country: 'Ireland',
      workPreference: 'remote',
      currentSalary: 95000,
      targetSalary: 125000,
      language: 'en',
    },
    expectedTraits: {
      minFitScore: 4,
      maxFitScore: 6,
      expectedGapSeverities: ['critical', 'moderate'],
      mustHaveStrengthKeywords: ['automation', 'testing', 'Playwright', 'QA'],
      mustHaveGapKeywords: ['department leadership', 'quality strategy'],
      expectedCurrency: 'EUR',
      shouldIncludeTargetRole: true,
    },
  },

  // ─── B08: Senior iOS Dev → Mobile Engineering Manager ─────────────────
  {
    id: 'B08',
    category: 'tech-pivot',
    description:
      'Senior iOS Developer pivoting to Mobile Engineering Manager — expert Swift/Kotlin but lacks cross-platform strategy and hiring experience',
    cvText: `JULIEN MOREAU
Senior iOS Developer

CONTACT
julien.moreau@email.fr | Paris, France | github.com/julienmoreau

SUMMARY
Senior iOS Developer with 8 years of experience building high-quality native mobile applications. Expert in Swift, SwiftUI, and UIKit with growing Kotlin Multiplatform experience. Delivered apps with millions of downloads in fintech, health, and e-commerce domains. Passionate about mobile architecture, performance optimization, and mentoring junior developers. Seeking to transition into a Mobile Engineering Manager role to lead a cross-platform mobile team and drive mobile strategy at the product level.

EXPERIENCE

Senior iOS Developer — BlaBlaCar (2021–Present)
- Led development of BlaBlaCar's iOS rider experience app (4.7 star rating, 10M+ downloads) using Swift and SwiftUI
- Architected modular app structure with SPM (Swift Package Manager), enabling independent feature development across 3 sub-teams
- Implemented offline-first architecture using Core Data and background sync, improving reliability in low-connectivity areas
- Reduced app crash rate from 0.8% to 0.1% through systematic crash analysis and proactive memory management
- Mentored 4 junior iOS developers through code reviews, architecture sessions, and career development conversations
- Collaborated with Android team on shared Kotlin Multiplatform module for networking and business logic
- Introduced SwiftUI incrementally, migrating 40% of screens from UIKit with zero regression

iOS Developer — Doctolib (2018–2021)
- Built the patient-facing appointment booking flow used by 60M+ patients across France and Germany
- Implemented real-time video consultation feature using WebRTC and custom UIKit components
- Developed CI/CD pipeline with Fastlane and Bitrise, reducing release cycle from 2 weeks to 3 days
- Created comprehensive UI testing suite with XCTest covering 200+ user flows
- Participated in design system creation, building reusable UIKit components matching Figma specifications

Junior iOS Developer — Criteo (2016–2018)
- Developed SDK components for Criteo's mobile advertising platform in Objective-C and Swift
- Implemented A/B testing framework for ad format experimentation
- Wrote unit tests and participated in peer code review processes
- Contributed to technical documentation for external SDK integrations

TECHNICAL SKILLS
iOS: Swift, SwiftUI, UIKit, Combine, Core Data, Core Animation, AVFoundation
Cross-Platform: Kotlin Multiplatform, React Native (exposure)
Architecture: MVVM, Clean Architecture, Coordinator Pattern, TCA (The Composable Architecture)
Tools: Xcode, Instruments, Fastlane, Bitrise, CocoaPods, SPM
Testing: XCTest, XCUITest, Quick/Nimble, Snapshot Testing
Backend Familiarity: Node.js, Firebase, REST APIs, GraphQL
Design: Figma collaboration, Human Interface Guidelines expertise

EDUCATION
M.Sc. Computer Science — Ecole Polytechnique (2016)

LANGUAGES
French (native), English (fluent), German (basic)
`,
    questionnaire: {
      currentRole: 'Senior iOS Developer',
      targetRole: 'Mobile Engineering Manager',
      yearsExperience: 8,
      country: 'France',
      workPreference: 'hybrid',
      currentSalary: 72000,
      targetSalary: 90000,
      language: 'en',
    },
    expectedTraits: {
      minFitScore: 5,
      maxFitScore: 7,
      expectedGapSeverities: ['critical', 'moderate', 'minor'],
      mustHaveStrengthKeywords: ['Swift', 'iOS', 'mobile', 'SwiftUI'],
      mustHaveGapKeywords: ['cross-platform strategy', 'hiring'],
      expectedCurrency: 'EUR',
      shouldIncludeTargetRole: true,
    },
  },

  // ─── B09: Platform Engineer → Developer Advocate ──────────────────────
  {
    id: 'B09',
    category: 'tech-pivot',
    description:
      'Platform Engineer pivoting to Developer Advocate — strong K8s/Go/community contributions but lacks public speaking, content creation, and developer relations experience',
    cvText: `JORDAN CHEN
Platform Engineer

CONTACT
jordan.chen@email.com | Portland, OR, USA | github.com/jordanchen | blog.jordanchen.dev

SUMMARY
Platform Engineer with 6 years of experience building internal developer platforms and Kubernetes-based infrastructure. Expert in Go, Kubernetes, and cloud-native tooling with a passion for developer experience and open-source community engagement. Active contributor to CNCF projects with a growing technical blog. Seeking to transition into a Developer Advocate role to combine my deep platform engineering expertise with my enthusiasm for teaching, community building, and making complex infrastructure accessible to developers everywhere.

EXPERIENCE

Senior Platform Engineer — HashiCorp (2022–Present)
- Built and maintained internal Kubernetes platform serving 300+ developers across 50+ microservices
- Developed custom Kubernetes operators in Go for automated certificate rotation and secret management
- Created Terraform modules and Helm charts published as internal golden paths for service deployment
- Wrote 15+ internal technical guides on Kubernetes best practices, Terraform patterns, and security hardening
- Gave 4 internal tech talks on service mesh architecture and platform engineering principles (audiences of 50-80 engineers)
- Active participant in Platform Engineering Slack community, answering 200+ questions per quarter
- Contributed bug fixes and documentation improvements to Consul and Nomad open-source projects

Platform Engineer — New Relic (2020–2022)
- Managed Kubernetes clusters (EKS) running observability infrastructure processing 1PB+ data daily
- Built Go-based CLI tool for developer self-service infrastructure provisioning (adopted by 150+ engineers)
- Implemented GitOps workflow with ArgoCD and Kustomize for 100+ production services
- Authored engineering blog posts on Kubernetes migration challenges (3 published on company blog)
- Participated in KubeCon booth duty and hallway conversations (not as a speaker)

DevOps Engineer — Puppet (2018–2020)
- Maintained CI/CD pipelines and infrastructure automation using Puppet, Terraform, and Docker
- Built monitoring and alerting stack with Prometheus, Grafana, and PagerDuty
- Contributed to Puppet's open-source modules on GitHub, receiving 30+ merged pull requests
- Organized monthly internal learning sessions on infrastructure automation topics

TECHNICAL SKILLS
Languages: Go, Python, Bash, TypeScript
Kubernetes: Operators (kubebuilder), Helm, Kustomize, ArgoCD, Istio, Linkerd
Infrastructure: Terraform, Pulumi, Ansible, Puppet
Cloud: AWS (EKS, EC2, Lambda, S3, IAM), GCP (GKE, Cloud Run)
Observability: Prometheus, Grafana, OpenTelemetry, Jaeger, Datadog
Tools: Docker, containerd, Git, GitHub Actions, Backstage

COMMUNITY & WRITING
- Technical blog (blog.jordanchen.dev) — 25 posts on platform engineering, Kubernetes, and Go (8K monthly readers)
- CNCF contributor: merged PRs to Kubernetes docs, Helm, and OpenTelemetry Collector
- Co-organizer of Portland Cloud Native Meetup (120 members)
- No formal conference speaking or keynote experience

EDUCATION
B.Sc. Computer Science — Oregon State University (2018)

CERTIFICATIONS
Certified Kubernetes Administrator (CKA) (2021)
Certified Kubernetes Application Developer (CKAD) (2022)
HashiCorp Terraform Associate (2022)
`,
    questionnaire: {
      currentRole: 'Platform Engineer',
      targetRole: 'Developer Advocate',
      yearsExperience: 6,
      country: 'United States',
      workPreference: 'remote',
      currentSalary: 165000,
      targetSalary: 170000,
      language: 'en',
    },
    expectedTraits: {
      minFitScore: 4,
      maxFitScore: 6,
      expectedGapSeverities: ['critical', 'moderate'],
      mustHaveStrengthKeywords: ['Kubernetes', 'Go', 'platform engineering', 'open-source'],
      mustHaveGapKeywords: ['public speaking', 'content creation', 'developer relations'],
      expectedCurrency: 'EUR',
      shouldIncludeTargetRole: true,
    },
  },

  // ─── B10: Senior Security Engineer → CISO ─────────────────────────────
  {
    id: 'B10',
    category: 'tech-pivot',
    description:
      'Senior Security Engineer pivoting to CISO — expert penetration testing and compliance but critical gaps in risk management, board communication, and governance',
    cvText: `STEFAN RICHTER
Senior Security Engineer

CONTACT
stefan.richter@email.ch | Zurich, Switzerland | linkedin.com/in/stefanrichter-sec

SUMMARY
Senior Security Engineer with 10 years of experience in offensive security, compliance, and infrastructure hardening. Expert in penetration testing, vulnerability assessment, and security architecture with deep experience across regulated industries including finance and healthcare. Proven ability to build security programs from the ground up and lead technical security teams. Seeking to transition into a Chief Information Security Officer (CISO) role to drive security strategy at the executive level and align cybersecurity initiatives with business objectives.

EXPERIENCE

Senior Security Engineer — UBS AG (2021–Present)
- Led red team engagements across UBS's global infrastructure, identifying and remediating 200+ critical vulnerabilities annually
- Designed and implemented zero-trust network architecture for the private banking division serving 50K+ high-net-worth clients
- Built automated vulnerability scanning pipeline using Nessus, Burp Suite, and custom Python scripts, reducing assessment time by 65%
- Developed cloud security posture management (CSPM) program for AWS and Azure workloads across 3 business units
- Achieved SOC 2 Type II, ISO 27001, and FINMA regulatory compliance for newly launched digital banking platform
- Managed team of 4 security engineers conducting application security assessments and code reviews
- Presented quarterly security metrics to engineering leadership (VP-level), not to board or C-suite

Security Engineer — Roche (2017–2021)
- Conducted penetration testing for clinical trial management platforms and patient data systems
- Implemented SIEM solution using Splunk, creating 150+ correlation rules for threat detection
- Developed security awareness training program delivered to 2,000+ employees across Switzerland and Germany
- Led incident response for 3 major security events, coordinating with legal, communications, and IT teams
- Designed data loss prevention (DLP) policies for protecting sensitive research and patient data
- Earned GDPR technical compliance lead role for the Swiss research division

Junior Security Analyst — Swisscom (2014–2017)
- Performed vulnerability assessments on network infrastructure and web applications
- Monitored security events using SIEM tools and escalated incidents per runbook procedures
- Assisted with PCI DSS compliance audits for payment processing systems
- Built internal CTF (Capture The Flag) challenges for team skill development
- Obtained OSCP certification while in this role, demonstrating advanced offensive security skills

TECHNICAL SKILLS
Offensive Security: Metasploit, Burp Suite, Cobalt Strike, Nmap, Wireshark, OWASP ZAP
Compliance: SOC 2, ISO 27001, GDPR, PCI DSS, FINMA, HIPAA, NIST CSF
Cloud Security: AWS Security Hub, Azure Sentinel, GCP Security Command Center, Prisma Cloud
SIEM & Detection: Splunk, Elastic SIEM, CrowdStrike Falcon, Sentinel One
Scripting: Python, Bash, PowerShell, Go
Infrastructure: Firewalls (Palo Alto, Fortinet), WAF, VPN, Zero Trust (Zscaler, Cloudflare Access)
Identity: Okta, Azure AD, CyberArk PAM

EDUCATION
M.Sc. Information Security — ETH Zurich (2014)
B.Sc. Computer Science — Universitat Zurich (2012)

CERTIFICATIONS
Offensive Security Certified Professional (OSCP) (2016)
Certified Information Systems Security Professional (CISSP) (2020)
Certified Cloud Security Professional (CCSP) (2022)
AWS Security Specialty (2021)

LANGUAGES
German (native), English (fluent), French (intermediate)
`,
    questionnaire: {
      currentRole: 'Senior Security Engineer',
      targetRole: 'CISO',
      yearsExperience: 10,
      country: 'Switzerland',
      workPreference: 'onsite',
      currentSalary: 155000,
      targetSalary: 220000,
      language: 'en',
    },
    expectedTraits: {
      minFitScore: 3,
      maxFitScore: 5,
      expectedGapSeverities: ['critical', 'moderate'],
      mustHaveStrengthKeywords: ['penetration testing', 'compliance', 'security', 'CISSP'],
      mustHaveGapKeywords: ['risk management', 'board communication', 'governance'],
      expectedCurrency: 'CHF',
      shouldIncludeTargetRole: true,
    },
  },
];
