import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tvVotes } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';

// POST: Record vote (unique per session_id), return updated stats
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { vote_type, session_id } = body;

    if (!vote_type || !session_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (vote_type !== 'best' && vote_type !== 'good') {
      return NextResponse.json({ error: 'Invalid vote type' }, { status: 400 });
    }

    // Check if session already voted
    const [existing] = await db
      .select()
      .from(tvVotes)
      .where(eq(tvVotes.session_id, session_id))
      .limit(1);

    if (existing) {
      // Update existing vote
      await db
        .update(tvVotes)
        .set({ vote_type, voted_at: new Date() })
        .where(eq(tvVotes.session_id, session_id));
    } else {
      // Get IP address from headers
      const forwarded = request.headers.get('x-forwarded-for');
      const ip = forwarded ? forwarded.split(',')[0].trim() : request.headers.get('x-real-ip') || '';

      // Insert new vote
      await db.insert(tvVotes).values({
        vote_type,
        session_id,
        ip_address: ip,
      });
    }

    // Return updated stats
    const stats = await getVoteStats();
    return NextResponse.json({ success: true, stats });
  } catch (error) {
    console.error('Error recording TV vote:', error);
    return NextResponse.json({ error: 'Failed to record vote' }, { status: 500 });
  }
}

async function getVoteStats() {
  const results = await db
    .select({
      vote_type: tvVotes.vote_type,
      count: sql<number>`count(*)::int`,
    })
    .from(tvVotes)
    .groupBy(tvVotes.vote_type);

  let bestCount = 0;
  let goodCount = 0;

  for (const row of results) {
    if (row.vote_type === 'best') bestCount = row.count;
    if (row.vote_type === 'good') goodCount = row.count;
  }

  const total = bestCount + goodCount;

  return {
    best_count: bestCount,
    good_count: goodCount,
    best_percentage: total > 0 ? Math.round((bestCount / total) * 100) : 0,
    good_percentage: total > 0 ? Math.round((goodCount / total) * 100) : 0,
    total,
  };
}
