import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
      <h1
        className="text-7xl font-heading font-bold mb-4"
        style={{ color: 'var(--text-dim)' }}
      >
        404
      </h1>
      <p
        className="text-xl font-medium mb-8"
        style={{ color: 'var(--text-muted)' }}
      >
        Page not found
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-xl font-medium text-white transition-opacity duration-200 hover:opacity-90"
        style={{ background: 'var(--color-primary)' }}
      >
        Go Home
      </Link>
    </div>
  );
}
