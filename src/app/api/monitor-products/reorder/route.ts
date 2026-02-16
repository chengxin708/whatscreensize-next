import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { monitorProducts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

// PUT: Reorder monitor products (auth required)
export async function PUT(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const items: Array<{ id: number; sort_order: number }> = await request.json();

    // Update each product's sort_order
    for (const item of items) {
      await db
        .update(monitorProducts)
        .set({ sort_order: item.sort_order, updated_at: new Date() })
        .where(eq(monitorProducts.id, item.id));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error reordering monitor products:', error);
    return NextResponse.json({ error: 'Failed to reorder monitor products' }, { status: 500 });
  }
}
