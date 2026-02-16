import { db } from '@/lib/db';
import { guides } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { readFile } from 'fs/promises';
import path from 'path';
import { MarkdownRenderer } from '@/components/guides/MarkdownRenderer';

// Make this page dynamic (rendered at request time)
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const [guide] = await db.select().from(guides).where(eq(guides.slug, slug)).limit(1);
    if (!guide) return { title: 'Guide Not Found' };
    return {
      title: `${guide.title} | WhatScreenSize`,
      description: guide.description,
    };
  } catch {
    return { title: 'Guide | WhatScreenSize' };
  }
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [guide] = await db.select().from(guides).where(eq(guides.slug, slug)).limit(1);
  if (!guide) notFound();

  // Read markdown content from file
  let content = '';
  try {
    const filePath = path.join(process.cwd(), 'src', 'content', 'guides', `${slug}.md`);
    content = await readFile(filePath, 'utf-8');
  } catch {
    content = '# Error\n\nGuide content not found.';
  }

  return (
    <div className="pt-6">
      <div className="glass-panel overflow-hidden">
        <div className="px-8 py-6">
          <div className="flex items-center gap-3 mb-6">
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full uppercase tracking-wider"
              style={{
                background: `${guide.gradient_from}20`,
                color: guide.gradient_from ?? undefined,
              }}
            >
              {guide.category}
            </span>
            <span className="text-xs" style={{ color: 'var(--text-dim)' }}>
              {guide.reading_time} min read
            </span>
          </div>
          <MarkdownRenderer content={content} />
        </div>
      </div>
    </div>
  );
}
