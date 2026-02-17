'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { BackgroundGradients } from './BackgroundGradients';

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <BackgroundGradients />
      <div className="relative z-10 min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 pb-8">
          {children}
        </main>
      </div>
    </>
  );
}
