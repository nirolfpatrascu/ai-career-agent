import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-md text-center space-y-6">
        <div className="text-7xl font-bold text-primary/20">404</div>
        <div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">Page not found</h1>
          <p className="text-text-secondary">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary">
            Back to Home
          </Link>
          <Link href="/analyze" className="btn-secondary">
            Analyze My Career
          </Link>
        </div>
      </div>
    </main>
  );
}
