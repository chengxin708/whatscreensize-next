'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/lib/theme/useTheme';
import { useTranslation } from '@/lib/i18n/useTranslation';

export function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { lang, t, toggleLanguage } = useTranslation();

  const navLinks = [
    { label: t.navHome, path: '/' },
    { label: t.navTv, path: '/tv' },
    { label: t.navMonitor, path: '/monitor' },
  ] as const;

  const isActive = (path: string) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path);

  return (
    <nav className="relative md:sticky md:top-0 z-50 py-3 px-4 md:px-6">
      {/* Desktop layout */}
      <div
        className="mx-auto hidden md:flex items-center justify-between
                    w-[min(1200px,92%)] rounded-full px-2 py-1.5"
        style={{
          background: 'var(--glass-surface)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid var(--glass-border)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0 pl-2">
          <img
            src="/assets/logo.png"
            alt="WhatScreenSize"
            className="h-7 w-auto"
          />
        </Link>

        {/* Center nav links */}
        <div className="flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
              style={{
                background: isActive(link.path)
                  ? 'var(--color-primary)'
                  : 'transparent',
                color: isActive(link.path)
                  ? '#ffffff'
                  : 'var(--text-muted)',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-1 pr-1">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-full transition-colors duration-200"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = 'var(--hover-bg)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = 'transparent')
            }
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          <button
            onClick={toggleLanguage}
            className="h-9 px-3 flex items-center justify-center rounded-full text-sm font-medium transition-colors duration-200"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = 'var(--hover-bg)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = 'transparent')
            }
            aria-label="Toggle language"
          >
            {lang === 'en' ? 'EN' : '\u4e2d'}
          </button>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden flex flex-col gap-2">
        {/* Top row: logo centered, controls on right */}
        <div className="relative flex items-center justify-center min-h-[44px]">
          <Link href="/" className="flex items-center">
            <img
              src="/assets/logo.png"
              alt="WhatScreenSize"
              className="h-7 w-auto"
            />
          </Link>

          <div className="absolute right-0 flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className="w-11 h-11 flex items-center justify-center rounded-full transition-colors duration-200"
              style={{ color: 'var(--text-muted)' }}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>

            <button
              onClick={toggleLanguage}
              className="w-11 h-11 flex items-center justify-center rounded-full text-sm font-medium transition-colors duration-200"
              style={{ color: 'var(--text-muted)' }}
              aria-label="Toggle language"
            >
              {lang === 'en' ? 'EN' : '\u4e2d'}
            </button>
          </div>
        </div>

        {/* Bottom row: nav links full width */}
        <div
          className="flex items-center justify-center gap-1 rounded-full px-2 py-1.5"
          style={{
            background: 'var(--glass-surface)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid var(--glass-border)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className="flex-1 text-center min-h-[44px] flex items-center justify-center rounded-full text-sm font-medium transition-all duration-200"
              style={{
                background: isActive(link.path)
                  ? 'var(--color-primary)'
                  : 'transparent',
                color: isActive(link.path)
                  ? '#ffffff'
                  : 'var(--text-muted)',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
