import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { guides } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { readFile } from 'fs/promises';
import path from 'path';

// GET: Read markdown file from filesystem and return { slug, title, content }
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const [guide] = await db
      .select()
      .from(guides)
      .where(eq(guides.slug, slug))
      .limit(1);

    if (!guide) {
      return NextResponse.json({ error: 'Guide not found' }, { status: 404 });
    }

    // Read markdown content from file
    let content = '';
    try {
      const filePath = path.join(process.cwd(), 'src', 'content', 'guides', `${slug}.md`);
      content = await readFile(filePath, 'utf-8');
    } catch {
      content = '# Error\n\nGuide content not found.';
    }

    return NextResponse.json({
      slug: guide.slug,
      title: guide.title,
      content,
    });
  } catch (error) {
    console.error('Error fetching guide content:', error);
    return NextResponse.json({ error: 'Failed to fetch guide content' }, { status: 500 });
  }
}
