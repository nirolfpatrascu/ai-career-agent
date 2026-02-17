import Link from 'next/link';

export default function CTA() {
  return (
    <section className="py-24">
      <div className="max-w-container mx-auto px-6">
        <div className="relative overflow-hidden rounded-2xl border border-card-border bg-card p-12 sm:p-16 text-center">
          {/* Background glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-primary/10 rounded-full blur-[100px]" />
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Ready to accelerate your career?
            </h2>
            <p className="text-lg text-text-secondary max-w-xl mx-auto mb-8">
              Upload your CV and get a comprehensive career analysis in 60 seconds.
              Free to use, no sign-up required.
            </p>
            <Link
              href="/analyze"
              className="group btn-primary text-lg px-10 py-4 inline-flex items-center gap-3 shadow-lg shadow-primary/20"
            >
              Analyze My Career — Free
              <svg
                className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <p className="text-sm text-text-secondary mt-6">
              No sign-up • No credit card • Results in 60 seconds
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
