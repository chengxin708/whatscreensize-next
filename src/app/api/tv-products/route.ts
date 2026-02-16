import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tvProducts } from '@/lib/db/schema';
import { asc } from 'drizzle-orm';
import { auth } from '@/lib/auth';

// GET: Query all TV products, group by size_inches
export async function GET() {
  try {
    const allProducts = await db
      .select()
      .from(tvProducts)
      .orderBy(asc(tvProducts.size_inches), asc(tvProducts.sort_order));

    // Group by size_inches
    const grouped: Record<string, typeof allProducts> = {};
    for (const product of allProducts) {
      const key = String(product.size_inches);
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(product);
    }

    return NextResponse.json({ products: grouped });
  } catch (error) {
    console.error('Error fetching TV products:', error);
    return NextResponse.json({ error: 'Failed to fetch TV products' }, { status: 500 });
  }
}

// POST: Create new TV product (auth required)
export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { size_inches, brand, model, panel_type, resolution, price_range, year, features, image_url, link, buy_links } = body;

    const [product] = await db
      .insert(tvProducts)
      .values({
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
        sort_order: 0,
        buy_links: buy_links || [],
      })
      .returning();

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating TV product:', error);
    return NextResponse.json({ error: 'Failed to create TV product' }, { status: 500 });
  }
}
