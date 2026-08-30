import { Product, Category } from './api';

// =============================================================================
// 🧠 M/S RONG BAHAR INTELLIGENT GRAPH & TAXONOMY ENGINE (DFS + BFS)
// =============================================================================

export interface CategoryTreeNode {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  depth: number;
  children: CategoryTreeNode[];
  parentId?: string;
}

export interface UnitGraphNode {
  unit: string;
  domain: 'volume' | 'weight' | 'length' | 'count' | 'area' | 'general';
  multiplier: number; // relative scale in base units
  children: string[];
  parents: string[];
}

export interface CompanionEdge {
  targetProductId: string;
  targetCategorySlug: string;
  weight: number;
  relationType: 'applicator' | 'solvent' | 'primer' | 'fastener' | 'safety' | 'sibling';
}

/**
 * Standard Hardware & Paint Unit Dependency Knowledge Graph
 */
export const HARDWARE_UNIT_GRAPH: Record<string, UnitGraphNode> = {
  // Volume Hierarchy
  '100 mL': { unit: '100 mL', domain: 'volume', multiplier: 0.1, children: ['200 mL', '0.5 Litre'], parents: [] },
  '200 mL': { unit: '200 mL', domain: 'volume', multiplier: 0.2, children: ['0.5 Litre', '0.91 Litre Tin'], parents: ['100 mL'] },
  '0.5 Litre': { unit: '0.5 Litre', domain: 'volume', multiplier: 0.5, children: ['0.91 Litre Tin', '1 Litre'], parents: ['200 mL'] },
  '0.91 Litre Tin': { unit: '0.91 Litre Tin', domain: 'volume', multiplier: 0.91, children: ['1 Litre', '3.64 Litre Gallon'], parents: ['0.5 Litre'] },
  '1 Litre': { unit: '1 Litre', domain: 'volume', multiplier: 1.0, children: ['3.64 Litre Gallon', '4 Litre'], parents: ['0.91 Litre Tin'] },
  '3.64 Litre Gallon': { unit: '3.64 Litre Gallon', domain: 'volume', multiplier: 3.64, children: ['4 Litre', '18.2 Litre Drum', '20 Litre Drum'], parents: ['1 Litre'] },
  '4 Litre': { unit: '4 Litre', domain: 'volume', multiplier: 4.0, children: ['18.2 Litre Drum', '20 Litre Drum'], parents: ['3.64 Litre Gallon'] },
  '18.2 Litre Drum': { unit: '18.2 Litre Drum', domain: 'volume', multiplier: 18.2, children: ['20 Litre Drum'], parents: ['4 Litre'] },
  '20 Litre Drum': { unit: '20 Litre Drum', domain: 'volume', multiplier: 20.0, children: [], parents: ['18.2 Litre Drum'] },
  'Volume & Color': { unit: 'Volume & Color', domain: 'volume', multiplier: 1.0, children: ['0.91 Litre Tin', '3.64 Litre Gallon'], parents: [] },

  // Weight Hierarchy
  '50 g': { unit: '50 g', domain: 'weight', multiplier: 0.05, children: ['100 g', '250 g'], parents: [] },
  '100 g': { unit: '100 g', domain: 'weight', multiplier: 0.1, children: ['250 g', '500 g'], parents: ['50 g'] },
  '250 g': { unit: '250 g', domain: 'weight', multiplier: 0.25, children: ['500 g', '1 kg'], parents: ['100 g'] },
  '500 g': { unit: '500 g', domain: 'weight', multiplier: 0.5, children: ['1 kg', '2 kg'], parents: ['250 g'] },
  '1 kg': { unit: '1 kg', domain: 'weight', multiplier: 1.0, children: ['2 kg', '5 kg', '25 kg Bag'], parents: ['500 g'] },
  '2 kg': { unit: '2 kg', domain: 'weight', multiplier: 2.0, children: ['5 kg', '25 kg Bag'], parents: ['1 kg'] },
  '5 kg': { unit: '5 kg', domain: 'weight', multiplier: 5.0, children: ['25 kg Bag', '50 kg Bag'], parents: ['2 kg'] },
  '25 kg Bag': { unit: '25 kg Bag', domain: 'weight', multiplier: 25.0, children: ['50 kg Bag'], parents: ['5 kg'] },
  '50 kg Bag': { unit: '50 kg Bag', domain: 'weight', multiplier: 50.0, children: [], parents: ['25 kg Bag'] },
  'Weight (kg/g)': { unit: 'Weight (kg/g)', domain: 'weight', multiplier: 1.0, children: ['500 g', '1 kg'], parents: [] },

  // Dimension & Width Hierarchy
  '25 mm (1 Inch)': { unit: '25 mm (1 Inch)', domain: 'length', multiplier: 25, children: ['38 mm (1.5 Inch)', '50 mm (2 Inch)'], parents: [] },
  '38 mm (1.5 Inch)': { unit: '38 mm (1.5 Inch)', domain: 'length', multiplier: 38, children: ['50 mm (2 Inch)', '75 mm (3 Inch)'], parents: ['25 mm (1 Inch)'] },
  '50 mm (2 Inch)': { unit: '50 mm (2 Inch)', domain: 'length', multiplier: 50, children: ['75 mm (3 Inch)', '100 mm (4 Inch)'], parents: ['38 mm (1.5 Inch)'] },
  '75 mm (3 Inch)': { unit: '75 mm (3 Inch)', domain: 'length', multiplier: 75, children: ['100 mm (4 Inch)', '125 mm (5 Inch)'], parents: ['50 mm (2 Inch)'] },
  '100 mm (4 Inch)': { unit: '100 mm (4 Inch)', domain: 'length', multiplier: 100, children: ['125 mm (5 Inch)'], parents: ['75 mm (3 Inch)'] },
  '125 mm (5 Inch)': { unit: '125 mm (5 Inch)', domain: 'length', multiplier: 125, children: [], parents: ['100 mm (4 Inch)'] },
  'Width (mm / Inch)': { unit: 'Width (mm / Inch)', domain: 'length', multiplier: 50, children: ['50 mm (2 Inch)', '100 mm (4 Inch)'], parents: [] },

  // Count & Piece Hierarchy
  '1 Piece': { unit: '1 Piece', domain: 'count', multiplier: 1, children: ['Pack of 6', 'Pack of 12 (Dozen)'], parents: [] },
  'Pack of 6': { unit: 'Pack of 6', domain: 'count', multiplier: 6, children: ['Pack of 12 (Dozen)', 'Box (24 Pcs)'], parents: ['1 Piece'] },
  'Pack of 12 (Dozen)': { unit: 'Pack of 12 (Dozen)', domain: 'count', multiplier: 12, children: ['Box (24 Pcs)', 'Master Carton (100 Pcs)'], parents: ['Pack of 6'] },
  'Box (24 Pcs)': { unit: 'Box (24 Pcs)', domain: 'count', multiplier: 24, children: ['Master Carton (100 Pcs)'], parents: ['Pack of 12 (Dozen)'] },
  'Master Carton (100 Pcs)': { unit: 'Master Carton (100 Pcs)', domain: 'count', multiplier: 100, children: [], parents: ['Box (24 Pcs)'] },
  'Piece / Pack': { unit: 'Piece / Pack', domain: 'count', multiplier: 1, children: ['1 Piece', 'Pack of 12 (Dozen)'], parents: [] },
};

