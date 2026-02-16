import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { guides } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';

// GET: Return list of published guides (no content)
export async function GET() {
  try {
    const allGuides = await db
      .select({
        id: guides.id,
        slug: guides.slug,
        title: guides.title,
        description: guides.description,
        category: guides.category,
        reading_time: guides.reading_time,
        icon_name: guides.icon_name,
        gradient_from: guides.gradient_from,
        gradient_to: guides.gradient_to,
        sort_order: guides.sort_order,
        is_published: guides.is_published,
      })
      .from(guides)
      .where(eq(guides.is_published, true))
      .orderBy(asc(guides.sort_order));

    return NextResponse.json({ guides: allGuides });
  } catch (error) {
    console.error('Error fetching guides:', error);
    return NextResponse.json({ error: 'Failed to fetch guides' }, { status: 500 });
  }
}
