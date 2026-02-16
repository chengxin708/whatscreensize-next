import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tvProducts, monitorProducts } from '@/lib/db/schema';
import { auth } from '@/lib/auth';

interface ImportProduct {
  sku: string;
  name: string;
  brand: string;
  model_number: string;
  price: number;
  image_url: string;
  screen_size: number;
  resolution: string;
  refresh_rate: string;
  panel_type: string;
  // Type-specific fields
  size_inches?: number;
  spec_key?: string;
  features?: string[];
  tags?: string[];
  year?: number;
}

// POST: Import products from discovery results into DB (auth required)
export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { type, products } = body as { type: 'tv' | 'monitor'; products: ImportProduct[] };

    if (!type || !products || !Array.isArray(products)) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    let imported = 0;
    const failed: Array<{ sku: string; error: string }> = [];

    for (const product of products) {
      try {
        if (type === 'tv') {
          // Derive model from model_number or name
          const model = product.model_number || product.name.replace(product.brand, '').trim();
          const priceRange = product.price > 0 ? `$${product.price.toLocaleString()}` : '';

          await db.insert(tvProducts).values({
            size_inches: product.size_inches || Math.round(product.screen_size),
            brand: product.brand,
            model,
            panel_type: product.panel_type || 'LED',
            resolution: product.resolution || '4K',
            price_range: priceRange,
            year: product.year || new Date().getFullYear(),
            features: product.features || [],
            image_url: product.image_url || '',
            link: '',
            sort_order: 0,
            buy_links: [],
          });
        } else {
          // Monitor
          const model = product.model_number || product.name.replace(product.brand, '').trim();
          const priceRange = product.price > 0 ? `$${product.price.toLocaleString()}` : '';

          // Generate spec_key if not provided
          let specKey = product.spec_key;
          if (!specKey) {
            const size = Math.round(product.screen_size);
            const res = product.resolution.replace(/\s+/g, '');
            specKey = `${size}-${res}`;
          }

          await db.insert(monitorProducts).values({
            spec_key: specKey,
            brand: product.brand,
            model,
            panel_type: product.panel_type || 'IPS',
            refresh_rate: product.refresh_rate || '',
            price_range: priceRange,
            year: product.year || new Date().getFullYear(),
            features: product.features || [],
            tags: product.tags || [],
            image_url: product.image_url || '',
            link: '',
            sort_order: 0,
            buy_links: [],
          });
        }

        imported++;
      } catch (err) {
        failed.push({
          sku: product.sku,
          error: err instanceof Error ? err.message : 'Import failed',
        });
      }
    }

    return NextResponse.json({ imported, failed });
  } catch (error) {
    console.error('Error importing products:', error);
    return NextResponse.json({ error: 'Failed to import products' }, { status: 500 });
  }
}
