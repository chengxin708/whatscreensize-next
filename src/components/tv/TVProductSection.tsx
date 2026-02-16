import type { TVProduct } from '@/types/product';
import type { TranslationKeys } from '@/types/i18n';
import { ProductCard } from '@/components/shared/ProductCard';

interface TVProductSectionProps {
  size: number;
  products: TVProduct[];
  label: string;
  t: TranslationKeys;
}

export function TVProductSection({ size, products, label, t }: TVProductSectionProps) {
  if (products.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3
        className="font-heading font-semibold text-base"
        style={{ color: 'var(--text-main)' }}
      >
        {size}" {t.tvProductsTitle} ({label})
      </h3>

      <div className="product-scroll">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            viewDetailsText={t.productViewDetails}
          />
        ))}
      </div>
    </div>
  );
}
