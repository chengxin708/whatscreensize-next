import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { pageAnalytics } from '@/lib/db/schema';
import { and, eq, gte, sql } from 'drizzle-orm';

// POST: Record page view with 24-hour deduplication
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { page_type, page_identifier, session_id } = body;

    if (!page_type || !session_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 24-hour deduplication: check if same session visited same page in last 24h
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [existing] = await db
      .select({ id: pageAnalytics.id })
      .from(pageAnalytics)
      .where(
        and(
          eq(pageAnalytics.session_id, session_id),
          eq(pageAnalytics.page_type, page_type),
          page_identifier
            ? eq(pageAnalytics.page_identifier, page_identifier)
            : sql`${pageAnalytics.page_identifier} IS NULL`,
          gte(pageAnalytics.visited_at, twentyFourHoursAgo)
        )
      )
      .limit(1);

    if (existing) {
      return NextResponse.json({ success: true, message: 'Already recorded' });
    }

    // Get IP address from headers
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : request.headers.get('x-real-ip') || '';
    const userAgent = request.headers.get('user-agent') || '';

    await db.insert(pageAnalytics).values({
      page_type,
      page_identifier: page_identifier || null,
      session_id,
      ip_address: ip,
      user_agent: userAgent,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error recording page view:', error);
    return NextResponse.json({ error: 'Failed to record page view' }, { status: 500 });
  }
}
