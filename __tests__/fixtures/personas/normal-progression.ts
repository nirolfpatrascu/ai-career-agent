import type { SyntheticPersona } from './types';

export const normalProgressionPersonas: SyntheticPersona[] = [
  // ─────────────────────────────────────────────────────────────────────────────
  // A01: Junior Frontend Dev → Mid Frontend Dev
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'A01',
    category: 'normal',
    description: 'Junior Frontend Dev → Mid Frontend Dev',
    cvText: `SUMMARY
Motivated Junior Frontend Developer with 2 years of professional experience building responsive web applications using React and JavaScript. Passionate about creating intuitive user interfaces and writing clean, maintainable code. Adept at working within agile teams and translating design mockups into pixel-perfect implementations.

EXPERIENCE

Junior Frontend Developer | BrightWave Digital, New York, NY | Jan 2024 – Present
- Developed and maintained customer-facing React applications serving 50,000+ monthly active users
- Implemented responsive layouts using CSS Grid, Flexbox, and Tailwind CSS across 15+ pages
- Collaborated with UX designers to convert Figma mockups into interactive React components
- Reduced page load time by 18% through image optimization and lazy loading techniques
- Participated in daily stand-ups, sprint planning, and bi-weekly retrospectives
- Used Git and GitHub for version control, managing feature branches and pull requests

Frontend Development Intern | PixelForge Studios, Brooklyn, NY | Jun 2023 – Dec 2023
- Built interactive landing pages using HTML, CSS, and vanilla JavaScript
- Assisted senior developers in migrating a legacy jQuery application to React
- Created reusable UI component library with 20+ components documented in Storybook
- Wrote basic unit tests using Jest for utility functions

EDUCATION

Bachelor of Science in Computer Science | Rutgers University, New Brunswick, NJ | 2023
- Relevant coursework: Web Development, Data Structures, Algorithms, Human-Computer Interaction
- Senior capstone: Built a real-time collaborative task management app using React and Firebase

SKILLS
- Languages: JavaScript, HTML5, CSS3, TypeScript (basic)
- Frameworks: React, Next.js (basic)
- Styling: Tailwind CSS, Styled Components, CSS Modules
- Tools: Git, GitHub, VS Code, Figma, npm, Webpack
- Other: REST APIs, JSON, Responsive Design, Agile/Scrum

CERTIFICATIONS
- Meta Front-End Developer Professional Certificate (Coursera, 2023)`,
    questionnaire: {
      currentRole: 'Junior Frontend Developer',
      targetRole: 'Mid-Level Frontend Developer',
      yearsExperience: 2,
      country: 'United States',
      workPreference: 'hybrid',
    },
    expectedTraits: {
      minFitScore: 6,
      maxFitScore: 8,
      expectedGapSeverities: ['moderate', 'minor'],
      mustHaveStrengthKeywords: ['react', 'javascript'],
      mustHaveGapKeywords: ['testing', 'architecture'],
      expectedCurrency: 'USD',
      shouldIncludeTargetRole: true,
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // A02: Mid Backend Dev → Senior Backend Dev
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'A02',
    category: 'normal',
    description: 'Mid Backend Dev → Senior Backend Dev',
    cvText: `SUMMARY
Backend Developer with 5 years of experience designing and building scalable server-side applications. Proficient in Python and Node.js with strong expertise in RESTful API design, relational databases, and cloud deployment. Committed to writing well-tested, performant code and collaborating effectively with cross-functional teams.

EXPERIENCE

Mid-Level Backend Developer | Finlogic Solutions, London, UK | Mar 2022 – Present
- Designed and implemented RESTful APIs using Python (Flask, FastAPI) serving 200+ endpoints for a fintech platform processing 10M+ transactions monthly
- Built event-driven microservices using Node.js and RabbitMQ to decouple payment processing workflows
- Optimized PostgreSQL queries reducing average response time by 35% across critical endpoints
- Implemented caching layer using Redis, reducing database load by 40%
- Led migration of legacy monolithic service to containerized microservices using Docker
- Wrote comprehensive unit and integration tests achieving 85% code coverage with pytest and Mocha
- Conducted code reviews for a team of 4 junior developers, providing constructive feedback

Backend Developer | DataStream Technologies, Manchester, UK | Sep 2020 – Feb 2022
- Developed backend services for a data analytics platform using Python and Django
- Created ETL pipelines processing 500GB+ of daily data using Celery and PostgreSQL
- Integrated third-party APIs including Stripe, Twilio, and SendGrid
- Implemented JWT-based authentication and role-based access control
- Managed CI/CD pipelines using GitHub Actions for automated testing and deployment

Junior Backend Developer | CloudBridge Ltd, Birmingham, UK | Jun 2019 – Aug 2020
- Built RESTful APIs using Express.js and Node.js for internal tools
- Wrote SQL queries and stored procedures for MySQL databases
- Assisted in migrating on-premises applications to AWS (EC2, S3, RDS)

EDUCATION

Master of Science in Software Engineering | University of Manchester, UK | 2019
Bachelor of Science in Computer Science | University of Birmingham, UK | 2018

SKILLS
- Languages: Python, JavaScript, TypeScript, SQL
- Frameworks: Flask, FastAPI, Django, Express.js, Node.js
- Databases: PostgreSQL, MySQL, Redis, MongoDB
- Tools: Docker, Git, GitHub Actions, AWS (EC2, S3, RDS, Lambda), RabbitMQ
- Practices: REST API Design, TDD, Agile/Scrum, Code Reviews

CERTIFICATIONS
- AWS Certified Developer – Associate (2022)
- Python Institute PCAP – Certified Associate in Python Programming (2020)`,
    questionnaire: {
      currentRole: 'Mid-Level Backend Developer',
      targetRole: 'Senior Backend Developer',
      yearsExperience: 5,
      country: 'United Kingdom',
      workPreference: 'onsite',
    },
    expectedTraits: {
      minFitScore: 6,
      maxFitScore: 8,
      expectedGapSeverities: ['moderate', 'minor'],
      mustHaveStrengthKeywords: ['python', 'node.js'],
      mustHaveGapKeywords: ['system design', 'mentoring'],
      expectedCurrency: 'GBP',
      shouldIncludeTargetRole: true,
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // A03: Senior Full-Stack → Staff Engineer
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'A03',
    category: 'normal',
    description: 'Senior Full-Stack → Staff Engineer',
    cvText: `SUMMARY
Senior Full-Stack Engineer with 8 years of experience building and scaling web applications from prototype to production. Deep expertise in React, Node.js, and AWS with a strong focus on application performance, developer tooling, and technical leadership. Proven ability to own complex features end-to-end and deliver high-quality software in fast-paced startup environments.

EXPERIENCE

Senior Full-Stack Engineer | Velocio GmbH, Berlin, Germany | Apr 2021 – Present
- Led development of a real-time analytics dashboard using React, TypeScript, and D3.js, serving 2,000+ enterprise clients
- Designed and built backend services using Node.js, Express, and GraphQL with PostgreSQL and Redis
- Architected event-driven data pipeline on AWS (Lambda, SQS, DynamoDB) processing 5M+ events per day
- Reduced frontend bundle size by 45% through code splitting, tree shaking, and migration to Vite
- Mentored 3 junior engineers through pair programming and weekly 1:1 sessions
- Introduced end-to-end testing with Cypress, reducing production bugs by 30%
- Participated in on-call rotation and incident response for high-availability services (99.95% SLA)

Full-Stack Developer | TechNova Solutions, Munich, Germany | Jun 2018 – Mar 2021
- Built multi-tenant SaaS platform using React, Redux, and Node.js serving 500+ companies
- Implemented CI/CD pipeline using Jenkins and Docker, reducing deployment time from hours to minutes
- Developed RESTful APIs and WebSocket services for real-time collaboration features
- Managed PostgreSQL databases with complex schemas and optimized queries for reporting
- Integrated AWS services including S3, CloudFront, SES, and Cognito for authentication

Full-Stack Developer | WebCraft Agency, Frankfurt, Germany | Aug 2016 – May 2018
- Delivered 20+ client projects using React, Angular, and Node.js
- Built custom CMS solutions and e-commerce platforms
- Managed deployments on AWS EC2 and Heroku

EDUCATION

Diplom-Informatiker (equiv. MSc Computer Science) | Technische Universitat Darmstadt, Germany | 2016
- Thesis: Real-time collaborative editing algorithms for web applications

SKILLS
- Frontend: React, TypeScript, Redux, GraphQL, D3.js, Tailwind CSS, Cypress
- Backend: Node.js, Express, Fastify, GraphQL, REST APIs
- Cloud: AWS (Lambda, SQS, DynamoDB, S3, CloudFront, EC2, RDS, Cognito), Docker
- Databases: PostgreSQL, Redis, MongoDB, DynamoDB
- Tools: Git, GitHub, Jenkins, Vite, Webpack, Terraform (basic)

CERTIFICATIONS
- AWS Certified Solutions Architect – Associate (2022)
- AWS Certified Developer – Associate (2020)`,
    questionnaire: {
      currentRole: 'Senior Full-Stack Engineer',
      targetRole: 'Staff Engineer',
      yearsExperience: 8,
      country: 'Germany',
      workPreference: 'remote',
    },
    expectedTraits: {
      minFitScore: 5,
      maxFitScore: 7,
      expectedGapSeverities: ['moderate', 'minor'],
      mustHaveStrengthKeywords: ['react', 'node.js', 'aws'],
      mustHaveGapKeywords: ['architecture', 'influence'],
      expectedCurrency: 'EUR',
      shouldIncludeTargetRole: true,
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // A04: Junior Data Analyst → Mid Data Analyst
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'A04',
    category: 'normal',
    description: 'Junior Data Analyst → Mid Data Analyst',
    cvText: `SUMMARY
Data Analyst with 2 years of experience extracting insights from complex datasets. Skilled in SQL, Python, and Excel with a growing ability to build dashboards and deliver actionable business recommendations. Eager to expand into advanced statistical analysis and data visualization.

EXPERIENCE

Junior Data Analyst | Infosys BPM, Bangalore, India | Feb 2024 – Present
- Analyzed sales and customer data across 3 business units using SQL queries on Oracle and PostgreSQL databases
- Built weekly and monthly reporting dashboards in Excel and Google Sheets for senior management
- Cleaned and preprocessed datasets of 500K+ rows using Python (Pandas, NumPy) to ensure data quality
- Created automated data validation scripts in Python reducing manual QA time by 60%
- Collaborated with product managers to define KPIs and track feature adoption metrics
- Presented findings to cross-functional teams of 10–15 stakeholders in bi-weekly meetings

Data Analyst Intern | TechMahindra, Hyderabad, India | Jun 2023 – Jan 2024
- Assisted in building customer segmentation models using Excel pivot tables and basic Python scripts
- Wrote SQL queries to extract data from MySQL databases for ad-hoc reporting requests
- Documented data dictionaries and standard operating procedures for the analytics team
- Supported A/B test analysis for marketing campaigns, calculating conversion rates and statistical significance

EDUCATION

Bachelor of Technology in Information Technology | Vellore Institute of Technology, India | 2023
- CGPA: 8.5/10
- Relevant coursework: Database Management Systems, Statistics, Data Mining, Machine Learning Fundamentals
- Final year project: Customer churn prediction using logistic regression and random forests

SKILLS
- Languages: SQL, Python, R (basic)
- Data Tools: Excel (advanced), Google Sheets, Pandas, NumPy
- Databases: PostgreSQL, MySQL, Oracle
- Visualization: Matplotlib (basic), Excel Charts, Google Data Studio
- Other: Data Cleaning, Pivot Tables, A/B Testing, Agile/Scrum

CERTIFICATIONS
- Google Data Analytics Professional Certificate (Coursera, 2023)
- HackerRank SQL (Advanced) Certificate (2023)`,
    questionnaire: {
      currentRole: 'Junior Data Analyst',
      targetRole: 'Mid-Level Data Analyst',
      yearsExperience: 2,
      country: 'India',
      workPreference: 'onsite',
    },
    expectedTraits: {
      minFitScore: 6,
      maxFitScore: 8,
      expectedGapSeverities: ['moderate', 'minor'],
      mustHaveStrengthKeywords: ['sql', 'python', 'excel'],
      mustHaveGapKeywords: ['statistics', 'visualization'],
      expectedCurrency: 'INR',
      shouldIncludeTargetRole: true,
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // A05: Mid DevOps → Senior DevOps
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'A05',
    category: 'normal',
    description: 'Mid DevOps → Senior DevOps',
    cvText: `SUMMARY
DevOps Engineer with 5 years of experience automating infrastructure, building CI/CD pipelines, and managing cloud environments on AWS. Proficient in Terraform, Docker, and Linux systems administration with a strong focus on reliability and operational efficiency.

EXPERIENCE

Mid-Level DevOps Engineer | BookingTech BV, Amsterdam, Netherlands | Jan 2022 – Present
- Managed AWS infrastructure across 3 environments (dev, staging, production) serving 1M+ daily requests
- Authored and maintained Terraform modules for VPC, EC2, RDS, S3, and IAM provisioning
- Built CI/CD pipelines using GitLab CI and AWS CodePipeline for 25+ microservices
- Containerized 15+ applications using Docker and Docker Compose for local development and deployment
- Implemented centralized logging using ELK stack (Elasticsearch, Logstash, Kibana) processing 2TB+ logs daily
- Automated server provisioning and configuration using Ansible playbooks for 50+ EC2 instances
- Reduced deployment failures by 40% through automated smoke tests and canary deployments
- Participated in 24/7 on-call rotation with a mean-time-to-recovery of under 15 minutes

DevOps Engineer | DataPulse Technologies, Rotterdam, Netherlands | Mar 2020 – Dec 2021
- Managed Linux servers (Ubuntu, CentOS) and performed routine patching and security updates
- Set up monitoring and alerting using Prometheus and Grafana for 30+ services
- Created Docker images and managed container registries on Amazon ECR
- Automated backup procedures for PostgreSQL and MongoDB databases
- Wrote Bash and Python scripts for infrastructure automation tasks

Junior Systems Administrator | NetWorks IT, The Hague, Netherlands | Sep 2019 – Feb 2020
- Monitored server health and responded to incidents using Nagios
- Managed DNS, load balancers, and SSL certificates
- Assisted in migrating on-premises workloads to AWS EC2

EDUCATION

Bachelor of Science in Computer Science | Delft University of Technology, Netherlands | 2019
- Specialization: Distributed Systems

SKILLS
- Cloud: AWS (EC2, S3, RDS, Lambda, VPC, IAM, CloudFront, CodePipeline, ECR)
- IaC: Terraform, Ansible, CloudFormation (basic)
- Containers: Docker, Docker Compose
- CI/CD: GitLab CI, AWS CodePipeline, Jenkins
- Monitoring: Prometheus, Grafana, ELK Stack, Nagios
- Scripting: Bash, Python
- OS: Linux (Ubuntu, CentOS, Amazon Linux)

CERTIFICATIONS
- AWS Certified SysOps Administrator – Associate (2022)
- HashiCorp Certified: Terraform Associate (2021)`,
    questionnaire: {
      currentRole: 'Mid-Level DevOps Engineer',
      targetRole: 'Senior DevOps Engineer',
      yearsExperience: 5,
      country: 'Netherlands',
      workPreference: 'hybrid',
    },
    expectedTraits: {
      minFitScore: 6,
      maxFitScore: 8,
      expectedGapSeverities: ['moderate', 'minor'],
      mustHaveStrengthKeywords: ['aws', 'terraform', 'docker'],
      mustHaveGapKeywords: ['kubernetes', 'security'],
      expectedCurrency: 'EUR',
      shouldIncludeTargetRole: true,
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // A06: QA Engineer → Senior QA/SDET
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'A06',
    category: 'normal',
    description: 'QA Engineer → Senior QA/SDET',
    cvText: `SUMMARY
QA Engineer with 4 years of experience in manual and automated testing of web and mobile applications. Proficient in Selenium, Python, and agile testing methodologies. Strong analytical mindset with a focus on delivering bug-free software through comprehensive test strategies.

EXPERIENCE

QA Engineer | Endava, Bucharest, Romania | May 2022 – Present
- Designed and executed 500+ manual and automated test cases for a banking application used by 300K+ customers
- Built automated regression test suites using Selenium WebDriver and Python covering 70% of critical user flows
- Created and maintained page object model (POM) framework for reusable and maintainable test code
- Performed API testing using Postman and wrote automated API tests with Python Requests library
- Collaborated with developers to define acceptance criteria and identify edge cases during sprint planning
- Reported and tracked 200+ bugs in Jira, including severity classification and reproduction steps
- Integrated automated tests into Jenkins CI pipeline, running nightly regression suites

QA Analyst | Bitdefender, Bucharest, Romania | Aug 2020 – Apr 2022
- Executed manual testing for antivirus software across Windows, macOS, and Android platforms
- Wrote detailed test plans and test cases based on product requirements and user stories
- Performed cross-browser testing using BrowserStack for web management console
- Participated in exploratory testing sessions identifying 30+ undocumented defects
- Created test data and environment setup scripts using Bash

Junior QA Tester | SoftVision (Cognizant), Cluj-Napoca, Romania | Jan 2020 – Jul 2020
- Performed manual functional and regression testing for e-commerce applications
- Documented test results and filed bug reports in Jira
- Assisted in smoke testing after deployments

EDUCATION

Bachelor of Science in Computer Science | University of Bucharest, Romania | 2019
- Relevant coursework: Software Testing, Software Engineering, Databases, Operating Systems

SKILLS
- Automation: Selenium WebDriver, Python, Page Object Model
- API Testing: Postman, Python Requests
- Manual Testing: Functional, Regression, Exploratory, Cross-browser
- Tools: Jira, Jenkins, Git, BrowserStack, TestRail
- Languages: Python, SQL, Bash
- Methodologies: Agile/Scrum, TDD (basic)

CERTIFICATIONS
- ISTQB Certified Tester – Foundation Level (2020)`,
    questionnaire: {
      currentRole: 'QA Engineer',
      targetRole: 'Senior QA Engineer / SDET',
      yearsExperience: 4,
      country: 'Romania',
      workPreference: 'remote',
    },
    expectedTraits: {
      minFitScore: 6,
      maxFitScore: 8,
      expectedGapSeverities: ['moderate', 'minor'],
      mustHaveStrengthKeywords: ['selenium', 'python'],
      mustHaveGapKeywords: ['automation frameworks', 'performance testing'],
      expectedCurrency: 'EUR',
      shouldIncludeTargetRole: true,
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // A07: Junior Mobile Dev → Mid Mobile Dev
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'A07',
    category: 'normal',
    description: 'Junior Mobile Dev → Mid Mobile Dev',
    cvText: `SUMMARY
Mobile Developer with 2 years of experience building cross-platform applications using React Native and TypeScript. Passionate about creating smooth, user-friendly mobile experiences with clean architecture. Familiar with both iOS and Android ecosystems.

EXPERIENCE

Junior Mobile Developer | Nubank (contractor via Stone Age), Sao Paulo, Brazil | Mar 2024 – Present
- Developed new features for a React Native fintech application with 5M+ downloads on iOS and Android
- Implemented UI components using TypeScript and React Native following the design system guidelines
- Integrated RESTful APIs for account management, transaction history, and push notifications
- Fixed 50+ bugs related to navigation, layout rendering, and API error handling across both platforms
- Wrote unit tests using Jest and React Native Testing Library for 30+ components
- Participated in code reviews and pair programming sessions with senior developers
- Used Redux for global state management and AsyncStorage for local data persistence

Mobile Development Intern | iFood, Campinas, Brazil | Aug 2023 – Feb 2024
- Assisted in building a delivery tracking feature using React Native and Google Maps API
- Created reusable UI components matching Figma designs with pixel-perfect accuracy
- Implemented basic animations using React Native Animated API
- Wrote documentation for onboarding new mobile developers

EDUCATION

Bachelor of Science in Computer Engineering | Universidade Estadual de Campinas (UNICAMP), Brazil | 2023
- Relevant coursework: Mobile Computing, Data Structures, Software Engineering, Algorithms
- Final project: Built a fitness tracking app using React Native with Firebase backend

SKILLS
- Languages: TypeScript, JavaScript, Python (basic)
- Frameworks: React Native, React
- State Management: Redux, Context API, AsyncStorage
- Testing: Jest, React Native Testing Library
- Tools: Git, GitHub, VS Code, Xcode, Android Studio, Figma
- APIs: RESTful APIs, Google Maps API, Firebase
- Other: Agile/Scrum, CI/CD basics (Fastlane)

CERTIFICATIONS
- Meta React Native Specialization (Coursera, 2023)`,
    questionnaire: {
      currentRole: 'Junior Mobile Developer',
      targetRole: 'Mid-Level Mobile Developer',
      yearsExperience: 2,
      country: 'Brazil',
      workPreference: 'remote',
    },
    expectedTraits: {
      minFitScore: 6,
      maxFitScore: 8,
      expectedGapSeverities: ['moderate', 'minor'],
      mustHaveStrengthKeywords: ['react native', 'typescript'],
      mustHaveGapKeywords: ['native modules', 'state management'],
      expectedCurrency: 'EUR',
      shouldIncludeTargetRole: true,
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // A08: Mid ML Engineer → Senior ML Engineer
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'A08',
    category: 'normal',
    description: 'Mid ML Engineer → Senior ML Engineer',
    cvText: `SUMMARY
Machine Learning Engineer with 5 years of experience developing, training, and deploying production ML models. Proficient in PyTorch, TensorFlow, and Python with a solid foundation in deep learning, NLP, and computer vision. Strong focus on building scalable ML pipelines and translating research into production systems.

EXPERIENCE

Mid-Level ML Engineer | Shopify, Toronto, Canada | Jan 2022 – Present
- Developed and deployed recommendation models using PyTorch serving 10M+ product suggestions daily
- Built NLP pipeline for automated product categorization using transformers (BERT, RoBERTa) achieving 94% accuracy
- Designed feature engineering pipelines using PySpark and Airflow processing 50M+ rows of user behavior data
- Trained and fine-tuned computer vision models using TensorFlow for product image classification
- Implemented A/B testing framework for ML model comparison, measuring conversion rate impact
- Reduced model inference latency by 40% through model quantization and ONNX conversion
- Collaborated with data engineers to build and maintain feature stores using Redis and BigQuery
- Monitored model performance and data drift using custom dashboards in Grafana

ML Engineer | Element AI (now ServiceNow), Montreal, Canada | Jun 2020 – Dec 2021
- Developed text classification models using scikit-learn and PyTorch for document processing
- Built data preprocessing pipelines using Python, Pandas, and NumPy for training data preparation
- Implemented model serving using Flask APIs and Docker containers on AWS EC2
- Conducted hyperparameter tuning using Optuna and Ray Tune, improving model accuracy by 12%
- Wrote technical documentation for ML models and data processing workflows

Data Science Intern | RBC Royal Bank, Toronto, Canada | May 2019 – May 2020
- Built fraud detection models using gradient boosting (XGBoost) and logistic regression
- Performed exploratory data analysis on transaction datasets using Python and Jupyter notebooks
- Created visualizations and reports for business stakeholders using Matplotlib and Seaborn

EDUCATION

Master of Science in Computer Science (ML Specialization) | University of Toronto, Canada | 2019
Bachelor of Science in Mathematics | McGill University, Montreal, Canada | 2017

SKILLS
- ML Frameworks: PyTorch, TensorFlow, scikit-learn, XGBoost, Hugging Face Transformers
- Languages: Python, SQL, R (basic)
- Data Processing: PySpark, Pandas, NumPy, Airflow
- Deployment: Docker, Flask, FastAPI, ONNX, AWS (EC2, S3, SageMaker basics)
- Tools: Jupyter, Git, MLflow (basic), Grafana, BigQuery
- Domains: NLP, Computer Vision, Recommendation Systems, Fraud Detection

CERTIFICATIONS
- Deep Learning Specialization – Andrew Ng (Coursera, 2020)
- AWS Certified Machine Learning – Specialty (2023)`,
    questionnaire: {
      currentRole: 'Mid-Level ML Engineer',
      targetRole: 'Senior ML Engineer',
      yearsExperience: 5,
      country: 'Canada',
      workPreference: 'hybrid',
    },
    expectedTraits: {
      minFitScore: 5,
      maxFitScore: 7,
      expectedGapSeverities: ['moderate', 'minor'],
      mustHaveStrengthKeywords: ['pytorch', 'tensorflow', 'python'],
      mustHaveGapKeywords: ['mlops', 'research papers'],
      expectedCurrency: 'CAD',
      shouldIncludeTargetRole: true,
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // A09: Senior SysAdmin → Cloud Architect
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'A09',
    category: 'normal',
    description: 'Senior SysAdmin → Cloud Architect',
    cvText: `SUMMARY
Senior Systems Administrator with 10 years of experience managing enterprise infrastructure including Linux servers, networking, storage, and virtualization. Deep expertise in AWS cloud services with a strong track record in high-availability system design and disaster recovery planning.

EXPERIENCE

Senior Systems Administrator | Societe Generale, Paris, France | Apr 2020 – Present
- Managed 200+ Linux servers (RHEL, Ubuntu) across on-premises data centers and AWS cloud environments
- Designed and implemented high-availability architecture for core banking applications serving 5M+ customers
- Administered networking infrastructure including Cisco switches, F5 load balancers, and VPN gateways
- Migrated 40+ on-premises applications to AWS (EC2, RDS, S3) reducing infrastructure costs by 30%
- Implemented automated patching and compliance scanning using Ansible and AWS Systems Manager
- Configured and managed VMware vSphere clusters hosting 500+ virtual machines
- Designed disaster recovery procedures achieving RPO of 1 hour and RTO of 4 hours
- Led incident response for critical infrastructure outages, maintaining 99.9% uptime SLA

Systems Administrator | Orange Business Services, Lyon, France | Jun 2016 – Mar 2020
- Administered Red Hat Enterprise Linux servers for telecommunications infrastructure
- Managed Nagios and Zabbix monitoring for 100+ servers and network devices
- Configured Apache and Nginx web servers, HAProxy load balancers, and Squid proxies
- Implemented centralized log management using rsyslog and ELK stack
- Performed capacity planning and hardware procurement for data center expansions
- Wrote Bash and Python scripts for system automation and reporting

Junior Systems Administrator | Capgemini, Paris, France | Sep 2014 – May 2016
- Managed Windows and Linux servers for client environments
- Performed daily backup operations using Veritas NetBackup
- Provided Level 2 support for infrastructure incidents
- Documented standard operating procedures and runbooks

EDUCATION

Master of Science in Network and Systems Administration | Universite Paris-Saclay, France | 2014
Bachelor of Science in Computer Science | Universite Claude Bernard Lyon 1, France | 2012

SKILLS
- Operating Systems: Linux (RHEL, Ubuntu, CentOS), Windows Server
- Cloud: AWS (EC2, RDS, S3, VPC, IAM, Route53, CloudWatch, Systems Manager)
- Networking: TCP/IP, DNS, DHCP, VPN, Cisco, F5 Load Balancers, HAProxy
- Virtualization: VMware vSphere, KVM
- Monitoring: Nagios, Zabbix, Grafana, ELK Stack
- Scripting: Bash, Python, PowerShell
- Configuration: Ansible, AWS Systems Manager
- Storage: SAN, NAS, NFS, AWS EBS/EFS

CERTIFICATIONS
- AWS Certified Solutions Architect – Associate (2021)
- RHCE – Red Hat Certified Engineer (2018)
- CCNA – Cisco Certified Network Associate (2016)`,
    questionnaire: {
      currentRole: 'Senior Systems Administrator',
      targetRole: 'Cloud Architect',
      yearsExperience: 10,
      country: 'France',
      workPreference: 'onsite',
    },
    expectedTraits: {
      minFitScore: 5,
      maxFitScore: 7,
      expectedGapSeverities: ['moderate', 'minor'],
      mustHaveStrengthKeywords: ['linux', 'aws', 'networking'],
      mustHaveGapKeywords: ['iac', 'multi-cloud'],
      expectedCurrency: 'EUR',
      shouldIncludeTargetRole: true,
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // A10: Junior UX Designer → Mid UX Designer
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'A10',
    category: 'normal',
    description: 'Junior UX Designer → Mid UX Designer',
    cvText: `SUMMARY
UX Designer with 2 years of experience creating user-centered digital experiences. Proficient in Figma for wireframing, prototyping, and visual design. Skilled in user research techniques including interviews, surveys, and usability evaluations. Passionate about solving complex design problems with empathy and data-driven decisions.

EXPERIENCE

Junior UX Designer | Cabify, Madrid, Spain | Apr 2024 – Present
- Designed user interfaces for the rider and driver mobile applications using Figma, impacting 10M+ users across Latin America and Spain
- Conducted 20+ user research interviews to understand pain points in the booking flow
- Created wireframes, high-fidelity mockups, and interactive prototypes for new features
- Collaborated with product managers and developers during sprint planning to define requirements
- Redesigned the ride history screen improving task completion rate by 25% based on usability feedback
- Maintained and contributed to the design system with 40+ reusable components
- Presented design proposals to stakeholders and incorporated feedback iteratively

UX Design Intern | Typeform, Barcelona, Spain | Sep 2023 – Mar 2024
- Assisted senior designers in creating wireframes and user flows for form builder features
- Conducted competitive analysis of 10+ survey and form tools
- Organized and synthesized user research findings into actionable insights
- Created personas and journey maps based on qualitative interview data
- Supported accessibility audits ensuring WCAG 2.1 AA compliance

EDUCATION

Bachelor of Fine Arts in Digital Design | Universitat Pompeu Fabra, Barcelona, Spain | 2023
- Specialization: Interaction Design
- Thesis: Designing for accessibility in mobile ride-sharing applications

SKILLS
- Design: Figma, Adobe XD, Sketch (basic), Adobe Illustrator
- Research: User Interviews, Surveys, Competitive Analysis, Personas, Journey Maps
- Prototyping: Figma Prototyping, InVision (basic)
- Collaboration: Jira, Confluence, Miro, Slack
- Other: Design Systems, Wireframing, Responsive Design, Accessibility (WCAG 2.1)

CERTIFICATIONS
- Google UX Design Professional Certificate (Coursera, 2023)`,
    questionnaire: {
      currentRole: 'Junior UX Designer',
      targetRole: 'Mid-Level UX Designer',
      yearsExperience: 2,
      country: 'Spain',
      workPreference: 'hybrid',
    },
    expectedTraits: {
      minFitScore: 6,
      maxFitScore: 8,
      expectedGapSeverities: ['moderate', 'minor'],
      mustHaveStrengthKeywords: ['figma', 'user research'],
      mustHaveGapKeywords: ['user testing', 'information architecture'],
      expectedCurrency: 'EUR',
      shouldIncludeTargetRole: true,
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // A11: Mid Frontend Dev → Senior Frontend Dev
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'A11',
    category: 'normal',
    description: 'Mid Frontend Dev → Senior Frontend Dev',
    cvText: `SUMMARY
Frontend Developer with 4 years of experience building modern web applications using Vue.js and TypeScript. Focused on creating responsive, well-structured user interfaces with component-based architectures. Experienced in collaborating with backend teams and translating complex business requirements into intuitive UIs.

EXPERIENCE

Mid-Level Frontend Developer | Allegro, Warsaw, Poland | Feb 2022 – Present
- Developed and maintained e-commerce frontend features using Vue.js 3 (Composition API) and TypeScript for a platform serving 20M+ monthly users
- Built reusable component library with 50+ Vue components documented in Storybook
- Implemented complex product filtering and search interfaces with real-time updates
- Integrated GraphQL APIs using Apollo Client for efficient data fetching
- Collaborated with UX designers to implement responsive designs across desktop and mobile breakpoints
- Reduced time-to-interactive by 20% through route-based code splitting and lazy loading
- Wrote unit tests using Vitest and component tests using Vue Test Utils achieving 75% code coverage
- Participated in code reviews and provided feedback on pull requests from junior developers

Frontend Developer | CD Projekt, Warsaw, Poland | Jun 2020 – Jan 2022
- Built internal tools and admin dashboards using Vue.js 2 and Vuex for game development teams
- Developed a localization management tool supporting 15+ languages
- Implemented data visualization components using Chart.js for analytics dashboards
- Created responsive email templates and marketing landing pages
- Managed state using Vuex and migrated to Pinia for newer projects

EDUCATION

Bachelor of Engineering in Computer Science | Warsaw University of Technology, Poland | 2020
- Relevant coursework: Web Technologies, Human-Computer Interaction, Software Engineering, Algorithms

SKILLS
- Languages: TypeScript, JavaScript, HTML5, CSS3
- Frameworks: Vue.js 2/3, Nuxt.js (basic), React (basic)
- State Management: Pinia, Vuex, Apollo Client
- Testing: Vitest, Vue Test Utils, Cypress (basic)
- Styling: Tailwind CSS, SCSS, CSS Modules
- Tools: Git, Storybook, Vite, Webpack, Figma, Jira

CERTIFICATIONS
- Vue.js Certified Developer (Vue School, 2022)`,
    questionnaire: {
      currentRole: 'Mid-Level Frontend Developer',
      targetRole: 'Senior Frontend Developer',
      yearsExperience: 4,
      country: 'Poland',
      workPreference: 'onsite',
    },
    expectedTraits: {
      minFitScore: 6,
      maxFitScore: 8,
      expectedGapSeverities: ['moderate', 'minor'],
      mustHaveStrengthKeywords: ['vue.js', 'typescript'],
      mustHaveGapKeywords: ['performance optimization', 'accessibility'],
      expectedCurrency: 'PLN',
      shouldIncludeTargetRole: true,
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // A12: Junior Backend Dev → Mid Backend Dev
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'A12',
    category: 'normal',
    description: 'Junior Backend Dev → Mid Backend Dev',
    cvText: `SUMMARY
Backend Developer with 2 years of experience building enterprise Java applications using Spring Boot. Solid foundation in REST API development, relational databases, and object-oriented design principles. Eager to grow into more complex system design and scalable architectures.

EXPERIENCE

Junior Backend Developer | SAP, Walldorf, Germany | Mar 2024 – Present
- Developed RESTful APIs using Java 17 and Spring Boot for a cloud-based ERP module serving 500+ enterprise clients
- Implemented CRUD operations and business logic following clean architecture principles
- Wrote JPA/Hibernate entity mappings and optimized database queries on PostgreSQL
- Created integration tests using Spring Boot Test and Mockito with 80% code coverage
- Participated in agile ceremonies including sprint planning, daily standups, and retrospectives
- Used Git and Gerrit for code reviews and version control
- Fixed 100+ bugs across multiple microservices in the SAP Business Technology Platform
- Deployed services to Cloud Foundry and monitored application health using Kibana

Backend Development Working Student | Siemens Healthineers, Erlangen, Germany | Apr 2023 – Feb 2024
- Built backend services for medical imaging software using Java and Spring Framework
- Developed REST endpoints for patient data management with proper input validation
- Wrote unit tests using JUnit 5 and Mockito
- Assisted in database schema design and migration scripts using Flyway
- Documented API endpoints using Swagger/OpenAPI specifications

EDUCATION

Bachelor of Science in Informatik (Computer Science) | Karlsruhe Institute of Technology (KIT), Germany | 2023
- Grade: 1.8 (German scale)
- Relevant coursework: Software Engineering, Databases, Distributed Systems, Algorithms
- Bachelor thesis: RESTful API design patterns for healthcare data interoperability

SKILLS
- Languages: Java 17, SQL, Python (basic)
- Frameworks: Spring Boot, Spring Framework, Spring Data JPA, Hibernate
- Databases: PostgreSQL, MySQL, H2 (testing)
- Testing: JUnit 5, Mockito, Spring Boot Test
- Tools: Git, Gerrit, Maven, Gradle, IntelliJ IDEA, Swagger/OpenAPI
- Deployment: Cloud Foundry, Docker (basic)
- Other: REST API Design, Clean Architecture, Agile/Scrum

CERTIFICATIONS
- Oracle Certified Associate Java SE 17 Developer (2023)`,
    questionnaire: {
      currentRole: 'Junior Backend Developer',
      targetRole: 'Mid-Level Backend Developer',
      yearsExperience: 2,
      country: 'Germany',
      workPreference: 'hybrid',
    },
    expectedTraits: {
      minFitScore: 6,
      maxFitScore: 8,
      expectedGapSeverities: ['moderate', 'minor'],
      mustHaveStrengthKeywords: ['java', 'spring'],
      mustHaveGapKeywords: ['microservices', 'database optimization'],
      expectedCurrency: 'EUR',
      shouldIncludeTargetRole: true,
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // A13: Mid Security Engineer → Senior Security Engineer
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'A13',
    category: 'normal',
    description: 'Mid Security Engineer → Senior Security Engineer',
    cvText: `SUMMARY
Security Engineer with 5 years of experience in vulnerability assessment, penetration testing, and security operations. Skilled in identifying and mitigating threats across web applications, networks, and cloud infrastructure. Strong background in SIEM implementation and incident response.

EXPERIENCE

Mid-Level Security Engineer | NatWest Group, London, UK | Jan 2022 – Present
- Conducted 50+ web application penetration tests using Burp Suite, OWASP ZAP, and custom Python scripts identifying critical vulnerabilities including SQLi, XSS, and IDOR
- Managed and tuned Splunk SIEM platform processing 500GB+ of security logs daily from 2,000+ endpoints
- Developed custom Splunk correlation rules and dashboards reducing false positives by 35%
- Performed network vulnerability scanning using Nessus and Qualys across 5,000+ assets
- Led incident response for 20+ security events including phishing campaigns and malware infections
- Authored security policies and standard operating procedures for the SOC team
- Conducted security code reviews for Java and Python applications identifying OWASP Top 10 vulnerabilities
- Delivered security awareness training to 500+ employees quarterly

Security Analyst | BAE Systems Applied Intelligence, Guildford, UK | Mar 2020 – Dec 2021
- Monitored SIEM alerts and triaged security incidents for government and enterprise clients
- Performed vulnerability assessments using Nessus and OpenVAS on client networks
- Wrote threat intelligence reports and indicators of compromise (IOC) documentation
- Assisted in forensic analysis of compromised systems using EnCase and Volatility
- Automated repetitive SOC tasks using Python scripts and Splunk SOAR playbooks

Junior Penetration Tester | Pen Test Partners, Buckingham, UK | Jun 2019 – Feb 2020
- Assisted senior testers in external and internal network penetration tests
- Performed web application security assessments using Burp Suite
- Documented findings in detailed technical reports for clients

EDUCATION

Master of Science in Cyber Security | Royal Holloway, University of London, UK | 2019
Bachelor of Science in Computer Science | University of Southampton, UK | 2018

SKILLS
- Pen Testing: Burp Suite, OWASP ZAP, Nessus, Qualys, Metasploit, Nmap
- SIEM: Splunk, Splunk SOAR, ELK Stack
- Languages: Python, Bash, SQL, PowerShell
- Networking: TCP/IP, Wireshark, Firewalls, IDS/IPS
- Forensics: EnCase, Volatility, FTK (basic)
- Standards: OWASP Top 10, NIST, ISO 27001, MITRE ATT&CK
- OS: Linux (Kali, Ubuntu), Windows

CERTIFICATIONS
- OSCP – Offensive Security Certified Professional (2021)
- CEH – Certified Ethical Hacker (2020)
- CompTIA Security+ (2019)`,
    questionnaire: {
      currentRole: 'Mid-Level Security Engineer',
      targetRole: 'Senior Security Engineer',
      yearsExperience: 5,
      country: 'United Kingdom',
      workPreference: 'onsite',
    },
    expectedTraits: {
      minFitScore: 6,
      maxFitScore: 8,
      expectedGapSeverities: ['moderate', 'minor'],
      mustHaveStrengthKeywords: ['penetration testing', 'siem'],
      mustHaveGapKeywords: ['cloud security', 'compliance frameworks'],
      expectedCurrency: 'GBP',
      shouldIncludeTargetRole: true,
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // A14: Junior Data Engineer → Mid Data Engineer
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'A14',
    category: 'normal',
    description: 'Junior Data Engineer → Mid Data Engineer',
    cvText: `SUMMARY
Data Engineer with 2 years of experience building data pipelines and ETL workflows. Proficient in Python, SQL, and Apache Spark with growing expertise in cloud-based data platforms. Focused on delivering reliable, scalable data infrastructure for analytics and machine learning teams.

EXPERIENCE

Junior Data Engineer | Spotify, New York, NY | Feb 2024 – Present
- Built and maintained ETL pipelines using Python and Apache Spark processing 10TB+ of streaming event data daily
- Developed SQL transformations in BigQuery for analytics dashboards consumed by 50+ business analysts
- Created data quality checks using Great Expectations framework, catching 200+ data anomalies in the first quarter
- Implemented incremental data loading patterns reducing pipeline run times by 50%
- Managed Airflow DAGs for scheduling and monitoring 30+ daily data pipeline jobs
- Collaborated with data scientists to prepare feature datasets for recommendation model training
- Wrote unit tests for PySpark transformations using pytest and chispa

Data Engineering Intern | Datadog, New York, NY | Jun 2023 – Jan 2024
- Assisted in building data ingestion pipelines from third-party APIs using Python and AWS Lambda
- Wrote SQL queries on Snowflake for ad-hoc reporting and data exploration
- Created data documentation and schema definitions for the data catalog
- Built monitoring dashboards for pipeline health using Datadog's own platform
- Processed and cleaned CSV and JSON datasets using Pandas and PySpark

EDUCATION

Master of Science in Data Science | Columbia University, New York, NY | 2023
- Relevant coursework: Big Data Analytics, Distributed Systems, Machine Learning, Databases
Bachelor of Science in Computer Science | University of Michigan, Ann Arbor, MI | 2021

SKILLS
- Languages: Python, SQL, Scala (basic)
- Big Data: Apache Spark, PySpark
- Cloud: AWS (Lambda, S3, EMR, Glue), Google Cloud (BigQuery)
- Databases: PostgreSQL, Snowflake, BigQuery, Redis
- Orchestration: Apache Airflow (basic)
- Tools: Git, Docker, Great Expectations, Jupyter, pytest
- Other: ETL/ELT, Data Quality, Data Modeling (basic)

CERTIFICATIONS
- Google Professional Data Engineer (2024)
- Databricks Certified Associate Developer for Apache Spark (2023)`,
    questionnaire: {
      currentRole: 'Junior Data Engineer',
      targetRole: 'Mid-Level Data Engineer',
      yearsExperience: 2,
      country: 'United States',
      workPreference: 'remote',
    },
    expectedTraits: {
      minFitScore: 6,
      maxFitScore: 8,
      expectedGapSeverities: ['moderate', 'minor'],
      mustHaveStrengthKeywords: ['python', 'sql', 'spark'],
      mustHaveGapKeywords: ['data modeling', 'orchestration'],
      expectedCurrency: 'EUR',
      shouldIncludeTargetRole: true,
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // A15: Mid iOS Developer → Senior iOS Developer
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'A15',
    category: 'normal',
    description: 'Mid iOS Developer → Senior iOS Developer',
    cvText: `SUMMARY
iOS Developer with 5 years of experience building native applications using Swift and UIKit. Experienced in developing consumer-facing apps with complex UI, networking layers, and Core Data persistence. Committed to writing testable, maintainable code following MVVM and Clean Architecture principles.

EXPERIENCE

Mid-Level iOS Developer | Canva, Sydney, Australia | Mar 2022 – Present
- Developed and maintained the Canva iOS application (4.8 rating, 100M+ downloads) using Swift and UIKit
- Built complex custom UI components including drag-and-drop canvas, real-time collaboration indicators, and animation-rich onboarding flows
- Implemented MVVM architecture with Combine for reactive data binding across 20+ feature modules
- Integrated RESTful and GraphQL APIs using URLSession and Apollo iOS for data synchronization
- Managed local data persistence using Core Data and UserDefaults for offline-first functionality
- Wrote unit tests using XCTest and snapshot tests using iOSSnapshotTestCase with 70% coverage
- Reduced app launch time by 25% through optimizing initialization routines and lazy loading
- Mentored 2 junior developers through code reviews and pair programming

iOS Developer | Atlassian, Sydney, Australia | Jan 2020 – Feb 2022
- Developed features for the Trello iOS app using Swift and UIKit
- Implemented push notification handling and deep linking using URLSchemes and Universal Links
- Built custom collection view layouts for Kanban board interactions with smooth 60fps scrolling
- Integrated analytics SDK and A/B testing framework for feature flagging
- Performed memory leak debugging using Instruments and resolved 30+ retain cycle issues

Junior iOS Developer | Airtasker, Sydney, Australia | Jun 2019 – Dec 2019
- Built UI screens using UIKit with Auto Layout constraints
- Implemented basic networking layer using Alamofire
- Fixed bugs and improved existing features in the marketplace app

EDUCATION

Bachelor of Information Technology | University of Technology Sydney, Australia | 2019
- Major: Software Development
- Relevant coursework: iOS Development, Data Structures, Algorithms, Software Design

SKILLS
- Languages: Swift, Objective-C (reading), Python (basic)
- Frameworks: UIKit, Combine, Core Data, Foundation, XCTest
- Architecture: MVVM, Clean Architecture, Coordinator Pattern
- Networking: URLSession, Apollo iOS (GraphQL), Alamofire
- Tools: Xcode, Instruments, Git, CocoaPods, SPM, Fastlane, Charles Proxy
- CI/CD: Fastlane, Bitrise, GitHub Actions
- Other: Auto Layout, Accessibility (VoiceOver basics), App Store Connect

CERTIFICATIONS
- Stanford CS193p – Developing Apps for iOS (2020)`,
    questionnaire: {
      currentRole: 'Mid-Level iOS Developer',
      targetRole: 'Senior iOS Developer',
      yearsExperience: 5,
      country: 'Australia',
      workPreference: 'hybrid',
    },
    expectedTraits: {
      minFitScore: 6,
      maxFitScore: 8,
      expectedGapSeverities: ['moderate', 'minor'],
      mustHaveStrengthKeywords: ['swift', 'uikit'],
      mustHaveGapKeywords: ['swiftui', 'architecture patterns'],
      expectedCurrency: 'AUD',
      shouldIncludeTargetRole: true,
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // A16: Junior DevOps → Mid DevOps
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'A16',
    category: 'normal',
    description: 'Junior DevOps → Mid DevOps',
    cvText: `SUMMARY
DevOps Engineer with 2 years of experience in Linux systems administration, containerization, and CI/CD pipeline management. Skilled in Docker, Jenkins, and Bash scripting with a growing knowledge of cloud platforms and infrastructure automation.

EXPERIENCE

Junior DevOps Engineer | Bitdefender, Bucharest, Romania | Mar 2024 – Present
- Managed and maintained 50+ Linux servers (Ubuntu, CentOS) for development and staging environments
- Built and maintained CI/CD pipelines using Jenkins for 20+ Java and Python microservices
- Containerized applications using Docker and Docker Compose, reducing environment inconsistencies by 80%
- Wrote Bash and Python scripts for automated log rotation, backup procedures, and health checks
- Configured Nginx reverse proxy and SSL/TLS certificates for internal services
- Monitored server metrics using Prometheus and Grafana dashboards
- Participated in on-call rotation handling infrastructure incidents and performing root cause analysis
- Documented runbooks and standard operating procedures for common operational tasks

IT Operations Intern | UiPath, Bucharest, Romania | Aug 2023 – Feb 2024
- Assisted in managing development environments on Linux servers
- Learned Docker fundamentals and containerized 5 internal tools
- Set up basic Jenkins pipelines for build automation
- Monitored server health using Nagios and escalated critical alerts
- Wrote Bash scripts for automating routine system administration tasks

EDUCATION

Bachelor of Science in Computer Science | Politehnica University of Bucharest, Romania | 2023
- Relevant coursework: Operating Systems, Computer Networks, Distributed Systems, Databases
- Final year project: Automated deployment pipeline using Jenkins, Docker, and Ansible

SKILLS
- Operating Systems: Linux (Ubuntu, CentOS, RHEL)
- Containers: Docker, Docker Compose
- CI/CD: Jenkins, GitLab CI (basic)
- Scripting: Bash, Python
- Monitoring: Prometheus, Grafana, Nagios
- Web Servers: Nginx, Apache
- Tools: Git, systemd, cron, rsync
- Networking: TCP/IP, DNS, SSH, SSL/TLS

CERTIFICATIONS
- Linux Foundation Certified System Administrator (LFCS) (2023)
- Docker Certified Associate (2024)`,
    questionnaire: {
      currentRole: 'Junior DevOps Engineer',
      targetRole: 'Mid-Level DevOps Engineer',
      yearsExperience: 2,
      country: 'Romania',
      workPreference: 'onsite',
    },
    expectedTraits: {
      minFitScore: 6,
      maxFitScore: 8,
      expectedGapSeverities: ['moderate', 'minor'],
      mustHaveStrengthKeywords: ['linux', 'docker', 'ci/cd'],
      mustHaveGapKeywords: ['cloud platforms', 'iac'],
      expectedCurrency: 'RON',
      shouldIncludeTargetRole: true,
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // A17: Mid Product Designer → Senior Product Designer
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'A17',
    category: 'normal',
    description: 'Mid Product Designer → Senior Product Designer',
    cvText: `SUMMARY
Product Designer with 5 years of experience designing digital products from concept to launch. Expert in Figma for prototyping and design system creation with strong skills in user research, interaction design, and cross-functional collaboration. Focused on delivering data-informed design solutions that balance user needs with business goals.

EXPERIENCE

Mid-Level Product Designer | Klarna, Stockholm, Sweden | Jan 2022 – Present
- Designed end-to-end user experiences for the Klarna shopping app used by 150M+ consumers worldwide
- Led the redesign of the payment flow reducing checkout abandonment by 18% based on A/B testing data
- Created interactive prototypes in Figma for usability testing sessions with 50+ participants
- Contributed 100+ components to the shared design system ensuring consistency across product teams
- Collaborated with product managers, engineers, and data analysts to define feature requirements
- Conducted qualitative user research through moderated interviews and unmoderated surveys
- Presented design decisions and research findings to VP-level stakeholders bi-weekly
- Facilitated design workshops and ideation sessions with cross-functional teams

Product Designer | Epidemic Sound, Stockholm, Sweden | Jun 2020 – Dec 2021
- Designed the creator dashboard for a music licensing platform serving 500K+ content creators
- Built and maintained design system components in Figma for web and mobile platforms
- Conducted usability testing sessions identifying 25+ UX improvements prioritized with engineering
- Created user flow diagrams, wireframes, and high-fidelity mockups for feature development
- Worked closely with frontend developers to ensure design accuracy during implementation

Junior UI/UX Designer | Mojang Studios, Stockholm, Sweden | Mar 2019 – May 2020
- Assisted in designing UI for web properties and internal tools
- Created icon sets, illustrations, and marketing assets using Adobe Illustrator
- Supported senior designers in conducting user surveys and analyzing results

EDUCATION

Bachelor of Arts in Interaction Design | Umea University, Sweden | 2019
- Exchange semester at Royal College of Art, London (2018)
- Thesis: Designing inclusive payment experiences for diverse user demographics

SKILLS
- Design: Figma (expert), Sketch, Adobe Creative Suite (Illustrator, Photoshop)
- Prototyping: Figma Prototyping, Principle, ProtoPie (basic)
- Research: User Interviews, Usability Testing, Surveys, A/B Testing, Heuristic Evaluation
- Collaboration: Jira, Confluence, Miro, FigJam, Notion
- Other: Design Systems, Interaction Design, Responsive Design, Accessibility (WCAG)

CERTIFICATIONS
- Nielsen Norman Group UX Certification (2021)`,
    questionnaire: {
      currentRole: 'Mid-Level Product Designer',
      targetRole: 'Senior Product Designer',
      yearsExperience: 5,
      country: 'Sweden',
      workPreference: 'remote',
    },
    expectedTraits: {
      minFitScore: 6,
      maxFitScore: 8,
      expectedGapSeverities: ['moderate', 'minor'],
      mustHaveStrengthKeywords: ['figma', 'prototyping'],
      mustHaveGapKeywords: ['design systems', 'stakeholder management'],
      expectedCurrency: 'EUR',
      shouldIncludeTargetRole: true,
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // A18: Senior Backend Dev → Principal Engineer
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'A18',
    category: 'normal',
    description: 'Senior Backend Dev → Principal Engineer',
    cvText: `SUMMARY
Senior Backend Engineer with 10 years of experience designing and building high-throughput distributed systems. Deep expertise in Go, Rust, and distributed computing with proven ability to architect systems handling millions of requests per second. Track record of driving technical excellence through code quality, performance optimization, and team mentorship.

EXPERIENCE

Senior Backend Engineer | Google Zurich, Zurich, Switzerland | Apr 2020 – Present
- Designed and implemented low-latency microservices in Go processing 2M+ requests per second for Google Cloud Platform infrastructure
- Built data processing pipelines using Go and Protocol Buffers handling 50TB+ daily throughput
- Led performance optimization efforts reducing P99 latency by 60% through profiling and algorithmic improvements
- Contributed to internal distributed consensus library used by 10+ production systems
- Mentored 5 engineers through structured 1:1s, design reviews, and tech talks
- Wrote design documents for system architecture changes reviewed by 20+ engineers
- Participated in production incident response and authored post-mortem analyses for critical outages
- Introduced property-based testing and fuzzing practices adopted across the team

Senior Software Engineer | ABB, Baden, Switzerland | Jun 2017 – Mar 2020
- Developed real-time industrial control system backends using Go and C++ for power grid management
- Built event-driven architecture using Apache Kafka handling 100K+ events per second
- Implemented custom serialization protocol in Rust reducing data transfer overhead by 40%
- Designed database sharding strategy for TimescaleDB supporting 1B+ time-series records
- Led code review process and established coding standards for a team of 8 engineers

Software Engineer | Credit Suisse, Zurich, Switzerland | Sep 2014 – May 2017
- Developed high-frequency trading backend systems in Java and Go
- Built REST APIs and gRPC services for portfolio management and risk calculation
- Optimized database queries on Oracle and PostgreSQL for financial reporting
- Implemented circuit breaker patterns and retry logic for resilient service communication

EDUCATION

Master of Science in Computer Science | ETH Zurich, Switzerland | 2014
- Specialization: Distributed Systems
- Thesis: Consensus algorithms for geo-distributed databases
Bachelor of Science in Computer Science | EPFL, Lausanne, Switzerland | 2012

SKILLS
- Languages: Go, Rust, Java, C++, Python, SQL
- Distributed Systems: gRPC, Protocol Buffers, Apache Kafka, etcd, Raft consensus
- Databases: PostgreSQL, TimescaleDB, Redis, BigTable, Spanner
- Tools: Git, Bazel, Docker, Kubernetes (user-level), Prometheus, Grafana
- Practices: Design Documents, Performance Profiling, Property-based Testing, Code Reviews, Post-mortems
- Cloud: Google Cloud Platform, AWS (basic)

CERTIFICATIONS
- Google Cloud Professional Cloud Architect (2021)`,
    questionnaire: {
      currentRole: 'Senior Backend Engineer',
      targetRole: 'Principal Engineer',
      yearsExperience: 10,
      country: 'Switzerland',
      workPreference: 'onsite',
    },
    expectedTraits: {
      minFitScore: 5,
      maxFitScore: 7,
      expectedGapSeverities: ['moderate', 'minor'],
      mustHaveStrengthKeywords: ['go', 'rust', 'distributed systems'],
      mustHaveGapKeywords: ['org-wide influence', 'rfc process'],
      expectedCurrency: 'CHF',
      shouldIncludeTargetRole: true,
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // A19: Mid Android Dev → Senior Android Dev
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'A19',
    category: 'normal',
    description: 'Mid Android Dev → Senior Android Dev',
    cvText: `SUMMARY
Android Developer with 4 years of experience building native applications using Kotlin and Java. Skilled in building user-friendly, performant apps with MVVM architecture, Retrofit networking, and Room database. Focused on delivering high-quality code through testing and code reviews.

EXPERIENCE

Mid-Level Android Developer | Rakuten, Tokyo, Japan | Apr 2022 – Present
- Developed features for the Rakuten Ichiba shopping app (50M+ downloads) using Kotlin and Android SDK
- Implemented MVVM architecture with ViewModel, LiveData, and Kotlin Coroutines for reactive UI updates
- Built complex RecyclerView implementations with DiffUtil for efficient list rendering of 10K+ product items
- Integrated RESTful APIs using Retrofit and OkHttp with custom interceptors for authentication and logging
- Managed local data persistence using Room database and DataStore for offline functionality
- Wrote unit tests using JUnit, Mockito, and Espresso UI tests achieving 65% code coverage
- Performed code reviews for 3 team members and contributed to coding standards documentation
- Reduced ANR (Application Not Responding) rate by 40% through coroutine-based background processing

Android Developer | CyberAgent, Tokyo, Japan | Jun 2020 – Mar 2022
- Developed features for AbemaTV streaming app using Java and Kotlin
- Built custom views and animations for media player controls
- Implemented push notifications using Firebase Cloud Messaging
- Integrated analytics using Firebase Analytics and custom event tracking
- Managed dependency injection using Dagger 2 and migrated to Hilt for newer modules

Junior Android Developer | DeNA, Tokyo, Japan | Apr 2020 – May 2020
- Assisted in bug fixes and feature development for gaming and entertainment apps
- Learned Android development best practices through code reviews and pair programming

EDUCATION

Bachelor of Engineering in Computer Science | Waseda University, Tokyo, Japan | 2020
- Relevant coursework: Mobile Application Development, Software Engineering, Algorithms, Database Systems
- Graduation project: Built a real-time transit information app using Kotlin and Google Maps API

SKILLS
- Languages: Kotlin, Java, XML
- Architecture: MVVM, Clean Architecture, Repository Pattern
- Jetpack: ViewModel, LiveData, Room, DataStore, Navigation Component
- Networking: Retrofit, OkHttp, Gson, Moshi
- DI: Hilt, Dagger 2
- Testing: JUnit, Mockito, Espresso, Robolectric (basic)
- Tools: Android Studio, Gradle, Git, Firebase, Charles Proxy
- CI/CD: GitHub Actions, Bitrise

CERTIFICATIONS
- Associate Android Developer Certification (Google, 2021)`,
    questionnaire: {
      currentRole: 'Mid-Level Android Developer',
      targetRole: 'Senior Android Developer',
      yearsExperience: 4,
      country: 'Japan',
      workPreference: 'onsite',
    },
    expectedTraits: {
      minFitScore: 6,
      maxFitScore: 8,
      expectedGapSeverities: ['moderate', 'minor'],
      mustHaveStrengthKeywords: ['kotlin', 'java'],
      mustHaveGapKeywords: ['jetpack compose', 'modularization'],
      expectedCurrency: 'JPY',
      shouldIncludeTargetRole: true,
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // A20: Junior QA → Mid QA Engineer
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'A20',
    category: 'normal',
    description: 'Junior QA → Mid QA Engineer',
    cvText: `SUMMARY
QA professional with 2 years of experience in manual testing of web and mobile applications. Skilled in test case design, bug reporting, and regression testing using Jira. Eager to transition into test automation and expand technical testing capabilities.

EXPERIENCE

Junior QA Engineer | Farfetch, Porto, Portugal | Apr 2024 – Present
- Executed 300+ manual test cases per sprint for the Farfetch e-commerce platform covering web and mobile
- Wrote detailed test plans and test cases based on user stories and acceptance criteria in Jira
- Performed functional, regression, and smoke testing across Chrome, Firefox, Safari, and Edge browsers
- Identified and documented 150+ bugs with clear reproduction steps, screenshots, and severity classification in Jira
- Conducted cross-device testing on iOS and Android using BrowserStack for responsive design validation
- Participated in sprint planning, providing test effort estimates and identifying high-risk areas
- Collaborated with developers during bug triage meetings to prioritize and resolve issues
- Performed basic exploratory testing sessions discovering 20+ edge-case defects

QA Intern | Outsystems, Lisbon, Portugal | Sep 2023 – Mar 2024
- Assisted in manual testing of the OutSystems low-code development platform
- Learned test case creation methodology using TestRail
- Documented test results and created bug reports in Jira
- Supported regression testing before major releases
- Observed automated tests running in Selenium and documented test scenarios

EDUCATION

Bachelor of Science in Information Systems | University of Porto, Portugal | 2023
- Relevant coursework: Software Engineering, Software Testing, Database Systems, Web Development
- Final project: Test strategy and execution plan for a university library management system

SKILLS
- Testing: Manual Testing, Functional Testing, Regression Testing, Smoke Testing, Exploratory Testing
- Tools: Jira, TestRail, BrowserStack, Confluence
- Bug Tracking: Jira (proficient), Bugzilla (basic)
- Browsers: Chrome DevTools, Firefox Developer Tools
- Other: Test Case Design, Test Plans, Cross-browser Testing, Agile/Scrum
- Basic Technical: HTML/CSS (reading), SQL (basic queries), Postman (basic)

CERTIFICATIONS
- ISTQB Certified Tester – Foundation Level (2023)`,
    questionnaire: {
      currentRole: 'Junior QA Engineer',
      targetRole: 'Mid-Level QA Engineer',
      yearsExperience: 2,
      country: 'Portugal',
      workPreference: 'hybrid',
    },
    expectedTraits: {
      minFitScore: 6,
      maxFitScore: 8,
      expectedGapSeverities: ['moderate', 'minor'],
      mustHaveStrengthKeywords: ['manual testing', 'jira'],
      mustHaveGapKeywords: ['test automation', 'api testing'],
      expectedCurrency: 'EUR',
      shouldIncludeTargetRole: true,
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // A21: Mid Database Admin → Senior DBA
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'A21',
    category: 'normal',
    description: 'Mid Database Admin → Senior DBA',
    cvText: `SUMMARY
Database Administrator with 5 years of experience managing PostgreSQL and MySQL databases in production environments. Skilled in database design, backup and recovery, query optimization, and monitoring. Committed to ensuring high availability and data integrity for business-critical applications.

EXPERIENCE

Mid-Level Database Administrator | Stripe, Dublin, Ireland | Feb 2022 – Present
- Administered 50+ PostgreSQL database clusters processing 500M+ transactions daily for payment infrastructure
- Designed and implemented database schemas for new microservices following normalization best practices
- Optimized slow queries through EXPLAIN ANALYZE, index tuning, and query rewriting reducing average response time by 45%
- Managed automated backup procedures using pg_dump, pg_basebackup, and WAL archiving with 99.99% recovery success rate
- Configured and monitored PostgreSQL streaming replication for high-availability setups across 3 data centers
- Built monitoring dashboards using pgwatch2 and Grafana tracking connections, locks, replication lag, and query performance
- Performed PostgreSQL version upgrades (13 to 15) with zero downtime using logical replication
- Wrote PL/pgSQL functions and stored procedures for complex business logic

Database Administrator | Workday, Dublin, Ireland | Jun 2020 – Jan 2022
- Managed MySQL and PostgreSQL databases for HR and finance SaaS applications
- Performed daily health checks, backup verification, and capacity planning
- Created and maintained database monitoring alerts using Nagios and Datadog
- Assisted in database migration projects from MySQL 5.7 to MySQL 8.0
- Wrote SQL scripts for data migration, cleanup, and reporting
- Documented database architecture and standard operating procedures

Junior DBA | Accenture, Dublin, Ireland | Sep 2019 – May 2020
- Assisted senior DBAs with routine database maintenance tasks
- Performed backup operations and verified restoration procedures
- Wrote SQL queries for ad-hoc reporting requests
- Monitored database health and escalated issues to senior team members

EDUCATION

Higher Diploma in Data Science | National College of Ireland, Dublin | 2019
Bachelor of Science in Computer Science | University College Dublin, Ireland | 2018

SKILLS
- Databases: PostgreSQL (primary), MySQL, Redis (basic)
- Administration: Backup & Recovery, Replication, Schema Design, Index Optimization
- Monitoring: pgwatch2, Grafana, Nagios, Datadog
- Languages: SQL, PL/pgSQL, Bash, Python (basic)
- Tools: pg_dump, pg_basebackup, pgBouncer, pg_stat_statements, EXPLAIN ANALYZE
- OS: Linux (Ubuntu, CentOS)
- Cloud: AWS RDS, Aurora (basic)

CERTIFICATIONS
- PostgreSQL Certified Professional (EnterpriseDB, 2022)
- Oracle Certified Associate – MySQL (2020)`,
    questionnaire: {
      currentRole: 'Mid-Level Database Administrator',
      targetRole: 'Senior Database Administrator',
      yearsExperience: 5,
      country: 'Ireland',
      workPreference: 'hybrid',
    },
    expectedTraits: {
      minFitScore: 6,
      maxFitScore: 8,
      expectedGapSeverities: ['moderate', 'minor'],
      mustHaveStrengthKeywords: ['postgresql', 'mysql'],
      mustHaveGapKeywords: ['performance tuning', 'replication'],
      expectedCurrency: 'EUR',
      shouldIncludeTargetRole: true,
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // A22: Senior Frontend Dev → Frontend Architect
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'A22',
    category: 'normal',
    description: 'Senior Frontend Dev → Frontend Architect',
    cvText: `SUMMARY
Senior Frontend Developer with 8 years of experience building large-scale web applications using React and Angular. Deep expertise in component architecture, state management, and performance optimization. Experienced in working with micro-frontends and leading frontend teams in delivering complex product features.

EXPERIENCE

Senior Frontend Developer | Maersk, Copenhagen, Denmark | Mar 2021 – Present
- Led frontend development for a logistics platform serving 100K+ enterprise users across 130 countries
- Architected module federation setup enabling 5 independent frontend teams to deploy micro-frontends autonomously
- Built shared component library with 80+ React components consumed by 8 product teams
- Implemented server-side rendering using Next.js reducing time-to-first-byte by 50%
- Designed and enforced frontend coding standards, PR review guidelines, and testing practices
- Introduced Storybook-driven development workflow adopted across all frontend teams
- Optimized React application performance through memoization, virtualization, and bundle analysis
- Mentored 4 junior and mid-level developers through code reviews, 1:1s, and tech talks

Frontend Developer | Zendesk, Copenhagen, Denmark | Jun 2018 – Feb 2021
- Developed features for the Zendesk Support product using React, Redux, and TypeScript
- Built complex form builders and drag-and-drop interfaces with smooth interactions
- Migrated legacy Backbone.js modules to React reducing technical debt by 30%
- Implemented comprehensive E2E testing using Cypress for critical user workflows
- Contributed to the Garden design system used across all Zendesk products

Frontend Developer | Trustpilot, Copenhagen, Denmark | Jan 2016 – May 2018
- Built review management interfaces using Angular and AngularJS
- Implemented SEO optimization features using server-side rendering
- Developed reusable Angular components and services for shared functionality

EDUCATION

Master of Science in Software Engineering | IT University of Copenhagen, Denmark | 2016
Bachelor of Science in Computer Science | Aarhus University, Denmark | 2014

SKILLS
- Languages: TypeScript, JavaScript, HTML5, CSS3
- Frameworks: React, Angular, Next.js, AngularJS (legacy)
- State: Redux, Zustand, NgRx, React Query
- Micro-frontends: Module Federation, Webpack 5, Single-SPA (basic)
- Testing: Cypress, Jest, React Testing Library, Storybook
- Build Tools: Webpack, Vite, Turborepo (basic)
- Design Systems: Storybook, component library architecture
- Tools: Git, GitHub, Figma, Jira, npm/yarn

CERTIFICATIONS
- AWS Certified Cloud Practitioner (2022)`,
    questionnaire: {
      currentRole: 'Senior Frontend Developer',
      targetRole: 'Frontend Architect',
      yearsExperience: 8,
      country: 'Denmark',
      workPreference: 'remote',
    },
    expectedTraits: {
      minFitScore: 5,
      maxFitScore: 7,
      expectedGapSeverities: ['moderate', 'minor'],
      mustHaveStrengthKeywords: ['react', 'angular', 'micro-frontends'],
      mustHaveGapKeywords: ['architecture patterns', 'build tooling'],
      expectedCurrency: 'EUR',
      shouldIncludeTargetRole: true,
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // A23: Junior Cloud Engineer → Mid Cloud Engineer
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'A23',
    category: 'normal',
    description: 'Junior Cloud Engineer → Mid Cloud Engineer',
    cvText: `SUMMARY
Cloud Engineer with 2 years of experience working with AWS services and Linux infrastructure. Skilled in basic cloud deployments, EC2 management, and scripting with a growing knowledge of networking and security best practices. Eager to expand into advanced cloud architecture and automation.

EXPERIENCE

Junior Cloud Engineer | Tata Consultancy Services (TCS), Pune, India | Mar 2024 – Present
- Managed AWS infrastructure for 3 client projects including EC2 instances, S3 buckets, and RDS databases
- Provisioned and configured Linux servers (Amazon Linux, Ubuntu) for web application hosting
- Set up VPC configurations with public and private subnets, security groups, and NACLs
- Created IAM users, roles, and policies following least-privilege access principles
- Automated routine tasks using AWS CLI and Bash scripts reducing manual work by 40%
- Configured CloudWatch alarms and dashboards for monitoring CPU, memory, and disk usage
- Assisted in migrating 10+ on-premises applications to AWS EC2 and RDS
- Documented cloud architecture diagrams and runbooks for client handover

Cloud Support Intern | Infosys, Bangalore, India | Jul 2023 – Feb 2024
- Assisted in managing AWS environments for internal development teams
- Learned AWS fundamentals including EC2, S3, VPC, IAM, and CloudWatch
- Created S3 bucket lifecycle policies and managed object storage
- Performed basic Linux server administration tasks (user management, package installation, log analysis)
- Helped with DNS configuration using Route 53 for internal applications

EDUCATION

Bachelor of Technology in Computer Science | Pune Institute of Computer Technology, India | 2023
- CGPA: 8.2/10
- Relevant coursework: Cloud Computing, Computer Networks, Operating Systems, Database Management
- Final year project: Automated cloud infrastructure deployment using AWS CloudFormation

SKILLS
- Cloud: AWS (EC2, S3, RDS, VPC, IAM, CloudWatch, Route 53, CloudFormation basics)
- Operating Systems: Linux (Ubuntu, Amazon Linux, CentOS)
- Scripting: Bash, Python (basic), AWS CLI
- Networking: TCP/IP, DNS, Subnets, Security Groups, NACLs (basic)
- Monitoring: CloudWatch, basic Grafana
- Tools: Git, PuTTY, SSH, WinSCP

CERTIFICATIONS
- AWS Certified Cloud Practitioner (2023)
- AWS Certified Solutions Architect – Associate (2024)`,
    questionnaire: {
      currentRole: 'Junior Cloud Engineer',
      targetRole: 'Mid-Level Cloud Engineer',
      yearsExperience: 2,
      country: 'India',
      workPreference: 'remote',
    },
    expectedTraits: {
      minFitScore: 6,
      maxFitScore: 8,
      expectedGapSeverities: ['moderate', 'minor'],
      mustHaveStrengthKeywords: ['aws', 'linux'],
      mustHaveGapKeywords: ['networking', 'security'],
      expectedCurrency: 'EUR',
      shouldIncludeTargetRole: true,
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // A24: Mid Technical Writer → Senior Technical Writer
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'A24',
    category: 'normal',
    description: 'Mid Technical Writer → Senior Technical Writer',
    cvText: `SUMMARY
Technical Writer with 4 years of experience creating clear, comprehensive documentation for software products and APIs. Skilled in writing developer guides, API references, and user documentation using docs-as-code workflows. Strong ability to translate complex technical concepts into accessible content for diverse audiences.

EXPERIENCE

Mid-Level Technical Writer | Shopify, Ottawa, Canada | Feb 2022 – Present
- Authored and maintained documentation for 15+ REST and GraphQL APIs used by 2M+ developers globally
- Created comprehensive getting-started guides, tutorials, and API reference documentation using Markdown and MDX
- Collaborated with engineering teams across 5 product areas to document new features and breaking changes
- Reviewed 200+ pull requests for documentation quality, accuracy, and style consistency
- Built and maintained a documentation style guide adopted by 20+ writers across the organization
- Improved documentation search experience by implementing structured metadata and SEO best practices
- Reduced developer support tickets by 25% through improved onboarding documentation and code samples
- Conducted documentation audits identifying and fixing 500+ outdated or inaccurate pages

Technical Writer | Wealthsimple, Toronto, Canada | Jun 2020 – Jan 2022
- Wrote user-facing help center articles for a fintech platform serving 2M+ customers
- Created internal API documentation for backend services using Swagger/OpenAPI specifications
- Developed step-by-step tutorials for integrating third-party payment APIs
- Managed documentation in Confluence and migrated content to a static site generator (Hugo)
- Worked with product managers to create release notes and changelog entries

Technical Writing Intern | Hootsuite, Vancouver, Canada | Jan 2020 – May 2020
- Assisted in updating help center documentation for social media management features
- Wrote knowledge base articles based on customer support ticket analysis
- Proofread and edited technical content for grammar, clarity, and consistency

EDUCATION

Bachelor of Arts in English Literature | University of British Columbia, Vancouver, Canada | 2019
- Minor: Computer Science
- Relevant coursework: Technical Communication, Web Development, Information Design

SKILLS
- Writing: API Documentation, Developer Guides, Tutorials, Help Center Articles, Release Notes
- Tools: Markdown, MDX, Git, GitHub, Swagger/OpenAPI, Confluence, Notion
- Static Sites: Hugo, Docusaurus (basic), Jekyll (basic)
- Technical: REST APIs, GraphQL basics, HTML/CSS, JavaScript (reading), JSON, YAML
- Style: Microsoft Style Guide, Google Developer Documentation Style Guide
- Collaboration: Jira, Figma (reading designs), Slack

CERTIFICATIONS
- Google Technical Writing Certificate (2021)
- Society for Technical Communication (STC) Member`,
    questionnaire: {
      currentRole: 'Mid-Level Technical Writer',
      targetRole: 'Senior Technical Writer',
      yearsExperience: 4,
      country: 'Canada',
      workPreference: 'remote',
    },
    expectedTraits: {
      minFitScore: 7,
      maxFitScore: 9,
      expectedGapSeverities: ['moderate', 'minor'],
      mustHaveStrengthKeywords: ['api documentation', 'markdown'],
      mustHaveGapKeywords: ['docs-as-code', 'developer advocacy'],
      expectedCurrency: 'EUR',
      shouldIncludeTargetRole: true,
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // A25: Senior Data Scientist → Lead Data Scientist
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'A25',
    category: 'normal',
    description: 'Senior Data Scientist → Lead Data Scientist',
    cvText: `SUMMARY
Senior Data Scientist with 7 years of experience developing machine learning models and statistical analyses for business decision-making. Proficient in Python, R, and ML frameworks with a strong track record of translating complex data into actionable business insights. Experienced in end-to-end ML pipeline development from data exploration to production deployment.

EXPERIENCE

Senior Data Scientist | Amazon Web Services, Seattle, WA | Jan 2021 – Present
- Developed predictive models for AWS resource consumption forecasting using Python (scikit-learn, XGBoost) improving accuracy by 20% over previous heuristic methods
- Built customer churn prediction model using gradient boosting and survival analysis, enabling proactive retention campaigns saving $5M+ annually
- Designed and implemented A/B testing framework used by 10+ product teams for feature evaluation
- Created automated reporting dashboards using Python, Plotly, and Streamlit for executive stakeholders
- Published 3 internal technical papers on novel approaches to time-series forecasting
- Trained and evaluated NLP models for customer feedback sentiment analysis using Hugging Face transformers
- Mentored 2 junior data scientists through project guidance and code reviews

Data Scientist | Microsoft, Redmond, WA | Mar 2019 – Dec 2020
- Developed recommendation algorithms for Microsoft Store improving user engagement by 15%
- Built classification models using R and Python for user segmentation and targeting
- Performed statistical hypothesis testing and causal inference analysis for product experiments
- Created ETL pipelines using PySpark for large-scale data processing on Azure Databricks
- Presented analytical findings to product leadership through data storytelling and visualizations

Junior Data Scientist | Zillow, Seattle, WA | Jun 2017 – Feb 2019
- Built regression models for home price estimation using Python and scikit-learn
- Performed exploratory data analysis on real estate datasets with 10M+ records
- Created visualizations using Matplotlib, Seaborn, and Tableau for business reports
- Collaborated with engineering teams to deploy ML models via REST APIs

EDUCATION

Master of Science in Statistics | University of Washington, Seattle, WA | 2017
- Thesis: Bayesian methods for hierarchical time-series forecasting
Bachelor of Science in Mathematics | UC Berkeley, CA | 2015

SKILLS
- Languages: Python, R, SQL
- ML: scikit-learn, XGBoost, LightGBM, Hugging Face Transformers, TensorFlow (basic)
- Statistics: Hypothesis Testing, A/B Testing, Bayesian Methods, Survival Analysis, Causal Inference
- Data Processing: PySpark, Pandas, NumPy, dplyr
- Visualization: Matplotlib, Seaborn, Plotly, Streamlit, Tableau
- Tools: Jupyter, Git, Docker, MLflow (basic), Azure Databricks
- Cloud: AWS (SageMaker, S3, Redshift), Azure (Databricks)

CERTIFICATIONS
- AWS Certified Machine Learning – Specialty (2022)
- Professional Certificate in Data Science (HarvardX, 2018)`,
    questionnaire: {
      currentRole: 'Senior Data Scientist',
      targetRole: 'Lead Data Scientist',
      yearsExperience: 7,
      country: 'United States',
      workPreference: 'hybrid',
    },
    expectedTraits: {
      minFitScore: 6,
      maxFitScore: 8,
      expectedGapSeverities: ['moderate', 'minor'],
      mustHaveStrengthKeywords: ['python', 'r', 'machine learning'],
      mustHaveGapKeywords: ['team leadership', 'business communication'],
      expectedCurrency: 'USD',
      shouldIncludeTargetRole: true,
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // A26: Mid Site Reliability Engineer → Senior SRE
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'A26',
    category: 'normal',
    description: 'Mid Site Reliability Engineer → Senior SRE',
    cvText: `SUMMARY
Site Reliability Engineer with 5 years of experience ensuring the reliability, scalability, and performance of production systems. Proficient in Kubernetes, Prometheus, and Go with strong skills in monitoring, alerting, and incident response. Focused on reducing toil through automation and improving service level objectives.

EXPERIENCE

Mid-Level Site Reliability Engineer | Booking.com, Amsterdam, Netherlands | Feb 2022 – Present
- Managed Kubernetes clusters running 500+ microservices serving 1.5M+ requests per second
- Designed and implemented monitoring and alerting stack using Prometheus, Alertmanager, and Grafana with 2,000+ custom metrics
- Built custom Go-based tools for automated capacity scaling and resource optimization reducing infrastructure costs by 20%
- Defined and tracked SLOs/SLIs for 50+ critical services, maintaining 99.95% availability target
- Led incident response for 30+ production outages, authoring blameless post-mortems and driving remediation actions
- Automated toil reduction projects including certificate rotation, log cleanup, and config deployment using Go and Bash
- Implemented distributed tracing using Jaeger for debugging latency issues across microservice boundaries
- Participated in on-call rotation with 15-minute response SLA

SRE / DevOps Engineer | Adyen, Amsterdam, Netherlands | Jun 2020 – Jan 2022
- Managed Kubernetes deployments on bare-metal infrastructure for payment processing systems
- Built CI/CD pipelines using Jenkins and ArgoCD for automated deployment workflows
- Implemented log aggregation using Fluentd and Elasticsearch for centralized debugging
- Created Terraform modules for infrastructure provisioning on internal cloud platform
- Wrote Python and Bash scripts for operational automation tasks

Junior Systems Engineer | ING Bank, Amsterdam, Netherlands | Sep 2019 – May 2020
- Monitored production systems and responded to alerts using PagerDuty
- Assisted in Kubernetes cluster maintenance and pod troubleshooting
- Documented operational runbooks and incident response procedures

EDUCATION

Master of Science in Computer Science | Vrije Universiteit Amsterdam, Netherlands | 2019
- Specialization: Distributed Systems
Bachelor of Science in Computer Science | University of Amsterdam, Netherlands | 2017

SKILLS
- Orchestration: Kubernetes, Helm, ArgoCD
- Monitoring: Prometheus, Grafana, Alertmanager, Jaeger, Fluentd, ELK Stack
- Languages: Go, Python, Bash
- Infrastructure: Terraform, Ansible (basic), Linux (Ubuntu, Debian)
- CI/CD: Jenkins, ArgoCD, GitLab CI
- Practices: SLO/SLI, Incident Response, Post-mortems, On-call, Runbooks
- Networking: TCP/IP, DNS, Load Balancing, Service Mesh (Istio basics)

CERTIFICATIONS
- Certified Kubernetes Administrator (CKA) (2021)
- Google Cloud Professional Cloud DevOps Engineer (2022)`,
    questionnaire: {
      currentRole: 'Mid-Level Site Reliability Engineer',
      targetRole: 'Senior Site Reliability Engineer',
      yearsExperience: 5,
      country: 'Netherlands',
      workPreference: 'hybrid',
    },
    expectedTraits: {
      minFitScore: 6,
      maxFitScore: 8,
      expectedGapSeverities: ['moderate', 'minor'],
      mustHaveStrengthKeywords: ['kubernetes', 'prometheus', 'go'],
      mustHaveGapKeywords: ['chaos engineering', 'capacity planning'],
      expectedCurrency: 'EUR',
      shouldIncludeTargetRole: true,
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // A27: Junior Embedded Dev → Mid Embedded Dev
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'A27',
    category: 'normal',
    description: 'Junior Embedded Dev → Mid Embedded Dev',
    cvText: `SUMMARY
Embedded Software Developer with 2 years of experience developing firmware for microcontroller-based systems. Proficient in C and C++ programming for resource-constrained environments with experience in RTOS, peripheral drivers, and low-level hardware interfaces. Passionate about building reliable embedded systems.

EXPERIENCE

Junior Embedded Developer | Bosch, Stuttgart, Germany | Mar 2024 – Present
- Developed firmware for automotive sensor modules using C and ARM Cortex-M4 microcontrollers
- Implemented device drivers for SPI, I2C, UART, and CAN bus communication protocols
- Wrote application-level code on FreeRTOS for task scheduling, inter-task communication, and interrupt handling
- Performed unit testing using Unity test framework and static analysis using PC-Lint
- Debugged firmware issues using JTAG debugger, logic analyzer, and oscilloscope
- Participated in code reviews following MISRA C coding standards
- Documented firmware interfaces and hardware abstraction layers
- Integrated sensor calibration algorithms provided by the hardware team

Embedded Software Intern | Continental AG, Regensburg, Germany | Jul 2023 – Feb 2024
- Assisted in developing embedded software for tire pressure monitoring systems using C
- Learned RTOS fundamentals and implemented basic task scheduling on FreeRTOS
- Wrote test scripts in Python for automated hardware-in-the-loop testing
- Reviewed datasheets and application notes for new microcontroller peripherals
- Created documentation for pin configurations and memory maps

EDUCATION

Bachelor of Science in Electrical and Computer Engineering | Technical University of Munich (TUM), Germany | 2023
- Grade: 1.7 (German scale)
- Relevant coursework: Embedded Systems, Microprocessor Architecture, Real-Time Operating Systems, Digital Signal Processing
- Thesis: Low-power communication protocol implementation for IoT sensor networks on ARM Cortex-M0

SKILLS
- Languages: C, C++ (basic), Python (scripting)
- Microcontrollers: ARM Cortex-M (M0, M4), STM32, NXP LPC
- RTOS: FreeRTOS
- Protocols: SPI, I2C, UART, CAN bus, GPIO
- Tools: JTAG Debugger, Logic Analyzer, Oscilloscope, Multimeter
- IDEs: Keil uVision, STM32CubeIDE, Eclipse
- Build: Make, CMake (basic), GCC ARM
- Testing: Unity Test Framework, PC-Lint, Python (hardware-in-the-loop)
- Standards: MISRA C (basic)
- Version Control: Git, SVN

CERTIFICATIONS
- ARM Accredited Engineer (AAE) Certificate (2023)`,
    questionnaire: {
      currentRole: 'Junior Embedded Developer',
      targetRole: 'Mid-Level Embedded Developer',
      yearsExperience: 2,
      country: 'Germany',
      workPreference: 'onsite',
    },
    expectedTraits: {
      minFitScore: 6,
      maxFitScore: 8,
      expectedGapSeverities: ['moderate', 'minor'],
      mustHaveStrengthKeywords: ['c', 'c++', 'rtos'],
      mustHaveGapKeywords: ['debugging tools', 'hardware integration'],
      expectedCurrency: 'EUR',
      shouldIncludeTargetRole: true,
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // A28: Mid Game Developer → Senior Game Developer
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'A28',
    category: 'normal',
    description: 'Mid Game Developer → Senior Game Developer',
    cvText: `SUMMARY
Game Developer with 5 years of experience creating interactive experiences using Unity and C#. Skilled in gameplay programming, physics systems, and UI development for PC and mobile platforms. Experienced in shipping multiple titles from prototype to release with a focus on code quality and performance.

EXPERIENCE

Mid-Level Game Developer | Supercell, Helsinki, Finland | Feb 2022 – Present
- Developed gameplay systems and mechanics using Unity and C# for mobile games with 100M+ downloads
- Implemented character controller, combat system, and AI behavior trees for action RPG prototype
- Built UI framework using Unity's UGUI system supporting dynamic layouts, localization, and theming
- Optimized rendering performance achieving consistent 60fps on low-end mobile devices through draw call batching, LOD management, and texture atlasing
- Designed and implemented save/load system using JSON serialization and local storage encryption
- Created custom editor tools in Unity for level designers and game designers to iterate quickly
- Wrote unit tests using NUnit and play-mode tests for gameplay systems
- Collaborated with artists, designers, and producers in a multidisciplinary team of 15

Game Developer | Rovio Entertainment, Espoo, Finland | Jun 2020 – Jan 2022
- Developed features for Angry Birds casual games using Unity and C#
- Implemented 2D physics interactions and particle effects for gameplay
- Built in-app purchase and ad monetization integration using Unity IAP and AdMob
- Created procedural level generation system for endless runner mode
- Performed memory profiling using Unity Profiler and optimized garbage collection

Junior Game Developer | Remedy Entertainment, Espoo, Finland | Aug 2019 – May 2020
- Assisted in developing UI systems for Control using proprietary game engine
- Implemented menu navigation and HUD elements using C#
- Fixed bugs in gameplay scripts and animation state machines

EDUCATION

Bachelor of Science in Computer Science (Game Development) | Aalto University, Finland | 2019
- Specialization: Interactive Media and Game Development
- Capstone project: Multiplayer arena game prototype using Unity and Photon networking

SKILLS
- Engine: Unity (5 years), Unreal Engine (basic)
- Languages: C#, C++ (basic), Python (tooling)
- Gameplay: Character Controllers, AI (Behavior Trees, FSM), Physics, Combat Systems
- UI: Unity UGUI, TextMeshPro, Responsive Layouts
- Graphics: Shader programming (basic ShaderLab/HLSL), Particle Systems, Post-processing
- Optimization: Unity Profiler, Frame Debugger, Draw Call Batching, Object Pooling, LOD
- Tools: Git, PlasticSCM, Jira, Trello, Unity Editor scripting
- Platforms: iOS, Android, PC

CERTIFICATIONS
- Unity Certified Developer (2021)`,
    questionnaire: {
      currentRole: 'Mid-Level Game Developer',
      targetRole: 'Senior Game Developer',
      yearsExperience: 5,
      country: 'Finland',
      workPreference: 'hybrid',
    },
    expectedTraits: {
      minFitScore: 6,
      maxFitScore: 8,
      expectedGapSeverities: ['moderate', 'minor'],
      mustHaveStrengthKeywords: ['unity', 'c#'],
      mustHaveGapKeywords: ['optimization', 'multiplayer networking'],
      expectedCurrency: 'EUR',
      shouldIncludeTargetRole: true,
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // A29: Senior Platform Engineer → Staff Platform Engineer
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'A29',
    category: 'normal',
    description: 'Senior Platform Engineer → Staff Platform Engineer',
    cvText: `SUMMARY
Senior Platform Engineer with 8 years of experience building and maintaining internal developer platforms and infrastructure tooling. Deep expertise in Kubernetes, Terraform, and Go with a strong focus on developer productivity, service reliability, and infrastructure automation. Proven track record of designing systems used by hundreds of engineers across an organization.

EXPERIENCE

Senior Platform Engineer | Finn.no (Schibsted), Oslo, Norway | Apr 2021 – Present
- Designed and maintained internal Kubernetes platform serving 300+ microservices across 20 engineering teams
- Built custom Kubernetes operators in Go for automated database provisioning, certificate management, and secret rotation
- Created Terraform modules and GitOps workflows (ArgoCD) enabling self-service infrastructure provisioning for developers
- Developed internal CLI tool in Go for service scaffolding, deployment, and debugging used by 200+ engineers daily
- Reduced service onboarding time from 2 weeks to 2 hours through standardized templates and automation
- Implemented multi-cluster Kubernetes setup with Istio service mesh for traffic management and observability
- Built centralized logging and monitoring platform using Prometheus, Grafana, Loki, and Tempo
- Authored internal engineering blog posts and documentation for platform features and best practices
- Participated in architecture review board evaluating system design proposals from product teams

Platform Engineer | DNB (Norway's largest bank), Oslo, Norway | Jun 2018 – Mar 2021
- Built and maintained CI/CD infrastructure using Jenkins, Tekton, and ArgoCD for 100+ development teams
- Developed Terraform modules for AWS infrastructure provisioning (EKS, RDS, S3, IAM)
- Created Docker base images and Helm charts standardizing application deployment across the organization
- Implemented RBAC and network policies for multi-tenant Kubernetes clusters
- Built monitoring dashboards and alert routing for platform services using Prometheus and Grafana

DevOps Engineer | Kahoot!, Oslo, Norway | Sep 2016 – May 2018
- Managed AWS infrastructure for a real-time quiz platform serving 7M+ concurrent users
- Built CI/CD pipelines using Jenkins and Docker for automated testing and deployment
- Configured autoscaling groups and load balancers for handling traffic spikes during live events
- Wrote Python and Bash scripts for infrastructure automation and monitoring

EDUCATION

Master of Science in Computer Science | Norwegian University of Science and Technology (NTNU), Trondheim, Norway | 2016
- Specialization: Distributed Systems and Cloud Computing
Bachelor of Science in Informatics | University of Oslo, Norway | 2014

SKILLS
- Orchestration: Kubernetes, Helm, ArgoCD, Istio, Kustomize
- IaC: Terraform, Pulumi (basic), CloudFormation
- Languages: Go, Python, Bash, HCL
- Cloud: AWS (EKS, RDS, S3, IAM, VPC), Google Cloud (GKE basics)
- CI/CD: ArgoCD, Jenkins, Tekton, GitHub Actions
- Monitoring: Prometheus, Grafana, Loki, Tempo, Jaeger
- Tools: Git, Docker, custom CLI tooling, Backstage (basic)
- Practices: GitOps, Platform Engineering, Internal Developer Platforms, SRE principles

CERTIFICATIONS
- Certified Kubernetes Administrator (CKA) (2020)
- HashiCorp Certified: Terraform Associate (2019)
- AWS Certified Solutions Architect – Associate (2018)`,
    questionnaire: {
      currentRole: 'Senior Platform Engineer',
      targetRole: 'Staff Platform Engineer',
      yearsExperience: 8,
      country: 'Norway',
      workPreference: 'remote',
    },
    expectedTraits: {
      minFitScore: 5,
      maxFitScore: 7,
      expectedGapSeverities: ['moderate', 'minor'],
      mustHaveStrengthKeywords: ['kubernetes', 'terraform', 'go'],
      mustHaveGapKeywords: ['developer experience', 'cross-team strategy'],
      expectedCurrency: 'EUR',
      shouldIncludeTargetRole: true,
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // A30: Mid Full-Stack Dev → Senior Full-Stack Dev
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'A30',
    category: 'normal',
    description: 'Mid Full-Stack Dev → Senior Full-Stack Dev',
    cvText: `SUMMARY
Full-Stack Developer with 4 years of experience building modern web applications using Next.js, TypeScript, and PostgreSQL. Skilled in both frontend and backend development with a focus on delivering performant, user-friendly products. Experienced in agile environments and collaborating with cross-functional teams.

EXPERIENCE

Mid-Level Full-Stack Developer | Showpad, Ghent, Belgium | Jan 2022 – Present
- Developed features for a sales enablement platform using Next.js, TypeScript, and React serving 1,200+ enterprise clients
- Built server-side rendered pages and API routes using Next.js App Router with React Server Components
- Designed and implemented RESTful APIs using Node.js and Express with TypeScript for content management workflows
- Managed PostgreSQL database schema design, migrations using Prisma ORM, and complex query optimization
- Implemented real-time collaboration features using WebSockets and Socket.io for shared content editing
- Built comprehensive test suites using Jest, React Testing Library, and Playwright for E2E testing
- Reduced initial page load time by 35% through image optimization, code splitting, and ISR (Incremental Static Regeneration)
- Participated in code reviews for a team of 6 developers and maintained coding standards documentation

Full-Stack Developer | Teamleader, Ghent, Belgium | Jun 2020 – Dec 2021
- Developed CRM features using React, TypeScript, and Node.js for a platform serving 15K+ SMB customers
- Built admin dashboards and reporting interfaces with complex data visualizations using Recharts
- Implemented GraphQL API layer using Apollo Server connecting multiple backend services
- Managed PostgreSQL databases with complex relational schemas and full-text search using pg_trgm
- Deployed applications using Docker and managed CI/CD pipelines with GitLab CI

Junior Full-Stack Developer | In The Pocket, Ghent, Belgium | Sep 2020 – May 2020
- Assisted in building web applications using React and Node.js for various client projects
- Created responsive UI components following mobile-first design principles
- Wrote basic API endpoints and database queries for CRUD operations

EDUCATION

Bachelor of Science in Applied Informatics | Ghent University, Belgium | 2020
- Relevant coursework: Web Development, Database Systems, Software Engineering, Algorithms
- Thesis: Performance optimization strategies for server-side rendered React applications

SKILLS
- Frontend: React, Next.js, TypeScript, Tailwind CSS, React Testing Library, Playwright
- Backend: Node.js, Express, GraphQL (Apollo Server), REST APIs
- Databases: PostgreSQL, Prisma ORM, Redis (basic)
- Testing: Jest, Playwright, React Testing Library
- Tools: Git, GitLab CI, Docker, Vercel, Figma
- Other: WebSockets, Socket.io, Agile/Scrum, Code Reviews

CERTIFICATIONS
- Vercel Next.js Certified Developer (2023)
- AWS Certified Cloud Practitioner (2022)`,
    questionnaire: {
      currentRole: 'Mid-Level Full-Stack Developer',
      targetRole: 'Senior Full-Stack Developer',
      yearsExperience: 4,
      country: 'Belgium',
      workPreference: 'hybrid',
    },
    expectedTraits: {
      minFitScore: 6,
      maxFitScore: 8,
      expectedGapSeverities: ['moderate', 'minor'],
      mustHaveStrengthKeywords: ['next.js', 'typescript', 'postgresql'],
      mustHaveGapKeywords: ['system design', 'performance'],
      expectedCurrency: 'EUR',
      shouldIncludeTargetRole: true,
    },
  },
];