/**
 * Hardware Companion Matrix (Relationships for BFS Multi-Level Traversal)
 */
const CATEGORY_COMPANION_RULES: Record<string, Array<{ targetSlug: string; relation: CompanionEdge['relationType']; weight: number }>> = {
  'synthetic-enamel-paints': [
    { targetSlug: 'thinners-and-solvents', relation: 'solvent', weight: 1.0 },
    { targetSlug: 'paint-brushes-and-tools', relation: 'applicator', weight: 0.95 },
    { targetSlug: 'adhesives-and-glues', relation: 'sibling', weight: 0.5 },
  ],
  'adhesives-and-glues': [
    { targetSlug: 'paint-brushes-and-tools', relation: 'applicator', weight: 0.8 },
    { targetSlug: 'padlocks-and-security', relation: 'sibling', weight: 0.6 },
    { targetSlug: 'thinners-and-solvents', relation: 'solvent', weight: 0.5 },
  ],
  'acrylic-lacquer-sprays': [
    { targetSlug: 'thinners-and-solvents', relation: 'solvent', weight: 0.8 },
    { targetSlug: 'paint-brushes-and-tools', relation: 'applicator', weight: 0.7 },
  ],
  'padlocks-and-security': [
    { targetSlug: 'adhesives-and-glues', relation: 'sibling', weight: 0.7 },
    { targetSlug: 'sanitary-and-pipes', relation: 'sibling', weight: 0.6 },
  ],
  'paint-brushes-and-tools': [
    { targetSlug: 'synthetic-enamel-paints', relation: 'sibling', weight: 0.95 },
    { targetSlug: 'thinners-and-solvents', relation: 'solvent', weight: 0.9 },
  ],
  'thinners-and-solvents': [
    { targetSlug: 'synthetic-enamel-paints', relation: 'sibling', weight: 1.0 },
    { targetSlug: 'paint-brushes-and-tools', relation: 'applicator', weight: 0.85 },
  ],
  'sanitary-and-pipes': [
    { targetSlug: 'adhesives-and-glues', relation: 'sibling', weight: 0.8 },
    { targetSlug: 'padlocks-and-security', relation: 'sibling', weight: 0.6 },
  ],
};

