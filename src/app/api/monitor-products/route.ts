import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { monitorProducts } from '@/lib/db/schema';
import { asc } from 'drizzle-orm';
import { auth } from '@/lib/auth';

// GET: Query all monitor products, group by spec_key
export async function GET() {
  try {
    const allProducts = await db
      .select()
      .from(monitorProducts)
      .orderBy(asc(monitorProducts.spec_key), asc(monitorProducts.sort_order));

    // Group by spec_key
    const grouped: Record<string, typeof allProducts> = {};
    for (const product of allProducts) {
      const key = product.spec_key;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(product);
    }

    return NextResponse.json({ products: grouped });
  } catch (error) {
    console.error('Error fetching monitor products:', error);
    return NextResponse.json({ error: 'Failed to fetch monitor products' }, { status: 500 });
  }
}

// POST: Create new monitor product (auth required)
export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { spec_key, brand, model, panel_type, refresh_rate, price_range, year, features, tags, image_url, link, buy_links } = body;

    const [product] = await db
      .insert(monitorProducts)
      .values({
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
        sort_order: 0,
        buy_links: buy_links || [],
      })
      .returning();

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating monitor product:', error);
    return NextResponse.json({ error: 'Failed to create monitor product' }, { status: 500 });
  }
}
