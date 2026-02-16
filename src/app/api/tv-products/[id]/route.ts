import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tvProducts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

// GET: Get single TV product
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const [product] = await db
      .select()
      .from(tvProducts)
      .where(eq(tvProducts.id, Number(id)))
      .limit(1);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching TV product:', error);
    return NextResponse.json({ error: 'Failed to fetch TV product' }, { status: 500 });
  }
}

// PUT: Update TV product (auth required)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  try {
    const body = await request.json();
    const { size_inches, brand, model, panel_type, resolution, price_range, year, features, image_url, link, buy_links } = body;

    const [product] = await db
      .update(tvProducts)
      .set({
        size_inches,
        brand,
        model,
        panel_type,
        resolution,
        price_range,
        year,
        features: features || [],
        image_url: image_url || '',
        link: link || '',
        buy_links: buy_links || [],
        updated_at: new Date(),
      })
      .where(eq(tvProducts.id, Number(id)))
      .returning();

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating TV product:', error);
    return NextResponse.json({ error: 'Failed to update TV product' }, { status: 500 });
  }
}

// DELETE: Delete TV product (auth required)
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  try {
    const [deleted] = await db
      .delete(tvProducts)
      .where(eq(tvProducts.id, Number(id)))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting TV product:', error);
    return NextResponse.json({ error: 'Failed to delete TV product' }, { status: 500 });
  }
}
