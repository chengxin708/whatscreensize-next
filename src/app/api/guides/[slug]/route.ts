import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { guides } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// GET: Return guide metadata by slug
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const [guide] = await db
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
      .where(eq(guides.slug, slug))
      .limit(1);

    if (!guide) {
      return NextResponse.json({ error: 'Guide not found' }, { status: 404 });
    }

    return NextResponse.json(guide);
  } catch (error) {
    console.error('Error fetching guide:', error);
    return NextResponse.json({ error: 'Failed to fetch guide' }, { status: 500 });
  }
}
