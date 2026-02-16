import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { monitorProducts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

// GET: Get single monitor product
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const [product] = await db
      .select()
      .from(monitorProducts)
      .where(eq(monitorProducts.id, Number(id)))
      .limit(1);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching monitor product:', error);
    return NextResponse.json({ error: 'Failed to fetch monitor product' }, { status: 500 });
  }
}

// PUT: Update monitor product (auth required)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  try {
    const body = await request.json();
    const { spec_key, brand, model, panel_type, refresh_rate, price_range, year, features, tags, image_url, link, buy_links } = body;

    const [product] = await db
      .update(monitorProducts)
      .set({
        spec_key,
        brand,
        model,
        panel_type,
        refresh_rate,
        price_range,
        year,
        features: features || [],
        tags: tags || [],
        image_url: image_url || '',
        link: link || '',
        buy_links: buy_links || [],
        updated_at: new Date(),
      })
      .where(eq(monitorProducts.id, Number(id)))
      .returning();

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating monitor product:', error);
    return NextResponse.json({ error: 'Failed to update monitor product' }, { status: 500 });
  }
}

// DELETE: Delete monitor product (auth required)
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  try {
    const [deleted] = await db
      .delete(monitorProducts)
      .where(eq(monitorProducts.id, Number(id)))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting monitor product:', error);
    return NextResponse.json({ error: 'Failed to delete monitor product' }, { status: 500 });
  }
}