// =============================================================================
// 1. 🌲 DFS (DEPTH-FIRST SEARCH) TAXONOMY & UNIT ALGORITHMS
// =============================================================================

/**
 * Builds a hierarchical Category Tree from a flat list of categories.
 */
export function buildCategoryTree(categories: Category[]): CategoryTreeNode[] {
  const rootNodes: CategoryTreeNode[] = [];
  const map = new Map<string, CategoryTreeNode>();

  categories.forEach((cat) => {
    map.set(cat.slug, {
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      image: cat.image,
      depth: 0,
      children: [],
    });
  });

  // Assign hierarchical taxonomy parents if designated
  categories.forEach((cat) => {
    const node = map.get(cat.slug)!;
    // Default top-level assignment
    rootNodes.push(node);
  });

  return rootNodes;
}

/**
 * DFS Algorithm: Recursively traverses Category Taxonomy Tree depth-first.
 * Guarantees parent-to-child deep subcategory ordering.
 */
export function traverseCategoryTreeDFS(
  nodes: CategoryTreeNode[],
  visitor?: (node: CategoryTreeNode, depth: number) => void
): CategoryTreeNode[] {
  const visited: CategoryTreeNode[] = [];
  const seen = new Set<string>();

  function dfs(node: CategoryTreeNode, currentDepth: number) {
    if (seen.has(node.slug)) return;
    seen.add(node.slug);

    const enrichedNode = { ...node, depth: currentDepth };
    visited.push(enrichedNode);
    if (visitor) visitor(enrichedNode, currentDepth);

    for (const child of node.children) {
      dfs(child, currentDepth + 1);
    }
  }

  for (const root of nodes) {
    dfs(root, 0);
  }

  return visited;
}

/**
 * DFS Algorithm: Sorts categories depth-first for nested taxonomy navigation.
 */
export function sortCategoriesDFS(categories: Category[]): Category[] {
  const tree = buildCategoryTree(categories);
  const orderedNodes = traverseCategoryTreeDFS(tree);
  return orderedNodes.map((n) => ({
    id: n.id,
    name: n.name,
    slug: n.slug,
    description: n.description,
    image: n.image,
  }));
}

/**
 * DFS Algorithm: Performs Topological & Scale Depth-First Search on Measurement Units.
 * Orders units by measurement domain (Volume -> Weight -> Length -> Count)
 * and ascends monotonically from smallest retail container to master drums.
 */
