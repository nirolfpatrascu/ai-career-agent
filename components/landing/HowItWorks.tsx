const STEPS = [
  {
    number: '01',
    title: 'Upload Your CV',
    description:
      'Drag and drop your PDF resume. Our AI reads every detail — skills, certifications, experience, and even implicit competencies you didn\'t explicitly list.',
    visual: (
      <div className="bg-background rounded-xl border border-card-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary">resume_2026.pdf</p>
            <p className="text-xs text-text-secondary">1.2 MB • PDF</p>
          </div>
        </div>
        <div className="h-2 rounded-full bg-card-border overflow-hidden">
          <div className="h-full w-full bg-primary rounded-full" />
        </div>
        <p className="text-xs text-success mt-2">Upload complete</p>
      </div>
    ),
  },
  {
    number: '02',
    title: 'Tell Us Your Goals',
    description:
      'Answer a quick questionnaire about your current role, target position, location, and salary expectations. Takes under 2 minutes.',
    visual: (
      <div className="bg-background rounded-xl border border-card-border p-6 space-y-3">
        {[
          { label: 'Current Role', value: 'Software Engineer' },
          { label: 'Target Role', value: 'AI Solutions Architect' },
          { label: 'Country', value: 'Romania' },
        ].map((field, i) => (
          <div key={i}>
            <p className="text-xs text-text-secondary mb-1">{field.label}</p>
            <div className="bg-card border border-card-border rounded-lg px-3 py-2 text-sm text-text-primary">
              {field.value}
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    number: '03',
    title: 'Get Your Career Roadmap',
    description:
      'In 60 seconds, receive a comprehensive analysis: fit score, strengths, skill gaps, salary benchmarks, and a personalized action plan.',
    visual: (
      <div className="bg-background rounded-xl border border-card-border p-6">
        <div className="flex items-center justify-center mb-4">
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#27272A" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="8"
                strokeDasharray="251.3"
                strokeDashoffset="50.3"
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-text-primary">
              8/10
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success" />
            <span className="text-xs text-text-secondary">5 strengths identified</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-warning" />
            <span className="text-xs text-text-secondary">3 gaps to close</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-xs text-text-secondary">12 action items</span>
          </div>
        </div>
      </div>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24">
      <div className="max-w-container mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-3">
            How It Works
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            From CV to career roadmap in 3 steps
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            No sign-up required. Upload, answer a few questions, and get your
            personalized analysis.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-20">
          {STEPS.map((step, i) => (
            <div
              key={i}
              className={`flex flex-col ${
                i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } items-center gap-12 lg:gap-16`}
            >
              {/* Text side */}
              <div className="flex-1 space-y-4">
                <span className="text-5xl font-bold text-primary/20">
                  {step.number}
                </span>
                <h3 className="text-2xl font-bold text-text-primary">
                  {step.title}
                </h3>
                <p className="text-lg text-text-secondary leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Visual side */}
              <div className="flex-1 w-full max-w-md">{step.visual}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
