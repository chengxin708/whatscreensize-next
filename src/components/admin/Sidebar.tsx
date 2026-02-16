'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
interface SidebarProps {
  userName: string;
}

const navItems = [
  {
    label: 'Dashboard',
    path: '/admin',
    end: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    label: 'TV Products',
    path: '/admin/tv-products',
    end: false,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
        <polyline points="17 2 12 7 7 2" />
      </svg>
    ),
  },
  {
    label: 'Monitor Products',
    path: '/admin/monitor-products',
    end: false,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    label: 'Product Discovery',
    path: '/admin/product-discovery',
    end: false,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
];

function isItemActive(pathname: string, item: typeof navItems[number]): boolean {
  if (item.end) {
    return pathname === item.path;
  }
  return pathname.startsWith(item.path);
}

export function Sidebar({ userName }: SidebarProps) {
  const pathname = usePathname();

  const handleLogout = () => {
    signOut({ callbackUrl: '/admin/login' });
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex fixed left-0 top-0 bottom-0 w-[250px] flex-col z-40"
        style={{
          background: 'rgba(10, 15, 30, 0.85)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRight: '1px solid var(--glass-border)',
        }}
      >
        {/* Logo */}
        <div className="px-6 py-5 flex items-center gap-3 border-b border-white/5">
          <img
            src="/assets/logo.png"
            alt="WhatScreenSize"
            className="h-7 w-auto"
          />
          <span
            className="text-xs font-medium tracking-wider uppercase"
            style={{ color: 'var(--text-dim)' }}
          >
            Admin
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {navItems.map((item) => {
            const active = isItemActive(pathname, item);
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-3 min-h-[44px] rounded-lg text-sm font-medium transition-all duration-200 ${
                  active ? '' : 'hover:bg-white/5'
                }`}
                style={{
                  background: active ? 'rgba(99, 102, 241, 0.15)' : undefined,
                  color: active ? '#818cf8' : 'var(--text-muted)',
                  borderLeft: active ? '3px solid #6366f1' : '3px solid transparent',
                }}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div
          className="px-4 py-4 border-t border-white/5 flex items-center justify-between gap-2"
        >
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
              style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8' }}
            >
              {userName.charAt(0).toUpperCase()}
            </div>
            <span
              className="text-sm truncate"
              style={{ color: 'var(--text-muted)' }}
            >
              {userName}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg transition-colors duration-200 hover:bg-white/5"
            style={{ color: 'var(--text-dim)' }}
            aria-label="Logout"
            title="Logout"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header
        className="md:hidden fixed top-0 left-0 right-0 z-40"
        style={{
          background: 'rgba(10, 15, 30, 0.9)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: '1px solid var(--glass-border)',
        }}
      >
        {/* Top row: logo + user */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <img
              src="/assets/logo.png"
              alt="WhatScreenSize"
              className="h-6 w-auto"
            />
            <span
              className="text-xs font-medium tracking-wider uppercase"
              style={{ color: 'var(--text-dim)' }}
            >
              Admin
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg transition-colors duration-200"
            style={{ color: 'var(--text-dim)' }}
            aria-label="Logout"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>

        {/* Nav row */}
        <nav className="flex items-center gap-1 px-3 pb-3 overflow-x-auto">
          {navItems.map((item) => {
            const active = isItemActive(pathname, item);
            return (
              <Link
                key={item.path}
                href={item.path}
                className="flex items-center gap-2 px-3 min-h-[40px] rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200"
                style={{
                  background: active ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                  color: active ? '#818cf8' : 'var(--text-muted)',
                }}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>
    </>
  );
}