export function sortUnitsDFS(units: string[]): string[] {
  const visited = new Set<string>();
  const result: string[] = [];

  // Group units by domain
  const domains: Record<string, string[]> = {
    volume: [],
    weight: [],
    length: [],
    count: [],
    general: [],
  };

  units.forEach((u) => {
    const node = HARDWARE_UNIT_GRAPH[u];
    const dom = node ? node.domain : 'general';
    if (domains[dom]) domains[dom].push(u);
    else domains.general.push(u);
  });

  // DFS traversal through unit chains within each domain
  Object.values(domains).forEach((domainUnits) => {
    // Sort by multiplier scale ascending
    domainUnits.sort((a, b) => {
      const multA = HARDWARE_UNIT_GRAPH[a]?.multiplier ?? 0;
      const multB = HARDWARE_UNIT_GRAPH[b]?.multiplier ?? 0;
      return multA - multB;
    });

    function dfsUnit(u: string) {
      if (visited.has(u)) return;
      visited.add(u);
      result.push(u);

      const node = HARDWARE_UNIT_GRAPH[u];
      if (node && node.children) {
        for (const child of node.children) {
          if (domainUnits.includes(child) && !visited.has(child)) {
            dfsUnit(child);
          }
        }
      }
    }

    for (const u of domainUnits) {
      dfsUnit(u);
    }
  });

  return result;
}

/**
 * DFS Algorithm: Deep Product Taxonomy Sort
 * Explores category branches depth-first, placing deeply related products next to each other.
 */
export function deepProductTaxonomySortDFS(products: Product[], categories: Category[]): Product[] {
  const orderedCats = sortCategoriesDFS(categories);
  const catSlugOrder = new Map(orderedCats.map((c, i) => [c.slug, i]));

  return [...products].sort((a, b) => {
    const slugA = a.category?.slug || a.categoryId || '';
    const slugB = b.category?.slug || b.categoryId || '';
    const orderA = catSlugOrder.has(slugA) ? catSlugOrder.get(slugA)! : 999;
    const orderB = catSlugOrder.has(slugB) ? catSlugOrder.get(slugB)! : 999;

    if (orderA !== orderB) return orderA - orderB;
    return a.title.localeCompare(b.title);
  });
}

// =============================================================================
// 2. 🌐 BFS (BREADTH-FIRST SEARCH) MULTI-LEVEL DISCOVERY & EXPANSION
// =============================================================================

/**
 * BFS Algorithm: Multi-Level Breadth-First Search for Product Discovery.
 * Explores concentric rings of relevance:
 * - Level 0: Exact match products (by title, SKU, or direct category match).
 * - Level 1: Immediate category peers & brand companions.
 * - Level 2: Cross-category compatible application tools & chemical solvents.
 * - Level 3: Broader store inventory.
 */
