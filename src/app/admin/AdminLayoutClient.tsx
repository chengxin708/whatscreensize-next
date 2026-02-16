'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Sidebar } from '@/components/admin/Sidebar';

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-main)' }}>
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: 'var(--glass-border)', borderTopColor: 'transparent' }}
          />
          <span className="text-sm" style={{ color: 'var(--text-dim)' }}>
            Verifying session...
          </span>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-main)' }}>
      <Sidebar userName={session.user?.name || 'Admin'} />

      {/* Main content area */}
      <div className="md:ml-[250px] min-h-screen">
        {/* Mobile spacer for fixed top bar */}
        <div className="md:hidden h-[120px]" />

        <main className="p-4 md:p-8 max-w-[1400px]">
          {children}
        </main>
      </div>
    </div>
  );
}
