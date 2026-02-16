'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getOrCreateSessionId } from '@/lib/sessionId';
import type { TranslationKeys } from '@/types/i18n';
import type { TvVoteStats } from '@/types/tvVote';

interface TVResultCardsProps {
  best: number;
  good: number;
  t: TranslationKeys;
}

export function TVResultCards({ best, good, t }: TVResultCardsProps) {
  const [stats, setStats] = useState<TvVoteStats | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [myVote, setMyVote] = useState<'best' | 'good' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/tv-votes/stats')
      .then((res) => res.json())
      .then((data) => setStats(data.stats))
      .catch((err: unknown) => console.error('Failed to load vote stats:', err));

    const voted = localStorage.getItem('tv-vote');
    if (voted === 'best' || voted === 'good') {
      setHasVoted(true);
      setMyVote(voted);
    }
  }, []);

  const handleVote = async (voteType: 'best' | 'good') => {
    if (isSubmitting || hasVoted) return;
    setIsSubmitting(true);

    const sessionId = getOrCreateSessionId();

    try {
      const res = await fetch('/api/tv-votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vote_type: voteType, session_id: sessionId }),
      });
      const result = await res.json();
      setStats(result.stats);
      setHasVoted(true);
      setMyVote(voteType);
      localStorage.setItem('tv-vote', voteType);
    } catch {
      try {
        const freshRes = await fetch('/api/tv-votes/stats');
        const fresh = await freshRes.json();
        setStats(fresh.stats);
      } catch {
        // ignore
      }
      setHasVoted(true);
      setMyVote(voteType);
      localStorage.setItem('tv-vote', voteType);
    } finally {
      setIsSubmitting(false);
    }
  };

  const bestPct = stats?.best_percentage ?? 50;
  const goodPct = stats?.good_percentage ?? 50;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Best (IMAX) Card */}
        <div
          className="rounded-2xl p-6 text-center flex flex-col"
          style={{
            background: 'var(--results-bg)',
            border: myVote === 'best'
              ? '2px solid rgba(168, 85, 247, 0.6)'
              : '1px solid rgba(99, 102, 241, 0.3)',
            boxShadow: myVote === 'best'
              ? '0 0 20px rgba(168, 85, 247, 0.15)'
              : 'var(--shadow-glow)',
          }}
        >
          <p
            className="text-sm font-medium mb-2"
            style={{ color: 'var(--text-muted)' }}
          >
            {t.tvBestLabel}
          </p>
          <p className="font-heading font-bold text-5xl gradient-text mb-2">
            {best}&quot;
          </p>
          <p className="text-xs mb-4" style={{ color: 'var(--text-dim)' }}>
            {t.tvRatioDesc}: 0.6
          </p>

          <div className="mt-auto">
            {!hasVoted ? (
              <motion.button
                onClick={() => handleVote('best')}
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer disabled:opacity-50 transition-opacity"
                style={{
                  background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.8), rgba(99, 102, 241, 0.8))',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                {isSubmitting ? '...' : 'Vote BEST'}
              </motion.button>
            ) : (
              <div
                className="py-2 rounded-xl text-xs font-medium text-center"
                style={{
                  background: myVote === 'best' ? 'rgba(168, 85, 247, 0.12)' : 'transparent',
                  color: myVote === 'best' ? '#c084fc' : 'var(--text-dim)',
                  border: myVote === 'best' ? '1px solid rgba(168, 85, 247, 0.25)' : '1px solid transparent',
                }}
              >
                {myVote === 'best' ? '✓ Your vote' : ''}
              </div>
            )}
          </div>
        </div>

        {/* Good Card */}
        <div
          className="rounded-2xl p-6 text-center flex flex-col"
          style={{
            background: 'var(--results-bg)',
            border: myVote === 'good'
              ? '2px solid rgba(59, 130, 246, 0.6)'
              : '1px solid var(--glass-border)',
            boxShadow: myVote === 'good'
              ? '0 0 20px rgba(59, 130, 246, 0.15)'
              : undefined,
          }}
        >
          <p
            className="text-sm font-medium mb-2"
            style={{ color: 'var(--text-muted)' }}
          >
            {t.tvGoodLabel}
          </p>
          <p
            className="font-heading font-bold text-5xl mb-2"
            style={{ color: 'var(--text-main)' }}
          >
            {good}&quot;
          </p>
          <p className="text-xs mb-4" style={{ color: 'var(--text-dim)' }}>
            {t.tvRatioDesc}: 0.5
          </p>

          <div className="mt-auto">
            {!hasVoted ? (
              <motion.button
                onClick={() => handleVote('good')}
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer disabled:opacity-50 transition-opacity"
                style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(37, 99, 235, 0.8))',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                {isSubmitting ? '...' : 'Vote GOOD'}
              </motion.button>
            ) : (
              <div
                className="py-2 rounded-xl text-xs font-medium text-center"
                style={{
                  background: myVote === 'good' ? 'rgba(59, 130, 246, 0.12)' : 'transparent',
                  color: myVote === 'good' ? '#60a5fa' : 'var(--text-dim)',
                  border: myVote === 'good' ? '1px solid rgba(59, 130, 246, 0.25)' : '1px solid transparent',
                }}
              >
                {myVote === 'good' ? '✓ Your vote' : ''}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PK Fire Power Bar — TikTok/Douyin style */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="relative">
            {/* Percentage labels above bar */}
            <div className="flex justify-between items-end mb-1.5 px-1">
              <motion.span
                className="text-sm font-bold tabular-nums"
                style={{ color: '#c084fc' }}
                key={bestPct}
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {bestPct.toFixed(1)}%
              </motion.span>
              <span
                className="text-[10px] font-medium uppercase tracking-widest"
                style={{ color: 'var(--text-dim)' }}
              >
                {hasVoted
                  ? `${stats.total.toLocaleString()} votes`
                  : 'Vote above!'}
              </span>
              <motion.span
                className="text-sm font-bold tabular-nums"
                style={{ color: '#60a5fa' }}
                key={goodPct}
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {goodPct.toFixed(1)}%
              </motion.span>
            </div>

            {/* The PK bar */}
            <div
              className="relative h-7 rounded-full overflow-hidden flex"
              style={{
                background: 'rgba(100, 100, 120, 0.15)',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)',
              }}
            >
              {/* BEST (purple/left) side */}
              <motion.div
                className="h-full relative overflow-hidden"
                style={{
                  background: 'linear-gradient(90deg, #a855f7, #8b5cf6, #7c3aed)',
                  borderRadius: '9999px 0 0 9999px',
                }}
                initial={{ width: '50%' }}
                animate={{ width: `${bestPct}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              >
                {/* Shimmer / energy effect */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
                    animation: 'pkShimmer 2s ease-in-out infinite',
                  }}
                />
                {/* Inner glow */}
                <div
                  className="absolute inset-0"
                  style={{
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.15)',
                  }}
                />
                {bestPct >= 20 && (
                  <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-white/90 tracking-wide">
                    BEST
                  </span>
                )}
              </motion.div>

              {/* Center divider — the clash point */}
              <div
                className="absolute top-0 bottom-0 z-10"
                style={{
                  left: `calc(${bestPct}% - 1px)`,
                  width: '2px',
                  background: 'rgba(255,255,255,0.9)',
                  boxShadow: '0 0 8px rgba(255,255,255,0.6), 0 0 16px rgba(255,255,255,0.3)',
                  transition: 'left 1s ease-out',
                }}
              />

              {/* GOOD (blue/right) side */}
              <motion.div
                className="h-full relative overflow-hidden flex-1"
                style={{
                  background: 'linear-gradient(90deg, #2563eb, #3b82f6, #60a5fa)',
                  borderRadius: '0 9999px 9999px 0',
                }}
              >
                {/* Shimmer / energy effect */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(270deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
                    animation: 'pkShimmer 2s ease-in-out infinite',
                    animationDelay: '1s',
                  }}
                />
                {/* Inner glow */}
                <div
                  className="absolute inset-0"
                  style={{
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.15)',
                  }}
                />
                {goodPct >= 20 && (
                  <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-white/90 tracking-wide">
                    GOOD
                  </span>
                )}
              </motion.div>

              {/* Outer glow for the whole bar */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  boxShadow: `
                    -4px 0 12px rgba(168, 85, 247, 0.25),
                    4px 0 12px rgba(59, 130, 246, 0.25)
                  `,
                }}
              />
            </div>
          </div>

          {/* CSS animation for shimmer */}
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes pkShimmer {
              0%, 100% { opacity: 0; transform: translateX(-100%); }
              50% { opacity: 1; transform: translateX(100%); }
            }
          ` }} />
        </motion.div>
      )}

      {/* Prompt before voting */}
      {!hasVoted && !stats && (
        <p className="text-center text-xs" style={{ color: 'var(--text-dim)' }}>
          Which size recommendation do you prefer?
        </p>
      )}
    </div>
  );
}
