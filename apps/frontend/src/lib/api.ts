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

export const initialFallbackProducts: Product[] = [
  {
    id: 'prod-1',
    title: 'Berger Robbialac Super Gloss Synthetic Enamel',
    slug: 'berger-robbialac-enamel-series',
    description: 'High gloss protective shield synthetic enamel paint for wood, metal, and steel surfaces. Formulated with alkyd resin and UV-resistant pigments for a mirror-like finish that prevents rust and corrosion in Pakundia weather.',
    categoryId: 'cat-enamel',
    category: { id: 'cat-enamel', name: 'Synthetic Enamel Paints', slug: 'synthetic-enamel-paints' },
    basePrice: 240,
    costPrice: 200,
    stock: 95,
    sku: 'BER-ROB-SGE-SERIES',
    barcode: '890123456001',
    unit: 'Volume & Color',
    images: ['/products/2412.jpg', '/products/2416.jpg'],
    isActive: true,
    isNewArrival: true,
    isFeatured: true,
    vendor: 'Berger Paints BD',
    badge: 'Best Seller',
    warranty: '5 Years Anti-Rust Protection',
    specifications: {
      coverage: '120-140 sq. ft / Litre / Coat',
      dryingTime: 'Surface dry: 3 hrs, Hard dry: 18 hrs',
      finish: 'Mirror High Gloss (85+ GU)',
      origin: 'Bangladesh (Berger Paints BD Ltd)',
    },
    colors: [
      { name: 'CNG Royal Green', hex: '#166534' },
      { name: 'Snow White', hex: '#f8fafc' },
      { name: 'Signal Coral Red', hex: '#ea580c' },
      { name: 'Golden Yellow', hex: '#d97706' },
      { name: 'Deep Charcoal', hex: '#334155' },
    ],
    sizes: ['0.455 Litre Can', '0.91 Litre Tin', '3.64 Litre Gallon', '18.2 Litre Drum'],
    variants: [
      { id: 'v1', productId: 'prod-1', name: '0.455L Can – CNG Royal Green', sizeOrWeight: '0.455 Litre Can', colorName: 'CNG Royal Green', colorHex: '#166534', price: 240, costPrice: 195, stock: 40, sku: 'BER-ROB-045L-GRN' },
      { id: 'v2', productId: 'prod-1', name: '0.91L Tin – CNG Royal Green', sizeOrWeight: '0.91 Litre Tin', colorName: 'CNG Royal Green', colorHex: '#166534', price: 450, costPrice: 380, stock: 35, sku: 'BER-ROB-091L-GRN' },
      { id: 'v2-wht', productId: 'prod-1', name: '0.91L Tin – Snow White', sizeOrWeight: '0.91 Litre Tin', colorName: 'Snow White', colorHex: '#f8fafc', price: 450, costPrice: 380, stock: 25, sku: 'BER-ROB-091L-WHT' },
      { id: 'v3', productId: 'prod-1', name: '3.64L Gallon – CNG Royal Green', sizeOrWeight: '3.64 Litre Gallon', colorName: 'CNG Royal Green', colorHex: '#166534', price: 1700, costPrice: 1450, stock: 20, sku: 'BER-ROB-364L-GRN' },
      { id: 'v3-red', productId: 'prod-1', name: '3.64L Gallon – Signal Coral Red', sizeOrWeight: '3.64 Litre Gallon', colorName: 'Signal Coral Red', colorHex: '#ea580c', price: 1750, costPrice: 1490, stock: 15, sku: 'BER-ROB-364L-RED' },
    ],
  },
  {
    id: 'prod-5',
    title: 'Aqua Paints Rangila Synthetic Enamel Series',
    slug: 'aqua-rangila-enamel',
    description: 'Vibrant CNG Green, Cyan, and industrial enamel paint for auto rickshaws, gates, grills, and commercial sheet metal. High hiding power and rapid touch-dry finish.',
    categoryId: 'cat-enamel',
    category: { id: 'cat-enamel', name: 'Synthetic Enamel Paints', slug: 'synthetic-enamel-paints' },
    basePrice: 200,
    costPrice: 160,
    stock: 80,
    sku: 'AQU-RNG-SERIES',
    barcode: '890123456005',
    unit: 'Volume & Color',
    images: ['/products/2416.jpg', '/products/2412.jpg'],
    isActive: true,
    isNewArrival: true,
    isFeatured: true,
    vendor: 'Aqua Paints BD',
    badge: 'Fresh Stock',
    warranty: 'Genuine Aqua Warranty',
    specifications: {
      coverage: '110-130 sq. ft / Litre',
      dryingTime: 'Touch dry: 2.5 hrs',
      finish: 'Vibrant Semi-Gloss',
      origin: 'Bangladesh',
    },
    colors: [
      { name: 'Aqua CNG Green', hex: '#15803d' },
      { name: 'Marine Cyan', hex: '#0284c7' },
      { name: 'Super White', hex: '#ffffff' },
    ],
    sizes: ['0.145 Litre Mini Can', '0.455 Litre Can', '0.91 Litre Can'],
    variants: [
      { id: 'v10', productId: 'prod-5', name: '0.145L Mini – Aqua CNG Green', sizeOrWeight: '0.145 Litre Mini Can', colorName: 'Aqua CNG Green', colorHex: '#15803d', price: 200, costPrice: 150, stock: 50, sku: 'AQU-RNG-145-GRN' },
      { id: 'v10-b', productId: 'prod-5', name: '0.91L Can – Aqua CNG Green', sizeOrWeight: '0.91 Litre Can', colorName: 'Aqua CNG Green', colorHex: '#15803d', price: 390, costPrice: 320, stock: 30, sku: 'AQU-RNG-091-GRN' },
      { id: 'v10-c', productId: 'prod-5', name: '0.91L Can – Marine Cyan', sizeOrWeight: '0.91 Litre Can', colorName: 'Marine Cyan', colorHex: '#0284c7', price: 410, costPrice: 330, stock: 20, sku: 'AQU-RNG-091-CYN' },
    ],
  },
  {
    id: 'prod-2',
    title: 'Fevicol 1K PUR Polyurethane Waterproof Adhesive',
    slug: 'fevicol-1k-pur-adhesive',
    description: 'Single component moisture curing polyurethane wood adhesive for extreme high strength, waterproof D4 bond. Ideal for wooden windows, doors, boats, and exterior joinery.',
    categoryId: 'cat-adhesives',
    category: { id: 'cat-adhesives', name: 'Adhesives & PUR Glues', slug: 'adhesives-and-glues' },
    basePrice: 744,
    costPrice: 620,
    stock: 60,
    sku: 'FEV-1KPUR-SERIES',
    barcode: '890123456002',
    unit: 'Weight (gm / kg)',
    images: ['/products/2413.jpg'],
    isActive: true,
    isNewArrival: false,
    isFeatured: true,
    vendor: 'Pidilite (Fevicol)',
    badge: 'D4 Waterproof',
    warranty: 'Lifetime Bond Integrity',
    specifications: {
      dryingTime: 'Initial setting: 30 mins, Full cure: 24 hrs',
      material: '1-Component Polyurethane',
      origin: 'Pidilite Industries',
    },
    sizes: ['250 gm Bottle', '500 gm Bottle', '1 kg Bottle'],
    variants: [
      { id: 'v4-sm', productId: 'prod-2', name: '250 gm Bottle', sizeOrWeight: '250 gm Bottle', price: 390, costPrice: 310, stock: 25, sku: 'FEV-1KPUR-250G' },
      { id: 'v4', productId: 'prod-2', name: '500 gm Bottle', sizeOrWeight: '500 gm Bottle', price: 744, costPrice: 620, stock: 40, sku: 'FEV-1KPUR-500G' },
      { id: 'v5', productId: 'prod-2', name: '1 kg Bottle', sizeOrWeight: '1 kg Bottle', price: 1420, costPrice: 1190, stock: 20, sku: 'FEV-1KPUR-1KG' },
    ],
  },
  {
    id: 'prod-3',
    title: 'JM Acrylic Lacquer Spray Paint Series',
    slug: 'jm-acrylic-lacquer-spray',
    description: 'Quick-drying thermoplastic acrylic aerosol spray for metal, automotive body touchups, wood, and plastic.',
    categoryId: 'cat-sprays',
    category: { id: 'cat-sprays', name: 'Acrylic Spray Paints', slug: 'acrylic-lacquer-sprays' },
    basePrice: 240,
    costPrice: 180,
    stock: 120,
    sku: 'JM-SP-SERIES',
    barcode: '890123456003',
    unit: 'Fluid (400ml Can)',
    images: ['/products/2414.jpg'],
    isActive: true,
    isNewArrival: false,
    isFeatured: false,
    vendor: 'JM Aerosols',
    badge: 'Fast Dry',
    specifications: {
      coverage: '15-20 sq. ft / Can',
      dryingTime: 'Dry to touch: 10 mins',
      finish: 'Gloss & Matte Lacquer',
    },
    colors: [
      { name: 'Gloss Clear Topcoat', hex: '#e2e8f0' },
      { name: 'Matte Black', hex: '#0f172a' },
      { name: 'Chrome Silver', hex: '#cbd5e1' },
      { name: 'Bright Gold', hex: '#f59e0b' },
    ],
    sizes: ['400 ml Aerosol Can'],
    variants: [
      { id: 'v6', productId: 'prod-3', name: '400ml – Gloss Clear Topcoat', sizeOrWeight: '400 ml Aerosol Can', colorName: 'Gloss Clear Topcoat', colorHex: '#e2e8f0', price: 240, costPrice: 180, stock: 50, sku: 'JM-SP-CLR-400' },
      { id: 'v7', productId: 'prod-3', name: '400ml – Matte Black', sizeOrWeight: '400 ml Aerosol Can', colorName: 'Matte Black', colorHex: '#0f172a', price: 240, costPrice: 180, stock: 35, sku: 'JM-SP-BLK-400' },
      { id: 'v8', productId: 'prod-3', name: '400ml – Chrome Silver', sizeOrWeight: '400 ml Aerosol Can', colorName: 'Chrome Silver', colorHex: '#cbd5e1', price: 260, costPrice: 190, stock: 35, sku: 'JM-SP-SLV-400' },
    ],
  },
  {
    id: 'prod-4',
    title: 'HMBR Heavy Duty Stainless Steel Padlock Series',
    slug: 'hmbr-padlock-series',
    description: 'Solid brass lock cylinder with hardened boron steel shackle. Anti-drill, anti-pick, and weather resistant for commercial gates and shutters.',
    categoryId: 'cat-hardware',
    category: { id: 'cat-hardware', name: 'Padlocks & Security Locks', slug: 'padlocks-and-security' },
    basePrice: 390,
    costPrice: 290,
    stock: 50,
    sku: 'HMBR-PL-SERIES',
    barcode: '890123456004',
    unit: 'Perimeter / Width (mm)',
    images: ['/products/2415.jpg'],
    isActive: true,
    isNewArrival: false,
    isFeatured: true,
    vendor: 'HMBR Hardware BD',
    badge: 'Heavy Security',
    warranty: '10 Years Shackle Warranty',
    specifications: {
      material: 'Hardened Boron Alloy Steel + Pure Brass Core',
      origin: 'HMBR Security Hardware',
    },
    sizes: ['40 mm Standard', '50 mm Top Security', '60 mm Heavy Armour', '70 mm Master Shutter'],
    variants: [
      { id: 'v9', productId: 'prod-4', name: '40 mm Standard Lock', sizeOrWeight: '40 mm Standard', price: 390, costPrice: 290, stock: 20, sku: 'HMBR-PL-40MM' },
      { id: 'v9-b', productId: 'prod-4', name: '50 mm Top Security Lock', sizeOrWeight: '50 mm Top Security', price: 490, costPrice: 370, stock: 15, sku: 'HMBR-PL-50MM' },
      { id: 'v9-c', productId: 'prod-4', name: '60 mm Heavy Armour Lock', sizeOrWeight: '60 mm Heavy Armour', price: 650, costPrice: 510, stock: 10, sku: 'HMBR-PL-60MM' },
      { id: 'v9-d', productId: 'prod-4', name: '70 mm Master Shutter Lock', sizeOrWeight: '70 mm Master Shutter', price: 850, costPrice: 680, stock: 5, sku: 'HMBR-PL-70MM' },
    ],
  },
  {
    id: 'prod-6',
    title: 'Professional Industrial Paint Brush Series (White Bristle)',
    slug: 'professional-industrial-paint-brush',
    description: 'Pure natural white bristle with tin-plated ferrule and ergonomic wooden handle. Zero bristle shedding, ideal for enamel paints and PU varnishes.',
    categoryId: 'cat-tools',
    category: { id: 'cat-tools', name: 'Paint Brushes & Applicators', slug: 'paint-brushes-and-tools' },
    basePrice: 50,
    costPrice: 32,
    stock: 140,
    sku: 'PBR-IND-SERIES',
    barcode: '890123456006',
    unit: 'Width (mm / Inch)',
    images: ['/products/2417.jpg'],
    isActive: true,
    isNewArrival: true,
    isFeatured: true,
    vendor: 'Master Brush BD',
    badge: 'Pro Quality',
    specifications: {
      material: '100% Pure White Hog Bristle + Wood Handle',
      origin: 'Master Brush BD',
    },
    sizes: ['25 mm (1 Inch)', '50 mm (2 Inch)', '75 mm (3 Inch)', '100 mm (4 Inch)', '125 mm (5 Inch)'],
    variants: [
      { id: 'v11', productId: 'prod-6', name: '25 mm (1 Inch) Brush', sizeOrWeight: '25 mm (1 Inch)', price: 50, costPrice: 30, stock: 30, sku: 'PBR-25MM' },
      { id: 'v12', productId: 'prod-6', name: '50 mm (2 Inch) Brush', sizeOrWeight: '50 mm (2 Inch)', price: 90, costPrice: 60, stock: 35, sku: 'PBR-50MM' },
      { id: 'v13', productId: 'prod-6', name: '75 mm (3 Inch) Brush', sizeOrWeight: '75 mm (3 Inch)', price: 130, costPrice: 90, stock: 30, sku: 'PBR-75MM' },
      { id: 'v14', productId: 'prod-6', name: '100 mm (4 Inch) Brush', sizeOrWeight: '100 mm (4 Inch)', price: 160, costPrice: 115, stock: 25, sku: 'PBR-100MM' },
      { id: 'v15', productId: 'prod-6', name: '125 mm (5 Inch) Brush', sizeOrWeight: '125 mm (5 Inch)', price: 200, costPrice: 145, stock: 20, sku: 'PBR-125MM' },
    ],
  },
];

export function getCombinedProductsList(): Product[] {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('rong_bahar_products_list');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const customIds = new Set(parsed.map((p) => p.id));
          const rest = initialFallbackProducts.filter((p) => !customIds.has(p.id));
          return [...parsed, ...rest];
        }
      }
    } catch {
      // ignore
    }
  }
  return initialFallbackProducts;
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

export async function fetchProductBySlugAPI(slug: string): Promise<Product | null> {
  try {
    const res = await fetchWithRetry(`${API_URL}/products/${slug}`, { next: { revalidate: 60 } }, 2, 10000);
    if (!res.ok) throw new Error('Not found');
    const data = await res.json();
    return data.data || data;
  } catch {
    const list = getCombinedProductsList();
    const matched = list.find((p) => p.slug === slug);
    return matched || null;
  }
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

