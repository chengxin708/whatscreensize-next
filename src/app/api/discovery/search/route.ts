import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

const BESTBUY_API_KEY = process.env.BESTBUY_API_KEY;

// POST: Proxy search to BestBuy API (auth required)
export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (!BESTBUY_API_KEY) {
    return NextResponse.json({ error: 'BestBuy API key not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { type, brand, sizeMin, sizeMax, priceMax, page = 1 } = body;
    const pageSize = 24;

    // Build BestBuy API query filters
    const filters: string[] = [];

    if (type === 'tv') {
      filters.push('(categoryPath.id=abcat0101000)'); // TVs category
    } else {
      filters.push('(categoryPath.id=abcat0509000)'); // Monitors category
    }

    if (brand) {
      // Support comma-separated brands
      const brands = brand.split(',').map((b: string) => b.trim()).filter(Boolean);
      if (brands.length === 1) {
        filters.push(`(manufacturer=${encodeURIComponent(brands[0])})`);
      } else if (brands.length > 1) {
        const brandFilter = brands.map((b: string) => `manufacturer=${encodeURIComponent(b)}`).join('|');
        filters.push(`(${brandFilter})`);
      }
    }

    if (sizeMin) {
      filters.push(`(screenSizeIn>=${sizeMin})`);
    }
    if (sizeMax) {
      filters.push(`(screenSizeIn<=${sizeMax})`);
    }
    if (priceMax) {
      filters.push(`(salePrice<=${priceMax})`);
    }

    const query = filters.join('&');
    const url = `https://api.bestbuy.com/v1/products(${query})?apiKey=${BESTBUY_API_KEY}&format=json&show=sku,name,manufacturer,modelNumber,salePrice,image,screenSizeIn,verticalResolution,horizontalResolution,refreshRate,panelTechnology,customerReviewAverage,customerReviewCount&pageSize=${pageSize}&page=${page}&sort=bestSellingRank.asc`;

    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('BestBuy API error:', errorText);
      return NextResponse.json({ error: 'BestBuy API error' }, { status: response.status });
    }

    const data = await response.json();

    // Map BestBuy response to our format
    const products = (data.products || []).map((p: Record<string, unknown>) => ({
      sku: String(p.sku || ''),
      name: String(p.name || ''),
      brand: String(p.manufacturer || ''),
      model_number: String(p.modelNumber || ''),
      price: Number(p.salePrice) || 0,
      image_url: String(p.image || ''),
      screen_size: Number(p.screenSizeIn) || 0,
      resolution: p.horizontalResolution && p.verticalResolution
        ? `${p.horizontalResolution}x${p.verticalResolution}`
        : '',
      refresh_rate: p.refreshRate ? `${p.refreshRate}Hz` : '',
      panel_type: String(p.panelTechnology || ''),
      rating: Number(p.customerReviewAverage) || 0,
      review_count: Number(p.customerReviewCount) || 0,
    }));

    return NextResponse.json({
      products,
      total: data.total || 0,
      page: data.currentPage || page,
    });
  } catch (error) {
    console.error('Error searching BestBuy:', error);
    return NextResponse.json({ error: 'Failed to search products' }, { status: 500 });
  }
}
