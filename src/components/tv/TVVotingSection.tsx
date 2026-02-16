'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getOrCreateSessionId } from '@/lib/sessionId';
import type { TvVoteStats } from '@/types/tvVote';

export function TVVotingSection() {
  const [stats, setStats] = useState<TvVoteStats | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [myVote, setMyVote] = useState<'best' | 'good' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load stats and check local vote status
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
        body: JSON.stringify({
          vote_type: voteType,
          session_id: sessionId,
        }),
      });
      const result = await res.json();
      setStats(result.stats);
      setHasVoted(true);
      setMyVote(voteType);
      localStorage.setItem('tv-vote', voteType);
    } catch {
      // Already voted (409) - fetch fresh stats
      try {
        const freshRes = await fetch('/api/tv-votes/stats');
        const fresh = await freshRes.json();
        setStats(fresh.stats);
      } catch {
        // Ignore stats fetch failure
      }
      setHasVoted(true);
      setMyVote(voteType);
      localStorage.setItem('tv-vote', voteType);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="rounded-2xl p-6 mt-6"
      style={{
        background: 'var(--glass-surface)',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--glass-border)',
      }}
    >
      <h3
        className="font-heading font-semibold text-base mb-4 text-center"
        style={{ color: 'var(--text-main)' }}
      >
        {hasVoted ? 'Thanks for voting!' : 'Which recommendation do you prefer?'}
      </h3>

      {/* Voting Buttons (before voting) */}
      {!hasVoted && (
        <div className="flex gap-4 mb-2">
          <motion.button
            onClick={() => handleVote('best')}
            disabled={isSubmitting}
            className="flex-1 py-3 rounded-xl font-heading font-semibold text-white cursor-pointer disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Choose BEST
          </motion.button>
          <span
            className="flex items-center font-heading font-bold text-sm"
            style={{ color: 'var(--text-dim)' }}
          >
            VS
          </span>
          <motion.button
            onClick={() => handleVote('good')}
            disabled={isSubmitting}
            className="flex-1 py-3 rounded-xl font-heading font-semibold text-white cursor-pointer disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Choose GOOD
          </motion.button>
        </div>
      )}

      {/* Results Health Bar (after voting) */}
      {hasVoted && stats && (
        <div className="space-y-3">
          {/* Combined health bar */}
          <div className="relative h-10 rounded-full overflow-hidden flex" style={{ background: 'var(--input-bg)' }}>
            {/* Best (Red) side */}
            <motion.div
              className="h-full flex items-center justify-center text-sm font-semibold text-white relative"
              style={{ background: 'linear-gradient(90deg, #ef4444, #dc2626)' }}
              initial={{ width: 0 }}
              animate={{ width: `${stats.best_percentage}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              {stats.best_percentage >= 15 && (
                <span className="whitespace-nowrap px-2">
                  BEST {stats.best_percentage.toFixed(1)}%
                </span>
              )}
            </motion.div>
            {/* Good (Blue) side */}
            <motion.div
              className="h-full flex items-center justify-center text-sm font-semibold text-white relative"
              style={{ background: 'linear-gradient(90deg, #3b82f6, #2563eb)' }}
              initial={{ width: 0 }}
              animate={{ width: `${stats.good_percentage}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
            >
              {stats.good_percentage >= 15 && (
                <span className="whitespace-nowrap px-2">
                  GOOD {stats.good_percentage.toFixed(1)}%
                </span>
              )}
            </motion.div>
          </div>

          {/* Vote count and user's choice */}
          <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-dim)' }}>
            <span>{stats.total.toLocaleString()} total votes</span>
            {myVote && (
              <span>
                You voted: <strong style={{ color: myVote === 'best' ? '#ef4444' : '#3b82f6' }}>
                  {myVote.toUpperCase()}
                </strong>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
