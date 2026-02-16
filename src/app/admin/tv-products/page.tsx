'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { TVProduct, TVProductsBySize } from '@/types/product';

const TV_SIZES = ['42', '48', '55', '65', '75', '77', '83', '85', '98', '100', '115'];

export default function TVProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<TVProductsBySize>({});
  const [activeTab, setActiveTab] = useState(TV_SIZES[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/tv-products');
      if (!res.ok) throw new Error('Failed to load products');
      const data = await res.json();
      setProducts(data.products);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const currentProducts: TVProduct[] = products[activeTab] || [];

  async function handleDelete(id: number) {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`/api/tv-products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      await fetchProducts();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    }
  }

  async function handleMoveUp(index: number) {
    if (index === 0) return;
    const items = [...currentProducts];
    [items[index - 1], items[index]] = [items[index], items[index - 1]];
    const reordered = items.map((item, i) => ({ id: item.id, sort_order: i }));

    try {
      const res = await fetch('/api/tv-products/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reordered),
      });
      if (!res.ok) throw new Error('Reorder failed');
      await fetchProducts();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Reorder failed');
    }
  }

  async function handleMoveDown(index: number) {
    if (index >= currentProducts.length - 1) return;
    const items = [...currentProducts];
    [items[index], items[index + 1]] = [items[index + 1], items[index]];
    const reordered = items.map((item, i) => ({ id: item.id, sort_order: i }));

    try {
      const res = await fetch('/api/tv-products/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reordered),
      });
      if (!res.ok) throw new Error('Reorder failed');
      await fetchProducts();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Reorder failed');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div
          className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: 'var(--glass-border)', borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="rounded-xl px-5 py-4 text-sm"
        style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          color: '#fca5a5',
        }}
      >
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-heading font-semibold"
            style={{ color: 'var(--text-main)' }}
          >
            TV Products
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-dim)' }}>
            Manage TV product listings by screen size
          </p>
        </div>
        <button
          onClick={() => router.push('/admin/tv-products/new')}
          className="min-h-[44px] px-5 rounded-lg text-sm font-semibold text-white transition-colors duration-200 flex items-center gap-2 self-start cursor-pointer"
          style={{ background: '#6366f1' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#4f46e5')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#6366f1')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Product
        </button>
      </div>

      {/* Vertical tabs + Product table */}
      <div className="flex gap-4">
        {/* Vertical size tabs */}
        <div
          className="flex flex-col gap-1 shrink-0 w-[100px] rounded-xl p-2 self-start"
          style={{
            background: 'var(--glass-surface)',
            border: '1px solid var(--glass-border)',
          }}
        >
          {TV_SIZES.map((size) => {
            const count = (products[size] || []).length;
            return (
              <button
                key={size}
                onClick={() => setActiveTab(size)}
                className="min-h-[36px] px-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-between gap-1 cursor-pointer"
                style={{
                  background:
                    activeTab === size
                      ? 'rgba(99, 102, 241, 0.15)'
                      : 'transparent',
                  color:
                    activeTab === size ? '#818cf8' : 'var(--text-muted)',
                  border:
                    activeTab === size
                      ? '1px solid rgba(99, 102, 241, 0.3)'
                      : '1px solid transparent',
                }}
              >
                {size}&quot;
                <span
                  className="text-xs px-1.5 py-0.5 rounded-full"
                  style={{
                    background:
                      activeTab === size
                        ? 'rgba(99, 102, 241, 0.2)'
                        : 'var(--input-bg)',
                    color:
                      activeTab === size ? '#a5b4fc' : 'var(--text-dim)',
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Product table */}
        <div
          className="rounded-xl overflow-hidden flex-1 min-w-0"
          style={{
            background: 'var(--glass-surface)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid var(--glass-border)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          {currentProducts.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm" style={{ color: 'var(--text-dim)' }}>
                No products for {activeTab}&quot; TVs yet.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <Th>Image</Th>
                    <Th>Brand</Th>
                    <Th>Model</Th>
                    <Th>Panel</Th>
                    <Th>Resolution</Th>
                    <Th>Price</Th>
                    <Th>Year</Th>
                    <Th align="right">Actions</Th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.map((product, index) => (
                    <tr
                      key={product.id}
                      className="transition-colors duration-150"
                      style={{ borderBottom: '1px solid var(--glass-border)' }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = 'var(--hover-bg)')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = 'transparent')
                      }
                    >
                      <td className="px-4 py-3">
                        <div
                          className="w-16 h-12 rounded-md overflow-hidden flex items-center justify-center"
                          style={{ background: 'var(--input-bg)' }}
                        >
                          {product.image_url ? (
                            <img
                              src={product.image_url.startsWith('/') ? product.image_url : `/${product.image_url}`}
                              alt={`${product.brand} ${product.model}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" strokeWidth="1.5">
                              <rect x="3" y="3" width="18" height="18" rx="2" />
                              <circle cx="8.5" cy="8.5" r="1.5" />
                              <path d="M21 15l-5-5L5 21" />
                            </svg>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium" style={{ color: 'var(--text-main)' }}>
                        {product.brand}
                      </td>
                      <td className="px-4 py-3" style={{ color: 'var(--text-muted)' }}>
                        {product.model}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="text-xs font-medium px-2 py-1 rounded"
                          style={{
                            background: 'rgba(99, 102, 241, 0.1)',
                            color: '#a5b4fc',
                          }}
                        >
                          {product.panel_type}
                        </span>
                      </td>
                      <td className="px-4 py-3" style={{ color: 'var(--text-muted)' }}>
                        {product.resolution}
                      </td>
                      <td className="px-4 py-3" style={{ color: 'var(--text-muted)' }}>
                        {product.price_range}
                      </td>
                      <td className="px-4 py-3" style={{ color: 'var(--text-muted)' }}>
                        {product.year}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {/* Move up */}
                          <ActionBtn
                            label="Move up"
                            disabled={index === 0}
                            onClick={() => handleMoveUp(index)}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                              <polyline points="18 15 12 9 6 15" />
                            </svg>
                          </ActionBtn>
                          {/* Move down */}
                          <ActionBtn
                            label="Move down"
                            disabled={index === currentProducts.length - 1}
                            onClick={() => handleMoveDown(index)}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                              <polyline points="6 9 12 15 18 9" />
                            </svg>
                          </ActionBtn>
                          {/* Edit */}
                          <ActionBtn
                            label="Edit"
                            onClick={() =>
                              router.push(`/admin/tv-products/${product.id}`)
                            }
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </ActionBtn>
                          {/* Delete */}
                          <ActionBtn
                            label="Delete"
                            danger
                            onClick={() => handleDelete(product.id)}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          </ActionBtn>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Sub-components ---------- */

function Th({
  children,
  align = 'left',
}: {
  children: React.ReactNode;
  align?: 'left' | 'right';
}) {
  return (
    <th
      className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider ${
        align === 'right' ? 'text-right' : 'text-left'
      }`}
      style={{ color: 'var(--text-dim)' }}
    >
      {children}
    </th>
  );
}

function ActionBtn({
  children,
  label,
  danger,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  danger?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg transition-colors duration-150"
      style={{
        color: danger ? '#f87171' : 'var(--text-muted)',
        opacity: disabled ? 0.3 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.background = danger
            ? 'rgba(239, 68, 68, 0.1)'
            : 'var(--hover-bg)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
      }}
    >
      {children}
    </button>
  );
}
