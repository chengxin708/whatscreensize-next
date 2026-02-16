'use client';

import { useState, useEffect, type FormEvent, type KeyboardEvent, use } from 'react';
import { useRouter } from 'next/navigation';
import type { TVProduct, BuyLink } from '@/types/product';

const TV_SIZES = [42, 48, 55, 65, 75, 77, 83, 85, 98, 100, 115];
const PANEL_TYPES = ['OLED', 'QD-OLED', 'Mini-LED', 'LED', 'MicroLED'];
const RESOLUTIONS = ['4K', '8K'];
const RETAILER_OPTIONS = ['Amazon', 'BestBuy', 'Walmart', 'Samsung', 'LG', 'Sony', 'Hisense', 'TCL', 'Other'];

interface FormData {
  size_inches: number;
  brand: string;
  model: string;
  panel_type: string;
  resolution: string;
  price_range: string;
  year: number;
  features: string[];
  image_url: string;
  link: string;
  buy_links: BuyLink[];
}

const initialFormData: FormData = {
  size_inches: TV_SIZES[0],
  brand: '',
  model: '',
  panel_type: PANEL_TYPES[0],
  resolution: RESOLUTIONS[0],
  price_range: '',
  year: new Date().getFullYear(),
  features: [],
  image_url: '',
  link: '',
  buy_links: [],
};

