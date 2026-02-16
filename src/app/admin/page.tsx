'use client';

import { useState, useEffect } from 'react';
import type { StatsData } from '@/types/product';

export default function DashboardPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function fetchStats() {
      try {
        const res = await fetch('/api/stats');
        if (!res.ok) throw new Error('Failed to load stats');
        const data = await res.json();
        if (!cancelled) {
          setStats(data);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load stats');
          setLoading(false);
        }
      }
    }

    fetchStats();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div
          className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: 'var(--glass-border)', borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="rounded-xl px-5 py-4 text-sm"
        style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          color: '#fca5a5',
        }}
      >
        {error}
      </div>
    );
  }

  if (!stats) return null;

  const tvSizes = Object.entries(stats.tv_by_size);
  const monitorSpecs = Object.entries(stats.monitor_by_spec);
  const maxTvCount = Math.max(...tvSizes.map(([, count]) => count), 1);
  const maxMonitorCount = Math.max(...monitorSpecs.map(([, count]) => count), 1);

  return (
    <div className="flex flex-col gap-8">
      {/* Page title */}
      <div>
        <h1
          className="text-2xl font-heading font-semibold"
          style={{ color: 'var(--text-main)' }}
        >
          Dashboard
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-dim)' }}>
          Overview of your product catalog
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          label="Total TV Products"
          value={stats.tv_total}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
              <polyline points="17 2 12 7 7 2" />
            </svg>
          }
        />
        <StatCard
          label="Total Monitor Products"
          value={stats.monitor_total}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          }
        />
      </div>

      {/* Distribution charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TV by size */}
        <GlassCard title="TV Products by Size">
          {tvSizes.length === 0 ? (
            <p className="text-sm py-4" style={{ color: 'var(--text-dim)' }}>No data yet</p>
          ) : (
            <div className="flex flex-col gap-3">
              {tvSizes.map(([size, count]) => (
                <BarRow
                  key={size}
                  label={`${size}"`}
                  count={count}
                  maxCount={maxTvCount}
                />
              ))}
            </div>
          )}
        </GlassCard>

        {/* Monitor by spec */}
        <GlassCard title="Monitor Products by Spec">
          {monitorSpecs.length === 0 ? (
            <p className="text-sm py-4" style={{ color: 'var(--text-dim)' }}>No data yet</p>
          ) : (
            <div className="flex flex-col gap-3">
              {monitorSpecs.map(([spec, count]) => (
                <BarRow
                  key={spec}
                  label={spec}
                  count={count}
                  maxCount={maxMonitorCount}
                />
              ))}
            </div>
          )}
        </GlassCard>
      </div>

      {/* Recent updates */}
      <GlassCard title="Recent Updates">
        {stats.recent_updates.length === 0 ? (
          <p className="text-sm py-4" style={{ color: 'var(--text-dim)' }}>
            No recent updates
          </p>
        ) : (
          <div className="flex flex-col">
            {stats.recent_updates.map((update, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 py-3"
                style={{
                  borderBottom:
                    idx < stats.recent_updates.length - 1
                      ? '1px solid var(--glass-border)'
                      : 'none',
                }}
              >
                <span
                  className="text-xs font-medium px-2 py-1 rounded uppercase tracking-wider shrink-0"
                  style={{
                    background:
                      update.type === 'tv'
                        ? 'rgba(99, 102, 241, 0.15)'
                        : 'rgba(236, 72, 153, 0.15)',
                    color:
                      update.type === 'tv' ? '#818cf8' : '#f472b6',
                  }}
                >
                  {update.type}
                </span>
                <div className="flex-1 min-w-0">
                  <span
                    className="text-sm font-medium"
                    style={{ color: 'var(--text-main)' }}
                  >
                    {update.brand} {update.model}
                  </span>
                </div>
                <span
                  className="text-xs shrink-0"
                  style={{ color: 'var(--text-dim)' }}
                >
                  {new Date(update.updated_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}

/* ---------- Sub-components ---------- */

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div
      className="rounded-xl p-5 flex items-center gap-4"
      style={{
        background: 'var(--glass-surface)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid var(--glass-border)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div
        className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
        style={{
          background: 'rgba(99, 102, 241, 0.12)',
          color: '#818cf8',
        }}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm" style={{ color: 'var(--text-dim)' }}>
          {label}
        </p>
        <p
          className="text-2xl font-heading font-bold mt-0.5"
          style={{ color: 'var(--text-main)' }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function GlassCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-xl p-5"
      style={{
        background: 'var(--glass-surface)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid var(--glass-border)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <h2
        className="text-base font-heading font-semibold mb-4"
        style={{ color: 'var(--text-main)' }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

function BarRow({
  label,
  count,
  maxCount,
}: {
  label: string;
  count: number;
  maxCount: number;
}) {
  const pct = Math.round((count / maxCount) * 100);

  return (
    <div className="flex items-center gap-3">
      <span
        className="text-xs font-medium w-28 shrink-0 truncate"
        style={{ color: 'var(--text-muted)' }}
      >
        {label}
      </span>
      <div
        className="flex-1 h-6 rounded-md overflow-hidden relative"
        style={{ background: 'var(--input-bg)' }}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-md transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #6366f1, #818cf8)',
            minWidth: count > 0 ? '24px' : '0px',
          }}
        />
        <span
          className="absolute inset-0 flex items-center px-2 text-xs font-medium"
          style={{ color: 'var(--text-main)' }}
        >
          {count}
        </span>
      </div>
    </div>
  );
}
