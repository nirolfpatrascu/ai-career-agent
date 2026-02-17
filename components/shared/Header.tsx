'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-card-border bg-background/80 backdrop-blur-xl">
      <div className="max-w-container mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </div>
          <span className="text-lg font-semibold text-text-primary">
            Gap<span className="text-primary">Zero</span>
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/#features"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors hidden sm:block"
          >
            Features
          </Link>
          <Link
            href="/#how-it-works"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors hidden sm:block"
          >
            How It Works
          </Link>
          <Link
            href="/analyze"
            className="text-sm font-medium bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg transition-all duration-200"
          >
            Analyze My Career
          </Link>
        </nav>
      </div>
    </header>
  );
}
