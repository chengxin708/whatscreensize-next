import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { pageAnalytics } from '@/lib/db/schema';
import { sql, gte, desc } from 'drizzle-orm';
import { auth } from '@/lib/auth';

// GET: Return aggregate analytics stats (auth required)
export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    // Total page views
    const [totalResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(pageAnalytics);

    // Page views by type
    const byType = await db
      .select({
        page_type: pageAnalytics.page_type,
        count: sql<number>`count(*)::int`,
      })
      .from(pageAnalytics)
      .groupBy(pageAnalytics.page_type);

    // Views in last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const [last7DaysResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(pageAnalytics)
      .where(gte(pageAnalytics.visited_at, sevenDaysAgo));

    // Views in last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const [last24hResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(pageAnalytics)
      .where(gte(pageAnalytics.visited_at, oneDayAgo));

    // Unique sessions last 7 days
    const [uniqueSessions] = await db
      .select({ count: sql<number>`count(DISTINCT ${pageAnalytics.session_id})::int` })
      .from(pageAnalytics)
      .where(gte(pageAnalytics.visited_at, sevenDaysAgo));

    // Daily views for last 7 days
    const dailyViews = await db
      .select({
        date: sql<string>`DATE(${pageAnalytics.visited_at})::text`,
        count: sql<number>`count(*)::int`,
      })
      .from(pageAnalytics)
      .where(gte(pageAnalytics.visited_at, sevenDaysAgo))
      .groupBy(sql`DATE(${pageAnalytics.visited_at})`)
      .orderBy(desc(sql`DATE(${pageAnalytics.visited_at})`));

    return NextResponse.json({
      total_views: totalResult?.count || 0,
      views_by_type: Object.fromEntries(byType.map((r) => [r.page_type, r.count])),
      last_7_days: last7DaysResult?.count || 0,
      last_24_hours: last24hResult?.count || 0,
      unique_sessions_7d: uniqueSessions?.count || 0,
      daily_views: dailyViews,
    });
  } catch (error) {
    console.error('Error fetching analytics stats:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics stats' }, { status: 500 });
  }
}
