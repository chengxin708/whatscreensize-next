import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tvProducts, monitorProducts } from '@/lib/db/schema';
import { sql, desc } from 'drizzle-orm';
import { auth } from '@/lib/auth';

// GET: Return counts of TV products, monitor products, guides, recent analytics (auth required)
export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    // Total TV products
    const [tvTotal] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(tvProducts);

    // Total monitor products
    const [monitorTotal] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(monitorProducts);

    // TV by size
    const tvBySize = await db
      .select({
        size: sql<string>`${tvProducts.size_inches}::text`,
        count: sql<number>`count(*)::int`,
      })
      .from(tvProducts)
      .groupBy(tvProducts.size_inches)
      .orderBy(tvProducts.size_inches);

    // Monitor by spec
    const monitorBySpec = await db
      .select({
        spec: monitorProducts.spec_key,
        count: sql<number>`count(*)::int`,
      })
      .from(monitorProducts)
      .groupBy(monitorProducts.spec_key)
      .orderBy(monitorProducts.spec_key);

    // Recent updates (last 10 products updated from both tables)
    const recentTv = await db
      .select({
        type: sql<string>`'tv'`,
        brand: tvProducts.brand,
        model: tvProducts.model,
        updated_at: tvProducts.updated_at,
      })
      .from(tvProducts)
      .orderBy(desc(tvProducts.updated_at))
      .limit(5);

    const recentMonitor = await db
      .select({
        type: sql<string>`'monitor'`,
        brand: monitorProducts.brand,
        model: monitorProducts.model,
        updated_at: monitorProducts.updated_at,
      })
      .from(monitorProducts)
      .orderBy(desc(monitorProducts.updated_at))
      .limit(5);

    // Merge and sort by updated_at descending
    const recentUpdates = [...recentTv, ...recentMonitor]
      .sort((a, b) => {
        const dateA = a.updated_at ? new Date(a.updated_at).getTime() : 0;
        const dateB = b.updated_at ? new Date(b.updated_at).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 10)
      .map((item) => ({
        type: item.type,
        brand: item.brand,
        model: item.model,
        updated_at: item.updated_at?.toISOString() || '',
      }));

    return NextResponse.json({
      tv_total: tvTotal?.count || 0,
      monitor_total: monitorTotal?.count || 0,
      tv_by_size: Object.fromEntries(tvBySize.map((r) => [r.size, r.count])),
      monitor_by_spec: Object.fromEntries(monitorBySpec.map((r) => [r.spec, r.count])),
      recent_updates: recentUpdates,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
