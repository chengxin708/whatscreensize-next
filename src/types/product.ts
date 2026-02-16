export interface BuyLink {
  retailer: string;
  url: string;
}

export interface TVProduct {
  id: number;
  size_inches: number;
  brand: string;
  model: string;
  panel_type: string;
  resolution: string;
  price_range: string;
  features: string[];
  image_url: string;
  link: string;
  buy_links: BuyLink[];
  year: number;
  sort_order: number;
}

export interface MonitorProduct {
  id: number;
  spec_key: string;
  brand: string;
  model: string;
  panel_type: string;
  refresh_rate: string;
  price_range: string;
  features: string[];
  tags: string[];
  image_url: string;
  link: string;
  buy_links: BuyLink[];
  year: number;
  sort_order: number;
}

export interface TVProductsBySize {
  [size: string]: TVProduct[];
}

export interface MonitorProductsBySpec {
  [specKey: string]: MonitorProduct[];
}

export interface User {
  id: number;
  email: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface StatsData {
  tv_total: number;
  monitor_total: number;
  tv_by_size: Record<string, number>;
  monitor_by_spec: Record<string, number>;
  recent_updates: Array<{
    type: string;
    brand: string;
    model: string;
    updated_at: string;
  }>;
}

export interface DiscoveryProduct {
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
  rating: number;
  review_count: number;
}

export interface DiscoverySearchResult {
  products: DiscoveryProduct[];
  total: number;
  page: number;
}

export interface DiscoveryImportResult {
  imported: number;
  failed: Array<{ sku: string; error: string }>;
}
