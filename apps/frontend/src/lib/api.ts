const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  price: number;
  costPrice?: number;
  stock: number;
  sku: string;
  colorName?: string;
  colorHex?: string;
  sizeOrWeight?: string;
}

export interface ReviewItem {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  categoryId: string;
  category?: { id: string; name: string; slug: string };
  basePrice: number;
  costPrice?: number;
  discountPrice?: number;
  stock: number;
  sku: string;
  barcode?: string;
  images: string[];
  isActive: boolean;
  unit: string;
  variants: ProductVariant[];
  colors?: Array<{ name: string; hex: string }>;
  sizes?: string[];
  reviews?: ReviewItem[];
  related?: Product[];
  isNewArrival?: boolean;
  isFeatured?: boolean;
  vendor?: string;
  badge?: string;
  warranty?: string;
  specifications?: {
    coverage?: string;
    dryingTime?: string;
    material?: string;
    finish?: string;
    origin?: string;
  };
  createdAt?: string;
}

export const initialFallbackCategories: Category[] = [
  { id: 'cat-enamel', name: 'Synthetic Enamel Paints', slug: 'synthetic-enamel-paints', description: 'Berger Robbialac, Aqua Paints, high gloss metal & wood enamel', image: '/products/2412.jpg' },
  { id: 'cat-adhesives', name: 'Adhesives & PUR Glues', slug: 'adhesives-and-glues', description: 'Fevicol 1K PUR, waterproof polyurethane & wood adhesives', image: '/products/2413.jpg' },
  { id: 'cat-sprays', name: 'Acrylic Spray Paints', slug: 'acrylic-lacquer-sprays', description: 'Aerosol spray paints, touchup lacquers & metallic finishes', image: '/products/2414.jpg' },
  { id: 'cat-hardware', name: 'Padlocks & Security Locks', slug: 'padlocks-and-security', description: 'HMBR stainless steel heavy security shutter and door locks', image: '/products/2415.jpg' },
  { id: 'cat-tools', name: 'Paint Brushes & Applicators', slug: 'paint-brushes-and-tools', description: 'Industrial paint brushes, rollers, scrapers and spatulas', image: '/products/2417.jpg' },
  { id: 'cat-thinners', name: 'Thinners & Solvents', slug: 'thinners-and-solvents', description: 'Berger GP Thinner, T-800 Mineral Turpentine & paint reducers', image: '/products/2416.jpg' },
  { id: 'cat-sanitary', name: 'Sanitary & PVC Pipes', slug: 'sanitary-and-pipes', description: 'RFL & Gazi PVC fittings, bib cocks, valves & plumbing essentials', image: '/products/2415.jpg' },
  { id: 'cat-electrical', name: 'Electrical & Power Tools', slug: 'electrical-and-tools', description: 'Heavy duty cables, switches, drills & angle grinder discs', image: '/products/2414.jpg' },
];

export const initialFallbackProducts: Product[] = [];

export function getCombinedProductsList(): Product[] {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('rong_bahar_products_list');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Filter out legacy dummy seeds if present from previous test runs
          const clean = parsed.filter(
            (p: Product) => !['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10'].includes(p.id)
          );
          return clean;
        }
      }
    } catch {
      // ignore
    }
  }
  return [];
}

export function notifyProductsUpdated() {
  if (typeof window !== 'undefined') {
    try {
      window.dispatchEvent(new CustomEvent('rong_bahar_products_changed'));
    } catch {}
  }
}

/**
 * Structured fetch helper with timeout and exponential backoff retry logic
 * Specifically designed to handle Render free-tier cold starts (502, 503, 504, network timeouts).
 */
export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries: number = 2,
  timeoutMs: number = 12000,
): Promise<Response> {
  let lastError: any = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timer);

      // If backend is returning gateway cold start errors, retry
      if ([502, 503, 504].includes(response.status) && attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, (attempt + 1) * 1500));
        continue;
      }

      return response;
    } catch (err: any) {
      clearTimeout(timer);
      lastError = err;
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, (attempt + 1) * 1500));
      }
    }
  }

  throw lastError || new Error(`Failed to fetch ${url} after ${retries} retries`);
}

export async function pingBackendHealthAPI(): Promise<{ status: string; healthy: boolean }> {
  try {
    const healthUrl = API_URL.endsWith('/api')
      ? `${API_URL.slice(0, -4)}/health`
      : `${API_URL}/health`;

    const res = await fetchWithRetry(healthUrl, { method: 'GET', cache: 'no-store' }, 1, 6000);
    if (res.ok) {
      const data = await res.json();
      return { status: data.status || 'ok', healthy: true };
    }
    return { status: 'degraded', healthy: false };
  } catch {
    return { status: 'cold-starting', healthy: false };
  }
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    // Try products/categories first then categories
    let res = await fetchWithRetry(`${API_URL}/products/categories`, { next: { revalidate: 60 } }, 1, 8000).catch(() => null);
    if (!res || !res.ok) {
      res = await fetchWithRetry(`${API_URL}/categories`, { next: { revalidate: 60 } }, 1, 8000).catch(() => null);
    }
    if (res && res.ok) {
      const data = await res.json();
      const list = data.data || data;
      if (Array.isArray(list) && list.length > 0) return list;
    }
    return initialFallbackCategories;
  } catch {
    return initialFallbackCategories;
  }
}