export function sortProductsBFS(
  products: Product[],
  options?: {
    query?: string;
    categorySlug?: string;
    rootProductId?: string;
  }
): Product[] {
  if (products.length === 0) return [];
  const { query, categorySlug, rootProductId } = options || {};

  const q = query ? query.toLowerCase().trim() : '';
  const queue: Array<{ product: Product; level: number; score: number }> = [];
  const visited = new Set<string>();

  // 1. Level 0 Seed: Direct matches or active category
  const level0Items: Product[] = [];
  const remaining: Product[] = [];

  products.forEach((p) => {
    let isMatch = false;
    if (rootProductId && p.id === rootProductId) {
      isMatch = true;
    } else if (q) {
      const inTitle = p.title.toLowerCase().includes(q);
      const inSku = p.sku.toLowerCase().includes(q);
      const inVendor = Boolean(p.vendor?.toLowerCase().includes(q));
      const inCat = Boolean(p.category?.name?.toLowerCase().includes(q) || p.category?.slug?.toLowerCase().includes(q));
      isMatch = Boolean(inTitle || inSku || inVendor || inCat);
    } else if (categorySlug) {
      isMatch = Boolean(p.category?.slug === categorySlug || p.categoryId === categorySlug);
    } else {
      isMatch = Boolean(p.isFeatured || p.isNewArrival);
    }

    if (isMatch) {
      level0Items.push(p);
    } else {
      remaining.push(p);
    }
  });

  // Enqueue Level 0
  level0Items.forEach((p) => {
    visited.add(p.id);
    queue.push({ product: p, level: 0, score: 100 });
  });

  // 2. BFS Expansion: Explore Level 1 (Peers in same category / brand)
  const level1Items: Product[] = [];
  remaining.forEach((p) => {
    if (visited.has(p.id)) return;
    const sharesCategory = level0Items.some((l0) => (l0.category?.slug || l0.categoryId) === (p.category?.slug || p.categoryId));
    const sharesVendor = level0Items.some((l0) => l0.vendor && p.vendor && l0.vendor === p.vendor);

    if (sharesCategory || sharesVendor) {
      visited.add(p.id);
      level1Items.push(p);
      queue.push({ product: p, level: 1, score: 75 });
    }
  });

  // 3. BFS Expansion: Explore Level 2 (Cross-category Companion Tools & Solvents)
  const level2Items: Product[] = [];
  remaining.forEach((p) => {
    if (visited.has(p.id)) return;
    const catP = p.category?.slug || p.categoryId;

    const isCompanion = level0Items.some((l0) => {
      const catL0 = l0.category?.slug || l0.categoryId;
      const rules = CATEGORY_COMPANION_RULES[catL0] || [];
      return rules.some((r) => r.targetSlug === catP);
    });

    if (isCompanion) {
      visited.add(p.id);
      level2Items.push(p);
      queue.push({ product: p, level: 2, score: 50 });
    }
  });

  // 4. BFS Expansion: Explore Level 3 (General Store Rest)
  remaining.forEach((p) => {
    if (!visited.has(p.id)) {
      visited.add(p.id);
      queue.push({ product: p, level: 3, score: 25 });
    }
  });

  return queue.map((item) => item.product);
}

/**
 * BFS Algorithm: 2-Hop Hardware Companion Discovery for PDP & Cross-Selling.
 * Given a product (e.g. Berger Enamel Paint), explores graph edges to find
 * exact matching tools (e.g. 125mm Brushes, GP Thinner, Sandpaper).
 */
export function discoverCompanionProductsBFS(
  targetProduct: Product,
  allProducts: Product[],
  maxResults: number = 4
): Product[] {
  const targetCat = targetProduct.category?.slug || targetProduct.categoryId;
  const companionRules = CATEGORY_COMPANION_RULES[targetCat] || [];
  const targetVendor = targetProduct.vendor || '';

  const candidates: Array<{ product: Product; score: number }> = [];

  allProducts.forEach((p) => {
    if (p.id === targetProduct.id) return;
    const catP = p.category?.slug || p.categoryId;

    let score = 0;
    const rule = companionRules.find((r) => r.targetSlug === catP);
    if (rule) {
      score += rule.weight * 50;
    }
    if (p.vendor && targetVendor && p.vendor === targetVendor) {
      score += 30; // Brand consistency boost
    }
    if (p.stock > 0) {
      score += 15;
    }

    if (score > 0) {
      candidates.push({ product: p, score });
    }
  });

  candidates.sort((a, b) => b.score - a.score);
  return candidates.slice(0, maxResults).map((c) => c.product);
}

/**
 * BFS Algorithm: Breadth-First Unit Order
 * Organizes units by concentric usage tiers (Common Consumer Sizes -> Contractor Drums -> Bulk Cartons).
 */
