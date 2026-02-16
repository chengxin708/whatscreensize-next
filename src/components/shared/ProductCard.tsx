'use client';

import { useState } from 'react';
import { PanelTypeBadge } from '@/components/shared/PanelTypeBadge';
import type { BuyLink } from '@/types/product';

interface ProductCardProduct {
  brand: string;
  model: string;
  panel_type: string;
  price_range: string;
  features: string[];
  image_url: string;
  link: string;
  buy_links?: BuyLink[];
  refresh_rate?: string;
}

interface ProductCardProps {
  product: ProductCardProduct;
  viewDetailsText: string;
}

const RETAILER_COLORS: Record<string, { bg: string; hover: string }> = {
  Amazon: { bg: '#FF9900', hover: '#e68a00' },
  BestBuy: { bg: '#0046be', hover: '#003a9e' },
  Walmart: { bg: '#0071dc', hover: '#005bb5' },
  Samsung: { bg: '#1428a0', hover: '#0f1f80' },
  LG: { bg: '#a50034', hover: '#8a002b' },
  Sony: { bg: '#000000', hover: '#1a1a1a' },
  Hisense: { bg: '#00a551', hover: '#008a43' },
  TCL: { bg: '#e31937', hover: '#c0152e' },
};

const DEFAULT_COLOR = { bg: '#059669', hover: '#047857' };

function getRetailerColor(retailer: string) {
  return RETAILER_COLORS[retailer] || DEFAULT_COLOR;
}

function RetailerIcon({ retailer }: { retailer: string }) {
  const name = retailer.toLowerCase();

  if (name === 'amazon') {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.958 10.09c0 1.232.029 2.256-.591 3.351-.502.891-1.301 1.438-2.186 1.438-1.214 0-1.922-.924-1.922-2.292 0-2.692 2.415-3.182 4.7-3.182v.685zm3.186 7.705a.66.66 0 01-.753.077c-1.06-.881-1.25-1.289-1.834-2.128-1.753 1.788-2.994 2.323-5.267 2.323-2.69 0-4.78-1.659-4.78-4.981 0-2.594 1.406-4.36 3.41-5.222 1.735-.753 4.159-.891 6.024-1.099v-.411c0-.753.058-1.644-.384-2.294-.384-.58-1.117-.819-1.772-.819-1.205 0-2.277.618-2.54 1.897-.054.285-.261.566-.547.58l-3.065-.33c-.259-.058-.547-.266-.472-.662C5.994 1.676 9.122.5 11.932.5c1.407 0 3.246.375 4.353 1.436 1.407 1.313 1.273 3.065 1.273 4.97v4.5c0 1.354.563 1.946 1.09 2.677.187.261.228.578-.01.773-.592.493-1.647 1.415-2.227 1.93l-.007.008z"/>
        <path d="M21.727 18.865c-2.127 1.568-5.212 2.406-7.867 2.406-3.722 0-7.073-1.375-9.607-3.663-.199-.18-.022-.425.218-.286 2.737 1.592 6.122 2.55 9.617 2.55 2.358 0 4.95-.488 7.334-1.502.36-.154.662.237.305.495z"/>
        <path d="M22.584 17.924c-.271-.348-1.802-.165-2.49-.083-.209.024-.241-.157-.053-.289 1.22-.858 3.221-.61 3.455-.323.233.29-.061 2.294-1.207 3.251-.176.147-.344.069-.266-.126.258-.644.833-2.082.561-2.43z"/>
      </svg>
    );
  }

  if (name === 'bestbuy') {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M2 2h8v8H2V2zm12 0h8v8h-8V2zM2 14h8v8H2v-8zm12 0h8v8h-8v-8z"/>
      </svg>
    );
  }

  // Generic store icon for other retailers
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function PlaceholderSVG() {
  return (
    <svg
      viewBox="0 0 260 195"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <rect width="260" height="195" fill="var(--input-bg)" />
      <rect
        x="80"
        y="55"
        width="100"
        height="70"
        rx="4"
        stroke="var(--text-dim)"
        strokeWidth="2"
        fill="none"
      />
      <line
        x1="110"
        y1="130"
        x2="150"
        y2="130"
        stroke="var(--text-dim)"
        strokeWidth="2"
      />
      <line
        x1="130"
        y1="125"
        x2="130"
        y2="135"
        stroke="var(--text-dim)"
        strokeWidth="2"
      />
    </svg>
  );
}

export function ProductCard({ product, viewDetailsText }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);

  const buyLinks = product.buy_links ?? [];
  const hasBuyLinks = buyLinks.length > 0;

  return (
    <div
      className="w-[260px] shrink-0 rounded-2xl overflow-hidden"
      style={{
        scrollSnapAlign: 'start',
        background: 'var(--glass-surface)',
        border: '1px solid var(--glass-border)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Image area - 4:3 aspect ratio */}
      <div className="relative w-full" style={{ aspectRatio: '4 / 3' }}>
        {product.image_url && !imgError ? (
          <img
            src={product.image_url.startsWith('/') ? product.image_url : `/${product.image_url}`}
            alt={`${product.brand} ${product.model}`}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <PlaceholderSVG />
        )}
      </div>

      {/* Card body */}
      <div className="p-4 flex flex-col gap-2">
        {/* Panel type badge */}
        <div className="flex items-center gap-2">
          <PanelTypeBadge type={product.panel_type} />
          {product.refresh_rate && (
            <span
              className="text-xs"
              style={{ color: 'var(--text-dim)' }}
            >
              {product.refresh_rate}
            </span>
          )}
        </div>

        {/* Price */}
        <p
          className="text-sm font-medium"
          style={{ color: 'var(--color-secondary, #ec4899)' }}
        >
          {product.price_range}
        </p>

        {/* Product name */}
        <h3
          className="text-sm font-heading font-semibold leading-snug"
          style={{ color: 'var(--text-main)' }}
        >
          {product.brand} {product.model}
        </h3>

        {/* Features as chips */}
        <div className="flex flex-wrap gap-1.5 mt-1">
          {product.features.map((feature) => (
            <span
              key={feature}
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: 'var(--hover-bg)',
                color: 'var(--text-muted)',
              }}
            >
              {feature}
            </span>
          ))}
        </div>

        {/* Buy links or fallback View Details */}
        {hasBuyLinks ? (
          <div className="flex flex-wrap gap-2 mt-2">
            {buyLinks.map((bl) => {
              const colors = getRetailerColor(bl.retailer);
              return (
                <a
                  key={`${bl.retailer}-${bl.url}`}
                  href={bl.url}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all duration-150"
                  style={{ background: colors.bg }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = colors.hover)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = colors.bg)}
                >
                  <RetailerIcon retailer={bl.retailer} />
                  {bl.retailer}
                </a>
              );
            })}
          </div>
        ) : product.link ? (
          <a
            href={product.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium mt-2 inline-block transition-opacity duration-150 hover:opacity-80"
            style={{ color: 'var(--color-primary)' }}
          >
            {viewDetailsText}
          </a>
        ) : null}
      </div>
    </div>
  );
}