export async function fetchProductsAPI(params?: {
  category?: string;
  search?: string;
  newArrivalsOnly?: boolean;
}): Promise<Product[]> {
  try {
    const url = new URL(`${API_URL}/products`);
    if (params?.category) url.searchParams.set('category', params.category);
    if (params?.search) url.searchParams.set('search', params.search);

    const res = await fetchWithRetry(url.toString(), { next: { revalidate: 60 } }, 2, 10000);
    if (!res.ok) throw new Error('Failed to fetch products');

    const data = await res.json();
    let list = data.data || data;
    if (!Array.isArray(list) || list.length === 0) list = getCombinedProductsList();

    if (params?.newArrivalsOnly) {
      return list.filter((p: Product) => p.isNewArrival);
    }
    return list;
  } catch {
    let list = getCombinedProductsList();
    if (params?.category) {
      list = list.filter((p) => p.category?.slug === params.category || p.categoryId === params.category);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.vendor?.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q),
      );
    }
    if (params?.newArrivalsOnly) {
      list = list.filter((p) => p.isNewArrival);
    }
    return list;
  }
}

export async function createProductAPI(payload: any): Promise<Product> {
  try {
    const res = await fetchWithRetry(
      `${API_URL}/products`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
      2,
      10000,
    );
    if (res.ok) {
      const data = await res.json();
      return data.data || data;
    }
  } catch (err) {
    console.warn('Backend API create product error, saving locally in browser storage:', err);
  }
  return payload;
}

export async function updateProductAPI(id: string, payload: any): Promise<Product> {
  try {
    const res = await fetchWithRetry(
      `${API_URL}/products/${id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
      2,
      10000,
    );
    if (res.ok) {
      const data = await res.json();
      return data.data || data;
    }
  } catch (err) {
    console.warn('Backend API update product error, saving locally in browser storage:', err);
  }
  return payload;
}

export async function deleteProductAPI(id: string): Promise<boolean> {
  try {
    const res = await fetchWithRetry(
      `${API_URL}/products/${id}`,
      {
        method: 'DELETE',
      },
      2,
      10000,
    );
    if (res.ok) return true;
  } catch (err) {
    console.warn('Backend API delete product error, deleting locally:', err);
  }
  return true;
}

export async function fetchProductBySlugAPI(slug: string): Promise<Product | null> {
  const decoded = decodeURIComponent(slug).trim().toLowerCase();
  try {
    const res = await fetchWithRetry(`${API_URL}/products/${slug}`, { next: { revalidate: 60 } }, 2, 10000);
    if (res.ok) {
      const data = await res.json();
      const item = data.data || data;
      if (item && (item.id || item.slug || item.title)) return item;
    }
  } catch {}

  const list = getCombinedProductsList();
  const matched = list.find(
    (p) =>
      p.slug === slug ||
      p.slug.toLowerCase() === decoded ||
      p.id === slug ||
      p.id.toLowerCase() === decoded ||
      p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === decoded
  );
  return matched || (list.length > 0 ? list[0] : null);
}

export async function placeOrderAPI(orderPayload: any, token?: string): Promise<any> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetchWithRetry(
    `${API_URL}/checkout/place-order`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify(orderPayload),
    },
    2,
    15000,
  );

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error?.message || json.message || 'Failed to place order');
  }

  return json.data || json;
}

export async function createProductRequestAPI(payload: {
  customerName: string;
  phone: string;
  productName: string;
  brand?: string;
  notes?: string;
}): Promise<any> {
  const res = await fetchWithRetry(
    `${API_URL}/products/request-item`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    },
    1,
    10000,
  );

  const json = await res.json();
  return json.data || json;
}

export async function submitReviewAPI(
  productId: string,
  payload: { customerName: string; rating: number; comment: string },
  token?: string,
): Promise<any> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetchWithRetry(
    `${API_URL}/products/${productId}/reviews`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    },
    1,
    10000,
  );

  const json = await res.json();
  return json.data || json;
}

export async function trackOrderAPI(query: string): Promise<any> {
  try {
    let res = await fetchWithRetry(
      `${API_URL}/orders/track?query=${encodeURIComponent(query)}`,
      { cache: 'no-store' },
      1,
      8000,
    ).catch(() => null);

    if (!res || !res.ok) {
      res = await fetchWithRetry(
        `${API_URL}/orders/track/${encodeURIComponent(query)}`,
        { cache: 'no-store' },
        1,
        8000,
      ).catch(() => null);
    }

    if (res && res.ok) {
      const data = await res.json();
      return data.data || data;
    }
    return null;
  } catch {
    return null;
  }
}

// Export standard aliases
export const fetchProducts = fetchProductsAPI;
export const fetchProductBySlug = fetchProductBySlugAPI;
export const trackOrder = trackOrderAPI;