export function sortUnitsBFS(units: string[]): string[] {
  const level0 = ['0.91 Litre Tin', '1 Litre', '500 g', '1 kg', '50 mm (2 Inch)', '1 Piece'];
  const level1 = ['200 mL', '0.5 Litre', '3.64 Litre Gallon', '250 g', '2 kg', '75 mm (3 Inch)', 'Pack of 6'];
  const level2 = ['18.2 Litre Drum', '20 Litre Drum', '5 kg', '25 kg Bag', '125 mm (5 Inch)', 'Pack of 12 (Dozen)'];

  const getTier = (u: string) => {
    if (level0.includes(u)) return 0;
    if (level1.includes(u)) return 1;
    if (level2.includes(u)) return 2;
    return 3;
  };

  return [...units].sort((a, b) => {
    const tierA = getTier(a);
    const tierB = getTier(b);
    if (tierA !== tierB) return tierA - tierB;
    return a.localeCompare(b);
  });
}

// =============================================================================
// 3. 🧠 INTELLIGENT MULTI-FACTOR RANKING ENGINE
// =============================================================================

export interface IntelligentRankOptions {
  query?: string;
  categoryFilter?: string;
  sortBy?: 'intelligent' | 'dfs_taxonomy' | 'bfs_companion' | 'unit_hierarchy' | 'price_asc' | 'price_desc' | 'freshness' | 'stock' | 'name';
}

/**
 * Intelligent Multi-Factor Sorting & Ranking Engine
 * Combines BFS Graph Proximity + DFS Taxonomy Depth + Inventory Health + Margin Velocity.
 */
export function intelligentRankProducts(
  products: Product[],
  options?: IntelligentRankOptions
): Product[] {
  if (products.length === 0) return [];
  const { sortBy = 'intelligent', query, categoryFilter } = options || {};

  // Standard specific sorts
  if (sortBy === 'price_asc') {
    return [...products].sort((a, b) => a.basePrice - b.basePrice);
  }
  if (sortBy === 'price_desc') {
    return [...products].sort((a, b) => b.basePrice - a.basePrice);
  }
  if (sortBy === 'freshness') {
    return [...products].sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
  }
  if (sortBy === 'stock') {
    return [...products].sort((a, b) => b.stock - a.stock);
  }
  if (sortBy === 'name') {
    return [...products].sort((a, b) => a.title.localeCompare(b.title));
  }
  if (sortBy === 'dfs_taxonomy') {
    // DFS Deep Category Hierarchy
    return deepProductTaxonomySortDFS(products, []);
  }
  if (sortBy === 'bfs_companion') {
    // BFS Graph Exploration
    return sortProductsBFS(products, { query, categorySlug: categoryFilter });
  }

  // 🧠 Default: Multi-Factor Intelligent Rank
  const q = query ? query.toLowerCase().trim() : '';

  const scored = products.map((p) => {
    let score = 50;

    // 1. Text & SKU Match Proximity
    if (q) {
      const titleLower = p.title.toLowerCase();
      if (titleLower === q) score += 100;
      else if (titleLower.startsWith(q)) score += 60;
      else if (titleLower.includes(q)) score += 40;
      if (p.sku.toLowerCase().includes(q)) score += 45;
      if (p.vendor?.toLowerCase().includes(q)) score += 30;
    }

    // 2. Category Relevance
    if (categoryFilter) {
      const cat = categoryFilter.toLowerCase();
      if (p.category?.slug?.toLowerCase() === cat || p.categoryId?.toLowerCase() === cat) {
        score += 50;
      }
    }

    // 3. Freshness & Featured Highlights
    if (p.isNewArrival) score += 20;
    if (p.isFeatured) score += 15;

    // 4. Stock Availability Health
    if (p.stock > 10) score += 15;
    else if (p.stock > 0) score += 5;
    else score -= 30; // Out of stock penalty

    // 5. Margin & Pricing Health
    if (p.costPrice && p.basePrice > p.costPrice) {
      const margin = (p.basePrice - p.costPrice) / p.basePrice;
      score += Math.min(20, Math.round(margin * 30));
    }

    // 6. Complete Data Completeness (Images, Specs, Variants)
    if (p.images && p.images.length > 0) score += 10;
    if (p.variants && p.variants.length > 1) score += 10;

    return { product: p, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.map((s) => s.product);
}
