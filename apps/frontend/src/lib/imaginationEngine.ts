'use client';

/**
 * 🎨 Customer Imagination & Mood Engine
 * M/S Rong Bahar Cloud-Native Superstore
 */

export type CustomerMoodId = 'serene' | 'vibrant' | 'royal' | 'industrial' | 'monsoon' | 'heritage';

export interface MoodProfile {
  id: CustomerMoodId;
  name: string;
  tagline: string;
  emoji: string;
  auraGradient: string;
  accentColor: string;
  themeClass: string;
  quote: string;
  idealFor: string;
  keywords: string[];
  colorPalette: Array<{
    name: string;
    hex: string;
    code: string;
    description: string;
  }>;
  suggestedKit: {
    title: string;
    description: string;
    items: Array<{
      productId: string;
      variantName?: string;
      productTitle: string;
      unitPrice: number;
      quantity: number;
      image: string;
      unit: string;
      maxStock: number;
    }>;
    estimatedCost: number;
  };
  contractorTip: string;
}

export const customerMoods: Record<CustomerMoodId, MoodProfile> = {
  serene: {
    id: 'serene',
    name: 'Serene & Peaceful Sanctuary',
    tagline: 'Calm, meditative pastels & soothing acoustic neutrals for tranquil rest',
    emoji: '🌿',
    auraGradient: 'from-emerald-600/20 via-teal-500/10 to-slate-950',
    accentColor: '#34d399',
    themeClass: 'mood-serene',
    quote: 'Serenity begins where soft hues meet gentle morning daylight.',
    idealFor: 'Master Bedrooms, Prayer Rooms, Reading Corners, Balcony Gardens',
    keywords: ['calm', 'peace', 'quiet', 'bedroom', 'relax', 'soft', 'pastel', 'green', 'meditation'],
    colorPalette: [
      { name: 'Sage Tranquility Mint', hex: '#6ee7b7', code: 'BER-502-SGE', description: 'Soft daylight reflection for rest' },
      { name: 'Cashmere Pearl Ivory', hex: '#fef3c7', code: 'BER-204-IVR', description: 'Warm undertone for high relaxation' },
      { name: 'Morning Mist Blue', hex: '#93c5fd', code: 'AQ-108-MST', description: 'Gentle cooling sky tone' },
    ],
    suggestedKit: {
      title: 'Serene Master Bedroom Refresh Kit',
      description: '1 Gallon Silk Emulsion + Pure White Hog Bristle Brush + Masking Tape',
      items: [
        {
          productId: 'prod-1',
          variantName: '3.64L Gallon – CNG Royal Green',
          productTitle: 'Berger Robbialac Super Gloss Synthetic Enamel',
          unitPrice: 1700,
          quantity: 1,
          image: '/products/2412.jpg',
          unit: 'Volume & Color',
          maxStock: 20,
        },
        {
          productId: 'prod-6',
          variantName: '75 mm (3 Inch) Brush',
          productTitle: 'Professional Industrial Paint Brush Series (White Bristle)',
          unitPrice: 130,
          quantity: 2,
          image: '/products/2417.jpg',
          unit: 'Width (mm / Inch)',
          maxStock: 30,
        },
      ],
      estimatedCost: 1960,
    },
    contractorTip: 'Apply 2 light coats with 4 hours drying gap for velvety smooth light diffusion.',
  },

  vibrant: {
    id: 'vibrant',
    name: 'High-Energy & Vibrant Studio',
    tagline: 'Electrifying neon tones & high-gloss brilliance for lively social spaces',
    emoji: '⚡',
    auraGradient: 'from-amber-500/25 via-rose-500/15 to-slate-950',
    accentColor: '#f59e0b',
    themeClass: 'mood-vibrant',
    quote: 'Ignite dynamic passion and festive Bangladeshi energy in every corner.',
    idealFor: 'Living Rooms, Playrooms, Commercial Stores, Creative Workshops',
    keywords: ['energy', 'bold', 'bright', 'vibrant', 'fun', 'kids', 'yellow', 'orange', 'creative'],
    colorPalette: [
      { name: 'Berger Signal Coral Red', hex: '#ea580c', code: 'BER-301-RED', description: 'High-visibility vibrant gloss' },
      { name: 'Aqua Electric Cyan', hex: '#0284c7', code: 'AQ-303-CYN', description: 'Vivid eye-catching pop' },
      { name: 'Harvest Sun Gold', hex: '#fbbf24', code: 'BER-704-GLD', description: 'Radiant festive energy' },
    ],
    suggestedKit: {
      title: 'High-Energy Accent Wall & Trim Kit',
      description: 'Berger Enamel 0.91L + Aqua Fast Spray + Fine Detail Brush',
      items: [
        {
          productId: 'prod-5',
          variantName: '0.91L Can – Marine Cyan',
          productTitle: 'Aqua Paints Rangila Synthetic Enamel Series',
          unitPrice: 410,
          quantity: 2,
          image: '/products/2416.jpg',
          unit: 'Volume & Color',
          maxStock: 20,
        },
        {
          productId: 'prod-3',
          variantName: '400ml – Bright Gold',
          productTitle: 'JM Acrylic Lacquer Spray Paint Series',
          unitPrice: 240,
          quantity: 2,
          image: '/products/2414.jpg',
          unit: 'Fluid (400ml Can)',
          maxStock: 35,
        },
      ],
      estimatedCost: 1300,
    },
    contractorTip: 'Use bright white undercoat for enamel colors to reach maximum saturation and gloss sheen.',
  },

  royal: {
    id: 'royal',
    name: 'Royal Imperial Elegance',
    tagline: 'Deep navy, imperial gold trim & mirror-gloss majesty for luxury interiors',
    emoji: '🏰',
    auraGradient: 'from-blue-600/25 via-amber-500/20 to-slate-950',
    accentColor: '#60a5fa',
    themeClass: 'mood-royal',
    quote: 'A timeless statement of prestige, architectural dignity, and mirror-gloss nobility.',
    idealFor: 'Executive Drawing Rooms, Banquet Halls, Luxury Headboards, Main Entrance Doors',
    keywords: ['royal', 'luxury', 'expensive', 'gold', 'blue', 'rich', 'mirror', 'grand', 'vip'],
    colorPalette: [
      { name: 'Luxury Royal Sapphire Blue', hex: '#1e3a8a', code: 'BER-510-BLU', description: 'Deep majestic oceanic navy' },
      { name: 'Empire Mirror Gold', hex: '#d97706', code: 'BER-901-GLD', description: 'Rich metallic highlight' },
      { name: 'Pure Diamond Alpine White', hex: '#f8fafc', code: 'BER-100-WHT', description: 'High contrast architectural trim' },
    ],
    suggestedKit: {
      title: 'Imperial Grand Drawing Room Setup',
      description: 'Berger High Gloss Enamel Gallon + Gold Metallic Spray + D4 Hardwood Bond',
      items: [
        {
          productId: 'prod-1',
          variantName: '3.64L Gallon – CNG Royal Green',
          productTitle: 'Berger Robbialac Super Gloss Synthetic Enamel',
          unitPrice: 1700,
          quantity: 1,
          image: '/products/2412.jpg',
          unit: 'Volume & Color',
          maxStock: 20,
        },
        {
          productId: 'prod-2',
          variantName: '500 gm Bottle',
          productTitle: 'Fevicol 1K PUR Polyurethane Waterproof Adhesive',
          unitPrice: 744,
          quantity: 1,
          image: '/products/2413.jpg',
          unit: 'Weight (gm / kg)',
          maxStock: 40,
        },
      ],
      estimatedCost: 2444,
    },
    contractorTip: 'Pair deep dark shades with crisp warm lighting to accentuate the 88+ GU mirror gloss reflection.',
  },

  industrial: {
    id: 'industrial',
    name: 'Industrial Toughness & Security',
    tagline: 'Hardened boron steel, moisture-curing polyurethane & heavy anti-corrosion armor',
    emoji: '🛡️',
    auraGradient: 'from-slate-600/30 via-red-600/15 to-slate-950',
    accentColor: '#94a3b8',
    themeClass: 'mood-industrial',
    quote: 'Uncompromising tensile strength engineered to resist extreme friction and weather.',
    idealFor: 'Shop Shutters, Commercial Gates, Hardwood Door Frames, Factory Machinery',
    keywords: ['strong', 'heavy', 'steel', 'shutter', 'lock', 'glue', 'pur', 'industrial', 'hardware', 'iron'],
    colorPalette: [
      { name: 'Anti-Rust Charcoal Primer', hex: '#334155', code: 'IND-902-CHR', description: 'Chemical resistant anti-corrosion coat' },
      { name: 'Hardened Steel Boron', hex: '#64748b', code: 'IND-701-STL', description: 'Heavy metal armor sheen' },
      { name: 'Signal Safety Amber', hex: '#f59e0b', code: 'IND-303-SAF', description: 'High contrast industrial warning' },
    ],
    suggestedKit: {
      title: 'Superstore Security & Heavy Bond Fortress Kit',
      description: 'HMBR 60mm Heavy Armour Lock + Fevicol 1K PUR 500gm + 100mm Pro Brush',
      items: [
        {
          productId: 'prod-4',
          variantName: '60 mm Heavy Armour Lock',
          productTitle: 'HMBR Heavy Duty Stainless Steel Padlock Series',
          unitPrice: 650,
          quantity: 2,
          image: '/products/2415.jpg',
          unit: 'Perimeter / Width (mm)',
          maxStock: 10,
        },
        {
          productId: 'prod-2',
          variantName: '500 gm Bottle',
          productTitle: 'Fevicol 1K PUR Polyurethane Waterproof Adhesive',
          unitPrice: 744,
          quantity: 1,
          image: '/products/2413.jpg',
          unit: 'Weight (gm / kg)',
          maxStock: 40,
        },
        {
          productId: 'prod-6',
          variantName: '100 mm (4 Inch) Brush',
          productTitle: 'Professional Industrial Paint Brush Series (White Bristle)',
          unitPrice: 160,
          quantity: 1,
          image: '/products/2417.jpg',
          unit: 'Width (mm / Inch)',
          maxStock: 25,
        },
      ],
      estimatedCost: 2204,
    },
    contractorTip: 'For maximum D4 bond strength on wood and metal, ensure surfaces are free of grease and lightly misted with moisture before clamping.',
  },

  monsoon: {
    id: 'monsoon',
    name: 'Monsoon Armor & Weatherproof',
    tagline: 'Extreme waterproofing, anti-fungal exterior shields & moisture-curing sealants',
    emoji: '🌧️',
    auraGradient: 'from-cyan-600/25 via-emerald-600/15 to-slate-950',
    accentColor: '#22d3ee',
    themeClass: 'mood-monsoon',
    quote: 'Defend your architectural foundation against torrential Kishoreganj monsoon rains.',
    idealFor: 'Rooftops, Exterior Boundary Walls, Window Sills, Bathrooms, Wooden Gates',
    keywords: ['rain', 'water', 'waterproof', 'roof', 'damp', 'leak', 'weather', 'monsoon', 'balcony', 'exterior'],
    colorPalette: [
      { name: 'WeatherCoat Storm Grey', hex: '#475569', code: 'WC-908-STM', description: 'Rain & UV resistant exterior shield' },
      { name: 'Aqua Tropical Green', hex: '#059669', code: 'AQ-204-TRP', description: 'Anti-algae protective pigment' },
      { name: 'Reflective Solar White', hex: '#f1f5f9', code: 'WC-101-SLR', description: 'Heat reflective & damp repellent' },
    ],
    suggestedKit: {
      title: 'Pakundia Monsoon Waterproofing Defense Kit',
      description: 'Berger Enamel Gallon + Fevicol 1K PUR D4 Adhesive + Aqua Marine Can',
      items: [
        {
          productId: 'prod-1',
          variantName: '3.64L Gallon – CNG Royal Green',
          productTitle: 'Berger Robbialac Super Gloss Synthetic Enamel',
          unitPrice: 1700,
          quantity: 1,
          image: '/products/2412.jpg',
          unit: 'Volume & Color',
          maxStock: 20,
        },
        {
          productId: 'prod-2',
          variantName: '500 gm Bottle',
          productTitle: 'Fevicol 1K PUR Polyurethane Waterproof Adhesive',
          unitPrice: 744,
          quantity: 1,
          image: '/products/2413.jpg',
          unit: 'Weight (gm / kg)',
          maxStock: 40,
        },
      ],
      estimatedCost: 2444,
    },
    contractorTip: 'Always scrape existing fungus and apply silicon damp-seal primer on dry sunny morning before applying the final weatherproof coat.',
  },

  heritage: {
    id: 'heritage',
    name: 'Bangladeshi Heritage & Earthy Warmth',
    tagline: 'Warm terracotta, teak wood gloss & nostalgic rustic charm of rural Bengal',
    emoji: '🏡',
    auraGradient: 'from-amber-700/25 via-yellow-600/15 to-slate-950',
    accentColor: '#fb923c',
    themeClass: 'mood-heritage',
    quote: 'Rooted in the golden soil and timeless artisan woodworking spirit of Bengal.',
    idealFor: 'Verandahs, Teak Hardwood Furniture, Clay Roof Borders, Traditional Village Homes',
    keywords: ['terracotta', 'clay', 'traditional', 'wood', 'warm', 'village', 'heritage', 'rustic', 'bengal'],
    colorPalette: [
      { name: 'Bengal Terracotta Red', hex: '#9a3412', code: 'HRT-601-TER', description: 'Earthy baked clay warmth' },
      { name: 'Pakundia Harvest Amber', hex: '#d97706', code: 'HRT-318-GLD', description: 'Golden mustard fields tone' },
      { name: 'Burma Teak Wood Brown', hex: '#78350f', code: 'HRT-802-TEK', description: 'Rich natural hardwood finish' },
    ],
    suggestedKit: {
      title: 'Traditional Teak Hardwood & Verandah Kit',
      description: 'Fevicol 1K PUR Adhesive + 0.91L Robbialac Gold + 50mm Hog Bristle',
      items: [
        {
          productId: 'prod-2',
          variantName: '500 gm Bottle',
          productTitle: 'Fevicol 1K PUR Polyurethane Waterproof Adhesive',
          unitPrice: 744,
          quantity: 1,
          image: '/products/2413.jpg',
          unit: 'Weight (gm / kg)',
          maxStock: 40,
        },
        {
          productId: 'prod-1',
          variantName: '0.91L Tin – CNG Royal Green',
          productTitle: 'Berger Robbialac Super Gloss Synthetic Enamel',
          unitPrice: 450,
          quantity: 2,
          image: '/products/2412.jpg',
          unit: 'Volume & Color',
          maxStock: 35,
        },
        {
          productId: 'prod-6',
          variantName: '50 mm (2 Inch) Brush',
          productTitle: 'Professional Industrial Paint Brush Series (White Bristle)',
          unitPrice: 90,
          quantity: 2,
          image: '/products/2417.jpg',
          unit: 'Width (mm / Inch)',
          maxStock: 35,
        },
      ],
      estimatedCost: 1824,
    },
    contractorTip: 'Rub wood with 120-grit sandpaper along the grain, wipe clean with thinner, then apply 2 coats of PU adhesive and varnish for deep grain depth.',
  },
};

/**
 * Intelligent Natural Language Matcher:
 * Infers the closest customer mood from freeform natural language text input
 */
export function analyzeCustomerIntent(prompt: string): MoodProfile {
  const lower = prompt.toLowerCase();

  let highestScore = 0;
  let bestMood: MoodProfile = customerMoods.serene;

  Object.values(customerMoods).forEach((mood) => {
    let score = 0;
    mood.keywords.forEach((kw) => {
      if (lower.includes(kw)) score += 2;
    });

    if (score > highestScore) {
      highestScore = score;
      bestMood = mood;
    }
  });

  return bestMood;
}
