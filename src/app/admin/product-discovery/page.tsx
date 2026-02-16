'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { DiscoveryProduct, DiscoverySearchResult, DiscoveryImportResult } from '@/types/product';

type ProductType = 'tv' | 'monitor';

interface Filters {
  brand: string;
  sizeMin: string;
  sizeMax: string;
  priceMax: string;
}

interface ImportProduct extends DiscoveryProduct {
  size_inches: number;
  spec_key: string;
  features: string[];
  tags: string[];
  year: number;
}

const TV_SIZES = ['42', '48', '55', '65', '75', '77', '83', '85', '98', '100', '115'];

export default function ProductDiscoveryPage() {
  const router = useRouter();

  // Search state
  const [searchType, setSearchType] = useState<ProductType>('tv');
  const [filters, setFilters] = useState<Filters>({ brand: '', sizeMin: '', sizeMax: '', priceMax: '' });
  const [results, setResults] = useState<DiscoveryProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Selection state
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Import modal state
  const [showImportModal, setShowImportModal] = useState(false);
  const [importProducts, setImportProducts] = useState<ImportProduct[]>([]);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState('');

  const pageSize = 24;
  const totalPages = Math.ceil(total / pageSize);

  async function handleSearch(newPage = 1) {
    setSearching(true);
    setSearchError('');
    setPage(newPage);

    try {
      const res = await fetch('/api/discovery/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: searchType,
          brand: filters.brand || undefined,
          sizeMin: filters.sizeMin ? parseInt(filters.sizeMin) : undefined,
          sizeMax: filters.sizeMax ? parseInt(filters.sizeMax) : undefined,
          priceMax: filters.priceMax ? parseFloat(filters.priceMax) : undefined,
          page: newPage,
        }),
      });
      if (!res.ok) throw new Error('Search failed');
      const data: DiscoverySearchResult = await res.json();
      setResults(data.products);
      setTotal(data.total);
      setHasSearched(true);
      if (newPage === 1) setSelected(new Set());
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
      setTotal(0);
    } finally {
      setSearching(false);
    }
  }

  function toggleSelect(sku: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(sku)) {
        next.delete(sku);
      } else {
        next.add(sku);
      }
      return next;
    });
  }

  function selectAll() {
    if (selected.size === results.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(results.map((p) => p.sku)));
    }
  }

  function openImportModal() {
    const selectedProducts = results
      .filter((p) => selected.has(p.sku))
      .map((p) => ({
        ...p,
        size_inches: Math.round(p.screen_size),
        spec_key: '',
        features: [] as string[],
        tags: [] as string[],
        year: new Date().getFullYear(),
      }));
    setImportProducts(selectedProducts);
    setImportError('');
    setShowImportModal(true);
  }

  function updateImportProduct(index: number, updates: Partial<ImportProduct>) {
    setImportProducts((prev) =>
      prev.map((p, i) => (i === index ? { ...p, ...updates } : p)),
    );
  }

  async function handleImport() {
    setImporting(true);
    setImportError('');

    try {
      const payload = importProducts.map((p) => ({
        sku: p.sku,
        name: p.name,
        brand: p.brand,
        model_number: p.model_number,
        price: p.price,
        image_url: p.image_url,
        screen_size: p.screen_size,
        resolution: p.resolution,
        refresh_rate: p.refresh_rate,
        panel_type: p.panel_type,
        size_inches: p.size_inches,
        spec_key: p.spec_key,
        features: p.features,
        tags: p.tags,
        year: p.year,
      }));

      const res = await fetch('/api/discovery/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: searchType,
          products: payload,
        }),
      });
      if (!res.ok) throw new Error('Import failed');
      const data: DiscoveryImportResult = await res.json();

      setShowImportModal(false);

      if (data.failed.length > 0) {
        alert(
          `Imported ${data.imported} product(s). ${data.failed.length} failed:\n` +
            data.failed.map((f) => `${f.sku}: ${f.error}`).join('\n'),
        );
      }

      if (data.imported > 0) {
        router.push(searchType === 'tv' ? '/admin/tv-products' : '/admin/monitor-products');
      }
    } catch (err) {
      setImportError(err instanceof Error ? err.message : 'Import failed');
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading font-semibold" style={{ color: 'var(--text-main)' }}>
          Product Discovery
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-dim)' }}>
          Search BestBuy for TV &amp; Monitor products and import them to your database
        </p>
      </div>

      {/* Search Panel */}
      <div
        className="rounded-xl p-5 flex flex-col gap-4"
        style={{
          background: 'var(--glass-surface)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid var(--glass-border)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {/* Type toggle */}
        <div className="flex items-center gap-2">
          {(['tv', 'monitor'] as ProductType[]).map((type) => (
            <button
              key={type}
              onClick={() => {
                setSearchType(type);
                setResults([]);
                setSelected(new Set());
                setHasSearched(false);
                setTotal(0);
              }}
              className="min-h-[40px] px-5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer"
              style={{
                background: searchType === type ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                color: searchType === type ? '#818cf8' : 'var(--text-muted)',
                border: searchType === type ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid var(--glass-border)',
              }}
            >
              {type === 'tv' ? 'TV' : 'Monitor'}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <FilterInput
            label="Brand"
            placeholder="e.g. Samsung, LG, Sony"
            value={filters.brand}
            onChange={(v) => setFilters((f) => ({ ...f, brand: v }))}
          />
          <FilterInput
            label="Min Size (inches)"
            placeholder="e.g. 55"
            type="number"
            value={filters.sizeMin}
            onChange={(v) => setFilters((f) => ({ ...f, sizeMin: v }))}
          />
          <FilterInput
            label="Max Size (inches)"
            placeholder="e.g. 85"
            type="number"
            value={filters.sizeMax}
            onChange={(v) => setFilters((f) => ({ ...f, sizeMax: v }))}
          />
          <FilterInput
            label="Max Price ($)"
            placeholder="e.g. 2000"
            type="number"
            value={filters.priceMax}
            onChange={(v) => setFilters((f) => ({ ...f, priceMax: v }))}
          />
        </div>

        {/* Search button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSearch(1)}
            disabled={searching}
            className="min-h-[44px] px-6 rounded-lg text-sm font-semibold text-white transition-colors duration-200 flex items-center gap-2 cursor-pointer"
            style={{ background: searching ? '#4338ca' : '#6366f1', opacity: searching ? 0.7 : 1 }}
            onMouseEnter={(e) => { if (!searching) e.currentTarget.style.background = '#4f46e5'; }}
            onMouseLeave={(e) => { if (!searching) e.currentTarget.style.background = '#6366f1'; }}
          >
            {searching ? (
              <div
                className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'transparent' }}
              />
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            )}
            {searching ? 'Searching...' : 'Search BestBuy'}
          </button>
        </div>

        {searchError && (
          <div
            className="rounded-lg px-4 py-3 text-sm"
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#fca5a5',
            }}
          >
            {searchError}
          </div>
        )}
      </div>

      {/* Results */}
      {hasSearched && (
        <>
          {/* Results header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {total === 0
                  ? 'No results found'
                  : `Showing ${results.length} of ${total} results`}
              </p>
              {results.length > 0 && (
                <button
                  onClick={selectAll}
                  className="text-xs font-medium px-3 py-1.5 rounded-md transition-colors duration-150 cursor-pointer"
                  style={{
                    background: 'rgba(99, 102, 241, 0.1)',
                    color: '#a5b4fc',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                  }}
                >
                  {selected.size === results.length ? 'Deselect All' : 'Select All'}
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <PaginationBtn disabled={page <= 1} onClick={() => handleSearch(page - 1)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </PaginationBtn>
                  <span className="text-xs px-2" style={{ color: 'var(--text-muted)' }}>
                    {page} / {totalPages}
                  </span>
                  <PaginationBtn disabled={page >= totalPages} onClick={() => handleSearch(page + 1)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </PaginationBtn>
                </div>
              )}

              {selected.size > 0 && (
                <button
                  onClick={openImportModal}
                  className="min-h-[40px] px-5 rounded-lg text-sm font-semibold text-white transition-colors duration-200 flex items-center gap-2 cursor-pointer"
                  style={{ background: '#059669' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#047857')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#059669')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Import {selected.size} Selected
                </button>
              )}
            </div>
          </div>

          {/* Product cards grid */}
          {results.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {results.map((product) => (
                <ProductCard
                  key={product.sku}
                  product={product}
                  isSelected={selected.has(product.sku)}
                  onToggle={() => toggleSelect(product.sku)}
                />
              ))}
            </div>
          )}

          {/* Empty state */}
          {results.length === 0 && (
            <div
              className="rounded-xl px-6 py-16 text-center"
              style={{
                background: 'var(--glass-surface)',
                border: '1px solid var(--glass-border)',
              }}
            >
              <svg className="mx-auto mb-4" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <p className="text-sm" style={{ color: 'var(--text-dim)' }}>
                No products found. Try adjusting your filters.
              </p>
            </div>
          )}

          {/* Bottom pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <div className="flex items-center gap-1">
                <PaginationBtn disabled={page <= 1} onClick={() => handleSearch(page - 1)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </PaginationBtn>
                <span className="text-sm px-3" style={{ color: 'var(--text-muted)' }}>
                  Page {page} of {totalPages}
                </span>
                <PaginationBtn disabled={page >= totalPages} onClick={() => handleSearch(page + 1)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </PaginationBtn>
              </div>
            </div>
          )}
        </>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <ImportModal
          type={searchType}
          products={importProducts}
          onUpdate={updateImportProduct}
          onConfirm={handleImport}
          onCancel={() => setShowImportModal(false)}
          importing={importing}
          error={importError}
        />
      )}
    </div>
  );
}

/* ---------- Sub-components ---------- */

function FilterInput({ label, placeholder, value, onChange, type = 'text' }: { label: string; placeholder: string; value: string; onChange: (value: string) => void; type?: string; }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium" style={{ color: 'var(--text-dim)' }}>{label}</label>
      <input type={type} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} className="min-h-[40px] px-3 rounded-lg text-sm outline-none transition-colors duration-200" style={{ background: 'var(--input-bg)', color: 'var(--text-main)', border: '1px solid var(--glass-border)' }} onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.5)')} onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--glass-border)')} />
    </div>
  );
}

function ProductCard({ product, isSelected, onToggle }: { product: DiscoveryProduct; isSelected: boolean; onToggle: () => void; }) {
  return (
    <div className="rounded-xl overflow-hidden cursor-pointer transition-all duration-200" onClick={onToggle} style={{ background: 'var(--glass-surface)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: isSelected ? '2px solid #6366f1' : '1px solid var(--glass-border)', boxShadow: isSelected ? '0 0 0 1px rgba(99, 102, 241, 0.3)' : 'var(--shadow-sm)' }}>
      <div className="relative">
        <div className="w-full aspect-[4/3] flex items-center justify-center overflow-hidden" style={{ background: 'rgba(0,0,0,0.2)' }}>
          {product.image_url ? (<img src={product.image_url} alt={product.name} className="w-full h-full object-contain p-2" loading="lazy" />) : (<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>)}
        </div>
        <div className="absolute top-2 left-2">
          <div className="w-6 h-6 rounded-md flex items-center justify-center transition-colors duration-150" style={{ background: isSelected ? '#6366f1' : 'rgba(0,0,0,0.5)', border: isSelected ? 'none' : '1.5px solid rgba(255,255,255,0.3)' }}>
            {isSelected && (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>)}
          </div>
        </div>
        <div className="absolute top-2 right-2 px-2 py-1 rounded-md text-xs font-semibold" style={{ background: 'rgba(0,0,0,0.7)', color: '#10b981' }}>${product.price.toLocaleString()}</div>
      </div>
      <div className="p-3 flex flex-col gap-1.5">
        <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#818cf8' }}>{product.brand}</div>
        <div className="text-sm font-medium leading-tight line-clamp-2" style={{ color: 'var(--text-main)' }} title={product.name}>{product.name}</div>
        <div className="flex flex-wrap gap-1.5 mt-1">
          {product.screen_size > 0 && <SpecBadge>{product.screen_size}&quot;</SpecBadge>}
          {product.resolution && <SpecBadge>{product.resolution}</SpecBadge>}
          {product.panel_type && <SpecBadge>{product.panel_type}</SpecBadge>}
          {product.refresh_rate && <SpecBadge>{product.refresh_rate}</SpecBadge>}
        </div>
        {product.rating > 0 && (
          <div className="flex items-center gap-1.5 mt-1">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (<svg key={star} width="12" height="12" viewBox="0 0 24 24" fill={star <= Math.round(product.rating) ? '#f59e0b' : 'none'} stroke="#f59e0b" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>))}
            </div>
            <span className="text-xs" style={{ color: 'var(--text-dim)' }}>{product.rating.toFixed(1)}{product.review_count > 0 && ` (${product.review_count})`}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function SpecBadge({ children }: { children: React.ReactNode }) {
  return <span className="text-[11px] font-medium px-1.5 py-0.5 rounded" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#a5b4fc' }}>{children}</span>;
}

function PaginationBtn({ children, disabled, onClick }: { children: React.ReactNode; disabled: boolean; onClick: () => void; }) {
  return <button onClick={onClick} disabled={disabled} className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg transition-colors duration-150" style={{ background: 'var(--glass-surface)', border: '1px solid var(--glass-border)', color: disabled ? 'var(--text-dim)' : 'var(--text-muted)', opacity: disabled ? 0.4 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}>{children}</button>;
}

function ImportModal({ type, products, onUpdate, onConfirm, onCancel, importing, error }: { type: ProductType; products: ImportProduct[]; onUpdate: (index: number, updates: Partial<ImportProduct>) => void; onConfirm: () => void; onCancel: () => void; importing: boolean; error: string; }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={(e) => { if (e.target === e.currentTarget && !importing) onCancel(); }}>
      <div className="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl overflow-hidden" style={{ background: 'rgba(15, 20, 40, 0.95)', border: '1px solid var(--glass-border)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
        <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--glass-border)' }}>
          <div>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-main)' }}>Import {products.length} Product{products.length > 1 ? 's' : ''}</h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-dim)' }}>Review and adjust details before importing</p>
          </div>
          <button onClick={onCancel} disabled={importing} className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg transition-colors duration-150 hover:bg-white/5 cursor-pointer" style={{ color: 'var(--text-dim)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
          {products.map((product, index) => (
            <div key={product.sku} className="rounded-xl p-4 flex flex-col gap-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)' }}>
              <div className="flex items-start gap-3">
                <div className="w-16 h-12 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.2)' }}>
                  {product.image_url && <img src={product.image_url} alt={product.name} className="w-full h-full object-contain" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate" style={{ color: 'var(--text-main)' }}>{product.brand} -- {product.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-dim)' }}>SKU: {product.sku} | ${product.price.toLocaleString()}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <ModalInput label="Year" type="number" value={String(product.year)} onChange={(v) => onUpdate(index, { year: parseInt(v) || new Date().getFullYear() })} />
                {type === 'tv' ? (
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium" style={{ color: 'var(--text-dim)' }}>Size (inches)</label>
                    <select value={String(product.size_inches)} onChange={(e) => onUpdate(index, { size_inches: parseInt(e.target.value) })} className="min-h-[38px] px-3 rounded-lg text-sm outline-none" style={{ background: 'var(--input-bg)', color: 'var(--text-main)', border: '1px solid var(--glass-border)' }}>
                      {TV_SIZES.map((s) => <option key={s} value={s}>{s}&quot;</option>)}
                    </select>
                  </div>
                ) : (
                  <ModalInput label="Spec Key (e.g. 27-2560x1440)" value={product.spec_key} onChange={(v) => onUpdate(index, { spec_key: v })} placeholder={`${Math.round(product.screen_size)}-${product.resolution.replace(/\s+/g, '')}`} />
                )}
              </div>
              <TagInput label="Features" placeholder="Type and press Enter" tags={product.features} onChange={(features) => onUpdate(index, { features })} />
              {type === 'monitor' && (
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium" style={{ color: 'var(--text-dim)' }}>Tags</label>
                  <div className="flex items-center gap-3">
                    {['gaming', 'productivity'].map((tag) => (
                      <label key={tag} className="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" checked={product.tags.includes(tag)} onChange={(e) => { const newTags = e.target.checked ? [...product.tags, tag] : product.tags.filter((t) => t !== tag); onUpdate(index, { tags: newTags }); }} className="accent-indigo-500" />
                        <span className="text-sm capitalize" style={{ color: 'var(--text-muted)' }}>{tag}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="px-6 py-4 flex items-center justify-between gap-3" style={{ borderTop: '1px solid var(--glass-border)' }}>
          {error && <p className="text-xs" style={{ color: '#fca5a5' }}>{error}</p>}
          <div className="flex items-center gap-2 ml-auto">
            <button onClick={onCancel} disabled={importing} className="min-h-[40px] px-4 rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-white/5 cursor-pointer" style={{ color: 'var(--text-muted)', border: '1px solid var(--glass-border)' }}>Cancel</button>
            <button onClick={onConfirm} disabled={importing} className="min-h-[40px] px-5 rounded-lg text-sm font-semibold text-white transition-colors duration-200 flex items-center gap-2 cursor-pointer" style={{ background: importing ? '#047857' : '#059669', opacity: importing ? 0.7 : 1 }} onMouseEnter={(e) => { if (!importing) e.currentTarget.style.background = '#047857'; }} onMouseLeave={(e) => { if (!importing) e.currentTarget.style.background = '#059669'; }}>
              {importing ? (<><div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'transparent' }} />Importing...</>) : (<><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>Confirm Import</>)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModalInput({ label, value, onChange, placeholder, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; type?: string; }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium" style={{ color: 'var(--text-dim)' }}>{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="min-h-[38px] px-3 rounded-lg text-sm outline-none transition-colors duration-200" style={{ background: 'var(--input-bg)', color: 'var(--text-main)', border: '1px solid var(--glass-border)' }} onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.5)')} onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--glass-border)')} />
    </div>
  );
}

function TagInput({ label, placeholder, tags, onChange }: { label: string; placeholder: string; tags: string[]; onChange: (tags: string[]) => void; }) {
  const [input, setInput] = useState('');
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') { e.preventDefault(); const value = input.trim(); if (value && !tags.includes(value)) { onChange([...tags, value]); } setInput(''); }
  }
  function removeTag(tag: string) { onChange(tags.filter((t) => t !== tag)); }
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium" style={{ color: 'var(--text-dim)' }}>{label}</label>
      <div className="flex flex-wrap items-center gap-1.5">
        {tags.map((tag) => (<span key={tag} className="flex items-center gap-1 text-xs font-medium pl-2 pr-1 py-1 rounded-md" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc' }}>{tag}<button type="button" onClick={() => removeTag(tag)} className="w-4 h-4 flex items-center justify-center rounded hover:bg-white/10 cursor-pointer"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></button></span>))}
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder={tags.length === 0 ? placeholder : ''} className="min-h-[32px] min-w-[120px] flex-1 px-2 rounded text-sm outline-none bg-transparent" style={{ color: 'var(--text-main)' }} />
      </div>
    </div>
  );
}
