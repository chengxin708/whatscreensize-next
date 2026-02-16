import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tvVotes } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';

// GET: Return vote counts and percentages
export async function GET() {
  try {
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

    return NextResponse.json({
      stats: {
        best_count: bestCount,
        good_count: goodCount,
        best_percentage: total > 0 ? Math.round((bestCount / total) * 100) : 0,
        good_percentage: total > 0 ? Math.round((goodCount / total) * 100) : 0,
        total,
      },
    });
  } catch (error) {
    console.error('Error fetching TV vote stats:', error);
    return NextResponse.json({ error: 'Failed to fetch vote stats' }, { status: 500 });
  }
}