export default function TVProductFormPage({ params }: { params: Promise<{ action: string }> }) {
  const { action } = use(params);
  const router = useRouter();
  const isEdit = action !== 'new';
  const id = isEdit ? action : null;

  const [form, setForm] = useState<FormData>(initialFormData);
  const [featureInput, setFeatureInput] = useState('');
  const [buyLinkRetailer, setBuyLinkRetailer] = useState(RETAILER_OPTIONS[0]);
  const [buyLinkUrl, setBuyLinkUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function fetchProduct() {
      try {
        const res = await fetch(`/api/tv-products/${id}`);
        if (!res.ok) throw new Error('Failed to load product');
        const product: TVProduct = await res.json();
        if (!cancelled) {
          setForm({
            size_inches: product.size_inches,
            brand: product.brand,
            model: product.model,
            panel_type: product.panel_type,
            resolution: product.resolution,
            price_range: product.price_range,
            year: product.year,
            features: product.features || [],
            image_url: product.image_url,
            link: product.link,
            buy_links: product.buy_links || [],
          });
          if (product.image_url) setImagePreview(product.image_url.startsWith('/') ? product.image_url : `/${product.image_url}`);
          setFetching(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load product');
          setFetching(false);
        }
      }
    }

    fetchProduct();
    return () => { cancelled = true; };
  }, [id]);

  function updateField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleAddFeature(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = featureInput.trim();
      if (val && !form.features.includes(val)) {
        updateField('features', [...form.features, val]);
      }
      setFeatureInput('');
    }
  }

  function handleRemoveFeature(feature: string) {
    updateField(
      'features',
      form.features.filter((f) => f !== feature)
    );
  }

  function handleAddBuyLink() {
    const url = buyLinkUrl.trim();
    if (!url) return;
    const newLink: BuyLink = { retailer: buyLinkRetailer, url };
    updateField('buy_links', [...form.buy_links, newLink]);
    setBuyLinkUrl('');
  }

  function handleRemoveBuyLink(index: number) {
    updateField('buy_links', form.buy_links.filter((_, i) => i !== index));
  }

  async function handleImageUpload(file: File) {
    setUploading(true);
    try {
      const formData = new globalThis.FormData();
      formData.append('file', file);
      formData.append('type', 'tv');
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Upload failed');
      const result = await res.json();
      updateField('image_url', result.url);
      setImagePreview(result.url);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const url = isEdit ? `/api/tv-products/${id}` : '/api/tv-products';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Save failed');
      }
      router.push('/admin/tv-products');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <div
          className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: 'var(--glass-border)', borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="mb-6">
        <h1
          className="text-2xl font-heading font-semibold"
          style={{ color: 'var(--text-main)' }}
        >
          {isEdit ? 'Edit TV Product' : 'Add TV Product'}
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-dim)' }}>
          {isEdit ? 'Update product details below' : 'Fill in the product details below'}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div
          className="mb-6 px-4 py-3 rounded-lg text-sm"
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#fca5a5',
          }}
        >
          {error}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-xl p-6 flex flex-col gap-5"
        style={{
          background: 'var(--glass-surface)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid var(--glass-border)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {/* Row: Size + Year */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormField label="Screen Size">
            <select
              value={form.size_inches}
              onChange={(e) => updateField('size_inches', Number(e.target.value))}
              className="min-h-[44px] w-full px-3 rounded-lg text-sm outline-none"
              style={{
                background: 'var(--input-bg)',
                border: '1px solid var(--glass-border)',
                color: 'var(--text-main)',
              }}
            >
              {TV_SIZES.map((s) => (
                <option key={s} value={s}>
                  {s}&quot;
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Year">
            <input
              type="number"
              value={form.year}
              onChange={(e) => updateField('year', Number(e.target.value))}
              className="min-h-[44px] w-full px-3 rounded-lg text-sm outline-none"
              style={{
                background: 'var(--input-bg)',
                border: '1px solid var(--glass-border)',
                color: 'var(--text-main)',
              }}
            />
          </FormField>
        </div>

        {/* Row: Brand + Model */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormField label="Brand">
            <input
              type="text"
              required
              value={form.brand}
              onChange={(e) => updateField('brand', e.target.value)}
              placeholder="e.g. Samsung"
              className="min-h-[44px] w-full px-3 rounded-lg text-sm outline-none"
              style={{
                background: 'var(--input-bg)',
                border: '1px solid var(--glass-border)',
                color: 'var(--text-main)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#6366f1';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.15)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--glass-border)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </FormField>

          <FormField label="Model">
            <input
              type="text"
              required
              value={form.model}
              onChange={(e) => updateField('model', e.target.value)}
              placeholder="e.g. S95D"
              className="min-h-[44px] w-full px-3 rounded-lg text-sm outline-none"
              style={{
                background: 'var(--input-bg)',
                border: '1px solid var(--glass-border)',
                color: 'var(--text-main)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#6366f1';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.15)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--glass-border)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </FormField>
        </div>

        {/* Row: Panel Type + Resolution */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormField label="Panel Type">
            <select
              value={form.panel_type}
              onChange={(e) => updateField('panel_type', e.target.value)}
              className="min-h-[44px] w-full px-3 rounded-lg text-sm outline-none"
              style={{
                background: 'var(--input-bg)',
                border: '1px solid var(--glass-border)',
                color: 'var(--text-main)',
              }}
            >
              {PANEL_TYPES.map((pt) => (
                <option key={pt} value={pt}>
                  {pt}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Resolution">
            <select
              value={form.resolution}
              onChange={(e) => updateField('resolution', e.target.value)}
              className="min-h-[44px] w-full px-3 rounded-lg text-sm outline-none"
              style={{
                background: 'var(--input-bg)',
                border: '1px solid var(--glass-border)',
                color: 'var(--text-main)',
              }}
            >
              {RESOLUTIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        {/* Price Range */}
        <FormField label="Price Range">
          <input
            type="text"
            value={form.price_range}
            onChange={(e) => updateField('price_range', e.target.value)}
            placeholder="e.g. $1,299 - $1,499"
            className="min-h-[44px] w-full px-3 rounded-lg text-sm outline-none"
            style={{
              background: 'var(--input-bg)',
              border: '1px solid var(--glass-border)',
              color: 'var(--text-main)',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#6366f1';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.15)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--glass-border)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </FormField>

        {/* Features */}
        <FormField label="Features">
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              onKeyDown={handleAddFeature}
              placeholder="Type a feature and press Enter"
              className="min-h-[44px] w-full px-3 rounded-lg text-sm outline-none"
              style={{
                background: 'var(--input-bg)',
                border: '1px solid var(--glass-border)',
                color: 'var(--text-main)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#6366f1';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.15)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--glass-border)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            {form.features.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.features.map((feature) => (
                  <span
                    key={feature}
                    className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg"
                    style={{
                      background: 'rgba(99, 102, 241, 0.1)',
                      color: '#a5b4fc',
                      border: '1px solid rgba(99, 102, 241, 0.2)',
                    }}
                  >
                    {feature}
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(feature)}
                      className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                      aria-label={`Remove ${feature}`}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </FormField>

        {/* Image upload */}
        <FormField label="Product Image">
          <div className="flex flex-col gap-3">
            {imagePreview && (
              <div
                className="w-40 h-30 rounded-lg overflow-hidden"
                style={{ background: 'var(--input-bg)' }}
              >
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex items-center gap-3">
              <label
                className="min-h-[44px] px-4 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors duration-200 cursor-pointer"
                style={{
                  background: 'var(--input-bg)',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--text-muted)',
                }}
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    Choose File
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                />
              </label>
              {form.image_url && (
                <span
                  className="text-xs truncate max-w-[200px]"
                  style={{ color: 'var(--text-dim)' }}
                >
                  {form.image_url}
                </span>
              )}
            </div>
          </div>
        </FormField>

        {/* Link */}
        <FormField label="Product Link">
          <input
            type="url"
            value={form.link}
            onChange={(e) => updateField('link', e.target.value)}
            placeholder="https://..."
            className="min-h-[44px] w-full px-3 rounded-lg text-sm outline-none"
            style={{
              background: 'var(--input-bg)',
              border: '1px solid var(--glass-border)',
              color: 'var(--text-main)',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#6366f1';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.15)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--glass-border)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </FormField>

        {/* Buy Links */}
        <FormField label="Buy Links (Affiliate)">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <select
                value={buyLinkRetailer}
                onChange={(e) => setBuyLinkRetailer(e.target.value)}
                className="min-h-[44px] px-3 rounded-lg text-sm outline-none"
                style={{
                  background: 'var(--input-bg)',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--text-main)',
                }}
              >
                {RETAILER_OPTIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <input
                type="url"
                value={buyLinkUrl}
                onChange={(e) => setBuyLinkUrl(e.target.value)}
                placeholder="https://amazon.com/dp/xxx?tag=your-id"
                className="min-h-[44px] flex-1 px-3 rounded-lg text-sm outline-none"
                style={{
                  background: 'var(--input-bg)',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--text-main)',
                }}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddBuyLink(); } }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#6366f1';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.15)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--glass-border)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={handleAddBuyLink}
                className="min-h-[44px] px-4 rounded-lg text-sm font-medium text-white whitespace-nowrap cursor-pointer"
                style={{ background: '#059669' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#047857')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#059669')}
              >
                Add Link
              </button>
            </div>
            {form.buy_links.length > 0 && (
              <div className="flex flex-col gap-2">
                {form.buy_links.map((bl, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
                    style={{
                      background: 'rgba(5, 150, 105, 0.1)',
                      border: '1px solid rgba(5, 150, 105, 0.2)',
                    }}
                  >
                    <span
                      className="font-semibold text-xs px-2 py-0.5 rounded"
                      style={{ background: 'rgba(5, 150, 105, 0.2)', color: '#6ee7b7' }}
                    >
                      {bl.retailer}
                    </span>
                    <span
                      className="flex-1 truncate text-xs"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {bl.url}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveBuyLink(idx)}
                      className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                      aria-label="Remove link"
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fca5a5" strokeWidth="3" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </FormField>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="min-h-[44px] px-6 rounded-lg text-sm font-semibold text-white transition-all duration-200 flex items-center gap-2"
            style={{
              background: loading ? '#4f46e5' : '#6366f1',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.background = '#4f46e5';
            }}
            onMouseLeave={(e) => {
              if (!loading) e.currentTarget.style.background = '#6366f1';
            }}
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
          </button>

          <button
            type="button"
            onClick={() => router.push('/admin/tv-products')}
            className="min-h-[44px] px-6 rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer"
            style={{
              background: 'transparent',
              border: '1px solid var(--glass-border)',
              color: 'var(--text-muted)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--hover-bg)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

/* ---------- Sub-component ---------- */

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-sm font-medium"
        style={{ color: 'var(--text-muted)' }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}
